# PCAMG-RUNTIME-0011 — Wave 1 Construction Package

**Authority:** Constitutional Runtime Construction Authority
**Artifact class:** Construction specification (implementation-ready). Not doctrine, not architecture, not governance theory, not certification.
**Predecessors (complete):** PCAMG-RUNTIME-0001, 0002, 0003, 0003A, 0004, 0005, 0006, 0007, 0008, 0010.
**Non-regression floor:** verified **443/443 green** baseline. No Wave 1 artifact may reduce this count.

---

## Repository reality (verified at authoring time)

| Claim | Status | Evidence |
|---|---|---|
| Target namespace does not yet exist | **CONFIRMED** | `packages/platform-runtime/src/control/constitutional-governance/` is absent; `control/` contains only the existing fabrics (`federation`, `evolution`, `knowledge`, `policy`, `governance`, `readiness`, …). |
| Reuse assets exist | **CONFIRMED** | `persistence-runtime/canonical.ts` (23 LOC), `persistence-runtime/append-only-log.ts` (141 LOC), `control/federation/assertions.ts` (111 LOC), `registry-runtime/registry.ts` (70 LOC), `persistence-runtime/durable-registry-store.ts` (87 LOC), `meta-core/ports.ts` (60 LOC), `control/policy/policy-evaluator.ts` (165 LOC), `control/readiness/meta-governance-engine.ts` (150 LOC), plus `federated-`/`evolution-`/`knowledge-`/`simulation-audit-log.ts`. |
| Construction is additive | **REQUIRED** | Everything below is new under the CGR namespace, except the two EXTEND points named in §B. |

> **Real path note.** The construction package uses the repository-real prefix
> `packages/platform-runtime/src/control/constitutional-governance/` (abbreviated `…/cg/` in tables).
> Reuse targets are cited at their repository-real paths under `packages/platform-runtime/src/`.

---

## A. Wave 1 Executive Summary

Wave 1 constructs the **foundation** of the Constitutional Governance Runtime (CGR): the shared record
schema, the append-only invariant guard, deterministic canonical hashing, the eleven propose-only
registries, the hash-chained audit append + verifier, and the control assembly + test harness that
compose them. Everything binds to the existing substrate **by import-and-compose through ports**;
nothing is reimplemented.

**Component set (18 modules across 18 Wave 1 IDs):**

- **`CGR-CORE-*` (5):** `01` GovernanceRecord schema & shared types; `02` Append-only guard; `03`
  Canonical hashing assembly; `04` Control assembly & barrel; `05` Test harness.
- **`CGR-REG-*` (11):** `PRIN`, `META`, `GOV`, `CENTER`, `DOMAIN`, `POLICY`, `CAP`, `CONSENT`,
  `DECISION`, `TRACE`, `AUDIT` — all built on one shared `ConstitutionalRegistry<T>` base (RG-1..8).
- **`CGR-AU-*` (2):** `CHAIN` hash-chained attributable append (A-1/A-2); `VERIFY` gap/break/tamper
  detection (A-2).

**Foundational invariants delivered in Wave 1:**

1. **Append-only, no mutation/deletion** — every registry write is an append; supersession is a new
   record that links back (`AppendOnlyGuard`, CGR-CORE-02).
2. **Deterministic content addressing** — SHA-256 over recursively key-sorted canonical JSON,
   verify-on-read (CGR-CORE-03), reusing `canonicalStringify` + `node:crypto`.
3. **Propose-only registries** — Wave 1 registries admit records but confer **no ACTIVE status**; no
   activation path exists until Wave 3 (`CGR-CP-ACTIVATE`, out of scope here).
4. **Tamper-evident authority chain** — genesis-anchored hash chain identical in construction to the
   proven federation/evolution/knowledge audit logs (`GENESIS = "0".repeat(64)`; `entry_hash =
   sha256(canonical(entry)|seq|prev_hash|node)`).
5. **Deny-by-default / fail-closed** — the policy registry stores `effect:"deny"` records; the decision
   registry enforces SoD (proposer ≠ certifier ≠ ratifier); unknown/ambiguous states fail closed.

**Reuse posture:** no new substrate, no new persistence layer, no new crypto, no new registry
infrastructure. The append-only log, canonical serializer, crypto assertions, registry adapter,
metadata port, and audit sink are all reused as-is or wrapped.

**Exit condition:** all Wave 1 modules typecheck under the repo TS config, all Wave 1 tests pass, the
443/443 baseline is unchanged (now 443 + Wave 1 additions), determinism/append-only/traceability gates
are green, and the CGR namespace is exported collision-free from `control/index.ts`.

---

## B. Repository Construction Layout

All paths below are **new** except the two EXTEND points at the end.

