# UCOS-REQ-0001 — Master Requirements Baseline

**Artifact ID:** `UCOS-REQ-0001`
**Phase:** Phase 0 — Master Requirements Baseline Discovery, Consolidation & Ratification (Constitutional Discovery Edition)
**Mode:** REQUIREMENTS DISCOVERY · CONSOLIDATION · RATIFICATION ONLY — no source code, schema, database, migration, API, service, infrastructure, implementation plan, roadmap, or architecture is produced by this artifact.
**Status:** RATIFIED BASELINE (v1.0.0) — first authoritative UCOS Master Requirements Baseline.
**Authority:** Subordinate to the Authority Layer (`AUTH-001..012`) and the Constitution (`UCOS-CONST-001`). This baseline **restates and consolidates** existing governed requirements; it enrolls, amends, and overrides nothing. Precedence: Authority > Constitution > Architecture > Specifications > Implementation > Validation > Certification (`AUTH-009 §6.2`).
**Governing invariants:** `INV-1..INV-13` (`UCOS-ASR-NFR-001` v1.0.1). Existential invariants `INV-14..INV-20` are **PROPOSED / DEFERRED** under `AD-0014`; canonical integrity invariants `INV-CORE-01..14` are **DEFINED, not enrolled**.
**Date:** 2026-07-03

---

## 0. How to read this baseline

This document is the single authoritative consolidation of every UCOS requirement discovered from repository
evidence, organized into the sixty-seven requirement classes **RC-001 … RC-067** mandated by the Phase 0
charter. Each requirement class carries:

- **Consolidated requirement statement** — the normalized, deduplicated intent.
- **Classification** — one of:
  - **EXISTING** — explicitly ratified/implemented with a governed artifact of record.
  - **IMPLICIT** — entailed by ratified artifacts but not stated as a first-class requirement.
  - **PROPOSED** — authored as a governed proposal, pending Authority Board disposition (not enrolled).
  - **MISSING** — required by the constitutional vision but neither stated, entailed, nor proposed with sufficiency.
- **Primary evidence** — the repository artifact(s) that ground the classification.

Companion deliverables:
`UCOS-REQ-0002` (Universal Scope & Coverage), `UCOS-REQ-0003` (Architectural Principles Catalog),
`UCOS-REQ-0004` (Universal Reality/Entity/Identity/Resource/Capability/Temporal/Civilization Specification),
`UCOS-AUDIT-0001` (Gap Analysis), `UCOS-AUDIT-0002` (Traceability Matrix), `UCOS-AUDIT-0003` (Existing vs Implicit vs Proposed Reconciliation).

### 0.1 Classification summary (67 requirement classes)

| Classification | Count | Requirement classes |
|----------------|:-----:|----------------------|
| **EXISTING** | 33 | RC-001, 002, 003, 004, 005, 006, 007, 008, 014, 015, 016, 017, 018, 019, 022, 023, 024, 025, 026, 027, 028, 033, 035, 036, 037, 038, 039, 042, 043, 044, 045, 059, 060 |
| **IMPLICIT** | 13 | RC-009, 010, 021, 029, 034, 040, 041, 049, 050, 061, 062, 066, 067 |
| **PROPOSED** | 13 | RC-011, 012, 013, 030, 031, 032, 046, 047, 048, 051, 056, 063, 064 |
| **MISSING** | 8 | RC-020, 052, 053, 054, 055, 057, 058, 065 |

> **Whole-baseline determination:** UCOS holds a **complete, deeply-ratified requirements foundation for a
> governed, metadata-driven, contract-first commerce-and-platform operating system at planetary/single-instance
> scale** (RC-001..050 substantially EXISTING/IMPLICIT), and a **coherent but unratified proposal frontier for
> universal-existential scope** (RC-021/029..032, RC-046..067 largely PROPOSED/MISSING, deferred under
> `AD-0014`). The single systemic reconciliation item is the **governance authority-chain integrity gap**
> (`AD-0016..0023` recorded off the canonical `AUTH-012` ledger; see RC-004/033 and `UCOS-AUDIT-0001`).

---

## 1. Governance & Constitutional Requirement Classes (RC-001 … RC-020)

