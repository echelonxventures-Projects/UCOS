# PCAMG-RUNTIME-0010 — Constitutional Governance Runtime Construction Program

> **CONSTRUCTION EXECUTION SPECIFICATION — IMPLEMENTATION WORK ONLY.**
> This artifact is the definitive, construction-ready implementation program for the Constitutional
> Governance Runtime (CGR). It contains **only implementation work**: components to build, files to
> create, interfaces/DTOs to define, reuse mappings, build order, tests, and acceptance criteria.
> It introduces **no doctrine**, performs **no architecture redesign**, generates **no governance**,
> conducts **no certification/authorization review**, and defines **no new constitutional concepts**.
> Build scope is strictly the delta: capabilities classified **MISSING**. `IMPLEMENTED` substrate is
> **reused**; `PARTIALLY_IMPLEMENTED` substrate is **extended/integrated** — never rebuilt or redesigned.

| Field | Value |
|-------|-------|
| Artifact ID | `PCAMG-RUNTIME-0010` |
| Name | Constitutional Governance Runtime — Construction Program |
| Repository | UCOS / `packages/platform-runtime` |
| Namespace root (NG-1) | `packages/platform-runtime/src/control/constitutional-governance/` (abbrev **`…/cg/`**) |
| Source of truth | Repository reality audit (see **Source-of-Truth Note**) |
| Predecessor taxonomy | `PCAMG-RUNTIME-0008` §B (CGR component IDs) |
| Verified baseline (non-regression floor) | **378/378** tests pass (`node --test "test/*.test.ts"`, 53 files) |
| Mode | Construction execution specification — implementation backlog only |

---

## Source-of-Truth Note (repository reality)

The brief names `PCAMG-RUNTIME-0009` as the authoritative repository reality audit. **That file is not
present in the repository** — the `PCAMG-RUNTIME-*` series stops at `-0008`. To avoid building on an
absent input, the delta was **re-established by direct inspection of the repository at its current
state**. The inspection confirms every finding the brief attributes to `-0009`:

| Audit finding (per brief) | Verified in repository | Evidence |
|---------------------------|:----------------------:|----------|
| CGR namespace does not exist | **CONFIRMED** | `src/control/` contains `evolution, federation, governance, identity, knowledge, memory, ontology, operations, policy, readiness, simulation, trust` — **no `constitutional-governance/`** |
| Constitutional-specific capabilities MISSING | **CONFIRMED** | No CGR component (`CGR-CORE/REG/AR/CP/AU/CH/GC/TR-*`) exists as source; `CGR-` appears only in `-0008` (spec) |
| Reusable substrate exists | **CONFIRMED** | `registry-runtime/`, `persistence-runtime/`, `metadata-runtime/`, `meta-core/`, `control/audit-log.ts`, `control/simulation/`, `control/evolution/`, `control/governance/`, `control/federation/` all present |
| Construction must be additive | **ADOPTED** | All new code confined to `…/cg/`; zero edits to existing fabrics/core dirs |
| Existing governance systems untouched | **ADOPTED** | `control/governance/*`, `control/policy/*` are read-only reuse targets |
| Reuse existing runtime capabilities | **ADOPTED** | Reuse plan §D maps every new component to existing substrate |

This program is therefore grounded in verified repository reality, not on the missing document.

---

## A. Construction Executive Summary

The Constitutional Governance Runtime is a **greenfield additive namespace** at
`src/control/constitutional-governance/` (`…/cg/`). Nothing constitutional-specific exists today, so
**every CGR component is MISSING and must be built**. However, the enabling substrate is mature and
**must be reused, not reimplemented**: append-only durable logging, canonical serialization, registry
adapters, metadata storage, hash-chained audit patterns, federation cryptography, the Evolution Fabric
(governed mutation), and the Simulation Fabric (deterministic what-if/projection).

The program delivers **8 subsystems / ~34 components** in **4 dependency-ordered waves**:

1. **Wave 1 — Foundation:** `CGR-CORE-*` (types, append-only guard, hashing, control assembly, harness),
   `CGR-REG-*` (11 propose-only registries), `CGR-AU-*` (hash-chained audit append + verifier).
2. **Wave 2 — Authority, Compiler, Traceability:** `CGR-AR-*` (resolution, principle validation,
   supremacy), `CGR-GC-*` (CR-1..12 rules, CE catalog, determinism, fail-closed, candidate generation),
   `CGR-TR-*` (governance graph, trace verifier, impact analyzer).
3. **Wave 3 — Compliance & Chronicle:** `CGR-CP-*` (four ordered stages, proof generator, **inert**
   activation gate, non-waivable enforcer), `CGR-CH-*` (offline WORM export, verdict reproduction,
   no-silent-activation invariant).
4. **Wave 4 — Integration, Certification, Adversarial:** substrate read-only adapters + Evolution
   routing + federation-crypto adapter; adversarial suite; construction-certification evidence.

**Invariants enforced by construction (mechanical, not doctrinal):** additive-only (no edits outside
`…/cg/`), append-only (no UPDATE/DELETE), deterministic (canonical serialization + reproducible hashes),
fail-closed (typed deny, no default allow), and **activation constructed inert** (the activation gate is
built as a deny-by-default seam that cannot confer an `ACTIVE` state). The **non-regression floor is the
verified 378/378** baseline; construction must never reduce it.

---

## B. Component Construction Manifest

> Every row is a **MISSING** capability to build. Package is `platform-runtime` throughout. Paths are
> relative to `packages/platform-runtime/`. All modules are new (**CREATE**). Reuse targets are the
> existing substrate modules the component imports (§D expands the mapping).

### B.0 Shared conventions (apply to all components)
- **File type:** TypeScript ESM (`.ts`), Node `--test`, matches existing fabric style (`#private` fields,
  `readonly`, typed errors, no default exports for classes).
- **Barrel discipline:** each subdirectory exposes `index.ts`; `cg/index.ts` re-exports the namespace
  (namespaced `export * as cg` from `control/index.ts` — mirrors `knowledge`/`simulation` pattern to
  avoid barrel collisions).
- **No custom cryptography:** hashing/signing reuses `persistence-runtime/canonical.ts` +
  `node:crypto` SHA-256 and `control/federation` signature primitives.

### B.1 `CGR-CORE-*` — Constitutional Runtime Core

