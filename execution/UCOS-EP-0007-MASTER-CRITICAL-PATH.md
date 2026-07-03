# UCOS-EP-0007 — Master Critical Path

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-EP-0007` |
| Program | **UCOS Phase 2 — Master Execution Program** |
| Phase | EP-7 — Master Critical Path |
| Mode | **EXECUTION PLANNING ONLY** — no audit, no redesign, no new requirement/RC class, no scope expansion. |
| Status | EXECUTION BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EP-0002/0003/0004/0006`; `UCOS-RA-0006/0008`; `UCOS-EA-0004` (G0=FAIL) |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |

---

## 0. Purpose & current state

This determines the **shortest valid route** from the current state to **PRODUCTION READY** and to
**CIVILIZATION READY**, honoring every gate, dependency, and deferral in the frozen corpus. "Shortest valid"
means the minimal ordered set of mandatory work packages whose completion satisfies the terminal gate — no
package may be skipped, none reordered against a dependency, and no deferral boundary crossed without its Board
act.

**Current state of record (`UCOS-RA-0008`):** Constitutional = CERTIFIED (conditional); Implementation = **MCR
REALIZED** (Stages 0–5, 269/269); Production = NOT ACHIEVED; Civilization = DEFERRED (`AD-0014`); Execution
authorization = **BLOCKED (G0 = FAIL)**.

---

## 1. Master critical path to PRODUCTION READY

The minimal route (7 nodes; each mandatory; Optional convergence excluded as it does not gate production):

```
[CURRENT: MCR realized, G0=FAIL]
   │
   1. EWP-00-ATTEST   (REAL-C-05 independent attestation)      ─┐  Wave 0
   2. EWP-00-REMEAS   (REAL-M-03 independent re-measurement)   ─┤  (parallel W1)
   │                                                            │
   3. EWP-00-CERT     (REAL-C-01 → UCOM-ULTIMATE-CERT-002)       │  Wave 0 (W2)
   4. EWP-00-LIFT     (Board act → lift UCOS-CONSTRUCTION-BLOCKED)│  Wave 0 (W3) ── G0 = PASS
   │                                                            
   5. EWP-D-SCALE     (durable/distributed adapters; EA-B-P1-5)   Wave 3   [EWP-D-OBS ∥ decide PE-12]
   6. EWP-D-OPCERT    (provision ENV + pipeline + DR + measured NFRs; G12-1/2/3)  Wave 3
   │
[PRODUCTION READY]  ═══ UCC-4 CLOSED ═══
```

| # | Node | Gate | Class | Blocking edge |
|:-:|------|:----:|:-----:|---------------|
| 1 | EWP-00-ATTEST | Gate 0 | A (evidentiary) | root |
| 2 | EWP-00-REMEAS | Gate 0 | A (evidentiary) | root (∥ with 1) |
| 3 | EWP-00-CERT | Gate 0 | A (evidentiary) | needs 1,2 |
| 4 | EWP-00-LIFT | **Gate 0** | A (Board pivot) | needs 1,2,3 ⇒ **G0=PASS** |
| 5 | EWP-D-SCALE | Gate 3 | A+G (build/provision) | needs 4 |
| 6 | EWP-D-OPCERT | **Gate 3** | A (operational cert) | needs 5, EWP-D-OBS ⇒ **PRODUCTION READY** |

- **Length: 6 mandatory packages** (1–2 run in parallel ⇒ 5 sequential steps).
- **Binding constraint:** Wave 0 is **evidence + one Board act (no build)**; the only build is scale-out +
  operational evidence. **No new substrate, no redesign** — consistent with `UCOS-RA-0008`.
- **Not on the production path:** Stage 6 convergence (Optional), Stage 7 enactment, Stage 8 temporal, and the
  entire behavioral frontier — production does not require them.

## 2. Master critical path to CIVILIZATION READY

The minimal route extends past G0 through enactment and the behavioral frontier (each a Board-authorized scoped
release; `AD-0014` gates the terminal node):

