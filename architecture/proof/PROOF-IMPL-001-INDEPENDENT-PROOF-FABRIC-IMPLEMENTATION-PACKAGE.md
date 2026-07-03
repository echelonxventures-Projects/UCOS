# PROOF-IMPL-001 — Independent Proof Fabric · Implementation Package (B01)

**Program:** IMPLEMENTATION PACKAGE B01 — Independent Proof Fabric
**Artifact ID:** `PROOF-IMPL-001`
**Artifact family:** `PROOF-*`
**Location:** `architecture/proof/`
**Mode:** DESIGN / SPECIFICATION ONLY — no source code committed, no lock release, no ratified-artifact mutation, no invariant enrollment
**Status:** CREATED — DESIGN — READY FOR AUTHORIZATION REVIEW
**Reuses:** PI-5 Federation cryptography (`control/federation/assertions.ts` — Ed25519, `canonicalize`, `sha256`; no custom crypto) · `AUDIT-UNIV-001` (Universal Audit/Provenance primitive) · PI-6 Evolution commit discipline (AD-0019; Evolution Fabric = sole durable-commit path) · PI-4 Control Plane (deny-by-default authorization; S1/S3/S4/S6) · PI-2/3 Substrate (Registry / Metadata / Configuration ports)
**Governance:** Subordinate to AUTH-008 (Security Canon; S1/S3/S4/S6 non-waivable), AUTH-009 (Authority hierarchy), AUTH-012 (Decision Log; AD-0014 Ω∞ deferral), Constitution Article IX (generation lock — **ACTIVE**), `UCOS-ASR-NFR-001` (INV-1..13, unchanged), `INV-CORE-001` (canonical integrity invariants)
**Date:** 2026-07-02

> **Governing disclaimer.** This is a governed **design/specification** package for a **not-yet-authorized**
> fabric. It writes no source code, releases no lock, enrolls no invariant (no INV-14..20), mutates no frozen
> construct, and confers no authority. All TypeScript, SQL, and contract fragments herein are **design
> specification**, not committed source. Construction of `src/control/proof/*` requires a **separate scoped
> Article IX release** (a prospective `AD-00xx`) issued by the Authority Board, sequenced after the P0
> governance restoration (`ARCH-GAP-VAL-001 §6`; C3 authority-chain + M5 ledger reconciliation). Until then the
> Proof Fabric remains conceptual/design and `UCOS-CONSTRUCTION-BLOCKED` stands. INV-1..13 and the Article IX
> generation lock are unchanged.

---

## Package structure (4 parts)

| Part | Sections | Contents |
|:----:|----------|----------|
| **1** | 1–6 | Executive Summary · Fabric Scope · Architecture · Domain Model · Service Architecture · Runtime Architecture |
| 2 | 7–12 | Data Model · Registry Architecture · Event Model · Storage Schema · API Specification · Signature Framework |
| 3 | 13–18 | Attestation Framework · Verification Framework · Independent Review Workflow · Security Architecture · Governance Model · Integration Points |
| 4 | 19–22 | Repository Layout · Acceptance Tests · Implementation Backlog · Authorization Readiness Assessment |

---

# PART 1 OF 4

---

## 1. Executive Summary

### 1.1 Purpose

The **Independent Proof Fabric** (`PROOF-*`) is the UCOS control-layer fabric that makes every consequential
claim in the platform **independently, cryptographically, and reproducibly provable** — by a party who does
**not** trust the claimant, does **not** share the claimant's runtime, and may verify **offline**. It converts
UCOS's pervasive-but-scattered notion of "evidence" into a first-class, governed substrate: a claim is not
"true because a service said so," it is true because an **append-only evidence chain**, a set of **detached
multi-signatures over a canonical digest**, and a **deterministic verifier** say so, and any third party can
re-run that verifier over exported bytes and reach the identical verdict.

The fabric answers one question, uniformly, for the entire platform:

> *"Given claim X asserted by actor A at time T, can an independent verifier — with no access to A's runtime and
> no obligation to trust A — establish that X is authentic, unaltered, attributable, and complete?"*

### 1.2 Why it is needed

UCOS already produces enormous quantities of evidence — ratification reports, audit chains, completion
certifications, WP evidence packs, `CTX-REG-001` registrations — but that evidence is **heterogeneous,
self-attested, and non-composable**. The recurring program finding is precisely this: `ARCH-GAP-VAL-001 C1`
observed that audit/provenance was re-implemented six times; `AF-001 AF-F-3` observed that *integrity does not
compose*; `REAL-M-03` observed that critical ratifications are **self-attested** and require independent
adjudication (`REAL-C-05`). The Independent Proof Fabric is the structural remedy: it is the **one place** where
a claim becomes a signed, chained, verifiable **Proof** that any independent reviewer (human or machine, local
or federated) can validate without trusting the producer.

It sits one layer above `AUDIT-UNIV-001`. The Universal Audit primitive answers *"what happened, in tamper-
evident order?"*; the Proof Fabric answers *"can an adversarial third party prove that what a claim asserts is
authentic and complete?"* Audit is a chained log of events; Proof is a signed, verifiable, reviewable assertion
**about** evidence, with an explicit independent-review lifecycle and a deterministic pass/fail verdict.

### 1.3 What it delivers (the eight mandated capabilities)

