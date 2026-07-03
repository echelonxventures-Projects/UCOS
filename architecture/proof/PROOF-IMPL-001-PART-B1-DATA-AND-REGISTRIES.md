# PROOF-IMPL-001 · Part B1 — Data Model & Registry Architecture (B01-B1)

**Program:** IMPLEMENTATION PACKAGE B01 — Independent Proof Fabric · **Part B1** (Sections 7–8)
**Parent artifact:** `PROOF-IMPL-001` (`architecture/proof/PROOF-IMPL-001-INDEPENDENT-PROOF-FABRIC-IMPLEMENTATION-PACKAGE.md`, Part 1 §§1–6 — **not modified**)
**Artifact ID:** `PROOF-IMPL-001-B1`
**Artifact family:** `PROOF-*`
**Location:** `architecture/proof/`
**Scope of this document:** §7 Data Model · §8 Registry Architecture — **and nothing else**
**Mode:** DESIGN / SPECIFICATION ONLY — no source code committed, no lock release, no ratified-artifact mutation, no invariant enrollment
**Status:** CREATED — DESIGN — READY FOR AUTHORIZATION REVIEW
**Reuses:** PI-5 Federation cryptography (`control/federation/assertions.ts` — Ed25519, `canonicalize`, `sha256`; no custom crypto) · `AUDIT-UNIV-001` (Universal Audit/Provenance primitive) · PI-6 Evolution commit discipline (AD-0019) · PI-4 Control Plane (deny-by-default) · PI-2/3 Substrate (Registry / Metadata / Configuration ports)
**Governance:** Subordinate to AUTH-008 (Security Canon; S1/S3/S4/S6 non-waivable), AUTH-009 (Authority hierarchy), AUTH-012 (Decision Log; AD-0014 Ω∞ deferral), Constitution Article IX (generation lock — **ACTIVE**), `UCOS-ASR-NFR-001` (INV-1..13, unchanged), `INV-CORE-001`
**Date:** 2026-07-02

> **Governing disclaimer.** This is a governed **design/specification** document that continues
> `PROOF-IMPL-001` for a **not-yet-authorized** fabric. It writes no source code, releases no lock, enrolls no
> invariant (no INV-14..20), mutates no frozen construct, and confers no authority. All TypeScript, SQL, and
> schema fragments herein are **design specification**, not committed source. Construction of
> `src/control/proof/*` requires a **separate scoped Article IX release** (a prospective `AD-00xx`) sequenced
> after the P0 governance restoration. Until then the Proof Fabric remains conceptual/design and
> `UCOS-CONSTRUCTION-BLOCKED` stands. INV-1..13 and the Article IX generation lock are unchanged.

> **Continuity note.** This is **Part B1** and contains exactly two sections: **§7 Data Model** and **§8
> Registry Architecture**. Sections 1–6 live in Part 1 and are **not** reproduced here. Sections 9–12 (Event
> Model · Storage Schema · API Specification · Signature Framework) are **deliberately not present** in this
> document and are deferred to subsequent Part-B installments. This document **stops after §8.**

---

## 7. Data Model

Part 1 §4 introduced the *domain* model (aggregates, lifecycle, domain rules). This section specifies the
**data** model: the concrete, canonically-serializable record shapes, their identifiers, their digest
derivations, their relationships and cardinalities, and their at-rest vs. derived status. Everything here obeys
six standing constraints from the parent package: **registry-driven**, **no hard coding**, **event-sourced**,
**immutable audit**, **cryptographically verifiable**, and **deny-by-default**. The data model contains **no
proof semantics of its own** — every type field that could encode a policy, threshold, schema, verifier, role,
or retention decision is a **reference into the registry** (§8), never a literal.

### 7.1 Modeling principles (data-layer)

