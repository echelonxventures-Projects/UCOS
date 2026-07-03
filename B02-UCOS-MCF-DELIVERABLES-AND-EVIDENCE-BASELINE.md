# B02 — UCOS MCF Deliverables & Evidence Baseline

## PHASE B02 — Deliverable, Evidence, Acceptance & Certification Baseline for the MCF Construction Program (Planning Only)

| Field | Value |
|-------|-------|
| Artifact | **B02 — UCOS MCF Deliverables & Evidence Baseline** |
| Artifact ID | `B02-UCOS-MCF-DELIVERABLES-AND-EVIDENCE-BASELINE` |
| Phase | **B02 — MCF Deliverables & Evidence Baseline** |
| Layer | ARCHITECTURE / ASSURANCE (delivery baseline — defines what must be produced/proven; builds nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **PLANNING ONLY** — define every deliverable, evidence package, acceptance package, and certification input for M0..M4. **No implementation, no code, no infrastructure, no technology/framework selection, no governance invention, no execution, no `git` mutation (beyond this additive architecture `*.md`, permitted by the S0′ tolerance rule).** Append-only. |
| Authoritative inputs (per mandate) | `F01` (FP-1..12; IF-*; FC-1..9), `F02` (waves; milestones), `F03` (9 domains; MC-1..13; AC-1..9; HO-1..7), `B01` (WP-*; interface matrix; M0..M4; gates G-*) |
| Governance posture | Planning is not construction. `UCOS-CONSTRUCTION-BLOCKED` + Article IX lock remain **ACTIVE**; all deliverables are produced under governed authorization (M0). Evidence/gate structures are **derived from existing governance** (AUTH-010, AUTH-012, REAL-M-07, REAL-C-05, `.claude/governance/*`) — none new. |
| **Determination** | **MCF DELIVERY BASELINE READY** — the milestone deliverable catalog, domain deliverable matrix, evidence chain, acceptance packages, traceability framework, objective exit criteria, and independent-validation inputs are complete (§ 8). |

> **Objective.** Fix the exact set of deliverables and evidence required to reach M0..M4 and to certify **MCF
> COMPLETE**, so construction (once authorized) produces a defensible, independently-verifiable evidence trail.
> Planning only; no artifact is produced here — this defines *what* must be produced.

---

## 1. Milestone Deliverable Catalog (M0..M4)

| MS | Milestone | Required deliverables (outputs) |
|:--:|-----------|---------------------------------|
| **M0** | Construction Authorization | **DEL-M0-1** AD-0024-with-conditions (MCF/kernel-first scope); **DEL-M0-2** Executor designation record; **DEL-M0-3** IA (REAL-C-05) designation + key-registration authorization; **DEL-M0-4** SoD attestation (Executor≠IA≠Custodian); **DEL-M0-5** MCF construction-scope record; **DEL-M0-6** construction-gate register (G-AUTH/PREFLIGHT/DURABILITY/TRACE/QUALITY/DOC/SEC/POLICY/INDEP/RELEASE, per B01 §6); **DEL-M0-7** baseline Pre-Flight record (anchors/counts) |
| **M1** | Genesis Kernel Complete | **DEL-M1-1** IF-STO/IF-IDN/IF-SEC/IF-REG contract specs (registered, versioned); **DEL-M1-2** genesis-seed spec + signed seed record; **DEL-M1-3** kernel self-registration record; **DEL-M1-4** WP-STO/IDN/SEC/REG design+model specs; **DEL-M1-5** AC-1 + AC-2 acceptance results; **DEL-M1-6** Genesis Kernel Acceptance Package (§4); **DEL-M1-7** durability commit (RM-discipline) of the kernel corpus |
| **M2** | Operating Spine Complete | **DEL-M2-1** IF-CFG/IF-POL/IF-EVT/IF-GOV/IF-EXE contract specs (registered, versioned); **DEL-M2-2** audit-event schema (MC-8); policy-lifecycle + gate/decision models; **DEL-M2-3** WP-CFG/POL/EVT/GOV/EXE design specs; **DEL-M2-4** AC-3 + AC-4 + AC-8 acceptance results; **DEL-M2-5** Operating Spine Acceptance Package (§4); **DEL-M2-6** durability commit of the spine corpus |
| **M3** | MCF Complete | **DEL-M3-1** AC-1..AC-9 + AC-INT full results; **DEL-M3-2** vertical-slice execution trace (FC-9/AC-9); **DEL-M3-3** audit-trail replay proof (FC-6/AC-6, via IF-STO); **DEL-M3-4** MCF Complete Acceptance Package (§4); **DEL-M3-5** durability tag on the MCF corpus (REAL-M-07 discipline); **DEL-M3-6** consolidated traceability matrix (§5) |
| **M4** | Independent Validation Complete | **DEL-M4-1** REAL-C-05 signed independent attestation (distinct-actor); **DEL-M4-2** reproduced-evidence report (EAR-1: re-derived, not copied); **DEL-M4-3** HO-1..HO-7 satisfaction record; **DEL-M4-4** MCF Closure Certificate (handover token); **DEL-M4-5** handover authorization for Wave 2 / commerce-domain construction |

---

## 2. Domain Deliverable Matrix

Per MCF domain: **Required Specifications · Required Contracts · Required Acceptance Tests · Required Evidence ·
Required Certification Inputs.** (All are planning/spec/test artifacts — no code/tech.)

| Domain | Specifications | Contracts | Acceptance Tests | Evidence | Certification Inputs |
|:------:|----------------|-----------|------------------|----------|----------------------|
| **F-STO** | ordered-log + hash-chain + snapshot/replay semantics | IF-STO | AC-5 (replay-from-empty), AC-6 (append-only/tamper-evident) | CE/VE for MC-1, MC-8/9 | replay-equivalence result; hash-chain integrity proof |
| **F-IDN** | principal/tenant model; authz-context; scoping | IF-IDN | AC-7 (tenant isolation), AC-9 precond (attribution) | CE/VE for MC-3, MC-12 | attribution + isolation results |
| **F-SEC** | sign/verify; key-by-reference; seed verification | IF-SEC | AC-1 (seed verify), AC-6 (integrity) | CE/VE for MC-2, MC-8 | independent seed-verify attestation |
| **F-REG** | artifact/type/contract registration; self-registration | IF-REG | AC-1 (self-register), AC-2 (resolve/zero-orphan) | CE/VE for MC-4 | registration completeness; orphan-rejection result |
| **F-CFG** | variability/metadata model; resolution | IF-CFG | AC-3 (config-only variation) | CE/VE for MC-5 | tenant-variation result |
| **F-POL** | policy lifecycle; decision model; determinism | IF-POL | AC-4 (deterministic decision) | CE/VE for MC-6 | decision-determinism result |
| **F-EVT** | ordered/idempotent delivery; audit-event schema | IF-EVT | AC-5 (ordered/replayable), AC-6 (audit emit) | CE/VE for MC-7, MC-8 | exactly-once-effect + audit-emit results |
| **F-GOV** | gate-check/decision-record; approval/trusted-op lifecycle | IF-GOV | AC-8 (gated ops) | CE/VE for MC-10 | gate-decision completeness (AUTH-012) |
| **F-EXE** | invoke/idempotency; identity+policy+config binding; vertical-slice def | IF-EXE | AC-9 (vertical slice) | CE/VE for MC-11, MC-13 | end-to-end slice trace + recoverability |

---

## 3. Evidence Chain Model

Four evidence classes, chained append-only (parent-hash linked, per FP-6 / mirroring the RM WV-E chain). Each
class is admissible only per REAL-C-05 EAR rules (reproduced, not asserted).

| Class | ID prefix | Produced when | Content | Owner |
|-------|:---------:|---------------|---------|:-----:|
| **Creation Evidence** | **CE-** | a deliverable is authored | the spec/model/contract artifact + its **registry entry** (FP-1) + traceability links (AUTH-010) | Executor |
| **Verification Evidence** | **VE-** | a deliverable passes its construction gates | G-QUALITY/DOC/SEC/TRACE/POLICY checklist results; self-run acceptance-test outputs | Executor |
| **Acceptance Evidence** | **AE-** | a domain/milestone meets its AC | AC-1..9 / AC-INT PASS results; vertical-slice trace; audit-replay proof | Executor |
| **Independent Validation Evidence** | **IVE-** | M4 independent review | REAL-C-05 IA **re-derived** results (EAR-1) + signed attestation (SIG) over evidence-artifact hashes | Independent Adjudicator (≠ Executor, SG-4) |

```
CE (create + register)  ──▶  VE (gate + self-verify)  ──▶  AE (acceptance PASS)  ──▶  IVE (independent re-derivation + attestation)
   FP-1/AUTH-010              B01 §6 gates                 F03 AC-1..9              REAL-C-05 EAR/ATT/SIG (M4)
        └───────────────── each links the prior by content hash (append-only, tamper-evident) ─────────────────┘
```

**Chain rule:** an AE is admissible only if its CE + VE exist and link; an IVE is admissible only if it
**independently re-derives** the AE result (not copies it) under a distinct key. A broken/copied link → the
corresponding milestone fails its gate (fail-closed).

---

## 4. Acceptance Package Structure

Three acceptance packages, each a defined bundle (contents only; produced during construction):

### AP-1 — Genesis Kernel Acceptance Package (M1)
- IF-STO/IDN/SEC/REG contract specs (registered, versioned) + CE.
- Genesis-seed spec + signed seed + independent-verify record.
- Kernel self-registration record.
- AC-1 + AC-2 results (AE) + their VE (gate checklists).
- Traceability slice: FP → {F-STO,IDN,SEC,REG} → WP → deliverables → AC-1/AC-2 → CE/VE/AE.

### AP-2 — Operating Spine Acceptance Package (M2)
- IF-CFG/POL/EVT/GOV/EXE contract specs (registered, versioned) + CE.
- Audit-event schema (MC-8); policy-lifecycle + gate/decision models.
- AC-3 + AC-4 + AC-8 results (AE) + VE.
- Traceability slice: FP → {F-CFG,POL,EVT,GOV,EXE} → WP → deliverables → AC-3/4/8 → CE/VE/AE.

### AP-3 — MCF Complete Acceptance Package (M3)
- AP-1 + AP-2 (composed).
- AC-1..AC-9 **+ AC-INT** results (integrated, not isolated).
- Vertical-slice trace (FC-9); audit-replay proof (FC-6).
- FC-1..FC-9 coverage confirmation (via MC-1..13).
- Full traceability matrix (§5); durability tag reference.
- Readiness for M4 independent validation (inputs per §7).

**Package rule:** a package is complete only when every listed item is present, registered, and gate-passed
(G-RELEASE); AP-3 additionally requires AC-INT (all criteria hold **together** in one running kernel+spine).

---

## 5. Traceability Framework

Full lineage (AUTH-010; FP-1/FP-5). Every row is a complete chain **Principles → Domains → Work Packages →
Deliverables → Acceptance Criteria → Evidence**.

| Principle(s) | Domain(s) | Work Package(s) | Deliverable(s) | Acceptance Criteria | Evidence |
|--------------|-----------|-----------------|----------------|:-------------------:|----------|
| FP-1 (registered) | F-REG | WP-REG | IF-REG; registration model | AC-1, AC-2 | CE/VE/AE (MC-4) |
| FP-2 (zero hard-coding) | F-CFG | WP-CFG | IF-CFG; variability model | AC-3 | CE/VE/AE (MC-5) |
| FP-3/FP-10 (contract-first/evolvable) | all | all WP | IF-* specs (versioned) | AC-INT | CE (contracts) |
| FP-4 (policy-governed) | F-POL | WP-POL | IF-POL; decision model | AC-4 | CE/VE/AE (MC-6) |
| FP-5 (deterministic/idempotent) | F-STO, F-EXE | WP-STO, WP-EXE | IF-STO, IF-EXE | AC-5, AC-9 | CE/VE/AE (MC-1,11,13) |
| FP-6 (auditable) | F-STO, F-EVT, F-SEC, F-IDN | WP-STO/EVT/SEC/IDN | audit-event schema; hash-chain | AC-6 | CE/VE/AE (MC-8,9) |
| FP-7 (recoverable) | F-STO | WP-STO | replay/snapshot spec | AC-5 | AE (replay proof) |
| FP-8 (multi-tenant) | F-IDN, F-CFG | WP-IDN, WP-CFG | tenant-scoping rules | AC-7 | CE/VE/AE (MC-12) |
| FP-9 (identity/least-privilege) | F-IDN, F-SEC | WP-IDN, WP-SEC | IF-IDN, IF-SEC | AC-9 precond | CE/VE (MC-3,2) |
| FP-11/FP-12 (self-desc/governed autonomy) | F-GOV (+ deferred F-KNW/ONT) | WP-GOV | IF-GOV; gate/decision model | AC-8 | CE/VE/AE (MC-10) |

**Coverage:** every FP maps to ≥1 domain→WP→deliverable→AC→evidence; every AC-1..9 has an evidence chain; no
orphan deliverable (G-TRACE). FC-10/11/12 remain deferred (Wave 2/3) and are **not** in the MCF traceability set.

---

## 6. Milestone Exit Criteria (objective)

| MS | Objective exit criteria (all must hold — fail-closed) |
|:--:|--------------------------------------------------------|
| **M0** | DEL-M0-1..7 present; AD-0024-with-conditions live; Executor + IA designated with SoD verified (Executor≠IA≠Custodian); construction-gate register instantiated; Pre-Flight baseline recorded (G-AUTH ✔) |
| **M1** | DEL-M1-1..7 present; AC-1 ∧ AC-2 = PASS; genesis seed independently verified; kernel self-registered; AP-1 complete + gate-passed; kernel corpus durably committed (G-DURABILITY ✔); CE/VE/AE chained for F-STO/IDN/SEC/REG |
| **M2** | DEL-M2-1..6 present; AC-3 ∧ AC-4 ∧ AC-8 = PASS; audit events append-only/hash-chained; AP-2 complete + gate-passed; spine corpus durably committed; CE/VE/AE chained for F-CFG/POL/EVT/GOV/EXE |
| **M3** | DEL-M3-1..6 present; **AC-1..AC-9 ∧ AC-INT = PASS** (integrated); vertical slice (FC-9) demonstrated; audit-replay proof (FC-6); FC-1..9 coverage confirmed; AP-3 complete; MCF corpus durably tagged; full traceability matrix closed (G-RELEASE ✔) |
| **M4** | DEL-M4-1..5 present; REAL-C-05 **distinct-actor** signed attestation = PASS (re-derived evidence, EAR-1); HO-1..HO-7 satisfied; MCF Closure Certificate issued (G-INDEP ✔); handover authorization for the next scope recorded |

---

## 7. Independent Validation Inputs (REAL-C-05 review / M4)

Everything the Independent Adjudicator requires to render an admissible M4 verdict (per REAL-C-05 §1/§5/§6/§7):

| Input | Purpose | Rule |
|-------|---------|------|
| **IVI-1** Pushed MCF corpus refs (durable) | Re-clone target for independent re-derivation | Fresh clone from origin, not Executor's tree (independence) |
| **IVI-2** Evidence chain CE→VE→AE (all links, hashes) | Claims to be re-derived, not trusted | EAR-1: reproduce; EAR-2: hash chain-of-custody |
| **IVI-3** AC-1..9 + AC-INT reproduction instructions | Re-run acceptance independently | EAR-1 reproduced results, not copied |
| **IVI-4** Contract specs IF-* (versioned, registered) | Verify contract-first + no-orphan (FP-1/3) | G-TRACE lineage intact |
| **IVI-5** Genesis-seed + signature | Independently verify trust root (AC-1) | SIG-4 verify under registered IA/independent key |
| **IVI-6** Vertical-slice trace + audit replay | Confirm FC-9 + FC-6 by re-derivation | Replay equivalence; tamper-evidence |
| **IVI-7** IA designation + distinct-key custody (from M0) | Establish independence (SG-4/SoD-3) | Executor ≠ IA; key ≠ CI/authoring keys |
| **IVI-8** HO-1..HO-7 checklist | Confirm handover readiness | All satisfied before certificate |

**Output of M4:** a signed attestation (verdict PASS / PARTIAL / FAIL per REAL-C-05 §6) over the evidence-artifact
hashes; a PASS (or Board-accepted PARTIAL with tracked conditions) certifies **MCF COMPLETE** and authorizes
handover. If no distinct IA exists at M4, the attestation is recorded **pending `REAL-C-05`** (durability/MCF
verdict may still stand with independence flagged pending — U32 CP-1 analogue).

---

## 8. Final Determination

> # **MCF DELIVERY BASELINE READY**
>
> The deliverable, evidence, acceptance, and certification baseline for the MCF construction program is complete:
> the **milestone deliverable catalog** DEL-M0..M4 (§ 1); the **domain deliverable matrix** for all 9 domains
> (specifications/contracts/acceptance-tests/evidence/certification-inputs, § 2); the **evidence chain model**
> CE→VE→AE→IVE (§ 3); the three **acceptance packages** AP-1/AP-2/AP-3 (§ 4); the **traceability framework**
> Principles→Domains→WPs→Deliverables→AC→Evidence (§ 5); the **objective milestone exit criteria** M0..M4 (§ 6);
> and the **independent-validation inputs** IVI-1..8 for REAL-C-05 / M4 (§ 7).
>
> Every FP maps to an evidence chain; every AC-1..9 has defined creation/verification/acceptance/independent
> evidence; nothing is orphaned (G-TRACE); FC-10/11/12 remain correctly deferred (Wave 2/3). All evidence and gate
> structures are **derived from existing governance** (AUTH-010, AUTH-012, REAL-M-07, REAL-C-05, `.claude/
> governance/*`) — none is invented.
>
> This baseline plans only. **No implementation, code, infrastructure, technology/framework selection, governance
> invention, execution, or `git` mutation was performed.** `UCOS-CONSTRUCTION-BLOCKED` and the Article IX
> generation lock remain **ACTIVE**; deliverables are produced only under M0 authorization.
>
> ### Next required phase
> Governed authorization at **M0**, then construction producing DEL-M1..M4 with CE→VE→AE evidence per domain,
> gated M1→M2→M3, and independent validation (IVE) at **M4** → MCF COMPLETE + handover.

---

## Governance / Non-Construction Statement

No implementation produced; no code generated; no infrastructure created; no technology/framework/language/
datastore/cloud selected; no new governance mechanism, control, gate, or evidence type invented (all derived from
existing instruments); no execution, construction, or `git` mutation performed; no lock released; no invariant
enrolled; no canon modified. This is a delivery-**baseline** artifact only; the sole repository effect is this
additive architecture `*.md`, permitted by the S0′ tolerance rule and outside the `RM2-CONTENT-ANCHOR` protected
set. Deliverable production remains a future Approval-Required Operation (AUTH-012 §8 / AD-0009) gated behind M0.
INV-1..13, `AUTH-012` (v1.0.13), AD-0014, AUTH-004/005/006 (FROZEN canon), the Article IX generation lock, and
`UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `F01`, `F02`, `F03`, `B01`.
- **Derives evidence/gates from:** AUTH-010 (traceability), AUTH-012 (§8/AD-0009), REAL-M-07 (durability), REAL-C-05 (independent validation: EAR/ATT/SIG), `.claude/governance/*` (quality/documentation/security/release/completion).
- **Produces:** the MCF delivery baseline (deliverable catalog M0..M4, domain deliverable matrix, evidence chain CE/VE/AE/IVE, acceptance packages AP-1/2/3, traceability framework, exit criteria, independent-validation inputs IVI-1..8).
- **Feeds:** the M0-authorized construction and its evidence trail → M4 independent validation → MCF COMPLETE + handover (F03 HO-1..7).
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014; construction gated by `UCOS-CONSTRUCTION-BLOCKED`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Executor + Independent Adjudicator to be designated.

**END B02-UCOS-MCF-DELIVERABLES-AND-EVIDENCE-BASELINE — PHASE B02 · DELIVERABLE CATALOG (DEL-M0..M4) · DOMAIN
DELIVERABLE MATRIX (9 DOMAINS) · EVIDENCE CHAIN (CE→VE→AE→IVE) · ACCEPTANCE PACKAGES (AP-1 KERNEL / AP-2 SPINE /
AP-3 MCF) · TRACEABILITY (FP→DOMAIN→WP→DELIVERABLE→AC→EVIDENCE) · EXIT CRITERIA M0..M4 · INDEPENDENT-VALIDATION
INPUTS IVI-1..8 · **MCF DELIVERY BASELINE READY** · PLANNING ONLY · NO CODE / NO INFRA / NO TECH SELECTION / NO
GOVERNANCE INVENTION / NO MUTATION · CONSTRUCTION LOCK + ARTICLE IX REMAIN ACTIVE.**
