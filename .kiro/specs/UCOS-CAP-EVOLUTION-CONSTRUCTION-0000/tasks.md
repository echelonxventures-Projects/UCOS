# Implementation Plan: UCOS-CAP-EVOLUTION-CONSTRUCTION-0000

| Field | Value |
|-------|-------|
| Spec ID | `UCOS-CAP-EVOLUTION-CONSTRUCTION-0000` |
| Capability | **CAP-EVOLUTION — Universal Evolution Fabric (Construction)** |
| Phase | **Tasks** |
| Status | **TASKS — DRAFT** |
| Inputs | `design.md` (COMPLETE), `requirements.md` (COMPLETE) |
| Waves | W0–W9 (registry-first, additive-only; baseline green at every wave boundary) |
| Task Count | 10 waves / 60 top-level tasks / 178 sub-tasks |
| Construction gate | **BLOCKED** until scoped Article IX release act (`AD-00xx`, OI-2) is recorded |

> **Execution discipline.** Every wave is **additive-only**, confined to
> `packages/platform-runtime/src/control/evolution/*` and the reserved `evolution:*` keyspace. Zero
> modification of substrate core dirs (`src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`,
> `src/configuration-runtime`, `src/contracts`); zero amendment of `AUTH-001..012` (`G-2`). Each wave
> exits only when the existing platform-runtime baseline is green (0 regressions) and the wave exit gate
> (design §13) is satisfied. All engines are **registry-first** — no commit/migration/policy logic is
> hardcoded (`IP-04/05`). Every task references the requirements it discharges; no task introduces a
> technology/vendor selection (`PEP-010`).

---

## W0 — Foundations

*Scope:* `types`, Evolution Registry skeleton, spine checks (`S-E1..S-E10`), keyspace `evolution:*`.
*Exit gate:* Build + baseline green.

- [ ] 1. Scaffold the `src/control/evolution/*` module tree (additive-only)
  - [ ] 1.1 Create the `control/evolution/{types,registry,ledger,engines,policy,federation}` directory skeleton with no substrate-core edits
  - [ ] 1.2 Wire the module into the platform-runtime build without touching prohibited core dirs
  - [ ] 1.3 Add a directory-boundary guard asserting construction stays within `src/control/evolution/*`
  - _Requirements: FR-EVO-025, GR-EVO-020, NFR-EVO-020_
- [ ] 2. Define technology-neutral core types for the ten constructs (`EVO-C1..C10`)
  - [ ] 2.1 Define `EvolutionUnit`, `ChangeProposal`, `Migration`, `CommitRecord`, `CompensatingChange` types
  - [ ] 2.2 Define `VersionRecord`, `EvolutionPolicy`, `EvolutionApproval`, `EvolutionEvent`, `EvolutionLedger` types
  - [ ] 2.3 Define shared value types (`SemVer`, `Hash`, `KeyspaceRef`, `ClassificationTag`, enums) with no vendor coupling
  - _Requirements: DR-EVO-002, DR-EVO-003, DR-EVO-004, DR-EVO-005, DR-EVO-006, DR-EVO-007, DR-EVO-008, DR-EVO-009, NFR-EVO-011_
- [ ] 3. Establish the `evolution:<kind>:<id>` keyspace convention
  - [ ] 3.1 Implement keyspace key builders/parsers for every construct kind
  - [ ] 3.2 Reserve the `evolution:*` metadata keyspace and the `evolution:federation:<nodeId>:*` sub-namespace
  - _Requirements: DR-EVO-001, FR-EVO-001, FR-EVO-022_
- [ ] 4. Encode the ten spine invariants (`S-E1..S-E10`) as reusable guard predicates
  - [ ] 4.1 Implement single-writer, propose-not-act, and deny-by-default guard stubs (`S-E1/2/3`)
  - [ ] 4.2 Implement append-only, migration-only, backward-compat guard stubs (`S-E4/5/6`)
  - [ ] 4.3 Implement determinism, tamper-evidence, compensation, authority-gate guard stubs (`S-E7/8/9/10`)
  - _Requirements: GR-EVO-006, GR-EVO-007, GR-EVO-009, GR-EVO-011, GR-EVO-012, GR-EVO-013_
