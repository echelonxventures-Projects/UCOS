# UCOS — PHASE UA-05 · CANONICAL PLATFORM INVARIANTS

## The Invariants That Can Never Be Violated

| Field | Value |
|-------|-------|
| Artifact | **UCOS Canonical Platform Invariants** |
| Artifact ID | `INV-CORE-001` |
| Version | 1.0.0 |
| Phase | **PHASE UA-05 — Canonical Invariants** |
| Mode | **GOVERNED DEFINITION ONLY** — defines canonical invariants + their verification/failure/recovery semantics; performs no implementation, deploys no infrastructure, modifies no ADR/architecture/fabric, mutates no registry/state, releases no lock, enrolls nothing into the constitutional invariant set |
| Authority | Subordinate to the Authority Layer (`AUTH-001..012`), the Constitution (`UCOS-CONST-001`, Art. IX/X/XII), the Governance Baseline 1.0.0 (FROZEN), and the Foundation Permanence Baseline (`UCOS-ASR-NFR-001`, INV-1..13). This artifact **enacts and restates**; it does not amend |
| Relationship to `UCOS-ASR-NFR-001` | **Complementary, non-colliding.** `INV-1..13` are *foundation-permanence* invariants (redesign-prohibited structural guarantees). `INV-CORE-01..14` here are *runtime & governance integrity* invariants (never-violate operational guarantees). Namespaced `INV-CORE-*` to avoid any collision with `INV-1..13` |
| Enrollment status | **PROPOSED — CANONICAL DEFINITION.** Formal enrollment as constitutional invariants is an Approval-Required act of the Authority Board (AUTH-009 / AUTH-012); this artifact confers no authority and releases no lock |
| Date | 2026-07-02 |
| **Determination** | **DEFINED — READY FOR AUTHORITY BOARD REVIEW** |

> This artifact fixes, once, the **canonical platform invariants** of UCOS: the properties that must hold at
> every scale tier, in every region, on every ADR-conformant technology, across every implemented and future
> fabric, from the first commit. Each invariant is stated formally and paired with the four mandatory
> operational attributes — **Verification Method**, **Failure Mode**, and **Recovery Mode** — so that each
> invariant is not merely asserted but is **continuously provable, its violation detectable, and its breach
> recoverable fail-closed**. Every invariant is **fail-closed**: on any inability to prove it, the platform
> denies/halts the affected operation rather than proceeding.

---

# SECTION 1 — PURPOSE, SCOPE & CANON

## 1.1 Purpose
To enumerate the **non-negotiable integrity invariants** of the UCOS platform and, for each, to define how it
is verified, what its violation looks like, and how the platform recovers without ever operating in a
violated state. These invariants are the ground truth against which every fabric, service, contract,
migration, and governed decision is evaluated.

## 1.2 Scope
All implemented fabrics (Substrate PI-2/3, Control PI-4, Federation PI-5, Evolution PI-6, Knowledge PI-7),
all design-ratified fabrics (Ontology PI-8, Memory PI-9, Intelligence PI-10, Simulation PI-11) at their
authorization gates, all platform domains (`PE-01..17`), all runtime services (`PRS-*`), and all 85 ratified
contracts (`UCOS-CONTRACT-CAT-001`). The invariants bind current and future construction identically.

## 1.3 Canon rules
- **Universality** — an invariant holds at every tier (T1..T4), region, environment, and technology; there
  is no dev-exempt, permissive, or "temporary" violated state.
- **Fail-closed** — inability to verify an invariant is treated as a violation; the affected operation is
  denied/halted, never allowed to proceed optimistically.
- **Append-only correction** — an invariant is never weakened; it is only tightened by governed upward
  revision (≥ 1.0.1 + AUTH-012). Loosening any invariant is a **redesign** and prohibited absent
  constitutional amendment.
- **Independent verifiability** — every invariant's verification method must be reproducible by an
  independent party from recorded evidence, without trusting the component under test.

## 1.4 The four mandatory attributes (per invariant)
| Attribute | Meaning |
|-----------|---------|
| **Formal Statement** | A precise, quasi-formal proposition (∀/∃/⇒) that is either true or false for any platform state or operation. |
| **Verification Method** | How the invariant is *continuously* proven — pre-commit gate, runtime enforcement point, audit reconstruction, adversarial test — from independent evidence. |
| **Failure Mode** | The observable signature of a violation and how it is detected (what fails, where, and how it surfaces). |
| **Recovery Mode** | The fail-closed response plus the governed remediation that returns the platform to a proven-conformant state. |

