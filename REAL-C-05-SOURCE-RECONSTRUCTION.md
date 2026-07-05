# REAL-C-05 — Source Reconstruction (WORKSTREAM A)

> **PHASE R.3 · REAL-C-05 INDEPENDENT ADJUDICATION CLOSURE PACKAGE · READ-ONLY GOVERNANCE ANALYSIS**
> NO CODE · NO IMPLEMENTATION · NO DESIGNATION · NO ATTESTATION · NO LOCK RELEASE · NO GOVERNANCE MUTATION
> This artifact reconstructs REAL-C-05 from source artifacts only. It designates no adjudicator, produces no attestation, and invents nothing not traceable to a cited source.

| Field | Value |
|-------|-------|
| Artifact ID | `REAL-C-05-SOURCE-RECONSTRUCTION` |
| Workstream | **A — Source Reconstruction** |
| Phase | **R.3** |
| Version | 1.0.0 |
| Date | 2026-07-03 |
| Mode | **RECONSTRUCTION / ANALYSIS ONLY** — determines exact source references, obligations, acceptance criteria, authority chain, and closure definition, with source traceability for every statement. |
| Inputs (read-only) | `REAL-001` (REAL-C-05); `REAL-C-05-INDEPENDENT-ADJUDICATION-ESTABLISHMENT-RECORD` (U8.1); `REAL-C-05-PROGRAM-RECOVERY-AND-STATUS-DETERMINATION` (C01); `UCOS-REAL-C-05-ANALYSIS-R2-001` (R.2 WS-B); `UCOS-MASTER-RATIFICATION-REPORT` (`UCOS-MASTER-RAT-001`); `UCOS-REMEDIATION-PROGRAM` (REM-01); `UCOS-R2-GOVERNANCE-CLOSURE-REPORT` (`UCOS-R2-GOV-CLOSURE-001`); `UCOS-GOVERNANCE-ACTOR-MODEL` (`UCOS-GOV-ACTOR-MODEL-R2-001`); `UCOS-LOCK-RELEASE-EXECUTION-PACKAGE` (`UCOS-LOCK-REL-EXEC-R2-001`); `AUTH-008/009/012`; `UCOS-CONST-001` (Art. IX/XI/XII) |
| **Determination** | Reconstruction complete. REAL-C-05 is a single, unambiguous obligation with a **three-valued closure definition**; its current state is **DESIGN COMPLETE / STATE PARTIAL** (mechanism 10/10 defined; enactment gate §12 G1–G4 open 0/4; 0 attestations). Every REAL-C-05 obligation traces to a cited source; there is **no source ambiguity** requiring invention. |

---

## 1. Exact Source References

Every REAL-C-05 requirement statement in this package resolves to one of the following primary sources. No requirement is asserted here without a source in this table.

