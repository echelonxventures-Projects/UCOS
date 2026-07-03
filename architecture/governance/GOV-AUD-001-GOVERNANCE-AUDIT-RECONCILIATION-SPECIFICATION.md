# GOV-AUD-001 — UCOS Governance Fabric Audit & Reconciliation Specification

| Field | Value |
|-------|-------|
| Artifact | **GOV-AUD-001 — Governance Audit & Reconciliation Specification** |
| Workstream | FND-GOV-05 (PHASE 25 · PI-14.0) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | GOV-GOV-001 (C14, §4); GOV-SEC-001; FED-AUD-001 + PI-4 `audit-log.ts` (`AuditSink`, reused); GOV-FED-001 |
| Realizes gap closure | Threat G13 (governance history tamper); tamper-evidence + forensics for G1/G2/G6/G7/G8/G11/G12 |
| Prohibited-dir impact | **NONE** — reuses the control-layer `AuditSink`/`FederatedAuditLog`; adds a thin governance wrapper |

> Governance events (enact, amend, repeal, grant, delegate, revoke, enforce, attest, adjudicate,
> federated-ingest) must be tamper-evidently recorded, reconstructable as an immutable amendment/dispute
> trail, and reconcilable within and across nodes. This spec **reuses** the ratified hash-chained
> `FederatedAuditLog` (AD-0018 / FED-AUD-001) behind the existing `AuditSink` seam — **no new audit engine, no
> new cryptography**. No implementation is authorized.

---

## 1. Audited governance events (`GOV-AUD-EV`)

Every governed governance event emits a control-layer audit entry through the existing `AuditSink`:

| Event | Emitted on | Key fields (in existing `AuditEntry` shape) |
|-------|-----------|---------------------------------------------|
| `gov.enact` / `gov.amend` / `gov.repeal` | instrument lifecycle via Evolution | at, ratificationAuthority, kind, instId, version, derivesFrom, precedence, unitHash, effect |
| `gov.grant` / `gov.delegate` / `gov.revoke` | authority/right/delegation change | at, grantingAuthority, holderRef, powers/rightType, scope, effect, reason |
| `gov.obligation` | obligation open/discharge/breach | at, obligorRef, obligationType, status, effect |
| `gov.enforce` | enforcement decision (PEP) | at, principal, targetRef, instrumentsApplied[], effect (allow/deny), reason |
| `gov.attest` | compliance verdict | at, complianceAuthority, subjectRef, verdict, evidenceRef[], effect |
| `gov.adjudicate` | dispute ruling | at, disputeAuthority, disputeId, ruling, remedy?, effect |
| `gov.federated-ingest` | inbound federated governance | at, nodeId, authorityId, assertionRef, effect |

- Enforcement **denials** and dispute **rulings** are audited as first-class events (no silent enforcement, no
  unrecorded ruling) — supports G7/G11 forensics.

## 2. Hash chaining & tamper evidence (`GOV-AUD-HC`) — reuse — closes G13

- Governance entries are recorded via `FederatedAuditLog implements AuditSink` (FED-AUD-001 §1): each entry is
  extended (in the sink) with `{ seq, prevHash, entryHash = H(canonical(entry) || seq || prevHash), nodeId,
  signature? }`.
- **Append-only + chained:** any mutation/removal of a historical governance event breaks continuity and is
  detectable by offline verification (FED-AUD-001 §5). The PI-4 in-memory immutability baseline (frozen
  entries, defensive-copy reads) is preserved. Closes **G13 retroactive/unauditable governance change**.
- Optional signed **checkpoints** `(seq, headHash, at)` anchor the governance audit head for a Governance Audit
  & Reconciliation Authority (GOV-GOV-C14) to attest.

## 3. Immutable amendment & dispute trail (`GOV-AUD-TRAIL`)

- Because instruments are **superseded, never edited** (IP-14), the full version history of every Law/
  Regulation/Policy is reconstructable by walking `supersedes` links plus the `gov.enact`/`gov.amend`/
  `gov.repeal` chain — an **immutable legislative history**.
- Every dispute (`gov.adjudicate`) and its ruling is chained and linkable to the instrument/decision it
  concerns (`against`), so a Board can reconstruct **why** an instrument changed and **under whose ruling**.
- A repealed instrument is retained in the chain (terminal `repealed` state), never hard-deleted — the fact of
  its existence and repeal is permanent.

## 4. Governance reconciliation & divergence (`GOV-AUD-REC` / `GOV-AUD-DIV`) — supports G9/G12

