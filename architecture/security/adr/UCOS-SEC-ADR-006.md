# UCOS-SEC-ADR-006 — Data Protection Model (S4)

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SEC-ADR-006` |
| Status | Accepted (design) |
| Phase | Phase 9 — Security Architecture (Prompt 09) |
| Parent | `UCOS-SEC-ARCH-001` |
| Date | 2026-06-30 |
| Owner | Security Architect (`UCOS-DOM-024`; CAP-17) |
| Anchors | SP-05; DP-1..7; S4 (non-waivable); AUTH-008 §6.4/§7; AUTH-007 |

## Context
Non-waivable control S4 requires encryption in transit and at rest, and PII/financial/security data
to be classified and minimized. The data sensitivity taxonomy is inherited unchanged from
`UCOS-PDATA-ARCH-001` §III.5 (Restricted-PII/Financial/Security, Regulated-Evidentiary, Confidential,
Internal).

## Decision
Adopt a **classification-driven data protection model**: (1) encryption in transit on every boundary
and inter-service hop; (2) encryption at rest for all persisted data with keys externally managed in
`PE-09` and never co-located with data (DP-7); (3) each entity's inherited sensitivity class determines
its mandatory protection set (see control mapping §5); unclassified sensitive data is a blocking gap
(AUTH-007 §7); (4) data minimization — collect/retain/expose the minimum; projections expose only what
a contract requires; (5) tenant partitioning of data and projections; (6) no sensitive values in
logs/audit payloads (reference by classification/identifier only).

## Alternatives Considered
| # | Alternative | Why not selected |
|---|-------------|------------------|
| A | Field-level encryption only (no at-rest baseline) | Leaves the bulk of persisted data unencrypted; S4 / AUTH-008 §6.4 require encryption at rest for all persisted data, not selective fields. |
| B | Application-managed keys co-located with the data | Violates DP-7 (key separation) and S3; co-location collapses the blast-radius isolation the model depends on. |
| C | Classification-blind uniform protection | Not proportional — simultaneously over-protects Internal data and risks under-specifying Restricted classes; AUTH-007 mandates classification-driven controls (DP-4). |
| D | Tokenization/redaction without encryption | Useful as a minimization aid (DP-3) but insufficient alone for the in-transit + at-rest encryption mandate (DP-1/DP-2). |

## Consequences
- **Positive:** S4 enforced uniformly and proportionally to sensitivity; leakage surfaces minimized.
- **Negative / cost:** Encryption and minimization add processing and design overhead; classification must be maintained.
- **Constraints:** No cipher suite, key length, datastore, encryption product, or KMS selected here.
- **Verification:** Encryption-in-transit/at-rest and classification coverage verified by Prompt 11.

## Traceability
- Refines: `UCOS-SEC-ARCH-001` §VI; AUTH-008/AUTH-007; `UCOS-PDATA-ARCH-001` §III.5; `UCOS-PEA-002` (`PRD-002/009`).
- Refined by: Prompts 10–11.
