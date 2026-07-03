# MEM-ARCH-001 — UCOS Memory Architecture Specification

| Field | Value |
|-------|-------|
| Artifact | **MEM-ARCH-001 — Memory Architecture Specification** |
| Workstream | FND-MEM-02 (PHASE 18 · PI-9.0 Memory Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | MEM-GOV-001/002; AD-0016 substrate seams; AD-0017 control plane; AD-0018 federation; AD-0019 evolution; AD-0020 knowledge |
| Realizes | The 6-tier memory architecture; async capture/consolidation; zero-core-dir-change proof |
| **Hard constraint** | **NO change to `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts`** |

> Defines how the six governed memory tiers (MEM-GOV-001 §2) are realized **entirely within the control
> layer** (`src/control/memory/*`), reusing the ratified substrate ports, the PI-4 control plane, the PI-6
> Evolution Fabric, the AD-0018 federation seams, and the AD-0020 Knowledge Fabric. Real memory
> capture/consolidation is workload-bound (async); the ratified synchronous decision path stays unchanged;
> the existing **185/185** tests remain valid. No implementation is authorized.

---

## 1. Architectural position

The Memory Fabric is a **control-layer fabric**, peer to Federation (AD-0018), Evolution (AD-0019), and
Knowledge (AD-0020), and layered above the PI-2/PI-3 substrate:

```
                     ┌──────────────────────── control layer (src/control/*) ────────────────────────┐
  request ─▶ ControlPlane (PI-4: authn → trust → policy → governance → kernel.execute)                │
                     │                                                                                 │
                     │   Memory Fabric (NEW src/control/memory/*)                                      │
                     │     capture · consolidate · index · recall · reconcile · retain · forget        │
                     │        │ durable mutation │ semantic↔knowledge │ federated recall │ audit        │
                     ▼        ▼                  ▼                    ▼                   ▼             │
             Knowledge (AD-0020)   Evolution Fabric (AD-0019)   Federation (AD-0018)   FederatedAuditLog │
                     └───────────────────────────────────────────────────────────────────────────────┘
                                                     │ (existing sync ports only)
                     ┌───────────────────────────────▼───────────────────────────────┐
                     │  Substrate (PROHIBITED core dirs — UNCHANGED)                   │
                     │  MetadataPort · RegistryPort · ConfigurationPort · MetaCoreKernel │
                     └─────────────────────────────────────────────────────────────────┘
```

- Memory records are **metadata-first**: every tier record is a value written through the existing
  `MetadataPort.put(key, value)` under the `memory:*` keyspace (MEM-GOV-001 §2).
- Memory **configuration** (retention classes, tier caps, reconciliation policy) is resolved through the
  existing `ConfigurationPort` layered store — no hardcoded policy (IP-04).
- Memory **capabilities** (recall/consolidate operations) are registered as governed capabilities through
  the existing `RegistryPort`/kernel and executed via the unchanged `kernel.execute` contract gate.

## 2. Tier realization (all in-data, all metadata-first)

| Tier | Key scheme | Store surface | Mutation path | Federation |
|------|-----------|---------------|---------------|:----------:|
| Working (WM) | `memory:working:<sessionRef>:<id>` | `MetadataPort` (ephemeral value + short TTL in-value) | direct (ephemeral, no evolution) | never (default) |
| Short-Term (STM) | `memory:short-term:<subjectRef>:<id>` | `MetadataPort` | Consolidation Authority; STM→LTM via Evolution | opt-in |
| Long-Term (LTM) | `memory:long-term:<subjectRef>:<version>` | `MetadataPort` | **Evolution Fabric** (proposed→ratified→active) | yes (classification-gated) |
| Semantic (SEM) | `memory:semantic:<id>:<version>` (+ `knowledgeRef`) | `MetadataPort` + Knowledge Fabric linkage | **Evolution Fabric** (+ knowledge co-ratification) | yes |
| Episodic (EPI) | `memory:episodic:<subjectRef>:<seq>` (append-only) | `MetadataPort` + `auditRef` into FederatedAuditLog | append-only; forget via Evolution | export-only |
| Federated (FED-MEM) | `federation:<nodeId>:memory:<tier>:<id>` | separate namespace; verified-before-stored | ingest via federation verifier; deny-only shadow | inbound |

- **Disjoint keyspaces** guarantee `query("memory:")` (local) never returns foreign memory, and each tier is
  independently addressable (mirrors FED-PROV-001 §4). Closes cross-tier/namespace leakage at the data layer.
- **Versioning** for LTM/SEM uses supersession (new `<version>`), never in-place edit (IP-14).

## 3. Modules (planned; control layer only)

Proposed `src/control/memory/*` module set (names indicative; realized only under a future PI-9 act):

| Module | Responsibility |
|--------|----------------|
| `memory-unit.ts` / `memory-record.ts` | Memory unit + versioned, provenance-bearing record construction |
| `memory-namespace.ts` | Reserved `memory:*` / `federation:*:memory:*` key scheme + disjointness guards |
| `memory-tier-registry.ts` | Metadata-backed tier registry (MEM-GOV-C1) |
| `memory-index.ts` | Record index by tier/subject/version (MEM-GOV-C2) |
| `working-memory.ts` / `short-term-memory.ts` | Ephemeral/bounded stores + size caps (M12) |
| `consolidation-engine.ts` | WM→STM→(propose)LTM + semantic consolidation (MEM-GOV-C4) |
| `recall-engine.ts` | Deny-by-default recall; local-first, federated-on-miss; classification-aware projection |
| `retention-engine.ts` | Retention classes, fail-closed expiry, legal-hold (MEM-GOV-C7) |
| `reconciliation-engine.ts` | Within-node + cross-node reconciliation (MEM-GOV-C12) |
| `memory-certification-authority.ts` / `memory-ratification-authority.ts` / `memory-revocation-authority.ts` | Signed, revocable authorities; SoD (C5/C6/C8) |
| `federated-memory-guard.ts` | Boundary/authority verification for inbound memory (reuse federation crypto) |
| `memory-lifecycle.ts` / `memory-state-machine.ts` | Guarded transition table + per-unit state (MEM-GOV-002 §1) |
| `memory-audit.ts` | Thin wrapper over `FederatedAuditLog` (AD-0018) for memory events |
| `memory-evolution-adapter.ts` | Builds evolution units targeting `memory:`/`knowledge:` (AD-0019) |
| `bootstrap.ts` / `index.ts` | Assembly + barrel export |

- **Reuse, not reinvent:** certification/ratification/revocation/audit reuse federation + evolution
  primitives; **no custom cryptography** (reuse `src/control/federation/assertions.ts`).

## 4. Async capture + sync recall pattern

Memory capture/consolidation is modeled as **async ingestion**, decoupled from the synchronous decision path
(identical pattern to FED-ARCH-001 §2, already ratified):

```
   execution/event ─▶ consolidation-engine.capture()  ─▶ classify + provenance + verify  ─▶ MetadataPort.put (sync)
                       (async)                             (async/CPU)                        materialized memory
                                                                                                     │
   recall request ────────────────────────────────────────────────────────────────────────────────▶│
                       recall-engine.recall()  ── SYNC ──  ControlPlane authorize (deny-by-default) reads
                       local `memory:*` (+ in-boundary federated shadows) via existing sync MetadataPort
```

- Network/async federated recall completes **before** the synchronous decision (or uses the already-async
  `ControlPlane.execute()` with a bounded, fail-closed timeout).
- The **decision/recall authorization path stays synchronous and unchanged** — the ratified PI-4 evaluator
  operates on local metadata exactly as today, which is why the 185 existing tests remain valid.
- Cached federated memory carries bounded staleness + hard expiry; expired ⇒ absent ⇒ deny (fail-closed).

## 5. Prohibited-core-dir impact statement

| Prohibited dir | Change required? | Why not |
|----------------|:----------------:|---------|
| `src/meta-core` | **No** | `kernel.execute` already async; recall reads via existing sync ports; provenance in `descriptor.metadata` |
| `src/registry-runtime` | **No** | Recall/consolidation capabilities register via existing `RegistryPort`; foreign memory held in the federated registry instance (FED-PROV-001) |
| `src/metadata-runtime` | **No** | All tier records use existing `put/get/query`; disjoint `memory:*` keys; validate-on-write already enforced |
| `src/configuration-runtime` | **No** | Retention/tier/reconciliation policy via existing layered `setLayer`/resolve |
| `src/contracts` | **No** | Provenance/classification carried in existing free-form `descriptor.metadata` and record values |

**All architecture is confined to `src/control/memory/*` (new modules) + reuse of AD-0018/0019/0020 control
modules. Zero prohibited-core-dir change — constraint satisfied.**

## 6. Backward-compatibility & non-regression

- No existing signature changes; memory is additive wiring in `createControlPlane` (optional
  `memoryFabric`, `retentionPolicy`, `auditSink: FederatedAuditLog`) with defaults that preserve current
  behavior.
- All **185** ratified tests exercise substrate/control/federation/evolution/knowledge paths and remain
  valid unchanged; new memory tests are additive under `test/`.

## 7. Traceability
- **Refines:** MEM-GOV-001/002; FED-ARCH-001 (async pattern); FED-PROV-001 (keying); AD-0016/0017/0018/0019/0020;
  IP-04/IP-14/IP-15.
- **Consumed by:** MEM-SEC-001, MEM-FED-001, MEM-AUD-001, MEM-READINESS-001, future PI-9 build.
- **Owner:** UCOS Authority Board (Architecture).

**END MEM-ARCH-001 — DESIGN · READY FOR RATIFICATION · ZERO PROHIBITED-CORE-DIR CHANGE · NO IMPLEMENTATION AUTHORIZED.**
