# PROGRAM COMPILER ARCHITECTURE

**Artifact:** PROG-ARCH-001
**Phase:** PHASE-P.1 — Constitutional Program Compiler & Autonomous Execution Governor
**Status:** IMPLEMENTED
**Source of truth:** `registry/program/*.json`
**Implementation:** `tools/program-compiler/src/*.ts`

---

## 1. Purpose

The Constitutional Program Compiler is a deterministic, fail-closed engine that compiles the
Program Registry (`registry/program/*.json`) into a single computed **Program State**. It is the
Autonomous Execution Governor for UCOS Ω∞: it decides *what is complete*, *what is blocked*, *what
is ready*, and *what the single next executable work item is* — so that no agent ever re-audits the
repository, reconstructs the roadmap, or re-derives governance.

Design invariants:

- **Registry is the only source of truth.** No program content is hardcoded in compiler code.
  Adding a work item requires appending JSON to the registry, never editing TypeScript.
- **Compute, never trust.** A work item's `declaredStatus` is an author assertion; the engine
  computes the *effective* status from dependencies + evidence.
- **Fail closed.** Malformed registry, cyclic dependencies, missing evidence, or unproven
  completion all resolve conservatively (BLOCKED / NO_GO / throw), never optimistically.
- **Deterministic.** Identical registry input produces byte-identical output (a fixed content
  fingerprint), so runs are reproducible and auditable.

---

## 2. Layered architecture

```
                        registry/program/*.json  (single source of truth)
                                      │
                          ┌───────────▼───────────┐
                          │  registry.ts (loader)  │  structural + referential validation, fail-closed
                          └───────────┬───────────┘
                                      │  ProgramRegistry
        ┌─────────────────────────────┼─────────────────────────────────────┐
        ▼                             ▼                                       ▼
  evidence-engine.ts          dependency-engine.ts                     governance-closure.ts
  (WS3 evidence rollup)   (WS2 graph, cycles, readiness)          (WS10 GO/CONDITIONS/NO_GO)
        │                             │                                       │
        └─────────────┬───────────────┴──────────────┬────────────────────────┘
                      ▼                               ▼
                 compiler.ts (WS4 orchestrator) ── next-action.ts (WS5 next executable)
                      │                               gap-engine.ts (WS9 gap discovery)
                      │  ProgramState
        ┌─────────────┼───────────────────────────────────────────────┐
        ▼             ▼                     ▼                           ▼
  dashboard.ts   minimal-context.ts   authorization.ts           audit-replay.ts
  (WS11)         (WS7 token opt.)     (WS6 anti-deviation)        (WS12 replay)
        └─────────────┬───────────────────────────────────────────────┘
                      ▼
              outputs.ts + cli.ts  → next-work-item.json, dashboard.json,
                                      UCOS-PROGRAM-DASHBOARD.md, MINIMAL_CONTEXT.md
                                      + governed status-sync.ts (WS8) write-back
```

---

## 3. Modules (workstreams)

| Module | WS | Responsibility |
|--------|----|----------------|
| `types.ts` | — | Domain model for registry + computed state. No content, only shape. |
| `registry.ts` | WS1 | Load + structurally validate the 6 registry files; fail closed on malformed/dangling data. |
| `evidence-engine.ts` | WS3 | Evidence roll-up (PENDING→SUBMITTED→VERIFIED→CERTIFIED). ≥VERIFIED satisfies completion; missing counts against. |
| `dependency-engine.ts` | WS2 | Build graph, detect cycles (DFS coloring), compute effective status READY/BLOCKED/IN_PROGRESS/COMPLETE. |
| `governance-closure.ts` | WS10 | Per-closure GO / GO_WITH_CONDITIONS / NO_GO; overall verdict = worst closure (fail-closed). |
| `next-action.ts` | WS5 | Total-order selection of the single next executable item (deterministic). |
| `gap-engine.ts` | WS9 | Merge declared gaps with auto-discovered gaps (evidence inconsistency, cycles, no-evidence items). |
| `compiler.ts` | WS4 | Orchestrator: assembles the full `ProgramState` in one pass. |
| `authorization.ts` | WS6 | Anti-deviation gate: registered + deps satisfied + evidence declared + constitutional gate. |
| `status-sync.ts` | WS8 | Governed registry write-back; enforces legal status/evidence transitions (monotonic evidence). |
| `dashboard.ts` | WS11 | Renders `dashboard.json` + `UCOS-PROGRAM-DASHBOARD.md`. |
| `minimal-context.ts` | WS7 | Renders `MINIMAL_CONTEXT.md` — the token-optimized agent startup bundle. |
| `audit-replay.ts` | WS12 | Deterministic replay narrative + content fingerprint (drift detection). |
| `outputs.ts` | — | Writers for the four derived artifacts. |
| `cli.ts` | — | Command surface (see §5). |

