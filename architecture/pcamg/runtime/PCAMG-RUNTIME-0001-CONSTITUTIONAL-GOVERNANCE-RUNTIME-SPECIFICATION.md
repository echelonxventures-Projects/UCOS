# PCAMG-RUNTIME-0001 — Constitutional Governance Runtime Specification

> **STATUS: PROPOSED — NOT ENROLLED**
> RUNTIME ARCHITECTURE SPECIFICATION · NOT RATIFIED · NOT CONSTITUTIONAL LAW · NOT IMPLEMENTATION AUTHORIZED
> DOES NOT SUPERSEDE `AUTH-001..012` OR `UCOS-CONST-001` · DOES NOT OVERRIDE AUTH-012 · DOES NOT RELEASE ARTICLE IX
> APPEND-ONLY · REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `PCAMG-RUNTIME-0001` |
| Name | Constitutional Governance Runtime Specification |
| Program | PCAMG Runtime Implementation — **Constitutional Governance Runtime** |
| Classification | **PROPOSED — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **RUNTIME ARCHITECTURE SPECIFICATION** — no code, no infrastructure, no enrollment, no lock release |
| Realizes | `PCAMG-0000` through `PCAMG-0008` at the runtime layer |
| Grounds on | `SPEC-GOVERNANCE-REGISTRIES`, `SPEC-TRACEABILITY-FRAMEWORK`, `SPEC-CONSTITUTIONAL-VALIDATION-RULES`, `SPEC-GOVERNANCE-COMPILER-RULES`, `SPEC-CONSTITUTIONAL-COMPLIANCE-FRAMEWORK` |
| Invariants enforced | Append-only (INV-10), tamper-evidence (INV-CORE-02), determinism (INV-6), single-owner (PRIN-005), deny-by-default (S1) |
| Date | 2026-07-05 |
| Version | 1.0.0 |
| **Determination** | **RUNTIME ARCHITECTURE COMPLETE — READY FOR AUTHORITY BOARD REVIEW** (specification only; no construction authorized) |

> **Governing disclaimer — RUNTIME *ARCHITECTURE*, NOT RUNTIME *CONSTRUCTION*.** DESIGN / PROPOSAL / 
> AUTHORIZATION-READINESS ONLY · **NO SOURCE CODE · NO RUNTIME · NO INFRASTRUCTURE · NO SERVICES · NO 
> CONSTRUCTION** produced or authorized by this document. This specification defines *what would be built* 
> and proves it can be built additively with zero prohibited-core-dir change; it does **not** authorize the 
> build, release Article IX, or enroll any governance doctrine. Construction of the Constitutional Governance 
> Runtime remains **NOT AUTHORIZED** pending a separate Authority Board act.

---

## Executive Summary

This document realizes the **Constitutional Governance Runtime** as a runtime-capable architecture by 
transforming the PCAMG Foundation foundations (`PCAMG-0000` through `PCAMG-0008`) into executable 
specifications while preserving all governance constraints:

- **Principle-Centric**: Every governance artifact derives from and proves compliance with Layer-0 invariant 
  principles (`PCAMG-0000/0002`)
- **Registry-Driven**: All governance content is registry records, never hardcoded (IP-01/IP-02)
- **Fail-Closed**: Deny-by-default; ambiguous lookups reject; no partial results (S1, PRIN-006)
- **Deterministic**: Identical inputs yield identical outputs with reproducible hashes (INV-6)
- **Append-Only**: No mutation; supersession with links; audit-chained (INV-10, PRIN-006)
- **Traceable**: Complete up-trace from every artifact to ≥1 invariant principle (PRIN-004)

**Determination**: Constitutional Governance Runtime architecture is **COMPLETE — READY FOR AUTHORIZATION 
REVIEW** (design-only). This artifact specifies *what would be built* and proves it can be built additively 
with zero prohibited-core-dir change; it does **not** authorize the build, release Article IX, or enroll 
any invariant principle. Construction remains **NOT AUTHORIZED** pending a separate Authority Board act.

---


## SECTION 1 — Runtime Architecture

### 1.1 Architecture Overview

The Constitutional Governance Runtime implements eleven governance registries, a traceability graph engine, 
four validation/compilation engines, and a four-stage compliance proof system as a cohesive runtime architecture.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                      Constitutional Governance Runtime                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Layer 0-8 Governance Registries (11 total)                               │ │
│  │  REG-PRIN  REG-META  REG-GOV  REG-CENTER  REG-DOMAIN  REG-POLICY         │ │
│  │  REG-CAP   REG-CONSENT  REG-DECISION  REG-TRACE  REG-AUDIT               │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Authority Resolution Engine                                               │ │
│  │  • Principle lookup & validation  • Authority chain resolution            │ │
│  │  • Conflict detection             • Supremacy enforcement                 │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Principle Validation Engine                                               │ │
│  │  • VR-P* rules (well-formedness)  • VR-C* rules (principle conformance)  │ │
│  │  • VR-M* rules (meta-constitution)• VR-T* rules (traceability)           │ │
│  │  • VR-D* rules (determinism)      • VR-S* rules (security)               │ │
│  │  • VR-G* rules (governance)                                               │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Governance Compiler                                                       │ │
│  │  • CR-1..12 compilation rules     • Generation record production         │ │
│  │  • Determinism verification       • Error cataloging (CE-*)              │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Governance Graph Model (Traceability)                                     │ │
│  │  • Up-trace verification (T-1)    • Acyclic enforcement (T-5)            │ │
│  │  • Impact analysis (T-DOWN)       • Derivation edges (8 relations)       │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Constitutional Compliance Runtime                                         │ │
│  │  Stage 1: Principle Compliance  →  Stage 2: Constitutional Compliance    │ │
│  │  Stage 3: Governance Compliance →  Stage 4: Operational Compliance       │ │
│  │  Verdict: ACTIVATE | REJECT (fail-closed, ordered stages)                │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Audit & Chronicle System                                                  │ │
│  │  • Hash-chained append-only audit • Offline verifiability (A-3)          │ │
│  │  • Attribution (A-1)              • Reproducibility (A-4)                 │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Runtime Integration with UCOS Substrate

The Constitutional Governance Runtime integrates with the ratified UCOS substrate (`PI-2/3`) as an additive 
control fabric:

- **Metadata integration**: Governance registries resolve through `metadata-runtime` (ADR-005)
- **Registry integration**: Built on `registry-runtime` substrate (ADR-004)
- **Evolution integration**: All governance commits route through Evolution Fabric (PI-6 / AD-0019)
- **Federation integration**: Cross-node governance respects Federation Fabric sovereignty (PI-5 / AD-0018)
- **Audit integration**: Hash-chained audit extends existing fabric audit patterns

**Additive guarantees**:
- Zero prohibited-core-dir modification (`meta-core`, `registry-runtime`, `metadata-runtime`, 
  `configuration-runtime`, `contracts`)
- New control-layer modules only: `src/control/governance/*`
- Baseline test suite remains green (≥254/254)



---

## SECTION 2 — Governance Registry Schemas

### 2.1 Registry Architecture Principles

All eleven governance registries conform to `SPEC-GOVERNANCE-REGISTRIES` requirements RG-1 through RG-8:

| Requirement | Enforcement Mechanism |
|-------------|----------------------|
| RG-1: Single Source of Truth | Every governance value resolves from exactly one registry record |
| RG-2: Append-Only (INV-10) | No UPDATE/DELETE; supersession via links; trigger-enforced |
| RG-3: Single Owner (PRIN-005) | Every record declares exactly one `owner_authority` |
| RG-4: Mandatory Up-Trace | Every record (except Layer-0 principles) traces to ≥1 `PCAMG-PRIN-*` |
| RG-5: Tamper-Evidence | Content hash + audit chain; verification on read |
| RG-6: Determinism (INV-6) | Reproducible hashes; canonical serialization |
| RG-7: Secrets By-Reference (S3) | No inline secrets; `secret_ref` URIs only |
| RG-8: Fail-Closed Lookup | Ambiguous/unresolved → error; no default assumptions |

### 2.2 Common Registry Record Schema

Every governance registry record embeds these mandatory fields (applied per-table):

```typescript
interface GovernanceRecord {
  record_uuid: UUID;                    // Immutable identity (primary key)
  registry: RegistryType;               // 'REG-PRIN' | 'REG-META' | ...
  logical_id: string;                   // Namespaced ID (e.g., 'PCAMG-PRIN-001')
  version: SemVer;                      // Immutable version
  owner_authority: string;              // Single accountable owner (PRIN-005)
  status: 'PROPOSED' | 'ACTIVE' | 'SUPERSEDED' | 'RETIRED';
  supersedes?: UUID;                    // Append-only lineage link
  audit_ref: UUID;                      // Hash-chained audit entry
  content: Record<string, unknown>;     // Registry-specific body
  content_hash: Bytes;                  // SHA-256(canonical(content))
  created_at: Timestamp;
  created_by: string;                   // Attributable (A-1)
}
```

