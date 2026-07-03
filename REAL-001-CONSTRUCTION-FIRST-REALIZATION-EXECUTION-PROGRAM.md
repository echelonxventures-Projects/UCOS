# REAL-001 — Construction-First Realization Execution Program

## PHASE U3 — Realization Execution Program (Architecturally Complete → Operationally Certified)

| Field | Value |
|-------|-------|
| Artifact | **REAL-001 — Construction-First Realization Execution Program** |
| Artifact ID | `REAL-001` |
| Phase | **U3 — Realization Execution Program** |
| Layer | GOVERNANCE / EXECUTION-PLANNING (construction-first program specification) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **PROGRAM SPECIFICATION ONLY** — defines *what will be built, provisioned, tested, evidenced, reviewed, and certified*. This artifact writes no source code, provisions no infrastructure, runs no pipeline, enrolls no invariant, releases no lock, and mutates no ratified artifact. Append-only. Every construction/authorization/provisioning act it names is a future Approval-Required Operation (AUTH-012 §8 / AD-0009) reserved to the Authority Board. |
| Input basis | **`ULT-GAP-001` (authoritative)** — 5 CRITICAL (`ULT-C-01..05`) + 7 HIGH (`ULT-H-01..07`). Sequencing consumes `ROADMAP-ULT-001` (U2.1–U2.15). |
| Frozen assumptions (per mandate) | Architecture **FROZEN**; Governance **FROZEN**; `ULT-GAP-001` **AUTHORITATIVE**. No new architecture, no new governance, no redesign — **realization only**. |
| Governing discipline | Construction-first · Evidence-based · Non-optimistic. A deliverable is "done" only on reproduced evidence + independent attestation + a certification artifact. Assertion is never accepted as completion. |
| Governance status | INV-1..13 unchanged; INV-14..20 NOT enrolled; AD-0014 (Ω∞ deferral) intact; Article IX generation lock **ACTIVE**; `UCOS-CONSTRUCTION-BLOCKED` stands except where a prior scoped release (AD-0016..0023) already applies. This program releases nothing. |
| Scope boundary | Realization within the ratified `INV-1..13` envelope. Existential scope (`INV-14..20`, Ω∞, Civilization/Economy *actuation*) = **ULT-D-01**, deferred, out of scope. |
| **Objective** | Deliver the **shortest construction-first path** from **ARCHITECTURALLY COMPLETE** to **OPERATIONALLY CERTIFIED**, with every Critical and High finding closed through seven mandatory realization elements: (1) exact deliverable, (2) required code, (3) required infrastructure, (4) required tests, (5) required evidence, (6) required independent review, (7) required certification artifact. |

---

## 0. Reading Frame — the Seven-Element Realization Contract

Each finding below is specified as a **realization unit** with exactly seven elements. The contract is uniform and non-negotiable:

| # | Element | Definition | Completion rule |
|:-:|---------|------------|-----------------|
| 1 | **Exact deliverable** | The single, testable thing that exists at the end that did not exist before. | Named artifact/module/environment, no adjectives. |
| 2 | **Required code** | Source under `packages/platform-runtime/src/**`, `services/**`, `apps/**` — **additive**, no prohibited-core-dir mutation. | Path-specified; `tsc` clean; 269-baseline green. |
| 3 | **Required infrastructure** | Runtime/provisioning under `infra/**` and live environments. | Applied manifest + running resource, or explicit "none". |
| 4 | **Required tests** | Executable verification (`node --test`, contract, adversarial, DR). | Reproduced pass; coverage stated. |
| 5 | **Required evidence** | Immutable, reproducible proof the deliverable behaves as claimed. | Chain-of-custody artifact; measured, not asserted. |
| 6 | **Required independent review** | Attestation by an actor **distinct from the author** (ULT-C-05 discipline). | Signed/attributable; second-party; no self-certification. |
| 7 | **Required certification artifact** | The governed instrument that records closure. | Board-issuable; supersession recorded where applicable. |

> **Honesty rule (non-optimism).** Where an element is genuinely inapplicable (e.g., a documentation-only reconciliation needs no `infra/**`), it is marked **"None — <reason>"**. No element is fabricated to appear construction-heavy. "Construction-first" governs *ordering and bias*, not the invention of code where none is warranted.

> **No-redesign rule.** Every "required code" item is either (a) **convergence** onto an *existing ratified primitive*, (b) **construction of an already-designed** fabric per its ratified spec, or (c) **product implementation** post-lock-release per ratified domain/service/experience designs. If any unit is found to require a new primitive, invariant, or design change, it **escalates** and does not proceed under REAL-001.

**Verified starting baseline (reproduced by `ULT-GAP-001` §1):** `node --test` → 269/269 pass, 0 fail; 5 substrate core dirs intact; `AUTH-012` v1.0.13 (AD-0001..0023 enrolled); PI-2..PI-9 present; PI-10/PI-11/Civilization/Economy and the entire domain/product layer **absent**; `infra/**` = unapplied manifests, **0** provisioned env; `UCOM-CERT-001` **not issued**.