```
[G0 = PASS]  (nodes 1–4 above)
   │
   5'. EWP-E-NONACT   (enroll INV-CORE-12 Non-Actuation)         Gate 2 (Stage 7)   [EWP-E-CRC ∥]
   6'. EWP-B-INTEL    (PI-10 Intelligence; AD-0024; I1–I12)      Gate 4 (Stage 9)   ⟵ requires 5'
   7'. EWP-B-SIM      (PI-11 Simulation; AD-0022; S1–S12)        Gate 5 (Stage 10)
   8'. EWP-B-CIV      (PI-12 Civilization; AD-0014 release)      Gate 7 (Stage 12)
   │
[CIVILIZATION READY]  ═══ CR-1..CR-6 met (EXEC-0001 §10) ═══
```

| # | Node | Gate | Deferral / precondition |
|:-:|------|:----:|-------------------------|
| 5' | EWP-E-NONACT | Gate 2 | Board enrollment (Constitutional Majority); **hard precondition for 6'** |
| 6' | EWP-B-INTEL | Gate 4 | scoped release `AD-0024`; must follow 5' |
| 7' | EWP-B-SIM | Gate 5 | `AD-0022`; temporal (Stage 8) for time-projection |
| 8' | EWP-B-CIV | Gate 7 | **`AD-0014` release** (terminal deferral) |

- **Length beyond G0: 4 mandatory scoped-release packages** (enactment → Intelligence → Simulation →
  Civilization). Temporal (`EWP-A-TIME`) is a prerequisite of Simulation time-projection fidelity and runs on
  the parallel Stage-8 track after CRC.
- **Terminal deferral:** node 8' cannot proceed until the Authority Board **releases `AD-0014`** — this is the
  single deliberate hold on civilization readiness, not a technical blocker.

## 3. Consolidated route map

```
CURRENT (MCR; G0=FAIL)
   └─► Wave 0 (ATTEST ∥ REMEAS → CERT → LIFT)  ══ G0=PASS ══╗
                                                            ├─► SCALE → OPCERT  ══► PRODUCTION READY   (6 pkgs)
                                                            └─► NONACT → INTEL → SIM → CIV(AD-0014) ══► CIVILIZATION READY
                                                                 (+ TIME on parallel Stage-8 track feeding SIM)
```

| Terminal state | Shortest valid route | Mandatory packages | Gating condition |
|----------------|----------------------|:------------------:|------------------|
| **PRODUCTION READY** | G0 → SCALE → OPCERT | **6** | UCC-4 (G12-1/2/3) |
| **CIVILIZATION READY** | G0 → NONACT → INTEL → SIM → CIV | **6 + 4 = 10** | INV-CORE-12 + scoped releases + **`AD-0014`** |

## 4. Determination

> **The shortest valid route to PRODUCTION READY is six mandatory work packages** — the four Wave-0 governance-
> closure packages (ATTEST ∥ REMEAS → CERT → LIFT, achieving G0 = PASS) followed by scale-out (`EWP-D-SCALE`)
> and Operational Certification (`EWP-D-OPCERT`, UCC-4). The path is **evidence + one Board act + additive
> scale-out**; **no new substrate, no redesign, no constitutional change.** The shortest valid route to
> **CIVILIZATION READY** extends this by four Board-authorized scoped-release packages — Non-Actuation
> enrollment → Intelligence → Simulation → Civilization — with the terminal node held under **`AD-0014`**. As of
> this determination, **both routes begin at the single open governance pivot `EWP-00-LIFT` (G0 = FAIL)**;
> nothing on either route requires foundation redesign.

## 5. Scope discipline
No code, requirement, RC class, invariant, or authorization produced. INV-1..13, `AUTH-012`, `AD-0014`, Article
IX lock unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands.

## 6. Traceability
- **Consumes:** `UCOS-EP-0002/0003/0004/0006`; `UCOS-RA-0006/0008`; `UCOS-EA-0004` (G0).
- **Refined by:** `UCOS-EP-0008` (Master Execution Authority).
- **Owner:** UCOS Authority Board.

**END `UCOS-EP-0007` — MASTER CRITICAL PATH · PRODUCTION READY = 6 PACKAGES (G0 → SCALE → OPCERT) · CIVILIZATION READY = +4 (NONACT → INTEL → SIM → CIV/AD-0014) · BOTH BEGIN AT EWP-00-LIFT (G0=FAIL) · 0 REDESIGN · PLANNING ONLY.**
