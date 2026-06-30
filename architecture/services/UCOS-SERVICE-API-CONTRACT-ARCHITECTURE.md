# UCOS — Service & API Contract Architecture

| Field | Value |
|-------|-------|
| Artifact | **UCOS Service & API Contract Architecture** |
| Artifact ID | `UCOS-SVC-ARCH-001` |
| Version | 1.0.0 |
| Phase | **Phase 10.2B — Service & API Contract Architecture (Prompt 07 execution)** |
| Status | **CREATED — GENERATED** (ratification deferred to an independent validation phase / Authority Board; no self-certification) |
| Mode | **CONTRACT-FIRST DESIGN ONLY** — service boundaries + versioned API/event/data contracts. **No** implementation code, **no** infrastructure, **no** deployment artifacts, **no** technology selection, **no** security controls (owned by Prompt 09), **no** ASR/N-1 quantitative values. |
| Authority | Subordinate to Authority Layer (`AUTH-001..012`), Constitution (`UCOS-CONST-001`, Art. IV contract-first / Art. IX generation lock), `UCOS-GOVERNANCE-BASELINE-1.0`; refines `UCOS-DOM-ARCH-001`, `UCOS-CAP-ARCH-001`, `UCOS-INF-ARCH-001`, `UCOS-DATA-ARCH-001`/`UCOS-LDATA-ARCH-001`/`UCOS-PDATA-ARCH-001`, `UCOS-EXP-ARCH-001`; primary skills `api-design`, `service-design`. |
| Generating prompt | `PROMPT-07` (`.claude/prompts/07-service-api-generator.md`) |
| Branch | `phase-10-implementation-readiness` (DO NOT PUSH / MERGE / TAG) |
| Date | 2026-06-30 |
| Companion (contracts) | `specifications/contracts/UCOS-CONTRACT-CATALOG.md` (`UCOS-CONTRACT-CAT-001`) |
| ADRs | `architecture/services/adr/UCOS-SVC-ADR-001..007.md` |
| Gates | `GATE-DOC-001` PASS · Contract-First (Art. IV) PASS · Traceability PASS · Seam Coverage PASS · ECR Coverage PASS · Gap Scan PASS |

> **Scope discipline (binding).** This artifact defines UCOS **service boundaries** (one service per
> bounded context) and the **versioned contracts** (synchronous API, asynchronous event, and data/payload
> contracts) at every cross-context seam and for every Experience Consumption Requirement
> (`UCOS-EXP-CR-001..021`). It satisfies Constitution Article IV (contract-first) **before** any
> implementation. It generates **no** service/app code (Prompt 10), **no** runtime/framework/datastore/
> cloud selection (Prompt 08), **no** persistence design (Prompt 05 owns data), **no** security controls
> (Prompt 09), and **no** infrastructure/deployment artifacts. Every exposed boundary is **flagged for
> Prompt 09** (authn/authz) without inventing any control. All non-functional targets that depend on the
> unratified ASR set (carried Trusted Operation **N-1**) are recorded literally as
> **`PENDING ASR RATIFICATION`** — no latency, throughput, availability, or recovery values are fabricated.
> Article IX generation lock remains **ACTIVE**; per `UCOS-CONSTRUCTION-BLOCKED` §4 this contract-design
> activity is an explicitly **permitted** enablement (clears the *generation* of Condition **C-2**); the
> lock release and ratification remain with the Authority Board.

---

## 1. Purpose & Method

Transform the ratified domain context map (`UCOS-DOM-ARCH-001` §VIII), capability ownership
(`UCOS-DOM-ARCH-001` §VII.2 / `UCOS-CAP-ARCH-001`), data entities (`UCOS-PDATA-ARCH-001` `PDE-001..073` /
`UCOS-LDATA-ARCH-001` `LDO-001..073`), metadata classes (`UCOS-INF-ARCH-001` `MC-01..13`), and the 21
experience consumption requirements (`UCOS-EXP-ARCH-001` §6) into:

