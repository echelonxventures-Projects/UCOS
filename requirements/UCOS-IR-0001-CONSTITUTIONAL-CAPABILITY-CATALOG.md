# UCOS-IR-0001 — Constitutional Capability Catalog

**Artifact ID:** `UCOS-IR-0001`
**Program:** UCOS Phase 1 — Implementation Readiness Assessment (Constitution → Realization Traceability Audit)
**Phase:** IR-1 — Constitution → Capability Mapping
**Mode:** ASSESSMENT ONLY — no code, schema, architecture, requirement, governance, or authority is produced or modified. This artifact maps the frozen constitutional requirement classes to the capability, outcome, and behavior each demands. It is a readiness *audit*, not a design.
**Status:** ASSESSMENT BASELINE (v1.0.0)
**Authority:** Subordinate to the Authority Layer (`AUTH-001..012`), the Constitution (`UCOS-CONST-001`), and the frozen requirements baseline (`UCOS-REQ-0001..0006`). Modifies nothing above it.
**Inputs (read-only):** `UCOS-REQ-0001..0006`, `UCOS-AUDIT-0001..0004`, `UCOS-AUTH-0001`, `UCOS-INV-0001`.
**Date:** 2026-07-03

---

## 0. Scope note on the RC range (RC-001 … RC-100)

The IR charter requests mapping of **RC-001 through RC-100**. The frozen constitutional baseline
(`UCOS-REQ-0001`) enumerates and ratifies **exactly 67 requirement classes (RC-001 … RC-067)**; there are **no
RC-068 … RC-100 of record**. This assessment therefore:

- Maps **all 67 ratified requirement classes** (RC-001..RC-067) to capability / outcome / behavior below.
- Records **RC-068 … RC-100 as UNDEFINED / RESERVED** — not gaps. Admission of any future class into that range
  is itself a governed capability: the **Unknown-Future Admission Protocol** (RC-020 ≡ RC-048 /
  `UR-ALIGN-06`, `UCOS-REQ-0006 §7`), which requires new classes to enter **by registration, never by
  re-authoring the baseline**. The RC-068..100 span is thus *constitutionally accounted for* by an existing
  capability, not left open.

> **Discrepancy disposition:** the "RC-100" figure in the charter is treated as an inclusive upper bound of the
> reserved identifier space, not an assertion that 100 classes exist. No requirement is invented to fill it.

---

## 1. Method

For every requirement class RC-001..RC-067 this catalog records three columns derived strictly from the frozen
baseline:

- **Required Capability** — the abstract ability the constitution demands (what the system must be able to do).
- **Required Outcome** — the observable end-state that proves the capability is present.
- **Required Behavior** — the invariant-constrained manner in which the capability must operate.

Capability IDs `CAP-IR-###` are assigned for downstream reference in `UCOS-IR-0002` (Realization Matrix). Each
row carries the baseline classification (EXISTING / IMPLICIT / PROPOSED / STATED-REQUIREMENT / MISSING→closed)
from `UCOS-REQ-0001` as amended by `UCOS-REQ-0005/0006` and `UCOS-AUDIT-0004`.

---

## 2. Governance & Constitutional classes (RC-001 … RC-020)