| # | Capability | Fabric construct | Reused primitive |
|:-:|------------|------------------|------------------|
| 1 | **Evidence Ledger** | Append-only, hash-chained, event-sourced ledger of evidence records | `AUDIT-UNIV-001` chained-ledger pattern (SHA-256, `prevHash` continuity) |
| 2 | **Attestation Registry** | Registry-driven catalogue of attestations (who attests what, under which policy) | PI-2/3 Registry + Metadata (`proof:attestation:*`) |
| 3 | **Verification Service** | Deterministic, side-effect-free verifier producing a reproducible verdict | INV-6 determinism; INV-CORE-09 |
| 4 | **Evidence Chain** | Cryptographic linkage: evidence → digest → chain entry → proof | `federation/assertions.ts` `sha256` + `canonicalize` |
| 5 | **Signature Framework** | Detached Ed25519 signatures over canonical digests; keys by reference (S3) | PI-5 `assertions.ts` (Ed25519); AUTH-008 S3 |
| 6 | **Independent Review Workflow** | Separation-of-duties review lifecycle (propose → attest → verify → review → ratify) | PI-4 governance registry + PI-6 Evolution commit |
| 7 | **Proof APIs** | Contract-first API surface for submit / attest / verify / review / export | `UCOS-SVC-*` contract discipline |
| 8 | **Proof UI** | Design-level experience surfaces for proof submission, review, and audit | `UCOS-EXP-*` experience discipline |

### 1.4 Design tenets (traceable to the mandate requirements)

| Requirement (B01) | Realization in this package |
|-------------------|------------------------------|
| **Registry driven** | Every proof type, attestation policy, signature policy, verifier, and review policy is a **registry/metadata record** (`proof:*` keyspace) resolved at runtime; the fabric ships with **zero built-in proof types**. |
| **No hard coding** | Verifiers, quorum thresholds (M-of-N), review roles, retention classes, and evidence schemas are **configuration/metadata**, never literals in code (IP-04; INV-CORE-14). |
| **Event sourced** | The Evidence Ledger **is** the source of truth: proof state is a **fold** over an append-only event stream; no destructive update path exists. |
| **Audit immutable** | Every fabric action emits a `PROOF_*` event into the hash-chained `AUDIT-UNIV-001` ledger; the evidence chain itself is append-only and tamper-evident (S6; INV-CORE-02). |
| **Cryptographically verifiable** | Authenticity = Ed25519 detached signatures over a `canonicalize()`+`sha256` digest; integrity = SHA-256 `prevHash` chain; **offline verify** reproduces the verdict from exported bytes. |
| **Multi-signature capable** | Attestation quorums are **M-of-N** over an enumerated, policy-defined signer set, with threshold, role, and independence constraints evaluated deterministically. |

### 1.5 Boundaries (what the fabric is *not*)

The Proof Fabric is **non-actuating** and holds **no independent durable-commit path**. It never mutates
another fabric's state, never issues authority, and never overrides governance. It **produces verdicts and
proofs**; acting on a verdict (e.g. promoting a ratification) is always a **downstream governance decision**
committed exclusively through the **Evolution Fabric** (AD-0019). It performs **no custom cryptography** (reuse
only), selects **no technology** beyond the ratified ADRs, and touches **none** of the five prohibited substrate
core directories.

### 1.6 Authorization posture

This package is **design-complete and authorization-ready**. It defines the full fabric (Parts 1–3) and a
test-green, additive, waved construction plan (Part 4) confined to `src/control/proof/*` plus one additive
re-export. It is **not** an authorization to build. Construction is gated on a scoped Article IX release
(prospective `AD-00xx`) sequenced after the P0 governance restoration. Determination and gate detail are in
**Part 4 §22**.

---

## 2. Fabric Scope

### 2.1 In scope

**S-1 — Evidence capture.** Accept evidence submissions (by-reference or by-value-digest) from any UCOS actor
(service, fabric, human, autonomous agent, federated node) and record them as immutable, addressable
`EvidenceRecord`s on the append-only Evidence Ledger.

**S-2 — Evidence chaining.** Bind each evidence record into a per-subject **Evidence Chain**: a hash-chained
sequence whose head hash is a compact, tamper-evident commitment to the entire evidentiary history of a subject.

**S-3 — Attestation.** Allow enumerated, policy-authorized attesters to make **signed attestations** over an
evidence digest, supporting **single** and **multi-signature (M-of-N)** quorums with role/independence
constraints.

**S-4 — Signature management (by reference).** Provide a signature framework over Ed25519 (reused from PI-5)
that signs canonical digests, verifies detached signatures, and manages **key references** (never key material;
S3). Keys are resolved through the ratified secrets/KMS substrate reference model.

**S-5 — Verification.** Provide a **deterministic Verification Service** that, given a `Proof` and its evidence,
produces a reproducible `Verdict` (`VALID` / `INVALID` / `INCOMPLETE` / `INDETERMINATE`) computable **offline**
from exported bytes by a party with no fabric access.

**S-6 — Independent review.** Provide a **separation-of-duties review workflow** (proposer ≠ attester ≠ verifier
≠ reviewer ≠ ratifier) so that a proof's promotion to `RATIFIED` requires independent parties, closing the
self-attestation defect surfaced by `REAL-M-03` / `REAL-C-05`.

**S-7 — Proof export & offline verification.** Emit a self-contained **Proof Bundle** (evidence digests, chain
segment, signatures, verifier reference, verdict) that any third party can verify offline, reproducing the
verdict byte-for-byte.

**S-8 — Federated proof exchange.** Allow proofs to be **exported to and imported from** federated nodes under
the PI-5 federation trust model (advisory/deny-only/clamped/namespace-isolated/fail-closed); a foreign proof
carries foreign provenance and is **re-verified locally** before any local effect.

