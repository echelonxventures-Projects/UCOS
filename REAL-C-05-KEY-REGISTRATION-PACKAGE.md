# REAL-C-05 — Key Registration Package (WORKSTREAM E)

> **PHASE R.3 · REAL-C-05 INDEPENDENT ADJUDICATION CLOSURE PACKAGE · READ-ONLY GOVERNANCE ANALYSIS**
> NO CODE · NO IMPLEMENTATION · NO KEY GENERATED · NO KEY REGISTERED · NO CUSTOM CRYPTO · NO LOCK RELEASE · NO GOVERNANCE MUTATION
> This artifact **determines the key records, custody, registration, verification, and evidence requirements** for the Independent Adjudicator's signing key. It generates no key, registers no key, and references no secret material. Keys are handled **by reference only** (AUTH-008 S3).

| Field | Value |
|-------|-------|
| Artifact ID | `REAL-C-05-KEY-REGISTRATION-PACKAGE` |
| Workstream | **E — Key Registration Package** |
| Phase | **R.3** |
| Version | 1.0.0 |
| Date | 2026-07-03 |
| Mode | **DETERMINATION / REQUIREMENTS ONLY** — specifies what key records, custody, registration, verification, and evidence must exist for G2. |
| Inputs (read-only) | `AUTH-008` S1/S3/S4 (non-waivable; secrets/keys by reference; custody separation); `REAL-C-05-ESTABLISHMENT-RECORD` §7 SIG-1..6, §12 G2; `UCOS-REAL-C-05-ANALYSIS-R2-001` §2/§5 (key custody, registration); `UCOS-GOV-ACTOR-MODEL-R2-001` §6 (executor-key ≠ IA-key); `UCOS-LOCK-REL-EXEC-R2-001` Step 1; `REAL-C-05-INDEPENDENT-ADJUDICATOR-MODEL` (WS-B RC-2/RC-7/RC-8, IC-2). Reused primitives (reuse-only citation): `packages/platform-runtime/src/control/federation/assertions.ts` (Ed25519); `.../governance/governance-registry.ts`. Source scheme SR-1..SR-14 per Workstream A. |
| **Determination** | The key requirements are **fully specified**: a **KMS-backed Ed25519** key, custody **disjoint** from all authoring/CI-signing identities, **registered by reference** (public key only) via `governance-registry.ts` as a governed decision (G2). **No key exists / is registered** today. Registration (G2) is an Approval-Required Operation gated on the Board designation (G1). **No custom crypto** — the ratified `assertions.ts` primitive is reused. |

---

## 1. Required Key Records (KR)

Every record is **by reference** — public key fingerprint and custody path only; **no private material** appears in code, config, metadata, the attestation body, or this package (AUTH-008 S3; SIG-2).

| ID | Required key record | Content (by reference) | Basis | Exists? |
|----|---------------------|------------------------|-------|:-------:|
| KR-1 | **IA public-key record** | Ed25519 public-key fingerprint; algorithm; IA identity/class; creation timestamp. | SIG-6 / RC-8 | ✗ ABSENT |
| KR-2 | **Custody path record** | KMS-backed custody path/handle; confirmation the path is disjoint from authoring/CI-signing identities. | SIG-2/3 / IC-2 / AUTH-008 S3 | ✗ ABSENT |
| KR-3 | **Registration decision** | The enrolled `AUTH-012` note recording the key as governed data (links to the G1 designation AD). | SIG-6 / G2 | ✗ ABSENT |
| KR-4 | **Custody-separation attestation** | Statement that the IA key is not the CI-signing key and not any authoring identity's key (executor-key ≠ IA-key). | SoD-3 / SR-8 §6 | ✗ ABSENT |
| KR-5 | **Rotation/revocation record** *(if triggered)* | New public-key registration on rotation; prior public key retained verifiable-as-void. | REV-4 | N/A |

> **Secrets discipline (AUTH-008 S3, non-waivable).** The IA private key is held in KMS-backed custody and referenced only. No KR record contains private key material. This package specifies record *structure*, not key *material*.

---

## 2. Custody Requirements (CUST)

