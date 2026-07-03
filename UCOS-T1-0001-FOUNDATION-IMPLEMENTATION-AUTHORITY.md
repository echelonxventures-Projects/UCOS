# UCOS-T1-0001 — FOUNDATION IMPLEMENTATION AUTHORITY

## Execution Package

| Field | Value |
|-------|-------|
| Instrument | **FOUNDATION IMPLEMENTATION AUTHORITY — EXECUTION PACKAGE** |
| Instrument ID | `UCOS-T1-0001` |
| Version | 1.0.0 |
| Tier | **T1 — Foundation Implementation** (`UCOS-BL-1.0` §BL-0005) |
| Mode | **IMPLEMENTATION-AUTHORITY SPECIFICATION (planning)** — enumerates the implementation-ready foundation assets, backlog, realization map, build order, and contracts of the realized MCR. **No source code, schema, DDL, API implementation, requirement, RC class, invariant, governance, or authority is produced or modified.** Source-code authoring is a prohibited activity under the active lock (`UCOS-CONSTRUCTION-BLOCKED §3`; `UCOS-EXEC-0001` Prohibition 1); asset specification is a permitted planning activity (`UCOS-CONSTRUCTION-BLOCKED §4`). |
| Date | 2026-07-03 |
| Operates under | `UCOS-BL-1.0` (Baseline 1.0 freeze); `UCOS-S0-0001..0007` (Stage-0); `UCOS-EP-0001..0008` (Execution Program); `UCOS-EXEC-0001` (Execution Constitution); `AUTH-001..012` (Authority Layer); `UCOS-ASR-NFR-001` (INV-1..13) |
| Governing constraints | Corpus **FROZEN**. INV-1..13 unchanged; `AD-0014` intact; Article IX generation lock **ACTIVE**; **`UCOS-CONSTRUCTION-BLOCKED` stands**; **G0 = FAIL (0/14)** (`UCOS-G0-0006`). Additive-only; 5 prohibited substrate core dirs never modified; 0 REDESIGN; 0 requirement/RC/invariant/governance/authority creation. |
| Produces | `T1-0001` (§1) · `T1-0002` (§2) · `T1-0003` (§3) · `T1-0004` (§4) · `T1-0005` (§5) · Execution Authorization (§6) |
| **Determination** | **T1 IMPLEMENTATION ASSETS: READY (specification-complete) · CONSTRUCTION EXECUTION: NOT READY — GATED ON G0 = PASS** (see §6) |

> **Standing (binding).** The T1 foundation is **realized of record** as the PI-2..PI-9 Minimum Constitutional
> Runtime (MCR) at **269/269** (`UCOS-IR-0005 §9`; `UCOS-IR-0008 §5`). This package converts the frozen
> constitutional corpus into the **implementation-authority asset set** that governs — and that any authorized
> forward build must preserve additively. It **authorizes no construction** and **writes no runtime code**:
> construction is reserved to the Authority Board and gated on **G0 = PASS** (`UCOS-S0-0007`; `UCOS-EP-0006`
> Gate 0). All assets below are **implementation-ready specifications**, not source.

---

# PHASE 1 — FOUNDATION INVENTORY

## T1-0001 — FOUNDATION COMPONENT REGISTER

Every foundation component required by Stage-0 (`UCOS-S0-*`) and T1, drawn verbatim from the frozen corpus. No
component is invented. `State` is the realization-of-record: **EXISTS** (realized at 269/269), **PARTIAL**
(present with recorded convergence/attestation debt), **SPEC** (specified, physical realization gated on G0).

### 1.1 FOUNDATIONAL fabrics — existence floor (`UCOS-IR-0003 §2`)

