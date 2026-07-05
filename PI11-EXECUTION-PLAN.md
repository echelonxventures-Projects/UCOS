# PI11-EXECUTION-PLAN — Simulation Fabric Construction

| Field | Value |
|-------|-------|
| Artifact | **PI11-EXECUTION-PLAN** |
| Work item | **PI-11 — Simulation Fabric** (registry `PROG-WI-001`, priority 28) |
| Resolved by | Constitutional Program Compiler (`registry/program/next-work-item.json`, computed 2026-07-03T15:55:20.898Z) |
| Authorizing act | **AD-0022** (RELEASE LOCK — PI-11 SIMULATION-FABRIC SCOPE ONLY, CONDITIONAL; effective 2026-07-01) |
| Construction blueprint | `SIM-PLAN-001` (topology), `SIM-PLAN-002` (waves), `SIM-PLAN-003` (validation/threat/test) |
| Target subtree | `packages/platform-runtime/src/control/simulation/*` (new) + 1 additive re-export in `src/control/index.ts` |
| Item class | **ENGINEERING** (fully software-solvable under AD-0022; no external actor required) |
| Date | 2026-07-03 |

---

## WORKSTREAM 1 — PI-11 definition (resolved from registry)

Read directly from `registry/program/work-items.json` (`PROG-WI-001`), `dependencies.json`,
`evidence-registry.json`, `next-work-item.json` — not from prior narrative reports.

- **Purpose.** Construct the Simulation Fabric: a governed *what-if / projection* layer that runs
  bounded, deterministic-by-default scenarios inside disposable, snapshot-isolated sandboxes, reads
  governed state via existing fabrics (read-only), and routes all governed change through the ratified
  Evolution Fabric. It **projects and proposes, never autonomously acts**.
- **Dependencies.** `PI-11 dependsOn PI-7` only (Knowledge Fabric) — `PI-7` is `COMPLETE`. **PI-10 is
  NOT a prerequisite** (AD-0022 §1). PI-8/PI-9 couplings are soft and deferred behind FDG gates.
- **Evidence requirements.** `EV-PI11-IMP`, `EV-PI11-VAL`, `EV-PI11-SEC`, `EV-PI11-AUD` (all currently
  `PENDING`). Deliverables `PI11-IMP-001` / `PI11-VAL-001` / `PI11-SEC-001` / `PI11-AUD-001`.
- **Acceptance criteria** (registry): (1) build `src/control/simulation/*` additively per
  `SIM-PLAN-001..003`; (2) `S1..S12` 0 residual High/High; (3) baseline green; (4) FDG-INT/MEM/ONT inert.
- **Governance gates.** `GATE-QUAL-001`, `GATE-SEC-001`.
- **Constitutional constraints.** `AD-0022` conditional release (`SIM-COND-1..7`); non-actuation.
- **Completion criteria** (SIM-PLAN-002 §7 DoD): 14 modules built; `tsc --noEmit` clean; full suite green
  (baseline + new sim tests); W5 adversarial 12/12 (S1–S12) blocked, 0 residual High/High; 0
  prohibited-core-dir change; deny-by-default with 0 hardcoded authorities/policies; FDG seams inert;
  four PI11 deliverables produced.

---

## WORKSTREAM 2 — Compiler determination validation

**Why PI-11 is executable.** The compiler's `authorize` check returns `AUTHORIZED` for PI-11 with all
four checks passing: `registered`, `dependencies-satisfied` (PI-7 COMPLETE), `required-evidence-known`
(4 declared), `constitutional-gate-satisfied` (no hard block — AD-0022 already authorizes construction).
PI-11 has the highest priority (28) in the READY queue after excluding EXTERNAL_BLOCKED items, and it is
internally software-solvable (`EXT-REAL-C-04` records `postActionSolvableBySoftware: true` and states
"PI-11 is internally constructible under AD-0022 and is NOT external-blocked").

**Why higher-priority / other items are NOT executable.**

| Item | Priority | State | Why not executable now |
|------|:--:|-------|------------------------|
| GOV-LEDGER-RESTORE | 5 | COMPLETE | Already done. |
| WI-05..10, PI-2-3..PI-7 | 10–24 | COMPLETE | Already done. |
| PI-8 Ontology | 25 | COMPLETE (declared) but **EXTERNAL_BLOCKED** | `EV-PI8-RAT` is self-attested (SUBMITTED); independent attestation is `EXT-REAL-C-05` (Board + Independent Adjudicator; SIG-5 self-closure forbidden). Not software-solvable; must not be re-investigated. |
| PI-9 Memory | 26 | COMPLETE (declared) but **EXTERNAL_BLOCKED** | Same as PI-8 (`EV-PI9-RAT` self-attested; blocked by `EXT-REAL-C-05`). |
| PI-10 Intelligence | 27 | OPEN, **BLOCKED** | Requires scoped Article IX release **AD-0024** (NOT issued — external Board act) plus PI-8/PI-9. `EXT-REAL-C-04` external gate. |
| **PI-11 Simulation** | **28** | **OPEN, READY, AUTHORIZED** | **Executable now** — deps satisfied, AD-0022 authorizes construction, internally software-solvable. |
| Prompt-05 | 40 | OPEN, READY | Lower priority than PI-11; contract-authoring track. |
| ACT-11 | 55 | OPEN, READY | Lower priority; observability ADR (governance decision), gates operational-evidence track. |
| Prompt-08/09, ACT-06/07/08/09/10/12 | 41–56 | BLOCKED | Depend on unmet predecessors (Prompt-05 / ACT-11) or `EXT-REAL-C-03` human-executed operational acts. |
| REAL-C-01 | 60 | IN_PROGRESS | Governance reconciliation; certification-authority act. |
| REAL-C-05 | 61 | IN_PROGRESS, **EXTERNAL_BLOCKED** | Independent attestation; permanently external (SIG-5). |