| Component ID | Purpose | Location (`…/cg/`) | New Files | Interfaces / DTOs | Dependencies | Reuse Targets |
|--------------|---------|--------------------|-----------|-------------------|--------------|---------------|
| `CGR-CORE-01` Shared types & record schema | Canonical `GovernanceRecord` + registry/relation enums | `cg/types.ts` | `types.ts` | DTO `GovernanceRecord`, `SupersessionLink`, enums `RegistryType`, `TraceRelation` | — | `contracts/types.ts` (SemVer, JsonSchema), `meta-core/ports.ts` (RegistryRecord shape) |
| `CGR-CORE-02` Append-only guard | Reject UPDATE/DELETE; enforce supersession-link discipline | `cg/append-only.ts` | `append-only.ts` | `AppendOnlyGuard`, error `E-APPEND-ONLY` | CORE-01 | `persistence-runtime/append-only-log.ts` (InMemoryAppendOnlyLog / FileAppendOnlyLog) |
| `CGR-CORE-03` Hash & canonical serialization | Deterministic SHA-256 over canonical JSON; verify-on-read | `cg/hashing.ts` | `hashing.ts` | `hashRecord(record): string`, `verifyRecordHash(record): boolean` | CORE-01 | `persistence-runtime/canonical.ts` (canonicalStringify), `node:crypto` |
| `CGR-CORE-04` Control assembly & barrel | Orchestration seam + namespace exports | `cg/governance-control.ts`, `cg/index.ts` | `governance-control.ts`, `index.ts` | `ConstitutionalGovernanceControl`, `createConstitutionalGovernance(opts)` | CORE-01..03, all registries | `control/knowledge/knowledge-control.ts` (assembly pattern), `control/bootstrap.ts` |
| `CGR-CORE-05` Test harness | Governance test infra; baseline pin; fixtures | `cg/test-harness.ts` | `test-harness.ts` | `makeCgFixture()`, in-memory port factory | CORE-01 | `test/fixtures/*`, `registry-runtime/registry.ts` (InMemoryRegistry) |

### B.2 `CGR-REG-*` — Registry Runtime (11 registries)

Shared base: `cg/registries/registry-base.ts` — `ConstitutionalRegistry<T extends GovernanceRecord>`
implementing propose/supersede/query over `MetadataPort`, with RG-1..8 enforcement. All 11 registries
extend it. New directory: `cg/registries/`.

| Component ID | Purpose | New File (`cg/registries/`) | DTO / Interface | Dependencies | Reuse Targets |
|--------------|---------|-----------------------------|-----------------|--------------|---------------|
| `CGR-REG-PRIN` | 15 invariant principles (propose-only) | `principle-registry.ts` | `PrincipleRecord`, `RegistryPort<T>` | base, CORE | `meta-core/ports.ts` (MetadataPort), `metadata-runtime/metadata-store.ts` |
| `CGR-REG-META` | Meta-Constitution M-I..M-XII | `meta-registry.ts` | `MetaArticleRecord` | REG-PRIN | metadata store, `metadata-runtime/schema-validator.ts` |
| `CGR-REG-GOV` | Generated governance candidates + generation records | `governance-candidate-registry.ts` | `GovernanceCandidateRecord`, `GenerationRecord` | REG-PRIN/META | metadata store (⚠ distinct from existing `control/governance/governance-registry.ts` — no collision) |
| `CGR-REG-CENTER` | Governance centers (`PGC-*`); acyclic delegation | `center-registry.ts` | `CenterRecord` | REG-PRIN | metadata store |
| `CGR-REG-DOMAIN` | Domain constitutions (`PDC-*`) | `domain-registry.ts` | `DomainRecord` | REG-CENTER | metadata store |
| `CGR-REG-POLICY` | Policies; deny-by-default (`effect='deny'`) | `policy-registry.ts` | `CgPolicyRecord` | REG-DOMAIN | read-only ref: `control/policy/policy-registry.ts` (pattern), metadata store |
| `CGR-REG-CAP` | Capability declarations | `capability-registry.ts` | `CapabilityRecord` | REG-DOMAIN/POLICY | metadata store, `meta-core/ports.ts` |
| `CGR-REG-CONSENT` | Consent grants/revocations (revocable) | `consent-registry.ts` | `ConsentRecord` | CORE | metadata store |
| `CGR-REG-DECISION` | Decision records; SoD (proposer≠certifier≠ratifier) | `decision-registry.ts` | `DecisionRecord` | CORE | metadata store; pattern from `control/governance/governance-registry.ts` (ApprovalRecord) |
| `CGR-REG-TRACE` | Derivation edges (8 relations); `layer_to ≤ layer_from` | `trace-registry.ts` | `TraceEdge` | CORE | metadata store |
| `CGR-REG-AUDIT` | Hash-chained audit entries (genesis + append) | `audit-registry.ts` | `AuditEntry` (chained) | CORE-03 | `control/audit-log.ts` (AuditSink), `persistence-runtime/append-only-log.ts` |

### B.3 `CGR-AR-*` — Authority Runtime

New directories: `cg/engines/`, `cg/validation/`.

| Component ID | Purpose | New Files | DTO / Interface | Dependencies | Reuse Targets |
|--------------|---------|-----------|-----------------|--------------|---------------|
| `CGR-AR-RESOLVE` Authority Resolution Engine | Resolve authority chains; fail-closed | `cg/engines/authority-resolution-engine.ts` | `AuthorityResolutionPort`, `AuthorityChain` | REG-PRIN/META/TRACE | `control/federation/federation-resolver.ts` (chain-resolution pattern), REG-TRACE |
| `CGR-AR-VALIDATE` Principle Validation Engine | VR-P/C/M/T/D/S/G rules; non-waivable | `cg/validation/principle-validation-engine.ts`, `cg/validation/vr-*.ts` (7), `cg/validation/validation-port.ts` | `ValidationPort`, `ValidationRecord` | AR-RESOLVE, REG-TRACE | `meta-core/validation-engine.ts` (rule-runner pattern) |
| `CGR-AR-SUPREMACY` Supremacy & Conflict | Principle-prevails; ratified prevails pre-enrollment; escalate unresolved | `cg/engines/supremacy-engine.ts` | `SupremacyVerdict` | AR-RESOLVE/VALIDATE | AR engines; `control/evolution/evolution-governor.ts` (conflict-escalation pattern) |

### B.4 `CGR-GC-*` — Governance Compiler Runtime

New directory: `cg/compilation/`.

| Component ID | Purpose | New Files (`cg/compilation/`) | DTO / Interface | Dependencies | Reuse Targets |
|--------------|---------|-------------------------------|-----------------|--------------|---------------|
| `CGR-GC-RULES` | CR-1..12 canonical compilation rules | `cr-rules.ts` | `CompilerRule`, `CompilerPort` | REG-PRIN/META | `meta-core/composition-engine.ts` (composition pattern) |
| `CGR-GC-ERRORS` | CE-* catalog (10 codes; **no CE-UNRESOLVED**) | `ce-catalog.ts` | `CompileError` (typed union) | GC-RULES | `control/errors.ts`, `meta-core/errors.ts` (SubstrateError pattern) |
| `CGR-GC-DETERMINISM` | Reproducible `determinism_hash` (CR-9) | `determinism.ts` | `determinismHash(inputs): string` | GC-RULES, CORE-03 | `persistence-runtime/canonical.ts`, CORE-03 hashing |
| `CGR-GC-FAILCLOSED` | Unresolved/ambiguous halts (CR-12) | `fail-closed.ts` | `FailClosedGuard` | GC-RULES | `control/simulation/constraint-evaluator.ts` (fail-closed pattern) |
| `CGR-GC-GENERATE` | Emit gen records to REG-GOV; **candidate-only** | `candidate-generator.ts`, `compiler-engine.ts` | `GenerationRecord` writer | GC-RULES, REG-GOV | REG-GOV, `control/evolution/evolution-proposal.ts` (candidate pattern) |

