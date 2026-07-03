# PROOF-IMPL-001 · Part B2 — Event Model & Storage Schema (B01-B2)

**Program:** IMPLEMENTATION PACKAGE B01 — Independent Proof Fabric · **Part B2** (Sections 9–10)
**Parent artifact:** `PROOF-IMPL-001` (Part 1 §§1–6 — **not modified**)
**Predecessor:** `PROOF-IMPL-001-B1` (Part B1 §§7–8 — **not modified**)
**Artifact ID:** `PROOF-IMPL-001-B2`
**Artifact family:** `PROOF-*`
**Location:** `architecture/proof/`
**Scope of this document:** §9 Event Model · §10 Storage Schema — **and nothing else**
**Mode:** DESIGN / SPECIFICATION ONLY — no source code committed, no lock release, no ratified-artifact mutation, no invariant enrollment
**Status:** CREATED — DESIGN — READY FOR AUTHORIZATION REVIEW
**Reuses:** PI-5 Federation cryptography (`control/federation/assertions.ts` — Ed25519, `canonicalize`, `sha256`; no custom crypto) · `AUDIT-UNIV-001` (Universal Audit/Provenance primitive; hash-chained ledger) · PI-6 Evolution commit discipline (AD-0019) · PI-4 Control Plane (deny-by-default) · PI-2/3 Substrate (Registry / Metadata / Configuration ports)
**Governance:** Subordinate to AUTH-008 (Security Canon; S1/S3/S4/S6 non-waivable), AUTH-009 (Authority hierarchy), AUTH-012 (Decision Log; AD-0014 Ω∞ deferral), Constitution Article IX (generation lock — **ACTIVE, UNCHANGED**), `UCOS-ASR-NFR-001` (INV-1..13, unchanged), `INV-CORE-001`
**Date:** 2026-07-02

> **Governing disclaimer.** This is a governed **design/specification** document continuing `PROOF-IMPL-001` for
> a **not-yet-authorized** fabric. It writes no source code, releases no lock, enrolls no invariant (no
> INV-14..20), mutates no frozen construct, and confers no authority. All TypeScript, SQL, and schema fragments
> herein are **design specification**, not committed source. Construction of `src/control/proof/*` requires a
> **separate scoped Article IX release** (a prospective `AD-00xx`) sequenced after the P0 governance
> restoration. **Article IX remains ACTIVE and unchanged; `UCOS-CONSTRUCTION-BLOCKED` remains active.** INV-1..13
> are unchanged.

> **Continuity note.** This is **Part B2** and contains exactly two sections: **§9 Event Model** and **§10
> Storage Schema**. Sections 1–6 live in Part 1; §§7–8 live in Part B1; they are **not** reproduced here.
> Sections 11–12 (API Specification · Signature Framework) are **deliberately not present** and are deferred to a
> subsequent Part-B installment. This document **stops after §10.**

---

## 9. Event Model

The Proof Fabric is **event-sourced**: the authoritative state of every `ProofCase` is a deterministic **fold**
over an append-only stream of events (Part 1 §3.1, §6.3). This section specifies that stream. It defines six
**independent event families**, the per-event contract (purpose, producer, consumer, payload, ordering, replay,
audit, failure semantics), and the five cross-cutting models that make replay deterministic: **lineage,
correlation, causation, idempotency, deterministic replay.**

Every event is **immutable**, **hash-chained** into the `AUDIT-UNIV-001` ledger (`domain:"proof"`), and carries a
**provenance envelope** (`FED-PROV-001`). No event carries a policy literal, threshold, schema, verifier, role,
or key — only **`proof:*` references** (Part B1 §8) and **key references** (S3). Deny-by-default is total: an
operation that cannot resolve its policy, verify its signature, or append its audit record produces **no state
event** (fail-closed).

### 9.1 Event envelope (common to all families)

Every proof event shares one immutable envelope; family-specific data lives in `payload`.

```ts
// SPECIFICATION — not committed code. Proposed: src/control/proof/types.ts (event view)
export type ProofEventFamily =
  | "PROOF" | "EVIDENCE" | "ATTESTATION" | "SIGNATURE" | "REVIEW" | "VERIFICATION";

export interface ProofEvent<P = unknown> {
  eventId: string;                    // fabric-assigned ULID-like; unique; recorded (never re-derived at replay)
  family: ProofEventFamily;           // one of the six independent families
  type: string;                       // e.g. "EVIDENCE_APPENDED" (family-qualified, §9.3–§9.8)
  proofCaseId?: string;               // present for case-scoped events (absent for pure-registry/global events)
  subject?: string;                   // evidence-chain subject where applicable
  seq: number;                        // per-stream monotonic sequence (see ordering, §9.9)
  streamId: string;                   // the ordering stream this event belongs to (§9.9)
  occurredAt: number;                 // RECORDED logical time (never read from a live clock at replay)
  actor: string;                      // authenticated principal (from PI-4 ProofContext)
  correlationId: string;              // ties all events of one logical operation (§9.11)
  causationId?: string;               // eventId of the direct cause (§9.12)
  payload: P;                         // family/type-specific (deny if it fails schema/policy resolution)
  provenance: Provenance;             // local | { federated, nodeId, reVerifiedLocally }
  policyRefs: string[];               // proof:*@version refs resolved for this event (pinned, reproducible)
  prevHash: string;                   // AUDIT-UNIV-001 chain continuity (GENESIS_HASH at stream genesis)
  eventHash: string;                  // sha256(canonicalize(event\eventHash)) — tamper-evident
}
```

