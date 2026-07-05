# REAL-C-05 — Board Action Package (WORKSTREAM D)

> **PHASE R.3 · REAL-C-05 INDEPENDENT ADJUDICATION CLOSURE PACKAGE · READ-ONLY GOVERNANCE ANALYSIS**
> NO CODE · NO IMPLEMENTATION · NO RESOLUTION ENACTED · NO APPROVAL GRANTED · NO LOCK RELEASE · NO GOVERNANCE MUTATION
> This artifact **determines which Board acts are required** and provides a **draft artifact inventory only**. It enacts nothing, invents no resolutions, and grants no approvals. Every act named is a future Approval-Required Operation reserved to the UCOS Authority Board.

| Field | Value |
|-------|-------|
| Artifact ID | `REAL-C-05-BOARD-ACTION-PACKAGE` |
| Workstream | **D — Board Action Package** |
| Phase | **R.3** |
| Version | 1.0.0 |
| Date | 2026-07-03 |
| Mode | **DETERMINATION / DRAFT-INVENTORY ONLY** — determines required board acts, resolutions, approvals, and sequencing; provides a draft artifact inventory (placeholders only). **No invented resolutions.** |
| Inputs (read-only) | `AUTH-009` §3/§6.3/§6.4 (Approval-Required Operations; terminal authority); `AUTH-012` §8 / `AD-0009` (Approval-Required Operations; append-only Decision Log); `UCOS-CONST-001` Art. XI/XII (Authority prevails; Approval-By-Exception); `REAL-C-05-ESTABLISHMENT-RECORD` §12 (G1–G4); `UCOS-GOV-ACTOR-MODEL-R2-001` §1/§3 (Board + Custodian required actions); `UCOS-LOCK-REL-EXEC-R2-001` Step 1/Step 4; `REAL-C-05-PROGRAM-RECOVERY-...` §6/§8. Source scheme SR-1..SR-14 per Workstream A. |
| **Determination** | Closure requires **one decisive Board act** (BA-1: enact the IA designation, G1) plus a **key-registration approval** (BA-2, G2) and **acceptance of the genesis attestation as evidence** (BA-3, records G3). A **durability-enrollment approval** (BA-4) makes the designation gate-durable. Certification adds **dual-witness acceptance** (BA-5, G4). All acts are Approval-Required Operations; **none is enacted here**. Draft artifacts are placeholders pending Board authorship. |

---

## 1. Required Board Acts (BA)

Every act below is an Approval-Required Operation (`AUTH-012` §8 / `AD-0009`) reserved to the Authority Board (SR-10 §3; SR-8 §1). They are **determined**, not enacted.

| ID | Required Board act | Gate | Threshold | Basis | Enacted? |
|----|--------------------|:----:|-----------|-------|:--------:|
| **BA-1** | **Enact the Independent-Adjudicator designation** — name a distinct actor (∉ authoring/construction chain) with KMS-backed key custody disjoint from all authoring/CI-signing identities, as an enrolled `AUTH-012` decision. | **G1** | Approval-By-Exception (`AUTH-002` Art. XII) | SR-2 §12 G1; SR-8 §1/§2; SR-3 §8; SR-9 Step 1 | ✗ ABSENT |
| **BA-2** | **Approve registration of the IA public key** as governed data via `governance-registry.ts`. | **G2** | Approval-Required (governed data) | SR-2 §7 SIG-6; SR-8 §1; SR-9 Step 1 | ✗ ABSENT |
| **BA-3** | **Accept the genesis attestation as evidence of record** (append-only on `AUTH-012`) — records G3; **not a lock lift**. | **G3** | Approval-Required (evidence acceptance) | SR-2 §8 BOARD-USE; `UCOS-W1-0001` F-4; SR-8 §1 | ✗ ABSENT |
| **BA-4** | **Approve durable enrollment** of the BA-1 designation AD (committed via the `REAL-M-07` wave) so the designation is gate-durable. | durability | Approval-Required | SR-3 §6 (durability); SR-9 Step 4; `REAL-H-07` R-3 | ✗ ABSENT |
| **BA-5** | **Accept the dual-witness set** (two concurring IA attestations) — for terminal/Operational certification only. | **G4** | Approval-Required | SR-2 §10 WIT-5; SR-9 Step 8 | ✗ N/A (cert-time) |

