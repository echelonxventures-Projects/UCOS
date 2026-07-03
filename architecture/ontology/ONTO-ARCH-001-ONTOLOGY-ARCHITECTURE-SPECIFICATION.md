# ONTO-ARCH-001 — UCOS Ontology Architecture Specification

| Field | Value |
|-------|-------|
| Artifact | **ONTO-ARCH-001 — Ontology Architecture Specification** |
| Workstream | FND-ONTO-01 (PHASE 17 · PI-8.0 Ontology Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, or services |
| Basis | AD-0016 (substrate), AD-0017 (control), AD-0018 (federation), AD-0019 (evolution), AD-0020 (knowledge) — all RATIFIED; AUTH-008/009/012; Constitution Art. IX/XII; IP-04 (metadata-first) |
| Realizes | The PI-8 structural model: Ontology Unit · Ontology Record · Ontology Namespace · Ontology Graph · Entity · Relationship · Taxonomy · Semantic Constraints |
| **Hard constraint** | **NO modification of `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts`** |
| Prohibited-dir impact | **NONE** — all constructs are metadata-stored records under the reserved `ontology:*` keyspace, interpreted by control-layer engines (metadata-first, IP-04) |

> This specification defines the **ontology structural model only**. It authorizes no implementation. The
> Ontology Fabric is a governed semantic layer that imposes **meaning** (entities, relationships,
> taxonomies, constraints) over the already-ratified Knowledge Fabric (PI-7). Every construct is a
> runtime, metadata-stored record; **0 hardcoded entities, relationships, taxonomies, or constraints**
> (IP-04). All **governed mutation routes through the Evolution Fabric** (PI-6); the fabric introduces no
> independent write/rollback path. Implementation remains gated behind a future PI-8 authorization act.

---

## 1. Architectural position

```
  PI-2/PI-3  Substrate (Meta-Core + Registry + Metadata + Configuration)   [PROHIBITED CORE — unchanged]
  PI-4       Control fabrics (Identity/Trust/Policy/Governance + PEP + audit)
  PI-5       Federation fabric (signed assertions, boundaries, provenance, reconciliation)
  PI-6       Evolution fabric (governed, atomic, migration-only change management)
  PI-7       Knowledge fabric (governed knowledge units/records/query/lineage/federation)
  PI-8  ▶    Ontology fabric  (SEMANTIC layer: entities, relationships, taxonomy, constraints)  ← THIS SPEC
```

The Ontology Fabric **consumes** the Knowledge Fabric: an ontology **entity** may reference a governed
knowledge record as its factual backing, but ontology adds the **schema of meaning** — what entity *types*
exist, how they may relate, how they classify, and which semantic rules must always hold. Ontology is to
knowledge what a governed schema is to governed data: it constrains and interprets, it does not restate.

## 2. Reserved keyspace (metadata-first)

All ontology state lives under a disjoint reserved metadata namespace, so existing PI-4/PI-7 queries never
collide with ontology records:

| Kind | Key pattern | Holds |
|------|-------------|-------|
| Ontology Record | `ontology:record:<namespace>:<localId>` | a versioned ontology unit (entity/relationship/taxonomy/constraint) |
| Entity | `ontology:record:<ns>:entity:<id>` | entity-type definition |
| Relationship | `ontology:record:<ns>:rel:<id>` | relationship-type definition |
| Taxonomy | `ontology:record:<ns>:tax:<id>` | taxonomy (classification hierarchy) |
| Constraint | `ontology:record:<ns>:constraint:<id>` | semantic integrity rule |
| Namespace | `ontology:namespace:<ns>` | namespace governance record |
| Authority | `ontology:authority:<id>` | ontology authority (enumerated powers) |
| Boundary | `ontology:boundary:<id>` | ontology trust boundary |
| Revocation | `ontology:revoked:<recordId>` | fail-closed revocation marker |
| Federated | `ontology:federation:<nodeId>:<kind>:<id>` | foreign, provenance-namespaced ontology (ONTO-FED-001) |

Local ids never contain `::`; foreign ids are `<homeDomain>::<localId>` — collision-free coexistence and
local-shadows-foreign resolution (see ONTO-FED-001 / FED-PROV-001 convention).

## 3. Core structural constructs

Each construct specifies **Purpose · Record (data shape) · Invariants**. All records are content-hashed
(`unitHash`) and versioned, reusing the PI-7 knowledge record discipline.

### 3.1 Ontology Unit (`ONTO-C1`)
- **Purpose.** The atomic, immutable, content-addressed unit of ontological meaning — the semantic analog
  of the knowledge unit (PI-7). One of four kinds: `entity | relationship | taxonomy | constraint`.
- **Record.** `{ unitId, kind, namespace, body, unitHash = H(canonical(body)), createdAt, createdBy }`.
- **Invariants.** Immutable once created; identity = `unitHash`; a change produces a **new** unit
  (migration-only, IP-14). `body` is validated against the kind's descriptor schema before acceptance.

### 3.2 Ontology Record (`ONTO-C2`)
- **Purpose.** The **versioned, governed** wrapper binding an Ontology Unit into a namespace with lifecycle
  state and provenance — the addressable, resolvable ontology object.
- **Record.** `{ recordId, namespace, localId, version (semver), unitRef (unitHash), state, supersedes?, provenance, certifiedBy?, ratifiedBy? }`.
- **Lifecycle.** `draft → proposed → certified → ratified → active → (superseded | revoked | archived)`
  (reuses the PI-7 guarded transition table; terminal states terminal).
- **Invariants.** Exactly one `active` version per `(namespace, localId)`; supersession is explicit and
  audited; every state transition is signed (ONTO-SEC-001) and hash-chain audited (ONTO-AUD-001);
  persistence occurs **only** via the Evolution Fabric (ONTO-GOV-002 §3).

### 3.3 Ontology Namespace (`ONTO-C3`)
- **Purpose.** A governed semantic scope owning a coherent set of entities/relationships/taxonomies/
  constraints under a single accountable authority.
- **Record.** `{ namespace, owner (single accountable), authorities: authorityId[], defaultEffect: "deny", status }`.
- **Invariants.** Single-owner (mirrors PEO); `defaultEffect = deny` for foreign assertions into the
  namespace; a relationship/constraint may only reference entity types resolvable **within the namespace
  or an explicitly imported namespace** (no dangling references); namespace deletion is archival, never
  destructive (IP-10 preserve-don't-destroy).

### 3.4 Ontology Graph (`ONTO-C4`)
- **Purpose.** The **derived, read-only** view assembled by resolving all `active` entity, relationship,
  and taxonomy records in a namespace (plus imported namespaces) into a typed, directed graph. The graph
  is a *projection*, not a stored mutable object — it has no independent authority.
- **Shape (conceptual).** `nodes = active entities; edges = active relationships (typed, directed); classification edges = active taxonomy links`.
- **Invariants.** The graph is **always** the deterministic projection of the current active record set
  (no hidden state); it satisfies all active semantic constraints and is **acyclic on taxonomy edges**
  (ONTO-GOV-002); an unresolvable/expired/revoked referent is **excluded fail-closed** (never silently
  substituted). Graph assembly is pure and reproducible from the audited record set.

### 3.5 Entity (`ONTO-C5`)
- **Purpose.** A named ontological **type** (class of thing) — the node type of the graph.
- **Record (body).** `{ entityId, label, attributes: { name, type, required }[], parents?: entityId[] (taxonomy anchor), knowledgeRef?: knowledgeRecordId, description }`.
- **Invariants.** `entityId` unique within its namespace; `attributes` are declarative type descriptors
  (no values, no code); `knowledgeRef`, when present, must resolve to a governed PI-7 knowledge record
  (reference, not copy); an entity referenced by any `active` relationship or constraint cannot be
  archived without superseding those referents (referential integrity, ONTO-GOV-002).

### 3.6 Relationship (`ONTO-C6`)
- **Purpose.** A named, typed, directed association **between entity types** — the edge type of the graph.
- **Record (body).** `{ relId, label, domain: entityId, range: entityId, cardinality: ("1:1"|"1:N"|"N:1"|"N:M"), symmetric?: bool, transitive?: bool, inverseOf?: relId }`.
- **Invariants.** `domain`/`range` must resolve to `active` entity types in-namespace or an imported
  namespace; `inverseOf` must be reciprocal; cardinality is declarative and enforced by constraints at the
  graph level; a relationship never grants authority/trust/permission (it is semantic, not a control edge).

### 3.7 Taxonomy (`ONTO-C7`)
- **Purpose.** A governed **classification hierarchy** over entity types (is-a / broader-narrower).
- **Record (body).** `{ taxId, label, root: entityId, edges: { parent: entityId, child: entityId }[], multipleInheritance?: bool }`.
- **Invariants.** The taxonomy edge set is a **DAG** — cycle injection is rejected at write time
  (ONTO-GOV-002 §2, closes threat O5); every referenced entity is `active`; a taxonomy spans exactly one
  namespace unless composed via explicit import; classification is inheritance of *type*, never of
  authority.

### 3.8 Semantic Constraints (`ONTO-C8`)
- **Purpose.** Declarative **integrity rules** the ontology graph must always satisfy (the semantic
  equivalent of contract validation).
- **Record (body).** `{ constraintId, label, scope: (entity|relationship|taxonomy|graph), rule, severity: ("block"|"warn"), appliesTo: (entityId|relId|taxId)[] }`.
- **Rule vocabulary (declarative, no code).** required-attribute · attribute-type · cardinality-bound ·
  domain-range-conformance · taxonomy-acyclicity · disjointness (entities that may not co-classify) ·
  reference-integrity (no dangling referent) · uniqueness.
- **Invariants.** Constraints are **evaluated before any commit** (ONTO-GOV-002 §2); a `block`-severity
  violation **fails closed** (mutation rejected, deny-by-default); constraints are versioned records and
  are themselves subject to certification/ratification; **no constraint may weaken a non-waivable S1/S3/S4
  control** (constraints govern meaning, not security).

## 4. Resolution & query architecture

```
  request(namespace, localId | query)
    → OntologyResolver: local lookup first (ontology:record:<ns>:...)
        → on miss + in-boundary/verified origin: federated lookup (ontology:federation:<node>:...)   [ONTO-FED-001]
    → OntologyQueryEngine: namespace/prefix/kind filter, version-range, active-only,
        revocation filter (fail-closed), trust filter (fail-closed)                                   [reuses PI-7 query discipline]
    → OntologyGraph projection: assemble active entities/relationships/taxonomy → validate constraints
    → return typed, constraint-satisfied graph or record (never partial/optimistic)
```

- **Local sovereignty (PRV-2 / FGP-1).** On any id collision, the **local** record is authoritative; a
  foreign ontology record may never shadow or override a local `active` record without local ratification.
- **Fail-closed.** Any unresolved referent, expired federated record, revoked record, or unsatisfied
  `block` constraint excludes the affected element and denies the mutation — never a silent substitution.
- **Determinism.** The projected graph is a pure function of the audited active record set — reproducible
  and independently verifiable (mirrors PI-5 offline audit verification).

## 5. Feasibility proof — zero prohibited-core-dir change

| Concern | Encoding mechanism | Existing accepting surface | Core-dir change? |
|---------|--------------------|----------------------------|:----------------:|
| Ontology records | `MetadataPort.put("ontology:record:...", value)` | `MetadataPort` accepts any key/value | **No** |
| Unit content hashing | reuse PI-7 `unitHash` discipline (control layer) | `src/control/knowledge/*` (control) | **No** |
| Entity ↔ knowledge link | `knowledgeRef` = a knowledge recordId (data reference) | reference only; no schema change | **No** |
| Graph projection | pure read over `MetadataPort.query("ontology:record:<ns>:")` | existing sync query | **No** |
| Governed mutation | route a put-metadata Evolution Unit through the Evolution Fabric | `src/control/evolution/*` (control) | **No** |
| Provenance / federation | `ontology:federation:` disjoint prefix + in-data `provenance` (FED-PROV convention) | metadata keys/values | **No** |
| Authorities / boundaries | metadata-backed registries (like PI-7 knowledge registry) | `src/control/*` | **No** |

**Conclusion.** Every ontology construct is expressible using surfaces the substrate already exposes as
**data** and engines already present in the **control layer** (`src/control/*`). The five prohibited
substrate core dirs are **untouched**; all future implementation is confined to `src/control/ontology/*`.

## 6. Traceability
- **Refines:** AD-0016/0017/0018/0019/0020; AUTH-008/009/012; Constitution Art. IX/XII; IP-04/IP-10/IP-14.
- **Consumed by:** ONTO-GOV-001 (governance of these constructs), ONTO-GOV-002 (semantic-integrity &
  evolution), ONTO-SEC-001, ONTO-FED-001, ONTO-AUD-001, ONTO-THREAT-001, and a future PI-8 build.
- **Owner:** UCOS Authority Board (Architecture).

**END ONTO-ARCH-001 — DESIGN · READY FOR RATIFICATION · ZERO PROHIBITED-CORE-DIR CHANGE · NO IMPLEMENTATION AUTHORIZED.**
