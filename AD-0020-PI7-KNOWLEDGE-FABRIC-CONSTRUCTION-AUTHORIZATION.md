# UCOS — AD-0020 · Scoped Article IX Release for PI-7 Knowledge Fabric

## Authority Board Decision of Record — Narrow Generation-Lock Extension (PI-7 Knowledge Fabric)

| Field | Value |
|-------|-------|
| Artifact | **AD-0020 — PI-7 Knowledge Fabric Construction Authorization** |
| Artifact ID | `UCOS-AUTH-BOARD-AD-0020` |
| Decision-log entry | AUTH-012 **AD-0020** |
| Version | 1.0.0 |
| Decision body | **UCOS Authority Board** (terminal authority; AUTH-009; Constitution Art. IX / Art. XII) |
| Mode | **AUTHORIZATION ACT ONLY** — extends the AD-0016/AD-0017/AD-0018/AD-0019 releases to the PI-7 knowledge fabric; modifies no ratified architecture, ADR, or frozen baseline |
| Inputs (read-only) | `KNOW-GOV-001`, `KNOW-ARCH-001`, `KNOW-GOV-002`, `KNOW-SEC-001`, `KNOW-FED-001`, `KNOW-AUD-001`, `KNOW-THREAT-001`, `KNOW-READINESS-001`, `PI7-AUTH-001` (PHASE 15); `PI7-AUTH-REV-001..004` (PHASE 15.1); `AD-0016..0019`; AD-0014 (Ω∞ disposition); `UCOS-SEC-ARCH-001` (S1/S3/S4); AUTH-003 (IP-01..17) |
| Effective | 2026-07-01T00:00:00Z |
| **Determination** | **RELEASE LOCK — PI-7 KNOWLEDGE-FABRIC SCOPE ONLY** |

> Extends AD-0016 (substrate), AD-0017 (control), AD-0018 (federation), AD-0019 (evolution), all preserved.
> For every scope beyond §2 the Article IX lock and the AD-0014 Ω∞ disposition remain fully in force.

---

## 1. Basis

PHASE 15 produced the ratifiable `KNOW-*` specification set and a readiness determination (**PI-7 READY FOR
AUTHORIZATION REVIEW**) with a threat model (K1–K12) closed at **0 residual High/High**. PHASE 15.1 Board
review (`PI7-AUTH-REV-001..004`) confirms the specifications are internally and cross-spec consistent, compliant
with AUTH-008 (S1/S3/S4), AUTH-009 (governance/SoD/zones), AD-0009 (approval-required acts), and additive over
the AD-0016..0019 fabrics with zero prohibited-core-dir change. The Knowledge Fabric is a governed knowledge
store/query/federation/evolution layer that reuses federation cryptography and audit and routes all governed
knowledge change through the ratified Evolution Fabric. It is **not** an Ω∞ existential/self-directed knowledge
system (AD-0014 stands).

## 2. Authorized Scope (and only this)

| # | Increment | Authorized target | Realizes |
|:-:|-----------|-------------------|----------|
| K-A | **PI-7** | **New knowledge modules** under `src/control/knowledge/*` — knowledge unit/record/namespace, registry, store, query engine, resolver, versioning, lineage, snapshot, import/export, certification/ratification/revocation authorities, federation guard, lifecycle/state machine, audit (reuse or thin wrapper), assembly, index | `KNOW-GOV-001/002`, `KNOW-ARCH-001`, `KNOW-SEC-001`, `KNOW-FED-001`, `KNOW-AUD-001` |
| K-B | **PI-7** | **Tests** under `test/` for knowledge lifecycle, query/resolve, versioning/supersession, lineage, snapshot, import/export, federation, audit, and adversarial K1–K12 | `KNOW-THREAT-001` |

**Allowed metadata namespaces:** `knowledge:record:*`, `knowledge:authority:*`, `knowledge:boundary:*`,
`knowledge:revoked:*`, `knowledge:*` (reserved for the fabric).
**Allowed authorities:** knowledge certification, ratification, revocation, and federated knowledge authorities
(enumerated powers; signed; revocable).
**Allowed registries:** the knowledge record index + authority/boundary/revocation registries (metadata-backed).

**Binding architectural constraints:**
- Additive only: the ratified PI-2/PI-3 substrate, PI-4 control, PI-5 federation, and PI-6 evolution fabrics are
  unchanged; all existing **134/134 tests must remain green**.
