# UCOS — AD-0023 · Scoped Article IX Release for PI-9 Memory Fabric

## Authority Board Decision of Record — Narrow Generation-Lock Extension (PI-9 Memory Fabric)

| Field | Value |
|-------|-------|
| Artifact | **AD-0023 — PI-9 Memory Fabric Construction Authorization** |
| Artifact ID | `UCOS-AUTH-BOARD-AD-0023` |
| Decision-log entry | AUTH-012 **AD-0023** |
| Version | 1.0.0 |
| Decision body | **UCOS Authority Board** (terminal authority; AUTH-009; Constitution Art. IX / Art. XII) |
| Mode | **AUTHORIZATION ACT ONLY** — extends the AD-0016/AD-0017/AD-0018/AD-0019/AD-0020/AD-0021/AD-0022 releases to the PI-9 memory fabric; modifies no ratified architecture, ADR, or frozen baseline |
| Inputs (read-only) | `MEM-GOV-001`, `MEM-GOV-002`, `MEM-ARCH-001`, `MEM-SEC-001`, `MEM-FED-001`, `MEM-AUD-001`, `MEM-THREAT-001`, `MEM-READINESS-001` (PHASE 18); `MEM-AUTH-REV-001..004`, `MEM-AUTH-001` (PHASE 18.1); `MEM-AUTH-BOARD-001..003` (PHASE 22); `AD-0016..0022` (esp. AD-0021 PI-8 Ontology); AD-0014 (Ω∞ disposition); `UCOS-SEC-ARCH-001` (S1/S3/S4); AUTH-003 (IP-01..17) |
| Effective | 2026-07-01T00:00:00Z |
| **Determination** | **RELEASE LOCK — PI-9 MEMORY-FABRIC SCOPE ONLY** |

> Extends AD-0016 (substrate), AD-0017 (control), AD-0018 (federation), AD-0019 (evolution), AD-0020 (knowledge), AD-0021 (ontology), AD-0022 (simulation), all preserved.
> For every scope beyond §2 the Article IX lock and the AD-0014 Ω∞ disposition remain fully in force.

---

## 1. Basis

PHASE 18 produced the ratifiable `MEM-*` specification set and a readiness determination (**PI-9 READY FOR
AUTHORIZATION REVIEW**) with a threat model (M1–M12) closed at **0 residual High/High**. PHASE 18.1
independent review (`MEM-AUTH-REV-001..004`) confirmed Memory's three **HARD** dependencies — Federation
(AD-0018), Evolution (AD-0019), and Knowledge (AD-0020) — are **implemented and satisfied**; the Ontology
(PI-8) coupling is **ENRICHMENT-class**, Semantic-tier-only, and **deferrable**; the eight specs are
cross-spec consistent (**10/10**); all five load-bearing models validate (**5/5 PASS**); and compliance is
clean (**8/8**). `MEM-AUTH-001` recommended **AUTHORIZE WITH CONDITIONS · PARALLEL · PI-8 NOT REQUIRED
FIRST**.

PHASE 22 Board review (`MEM-AUTH-BOARD-001..003`) independently evaluated the five mandated objectives —
conditions **C-1..C-5**, the parallel-construction claim, the ontology-dependency claim, the security
posture, and the federation posture — and found **0 blocking findings**: conditions accepted (C-1 with
clarification **CL-1**), parallel construction upheld, ontology dependency upheld (**PI-8 not a hard
prerequisite**), security posture **PASS** (non-waivable S1/S3/S4 designed & enforced; signed assertions;
replay protection; no-synthesis recall; **no custom cryptography**), and federation posture **PASS**
(deny-by-default; local sovereignty; namespace isolation; fail-closed; **reuse-only** of AD-0018). The
Board notes that **PI-8 Ontology is now itself authorized (AD-0021, effective 2026-07-01)**, which makes
the parallel-construction analysis concrete between two disjoint, live scoped releases and does not disturb
any PI-9 finding.

The Memory Fabric is a governed **capture → consolidate → index → recall → reconcile → retain → forget**
layer across six tiers (Working, Short-Term, Long-Term, Semantic, Episodic, Federated) over the ratified
substrate and control/federation/evolution/knowledge fabrics; **all durable memory mutation routes through
the ratified Evolution Fabric**, and Semantic memory is co-ratified through the ratified Knowledge Fabric.
It is **not** an Ω∞ existential/self-directed memory (AD-0014 stands).

## 2. Authorized Scope (and only this)

