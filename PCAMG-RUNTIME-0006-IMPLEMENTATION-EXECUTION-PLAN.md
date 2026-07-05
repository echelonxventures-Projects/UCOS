# PCAMG-RUNTIME-0006 — Implementation Execution Plan

> **EXECUTION-PLANNING MATERIALS ONLY**
> Prepared by the Independent Constitutional Implementation Planning Authority. This plan is the artifact
> that would be used **immediately after** Authority Board approval of **PC-1** (scoped construction AD) and
> **PC-2** (scoped Article IX release). It **authorizes no construction**, **releases no Article IX lock**,
> **enrolls no corpus**, and **generates no implementation code**. It is planning only; every executable act
> remains gated on the Board acts prepared in `PCAMG-RUNTIME-0005`.

| Field | Value |
|-------|-------|
| Artifact ID | `PCAMG-RUNTIME-0006` |
| Name | PCAMG Constitutional Governance Runtime — Implementation Execution Plan |
| Repository / Branch / Base commit | UCOS / `pcamg-runtime-certification` / `65deb4cec70e22427212396b32678750035b069c` |
| Date | 2026-07-05 |
| Mode | **EXECUTION PLANNING ONLY** — no construction, no code, no release, no enrollment, no doctrine change |
| Posture assumed | **P-REF** (reference/advisory; supremacy & activation deferred) per `PCAMG-RUNTIME-0005` §C |
| Inputs (read-only) | `-0003` (certified), `-0003A` (findings closed), `-0004` (authorized w/ preconditions; C-01..C-15, CC-1..CC-11, IM-1..IM-13), `-0005` (authorization package; PC-1/PC-2/PC-3); `PCAMG-RUNTIME-0001` §9/§10; `PCAMG-RUNTIME-0002` §10; `SPEC-GOVERNANCE-COMPILER-RULES`; `AD-0023`; `AUTH-008/009/012`; `UCOS-CONST-001` Art. IX |
| **Verdict** | **READY FOR EXECUTION WITH PRECONDITIONS** |

---

## A. Executive Summary

The PCAMG Constitutional Governance Runtime is **constitutionally certified, remediated, authorizable, and
governance-gated**. This plan sequences its **additive, advisory** construction under the disambiguated
namespace `packages/platform-runtime/src/control/constitutional-governance/*` (NG-1) into **eight phases**
and **~30 work packages**, each bound to the certified constraints CC-1..CC-11 and the immutable invariants
IM-1..IM-13.

The plan is **execution-ready but not executable**: it presupposes two Board acts that have **not** occurred
— **PC-1** (scoped construction AD on the `AUTH-012` ledger) and **PC-2** (scoped Article IX release per
`PCAMG-RUNTIME-0005` §B). Until both are enrolled, the Article IX lock is **ACTIVE** and no work package may
begin. Under the recommended **P-REF** posture, the runtime is built as a **reference/advisory** fabric: it
compiles, validates, traces, and audits governance candidates, but its **activation authority remains inert**
(no artifact is transitioned to ACTIVE), its **principles are not enrolled or supreme**, and the **ratified
corpus prevails** on any divergence (`PCAMG-7000` CR-8). Activation, supremacy, and migration execution
(capabilities C-10/C-11/C-13/C-15 in `-0004`) are **out of scope** and reserved for a separate future
enrollment/ratification determination.

Key guarantees preserved throughout: additive-only with **zero prohibited-core-dir change**; baseline
**non-regression ≥ 443/443**; append-only (INV-10); deterministic (INV-6); fail-closed (CR-12 / S1);
no-silent-activation (A-5); AD-0014 Ω∞ boundary intact; non-waivable S1/S3/S4 preserved.

---

## B. Construction Work Breakdown Structure (WBS)

> Notation per WP: **Obj** objective · **In** inputs · **Out** outputs · **Dep** dependencies · **CC**
> constitutional constraints (from `-0004` §B) · **AC** acceptance criteria · **Ev** evidence required.
> All WPs are **CREATE** under `src/control/constitutional-governance/*` unless noted; all inherit CC-1
> (additive), CC-4 (append-only), CC-11 (within release scope).

### Phase 1 — Constitutional Runtime Skeleton

