# UCOS-REQ-0004 — Universal Reality, Entity, Identity, Resource, Capability, Temporal & Civilization Requirements Specification

**Artifact ID:** `UCOS-REQ-0004`
**Phase:** Phase 0 — Master Requirements Baseline (Constitutional Discovery Edition)
**Mode:** REQUIREMENTS DISCOVERY / SPECIFICATION ONLY — no code, schema, ontology design, data model, or architecture is produced. Where universal constructs are named, they are **restated from ratified/proposed artifacts of record**, not designed here.
**Status:** RATIFIED BASELINE (v1.0.0)
**Subordinate to:** `UCOS-REQ-0001`, `UCOS-REQ-0002`, the Authority Layer (`AUTH-001..012`), and the Constitution (`UCOS-CONST-001`).
**Date:** 2026-07-03

---

## 1. Purpose & structure

This specification states the **universal requirements** (`UR-*`) that UCOS must satisfy to represent, govern,
audit, federate, execute, evolve, and discover any reality, entity, identity, resource, capability, temporal
model, and civilization. Each requirement carries a classification (EXISTING / IMPLICIT / PROPOSED / MISSING)
and evidence, consistent with `UCOS-REQ-0001` (RC-021..034, RC-051..058) and `UCOS-REQ-0002`.

The universal constructs referenced are the ratified nine primitives (Registry · Metadata · Configuration ·
Knowledge · Ontology · Memory · Authority · Federation · Evolution) and the Universal Ontology `O-01..O-16`
(`UCOS-UEA-0002`, PROPOSED), grounded by the implemented substrate (`packages/platform-runtime/src/**`,
269/269 tests) and the scale-invariance verification `UNIV-ENTITY-001`.

---

## 2. Universal Reality Requirements (UR-REAL-*)

| ID | Requirement | Class. | Evidence |
|----|-------------|:------:|----------|
| UR-REAL-01 | Reality shall be an orthogonal **context** attached to entities (`O-14`: physical/virtual/simulated/hybrid/nested/unknown), never a hard-coded assumption. | PROPOSED | `UCOS-UEA-0002 O-14`; `UCOS-UEA-0006`; INV-17 (proposed) |
| UR-REAL-02 | Entities across ~40 orders of magnitude (subatomic→cosmological) shall be representable within a reality using one unchanged substrate. | EXISTING *(demonstrated)* | `UNIV-ENTITY-001` (SCALE-INVARIANT) |
| UR-REAL-03 | The platform shall not assume a single physical reality; persistence/identity/interop defined over an abstract Reality contract. | PROPOSED / **NOT ESTABLISHED** | INV-17 (proposed); conflicts with INV-5 single-SoR (`UA-10-CERT-001`); deferred `AD-0014` |
| UR-REAL-04 | Simulated/alternate/nested realities shall be sandboxed, non-actuating, advisory (forecasts never facts). | PROPOSED | `SIM-*`; `SIM-PLAN-001..003`; `AD-0022` (conditional) |
| UR-REAL-05 | Cosmological locality (planet→cosmic web→unknown) shall be an open, extensible, partition-tolerant hierarchy; loss of ancestor contact is a normal operating condition. | PROPOSED | `UCOS-UEA-0007`; INV-19 (proposed) |

---

## 3. Universal Entity Requirements (UR-ENT-*) — "Everything is an Entity"

