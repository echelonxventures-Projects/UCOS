# RPF-0002 — UCOS Research Topic Registry

| Field | Value |
|-------|-------|
| Artifact ID | `RPF-0002` |
| Family | `RPF-*` |
| Version | 1.0.0 · 2026-07-02 |
| Mode | **DESIGN ONLY — NO CODE** |
| Governs | The authoritative register of research topics (`RT-*`), validated gaps (`GAP-*`), prior-art anchors (`PRIOR-*`), and claims (`CLAIM-*`) that feed the academic roadmap (`RPF-0005`). |
| Parent | `RPF-0001` §4 (Topic Discovery Engine), §5 (Gap Framework), §14 (Research Registry Architecture) |
| Status | CREATED — DESIGN — READY FOR AUTHORITY REVIEW; Article IX unchanged |

> Registry-driven per RGP-10. Scores use the §4.3 model (TS-1 Novelty, TS-2 Evidence readiness, TS-3 Community
> fit, TS-4 Strategic alignment, TS-5 Reproducibility feasibility, TS-6 Disclosure safety), each 1–5; weights are
> configuration. Every topic is anchored to a ratified UCOS artifact so no claim exceeds the reproduced platform
> state (RGP-1). Topic → Gap → Paper mapping drives `RPF-0005`.

---

## 1. Topic register (`RT-*`)

| ID | Title | Thesis | Evidence anchor (ratified/reproduced) | TS (1..6) | Σ | Gap | Paper |
|----|-------|:------:|----------------------------------------|-----------|:-:|:---:|:----:|
| RT-01 | Behavior-from-data: registry/metadata/configuration-driven platform architecture | THESIS-1 | Meta-Core + Registry/Metadata/Config runtimes; PI-4 §11B figures; 269/269 baseline | 5,5,5,5,5,5 | 30 | GAP-01 | P1 |
| RT-02 | Constitutional governance-as-code & the Article IX generation lock | THESIS-2 | `AUTH-001..012`, `UCOS-CONST-001` Art. IX, `AUTH-012` decision log, `UCOS-CONSTRUCTION-BLOCKED` | 5,5,4,5,4,5 | 28 | GAP-02 | P2 |
| RT-03 | A universal audit/provenance primitive for composable integrity | THESIS-4 | `AUDIT-UNIV-001` (6→1 reduction proof), hash-chained ledgers | 5,5,4,5,5,5 | 29 | GAP-03 | P3 |
| RT-04 | The Independent Proof Fabric: offline adversarial verifiability | THESIS-3 | `PROOF-IMPL-001` (B01), PI-5 Ed25519 assertions | 5,4,4,5,4,5 | 27 | GAP-04 | P4 |
| RT-05 | Fail-closed federation: locally-sovereign, clamped-trust, deny-by-default | THESIS-5 | `FED-*` design, PI-5 impl (90/90), `PI5-SEC-001` (16 attack vectors) | 5,5,4,4,5,5 | 28 | GAP-05 | P5 |
| RT-06 | Migration-only evolution as the sole durable-commit path | THESIS-6 | PI-6 Evolution (AD-0019), `PI6-*` reports | 5,4,4,4,4,5 | 26 | GAP-06 | P6 |
| RT-07 | Governed cognition: propose-not-act intelligence with a determinism quarantine | THESIS-7 | `INT-*` design, `INT-THREAT-001` (I1–I12, 0 residual High/High) | 5,3,4,5,3,5 | 25 | GAP-07 | P7 |
| RT-08 | Semantic integrity at runtime: governed ontology with DAG-taxonomy constraints | THESIS-1/4 | `ONTO-*`, `ONTO-RAT-001` (SI-1..7; O1–O12) | 4,4,4,4,4,5 | 25 | GAP-08 | P8 |
| RT-09 | Tiered, audit-preserving memory with governed forgetting | THESIS-4/6 | `MEM-*`, `MEM-RAT-003`; audit-preserving-forget rule | 4,4,4,4,4,5 | 25 | GAP-09 | P9 |
| RT-10 | Scale breakpoints of single-SoR determinism under latency (INV-5/INV-6) | THESIS-5 | `CIV-STRESS-001` (15 breakpoints; interplanetary tier) | 5,4,5,4,4,5 | 27 | GAP-10 | P10 |
| RT-11 | Scalable governance: subsidiarity tiers + risk-classified decision lanes | THESIS-2 | `PHASE-R7` `CIV-GOV-001` v1.1.0 (GT-0..3, Lanes A–C) | 4,4,4,4,4,5 | 25 | GAP-11 | P11 |
| RT-12 | Deterministic composition kernels: dependency-inverted capability graphs | THESIS-1 | Meta-Core (composition/execution engines); dynamic-capability test | 5,4,4,4,5,5 | 27 | GAP-12 | P12 |
| RT-13 | A reference model for governed, self-evolving platforms (synthesis) | ALL | Full UCOS corpus (PEA-001..007, fabrics PI-2..PI-11) | 5,4,4,5,4,5 | 27 | GAP-13 | P13 |
| RT-14 | Cross-organization proof & attestation exchange (standards) | THESIS-3/5 | `PROOF-*` export/import + `FED-*` federation trust | 5,3,4,5,4,5 | 26 | GAP-14 | P14 |
| RT-15 | Conservation-safe federated economic fabrics (non-actuating) | THESIS-5/6 | `ECON-*` design (ECON-001; conservation invariants) | 4,3,4,4,4,5 | 24 | GAP-15 | P15 |