---

## 1. Realization Units — CRITICAL Findings

### REAL-C-01 — Trustworthy Terminal Certification of Record
*Closes `ULT-C-01` (stale terminal certification). Blocks: credible ULTIMATE instrument. Effort: S. Class: documentation realization.*

1. **Exact deliverable:** A re-issued terminal certification (`UCOM-ULTIMATE-CERT-002`, superseding R14) computed against the verified state `G-1..G-10`, with an explicit governance ruling recording which of R13/R14 governs.
2. **Required code:** None — documentation Trusted Operation; no `src/**` change.
3. **Required infrastructure:** None.
4. **Required tests:** Re-run `node --test` and capture the exact totals (expected 269/269) as the certification's evidence baseline; re-read `AUTH-012` header (expected v1.0.13) and `MEM-RAT-003` verdict. No new test code.
5. **Required evidence:** A reconciliation table binding each superseded R14 claim (`134/134`, "Memory REJECTED", "chain DEFECTIVE") to the reproduced live fact + governing act, applying the `GOV-REC-001` precedence rule (executed act > analysis; recency) to the certification layer.
6. **Required independent review:** A second-party attestation that the re-issued certification's numbers were independently reproduced (not copied from the author), signed by an actor distinct from the certification author (see REAL-C-05).
7. **Required certification artifact:** `UCOM-ULTIMATE-CERT-002` (marked *supersedes R14*), plus an `AUTH-012` disposition note recording the supersession. Prerequisite to any honest ULTIMATE claim.

---

### REAL-C-02 — Operational Certification with Measured Evidence
*Closes `ULT-C-02` (zero operational evidence). Blocks: OPERATIONALLY CERTIFIED. Effort: XL — human-executed, real cloud spend. Class: operational realization. **This is the governing unit of the objective.***

1. **Exact deliverable:** A live, governed non-production operational baseline — provisioned `ENV-DEV` + `ENV-INT`, an executed CI pipeline, contract-test results, a completed DR drill, and **measured** RPO/RTO/p99/availability — culminating in an issued **Operational Certification**.
2. **Required code:** None new in the substrate (PI-1 foundation already built). Only pipeline/test wiring that already exists as design is executed; if adapter shims are needed to run the two platform services (`registry`, `config-metadata`) they are additive under `services/**`.
3. **Required infrastructure:** Apply `infra/environments/{dev,int}`, `infra/delivery/pipeline.yaml`, `infra/networking`, `infra/persistence`, `infra/runtime`; bind CI runner + secrets + KMS by-reference; enforce S1/S3/S4 (mTLS, secrets-by-reference, network isolation) from day one; **ENV-PROD forbidden**. Requires the **PE-12 observability ADR decided first** (see REAL-M-04 dependency in §3) so metrics can be captured.
4. **Required tests:** Execute `RA-2` runbooks — build→test→scan→sign→promote pipeline (DEV→INT); provider/consumer/compatibility contract tests for **API-018 (Config/Metadata)** and **API-027 (Registry)** at 100% operation coverage; backup/restore + failover DR drill.
5. **Required evidence:** Immutable, chain-of-custody operational evidence pack: provisioning attestation (G12-1), pipeline + contract results with signed artifacts (G12-2), DR drill result + **measured** RPO/RTO/p99/availability compared against `UCOS-ASR-NFR-001` floors (G12-3), and live HA/mTLS/backup proof. Measured — never asserted.
6. **Required independent review:** Independent operational reviewer confirms G12-1/2/3 evidence completeness and that measured NFRs meet floors, with attribution distinct from the executing operator (VW-2 of `ROADMAP-ULT-001`).
7. **Required certification artifact:** **Operational Certification** (supersedes the `UCOS-P12-CERT-001` PENDING verdict); closes UCC-4. **On issuance, UCOS is OPERATIONALLY CERTIFIED.**

---

### REAL-C-03 — Full Article IX Lock Release + Construction Authorization
*Closes `ULT-C-03` (generation lock active). Blocks: FULLY REALIZABLE at governance layer. Effort: M (Board act) — gated on REAL-C-02. Class: governance realization (enactment of a frozen rule, not new governance).*

1. **Exact deliverable:** A recorded Authority-Board act fully releasing the Article IX generation lock within the `INV-1..13` envelope, lifting `UCOS-CONSTRUCTION-BLOCKED`.
2. **Required code:** None — the act *authorizes* subsequent code (REAL-C-04); it writes none itself.
3. **Required infrastructure:** None.
4. **Required tests:** Precondition checklist executed as a gate: UCC-1 ✅ (`AUTH-REST-004`), UCC-2 ✅ (`MEM-RAT-003`), UCC-3 (PI-8 ✅; PI-10 ratified in REAL-H-01), UCC-4 ✅ (REAL-C-02), UCC-6 (PE-12 ADR), UCC-7 (REAL-H-03). Each verified against its evidence artifact.
5. **Required evidence:** `ARTICLE-IX-LOCK-RELEASE-REVIEW` completed showing all preconditions CLOSED with citations; the standing scoped releases (AD-0016..0024) and the AD-0015 evidence carve-out reconciled against the full release.
6. **Required independent review:** Independent adjudicator attests preconditions are genuinely met (not self-asserted) before the Board sits (ties REAL-C-05).
7. **Required certification artifact:** `UCOS-ARTICLE-IX-LOCK-RELEASE` + `UCOS-CONSTRUCTION-AUTHORIZATION`; AUTH-012 decision recorded; closes UCC-5. This is the **only** act that fully lifts the generation lock.

