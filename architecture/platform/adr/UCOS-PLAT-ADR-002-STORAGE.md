# ADR-002 — Storage & Persistence Technology Selection

**Artifact ID:** UCOS-PLAT-ADR-002
**Short Name:** ADR-002 Storage
**Layer:** ARCHITECTURE (Platform Engineering — Technology Selection)
**Phase:** Phase 10.1 — Platform Technology Selection (Implementation Readiness Condition C-4)
**Status:** ACCEPTED (technology-selection scope)
**Version:** 1.0.0
**Date:** 2026-06-30
**Decision Owner:** Platform Engineering — Persistence Substrate Owner (`PEO-002`)
**Governing Domain:** `PE-02` Persistence & Storage Substrate (Execution Plane, PEG-A)
**Capability Anchor:** CAP-15 Platform Governance

> **Scope notice.** Technology selection authorized by `CTX-ARCHB-001` §5; deferred by `PEP-010` and by
> `UCOS-PDATA-ARCH-001` (persistence-neutral). This ADR selects the storage substrate that **realizes**
> the ratified, AUTHORITATIVE Physical Data Architecture; it does **not** author schemas, DDL, tables,
> columns, keys, or indexes (those derive from `PDE-001..073` / `PDP-001..017` during implementation),
> and it does **not** mutate any frozen artifact. Data ownership, classification, and lifecycle remain
> with the data domains (`PEO-002` note; PD audit lineage preserved).

---

## 1. Context

The Physical Data Architecture (`UCOS-PDATA-ARCH-001`, RATIFIED — CERTIFIED — AUTHORITATIVE) defines **17
Physical Data Domains** (`PD-01..17`), **73 Physical Data Entities** (`PDE-001..073`), **17 technology-
neutral Persistence Models** (`PDP-001..017`) across 9 persistence categories, and full `IC→CD→LD→LDO→PDE`
lineage — all without naming any datastore. `PE-02` (Persistence & Storage Substrate) governs the
realization of that persistence neutrally. A storage substrate must now be selected that:

- Realizes the persistence categories (relational/transactional, document/flexible-attribute,
  search/index, object/blob, cache/ephemeral, analytical) without redefining data semantics
  (`PEB-002`);
- Preserves ownership, classification, lifecycle, and audit lineage inherited from
  `UCOS-PDATA-ARCH-001` (`PEG-002`; PD-GOV inheritance);
- Provides **ACID** guarantees for commerce transactions (Order/Transaction/Financial domains) and
  strong consistency where the business requires it;
- Is **cloud-neutral / portable** (`PEP-010`; `CTX-ARCHB-001` §5);
- Honors non-waivable security controls **S1/S3/S4** (AUTH-008) at the storage layer.

## 2. Decision

**Adopt a governed polyglot-persistence substrate with PostgreSQL as the primary system-of-record,
plus open-standard specialized stores selected per persistence category.**

1. **Primary system of record (relational/transactional):** **PostgreSQL** (open source) — ACID,
   strong consistency, mature operational tooling, `JSONB` for governed flexible attributes, available
   as a managed service on every major cloud and on-premise (portability honored). Realizes the
   relational/transactional persistence categories of `PDP-*`.
2. **Object / large-artifact storage:** **S3-compatible object storage** (the S3 API as the neutral
   contract; any conformant implementation on any cloud or on-premise). For documents, media, exports,
   and evidence blobs (`PE-10` audit evidence).
3. **Search & catalog indexing:** **OpenSearch** (open source) for catalog/search read models —
   derived, never authoritative; the system of record remains PostgreSQL.
4. **Cache / ephemeral:** **Redis** (OSS-compatible API) for caching and ephemeral coordination
   (idempotency keys, short-lived state) — never a system of record.
5. **Analytical store:** the analytical persistence category (`PE-16`) is realized by a columnar/OLAP
   store fed by the event fabric (ADR-003) replay; the specific engine is a **governed sub-decision**
   recorded by a future ADR (`UCOS-PLAT-ADR-002A`) when analytics requirements are quantified — flagged
   here, not pre-empted.
6. **Persistence discipline:** one authoritative store per `PDE` (no dual systems of record);
   read models/projections are explicitly derived and disposable (`PEP-005` single source of truth).

## 3. Alternatives Considered