**WP-1.1 — Namespace scaffold & barrel**
- **Obj** Establish disambiguated root, `types.ts`, `index.ts`, module folders (registries/engines/graph/audit/validation/compilation/compliance).
- **In** NG-1..NG-4; RUNTIME-0001 §9.1 tree. **Out** empty typed module skeleton + barrel exports.
- **Dep** — (first). **CC** CC-1, CC-2. **AC** builds/typechecks clean; no `governance/*` co-location; no bare `governance-registry.ts`. **Ev** typecheck log; tree diff confined to new root.

**WP-1.2 — Common `GovernanceRecord` schema & shared types**
- **Obj** Shared record schema (record_uuid, logical_id, version, owner_authority, status, supersedes, audit_ref, content, content_hash, created_at/by).
- **In** RUNTIME-0001 §2.2. **Out** shared type module. **Dep** WP-1.1. **CC** CC-4, CC-6, IM-10. **AC** single-owner + version-immutability types enforced. **Ev** type definitions; unit typecheck.

**WP-1.3 — Append-only enforcement primitives**
- **Obj** Mutation guards rejecting UPDATE/DELETE; supersession-link discipline (INV-10).
- **In** RG-2; INV-10. **Out** append-only guard module + triggers spec. **Dep** WP-1.2. **CC** CC-4, IM-7. **AC** any UPDATE/DELETE path rejected fail-closed. **Ev** adversarial mutation tests rejected.

**WP-1.4 — Content-hash & canonical serialization**
- **Obj** Deterministic SHA-256 over canonical JSON; verify-on-read (RG-5/RG-6, INV-6).
- **In** RUNTIME-0001 §2.4. **Out** hashing/serialization module. **Dep** WP-1.2. **CC** CC-6, IM-9. **AC** re-serialize → byte-identical hash. **Ev** reproducibility test (stable digest).

**WP-1.5 — Test harness & baseline pin**
- **Obj** Governance test harness; pin full-suite baseline at **443/443**.
- **In** CC-3; `-0003A` F-02. **Out** harness under `test/` (**EXTEND**). **Dep** WP-1.1. **CC** CC-3. **AC** existing 443 green; harness additive. **Ev** pre-construction suite run 443/443.

### Phase 2 — Registry Runtime

**WP-2.1 — REG-PRIN (Layer 0)**
- **Obj** 15 invariant-principle records, 9 mandated attributes, unique UUIDs — **propose-only** (no activation).
- **In** PCAMG-0000/0002; RG-1..8. **Out** `principle-registry.ts`. **Dep** Phase 1. **CC** CC-4, CC-10, IM-1. **AC** VR-P1/P2 pass; 15/15 records; no ACTIVE transition. **Ev** well-formedness test; UUID uniqueness.

**WP-2.2 — REG-META** · **Obj** M-I..M-XII articles. **In** PCAMG-0003/1000. **Out** `meta-registry.ts`. **Dep** WP-2.1. **CC** CC-4. **AC** article derivation to PRIN present. **Ev** derivation trace test.

**WP-2.3 — REG-TRACE** · **Obj** derivation edges (8 relations); layer_to ≤ layer_from. **In** SPEC-TRACEABILITY-FRAMEWORK. **Out** `trace-registry.ts`. **Dep** WP-2.1. **CC** CC-4, IM-7. **AC** downward-only edges; append-only. **Ev** edge integrity test.

**WP-2.4 — REG-AUDIT (genesis)** · **Obj** hash-chained audit seed. **In** RUNTIME-0001 §2.3/§8. **Out** `audit-registry.ts`. **Dep** WP-1.4. **CC** CC-4, IM-8. **AC** genesis hash fixed; chain-linkable. **Ev** genesis + first-append chain test.

**WP-2.5 — Remaining 7 registries**
- **Obj** REG-GOV, REG-CENTER, REG-DOMAIN, REG-POLICY, REG-CAP, REG-CONSENT, REG-DECISION (propose-only; no activation).
- **In** RUNTIME-0001 §2.3. **Out** 7 registry modules. **Dep** WP-2.1..2.4. **CC** CC-4, CC-8, CC-10. **AC** RG-1..8 across all; deny-by-default (REG-POLICY effect='deny'). **Ev** RG-1..8 conformance suite.

### Phase 3 — Authority Runtime

**WP-3.1 — Authority Resolution Engine** · **Obj** resolve authority chains; fail-closed on missing/ambiguous. **In** RUNTIME-0001 §3. **Out** `authority-resolution-engine.ts`. **Dep** Phase 2. **CC** CC-5, IM-5. **AC** partial chain → error; no default. **Ev** fail-closed resolution tests.