---

### REAL-C-04 — Domain / Service / Experience Product Realization
*Closes `ULT-C-04` (product layer unbuilt). Blocks: FULLY REALIZABLE. Effort: XL. Class: product construction. **Gated on REAL-C-03; sits BEYOND the Operationally-Certified objective — see §5 scope note.***

1. **Exact deliverable:** Running implementations (additive over PI-2..PI-9) of the ratified product surface: the 28 domains as bounded-context modules, the platform/domain services as *running* services, and the experience surfaces — delivered in dependency-ordered increments, not big-bang.
2. **Required code:** Per-increment source under `services/**` (service implementations behind the ratified 30 API + 27 event + 28 data contracts) and `apps/**` (experience surfaces), each additive, `tsc` clean, baseline green. Implementation per `UCOS-IMP-PI-001` / Prompt 10, honoring `UCOS-SVC-ARCH-001` and `UCOS-EXP-ARCH-001` as-designed (no redesign).
3. **Required infrastructure:** Extend `infra/**` per-service (deploy manifests, persistence, networking) reusing the REAL-C-02 environment topology; each service provisioned into ENV-INT.
4. **Required tests:** Per-service unit + contract (provider/consumer) + integration against the substrate; domain invariant tests; regression against the 269-baseline plus the growing suite.
5. **Required evidence:** Per-increment implementation + validation + security + audit reports (the established `*-IMP/VAL/SEC/AUD-001` pattern) with reproduced test runs and contract conformance.
6. **Required independent review:** Independent ratification per increment (distinct actor); no increment self-certified; each wave gated before the next starts.
7. **Required certification artifact:** Per-increment ratification records; product-layer completion determination once the ratified surface is realized. Feeds ULTIMATE (not required for OPERATIONALLY CERTIFIED).

---

### REAL-C-05 — Independent Adjudication Authority (Separation of Duties, Enforced)
*Closes `ULT-C-05` (no independent adjudication). Blocks: defensibility of every PASS/RATIFIED/CERTIFIED verdict. Effort: L (organizational). Class: process realization. **Cross-cutting prerequisite — element (6) of every other unit depends on this.***

1. **Exact deliverable:** A genuinely independent review/attestation authority — a distinct actor (and/or a signed, cryptographically verifiable attestation mechanism) — applied to at least all CRITICAL/HIGH ratifications and the terminal certification, with a recorded attestation chain.
2. **Required code:** Optional but recommended: an additive attestation-verification utility under `packages/platform-runtime/src/control/governance/**` that validates detached signatures over evidence-artifact hashes (uses the existing hash-chain/signing primitive — **no custom crypto**, per PI-7 precedent). If organizational-signature-only is chosen, code = None.
3. **Required infrastructure:** Key custody for the independent attester (KMS-backed signing key, by-reference), separate from the authoring identity; enforced at the CI-signing seam bound in REAL-C-02.
4. **Required tests:** Attestation verification test (valid signature passes; tampered evidence fails; author-signed-as-reviewer is rejected — enforcing proposer ≠ certifier ≠ ratifier).
5. **Required evidence:** For each CRITICAL/HIGH closure, a detached attestation attributable to the independent actor, verifiable against the evidence-artifact hash; an attestation-chain ledger.
6. **Required independent review:** Self-referential by design — the *mechanism* is the review capability. Bootstrapping review: the first independent actor's designation is itself recorded by the Authority Board as a governed act.
7. **Required certification artifact:** Independent-Adjudication Establishment record + the standing attestation-chain ledger. Retro-attestation of the `ULT-H-07` retroactive enrollment is recorded here.

---

## 2. Realization Units — HIGH Findings

### REAL-H-01 — Upper Behavioral Fabrics (Intelligence, Simulation; then Economy/Civilization sim)
*Closes `ULT-H-01`. Effort: XL. Class: fabric construction (already-designed). Intelligence + Simulation are within the certification envelope; Economy/Civilization actuation stays ULT-D-01.*

