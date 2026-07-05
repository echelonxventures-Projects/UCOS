# REAL-C-05 — Attestation Package (WORKSTREAM C)

> **PHASE R.3 · REAL-C-05 INDEPENDENT ADJUDICATION CLOSURE PACKAGE · READ-ONLY GOVERNANCE ANALYSIS**
> NO CODE · NO IMPLEMENTATION · NO ATTESTATION · NO SIGNATURE · NO LOCK RELEASE · NO GOVERNANCE MUTATION
> This artifact **defines** the attestations, statements, evidence references, signatures, signatories, and retention required to close REAL-C-05. It produces **no attestation** and gathers **no signature**; all templates are UNEXECUTED.

| Field | Value |
|-------|-------|
| Artifact ID | `REAL-C-05-ATTESTATION-PACKAGE` |
| Workstream | **C — Attestation Package** |
| Phase | **R.3** |
| Version | 1.0.0 |
| Date | 2026-07-03 |
| Mode | **DEFINITION / PREPARATION ONLY** — blank templates and requirements for a designated Independent Adjudicator to complete at execution time. |
| Inputs (read-only) | `REAL-C-05-INDEPENDENT-ADJUDICATION-ESTABLISHMENT-RECORD` §5 (EAR), §6 (ATT), §7 (SIG), §8 (LIFE), §9 (REV), §10 (WIT), §12 (gate); `UCOS-W1-0001` §3–§8 + Forms F-1..F-4; `UCOS-REAL-C-05-ANALYSIS-R2-001` §4/§5; `REAL-C-05-INDEPENDENT-ADJUDICATOR-MODEL` (WS-B, RR-1..10); `AUTH-008` S3; `AUTH-012` INV-10. Source scheme SR-1..SR-14 per Workstream A. |
| **Determination** | The attestation requirements are **fully specified and template-complete**; **zero attestations exist** (empty chain). The **minimum closing set** is: one G3 genesis attestation (general independence) plus, at certification time, a G4 dual-witness pair. All are **UNEXECUTED** here and can be produced only by a designated IA (post-G1/G2). |

---

## 1. Required Attestations (ATT-SET)

Derived from RAS/MIR (SR-2 §4), the R.2 attestation table (SR-4 §4), and the W1 dossier subjects (SR-t `UCOS-W1-0001` §2). Each attestation is a discrete, append-only, chained record (ATT-3).

| ID | Attestation | Target(s) | Basis | Gate | Required for closure? |
|----|-------------|-----------|-------|:----:|:---------------------:|
| ATT-SET-1 | **Genesis attestation** — ≥1 signed Ed25519 attestation over a real MIR target, evidence **reproduced not copied**, verified per SIG-4 → attestation-chain genesis. | one MIR target (e.g., authority-chain restoration) | §12 G3 / SR-4 §4 | G3 | **YES (mandatory, minimum)** |
| ATT-SET-2 | **Authority-chain re-attestation** — `AUTH-012` v1.0.13 enrolls AD-0001..0023 end-to-end; `AD-0021` disposition confirmed. | `AUTH-REST-004`; `AUTH-012` ledger | `UCOS-W1-0001` S-1; SR-4 §4 (RIA) | G3-class | YES (independence conversion) |
| ATT-SET-3 | **PI-8 (Ontology) ratification** valid. | `ONTO-RAT-001` | `UCOS-W1-0001` S-2 | G3-class | YES (independence conversion) |
| ATT-SET-4 | **PI-9 (Memory) ratification** valid; `MEM-RAT-001` (REJECTED) superseded by `MEM-RAT-003`. | `MEM-RAT-003`; `MEM-RAT-001` | `UCOS-W1-0001` S-3 | G3-class | YES (independence conversion) |
| ATT-SET-5 | **Pre-construction gate** `REAL-H-07` returns PASS on the attested state. | `REAL-H-07` | `UCOS-W1-0001` S-4 | G3-class | YES (independence conversion) |
| ATT-SET-6 | **Terminal certification re-issue** `UCOM-ULTIMATE-CERT-002` independently attested against 269/269 canonical state. | `UCOM-ULTIMATE-CERT-002` | SR-9 Step 3; SR-4 §3 | dual-witness | YES *only at terminal cert* (G4) |
| ATT-SET-7 | **Operational Certification** dual-witness attestation (G12-1/2/3 evidence). | Operational Certification | SR-9 Step 8; §10 WIT | dual-witness | YES *only at op cert* (G4) |
| ATT-SET-8 | **Article IX release predicates** independently attested (incl. AD-0024/0025/0026). | release predicate set | SR-2 §4; SR-9 Step 9 | on release | Conditional (release-time) |