| # | Increment | Authorized target | Realizes |
|:-:|-----------|-------------------|----------|
| M-A | **PI-9** | **New memory modules** under `src/control/memory/*` — memory unit/record/namespace; the six tiers (Working, Short-Term, Long-Term, Semantic, Episodic, Federated); capture/consolidation/promotion pipeline (Evolution-routed); recall/query engine with recall projection; retention & lifecycle engine; classification-monotonic gate; signed memory-assertion verifier; federated-memory guard; audit sink; reconciliation; assembly; index; **optional inert `ontologyRef` adapter (deferred; see C-1/CL-1)** | `MEM-ARCH-001`, `MEM-GOV-001/002`, `MEM-SEC-001`, `MEM-FED-001`, `MEM-AUD-001` |
| M-B | **PI-9** | **Tests** under `test/` for memory lifecycle, retention/forgetting (two-sided guard), recall/projection, consolidation & promotion, classification monotonicity, replay/freshness, federation (deny-by-default, local-shadows-foreign, partition), audit reconciliation, and adversarial M1–M12 | `MEM-THREAT-001` |

**Allowed metadata namespaces:** `memory:record:*`, `memory:namespace:*`, `memory:authority:*`,
`memory:boundary:*`, `memory:retention:*`, `memory:revoked:*`, `federation:*:memory:*`, `memory:*`
(reserved for the fabric). Disjoint from `ontology:*` (AD-0021) and `knowledge:*` (AD-0020).
**Allowed authorities:** memory consolidation, certification, ratification, revocation, retention/legal-hold,
governed-forgetting, and federated-memory authorities (enumerated powers; signed; revocable).
**Allowed registries:** the memory record index + authority/boundary/retention/revocation registries
(metadata-backed).

**Binding architectural constraints:**
- Additive only: the ratified PI-2/PI-3 substrate, PI-4 control, PI-5 federation, PI-6 evolution, PI-7
  knowledge (and the PI-8 ontology / PI-11 simulation scopes) are unchanged; all existing **185/185 tests
  must remain green**.
- Public seams only (`RegistryPort`, `MetadataPort`, `ConfigurationPort`, `MetaCoreKernel` public API;
  federation `assertions.ts`/`FederatedAuditLog`/trust primitives; the Evolution Fabric; the PI-4 pluggable
  `AuditSink`; the PI-7 knowledge fabric for `knowledgeRef` semantic backing/co-ratification).
- **Deny-by-default**, **fail-closed**, **monotonic classification** (S4), **separation of duties**
  (`consolidate≠certify≠ratify≠revoke`), signed transitions + replay/freshness protection, hash-chained
  tamper-evident audit, **no-synthesis recall**, **local-shadows-foreign** federation, and **two-sided
  audit-preserving forgetting** — mandatory.
- **All durable memory mutation routes through the Evolution Fabric** (evolution units targeting the
  `memory:` namespace); the Memory Fabric introduces no independent mutation/rollback path that bypasses the
  evolution governor. **Migration-only** (IP-14); backward-compatibility governed (IP-15).
- Provenance/lineage carried **in data** (FED-PROV convention) — **no first-class provenance/semantic
  fields on core ports**.
- **Memory ≠ authority:** no memory construct may grant identity, trust, permission, or execution.
- Non-waivable **S1/S3/S4** preserved; secrets/keys **by reference only**; **no custom cryptography**
  (reuse federation primitives).
- **Semantic↔Ontology binding deferred (C-1 + CL-1):** the `ontologyRef` is optional, read-only, and
  by-reference behind a bounded adapter, and remains **inert until PI-8 Ontology is IMPLEMENTED and
  independently validated** — authorization of PI-8 under AD-0021 does **not** activate it; activation is a
  later, separate, additive governed integration (not covered by this act).

## 3. Prohibited Scope (remains LOCKED)

- ❌ Modification of `src/meta-core/*`, `src/registry-runtime/*`, `src/metadata-runtime/*`,
  `src/configuration-runtime/*`, `src/contracts/*` — **any such change voids this act** (§5)
- ❌ Modification of `src/control/federation/*`, `src/control/evolution/*`, or `src/control/knowledge/*`
  behavior (reuse only)
- ❌ Any modification of, or import of internals from, `src/control/ontology/*` (AD-0021 scope) — the
  Semantic↔Ontology coupling is by-reference and inert only
