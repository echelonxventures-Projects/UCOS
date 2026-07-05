# CONSTITUTIONAL-LOCK-ENGINE (PHASE G.2 · WS2 / WS7)

> **PHASE G.2 · Constitutional Lock Registry & Engine · SPECIFICATION + GOVERNANCE LOCK MAPPING**
> Source of truth: `registry/program/constitutional-locks.json`. Engine: `tools/program-compiler/src/constitutional-lock-engine.ts`.
> This document releases no lock and closes nothing. It records lock state exactly as evidence implies.

| Field | Value |
|-------|-------|
| Artifact ID | `CONSTITUTIONAL-LOCK-ENGINE` |
| Phase | **G.2** · Version 1.0.0 · Date 2026-07-03 |
| Registry | `registry/program/constitutional-locks.json` (`PROG-LOCK-001`) |
| Overall verdict (unchanged) | **NO_GO** |

---

## 1. Purpose

A **Constitutional Lock** is the release gate a constitutional closure (REAL-C-03/04/05) sits
behind. The Constitutional Lock Engine computes each lock's **effective state** from the closure
verdict and the external-blocker model, so agents can see at a glance whether a lock is
software-releasable or requires an external actor.

## 2. Lock lifecycle

```
   OPEN ─────────────┐
     │               │  (closure verdict becomes available)
     ▼               ▼
   LOCKED        EXTERNAL_LOCKED
     │  (no external      │  (gated by an external blocker;
     │   blocker;         │   NOT releasable by software)
     │   internally       │
     │   solvable)        │
     └───────┬────────────┘
             │  evidence satisfies ALL closure criteria (closure verdict = GO)
             ▼
          RELEASED
```

**Invariant (WS2):** a lock moves to `RELEASED` **only** when evidence satisfies the closure
criteria — i.e. the computed closure verdict is `GO`. There is no manual release; no agent can
flip a lock. `EXTERNAL_LOCKED` is terminal for software: it can be re-evaluated only when a review
trigger fires (see the Rediscovery-Prevention report).

## 3. State computation (deterministic)

For each lock `L` mapped to closure `C`:

1. If no verdict is available for `C` → `OPEN`.
2. Else if verdict(`C`) = `GO` → `RELEASED` (evidence satisfies all criteria).
3. Else if an **active external blocker** targets `C` → `EXTERNAL_LOCKED`.
4. Else → `LOCKED` (internally blocked, no external actor required).

The engine is pure and deterministic; it reads closure verdicts (from `governance-closure.ts`),
the external-blocker determinations, and the evidence roll-ups only.

## 4. Governance Lock Mapping (WS7)

All three constitutional closures are mapped to locks. Each currently computes `EXTERNAL_LOCKED`
because each requires a governed action by an external actor, and none has a `GO` closure verdict.

| Lock | Closure | State | Verdict | Releasable by SW | Required actor | Required authority |
|------|---------|-------|---------|:----------------:|----------------|--------------------|
| `LOCK-REAL-C-05` | REAL-C-05 | **EXTERNAL_LOCKED** | NO_GO | **NO** | Authority Board (designation) + Independent Adjudicator (attestation) | Enrolled AUTH-012 Board decision; AUTH-009 SoD; AUTH-008 S1/S3/S4 |
| `LOCK-REAL-C-03` | REAL-C-03 | **EXTERNAL_LOCKED** | NO_GO | **NO** | Operations (human-executed, AD-0009) + Certification Authority | AD-0015; AD-0009; GATE-SEC/QUAL/REL-001 |
| `LOCK-REAL-C-04` | REAL-C-04 | **EXTERNAL_LOCKED** | NO_GO | **NO** | Authority Board (AD-0024) + Independent Adjudicator (ratification) | AD-0024 (not issued); AD-0022 conditional; AD-0014 |

### Release conditions

**LOCK-REAL-C-05** (permanently external — independence is intrinsic):
- Independent adjudicator model established with registered keys (G1 + G2)
- PI-8/PI-9 ratifications independently attested (proposer ≠ attestor) (G3)
- Retroactive AD-0016..0023 enrollment confirmed on the canonical AUTH-012 ledger
- R13/R14 ruling reconciled via REAL-C-01
- `EV-REAL-C-05`, `EV-PI8-RAT`, `EV-PI9-RAT` at `>= VERIFIED` via independent attestation

**LOCK-REAL-C-03** (external — governed human operations):
- ENV-DEV/INT provisioned with live apply logs (G12-1); pipeline promotion evidence (G12-2)
- Contract tests pass (API-018, API-027); DR drill with measured RPO/RTO (G12-3)
- Immutable audit trail + availability/p99 metrics captured; Operational Certification issued

**LOCK-REAL-C-04** (external gate, then internal — `postGateSoftwareSolvable = true`):
- AD-0024 scoped Article IX release issued (external Board act)
- PI-10 constructed additively (propose-not-act; I1..I12 adversarial 0 residual High/High)
- PI-11 constructed under AD-0022 conditional; 269 baseline preserved
- Independent PI-10 / PI-11 ratification (independence subject to LOCK-REAL-C-05)

## 5. Engine output (observed)

```
LOCK-REAL-C-05 (REAL-C-05): EXTERNAL_LOCKED [NO_GO] releasableBySoftware=false
LOCK-REAL-C-03 (REAL-C-03): EXTERNAL_LOCKED [NO_GO] releasableBySoftware=false
LOCK-REAL-C-04 (REAL-C-04): EXTERNAL_LOCKED [NO_GO] releasableBySoftware=false
```

`node tools/program-compiler/src/cli.ts locks` (`pnpm ucos:locks`) prints the full registry with
computed states, release conditions, and reasons.

## 6. Determinism & integrity

- `pnpm ucos:verify` → determinism **PASS**, fingerprint **stable** (`a581025a35912a76`), acyclic **PASS**.
- The lock engine cannot release a lock; only a `GO` closure verdict produces `RELEASED`, and that
  requires independently `>= VERIFIED` evidence — which none of the three closures has.

**END CONSTITUTIONAL-LOCK-ENGINE — 3 locks mapped · all EXTERNAL_LOCKED · none software-releasable · release requires GO closure verdict · NO_GO unchanged.**