**WP-3.2 — Principle Validation Engine (VR-*)** · **Obj** VR-P/C/M/T/D/S/G rules; non-waivable enforcement. **In** SPEC-CONSTITUTIONAL-VALIDATION-RULES. **Out** `validation/vr-*.ts`. **Dep** WP-3.1. **CC** CC-5, IM-6. **AC** non-waivable FAIL blocks; deterministic verdict hash. **Ev** VR-* suite incl. non-waivable.

**WP-3.3 — Traceability / Graph Engine** · **Obj** T-1/T-2/T-3/T-5 verification; impact analysis. **In** RUNTIME-0001 §6. **Out** `graph/*`, `traceability-engine.ts`. **Dep** WP-2.3. **CC** CC-6, IM-5. **AC** 0 orphans; acyclic; downward-only. **Ev** cycle/orphan detection tests.

**WP-3.4 — Supremacy & conflict detection** · **Obj** principle-prevails; conflict detection escalates (no auto-resolve). **In** RUNTIME-0001 §3.3/§3.4. **Out** supremacy module. **Dep** WP-3.1..3.3. **CC** CC-5, CC-10, IM-1, IM-13. **AC** ratified prevails pre-enrollment; unresolved → escalate. **Ev** supremacy + coexistence tests.

### Phase 4 — Compliance Runtime

**WP-4.1 — Four-stage proof engine** · **Obj** ordered Stage 1→4, fail-closed. **In** RUNTIME-0001 §7. **Out** `compliance/stage-1..4.ts`, `proof-generator.ts`. **Dep** Phase 3, Phase 5. **CC** CC-5, CC-6. **AC** FAIL at stage N blocks N+1; deterministic proof hash. **Ev** four-stage + fail-closed ordering tests.

**WP-4.2 — Activation gate (INERT under P-REF)** · **Obj** build the activation transition path but leave it **inert** — no artifact transitioned to ACTIVE. **In** RUNTIME-0001 §7.5; A-5. **Out** `compliance-engine.ts` (activation disabled/guarded). **Dep** WP-4.1. **CC** CC-8, CC-10, IM-12. **AC** activation path exists but **cannot** confer ACTIVE without a future enrollment/ratification authorization; default deny. **Ev** test proving no ACTIVATE possible under P-REF. **[IMPLEMENTABLE WITH REVIEW — see §G]**

**WP-4.3 — Non-waivable enforcement (S1/S3/S4)** · **Obj** Stage 1 / Stage 4 non-waivable gates. **In** AUTH-008; VR-S*. **Out** non-waivable module. **Dep** WP-4.1. **CC** CC-5, IM-6. **AC** S1/S3/S4 weakening → blocking FAIL. **Ev** non-waivable adversarial tests.

### Phase 5 — Audit & Chronicle Runtime

**WP-5.1 — Hash-chained append (A-1/A-2)** · **Obj** attributable, chained audit entries. **In** RUNTIME-0001 §8.2. **Out** `audit/audit-chain.ts`. **Dep** WP-2.4. **CC** CC-4, IM-8. **AC** entry_hash = sha256(prev‖payload‖seq‖actor). **Ev** chain-append test.

**WP-5.2 — Chain verification** · **Obj** detect gap/break/tamper. **In** RUNTIME-0001 §8.3. **Out** `chain-verifier.ts`. **Dep** WP-5.1. **CC** IM-8. **AC** tamper → BROKEN/TAMPERED verdict. **Ev** tamper-injection test.

**WP-5.3 — Offline WORM export (A-3)** · **Obj** exportable, DB-free verifiable chain. **In** §8.4. **Out** `offline-export.ts`. **Dep** WP-5.2. **CC** IM-8. **AC** offline verify passes. **Ev** export + offline-verify test.

**WP-5.4 — Verdict reproduction (A-4)** · **Obj** re-execute verdicts from audit evidence. **In** §8.5. **Out** `verdict-reproducer.ts`. **Dep** WP-5.1; Phase 3/4/6 verdict producers. **CC** CC-6, IM-9. **AC** reproduced verdict + hash match. **Ev** reproduction test.

**WP-5.5 — No-silent-activation binding (A-5)** · **Obj** every ACTIVE has exactly one ACTIVATE proof. **In** §8.6. **Out** invariant check. **Dep** WP-4.2, WP-5.1. **CC** CC-8, IM-12. **AC** under P-REF: 0 ACTIVE records ⇒ vacuously satisfied. **Ev** audit invariant test.

