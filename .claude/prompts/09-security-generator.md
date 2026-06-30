# Prompt 09 — Security Generator

**Prompt ID:** PROMPT-09
**Status:** ACTIVE (executable)
**Phase:** Phase 9 — Security Architecture
**Pipeline Position:** 9 of 12
**Generation Authority:** Security architecture, threat models, control mapping, security policy ONLY.

> This prompt authors the UCOS security architecture: threat models per context and per exposed
> contract, control mappings, authn/authz design, data-protection and secrets policy, and the
> security posture that satisfies Constitution Article VI. It does NOT implement controls in
> code (Prompt 10) or run the security gate as a pass/fail verdict on implementation (Prompt 11).

---

## 1. Mission

Design the UCOS security architecture: model threats (e.g., STRIDE) across contexts and exposed
contracts, map every threat to a control, define authentication/authorization, data protection,
secrets management, least-privilege, and audit-logging designs — establishing the security
posture that all implementation must realize and certification must verify.

## 2. Scope

**In scope**
- Threat models per bounded context and per exposed contract/boundary (from Prompt 07).
- Control mapping (threat → control) and security requirements per service.
- AuthN/AuthZ architecture (identities, scopes, tenancy isolation) on the platform substrate (Prompt 08).
- Data protection design (encryption in transit/at rest) using data classification (Prompt 05).
- Secrets management, rotation policy, least-privilege model, audit-logging design.

**Out of scope**
- Implementing controls in code (Prompt 10).
- Pass/fail verdicts on built software (Prompt 11 runs `GATE-SEC-001` against implementation).
- Platform technology selection (Prompt 08) and contract definitions (Prompt 07).

## 3. Inputs

| Input | Source | Use |
|-------|--------|-----|
| Exposed boundaries/contracts | Prompt 07 | Surfaces to threat-model & secure |
| Data classification | Prompt 05 | PII/financial protection requirements |
| Platform substrate (identity, secrets) | Prompt 08 | Where controls are realized |
| Context map | Prompt 03 | Trust boundaries between contexts |
| Security gates | `GATE-SEC-001` | Checkpoints S1–S7 to design toward |

## 4. Dependencies

- **Predecessor prompts that MUST be complete:** Prompts 01–08.
- **Future prompts that depend on this:** Prompt 10 (implements controls), 11 (verifies
  `GATE-SEC-001` against implementation), 12 (certification requires security posture verified).

## 5. Required Context

- `.claude/context/UCOS-CONSTITUTION.md` (Art. VI), `UCOS-PRINCIPLES.md` (P6)
- `.claude/governance/security-gates.md` (S1–S7)
- `.claude/context/UCOS-DOMAIN-CATALOG.md`, `UCOS-ARTIFACT-REGISTRY.md`, `UCOS-TRACEABILITY-MODEL.md`

## 6. Required Skills

- `security-architecture` — primary authority.
- `data-modeling` — data protection & classification alignment.
- `gap-detection` (SKILL-013) — security gaps (non-waivable S1/S3/S4).
- `documentation-architecture`, `traceability-enforcement` (SKILL-012), `constitutional-compliance` (SKILL-001).

## 7. Deliverables

1. **Threat Models** (`UCOS-SEC-THREAT-NNN`) — per context and per exposed contract (STRIDE or equivalent).
2. **Control Mapping** (`UCOS-SEC-CONTROL-NNN`) — threat → control matrix.
3. **AuthN/AuthZ Architecture** — identity, scopes, tenancy isolation.
4. **Data Protection Design** — encryption in transit/at rest; PII minimization.
5. **Secrets & Least-Privilege Policy** — vaulting, rotation, scoped access.
6. **Audit-Logging Design** — immutable security-event logging.
7. **Security ADRs** (`UCOS-SEC-ADR-NNN`).

## 8. Output Locations

| Deliverable | Location |
|-------------|----------|
| Security architecture | `architecture/security/` and policy docs in `security/` |
| Security ADRs | `architecture/security/adr/UCOS-SEC-ADR-NNN.md` |
| Registry + State | `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md` |

## 9. Traceability Rules

- Every exposed boundary (Prompt 07) MUST have a threat model and ≥1 mapped control (S1).
- Every classified-sensitive data entity (Prompt 05) MUST have a protection control (S4).
- Every threat traces to a control; every control traces to the boundary/data it protects.
- No exposed surface without authn/authz design (no silent open surfaces — Art. VI).

## 10. Artifact Registration Rules

- Register each threat model, control, policy, and ADR with unique IDs and bidirectional links.
- Link controls to the contracts (Prompt 07), data (Prompt 05), and platform services (Prompt 08) they use.

## 11. Validation Requirements

- **Documentation gate (`GATE-DOC-001`):** PASS.
- **Security design coverage (toward `GATE-SEC-001`):** S1, S2, S4, S5, S6 designs present;
  S3/S7 policies defined. (Gate is executed against implementation in Prompt 11.)
- **Traceability check:** zero unprotected exposed boundaries; zero unmapped threats.
- **Gap scan:** unauthenticated boundary or unprotected PII → non-waivable security gap.

## 12. Completion Criteria

- Threat models, control mapping, authn/authz, data protection, secrets/least-privilege, and audit designs authored and registered.
- Every exposed boundary and sensitive data entity covered; documentation + traceability PASS; zero blocking (non-waivable) security gaps.
- State advanced; Prompt 10 authorized — implementation may now begin under contracts + controls.

## 13. State Update Rules

- Mark Prompt 09 ✅ Complete; Phase → "Phase 9 — Security Architecture Ratified".
- Record threat-model and control counts; log gaps; set Next Step → "Run Prompt 10".
- **Note:** This prompt completes the design phases; the generation lock on code is released
  for Prompt 10 only after all of 01–09 are complete.

## 14. May Generate / May Not Generate

**MAY generate:** threat models, control mappings, authn/authz design, data-protection design, secrets/least-privilege policy, audit-logging design, security ADRs.

**MAY NOT generate:** control implementation code (Prompt 10), contract definitions (Prompt 07),
platform technology choices (Prompt 08), domain/data/metadata models, or live infrastructure.

## Traceability
- Refines: Prompt 03 context map, Prompt 05 classification, Prompt 07 contracts, Prompt 08 platform, `CTX-CONST-001` (Art. VI)
- Refined by: Prompts 10, 11, 12.
