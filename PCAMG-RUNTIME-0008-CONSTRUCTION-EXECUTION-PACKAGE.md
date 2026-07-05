# PCAMG-RUNTIME-0008 — Construction Execution Package

> **CONSTRUCTION SPECIFICATIONS ONLY — FIRST CONSTRUCTION ARTIFACT**
> Prepared by the Constitutional Runtime Construction Authority for implementation teams. This package is
> implementation-ready specification: it **implements nothing**, **generates no source code**, **modifies no
> doctrine**, **releases no Article IX lock**, and **enrolls no corpus**. Execution of any component is gated
> on Authority Board approval of **PC-1** (scoped construction AD) and **PC-2** (scoped Article IX release)
> under the **P-REF** posture (PC-3).

| Field | Value |
|-------|-------|
| Artifact ID | `PCAMG-RUNTIME-0008` |
| Name | PCAMG Constitutional Governance Runtime — Construction Execution Package |
| Repository / Branch / Base commit | UCOS / `pcamg-runtime-certification` / `65deb4cec70e22427212396b32678750035b069c` |
| Date | 2026-07-05 |
| Mode | **CONSTRUCTION SPECIFICATION ONLY** — no code, no implementation, no release, no enrollment, no doctrine change |
| Posture assumed | **P-REF** (reference/advisory; supremacy & activation deferred) per `-0005`/`-0006`/`-0007` |
| Namespace root | `packages/platform-runtime/src/control/constitutional-governance/` (NG-1; abbrev **`…/cg/`**) |
| Inputs (read-only) | `-0001`..`-0007`; `SPEC-GOVERNANCE-COMPILER-RULES` §3/§4; `SPEC-GOVERNANCE-REGISTRIES` RG-1..8; `SPEC-CONSTITUTIONAL-VALIDATION-RULES`; `SPEC-TRACEABILITY-FRAMEWORK`; `SPEC-CONSTITUTIONAL-COMPLIANCE-FRAMEWORK`; `AUTH-008/009/012` |
| **Verdict** | **CONSTRUCTION PACKAGE APPROVED WITH CONDITIONS** |

---

## A. Construction Executive Summary

This package translates the certified specification (`-0001`), reference blueprint (`-0002`), execution plan
(`-0006`), and handoff (`-0007`) into an **implementation-ready construction specification** for eight runtime
subsystems: **Constitutional Runtime Core, Registry Runtime, Authority Runtime, Compliance Runtime, Audit
Runtime, Chronicle Runtime, Governance Compiler Runtime, and Traceability Runtime**. It defines ~34 runtime
components with IDs, contracts, registries, tests, evidence, acceptance criteria, readiness classification,
and a four-wave construction sequence mapping WP-1.1 → WP-8.4.

All construction is **additive** under `…/cg/`, disjoint from the existing UCOS Governance Fabric
(`governance/*`, GOV-001/002/003; NG-2/NG-3), with **zero prohibited-core-dir change** (CC-1) and **baseline
non-regression ≥ 443/443** (CC-3). Under **P-REF** the runtime produces governance **candidates, verdicts,
proofs, traces, and audit** — but its **activation authority is constructed inert** (no ACTIVE transition;
A-5 vacuous), **no principle is enrolled or supreme**, and the **ratified corpus prevails** on any divergence
(`PCAMG-7000` CR-8). Activation, supremacy, center/domain activation, and migration execution are
**out of scope** and permanently guarded here (reserved to a future enrollment/ratification determination).

The package is **complete and approvable**; it is **conditioned** on the two Board acts (PC-1, PC-2) and the
P-REF posture (PC-3), which this artifact does not and cannot perform.

---

## B. Runtime Component Inventory

> Per component: **Purpose · Inputs · Outputs · Dependencies · Constitutional Constraints (CC/IM)**.
> All components inherit CC-1 (additive), CC-4 (append-only), CC-11 (within released scope), and the standing
> invariants IM-2/3/4/11 and CR-8 (advisory/candidate-only).

### B.1 Constitutional Runtime Core

| Component ID | Purpose | Inputs | Outputs | Dependencies | Constraints |
|--------------|---------|--------|---------|--------------|-------------|
| `CGR-CORE-01` Shared types & record schema | Common `GovernanceRecord` + registry/relation enums | `-0001` §2.2 | type module | — | IM-10, CC-6 |
| `CGR-CORE-02` Append-only guard | Reject UPDATE/DELETE; supersession-link discipline | RG-2; INV-10 | guard module | CORE-01 | IM-7, CC-4 |
| `CGR-CORE-03` Hash & canonical serialization | Deterministic SHA-256 over canonical JSON; verify-on-read | RG-5/6; INV-6 | hashing module | CORE-01 | IM-9, CC-6 |
| `CGR-CORE-04` Control assembly & barrel | Orchestration seam + `index.ts` exports | `-0001` §9.1 | assembly module | CORE-01..03 | CC-1, CC-2 |
| `CGR-CORE-05` Test harness | Governance test infra; baseline pin 443/443 | CC-3 | harness | CORE-01 | CC-3 |