| ID | Component | Purpose | Dependencies | Inputs | Outputs | Authority source | Acceptance criteria | State |
|----|-----------|---------|--------------|--------|---------|------------------|---------------------|:-----:|
| FAB-REG | Registry | Make every construct addressable `id@version` | — (genesis) | register/resolve calls | construct records | RC-024/041; PEP-001 | FT-1, RT-1 PASS | EXISTS |
| FAB-META | Metadata | Describe/type/configure constructs (open-class) | REG | describe calls | metadata records | RC-024; PEP-002 | FT-2, RT-1 PASS | EXISTS |
| FAB-CFG | Configuration | Behavior-as-data; zero hardcoding | REG, META | config records | resolved behavior | IP-04; PEP-003 | FT-3 PASS | EXISTS |
| FAB-EXEC | Meta-Core / Execution | Deterministic reflexive execution & composition | REG, META, CFG | capability graph | execution result | RC-045/038; INV-CORE-09 | FT-4, INV-T-5 PASS | EXISTS |
| FAB-EVT | Event | Event catalog; at-least-once tolerant propagation | REG, META, EXEC | emit/subscribe | delivered events | RC-028; INV-6 | FT-6 PASS | EXISTS |
| FAB-IDENT | Identity | Name principals (open `kind`); authz subject | REG, META | principal records | identity resolution | RC-005/023 | INV-T-2 (S1) PASS | EXISTS |
| FAB-AUTH | Authority | Authorize decisions; Authority Hierarchy + AUTH-012 ledger | REG, META, EVO*(bootstrap)* | decision submissions | ledger entries | RC-002/033; `AUTH-001..012` | RT-4, IT-2 PASS | **PARTIAL** (GAP-M1 dup; attestation) |
| FAB-GOV | Governance | Admit change; gates QUAL/SEC/DOC/REL; Approval-By-Exception | AUTH, POL, AUDIT, EVO | change requests | gate outcomes | RC-004; `AD-0009` | gate outcomes recorded | EXISTS |
| FAB-POL | Policy | Deny-by-default authorization / constraint eval | IDENT, TRUST, META, CFG | policy records | allow/deny decision | RC-060/014; INV-3 | INV-T-3 PASS | **PARTIAL** (GAP-M3 vocab) |
| FAB-EVO | Evolution | **Sole durable-mutation commit path** (append-only) | REG, META, AUTH*(bootstrap)*, AUDIT | commit proposals | committed mutation | RC-013; INV-10; IP-14 | FT-5, IT-4 PASS | EXISTS |
| FAB-STATE | State / Lifecycle | Version/history/lifecycle transitions | REG, META, EVO | lifecycle events | state records | RC-027; INV-10 | IT-5 PASS | **PARTIAL** (GAP-M2 4× engines) |
| FAB-AUDIT | Audit / Provenance | Append-only hash-chained, offline-verifiable record | REG, EVT, EVO*(bootstrap)* | audit events | hash-chained log | RC-037; S6; INV-10 | IT-2, IT-3 PASS | **PARTIAL** (GAP-C1 6× dup) |

### 1.2 CORE fabrics — constitutional completeness (`UCOS-IR-0003 §3`)

| ID | Component | Purpose | Dependencies | Authority source | Acceptance criteria | State |
|----|-----------|---------|--------------|------------------|---------------------|:-----:|
| FAB-TRUST | Trust | Attribute-driven trust evaluation / clamping | IDENT, META | RC-006 | trust clamp honored | EXISTS |
| FAB-SEC | Security | Non-waivable S1/S3/S4/S6 on every exposed boundary | IDENT, TRUST, POL | RC-014; INV-2/3/4/11 | INV-T-2 PASS | EXISTS |
| FAB-FED | Federation | Ed25519 signed cross-instance assertions; fail-closed | IDENT, TRUST, AUTH, EVT, AUDIT | RC-007/035 | FT-7 PASS | EXISTS |
| FAB-KNOW | Knowledge | Versioned governed knowledge | EVO, REG, META, GOV | RC-008 (PI-7) | governed read | EXISTS |
| FAB-ONTO | Ontology | Shared typing substrate; entity model | REG, META, EVO, GOV | RC-010/022 (PI-8) | type validation | EXISTS |
| FAB-MEM | Memory | Tiered governed memory | EVO, REG, META, GOV, AUDIT | RC-009 (PI-9) | tiered recall | EXISTS |
| FAB-OPS | Ops / Platform-Engineering | Tech-neutral operability ports | EXEC, EVT, all substrate | RC-015/042 | ports resolve | EXISTS (single-node) |

### 1.3 Runtime component classes (`UCOS-IR-0005`; `UCOS-S0-0004`)

| Class | Members | Count | Authority source | State |
|-------|---------|:-----:|------------------|:-----:|
| Engines (kernel services) | E1 Execution · E2 Policy Evaluator · E3 Evolution · E4 Trust · E5 Federation Verifier · E6 Audit Hash-Chain · E7 Lifecycle | 7 | `UCOS-IR-0005 §2` | EXISTS (M2/M3/C1 caveats) |
| Registry services | R1 RegistryPort · R2 MetadataPort · R3 ConfigurationPort · R4 Identity · R5 Policy · R6 AUTH-012 Ledger · R7 Event Catalog | 7 | `UCOS-IR-0005 §3` | EXISTS (R6 attestation pending) |
| Datastore roles | D1 SoR · D2 Append-only Audit · D3 Registry/Metadata/Config · D4 Federated Audit | 4 | `UCOS-IR-0005 §4` | EXISTS (single-node adapters) |
| Governance components | Evolution gate · Audit chain · Lifecycle · QUAL/SEC/DOC/REL gates · Approval-By-Exception | 5 | `UCOS-IR-0005 §5` | EXISTS |
| Validators (fail-closed) | V1 Contract · V2 AuthN/Z · V3 Secrets · V4 Data-protection · V5 Commit-path · V6 Append-only · V7 Determinism · V8 Audit-continuity · V9 Core-dir | 9 | `UCOS-S0-0004 §4` | EXISTS |
| Boot steps | B0 Genesis → B7 Ready (security-first, Evolution-only, fail-closed) | 8 | `UCOS-S0-0004 §5` | EXISTS |