### Phase 6 — Governance Compiler Runtime

**WP-6.1 — CR-1..12 rule modules (canonical)** · **Obj** implement `CR-1..12` exactly per canonical catalog (CC-7). **In** SPEC-GOVERNANCE-COMPILER-RULES §3; `-0003A` B.1. **Out** `compilation/cr-*.ts`. **Dep** Phase 2, Phase 3. **CC** CC-7. **AC** CR-10=Append-only, CR-12=Fail-closed; rules_applied=CR-1..12. **Ev** CR-1..12 conformance suite.

**WP-6.2 — CE-* typed errors (10-code)** · **Obj** exactly the canonical 10 codes; **no** CE-UNRESOLVED. **In** §4. **Out** error catalog module. **Dep** WP-6.1. **CC** CC-7. **AC** catalog = {UNROOTED,META,HARDCODE,OWNER,SOD,SEC,TRACE,NONDET,INVERSION,AMBIGUOUS}. **Ev** catalog assertion test.

**WP-6.3 — Deterministic compilation (CR-9)** · **Obj** pinned-version pure compile; reproducible hash. **In** §5.4. **Out** determinism module. **Dep** WP-6.1. **CC** CC-6, IM-9. **AC** identical inputs → identical hash cross-run. **Ev** cross-run reproducibility.

**WP-6.4 — Fail-closed compilation (CR-12)** · **Obj** unresolved/ambiguous halts; no partial governance. **In** §5.5. **Out** fail-closed guard. **Dep** WP-6.1. **CC** CC-5. **AC** unresolved input → typed CE, no candidate emitted. **Ev** fail-closed compile tests.

**WP-6.5 — Generation records → REG-GOV (candidate-only)** · **Obj** emit generation records as **candidates**; never activate. **In** §5.3. **Out** compiler→REG-GOV writer. **Dep** WP-2.5, WP-6.1..6.4. **CC** CC-8, CC-10. **AC** candidates only; no ACTIVE. **Ev** candidate-only test.

### Phase 7 — Integration Validation

**WP-7.1 — Substrate integration (read-only)** · **Obj** resolve via metadata/registry runtime read-only. **In** RUNTIME-0001 §1.2. **Out** integration adapters. **Dep** Phases 2–6. **CC** CC-1, CC-9. **AC** zero prohibited-core-dir write. **Ev** core-dir freeze diff.

**WP-7.2 — Evolution/Federation routing** · **Obj** governed mutation via Evolution (PI-6/AD-0019); federation respects PI-5/AD-0018. **In** §1.2. **Out** routing adapters. **Dep** WP-7.1. **CC** CC-9. **AC** all mutation Evolution-routed; no bypass. **Ev** routing test.

**WP-7.3 — Adversarial suite** · **Obj** threat scenarios (supremacy bypass, silent activation, append-only violation, catalog drift). **In** RUNTIME-0002 §10. **Out** adversarial tests (**EXTEND**). **Dep** Phases 2–6. **CC** CC-5, CC-8. **AC** all adversarial fail-closed. **Ev** adversarial results 0 residual High/High.

**WP-7.4 — Baseline non-regression** · **Obj** full suite ≥443/443 + additive governance tests. **In** CC-3. **Out** suite report. **Dep** all prior. **CC** CC-3. **AC** ≥443/443; new tests additive. **Ev** post-integration suite run.

**WP-7.5 — Determinism / cross-node reproduction** · **Obj** stable fingerprints across runs. **In** INV-6. **Out** determinism report. **Dep** WP-6.3, WP-5.4. **CC** CC-6, IM-9. **AC** stable fingerprint. **Ev** cross-run digest parity.

### Phase 8 — Construction Certification

**WP-8.1 — Certification suite (CERT-*)** · **Obj** run RUNTIME-0002 §10 CERT-* (RG/EX/VR/CR/A/4-stage). **In** RUNTIME-0002 §10. **Out** cert results. **Dep** Phase 7. **CC** all CC. **AC** CERT-* pass; CERT-CR10 present; no CE-UNRESOLVED. **Ev** cert matrix.

**WP-8.2 — Evidence package assembly** · **Obj** assemble §F evidence set. **In** all WP evidence. **Out** evidence dossier. **Dep** WP-8.1. **CC** CC-4. **AC** every §F item present. **Ev** evidence index.