### B.2 Registry Runtime (11 registries)

| Component ID | Purpose | Inputs | Outputs | Dependencies | Constraints |
|--------------|---------|--------|---------|--------------|-------------|
| `CGR-REG-PRIN` | 15 invariant principles (9 attrs); propose-only | PCAMG-0000/0002 | REG-PRIN | Core | IM-1, CC-10 |
| `CGR-REG-META` | Meta-Constitution M-I..M-XII | PCAMG-0003/1000 | REG-META | REG-PRIN | IM-1 |
| `CGR-REG-GOV` | Generated governance candidates + gen records | PCAMG-0004 | REG-GOV | REG-PRIN/META | CC-8, CC-10 |
| `CGR-REG-CENTER` | Governance centers (`PGC-*`); acyclic delegation | PCAMG-0005 | REG-CENTER | REG-PRIN | IM-5 |
| `CGR-REG-DOMAIN` | Domain constitutions (`PDC-*`) | PCAMG-0005 | REG-DOMAIN | REG-CENTER | IM-1 |
| `CGR-REG-POLICY` | Policies; deny-by-default (effect='deny') | `-0001` §2.3 | REG-POLICY | REG-DOMAIN | IM-6, CC-5 |
| `CGR-REG-CAP` | Capability declarations | `-0001` §2.3 | REG-CAP | REG-DOMAIN/POLICY | IM-10 |
| `CGR-REG-CONSENT` | Consent grants/revocations (revocable) | PCAMG-8000; PRIN-003 | REG-CONSENT | Core | IM-6 |
| `CGR-REG-DECISION` | Decision records; SoD (proposer≠certifier≠ratifier) | AUTH-012 analog | REG-DECISION | Core | IM-10 |
| `CGR-REG-TRACE` | Derivation edges (8 relations); layer_to ≤ layer_from | SPEC-TRACEABILITY | REG-TRACE | Core | IM-5, IM-7 |
| `CGR-REG-AUDIT` | Hash-chained audit entries (genesis + append) | `-0001` §2.3/§8 | REG-AUDIT | CORE-03 | IM-8 |

### B.3 Authority Runtime

| Component ID | Purpose | Inputs | Outputs | Dependencies | Constraints |
|--------------|---------|--------|---------|--------------|-------------|
| `CGR-AR-RESOLVE` Authority Resolution Engine | Resolve authority chains; fail-closed | `-0001` §3 | authority-chain resolver | REG-PRIN/META/TRACE | IM-5, CC-5 |
| `CGR-AR-VALIDATE` Principle Validation Engine | VR-P/C/M/T/D/S/G rules; non-waivable | SPEC-VALIDATION-RULES | VR verdicts | AR-RESOLVE, TRACE | IM-6, CC-5 |
| `CGR-AR-SUPREMACY` Supremacy & Conflict | Principle-prevails; ratified prevails pre-enrollment; escalate unresolved | `-0001` §3.3/3.4 | supremacy verdicts | AR-RESOLVE/VALIDATE | IM-1, IM-13, CC-10 |

### B.4 Compliance Runtime

| Component ID | Purpose | Inputs | Outputs | Dependencies | Constraints |
|--------------|---------|--------|---------|--------------|-------------|
| `CGR-CP-STAGE1..4` Four-stage validators | Principle → Constitutional → Governance → Operational | `-0001` §7 | stage results | Authority, Trace, Audit | IM-6, CC-5 |
| `CGR-CP-PROOF` Proof generator | Ordered fail-closed proof; deterministic proof hash | `-0001` §7.3 | `ComplianceProof` | STAGE1..4 | CC-6 |
| `CGR-CP-ACTIVATE` Activation gate **(INERT)** | Build transition path; **cannot confer ACTIVE under P-REF** | `-0001` §7.5; A-5 | inert gate | CP-PROOF | **IM-12, CC-8, CC-10** |
| `CGR-CP-NONWAIVE` Non-waivable enforcement | S1/S3/S4 blocking at Stage 1/4 | AUTH-008; VR-S* | non-waivable gate | STAGE1/4 | IM-6, CC-5 |