> **T1-0001 result.** **12 FOUNDATIONAL + 7 CORE fabrics** (existence floor, fully realized: 15 EXISTS + 4
> PARTIAL) plus **7 engines / 7 registries / 4 datastores / 5 governance components / 9 validators / 8 boot
> steps** are registered with purpose, dependencies, I/O, authority source, and acceptance criteria. No
> component is missing; no component invented. The four PARTIAL FOUNDATIONAL fabrics (AUTH/POL/STATE/AUDIT)
> carry convergence/attestation debt (GAP-M1/M2/M3/C1) — hardening targets, not absences.

---

# PHASE 2 — IMPLEMENTATION BACKLOG

## T1-0002 — FOUNDATION IMPLEMENTATION BACKLOG

Complete backlog by requested class. Each item maps to a corpus authority; each is **additive** and **gated on
G0 = PASS**. `Type`: **RE-ASSERT** (formalize realized-of-record), **ADDITIVE** (new additive build post-G0),
**HARDEN** (convergence of a PARTIAL fabric), **POPULATE** (seed data), **ACTIVATE** (contract activation).

| # | Class | Work item | Realizes | Type | Gate | State |
|:-:|-------|-----------|----------|:----:|:----:|:-----:|
| WI-01 | Registries | RegistryPort register/resolve/version surface | FAB-REG; `API-027` | RE-ASSERT | G0 | EXISTS |
| WI-02 | Registries | MetadataPort open-class describe surface | FAB-META; `API-018` | RE-ASSERT | G0 | EXISTS |
| WI-03 | Registries | ConfigurationPort hierarchical resolution | FAB-CFG; IP-04 | RE-ASSERT | G0 | EXISTS |
| WI-04 | Registries | Identity / Policy / Event Catalog / AUTH-012 ledger surfaces | R4/R5/R7/R6 | RE-ASSERT | G0 | EXISTS |
| WI-05 | Schemas | 85 ratified contract schemas (versioned, tolerant-reader) | F-8; INV-1 | ACTIVATE | G0 | SPEC (`UCOS-S0-0005`) |
| WI-06 | Schemas | Registry/metadata/config/identity/policy record shapes | `UCOS-S0-0003 §2` | ACTIVATE | G0 | SPEC |
| WI-07 | Database Models | 10 governed record families (construct/metadata/config/identity/policy/authority_decision/audit_entry/event/lifecycle/federation) | `UCOS-S0-0003 §2` | ADDITIVE | G0 | SPEC |
| WI-08 | Migrations | Forward-only migrations M0..M10 (genesis → federation) | `UCOS-S0-0003 §3`; INV-10; N-3 | ADDITIVE | G0 | SPEC |
| WI-09 | Runtime Services | Meta-Core execution engine (E1) | RC-045/038; INV-CORE-09 | RE-ASSERT | G0 | EXISTS |
| WI-10 | Runtime Services | Event propagation service (E-EVT) | RC-028; INV-6 | RE-ASSERT | G0 | EXISTS |
| WI-11 | Authority Services | Authority Hierarchy + AUTH-012 ledger (append-only, Board-terminal) | RC-002/033; A-1..A-9 | HARDEN | G0 | PARTIAL (GAP-M1) |
| WI-12 | Governance Services | Gates QUAL/SEC/DOC/REL; Approval-By-Exception; Evolution commit (E3) | RC-004/013; INV-10 | RE-ASSERT | G0 | EXISTS |
| WI-13 | Identity Services | Identity registry (open `kind`); authz precondition (S1) | RC-005/023; INV-2 | RE-ASSERT | G0 | EXISTS |
| WI-14 | Configuration Services | Behavior-as-data resolution; ADR-neutral binding; secrets-by-reference | IP-04; CF-1..CF-6; INV-11 | RE-ASSERT | G0 | EXISTS |
| WI-15 | Execution Services | Policy evaluation (E2, deny-by-default); Trust (E4); determinism quarantine (V7) | RC-060/006; INV-3; N-8 | HARDEN | G0 | PARTIAL (GAP-M3) |
| WI-16 | Knowledge Services | Versioned governed knowledge fabric | RC-008 (PI-7) | RE-ASSERT | G0 | EXISTS |
| WI-17 | Memory Services | Tiered governed memory fabric | RC-009 (PI-9) | RE-ASSERT | G0 | EXISTS |
| WI-18 | Observability Services | Health surfaces (live/ready/invariants/audit-chain); PE-12 product ADR | `UCOS-S0-0005 §5`; RC-015 | ADDITIVE | G0 | PARTIAL (PE-12 undecided) |
| WI-19 | API Services | Internal / Registry / Authority / Config / Health contract families | `UCOS-S0-0005 §1-5` | ACTIVATE | G0 | SPEC |
| WI-20 | Infrastructure Services | Tech-neutral infra descriptors within ADR-001..007; durable/distributed adapters | RC-042; CF-2; `UCOS-PLAT-ADR-*` | ADDITIVE | G0 (+Stage-13 scale) | SPEC / single-node |
| WI-21 | Audit / Provenance | Append-only hash-chained log (E6); offline verify; audit-continuity (V8) | RC-037; S6; INV-10 | HARDEN | G0 | PARTIAL (GAP-C1) |
| WI-22 | State / Lifecycle | Lifecycle engine (E7); version/history projection | RC-027; INV-10 | HARDEN | G0 | PARTIAL (GAP-M2) |
| WI-23 | Federation | Ed25519 verifier (E5); local sovereignty; clamped trust; namespace isolation | RC-007/035; INV-1 | RE-ASSERT | G0 | EXISTS |
| WI-24 | Seed data | Registry population from frozen seed (INV-1..13, AUTH-001..012, CAP-01..19/CAP-IR-001..067, 25 fabrics, event catalog) | `UCOS-S0-0002 §4` | POPULATE | G0 | SPEC |