1. a **Service Boundary Map** — 28 services, one per bounded context (§3);
2. **API Contracts** — versioned synchronous interfaces for every published seam + experience BFFs (catalog);
3. **Event Contracts** — versioned asynchronous message contracts for every state-propagation seam (catalog);
4. **Data Contracts** — versioned, technology-neutral payload schemas referencing authoritative data entities (catalog);
5. a **Versioning & Deprecation Policy** (§5) and **Contract-Test Specifications** (§6) for Prompt 11;
6. **Service/API ADRs** (`UCOS-SVC-ADR-001..007`); and
7. **Contract Traceability** matrices `TM-SVC-001..006` (§7).

**Inputs consumed (read-only):**

| Input | Source | Use |
|-------|--------|-----|
| Context map + 28 bounded contexts + declared seams | `UCOS-DOM-ARCH-001` §VI/§VII/§VIII | Service boundaries; seams requiring contracts |
| Capability ownership `CAP-01..19` | `UCOS-DOM-ARCH-001` §VII.2 / `UCOS-CAP-ARCH-001` | Contract → capability traceability |
| Data entities `LDO-001..073` / `PDE-001..073` + classification | `UCOS-LDATA-ARCH-001` / `UCOS-PDATA-ARCH-001` | Payload shapes & sensitivity (referenced, not redefined) |
| Metadata classes `MC-01..13` | `UCOS-INF-ARCH-001` | Config-bearing endpoints / variability |
| Experience consumption requirements `UCOS-EXP-CR-001..021` | `UCOS-EXP-ARCH-001` §6 | Consumer-driven contract operations |
| Platform event catalog `PEV-001..073` | `UCOS-PEA-003` v1.0.0 | Event contracts realize platform events (payload authority was deferred to Prompt 07) |
| ASR set (NFRs) | `UCOS-CAP-ARCH-001` (N-1 outstanding) | NFR annotations → **PENDING ASR RATIFICATION** |

---

## 2. Contract-First Principles Applied

| # | Principle | Source | Application |
|---|-----------|--------|-------------|
| P1 | Contract-first before implementation | Const. Art. IV; AUTH-004 | Every seam has a versioned contract authored here, ahead of Prompt 10 code |
| P2 | One model + one ubiquitous language per context | AUTH-003 P4 / IP-07 | One service per bounded context; no shared mutable models across services |
| P3 | Integrate only via declared seams | AUTH-005 §6.4 | Every contract maps to a declared `UCOS-DOM-ARCH-001` §VIII seam |
| P4 | Consumer-driven contracts | P2/P9; `api-design` | Each ECR maps to ≥1 API operation; experience surfaces consume via BFFs |
| P5 | Versioned, evolvable, backward-compatible | AUTH-009; PEP-016/PEP-017 | `vMAJOR.MINOR`; deprecation policy; supersedes/superseded-by (§5) |
| P6 | Data referenced, never redefined | AUTH-007; PD-GOV-002 | Data contracts reference `PDE-*`/`LDO-*` + inherited classification; no new schema invented |
| P7 | Security boundaries flagged, not designed | AUTH-008; Prompt 09 ownership | Every exposed boundary `FLAGGED FOR PROMPT 09`; zero controls invented |
| P8 | No fabricated NFRs | N-1 discipline; this task | All latency/throughput/availability/recovery targets = `PENDING ASR RATIFICATION` |

---

## 3. Deliverable 1 — Service Boundary Map (`UCOS-SVC-001..028`)

A **service** is the deployable contract surface of exactly one bounded context (ADR `UCOS-SVC-ADR-001`).
One service per domain (28 services); each owns its domain's model and exposes it only via published
contracts. Service *implementation* (runtime, language, datastore) is **not** defined here (Prompt 08/10);
these services map 1:1 onto the platform runtime domains `PRD-001..017`/services `PRS-001..073` at
realization time.