1. **Exact deliverable:** Constructed, ratified **PI-10 Intelligence** (`src/control/intelligence/*`) and **PI-11 Simulation** (`src/control/simulation/*`) fabrics, additive over PI-2..PI-9.
2. **Required code:** `packages/platform-runtime/src/control/intelligence/**` per `INTEL-001` / `INT-*` ratified design (with `INT-REM-001/002/003` remediations landed); `packages/platform-runtime/src/control/simulation/**` per `SIM-PLAN-001..003` (M0..M14). Propose-not-act: commits route only through Evolution; determinism (INV-6) quarantined; non-actuation/sandbox guarantee for Simulation.
3. **Required infrastructure:** None beyond the substrate (in-process fabrics); durable-persistence needs are handled under REAL-H-05, not here.
4. **Required tests:** Adversarial suites I1–I12 (Intelligence) and S1–S12 (Simulation); substrate + PI-4..PI-9 regression; 269-baseline green at each wave gate; **0 residual High/High**.
5. **Required evidence:** `PI10-IMP/VAL/SEC/AUD-001` and `PI11-IMP/VAL/SEC/AUD-001` with reproduced runs; determinism-quarantine and non-actuation proofs.
6. **Required independent review:** Independent PI-10 and PI-11 ratification (VW-1), distinct actor, following the PI-7/PI-8/PI-9 ratification pattern.
7. **Required certification artifact:** PI-10 ratification determination + PI-11 ratification determination. Gated: PI-10 requires scoped release **AD-0024**; PI-11 proceeds under standing **AD-0022** (SIM-COND-1..7).

---

### REAL-H-02 — Canonical Invariant Enrollment & Enactment
*Closes `ULT-H-02`. Effort: M. Class: governance enactment (of already-defined invariants — no new invariants authored).*

1. **Exact deliverable:** `INV-CORE-01..14` enrolled and made binding, and the revised INV-17/INV-18 resolutions (`EXIST-001`) enacted, with `UCOS-ASR-NFR-001` raised to v1.1.0 (append-only).
2. **Required code:** If any invariant is runtime-enforceable, additive guard/assertion wiring at the relevant control seam; otherwise None (constitutional binding is documentary force).
3. **Required infrastructure:** None.
4. **Required tests:** For each runtime-enforceable invariant, a test proving violation is rejected; baseline green.
5. **Required evidence:** `AUTH-012` enrollment act at Constitutional Majority for `INV-CORE-01..14` + C-EX9a/C-EX9b; `EXIST-001` E-1..E-4 moved from PENDING to ENACTED; the versioned `UCOS-ASR-NFR-001` v1.1.0 diff.
6. **Required independent review:** Independent attestation that enrollment followed the Constitutional-Majority procedure (REAL-C-05).
7. **Required certification artifact:** `AUTH-012` enactment decision + `UCOS-ASR-NFR-001` v1.1.0. Enables closure of `ULT-L-03` (F-CITE-1 doc correction) at the same touch.

---

### REAL-H-03 — Primitive Consolidation Construction (Audit / Authority / Lifecycle)
*Closes `ULT-H-03` (+ UCC-7). Effort: L. Class: convergence onto existing ratified primitives.*

1. **Exact deliverable:** Six parallel audit logs collapsed to **one** composable Audit/Provenance primitive; duplicated Authority (cert/ratify/revoke) and Evolution/Lifecycle state machines collapsed to single universal primitives; `UCOM-P1..P5` primitives constructed.
2. **Required code:** Additive `packages/platform-runtime/src/control/primitives/**` (or convergence at the existing seams `control/audit-log.ts`, `control/governance/**`, `control/evolution/**`); per-fabric log clones (`InMemoryAuditLog`, `FederatedAuditLog`, `EvolutionAuditLog`, `KnowledgeAuditLog`, `MemoryAuditLog`, `OntologyAuditLog`) reduced to thin adapters over the one primitive. **Additive-first: old paths retained until the new primitive is proven, then removed.**
3. **Required infrastructure:** None.
4. **Required tests:** All audit/authority/lifecycle paths route through the single primitive; per-merge 269-baseline gate; de-duplication does not alter ratified semantics.
5. **Required evidence:** Re-run of the `AUDIT-UNIV-001` collapse plan (W0–W4) to executed; UA-01 C1/M1/M2 re-audited to PASS.
6. **Required independent review:** Independent ratification that convergence changed no ratified primitive semantics (distinct actor).
7. **Required certification artifact:** UA-01 convergence closure record; **UCC-7 CLOSED**. Escalate (do not proceed) if convergence would require redesign.

---

### REAL-H-04 — Anti-Fragility Mechanism Construction
*Closes `ULT-H-04`. Effort: L. Class: construction (already-designed mechanisms).*

1. **Exact deliverable:** The 11 anti-fragility mechanisms (`AF-REM-001`, AF-M-1..6 across 7 domains) built, and fragile elements AF-F-1..3 remediated.
2. **Required code:** Additive `packages/platform-runtime/src/control/**` anti-fragility loops (feedback/adaptation instrumentation) per `AF-REM-001` §4 (R8.1–R8.6); some loops depend on durable persistence (REAL-H-05).
3. **Required infrastructure:** Any persistence-backed loops provisioned via REAL-H-05 adapters; observability from REAL-C-02 PE-12.
4. **Required tests:** Fault-injection / adaptation tests proving each mechanism strengthens under stress; baseline green.
5. **Required evidence:** `AF-VAL-001` validation report with reproduced fault-injection runs.
6. **Required independent review:** Independent ratification of `AF-REM-001` implementation (distinct actor).
7. **Required certification artifact:** `AF-REM-001` ratification + `AF-VAL-001`. Moves UA-08 verdict from "robust" to "anti-fragile".