- [ ] 5. Establish the Evolution Registry skeleton (single source of truth)
  - [ ] 5.1 Implement the registry record store interface over the PI-2/3 Registry port
  - [ ] 5.2 Implement round-trip persistence for all construct records under `evolution:*`
  - _Requirements: FR-EVO-001, GR-EVO-002, CC-EVO-004_
- [ ] 6. W0 exit gate — build + baseline green
  - [ ] 6.1 Run the full existing platform-runtime baseline and confirm 0 regressions
  - [ ] 6.2 Confirm 0 prohibited-core-dir change and 0 `AUTH-001..012` amendment
  - _Requirements: NFR-EVO-020, GR-EVO-020, FR-EVO-025_

## W1 — Registry & Admission

*Scope:* Unit/proposal admission, validation, versioning, classification, authorization binding.
*Exit gate:* Admission fail-closed; authorization-gated.

- [ ] 7. Implement registry admission validation rules (1–8)
  - [ ] 7.1 Enforce single-owner on every record; reject records lacking exactly one owner
  - [ ] 7.2 Enforce mandatory classification (S4); reject unclassified records as blocking gaps
  - [ ] 7.3 Enforce SemVer presence (`IP-13`) and resolvable Authority/Constitution `sourceRef` (`AUTH-010`)
  - _Requirements: FR-EVO-002, DR-EVO-002, NFR-EVO-014, DR-EVO-015_
- [ ] 8. Implement `admitEvolutionUnit` intake procedure (propose-not-act)
  - [ ] 8.1 Treat submission as a governed proposal that mutates no state
  - [ ] 8.2 Emit `EVO_PROPOSAL_SUBMITTED` with no state change on submit
  - [ ] 8.3 Reject an already-committed unit id, directing corrections to a CompensatingChange
  - _Requirements: FR-EVO-003, GR-EVO-007, AC-EVO-003_
- [ ] 9. Bind admission to CAP-AUTHORITY authorization
  - [ ] 9.1 Require `Authority.decide(actor,"commit",targetKeyspace)=Allow` before admission proceeds
  - [ ] 9.2 Reject fail-closed when the requesting authority is revoked or halted (revocation supremacy)
  - [ ] 9.3 Emit `EVO_PROPOSAL_AUTHORIZED` / `EVO_PROPOSAL_REJECTED(unauthorized-or-halted)` accordingly
  - _Requirements: FR-EVO-004, GR-EVO-008, SR-EVO-011, SR-EVO-001, CC-EVO-017_
- [ ] 10. Enforce operation and provenance constraints at admission
  - [ ] 10.1 Reject any change proposal whose `operation` is `DELETE` (append-only, `S-E4`)
  - [ ] 10.2 Reject self-committed / unauthorized-provenance units (`proposedBy` distinctness)
  - _Requirements: FR-EVO-004, DR-EVO-003, DR-EVO-011, SR-EVO-009_
- [ ] 11. Require authenticated actors on every governed request
  - [ ] 11.1 Reject unauthenticated submit/commit/compensate/approve requests fail-closed (S1)
  - _Requirements: SR-EVO-002_
- [ ] 12. W1 exit gate — admission fail-closed, authorization-gated
  - [ ] 12.1 Verify every admission gate rejects with no state change on any missing/failed gate
  - [ ] 12.2 Baseline green; additivity gate confirmed
  - _Requirements: NFR-EVO-005, AC-EVO-002, AC-EVO-004, NFR-EVO-020, AC-EVO-030, CC-EVO-005_

## W2 — Ledger & Event Store

*Scope:* Hash-chained append-only ledger, event vocabulary, projection, deterministic replay.
*Exit gate:* Tamper-evidence + deterministic replay.