> **T1-0002 result.** **24 work items** across all 16 requested classes (registries, schemas, database models,
> migrations, runtime/authority/governance/identity/configuration/execution/knowledge/memory/observability/API/
> infrastructure services, plus audit/state/federation/seed). Every item traces to a frozen authority; **16 are
> RE-ASSERT of realized-of-record**, 4 HARDEN the PARTIAL FOUNDATIONAL fabrics, and the remainder are ADDITIVE/
> ACTIVATE/POPULATE steps. **Zero introduce a new requirement, RC class, invariant, governance construct, or
> authority.** All are gated on G0 = PASS.

---

# PHASE 3 — REPOSITORY REALIZATION MAP

## T1-0003 — REPOSITORY REALIZATION MAP

Maps each foundation component to its directory / module / package / service / migration / registry / API /
test suite. The layout is the target-of-record (`UCOS-S0-0001`); realized modules exist under
`packages/platform-runtime/src`. The **5 prohibited substrate core dirs** are additive-only (never modified).

| Component | Directory (of record) | Realized module | Package | Migration | Registry | API family | Test suite |
|-----------|----------------------|-----------------|---------|:---------:|----------|-----------|-----------|
| FAB-EXEC | `src/meta-core/` **[CORE]** | `meta-core/` | `@ucos/platform-runtime` | — | R1 | `int.execute`/`int.compose` | FT-4 · INV-T-5 |
| FAB-REG | `src/registry-runtime/` **[CORE]** | `registry-runtime/` | `@ucos/platform-runtime` | M1 | R1 RegistryPort | `reg.register`/`reg.resolve` | FT-1 · RT-1 |
| FAB-META | `src/metadata-runtime/` **[CORE]** | `metadata-runtime/` | `@ucos/platform-runtime` | M2 | R2 MetadataPort | `reg.describe` | FT-2 · RT-1 |
| FAB-CFG | `src/configuration-runtime/` **[CORE]** | `configuration-runtime/` | `@ucos/platform-runtime` | M3 | R3 ConfigurationPort | `cfg.resolve`/`cfg.set` | FT-3 |
| Contracts | `src/contracts/` **[CORE]** | `contracts/` + `packages/contracts-sdk` | `@ucos/contracts-sdk` | — | — | 85 ratified | CG-1..CG-5 |
| FAB-IDENT | `src/control/identity/` | `control/` (identity) | `@ucos/platform-runtime` | M4 | R4 Identity | (authz precondition) | INV-T-2 |
| FAB-TRUST | `src/control/trust/` | `control/` (trust) | `@ucos/platform-runtime` | — | — | `int.evaluate-trust` | (trust clamp) |
| FAB-POL | `src/control/policy/` | `control/` (policy) | `@ucos/platform-runtime` | M6 | R5 Policy | `int.evaluate-policy` | INV-T-3 |
| FAB-AUTH | `src/control/authority/` | `control/` (authority) | `@ucos/platform-runtime` | M5 | R6 AUTH-012 Ledger | `auth.*` (Board-terminal) | RT-4 · IT-2 |
| FAB-GOV | `src/control/governance/` | `control/` (governance) + `control-plane` | `@ucos/platform-runtime` | — | — | `auth.submit-for-decision` | (gate outcomes) |
| FAB-EVO | `src/control/evolution/` | `control/` (evolution) | `@ucos/platform-runtime` | (all writes) | — | `int.commit` (sole path) | FT-5 · IT-4 |
| FAB-EVT | `src/control/event/` | `control/` (event) | `@ucos/platform-runtime` | M8 | R7 Event Catalog | `reg.emit-event`/`reg.subscribe` | FT-6 |
| FAB-STATE | `src/control/state/` | `control/` (lifecycle) | `@ucos/platform-runtime` | M9 | — | (lifecycle) | IT-5 |
| FAB-AUDIT | `src/control/audit/` | `control/audit-log` | `@ucos/platform-runtime` | M7 | D2 | `health.audit-chain` | IT-2 · IT-3 |
| FAB-SEC | `src/control/security/` | `control/` (security) | `@ucos/platform-runtime` | — | — | (boundary enforce) | INV-T-2 |
| FAB-FED | `src/control/federation/` | `control/federation/` | `@ucos/platform-runtime` | M10 | D4 | (assertion verify) | FT-7 |
| FAB-KNOW | `src/control/knowledge/` | `control/` (knowledge) | `@ucos/platform-runtime` | — | R1 view | `reg.*` (knowledge) | (governed read) |
| FAB-ONTO | `src/control/ontology/` | `control/` (ontology) | `@ucos/platform-runtime` | — | R2 view | (type validation) | ONTO suite |
| FAB-MEM | `src/control/memory/` | `control/` (memory) | `@ucos/platform-runtime` | — | R1/R2 view | (tiered recall) | MEM suite |
| FAB-OPS | `src/control/ops/` · `infra/` | ops ports + `infra/` descriptors | `@ucos/platform-runtime` | — | — | `health.*` | (ports resolve) |
| Boot | `apps/` · `src/bootstrap.ts` | `bootstrap.ts` · `index.ts` | `@ucos/platform-runtime` | M0 genesis | — | `health.ready` | BT-1..BT-5 |
| Seed / config / registries | `config/` · `registries/` · `migrations/` | (records) | — | M0..M10 | all | `cfg.*` | RT-2 |

