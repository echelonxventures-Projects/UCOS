# REAL-C-05 — Closure Checklist (WORKSTREAM G)

> **PHASE R.3 · REAL-C-05 INDEPENDENT ADJUDICATION CLOSURE PACKAGE · READ-ONLY GOVERNANCE ANALYSIS**
> NO CODE · NO IMPLEMENTATION · NO STEP EXECUTED · NO LOCK RELEASE · NO GOVERNANCE MUTATION
> This artifact enumerates **every closure step** for REAL-C-05 with owner, inputs, outputs, evidence, and completion criteria. It **executes no step**; each is a future Approval-Required Operation or an IA act.

| Field | Value |
|-------|-------|
| Artifact ID | `REAL-C-05-CLOSURE-CHECKLIST` |
| Workstream | **G — Closure Checklist** |
| Phase | **R.3** |
| Version | 1.0.0 |
| Date | 2026-07-03 |
| Mode | **CHECKLIST / SPECIFICATION ONLY** |
| Inputs (read-only) | WS-A (acceptance G1–G4 / AC-*), WS-B (MVA), WS-C (ATT-SET/SIG-REQ), WS-D (BA/RES/APR/SEQ), WS-E (KR/REG/VER/KEV), WS-F (MS-1..MS-8 closure-critical); `REAL-C-05-PROGRAM-RECOVERY-...` §6; `UCOS-LOCK-REL-EXEC-R2-001` Step 1/Step 4. Source scheme SR-1..SR-14 per Workstream A. |
| Owners legend | **Board** (Authority Board) · **IA** (Independent Adjudicator) · **Cust** (Custodian / Chief Authority Architect) · **Exec** (named executor operator) · **CA** (Certifying Authority, cert-time only) |
| **Determination** | **9 closure steps** (CL-0..CL-8) reach operational closure (G1∧G2∧G3 + durability); **2 additional steps** (CL-9/CL-10) attach at certification (G4). Step CL-1 (Board IA designation) is the single unblocking act with no prior gate. Every step is fail-closed. **0 of 9 executed.** |

---

## Legend
Each step lists **Owner · Inputs · Outputs · Evidence · Completion Criteria**. Gate column maps to G1–G4 (SR-2 §12). Status is the current state (all NOT STARTED except CL-0 preconditions, which are AVAILABLE).

---

## CL-0 — Precondition confirmation (mechanism complete)
- **Owner:** Cust (confirms) · Board (notes)
- **Inputs:** `REAL-C-05-ESTABLISHMENT-RECORD` §1–§11; WS-A source reconstruction.
- **Outputs:** confirmation that the mechanism is 10/10 defined and no design gap exists.
- **Evidence:** AV-1 (E-DESIGN), AV-2 (§11 self-audit), AV-3 (state determination).
- **Completion criteria:** mechanism §1–§11 present; §11 shows 6/7 defined + 1 pending Board act; determination = DESIGN COMPLETE / PARTIAL.
- **Gate:** — · **Status:** ✅ AVAILABLE (no action required).

## CL-1 — Board enacts the IA designation *(decisive, no prior gate)*
- **Owner:** **Board** (enacts) · Cust (drafts DA-1)
- **Inputs:** WS-B MVA (RC-1..8/IC-1..7); candidate IA (distinct actor, ∉ authoring chain); KMS custody arrangement; WS-D RES-1 mandatory elements.
- **Outputs:** enrolled `AUTH-012` IA-designation decision `⟨AD-####⟩` (distinct actor + KMS key custody disjoint).
- **Evidence:** MS-1 (designation); RR-1; DA-1; APR-1/APR-2 recorded.
- **Completion criteria:** designation enrolled; actor confirmed ∉ authoring/construction chain (IRQ-4/SoD-2); competence + class recorded (IRQ-3); custody path disjoint (SIG-2/3). **G1 = TRUE.**
- **Gate:** **G1** · **Status:** ☐ NOT STARTED.

## CL-2 — Register the IA public key
- **Owner:** **Cust/Exec** (register) · Board (approves, BA-2)
- **Inputs:** CL-1 designation; IA Ed25519 public-key fingerprint (by reference); `governance-registry.ts` (reuse).
- **Outputs:** registered IA public key as governed data; enrolled `AUTH-012` registration note (DA-2).
- **Evidence:** MS-2 (registered key), MS-5 (custody-separation proof); KEV-1/KEV-2/KEV-3; RR-2.
- **Completion criteria:** public key registered before any reliance (REG-4); custody-separation confirmed (CUST-2/VER-3); no private material recorded (AUTH-008 S3). **G2 = TRUE.**
- **Gate:** **G2** · **Status:** ☐ NOT STARTED (gated on CL-1).

