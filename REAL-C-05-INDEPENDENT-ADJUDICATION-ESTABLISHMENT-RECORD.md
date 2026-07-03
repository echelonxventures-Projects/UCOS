# REAL-C-05 — Independent Adjudication Establishment Record

## PHASE U8.1 — Establishment of the Independent Adjudication Framework (closes the mechanism half of REAL-C-05)

| Field | Value |
|-------|-------|
| Artifact | **REAL-C-05 — Independent Adjudication Establishment Record** |
| Artifact ID | `REAL-C-05-ESTABLISHMENT-RECORD` |
| Phase | **U8.1 — Independent Adjudication Establishment** |
| Layer | GOVERNANCE / ASSURANCE (independent-review framework establishment — defines the mechanism; designates no person) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **FRAMEWORK ESTABLISHMENT ONLY** — defines qualification, SoD, conflict rules, scope, admissibility, attestation, signatures, lifecycle, revocation, and witness requirements. **Writes no code, changes no architecture, redesigns no governance, designates no reviewer, and produces no attestation.** Append-only. |
| Authoritative input | **`CONST-READY-001`** (REAL-C-05 = FAIL — no genuinely independent adjudication; all verdicts self-attested) |
| Governing discipline | **Do not assume independence exists.** A framework on paper is a *necessary* but not *sufficient* condition for independence. Non-optimistic, fail-closed. |
| Reused primitives (no custom crypto) | `packages/platform-runtime/src/control/federation/assertions.ts` (Ed25519); `packages/platform-runtime/src/control/governance/governance-registry.ts`; the hash-chained append-only audit primitive (PI-7 precedent) |
| Governance basis | AUTH-009 (terminal authority / SoD), AUTH-008 (S1/S3/S4 — non-waivable; secrets/keys by reference), AUTH-012 (Decision Log; AD-0009 Approval-Required Operations), `UCOS-CONST-001` Art. XII (Approval-By-Exception), INV-10 (append-only) |
| Governance status | INV-1..13 unchanged; INV-14..20 NOT enrolled; AD-0014 intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. This record releases nothing. |
| **Determination** | **PARTIAL** — the independent-adjudication *mechanism* is fully established and sufficient by design; **genuine independence is not yet realized** because no distinct actor + key custody has been designated by a governed act and no attestation has been produced under this framework. The conversion gate PARTIAL → PASS is defined in §12. |

> **Framing (the trap this record must not fall into).** `CONST-READY-001` found REAL-C-05 FAIL precisely
> because every "independent" artifact was produced by a single authoring process. **This record is itself
> authored by that same process.** It therefore cannot, and does not, *claim* to create independence by being
> written. What it does is define the complete, testable mechanism such that — once the Authority Board enacts
> the single bootstrapping designation in §12 (a distinct actor with separately-custodied keys) — future
> reviews **become** genuinely independent and verifiably so. The honest verdict is **PARTIAL** until that act
> occurs and the first attestation is produced.

---

## 1. Independent Reviewer Qualification Criteria (IRQ)

A reviewer (natural person or a distinct accountable role) is eligible to hold **Independent Adjudicator (IA)**
status only if **all** of the following hold. Any single unmet criterion = ineligible (fail-closed).

| ID | Criterion | Test |
|----|-----------|------|
| IRQ-1 | **Distinct identity.** The IA is an actor distinct from the author/proposer/constructor/certifier of the artifact under review. | Attestation author identity ≠ artifact author identity (recorded, verifiable). |
| IRQ-2 | **Distinct key custody.** The IA holds a signing key whose custody is separate from any authoring/CI-signing identity (AUTH-008 S3: by reference only). | Key fingerprint registered under a custody path disjoint from authoring keys. |
| IRQ-3 | **Domain competence.** Demonstrable competence in the artifact's domain (governance, security, fabric implementation, or operations) sufficient to reproduce its evidence. | Recorded competence basis in the IA designation record. |
| IRQ-4 | **No authorship history on the target.** The IA has not authored, co-authored, or materially edited the artifact (or its direct predecessors) under review. | Authorship-provenance check against the artifact's traceability chain. |
| IRQ-5 | **Reproduction capability.** The IA can independently reproduce the artifact's cited evidence (re-run tests, re-derive counts, re-inspect the tree) — not merely read the claim. | Attestation must cite *reproduced* results, not copied ones. |
| IRQ-6 | **Standing in the ledger.** The IA designation is itself an enrolled `AUTH-012` decision (bootstrapping review is a governed act). | AD present in canonical `AUTH-012` before any attestation is relied upon. |

