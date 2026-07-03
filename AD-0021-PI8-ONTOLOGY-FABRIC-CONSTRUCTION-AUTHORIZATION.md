# UCOS — AD-0021 · Scoped Article IX Release for PI-8 Ontology Fabric

## Authority Board Decision of Record — Narrow Generation-Lock Extension (PI-8 Ontology Fabric)

| Field | Value |
|-------|-------|
| Artifact | **AD-0021 — PI-8 Ontology Fabric Construction Authorization** |
| Artifact ID | `UCOS-AUTH-BOARD-AD-0021` |
| Decision-log entry | AUTH-012 **AD-0021** |
| Version | 1.0.0 |
| Decision body | **UCOS Authority Board** (terminal authority; AUTH-009; Constitution Art. IX / Art. XII) |
| Mode | **AUTHORIZATION ACT ONLY** — extends the AD-0016/AD-0017/AD-0018/AD-0019/AD-0020 releases to the PI-8 ontology fabric; modifies no ratified architecture, ADR, or frozen baseline |
| Inputs (read-only) | `ONTO-ARCH-001`, `ONTO-GOV-001`, `ONTO-GOV-002`, `ONTO-SEC-001`, `ONTO-FED-001`, `ONTO-AUD-001`, `ONTO-THREAT-001`, `ONTO-READINESS-001` (PHASE 17); `ONTO-AUTH-REV-001..004` (PHASE 17.1); `AD-0016..0020`; AD-0014 (Ω∞ disposition); `UCOS-SEC-ARCH-001` (S1/S3/S4); AUTH-003 (IP-01..17) |
| Effective | 2026-07-01T00:00:00Z |
| **Determination** | **RELEASE LOCK — PI-8 ONTOLOGY-FABRIC SCOPE ONLY** |

> Extends AD-0016 (substrate), AD-0017 (control), AD-0018 (federation), AD-0019 (evolution), AD-0020 (knowledge), all preserved.
> For every scope beyond §2 the Article IX lock and the AD-0014 Ω∞ disposition remain fully in force.

---

## 1. Basis

PHASE 17 produced the ratifiable `ONTO-*` specification set and a readiness determination (**PI-8 READY
FOR AUTHORIZATION REVIEW**) with a threat model (O1–O12) closed at **0 residual High/High**. PHASE 17.1
Board review (`ONTO-AUTH-REV-001..004`) independently confirms the specifications are internally and
cross-spec consistent (7/7 dimensions), the O1–O12 posture is accepted (0 High/High), and all five binding
constraints — no custom cryptography, no prohibited-core modification, additive-only construction,
Federation-Fabric reuse, and Evolution-Fabric reuse — are satisfied and **verified feasible against the
ratified `src/control/*` codebase** (Ed25519 `assertions.ts`, the evolution `evolvableAllowlist` +
prohibited-core-path governor, and the pluggable `AuditSink`). The Ontology Fabric is a governed semantic
schema layer (entities, relationships, taxonomies, constraints) over the ratified Knowledge Fabric; all
governed ontology change routes through the ratified Evolution Fabric. It is **not** an Ω∞
existential/self-directed ontology (AD-0014 stands).

## 2. Authorized Scope (and only this)

| # | Increment | Authorized target | Realizes |
|:-:|-----------|-------------------|----------|
| O-A | **PI-8** | **New ontology modules** under `src/control/ontology/*` — ontology unit/record/namespace, ontology graph projection, entity/relationship/taxonomy/constraint model, registry (authorities/boundaries), store (read-only), query engine, resolver, semantic-integrity gate (SI-1..SI-7), certification/ratification/revocation authorities, federation guard, lifecycle/state machine, audit sink, assembly, index | `ONTO-ARCH-001`, `ONTO-GOV-001/002`, `ONTO-SEC-001`, `ONTO-FED-001`, `ONTO-AUD-001` |
| O-B | **PI-8** | **Tests** under `test/` for ontology lifecycle, query/resolve, graph projection, semantic integrity (referential integrity, taxonomy DAG, constraints, non-contradiction), versioning/supersession, federation, audit, and adversarial O1–O12 | `ONTO-THREAT-001` |

**Allowed metadata namespaces:** `ontology:record:*`, `ontology:namespace:*`, `ontology:authority:*`,
`ontology:boundary:*`, `ontology:revoked:*`, `ontology:federation:*`, `ontology:*` (reserved for the fabric).
**Allowed authorities:** ontology certification, ratification, revocation, and federated ontology
authorities (enumerated powers `define|certify|ratify|revoke|federate`; signed; revocable).
**Allowed registries:** the ontology record index + authority/boundary/revocation registries (metadata-backed).

**Binding architectural constraints:**
- Additive only: the ratified PI-2/PI-3 substrate, PI-4 control, PI-5 federation, PI-6 evolution, and PI-7
  knowledge fabrics are unchanged; all existing **185/185 tests must remain green**.
- Public seams only (`RegistryPort`, `MetadataPort`, `ConfigurationPort`, `MetaCoreKernel` public API;
  federation `assertions.ts`/`FederatedAuditLog`/trust primitives; the Evolution Fabric; the PI-4
  pluggable `AuditSink`; the PI-7 knowledge fabric for `knowledgeRef` backing).