## CL-3 — IA reproduces evidence for a real MIR target
- **Owner:** **IA**
- **Inputs:** target artifact(s) — e.g., `AUTH-REST-004` / `AUTH-012` v1.0.13 (W1 subject S-1), `ONTO-RAT-001` (S-2), `MEM-RAT-003` (S-3), `REAL-H-07` (S-4); EREF-1..7.
- **Outputs:** reproduced results (re-run/re-derived), not copied.
- **Evidence:** reproduction transcript (EAR-1); referenced by content hash (EAR-2).
- **Completion criteria:** each admitted item cites reproduced result + source path + hash; live-tree precedence honoured (EAR-3); no copied figures.
- **Gate:** feeds G3 · **Status:** ☐ NOT STARTED (gated on CL-1∧CL-2).

## CL-4 — IA produces the genesis attestation
- **Owner:** **IA**
- **Inputs:** CL-3 reproduced evidence; ATT schema (WS-C §6); IA registered key (CL-2); SIG-REQ-1..6.
- **Outputs:** ≥1 signed Ed25519 attestation over the evidence-artifact hash (ATT-SET-1), appended as attestation-chain genesis; plus subject attestations ATT-SET-2..5.
- **Evidence:** MS-3 (genesis), MS-4 (non-empty chain), MS-7 (re-attestation); RR-5/RR-6; STMT-1..9 present.
- **Completion criteria:** attestation admissible (all ATT fields present, ATT-1); independence + COI declared (STMT-1/2); self-attestation reliance = 0 (STMT-9); verdict recorded (PASS/PARTIAL/FAIL). Chain non-empty.
- **Gate:** **G3** (production) · **Status:** ☐ NOT STARTED.

## CL-5 — Verify the attestation
- **Owner:** **IA / any verifier** (Cust records)
- **Inputs:** CL-4 attestation; registered public key (CL-2); VER-1..6.
- **Outputs:** verification transcript.
- **Evidence:** MS-6 (verification transcript); KEV-4; (if code path) MS-11/KEV-5 author-key-rejection proof.
- **Completion criteria:** signature valid against registered key (VER-1/AC-V1); signed hash matches evidence hash (VER-2); custody separate (VER-3/AC-V2); author-signed-as-reviewer rejected (VER-4/SIG-5); ≥1 attestation present (VER-5/AC-V3). **G3 = TRUE.**
- **Gate:** **G3** (verification) · **Status:** ☐ NOT STARTED.

## CL-6 — Board accepts the genesis attestation as evidence *(not a lock lift)*
- **Owner:** **Board** (accepts, BA-3) · Cust (records DA-3)
- **Inputs:** CL-4/CL-5 verified attestation.
- **Outputs:** Board acceptance minute enrolled append-only on `AUTH-012` (DA-3).
- **Evidence:** RET-6 (acceptance minute); APR-3 (reliance approval).
- **Completion criteria:** acceptance recorded append-only; explicitly stated **not** a lock lift (`UCOS-W1-0001` F-4). Board may now rely on the attestation for the target's element (6) (LIFE-1/BOARD-USE).
- **Gate:** records **G3** reliance · **Status:** ☐ NOT STARTED.

## CL-7 — Durable enrollment of the designation
- **Owner:** **Exec** (commit) · Cust (records) · Board (approves, BA-4)
- **Inputs:** CL-1 designation AD; `REAL-M-07` durability wave (RM-2..RM-5).
- **Outputs:** the G1 designation AD committed durably (not "one tree only").
- **Evidence:** MS-8 (durable enrollment); KEV-6; DA-4.
- **Completion criteria:** designation enrolled durably per `REAL-H-07` R-3 (enroll⇒durability); gate-durable.
- **Gate:** durability · **Status:** ☐ NOT STARTED (coordinate with `REAL-M-07`).

## CL-8 — Mark REAL-C-05 operationally CLOSED
- **Owner:** **Board** (records) · Cust (updates state)
- **Inputs:** CL-1..CL-7 complete.
- **Outputs:** REAL-C-05 state updated PARTIAL → PASS (operational); G1–G4 status recorded in `CONST-READY-001` §2.5 (G1∧G2∧G3 CLOSED; G4 = cert-time).
- **Evidence:** AC-V4 (G1–G3 marked CLOSED); attestation-chain genesis present.
- **Completion criteria:** G1∧G2∧G3 = TRUE; chain non-empty; SoD satisfiable; RK-1/G-C1 closed. **REAL-C-05 = PASS for operational independence.**
- **Gate:** closes **G1∧G2∧G3** · **Status:** ☐ NOT STARTED.

---

## Certification-time steps (deferred — attach at terminal/Operational certification only)