| Ref | Source artifact | Locus | What it authoritatively establishes |
|-----|-----------------|-------|-------------------------------------|
| SR-1 | `REAL-001` | REAL-C-05 unit, elements 1–7 | The obligation itself: a genuinely independent review/attestation authority; the seven mandatory realization elements (deliverable, code, infra, tests, evidence, independent review, certification artifact). |
| SR-2 | `REAL-C-05-INDEPENDENT-ADJUDICATION-ESTABLISHMENT-RECORD` (U8.1) | §1–§11 (mechanism); §12 (gate); §13 (non-mutation); §14 (traceability) | The full mechanism: IRQ-1..6, SoD-1..5, COI-1..5, RAS/MIR, EAR-1..6, ATT schema/ATT-1..3, SIG-1..6, LIFE/LIFE-1..4, REV-1..5, WIT-1..5; the PARTIAL determination and the PASS-gate G1–G4. |
| SR-3 | `REAL-C-05-PROGRAM-RECOVERY-AND-STATUS-DETERMINATION` (C01) | §1 inventory; §2 mission; §3 state; §4 gaps; §5 deps; §6 minimal closure; §8 determination | The authoritative state review: state = PARTIAL; gaps = Governance/Execution/Evidence/Human-Action (no design gap); minimal closure = G1→G2→G3 (G4 at terminal cert). |
| SR-4 | `UCOS-REAL-C-05-ANALYSIS-R2-001` (R.2 WS-B) | §1–§7 + OUTPUT | The R.2 requirement decomposition: seven-element table (verbatim intent); actor definition; RAS; attestation set; signatures; records; evidence; missing elements M-1..M-5. |
| SR-5 | `UCOS-MASTER-RAT-001` | §0 governing fact; §5 conditions C-A..C-J | The cross-cutting fact that **all** ratifications are self-attested until REAL-C-05 closes; REAL-C-05 = condition **C-A**. |
| SR-6 | `UCOS-REMEDIATION-PROGRAM` | REM-01 (← G-C1) | Closure criteria (3-part), validation criteria, dependency root, RK-1 linkage, Wave A, maps-to C-A. |
| SR-7 | `UCOS-R2-GOV-CLOSURE-001` | §3, §7, Final Determination, Estimated Closure Order | The synthesis: REAL-C-05 is the decisive blocker; single next action = Board IA designation (G1); closure order row 1. |
| SR-8 | `UCOS-GOV-ACTOR-MODEL-R2-001` | §1–§6 | The five governance actors and the binding, currently-unsatisfied SoD matrix (`proposer ≠ certifier ≠ ratifier`; executor-key ≠ IA-key). |
| SR-9 | `UCOS-LOCK-REL-EXEC-R2-001` | Step 1 | The execution decomposition of REAL-C-05 (G1→G2→G3) as the single unblocking act of the 10-step release sequence. |
| SR-10 | `AUTH-009` | §3, §6.3, §6.4, §6.5 | Terminal authority; Approval-Required Operations; SoD/role chain; the Board as final approver. |
| SR-11 | `AUTH-008` | S1 / S3 / S4 (non-waivable) | Secrets/keys by reference; custody separation; the security floor REAL-C-05 keys must honour. |
| SR-12 | `AUTH-012` | §8 / AD-0009 | Designation, registration, and attestation reliance are Approval-Required Operations; append-only Decision Log. |
| SR-13 | `UCOS-CONST-001` | Art. IX / XI / XII | Governed generation lock; Authority prevails; Approval-By-Exception threshold. |
| SR-14 | `CONST-READY-001` / `CONST-READY-002` | REAL-C-05 findings | Independent confirmation: FAIL (decisive, CR-001) / PARTIAL-BLOCKING (CR-002); the finding this program closes. |

> **Reconstruction discipline (SR-2, framing note).** `CONST-READY-001` found REAL-C-05 FAIL precisely because every "independent" artifact was produced by a single authoring process. **This reconstruction is authored by that same process** and therefore cannot create independence by being written; it only restates, from sources, what independence *requires*. The honest state remains PARTIAL until a governed Board act (G1) and a first signed attestation (G3) exist.

---

## 2. Exact Obligations

REAL-C-05's obligation is decomposed into its seven mandatory realization elements (SR-1/SR-4) and the mechanism obligations that realize them (SR-2). Each row cites its source and current fulfilment.

### 2.1 The seven realization elements (SR-1 `REAL-001`, restated by SR-4 §1)