**WP-8.3 — Independent construction certification** · **Obj** independent review (analogous to `-0003`), external actor. **In** WP-8.2. **Out** construction certification report. **Dep** WP-8.2. **CC** IM-13; SoD. **AC** 0 blocking findings. **Ev** independent report. **[bottleneck — §I]**

**WP-8.4 — Post-construction conformance readiness** · **Obj** stage automated `SPEC-CONSTITUTIONAL-VALIDATION-RULES` as post-construction gate (SEQ-5), **advisory**. **In** `-0003A` SEQ-5. **Out** conformance harness. **Dep** WP-8.3. **CC** CC-10. **AC** validator runs advisory; no activation. **Ev** conformance run (advisory).

---

## C. Repository Impact Matrix

| Artifact | Path | Classification | Note |
|----------|------|:--------------:|------|
| Runtime source root | `packages/platform-runtime/src/control/constitutional-governance/*` | **CREATE** | NG-1 disambiguated root |
| 11 registry modules | `…/constitutional-governance/registries/*` | **CREATE** | REG-PRIN..REG-AUDIT |
| 5 engines | `…/engines/*` | **CREATE** | authority/validation/compiler/traceability/compliance |
| Graph / audit / validation / compilation / compliance dirs | `…/graph|audit|validation|compilation|compliance/*` | **CREATE** | per RUNTIME-0001 §9.1 (rebased to NG-1) |
| Barrel & control assembly | `…/index.ts`, `…/governance-control.ts` | **CREATE** | no name clash with existing fabric |
| Test suites | `packages/platform-runtime/test/control/constitutional-governance/*` | **CREATE / EXTEND** | additive; harness EXTENDs suite |
| Package test scripts | `packages/platform-runtime/package.json` (scripts only) | **EXTEND** | additive test globs only; no dep/behavior change |
| Metadata namespaces | `constitutional-governance:*` | **CREATE** | disjoint from `governance:*` |
| Registries (logical) | REG-PRIN/META/GOV/CENTER/DOMAIN/POLICY/CAP/CONSENT/DECISION/TRACE/AUDIT | **CREATE** | metadata-backed; append-only |
| Existing UCOS Governance Fabric | `…/src/control/governance/governance-registry.ts` (GOV-001/002/003) | **PROHIBITED** | NG-2/NG-3; read-only reference at most |
| Substrate core dirs | `meta-core`, `registry-runtime`, `metadata-runtime`, `configuration-runtime`, `contracts` | **PROHIBITED** | CC-1; void-on-touch (§H) |
| Ratified fabrics | `src/control/federation|evolution|knowledge|memory|ontology/*` | **PROHIBITED** | reuse-only; behavior unchanged |
| Migration artifacts | enrollment/adoption records (A-1..A-7) | **PROHIBITED (this scope)** | not executed under P-REF; planned-only, deferred to enrollment determination |
| Frozen baseline | `UCOS-GOVERNANCE-BASELINE` | **PROHIBITED** | no mutation; 443/443 preserved |
| Article IX / AUTH-012 ledger | `.claude/authority/*` | **PROHIBITED (by this plan)** | only the Board enrolls PC-1/PC-2 acts |

---

## D. Implementation Phases

| Phase | Scope | Deliverables | Dependencies | Exit Criteria |
|:-----:|-------|--------------|:------------:|---------------|
| **1 · Constitutional Runtime Skeleton** | Namespace, shared schema, append-only + hashing primitives, harness | WP-1.1..1.5 | PC-1, PC-2 enrolled | Typecheck clean; append-only + hash reproducibility proven; baseline 443/443 pinned |
| **2 · Registry Runtime** | 11 registries (propose-only), RG-1..8 | WP-2.1..2.5 | Phase 1 | RG-1..8 conformance; 15/15 principles; deny-by-default; 0 ACTIVE |
| **3 · Authority Runtime** | Resolution, VR-*, traceability, supremacy | WP-3.1..3.4 | Phase 2 | Fail-closed resolution; VR-* incl. non-waivable; 0 orphans/acyclic; ratified prevails |
| **4 · Compliance Runtime** | 4-stage proof, inert activation gate, non-waivable | WP-4.1..4.3 | Phase 3, Phase 5 | Ordered fail-closed proof; activation inert (no ACTIVE); S1/S3/S4 enforced |
| **5 · Audit & Chronicle Runtime** | Hash-chain, verify, WORM export, reproduction, A-5 | WP-5.1..5.5 | Phase 2 (WP-2.4) | A-1..A-5 satisfied; tamper detected; offline verify passes |
| **6 · Governance Compiler Runtime** | CR-1..12, CE-* (10), determinism, fail-closed, candidate REG-GOV | WP-6.1..6.5 | Phase 2, Phase 3 | Canonical catalog in force; reproducible; candidate-only; no CE-UNRESOLVED |
| **7 · Integration Validation** | Substrate/Evolution/Federation integration; adversarial; baseline; determinism | WP-7.1..7.5 | Phases 2–6 | Zero core-dir write; Evolution-routed; adversarial fail-closed; ≥443/443; stable fingerprint |
| **8 · Construction Certification** | CERT-* suite, evidence, independent cert, post-construction conformance readiness | WP-8.1..8.4 | Phase 7 | CERT-* pass; independent report 0 blocking; evidence complete; validator staged advisory |

