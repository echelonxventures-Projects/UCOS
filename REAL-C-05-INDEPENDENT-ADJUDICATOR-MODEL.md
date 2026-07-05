# REAL-C-05 — Independent Adjudicator Model (WORKSTREAM B)

> **PHASE R.3 · REAL-C-05 INDEPENDENT ADJUDICATION CLOSURE PACKAGE · READ-ONLY GOVERNANCE ANALYSIS**
> NO CODE · NO IMPLEMENTATION · NO DESIGNATION · NO ATTESTATION · NO LOCK RELEASE · NO GOVERNANCE MUTATION
> This artifact models the Independent Adjudicator (IA) role from source. It **designates no person or body** and confers no authority; it states what a valid IA must be.

| Field | Value |
|-------|-------|
| Artifact ID | `REAL-C-05-INDEPENDENT-ADJUDICATOR-MODEL` |
| Workstream | **B — Independent Adjudicator Model** |
| Phase | **R.3** |
| Version | 1.0.0 |
| Date | 2026-07-03 |
| Mode | **MODEL / ANALYSIS ONLY** — determines required characteristics, independence criteria, disqualifying conditions, authority boundaries, decision rights, required records, and the minimum viable adjudicator model. |
| Inputs (read-only) | `REAL-C-05-INDEPENDENT-ADJUDICATION-ESTABLISHMENT-RECORD` §1–§10 (IRQ/SoD/COI/RAS/EAR/SIG/WIT); `UCOS-GOV-ACTOR-MODEL-R2-001` §2/§6; `UCOS-REAL-C-05-ANALYSIS-R2-001` §2; `REAL-C-05-PROGRAM-RECOVERY-...` §2/§4; `UCOS-W1-0001` §5/§8; `AUTH-008` (S1/S3/S4); `AUTH-009` (SoD); `AUTH-012` (§8/AD-0009). Source scheme SR-1..SR-14 per Workstream A. |
| **Determination** | The IA model is **fully specified by source** (SR-2 §1–§10). A **Minimum Viable Adjudicator (MVA)** exists: one natural person or accountable role, outside the authoring/construction chain, holding a KMS-backed Ed25519 key custodially disjoint from all authoring/CI identities, designated by an enrolled Board `AUTH-012` decision. The role is **currently UNFILLED** (0 designations); this is the decisive gap. |

---

## 1. Required Characteristics (RC)

Derived from IRQ-1..6 (SR-2 §1), SIG-1..6 (SR-2 §7), and the actor definition (SR-8 §2). A candidate must satisfy **all**; any single failure = ineligible (fail-closed).

| ID | Required characteristic | Basis | Test of satisfaction |
|----|-------------------------|-------|----------------------|
| RC-1 | **Distinct identity** — an actor (natural person or distinct accountable role) separate from author/proposer/constructor/certifier of the target. | IRQ-1 | Attestation author identity ≠ artifact author identity (recorded, verifiable). |
| RC-2 | **Distinct key custody** — holds a signing key whose custody is separate from any authoring/CI-signing identity (by reference only). | IRQ-2 / SIG-2/3 / AUTH-008 S3 | Key fingerprint registered under a custody path disjoint from authoring keys. |
| RC-3 | **Domain competence** — demonstrable competence in the artifact's domain (governance, security, fabric implementation, or operations) sufficient to reproduce its evidence. | IRQ-3 | Recorded competence basis in the designation record. |
| RC-4 | **No authorship history on the target** — has not authored, co-authored, or materially edited the artifact or its direct predecessors. | IRQ-4 / SoD-2 | Authorship-provenance check against the target's traceability chain. |
| RC-5 | **Reproduction capability** — can independently reproduce the cited evidence (re-run tests, re-derive counts, re-inspect the tree), not merely read the claim. | IRQ-5 / EAR-1 | Attestation cites *reproduced* results. |
| RC-6 | **Standing in the ledger** — the designation is itself an enrolled `AUTH-012` decision (bootstrapping is a governed act). | IRQ-6 / AUTH-012 §8 | AD present in canonical `AUTH-012` before any attestation is relied upon. |
| RC-7 | **Reuses ratified crypto only** — signs detached Ed25519 via `assertions.ts`; **no custom cryptography**. | SIG-1 / AUTH-008 | Signature validates against the registered Ed25519 public key. |
| RC-8 | **Registered public key** — the IA public key is registered as governed data via `governance-registry.ts`. | SIG-6 | Registration is an enrolled decision (G2). |