| # | Element | Obligation (verbatim intent) | Source | Fulfilled? |
|:-:|---------|------------------------------|--------|:----------:|
| 1 | **Exact deliverable** | A genuinely independent review/attestation authority — a distinct actor and/or a signed, cryptographically verifiable attestation mechanism — applied to at least all CRITICAL/HIGH ratifications and the terminal certification, with a recorded attestation chain. | SR-1/SR-4 | Mechanism ✔ / realization ✗ |
| 2 | **Required code** | Optional additive attestation-verification utility under `packages/platform-runtime/src/control/governance/**` validating detached signatures over evidence-artifact hashes (reuses existing hash-chain/signing primitive — **no custom crypto**). If organizational-signature-only, code = None. | SR-1/SR-4 | Optional; not required for closure |
| 3 | **Required infrastructure** | Key custody for the independent attester (KMS-backed signing key, by reference), **separate from the authoring identity**, enforced at the CI-signing seam bound in REAL-C-02. | SR-1/SR-4/SR-11 | ✗ (G2 open) |
| 4 | **Required tests** | Attestation-verification test: valid signature passes; tampered evidence fails; author-signed-as-reviewer is **rejected** (enforcing proposer ≠ certifier ≠ ratifier). | SR-1/SR-4 | ✗ (only if code path chosen) |
| 5 | **Required evidence** | For each CRITICAL/HIGH closure, a detached attestation attributable to the independent actor, verifiable against the evidence-artifact hash; an attestation-chain ledger. | SR-1/SR-4 | ✗ (0 attestations) |
| 6 | **Required independent review** | Self-referential by design — the *mechanism* is the review capability. Bootstrapping: the first independent actor's designation is itself recorded by the Authority Board as a governed act. | SR-1/SR-4 | ✗ (G1 open) |
| 7 | **Required certification artifact** | Independent-Adjudication Establishment record + the standing attestation-chain ledger; retro-attestation of the `ULT-H-07` retroactive enrollment recorded. | SR-1/SR-4 | Establishment record ✔ / ledger ✗ |

### 2.2 Mechanism obligations (SR-2 §1–§10) — all DEFINED

| Obligation set | Content | Source | State |
|----------------|---------|--------|:-----:|
| IRQ-1..6 | Reviewer qualification: distinct identity, distinct key custody, competence, no authorship history, reproduction capability, ledger standing. | SR-2 §1 | DEFINED ✔ |
| SoD-1..5 | Separation of duty: `proposer ≠ certifier ≠ ratifier ≠ IA`; IA ∉ authoring chain; key-level SoD; Board ≠ IA on same act; no self-review of the framework. | SR-2 §2 | DEFINED ✔ |
| COI-1..5 | Conflict rules: authorship, custody, outcome interest, disclosure duty, rotation-on-repeat. | SR-2 §3 | DEFINED ✔ |
| RAS / MIR | Review Authority Scope: all CRITICAL/HIGH ratifications, terminal + Operational certification, every Article IX release predicate (incl. AD-0024/0025/0026), REAL-H-07, retro-enrollment. | SR-2 §4 | DEFINED ✔ |
| EAR-1..6 | Evidence admissibility: reproduced-not-asserted, immutable chain-of-custody, live-tree precedence, completeness=FAIL-if-absent, attributable source, no stale-cert hearsay. | SR-2 §5 | DEFINED ✔ |
| ATT / ATT-1..3 | Attestation format (fixed schema); mandatory-field fail-closed; three-valued verdict; chained. | SR-2 §6 | DEFINED ✔ |
| SIG-1..6 | Ed25519 detached; key-by-reference; custody separation; verifiability; author-as-reviewer rejection; registered public key. | SR-2 §7 | DEFINED ✔ |
| LIFE / LIFE-1..4 | Lifecycle REQUESTED→ASSIGNED→REPRODUCE→ATTEST→CHAIN→BOARD-USE→CLOSED; no advance without PASS/tracked-PARTIAL; FAIL blocks; produces evidence not governance act; audit-logged. | SR-2 §8 | DEFINED ✔ |
| REV-1..5 | Revocation triggers, VOID effect, non-destructive/append-only, key rotation, fail-closed cascade. | SR-2 §9 | DEFINED ✔ |
| WIT-1..5 | Dual-witness for terminal/Operational certification: two distinct IAs, independent reproduction, concurring PASS, chained, Board-separated. | SR-2 §10 | DEFINED ✔ |