- [ ] 13. Implement the canonical event vocabulary (`EnumEvoEventType`)
  - [ ] 13.1 Define all twelve `EVO_*` event types with the `EvolutionEvent` schema
  - [ ] 13.2 Implement deterministic canonical encoding for hash input (reproducible across hosts)
  - _Requirements: DR-EVO-008, SR-EVO-007, DR-EVO-013_
- [ ] 14. Implement the append-only, hash-chained Evolution Ledger
  - [ ] 14.1 Implement genesis-anchored per-stream append with strictly increasing sequence
  - [ ] 14.2 Compute `hash = H(prevHash ‖ canonical(payload))` on every appended event
  - [ ] 14.3 Expose no delete/rewrite path in any code path (append-only storage)
  - _Requirements: FR-EVO-019, DR-EVO-009, DR-EVO-010, SR-EVO-008, GR-EVO-009, CC-EVO-006_
- [ ] 15. Implement the deterministic Replay/Projection engine
  - [ ] 15.1 Implement `projectGovernedState` reconstructing state by ordered replay
  - [ ] 15.2 Assert chain integrity (`prevHash`/`hash`) and invariants at each event
  - [ ] 15.3 Halt replay fail-closed on any mismatch and flag tamper
  - _Requirements: FR-EVO-019, DR-EVO-012, NFR-EVO-015, SR-EVO-006, CC-EVO-007_
- [ ] 16. Implement read-only projection queries
  - [ ] 16.1 Implement `projectState`, `getCommit`, `currentVersion`, `coexistingVersions` as read-only
  - [ ] 16.2 Guarantee read models derive strictly from the ledger and mutate no state
  - _Requirements: FR-EVO-020, NFR-EVO-008, GR-EVO-002, AC-EVO-022_
- [ ] 17. W2 exit gate — tamper-evidence + deterministic replay
  - [ ] 17.1 Prove deterministic replay yields identical state across runs/hosts (≥100 iterations)
  - [ ] 17.2 Prove chain-tamper detection halts replay fail-closed
  - [ ] 17.3 Baseline green; additivity gate confirmed
  - _Requirements: NFR-EVO-001, AC-EVO-021, AC-EVO-027, AC-EVO-036, NFR-EVO-020_

## W3 — Compatibility & Policy

*Scope:* Compatibility Verifier (additive/backward-compat/breaking), Evolution Policy + PI-4 binding, config floors.
*Exit gate:* Backward-compat; deny-by-default.

- [ ] 18. Implement the Compatibility Verifier
  - [ ] 18.1 Classify each change proposal as `ADDITIVE`, `BACKWARD_COMPATIBLE`, or `BREAKING`
  - [ ] 18.2 Reject fail-closed any `BREAKING` proposal with no resolvable `migrationRef`
  - _Requirements: FR-EVO-006, GR-EVO-011, AC-EVO-006, AC-EVO-007_
- [ ] 19. Enforce N/N-1 backward-compatibility windows
  - [ ] 19.1 Reject changes breaking an N-1 consumer contract within `backwardCompatWindow`
  - [ ] 19.2 Permit such changes only when additive or migration + deprecation-window bearing
  - _Requirements: FR-EVO-007, AC-EVO-008_
- [ ] 20. Implement Evolution Policy resolution bound to PI-4
  - [ ] 20.1 Resolve deny-by-default `EvolutionPolicy` records from the registry (no hardcoded rules)
  - [ ] 20.2 Invoke the PI-4 Control Plane evaluator on every governed commit path
  - [ ] 20.3 Reject fail-closed on any non-ALLOW with `EVO_PROPOSAL_REJECTED(policy-deny)`
  - _Requirements: FR-EVO-005, GR-EVO-003, GR-EVO-006, SR-EVO-003, DR-EVO-006, AC-EVO-005, CC-EVO-008, CC-EVO-018_
- [ ] 21. Implement `resolveConfig` with non-waivable floors
  - [ ] 21.1 Implement hierarchical deep-merge (`default→fabric-profile→environment→instance`)
  - [ ] 21.2 Assert the seven config floors and reject any relaxation as a governance violation
  - _Requirements: NFR-EVO-013, SR-EVO-014, AC-EVO-037_
