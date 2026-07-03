# ONTO-GOV-001 — UCOS Ontology Governance Specification

| Field | Value |
|-------|-------|
| Artifact | **ONTO-GOV-001 — Ontology Governance Specification** |
| Workstream | FND-ONTO-02 (PHASE 17 · PI-8.0 Ontology Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, or services |
| Basis | ONTO-ARCH-001; AD-0017 (PI-4 control), AD-0020 (PI-7 knowledge governance pattern); AUTH-008/009/012; Constitution Art. IX/XII |
| Realizes | Governance of the ontology constructs (authorities, boundaries, lifecycle, decision rights, escalation) |
| Prohibited-dir impact | **NONE** — all constructs are metadata-stored records interpreted by the existing PI-4 governance/policy engines (metadata-first, IP-04) |

> This specification defines governance **only**. All constructs are runtime, metadata-stored records
> under the `ontology:*` keyspace (ONTO-ARCH-001 §2), reusing the PI-4 governance/policy primitives and
> the PI-7 knowledge authority model — **0 hardcoded authorities, boundaries, or policies** (IP-04).
> Semantic-integrity and evolution governance are specified in the companion **ONTO-GOV-002**.

---

## 1. Principles (ontology-specific, subordinate to the Authority Layer)

- **OGP-1 Single Accountable Namespace Owner.** Every Ontology Namespace has exactly one accountable owner
  (mirrors PEO single-owner); escalation terminates at the local Authority Board (AUTH-009).
- **OGP-2 Deny-by-Default Meaning.** Absent an explicit, verified, in-scope authority act, every proposed
  ontology unit, federated import, or cross-namespace reference is rejected.
- **OGP-3 Separation of Duties.** `propose ≠ certify ≠ ratify ≠ revoke`. No single authority may both
  originate and finalize an ontology record (closes threat O8 authority escalation).
- **OGP-4 Enumerated Powers.** An Ontology Authority holds only the powers explicitly granted
  (`define | certify | ratify | revoke | federate`); an unknown or implied power ⇒ deny.
- **OGP-5 Evolution-Routed Mutation.** All governed ontology change is applied **only** through the
  Evolution Fabric (ONTO-GOV-002 §3). The governance layer authorizes; the Evolution Fabric applies.
- **OGP-6 Fail-Closed & Preserve.** Unknown/unreachable authority, expired certification, or unresolved
  referent ⇒ deny. Records are archived, never destroyed (IP-10).
- **OGP-7 Meaning ≠ Authority.** An ontology construct (entity/relationship/taxonomy/constraint) is
  semantic; it may **never** grant identity, trust, permission, or execution (that remains PI-4/PI-5).

## 2. The governance constructs

Each construct specifies **Purpose · Record · Lifecycle · Decision rights · Escalation · Invariants**.
Records live under `ontology:*` (ONTO-ARCH-001 §2).

### 2.1 Ontology Namespace Governance (`OG-C1`)
- **Purpose.** Governs a semantic scope and the coherent construct set it owns.
- **Record.** `{ namespace, owner, authorities: authorityId[], importAllow: namespace[], defaultEffect: "deny", status }`.
- **Lifecycle.** `proposed → active → (suspended ↔ active) → archived` (archived terminal).
- **Decision rights.** Create/archive/import-grant: local Authority Board (Approval-Required, AD-0009).
- **Escalation.** Board.
- **Invariants.** Single owner; cross-namespace references only to `importAllow` namespaces; archival is
  non-destructive and cascades supersession obligations (referential integrity, ONTO-GOV-002).

### 2.2 Ontology Authority (`OG-C2`)
- **Purpose.** A named authority empowered to act on ontology in a namespace, with enumerated powers.
- **Record.** `{ authorityId, namespace, powers: (define|certify|ratify|revoke|federate)[], keyRef, status }`.
- **Lifecycle.** `registered → active → (suspended ↔ active) → revoked`.
- **Decision rights.** Registration/power changes: Board. Powers are a strict allow-list (OGP-4).
- **Invariants.** Powers are a subset of the namespace's granted scope; `keyRef` binds signing key
  (S3: by reference, never inline — ONTO-SEC-001); unknown power ⇒ reject (closes O8).

### 2.3 Entity Governance (`OG-C3`)
- **Purpose.** Governs the definition/supersession of entity types (ONTO-C5).
- **Decision rights.** Define/supersede: an authority holding `define` in the namespace, then `certify`
  by a distinct authority (SoD), then `ratify` (quorum, OG-C6).
- **Invariants.** No entity referenced by an `active` relationship/constraint may be archived without
  superseding its referents; entity attributes are declarative (no values/code).

### 2.4 Relationship Governance (`OG-C4`)
- **Purpose.** Governs relationship types (ONTO-C6): domain/range, cardinality, inverse.
- **Invariants.** `domain`/`range` must resolve to `active` entity types (in-namespace or imported);
  `inverseOf` reciprocity enforced; a relationship confers **no** authority/trust (OGP-7).

### 2.5 Taxonomy Governance (`OG-C5`)
- **Purpose.** Governs classification hierarchies (ONTO-C7).
- **Invariants.** The taxonomy edge set must remain a **DAG** — cycle-introducing proposals are rejected
  at governance time and again at write time (ONTO-GOV-002 §2, closes **O5**); classification never
  inherits authority.

### 2.6 Ontology Ratification Authority (`OG-C6`)
- **Purpose.** Finalizes an ontology record with a signed ratification requiring a validator **quorum**.
- **Record.** `{ ratAuthorityId, namespace, quorum, keyRef, status }`.
- **Invariants.** Distinct from the certifying authority (SoD, OGP-3); ratification is signed and
  quorum-gated; a ratified record still applies via the Evolution Fabric (OGP-5).

### 2.7 Ontology Certification Authority (`OG-C7`)
- **Purpose.** Issues signature-verifiable certifications attesting a record's semantic validity.
- **Record.** `{ certAuthorityId, namespace, keyRef, status }`.
- **Invariants.** Certifications verify to a registered authority within the applicable boundary;
  the **local** certification store is authoritative for local decisions (closes federated bypass, O9-analog).

### 2.8 Ontology Revocation Authority (`OG-C8`)
- **Purpose.** Revokes entity/relationship/taxonomy/constraint records or federated imports.
- **Record.** `{ revAuthorityId, namespace, revocableKinds[], keyRef }`.
- **Behavior.** Revocations **propagate** and are **fail-closed**: a record in unknown/unreachable
  revocation state is treated as revoked (excluded from the graph). Writes an `ontology:revoked:<id>`
  marker; reuses PI-4/PI-7 revocation semantics.

### 2.9 Ontology Trust Boundary (`OG-C9`)
- **Purpose.** The explicit set of foreign ontology authorities whose assertions this node evaluates
  (consumed by ONTO-FED-001 / ONTO-SEC-001).
- **Record.** `{ boundaryId, members: authorityId[], defaultEffect: "deny", maxTrustLevel, acceptedKinds[] }`.
- **Invariants.** `defaultEffect = deny` (OGP-2); `maxTrustLevel` caps any trust a foreign ontology
  authority may confer (trust clamping — closes **O2**).

### 2.10 Ontology Federation Authority (`OG-C10`)
- **Purpose.** Governs admission of foreign ontology into a local namespace (enumerated `federate` power).
- **Record.** `{ fedAuthorityId, namespace, admissibleNamespaces[], keyRef, status }`.
- **Invariants.** Foreign ontology is namespace-isolated and never shadows a local `active` record without
  local ratification (local sovereignty, ONTO-FED-001); admission is Approval-Required.

### 2.11 Ontology Evolution Binding (`OG-C11`)
- **Purpose.** The governed binding requiring **every** ontology mutation to route through the Evolution
  Fabric via an evolution unit scoped to the `ontology:` allowlist.
- **Invariants.** No independent write/rollback path exists on the ontology store; persistence inherits
  the evolution governor (single in-flight, depth 0, self-modification prohibition), atomic apply/rollback,
  and hash-chained audit (ONTO-GOV-002 §3; closes **O10 unauthorized mutation**).

## 3. Governance coverage matrix

| Construct | Owner (accountable) | Approval-Required? | Fail-closed? | Threats addressed |
|-----------|---------------------|:------------------:|:------------:|-------------------|
| C1 Namespace | Authority Board | Yes (create/archive/import) | Yes (default deny) | O4, O7 |
| C2 Authority | Authority Board | Yes | Yes | O8 |
| C3 Entity governance | define+certify+ratify (SoD) | Yes | Yes | O4, O8 |
| C4 Relationship governance | define+certify+ratify (SoD) | Yes | Yes | O6, O11 |
| C5 Taxonomy governance | define+certify+ratify (SoD) | Yes | Yes (DAG) | O5 |
| C6 Ratification Authority | Authority Board | Yes | Yes (quorum) | O8 |
| C7 Certification Authority | Authority Board | Yes | Yes | O9 |
| C8 Revocation Authority | Authority Board | Yes | Yes (propagate) | O1, O2, O9 |
| C9 Trust Boundary | Authority Board | Yes | Yes (default deny) | O2, O6 |
| C10 Federation Authority | Authority Board | Yes | Yes | O1, O11, O12 |
| C11 Evolution Binding | Evolution governor + Board | Yes | Yes (atomic) | O10 |

**11/11 constructs defined.** All map to existing PI-4 governance primitives (governance processes,
approvals, certifications, revocation, deny-overrides-allow), the PI-7 knowledge authority model, and the
PI-6 evolution governor — plus new `ontology:*` record kinds. **No core-dir change.**

## 4. Traceability
- **Refines:** ONTO-ARCH-001; AD-0017/0020; AUTH-008/009/012; Constitution Art. IX/XII; IP-04/IP-10.
- **Consumed by:** ONTO-GOV-002 (semantic integrity & evolution), ONTO-SEC-001 (assertion verification),
  ONTO-FED-001, ONTO-AUD-001, ONTO-THREAT-001, and a future PI-8 implementation act.
- **Owner:** UCOS Authority Board.

**END ONTO-GOV-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