```
packages/platform-runtime/src/control/constitutional-governance/     # NEW namespace (…/cg/)
├── index.ts                         # CGR-CORE-04  namespace barrel
├── types.ts                         # CGR-CORE-01  GovernanceRecord, enums, DTOs, events
├── append-only.ts                   # CGR-CORE-02  AppendOnlyGuard + E-APPEND-ONLY
├── hashing.ts                       # CGR-CORE-03  canonical SHA-256 + verifyRecordHash
├── governance-control.ts           # CGR-CORE-04  ConstitutionalGovernanceControl assembly
├── test-harness.ts                 # CGR-CORE-05  in-memory fixture factory
│
├── registries/                     # CGR-REG-*  (11 registries + shared base)
│   ├── index.ts
│   ├── registry-base.ts            #            ConstitutionalRegistry<T> (RG-1..8)
│   ├── principle-registry.ts       # CGR-REG-PRIN
│   ├── meta-registry.ts            # CGR-REG-META
│   ├── governance-candidate-registry.ts  # CGR-REG-GOV  (distinct from control/governance/*)
│   ├── center-registry.ts          # CGR-REG-CENTER
│   ├── domain-registry.ts          # CGR-REG-DOMAIN
│   ├── policy-registry.ts          # CGR-REG-POLICY  (deny-by-default)
│   ├── capability-registry.ts      # CGR-REG-CAP
│   ├── consent-registry.ts         # CGR-REG-CONSENT  (revocable)
│   ├── decision-registry.ts        # CGR-REG-DECISION  (SoD)
│   ├── trace-registry.ts           # CGR-REG-TRACE  (8 relations)
│   └── audit-registry.ts           # CGR-REG-AUDIT  (hash-chained entries store)
│
└── audit/                          # CGR-AU-*  (Wave 1 slice; CH-* deferred to Wave 3)
    ├── index.ts
    ├── audit-chain.ts              # CGR-AU-CHAIN  (AuditPort append + hash)
    └── chain-verifier.ts          # CGR-AU-VERIFY (gap/break/tamper verdict)
```

Mirror test tree created in Wave 1:

```
packages/platform-runtime/test/cg/
├── core/          # CGR-CORE-*  unit / determinism / adversarial
├── registries/    # CGR-REG-*   RG-1..8, append-only breach, propose-only
├── audit/         # CGR-AU-*    chain / tamper / gap / reorder
└── system/        # Wave 1 end-to-end + baseline non-regression
```

**EXTEND points (only two files touched outside `…/cg/`):**

1. `packages/platform-runtime/src/control/index.ts` — append
   `export * as cg from "./constitutional-governance/index.ts";` (namespaced, collision-free, mirrors
   the existing `simulation`/`knowledge` exports).
2. `packages/platform-runtime/package.json` — extend the `test` glob to include `test/cg/**/*.test.ts`
   (append only; keep existing globs).

**PROHIBITED targets (never create or modify):** `control/governance/*`, `control/policy/*`,
`meta-core/*`, `registry-runtime/*`, `metadata-runtime/*`, `persistence-runtime/*`, `contracts/*`,
`control/{federation,evolution,knowledge,memory,ontology,operations,simulation,readiness,identity,trust}/*`,
`.claude/authority/*`.

---

## C. Component Construction Specifications

### C.0 Shared conventions (apply to every Wave 1 component)

- **Module system:** ESM, explicit `.ts` import extensions (matches the repo, e.g. `../types.ts`).
- **No I/O in constructors** except log rehydration already provided by reused adapters.
- **Immutability:** every stored record is `Object.freeze`d on write; getters return defensive copies
  (mirrors `InMemoryAuditLog` / `FederatedAuditLog`).
- **Time:** injected `now: number` parameter or `clock()` seam — never a bare `Date.now()` inside
  deterministic paths (enables determinism tests).
- **Errors:** extend the existing `ControlValidationError` (`control/errors.ts`) or `SubstrateError`
  (`meta-core/errors.ts`); do not invent a new base error class. New **codes** only.
- **No new crypto:** all hashing routes through `sha256` + `canonicalize` from
  `control/federation/assertions.ts`, or `canonicalStringify` from `persistence-runtime/canonical.ts`.
- **Type expression note:** interface/DTO shapes below are declarations (signatures only). No method
  bodies / logic are specified — this is a construction artifact.

---

### CGR-CORE-01 — GovernanceRecord Schema & Shared Types

- **Purpose:** define the canonical `GovernanceRecord` envelope, the registry/relation enums, and every
  shared DTO/event used across Wave 1. Single source of type truth for the namespace.
- **Repository location:** `…/cg/types.ts`
- **Files to create:** `types.ts`
- **Interfaces / Types / DTOs:**

  ```ts
  // Enum of the 11 registries (RegistryType) + the 8 trace relations (TraceRelation).
  export type RegistryType =
    | "principle" | "meta" | "governance" | "center" | "domain"
    | "policy" | "capability" | "consent" | "decision" | "trace" | "audit";

  export type TraceRelation =
    | "derives-from" | "refines" | "implements" | "governs"
    | "constrains" | "supersedes" | "depends-on" | "traces-to";

  export type RecordStatus = "proposed" | "superseded" | "revoked"; // NO "active" in Wave 1

  // The canonical envelope every registry record shares.
  export interface GovernanceRecord {
    readonly id: string;                 // stable logical id
    readonly version: SemVer;            // reuse contracts/types.ts SemVer
    readonly registry: RegistryType;
    readonly status: RecordStatus;       // propose-only ⇒ never "active"
    readonly contentHash: string;        // set by CGR-CORE-03 on write
    readonly supersedes?: SupersessionLink; // append-only supersession
    readonly issuedAt: number;
    readonly payload: unknown;           // registry-specific body (typed per registry)
  }

  export interface SupersessionLink {
    readonly targetId: string;
    readonly targetVersion: SemVer;
    readonly reason: string;
  }
  ```

- **Events:** `GovernanceRecordAppended`, `GovernanceRecordSuperseded` (data-only event shapes; emitted
  by registries, consumed by the audit chain).
- **Dependencies:** none (leaf).
- **Reuse targets:** `contracts/types.ts` (`SemVer`, `JsonSchema`, `VersionRange`); `meta-core/ports.ts`
  (`RegistryRecord` shape, referenced for adapter compatibility).
