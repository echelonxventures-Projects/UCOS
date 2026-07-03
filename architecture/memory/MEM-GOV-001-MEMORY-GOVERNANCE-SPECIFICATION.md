# MEM-GOV-001 — UCOS Memory Governance Specification

| Field | Value |
|-------|-------|
| Artifact | **MEM-GOV-001 — Memory Governance Specification** |
| Workstream | FND-MEM-01 (PHASE 18 · PI-9.0 Memory Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, or services |
| Basis | AD-0016 (substrate), AD-0017 (control), AD-0018 (federation), AD-0019 (evolution), AD-0020 (knowledge) — all RATIFIED; AUTH-008/009/012; Constitution Art. IX/XII; AD-0014 (Ω∞ deferral stands) |
| Realizes | The 6 governed memory tiers + 12 governance constructs; threats M1, M2, M3, M8, M9 (governance side) |
| Prohibited-dir impact | **NONE** — all constructs are runtime records in the substrate Metadata runtime (metadata-first) |

> This specification defines governance **only**. It authorizes no implementation. All constructs are
> expressed as runtime, metadata-stored records interpreted by the existing PI-4 governance/policy engines
> and the PI-6 Evolution Fabric — **0 hardcoded memories, tiers, authorities, or retention policies**
> (IP-04). Memory implementation remains gated behind a future PI-9 authorization act by the Authority
> Board. The Memory Fabric is a governed store/consolidate/recall/reconcile layer that **reuses** federation
> cryptography (AD-0018), the Evolution Fabric governor (AD-0019), and the Knowledge Fabric (AD-0020); it is
> **not** an Ω∞ existential/self-directed memory system (AD-0014 stands).

---

## 1. Principles (memory-specific, subordinate to the Authority Layer)

- **MGP-1 Single Accountable Owner.** Every memory tier and every governance construct has exactly one
  accountable owner (mirrors PEO single-owner); escalation terminates at the local Authority Board
  (AUTH-009).
- **MGP-2 Deny-by-Default Recall & Write.** Absent an explicit, verified, in-boundary authorization, every
  memory read (recall) and write (capture/consolidate) is denied. Empty authorization ⇒ recall nothing.
- **MGP-3 Classification is Monotonic Across Tiers.** Promotion between tiers (Working → Short-Term →
  Long-Term → Semantic) may **never declassify**; a memory inherits the maximum classification of its
  sources (S4). Closes **M2 cross-tier leakage** (governance side).
- **MGP-4 Governed Mutation Only via Evolution.** All durable memory mutation — promotion to Long-Term,
  consolidation into Semantic, and forgetting/erasure — routes through the ratified Evolution Fabric
  (evolution units targeting the `memory:` namespace). The Memory Fabric introduces **no** independent
  mutation/rollback path that bypasses the evolution governor. Closes **M8** and hardens **M9**.
- **MGP-5 Bounded Retention, Fail-Closed Expiry.** Every memory record has an explicit retention class;
  expiry is mandatory and fail-closed (expired ⇒ treated as absent ⇒ deny). No memory retains indefinitely
  by omission. Closes **M3 unbounded retention**.
- **MGP-6 Local Sovereignty over Memory.** A node's local Authority Board is terminal for all memory
  affecting local capabilities. Foreign (federated) memory may **inform** but never **override** a local
  `active` memory without local ratification; foreign memory is deny-only at the boundary (FGP-1 inherited).
- **MGP-7 Provenance & Recallability.** Every memory record is attributable (who captured it, from which
  source/tier/node, verified by which authority) and every recall is auditable (MEM-AUD-001). Nothing is
  silently synthesized.

## 2. The 6 Governed Memory Tiers

Each tier is a **governed record class**, not a storage technology. All tier records are stored under the
reserved metadata key namespace `memory:<tier>:<id>` (see MEM-ARCH-001 §3 and MEM-FED-001 for provenance
keying). Technology selection (stores, caches, indexes) is deferred to the platform technology-selection
ADRs and Prompt 10 — **out of scope here**.

### 2.1 Working Memory — WM (`MEM-GOV-T1`)
- **Purpose.** Ephemeral, per-request/per-session scratch context used during a single governed execution.
- **Record.** `{ memId, tier:"working", sessionRef, classification, value, capturedAt, ttl (short), provenance }`.
- **Lifecycle.** `captured → active → (consolidated | expired)` (expiry terminal; `consolidated` promotes to STM).
- **Retention.** Shortest class (session/request-bounded); volatile by design; **never federated by default**.
- **Decision rights.** Capture/recall: the executing principal under deny-by-default policy. Promotion to
  STM: Consolidation Authority (`MEM-GOV-C4`).
- **Invariants.** Bounded size (resource cap, closes **M12**); classification inherited from source; no WM
  record is durable or exportable without governed promotion.

### 2.2 Short-Term Memory — STM (`MEM-GOV-T2`)
- **Purpose.** Bounded-retention recent context promoted from Working Memory; supports continuity across
  interactions within a bounded window.
- **Record.** `{ memId, tier:"short-term", subjectRef, classification, value, promotedFrom, promotedAt, ttl (bounded), provenance }`.
- **Lifecycle.** `promoted → active → (consolidated → LTM | expired)`.
- **Retention.** Bounded class (hours/days-order — expressed as a governed retention policy, not a hardcoded
  number); fail-closed expiry.
- **Decision rights.** Promotion WM→STM: Consolidation Authority. Promotion STM→LTM: routed through the
  Evolution Fabric (MGP-4).
- **Invariants.** Reconcilable within the node (MEM-AUD/REC); classification monotonic (MGP-3).

### 2.3 Long-Term Memory — LTM (`MEM-GOV-T3`)
- **Purpose.** Durable, versioned, governed memory that persists across sessions and is eligible for
  federation.
- **Record.** `{ memId, tier:"long-term", subjectRef, version, classification, value, ratifiedBy, ratifiedAt, retentionClass, supersedes?, provenance }`.
- **Lifecycle.** `proposed → certified → ratified → active → (superseded | forgotten)` — **all transitions
  are evolution units** (MGP-4), signed and audited.
- **Decision rights.** Ratification: Memory Ratification Authority (`MEM-GOV-C6`) via the Evolution Fabric;
  distinct from certification (separation of duties).
- **Invariants.** Immutable versions (new version supersedes; never edit-in-place); federatable only if
  classification permits (S4); retention governed.

### 2.4 Semantic Memory — SEM (`MEM-GOV-T4`)
- **Purpose.** Consolidated, generalized facts abstracted from episodic/long-term memory and **linked to the
  Knowledge Fabric** (AD-0020). Semantic memory is the bridge between remembered experience and governed
  knowledge.
- **Record.** `{ memId, tier:"semantic", knowledgeRef?, classification, assertion, consolidatedFrom[], version, ratifiedBy, provenance }`.
- **Lifecycle.** `proposed → certified → ratified → active → (superseded | forgotten)` (evolution units).
- **Decision rights.** A semantic memory that asserts or updates a knowledge record **must** be co-ratified
  through the Knowledge Fabric's ratification authority (no memory-side back door into knowledge). Closes
  **M11 semantic drift** (governance side).
- **Invariants.** `knowledgeRef` (when present) points to a ratified `knowledge:record:*`; semantic memory
  never mutates a knowledge record directly — it proposes an evolution unit targeting `knowledge:`.

### 2.5 Episodic Memory — EPI (`MEM-GOV-T5`)
- **Purpose.** Time-indexed, append-only record of governed events/experiences ("what happened, when, in
  what context"). Episodic memory is the experiential complement to the audit trail.
- **Record.** `{ memId, tier:"episodic", at, actorRef, capabilityRef?, classification, episode, auditRef?, provenance }` (append-only, immutable).
- **Lifecycle.** `recorded → active → (archived | forgotten-by-policy)`.
- **Decision rights.** Recording: any governed execution (subject to deny-by-default policy). Forgetting:
  retention policy + Evolution Fabric (never silent deletion; audit retained per MGP-4/M9).
- **Invariants.** Append-only; each episode is linkable to a hash-chained audit entry (`auditRef`,
  MEM-AUD-001); time-monotonic per subject; **forgetting an episode never erases the audit fact that it
  existed** (closes the over-forgetting side of **M9**).

### 2.6 Federated Memory — FED-MEM (`MEM-GOV-T6`)
- **Purpose.** Memory shared with or recalled from federation nodes (AD-0018), across a trust boundary.
- **Record.** foreign memory materialized under `federation:<nodeId>:memory:<tier>:<id>` with a verified
  `Provenance` envelope (FED-PROV convention; MEM-FED-001).
- **Lifecycle.** `ingested (verified) → shadow-active → (expired | revoked)` — foreign memory is always a
  **shadow** of a local decision (MGP-6).
- **Decision rights.** Admission of a federated memory authority: Authority Board (Approval-Required,
  AD-0009). Acceptance at recall time: local policy engine (deny-by-default, in-boundary only).
- **Invariants.** Deny-only influence (never overrides a local `active` memory); namespace-isolated;
  fail-closed on partition/expiry; classification honored end-to-end (S4). Closes **M5 federation poisoning**
  (governance side).

## 3. The 12 Memory Governance Constructs

Each construct specifies **Purpose · Record · Lifecycle · Decision rights · Invariants**. Records live under
`memory:<kind>:<id>` (local) or `federation:<nodeId>:memory:<kind>:<id>` (foreign).

| # | Construct | Purpose | Owner (accountable) | Approval-Required? | Fail-closed? | Threats addressed |
|---|-----------|---------|---------------------|:------------------:|:------------:|-------------------|
| **C1** | Memory Tier Registry | Declares the 6 governed tiers and their retention/classification/federation rules | Authority Board | Yes (define/alter) | Yes | M2, M3 |
| **C2** | Memory Record Index | Metadata-backed index of all memory records by tier/subject/version | Memory Steward | No (read) / Yes (register) | Yes | M1, M4 |
| **C3** | Memory Namespace | Reserved keyspace `memory:*` (+ `federation:*:memory:*`) with disjoint prefixes | Authority Board | Yes | Yes | M2, M5 |
| **C4** | Consolidation Authority | Empowered to promote WM→STM→(propose)LTM and consolidate into Semantic | Authority Board | Yes | Yes | M8 |
| **C5** | Memory Certification Authority | Signs that a memory unit is well-formed, classification-correct, provenance-valid | Authority Board | Yes | Yes | M1, M4, M8 |
| **C6** | Memory Ratification Authority | Terminal authority ratifying LTM/Semantic memory (via Evolution Fabric); **distinct from C5** (SoD) | Authority Board | Yes | Yes | M8, M9 |
| **C7** | Memory Retention Authority | Owns retention classes, legal-hold, and governed forgetting policy | Authority Board | Yes | Yes (expiry) | M3, M9 |
| **C8** | Memory Revocation Authority | Revokes memory records, certifications, ratifications, or federated memory authorities | Authority Board | Yes | Yes (propagate) | M1, M5, M9 |
| **C9** | Federated Memory Authority | A node/authority whose memory assertions this node will evaluate (enumerated powers) | Authority Board | Yes | Yes | M5 |
| **C10** | Memory Trust Boundary | The explicit set of federated memory authorities accepted; `defaultEffect: deny` | Authority Board | Yes | Yes (default deny) | M5, M6 |
| **C11** | Memory Audit Authority | Owns cross-node memory reconciliation and divergence adjudication | Authority Board | Yes | Yes | M10 |
| **C12** | Memory Reconciliation Policy | Governs within-node consolidation conflicts and cross-node divergence resolution (local sovereignty) | Authority Board | Yes | Yes | M10, M11 |

**12/12 constructs defined.** All map to existing primitives — PI-4 governance processes/approvals/
certifications/revocation and deny-overrides-allow; PI-6 Evolution Fabric for mutation; PI-8… *(n/a)*; AD-0018
federation trust/boundary/audit; AD-0020 knowledge linkage — plus new metadata record kinds. **No core-dir
change.**

## 4. Governance coverage & separation of duties

- **Separation of duties (non-waivable):** Consolidation (C4), Certification (C5), and Ratification (C6) are
  **distinct authorities**; no single authority may propose, certify, and ratify the same memory unit.
- **Approval-Required acts (AD-0009):** registering a memory/federated-memory authority; issuing or revoking
  a memory certification/ratification; admitting a federated memory authority; importing foreign memory;
  changing a retention class or applying a legal-hold; executing a governed forgetting. Each requires
  explicit human/Board approval at execution time.
- **Escalation:** all memory governance escalates to the local Authority Board (AUTH-009).

## 5. Traceability
- **Refines:** AD-0016/0017/0018/0019/0020, AUTH-008 (S1/S3/S4), AUTH-009, AUTH-012, Constitution Art. IX/XII,
  IP-04 (metadata-first), IP-14/IP-15 (migration-only evolution / backward-compatibility, via the Evolution
  Fabric), AD-0014 (Ω∞ deferral).
- **Consumed by:** MEM-GOV-002 (lifecycle/retention/reconciliation/evolution governance), MEM-ARCH-001,
  MEM-SEC-001, MEM-FED-001, MEM-AUD-001, MEM-THREAT-001, MEM-READINESS-001, and a future PI-9 implementation
  act.
- **Owner:** UCOS Authority Board.

**END MEM-GOV-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
