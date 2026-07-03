# RPF-0005 — UCOS Academic Roadmap (Papers 1–15)

| Field | Value |
|-------|-------|
| Artifact ID | `RPF-0005` |
| Family | `RPF-*` |
| Version | 1.0.0 · 2026-07-02 |
| Mode | **DESIGN ONLY — NO CODE** |
| Governs | The mandatory per-paper publication roadmap (P1–P15), plus the ≥ 50 industry-publication and ≥ 10 conference-paper plan and 5-year sequencing. |
| Parent | `RPF-0001` §20 (5-Year Roadmap); consumes `RPF-0002` (RT/GAP), `RPF-0003` (venues), `RPF-0004` (gates) |
| Status | CREATED — DESIGN — READY FOR AUTHORITY REVIEW; Article IX unchanged |

> Each paper below states its subject exactly against the ratified/reproduced UCOS state (RGP-1 / G-TRUTH). All
> venues are **target** venues subject to the JS-6 legitimacy re-check at submission; acceptance is not implied.
> Empirical papers ship a reproducibility package (RGP-3 / G-REPRO). Every paper traces `RT-* → GAP-* → CLAIM →
> evidence → PUB-*` in the Research Knowledge Graph.

---

## A. Paper roadmap (P1–P15)

### Paper 1 — Behavior-from-Data: A Registry/Metadata/Configuration-First Architecture for Infinitely Extensible Platforms
- **Topic/Gap:** RT-01 / GAP-01 (G-EMPIRICAL). **Year:** Y1. **Type:** Journal (+ ICSA precursor).
- **Problem statement.** Configuration-driven and model-driven systems claim extensibility without redeployment,
  but the *simultaneous* preservation of determinism, auditability, and zero hard-coded business logic is
  asserted more than measured. It is unclear whether a fully behavior-from-data core can add new capability at
  runtime with no core change while keeping composition deterministic.
- **Research gap.** No empirical characterization of a platform whose behavior is defined *entirely* by
  registry + metadata + configuration, evaluated against determinism/audit guarantees.
- **UCOS contribution.** The Meta-Core substrate (Registry/Metadata/Configuration runtimes + composition/
  execution engines) and a reproduced demonstration that a new capability is introduced purely via
  descriptor + provider with **zero core changes** (the dynamic-capability test), with determinism preserved.
- **Methodology.** Constructive systems paper + controlled experiment: define the architecture; measure
  capability-addition cost (0 core edits), composition/resolve/execute throughput (reproduced PI-4 §11B-class
  figures), and determinism (identical outputs across runs); ablation vs a hard-coded baseline.
- **Expected impact (AI tier).** AI-3 field-shaping: establish "behavior-from-data governance" as a named
  pattern; AI-1 scholarly citations from SE/architecture community.
- **Target journals.** Primary IEEE TSE; fallbacks ACM TOSEM, JSS; precursor ICSA.
- **Citation strategy.** Position against PRIOR-CFG (feature flags, policy-as-code, MDE); cite primary MDE and
  configuration-management sources; explicit novelty comparison (CG-4); declare self-citations to UCOS
  architecture reports via `CITE-SELF-*`.

### Paper 2 — Constitutional Governance-as-Code: Approval-by-Exception Generation Locks for Safe Autonomous Software Construction
- **Topic/Gap:** RT-02 / GAP-02 (G-THEORY). **Year:** Y1. **Type:** Journal (+ ICSE-SEIP precursor).
- **Problem statement.** Autonomous/agentic build pipelines risk unbounded, unauthorized action. There is no
  formal model for keeping an autonomous construction process *provably* bounded, traceable, and non-actuating.
- **Research gap.** No theory of an "approval-by-exception" generation lock with an immutable authority
  hierarchy that gates construction while permitting governed design work.
- **UCOS contribution.** A formalization of the Article IX generation lock, the Authority hierarchy
  (`AUTH-001..012`), trusted-vs-approval-required operations, and the decision-log discipline — with worked
  evidence that dozens of design phases proceeded while construction stayed locked (non-actuation preserved).
