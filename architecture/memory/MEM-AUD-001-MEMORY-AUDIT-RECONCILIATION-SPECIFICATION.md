# MEM-AUD-001 — UCOS Memory Audit & Reconciliation Specification

| Field | Value |
|-------|-------|
| Artifact | **MEM-AUD-001 — Memory Audit & Reconciliation Specification** |
| Workstream | FND-MEM-05 (PHASE 18 · PI-9.0) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | MEM-GOV-001 (C11/C12), MEM-GOV-002 §3; FED-AUD-001 + PI-4 `audit-log.ts` (`AuditSink`, reused); MEM-SEC-001 |
| Realizes gap closure | Threat M10 (memory audit divergence); tamper-evidence + forensics for M1/M4/M5/M9 |
| Prohibited-dir impact | **NONE** — reuses the control-layer `AuditSink`/`FederatedAuditLog`; adds a thin memory wrapper |

> Memory events (capture, consolidate, recall, ratify, supersede, forget, federated-ingest) must be
> tamper-evidently recorded and reconcilable within and across nodes. This spec **reuses** the ratified
> hash-chained `FederatedAuditLog` (AD-0018 / FED-AUD-001) behind the existing `AuditSink` seam — **no new
> audit engine, no new cryptography**. It also defines memory reconciliation and the audit-preserving
> forgetting guard. No implementation is authorized.

---

## 1. Audited memory events (`MEM-AUD-EV`)

Every governed memory event emits a control-layer audit entry through the existing `AuditSink`:

| Event | Emitted on | Key fields (in existing `AuditEntry` shape) |
|-------|-----------|---------------------------------------------|
| `memory.capture` | WM/EPI write | at, actorRef, tier, subjectRef, classification, effect, reason |
| `memory.consolidate` | WM→STM / STM→LTM / semantic | at, consolidationAuthority, from→to tier, unitHash, effect |
| `memory.recall` | recall decision | at, principal, subjectRef, tier, effect (allow/deny), reason |
| `memory.ratify` / `memory.supersede` | Evolution apply | at, ratificationAuthority, version, unitHash, effect |
| `memory.forget` | governed forgetting | at, retentionAuthority, subjectRef, effect, reason (audit-preserving) |
| `memory.federated-ingest` | inbound federated memory | at, nodeId, authorityId, assertionRef, effect |

- Recall **denials** are audited as first-class events (no silent deny) — supports M1/M4/M5 forensics.

## 2. Hash chaining & tamper evidence (`MEM-AUD-HC`) — reuse

- Memory entries are recorded via `FederatedAuditLog implements AuditSink` (FED-AUD-001 §1): each entry is
  extended (in the sink) with `{ seq, prevHash, entryHash = H(canonical(entry) || seq || prevHash), nodeId,
  signature? }`.
- **Append-only + chained:** any mutation/removal of a historical memory event breaks continuity and is
  detectable by offline verification (FED-AUD-001 §5). The PI-4 in-memory immutability baseline (frozen
  entries, defensive-copy reads) is preserved.
- Optional signed **checkpoints** `(seq, headHash, at)` anchor the memory audit head for a Memory Audit
  Authority (MEM-GOV-C11) to attest.

## 3. Episodic memory ↔ audit linkage (`MEM-AUD-EPI`)

- Episodic memory (tier T5) is the experiential complement of the audit trail; each episode carries an
  `auditRef` to its hash-chained audit entry, and each memory audit entry may carry the episode's `memId`.
- This two-way linkage lets a Board reconstruct **both** "what the system recorded happened" (audit) and
  "what the system remembers happened" (episodic), and detect divergence between them.

## 4. Memory reconciliation & divergence (`MEM-AUD-REC` / `MEM-AUD-DIV`) — closes M10

Reconciliation is **read-only/evidence-only**; it never rewrites either node's chain (append-only).

### 4.1 Within-node reconciliation
- Consolidation conflicts (same `subjectRef`, differing values across WM/STM/LTM) are reconciled by the
  Reconciliation Policy (MEM-GOV-C12): default *newest ratified wins with full provenance*; unresolved ⇒
  escalate (never silent merge).