---

## E. Constitutional Compliance Gates

| Phase | Mandatory Invariants | Fail Conditions | Stop Conditions | Escalation Conditions | Board Review Conditions |
|:-----:|----------------------|-----------------|-----------------|-----------------------|-------------------------|
| **1** | IM-7, IM-9, CC-1/2/3 | Append-only bypass; non-reproducible hash; core-dir write | Any prohibited-dir modification | Namespace collision with `governance/*` | None (mechanical) |
| **2** | IM-1, IM-7, IM-10, RG-1..8 | Missing owner; UPDATE/DELETE succeeds; UUID collision | Any ACTIVE transition attempted | Registry cannot enforce RG-2/RG-3 | None unless activation attempted |
| **3** | IM-1, IM-5, IM-6, IM-13 | Orphan/cycle; downward-authority; non-waivable weakened | Ratified corpus overridden pre-enrollment | Unresolvable principle conflict | Any supremacy assertion over ratified |
| **4** | IM-6, IM-12, CC-8 | Stage ordering broken; **any ACTIVE conferred** | Activation gate becomes live | Activation path not provably inert | **Any activation capability** → Board |
| **5** | IM-8, IM-9 | Chain break/tamper undetected; verdict irreproducible | Audit sink unavailable (fail-closed) | Reproduction mismatch | None |
| **6** | IM-9, CC-5, CC-7 | Non-canonical CR/CE; CE-UNRESOLVED present; partial governance emitted | Non-deterministic compile | Catalog drift detected | Any change to canonical catalog |
| **7** | CC-1, CC-3, CC-9, IM-9 | Core-dir write; baseline <443; mutation bypasses Evolution | Baseline regression | Adversarial residual High/High | Integration touching ratified behavior |
| **8** | IM-13, all CC | CERT-* fail; independent blocking finding | Evidence incomplete | Certifier = constructor (SoD breach) | **Independent certification result → Board** |

**Cross-cutting (all phases):** Article IX scope honored (CC-11); AD-0014 Ω∞ boundary (IM-11) — any INV-14..20
touch is an immediate **Stop + Board**; `PCAMG-7000` CR-8 ratified-supremacy preserved; fail-closed default.

---

## F. Evidence Requirements

| Domain | Required evidence |
|--------|-------------------|
| **Construction** | Tree diff confined to NG-1 root; core-dir freeze diff (0 changes); typecheck logs; WP-by-WP output register (append-only). |
| **Validation** | Full VR-P/C/M/T/D/S/G suite results; non-waivable enforcement proofs; deterministic verdict hashes. |
| **Security** | S1 deny-by-default proof; S3 secrets-by-reference (no inline); S4 preserved; adversarial suite 0 residual High/High; **no custom cryptography** (reuse federation primitives). |
| **Determinism** | Cross-run identical `determinism_hash` for compile + validate + proof; stable suite fingerprint; canonical serialization tests. |
| **Traceability** | 0 orphans; acyclic graph; downward-only edges; complete up-trace to ≥1 PRIN for every constructed artifact. |
| **Auditability** | Hash-chain continuity (A-2); attributable actors (A-1); offline WORM verify (A-3); verdict reproduction (A-4); no-silent-activation (A-5) — vacuously 0 ACTIVE under P-REF. |
| **Compliance** | Four-stage proof ordered + fail-closed; CERT-* matrix pass; baseline ≥443/443; independent construction certification report (0 blocking). |

---

## G. Acceptance Matrix

