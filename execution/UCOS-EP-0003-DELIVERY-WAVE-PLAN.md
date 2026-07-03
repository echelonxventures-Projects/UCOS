# UCOS-EP-0003 — Delivery Wave Plan

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-EP-0003` |
| Program | **UCOS Phase 2 — Master Execution Program** |
| Phase | EP-3 — Delivery Waves |
| Mode | **EXECUTION PLANNING ONLY** — no audit, no redesign, no new requirement/RC class, no scope expansion. |
| Status | EXECUTION BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EXEC-0001`; `UCOS-RA-0006` (Stage 0..N); `UCOS-EP-0001/0002`; `UCOS-EA-0001..0004` |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |

---

## 0. Purpose

This plan organizes the execution backlog (`UCOS-EP-0002`) into the charter's delivery waves and binds each wave
to the ratified stage sequence (`UCOS-RA-0006`). Each wave records its **objective, member work packages, entry
condition, exit condition, and blocking status**. Waves execute in ascending order with the documented
parallelism; **no wave begins before its entry condition holds**, and every build wave is downstream of the
Wave 0 execution gate (G0).

---

## 1. Wave definitions

### Wave 0 — Governance Closure  *(Stage 0; GATE; no build)*
- **Objective:** close the three P0 governance-integrity blockers and lift the construction block (open G0).
- **Packages:** `EWP-00-ATTEST`, `EWP-00-REMEAS`, `EWP-00-CERT`, `EWP-00-LIFT`.
- **Entry:** documentary chain restoration of record (`AUTH-REST-004`, v1.0.13).
- **Exit:** **G0 = PASS** — EA-B-P0-1 ∧ P0-2 ∧ P1-7 ∧ P0-3 CLOSED; `UCOS-CONSTRUCTION-BLOCKED` lifted for the authorized scope.
- **Status:** **OPEN — GATING. No subsequent wave may build until Wave 0 exits.**

### Wave 1 — Foundational Runtime  *(Stages 1–2; DONE)*
- **Objective:** substrate + control plane (the 12 L1 fabrics).
- **Packages:** `EWP-F-REG/META/CFG/EXEC/EVT`, `EWP-F-IDENT/TRUST/POL/SEC/AUTH`, `EWP-F-EVO/AUDIT/STATE/GOV`.
- **Entry:** genesis roots seeded. **Exit:** 269/269; deny-by-default; S1/S3/S4; Evolution-only commit.
- **Status:** **REALIZED** (PI-2/3/4/6). Residual: foundational-chain attestation folded into Wave 0.

### Wave 2 — Core Runtime  *(Stages 3–5 DONE; Stages 6–8 forward)*
- **Objective:** federation + core data primitives (DONE); then primitive convergence (soundness), constitutional enactment, and temporal realization.
- **Packages (DONE):** `EWP-C-FED/KNOW/ONTO/MEM`. **Packages (forward):** `EWP-A-AUTHUNIV/AUDITUNIV/LIFEUNIV/POLVOCAB/MEMMETA` (Stage 6, optional), `EWP-E-NONACT/CRC` (Stage 7, enact), `EWP-A-TIME` (Stage 8, temporal).
- **Entry:** Wave 1 realized + **G0 = PASS** (for the forward packages). **Exit:** convergence primitives adopted (EA-B-P1-1/2/3/4/8 CLOSED); INV-CORE-12 + CRC enacted (Stage 7); FAB-TIME realized (RR-7).
- **Status:** DONE (PI-5/7/8/9) + forward (gated on G0). Convergence is Optional; enactment (Non-Actuation) is **mandatory before Wave 4**.

### Wave 3 — Distributed Runtime  *(Stage 13; production)*
- **Objective:** durable/distributed adapters + platform-factory catalog + observability + Operational Certification.
- **Packages:** `EWP-D-SCALE` (EA-B-P1-5), `EWP-D-PFC` (EA-B-P1-6, opt), `EWP-D-OBS` (UCC-6), `EWP-D-OPCERT` (UCC-4).
- **Entry:** G0 = PASS; MCR realized. **Exit:** scale > 10⁶; measured NFRs meet `UCOS-ASR-NFR-001` floors; G12-1/2/3 CLOSED.
- **Status:** forward. **Exit of Wave 3 = PRODUCTION READY.**

### Wave 4 — Intelligence  *(Stage 9; deferred)*
- **Objective:** governed cognition fabric (PI-10).
- **Packages:** `EWP-B-INTEL`.
- **Entry:** **`EWP-E-NONACT` (INV-CORE-12) enrolled first** (hard precondition); PI-5/7/8/9; `AD-0024`.
- **Exit:** deny-by-default; propose-not-act; Evolution-only commit; I1–I12 adversarial green (RR-8).
- **Status:** DEFERRED — safety-ordered behind Wave 2 enactment.

### Wave 5 — Simulation  *(Stage 10; deferred)*
- **Objective:** non-actuating projection/what-if fabric (PI-11).
- **Packages:** `EWP-B-SIM`. **Entry:** ONTO/STATE/EVO/GOV; Stage 8 (temporal) for time-projection; `AD-0022`.
- **Exit:** sandboxed; Evolution-only commit; S1–S12 0 residual High/High. **Status:** DEFERRED.

