# UCOS-CAP-EVOLUTION-CONSTRUCTION-0000

| Field | Value |
|-------|-------|
| Spec ID | `UCOS-CAP-EVOLUTION-CONSTRUCTION-0000` |
| Capability | **CAP-EVOLUTION — Universal Evolution Fabric (Construction)** |
| Phase | **Requirements** |
| Status | **REQUIREMENTS — DRAFT** |
| Inputs | `design.md` (COMPLETE) |
| Requirements Count | FR=25, NFR=20, GR=20, DR=15, SR=15 (Total: 95) |
| Acceptance Criteria Count | AC=40 |
| Completion Criteria Count | CC=20 |
| Evidence Artifacts | 7 (`EV-CAP-EVO-DESIGN/IMP/TEST/AUDIT/RECON/TRACE/SEC`) |

> **Scope note.** Every requirement derives from and traces to the completed `design.md` and is
> consistent with UCOS canon: registry-driven single source of truth, no hardcoded commit logic,
> deterministic execution (`INV-6`), event sourcing, propose-not-act, deny-by-default, CAP-AUTHORITY
> authorization of every commit, PI-4 policy evaluation, append-only immutability (`AUTH-009` §6.6),
> migration-only evolution (`IP-14`), backward compatibility (`IP-15`), `AD-0009` external-actuation
> gating, single-writer commit, and hash-chained auditability. Requirements comprehensively cover the
> ten constructs (`EVO-C1..C10`), spine invariants (`S-E1..S-E10`), and engines (Intake, Compatibility
> Verifier, Migration, Commit, Compensation, Version Manager, Approval, Replay/Projection, Ledger).

---

## Functional Requirements

### Evolution Registry Management

#### FR-EVO-001
- **ID:** FR-EVO-001
- **Requirement:** THE Evolution_Registry SHALL persist every evolution construct (unit, change proposal, migration, commit record, compensating change, version record, policy, approval, event) as a metadata-backed record keyed as `evolution:<kind>:<id>`, such that the registry is the single authoritative source of truth for all change/version/migration state.
- **Rationale:** Registry-first design makes the Evolution Registry the single source of truth and prevents divergent or code-embedded change state (`INV-13`; registry rule 8).
- **Source Design Section:** §4 Registry Schema; §3 Domain Model.
- **Verification Method:** integration test (registry round-trip) + `evolution:*` keyspace review.

#### FR-EVO-002
- **ID:** FR-EVO-002
- **Requirement:** WHEN any evolution construct is registered, THE Evolution_Registry SHALL reject the registration IF the record lacks exactly one owner, a classification tag, a semantic version, or a resolvable Authority/Constitution source reference.
- **Rationale:** Single-owner, mandatory classification (S4), versioning (`IP-13`), and source traceability (`AUTH-010`) are canon invariants; records missing any are blocking gaps.
- **Source Design Section:** §4 Registry Schema (rules 1–3, 7).
- **Verification Method:** property-based test (reject missing owner/classification/version/source) + adversarial test.

### Proposal Intake & Admission

#### FR-EVO-003
- **ID:** FR-EVO-003
- **Requirement:** WHEN an EvolutionUnit is submitted, THE Proposal_Intake SHALL treat it as a governed proposal only and SHALL NOT mutate any governed state until an authorized, approved commit occurs.
- **Rationale:** Propose-not-act (`S-E2`) guarantees submission alone has no effect.
- **Source Design Section:** §2.3 governed loop; §7 API (`submit`); §4 (`admitEvolutionUnit`).
- **Verification Method:** property-based test (submission mutates no state) + integration test.

#### FR-EVO-004
- **ID:** FR-EVO-004
- **Requirement:** WHEN an EvolutionUnit is admitted, THE Proposal_Intake SHALL require a `CAP-AUTHORITY` decision of `Allow` for `commit` on the unit's `targetKeyspace`, SHALL reject the unit IF the requesting authority is revoked or halted, and SHALL reject any change proposal whose `operation` is `DELETE`.
- **Rationale:** Every commit is CAP-AUTHORITY-gated (`S-E10`), revocation/halt is non-bypassable, and append-only forbids DELETE (`S-E4`).
- **Source Design Section:** §4 (`admitEvolutionUnit`); §7.1 Commit API (step 0); §8 Governance.
- **Verification Method:** policy test + adversarial test (unauthorized commit, DELETE attempt).

#### FR-EVO-005
- **ID:** FR-EVO-005
- **Requirement:** WHEN any evolution action is requested, THE Proposal_Intake SHALL obtain an authorization decision from the PI-4 Control_Plane policy evaluator, and IF the decision is other than ALLOW THEN SHALL reject the action fail-closed with no state change and append an `EVO_PROPOSAL_REJECTED` event with reason `policy-deny`.
- **Rationale:** Deny-by-default requires explicit ALLOW; denial is recorded (`S-E3`).
- **Source Design Section:** §7.1 Commit API (step 1); §17 Error Handling.
- **Verification Method:** property-based test (no ALLOW ⇒ reject) + integration test against PI-4.

### Compatibility Verifier

#### FR-EVO-006
- **ID:** FR-EVO-006
- **Requirement:** WHEN an EvolutionUnit is evaluated, THE Compatibility_Verifier SHALL classify each change proposal as `ADDITIVE`, `BACKWARD_COMPATIBLE`, or `BREAKING`, and SHALL reject the unit fail-closed IF any proposal is `BREAKING` and the unit carries no resolvable `migrationRef`.
- **Rationale:** Migration-only evolution (`S-E5`, `IP-14`): breaking changes require a registered reversible migration.
- **Source Design Section:** §7.1 Commit API (step 2); §4 (`ChangeProposalRecord.compatibility`).
- **Verification Method:** property-based test (breaking ⇒ migration required) + adversarial test.

#### FR-EVO-007
- **ID:** FR-EVO-007
- **Requirement:** THE Compatibility_Verifier SHALL reject any change that would break an existing N-1 consumer contract within the configured `backwardCompatWindow` unless the change is additive or accompanied by a migration and deprecation window.
- **Rationale:** Backward compatibility (`S-E6`, `IP-15`): N/N-1 coexistence must be preserved.
- **Source Design Section:** §5 Config (`backwardCompatWindow`); §14 Migration Strategy.
- **Verification Method:** property-based test (N/N-1 coexistence) + integration test.

### Commit Engine

#### FR-EVO-008
- **ID:** FR-EVO-008
- **Requirement:** THE Commit_Engine SHALL be the single writer of governed state, such that no governed state changes except through a `commit`, and SHALL reject any attempt to mutate governed state outside the Evolution commit path.
- **Rationale:** Single-writer commit (`S-E1`) — Evolution is the sole governed write path.
- **Source Design Section:** §7.1 Commit API; §8 Governance (Single writer); §10 Property 1.
- **Verification Method:** property-based test (single writer) + adversarial test (direct-write bypass).

