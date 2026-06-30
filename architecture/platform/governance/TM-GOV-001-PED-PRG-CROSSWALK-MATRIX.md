# TM-GOV-001 — PED → PRG Architecture Crosswalk Matrix

**Artifact ID:** TM-GOV-001
**Layer:** GOVERNANCE (Cross-Architecture Traceability)
**Phase:** Phase 9.0C.GOV — Cross-Architecture Governance Audit (scoped: Event ↔ Registry)
**Date:** 2026-06-30
**Owner:** Platform Governance & Control Plane (audit authority; Authority Board terminal)
**Parent audit:** `GOV-AUD-001`
**Sources audited (read-only):** `UCOS-PEA-003` (Event Architecture), `UCOS-PEA-004` (Registry Architecture)

> **Purpose.** Validate the **domain-level** crosswalk between the Platform Event Domains (`PED-001..017`,
> `UCOS-PEA-003`) and the Platform Registry Domains (`PRG-001..017`, `UCOS-PEA-004`). Both construct
> families are derived **1:1** from the same Phase 9.0B Runtime Domains (`PRD-001..017`) and **inherit
> unchanged** the same owning Platform Domain (`PE-nn`), capability anchor (CAP), governance model (`PEG`),
> ownership model (`PEO`), and boundary model (`PEB`). This matrix confirms that the two parallel
> derivations are **mutually consistent** (no divergence in ownership, governance, boundary, or capability
> anchor for any shared runtime domain).
>
> **Method.** For each Runtime Domain `PRD-nn`, the `PED-nn` row (from `TM-PEA-006A` + Preamble P.2 of
> `UCOS-PEA-003`) is compared field-by-field against the `PRG-nn` row (from `TM-PEA-012` + Preamble P.2 of
> `UCOS-PEA-004`). A crosswalk is **consistent** when `PE`, CAP, `PEG`, `PEO`, and `PEB` are identical on
> both sides for the same `PRD`.

## TM-GOV-001.A — PED ↔ PRG crosswalk (17/17, 1:1 via shared `PRD`)

| Runtime Domain (`PRD`) | Platform Domain (`PE`) | Event Domain (`PED`) | Registry Domain (`PRG`) | Capability anchor | `PEG` | `PEO` | `PEB` | Consistent |
|------------------------|------------------------|----------------------|-------------------------|-------------------|-------|-------|-------|:----------:|
| `PRD-001` Runtime & Compute | `PE-01` | `PED-001` | `PRG-001` | CAP-15 | `PEG-001` | `PEO-001` | `PEB-001` | ✅ |
| `PRD-002` Persistence & Storage Substrate | `PE-02` | `PED-002` | `PRG-002` | CAP-15 | `PEG-002` | `PEO-002` | `PEB-002` | ✅ |
| `PRD-003` Networking & Connectivity | `PE-03` | `PED-003` | `PRG-003` | CAP-15/CAP-17 | `PEG-003` | `PEO-003` | `PEB-003` | ✅ |
| `PRD-004` Messaging & Eventing | `PE-04` | `PED-004` | `PRG-004` | CAP-12 | `PEG-004` | `PEO-004` | `PEB-004` | ✅ |
| `PRD-005` Integration & API Gateway | `PE-05` | `PED-005` | `PRG-005` | CAP-12 | `PEG-005` | `PEO-005` | `PEB-005` | ✅ |
| `PRD-006` Registry & Discovery | `PE-06` | `PED-006` | `PRG-006` | CAP-19 | `PEG-006` | `PEO-006` | `PEB-006` | ✅ |
| `PRD-007` Workflow & Orchestration | `PE-07` | `PED-007` | `PRG-007` | CAP-18 | `PEG-007` | `PEO-007` | `PEB-007` | ✅ |
| `PRD-008` Identity, Access & Tenancy | `PE-08` | `PED-008` | `PRG-008` | CAP-09/CAP-17 | `PEG-008` | `PEO-008` | `PEB-008` | ✅ |
| `PRD-009` Secrets & Key Management | `PE-09` | `PED-009` | `PRG-009` | CAP-17 | `PEG-009` | `PEO-009` | `PEB-009` | ✅ |
| `PRD-010` Audit & Evidence | `PE-10` | `PED-010` | `PRG-010` | CAP-16 | `PEG-010` | `PEO-010` | `PEB-010` | ✅ |
| `PRD-011` Configuration & Metadata Delivery | `PE-11` | `PED-011` | `PRG-011` | CAP-10 | `PEG-011` | `PEO-011` | `PEB-011` | ✅ |
| `PRD-012` Observability & Telemetry | `PE-12` | `PED-012` | `PRG-012` | CAP-11 | `PEG-012` | `PEO-012` | `PEB-012` | ✅ |
| `PRD-013` Resilience & Continuity | `PE-13` | `PED-013` | `PRG-013` | CAP-15 | `PEG-013` | `PEO-013` | `PEB-013` | ✅ |
| `PRD-014` Delivery & CI/CD | `PE-14` | `PED-014` | `PRG-014` | CAP-15 | `PEG-014` | `PEO-014` | `PEB-014` | ✅ |
| `PRD-015` Infrastructure & Provisioning | `PE-15` | `PED-015` | `PRG-015` | CAP-15 | `PEG-015` | `PEO-015` | `PEB-015` | ✅ |
| `PRD-016` Intelligence & Analytics | `PE-16` | `PED-016` | `PRG-016` | CAP-13 | `PEG-016` | `PEO-016` | `PEB-016` | ✅ |
| `PRD-017` Platform Governance & Control Plane | `PE-17` | `PED-017` | `PRG-017` | CAP-15 | `PEG-017` | `PEO-017` | `PEB-017` | ✅ |

