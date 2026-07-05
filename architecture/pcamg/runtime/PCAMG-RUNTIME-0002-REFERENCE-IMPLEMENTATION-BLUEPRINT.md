# PCAMG-RUNTIME-0002 — Reference Implementation Blueprint

> Implementation-grade realization of **PCAMG-RUNTIME-0001** (Runtime Specification).
> Construction-gated: instantiation of any registry, service, or schema remains an Authority-Board /
> Article IX act. This document is the executable architecture; it authorizes no enrollment.

| Field | Value |
|-------|-------|
| Artifact ID | `PCAMG-RUNTIME-0002` |
| Name | PCAMG Reference Implementation Blueprint |
| Realizes | `PCAMG-RUNTIME-0001` (Constitutional Governance Runtime Specification) |
| Grounds on | `SPEC-GOVERNANCE-REGISTRIES` (11 registries, RG-1..8), `SPEC-TRACEABILITY-FRAMEWORK` (edges, T-1..8), `SPEC-CONSTITUTIONAL-VALIDATION-RULES` (VR-*), `SPEC-GOVERNANCE-COMPILER-RULES` (CR-*/CE-*), `SPEC-CONSTITUTIONAL-COMPLIANCE-FRAMEWORK` (4-stage proof, A-1..5), `PCAMG-0000` (15 principles, EX-1..5) |
| Invariants enforced in the physical layer | Append-only (INV-10), tamper-evidence (INV-CORE-02), determinism (INV-6), single-owner (PRIN-005), mandatory up-trace (PRIN-004), fail-closed / deny-by-default (S1) |

---

## 0. Runtime Component Map

Eleven registries + the compile→validate→comply pipeline map to nine deployable services over one
append-only PostgreSQL cluster with an in-database graph projection.

```
                         ┌──────────────────────── API Gateway (deny-by-default PEP) ────────────────────────┐
                         │                                                                                    │
   command (propose)  ─▶ │  registry-svc   trace-svc   compiler-svc   validation-svc   compliance-svc         │
   query (read-only)  ─▶ │  audit-svc      decision-svc consent-svc                                           │
                         └───────────────┬───────────────────────────────────────────────┬──────────────────┘
                                         │ writes (append-only)                            │ reads
                                         ▼                                                 ▼
                    ┌───────────────────────────────────────────────────────────────────────────────┐
                    │  PostgreSQL 16 primary (schema: gov)   +   Apache AGE graph (schema: gov_graph) │
                    │  hash-chained audit · content_hash · determinism_hash · no UPDATE/DELETE        │
                    └───────────────────────────────────────────────────────────────────────────────┘
                                         │ logical replication                              │ CDC
                                         ▼                                                 ▼
                            read replicas (query fan-out)              event bus (NATS JetStream / Kafka)
```

| Service | Owns (write) | Reads | Registry tables |
|---------|--------------|-------|-----------------|
| `registry-svc` | principle/meta/gov/center/domain/policy/cap records | trace | `gov.reg_prin` … `gov.reg_cap` |
| `trace-svc` | derivation edges + graph projection | all record tables | `gov.reg_trace`, `gov_graph.*` |
| `compiler-svc` | generation records (candidate governance) | prin/meta/domain/registries | `gov.reg_gov` (candidate rows) |
| `validation-svc` | validation records | subject record + registries | `gov.validation_record` |
| `compliance-svc` | compliance proofs, activation transitions | all | `gov.compliance_proof` |
| `decision-svc` | AUTH-012 decision/amendment records | — | `gov.reg_decision` |
| `consent-svc` | consent grants/revocations | — | `gov.reg_consent` |
| `audit-svc` | hash-chained audit entries (append sink) | — | `gov.reg_audit` |
| `pep` (gateway sidecar) | none (authorization only) | policy/cap | — |

---

## 1. PostgreSQL Physical Data Model

### 1.1 Cluster conventions

- **Engine:** PostgreSQL 16, `SERIALIZABLE` isolation for all governance writes (determinism, INV-6).
- **Schemas:** `gov` (registries + proofs), `gov_graph` (Apache AGE), `gov_audit` reserved for the chain.
- **Identity:** every record PK is a `uuid` (`gen_random_uuid()` from `pgcrypto`); IDs are never reused.
- **Append-only (INV-10/RG-2):** no in-place mutation. Row-level `UPDATE`/`DELETE` are blocked by trigger;
  logical change is expressed by inserting a superseding row that points to its predecessor.
- **Tamper-evidence (RG-5/INV-CORE-02):** every record carries `content_hash`; every state transition emits
  a hash-chained `gov.reg_audit` entry.
- **Determinism (RG-6/INV-6):** derived artifacts (generation, validation, compliance, trace verdicts) carry
  a `determinism_hash` recomputable from pinned inputs.
- **Secrets (RG-7/S3):** no secret is stored inline; only `secret_ref` (URI into external vault).

### 1.2 Extensions & enums

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;      -- gen_random_uuid(), digest()
CREATE EXTENSION IF NOT EXISTS age;           -- in-database property graph
CREATE SCHEMA IF NOT EXISTS gov;
CREATE SCHEMA IF NOT EXISTS gov_graph;