> **T1-0003 result.** Every foundation component is mapped to its directory/module/package/migration/registry/
> API/test suite. The **five prohibited substrate core dirs** (`meta-core`, `registry-runtime`,
> `metadata-runtime`, `configuration-runtime`, `contracts`) are marked **[CORE]** and are **additive-only** —
> never modified by any build (F-10; N-6; V9). The realized modules exist under `packages/platform-runtime/src`
> (`meta-core`, `registry-runtime`, `metadata-runtime`, `configuration-runtime`, `contracts`, `control/*`,
> `bootstrap.ts`, `index.ts`); `config/`, `registries/`, `migrations/`, `infra/` are additive record/descriptor
> locations realized post-G0.

---

# PHASE 4 — BUILD ORDER

## T1-0004 — FOUNDATION BUILD ORDER

Deterministic order derived from the fabric DAG (`UCOS-IR-0004 §6`) and Stage sequence (`UCOS-IR-0006`); **0
forward dependencies** (`UCOS-IR-0006 §3`). Task 0 = **Gate Zero** (no build, mandatory predecessor); Tasks
1–5 are the additive foundation build, all gated on G0 = PASS (`UCOS-S0-0007 §1`).

### 4.1 Critical path

```
TASK 0 ── GATE 0 (G0) [NO BUILD; MANDATORY PREDECESSOR]
   W1: T0.1 REAL-C-05 independent attestation  ∥  T0.2 REAL-M-03 independent re-measurement (269/269)
   W2: T0.3 REAL-C-01 → UCOM-ULTIMATE-CERT-002 re-issued
   W3: T0.4 Authority-Board A-1 act → lift UCOS-CONSTRUCTION-BLOCKED + Article IX release  ⇒ G0 = PASS
   │
   ▼ (nothing below authorized until G0 = PASS)
TASK 1  Authorize realized MCR to operate                (WI-01..04, 09..17, 21..23)  [Gate 1]
TASK 2  Populate registries from frozen seed             (WI-24)                        [additive]
TASK 3  Realize datastores; run migrations M0..M10       (WI-07, WI-08)                 [additive]
TASK 4  Activate API contracts (S1/S3/S4 armed)          (WI-05, WI-06, WI-19)          [contract-first]
TASK 5  Execute acceptance suite + independent reproduce  (30 assertions)               [fail-closed]
```

### 4.2 Build sequence within the realized substrate (DAG tiers — `UCOS-IR-0004 §6`)

| Order | Tier | Components | Depends on | Parallelizable |
|:-----:|------|-----------|:----------:|:--------------:|
| 1 | Substrate | REG → META → CFG → EXEC → EVT | genesis roots (B0/M0) | REG first; META/CFG/EXEC/EVT serial |
| 2 | Control | IDENT → TRUST → POL ; SEC | Tier 1 | POL after TRUST; SEC parallel to POL |
| 3 | Governance core | AUTH ↔ EVO ↔ AUDIT ↔ GOV ↔ STATE | Tier 2 (+genesis CYC-1/2/3) | serialized on Evolution genesis |
| 4 | Federation | FED | Tiers 2,3 | independent |
| 5 | Core data | KNOW ; ONTO ; MEM ; OPS | Tier 3 | all four parallel |

