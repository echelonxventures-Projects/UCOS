# UCOS-UEA-0003 — Species-Agnostic Architecture (Ω∞)

> **STATUS: CREATED — READY FOR RATIFICATION**
> NOT RATIFIED · NOT CONSTITUTIONAL LAW · NOT IMPLEMENTATION AUTHORIZED
> DOES NOT MODIFY INV-1 THROUGH INV-13 · DOES NOT OVERRIDE AUTH-012 · DOES NOT RELEASE ARTICLE IX
> REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-UEA-0003` |
| Name | Species-Agnostic Architecture |
| Classification | **PROPOSAL — PENDING AUTHORITY BOARD REVIEW** |
| Workstream | WS4 (Agnostic Architectures) |
| Proposes reliance on | **INV-15** (No Species Assumption — proposed) |
| Subordinate to | `UCOS-UEA-0001` (L1/L7/L12), `UCOS-UEA-0002` (O-03/O-04/O-09/O-12), `UCOS-SEC-ARCH-001`, INV-1..13 |

---

## 1. Principles
- **SP-A1.** Every participant is an abstract **Actor** (O-03); "human" is one Species classification, never a
  built-in assumption.
- **SP-A2.** Identity, authentication, authorization, and communication are defined over Actor + Species
  *profiles*, resolved from metadata — not hard-coded to biology or language.
- **SP-A3.** Rights and obligations attach to Species profiles via governed policy, not to implementation.
- **SP-A4.** New species onboard by **registration + metadata + composition** (INV-13), never by redesign.

## 2. Supported Species Classes (open set)
Biological · Synthetic · Machine civilizations · Hybrid civilizations · Collective intelligences ·
Distributed intelligences · Digital species · Emergent species · **Unknown future species** (reserved via
proposed INV-20). Each class is a metadata profile, not a subtype requiring code.

Per class, the profile defines (conceptually): **Identity · Governance · Communication · Trust · Rights Model
· Federation · Evolution** — as attributes over the ontology, not schemas.

## 3. Assumptions Removed
| Removed assumption | Replaced by |
|--------------------|-------------|
| Participant is human | Abstract Actor + Species profile (O-03/O-09) |
| Natural-language / human UX is primary | Communication contract per Species profile (channel-agnostic) |
| Single cognition model | Intelligence attribute O-12 (human/AI/machine/collective/hybrid/emergent/unknown) |
| Human-centric rights model | Governed, per-profile rights policy (deny-by-default, INV-3) |
| Consent/identity tied to biology | Verifiable Identity (O-02) decoupled from substrate |

## 4. Governance Impact
- Species profiles are metadata-governed (AUTH-011 glossary + `UCOS-INF-ARCH-001`); single owner per profile.
- Rights models are **policy**, subordinate to AUTH-009; Authority Board remains terminal within an instance.
- Autonomous non-human agents fall under Approval-By-Exception + zone governance (AUTH-009) unchanged.

## 5. Federation Impact
- Cross-species interaction is federation (INV-1): contract-first, no shared mutable model.
- Trust is established per federated link; species heterogeneity does not require a global identity registry.

## 6. Security Impact
- Non-waivable **S1/S3/S4 (INV-2)** apply regardless of species; deny-by-default (INV-3) is species-blind.
- Threat modeling must add **species-spoofing / profile-forgery** as a class (extends `UCOS-SEC-THREAT-001`
  STRIDE-Spoofing) — flagged as a forward obligation, not designed here.

## 7. Risks
| Risk | Note |
|------|------|
| RS-1 | Over-broad rights profiles could weaken least-privilege — mitigated by deny-by-default policy. |
| RS-2 | Non-human agent accountability — must map to a single accountable owner (single-owner principle). |
| RS-3 | Communication-contract ambiguity across species — requires strict contract-first negotiation. |

## 8. Open Questions
- Q1: Minimum verifiable-identity floor for a Species profile to transact?
- Q2: Rights-model conflict resolution across federated civilizations of different species.

## Traceability
- **Subordinate to:** `UCOS-UEA-0001/0002`, `UCOS-SEC-ARCH-001`, INV-1..13; **proposes** INV-15.
- **Owner:** UCOS Authority Board (disposition).

**END UCOS-UEA-0003 — SPECIES-AGNOSTIC ARCHITECTURE · CONCEPTUAL · PROPOSAL · PENDING AUTHORITY BOARD REVIEW.**