#### FR-EVO-009
- **ID:** FR-EVO-009
- **Requirement:** WHEN a commit is performed, THE Commit_Engine SHALL append the CommitRecord atomically to the Evolution_Ledger with a strictly increasing sequence and `hash = H(prevHash ‖ canonical(payload))`, and SHALL never delete or rewrite any prior committed record.
- **Rationale:** Append-only, atomic, hash-chained commit (`S-E4`, `S-E8`).
- **Source Design Section:** §6 Event Model; §7.1 Commit API (step 5); §10 Properties 4, 7.
- **Verification Method:** unit test (hash chain) + property-based test (append-only) + adversarial test (rewrite).

#### FR-EVO-010
- **ID:** FR-EVO-010
- **Requirement:** WHEN rendering a commit or migration outcome, THE Commit_Engine SHALL compute the result as a pure, side-effect-free function of recorded inputs and SHALL emit a `resultHash` such that identical inputs always reproduce an identical outcome and `resultHash`.
- **Rationale:** Determinism (`INV-6`, `S-E7`).
- **Source Design Section:** §7.1 Commit API (step 5); §16 Operational (determinism guarantee).
- **Verification Method:** property-based test (identical inputs ⇒ identical `resultHash`) + replay test.

#### FR-EVO-011
- **ID:** FR-EVO-011
- **Requirement:** IF a requested change would actuate a real-world (external) effect, THEN THE Commit_Engine SHALL return `Pending("AD-0009 approval required")` and SHALL NOT commit the change autonomously.
- **Rationale:** External-world change is `AD-0009` Approval-Required and never autonomous (`S-E10`; Property 10).
- **Source Design Section:** §7.1 Commit API (step 4); §8 Governance (No external actuation).
- **Verification Method:** integration test (`AD-0009` pending path) + adversarial test.

### Migration Engine

#### FR-EVO-012
- **ID:** FR-EVO-012
- **Requirement:** THE Migration_Engine SHALL admit a migration only IF it is versioned (`fromVersion` → a strictly higher `toVersion`), deterministic, and reversible via a registered `inverseTransformRef`.
- **Rationale:** Migration-only, forward-versioned, reversible transforms (`S-E5`, `IP-14`).
- **Source Design Section:** §4 (`MigrationRecord`); §13 W5.
- **Verification Method:** unit test (reversibility) + property-based test (forward version; determinism).

#### FR-EVO-013
- **ID:** FR-EVO-013
- **Requirement:** THE Migration_Engine SHALL provide additive, version-tagged upcasters such that historical events and records remain replayable to identical state after a migration, with no deletion or rewrite.
- **Rationale:** Backward-compatible replay of history (`S-E6`; §14 event stream evolution).
- **Source Design Section:** §14 Migration Strategy; §6.3 Projection.
- **Verification Method:** replay test (historical replay stable under upcasters) + property-based test.

### Version Manager

#### FR-EVO-014
- **ID:** FR-EVO-014
- **Requirement:** THE Version_Manager SHALL maintain SemVer lineage per artifact, SHALL supersede prior versions by link (never by deletion), and SHALL permit N and N-1 versions to coexist within the configured deprecation window.
- **Rationale:** SemVer lineage, supersede-not-delete, N/N-1 coexistence (`S-E6`, `IP-13`, `IP-15`).
- **Source Design Section:** §4 (`VersionRecord`); §13 W6.
- **Verification Method:** unit test (supersession link) + integration test (N/N-1 coexistence).

#### FR-EVO-015
- **ID:** FR-EVO-015
- **Requirement:** THE Version_Manager SHALL enforce version monotonicity such that a committed artifact version never decreases and a lower version is never re-committed over a higher committed version.
- **Rationale:** Version-monotonicity prevents destructive rollback (`S-E4`/`S-E6`).
- **Source Design Section:** §6.3 Projection (version-monotonic invariant); §10 Property 6.
- **Verification Method:** property-based test (monotonic version) + adversarial test (version rollback).

### Approval Manager & Separation of Duties

#### FR-EVO-016
- **ID:** FR-EVO-016
- **Requirement:** WHEN a change requires ratification, THE Approval_Manager SHALL enforce a Separation-of-Duties constraint (proposer ≠ approver ≠ committer) and a quorum at least equal to the configured `quorumFloor`, and IF quorum is not met THEN SHALL return `Pending("quorum-not-met")`.
- **Rationale:** SoD + quorum so no single actor unilaterally effects a change (`S-E3`; Property 9).
- **Source Design Section:** §7 API (`requestApproval`); §7.1 (step 3); §8 Governance.
- **Verification Method:** policy test (role distinctness; quorum floor) + adversarial test (collusion, quorum evasion).

#### FR-EVO-017
- **ID:** FR-EVO-017
- **Requirement:** WHEN a change actuates an external-world effect, THE Approval_Manager SHALL escalate it to `AD-0009` Board approval via an `EVO_APPROVAL_PENDING_AD0009` event and SHALL NOT auto-execute.
- **Rationale:** External actuation escalation is Approval-Required (`AD-0009`).
- **Source Design Section:** §7.1 (step 4); §8.1 Decision-rights.
- **Verification Method:** integration test (AD-0009 pending) + adversarial test.

### Compensation Engine

#### FR-EVO-018
- **ID:** FR-EVO-018
- **Requirement:** WHEN a committed change must be reversed, THE Compensation_Engine SHALL create a governed forward-only CompensatingChange that inverts the prior commit as a new append-only commit, and SHALL NOT delete or edit the original committed record.
- **Rationale:** Reversibility by compensation only; append-only preserved (`S-E9`, `S-E4`; Property 8).
- **Source Design Section:** §7.2 Compensation API; §6.2 Compensation event.
- **Verification Method:** unit test (inverse commit) + property-based test (reversibility) + adversarial test (destructive rollback).

### Ledger & Event Sourcing

#### FR-EVO-019
- **ID:** FR-EVO-019
- **Requirement:** THE Evolution_Ledger SHALL append events in hash-chained, genesis-anchored order per stream, and THE Replay_Engine SHALL reconstruct governed state deterministically by ordered replay, halting fail-closed on any `prevHash`/`hash` mismatch and flagging tamper.
- **Rationale:** Tamper-evident, deterministic replay; chain-break detection (`S-E7`, `S-E8`; Property 7).
- **Source Design Section:** §6 Event Model; §6.3 Projection.
- **Verification Method:** unit test (append + replay) + property-based test (deterministic replay) + adversarial test (chain tamper).