| ID | Requirement | Class. | Evidence |
|----|-------------|:------:|----------|
| UR-ENT-01 | Everything distinguishable shall be an **Entity** (`O-01`), the ontology root. | EXISTING | `UCOS-UEA-0002 O-01`; PI-8 `control/ontology/entity-model.ts` |
| UR-ENT-02 | Entities shall be expressible via exactly four construct kinds — **entity / relationship / taxonomy / constraint** — plus recursive composition, with **zero scale-specific fields**. | EXISTING | `ONTO-C5..C8`; `UNIV-ENTITY-001 §2` |
| UR-ENT-03 | Aggregation (particle→atom→…→nation→planet→civilization) shall use one homogeneous `composes`/`part-of`/`member-of` edge; there is no "level" primitive to extend. | EXISTING | `UNIV-ENTITY-001 §3–§4` (fixed-point composition) |
| UR-ENT-04 | Scale shall be expressed as **data** (attribute values, graph depth), never as type/port/code. | EXISTING | `UNIV-ENTITY-001 §4` |
| UR-ENT-05 | Personhood/agency shall be an **attribute/classification** (`O-03 Actor`/`O-09 Species`), not a distinct substrate — a Particle and a Person share the representational plane. | EXISTING | `ONTO-SEC-001 SI-7` (identity ≠ meaning); `UNIV-ENTITY-001` |
| UR-ENT-06 | Currently-unknowable entity forms shall be admitted only via Meta-Core registration + federation (`O-16`). | PROPOSED | `O-16`; `UCOS-UEA-0001` L14; INV-20 (proposed) |

**Charter entity coverage:** Human/Organization/Agent/AI/Law/Policy/Capability/Knowledge/Memory/Resource/
Workflow/Asset/Document = EXISTING; Ocean/Mountain/Country/Planet/Star/Galaxy = IMPLICIT (representationally
verified); Unknown/Future Objects = PROPOSED.

---

## 4. Universal Identity Requirements (UR-ID-*)

| ID | Requirement | Class. | Evidence |
|----|-------------|:------:|----------|
| UR-ID-01 | Every entity/resource/capability/policy/knowledge/event/state/platform/civilization shall bear a stable, verifiable **Identity** (`O-02`). | EXISTING | `O-02`; PI-4 `control/identity/*`; `RegistryPort` id@version |
| UR-ID-02 | Identity shall be **locality-independent but locality-correlatable**; no global synchronous identity store. | PROPOSED | `UCOS-UEA-0007 §3` |
| UR-ID-03 | The identity model shall admit unknown-future principal classes — `IdentityRecord.kind` is an **open string**, not a fixed enum. | EXISTING | `REG-ABS-001`; PI-4 `control/types.ts` |
| UR-ID-04 | Identity shall be species-agnostic (human/service/workload/agent/tenant; and, proposed, non-human actors). | EXISTING *(4 principal classes)* / PROPOSED *(species)* | `UCOS-SEC-ARCH-001` (4 principal classes); INV-15 (proposed) |
| UR-ID-05 | Identity shall confer no authority/trust/permission by itself (identity ≠ meaning). | EXISTING | `ONTO-SEC-001 SI-7`; deny-by-default (INV-3) |

---

## 5. Universal Resource Requirements (UR-RES-*) — "Everything is a Resource"

| ID | Requirement | Class. | Evidence |
|----|-------------|:------:|----------|
| UR-RES-01 | Every runtime object shall be representable as a governed **registry/metadata record** under a reserved keyspace. | EXISTING | `REG-ABS-001` (registry/metadata-absolute); `RegistryPort`/`MetadataPort` |
| UR-RES-02 | Compute/storage/knowledge/trust/people/organizations/infrastructure shall be first-class resource records. | EXISTING | PI-2/3/4/7; `REG-ABS-001` |
| UR-RES-03 | Money/energy shall be governed value resources under a value-model-agnostic economic fabric. | PROPOSED | `ECON-*`; `ECON-001` (design-only) |
| UR-RES-04 | **Time** shall be a first-class resource/dimension (valid-time, transaction-time, temporal ordering). | MISSING | append-only version order only (`INV-10`); no first-class time resource (see §7) |
| UR-RES-05 | Future/unknown resource classes shall onboard by registration, never redesign. | PROPOSED | `O-16`; INV-13/INV-20 |

---

## 6. Universal Capability & Relationship/State/Event Requirements (UR-CAP-*, UR-REL-*, UR-ST-*, UR-EV-*)

