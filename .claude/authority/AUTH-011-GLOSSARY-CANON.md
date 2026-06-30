# AUTH-011 — Glossary Canon

**Authority ID:** AUTH-011
**Layer:** AUTHORITY
**Status:** RATIFIED (canonical terminology)
**Version:** 1.0.1
**Supersedes:** `CTX-GLOSS-001` (glossary) as the canonical, binding terminology authority.
**Immutability:** Immutable record. Evolves only via version increment + decision record (AUTH-012) + approval.

> Terms defined here are binding across all UCOS artifacts. Where any artifact uses a governed term,
> it carries the meaning ratified here.

---

## 1. Purpose

Establish the single source of truth for UCOS terminology, including the new Authority-Layer and
governance terms introduced in Phase 0.5A.

## 2. Scope

**In scope**
- Program & governance terms; architecture terms; Authority & approval-governance terms;
  provisional commerce terms.

**Out of scope**
- Per-context ubiquitous language detail (merged in by Prompt 03 under this canon's governance).

## 3. Ownership

| Role | Responsibility |
|------|----------------|
| Chief Authority Architect | Custodian of canonical terminology. |
| Domain Architect | Proposes per-context term additions via Prompt 03. |
| All authors | Use governed terms consistently. |

## 4. Dependencies

- **Upstream:** AUTH-001 (Vision), AUTH-003 (Principles).
- **Downstream:** AUTH-005 (Domain Canon), all artifacts that use governed terms.

## 5. Controlled Artifacts

- `.claude/context/UCOS-GLOSSARY.md` (`CTX-GLOSS-001`) — subordinate.

## 6. Governance Rules

### 6.1 Program & Governance Terms
| Term | Definition |
|------|------------|
| **UCOS** | Universal Commerce Operating System — the composable, governed commerce platform. |
| **Constitution** | Supreme governing law (AUTH-002); binding on all artifacts. |
| **Principle** | A binding architectural rule subordinate to the Constitution. |
| **Artifact** | Any governed, registered deliverable (doc, spec, contract, model, code module). |
| **Artifact ID** | Unique identifier assigned to every artifact for traceability. |
| **Artifact Registry** | Authoritative index of all artifacts and their lineage. |
| **Traceability** | Verifiable linkage from intent to realization. |
| **Gap** | A detected absence/inconsistency that blocks progress until resolved. |
| **Gate** | A mandatory governance checkpoint (quality, security, documentation, release, done). |
| **Certification** | Formal attestation that an increment meets completion criteria. |
| **Generator / Prompt** | A governed execution mechanism in `.claude/prompts/`. |
| **Skill** | A reusable architectural competency/standard in `.claude/skills/`. |
| **Project State** | The live record of phase, artifacts, gaps, and certification status. |

### 6.2 Architecture Terms
| Term | Definition |
|------|------------|
| **Capability** | A business ability the platform provides. |
| **Domain / Bounded Context** | A sphere of business knowledge with a consistent model and language. |
| **Context Map** | Documented relationships and integration patterns between contexts. |
| **Contract** | A versioned, explicit interface (API/event/data) at a boundary. |
| **Metadata Architecture** | The configuration-driven model expressing variability without code forks. |
| **Experience Surface** | A user-facing channel/application. |
| **Platform Service** | A cross-cutting capability (identity, config, observability, messaging). |

### 6.3 Authority & Approval-Governance Terms (new in Phase 0.5A)
| Term | Definition |
|------|------------|
| **Authority Layer** | The canonical source of truth (`AUTH-*`); supreme over all artifacts. |
| **Authority Document** | A governance instrument defining what is true/allowed/evolvable. |
| **Authority Board** | The body that approves Authority changes and approval-required operations. |
| **Canon** | An Authority document fixing the canonical rules for a concern. |
| **Authority Hierarchy** | The immutable tier order Authority → … → Certification. |
| **Conflict Resolution** | The rule that the higher-precedence artifact prevails; Authority wins. |
| **Approval By Exception** | Default to autonomy; require human approval only for enumerated operations. |
| **Trusted Operation** | An operation permitted to execute autonomously with full audit and traceability. |
| **Approval-Required Operation** | An operation that always requires human approval. |
| **Zone** | A governed scope in which an agent acts (document, architecture, governance, workspace, agent). |
| **Decision Record** | A traceable, versioned record of a governance/architecture decision (AUTH-012). |
| **Immutable Record** | An artifact that is never deleted and evolves only via versioned amendment. |
| **Non-Waivable Control** | A security control (S1/S3/S4) that no autonomy provision may weaken. |
| **Migration-Only Evolution** | The rule that state/schema/contract change occurs only via recorded, reversible migrations. |

### 6.4 Provisional Commerce Terms (refined by Prompt 03)
Catalog; Order; Cart; Fulfillment; Payment; Pricing; Inventory; Customer; Tenant — as defined in
`CTX-GLOSS-001`. These are provisional commerce terms governed by this canon and ratified into
finalized bounded-context terminology during domain modeling (Prompt 03); their inclusion here is
an approved future-extension point, not an incomplete definition.

## 7. Compliance Rules

- Use of a governed term with a meaning other than the one ratified here is a documentation gap.
- New governed terms MUST be added here before use in ratified artifacts.

## 8. Approval Rules

- Amending or removing a governed term is an **Approval-Required Operation**.
- Adding per-context terms via Prompt 03 (consistent with this canon) is a **Trusted Operation**.

## 9. Change Procedure

1. Propose via AUTH-012 decision record; check for term collisions.
2. Obtain Authority Board approval; record reference.
3. Increment version; preserve superseded definitions with supersession links.
4. Update AUTHORITY-INDEX; flag dependent artifacts for review.

## 10. Traceability Links

- **Refines:** AUTH-001, AUTH-003.
- **Refined by:** AUTH-005, all artifacts using governed terms.
- **Controls:** `CTX-GLOSS-001`.

## 11. Version Information

| Version | Date | Author | Change | Decision Ref |
|---------|------|--------|--------|--------------|
| 1.0.0 | 2026-06-29 | Chief Authority Architect | Ratified canonical glossary incl. Authority/approval-governance terms. | AUTH-012 / AD-0010 |
| 1.0.1 | 2026-06-29 | Chief Governance Auditor | Phase 0.5B correction: replaced placeholder language in §6.4 with ratified future-extension language. No terms changed. | AUTH-012 / AD-0011 |