| # | Principle | Consequence in the data model |
|:-:|-----------|-------------------------------|
| DM-1 | **Events are the only durable data.** | Every persisted row is either an **append-only event** or a **derived projection/snapshot** (a cache). No entity is stored as an in-place-mutable record of truth. |
| DM-2 | **Everything canonical is digestible.** | Any structure that is signed, chained, or verified has a defined `canonicalize()` → `sha256()` digest derivation, specified field-by-field so an independent party reproduces it byte-for-byte. |
| DM-3 | **References, not embeddings, for governed values.** | Schemas, policies, verifiers, roles, retention, and keys appear only as `proof:*` **refs** (§8) or key **refs** (S3). No key material, no inline policy literals. |
| DM-4 | **Identifiers are opaque and stable.** | Identity fields are opaque, monotonically assignable strings (ULID-like), never semantically overloaded and never reused (INV-CORE-03). |
| DM-5 | **Provenance travels with data.** | Every externally-sourced record carries a `Provenance` envelope (`FED-PROV-001`); local origin is explicit, foreign origin is namespaced and re-verified. |
| DM-6 | **Classification is monotonic.** | Every evidence/attestation/verdict record carries a data `classification`; derivations never lower classification below the type's `classificationFloor` (S4). |
| DM-7 | **Time is data, not ambient.** | All timestamps are **recorded into events** at L3; the pure core (§ verifier) reads recorded time only, never a live clock — preserving deterministic re-verification. |

### 7.2 Data entity catalogue

The data model comprises three tiers, distinguished by durability semantics:

| Tier | Members | Durability | Mutability |
|------|---------|------------|------------|
| **T-A · Event records** (source of truth) | `ProofEvent` (all `*_*` families) | Append-only, hash-chained | Immutable |
| **T-B · Reference/registry records** | `ProofType`, `EvidenceSchema`, `SignaturePolicy`, `VerifierBinding`, `ReviewPolicy`, `RetentionClass` | Versioned, additive | Immutable-per-version (new version = new record) |
| **T-C · Derived projections** (cache) | `ProofCaseProjection`, `EvidenceChainProjection`, `QuorumProjection`, `ProofBundle` | Rebuildable from T-A | Disposable; never authoritative |

> The **event record** shape (`ProofEvent`) and its families (`PROOF_*`, `EVIDENCE_*`, `ATTESTATION_*`,
> `SIGNATURE_*`, `REVIEW_*`, `VERIFICATION_*`) are named here for relational completeness but are **fully
> specified in §9 (Event Model)**, which is out of scope for this Part B1 document. This section models only the
> **payload data structures** those events carry.

### 7.3 Identifier model

All identifiers are opaque strings; none encodes routing, authority, or policy. The canonical set:

| Identifier | Owner record | Derivation | Notes |
|------------|--------------|-----------|-------|
| `proofCaseId` | ProofCase | fabric-assigned ULID-like | Stable for the life of the case; never reused. |
| `evidenceId` | EvidenceRecord | fabric-assigned ULID-like | Write-once; correction = new id + `SUPERSEDED` linkage. |
| `attestationId` | Attestation | fabric-assigned ULID-like | One per signed attestation. |
| `reviewId` | ReviewRecord | fabric-assigned ULID-like | One per independent-review adjudication. |
| `evidenceDigest` | EvidenceRecord | `sha256(canonicalize(payloadDescriptor))` | **Content-addressed**; identical evidence ⇒ identical digest. |
| `entryHash` | EvidenceChainEntry | `sha256(canonicalize({subject,seq,evidenceDigest,prevHash}))` | Chain commitment; head = latest `entryHash`. |
| `resultHash` | Verdict | `sha256(canonicalize({proofRef,evidenceDigests,verifierId,verifierVersion,verdict,policyRef}))` | Binds a verdict to exact inputs (Part 1 §3.5). |
| `<record>Ref` | registry records | `proof:<kind>:<id>@<version>` | Version-pinned reference (see §8.4). |

**Determinism guard.** Content-addressed identifiers (`evidenceDigest`, `entryHash`, `resultHash`) are
**reproducible** by any party with the same bytes; fabric-assigned identifiers (`proofCaseId`, etc.) are
**recorded into events** so replay reproduces them exactly. No identifier is derived from a live clock, RNG read
at verify time, or ambient state.

### 7.4 Canonical serialization & digest derivation

Every digestible structure has a **field-ordered canonical form**. Canonicalization reuses the federation
primitive (`canonicalize` from `assertions.ts`); the fabric adds **no** alternate serializer.