Reserve topics (backlog, not in the 15): RT-16 non-actuating simulation as a safety pattern (`SIM-*`); RT-17
bounded civilization modeling & population privacy (`CIV-*`, AD-0014); RT-18 traceability as an architectural
invariant (`AUTH-010`, IC→CD→LD→PD lineage); RT-19 additive-only construction with test-green invariants;
RT-20 canonical platform invariants (`INV-CORE-001`).

## 2. Validated gaps (`GAP-*`)

| ID | Class (§5.1) | Gap statement | GV-1..5 | Distinctive UCOS evidence (GV-3) |
|----|:------------:|---------------|---------|----------------------------------|
| GAP-01 | G-EMPIRICAL | Extensibility-without-redeploy is claimed by config-driven systems but rarely *measured* against determinism/audit guarantees | ✔✔✔✔✔ | Reproduced composition throughput + zero-core-change capability addition |
| GAP-02 | G-THEORY | No formal model of "approval-by-exception" locks that keep an autonomous build safe & non-actuating | ✔✔✔✔✔ | Article IX lock + AD decision log + non-actuation proofs |
| GAP-03 | G-INTEGRATION | Audit and provenance are re-implemented per subsystem; integrity does not compose | ✔✔✔✔✔ | `AUDIT-UNIV-001` mechanical 6→1 reduction proof |
| GAP-04 | G-METHOD | No accepted method to verify a governed claim **offline** by an untrusting third party | ✔✔✔✔✔ | Pure verifier + detached multi-sig + evidence chain (`PROOF-*`) |
| GAP-05 | G-THEORY | Federation trust models rarely guarantee "worst case = no new capability, never silent compromise" | ✔✔✔✔✔ | Clamped trust, local-shadows-foreign, fail-closed partition; 16/16 attack vectors blocked |
| GAP-06 | G-METHOD | Change management rarely enforces a *single* provable commit path (migration-only) | ✔✔✔✔✔ | Evolution Fabric as sole commit path; backward-compat invariants |
| GAP-07 | G-THEORY | Bounding the blast radius of non-deterministic AI inside a deterministic governed system | ✔✔✔✔✔ | Determinism quarantine; propose-not-act; I1–I12 at 0 residual High/High |
| GAP-08 | G-INTEGRATION | Runtime semantic integrity (taxonomy acyclicity, disjointness) as a governed pre-commit gate | ✔✔✔✔✔ | `ONTO-*` SI-1..7 fail-closed constraints |
| GAP-09 | G-METHOD | Forgetting that is privacy-effective yet audit-preserving | ✔✔✔✔✔ | MEM audit-preserving-forget (value unrecallable, audit fact retained) |
| GAP-10 | G-SCALE | Single-SoR determinism (INV-5) + synchronous decisions (INV-6) unquantified vs inter-node latency | ✔✔✔✔✔ | `CIV-STRESS-001` breakpoint ladder to interplanetary tier |
| GAP-11 | G-THEORY | Centralized apex governance does not scale; no ratified subsidiarity+lane model | ✔✔✔✔✔ | `PHASE-R7` tier/lane design closing D-GOV/D-AUTH walls |
| GAP-12 | G-EMPIRICAL | Deterministic dependency-inverted composition performance is under-characterized | ✔✔✔✔✔ | Meta-Core resolve/compose/execute reproduced figures |
| GAP-13 | G-THEORY | No consolidated reference model for governed self-evolving platforms | ✔✔✔✔✔ | End-to-end UCOS corpus |
| GAP-14 | G-STANDARD | No standard format governs cross-org proof/attestation exchange | ✔✔✔✔✔ | `PROOF-*` bundle + federation import re-verification |
| GAP-15 | G-THEORY | Economic fabrics rarely enforce conservation as a fail-closed invariant with no real-money path | ✔✔✔✔✔ | `ECON-*` conservation/atomicity/idempotency at settlement gate |