**IA classes.** `IA-GOV` (governance/ledger/authority), `IA-SEC` (security/threat/crypto), `IA-IMP`
(fabric/impl/test reproduction), `IA-OPS` (operational/NFR/DR evidence). A single actor MAY hold multiple
classes provided no SoD rule (§2) is thereby violated for a given artifact.

---

## 2. Separation-of-Duty Requirements (SoD)

The non-collapsible role chain (AUTH-009): **Proposer → Constructor → Certifier → Ratifier → Independent
Adjudicator → Authority Board**. Binding rules:

- **SoD-1** `proposer ≠ certifier ≠ ratifier ≠ independent adjudicator` for the same artifact. No actor occupies two of these roles on one artifact.
- **SoD-2** The IA MUST NOT be in the authoring/construction chain of the artifact under review (enforces IRQ-4).
- **SoD-3** **Key-level SoD.** The IA signing key MUST NOT be the CI-signing key or any authoring identity's key (AUTH-008 S3; ties REAL-C-02 CI-signing seam).
- **SoD-4** **Board ≠ IA on the same act.** The Authority Board's approval of an act is distinct from the IA's attestation of that act's evidence; a Board member acting as IA on their own approval is prohibited.
- **SoD-5** **No self-review of the framework.** This establishment record's *own* independence (the bootstrapping) is discharged by the Board designation act (§12), not by self-assertion.

---

## 3. Conflict-of-Interest Rules (COI)

- **COI-1** **Authorship conflict.** Any authorship/edit history on the target artifact disqualifies the IA (IRQ-4/SoD-2).
- **COI-2** **Custody conflict.** Sharing key custody, credential store, or signing seam with the authoring identity disqualifies the attestation (IRQ-2/SoD-3).
- **COI-3** **Outcome interest.** An IA with a recorded interest in a particular verdict (e.g., an owner of a dependent downstream artifact) MUST recuse; recusal is minuted.
- **COI-4** **Disclosure duty.** The IA declares, in the attestation, the absence of COI-1..COI-3; a false declaration voids the attestation and triggers §9 revocation.
- **COI-5** **Rotation on repeat.** For a series of related ratifications, IA rotation is preferred where feasible to avoid normalized-deviance capture; non-rotation is permitted but recorded with rationale.

---

## 4. Review Authority Scope (RAS)

**In scope (mandatory independent review — MIR).** Element (6) of every `REAL-*` unit; specifically:
- All **CRITICAL** and **HIGH** ratifications (`REAL-C-01..05`, `REAL-H-01..07`).
- The terminal certification (`UCOM-ULTIMATE-CERT-002`) and any Operational Certification.
- Every scoped Article IX release predicate — **including AD-0024 / AD-0025 / AD-0026** authorization-review attestations (per `CONST-READY-001` D-4/D-5/D-6 conditions).
- The retroactive-enrollment attestation and the pre-construction gate (`REAL-H-07`).

**Advisory / optional.** MEDIUM and LOW units, at Board discretion.

**Out of scope (the IA cannot do).** The IA **attests evidence; it does not author, authorize, construct, or
release.** The IA cannot enact an AD, release a lock, enroll an invariant, or mutate a frozen construct — those
remain Authority Board Approval-Required Operations (AUTH-012 §8 / AD-0009). The IA's output is a *verdict on
evidence*, never a governance act. **No architecture change, no governance redesign, no code** is within IA scope.

---

## 5. Evidence Admissibility Rules (EAR)

An attestation MAY rely only on **admissible** evidence:

- **EAR-1 Reproduced, not asserted.** Test counts, hashes, and NFR figures MUST be re-derived by the IA (re-run / re-inspect), not copied from the authoring artifact (enforces IRQ-5). Copied figures are inadmissible.
- **EAR-2 Immutable chain-of-custody.** Evidence artifacts are referenced by content hash; the hash-chained append-only audit primitive is the record of record.
- **EAR-3 Live-tree precedence.** Where an artifact's claim conflicts with the reproduced live tree or the canonical `AUTH-012` (v1.0.13), the reproduced state governs (`GOV-REC-001`: executed act > analysis; recency).
- **EAR-4 Completeness.** Absence of required evidence is a **FAIL**, never a pending pass (inherited non-optimism).
- **EAR-5 Attributable source.** Every admitted item cites a verifiable source (path + hash + reproduction command/result).
- **EAR-6 No hearsay from stale certs.** Superseded instruments (e.g., R14 facts) are inadmissible as positive evidence; they may be cited only as the defect being corrected.

---

## 6. Attestation Format (ATT)

Each independent attestation is a discrete, append-only record with a fixed schema:

```
ATTESTATION
  attestation_id      : ATT-<seq>
  target_artifact     : <artifact-id> @ <content-hash>
  ia_identity         : <IA actor id> / class(es)
  ia_key_fingerprint  : <Ed25519 public-key fingerprint>
  scope               : <MIR item(s) covered>
  coi_declaration     : { COI-1: none, COI-2: none, COI-3: none|recused }
  evidence_admitted   : [ { item, source_path, content_hash, reproduced_result } ... ]
  reproduction_note   : <what the IA re-ran/re-derived and the observed result>
  verdict             : PASS | PARTIAL | FAIL   (with per-criterion basis)
  conditions          : [ ... if PARTIAL ]
  timestamp           : <monotonic, anti-backdated>
  prev_attestation    : <hash of previous attestation in the chain | genesis>
  signature           : <detached Ed25519 signature over the record hash>
```

- **ATT-1** The record is inadmissible if any mandatory field is empty (fail-closed).
- **ATT-2** `verdict` maps to the same three-valued scale used program-wide.
- **ATT-3** The attestation is chained (`prev_attestation`) forming the **attestation-chain ledger**.

---

## 7. Signature Requirements (SIG)

- **SIG-1 Reuse the ratified primitive.** Signatures are detached **Ed25519** over the attestation record's content hash, produced via `src/control/federation/assertions.ts`. **No custom cryptography** (AUTH-008; PI-7 precedent).
- **SIG-2 Key by reference.** The IA private key is held in KMS-backed custody, referenced only (AUTH-008 S3); it never appears in code, config, metadata, or the attestation body.
- **SIG-3 Custody separation.** The IA key is distinct from the CI-signing key and any authoring identity (SoD-3); this is the cryptographic expression of independence.
- **SIG-4 Verifiability.** Any party can verify: (a) the signature validates against the registered IA public key, and (b) the signed hash matches the current evidence-artifact hash. Tampered evidence ⇒ verification fails ⇒ attestation void.
- **SIG-5 Author-as-reviewer rejection.** A signature whose key resolves to the artifact's authoring identity is **rejected** (enforces proposer ≠ certifier ≠ ratifier at the crypto layer).
- **SIG-6 Registration.** IA public keys are registered as governed data via `governance-registry.ts`; registration is an enrolled decision (IRQ-6).

---

## 8. Review Lifecycle (LIFE)

```
REQUESTED  → the owning artifact reaches element (6); MIR review requested
ASSIGNED   → an eligible IA (IRQ-1..6, SoD, COI clear) is assigned; assignment minuted
REPRODUCE  → IA independently re-derives the cited evidence (EAR-1)
ATTEST     → IA emits a signed attestation (§6/§7) with verdict PASS|PARTIAL|FAIL
CHAIN      → attestation appended to the attestation-chain ledger (immutable)
BOARD-USE  → Authority Board relies on the attestation for its Approval-Required act
CLOSED     → target's element (6) satisfied on a PASS (or PARTIAL with tracked conditions)
```