---

## 4. Determinism model

Two sources of non-determinism are controlled:

1. **Timestamp.** `computedAt` is the only wall-clock value in the output. The CLI accepts
   `--deterministic`, which pins it to `1970-01-01T00:00:00.000Z` for reproducibility tests.
2. **Ordering.** Selection and rendering never rely on hash-map iteration order. The next-action
   resolver applies a *total order*: `priority ASC → dependent-count DESC → id lexical`.

`fingerprint()` (audit-replay) hashes the semantically significant registry projection
(work-item statuses + required evidence, edges, evidence states, closure shapes) to a stable
16-hex digest. `pnpm ucos:verify` compiles twice under a fixed timestamp and asserts byte-identical
output; current fingerprint: **`a581025a35912a76`**.

---

## 5. Command surface (`tools/program-compiler/src/cli.ts`)

| Command | Root script | Effect |
|---------|-------------|--------|
| `program-state` \| `state` | `pnpm ucos:program-state` | Compile, regenerate all outputs, print full state. |
| `compile` | `pnpm ucos:compile` | Regenerate all derived artifacts (silent). |
| `dashboard` | `pnpm ucos:dashboard` | Regenerate + print dashboard markdown. |
| `context` | `pnpm ucos:context` | Regenerate + print `MINIMAL_CONTEXT.md`. |
| `next` | `pnpm ucos:next` | Print `next-work-item.json` (machine-readable next action). |
| `authorize <id>` | `pnpm ucos:authorize <id>` | Anti-deviation authorization check for `<id>`. |
| `replay` | `pnpm ucos:replay` | Deterministic audit-replay narrative + fingerprint. |
| `set-status <id> <S>` | `pnpm ucos:set-status` | Governed declared-status transition + regenerate. |
| `set-evidence <id> <S>` | `pnpm ucos:set-evidence` | Governed evidence-state advance + regenerate. |
| `verify` | `pnpm ucos:verify` | Determinism + integrity self-check; non-zero exit on defect. |

Exit codes: `0` success; `1` governance/integrity defect or rejected authorization.

---

## 6. Fail-closed guarantees

- Missing / malformed registry file → loader throws; nothing downstream computes.
- Dangling dependency or evidence reference → loader throws (referential integrity).
- Dependency cycle → all cyclic nodes forced BLOCKED, `verify` exits non-zero, gap auto-raised.
- `declaredStatus=COMPLETE` with evidence < VERIFIED → **not** treated complete; evidence
  inconsistency raised; downstream stays honestly BLOCKED.
- Illegal status transition or evidence regression → status-sync throws (append-only / migration-only, per INV-10 / IP-14).

---

## 7. Extensibility

To add a work item: append one object to `work-items.json`, its edges to `dependencies.json`, its
evidence to `evidence-registry.json`, and (optionally) a closure/gap. **No compiler code changes.**
The engine is content-agnostic; all program semantics live in the registry.

---

## 8. Traceability

Subordinate to AUTH-001..012, UCOS-CONST-001, UCOS-ASR-NFR-001 (INV-1..13), AUTH-012 Decision Log
(AD-0001..0023). Article IX construction lock respected: the compiler is design/tooling only and
mutates no fabric source. Aligned with IP-14/IP-15 (migration-only), INV-10 (append-only registry).