- **Methodology.** Formal model (state machine over authority states + operation classes) + case study over the
  UCOS decision log (AD records, phase determinations); prove safety properties (no construction without a
  scoped release) against the recorded history.
- **Expected impact.** AI-2 practice/standards (supply-chain & AI-governance communities); AI-3 concept naming.
- **Target journals.** Primary ACM TOSEM; fallbacks IEEE TSE, Data & Policy; precursor ICSE-SEIP.
- **Citation strategy.** PRIOR-GOV (policy engines, supply-chain governance, deny-by-default); contrast with
  ungoverned agentic-coding literature; declare UCOS self-citations.

### Paper 3 — One Primitive for Integrity: A Universal Audit/Provenance Ledger that Composes Across Subsystems
- **Topic/Gap:** RT-03 / GAP-03 (G-INTEGRATION). **Year:** Y1. **Type:** Journal (+ USENIX Security precursor).
- **Problem statement.** Large systems re-implement audit/provenance per subsystem, so integrity does not
  compose and hardening must be repeated. Can a single primitive serve all subsystems without capability loss?
- **Research gap.** No demonstrated reduction of multiple heterogeneous audit systems to one composable
  hash-chained, offline-verifiable, reconcilable primitive.
- **UCOS contribution.** `AUDIT-UNIV-001`: a proven **6→1 mechanical reduction** (five subsystem logs are the
  same chained ledger over different payloads; the sixth is its unchained view), preserving append-only,
  tamper-evidence, offline verify, fail-closed reconciliation, and audit-preserving forgetting.
- **Methodology.** Constructive + reduction proof + differential analysis of the six implementations; verify
  byte-equivalent hash/verify; measure single-integrity-view cost.
- **Expected impact.** AI-2 (transparency-log / SBOM communities); AI-1 security citations.
- **Target journals.** Primary ACM TOPS; fallbacks IEEE TDSC, Computers & Security; precursor USENIX Security.
- **Citation strategy.** PRIOR-PROV (transparency logs, verifiable logs, provenance systems); primary sources on
  Merkle/hash-chained logs; explicit contrast (CG-4).

### Paper 4 — The Independent Proof Fabric: Offline, Adversarial, Third-Party Verifiability of Platform Claims
- **Topic/Gap:** RT-04 / GAP-04 (G-METHOD). **Year:** Y2. **Type:** Journal (+ IEEE S&P / CCS precursor).
- **Problem statement.** Platform claims ("ratified," "certified," "complete") are typically self-attested; a
  party who does not trust the claimant and cannot access its runtime has no method to verify them.
- **Research gap.** No accepted method for **offline, adversarial** verification of a governed claim by an
  untrusting third party.
- **UCOS contribution.** The `PROOF-*` fabric (`PROOF-IMPL-001`): append-only evidence chain + detached Ed25519
  **multi-signature (M-of-N) attestation** + a **pure deterministic verifier** yielding a reproducible
  `resultHash`, packaged as an offline-verifiable Proof Bundle, plus an independent-review SoD workflow.
- **Methodology.** Constructive design + threat model + reproducibility demonstration: a third party re-runs the
  pure verifier over exported bytes and reproduces the identical verdict; adversarial cases (tampering, forged
  signatures, quorum shortfall) shown fail-closed.
- **Expected impact.** AI-3 concept ("independent proof fabric"); AI-2 attestation-standards influence (→ P14).
- **Target journals.** Primary IEEE S&P (magazine) → IEEE TDSC; fallbacks ACM TOPS, J. Cybersecurity; precursor
  IEEE S&P / CCS.
- **Citation strategy.** PRIOR-VERIF (remote attestation, verifiable computation, reproducible builds,
  zero-trust); contrast self-attestation vs independent verification.