**IA classes (SR-2 §1):** `IA-GOV` (governance/ledger/authority), `IA-SEC` (security/threat/crypto), `IA-IMP` (fabric/impl/test reproduction), `IA-OPS` (operational/NFR/DR evidence). One actor MAY hold multiple classes provided no SoD rule is thereby violated for a given artifact.

---

## 2. Independence Criteria (IC)

Independence is realized only when **all** hold. These are the cryptographic and organizational expressions of "not self-attested" (SR-5 §0; SR-2 §2/§7).

| ID | Independence criterion | Basis | Realized today? |
|----|------------------------|-------|:---------------:|
| IC-1 | **Actor ∉ authoring/construction chain** of the target. | IRQ-4 / SoD-2 | N/A — no actor designated |
| IC-2 | **Key-level separation** — IA signing key ≠ CI-signing key ≠ any authoring identity key. | SoD-3 / SIG-3 | ✗ |
| IC-3 | **Role separation** — `proposer ≠ certifier ≠ ratifier ≠ IA` for the same artifact. | SoD-1 | ✗ (unsatisfiable without IA) |
| IC-4 | **Board ≠ IA on the same act** — Board approval of an act is distinct from IA attestation of that act's evidence. | SoD-4 | N/A |
| IC-5 | **Evidence reproduced, not copied** — attestation rests on re-derived evidence. | EAR-1 | ✗ (0 attestations) |
| IC-6 | **Verifiable by any party** — signature validates against the registered public key; tampered evidence fails verification. | SIG-4 | ✗ (no key registered) |
| IC-7 | **Independence declared** — explicit declaration of no authoring/restoration/self-attesting role. | `UCOS-W1-0001` §5; COI-4 | ✗ (unexecuted dossier) |

> **The independence trap (SR-2 framing; SR-14).** Independence cannot be created by *writing* a framework or a model — it is realized only by *use*: a governed designation of a distinct actor + a first signed attestation over reproduced evidence. Until IC-1..IC-7 hold in fact, every "independent" review authored by the corpus's single process is **self-attested** and, if signed by an authoring-chain key, **rejected fail-closed** (SIG-5).

---

## 3. Disqualifying Conditions (DQ)

Any one condition disqualifies a candidate or **voids** an attestation (SR-2 §3 COI + §9 REV; SR-t: `UCOS-W1-0001` §8 rejection triggers).

| ID | Disqualifying condition | Basis | Effect |
|----|-------------------------|-------|--------|
| DQ-1 | **Authorship/edit history** on the target artifact or its direct predecessors. | COI-1 / IRQ-4 | Ineligible for that target. |
| DQ-2 | **Shared key custody / credential store / signing seam** with the authoring identity. | COI-2 / SoD-3 | Attestation inadmissible/void. |
| DQ-3 | **Outcome interest** — recorded interest in a particular verdict (e.g., owner of a dependent downstream artifact) without recusal. | COI-3 | Must recuse; non-recusal disqualifies. |
| DQ-4 | **False COI declaration.** | COI-4 | Voids attestation; triggers REV. |
| DQ-5 | **Reliance on copied/asserted (not reproduced) evidence.** | EAR-1 | Evidence inadmissible → attestation FAIL. |
| DQ-6 | **Signature key resolves to the artifact's authoring identity** (author-signed-as-reviewer). | SIG-5 | Signature **rejected** at the crypto layer. |
| DQ-7 | **Key-custody compromise or shared-seam discovery** post-designation. | REV-1 / SoD-3 | Designation revoked; attestations VOID; key rotated. |
| DQ-8 | **Signature-verification failure** (tampered evidence or mismatched hash). | SIG-4 / REV-1 | Attestation void; dependents flagged (REV-5 cascade). |
| DQ-9 | **Not independent** — any authoring/restoration/self-attesting role in the corpus under review. | `UCOS-W1-0001` R-1 | STOP; record rejection; remain BLOCKED. |

