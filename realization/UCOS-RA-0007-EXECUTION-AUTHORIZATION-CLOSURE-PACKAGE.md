# UCOS-RA-0007 — Execution Authorization Closure Package

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-RA-0007` |
| Program | **UCOS Phase 1.5 — Realization Closure Authority** |
| Phase | RA-7 — Execution Authorization Closure |
| Mode | **REALIZATION-AUTHORITY CLOSURE SPECIFICATION ONLY** — specifies, per blocker, the closure procedure, evidence required, verifier required, acceptance test, and authorization authority. It closes nothing itself and issues no authorization; it is the executable closure package the Authority Board consumes. |
| Status | REALIZATION BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Inputs (read-only) | `UCOS-EA-0001` (blockers); `UCOS-EA-0002` (closure criteria); `UCOS-EA-0003` (acceptance tests AT-P0-1/2/3, AT-P1-7; gate G0); `UCOS-EA-0004` (G0=FAIL); `AUTH-REST-004`; `REAL-C-05`/`REAL-M-03`/`REAL-C-01` instruments; `AD-0009` (Approval-Required) |
| Governing constraints | INV-1..13 unchanged; `AD-0014` intact; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. No new requirements/RC/invariants; **this artifact does not lift the lock.** |

---

## 0. Purpose

Phase RA-7 closes out the four **execution-authorization** blockers that constitute the Final Execution Gate
**G0 = EA-B-P0-1 ∧ EA-B-P0-2 ∧ EA-B-P1-7 ∧ EA-B-P0-3**. For each, this package states the **Closure Procedure**,
the **Evidence Required**, the **Verifier Required**, the **Acceptance Test**, and the **Authorization
Authority**. G0 is currently **FAIL** (`UCOS-EA-0004`). The three evidentiary items (P0-1, P0-2, P1-7) are
executable **now, under the standing block** (they require evidence, not construction); the fourth (P0-3) is the
Board authorization pivot that lifts the block. This package is the closure specification; **it performs no
attestation, no re-measurement, no re-issue, and no authorization act.**

---

## 1. EA-B-P0-1 — Authority-chain & PI-8/PI-9 attestation *(Evidentiary; P0)*

| Field | Specification |
|-------|---------------|
| **Blocker** | The reconciled `AUTH-012` chain (AD-0001..0023 @ v1.0.13) and the PI-8/PI-9 ratifications are **self-attested** — "absence of evidence = unproven." |
| **Closure procedure** | An **independent** adjudicator (not the authoring agent) reviews `AUTH-REST-004` (documentary restoration), the AD-0016..0023 enrollment, and the PI-8 (`ONTO-RAT-001`) / PI-9 (`MEM-RAT-003`) ratifications; produces an independent attestation of record; runs it through the `REAL-H-07` pre-construction enrollment gate. |
| **Evidence required** | `REAL-C-05` independent adjudication report; `REAL-H-07` gate result; enrolled `AUTH-012` v1.0.13 chain of record. |
| **Verifier required** | **Independent adjudicator** (distinct from any authoring/self-attesting party). Self-attestation is explicitly rejected. |
| **Acceptance test (AT-P0-1)** | An independent party attests the chain **and** the PI-8/PI-9 ratifications; `REAL-H-07` returns **PASS**; self-attestation rejected. |
| **Authorization authority** | UCOS Authority Board (accepts the attestation of record). |
| **Wave** | **W1** (executable now; no build). |

---

## 2. EA-B-P0-2 — Program-state reproducibility *(Evidentiary; P0)*

| Field | Specification |
|-------|---------------|
| **Blocker** | Historical `PROJECT-STATE §0W` divergence (213/213 & "Memory REJECTED" vs reproduced 269/269) is **not independently reproducible**; suite count 36 vs 40 unresolved. |
| **Closure procedure** | An **independent** re-measurement re-runs the recorded test corpus from the recorded program state; reconciles the `§0W` divergence; resolves the suite count to a single number of record (per `REAL-M-03`). |
| **Evidence required** | `REAL-M-03` independent re-run log; reconciled state note; single suite-count-of-record. |
| **Verifier required** | **Independent re-measurement** party (not the authoring agent). |
| **Acceptance test (AT-P0-2)** | Independent re-measurement reproduces **269/269** from recorded state; `§0W` divergence reconciled; suite count resolved to one number. |
| **Authorization authority** | UCOS Authority Board (accepts the re-measurement of record). |
| **Wave** | **W1** (executable now; no build). |

---

## 3. EA-B-P1-7 — Terminal certification re-issue *(Evidentiary; P1)*

| Field | Specification |
|-------|---------------|
| **Blocker** | The terminal certification instrument is **stale** (R14 `UCOM-ULTIMATE-CERT-001`: 134/134, "Memory REJECTED", "chain DEFECTIVE") — decisions relying on it are wrong. |
| **Closure procedure** | Re-issue the terminal certificate (`REAL-C-01`) as **`UCOM-ULTIMATE-CERT-002`** reflecting the attested state: 269/269, memory **ACCEPTED**, chain state consistent with the EA-B-P0-1 attestation; supersede R14 of record. |
| **Evidence required** | `UCOM-ULTIMATE-CERT-002` (re-issued); supersession link from R14; consistency with AT-P0-1 attestation. |
| **Verifier required** | Certification authority re-issuing under `REAL-C-01`, grounded in the AT-P0-1 / AT-P0-2 evidence. |
| **Acceptance test (AT-P1-7)** | `UCOM-ULTIMATE-CERT-002` issued: 269/269, memory ACCEPTED, chain state matches AT-P0-1; R14 superseded. |
| **Authorization authority** | UCOS Authority Board (accepts the re-issued certificate). |
| **Wave** | **W2** (executable now; depends on W1 evidence state). |

---

## 4. EA-B-P0-3 — Construction block lift *(Governance; P0; the pivot)*

| Field | Specification |
|-------|---------------|
| **Blocker** | Construction stands under **`UCOS-CONSTRUCTION-BLOCKED`**; building any stage before the Board lifts the block and closes P0-1/P0-2/P1-7 is a constitutional violation (Article IX). |
| **Closure procedure** | The Authority Board issues an **authorization act** that (a) records AT-P0-1, AT-P0-2, AT-P1-7 as **PASS**, (b) records `REAL-C-01` re-issued (EA-B-P1-7 CLOSED), and (c) **lifts `UCOS-CONSTRUCTION-BLOCKED`** for the authorized scope under the Article IX lock — the C-6 / UCC-5 full-release act. |
| **Evidence required** | Board authorization act on record; block-lift record; full Article IX release link; citation of AT-P0-1/2 + AT-P1-7 PASS. |
| **Verifier required** | **UCOS Authority Board** (terminal authority, AUTH-009). |
| **Acceptance test (AT-P0-3)** | Board authorization act on record cites AT-P0-1, AT-P0-2, AT-P1-7 as PASS **and** lifts `UCOS-CONSTRUCTION-BLOCKED` for the authorized scope. |
| **Authorization authority** | **UCOS Authority Board** (sole; Approval-Required Operation per `AD-0009`). |
| **Dependency** | **Strictly dependent** — cannot close until EA-B-P0-1, EA-B-P0-2, and EA-B-P1-7 are CLOSED. It is the last P0 to close and the pivot for execution authorization. |
| **Wave** | **W3** (the pivot; opens the frontier). |

---

## 5. Closure sequence & gate arithmetic

```
W1  ┌─ EA-B-P0-1  (REAL-C-05 attestation)      ─┐
    └─ EA-B-P0-2  (REAL-M-03 re-measurement)    ─┤
                                                 ├─►  W2  EA-B-P1-7  (REAL-C-01 → UCOM-ULTIMATE-CERT-002)
                                                 │                          │
                                                 └──────────────────────────┴─►  W3  EA-B-P0-3  (Board act; lift block)
                                                                                        │
                                                                                        ▼
                                                                        G0 = P0-1 ∧ P0-2 ∧ P1-7 ∧ P0-3 = PASS