- [ ] 22. Enforce registry-only rule resolution
  - [ ] 22.1 Reject any unregistered rule/migration/policy; honor no hardcoded commit behavior
  - _Requirements: FR-EVO-024, GR-EVO-014, NFR-EVO-010, AC-EVO-026_
- [ ] 23. W3 exit gate — backward-compat + deny-by-default
  - [ ] 23.1 Prove deny-by-default across all governed operations
  - [ ] 23.2 Prove N/N-1 coexistence preserved; baseline green
  - _Requirements: GR-EVO-006, FR-EVO-007, NFR-EVO-020_

## W4 — Commit Engine

*Scope:* Deterministic atomic append-only `commit`, `resultHash` verifier, single-writer gate.
*Exit gate:* Determinism; single-writer; propose-not-act.

- [ ] 24. Implement the single-writer Commit Engine
  - [ ] 24.1 Make the Commit Engine the sole writer of governed state
  - [ ] 24.2 Reject any attempt to mutate governed state outside the Evolution commit path
  - [ ] 24.3 Expose no alternate write path to any fabric or federated node
  - _Requirements: FR-EVO-008, FR-EVO-021, GR-EVO-004, SR-EVO-004, AC-EVO-023_
- [ ] 25. Implement the `commit` procedure (formal spec §7.1)
  - [ ] 25.1 Step 0 — re-check CAP-AUTHORITY `Allow` + revocation/halt supremacy (fail-closed)
  - [ ] 25.2 Step 1 — PI-4 policy check; step 2 — compatibility + migration check
  - [ ] 25.3 Step 5 — atomic append-only commit with strictly increasing sequence + hash chain
  - _Requirements: FR-EVO-009, GR-EVO-008, GR-EVO-009, DR-EVO-009, DR-EVO-010, CC-EVO-009_
- [ ] 26. Implement the determinism / `resultHash` verifier
  - [ ] 26.1 Compute commit/migration outcomes as pure functions of recorded inputs
  - [ ] 26.2 Emit `resultHash`; reject any non-reproducible `resultHash` as inadmissible
  - _Requirements: FR-EVO-010, GR-EVO-013, AC-EVO-011, AC-EVO-012, CC-EVO-016_
- [ ] 27. Emit commit audit events
  - [ ] 27.1 Emit `EVO_COMMITTED` with reason and `resultHash` on every committed change
  - _Requirements: DR-EVO-013, GR-EVO-017, AC-EVO-034, CC-EVO-014_
- [ ] 28. W4 exit gate — determinism, single-writer, propose-not-act
  - [ ] 28.1 Prove single-writer (no governed change outside `commit`) via adversarial direct-write test
  - [ ] 28.2 Prove identical inputs ⇒ identical `resultHash`; propose-not-act preserved; baseline green
  - _Requirements: AC-EVO-009, AC-EVO-010, AC-EVO-011, NFR-EVO-020_

## W5 — Migration Engine

*Scope:* Reversible, versioned migrations; additive upcasters; N/N-1 coexistence.
*Exit gate:* Migration-only; reversible; N/N-1.

- [ ] 29. Implement the Migration Engine admission
  - [ ] 29.1 Admit a migration only if `fromVersion` → strictly higher `toVersion`
  - [ ] 29.2 Require deterministic transform and reversibility via registered `inverseTransformRef`
  - _Requirements: FR-EVO-012, DR-EVO-004, AC-EVO-014, CC-EVO-010_
- [ ] 30. Implement additive, version-tagged upcasters
  - [ ] 30.1 Keep historical events/records replayable to identical state after migration
  - [ ] 30.2 Guarantee no deletion or rewrite in any upcaster path
  - _Requirements: FR-EVO-013, NFR-EVO-016, AC-EVO-015_
- [ ] 31. Register migrations as ledger events
  - [ ] 31.1 Emit `EVO_MIGRATION_REGISTERED` for each reversible migration on a breaking change
  - _Requirements: GR-EVO-011, FR-EVO-006_
