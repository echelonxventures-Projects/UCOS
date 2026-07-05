# EXTERNAL-BLOCKER-MODEL (PHASE G.2 · WS1)

> **PHASE G.2 · External Blocker Isolation · CONSTITUTIONAL MODEL DEFINITION**
> Source of truth: `registry/program/external-blockers.json` (consumed by the Constitutional Program Compiler).
> This document describes the model. It designates no actor, produces no attestation, and closes nothing.

| Field | Value |
|-------|-------|
| Artifact ID | `EXTERNAL-BLOCKER-MODEL` |
| Phase | **G.2** · Version 1.0.0 · Date 2026-07-03 |
| Registry | `registry/program/external-blockers.json` (`PROG-EXT-BLOCKER-001`) |
| Engine | `tools/program-compiler/src/external-blockers.ts` |
| Compiler verdict (unchanged) | **NO_GO** |

---

## 1. Purpose

The Program Compiler previously modelled only one kind of blockage: **INTERNAL_BLOCKED** —
an item waiting on incomplete dependencies. That is insufficient. Some items cannot be
progressed by *any* software agent, no matter how many tokens are spent: they require a
**governed action by an external actor** (the Authority Board, an Independent Adjudicator,
human Operations, or the Certification Authority).

Phase G.2 introduces a first-class **EXTERNAL_BLOCKED** concept so the Program Compiler can:

1. state that external blockers exist;
2. state that some blockers **cannot be solved by software**;
3. name the governance action, actor, evidence, and authority required to release them;
4. **prohibit re-investigation** of a settled external determination unless new evidence appears.

## 2. The distinction

| | INTERNAL_BLOCKED | EXTERNAL_BLOCKED |
|--|------------------|------------------|
| Cause | Unmet internal dependency (another work item is not COMPLETE) | Gated solely by an external actor's governed action |
| Software-solvable | Yes — clear the upstream item | **No** — an agent cannot perform the act |
| Compiler status | `BLOCKED` | `EXTERNAL_BLOCKED` |
| Right response | Work the upstream item | Record reality; do **not** re-investigate absent a review trigger |

**Precedence rule (deterministic):** an internal block always takes precedence. An item is
marked `EXTERNAL_BLOCKED` only when it is *internally unblocked* (no unmet dependencies, not in
a cycle, not COMPLETE) and its **only** remaining gate is external. This is why `PI-10` remains
`BLOCKED` (it still waits on `PI-8`/`PI-9`) while `PI-8`, `PI-9`, and `REAL-C-05` — internally
finished but awaiting external attestation — are `EXTERNAL_BLOCKED`.

## 3. Record schema (`external-blockers.json`)

Each external blocker record carries the Phase G.2 mandated fields:

| Field | Meaning |
|-------|---------|
| `id` | Stable blocker id (`EXT-REAL-C-05`, …) |
| `target` / `targetClosure` | The work item / closure the blocker gates |
| `reason` | Why the blocker exists and why it is external |
| `required_actor` | The external actor who must act |
| `required_action` | The governed action(s) that would release it |
| `required_evidence` | Evidence that must reach `>= VERIFIED` (independently) |
| `required_authority` | The constitutional authority that governs the action |
| `blockedWorkItems` / `blockedEvidence` | The items/evidence the compiler overlays as EXTERNAL_BLOCKED |
| `solvableBySoftware` | Always `false` for an external blocker (enforced at load) |
| `postActionSolvableBySoftware` | Whether downstream work becomes software-solvable once the external gate clears |
| `last_review_date` / `last_review_phase` / `last_review_determination` | The last authoritative review (rediscovery baseline) |
| `review_trigger` | The evidence-advance / authority-action condition that permits re-opening (see WS3) |
| `rediscoveryNote` | Human-readable "do not reinvestigate" rationale |

## 4. Registered external blockers

### EXT-REAL-C-05 — Independent Attestation *(primary, permanently external)*
- **Reason:** Independent attestation (proposer ≠ attestor) of the self-attested PI-8/PI-9
  ratifications, the retroactive AD-0016..0023 enrollment, and the R13/R14 ruling. Self-closure
  is forbidden (SIG-5 / AUTH-009 Separation of Duties). **No software agent can manufacture an
  independent adjudicator.**
- **Required actor:** UCOS Authority Board (designation) + a distinct Independent Adjudicator (attestation).
- **Required action:** G1 designate → G2 enroll key → G3 genesis attestation → durable AUTH-012 enrollment.
- **Blocks:** `REAL-C-05`, `PI-8`, `PI-9`. **`postActionSolvableBySoftware = false`.**
- **Last review:** 2026-07-03 (PHASE-G.1 → **PARTIAL**, 0 attestations, G1–G4 = 0/4, C1–C4 = 0/4).

### EXT-REAL-C-03 — Operational Evidence
- **Reason:** Apply-time operational evidence (provisioning, pipeline, DR, audit/metrics) and
  Operational Certification. Software cannot fabricate live apply logs, real DR measurements, or a
  certification decision (AD-0009 Approval-Required).
- **Required actor:** Operations (human-executed, AD-0009) + Certification Authority.
- **Blocks:** `ACT-06`, `ACT-07`, `ACT-08`, `ACT-09`, `ACT-10`, `ACT-12` (currently rooted behind the internal `ACT-11` decision).

### EXT-REAL-C-04 — Design-Only Fabric Implementation
- **Reason:** PI-10 construction requires a scoped Article IX release **AD-0024 that is not issued**;
  issuing it is an Authority Board act. **`postActionSolvableBySoftware = true`** — once AD-0024 is
  issued, PI-10/PI-11 construction is internal software work (ratification independence remains
  subject to REAL-C-05).
- **Required actor:** UCOS Authority Board (AD-0024) + Independent Adjudicator (ratification).
- **Blocks:** the `PI-10` authorization gate (`EV-PI10-AUTH`).

## 5. Compiler integration (observed output)

```
Program Health
  Complete=12  In-Progress=1  Ready=3  Blocked=9  External-Blocked=3  Open=0  Total=28
EXTERNAL_BLOCKED items: PI-8, PI-9, REAL-C-05
Next executable (recomputed): PI-11 (was PI-8 before isolation)
Governance verdict: NO_GO (unchanged)
```

`node tools/program-compiler/src/cli.ts external-blockers` (`pnpm ucos:external-blockers`) prints
the full model with per-blocker recommendations.

## 6. Absolute-rule compliance

- REAL-C-05 is **not** closed and **not** re-opened. It is recorded exactly as PHASE G.1 left it: **PARTIAL**.
- **No** synthetic attestation, authority, or evidence was created. The review-trigger simulation in
  validation was in-memory only and mutated no registry file.
- The compiler's **NO_GO** verdict is unchanged; external isolation does not advance the program.

**END EXTERNAL-BLOCKER-MODEL — 3 external blockers registered · REAL-C-05 permanently external · NO synthetic evidence · compiler NO_GO unchanged.**