#### FR-EVO-020
- **ID:** FR-EVO-020
- **Requirement:** THE Replay_Engine SHALL expose read-only projection queries (`projectState`, `getCommit`, `currentVersion`, `coexistingVersions`) that derive from the ledger and mutate no state.
- **Rationale:** State is a projection; reads never mutate (event sourcing).
- **Source Design Section:** §7 API (read-only functions); §6.3.
- **Verification Method:** unit test (query derives from stream; no mutation) + integration test.

### Federation, Additivity & Composition

#### FR-EVO-021
- **ID:** FR-EVO-021
- **Requirement:** THE Evolution_Fabric SHALL commit governed changes exclusively through its own Commit Engine (single write path) and SHALL expose no alternate write path to any fabric or federated node.
- **Rationale:** Single-writer commit; no alternate path (`S-E1`).
- **Source Design Section:** §8 Governance (Single writer); §10 Property 1.
- **Verification Method:** integration test (no alternate write path) + adversarial test (direct write / cross-node auto-commit).

#### FR-EVO-022
- **ID:** FR-EVO-022
- **Requirement:** THE Evolution_Fabric SHALL treat replicated foreign commits as advisory-only and deny-only, namespace-isolated (`evolution:federation:<nodeId>:*`), trust-clamped, local-shadows-foreign, and SHALL fail closed on partition with no cross-node auto-commit.
- **Rationale:** Federation-safe replication; local sovereignty; fail-closed partition.
- **Source Design Section:** §16 Operational (Federation); §13 W9.
- **Verification Method:** integration test (advisory/deny-only; partition fail-closed) + adversarial test (cross-node auto-commit).

#### FR-EVO-023
- **ID:** FR-EVO-023
- **Requirement:** THE Evolution_Fabric SHALL admit a new consuming fabric's governed write path by instance registration (register-then-migrate) with zero prohibited-core-dir change and zero `AUTH-001..012` amendment.
- **Rationale:** Infinite extensibility by registration, not code change (`INV-13`; additivity `G-2`).
- **Source Design Section:** §9 Dependency Graph; §14 Migration Strategy; §10 Property 12.
- **Verification Method:** integration test (onboarding, 0 core-dir change) + directory gate.

#### FR-EVO-024
- **ID:** FR-EVO-024
- **Requirement:** THE Evolution_Fabric SHALL resolve every commit-admissibility rule, migration transform, and version policy from the registry, such that no unregistered rule/migration/policy is ever honored and no commit logic is hardcoded.
- **Rationale:** Registry-driven, no hardcoding (`IP-04`, `IP-05`).
- **Source Design Section:** §4 (rule 4); §5 Config.
- **Verification Method:** unit test (unregistered rule not honored) + review.

#### FR-EVO-025
- **ID:** FR-EVO-025
- **Requirement:** THE Evolution_Fabric construction SHALL be additive-only — confined to `src/control/evolution/*` and the `evolution:*` keyspace — preserving the existing baseline green (0 regressions) and never inverting a higher `PCAMG-0008` layer.
- **Rationale:** Additivity + non-inversion (`G-1..G-5`, `G-2`; Property 11/12).
- **Source Design Section:** §2.4 Boundaries; §10 Properties 11, 12.
- **Verification Method:** baseline regression test (0 regressions) + directory + non-inversion test.

---

## Non-Functional Requirements

#### NFR-EVO-001
- **ID:** NFR-EVO-001
- **Requirement:** THE Evolution_Fabric SHALL guarantee deterministic replay such that the same ledger yields identical governed state across runs and hosts.
- **Rationale:** Determinism (`INV-6`, `S-E7`).
- **Source Design Section:** §6.3; §16.
- **Verification Method:** property-based test (≥100 iterations).

#### NFR-EVO-002
- **ID:** NFR-EVO-002
- **Requirement:** THE Commit_Engine SHALL exhibit bounded commit-path latency (quantitative target `PENDING ASR RATIFICATION`, N-1); qualitative bounded behavior SHALL be verified now.
- **Rationale:** Bounded, non-unbounded latency; ASR values deferred (OI-4).
- **Source Design Section:** §16; §19 OI-4.
- **Verification Method:** performance harness (bounded behavior).

#### NFR-EVO-003
- **ID:** NFR-EVO-003
- **Requirement:** THE Evolution_Ledger SHALL support append-only per-stream partitioning/throughput scaling (quantitative target `PENDING ASR RATIFICATION`, N-1).
- **Rationale:** Scalable append-only ledger; ASR deferred (OI-4).
- **Source Design Section:** §16; §19 OI-4.
- **Verification Method:** scalability harness (per-stream scaling).

#### NFR-EVO-004
- **ID:** NFR-EVO-004
- **Requirement:** THE Evolution_Fabric SHALL fail closed on federation partition, denying all foreign commits with no cross-node auto-commit.
- **Rationale:** Partition safety; local sovereignty.
- **Source Design Section:** §16 (Federation).
- **Verification Method:** integration test (partition fail-closed).

#### NFR-EVO-005
- **ID:** NFR-EVO-005
- **Requirement:** THE Evolution_Fabric SHALL be fail-closed on any admission gate: any missing/failed gate results in rejection with no state change.
- **Rationale:** Fail-closed discipline.
- **Source Design Section:** §16 (Failure handling); §17.
- **Verification Method:** property-based test (any missing gate ⇒ reject).

#### NFR-EVO-006
- **ID:** NFR-EVO-006
- **Requirement:** THE Evolution_Fabric SHALL support recovery of governed state solely by deterministic replay and governed compensating commits, with no in-place edit/delete.
- **Rationale:** Reconciliation/recovery discipline (`S-E9`).
- **Source Design Section:** §16 (Recovery); §7.2.
- **Verification Method:** reconciliation harness (replay recovery; compensation-only).

#### NFR-EVO-007
- **ID:** NFR-EVO-007
- **Requirement:** THE Evolution_Fabric SHALL produce an independently replayable, offline-verifiable audit trail.
- **Rationale:** Offline audit replay (S6, `AUTH-010`).
- **Source Design Section:** §16 (Auditability); §11 EV-CAP-EVO-AUDIT.
- **Verification Method:** offline replay proof.

#### NFR-EVO-008
- **ID:** NFR-EVO-008
- **Requirement:** THE Replay_Engine read models SHALL derive strictly from the ledger and SHALL mutate no state.
- **Rationale:** Query/command separation.
- **Source Design Section:** §7 API; §6.3.
- **Verification Method:** unit test (no mutation on read).

#### NFR-EVO-009
- **ID:** NFR-EVO-009
- **Requirement:** THE Evolution_Fabric SHALL enforce monotonic classification across projections/exports (never declassify).
- **Rationale:** Classification monotonicity (S4).
- **Source Design Section:** §18 (S4).
- **Verification Method:** property-based test (monotonic classification).

