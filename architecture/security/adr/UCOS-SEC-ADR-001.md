# UCOS-SEC-ADR-001 — Zero-Trust Boundary Enforcement Model

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SEC-ADR-001` |
| Status | Accepted (design) |
| Phase | Phase 9 — Security Architecture (Prompt 09) |
| Parent | `UCOS-SEC-ARCH-001` |
| Date | 2026-06-30 |
| Owner | Security Architect (`UCOS-DOM-024`; CAP-17) |
| Anchors | SP-01, SP-02, SP-08; S1; Const. X.1/X.3; AUTH-008 §6.1/§6.2 |

## Context
UCOS must guarantee that no identity, service, agent, or data access is implicitly trusted, and that
every exposed boundary enforces authentication and authorization (non-waivable S1). The platform
substrate exposes request/response (`PE-05`) and event (`PE-04`) boundaries plus inter-service hops
(`PE-03`). A model is needed that is technology-neutral yet binding on all implementation.

## Decision
Adopt a **zero-trust boundary enforcement model**: (1) every boundary (TB-01..TB-10) is an explicit
enforcement point that delegates authentication to `PRS-031` and authorization to `PRS-032` before any
business effect; (2) network reachability confers **no** authority — rights derive only from an
authenticated, authorized, tenant-scoped principal; (3) defense-in-depth requires enforcement at the
boundary, at authorization, and at the data-access broker; (4) deny-by-default everywhere. No silent
open surfaces are permitted.

## Consequences
- **Positive:** Uniform S1 enforcement; no ambient trust; lateral-movement risk reduced (SEC-CTL-017).
- **Negative / cost:** Every boundary and inter-service call incurs an authn/authz step (latency/throughput cost addressed by SEC-CTL-020).
- **Constraints:** No transport protocol, mTLS library, gateway product, or service-mesh is selected here (deferred to technology-selection ADRs / Prompt 10).
- **Verification:** S1 verified against implementation by Prompt 11 (`GATE-SEC-001`).

## Traceability
- Refines: `UCOS-SEC-ARCH-001` §I/§IX/§X; AUTH-008; `UCOS-PEA-002` (`PE-03/04/05/08`).
- Refined by: Prompt 10 (implementation), Prompt 11 (verification).
