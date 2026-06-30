# UCOS-SEC-ADR-005 — Secrets & Key Management Policy (S3)

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SEC-ADR-005` |
| Status | Accepted (design) |
| Phase | Phase 9 — Security Architecture (Prompt 09) |
| Parent | `UCOS-SEC-ARCH-001` |
| Date | 2026-06-30 |
| Owner | Security Architect (`UCOS-DOM-024`; CAP-17) |
| Anchors | SP-04; SEC-1..6; S3 (non-waivable); AUTH-008 §6.3/§7/§8 |

## Context
Non-waivable control S3 forbids any secret in code, configuration, IaC, or artifacts and requires
vault-managed secrets with defined rotation. The platform exposes a secrets/key substrate (`PE-09`)
separated from configuration and data.

## Decision
Adopt a **reference-only secrets & key management policy**: (1) artifacts contain only governed secret
**references** (`PRS-038`), never literals; (2) secrets are issued/injected at runtime via `PRS-035`;
(3) keys have a governed lifecycle via `PRS-036` and are stored separately from the data they protect
(DP-7); (4) every secret/key class has a defined rotation policy coordinated by `PRS-037`; secret/
credential/key creation, modification, and rotation are **Approval-Required Operations**; (5) secrets
are never co-mingled with configuration/metadata (`PRD-009` boundary); (6) secret resolution is
least-privilege and audited.

## Consequences
- **Positive:** S3 enforced by construction; blast radius of leakage minimized; rotation governed.
- **Negative / cost:** Runtime secret resolution dependency on `PE-09`; rotation requires approval workflow.
- **Constraints:** No vault/KMS/HSM product, cipher, or key length selected here.
- **Verification:** Secret-scanning (no embedded secrets) and rotation evidence verified by Prompt 11.

## Traceability
- Refines: `UCOS-SEC-ARCH-001` §VII; AUTH-008; `UCOS-PEA-002` (`PRD-009`).
- Refined by: `UCOS-SEC-ADR-006` (data protection); Prompts 10–11.
