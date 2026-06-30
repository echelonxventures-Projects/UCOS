# UCOS — Architecture Principles

**Artifact ID:** CTX-PRIN-001
**Status:** Baseline (bootstrap)
**Authority:** Subordinate to the Constitution; binding on all architecture and implementation.

Each principle has: **Statement → Rationale → Implication.**

---

### P1 — Composability over Monolith
- **Statement:** Capabilities are independently designed, deployed, and recombined.
- **Rationale:** Universality requires assembling, not rebuilding.
- **Implication:** Strict boundaries; no hidden coupling; contracts at every seam.

### P2 — Contract-First, Always
- **Statement:** Define the contract before the implementation.
- **Rationale:** Boundaries must be stable and interoperable.
- **Implication:** OpenAPI/AsyncAPI/GraphQL/JSON-Schema artifacts precede service code.

### P3 — Configuration over Customization
- **Statement:** Express variability as metadata, not branches of code.
- **Rationale:** One core must serve many commerce models.
- **Implication:** A first-class metadata architecture; no per-tenant code forks.

### P4 — Domain-Driven Boundaries
- **Statement:** Model the business as bounded contexts with a ubiquitous language.
- **Rationale:** Aligns software with business reality and reduces coupling.
- **Implication:** Context maps, anti-corruption layers, explicit integration patterns.

### P5 — Traceability End-to-End
- **Statement:** Every artifact links upward to intent and downward to realization.
- **Rationale:** Governance and change safety depend on lineage.
- **Implication:** Mandatory Artifact IDs and registry entries.

### P6 — Security & Privacy by Default
- **Statement:** Least-privilege, zero-trust, data minimization are defaults.
- **Rationale:** Commerce handles sensitive financial and personal data.
- **Implication:** Threat modeling and control mapping are part of design, not afterthoughts.

### P7 — Observability & Operability
- **Statement:** Everything is measurable, traceable, and operable in production.
- **Rationale:** You cannot run what you cannot see.
- **Implication:** Logging, metrics, tracing, and health are design inputs.

### P8 — Idempotency & Resilience
- **Statement:** Operations are safe to retry; the system degrades gracefully.
- **Rationale:** Distributed commerce systems fail partially and often.
- **Implication:** Idempotency keys, retries, timeouts, and backpressure are designed.

### P9 — Evolvability
- **Statement:** Optimize for change; version everything that crosses a boundary.
- **Rationale:** Commerce models and regulations change continuously.
- **Implication:** Versioned contracts, deprecation policy, migration paths.

### P10 — Production-Readiness by Construction
- **Statement:** Build it ready; certify it ready; never assume it ready.
- **Rationale:** Quality cannot be inspected in after the fact.
- **Implication:** Gates and certification are integral to the lifecycle.

## Traceability
- Refines: `UCOS-VISION.md`, `UCOS-CONSTITUTION.md`
- Enforced by: all `.claude/governance/` gates and `.claude/skills/`.