---

# SECTION 2 — CANONICAL INVARIANT CATALOG

> Fourteen canonical invariants. The eight integrity domains named in the UA-05 directive
> (Authority, Audit, Lineage, Federation, Evolution, Knowledge, Memory, Ontology) are `INV-CORE-01..08`;
> the load-bearing constitutional spine that every fabric depends on is `INV-CORE-09..14`.

---

## INV-CORE-01 — Authority Integrity
**Anchors:** `AUTH-001..012`, AUTH-009 (terminal authority), AD-0009 (Approval-Required), deny-by-default (`INV-3`).

- **Formal Statement.** ∀ governed action `a`: `a` executes ⇒ ∃ a valid, non-revoked authorizing decision
  `d` in the Authority chain such that `d` grants `a`'s required power, `d` is in force at `a`'s execution
  time, and `authority(a) ⊑ authority(d)`. No action executes under self-granted or absent authority; every
  authority resolves upward to the Authority Board as terminal.
- **Verification Method.** Control-Plane Policy Enforcement Point (PI-4) evaluates every action against the
  authority/policy graph *before* execution (deny-by-default); the decision and its authorizing reference
  are written to the audit log. Independent verification reconstructs `a → d → … → Authority Board` from the
  audit record and the AUTH ledger; Approval-Required acts (AD-0009) must show an explicit human/Board
  approval.
- **Failure Mode.** An action executes with (a) no authorizing decision, (b) a revoked/expired decision,
  (c) an authority exceeding what the chain grants (privilege escalation), or (d) a decision that does not
  resolve to the Authority Board. Detected as a PEP deny that was bypassed, an audit entry with an
  unresolvable/absent authority reference, or an authority-chain break.
- **Recovery Mode.** Fail-closed: the action is denied at the PEP; if a bypass is detected post-hoc, the
  affected effects are quarantined and routed to the Evolution Fabric for governed reversal, the offending
  path is disabled, and the incident is escalated to the Authority Board (AUTH-009). Authority-ledger
  defects (e.g., off-ledger authorizations) are corrected by ledger restoration before any dependent action
  is re-permitted.

---

## INV-CORE-02 — Audit Integrity
**Anchors:** S6 (audit), `FED-AUD-001` / `FederatedAuditLog` (hash-chained), `INV-10` (append-only), `PD-10` (evidentiary retention ≥ 7 yr).

- **Formal Statement.** ∀ governed decision or durable mutation `m`: ∃ exactly one audit entry `e(m)` that is
  (i) append-only, (ii) hash-chained to its predecessor (`e.prevHash = H(e-1)`), (iii) attributable to a
  principal and authority, and (iv) independently verifiable offline. The audit chain is tamper-evident:
  any deletion, reordering, or mutation breaks the hash chain.
- **Verification Method.** Every decision path emits through the audit sink; chain continuity is validated by
  recomputing `H(e)` across the sequence and confirming linkage. Cross-node reconciliation compares chains
  by `assertionRef`; offline export + verify reproduces the chain without trusting the emitting node.
  Adversarial tests attempt insert/delete/reorder/tamper and must be rejected.
- **Failure Mode.** A governed decision/mutation with no audit entry; a hash-chain break (recomputed hash ≠
  stored link); a divergence between reconciled node chains; or an audit entry lacking principal/authority
  attribution. Surfaces as a failed chain-verification, a reconciliation effect-mismatch/hash-break, or a
  coverage gap (mutation without entry).
- **Recovery Mode.** Fail-closed on divergence: the diverging segment is quarantined and no dependent
  decision proceeds until reconciled from the last-verified checkpoint. Tamper evidence is preserved (never
  overwritten); a governed re-anchoring writes a signed checkpoint, the tampered range is marked
  compromised (append-only), and the breach is escalated. Missing-entry paths are disabled until the emit
  point is restored.

---

## INV-CORE-03 — Lineage / Traceability Integrity
**Anchors:** `IC-4`, AUTH-010 (Traceability Canon), `INV-1`/`INV-10`, the `TM-*` matrices.

