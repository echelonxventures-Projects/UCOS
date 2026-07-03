# B03 — UCOS Scale Proof Fabric (Construction Program)

## IMPLEMENTATION PROGRAM B03 — Scale Proof Fabric (Construction Planning Only)

| Field | Value |
|-------|-------|
| Artifact | **B03 — Scale Proof Fabric Construction Program** |
| Artifact ID | `B03-SCALE-PROOF-FABRIC-CONSTRUCTION-PROGRAM` |
| Program | **IMPLEMENTATION PROGRAM B03 — Scale Proof Fabric (SPF)** |
| Layer | ARCHITECTURE / PLATFORM (scale-remediation construction program — designs the fabric; builds nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **CONSTRUCTION PLANNING ONLY** — architecture, services, execution/storage/scaling models, benchmark framework, acceptance tests, and implementation backlog for horizontally scaling UCOS from 1 → 1,000,000 logical users. **No source code, no infrastructure, no benchmark execution, no technology/vendor/cloud selection, no governance invention, no lock release, no `git` mutation** (beyond this additive architecture `*.md`). Append-only. |
| Authoritative inputs | `CIV-STRESS-001` (breakpoints BP-1..BP-15; bottlenecks; §2 recorded capacity envelope), `packages/platform-runtime/` (PI-2/3 substrate, PI-4 control, PI-5 federation, PI-6 evolution, PI-7 knowledge), `UCOS-PEA-002` (PRD/PRS/PEX/PWF), `UCOS-PLAT-ADR-001..007` (technology selections), `UCOS-ASR-NFR-001` v1.0.1 (INV-1..13), `INV-CORE-001` (INV-CORE-01..14), AUTH-008/009/012, Constitution Art. IX/X/XII |
| Governance posture | Planning is not construction. `UCOS-CONSTRUCTION-BLOCKED` + Article IX generation lock remain **ACTIVE**. Every workstream is gated by a governed scoped-release authorization (a future `AD-00xx`, analogous to AD-0018/AD-0022). All construction is **additive** in a new `src/control/scale/*` subtree; the five prohibited substrate core dirs are untouched. |
| **Determination** | **SCALE PROOF FABRIC PROGRAM READY — DESIGN-COMPLETE — READY FOR AUTHORIZATION REVIEW.** The architecture, service catalog, execution/storage/scaling models, benchmark framework, per-tier acceptance tests, and construction backlog are complete and construction-ready **under governance**; construction of `src/control/scale/*` requires a separate Authority Board scoped Article IX release. |

> **Governing disclaimer.** This program **authorizes no construction, releases no lock, and enrolls no
> invariant.** It designs the remediation for the `CIV-STRESS-001` scale breakpoints up to **10⁶ logical
> users** — the tier band below the INV-5/INV-6 "WALL" (10⁹+) that the Authority Board **deferred under
> AD-0014**. It preserves INV-1..13, INV-CORE-01..14, non-waivable **S1/S3/S4**, deny-by-default authorization,
> and the **Evolution Fabric as the sole governed-commit path**. Where quantitative targets appear, they are
> **design objectives** for a future benchmark run, not measured results. `UCOS-CONSTRUCTION-BLOCKED` stands.

---

## 0. Numbering caveat (governance)

The label "B03" already denotes the ratified `B03-UCOS-MCF-CONSTRUCTION-ORCHESTRATION-MODEL`. Consistent with
the numbering-caveat pattern used by `CIV-STRESS-001` (§0) and `CIV-READINESS-001` (OI-1), this **IMPLEMENTATION
PROGRAM B03 — Scale Proof Fabric** is recorded under a **distinct filename** and does **not** supersede, alter,
or overwrite the MCF B03 orchestration model. It is a new scale-remediation construction program; the Authority
Board must assign its canonical roadmap position if it is advanced. No prior artifact is modified.

---

## 1. Scale requirement and tier ladder

### 1.1 Mandated support envelope

The SPF must let UCOS operate correctly and within bounded resource/latency budgets at each of the six mandated
logical-user tiers:

| Tier | Logical users | Order | Dominant new stressor (per `CIV-STRESS-001`) | Today's verdict |
|:----:|:-------------:|:-----:|-----------------------------------------------|:---------------:|
| L1 | 1 | 10⁰ | correctness / cold path | OK |
| L2 | 100 | 10² | concurrency onset; latent Evolution serialization | OK |
| L3 | 1,000 | 10³ | sustained concurrency; working-set growth onset | OK → STRAIN |
| L4 | 10,000 | 10⁴ | RAM-bound working set; unbounded audit/ledger growth | **STRAIN** |
| L5 | 100,000 | 10⁵ | durable + sharded persistence required; commit-path contention | **STRAIN → BREAK-onset** |
| L6 | 1,000,000 | 10⁶ | **first hard architectural BREAK** — BP-1/BP-2/BP-3 | **BREAK** |

**"Logical user"** = an attributable principal (human, service, workload, or agent per `UCOS-SEC-ARCH-001`) with
identity, tenant context, policy scope, and audit lineage. Scale is measured in **concurrent active logical
users** and **governed operations/second**, not registered rows alone.

### 1.2 Scope boundary (what SPF does and does not solve)

- **In scope (L1→L6, ≤10⁶):** BP-1 (durable/sharded substrate), BP-2 (partitioned Evolution commit), BP-3
  (tiered/durable memory + bounded audit), single-region horizontal scaling, distributed execution, queue
  fabric, capacity management, load testing, benchmark framework.
- **Out of scope (deferred):** BP-4/BP-6 (10⁹ single-SoR **WALL** — INV-5), BP-5/BP-10/BP-12/BP-14 (multi-terminal
  authority), BP-11/BP-13/BP-15 (planetary/interplanetary governance, INV-6). These are **invariant/authority
  decisions reserved to the Authority Board** and intersect the AD-0014-deferred existential scope. SPF is
  explicitly designed so that **INV-5 single-SoR and INV-6 deterministic decisions still hold within one
  region up to 10⁶** — it scales *throughput and durability*, not the invariant model.

---

## 2. Deliverable 1 — Architecture

### 2.1 Architectural stance

The Scale Proof Fabric is an **additive control-layer overlay** (`packages/platform-runtime/src/control/scale/*`)
that scales the **existing** substrate/control/federation fabrics **behind their existing ports** — it invents
no new source of truth and holds **no independent commit path** (all durable mutation continues to route through
the PI-6 Evolution Fabric). It follows the same pattern proven by PI-5 Federation: async-ingestion /
sync-decision, deny-by-default, fail-closed, reuse-not-reimplement.

### 2.2 Layered view

```
+---------------------------------------------------------------+
|  SPF-CTRL  Scale Control Plane (capacity, autoscale, admission)|   ← governed by PI-4 policy
+---------------------------------------------------------------+
|  SPF-EXEC  Distributed Execution Plane (workers, shard router) |   ← wraps Meta-Core execute (unchanged)
|  SPF-QUEUE Queue Fabric (ordered, idempotent, partitioned)     |   ← realizes PE-04 / PEV backbone
+---------------------------------------------------------------+
|  SPF-STORE Durable/Tiered/Sharded Store Adapters               |   ← behind RegistryPort/MetadataPort/
|            (Registry / Metadata / Configuration / Memory)      |     ConfigurationPort (UNCHANGED interfaces)
+---------------------------------------------------------------+
|  PI-2/3 Substrate · PI-4 Control · PI-5 Federation · PI-6      |   ← IMPLEMENTED, UNMODIFIED
|  Evolution · PI-7 Knowledge  (269/269 baseline)                |
+---------------------------------------------------------------+
```

### 2.3 Architectural principles (SPF-P)

| ID | Principle | Enforcement |
|----|-----------|-------------|
| SPF-P1 | **Additive, port-behind scaling** — scale by substituting durable/sharded adapters behind existing ports; never modify core dirs | Adapters implement `RegistryPort`/`MetadataPort`/`ConfigurationPort` verbatim |
| SPF-P2 | **Single-SoR preserved per region (INV-5)** — one logical source of truth per shard key within a region; no cross-region SoR split ≤10⁶ | Shard router is deterministic; no eventual-consistency on the commit path |
| SPF-P3 | **Deterministic decision preserved (INV-6)** — distribution changes *where* work runs, never *whether* a decision is reproducible | Decision path stays synchronous per operation; only I/O is parallelized |
| SPF-P4 | **Evolution-only commit (IP-14/AD-0019)** — SPF has no independent write/rollback path | All governed mutation proxied to the Evolution Fabric |
| SPF-P5 | **Deny-by-default admission** — overload sheds load by denying, never by silently degrading integrity | Admission control fail-closed under capacity exhaustion |
| SPF-P6 | **Bounded, tiered, compacted state** — no unbounded RAM/audit growth; retention + checkpoint eviction mandatory | Tiered store + audit checkpointing (remediates BP-3) |
| SPF-P7 | **Horizontal-first** — capacity added by adding stateless workers + shards, not by vertical scaling assumptions | Workers stateless; shards independently addressable |
| SPF-P8 | **Reuse-not-reimplement** — reuse PI-5 crypto/audit, PI-4 policy, PI-6 commit; no custom cryptography | Federation `assertions.ts` + `FederatedAuditLog` reused |
| SPF-P9 | **Non-waivable security at scale** — S1/S3/S4 enforced identically at 1 and 10⁶ users | Control Plane authz on every distributed hop |
| SPF-P10 | **Technology-neutral** — SPF specifies contracts (queue, shard, store) fulfilled by `UCOS-PLAT-ADR-001..007` selections; no new vendor lock | Adapter interfaces only; product binding is AD-0009 |

### 2.4 Breakpoint-to-architecture map

| Breakpoint (`CIV-STRESS-001`) | SPF plane that remediates it | Mechanism |
|-------------------------------|------------------------------|-----------|
| BP-1 (ARCH, 10⁶) in-memory single-process substrate | SPF-STORE | Durable + sharded adapters behind existing ports |
| BP-2 (GOV, 10⁶) single serialized Evolution commit path | SPF-QUEUE + partitioned commit intake | Per-shard ordered commit queues feeding the Evolution Fabric; per-partition ordering |
| BP-3 (MEM, 10⁴–10⁶) RAM-bound, unbounded audit | SPF-STORE (tiered) + audit checkpointing | Working/warm/cold tiers; audit compaction with signed checkpoints |
| GOV-BN-3 unpartitioned append-only ledger | SPF-QUEUE partition keys | Segment ordering per shard; global reconciliation off the hot path |
| KNOW-BN-1 single-node knowledge read hotspot | SPF-STORE read replicas | Read-replica routing for PI-7 query surface |

---

## 3. Deliverable 2 — Services

Each service is defined **Purpose · Responsibilities · Inputs · Outputs · Dependencies · Constraints**. All live
in `src/control/scale/*`; none holds a commit path; all are governed by the PI-4 Control Plane.

### SPF-SVC-01 — Shard Router
- **Purpose:** deterministically map a shard key (tenant/principal/artifact namespace) to a store shard.
- **Responsibilities:** stable hashing; shard membership; rebalancing plan generation (execution is Evolution-gated).
- **Inputs:** shard key, shard topology (from Configuration runtime).
- **Outputs:** target shard handle.
- **Dependencies:** SPF-STORE adapters, Configuration runtime.
- **Constraints:** deterministic (INV-6); no cross-shard SoR for a given key (INV-5); rebalancing is a governed op.

### SPF-SVC-02 — Durable/Tiered Store Adapters
- **Purpose:** implement `RegistryPort`/`MetadataPort`/`ConfigurationPort` (and a memory tier) over durable, sharded, replicated storage.
- **Responsibilities:** persist/read/replicate; tier promotion/demotion (working→warm→cold); snapshot/replay.
- **Inputs:** port calls from Meta-Core/control (unchanged callers).
- **Outputs:** durable, recoverable records; read replicas.
- **Dependencies:** storage contract per `UCOS-PLAT-ADR-002` (PostgreSQL SoR + object + search + cache).
- **Constraints:** append-only + tamper-evident; replay-from-empty equivalence; classification-preserving (S4).

### SPF-SVC-03 — Queue Fabric
- **Purpose:** ordered, idempotent, partitioned work/commit/event transport (realizes PE-04 eventing per `UCOS-PLAT-ADR-003`).
- **Responsibilities:** enqueue/dequeue; per-partition ordering; exactly-once effect via idempotency keys; dead-letter + retry; backpressure signalling.
- **Inputs:** work items, commit intents, platform events (`PEV-*`).
- **Outputs:** ordered partitioned streams; delivery receipts.
- **Dependencies:** PI-5 audit (`FederatedAuditLog`), PI-6 Evolution (commit intents), SPF-SVC-04.
- **Constraints:** ordering per partition key; idempotent (contract-typed); fail-closed on partition loss; no reordering across the commit boundary.

### SPF-SVC-04 — Distributed Execution Coordinator
- **Purpose:** distribute governed capability invocations across a stateless worker pool while preserving per-operation determinism.
- **Responsibilities:** work assignment; worker lease/heartbeat; result aggregation; idempotency dedup; failure re-dispatch.
- **Inputs:** authorized execution requests (post PI-4 authorize).
- **Outputs:** execution results, per-op audit entries.
- **Dependencies:** Meta-Core `kernel.execute` (unchanged), SPF-SVC-03, Control Plane.
- **Constraints:** decision path stays synchronous per op (INV-6); workers stateless (SPF-P7); every hop authz-checked (S1).

### SPF-SVC-05 — Capacity Manager
- **Purpose:** measure load, forecast capacity, and generate scaling plans per tier.
- **Responsibilities:** collect utilization (queue depth, worker saturation, shard hotness, tier pressure); compute headroom; emit scale-out/scale-in plans; enforce SLO budgets.
- **Inputs:** telemetry from all SPF planes.
- **Outputs:** capacity reports; scaling plan proposals (execution is governed).
- **Dependencies:** SPF-SVC-06, Configuration runtime.
- **Constraints:** proposes-not-acts for topology changes (Evolution/AD-0009 gated); SLO breach → admission tightening.

### SPF-SVC-06 — Admission Controller
- **Purpose:** protect integrity under overload by deny-by-default load shedding.
- **Responsibilities:** rate/quota enforcement per tenant/tier; priority lanes; graceful rejection with typed backpressure codes.
- **Inputs:** capacity signals, request stream.
- **Outputs:** admit/deny decisions.
- **Dependencies:** SPF-SVC-05, Control Plane (policy).
- **Constraints:** never sheds by weakening authz/audit; deny is auditable (SPF-P5).

### SPF-SVC-07 — Load Generator (test-only)
- **Purpose:** synthesize L1→L6 logical-user workloads for benchmarking and acceptance.
- **Responsibilities:** model principals/tenants/op-mix; ramp/soak/spike profiles; deterministic seeds for reproducibility.
- **Inputs:** tier profile, op-mix spec.
- **Outputs:** load streams; generation manifests.
- **Dependencies:** SPF-SVC-08.
- **Constraints:** test-only (never on a governed production path); non-prod environments only (per AD-0015 evidence-authorization pattern).

### SPF-SVC-08 — Benchmark Harness
- **Purpose:** execute governed benchmark runs and capture reproducible evidence.
- **Responsibilities:** run orchestration; metric capture (latency percentiles, throughput, error/deny rates, resource use); result signing; report generation.
- **Inputs:** benchmark plan, load manifests.
- **Outputs:** signed benchmark evidence (`SPF-BENCH-*`), pass/fail against §7 targets.
- **Dependencies:** SPF-SVC-07, PI-5 audit for signed evidence.
- **Constraints:** measures; authorizes nothing; evidence is append-only and independently verifiable.

---

## 4. Deliverable 3 — Execution model

### 4.1 Governed distributed-execution flow

```
request
  → Admission Controller (SPF-SVC-06: admit/deny)                      [deny-by-default]
  → Control Plane authenticate → trust → policy (PI-4, UNCHANGED)      [S1 deny-by-default authz]
  → Distributed Execution Coordinator (SPF-SVC-04)
       → Shard Router (SPF-SVC-01: resolve shard key)
       → Queue Fabric (SPF-SVC-03: partitioned, ordered, idempotent)
       → stateless Worker → Meta-Core kernel.execute (UNCHANGED, synchronous, deterministic)
  → (governed mutation?) → commit intent → Queue → Evolution Fabric (PI-6, SOLE commit path)
  → append-only audit entry (PI-5 FederatedAuditLog / hash-chained)
  → result
```

### 4.2 Execution invariants (extend PI-4 §PEX EX1..EX7)

| ID | Invariant | How SPF preserves it under distribution |
|----|-----------|------------------------------------------|
| SPF-EX1 | **Determinism (INV-6)** | Only I/O and dispatch are parallel; the decision function per op is unchanged and reproducible from recorded inputs. |
| SPF-EX2 | **Idempotency** | Every distributed work item carries an idempotency key; the coordinator + queue dedup exactly-once effect. |
| SPF-EX3 | **Single-writer per shard key (INV-5)** | The shard router guarantees one authoritative shard per key within the region; no split-brain writes ≤10⁶. |
| SPF-EX4 | **Auditability (S6)** | Each distributed hop emits a hash-chained audit entry; the chain reconciles across workers. |
| SPF-EX5 | **Bounded failure** | Worker/lease failure re-dispatches idempotently; poison items dead-letter; no partial governed commit. |
| SPF-EX6 | **Governed recovery** | Recovery is replay from the durable store + Evolution ledger; no ad-hoc mutation. |
| SPF-EX7 | **Authz on every hop (S1)** | Cross-worker and cross-shard calls re-verify authorization; distribution never widens trust. |

### 4.3 Concurrency and ordering

- **Commit ordering:** total order **per shard/partition key** (sufficient for INV-5 at ≤10⁶), not a single
  global lock — this removes the BP-2 serialization while keeping per-key single-SoR.
- **Read scaling:** read replicas for PI-7 knowledge and metadata reads (KNOW-BN-1); reads are
  causally consistent within a shard.
- **Backpressure:** queue depth + worker saturation propagate to the Admission Controller (SPF-P5).

---

## 5. Deliverable 4 — Storage model

### 5.1 Tiered, sharded, durable store (remediates BP-1 / BP-3)

| Tier | Purpose | Residency | Eviction/retention |
|------|---------|-----------|--------------------|
| **Working (hot)** | active logical-user working set | in-memory cache (bounded) | LRU + TTL; size-capped (no unbounded RAM — BP-3) |
| **Warm (durable)** | authoritative records (registry/metadata/config/memory) | durable SoR (PostgreSQL per `UCOS-PLAT-ADR-002`) | governed retention class (per record) |
| **Cold (archival)** | audit/ledger history, snapshots | object store | signed checkpoints; compaction with proof |
| **Search/Index** | knowledge/metadata query surface | search engine + read replicas | rebuildable from SoR (derived, not authoritative) |

### 5.2 Sharding model

- **Shard key:** tenant-scoped namespace (default) → `tenant:<id>`; falls back to artifact namespace for
  cross-tenant platform records. Deterministic stable hashing (SPF-SVC-01).
- **Shard count:** capacity-driven; scaling out = adding shards + a **governed** rebalance plan (Evolution-gated,
  never a silent live move).
- **Replication:** per-shard replica set for read scaling + durability; single authoritative writer per shard
  (SPF-EX3, INV-5).
- **Recovery:** every record recoverable by **replay-from-empty** equivalence (inherits the F-STO/AC-5 property);
  snapshots accelerate cold start.

### 5.3 Audit & ledger at scale

- Reuse PI-5 `FederatedAuditLog` (hash-chained, tamper-evident) with **partitioned segments** + **signed
  checkpoints**; cold segments archived to the object tier. This bounds the previously unbounded audit growth
  (MEM-BN-3 / GOV-BN-3) without breaking append-only integrity (INV-CORE-02).
- Evolution ledger intake is **partitioned per shard** (BP-2), preserving per-key total order while removing the
  global serialization bottleneck.

### 5.4 Port fidelity (non-negotiable)

The store adapters implement `RegistryPort`, `MetadataPort`, `ConfigurationPort` (and the PI-9 memory port when
authorized) **byte-for-byte** — no signature change. This keeps Meta-Core and the control fabrics **unmodified**
and the 269/269 baseline green (additive-only, SPF-P1).

---

## 6. Deliverable 5 — Scaling model

### 6.1 Horizontal scaling strategy per tier

| Tier | Workers | Shards | Store tier active | Queue partitions | Notes |
|:----:|:-------:|:------:|-------------------|:----------------:|-------|
| L1 (1) | 1 | 1 | working+warm | 1 | dev/single-node; in-memory adapters acceptable |
| L2 (100) | 1–2 | 1 | working+warm | 1–2 | concurrency onset; no topology change |
| L3 (1,000) | 2–4 | 1–2 | working+warm | 2–4 | durable warm tier engaged |
| L4 (10,000) | 4–8 | 2–4 | +cold + checkpointing | 4–8 | audit compaction on; RAM cap enforced |
| L5 (100,000) | 8–32 | 4–16 | full tiering + replicas | 16–32 | read replicas for knowledge/metadata |
| L6 (1,000,000) | 32–128 | 16–64 | full tiering + replicas + archival | 32–128 | partitioned Evolution commit; capacity autoscale |

(Counts are **design planning ranges** to size the benchmark plan, not vendor commitments; actual bindings are
`UCOS-PLAT-ADR-*` + AD-0009.)

### 6.2 Capacity management

- **Signals:** queue depth, worker saturation %, shard hotness (ops/key/s), tier pressure (hot-cache miss rate,
  warm IOPS), audit-segment growth, SLO burn rate.
- **Control loop:** Capacity Manager (SPF-SVC-05) computes headroom → proposes scale-out/scale-in →
  **governed execution** (topology changes are Evolution/AD-0009 gated) → Admission Controller tightens/loosens
  quotas in real time (this part is allowed on the hot path since it only denies, never mutates state).
- **Elasticity:** stateless workers scale freely; shards scale via governed rebalance; stores scale via replicas.

### 6.3 Invariant-preservation ceiling

SPF holds INV-5 and INV-6 valid **within a single region up to 10⁶** by keeping single-writer-per-shard-key and
per-op deterministic decisions. It **does not** attempt the 10⁹ single-SoR WALL (BP-4/BP-6) or multi-terminal
authority (BP-5/BP-10+) — those require Authority-Board invariant deliberation (INV-17/INV-18) deferred under
AD-0014 and are explicitly **out of this program's scope** (§1.2).

---

## 7. Deliverable 6 — Benchmarks (framework)

### 7.1 Benchmark framework structure

- **Load profiles:** `ramp` (linear to target), `soak` (steady at target for T), `spike` (step to target),
  `burst` (short overload to test admission).
- **Op-mix:** governed-read / governed-write (Evolution commit) / knowledge-query / policy-decision, weighted per
  profile.
- **Reproducibility:** deterministic seeds; pinned topology; signed run manifests (SPF-SVC-08).
- **Metrics captured:** p50/p95/p99/p999 latency, throughput (governed ops/s), error rate, **deny rate**
  (admission), resource utilization, audit-chain integrity, replay-equivalence check.

### 7.2 Per-tier target envelope (design objectives, to be measured — not results)

| Tier | Target sustained throughput | p99 governed-read | p99 governed-write (commit) | Integrity |
|:----:|-----------------------------|:-----------------:|:---------------------------:|-----------|
| L1 | ≥ baseline single-op | < 5 ms | < 25 ms | 100% replay-equivalent |
| L2 | ≥ 1k gov-ops/s | < 10 ms | < 50 ms | 100% |
| L3 | ≥ 5k gov-ops/s | < 15 ms | < 75 ms | 100% |
| L4 | ≥ 20k gov-ops/s | < 25 ms | < 100 ms | 100%; bounded RAM/audit |
| L5 | ≥ 75k gov-ops/s | < 40 ms | < 150 ms | 100%; replicas consistent |
| L6 | ≥ 200k+ gov-ops/s | < 75 ms | < 250 ms | 100%; partitioned commit ordered |

> Read-side ceilings are anchored to the recorded single-process figures in `CIV-STRESS-001` §2 (registry
> resolve ~1.34M/s, execute ~525k/s, metadata put ~4.6M/s); write/commit ceilings are governed by the
> Evolution commit path and set the binding SLO. Targets are **design objectives** to validate the scaling model,
> not measured outcomes; actual figures are produced only by an authorized, human-run benchmark (AD-0015 pattern).

### 7.3 Anti-optimism discipline

Absence of a measured result = **FAIL** for that tier (mirrors `OP-CERT-001` evidence discipline). No tier is
declared "proved" without a signed `SPF-BENCH-*` evidence artifact from a real run.

---

## 8. Deliverable 7 — Acceptance tests

Each tier has a binding acceptance gate. Pass requires **all** criteria; any miss = tier not certified.

| ID | Tier | Acceptance criteria (pass/fail) |
|----|:----:|---------------------------------|
| SPF-AT-L1 | 1 | Single logical user completes governed read+write+query; replay-from-empty reproduces state; audit chain verifies. |
| SPF-AT-L2 | 100 | 100 concurrent principals; 0 authz bypass; 0 lost/duplicated governed commits (idempotency); p99 within §7.2. |
| SPF-AT-L3 | 1,000 | Durable warm tier authoritative; kill-a-worker mid-run → 0 partial commits, idempotent re-dispatch; SLO met. |
| SPF-AT-L4 | 10,000 | RAM stays within cap during soak (no unbounded growth — BP-3); audit compaction produces verifiable signed checkpoints; SLO met. |
| SPF-AT-L5 | 100,000 | Add a shard mid-run via governed rebalance with 0 data loss and continuous single-writer-per-key (INV-5); read replicas causally consistent; SLO met. |
| SPF-AT-L6 | 1,000,000 | Partitioned Evolution commit sustains target write throughput with per-key total order preserved (BP-2 resolved); admission sheds burst load by **deny** (never by integrity loss); full-tier replay-equivalence holds; SLO met. |
| SPF-AT-SEC | all | S1/S3/S4 enforced identically at every tier; deny-by-default holds under overload; secrets by-reference only; 0 custom crypto. |
| SPF-AT-ADD | all | 0 modification of the five prohibited substrate core dirs; existing 269/269 baseline remains green; SPF confined to `src/control/scale/*` + 1 additive re-export. |
| SPF-AT-GOV | all | No governed mutation bypasses the Evolution Fabric; every topology change is Evolution/AD-0009 gated; every benchmark run yields signed, append-only evidence. |

---

## 9. Deliverable 8 — Implementation backlog

### 9.1 Work packages (construction; each additive under `src/control/scale/*`)

| WP | Scope | Deliverables | Depends on | Acceptance |
|----|-------|--------------|:----------:|------------|
| SPF-WP-01 | **Store adapter interface + in-memory reference** | tiered-store adapter implementing existing ports; tier model; replay-equivalence tests | — | SPF-AT-L1; SPF-AT-ADD |
| SPF-WP-02 | **Durable/warm + cold tier adapters** | durable SoR adapter (ADR-002 contract), object-tier archival, snapshot/replay | SPF-WP-01 | SPF-AT-L3; SPF-AT-L4 |
| SPF-WP-03 | **Shard router** | deterministic stable hashing; shard membership; governed rebalance plan | SPF-WP-01 | SPF-AT-L5 (single-writer) |
| SPF-WP-04 | **Queue fabric** | partitioned ordered idempotent transport; DLQ/retry; backpressure | SPF-WP-01 | SPF-AT-L2 (idempotency) |
| SPF-WP-05 | **Distributed execution coordinator + worker pool** | stateless workers; lease/heartbeat; dedup; re-dispatch | SPF-WP-04 | SPF-AT-L3 (kill-a-worker) |
| SPF-WP-06 | **Partitioned Evolution commit intake** | per-shard commit queues feeding PI-6; per-key total order | SPF-WP-04 | SPF-AT-L6 (BP-2) |
| SPF-WP-07 | **Audit scaling** | segmented hash-chain + signed checkpoints + archival | SPF-WP-02 | SPF-AT-L4 (bounded audit) |
| SPF-WP-08 | **Capacity manager + admission controller** | telemetry, headroom, scaling plans, deny-by-default shedding | SPF-WP-05 | SPF-AT-L6 (deny under burst) |
| SPF-WP-09 | **Read-replica routing** | knowledge/metadata read replicas; causal consistency | SPF-WP-02 | SPF-AT-L5 (replicas) |
| SPF-WP-10 | **Load generator + benchmark harness** | tier profiles; signed evidence; §7 targets; §8 gates | SPF-WP-08 | SPF-AT-L1..L6; SPF-AT-GOV |
| SPF-WP-11 | **Adversarial + integrity suite** | overload, split-brain-attempt, poison-item, replay, authz-on-every-hop | SPF-WP-06, SPF-WP-08 | SPF-AT-SEC; SPF-AT-GOV |

### 9.2 Build waves (additive; 269/269 baseline green at every wave gate)

| Wave | Work packages | Exit gate |
|:----:|---------------|-----------|
| W0 | SPF-WP-01 | ports fulfilled; baseline green; 0 core-dir change |
| W1 | SPF-WP-02, SPF-WP-04, SPF-WP-07 | durable+queue+audit at L3/L4; bounded state |
| W2 | SPF-WP-03, SPF-WP-05, SPF-WP-09 | sharded distributed execution + replicas at L5 |
| W3 | SPF-WP-06, SPF-WP-08 | partitioned commit + capacity/admission at L6 |
| W4 | SPF-WP-10, SPF-WP-11 | benchmark evidence L1→L6 + adversarial pass; signed `SPF-BENCH-*` |

### 9.3 Construction gates (derived from existing governance — none new)

`GATE-QUAL-001` (tests/coverage; baseline green) · `GATE-SEC-001` (S1/S3/S4; adversarial) · `GATE-DOC-001`
(traceability) · **Additive gate** (0 prohibited-core-dir change) · **Evolution-only gate** (no independent
commit path) · **Authorization gate** (each wave proceeds only under the scoped Article IX release AD).

### 9.4 Milestones

- **M0 — Authorization:** Authority Board scoped Article IX release for `src/control/scale/*` (a future `AD-00xx`).
- **M1 — Durable substrate (BP-1):** W0+W1 complete; UCOS runs on durable/tiered store at L4.
- **M2 — Distributed + sharded (L5):** W2 complete; horizontal scaling proven to 10⁵.
- **M3 — Commit-partitioned (BP-2) + capacity (L6):** W3 complete; 10⁶ write throughput sustained.
- **M4 — Scale-proved:** W4 complete; signed benchmark evidence + adversarial pass for L1→L6; independent SPF ratification.

---

## 10. Governance, constraints & breakpoint traceability

- **Article IX:** REMAINS ACTIVE. This program builds nothing; construction requires **M0** (scoped release AD),
  analogous to AD-0018 (federation) / AD-0022 (simulation).
- **Prerequisite (BP-3):** SPF-WP-01/02 provide durable tiering, but a fully governed **memory** tier depends on
  the PI-9 Memory Fabric, whose authorization is gated behind the **PHASE-21 authority-chain restoration**
  (`AD-0016..0023` off the canonical `AUTH-012` ledger). SPF may proceed for registry/metadata/config durability
  independently; the memory-port adapter binds only after PI-9 is cleanly authorized.
- **Constraints honored:** additive-only (`src/control/scale/*` + 1 re-export); 0 prohibited-core-dir change;
  269/269 baseline preserved; deny-by-default; Evolution-only commit; **S1/S3/S4** non-waivable; no custom
  cryptography (reuse PI-5); technology-neutral (bindings via `UCOS-PLAT-ADR-*` + AD-0009); **INV-1..13** and
  **INV-CORE-01..14** preserved; **INV-5/INV-6 held within-region ≤10⁶**; 10⁹+ WALLs explicitly out of scope
  (AD-0014).
- **Breakpoints resolved by this program:** **BP-1** (SPF-STORE), **BP-2** (SPF-WP-06 partitioned commit),
  **BP-3** (SPF-STORE tiering + SPF-WP-07 audit checkpointing), plus GOV-BN-3, MEM-BN-1/3, KNOW-BN-1.
- **Breakpoints explicitly NOT addressed:** BP-4/5/6/10/11/12/13/14/15 (10⁹+ / multi-terminal authority /
  planetary–interplanetary invariant walls) — reserved to the Authority Board under AD-0014.

---

## 11. Determination

> **IMPLEMENTATION PROGRAM B03 — SCALE PROOF FABRIC: DESIGN-COMPLETE — READY FOR AUTHORIZATION REVIEW.**
> The program delivers all eight mandated deliverables — **Architecture** (§2), **Services** (§3), **Execution
> model** (§4), **Storage model** (§5), **Scaling model** (§6), **Benchmarks** (§7), **Acceptance tests** (§8),
> and **Implementation backlog** (§9) — for scaling UCOS from **1 → 1,000,000 logical users** across the six
> mandated tiers. It is the direct, additive remediation of the `CIV-STRESS-001` breakpoints **BP-1/BP-2/BP-3**
> (first architectural BREAK at ~10⁶), confined to a new `src/control/scale/*` subtree behind existing ports,
> preserving the 269/269 baseline, deny-by-default authorization, non-waivable S1/S3/S4, and the Evolution
> Fabric as the sole governed-commit path. It holds **INV-5/INV-6 valid within a single region up to 10⁶** and
> explicitly defers the 10⁹+ single-SoR / multi-terminal-authority WALLs to the Authority Board under AD-0014.
>
> **This program authorizes no construction, releases no lock, and enrolls no invariant.** Construction of
> `src/control/scale/*` requires a separate Authority Board scoped Article IX release (**M0 / a future
> `AD-00xx`**), and the PI-9-dependent memory tier further depends on the PHASE-21 authority-chain restoration.
> `UCOS-CONSTRUCTION-BLOCKED` stands; Article IX REMAINS ACTIVE; INV-1..13, INV-CORE-01..14, and AD-0014 are
> unchanged.

# IMPLEMENTATION PROGRAM B03 COMPLETE — SCALE PROOF FABRIC

# SUPPORTS 1 → 1,000,000 LOGICAL USERS (DESIGN) · REMEDIATES BP-1/BP-2/BP-3 · ADDITIVE · ARTICLE IX ACTIVE · NO CONSTRUCTION AUTHORIZED

## 12. Traceability

- **Refines / consumes:** `CIV-STRESS-001` (BP-1..BP-15; bottlenecks; §2 capacity envelope); `packages/platform-runtime/`
  (PI-2/3 substrate, PI-4 control, PI-5 federation, PI-6 evolution, PI-7 knowledge); `UCOS-PEA-002`
  (PRD/PRS/PEX/PWF); `UCOS-PEA-003` (PE-04 eventing / `PEV-*`); `UCOS-PLAT-ADR-001..007` (runtime/storage/event/
  registry/metadata/security/delivery selections); `UCOS-SEC-ARCH-001` (S1/S3/S4, identity classes);
  `UCOS-ASR-NFR-001` v1.0.1 (INV-1..13); `INV-CORE-001` (INV-CORE-01..14); `OP-CERT-001` (evidence discipline).
- **Governed by:** AUTH-008/009/012; Constitution Art. IX/X/XII; AD-0009 (Approval-Required Operations);
  AD-0014 (Ω∞ / 10⁹+ invariant deferral); AD-0016..0022 (scoped fabric-release precedent); PHASE-21
  (authority-chain restoration — prerequisite for the PI-9 memory tier).
- **Owner:** UCOS Authority Board (Architecture / Platform Engineering / Assurance).

**END B03 — SCALE PROOF FABRIC · CONSTRUCTION PLANNING ONLY · DESIGN-COMPLETE — READY FOR AUTHORIZATION REVIEW · ADDITIVE (`src/control/scale/*`) · 269/269 BASELINE PRESERVED · S1/S3/S4 NON-WAIVABLE · EVOLUTION-ONLY COMMIT · INV-1..13 / INV-CORE-01..14 / AD-0014 PRESERVED · ARTICLE IX ACTIVE · NO CONSTRUCTION AUTHORIZED.**