| ID | Requirement | Class. | Evidence |
|----|-------------|:------:|----------|
| UR-CAP-01 | Everything may expose **capabilities** — a described ability realized by contract-bound services (`O-05/O-06`). | EXISTING | `CAP-01..19`; substrate composition; `test/dynamic-capability.test.ts` |
| UR-CAP-02 | New capabilities shall enter by descriptor + provider with **zero core change**. | EXISTING | `UA-10-CERT-001`; `test/dynamic-capability.test.ts` |
| UR-REL-01 | Everything shall relate to everything else via `ONTO-C6` relationships (domain/range/cardinality/symmetric/transitive/inverse) across all relationship classes. | EXISTING *(structural)* | `ONTO-C6`; `UCOS-UEA-0002 §3` |
| UR-REL-02 | **Temporal and causal** relationships shall be first-class relationship classes. | MISSING | not first-class (see §7); charter classes temporal/causal unmodeled |
| UR-ST-01 | Every construct shall carry state/version/lifecycle/history under a single universal lifecycle, append-only. | EXISTING | `LIFE-UNIV-001`; `PEL-001` (10 stages); `INV-10` |
| UR-ST-02 | **Future projection** of state shall be available via sandboxed simulation. | IMPLICIT *(design-only)* | `SIM-*`; `AD-0022` |
| UR-EV-01 | Events/signals/transactions/observations/transitions/mutations/governance-actions shall be first-class, classified, owned, governed, audited. | EXISTING | `UCOS-PEA-003` (73 `PEV`, 17 `PED`, 10 classifications) |
| UR-EV-02 | Unknown event classes shall be admissible without redesign of the event fabric. | IMPLICIT | INV-13; open classification vocabulary |

---

## 7. Temporal, Spatial-Temporal & Continuity Requirements (UR-TIME-*)

This is the **weakest-covered universal dimension** and the primary source of MISSING classifications.

| ID | Requirement | Class. | Evidence |
|----|-------------|:------:|----------|
| UR-TIME-01 | Time shall be a first-class modeled dimension (valid-time/transaction-time; event ordering). | PROPOSED *(partial)* | append-only monotone order (`INV-10`); event lifecycle; no first-class temporal model |
| UR-TIME-02 | The platform shall tolerate **relativistic / latency-divergent time** across reference frames without assuming synchronous global time. | MISSING | `UCOS-UEA-0007` Q2 (open); `CIV-STRESS-001` BP-15 (INV-6-vs-latency WALL) |
| UR-TIME-03 | **Spatial-temporal locality** (where + when) shall be an addressable context. | MISSING | `O-15` spatial only; temporal locality flagged open |
| UR-TIME-04 | **Multiple, reconcilable reference frames** for time/space/state shall be supported. | MISSING | entailed-only by federation-of-localities; no multi-frame construct |
| UR-TIME-05 | Time continuity shall hold at **century scale** — crypto-agility, ledger longevity/compaction, key/authority succession. | MISSING | `ULT-TEST-001` RM-8/RM-9 (absent from design record); FM-10/11/12 |
| UR-TIME-06 | Governance decisions shall carry **temporal validity** (effective dates, time-scoped authority). | MISSING | effective-dates appear ad hoc in `AD-*`; no temporal-governance requirement of record |

> **Temporal determination:** UCOS has strong *ordering/versioning* time (append-only monotone order) but **no
> first-class temporal, spatial-temporal, multi-frame, relativistic, or century-continuity model**. This is the
> concentrated MISSING cluster (RC-051..058) and the one place the constitutional-completeness test fails
> outright at interplanetary scale (`CIV-STRESS-001`/`ULT-TEST-001`).

---

## 8. Universal Civilization Requirements (UR-CIV-*)