**S-9 — Registry-driven configurability.** Every proof type, evidence schema, signature policy, attestation
policy, verifier binding, review policy, and retention class is a runtime `proof:*` metadata record — the fabric
is fully data-driven with no built-in proof semantics.

**S-10 — Immutable audit & provenance.** Every fabric operation emits a `PROOF_*` event to the `AUDIT-UNIV-001`
hash-chained ledger with a provenance envelope; the fabric's own actions are themselves provable.

### 2.2 Out of scope (explicit exclusions)

| # | Excluded | Owner / Rationale |
|:-:|----------|-------------------|
| X-1 | Custom cryptography (new ciphers, hashes, signature schemes) | **Prohibited.** Reuse `federation/assertions.ts` only (AUTH-008; ADR-006). |
| X-2 | Durable mutation of any other fabric's state | **Evolution Fabric only** (AD-0019). Proof produces verdicts, not commits. |
| X-3 | Issuing/altering authority, identity, or policy | PI-4 Control / PI-5 Federation / Authority Board. Proof consumes them. |
| X-4 | Acting on a verdict (promotion, enforcement, revocation of another artifact) | Downstream governance decision (Evolution commit). |
| X-5 | Technology/vendor/cloud/KMS/datastore selection | Ratified `UCOS-PLAT-ADR-001..007`; this package is technology-neutral with a mapping note only. |
| X-6 | Key material storage or generation | Secrets/KMS substrate (S3); the fabric holds **references** only. |
| X-7 | Existential/self-directed proof reasoning (Ω∞) | Deferred under AD-0014; no INV-14..20 enrolled or required. |
| X-8 | Modification of `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts` | Prohibited core dirs; the fabric is additive in `src/control/proof/*` only. |

### 2.3 Actors

| Actor | Role in the fabric |
|-------|--------------------|
| **Submitter** | Any principal presenting evidence for a claim (produces `EvidenceRecord`s; may open a `ProofCase`). |
| **Attester** | An enumerated, policy-authorized principal who signs an attestation over an evidence digest. |
| **Verifier (service)** | The deterministic Verification Service; also any independent external re-verifier. |
| **Independent Reviewer** | A principal, structurally distinct from submitter/attester, who adjudicates a proof under the review workflow. |
| **Ratifier** | The authority (per governance tier) whose decision — committed via Evolution — promotes a proof to `RATIFIED`. |
| **Federated node** | A remote UCOS node exchanging proofs under the PI-5 trust model. |
| **Auditor** | Any party reading the immutable `PROOF_*` audit stream and evidence chain for after-the-fact assurance. |

### 2.4 Fabric position

```
                 Authority Board / Governance (ratification decisions)
                                  ▲  (verdicts inform, never bind, governance)
                                  │
        ┌─────────────────────────┴───────────────────────────┐
        │            INDEPENDENT PROOF FABRIC (PROOF-*)         │   ← this package
        │  Evidence Ledger · Attestation Registry · Verifier    │
        │  Evidence Chain · Signature Framework · Review WF     │
        └───┬───────────┬───────────┬───────────┬──────────────┘
            │ reuses    │ reuses    │ reuses    │ commits-via
            ▼           ▼           ▼           ▼
   AUDIT-UNIV-001   PI-5 Fed.   PI-4 Control   PI-6 Evolution
   (hash-chain)     (Ed25519)   (deny-default) (sole commit path)
            │           │           │
            └───────────┴───────────┴──► PI-2/3 Substrate (Registry · Metadata · Configuration)
```

The Proof Fabric is a **pure consumer** of the substrate and the ratified fabrics. It adds capability by
**composition**, not by re-implementation.

---

## 3. Architecture

### 3.1 Architectural style

The fabric is an **event-sourced, registry-driven, deny-by-default control-layer service** with a **pure
deterministic core**. Three architectural commitments dominate every downstream decision:

1. **Event-sourced core.** The authoritative state of any `Proof` is a deterministic **fold** over the
   append-only Evidence Ledger and Proof event stream. There is no mutable "current proof" row that is updated
   in place; there is an event history and a computed projection. This yields immutability (INV-CORE-02),
   reproducibility (INV-6 / INV-CORE-09), and trivially correct audit.

2. **Pure verifier.** Verification is a **total, side-effect-free function** `verify(proof, evidence, policy) →
   verdict`. It performs no I/O, consults no clock, and reads no ambient state. Every inflight input it needs is
   passed explicitly. This is what makes **offline, independent** verification possible and what guarantees the
   local verdict equals the federated re-verification verdict.

3. **Composition over the ratified primitives.** Cryptography = PI-5; tamper-evident ordering =
   `AUDIT-UNIV-001`; durable commitment of any consequence = PI-6 Evolution; authorization = PI-4 Control;
   persistence = PI-2/3 ports. The fabric owns **orchestration and proof semantics**, nothing lower.

### 3.2 Layered view

```
┌──────────────────────────────────────────────────────────────────────────┐
│  L5  Experience (design-only)      Proof consoles / review surfaces        │
├──────────────────────────────────────────────────────────────────────────┤
│  L4  Proof API surface             submit · attest · verify · review ·     │
│                                    export · import · query (contract-first)│
├──────────────────────────────────────────────────────────────────────────┤
│  L3  Proof Orchestration           ProofCase lifecycle · Review Workflow · │
│      (control-layer services)      Attestation orchestration · Federation  │
├──────────────────────────────────────────────────────────────────────────┤
│  L2  Proof Core (PURE)             Verifier · Evidence-Chain builder ·      │
│                                    Digest/Canonicalize · Quorum evaluator   │
├──────────────────────────────────────────────────────────────────────────┤
│  L1  Proof Persistence (ports)     EvidenceLedgerPort · ProofRegistryPort · │
│                                    AttestationStorePort · via PI-2/3        │
├──────────────────────────────────────────────────────────────────────────┤
│  L0  Reused primitives             assertions(Ed25519) · UniversalAuditLog ·│
│                                    Evolution commit · Control Plane (PEP)   │
└──────────────────────────────────────────────────────────────────────────┘
```

