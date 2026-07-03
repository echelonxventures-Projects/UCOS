# EXT-001 — Unbounded Extensibility Review (PHASE UA-07)

| Field | Value |
|-------|-------|
| Artifact ID | `EXT-001` |
| Phase | **PHASE UA-07 — Unbounded Extensibility Review** |
| Scope | Determine whether any fabric contains a **practical ceiling** on extensibility |
| Axes reviewed | Namespace · Registry · Authority · Federation · Ontology · Knowledge · Memory · Evolution |
| Method | Direct source inspection of `packages/platform-runtime/src/**` (substrate + control + federation + ontology + knowledge + memory + evolution) |
| **Output** | **UNBOUNDED** |
| Verdict qualifier | No fabric imposes an extensibility (capacity) ceiling. The only numeric limits found are deliberate **velocity / safety / security** controls (governed bounds), not capacity ceilings. Two by-design boundaries are documented as intentional, not defects. |

---

## 1. Claim under test

> Some fabric in UCOS contains a **practical ceiling** — a fixed, non-configurable structural
> limit that caps how far the system can be extended (identifiers, records, authorities, nodes,
> ontology, knowledge, memory, or evolutions).

**Result: NOT SUBSTANTIATED.** Every extensibility dimension is architecturally unbounded. What
exists instead is a small set of *deliberate governed bounds* on **rate, concurrency, recursion,
and trust** — none of which cap cumulative extent.

---

## 2. Per-axis findings

### 2.1 Namespace — UNBOUNDED
- Namespaces are **string-based hierarchical keyspaces** under reserved roots
  (`knowledge:`, `memory:`, `ontology:`, `federation:`, `ontology:federation:`).
  Evidence: `control/knowledge/knowledge-namespace.ts`, `control/memory/memory-namespace.ts`,
  `control/ontology/ontology-namespace.ts`.
- Federated identifiers compose without bound: `namespacedId(nodeId, localId) => "nodeId::localId"`.
- **No fixed-width encoding, no enumerated namespace table, no slot allocation.** The only limit is
  string length (host memory).
- Namespace isolation (`nsTail`, `federation:<nodeId>:*`) is a **collision-avoidance / sovereignty**
  mechanism, not a count ceiling.

### 2.2 Registry — UNBOUNDED
- `InMemoryRegistry` (`registry-runtime/registry.ts`) is backed by `Map<string, RegistryRecord>` +
  `Map<string, Set<SemVer>>`. Knowledge/ontology/memory registries are metadata-record-based via
  `MetadataPort` prefix queries. **No cap on record or version count.**
- Versioning is SemVer (`meta-core/semver.ts`) — unbounded version space.
- The store is **pluggable behind `RegistryPort`**: "persistence can be added without kernel change."
- The single operational bound is per-node heap; it is **escaped horizontally by federation**
  (unbounded node count) and vertically by pluggable persistent adapters. This is an *adapter
  property*, not an *architectural ceiling*.

### 2.3 Authority — UNBOUNDED
- Identities are metadata records: *"No identity is hardcoded"* (`control/identity/identity-registry.ts`).
  Unbounded identity/provider count; pluggable federated providers.
- Federation authorities are metadata records with an **enumerated allow-list of powers**
  (`control/federation/federation-authority.ts`). The enumeration is a **deny-by-default / no-implicit-
  powers security control** (closes T8 authority escalation) — it does not cap how many authorities
  exist, and the power vocabulary is itself extensible via the Evolution Fabric.
- `chainMaxDepth` (`federation/types.ts`) is a **per-authority configurable field**, not a global
  constant. Trust-delegation `depth` defaults to `0` (non-transitive) and is configurable per grant
  (`federation/trust-delegation.ts`); `maxLevel` is a per-grant policy value.

### 2.4 Federation — UNBOUNDED
- Nodes, memberships, boundaries, and authorities are all metadata records — **unbounded membership**.
- Trust **clamping** and the classification **ceiling** (`maxClassificationLevel`,
  `memory-federation-guard.ts`) are per-boundary **security policies** (deliberate; S4), not caps on
  node/boundary count.
- Horizontal scale is the explicit escape hatch for any single-node memory bound.

### 2.5 Ontology — UNBOUNDED
- Records are metadata-backed under `ontology:*`; the graph is a **pure projection**
  (`ontology/ontology-graph.ts`) with highest-version dedupe.
- Taxonomy must be a **DAG (acyclic, SI-3)** — this is a **semantic-integrity correctness invariant**,
  not a size ceiling. Entity/relationship/taxonomy/constraint counts are unbounded.

### 2.6 Knowledge — UNBOUNDED
- Records metadata-backed under `knowledge:*`; SemVer versioning; string namespaces. No count cap.