```
canonicalize(x): deterministic, key-sorted, whitespace-free JSON with
                 - object keys sorted lexicographically (UTF-8 code point)
                 - no insignificant whitespace
                 - numbers in canonical form (no leading zeros, no trailing decimals)
                 - explicit null; absent optional fields OMITTED (not null)
digest(x)      = sha256(utf8Bytes(canonicalize(x)))
```

**Digest input specifications** (the exact object passed to `canonicalize` before hashing — this is what an
independent verifier must reproduce):

| Digest | Canonical input object |
|--------|------------------------|
| `evidenceDigest` | `{ subject, proofTypeId, mode, uriDescriptor?, schemaRef, classification, payloadDescriptor }` |
| `entryHash` | `{ subject, seq, evidenceDigest, prevHash }` |
| attestation `signedDigest` | `{ proofCaseId, target, signaturePolicyRef, attesterRole }` (the attester signs this, not raw payload — DR-2) |
| `resultHash` | `{ proofRef, evidenceDigests[] (sorted), verifierId, verifierVersion, verdict, policyRef }` |
| bundle `bundleDigest` | `{ proofCaseId, chainSegment[], attestations[], verdict, verifierRef }` |

`GENESIS_HASH` (for `seq = 0` chain entries) is the fixed constant defined by the reused `AUDIT-UNIV-001` chain
convention; the fabric does not define its own genesis constant.

### 7.5 Core data structures (design specification)

These refine Part 1 §4.3 into the **at-rest / on-the-wire** shapes, with digest fields and reference fields made
explicit. They are specification, not committed code.