- **Formal Statement.** ∀ artifact `x` (implementation, contract, event, model, capability, data construct):
  ∃ an unbroken lineage `x → … → Authority` (e.g., `Impl → Contract → Service → Domain → Capability →
  Authority`) with no missing link and no cycle. There exist **zero orphan constructs** and **zero dangling
  references**.
- **Verification Method.** Traceability-matrix reconstruction (`TM-*`) resolves every artifact's upward chain
  and every downstream reference; a graph pass asserts full coverage (every node reaches Authority) and
  acyclicity. Gate `GATE-DOC-001` and per-phase gap scans reject any orphan or broken chain before
  ratification.
- **Failure Mode.** An artifact with no upward anchor (orphan), a reference to a non-existent/absent
  construct (dangling), a broken intermediate link, or a lineage cycle. Detected by a non-zero orphan/
  broken-chain/gap count in a traceability scan or a cycle-detection hit.
- **Recovery Mode.** Fail-closed at the gate: the artifact is **not** ratified/admitted while any lineage
  defect exists. Remediation restores the missing link (governed, append-only) or withdraws the orphan; a
  contested/phantom anchor (e.g., an off-ledger authorization) blocks all dependents until the ledger is
  reconciled. No downstream artifact is certified on an unresolved lineage.

---

## INV-CORE-04 — Federation Integrity
**Anchors:** `FED-GOV/SEC/PROV/AUD/ARCH-001`, AD-0018, `INV-1`/`INV-5` (no shared mutable model).

- **Formal Statement.** ∀ foreign construct `f` from node `n`: `f` is (i) namespace-isolated under
  `federation:<n>::…` (no local-keyspace collision), (ii) cryptographically verified (signed, replay-fresh,
  authority-enumerated), (iii) trust-clamped to the boundary/delegation ceiling, (iv) **advisory / deny-only**
  for policy, and (v) shadowed by any local construct (local-shadows-foreign). Under partition, federation
  is **fail-closed**. No foreign construct mutates local state or grants local authority.
- **Verification Method.** The federation resolver verifies each signed assertion (Ed25519), enforces
  authority-power/trust-boundary/replay/freshness checks, clamps trust, and materializes only into the
  disjoint `federation:` keyspace; namespace-isolation and local-shadowing are asserted by construction.
  A T1–T12 adversarial suite (spoofing, trust poisoning, foreign-policy allow, namespace collision,
  partition, replay/stale, authority escalation) must show 0 residual High/High.
- **Failure Mode.** A foreign construct writing to or shadowing a local key; an unsigned/expired/replayed
  assertion accepted; foreign policy producing a local *allow*; trust exceeding the clamp; or continued
  federated action during partition. Detected by resolver rejections, keyspace-isolation checks, or an
  adversarial-suite regression.
- **Recovery Mode.** Fail-closed: the foreign construct is rejected/ignored and the local (shadowing) value
  governs; on partition, federated inputs are suspended and only last-known-good local state serves. A
  detected boundary breach revokes the offending node's membership/trust (governed), quarantines any
  materialized foreign records, and escalates; local sovereignty is never surrendered.

---

## INV-CORE-05 — Evolution Integrity
**Anchors:** `INV-10` (append-only/migration-only), AD-0019 (Evolution Fabric), IP-14/IP-15 (migration-only + backward-compat), `UCOS-SVC-POLICY-001`.

- **Formal Statement.** ∀ durable mutation `m` of a governed construct: `m` is applied **only** through the
  Evolution Fabric, is **additive/migration-only** (no destructive delete, no in-place breaking redesign),
  is **backward-compatible** (N/N-1 coexistence), and is versioned. There exists **no** independent
  mutation, deletion, or rollback path outside the Evolution Fabric.
- **Verification Method.** All fabrics route durable change through the Evolution commit pipeline; a
  static/structural check confirms no fabric holds an independent write/rollback path, and keyspace
  write-guards confine mutation to allowlisted prefixes. Contract-compatibility tests verify additive/
  backward-compatible evolution; append-only assertions verify no ratified construct is deleted.
- **Failure Mode.** A construct mutated/deleted outside the Evolution Fabric; a breaking (non-backward-
  compatible) change admitted; a ratified construct removed; or a rollback performed via a bypass path.
  Detected by a write outside the allowlisted commit path, a compatibility-test failure, or a missing
  prior-version record.