### Wave 6 — Economics  *(Stage 11; deferred)*
- **Objective:** propose-not-act economic fabric (PI-13).
- **Packages:** `EWP-B-ECON`. **Entry:** EVO/REG/META/GOV/AUDIT; **AUTH-012 ledger restoration first**; scoped release.
- **Exit:** conservation-checked settlement; no real-money path without AD-0009; EC1–EC15. **Status:** DEFERRED.

### Wave 7 — Civilization  *(Stage 12; deferred, `AD-0014`)*
- **Objective:** conceptual, non-actuating civilization fabric (PI-12).
- **Packages:** `EWP-B-CIV`. **Entry:** ONTO/FED/GOV; Wave 5 (Simulation) for digital-twin; **`AD-0014` release**.
- **Exit:** non-actuating; C14 actuation-breach structurally closed. **Status:** DEFERRED — held under `AD-0014`.

### Wave N — Future Discovery  *(Stage N; standing)*
- **Objective:** operate the unknown-future admission gate.
- **Packages:** `EWP-N-ADMIT`. **Entry:** Stage 6 (governance hardening); Stage 7 (INV-20 umbrella if elected).
- **Exit:** RC-068..RC-100+ enter by registration, not baseline re-authoring (RR-9). **Status:** DEFERRED — standing capability.

---

## 2. Wave sequence, parallelism & gating

```
Wave 0 [GATE: G0]                         ← OPEN; gates everything
   │  (no build; W1→W2→W3)
   ▼
Wave 1 [DONE] ── Wave 2 core DONE ─┬─ Wave 2 convergence (Stage 6, optional)      ┐ parallel after
                                   ├─ Wave 2 enactment (Stage 7: NONACT + CRC)    │ Wave 1+G0
                                   └─ Wave 2 temporal (Stage 8, after CRC)        ┘
   │
   ├─► Wave 3 Distributed Runtime (Stage 13) ─────────────► PRODUCTION READY
   │
   └─► Wave 4 Intelligence (Stage 9)  ⟵ HARD-GATED on Wave 2 enactment (INV-CORE-12)
          └─► Wave 5 Simulation (Stage 10) ─► Wave 7 Civilization (Stage 12, AD-0014) ─► CIVILIZATION READY
       Wave 6 Economics (Stage 11)  ‖ parallel (ledger-restore first)
   Wave N Future Discovery (Stage N)  ‖ standing (after Stage 6/7)
```

| Wave | Stage(s) | Entry gate | Parallelizable with | Blocking? |
|:----:|:--------:|-----------|---------------------|:---------:|
| 0 | 0 | — | — | **Blocks all build** |
| 1 | 1–2 | genesis | — | DONE |
| 2 | 3–8 | Wave 1 + G0 | Wave 3 (after core) | enactment blocks Wave 4 |
| 3 | 13 | G0 | Wave 2 forward | — (→ Production) |
| 4 | 9 | Wave 2 enactment (NONACT) | Wave 6 | blocks Wave 5/7 |
| 5 | 10 | Wave 4 deps; temporal | Wave 6 | blocks Wave 7 |
| 6 | 11 | ledger restore | Wave 4/5 | — |
| 7 | 12 | Wave 5 + `AD-0014` | — | — (→ Civilization) |
| N | N | Stage 6/7 | any | standing |

---

## 3. Determination

> **The delivery wave plan is complete (Wave 0..7 + Wave N).** Every wave binds to a ratified stage, lists its
> member work packages, and declares entry/exit conditions. **Wave 0 (Governance Closure) is OPEN and gates all
> build**; Waves 1–2 (core) are REALIZED with a forward frontier (convergence/enactment/temporal); **Wave 3 exit
> = PRODUCTION READY**; Waves 4–7 are the deferred behavioral/civilization frontier (Intelligence hard-gated on
> Non-Actuation, Civilization held under `AD-0014`); **Wave 7 exit = CIVILIZATION READY**; Wave N is the standing
> admission capability. The plan honors 0 forward dependencies and the frozen deferral boundaries.

## 4. Scope discipline
No code, requirement, RC class, invariant, or authorization produced. INV-1..13, `AUTH-012`, `AD-0014`, Article
IX lock unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands.

## 5. Traceability
- **Consumes:** `UCOS-EP-0001/0002`; `UCOS-RA-0006` (stages); `UCOS-EA-0001` (blockers); `AD-0014/0022`.
- **Refined by:** `UCOS-EP-0004` (dependency authority), `UCOS-EP-0006` (gates), `UCOS-EP-0007` (critical path).
- **Owner:** UCOS Authority Board.

**END `UCOS-EP-0003` — DELIVERY WAVE PLAN · WAVE 0 (GOVERNANCE CLOSURE, OPEN/GATING) → WAVE 7 (CIVILIZATION, AD-0014) + WAVE N · WAVE 3 EXIT = PRODUCTION READY · WAVE 7 EXIT = CIVILIZATION READY · INTELLIGENCE HARD-GATED ON NON-ACTUATION · 0 FORWARD DEP · PLANNING ONLY.**