**Envelope invariants.**
- **EV-1.** `eventHash` binds `prevHash`; a break anywhere fails verification for every dependent projection and
  verdict (PROOF-INV-1, S6).
- **EV-2.** `occurredAt`, `eventId`, and all non-determinism are **recorded into the event at L3**; the pure core
  reads only recorded values, so replay is exact (Part 1 §5.4 determinism boundary).
- **EV-3.** `policyRefs` are **version-pinned**; an event records exactly which registry state governed it, so
  its interpretation is reproducible offline and across nodes.
- **EV-4.** No envelope field may contain key material or an inline policy literal (S3; RG-1).

### 9.2 The six independent event families

Families are **independent**: each has its own producers, consumers, and rules, and no family's processing may
assume another family's event is present in the same tick. Cross-family relationships are expressed **only**
through `causationId`/`correlationId` (§9.11–§9.12) and the deterministic fold — never through hidden coupling.

| Family | Concern | Case-scoped? | Primary producer(s) |
|--------|---------|:------------:|---------------------|
| `PROOF_*` | ProofCase lifecycle & state transitions | yes | EvidenceLedgerService, RatificationGateway |
| `EVIDENCE_*` | Evidence capture & chaining | yes | EvidenceLedgerService |
| `ATTESTATION_*` | Attestation submission & quorum | yes | AttestationService |
| `SIGNATURE_*` | Signature verification & key-reference lifecycle | yes/global | SignatureFramework |
| `REVIEW_*` | Independent-review SoD workflow | yes | ReviewService |
| `VERIFICATION_*` | Deterministic verdict production | yes | VerificationService |

### 9.3 `PROOF_*` — ProofCase lifecycle family

**Purpose.** Record the opening, state transitions, ratification, supersession, and closure of a `ProofCase`.
This family is the backbone the projection folds into a `ProofCaseProjection` (Part B1 §7.5).

| Event type | Purpose |
|------------|---------|
| `PROOF_CASE_OPENED` | A case is opened against a resolved `proofTypeId`. |
| `PROOF_STATE_CHANGED` | A lifecycle transition (`OPEN→ATTESTED→VERIFIED→…`) is recorded. |
| `PROOF_CONTESTED` | The case entered `CONTESTED` (INVALID/INCOMPLETE verdict or reviewer dispute). |
| `PROOF_RATIFIED` | An Evolution-committed ratification promoted the case to `RATIFIED`. |
| `PROOF_SUPERSEDED` | The case was superseded by a newer proof of the same subject (migration-only). |
| `PROOF_WITHDRAWN` | Submitter withdrew the case before attestation. |

- **Producer.** `EvidenceLedgerService` (open/withdraw), the projection transition engine (`PROOF_STATE_CHANGED`,
  `PROOF_CONTESTED`), `RatificationGateway` (`PROOF_RATIFIED`, via Evolution only).
- **Consumer.** `ProofCase` projection (fold), `ProofQueryService`, `ProofExportService`, auditors, federated
  peers (export only).
- **Payload.** `PROOF_CASE_OPENED`: `{ claim, proofTypeId, retentionClassRef }`. `PROOF_STATE_CHANGED`:
  `{ from, to, reasonRefs[] }`. `PROOF_RATIFIED`: `{ evolutionUnitId, authority, tier }`. `PROOF_SUPERSEDED`:
  `{ supersededBy }`. All values are references or recorded facts — no literals.
- **Ordering Rules.** Strictly ordered within the case stream `streamId = case:<proofCaseId>` by `seq`; a
  transition event is rejected if its `from` state ≠ the projected current state (optimistic `version` guard).
- **Replay Rules.** Folding these events reconstructs `status` and all lifecycle fields exactly; the fold is a
  pure function of the ordered stream, independent of wall-clock.
- **Audit Rules.** Each event is a hash-chained `AUDIT-UNIV-001` record; `PROOF_RATIFIED` additionally references
  the Evolution unit that authorized it (dual-anchored, S6 + AD-0019).
- **Failure Semantics.** A transition whose precondition fails is **denied and emits no state event** (the denial
  itself is audited). `PROOF_RATIFIED` is impossible without a committed Evolution unit; absence ⇒ deny.

### 9.4 `EVIDENCE_*` — evidence capture & chaining family

**Purpose.** Record immutable evidence submission and its binding into a per-subject hash chain.

| Event type | Purpose |
|------------|---------|
| `EVIDENCE_SUBMITTED` | An `EvidenceRecord` is validated and accepted. |
| `EVIDENCE_APPENDED` | The evidence is bound into the subject chain (`EvidenceChainEntry`). |
| `EVIDENCE_SUPERSEDED` | A correcting record supersedes a prior one (both remain on the chain). |
| `EVIDENCE_RECALL_MARKED` | By-reference payload marked non-recallable under a retention class (chain untouched). |

- **Producer.** `EvidenceLedgerService`.
- **Consumer.** Evidence-chain projection, `VerificationService` (reads `evaluatedDigests`), export/bundling,
  auditors.
- **Payload.** `EVIDENCE_SUBMITTED`: the `EvidenceRecord` (descriptor + `digest` + `schemaRef` + `classification`
  + `provenance`) — **never raw payload bytes**. `EVIDENCE_APPENDED`: `{ subject, seq, evidenceDigest, prevHash,
  entryHash }`. `EVIDENCE_SUPERSEDED`: `{ supersedes: evidenceId }`.
- **Ordering Rules.** Chain events are ordered within `streamId = subject:<subject>` by `seq`; append uses
  **compare-and-append on `prevHash`** (a losing writer retries against the new head — Part 1 §6.4).