### 2.7 Memory — UNBOUNDED (by default)
- Six governed tiers, all metadata-backed. The **only explicit capacity control** is
  `MemoryCapacityPolicy` (`control/memory/memory-capacity.ts`), which is:
  - **opt-in**, and **unset ⇒ unbounded** (default behaviour preserved);
  - restricted to the **volatile** tiers only (`working`, `short-term`);
  - a resource-flooding guard (threat M12), not a default ceiling.
- Durable tiers (long-term / semantic / episodic / federated) are **unbounded**.

### 2.8 Evolution — UNBOUNDED extent, GOVERNED velocity (deliberate)
- The Evolution Governor (`control/evolution/evolution-governor.ts`, `types.ts`) enforces:
  - `depth MUST be 0` — recursive / self-modifying evolution **structurally prohibited** (E11);
  - `maxInFlight = 1` — one transaction at a time (serialization, E11/E12);
  - sliding-window rate limits (`maxProposalsPerWindow: 20`, `maxAppliedPerWindow: 10`,
    `windowMs: 60_000`) — **configurable** loop protection (E12), "fail-closed".
- These bound **concurrency, rate, and recursion** — they do **not** bound the **total number of
  evolutions over time**. The proposal counter is monotonic/unbounded; the system can evolve
  indefinitely, one governed step at a time.
- `depth = 0` is a **deliberate safety invariant** explicitly distinct from the AD-0014-deferred Ω∞
  existential self-evolution — an intentional boundary, not an accidental ceiling.

---

## 3. Classification of every numeric limit found

| Limit | Location | Kind | Extensibility ceiling? |
|-------|----------|------|:----------------------:|
| `maxProposalsPerWindow` / `maxAppliedPerWindow` / `windowMs` | evolution-governor | Rate (loop protection, configurable) | **No** |
| `maxInFlight = 1` | evolution-governor | Concurrency (serialization) | **No** |
| `depth = 0` (evolution unit) | evolution-governor / evolution-unit | Recursion prohibition (safety; Ω∞ deferred) | **No** (deliberate boundary) |
| `MemoryCapacityPolicy.working / short-term` | memory-capacity | Opt-in volatile cap (default unbounded) | **No** |
| `maxClassificationLevel` (boundary) | memory-federation-guard | Security ceiling (S4, per-boundary policy) | **No** |
| trust `clampTrust` / `maxLevel` / `chainMaxDepth` | trust-delegation / federation | Per-grant/per-authority trust policy | **No** |
| Taxonomy acyclicity (SI-3 DAG) | ontology (semantic-constraint) | Correctness invariant | **No** |

**No fixed-width identifier encoding, enumerated capacity table, or slot-array allocation exists in
any fabric.** All identifier spaces, registries, and record stores are unbounded (`Map`/`Set` /
metadata-record based, string-keyed).

---

## 4. Honest caveats (by design, not defects)

1. **Per-node in-memory substrate.** The implemented adapters (`InMemoryRegistry`,
   `InMemoryMetadataStore`, `LayeredConfigurationStore`) live in a single process heap. This is an
   **operational** property of the reference adapters, **not** an architectural ceiling: (a) ports are
   pluggable to persistent stores without kernel change, and (b) federation already provides unbounded
   horizontal scale via `nodeId::localId`. A persistent/distributed adapter is *designed-for but not
   yet implemented*.
2. **Recursive self-evolution is prohibited (`depth = 0`).** This is the deliberate AD-0014 Ω∞
   boundary — the system's *cumulative* evolvability is unbounded, but it may not evolve *itself
   recursively*. Intentional deferral, not an accidental limit.

---

## 5. Determination

> **UNBOUNDED.**
>
> No fabric — Namespace, Registry, Authority, Federation, Ontology, Knowledge, Memory, or Evolution —
> contains a practical extensibility (capacity) ceiling. Every identifier space, registry, authority
> set, federation membership, ontology/knowledge/memory store, and evolution count is architecturally
> unbounded (string-keyspace + pluggable-port + metadata-record based, with federation for horizontal
> scale). The only numeric limits present are **deliberate governed controls on velocity (evolution
> rate), concurrency (single in-flight), recursion (Ω∞-deferred `depth=0`), volatile-memory flooding
> (opt-in, default unbounded), and federated trust/classification (per-boundary security policy)** —
> none of which cap cumulative extent.

---

## 6. Governance note

There is **no ratified UA-07 / EXT slot** on the program roadmap; consistent with the project's
handling of un-ratified phase numbering (e.g. Ω-01 OI-1), `EXT-001` is recorded here as a **governed
review artifact** for Authority Board disposition. It **modifies no** ratified fabric, frozen construct
(`UCOS-PEA-001..007`, Governance Baseline 1.0.0), the Article IX lock, or `INV-1..13`; it authorizes
nothing and releases no lock. Registration in `CTX-REG-001` / `PROJECT-STATE.md` is deferred to a
governed append if the Board adopts this review.
