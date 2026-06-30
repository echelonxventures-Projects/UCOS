# ADR-004 — Registry & Discovery Technology Selection

**Artifact ID:** UCOS-PLAT-ADR-004
**Short Name:** ADR-004 Registry
**Layer:** ARCHITECTURE (Platform Engineering — Technology Selection)
**Phase:** Phase 10.1 — Platform Technology Selection (Implementation Readiness Condition C-4)
**Status:** ACCEPTED (technology-selection scope)
**Version:** 1.0.0
**Date:** 2026-06-30
**Decision Owner:** Platform Engineering — Registry & Discovery Owner (`PEO-006`)
**Governing Domain:** `PE-06` Registry & Discovery (Integration Plane, PEG-B)
**Capability Anchor:** CAP-19 Registry & Discovery

> **Scope notice.** Technology selection authorized by `CTX-ARCHB-001` §5; deferred by `PEP-010` and by
> `UCOS-PEA-004` (Registry Architecture, RATIFIED). This ADR selects the registry/discovery substrate
> that **realizes** the Registry Architecture; it does **not** mutate any frozen artifact and introduces
> no competing source of truth (`PEP-005`).

---

## 1. Context

The Registry Architecture (`UCOS-PEA-004`, v0.6.0, RATIFIED in Phase 9.2) defines **17 Platform Registry
Domains** (`PRG-001..017`), **73 Platform Registry Entries** (`PRE-001..073`), the Registry Authority
Model (`PRA-001`), the Registry Lifecycle (`PRL-001`), and `TM-PEA-011/012/013` — technology-neutrally.
`PE-06` governs realization under **Registry First** (`PEP-001`) and **Single Source Of Truth**
(`PEP-005`). The substrate must:

- Be the **authoritative registration** point for platform elements, services, event topics/contracts,
  and metadata references (`PEB-006`);
- Provide **runtime service discovery** for the 73 `PRS-*` running on the ADR-001 substrate;
- Provide a governed **schema/contract registry** consistent with ADR-003 (events) and Prompt 07 (APIs);
- Enforce uniqueness, bidirectional lineage, and no competing/duplicate registries (`PEP-001/005/006`);
- Be **cloud-neutral / portable** (`PEP-010`).

## 2. Decision

**Adopt a layered, standards-based registry/discovery substrate: Kubernetes-native service discovery +
an open Schema/Contract Registry + an authoritative Platform Registry service persisted in PostgreSQL.**

1. **Runtime service discovery:** **Kubernetes-native DNS + Service objects** (consistent with ADR-001)
   for in-cluster discovery; no separate discovery product is mandated. Cross-cluster discovery uses the
   same Kubernetes API contract.
2. **Schema / contract registry:** the **Confluent-Schema-Registry-API-compatible** registry selected in
   ADR-003 is the authoritative store for **event** schemas; **OpenAPI/AsyncAPI** documents are the
   contract format for **API** contracts (authored by Prompt 07) and are registered alongside.
3. **Authoritative Platform Registry service:** the registry runtime services (`PRS-*` realizing
   `PRG-001..017` / `PRE-001..073`) persist the authoritative platform registry in **PostgreSQL**
   (ADR-002) — the single source of truth for platform-element registration, ownership, and lineage
   (`PEP-001/005`). Discovery and schema layers reference, but never duplicate, this authority.
4. **Uniqueness & lineage:** every registered element carries a unique ID and bidirectional lineage
   (`PEP-006`); registration occurs in the same change that creates the element (`PEP-001`).
5. **No competing registries:** exactly one authoritative registry per registry domain (`PEB-006`
   prohibited interaction: competing registries / unregistered elements).

## 3. Alternatives Considered