> **Revocation is append-only (REV-3).** On any DQ trigger post-designation, the original attestations and the revocation are both retained (no ledger deletion; INV-10); any Board act that relied on a now-void attestation is flagged for re-review (REV-5 cascade).

---

## 4. Authority Boundaries (AB)

The IA's authority is **evidentiary, not executive** (SR-2 §4 RAS out-of-scope; SR-8 §2).

### 4.1 In scope — what the IA MAY do
| ID | In-scope authority | Basis |
|----|--------------------|-------|
| AB-1 | Reproduce cited evidence (re-run tests, re-derive counts, re-inspect tree, re-read ledger headers). | EAR-1..6 |
| AB-2 | Render a signed attestation with a three-valued verdict (PASS/PARTIAL/FAIL) over an evidence-artifact hash. | ATT §6 / SIG §7 |
| AB-3 | Maintain and append to the attestation-chain ledger. | ATT-3 / LIFE |
| AB-4 | Declare/avoid conflicts; recuse where required. | COI-1..5 |
| AB-5 | Serve as one of two witnesses for terminal/Operational certification (dual-witness). | WIT-1..5 |

### 4.2 Out of scope — what the IA MUST NOT do (hard boundary)
| ID | Out-of-scope act (reserved to the Board) | Basis |
|----|------------------------------------------|-------|
| AB-6 | Enact an AD / enroll an invariant / mutate a frozen construct. | RAS §4 / AUTH-012 §8 |
| AB-7 | Release a lock (Article IX) or issue a construction authorization. | RAS §4 / SR-13 Art. IX |
| AB-8 | Author, authorize, or construct any artifact under review. | RAS §4 / SoD |
| AB-9 | Change architecture, redesign governance, or write code. | RAS §4 |
| AB-10 | Self-designate or confer its own authority. | SoD-5 (bootstrapping is a Board act) |

> **Boundary principle:** "The IA attests evidence; it does not author, authorize, construct, or release." (SR-2 §4). Its output is a *verdict on evidence*, never a governance act (LIFE-3).

---

## 5. Decision Rights (DR)

The IA's decision surface is exactly three verdicts plus recusal (SR-2 §6 ATT-2, §8 LIFE, §3 COI-3).

| ID | Decision right | Meaning | Downstream effect |
|----|----------------|---------|-------------------|
| DR-1 | **PASS** | Reproduced evidence fully supports the target's claim; all admissibility criteria met. | Target's element (6) may CLOSE; Board may rely (BOARD-USE). |
| DR-2 | **PARTIAL** | Evidence supports the claim with tracked conditions. | Target advances only on Board-accepted, tracked conditions (LIFE-1). |
| DR-3 | **FAIL** | Required evidence absent, copied, inadmissible, or contradicted by the live tree. | Blocks the target fail-closed; returns to owner (LIFE-2). |
| DR-4 | **RECUSAL** | Declared outcome interest or discovered conflict. | Minuted; a clean IA is assigned. |

**Decision constraints:**
- **DR-C1** A verdict is inadmissible if any mandatory ATT field is empty (ATT-1, fail-closed).
- **DR-C2** Absence of required evidence yields **FAIL**, never a pending pass (EAR-4).
- **DR-C3** On conflict between an artifact's claim and the reproduced live tree/canonical `AUTH-012`, the reproduced state governs (EAR-3 / `GOV-REC-001`).
- **DR-C4** The IA cannot convert its own PARTIAL/FAIL into an approval — only the Board acts on the verdict.