---

### REAL-H-05 — Scale-Ceiling Remediation (Durable/Sharded Persistence, Partitioned Evolution)
*Closes `ULT-H-05`. Effort: XL (some walls are governed limits). Class: adapter construction behind existing ports — no redesign.*

1. **Exact deliverable:** Durable/sharded persistence adapters behind the existing ports, a partitioned Evolution ledger, and delegated/federated authority — **or** formal `ACCEPTED-AS-GOVERNED-LIMIT` records (with Board rationale) for the physics/INV-bound walls at 10⁹⁺.
2. **Required code:** Additive adapters implementing the existing `MetadataPort`/store interfaces (replacing `InMemory*` in `metadata-runtime`/`registry-runtime` at the adapter layer only); partitioned Evolution commit path per `CIV-GOV-001` v1.1.0 (already-designed governance-tier remediation).
3. **Required infrastructure:** Durable datastore + sharding provisioned in ENV-INT (`infra/persistence`); reuses REAL-C-02 topology.
4. **Required tests:** Load tests demonstrating the ~10⁶ architectural BREAK is lifted; durability/restore tests; baseline green with adapters swapped in.
5. **Required evidence:** Measured scale evidence (throughput past the prior breakpoint) feeding REAL-C-02's NFR pack; `CIV-STRESS-001` breakpoints BP-1..BP-15 re-evaluated.
6. **Required independent review:** Independent validation of adapter equivalence (ports unchanged) and of any `ACCEPTED-AS-GOVERNED-LIMIT` rationale.
7. **Required certification artifact:** Scale-remediation closure record and/or Board `ACCEPTED-AS-GOVERNED-LIMIT` decisions for INV-bound walls (INV-5 single-SoR, INV-6/EX1 synchronous determinism).

---

### REAL-H-06 — UCOM Program Closure Certificate
*Closes `ULT-H-06`. Effort: XL (aggregation). Class: certification realization — depends on the units it aggregates.*

1. **Exact deliverable:** Issued and ratified `UCOM-CERT-001` closing `UCOM-REMEDIATION-001` exit criteria EX-1..EX-6, including disposition of the residual M3 design item and RL-003..RL-017.
2. **Required code:** None new — aggregates the code delivered by REAL-H-03/H-04/H-05 and REAL-M-01 (policy extensibility).
3. **Required infrastructure:** None.
4. **Required tests:** Re-audit reproductions of the remediation-ledger items closed by their owning units; baseline green.
5. **Required evidence:** Remediation Ledger walked to CLOSED with per-item evidence citations; EX-1..EX-6 satisfaction table.
6. **Required independent review:** Independent adjudication of EX-1..EX-6 closure (distinct actor).
7. **Required certification artifact:** `UCOM-CERT-001` (the missing closure certificate). Prerequisite to an honest ULTIMATE declaration.

---

### REAL-H-07 — Authorization-Integrity Control (Retroactive-Enrollment Remediation)
*Closes `ULT-H-07`. Effort: M. Class: process realization + attestation.*

1. **Exact deliverable:** (a) Independent attestation of the Phase-21.1 retroactive AD-0016..0023 enrollment; (b) a governance control making ledger enrollment a **hard pre-construction gate** for all future construction.
2. **Required code:** Optional additive CI pre-flight check under `infra/delivery/**` that refuses a build whose authorizing AD is not present in the canonical `AUTH-012` ledger; else None.
3. **Required infrastructure:** Pre-construction gate wired into the CI pipeline bound in REAL-C-02.
4. **Required tests:** Gate test — build referencing an unenrolled AD is blocked; build with enrolled AD proceeds.
5. **Required evidence:** Independent attestation record of the retroactive reconciliation; gate-enforcement evidence from a pipeline run.
6. **Required independent review:** The retro-attestation *is* the independent review (REAL-C-05 actor); gate reviewed independently.
7. **Required certification artifact:** Authorization-integrity control record + retro-enrollment attestation (recorded in the REAL-C-05 attestation chain).

---

## 3. Supporting Units Required by the Objective (MEDIUM findings on the operational critical path)

These are not "High", but `ULT-C-02` **cannot close without them**; the objective (Operationally Certified) hard-depends on them, so they are specified here in the same seven-element frame at summary density.