CREATE TYPE gov.record_status  AS ENUM ('PROPOSED','ACTIVE','SUPERSEDED','RETIRED');
CREATE TYPE gov.edge_relation  AS ENUM ('derives-from','refines','realizes','governed-by','subsumed-by');
CREATE TYPE gov.stage_verdict  AS ENUM ('PASS','FAIL','SKIPPED');
CREATE TYPE gov.proof_verdict  AS ENUM ('ACTIVATE','REJECT');
CREATE TYPE gov.severity       AS ENUM ('BLOCKING','NON_WAIVABLE','ADVISORY');
CREATE TYPE gov.mutability      AS ENUM ('immutable','amend-restricted','amend-open');
```

### 1.3 Shared record columns (composable macro)

Every registry table embeds the common schema from `SPEC-GOVERNANCE-REGISTRIES §3`. It is expressed once as a
column set applied per table (Postgres has no true table inheritance for FKs, so it is repeated verbatim and
enforced by a shared trigger set).

```sql
-- Column contract embedded in every gov.reg_* table:
--   record_uuid   uuid PRIMARY KEY DEFAULT gen_random_uuid()   -- immutable identity
--   registry      text NOT NULL                                -- 'REG-PRIN' ...
--   logical_id    text NOT NULL                                -- namespaced id (e.g. PCAMG-PRIN-001)
--   version       text NOT NULL                                -- semver
--   owner_authority text NOT NULL                              -- PRIN-005 single owner
--   status        gov.record_status NOT NULL DEFAULT 'PROPOSED'
--   supersedes    uuid REFERENCES <same table>(record_uuid)    -- append-only lineage (INV-10)
--   audit_ref     uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid)
--   content       jsonb NOT NULL                               -- registry-specific body
--   content_hash  bytea NOT NULL                               -- sha256(canonical(content))
--   created_at    timestamptz NOT NULL DEFAULT now()
--   created_by    text NOT NULL
--   UNIQUE (logical_id, version)                               -- RG-2 immutable version
```

### 1.4 Append-only + integrity triggers (global)

```sql
-- Canonicalize + hash content on insert (RG-5/RG-6)
CREATE OR REPLACE FUNCTION gov.f_seal_record() RETURNS trigger AS $$
BEGIN
  IF NEW.content_hash IS NULL THEN
    NEW.content_hash := digest(convert_to(jsonb_canonical(NEW.content), 'UTF8'), 'sha256');
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

-- Block mutation of any governance row (RG-2 / INV-10)
CREATE OR REPLACE FUNCTION gov.f_block_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'append-only violation on % (INV-10): rows are superseded, never % ',
    TG_TABLE_NAME, TG_OP USING ERRCODE = 'integrity_constraint_violation';
END; $$ LANGUAGE plpgsql;

-- Applied per table:
--   CREATE TRIGGER trg_seal   BEFORE INSERT ON gov.reg_prin FOR EACH ROW EXECUTE FUNCTION gov.f_seal_record();
--   CREATE TRIGGER trg_noupd  BEFORE UPDATE OR DELETE ON gov.reg_prin FOR EACH ROW EXECUTE FUNCTION gov.f_block_mutation();
```

`jsonb_canonical()` is a deterministic key-sorted serializer (implemented as a small SQL/PLpgSQL helper) so
that `content_hash` is reproducible across nodes (INV-6).

---

## 2. Registry Table Definitions

All eleven registries from `SPEC-GOVERNANCE-REGISTRIES §2`. Each enforces RG-1..8. `content` holds the
registry-specific body; hot query fields are promoted to typed columns.

### 2.1 `REG-AUDIT` — hash-chained audit (defined first; every record references it)

```sql
CREATE TABLE gov.reg_audit (
  entry_uuid    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seq           bigint GENERATED ALWAYS AS IDENTITY,          -- total order
  actor         text  NOT NULL,                               -- attributable (A-1)
  action        text  NOT NULL,                               -- PROPOSE|ACTIVATE|SUPERSEDE|...
  subject_ref   text  NOT NULL,                               -- id@version
  payload       jsonb NOT NULL,
  prev_hash     bytea NOT NULL,                               -- chain link (A-2)
  entry_hash    bytea NOT NULL,                               -- sha256(prev_hash || canonical(payload) || seq || actor)
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ux_audit_seq ON gov.reg_audit(seq);
CREATE TRIGGER trg_audit_noupd BEFORE UPDATE OR DELETE ON gov.reg_audit
  FOR EACH ROW EXECUTE FUNCTION gov.f_block_mutation();
-- entry_hash is computed in gov.f_audit_link() which reads the max(seq) prev row under SERIALIZABLE.
```

### 2.2 `REG-PRIN` — invariant principles (`PCAMG-0000`, 15 records)

```sql
CREATE TABLE gov.reg_prin (
  record_uuid     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry        text NOT NULL DEFAULT 'REG-PRIN' CHECK (registry='REG-PRIN'),
  logical_id      text NOT NULL,                              -- PCAMG-PRIN-001..015
  principle_uuid  uuid NOT NULL UNIQUE,                       -- permanent UUID from PCAMG-0000
  version         text NOT NULL,
  name            text NOT NULL,
  mutability      gov.mutability NOT NULL DEFAULT 'immutable',
  direction_constraint text NOT NULL DEFAULT 'strengthen-only',
  owner_authority text NOT NULL,
  status          gov.record_status NOT NULL DEFAULT 'PROPOSED',
  supersedes      uuid REFERENCES gov.reg_prin(record_uuid),
  audit_ref       uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid),
  content         jsonb NOT NULL,   -- 9 mandated attributes: description, rationale, constraints,
                                    -- validation_rules[], compliance_rules[], amendment_rules{},
                                    -- audit_requirements[], subsumes[]
  content_hash    bytea NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  created_by      text NOT NULL,
  UNIQUE (logical_id, version),
  -- VR-P1: all 9 mandated attributes present
  CONSTRAINT ck_prin_9attr CHECK (
    content ? 'description' AND content ? 'rationale' AND content ? 'constraints'
    AND content ? 'validation_rules' AND content ? 'compliance_rules'
    AND content ? 'amendment_rules' AND content ? 'audit_requirements' AND content ? 'subsumes')
);
```

### 2.3 Remaining registries (uniform shape, registry-specific columns)

```sql
CREATE TABLE gov.reg_meta (   -- Meta-Constitution articles M-I..M-XII (PCAMG-1000)
  record_uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry text NOT NULL DEFAULT 'REG-META' CHECK (registry='REG-META'),
  logical_id text NOT NULL, article text NOT NULL, version text NOT NULL,
  owner_authority text NOT NULL, status gov.record_status NOT NULL DEFAULT 'PROPOSED',
  supersedes uuid REFERENCES gov.reg_meta(record_uuid),
  audit_ref uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid),
  content jsonb NOT NULL, content_hash bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), created_by text NOT NULL,
  UNIQUE (logical_id, version));

