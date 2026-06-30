# AUTH-003 — Principles Authority

**Authority ID:** AUTH-003
**Layer:** AUTHORITY
**Status:** RATIFIED (canonical principles)
**Version:** 1.0.0
**Supersedes:** `CTX-PRIN-001` (baseline principles) as the canonical principle set.
**Immutability:** Immutable record. Evolves only via version increment + decision record (AUTH-012) + approval.

> These principles are binding architectural law subordinate only to AUTH-001 and AUTH-002. Every
> architecture, specification, and implementation MUST comply. They are constitutional inputs to
> all future phases.

---

## 1. Purpose

Ratify and formalize the complete set of immutable UCOS principles — both the foundational
architectural principles (P1–P10) and the seventeen immutable program principles (IP-01–IP-17) —
that govern how UCOS is designed, built, evolved, and operated.

## 2. Scope

**In scope**
- The canonical principle catalog: statement, rationale, and binding implication for each.
- The mapping between baseline principles (P1–P10) and the immutable principles (IP-01–IP-17).

**Out of scope**
- Enforcement mechanics (AUTH-009 / gates), and any architecture or implementation design.

## 3. Ownership

| Role | Responsibility |
|------|----------------|
| Chief Authority Architect | Custodian of the principle catalog. |
| Authority Board | Approves additions, amendments, or deprecations. |
| All gates & agents | Enforce principles as compliance criteria. |

## 4. Dependencies

- **Upstream:** AUTH-001 (Vision), AUTH-002 (Constitution).
- **Downstream:** AUTH-004 through AUTH-010, all gates, all prompts, all implementations.

## 5. Controlled Artifacts

- `.claude/context/UCOS-PRINCIPLES.md` (`CTX-PRIN-001`) — subordinate; must conform to AUTH-003.

## 6. Governance Rules

### 6.1 Foundational Architecture Principles (P1–P10)

| ID | Principle | Binding Implication |
|----|-----------|---------------------|
| P1 | Composability over Monolith | Strict boundaries; no hidden coupling; contracts at every seam. |
| P2 | Contract-First, Always | Contract artifacts precede service code. |
| P3 | Configuration over Customization | First-class metadata architecture; no per-tenant code forks. |
| P4 | Domain-Driven Boundaries | Context maps, ACLs, explicit integration patterns. |
| P5 | Traceability End-to-End | Mandatory Artifact IDs and registry entries. |
| P6 | Security & Privacy by Default | Threat modeling and control mapping are design inputs. |
| P7 | Observability & Operability | Logging, metrics, tracing, health are design inputs. |
| P8 | Idempotency & Resilience | Idempotency keys, retries, timeouts, backpressure are designed. |
| P9 | Evolvability | Versioned contracts, deprecation policy, migration paths. |
| P10 | Production-Readiness by Construction | Gates and certification are integral to the lifecycle. |

### 6.2 Immutable Program Principles (IP-01–IP-17)

Each is **immutable** (Article XI): binding, non-negotiable, and changeable only by versioned
amendment with Authority Board approval.

| ID | Principle | Statement → Binding Implication | Anchors |
|----|-----------|----------------------------------|---------|
| IP-01 | No Hardcoding | No business value, rule, threshold, or variant is hardcoded; it is registry/metadata/config/policy driven. | P3, Art. V |
| IP-02 | Registry Driven Architecture | Behavior and wiring resolve through registries, not embedded literals. | P5 |
| IP-03 | Metadata Driven Architecture | Structure and behavior are described by governed metadata. | P3, Art. V |
| IP-04 | Configuration Driven Architecture | Environment/tenant/channel variability is configuration, not branches. | P3 |
| IP-05 | Policy Driven Architecture | Authorization, validation, and lifecycle rules are externalized policies. | P6 |
| IP-06 | Workflow Driven Architecture | Cross-step orchestration is expressed as governed workflows, not ad-hoc code paths. | P1, P8 |
| IP-07 | Contract First Architecture | Versioned contracts precede and govern every boundary. | P2, Art. IV |
| IP-08 | Traceability First Governance | No artifact exists without lineage to Authority; traceability precedes acceptance. | P5, Art. II |
| IP-09 | Security By Default | Zero-trust, least-privilege, no embedded secrets — always on. | P6, Art. VI |
| IP-10 | Auditability By Default | Every governed action emits an immutable, attributable audit record. | Art. VI, XII |
| IP-11 | Observability By Default | Logs, metrics, traces, and health are intrinsic to every component. | P7 |
| IP-12 | Extensibility By Default | Extension occurs via sanctioned extension points, never core forks. | P1, P3 |
| IP-13 | Versioning By Default | Everything crossing a boundary is versioned. | P9 |
| IP-14 | Migration Only Evolution | State/schema/contract change occurs only through reversible, recorded migrations. | P9 |
| IP-15 | Backward Compatibility Governance | Breaking changes require new versions, deprecation windows, and migration paths. | P9, Art. IV |
| IP-16 | Autonomous Agent Governance | Agents act only within defined zones with audit and traceability. | Art. XIII |
| IP-17 | Approval By Exception | Default to maximum safe autonomy; interrupt humans only for enumerated approval-required operations. | Art. XII |

## 7. Compliance Rules

- Violation of any P or IP principle is a blocking gap until remediated.
- IP-09, IP-10, and IP-08 are non-waivable; no autonomy provision (IP-17) may weaken them.
- Compliance is asserted at every gate and confirmed at certification.

## 8. Approval Rules

- Amending, adding, or deprecating any principle is an **Approval-Required Operation**.
- Applying principles as compliance checks within authorized prompts is a **Trusted Operation**.

## 9. Change Procedure

1. Propose via AUTH-012 decision record; map impact to downstream canons and gates.
2. Obtain Authority Board approval; record reference.
3. Increment version; preserve superseded statements with supersession links.
4. Update AUTHORITY-INDEX and flag downstream artifacts for review.

## 10. Traceability Links

- **Refines:** AUTH-001 (Vision), AUTH-002 (Constitution).
- **Refined by:** AUTH-004–AUTH-010, all gates, all prompts.
- **Controls:** `CTX-PRIN-001`.

## 11. Version Information

| Version | Date | Author | Change | Decision Ref |
|---------|------|--------|--------|--------------|
| 1.0.0 | 2026-06-29 | Chief Authority Architect | Ratified P1–P10 and IP-01–IP-17. | AUTH-012 / AD-0005 |
