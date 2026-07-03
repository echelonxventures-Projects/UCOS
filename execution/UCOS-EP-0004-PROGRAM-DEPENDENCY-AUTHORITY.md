# UCOS-EP-0004 — Program Dependency Authority

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-EP-0004` |
| Program | **UCOS Phase 2 — Master Execution Program** |
| Phase | EP-4 — Program Dependency Authority |
| Mode | **EXECUTION PLANNING ONLY** — no audit, no redesign, no new requirement/RC class, no scope expansion. |
| Status | EXECUTION BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-IR-0004` (fabric DAG); `UCOS-EP-0002` (EWP deps); `UCOS-RA-0002/0006`; `UCOS-EA-0001..0004` |
| Governing constraints | Corpus FROZEN. DAG with 0 true cycles / 0 unresolved contradictions / 0 missing deps among realized fabrics (`UCOS-IR-0004`). |

---

## 0. Purpose

This is the authoritative program dependency map over the execution work packages (`EWP-*`). It classifies every
package as **Critical Path · Parallel Work · Blocked Work · Deferred Work**, grounded in the ratified fabric DAG
(`UCOS-IR-0004`, tiers 0–7) and the validated forward-dependency-free stage sequence (`UCOS-IR-0006 §3`).
Dependency edges are inherited, not invented; the graph is a DAG once genesis roots are fixed.

---

## 1. Master dependency edges (package level)

```
EWP-00-ATTEST ─┐
EWP-00-REMEAS ─┼─► EWP-00-CERT ─► EWP-00-LIFT  ═══ G0 = PASS ═══╗
               │                                                 ║
   (Wave 1/2 core DONE: PI-2..PI-9 realized under genesis roots) ║
                                                                 ▼
                        ┌───────────────────────────────────────┴───────────────────────┐
                        │                          │                        │            │
                 EWP-A-* convergence        EWP-E-NONACT              EWP-D-SCALE   EWP-D-OBS
                 (AUTHUNIV/AUDITUNIV/        EWP-E-CRC                   │            │
                  LIFEUNIV/POLVOCAB/            │                       ▼            │
                  MEMMETA) [parallel]           ▼                  EWP-D-PFC*        │
                                          EWP-A-TIME (needs CRC)         │           │
                                                │                        ▼           ▼
                                                │                    EWP-D-OPCERT ◄──┘  ═══ PRODUCTION READY
                                                │
                                     EWP-B-INTEL (needs NONACT) ─► EWP-B-SIM ─► EWP-B-CIV (needs AD-0014) ═ CIVILIZATION READY
                                     EWP-B-ECON (needs ledger restore) [parallel]
                                     EWP-N-ADMIT [standing, after Stage 6/7]
```
`*` EWP-D-PFC exchange classes additionally require EWP-B-ECON (deferred-realization chain).

## 2. Critical path

The **binding critical path** (longest chain of mandatory, ordered work) to each terminal state:

**To PRODUCTION READY:**
```
EWP-00-ATTEST/REMEAS → EWP-00-CERT → EWP-00-LIFT (G0)
  → EWP-D-SCALE → EWP-D-OPCERT   [+ EWP-D-OBS in parallel, joins at OPCERT]
```
- Length: **6 mandatory packages** (2 Wave-0 evidentiary + 1 cert + 1 lift + scale-out + operational cert).
- Binding constraint: **evidence + one Board act (Wave 0)**, then **scale-out + operational evidence** — *not*
  new substrate.

**To CIVILIZATION READY:**
```
… G0 → EWP-E-NONACT (INV-CORE-12) → EWP-B-INTEL → EWP-B-SIM → EWP-B-CIV (AD-0014 release)
```
- Length: **G0 + enactment + Intelligence + Simulation + Civilization**, each Board-authorized (scoped release);
  gated additionally by `AD-0014`.

## 3. Parallel work (after G0 = PASS)

| Parallel track | Packages | Mutual independence |
|----------------|----------|---------------------|
| Convergence (soundness) | `EWP-A-AUTHUNIV`, `EWP-A-AUDITUNIV`, `EWP-A-LIFEUNIV`, `EWP-A-POLVOCAB`, `EWP-A-MEMMETA` | Independent of each other and of production; Stage 6 |
| Enactment | `EWP-E-NONACT`, `EWP-E-CRC` | No mutual dependency; Board acts (Stage 7) |
| Production | `EWP-D-SCALE`, `EWP-D-OBS`, `EWP-D-PFC` | Independent of the behavioral frontier; converge at `EWP-D-OPCERT` |
| Economics | `EWP-B-ECON` | Parallel to Intelligence/Simulation (own ledger-restore prerequisite) |
| Temporal | `EWP-A-TIME` | Parallel to production; depends only on CRC (Stage 7) |