### Paper 5 — Fail-Closed Federation: Locally-Sovereign, Clamped-Trust, Deny-by-Default Cross-Node Collaboration
- **Topic/Gap:** RT-05 / GAP-05 (G-THEORY). **Year:** Y2. **Type:** Journal (+ DSN/ESORICS precursor).
- **Problem statement.** Federated systems seldom guarantee that the worst case of a compromised or partitioned
  peer is "no new capability," never "silent local compromise."
- **Research gap.** No trust model combining local sovereignty, clamped/bounded federated trust,
  namespace isolation (local-shadows-foreign), and fail-closed partition behavior with cryptographic assertions.
- **UCOS contribution.** The PI-5 Federation Fabric: Ed25519 signed identity/trust assertions, trust clamped to
  a delegation/boundary ceiling, deny-only foreign policy, `federation:<nodeId>:*` namespace isolation, and
  fail-closed partitions — with an adversarial suite (16/16 attack vectors blocked; 0 residual High/High).
- **Methodology.** Constructive + adversarial evaluation (STRIDE T1–T12); prove trust monotonic clamping and
  isolation properties; measure re-verification cost of imported artifacts.
- **Expected impact.** AI-1 distributed-systems/security; AI-2 federated-trust frameworks (→ P14).
- **Target journals.** Primary IEEE TDSC; fallbacks IEEE TPDS, ESORICS; precursor DSN.
- **Citation strategy.** PRIOR-FED (Byzantine/partition tolerance, CRDTs, trust delegation); contrast with
  optimistic-trust federation.

### Paper 6 — Migration-Only Evolution: A Single Provable Commit Path for Non-Breaking Platform Change
- **Topic/Gap:** RT-06 / GAP-06 (G-METHOD). **Year:** Y2. **Type:** Journal (+ SANER precursor).
- **Problem statement.** Platform change is error-prone because state can mutate through many paths; few systems
  enforce a *single, provable, backward-compatible* commit path.
- **Research gap.** No method that makes an Evolution Fabric the sole durable-commit path with migration-only,
  backward-compatible, fully audited change.
- **UCOS contribution.** PI-6 Evolution Fabric (AD-0019): every durable mutation across fabrics routes through
  one governed, migration-only commit path; changes are append-only and provable; no bypass exists.
- **Methodology.** Constructive + invariant analysis; demonstrate that all fabric mutations (knowledge, memory,
  ontology, proof ratification) reduce to Evolution units; measure backward-compat preservation across versions.
- **Expected impact.** AI-1 SE/maintenance; AI-2 change-management practice.
- **Target journals.** Primary IEEE TSE; fallbacks J. Softw. Evol. Process, EMSE; precursor SANER.
- **Citation strategy.** PRIOR-EVOL (schema migration, event sourcing/CQRS, versioning); contrast multi-path
  mutation vs single commit path.

### Paper 7 — Governed Cognition: Propose-Not-Act Intelligence with a Determinism Quarantine
- **Topic/Gap:** RT-07 / GAP-07 (G-THEORY). **Year:** Y3. **Type:** Journal (+ SEAMS/AAMAS precursor).
- **Problem statement.** Embedding non-deterministic AI in a deterministic, governed platform risks
  unbounded/opaque action.
- **Research gap.** No architecture that bounds the blast radius of non-deterministic inference to *rejected
  proposals and audit noise* while preserving determinism of committed decisions.
- **UCOS contribution.** The PI-10 Intelligence Fabric design (`INT-*`): governed cognition, deny-by-default
  *propose-not-act* (Evolution-only commit), a **determinism quarantine** for non-deterministic inference
  (advisory, verifier-gated), and mandatory explainability; STRIDE I1–I12 at 0 residual High/High.
- **Methodology.** Constructive + threat analysis + formal argument that committed decisions are deterministic
  functions of recorded evidence (reproducibility by `resultHash`).
- **Expected impact.** AI-3 concept ("propose-not-act governed cognition"); AI-2 AI-safety/guardrails practice.
- **Target journals.** Primary ACM TAAS; fallbacks IEEE TDSC, IST; precursor SEAMS/AAMAS.
- **Citation strategy.** PRIOR-AI (neuro-symbolic governance, tool-use safety, HITL); contrast with
  autonomous-actuation agents.