```ts
// SPECIFICATION — not committed code. Proposed: src/control/proof/types.ts (data-layer view)
// Reuses federation primitives: canonicalize, sha256, Ed25519 verify (assertions.ts). No custom crypto.

/** Provenance envelope (FED-PROV-001). Local origin is explicit; foreign origin is namespaced + re-verified. */
export interface Provenance {
  origin: "local" | "federated";
  nodeId?: string;                    // present iff origin === "federated"
  importedAt?: number;                // logical time recorded at import
  reVerifiedLocally: boolean;         // MUST be true before any local effect (deny-by-default)
}

/** T-A payload — evidence (value bytes are NEVER stored; only a descriptor + digest). */
export interface EvidenceRecord {
  evidenceId: string;
  subject: string;                    // artifactId | capabilityId | unitHash | ...
  proofTypeId: string;                // ref → proof:type:<id> (resolves schema + policies)
  mode: "by-reference" | "by-value-digest";
  uri?: string;                       // by-reference: content-addressed where possible
  payloadDescriptor: unknown;         // schema-validated metadata about the evidence (NOT the raw payload)
  digest: string;                     // evidenceDigest (§7.4)
  schemaRef: string;                  // ref → proof:schema:<id>@<version>
  classification: string;             // ref → data classification (S4); ≥ type.classificationFloor
  submittedBy: string;                // principal id
  at: number;                         // recorded logical time
  provenance: Provenance;
  attributes?: Record<string, unknown>;
}

/** T-A payload — a single hash-chained commitment binding evidence into a subject's chain. */
export interface EvidenceChainEntry {
  subject: string;
  seq: number;                        // 0-based, per-subject monotonic
  evidenceId: string;
  evidenceDigest: string;
  prevHash: string;                   // GENESIS_HASH at seq 0
  entryHash: string;                  // §7.4
}

/** Value object — a detached Ed25519 signature over a canonical digest. Keys by REFERENCE only (S3). */
export interface SignatureBlock {
  keyRef: string;                     // reference into secrets/identity substrate; NOT key material
  alg: "ed25519";                     // fixed by ADR-006 reuse
  signedDigest: string;               // the sha256 digest that was signed
  sig: string;                        // base64 detached signature (verified via assertions.ts)
  signedAt: number;
}

/** T-A payload — an attestation (signed statement by an enumerated attester). */
export interface Attestation {
  attestationId: string;
  proofCaseId: string;
  attester: string;
  role: string;                       // ref → policy-defined attester role
  signaturePolicyRef: string;         // ref → proof:signature-policy:<id>@<version>
  target: string;                     // evidenceDigest | chain headHash the attester signs
  signature: SignatureBlock;
  independenceTag?: string;           // affiliation used to enforce independence constraints
  at: number;
  provenance: Provenance;
}

/** Value object — verdict (produced by the PURE verifier; bound to exact inputs via resultHash). */
export interface Verdict {
  status: "VALID" | "INVALID" | "INCOMPLETE" | "INDETERMINATE";
  resultHash: string;                 // §7.4
  verifierId: string;                 // ref → proof:verifier:<id>
  verifierVersion: string;            // semver of the pinned verifier binding
  reasons: string[];                  // deterministic, ordered explanation
  evaluatedDigests: string[];         // exactly which evidence digests were considered (sorted)
  at: number;
}

/** T-A payload — an independent reviewer's adjudication (SoD-guarded). */
export interface ReviewRecord {
  reviewId: string;
  proofCaseId: string;
  reviewer: string;                   // independent of submitter/attesters/verifier operator
  reviewPolicyRef: string;            // ref → proof:review-policy:<id>@<version>
  decision: "AFFIRM" | "DISPUTE" | "ABSTAIN";
  rationale: string;                  // mandatory, non-empty
  independenceProof: string[];        // SoD facts the guard verified
  at: number;
}

/** T-C derived projection — the folded ProofCase (a CACHE, never authoritative). */
export interface ProofCaseProjection {
  proofCaseId: string;
  claim: {
    subject: string; predicate: string; statementDigest: string;
    claimant: string; proofTypeId: string;
  };
  status: "OPEN" | "ATTESTED" | "VERIFIED" | "CONTESTED"
        | "UNDER_REVIEW" | "RATIFIED" | "REJECTED" | "WITHDRAWN" | "SUPERSEDED";
  evidenceIds: string[];
  chainHead: string;
  attestationIds: string[];
  quorum: { policyRef: string; m: number; n: number; satisfiedBy: string[] };
  verdict?: Verdict;
  reviewIds: string[];
  ratification?: { evolutionUnitId: string; authority: string; at: number };
  supersededBy?: string;
  createdAt: number;
  version: number;                    // monotonic event count (optimistic concurrency)
  projectedFromHead: string;          // ledger head-hash this projection was folded from (cache-validity key)
}

/** T-C derived — exportable, offline-verifiable bundle. */
export interface ProofBundle {
  proofCaseId: string;
  claim: ProofCaseProjection["claim"];
  chainSegment: EvidenceChainEntry[]; // contiguous, prevHash-continuous
  evidenceDescriptors: Array<Pick<EvidenceRecord,
    "evidenceId" | "subject" | "digest" | "schemaRef" | "classification" | "mode" | "uri">>;
  attestations: Attestation[];
  verdict: Verdict;
  verifierRef: string;                // proof:verifier:<id>@<version> — pins the exact verifier
  bundleDigest: string;               // §7.4
  producedAt: number;
  provenance: Provenance;
}
```

### 7.6 Relationships & cardinality

```
ProofType (1) ──governs──▶ (0..*) ProofCase
ProofCase (1) ──has──▶ (1..*) EvidenceRecord            [OPEN requires ≥1 to progress]
Subject   (1) ──orders──▶ (0..*) EvidenceChainEntry     [per-subject total order, seq 0..n]
EvidenceRecord (1) ──bound-by──▶ (1) EvidenceChainEntry [1:1 within its subject chain]
ProofCase (1) ──accrues──▶ (0..*) Attestation           [quorum = M-of-N over these]
ProofCase (1) ──yields──▶ (0..1) Verdict                [latest verdict; superseded by re-verify]
ProofCase (1) ──adjudicated-by──▶ (0..*) ReviewRecord   [≥1 AFFIRM required for RATIFIED]
ProofCase (1) ──exports-as──▶ (0..*) ProofBundle        [derived, stateless snapshot]
ProofCase (0..1) ──supersededBy──▶ (0..1) ProofCase     [migration-only, INV-CORE-03]
```