- **LIFE-1** A target may not advance past element (6) without a CLOSED (PASS) attestation, or a PARTIAL with Board-accepted, tracked conditions.
- **LIFE-2** A FAIL attestation blocks the target fail-closed; the artifact returns to its owner.
- **LIFE-3** The lifecycle produces evidence but **no** governance act; enactment remains the Board's (RAS out-of-scope).
- **LIFE-4** Every state transition is audit-logged (append-only, hash-chained).

---

## 9. Revocation Process (REV)

- **REV-1 Triggers.** False COI declaration (COI-4); discovered authorship conflict (IRQ-4); key-custody compromise or shared-seam discovery (SoD-3/SIG-3); reliance on inadmissible/copied evidence (EAR-1); signature-verification failure (SIG-4).
- **REV-2 Effect.** On trigger, the IA designation is **revoked** (a governed `AUTH-012` act) and **all attestations produced under the revoked key/identity are marked VOID** and re-opened for re-attestation by a clean IA.
- **REV-3 Non-destructive.** Revocation is append-only: the original attestations and the revocation are both retained (no ledger deletion; INV-10).
- **REV-4 Key rotation.** A compromised IA key is rotated (new registration under §7); prior signatures remain verifiable-as-void via the retained public key.
- **REV-5 Cascade.** Any Board act that relied on a now-void attestation is flagged for re-review before its dependents proceed (fail-closed cascade).

---

## 10. Certification Witness Requirements (WIT)

For the **terminal certification** and **Operational Certification**, independent review is strengthened to a
**dual-witness** standard:

- **WIT-1 Two distinct IAs.** At least two IAs of the relevant class(es), with mutually distinct keys and no shared custody, independently attest the same evidence.
- **WIT-2 Independent reproduction.** Each witness reproduces the decisive figures separately (no shared reproduction artifact).
- **WIT-3 Concurrence rule.** Certification proceeds only on **concurring PASS** attestations; any FAIL or unresolved PARTIAL among witnesses holds the certification (fail-closed).
- **WIT-4 Witness on the chain.** Both witness attestations are chained and referenced by the certification instrument.
- **WIT-5 Board separation.** Neither witness is the issuing Board authority for that certification (SoD-4).

---

## 11. Mechanism Completeness Check (self-audit against REAL-C-05 element requirements)

| REAL-C-05 required element | Established by | Complete? |
|----------------------------|----------------|:---------:|
| Distinct-actor / verifiable-attestation review authority | §1 IRQ, §2 SoD, §6 ATT | ✅ defined |
| Attestation over evidence-artifact hashes | §5 EAR, §6 ATT, §7 SIG | ✅ defined |
| No custom crypto (reuse Ed25519) | §7 SIG-1 | ✅ defined |
| Key custody separate from authoring identity | §2 SoD-3, §7 SIG-2/3 | ✅ defined |
| Author-signed-as-reviewer rejected | §7 SIG-5 | ✅ defined |
| Attestation-chain ledger | §6 ATT-3, §8 LIFE | ✅ defined |
| Bootstrapping designation recorded by Authority Board | §12 (gate) | ⏳ **pending Board act** |

**Result:** the mechanism is **complete by design**; the only unmet element is the *enactment* of the
bootstrapping designation — which is deliberately outside this record's authority (it is a Board act).

---

## 12. Required Determination — Can future reviews be considered genuinely independent?