### Paper 8 — Runtime Semantic Integrity: Governed Ontologies with Fail-Closed DAG-Taxonomy Constraints
- **Topic/Gap:** RT-08 / GAP-08 (G-INTEGRATION). **Year:** Y3. **Type:** Journal (+ ISWC precursor).
- **Problem statement.** Ontologies drift and admit contradictions at runtime; consistency checking is often
  offline and advisory.
- **Research gap.** No governed pre-commit gate enforcing referential integrity, taxonomy acyclicity (DAG),
  domain/range, disjointness, and non-contradiction as a fail-closed condition of change.
- **UCOS contribution.** The PI-8 Ontology Fabric (`ONTO-*`, `ONTO-RAT-001`): semantic integrity SI-1..7 as a
  fail-closed pre-commit + atomic-apply gate, routed through the Evolution Fabric; O1–O12 threats closed.
- **Methodology.** Constructive + property verification; show every governed ontology mutation re-validates
  integrity atomically; measure gate cost; adversarial contradiction injection.
- **Expected impact.** AI-1 knowledge-engineering; AI-2 KG-integrity practice.
- **Target journals.** Primary IEEE TKDE; fallbacks JSS, SoftwareX (artifact); precursor ISWC.
- **Citation strategy.** PRIOR-ONT (description logics, ontology consistency, KG integrity); primary DL sources.

### Paper 9 — Audit-Preserving Memory: Tiered Retention and Governed Forgetting without Losing the Audit Trail
- **Topic/Gap:** RT-09 / GAP-09 (G-METHOD). **Year:** Y3. **Type:** Journal (+ DSN precursor).
- **Problem statement.** "Right to be forgotten" and retention limits conflict with tamper-evident audit: naive
  deletion destroys audit; naive audit blocks forgetting.
- **Research gap.** No mechanism that makes a value **unrecallable** while **retaining the audit fact** of its
  existence and forgetting.
- **UCOS contribution.** The PI-9 Memory Fabric (`MEM-*`, `MEM-RAT-003`): six tiers, monotonic classification,
  and **audit-preserving forgetting** (forgetting acts on recallable values, never the hash chain).
- **Methodology.** Constructive + formal statement of the two-sided guard (value unrecallable ∧ audit retained);
  adversarial re-identification attempts; measure retention/forget operations.
- **Expected impact.** AI-2 privacy-engineering/GDPR-adjacent practice; AI-1 security.
- **Target journals.** Primary ACM TOPS; fallbacks J. Cybersecurity, FGCS; precursor DSN.
- **Citation strategy.** PRIOR-MEM (memory architectures, RTBF, retention/audit trade-offs); contrast
  delete-vs-tombstone approaches.

### Paper 10 — Where Determinism Meets Latency: Scale Breakpoints of Single-SoR, Synchronous Governance
- **Topic/Gap:** RT-10 / GAP-10 (G-SCALE). **Year:** Y4. **Type:** Journal (+ ICDCS precursor).
- **Problem statement.** Single-source-of-truth determinism (INV-5) and synchronous decision paths (INV-6) are
  known to strain at scale, but the breakpoints are unquantified — especially under geo/inter-node latency.
- **Research gap.** No breakpoint characterization of single-SoR + synchronous governance across a load ladder up
  to extreme (inter-node/high-latency) tiers.
- **UCOS contribution.** `CIV-STRESS-001`: a nine-tier load ladder with **15 breakpoints / 17 bottlenecks**,
  identifying the first architectural break and the structural walls (single terminal authority; global-SoR
  serialization; synchronous determinism vs latency), and federation as the scaling asset.
- **Methodology.** Analytical scaling model + reproduced single-process baselines + order-of-magnitude
  projection; identify CAP/PACELC-consistent limits; propose (not build) partitioned/sharded remedies.