### B.5 `CGR-TR-*` — Traceability Runtime

New directory: `cg/graph/`.

| Component ID | Purpose | New Files (`cg/graph/`) | DTO / Interface | Dependencies | Reuse Targets |
|--------------|---------|-------------------------|-----------------|--------------|---------------|
| `CGR-TR-GRAPH` Governance graph model | Vertices/edges; relational + projection | `governance-graph.ts` | `TraceabilityPort`, `GovernanceGraph` | REG-TRACE | `control/ontology/ontology-graph.ts` (graph model pattern) |
| `CGR-TR-VERIFY` Trace verifier | T-1/T-2/T-3/T-5 (up-trace, layer, orphan, acyclic) | `trace-verifier.ts` | `TraceVerdict` | TR-GRAPH | TR-GRAPH; `control/evolution/evolution-impact-analyzer.ts` (traversal) |
| `CGR-TR-IMPACT` Impact analyzer | Downward impact (T-DOWN) | `impact-analyzer.ts` | `ImpactReport` | TR-GRAPH | `control/simulation/impact-analyzer.ts`, `control/evolution/evolution-impact-analyzer.ts` |

### B.6 `CGR-CP-*` — Compliance Runtime

New directory: `cg/compliance/`.

| Component ID | Purpose | New Files (`cg/compliance/`) | DTO / Interface | Dependencies | Reuse Targets |
|--------------|---------|------------------------------|-----------------|--------------|---------------|
| `CGR-CP-STAGE1..4` Four-stage validators | Principle → Constitutional → Governance → Operational | `stage-1-principle.ts` … `stage-4-operational.ts` | `StageResult` | AR-VALIDATE, TR, AU | `control/readiness/compliance-engine.ts` (staged-eval pattern) |
| `CGR-CP-PROOF` Proof generator | Ordered fail-closed proof; deterministic proof hash | `proof-generator.ts` | `ComplianceProof`, `CompliancePort` | STAGE1..4 | CORE-03 hashing, determinism |
| `CGR-CP-ACTIVATE` Activation gate **(INERT)** | Build transition seam; **cannot confer ACTIVE** | `activation-gate.ts` | inert `ActivationGate` → always `E-ACTIVATION-DISABLED` | CP-PROOF | `control/evolution/evolution-state-machine.ts` (transition seam, kept inert) |
| `CGR-CP-NONWAIVE` Non-waivable enforcement | S1/S3/S4 blocking at Stage 1/4 | `non-waivable-enforcer.ts` | `NonWaivableGate` | STAGE1/4 | AR-VALIDATE VR-S* |
| — assembly — | Compliance engine wiring | `compliance-engine.ts`, `index.ts` | `CompliancePort` | all CP | CORE-04 assembly |

### B.7 `CGR-AU-*` — Audit Runtime

New directory: `cg/audit/`.

| Component ID | Purpose | New Files (`cg/audit/`) | DTO / Interface | Dependencies | Reuse Targets |
|--------------|---------|-------------------------|-----------------|--------------|---------------|
| `CGR-AU-CHAIN` Hash-chained append | Attributable, chained audit (A-1/A-2) | `audit-chain.ts` | `AuditPort`, `AuditEntry{seq,actor,action,subject_ref,prev_hash,entry_hash}` | REG-AUDIT, CORE-03 | `control/knowledge/knowledge-audit-log.ts` (KNOW_GENESIS_HASH chain), `control/audit-log.ts` (AuditSink), `control/evolution/evolution-audit-log.ts` |
| `CGR-AU-VERIFY` Chain verifier | Detect gap/break/tamper (A-2) | `chain-verifier.ts` | `ChainVerdict` | AU-CHAIN | knowledge/evolution audit reconciliation pattern |

### B.8 `CGR-CH-*` — Chronicle Runtime

Co-located in `cg/audit/`.

| Component ID | Purpose | New Files (`cg/audit/`) | DTO / Interface | Dependencies | Reuse Targets |
|--------------|---------|-------------------------|-----------------|--------------|---------------|
| `CGR-CH-EXPORT` Offline WORM export | DB-free verifiable chain (A-3) | `offline-export.ts` | `ChroniclePort`, `AuditExport{entries[],export_hash}` | AU-VERIFY | `persistence-runtime/append-only-log.ts` (FileAppendOnlyLog), canonical |
| `CGR-CH-REPRODUCE` Verdict reproduction | Re-execute verdicts from evidence (A-4) | `verdict-reproducer.ts` | `ReproductionResult` | AU-CHAIN + verdict producers | GC/AR/CP determinism hashes |
| `CGR-CH-NOSILENT` No-silent-activation | Every ACTIVE ⇒ one ACTIVATE proof (A-5); **vacuous under inert gate** | `no-silent-activation.ts` | `NoSilentActivationCheck` | CP-ACTIVATE, AU-CHAIN | CP-ACTIVATE (inert), AU-CHAIN |

**Component count:** 5 (CORE) + 11 (REG) + 3 (AR) + 5 (GC) + 3 (TR) + ~6 (CP) + 2 (AU) + 3 (CH) = **~38 modules across 34 component IDs**.

---

## C. Repository Construction Layout

Complete directory tree to create under `packages/platform-runtime/src/control/constitutional-governance/`.
Everything below is **new**. No file outside this tree is created or modified except the two EXTEND points
noted at the end.