> **Result (A):** 17/17 `PED ↔ PRG` crosswalks consistent. For every shared `PRD-nn`, the owning Platform
> Domain, capability anchor, `PEG`, `PEO`, and `PEB` are **identical** across `UCOS-PEA-003` and
> `UCOS-PEA-004`. **0** divergences; **0** ownership/governance/boundary/capability mismatches; **0** orphan
> event domains; **0** orphan registry domains.

## TM-GOV-001.B — Service-grouping consistency (each `PED-nn` and `PRG-nn` govern the same `PRS` set)

| Runtime Domain | Event Domain `PED` supported services | Registry Domain `PRG` governed services | Count | Aligned |
|----------------|----------------------------------------|------------------------------------------|------:|:-------:|
| `PRD-001` | `PRS-001..004` | `PRS-001..004` | 4 | ✅ |
| `PRD-002` | `PRS-005..008` | `PRS-005..008` | 4 | ✅ |
| `PRD-003` | `PRS-009..012` | `PRS-009..012` | 4 | ✅ |
| `PRD-004` | `PRS-013..017` | `PRS-013..017` | 5 | ✅ |
| `PRD-005` | `PRS-018..021` | `PRS-018..021` | 4 | ✅ |
| `PRD-006` | `PRS-022..025` | `PRS-022..025` | 4 | ✅ |
| `PRD-007` | `PRS-026..030` | `PRS-026..030` | 5 | ✅ |
| `PRD-008` | `PRS-031..034` | `PRS-031..034` | 4 | ✅ |
| `PRD-009` | `PRS-035..038` | `PRS-035..038` | 4 | ✅ |
| `PRD-010` | `PRS-039..042` | `PRS-039..042` | 4 | ✅ |
| `PRD-011` | `PRS-043..046` | `PRS-043..046` | 4 | ✅ |
| `PRD-012` | `PRS-047..051` | `PRS-047..051` | 5 | ✅ |
| `PRD-013` | `PRS-052..056` | `PRS-052..056` | 5 | ✅ |
| `PRD-014` | `PRS-057..060` | `PRS-057..060` | 4 | ✅ |
| `PRD-015` | `PRS-061..064` | `PRS-061..064` | 4 | ✅ |
| `PRD-016` | `PRS-065..068` | `PRS-065..068` | 4 | ✅ |
| `PRD-017` | `PRS-069..073` | `PRS-069..073` | 5 | ✅ |

> **Result (B):** Service grouping is **identical** on both sides for all 17 domains. Counts sum to
> 4×12 + 5×5 = 48 + 25 = **73**. The event and registry derivations partition the 73 runtime services into
> the **same 17 domain buckets** — confirming that an event and its corresponding registry entity for any
> given service are always co-located in the same owning runtime domain (no cross-domain ownership drift).

## Verdict

**TM-GOV-001 — PED → PRG Crosswalk: PASS.** 17/17 domain crosswalks consistent; identical
`PE`/CAP/`PEG`/`PEO`/`PEB` inheritance; identical service grouping; 0 divergences; 0 orphans.