CREATE TABLE gov.reg_gov (    -- generated governance systems + generation records (PCAMG-2000)
  record_uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry text NOT NULL DEFAULT 'REG-GOV' CHECK (registry='REG-GOV'),
  logical_id text NOT NULL, version text NOT NULL,
  owner_authority text NOT NULL, status gov.record_status NOT NULL DEFAULT 'PROPOSED',
  generation_record jsonb NOT NULL,           -- compiler inputs@ver + rules@ver
  determinism_hash bytea NOT NULL,            -- CR-9 reproducibility
  supersedes uuid REFERENCES gov.reg_gov(record_uuid),
  audit_ref uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid),
  content jsonb NOT NULL, content_hash bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), created_by text NOT NULL,
  UNIQUE (logical_id, version));

CREATE TABLE gov.reg_center (  -- governance centers PGC-* + delegations (PCAMG-3000)
  record_uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry text NOT NULL DEFAULT 'REG-CENTER' CHECK (registry='REG-CENTER'),
  logical_id text NOT NULL, version text NOT NULL, owner_authority text NOT NULL,
  parent_center uuid REFERENCES gov.reg_center(record_uuid),   -- acyclic (VR-G3)
  status gov.record_status NOT NULL DEFAULT 'PROPOSED',
  supersedes uuid REFERENCES gov.reg_center(record_uuid),
  audit_ref uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid),
  content jsonb NOT NULL, content_hash bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), created_by text NOT NULL,
  UNIQUE (logical_id, version));

CREATE TABLE gov.reg_domain (  -- domain constitutions PDC-GOV-* (PCAMG-4000)
  record_uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry text NOT NULL DEFAULT 'REG-DOMAIN' CHECK (registry='REG-DOMAIN'),
  logical_id text NOT NULL, version text NOT NULL, owner_authority text NOT NULL,
  federation_membership jsonb NOT NULL DEFAULT '[]',
  status gov.record_status NOT NULL DEFAULT 'PROPOSED',
  supersedes uuid REFERENCES gov.reg_domain(record_uuid),
  audit_ref uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid),
  content jsonb NOT NULL, content_hash bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), created_by text NOT NULL,
  UNIQUE (logical_id, version));

CREATE TABLE gov.reg_policy (  -- layer-5 policies
  record_uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry text NOT NULL DEFAULT 'REG-POLICY' CHECK (registry='REG-POLICY'),
  logical_id text NOT NULL, version text NOT NULL, owner_authority text NOT NULL,
  domain_ref uuid NOT NULL REFERENCES gov.reg_domain(record_uuid),
  effect text NOT NULL DEFAULT 'deny' CHECK (effect IN ('permit','deny')),  -- deny-by-default (S1)
  status gov.record_status NOT NULL DEFAULT 'PROPOSED',
  supersedes uuid REFERENCES gov.reg_policy(record_uuid),
  audit_ref uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid),
  content jsonb NOT NULL, content_hash bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), created_by text NOT NULL,
  UNIQUE (logical_id, version));

CREATE TABLE gov.reg_cap (     -- capabilities CAP-01..19
  record_uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry text NOT NULL DEFAULT 'REG-CAP' CHECK (registry='REG-CAP'),
  logical_id text NOT NULL, version text NOT NULL, owner_authority text NOT NULL,
  status gov.record_status NOT NULL DEFAULT 'PROPOSED',
  supersedes uuid REFERENCES gov.reg_cap(record_uuid),
  audit_ref uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid),
  content jsonb NOT NULL, content_hash bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), created_by text NOT NULL,
  UNIQUE (logical_id, version));

CREATE TABLE gov.reg_consent (  -- consent records (PCAMG-8000)
  record_uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry text NOT NULL DEFAULT 'REG-CONSENT' CHECK (registry='REG-CONSENT'),
  logical_id text NOT NULL, version text NOT NULL, owner_authority text NOT NULL,
  subject_principal text NOT NULL, scope jsonb NOT NULL,
  granted boolean NOT NULL, revoked_by uuid REFERENCES gov.reg_consent(record_uuid),
  status gov.record_status NOT NULL DEFAULT 'PROPOSED',
  supersedes uuid REFERENCES gov.reg_consent(record_uuid),
  audit_ref uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid),
  content jsonb NOT NULL, content_hash bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), created_by text NOT NULL,
  UNIQUE (logical_id, version));

CREATE TABLE gov.reg_decision (  -- AUTH-012-class decision/amendment records
  record_uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry text NOT NULL DEFAULT 'REG-DECISION' CHECK (registry='REG-DECISION'),
  logical_id text NOT NULL,                     -- AD-XXXX
  ledger_version text NOT NULL,                 -- monotonic AUTH-012 ledger (e.g. v1.0.14)
  owner_authority text NOT NULL, quorum text NOT NULL,   -- constitutional-majority
  proposer text NOT NULL, certifier text NOT NULL, ratifier text NOT NULL,  -- SoD (VR-G2)
  status gov.record_status NOT NULL DEFAULT 'PROPOSED',
  supersedes uuid REFERENCES gov.reg_decision(record_uuid),
  audit_ref uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid),
  content jsonb NOT NULL, content_hash bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(), created_by text NOT NULL,
  UNIQUE (logical_id, ledger_version),
  CONSTRAINT ck_sod CHECK (proposer<>certifier AND certifier<>ratifier AND proposer<>ratifier));