- **L2 is pure and dependency-inverted**: it depends only on interfaces and reused pure functions
  (`canonicalize`, `sha256`, Ed25519 verify). It never imports a store or a clock. This is the layer an
  independent third party re-implements/re-runs to verify offline.
- **L3 orchestrates** but never mutates durable state directly: it appends events to the ledger and, for any
  cross-fabric consequence, submits an **Evolution Unit**.
- **L1 ports** are satisfied by the substrate's Registry/Metadata/Configuration runtimes; the fabric ships
  in-memory reference adapters and defines seams for durable adapters (deferred, technology per ADR-002).

### 3.3 Core architectural invariants (fabric-local)

| ID | Invariant | Enforcement |
|----|-----------|-------------|
| PROOF-INV-1 | **Append-only evidence.** No evidence record or chain entry is ever mutated or deleted. | Ledger exposes only `append` + read; chaining verified on every append (fail-closed). |
| PROOF-INV-2 | **Deterministic verdict.** `verify()` is pure and total; same inputs ⇒ same verdict, everywhere, offline. | No I/O/clock/ambient reads in L2; `resultHash` reproducibility (INV-6). |
| PROOF-INV-3 | **Cryptographic authenticity.** Every attestation is an Ed25519 detached signature over a canonical digest. | Reuse `assertions.ts`; deny attestation with an unverifiable/absent signature. |
| PROOF-INV-4 | **Independence of review.** Ratification requires distinct principals across proposer/attester/verifier/reviewer. | Review workflow SoD guard; deny on role overlap (fail-closed). |
| PROOF-INV-5 | **No independent commit.** No consequence outside the fabric occurs except via an Evolution Unit. | Orchestration has no write path to other fabrics; Evolution-only. |
| PROOF-INV-6 | **Registry-driven.** No proof type / policy / verifier / quorum is hard-coded. | All resolved from `proof:*` metadata; empty registry ⇒ fabric produces no proofs. |
| PROOF-INV-7 | **Fail-closed.** Absent policy, unresolved verifier, missing signature, or quorum shortfall ⇒ deny / `INDETERMINATE`, never a silent pass. | Default branch of every decision is deny. |
| PROOF-INV-8 | **Provable self.** Every fabric action is itself an immutable `PROOF_*` audit event with provenance. | `AUDIT-UNIV-001` sink on every operation. |

### 3.4 Trust model (summary; detail in Part 3 §16)

The verifier is trusted **as code**, not as a runtime: because it is pure and its inputs are explicit and
signed, an independent party running the same verifier version over the same exported bytes reaches the same
verdict. Authenticity is anchored in Ed25519 keys resolved by reference through the ratified identity/secrets
substrate; the fabric never holds private key material. Integrity is anchored in the SHA-256 evidence chain and
the `AUDIT-UNIV-001` head-hash. Independence is anchored in the review workflow's separation-of-duties guards.
Federated proofs are **never** trusted on import; they are re-verified locally, deny-by-default, with clamped
trust and isolated provenance.

### 3.5 Determinism & reproducibility

Every proof carries a `resultHash = sha256(canonicalize({ proofRef, evidenceDigests, verifierId, verifierVersion,
verdict, policyRef }))`. Reproducibility means: independently recomputing `verify()` over the exported bundle
yields the identical `resultHash`. This binds the verdict to (a) exactly which evidence, (b) exactly which
verifier version, and (c) exactly which policy — eliminating "verdict drift" and making a proof a stable,
citable object across time and nodes.

---

## 4. Domain Model

### 4.1 Aggregates and entities

The domain is organized around the **ProofCase** aggregate: the unit of independent review over a claim. Its
entities and value objects:

| Construct | Kind | Identity | Summary |
|-----------|------|----------|---------|
| **ProofCase** | Aggregate root | `proofCaseId` | The reviewable unit: a claim + its evidence + attestations + verdict + review state. |
| **Claim** | Value object | — (embedded) | The assertion being proved: `{ subject, predicate, statementDigest, claimant, proofTypeId }`. |
| **EvidenceRecord** | Entity | `evidenceId` | An immutable piece of evidence (by-reference URI or by-value digest) with schema + classification. |
| **EvidenceChainEntry** | Entity | `(subject, seq)` | A hash-chained commitment binding an `EvidenceRecord` into a subject's chain. |
| **Attestation** | Entity | `attestationId` | A signed statement by an attester over an evidence digest, with role + policy reference. |
| **SignatureBlock** | Value object | — | `{ keyRef, alg:"ed25519", sig, signedDigest, at }` — a detached signature. |
| **QuorumState** | Value object | — | Progress of an M-of-N attestation set against a signature policy. |
| **Verdict** | Value object | — | `{ status, resultHash, verifierId, verifierVersion, reasons[], at }`. |
| **ReviewRecord** | Entity | `reviewId` | An independent reviewer's adjudication with SoD metadata. |
| **ProofBundle** | Value object | — (derived) | The exportable, offline-verifiable artifact. |
| **ProofType** | Registry record | `proofTypeId` | Declares evidence schema, signature policy, verifier binding, review policy, retention. |

### 4.2 ProofCase lifecycle (state machine)

