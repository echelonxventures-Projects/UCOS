# UCOS-EP-0006 — Execution Stage Gates

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-EP-0006` |
| Program | **UCOS Phase 2 — Master Execution Program** |
| Phase | EP-6 — Stage Gates |
| Mode | **EXECUTION PLANNING ONLY** — no audit, no redesign, no new requirement/RC class, no scope expansion. |
| Status | EXECUTION BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EP-0002/0003` (packages, waves); `UCOS-RA-0006` (stage exits); `UCOS-EXEC-0001` Part V (criteria); `UCOS-EA-0003` (G0) |
| Governing constraints | Corpus FROZEN. Fail-closed; additive-only; INV-1..13 unchanged; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |

---

## 0. Purpose & gate rules

One gate governs the transition into each delivery wave. Each gate declares **Entry · Exit · Success · Failure ·
Rollback** criteria. Gates are **fail-closed** (a criterion that cannot be proven denies passage) and
**additive-forward** (rollback is corrective forward migration under INV-10, never destructive). No gate may be
waived; non-waivable S1/S3/S4 hold at every gate.

---

## Gate 0 — Governance Closure Gate  *(Wave 0; the master gate)*
- **Entry:** documentary chain restoration of record (`AUTH-REST-004`, v1.0.13); recorded program state accessible.
- **Exit:** **G0 = AT-P0-1 ∧ AT-P0-2 ∧ AT-P1-7 ∧ AT-P0-3 = PASS**; `UCOS-CONSTRUCTION-BLOCKED` lifted for the authorized scope.
- **Success:** independent attestation + re-measurement of record; `UCOM-ULTIMATE-CERT-002` issued; Board authorization act recorded.
- **Failure:** any AT element FALSE; self-attestation offered in lieu of independent evidence; 269/269 not reproduced.
- **Rollback:** remain BLOCKED; re-run the failed evidentiary wave (W1/W2) or withhold the Board act; **no build proceeds.**

## Gate 1 — Foundational Runtime Gate  *(Wave 1; DONE)*
- **Entry:** genesis roots seeded; Gate 0 exit (for any new foundational hardening).
- **Exit:** 12 L1 fabrics realized (269/269); deny-by-default; S1/S3/S4; Evolution-only commit.
- **Success:** substrate + control + governance-core operational; foundational chain attested (via Gate 0).
- **Failure:** any FOUNDATIONAL fabric absent; a commit path without fail-closed guarantee.
- **Rollback:** N/A (realized); any regression is corrected forward with the baseline restored to green.

## Gate 2 — Core Runtime Gate  *(Wave 2)*
- **Entry:** Gate 1 exit + **Gate 0 exit** (for forward packages).
- **Exit:** 7 L2 fabrics realized (PI-5/7/8/9); **Stage 7 enactment complete (INV-CORE-12 + CRC)**; convergence (optional) adopted; FAB-TIME realized (RR-7).
- **Success:** core primitives + federation operational; Non-Actuation binding of record; convergence primitives (EA-B-P1-1/2/3/4/8) closed; temporal fabric additive.
- **Failure:** enactment attempted before chain restoration; a convergence change touching a prohibited core dir; FAB-TIME weakening INV-5/6/9/10.
- **Rollback:** revert the offending additive change forward; retain the realized MCR; enactment deferred to a clean Board act.

## Gate 3 — Distributed Runtime Gate  *(Wave 3; = PRODUCTION READY)*
- **Entry:** Gate 0 exit; MCR realized; durable/distributed adapters built (`EWP-D-SCALE`).
- **Exit:** **UCC-4 (Operational Certification) issued** — G12-1 ∧ G12-2 ∧ G12-3 CLOSED; measured RPO/RTO/p99/availability meet `UCOS-ASR-NFR-001` floors; `PE-12` observability ADR decided (UCC-6).
- **Success:** provisioned ENV-DEV/INT(/STAGE); pipeline executed; DR drill passed; scale > 10⁶; immutable operational audit.
- **Failure:** measured NFR below class floor; secrets embedded / permissive security mode; core-dir modified; ENV-PROD touched before full release.
- **Rollback:** automated single-action revert to prior signed desired-state (≤ 15 min AC-1); production certification withheld; **NOT PRODUCTION READY**.

## Gate 4 — Intelligence Gate  *(Wave 4)*
- **Entry:** **INV-CORE-12 (Non-Actuation) enrolled** (Gate 2); PI-5/7/8/9; scoped release `AD-0024`.
- **Exit:** PI-10 built + ratified; I1–I12 adversarial suite green; propose-not-act enforced; Evolution-only commit.
- **Success:** governed cognition operational with 0 autonomous actuation; 0 residual High/High.
- **Failure:** any autonomous-actuation path; build attempted before Non-Actuation enrollment; determinism escapes the verifier gate.
- **Rollback:** disable/withdraw the cognition fabric (additive removal via Evolution); Non-Actuation remains binding; no partial actuation persists.