> **Minimum for operational independence closure (SR-3 §6):** ATT-SET-1 (genesis) alone satisfies **G3**. ATT-SET-2..5 are the standing W1 subjects that convert the self-attested foundation to independently attested (the RM-8/`UCOS-W1-0001` dossier). ATT-SET-6/7 attach **only** to terminal/Operational certification and require the **dual-witness** standard (G4).

---

## 2. Required Statements (STMT)

Each attestation MUST carry these statements, or it is inadmissible (ATT-1 fail-closed; COI-4; `UCOS-W1-0001` §5/§7).

| ID | Required statement | Basis |
|----|--------------------|-------|
| STMT-1 | **Independence declaration** — "I certify I had no authoring, restoration, or self-attesting role in the artifact / corpus under review." | COI-4 / `UCOS-W1-0001` §5 (SIG-1) |
| STMT-2 | **COI declaration** — COI-1 (authorship) = none; COI-2 (custody) = none; COI-3 (outcome interest) = none or recused. | COI-1..4 / ATT `coi_declaration` |
| STMT-3 | **Reproduction statement** — what the IA re-ran / re-derived and the observed result (not copied). | EAR-1 / ATT `reproduction_note` |
| STMT-4 | **Evidence-admissibility statement** — each admitted item cited by source path + content hash + reproduction command/result. | EAR-2/EAR-5 / ATT `evidence_admitted` |
| STMT-5 | **Verdict statement** — PASS / PARTIAL / FAIL, with per-criterion basis; conditions if PARTIAL. | ATT-2 / DR-1..3 |
| STMT-6 | **Scope statement** — the MIR item(s) covered by this attestation. | ATT `scope` / RAS |
| STMT-7 | **Chain statement** — hash of the previous attestation (`prev_attestation`) or `genesis`. | ATT-3 / LIFE-CHAIN |
| STMT-8 | **Anti-backdating statement** — monotonic timestamp. | ATT `timestamp` |
| STMT-9 | **Self-attestation reliance = 0** — declares no reliance on self-attested evidence in lieu of reproduced evidence. | `UCOS-W1-0001` M-3 / EAR-1 |

---

## 3. Required Evidence References (EREF)

The attestations reference (read-only, by path + version + content hash) the following evidence items (SR-t `UCOS-W1-0001` §3; SR-4 §4/§7; EAR-5). **The IA references and reproduces these; this package assembles none.**

| Ref | Evidence item | Consumed by | Location field (IA completes) |
|-----|---------------|-------------|-------------------------------|
| EREF-1 | `AUTH-REST-004` documentary restoration record | ATT-SET-2 | `⟨path/version/hash⟩` |
| EREF-2 | `AUTH-012` v1.0.13 ledger export (AD-0001..0023) | ATT-SET-2 | `⟨path/version/hash⟩` |
| EREF-3 | Phantom `AD-0021` disposition (withdrawn/superseded) | ATT-SET-2 | `⟨path/version/hash⟩` |
| EREF-4 | `ONTO-RAT-001` (PI-8 ratification) | ATT-SET-3 | `⟨path/version/hash⟩` |
| EREF-5 | `MEM-RAT-003` (PI-9 ratification) | ATT-SET-4 | `⟨path/version/hash⟩` |
| EREF-6 | `MEM-RAT-001` (REJECTED; supersession target) | ATT-SET-4 | `⟨path/version/hash⟩` |
| EREF-7 | `REAL-H-07` gate definition/runner + result | ATT-SET-5 | `⟨path/version/hash⟩` |
| EREF-8 | Reproduced `node --test` 269/269 result | ATT-SET-6 | `⟨path/version/hash⟩` |
| EREF-9 | `UCOM-ULTIMATE-CERT-002` reconciliation table | ATT-SET-6 | `⟨path/version/hash⟩` |
| EREF-10 | G12-1/2/3 operational evidence packs (provisioning, pipeline, DR, measured NFRs) | ATT-SET-7 | `⟨path/version/hash⟩` |