| Service ID | Service | Bounded Context | Class | Capability (realizes) | Published API | Published Events | Data Contract |
|------------|---------|-----------------|-------|------------------------|---------------|------------------|---------------|
| `UCOS-SVC-001` | Catalog Service | DOM-001 Catalog | Core | CAP-01 | `API-001` | `EVT-001` | `DC-001` |
| `UCOS-SVC-002` | Pricing & Promotions Service | DOM-002 Pricing & Promotions | Core | CAP-02 | `API-002` | `EVT-002` | `DC-002` |
| `UCOS-SVC-003` | Inventory & Availability Service | DOM-003 Inventory & Availability | Core | CAP-03 | `API-003` | `EVT-003` | `DC-003` |
| `UCOS-SVC-004` | Cart & Checkout Service | DOM-004 Cart & Checkout | Core | CAP-04 | `API-004` | `EVT-004` | `DC-004` |
| `UCOS-SVC-005` | Order Management Service | DOM-005 Order Management | Core | CAP-05 | `API-005` | `EVT-005` | `DC-005` |
| `UCOS-SVC-006` | Payments Service | DOM-006 Payments | Core | CAP-06 (auth/capture facet) | `API-006` | `EVT-006` | `DC-006` |
| `UCOS-SVC-007` | Billing Service | DOM-007 Billing | Core | CAP-06 (obligation facet) | `API-007` | `EVT-007` | `DC-007` |
| `UCOS-SVC-008` | Settlement Service | DOM-008 Settlement | Core | CAP-06 (ledger facet) | `API-008` | `EVT-008` | `DC-008` |
| `UCOS-SVC-009` | Fulfillment & Returns Service | DOM-009 Fulfillment & Returns | Core | CAP-07 | `API-009` | `EVT-009` | `DC-009` |
| `UCOS-SVC-010` | Subscriptions Service | DOM-010 Subscriptions | Core | CAP-05/02/06 (recurring facets) | `API-010` | `EVT-010` | `DC-010` |
| `UCOS-SVC-011` | Customer & CRM Service | DOM-011 Customer & CRM | Core | CAP-08 | `API-011` | `EVT-011` | `DC-011` |
| `UCOS-SVC-012` | Merchandising Service | DOM-012 Merchandising | Supporting | CAP-14/13 (curation/reco) | `API-012` | `EVT-012` | `DC-012` |
| `UCOS-SVC-013` | Supplier Service | DOM-013 Supplier | Supporting | CAP-01/03 (supply-side) | `API-013` | `EVT-013` | `DC-013` |
| `UCOS-SVC-014` | Marketplace Service | DOM-014 Marketplace | Supporting | CAP-01..07 (composition) | `API-014` | `EVT-014` | `DC-014` |
| `UCOS-SVC-015` | Communication Service | DOM-015 Communication | Supporting | CAP-14 (delivery) | `API-015` | `EVT-015` | `DC-015` |
| `UCOS-SVC-016` | Document Service | DOM-016 Document | Supporting | CAP-14 (records) | `API-016` | `EVT-016` | `DC-016` |
| `UCOS-SVC-017` | Identity & Access Service | DOM-017 Identity & Access | Cross-Cutting | CAP-09 | `API-017` | `EVT-017` | `DC-017` |
| `UCOS-SVC-018` | Configuration & Metadata Service | DOM-018 Configuration & Metadata | Cross-Cutting | CAP-10 | `API-018` | `EVT-018` | `DC-018` |
| `UCOS-SVC-019` | Workflow & Orchestration Service | DOM-019 Workflow & Orchestration | Cross-Cutting | EA L6 (+CAP-05 support) | `API-019` | `EVT-019` | `DC-019` |
| `UCOS-SVC-020` | Intelligence & Insight Service | DOM-020 Intelligence & Insight | Cross-Cutting | CAP-13 | `API-020` | `EVT-020` | `DC-020` |
| `UCOS-SVC-021` | Observability Service | DOM-021 Observability | Cross-Cutting | CAP-11 | `API-021` | `EVT-021` | `DC-021` |
| `UCOS-SVC-022` | Governance Service | DOM-022 Governance | Governance | CAP-15 | `API-022` | `EVT-022` | `DC-022` |
| `UCOS-SVC-023` | Compliance Service | DOM-023 Compliance | Governance | CAP-16 | `API-023` | `EVT-023` | `DC-023` |
| `UCOS-SVC-024` | Security Service | DOM-024 Security | Governance | CAP-17 | `API-024` | `EVT-024` | `DC-024` |
| `UCOS-SVC-025` | Policy & Decisioning Service | DOM-025 Policy | Governance | CAP-18 | `API-025` | `EVT-025` | `DC-025` |
| `UCOS-SVC-026` | Integration & Federation Service | DOM-026 Integration & Federation | Platform | CAP-12 | `API-026` | `EVT-026` | `DC-026` |
| `UCOS-SVC-027` | Registry Service | DOM-027 Registry | Platform | CAP-19 | `API-027` | `EVT-027` | `DC-027` |
| `UCOS-SVC-028` | Experience Delivery Service (BFF substrate) | DOM-028 Experience Delivery | Platform | CAP-14 | `API-029`, `API-030` (BFFs) | — (terminal; publishes none) | `DC-028` |