```
packages/platform-runtime/src/control/constitutional-governance/     # NG-1 (…/cg/)
├── index.ts                         # CGR-CORE-04  namespace barrel
├── types.ts                         # CGR-CORE-01  GovernanceRecord, enums, DTOs
├── append-only.ts                   # CGR-CORE-02  AppendOnlyGuard
├── hashing.ts                       # CGR-CORE-03  canonical SHA-256 + verify-on-read
├── governance-control.ts            # CGR-CORE-04  ConstitutionalGovernanceControl assembly
├── test-harness.ts                  # CGR-CORE-05  in-memory fixture factory
│
├── registries/                      # CGR-REG-*  (11 registries + base)
│   ├── index.ts
│   ├── registry-base.ts             #            ConstitutionalRegistry<T> (RG-1..8)
│   ├── principle-registry.ts        # CGR-REG-PRIN
│   ├── meta-registry.ts             # CGR-REG-META
│   ├── governance-candidate-registry.ts  # CGR-REG-GOV  (distinct from control/governance/*)
│   ├── center-registry.ts           # CGR-REG-CENTER
│   ├── domain-registry.ts           # CGR-REG-DOMAIN
│   ├── policy-registry.ts           # CGR-REG-POLICY  (deny-by-default)
│   ├── capability-registry.ts       # CGR-REG-CAP
│   ├── consent-registry.ts          # CGR-REG-CONSENT
│   ├── decision-registry.ts         # CGR-REG-DECISION  (SoD)
│   ├── trace-registry.ts            # CGR-REG-TRACE  (8 relations)
│   └── audit-registry.ts            # CGR-REG-AUDIT  (hash-chained)
│
├── engines/                         # CGR-AR-RESOLVE / CGR-AR-SUPREMACY
│   ├── index.ts
│   ├── authority-resolution-engine.ts
│   └── supremacy-engine.ts
│
├── validation/                      # CGR-AR-VALIDATE
│   ├── index.ts
│   ├── validation-port.ts
│   ├── principle-validation-engine.ts
│   ├── vr-principle.ts              # VR-P
│   ├── vr-constitutional.ts         # VR-C (non-waivable)
│   ├── vr-meta.ts                   # VR-M
│   ├── vr-traceability.ts           # VR-T
│   ├── vr-domain.ts                 # VR-D
│   ├── vr-security.ts               # VR-S (non-waivable)
│   └── vr-governance.ts             # VR-G
│
├── compilation/                     # CGR-GC-*
│   ├── index.ts
│   ├── cr-rules.ts                  # CR-1..12
│   ├── ce-catalog.ts                # 10 codes, NO CE-UNRESOLVED
│   ├── determinism.ts               # determinism_hash (CR-9)
│   ├── fail-closed.ts               # CR-12 halt
│   ├── candidate-generator.ts       # candidate-only emit
│   └── compiler-engine.ts           # CompilerPort assembly
│
├── graph/                           # CGR-TR-*
│   ├── index.ts
│   ├── governance-graph.ts          # CGR-TR-GRAPH
│   ├── trace-verifier.ts            # CGR-TR-VERIFY (T-1/2/3/5)
│   └── impact-analyzer.ts           # CGR-TR-IMPACT (T-DOWN)
│
├── compliance/                      # CGR-CP-*
│   ├── index.ts
│   ├── stage-1-principle.ts
│   ├── stage-2-constitutional.ts
│   ├── stage-3-governance.ts
│   ├── stage-4-operational.ts
│   ├── proof-generator.ts           # ComplianceProof + proof hash
│   ├── activation-gate.ts           # INERT — deny-by-default, no ACTIVE
│   ├── non-waivable-enforcer.ts     # S1/S3/S4 blocking
│   └── compliance-engine.ts         # CompliancePort assembly
│
├── audit/                           # CGR-AU-* + CGR-CH-*
│   ├── index.ts
│   ├── audit-chain.ts               # CGR-AU-CHAIN
│   ├── chain-verifier.ts            # CGR-AU-VERIFY
│   ├── offline-export.ts            # CGR-CH-EXPORT
│   ├── verdict-reproducer.ts        # CGR-CH-REPRODUCE
│   └── no-silent-activation.ts      # CGR-CH-NOSILENT
│
└── integration/                     # Wave 4 adapters (reuse-only seams)
    ├── index.ts
    ├── substrate-adapters.ts        # read-only bind to registry/persistence/metadata
    ├── evolution-router.ts          # route governed mutation via Evolution Fabric
    └── federation-crypto-adapter.ts # bind federation signature primitives (no custom crypto)
```

Mirror test tree (created in Wave order):

```
packages/platform-runtime/test/cg/
├── core/          # CGR-CORE-* unit/determinism/adversarial
├── registries/    # CGR-REG-* RG-1..8, append-only breach, propose-only
├── engines/       # CGR-AR-RESOLVE / SUPREMACY
├── validation/    # CGR-AR-VALIDATE VR-*
├── compilation/   # CGR-GC-* CR-1..12 / CE-* / determinism
├── graph/         # CGR-TR-* T-1/2/3/5, cycle injection
├── compliance/    # CGR-CP-* ordered stages, activation-denied
├── audit/         # CGR-AU-* + CGR-CH-* chain/tamper/offline/reproduce
├── integration/   # Wave 4 substrate read-only, evolution routing
└── system/        # end-to-end lifecycle, baseline non-regression, adversarial suite
```

**EXTEND points (only two files touched outside `…/cg/`):**
1. `packages/platform-runtime/src/control/index.ts` — add `export * as cg from "./constitutional-governance/index.ts";` (namespaced, collision-free, mirrors `simulation`/`knowledge`).
2. `packages/platform-runtime/package.json` — extend `test` script glob to include `test/cg/**/*.test.ts` (append; keep existing `test/*.test.ts`).

**PROHIBITED targets (never create/modify):** `control/governance/*`, `control/policy/*`,
`meta-core/*`, `registry-runtime/*`, `metadata-runtime/*`, `persistence-runtime/*`, `contracts/*`,
`control/{federation,evolution,knowledge,memory,ontology,operations,simulation,readiness}/*`,
`.claude/authority/*`.

---

## D. Reuse Plan

Every new component binds to existing substrate through its **ports/adapters**; nothing is
reimplemented. Reuse is **import-and-compose** (constructor injection), never fork-and-edit.

### D.1 Reuse-target matrix