| ID | Requirement | Class. | Evidence |
|----|-------------|:------:|----------|
| UR-CIV-01 | Individual→family→community→organization→city→region→nation→civilization→planetary/multi-planet shall be modeled as **governed, non-actuating** constructs. | PROPOSED | `CIV-GOV-001` v1.1.0; `UNIV-ENTITY-001` (family..civilization verified) |
| UR-CIV-02 | Civilizations shall be modeled **only** as governed/simulation/digital-twin/scenario objects — never actuating runtime entities (SGP-9 / non-actuation). | PROPOSED | `CIV-GOV-001` CGP-1; `CIV-001` (design-only) |
| UR-CIV-03 | Population shall be **aggregate-only** (no PII, no re-identification). | PROPOSED | `CIV-GOV-001` (population privacy); `CIV-THREAT-001` C13 |
| UR-CIV-04 | Civilization governance shall be **federated governance** (subsidiarity tiers GT-0..GT-3, risk lanes), never a new authority above the Authority Board within an instance. | PROPOSED | `CIV-GOV-001` v1.1.0 (PHASE R7); `UCOS-UEA-0001` L11 |
| UR-CIV-05 | Rights shall be non-enforceable-at-model-level; obligations modeled; all decision classes Approval-Required. | PROPOSED | `CIV-GOV-001` (rights/obligations; CD1..9) |
| UR-CIV-06 | Civilization scope shall remain **conceptual and deferred** until the `AD-0014` boundary is deliberated. | PROPOSED *(deferred)* | `AD-0014`; `PHASE 11D.3` |

---

## 9. Universal Authority, Continuity & Provenance Requirements (UR-GOV-*)

| ID | Requirement | Class. | Evidence |
|----|-------------|:------:|----------|
| UR-GOV-01 | A single immutable authority hierarchy shall be supreme, terminal at the Authority Board, with enumerated powers and separation of duties. | EXISTING | `AUTH-009`; `AUTH-UNIV-001` (universal authority fabric, design) |
| UR-GOV-02 | Authority/certification/ratification/revocation should be realized as **one universal Authority primitive** all fabrics compose (not per-fabric copies). | PROPOSED | `AUTH-UNIV-001`; `ARCH-GAP-001` M1 (currently duplicated) |
| UR-GOV-03 | Every authorization act shall be recorded on the canonical `AUTH-012` decision ledger. | EXISTING *(model)* / **DEFECTIVE (of record)** | `AUTH-012`; **`AD-0016..0023` off-ledger** (`ARCH-GAP-001` C3; `PHASE-21`) |
| UR-GOV-04 | Governed change and audit shall be recorded on append-only, hash-chained, tamper-evident, offline-verifiable, reconcilable ledgers. | EXISTING *(per-fabric)* | hash-chained `FederatedAuditLog`; `INV-10` |
| UR-GOV-05 | Audit/provenance should be **one universal primitive** all fabrics emit into. | PROPOSED | `AUDIT-UNIV-001` (6→1 reduction proven; not built); `ARCH-GAP-001` C1 |
| UR-GOV-06 | Local sovereignty shall be preserved; foreign constructs advisory/deny-only, namespace-isolated, never override a local single-owner SoR. | EXISTING | `FED-GOV-001`; INV-5; PI-5 |
| UR-GOV-07 | The data plane shall continue on last-known-good during authority/control outage or partition (static stability / continuity). | EXISTING | `INV-9`; `UCOS-UEA-0007` |

---

## 10. Universal Execution, Learning, Ethics & Alignment Requirements (UR-EXE-*)

