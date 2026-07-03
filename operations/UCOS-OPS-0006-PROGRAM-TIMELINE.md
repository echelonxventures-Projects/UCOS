# UCOS-OPS-0006 — Program Timeline

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-OPS-0006` |
| Program | **UCOS Execution Control Center — Program Operations Authority** |
| Phase | OPS-6 — Program Timeline |
| Mode | **OPERATIONS CONTROL ONLY** — sequences the corpus-defined states and milestones. Adds no plan, no schedule commitment, no new milestone. State transitions are **event-gated, not date-gated**. |
| Status | OPS BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Inputs (read-only, frozen) | `UCOS-EP-0003` (waves); `UCOS-EP-0006` (gates); `UCOS-EP-0007` (critical path); `UCOS-RA-0007` (closure sequence); `UCOS-G0-0006`; `UCOS-EA-0004`; `UCOS-EP-0008` |
| Governing constraints | Corpus FROZEN. Transitions are gated by evidence/authority events, not calendar dates. `UCOS-CONSTRUCTION-BLOCKED` stands. |

---

## 0. Timeline convention

The UCOS program advances by **event-gated state transitions**, not elapsed time. Each transition fires **only**
when its gate evidence exists of record. This timeline therefore records **states and the events that separate
them** — never predicted dates. No transition may be assumed, waived, or accelerated (`UCOS-EP-0006 §2`).

---

## 1. Current state (as of 2026-07-03)

| Attribute | Value |
|-----------|-------|
| **State name** | **S0 — GOVERNANCE-BLOCKED (G0 = FAIL)** |
| Gate posture | Gate 0 BLOCKED; Gate 1 COMPLETE; Gate 2 core COMPLETE / forward BLOCKED |
| Evidence | 0 of 14 atomic requirements MET |
| Lock | `UCOS-CONSTRUCTION-BLOCKED` stands; Article IX generation lock ACTIVE |
| Realizability | 0 REDESIGN · 0 unrealizable · 0 forward deps · 0 cycles |
| Substrate | Minimum Constitutional Runtime REALIZED (Stages 0–5, 269/269) |
| Determination of record | EXECUTION BLOCKED (`UCOS-EA-0004`, `UCOS-EP-0008`, `UCOS-G0-0006`) |
| Executable now | W1 evidentiary acts (`EWP-00-ATTEST` ∥ `EWP-00-REMEAS`) — independent, no build |

---

## 2. Next state (the immediate transition)

| Attribute | Value |
|-----------|-------|
| **Target state** | **S1 — GATE-ZERO CLEARED (G0 = PASS)** |
| Transition event | Completion of **W1 → W2 → W3** = the Authority-Board **A-1 lift act** (BA-4) recorded on `AUTH-012` |
| Entry sequence | R-1 ∥ R-2 → BA-1 ∥ BA-2 → C-1 → BA-3 → BA-4/A-1 (`UCOS-OPS-0005 §5`) |
| Preconditions | LE-1 (AT-P0-1) ∧ LE-2 (AT-P0-2) ∧ LE-3 (AT-P1-7) PASS of record; no `INV-L-1..8` invalidator |
| Effect on entry | `UCOS-CONSTRUCTION-BLOCKED` LIFTED for named scope; **EXECUTION MAY COMMENCE**; Gate 2 forward + Gate 3 become buildable |
| Reversibility | Governance-integrity; no redesign; fully reversible via the same evidence waves |

---

## 3. Future states (post-G0 sequence)

| State | Name | Entry event (gate) | Terminal effect |
|:-----:|------|--------------------|-----------------|
| **S2** | CORE HARDENED | Gate 2 forward: convergence (opt) + **INV-CORE-12 + CRC enactment (A-2)** + FAB-TIME | Sound kernel; unblocks Gate 4 |
| **S3** | **PRODUCTION READY** | Gate 3: durable/distributed adapters + **UCC-4** (G12-1∧G12-2∧G12-3) + NFR floors + UCC-6 | Distributed runtime certified for production (ENV-PROD via A-7) |
| **S4** | GOVERNED COGNITION | Gate 4: PI-10 built + ratified (post Non-Actuation) `AD-0024` | Propose-not-act intelligence, 0 autonomous actuation |
| **S5** | NON-ACTUATING PROJECTION | Gate 5: PI-11 built + sandboxed `AD-0022` | What-if/simulation, no SoR mutation |
| **S6** | PROPOSE-NOT-ACT ECONOMICS | Gate 6: PI-13 (post `AUTH-012` ledger restore) | Conservation-checked settlement, no real-money without `AD-0009` |
| **S7** | **CIVILIZATION READY** | Gate 7: PI-12 non-actuating + **`AD-0014` release** + CR-1..CR-6 | Civilization modeled as non-actuating governed objects |
| **SN** | STANDING FUTURE-DISCOVERY | Gate N: admission gate operational | RC-068..RC-100+ admitted by registration, not re-authoring |

> **Two terminal milestones:** **S3 = PRODUCTION READY** (Gate 3 exit) and **S7 = CIVILIZATION READY**
> (Gate 7 exit, held under `AD-0014`). S4–S7 are the deferred behavioral/civilization frontier; Intelligence
> (S4) is **hard-gated** behind Non-Actuation enrollment (S2).

---

## 4. Critical milestones (ordered; event-gated)

| # | Milestone | Gate | Depends on | State when reached |
|:-:|-----------|:----:|------------|:------------------:|
| **M0** | Independent attestation + re-measurement lodged (AT-P0-1 ∧ AT-P0-2 PASS) | — | R-1 ∥ R-2 | (within S0→S1) |
| **M1** | Terminal certificate `UCOM-ULTIMATE-CERT-002` issued (AT-P1-7 PASS) | — | M0 | (within S0→S1) |
| **M2** | **Board A-1 lift act on `AUTH-012` ⇒ G0 = PASS** | Gate 0 | M0 ∧ M1 | **S1** |
| **M3** | INV-CORE-12 (Non-Actuation) + CRC enacted | Gate 2 | M2 | S2 |
| **M4** | **UCC-4 Operational Certification ⇒ PRODUCTION READY** | Gate 3 | M2 | **S3** |
| **M5** | PI-10 Intelligence ratified | Gate 4 | M3 | S4 |
| **M6** | PI-11 Simulation ratified | Gate 5 | M5 | S5 |
| **M7** | PI-13 Economics ratified | Gate 6 | ledger restore | S6 |
| **M8** | **PI-12 + `AD-0014` release ⇒ CIVILIZATION READY** | Gate 7 | M6 | **S7** |
| **M9** | Future-discovery admission gate operational | Gate N | M3 | SN |

**M2 is the hinge milestone** — the single Authority-Board act that converts the entire 0% forward index into a
buildable program. Everything from M3 onward is unreachable until M2 is of record.

---

## 5. Timeline diagram (state → state, event-gated)

```
[NOW · 2026-07-03]
   S0  GOVERNANCE-BLOCKED (G0 = FAIL · 0/14 · block stands)
        │
        │  M0: R-1 ∥ R-2  (independent attestation + re-measurement)   ← executable now, no build
        │  M1: C-1        (UCOM-ULTIMATE-CERT-002 issued)
        │  M2: BA-4/A-1   (Board lift act on AUTH-012)  ── THE HINGE
        ▼
   S1  GATE-ZERO CLEARED (G0 = PASS · block lifted for named scope)
        │
        ├─ M3 ─► S2 CORE HARDENED (Non-Actuation enacted)
        │           └─ M5 ─► S4 ─ M6 ─► S5 ─ M8 ─► S7 CIVILIZATION READY (AD-0014)
        │           M7 ─► S6 ECONOMICS ‖   ·   M9 ─► SN FUTURE-DISCOVERY (standing)
        │
        └─ M4 ─► S3 PRODUCTION READY (UCC-4)   ← nearest terminal milestone after S1