> **Decisive act:** BA-1 is the single unblocking Board act — it has no prior gate, is available now, and makes SoD satisfiable (SR-7 Final Determination §1; SR-8 §6). BA-2/BA-3 follow immediately; BA-4 attaches to the durability wave; BA-5 is reserved for certification.

---

## 2. Required Resolutions (RES) — DRAFT PLACEHOLDERS ONLY

> **No resolution text is invented.** Each row specifies the *required subject matter and mandatory elements* of a resolution the Board must author; the "Draft artifact" column names a placeholder file the Custodian would draft for Board enactment. This package supplies **structure, not content**.

| ID | Resolution subject (required) | Mandatory elements (source-required) | Enacts | Draft artifact (placeholder) |
|----|-------------------------------|--------------------------------------|:------:|------------------------------|
| RES-1 | **IA designation resolution** | (a) named distinct actor/role; (b) attestation that actor ∉ authoring/construction chain (IRQ-4/SoD-2); (c) recorded competence basis + IA class (IRQ-3); (d) KMS key-custody path disjoint from authoring/CI keys (SIG-2/3); (e) enrolled as an `AUTH-012` decision (IRQ-6). | BA-1 / G1 | `⟨AUTH-012 AD-####: IA-DESIGNATION⟩` *(number assigned by Board)* |
| RES-2 | **Key-registration approval** | (a) IA Ed25519 public-key fingerprint (by reference; no private material); (b) registration via `governance-registry.ts`; (c) custody-separation confirmation (SIG-3). | BA-2 / G2 | `⟨AUTH-012 note: IA-KEY-REGISTRATION⟩` |
| RES-3 | **Genesis-attestation acceptance** | (a) reference to the produced attestation @ content hash; (b) verification result (SIG-4); (c) explicit statement that acceptance records evidence and is **not** a lock lift. | BA-3 / G3 | `⟨AUTH-012 note: G3-ATTESTATION-ACCEPTANCE⟩` |
| RES-4 | **Durability-enrollment approval** | (a) reference to the `REAL-M-07` wave commit carrying RES-1; (b) confirmation of enroll⇒durability (`REAL-H-07` R-3). | BA-4 | `⟨AUTH-012 note: G1-DURABILITY-ENROLLMENT⟩` |
| RES-5 | **Dual-witness acceptance** *(cert-time only)* | (a) two attestations, distinct keys, no shared custody (WIT-1); (b) independent reproduction confirmed (WIT-2); (c) concurring PASS (WIT-3); (d) neither witness = issuing Board authority (WIT-5). | BA-5 / G4 | `⟨AUTH-012 note: G4-DUAL-WITNESS-ACCEPTANCE⟩` |

> **AD numbering discipline:** REAL-C-05 sources reference a **prospective** IA-designation AD but assign **no fixed number** (SR-3, SR-6 speak of "an enrolled `AUTH-012` decision"). This package therefore leaves the AD identifier as `⟨AD-####⟩` for the Board to assign at enactment. Assigning a number here would be an invented resolution — prohibited.

---

## 3. Required Approvals (APR)

Approvals the Board must grant, distinct from the resolutions that record them (SR-10 §6.3/§6.4).