| ID | Requirement | Class. | Evidence |
|----|-------------|:------:|----------|
| UR-EXE-01 | Execution shall be deterministic (or non-determinism quarantined), auditable, traceable, idempotent, bounded-failure, governed-recovery. | EXISTING | `PEX-001..017` (EX1–EX7); `INV-CORE-09`; Meta-Core execution engine |
| UR-EXE-02 | Cognition (reasoning/inference/planning/decision) shall be **governed, propose-not-act, explainable, Evolution-only-commit**. | EXISTING *(design)* / PROPOSED *(build)* | `INT-*`; `INTEL-001` (READY FOR AUTHORIZATION); not implemented |
| UR-EXE-03 | Autonomous actors shall be **provably bounded** — no self-authored goals, no self-modification, no autonomous actuation. | MISSING *(design-only; not enrolled/built)* | `INT-GOV-001`; `INV-CORE-12 Non-Actuation` (DEFINED, not enrolled) |
| UR-EXE-04 | Ethical constraints (non-actuation, population privacy, human/Board-in-the-loop) shall be governed. | PROPOSED | `INT-GOV-001`; `CIV-GOV-001`; design-only |
| UR-EXE-05 | Cognition profile (`O-12 Intelligence`) shall be an actor attribute (human/artificial/machine/collective/distributed/hybrid/emergent/unknown), not a substrate; no "consciousness" claim. | PROPOSED | `O-12`; `INT-*` |

---

## 11. Consolidated universal-requirements determination

| Universal requirement family | Dominant class | Determination |
|------------------------------|:--------------:|---------------|
| Entity (UR-ENT) | EXISTING | Representationally verified scale-invariant; strongest area |
| Identity (UR-ID) | EXISTING | Open-kind, locality-correlatable, species-extensible |
| Resource (UR-RES) | EXISTING | Registry/metadata-absolute at object layer; money/energy PROPOSED; time MISSING |
| Capability (UR-CAP) | EXISTING | Zero-core-change extensibility proven |
| Relationship/State/Event (UR-REL/ST/EV) | EXISTING | Structural + event fabric ratified; temporal/causal relationships MISSING |
| Reality (UR-REAL) | PROPOSED | Contexts modeled; new-reality neutrality NOT ESTABLISHED (INV-17↔INV-5) |
| Temporal (UR-TIME) | **MISSING** | No first-class temporal/spatial-temporal/multi-frame/continuity model — weakest area |
| Civilization (UR-CIV) | PROPOSED | Coherent non-actuating model; deferred `AD-0014` |
| Authority/Continuity/Provenance (UR-GOV) | EXISTING *(model)* | Strong model; **authority-chain integrity DEFECTIVE of record**; universal Audit/Authority primitives PROPOSED |
| Execution/Learning/Ethics/Alignment (UR-EXE) | EXISTING *(execution)* / PROPOSED *(cognition)* | Execution ratified; cognition design-ratifiable, unbuilt; alignment MISSING as enrolled requirement |

**Overall:** The **representational and control foundation is EXISTING and strong**; the **behavioral,
existential, and temporal frontier is PROPOSED/MISSING** and gated on `AD-0014`, the `AUTH-012` chain
restoration, and closure of the temporal cluster. All gaps carried to `UCOS-AUDIT-0001`.

## 12. Traceability

- **Refines:** `UCOS-REQ-0001` (RC-021..034, RC-051..058), `UCOS-REQ-0002`.
- **Evidence:** `UCOS-UEA-0001/0002/0006/0007`, `UNIV-ENTITY-001`, `REG-ABS-001`, `ONTO-*`, `CIV-GOV-001`, `CIV-001`, `INT-*`, `SIM-*`, `ECON-*`, `AUTH-UNIV-001`, `AUDIT-UNIV-001`, `LIFE-UNIV-001`, `ULT-TEST-001`, `CIV-STRESS-001`, `AUTH-013-AMD-001`, `AD-0014`.
- **Owner:** UCOS Authority Board.

**END `UCOS-REQ-0004` — UNIVERSAL REQUIREMENTS SPECIFICATION · ENTITY/IDENTITY/RESOURCE/CAPABILITY EXISTING · REALITY/CIVILIZATION PROPOSED · TEMPORAL MISSING · REQUIREMENTS ONLY.**