| Unit | Deliverable | Code | Infra | Tests | Evidence | Indep. review | Cert artifact |
|------|-------------|------|-------|-------|----------|---------------|---------------|
| **REAL-M-04** (`ULT-M-04`) | PE-12 observability ADR decided | None | Telemetry stack selected + wired | Metric-capture smoke test | Recorded ADR + first captured metrics | ADR review (distinct actor) | `PE-12` ADR — **blocks G12-3** |
| **REAL-M-06** (`ULT-M-06`) | Quantitative CAP-01..14 NFR targets authored | None | None | N/A | Versioned NFR contract | Independent ASR review | `UCOS-ASR-NFR-001` update — defines the floors REAL-C-02 measures against |
| **REAL-M-01** (`ULT-M-01`) | Registry/metadata-extensible policy predicates | Additive `control/policy/**` (retire fixed switch) | None | New predicate added with **zero code change** | Re-audit UA-01 M3 PASS | Independent ratification | policy-extensibility closure — needed for REAL-H-06 |
| **REAL-M-03** (`ULT-M-03`) | `PROJECT-STATE` reconciled to reality | None | None | N/A | Append-only reconciliation subsection | Independent read-back | reconciliation note — needed for REAL-C-01/REAL-H-06 honesty |
| **REAL-M-07** (`ULT-M-07`) | Program committed/tagged to a remote | None | Git remote provisioned | Push/tag verified | Milestone tags on ratified states | Independent verify | release-governance record — durability of the certified corpus |

> M-02 (`ULT-M-02`, registry Class-A acceptance / Class-B realization) and M-05 (`ULT-M-05`, roadmap numbering) are **not** on the Operationally-Certified path; they attach to REAL-H-03 and a Board roadmap-recognition act respectively, on the way to ULTIMATE. LOW items `ULT-L-01/02/03` ride along with their owning units.

---

## 4. Dependency Order (realization-only; construction-first)

```
        REAL-C-05  Independent Adjudication  ──(enables element-6 of every unit)──┐
                                                                                  │
REAL-M-03  state reconcile ─┐                                                     │
REAL-C-01  fix terminal cert ┤── credible instrument layer                       │
REAL-H-02  enroll invariants ┘                                                    │
                                                                                  ▼
REAL-M-04 PE-12 ADR ─▶ REAL-M-06 quantitative NFRs ─▶ ┌───────────────────────────────┐
                                                      │  REAL-C-02  OPERATIONAL CERT   │  ◀── OBJECTIVE
REAL-H-05 durable persistence (feeds measured scale) ─┤  (needs env+pipeline+DR+NFR)  │
REAL-M-07 remote/commit (durability) ─────────────────┘                             │
                                                      └───────────────┬────────────┘
                                                                      ▼
                          [ everything below is BEYOND the Operationally-Certified objective ]
REAL-H-03 primitive convergence ─┐
REAL-H-04 anti-fragility          ├─▶ REAL-H-06  UCOM-CERT-001
REAL-H-01 PI-10/PI-11 fabrics ────┘        │
REAL-M-01 policy extensibility ────────────┘
                          ▼
REAL-C-03 full Article IX release ─▶ REAL-C-04 product build ─▶ FULLY REALIZABLE ─▶ ULTIMATE
REAL-H-07 authorization-integrity control (parallel governance hardening)
```

**Hard rules:**
1. **REAL-C-05 is the universal review predecessor** — no unit's element (6) is satisfiable until an independent actor exists. Establish it first (it is L-effort organizational, so start immediately, in parallel with docs work).
2. **REAL-M-04 → REAL-M-06 → REAL-C-02** is the strict operational spine.
3. **REAL-C-02 is the objective terminus.** REAL-C-03/C-04, REAL-H-01/03/04/06, REAL-M-01/02 lie *beyond* it on the ULTIMATE path and are **not required to declare Operationally Certified**.
4. **REAL-H-05** attaches to the operational path only to the extent measured scale evidence feeds REAL-C-02's NFR pack; its full 10⁹⁺ remediation is post-objective.

---

## 5. The Shortest Path — ARCHITECTURALLY COMPLETE → OPERATIONALLY CERTIFIED

> **This is the deliverable the mandate asks for: the minimal serial spine that reaches OPERATIONALLY CERTIFIED — nothing more.** Everything not on this spine is deferred to the ULTIMATE continuation (§6), because it is not a precondition of operational certification.

**Minimal critical path (7 steps):**

```
S1.  REAL-C-05   Establish independent adjudication authority          [org act; start immediately]
        ‖ REAL-M-03  reconcile PROJECT-STATE to reality (269/269)      [doc; parallel]
        ‖ REAL-C-01  re-issue terminal cert against verified state     [doc; parallel]
             │
S2.  REAL-M-04   Decide PE-12 observability ADR                         [Board ADR — gates metrics]
             ▼
S3.  REAL-M-06   Author quantitative NFR floors (CAP-01..14)            [defines acceptance thresholds]
             │   ‖ REAL-M-07  provision git remote; tag milestones      [durability; parallel]
             ▼
S4.  REAL-C-02 / G12-1   Provision ENV-DEV + ENV-INT                    [AD-0015 + AD-0009; human/real-spend]
             ▼
S5.  REAL-C-02 / G12-2   Execute pipeline + API-018/API-027 contracts   [human]
             ▼
S6.  REAL-C-02 / G12-3   DR drill + measured RPO/RTO/p99/availability   [human; vs REAL-M-06 floors]
             ▼
S7.  REAL-C-02 issuance  Independent VW-2 review → OPERATIONAL CERT      ⟶  OPERATIONALLY CERTIFIED
```