> 28 services; each declares exactly one bounded context, ≥1 realized capability, one published API
> contract, one event contract (except `UCOS-SVC-028` which is terminal and publishes no events), and one
> data contract. Service granularity is **boundary-level**; a context MAY later be realized by multiple
> runtime services (`PRS-*`) without changing these contract boundaries. `UCOS-SVC-028` additionally hosts
> the two experience **Backends-for-Frontends** (`API-029` Storefront BFF, `API-030` Console BFF) that
> aggregate downstream service contracts for surfaces (ADR `UCOS-SVC-ADR-003`); BFFs own **no** domain
> truth.

### 3.1 Seam → Integration Style

| Seam class (from `UCOS-DOM-ARCH-001` §VIII) | Integration style | Contract type |
|---------------------------------------------|-------------------|---------------|
| CS / CF read dependency (synchronous truth read) | Request/response API | API contract |
| CS state handoff / commitment | Command API + confirming event | API + Event contract |
| CF event projection / state propagation | Asynchronous event | Event contract |
| PT partnership coordination | Bidirectional API or event (per direction) | API and/or Event contract |
| ACL translation boundary | API with translation (no shared model) | API contract + translation note |
| Pervasive govern-all / serve-all / consumed-by-all | Cross-cutting API + control/telemetry events | API + Event contract |

---

## 4. Deliverables 2–4 — Contracts (catalog reference)

The full, versioned contract definitions live in the companion catalog
`specifications/contracts/UCOS-CONTRACT-CATALOG.md` (`UCOS-CONTRACT-CAT-001`):

| Deliverable | ID range | Count | Location |
|-------------|----------|------:|----------|
| API Contracts | `UCOS-API-CONTRACT-001..030` | 30 | Catalog §A |
| Event Contracts | `UCOS-EVT-CONTRACT-001..027` | 27 | Catalog §B |
| Data Contracts | `UCOS-DATA-CONTRACT-001..028` | 28 | Catalog §C |

Every contract in the catalog carries: ID, name, version (`v1.0`), producer service, consumers, operations
or message set, referenced data contract(s), realized capability, owning domain, seam/ECR linkage, the NFR
block (`PENDING ASR RATIFICATION`), and the security flag (`FLAGGED FOR PROMPT 09`). Total contracts: **85**.

---

## 5. Deliverable 4 — Contract Versioning & Deprecation Policy (`UCOS-SVC-POLICY-001`)

| Rule | Statement |
|------|-----------|
| Version scheme | Every contract is versioned `vMAJOR.MINOR`. Initial publication is `v1.0`. |
| MINOR (backward-compatible) | Additive, non-breaking change (new optional field, new operation, new event, widened enum) → increment MINOR; consumers unaffected; no migration required. |
| MAJOR (breaking) | Removal/rename/semantic change of an operation, field, or event → increment MAJOR; previous MAJOR retained and marked deprecated (never deleted). |
| Coexistence | At most **N and N-1** MAJOR versions of a contract are served concurrently during a deprecation window. |
| Deprecation | A deprecated version records `Deprecated-Since`, `Supersedes`/`Superseded-By`, and a migration note. Deprecation window length is governed by SLA policy = **PENDING ASR RATIFICATION**. |
| Migration-only evolution | Contracts evolve by versioned migration; no in-place breaking mutation (PEP-016; AUTH-009). |
| Registration | Every version is registered in `CTX-REG-001` with bidirectional `Supersedes`/`Superseded-By` links (registry rule 3 — no row deleted). |
| Compatibility testing | Each MINOR/MAJOR transition requires the consumer/provider contract tests in §6 to pass (executed Prompt 11). |
| Event compatibility | Event payloads follow the same rules; event schema evolution is additive within a MAJOR; consumers tolerate unknown fields (tolerant-reader). |