- Episodic↔audit mismatch (an episode with no corresponding audit entry, or vice versa) is a **high-severity
  divergence** → integrity alarm → Board escalation.

### 4.2 Cross-node reconciliation (federated)
Nodes exchange signed checkpoints and, on request from a Memory Audit Authority, ranges of chained memory
events for shared interactions (linked by MEM-SEC-001 `assertionRef`).

| Divergence class | Signal | Response |
|------------------|--------|----------|
| **Hash break** | `entryHash`/`prevHash` mismatch | Local integrity alarm; chain quarantined; Board-escalated |
| **Missing counterpart** | Memory event on one node only | Flag; investigate; may trigger federated memory suspension (MEM-FED-001 §4) |
| **Effect mismatch** | Same interaction, different recall allow/deny | High-severity; fail-closed on the affected relationship |
| **Value divergence** | Same `subjectRef`, incompatible ratified value | Local ratified wins (sovereignty); foreign flagged; propose reconciliation |
| **Checkpoint mismatch** | Signed head hashes disagree for overlapping range | Reconciliation failure; Memory Audit Authority adjudicates |

Divergence is **fail-closed**: unresolved high-severity divergence suspends acceptance from the counterpart
node pending Board adjudication.

## 5. Audit-preserving forgetting (`MEM-AUD-FORGET`) — closes M9 (over-forgetting side)

- A ratified forgetting (MEM-GOV-002 §2.3) renders the memory **value** unrecallable across all tiers and
  federated shadows (revocation propagates, MEM-GOV-C8), **but** the tamper-evident audit fact that the
  memory existed and was forgotten is **retained** in the append-only chain.
- The audit chain is **out of scope for deletion** — forgetting operates on recallable memory records, never
  on the audit log. This closes the over-forgetting risk (destroying evidence) while honoring the
  under-forgetting requirement (value truly unrecallable).

## 6. Export & independent verification (`MEM-AUD-EXP` / `MEM-AUD-VER`) — reuse

- Deterministic canonical export of a memory-event `ChainedEntry` range + signed checkpoint; suitable for
  offline Board review and cross-node reconciliation.
- Independent offline verification recomputes `entryHash` per entry and confirms continuity to a signed
  checkpoint and node/authority signatures to registered `keyRef`s — **no live node required** (mirrors the
  ratified federation audit verification methodology).

## 7. Placement (no core-dir change)

- Implemented as a thin `memory-audit.ts` wrapper in `src/control/memory/*` that emits into the existing
  `FederatedAuditLog` passed to `createControlPlane({ auditSink })`. The PI-4 `AuditEntry` type and
  `ControlPlane` audit call are **unchanged**; chaining/signing/export are inherited from FED-AUD-001.

## 8. Threat mitigation summary

| Threat | Control | Residual |
|--------|---------|:--------:|
| M10 Memory audit divergence | Hash chain + signed checkpoints + within/cross-node reconciliation + fail-closed | Low–Med (bounded by reconciliation cadence) |
| M9 Over-forgetting (evidence loss) | Audit chain out-of-scope for deletion; forgetting is audit-preserving | Low |
| M1/M4/M5 (forensics) | Tamper-evident, exportable, verifiable memory-event trail with provenance + episodic linkage | Improves detection & attribution |

## 9. Traceability
- **Refines:** MEM-GOV-001 (C11/C12), MEM-GOV-002 §3, MEM-SEC-001; FED-AUD-001, PI-4 `audit-log.ts`/`AuditSink`,
  FED-PROV-001; AD-0018.
- **Consumed by:** MEM-FED-001, MEM-READINESS-001, Authority Board audit review, future PI-9 build.
- **Owner:** UCOS Authority Board (Audit).

**END MEM-AUD-001 — DESIGN · READY FOR RATIFICATION · REUSE-ONLY OF AUDIT FABRIC · NO IMPLEMENTATION AUTHORIZED.**