- Public seams only (`RegistryPort`, `MetadataPort`, `ConfigurationPort`, `MetaCoreKernel` public API; federation
  `assertions.ts`/`FederatedAuditLog`/trust primitives; the Evolution Fabric).
- **Deny-by-default**, **fail-closed**, **trust-clamping**, **separation of duties**, signed transitions +
  replay/freshness protection, hash-chained tamper-evident audit — mandatory.
- **All governed knowledge mutation routes through the Evolution Fabric** (evolution units targeting the
  `knowledge:` namespace); the Knowledge Fabric introduces no independent mutation/rollback path that bypasses
  the evolution governor.
- Provenance/lineage carried **in data** (FED-PROV convention) — **no first-class provenance fields on core ports**.
- Non-waivable **S1/S3/S4** preserved; secrets/keys **by reference only**; **no custom cryptography** (reuse
  federation primitives).

## 3. Prohibited Scope (remains LOCKED)

- ❌ Modification of `src/meta-core/*`, `src/registry-runtime/*`, `src/metadata-runtime/*`,
  `src/configuration-runtime/*`, `src/contracts/*` — **any such change voids this act** (§5)
- ❌ Modification of `src/control/federation/*` or `src/control/evolution/*` behavior (reuse only)
- ❌ First-class provenance/knowledge fields on core ports
- ❌ Custom cryptography (must reuse `src/control/federation/assertions.ts`)
- ❌ Knowledge-authority escalation (no implicit powers; SoD non-waivable)
- ❌ Federation overrides (foreign knowledge may never override a local `active` record without local
  ratification; boundaries never silently mutated)
- ❌ Any domain/bounded-context/business logic
- ❌ Any Ω∞ existential / self-directed knowledge scope — AD-0014 stands
- ❌ Production deployment / live infrastructure provisioning
- ❌ Mutation of frozen artifacts or enrollment of any existential invariant (INV-14..20 deferred)

## 4. Binding Controls

`IC-1..IC-8` remain binding. Non-waivable **S1/S3/S4** preserved. Concrete knowledge acts — registering a
knowledge authority, issuing/revoking a certification or ratification, admitting a federated knowledge authority,
importing foreign knowledge, issuing a federation re-ratification token — remain **Approval-Required Operations**
(AD-0009) requiring explicit human/Board approval at execution time.

## 5. Revocation

`UCOS-ART9-REL-001` §6 applies. Any construction outside §2 — including **any** core-dir modification, any change
to federation/evolution behavior, custom cryptography, authority escalation, silent federation override, any
domain/business logic, or any Ω∞ scope — voids this act and re-imposes the full lock.

## 6. Determination

> ## RELEASE LOCK — PI-7 KNOWLEDGE-FABRIC SCOPE ONLY
>
> The Authority Board authorizes construction of the PI-7 Knowledge Fabric — new `src/control/knowledge/*`
> modules and tests realizing `KNOW-GOV-001/002`, `KNOW-ARCH-001`, `KNOW-SEC-001`, `KNOW-FED-001`, `KNOW-AUD-001`
> — built additively on the AD-0016..0019 fabrics with **no modification of any substrate core dir**, no change
> to federation/evolution behavior, no custom cryptography, no authority escalation, no silent federation
> override, no domain/business logic, and **no Ω∞ scope**. All other generation remains LOCKED.

## Traceability
- **Refines:** `KNOW-GOV-001/002`, `KNOW-ARCH-001`, `KNOW-SEC-001`, `KNOW-FED-001`, `KNOW-AUD-001`,
  `KNOW-THREAT-001`, `KNOW-READINESS-001`, `PI7-AUTH-001`, `PI7-AUTH-REV-001..004`,
  `UCOS-AUTH-BOARD-AD-0016/0017/0018/0019`, `UCOS-ART9-REL-001`, `UCOS-SEC-ARCH-001`, AD-0014,
  AUTH-003 (IP-01..17), `UCOS-CONST-001` (Art. IX/XII), `AUTH-008/009/012`.
- **Refined by:** the PI-7 knowledge fabric under `packages/platform-runtime/src/control/knowledge/`.
- **Owner:** UCOS Authority Board.

**END AD-0020 — RELEASE LOCK · PI-7 KNOWLEDGE-FABRIC SCOPE ONLY · EFFECTIVE 2026-07-01 · CONSTRUCTION AUTHORIZED.**