- [ ] 32. W5 exit gate — migration-only, reversible, N/N-1
  - [ ] 32.1 Prove breaking ⇒ registered reversible migration; prove reversibility
  - [ ] 32.2 Prove historical replay stable under upcasters; baseline green
  - _Requirements: AC-EVO-014, AC-EVO-015, NFR-EVO-020_

## W6 — Version Manager

*Scope:* SemVer lineage, supersession, deprecation windows.
*Exit gate:* Version-monotonicity; supersede-not-delete.

- [ ] 33. Implement SemVer lineage management
  - [ ] 33.1 Maintain per-artifact SemVer lineage with `supersedes` links
  - [ ] 33.2 Supersede prior versions by link, never by deletion
  - _Requirements: FR-EVO-014, DR-EVO-005, AC-EVO-016_
- [ ] 34. Implement N/N-1 coexistence and deprecation windows
  - [ ] 34.1 Permit N and N-1 to coexist within the configured deprecation window
  - [ ] 34.2 Emit `EVO_VERSION_SUPERSEDED` on supersession
  - _Requirements: FR-EVO-014, GR-EVO-016_
- [ ] 35. Enforce version monotonicity
  - [ ] 35.1 Reject any commit that decreases a committed artifact version
  - [ ] 35.2 Reject re-committing a lower version over a higher committed version (adversarial rollback)
  - _Requirements: FR-EVO-015, AC-EVO-017_
- [ ] 36. W6 exit gate — version-monotonicity, supersede-not-delete
  - [ ] 36.1 Prove supersession by link (never delete); prove monotonic version
  - [ ] 36.2 Baseline green; additivity gate confirmed
  - _Requirements: AC-EVO-016, AC-EVO-017, NFR-EVO-020_

## W7 — Approval & SoD

*Scope:* Approval Manager (SoD + quorum), AD-0009 external-actuation escalation.
*Exit gate:* SoD/quorum; AD-0009 pending path.

- [ ] 37. Implement the Approval Manager (SoD + quorum)
  - [ ] 37.1 Enforce proposer ≠ approver ≠ committer role distinctness
  - [ ] 37.2 Enforce quorum ≥ configured `quorumFloor`; return `Pending("quorum-not-met")` otherwise
  - [ ] 37.3 Emit `EVO_APPROVAL_REQUESTED` / `EVO_APPROVAL_GRANTED` events
  - _Requirements: FR-EVO-016, GR-EVO-010, SR-EVO-013, AC-EVO-018, CC-EVO-011_
- [ ] 38. Implement AD-0009 external-actuation escalation
  - [ ] 38.1 Detect external-world-actuating changes and return `Pending("AD-0009 approval required")`
  - [ ] 38.2 Emit `EVO_APPROVAL_PENDING_AD0009`; never auto-execute
  - _Requirements: FR-EVO-011, FR-EVO-017, GR-EVO-005, GR-EVO-017, AC-EVO-013, AC-EVO-019_
- [ ] 39. Implement keyspace halt/freeze and distinct-authority resume
  - [ ] 39.1 Freeze commits fail-closed under a CAP-AUTHORITY keyspace halt
  - [ ] 39.2 Require a distinct authority (SoD) to resume
  - _Requirements: NFR-EVO-019, SR-EVO-012_
- [ ] 40. W7 exit gate — SoD/quorum + AD-0009 pending path
  - [ ] 40.1 Prove role distinctness + quorum floor; prove collusion/quorum-evasion rejection
  - [ ] 40.2 Prove AD-0009 pending path; baseline green
  - _Requirements: AC-EVO-018, AC-EVO-019, AC-EVO-013, NFR-EVO-020_

## W8 — Compensation Engine

*Scope:* Governed forward-only reversal; no delete/edit; ledger reconciliation.
*Exit gate:* Reversal-by-compensation; append-only preserved.

- [ ] 41. Implement the Compensation Engine (`compensate` §7.2)
  - [ ] 41.1 Build a governed inverse of the target commit as a new append-only forward commit
  - [ ] 41.2 Never delete or edit the original committed record
  - [ ] 41.3 Emit `EVO_COMPENSATED` on reversal
  - _Requirements: FR-EVO-018, GR-EVO-009, DR-EVO-007, AC-EVO-020, CC-EVO-012_