| ID | Approval | Depends on | Basis |
|----|----------|-----------|-------|
| APR-1 | Approve the **choice of IA actor** (distinctness + competence + custody separation verified). | candidate identification (external) | IRQ-1..6 / SoD |
| APR-2 | Approve the **KMS key-custody arrangement** (disjoint from authoring/CI seam bound in REAL-C-02). | APR-1 | SIG-2/3 / AUTH-008 S3 |
| APR-3 | Approve **reliance** on the genesis attestation for the target's element (6). | BA-3 | LIFE-1 / BOARD-USE |
| APR-4 | Approve **co-scheduling** of BA-1 with the PE-12 ADR decision and the `REAL-M-07` RM-8 adjudicator naming (efficiency, per SR-7). | — | SR-7 §1; SR-9 Step 1/Step 4 |
| APR-5 | *(cert-time)* Approve **dual-witness reliance** for terminal/Operational certification. | BA-5 | WIT-3/WIT-5 |

> Ambiguous/mixed operations default to Approval-Required (`AUTH-009` §6.4); the Board never weakens non-waivable S1/S3/S4 (AUTH-008).

---

## 4. Required Sequencing (SEQ)

The Board acts are ordered fail-closed (SR-9 Step 1/Step 4; SR-3 §6). Front-loading BA-1/BA-2/APR-4 into a single sitting is the highest-leverage arrangement (SR-7 §4).

```
[Board sitting S1 — the unblocking ceremony]
   APR-1 (IA actor) ─▶ APR-2 (key custody) ─▶ BA-1/RES-1 (designation, G1)
        └─ co-scheduled: APR-4 (name IA as REAL-M-07 RM-8 adjudicator; decide PE-12 ADR)
        ▼
   BA-2/RES-2 (register public key, G2)
        ▼
[IA acts — outside Board] produce genesis attestation (G3) over a real MIR target
        ▼
[Board sitting S2 — evidence acceptance]
   APR-3 ─▶ BA-3/RES-3 (accept genesis attestation as evidence, records G3)   ← NOT a lock lift
        ▼
   BA-4/RES-4 (durable enrollment via REAL-M-07 wave)
        ▼
[Later, at certification time only]
   BA-5/RES-5 (accept dual-witness set, G4)  ← required for terminal/Operational certification
```

**Sequencing rules:**
- **SEQ-1** BA-1 has **no prior gate** — available now (SR-7 §1).
- **SEQ-2** BA-2 requires BA-1 (a designated actor must exist before its key is registered).
- **SEQ-3** BA-3 requires a produced+verified attestation (IA act) which requires BA-1∧BA-2.
- **SEQ-4** BA-4 is best executed in the `REAL-M-07` durability wave so RES-1 lands durably (enroll⇒durability).
- **SEQ-5** BA-5 is deferred to certification time; it is **not** on the operational-independence closure path (G1∧G2∧G3).

---

## 5. Draft Artifact Inventory (PLACEHOLDERS ONLY)

> Inventory of the artifacts the Board/Custodian must author. **All are placeholders — none is drafted, numbered, or enacted here.** Content is authored by the Board (enactment) and Custodian (drafting), per SR-8 §1/§3.

| ID | Draft artifact | Author (drafts / enacts) | Records | State |
|----|----------------|--------------------------|---------|:-----:|
| DA-1 | `⟨AUTH-012 AD-####⟩` — IA designation decision | Custodian drafts / Board enacts | BA-1 / RES-1 / G1 | **PLACEHOLDER** |
| DA-2 | `⟨AUTH-012 note⟩` — IA public-key registration record | Custodian drafts / Board approves | BA-2 / RES-2 / G2 | **PLACEHOLDER** |
| DA-3 | `⟨AUTH-012 note⟩` — genesis-attestation acceptance minute | Custodian drafts / Board accepts | BA-3 / RES-3 / G3 | **PLACEHOLDER** |
| DA-4 | `⟨AUTH-012 note⟩` — durability-enrollment record (REAL-M-07 wave) | Exec commits / Custodian records / Board approves | BA-4 / RES-4 | **PLACEHOLDER** |
| DA-5 | `⟨AUTH-012 note⟩` — dual-witness acceptance minute *(cert-time)* | Custodian drafts / Board accepts | BA-5 / RES-5 / G4 | **PLACEHOLDER** |
| DA-6 | Board sitting minutes (S1/S2) counter-recorded | Custodian counter-records | sitting record | **PLACEHOLDER** |