```
        submit                attest (→ quorum)         verify
 ○──────────────▶ OPEN ──────────────────────▶ ATTESTED ──────────▶ VERIFIED
                   │                               │                    │
                   │ withdraw                      │ quorum-fail        │ verdict INVALID/INCOMPLETE
                   ▼                               ▼                    ▼
                WITHDRAWN                       REJECTED             CONTESTED
                                                                        │
   independent review (SoD)                                            │ remediate → re-verify
        VERIFIED ──────────────▶ UNDER_REVIEW ──────────────▶ RATIFIED │
                                      │ review-fail                     │
                                      ▼                                 │
                                  REJECTED ◀───────────────────────────┘
```

**States:** `OPEN` (case opened, evidence accruing) · `ATTESTED` (signature quorum satisfied) · `VERIFIED`
(deterministic verifier returned `VALID`) · `CONTESTED` (verifier returned `INVALID`/`INCOMPLETE`, or a reviewer
raised a dispute) · `UNDER_REVIEW` (independent reviewer adjudicating) · `RATIFIED` (independently reviewed +
authority-ratified via Evolution) · `REJECTED` (terminal negative) · `WITHDRAWN` (terminal, submitter-initiated
before attestation) · `SUPERSEDED` (replaced by a newer proof of the same subject, migration-only, INV-CORE-03).

All transitions are **events** appended to the ledger; the state above is a **projection**, never a stored
mutable field. Every transition is authorized by the Control Plane (deny-by-default) and audited.

### 4.3 Domain types (design specification)

```ts
// SPECIFICATION — not committed code. Proposed: src/control/proof/types.ts
// Reuses federation primitives: canonicalize, sha256, Ed25519 verify (assertions.ts). No custom crypto.

export type ProofStatus =
  | "OPEN" | "ATTESTED" | "VERIFIED" | "CONTESTED"
  | "UNDER_REVIEW" | "RATIFIED" | "REJECTED" | "WITHDRAWN" | "SUPERSEDED";

export type VerdictStatus = "VALID" | "INVALID" | "INCOMPLETE" | "INDETERMINATE";

export type EvidenceMode = "by-reference" | "by-value-digest";

/** A single immutable piece of evidence. Value bytes are never stored by the fabric; only digests + refs. */
export interface EvidenceRecord {
  evidenceId: string;                 // ULID-like, fabric-assigned
  subject: string;                    // the thing evidence is about (artifactId, capabilityId, unitHash…)
  proofTypeId: string;                // resolves schema + policies from the registry
  mode: EvidenceMode;
  uri?: string;                       // for by-reference (content-addressed where possible)
  digest: string;                     // sha256(canonicalize(payload | referenced-content-descriptor))
  schemaRef: string;                  // proof:schema:<id> — validated on append
  classification: string;             // inherited data classification (S4)
  submittedBy: string;                // principal id
  at: number;                         // logical submit time (from event, not ambient clock in the pure core)
  provenance?: Provenance;            // FED-PROV-001 envelope (local | { nodeId,... })
  attributes?: Record<string, unknown>;
}

/** Hash-chained commitment binding evidence into a subject's evidence chain. */
export interface EvidenceChainEntry {
  subject: string;
  seq: number;
  evidenceId: string;
  evidenceDigest: string;
  prevHash: string;                   // GENESIS_HASH for seq 0
  entryHash: string;                  // sha256(canonicalize({evidenceDigest,seq,prevHash,subject}))
}

/** A detached Ed25519 signature over a canonical digest. Keys are referenced, never embedded (S3). */
export interface SignatureBlock {
  keyRef: string;                     // reference into the secrets/identity substrate; NOT key material
  alg: "ed25519";                     // fixed by ADR-006 reuse; no algorithm agility beyond ratified set
  signedDigest: string;               // the sha256 digest that was signed
  sig: string;                        // base64 detached signature (verified via assertions.ts)
  signedAt: number;
}

export interface Attestation {
  attestationId: string;
  proofCaseId: string;
  attester: string;                   // principal id
  role: string;                       // policy-defined attester role (registry)
  signaturePolicyRef: string;         // proof:signature-policy:<id>
  target: string;                     // evidenceDigest or chain headHash the attester signs
  signature: SignatureBlock;
  independenceTag?: string;           // group/affiliation used to enforce independence constraints
  at: number;
  provenance?: Provenance;
}

export interface Verdict {
  status: VerdictStatus;
  resultHash: string;                 // sha256(canonicalize({proofRef,evidenceDigests,verifierId,verifierVersion,verdict,policyRef}))
  verifierId: string;                 // proof:verifier:<id>
  verifierVersion: string;            // semver of the verifier binding
  reasons: string[];                  // deterministic, ordered explanation
  evaluatedDigests: string[];         // exactly which evidence was considered
  at: number;
}

export interface ReviewRecord {
  reviewId: string;
  proofCaseId: string;
  reviewer: string;                   // MUST be independent of submitter/attesters/verifier operator (SoD)
  reviewPolicyRef: string;            // proof:review-policy:<id>
  decision: "AFFIRM" | "DISPUTE" | "ABSTAIN";
  rationale: string;                  // mandatory, non-empty (no unexplained review)
  independenceProof: string[];        // the SoD facts the guard checked
  at: number;
}

export interface ProofCase {
  proofCaseId: string;
  claim: {
    subject: string; predicate: string; statementDigest: string;
    claimant: string; proofTypeId: string;
  };
  status: ProofStatus;                // PROJECTION (folded from events), never authoritative-stored
  evidenceIds: string[];
  chainHead: string;                  // current evidence-chain head hash for the subject
  attestationIds: string[];
  quorum: { policyRef: string; m: number; n: number; satisfiedBy: string[] };
  verdict?: Verdict;
  reviewIds: string[];
  ratification?: { evolutionUnitId: string; authority: string; at: number };
  supersededBy?: string;
  createdAt: number;
  version: number;                    // monotonic event count (optimistic concurrency)
}
```