**Why this is the shortest path (and no shorter):**
- **Removed from the spine (not preconditions of operational certification):** REAL-C-03 (full Article IX release), REAL-C-04 (product build), REAL-H-01 (PI-10/PI-11), REAL-H-03 (convergence), REAL-H-04 (anti-fragility), REAL-H-06 (`UCOM-CERT-001`), REAL-M-01/02. Operational certification proves the **already-built PI-1 foundation** runs, is resilient, and meets NFRs — it does not require the upper fabrics, the product layer, or full generation release.
- **Irreducible on the spine:** independent review (S1) — without it every verdict is self-attested (`ULT-C-05`); PE-12 (S2) — without it G12-3 metrics cannot be captured; NFR floors (S3) — without them "meets floor" is undefined; and the strict G12-1→G12-2→G12-3 evidence chain (S4→S6) — each step's evidence is the next step's input. None can be dropped or reordered without breaking the evidence chain or the certification's defensibility.
- **The binding constraint is S4–S6** (human approvals + real cloud spend under AD-0015 + AD-0009). **Accelerators:** pre-approve the spend envelope; decide PE-12 (S2) at the same Board sitting that establishes REAL-C-05 (S1); pre-stage the `RA-2` `[HAR]` runbooks so S4→S6 execute back-to-back.

**Fail-closed behavior on the spine (non-optimistic):** a measured NFR below its REAL-M-06 floor, an undecided PE-12, a failed contract test, or a DR deficiency yields **CONDITIONAL / NOT ACHIEVED** at S7 — never a silent pass. Operational certification is withheld until the failing gate closes.

**Exit condition (OPERATIONALLY CERTIFIED):** G12-1 ∧ G12-2 ∧ G12-3 all CLOSED; measured RPO/RTO/p99/availability meet `UCOS-ASR-NFR-001` floors; evidence immutable and independently attested; **Operational Certification issued** (supersedes `UCOS-P12-CERT-001` PENDING). UCC-4 CLOSED.

---

## 6. Continuation Beyond the Objective (to FULLY REALIZABLE / ULTIMATE — for completeness, not part of the shortest path)

Once Operationally Certified, the remaining units close in this order to reach ULTIMATE (subsumes Operational):

```
REAL-C-03 full Article IX release   (needs REAL-C-02 + preconditions)
   ▼
REAL-H-01 PI-10/PI-11  ‖  REAL-H-03 convergence  ‖  REAL-H-04 anti-fragility  ‖  REAL-H-05 full-scale  ‖  REAL-M-01 policy ext.
   ▼
REAL-H-06 issue UCOM-CERT-001  (aggregates the above)
   ▼
REAL-C-04 product realization (per-increment, ratified)  ─▶  FULLY REALIZABLE
   ▼
UA-01 completeness re-audit COMPLETE  ─▶  ULTIMATE CERTIFICATION  ─▶  baseline freeze (ULT 1.0.0)
```

`ULT-D-01` (existential / `INV-14..20` / Ω∞ / Civilization actuation) remains **deferred, out of scope** throughout — its residual unknown-future risk is acknowledged, not eliminated.

---

## 7. Consolidated Realization Register

| Unit | Finding | Sev | Objective? | Effort | Terminal cert artifact |
|------|---------|:---:|:----------:|:------:|------------------------|
| REAL-C-05 | ULT-C-05 | CRIT | **spine (S1)** | L | Independent-Adjudication record + attestation chain |
| REAL-C-01 | ULT-C-01 | CRIT | **spine (S1)** | S | `UCOM-ULTIMATE-CERT-002` |
| REAL-M-03 | ULT-M-03 | MED | **spine (S1)** | S | PROJECT-STATE reconciliation note |
| REAL-M-04 | ULT-M-04 | MED | **spine (S2)** | S | PE-12 ADR |
| REAL-M-06 | ULT-M-06 | MED | **spine (S3)** | M | `UCOS-ASR-NFR-001` NFR floors |
| REAL-M-07 | ULT-M-07 | MED | **spine (S3∥)** | S | release-governance record |
| REAL-C-02 | ULT-C-02 | CRIT | **spine (S4–S7)** | XL | **Operational Certification** |
| REAL-H-05 | ULT-H-05 | HIGH | feeds spine (scale evidence) | XL | scale-remediation closure / governed-limit |
| REAL-C-03 | ULT-C-03 | CRIT | continuation | M | Article IX lock-release + construction auth |
| REAL-H-01 | ULT-H-01 | HIGH | continuation | XL | PI-10 + PI-11 ratifications |
| REAL-H-03 | ULT-H-03 | HIGH | continuation | L | UA-01 convergence closure (UCC-7) |
| REAL-H-04 | ULT-H-04 | HIGH | continuation | L | `AF-REM-001` ratification + `AF-VAL-001` |
| REAL-M-01 | ULT-M-01 | MED | continuation | M | policy-extensibility closure |
| REAL-H-02 | ULT-H-02 | HIGH | continuation | M | `AUTH-012` enactment + NFR v1.1.0 |
| REAL-H-07 | ULT-H-07 | HIGH | continuation | M | authorization-integrity control |
| REAL-H-06 | ULT-H-06 | HIGH | continuation | XL | `UCOM-CERT-001` |
| REAL-C-04 | ULT-C-04 | CRIT | beyond (FULLY REALIZABLE) | XL | per-increment ratifications |