## CL-9 — Second IA + dual-witness attestation
- **Owner:** **Board** (designates 2nd IA) · **IA×2** (attest) · **CA** (submits)
- **Inputs:** a second distinct IA (distinct key, no shared custody, WIT-1); the certification evidence (`UCOM-ULTIMATE-CERT-002` / Operational Certification G12-1/2/3).
- **Outputs:** two concurring PASS attestations, chained (ATT-SET-6/7).
- **Evidence:** MS-9 (dual-witness set); RR-9/RET-7.
- **Completion criteria:** two distinct IAs; independent reproduction (WIT-2); concurring PASS (WIT-3); chained + referenced by the certification instrument (WIT-4); neither witness = issuing Board authority (WIT-5). **G4 = TRUE.**
- **Gate:** **G4** · **Status:** ☐ NOT STARTED (cert-time).

## CL-10 — Board accepts the dual-witness set
- **Owner:** **Board** (accepts, BA-5) · Cust (records DA-5)
- **Inputs:** CL-9 dual-witness set.
- **Outputs:** Board acceptance minute (DA-5) enrolled append-only.
- **Evidence:** RET-7; APR-5.
- **Completion criteria:** dual-witness accepted; certification may proceed on concurring PASS (fail-closed on any FAIL/unresolved PARTIAL).
- **Gate:** records **G4** · **Status:** ☐ NOT STARTED (cert-time).

---

## Checklist Summary

| Step | Title | Owner | Gate | Status |
|:----:|-------|-------|:----:|:------:|
| CL-0 | Precondition (mechanism complete) | Cust/Board | — | ✅ AVAILABLE |
| CL-1 | Board enacts IA designation | **Board** | **G1** | ☐ |
| CL-2 | Register IA public key | Cust/Exec/Board | **G2** | ☐ |
| CL-3 | IA reproduces evidence | IA | →G3 | ☐ |
| CL-4 | IA produces genesis attestation | IA | **G3** | ☐ |
| CL-5 | Verify attestation | IA/verifier | **G3** | ☐ |
| CL-6 | Board accepts attestation (evidence) | Board | G3-record | ☐ |
| CL-7 | Durable enrollment | Exec/Cust/Board | durability | ☐ |
| CL-8 | Mark REAL-C-05 operationally CLOSED | Board | G1∧G2∧G3 | ☐ |
| CL-9 | Dual-witness *(cert-time)* | Board/IA×2/CA | **G4** | ☐ |
| CL-10 | Accept dual-witness *(cert-time)* | Board | G4-record | ☐ |

**Fail-closed rule (applies to every step):** absence of required evidence = FAIL, never pending pass (EAR-4); any DQ trigger (WS-B) voids the attestation and returns the target to its owner; a signature keyed to the authoring identity is rejected (SIG-5).

---

## OUTPUT — Workstream G

- **9 operational-closure steps (CL-0..CL-8)** + **2 certification-time steps (CL-9/CL-10)**, each with Owner · Inputs · Outputs · Evidence · Completion Criteria.
- **CL-1 (Board IA designation) is the single unblocking step** — no prior gate, available now.
- **Operational closure = CL-1→CL-8** (G1∧G2∧G3 + durability); **dual-witness (CL-9/CL-10) is deferred to certification** (G4).
- **0 of 9 operational steps executed**; CL-0 preconditions AVAILABLE. Every step fail-closed.

## Governance / Non-Mutation Statement
No step executed; no designation, registration, attestation, acceptance, or durability commit performed; no `git` mutation; no lock released; no governance modified. Every step is a future Approval-Required Operation (`AUTH-012` §8 / `AD-0009`) or an IA act. `INV-1..13`, `AUTH-012` (v1.0.13), `AD-0014`, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged. Read-only checklist; the sole repository effect is this additive analysis `*.md`.

## Traceability
- **Consumes:** WS-A (acceptance/AC-*), WS-B (MVA/DQ), WS-C (ATT-SET/SIG-REQ/RET), WS-D (BA/RES/APR/SEQ/DA), WS-E (KR/REG/VER/KEV), WS-F (MS closure-critical); SR-3 §6; SR-9 Step 1/Step 4.
- **Specifies:** every closure step (CL-0..CL-10) with owner/inputs/outputs/evidence/completion criteria.
- **Feeds:** Workstream H (readiness) and `REAL-C-05-CLOSURE-REPORT`.
- **Subordinate to:** AUTH-008/009/012, `UCOS-CONST-001`, Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Independent Adjudicator to be designated.

**END REAL-C-05-CLOSURE-CHECKLIST — WORKSTREAM G · CL-0..CL-8 (OPERATIONAL) + CL-9/CL-10 (CERT/G4) · UNBLOCKING = CL-1 (BOARD IA DESIGNATION) · OPERATIONAL CLOSURE = G1∧G2∧G3 + DURABILITY · 0/9 EXECUTED · FAIL-CLOSED · NO STEP EXECUTED / NO MUTATION.**