- **Recovery Mode.** Fail-closed: out-of-band mutations are rejected at the write-guard; if one is detected
  post-hoc, it is quarantined and superseded by a governed forward migration (never a destructive rollback —
  the prior state is retained append-only). Breaking changes are refused and returned to contract-first
  redesign under Authority review.

---

## INV-CORE-06 — Knowledge Integrity
**Anchors:** `KNOW-*` (PI-7), AD-0020, provenance + certification-before-use.

- **Formal Statement.** ∀ knowledge item `k` used by a committed decision: `k` is (i) provenance-bound
  (origin recorded), (ii) certified/ratified before use, (iii) read-only to consumers (no consumer-side
  mutation), and (iv) classification-preserving. No uncertified or unprovenanced knowledge influences a
  committed decision; there is no back-door write into the knowledge store from a consuming fabric.
- **Verification Method.** Knowledge access is mediated read-only; each consumed item carries a resolvable
  provenance + certification reference validated at use; the decision's rationale chain (INV-CORE-09/audit)
  records exactly which knowledge items were consulted. Tests assert that uncertified knowledge is
  unusable and that consumers cannot write knowledge.
- **Failure Mode.** A committed decision citing uncertified/unprovenanced knowledge; a consumer mutating the
  knowledge store; or a classification downgrade on read. Detected by a use-time certification/provenance
  check failure or a rationale chain referencing an uncertified item.
- **Recovery Mode.** Fail-closed: uncertified/unprovenanced knowledge is refused at use and the dependent
  decision is denied; consumer-side write attempts are rejected. Corrupted or wrongly-certified knowledge is
  revoked (governed) and all decisions in its blast radius are flagged for re-evaluation via the Evolution
  Fabric; the tainted item is superseded append-only.

---

## INV-CORE-07 — Memory Integrity
**Anchors:** `MEM-*` (PI-9, design-ratified), MGP-3 (monotonic classification), audit-preserving forgetting, Evolution-only durable mutation.

- **Formal Statement.** ∀ memory recall `r`: `r` returns only stored, attributable content — recall **never
  synthesizes** new facts. Classification is **monotonic** across tiers (Working → … → Semantic/Episodic);
  a record's classification is never downgraded by promotion. Durable memory mutation (LTM promotion,
  consolidation, supersession, forgetting) occurs only via the Evolution Fabric, and **forgetting is
  audit-preserving**: the value becomes unrecallable while the audit fact of its existence and removal is
  retained.
- **Verification Method.** Recall paths are constrained to retrieval (no generative synthesis); a
  classification monotonicity check runs on every tier transition; forgetting operations assert the
  two-sided guard (value unrecallable ∧ audit fact retained). Cross-tier and reconciliation tests plus a
  memory adversarial suite (M1–M12) verify 0 residual High/High.
- **Failure Mode.** Recall returning synthesized/unattributable content; a classification downgrade on
  promotion; a durable memory change outside the Evolution Fabric; or a "forget" that also erases the audit
  fact (or leaves the value recallable). Detected by recall-provenance checks, a monotonicity violation, or
  a forgetting-guard assertion failure.
- **Recovery Mode.** Fail-closed: non-conformant recall is suppressed; a downgrade attempt is rejected and
  the higher classification retained; out-of-band memory mutation is blocked at the write-guard. A detected
  breach quarantines the affected memory region, restores from the last-verified audit-consistent state via
  Evolution, and escalates; the audit trail of the breach is preserved append-only.

---

## INV-CORE-08 — Ontology Integrity
**Anchors:** `ONTO-*` (PI-8, design-ratified), SI-1..SI-7 (semantic constraints), `INV-10` (migration-only).

- **Formal Statement.** ∀ ontology commit `c`: after `c`, the ontology graph satisfies all semantic
  integrity constraints — **referential integrity** (SI-1), **domain/range** conformance (SI-2), **taxonomy
  acyclicity / DAG** (SI-3), **disjointness** (SI-4), **uniqueness** (SI-5), and **non-contradiction** with
  precedence (SI-6/7). No commit leaves the graph in a semantically invalid or self-contradictory state.