**Not in this inventory (out of scope for REAL-C-05 closure):** `UCOS-ARTICLE-IX-LOCK-RELEASE.md`, `UCOS-CONSTRUCTION-AUTHORIZATION.md`, and the full-release `AUTH-012` entry — these belong to `REAL-C-03` (Step 9, SR-9) and are **not** REAL-C-05 acts. Listing them as REAL-C-05 board acts would conflate closure with release (prohibited by SR-2 §4 / SR-7 §3).

---

## OUTPUT — Workstream D

- **Required board acts:** BA-1 (designation, G1 — **decisive**), BA-2 (key registration, G2), BA-3 (genesis-attestation acceptance, G3 — evidence, not lift), BA-4 (durable enrollment), BA-5 (dual-witness acceptance, G4 — cert-time only). All **Approval-Required Operations**; **none enacted**.
- **Required resolutions:** RES-1..RES-5 specified by **mandatory elements only**; **no resolution text invented**; AD number left `⟨AD-####⟩` for Board assignment.
- **Required approvals:** APR-1..APR-5 (IA actor, key custody, reliance, co-scheduling, dual-witness reliance).
- **Required sequencing:** S1 unblocking ceremony (APR-1→APR-2→BA-1→BA-2, co-scheduled with PE-12/RM-8 naming) → IA genesis attestation → S2 evidence acceptance (BA-3) → durability (BA-4) → cert-time (BA-5). BA-1 has no prior gate.
- **Draft artifact inventory:** DA-1..DA-6 — **all placeholders**; Article IX release instruments explicitly **excluded** (they are `REAL-C-03`, not REAL-C-05).

## Governance / Non-Mutation Statement
No Board act enacted; no resolution authored or invented; no approval granted; no adjudicator designated; no key registered; no attestation accepted; no AD numbered; no `git` mutation; no lock released; no governance modified. Every act named is a future Approval-Required Operation (`AUTH-012` §8 / `AD-0009`) reserved to the UCOS Authority Board. `INV-1..13`, `AUTH-012` (v1.0.13), `AD-0014`, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged. Read-only determination; the sole repository effect is this additive analysis `*.md`.

## Traceability
- **Consumes:** SR-10 (`AUTH-009` §3/§6.3/§6.4); SR-12 (`AUTH-012` §8/AD-0009); SR-13 (`UCOS-CONST-001` Art. XI/XII); SR-2 §12; SR-8 §1/§3; SR-9 Step 1/Step 4; SR-3 §6/§8; `UCOS-W1-0001` F-4.
- **Determines:** required Board acts, resolutions, approvals, sequencing, and a draft artifact inventory (placeholders).
- **Feeds:** Workstream E (BA-2 key registration), G (closure checklist), H (readiness), and `REAL-C-05-CLOSURE-REPORT`.
- **Subordinate to:** AUTH-008 (S1/S3/S4), AUTH-009 (terminal authority), AUTH-012 (§8/AD-0009), `UCOS-CONST-001` (Art. XI/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (enactment); Custodian / Chief Authority Architect (drafting); Independent Adjudicator to be designated.

**END REAL-C-05-BOARD-ACTION-PACKAGE — WORKSTREAM D · BA-1..5 (DECISIVE = BA-1/G1) · RES-1..5 (ELEMENTS ONLY, NO INVENTED RESOLUTIONS) · APR-1..5 · SEQ S1→IA→S2→DURABILITY→CERT · DA-1..6 PLACEHOLDERS · ARTICLE IX INSTRUMENTS EXCLUDED (= REAL-C-03) · NO ENACTMENT / NO APPROVAL / NO MUTATION.**