**Maximal parallelism after G0:** convergence ∥ enactment ∥ production ∥ temporal ∥ economics — five concurrent
tracks, bounded only by the enactment→Intelligence and temporal-CRC edges.

## 4. Blocked work

| Package(s) | Blocked by | Nature |
|------------|-----------|--------|
| **All build/enact/production work** | `EWP-00-LIFT` (G0 = FAIL) / `UCOS-CONSTRUCTION-BLOCKED` | Governance — the pivot; nothing builds until Wave 0 exits |
| `EWP-B-INTEL` | `EWP-E-NONACT` (INV-CORE-12 not enrolled) | Safety precondition — hard-gated |
| `EWP-A-TIME` (T-2/T-7 determinism) | `EWP-E-CRC` (CRC not enacted) | Enactment dependency |
| `EWP-D-OPCERT` | `EWP-D-SCALE` + G12-1/2/3 evidence | Operational evidence |
| `EWP-D-PFC` (exchange classes) | `EWP-B-ECON` | Deferred-realization chain |
| `EWP-B-CIV` | `EWP-B-SIM` + `AD-0014` release | Deferred-realization + Board disposition |

> The single **governance pivot** blocking the entire program is `EWP-00-LIFT` (EA-B-P0-3). Once it closes
> (G0 = PASS), all "Blocked" work becomes "Parallel/Sequenced" per §3.

## 5. Deferred work (`AD-0014` / scoped-release-gated)

| Package | Deferral basis |
|---------|----------------|
| `EWP-B-INTEL` | Design-only; scoped release `AD-0024`; safety-ordered behind Non-Actuation (RR-8) |
| `EWP-B-SIM` | Design-only; `AD-0022` conditional (RR-6) |
| `EWP-B-ECON` | Design-only; ledger restoration + scoped release; value-bearing sensitivity (RR-6) |
| `EWP-B-CIV` | Design-only; **held under `AD-0014`** (RR-6) |
| `EWP-N-ADMIT` | Standing capability; stated-of-record (RR-9) |
| `EWP-A-TIME` | Stated-of-record; future scoped release (RR-7) |

## 6. Dependency integrity checks

| Check | Result | Source |
|-------|:------:|--------|
| Cycles | **0 true** (3 governance-core bootstraps resolved by genesis seeding) | `UCOS-IR-0004 §3` |
| Contradictions | **0 unresolved** (CON-1..4 resolved additively; ratified invariant prevails) | `UCOS-IR-0004 §4` |
| Missing dependencies (realized fabrics) | **0** | `UCOS-IR-0004 §5` |
| Forward dependencies | **0** (every edge points downward) | `UCOS-IR-0006 §3` |
| Upward edges (fabric depends on higher tier) | **0** | `UCOS-IR-0004 §6` |

## 7. Determination

> **The program dependency authority is a well-formed DAG with 0 cycles, 0 unresolved contradictions, 0 missing
> dependencies, and 0 forward dependencies.** The **critical path to PRODUCTION READY is 6 mandatory packages**
> (Wave 0 evidence + Board act → scale-out → operational certification); the **critical path to CIVILIZATION
> READY** adds enactment → Intelligence → Simulation → Civilization under `AD-0014`. After the single governance
> pivot (`EWP-00-LIFT`, G0), up to **five tracks run in parallel** (convergence, enactment, production, temporal,
> economics). The only structural blocks are the governance pivot, the Non-Actuation-before-Intelligence safety
> order, the CRC-before-temporal-determinism edge, and the `AD-0014` civilization deferral.

## 8. Scope discipline
No code, requirement, RC class, invariant, or authorization produced. INV-1..13, `AUTH-012`, `AD-0014`, Article
IX lock unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands.

## 9. Traceability
- **Consumes:** `UCOS-IR-0004` (DAG), `UCOS-EP-0002` (EWP deps), `UCOS-RA-0002/0006`, `UCOS-EA-0001..0004`.
- **Refined by:** `UCOS-EP-0006` (gates), `UCOS-EP-0007` (critical path), `UCOS-EP-0008` (authority).
- **Owner:** UCOS Authority Board.

**END `UCOS-EP-0004` — PROGRAM DEPENDENCY AUTHORITY · DAG · 0 CYCLES / 0 CONTRADICTIONS / 0 MISSING / 0 FORWARD DEP · CRITICAL PATH TO PRODUCTION = 6 PACKAGES · PIVOT = EWP-00-LIFT (G0) · 5 PARALLEL TRACKS AFTER G0 · INTELLIGENCE GATED ON NON-ACTUATION · CIVILIZATION HELD UNDER AD-0014 · PLANNING ONLY.**