### 4.4 ProofType (the registry-driven contract)

A `ProofType` is the metadata record that makes the fabric data-driven. It declares — for a *class* of claim —
which evidence schema is required, which signature/quorum policy governs attestation, which verifier adjudicates,
which review policy applies, and the retention class. **The fabric contains no built-in proof type**; an empty
`proof:type:*` registry means the fabric can accept nothing (fail-closed, INV-CORE-14).

```ts
// SPECIFICATION — Proposed registry record shape (stored as metadata, key: proof:type:<proofTypeId>)
export interface ProofType {
  proofTypeId: string;
  title: string;
  evidenceSchemaRefs: string[];       // proof:schema:* required/allowed for this type
  signaturePolicyRef: string;         // proof:signature-policy:* (M-of-N, roles, independence)
  verifierRef: string;                // proof:verifier:* (deterministic verifier binding + version)
  reviewPolicyRef: string;            // proof:review-policy:* (SoD roles, quorum, tier)
  retentionClass: string;             // mandatory; governs evidence/proof retention (never deletes chain)
  federationExportable: boolean;      // may proofs of this type be exported? (default false; deny-by-default)
  classificationFloor: string;        // minimum data classification (S4 monotonicity)
  owner: string;                      // single accountable authority for this proof type
}
```

### 4.5 Domain rules (selected)

- **DR-1 (evidence immutability).** An `EvidenceRecord` is write-once. Correction is a *new* record + a
  `SUPERSEDED` linkage event; the original remains on the chain (INV-CORE-03).
- **DR-2 (digest-before-signature).** Nothing is signed except a `sha256(canonicalize(...))` digest; signing raw
  payloads is prohibited (prevents malleability; enables offline verification of exactly what was attested).
- **DR-3 (quorum determinism).** Quorum satisfaction is a pure function of the attestation set and the signature
  policy; it is recomputed, never cached-as-truth.
- **DR-4 (independence).** A `ProofCase` cannot reach `RATIFIED` unless the review workflow verifies distinct
  principals (and, where the policy demands, distinct `independenceTag`s) across proposer/attester/verifier/reviewer.
- **DR-5 (verdict binding).** A `Verdict` is bound to a specific evidence set and verifier version via
  `resultHash`; adding evidence after a verdict invalidates the verdict and forces re-verification.
- **DR-6 (retention ≠ deletion).** Retention classes govern *recallability* of by-reference payloads; they never
  remove ledger entries or chain hashes (audit-preserving, mirroring MEM-AUD §5).

---

## 5. Service Architecture

### 5.1 Service decomposition

The fabric is realized as a set of **control-layer services** (L3 orchestration over the L2 pure core). Each
service is single-responsibility, deny-by-default, and emits audit on every operation. Services are **not**
network microservices in this package; they are composable control-layer modules whose *external* surface is the
Proof API (Part 2 §11). Mapping to durable/remote deployment is deferred to the ratified platform ADRs.

| Service | Responsibility | Reads | Writes (append-only) | Commits-via |
|---------|----------------|-------|----------------------|-------------|
| **EvidenceLedgerService** | Accept/append evidence; validate schema + classification; maintain evidence chain | Registry (schema), Config | Evidence Ledger, Evidence Chain, Audit | — (ledger append only) |
| **AttestationService** | Accept signed attestations; verify signatures; evaluate M-of-N quorum | Registry (signature policy), Identity/keys (by ref) | Attestation store, Audit | — |
| **VerificationService** | Run the deterministic verifier; produce `Verdict` + `resultHash` | Registry (verifier binding), evidence, attestations | Verdict events, Audit | — |
| **ReviewService** | Drive the independent-review SoD workflow; record `ReviewRecord`s | Registry (review policy), case projection | Review events, Audit | — |
| **RatificationGateway** | Translate an affirmed, verified, reviewed case into an Evolution Unit for authority ratification | Case projection, governance policy | (proposes) Evolution Unit; Audit | **PI-6 Evolution** |
| **ProofExportService** | Assemble/verify a self-contained `ProofBundle`; offline-verify on demand | Ledger, attestations, verdict | Audit | — |
| **FederationProofGuard** | Export/import proofs across nodes; re-verify foreign proofs locally | PI-5 federation trust, verifier | Namespaced foreign evidence, Audit | — |
| **ProofQueryService** | Read-only projections/queries over cases, chains, verdicts | Ledger, projections | Audit (read events optional) | — |

### 5.2 Service interaction — the canonical proof loop

```
Submitter ──submit(claim, evidence)──▶ EvidenceLedgerService
                                          │ append EvidenceRecord + ChainEntry, emit PROOF_EVIDENCE_APPENDED
                                          ▼
Attester ──attest(digest, sig)────────▶ AttestationService
                                          │ verify Ed25519 (assertions.ts); evaluate M-of-N quorum
                                          │ emit PROOF_ATTESTED; on quorum → PROOF_QUORUM_MET (ATTESTED)
                                          ▼
(auto/triggered) ─────────────────────▶ VerificationService.verify(proof, evidence, policy)  [PURE]
                                          │ deterministic → Verdict{status, resultHash}
                                          │ emit PROOF_VERIFIED (VERIFIED) | PROOF_CONTESTED
                                          ▼
Independent Reviewer ──review()───────▶ ReviewService (SoD guard: reviewer ≠ submitter/attester/verifier)
                                          │ emit PROOF_REVIEWED (AFFIRM/DISPUTE)
                                          ▼ (AFFIRM + VERIFIED)
RatificationGateway ──propose()───────▶ PI-6 Evolution Fabric  (sole durable-commit path)
                                          │ authority ratifies unit → PROOF_RATIFIED (RATIFIED)
                                          ▼
ProofExportService ──export()─────────▶ ProofBundle  (offline-verifiable by any third party)
```