- **Acceptance criteria:** all types compile; `GovernanceRecord` is structurally compatible with a
  `RegistryRecord` projection; no `"active"` value is representable in `RecordStatus`; no import from any
  PROHIBITED path.

---

### CGR-CORE-02 — Append-Only Guard

- **Purpose:** enforce that governance state only ever grows — reject UPDATE and DELETE, permit APPEND
  and supersession-by-new-record. The guard is the invariant seam every registry writes through.
- **Repository location:** `…/cg/append-only.ts`
- **Files to create:** `append-only.ts`
- **Interfaces / Types:**

  ```ts
  export class AppendOnlyGuard {
    // Throws E-APPEND-ONLY if a record with (id,version) already exists (no in-place mutation),
    // or if a supersession targets a non-existent / already-superseded record.
    assertAppendable(candidate: GovernanceRecord, existing: readonly GovernanceRecord[]): void;
    assertSupersession(link: SupersessionLink, existing: readonly GovernanceRecord[]): void;
  }
  ```

- **DTOs / Errors:** error code `E-APPEND-ONLY` (extends `ControlValidationError`), with `{ id, version,
  attemptedOp }` detail.
- **Events:** none (pure guard).
- **Dependencies:** CGR-CORE-01.
- **Reuse targets:** `persistence-runtime/append-only-log.ts` (`InMemoryAppendOnlyLog` /
  `FileAppendOnlyLog` as the durable medium behind registries; the guard enforces the semantic layer
  above the log). `control/errors.ts` (`ControlValidationError`).
- **Acceptance criteria:** duplicate `(id,version)` append rejected; DELETE has no code path; supersession
  of a missing/already-superseded target rejected; guard is pure (no I/O); every rejection is
  `E-APPEND-ONLY`.

---

### CGR-CORE-03 — Canonical Hashing Assembly

- **Purpose:** deterministic content addressing — compute a stable SHA-256 over the canonical
  (recursively key-sorted) JSON of a record's hash-relevant fields, and verify-on-read.
- **Repository location:** `…/cg/hashing.ts`
- **Files to create:** `hashing.ts`
- **Interfaces / Types:**

  ```ts
  // Hash excludes the contentHash field itself (compute over the record minus contentHash).
  export function hashRecord(record: Omit<GovernanceRecord, "contentHash">): string;
  export function verifyRecordHash(record: GovernanceRecord): boolean;
  ```

- **Events:** none.
- **Dependencies:** CGR-CORE-01.
- **Reuse targets:** `persistence-runtime/canonical.ts` (`canonicalStringify`) **or**
  `control/federation/assertions.ts` (`canonicalize` + `sha256`). **Decision:** reuse
  `assertions.ts::{canonicalize, sha256}` so the hash construction is byte-identical to the existing
  audit chains (single canonicalization convention across the platform). `node:crypto` only via that
  module — no direct crypto import in `…/cg/`.
- **Acceptance criteria:** same logical record hashes identically regardless of key insertion order;
  `verifyRecordHash` returns `false` on any single-byte tamper; hash is a 64-char lowercase hex string;
  no dependency on wall-clock or randomness.

---

### CGR-CORE-04 — Control Assembly

- **Purpose:** compose all Wave 1 registries + the audit chain into a single
  `ConstitutionalGovernanceControl` orchestration seam, and expose the namespace barrel.
- **Repository location:** `…/cg/governance-control.ts`, `…/cg/index.ts`
- **Files to create:** `governance-control.ts`, `index.ts`
- **Interfaces / Types:**

  ```ts
  export interface ConstitutionalGovernanceOptions {
    nodeId: string;                          // audit chain node identity
    metadata: MetadataPort;                  // reused substrate port (injected)
    clock?: () => number;                    // deterministic time seam
  }

  export interface ConstitutionalGovernanceControl {
    readonly principles: PrincipleRegistry;
    readonly meta: MetaRegistry;
    readonly governance: GovernanceCandidateRegistry;
    readonly centers: CenterRegistry;
    readonly domains: DomainRegistry;
    readonly policies: CgPolicyRegistry;
    readonly capabilities: CapabilityRegistry;
    readonly consent: ConsentRegistry;
    readonly decisions: DecisionRegistry;
    readonly trace: TraceRegistry;
    readonly audit: AuditChain;              // CGR-AU-CHAIN
  }

  export function createConstitutionalGovernance(
    opts: ConstitutionalGovernanceOptions,
  ): ConstitutionalGovernanceControl;
  ```

- **Events:** re-exports record events; wires registry appends to `audit.record(...)`.
- **Dependencies:** CGR-CORE-01/02/03, all 11 CGR-REG-*, CGR-AU-CHAIN.
- **Reuse targets:** `control/bootstrap.ts` (assembly/wiring pattern); `control/knowledge`/`simulation`
  control-assembly pattern; `meta-core/ports.ts` (`MetadataPort` injection);
  `registry-runtime/registry.ts` (`InMemoryRegistry`) and `metadata-runtime` store as backing adapters.
- **Acceptance criteria:** one call yields a fully wired control; every registry write is mirrored to the
  audit chain; `index.ts` exports the public surface only; adding the barrel to `control/index.ts` causes
  **no** symbol collision (namespaced `cg`); baseline test count unchanged by import.

---

### CGR-CORE-05 — Test Harness

- **Purpose:** governance test infrastructure — in-memory port factories, record fixtures, and a baseline
  pin helper so every Wave 1 test suite constructs a clean, deterministic control.