| RC | Class | Consolidated requirement | Class. | Primary evidence |
|----|-------|--------------------------|:------:|------------------|
| **RC-001** | Vision | UCOS shall be a domain-driven, metadata-configurable, contract-first operating system enabling any organization to launch, operate, and evolve commerce (and, by extension, arbitrary governed) capabilities by composition rather than rebuild, with traceability from intent to running software. | **EXISTING** | `AUTH-001-VISION`; `CTX-VISION-001`; `UCOS-ENT-ARCH-001` §II |
| **RC-002** | Constitutional | A supreme, immutable Authority Layer and a ratified 16-Part Constitution shall govern all artifacts; no artifact may contradict a higher-precedence artifact; controls S1/S3/S4 are non-waivable. | **EXISTING** | `AUTH-002-CONSTITUTION`; `UCOS-CONST-001` (RATIFIED, Phase 1.1); `AUTH-008` |
| **RC-003** | Architectural | Architecture shall be layered, acyclic, technology-neutral, and derived top-down (Enterprise→Domain→Capability→Information→Data→Platform); every layer ratified before the next. | **EXISTING** | `AUTH-004-ARCHITECTURE-CANON`; `UCOS-ENT-ARCH-001`; `UCOS-PEA-001..007` |
| **RC-004** | Governance | All change shall be governed by Approval-By-Exception (Trusted vs Approval-Required operations), gate-controlled (`GATE-QUAL/SEC/DOC/REL-001`), append-only, single-owner, with escalation terminal at the Authority Board and every decision recorded in `AUTH-012`. | **EXISTING** *(integrity gap: see note)* | `AUTH-009-GOVERNANCE-CANON`; `UCOS-GOVERNANCE-BASELINE-1.0`; `AD-0009` |
| **RC-005** | Identity | The platform shall provide a principal-agnostic identity & access capability (human, service/workload, autonomous agent, tenant) with authentication, authorization, and tenancy. | **EXISTING** | `CAP-17`/`CAP-09`; `UCOS-SEC-ARCH-001` identity model; PI-4 `control/identity/*` |
| **RC-006** | Trust | Trust shall be an evaluated, runtime, attribute-driven property; federated trust authorities raise effective level under clamping; deny-by-default. | **EXISTING** | `UCOS-SEC-ARCH-001`; PI-4 `control/trust/*`; PI-5 `FED-SEC-001` |
| **RC-007** | Federation | Independent instances/organizations shall compose only via contracts with no shared mutable model, local sovereignty, clamped trust, namespace isolation, and fail-closed partition behavior. | **EXISTING** | `INV-1`; `FED-GOV/SEC/PROV/AUD/ARCH-001`; `AD-0018`; PI-5 `control/federation/*` |
| **RC-008** | Knowledge | The platform shall provide a governed knowledge fabric (versioned records, write only via Evolution, read-governed) as a first-class primitive. | **EXISTING** | `PI7-*` (Knowledge Fabric ratified); `AD-0020`; `control/knowledge/*` |
| **RC-009** | Memory | The platform shall provide a governed, tiered memory fabric (working/short/long/semantic/episodic/federated) with retention and audit-preserving forgetting. | **IMPLICIT** *(implemented; ratification contested)* | `MEM-*`; `AD-0023` (off-ledger); PI-9 `control/memory/*`; `MEM-RAT-003` vs `MEM-RAT-001` divergence |
| **RC-010** | Ontology | The platform shall provide a governed semantic-schema (ontology) fabric — entity/relationship/taxonomy/constraint — as the shared typing substrate. | **IMPLICIT** *(implemented; authority contested; not yet the consumed universal type system)* | `ONTO-*`; `AD-0021` (contested); PI-8 `control/ontology/*`; `ARCH-GAP-001` m4 |
| **RC-011** | Economic | The platform shall represent value, assets, treasury, marketplace, exchange, settlement, and incentives under a value-model-agnostic economic fabric with conservation/atomicity/non-negativity invariants and Evolution-only commit. | **PROPOSED** | `ECON-*` (design); `ECON-001` runtime realization (READY FOR AUTHORIZATION REVIEW); not implemented |
| **RC-012** | Civilization | The platform shall model civilizations, institutions, populations (aggregate-only), culture, governance, economy, rights and obligations as bounded, non-actuating governed/simulation constructs. | **PROPOSED** | `CIV-GOV-001` v1.1.0; `CIV-001` (design-only); deferred under `AD-0014` |
| **RC-013** | Evolution | All durable mutation of governed constructs shall route through a single Evolution fabric (migration-only, append-only, backward-compatible), which is the sole commit path. | **EXISTING** | `INV-10`; `IP-14`/`IP-15`; `AD-0019`; PI-6 `control/evolution/*` |
| **RC-014** | Security | Zero-trust, least-privilege, deny-by-default; non-waivable S1 (authn/authz), S3 (secrets), S4 (data protection), plus S6 audit; 20 controls mapped to 62 STRIDE threats. | **EXISTING** | `AUTH-008`; `UCOS-SEC-ARCH-001`; `SEC-CTL-001..020`; `INV-2/3/4/11` |
| **RC-015** | Operations | Every capability shall be operable in production: observability, resilience, delivery, provisioning, configuration/metadata delivery as first-class platform domains. | **EXISTING** | `UCOS-PEA-001` (PE-11..15); `P7` (observability principle); `UCOS-PLAT-ADR-001..007` |
| **RC-016** | Compliance | Compliance & assurance shall be a first-class capability: verification, audit coordination, regulatory conformance, evidence, inherited classification. | **EXISTING** | `CAP-16`; `UCOS-SEC-COMP-001`; `PDC-001..017`; `AUTH-008 §6/§7/§8` |
| **RC-017** | Readiness | No increment is "done" until quality/security/documentation/release gates pass; production-readiness is designed-in and certified, never assumed. | **EXISTING** | `P10`; Constitution Art. VII; `.claude/governance/*-gates.md`; `OP-CERT-001` |
| **RC-018** | Scalability | The platform shall scale horizontally-first across open scale tiers (T1→T4+) by extension, not redesign; state externalized to SoR/cache. | **EXISTING** *(bounded; see note)* | `INV-7`; `UCOS-ASR-NFR-001` §5; `CIV-STRESS-001` (first break ~10⁶) |
| **RC-019** | Extensibility | The platform shall impose no architectural ceiling on domains, services, workflows, data models, events, capabilities, AI systems, engines, organizational structures, or topologies; extension via registration/metadata/configuration/composition/federation, never foundation redesign. | **EXISTING** | `INV-13` (enrolled v1.0.1, `AUTH-012-FPA-001`); compliance C-EX1..C-EX5; `EXT-001` |
| **RC-020** | Future Discovery (governance) | A closed, governed **admission protocol** for currently-unknowable requirement/construct classes (a requirements-level "Unknown Future" gate) shall exist so that new discovery classes enter the baseline by registration, not by re-authoring it. | **MISSING** | Entailed by `INV-13`/`UCOS-UEA-0001` L14 but no requirements-layer admission protocol exists; see `UCOS-AUDIT-0001` GAP-R20 |