- **Verification Method.** Pre-commit semantic validation runs SI-1..SI-7 against the proposed graph; the
  commit is applied atomically and **re-validated** post-apply (fail-closed on any violation). Taxonomy
  acyclicity is checked by cycle detection; disjointness/non-contradiction by constraint solving. Ontology
  mutation is Evolution-routed (INV-CORE-05) and migration-only.
- **Failure Mode.** A commit that introduces a dangling reference, a domain/range violation, a taxonomy
  cycle, a disjointness breach, a duplicate identity, or a contradiction. Detected by a pre-commit or
  post-apply SI-check failure.
- **Recovery Mode.** Fail-closed: the offending commit is **rejected atomically** (the graph never enters a
  violated state); the proposal returns for correction. A latent violation surfaced later (e.g., via a
  federated import) freezes semantic reads in the affected namespace, is corrected by a governed forward
  migration, and is escalated; imported foreign ontology that fails SI conformance is denied at the boundary
  (INV-CORE-04).

---

## INV-CORE-09 — Determinism Integrity
**Anchors:** `INV-6` (deterministic propagation), Intelligence/Simulation determinism quarantine, reproducibility-by-record.

- **Formal Statement.** ∀ committed decision `d`: `d = F(evidence(d))` is a **deterministic** function of
  recorded evidence — replaying `F` over the same recorded evidence reproduces `d` (`resultHash` equality).
  Non-deterministic/probabilistic inference is **quarantined**: it is advisory-only, sandboxed, and gated by
  a deterministic verifier before any committed effect. No committed decision depends directly on
  non-deterministic model output.
- **Verification Method.** Each decision records its evidence set and a `resultHash`; independent replay
  recomputes and compares. The quarantine boundary is verified structurally (non-deterministic outputs
  cannot reach the commit path except through a deterministic verifier) and by adversarial tests attempting
  to commit on ungated inference.
- **Failure Mode.** A decision that is not reproducible from its recorded evidence (`resultHash` mismatch);
  a committed effect traceable to ungated non-deterministic inference; or a forecast treated as a fact.
  Detected by replay divergence or a quarantine-boundary breach.
- **Recovery Mode.** Fail-closed: a non-reproducible decision is rejected/withheld from commit; ungated
  inference outputs are refused at the verifier. A detected commit on ungated inference is quarantined,
  reversed via Evolution, the quarantine gap closed, and the incident escalated. Forecasts remain advisory
  and never mutate governed state.

---

## INV-CORE-10 — Security-Control Integrity (Non-Waivable S1/S3/S4)
**Anchors:** `INV-2`, AUTH-008 (Security Canon), Constitution Art. XII, `SEC-CTL-001..020`.

- **Formal Statement.** ∀ exposed boundary `b`, ∀ tier/region/environment: **S1** (authentication +
  deny-by-default authorization), **S3** (secrets by reference; no secret material in code/config/artifacts),
  and **S4** (data protection — TLS 1.3 in transit, AES-256 at rest, classification-preserving) hold on `b`
  from the first commit. There is **no** waiver, permissive mode, dev-exempt posture, or "temporary"
  disablement of S1/S3/S4.
- **Verification Method.** `GATE-SEC-001` (design coverage) + runtime enforcement (mTLS STRICT rejects
  plaintext; PEP denies unauthenticated/unauthorized; secret-scanning rejects embedded material;
  encryption-at-rest verified). Every boundary is enumerated and mapped to ≥1 control; static + adversarial
  scans confirm no permissive path.
- **Failure Mode.** A boundary reachable without authentication; an authorization defaulting to allow; a
  secret embedded in code/config/artifact; plaintext transport accepted; or unencrypted/downgraded sensitive
  data. Detected by a gate failure, a secret-scan hit, a plaintext-accept, or a boundary with 0 mapped
  controls.
- **Recovery Mode.** Fail-closed: the non-conformant boundary is **blocked from admission/promotion**;
  detected secrets are treated as compromised (revoke + rotate immediately, Approval-Required for
  high-blast-radius keys); plaintext/downgrade is rejected at the transport layer. No environment operates in
  a violated S1/S3/S4 state; any exception is an Authority-Board matter and is prohibited in normal
  operations.

---

## INV-CORE-11 — Isolation & Contract Integrity
**Anchors:** `INV-1` (contract-first), `INV-3` (deny-by-default), `INV-5` (single system-of-record), `PEP-005`.

