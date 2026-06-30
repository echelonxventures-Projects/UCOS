# UCOS — Architecture Baseline

**Artifact ID:** CTX-ARCHB-001
**Status:** Baseline (bootstrap) — refined by Prompts 02–09.
**Authority:** Subordinate to Constitution & Principles; binding on all architecture artifacts.

> This baseline fixes the **non-negotiable architectural stance** of UCOS. It does NOT design
> the platform, domains, or services. It establishes the rules within which those designs occur.

---

## 1. Architectural Style

- **Domain-Driven Design (DDD):** the system is decomposed into bounded contexts.
- **Composable / modular:** capabilities are independently deployable and recombinable.
- **Contract-first:** every boundary is an explicit, versioned contract.
- **Metadata-driven configurability:** variability is data, not code forks.
- **Event-aware:** asynchronous, contract-based eventing for cross-context integration.

## 2. Architectural Layers

| Layer | Responsibility | Future Location |
|-------|----------------|-----------------|
| Experience | User-facing surfaces & channels | `apps/`, `architecture/experience/` |
| Service / Application | Bounded-context behavior & orchestration | `services/`, `architecture/services/` |
| Domain | Business models & rules | `architecture/domains/` |
| Platform | Cross-cutting capabilities | `architecture/platform/`, `infra/` |
| Data | Canonical models & contracts | `architecture/data/` |
| Metadata | Configuration/variability model | `architecture/meta/` |
| Security | Trust, controls, threat model | `architecture/security/`, `security/` |

## 3. Boundary & Integration Rules
1. Cross-context calls go through **published contracts only**.
2. No shared mutable domain models across contexts; use ACLs/translation.
3. Synchronous coupling is minimized; prefer asynchronous, idempotent integration.
4. Every contract is versioned; breaking changes require new versions + migration paths.

## 4. Cross-Cutting Concerns (mandatory by design)
- **Identity & tenancy**, **configuration/metadata**, **observability**, **security**,
  **resilience/idempotency**, **auditability** are designed into every context, not bolted on.

## 5. Technology Stance
- **Deliberately unspecified at bootstrap.** Technology selection is a governed decision made
  in the platform engineering generator (Prompt 08) and recorded as ADRs in the registry.
- No framework, language, datastore, or cloud is assumed by this baseline.

## 6. Quality Attributes (architecturally significant requirements)
Availability, scalability, security/privacy, evolvability, observability, performance,
interoperability, and operability are first-class drivers. Each must be quantified by later
generators and verified by gates.

## 7. Constraints
1. Bootstrap MUST NOT produce platform/domain/service/code artifacts.
2. All refinements MUST register in the Artifact Registry and obey the Traceability Model.

## Traceability
- Refines: `UCOS-CONSTITUTION.md`, `UCOS-PRINCIPLES.md`
- Refined by: Prompts 02 (enterprise), 03 (domain), 04 (meta), 05 (data), 06 (experience),
  07 (service/API), 08 (platform), 09 (security).