### 4.3 Blocking dependencies · stage gates · acceptance gates

| Gate | Type | Condition | Blocks |
|------|:----:|-----------|--------|
| **G0** | Stage gate | `AT-P0-1 ∧ AT-P0-2 ∧ AT-P1-7 ∧ AT-P0-3 = PASS` (`UCOS-G0-0006`) | **ALL Tasks 1–5** |
| Genesis | Blocking dep | B0/M0 genesis seed resolves CYC-1/2/3 | Tiers 1–5 |
| Security-first | Blocking dep | V2/V3/V4 armed at B2 before any boundary exposed (N-2) | Task 4 activation |
| Evolution-only | Blocking dep | E3 is sole durable-write route from B3 (N-5) | Tasks 2,3 writes |
| Gate 1 (Foundation) | Stage gate | T1–T5 accepted; 30/30 assertions PASS + independent reproduction | Forward waves (Gate 1→N) |
| Acceptance | Acceptance gate | each task's binary criterion TRUE, fail-closed (`UCOS-EXEC-0001 §V.1`) | task acceptance |

### 4.4 Parallel work

- **Within G0:** T0.1 (attestation) ∥ T0.2 (re-measurement) run concurrently; T0.3 depends on both; T0.4 depends on T0.1–T0.3.
- **Post-G0 build:** Tier-5 core-data fabrics (KNOW/ONTO/MEM/OPS) build in parallel; convergence hardening (WI-11/15/21/22, Stage 6) may proceed concurrently once its inbound fabrics operate.

> **T1-0004 result.** Deterministic build order established: **Task 0 = Gate Zero (W1→W2→W3, no build)** → **5
> additive foundation tasks** over a 5-tier substrate DAG with **0 forward dependencies**. Critical path,
> parallelism, blocking dependencies, stage gates, and acceptance gates are specified. The single pivot gating
> all construction is **T0.4 (Board A-1 lift ⇒ G0 = PASS)**.

---

# PHASE 5 — IMPLEMENTATION CONTRACTS

## T1-0005 — IMPLEMENTATION CONTRACTS

Contract per foundation component: Inputs · Outputs · Events · State · Authority · Validation rules · Acceptance
tests. Each realizes one of the **85 ratified contracts** (F-8); none is invented (CG-4). Universal boundary
rules BR-1..BR-7 (`UCOS-S0-0005 §0`) apply to every contract: contract-first (INV-1), non-waivable S1/S3/S4
(N-2), deny-by-default fail-closed (N-7), Evolution-only mutation (N-5), append-only (N-3), audit-emitting (S6),
secrets-by-reference (INV-11).

| Component | Inputs | Outputs | Events | State | Authority | Validation rules | Acceptance test |
|-----------|--------|---------|--------|-------|-----------|------------------|-----------------|
| FAB-REG `reg.register`/`reg.resolve` | `id@version`, construct | resolved construct | `construct.registered` | R1 (via E3) | RC-024/041; PEP-001 | UNIQUE(id,version); monotonic; write-via-Evolution | FT-1 · RT-1 |
| FAB-META `reg.describe` | `construct_id@version`, metadata | metadata record | `metadata.attached` | R2 | RC-024; PEP-002 | open-class; additive; FK→construct | FT-2 |
| FAB-CFG `cfg.resolve`/`cfg.set` | scope/key, value-ref | resolved value | `config.set` | R3 | IP-04; PEP-003; CF-1 | hierarchical; no secret literal; no code fork | FT-3 · IT-6 |
| FAB-EXEC `int.execute`/`int.compose` | capability graph, inputs | execution result | — | (stateless) | RC-045/038; INV-CORE-09 | deterministic; non-det quarantined (V7); acyclic (EX-4) | FT-4 · INV-T-5 |
| FAB-EVO `int.commit` | commit proposal | committed mutation | `mutation.committed` | all durable state | RC-013; INV-10; N-5 | **sole commit path**; append-only; authorized | FT-5 · IT-4 |
| FAB-EVT `reg.emit-event`/`reg.subscribe` | event, subscription | delivered event | (the event) | R7/D2 | RC-028; INV-6 | at-least-once; idempotency key; tolerant-reader | FT-6 |
| FAB-IDENT (authz precondition) | principal `kind`, attributes | identity resolution | `identity.registered` | R4 | RC-005/023; INV-2 | open `kind`; S1 precondition; deny-by-default | INV-T-2 |
| FAB-TRUST `int.evaluate-trust` | principal, attributes | trust level (clamped) | — | (derived) | RC-006 | clamp to boundary ceiling; max-wins federated | (trust clamp) |
| FAB-POL `int.evaluate-policy` | request, `policy:*` | allow/deny | `policy.evaluated` | R5 | RC-060/014; INV-3 | deny-by-default; deny-overrides-allow; fail-closed | INV-T-3 · INV-T-4 |
| FAB-AUTH `auth.*` | decision submission | ledger entry | `decision.recorded` | R6/D2 | RC-002/033; A-1..A-9 | append-only; **Board-terminal writes (A-9)**; hash-chained | RT-4 · IT-2 |
| FAB-GOV `auth.submit-for-decision` | change request | gate outcome | `gate.evaluated` | (via E3) | RC-004; `AD-0009` | QUAL/SEC/DOC/REL; Approval-By-Exception | (gate recorded) |
| FAB-STATE (lifecycle) | lifecycle event | state transition | `lifecycle.transitioned` | R1+D3 | RC-027; INV-10 | append-only transitions; history retained | IT-5 |
| FAB-AUDIT `health.audit-chain` | audit event | hash-chained entry | (entry) | D2 | RC-037; S6; INV-10 | `prev_hash` continuity; offline-verifiable; append-only | IT-2 · IT-3 |
| FAB-SEC (boundary) | boundary call | allow/deny + protection | `security.enforced` | (policy) | RC-014; INV-2/3/4/11 | non-waivable S1/S3/S4/S6 every boundary/env | INV-T-2 |
| FAB-FED (assertion verify) | Ed25519 assertion | verified/denied | `federation.asserted` | D4 | RC-007/035; INV-1 | signature verify; nonce+freshness; fail-closed; namespace-isolated | FT-7 |
| Health `health.live/ready/invariants` | — | posture | — | (read-only) | `UCOS-S0-0005 §5` | ready iff B7 + V1..V9 armed; no secret disclosure | BT-5 |