| RC | CAP-IR | Required Capability | Required Outcome | Required Behavior | Baseline class. |
|----|--------|---------------------|------------------|-------------------|:---------------:|
| RC-001 | CAP-IR-001 | Compose commerce/arbitrary governed platforms from metadata, not rebuild | A platform stands up by composition with intent→running traceability | Domain-driven, metadata-configurable, contract-first | EXISTING |
| RC-002 | CAP-IR-002 | Enforce a supreme immutable Authority + 16-Part Constitution over all artifacts | No artifact contradicts a higher-precedence artifact | Non-waivable S1/S3/S4; precedence-ordered | EXISTING |
| RC-003 | CAP-IR-003 | Derive architecture top-down in acyclic, technology-neutral layers | Each layer ratified before the next | Enterprise→Domain→Capability→Information→Data→Platform | EXISTING |
| RC-004 | CAP-IR-004 | Govern all change by Approval-By-Exception with gate control | Every decision recorded on `AUTH-012`; gates pass | Append-only, single-owner, escalation-terminal at Board | EXISTING *(chain reconciled; attestation pending)* |
| RC-005 | CAP-IR-005 | Principal-agnostic identity & access (human/service/agent/tenant) | Every principal authenticable & authorizable | Open `kind`; authn/authz/tenancy | EXISTING |
| RC-006 | CAP-IR-006 | Evaluate trust as a runtime attribute-driven property | Effective trust computed; deny-by-default | Federated clamping; deny-by-default | EXISTING |
| RC-007 | CAP-IR-007 | Federate instances by contract with no shared mutable model | Independent instances compose; partitions fail-closed | Local sovereignty, clamped trust, namespace isolation | EXISTING |
| RC-008 | CAP-IR-008 | Provide a governed knowledge fabric (versioned, Evolution-write) | Knowledge records versioned & read-governed | Write only via Evolution; read-governed | EXISTING |
| RC-009 | CAP-IR-009 | Provide a governed tiered memory fabric | Working/short/long/semantic/episodic/federated memory | Retention + audit-preserving forgetting | IMPLICIT *(impl; attestation pending)* |
| RC-010 | CAP-IR-010 | Provide a governed ontology (semantic-schema) fabric | Entity/relationship/taxonomy/constraint typing substrate | Governed evolution; shared typing | IMPLICIT *(impl; not yet consumed as universal type system)* |
| RC-011 | CAP-IR-011 | Represent value/assets/treasury/marketplace/settlement | Value flows conserve, are atomic, non-negative | Value-model-agnostic; Evolution-only commit | PROPOSED (design-only) |
| RC-012 | CAP-IR-012 | Model civilizations/institutions/populations as bounded constructs | Civilization objects governed, non-actuating | Aggregate-only population; non-actuation | PROPOSED (deferred `AD-0014`) |
| RC-013 | CAP-IR-013 | Route all durable mutation through a single Evolution fabric | One commit path; migration-only history | Append-only, backward-compatible, sole commit path | EXISTING |
| RC-014 | CAP-IR-014 | Zero-trust, least-privilege, deny-by-default security | S1/S3/S4/S6 enforced; STRIDE controls mapped | 20 controls ↔ 62 threats; non-waivable | EXISTING |
| RC-015 | CAP-IR-015 | Operate every capability in production (observability/resilience/delivery) | Production operability designed-in | First-class ops domains | EXISTING |
| RC-016 | CAP-IR-016 | First-class compliance & assurance | Verification/audit/evidence/conformance | Inherited classification | EXISTING |
| RC-017 | CAP-IR-017 | Certify production-readiness at every increment | No increment "done" until gates pass | Designed-in, never assumed | EXISTING |
| RC-018 | CAP-IR-018 | Scale horizontally-first across open tiers | T1→T4+ by extension not redesign | State externalized to SoR/cache | EXISTING *(bounded ~10⁶)* |
| RC-019 | CAP-IR-019 | Impose no architectural ceiling; extend by registration/composition | New domains/services/models added additively | Never foundation redesign (INV-13) | EXISTING |
| RC-020 | CAP-IR-020 | Governed admission protocol for unknown-future requirement classes | New classes enter by registration | Requirements-level "Unknown Future" gate | STATED-REQUIREMENT (`UR-ALIGN-06`) |

---

## 3. Universal Primitive classes (RC-021 … RC-028)

| RC | CAP-IR | Required Capability | Required Outcome | Required Behavior | Baseline class. |
|----|--------|---------------------|------------------|-------------------|:---------------:|
| RC-021 | CAP-IR-021 | Represent any reality substrate as orthogonal context | Physical/virtual/simulated/hybrid/nested attachable | Reality is context, not assumption | IMPLICIT / PROPOSED (INV-17 resolved) |
| RC-022 | CAP-IR-022 | Represent everything as an Entity (4 construct kinds) | Particle→civilization representable, 0 scale fields | Recursive composition; scale-invariant | EXISTING *(verified)* |
| RC-023 | CAP-IR-023 | Confer stable, verifiable, locality-independent identity | Every construct bears identity; `kind` open | Identity ≠ authority/meaning | EXISTING |
| RC-024 | CAP-IR-024 | Represent everything as a governed registry/metadata resource | Any runtime object is a governed record | Reserved keyspace; registry/metadata-absolute | EXISTING *(object layer)* |
| RC-025 | CAP-IR-025 | Expose capabilities realized by contract-bound services | New capability = descriptor + provider, 0 core change | Contract-bound realization | EXISTING |
| RC-026 | CAP-IR-026 | Relate everything across all relationship classes | Directed/hierarchical/networked/semantic edges | Structural classes first-class | EXISTING *(structural; temporal/causal now STATED)* |
| RC-027 | CAP-IR-027 | Carry state/version/lifecycle/history for every construct | Append-only history; projectable future | Single universal lifecycle | EXISTING *(projection via unbuilt SIM)* |
| RC-028 | CAP-IR-028 | Treat events/signals/transitions as first-class | Classified, owned, governed, audited events | Open classification vocabulary | EXISTING |