CREATE TABLE gov.reg_trace (   -- derivation edges (SPEC-TRACEABILITY-FRAMEWORK) — see §3
  edge_uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_ref text NOT NULL,                        -- id@version
  to_ref   text NOT NULL,                        -- id@version | PCAMG-PRIN-*
  relation gov.edge_relation NOT NULL,
  layer_from smallint NOT NULL CHECK (layer_from BETWEEN 0 AND 8),
  layer_to   smallint NOT NULL CHECK (layer_to   BETWEEN 0 AND 8),
  auditor text NOT NULL, created_by_act text NOT NULL,
  supersedes uuid REFERENCES gov.reg_trace(edge_uuid),
  audit_ref uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid),
  content_hash bytea NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_downward CHECK (layer_to <= layer_from));   -- T-2 downward-only authority
```

### 2.4 Derived-artifact tables (validation / compliance)

```sql
CREATE TABLE gov.validation_record (
  validation_uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_ref text NOT NULL, rules_run text[] NOT NULL,
  verdict gov.stage_verdict NOT NULL, findings jsonb NOT NULL DEFAULT '[]',
  determinism_hash bytea NOT NULL, auditor text NOT NULL,
  audit_ref uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid),
  created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE gov.compliance_proof (
  proof_uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_ref text NOT NULL,
  stage_1_principle gov.stage_verdict NOT NULL,
  stage_2_constitutional gov.stage_verdict NOT NULL,
  stage_3_governance gov.stage_verdict NOT NULL,
  stage_4_operational gov.stage_verdict NOT NULL,
  verdict gov.proof_verdict NOT NULL,
  findings jsonb NOT NULL DEFAULT '[]',
  determinism_hash bytea NOT NULL,
  approver text,                              -- required where Approval-Required
  audit_ref uuid NOT NULL REFERENCES gov.reg_audit(entry_uuid),
  created_at timestamptz NOT NULL DEFAULT now(),
  -- fail-closed ordering: later stage PASS impossible if earlier FAIL
  CONSTRAINT ck_stage_order CHECK (
    (stage_1_principle='PASS' OR (stage_2_constitutional<>'PASS'
      AND stage_3_governance<>'PASS' AND stage_4_operational<>'PASS'))
    AND (verdict='ACTIVATE') = (stage_1_principle='PASS' AND stage_2_constitutional='PASS'
      AND stage_3_governance='PASS' AND stage_4_operational='PASS')));
```

---

## 3. Graph Persistence Model

The derivation graph is the authoritative traceability structure. Relational `gov.reg_trace` is the **source
of truth** (durable, audited, append-only); an Apache AGE projection in `gov_graph` provides traversal (up-trace,
cycle detection, impact analysis) inside the same transaction and cluster — no second datastore, so determinism
and durability are preserved.

### 3.1 Graph schema (Apache AGE / openCypher)

```sql
SELECT create_graph('gov_graph');
-- Vertex label: Artifact { ref, layer, kind, status }
-- Vertex label: Principle { ref, uuid }           (PCAMG-PRIN-*)
-- Edge label:   DERIVES { relation, layer_from, layer_to, edge_uuid }
```

### 3.2 Projection trigger (reg_trace → graph, same tx)

```sql
CREATE OR REPLACE FUNCTION gov.f_project_edge() RETURNS trigger AS $$
BEGIN
  PERFORM ag_catalog.cypher('gov_graph', $c$
    MERGE (a {ref:$from}) MERGE (b {ref:$to})
    CREATE (a)-[:DERIVES {relation:$rel, layer_from:$lf, layer_to:$lt, edge_uuid:$eid}]->(b)
  $c$, jsonb_build_object('from',NEW.from_ref,'to',NEW.to_ref,'rel',NEW.relation,
       'lf',NEW.layer_from,'lt',NEW.layer_to,'eid',NEW.edge_uuid));
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_project AFTER INSERT ON gov.reg_trace
  FOR EACH ROW EXECUTE FUNCTION gov.f_project_edge();
```

### 3.3 Graph queries backing the traceability rules

```cypher
-- T-1 complete up-trace: every artifact must reach ≥1 Principle
MATCH (a:Artifact) WHERE NOT (a)-[:DERIVES*1..]->(:Principle) RETURN a.ref;      -- orphans ⇒ FAIL

-- T-5 acyclic: any cycle ⇒ FAIL
MATCH p=(a)-[:DERIVES*1..]->(a) RETURN p LIMIT 1;

-- T-DOWN impact analysis (what a principle charters)
MATCH (p:Principle {ref:$prin})<-[:DERIVES*1..]-(x) RETURN DISTINCT x.ref;
```

### 3.4 Pure-SQL fallback (no AGE dependency)

A recursive CTE over `gov.reg_trace` yields the same up-trace closure and cycle check, guaranteeing the graph
projection is an accelerator, never a source of divergence:

```sql
WITH RECURSIVE up(from_ref,to_ref,depth,path) AS (
  SELECT from_ref,to_ref,1,ARRAY[from_ref] FROM gov.reg_trace WHERE supersedes IS NULL
  UNION ALL
  SELECT u.from_ref,t.to_ref,u.depth+1,u.path||t.from_ref
  FROM up u JOIN gov.reg_trace t ON t.from_ref=u.to_ref
  WHERE NOT t.from_ref = ANY(u.path))              -- cycle guard (T-5)