---

## 6. Required Records (RR)

Every IA action produces append-only, hash-chained records (SR-2 §6/§8; SR-8 §2/§3; SR-3 §6). These are the artifacts a designated IA must generate or that must exist about the IA.

| ID | Required record | Produced by | Basis | Exists today? |
|----|-----------------|-------------|-------|:-------------:|
| RR-1 | **IA designation decision** (distinct actor + KMS key custody) enrolled in `AUTH-012`. | Board (drafted by Custodian) | IRQ-6 / G1 | ✗ ABSENT |
| RR-2 | **Registered IA public key** record in `governance-registry.ts`. | Custodian/Exec | SIG-6 / G2 | ✗ ABSENT |
| RR-3 | **Competence basis** record (domain competence for the assigned class). | Board/Custodian | IRQ-3 | ✗ ABSENT |
| RR-4 | **COI declaration** per attestation (COI-1..3 = none/recused). | IA | COI-4 / ATT | ✗ ABSENT |
| RR-5 | **Attestation record** (ATT schema: target@hash, IA identity/class, key fingerprint, scope, evidence admitted, reproduction note, verdict, timestamp, prev-hash, signature). | IA | ATT §6 | ✗ ABSENT (0 on chain) |
| RR-6 | **Attestation-chain ledger** (append-only, hash-chained genesis + subsequent). | IA/Custodian | ATT-3 / LIFE | ✗ EMPTY |
| RR-7 | **Lifecycle transition log** (REQUESTED→…→CLOSED, audit-logged). | IA/Custodian | LIFE-4 | ✗ ABSENT |
| RR-8 | **Revocation record** (if any DQ triggers). | Board/Custodian | REV-2/3 | N/A |
| RR-9 | **Dual-witness set** (two concurring attestations) — for terminal/Operational cert only. | 2× IA | WIT-1..5 / G4 | ✗ ABSENT |
| RR-10 | **Durable-enrollment evidence** for RR-1 (committed via `REAL-M-07` wave). | Exec/Custodian | `REAL-H-07` R-3 | ✗ PENDING |

---

## 7. Minimum Viable Adjudicator (MVA)

The smallest configuration that satisfies RC/IC and makes SoD *satisfiable* (SR-3 §6; SR-4 OUTPUT; SR-9 Step 1).

### 7.1 MVA definition
> **One** natural person **or** one distinct accountable role that: (a) is **outside** the authoring/construction chain of the target (IC-1/RC-4); (b) holds **one** KMS-backed **Ed25519** signing key whose custody is **disjoint** from all authoring/CI-signing identities (RC-2/IC-2, AUTH-008 S3); (c) has **recorded competence** in the target's class (RC-3); and (d) is **designated by an enrolled Board `AUTH-012` decision** (RC-6/G1), with (e) that public key **registered** via `governance-registry.ts` (RC-8/G2). This MVA can then produce the **genesis attestation** (G3) over one real MIR target, reproducing (not copying) its evidence.

### 7.2 MVA sufficiency by scope
| Scope | MVA sufficient? | Additional requirement |
|-------|:---------------:|------------------------|
| **General MIR reviews** (CRITICAL/HIGH ratifications, Article IX release predicates) | **YES** | None beyond G1∧G2∧G3. |
| **Terminal / Operational certification** | **NO** | Requires **two** distinct MVAs (distinct keys, no shared custody) for dual-witness concurring PASS (WIT-1..5 / G4). |