---

## 4. Platform, Civilization & Unboundedness classes (RC-029 … RC-034)

| RC | CAP-IR | Required Capability | Required Outcome | Required Behavior | Baseline class. |
|----|--------|---------------------|------------------|-------------------|:---------------:|
| RC-029 | CAP-IR-029 | Create/govern arbitrary platform classes by composition | Any platform class (ERP/CRM/exchange/…) composable | Explicit factory catalog (MISSING) over INV-13 mechanism | IMPLICIT *(mechanism)*; catalog MISSING |
| RC-030 | CAP-IR-030 | Model individual→multi-planet civilization as constructs | Civilization scales as governed objects | Non-actuating governed/simulation | PROPOSED |
| RC-031 | CAP-IR-031 | Be scale/domain/platform/entity/temporal/future-agnostic | No constitutional redesign to extend | Additive-only (INV-13 + INV-14..20 proposed) | PROPOSED *(partial EXISTING)* |
| RC-032 | CAP-IR-032 | Onboard unknown domains via Meta-Core registration | New domain = additive fabric | Never L0–L13 redesign | PROPOSED |
| RC-033 | CAP-IR-033 | Supreme single immutable authority hierarchy | Terminal Authority Board; enumerated powers | Ideally one universal Authority primitive (duplicated today) | EXISTING *(model)* / PROPOSED *(universal primitive)* |
| RC-034 | CAP-IR-034 | Preserve local sovereignty of each node/domain | Foreign constructs advisory/deny-only | Never override local single-owner SoR | IMPLICIT |

---

## 5. Continuity, Provenance, Execution, Learning & Discovery classes (RC-035 … RC-041)

| RC | CAP-IR | Required Capability | Required Outcome | Required Behavior | Baseline class. |
|----|--------|---------------------|------------------|-------------------|:---------------:|
| RC-035 | CAP-IR-035 | Continue data plane on last-known-good during outage | Static stability under partition | Control-plane outage never forces violation | EXISTING |
| RC-036 | CAP-IR-036 | Trace origin/lineage of every construct | Entity→…→Authority lineage; provenance envelopes | Unified audit/provenance (proposed) | EXISTING *(lineage)* / PROPOSED *(unify)* |
| RC-037 | CAP-IR-037 | Record change/audit on append-only hash-chained ledgers | Tamper-evident, offline-verifiable, reconcilable | Universal ledger (6× duplicated today) | EXISTING *(per-fabric)* |
| RC-038 | CAP-IR-038 | Execute deterministically (or quarantine non-determinism) | Auditable, idempotent, bounded-failure execution | 17 execution models; governed recovery | EXISTING |
| RC-039 | CAP-IR-039 | Govern cognition (reasoning/inference/planning/decision) | Propose-not-act, explainable cognition | Determinism-quarantined; Evolution-only commit | IMPLICIT *(design-ratifiable; unbuilt)* |
| RC-040 | CAP-IR-040 | Sandboxed what-if/projection/digital-twin simulation | Forecasts advisory, never facts | Non-actuating; sandboxed | IMPLICIT *(design; unbuilt)* |
| RC-041 | CAP-IR-041 | Governed discovery of constructs/capabilities/services | Runtime registration + metadata + query | Governed discovery | IMPLICIT |

---

## 6. Infrastructure, Observability, Assurance & Meta-System classes (RC-042 … RC-045)

| RC | CAP-IR | Required Capability | Required Outcome | Required Behavior | Baseline class. |
|----|--------|---------------------|------------------|-------------------|:---------------:|
| RC-042 | CAP-IR-042 | Technology-neutral infrastructure bound via neutral ADRs | Runtime/persistence/messaging via open contracts | K8s/S3/Kafka/OIDC/OCI/HCL neutral | EXISTING |
| RC-043 | CAP-IR-043 | Make everything measurable/traceable/operable | Logs/metrics/traces/health as design inputs | Observability designed-in (PE-12 product open) | EXISTING *(partial)* |
| RC-044 | CAP-IR-044 | Gate every architecture layer with independent assurance | Per-layer RAT/AUD/CERT | Evidence-based assurance | EXISTING |
| RC-045 | CAP-IR-045 | Be self-describing & self-governing (reflexive Meta-Core) | System describes/governs itself | Registry+Metadata+Config+Policy+Governance reflexive | EXISTING |