- **Replay Rules.** Replaying the subject stream rebuilds the chain and re-derives every `entryHash`; any
  divergence from recorded `entryHash` is a tamper signal and fails closed.
- **Audit Rules.** Immutable, hash-chained; `EVIDENCE_RECALL_MARKED` records recallability change **only** — it
  never removes prior evidence events, digests, or chain entries (DR-6).
- **Failure Semantics.** Schema-invalid descriptor, unresolved `schemaRef`, or `classification <
  proofType.classificationFloor` ⇒ submission denied, no event. `prevHash` mismatch on append ⇒ retry;
  persistent mismatch ⇒ fail-closed.

### 9.5 `ATTESTATION_*` — attestation & quorum family

**Purpose.** Record signed attestations and the deterministic M-of-N quorum evaluation over them.

| Event type | Purpose |
|------------|---------|
| `ATTESTATION_SUBMITTED` | A signed attestation was accepted (signature verified). |
| `ATTESTATION_REJECTED` | An attestation was denied (bad signature, inadmissible role, independence violation). |
| `ATTESTATION_QUORUM_EVALUATED` | The quorum evaluator recomputed M-of-N state. |
| `ATTESTATION_QUORUM_MET` | Quorum satisfied ⇒ case eligible for `ATTESTED`. |

- **Producer.** `AttestationService` (submission), quorum evaluator (evaluation/met).
- **Consumer.** `ProofCase` projection, `VerificationService`, auditors, federated peers.
- **Payload.** `ATTESTATION_SUBMITTED`: the `Attestation` (with `SignatureBlock` = `{keyRef, alg:"ed25519",
  signedDigest, sig, signedAt}`, `signaturePolicyRef`, `role`, `independenceTag?`). `ATTESTATION_QUORUM_EVALUATED`:
  `{ policyRef, m, n, satisfiedBy[], distinctTags }`. `ATTESTATION_REJECTED`: `{ reasonRef }`.
- **Ordering Rules.** Ordered within the case stream; a `QUORUM_MET` event is valid only if a preceding
  `QUORUM_EVALUATED` in the same stream shows satisfaction (causation-linked, §9.12).
- **Replay Rules.** Quorum is **recomputed** during replay from the attestation set + pinned `signaturePolicyRef`
  — never trusted from the recorded flag (DR-3). Recorded `satisfiedBy[]` must equal the recomputed set or replay
  fails closed.
- **Audit Rules.** Both acceptance and rejection are audited; a rejected attestation leaves an immutable record
  (no silent drop).
- **Failure Semantics.** Signature that does not verify via `assertions.ts`, role not in `admissibleRoles`, or
  independence constraint unmet ⇒ `ATTESTATION_REJECTED`, no quorum credit. Quorum shortfall ⇒ case stays
  `OPEN`/`REJECTED`, never `ATTESTED` (PROOF-INV-7).

### 9.6 `SIGNATURE_*` — signature verification & key-reference lifecycle family

**Purpose.** Record the cryptographic verification results and the **key-reference** lifecycle (never key
material; S3). This family is independent of `ATTESTATION_*`: a signature event records the crypto fact; an
attestation event records the governance fact that consumes it.

| Event type | Purpose |
|------------|---------|
| `SIGNATURE_VERIFIED` | A detached Ed25519 signature verified over a canonical digest. |
| `SIGNATURE_REJECTED` | A signature failed verification. |
| `SIGNATURE_KEYREF_REGISTERED` | A key **reference** was admitted for a key class (by reference; S3). |
| `SIGNATURE_KEYREF_ROTATED` | A key reference was rotated (new ref supersedes prior). |
| `SIGNATURE_KEYREF_REVOKED` | A key reference was revoked; future verifications under it are denied. |

- **Producer.** `SignatureFramework` (`signature-framework.ts`), delegating crypto to `federation/assertions.ts`.
- **Consumer.** `AttestationService`, `VerificationService`, offline verifiers, federated peers, auditors.
- **Payload.** `SIGNATURE_VERIFIED`/`_REJECTED`: `{ keyRef, alg:"ed25519", signedDigest, result, atVersion }`.
  Key-ref lifecycle events: `{ keyRef, keyClass, supersedes?, effectiveAt }` — **reference only, never bytes.**
- **Ordering Rules.** Key-ref lifecycle events are ordered within `streamId = keyref:<keyRef>`; a verification
  event must observe the key-ref state as of the verification's `occurredAt` (revoked-before ⇒ deny).
- **Replay Rules.** Verification is re-executed against the recorded `keyRef` state and `signedDigest`; because
  Ed25519 verify is deterministic and inputs are recorded, replay reproduces the result exactly. Revocation
  ordering is honored: a signature valid at record time but under a since-revoked key is **still historically
  valid** for that recorded moment (verdicts are time-anchored), while **new** use of a revoked ref is denied.
- **Audit Rules.** Every verify/reject and every key-ref lifecycle transition is immutably audited; revocation is
  irreversible in the forward direction (a new ref, not un-revocation).
- **Failure Semantics.** Unresolved `keyRef`, revoked ref at use time, wrong `alg`, or malformed signature ⇒
  `SIGNATURE_REJECTED` / deny. No signature is ever assumed valid without a `SIGNATURE_VERIFIED` record
  (fail-closed).

> **Note.** Full key lifecycle, rotation, revocation, offline and cross-node verification are specified in **§12
> Signature Framework**, which is **out of scope for this Part B2** document; §9.6 defines only the *event*
> contract for those operations.

### 9.7 `REVIEW_*` — independent-review SoD family

**Purpose.** Record the separation-of-duties review workflow that gates `RATIFIED` (closing the self-attestation
defect, `REAL-M-03`/`REAL-C-05`).