| CGR component(s) | Existing runtime | Existing registry | Existing persistence | Existing audit | Existing compiler/eval | Existing simulation |
|------------------|------------------|-------------------|----------------------|----------------|------------------------|---------------------|
| `CGR-CORE-01` types | `contracts/types.ts` (SemVer, JsonSchema) | `meta-core/ports.ts` RegistryRecord | — | — | — | — |
| `CGR-CORE-02` append-only | — | — | `persistence-runtime/append-only-log.ts` (InMemory/FileAppendOnlyLog) | — | — | — |
| `CGR-CORE-03` hashing | — | — | `persistence-runtime/canonical.ts` (canonicalStringify) + `node:crypto` | — | — | — |
| `CGR-CORE-04/05` assembly/harness | `control/bootstrap.ts` pattern | `registry-runtime/registry.ts` InMemoryRegistry | durable stores | `control/audit-log.ts` InMemoryAuditLog | — | — |
| `CGR-REG-*` (11) | `meta-core/ports.ts` MetadataPort | `metadata-runtime/metadata-store.ts` + `persistence-runtime/durable-metadata-store.ts` | `durable-registry-store.ts` | — | `metadata-runtime/schema-validator.ts` | — |
| `CGR-REG-DECISION` | — | pattern from `control/governance/governance-registry.ts` (ApprovalRecord, read-only) | metadata store | — | — | — |
| `CGR-REG-AUDIT` | — | metadata store | `append-only-log.ts` | `control/audit-log.ts` AuditSink | — | — |
| `CGR-AR-RESOLVE` | `control/federation/federation-resolver.ts` (chain resolution pattern) | REG-PRIN/META/TRACE | — | — | — | — |
| `CGR-AR-VALIDATE` | — | REG-* | — | — | `meta-core/validation-engine.ts` (rule runner) | — |
| `CGR-AR-SUPREMACY` | `control/evolution/evolution-governor.ts` (escalation pattern) | REG-* | — | — | — | — |
| `CGR-GC-RULES/GENERATE` | `control/evolution/evolution-proposal.ts` (candidate) | REG-GOV | — | — | `meta-core/composition-engine.ts` | — |
| `CGR-GC-DETERMINISM` | — | — | `persistence-runtime/canonical.ts` | — | CORE-03 hashing | — |
| `CGR-GC-FAILCLOSED` | — | — | — | — | `control/simulation/constraint-evaluator.ts` (fail-closed) | ✅ |
| `CGR-TR-GRAPH` | `control/ontology/ontology-graph.ts` (graph model) | REG-TRACE | — | — | — | — |
| `CGR-TR-IMPACT` | — | — | — | — | — | `control/simulation/impact-analyzer.ts`, `control/evolution/evolution-impact-analyzer.ts` |
| `CGR-CP-STAGE1..4/PROOF` | — | REG-* | — | REG-AUDIT | `control/readiness/compliance-engine.ts` (staged eval) | — |
| `CGR-CP-ACTIVATE` (inert) | `control/evolution/evolution-state-machine.ts` (transition seam, kept inert) | — | — | AU-CHAIN | — | — |
| `CGR-AU-CHAIN/VERIFY` | — | REG-AUDIT | `append-only-log.ts` | `control/knowledge/knowledge-audit-log.ts` (KNOW_GENESIS_HASH chain), `control/evolution/evolution-audit-log.ts` | — | — |
| `CGR-CH-EXPORT` | — | — | `FileAppendOnlyLog` + canonical | AU-VERIFY | — | — |
| `CGR-CH-REPRODUCE` | — | — | — | AU-CHAIN | GC/AR/CP determinism hashes | `control/simulation` reproduction pattern |
| Integration adapters | `control/evolution/*` (mutation routing) | `registry-runtime` | `persistence-runtime` | `control/audit-log.ts` | — | — |
| Crypto (all signing) | `control/federation/federated-credential-verifier.ts`, `control/memory/signed-assertion-verifier.ts` | — | — | — | — | — |

### D.2 Reuse rules (binding)
- **No custom crypto:** all SHA-256 via `node:crypto` over `canonicalStringify`; all signature
  verify/sign via `control/federation` primitives. New crypto code is a build-blocking defect.
- **No new persistence medium:** durability comes only from `persistence-runtime` (`FileAppendOnlyLog`,
  `DurableRegistryStore`, `DurableMetadataStore`).
- **No new registry engine:** registries compose `MetadataPort`/`RegistryPort`; storage stays pluggable.
- **Governed mutation routes through Evolution:** any state-changing candidate promotion is proposed via
  `control/evolution` — CGR never mutates ratified fabrics directly.
- **Existing governance untouched:** `control/governance/*` and `control/policy/*` are read-only pattern
  references; CGR ships its own registries under `…/cg/registries/`.

---

## E. Wave 1 Construction Package — Foundation (`CGR-CORE-*`, `CGR-REG-*`, `CGR-AU-*`)

**Goal:** namespace + record schema + guards + hashing + harness; 11 propose-only registries; hash-chained
audit append + verify. **Exit floor:** typecheck clean; **≥ 378/378** baseline preserved; RG-1..8 pass;
0 ACTIVE records; audit chain verifies.

**Exact build order:**

| # | Component | File(s) | Blocks | Reuse |
|---|-----------|---------|--------|-------|
| 1 | `CGR-CORE-01` | `cg/types.ts` | everything | contracts/types |
| 2 | `CGR-CORE-03` | `cg/hashing.ts` | REG-AUDIT, determinism | canonical.ts + node:crypto |
| 3 | `CGR-CORE-02` | `cg/append-only.ts` | all registries | append-only-log.ts |
| 4 | `CGR-CORE-05` | `cg/test-harness.ts` | all tests | InMemoryRegistry, fixtures |
| 5 | REG base | `cg/registries/registry-base.ts` | 11 registries | MetadataPort, metadata-store |
| 6 | `CGR-REG-PRIN` | `principle-registry.ts` | REG-META/GOV/CENTER, AR | metadata store |
| 7 | `CGR-REG-META` | `meta-registry.ts` | REG-GOV, AR | metadata store |
| 8 | `CGR-REG-CENTER` | `center-registry.ts` | REG-DOMAIN | metadata store |
| 9 | `CGR-REG-DOMAIN` | `domain-registry.ts` | REG-POLICY/CAP | metadata store |
| 10 | `CGR-REG-POLICY` | `policy-registry.ts` | REG-CAP | policy-registry pattern |
| 11 | `CGR-REG-CAP` | `capability-registry.ts` | — | ports |
| 12 | `CGR-REG-CONSENT` | `consent-registry.ts` | — | metadata store |
| 13 | `CGR-REG-DECISION` | `decision-registry.ts` | compliance SoD | governance-registry pattern |
| 14 | `CGR-REG-TRACE` | `trace-registry.ts` | TR, AR | metadata store |
| 15 | `CGR-REG-AUDIT` | `audit-registry.ts` | AU-CHAIN | audit-log.ts, append-only-log |
| 16 | `CGR-REG-GOV` | `governance-candidate-registry.ts` | GC-GENERATE | metadata store |
| 17 | `CGR-AU-CHAIN` | `cg/audit/audit-chain.ts` | AU-VERIFY, CH | knowledge-audit-log chain |
| 18 | `CGR-AU-VERIFY` | `cg/audit/chain-verifier.ts` | CH-EXPORT | AU-CHAIN |
| 19 | `CGR-CORE-04` | `cg/governance-control.ts` (partial), `cg/registries/index.ts`, `cg/audit/index.ts`, `cg/index.ts` | Wave 2 | knowledge-control pattern |
| 20 | EXTEND | `control/index.ts` (+`export * as cg`), `package.json` (+`test/cg/**`) | test runner | — |

---

## F. Wave 2 Construction Package — Authority, Compiler, Traceability (`CGR-AR-*`, `CGR-GC-*`, `CGR-TR-*`)

**Goal:** authority resolution + VR-* validation + supremacy; CR-1..12 / CE-* / determinism / fail-closed
/ candidate generation; governance graph + T-1/2/3/5 + impact. **Exit floor:** VR-* incl. non-waivable
pass; canonical CE catalog with **no CE-UNRESOLVED**; 0 orphans / acyclic; ratified prevails; candidate-only.

**Exact build order:**