> **RC-004 integrity note.** The governance *model* is EXISTING and ratified, but the *authority chain of record*
> is defective: scoped Article IX releases `AD-0016..AD-0023` were recorded off the canonical `AUTH-012` ledger
> (`ARCH-GAP-001` C3; `PHASE-21-CONSTITUTIONAL-RECONCILIATION-REPORT`). `AUTH-REST-004` asserts restoration but
> `REAL-M-03` records the restoration and dependent ratifications as self-attested / independently unverified.
> This is the single highest-priority reconciliation item (see `UCOS-AUDIT-0001` GAP-C3).

---

## 2. Universal Primitive Requirement Classes (RC-021 … RC-028)

The Phase 0 charter's "everything is an Entity / Resource / Capability" tests map onto UCOS's nine ratified
universal primitives (**Registry · Metadata · Configuration · Knowledge · Ontology · Memory · Authority ·
Federation · Evolution**) and the Universal Ontology constructs `O-01..O-16` (`UCOS-UEA-0002`).

| RC | Class | Consolidated requirement | Class. | Primary evidence |
|----|-------|--------------------------|:------:|------------------|
| **RC-021** | Universal Reality | The platform shall represent any reality substrate (physical/virtual/simulated/hybrid/nested) as an orthogonal context attached to entities. | **IMPLICIT** *(proposed to become explicit; NOT established)* | `O-14 Reality` (`UCOS-UEA-0002`); `UCOS-UEA-0006`; **blocked** by INV-17↔INV-5 conflict (`UA-10-CERT-001`) |
| **RC-022** | Universal Entity | Everything shall be representable as an Entity via four construct kinds (entity/relationship/taxonomy/constraint) + recursive composition, with zero scale-specific fields. | **EXISTING** *(representationally verified)* | `UNIV-ENTITY-001` (SCALE-INVARIANT: particle→civilization); `ONTO-C5..C8`; PI-8 `control/ontology/*` |
| **RC-023** | Universal Identity | Every entity/resource/capability/policy/event/state/platform shall bear a stable, verifiable, locality-independent identity; `IdentityRecord.kind` is an open string. | **EXISTING** | `O-02 Identity`; PI-4 `control/identity/*`; `REG-ABS-001` (open-kind evidence) |
| **RC-024** | Universal Resource | Everything (time, energy, compute, storage, money, trust, knowledge, people, infrastructure, …) shall be representable as a governed registry/metadata resource record. | **EXISTING** *(object layer)* | `REG-ABS-001` (registry/metadata-absolute at object layer); `RegistryPort`/`MetadataPort` |
| **RC-025** | Universal Capability | Everything may expose capabilities; a capability is a described ability realized by contract-bound services. | **EXISTING** | `O-05 Capability`/`O-06 Service`; `CAP-01..19`; `UCOS-CAP-ARCH-001`; PI-2/3 substrate composition |
| **RC-026** | Universal Relationship | Everything shall relate to everything else across directed/undirected/hierarchical/networked/temporal/causal/semantic/economic/governance relationship classes. | **EXISTING** *(structural classes; temporal/causal partial)* | `ONTO-C6` relationships; `UCOS-UEA-0002 §3`; temporal/causal relationships not first-class (see RC-051..053) |
| **RC-027** | Universal State | Every construct shall carry state/version/lifecycle/history with append-only evolution and future projection via simulation. | **EXISTING** *(projection via unbuilt Simulation)* | `LIFE-UNIV-001`; `PEL-001` (10-stage lifecycle); `INV-10`; projection → `SIM-*` (design-only) |
| **RC-028** | Universal Event | Events/signals/transactions/observations/transitions/mutations/governance-actions shall be first-class, classified, owned, governed, and audited. | **EXISTING** | `UCOS-PEA-003` (73 `PEV`, 17 `PED`, 10 classifications, RATIFIED); `PEGM-001`; `PEL-001` |