#### NFR-EVO-010
- **ID:** NFR-EVO-010
- **Requirement:** THE Evolution_Fabric SHALL honor only registry-resolved rules/migrations/policies (no hardcoded commit behavior).
- **Rationale:** Registry-driven (`IP-04`).
- **Source Design Section:** §4 (rule 4).
- **Verification Method:** unit test + review.

#### NFR-EVO-011
- **ID:** NFR-EVO-011
- **Requirement:** THE Evolution_Fabric SHALL remain platform-independent (technology-neutral); no technology/vendor selection in the specification.
- **Rationale:** `PEP-010` Platform Independence.
- **Source Design Section:** Governing discipline header.
- **Verification Method:** leakage scan (0 technology selection).

#### NFR-EVO-012
- **ID:** NFR-EVO-012
- **Requirement:** THE Evolution_Fabric SHALL preserve behavior when onboarding an existing write path (behaviour-preservation under register-then-migrate).
- **Rationale:** Non-destructive onboarding.
- **Source Design Section:** §14; §15.4.
- **Verification Method:** integration test (behaviour-preservation).

#### NFR-EVO-013
- **ID:** NFR-EVO-013
- **Requirement:** THE Evolution_Fabric SHALL enforce non-waivable configuration floors (`denyByDefault`, `appendOnly`, `migrationOnly`, `externalActuationGate=AD-0009`, `authorityGatedCommit`, `singleWriterCommit`, `deterministicReplay`).
- **Rationale:** Configuration floors (non-waivable).
- **Source Design Section:** §5 Config; §18.
- **Verification Method:** property-based test (floor relaxation rejected).

#### NFR-EVO-014
- **ID:** NFR-EVO-014
- **Requirement:** THE Evolution_Fabric SHALL guarantee that a committed record has exactly one owner and one committing authority.
- **Rationale:** Single-owner + single-committer accountability.
- **Source Design Section:** §4 (rule 1); §7.1.
- **Verification Method:** property-based test (single owner/committer).

#### NFR-EVO-015
- **ID:** NFR-EVO-015
- **Requirement:** THE Evolution_Fabric SHALL detect ledger tamper (chain break) and halt replay fail-closed.
- **Rationale:** Tamper-evidence (`S-E8`).
- **Source Design Section:** §6.3; §17 (Chain break).
- **Verification Method:** unit test + adversarial test (chain tamper).

#### NFR-EVO-016
- **ID:** NFR-EVO-016
- **Requirement:** THE Evolution_Fabric SHALL provide additive, version-tagged event upcasters preserving replayability with no delete/rewrite.
- **Rationale:** Backward-compatible event evolution (`S-E6`).
- **Source Design Section:** §14 (event stream evolution).
- **Verification Method:** replay test (upcaster stability).

#### NFR-EVO-017
- **ID:** NFR-EVO-017
- **Requirement:** THE Evolution_Fabric SHALL maintain full lineage from requirements → constructs → contracts → events → tests with 0 orphans.
- **Rationale:** Traceability (`AUTH-010`).
- **Source Design Section:** §20; §11 EV-CAP-EVO-TRACE.
- **Verification Method:** traceability/coverage validation.

#### NFR-EVO-018
- **ID:** NFR-EVO-018
- **Requirement:** THE Evolution_Fabric SHALL be governance-subordinate: it amends no `AUTH-001..012` and defers all external actuation to `AD-0009`.
- **Rationale:** Governance subordination (`G-2`, `AUTH-009` §6.6).
- **Source Design Section:** §8; §19.
- **Verification Method:** design review (no `AUTH-*` amendment).

#### NFR-EVO-019
- **ID:** NFR-EVO-019
- **Requirement:** THE Evolution_Fabric SHALL apply a keyspace commit-freeze (halt) fail-closed when the target keyspace is halted by CAP-AUTHORITY, resumable only by a distinct authority.
- **Rationale:** Emergency control; SoD on resume.
- **Source Design Section:** §16 (Emergency control).
- **Verification Method:** integration test (halt freeze; distinct resume).

#### NFR-EVO-020
- **ID:** NFR-EVO-020
- **Requirement:** THE Evolution_Fabric construction SHALL keep the existing platform-runtime baseline green (0 regressions) at every wave boundary (additivity gate).
- **Rationale:** Additivity gate.
- **Source Design Section:** §2.4; §10 Property 12.
- **Verification Method:** baseline regression test (0 regressions).

---

## Governance Requirements

#### GR-EVO-001
- **ID:** GR-EVO-001
- **Requirement:** THE Evolution_Fabric SHALL terminate all governance escalation at the singular Authority Board apex (`AA-0`), instantiating no competing apex.
- **Rationale:** Single apex preserved.
- **Source Design Section:** §8; §9.
- **Verification Method:** closure review.

#### GR-EVO-002
- **ID:** GR-EVO-002
- **Requirement:** THE Evolution_Registry SHALL be the single source of truth; runtime SHALL NOT cache governed state without a projection from the ledger.
- **Rationale:** Registry/ledger authority (rule 8).
- **Source Design Section:** §4 (rule 8); §6.3.
- **Verification Method:** integration test (no uninvalidated cache).

#### GR-EVO-003
- **ID:** GR-EVO-003
- **Requirement:** THE Evolution_Fabric SHALL invoke PI-4 policy evaluation on every governed commit path.
- **Rationale:** Deny-by-default policy host (PI-4).
- **Source Design Section:** §7.1 (step 1); §9.
- **Verification Method:** integration test (policy invoked on every path).

#### GR-EVO-004
- **ID:** GR-EVO-004
- **Requirement:** THE Evolution_Fabric SHALL be the sole commit path and SHALL route every governed mutation through its own Commit Engine (no independent write path anywhere in UCOS).
- **Rationale:** Sole commit path (`S-E1`; `evolutionOnlyCommit`).
- **Source Design Section:** §8; §10 Property 1.
- **Verification Method:** integration test (no alternate write path).

#### GR-EVO-005
- **ID:** GR-EVO-005
- **Requirement:** THE Evolution_Fabric SHALL gate every external-world change behind `AD-0009` Board approval and never auto-execute it.
- **Rationale:** External actuation gate.
- **Source Design Section:** §7.1 (step 4); §8.1.
- **Verification Method:** integration test (AD-0009) + adversarial test.

#### GR-EVO-006
- **ID:** GR-EVO-006
- **Requirement:** THE Evolution_Fabric SHALL enforce deny-by-default across all governed operations.
- **Rationale:** Deny-by-default (`S-E3`).
- **Source Design Section:** §8; §10 Property (deny).
- **Verification Method:** property-based test (deny-by-default).

#### GR-EVO-007
- **ID:** GR-EVO-007
- **Requirement:** THE Evolution_Fabric SHALL treat every submission as propose-not-act, mutating no state prior to an approved commit.
- **Rationale:** Propose-not-act (`S-E2`).
- **Source Design Section:** §2.3; §7.
- **Verification Method:** property-based test (propose-not-act).