> **Obligation summary.** The *mechanism* obligations (2.2) are **10/10 DEFINED** (SR-2 §11 self-audit; SR-3 §1). The *enactment* obligations that satisfy elements 3, 5, 6, 7-ledger (2.1) are **UNMET** and are governed acts (SR-3 §4; SR-6 REM-01). REAL-C-05 has **no open design obligation** (SR-3 §8; SR-7 §3).

---

## 3. Exact Acceptance Criteria

The acceptance criteria are the union of (a) REM-01 closure/validation criteria (SR-6), (b) the establishment-record conversion gate §12 G1–G4 (SR-2), and (c) the recovery minimal-closure path (SR-3 §6). They are mutually consistent and reconstructed here verbatim-in-intent.

### 3.1 Closure criteria (SR-6 REM-01)
- **AC-C1** Board-record independent-actor designation AD.
- **AC-C2** Register custodially-separate key by-reference.
- **AC-C3** Place ≥1 signed attestation over evidence hashes on the chain (`REAL-C-05` G1–G4 CLOSED).

### 3.2 Conversion gate (SR-2 §12 — all required for PARTIAL → PASS)
- **G1** Authority Board enacts the IA designation as an enrolled `AUTH-012` decision — a distinct actor with KMS-backed key custody disjoint from all authoring/CI-signing identities (SIG-2/3).
- **G2** The IA public key is registered via `governance-registry.ts` (SIG-6).
- **G3** ≥1 signed attestation produced under ATT §6 / SIG §7 and verified (SIG-4), establishing the attestation-chain genesis.
- **G4** For the terminal/Operational certifications, the §10 dual-witness standard is met.

### 3.3 Validation criteria (SR-6 REM-01)
- **AC-V1** Signature valid against the registered key.
- **AC-V2** Key is custodially separate (COI clean; SoD-3/SIG-3).
- **AC-V3** ≥1 attestation present on the chain.
- **AC-V4** G1–G4 marked CLOSED in `CONST-READY-001` §2.5.

### 3.4 Evidence-admissibility floor (SR-2 §5, applies to every attestation)
- **AC-E1** Evidence **reproduced, not asserted** (EAR-1); copied figures inadmissible.
- **AC-E2** Referenced by content hash; hash-chained append-only record of record (EAR-2).
- **AC-E3** Live-tree / canonical `AUTH-012` precedence on conflict (EAR-3).
- **AC-E4** Absence of required evidence = **FAIL**, never pending pass (EAR-4).

### 3.5 Acceptance thresholds by scope

| Scope | Minimum acceptance | Source |
|-------|--------------------|--------|
| **Operational independence** (general MIR reviews) | G1 ∧ G2 ∧ G3 (AC-C1..3, AC-V1..4) | SR-3 §6; SR-4 OUTPUT |
| **Terminal / Operational certification** | Additionally G4 dual-witness (WIT-1..5) | SR-2 §10/§12; SR-9 Step 8 |

> **Non-optimism rule (SR-2 EAR-4; SR-6 discipline).** Any single unmet acceptance criterion holds REAL-C-05 at PARTIAL/FAIL. There is no "pending pass." A review signed by an authoring-chain key is **rejected** (SIG-5), not accepted as provisional.

---

## 4. Exact Authority Chain

The authority chain for REAL-C-05 is reconstructed from SR-8 (actor model), SR-10 (`AUTH-009`), and SR-12/SR-13 (`AUTH-012` / constitution). It is the non-collapsible role chain plus the terminal approver.

### 4.1 Role chain (SR-2 §2; SR-8 §6)
```
Proposer → Constructor → Certifier → Ratifier → Independent Adjudicator → Authority Board
```
Binding: `proposer ≠ certifier ≠ ratifier ≠ IA` for the same artifact; **executor-key ≠ IA-key** (SoD-2/SIG-2).

### 4.2 Actors and their REAL-C-05 authority (SR-8)