Capabilities carried from `PCAMG-RUNTIME-0004` §A, re-classified for **implementability under P-REF + PC-1/PC-2**.

| Capability | Classification | Rationale |
|------------|:--------------:|-----------|
| C-01 Design/specification | **IMPLEMENTABLE** | Complete; no construction implied. |
| C-02 Registry substrate | **IMPLEMENTABLE** | Additive; RG-1..8 certified; propose-only. |
| C-03 Core registries | **IMPLEMENTABLE** | Propose-only; append-only enforced. |
| C-04 Authority Resolution Engine | **IMPLEMENTABLE** | Read-only resolution; fail-closed. |
| C-05 Principle Validation Engine | **IMPLEMENTABLE** | VR-* design-verified. |
| C-06 Governance Compiler | **IMPLEMENTABLE** | Canonical catalog in force (CC-7); candidate-only. |
| C-07 Traceability Graph Engine | **IMPLEMENTABLE** | T-1/2/3/5 certified. |
| C-08 Audit & Chronicle | **IMPLEMENTABLE** | A-1..5 specified; append-only. |
| C-09 Compliance 4-stage proof (build) | **IMPLEMENTABLE WITH REVIEW** | Proof engine buildable; must be reviewed to confirm activation stays inert (WP-4.2). |
| C-12 Polycentric centers/domains (build) | **IMPLEMENTABLE WITH REVIEW** | Constructible as records; review to ensure no activation of `PGC-*`/`PDC-*`. |
| C-14 Substrate/fabric integration | **IMPLEMENTABLE WITH REVIEW** | Read-only/additive; review confirms zero prohibited-core-dir write. |
| C-10 Activation authority | **NOT IMPLEMENTABLE** | Authority-conferring; requires enrollment+ratification (SEQ-2/3); out of scope under P-REF. |
| C-11 Principle enrollment / supremacy | **NOT IMPLEMENTABLE** | Requires enrollment/ratification act; ratified prevails (CR-8). |
| C-13 Center/domain activation | **NOT IMPLEMENTABLE** | Activation reserved to later determination. |
| C-15 Migration/adoption execution | **NOT IMPLEMENTABLE** | Program A-1..A-7 execution is a separate Board-gated act, not construction. |

**Roll-up:** IMPLEMENTABLE = 8 · IMPLEMENTABLE WITH REVIEW = 3 · NOT IMPLEMENTABLE = 4.

---

## H. Rollback & Revocation Plan

| Trigger class | Trigger | Action |
|---------------|---------|--------|
| **Construction rollback** | Baseline regression < 443/443; typecheck break; non-additive change detected | Append-only revert of the offending WP (supersession commit); re-run baseline; no history deletion (INV-10). |
| **Construction rollback** | Any write under a prohibited core dir or existing `governance/*` fabric | Immediate halt; revert; **voids scoped AD** per `AD-0023` §5 / `UCOS-ART9-REL-001` §6. |
| **Evidence invalidation** | Non-reproducible `determinism_hash`; audit chain break/tamper; verdict irreproducible | Invalidate affected evidence; quarantine WP outputs; re-execute from last verified state; Board notified. |
| **Evidence invalidation** | SoD breach (certifier = constructor) at WP-8.3 | Certification void; re-run with independent actor. |
| **Authority revocation** | Construction outside released scope §B.2; activation conferred; supremacy asserted; custom crypto; Ω∞/INV-14..20 touch | Scoped AD **voided**; construction ceases; state reverts to design-only (SEQ-1). |
| **Article IX re-lock** | Any prohibited-scope generation | Full Article IX lock **re-imposed** automatically (void-on-breach); all further construction blocked pending a new Board release act. |

All rollbacks are **append-only** and audited; no ratified artifact is lost. Re-lock restores the pre-release
constitutional state exactly.

---

## I. Critical Path Analysis

- **Longest dependency chain:** `PC-2 release → Phase 1 (skeleton) → Phase 2 (registries) → Phase 3
  (authority/validation/traceability) → Phase 6 (compiler) → Phase 4 (compliance 4-stage, consumes Phase 3 +
  Phase 5) → Phase 7 (integration) → Phase 8 (independent certification)`. Phase 5 (audit) is an early,
  wide-fan-in dependency for Phase 4 and Phase 8.
- **Highest-risk work package:** **WP-4.2 (activation gate)** — the single point where the constitutional
  boundary between *advisory* and *operative* is enforced; must be provably inert (no ACTIVE) under P-REF.
  Secondary: **WP-6.1/6.2** (compiler canonical catalog — CC-7 drift risk).
