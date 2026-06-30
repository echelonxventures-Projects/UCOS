# UCOS — Constitution

**Artifact ID:** CTX-CONST-001
**Status:** SUPERSEDED — REFERENCE ONLY — NON-AUTHORITATIVE
**Superseded by:** `docs/constitution/UCOS-CONSTITUTION.md` (`UCOS-CONST-001`) — the canonical, ratified UCOS Constitution.
**Authority:** NON-AUTHORITATIVE. This bootstrap baseline holds **no** governing authority. The **Authority Layer** (`AUTH-001..012`) is supreme; the canonical Constitution (`UCOS-CONST-001`) is the single constitutional source of truth and is itself subordinate to Authority.
**Amendment:** Not amendable. Retained (never deleted) per immutability and traceability governance.

> ⚠️ **NOTE (Phase 1.1 — Constitution Validation & Ratification).** This bootstrap baseline has been
> **SUPERSEDED** by the canonical Constitution at `docs/constitution/UCOS-CONSTITUTION.md`
> (`UCOS-CONST-001`). It is preserved as **REFERENCE ONLY / NON-AUTHORITATIVE** to maintain a single
> constitutional source of truth and eliminate constitutional ambiguity. **Do not govern from this
> file.** The original supremacy and precedence statements below are historical; they are corrected
> by the canonical Constitution and the Authority Layer:
>
> - The **Authority Layer is supreme** (AUTH-002 Article XI); the Constitution is subordinate to it.
> - Precedence is **Authority > Constitution > Architecture > Specifications > Implementation >
>   Validation > Certification** (AUTH-009 §6.2).
>
> The articles below are retained verbatim as the historical bootstrap baseline only.

---

## Article I — Primacy & Precedence
1. The Constitution is the supreme governing artifact of UCOS.
2. Order of precedence: **Constitution → Principles → Architecture Baseline → Governance Gates → Specifications → Implementation.**
3. No artifact, prompt, or implementation may contradict a higher-precedence artifact.

## Article II — Traceability
1. Every artifact MUST have a unique Artifact ID and be recorded in `UCOS-ARTIFACT-REGISTRY.md`.
2. Every artifact MUST declare upstream (what it refines) and downstream (what refines it) links.
3. No orphan artifacts. An artifact with no traceable parent capability/domain is a **gap**.

## Article III — Domain-Driven Boundaries
1. The system is organized into **bounded contexts** defined in `UCOS-DOMAIN-CATALOG.md`.
2. Cross-context communication occurs ONLY through published contracts.
3. No shared mutable domain models across contexts.

## Article IV — Contract-First
1. Every service boundary MUST be defined by an explicit, versioned contract before implementation.
2. Breaking changes require a new contract version and a documented migration path.

## Article V — Metadata & Configurability
1. Variability across commerce models MUST be expressed as metadata/configuration, not code forks.
2. The metadata architecture is authoritative for configurable behavior.

## Article VI — Security & Trust
1. Zero-trust and least-privilege are defaults, not options.
2. No network-exposed capability ships without authentication/authorization defined.
3. Secrets are never embedded in code or artifacts.

## Article VII — Quality & Production-Readiness
1. No increment is "done" until it passes quality, security, documentation, and release gates.
2. Production-readiness is designed in and certified, never assumed.

## Article VIII — Documentation
1. Architecture and decisions MUST be documented as durable artifacts.
2. Undocumented behavior is treated as a defect.

## Article IX — Governed Generation
1. Platform, domains, services, and code are generated ONLY by their designated prompts.
2. Bootstrap phase MUST NOT generate platform/domain/service/code artifacts.

## Article X — Gap Discipline
1. Gaps are first-class artifacts: detected, recorded, owned, and resolved.
2. Open gaps block certification of the affected scope.

## Traceability
- Refines: `UCOS-VISION.md`
- Refined by: `UCOS-PRINCIPLES.md`, all governance gates, all generators.
- Authoritative companion: `.claude/UCOS-MASTER-BOOTSTRAP.md`