| Actor | Authority over REAL-C-05 | Source |
|-------|--------------------------|--------|
| **Authority Board** | Sole enactor of the IA designation (G1); sole approver of Approval-Required Operations; terminal. Only body that may later release the Article IX lock. | SR-8 §1; SR-10 §3; SR-13 Art. XI |
| **Independent Adjudicator (IA)** | Delegated (post-G1) to render independent attestations; authority is **evidentiary only** — attests evidence, does not author/authorize/construct/release. Currently **UNDESIGNATED**. | SR-8 §2; SR-2 §4 (RAS out-of-scope) |
| **Custodian (Chief Authority Architect)** | Drafts the designation `AUTH-012` decision and registration record; preserves append-only integrity; not an approver. | SR-8 §3 |
| **Release Authority** | Board in terminal release capacity; consumes IA attestations as a release predicate. | SR-8 §4 |
| **Certifying Authority** | Validation/Certification owners; issue verdicts; submit to IA for attestation/dual-witness. | SR-8 §5 |

### 4.3 Governing instruments (subordination order)
```
UCOS-CONST-001 (Art. IX/XI/XII)
  └─ AUTH-008 (S1/S3/S4 non-waivable)  ·  AUTH-009 (terminal authority / SoD / Approval-Required)
       └─ AUTH-012 (§8 / AD-0009 — Approval-Required Operations; append-only Decision Log; INV-10)
            └─ REAL-001 REAL-C-05  →  REAL-C-05 Establishment Record (U8.1)  →  this closure package
```
Source: SR-2 §14; SR-3 Traceability; SR-10; SR-11; SR-12; SR-13.

### 4.4 Approval-Required Operations (SR-12 `AUTH-012` §8 / AD-0009)
The following REAL-C-05 acts are reserved to the Authority Board and cannot be self-executed by any authoring process or by this package:
- **G1** IA designation (governance + human action).
- **G2** Key registration as governed data (governance + execution).
- **Reliance** on any attestation for a downstream Approval-Required act (Board-use, LIFE §8).
- **G4** Dual-witness acceptance for certification.

---

## 5. Exact Closure Definition

REAL-C-05 closure is defined three-valued and scope-dependent, reconstructed from SR-2 §12, SR-3 §3/§6/§8, SR-4 OUTPUT, and SR-6 REM-01.

### 5.1 State definitions (SR-3 §3)

| State | Definition | Applies when |
|-------|------------|--------------|
| NOT STARTED | No mechanism defined. | — (superseded; framework exists) |
| **PARTIAL** *(current)* | Mechanism complete by design **but** G1–G4 unenacted: no designation, no registered key, 0 attestations. | Now (SR-3 §3; SR-2 §12; SR-5 §0) |
| READY | G1 designation + G2 registration in place so an attestation *could* be produced. | On G1 ∧ G2 |
| **PASS / COMPLETE (operational)** | G1 ∧ G2 ∧ G3 satisfied; attestation-chain non-empty; SoD satisfiable. | On G1 ∧ G2 ∧ G3 |
| **PASS / COMPLETE (certification)** | Additionally G4 dual-witness met, at terminal/Operational-certification time. | On G1..G4 |

### 5.2 Canonical closure statement (reconstructed)
> **REAL-C-05 is CLOSED for operational independence when, and only when, all of G1, G2, and G3 are enacted and verified** — i.e. (AC-C1) a distinct-actor IA designation is an enrolled `AUTH-012` decision, (AC-C2) the IA's KMS-backed key custodially disjoint from all authoring/CI identities is registered via `governance-registry.ts`, and (AC-C3) at least one Ed25519-signed attestation over reproduced evidence is verified and appended to the attestation-chain genesis. **G4 (dual-witness) additionally applies at, and only at, terminal/Operational-certification time.** Durable enrollment of the G1 designation (via the `REAL-M-07` wave) is required for the closure to be gate-durable (SR-3 §6 durability note; `REAL-H-07` R-3 enroll⇒durability).