#### GR-EVO-008
- **ID:** GR-EVO-008
- **Requirement:** THE Evolution_Fabric SHALL require every commit to be authorized by a `CAP-AUTHORITY` decision (`decide = Allow`).
- **Rationale:** Authority-gated commit (`S-E10`).
- **Source Design Section:** §7.1 (step 0); §8.
- **Verification Method:** integration test (CAP-AUTHORITY gate) + adversarial test.

#### GR-EVO-009
- **ID:** GR-EVO-009
- **Requirement:** THE Evolution_Fabric SHALL enforce append-only immutability — no committed record may be deleted or rewritten; corrections occur only via governed compensating commits.
- **Rationale:** Append-only (`S-E4`, `AUTH-009` §6.6).
- **Source Design Section:** §7.2; §8; §10 Property 4.
- **Verification Method:** property-based test (append-only) + adversarial test (delete/rewrite).

#### GR-EVO-010
- **ID:** GR-EVO-010
- **Requirement:** THE Evolution_Fabric SHALL enforce Separation of Duties (proposer ≠ approver ≠ committer) and quorum for every ratified change.
- **Rationale:** SoD + quorum (`S-E3`).
- **Source Design Section:** §7.1 (step 3); §8.
- **Verification Method:** property-based test (role distinctness) + adversarial test (collusion).

#### GR-EVO-011
- **ID:** GR-EVO-011
- **Requirement:** THE Evolution_Fabric SHALL enforce migration-only evolution: every breaking change requires a registered, reversible, versioned migration.
- **Rationale:** Migration-only (`S-E5`, `IP-14`).
- **Source Design Section:** §7.1 (step 2); §13 W5.
- **Verification Method:** property-based test (breaking ⇒ migration) + adversarial test.

#### GR-EVO-012
- **ID:** GR-EVO-012
- **Requirement:** THE Evolution_Fabric SHALL never invert a higher `PCAMG-0008` layer; a lower-layer commit that would hold/grant power over a higher layer SHALL be rejected.
- **Rationale:** Non-inversion (`G-1..G-5`).
- **Source Design Section:** §2.4; §10 Property 11.
- **Verification Method:** property-based test (non-inversion) + adversarial test (layer inversion).

#### GR-EVO-013
- **ID:** GR-EVO-013
- **Requirement:** THE Evolution_Fabric SHALL guarantee deterministic commit/migration/replay as pure functions of recorded inputs.
- **Rationale:** Determinism governance (`INV-6`).
- **Source Design Section:** §7.1; §6.3.
- **Verification Method:** property-based test (determinism).

#### GR-EVO-014
- **ID:** GR-EVO-014
- **Requirement:** THE Evolution_Fabric SHALL resolve all rules/migrations/policies from the registry (no hardcoded governance).
- **Rationale:** Registry-driven governance (`IP-04/05`).
- **Source Design Section:** §4 (rule 4).
- **Verification Method:** unit test + review.

#### GR-EVO-015
- **ID:** GR-EVO-015
- **Requirement:** THE Evolution_Fabric SHALL record full traceability for every governed change (`AUTH-010`), with 0 orphans.
- **Rationale:** Traceability governance.
- **Source Design Section:** §20; §11 TRACE.
- **Verification Method:** traceability validation.

#### GR-EVO-016
- **ID:** GR-EVO-016
- **Requirement:** THE Evolution_Fabric SHALL version every construct (SemVer) and evolve only by recorded, reversible migration (no destructive in-place edit).
- **Rationale:** Versioning + migration governance (`IP-13/14`).
- **Source Design Section:** §4; §14.
- **Verification Method:** unit test (versioned) + integration test (migration).

#### GR-EVO-017
- **ID:** GR-EVO-017
- **Requirement:** THE Evolution_Fabric SHALL escalate external-actuation approvals with an auditable `EVO_APPROVAL_PENDING_AD0009` event.
- **Rationale:** Auditable external escalation.
- **Source Design Section:** §6.1; §7.1 (step 4).
- **Verification Method:** integration test (escalation event).

#### GR-EVO-018
- **ID:** GR-EVO-018
- **Requirement:** THE Evolution_Fabric SHALL produce all 7 `EV-CAP-EVO-*` evidence artifacts, integrity-verifiable and accepted at closure.
- **Rationale:** Evidence governance (`OP-CERT-001`).
- **Source Design Section:** §11; §12.
- **Verification Method:** evidence acceptance review.

#### GR-EVO-019
- **ID:** GR-EVO-019
- **Requirement:** THE Evolution_Fabric closure SHALL require the fail-closed conjunction of all completion criteria (`CC-EVO-001..020`).
- **Rationale:** Closure governance.
- **Source Design Section:** §12.
- **Verification Method:** completion-criteria report + Board closure review.

#### GR-EVO-020
- **ID:** GR-EVO-020
- **Requirement:** THE Evolution_Fabric construction SHALL preserve additivity — 0 prohibited-core-dir change, 0 `AUTH-001..012` amendment, baseline green — at every wave boundary.
- **Rationale:** Additivity governance (`G-2`).
- **Source Design Section:** §2.4; §13.
- **Verification Method:** additivity gate (directory + baseline).

---

## Data Requirements

#### DR-EVO-001
- **ID:** DR-EVO-001
- **Requirement:** THE Evolution_Fabric SHALL use the `evolution:<kind>:<id>` keyspace convention for all constructs.
- **Rationale:** Keyspace convention (rule; `INV-13`).
- **Source Design Section:** §4.
- **Verification Method:** review + integration test.

#### DR-EVO-002
- **ID:** DR-EVO-002
- **Requirement:** THE `EvolutionUnitRecord` SHALL carry `id, targetKeyspace, ownerRef, proposedBy, changeSet, migrationRef?, version, sourceRef, classification, status`.
- **Rationale:** Unit schema (`EVO-C1`).
- **Source Design Section:** §4 (`EvolutionUnitRecord`).
- **Verification Method:** schema conformance test.

#### DR-EVO-003
- **ID:** DR-EVO-003
- **Requirement:** THE `ChangeProposalRecord` SHALL carry `id, unitRef, operation ∈ {CREATE,UPDATE,SUPERSEDE}, targetRef, payloadHash, compatibility`.
- **Rationale:** Proposal schema; no DELETE (`EVO-C2`, `S-E4`).
- **Source Design Section:** §4 (`ChangeProposalRecord`).
- **Verification Method:** schema conformance + adversarial (DELETE rejected).

#### DR-EVO-004
- **ID:** DR-EVO-004
- **Requirement:** THE `MigrationRecord` SHALL carry `id, fromVersion, toVersion (higher), transformRef, reversible=TRUE, inverseTransformRef`.
- **Rationale:** Migration schema (`EVO-C3`).
- **Source Design Section:** §4 (`MigrationRecord`).
- **Verification Method:** schema conformance test.