> ### DETERMINATION: **PARTIAL**
>
> The independent-adjudication **mechanism is fully and sufficiently established** (§1–§11): qualification,
> separation-of-duty, conflict rules, scope, admissibility, attestation format, Ed25519 signature requirements,
> lifecycle, revocation, and dual-witness certification are all defined, testable, and grounded in ratified
> primitives with **no custom crypto, no new architecture, no governance redesign, and no code**.
>
> **However, genuine independence is NOT YET realized.** Two facts hold it at PARTIAL, non-optimistically:
> 1. **No distinct actor + separated key custody has been designated by a governed act.** Until the Authority
>    Board enrolls the bootstrapping designation (IRQ-6 / SoD-5) in canonical `AUTH-012`, every artifact —
>    including this one — remains produced by a single authoring process.
> 2. **No attestation has been produced under this framework.** Independence is demonstrated by *use*, not by
>    definition; zero attestations exist on the chain.
>
> **Conversion gate PARTIAL → PASS (all required):**
> - **G1** Authority Board enacts the IA designation as an enrolled `AUTH-012` decision — a distinct actor with
>   KMS-backed key custody disjoint from all authoring/CI-signing identities (§7 SIG-2/3).
> - **G2** The IA public key is registered via `governance-registry.ts` (§7 SIG-6).
> - **G3** At least one signed attestation is produced under §6/§7 and verified (§7 SIG-4), establishing the
>   attestation-chain genesis.
> - **G4** For the terminal/Operational certifications, the §10 dual-witness standard is met.
>
> On G1–G4 satisfied, future in-scope reviews **can** be considered genuinely independent and cryptographically
> verifiable. Until then, reviews conducted "per this framework" but signed by an authoring-chain key are, by
> SIG-5, **rejected** — the framework fails them closed rather than laundering self-review as independence.

### OUTPUT

**`REAL-C-05-ESTABLISHMENT-RECORD` — INDEPENDENT ADJUDICATION FRAMEWORK ESTABLISHED · 10/10 REQUIRED ELEMENTS
DEFINED (QUALIFICATION · SoD · COI · SCOPE · ADMISSIBILITY · ATTESTATION · SIGNATURE · LIFECYCLE · REVOCATION ·
WITNESS) · MECHANISM COMPLETE BY DESIGN · GENUINE INDEPENDENCE PENDING BOOTSTRAPPING BOARD DESIGNATION + FIRST
SIGNED ATTESTATION · DETERMINATION: PARTIAL (PASS-GATE G1–G4 DEFINED) · NO CUSTOM CRYPTO · NO ARCHITECTURE CHANGE ·
NO GOVERNANCE REDESIGN · NO CODE · NO AUTHORIZATION / NO LOCK RELEASE PERFORMED BY THIS ARTIFACT.**

---

## 13. Governance / Non-Mutation Statement

No source code, infrastructure, or authorization was produced; no lock released; no invariant enrolled; no
frozen construct modified; no reviewer designated. All references to `assertions.ts` / `governance-registry.ts`
are **reuse-only** citations of existing ratified primitives (read-only). INV-1..13, `AUTH-012` (v1.0.13),
AD-0014, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged. Establishing the IA
designation (G1), registering keys (G2), and producing attestations (G3/G4) remain Approval-Required Operations
(AUTH-012 §8 / AD-0009) reserved to the UCOS Authority Board.

## 14. Traceability
- **Consumes (authoritative):** `CONST-READY-001` (REAL-C-05 = FAIL; decisive cross-cutting blocker).
- **Realizes:** `REAL-001` REAL-C-05 (element-6 review capability for every unit); the independent-review predicate of `AUTH-CONST-001` AD-0024/0025/0026 (A3 reviews) and `OP-CERT-001` cross-track independence.
- **Reuses (no custom crypto):** `src/control/federation/assertions.ts` (Ed25519); `src/control/governance/governance-registry.ts`; PI-7 hash-chained append-only audit primitive.
- **Subordinate to:** AUTH-008 (S1/S3/S4), AUTH-009 (terminal authority/SoD), AUTH-012 (Decision Log/AD-0009), `UCOS-CONST-001` Art. XII, INV-10.
- **Refined by:** the prospective Authority-Board bootstrapping designation (G1), key registration (G2), and the first signed attestations (G3/G4) — which convert this record's determination from PARTIAL to PASS.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Independent Adjudicator(s) to be designated.

**END REAL-C-05 — INDEPENDENT ADJUDICATION ESTABLISHMENT RECORD · PHASE U8.1 · MECHANISM COMPLETE · DETERMINATION: PARTIAL · GENUINE INDEPENDENCE GATED ON BOARD DESIGNATION (G1–G4) · FRAMEWORK ESTABLISHMENT ONLY · NO CODE / NO ARCHITECTURE / NO GOVERNANCE REDESIGN.**