### B.5 Audit Runtime

| Component ID | Purpose | Inputs | Outputs | Dependencies | Constraints |
|--------------|---------|--------|---------|--------------|-------------|
| `CGR-AU-CHAIN` Hash-chained append | Attributable, chained audit (A-1/A-2) | `-0001` §8.2 | audit append API | REG-AUDIT | IM-8, CC-4 |
| `CGR-AU-VERIFY` Chain verifier | Detect gap/break/tamper (A-2) | `-0001` §8.3 | chain verdict | AU-CHAIN | IM-8 |

### B.6 Chronicle Runtime

| Component ID | Purpose | Inputs | Outputs | Dependencies | Constraints |
|--------------|---------|--------|---------|--------------|-------------|
| `CGR-CH-EXPORT` Offline WORM export | DB-free verifiable chain (A-3) | `-0001` §8.4 | export + offline verify | AU-VERIFY | IM-8 |
| `CGR-CH-REPRODUCE` Verdict reproduction | Re-execute verdicts from evidence (A-4) | `-0001` §8.5 | reproduction result | AU-CHAIN; verdict producers | IM-9, CC-6 |
| `CGR-CH-NOSILENT` No-silent-activation | Every ACTIVE ⇒ one ACTIVATE proof (A-5) | `-0001` §8.6 | invariant check | CP-ACTIVATE, AU-CHAIN | IM-12, CC-8 |

### B.7 Governance Compiler Runtime

| Component ID | Purpose | Inputs | Outputs | Dependencies | Constraints |
|--------------|---------|--------|---------|--------------|-------------|
| `CGR-GC-RULES` CR-1..12 rule set | Canonical compilation rules | SPEC-COMPILER-RULES §3; `-0003A` B.1 | rule modules | REG-PRIN/META | **CC-7** |
| `CGR-GC-ERRORS` CE-* catalog (10) | Canonical typed errors; **no CE-UNRESOLVED** | §4 | error catalog | GC-RULES | **CC-7** |
| `CGR-GC-DETERMINISM` Deterministic compile | Reproducible `determinism_hash` (CR-9) | §5.4 | determinism module | GC-RULES | IM-9, CC-6 |
| `CGR-GC-FAILCLOSED` Fail-closed compile | Unresolved/ambiguous halts (CR-12) | §5.5 | fail-closed guard | GC-RULES | CC-5 |
| `CGR-GC-GENERATE` Candidate generation | Emit gen records to REG-GOV; **candidate-only** | §5.3 | REG-GOV writer | GC-RULES; REG-GOV | CC-8, CC-10 |

### B.8 Traceability Runtime

| Component ID | Purpose | Inputs | Outputs | Dependencies | Constraints |
|--------------|---------|--------|---------|--------------|-------------|
| `CGR-TR-GRAPH` Governance graph model | Vertices/edges; relational + projection | `-0001` §6.2/6.5 | graph model | REG-TRACE | IM-5 |
| `CGR-TR-VERIFY` Trace verifier | T-1/T-2/T-3/T-5 | `-0001` §6.3 | trace verdicts | TR-GRAPH | IM-5 |
| `CGR-TR-IMPACT` Impact analyzer | Downward impact (T-DOWN) | `-0001` §6.4 | impact report | TR-GRAPH | — |

---

## C. Repository Construction Map

Package = **`platform-runtime`** for all rows. Classification: **CREATE** (new), **EXTEND** (additive to
existing file, e.g. test scripts), **PROHIBITED** (must never be a target).

