# ONTO-GOV-002 — UCOS Ontology Semantic Integrity & Evolution Governance Specification

| Field | Value |
|-------|-------|
| Artifact | **ONTO-GOV-002 — Ontology Semantic Integrity & Evolution Governance Specification** |
| Workstream | FND-ONTO-03 (PHASE 17 · PI-8.0 Ontology Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, or services |
| Basis | ONTO-ARCH-001, ONTO-GOV-001; AD-0019 (PI-6 Evolution Fabric, RATIFIED); AUTH-003 (IP-14 Migration-Only Evolution, IP-15 Backward-Compatibility Governance); AUTH-008/009/012 |
| Realizes | Semantic-integrity enforcement (taxonomy acyclicity, semantic constraints, referential integrity) and **Ontology Evolution** routed through the Evolution Fabric |
| Prohibited-dir impact | **NONE** — enforcement is a control-layer validation gate; mutation reuses the ratified Evolution Fabric (`src/control/evolution/*`), unchanged |

> This companion to ONTO-GOV-001 governs **how ontology stays correct over time**. Semantic integrity is
> validated **before** any commit; every governed change is **migration-only** (IP-14) and applied **only**
> through the Evolution Fabric — the Ontology Fabric adds **no** independent mutation or rollback path.

---

## 1. Semantic integrity governance

Integrity is enforced by a **pre-commit validation gate** that runs against the *prospective* ontology
graph (current active set + the proposed change). A `block`-severity failure rejects the mutation
**fail-closed** (deny-by-default); nothing is partially applied.

| Integrity rule | Enforcement | Threat |
|----------------|-------------|:------:|
| **SI-1 Referential integrity** | Every entity/relationship/taxonomy/constraint referent must resolve to an `active` record in-namespace or an imported namespace; dangling referents rejected | O4, O6 |
| **SI-2 Domain/range conformance** | A relationship's `domain`/`range` must be `active` entity types; instances violating cardinality rejected | O6, O11 |
| **SI-3 Taxonomy acyclicity** | The taxonomy edge set must remain a **DAG**; a cycle-introducing edge is rejected at write time (topological check) | **O5** |
| **SI-4 Disjointness** | Entities declared disjoint may not co-classify under a shared taxonomy ancestor | O11 |
| **SI-5 Uniqueness** | `(namespace, localId)` unique; exactly one `active` version per logical id | O7 |
| **SI-6 Constraint precedence** | A `block` constraint always wins over a `warn`; constraints may never weaken non-waivable S1/S3/S4 | O11 |
| **SI-7 Semantic non-contradiction** | A proposed change may not make any existing `active` `block` constraint unsatisfiable | O11, O5 |

- **Evaluation point.** The gate runs inside the proposing authority's `certify` step **and** is
  re-evaluated atomically at Evolution-Fabric apply time (defense in depth) — a change that passed at
  proposal but conflicts with concurrently-ratified state is rejected at apply (single in-flight
  transaction makes this deterministic).
- **Determinism.** Validation is a pure function of `(active set, proposed unit)` — independently
  reproducible from the audited record set (mirrors PI-5 offline verification).

## 2. Taxonomy & constraint governance detail

- **Taxonomy (DAG) governance.** Every taxonomy edge insertion runs a cycle check over the prospective
  edge set; multiple-inheritance is allowed only if `multipleInheritance = true` on the taxonomy record
  **and** disjointness (SI-4) still holds. Root re-parenting is a supersession (new version), never an
  in-place edit (IP-14).
- **Semantic constraint governance.** Constraints are themselves versioned ontology records subject to
  certify → ratify (SoD/quorum, ONTO-GOV-001). **Adding or tightening** a `block` constraint requires a
  **backfill assessment**: the prospective active graph must already satisfy it, or the change is bundled
  with the superseding records that make it satisfiable (atomic evolution unit). **Loosening/removing** a
  `block` constraint is Approval-Required and audited. No constraint may target or weaken security
  controls (OGP-7 / SI-6).

## 3. Ontology Evolution (routed through the Evolution Fabric)

**Every** governed ontology mutation is expressed as an **Evolution Unit** targeting the `ontology:`
metadata allowlist and driven through the ratified PI-6 governor:

```
propose ontology change
  → build EvolutionUnit { target: "ontology:record:<ns>:<id>", op: put/supersede/revoke, payload }
  → Evolution Fabric:  submit → approve → certify → ratify → ATOMIC APPLY (deterministic rollback on failure)
  → on apply: SI-1..SI-7 re-validated atomically; hash-chained audit entry emitted (ONTO-AUD-001)
```

- **Inherited governor invariants (non-waivable).** single in-flight transaction (`maxInFlight = 1`),
  `depth = 0` (no cascade/recursion), **self-modification prohibition** (evolution may not target
  `src/control/evolution/*` or its own authority namespaces), rate limits + emergency halt.
- **Migration-only (IP-14).** Ontology change never mutates an existing unit in place; it **supersedes**
  with a new version and records `supersedes`. The prior version is retained/archived (IP-10) for lineage
  and rollback.
- **Backward compatibility (IP-15).** A superseding entity/relationship must preserve compatibility with
  `active` dependents or bundle their coordinated supersession in the same atomic unit; incompatible change
  requires an explicit Approval-Required compatibility break with a migration note.
- **No bypass.** The ontology store exposes **no** public governed write; the only mutation path is the
  Evolution-Fabric route above (closes **O10 unauthorized/silent ontology mutation**). The evolution
  allowlist is scoped to `ontology:`; **no evolution/governor code is modified** (reuse only, AD-0019/AD-0020).
- **Federation compatibility.** A change touching a ratified federation boundary/import requires a
  federation re-ratification token (ONTO-FED-001) — evolution may **never** silently mutate a federated
  ontology boundary.

## 4. Coverage & threat mapping

| Concern | Control | Threat | Residual |
|---------|---------|:------:|:--------:|
| Dangling / broken references | SI-1 pre-commit + apply-time re-validation | O4 | Low |
| Taxonomy cycle injection | SI-3 DAG check (write + apply) | O5 | Low |
| Relationship/cardinality forgery | SI-2, SI-4 | O6, O11 | Low |
| Semantic contradiction | SI-6, SI-7 | O11 | Low |
| Unauthorized/silent mutation | §3 Evolution-Fabric-only path, no bypass | O10 | Low |
| Incompatible drift over time | IP-14/IP-15 migration-only + backfill/compat gate | O7 | Low–Med |

## 5. Traceability
- **Refines:** ONTO-ARCH-001, ONTO-GOV-001; AD-0019 (Evolution Fabric); AUTH-003 (IP-14/IP-15);
  AUTH-008/009/012.
- **Consumed by:** ONTO-AUD-001 (mutation audit), ONTO-THREAT-001 (O4/O5/O6/O7/O10/O11 closure),
  ONTO-READINESS-001, and a future PI-8 implementation act.
- **Owner:** UCOS Authority Board (Architecture & Governance).

**END ONTO-GOV-002 — DESIGN · READY FOR RATIFICATION · MIGRATION-ONLY · EVOLUTION-ROUTED · NO IMPLEMENTATION AUTHORIZED.**