| # | Alternative | Why not selected |
|---|-------------|------------------|
| A | **Single proprietary cloud-managed database for everything** | Couples the platform to one vendor (violates `PEP-010`/§5); poor fit across heterogeneous persistence categories. |
| B | **Document-database-first (e.g., a single document store as SoR)** | Weaker multi-entity ACID and relational integrity for Order/Transaction/Financial; risks the data-integrity guarantees the Physical Data Architecture assumes. |
| C | **NewSQL / distributed SQL as primary** | Attractive horizontal scale and strong consistency, but heavier operational model and less ubiquitous managed availability than PostgreSQL; retained as a future scale-out option via migration ADR if ASRs demand. |
| D | **Polyglot with no primary SoR designation** | Rejected — ambiguous source of truth violates `PEP-005`; each `PDE` must map to exactly one authoritative store. |
| E | **Embedding search/cache responsibilities into the primary DB** | Simpler topology but conflates concerns and degrades under catalog-search and high-read workloads; specialized derived stores are preferred with PostgreSQL remaining authoritative. |

## 4. Consequences

**Positive**
- ACID system-of-record for commerce-critical domains; strong consistency where required.
- Cloud-portable across managed/self-managed PostgreSQL, S3-compatible storage, OpenSearch, and Redis.
- Clear authoritative-vs-derived separation upholds `PEP-005`; projections are rebuildable from the
  event fabric (ADR-003).
- Classification/lifecycle/audit lineage from `UCOS-PDATA-ARCH-001` is realizable without redefinition.

**Negative / Trade-offs**
- Multiple stores increase operational and backup/restore surface — bounded by IaC + delivery governance
  (ADR-007) and per-store retention policies (`PDL-*`).
- Cross-store consistency is eventual for derived read models — acceptable by design (event-driven,
  idempotent; `CTX-ARCHB-001` §3.3); transactional integrity stays inside the SoR.
- Analytical engine deferred — explicitly flagged as `UCOS-PLAT-ADR-002A`, not left implicit.

**Follow-on obligations**
- Encryption-at-rest, key management, and access control for these stores are selected in **ADR-006**;
  S1/S3/S4 preserved.
- Backup/restore, provisioning, and migration tooling governed by **ADR-007** (IaC) and `PE-13`
  (resilience/continuity).

## 5. Traceability

- **Realizes:** `UCOS-PDATA-ARCH-001` (`PD-01..17`, `PDE-001..073`, `PDP-001..017`, `PDS/PDQ/PDL/PDA`);
  `UCOS-PEA-001` `PE-02`, `PEG-002`, `PEO-002`, `PEB-002`.
- **Justified by ASR/principle:** `CTX-ARCHB-001` §5/§6; `PEP-002/005/010/013`; AUTH-007 (Data Canon).
- **Authority:** AUTH-007, AUTH-008 (S1/S3/S4), AUTH-009.
- **Consumed by (downstream):** ADR-003 (projections fed by events), ADR-005 (config/metadata SoR),
  ADR-004 (registry persistence), Prompt 10 (`WP-PLT-02`).
- **Chain:** `ADR-002 → PE-02 / PDP-* / PDE-* → CAP-15 → AUTH-007/008/009 → UCOS-PDATA-ARCH-001`.

## 6. Governance Impacts

- Satisfies **Phase 10.0 Condition C-4** for the storage concern.
- Governed by `PEG-002`; data semantics/classification decisions remain with the data domains (substrate
  ownership ≠ data ownership — `PEO-002`).
- Preserves PD-GOV inheritance and PD audit lineage; **no** redefinition of `PDE`/`PDP`/classification.
- Non-waivable **S1/S3/S4** preserved at the storage layer (encryption/access deferred to ADR-006).
- Additive only; no frozen-artifact mutation. Evolution migration-only (`PEP-016`); the deferred
  analytical engine is recorded as a future governed sub-ADR.

## 7. Approval Status

| Field | Value |
|-------|-------|
| Status | **ACCEPTED** (technology-selection scope); analytical-store sub-decision **DEFERRED** (`UCOS-PLAT-ADR-002A`) |
| Approval model | Approval-By-Exception (`PEP-020`); ratified within the technology-selection ADR set by `PE-17` |
| Terminal authority | Authority Board (`PEG-017`) |
| Gating note | Does not author schemas/DDL; realization occurs under the Article IX lock + `UCOS-IMP-READY-001` conditions |

## 8. Ownership

| Role | Assignment |
|------|------------|
| Decision Owner (Engineering) | Persistence Substrate Owner (`PEO-002`) |
| Steward | Physical Data Steward (data ownership remains with data domains) |
| Governing Model | `PEG-002` |
| Boundary | `PEB-002` |
| Authority Chain | Persistence Substrate Owner → `PE-17` → Authority Board |

## Traceability (artifact)
- **Refines:** `UCOS-PEA-001`, `UCOS-PDATA-ARCH-001`, `CTX-ARCHB-001` §5, AUTH-007/008/009, PROMPT-08.
- **Refined by:** `UCOS-PLAT-ADR-INDEX`; `UCOS-PLAT-ADR-002A` (future, analytical); ADR-006; Prompts 09–12.
