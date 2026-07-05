# PROGRAM STATE SPECIFICATION

**Artifact:** PROG-STATE-SPEC-001
**Phase:** PHASE-P.1
**Status:** IMPLEMENTED
**Registry:** `registry/program/*.json`
**Types:** `tools/program-compiler/src/types.ts`

---

## 1. Registry files (inputs — single source of truth)

| File | Artifact | Contents |
|------|----------|----------|
| `state.json` | PROG-STATE-001 | Program identity, authority chain, constitutional lock, canonical reality snapshot, current phase, vocabularies, generated-output paths. |
| `work-items.json` | PROG-WI-001 | Every executable unit: id, title, type, phase, `declaredStatus`, owner, priority, acceptance criteria, required evidence, gates, constraints. |
| `dependencies.json` | PROG-DEP-001 | Directed edges `{from, dependsOn}`; must be acyclic. |
| `evidence-registry.json` | PROG-EVID-001 | Evidence records: id, workItem, phase, `state`, artifact, report, note. |
| `closure-matrix.json` | PROG-CLOSURE-001 | Governance closures: dependencies, required evidence, closure criteria. |
| `gaps.json` | PROG-GAP-001 | Declared open gaps, each linked to a work item/closure. |

---

## 2. Vocabularies

- **Work-item status (computed):** `OPEN`, `READY`, `IN_PROGRESS`, `BLOCKED`, `COMPLETE`.
  - *Declared* statuses (author-writable) are a subset: `OPEN`, `IN_PROGRESS`, `COMPLETE`.
  - `READY` / `BLOCKED` are **only** ever computed, never declared.
- **Evidence state:** `PENDING` → `SUBMITTED` → `VERIFIED` → `CERTIFIED` (monotonic; no regression).
- **Closure verdict:** `GO`, `GO_WITH_CONDITIONS`, `NO_GO`.

---

## 3. Computed status algorithm

For each work item, two passes:

**Pass 1 — local completeness.**
```
rollup      = rollupEvidence(requiredEvidence)
declared    = declaredStatus == COMPLETE
isComplete  = declared AND rollup.satisfied            // every required evidence >= VERIFIED
inconsistency = declared AND NOT rollup.satisfied      // declared done but unproven → flagged
```

**Pass 2 — effective status.**
```
if node in cycle:                 BLOCKED   (governance defect)
elif isComplete:                  COMPLETE
elif any dependency not complete: BLOCKED   (lists unmet deps)
elif declaredStatus == IN_PROGRESS: IN_PROGRESS
else:                             READY
```

Evidence roll-up satisfaction: `certified + verified == required` (missing/pending/submitted do
not satisfy). An item with **no** required evidence is *vacuously* satisfied for the roll-up but is
separately flagged by the gap engine as unprovable if it is not already COMPLETE.

---

## 4. Next-executable resolution (total order)

Among `READY` items, select the minimum under:

1. `priority` ascending (author-declared importance);
2. dependent-count descending (unblock the most downstream work);
3. `id` lexical ascending (final deterministic tie-break).

Result is stable across runs. `next-work-item.json` also embeds the authorization decision.

---

## 5. Governance closure verdict

Per closure:
```
unmet = dependencies where status != COMPLETE
if unmet == 0 AND evidence.satisfied:                     GO
elif unmet == 0 AND no evidence PENDING/missing:          GO_WITH_CONDITIONS   (only SUBMITTED remain)
else:                                                     NO_GO
```
Overall verdict = **worst** per-closure verdict (fail-closed).

---

## 6. Output objects

`ProgramState` (the compiler's primary output) contains:

- `program`, `programLayerVersion`, `computedAt`, `currentPhase`
- `items[]` — every `ComputedWorkItem` (status, unmet/met deps, dependents, evidence roll-up, reasons, inconsistency flag)
- `nextExecutableWorkItem` — the resolved single next action (or `null`)
- `readyItems[]`, `blockedItems[]`
- `missingEvidence[]` — `{workItem, evidenceId, state}` for all required evidence < VERIFIED
- `gaps[]` — declared + auto-discovered
- `programHealth` — totals, completion %, evidence inconsistencies, cycles
- `governanceHealth` — Article IX flags, per-closure verdicts, overall verdict
- `warnings[]`

---

## 7. Derived artifacts (outputs — never hand-edited)

| Path | Purpose |
|------|---------|
| `registry/program/next-work-item.json` | Machine-readable next action + authorization + ready queue. |
| `registry/program/dashboard.json` | Machine-readable dashboard data. |
| `UCOS-PROGRAM-DASHBOARD.md` | Human dashboard (layered by concern). |
| `MINIMAL_CONTEXT.md` | Token-optimized agent startup bundle. |
| `state.json.lastComputed` | Stamp of last compile (non-deterministic runs only). |

---

## 8. Current computed state (this compile)

- **Phase:** PHASE-P.1 (IN_PROGRESS)
- **Completion:** 42.9% — 12 / 28 COMPLETE
- **COMPLETE (12):** WI-05, WI-06, WI-07, WI-08, WI-09, WI-10, PI-2-3, PI-4, PI-5, PI-6, PI-7, GOV-LEDGER-RESTORE
- **IN_PROGRESS (2):** REAL-C-01, REAL-C-05
- **READY (5):** PI-8, PI-9, PI-11, Prompt-05, ACT-11
- **BLOCKED (9):** PI-10, Prompt-08, Prompt-09, ACT-06, ACT-07, ACT-08, ACT-09, ACT-10, ACT-12
- **Evidence inconsistencies (2):** PI-8, PI-9 (declared COMPLETE; ratification evidence only SUBMITTED, pending REAL-C-05 independent attestation)
- **Next executable:** PI-8 — Ontology Fabric (priority 25) — AUTHORIZED
- **Governance verdict:** NO_GO (REAL-C-03, REAL-C-04, REAL-C-05 all NO_GO)
- **Graph:** acyclic; **fingerprint:** `a581025a35912a76`

The evidence inconsistencies on PI-8/PI-9 are *correct fail-closed behavior*: their self-attested
ratifications (`EV-PI8-RAT`, `EV-PI9-RAT`) sit at SUBMITTED pending the independent attestation
tracked by REAL-C-05. The compiler therefore declines to count them COMPLETE until that evidence
reaches VERIFIED — surfacing the honest gap rather than inheriting the optimistic declaration.