#### DR-EVO-005
- **ID:** DR-EVO-005
- **Requirement:** THE `VersionRecord` SHALL carry `id, artifactRef, semver, supersedes?, deprecationWindow?`.
- **Rationale:** Version schema (`EVO-C6`).
- **Source Design Section:** §4 (`VersionRecord`).
- **Verification Method:** schema conformance test.

#### DR-EVO-006
- **ID:** DR-EVO-006
- **Requirement:** THE `EvolutionPolicyRecord` SHALL carry `id, ruleRef, evaluatorRef, denyByDefault=TRUE, version`.
- **Rationale:** Policy schema (`EVO-C7`).
- **Source Design Section:** §4 (`EvolutionPolicyRecord`).
- **Verification Method:** schema conformance test.

#### DR-EVO-007
- **ID:** DR-EVO-007
- **Requirement:** THE `CompensatingChangeRecord` SHALL carry `id, targetCommitRef, inverseOf, reason, forwardOnly=TRUE`.
- **Rationale:** Compensation schema (`EVO-C5`, `S-E9`).
- **Source Design Section:** §4 (`CompensatingChangeRecord`).
- **Verification Method:** schema conformance test.

#### DR-EVO-008
- **ID:** DR-EVO-008
- **Requirement:** THE `EvolutionEvent` SHALL carry `eventId, streamId, sequence, prevHash, hash, type, payload, actor, unitRef, resultHash, timestamp, classification`.
- **Rationale:** Event schema (`EVO-C9`).
- **Source Design Section:** §6.1.
- **Verification Method:** schema conformance test.

#### DR-EVO-009
- **ID:** DR-EVO-009
- **Requirement:** THE `CommitRecord` SHALL carry `id, unitRef, prevHash, hash, committedBy` and a strictly increasing sequence.
- **Rationale:** Commit schema (`EVO-C4`).
- **Source Design Section:** §6.1; §7.1.
- **Verification Method:** schema + hash-chain test.

#### DR-EVO-010
- **ID:** DR-EVO-010
- **Requirement:** THE hash chain SHALL satisfy `hash = H(prevHash ‖ canonical(payload))` with a deterministic canonical encoding.
- **Rationale:** Tamper-evident chain (`S-E8`).
- **Source Design Section:** §6; §7.1.
- **Verification Method:** property-based test (hash integrity).

#### DR-EVO-011
- **ID:** DR-EVO-011
- **Requirement:** THE Evolution_Fabric SHALL record commit provenance (`proposedBy`, `committedBy`) for every change, never self-committed.
- **Rationale:** Provenance + no-self-commit.
- **Source Design Section:** §4 (`admitEvolutionUnit`); §6.
- **Verification Method:** unit test + adversarial (self-commit rejected).

#### DR-EVO-012
- **ID:** DR-EVO-012
- **Requirement:** THE projection SHALL derive governed state deterministically from the ledger with monotonic version and append-only invariants asserted at each event.
- **Rationale:** Projection data model (`EVO-C10`).
- **Source Design Section:** §6.3.
- **Verification Method:** replay test (invariants at each event).

#### DR-EVO-013
- **ID:** DR-EVO-013
- **Requirement:** THE Evolution_Fabric SHALL emit decision/commit audit events with reason and `resultHash`.
- **Rationale:** Audit data model.
- **Source Design Section:** §6.1; §16.
- **Verification Method:** unit test (audit emission).

#### DR-EVO-014
- **ID:** DR-EVO-014
- **Requirement:** THE Evolution_Fabric SHALL reconcile ledger commits against the `AUTH-012` decision ledger for governed-change lineage.
- **Rationale:** Reconciliation data model (`EV-CAP-EVO-RECON`).
- **Source Design Section:** §11 RECON; §16.
- **Verification Method:** reconciliation harness.

#### DR-EVO-015
- **ID:** DR-EVO-015
- **Requirement:** THE Evolution_Fabric SHALL carry inherited classification on every record and event, monotonic on projection/export.
- **Rationale:** Classification data model (S4).
- **Source Design Section:** §18 (S4).
- **Verification Method:** property-based test (monotonic classification).

---

## Security Requirements

#### SR-EVO-001
- **ID:** SR-EVO-001
- **Requirement:** THE Evolution_Fabric SHALL evaluate authorization deny-by-default via CAP-AUTHORITY + PI-4 before any commit.
- **Rationale:** S1 authorization.
- **Source Design Section:** §18 (S1); §7.1.
- **Verification Method:** policy test.

#### SR-EVO-002
- **ID:** SR-EVO-002
- **Requirement:** THE Evolution_Fabric SHALL require an authenticated actor for every submit/commit/compensate/approve request, rejecting unauthenticated requests fail-closed.
- **Rationale:** S1 authentication.
- **Source Design Section:** §18 (S1); §7.1 (preconditions).
- **Verification Method:** adversarial test (unauthenticated rejected).

#### SR-EVO-003
- **ID:** SR-EVO-003
- **Requirement:** THE Evolution_Fabric SHALL deny commits absent explicit ALLOW and emit `EVO_PROPOSAL_REJECTED`.
- **Rationale:** Deny-by-default security floor.
- **Source Design Section:** §7.1 (step 1); §17.
- **Verification Method:** property-based test.

#### SR-EVO-004
- **ID:** SR-EVO-004
- **Requirement:** THE Evolution_Fabric SHALL reject direct-write bypass attempts (mutating governed state outside the Commit Engine).
- **Rationale:** Single-writer security (`S-E1`).
- **Source Design Section:** §8; §15.3.
- **Verification Method:** adversarial test (direct-write bypass).

#### SR-EVO-005
- **ID:** SR-EVO-005
- **Requirement:** THE Evolution_Fabric SHALL reference signing keys by reference only (no embedded key material) and use PI-5 Ed25519 assertions (no custom cryptography).
- **Rationale:** S3 secrets/keys.
- **Source Design Section:** §18 (S3).
- **Verification Method:** security-conformance test (no embedded keys; no custom crypto).

#### SR-EVO-006
- **ID:** SR-EVO-006
- **Requirement:** THE Evolution_Fabric SHALL detect ledger tamper (prevHash/hash mismatch) and halt replay fail-closed, flagging tamper.
- **Rationale:** Tamper-evidence security (`S-E8`).
- **Source Design Section:** §6.3; §17.
- **Verification Method:** adversarial test (chain tamper).

#### SR-EVO-007
- **ID:** SR-EVO-007
- **Requirement:** THE Evolution_Fabric SHALL use a deterministic canonical encoding for hash input (reproducible across hosts).
- **Rationale:** Deterministic hashing security.
- **Source Design Section:** §6; §7.1.
- **Verification Method:** property-based test (canonical encoding).