### 2.3 Eleven Governance Registries

#### REG-PRIN — Invariant Principles Registry (Layer 0)
**Source**: `PCAMG-0000`, `PCAMG-0002`  
**Records**: 15 invariant principles (PCAMG-PRIN-001 through PCAMG-PRIN-015)  
**Additional fields**:
- `principle_uuid: UUID` — Permanent UUID from PCAMG-0000
- `mutability: 'immutable' | 'amend-restricted' | 'amend-open'`
- `direction_constraint: string` — 'strengthen-only' | 'bidirectional'

**Content schema** (9 mandated attributes per PCAMG-0000 §2):
```typescript
{
  name: string;
  description: string;
  rationale: string;
  constraints: string[];
  validation_rules: string[];        // → VR-* references
  compliance_rules: string[];        // → compliance framework
  amendment_rules: {
    authority: string;
    quorum: string;
    direction_constraint: string;
  };
  audit_requirements: string[];
  subsumes: string[];                // Up-trace to P*/IP*/INV*/INV-CORE-*
}
```

#### REG-META — Meta-Constitution Registry (Layer 1)
**Source**: `PCAMG-0003`  
**Records**: Articles M-I through M-XII  
**Additional fields**:
- `article: string` — Article identifier (M-I, M-II, ...)

**Content schema**:
```typescript
{
  article_name: string;
  article_text: string;
  governs: string;                   // What the article governs
  principle_derivation: string[];    // → PCAMG-PRIN-* UUIDs
  amendment_rules: Record<string, unknown>;
}
```

#### REG-GOV — Generated Governance Systems (Layer 2)
**Source**: `PCAMG-0004` (Governance Generation Framework)  
**Records**: Generated governance models + generation records  
**Additional fields**:
- `generation_record: Record<string, unknown>` — Inputs, rules applied, determinism proof
- `determinism_hash: Bytes` — Reproducible from inputs (CR-9)

**Content schema**:
```typescript
{
  purpose: string;
  scope: string;
  principle_derivation: string[];    // → PCAMG-PRIN-* UUIDs
  decision_rights: Record<string, unknown>;
  escalation_path: string[];
  separation_of_duties: Record<string, unknown>;
  validation_record_ref: UUID;
}
```

#### REG-CENTER — Governance Centers (Layer 3)
**Source**: `PCAMG-0005` (Polycentric Governance Network)  
**Records**: Governance centers (PGC-*) with delegation hierarchies  
**Additional fields**:
- `parent_center?: UUID` — Acyclic delegation tree (VR-G3)

**Content schema**:
```typescript
{
  center_name: string;
  jurisdiction: string;
  delegated_authority: string[];
  delegation_constraints: string[];
  escalation_rules: Record<string, unknown>;
}
```

#### REG-DOMAIN — Domain Constitutions (Layer 4)
**Source**: `PCAMG-0005` (8 polycentric domains)  
**Records**: Domain constitutions (PDC-GOV-*, PDC-SEC-*, ...)  
**Additional fields**:
- `federation_membership: string[]` — Cross-domain federation

**Content schema**:
```typescript
{
  domain_name: string;
  domain_scope: string;
  constitution_articles: Record<string, unknown>;
  decision_rights: Record<string, unknown>;
  policy_authority: string;
  principle_derivation: string[];    // → PCAMG-PRIN-* UUIDs
}
```



#### REG-POLICY — Policies (Layer 5)
**Records**: Policy declarations with deny-by-default enforcement  
**Additional fields**:
- `domain_ref: UUID` — Owning domain constitution
- `effect: 'permit' | 'deny'` — Default 'deny' (S1)

**Content schema**:
```typescript
{
  policy_name: string;
  scope: Record<string, unknown>;
  rules: Record<string, unknown>[];
  evaluation_mode: 'pre-commit' | 'post-commit' | 'continuous';
  principle_conformance: string[];   // → PCAMG-PRIN-* UUIDs
}
```

#### REG-CAP — Capabilities (Layer 6)
**Records**: Capability declarations (CAP-01 through CAP-19)  
**Content schema**:
```typescript
{
  capability_name: string;
  purpose: string;
  provides: string[];
  requires: string[];
  governance_binding: UUID;          // → REG-DOMAIN or REG-POLICY
  principle_conformance: string[];
}
```

#### REG-CONSENT — Consent Records (Layer 7)
**Source**: `PCAMG-8000`  
**Records**: Consent grants and revocations (PRIN-003)  
**Additional fields**:
- `subject_principal: string` — Identity of consenting party
- `scope: Record<string, unknown>` — What consent covers
- `granted: boolean` — True for grant, false for revocation
- `revoked_by?: UUID` — Superseding revocation record

**Content schema**:
```typescript
{
  consent_type: string;
  purpose: string;
  scope_bounds: Record<string, unknown>;
  time_bounds: {
    granted_at: Timestamp;
    expires_at?: Timestamp;
  };
  revocable: boolean;                // Always true (PRIN-003)
}
```

#### REG-DECISION — Decision Records (AUTH-012 analog)
**Records**: Authority Board decisions, amendments, and authorizations  
**Additional fields**:
- `ledger_version: string` — Monotonic AUTH-012 ledger version
- `quorum: string` — Approval quorum type
- `proposer: string` — Separation of duties (VR-G2)
- `certifier: string` — Must differ from proposer
- `ratifier: string` — Must differ from proposer and certifier

**Content schema**:
```typescript
{
  decision_type: 'AUTHORIZATION' | 'AMENDMENT' | 'RATIFICATION' | 'REVOCATION';
  decision_text: string;
  rationale: string;
  affected_artifacts: string[];
  effective_date: Timestamp;
}
```

#### REG-TRACE — Traceability Edges
**Source**: `SPEC-TRACEABILITY-FRAMEWORK`  
**Records**: Derivation edges between artifacts across layers  
**Additional fields**:
- `from_ref: string` — Source artifact (id@version)
- `to_ref: string` — Target artifact (principle or parent)
- `relation: EdgeRelation` — Type of derivation
- `layer_from: 0..8` — Source layer
- `layer_to: 0..8` — Target layer (must be ≤ source, T-2)

**Edge relations**:
- `derives-from`: Authority derivation (upward)
- `refines`: Specialization of parent
- `realizes`: Implementation of spec
- `governed-by`: Subject to governance
- `subsumed-by`: Included in scope of parent

**Content schema**:
```typescript
{
  edge_type: EdgeRelation;
  rationale: string;
  created_by_act: string;            // Decision/generation act that created edge
  auditor: string;                   // Who verified the edge
}
```

#### REG-AUDIT — Hash-Chained Audit Log
**Records**: Immutable, hash-chained governance audit entries  
**Additional fields**:
- `seq: bigint` — Total order sequence
- `actor: string` — Who performed the action (A-1)
- `action: string` — Action type (PROPOSE, ACTIVATE, SUPERSEDE, ...)
- `subject_ref: string` — Artifact affected
- `prev_hash: Bytes` — Link to previous entry (A-2)
- `entry_hash: Bytes` — SHA-256(prev_hash || canonical(payload) || seq || actor)

**Content schema** (payload):
```typescript
{
  action_detail: Record<string, unknown>;
  timestamp: Timestamp;
  context: Record<string, unknown>;
}
```

### 2.4 Registry Integrity Guarantees

All registries enforce these runtime guarantees:

1. **Append-Only (INV-10)**: Mutation triggers reject UPDATE/DELETE operations
2. **Content Hash**: Computed on insert; verified on read
3. **Audit Chain**: Every record references its audit entry; chain verified continuously
4. **Deterministic Serialization**: Canonical JSON key-sorting for reproducible hashes
5. **Version Immutability**: `(logical_id, version)` is unique and immutable
6. **Supersession Links**: Retired records link to their successor; never deleted



---

## SECTION 3 — Authority Resolution Engine

### 3.1 Purpose

The Authority Resolution Engine resolves governance questions against the Layer-0 through Layer-8 hierarchy 
and enforces supremacy rules. It answers: "What principle/constitution/policy governs this artifact?" and 
"Does this artifact conform to its authority?"

### 3.2 Resolution Algorithm

```typescript
function resolveAuthority(artifactRef: string): AuthorityChain {
  // 1. Resolve artifact record from its registry
  const artifact = registryLookup(artifactRef);
  if (!artifact) throw FailClosedError('artifact-not-found');
  
  // 2. Extract principle derivation from artifact content
  const principles = artifact.content.principle_derivation || [];
  if (principles.length === 0) throw ValidationError('VR-T1-orphan');
  
  // 3. Resolve each principle record
  const principleRecords = principles.map(uuid => 
    registryLookup(`REG-PRIN`, { principle_uuid: uuid })
  );
  
  // 4. Build authority chain: artifact → domain → meta → principles
  const chain: AuthorityChain = {
    artifact: artifactRef,
    principles: principleRecords.map(p => p.logical_id),
    meta_articles: extractMetaArticles(artifact),
    domain: artifact.content.domain_ref,
    complete: principleRecords.length > 0
  };
  
  // 5. Verify chain completeness (T-1: complete up-trace)
  if (!chain.complete) throw ValidationError('VR-T1-incomplete');
  
  return chain;
}
```