**Referential rules.**
- **RR-1.** A `ProofCase` cannot exist without a resolvable `proofTypeId` (deny-by-default; empty registry ⇒ no
  cases — INV-CORE-14).
- **RR-2.** An `EvidenceRecord` cannot append unless its `schemaRef` resolves and validates its
  `payloadDescriptor`, and its `classification ≥ proofType.classificationFloor`.
- **RR-3.** An `Attestation` is rejected unless (a) its `signature` verifies via `assertions.ts` over
  `signedDigest`, and (b) its `role`/`independenceTag` are admissible under the resolved `signaturePolicyRef`.
- **RR-4.** A `Verdict` is invalidated (forcing re-verification) whenever the case's `evaluatedDigests` set
  changes — adding evidence after a verdict voids the verdict (DR-5).
- **RR-5.** `RATIFIED` is unreachable without: `status == VERIFIED` (VALID verdict) **and** ≥1 independent
  `AFFIRM` review satisfying SoD **and** an Evolution-committed ratification (AD-0019).

### 7.7 Integrity, immutability & retention at the data layer

- **Append-only.** T-A event records and T-B version records are never updated in place or deleted. A
  "change" is a new event/version; the prior remains (INV-CORE-02/03; S6).
- **Chain continuity.** Every `EvidenceChainEntry.entryHash` binds `prevHash`; a break anywhere fails
  verification for every dependent verdict (fail-closed, PROOF-INV-1).
- **Projection disposability.** T-C projections carry `projectedFromHead`; if the current ledger head-hash
  differs, the projection is discarded and refolded. A projection is **never** a source of truth.
- **Retention ≠ deletion (DR-6).** A `RetentionClass` governs **recallability** of by-reference payload bytes
  held outside the fabric; it **never** removes ledger entries, chain hashes, digests, signatures, or verdicts.
  The proof of what existed is permanent even when the referenced bytes are lawfully purged.
- **Classification monotonicity.** Derived records (verdict, bundle) inherit the **maximum** classification of
  their inputs; export of a bundle is denied if any element exceeds the export policy of its `ProofType`
  (`federationExportable == false` ⇒ deny).

### 7.8 Provider-agnostic representation

The data model is defined **independently of any datastore, encoding, or vendor.** All shapes are expressed as
canonical JSON structures with `sha256` digests; a durable adapter (relational, document, ledger-DB, object
store) MUST preserve (a) append-only semantics, (b) the exact `canonicalize()` byte form used for digests, and
(c) content-addressability of `evidenceDigest`/`entryHash`/`resultHash`. No field type, index, or constraint in
this section presumes a specific engine — the concrete storage mapping is Section 10 (Storage Schema), **out of
scope here.** Selection of any engine remains bound to the ratified platform ADRs and is explicitly **not** made
in this document.

---

## 8. Registry Architecture

The Proof Fabric is **fully registry-driven**: it ships with **zero built-in proof types, schemas, policies,
verifiers, roles, or retention rules.** Every semantic decision the fabric can make is expressed as a **metadata
record in the `proof:*` keyspace**, resolved at runtime through the PI-2/3 Metadata/Registry ports. An empty
registry is a **valid, inert** fabric: it can open no cases, accept no evidence, verify nothing (fail-closed —
INV-CORE-14, PROOF-INV-6). This section specifies the keyspace, record kinds, resolution semantics, versioning,
and governance of registry records. It defines storage-independent **records and resolution rules only**; the
physical persistence of these records is Section 10 and is **not** covered here.

### 8.1 Registry design goals

