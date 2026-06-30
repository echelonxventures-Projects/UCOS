# Prompt 10 — Implementation Factory

**Prompt ID:** PROMPT-10
**Status:** ACTIVE (executable)
**Phase:** Phase 10 — Implementation
**Pipeline Position:** 10 of 12
**Generation Authority:** Code — services, apps, packages — strictly from ratified contracts & designs.

> This is the FIRST prompt permitted to generate code. The generation lock (Constitution
> Article IX) is released ONLY when prompts 01–09 are complete. Implementation MUST conform
> exactly to upstream contracts (Prompt 07), designs (03–06, 08), and security controls
> (Prompt 09). It introduces no new architecture, contracts, or unsanctioned scope.

---

## 1. Mission

Generate contract-conformant implementations for UCOS services, applications, and shared
packages — strictly realizing the ratified domain models, contracts, data models, metadata,
experiences, platform technology, and security controls — together with unit and contract tests,
on the technology selected in Prompt 08.

## 2. Scope

**In scope**
- Service implementations realizing domain logic (Prompt 03) behind contracts (Prompt 07).
- Application/front-end implementations realizing experience surfaces (Prompt 06).
- Shared packages/libraries (cross-cutting concerns from platform design, Prompt 08).
- Persistence realizing data models (Prompt 05); configuration resolution (Prompt 04).
- Security control implementation (Prompt 09); unit + contract tests; runbooks.

**Out of scope**
- Any new contract, capability, domain, data model, metadata, experience, platform decision,
  or security control NOT already ratified by Prompts 02–09 (would breach Article IX).
- Validation verdicts (Prompt 11) and certification/release (Prompt 12).
- Live production deployment (release authorized only after Prompt 12).

## 3. Inputs

| Input | Source | Use |
|-------|--------|-----|
| Service/API/event contracts | Prompt 07 | The exact surface to implement |
| Domain models | Prompt 03 | Business logic to realize |
| Data models & schemas | Prompt 05 | Persistence to implement |
| Metadata model | Prompt 04 | Config resolution to implement |
| Experience surfaces | Prompt 06 | Apps to build |
| Platform tech + topology | Prompt 08 | Technology to build on |
| Security controls | Prompt 09 | Controls to enforce in code |

## 4. Dependencies

- **Predecessor prompts that MUST be complete:** ALL of Prompts 01–09. Implementation MUST NOT
  begin while any design/governance phase is incomplete.
- **Future prompts that depend on this:** Prompt 11 (validates this code), Prompt 12 (certifies/releases it).

## 5. Required Context

- All ratified architecture under `architecture/**` and contracts under `specifications/contracts/**`.
- `.claude/context/UCOS-CONSTITUTION.md` (Art. IV, VII, IX), `UCOS-ARTIFACT-REGISTRY.md`, `UCOS-TRACEABILITY-MODEL.md`
- `.claude/governance/quality-gates.md`, `security-gates.md`, `documentation-gates.md`

## 6. Required Skills

- ALL design skills as references: `domain-driven-design`, `api-design`, `service-design`,
  `data-modeling`, `metadata-architecture`, `ui-ux-architecture`, `platform-engineering`, `security-architecture`.
- `testing-architecture` — unit + contract tests.
- `production-readiness` (SKILL-014), `traceability-enforcement` (SKILL-012), `gap-detection` (SKILL-013), `constitutional-compliance` (SKILL-001).

## 7. Deliverables

1. **Service implementations** (`UCOS-IMPL-SVC-NNN`) conformant to their contracts.
2. **Application implementations** (`UCOS-IMPL-APP-NNN`) realizing experience surfaces.
3. **Shared packages** (`UCOS-IMPL-PKG-NNN`) for cross-cutting concerns.
4. **Unit tests** for logic and **contract tests** (provider/consumer) per Prompt 07 specs.
5. **Per-increment runbooks** and inline/operability documentation.

## 8. Output Locations

| Deliverable | Location |
|-------------|----------|
| Services | `services/<service>/` |
| Applications | `apps/<app>/` |
| Shared packages | `packages/<package>/` |
| Tests | co-located with code and/or `quality/` per project convention |
| Registry + State | `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md` |

## 9. Traceability Rules

- Every implementation artifact traces to a contract + domain + capability (full chain, no orphans).
- Every contract operation has a conforming implementation and contract test.
- Every implemented control traces to a Prompt 09 control; every persisted entity to a Prompt 05 model.
- No implementation without an upstream design parent (Article IX enforcement).

## 10. Artifact Registration Rules

- Register each service/app/package and test suite with unique IDs and bidirectional links to contracts/designs.
- Record per-increment gate status (quality/security/documentation) on the artifact.

## 11. Validation Requirements

> Applied per implementation increment.

- **Quality gate (`GATE-QUAL-001`):** Q1–Q6 — including Q3 coverage and Q4 contract tests — PASS.
- **Security gate (`GATE-SEC-001`):** S1–S7 — non-waivable S1/S3/S4 — PASS.
- **Documentation gate (`GATE-DOC-001`):** D1–D6 — including D6 runbooks — PASS.
- **Traceability check:** zero orphan implementations; full contract coverage.
- Any failure → recorded gap blocking the increment; fixed before increment is "done".

## 12. Completion Criteria

- All in-scope services/apps/packages implemented strictly from ratified designs/contracts.
- Unit + contract tests present and passing; per-increment Quality/Security/Documentation gates PASS.
- Full traceability; zero blocking gaps; no unsanctioned scope introduced.
- State advanced; Prompt 11 authorized.

## 13. State Update Rules

- Mark Prompt 10 ✅ Complete (or record per-increment progress); Phase → "Phase 10 — Implementation".
- Record implemented artifact counts and gate status; log gaps; set Next Step → "Run Prompt 11".

## 14. May Generate / May Not Generate

**MAY generate:** service/app/package code, unit & contract tests, runbooks, operability docs — strictly realizing ratified upstream artifacts.

**MAY NOT generate:** new contracts, capabilities, domains, data/metadata/experience models,
platform technology decisions, or security controls (those belong to Prompts 02–09). MAY NOT
issue validation verdicts (Prompt 11) or certify/release (Prompt 12).

## Traceability
- Refines: Prompts 03–09 (contracts, designs, controls)
- Refined by: Prompts 11 (validation), 12 (certification).