> **T1-0005 result.** Implementation contracts specified for every foundation component with Inputs/Outputs/
> Events/State/Authority/Validation-rules/Acceptance-tests, each realizing one of the 85 ratified contracts
> under BR-1..BR-7. **No new contract class is invented; no API is implemented.** Board-terminal authority acts
> (`auth.record-board-act`, A-1/A-2) are specified as **reserved** — invokable only by the Authority Board
> (human-executed), never by an agent (`UCOS-S0-0005 §3`; `UCOS-EP-0008`).

---

# 6. EXECUTION AUTHORIZATION

## 6.1 Determination

> ## T1 IMPLEMENTATION ASSETS: READY (specification-complete)
> ## CONSTRUCTION EXECUTION: NOT READY — GATED ON G0 = PASS

The T1 implementation-authority asset set — **T1-0001** (component register), **T1-0002** (implementation
backlog, 24 work items across all 16 classes), **T1-0003** (repository realization map), **T1-0004** (build
order), **T1-0005** (implementation contracts) — is **complete and internally consistent**, grounded entirely
in the frozen Baseline 1.0 corpus, with **0 redesign, 0 requirement/RC/invariant/governance/authority
creation, 0 architecture expansion**. In that sense T1 is **implementation-ready**.

**Construction execution is NOT READY.** Per the frozen corpus, actual build/execution of any work item is
gated on **G0 = PASS**, and **G0 = FAIL (0/14 atomic evidence)** (`UCOS-G0-0006`; `UCOS-S0-0007 §5`):

| Gate element | Requirement | Owner | Status |
|--------------|-------------|-------|:------:|
| AT-P0-1 | Independent attestation `REAL-C-05` (authority chain + PI-8/PI-9) | Independent adjudicator | **FAIL** |
| AT-P0-2 | Independent re-measurement `REAL-M-03` (269/269 reproduced) | Independent re-measurer | **FAIL** |
| AT-P1-7 | Terminal cert re-issued `UCOM-ULTIMATE-CERT-002` | Certification authority | **FAIL** |
| AT-P0-3 | Board A-1 act lifting `UCOS-CONSTRUCTION-BLOCKED` + Article IX release | **UCOS Authority Board (human)** | **FAIL** |

Source-code authoring under the active Article IX lock is a prohibited activity (`UCOS-CONSTRUCTION-BLOCKED §3`;
`UCOS-EXEC-0001` Prohibition 1); the three evidentiary tasks (AT-P0-1/2, AT-P1-7) require **no software** and
are executable now by independent parties, and the pivot **AT-P0-3 is a reserved Authority-Board act** that no
agent may perform (`UCOS-EP-0008`; `UCOS-S0-0005 §3` terminal-authority rule). This determination therefore
**authorizes no construction and writes no code**; it hands the enumerated, execution-ready work packages to the
gate.

## 6.2 Executable work packages (enumerated; all gated on G0 = PASS)