---

## 3. Platform, Civilization & Unboundedness Requirement Classes (RC-029 … RC-034)

| RC | Class | Consolidated requirement | Class. | Primary evidence |
|----|-------|--------------------------|:------:|------------------|
| **RC-029** | Universal Platform Factory | The platform shall create and govern arbitrary platform classes (ERP/CRM/SCM/commerce/marketplace/exchange/banking/insurance/government/healthcare/education/manufacturing/AI/space/…, incl. NSE/BSE/NYSE/NASDAQ/crypto exchanges) by composition of governed capabilities. | **IMPLICIT** | Entailed by `INV-13` + `CAP-01..19` + `UCOS-DOM-ARCH-001` (28 contexts) + `ECON-*`; **no explicit platform-factory catalog** (see `UCOS-AUDIT-0001` GAP-R29) |
| **RC-030** | Universal Civilization | Individual→family→community→organization→city→region→nation→civilization→planetary/multi-planet civilization shall be modeled as governed constructs. | **PROPOSED** | `CIV-GOV-001` v1.1.0; `UNIV-ENTITY-001` (family..civilization verified representationally); `AD-0014`-deferred |
| **RC-031** | Architectural Unboundedness | The architecture shall be scale/domain/platform/entity/civilization/temporal/future-discovery agnostic without constitutional redesign. | **PROPOSED** *(partially EXISTING via INV-13)* | `INV-13` (EXISTING); `INV-14..20` (PROPOSED, `AD-0014`); `UA-10-CERT-001` (3/4 axes absorbable; realities NOT established) |
| **RC-032** | Unknown Domain | Currently-unknown domains shall onboard via Meta-Core registration + composition + federation, never by redesign of L0–L13. | **PROPOSED** | `UCOS-UEA-0001` L14; `O-16 Unknown Future Entity`; `PHASE-UA-04-UNKNOWN-READINESS-001`; `INV-20` (proposed) |
| **RC-033** | Authority | A single immutable authority hierarchy shall be supreme, with terminal Authority Board, enumerated approval powers, and separation of duties; ideally realized as one universal Authority primitive. | **EXISTING** *(model)* / **PROPOSED** *(universal primitive; chain integrity)* | `AUTH-009`; `AUTH-UNIV-001` (Universal Authority Fabric, design); `ARCH-GAP-001` M1 (authority duplicated) + C3 (off-ledger) |
| **RC-034** | Sovereignty | Each node/domain shall retain local sovereignty; foreign constructs are advisory/deny-only, namespace-isolated, and never override a local single-owner SoR. | **IMPLICIT** | `FED-GOV-001` (local sovereignty); `INV-5`; PI-5 `control/federation/*` (deny-only foreign policy) |