- **Formal Statement.** ∀ inter-service interaction: it occurs **only** via a published, versioned contract;
  there is **exactly one system-of-record per domain**; there is **no shared mutable model** across bounded
  contexts; and authorization is **deny-by-default**. Bounded-context boundaries are never crossed by direct
  shared state.
- **Verification Method.** Contract-first gates reject any integration lacking a ratified contract;
  ownership analysis confirms one SoR per domain and no cross-context shared mutable store; the acyclic
  dependency graph is validated; the PEP confirms deny-by-default at every boundary.
- **Failure Mode.** A direct (non-contract) integration; two systems-of-record for one domain; a shared
  mutable model spanning contexts; or an authorization defaulting to allow. Detected by a missing-contract
  gate failure, an ownership-conflict scan, or a shared-store detection.
- **Recovery Mode.** Fail-closed: the non-contract integration is **not** admitted; the interaction must be
  re-expressed through a ratified contract. A discovered dual-SoR or shared-mutable-model is quarantined and
  resolved by a governed migration to a single SoR + contract-mediated access; deny-by-default is restored
  at the boundary before traffic resumes.

---

## INV-CORE-12 — Non-Actuation Integrity
**Anchors:** Intelligence (`INT-*`), Simulation (`SIM-*`), Civilization (`CIV-*`) governance; propose-not-act; Evolution-only commit.

- **Formal Statement.** ∀ cognition/simulation/civilization fabric `f`: `f` may **propose/project only** and
  has **no autonomous actuation** — it holds no independent governed write path. Any effect from `f` reaches
  governed state exclusively through the standard pipeline (proposal → policy → constraints →
  certification → ratification → **Evolution commit**). No model, twin, scenario, or projection acts on the
  world directly.
- **Verification Method.** Structural verification that these fabrics expose no commit/write capability and
  run in sandboxes against pinned, signed snapshots (static write-guard on the sandbox keyspace); the commit
  path is reachable only via the governed pipeline. Adversarial "actuation boundary breach" tests must be
  structurally closed (0 residual High).
- **Failure Mode.** A cognition/simulation/civilization fabric mutating governed state directly; a projection
  materialized as fact without ratification; or a sandbox write escaping its scope. Detected by a
  write-guard rejection, a commit-path bypass, or an actuation-boundary adversarial hit.
- **Recovery Mode.** Fail-closed: direct actuation attempts are blocked at the write-guard and produce only
  rejected proposals + audit noise; any escaped effect is quarantined and reversed via Evolution, the breach
  path disabled, and the incident escalated. These fabrics remain advisory by construction.

---

## INV-CORE-13 — Identity Integrity
**Anchors:** `S1`, `SEC-CTL-001` (identity), Control-fabric identity runtime (PI-4), secrets-by-reference (`INV-11`).

- **Formal Statement.** ∀ principal `p` performing any action: `p` is authenticated with a verifiable,
  in-lifecycle identity (active — not suspended/retired), credentials are held **by reference** (never
  embedded), and privileged/administrative actions require elevated authentication (MFA). There is **no
  anonymous privileged action** and no action under a suspended/retired identity.
- **Verification Method.** The identity resolver authenticates every principal and checks lifecycle state at
  action time; credential verification is pluggable and reference-based (no secret material in code/config);
  administrative paths enforce MFA. Tests assert suspended/retired identities are denied and that no
  credential material appears in artifacts.
- **Failure Mode.** An action by an unauthenticated/anonymous principal; an action under a suspended/retired
  identity; embedded credential material; or a privileged action without elevated auth. Detected by an
  authn/lifecycle denial, a secret-scan hit, or an MFA-bypass on a privileged path.
- **Recovery Mode.** Fail-closed: the action is denied at authentication; suspended/retired identities cannot
  act; discovered embedded credentials are revoked + rotated and treated as compromised. A detected identity
  breach suspends the principal (governed), quarantines its effects for review, and escalates.

---

## INV-CORE-14 — Configuration & Metadata Integrity
**Anchors:** `IP-04` (configuration-driven), `PEP-001..003` (registry/metadata/config-first, no hard-coding), `INV-8`/`INV-13`, `WP-PLT-06`/`WP-PLT-11`.