### 7.3 MVA class coverage
- A **single** MVA holding multiple classes (`IA-GOV`+`IA-IMP`, etc.) is permitted **provided** it violates no SoD rule for a given artifact (SR-2 §1). For the immediate closure (attest authority-chain restoration + PI-8/PI-9 ratifications + REAL-H-07 gate — `UCOS-W1-0001` S-1..S-4), an **`IA-GOV`** competence basis is the minimum class.
- **Rotation** (COI-5) is *preferred* across a series but not required for the MVA; non-rotation is recorded with rationale.

### 7.4 What the MVA does NOT relax
- The MVA does **not** relax IC-1/IC-2 (independence and key separation are non-negotiable — they are the whole point).
- The MVA does **not** authorize the IA to release the lock or enact any AD (AB-6..AB-10 stand).
- The MVA does **not** waive AUTH-008 S1/S3/S4 (non-waivable).

---

## OUTPUT — Workstream B

- **Required characteristics:** RC-1..RC-8 (distinct identity, distinct key custody, competence, no-authorship, reproduction capability, ledger standing, ratified crypto only, registered key).
- **Independence criteria:** IC-1..IC-7 — all currently **unrealized** (0 designations, 0 keys, 0 attestations); independence is realized by **use**, not definition.
- **Disqualifying conditions:** DQ-1..DQ-9 (authorship, shared custody, outcome interest, false declaration, copied evidence, author-signed key, custody compromise, verification failure, non-independence).
- **Authority boundaries:** IA is **evidentiary** (AB-1..AB-5 in scope) and **not executive** (AB-6..AB-10 out of scope, reserved to the Board).
- **Decision rights:** PASS / PARTIAL / FAIL / RECUSAL (DR-1..DR-4) with fail-closed constraints DR-C1..DR-C4.
- **Required records:** RR-1..RR-10 — **all ABSENT/EMPTY/PENDING** today.
- **Minimum Viable Adjudicator:** one distinct actor, outside the authoring chain, one KMS-backed Ed25519 key custodially disjoint, competence-recorded, Board-designated (G1) and key-registered (G2), producing a genesis attestation (G3). **Two** such actors required only for certification dual-witness (G4). Role currently **UNFILLED** — the decisive gap.

## Governance / Non-Mutation Statement
No adjudicator designated; no person or body named; no authority conferred; no key registered; no attestation produced; no `git` mutation; no lock released; no invariant enrolled; no governance modified. `INV-1..13`, `AUTH-012` (v1.0.13), `AD-0014`, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged. Read-only model; the sole repository effect is this additive analysis `*.md`.

## Traceability
- **Consumes:** SR-2 §1–§10 (IRQ/SoD/COI/RAS/EAR/ATT/SIG/LIFE/REV/WIT); SR-8 §2/§6; SR-4 §2; SR-3 §2/§4/§6; `UCOS-W1-0001` §5/§8; AUTH-008/009/012.
- **Models:** the Independent Adjudicator role (characteristics, independence, disqualifiers, boundaries, decision rights, records, MVA).
- **Feeds:** Workstream C (attestation package), D (board action), E (key registration), G (closure checklist), H (readiness), and `REAL-C-05-CLOSURE-REPORT`.
- **Subordinate to:** AUTH-008 (S1/S3/S4), AUTH-009 (SoD/terminal authority), AUTH-012 (§8/AD-0009), `UCOS-CONST-001`, Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Independent Adjudicator to be designated (this model designates none).

**END REAL-C-05-INDEPENDENT-ADJUDICATOR-MODEL — WORKSTREAM B · RC-1..8 · IC-1..7 (UNREALIZED) · DQ-1..9 · AUTHORITY EVIDENTIARY-NOT-EXECUTIVE (AB-1..10) · DECISION RIGHTS PASS/PARTIAL/FAIL/RECUSAL · RR-1..10 ABSENT · MVA = 1 DISTINCT ACTOR + 1 DISJOINT KMS KEY + BOARD DESIGNATION (2 FOR CERT DUAL-WITNESS) · ROLE UNFILLED · NO DESIGNATION / NO MUTATION.**