---

## 4. Continuity, Provenance, Execution, Learning & Discovery Classes (RC-035 … RC-041)

| RC | Class | Consolidated requirement | Class. | Primary evidence |
|----|-------|--------------------------|:------:|------------------|
| **RC-035** | Continuity | The data plane shall continue on last-known-good state during control-plane/authority outage or partition (static stability). | **EXISTING** | `INV-9`; `UCOS-UEA-0007` (partition = normal operating condition); `INV-CORE-04/14` recovery |
| **RC-036** | Provenance | Every construct shall trace origin/lineage (Entity→LDO→…→Capability→Authority); federated records carry provenance envelopes. | **EXISTING** *(lineage)* / **PROPOSED** *(unified with audit)* | `AUTH-010`; `INV-CORE-03 Lineage`; `FED-PROV-001`; unified audit/provenance primitive PROPOSED (`AUDIT-UNIV-001`) |
| **RC-037** | Ledger | Governed change and audit shall be recorded on append-only, hash-chained, tamper-evident, offline-verifiable, reconcilable ledgers. | **EXISTING** *(per-fabric; not yet universal)* | `AUTH-012` decision ledger; hash-chained `FederatedAuditLog`; **6× duplicated** (`ARCH-GAP-001` C1) |
| **RC-038** | Execution | Execution shall be deterministic (or non-determinism quarantined), auditable, traceable, idempotent, with bounded failure and governed recovery. | **EXISTING** | `PEX-001..017` (17 execution models, invariants EX1–EX7); PI-2 Meta-Core execution engine; `INV-CORE-09` |
| **RC-039** | Learning | Cognition (reasoning/inference/planning/decision) shall be governed, propose-not-act, explainable, determinism-quarantined, with Evolution-only commit. | **EXISTING** *(design ratifiable)* / **PROPOSED** *(implementation)* | `INT-*` (design; `INT-READINESS-001` 10/10); `INTEL-001` (READY FOR AUTHORIZATION); **not implemented** (`AD-0024` pending) |
| **RC-040** | Simulation | The platform shall support sandboxed, non-actuating what-if/projection/impact/digital-twin/scenario modeling; forecasts advisory, never facts. | **IMPLICIT** *(design ratifiable; authorized-conditional)* | `SIM-*`; `SIM-PLAN-001..003`; `AD-0022` (conditional scoped release); **not implemented** |
| **RC-041** | Discovery | The platform shall support governed discovery (registration + metadata + query) of constructs, capabilities, and services at runtime. | **IMPLICIT** | `CAP-19 Registry & Discovery`; `RegistryPort` resolve/discover; `WP-PLT-06`; `C-EX3` |

---

## 5. Infrastructure, Observability, Assurance & Meta-System Classes (RC-042 … RC-045)

| RC | Class | Consolidated requirement | Class. | Primary evidence |
|----|-------|--------------------------|:------:|------------------|
| **RC-042** | Infrastructure | Platform infrastructure (runtime/persistence/networking/messaging/gateway/provisioning) shall be defined technology-neutrally and bound only via neutral ADR contracts (K8s/S3/Kafka/OIDC/OCI/HCL). | **EXISTING** | `UCOS-PEA-001` (PE-01..05,15); `INV-8`; `UCOS-PLAT-ADR-001..007` |
| **RC-043** | Observability | Everything shall be measurable/traceable/operable: logs, metrics, traces, health, telemetry as design inputs. | **EXISTING** *(defined; PE-12 product undecided)* | `P7`; `PE-12 Observability & Telemetry`; open ADR sub-decision `PE-12` (`UCOS-RA1-ENV-004`) |
| **RC-044** | Compliance & Assurance | Independent validation, audit, ratification, and certification shall gate every architecture layer; assurance is evidence-based across defined dimensions. | **EXISTING** | Per-layer RAT/AUD/CERT reports (Phases 2.1–8.1); `OP-CERT-001` (9-track program) |
| **RC-045** | Meta-System | The system shall be self-describing and self-governing: a reflexive Meta-Core (Registry+Metadata+Configuration+Policy+Governance) that describes and governs itself and everything else. | **EXISTING** | `UCOS-UEA-0001` L2 Meta-Core; PI-2 `src/meta-core/*`; `test/dynamic-capability.test.ts` (0 core change) |