| ID | Custody requirement | Basis |
|----|---------------------|-------|
| CUST-1 | **KMS-backed custody** — the IA signing key is held in a KMS; never in source, config, or metadata. | SIG-2 / AUTH-008 S3 |
| CUST-2 | **Custody disjoint from authoring/CI identities** — the custody path shares no store, credential, or signing seam with any authoring identity or the CI-signing key bound in REAL-C-02. | SIG-3 / SoD-3 / IC-2 |
| CUST-3 | **Executor-key ≠ IA-key** — the operator executing provisioning/`git`/real-spend holds a key distinct from the IA key. | SR-8 §6 |
| CUST-4 | **Single custodian per key** — no shared custody between the two IAs required for dual-witness (distinct keys, no shared custody). | WIT-1 |
| CUST-5 | **Non-waivable floor** — S1 (integrity), S3 (secrets by reference), S4 carry into custody arrangements; the Board never weakens them. | AUTH-008 S1/S3/S4 |

---

## 3. Registration Requirements (REG)

Registration = making the IA **public** key discoverable and governed so signatures are verifiable (G2). It is an Approval-Required Operation (BA-2 / RES-2 in Workstream D).

| ID | Registration requirement | Basis |
|----|--------------------------|-------|
| REG-1 | **Register via `governance-registry.ts`** — the IA public key is registered as governed data using the existing ratified registry primitive (reuse-only; no new mechanism). | SIG-6 / G2 |
| REG-2 | **Public key only** — registration records the public-key fingerprint by reference; no private material. | SIG-2 / AUTH-008 S3 |
| REG-3 | **Enrolled decision** — registration is itself recorded as an enrolled `AUTH-012` note linked to the G1 designation AD. | SIG-6 / IRQ-6 / BA-2 |
| REG-4 | **Prior to reliance** — no attestation may be relied upon before the key is registered (registration precedes G3 reliance). | SIG-6 / LIFE-1 |
| REG-5 | **Gated on designation** — REG requires the Board designation (G1) to exist first (sequencing SEQ-2). | SR-9 Step 1 / WS-D SEQ-2 |
| REG-6 | **No custom crypto** — registration and signing reuse `assertions.ts` (Ed25519) and `governance-registry.ts`; **nothing new is built**. | SIG-1 / SR-2 §14 |

---

## 4. Verification Requirements (VER)

Verification is what makes an attestation admissible and independence *provable* (SIG-4). Any party must be able to verify without trusting the author.

| ID | Verification requirement | Basis | Pass condition |
|----|--------------------------|-------|----------------|
| VER-1 | **Signature validates against the registered public key.** | SIG-4 / AC-V1 | valid ⇒ pass; invalid ⇒ void |
| VER-2 | **Signed hash matches the current evidence-artifact hash.** | SIG-4 / EAR-2 | match ⇒ pass; tampered ⇒ fail |
| VER-3 | **Key is custodially separate (COI clean).** | SIG-3 / AC-V2 | disjoint ⇒ pass |
| VER-4 | **Author-signed-as-reviewer rejected** — a key resolving to the artifact's authoring identity is rejected at the crypto layer. | SIG-5 / DQ-6 | reject author key |
| VER-5 | **≥1 attestation present on the chain** verifiable end-to-end. | AC-V3 | non-empty chain |
| VER-6 | **G1–G4 marked CLOSED** in `CONST-READY-001` §2.5 once satisfied. | AC-V4 | recorded |

> **Fail-closed:** tampered evidence ⇒ verification fails ⇒ attestation void (SIG-4); a signature whose key resolves to the authoring identity is rejected, not accepted provisionally (SIG-5).

---

## 5. Evidence Requirements (KEV)

The evidence that G2 (and its verification) actually happened (SR-3 §6/§7; SR-4 §5/§6).

| ID | Required evidence | Produced by | Basis | State |
|----|-------------------|-------------|-------|:-----:|
| KEV-1 | **Registered-key record** discoverable in `governance-registry.ts`. | Custodian/Exec | REG-1 / G2 | ✗ ABSENT |
| KEV-2 | **Enrolled `AUTH-012` registration note** linked to the G1 designation AD. | Custodian / Board | REG-3 / BA-2 | ✗ ABSENT |
| KEV-3 | **Custody-separation proof** — evidence the key path is disjoint from authoring/CI seam. | Exec/Custodian | CUST-2 / SoD-3 | ✗ ABSENT |
| KEV-4 | **Verification transcript** — a signature validated against the registered key over a real evidence hash (SIG-4). | IA / verifier | VER-1/VER-2 | ✗ ABSENT |
| KEV-5 | **Author-key-rejection proof** — demonstration that an authoring-identity key is rejected (SIG-5). | IA / verifier | VER-4 | ✗ ABSENT (if code path chosen) |
| KEV-6 | **Durable enrollment** — KEV-1/KEV-2 committed durably via the `REAL-M-07` wave. | Exec/Custodian | `REAL-H-07` R-3 / WS-D BA-4 | ✗ PENDING |

