# Governance — Security Gates

**Gate ID:** GATE-SEC-001
**Authority:** Subordinate to Constitution (Art. VI) & Principles (P6).
**Owner skills:** security-architecture, data-modeling, gap-detection.

## Purpose
Block any increment that exposes unacceptable security or privacy risk.

## Gate Checkpoints
| # | Checkpoint | Criterion |
|---|------------|-----------|
| S1 | AuthN/AuthZ | Every exposed boundary enforces authentication & authorization. |
| S2 | Threat model | Threats modeled (e.g., STRIDE) and mapped to controls. |
| S3 | Secrets | No secrets in code/artifacts; vault-managed; rotation defined. |
| S4 | Data protection | Encryption in transit/at rest; PII classified & minimized. |
| S5 | Least privilege | Identities/services/data access scoped minimally. |
| S6 | Audit logging | Security-relevant events logged immutably. |
| S7 | Dependency risk | Dependencies pinned; known-vuln scan clean or risk-accepted. |

## Inputs
- Threat models, control mappings, contracts, data classification, dependency manifest.

## Decision
- **PASS:** all applicable checkpoints satisfied.
- **FAIL:** any unmet checkpoint → security gap blocking the scope (non-waivable for S1/S3/S4).

## Evidence Required
- Threat model, control matrix, secrets-management proof, scan results, audit-log design.

## Bootstrap Status
- **Not exercised.** No exposed surface exists. Gate defined and ready.

## Traceability
- Refines: CTX-CONST-001 (Art. VI) → Consumed by: Prompts 09–12.