| # | Component | File(s) | Blocks | Reuse |
|---|-----------|---------|--------|-------|
| 1 | `CGR-TR-GRAPH` | `cg/graph/governance-graph.ts` | TR-VERIFY, AR-RESOLVE | ontology-graph |
| 2 | `CGR-TR-VERIFY` | `cg/graph/trace-verifier.ts` | compliance stage-1 | TR-GRAPH |
| 3 | `CGR-TR-IMPACT` | `cg/graph/impact-analyzer.ts` | — | simulation/evolution impact analyzers |
| 4 | `CGR-AR-RESOLVE` | `cg/engines/authority-resolution-engine.ts` | AR-VALIDATE, AR-SUPREMACY | federation-resolver |
| 5 | `CGR-AR-VALIDATE` | `cg/validation/validation-port.ts`, `vr-*.ts` (7), `principle-validation-engine.ts` | compliance stages | meta-core/validation-engine |
| 6 | `CGR-AR-SUPREMACY` | `cg/engines/supremacy-engine.ts` | compliance | evolution-governor escalation |
| 7 | `CGR-GC-RULES` | `cg/compilation/cr-rules.ts` | GC-ERRORS/GENERATE | composition-engine |
| 8 | `CGR-GC-ERRORS` | `cg/compilation/ce-catalog.ts` | GC-GENERATE | errors modules |
| 9 | `CGR-GC-DETERMINISM` | `cg/compilation/determinism.ts` | GC-GENERATE, CH-REPRODUCE | canonical + CORE-03 |
| 10 | `CGR-GC-FAILCLOSED` | `cg/compilation/fail-closed.ts` | GC-GENERATE | constraint-evaluator |
| 11 | `CGR-GC-GENERATE` | `cg/compilation/candidate-generator.ts`, `compiler-engine.ts` | Wave 3 | REG-GOV, evolution-proposal |
| 12 | barrels | `cg/engines/index.ts`, `cg/validation/index.ts`, `cg/compilation/index.ts`, `cg/graph/index.ts` | Wave 3 | — |

---

## G. Wave 3 Construction Package — Compliance & Chronicle (`CGR-CP-*`, `CGR-CH-*`)

**Goal:** four-stage ordered proof; **inert** activation gate; non-waivable enforcement; offline WORM
export; verdict reproduction; A-5 no-silent-activation. **Exit floor:** ordered fail-closed proof;
**activation provably inert (0 ACTIVE)**; S1/S3/S4 blocking; offline verify + reproduction match.

**Exact build order:**

| # | Component | File(s) | Blocks | Reuse |
|---|-----------|---------|--------|-------|
| 1 | `CGR-CP-STAGE1` | `cg/compliance/stage-1-principle.ts` | STAGE2 | AR-VALIDATE, TR-VERIFY |
| 2 | `CGR-CP-STAGE2` | `stage-2-constitutional.ts` | STAGE3 | AR-VALIDATE, AR-SUPREMACY |
| 3 | `CGR-CP-STAGE3` | `stage-3-governance.ts` | STAGE4 | GC, REG-GOV |
| 4 | `CGR-CP-STAGE4` | `stage-4-operational.ts` | CP-PROOF | REG-POLICY/CAP |
| 5 | `CGR-CP-NONWAIVE` | `non-waivable-enforcer.ts` | CP-PROOF | VR-S/VR-C |
| 6 | `CGR-CP-PROOF` | `proof-generator.ts` | CP-ACTIVATE, CH | determinism, CORE-03 |
| 7 | `CGR-CP-ACTIVATE` | `activation-gate.ts` **(INERT)** | CH-NOSILENT | evolution-state-machine (inert seam) |
| 8 | `CGR-CP` assembly | `compliance-engine.ts`, `cg/compliance/index.ts` | CH | CORE-04 |
| 9 | `CGR-CH-EXPORT` | `cg/audit/offline-export.ts` | CH-REPRODUCE | FileAppendOnlyLog, canonical |
| 10 | `CGR-CH-REPRODUCE` | `cg/audit/verdict-reproducer.ts` | — | GC/AR/CP determinism hashes |
| 11 | `CGR-CH-NOSILENT` | `cg/audit/no-silent-activation.ts` | — | CP-ACTIVATE, AU-CHAIN |
| 12 | `CGR-CORE-04` finalize | complete `cg/governance-control.ts` + `createConstitutionalGovernance` | Wave 4 | knowledge-control |

**Inert activation build rule:** `activation-gate.ts` MUST expose the transition seam but return
`E-ACTIVATION-DISABLED` on every `RequestActivation`. No code path may set an `ACTIVE` state. This is a
gated review focal point (see §J).

---

## H. Wave 4 Construction Package — Integration, Certification, Adversarial Validation

**Goal:** bind CGR read-only to substrate + route governed mutation through Evolution + bind federation
crypto; run the adversarial suite; assemble construction-certification evidence. **Exit floor:** zero
prohibited-core-dir write; Evolution-routed mutation; adversarial 0 residual High/High; **≥ 378/378**;
independent construction certification with 0 blocking findings (SoD).

**Exact build order:**

| # | Work item | File(s) / action | Reuse |
|---|-----------|------------------|-------|
| 1 | Substrate read-only adapters | `cg/integration/substrate-adapters.ts` | registry/metadata/persistence ports |
| 2 | Evolution router | `cg/integration/evolution-router.ts` | `control/evolution/evolution-transaction-manager.ts`, `evolution-proposal.ts` |
| 3 | Federation crypto adapter | `cg/integration/federation-crypto-adapter.ts` | `control/federation/federated-credential-verifier.ts` |
| 4 | Integration barrel | `cg/integration/index.ts` | — |
| 5 | Full assembly wiring | finalize `createConstitutionalGovernance` in `governance-control.ts` | knowledge-control/bootstrap |
| 6 | Adversarial suite | `test/cg/system/adversarial.test.ts` | simulation adversarial patterns |
| 7 | End-to-end lifecycle | `test/cg/system/lifecycle.test.ts` | — |
| 8 | Baseline non-regression | run full `node --test`; assert **≥ 378/378** + new cg tests | — |
| 9 | Core-dir freeze diff | `git diff` confined to `…/cg/` + 2 EXTEND files | — |
| 10 | Certification evidence dossier | assemble per §J acceptance matrix | — |

**Certification here = construction-certification evidence assembly only** (mechanical checks pass, diff
confined, tests green, determinism reproducible). It performs no authorization review and confers no
authority; any Board-level certification/authorization is out of scope for this program.

---

## I. Test Construction Program

Per component group: **Unit · Integration · Determinism · Adversarial · Certification**. Coverage target
**≥ 95%** statement/branch on new modules; **every fail-closed/deny path must be exercised**. Tests live
under `test/cg/<group>/`.