Reconciliation is **read-only/evidence-only**; it never rewrites either node's chain (append-only).

### 4.1 Within-node reconciliation
- Instrument conflicts (same scope, contradictory ratified instruments) are surfaced by the precedence
  resolver (GOV-ARCH-001 §3) and adjudicated via dispute resolution (GOV-GOV-O3); unresolved ⇒ fail-closed
  (deny) + escalate (never silent merge).
- Enforcement↔instrument mismatch (an enforcement decision citing a non-active/absent instrument) is a
  **high-severity divergence** → integrity alarm → Board escalation.

### 4.2 Cross-node reconciliation (federated)
Nodes exchange signed checkpoints and, on request from a Governance Audit & Reconciliation Authority, ranges of
chained governance events for shared governance (linked by GOV-SEC-001 `assertionRef`).

| Divergence class | Signal | Response |
|------------------|--------|----------|
| **Hash break** | `entryHash`/`prevHash` mismatch | Local integrity alarm; chain quarantined; Board-escalated |
| **Missing counterpart** | Governance event on one node only | Flag; investigate; may trigger federated governance suspension (GOV-FED-001 §4) |
| **Effect mismatch** | Same act, different enforce allow/deny | High-severity; fail-closed on the affected relationship |
| **Precedence/conflict divergence** | Foreign instrument claims disallowed precedence or contradicts local | Local ratified wins (sovereignty); foreign flagged; block-and-dispute |
| **Checkpoint mismatch** | Signed head hashes disagree for overlapping range | Reconciliation failure; Governance Audit & Reconciliation Authority adjudicates |

Divergence is **fail-closed**: unresolved high-severity divergence suspends recognition of the counterpart
node's governance pending Board adjudication.

## 5. Non-erasable governance history (`GOV-AUD-PERM`)

- Governance history — enactment, amendment, repeal, grant, revocation, enforcement, attestation, ruling — is
  **out of scope for deletion**. Unlike memory (which supports audit-preserving forgetting of *values*),
  governance carries **no forgetting path**: the legislative/enforcement record is permanent (retention +
  Constitution transparency, `UCOS-CONST-001` Part XI). This is the strongest anti-tamper stance in the fabric
  family and directly closes **G13**.

## 6. Export & independent verification (`GOV-AUD-EXP` / `GOV-AUD-VER`) — reuse

- Deterministic canonical export of a governance-event `ChainedEntry` range + signed checkpoint; suitable for
  offline Board review, audit, and cross-node reconciliation.
- Independent offline verification recomputes `entryHash` per entry and confirms continuity to a signed
  checkpoint and node/authority signatures to registered `keyRef`s — **no live node required** (mirrors the
  ratified federation audit verification methodology).

## 7. Placement (no core-dir change)

- Implemented as a thin `governance-audit.ts` wrapper in `src/control/governance/*` that emits into the
  existing `FederatedAuditLog` passed to `createControlPlane({ auditSink })`. The PI-4 `AuditEntry` type and
  `ControlPlane` audit call are **unchanged**; chaining/signing/export are inherited from FED-AUD-001.

## 8. Threat mitigation summary

| Threat | Control | Residual |
|--------|---------|:--------:|
| G13 Retroactive / unauditable governance change | Hash chain + non-erasable history + signed checkpoints + offline verify | Low |
| G11 Dispute-resolution capture (forensics) | Chained, attributable, SoD-checked ruling record | Low–Med |
| G12/G9 Cross-node governance divergence | Reconciliation linked by `assertionRef` + fail-closed suspension | Low–Med |
| G6/G7/G8 (forensics) | Tamper-evident, exportable, verifiable governance-event trail with provenance | Improves detection & attribution |

## 9. Traceability
- **Refines:** GOV-GOV-001 (C14, §4), GOV-SEC-001; FED-AUD-001, PI-4 `audit-log.ts`/`AuditSink`, FED-PROV-001;
  `UCOS-CONST-001` Part XI (transparency/retention); AD-0018.
- **Consumed by:** GOV-FED-001, GOV-READINESS-001, Authority Board audit review, future PI-14 build.
- **Owner:** UCOS Authority Board (Audit).

**END GOV-AUD-001 — DESIGN · READY FOR RATIFICATION · REUSE-ONLY OF AUDIT FABRIC · NON-ERASABLE GOVERNANCE HISTORY · NO IMPLEMENTATION AUTHORIZED.**