- **Repository location:** `…/cg/test-harness.ts`
- **Files to create:** `test-harness.ts`
- **Interfaces / Types:**

  ```ts
  export function makeCgFixture(overrides?: Partial<ConstitutionalGovernanceOptions>):
    { control: ConstitutionalGovernanceControl; metadata: MetadataPort; now: () => number };
  export function fixedClock(start?: number): () => number; // deterministic, monotonic
  export function sampleRecord(registry: RegistryType, over?: Partial<GovernanceRecord>): GovernanceRecord;
  ```

- **Events:** none.
- **Dependencies:** CGR-CORE-01 (buildable immediately after CORE-03; used by all suites).
- **Reuse targets:** `registry-runtime/registry.ts` (`InMemoryRegistry`); `metadata-runtime` in-memory
  metadata store; `control/audit-log.ts` (`InMemoryAuditLog`) for baseline comparison; existing
  `test/fixtures/*` conventions.
- **Acceptance criteria:** `makeCgFixture()` returns an isolated control (no shared mutable state between
  calls); `fixedClock` is deterministic; harness itself has zero production imports outside `…/cg/`.

---

### CGR-REG-* — Registry Runtime (shared base first)

#### registry-base — `ConstitutionalRegistry<T>` (RG-1..8)

- **Purpose:** one generic, propose-only, append-only, hash-verified registry base that all 11
  registries specialize. Encodes registry rules RG-1..8 (see §D).
- **Repository location:** `…/cg/registries/registry-base.ts`
- **Interfaces / Types:**

  ```ts
  export abstract class ConstitutionalRegistry<T extends GovernanceRecord> {
    constructor(registry: RegistryType, metadata: MetadataPort, guard: AppendOnlyGuard, clock: () => number);
    propose(record: Omit<T, "contentHash" | "status" | "issuedAt">): T;   // appends; status="proposed"
    supersede(id: string, version: SemVer, next: /*…*/ unknown, reason: string): T;
    get(id: string, version: SemVer): T | undefined;
    history(id: string): readonly T[];      // full append history (oldest first)
    list(): readonly T[];
    protected abstract validate(record: T): void;  // registry-specific rules
  }
  ```

- **Reuse targets:** `meta-core/ports.ts` (`MetadataPort`); `control/governance/governance-registry.ts`
  (prefix-keyed metadata storage pattern — **referenced, not modified**); CGR-CORE-02/03.
- **Acceptance criteria:** RG-1..8 enforced centrally; no registry re-implements storage; every write
  passes through guard + hashing; `history` is complete and ordered.

For each of the eleven registries below: **Files to create** = the single file named; **Dependencies** =
`registry-base` + the row's deps; **Reuse targets** = `MetadataPort` + metadata store unless noted;
**Acceptance** = specialized `validate()` enforced, propose-only (no ACTIVE), append-only history intact,
content hash verified on read.

| Component ID | Purpose | File | Payload DTO | Extra rules | Extra deps |
|---|---|---|---|---|---|
| `CGR-REG-PRIN` | 15 invariant principles | `principle-registry.ts` | `PrincipleRecord` | principle id space closed; immutable once proposed | CORE |
| `CGR-REG-META` | Meta-Constitution M-I..M-XII | `meta-registry.ts` | `MetaArticleRecord` | each article traces to ≥1 principle | REG-PRIN |
| `CGR-REG-GOV` | Governance candidates + generation records | `governance-candidate-registry.ts` | `GovernanceCandidateRecord`, `GenerationRecord` | **candidate-only** (never ACTIVE); distinct from `control/governance/*` | REG-PRIN/META |
| `CGR-REG-CENTER` | Governance centers `PGC-*` | `center-registry.ts` | `CenterRecord` | delegation graph acyclic | REG-PRIN |
| `CGR-REG-DOMAIN` | Domain constitutions `PDC-*` | `domain-registry.ts` | `DomainRecord` | each domain bound to a center | REG-CENTER |
| `CGR-REG-POLICY` | Policies, deny-by-default | `policy-registry.ts` | `CgPolicyRecord` (`effect:"deny"` default) | absent/ambiguous ⇒ deny | REG-DOMAIN |
| `CGR-REG-CAP` | Capability declarations | `capability-registry.ts` | `CapabilityRecord` | each capability bound to domain + policy | REG-DOMAIN/POLICY |
| `CGR-REG-CONSENT` | Consent grants/revocations | `consent-registry.ts` | `ConsentRecord` | revocation = new appended record; never physical delete | CORE |
| `CGR-REG-DECISION` | Decision records | `decision-registry.ts` | `DecisionRecord` | **SoD:** proposer ≠ certifier ≠ ratifier | CORE |
| `CGR-REG-TRACE` | Derivation edges | `trace-registry.ts` | `TraceEdge` (8 relations) | `layer_to ≤ layer_from`; no self-edge | CORE |
| `CGR-REG-AUDIT` | Hash-chained entry store | `audit-registry.ts` | `AuditRecord` (chained) | genesis-anchored; append-only; delegates hashing to AU-CHAIN | CORE-03 |

- **Reuse note for `CGR-REG-GOV`:** shares no keyspace with `control/governance/governance-registry.ts`;
  the metadata prefix is `cg:governance:*` to guarantee collision-freedom.
- **Reuse note for `CGR-REG-DECISION`:** SoD-check pattern mirrors
  `control/readiness/meta-governance-engine.ts` (`sodEnforceable` / `admitCertification`) — pattern
  reused, engine not modified.

---

### CGR-AU-CHAIN — Hash-Chained Attributable Append

- **Purpose:** the `AuditPort` that appends attributable, hash-chained audit entries for every governance
  act (A-1 attribution, A-2 chaining). This is the authority chain's write mechanism.