| Component group | Directory (`…/cg/…`) | Module(s) | Interface | Test location | Evidence location | Class |
|-----------------|----------------------|-----------|-----------|---------------|-------------------|:-----:|
| Core | `cg/` | `types.ts`, `append-only.ts`, `hashing.ts`, `governance-control.ts`, `index.ts` | `GovernanceRecordPort` | `test/cg/core/*` | `docs`/EV-CORE | CREATE |
| Registry | `cg/registries/` | `principle-registry.ts` … `audit-registry.ts` (11) | `RegistryPort<T>` | `test/cg/registries/*` | EV-REG | CREATE |
| Authority | `cg/engines/`, `cg/validation/` | `authority-resolution-engine.ts`, `vr-*.ts`, supremacy | `AuthorityResolutionPort`, `ValidationPort` | `test/cg/engines/*`, `test/cg/validation/*` | EV-AUTH | CREATE |
| Compliance | `cg/compliance/` | `stage-1..4.ts`, `proof-generator.ts`, `compliance-engine.ts` (inert) | `CompliancePort` | `test/cg/compliance/*` | EV-COMP | CREATE |
| Audit | `cg/audit/` | `audit-chain.ts`, `chain-verifier.ts` | `AuditPort` | `test/cg/audit/*` | EV-AUD | CREATE |
| Chronicle | `cg/audit/` | `offline-export.ts`, `verdict-reproducer.ts`, no-silent check | `ChroniclePort` | `test/cg/audit/*` | EV-CHR | CREATE |
| Compiler | `cg/compilation/` | `cr-*.ts` (12), CE catalog, determinism, fail-closed, generate | `CompilerPort` | `test/cg/compilation/*` | EV-CMPL | CREATE |
| Traceability | `cg/graph/` | `governance-graph.ts`, `trace-verifier.ts`, `impact-analyzer.ts` | `TraceabilityPort` | `test/cg/graph/*` | EV-TRC | CREATE |
| Test scripts | `packages/platform-runtime/package.json` (scripts) | — | — | — | — | EXTEND |
| Existing Governance Fabric | `src/control/governance/*` (GOV-001/002/003) | — | — | — | — | **PROHIBITED** |
| Substrate core dirs | `meta-core`,`registry-runtime`,`metadata-runtime`,`configuration-runtime`,`contracts` | — | — | — | — | **PROHIBITED** |
| Ratified fabrics | `control/federation|evolution|knowledge|memory|ontology/*` | reuse-only | — | — | — | **PROHIBITED** |
| Authority ledger | `.claude/authority/*` | — | — | — | — | **PROHIBITED** |

---

## D. Interface Contract Specifications

> Specification only — **no code**. Per boundary: **Commands** (state-proposing), **Events** (emitted facts),
> **Queries** (read-only), **DTOs** (shapes), **Validation Rules**, **Failure Modes** (all fail-closed, typed).

### D.1 Registry boundary (`RegistryPort`)
- **Commands:** `ProposeRecord(record)`, `SupersedeRecord(prior_uuid, successor)` — **no** `Update`/`Delete`.
- **Events:** `RecordProposed`, `RecordSuperseded` (audit-linked). **No** `RecordActivated` (P-REF).
- **Queries:** `GetByLogicalId(id@version)`, `ResolveLatest(logical_id)`, `ListByRegistry(type)`.
- **DTOs:** `GovernanceRecord` (§B.1 schema); `SupersessionLink{prior,successor,reason}`.
- **Validation Rules:** RG-1..8; single-owner (IM-10); content-hash on insert; up-trace ≥1 PRIN (except Layer-0).
- **Failure Modes:** `E-APPEND-ONLY` (mutation attempted), `E-OWNER` (missing/dup owner), `E-ORPHAN` (no up-trace), `E-AMBIGUOUS` (lookup) — all deny, no default.

### D.2 Compiler boundary (`CompilerPort`)
- **Commands:** `CompileGovernance(principles[], metaArticles[], params)` → candidate + generation record.
- **Events:** `GovernanceCandidateProduced`, `CompileRejected(CE-*)`. **No** activation event.
- **Queries:** `GetGenerationRecord(gov_uuid)`, `ReproduceCompile(gov_uuid)`.
- **DTOs:** `GenerationRecord{inputs, inputs_versions, rules_applied=CR-1..12, determinism_hash, errors[], candidate?}`.
- **Validation Rules:** CR-1..12 (canonical); CE-* = 10-code catalog; **no CE-UNRESOLVED**; candidate-only (CC-10).
- **Failure Modes:** `CE-UNROOTED|META|HARDCODE|OWNER|SOD|SEC|TRACE|NONDET|INVERSION|AMBIGUOUS`; blocking; no partial governance.

### D.3 Validation boundary (`ValidationPort`)
- **Commands:** `ValidateArtifact(ref)` → `ValidationRecord`.
- **Events:** `ArtifactValidated(verdict)`.
- **Queries:** `GetValidationRecord(uuid)`, `ReproduceValidation(uuid)`.
- **DTOs:** `ValidationRecord{rules_run[], verdict, findings[], determinism_hash}`.
- **Validation Rules:** VR-P/C/M/T/D/S/G; non-waivable (C,S) FAIL ⇒ overall FAIL.
- **Failure Modes:** `VR-*-FAIL`; non-waivable blocking; deterministic verdict.