- [ ] 42. Implement recovery by replay + compensation
  - [ ] 42.1 Recover governed state solely by deterministic replay and governed compensating commits
  - [ ] 42.2 Guarantee no in-place edit/delete recovery path exists
  - _Requirements: NFR-EVO-006, AC-EVO-031_
- [ ] 43. Implement ledger reconciliation against `AUTH-012`
  - [ ] 43.1 Reconcile ledger commits against the `AUTH-012` decision ledger for governed-change lineage
  - _Requirements: DR-EVO-014, AC-EVO-035_
- [ ] 44. W8 exit gate — reversal-by-compensation, append-only preserved
  - [ ] 44.1 Prove reversal only by forward CompensatingChange; original never deleted/edited
  - [ ] 44.2 Prove replay-recovery + reconciliation; baseline green
  - _Requirements: AC-EVO-020, AC-EVO-031, AC-EVO-035, NFR-EVO-020_

## W9 — Federation & Adversarial

*Scope:* Federation-safe replication (advisory/deny-only), adversarial suite, register-then-migrate harness.
*Exit gate:* 0 residual High/High; audit replay; additivity gate.

- [ ] 45. Implement federation-safe replication
  - [ ] 45.1 Treat replicated foreign commits as advisory-only, deny-only, trust-clamped
  - [ ] 45.2 Namespace-isolate to `evolution:federation:<nodeId>:*`; local-shadows-foreign
  - [ ] 45.3 Fail closed on partition with no cross-node auto-commit
  - _Requirements: FR-EVO-022, NFR-EVO-004, AC-EVO-024_
- [ ] 46. Implement the register-then-migrate onboarding harness
  - [ ] 46.1 Onboard a representative fabric's write path by instance registration
  - [ ] 46.2 Prove behaviour-preservation with 0 prohibited-core-dir change and 0 `AUTH-*` amendment
  - _Requirements: FR-EVO-023, NFR-EVO-012, AC-EVO-025_
- [ ] 47. Implement signing-key handling and no custom crypto
  - [ ] 47.1 Reference signing keys by reference only (no embedded key material)
  - [ ] 47.2 Use PI-5 Ed25519 assertions; introduce no custom cryptography
  - _Requirements: SR-EVO-005, CC-EVO-013_
- [ ] 48. Implement the offline audit-replay proof
  - [ ] 48.1 Produce an independently replayable, offline-verifiable audit trail
  - _Requirements: NFR-EVO-007, SR-EVO-010, AC-EVO-032_
- [ ] 49. Enforce non-inversion of `PCAMG-0008` layers
  - [ ] 49.1 Reject fail-closed any lower-layer commit that would invert/hold power over a higher layer
  - _Requirements: GR-EVO-012, SR-EVO-015, AC-EVO-038_
- [ ] 50. Enforce monotonic classification on projections/exports
  - [ ] 50.1 Never declassify on projection/export; assert monotonic classification
  - _Requirements: NFR-EVO-009, DR-EVO-015, AC-EVO-033_
- [ ] 51. Author the property-based test suite (§15.2)
  - [ ] 51.1 `singleWriterCommit`, `appendOnlyLedger`, `migrationOnly` properties
  - [ ] 51.2 `backwardCompatibleReplay`, `deterministicReplay` properties
  - [ ] 51.3 `reversibilityByCompensation`, `separationOfDuties` properties
  - _Requirements: NFR-EVO-001, GR-EVO-013, FR-EVO-008, FR-EVO-009, FR-EVO-018, AC-EVO-027, CC-EVO-015_
