# ONTO-FED-001 — UCOS Ontology Federation Specification

| Field | Value |
|-------|-------|
| Artifact | **ONTO-FED-001 — Ontology Federation Specification** |
| Workstream | FND-ONTO-05 (PHASE 17 · PI-8.0 Ontology Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Basis | ONTO-ARCH-001, ONTO-GOV-001/002, ONTO-SEC-001; **FED-GOV-001 / FED-SEC-001 / FED-PROV-001 / FED-AUD-001** (PI-5, reused); AD-0018 (federation), AD-0020 (knowledge federation guard) |
| Realizes | Cross-node ontology sharing — importing foreign entities/relationships/taxonomies/constraints under local sovereignty |
| **Hard constraint** | **NO change to `src/control/federation/*` behavior** (reuse only) and **NO prohibited-core-dir change** |
| Prohibited-dir impact | **NONE** — foreign ontology lives in the `ontology:federation:*` keyspace; reuses PI-5 assertion/audit/partition primitives |

> Defines how a node **imports and evaluates foreign ontology** without ceding local semantic authority.
> Federation reuses the ratified PI-5 federation fabric wholesale (signed assertions, trust boundaries,
> provenance-by-convention, hash-chained audit) — the Ontology Fabric adds a thin **federation guard**,
> not new federation machinery.

---

## 1. Federation principles (inherit FGP-1..6 from FED-GOV-001)

- **OFP-1 Local Semantic Sovereignty.** A foreign ontology record may **constrain** local meaning only by
  explicit local import + ratification; it may **never** shadow or override a local `active` record
  (extends FGP-1 / PRV-2). Closes **O11/O12**.
- **OFP-2 Deny-by-Default Import.** Absent an explicit, verified, in-boundary import act, every foreign
  ontology assertion is rejected (FGP-2 / OGP-2).
- **OFP-3 Namespace Isolation.** Foreign ontology occupies a disjoint, origin-namespaced keyspace; it is
  never merged into a local namespace (PRV-3). Closes **O4**.
- **OFP-4 Verified-Before-Stored.** No foreign ontology record is persisted until its ONTO-SEC-001
  assertion is cryptographically verified, in-boundary, and unexpired (PRV-4).
- **OFP-5 Bounded, Revocable Import.** Every import is scoped, trust-clamped, expirable, and revocable;
  nothing is transitive by default.
- **OFP-6 Fail-Closed on Partition.** Loss of contact with a foreign ontology authority degrades to deny;
  cached foreign ontology has bounded staleness + hard expiry ⇒ excluded when stale (FGP-4).

## 2. Federated ontology representation (provenance-by-convention)

Reusing FED-PROV-001, foreign ontology is carried **in data**, requiring **no** core-port field:

- **Ids:** `<homeDomain>::<localId>` (e.g., `nodeB::entity.Customer`). Local ids never contain `::`, so a
  foreign record can never collide with or shadow a local id (OFP-1/OFP-3).
- **Keys:** `ontology:federation:<nodeId>:<kind>:<id>` — disjoint from the local `ontology:record:<ns>:`
  space, so a local query never returns foreign ontology (OFP-3, closes **O4**).
- **Provenance envelope (in the record value):**
  `{ origin: { nodeId, homeDomain }, assertedBy: fedAuthorityId, assertionRef, verifiedAt, signatureRef }`
  — mirrors FED-PROV-001; `signatureRef` is a key reference (S3: no inline key material).

## 3. Import pipeline (async ingestion + sync decision — reuses FED-ARCH pattern)

```
foreign node advertises ontology (entity/relationship/taxonomy/constraint)
  → OntologyFederationGuard.fetch()                         (async, network-bound; NEW control-layer module)
  → ONTO-SEC-001 verify (sig / authority / boundary / replay)   (reuse FED-SEC crypto)
  → trust-clamp to boundary.maxTrustLevel + delegation cap
  → SI-1..SI-7 conformance check AGAINST THE LOCAL GRAPH     (ONTO-GOV-002; dangling/cycle/contradiction ⇒ reject)
  → materialize into ontology:federation:<node>:...          (sync put via existing MetadataPort)
  → import act ratified locally (OG-C6/OG-C10)               (foreign never auto-active without local ratification, OFP-1)
  → hash-chained audit entry                                 (ONTO-AUD-001)
```

- The network/async work completes **before** any synchronous decision; the ratified decision path
  reads only local + materialized-foreign records via existing sync `MetadataPort` — **the 185 baseline
  tests remain valid** (same reasoning as FED-ARCH-001 §2).
- **Local-shadows-foreign resolution (OFP-1).** Resolving a **local** id ignores federated ontology
  entirely; a foreign id resolves only in-boundary, verified, non-revoked, and never overrides a local
  `active` record for the same concept.

## 4. Semantic conformance of imports (closes O11 across nodes)

A foreign entity/relationship/taxonomy/constraint may be admitted **only if** its inclusion keeps the
**local** ontology graph valid:

| Check | Rule | Threat |
|-------|------|:------:|
| Reference resolution | foreign relationship's `domain`/`range` must map to a locally-resolvable entity (local or already-imported) | O4, O6 |
| Taxonomy acyclicity | importing foreign taxonomy edges must not introduce a cycle in the local projected taxonomy (SI-3) | O5 |
| Constraint compatibility | a foreign `block` constraint may only **add** denials/restrictions; it may never relax a local `block` constraint or a security control (deny-only, OGP-7) | O11, O2 |
| Disjointness | imported classifications must not violate local disjointness (SI-4) | O11 |

A failing import is rejected fail-closed; partial imports are never applied (atomic, via the Evolution
Fabric per ONTO-GOV-002 §3).

## 5. Federation trust, revocation & partition

- **Trust clamping (O2).** Foreign ontology trust is clamped to `boundary.maxTrustLevel` and the import
  delegation cap (ONTO-SEC-001 §2.3); over-cap contributes 0.
- **Revocation (O9).** Revoking a federation/import authority or a foreign record writes
  `ontology:revoked:<id>` and **propagates fail-closed**: dependent foreign records are excluded from the
  graph immediately; unknown revocation state ⇒ treated as revoked.
- **Partition (O6-analog).** Unreachable foreign authority ⇒ its imports treated as unverifiable ⇒
  excluded (deny). Cached imports honor bounded staleness + hard expiry.
- **Federation-touching evolution.** Any local change that alters a ratified federation import/boundary
  requires a **federation re-ratification token** (reuses the EVO-FED-001 mechanism) — ontology evolution
  may **never** silently mutate a federated ontology boundary (ONTO-GOV-002 §3).

## 6. Prohibited-scope statement

| Concern | Reuse mechanism | New behavior in `src/control/federation/*`? |
|---------|-----------------|:-------------------------------------------:|
| Signature verification | PI-5 `assertions.ts` (Ed25519) | **No** (reuse) |
| Trust boundary / clamping | PI-5 trust primitives | **No** (reuse) |
| Provenance keying | FED-PROV-001 convention | **No** (reuse) |
| Audit chaining | FED-AUD / ONTO-AUD sink | **No** (reuse) |
| Ontology import guard | **new** `src/control/ontology/ontology-federation-guard.ts` | n/a (ontology dir) |

All new federation logic is confined to the future `src/control/ontology/*` guard; PI-5 federation
behavior and the five prohibited core dirs are **untouched**.

## 7. Threat mitigation summary

| Threat | Control | Residual |
|--------|---------|:--------:|
| O1 Foreign entity spoofing | Signed assertions + authority/boundary verify (ONTO-SEC-001) | Low |
| O2 Cross-node trust poisoning | Trust clamping + deny-only foreign constraints | Low–Med |
| O4 Namespace/metadata poisoning | Disjoint `ontology:federation:` keyspace + verified-before-stored | Low |
| O5 Cross-node taxonomy cycle | Import-time DAG conformance (SI-3) | Low |
| O6 Foreign relationship forgery | Reference resolution + cardinality conformance | Low |
| O11 Cross-node semantic contradiction | Deny-only import + SI conformance against local graph | Low |
| O12 Ontology impersonation | Namespaced id + provenance signature + local-shadows-foreign | Low |

## 8. Traceability
- **Refines:** FED-GOV-001/SEC-001/PROV-001/AUD-001; ONTO-ARCH-001, ONTO-GOV-001/002, ONTO-SEC-001;
  AD-0018/0020.
- **Consumed by:** ONTO-AUD-001 (federated audit reconciliation), ONTO-THREAT-001, ONTO-READINESS-001,
  future PI-8 build.
- **Owner:** UCOS Authority Board (Federation & Architecture).

**END ONTO-FED-001 — DESIGN · READY FOR RATIFICATION · LOCAL SOVEREIGNTY PRESERVED · NO IMPLEMENTATION AUTHORIZED.**