| # | Goal | How it is met |
|:-:|------|---------------|
| RG-1 | **No hard coding.** | Every proof type, schema, policy, verifier binding, role, quorum threshold, and retention class is a resolvable record; the code contains **no** literal proof semantics (IP-04; INV-CORE-14). |
| RG-2 | **Deny-by-default resolution.** | An unresolved, ambiguous, or unauthorized reference resolves to **deny** — never to a default-allow or an implicit built-in. |
| RG-3 | **Deterministic resolution.** | Resolution is a pure function of `(ref, registry-snapshot)`; version-pinned refs make it reproducible offline. |
| RG-4 | **Immutable, versioned records.** | Records are never edited in place; a change publishes a **new version**; old versions remain resolvable (evolution-only; INV-CORE-03). |
| RG-5 | **Provider-agnostic.** | The registry is defined over the Metadata port; no engine, cache, or vendor is assumed. |
| RG-6 | **Evolution-only mutation.** | Publishing/retiring a registry record is a **consequence** committed exclusively through the Evolution Fabric (AD-0019); the Proof Fabric never self-mutates governed records. |
| RG-7 | **Provable governance.** | Every registry publish/retire/resolve-deny emits an immutable `PROOF_*` audit event (§9, out of scope here) with provenance. |

### 8.2 The `proof:*` keyspace

All fabric configuration lives under a single reserved namespace, resolved through the Metadata port. Keys are
lowercase, colon-delimited, and **version-pinned** on reference (§8.4).

| Key pattern | Record kind | Purpose |
|-------------|-------------|---------|
| `proof:type:<id>` | **ProofType** | The root contract for a class of claim: binds schema(s), signature policy, verifier, review policy, retention, export posture. |
| `proof:schema:<id>` | **EvidenceSchema** | Validation schema for an evidence `payloadDescriptor`. |
| `proof:signature-policy:<id>` | **SignaturePolicy** | M-of-N quorum, admissible attester roles, independence constraints, admissible key classes. |
| `proof:verifier:<id>` | **VerifierBinding** | Reference + pinned version of a deterministic verifier for a proof type. |
| `proof:review-policy:<id>` | **ReviewPolicy** | Separation-of-duties roles, review quorum, governance tier for ratification. |
| `proof:retention:<id>` | **RetentionClass** | Recallability rules for by-reference payloads (never deletes chain). |
| `proof:role:<id>` | **RoleDefinition** | Named attester/reviewer roles and their independence groupings. |
| `proof:federation-policy:<id>` | **FederationPolicy** | Export/import admissibility and trust clamping for proofs of a type. |

> No other namespace is writable by the fabric. The fabric **reads** identity/key references (S3) and data
> classifications (S4) from their owning substrates but **defines** none of them.

### 8.3 Registry record kinds (design specification)