- **Expected impact.** AI-1 distributed-systems; AI-2 architecture-limits practice.
- **Target journals.** Primary IEEE TPDS; fallbacks ACM TOCS, JPDC; precursor ICDCS.
- **Citation strategy.** PRIOR-SCALE (CAP/PACELC, consensus latency bounds, geo-distributed consistency).

### Paper 11 — Scalable Governance: Subsidiarity Tiers and Risk-Classified Decision Lanes
- **Topic/Gap:** RT-11 / GAP-11 (G-THEORY). **Year:** Y4. **Type:** Journal (+ ICSA precursor).
- **Problem statement.** A single synchronous apex authority is a governance bottleneck and a single point of
  failure; uniform approval does not scale.
- **Research gap.** No ratified subsidiarity + risk-lane model that scales governance while preserving a single
  constitutional apex and separation of duties.
- **UCOS contribution.** `PHASE-R7` (`CIV-GOV-001` v1.1.0): governance tiers GT-0..GT-3 (bounded, revocable,
  narrowing delegation) + decision lanes A/B/C (autonomous/council-ratified/apex-reserved), collapsing apex load
  from O(all) to O(constitutional), with async signed-quorum ratification and partition tolerance.
- **Methodology.** Design + analytical load model (apex-decision reduction) + case study over UCOS decision
  history; show SoD and non-actuation preserved.
- **Expected impact.** AI-2 governance/IS practice; AI-3 "risk-lane governance" concept.
- **Target journals.** Primary ACM TMIS; fallbacks Government Information Quarterly, Data & Policy; precursor ICSA.
- **Citation strategy.** PRIOR-GOV + organizational-governance/subsidiarity sources; contrast centralized apex.

### Paper 12 — Deterministic Composition Kernels: Dependency-Inverted Capability Graphs at Runtime
- **Topic/Gap:** RT-12 / GAP-12 (G-EMPIRICAL). **Year:** Y4. **Type:** Journal (+ Middleware precursor).
- **Problem statement.** Dynamic composition frameworks rarely quantify deterministic composition/execution over
  dependency-inverted capability graphs with cycle detection and contract enforcement.
- **Research gap.** Under-characterized performance and determinism of a metadata-driven composition kernel.
- **UCOS contribution.** The Meta-Core composition/execution engines: dependency resolution with cycle
  detection, contract-enforced execution, plugin runtime; reproduced resolve/compose/execute throughput and a
  proof of no-hardcoded-logic (capability added via descriptor only).
- **Methodology.** Controlled benchmark (resolve/compose/execute at increasing graph sizes) + determinism check
  + failure-mode analysis (cycle/missing-dep/bad-config rejected with typed codes).
- **Expected impact.** AI-1 middleware/SE; AI-2 composition-framework practice.
- **Target journals.** Primary ACM TOSEM; fallbacks IEEE TSE, SPE; precursor Middleware.
- **Citation strategy.** PRIOR-CFG + component/DI-container and plugin-architecture primary sources.

### Paper 13 — A Reference Model for Governed, Self-Evolving Software Platforms (Survey/Synthesis)
- **Topic/Gap:** RT-13 / GAP-13 (G-THEORY). **Year:** Y5. **Type:** Journal survey (+ ICSA industry/keynote).
- **Problem statement.** The concepts above (behavior-from-data, governance-as-code, proof, federation,
  evolution, cognition) are studied separately; no consolidated reference model exists.
- **Research gap.** No integrated reference model + taxonomy for governed self-evolving platforms.
- **UCOS contribution.** A synthesized reference model over the full UCOS corpus (PEA-001..007; fabrics
  PI-2..PI-11; invariants INV-1..13 / `INV-CORE-*`), with a maturity model and open-problem catalogue
  (incl. the P10 scale limits).
- **Methodology.** Systematic synthesis + reference-model construction + comparison matrix vs prior platform
  reference models; explicitly separates ratified vs deferred (AD-0014) scope.