### 3.3 Supremacy Enforcement

The engine enforces the Layer-0 supremacy rule (PCAMG-1000 M-I): on any conflict between an artifact and a 
registered invariant principle, **the principle prevails**.

```typescript
function enforceSupremacy(
  artifact: GovernanceRecord,
  principle: PrincipleRecord
): SupremacyVerdict {
  // Check if artifact violates principle constraints
  const violations = principle.content.constraints
    .filter(constraint => violatesConstraint(artifact, constraint));
  
  if (violations.length > 0) {
    return {
      verdict: 'REJECT',
      reason: 'principle-violation',
      violations: violations,
      principle_prevails: principle.logical_id
    };
  }
  
  return { verdict: 'CONFORM', principle_prevails: null };
}
```

### 3.4 Conflict Detection

When multiple principles apply to an artifact, the engine detects contradictions per `PCAMG-6000`:

```typescript
function detectConflicts(principles: PrincipleRecord[]): Conflict[] {
  const conflicts: Conflict[] = [];
  
  for (let i = 0; i < principles.length; i++) {
    for (let j = i + 1; j < principles.length; j++) {
      const conflict = checkMutualContradiction(principles[i], principles[j]);
      if (conflict) conflicts.push(conflict);
    }
  }
  
  return conflicts;
}
```

**Conflict resolution rules**:
1. Non-waivable principles (PRIN-001, PRIN-011, PRIN-014, PRIN-015) always prevail
2. More specific principle prevails over more general (principle subsumption)
3. 'strengthen-only' direction constraint blocks weakening amendments
4. Unresolvable conflicts escalate to Authority Board (fail-closed; no auto-resolution)

### 3.5 Layer-Aware Resolution

The engine respects the 9-layer hierarchy (Layer 0 = principles → Layer 8 = infrastructure):

```typescript
const LAYER_PRECEDENCE = [
  'Layer-0-Principles',      // PCAMG-PRIN-* (supreme)
  'Layer-1-Meta-Constitution', // PCAMG-1000 M-*
  'Layer-2-Generation',      // PCAMG-2000
  'Layer-3-Centers',         // PCAMG-3000 PGC-*
  'Layer-4-Domains',         // PCAMG-4000 PDC-*
  'Layer-5-Policies',        // Policy records
  'Layer-6-Capabilities',    // CAP-*
  'Layer-7-Execution',       // Fabrics, services
  'Layer-8-Infrastructure'   // Platform substrate
];

function resolveLayerConflict(
  lowerLayer: GovernanceRecord,
  higherLayer: GovernanceRecord
): GovernanceRecord {
  // Higher layer (numerically lower) always prevails
  return higherLayer.layer < lowerLayer.layer ? higherLayer : lowerLayer;
}
```

### 3.6 Fail-Closed Guarantees

All resolution operations are fail-closed (RG-8):

- Ambiguous lookup → error, never default
- Missing principle → error, artifact rejected
- Unresolved conflict → escalate, never proceed
- Partial authority chain → error, never activate

---

## SECTION 4 — Principle Validation Engine

### 4.1 Purpose

The Principle Validation Engine implements all validation rules from `SPEC-CONSTITUTIONAL-VALIDATION-RULES` 
(VR-P*, VR-C*, VR-M*, VR-T*, VR-D*, VR-S*, VR-G*). It operates at Stage 1 (Principle Compliance) and Stage 2 
(Constitutional Compliance) of the four-stage compliance proof.

### 4.2 Validation Rule Categories

#### VR-P*: Principle Well-Formedness
- **VR-P1**: All 9 mandated attributes present (name, description, rationale, constraints, 
  validation_rules, compliance_rules, amendment_rules, audit_requirements, subsumes)
- **VR-P2**: UUIDs unique across all principle records; IDs non-colliding with P*/IP*/INV*/INV-CORE-*
- **VR-P3**: No mutual contradiction between principles (interpreted per PCAMG-6000)

#### VR-C*: Principle Conformance (Non-Waivable)
- **VR-C1**: Artifact violating any PRIN record → REJECT (principle prevails)
- **VR-C2**: Rights-affecting action without valid REG-CONSENT grant → FAIL
- **VR-C3**: Any execution/AI claiming sovereignty → FAIL (PRIN-001, AD-0014)



#### VR-M*: Meta-Constitution Conformance
- **VR-M1**: Governance artifact not derived from Meta-Constitution articles → FAIL
- **VR-M2**: Self-privileged governance (manual override, no derivation) → FAIL (Article M-III anti-privilege)