### D.4 Compliance boundary (`CompliancePort`)
- **Commands:** `ProveCompliance(ref)` → `ComplianceProof`. `RequestActivation(ref, proof)` → **always denied under P-REF** (`E-ACTIVATION-DISABLED`).
- **Events:** `ComplianceProven(verdict)`. **No** `ArtifactActivated`.
- **Queries:** `GetProof(uuid)`, `ReproveCompliance(ref)`.
- **DTOs:** `ComplianceProof{stage_1..4, verdict∈{ACTIVATE_ELIGIBLE,REJECT}, findings[], determinism_hash}` — note verdict is *eligibility only*; no transition performed.
- **Validation Rules:** ordered stages; FAIL blocks later; non-waivable S1/S3/S4; A-5 (no silent activation).
- **Failure Modes:** `E-STAGE-ORDER`, `E-ACTIVATION-DISABLED` (P-REF), `E-NONWAIVABLE`.

### D.5 Audit / Chronicle boundary (`AuditPort` / `ChroniclePort`)
- **Commands:** `AppendAudit(action, subject, payload)`; `ExportChain(from,to)`.
- **Events:** `AuditAppended(seq)`, `ChainExported`.
- **Queries:** `VerifyChain(from,to)`, `VerifyOffline(export)`, `ReproduceVerdict(audit_ref)`.
- **DTOs:** `AuditEntry{seq, actor, action, subject_ref, prev_hash, entry_hash}`, `AuditExport{entries[], export_hash}`.
- **Validation Rules:** A-1..A-5; hash = sha256(prev‖payload‖seq‖actor); attributable; append-only.
- **Failure Modes:** `E-CHAIN-BROKEN`, `E-TAMPERED`, `E-SEQ-GAP` — fail-closed on read.

### D.6 Traceability boundary (`TraceabilityPort`)
- **Commands:** `AddEdge(from,to,relation)` (append-only).
- **Events:** `EdgeAdded`.
- **Queries:** `VerifyUpTrace(ref)`, `DetectCycles()`, `DetectOrphans()`, `AnalyzeImpact(principle)`.
- **DTOs:** `TraceEdge{from_ref,to_ref,relation,layer_from,layer_to}`, `TraceVerdict{rule,verdict}`.
- **Validation Rules:** T-1 (complete up-trace), T-2 (layer_to ≤ layer_from), T-3 (no orphans), T-5 (acyclic).
- **Failure Modes:** `T-1-FAIL|T-2-FAIL|T-3-FAIL|T-5-FAIL` — blocking.

---

## E. Registry Specifications

| Aspect | Specification |
|--------|---------------|
| **Required registries** | 11: REG-PRIN, REG-META, REG-GOV, REG-CENTER, REG-DOMAIN, REG-POLICY, REG-CAP, REG-CONSENT, REG-DECISION, REG-TRACE, REG-AUDIT (`SPEC-GOVERNANCE-REGISTRIES`). |
| **Registry ownership** | Every record declares exactly one `owner_authority` (RG-3 / PRIN-005 / IM-10). Registry custodianship: UCOS Authority Board (custodian Chief Authority Architect); construction owner = execution authority (AUTH-009 §6.3). |
| **Registry lifecycle** | `PROPOSED → SUPERSEDED/RETIRED` via append-only supersession links. **`ACTIVE` transition is disabled under P-REF** (no activation). No UPDATE/DELETE (RG-2 / INV-10). Version `(logical_id, version)` immutable. |
| **Registry validation rules** | RG-1 single source; RG-2 append-only; RG-3 single owner; RG-4 mandatory up-trace (≥1 PRIN except Layer-0); RG-5 tamper-evidence (content hash + audit chain); RG-6 determinism (canonical serialization); RG-7 secrets by-reference (no inline, S3); RG-8 fail-closed lookup. |
| **Registry evidence requirements** | Per registry: RG-1..8 conformance suite; append-only adversarial (mutation rejected); content-hash reproducibility; up-trace 0-orphan proof; deny-by-default proof (REG-POLICY); 0 ACTIVE records (P-REF). |

---

## F. Test Architecture

> Per component group: required test classes and coverage target. **Coverage** = statement/branch on new
> modules; **all** fail-closed paths must be exercised (no untested deny path).