- ❌ First-class provenance/semantic fields on core ports
- ❌ Custom cryptography (must reuse `src/control/federation/assertions.ts`)
- ❌ Memory-authority escalation (no implicit powers; SoD non-waivable)
- ❌ Federation overrides (foreign memory may never override a local `active` record without local
  ratification; boundaries never silently mutated; no foreign-driven forget/supersede of local memory or
  audit)
- ❌ Any memory construct that grants identity/trust/permission/execution, or any constraint that weakens a
  non-waivable S1/S3/S4 control
- ❌ Any domain/bounded-context/business logic
- ❌ Any Ω∞ existential / self-directed / autonomous memory scope — AD-0014 stands
- ❌ Production deployment / live infrastructure provisioning
- ❌ Mutation of frozen artifacts or enrollment of any existential invariant (INV-14..20 deferred)

## 4. Binding Controls

The board conditions **C-1..C-5 (with clarification CL-1)** are binding:

- **C-1 (+ CL-1)** — Ontology binding deferred (optional/read-only/by-reference; inert until PI-8
  **implemented**).
- **C-2** — Additive & isolated (new `src/control/memory/*` + additive tests; zero prohibited-core-dir
  change; **185/185** green).
- **C-3** — Reuse-only (no federation/evolution/knowledge behavior change; **no custom cryptography**).
- **C-4** — Approval-Required acts (AD-0009).
- **C-5** — Ω∞ boundary (AD-0014 stands; no INV-14..20).

Non-waivable **S1/S3/S4** preserved. Concrete memory acts — registering a memory authority, issuing/revoking
a certification or ratification, admitting a federated memory authority, importing foreign memory, changing a
retention class, placing/lifting a legal-hold, executing a governed forgetting — remain **Approval-Required
Operations** (AD-0009) requiring explicit human/Board approval at execution time.

## 5. Revocation

`UCOS-ART9-REL-001` §6 applies. Any construction outside §2 — including **any** core-dir modification, any
change to federation/evolution/knowledge behavior, any modification of or internal import from the ontology
scope, custom cryptography, authority escalation, silent federation override, a memory construct that confers
authority or weakens S1/S3/S4, any domain/business logic, or any Ω∞ scope — voids this act and re-imposes the
full lock.

## 6. Determination

> ## RELEASE LOCK — PI-9 MEMORY-FABRIC SCOPE ONLY
>
> The Authority Board authorizes construction of the PI-9 Memory Fabric — new `src/control/memory/*` modules
> and tests realizing `MEM-ARCH-001`, `MEM-GOV-001/002`, `MEM-SEC-001`, `MEM-FED-001`, `MEM-AUD-001` (threat
> coverage `MEM-THREAT-001` M1–M12) — built **additively** on the AD-0016..0022 fabrics with **no
> modification of any substrate core dir**, no change to federation/evolution/knowledge/ontology behavior, no
> custom cryptography, no authority escalation, no silent federation override, no memory construct conferring
> authority or weakening S1/S3/S4, no domain/business logic, and **no Ω∞ scope**. Construction may proceed
> **immediately** and **in parallel** with PI-8 Ontology (AD-0021); the Semantic↔Ontology binding stays
> deferred and inert until PI-8 is implemented (**C-1 + CL-1**). Conditions **C-1..C-5** are binding. All
> other generation remains LOCKED; **AD-0014 stands**.

## Traceability
- **Refines:** `MEM-ARCH-001`, `MEM-GOV-001/002`, `MEM-SEC-001`, `MEM-FED-001`, `MEM-AUD-001`,
  `MEM-THREAT-001`, `MEM-READINESS-001`, `MEM-AUTH-REV-001..004`, `MEM-AUTH-001`, `MEM-AUTH-BOARD-001..003`,
  `UCOS-AUTH-BOARD-AD-0016/0017/0018/0019/0020/0021/0022`, `UCOS-ART9-REL-001`, `UCOS-SEC-ARCH-001`, AD-0014,
  AUTH-003 (IP-01..17, esp. IP-04/IP-10/IP-14/IP-15), `UCOS-CONST-001` (Art. IX/XII), `AUTH-008/009/012`.
- **Refined by:** the PI-9 memory fabric under `packages/platform-runtime/src/control/memory/`.
- **Owner:** UCOS Authority Board.

**END AD-0023 — RELEASE LOCK · PI-9 MEMORY-FABRIC SCOPE ONLY · EFFECTIVE 2026-07-01 · CONSTRUCTION AUTHORIZED.**