| Group | Unit | Integration | Determinism | Adversarial | Certification |
|-------|------|-------------|-------------|-------------|---------------|
| **CORE** | schema shape; append-only guard; hash + verify-on-read | with registries | hash parity across runs | mutation-reject (UPDATE/DELETE) | append-only + reproducible-hash proof |
| **REG (11)** | RG-1..8 per registry; propose/supersede | cross-registry up-trace ≥1 PRIN | content-hash reproducibility | append-only breach; ACTIVE-conferral attempt | 15/15 principles; 0 ACTIVE; deny-by-default (REG-POLICY) |
| **AR** | each VR-P/C/M/T/D/S/G rule | resolution + validation chain | verdict-hash parity | supremacy bypass; downward authority; unresolvable-conflict escalation | ratified-prevails; non-waivable FAIL⇒FAIL |
| **GC** | CR-1..12 each; CE-* each | with REG-GOV write | cross-run `determinism_hash` identical | catalog drift; **CE-UNRESOLVED absent**; unresolved halt; partial-gov reject | candidate-only; canonical 10-code catalog |
| **TR** | T-1/T-2/T-3/T-5 | graph projection from REG-TRACE | — | cycle injection; orphan injection; downward-edge reject | 0 orphans; acyclic; up-trace complete |
| **CP** | each stage; non-waivable gate | 4-stage ordered pipeline | proof-hash parity | **activation attempt denied (E-ACTIVATION-DISABLED)**; stage-order break | ordered fail-closed proof; activation inert (0 ACTIVE) |
| **AU** | append; verify | with verdict producers | chain-hash parity | tamper injection; seq-gap; chain-break detection | A-1/A-2 attributable + chained |
| **CH** | export; reproduce; no-silent | offline verify (DB-free) | reproduction match | export tamper; A-5 (0 ACTIVE ⇒ vacuous) | A-3/A-4/A-5 |
| **SYSTEM** | — | end-to-end lifecycle | suite fingerprint stable | full threat suite, 0 residual High/High | **≥ 378/378** baseline + CERT-* matrix |

**Determinism test method:** run the producing operation twice with identical inputs; assert byte-identical
`determinism_hash` / `proof_hash` / `entry_hash`. **Adversarial test method:** each fail-closed error code
(`E-APPEND-ONLY`, `E-OWNER`, `E-ORPHAN`, `E-AMBIGUOUS`, `CE-*`, `VR-*-FAIL`, `T-*-FAIL`, `E-CHAIN-BROKEN`,
`E-TAMPERED`, `E-SEQ-GAP`, `E-ACTIVATION-DISABLED`, `E-STAGE-ORDER`, `E-NONWAIVABLE`) has a dedicated
negative test proving the deny path.

---

## J. Acceptance Matrix

A component is **DONE** only when all its criteria hold, tests are green, and typecheck is clean.

| Component group | Done Criteria |
|-----------------|---------------|
| `CGR-CORE-*` | `GovernanceRecord` schema frozen; append-only guard rejects UPDATE/DELETE; `hashRecord` reproducible + `verifyRecordHash` catches tamper; `cg/index.ts` exports namespace; `control/index.ts` exposes `cg`; baseline **≥ 378/378** preserved. |
| `CGR-REG-*` | All 11 registries extend base; RG-1..8 enforced per registry; propose/supersede only (no update/delete); every record up-traces to ≥1 PRIN (except Layer-0); 0 ACTIVE records; REG-POLICY denies by default; 15/15 principles registrable. |
| `CGR-AR-RESOLVE` | Authority chains resolve deterministically; unresolved ⇒ fail-closed deny (no default). |
| `CGR-AR-VALIDATE` | VR-P/C/M/T/D/S/G run; non-waivable (VR-C, VR-S) FAIL ⇒ overall FAIL; verdict deterministic. |
| `CGR-AR-SUPREMACY` | Principle prevails; ratified corpus prevails pre-enrollment; unresolved conflict escalates (never silently resolves). |
| `CGR-GC-RULES/ERRORS` | CR-1..12 canonical; exactly 10 CE codes; **CE-UNRESOLVED does not exist**. |
| `CGR-GC-DETERMINISM/FAILCLOSED` | Cross-run identical `determinism_hash`; unresolved/ambiguous input halts (no partial governance). |
| `CGR-GC-GENERATE` | Emits generation records to REG-GOV as **candidates only** (no activation event). |
| `CGR-TR-GRAPH/VERIFY/IMPACT` | Graph built from REG-TRACE; T-1/2/3/5 pass; 0 orphans; acyclic; downward-only; impact report produced. |
| `CGR-CP-STAGE1..4/PROOF` | Stages run in order; FAIL blocks later stages; `ComplianceProof` with deterministic `proof_hash`; verdict is eligibility-only (`ACTIVATE_ELIGIBLE`/`REJECT`). |
| `CGR-CP-ACTIVATE` | Gate is **inert**: every `RequestActivation` returns `E-ACTIVATION-DISABLED`; no code path sets `ACTIVE`; reviewed sign-off recorded. |
| `CGR-CP-NONWAIVE` | S1/S3/S4 non-waivable failures block at Stage 1/4. |
| `CGR-AU-CHAIN/VERIFY` | Genesis + hash-chained append; chain verifies; gap/break/tamper detected on read (fail-closed). |
| `CGR-CH-EXPORT/REPRODUCE/NOSILENT` | Offline (DB-free) export verifies; verdict reproduced from evidence matches; A-5 holds (0 ACTIVE ⇒ check vacuously true). |
| Integration | Substrate bound read-only; governed mutation routes via Evolution; crypto via federation only; `git diff` confined to `…/cg/` + 2 EXTEND files. |
| System / Certification | End-to-end lifecycle green; adversarial suite 0 residual High/High; **≥ 378/378** baseline; determinism suite fingerprint stable; construction-certification evidence dossier assembled (independent, SoD, 0 blocking). |

---

## K. Final Construction Program (dependency-ordered backlog)

Complete implementation backlog. Execute top-to-bottom; each item is a self-contained, testable unit.
`[W#]` = wave. Every item ships with its tests (§I) and must meet its acceptance criteria (§J) before the
next dependent item begins.

