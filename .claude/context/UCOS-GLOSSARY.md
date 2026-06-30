# UCOS — Glossary (Ubiquitous Language)

**Artifact ID:** CTX-GLOSS-001
**Status:** Baseline (bootstrap) — expanded by domain architecture (Prompt 03).
**Purpose:** Single source of truth for terminology. Terms here are binding across all artifacts.

---

## Program & Governance Terms

| Term | Definition |
|------|------------|
| **UCOS** | Universal Commerce Operating System — the composable, governed commerce platform. |
| **Bootstrap** | The initialization phase that establishes the execution framework (this phase). |
| **Constitution** | Supreme governing artifact; binding rules that all artifacts obey. |
| **Principle** | A binding architectural rule subordinate to the Constitution. |
| **Artifact** | Any governed, registered deliverable (doc, spec, contract, model, code module). |
| **Artifact ID** | Unique identifier assigned to every artifact for traceability. |
| **Artifact Registry** | Authoritative index of all artifacts and their lineage. |
| **Traceability** | Verifiable linkage from intent (vision/capability) to realization (service/code). |
| **Gap** | A detected absence or inconsistency that blocks progress/certification until resolved. |
| **Gate** | A mandatory governance checkpoint (quality, security, documentation, release). |
| **Certification** | Formal attestation that an increment meets completion criteria. |
| **Generator / Prompt** | A governed procedure (in `.claude/prompts/`) that produces specific artifacts. |
| **Skill** | A reusable architectural competency/standard (in `.claude/skills/`). |
| **Project State** | The live record of phase, artifacts, gaps, and certification status. |

## Architecture Terms

| Term | Definition |
|------|------------|
| **Capability** | A business ability the platform provides (e.g., "Order Management"). |
| **Domain** | A sphere of business knowledge modeled as one or more bounded contexts. |
| **Bounded Context** | An explicit boundary within which a model and language are consistent. |
| **Context Map** | The documented relationships and integration patterns between contexts. |
| **Contract** | A versioned, explicit interface (API/event/data) at a boundary. |
| **Metadata Architecture** | The configuration-driven model expressing variability without code forks. |
| **Experience Surface** | A user-facing channel/application (web, admin, console, etc.). |
| **Platform Service** | A cross-cutting capability (identity, config, observability, messaging). |

## Commerce Domain Terms (provisional — refined by Prompt 03)

| Term | Definition |
|------|------------|
| **Catalog** | The structured representation of sellable products/services. |
| **Order** | A customer's committed intent to purchase, with lifecycle states. |
| **Cart** | A mutable pre-order collection of intended purchases. |
| **Fulfillment** | The process of delivering ordered goods/services. |
| **Payment** | Authorization, capture, and settlement of monetary value. |
| **Pricing** | Determination of price including promotions, taxes, and currency. |
| **Inventory** | Tracked availability of sellable units across locations. |
| **Customer** | A party (individual or organization) transacting with the business. |
| **Tenant** | An isolated business/configuration instance operating on UCOS. |

> Provisional commerce terms are placeholders pending domain modeling. They must NOT be
> treated as finalized bounded contexts until ratified by Prompt 03.

## Traceability
- Refines: `UCOS-VISION.md`, `UCOS-PRINCIPLES.md`
- Refined by: `UCOS-DOMAIN-CATALOG.md`, `UCOS-CAPABILITY-CATALOG.md`