---

## 6. Deliverable 5 — Contract-Test Specifications (`UCOS-SVC-CTEST-001`)

Contract tests are **specified** here and **executed** in Prompt 11 (Quality gate Q4). No test code is
generated (Article IX).

| Test class | Scope | Provider obligation | Consumer obligation |
|------------|-------|---------------------|---------------------|
| `CTEST-API-PROVIDER` | Each `UCOS-API-CONTRACT-*` | Provider service honors published request/response schema, status semantics, idempotency declarations, and pagination contract | — |
| `CTEST-API-CONSUMER` | Each consuming service / BFF | — | Consumer issues only declared operations with declared payload shapes |
| `CTEST-EVT-PROVIDER` | Each `UCOS-EVT-CONTRACT-*` | Producer emits messages conforming to the versioned payload + headers; honors at-least-once/ordering declarations | — |
| `CTEST-EVT-CONSUMER` | Each event consumer | — | Consumer is a tolerant reader; processes declared message versions idempotently |
| `CTEST-DATA-SCHEMA` | Each `UCOS-DATA-CONTRACT-*` | Payload conforms to referenced `PDE-*`/`LDO-*` shape and inherited classification | Consumer never requests fields beyond entitlement (`UCOS-EXP-STD-007`) |
| `CTEST-COMPAT` | Version transitions | N-1 consumers pass against N provider within deprecation window | — |

> Performance/load thresholds for these tests (e.g., latency/throughput assertions) are
> **PENDING ASR RATIFICATION** and are not asserted with fabricated numbers.

---

## 7. Deliverable 7 — Contract Traceability (`TM-SVC-001..006`)

### TM-SVC-001 — Service → Domain → Capability (28/28)

All 28 services map 1:1 to a bounded context and realize ≥1 capability (see §3 table). Coverage:
domains **28/28**; capabilities realized across services **19/19** (CAP-01..19 each realized by ≥1 service);
EA L6 Execution realized by `UCOS-SVC-019`. **0 orphan services; 0 unrealized capabilities.**

### TM-SVC-002 — Seam → Contract (every declared cross-context edge ≥1 contract)