- **Formal Statement.** ∀ platform behavior `β`: `β` is sourced from **registry + metadata + configuration**
  (schema-validated, versioned) and **never hard-coded**; new constructs enter via registration, metadata,
  configuration, composition, and federation — never foundation redesign (INV-13). Configuration is
  hierarchical and deterministically resolved; every configured/registered construct is schema-valid.
- **Verification Method.** Schema validation on every metadata/config record; registry-based discovery of
  runtime constructs; a "no-hard-coded-logic" test that introduces a new capability purely via descriptor +
  provider with **zero** core changes (as demonstrated in the substrate baseline). Deterministic config
  resolution (default → environment → instance) is verified by replay.
- **Failure Mode.** Behavior hard-coded rather than configured; an unschema-validated or unversioned
  metadata/config record accepted; a construct that cannot be registered/discovered at runtime; or a
  non-deterministic config resolution. Detected by a schema-validation failure, a hard-coding scan, or a
  registration/discovery gap.
- **Recovery Mode.** Fail-closed: invalid metadata/config records are rejected at ingress; hard-coded
  behavior is refused at review and returned to configuration-driven implementation; a construct that cannot
  be registered is not admitted. Config/registry corruption is restored from the Git-versioned + SoR-backed
  source of truth (GitOps), and the resolving service degrades to last-known-good (INV-CORE-below / static
  stability) until restored.

---

# SECTION 3 — CROSS-INVARIANT PROPERTIES

| Property | Guarantee | Realized by |
|----------|-----------|-------------|
| **Fail-closed everywhere** | Inability to prove any invariant halts/denies the affected operation. | Every invariant's Recovery Mode |
| **Static stability** | A control-plane/verification outage never forces a *violation*; the data plane serves last-known-good conformant state. | `INV-9`; INV-CORE-04/14 recovery |
| **Append-only correction** | Violations are corrected by forward migration; no destructive rollback, no evidence erasure. | INV-CORE-02/05/06/07 |
| **Independent verifiability** | Every invariant is reproducible from recorded evidence without trusting the component under test. | Audit reconstruction (INV-CORE-02); replay (INV-CORE-09) |
| **Non-collision with `INV-1..13`** | Canonical integrity invariants restate/enforce, never contradict, the foundation-permanence invariants. | Namespacing + anchor map (§4) |

---

# SECTION 4 — TRACEABILITY & COVERAGE

## 4.1 UA-05 directive coverage (8 named integrity domains)
| Named domain (directive) | Canonical invariant |
|--------------------------|---------------------|
| Authority Integrity | **INV-CORE-01** |
| Audit Integrity | **INV-CORE-02** |
| Lineage Integrity | **INV-CORE-03** |
| Federation Integrity | **INV-CORE-04** |
| Evolution Integrity | **INV-CORE-05** |
| Knowledge Integrity | **INV-CORE-06** |
| Memory Integrity | **INV-CORE-07** |
| Ontology Integrity | **INV-CORE-08** |

**Directive coverage: 8/8.** Extended constitutional-spine invariants added: INV-CORE-09..14 (Determinism,
Security S1/S3/S4, Isolation/Contract, Non-Actuation, Identity, Configuration/Metadata).

## 4.2 Anchor map (each invariant → governing source)
| Invariant | Primary anchors |
|-----------|-----------------|
| INV-CORE-01 Authority | AUTH-001..012; AUTH-009; AD-0009; INV-3 |
| INV-CORE-02 Audit | S6; FED-AUD-001; INV-10; PD-10 |
| INV-CORE-03 Lineage | IC-4; AUTH-010; TM-*; INV-1/INV-10 |
| INV-CORE-04 Federation | FED-GOV/SEC/PROV/AUD/ARCH-001; AD-0018; INV-1/INV-5 |
| INV-CORE-05 Evolution | AD-0019; INV-10; IP-14/IP-15; UCOS-SVC-POLICY-001 |
| INV-CORE-06 Knowledge | KNOW-*; AD-0020 |
| INV-CORE-07 Memory | MEM-*; MGP-3; AD-0019 (durable mutation) |
| INV-CORE-08 Ontology | ONTO-*; SI-1..SI-7; INV-10 |
| INV-CORE-09 Determinism | INV-6; INT/SIM determinism quarantine |
| INV-CORE-10 Security S1/S3/S4 | INV-2; AUTH-008; Const. Art. XII; SEC-CTL-001..020 |
| INV-CORE-11 Isolation/Contract | INV-1/INV-3/INV-5; PEP-005 |
| INV-CORE-12 Non-Actuation | INT-*/SIM-*/CIV-* governance; Evolution-only commit |
| INV-CORE-13 Identity | S1; SEC-CTL-001; INV-11 |
| INV-CORE-14 Config/Metadata | IP-04; PEP-001..003; INV-8/INV-13; WP-PLT-06/11 |