---

## 7. Unknown, Emergent, Self-Extension & Meta classes (RC-046 … RC-050)

| RC | CAP-IR | Required Capability | Required Outcome | Required Behavior | Baseline class. |
|----|--------|---------------------|------------------|-------------------|:---------------:|
| RC-046 | CAP-IR-046 | Admit currently-unknown requirements via reserved construct | Unknown-future entity representable | No presumption of completeness | PROPOSED |
| RC-047 | CAP-IR-047 | Detect/record/govern emergent requirements | Gap-as-first-class-artifact | Emergent detection (not formalized) | PROPOSED |
| RC-048 | CAP-IR-048 | Admit new discovery classes without redesign | ≡ RC-020 admission gate | Requirements-layer companion | STATED-REQUIREMENT |
| RC-049 | CAP-IR-049 | Self-extend via registration/metadata/composition | Zero core-dir change (proven PI-4..11) | Additive extension | IMPLICIT *(demonstrated)* |
| RC-050 | CAP-IR-050 | Govern/version/trace requirements themselves | Requirements are append-only ratified artifacts | Meta-requirements governance (no registry yet) | IMPLICIT |

---

## 8. Temporal & Spatial-Temporal classes (RC-051 … RC-058)

| RC | CAP-IR | Required Capability | Required Outcome | Required Behavior | Baseline class. |
|----|--------|---------------------|------------------|-------------------|:---------------:|
| RC-051 | CAP-IR-051 | Model time as first-class dimension | Valid-time + transaction-time + ordering | Transaction-time append-only (INV-10) | STATED-REQUIREMENT (`UCOS-REQ-0005`) |
| RC-052 | CAP-IR-052 | Tolerate relativistic/latency-divergent time | No global-now assumption | Causal/logical clocks; async signed-quorum | STATED-REQUIREMENT |
| RC-053 | CAP-IR-053 | Model spatial-temporal locality (where+when) | (locality × time) addressable | Additive on `O-15`; temporal/causal relations first-class | STATED-REQUIREMENT |
| RC-054 | CAP-IR-054 | Support multiple reconcilable reference frames | Per-frame ordering; federated reconciliation | Single-SoR per (domain, frame) | STATED-REQUIREMENT |
| RC-055 | CAP-IR-055 | Represent planetary/oceanic reality of record | Physical realities as entities/habitats | Additive on `O-10` | STATED-REQUIREMENT |
| RC-057 | CAP-IR-057 | Century-scale time continuity | Crypto-agility, ledger longevity, succession | Migration-only re-anchoring | STATED-REQUIREMENT |
| RC-058 | CAP-IR-058 | Temporal governance (effective dating, time-scoped authority) | Decisions carry valid-time; lapse fail-closed | Deterministic temporal precedence | STATED-REQUIREMENT |

> RC-056 (Simulation/Alternate Reality) is catalogued in §9 alongside cognition/ethics as it is realized by the
> Simulation fabric.

---

## 9. Foundational, Semantic, Ethical & Resilience classes (RC-056, RC-059 … RC-067)

| RC | CAP-IR | Required Capability | Required Outcome | Required Behavior | Baseline class. |
|----|--------|---------------------|------------------|-------------------|:---------------:|
| RC-056 | CAP-IR-056 | Represent simulated/alternate/nested realities | Sandboxed alternate realities governed | Non-actuating sandbox | PROPOSED |
| RC-059 | CAP-IR-059 | Rest on formal mathematical substrate | Checkable invariants derivable | Sets/categories/algebras/order/type/logic | EXISTING *(referenced, not formalized)* |
| RC-060 | CAP-IR-060 | Express governance as formal evaluable logic | Policies deny-by-default, priority-ordered | Extensible predicate vocabulary (hard-coded today) | EXISTING *(bounded vocab)* |
| RC-061 | CAP-IR-061 | Ground meaning in canonical glossary/ontology | Constructs semantically typed | Identity ≠ meaning | IMPLICIT *(not yet consumed as type system)* |
| RC-062 | CAP-IR-062 | Contract-first, tolerant, possibly-delayed communication | Cross-boundary comms versioned & partition-tolerant | Never assumed instantaneous | IMPLICIT |
| RC-063 | CAP-IR-063 | Model cognition profile as actor attribute | Intelligence is attribute, not substrate | No "consciousness" claim | PROPOSED |
| RC-064 | CAP-IR-064 | Govern ethical constraints | Non-actuation, population privacy, human-in-loop | Rights non-enforceable-at-model-level | PROPOSED |
| RC-065 | CAP-IR-065 | Provably bound autonomous actors | Propose-not-act; no self-goals/self-mod/actuation | Non-Actuation (INV-CORE-12) enrolled before PI-10 | STATED-REQUIREMENT (`UCOS-REQ-0006`) |
| RC-066 | CAP-IR-066 | Enumerate threats (STRIDE) mapped to controls | 0 residual High/High per fabric | Re-scored per fabric | IMPLICIT *(per-fabric)* |
| RC-067 | CAP-IR-067 | Be anti-fragile (fail-closed, static stability) | Bounded blast radius; graceful degradation | Recovery by forward migration | IMPLICIT |

