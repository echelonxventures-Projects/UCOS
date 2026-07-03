# UCOS — Authority Index

**Artifact ID:** AUTH-INDEX-001
**Layer:** AUTHORITY
**Status:** LIVE (canonical index of the Authority Layer)
**Version:** 1.0.0
**Last Updated:** 2026-06-29 (Phase 0.5A — Authority Layer Creation)

> The Authority Layer is the canonical source of truth for UCOS. Every artifact, prompt, agent, and
> pipeline derives from and complies with these documents. This index is the navigational entry
> point to the Authority Layer.

---

## 1. Authority Hierarchy (immutable)

```
AUTHORITY → BOOTSTRAP → CONSTITUTION → CONTEXT → SKILLS → PROMPTS
   → ARCHITECTURE → SPECIFICATIONS → IMPLEMENTATION → VALIDATION → CERTIFICATION
```

## 2. Conflict-Resolution Priority (Authority Wins)

```
Authority > Constitution > Architecture > Specifications > Implementation > Validation > Certification
```

Prompts are execution mechanisms, never sources of truth.

## 3. Authority Documents

| ID | Document | Concern | Status | Version | Supersedes / Governs |
|----|----------|---------|--------|---------|----------------------|
| AUTH-001 | `AUTH-001-VISION.md` | Vision / intent | RATIFIED | 1.0.0 | `CTX-VISION-001` |
| AUTH-002 | `AUTH-002-CONSTITUTION.md` | Supreme law (Articles I–XIII) | RATIFIED | 1.0.0 | `CTX-CONST-001` |
| AUTH-003 | `AUTH-003-PRINCIPLES.md` | Principles P1–P10 + IP-01–IP-17 | RATIFIED | 1.0.0 | `CTX-PRIN-001` |
| AUTH-004 | `AUTH-004-ARCHITECTURE-CANON.md` | Architecture rules | RATIFIED | 1.0.0 | `CTX-ARCHB-001` |
| AUTH-005 | `AUTH-005-DOMAIN-CANON.md` | Domain rules | RATIFIED | 1.0.0 | `CTX-DOM-001` |
| AUTH-006 | `AUTH-006-CAPABILITY-CANON.md` | Capability rules | RATIFIED | 1.1.0 | `CTX-CAP-001` |
| AUTH-007 | `AUTH-007-DATA-CANON.md` | Data rules | RATIFIED | 1.0.0 | data architecture |
| AUTH-008 | `AUTH-008-SECURITY-CANON.md` | Security rules | RATIFIED | 1.0.0 | `GATE-SEC-001` |
| AUTH-009 | `AUTH-009-GOVERNANCE-CANON.md` | Governance / approval / zones | RATIFIED | 1.0.0 | all `GATE-*` |
| AUTH-010 | `AUTH-010-TRACEABILITY-CANON.md` | Traceability rules | RATIFIED | 1.0.0 | `CTX-TRACE-001` |
| AUTH-011 | `AUTH-011-GLOSSARY-CANON.md` | Canonical terminology | RATIFIED | 1.0.1 | `CTX-GLOSS-001` |
| AUTH-012 | `AUTH-012-DECISION-LOG.md` | Decision repository | LIVE | 1.0.13 | program decisions |

## 4. Supporting Authority Documents

| ID | Document | Purpose | Status |
|----|----------|---------|--------|
| AUTH-INDEX-001 | `AUTHORITY-INDEX.md` | Navigational index (this file) | LIVE |
| AUTH-COV-001 | `AUTHORITY-COVERAGE-REPORT.md` | Coverage/gap validation | Final (Phase 0.5A) |
| AUTH-COMP-001 | `AUTHORITY-COMPLETION-REPORT.md` | Phase completion report | Final (Phase 0.5A) |

## 5. Authority Document Template (mandatory 11 sections)

Purpose · Scope · Ownership · Dependencies · Controlled Artifacts · Governance Rules ·
Compliance Rules · Approval Rules · Change Procedure · Traceability Links · Version Information

## 6. Approval Governance Summary

- **Model:** Approval By Exception (default = maximum safe autonomy).
- **Trusted Operations:** documentation, prompt/spec generation, traceability/state/registry
  updates, validation/certification execution, test generation, compliance/governance reporting,
  non-behavioral refactoring, static analysis, linting, formatting — autonomous + audited.
- **Approval-Required Operations:** Authority/Constitution modifications, security-policy changes,
  production deployment, secret/credential operations, external account creation, financial
  transactions, legal commitments, vendor onboarding, repository ownership changes, destructive
  actions, Authority artifact deletion.
- **Non-waivable controls:** security S1 (authn/authz), S3 (secrets), S4 (data protection).
- **Zones:** Trusted Document · Architecture · Governance · Workspace · Agent (see AUTH-009 §6.5).

## 7. Change & Immutability

Authority artifacts are immutable records: never deleted; evolve only via Version Increment →
Decision Record (AUTH-012) → Traceability Update → Approval Record → Governance Review.

## Traceability
- Refines: AUTH-001..AUTH-012.
- Refined by: all program artifacts (navigational root of the Authority Layer).