The compiler's next-executable resolution (PI-11) is therefore **validated**: it is the
highest-priority READY, dependency-satisfied, authorized, software-solvable work item.

---

## WORKSTREAM 3 — Implementation plan (engineering item)

PI-11 is an engineering item ⇒ **implementation workstreams**. Construction is confined to
`packages/platform-runtime/src/control/simulation/*` (14 modules M0..M14) + exactly one additive
re-export line in `src/control/index.ts`. Additive-only over the implemented PI-2..PI-9 baseline
(**284 tests** currently green; SIM-COND-2 keeps them green at every wave boundary).

### Module topology (SIM-PLAN-001 §2)

`M0 types` · `M1 simulation-registry` · `M2 sandbox` · `M3 digital-twin` · `M4 scenario-engine` ·
`M5 projection-engine` · `M6 predictive-adapter[iface]` · `M7 constraint-evaluator` ·
`M8 impact-analyzer` · `M9 revocation-authority` · `M10 federation-guard` · `M11 promotion-pipeline` ·
`M12 simulation-audit-log` · `M13 simulation-control` (assembly) · `M14 index` (barrel).

### Build waves (SIM-PLAN-002 §2) — each ends green + non-regressing

- **W0 Foundations** — M0 types, M1 registry, M2 sandbox (static keyspace write-guard, SIM-SEC-ISO-1),
  M12 audit (hash-chain, reuse `sha256`/`canonicalize`). Tests: harness, `simulation.test.ts`,
  `simulation-audit.test.ts`.
- **W1 Baseline binding** — M3 digital-twin (signed-snapshot verify/expiry, `stale` fail-closed,
  non-actuation, FDG-MEM inert), M4 scenario-engine (authority caps, civilization ⇒ Board, budgets).
  Tests: `simulation-twin.test.ts`, `simulation-scenario.test.ts`.
- **W2 Deterministic projection** — M5 projection-engine (deterministic stepping + reproducibility
  tuple), M6 predictive-adapter (deterministic models only; non-det registration denied = FDG-INT),
  M7 constraint-evaluator (hard/soft + preserved invariants; absent `ontology:*` ⇒ deny = FDG-ONT).
  Tests: `simulation-projection.test.ts`, `simulation-constraint.test.ts`.
- **W3 Impact + federation + revocation** — M8 impact-analyzer (advisory-only; classification
  inheritance S6), M10 federation-guard (advisory/deny-only; trust clamp; local-shadows-foreign;
  fail-closed partition), M9 revocation-authority (forward-only, fail-closed). Tests:
  `simulation-impact.test.ts`, `simulation-federation.test.ts`, `simulation-revocation.test.ts`.
- **W4 Promotion + assembly** — M11 promotion-pipeline (deny-by-default; SoD; **Evolution-only commit**;
  reproducibility gate), M13 `createSimulationFabric(...)`, M14 barrel, +1 re-export in
  `src/control/index.ts`. Tests: `simulation-promotion.test.ts`, `simulation-control.e2e.test.ts`.
- **W5 Adversarial hardening** — `simulation-adversarial.test.ts` covering S1–S12 (one test per threat),
  0 residual High/High.

### Exit gates (SIM-PLAN-003 §4)

`G-BUILD` (tsc 0) · `G-BASELINE` (284 unchanged/green) · `G-FUNC` · `G-THREAT` (12/12 S1–S12) ·
`G-COV` · `G-DIR` (0 core-dir change) · `G-ADDITIVE` (14 modules + 1 re-export) · `G-FDG` (seams inert) ·
`G-CRYPTO` (assertions.ts only) · `G-ASSURE` (A1..A8).

---

## WORKSTREAM 4 — Execution disposition

PI-11 is **fully software-solvable** under AD-0022 (the authorization already exists; no AD-0024, no
external actor, no human-executed operational evidence is required for construction). Execution proceeds
in this plan. The only acts explicitly out of scope (and deferred to runtime governance, AD-0009) are
the FDG bindings (FDG-INT/MEM/ONT) and standing approvals — these remain inert seams, exactly as the
blueprint requires.

**Non-blockers confirmed:** independent PI-11 *ratification* (post-construction) is subject to
`LOCK-REAL-C-05` independence, an external act — but that is the ratification step, not the
construction. Construction + self-produced IMP/VAL/SEC/AUD evidence is software-solvable and is the
scope of this work item's `EV-PI11-*` (which advance PENDING → SUBMITTED via construction).

---

## FINAL REPORT ARTIFACTS

- `PI11-COMPLETION-REPORT.md` (on green) or `PI11-BLOCKER-REPORT.md` (on external blocker).
- Deliverables: `PI11-IMP-001`, `PI11-VAL-001`, `PI11-SEC-001`, `PI11-AUD-001`.

**END PI11-EXECUTION-PLAN.**
