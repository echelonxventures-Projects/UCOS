# MEM-GOV-002 — UCOS Memory Lifecycle, Retention, Reconciliation & Evolution Governance Specification

| Field | Value |
|-------|-------|
| Artifact | **MEM-GOV-002 — Memory Lifecycle, Retention, Reconciliation & Evolution Governance Specification** |
| Workstream | FND-MEM-01b (PHASE 18 · PI-9.0 Memory Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, or services |
| Basis | MEM-GOV-001; AD-0019 (Evolution Fabric, RATIFIED); AD-0020 (Knowledge Fabric); AUTH-003 (IP-14 Migration-Only Evolution, IP-15 Backward-Compatibility Governance); AUTH-008 (S4) |
| Realizes | Memory Lifecycle · Memory Retention · Memory Reconciliation · Memory Evolution; threats M3, M8, M9, M10, M11 (governance side) |
| Prohibited-dir impact | **NONE** — a governed transition table + retention/reconciliation records, all metadata-stored; mutation via the Evolution Fabric |

> Companion to MEM-GOV-001. Defines the **dynamic** governance of memory: how memory moves through its
> lifecycle, how long it is retained and how it is forgotten, how conflicting memory is reconciled, and how
> all durable memory change is governed through the ratified Evolution Fabric. No implementation authorized.

---

## 1. Memory Lifecycle (`MEM-LC`)

The memory lifecycle is **distinct** from the Meta-Core capability lifecycle and from the Evolution and
Knowledge lifecycles; it composes with them. Every transition must be **signed, governed, audited, and
deny-by-default**.

### 1.1 Canonical states
`captured → consolidated → indexed → recallable → (reconciled) → retained → (expired | forgotten | archived)`

with the durable governed branch (LTM/Semantic):
`proposed → certified → ratified → active → (superseded | forgotten)`.

### 1.2 Transition table (guarded; deny-by-default)

| From | To | Guard | Authority | Routed via |
|------|----|-------|-----------|-----------|
| captured (WM) | consolidated (STM) | classification-monotonic; size-bounded | Consolidation Authority (C4) | direct (ephemeral) |
| consolidated (STM) | proposed (LTM) | retention + classification checks | Consolidation Authority | **Evolution Fabric** |
| proposed | certified | well-formed + provenance-valid | Certification Authority (C5) | Evolution Fabric |
| certified | ratified | quorum + separation-of-duties | Ratification Authority (C6) | Evolution Fabric |
| ratified | active | atomic-apply success | Evolution governor | Evolution Fabric |
| active | superseded | new ratified version supersedes | Ratification Authority | Evolution Fabric |
| active | forgotten | governed forgetting (see §2.3) | Retention Authority (C7) + Ratification | Evolution Fabric |
| any recallable | expired | TTL/retention reached | (automatic, fail-closed) | retention engine |
| episodic active | archived | archival policy | Retention Authority | Evolution Fabric |

- **No edit-in-place.** Durable memory evolves by superseding versions (IP-14), preserving backward
  compatibility of prior references where required (IP-15).
- **Terminal states** (`expired`, `forgotten`, `superseded`, `archived`) never silently transition back;
  re-instatement is a new governed proposal.

## 2. Memory Retention (`MEM-RET`)

### 2.1 Retention classes
Retention is expressed as **governed retention classes** (records, not hardcoded constants), one required per
memory record:

| Class | Typical tiers | Expiry semantics |
|-------|---------------|------------------|
| `ephemeral` | Working | Session/request-bounded; volatile; deny on expiry |
| `short` | Short-Term | Bounded window; fail-closed expiry |
| `durable` | Long-Term, Semantic | Persist until superseded/forgotten under retention policy |
| `episodic` | Episodic | Append-only; archived, not deleted, unless governed forgetting |
| `legal-hold` | any | Expiry/forgetting suspended until hold released (Approval-Required) |

- **MGP-5 enforced:** every record carries exactly one retention class; **absence ⇒ reject on write**. No
  record retains by omission (closes **M3**).
- **Classification-driven retention (S4):** retention policy may be tightened (never loosened) by the
  record's classification; higher classification cannot be retained under a weaker policy.

### 2.2 Expiry (fail-closed)
Expired memory is treated as **absent** at recall time (deny-by-default). Expiry is evaluated on read and by
a governed sweep; an unreachable/unknown retention state ⇒ treated as expired (fail-closed).

### 2.3 Governed forgetting (right-to-be-forgotten discipline)
- Forgetting durable/semantic/episodic memory is an **evolution unit** (MGP-4) requiring Retention + 
  Ratification authorities and explicit approval (AD-0009).
- **Two-sided guard (closes M9 both directions):**
  1. *Under-forgetting:* a ratified forgetting **must** render the memory value unrecallable across all
     tiers and federated shadows (revocation propagates, MEM-GOV-C8).
  2. *Over-forgetting:* forgetting a memory value **never** erases the tamper-evident audit fact that the
     memory existed and was forgotten (MEM-AUD-001 hash-chain is append-only and out of scope for deletion).

## 3. Memory Reconciliation (`MEM-REC`)

Reconciliation resolves conflicting memory. It is **read-only/evidence-first** and never rewrites history.

### 3.1 Within-node (consolidation) reconciliation
- On WM→STM→LTM consolidation, conflicting values for the same `subjectRef` are reconciled by the
  **Reconciliation Policy** (C12): default is *newest ratified wins with full provenance*, configurable per
  tier; unresolved conflicts are escalated, not silently merged.
- Semantic consolidation that would contradict a ratified knowledge record is **blocked** and raised as a
  Knowledge Fabric evolution proposal (closes **M11**).

### 3.2 Cross-node (federated) reconciliation
- Governed by the Memory Audit Authority (C11) and the Reconciliation Policy under **local sovereignty**
  (MGP-6): a divergence between local and foreign memory is resolved in favor of the **local** ratified
  record; foreign divergence is flagged, never auto-applied.
- Divergence classes and fail-closed responses are defined in MEM-AUD-001 §4; unresolved high-severity
  divergence suspends acceptance from the counterpart (MEM-GOV federated suspension).

## 4. Memory Evolution (`MEM-EVO`)

- **All durable memory mutation routes through the ratified Evolution Fabric** (AD-0019): promotion to LTM,
  consolidation into Semantic, supersession, archival, and forgetting are **evolution units** targeting the
  `memory:` (and, for semantic↔knowledge, `knowledge:`) namespaces.
- The Memory Fabric introduces **no** independent apply/rollback path. It relies on the evolution
  governor's **atomic-apply**, **snapshot/restore**, and **depth/rate/halt** controls (E10/E11/E12) — a
  failed memory promotion rolls back atomically, and runaway consolidation is rate-limited/halted.
- **Federation-compatibility guard (inherited):** a memory evolution that changes a federated-visible record
  passes the evolution fabric's federation-compatibility check before ratification.
- **Migration-only (IP-14) / backward-compatibility (IP-15):** memory schema/shape changes are additive and
  migration-based; prior recall references remain resolvable across N/N-1.

## 5. Governance coverage matrix (dynamic)

| Concern | Construct(s) | Control | Threats |
|---------|--------------|---------|---------|
| Lifecycle integrity | C4/C5/C6 + transition table | signed, SoD, deny-by-default transitions | M8 |
| Retention bound | C7 + retention classes | mandatory class; fail-closed expiry | M3 |
| Forgetting | C7/C6/C8 + Evolution | two-sided guard; propagate revocation; audit-preserving | M9 |
| Within-node conflict | C12 | newest-ratified-wins + escalate; knowledge-block | M11 |
| Cross-node conflict | C11/C12 + MEM-AUD | local-sovereignty; fail-closed divergence | M10, M11 |
| Durable mutation | Evolution Fabric (AD-0019) | atomic apply/rollback; governor E10/11/12 | M8 |

## 6. Traceability
- **Refines:** MEM-GOV-001; AD-0019 (`EVO-GOV/GOVERNOR/ARCH-001`), AD-0020 (knowledge lifecycle/ratification),
  AUTH-003 (IP-14/IP-15), AUTH-008 (S4), AUTH-009/012, Constitution Art. IX/XII.
- **Consumed by:** MEM-ARCH-001, MEM-SEC-001, MEM-AUD-001, MEM-READINESS-001, future PI-9 build.
- **Owner:** UCOS Authority Board.

**END MEM-GOV-002 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
