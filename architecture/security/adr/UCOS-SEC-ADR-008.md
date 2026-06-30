# UCOS-SEC-ADR-008 — Threat-Modeling Methodology (STRIDE)

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SEC-ADR-008` |
| Status | Accepted (design) |
| Phase | Phase 9 — Security Architecture (Prompt 09) |
| Parent | `UCOS-SEC-ARCH-001` |
| Date | 2026-06-30 |
| Owner | Security Architect (`UCOS-DOM-024`; CAP-17) |
| Anchors | SP-06; S2; AUTH-008 §6.5; Const. X.3 |

## Context
AUTH-008 §6.5 requires threats to be modeled per context and per exposed contract and mapped to
controls, with every threat tracing to a control and every control to what it protects. A consistent,
repeatable methodology is needed across 28 contexts, 10 trust boundaries, and (later) per-contract
surfaces.

## Decision
Adopt **STRIDE** as the canonical threat-modeling methodology for UCOS: (1) every trust boundary and
domain class is modeled across the six STRIDE categories (`UCOS-SEC-THREAT-001`); (2) each threat
receives a stable identifier and maps to ≥1 control (`UCOS-SEC-CONTROL-001`); (3) a threat model and
control mapping are **required for every change** that introduces or alters a boundary (SEC-CTL-019);
(4) per-contract threat models are derived (inheriting the relevant boundary model) upon ratification
of Prompt 07 contracts (forward obligation FO-1); (5) residual risk is re-scored against
implementation in Prompt 11 (FO-3).

## Alternatives Considered
| # | Alternative | Why not selected |
|---|-------------|------------------|
| A | PASTA (risk-centric, attacker-simulation) | Heavier and business-risk-centric; less suited to uniform, repeatable per-boundary category coverage across 28 contexts and 10 boundaries at architecture stage. |
| B | LINDDUN (privacy-threat methodology) | Privacy-focused and narrower than the full STRIDE category space required here; retained as a *complementary* augmentation for Restricted-PII boundaries, not the canonical method. |
| C | Attack-tree / ad-hoc modeling only | Not systematically category-complete per boundary; risks unmodeled categories — conflicts with AUTH-008 §6.5 repeatable per-boundary requirement. |
| D | No fixed methodology (per-team choice) | Produces inconsistent, non-comparable coverage; defeats the uniform threat→control lineage and `GATE-SEC-001` S2 auditability. |

## Consequences
- **Positive:** Uniform, auditable coverage; no unmodeled boundary; clear threat→control lineage.
- **Negative / cost:** Threat-modeling discipline required at every boundary-affecting change.
- **Constraints:** Methodology is process/architecture-level; no tooling product selected here.
- **Verification:** Coverage and mapping verified by Prompt 11 (`GATE-SEC-001` S2).

## Traceability
- Refines: `UCOS-SEC-ARCH-001` §IX; `UCOS-SEC-THREAT-001`; AUTH-008 §6.5.
- Refined by: `UCOS-SEC-CONTROL-001`; Prompt 07 (FO-1); Prompts 10–11.