### 5.3 What closure is NOT (scope boundary, SR-2 §4/§13; SR-7 Final Determination §3; SR-9)
- Closure does **not** author, authorize, construct, or release anything.
- Closure does **not** by itself release the Article IX generation lock — that is `REAL-C-03` (full release, UCC-5), a separate conjunctive gate also requiring operational evidence, Operational Certification, terminal-cert re-issue, and PI-10/PI-11 ratification.
- Closure does **not** enroll INV-14..20 (deferred under AD-0014) or touch existential scope.
- Closure removes the **decisive cross-cutting blocker** (RK-1 / G-C1) and makes downstream verdicts *defensible*; it is **necessary but not sufficient** for FULL GO (SR-7).

### 5.4 Durability qualifier (SR-3 §6; SR-9 Step 4)
Per `REAL-H-07` R-3 (enroll ⇒ durability), a designation enrolled "on one tree only" is treated as not-yet-enrolled for gate purposes. Therefore closure is **gate-durable** only once the G1 designation AD is committed durably via the `REAL-M-07` wave (RM-2..RM-5) or a subsequent governed commit.

---

## OUTPUT — Workstream A

- **Source references:** 14 primary sources (SR-1..SR-14), each mapped to the obligations it establishes; **no requirement is asserted without a cited source**.
- **Obligations:** seven realization elements (2.1) + ten mechanism obligation sets (2.2). Mechanism = **10/10 DEFINED**; enactment elements (3, 5, 6, 7-ledger) = **UNMET, governed**. **No open design obligation.**
- **Acceptance criteria:** AC-C1..3 (closure), G1–G4 (gate), AC-V1..4 (validation), AC-E1..4 (admissibility); thresholds = G1∧G2∧G3 (operational) + G4 (certification).
- **Authority chain:** role chain `Proposer→…→IA→Board`; five actors (SR-8); subordination `CONST-001 ▸ AUTH-008/009 ▸ AUTH-012 ▸ REAL-001`; G1/G2/reliance/G4 are Approval-Required Operations reserved to the Board.
- **Closure definition:** three-valued, scope-dependent; **operational closure = G1∧G2∧G3**, **certification closure adds G4**; gate-durable only after durable enrollment; closure ≠ Article IX release.

**Traceability of every §-level statement:** §1→SR-1..14; §2→SR-1/2/3/4/6; §3→SR-2/3/6; §4→SR-2/8/10/11/12/13; §5→SR-2/3/4/6/7/9. No statement originates outside these sources.

## Governance / Non-Mutation Statement
No adjudicator designated; no key registered; no attestation produced; no framework/control created; no `git` mutation; no lock released; no invariant enrolled; no governance modified. `INV-1..13`, `AUTH-012` substance (v1.0.13), `AD-0014`, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged. Read-only reconstruction; the sole repository effect is this additive analysis `*.md`.

## Traceability
- **Consumes (authoritative):** SR-1..SR-14 (see §1).
- **Reconstructs:** the exact source references, obligations, acceptance criteria, authority chain, and closure definition of REAL-C-05.
- **Feeds:** Workstreams B–H and `REAL-C-05-CLOSURE-REPORT` (this package).
- **Subordinate to:** `AUTH-008` (S1/S3/S4), `AUTH-009` (SoD/terminal authority), `AUTH-012` (§8/AD-0009), `UCOS-CONST-001` (Art. IX/XI/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Independent Adjudicator to be designated (this reconstruction designates none).

**END REAL-C-05-SOURCE-RECONSTRUCTION — WORKSTREAM A · 14 SOURCES · OBLIGATIONS (MECHANISM 10/10 DEFINED · ENACTMENT UNMET) · ACCEPTANCE = G1∧G2∧G3 (+G4 @ CERT) · AUTHORITY CHAIN = PROPOSER→…→IA→BOARD · CLOSURE DEFINED THREE-VALUED · CLOSURE ≠ ARTICLE IX RELEASE · NO DESIGNATION / NO ATTESTATION / NO MUTATION.**