```ts
// SPECIFICATION — not committed code. Proposed registry record shapes (stored as metadata).
// Every record is immutable-per-version; a change is a NEW version (§8.4). No literals leak into code.

/** Common envelope carried by every proof:* record. */
export interface ProofRegistryRecord {
  ref: string;                        // proof:<kind>:<id>
  version: string;                    // semver; pinned on reference
  status: "DRAFT" | "ACTIVE" | "DEPRECATED" | "RETIRED";
  owner: string;                      // single accountable authority
  publishedBy: string;                // Evolution-committed publisher (AD-0019)
  publishedAt: number;
  supersedes?: string;                // prior ref@version (evolution-only chain)
  digest: string;                     // sha256(canonicalize(record-without-digest)) — tamper-evident
}

/** proof:type:<id> — the root, data-driven contract (mirrors Part 1 §4.4). */
export interface ProofType extends ProofRegistryRecord {
  title: string;
  evidenceSchemaRefs: string[];       // proof:schema:*@version — required/allowed evidence schemas
  signaturePolicyRef: string;         // proof:signature-policy:*@version
  verifierRef: string;                // proof:verifier:*@version (deterministic verifier + version)
  reviewPolicyRef: string;            // proof:review-policy:*@version
  retentionClassRef: string;          // proof:retention:*@version (mandatory)
  federationPolicyRef?: string;       // proof:federation-policy:*@version (absent ⇒ non-exportable)
  classificationFloor: string;        // minimum data classification (S4 monotonicity)
}

/** proof:schema:<id> — evidence payloadDescriptor validation. Engine-neutral schema descriptor. */
export interface EvidenceSchema extends ProofRegistryRecord {
  descriptorSchema: unknown;          // declarative schema (JSON-Schema-shaped); validated at append
  requiredFields: string[];
  classificationFloor: string;
}

/** proof:signature-policy:<id> — multi-signature / quorum + independence. */
export interface SignaturePolicy extends ProofRegistryRecord {
  quorum: { m: number; n: number };   // M-of-N; m ≤ n; both > 0 (deny if unset)
  admissibleRoles: string[];          // proof:role:* refs allowed to attest
  independence: {
    requireDistinctPrincipals: boolean;
    requireDistinctTags: boolean;     // enforce distinct independenceTag across the quorum
    minDistinctTags?: number;
  };
  admissibleKeyClasses: string[];     // classes of key (by reference; S3) accepted for this policy
  alg: "ed25519";                     // fixed by ADR-006 reuse; no algorithm agility
}

/** proof:verifier:<id> — deterministic verifier binding (the verifier itself is pure code, versioned). */
export interface VerifierBinding extends ProofRegistryRecord {
  verifierId: string;
  verifierVersion: string;            // pinned semver; part of resultHash (Part 1 §3.5)
  inputContract: string[];            // named inputs the pure verifier consumes (evidence/attestation/policy)
  deterministic: true;                // asserted + enforced (no I/O, no clock, no ambient reads)
}

/** proof:review-policy:<id> — independent-review separation-of-duties. */
export interface ReviewPolicy extends ProofRegistryRecord {
  sodRoles: string[];                 // proof:role:* required to be mutually distinct
  reviewQuorum: { m: number; n: number };
  governanceTier: string;             // ratification authority tier (consumed by RatificationGateway)
  requireRationale: true;             // no unexplained review
}

/** proof:retention:<id> — recallability only; NEVER deletes ledger/chain (DR-6). */
export interface RetentionClass extends ProofRegistryRecord {
  payloadRecallability: "permanent" | "time-boxed" | "on-request-purge";
  purgeAfter?: number;                // applies to by-reference payload bytes only
  preservesChain: true;              // invariant: chain/digests/signatures/verdicts are never removed
}

/** proof:role:<id> — named roles + independence grouping. */
export interface RoleDefinition extends ProofRegistryRecord {
  roleId: string;
  kind: "attester" | "reviewer" | "ratifier" | "submitter";
  independenceGroup?: string;         // used by SoD + quorum-independence checks
}

/** proof:federation-policy:<id> — export/import admissibility + trust clamp (PI-5). */
export interface FederationPolicy extends ProofRegistryRecord {
  exportable: boolean;                // default false (deny-by-default)
  importAdmissible: boolean;          // default false
  trustClamp: "advisory" | "deny-only";  // foreign proofs never bind local state
  requireLocalReVerify: true;         // foreign proofs re-verified locally before any effect
}
```

### 8.4 Reference & resolution semantics

**Reference form.** A governed reference is `proof:<kind>:<id>@<version>`. Bare refs (`proof:<kind>:<id>`,
unpinned) resolve to the current `ACTIVE` version **only for authoring/query**; **all verification-relevant
resolution is version-pinned** so that a verdict's `resultHash` is stable and offline-reproducible.

**Resolution algorithm (pure over a registry snapshot):**

```
resolve(ref, snapshot):
  1. parse ref → (kind, id, version?)
  2. if kind not in KNOWN_KINDS            → DENY  (unknown namespace)
  3. record = snapshot.lookup(kind, id, version)
  4. if record absent                      → DENY  (unresolved; fail-closed)
  5. if record.status in {RETIRED, DRAFT}  → DENY  (not resolvable for runtime use)
  6. if version omitted:
        if not authoring/query context     → DENY  (verification requires a pin)
        else record = latest ACTIVE
  7. verify record.digest == sha256(canonicalize(record\digest)) else DENY (tamper)
  8. return record
```

**Deny-by-default is total (RG-2):** steps 2, 4, 5, 6, and 7 each terminate in `DENY`. There is **no default
record, no built-in fallback, and no implicit allow.** A resolution `DENY` propagates as: evidence append
rejected, attestation rejected, verdict `INDETERMINATE`, or case-transition denied — never a silent pass
(PROOF-INV-7).

**Determinism (RG-3):** because `resolve` is pure over an immutable, version-pinned snapshot, an independent
verifier holding the same pinned records reaches the same resolution — a precondition for offline verification.

