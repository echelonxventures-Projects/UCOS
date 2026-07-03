# CIV-THREAT-001 — UCOS Civilization Fabric Threat Model

| Field | Value |
|-------|-------|
| Artifact | **CIV-THREAT-001 — Civilization Threat Model** |
| Program | PHASE Ω-01 · Civilization Fabric Conceptual Architecture Program |
| Version | 1.0.0 |
| Status | **DESIGN / PROPOSAL — READY FOR RATIFICATION REVIEW** (specification only) |
| Basis | `CIV-GOV-001/ARCH-001/SEC-001/FED-001/AUD-001`; `SIM-THREAT-001` (S1–S12); STRIDE; AUTH-008 (S1/S3/S4/S6) |
| Method | STRIDE over the 12 constructs, the non-actuation/sandbox boundary, the population-privacy boundary, and the federation boundary |
| Determination gate | **0 residual High** (no residual High risks permitted) |
| Owner | UCOS Authority Board |

> **Governing disclaimer:** design/proposal only. Preserves AD-0014; enrolls no INV-14..20; releases no Article
> IX lock; authorizes no implementation/construction. **The Civilization Fabric remains conceptual and deferred
> under AD-0014.** Because the fabric is non-actuating and simulation-bounded, the *maximum* real-world impact of
> any successful attack is a rejected proposal plus audit noise — never a real civilizational effect.

---

## 1. Threat ledger (C1–C15)

| # | Threat | STRIDE | Prior (unmitigated) | Mitigating spec(s) | Residual |
|---|--------|--------|:-------------------:|--------------------|:--------:|
| **C1** | **Civilization Drift** — a model diverges from its declared/pinned baseline unnoticed | T, R | High | CIV-AUD hash-chain + reproducibility tuple; pinned signed baseline (CIV-SEC-AS); drift detected on verify | **Low** |
| **C2** | **Governance Capture** — modeled governance skewed to force a promotion | E, T | High | CGP-3 deny-by-default; Evolution-only commit; SoD (author ≠ certifier); PI-4 policy gate | **Low** |
| **C3** | **Knowledge Corruption** — poisoned/forged knowledge inputs (CIV-C7) | T, S | High | Read-only governed queries; signed knowledge refs; classification inheritance; local-shadows-foreign | **Low** |
| **C4** | **Historical Revision Abuse** — silently rewriting a civilization's modeled past | T, R | High | CIV-AUD append-only + hash chain + signed checkpoints; revision = forward audited version only (CGP-6) | **Low** |
| **C5** | **Economic Manipulation** — modeled economy (CIV-C10) rigged to bias impact | T | Med–High | Simulation variables only (no real value); constraint check; reproducibility; deny-by-default promotion | **Low** |
| **C6** | **Identity Fragmentation** — inconsistent/spoofed model-entity identity across nodes | S, T | High | FED-PROV namespacing (`nodeId::localId`); signed assertions; local-shadows-foreign; PI-4 identity for authors | **Low** |
| **C7** | **Federation Destabilization** — foreign contributions destabilize local models | T, D, E | High | CFG-1..5 advisory/deny-only; clamped trust; fail-closed partition; namespace isolation | **Low–Med** |
| **C8** | **Simulation Abuse** — runaway/unbounded or escaping civilization run | D, E | High | SGP-5 bounded budgets + fail-closed abort; sandbox keyspace guard (SIM-SEC-ISO-1); non-actuation | **Low** |
| **C9** | **Authority Escalation** — civilization authority self-promotes to commit | E | High | Enumerated powers (CD1..9); SoD non-waivable; **no commit power** in the fabric | **Low** |
| **C10** | **Audit Evasion** — an act performed without a resolvable audit record | R, T | High | Mandatory audited events (CIV-AUD §2); rationale-required rejection; tamper-evident chain | **Low** |
| **C11** | **Rights Model Corruption** — rights/obligations model altered to mislead | T | Med–High | CIV-C11/C12 as signed Constraint-Set entries; change = signed forward version; explicit non-enforceability | **Low** |
| **C12** | **Inter-Civilization Conflict Modeling Abuse** — conflict scenarios weaponized/targeting real entities | T, E | High | CFG-2 advisory/deny-only; bounded comparative scenario; non-actuation; cannot target real entities; deny-by-default | **Low** |
| **C13** | **Population Model Misuse / Re-identification** — cohort model used to single out or model real persons (PII) | I | High | CIV-SEC §4 aggregate-only; PII rejected at ingress; re-identification denied + audited; S4 classification | **Low** |
| **C14** | **Actuation Boundary Breach** — a civilization object attempts to actuate/operate a real system | E, T | High | CGP-1/SGP-9 non-actuation; no commit/write path; Evolution-only; sandbox guard; AD-0014 preserved | **Low** |
| **C15** | **Continuity / Preservation Tampering** — forged preservation snapshot or continuity reconstruction | T, S | High | Signed, hash-anchored, append-only snapshots (CIV-AUD §3); content-hash verify; forgery detected on verify | **Low** |

**Result: 0 residual High.** All prior High threats reduced to Low / Low–Med. The two Low–Med residuals (C7
federation, and the distributed facets of C5/C11 handled via C7) are inherent to distributed co-modeling and are
acceptably bounded by fail-closed federation, clamped trust, and reconciliation cadence. **No residual High
permitted — satisfied.**

---

## 2. Boundary analysis

- **Non-actuation / sandbox boundary (C8/C13/C14).** The strongest guarantee: a civilization is a Simulation
  object; every run is confined to `simulation:sandbox:<runId>:*`; a static keyspace guard rejects+audits any
  non-sandbox write; only advisory `civilization:projection:*` / `civilization:impact:*` survive teardown. The
  fabric has **no** independent governed write path and **cannot actuate** (C14 structurally closed).
- **Promotion boundary (C2/C9/C12).** Deny-by-default; a modeled insight becomes governed change only via the
  Evolution Fabric after policy PASS, hard-constraint PASS, certification (SoD), and ratification.
- **Population-privacy boundary (C13).** Aggregate-only cohorts; PII rejected at ingress; re-identification
  denied; classification inheritance on all outputs.
- **History boundary (C1/C4/C15).** Append-only, hash-chained, signed preservation; in-place revision
  impossible without breaking the chain (detectable on verify).
- **Federation boundary (C3/C6/C7/C12).** Local sovereignty; foreign contributions advisory/deny-only, clamped,
  namespace-isolated, fail-closed on partition.

## 3. Non-waivable control coverage
S1 (authz/deny-by-default + non-actuation), S3 (keys/weights by-reference), S4 (population aggregation +
classification inheritance), S6 (immutable tamper-evident audit) are all designed and enforced across
CIV-SEC-001 and CIV-AUD-001. No control is waivable. AD-0014 is preserved; no existential invariant
(INV-14..20) is enrolled or required.

## 4. Traceability
- **Refines:** `CIV-GOV-001/ARCH-001/SEC-001/FED-001/AUD-001`, `SIM-THREAT-001`, AUTH-008, `AD-0014`.
- **Consumed by:** `CIV-READINESS-001`.
- **Owner:** UCOS Authority Board.

**END CIV-THREAT-001 — DESIGN/PROPOSAL · C1–C15 · 0 RESIDUAL HIGH · NON-ACTUATING · AD-0014 PRESERVED · NO IMPLEMENTATION AUTHORIZED.**