**Count reconciliation:** all **5 CRITICAL** (C-01..C-05) and all **7 HIGH** (H-01..H-07) findings are specified with the seven mandatory elements; four MEDIUM units (M-01/03/04/06/07) are pulled onto the operational spine because `ULT-C-02` hard-depends on them.

---

## 8. Governance / Non-Mutation Statement

No source code, infrastructure, or authorization was produced by this artifact; no lock released; no invariant enrolled; no frozen construct modified; no ratified artifact mutated. `REAL-001` is a program specification. Every construction, provisioning, enrollment, lock-release, and certification act it names is a future Approval-Required Operation (AUTH-012 §8 / AD-0009) reserved to the UCOS Authority Board, to be executed only under the governed authorizations cited (AD-0015, AD-0022, the prospective AD-0024, and the full Article IX release). INV-1..13, `AUTH-012` substance, AD-0014 (Ω∞ deferral), the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged. Architecture and Governance remain FROZEN; this program adds **no** architecture, **no** governance, and performs **no** redesign — realization only.

## 9. Traceability
- **Consumes (authoritative input):** `ULT-GAP-001` (ULT-C-01..05, ULT-H-01..07, ULT-M-01..07, ULT-L-01..03, ULT-D-01).
- **Sequences with:** `ROADMAP-ULT-001` (U2.1–U2.15; REAL units map onto U2 phases).
- **Realizes against:** `UCOM-ULTIMATE-CERT-001` (UCC-1..7), `UCOS-P12-CERT-001` + `RA-1`/`RA-2` (G12-1/2/3), `INTEL-001`/`INT-*`/`INT-REM-*` (PI-10), `SIM-PLAN-001..003` (PI-11), `AUDIT-UNIV-001`/`AUTH-UNIV-001`/`LIFE-UNIV-001`/`UCOM-PRIMITIVE-001` (convergence), `AF-REM-001` (anti-fragility), `CIV-STRESS-001`/`CIV-GOV-001` v1.1.0 (scale), `UCOM-REMEDIATION-001` (EX-1..6), `EXIST-001`/`UA-05-CANONICAL-INVARIANTS` (invariants), `UCOS-SVC-ARCH-001`/`UCOS-EXP-ARCH-001`/`UCOS-IMP-PI-001` (product), `AUTH-REST-004`/`GOV-REC-001`/`MEM-RAT-003`/`ONTO-RAT-001` (authority/ratification state), `ARTICLE-IX-LOCK-RELEASE-REVIEW`.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), `UCOS-ASR-NFR-001` (INV-1..13), `UCOS-GOVERNANCE-BASELINE-1.0` (FROZEN), AD-0014.
- **Refined by:** the prospective Authority-Board acts closing REAL-C-01..05 and REAL-H-01..07, the Operational Certification, and `UCOM-CERT-001`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); independent adjudicator to be designated per REAL-C-05.

### OUTPUT

**`REAL-001` — CONSTRUCTION-FIRST REALIZATION EXECUTION PROGRAM COMPLETE · 5 CRITICAL + 7 HIGH FINDINGS EACH SPECIFIED WITH 7 REALIZATION ELEMENTS (DELIVERABLE / CODE / INFRA / TESTS / EVIDENCE / INDEPENDENT REVIEW / CERTIFICATION ARTIFACT) · SHORTEST PATH TO OPERATIONALLY CERTIFIED = 7-STEP SPINE [REAL-C-05 ∥ REAL-C-01 ∥ REAL-M-03 → REAL-M-04 → REAL-M-06 → REAL-C-02 (G12-1→G12-2→G12-3) → OPERATIONAL CERT] · REAL-C-03/C-04 + UPPER FABRICS DEFERRED TO ULTIMATE CONTINUATION · NO NEW ARCHITECTURE · NO NEW GOVERNANCE · NO REDESIGN · NO CODE / NO PROVISIONING / NO LOCK RELEASE PERFORMED BY THIS ARTIFACT.**

**END REAL-001 — PHASE U3 · CONSTRUCTION-FIRST REALIZATION EXECUTION PROGRAM · REALIZATION-ONLY · ARCHITECTURE & GOVERNANCE FROZEN · ULT-GAP-001 AUTHORITATIVE.**