---

## 6. Unknown, Emergent, Self-Extension & Meta-Requirement Classes (RC-046 … RC-050)

| RC | Class | Consolidated requirement | Class. | Primary evidence |
|----|-------|--------------------------|:------:|------------------|
| **RC-046** | Unknown | The baseline shall admit currently-unknown requirements via a governed reserved construct rather than presuming completeness. | **PROPOSED** | `O-16 Unknown Future Entity`; `PHASE-UA-04-UNKNOWN-READINESS-001`; `INV-20` (proposed) |
| **RC-047** | Emergent | Emergent requirements arising from composition/federation shall be detectable, recordable, and governable (gap-as-first-class-artifact). | **PROPOSED** *(gap discipline EXISTING; emergent-detection PROPOSED)* | Constitution Art. X (gap discipline); `.claude/skills/gap-detection.md`; emergent detection not formalized |
| **RC-048** | Future Discovery (requirements) | New discovery classes shall be admissible without constitutional redesign (requirements-layer companion to RC-020/RC-032). | **PROPOSED** | `INV-13`/`INV-20`; `UCOS-UEA-0013` roadmap (PLANNING ONLY); duplicate of charter RC-020/048 (dedup note below) |
| **RC-049** | Self-Extension | The platform shall extend itself through registration/metadata/configuration/composition/federation with zero core-dir change (proven additively across PI-4..PI-11). | **IMPLICIT** *(demonstrated)* | `UA-10-CERT-001` (zero substrate-core-dir change PI-4..PI-11); `EXT-001`; `INV-13` |
| **RC-050** | Meta-Requirements | Requirements themselves shall be governed, versioned, traceable, append-only, and ratified artifacts (this baseline is such an artifact). | **IMPLICIT** | `AUTH-010`; `CTX-TRACE-001`; this baseline (`UCOS-REQ-0001`); no standing requirements-registry construct yet (see GAP-R50) |

> **Dedup note.** The charter lists "Future Discovery Requirements" three times (RC-020, RC-048) and both
> RC-020 and RC-048 collapse to one intent: *a governed admission protocol for unknown future requirement
> classes*. They are retained as distinct IDs for charter fidelity but recorded as **one consolidated
> requirement** (see `UCOS-AUDIT-0003` D-1).

---

## 7. Temporal & Spatial-Temporal Requirement Classes (RC-051 … RC-058)

| RC | Class | Consolidated requirement | Class. | Primary evidence |
|----|-------|--------------------------|:------:|------------------|
| **RC-051** | Temporal | Time shall be a first-class modeled dimension (valid-time/transaction-time, event ordering, temporal relationships). | **PROPOSED** *(partial)* | Append-only monotone version order (`INV-10`); event lifecycle (`PEL-001`); **no first-class temporal model** |
| **RC-052** | Relativistic Time | The platform shall tolerate relativistic/latency-divergent time across reference frames (light-minute+ RTT) without assuming synchronous global time. | **MISSING** | `UCOS-UEA-0007` Q2 (open question); `CIV-STRESS-001` BP-15 (INV-6 vs relativistic latency = WALL); deferred `AD-0014` |
| **RC-053** | Spatial-Temporal | The platform shall model combined spatial-temporal locality (where + when) as an addressable context. | **MISSING** | `O-15 Cosmology` (spatial only, temporal flagged open); no spatial-temporal construct |
| **RC-054** | Multi-Reference Frame | The platform shall support multiple, reconcilable reference frames for time/space/state. | **MISSING** | No multi-frame construct; entailed-only by `UCOS-UEA-0007` federation-of-localities |
| **RC-055** | Planetary & Oceanic Reality | Physical realities (planets, oceans, mountains, ecosystems) shall be representable as entities/habitats. | **MISSING** *(representationally demonstrable, not required-of-record)* | `O-10 Habitat`; `UNIV-ENTITY-001` (planet verified); no ratified planetary/oceanic requirement |
| **RC-056** | Simulation & Alternate Reality | Simulated/alternate/nested realities shall be representable and governed as sandboxed constructs. | **PROPOSED** | `O-14 Reality` (nested); `SIM-*`; INV-17 (proposed, deferred) |
| **RC-057** | Time Continuity | Governance, audit, and identity shall remain continuous and reconcilable across century-scale time (crypto-agility, ledger longevity, custodian succession). | **MISSING** | `ULT-TEST-001` RM-8/RM-9 (crypto-agility & century-scale ledger *absent from design record*); FM-10/11/12 |
| **RC-058** | Temporal Governance | Governance decisions shall carry temporal validity, effective dates, and time-scoped authority. | **MISSING** | Effective-date fields appear ad hoc in `AD-*` records; no temporal-governance requirement of record |

