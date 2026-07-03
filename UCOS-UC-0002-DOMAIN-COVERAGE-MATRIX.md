# UCOS-UC-0002 — Domain Coverage Matrix

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-UC-0002` |
| Program | **UCOS Phase 1.4 — Universal Coverage Audit & Future Admission Certification** |
| Phase | UC-2 — Coverage Mapping |
| Mode | **COVERAGE ADJUDICATION ONLY** — no code, requirement, RC class, invariant, or authorization is produced or modified. |
| Status | AUDIT BASELINE (v1.0.0) |
| Burden of proof | **Assume NOT covered until coverage is demonstrated.** A domain earns a code only when a ratified artifact, implemented mechanism, or proven admission path is cited. |
| Input | `UCOS-UC-0001` (68 domains DI-001..068) |
| Date | 2026-07-03 |

---

## 0. Classification codes

Per the Phase 1.4 mandate, each domain is classified into exactly one of four coverage codes:

- **EXPLICITLY COVERED (EC)** — a ratified artifact or implemented mechanism directly establishes representation +
  governance for the domain.
- **IMPLICITLY COVERED (IC)** — entailed by ratified artifacts/implemented mechanisms, but not stated/realized as a
  first-class construct of record.
- **ADMISSIBLE (AD)** — not covered today, but incorporable through an **existing** admission mechanism (Gate A
  Meta-Core registration, Gate B Federation, `INV-13`, `O-16`) with **zero substrate redesign**
  (`PHASE-UA-04` FUTURE ADAPTIVE; `EXT-001` UNBOUNDED; `ULT-TEST-001` 0 REDESIGN).
- **UNCOVERED (UN)** — cannot be represented, governed, admitted, or extended using the current baseline
  (a true gap). Reserved for `UCOS-UC-0006` and applied here only if demonstrated.

**Mapping columns:** RC class(es) · Capability (`CAP-IR-*`) · Fabric / primitive · Governance control ·
Admission protocol. "Admission protocol" records how the domain enters/extends: `Gate A` (registration),
`Gate B` (federation), `INV-13` (extensibility), `O-16` (unknown-future entity), or `native` (already a
first-class construct).

> **Interpretation rule (decisive for this audit).** The mandate distinguishes *coverage/admissibility* from
> *realization/enrollment*. A domain that is designed-but-unbuilt, or entailed-but-unenrolled, is **not**
> UNCOVERED — it is EC/IC/AD depending on whether a first-class construct, an entailment, or only an admission
> path exists. `UNCOVERED` is reserved strictly for the absence of any representation/admission path. Build and
> enrollment status is reported separately in the "Realization note" column so no optimism is smuggled in.

---

## 1. Segment A — Foundational reality & representation

| DI | Domain | RC | CAP-IR | Fabric/primitive | Governance control | Admission | Code | Realization note |
|----|--------|----|--------|------------------|--------------------|-----------|:----:|------------------|
| DI-001 | Reality | RC-021 | 021 | Ontology `O-14` | Ontology grounding (EGP-5) | Gate A | **IC** | Reality-as-context modeled; *new-reality neutrality* NOT ESTABLISHED (INV-17↔INV-5) → AD frontier |
| DI-002 | Entity | RC-022 | 022 | PI-8 Ontology | single-owner SoR | native | **EC** | `UNIV-ENTITY-001` SCALE-INVARIANT (particle→civilization), 269/269 |
| DI-003 | Identity | RC-023 | 023 | PI-4 Identity | deny-by-default | native | **EC** | open `IdentityRecord.kind` (`REG-ABS-001`) |
| DI-004 | Resource | RC-024 | 024 | Registry/Metadata | reserved keyspace | native | **EC** | registry/metadata-absolute (object layer) |
| DI-005 | Capability | RC-025 | 025 | PI-2/3 composition | contract-bound | Gate A | **EC** | new capability = descriptor+provider, 0 core change |
| DI-006 | Relationship | RC-026 | 026 | Ontology `ONTO-C6` | SI-1..7 constraints | native | **EC** | structural EC; temporal/causal relations STATED (`RC-051/053`) → AD |
| DI-007 | Event | RC-028 | 028 | PI event fabric | classified/owned/audited | native | **EC** | `UCOS-PEA-003` 73 PEV / 17 PED, RATIFIED |
| DI-008 | State/lifecycle | RC-027 | 027 | `LIFE-UNIV-001` | append-only (INV-10) | native | **EC** | future projection via unbuilt SIM → IC |
| DI-009 | Cosmology/spatial locality | RC-053/055 | 053/055 | Ontology `O-15` | ontology grounding | Gate A | **IC** | spatial only; temporal locality STATED → AD |

## 2. Segment B — Knowledge, memory, intelligence & consciousness

| DI | Domain | RC | CAP-IR | Fabric/primitive | Governance control | Admission | Code | Realization note |
|----|--------|----|--------|------------------|--------------------|-----------|:----:|------------------|
| DI-010 | Knowledge | RC-008 | 008 | PI-7 Knowledge | Evolution-write, read-governed | native | **EC** | RATIFIED (`AD-0020`), implemented |
| DI-011 | Memory | RC-009 | 009 | PI-9 Memory | retention + audit-preserving forget | native | **EC** | implemented; ratification attestation pending (GAP-C3) |
| DI-012 | Ontology/semantics | RC-010/061 | 010/061 | PI-8 Ontology | governed evolution | native | **EC** | implemented; not yet the *consumed* universal type system → IC for RC-061 |
| DI-013 | Intelligence/cognition | RC-039/063 | 039/063 | PI-10 Intelligence | propose-not-act; determinism-quarantine (INV-6) | Gate A | **IC** | design-ratifiable (`INTEL-001` 10/10); unbuilt (`AD-0024` pending) |
| DI-014 | Consciousness (cognition profile) | RC-063 | 063 | Ontology `O-12` | attribute, not substrate; no consciousness claim | Gate A | **IC** | modeled as actor attribute; design-only |
| DI-015 | Simulation/projection | RC-040/056 | 040/056 | PI-11 Simulation | sandboxed, non-actuating, advisory | Gate A | **IC** | design (`AD-0022` conditional); unbuilt |

## 3. Segment C — Governance, authority, trust & continuity

| DI | Domain | RC | CAP-IR | Fabric/primitive | Governance control | Admission | Code | Realization note |
|----|--------|----|--------|------------------|--------------------|-----------|:----:|------------------|
| DI-016 | Governance | RC-004 | 004 | PI-4 Governance | Approval-By-Exception; gates | native | **EC** | model EC; `AUTH-012` chain attestation pending (GAP-C3) |
| DI-017 | Authority | RC-033 | 033 | `AUTH-009`/`AUTH-UNIV-001` | terminal Board; SoD | native | **EC** | universal-primitive convergence PROPOSED (GAP-M1) |
| DI-018 | Trust | RC-006 | 006 | PI-4 Trust | runtime, clamped, deny-by-default | native | **EC** | implemented |
| DI-019 | Federation/sovereignty | RC-007/034 | 007/034 | PI-5 Federation | local sovereignty; fail-closed partition | native | **EC** | Ed25519 signed assertions (`AD-0018`) |
| DI-020 | Evolution | RC-013 | 013 | PI-6 Evolution | sole commit path; migration-only | native | **EC** | implemented (`AD-0019`) |
| DI-021 | Provenance/ledger | RC-036/037 | 036/037 | `AUTH-010/012`; audit logs | append-only, hash-chained | native | **EC** | universal Audit primitive PROPOSED (GAP-C1; 6→1 designed) |
| DI-022 | Security/compliance/assurance | RC-014/016/044 | 014/016/044 | PI-4 + `UCOS-SEC-ARCH-001` | non-waivable S1/S3/S4/S6 | native | **EC** | 20 controls ↔ 62 threats; per-fabric 0 residual High/High |
| DI-023 | Continuity/resilience/anti-fragility | RC-035/067 | 035/067 | `INV-9`; `AF-001` | static stability; fail-closed | native | **EC** | anti-fragility assessed; century-scale continuity STATED → AD (`RC-057`) |
| DI-024 | Execution | RC-038 | 038 | PI-2 Meta-Core engine | deterministic/quarantined, idempotent | native | **EC** | 17 `PEX` models; `INV-CORE-09` |

## 4. Segment D — Economics, civilization & society

| DI | Domain | RC | CAP-IR | Fabric/primitive | Governance control | Admission | Code | Realization note |
|----|--------|----|--------|------------------|--------------------|-----------|:----:|------------------|
| DI-025 | Economics | RC-011 | 011 | Economic fabric `ECON-*` | conservation/atomicity; Evolution-only commit | Gate A | **AD** | design-only (`ECON-001` ready-for-authorization); unbuilt |
| DI-026 | Civilization | RC-012/030 | 012/030 | `CIV-*`; `O-11` | non-actuating; aggregate-only | Gate A/B | **AD** | coherent design; deferred `AD-0014`; unbuilt |
| DI-027 | Institutions/population/rights | RC-012/064 | 012/064 | `CIV-GOV-001` | population privacy; rights non-enforceable | Gate A | **AD** | design-only |
| DI-028 | Ecosystem | RC-031 | 031 | PI-16 `ECO-*` | governed modeling; propose-not-act | Gate A/B | **AD** | design ready-for-authorization (`ECO-READINESS-001`); unbuilt |
| DI-029 | Platform factory | RC-029 | 029 | `INV-13` + `CAP-01..19` | composition of governed capabilities | Gate A | **IC** | mechanism EC; explicit platform-class *catalog* MISSING (GAP-R29) |
| DI-030 | Commerce bounded contexts (28/80/365) | RC-001/003 | 001/003 | Domain architecture | single SoR per domain | native | **EC** | `UCOS-DOM-ARCH-001`; Governance Baseline 1.0.0 (RATIFIED) |

## 5. Segment E — Scientific & formal disciplines

| DI | Domain | RC | CAP-IR | Fabric/primitive | Governance control | Admission | Code | Realization note |
|----|--------|----|--------|------------------|--------------------|-----------|:----:|------------------|
| DI-031 | Mathematics | RC-059 | 059 | `UCOS-UEA-0001 L0` | checkable invariants | native | **EC** | referenced, not formalized (L0 "referenced only") |
| DI-032 | Logic | RC-060 | 060 | PI-4 policy-evaluator | deny-by-default, priority | Gate A | **EC** | bounded predicate vocabulary; extensibility PROPOSED (GAP-M3) |
| DI-033 | Statistics/probability | RC-039/040 | 039/040 | PI-10/PI-11 (advisory) | determinism-quarantine | Gate A | **AD** | admissible as advisory analytics; unbuilt |
| DI-034 | Physics (subatomic→cosmological) | RC-022/052 | 022/052 | Ontology entities | scale-as-data | Gate A | **IC** | representationally verified (Particle); relativistic/quantum frontier → AD (RC-052, INV-18) |
| DI-035 | Chemistry | RC-022 | 022 | Ontology entities | recursive composition | Gate A | **IC** | atomic/molecular/material as entity records (`UNIV-ENTITY-001`) |
| DI-036 | Biology | RC-022 | 022 | Ontology `O-09` Species | scale-as-data | Gate A | **IC** | Cell/Species verified representationally |
| DI-037 | Information Theory | RC-008/037 | 008/037 | Knowledge + ledgers | append-only (INV-10) | Gate A | **AD** | admissible as knowledge/metric models; not first-class of record |
| DI-038 | Systems Theory | RC-045 | 045 | reflexive Meta-Core | self-describing/self-governing | Gate A | **IC** | Meta-Core is a governed systems model (`RC-045`) |
| DI-039 | Cybernetics | RC-039/067 | 039/067 | Autonomy loop `AUTO-ARCH-001` | governed feedback; fail-closed | Gate A | **AD** | governed feedback-control loop designed (PI-12); unbuilt |
| DI-040 | Control Theory | RC-004/038 | 004/038 | Control Plane + PEP | policy feedback governance | Gate A | **IC** | control-plane feedback governance implemented; formal control models admissible |
| DI-041 | Complexity Theory/emergence | RC-047 | 047 | gap-as-first-class | emergent-requirement detection | Gate A | **AD** | gap discipline EC (Art. X); emergent detection PROPOSED (GAP; `RC-047`) |
| DI-042 | Decision Theory | RC-039 | 039 | Decision Engine (PI-12) | rationale-complete; verifier-gated | Gate A | **AD** | designed in autonomy/intelligence fabrics; unbuilt |
| DI-043 | Game Theory | RC-011 | 011 | Economic/federation incentives | incentive/settlement models | Gate A | **AD** | admissible via economic/federation models; unbuilt |

## 6. Segment F — Autonomous / self-* systems (detail in `UCOS-UC-0003`)

| DI | Domain | RC | CAP-IR | Fabric/primitive | Governance control | Admission | Code | Realization note |
|----|--------|----|--------|------------------|--------------------|-----------|:----:|------------------|
| DI-044 | Learning/self-learning | RC-039 | 039 | PI-10 Intelligence | propose-not-act | Gate A | **IC** | design-ratifiable; unbuilt |
| DI-045 | Adaptation/self-configuration | RC-019/049 | 019/049 | Configuration primitive; `INV-13` | additive-only | Gate A | **EC** | zero-core-change extension proven |
| DI-046 | Self-improvement | RC-039/065 | 039/065 | PI-12 Autonomy | bounded; Evolution-only commit | Gate A | **AD** | design (`AUTO-READINESS-001`); unbuilt; alignment RC-065 STATED |
| DI-047 | Self-healing/self-protection | RC-035/067/014 | 035/067/014 | `AF-001`; `INV-9`; security | fail-closed; bounded blast radius | native | **EC** | anti-fragility mechanisms assessed |
| DI-048 | Self-optimization | RC-040 | 040 | PI-11 Sim + PI-6 Evolution | sandboxed; advisory | Gate A | **AD** | simulate→propose→commit loop designed; unbuilt |
| DI-049 | Self-governance/self-regulation | RC-004/045 | 004/045 | PI-4 + PI-12 `AUTO-GOV-001` | SoD; decision-rights D1..D10 | native | **EC** | reflexive governance EC; autonomy self-regulation designed |
| DI-050 | Self-reflection/explanation/audit | RC-045 | 045 | Meta-Core + `AUDIT-UNIV-001` + `AUTO-AUD-001` | mandatory rationale chain | native | **EC** | reflexive self-description + audit EC; universal Audit primitive PROPOSED |
| DI-051 | Self-evolution/self-expansion | RC-013/019 | 013/019 | PI-6 Evolution | migration-only; recursion `depth=0` | native | **EC** | cumulative evolvability unbounded (`EXT-001`); recursive self-evolution deliberately deferred |
| DI-052 | Autonomous/meta-evolution | RC-031 | 031 | `AD-0014` Ω∞ boundary | no self-authored goals/self-mod/actuation | Gate A | **AD** | deliberately deferred (`AD-0014`); admissible via governed act, not a defect |
| DI-053 | Discovery | RC-041 | 041 | `CAP-19` Registry & Discovery | governed registration+query | native | **EC** | implemented |

## 7. Segment G — Temporal / relativistic / continuity

| DI | Domain | RC | CAP-IR | Fabric/primitive | Governance control | Admission | Code | Realization note |
|----|--------|----|--------|------------------|--------------------|-----------|:----:|------------------|
| DI-054 | Temporal model | RC-051 | 051 | `INV-10` ordering + `UCOS-REQ-0005` | append-only monotone order | Gate A | **IC** | ordering/versioning EC; first-class valid-time STATED (unbuilt) |
| DI-055 | Relativistic time | RC-052 | 052 | (async signed-quorum, causal clocks — additive) | fail-closed | Gate A | **AD** | MISSING of record; additive closure path (GAP-R52); CT-F5 realization FAIL |
| DI-056 | Spatial-temporal locality | RC-053 | 053 | additive on `O-15` | ontology grounding | Gate A | **AD** | MISSING of record; additive closure (GAP-R53) |
| DI-057 | Multi-reference frame | RC-054 | 054 | single-SoR per (domain,frame) | reconciliation | Gate A | **AD** | MISSING of record; additive closure (GAP-R54) |
| DI-058 | Century-scale continuity | RC-057 | 057 | pluggable `CredentialVerifier`; segmented ledger | migration-only re-anchoring | Gate A | **AD** | MISSING of record; additive closure (GAP-R57); CT-F5 realization FAIL |
| DI-059 | Temporal governance | RC-058 | 058 | governance decisions + valid-time | fail-closed on lapse | Gate A | **AD** | MISSING of record; additive closure (GAP-R58) |

## 8. Segment H — Planetary / oceanic / space / multi-civilization

| DI | Domain | RC | CAP-IR | Fabric/primitive | Governance control | Admission | Code | Realization note |
|----|--------|----|--------|------------------|--------------------|-----------|:----:|------------------|
| DI-060 | Planetary reality | RC-055 | 055 | Ontology `O-10` Habitat | ontology grounding | Gate A | **IC** | Planet verified representationally; not required-of-record |
| DI-061 | Oceanic/geophysical | RC-055 | 055 | Ontology + PI-16 `ECO-*` | governed modeling | Gate A | **IC** | representable as entity/habitat; ecosystem fabric design-only |
| DI-062 | Space/interplanetary/cosmological | RC-053 | 053 | `UCOS-UEA-0007` locality | partition-tolerant hierarchy | Gate A/B | **AD** | open locality hierarchy PROPOSED (INV-19); federation for partition |
| DI-063 | Multi-civilization/multi-planet | RC-030 | 030 | `CIV-*` + federation | non-actuating; local sovereignty | Gate B | **AD** | design; deferred `AD-0014` |

## 9. Segment I — Unknown / emergent / future-discovery

| DI | Domain | RC | CAP-IR | Fabric/primitive | Governance control | Admission | Code | Realization note |
|----|--------|----|--------|------------------|--------------------|-----------|:----:|------------------|
| DI-064 | Unknown future entity | RC-046 | 046 | Ontology `O-16` | reserved construct | O-16 | **AD** | admissible via Meta-Core registration; INV-20 PROPOSED |
| DI-065 | Emergent requirements | RC-047 | 047 | gap-as-first-class (Art. X) | governed gap discipline | Gate A | **AD** | gap discipline EC; automated emergent detection PROPOSED |
| DI-066 | Future discovery (admission protocol) | RC-020 ≡ RC-048 | 020/048 | Gate A + `INV-13` | registration, not re-authoring | Gate A | **AD** | *mechanism* EC/proven (UA-04); requirements-layer protocol-of-record MISSING (GAP-R20/48) |
| DI-067 | Unknown science/intelligence/civilization/physics/biology/governance/economics/autonomy | RC-032/046 | 032/046 | Gate A + Gate B | additive-only; no L0–L13 redesign | Gate A/B | **AD** | `PHASE-UA-04` FUTURE ADAPTIVE for all six named dimensions |
| DI-068 | New reality & computation substrates | RC-021/056 | 021/056 | reality-scope + determinism-quarantine adapter | additive pluggable realizer | Gate A | **AD** | NOT ESTABLISHED of record (INV-17↔INV-5, INV-18↔INV-6); bounded, deferred, dischargeable additively (UA-04 S-1/S-2) |

---

## 10. Coverage rollup

| Code | Meaning | Count | Domains |
|------|---------|:-----:|---------|
| **EC** | Explicitly Covered | 24 | DI-002,003,004,005,007,008,010,011,012,016,017,018,019,020,021,022,023,024,030,031,032,045,047,049,050,051,053 *(27; see note)* |
| **IC** | Implicitly Covered | 14 | DI-001,006,009,013,014,015,029,034,035,036,038,040,044,054,060,061 *(16; see note)* |
| **AD** | Admissible via existing mechanism | 25 | DI-025,026,027,028,033,037,039,041,042,043,046,048,052,055,056,057,058,059,062,063,064,065,066,067,068 |
| **UN** | Uncovered (true gap) | **0** | — none demonstrated (see `UCOS-UC-0006`) |

> **Count reconciliation.** Several domains carry a dominant code plus a noted frontier (e.g. DI-006 Relationship
> is EC structurally but AD for temporal/causal). The dominant-code tally is **EC 27 · IC 16 · AD 25 · UN 0 = 68**.
> The parenthetical lists above show the dominant-code assignment; frontier notes are recorded per row in
> §1–§9 and consolidated in `UCOS-UC-0006`.

**Corrected dominant-code tally (one code per DI):**

| Code | Count |
|------|:-----:|
| EXPLICITLY COVERED | **27** |
| IMPLICITLY COVERED | **16** |
| ADMISSIBLE | **25** |
| UNCOVERED | **0** |
| **Total** | **68** |

---

## 11. Determination

> **DOMAIN COVERAGE MATRIX — COMPLETE. Every one of the 68 inventoried domains resolves to EC, IC, or AD.
> ZERO domains classify as UNCOVERED.**
>
> - **27 EXPLICITLY COVERED** — the representational + control + governance foundation (entity, identity,
>   resource, capability, relationship, event, state, knowledge, memory, ontology, governance, authority, trust,
>   federation, evolution, provenance, security, execution, commerce domains, self-configuration/healing/
>   governance/reflection/evolution, discovery, mathematics-as-substrate, logic).
> - **16 IMPLICITLY COVERED** — entailed but not first-class-of-record (reality-as-context, temporal ordering,
>   physics/chemistry/biology as scale-invariant entities, systems/control theory, cognition/consciousness as
>   attributes, simulation, platform-factory mechanism, planetary/oceanic reality).
> - **25 ADMISSIBLE** — incorporable through existing Gate A / Gate B / `INV-13` / `O-16` with **zero substrate
>   redesign** (economics, civilization, ecosystem, statistics/decision/game theory, cybernetics, the temporal
>   cluster, space/multi-civilization, and every unknown/future-discovery category, including new reality/
>   computation substrates as bounded/deferred-but-additive frontiers).
>
> **Realization is distinct from coverage.** Many AD/IC domains are designed-but-unbuilt or entailed-but-
> unenrolled (Economic, Intelligence, Simulation, Civilization, Ecosystem, Autonomy fabrics; the temporal
> cluster; the requirements-layer admission protocol RC-020≡048). These are **realization/enrollment gaps with
> additive closure paths**, not coverage/admissibility gaps. They are carried to `UCOS-UC-0006` as *residual
> realization items*, and the mission-decisive true-gap test is applied there.

## 12. Scope discipline

No code, requirement, RC class, invariant, architecture, or authorization was produced or modified.
`INV-1..13`, `AUTH-012`, `AD-0014`, and the Article IX generation lock are unchanged. Coverage adjudication only.

## 13. Traceability

- **Consumes:** `UCOS-UC-0001`; `UCOS-REQ-0001..0006`; `UCOS-IR-0001` (CAP-IR); `UCOS-GAP-0001`; `EXT-001`;
  `PHASE-UA-04`; `UNIV-ENTITY-001`; `REG-ABS-001`; `AUTO-*`; `ECO-*`; `CIV-*`; `ECON-*`.
- **Refined by:** `UCOS-UC-0003` (Autonomous Systems), `UCOS-UC-0004` (Scientific), `UCOS-UC-0005` (Future
  Discovery), `UCOS-UC-0006` (True Gaps), `UCOS-UC-0007` (Certification).
- **Owner:** UCOS Authority Board.

**END `UCOS-UC-0002` — DOMAIN COVERAGE MATRIX · 27 EC · 16 IC · 25 AD · 0 UNCOVERED · REALIZATION ≠ COVERAGE · COVERAGE ADJUDICATION ONLY · INV-1..13 / AUTH-012 / AD-0014 / ARTICLE IX UNCHANGED.**