### 8.5 Versioning & lifecycle (evolution-only)

Registry records follow an **additive, immutable-per-version** lifecycle. A record version is never edited;
transitions publish new state through the Evolution Fabric (AD-0019, RG-6):

```
        publish(new)                 activate                deprecate               retire
 ○───────────────────▶ DRAFT ──────────────────▶ ACTIVE ──────────────▶ DEPRECATED ──────────▶ RETIRED
                          │  (Evolution-committed at each edge; each edge emits an immutable PROOF_* audit event)
                          │
                          └── a change to an ACTIVE record = publish a NEW version that `supersedes` it;
                              the prior version remains resolvable for historical verdicts (INV-CORE-03).
```

- **Immutability.** `DRAFT`/`ACTIVE`/`DEPRECATED`/`RETIRED` are recorded as **events**; a record's content at a
  version never changes (tamper-evident via `digest`, §8.3).
- **Historical resolvability.** A verdict pinned to `proof:verifier:x@1.2.0` remains re-verifiable forever, even
  after `x@1.3.0` is `ACTIVE` and `x@1.2.0` is `DEPRECATED` — deprecation blocks **new** pins, never historical
  ones.
- **Retirement ≠ deletion.** A `RETIRED` record is non-resolvable for *new* use but its bytes and digest remain
  for audit (consistent with DR-6 and S6).
- **Evolution-only.** No publish/activate/deprecate/retire occurs except as an Evolution-committed consequence;
  the Proof Fabric proposes, the Evolution Fabric commits (AD-0019). The fabric has **no** self-write path to
  the `proof:*` keyspace.

### 8.6 Registry ports (provider-agnostic)

The fabric consumes the registry through narrow, read-oriented ports satisfied by the PI-2/3
Metadata/Registry/Configuration runtimes. Mutation is proposal-only (Evolution).

```ts
// SPECIFICATION — Proposed: src/control/proof/proof-registry.ts (L1 port over PI-2/3 Metadata)
export interface ProofRegistryPort {
  resolve<T extends ProofRegistryRecord>(ref: string, ctx: ProofContext): Promise<T>;   // deny-by-default
  resolvePinned<T extends ProofRegistryRecord>(ref: string, version: string): T;        // PURE (snapshot)
  list(kind: ProofRecordKind, ctx: ProofContext): Promise<string[]>;                     // authoring/query
  snapshotHead(): string;                                                                // registry snapshot hash
}

// Publishing is NOT on this port. It is proposed via the RatificationGateway → Evolution Fabric only.
```

- `resolvePinned` is **pure and synchronous** over a captured snapshot — it is the function the offline verifier
  uses; it performs no I/O.
- `snapshotHead()` returns a hash of the registry snapshot so a `ProofBundle`/verdict can pin *which* registry
  state it resolved against, making resolution reproducible across nodes and time.
- No engine, cache, or vendor is named; any adapter satisfying these ports is admissible, subject to the
  ratified platform ADRs (selection **not** made here).

### 8.7 Registry governance & provability

- **Single-owner accountability.** Every `proof:*` record has exactly one `owner` authority (RG record
  envelope); ownership changes are themselves Evolution-committed.
- **Provable configuration.** Every publish/activate/deprecate/retire and every resolution `DENY` emits an
  immutable `PROOF_*` audit event with provenance (RG-7) — so the fabric's *configuration history* is itself
  independently provable, closing the loop with the fabric's own guarantee. (The event shapes are specified in
  §9, **out of scope for this document**.)
- **No ambient authority.** A registry record confers no authority by existing; it is consumed under PI-4
  deny-by-default authorization at each use, and its governed publication is subordinate to AUTH-009 / AUTH-008.

---

*(END PART B1 — Data Model (§7) & Registry Architecture (§8). This document stops after §8 by mandate. Sections
9–12 [Event Model · Storage Schema · API Specification · Signature Framework] are intentionally not present here
and are deferred to subsequent Part-B installments. This document introduces no code, no lock release, and no
invariant enrollment; INV-1..13 and the Article IX generation lock are unchanged.)*