---

## 8. Foundational, Semantic, Ethical & Resilience Requirement Classes (RC-059 … RC-067)

| RC | Class | Consolidated requirement | Class. | Primary evidence |
|----|-------|--------------------------|:------:|------------------|
| **RC-059** | Mathematical Foundations | The architecture shall rest on a formal, assumption-free mathematical substrate (sets/categories/algebras/order/type/logic) yielding checkable invariants. | **EXISTING** *(defined, referenced-not-formalized)* | `UCOS-UEA-0001` L0; `INV-CORE-*` (fail-closed, monotone order); L0 "Referenced only" (`UCOS-UEA-REV-001` OI-2) |
| **RC-060** | Logical Foundations | Governance rules, policies, and constraints shall be expressible as formal, evaluable logic (deny-by-default, deny-overrides-allow, priority). | **EXISTING** *(bounded vocabulary)* | PI-4 `policy-evaluator.ts` (5 rule types); `SI-1..SI-7` ontology constraints; **predicate vocabulary hard-coded** (`ARCH-GAP-001` M3) |
| **RC-061** | Semantic | Meaning shall be grounded in a canonical glossary/ontology; identity ≠ meaning; constructs semantically typed. | **IMPLICIT** *(ontology exists, not yet consumed as type system)* | `AUTH-011` glossary; `ONTO-*`; `ARCH-GAP-001` m4 (ontology not the universal typing substrate) |
| **RC-062** | Communication | Cross-boundary communication shall be contract-first, versioned, tolerant, and possibly-delayed/possibly-partitioned (never assumed instantaneous). | **IMPLICIT** | `INV-1`; `UCOS-SVC-ARCH-001` (85 contracts); `UCOS-UEA-0007` (async-first communication) |
| **RC-063** | Consciousness | Intelligence/cognition profile shall be modeled as an actor attribute (human/artificial/machine/collective/distributed/hybrid/emergent/unknown), not a substrate. | **PROPOSED** | `O-12 Intelligence`; `INT-*` (design; deferred); no "consciousness" claim — modeled as cognition profile |
| **RC-064** | Ethics | Ethical constraints (non-actuation, population privacy, rights/obligations non-enforceable-at-model-level, human-in-the-loop) shall be governed. | **PROPOSED** | `CIV-GOV-001` (population privacy, rights non-enforceable); `INT-GOV-001` (human/Board-in-loop); design-only |
| **RC-065** | Alignment | Autonomous actors shall be provably bounded: propose-not-act, deny-by-default, Evolution-only commit, no self-authored goals, no self-modification, no autonomous actuation. | **MISSING** *(design-only; not enrolled/implemented)* | `INT-GOV-001` (alignment principles, design); `INV-CORE-12 Non-Actuation` (DEFINED, not enrolled); PI-10 not implemented |
| **RC-066** | Risk | Threats shall be enumerated (STRIDE), mapped to controls, and re-scored to 0 residual High/High per fabric. | **IMPLICIT** *(per-fabric EXISTING; program-level risk register partial)* | Federation T1–12, Knowledge, Memory M1–12, Ontology O1–12, Intelligence I1–12, Simulation S1–12, Civilization C1–15 (all 0 residual High/High) |
| **RC-067** | Resilience | The platform shall be anti-fragile: fail-closed everywhere, static stability, bounded blast radius, graceful degradation, recovery by forward migration. | **IMPLICIT** | `AF-001`/`AF-REM-001` (anti-fragility assessment/mechanisms); `INV-9`; `INV-CORE` fail-closed property |

---

## 9. Consolidated requirement inventory (deduplicated)

