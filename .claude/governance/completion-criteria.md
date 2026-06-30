# Governance — Completion Criteria

**Gate ID:** GATE-DONE-001
**Authority:** Subordinate to Constitution; aggregates all gates.
**Owner skills:** production-readiness, gap-detection, traceability-enforcement.

## Purpose
Define what "done" and "certified" mean for any UCOS increment. Prevents premature completion.

## Definition of Done (per increment)
An increment is **DONE** only when ALL hold:
1. **Traceable** — full lineage from capability/domain to realization; zero orphans.
2. **Specified** — clear, testable specifications and acceptance criteria exist.
3. **Contracted** — every boundary has a versioned, tested contract.
4. **Quality gate** — GATE-QUAL-001 PASS.
5. **Security gate** — GATE-SEC-001 PASS.
6. **Documentation gate** — GATE-DOC-001 PASS.
7. **Readiness** — all production-readiness dimensions ready (SKILL-014).
8. **No blocking gaps** — zero open critical/blocking gaps in scope.

## Definition of Certified
**CERTIFIED** = DONE + Release gate (GATE-REL-001) PASS + recorded certification artifact.

## Phase Completion (program level)
A phase is complete when every artifact it owns is DONE and registered, and the
`PROJECT-STATE.md` reflects the transition.

## Bootstrap Completion Criteria (this phase)
Bootstrap is complete when:
- All required directories exist.
- All context (9), skills (14), prompts (12), governance (5), state (1), and master (1) files exist.
- Documentation gate passes for bootstrap artifacts.
- `PROJECT-STATE.md` and execution reports reflect reality.
- No platform/domain/service/code artifacts were generated.

## Traceability
- Refines: CTX-CONST-001 → Aggregates: GATE-QUAL/SEC/DOC/REL → Consumed by: Prompt 12.