| Component group | Unit | Integration | Determinism | Traceability | Compliance | Adversarial | Coverage |
|-----------------|:----:|:-----------:|:-----------:|:------------:|:----------:|:-----------:|:--------:|
| Core | ✅ schema/guard/hash | ✅ w/ registries | ✅ hash parity | — | — | ✅ mutation-reject | ≥95% |
| Registry | ✅ RG-1..8 per reg | ✅ cross-registry up-trace | ✅ content-hash | ✅ up-trace | ✅ propose-only | ✅ append-only breach | ≥95% |
| Authority | ✅ VR-* rules | ✅ resolution+validation | ✅ verdict hash | ✅ chain complete | ✅ non-waivable | ✅ supremacy bypass | ≥95% |
| Compliance | ✅ per stage | ✅ 4-stage ordered | ✅ proof hash | ✅ subject trace | ✅ fail-closed order | ✅ **activation attempt denied** | ≥95% |
| Audit | ✅ append/verify | ✅ w/ producers | ✅ chain hash | — | — | ✅ tamper injection | ≥95% |
| Chronicle | ✅ export/reproduce | ✅ offline verify | ✅ reproduction match | — | ✅ A-5 (0 ACTIVE) | ✅ export tamper | ≥95% |
| Compiler | ✅ CR-1..12 / CE-* | ✅ w/ registries | ✅ cross-run parity | ✅ gen→PRIN | ✅ candidate-only | ✅ catalog drift; unresolved halt | ≥95% |
| Traceability | ✅ T-1/2/3/5 | ✅ graph projection | — | ✅ orphan/cycle | — | ✅ cycle injection | ≥95% |
| **System** | — | ✅ end-to-end lifecycle | ✅ suite fingerprint | ✅ 0 orphans | ✅ CERT-* | ✅ threat suite 0 residual High/High | baseline **≥443/443** |

---

## G. Evidence Architecture

| Evidence class | Required artifacts |
|----------------|--------------------|
| **Construction** | Tree diff confined to `…/cg/`; core-dir freeze diff (0 changes); typecheck logs; per-WP output register (append-only). |
| **Validation** | Full VR-P/C/M/T/D/S/G results; non-waivable enforcement proofs; deterministic verdict hashes. |
| **Security** | S1 deny-by-default; S3 secrets-by-reference; S4 preserved; adversarial 0 residual High/High; **no custom cryptography** (reuse federation primitives). |
| **Compliance** | Four-stage proof ordered + fail-closed; CERT-* matrix pass; 0 ACTIVE (P-REF); baseline ≥443/443. |
| **Determinism** | Cross-run identical `determinism_hash` (compile/validate/proof); stable suite fingerprint; canonical serialization. |
| **Traceability** | 0 orphans; acyclic; downward-only; complete up-trace to ≥1 PRIN for every constructed artifact. |
| **Certification** | RUNTIME-0002 §10 CERT-* results; assembled evidence dossier; **independent** construction-certification report (0 blocking; SoD). |

---

## H. Acceptance Criteria

> Per component group: **AC** acceptance · **FC** failure · **EC** escalation · **CC-crit** certification.

| Group | Acceptance (AC) | Failure (FC) | Escalation (EC) | Certification (CC-crit) |
|-------|-----------------|--------------|-----------------|-------------------------|
| Core | Append-only + reproducible hash proven; baseline pinned | Mutation succeeds; non-reproducible hash | Core-dir write attempted | CERT append-only + hash |
| Registry | RG-1..8 pass; 15/15 principles; 0 ACTIVE | RG breach; ACTIVE conferred | Registry can't enforce RG-2/3 | CERT-RG + EX-1..5 |
| Authority | VR-* pass; ratified prevails; fail-closed resolve | Non-waivable weakened; downward authority | Unresolvable principle conflict | CERT-VR-* |
| Compliance | Ordered fail-closed proof; **activation inert** | Stage order broken; **any ACTIVE** | Activation not provably inert | CERT 4-stage; A-5 |
| Audit | Chain verifies; tamper detected | Chain break undetected | Audit sink unavailable | CERT-A1/A2 |
| Chronicle | Offline verify; verdict reproduced | Export tamper undetected; mismatch | Reproduction divergence | CERT-A3/A4/A5 |
| Compiler | CR-1..12 + 10-code CE; reproducible; candidate-only | Non-canonical catalog; CE-UNRESOLVED; partial gov | Catalog drift detected | CERT-CR1..12 (incl. CR-10) |
| Traceability | T-1/2/3/5 pass; 0 orphans/acyclic | Cycle/orphan/downward edge | Graph inconsistency | CERT-T-* |

---

## I. Construction Readiness Matrix

Classification: **READY** (design-complete, additive, constructable once PC-1/PC-2 enrolled) · **BLOCKED**
(dependency/precondition unmet) · **PROHIBITED** (out-of-scope authority-conferring operation, this scope).

