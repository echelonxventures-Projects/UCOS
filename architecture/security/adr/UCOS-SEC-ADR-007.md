# UCOS-SEC-ADR-007 — Immutable Audit-Logging Architecture (S6)

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SEC-ADR-007` |
| Status | Accepted (design) |
| Phase | Phase 9 — Security Architecture (Prompt 09) |
| Parent | `UCOS-SEC-ARCH-001` |
| Date | 2026-06-30 |
| Owner | Security Architect (`UCOS-DOM-024`; CAP-17) |
| Anchors | SP-07; AUD-1..7; S6; AUTH-008 §6.6; Const. X.4; IP-10 |

## Context
Security-relevant events must be logged immutably and attributably; evidence must never be suppressed
or mutated. The platform exposes an audit/evidence substrate (`PE-10`) that is append-only and
tamper-evident.

## Decision
Adopt an **immutable, attributable audit-logging architecture**: (1) all security-relevant events
(authn, authz allow/deny, secret resolution, key/rotation ops, privilege changes, tenancy decisions,
control-plane changes) are captured via `PRS-039`; (2) records are append-only and immutable
(`PRD-010` boundary); (3) every record names principal, tenant, action, resource, decision, and time;
(4) integrity is tamper-evident (`PRS-042`) with attestation (`PRS-041`) and custody (`PRS-040`);
(5) evidentiary records (`PD-10`) are preservation-biased; (6) disabling/bypassing audit is prohibited
and is itself an audited, Approval-Required event; (7) audit references sensitive data by
classification/identifier, never by value.

## Alternatives Considered
| # | Alternative | Why not selected |
|---|-------------|------------------|
| A | Mutable application logs as the audit record | Not tamper-evident or append-only; fails S6 / AUD-2 and undermines non-repudiation (SP-07). |
| B | Best-effort / sampled audit capture | Security-relevant events must be captured completely (AUD-1); sampling creates evidentiary gaps. |
| C | Embedding full payloads (incl. sensitive values) in audit records | Violates DP-6 / AUD-7 (reference by classification/identifier, never by value); creates a new disclosure surface. |
| D | Permitting audit disable/bypass under load | Violates AUD-6 (no suppression); disabling audit is itself an audited, Approval-Required event. |

## Consequences
- **Positive:** Non-repudiation (SP-07); tamper-evident evidence base for compliance and Prompt 11.
- **Negative / cost:** Audit volume and retention must be governed; no suppression even under load.
- **Constraints:** No logging product, storage engine, or retention technology selected here.
- **Verification:** S6 immutability/attribution/integrity verified by Prompt 11.

## Traceability
- Refines: `UCOS-SEC-ARCH-001` §VIII; AUTH-008; `UCOS-PEA-002` (`PRD-010`); CAP-16.
- Refined by: Prompts 10–12 (certification evidence).