| WP | Task | Backlog items | Class | Blocking gate |
|:--:|------|---------------|:-----:|:-------------:|
| **G0-W1** | `REAL-C-05` independent attestation | — | GATE (evidence) | — (executable now) |
| **G0-W1** | `REAL-M-03` independent re-measurement (269/269) | — | GATE (evidence) | — (executable now) |
| **G0-W2** | Re-issue `UCOM-ULTIMATE-CERT-002` (`REAL-C-01`) | — | GATE (cert) | G0-W1 |
| **G0-W3** | Board A-1 lift act (`AUTH-012`) ⇒ G0 = PASS | — | GATE (authority, human) | G0-W1/W2 |
| **WP-T1** | Authorize realized MCR to operate | WI-01..04, 09..17, 21..23 | BUILD-op | **G0 = PASS** |
| **WP-T2** | Populate registries from frozen seed | WI-24 | ADDITIVE | WP-T1 |
| **WP-T3** | Realize datastores; migrations M0..M10 | WI-07, WI-08 | ADDITIVE | WP-T1, WP-T2 |
| **WP-T4** | Activate API contracts (S1/S3/S4 armed) | WI-05, WI-06, WI-19 | CONTRACT-FIRST | WP-T1..T3 |
| **WP-T5** | Acceptance suite (30 assertions) + independent reproduction | all | VALIDATE | WP-T2..T4 |
| **WP-H (Stage 6, optional)** | Converge FAB-AUTH/AUDIT/STATE; harden FAB-POL vocabulary | WI-11, WI-15, WI-21, WI-22 | HARDEN | WP-T1 |
| **WP-INFRA (Stage 13)** | Durable/distributed adapters; PE-12 observability ADR | WI-18, WI-20 | ADDITIVE | WP-T1 (+scale) |

## 6.3 Scope discipline

No source code, schema, DDL, migration, API implementation, requirement, RC class, invariant, governance, or
authority was produced or modified. INV-1..13, `AUTH-012` (v1.0.13), `AD-0014`, and the Article IX generation
lock are unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands**. This package generated **implementation-authority
specifications only** — the "implementation-ready assets" of the Stage-0 discipline — consistent with
`UCOS-S0-0001..0007` and `UCOS-IR-0008` (Implementation Readiness: **PARTIAL — realizable, governance-gated**).

---

## Validation (self-check)

| Check | Target | Observed | Result |
|-------|:------:|:--------:|:------:|
| T1-0001 component register (per-component: purpose/deps/inputs/outputs/authority/acceptance) | complete | 12 FOUNDATIONAL + 7 CORE + runtime classes | ✅ |
| T1-0002 backlog covers all 16 requested classes | 16 | 16 (24 work items) | ✅ |
| T1-0003 realization map (dir/module/package/migration/registry/API/test) | complete | all components mapped | ✅ |
| T1-0004 build order (critical path/parallel/blocking/stage gates/acceptance) | complete | Task 0 + 5 tasks; 0 fwd dep | ✅ |
| T1-0005 implementation contracts (inputs/outputs/events/state/authority/validation/acceptance) | complete | per component; 85-contract mapped | ✅ |
| Phase 6 determination issued | 1 | READY (assets) / NOT READY (construction, G0=FAIL) | ✅ |
| New requirement / RC / invariant / governance / authority created | 0 | 0 | ✅ |
| Source code / schema / API implemented | 0 | 0 | ✅ |
| Frozen / prohibited-core elements modified | 0 | 0 | ✅ |

## Traceability

- **Consumes:** `UCOS-BL-1.0` (Baseline 1.0 freeze; T1 tier); `UCOS-S0-0001..0007` (repo/registry/database/
  runtime/API/acceptance/build-plan); `UCOS-EP-0001..0008` (WBS/backlog/waves/dependency/governance/gates/
  critical-path/authority); `UCOS-EXEC-0001` (Commandments/Prohibitions, F-1..F-10, N-1..N-8, A-1..A-9,
  Part IV/V); `UCOS-IR-0003..0008` (fabrics/dependency-graph/runtime/sequencing/readiness); `AUTH-001..012`;
  `UCOS-ASR-NFR-001` (INV-1..13); `UCOS-G0-0006` (G0=FAIL); realized `packages/platform-runtime`.
- **Refined by:** the Gate-Zero evidentiary tasks (`REAL-C-05`, `REAL-M-03`, `REAL-C-01`) and the reserved
  Authority-Board A-1 lift act — the only instruments that flip G0 = PASS and unblock WP-T1..T5.
- **Owner:** UCOS Authority Board (authorization); UCOS Implementation Program (execution, post-G0).

**END `UCOS-T1-0001` — FOUNDATION IMPLEMENTATION AUTHORITY · T1-0001..T1-0005 SPECIFICATION-COMPLETE · 12 FOUNDATIONAL + 7 CORE FABRICS REGISTERED · 24-ITEM BACKLOG (16 CLASSES) · REALIZATION MAP · BUILD ORDER (0 FWD DEP) · IMPLEMENTATION CONTRACTS (85 RATIFIED) · ASSETS READY · CONSTRUCTION NOT READY (G0 = FAIL 0/14) · 0 REDESIGN · 0 CODE · PLANNING ONLY.**