| Component / operation | Class | Rationale |
|-----------------------|:-----:|-----------|
| CGR-CORE-01..05 | **READY** | Additive; certified design; no blocker. |
| CGR-REG-* (all 11) | **READY** | Propose-only; RG-1..8 certified; append-only. |
| CGR-AR-RESOLVE / VALIDATE / SUPREMACY | **READY** | Read/verify only; fail-closed; ratified prevails. |
| CGR-CP-STAGE1..4 / PROOF / NONWAIVE | **READY** | Verdict/proof only; deterministic; fail-closed. |
| CGR-CP-ACTIVATE (module) | **READY (INERT-only)** | Buildable **only** as an inert, deny-by-default gate; must be reviewed (handoff §F focal point). |
| CGR-AU-* / CGR-CH-* | **READY** | Append-only audit + offline verify + reproduction. |
| CGR-GC-* (all 5) | **READY** | Canonical catalog (CC-7); candidate-only. |
| CGR-TR-* (all 3) | **READY** | Graph + T-1/2/3/5 verification. |
| **Activation authority (conferring ACTIVE)** | **PROHIBITED** | C-10; requires enrollment/ratification (SEQ-2/3). |
| **Principle enrollment / supremacy operation** | **PROHIBITED** | C-11; ratified prevails (CR-8). |
| **Center/domain activation** | **PROHIBITED** | C-13; Program A-6 activation. |
| **Migration/adoption execution** | **PROHIBITED** | C-15; Board-gated migration acts. |
| **Whole package execution** | **BLOCKED until PC-1 + PC-2** | Article IX lock ACTIVE; no scoped release/AD enrolled yet. |

**Summary:** all ~30 build components **READY** (one INERT-constrained); 4 operations **PROHIBITED**;
execution **BLOCKED** solely on the two Board acts.

---

## J. Construction Sequencing Package (Four Waves)

Maps WP-1.1 → WP-8.4 (from `-0006`/`-0007`) into four waves. **Wave 0 (governance precondition):** PC-2
release → PC-1 AD → PC-3 = P-REF. No wave begins until Wave 0 is recorded on the `AUTH-012` ledger.

### Construction Wave 1 — Foundation (Core + Registries + Audit base)
- **Scope:** WP-1.1..1.5, WP-2.1..2.5, WP-5.1..5.2. Components CGR-CORE-*, CGR-REG-* (11), CGR-AU-CHAIN/VERIFY.
- **Deliverables:** namespace + schema + guards + hashing + harness; 11 propose-only registries; audit genesis + append/verify.
- **Exit gates:** typecheck clean; baseline **443/443** pinned; RG-1..8 pass; 0 ACTIVE; audit chain verifies.
- **Required evidence:** EV-CORE, EV-REG, EV-AUD (construction + append-only + hash + up-trace).

### Construction Wave 2 — Authority, Compiler & Traceability
- **Scope:** WP-3.1..3.4, WP-6.1..6.5, WP-3.3/TR. Components CGR-AR-*, CGR-GC-* (5), CGR-TR-* (3).
- **Deliverables:** authority resolution + VR-* + supremacy; CR-1..12 / CE-* / determinism / fail-closed / candidate generation; graph + T-1/2/3/5 + impact.
- **Exit gates:** VR-* incl. non-waivable pass; canonical catalog (no CE-UNRESOLVED); 0 orphans/acyclic; ratified prevails; candidate-only.
- **Required evidence:** EV-AUTH, EV-CMPL, EV-TRC (validation + determinism + traceability).

### Construction Wave 3 — Compliance & Chronicle
- **Scope:** WP-4.1..4.3, WP-5.3..5.5. Components CGR-CP-* (incl. inert activation), CGR-CH-*.
- **Deliverables:** four-stage ordered proof; **inert** activation gate; non-waivable enforcement; offline export; verdict reproduction; A-5 check.
- **Exit gates:** ordered fail-closed proof; **activation provably inert (0 ACTIVE)**; S1/S3/S4 blocking; offline verify + reproduction match.
- **Required evidence:** EV-COMP, EV-CHR (compliance + security + determinism); **WP-4.2 review sign-off**.

### Construction Wave 4 — Integration & Construction Certification
- **Scope:** WP-7.1..7.5, WP-8.1..8.4. Integration adapters; adversarial; baseline; CERT-*; independent certification; advisory conformance.
- **Deliverables:** substrate read-only + Evolution/Federation routing; adversarial suite; CERT-* matrix; evidence dossier; independent construction-certification report; advisory post-construction validator.
- **Exit gates:** zero prohibited-core-dir write; Evolution-routed; adversarial 0 residual High/High; ≥443/443; CERT-* pass; **independent report 0 blocking (SoD)**.
- **Required evidence:** EV-* full set + certification dossier (§G).