---

## 6. Registration Record Template (UNEXECUTED, by reference only)

```
IA-KEY-REGISTRATION  (UNEXECUTED TEMPLATE — v1.0.0 · PUBLIC KEY BY REFERENCE ONLY)
  ia_identity            : ⟨IA actor id⟩ / class ⟨IA-GOV|IA-SEC|IA-IMP|IA-OPS⟩
  designation_ref        : ⟨AUTH-012 AD-#### (G1)⟩            # links to Workstream D DA-1
  public_key_fingerprint : ⟨Ed25519 public-key fingerprint⟩  # NO private material (AUTH-008 S3)
  algorithm              : Ed25519 (reuse assertions.ts — no custom crypto)
  kms_custody_path       : ⟨by-reference handle⟩              # CUST-1
  custody_disjoint_from  : { authoring_identities: ⟨confirmed⟩, ci_signing_key: ⟨confirmed⟩ } # CUST-2/SoD-3
  registry               : governance-registry.ts             # REG-1
  enrolled_as            : ⟨AUTH-012 note (G2)⟩                # REG-3 / BA-2
  registered_before_reliance : [ ] (REG-4)
  durable_enrollment_ref : ⟨REAL-M-07 wave commit⟩            # KEV-6 / BA-4
  verification           : { sig_valid: [ ], hash_match: [ ], author_key_rejected: [ ] } # VER-1/2/4
```

---

## OUTPUT — Workstream E

- **Required key records:** KR-1..KR-5 (public-key record, custody path, registration decision, custody-separation attestation, rotation/revocation) — **by reference only**; all **ABSENT**.
- **Custody requirements:** CUST-1..CUST-5 (KMS-backed, disjoint from authoring/CI, executor-key≠IA-key, single custodian per key, non-waivable S1/S3/S4).
- **Registration requirements:** REG-1..REG-6 (register public key via `governance-registry.ts` as an enrolled decision, before reliance, gated on G1, **no custom crypto**).
- **Verification requirements:** VER-1..VER-6 (signature valid against registered key; hash match; custody separate; author-key rejected; non-empty chain; G1–G4 CLOSED recorded).
- **Evidence requirements:** KEV-1..KEV-6 (registered-key record, enrolled note, custody-separation proof, verification transcript, author-key-rejection proof, durable enrollment) — all **ABSENT/PENDING**.
- **State:** no key generated, referenced, or registered; **G2 is gated on the Board designation (G1)**; registration reuses ratified primitives (`assertions.ts`, `governance-registry.ts`) — nothing new is built.

## Governance / Non-Mutation Statement
No key generated; no key registered; no secret material referenced or exposed; no custom cryptography created; no adjudicator designated; no attestation produced; no `git` mutation; no lock released; no governance modified. All references to `assertions.ts` / `governance-registry.ts` are **reuse-only** citations of existing ratified primitives (read-only). `INV-1..13`, `AUTH-012` (v1.0.13), `AD-0014`, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged. The sole repository effect is this additive analysis `*.md`.

## Traceability
- **Consumes:** SR-11 (`AUTH-008` S1/S3/S4); SR-2 §7 SIG-1..6/§12 G2; SR-4 §2/§5; SR-8 §6; SR-9 Step 1; WS-B RC-2/RC-7/RC-8/IC-2; WS-D BA-2/RES-2/SEQ-2.
- **Determines:** key records, custody, registration, verification, and evidence requirements for G2.
- **Feeds:** Workstream C (SIG-REQ-6 registration), G (closure checklist), H (readiness), F (evidence), and `REAL-C-05-CLOSURE-REPORT`.
- **Reuses (no custom crypto):** `src/control/federation/assertions.ts` (Ed25519); `src/control/governance/governance-registry.ts`.
- **Subordinate to:** AUTH-008 (S1/S3/S4 non-waivable), AUTH-009 (SoD), AUTH-012 (§8/AD-0009), `UCOS-CONST-001`, Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** Custodian / Chief Authority Architect (drafts/registers); UCOS Authority Board (approves); Independent Adjudicator (key holder, to be designated).

**END REAL-C-05-KEY-REGISTRATION-PACKAGE — WORKSTREAM E · KR-1..5 (BY REFERENCE) · CUST-1..5 · REG-1..6 (NO CUSTOM CRYPTO) · VER-1..6 · KEV-1..6 ABSENT/PENDING · G2 GATED ON G1 · NO KEY GENERATED / NO KEY REGISTERED / NO MUTATION.**
