# AUTH-010 — Traceability Canon

**Authority ID:** AUTH-010
**Layer:** AUTHORITY
**Status:** RATIFIED (canonical traceability rules)
**Version:** 1.0.0
**Supersedes:** `CTX-TRACE-001` (traceability model) as the canonical traceability authority.
**Immutability:** Immutable record. Evolves only via version increment + decision record (AUTH-012) + approval.

> This canon defines how lineage is established, recorded, and verified across UCOS. Every future
> artifact MUST be traceable back to Authority. Traceability precedes acceptance (IP-08).

---

## 1. Purpose

Establish the canonical traceability model: the lineage chain, the identifier scheme, the lineage
types, and the rules and verification that guarantee no orphan or dangling artifact exists anywhere
in the program.

## 2. Scope

**In scope**
- The canonical traceability chain and the Authority-rooted lineage extension.
- The artifact identifier scheme and required lineage metadata.
- The distinct lineage types and their verification rules.

**Out of scope**
- The registry implementation itself (`CTX-REG-001`); gap remediation (gap-detection skill).

## 3. Ownership

| Role | Responsibility |
|------|----------------|
| Chief Authority Architect | Custodian of the traceability canon. |
| Traceability function (SKILL-012) | Verifies lineage integrity. |
| Gap-detection function (SKILL-013) | Detects orphans/dangling links. |
| All artifact owners | Declare upstream/downstream links on creation. |

## 4. Dependencies

- **Upstream:** AUTH-002 (Art. II), AUTH-003 (P5, IP-08).
- **Downstream:** `CTX-REG-001`, all artifacts, certification (Prompt 12).

## 5. Controlled Artifacts

- `.claude/context/UCOS-TRACEABILITY-MODEL.md` (`CTX-TRACE-001`) — subordinate.
- `.claude/context/UCOS-ARTIFACT-REGISTRY.md` (`CTX-REG-001`) — the recording instrument.

## 6. Governance Rules

### 6.1 Canonical Lineage Chain (Authority-rooted)

```
Authority (AUTH-*)
  └─> Vision
        └─> Principle / Constitution
              └─> Capability
                    └─> Domain (Bounded Context)
                          └─> Specification
                                └─> Contract (API / event / data)
                                      └─> Service / Component
                                            └─> Implementation
                                                  └─> Test / Acceptance
                                                        └─> Certification
```

Every artifact occupies a node and MUST declare upstream (parent) and downstream (children) links.
The chain is now rooted at the Authority Layer: every artifact is ultimately traceable to `AUTH-*`.

### 6.2 Identifier Scheme

`UCOS-<LAYER>-<TYPE>-<NNN>` (e.g., `UCOS-DOM-MODEL-001`). Authority artifacts use `AUTH-NNN`.
Layers include: AUTH, CTX, ENT, DOM, DATA, META, EXP, SVC, API, PLAT, SEC, QA, REL.

### 6.3 Required Lineage Metadata
Artifact ID; Status; Owner; Upstream links (refines); Downstream links (refined-by); Gate status
(where applicable); Version.

### 6.4 Lineage Types (all mandatory and verifiable)
- **Artifact lineage** — every artifact links to its parent and children.
- **Requirement lineage** — requirements trace to capabilities and to verifying tests.
- **Architecture lineage** — architecture artifacts trace to principles and the architecture canon.
- **Domain lineage** — domains trace to realized capabilities.
- **Capability lineage** — capabilities trace to Vision goals (G1–G6).
- **Decision lineage** — every decision (AUTH-012 / ADR) traces to what it governs.
- **Validation lineage** — every acceptance criterion traces to a verifying result.
- **Certification lineage** — certifications confirm the complete chain for their scope.

### 6.5 Traceability Rules
1. **No orphans:** every artifact except `AUTH-001` has ≥1 upstream link.
2. **No dangling realization:** every contract/service traces to a capability + domain.
3. **Bidirectional integrity:** if A refines B, B lists A as refined-by.
4. **Registry authority:** the Artifact Registry is the single source of truth for links.
5. **Change propagation:** modifying an upstream artifact flags all downstream for review.

## 7. Compliance Rules

- An orphan or dangling artifact is a blocking traceability gap.
- A broken bidirectional link is a blocking gap.
- Certification (Prompt 12) MUST confirm full lineage for the certified scope; missing lineage
  prohibits certification.

## 8. Approval Rules

- Amending the lineage chain, identifier scheme, or traceability rules is an
  **Approval-Required Operation**.
- Recording links and running traceability/gap scans are **Trusted Operations**.

## 9. Change Procedure

1. Propose via AUTH-012 decision record; assess registry-schema and downstream impact.
2. Obtain Authority Board approval; record reference.
3. Increment version; preserve superseded rules with supersession links.
4. Update AUTHORITY-INDEX; flag dependent artifacts for review.

## 10. Traceability Links

- **Refines:** AUTH-002 (Art. II), AUTH-003 (P5/IP-08).
- **Refined by:** `CTX-TRACE-001`, `CTX-REG-001`, all artifacts.
- **Controls:** `CTX-TRACE-001`.

## 11. Version Information

| Version | Date | Author | Change | Decision Ref |
|---------|------|--------|--------|--------------|
| 1.0.0 | 2026-06-29 | Chief Authority Architect | Ratified Authority-rooted lineage chain and traceability rules. | AUTH-012 / AD-0001 |