---

## 10. Capability-class rollup

| Capability tier | RC classes | Count | Dominant realization posture |
|-----------------|-----------|:-----:|------------------------------|
| **Substrate/control capabilities** (identity, trust, policy, registry, metadata, config, execution, evolution, event, state, security, meta-system) | RC-005/006/013/014/022/023/024/025/026/027/028/038/045/060 | 14 | EXISTING + implemented |
| **Governance/assurance capabilities** | RC-002/003/004/016/017/033/037/044/066 | 9 | EXISTING (authority-chain attestation pending) |
| **Foundational primitives (nine)** realized | RC-007/008/009/010/013/023/024/034/036/041/049 | — | Implemented; convergence debt (audit/authority/lifecycle duplicated) |
| **Behavioral/higher-order capabilities** (cognition, simulation, economic, civilization) | RC-011/012/030/039/040/056/063/064 | 8 | PROPOSED / design-only / unbuilt |
| **Temporal capabilities** | RC-051/052/053/054/055/057/058 | 7 | STATED-REQUIREMENT; unbuilt |
| **Alignment/unknown-future capabilities** | RC-020/048/065/046/047 | 5 | STATED-REQUIREMENT; enrollment/build pending |
| **Vision/scale/extensibility capabilities** | RC-001/018/019/029/031/032/059/061/062/067/015/035/042/043/050 | — | EXISTING mechanism; catalog/temporal caveats |

**Reserved (undefined):** RC-068 … RC-100 — no capability of record; governed by CAP-IR-020/048
(Unknown-Future Admission Protocol).

---

## 11. Determination

Every one of the **67 ratified requirement classes maps to a named required capability, outcome, and behavior**
(CAP-IR-001 … CAP-IR-067). No requirement class lacks a capability statement. The reserved identifier span
**RC-068..RC-100 is constitutionally accounted for** by the Unknown-Future Admission Protocol capability
(CAP-IR-020/048) rather than by inventing classes.

The capability set partitions cleanly into a **realized substrate/control/governance core** (implemented at
269/269 tests), a **primitive layer with convergence debt** (audit/authority/lifecycle capabilities duplicated
rather than unified), and a **behavioral/temporal/alignment frontier** that is stated-of-record but **unbuilt or
unenrolled**. This partition is the input to the Capability Realization Matrix (`UCOS-IR-0002`).

> **Scope discipline.** No requirement, capability, governance, or authority artifact was modified. `INV-1..13`,
> `AUTH-012`, `AD-0014`, and the Article IX generation lock are unchanged. This is a mapping assessment only.

## 12. Traceability

- **Maps:** `UCOS-REQ-0001` (RC-001..067) as amended by `UCOS-REQ-0005` (temporal), `UCOS-REQ-0006` (alignment), `UCOS-AUDIT-0004` (completeness re-evaluation).
- **Anchors:** `UCOS-REQ-0004` (universal capabilities), `UCOS-REQ-0003` (principles), `UCOS-AUDIT-0002` (traceability matrix).
- **Refined by:** `UCOS-IR-0002` (Capability Realization Matrix).
- **Owner:** UCOS Authority Board (disposition).

**END `UCOS-IR-0001` — CONSTITUTIONAL CAPABILITY CATALOG · 67/67 RC CLASSES → CAP-IR-001..067 · RC-068..100 RESERVED (ADMISSION-PROTOCOL-ACCOUNTED) · ASSESSMENT ONLY.**