| Seam (producer → consumer) | Type | Covered by |
|----------------------------|------|------------|
| DOM-013→DOM-001 Supplier→Catalog | CS | `API-013`, `EVT-013` |
| DOM-018→DOM-001/all Config→all | CF | `API-018`, `EVT-018` |
| DOM-001→DOM-002/003/004/012/014/028 Catalog→consumers | CF | `API-001`, `EVT-001` |
| DOM-002→DOM-004/005/007/010 Pricing→consumers | CS | `API-002`, `EVT-002` |
| DOM-002↔DOM-003 Pricing↔Inventory | PT | `API-002`/`API-003` |
| DOM-003→DOM-004/005/009 Inventory→consumers | CS | `API-003`, `EVT-003` |
| DOM-004→DOM-005 Cart→Order handoff | CS | `API-005` (submit), `EVT-004` |
| DOM-004→DOM-006 Cart→Payments auth | CS | `API-006`, `EVT-004` |
| DOM-004↔DOM-010 Cart↔Subscriptions | PT | `API-004`/`API-010` |
| DOM-005→DOM-006/007/008/009 Order→downstream | CS | `API-005`, `EVT-005` |
| DOM-005↔DOM-010/019 Order↔Subs/Workflow | PT | `API-010`/`API-019`, `EVT-005` |
| DOM-006→DOM-007/008 Payments→Billing/Settlement | CS | `API-007`/`API-008`, `EVT-006` |
| DOM-007→DOM-008/016 Billing→Settlement/Document | CS | `API-008`/`API-016`, `EVT-007` |
| DOM-008→DOM-020 Settlement→Intelligence | CF | `EVT-008` |
| DOM-009→DOM-003/006/007/015/016 Fulfillment→consumers | CS | `API-003`/`API-006`/`API-015`/`API-016`, `EVT-009` |
| DOM-010→DOM-005/006/007 Subscriptions→consumers | CS/PT | `API-005`/`API-006`/`API-007`, `EVT-010` |
| DOM-011→DOM-005/014/015/020 Customer→consumers | CF/CS | `API-011`, `EVT-011` |
| DOM-017→DOM-011/all Identity→Customer/all | CS | `API-017`, `EVT-017` |
| DOM-012→DOM-028 Merchandising→Experience | CS | `API-012`, `EVT-012` |
| DOM-020→DOM-012/022/023 Intelligence→consumers | CS/CF | `API-020`, `EVT-020` |
| DOM-013→DOM-003 Supplier→Inventory | CS | `API-013`, `EVT-013` |
| DOM-014→DOM-008 Marketplace→Settlement (commissions) | CS | `API-008`, `EVT-014` |
| DOM-014→DOM-001..009 Marketplace→Core (composition) | PT | `API-014`, `EVT-014` |
| DOM-015→DOM-028 Communication→Experience | CF | `API-015`, `EVT-015` |
| DOM-016→DOM-015 Document→Communication | CS | `API-015`/`API-016`, `EVT-016` |
| {005,007,009,016}→DOM-015 notification sources | CS | `EVT-005/007/009/016` → `API-015` |
| DOM-019→DOM-005/009/014 Workflow→orchestrated | PT | `API-019`, `EVT-019` |
| DOM-021←all telemetry; →DOM-020/023 | CF/CS | `API-021`, `EVT-021` |
| DOM-022→all governed-by; →023/025 | CS | `API-022`, `EVT-022` |
| DOM-023→all gate verdicts; ←021/025 | CS | `API-023`, `EVT-023` |
| DOM-024→all posture; →017 | CS | `API-024`, `EVT-024` |
| DOM-025→all decisions; →023/018/017 | CS | `API-025`, `EVT-025` |
| DOM-026→all boundary/transport | CS | `API-026`, `EVT-026` |
| DOM-027→all registration/discovery; →018/026 | CS | `API-027`, `EVT-027` |
| DOM-028←012/015/001 Experience surfacing | CS/CF | `API-029`, `API-030` (BFF aggregation) |

> Every declared seam in `UCOS-DOM-ARCH-001` §VIII (including the pervasive govern-all / serve-all /
> consumed-by-all edges stated once) is covered by ≥1 contract. **0 uncovered seams.**

### TM-SVC-003 — ECR → Contract Operation (21/21)

