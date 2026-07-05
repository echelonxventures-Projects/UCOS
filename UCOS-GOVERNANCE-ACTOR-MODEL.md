# UCOS Ω∞ — GOVERNANCE ACTOR MODEL (WORKSTREAM E)

> **PHASE R.2 · ARTICLE IX LOCK RELEASE ANALYSIS · READ-ONLY GOVERNANCE ANALYSIS**
> NO CODE · NO IMPLEMENTATION · NO LOCK RELEASE · NO GOVERNANCE MODIFICATION

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-GOV-ACTOR-MODEL-R2-001` |
| Workstream | **E — Actor Model** |
| Phase | **R.2** |
| Date | 2026-07-03 |
| Mode | **ANALYSIS ONLY** — defines each governance actor strictly from source artifacts: authority, responsibilities, required actions. |
| Inputs (read-only) | `AUTH-009-GOVERNANCE-CANON` §3/§6.3/§6.4/§6.5; `AUTH-002-CONSTITUTION` (Art. XI/XII); `UCOS-CONSTRUCTION-BLOCKED` §2; `REAL-001` (REAL-C-02/03/05); `REAL-C-05-PROGRAM-RECOVERY-...` (§2 mission, §6 closure); `FGA-2`; `UCOS-MASTER-RAT-001` (owner/custodian) |
| **Determination** | Five governance actors bind the release: **Authority Board**, **Independent Adjudicator**, **Custodian (Chief Authority Architect)**, **Release Authority**, **Certifying Authority**. Separation of duty (`proposer ≠ certifier ≠ ratifier`; executor-key ≠ IA-key) is mandatory and currently **unsatisfied** because the Independent Adjudicator is undesignated. |

---

## 1. Actor: AUTHORITY BOARD

| Dimension | Definition (source-cited) |
|-----------|---------------------------|
| **Authority** | Final approver of **all** Approval-Required Operations and all Authority changes (`AUTH-009` §3). Terminal governing body; in conflict, Authority prevails (`AUTH-002` Art. XI). Sole body that may release the Article IX lock (`UCOS-CONSTRUCTION-BLOCKED` §2). |
| **Responsibilities** | Ratify/amend constitutional articles; approve scoped and full Article IX releases; approve the IA designation; approve real-spend authorizations (via AD-0009 delegation); enroll every decision append-only in `AUTH-012`. |
| **Required actions (this program)** | (1) Enact the **REAL-C-05 G1 IA designation** (`AUTH-012` decision). (2) Decide the **PE-12 ADR** (`REAL-M-04`). (3) Authorize provisioning/real-spend (under AD-0015 + AD-0009). (4) **Release** the Operational Certification. (5) Enact the **full Article IX lock release** (`REAL-C-03`) — issue `UCOS-ARTICLE-IX-LOCK-RELEASE.md` + `UCOS-CONSTRUCTION-AUTHORIZATION.md` + AUTH-012 entry. (6) Issue scoped releases as applicable (AD-0024 PI-10 with conditions). |
| **Threshold** | Approval-By-Exception (`AUTH-002` Art. XII); ambiguous/mixed ops default to Approval-Required (`AUTH-009` §6.4). Never weakens non-waivable S1/S3/S4. |

---

## 2. Actor: INDEPENDENT ADJUDICATOR (IA)

| Dimension | Definition (source-cited) |
|-----------|---------------------------|
| **Authority** | Delegated by the Board (bootstrapping designation, `REAL-C-05` G1) to render **independent attestations** over CRITICAL/HIGH ratifications, the terminal/Operational certifications, and every Article IX release predicate (RAS/MIR set). Authority is *evidentiary*: it makes verdicts defensible, it does not itself release the lock. |
| **Responsibilities** | Reproduce (not copy) evidence (EAR-1..6); sign detached Ed25519 attestations over evidence-artifact hashes (SIG-1..6); maintain the attestation-chain ledger; declare/avoid conflicts (COI-1..5); satisfy reviewer qualification (IRQ-1..6); provide dual-witness for terminal/operational certification (WIT-1..5). |
| **Required actions (this program)** | (1) Accept designation (post-Board G1). (2) Register the KMS-backed public key (G2). (3) Produce the **genesis attestation** (G3) over a real MIR target. (4) Re-attest the authority chain (`AUTH-REST-004`) + PI-8/PI-9 ratifications. (5) Attest `UCOM-ULTIMATE-CERT-002`. (6) Attest Article IX release preconditions. (7) Serve as one of two witnesses at Operational/terminal certification (G4). |
| **Constraints** | Must be a **distinct actor ∉ authoring/construction chain** (IRQ-4/SoD-2); key **custodially disjoint** from all authoring/CI-signing identities (SIG-2/3); author-signed-as-reviewer is rejected fail-closed (SIG-5). |
| **Current state** | **UNDESIGNATED** — G1–G4 open; 0 attestations. This is the decisive gap. |

---

## 3. Actor: CUSTODIAN (Chief Authority Architect)

| Dimension | Definition (source-cited) |
|-----------|---------------------------|
| **Authority** | Custodian of the governance model; drafter/maintainer of Authority and constitutional text (`AUTH-009` §3; `AUTH-002` §3). Owner-of-record custodianship for `UCOS-MASTER-RAT-001` and the release corpus. Not an approver — approval rests with the Board. |
| **Responsibilities** | Draft the release instruments and AUTH-012 entries; maintain zone definitions and the decision ledger; counter-record Board minutes; preserve append-only integrity; ensure traceability (AUTH-010) and durable enrollment. |
| **Required actions (this program)** | (1) Draft the IA designation `AUTH-012` decision for Board enactment. (2) Draft `UCOM-ULTIMATE-CERT-002` reconciliation and the release instruments. (3) Execute/record the durability commit (`REAL-M-07`) so the designation and corpus are durable. (4) Counter-record the Board release minute. (5) Maintain SoD: custodian ≠ IA ≠ executor. |

---

## 4. Actor: RELEASE AUTHORITY

| Dimension | Definition (source-cited) |
|-----------|---------------------------|
| **Authority** | The **UCOS Authority Board acting in its terminal release capacity** — the sole releaser of the Article IX generation lock (`UCOS-CONSTRUCTION-BLOCKED` §2; `AUTH-009` §6.3 "Validation/Certification owners + Authority Board (release)"). Distinct *function*, same body as §1. |
| **Responsibilities** | Verify all release predicates CLOSED with independent attestation; deliberate the AD-0014 boundary (no INV-14..20); reconcile standing scoped releases against the full release; enact the release only when the conjunctive gate is TRUE. |
| **Required actions (this program)** | (1) Convene the release sitting once RC-1..RC-8 (Workstream A) are met. (2) Confirm the C-6 review shows all predicates CLOSED + independently attested. (3) Issue `UCOS-ARTICLE-IX-LOCK-RELEASE.md` + `UCOS-CONSTRUCTION-AUTHORIZATION.md` + AUTH-012 full-release entry (closes UCC-5). (4) Confirm non-waivable S1/S3/S4 carry into implementation controls. |
| **Fail-closed rule** | Any predicate open (op-cert not issued, independence not attested, instruments stale) → **withhold release**; the lock stays ACTIVE. |

---

## 5. Actor: CERTIFYING AUTHORITY

| Dimension | Definition (source-cited) |
|-----------|---------------------------|
| **Authority** | Validation & Certification owners issue verdicts (a Trusted Operation — verdict recording, *not* release authorization); the Authority Board holds the **release** of certification (`AUTH-009` §6.3/§6.4). |
| **Responsibilities** | Compute and issue the terminal certification (`UCOM-ULTIMATE-CERT-002`) and the Operational Certification against **reproduced** evidence; withhold certification fail-closed when any gate is below floor. |
| **Required actions (this program)** | (1) Re-issue `UCOM-ULTIMATE-CERT-002` against the 269/269 canonical state (`REAL-C-01`), recording the R13/R14 governing ruling. (2) Issue the **Operational Certification** on G12-1/2/3 closure with measured NFRs meeting `UCOS-ASR-NFR-001` floors (`REAL-C-02`; closes UCC-4). (3) Submit both to the IA (dual-witness, G4) before Board release. |

---

## 6. Separation-of-Duty Matrix (binding; `AUTH-009`, `REAL-C-05` SoD-1..5)

| Function | Actor | Must differ from |
|----------|-------|------------------|
| Propose / author artifact | Custodian / owning architect | Certifier, Ratifier, IA |
| Execute (provisioning, real-spend, git) | Named executor operator (Board-delegated) | IA (key must differ) |
| Certify (issue verdict) | Certifying Authority | Author, IA-as-reviewer of same artifact |
| Independently attest | Independent Adjudicator | Author, Executor, Certifier of the same artifact |
| Ratify / Release | Authority Board (Release Authority) | — (terminal) |

> **Rule:** `proposer ≠ certifier ≠ ratifier`; **executor-key ≠ IA-key** (SoD-2/SIG-2). SoD is currently **unsatisfiable** because no IA exists — every "independent" review would be author-signed and rejected fail-closed (SIG-5). Designation (G1) is the act that makes SoD satisfiable.

---

## OUTPUT — Workstream E

- **Five actors** defined from source: Authority Board (terminal approver), Independent Adjudicator (undesignated — decisive), Custodian/Chief Authority Architect (drafts/preserves), Release Authority (Board in terminal release capacity), Certifying Authority (Validation/Certification owners + Board release).
- **The Board and Release/Certifying capacities are the same body** in different functions; the **IA and Custodian must be distinct actors** from each other and from the executor to satisfy SoD.
- **The binding, currently-unsatisfied requirement** is the Independent Adjudicator: without a designated, key-separated IA, separation of duty fails and no verdict is defensible.
- **Single next actor action:** the Authority Board enacts the IA designation (`REAL-C-05` G1), drafted by the Custodian.

## Governance / Non-Mutation Statement
No actor designated, no authority conferred, no code/authorization produced, no lock released, no governance modified. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged. Read-only analysis.

**END UCOS-GOV-ACTOR-MODEL-R2-001 — 5 ACTORS · SoD BINDING & CURRENTLY UNSATISFIED · DECISIVE ACTOR = INDEPENDENT ADJUDICATOR (UNDESIGNATED).**