Every arrow is authorized by the PI-4 Control Plane (deny-by-default) and audited via `AUDIT-UNIV-001`. The only
arrow that changes state **outside** the fabric is the RatificationGateway → Evolution edge; every other edge
appends fabric-local, immutable events.

### 5.3 Service contracts (design)

```ts
// SPECIFICATION — Proposed: src/control/proof/services/*.ts (control-layer, deny-by-default, audited)

export interface EvidenceLedgerService {
  submit(cmd: SubmitEvidenceCmd, ctx: ProofContext): Promise<EvidenceRecord>;      // validates schema+classification
  openCase(cmd: OpenProofCaseCmd, ctx: ProofContext): Promise<ProofCase>;
  chainHead(subject: string, ctx: ProofContext): Promise<string>;                  // current head hash
}

export interface AttestationService {
  attest(cmd: AttestCmd, ctx: ProofContext): Promise<Attestation>;                 // deny if signature invalid
  quorumState(proofCaseId: string, ctx: ProofContext): Promise<QuorumState>;       // pure recompute
}

export interface VerificationService {
  verify(proofCaseId: string, ctx: ProofContext): Promise<Verdict>;                // orchestrates the PURE verifier
  verifyBundleOffline(bundle: ProofBundle): Verdict;                               // pure, no ctx, no I/O
}

export interface ReviewService {
  assignReviewer(cmd: AssignReviewerCmd, ctx: ProofContext): Promise<void>;        // SoD-checked
  submitReview(cmd: SubmitReviewCmd, ctx: ProofContext): Promise<ReviewRecord>;    // rationale mandatory
}

export interface RatificationGateway {
  propose(proofCaseId: string, ctx: ProofContext): Promise<{ evolutionUnitId: string }>; // Evolution-only
}

export interface ProofExportService {
  export(proofCaseId: string, ctx: ProofContext): Promise<ProofBundle>;
}
```

`ProofContext` carries the authenticated principal, tenant, trust level, and correlation id — supplied by the
Control Plane; the pure core (`verifyBundleOffline`) deliberately takes **no** context, because offline
verification must not depend on any runtime identity or ambient state.

### 5.4 Service-level guarantees

- **Idempotency.** `submit`, `attest`, and `verify` are idempotent on a client-supplied nonce; replays return
  the original event (no duplicate chain entries).
- **Optimistic concurrency.** ProofCase writes carry the expected `version`; a stale version fails closed
  (no lost-update).
- **Determinism boundary.** All non-determinism (id generation, time) is injected at L3 and captured **into**
  events; L2 verification reads only what is in the (already-recorded) events, so re-verification is exact.
- **Authorization.** Every service method resolves a `proof:*` policy and calls the Control Plane; no method has
  an implicit allow path (INV-CORE-11, deny-by-default).

---

## 6. Runtime Architecture

### 6.1 Runtime module topology (proposed `src/control/proof/*`)

The fabric is constructed **additively** as control-layer modules. Numbering `PM0..PM14`; dependency order is
acyclic; nothing outside `src/control/proof/*` is modified except a single additive re-export line in
`src/control/index.ts`.

| # | Module (proposed path) | Layer | Responsibility |
|:-:|------------------------|:-----:|----------------|
| PM0 | `proof/types.ts` | L2/L1 | All domain + event + policy types (this Part §4.3). |
| PM1 | `proof/digest.ts` | L2 | `canonicalize` + `sha256` re-export wrappers (from `federation/assertions.ts`); evidence digesting. |
| PM2 | `proof/evidence-chain.ts` | L2 | Pure evidence-chain builder + verifier (`prevHash` continuity). |
| PM3 | `proof/quorum-evaluator.ts` | L2 | Pure M-of-N quorum evaluation against a signature policy. |
| PM4 | `proof/verifier.ts` | L2 | The **pure** Verification core + `verifyBundleOffline`; verifier-binding dispatch. |
| PM5 | `proof/proof-registry.ts` | L1 | Registry of `ProofType`/schema/policy/verifier records (`proof:*`), via Metadata port. |
| PM6 | `proof/evidence-ledger.ts` | L1/L3 | Append-only Evidence Ledger over the substrate; emits evidence events. |
| PM7 | `proof/attestation-store.ts` | L1/L3 | Attestation persistence; signature verification via `assertions.ts`. |
| PM8 | `proof/signature-framework.ts` | L2/L3 | Detached Ed25519 sign/verify wrappers; key-**reference** resolution (S3). |
| PM9 | `proof/proof-case.ts` | L3 | ProofCase projection (event fold) + lifecycle transitions. |
| PM10 | `proof/review-workflow.ts` | L3 | Independent-review SoD engine. |
| PM11 | `proof/ratification-gateway.ts` | L3 | Evolution-Unit proposal (sole commit path; AD-0019). |
| PM12 | `proof/proof-audit.ts` | L3 | Thin binding to `AUDIT-UNIV-001` (`domain:"proof"`); emits `PROOF_*` events. |
| PM13 | `proof/federation-proof-guard.ts` | L3 | Export/import + local re-verification under PI-5 trust. |
| PM14 | `proof/index.ts` + `bootstrap.ts` | L3 | `createProofFabric(substrate, control, fabrics, options)`; barrel export. |

