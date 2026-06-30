# TM-GOV-002 — PEV → PRE Architecture Crosswalk Matrix

**Artifact ID:** TM-GOV-002
**Layer:** GOVERNANCE (Cross-Architecture Traceability)
**Phase:** Phase 9.0C.GOV — Cross-Architecture Governance Audit (scoped: Event ↔ Registry)
**Date:** 2026-06-30
**Owner:** Platform Governance & Control Plane (audit authority; Authority Board terminal)
**Parent audit:** `GOV-AUD-001`
**Sources audited (read-only):** `UCOS-PEA-003` (`PEV-001..073`), `UCOS-PEA-004` (`PRE-001..073`)

> **Purpose.** Validate the **entity-level** crosswalk between the Platform Events (`PEV-001..073`,
> `UCOS-PEA-003`) and the Platform Registry Entities (`PRE-001..073`, `UCOS-PEA-004`). Each `PEV-k` is
> produced **1:1** by Runtime Service `PRS-k` (`TM-PEA-006`); each `PRE-k` represents **1:1** the same
> Runtime Service `PRS-k` (`TM-PEA-011`). The crosswalk `PEV-k ↔ PRE-k` therefore holds **through the
> shared `PRS-k` anchor**, and the owning event domain (`PED`) of `PEV-k` must correspond to the owning
> registry domain (`PRG`) of `PRE-k` for the same runtime domain.
>
> **Method.** Validated at domain-band granularity (the level at which both architectures declare per-band
> ownership). For each runtime domain band, the contiguous `PRS` range, the corresponding `PEV` range
> (owning `PED`), and the corresponding `PRE` range (owning `PRG`) are confirmed identical and co-located.

## TM-GOV-002.A — PEV ↔ PRE crosswalk by domain band (73/73 via shared `PRS`)

| `PRS` range | Owning `PRD` | `PEV` range → owning `PED` | `PRE` range → owning `PRG` | Count | Same runtime owner | Consistent |
|-------------|--------------|-----------------------------|-----------------------------|------:|:------------------:|:----------:|
| `PRS-001..004` | `PRD-001` | `PEV-001..004` → `PED-001` | `PRE-001..004` → `PRG-001` | 4 | ✅ | ✅ |
| `PRS-005..008` | `PRD-002` | `PEV-005..008` → `PED-002` | `PRE-005..008` → `PRG-002` | 4 | ✅ | ✅ |
| `PRS-009..012` | `PRD-003` | `PEV-009..012` → `PED-003` | `PRE-009..012` → `PRG-003` | 4 | ✅ | ✅ |
| `PRS-013..017` | `PRD-004` | `PEV-013..017` → `PED-004` | `PRE-013..017` → `PRG-004` | 5 | ✅ | ✅ |
| `PRS-018..021` | `PRD-005` | `PEV-018..021` → `PED-005` | `PRE-018..021` → `PRG-005` | 4 | ✅ | ✅ |
| `PRS-022..025` | `PRD-006` | `PEV-022..025` → `PED-006` | `PRE-022..025` → `PRG-006` | 4 | ✅ | ✅ |
| `PRS-026..030` | `PRD-007` | `PEV-026..030` → `PED-007` | `PRE-026..030` → `PRG-007` | 5 | ✅ | ✅ |
| `PRS-031..034` | `PRD-008` | `PEV-031..034` → `PED-008` | `PRE-031..034` → `PRG-008` | 4 | ✅ | ✅ |
| `PRS-035..038` | `PRD-009` | `PEV-035..038` → `PED-009` | `PRE-035..038` → `PRG-009` | 4 | ✅ | ✅ |
| `PRS-039..042` | `PRD-010` | `PEV-039..042` → `PED-010` | `PRE-039..042` → `PRG-010` | 4 | ✅ | ✅ |
| `PRS-043..046` | `PRD-011` | `PEV-043..046` → `PED-011` | `PRE-043..046` → `PRG-011` | 4 | ✅ | ✅ |
| `PRS-047..051` | `PRD-012` | `PEV-047..051` → `PED-012` | `PRE-047..051` → `PRG-012` | 5 | ✅ | ✅ |
| `PRS-052..056` | `PRD-013` | `PEV-052..056` → `PED-013` | `PRE-052..056` → `PRG-013` | 5 | ✅ | ✅ |
| `PRS-057..060` | `PRD-014` | `PEV-057..060` → `PED-014` | `PRE-057..060` → `PRG-014` | 4 | ✅ | ✅ |
| `PRS-061..064` | `PRD-015` | `PEV-061..064` → `PED-015` | `PRE-061..064` → `PRG-015` | 4 | ✅ | ✅ |
| `PRS-065..068` | `PRD-016` | `PEV-065..068` → `PED-016` | `PRE-065..068` → `PRG-016` | 4 | ✅ | ✅ |
| `PRS-069..073` | `PRD-017` | `PEV-069..073` → `PED-017` | `PRE-069..073` → `PRG-017` | 5 | ✅ | ✅ |

> **Result (A):** 73/73 `PEV ↔ PRE` crosswalks consistent through the shared `PRS` anchor. For every
> runtime service `PRS-k`, its produced event `PEV-k` and its registry entity `PRE-k` are owned by the
> **same runtime domain** (event side: `PED-nn`; registry side: `PRG-nn`; both ← `PRD-nn`). **0** entity
> mapped to more than one service on either side; **0** orphan events; **0** orphan registry entities; **0**
> cross-domain ownership drift.

## TM-GOV-002.B — Cardinality & identifier integrity

| Property | Event side (`PEV`) | Registry side (`PRE`) | Aligned |
|----------|--------------------|-----------------------|:-------:|
| Identifier range | `PEV-001..073` | `PRE-001..073` | ✅ |
| Count | 73 | 73 | ✅ |
| Contiguity (0 gaps) | ✅ | ✅ | ✅ |
| Duplicates / reuse | 0 | 0 | ✅ |
| Mapping to `PRS` | 1:1 (`TM-PEA-006`) | 1:1 (`TM-PEA-011`) | ✅ |
| Owning domain per item | exactly one `PED` | exactly one `PRG` | ✅ |
| Classified into 1 of 10 | ✅ (event vocabulary) | ✅ (registry vocabulary) | ✅ (see note) |

> **Classification note (not a conflict).** The two architectures use **distinct, purpose-specific**
> ten-class classification vocabularies: `UCOS-PEA-003` classifies *signals* (Domain, Capability, Execution,
> Workflow, Governance, Audit, Configuration, Registry, Metadata, Control); `UCOS-PEA-004` classifies
> *registrable record-types* (Service, Capability, Workflow, Governance, Configuration, Metadata, Identity,
> Control, Operational, Composite). These vocabularies classify **different construct kinds** (an emitted
> event vs. a registered element) and are **not required to be identical**. Each is independently
> exhaustive and disjoint over its own 73 items. This is an intentional, well-formed divergence — **not** a
> traceability or governance conflict.

## Verdict

**TM-GOV-002 — PEV → PRE Crosswalk: PASS.** 73/73 entity crosswalks consistent through the shared `PRS`
anchor; identical cardinality and identifier integrity; co-located runtime ownership on both sides; 0
orphans; 0 drift.