**Admissibility rule (EAR-1..6):** each EREF must be (a) reproduced not copied, (b) referenced by content hash, (c) live-tree/canonical-ledger precedent on conflict, (d) present or the attestation FAILs, (e) attributable, (f) not stale-cert hearsay.

---

## 4. Required Signatures (SIG-REQ)

Detached **Ed25519** over the attestation record's content hash; **no custom cryptography** (SR-2 §7; AUTH-008 S3; PI-7 precedent).

| ID | Signature requirement | Basis |
|----|-----------------------|-------|
| SIG-REQ-1 | **Ed25519 detached** over the attestation record hash, via `assertions.ts`. | SIG-1 |
| SIG-REQ-2 | **Key by reference** — IA private key in KMS-backed custody; never in code, config, metadata, or the attestation body. | SIG-2 / AUTH-008 S3 |
| SIG-REQ-3 | **Custody separation** — IA key distinct from the CI-signing key and any authoring identity. | SIG-3 / SoD-3 |
| SIG-REQ-4 | **Verifiability** — signature validates against the registered IA public key AND the signed hash matches the current evidence-artifact hash; tampered evidence ⇒ verification fails ⇒ void. | SIG-4 |
| SIG-REQ-5 | **Author-as-reviewer rejection** — a signature whose key resolves to the artifact's authoring identity is **rejected**. | SIG-5 |
| SIG-REQ-6 | **Registration** — IA public key registered via `governance-registry.ts` before any reliance (G2). | SIG-6 |
| SIG-REQ-7 | **Dual-witness signatures** — two distinct IA signatures, distinct keys, no shared custody, for terminal/Operational certification. | WIT-1..5 / G4 |

---

## 5. Required Signatories (SIGNATORY)

Roles that must sign; drawn from `UCOS-W1-0001` §5 and the actor model (SR-8). **This package names no person.**

| ID | Signatory role | Signs | SoD constraint | Basis |
|----|----------------|-------|----------------|-------|
| SIGNATORY-1 | **Independent Adjudicator** (producer of the attestation) | ATT-SET-1..8 (as scoped) | ∉ authoring/construction chain; key ≠ CI/authoring keys | `UCOS-W1-0001` SIG-1; SR-8 §2 |
| SIGNATORY-2 | **`REAL-H-07` gate operator** (deterministic) | ATT-SET-5 gate result (F-3) | distinct from IA-as-reviewer of same artifact | `UCOS-W1-0001` SIG-2 |
| SIGNATORY-3 | **UCOS Authority Board** — acceptance of evidence (**not a lock lift**) | Board acceptance minute (F-4) | Board ≠ IA on same act (SoD-4) | `UCOS-W1-0001` SIG-3; SR-8 §1 |
| SIGNATORY-4 | **Second Independent Adjudicator** (witness) | ATT-SET-6/7 dual-witness | distinct key, no shared custody with SIGNATORY-1 | WIT-1..5 |

> **Mandatory independence declaration (SIGNATORY-1):** "I certify I had no authoring, restoration, or self-attesting role in the UCOS corpus under review." `[ ] affirmed` (STMT-1).

---

## 6. Attestation Record Template (UNEXECUTED)

Reproduces the fixed ATT schema (SR-2 §6). Every `⟨…⟩` / `[ ]` is completed **only** by the designated IA at execution time.