- **Deny-by-default**, **fail-closed**, **trust-clamping**, **separation of duties** (`propose≠certify≠
  ratify≠revoke`), signed transitions + replay/freshness protection, hash-chained tamper-evident audit,
  **taxonomy DAG acyclicity**, and **referential integrity** — mandatory.
- **All governed ontology mutation routes through the Evolution Fabric** (evolution units targeting the
  `ontology:` namespace); the Ontology Fabric introduces no independent mutation/rollback path that
  bypasses the evolution governor. **Migration-only** (IP-14); backward-compatibility governed (IP-15).
- Provenance/lineage carried **in data** (FED-PROV convention) — **no first-class provenance/semantic
  fields on core ports**.
- **Meaning ≠ authority:** no ontology construct may grant identity, trust, permission, or execution.
- Non-waivable **S1/S3/S4** preserved; secrets/keys **by reference only**; **no custom cryptography**
  (reuse federation primitives).
- **Advisory (pre-merge, non-blocking):** reconcile the ONTO-ARCH-001 §3.2 lifecycle state name
  `proposed` with the ratified PI-7 `validated` (ONTO-AUTH-REV-001 §8 / REV-004 §3).

## 3. Prohibited Scope (remains LOCKED)

- ❌ Modification of `src/meta-core/*`, `src/registry-runtime/*`, `src/metadata-runtime/*`,
  `src/configuration-runtime/*`, `src/contracts/*` — **any such change voids this act** (§5)
- ❌ Modification of `src/control/federation/*` or `src/control/evolution/*` behavior (reuse only)
- ❌ First-class provenance/semantic fields on core ports
- ❌ Custom cryptography (must reuse `src/control/federation/assertions.ts`)
- ❌ Ontology-authority escalation (no implicit powers; SoD non-waivable)
- ❌ Federation overrides (foreign ontology may never override a local `active` record without local
  ratification; boundaries never silently mutated)
- ❌ Any ontology construct that grants identity/trust/permission/execution, or any constraint that
  weakens a non-waivable S1/S3/S4 control
- ❌ Any domain/bounded-context/business logic
- ❌ Any Ω∞ existential / self-directed ontology scope — AD-0014 stands
- ❌ Production deployment / live infrastructure provisioning
- ❌ Mutation of frozen artifacts or enrollment of any existential invariant (INV-14..20 deferred)

## 4. Binding Controls

`IC-1..IC-8` remain binding. Non-waivable **S1/S3/S4** preserved. Concrete ontology acts — registering an
ontology authority, issuing/revoking a certification or ratification, admitting a federated ontology
authority, importing foreign ontology, issuing a federation re-ratification token, loosening/removing a
`block` constraint — remain **Approval-Required Operations** (AD-0009) requiring explicit human/Board
approval at execution time.

## 5. Revocation

`UCOS-ART9-REL-001` §6 applies. Any construction outside §2 — including **any** core-dir modification, any
change to federation/evolution behavior, custom cryptography, authority escalation, silent federation
override, a semantic construct that confers authority or weakens S1/S3/S4, any domain/business logic, or
any Ω∞ scope — voids this act and re-imposes the full lock.

## 6. Determination

> ## RELEASE LOCK — PI-8 ONTOLOGY-FABRIC SCOPE ONLY
>
> The Authority Board authorizes construction of the PI-8 Ontology Fabric — new `src/control/ontology/*`
> modules and tests realizing `ONTO-ARCH-001`, `ONTO-GOV-001/002`, `ONTO-SEC-001`, `ONTO-FED-001`,
> `ONTO-AUD-001` — built additively on the AD-0016..0020 fabrics with **no modification of any substrate
> core dir**, no change to federation/evolution behavior, no custom cryptography, no authority escalation,
> no silent federation override, no semantic construct conferring authority or weakening S1/S3/S4, no
> domain/business logic, and **no Ω∞ scope**. All other generation remains LOCKED.

## Traceability
- **Refines:** `ONTO-ARCH-001`, `ONTO-GOV-001/002`, `ONTO-SEC-001`, `ONTO-FED-001`, `ONTO-AUD-001`,
  `ONTO-THREAT-001`, `ONTO-READINESS-001`, `ONTO-AUTH-REV-001..004`,
  `UCOS-AUTH-BOARD-AD-0016/0017/0018/0019/0020`, `UCOS-ART9-REL-001`, `UCOS-SEC-ARCH-001`, AD-0014,
  AUTH-003 (IP-01..17, esp. IP-04/IP-10/IP-14/IP-15), `UCOS-CONST-001` (Art. IX/XII), `AUTH-008/009/012`.
- **Refined by:** the PI-8 ontology fabric under `packages/platform-runtime/src/control/ontology/`.
- **Owner:** UCOS Authority Board.

**END AD-0021 — RELEASE LOCK · PI-8 ONTOLOGY-FABRIC SCOPE ONLY · EFFECTIVE 2026-07-01 · CONSTRUCTION AUTHORIZED.**