**Coverage integrity:** every invariant traces to ≥ 1 ratified Authority/Constitution/ADR/security/fabric
source; **0 orphan invariants**; **0 collisions** with `INV-1..13`.

---

# SECTION 5 — GOVERNANCE DISCIPLINE (this phase)

- No implementation · no infrastructure · no source/runtime change · no ADR/architecture/fabric modification
  · no registry/state mutation of frozen constructs · no lock release · no enrollment into the constitutional
  invariant set (that is an Authority-Board / AUTH-012 act). ✅
- Governed **definition** artifact only; subordinate to Authority, Constitution, Governance Baseline 1.0.0,
  and `UCOS-ASR-NFR-001`. ✅
- `INV-1..13` unaltered; Article IX generation lock unchanged; `UCOS-CONSTRUCTION-BLOCKED` unchanged;
  AD-0014 (Ω∞ deferral) preserved. ✅

## Validation (self-check)
| Check | Target | Observed | Result |
|-------|:------:|:--------:|:------:|
| 8 named integrity domains covered | 8 | 8 | ✅ |
| Each invariant has Formal Statement | 14/14 | 14/14 | ✅ |
| Each invariant has Verification Method | 14/14 | 14/14 | ✅ |
| Each invariant has Failure Mode | 14/14 | 14/14 | ✅ |
| Each invariant has Recovery Mode | 14/14 | 14/14 | ✅ |
| Every invariant is fail-closed | 14/14 | 14/14 | ✅ |
| Collision with `INV-1..13` | 0 | 0 | ✅ |
| Orphan invariants (no anchor) | 0 | 0 | ✅ |
| Frozen-construct / lock mutation | 0 | 0 | ✅ |

---

# SECTION 6 — DETERMINATION

> ## DEFINED — READY FOR AUTHORITY BOARD REVIEW
>
> `INV-CORE-001` v1.0.0 defines the **fourteen canonical platform invariants** of UCOS
> (`INV-CORE-01..14`), each with a Formal Statement, Verification Method, Failure Mode, and Recovery Mode,
> covering all eight UA-05-named integrity domains plus the constitutional spine. Every invariant is
> fail-closed, independently verifiable, and append-only correctable. This artifact **enacts and restates**
> existing Authority/Constitution/ADR/fabric guarantees; it enrolls nothing, mutates nothing, and releases
> no lock. Formal enrollment as constitutional invariants is reserved to the Authority Board (AUTH-009 /
> AUTH-012).

## Traceability
- **Refines / restates:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/X/XII), `UCOS-ASR-NFR-001` (INV-1..13),
  `AUTH-008` (S1/S3/S4), `SEC-CTL-001..020`, `FED-*` (AD-0018), `EVO`/Evolution Fabric (AD-0019), `KNOW-*`
  (AD-0020), `ONTO-*`, `MEM-*`, `INT-*`, `SIM-*`, `CIV-*`, `PEP-001..020`, `IP-04/IP-14/IP-15`, the `TM-*`
  traceability matrices, and `WP-PLT-06`/`WP-PLT-11`.
- **Refined by:** future Authority-Board enrollment (AUTH-012), per-fabric validation/ratification gates,
  and `GATE-QUAL-001`/`GATE-SEC-001`/`GATE-DOC-001` acceptance evaluation.
- **Owner:** UCOS Authority Board (canon); Platform Engineering & fabric owners (verification & enforcement).

**END `INV-CORE-001` — DETERMINATION: DEFINED · 14 CANONICAL INVARIANTS · 8/8 UA-05 DOMAINS COVERED · EACH WITH FORMAL STATEMENT / VERIFICATION / FAILURE / RECOVERY · FAIL-CLOSED · 0 COLLISION WITH INV-1..13 · NO ENROLLMENT · NO IMPLEMENTATION · NO LOCK RELEASE · NO FROZEN-CONSTRUCT MUTATION.**