```
# WAVE 1 — Foundation
W1-01  CGR-CORE-01  cg/types.ts                              (GovernanceRecord, enums, DTOs)
W1-02  CGR-CORE-03  cg/hashing.ts                            (reuse canonical.ts + node:crypto)
W1-03  CGR-CORE-02  cg/append-only.ts                        (reuse append-only-log.ts)
W1-04  CGR-CORE-05  cg/test-harness.ts                       (reuse InMemoryRegistry, fixtures)
W1-05  REG-BASE     cg/registries/registry-base.ts           (RG-1..8 over MetadataPort)
W1-06  CGR-REG-PRIN cg/registries/principle-registry.ts
W1-07  CGR-REG-META cg/registries/meta-registry.ts
W1-08  CGR-REG-CENTER   cg/registries/center-registry.ts
W1-09  CGR-REG-DOMAIN   cg/registries/domain-registry.ts
W1-10  CGR-REG-POLICY   cg/registries/policy-registry.ts     (deny-by-default)
W1-11  CGR-REG-CAP      cg/registries/capability-registry.ts
W1-12  CGR-REG-CONSENT  cg/registries/consent-registry.ts
W1-13  CGR-REG-DECISION cg/registries/decision-registry.ts   (SoD)
W1-14  CGR-REG-TRACE    cg/registries/trace-registry.ts      (8 relations)
W1-15  CGR-REG-AUDIT    cg/registries/audit-registry.ts      (reuse audit-log.ts sink)
W1-16  CGR-REG-GOV      cg/registries/governance-candidate-registry.ts
W1-17  CGR-AU-CHAIN     cg/audit/audit-chain.ts              (reuse knowledge-audit-log chain)
W1-18  CGR-AU-VERIFY    cg/audit/chain-verifier.ts
W1-19  CGR-CORE-04a     cg/registries/index.ts, cg/audit/index.ts, cg/index.ts (partial)
W1-20  EXTEND           control/index.ts (+cg), package.json (+test/cg/**)
       GATE: typecheck clean; RG-1..8 pass; 0 ACTIVE; audit verifies; baseline >=378/378

# WAVE 2 — Authority, Compiler, Traceability
W2-01  CGR-TR-GRAPH     cg/graph/governance-graph.ts         (reuse ontology-graph)
W2-02  CGR-TR-VERIFY    cg/graph/trace-verifier.ts           (T-1/2/3/5)
W2-03  CGR-TR-IMPACT    cg/graph/impact-analyzer.ts          (reuse simulation/evolution impact)
W2-04  CGR-AR-RESOLVE   cg/engines/authority-resolution-engine.ts (reuse federation-resolver)
W2-05  CGR-AR-VALIDATE  cg/validation/{validation-port,vr-*,principle-validation-engine}.ts
W2-06  CGR-AR-SUPREMACY cg/engines/supremacy-engine.ts       (reuse evolution-governor escalation)
W2-07  CGR-GC-RULES     cg/compilation/cr-rules.ts           (CR-1..12; reuse composition-engine)
W2-08  CGR-GC-ERRORS    cg/compilation/ce-catalog.ts         (10 codes; NO CE-UNRESOLVED)
W2-09  CGR-GC-DETERMINISM cg/compilation/determinism.ts      (reuse canonical + CORE-03)
W2-10  CGR-GC-FAILCLOSED  cg/compilation/fail-closed.ts      (reuse constraint-evaluator)
W2-11  CGR-GC-GENERATE  cg/compilation/{candidate-generator,compiler-engine}.ts (candidate-only)
W2-12  BARRELS          cg/{engines,validation,compilation,graph}/index.ts
       GATE: VR-* pass; non-waivable enforced; no CE-UNRESOLVED; 0 orphans/acyclic; candidate-only

# WAVE 3 — Compliance & Chronicle
W3-01  CGR-CP-STAGE1    cg/compliance/stage-1-principle.ts
W3-02  CGR-CP-STAGE2    cg/compliance/stage-2-constitutional.ts
W3-03  CGR-CP-STAGE3    cg/compliance/stage-3-governance.ts
W3-04  CGR-CP-STAGE4    cg/compliance/stage-4-operational.ts
W3-05  CGR-CP-NONWAIVE  cg/compliance/non-waivable-enforcer.ts
W3-06  CGR-CP-PROOF     cg/compliance/proof-generator.ts     (deterministic proof_hash)
W3-07  CGR-CP-ACTIVATE  cg/compliance/activation-gate.ts     (INERT — E-ACTIVATION-DISABLED)
W3-08  CGR-CP-ASSEMBLY  cg/compliance/{compliance-engine,index}.ts
W3-09  CGR-CH-EXPORT    cg/audit/offline-export.ts           (reuse FileAppendOnlyLog)
W3-10  CGR-CH-REPRODUCE cg/audit/verdict-reproducer.ts
W3-11  CGR-CH-NOSILENT  cg/audit/no-silent-activation.ts     (A-5)
W3-12  CGR-CORE-04b     finalize cg/governance-control.ts + createConstitutionalGovernance
       GATE: ordered fail-closed proof; activation inert (0 ACTIVE); offline verify + reproduce match

# WAVE 4 — Integration, Certification, Adversarial
W4-01  INT-SUBSTRATE    cg/integration/substrate-adapters.ts (read-only bind)
W4-02  INT-EVOLUTION    cg/integration/evolution-router.ts   (reuse evolution-transaction-manager)
W4-03  INT-CRYPTO       cg/integration/federation-crypto-adapter.ts (reuse federation verifier)
W4-04  INT-BARREL       cg/integration/index.ts
W4-05  ASSEMBLY-FINAL   wire createConstitutionalGovernance end-to-end
W4-06  ADVERSARIAL      test/cg/system/adversarial.test.ts   (0 residual High/High)
W4-07  LIFECYCLE-E2E    test/cg/system/lifecycle.test.ts
W4-08  NON-REGRESSION   full node --test; assert >=378/378 + cg suite
W4-09  FREEZE-DIFF      git diff confined to cg/ + 2 EXTEND files
W4-10  CERT-EVIDENCE    assemble construction-certification dossier (SoD, 0 blocking)
       GATE: zero prohibited-core-dir write; Evolution-routed; adversarial clean; baseline preserved
```

**Program totals:** 34 CGR component IDs → ~38 source modules + ~10 test suites, across 4 waves, all
additive under `…/cg/`, all reusing existing substrate, zero modification to existing governance/core
fabrics beyond the two named EXTEND points.

---

## Construction Constraints (mechanical, non-doctrinal)

These are build rules, not doctrine. A violation is a build-blocking defect:

1. **Additive-only:** no create/modify outside `…/cg/` except `control/index.ts` (+`cg` export) and
   `package.json` (+test glob).
2. **Append-only:** registries expose propose/supersede only; no UPDATE/DELETE code path.
3. **Deterministic:** all hashes computed over `canonicalStringify`; identical inputs ⇒ identical hashes.
4. **Fail-closed:** every failure returns a typed error (no default allow, no silent pass).
5. **Activation inert:** `activation-gate.ts` cannot confer `ACTIVE`; always `E-ACTIVATION-DISABLED`.
6. **No custom crypto:** SHA-256 via `node:crypto`; signatures via `control/federation`.
7. **No new persistence/registry engines:** reuse `persistence-runtime` and `registry-runtime`.
8. **Governed mutation via Evolution:** promotion of candidates routes through `control/evolution`.
9. **Non-regression floor:** full suite stays **≥ 378/378** (verified baseline) at every wave gate.

**END PCAMG-RUNTIME-0010 — CONSTRUCTION EXECUTION SPECIFICATION · IMPLEMENTATION WORK ONLY · ADDITIVE · APPEND-ONLY · DETERMINISTIC · FAIL-CLOSED · ACTIVATION INERT · SUBSTRATE-REUSING.**