- **Expected impact.** AI-3 field-shaping (the citable reference); high AI-1 (surveys accrue citations).
- **Target journals.** Primary ACM Computing Surveys; fallbacks IEEE TSE, JSS; precursor ICSA.
- **Citation strategy.** Broadest prior-art integration across all PRIOR-* classes; rigorous CG-1 primary
  sourcing; heavy but declared `CITE-SELF-*` to UCOS papers P1–P12 (justified, net-external reported).

### Paper 14 — Cross-Organization Proof & Attestation Exchange: Toward a Standard for Independent Verifiability
- **Topic/Gap:** RT-14 / GAP-14 (G-STANDARD). **Year:** Y5. **Type:** Journal + Standards contribution.
- **Problem statement.** Organizations cannot exchange machine-verifiable proofs of governed claims across trust
  boundaries; there is no common format for portable, offline-verifiable proof bundles.
- **Research gap.** No standard governing cross-org proof/attestation exchange with local re-verification.
- **UCOS contribution.** A proposed interchange format derived from the `PROOF-*` bundle (evidence chain +
  M-of-N signatures + verifier reference + verdict) with PI-5 federation import re-verification (deny-by-default,
  clamped trust), and a reference verifier specification.
- **Methodology.** Design + interoperability demonstration (export/import + independent re-verification across
  simulated nodes) + mapping to existing attestation/SBOM ecosystems; RD-6 standards submission.
- **Expected impact.** AI-2/AI-3 standards adoption (STD-01/02); AI-1 security citations.
- **Target journals/venues.** Primary STD-01 contribution + IEEE S&P magazine; fallbacks ACM TOPS,
  J. Cybersecurity; precursor CCS.
- **Citation strategy.** PRIOR-PROV + PRIOR-VERIF; align/contrast with in-toto/SLSA-adjacent and transparency-log
  ecosystems; explicit interoperability comparison.

### Paper 15 — Conservation-Safe Federated Economic Fabrics: Fail-Closed Value Semantics without a Real-Money Path
- **Topic/Gap:** RT-15 / GAP-15 (G-THEORY). **Year:** Y5. **Type:** Journal (+ IEEE CLOUD precursor).
- **Problem statement.** In-platform economic subsystems risk value creation/destruction bugs and unsafe
  actuation; conservation is rarely a fail-closed invariant.
- **Research gap.** No economic-fabric design enforcing conservation (Σ credits = Σ debits), non-negativity,
  atomicity, idempotency, and determinism as fail-closed gates, with **no real-money code path**.
- **UCOS contribution.** The `ECON-*` design (`ECON-001`): a settlement gate enforcing conservation invariants,
  propose-not-act with Evolution-only commit, advisory/deny-only federation (no cross-node auto-settlement), and
  double-entry hash-chained audit — all non-actuating.
- **Methodology.** Constructive + invariant proof (conservation/atomicity/idempotency at the settlement gate) +
  adversarial EC1–EC15 analysis (0 residual High/High); ledger offline-proof (replay reproduces balances).
- **Expected impact.** AI-1 services/cloud; AI-2 safe-economic-systems practice.
- **Target journals.** Primary IEEE TSC (Services); fallbacks FGCS, JPDC; precursor IEEE CLOUD.
- **Citation strategy.** PRIOR-EVOL + accounting/ledger-integrity and tokenized-systems primary sources;
  contrast with actuating financial systems.

## B. Industry-publication plan (≥ 50)

Industry outputs disseminate the same results to practitioners (workshops, industry tracks, engineering blogs on
governed venues, technical whitepapers). Allocation (≈ 10/year over 5 years):

| Theme | Count | Formats |
|-------|:-----:|---------|
| Behavior-from-data / composition (P1,P12) | 8 | whitepapers, ICSE-SEIP/industry talks, technical reports |
| Governance-as-code / scalable governance (P2,P11) | 10 | whitepapers, practitioner articles, standards explainers |
| Proof / audit / provenance (P3,P4,P14) | 12 | attestation whitepapers, security-industry talks, reference-verifier notes |
| Federation / evolution (P5,P6) | 8 | distributed-systems industry tracks, migration playbooks |
| Cognition / knowledge / ontology / memory (P7,P8,P9) | 8 | AI-safety practitioner articles, KG-integrity notes |
| Scale / economic / reference model (P10,P13,P15) | 4 | architecture-limits reports, reference-model briefs |
| **Total** | **50** | (whitepapers count toward the standing whitepaper deliverable class) |