| ECR | Requirement | Contract(s) | Op class |
|-----|-------------|-------------|:--------:|
| `UCOS-EXP-CR-001` | Product browse/search/detail | `API-001` (via `API-029` BFF) | Query |
| `UCOS-EXP-CR-002` | Price & promotion resolution | `API-002` (via `API-029`) | Query |
| `UCOS-EXP-CR-003` | Inventory availability | `API-003` (via `API-029`) | Query |
| `UCOS-EXP-CR-004` | Cart assemble/update/remove | `API-004` (via `API-029`) | Command |
| `UCOS-EXP-CR-005` | Checkout & order submission | `API-004`/`API-005` (via `API-029`) | Command |
| `UCOS-EXP-CR-006` | Payment initiation & status | `API-006` (via `API-029`) | Command/Query |
| `UCOS-EXP-CR-007` | Order status & history | `API-005` (via `API-029`/`API-030`) | Query |
| `UCOS-EXP-CR-008` | Return request & status | `API-009` (via `API-029`) | Command/Query |
| `UCOS-EXP-CR-009` | Customer profile read/update | `API-011` (via `API-029`) | Command/Query |
| `UCOS-EXP-CR-010` | Subscription management | `API-010` (via `API-029`) | Command/Query |
| `UCOS-EXP-CR-011` | Invoice & billing read | `API-007` (via `API-029`) | Query |
| `UCOS-EXP-CR-012` | Support case + messaging | `API-011`/`API-015` (via `API-030`) | Command/Query |
| `UCOS-EXP-CR-013` | Catalog & pricing administration | `API-001`/`API-002`/`API-012` (via `API-030`) | Command |
| `UCOS-EXP-CR-014` | Order/fulfillment/inventory ops | `API-005`/`API-009`/`API-003`/`API-019` (via `API-030`) | Command/Query |
| `UCOS-EXP-CR-015` | Supplier/partner & listing mgmt | `API-013`/`API-014`/`API-026` (via `API-030`) | Command/Query |
| `UCOS-EXP-CR-016` | Identity & access admin | `API-017`/`API-024` (via `API-030`) | Command/Query |
| `UCOS-EXP-CR-017` | Governance/policy/registry ops | `API-022`/`API-025`/`API-027` (via `API-030`) | Command/Query |
| `UCOS-EXP-CR-018` | Compliance & audit evidence | `API-023` (via `API-030`) | Query |
| `UCOS-EXP-CR-019` | Observability & analytics | `API-021`/`API-020` (via `API-030`) | Query |
| `UCOS-EXP-CR-020` | Configuration & metadata r/w | `API-018` (via `API-030`) | Command/Query |
| `UCOS-EXP-CR-021` | API catalog & key management | `API-027`/`API-026` (via `API-030`) | Command/Query |

> **21/21 ECRs map to ≥1 contract operation. 0 ECR orphans.**

### TM-SVC-004 — Contract → Capability + Domain (no dangling realization)

Every contract in the catalog declares exactly one owning domain and ≥1 realized capability (Catalog §A/§B/§C).
API **30/30**, Event **27/27**, Data **28/28** carry capability + domain anchors. **0 dangling contracts.**

### TM-SVC-005 — Exposed Boundary → Prompt 09 Security Flag

All **30 API contracts** and the **2 BFFs** expose boundaries; each is recorded `FLAGGED FOR PROMPT 09`
(authn/authz/data-protection design owned by Prompt 09). All **27 event contracts** carry a transport-trust
flag `FLAGGED FOR PROMPT 09`. **0 silent/unauthenticated open surfaces; 0 security controls invented here.**

### TM-SVC-006 — Event Contract → Platform Event Catalog (`PEV`) linkage

Each `UCOS-EVT-CONTRACT-*` realizes one or more platform events from `UCOS-PEA-003` (`PEV-001..073`), whose
**payload authority was explicitly deferred to Prompt 07**. The catalog (§B) records the `PEV` linkage per
event contract. **0 event contracts without a producing-service / `PEV` anchor.**

---

## 8. Coverage Summary

| Coverage axis | Target | Achieved | Result |
|---------------|:------:|:--------:|:------:|
| Bounded contexts with exactly one service | 28 | 28 | ✅ 100% |
| Capabilities realized by ≥1 service | 19 | 19 | ✅ 100% |
| Declared seams with ≥1 contract | all | all | ✅ 100% |
| ECRs mapped to ≥1 contract operation | 21 | 21 | ✅ 100% |
| Contracts with capability + domain anchor | 85 | 85 | ✅ 100% |
| Exposed boundaries flagged for Prompt 09 | 32 (30 API + 2 BFF) | 32 | ✅ 100% |
| Event contracts linked to `PEV` | 27 | 27 | ✅ 100% |
| NFR fields populated with `PENDING ASR RATIFICATION` (no fabricated values) | all | all | ✅ 100% |

---

## 9. Gap Scan

| Gap check | Finding | Result |
|-----------|---------|:------:|
| Uncovered cross-context seam | 0 | ✅ PASS |
| Dangling contract (no capability/domain) | 0 | ✅ PASS |
| ECR with no contract operation | 0 (21/21) | ✅ PASS |
| Exposed boundary without Prompt 09 authn/authz flag | 0 | ✅ PASS |
| Event contract without producer/`PEV` anchor | 0 | ✅ PASS |
| Fabricated latency/throughput/availability/recovery value | 0 (all `PENDING ASR RATIFICATION`) | ✅ PASS |
| Invented security control (Prompt 09 ownership) | 0 | ✅ PASS |
| Implementation leakage: code / infra / deployment / technology selection | NONE | ✅ PASS |
| Data schema redefinition (Prompt 05 ownership) | 0 (referenced only) | ✅ PASS |