---

## K. Final Construction Authorization Assessment

| Dimension | Assessment | Basis |
|-----------|------------|-------|
| **Technical constructability** | **CONSTRUCTABLE** | ~30 components fully specified (contracts, tests, evidence, acceptance); additive; certified design. |
| **Constitutional compliance** | **COMPLIANT** | Every component mapped to CC-1..11 / IM-1..13 / AUTH-009 / AD-0014 / CR-8; activation inert; supremacy deferred; append-only + fail-closed + deterministic preserved. |
| **Repository readiness** | **READY** | `…/cg/` CREATE map; PROHIBITED targets fenced (core dirs, `governance/*`, ratified fabrics, ledger). |
| **Evidence readiness** | **READY** | Evidence architecture (§G) + per-component acceptance/certification (§H) + wave evidence gates (§J) fully defined. |
| **Validation readiness** | **READY** | Test architecture (§F) with coverage; CERT-* + independent certification (Wave 4); stop-work controls inherited from `-0007` §G. |

**Governing condition:** execution is **BLOCKED** until the Authority Board enacts **PC-1** and **PC-2** and
declares **PC-3 = P-REF**. The specification itself carries no design deficiency.

---

## Final Verdict

This construction execution package is complete, additive, deterministic, fail-closed, append-only, and
constitutionally mapped for direct use by implementation teams. It specifies every runtime component with
contracts, registries, tests, evidence, acceptance criteria, readiness classification, and a four-wave
sequence — while constructing nothing, generating no code, releasing no Article IX lock, and enrolling no
corpus. All mandated protections are preserved: AUTH-009 authority model, AD-0014 precedence, `PCAMG-7000`
CR-8 ratified-corpus supremacy, IM-1..IM-13, CC-1..CC-11, append-only governance, fail-closed behavior, and
deterministic execution. Because execution remains conditioned on the Board acts (PC-1, PC-2) and the P-REF
posture (PC-3) — and the activation gate must be constructed inert with mandated review — the determination
is conditional, not unconditional.

> ## VERDICT: CONSTRUCTION PACKAGE APPROVED WITH CONDITIONS

**Conditions (execution begins only when all are met):**
1. **PC-2** — scoped Article IX release enacted for `constitutional-governance/*` (scoped lock release).
2. **PC-1** — scoped construction AD enrolled on the `AUTH-012` ledger (conditional on PC-2).
3. **PC-3** — enrollment posture declared **P-REF** (advisory; supremacy/activation deferred).
4. **WP-4.2 (CGR-CP-ACTIVATE)** constructed **inert** with Board-review sign-off (no ACTIVE conferrable).
5. **WP-8.3** independent construction certification with separation of duties (0 blocking findings).

On satisfaction, construction proceeds Wave 1 → Wave 4 (§J) under §F tests, §G evidence, and §H acceptance;
PROHIBITED operations (activation authority, enrollment/supremacy, center/domain activation, migration
execution) remain reserved for a separate future enrollment/ratification determination.

**Scope discipline:** nothing implemented, no source code generated, Article IX **not** released, corpus
**not** enrolled, no doctrine created or modified. Construction specifications only.

---

## Package Provenance

| Item | Value |
|------|-------|
| Repository / Branch / Base commit | UCOS / `pcamg-runtime-certification` / `65deb4cec70e22427212396b32678750035b069c` |
| Predecessor chain | `-0001` → `-0002` → `-0003` → `-0003A` → `-0004` → `-0005` → `-0006` → `-0007` |
| Posture assumed | P-REF (reference/advisory; supremacy deferred) |
| Components specified | ~30 across 8 runtime subsystems |
| Construction waves | 4 (+ Wave 0 governance precondition) |
| Execution conditions | PC-1, PC-2, PC-3 (P-REF), inert WP-4.2, independent WP-8.3 |
| Preserved | AUTH-009; AD-0014; PCAMG-7000 CR-8; IM-1..IM-13; CC-1..CC-11; append-only; determinism; fail-closed |
| Verdict | **CONSTRUCTION PACKAGE APPROVED WITH CONDITIONS** |

**END PCAMG-RUNTIME-0008 — CONSTRUCTION EXECUTION PACKAGE · CONSTRUCTION SPECIFICATIONS ONLY · NOTHING IMPLEMENTED · NO SOURCE CODE · ARTICLE IX NOT RELEASED · CORPUS NOT ENROLLED · NO DOCTRINE CHANGE · APPEND-ONLY.**
