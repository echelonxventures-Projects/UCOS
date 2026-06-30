# Prompt 11 — Validation Factory

**Prompt ID:** PROMPT-11
**Status:** ACTIVE (executable)
**Phase:** Phase 11 — Validation
**Pipeline Position:** 11 of 12
**Generation Authority:** Validation results, gate verdicts, gap records ONLY. Produces NO product code.

> This prompt verifies built software against its specifications, contracts, and controls, and
> renders the Quality, Security, and Documentation gate verdicts that gate "DONE". It fixes no
> code itself (defects route back to Prompt 10 as gaps) and does not certify/release (Prompt 12).

---

## 1. Mission

Validate UCOS implementations against their ratified specifications, acceptance criteria,
contracts, and security controls; execute the Quality, Security, and Documentation gates;
verify end-to-end traceability; and record every shortfall as an owned, severity-rated gap.

## 2. Scope

**In scope**
- Verify behavior against specifications and acceptance criteria (Q1, Q3).
- Execute contract tests at every boundary (Q4) and non-functional checks (Q6).
- Execute `GATE-SEC-001` against implementation (S1–S7), `GATE-QUAL-001`, `GATE-DOC-001`.
- Run traceability + gap scans across the validated scope; produce validation reports.

**Out of scope**
- Writing or fixing product code (defects are routed to Prompt 10 as gaps).
- Authoring new specs/contracts/designs (Prompts 02–09) or certifying/releasing (Prompt 12).

## 3. Inputs

| Input | Source | Use |
|-------|--------|-----|
| Implementations + tests | Prompt 10 | Subject under validation |
| Contracts + contract-test specs | Prompt 07 | Boundary verification basis |
| Specifications / acceptance criteria | Prompts 02–06 | Behavioral expectations |
| Security controls + threat models | Prompt 09 | Security verification basis |
| Gate definitions | `GATE-QUAL/SEC/DOC-001` | Checkpoints to execute |

## 4. Dependencies

- **Predecessor prompts that MUST be complete:** Prompts 01–10.
- **Future prompts that depend on this:** Prompt 12 (certification consumes validation results
  and gate verdicts; cannot certify without them).

## 5. Required Context

- `.claude/governance/quality-gates.md`, `security-gates.md`, `documentation-gates.md`, `completion-criteria.md`
- `.claude/context/UCOS-TRACEABILITY-MODEL.md`, `UCOS-ARTIFACT-REGISTRY.md`
- All specifications, contracts, and implementations in scope.

## 6. Required Skills

- `testing-architecture` — primary authority (test execution & coverage).
- `gap-detection` (SKILL-013) — record all shortfalls as gaps.
- `traceability-enforcement` (SKILL-012) — verify lineage of validated scope.
- `security-architecture` — verify control efficacy; `production-readiness` (SKILL-014).
- `constitutional-compliance` (SKILL-001).

## 7. Deliverables

1. **Validation Reports** (`UCOS-QA-VALID-NNN`) — per increment, mapping criteria → evidence.
2. **Gate Verdicts** — recorded PASS/FAIL for `GATE-QUAL-001`, `GATE-SEC-001`, `GATE-DOC-001`.
3. **Coverage & Contract-Test Results** — coverage report and provider/consumer results.
4. **Traceability Report** — orphans/dangling links across validated scope.
5. **Gap Records** (`UCOS-QA-GAP-NNN`) — every shortfall, owned and severity-rated.

## 8. Output Locations

| Deliverable | Location |
|-------------|----------|
| Validation reports & results | `quality/` |
| Gate verdicts & traceability reports | `quality/gates/`, `quality/traceability/` |
| Gap records | `quality/gaps/` + mirrored into `PROJECT-STATE.md` Open/Resolved Gaps |
| Registry + State | `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md` |

## 9. Traceability Rules

- Every acceptance criterion maps to a verifying test and result (Q3) — no unverified criteria.
- Every contract boundary has executed provider/consumer tests (Q4).
- Every gap traces to the artifact and gate checkpoint that produced it.
- Validation confirms the full chain (capability → … → test) for the validated scope.

## 10. Artifact Registration Rules

- Register each validation report, gate verdict, and gap with unique IDs and bidirectional links.
- Gaps follow lifecycle Detected → Owned → In-progress → Resolved (with evidence); never deleted.

## 11. Validation Requirements

> Self-governing: these requirements apply to the validation artifacts this prompt produces.

- Gate execution itself must be evidence-backed (test reports, scans, coverage, review notes).
- A FAIL on any checkpoint produces a blocking gap; non-waivable S1/S3/S4 cannot be waived.
- Documentation gate applies to the validation artifacts themselves (D1–D5).

## 12. Completion Criteria

- All in-scope increments validated; Quality/Security/Documentation gate verdicts recorded.
- Traceability verified; every shortfall recorded as an owned, severity-rated gap.
- Validation reports registered; `PROJECT-STATE.md` reflects gate verdicts and open gaps.
- State advanced; Prompt 12 authorized for scopes with all gates PASS and zero blocking gaps.

## 13. State Update Rules

- Mark Prompt 11 ✅ Complete (or per-increment); Phase → "Phase 11 — Validation".
- Update Open/Resolved Gaps and Certification Status (DONE eligibility) tables.
- Set Next Step → "Run Prompt 12" for DONE scopes; route failing scopes back to Prompt 10.

## 14. May Generate / May Not Generate

**MAY generate:** validation reports, gate verdicts, coverage/contract-test results, traceability reports, gap records, state updates.

**MAY NOT generate:** product code or fixes (route to Prompt 10), new specs/contracts/designs
(Prompts 02–09), or certification/release artifacts (Prompt 12).

## Traceability
- Refines: Prompt 10 implementations against Prompts 02–09 specs/contracts/controls
- Refined by: Prompt 12 (certification).