```

---

## 6. Timeline control rules

1. **No date commitments.** Transitions fire on evidence/authority events, never on elapsed time.
2. **No skipping.** W1 → W2 → W3 order is non-negotiable; no forward state is reachable before S1.
3. **Fail-closed.** A failed evidentiary wave or a withheld/void Board act holds the program at its current
   state; rollback is corrective-forward (INV-10), never destructive.
4. **Independence.** M0 requires parties independent of the authoring process; self-attestation cannot advance
   the timeline.
5. **Deferral integrity.** S4–S7 remain deferred behind their named authority gates (`AD-0024/0022/0014`);
   S7 is held under `AD-0014` until an A-6 disposition.

---

## 7. Determination (timeline level)

> The program timeline is fixed and event-gated. **Current state: S0 — GOVERNANCE-BLOCKED (G0 = FAIL).** The
> **next state is S1 — GATE-ZERO CLEARED**, reached only through **M0 → M1 → M2**, where **M2 (the Board A-1
> lift act) is the hinge** of the entire program. Beyond S1 lie two terminal milestones — **S3 PRODUCTION READY
> (M4)** and **S7 CIVILIZATION READY (M8, under `AD-0014`)** — plus the standing SN future-discovery capability.
> No transition is date-gated; each fires solely on evidence/authority of record. This timeline commits no
> schedule and creates no new milestone.

## 8. Scope discipline

No schedule committed, no milestone created, no state advanced, no lock lifted. INV-1..13, `AUTH-012`,
`AD-0014`, and the Article IX lock are unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.**

## 9. Traceability

- **Consumes:** `UCOS-EP-0003` (waves); `UCOS-EP-0006` (gates); `UCOS-EP-0007` (critical path); `UCOS-RA-0007`
  (closure sequence); `UCOS-G0-0006`; `UCOS-EA-0004`; `UCOS-EP-0008`.
- **Feeds:** `UCOS-OPS-0007` (operations manual).
- **Owner:** UCOS Authority Board.

**END `UCOS-OPS-0006` — PROGRAM TIMELINE · CURRENT S0 GOVERNANCE-BLOCKED (G0 = FAIL) · NEXT S1 GATE-ZERO CLEARED (VIA M0→M1→M2) · HINGE = M2 BOARD A-1 LIFT ACT · TERMINAL MILESTONES: S3 PRODUCTION READY (M4) · S7 CIVILIZATION READY (M8, AD-0014) · EVENT-GATED, NOT DATE-GATED · OPERATIONS CONTROL ONLY.**