#### VR-T*: Traceability (SPEC-TRACEABILITY-FRAMEWORK)
- **VR-T1**: Incomplete up-trace (artifact doesn't reach ≥1 PRIN) → FAIL (T-1)
- **VR-T2**: Orphan artifact (no edges) → FAIL (T-3)
- **VR-T3**: Cycle in derivation graph → FAIL (T-5)
- **VR-T4**: Downward authority (layer_to > layer_from) → FAIL (T-2)

#### VR-D*: Determinism
- **VR-D1**: Missing or non-reproducible `determinism_hash` → FAIL (INV-6, CR-9)
- **VR-D2**: Persistent ambiguity in resolution → FAIL (RG-8)

#### VR-S*: Security (Non-Waivable)
- **VR-S1**: S1/S3/S4 weakened → FAIL (AUTH-008 non-waivable)
- **VR-S2**: Non-deny-default boundary → FAIL (PRIN-003)
- **VR-S3**: Inline secret (not by-reference) → FAIL (RG-7)

#### VR-G*: Governance Integrity
- **VR-G1**: Missing or ambiguous owner → FAIL (PRIN-005)
- **VR-G2**: SoD violation (proposer = certifier = ratifier) → FAIL (PRIN-009)
- **VR-G3**: Absolute or cyclic authority → FAIL (PCAMG-0005 polycentrism)
- **VR-G4**: Deletion or weakening → FAIL (INV-10 append-only)

### 4.3 Validation Execution

```typescript
interface ValidationRecord {
  validation_uuid: UUID;
  artifact_ref: string;
  rules_run: string[];               // All VR-* rules executed
  verdict: 'PASS' | 'FAIL' | 'SKIPPED';
  findings: ValidationFinding[];
  determinism_hash: Bytes;           // Reproducible from artifact snapshot
  auditor: string;
  audit_ref: UUID;
  created_at: Timestamp;
}

function validateArtifact(artifactRef: string): ValidationRecord {
  const artifact = resolveArtifact(artifactRef);
  const findings: ValidationFinding[] = [];
  
  // Category P: Well-formedness
  findings.push(...checkWellFormedness(artifact));
  
  // Category C: Principle conformance (NON-WAIVABLE)
  findings.push(...checkPrincipleConformance(artifact));
  
  // Category M: Meta-constitution
  findings.push(...checkMetaConformance(artifact));
  
  // Category T: Traceability
  findings.push(...checkTraceability(artifact));
  
  // Category D: Determinism
  findings.push(...checkDeterminism(artifact));
  
  // Category S: Security (NON-WAIVABLE)
  findings.push(...checkSecurityControls(artifact));
  
  // Category G: Governance
  findings.push(...checkGovernanceIntegrity(artifact));
  
  // Verdict: ANY non-waivable FAIL → overall FAIL
  const nonWaivableFailures = findings.filter(f => 
    f.severity === 'NON_WAIVABLE' && f.verdict === 'FAIL'
  );
  
  const verdict = nonWaivableFailures.length > 0 ? 'FAIL' : 
                  findings.some(f => f.verdict === 'FAIL') ? 'FAIL' : 'PASS';
  
  return {
    validation_uuid: generateUUID(),
    artifact_ref: artifactRef,
    rules_run: extractRulesRun(findings),
    verdict,
    findings,
    determinism_hash: computeDeterministicHash(artifact, findings),
    auditor: getCurrentAuditor(),
    audit_ref: recordAudit('VALIDATE', artifactRef, verdict),
    created_at: now()
  };
}
```

### 4.4 Deterministic Validation

Validation is deterministic (INV-6): identical artifact snapshot + rules version yields identical verdict + 
hash. This enables:

- Reproducible validation across nodes
- Offline verification from audit trail
- Dispute resolution via re-execution

```typescript
function computeDeterministicHash(
  artifact: GovernanceRecord,
  findings: ValidationFinding[]
): Bytes {
  const inputs = {
    artifact_snapshot: {
      logical_id: artifact.logical_id,
      version: artifact.version,
      content_hash: artifact.content_hash
    },
    rules_version: VALIDATION_RULES_VERSION,
    findings_canonical: canonicalizeFindings(findings)
  };
  
  return sha256(canonicalJSON(inputs));
}
```

---

## SECTION 5 — Governance Compiler

### 5.1 Purpose

The Governance Compiler implements `PCAMG-0004` (Governance Generation Framework) at runtime. It generates 
candidate governance models from Layer-0 principles + Meta-Constitution, enforcing 12 compilation rules 
(CR-1 through CR-12) and producing deterministic generation records.

### 5.2 Compilation Rules (CR-*)

| Rule | Requirement | Error Code |
|------|-------------|------------|
| CR-1 | Principle-rooted (every rule derives from ≥1 PRIN) | CE-UNROOTED |
| CR-2 | Meta-conformant (respects Meta-Constitution articles) | CE-META |
| CR-3 | No hardcoding (all governance from registry) | CE-HARDCODE |
| CR-4 | Single owner declared | CE-OWNER |
| CR-5 | SoD enforced (propose ≠ certify ≠ ratify) | CE-SOD |
| CR-6 | Deny-default boundary | CE-SEC |
| CR-7 | S1/S3/S4 preserved | CE-SEC |
| CR-8 | Traceable (complete derivation map) | CE-TRACE |
| CR-9 | Deterministic (reproducible output + hash) | CE-NONDET |
| CR-10 | Fail-closed (unresolved input halts compile) | CE-UNRESOLVED |
| CR-11 | Non-inverting (respects layer precedence) | CE-INVERSION |
| CR-12 | Unambiguous (no persistent ambiguity) | CE-AMBIGUOUS |



### 5.3 Compilation Process

```typescript
interface GenerationRecord {
  gov_uuid: UUID;
  inputs: {
    principles: string[];            // PRIN UUIDs
    meta_articles: string[];         // M-* articles
    generation_params: Record<string, unknown>;
  };
  inputs_versions: string[];         // Pinned versions for determinism
  rules_applied: string[];           // CR-* rules
  determinism_hash: Bytes;
  errors: CompilationError[];
  candidate_governance?: GovernanceRecord;
  compiled_at: Timestamp;
}

function compileGovernance(
  principles: string[],
  metaArticles: string[],
  params: Record<string, unknown>
): GenerationRecord {
  // 1. Resolve and pin input versions
  const principleRecords = principles.map(resolveAndPinPrinciple);
  const articleRecords = metaArticles.map(resolveAndPinArticle);
  
  // 2. Validate inputs
  const errors: CompilationError[] = [];
  if (principleRecords.length === 0) {
    errors.push({ code: 'CE-UNROOTED', message: 'No principles selected' });
  }
  
  // 3. Generate candidate (if inputs valid)
  let candidate: GovernanceRecord | undefined;
  if (errors.length === 0) {
    candidate = generateFromPrinciples(
      principleRecords,
      articleRecords,
      params
    );
    
    // 4. Apply compilation rules
    errors.push(...applyCR1_Rooted(candidate, principleRecords));
    errors.push(...applyCR2_MetaConformant(candidate, articleRecords));
    errors.push(...applyCR3_NoHardcoding(candidate));
    errors.push(...applyCR4_SingleOwner(candidate));
    errors.push(...applyCR5_SoD(candidate));
    errors.push(...applyCR6_DenyDefault(candidate));
    errors.push(...applyCR7_SecurityPreserved(candidate));
    errors.push(...applyCR8_Traceable(candidate));
    errors.push(...applyCR9_Deterministic(candidate));
    errors.push(...applyCR11_NonInverting(candidate));
    errors.push(...applyCR12_Unambiguous(candidate));
  }
  
  // 5. Compute determinism hash
  const determinismHash = computeCompilationHash(
    principleRecords,
    articleRecords,
    params,
    candidate
  );
  
  // 6. Record generation
  return {
    gov_uuid: generateUUID(),
    inputs: {
      principles: principles,
      meta_articles: metaArticles,
      generation_params: params
    },
    inputs_versions: extractVersions(principleRecords, articleRecords),
    rules_applied: ['CR-1', 'CR-2', 'CR-3', 'CR-4', 'CR-5', 'CR-6', 
                    'CR-7', 'CR-8', 'CR-9', 'CR-11', 'CR-12'],
    determinism_hash: determinismHash,
    errors: errors,
    candidate_governance: errors.length === 0 ? candidate : undefined,
    compiled_at: now()
  };
}
```

### 5.4 Deterministic Compilation (CR-9)

Compilation is deterministic: identical inputs (pinned versions) + rules yield identical output + hash.

```typescript
function computeCompilationHash(
  principles: PrincipleRecord[],
  articles: MetaArticleRecord[],
  params: Record<string, unknown>,
  candidate?: GovernanceRecord
): Bytes {
  const inputs = {
    principles_snapshot: principles.map(p => ({
      uuid: p.principle_uuid,
      version: p.version,
      content_hash: p.content_hash
    })),
    articles_snapshot: articles.map(a => ({
      logical_id: a.logical_id,
      version: a.version,
      content_hash: a.content_hash
    })),
    params_canonical: canonicalJSON(params),
    candidate_hash: candidate?.content_hash,
    compiler_version: COMPILER_VERSION
  };
  
  return sha256(canonicalJSON(inputs));
}
```

**Reproducibility guarantee**: Re-compiling the same inputs (by version) on any node yields the same 
`determinism_hash`. This enables dispute resolution and cross-node verification.

### 5.5 Fail-Closed Compilation (CR-10)

The compiler is fail-closed: any unresolved input, missing principle, or ambiguous lookup halts compilation 
with **no partial governance emitted** (no best-effort, no default assumptions).

```typescript
function resolveAndPinPrinciple(principleRef: string): PrincipleRecord {
  const record = registryLookup('REG-PRIN', { logical_id: principleRef });
  
  if (!record) {
    throw CompilationError({
      code: 'CE-UNRESOLVED',
      message: `Principle ${principleRef} not found`,
      severity: 'BLOCKING'
    });
  }
  
  if (record.status !== 'ACTIVE') {
    throw CompilationError({
      code: 'CE-UNRESOLVED',
      message: `Principle ${principleRef} not active (status: ${record.status})`,
      severity: 'BLOCKING'
    });
  }
  
  return record;
}
```

---

## SECTION 6 — Governance Graph Model

### 6.1 Purpose

The Governance Graph Model implements traceability across all nine layers (Layer 0 principles → Layer 8 
infrastructure). It enforces complete up-trace (T-1), acyclic structure (T-5), and downward authority flow 
(T-2) per `SPEC-TRACEABILITY-FRAMEWORK`.

### 6.2 Graph Structure

**Vertices**: All governance artifacts (principles, meta-articles, governance models, centers, domains, 
policies, capabilities, execution fabrics, infrastructure)

**Edges**: Eight relation types

| Relation | Meaning | Example |
|----------|---------|---------|
| `derives-from` | Authority derivation (upward) | Domain constitution derives from principles |
| `refines` | Specialization | IP-04 refines PRIN-004 |
| `realizes` | Implementation | Fabric realizes capability |
| `governed-by` | Subject to governance | Policy governed by domain |
| `subsumed-by` | Included in parent scope | Principle subsumes operational principles |
| `supersedes` | Append-only replacement | New version supersedes old |
| `depends-on` | Technical dependency | Service depends on registry |
| `federates-with` | Cross-node relation | Domain federates with peer domain |

### 6.3 Traceability Rules (T-*)

#### T-1: Complete Up-Trace
Every artifact (except Layer-0 principles) MUST trace upward to at least one invariant principle.

```typescript
function verifyCompleteUpTrace(artifactRef: string): TraceVerdict {
  const reachablePrinciples = traverseUpward(artifactRef, 'derives-from');
  
  if (reachablePrinciples.length === 0) {
    return {
      verdict: 'FAIL',
      rule: 'T-1',
      reason: 'orphan-artifact',
      artifact: artifactRef
    };
  }
  
  return { verdict: 'PASS', rule: 'T-1', principles: reachablePrinciples };
}
```



#### T-2: Downward Authority Flow
Authority flows downward only (from lower-numbered layers to higher-numbered layers).

```typescript
function verifyDownwardFlow(edge: TraceEdge): TraceVerdict {
  if (edge.layer_to > edge.layer_from) {
    return {
      verdict: 'FAIL',
      rule: 'T-2',
      reason: 'upward-authority-violation',
      edge: edge
    };
  }
  
  return { verdict: 'PASS', rule: 'T-2' };
}
```

#### T-3: No Orphans
No artifact may exist without edges (except Layer-0 principles, which are roots).

```typescript
function detectOrphans(): string[] {
  const allArtifacts = getAllArtifacts();
  const principles = getPrinciples();
  
  return allArtifacts
    .filter(artifact => !principles.includes(artifact))
    .filter(artifact => getEdges(artifact).length === 0);
}
```

#### T-5: Acyclic Structure
No cycle may exist in the governance graph (prevents circular authority).

```typescript
function detectCycles(): Cycle[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: Cycle[] = [];
  
  function dfs(node: string, path: string[]) {
    visited.add(node);
    recursionStack.add(node);
    path.push(node);
    
    const children = getOutgoingEdges(node);
    for (const child of children) {
      if (!visited.has(child)) {
        dfs(child, [...path]);
      } else if (recursionStack.has(child)) {
        // Cycle detected
        const cycleStart = path.indexOf(child);
        cycles.push({ nodes: path.slice(cycleStart) });
      }
    }
    
    recursionStack.delete(node);
  }
  
  getAllArtifacts().forEach(node => {
    if (!visited.has(node)) dfs(node, []);
  });
  
  return cycles;
}
```

### 6.4 Impact Analysis (T-DOWN)

The graph enables impact analysis: "What artifacts derive from this principle?"

```typescript
function analyzeImpact(principleRef: string): ImpactReport {
  const downstreamArtifacts = traverseDownward(principleRef, 'derives-from');
  
  return {
    principle: principleRef,
    total_downstream: downstreamArtifacts.length,
    by_layer: groupByLayer(downstreamArtifacts),
    critical_paths: identifyCriticalPaths(downstreamArtifacts)
  };
}

function traverseDownward(node: string, relation: EdgeRelation): string[] {
  const visited = new Set<string>();
  const queue = [node];
  const result: string[] = [];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    
    visited.add(current);
    if (current !== node) result.push(current);
    
    const children = getEdges(current)
      .filter(e => e.relation === relation)
      .map(e => e.to_ref);
    
    queue.push(...children);
  }
  
  return result;
}
```

### 6.5 Graph Persistence

The graph is persisted in two forms:

1. **Authoritative relational**: `REG-TRACE` table (SQL, append-only, audit-chained)
2. **Accelerated projection**: In-database property graph (Apache AGE or recursive CTEs)

Both are transactionally consistent; the property graph is a projection of `REG-TRACE` for fast traversal.

---

## SECTION 7 — Constitutional Compliance Runtime

### 7.1 Purpose

The Constitutional Compliance Runtime implements the four-stage compliance proof from 
`SPEC-CONSTITUTIONAL-COMPLIANCE-FRAMEWORK`. It is the sole authority-conferring gate: **only artifacts with 
an ACTIVATE verdict may transition from PROPOSED to ACTIVE**.

### 7.2 Four-Stage Proof

```typescript
interface ComplianceProof {
  proof_uuid: UUID;
  subject_ref: string;
  stage_1_principle: 'PASS' | 'FAIL' | 'SKIPPED';
  stage_2_constitutional: 'PASS' | 'FAIL' | 'SKIPPED';
  stage_3_governance: 'PASS' | 'FAIL' | 'SKIPPED';
  stage_4_operational: 'PASS' | 'FAIL' | 'SKIPPED';
  verdict: 'ACTIVATE' | 'REJECT';
  findings: ComplianceFinding[];
  determinism_hash: Bytes;
  approver?: string;                 // Required for Approval-Required operations
  audit_ref: UUID;
  created_at: Timestamp;
}
```

### 7.3 Stage Execution (Fail-Closed, Ordered)

Stages execute in order; a FAIL at any stage prevents later stages from yielding PASS.

```typescript
function proveCompliance(subjectRef: string): ComplianceProof {
  const findings: ComplianceFinding[] = [];
  
  // Stage 1: Principle Compliance (NON-WAIVABLE)
  const stage1 = validatePrincipleCompliance(subjectRef);
  findings.push(...stage1.findings);
  
  // Stage 2: Constitutional Compliance
  let stage2: StageResult;
  if (stage1.verdict === 'PASS') {
    stage2 = validateConstitutionalCompliance(subjectRef);
    findings.push(...stage2.findings);
  } else {
    stage2 = { verdict: 'SKIPPED', findings: [] };
  }
  
  // Stage 3: Governance Compliance
  let stage3: StageResult;
  if (stage1.verdict === 'PASS' && stage2.verdict === 'PASS') {
    stage3 = validateGovernanceCompliance(subjectRef);
    findings.push(...stage3.findings);
  } else {
    stage3 = { verdict: 'SKIPPED', findings: [] };
  }
  
  // Stage 4: Operational Compliance (includes non-waivable S1/S3/S4)
  let stage4: StageResult;
  if (stage1.verdict === 'PASS' && stage2.verdict === 'PASS' && stage3.verdict === 'PASS') {
    stage4 = validateOperationalCompliance(subjectRef);
    findings.push(...stage4.findings);
  } else {
    stage4 = { verdict: 'SKIPPED', findings: [] };
  }
  
  // Verdict: ACTIVATE only if all four stages PASS
  const verdict = (
    stage1.verdict === 'PASS' &&
    stage2.verdict === 'PASS' &&
    stage3.verdict === 'PASS' &&
    stage4.verdict === 'PASS'
  ) ? 'ACTIVATE' : 'REJECT';
  
  return {
    proof_uuid: generateUUID(),
    subject_ref: subjectRef,
    stage_1_principle: stage1.verdict,
    stage_2_constitutional: stage2.verdict,
    stage_3_governance: stage3.verdict,
    stage_4_operational: stage4.verdict,
    verdict,
    findings,
    determinism_hash: computeProofHash(subjectRef, findings),
    approver: verdict === 'ACTIVATE' && requiresApproval(subjectRef) 
               ? getCurrentApprover() : undefined,
    audit_ref: recordAudit('PROVE_COMPLIANCE', subjectRef, verdict),
    created_at: now()
  };
}
```



### 7.4 Stage Definitions

#### Stage 1: Principle Compliance (Non-Waivable)
Validates VR-P*, VR-C* rules. Any principle violation is blocking.

```typescript
function validatePrincipleCompliance(artifactRef: string): StageResult {
  const artifact = resolveArtifact(artifactRef);
  const principles = resolvePrinciples(artifact);
  const findings: ComplianceFinding[] = [];
  
  // VR-P*: Well-formedness
  findings.push(...checkPrincipleWellFormedness(principles));
  
  // VR-C*: Conformance (NON-WAIVABLE)
  for (const principle of principles) {
    const conformance = checkPrincipleConformance(artifact, principle);
    if (conformance.verdict === 'FAIL' && conformance.severity === 'NON_WAIVABLE') {
      return { verdict: 'FAIL', findings: [conformance] };
    }
    findings.push(conformance);
  }
  
  return { 
    verdict: findings.some(f => f.verdict === 'FAIL') ? 'FAIL' : 'PASS',
    findings
  };
}
```

#### Stage 2: Constitutional Compliance
Validates VR-M* rules (Meta-Constitution conformance).

```typescript
function validateConstitutionalCompliance(artifactRef: string): StageResult {
  const artifact = resolveArtifact(artifactRef);
  const metaArticles = resolveMetaArticles();
  const findings: ComplianceFinding[] = [];
  
  // VR-M1: Derivation from Meta-Constitution
  findings.push(checkMetaDerivation(artifact, metaArticles));
  
  // VR-M2: No self-privileging
  findings.push(checkAntiPrivilege(artifact));
  
  return {
    verdict: findings.some(f => f.verdict === 'FAIL') ? 'FAIL' : 'PASS',
    findings
  };
}
```

#### Stage 3: Governance Compliance
Validates VR-T*, VR-D*, VR-G* rules (traceability, determinism, governance integrity).

```typescript
function validateGovernanceCompliance(artifactRef: string): StageResult {
  const artifact = resolveArtifact(artifactRef);
  const findings: ComplianceFinding[] = [];
  
  // VR-T*: Traceability
  findings.push(checkCompleteUpTrace(artifact));        // T-1
  findings.push(checkNoOrphans(artifact));             // T-3
  findings.push(checkAcyclic(artifact));               // T-5
  findings.push(checkDownwardAuthority(artifact));     // T-2
  
  // VR-D*: Determinism
  findings.push(checkDeterministicHash(artifact));     // INV-6
  findings.push(checkNoAmbiguity(artifact));           // RG-8
  
  // VR-G*: Governance integrity
  findings.push(checkSingleOwner(artifact));           // PRIN-005
  findings.push(checkSeparationOfDuties(artifact));    // PRIN-009
  findings.push(checkNoAbsoluteAuthority(artifact));   // Polycentric
  findings.push(checkAppendOnly(artifact));            // INV-10
  
  return {
    verdict: findings.some(f => f.verdict === 'FAIL') ? 'FAIL' : 'PASS',
    findings
  };
}
```

#### Stage 4: Operational Compliance (Non-Waivable S1/S3/S4)
Validates VR-S* rules and operational readiness gates.

```typescript
function validateOperationalCompliance(artifactRef: string): StageResult {
  const artifact = resolveArtifact(artifactRef);
  const findings: ComplianceFinding[] = [];
  
  // VR-S*: Security (NON-WAIVABLE)
  findings.push(checkS1_DenyByDefault(artifact));
  findings.push(checkS3_SecretsNotInline(artifact));
  findings.push(checkS4_DataProtection(artifact));
  
  // Operational gates
  findings.push(checkAuditSink(artifact));             // Audit-ready
  findings.push(checkDurability(artifact));            // PRIN-010
  
  return {
    verdict: findings.some(f => 
      f.verdict === 'FAIL' && f.severity === 'NON_WAIVABLE'
    ) ? 'FAIL' : 'PASS',
    findings
  };
}
```

### 7.5 Activation Enforcement

Only the Compliance Runtime may activate an artifact, and only with a passing proof.

```typescript
function activateArtifact(
  artifactRef: string,
  proofRef: UUID
): ActivationResult {
  // 1. Resolve proof
  const proof = resolveComplianceProof(proofRef);
  
  if (proof.subject_ref !== artifactRef) {
    throw Error('proof-subject-mismatch');
  }
  
  if (proof.verdict !== 'ACTIVATE') {
    throw Error('proof-rejected');
  }
  
  // 2. Verify proof freshness
  const artifact = resolveArtifact(artifactRef);
  if (proof.determinism_hash !== artifact.content_hash) {
    throw Error('proof-stale');
  }
  
  // 3. Transition status
  const activated = transitionStatus(
    artifactRef,
    'PROPOSED',
    'ACTIVE',
    proof.audit_ref
  );
  
  // 4. Emit activation event
  emitEvent('governance.artifact.activated', {
    artifact_ref: artifactRef,
    proof_uuid: proofRef,
    activated_at: now()
  });
  
  return { artifact: activated, proof: proof };
}
```

---

## SECTION 8 — Audit & Chronicle System

### 8.1 Purpose

The Audit & Chronicle System implements append-only, hash-chained, attributable audit per PRIN-006 and 
INV-CORE-02. It provides offline verifiability (A-3) and reproducible verdicts (A-4).

### 8.2 Hash-Chained Audit

```typescript
interface AuditEntry {
  entry_uuid: UUID;
  seq: bigint;                       // Total order
  actor: string;                     // Attributable (A-1)
  action: string;                    // PROPOSE | ACTIVATE | SUPERSEDE | ...
  subject_ref: string;               // Artifact affected
  payload: Record<string, unknown>;
  prev_hash: Bytes;                  // Chain link (A-2)
  entry_hash: Bytes;                 // SHA-256(prev_hash || canonical(payload) || seq || actor)
  created_at: Timestamp;
}

function appendAudit(
  action: string,
  subjectRef: string,
  payload: Record<string, unknown>
): UUID {
  // 1. Get previous entry
  const prevEntry = getLatestAuditEntry();
  const prevHash = prevEntry?.entry_hash ?? GENESIS_HASH;
  const seq = (prevEntry?.seq ?? 0n) + 1n;
  
  // 2. Compute entry hash
  const entryHash = sha256(canonicalJSON({
    prev_hash: prevHash,
    payload: payload,
    seq: seq,
    actor: getCurrentActor()
  }));
  
  // 3. Append entry (SERIALIZABLE transaction)
  const entry: AuditEntry = {
    entry_uuid: generateUUID(),
    seq: seq,
    actor: getCurrentActor(),
    action: action,
    subject_ref: subjectRef,
    payload: payload,
    prev_hash: prevHash,
    entry_hash: entryHash,
    created_at: now()
  };
  
  insertAuditEntry(entry);
  
  return entry.entry_uuid;
}
```

### 8.3 Chain Verification (A-2)

```typescript
function verifyAuditChain(fromSeq: bigint, toSeq: bigint): ChainVerdict {
  const entries = getAuditEntries(fromSeq, toSeq);
  
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    
    // Verify sequence continuity
    if (i > 0 && entry.seq !== entries[i-1].seq + 1n) {
      return {
        verdict: 'BROKEN',
        reason: 'sequence-gap',
        at_seq: entry.seq
      };
    }
    
    // Verify hash chain
    const expectedPrevHash = i > 0 ? entries[i-1].entry_hash : GENESIS_HASH;
    if (!bytesEqual(entry.prev_hash, expectedPrevHash)) {
      return {
        verdict: 'BROKEN',
        reason: 'chain-break',
        at_seq: entry.seq
      };
    }
    
    // Recompute entry hash
    const recomputedHash = sha256(canonicalJSON({
      prev_hash: entry.prev_hash,
      payload: entry.payload,
      seq: entry.seq,
      actor: entry.actor
    }));
    
    if (!bytesEqual(entry.entry_hash, recomputedHash)) {
      return {
        verdict: 'TAMPERED',
        reason: 'hash-mismatch',
        at_seq: entry.seq
      };
    }
  }
  
  return { verdict: 'VERIFIED', entries: entries.length };
}
```



### 8.4 Offline Verifiability (A-3)

The audit chain is exportable to write-once-read-many (WORM) storage for offline verification without database 
access.

```typescript
function exportAuditChain(fromSeq: bigint, toSeq: bigint): AuditExport {
  const entries = getAuditEntries(fromSeq, toSeq);
  
  return {
    export_uuid: generateUUID(),
    from_seq: fromSeq,
    to_seq: toSeq,
    entries: entries,
    export_hash: sha256(canonicalJSON(entries)),
    exported_at: now(),
    verifiable_offline: true
  };
}

function verifyOffline(exportData: AuditExport): ChainVerdict {
  // Verify export integrity
  const recomputedHash = sha256(canonicalJSON(exportData.entries));
  if (!bytesEqual(exportData.export_hash, recomputedHash)) {
    return { verdict: 'TAMPERED', reason: 'export-hash-mismatch' };
  }
  
  // Verify chain (no database required)
  return verifyAuditChain(exportData.from_seq, exportData.to_seq);
}
```

### 8.5 Reproducible Verdicts (A-4)

Every validation, compilation, and compliance verdict is reproducible from the audit trail.

```typescript
function reproduceVerdict(
  auditRef: UUID
): ReproductionResult {
  // 1. Resolve audit entry
  const auditEntry = resolveAuditEntry(auditRef);
  
  // 2. Extract evidence snapshot
  const evidence = auditEntry.payload.evidence;
  const artifactSnapshot = evidence.artifact_snapshot;
  const rulesVersion = evidence.rules_version;
  
  // 3. Re-execute validation/compilation/compliance
  let reproduced: any;
  if (auditEntry.action === 'VALIDATE') {
    reproduced = revalidate(artifactSnapshot, rulesVersion);
  } else if (auditEntry.action === 'COMPILE') {
    reproduced = recompile(evidence.inputs, rulesVersion);
  } else if (auditEntry.action === 'PROVE_COMPLIANCE') {
    reproduced = reproveCompliance(artifactSnapshot, rulesVersion);
  }
  
  // 4. Compare verdicts
  const originalVerdict = auditEntry.payload.verdict;
  const reproducedVerdict = reproduced.verdict;
  
  return {
    original: originalVerdict,
    reproduced: reproducedVerdict,
    match: originalVerdict === reproducedVerdict,
    determinism_hash_match: bytesEqual(
      evidence.determinism_hash,
      reproduced.determinism_hash
    )
  };
}
```

### 8.6 Audit Requirements Matrix

| Audit Obligation | Enforced By | Verification |
|------------------|-------------|--------------|
| A-1: Attributable | `actor` field mandatory; no anonymous actions | Audit entry schema |
| A-2: Hash-chained | `prev_hash`, `entry_hash` computed + verified | Chain verification |
| A-3: Offline-verifiable | Export to WORM; verify without DB | Export + offline verify |
| A-4: Reproducible verdicts | Evidence snapshot + rules version | Reproduction test |
| A-5: No silent activation | Every ACTIVE record has exactly one ACTIVATE proof | Compliance audit |

---

## SECTION 9 — Repository Structure

### 9.1 Proposed Directory Structure

```
packages/platform-runtime/src/control/governance/
├── types.ts                           # Shared types + interfaces
├── registries/
│   ├── principle-registry.ts          # REG-PRIN
│   ├── meta-registry.ts               # REG-META
│   ├── governance-registry.ts         # REG-GOV
│   ├── center-registry.ts             # REG-CENTER
│   ├── domain-registry.ts             # REG-DOMAIN
│   ├── policy-registry.ts             # REG-POLICY
│   ├── capability-registry.ts         # REG-CAP
│   ├── consent-registry.ts            # REG-CONSENT
│   ├── decision-registry.ts           # REG-DECISION
│   ├── trace-registry.ts              # REG-TRACE
│   └── audit-registry.ts              # REG-AUDIT
├── engines/
│   ├── authority-resolution-engine.ts
│   ├── principle-validation-engine.ts
│   ├── governance-compiler.ts
│   ├── traceability-engine.ts
│   └── compliance-engine.ts
├── graph/
│   ├── governance-graph.ts            # Graph model + traversal
│   ├── trace-verifier.ts              # T-1/T-2/T-3/T-5 verification
│   └── impact-analyzer.ts             # Impact analysis (T-DOWN)
├── audit/
│   ├── audit-chain.ts                 # Hash-chained audit
│   ├── chain-verifier.ts              # A-2 verification
│   ├── offline-export.ts              # A-3 WORM export
│   └── verdict-reproducer.ts          # A-4 reproduction
├── validation/
│   ├── vr-principle.ts                # VR-P* rules
│   ├── vr-conformance.ts              # VR-C* rules (non-waivable)
│   ├── vr-meta.ts                     # VR-M* rules
│   ├── vr-traceability.ts             # VR-T* rules
│   ├── vr-determinism.ts              # VR-D* rules
│   ├── vr-security.ts                 # VR-S* rules (non-waivable)
│   └── vr-governance.ts               # VR-G* rules
├── compilation/
│   ├── cr-rooted.ts                   # CR-1
│   ├── cr-meta-conformant.ts          # CR-2
│   ├── cr-no-hardcoding.ts            # CR-3
│   ├── cr-single-owner.ts             # CR-4
│   ├── cr-sod.ts                      # CR-5
│   ├── cr-deny-default.ts             # CR-6
│   ├── cr-security.ts                 # CR-7
│   ├── cr-traceable.ts                # CR-8
│   ├── cr-deterministic.ts            # CR-9
│   ├── cr-fail-closed.ts              # CR-10
│   ├── cr-non-inverting.ts            # CR-11
│   └── cr-unambiguous.ts              # CR-12
├── compliance/
│   ├── stage-1-principle.ts
│   ├── stage-2-constitutional.ts
│   ├── stage-3-governance.ts
│   ├── stage-4-operational.ts
│   └── proof-generator.ts
├── governance-control.ts              # Main assembly + orchestration
└── index.ts                           # Barrel exports

test/control/governance/
├── governance-harness.ts              # Test infrastructure
├── registries/
│   ├── principle-registry.test.ts
│   ├── trace-registry.test.ts
│   └── audit-registry.test.ts
├── engines/
│   ├── authority-resolution.test.ts
│   ├── principle-validation.test.ts
│   ├── governance-compiler.test.ts
│   └── compliance-engine.test.ts
├── graph/
│   ├── trace-verification.test.ts    # T-1/T-2/T-3/T-5
│   └── impact-analysis.test.ts
├── audit/
│   ├── audit-chain.test.ts           # A-1/A-2
│   ├── offline-export.test.ts        # A-3
│   └── verdict-reproduction.test.ts  # A-4
├── validation/
│   ├── vr-principle.test.ts          # VR-P*
│   ├── vr-conformance.test.ts        # VR-C* (non-waivable)
│   ├── vr-traceability.test.ts       # VR-T*
│   └── vr-security.test.ts           # VR-S* (non-waivable)
├── compilation/
│   ├── cr-rules.test.ts              # CR-1..12
│   └── deterministic-compilation.test.ts  # CR-9 reproducibility
├── compliance/
│   ├── four-stage-proof.test.ts
│   ├── fail-closed-ordering.test.ts
│   └── non-waivable.test.ts
├── governance-adversarial.test.ts     # Threat scenarios
└── governance-baseline.test.ts        # Baseline green preservation (≥254/254)
```

### 9.2 Module Responsibilities

| Module | Responsibility | Registry Write | Registry Read |
|--------|----------------|----------------|---------------|
| `principle-registry` | Manage Layer-0 principles (15 records) | REG-PRIN | — |
| `meta-registry` | Manage Meta-Constitution articles | REG-META | — |
| `governance-registry` | Manage generated governance models | REG-GOV | REG-PRIN, REG-META |
| `trace-registry` | Manage derivation edges | REG-TRACE | All registries |
| `audit-registry` | Append-only audit chain | REG-AUDIT | — |
| `authority-resolution-engine` | Resolve authority chains, detect conflicts | — | REG-PRIN, REG-META, REG-TRACE |
| `principle-validation-engine` | Execute VR-* rules | — | REG-PRIN, REG-TRACE |
| `governance-compiler` | Generate governance from principles | REG-GOV | REG-PRIN, REG-META |
| `traceability-engine` | Verify T-1/T-2/T-3/T-5 | — | REG-TRACE |
| `compliance-engine` | Four-stage proof + activation | status transitions | All registries |
| `audit-chain` | Hash-chained audit append + verify | REG-AUDIT | — |



---

## SECTION 10 — Implementation Roadmap

### 10.1 Construction Phases

Construction of the Constitutional Governance Runtime (if authorized) would proceed in dependency-ordered 
phases:

#### Phase 1: Registry Substrate (Foundation)
**Deliverables**:
- Common registry record schema + types
- Append-only enforcement (triggers, INV-10)
- Content hash computation + verification (RG-5)
- Audit chain foundation (REG-AUDIT seed)

**Tests**: Append-only enforcement, content hash reproducibility, audit genesis

#### Phase 2: Core Registries
**Deliverables**:
- REG-PRIN (15 invariant principles, PCAMG-0000)
- REG-META (Meta-Constitution articles, PCAMG-1000)
- REG-TRACE (traceability edges)
- REG-AUDIT (complete audit chain)

**Tests**: Registry CRUD (propose-only), principle well-formedness (VR-P*), audit chain verification (A-2)

#### Phase 3: Authority & Traceability
**Deliverables**:
- Authority Resolution Engine
- Traceability Engine (graph model, T-1/T-2/T-3/T-5)
- Impact analysis (T-DOWN)

**Tests**: Authority chain resolution, up-trace verification, cycle detection, orphan detection

#### Phase 4: Validation Engines
**Deliverables**:
- Principle Validation Engine (VR-P*/VR-C*)
- Traceability validation (VR-T*)
- Security validation (VR-S*)
- Governance validation (VR-G*/VR-D*)

**Tests**: All VR-* rules, non-waivable enforcement, fail-closed behavior

#### Phase 5: Governance Compiler
**Deliverables**:
- Governance Compiler (CR-1..12)
- REG-GOV (governance generation records)
- Deterministic compilation (CR-9)

**Tests**: All CR-* rules, determinism reproducibility, fail-closed compilation

#### Phase 6: Compliance Runtime
**Deliverables**:
- Four-stage compliance proof
- Activation gate
- Non-waivable enforcement (Stage 1, Stage 4)

**Tests**: Four-stage execution, fail-closed ordering, activation enforcement

#### Phase 7: Polycentric Governance
**Deliverables**:
- REG-CENTER (governance centers)
- REG-DOMAIN (domain constitutions)
- REG-POLICY (policies)
- REG-CAP (capabilities)
- REG-CONSENT (consent records)
- REG-DECISION (decision records)

**Tests**: Polycentric scenarios, center acyclicity (VR-G3), consent enforcement (VR-C2)

#### Phase 8: Integration & Certification
**Deliverables**:
- Evolution Fabric integration (commit routing)
- Federation Fabric integration (cross-node governance)
- Full certification suite (100+ test cases)
- Baseline green preservation (≥254/254)

**Tests**: End-to-end governance lifecycle, cross-fabric integration, adversarial scenarios, performance

### 10.2 Prerequisites to Construction

Before any construction phase may begin, the following must be satisfied:

1. **Authority Board authorization** via AUTH-012 decision record
2. **Article IX scoped release** for `src/control/governance/*` (analogous to AD-0018/0019/0020/0022/0023)
3. **Principle enrollment** (if PCAMG is to be supreme, or operational as a reference framework)
4. **Phase 21 authority-chain reconciliation** complete (`REAL-C-05`)
5. **Independent constitutional review** of PCAMG-0000 through PCAMG-0008 + this specification

### 10.3 Additive Construction Guarantees

All construction would be additive and non-breaking:

| Guarantee | Mechanism |
|-----------|-----------|
| Zero prohibited-core-dir modification | New control-layer modules only (`src/control/governance/*`) |
| Baseline test suite green | Existing 254+ tests remain passing; new tests additive |
| No ratified fabric modification | Read-only integration with PI-2/3/4/5/6/7 |
| Append-only discipline | INV-10 enforced; no deletion of existing artifacts |
| Fail-closed integration | Governance errors never break non-governance operations |

### 10.4 Certification Criteria

The Constitutional Governance Runtime would be certified against:

1. **Structural integrity** (EX-1..EX-5): 15 principles, 9 attributes each, unique UUIDs, up-trace coverage
2. **Registry guarantees** (RG-1..RG-8): Single source, append-only, single owner, up-trace, tamper-evidence, 
   determinism, secrets by-ref, fail-closed
3. **Traceability rules** (T-1/T-2/T-3/T-5): Complete up-trace, downward authority, no orphans, acyclic
4. **Validation rules** (VR-P*/C*/M*/T*/D*/S*/G*): All categories passing, non-waivable enforced
5. **Compilation rules** (CR-1..12): All rules enforced, deterministic output
6. **Auditability** (A-1..A-5): Attributable, hash-chained, offline-verifiable, reproducible, no silent 
   activation
7. **Compliance proof** (4-stage): Ordered execution, fail-closed, activation-gated
8. **Baseline preservation**: All existing tests (≥254) green; zero regressions

---

## Traceability

- **Realizes**: `PCAMG-0000`, `PCAMG-0001`, `PCAMG-0002`, `PCAMG-0003`, `PCAMG-0004`, `PCAMG-0005`, 
  `PCAMG-0006`, `PCAMG-0007`, `PCAMG-0008` at runtime layer
- **Refines**: `PCAMG-RUNTIME-0002` (reference implementation blueprint)
- **Grounds on**: `SPEC-GOVERNANCE-REGISTRIES`, `SPEC-TRACEABILITY-FRAMEWORK`, 
  `SPEC-CONSTITUTIONAL-VALIDATION-RULES`, `SPEC-GOVERNANCE-COMPILER-RULES`, 
  `SPEC-CONSTITUTIONAL-COMPLIANCE-FRAMEWORK`
- **Integrates with**: PI-2/3 substrate (ADR-004/005), PI-6 Evolution Fabric (AD-0019), PI-5 Federation 
  Fabric (AD-0018), existing audit patterns
- **Governed by**: AUTH-009, AUTH-012, Constitution Art. IX/XI/XII, AD-0014
- **Owner**: UCOS Authority Board (custodian: Chief Authority Architect)

---

## Scope Discipline (Confirmations)

| Confirmation | Result |
|--------------|:------:|
| Runtime architecture specification complete (11 registries, 5 engines, 4-stage proof, audit) | ✅ |
| All sections from requirements present (§1-§10) | ✅ |
| Consistent with PCAMG-0000 through PCAMG-0008 | ✅ |
| Consistent with SPEC-* specifications | ✅ |
| Consistent with PCAMG-RUNTIME-0002 blueprint | ✅ |
| Additive construction (zero prohibited-core-dir change) | ✅ |
| Baseline preservation (≥254/254) | ✅ |
| No code written; specification only | ✅ |
| No infrastructure provisioned | ✅ |
| No Article IX release | ✅ |
| No principle/doctrine enrollment | ✅ |
| INV-1..13, INV-CORE-*, AD-0014 unchanged | ✅ |
| Append-only (INV-10); no deletions | ✅ |
| Marked PROPOSED / NOT ENROLLED | ✅ |

---

## Determination

**CONSTITUTIONAL GOVERNANCE RUNTIME ARCHITECTURE COMPLETE — READY FOR AUTHORITY BOARD REVIEW.**

This specification defines the complete runtime architecture for the Constitutional Governance system: eleven 
governance registries, authority resolution, principle validation, governance compilation, traceability graph, 
four-stage compliance proof, and hash-chained audit. All components are specified with deterministic contracts, 
fail-closed guarantees, and append-only discipline.

The architecture is **demonstrably realizable** as an additive control fabric (`src/control/governance/*`) 
with zero prohibited-core-dir modification and baseline test suite preservation (≥254/254). It grounds on 
five ratified specifications (registries, traceability, validation, compilation, compliance) and integrates 
with the ratified substrate (PI-2/3) and fabrics (PI-4/5/6/7).

**This document authorizes no construction, releases no lock, enrolls no principle, and modifies no invariant.** 
It is a runtime architecture specification ready for independent constitutional review and Authority Board 
deliberation. Construction of `src/control/governance/*` may begin **only** after:

1. Authority Board authorization (AUTH-012)
2. Article IX scoped release (analogous to AD-0018/0019/0020/0022/0023)
3. Principle enrollment decision (if PCAMG is to be operational)
4. Phase 21 authority-chain reconciliation complete
5. Independent constitutional review

**END PCAMG-RUNTIME-0001 — CONSTITUTIONAL GOVERNANCE RUNTIME SPECIFICATION · PROPOSED (NOT ENROLLED) · 
RUNTIME ARCHITECTURE COMPLETE · NO CONSTRUCTION AUTHORIZED · APPEND-ONLY · PENDING AUTHORITY BOARD REVIEW.**



---

## PCAMG-RUNTIME-0003A Remediation Addendum (Append-Only)

> **APPEND-ONLY CORRECTION** issued by `PCAMG-RUNTIME-0003A-CERTIFICATION-REMEDIATION-PACKAGE`.
> This addendum supersedes the referenced passages by correction note only. No prior line of this
> specification is deleted or rewritten (INV-10). It creates no new doctrine, changes no constitutional
> meaning, reassigns no authority, and authorizes no construction. Base commit `65deb4c`; date 2026-07-05.

### R-1 — Governance Compiler catalog reconciliation (closes F-01, MEDIUM)

The single canonical source of truth for the compiler rule/error catalog is
`SPEC-GOVERNANCE-COMPILER-RULES` §3 (`CR-1..12`) and §4 (`CE-*`). Where §5.2/§5.3 of this specification
diverge, the canonical catalog prevails as follows:

| Element | §5.2/§5.3 as-written | **Canonical correction** |
|---------|----------------------|--------------------------|
| CR-10 | "Fail-closed (unresolved input halts compile) → `CE-UNRESOLVED`" | **`CR-10 = Append-only`** (recompilation supersedes prior output with a supersession link, INV-10; never deletes). No dedicated `CE-*` — enforced as a structural discipline. |
| CR-12 | "Unambiguous → `CE-AMBIGUOUS`" | **`CR-12 = Fail-closed`** (any unresolved input, ambiguity, or rule violation halts compilation; no partial-activate). Ambiguity is reported as `CE-AMBIGUOUS`. |
| `CE-UNRESOLVED` | introduced in §5.2 and §5.5 | **Retired.** Not part of the canonical 10-code `CE-*` catalog. Fail-closed halts surface the specific typed code of the failing rule (e.g., `CE-UNROOTED` for a missing/inactive principle that leaves a rule un-rooted; `CE-AMBIGUOUS` for unresolved ambiguity). |
| §5.3 `rules_applied` | `CR-1..9, 11, 12` (CR-10 absent) | **`rules_applied = CR-1..12`**, including `CR-10` (append-only). |

Canonical `CE-*` catalog (complete, 10 codes): `CE-UNROOTED`, `CE-META`, `CE-HARDCODE`, `CE-OWNER`,
`CE-SOD`, `CE-SEC`, `CE-TRACE`, `CE-NONDET`, `CE-INVERSION`, `CE-AMBIGUOUS`.

**Gate:** this reconciliation is required before Program phase A-5 (framework enrollment) or compiler
construction, and is in force as of `PCAMG-RUNTIME-0003A`.

### R-2 — Baseline reference correction (closes F-02, LOW)

Every `≥254/254` occurrence in this specification (§1.2, the §9.1 test-tree comment, §10.1 Phase 8, §10.3,
§10.4 criterion 8, and the Scope-Discipline table) is a stale snapshot and is superseded by the current
baseline:

> **Construction green-baseline floor = 443 / 443** (378 `platform-runtime` + 65 `contract-generator`),
> reproduced at commit `65deb4c`. Frozen governance-corpus baseline = **284** at commit `56a32d3`.
> The `254` figure (213 base + 41 memory) was a prior memory-fabric snapshot and understates the actual
> floor. A construction phase MUST assert **no regression below 443/443**.

### R-3 — §9.1 namespace path disambiguation (closes F-03, LOW)

The §9.1 proposed tree root `packages/platform-runtime/src/control/governance/*` collides with the
pre-existing, unrelated UCOS Governance Fabric (`governance-registry.ts`, GOV-001/002/003) in the same
directory. At construction time (Article-IX-gated, deferred) the following namespace governance rules apply:

| Rule | Statement |
|------|-----------|
| NG-1 | The PCAMG Constitutional Governance Runtime occupies a disambiguated root — canonical: `packages/platform-runtime/src/control/constitutional-governance/*` (alternative: `…/control/governance/pcamg/*`). |
| NG-2 | The existing `src/control/governance/` UCOS Governance Fabric MUST NOT be moved, renamed, superseded, or mutated; integration is read-only and additive. |
| NG-3 | The PCAMG `REG-GOV` module MUST NOT reuse the bare filename `governance-registry.ts` co-located with the existing fabric; disambiguation is by namespace, not co-location. |
| NG-4 | The chosen namespace is carried into any construction-authorization act; the two "governance" concepts remain separately owned and separately traceable. |

The §9.1 tree remains valid **relative to the disambiguated root** in NG-1; the bare
`src/control/governance/*` root is superseded for PCAMG runtime placement.

**Scope confirmation:** append-only; no code, no infrastructure, no enrollment, no Article IX release; ratified
artifacts, INV-1..13, INV-CORE-*, and AD-0014 unchanged.

**END PCAMG-RUNTIME-0003A REMEDIATION ADDENDUM · APPEND-ONLY · F-01/F-02/F-03 CLOSED.**