SELECT from_ref FROM up GROUP BY from_ref
HAVING bool_or(to_ref LIKE 'PCAMG-PRIN-%') = false;  -- orphans (T-1) ⇒ FAIL
```

The materialized view `gov.mv_uptrace_closure` (refreshed transactionally on edge insert) caches this for
`validation-svc` VR-T rules.

---

## 4. API Contracts

Transport: gRPC (service mesh) with a REST/JSON gateway. Every operation is either a **command** (propose-only;
sole effect is a proposed record) or a **query** (read-only). All are evaluated by the PEP **deny-by-default**
before any effect (S1).

### 4.1 Contract conventions

- Command shape: `{ operation, inputs, actor, authority_ref }` → `{ record_uuid, status:'PROPOSED', audit_ref }`.
- Query shape: `{ selector, at_version? }` → `{ records[], determinism_hash }`.
- Idempotency: commands carry `idempotency_key`; replay returns the original `record_uuid`.
- Errors map 1:1 to typed codes (§4.4).

### 4.2 gRPC service surface (proto sketch)

```proto
service RegistryService {
  rpc ProposeRecord   (ProposeRecordReq)   returns (RecordRef);      // command
  rpc GetRecord       (GetRecordReq)        returns (Record);        // query
  rpc ListLineage     (LineageReq)          returns (LineageResp);   // query (supersession chain)
}
service TraceabilityService {
  rpc ProposeEdge     (EdgeReq)             returns (EdgeRef);       // command
  rpc VerifyUpTrace   (SubjectReq)          returns (TraceRecord);   // query (T-1/T-3/T-5)
  rpc ImpactAnalysis  (PrincipleReq)        returns (RefList);       // query (T-DOWN)
}
service CompilerService {
  rpc Compile         (CompileReq)          returns (GenerationRecord); // command → candidate in reg_gov
}
service ValidationService {
  rpc Validate        (SubjectReq)          returns (ValidationRecord); // query-like, records result
}
service ComplianceService {
  rpc ProveCompliance (SubjectReq)          returns (ComplianceProof);  // 4-stage proof
  rpc Activate        (ActivateReq)         returns (RecordRef);        // command; requires ACTIVATE proof
}
service DecisionService  { rpc RecordDecision(DecisionReq) returns (RecordRef); }
service ConsentService   { rpc Grant(ConsentReq) returns (RecordRef); rpc Revoke(RevokeReq) returns (RecordRef); }
service AuditService      { rpc Append(AuditReq) returns (AuditRef); rpc VerifyChain(RangeReq) returns (ChainVerdict); }
```

### 4.3 REST mapping (gateway)

| Method | Path | Kind | Maps to |
|--------|------|------|---------|
| `POST` | `/v1/registries/{reg}/records` | command | `RegistryService.ProposeRecord` |
| `GET`  | `/v1/registries/{reg}/records/{id}?version=` | query | `GetRecord` |
| `GET`  | `/v1/registries/{reg}/records/{id}/lineage` | query | `ListLineage` |
| `POST` | `/v1/trace/edges` | command | `ProposeEdge` |
| `GET`  | `/v1/trace/{id}/uptrace` | query | `VerifyUpTrace` |
| `POST` | `/v1/compile` | command | `Compile` |
| `POST` | `/v1/validate/{id}` | query | `Validate` |
| `POST` | `/v1/compliance/{id}/prove` | query | `ProveCompliance` |
| `POST` | `/v1/compliance/{id}/activate` | command | `Activate` |
| `POST` | `/v1/decisions` | command | `RecordDecision` |
| `POST` | `/v1/consent` / `DELETE /v1/consent/{id}` | command | `Grant` / `Revoke` |
| `GET`  | `/v1/audit/verify?from=&to=` | query | `VerifyChain` |

### 4.4 Error codes (deny-by-default, fail-closed)

| HTTP / gRPC | Code | Cause |
|-------------|------|-------|
| 403 / PERMISSION_DENIED | `AUTHZ-DENY` | No explicit grant (S1 default) |
| 409 / ABORTED | `APPEND-ONLY` | Attempted mutation of an existing record (INV-10) |
| 422 / INVALID_ARGUMENT | `VR-*` | Validation rule failure (rule id returned in findings) |
| 422 / INVALID_ARGUMENT | `CE-*` | Compile error (unrooted, meta, hardcode, sod, sec, trace, nondet, inversion, ambiguous) |
| 409 / FAILED_PRECONDITION | `PROOF-REJECT` | Activation attempted without an ACTIVATE proof |
| 424 / FAILED_PRECONDITION | `FAIL-CLOSED` | Unresolved/ambiguous lookup (RG-8) |
| 500-never | — | No partial/best-effort result is ever returned |

---

## 5. Service Boundaries

Bounded contexts follow the "one service writes one set of registries" rule; cross-context access is
read-only via query APIs or events. No service shares write access to another's tables.

| Context | Service | Write ownership | Consistency | Cross-context contract |
|---------|---------|-----------------|-------------|------------------------|
| **Principle & Meta** | `registry-svc` | `reg_prin`, `reg_meta`, `reg_cap` | strong (SERIALIZABLE) | emits `RecordProposed/Activated` |
| **Generation** | `compiler-svc` | `reg_gov` (candidate) | strong | consumes prin/meta/domain via query; emits `CompilationCompleted` |
| **Polycentric & Domain** | `registry-svc` (center/domain module) | `reg_center`, `reg_domain`, `reg_policy` | strong | acyclic center FK enforced in-DB |
| **Traceability** | `trace-svc` | `reg_trace`, `gov_graph` | strong | sole writer of edges/graph |
| **Validation** | `validation-svc` | `validation_record` | strong; pure/deterministic | stateless compute over pinned snapshots |
| **Compliance & Activation** | `compliance-svc` | `compliance_proof`, status transitions | strong; orchestrates 4 stages | only service that flips `PROPOSED→ACTIVE` |
| **Decision Ledger** | `decision-svc` | `reg_decision` | strong; monotonic ledger | SoD enforced (proposer≠certifier≠ratifier) |
| **Consent** | `consent-svc` | `reg_consent` | strong | referenced by Stage-1 rights checks (VR-C2) |
| **Audit** | `audit-svc` | `reg_audit` | strong; single-writer chain | append sink; verify-chain query |
| **Authorization** | `pep` (gateway) | none | — | evaluates policy/cap; deny-by-default |

Boundary invariants:
- Only `compliance-svc` performs activation, and only against a passing four-stage proof (M-X).
- Only `trace-svc` writes edges, keeping the graph and closure MV consistent.
- `audit-svc` is the single writer of the hash chain to keep `seq`/`prev_hash` monotonic under contention.
- Compiler and validator are **pure**: identical inputs → identical output + hash (INV-6); no wall-clock,
  randomness, or network in the compute path.

---

## 6. Event Schemas

Envelope: CloudEvents 1.0 over NATS JetStream (or Kafka). Events are **facts about append-only state** —
consumers never mutate authoritative state from an event; they build read models.

```json
{
  "specversion": "1.0",
  "id": "0f3e...uuid",
  "source": "urn:pcamg:compliance-svc",
  "type": "pcamg.compliance.proof.emitted.v1",
  "subject": "PCAMG-GOV-0042@1.2.0",
  "time": "2026-07-05T12:00:00Z",
  "datacontenttype": "application/json",
  "data": { }
}
```

| Event type | Emitter | `data` payload |
|------------|---------|----------------|
| `pcamg.registry.record.proposed.v1` | registry-svc | `{record_uuid, registry, logical_id, version, owner, content_hash, audit_ref}` |
| `pcamg.registry.record.activated.v1` | compliance-svc | `{record_uuid, proof_uuid, verdict:"ACTIVATE"}` |
| `pcamg.registry.record.superseded.v1` | registry-svc | `{record_uuid, supersedes, reason_ref}` |
| `pcamg.trace.edge.created.v1` | trace-svc | `{edge_uuid, from_ref, to_ref, relation, layer_from, layer_to}` |
| `pcamg.compile.completed.v1` | compiler-svc | `{gov_uuid, determinism_hash, inputs_versions[], errors:[]}` |
| `pcamg.validation.completed.v1` | validation-svc | `{validation_uuid, artifact_ref, verdict, findings[], determinism_hash}` |
| `pcamg.compliance.proof.emitted.v1` | compliance-svc | `{proof_uuid, subject_ref, stages{s1,s2,s3,s4}, verdict, determinism_hash}` |
| `pcamg.decision.recorded.v1` | decision-svc | `{decision_uuid, logical_id, ledger_version, quorum}` |
| `pcamg.consent.granted.v1` / `.revoked.v1` | consent-svc | `{consent_uuid, subject_principal, scope, granted}` |
| `pcamg.audit.appended.v1` | audit-svc | `{entry_uuid, seq, action, subject_ref, entry_hash}` |

Delivery: at-least-once; consumers dedupe on CloudEvents `id`. Every event `data` carries a hash that ties it
back to its authoritative row (`content_hash` / `determinism_hash` / `entry_hash`) so read models are verifiable.

---

## 7. Runtime Deployment Architecture

### 7.1 Topology

```
                         ┌─────────────────────────────────────────────┐
   clients ──TLS──▶ API Gateway (Envoy)  ──▶  PEP (OPA sidecar, deny-by-default)
                         └───────────────┬─────────────────────────────┘
                                         │ mTLS (service mesh: Istio/Linkerd)
     ┌───────────┬───────────┬───────────┼────────────┬────────────┬───────────┐
 registry-svc  trace-svc  compiler-svc validation-svc compliance-svc decision-svc  consent-svc  audit-svc
     └───────────┴───────────┴───────────┴────────────┴────────────┴───────────┘
                                         │ pgBouncer (transaction pooling)
                                         ▼
              PostgreSQL 16 PRIMARY (gov, gov_graph)  ──logical repl──▶  2× read replicas
                                         │ CDC (Debezium)
                                         ▼
                       NATS JetStream / Kafka  ──▶  read-model projectors, dashboards
   Secrets: HashiCorp Vault (secret_ref only; RG-7/S3)     Object store: WORM bucket for audit export
