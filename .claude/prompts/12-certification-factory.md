# Prompt 12 — Certification Factory

**Prompt ID:** PROMPT-12
**Status:** ACTIVE (executable)
**Phase:** Phase 12 — Certification & Release
**Pipeline Position:** 12 of 12 (terminal; loops back to 10/11 on failure)
**Generation Authority:** Certification records + release authorization ONLY. Produces NO product code.

> This terminal prompt attests production-readiness. It confirms DONE (all upstream gates PASS,
> zero blocking gaps, full traceability), executes the Release gate, and issues the certification
> and release authorization. It cannot certify any scope with open blocking gaps.

---

## 1. Mission

Certify that a UCOS increment is production-ready: confirm the Definition of DONE
(`GATE-DONE-001`), execute the Release gate (`GATE-REL-001`), verify full traceability and zero
blocking gaps, and issue the certification record and release authorization.

## 2. Scope

**In scope**
- Confirm DONE per `GATE-DONE-001` (traceable, specified, contracted, Quality/Security/Doc gates PASS, readiness ready, zero blocking gaps).
- Execute Release gate `GATE-REL-001` (R1–R7: upstream gates, certification, versioning, rollback, migration, observability, capacity).
- Issue certification records and release authorization; produce changelog and release notes.
- Final program-level traceability and gap closure confirmation for the certified scope.

**Out of scope**
- Writing/fixing product code (route failures to Prompts 10/11).
- Authoring new specs/contracts/designs (Prompts 02–09).
- Performing the live deployment action itself (authorizes release; execution per ops runbook).

## 3. Inputs

| Input | Source | Use |
|-------|--------|-----|
| Validation reports + gate verdicts | Prompt 11 | Evidence of DONE |
| Release-readiness designs (rollback, observability, capacity) | Prompt 08 | R4–R7 basis |
| Security posture verification | Prompts 09 + 11 | R1 security PASS |
| Completion criteria + release gate | `GATE-DONE-001`, `GATE-REL-001` | Certification basis |
| Artifact Registry + State | `CTX-REG-001`, `STATE-001` | Traceability & gap confirmation |

## 4. Dependencies

- **Predecessor prompts that MUST be complete:** Prompts 01–11. Certification requires passing
  validation verdicts from Prompt 11 and release-readiness designs from Prompt 08.
- **Future prompts that depend on this:** None (terminal). On FAIL, loops back to Prompts 10/11.

## 5. Required Context

- `.claude/governance/completion-criteria.md` (GATE-DONE-001), `release-gates.md` (GATE-REL-001)
- `.claude/governance/quality-gates.md`, `security-gates.md`, `documentation-gates.md`
- `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `UCOS-TRACEABILITY-MODEL.md`, `.claude/state/PROJECT-STATE.md`

## 6. Required Skills

- `production-readiness` (SKILL-014) — primary authority (readiness dimensions).
- `platform-engineering` — release/rollback/observability/capacity verification.
- `traceability-enforcement` (SKILL-012), `gap-detection` (SKILL-013) — zero-blocking-gap confirmation.
- `constitutional-compliance` (SKILL-001) — final precedence/compliance attestation.

## 7. Deliverables

1. **DONE Confirmation Record** — per `GATE-DONE-001`, all eight conditions evidenced.
2. **Release Gate Verdict** (`GATE-REL-001`) — R1–R7 PASS/FAIL with evidence.
3. **Certification Record** (`UCOS-REL-CERT-NNN`) — formal attestation for the scope.
4. **Release Authorization + Changelog/Release Notes** — semantic version, rollback reference.
5. **Final Traceability & Gap-Closure Report** for the certified scope.

## 8. Output Locations

| Deliverable | Location |
|-------------|----------|
| Certification records & DONE confirmation | `release/certifications/UCOS-REL-CERT-NNN.md` |
| Release gate verdict, changelog, release notes | `release/` |
| Final traceability/gap report | `release/traceability/` |
| Registry + State | `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md` |

## 9. Traceability Rules

- Certification confirms the COMPLETE chain (Vision → Capability → Domain → Spec → Contract →
  Service → Implementation → Test → Certification) for the scope — zero orphans/dangling links.
- Each certification record links to the validation reports and gate verdicts it relies on.
- A certification with any open blocking gap in scope is PROHIBITED (Constitution Art. X).

## 10. Artifact Registration Rules

- Register each certification record and release verdict with unique IDs and bidirectional links.
- Update certified artifacts' status to "Certified"; record the certification ID downstream.
- Never delete; superseded certifications are deprecated and linked to the new record.

## 11. Validation Requirements

- **DONE (`GATE-DONE-001`):** all 8 conditions confirmed with evidence.
- **Release gate (`GATE-REL-001`):** R1–R7 PASS.
- **Traceability + gap scan:** zero blocking gaps; full lineage for the scope.
- Any FAIL blocks release; recorded as a gap and routed back to Prompts 10/11.

## 12. Completion Criteria

- DONE confirmed and Release gate PASS for the certified scope.
- Certification record issued and registered; changelog/release notes produced; release authorized.
- Zero open blocking gaps; full traceability confirmed.
- `PROJECT-STATE.md` Certification Status updated to CERTIFIED for the scope.

## 13. State Update Rules

- Mark Prompt 12 ✅ Complete for the certified scope; Phase → "Phase 12 — Certification & Release".
- Update Certification Status table to CERTIFIED; record certification IDs and version.
- On FAIL: record blocking gaps, keep scope uncertified, set Next Step back to Prompt 10/11.
- For ongoing programs, set Next Step to the next increment's pipeline entry.

## 14. May Generate / May Not Generate

**MAY generate:** DONE confirmations, release-gate verdicts, certification records, release authorizations, changelogs/release notes, final traceability reports, state updates.

**MAY NOT generate:** product code or fixes (Prompts 10/11), new specs/contracts/designs
(Prompts 02–09), and MAY NOT certify any scope with open blocking gaps.

## Traceability
- Refines: Prompt 11 validation results, Prompt 08 release-readiness, all upstream gates
- Refined by: none (terminal); feeds the next increment's cycle.