```

| Gate element | Current value | Closes in | Verifier |
|--------------|:-------------:|:---------:|----------|
| AT-P0-1 | FALSE | W1 | Independent adjudicator |
| AT-P0-2 | FALSE | W1 | Independent re-measurement |
| AT-P1-7 | FALSE | W2 | Certification authority (`REAL-C-01`) |
| AT-P0-3 | FALSE | W3 | Authority Board |
| **G0** | **FAIL** | on W3 | Authority Board |

> **Decision rule (`UCOS-EA-0003 §6`):** `AUTHORIZE ⇔ G0 = TRUE`. All four elements are currently FALSE. None of
> W1/W2/W3 requires construction — the entire gate closes by **evidence + one Board act**. Upon **G0 = PASS**,
> execution flips BLOCKED → AUTHORIZED for the authorized scope, and the roadmap frontier (`UCOS-RA-0006` Stages
> 6–13+N) becomes buildable in order.

---

## 6. Determination

> **The four execution-authorization blockers have a complete closure specification.** EA-B-P0-1, EA-B-P0-2, and
> EA-B-P1-7 are **evidentiary** — closable **now, under the standing block**, by an independent adjudicator, an
> independent re-measurement, and a certificate re-issue respectively. EA-B-P0-3 is the **governance pivot** —
> the single Authority-Board act that lifts `UCOS-CONSTRUCTION-BLOCKED` once the other three are PASS. No closure
> step requires construction or foundation redesign; the gate G0 is currently FAIL and flips to PASS on the
> W1→W2→W3 sequence. **This package specifies closure; it performs none of these acts and lifts no lock.**

## 7. Scope discipline

No attestation, re-measurement, certificate re-issue, or authorization act was performed. No code, schema,
requirement, invariant, or authorization was produced or modified. INV-1..13, `AUTH-012`, `AD-0014`, and the
Article IX lock are unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.** Lifting the block is reserved to the UCOS
Authority Board (Approval-Required, `AD-0009`).

## 8. Traceability

- **Consumes:** `UCOS-EA-0001` (blockers), `UCOS-EA-0002` (closure criteria), `UCOS-EA-0003` (AT-P0-1/2/3, AT-P1-7; G0), `UCOS-EA-0004` (G0=FAIL); `AUTH-REST-004`; `REAL-C-05`/`REAL-M-03`/`REAL-C-01`; `AD-0009`.
- **Refined by:** `UCOS-RA-0008` (Final Determination); the Authority-Board authorization act (G0 closure).
- **Owner:** UCOS Authority Board.

**END `UCOS-RA-0007` — EXECUTION AUTHORIZATION CLOSURE PACKAGE · EA-B-P0-1 / P0-2 / P1-7 (EVIDENTIARY, W1/W2) · EA-B-P0-3 (BOARD PIVOT, W3) · EACH: PROCEDURE · EVIDENCE · VERIFIER · ACCEPTANCE TEST · AUTHORITY · G0 = FAIL → PASS ON W1→W2→W3 · NO ACT PERFORMED · LOCK NOT LIFTED · SPECIFICATION ONLY.**