### 6.2 Assembly & dependency inversion

```ts
// SPECIFICATION — Proposed: src/control/proof/bootstrap.ts
export function createProofFabric(
  substrate: Substrate,                 // PI-2/3 registry, metadata, configuration ports
  control: ControlPlane,                // PI-4 deny-by-default authorization + audit sink
  fabrics: {
    evolution: EvolutionFabric;         // PI-6 — sole durable-commit path (AD-0019)
    federation?: FederationFabric;      // PI-5 — Ed25519 assertions, trust, audit (optional at boot)
    audit: UniversalAuditLog;           // AUDIT-UNIV-001 — hash-chained ledger sink
  },
  options?: ProofFabricOptions,         // additive; defaults fail-closed (no export, deny-by-default)
): ProofFabric;
```

- **Boot with an empty registry produces no proofs** (fail-closed; INV-CORE-14): the fabric is inert until
  `proof:type:*` records exist.
- **All cryptography is injected** from the federation module; the fabric contains **no** crypto implementation.
- **The only commit seam** is `fabrics.evolution`; there is no other write path to platform state.
- **The audit sink is mandatory**; a fabric constructed without an `AuditSink` fails closed (cannot record ⇒
  cannot proceed; S6).

### 6.3 Runtime data flow (event-sourced)

At runtime the fabric holds **no authoritative mutable state**. For any `proofCaseId`:

```
project(proofCaseId) = fold(
   filter(evidenceLedger.events(), e => e.proofCaseId === proofCaseId),
   applyEvent, EMPTY_CASE)
```

Reads are projections; writes are appends. This gives:
- **Recoverability** — the entire fabric state rebuilds by replaying the ledger.
- **Tamper-evidence** — the ledger and evidence chain are hash-chained; any alteration breaks `verify`.
- **Time-travel/audit** — any historical proof state is the fold up to a given sequence number.

The projection is optionally **snapshotted** (a pure `fold` checkpoint keyed by ledger head-hash) for
performance; snapshots are a cache, never a source of truth, and are discarded if the head-hash mismatches.

### 6.4 Concurrency, ordering, and failure

- **Ordering.** Per-subject evidence chains impose a total order over that subject's evidence; cross-subject
  ordering is only the ledger append order (sufficient, since verdicts are per-case).
- **Concurrency.** Appends to a subject chain are serialized on the chain head (compare-and-append on
  `prevHash`); a losing writer retries against the new head. ProofCase transitions use optimistic `version`.
- **Failure semantics (fail-closed).** Unresolved verifier ⇒ `INDETERMINATE` (never `VALID`). Missing/invalid
  signature ⇒ attestation denied. Quorum shortfall ⇒ case stays `OPEN`/`REJECTED`, never `ATTESTED`. Audit-sink
  failure ⇒ operation aborts (no unaudited state change). Federation partition ⇒ foreign proofs unavailable, not
  assumed valid.
- **Recovery.** Because state is a fold over an append-only, hash-verified ledger, crash recovery is a replay;
  there is no partial-write corruption surface (no in-place mutation exists).

### 6.5 Runtime integration with reused primitives

| Concern | Runtime binding | Guarantee |
|---------|-----------------|-----------|
| Authenticity | `signature-framework.ts` → `federation/assertions.ts` (Ed25519) | No custom crypto; detached sigs over digests. |
| Tamper-evidence | `proof-audit.ts` → `UniversalAuditLog` (`domain:"proof"`) | One integrity view; offline `verify`/`reconcile`. |
| Durable consequence | `ratification-gateway.ts` → Evolution Fabric | Sole commit path; nothing else mutates platform state. |
| Authorization | every L3 method → Control Plane PEP | Deny-by-default; S1; no implicit allow. |
| Persistence | ledger/registry/attestation ports → PI-2/3 | Registry/Metadata/Configuration-first; in-memory ref adapters + durable seams. |
| Federation | `federation-proof-guard.ts` → PI-5 trust/audit | Advisory/deny-only/clamped/namespace-isolated/fail-closed; local re-verify. |

### 6.6 Runtime performance envelope (design targets)

Consistent with the recorded PI-4 §11B single-process figures and the pure-core design, the runtime targets
(to be measured at construction, not asserted here): evidence append O(1) amortized against the chain head;
signature verify bounded by Ed25519 (reused, well-characterized); quorum evaluation O(N) in the attester set;
verdict computation O(E) in evidence considered; offline bundle verification linear in bundle size with **zero**
external dependencies. No target is a pass criterion in this design; operational figures are produced under the
construction phase's test suite (Part 4 §20).

### 6.7 Runtime boundaries (what never happens at runtime)

- The fabric **never** writes to another fabric's keyspace or state (Evolution-only consequence).
- The fabric **never** holds private key material (references only; S3).
- The fabric **never** returns `VALID` in the presence of any unresolved input (fail-closed).
- The fabric **never** trusts a foreign proof without local re-verification.
- The fabric **never** mutates or deletes a ledger/chain entry (append-only; retention acts on recallability
  only, never the chain).

---

*(END PART 1 OF 4 — Runtime Architecture. Sections 7–12 [Data Model · Registry Architecture · Event Model ·
Storage Schema · API Specification · Signature Framework] follow in Part 2. This part introduces no code, no
lock release, and no invariant enrollment; INV-1..13 and the Article IX generation lock are unchanged.)*