## 3. Prior-art anchors (`PRIOR-*`, illustrative classes)

Each paper's manuscript must populate its `PRIOR-*` set with primary sources; the registry tracks the
*comparison classes* to guarantee GV-1 (real gap) and CG-4 (explicit prior-art comparison):

| Class | Comparison field (paper must cite primary sources) |
|-------|-----------------------------------------------------|
| PRIOR-CFG | Feature-flag / configuration-as-code / policy-as-code / model-driven engineering |
| PRIOR-GOV | Policy engines, deny-by-default authorization, software supply-chain governance |
| PRIOR-PROV | Provenance systems, transparency logs, verifiable logs, SBOM/attestation frameworks |
| PRIOR-VERIF | Verifiable computation, remote attestation, reproducible builds, zero-trust verification |
| PRIOR-FED | Federated systems, CRDTs, Byzantine/partition tolerance, trust delegation |
| PRIOR-EVOL | Schema migration, backward-compat/versioning, event sourcing, CQRS |
| PRIOR-AI | Neuro-symbolic governance, guardrails, tool-use safety, human-in-the-loop control |
| PRIOR-ONT | Description logics, ontology consistency, knowledge-graph integrity |
| PRIOR-MEM | Memory architectures, right-to-be-forgotten, retention/audit trade-offs |
| PRIOR-SCALE | Consensus latency bounds, CAP/PACELC, geo-distributed consistency |

## 4. Topic → Gap → Paper traceability

Every `RT-*` links to exactly one `GAP-*` (validated, §2) and exactly one roadmap paper `P1..P15` (`RPF-0005`),
satisfying RKG-INV-2 (no publication without a topic+gap ancestor). Reserve topics RT-16..20 have no assigned
paper yet and are backlog.

## 5. Governance

Topic authorization (RD-1), methodology (RD-2), and disclosure (RD-3) are Approval-Required (RAB). No topic may
be marked `active` without a validated `GAP-*`. Records are append-only; retirement/supersession only.

## Traceability
- **Parent:** `RPF-0001` §4/§5/§14. **Feeds:** `RPF-0005` (paper roadmap), RKG (`RPF-0001` §9).
- **Evidence anchors:** ratified UCOS artifacts cited per row (no claim exceeds reproduced state, RGP-1).
- **Owner:** Research Authority Board. Design only; Article IX unchanged.

**END RPF-0002 — RESEARCH TOPIC REGISTRY · 15 TOPICS + 5 RESERVE · 15 VALIDATED GAPS · DESIGN ONLY · NO CODE.**