| # | Alternative | Why not selected |
|---|-------------|------------------|
| A | **Consul (service mesh + KV + discovery) as the single registry** | Capable all-in-one, but overlaps the mesh decision (ADR-006) and the config decision (ADR-005), risking duplicated sources of truth (`PEP-005`); discovery is already provided natively by ADR-001. |
| B | **etcd as the authoritative registry** | Strong for coordination/leader-election, but a low-level KV store is a poor fit for governed, queryable, lineage-rich platform registration; better suited to control-plane internals. |
| C | **Cloud-managed service registry / API catalog** | Vendor-specific, violating `PEP-010`/§5; weaker cross-cloud portability. |
| D | **A single bespoke registry for discovery + schemas + platform elements** | Rejected — conflates distinct lifecycles (runtime discovery vs schema evolution vs governance registration); layering keeps each authoritative within its concern while PostgreSQL holds platform-element truth. |
| E | **No schema registry (contracts in code/repos only)** | Breaks ADR-003 contract governance and `PEP-015`; a runtime-enforceable registry is required. |

## 4. Consequences

**Positive**
- Authoritative, queryable platform registry (PostgreSQL) upholds `PEP-001/005/006` with full lineage.
- Native discovery reuses the ADR-001 substrate — no extra product, lower operational surface.
- Schema/contract registry is shared with ADR-003 and Prompt 07, ensuring one contract authority.
- Clear layering prevents competing sources of truth.

**Negative / Trade-offs**
- Three layers (discovery / schema / platform registry) require clear ownership boundaries — provided by
  `PEB-006` and this ADR's authority designation.
- Platform Registry availability is critical-path — mitigated by `PE-13` resilience posture and the
  ADR-002 PostgreSQL HA model.

**Follow-on obligations**
- Access control and authn to the registry/discovery layers are selected in **ADR-006**.
- Registration is enforced by Delivery gates (**ADR-007**): no promotion of unregistered elements
  (`PEP-001`).

## 5. Traceability

- **Realizes:** `UCOS-PEA-004` (`PRG-001..017`, `PRE-001..073`, `PRA-001`, `PRL-001`,
  `TM-PEA-011/012/013`); `UCOS-PEA-001` `PE-06`, `PEG-006`, `PEO-006`, `PEB-006`.
- **Justified by ASR/principle:** `PEP-001/005/006/010`; AUTH-009/010; `CTX-REG-001`.
- **Authority:** AUTH-009 (Governance Canon), AUTH-010 (Traceability Canon).
- **Consumed by (downstream):** ADR-003 (topic/contract registration), ADR-005 (metadata references),
  ADR-006 (registry access control), Prompt 07 (API contracts), Prompt 10 (`WP-PLT-06`).
- **Chain:** `ADR-004 → PE-06 / PRG-* / PRE-* → CAP-19 → AUTH-009/010 → UCOS-PEA-004`.

## 6. Governance Impacts

- Satisfies **Phase 10.0 Condition C-4** for the registry/discovery concern.
- Governed by `PEG-006`; registration/discovery governance held by the Registry & Discovery Owner;
  escalation `PEO-006 → PE-17 → Authority Board`.
- Enforces **Registry First** (`PEP-001`) and **Single Source Of Truth** (`PEP-005`); 0 competing
  registries permitted.
- Additive only; no frozen-artifact mutation; migration-only evolution (`PEP-016`).

## 7. Approval Status

| Field | Value |
|-------|-------|
| Status | **ACCEPTED** (technology-selection scope) |
| Approval model | Approval-By-Exception (`PEP-020`); ratified within the technology-selection ADR set by `PE-17` |
| Terminal authority | Authority Board (`PEG-017`) |
| Gating note | Realization gated by `UCOS-IMP-READY-001` (C-4..C-6) and the Article IX lock |

## 8. Ownership

| Role | Assignment |
|------|------------|
| Decision Owner (Engineering) | Registry & Discovery Owner (`PEO-006`) |
| Steward | Registry & Discovery Steward (CAP-19) |
| Governing Model | `PEG-006` |
| Boundary | `PEB-006` |
| Authority Chain | Registry & Discovery Owner → `PE-17` → Authority Board |

## Traceability (artifact)
- **Refines:** `UCOS-PEA-001`, `UCOS-PEA-004`, `CTX-ARCHB-001` §5, AUTH-009/010, `CTX-REG-001`, PROMPT-08.
- **Refined by:** `UCOS-PLAT-ADR-INDEX`; ADR-003, ADR-005, ADR-006; Prompts 09–12.