#### SR-EVO-008
- **ID:** SR-EVO-008
- **Requirement:** THE Evolution_Fabric SHALL preserve append-only storage — no delete/rewrite path exists in any code path.
- **Rationale:** Append-only security (`S-E4`).
- **Source Design Section:** §7.2; §8.
- **Verification Method:** adversarial test (delete/rewrite) + review.

#### SR-EVO-009
- **ID:** SR-EVO-009
- **Requirement:** THE Evolution_Fabric SHALL reject self-committed and unauthorized-provenance units fail-closed.
- **Rationale:** Provenance integrity security.
- **Source Design Section:** §4 (`admitEvolutionUnit`).
- **Verification Method:** adversarial test (self-commit).

#### SR-EVO-010
- **ID:** SR-EVO-010
- **Requirement:** THE Evolution_Fabric SHALL provide an independently verifiable, offline-replayable audit trail (S6).
- **Rationale:** Audit security (S6).
- **Source Design Section:** §16; §11 AUDIT.
- **Verification Method:** offline replay proof.

#### SR-EVO-011
- **ID:** SR-EVO-011
- **Requirement:** THE Evolution_Fabric SHALL honor revocation/halt supremacy from CAP-AUTHORITY, rejecting commits by revoked/halted committers at every point.
- **Rationale:** Revocation/halt supremacy security.
- **Source Design Section:** §7.1 (step 0).
- **Verification Method:** adversarial test (revoked/halted commit).

#### SR-EVO-012
- **ID:** SR-EVO-012
- **Requirement:** THE Evolution_Fabric SHALL freeze commits fail-closed under a keyspace halt and require a distinct authority to resume.
- **Rationale:** Emergency-halt security (SoD).
- **Source Design Section:** §16 (Emergency control).
- **Verification Method:** adversarial test (halt bypass) + policy test (distinct resume).

#### SR-EVO-013
- **ID:** SR-EVO-013
- **Requirement:** THE Evolution_Fabric SHALL enforce distinct SoD roles (proposer/approver/committer) and reject collusion/quorum-evasion.
- **Rationale:** SoD security (`S-E3`).
- **Source Design Section:** §7.1 (step 3).
- **Verification Method:** adversarial test (collusion, quorum evasion).

#### SR-EVO-014
- **ID:** SR-EVO-014
- **Requirement:** THE Evolution_Fabric SHALL enforce non-waivable security/config floors (S1/S3/S4 + commit floors) rejecting any relaxation.
- **Rationale:** Non-waivable floors security.
- **Source Design Section:** §5 Config; §18.
- **Verification Method:** property-based test (floor enforcement).

#### SR-EVO-015
- **ID:** SR-EVO-015
- **Requirement:** THE Evolution_Fabric SHALL reject any commit that inverts a higher `PCAMG-0008` layer (non-inversion), fail-closed.
- **Rationale:** Non-inversion security (`G-1..G-5`).
- **Source Design Section:** §2.4; §10 Property 11.
- **Verification Method:** adversarial test (layer inversion).

---

## Acceptance Criteria

| AC ID | Acceptance Criterion | Traces (requirements) |
|-------|----------------------|-----------------------|
| AC-EVO-001 | Every construct persists under `evolution:<kind>:<id>`; registry is single source of truth | FR-EVO-001, DR-EVO-001 |
| AC-EVO-002 | Registration rejected if missing owner/classification/version/source | FR-EVO-002, DR-EVO-002 |
| AC-EVO-003 | Submission mutates no governed state (propose-not-act) | FR-EVO-003, GR-EVO-007 |
| AC-EVO-004 | Commit requires CAP-AUTHORITY `Allow`; revoked/halted rejected; DELETE rejected | FR-EVO-004, GR-EVO-008, SR-EVO-011 |
| AC-EVO-005 | Non-ALLOW policy ⇒ fail-closed reject + `EVO_PROPOSAL_REJECTED(policy-deny)` | FR-EVO-005, SR-EVO-003 |
| AC-EVO-006 | Change proposals classified ADDITIVE/BACKWARD_COMPATIBLE/BREAKING | FR-EVO-006 |
| AC-EVO-007 | BREAKING without `migrationRef` ⇒ rejected | FR-EVO-006, GR-EVO-011 |
| AC-EVO-008 | N-1 consumer break rejected unless additive or migration+deprecation | FR-EVO-007 |
| AC-EVO-009 | Single-writer: no governed state change outside `commit` | FR-EVO-008, GR-EVO-004 |
| AC-EVO-010 | Commit appends atomically, strictly increasing sequence, `hash=H(prev‖canonical)` | FR-EVO-009, DR-EVO-009, DR-EVO-010 |
| AC-EVO-011 | Identical commit/migration inputs ⇒ identical `resultHash` | FR-EVO-010, GR-EVO-013 |
| AC-EVO-012 | Non-reproducible `resultHash` ⇒ inadmissible | FR-EVO-010, NFR-EVO-001 |
| AC-EVO-013 | External-world change ⇒ `Pending(AD-0009)`; never autonomous | FR-EVO-011, GR-EVO-005 |
| AC-EVO-014 | Migration admitted only if versioned-forward, deterministic, reversible | FR-EVO-012, DR-EVO-004 |
| AC-EVO-015 | Additive upcasters keep historical events replayable, no delete/rewrite | FR-EVO-013, NFR-EVO-016 |
| AC-EVO-016 | SemVer lineage; supersede-by-link; N/N-1 coexist within window | FR-EVO-014, DR-EVO-005 |
| AC-EVO-017 | Version monotonic; lower version never re-committed over higher | FR-EVO-015 |
| AC-EVO-018 | SoD (proposer≠approver≠committer) + quorum≥floor; else `Pending(quorum-not-met)` | FR-EVO-016, GR-EVO-010 |
| AC-EVO-019 | External actuation escalated via `EVO_APPROVAL_PENDING_AD0009`; no auto-execute | FR-EVO-017, GR-EVO-017 |
| AC-EVO-020 | Reversal only by forward CompensatingChange; original never deleted/edited | FR-EVO-018, GR-EVO-009 |
| AC-EVO-021 | Ledger append hash-chained genesis-anchored; replay halts fail-closed on mismatch | FR-EVO-019, SR-EVO-006 |
| AC-EVO-022 | Read-only projections derive from ledger, mutate no state | FR-EVO-020, NFR-EVO-008 |
| AC-EVO-023 | Sole commit path; no alternate write path exposed | FR-EVO-021, GR-EVO-004 |
| AC-EVO-024 | Foreign commits advisory/deny-only, namespace-isolated, partition fail-closed | FR-EVO-022, NFR-EVO-004 |
| AC-EVO-025 | New fabric onboarded by registration; 0 core-dir change | FR-EVO-023, FR-EVO-025 |
| AC-EVO-026 | No unregistered rule/migration/policy honored; no hardcoded commit logic | FR-EVO-024, GR-EVO-014, NFR-EVO-010 |
| AC-EVO-027 | Deterministic replay: same ledger ⇒ identical state across runs/hosts | NFR-EVO-001, GR-EVO-013 |
| AC-EVO-028 | Bounded commit-path latency (qualitative now; ASR pending) | NFR-EVO-002 |
| AC-EVO-029 | Append-only per-stream partitioning/throughput scaling (qualitative now) | NFR-EVO-003 |
| AC-EVO-030 | Fail-closed on any missing admission gate | NFR-EVO-005 |
| AC-EVO-031 | Recovery by deterministic replay + compensation; no in-place edit/delete | NFR-EVO-006, DR-EVO-012 |
| AC-EVO-032 | Offline, independently verifiable audit replay proof | NFR-EVO-007, SR-EVO-010 |
| AC-EVO-033 | Monotonic classification on projections/exports | NFR-EVO-009, DR-EVO-015 |
| AC-EVO-034 | Decision/commit audit events emit reason + `resultHash` | DR-EVO-013, GR-EVO-017 |
| AC-EVO-035 | Ledger reconciled against `AUTH-012` decision lineage | DR-EVO-014, NFR-EVO-006 |
| AC-EVO-036 | Chain tamper detected; replay halts fail-closed | NFR-EVO-015, SR-EVO-006 |
| AC-EVO-037 | Config floors enforced; relaxation rejected | NFR-EVO-013, SR-EVO-014 |
| AC-EVO-038 | Non-inversion: lower-layer commit over higher layer rejected | GR-EVO-012, SR-EVO-015 |
| AC-EVO-039 | Additivity gate: 0 prohibited-core-dir change, 0 `AUTH-*` amendment, baseline green | FR-EVO-025, NFR-EVO-020, GR-EVO-020, NFR-EVO-011, NFR-EVO-017, NFR-EVO-018, GR-EVO-001, GR-EVO-002, GR-EVO-003, GR-EVO-006, GR-EVO-015, GR-EVO-016, GR-EVO-018, GR-EVO-019, DR-EVO-003, DR-EVO-006, DR-EVO-007, DR-EVO-008, DR-EVO-011, SR-EVO-001, SR-EVO-002, SR-EVO-004, SR-EVO-005, SR-EVO-007, SR-EVO-008, SR-EVO-009, SR-EVO-012, SR-EVO-013, NFR-EVO-012, NFR-EVO-014, NFR-EVO-019, FR-EVO-024 |
| AC-EVO-040 | Adversarial suite passes with 0 residual High/High across all threat vectors | SR-EVO-004, SR-EVO-008, SR-EVO-011, SR-EVO-013, SR-EVO-015, GR-EVO-005, GR-EVO-009, GR-EVO-012 |