```
ATTESTATION  (UNEXECUTED TEMPLATE — v1.0.0)
  attestation_id      : ATT-⟨seq⟩
  target_artifact     : ⟨artifact-id⟩ @ ⟨content-hash⟩
  ia_identity         : ⟨IA actor id⟩ / class(es) ⟨IA-GOV|IA-SEC|IA-IMP|IA-OPS⟩
  ia_key_fingerprint  : ⟨Ed25519 public-key fingerprint⟩
  scope               : ⟨MIR item(s) covered⟩                                  # STMT-6
  coi_declaration     : { COI-1: ⟨none⟩, COI-2: ⟨none⟩, COI-3: ⟨none|recused⟩ } # STMT-2
  independence_decl   : ⟨"no authoring/restoration/self-attesting role"⟩ [ ]    # STMT-1
  self_attest_reliance: ⟨0⟩                                                     # STMT-9 (M-3=0)
  evidence_admitted   : [ { item, source_path, content_hash, reproduced_result } ... ] # STMT-4
  reproduction_note   : ⟨what re-run/re-derived + observed result⟩              # STMT-3
  verdict             : ⟨PASS | PARTIAL | FAIL⟩ (per-criterion basis)           # STMT-5
  conditions          : [ ⟨... if PARTIAL⟩ ]
  timestamp           : ⟨monotonic, anti-backdated⟩                             # STMT-8
  prev_attestation    : ⟨hash of previous attestation | genesis⟩               # STMT-7
  signature           : ⟨detached Ed25519 over record hash⟩                     # SIG-REQ-1
```
- **ATT-1** Inadmissible if any mandatory field is empty (fail-closed).
- **ATT-2** `verdict` maps to the program-wide three-valued scale.
- **ATT-3** Chained via `prev_attestation` → attestation-chain ledger.

### 6.1 Genesis attestation cover (ATT-SET-1 / G3) — UNEXECUTED
```
GENESIS ATTESTATION — REAL-C-05 G3
  target      : ⟨MIR target, e.g., AUTH-REST-004 authority-chain restoration⟩
  ia          : ⟨designated IA⟩  key fp: ⟨____⟩  registered (G2): [ ]
  reproduced  : ⟨command/result⟩   verdict: ⟨PASS/PARTIAL/FAIL⟩
  prev        : genesis            signature: ⟨____⟩
  establishes : attestation-chain genesis; G3 = ⟨TRUE/FALSE⟩
```

### 6.2 Dual-witness cover (ATT-SET-6/7 / G4) — UNEXECUTED
```
DUAL-WITNESS ATTESTATION SET — G4 (terminal / operational certification)
  witness_1 (IA-a): key fp ⟨____⟩  verdict ⟨PASS⟩  reproduced independently: [ ]
  witness_2 (IA-b): key fp ⟨____⟩  verdict ⟨PASS⟩  reproduced independently: [ ]
  shared custody? : ⟨NO⟩ (WIT-1)   concurring PASS: ⟨YES/NO⟩ (WIT-3)
  chained + referenced by certification instrument: [ ] (WIT-4)
  neither witness is issuing Board authority: [ ] (WIT-5 / SoD-4)
```

---

## 7. Required Retention Records (RET)

Append-only, hash-chained, non-destructive (SR-2 §9 REV-3; AUTH-012 INV-10).

| ID | Retention record | Retention rule | Basis |
|----|------------------|----------------|-------|
| RET-1 | Every attestation (PASS/PARTIAL/FAIL) | Retained permanently; append-only; never deleted. | INV-10 / ATT-3 |
| RET-2 | The attestation-chain ledger (genesis onward) | Immutable record of record; hash-chained. | ATT-3 / EAR-2 |
| RET-3 | Revocation records (if any) + the original (now-VOID) attestations | Both retained; non-destructive revocation. | REV-3 |
| RET-4 | Public keys (incl. rotated/compromised) | Retained so prior signatures remain verifiable-as-void. | REV-4 |
| RET-5 | Lifecycle transition log (REQUESTED→…→CLOSED) | Audit-logged append-only. | LIFE-4 |
| RET-6 | Board acceptance minutes (evidence acceptance, not lift) | Enrolled append-only on `AUTH-012`. | `UCOS-W1-0001` F-4 |
| RET-7 | Dual-witness sets | Chained + referenced by the certification instrument. | WIT-4 |

---

## 8. Acceptance & Rejection (package-level, from `UCOS-W1-0001` §7/§8)