| Event type | Purpose |
|------------|---------|
| `REVIEW_ASSIGNED` | An independent reviewer was assigned (SoD-checked). |
| `REVIEW_SUBMITTED` | A reviewer recorded `AFFIRM`/`DISPUTE`/`ABSTAIN` with mandatory rationale. |
| `REVIEW_QUORUM_MET` | Review quorum satisfied under the review policy. |
| `REVIEW_SOD_VIOLATION` | An assignment/submission was denied for role overlap. |

- **Producer.** `ReviewService`.
- **Consumer.** `ProofCase` projection, `RatificationGateway`, auditors.
- **Payload.** `REVIEW_ASSIGNED`: `{ reviewer, reviewPolicyRef, independenceProof[] }`. `REVIEW_SUBMITTED`: the
  `ReviewRecord` (`decision`, non-empty `rationale`, `independenceProof[]`). `REVIEW_SOD_VIOLATION`:
  `{ reviewer, conflictWith, reasonRef }`.
- **Ordering Rules.** Ordered within the case stream; a `REVIEW_SUBMITTED` requires a preceding
  `REVIEW_ASSIGNED` for the same reviewer (causation-linked).
- **Replay Rules.** SoD independence is **re-verified** during replay against the recorded principals and
  `proof:role:*` groupings; a replay that detects overlap fails closed (a case cannot replay into `RATIFIED`
  without valid, independent reviews).
- **Audit Rules.** All reviews — including `ABSTAIN` and `SOD_VIOLATION` — are immutably audited; no review is
  discardable.
- **Failure Semantics.** Reviewer not distinct from submitter/attester/verifier operator ⇒ `REVIEW_SOD_VIOLATION`,
  assignment denied. Empty rationale ⇒ submission denied. Quorum unmet ⇒ no `RATIFIED` path.

### 9.8 `VERIFICATION_*` — deterministic verdict family

**Purpose.** Record the output of the **pure** Verification core: reproducible verdicts bound to exact inputs.

| Event type | Purpose |
|------------|---------|
| `VERIFICATION_REQUESTED` | A verification was requested for a case at a specific evidence/attestation state. |
| `VERIFICATION_COMPLETED` | A `Verdict` was produced (`VALID`/`INVALID`/`INCOMPLETE`/`INDETERMINATE`). |
| `VERIFICATION_INVALIDATED` | A prior verdict was invalidated because `evaluatedDigests` changed (DR-5). |
| `VERIFICATION_REVERIFIED` | An offline/cross-node re-verification reproduced (or contradicted) a verdict. |

- **Producer.** `VerificationService` (orchestration over the pure verifier); `VERIFICATION_REVERIFIED` may be
  produced by any node running the pinned verifier.
- **Consumer.** `ProofCase` projection, `RatificationGateway`, `ProofExportService`, federated peers, auditors.
- **Payload.** `VERIFICATION_COMPLETED`: the `Verdict` (`status`, `resultHash`, `verifierId`, `verifierVersion`,
  `reasons[]`, `evaluatedDigests[]`). `VERIFICATION_INVALIDATED`: `{ priorResultHash, changedBy }`.
  `VERIFICATION_REVERIFIED`: `{ resultHash, agrees: boolean, byNodeId? }`.
- **Ordering Rules.** Ordered within the case stream; a `COMPLETED` supersedes prior verdicts for projection
  purposes but does **not** delete them (append-only history of verdicts).
- **Replay Rules.** The verdict is **recomputed** by the pure verifier over the recorded evidence/attestations +
  pinned `verifierRef` + pinned `policyRefs`; the recomputed `resultHash` MUST equal the recorded `resultHash`,
  else replay fails closed. This is the core reproducibility guarantee (Part 1 §3.5).
- **Audit Rules.** Every verdict, invalidation, and re-verification is immutably audited; a contradicting
  `VERIFICATION_REVERIFIED` (`agrees:false`) is a first-class, permanently recorded integrity alarm.
- **Failure Semantics.** Unresolved verifier or missing input ⇒ `INDETERMINATE` (never `VALID`). Any input
  mismatch at replay ⇒ fail-closed. A verdict is never trusted from the recorded flag alone during replay; it is
  always recomputed.

### 9.9 Ordering model (streams & sequences)

Ordering is defined **per stream**, not globally, so independent subjects and cases scale without contention:

| Stream kind | `streamId` | Orders | Append discipline |
|-------------|-----------|--------|-------------------|
| Case stream | `case:<proofCaseId>` | All case-scoped `PROOF_/ATTESTATION_/REVIEW_/VERIFICATION_` events | Optimistic `version` (expected event count) |
| Subject chain | `subject:<subject>` | `EVIDENCE_*` chain entries | Compare-and-append on `prevHash` |
| Key-ref stream | `keyref:<keyRef>` | `SIGNATURE_KEYREF_*` lifecycle | Serialized per key reference |
| Audit stream | `AUDIT-UNIV-001` `domain:"proof"` | **All** proof events (global tamper-evidence) | Hash-chained append (single writer per node) |

- **Within a stream:** total order by `seq`, hash-chained by `prevHash`.
- **Across streams:** partial order established **only** through `causationId`/`correlationId`; no global
  wall-clock ordering is assumed or required (INV-6 determinism does not depend on real-time ordering).
- **Cross-stream anchoring:** the `AUDIT-UNIV-001` proof-domain stream provides a single tamper-evident spine
  over every proof event regardless of its logical stream.

### 9.10 Event lineage rules

Lineage is the **derivation ancestry** of a proof artifact, expressed through immutable links:

- **LN-1.** Every derived artifact records its inputs' digests: a `Verdict` records `evaluatedDigests[]`; a
  `ProofBundle` records `chainSegment[]` + `attestations[]` + `verifierRef`; a chain entry records `prevHash`.
- **LN-2.** Lineage is **acyclic and append-only**: an artifact may reference only artifacts that already exist
  in its causal past (`causationId` must point to an earlier event).
- **LN-3.** Supersession is lineage, not deletion: `EVIDENCE_SUPERSEDED` / `PROOF_SUPERSEDED` add a forward link;
  the superseded node and all its hashes remain (INV-CORE-03, DR-6).
- **LN-4.** Lineage is **independently walkable**: given a `resultHash`, a third party can walk
  `evaluatedDigests → EvidenceChainEntry → prevHash → … → GENESIS_HASH` and confirm the complete evidentiary
  ancestry from exported bytes alone.

### 9.11 Correlation model

- **CR-1.** Every logical operation (e.g. "submit + attest + verify one claim") shares a single
  `correlationId`, assigned at the API boundary and propagated onto every event it produces across all six
  families.
- **CR-2.** `correlationId` enables cross-family assembly (e.g. reconstructing an operation's full audit trail)
  **without** creating processing coupling — families still process independently.
- **CR-3.** Federated operations preserve the originating `correlationId` inside the `Provenance` envelope while
  assigning a **local** correlation for the re-verification, so both trails are reconstructable.

### 9.12 Causation model

- **CS-1.** `causationId` names the **single direct cause** (the `eventId`) of an event: e.g.
  `ATTESTATION_QUORUM_MET.causationId = <the ATTESTATION_QUORUM_EVALUATED eventId>`;
  `PROOF_STATE_CHANGED(→VERIFIED).causationId = <VERIFICATION_COMPLETED eventId>`.
- **CS-2.** Causation forms a DAG; a cycle is impossible because a cause must precede its effect in stream order
  (LN-2).
- **CS-3.** Causation is the **only** sanctioned cross-family dependency; a consumer reacts to another family's
  event solely via the recorded causal link, never via shared mutable state.
- **CS-4.** Replay honors causation: an effect event is only applied if its cause exists and validates; otherwise
  replay fails closed (no orphaned effects).

### 9.13 Idempotency model

- **ID-1.** Every state-producing command carries a client-supplied **nonce**; the fabric records
  `(actor, nonce) → eventId`. A replayed command returns the **original** event — no duplicate chain entry, no
  duplicate attestation (Part 1 §5.4).
- **ID-2.** Content-addressed appends are naturally idempotent: submitting identical evidence yields the same
  `evidenceDigest`; a re-append is a no-op that returns the existing entry.
- **ID-3.** Quorum/verdict computations are idempotent by construction (pure recompute over the same inputs
  yields the same result and the same `resultHash`).
- **ID-4.** Idempotency is **deterministic and offline-checkable**: the `(actor, nonce)` map is itself derived
  from the event stream, so replay reconstructs it exactly.

### 9.14 Deterministic replay model

The fabric's entire state is `fold(orderedEvents, applyEvent, EMPTY)`. Determinism rests on five guarantees:

- **DR-A.** **No ambient inputs at replay.** `applyEvent` reads only fields recorded in the event; time, ids, and
  randomness were captured at record time (EV-2). The pure verifier and quorum evaluator take all inputs
  explicitly.
- **DR-B.** **Recompute, don't trust.** Quorum satisfaction (§9.5), signature validity (§9.6), verdicts (§9.8),
  and SoD independence (§9.7) are **recomputed** during replay and checked against recorded results; a mismatch
  fails closed rather than trusting the recorded flag.
- **DR-C.** **Pinned policy.** Every event's `policyRefs` are version-pinned (EV-3), so replay resolves the exact
  registry records that governed the original operation (Part B1 §8.4–§8.5) — even if newer versions are now
  `ACTIVE`.
- **DR-D.** **Hash-verified stream.** Replay validates `prevHash`/`eventHash` continuity as it folds; a broken
  chain halts replay (PROOF-INV-1).
- **DR-E.** **Order-stable.** Per-stream `seq` + causation DAG produce a stable application order; the result of
  the fold is independent of the machine, the wall-clock, and the replay time.

**Consequence.** Any node — local, federated, or a fully independent third party — replaying the same event bytes
against the same pinned registry reaches the **identical** projection and the **identical** `resultHash`. This is
the event-model foundation of the fabric's offline and cross-node verifiability guarantees, realized physically
in §10.

---

## 10. Storage Schema

This section specifies **how** the event model (§9) and data model (Part B1 §7) are stored: logical schema,
physical schema, keys, partitioning, retention, checkpoints, replay, hash-chaining, evidence bundling, and
offline/cross-node verification support. It is **provider-agnostic**: the schema is defined over the PI-2/3
persistence ports as abstract structures with a **reference SQL rendering** for concreteness only. **No datastore,
engine, or vendor is selected here** — engine selection remains bound to the ratified platform ADRs and is
explicitly out of scope. The schema is defined as fifteen storage strategies, **SS-1 … SS-15.**

### 10.1 Storage design constraints

Every strategy below satisfies the standing constraints: **event-sourced** (events are the only source of
truth), **immutable/append-only** (no in-place update, no delete of governed rows), **cryptographically
verifiable** (hash-chained, digest-addressed), **registry-driven** (schemas/policies referenced, never inlined),
**deny-by-default** (unresolved reference ⇒ deny; unaudited write ⇒ abort), **provider-agnostic**, and
**evolution-only** for any governed mutation.

### 10.2 SS-1 — Logical schema

The logical model is five append-only **stores** plus disposable projections. All stores are conceptual
(port-defined), not engine-specific.

| Logical store | Holds | Source-of-truth? | Key |
|---------------|-------|:----------------:|-----|
| **EventStore** | `ProofEvent` records (all six families) | **Yes** | `(streamId, seq)` |
| **EvidenceChainStore** | `EvidenceChainEntry` (materialized from `EVIDENCE_APPENDED`) | Derived-but-authoritative* | `(subject, seq)` |
| **RegistryStore** | `proof:*` records, versioned (Part B1 §8) | Yes (config truth) | `(kind, id, version)` |
| **ProjectionStore** | `ProofCaseProjection`, quorum, indexes | No (cache) | `proofCaseId` |
| **BundleStore** | `ProofBundle` exports (optional, reproducible) | No (cache) | `bundleDigest` |

> *The evidence chain is a materialization of `EVIDENCE_*` events but is treated as integrity-authoritative
> because its `entryHash` values are the chain commitments; it is fully rebuildable from the EventStore and is
> never mutated in place.

**Logical relationships** mirror Part B1 §7.6; foreign-key-like links are by **digest/reference**, never by
mutable surrogate, so they survive export and cross-node transfer.

### 10.3 SS-2 — Physical schema (reference rendering)

A reference relational rendering (illustrative; **not** an engine selection). Any adapter — relational,
document, ledger-DB, object store — is admissible if it preserves append-only semantics, the exact
`canonicalize()` byte form, and content-addressability.

```sql
-- SPECIFICATION — reference rendering only; NOT committed DDL, NOT an engine selection.

-- SS-2.a  Append-only event log (the source of truth)
CREATE TABLE proof_event (
  stream_id       TEXT      NOT NULL,          -- case:* | subject:* | keyref:* 
  seq             BIGINT    NOT NULL,          -- per-stream monotonic
  event_id        TEXT      NOT NULL UNIQUE,   -- ULID-like, recorded
  family          TEXT      NOT NULL,          -- PROOF|EVIDENCE|ATTESTATION|SIGNATURE|REVIEW|VERIFICATION
  type            TEXT      NOT NULL,
  proof_case_id   TEXT,                        -- nullable (global events)
  subject         TEXT,
  occurred_at     BIGINT    NOT NULL,          -- recorded logical time
  actor           TEXT      NOT NULL,
  correlation_id  TEXT      NOT NULL,
  causation_id    TEXT,                        -- eventId of direct cause
  payload         JSONB     NOT NULL,          -- canonical payload (family/type-specific)
  provenance      JSONB     NOT NULL,
  policy_refs     JSONB     NOT NULL,          -- version-pinned proof:*@version[]
  prev_hash       TEXT      NOT NULL,          -- chain continuity
  event_hash      TEXT      NOT NULL,          -- sha256(canonicalize(event\event_hash))
  PRIMARY KEY (stream_id, seq)
  -- APPEND-ONLY: no UPDATE, no DELETE (enforced by adapter + policy; see SS-5)
);

-- SS-2.b  Materialized evidence chain (rebuildable from proof_event)
CREATE TABLE proof_evidence_chain (
  subject         TEXT      NOT NULL,
  seq             BIGINT    NOT NULL,
  evidence_id     TEXT      NOT NULL,
  evidence_digest TEXT      NOT NULL,
  prev_hash       TEXT      NOT NULL,          -- GENESIS_HASH at seq 0
  entry_hash      TEXT      NOT NULL,
  PRIMARY KEY (subject, seq)
);

-- SS-2.c  Versioned registry (immutable-per-version)
CREATE TABLE proof_registry (
  kind            TEXT      NOT NULL,          -- type|schema|signature-policy|verifier|review-policy|retention|role|federation-policy
  id              TEXT      NOT NULL,
  version         TEXT      NOT NULL,          -- semver
  status          TEXT      NOT NULL,          -- DRAFT|ACTIVE|DEPRECATED|RETIRED
  record          JSONB     NOT NULL,          -- full ProofRegistryRecord
  digest          TEXT      NOT NULL,          -- tamper-evident
  published_by    TEXT      NOT NULL,          -- Evolution-committed
  published_at    BIGINT    NOT NULL,
  PRIMARY KEY (kind, id, version)              -- versions never overwritten
);

-- SS-2.d  Disposable projection cache (never source of truth)
CREATE TABLE proof_case_projection (
  proof_case_id       TEXT   NOT NULL PRIMARY KEY,
  projection          JSONB  NOT NULL,
  version             BIGINT NOT NULL,          -- monotonic event count (optimistic concurrency)
  projected_from_head TEXT   NOT NULL           -- ledger head-hash; invalidates cache on mismatch
);

-- SS-2.e  Optional reproducible bundle cache
CREATE TABLE proof_bundle (
  bundle_digest   TEXT      NOT NULL PRIMARY KEY,
  proof_case_id   TEXT      NOT NULL,
  bundle          JSONB     NOT NULL,           -- self-contained, offline-verifiable
  produced_at     BIGINT    NOT NULL
);
```

### 10.4 SS-3 — Key structures

| Store | Primary key | Content-addressed keys | Uniqueness / integrity |
|-------|-------------|------------------------|------------------------|
| EventStore | `(stream_id, seq)` | `event_id`, `event_hash` | `event_id` unique; `event_hash` chains `prev_hash` |
| EvidenceChain | `(subject, seq)` | `evidence_digest`, `entry_hash` | `entry_hash` = digest of `(subject,seq,evidence_digest,prev_hash)` |
| Registry | `(kind, id, version)` | `digest` | version tuple immutable; `digest` tamper-evident |
| Projection | `proof_case_id` | `projected_from_head` | cache key; invalidated on head mismatch |
| Bundle | `bundle_digest` | `bundle_digest` | self-verifying key |
| Idempotency index | `(actor, nonce)` | → `event_id` | one event per nonce (ID-1) |

All content-addressed keys (`event_hash`, `entry_hash`, `evidence_digest`, `result_hash`, `bundle_digest`) are
`sha256(canonicalize(...))` per the digest specs (Part B1 §7.4) and are **reproducible by any party**.

### 10.5 SS-4 — Partition strategy

- **PART-1.** EventStore partitions by **`stream_id`** (case / subject / keyref), giving independent, contention-
  free append paths and natural locality for per-case and per-subject replay.
- **PART-2.** Within a partition, rows are clustered by `seq` (append order = physical order).
- **PART-3.** EvidenceChain partitions by **`subject`**; the per-subject chain is self-contained.
- **PART-4.** Registry partitions by **`kind`**; versions of one `(kind,id)` cluster together for fast
  latest-`ACTIVE` and historical-pin lookups.
- **PART-5.** Partitioning is an adapter concern; the logical model imposes only that a partition **never spans a
  hash chain** (a chain's continuity must be verifiable within one ordered partition). No engine-specific
  sharding is prescribed (provider-agnostic).

### 10.6 SS-5 — Retention strategy

Retention governs **recallability of by-reference payload bytes only**; it **never** deletes events, digests,
chain entries, signatures, or verdicts (DR-6, S6).

- **RET-1.** Each `ProofType` binds a `retentionClassRef` (`proof:retention:*`) — `permanent`,
  `time-boxed`, or `on-request-purge`.
- **RET-2.** Purging a by-reference payload emits `EVIDENCE_RECALL_MARKED`; the `evidence_digest` and chain
  entry **remain**, so the proof *that the evidence existed and what its digest was* is permanent.
- **RET-3.** `preservesChain: true` is an enforced invariant of every retention class; a class that would remove
  chain data is inadmissible (deny-by-default).
- **RET-4.** Retention actions are Evolution-committed consequences and audited (`PROOF_*`).

### 10.7 SS-6 — Checkpoint strategy

- **CP-1.** A checkpoint is a **snapshot of a projection** keyed by the ledger head-hash it was folded from
  (`projected_from_head`).
- **CP-2.** Checkpoints are **pure caches**: if the current head-hash ≠ `projected_from_head`, the checkpoint is
  discarded and refolded (Part 1 §6.3). A checkpoint is **never** a source of truth.
- **CP-3.** Checkpoints are validated by recomputation on load in integrity-sensitive contexts (e.g. before
  ratification), so a corrupted checkpoint cannot influence a verdict.
- **CP-4.** Registry snapshots are checkpointed by `snapshotHead()` (Part B1 §8.6) so a verdict/bundle can pin
  the exact registry state it resolved against.

### 10.8 SS-7 — Replay strategy

- **RP-1.** Replay = `fold(order(events by stream seq, honoring causation DAG), applyEvent, EMPTY)` (§9.14).
- **RP-2.** Replay **recomputes** quorum, signatures, verdicts, and SoD (DR-B) and checks each against recorded
  results; any mismatch **halts replay fail-closed**.
- **RP-3.** Replay validates `prev_hash`/`event_hash` continuity as it folds (DR-D).
- **RP-4.** Partial replay to a target `seq` yields a historical projection (time-travel/audit).
- **RP-5.** Replay is engine-independent: it consumes only EventStore rows + pinned RegistryStore records; no
  projection or checkpoint is required for correctness (they are only accelerators).

### 10.9 SS-8 — Hash-chain strategy

- **HC-1.** Two chains are maintained: the **per-subject evidence chain** (`entry_hash` over `prev_hash`) and the
  **global proof-audit chain** (`AUDIT-UNIV-001`, `domain:"proof"`, `event_hash` over `prev_hash`).
- **HC-2.** `GENESIS_HASH` is the reused `AUDIT-UNIV-001` constant; the fabric defines no genesis of its own.
- **HC-3.** Every append recomputes and verifies the chain head before commit (compare-and-append, PART-5);
  a mismatch fails closed.
- **HC-4.** Chain verification is a **pure, offline** operation: given the ordered rows, any party recomputes
  every `entry_hash`/`event_hash` and confirms continuity to genesis without the fabric.
- **HC-5.** The two chains cross-anchor: an `EVIDENCE_APPENDED` audit event embeds the resulting `entry_hash`, so
  the audit chain witnesses the evidence chain and vice-versa.

### 10.10 SS-9 — Evidence bundle strategy

- **EB-1.** A `ProofBundle` (Part B1 §7.5) is a **self-contained, reproducible** export: contiguous, `prev_hash`-
  continuous `chainSegment[]`, evidence descriptors (digests, not raw bytes), attestations with `SignatureBlock`s,
  the `Verdict`, and the pinned `verifierRef` + registry snapshot pin.
- **EB-2.** The bundle is content-addressed by `bundle_digest = sha256(canonicalize(...))`; two nodes producing a
  bundle for the same case state produce the identical `bundle_digest`.
- **EB-3.** Bundles are **derived and disposable** (BundleStore is a cache); they are always reproducible from
  the EventStore + RegistryStore.
- **EB-4.** Export is **deny-by-default**: a bundle is producible for cross-node/federation transfer only if the
  `ProofType.federationPolicyRef` permits (`exportable: true`); otherwise export is denied (Part B1 §8.3).

### 10.11 SS-10 — Offline verification support

- **OV-1.** A `ProofBundle` carries everything a verifier needs: evidence digests, chain segment to genesis (or a
  pinned anchor), attestation signatures + `keyRef`s, the pinned `verifierRef`, the pinned registry snapshot, and
  the `Verdict` with `resultHash`.
- **OV-2.** An independent party runs the **pure** verifier (`verifyBundleOffline(bundle)`, Part 1 §5.3) with
  **no fabric access, no network, no clock**, recomputes the chain hashes, re-verifies each Ed25519 signature via
  the reused `assertions.ts`, re-runs quorum + verifier, and recomputes `resultHash`.
- **OV-3.** The verdict is **accepted iff** the recomputed `resultHash` equals the bundle's `resultHash` and all
  chain/signature checks pass; any discrepancy ⇒ the offline verifier returns `INVALID`/`INDETERMINATE`
  (fail-closed).
- **OV-4.** Offline verification requires **only** the bundle bytes and the pinned verifier version — no shared
  runtime, no trust in the producer (Part 1 §1.1 core question).

### 10.12 SS-11 — Cross-node verification support

- **CN-1.** A foreign proof is **never trusted on import**; it is stored under a **namespaced provenance**
  (`Provenance.origin = "federated"`, `reVerifiedLocally = false`) and denied local effect until re-verified
  (PI-5 trust model; deny-by-default).
- **CN-2.** The importing node runs offline verification (SS-10) locally; success sets `reVerifiedLocally = true`
  and emits `VERIFICATION_REVERIFIED{agrees:true}`.
- **CN-3.** A contradiction (`agrees:false`) is a permanently-recorded integrity alarm (§9.8) and the foreign
  proof confers **no** local effect.
- **CN-4.** Because verification is pure and inputs are pinned (verifier version + registry snapshot), the local
  re-verification verdict provably equals the origin verdict when the bytes are authentic — divergence can only
  mean tampering or version drift, both of which fail closed.
- **CN-5.** Cross-node transfer moves **bundles** (SS-9), not live state; no node ever mutates another node's
  stores (Evolution-only, namespace-isolated).

### 10.13 SS-12 — Integrity guarantees

- **IG-1.** **Append-only, no in-place mutation** of any event, chain entry, or registry version (SS-2 comment;
  enforced by adapter + policy).
- **IG-2.** **Tamper-evidence** via dual hash chains (SS-8); any alteration breaks continuity and fails every
  dependent verification.
- **IG-3.** **Digest-addressed content**: evidence, verdicts, and bundles are identified by `sha256` of their
  canonical form; substitution is detectable.
- **IG-4.** **Signature authenticity**: every attestation is an Ed25519 detached signature over a canonical
  digest, verifiable offline (no custom crypto).
- **IG-5.** **Recompute-don't-trust** at replay (RP-2): recorded flags are never authoritative over recomputed
  results.

### 10.14 SS-13 — Recovery guarantees

- **RC-1.** **Full rebuild from the log**: the entire fabric state (projections, chains, quorum, verdicts)
  reconstructs by replaying the EventStore against pinned RegistryStore records (RP-1).
- **RC-2.** **No partial-write corruption surface**: because there is no in-place mutation, a crash mid-operation
  leaves either a complete appended event or none (the audit-sink-first discipline, S6: no unaudited state
  change).
- **RC-3.** **Checkpoints accelerate, never gate** recovery: a lost/corrupt checkpoint is simply refolded
  (CP-2).
- **RC-4.** **Deterministic recovery**: replay yields the identical projection regardless of when/where it runs
  (§9.14).

### 10.15 SS-14 — Durability guarantees

- **DU-1.** An operation is durable **only after** its event is appended **and** its `AUDIT-UNIV-001` record is
  hash-chained; if the audit append fails, the operation aborts (deny-by-default, no unaudited state).
- **DU-2.** Idempotency (`(actor,nonce)`, ID-1) makes retries safe under at-least-once delivery: a re-submitted
  command returns the original event, never a duplicate.
- **DU-3.** Optimistic concurrency (`version` for cases, `prev_hash` compare-and-append for chains) prevents
  lost updates without locks.
- **DU-4.** Durability targets (fsync/replication semantics) are an **adapter/ADR concern**, deliberately
  unspecified here (provider-agnostic); the logical guarantee is only "durable ⟺ appended-and-audited".

### 10.16 SS-15 — Audit guarantees

- **AU-1.** **Every** fabric operation — including denials, rejections, SoD violations, and contradicting
  re-verifications — emits an immutable `PROOF_*` audit event (PROOF-INV-8); there is **no** silent path.
- **AU-2.** The proof-audit chain is the single tamper-evident spine over all six families (SS-8, §9.9).
- **AU-3.** Audit records are **self-proving**: the fabric that proves other claims proves its own actions, and
  those actions are offline-verifiable by the same mechanism (SS-10).
- **AU-4.** Governance mutations of the registry (publish/activate/deprecate/retire) are audited and
  Evolution-anchored (Part B1 §8.5, §8.7); the configuration history is itself independently provable.
- **AU-5.** Audit is **preservation-complete**: retention and supersession never remove audit records
  (RET-2, LN-3, DR-6).

---

*(END PART B2 — Event Model (§9) & Storage Schema (§10). This document stops after §10 by mandate. Sections
11–12 [API Specification · Signature Framework] are intentionally not present here and are deferred to a
subsequent Part-B installment. This document introduces no implementation code, releases no lock, and enrolls no
invariant. Article IX remains ACTIVE and unchanged; `UCOS-CONSTRUCTION-BLOCKED` remains active; INV-1..13 are
unchanged.)*