> **AC coverage note.** Every requirement (FR/NFR/GR/DR/SR) is traced by at least one AC above.
> AC-EVO-039 is the consolidated additivity/governance/traceability/platform-independence acceptance
> gate that anchors the requirements not already carried by AC-EVO-001..038/040.

---

## Completion Criteria

| CC ID | Completion Criterion | Discharged by (requirements/AC) |
|-------|----------------------|---------------------------------|
| CC-EVO-001 | Design approved | EV-CAP-EVO-DESIGN (pre-existing) |
| CC-EVO-002 | Requirements approved | EV-CAP-EVO-DESIGN (pre-existing) |
| CC-EVO-003 | Traceability complete (0 orphans) | NFR-EVO-017, GR-EVO-015 |
| CC-EVO-004 | Registry & schemas implemented | FR-EVO-001, FR-EVO-002, DR-EVO-002..009 |
| CC-EVO-005 | Admission fail-closed (authorization-gated) | FR-EVO-003, FR-EVO-004, FR-EVO-005, GR-EVO-008 |
| CC-EVO-006 | Ledger & event store implemented | FR-EVO-019, DR-EVO-008, DR-EVO-010 |
| CC-EVO-007 | Projection/replay engine implemented | FR-EVO-020, DR-EVO-012, NFR-EVO-001 |
| CC-EVO-008 | Compatibility & policy implemented | FR-EVO-006, FR-EVO-007, GR-EVO-003, GR-EVO-006 |
| CC-EVO-009 | Commit engine implemented | FR-EVO-008, FR-EVO-009, FR-EVO-010, GR-EVO-004 |
| CC-EVO-010 | Migration & version implemented | FR-EVO-012, FR-EVO-013, FR-EVO-014, FR-EVO-015 |
| CC-EVO-011 | Approval & SoD implemented | FR-EVO-016, FR-EVO-017, GR-EVO-010 |
| CC-EVO-012 | Compensation implemented | FR-EVO-018, GR-EVO-009 |
| CC-EVO-013 | Security controls implemented (S1/S3/S4) | SR-EVO-001..015 |
| CC-EVO-014 | Audit controls implemented | NFR-EVO-007, SR-EVO-010, DR-EVO-013 |
| CC-EVO-015 | Core property tests passing | NFR-EVO-001, GR-EVO-013, FR-EVO-008, FR-EVO-009, FR-EVO-018 |
| CC-EVO-016 | Determinism validated | FR-EVO-010, NFR-EVO-001 |
| CC-EVO-017 | CAP-AUTHORITY authorization path verified | GR-EVO-008, SR-EVO-011 |
| CC-EVO-018 | PI-4 policy path verified | GR-EVO-003, FR-EVO-005 |
| CC-EVO-019 | Adversarial suite passed (0 residual High/High) | AC-EVO-040, SR-EVO-004, SR-EVO-008, SR-EVO-015 |
| CC-EVO-020 | Evidence accepted & closure review passed | GR-EVO-018, GR-EVO-019, NFR-EVO-018 |

---

## Evidence Artifacts

| Evidence ID | Purpose | Class |
|-------------|---------|-------|
| EV-CAP-EVO-DESIGN | Approved design/requirements/tasks | E-DESIGN |
| EV-CAP-EVO-IMP | Registry-first implementation of `EVO-C1..C10` engines | E-CODE |
| EV-CAP-EVO-TEST | Unit/property/integration/replay tests | E-CODE |
| EV-CAP-EVO-AUDIT | Hash-chained events + offline replay proof (append-only) | E-HIST |
| EV-CAP-EVO-RECON | Compensating-change + `AUTH-012` ledger reconciliation + replay recovery | E-HIST |
| EV-CAP-EVO-TRACE | Full lineage; 0 orphans | E-DESIGN |
| EV-CAP-EVO-SEC | S1/S3/S4 conformance + adversarial suite 0 residual High/High | E-CODE |

---

**END requirements.md — REQUIREMENTS — DRAFT.**