- [ ] 52. Author the adversarial test suite (§15.3, AC1–ACn)
  - [ ] 52.1 Unauthorized commit, direct-write bypass, DELETE/in-place-edit attempts
  - [ ] 52.2 Breaking-without-migration, backward-compat break, non-deterministic commit injection
  - [ ] 52.3 Ledger hash-chain tamper, SoD collusion, quorum evasion
  - [ ] 52.4 External actuation without AD-0009, destructive version rollback, cross-node auto-commit
  - _Requirements: AC-EVO-040, SR-EVO-004, SR-EVO-006, SR-EVO-008, SR-EVO-011, SR-EVO-013, SR-EVO-015, CC-EVO-019_
- [ ] 53. Author integration tests (§15.4)
  - [ ] 53.1 End-to-end governed loop against CAP-AUTHORITY / PI-4 / PI-5
  - [ ] 53.2 Register-then-migrate behaviour-preservation; partition fail-closed
  - _Requirements: GR-EVO-003, GR-EVO-008, FR-EVO-005, NFR-EVO-012, NFR-EVO-004_
- [ ] 54. Implement qualitative performance/scalability harnesses (ASR-deferred)
  - [ ] 54.1 Verify bounded commit-path latency qualitatively (quantitative `PENDING ASR RATIFICATION`)
  - [ ] 54.2 Verify append-only per-stream partitioning/throughput scaling qualitatively
  - _Requirements: NFR-EVO-002, NFR-EVO-003, AC-EVO-028, AC-EVO-029_
- [ ] 55. Build the traceability & coverage matrix (0 orphans)
  - [ ] 55.1 Trace requirements → constructs → contracts → events → tests with 0 orphans
  - _Requirements: NFR-EVO-017, GR-EVO-015, AC-EVO-039, CC-EVO-003_
- [ ] 56. Assemble the seven `EV-CAP-EVO-*` evidence artifacts
  - [ ] 56.1 Produce IMP, TEST, AUDIT, RECON, TRACE, SEC evidence, integrity-verifiable
  - _Requirements: GR-EVO-018, NFR-EVO-018, CC-EVO-020_
- [ ] 57. Run the platform-independence leakage scan
  - [ ] 57.1 Confirm 0 technology/vendor selection across the construction
  - _Requirements: NFR-EVO-011_
- [ ] 58. Run the closure completion-criteria conjunction
  - [ ] 58.1 Verify the fail-closed conjunction of `CC-EVO-001..020`
  - _Requirements: GR-EVO-019, GR-EVO-001, CC-EVO-001, CC-EVO-002_
- [ ] 59. W9 exit gate — 0 residual High/High + audit replay + additivity
  - [ ] 59.1 Confirm adversarial suite 0 residual High/High
  - [ ] 59.2 Confirm offline audit-replay proof; additivity gate (0 core-dir change, 0 `AUTH-*` amend)
  - [ ] 59.3 Baseline green (0 regressions)
  - _Requirements: AC-EVO-039, AC-EVO-040, NFR-EVO-020, GR-EVO-020_
- [ ] 60. Record the scoped Article IX release act (gate — Approval-Required)
  - [ ] 60.1 Obtain the scoped Article IX release (`AD-00xx`, OI-2) authorizing `src/control/evolution/*`
  - [ ] 60.2 Confirm construction remains BLOCKED until the release act is recorded (never auto-executed)
  - _Requirements: GR-EVO-005, GR-EVO-019_

---

## Traceability Summary

- **Every requirement** (FR-EVO-001..025, NFR-EVO-001..020, GR-EVO-001..020, DR-EVO-001..015,
  SR-EVO-001..015) is discharged by at least one task above.
- **Every acceptance criterion** (AC-EVO-001..040) is anchored to a wave exit gate or task.
- **Every completion criterion** (CC-EVO-001..020) is discharged across W0–W9 and tasks 55–60.
- **Waves W0–W9** map 1:1 to `design.md §13` exit gates; each wave boundary requires baseline green
  (`NFR-EVO-020`) and additivity (`G-2`, `GR-EVO-020`).
- **Construction remains BLOCKED** until the scoped Article IX release act (`AD-00xx`, OI-2) is recorded
  (task 60); all `AD-0009` external-actuation acts are deferred to runtime/Board and never auto-executed.

**END tasks.md — TASKS — DRAFT.**