- **Repository location:** `…/cg/audit/audit-chain.ts`
- **Files to create:** `audit-chain.ts`
- **Interfaces / Types / DTOs:**

  ```ts
  export interface CgAuditEntry {
    readonly seq: number;
    readonly at: number;
    readonly actor: string;         // attributable principal (A-1)
    readonly action: string;        // e.g. "propose","supersede","revoke"
    readonly subjectRef: string;    // id@version of the governed record
    readonly prevHash: string;
    readonly entryHash: string;
    readonly nodeId: string;
  }
  export const CG_GENESIS_HASH: string; // "0".repeat(64)
  export interface AuditPort {
    record(input: Omit<CgAuditEntry, "seq" | "prevHash" | "entryHash" | "nodeId">): CgAuditEntry;
    chain(): readonly CgAuditEntry[];
    export(): { nodeId: string; chain: CgAuditEntry[]; headHash: string };
    readonly headHash: string;
  }
  export class AuditChain implements AuditPort { constructor(nodeId: string, clock?: () => number); }
  ```

- **Events:** consumes `GovernanceRecordAppended` / `GovernanceRecordSuperseded`.
- **Dependencies:** CGR-REG-AUDIT, CGR-CORE-03.
- **Reuse targets (pattern, verbatim construction):** `control/federation/federated-audit-log.ts`,
  `control/evolution/evolution-audit-log.ts`, `control/knowledge/knowledge-audit-log.ts` (all use
  `GENESIS = "0".repeat(64)`, `entryHash = sha256(canonicalize(entry)|seq|prevHash|nodeId)`);
  `control/audit-log.ts` (`AuditSink` surface); `control/federation/assertions.ts` (`sha256`,
  `canonicalize`). **No new crypto.**
- **Acceptance criteria:** first entry links to `CG_GENESIS_HASH`; `entryHash` matches the reused
  construction byte-for-byte; entries are frozen; `export()` is deterministic; append is monotonic in
  `seq`.

---

### CGR-AU-VERIFY — Chain Verifier

- **Purpose:** independent, offline verification of an exported chain — detect gap, prevHash break, and
  entry tamper (A-2). No DB required.
- **Repository location:** `…/cg/audit/chain-verifier.ts`
- **Files to create:** `chain-verifier.ts`
- **Interfaces / Types:**

  ```ts
  export interface ChainVerdict { ok: boolean; reason: string; }
  export function verifyChain(
    exported: { nodeId: string; chain: CgAuditEntry[]; headHash: string },
  ): ChainVerdict;
  ```

- **Events:** none.
- **Dependencies:** CGR-AU-CHAIN.
- **Reuse targets:** the `static verify(...)` construction in `federated-audit-log.ts` /
  `evolution-audit-log.ts` (recompute every hash, confirm `seq` continuity + `prevHash` linkage to head).
- **Acceptance criteria:** intact chain ⇒ `{ok:true}`; seq gap, prevHash break, single-byte tamper, and
  head-hash mismatch each ⇒ `{ok:false, reason:…}`; verifier is pure and dependency-free (no import of
  the live chain instance).

---

## D. Registry Specifications

Common registry rule set **RG-1..8** (enforced by `ConstitutionalRegistry<T>`):

| Rule | Statement |
|---|---|
| RG-1 | **Propose-only.** Records enter as `status:"proposed"`; no registry can set `"active"`. |
| RG-2 | **Append-only.** No update, no delete; state only grows (via CGR-CORE-02). |
| RG-3 | **Content-hashed.** Every record carries a verified `contentHash` (CGR-CORE-03). |
| RG-4 | **Supersession by link.** A change is a new record with a `SupersessionLink`; the prior record moves to `superseded` via a new appended state, not mutation. |
| RG-5 | **Versioned.** `(id, version)` is unique; version must be a valid SemVer (`meta-core/semver.ts`). |
| RG-6 | **Deterministic identity.** Structural equality ⇒ equal `contentHash` (order-independent). |
| RG-7 | **Traceable.** Non-root records must reference their derivation source (enforced per registry). |
| RG-8 | **Auditable.** Every append/supersede emits an audit event to CGR-AU-CHAIN. |

Per-registry specification:

| Registry | Schema (payload) | Ownership model | Lifecycle | Validation rules | Content-hash rules | Version rules | Append-only rules | Traceability |
|---|---|---|---|---|---|---|---|---|
| **PRIN** | `PrincipleRecord{principleId, statement, invariant:true}` | root authority owns; no delegation | proposed → superseded | 15 fixed principle ids; statement non-empty | hash over `{principleId,statement,invariant}` | SemVer; principle ids immutable across versions | supersede-only; original retained | root (no up-trace) |
| **META** | `MetaArticleRecord{article:M-I..M-XII, tracesTo[]}` | root authority | proposed → superseded | each article traces ≥1 PRIN id that exists | over `{article,tracesTo}` | SemVer | supersede-only | up-trace → PRIN |
| **GOV** | `GovernanceCandidateRecord`, `GenerationRecord{inputsHash,rulesetVersion}` | compiler runtime (Wave 2) proposes; Wave 1 stores only | proposed (candidate) — **never active** | candidate must reference a `GenerationRecord` | over full candidate body incl. `inputsHash` | SemVer | append-only; candidates never rewritten | up-trace → PRIN/META |
| **CENTER** | `CenterRecord{centerId:PGC-*, delegatesTo[]}` | root authority | proposed → superseded | delegation graph must stay acyclic | over `{centerId,delegatesTo}` | SemVer | supersede-only | up-trace → PRIN |
| **DOMAIN** | `DomainRecord{domainId:PDC-*, centerRef}` | owning center | proposed → superseded | `centerRef` must resolve to an existing CENTER | over `{domainId,centerRef}` | SemVer | supersede-only | up-trace → CENTER |
| **POLICY** | `CgPolicyRecord{target?, effect:"deny"|"allow", rules[]}` | owning domain | proposed → superseded | absent/ambiguous ⇒ deny (deny-by-default) | over full policy body | SemVer | supersede-only | up-trace → DOMAIN |
| **CAP** | `CapabilityRecord{capId, domainRef, policyRef}` | owning domain | proposed → superseded | `domainRef` + `policyRef` must resolve | over `{capId,domainRef,policyRef}` | SemVer | supersede-only | up-trace → DOMAIN/POLICY |
| **CONSENT** | `ConsentRecord{subject, grantee, scope, granted:boolean}` | subject | proposed → revoked (revocable) | revocation is a new appended record | over full body incl. `granted` | SemVer | append-only; revoke = new record | up-trace → CAP/POLICY |
| **DECISION** | `DecisionRecord{proposer, certifier, ratifier, subjectRef, verdict}` | decision body | proposed → superseded | **SoD:** proposer ≠ certifier ≠ ratifier | over full body | SemVer | append-only | up-trace → subjectRef |
| **TRACE** | `TraceEdge{from, to, relation:TraceRelation, layerFrom, layerTo}` | derivation author | proposed | `layerTo ≤ layerFrom`; no self-edge; relation ∈ 8 | over `{from,to,relation}` | SemVer | append-only; edges never removed | is itself the traceability substrate |
| **AUDIT** | `AuditRecord` = frozen `CgAuditEntry` projection | audit runtime | append-only | genesis-anchored; seq monotonic | `entryHash` = AU-CHAIN construction | seq is the version axis | append-only, no supersession | links every governed record |

---

## E. Authority Chain Specifications

- **Chain record structure:** `CgAuditEntry{ seq, at, actor, action, subjectRef, prevHash, entryHash,
  nodeId }` (see CGR-AU-CHAIN). `actor` provides attribution (A-1); `subjectRef` = `id@version`.
- **Hash structure:** `entryHash = sha256( canonicalize(entryWithoutHashes) | seq | prevHash | nodeId )`,
  where `sha256` and `canonicalize` are the reused primitives from `control/federation/assertions.ts`.
  Genesis: `prevHash(seq=0) = CG_GENESIS_HASH = "0".repeat(64)`. `headHash` = last `entryHash` (or
  genesis when empty). **Identical construction to the federation/evolution/knowledge chains.**
- **Verification process (CGR-AU-VERIFY):** iterate the exported chain; for each index `i` assert
  `seq === i`, `prevHash === prev`, and `recompute(entryHash) === entryHash`; carry `prev = entryHash`;
  finally assert `prev === headHash`. Any failure returns `{ok:false, reason}`.
- **Replay process:** given the ordered chain, re-append each entry into a fresh `AuditChain` (same
  `nodeId`) and confirm the recomputed `headHash` equals the exported `headHash` — deterministic
  reconstruction of authority state.
- **Failure modes:** `seq gap at index i`; `prevHash break at seq i`; `entryHash mismatch at seq i
  (tamper)`; `head hash mismatch`. All fail-closed (verdict `ok:false`).
- **Determinism requirements:** hashing depends only on entry content + position + nodeId (no clock, no
  randomness in the hash inputs; `at` is a recorded field, injected via `clock()` seam). Same input
  sequence ⇒ identical chain and headHash on any machine.

---

## F. Reuse Binding Matrix

| CGR component | Reuse target (repository-real) | Binding kind | Prohibited reimplementation |
|---|---|---|---|
| CGR-CORE-01 | `contracts/types.ts`, `meta-core/ports.ts` | **Reuse as-is** (import types) | Redefining `SemVer`/`RegistryRecord` |
| CGR-CORE-02 | `persistence-runtime/append-only-log.ts`; `control/errors.ts` | **Wrap** (semantic guard over log) | New durable log; new error base |
| CGR-CORE-03 | `control/federation/assertions.ts` (`sha256`,`canonicalize`); `persistence-runtime/canonical.ts` | **Reuse as-is** | Any new hash/canonicalizer; direct `node:crypto` in `…/cg/` |
| CGR-CORE-04 | `control/bootstrap.ts`; `knowledge`/`simulation` assembly pattern; `meta-core/ports.ts` | **Adapter/compose** | Forking bootstrap; new port definitions |
| CGR-CORE-05 | `registry-runtime/registry.ts`; `metadata-runtime` store; `control/audit-log.ts` | **Reuse as-is** (fixtures) | New in-memory registry/store |
| CGR-REG-base | `meta-core/ports.ts` (`MetadataPort`); `meta-core/semver.ts` | **Reuse as-is** | New metadata storage; new semver |
| CGR-REG-GOV | `control/evolution/evolution-proposal.ts` (candidate pattern) | **Pattern reuse** | Touching `control/governance/*` |
| CGR-REG-DECISION | `control/readiness/meta-governance-engine.ts` (SoD pattern) | **Pattern reuse** | Modifying the readiness engine |
| CGR-REG-POLICY | `control/policy/policy-evaluator.ts` (deny-by-default pattern) | **Pattern reuse** | Modifying `control/policy/*` |
| CGR-REG-AUDIT | `control/audit-log.ts` (`AuditSink`); `append-only-log.ts` | **Wrap** | New audit sink surface |
| CGR-AU-CHAIN | `federated-`/`evolution-`/`knowledge-audit-log.ts`; `assertions.ts` | **Extend/pattern reuse** | New crypto; new chain construction |
| CGR-AU-VERIFY | `*-audit-log.ts` `static verify` construction | **Pattern reuse** | New verification algorithm |