**Attestation ACCEPTED (AT-P0-1 = PASS) iff all true:**
- Independence affirmed (STMT-1); IA distinct from all authoring parties.
- All in-scope subjects recorded ATTESTED.
- Self-attestation reliance = 0 (STMT-9); chain gaps = 0; gate result = PASS (where applicable).
- Attestation of record, versioned, referenced in the traceability chain.
- Board acceptance recorded append-only on `AUTH-012` (evidence acceptance, **not** a lock lift).

**Attestation REJECTED (FAIL) if any true:**
- Adjudicator not independent (DQ-9 / R-1).
- Any in-scope subject not ATTESTED (R-2).
- Gate returns FAIL (R-3).
- Self-attestation offered in lieu of independent evidence (R-4).
- Chain gap present / disposition missing (R-5).
- Any evidence item not of record / unversioned / mutated (R-6).
- Signature verification fails or key resolves to authoring identity (SIG-4/SIG-5).

> On any rejection: **remain BLOCKED**; the target's element (6) stays OPEN; re-attest with a clean IA. No downstream Approval-Required act may rely on a rejected/void attestation (REV-5 cascade).

---

## OUTPUT — Workstream C

- **Required attestations:** ATT-SET-1..8 — minimum closing set = **ATT-SET-1 genesis (G3)**; ATT-SET-2..5 convert the self-attested foundation; ATT-SET-6/7 add **dual-witness (G4)** at certification.
- **Required statements:** STMT-1..9 (independence, COI, reproduction, admissibility, verdict, scope, chain, anti-backdating, zero self-attestation reliance).
- **Required evidence references:** EREF-1..10 (by path + version + content hash; reproduced not copied).
- **Required signatures:** SIG-REQ-1..7 (Ed25519, key-by-reference, custody-separated, verifiable, author-as-reviewer rejected, registered, dual-witness for cert).
- **Required signatories:** SIGNATORY-1..4 (IA, gate operator, Board-acceptance, second IA witness); **named none**.
- **Required retention:** RET-1..7 (append-only, hash-chained, non-destructive, permanent).
- **State:** **0 attestations exist**; all templates **UNEXECUTED**; producible only by a designated IA (post-G1/G2). Template sufficiency for third-party execution: **YES**.

## Governance / Non-Mutation Statement
No attestation performed; no signature gathered; no measurement taken; no key registered; no adjudicator designated; no `git` mutation; no lock lifted; no self-attestation made; no governance modified. `INV-1..13`, `AUTH-012` (v1.0.13), `AD-0014`, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged. Read-only preparation; the sole repository effect is this additive analysis `*.md`.

## Traceability
- **Consumes:** SR-2 §5–§10/§12; `UCOS-W1-0001` §2–§8 + Forms F-1..F-4; SR-4 §4/§5; WS-B RR-1..10; AUTH-008 S3; AUTH-012 INV-10.
- **Defines:** the attestation set, statements, evidence references, signatures, signatories, and retention required to close REAL-C-05 (G3 + G4).
- **Feeds:** Workstream E (key registration underpins SIG-REQ-6), G (closure checklist), H (readiness), F (evidence), and `REAL-C-05-CLOSURE-REPORT`.
- **Subordinate to:** AUTH-008 (S3), AUTH-009 (SoD), AUTH-012 (§8/AD-0009/INV-10), `UCOS-CONST-001`, Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** Independent Adjudicator (producer, to be designated); UCOS Authority Board (acceptance authority); custodian: Chief Authority Architect.

**END REAL-C-05-ATTESTATION-PACKAGE — WORKSTREAM C · ATT-SET-1..8 (MIN = GENESIS/G3; DUAL-WITNESS/G4 @ CERT) · STMT-1..9 · EREF-1..10 · SIG-REQ-1..7 (ED25519, NO CUSTOM CRYPTO) · SIGNATORY-1..4 (NAMED NONE) · RET-1..7 APPEND-ONLY · 0 ATTESTATIONS · TEMPLATES UNEXECUTED · NO ATTESTATION / NO SIGNATURE / NO MUTATION.**