Every industry publication passes G-TRUTH/G-DISCLOSE and is registered as a `PUB-*` (type `industry`/`whitepaper`).

## C. Conference plan (≥ 10)

The 15 papers' precursors already enumerate ≥ 13 conference submissions (ICSA, ICSE-SEIP, USENIX Security,
IEEE S&P/CCS, DSN, ESORICS, SANER, SEAMS/AAMAS, ISWC, ICDCS, Middleware, IEEE CLOUD). Target **≥ 10 accepted**;
prioritize artifact-evaluation venues (ICSE/FSE/OSDI/USENIX/DSN AEC, SoftwareX) for reproducibility badges
(PM-5 / G-R4). Conference papers convert to extended journal versions per venue policy (declared; no
dual-publication).

## D. Five-year sequencing (papers → years)

| Year | Journal papers | Conference precursors | Industry | Cumulative journals |
|:----:|----------------|-----------------------|:--------:|:-------------------:|
| Y1 | P1, P2, P3 | ICSA, ICSE-SEIP, USENIX Sec | 8 | 3 |
| Y2 | P4, P5, P6 | IEEE S&P/CCS, DSN, SANER | 10 | 6 |
| Y3 | P7, P8, P9 | SEAMS/AAMAS, ISWC, DSN | 10 | 9 |
| Y4 | P10, P11, P12 | ICDCS, ICSA, Middleware | 12 | 12 |
| Y5 | P13, P14, P15 | ICSA, CCS, IEEE CLOUD | 10 | **15** |
| **Σ** | **15** | **≥ 13 (target ≥ 10 accepted)** | **50** | **15** |

**Targets met:** ≥ 15 journal · ≥ 10 conference · ≥ 50 industry.

## E. Portfolio dependencies & integrity

- **Sequencing rationale.** Foundations (P1–P3) precede verifiability/federation (P4–P6), then cognition/
  knowledge (P7–P9), then limits/governance-at-scale (P10–P12), then synthesis/standards (P13–P15). P13 (survey)
  and P14 (standard) intentionally last, consuming P1–P12.
- **Reproducibility.** P1, P3, P5, P9, P10, P12, P15 are empirical/measured → mandatory reproducibility packages
  (G-REPRO) and artifact-badge targets.
- **Truth conformance.** No paper claims construction/authorization beyond what the Authority Board has granted;
  scope deferred under AD-0014 (existential/Ω∞) is excluded from all claims (G-TRUTH; RGP-1).
- **Self-citation integrity.** Intra-portfolio citations (esp. P13) recorded as `CITE-SELF-*`; metrics reported
  net-external (`RPF-0004` §4).

## Traceability
- **Parent:** `RPF-0001` §20. **Consumes:** `RPF-0002` (RT/GAP), `RPF-0003` (venues), `RPF-0004` (gates/registries).
- **Each paper:** `RT-* → GAP-* → CLAIM → evidence (ratified/reproduced) → PUB-* → CITE-*` in the RKG.
- **Owner:** Research Authority Board; per-paper PI + Research Owner. Design only; Article IX and
  `UCOS-CONSTRUCTION-BLOCKED` unchanged.

**END RPF-0005 — ACADEMIC ROADMAP · PAPERS P1–P15 (TITLE/PROBLEM/GAP/CONTRIBUTION/METHOD/IMPACT/VENUES/CITATION) · ≥50 INDUSTRY · ≥10 CONFERENCE · 5-YEAR SEQUENCING · DESIGN ONLY · NO CODE · ARTICLE IX UNCHANGED.**