- **Total charter requirement classes:** 67 (RC-001..RC-067).
- **Distinct consolidated requirements after dedup:** 66 (RC-020 ≡ RC-048 collapsed to one *Unknown-Future
  admission protocol* intent; see `UCOS-AUDIT-0003` D-1).
- **Requirement families with a ratified artifact of record:** Governance/Constitution (RC-001..004),
  Security (RC-014), Data/Information (feeds RC-024/027), Platform Engineering & Events (RC-015/028/042),
  Substrate/Control/Federation/Evolution/Knowledge primitives (RC-005..008, 013, 022..025, 033..038, 045).
- **Requirement families that are proposal-frontier (deferred `AD-0014`):** Economic (RC-011), Civilization
  (RC-012, 030), Existential/Reality/Temporal (RC-021, 031, 032, 051..058), Cognition/Ethics/Alignment
  (RC-039, 063..065).

---

## 10. Ratification

This Master Requirements Baseline is ratified as the first authoritative UCOS requirements baseline on the
following basis:

1. **Identified** — 67 charter requirement classes enumerated; 66 distinct consolidated requirements.
2. **Classified** — every class assigned EXISTING / IMPLICIT / PROPOSED / MISSING (§0.1 summary).
3. **Traced** — every class linked to repository evidence (full matrix in `UCOS-AUDIT-0002`).
4. **Evidenced** — classifications grounded in ratified artifacts, implemented code (269/269 tests), or governed proposals.
5. **Deduplicated** — RC-020/048 collapse recorded; overlapping intents normalized (`UCOS-AUDIT-0003`).
6. **Reconciled** — EXISTING vs IMPLICIT vs PROPOSED reconciliation in `UCOS-AUDIT-0003`; gaps in `UCOS-AUDIT-0001`.
7. **Ratified** — as a governed, append-only, single-owner requirements artifact subordinate to Authority and Constitution.

**Determination:** the baseline is **capable of governing the present system and its ratified/planetary-scale
extension trajectory**. Governance of **arbitrary future realities, temporal frames, and existential scope**
is **coherently proposed but not yet constitutionally established**, gated on (a) the `AD-0014` disposition of
existential invariants `INV-14..20`, (b) restoration of the `AUTH-012` authority chain (RC-004/033), and
(c) closure of the eight MISSING classes (RC-020, 052–055, 057, 058, 065). These are enumerated with
resolution paths in `UCOS-AUDIT-0001`.

> **Scope discipline confirmation.** No source code, schema, database, migration, API, service, infrastructure,
> implementation plan, roadmap, or architecture was produced. `INV-1..13`, `AUTH-012`, `AD-0014`, and the
> Article IX generation lock are unchanged. This artifact is requirements discovery/consolidation/ratification only.

## 11. Traceability

- **Refines:** `AUTH-001..012`, `UCOS-CONST-001`, `UCOS-ENT-ARCH-001`, `UCOS-DOM-ARCH-001`, `UCOS-CAP-ARCH-001`, `UCOS-INF-ARCH-001`, `UCOS-DATA/LDATA/PDATA-ARCH-001`, `UCOS-PEA-001..007`, `UCOS-ASR-NFR-001` (INV-1..13), `UCOS-SEC-ARCH-001`.
- **Consolidates evidence from:** `ARCH-GAP-001`, `ARCH-GAP-VAL-001`, `UNIV-ENTITY-001`, `UA-05/INV-CORE-001`, `UA-10-CERT-001`, `CIV-STRESS-001`, `ULT-TEST-001`, `REG-ABS-001`, `AUDIT-UNIV-001`, `AUTH-UNIV-001`, `LIFE-UNIV-001`, `UCOS-UEA-0001..0013`, `AUTH-013-AMD-001`, `AD-0014`, `PHASE-21-CONSTITUTIONAL-RECONCILIATION-REPORT`, `REAL-M-03`.
- **Refined by:** `UCOS-REQ-0002`, `UCOS-REQ-0003`, `UCOS-REQ-0004`, `UCOS-AUDIT-0001`, `UCOS-AUDIT-0002`, `UCOS-AUDIT-0003`.
- **Owner:** UCOS Authority Board (disposition).

**END `UCOS-REQ-0001` — MASTER REQUIREMENTS BASELINE · 67 CLASSES CLASSIFIED · REQUIREMENTS ONLY · INV-1..13 / AUTH-012 / AD-0014 / ARTICLE IX UNCHANGED.**