```

### 7.2 Runtime characteristics

- **Isolation:** all governance writes run `SERIALIZABLE`; retries on `40001` are automatic and idempotent.
- **Single-writer chain:** `audit-svc` runs as a single active replica (leader-elected) to keep the hash
  chain gapless; other services enqueue audit intents.
- **Determinism guardrails:** compiler-svc / validation-svc pods run with no egress network policy, injected
  clock disabled in the compute path, and pinned input snapshots (INV-6).
- **HA / durability (PRIN-010):** primary with synchronous replica (`synchronous_commit=remote_apply`),
  PITR via WAL archiving, nightly WORM export of the audit chain for offline verification (A-3).
- **Scaling:** query traffic fans out to read replicas; command traffic is bounded by the serial write path
  (governance write volume is low and bursty — acceptable).
- **Deny-by-default at the edge:** PEP denies any request lacking an explicit, in-boundary policy grant; empty
  policy set ⇒ total deny (S1). Container images are signed; runtime is admission-gated.

### 7.3 Environments

| Env | Purpose | Data |
|-----|---------|------|
| `ephemeral-ci` | per-PR schema + certification suite | fixtures only |
| `staging` | full pipeline, replicated topology | synthetic corpus |
| `prod` (construction-gated) | authoritative registries | instantiated only under an Article IX / AUTH-012 authorization act |

---

## 8. Migration Plan

Schema and seed migrations are **forward-only** (mirrors append-only doctrine): a mistake is corrected by a
new migration, never by editing a shipped one. Tooling: Sqitch (or Flyway) with checksum verification.

### 8.1 Change set order (dependency-correct)

```
V001__extensions_and_schemas.sql        -- pgcrypto, age, gov/gov_graph, enums, jsonb_canonical()
V002__audit_chain.sql                    -- reg_audit + f_audit_link + genesis row (prev_hash = sha256('PCAMG-GENESIS'))
V003__triggers_common.sql                -- f_seal_record, f_block_mutation
V004__reg_prin.sql                       -- + 9-attr check
V005__reg_meta_gov_center_domain.sql
V006__reg_policy_cap_consent_decision.sql
V007__reg_trace_and_graph.sql            -- reg_trace + create_graph + f_project_edge + mv_uptrace_closure
V008__derived_validation_compliance.sql  -- validation_record, compliance_proof (+ stage-order check)
V009__views_and_indexes.sql              -- lineage views, hot-path indexes
S001__seed_principles.sql                -- 15 PCAMG-PRIN records (PROPOSED) with permanent UUIDs
S002__seed_uptrace_edges.sql             -- reg_trace edges: every P*/IP*/INV*/INV-CORE* → ≥1 PRIN (EX-3/T-4)
```

### 8.2 Bootstrap sequence (construction-gated)

1. Apply `V001–V009` to an empty cluster; run the certification suite (§10) against the empty schema
   (structural gates only).
2. Seed the 15 invariant principles (`S001`) as `PROPOSED`; verify EX-1 (15/15, 9/9 attrs) and EX-2 (unique
   UUIDs) before any activation.
3. Seed preservation up-trace edges (`S002`); verify EX-3/EX-5 (every operational principle maps up; nothing
   deleted) and T-1/T-5 (no orphans, acyclic).
4. Run the four-stage proof over the principle set; only on `ACTIVATE` for all does `compliance-svc` transition
   them `PROPOSED→ACTIVE`. Absent Authority-Board authorization the corpus stays `PROPOSED` (Article IX gate).

### 8.3 Zero-downtime & rollback

- **Expand/contract** for any additive column; never a destructive `ALTER`.
- **Rollback = roll-forward:** a superseding migration + superseding rows; the audit chain and lineage remain
  intact and verifiable (INV-10). No `DROP`/`DELETE` of governance data is ever issued in `prod`.
- Migrations are transactional; `age`/materialized-view builds run `CONCURRENTLY` where supported.

---

## 9. Testing Strategy

| Layer | Scope | Tooling | Key assertions |
|-------|-------|---------|----------------|
| **Unit** | pure functions: `jsonb_canonical`, hash, VR/CR rule evaluators | pgTAP + service-native (Go/Rust) | rule verdicts match spec tables |
| **Property-based** | determinism (INV-6) | Hypothesis/fast-check | ∀ inputs: `compile(x)==compile(x)` and hash equal; shuffled-key JSON → identical `content_hash` |
| **Append-only** | INV-10 enforcement | pgTAP | `UPDATE`/`DELETE` on any `gov.reg_*` raises `APPEND-ONLY`; supersession insert succeeds |
| **Tamper-evidence** | hash chain | integration | mutating a `reg_audit.payload` (out of band) breaks `VerifyChain`; re-link detects gap |
| **Contract** | API compatibility | Pact / buf breaking | command→proposed-only; query→read-only; error codes match §4.4 |
| **Fail-closed** | RG-8 / deny-by-default | integration | empty policy set ⇒ 403 `AUTHZ-DENY`; ambiguous lookup ⇒ `FAIL-CLOSED`; no partial result |
| **Graph** | T-1/T-3/T-5 | integration | inserted cycle ⇒ verify fails; orphan artifact ⇒ up-trace fails; AGE result == SQL CTE result |
| **Pipeline (e2e)** | compile→validate→prove→activate | testcontainers | a rule-violating candidate never activates; a clean candidate activates with a full proof + audit |
| **Concurrency** | serial write path | k6 + jepsen-style | concurrent proposes keep audit `seq` gapless; no lost supersession under `40001` retries |
| **DR** | PRIN-010 | scheduled | PITR restore reproduces identical `content_hash`/chain; offline audit export verifies (A-3) |

Coverage gate: the pipeline e2e and the certification suite (§10) are blocking in CI; a red certification test
blocks merge (fail-closed CI mirrors fail-closed runtime).

---

## 10. Constitutional Certification Suite

Executable, deterministic test cases. Each maps a spec rule to a Given/When/Then and a machine-checkable pass
criterion. The suite is the runtime realization of the four-stage proof: **all cases must PASS for any
activation** (M-X, fail-closed). Suite output is itself a `compliance_proof` row with a `determinism_hash`.

### 10.1 Structural & registry integrity (RG-1..8, EX-1..5)

| Cert | Rule | Given / When / Then | Pass |
|------|------|---------------------|------|
| `CERT-RG1` | RG-1 single source | query any governance value → resolves only from a `reg_*` row | no literal outside registry |
| `CERT-RG2` | RG-2 append-only | attempt `UPDATE gov.reg_prin` | raises `APPEND-ONLY` |
| `CERT-RG3` | RG-3 single owner | every active record | `owner_authority` non-null, exactly one |
| `CERT-RG4` | RG-4 up-trace | every non-`REG-PRIN` active record | ≥1 edge to a `PCAMG-PRIN-*` |
| `CERT-RG5` | RG-5 tamper-evidence | recompute `content_hash` | equals stored; chain verifies |
| `CERT-RG6` | RG-6 determinism | repeat identical query@version | byte-identical result |
| `CERT-RG7` | RG-7 secrets by-ref | scan `content` for secrets | only `secret_ref`, no inline secret |
| `CERT-RG8` | RG-8 fail-closed | ambiguous/unresolved lookup | returns `FAIL-CLOSED`, no default grant |
| `CERT-EX1` | EX-1 completeness | count principle records | 15/15, each 9/9 attributes |
| `CERT-EX2` | EX-2 uniqueness | principle UUIDs & ids | all unique, non-colliding namespaces |
| `CERT-EX3` | EX-3 up-trace coverage | every P*/IP*/INV*/INV-CORE* | maps up to ≥1 PRIN |
| `CERT-EX4` | EX-4 non-contradiction | pairwise principle check | no mutual contradiction |
| `CERT-EX5` | EX-5 preservation | diff against baseline | 0 deletions/weakenings |

### 10.2 Validation rules (VR-*) — Stage 1–3 gate

| Cert | Rule | Assertion |
|------|------|-----------|
| `CERT-VR-P1/P2/P3` | well-formedness | 9-attr present; UUIDs unique; no contradiction |
| `CERT-VR-C1` | principle conformance | artifact violating any PRIN ⇒ REJECT (non-waivable, principle prevails) |
| `CERT-VR-C2` | consent | rights-affecting action without valid `reg_consent` grant ⇒ FAIL |
| `CERT-VR-C3` | sovereignty | any execution/AI claiming sovereignty ⇒ FAIL |
| `CERT-VR-M1/M2` | meta-constitution | non-conformant or self-privileged governance ⇒ FAIL |
| `CERT-VR-T1/T2` | traceability | broken/dangling up-trace or orphan ⇒ FAIL |
| `CERT-VR-D1/D2` | determinism | missing/non-reproducible `determinism_hash` or persistent ambiguity ⇒ FAIL |
| `CERT-VR-S1/S2` | security | S1/S3/S4 weakened or non-deny-default boundary ⇒ FAIL (non-waivable) |
| `CERT-VR-G1..G4` | governance | missing owner, SoD violation, absolute/cyclic authority, or deletion ⇒ FAIL |

### 10.3 Compiler rules (CR-1..12 / CE-*) — generation gate

| Cert | Rule | Assertion |
|------|------|-----------|
| `CERT-CR1` | principle-rooted | unrooted emitted rule ⇒ `CE-UNROOTED` |
| `CERT-CR2` | meta-conformant | ⇒ `CE-META` on violation |
| `CERT-CR3` | no hardcoding | literal governance value ⇒ `CE-HARDCODE` |
| `CERT-CR4/CR5` | owner / SoD | ⇒ `CE-OWNER` / `CE-SOD` |
| `CERT-CR6/CR7` | deny-default / security | ⇒ `CE-SEC` |
| `CERT-CR8` | traceable | incomplete trace ⇒ `CE-TRACE` |
| `CERT-CR9` | deterministic | non-reproducible output ⇒ `CE-NONDET`; re-compile byte-identical |
| `CERT-CR11` | non-inverting | precedence inversion ⇒ `CE-INVERSION` |
| `CERT-CR12` | fail-closed | any unresolved input halts compile; no partial governance emitted |

### 10.4 Auditability guarantees (A-1..5)

| Cert | Guarantee | Assertion |
|------|-----------|-----------|
| `CERT-A1` | attributable | every governed action produced an immutable `reg_audit` entry with `actor` |
| `CERT-A2` | hash-chained | `entry_hash[n] == sha256(entry_hash[n-1] ‖ payload ‖ seq ‖ actor)` for all n |
| `CERT-A3` | offline verifiable | exported WORM chain verifies with no DB access |
| `CERT-A4` | reproducible verdicts | replay recorded evidence → identical verdict + hash |
| `CERT-A5` | no silent activation | every `ACTIVE` record has exactly one `ACTIVATE` `compliance_proof` |

### 10.5 Suite orchestration

```
run_certification():
  s1 = all(CERT-VR-C*, CERT-EX*, CERT-RG*)        # Stage 1 — principle (non-waivable)
  s2 = all(CERT-VR-M*)                             # Stage 2 — constitutional
  s3 = all(CERT-VR-G*, CERT-VR-T*, CERT-CR*)       # Stage 3 — governance
  s4 = all(CERT-VR-S*, CERT-A*, gate checks)       # Stage 4 — operational (S1/S3/S4 non-waivable)
  verdict = ACTIVATE iff (s1 and s2 and s3 and s4) else REJECT   # ordered, fail-closed
  emit compliance_proof(verdict, findings, determinism_hash, audit_ref)