## Gate 5 — Simulation Gate  *(Wave 5)*
- **Entry:** Gate 4 deps; Stage 8 (temporal) for time-projection; `AD-0022`.
- **Exit:** PI-11 built; sandboxed; Evolution-only commit; S1–S12 green.
- **Success:** non-actuating projection/what-if operational; 0 residual High/High.
- **Failure:** simulation mutating a system-of-record; sandbox escape.
- **Rollback:** revert the fabric forward; sandboxed state discarded (no SoR impact by construction).

## Gate 6 — Economics Gate  *(Wave 6)*
- **Entry:** EVO/REG/META/GOV/AUDIT; **AUTH-012 ledger restoration**; scoped release.
- **Exit:** PI-13 built; conservation-checked settlement; EC1–EC15 green; **no real-money path without AD-0009**.
- **Success:** propose-not-act economic fabric operational; ledger conserved/reconcilable.
- **Failure:** unbalanced settlement; real value movement without an AD-0009 human act; independent commit path.
- **Rollback:** compensating-entry reversal (append-only); real actuation halted; ledger reconciled.

## Gate 7 — Civilization Gate  *(Wave 7; = CIVILIZATION READY)*
- **Entry:** Gate 5 (Simulation) for digital-twin; **`AD-0014` release**; existential-invariant enactment as elected.
- **Exit:** PI-12 built non-actuating; C14 actuation-breach structurally closed; civilization-readiness criteria (`EXEC-0001` §10 CR-1..CR-6) met.
- **Success:** civilization modeled as non-actuating governed/simulation objects; INV-CORE-12 + existential invariants binding.
- **Failure:** any civilization actuation; build attempted before `AD-0014` release.
- **Rollback:** revert the fabric forward; `AD-0014` deferral reinstated; no actuation persists.

## Gate N — Future Discovery Gate  *(Wave N; standing)*
- **Entry:** Gate 2 (governance hardening + enactment; INV-20 umbrella if elected).
- **Exit:** admission gate operational — RC-068..RC-100+ enter by registration, not baseline re-authoring.
- **Success:** new discovery/language/domain classes admitted additively (Gate A/Gate B/INV-13/O-16), single-owner, Evolution-committed, Board-authorized, audited.
- **Failure:** admission by baseline re-authoring / core redesign; ungoverned/silent admission.
- **Rollback:** reject the admission (deny-by-default); no core change persists.

---

## 1. Gate summary

| Gate | Wave | Master condition | Terminal effect |
|:----:|:----:|------------------|-----------------|
| 0 | 0 | **G0 = PASS** (lift block) | Unblocks all build |
| 1 | 1 | 12 L1 fabrics realized | Existence floor (DONE) |
| 2 | 2 | Core + **enactment (Non-Actuation + CRC)** + temporal | Sound kernel; gates Wave 4 |
| 3 | 3 | **UCC-4 Operational Certification** | **PRODUCTION READY** |
| 4 | 4 | PI-10 ratified (post-Non-Actuation) | Governed cognition |
| 5 | 5 | PI-11 ratified | Non-actuating projection |
| 6 | 6 | PI-13 ratified (post ledger-restore) | Propose-not-act economics |
| 7 | 7 | PI-12 + `AD-0014` release | **CIVILIZATION READY** |
| N | N | Admission gate operational | Standing future discovery |

## 2. Determination

> **Nine execution stage gates (Gate 0..N) are defined**, each with Entry / Exit / Success / Failure / Rollback
> criteria, all fail-closed and additive-forward. **Gate 0 (Governance Closure) is the master gate** — until
> G0 = PASS, every subsequent gate is unreachable. **Gate 3 exit = PRODUCTION READY**; **Gate 7 exit =
> CIVILIZATION READY** (held under `AD-0014`). No gate is waivable; non-waivable S1/S3/S4 hold at every gate;
> rollback is always corrective forward migration, never destructive.

## 3. Scope discipline
No code, requirement, RC class, invariant, or authorization produced. INV-1..13, `AUTH-012`, `AD-0014`, Article
IX lock unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands.

## 4. Traceability
- **Consumes:** `UCOS-EP-0002/0003`; `UCOS-RA-0006` (stage exits); `UCOS-EXEC-0001` Part V; `UCOS-EA-0003` (G0); `UCOS-RA-0005` (production/UCC-4).
- **Refined by:** `UCOS-EP-0007` (critical path), `UCOS-EP-0008` (authority).
- **Owner:** UCOS Authority Board.

**END `UCOS-EP-0006` — EXECUTION STAGE GATES · GATE 0..N · EACH: ENTRY/EXIT/SUCCESS/FAILURE/ROLLBACK · FAIL-CLOSED · ADDITIVE-FORWARD ROLLBACK · GATE 0 = MASTER (G0) · GATE 3 = PRODUCTION READY · GATE 7 = CIVILIZATION READY (AD-0014) · PLANNING ONLY.**