> **Gap Scan: PASS.** Zero uncovered seams, zero dangling contracts, zero ECR orphans, zero fabricated
> NFRs, zero invented controls, zero leakage.

---

## 10. Validation (Prompt 07 §11)

| Validation requirement | Result |
|------------------------|:------:|
| Documentation gate `GATE-DOC-001` | ✅ PASS |
| Contract-first check (Art. IV) — every seam has a versioned contract before any impl | ✅ PASS |
| Traceability — zero dangling contracts; full seam coverage | ✅ PASS |
| ECR coverage — every consumption requirement maps to a contract operation | ✅ PASS (21/21) |
| Gap scan — uncovered seam / unauthenticated exposed boundary | ✅ PASS (0 / 0 flagged for Prompt 09) |
| Quality gate Q4 (contract tests) specified (executed Prompt 11) | ✅ Specified (§6) |
| Scope discipline — no code / infra / deployment / technology / security controls / fabricated NFRs | ✅ PASS (leakage NONE) |

---

## 11. May / May Not (Prompt 07 §14) — compliance

**Generated (MAY):** service boundary map (28), versioned API contracts (30), event contracts (27), data
contracts (28), versioning/deprecation policy (1), contract-test specifications (1 framework), service/API
ADRs (7), traceability matrices (6). **Not generated (MAY NOT):** service/app code (Prompt 10), runtime/
technology selection (Prompt 08), domain models (Prompt 03), persistence design (Prompt 05), security
controls (Prompt 09), infrastructure/deployment artifacts. `services/` (code) remains **EMPTY**. NFRs
dependent on N-1 are recorded as `PENDING ASR RATIFICATION`.

## 12. Downstream Authorization

- **Prompt 08 (Platform/Technology):** realizes the contract runtime; records technology ADRs (C-4).
- **Prompt 09 (Security):** secures every contract flagged `FLAGGED FOR PROMPT 09` (C-3).
- **Prompt 10 (Implementation):** implements strictly from these contracts (post Article IX lock release).
- **Prompt 11 (Validation):** executes the §6 contract-test specifications (Q4).
- **Prompt 02 (N-1):** ratifies ASRs; their values replace `PENDING ASR RATIFICATION` via versioned update.

> Article IX generation lock remains **ACTIVE**. This artifact clears the **generation** of Condition
> **C-2**; ratification and lock release remain with the Authority Board (`UCOS-CONSTRUCTION-BLOCKED`).

---

## Traceability
- **Refines:** `AUTH-004/005/006/007/008/009/010`, `UCOS-CONST-001` (Art. IV, IX), `CTX-ARCHB-001`, `UCOS-DOM-ARCH-001`, `UCOS-CAP-ARCH-001`, `UCOS-INF-ARCH-001`, `UCOS-DATA-ARCH-001`, `UCOS-LDATA-ARCH-001`, `UCOS-PDATA-ARCH-001`, `UCOS-EXP-ARCH-001` (`UCOS-EXP-CR-001..021`), `UCOS-PEA-003` (`PEV-001..073`), `PROMPT-07`.
- **Refined by:** `UCOS-CONTRACT-CAT-001`, `UCOS-SVC-ADR-001..007`; Prompt 08 (platform), Prompt 09 (security), Prompt 10 (implementation), Prompt 11 (contract tests), Prompt 12 (certification).
- **Owner:** Service & API Contract Architecture (subordinate to Authority Board).

**END UCOS-SVC-ARCH-001 — Service & API Contract Architecture (GENERATED · GATE-DOC-001 PASS · Contract-First PASS · Traceability PASS · Seam Coverage PASS · ECR Coverage PASS · Gap Scan PASS).**