```

A single failing non-waivable cert (`CERT-VR-C*`, `CERT-VR-S*`) forces `REJECT` regardless of other results;
no later stage rescues an earlier failure. The suite is deterministic and total — identical corpus state
yields an identical verdict and `determinism_hash`.

---

**END PCAMG-RUNTIME-0002 — REFERENCE IMPLEMENTATION BLUEPRINT.**
Executable architecture for PCAMG-RUNTIME-0001. Construction/instantiation remains gated by Article IX /
AUTH-012; this document instantiates nothing.


---

## PCAMG-RUNTIME-0003A Remediation Addendum (Append-Only)

> **APPEND-ONLY CORRECTION** issued by `PCAMG-RUNTIME-0003A-CERTIFICATION-REMEDIATION-PACKAGE`.
> No prior line of this blueprint is deleted or rewritten (INV-10). No new doctrine, no constitutional-meaning
> change, no authority reassignment, no construction authorized. Base commit `65deb4c`; date 2026-07-05.

### R-1 — §10.3 compiler-rules reconciliation (closes F-01, MEDIUM)

The canonical compiler catalog is `SPEC-GOVERNANCE-COMPILER-RULES` §3/§4. The §10.3 certification table is
reconciled to it as follows (append-only):

| Cert | Canonical rule | Assertion / error mapping |
|------|----------------|---------------------------|
| `CERT-CR10` *(added)* | **CR-10 Append-only** | recompilation supersedes prior output via supersession link (INV-10); never deletes. Structural discipline; no dedicated `CE-*`. |
| `CERT-CR12` *(affirmed)* | **CR-12 Fail-closed** | any unresolved input halts compile; no partial governance emitted. Ambiguity ⇒ `CE-AMBIGUOUS`. |

All `CE-*` mappings in §10.3 bind to the canonical 10-code catalog: `CE-UNROOTED`, `CE-META`, `CE-HARDCODE`,
`CE-OWNER`, `CE-SOD`, `CE-SEC`, `CE-TRACE`, `CE-NONDET`, `CE-INVERSION`, `CE-AMBIGUOUS`. There is **no**
`CE-UNRESOLVED` in the catalog. With `CERT-CR10` added, the certified compiler-rule set enumerates
**CR-1..12** in full.

**Scope confirmation:** append-only; no code executed; no enrollment; consistent with
`PCAMG-RUNTIME-0001` §5 as corrected by that artifact's `PCAMG-RUNTIME-0003A` addendum R-1.

**END PCAMG-RUNTIME-0003A REMEDIATION ADDENDUM · APPEND-ONLY · F-01 CLOSED.**