**Global prohibitions:** no new substrate, no new persistence layer, no new crypto implementation, no new
registry infrastructure, no modification of any PROHIBITED path (§B).

---

## G. Test Construction Package

Test tree: `packages/platform-runtime/test/cg/{core,registries,audit,system}/`. Runner: existing repo
`node --test` convention; suites added to the `test/cg/**/*.test.ts` glob (EXTEND point 2).

| Component | Unit | Integration | Determinism | Adversarial | Regression | Coverage floor |
|---|---|---|---|---|---|---|
| CORE-01 types | type-level round-trip; `RecordStatus` excludes `"active"` | consumed by a registry fixture | — | attempt to construct `"active"` (compile-fail proof) | baseline import adds 0 failures | 100% of exported types referenced |
| CORE-02 guard | dup `(id,version)` rejected; DELETE absent | registry write path uses guard | — | forged supersession of missing/superseded target | — | 100% branch on guard |
| CORE-03 hashing | stable hash; key-order independence | hash set on registry write, verified on read | same record → same hash across runs/machines | single-byte tamper ⇒ verify false | — | 100% branch |
| CORE-04 assembly | `createConstitutionalGovernance` wires all 11 + audit | write mirrored to audit chain | fixed clock ⇒ identical audit head | double-init isolation (no shared state) | `control/index.ts` export adds 0 collisions | all registries reachable |
| CORE-05 harness | fixture isolation; `fixedClock` monotonic | used by every suite | deterministic fixtures | — | — | — |
| REG (each) | propose/get/history/list; specialized `validate()` | metadata store round-trip; audit emit | order-independent hash | append-only breach; SoD/acyclic/deny violations; propose-only (reject any ACTIVE attempt) | history intact after N appends | RG-1..8 each covered |
| AU-CHAIN | genesis link; monotonic seq; frozen entries | wired from registry writes | identical chain+head for identical sequence | mutate exported entry then verify | matches reused construction | 100% branch |
| AU-VERIFY | intact ⇒ ok | verify a live-exported chain | deterministic verdict | seq gap, prevHash break, tamper, head mismatch each ⇒ fail | — | all 4 failure modes |

**System suite:** end-to-end lifecycle (propose principle → meta → center → domain → policy → capability
→ decision → trace → audit → export → verify); **baseline non-regression** (assert prior 443 tests still
pass alongside Wave 1 additions); adversarial composite (tamper anywhere in the chain is detected).

---

## H. Wave 1 Dependency Graph (exact build order)

No component precedes its dependencies.

```
 1. CGR-CORE-01  types.ts                     (leaf)
 2. CGR-CORE-03  hashing.ts                    ← 01
 3. CGR-CORE-02  append-only.ts                ← 01
 4. CGR-CORE-05  test-harness.ts               ← 01   (available for all suites)
 5. registry-base.ts (ConstitutionalRegistry)  ← 01,02,03
 6. CGR-REG-PRIN                                ← base
 7. CGR-REG-META                               ← PRIN
 8. CGR-REG-GOV                                 ← PRIN,META
 9. CGR-REG-CENTER                              ← PRIN
10. CGR-REG-DOMAIN                              ← CENTER
11. CGR-REG-POLICY                             ← DOMAIN
12. CGR-REG-CAP                                ← DOMAIN,POLICY
13. CGR-REG-CONSENT                            ← base
14. CGR-REG-DECISION                           ← base
15. CGR-REG-TRACE                              ← base
16. CGR-REG-AUDIT                              ← CORE-03, base
17. CGR-AU-CHAIN  audit-chain.ts               ← REG-AUDIT, CORE-03
18. CGR-AU-VERIFY chain-verifier.ts            ← AU-CHAIN
19. CGR-CORE-04  governance-control.ts, index.ts ← ALL of the above
20. EXTEND: control/index.ts barrel export; package.json test glob
```

Topological guarantee: 1→4 form the core; 5 gates all registries; 6→16 respect the registry
cross-references (META→PRIN, DOMAIN→CENTER, CAP→DOMAIN+POLICY); 17→18 are the authority chain; 19
composes everything; 20 wires the namespace into the tree last.

---

## I. Wave 1 Acceptance Matrix

| Component | Build complete | Validation | Failure | Escalation |
|---|---|---|---|---|
| CORE-01 | file compiles; types exported | consumed by ≥1 registry fixture | any PROHIBITED import; `"active"` representable | halt Wave; fix schema |
| CORE-02 | guard compiles | dup + forged-supersession rejected | mutation/delete path exists | halt; guard redesign |
| CORE-03 | compiles | determinism + tamper tests green | non-deterministic hash | halt; revert to reused canonicalizer |
| REG-base | compiles | RG-1..8 unit-proven | any RG rule bypassable | halt; base redesign |
| REG-* (11) | each compiles | specialized `validate` + propose-only + append-only green | ACTIVE settable; append-only breach; cross-ref unresolved | halt affected registry; fix |
| AU-CHAIN | compiles | genesis+monotonic+determinism green | hash construction diverges from reused chains | halt; re-bind to `assertions.ts` |
| AU-VERIFY | compiles | 4 failure modes each detected | any tamper undetected | **security escalation** (fail-closed breach) |
| CORE-04 | compiles; all wired | e2e lifecycle green; audit mirrored | registry unreachable; collision on barrel export | halt; assembly fix |
| CORE-05 | compiles | fixtures isolated & deterministic | shared mutable state across fixtures | halt; harness fix |