- **Governance bottleneck:** **PC-2** (Article IX scoped release) — a single gating Board act; nothing starts
  until it concludes to RELEASE. PC-1 is enrolled conditional on it; PC-3 sets posture.
- **Certification bottleneck:** **WP-8.3** (independent construction certification) — requires a distinct
  external actor with SoD (proposer ≠ certifier ≠ ratifier); it cannot be self-attested by the constructor
  and is the terminal gate before post-construction conformance.

---

## J. Execution Readiness Assessment

| Dimension | Assessment | Basis |
|-----------|------------|-------|
| **Technical readiness** | **READY** | Design certified (30/30 VPs); WBS complete; additivity + namespace resolved; baseline floor 443/443; canonical catalog in force. |
| **Governance readiness** | **PENDING (preconditioned)** | PC-4/PC-5/PC-6 satisfied; **PC-1 and PC-2 not yet enrolled**; Article IX lock ACTIVE; posture P-REF recommended, not yet declared (PC-3). |
| **Construction readiness** | **READY-GATED** | Plan constructible in full under P-REF once PC-1/PC-2 enrolled; activation/supremacy/migration out of scope. |
| **Validation readiness** | **READY** | Evidence requirements (§F), compliance gates (§E), acceptance matrix (§G), and independent certification path (WP-8.3) fully defined. |

**Net:** the plan is **complete and internally consistent**; the sole blockers are the two Board acts (PC-1,
PC-2) plus the P-REF posture declaration (PC-3) — none of which this plan may perform.

---

## Final Verdict

The implementation execution plan is complete, additive, deterministic, fail-closed, append-only, and fully
bound to Article IX constraints, the AUTH-009 authority model, AD-0014 precedence, `PCAMG-7000` CR-8
ratified-corpus supremacy, invariants IM-1..IM-13, and constraints CC-1..CC-11. No design deficiency bars
execution. Execution cannot begin until the Authority Board enrolls **PC-1** (scoped construction AD) and
**PC-2** (scoped Article IX release), and declares the **PC-3** posture (recommended: P-REF). Accordingly:

> ## VERDICT: READY FOR EXECUTION WITH PRECONDITIONS

**Preconditions to first work package (WP-1.1):**
1. **PC-2** — scoped Article IX release enacted (lock released for `constitutional-governance/*` scope only).
2. **PC-1** — scoped construction AD enrolled on the `AUTH-012` ledger (conditional on PC-2).
3. **PC-3** — enrollment posture declared **P-REF** (advisory; supremacy/activation deferred).

On satisfaction, Phases 1–8 execute under §E gates with §F evidence; capabilities C-10/C-11/C-13/C-15 remain
**NOT IMPLEMENTABLE** (reserved to a separate future enrollment/ratification determination).

**Scope discipline:** nothing constructed, no code generated, Article IX **not** released, corpus **not**
enrolled, no doctrine created or modified. Execution planning only.

---

## Plan Provenance

| Item | Value |
|------|-------|
| Repository / Branch / Base commit | UCOS / `pcamg-runtime-certification` / `65deb4cec70e22427212396b32678750035b069c` |
| Posture assumed | P-REF (reference/advisory; supremacy deferred) |
| Phases / Work packages | 8 phases · ~30 WPs |
| Preconditions to execute | PC-1 (scoped AD), PC-2 (Article IX release), PC-3 (P-REF posture) |
| Preconditions satisfied | PC-4 (`AUTH-REST-004`), PC-5 (`-0003`/`-0003A`), PC-6 (SEQ/doctrine tier) |
| Capabilities | 8 IMPLEMENTABLE · 3 IMPLEMENTABLE WITH REVIEW · 4 NOT IMPLEMENTABLE |
| Preserved | Article IX; AUTH-009; AD-0014; PCAMG-7000 CR-8; IM-1..IM-13; CC-1..CC-11; append-only; determinism; fail-closed |
| Verdict | **READY FOR EXECUTION WITH PRECONDITIONS** |

**END PCAMG-RUNTIME-0006 — IMPLEMENTATION EXECUTION PLAN · PLANNING ONLY · NOTHING CONSTRUCTED · NO CODE · ARTICLE IX NOT RELEASED · CORPUS NOT ENROLLED · NO DOCTRINE CHANGE · APPEND-ONLY.**