**Wave-level acceptance:** all 18 IDs build-complete + validated; 443/443 baseline intact; no PROHIBITED
path modified beyond the two EXTEND points.

---

## J. Wave 1 Exit Gates

| Gate | Condition |
|---|---|
| **TypeScript** | `…/cg/**` compiles under the repo TS config with zero errors; no `any` leakage on public surfaces; strict null checks satisfied. |
| **Test** | every Wave 1 suite passes; total suite = **443 baseline + Wave 1 additions**, all green; zero baseline regressions. |
| **Determinism** | CORE-03 hash and AU-CHAIN head are identical across repeated runs and machines given identical inputs; fixed-clock fixtures reproduce byte-identical audit exports. |
| **Append-only** | no code path performs update/delete on any registry record; every mutation attempt is `E-APPEND-ONLY`; supersession only via appended linked record. |
| **Traceability** | every non-root registry record resolves its up-trace reference; TRACE edges satisfy `layerTo ≤ layerFrom`, acyclic, 8-relation closed. |
| **Authority** | AU-VERIFY detects gap/break/tamper/head-mismatch (all four); genesis anchoring confirmed; chain construction byte-identical to the reused federation/evolution/knowledge audit logs; propose-only confirmed (no ACTIVE conferrable in Wave 1). |

All gates are **blocking** and **fail-closed**: a failed gate halts Wave 1 promotion.

---

## K. Final Wave 1 Backlog (exact execution order)

| # | Backlog item | Component ID | Deliverable file(s) | Gate to clear |
|---|---|---|---|---|
| 1 | Create namespace dir + shared types & enums | CGR-CORE-01 | `cg/types.ts` | TS |
| 2 | Canonical hashing + verify-on-read | CGR-CORE-03 | `cg/hashing.ts` | TS, Determinism |
| 3 | Append-only guard + `E-APPEND-ONLY` | CGR-CORE-02 | `cg/append-only.ts` | TS, Append-only |
| 4 | Test harness (fixtures, fixed clock) | CGR-CORE-05 | `cg/test-harness.ts` | TS |
| 5 | `ConstitutionalRegistry<T>` base (RG-1..8) | CGR-REG-base | `cg/registries/registry-base.ts` | TS, Append-only |
| 6 | Principle registry (15 invariants) | CGR-REG-PRIN | `cg/registries/principle-registry.ts` | TS, Test |
| 7 | Meta-Constitution registry (M-I..M-XII) | CGR-REG-META | `cg/registries/meta-registry.ts` | TS, Traceability |
| 8 | Governance candidate + generation records | CGR-REG-GOV | `cg/registries/governance-candidate-registry.ts` | TS, Test |
| 9 | Center registry (acyclic delegation) | CGR-REG-CENTER | `cg/registries/center-registry.ts` | TS, Test |
| 10 | Domain registry (bound to center) | CGR-REG-DOMAIN | `cg/registries/domain-registry.ts` | TS, Traceability |
| 11 | Policy registry (deny-by-default) | CGR-REG-POLICY | `cg/registries/policy-registry.ts` | TS, Test |
| 12 | Capability registry (domain+policy) | CGR-REG-CAP | `cg/registries/capability-registry.ts` | TS, Traceability |
| 13 | Consent registry (revocable) | CGR-REG-CONSENT | `cg/registries/consent-registry.ts` | TS, Append-only |
| 14 | Decision registry (SoD) | CGR-REG-DECISION | `cg/registries/decision-registry.ts` | TS, Test |
| 15 | Trace registry (8 relations, layer rule) | CGR-REG-TRACE | `cg/registries/trace-registry.ts` | TS, Traceability |
| 16 | Audit registry (chained entry store) | CGR-REG-AUDIT | `cg/registries/audit-registry.ts` | TS, Append-only |
| 17 | Registries barrel | — | `cg/registries/index.ts` | TS |
| 18 | Audit chain (AuditPort append+hash) | CGR-AU-CHAIN | `cg/audit/audit-chain.ts` | TS, Determinism, Authority |
| 19 | Chain verifier (gap/break/tamper) | CGR-AU-VERIFY | `cg/audit/chain-verifier.ts` | TS, Authority |
| 20 | Audit barrel | — | `cg/audit/index.ts` | TS |
| 21 | Control assembly + factory | CGR-CORE-04 | `cg/governance-control.ts` | TS, Test |
| 22 | Namespace barrel | CGR-CORE-04 | `cg/index.ts` | TS |
| 23 | EXTEND: `control/index.ts` namespaced export | — | `control/index.ts` (append 1 line) | TS, Test |
| 24 | EXTEND: `package.json` test glob | — | `packages/platform-runtime/package.json` | Test |
| 25 | Wave 1 test suites (core/registries/audit) | all | `test/cg/{core,registries,audit}/*.test.ts` | Test, Determinism, Append-only, Authority |
| 26 | Wave 1 system + baseline non-regression suite | all | `test/cg/system/*.test.ts` | All gates |

**Wave 1 done-definition:** items 1–26 complete; all six exit gates (§J) green; 443/443 baseline
preserved; only the two EXTEND points touched outside `…/cg/`.

---

*End of PCAMG-RUNTIME-0011 — Wave 1 Construction Package. Construction-ready and implementation-ready.*
