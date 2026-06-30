# UCOS — Contract Catalog (API · Event · Data)

| Field | Value |
|-------|-------|
| Artifact | **UCOS Contract Catalog** |
| Artifact ID | `UCOS-CONTRACT-CAT-001` |
| Version | 1.0.0 |
| Phase | **Phase 10.2B — Service & API Contract Architecture (Prompt 07 execution)** |
| Status | **CREATED — GENERATED** (ratification deferred; no self-certification) |
| Parent | `UCOS-SVC-ARCH-001` (`architecture/services/UCOS-SERVICE-API-CONTRACT-ARCHITECTURE.md`) |
| Mode | **CONTRACT DEFINITIONS ONLY** — technology-neutral, versioned. No code, infra, deployment, technology, or security controls. NFRs = `PENDING ASR RATIFICATION`. Security = `FLAGGED FOR PROMPT 09`. |
| Branch | `phase-10-implementation-readiness` (DO NOT PUSH / MERGE / TAG) |
| Date | 2026-06-30 |
| Contents | §A API Contracts (`UCOS-API-CONTRACT-001..030`) · §B Event Contracts (`UCOS-EVT-CONTRACT-001..027`) · §C Data Contracts (`UCOS-DATA-CONTRACT-001..028`) |

> **Reading note.** Contracts are defined at the **boundary/architecture** level: operations and messages
> are enumerated with intent, payload reference (to a `UCOS-DATA-CONTRACT-*` which in turn references
> authoritative data entities `PDE-*`/`LDO-*`), capability + domain anchors, seam/ECR linkage, the NFR
> block, and the Prompt 09 security flag. **No endpoint hostnames, transport bindings, serialization
> formats, frameworks, or wire protocols are selected** (deferred to Prompt 08). REST-style verbs
> (GET/POST/PUT/PATCH/DELETE) denote operation *semantics* (safe/unsafe/idempotent), not a chosen protocol.
> Every NFR value is `PENDING ASR RATIFICATION` (N-1). Every exposed surface is `FLAGGED FOR PROMPT 09`.

---

## Conventions

- **Version:** all contracts `v1.0` (initial). Evolution per `UCOS-SVC-POLICY-001`.
- **NFR block (every contract):** Latency `PENDING ASR RATIFICATION` · Throughput `PENDING ASR RATIFICATION` · Availability `PENDING ASR RATIFICATION` · Recovery (RTO/RPO) `PENDING ASR RATIFICATION`.
- **Security:** Authn/Authz/Data-protection/Rate-limiting = `FLAGGED FOR PROMPT 09` (no control defined here).
- **Idempotency:** commands declare idempotency intent (idempotency-key) as a contract obligation; concrete enforcement is implementation (Prompt 10).
- **Pagination/filtering:** read collections declare a cursor-pagination contract obligation (parameters technology-neutral).
- **Classification:** payload sensitivity inherited from `UCOS-PDATA-ARCH-001` / `MC-01`; never widened here.

---

# §A — API Contracts (`UCOS-API-CONTRACT-001..030`)

> Each API contract = the synchronous published interface of one service (or a BFF). Operations list
> intent. NFR = `PENDING ASR RATIFICATION`; Security = `FLAGGED FOR PROMPT 09`.

### `UCOS-API-CONTRACT-001` — Catalog API `v1.0`
- **Producer:** `UCOS-SVC-001` Catalog · **Domain:** DOM-001 · **Capability:** CAP-01 · **Data:** `DC-001`
- **Consumers:** SVC-002/003/004/012/014/028, Storefront BFF (`API-029`)
- **Operations:** `GET /products` (search/browse, cursor-paginated, faceted) · `GET /products/{id}` (detail read model) · `GET /categories` (taxonomy) · `POST /products` (admin create) · `PATCH /products/{id}` (admin update) · `POST /products/{id}:discontinue` (admin)
- **Seam/ECR:** DOM-001→consumers (CF); `UCOS-EXP-CR-001`, `UCOS-EXP-CR-013` · **Emits:** `EVT-001`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-002` — Pricing & Promotions API `v1.0`
- **Producer:** `UCOS-SVC-002` · **Domain:** DOM-002 · **Capability:** CAP-02 · **Data:** `DC-002`
- **Consumers:** SVC-004/005/007/010/014, `API-029`
- **Operations:** `POST /prices:resolve` (price/promotion/tax-input quote for items+context) · `GET /promotions` · `POST /promotions` (admin) · `PATCH /promotions/{id}` (admin) · `GET /price-lists` (admin)
- **Seam/ECR:** DOM-002→consumers (CS), ↔DOM-003 (PT); `UCOS-EXP-CR-002`, `UCOS-EXP-CR-013` · **Emits:** `EVT-002`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-003` — Inventory & Availability API `v1.0`
- **Producer:** `UCOS-SVC-003` · **Domain:** DOM-003 · **Capability:** CAP-03 · **Data:** `DC-003`
- **Consumers:** SVC-004/005/009, `API-029`/`API-030`
- **Operations:** `POST /availability:check` (availability for items+location) · `GET /stock/{sku}` · `POST /reservations` (place reservation) · `DELETE /reservations/{id}` (release) · `POST /stock:adjust` (ops/fulfillment)
- **Seam/ECR:** DOM-003→consumers (CS), DOM-009→DOM-003 stock-adjust; `UCOS-EXP-CR-003`, `UCOS-EXP-CR-014` · **Emits:** `EVT-003`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-004` — Cart & Checkout API `v1.0`
- **Producer:** `UCOS-SVC-004` · **Domain:** DOM-004 · **Capability:** CAP-04 · **Data:** `DC-004`
- **Consumers:** `API-029`, SVC-005/006 (handoff), SVC-010 (PT)
- **Operations:** `POST /carts` · `GET /carts/{id}` · `POST /carts/{id}/items` · `PATCH /carts/{id}/items/{lineId}` · `DELETE /carts/{id}/items/{lineId}` · `POST /carts/{id}:checkout` (initiate checkout → Order handoff)
- **Seam/ECR:** DOM-004→DOM-005/006 (CS), ↔DOM-010 (PT); `UCOS-EXP-CR-004`, `UCOS-EXP-CR-005` · **Emits:** `EVT-004`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-005` — Order Management API `v1.0`
- **Producer:** `UCOS-SVC-005` · **Domain:** DOM-005 · **Capability:** CAP-05 · **Data:** `DC-005`
- **Consumers:** `API-029`/`API-030`, SVC-006/007/008/009 (downstream), SVC-010/019 (PT)
- **Operations:** `POST /orders` (place order from checkout, idempotency-key) · `GET /orders/{id}` · `GET /orders` (history, customer-scoped) · `POST /orders/{id}:cancel` · `GET /orders/{id}/status`
- **Seam/ECR:** DOM-004→DOM-005 (CS), DOM-005→downstream (CS); `UCOS-EXP-CR-005`, `UCOS-EXP-CR-007`, `UCOS-EXP-CR-014` · **Emits:** `EVT-005`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-006` — Payments API `v1.0`
- **Producer:** `UCOS-SVC-006` · **Domain:** DOM-006 · **Capability:** CAP-06 (auth/capture facet) · **Data:** `DC-006`
- **Consumers:** `API-029`, SVC-004/005/010 (upstream initiate), SVC-007/008 (downstream)
- **Operations:** `POST /payments:authorize` (idempotency-key) · `POST /payments/{id}:capture` · `POST /payments/{id}:refund` · `GET /payments/{id}` (status read, UI-level)
- **Seam/ECR:** DOM-004/005/010→DOM-006 (CS), DOM-006→DOM-007/008 (CS); `UCOS-EXP-CR-006` · **Emits:** `EVT-006`
- **Note:** payment *security* (PCI-scope, tokenization) = `FLAGGED FOR PROMPT 09`; not designed here.
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-007` — Billing API `v1.0`
- **Producer:** `UCOS-SVC-007` · **Domain:** DOM-007 · **Capability:** CAP-06 (obligation facet) · **Data:** `DC-007`
- **Consumers:** `API-029`, SVC-008 (settlement), SVC-016 (statements)
- **Operations:** `GET /invoices` (customer-scoped) · `GET /invoices/{id}` · `POST /invoices` (system) · `GET /billing-accounts/{id}`
- **Seam/ECR:** DOM-005/006/010→DOM-007 (CS), DOM-007→DOM-008/016 (CS); `UCOS-EXP-CR-011` · **Emits:** `EVT-007`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-008` — Settlement API `v1.0`
- **Producer:** `UCOS-SVC-008` · **Domain:** DOM-008 · **Capability:** CAP-06 (ledger facet) · **Data:** `DC-008`
- **Consumers:** SVC-020 (insight), SVC-014 (commissions), governance/compliance reads
- **Operations:** `GET /settlements/{id}` · `GET /ledgers/{account}` · `POST /settlements:reconcile` (system) · `GET /commissions` (marketplace)
- **Seam/ECR:** DOM-006/007/014→DOM-008 (CS), DOM-008→DOM-020 (CF) · **Emits:** `EVT-008`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-009` — Fulfillment & Returns API `v1.0`
- **Producer:** `UCOS-SVC-009` · **Domain:** DOM-009 · **Capability:** CAP-07 · **Data:** `DC-009`
- **Consumers:** `API-029`/`API-030`, SVC-003/006/007/015/016
- **Operations:** `GET /shipments/{id}` · `POST /shipments` (ops) · `POST /returns` (request) · `GET /returns/{id}` · `POST /returns/{id}:approve` (ops)
- **Seam/ECR:** DOM-005/003→DOM-009 (CS), DOM-009→consumers (CS); `UCOS-EXP-CR-008`, `UCOS-EXP-CR-014` · **Emits:** `EVT-009`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-010` — Subscriptions API `v1.0`
- **Producer:** `UCOS-SVC-010` · **Domain:** DOM-010 · **Capability:** CAP-05/02/06 (recurring) · **Data:** `DC-010`
- **Consumers:** `API-029`, SVC-005/006/007
- **Operations:** `GET /subscriptions` (customer-scoped) · `POST /subscriptions` · `PATCH /subscriptions/{id}` · `POST /subscriptions/{id}:cancel` · `POST /subscriptions/{id}:renew` (system)
- **Seam/ECR:** DOM-010→DOM-005/006/007 (CS/PT), ↔DOM-004 (PT); `UCOS-EXP-CR-010` · **Emits:** `EVT-010`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-011` — Customer & CRM API `v1.0`
- **Producer:** `UCOS-SVC-011` · **Domain:** DOM-011 · **Capability:** CAP-08 · **Data:** `DC-011`
- **Consumers:** `API-029`/`API-030`, SVC-005/014/015/020
- **Operations:** `GET /customers/{id}` · `PATCH /customers/{id}` · `GET /customers/{id}/profile` · `POST /support-cases` · `GET /support-cases/{id}` · `POST /support-cases/{id}/messages`
- **Note:** "Party" is a Shared Language term (DF-002) consumed via translation/ACL; no shared mutable model.
- **Seam/ECR:** DOM-017→DOM-011 (CS), DOM-011→consumers (CF/CS); `UCOS-EXP-CR-009`, `UCOS-EXP-CR-012` · **Emits:** `EVT-011`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-012` — Merchandising API `v1.0`
- **Producer:** `UCOS-SVC-012` · **Domain:** DOM-012 · **Capability:** CAP-14/13 · **Data:** `DC-012`
- **Consumers:** `API-029` (storefront), `API-030` (admin), SVC-028
- **Operations:** `GET /merchandising/recommendations` · `GET /merchandising/collections` · `POST /merchandising/rules` (admin) · `PATCH /merchandising/rules/{id}` (admin)
- **Seam/ECR:** DOM-001→DOM-012 (CF), DOM-020→DOM-012 (CS), DOM-012→DOM-028 (CS); `UCOS-EXP-CR-013` · **Emits:** `EVT-012`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-013` — Supplier API `v1.0`
- **Producer:** `UCOS-SVC-013` · **Domain:** DOM-013 · **Capability:** CAP-01/03 (supply-side) · **Data:** `DC-013`
- **Consumers:** `API-030` (partner portal), SVC-001/003
- **Operations:** `POST /suppliers` (onboard) · `GET /suppliers/{id}` · `POST /suppliers/{id}/catalog-submissions` · `GET /suppliers/{id}/catalog-submissions/{subId}`
- **Seam/ECR:** DOM-017→DOM-013 (CS), DOM-013→DOM-001/003 (CS); `UCOS-EXP-CR-015` · **Emits:** `EVT-013`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-014` — Marketplace API `v1.0`
- **Producer:** `UCOS-SVC-014` · **Domain:** DOM-014 · **Capability:** CAP-01..07 (composition) · **Data:** `DC-014`
- **Consumers:** `API-030`, SVC-001..009 (PT composition), SVC-008 (commissions)
- **Operations:** `GET /listings` · `POST /listings` · `PATCH /listings/{id}` · `GET /sellers/{id}/orders` · `POST /seller-orders/{id}:allocate` (system)
- **Seam/ECR:** DOM-011/013→DOM-014 (CS), DOM-014→Core/Settlement (PT/CS); `UCOS-EXP-CR-015` · **Emits:** `EVT-014`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-015` — Communication API `v1.0`
- **Producer:** `UCOS-SVC-015` · **Domain:** DOM-015 · **Capability:** CAP-14 (delivery) · **Data:** `DC-015`
- **Consumers:** `API-030`, SVC-028; notification sources SVC-005/007/009/016 (via events)
- **Operations:** `POST /notifications:send` (system, idempotency-key) · `GET /notifications/{id}` · `GET /communication-preferences/{customerId}` · `PUT /communication-preferences/{customerId}`
- **Seam/ECR:** {005,007,009,016}→DOM-015 (CS), DOM-015→DOM-028 (CF); `UCOS-EXP-CR-012` · **Emits:** `EVT-015`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-016` — Document API `v1.0`
- **Producer:** `UCOS-SVC-016` · **Domain:** DOM-016 · **Capability:** CAP-14 (records) · **Data:** `DC-016`
- **Consumers:** `API-029`/`API-030`, SVC-015 (delivery)
- **Operations:** `POST /documents:generate` (system) · `GET /documents/{id}` · `GET /documents/{id}:download-ref` (entitlement-scoped reference; binary handling deferred)
- **Seam/ECR:** DOM-005/007/009→DOM-016 (CS), DOM-016→DOM-015 (CS) · **Emits:** `EVT-016`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-017` — Identity & Access API `v1.0`
- **Producer:** `UCOS-SVC-017` · **Domain:** DOM-017 · **Capability:** CAP-09 · **Data:** `DC-017`
- **Consumers:** `API-030`, **all services** (access-decision consumers)
- **Operations:** `GET /principals/{id}` · `POST /principals` (admin) · `GET /roles` · `POST /role-assignments` (admin) · `POST /access:evaluate` (access-decision request — *decision contract only; authorization model owned by Prompt 09*)
- **Seam/ECR:** DOM-024/025/022→DOM-017 (govern), DOM-017→all (CS); `UCOS-EXP-CR-016` · **Emits:** `EVT-017`
- **Note:** This is the *contract surface* for identity/access; authentication/authorization **controls** are `FLAGGED FOR PROMPT 09`.
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-018` — Configuration & Metadata API `v1.0`
- **Producer:** `UCOS-SVC-018` · **Domain:** DOM-018 · **Capability:** CAP-10 · **Data:** `DC-018`
- **Consumers:** `API-030`, **all services** (variability consumers)
- **Operations:** `GET /configuration/{scope}` (resolve config/variability) · `PUT /configuration/{scope}/{key}` (admin) · `GET /metadata/{class}` (read `MC-01..13`) · `GET /feature-flags/{context}`
- **Seam/ECR:** DOM-027/025→DOM-018 (CS), DOM-018→all (CF); `UCOS-EXP-CR-020` · **Emits:** `EVT-018`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-019` — Workflow & Orchestration API `v1.0`
- **Producer:** `UCOS-SVC-019` · **Domain:** DOM-019 · **Capability:** EA L6 (+CAP-05 support) · **Data:** `DC-019`
- **Consumers:** `API-030`, SVC-005/009/014 (orchestrated, PT)
- **Operations:** `POST /workflows/{type}:start` · `GET /workflows/{id}` · `POST /workflows/{id}/steps/{stepId}:complete` · `GET /workflows/{id}/history`
- **Seam/ECR:** DOM-022→DOM-019 (CS), DOM-019→DOM-005/009/014 (PT); `UCOS-EXP-CR-014`, `UCOS-EXP-CR-017` · **Emits:** `EVT-019`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-020` — Intelligence & Insight API `v1.0`
- **Producer:** `UCOS-SVC-020` · **Domain:** DOM-020 · **Capability:** CAP-13 · **Data:** `DC-020`
- **Consumers:** `API-030`, SVC-012 (reco), SVC-022/023 (insight)
- **Operations:** `GET /insights/{topic}` · `POST /analytics:query` (governed read query) · `GET /reports/{id}`
- **Seam/ECR:** DOM-021/008→DOM-020 (CS/CF), DOM-020→DOM-012/022/023 (CS/CF); `UCOS-EXP-CR-019` · **Emits:** `EVT-020`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-021` — Observability API `v1.0`
- **Producer:** `UCOS-SVC-021` · **Domain:** DOM-021 · **Capability:** CAP-11 · **Data:** `DC-021`
- **Consumers:** `API-030`, SVC-020 (telemetry), SVC-023 (audit records)
- **Operations:** `GET /health/{service}` · `GET /metrics` (governed read) · `GET /audit-records` (compliance-scoped) · `GET /traces/{id}`
- **Seam/ECR:** all→DOM-021 (CF emit), DOM-021→DOM-020/023 (CS); `UCOS-EXP-CR-019` · **Emits:** `EVT-021`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-022` — Governance API `v1.0`
- **Producer:** `UCOS-SVC-022` · **Domain:** DOM-022 · **Capability:** CAP-15 · **Data:** `DC-022`
- **Consumers:** `API-030`, all services (governed-by), SVC-023/025
- **Operations:** `GET /governance/decisions` · `POST /governance/decisions` (record) · `GET /governance/ownership/{artifact}` · `GET /governance/zones`
- **Seam/ECR:** DOM-022→all (CS); `UCOS-EXP-CR-017` · **Emits:** `EVT-022`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-023` — Compliance API `v1.0`
- **Producer:** `UCOS-SVC-023` · **Domain:** DOM-023 · **Capability:** CAP-16 · **Data:** `DC-023`
- **Consumers:** `API-030`, all services (gate verdicts)
- **Operations:** `GET /compliance/evidence` · `POST /compliance/gates/{id}:evaluate` · `GET /compliance/gaps` · `GET /compliance/attestations/{id}`
- **Seam/ECR:** DOM-022/025/021→DOM-023 (CS), DOM-023→all (CS); `UCOS-EXP-CR-018` · **Emits:** `EVT-023`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-024` — Security API `v1.0`
- **Producer:** `UCOS-SVC-024` · **Domain:** DOM-024 · **Capability:** CAP-17 · **Data:** `DC-024`
- **Consumers:** `API-030`, all services (posture), SVC-017
- **Operations:** `GET /security/posture/{scope}` · `GET /security/threat-governance` · `POST /security/posture:assert` (governance)
- **Note:** This contract surfaces **security posture/governance metadata only**; concrete controls (S1/S3/S4 enforcement, secrets, keys) are **owned by Prompt 09** — `FLAGGED FOR PROMPT 09`. No control invented.
- **Seam/ECR:** DOM-024→all (CS), DOM-024→DOM-017 (CS); `UCOS-EXP-CR-016` · **Emits:** `EVT-024`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-025` — Policy & Decisioning API `v1.0`
- **Producer:** `UCOS-SVC-025` · **Domain:** DOM-025 · **Capability:** CAP-18 · **Data:** `DC-025`
- **Consumers:** `API-030`, all services (rule evaluation), SVC-023/018/017
- **Operations:** `GET /policies` · `POST /policies` (author) · `POST /policies:evaluate` (decision request) · `GET /policies/{id}/versions`
- **Seam/ECR:** DOM-022→DOM-025 (CS), DOM-025→all (CS); `UCOS-EXP-CR-017` · **Emits:** `EVT-025`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-026` — Integration & Federation API `v1.0`
- **Producer:** `UCOS-SVC-026` · **Domain:** DOM-026 · **Capability:** CAP-12 · **Data:** `DC-026`
- **Consumers:** `API-030` (developer portal), all services (boundary/transport), SVC-027 (PT)
- **Operations:** `GET /integrations` · `POST /integrations` (register external seam) · `GET /api-catalog` (published contract discovery) · `POST /api-keys` (issue) · `DELETE /api-keys/{id}` (revoke)
- **Seam/ECR:** DOM-024/022→DOM-026 (CS), DOM-026→all (CS); `UCOS-EXP-CR-015`, `UCOS-EXP-CR-021` · **Emits:** `EVT-026`
- **Note:** API-key *issuance contract* only; key security/rotation = `FLAGGED FOR PROMPT 09`.
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-027` — Registry API `v1.0`
- **Producer:** `UCOS-SVC-027` · **Domain:** DOM-027 · **Capability:** CAP-19 · **Data:** `DC-027`
- **Consumers:** `API-030`, all services (registration/discovery), SVC-018/026
- **Operations:** `GET /registry/artifacts` · `POST /registry/artifacts` (register) · `GET /registry/artifacts/{id}` · `GET /registry/discovery?type=` (discover wiring/services)
- **Seam/ECR:** DOM-022/025→DOM-027 (CS), DOM-027→all (CS); `UCOS-EXP-CR-017`, `UCOS-EXP-CR-021` · **Emits:** `EVT-027`
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-028` — Experience Delivery Service API `v1.0`
- **Producer:** `UCOS-SVC-028` · **Domain:** DOM-028 · **Capability:** CAP-14 · **Data:** `DC-028`
- **Consumers:** Storefront/Console BFFs internal composition; surfaces
- **Operations:** `GET /experience/layouts/{surface}` (metadata-driven layout/theme resolution — variability via `MC-13`) · `GET /experience/navigation/{role}` (navigation model; entitlement enforcement `FLAGGED FOR PROMPT 09`)
- **Seam/ECR:** DOM-012/015/001→DOM-028 (CS/CF); `UCOS-EXP-CR-001..021` (presentation substrate) · **Emits:** none (terminal)
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-029` — Storefront Experience BFF `v1.0`
- **Producer:** `UCOS-SVC-028` (BFF) · **Domain:** DOM-028 (aggregation; owns no truth) · **Capability:** CAP-14
- **Aggregates:** `API-001/002/003/004/005/006/007/009/010/011/012/016`
- **Serves surfaces:** S-001 Storefront, S-002 Mobile, S-003 Account, S-004 Checkout
- **Operations:** consumer-shaped read/command aggregations for shopper journeys (e.g., `GET /storefront/product/{id}` composing catalog+price+availability; `POST /storefront/checkout` composing cart→order→payment initiation)
- **Seam/ECR:** `UCOS-EXP-CR-001..011` · **Emits:** none
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

### `UCOS-API-CONTRACT-030` — Console Experience BFF `v1.0`
- **Producer:** `UCOS-SVC-028` (BFF) · **Domain:** DOM-028 (aggregation) · **Capability:** CAP-14
- **Aggregates:** `API-003/005/009/011/012/013/014/015/017/018/019/020/021/022/023/024/025/026/027`
- **Serves surfaces:** S-005..S-014 (admin consoles & portals)
- **Operations:** role-scoped read/command aggregations for operator/admin/governance journeys (navigation/entitlement enforcement `FLAGGED FOR PROMPT 09`)
- **Seam/ECR:** `UCOS-EXP-CR-012..021` · **Emits:** none
- **NFR:** `PENDING ASR RATIFICATION` · **Security:** `FLAGGED FOR PROMPT 09`

> **§A summary:** 30 API contracts. Every contract: capability + domain anchored, NFR `PENDING ASR
> RATIFICATION`, Security `FLAGGED FOR PROMPT 09`. 0 dangling.


---

# §B — Event Contracts (`UCOS-EVT-CONTRACT-001..027`)

> Each event contract = the versioned asynchronous message set published by one service at its
> state-propagation seams. Every event contract **realizes** one or more platform events
> (`UCOS-PEA-003` `PEV-001..073`), whose payload authority was deferred to Prompt 07. Payloads reference a
> `UCOS-DATA-CONTRACT-*`. Delivery semantics declare intent (at-least-once, ordering, idempotency key);
> concrete broker/transport selection is deferred to Prompt 08. NFR = `PENDING ASR RATIFICATION`; transport
> trust = `FLAGGED FOR PROMPT 09`. `UCOS-SVC-028` (Experience Delivery) is terminal and publishes no events.

| Event Contract | Producer | Domain | Cap | Messages (`v1.0`) | Primary consumers | Data | `PEV` linkage |
|----------------|----------|--------|-----|-------------------|-------------------|------|---------------|
| `UCOS-EVT-CONTRACT-001` | SVC-001 Catalog | DOM-001 | CAP-01 | `ProductPublished`, `ProductUpdated`, `ProductDiscontinued` | SVC-002/003/004/012/014/028 | `DC-001` | `PEV` (Catalog domain, PED-of-DOM-001) |
| `UCOS-EVT-CONTRACT-002` | SVC-002 Pricing | DOM-002 | CAP-02 | `PriceChanged`, `PromotionActivated`, `PromotionExpired` | SVC-004/005/007/010 | `DC-002` | `PEV` (Pricing) |
| `UCOS-EVT-CONTRACT-003` | SVC-003 Inventory | DOM-003 | CAP-03 | `StockLevelChanged`, `ReservationPlaced`, `ReservationReleased`, `AvailabilityChanged` | SVC-004/005/009 | `DC-003` | `PEV` (Inventory) |
| `UCOS-EVT-CONTRACT-004` | SVC-004 Cart & Checkout | DOM-004 | CAP-04 | `CartCheckedOut`, `CartAbandoned` | SVC-005/006 | `DC-004` | `PEV` (Cart) |
| `UCOS-EVT-CONTRACT-005` | SVC-005 Order | DOM-005 | CAP-05 | `OrderPlaced`, `OrderConfirmed`, `OrderCancelled` | SVC-006/007/008/009/015/019 | `DC-005` | `PEV` (Order) |
| `UCOS-EVT-CONTRACT-006` | SVC-006 Payments | DOM-006 | CAP-06 | `PaymentAuthorized`, `PaymentCaptured`, `PaymentFailed`, `RefundIssued` | SVC-005/007/008 | `DC-006` | `PEV` (Payments) |
| `UCOS-EVT-CONTRACT-007` | SVC-007 Billing | DOM-007 | CAP-06 | `InvoiceIssued`, `StatementGenerated` | SVC-008/015/016 | `DC-007` | `PEV` (Billing) |
| `UCOS-EVT-CONTRACT-008` | SVC-008 Settlement | DOM-008 | CAP-06 | `SettlementCompleted`, `CommissionCalculated` | SVC-020 | `DC-008` | `PEV` (Settlement) |
| `UCOS-EVT-CONTRACT-009` | SVC-009 Fulfillment | DOM-009 | CAP-07 | `ShipmentDispatched`, `ShipmentDelivered`, `ReturnRequested`, `ReturnCompleted` | SVC-003/006/007/015/016 | `DC-009` | `PEV` (Fulfillment) |
| `UCOS-EVT-CONTRACT-010` | SVC-010 Subscriptions | DOM-010 | CAP-05/02/06 | `SubscriptionCreated`, `SubscriptionRenewed`, `SubscriptionCancelled` | SVC-005/006/007 | `DC-010` | `PEV` (Subscriptions) |
| `UCOS-EVT-CONTRACT-011` | SVC-011 Customer & CRM | DOM-011 | CAP-08 | `CustomerRegistered`, `CustomerProfileUpdated`, `SupportCaseUpdated` | SVC-005/014/015/020 | `DC-011` | `PEV` (Customer) |
| `UCOS-EVT-CONTRACT-012` | SVC-012 Merchandising | DOM-012 | CAP-14/13 | `MerchandisingRuleUpdated`, `CollectionPublished` | SVC-028 | `DC-012` | `PEV` (Merchandising) |
| `UCOS-EVT-CONTRACT-013` | SVC-013 Supplier | DOM-013 | CAP-01/03 | `SupplierOnboarded`, `SupplierCatalogSubmitted` | SVC-001/003 | `DC-013` | `PEV` (Supplier) |
| `UCOS-EVT-CONTRACT-014` | SVC-014 Marketplace | DOM-014 | CAP-01..07 | `ListingPublished`, `SellerOrderAllocated` | SVC-001..009/008 | `DC-014` | `PEV` (Marketplace) |
| `UCOS-EVT-CONTRACT-015` | SVC-015 Communication | DOM-015 | CAP-14 | `NotificationDispatched`, `NotificationFailed` | SVC-028, SVC-021 (audit) | `DC-015` | `PEV` (Communication) |
| `UCOS-EVT-CONTRACT-016` | SVC-016 Document | DOM-016 | CAP-14 | `DocumentGenerated` | SVC-015 | `DC-016` | `PEV` (Document) |
| `UCOS-EVT-CONTRACT-017` | SVC-017 Identity & Access | DOM-017 | CAP-09 | `PrincipalRegistered`, `AccessGranted`, `AccessRevoked` | all (consumed-by-all) | `DC-017` | `PEV` (Identity) |
| `UCOS-EVT-CONTRACT-018` | SVC-018 Configuration & Metadata | DOM-018 | CAP-10 | `ConfigurationChanged`, `MetadataUpdated`, `FeatureFlagChanged` | all (consumed-by-all) | `DC-018` | `PEV` (Configuration/Metadata) |
| `UCOS-EVT-CONTRACT-019` | SVC-019 Workflow | DOM-019 | EA L6 | `WorkflowStarted`, `WorkflowStepCompleted`, `WorkflowCompleted`, `WorkflowFailed` | SVC-005/009/014 | `DC-019` | `PEV` (Workflow) |
| `UCOS-EVT-CONTRACT-020` | SVC-020 Intelligence | DOM-020 | CAP-13 | `InsightGenerated` | SVC-012/022/023 | `DC-020` | `PEV` (Intelligence) |
| `UCOS-EVT-CONTRACT-021` | SVC-021 Observability | DOM-021 | CAP-11 | `TelemetryRecorded`, `AuditRecordEmitted`, `HealthStateChanged` | SVC-020/023 (and governance) | `DC-021` | `PEV` (Observability/Audit) |
| `UCOS-EVT-CONTRACT-022` | SVC-022 Governance | DOM-022 | CAP-15 | `GovernanceDecisionRecorded`, `OwnershipAssigned` | all (governed-by), SVC-023/025 | `DC-022` | `PEV` (Governance) |
| `UCOS-EVT-CONTRACT-023` | SVC-023 Compliance | DOM-023 | CAP-16 | `ComplianceGateEvaluated`, `BlockingGapRaised`, `BlockingGapCleared` | all (gate verdicts) | `DC-023` | `PEV` (Compliance/Audit) |
| `UCOS-EVT-CONTRACT-024` | SVC-024 Security | DOM-024 | CAP-17 | `SecurityPostureChanged` | all, SVC-017 | `DC-024` | `PEV` (Control/Security posture) |
| `UCOS-EVT-CONTRACT-025` | SVC-025 Policy | DOM-025 | CAP-18 | `PolicyPublished`, `PolicyEvaluated`, `PolicyDeprecated` | all, SVC-023/018/017 | `DC-025` | `PEV` (Policy/Control) |
| `UCOS-EVT-CONTRACT-026` | SVC-026 Integration & Federation | DOM-026 | CAP-12 | `IntegrationSeamRegistered`, `MessageRouted`, `ApiKeyIssued`, `ApiKeyRevoked` | all, SVC-027 | `DC-026` | `PEV` (Integration/Eventing) |
| `UCOS-EVT-CONTRACT-027` | SVC-027 Registry | DOM-027 | CAP-19 | `ArtifactRegistered`, `ArtifactSuperseded`, `ArtifactDiscovered` | all, SVC-018/026 | `DC-027` | `PEV` (Registry) |

> **§B summary:** 27 event contracts. Each: producer + domain + capability anchored, ≥1 message, payload
> referenced to a data contract, `PEV` linkage to `UCOS-PEA-003`, delivery semantics declared (at-least-once,
> tolerant-reader, idempotency key), NFR `PENDING ASR RATIFICATION`, transport trust `FLAGGED FOR PROMPT 09`.
> Concrete `PEV` IDs are bound during Phase 9.1/validation reconciliation against the platform event catalog;
> producer-runtime-service anchoring is via `TM-PEA-003`/`TM-PEA-006`. 0 events without a producer anchor.

---

# §C — Data Contracts (`UCOS-DATA-CONTRACT-001..028`)

> Each data contract = the versioned, technology-neutral payload schema family for one service's published
> request/response and event payloads. Data contracts **reference** authoritative data entities
> (`UCOS-PDATA-ARCH-001` `PDE-001..073` / `UCOS-LDATA-ARCH-001` `LDO-001..073`) and **inherit**
> classification from the data architecture / `MC-01`; they **do not** redefine schemas, tables, columns,
> keys, or storage (Prompt 05 ownership; PD-GOV-002 persistence neutrality preserved). No field-level
> physical schema, DDL, or serialization is authored here.

| Data Contract | Owning service / domain | Cap | Payload families (`v1.0`) | References (data architecture) | Classification (inherited) |
|---------------|-------------------------|-----|---------------------------|-------------------------------|----------------------------|
| `UCOS-DATA-CONTRACT-001` | SVC-001 / DOM-001 | CAP-01 | ProductReadModel, ProductSummary, CategoryNode, ProductWriteModel | Catalog `LDO/PDE` (DOM-001 set) | inherited from `UCOS-PDATA-ARCH-001` |
| `UCOS-DATA-CONTRACT-002` | SVC-002 / DOM-002 | CAP-02 | PriceQuote, PromotionDefinition, PriceListEntry | Pricing `LDO/PDE` (DOM-002) | inherited |
| `UCOS-DATA-CONTRACT-003` | SVC-003 / DOM-003 | CAP-03 | AvailabilityView, StockLevel, Reservation | Inventory `LDO/PDE` (DOM-003) | inherited |
| `UCOS-DATA-CONTRACT-004` | SVC-004 / DOM-004 | CAP-04 | Cart, CartLine, CheckoutContext | Cart `LDO/PDE` (DOM-004) | inherited |
| `UCOS-DATA-CONTRACT-005` | SVC-005 / DOM-005 | CAP-05 | Order, OrderLine, OrderStatus, OrderHistoryEntry | Order `LDO/PDE` (DOM-005) | inherited |
| `UCOS-DATA-CONTRACT-006` | SVC-006 / DOM-006 | CAP-06 | PaymentAuthorization, PaymentCapture, Refund, PaymentStatus | Payments `LDO/PDE` (DOM-006) | inherited (sensitive; display per `UCOS-EXP-STD-007`) |
| `UCOS-DATA-CONTRACT-007` | SVC-007 / DOM-007 | CAP-06 | Invoice, BillingAccount, Statement | Billing `LDO/PDE` (DOM-007) | inherited |
| `UCOS-DATA-CONTRACT-008` | SVC-008 / DOM-008 | CAP-06 | Settlement, LedgerEntry, Commission | Settlement `LDO/PDE` (DOM-008) | inherited |
| `UCOS-DATA-CONTRACT-009` | SVC-009 / DOM-009 | CAP-07 | Shipment, ReturnRequest, ReturnStatus | Fulfillment `LDO/PDE` (DOM-009) | inherited |
| `UCOS-DATA-CONTRACT-010` | SVC-010 / DOM-010 | CAP-05/02/06 | Subscription, SubscriptionPlan, RenewalSchedule | Subscriptions `LDO/PDE` (DOM-010) | inherited |
| `UCOS-DATA-CONTRACT-011` | SVC-011 / DOM-011 | CAP-08 | CustomerProfile, ContactPoint, SupportCase, CaseMessage | Customer `LDO/PDE` (DOM-011); Party = Shared Language (DF-002) | inherited (PII handling `FLAGGED FOR PROMPT 09`) |
| `UCOS-DATA-CONTRACT-012` | SVC-012 / DOM-012 | CAP-14/13 | Recommendation, Collection, MerchandisingRule | Merchandising `LDO/PDE` (DOM-012) | inherited |
| `UCOS-DATA-CONTRACT-013` | SVC-013 / DOM-013 | CAP-01/03 | Supplier, CatalogSubmission | Supplier `LDO/PDE` (DOM-013); Party Shared Language | inherited |
| `UCOS-DATA-CONTRACT-014` | SVC-014 / DOM-014 | CAP-01..07 | Listing, Seller, SellerOrderAllocation | Marketplace `LDO/PDE` (DOM-014); Party Shared Language | inherited |
| `UCOS-DATA-CONTRACT-015` | SVC-015 / DOM-015 | CAP-14 | NotificationRequest, NotificationStatus, CommunicationPreference | Communication `LDO/PDE` (DOM-015) | inherited |
| `UCOS-DATA-CONTRACT-016` | SVC-016 / DOM-016 | CAP-14 | DocumentDescriptor, DocumentReference | Document `LDO/PDE` (DOM-016) | inherited |
| `UCOS-DATA-CONTRACT-017` | SVC-017 / DOM-017 | CAP-09 | Principal, Role, RoleAssignment, AccessDecision | Identity `LDO/PDE` (DOM-017) | inherited (sensitive; controls `FLAGGED FOR PROMPT 09`) |
| `UCOS-DATA-CONTRACT-018` | SVC-018 / DOM-018 | CAP-10 | ConfigurationValue, MetadataRecord, FeatureFlag | Config/Metadata `LDO/PDE` (DOM-018); `MC-01..13` | inherited |
| `UCOS-DATA-CONTRACT-019` | SVC-019 / DOM-019 | EA L6 | WorkflowInstance, WorkflowStep, WorkflowHistory | Workflow `LDO/PDE` (DOM-019) | inherited |
| `UCOS-DATA-CONTRACT-020` | SVC-020 / DOM-020 | CAP-13 | Insight, AnalyticsQuery, Report | Intelligence `LDO/PDE` (DOM-020) | inherited |
| `UCOS-DATA-CONTRACT-021` | SVC-021 / DOM-021 | CAP-11 | HealthStatus, Metric, AuditRecord, Trace | Observability `LDO/PDE` (DOM-021) | inherited |
| `UCOS-DATA-CONTRACT-022` | SVC-022 / DOM-022 | CAP-15 | GovernanceDecision, OwnershipRecord, Zone | Governance `LDO/PDE` (DOM-022) | inherited |
| `UCOS-DATA-CONTRACT-023` | SVC-023 / DOM-023 | CAP-16 | ComplianceEvidence, GateResult, BlockingGap, Attestation | Compliance `LDO/PDE` (DOM-023) | inherited |
| `UCOS-DATA-CONTRACT-024` | SVC-024 / DOM-024 | CAP-17 | SecurityPosture, ThreatGovernanceRecord | Security `LDO/PDE` (DOM-024) | inherited (posture metadata; controls `FLAGGED FOR PROMPT 09`) |
| `UCOS-DATA-CONTRACT-025` | SVC-025 / DOM-025 | CAP-18 | Policy, PolicyDecision, PolicyVersion | Policy `LDO/PDE` (DOM-025) | inherited |
| `UCOS-DATA-CONTRACT-026` | SVC-026 / DOM-026 | CAP-12 | IntegrationDescriptor, ApiCatalogEntry, ApiKeyDescriptor | Integration `LDO/PDE` (DOM-026) | inherited (key material `FLAGGED FOR PROMPT 09`) |
| `UCOS-DATA-CONTRACT-027` | SVC-027 / DOM-027 | CAP-19 | RegistryArtifact, DiscoveryRecord | Registry `LDO/PDE` (DOM-027) | inherited |
| `UCOS-DATA-CONTRACT-028` | SVC-028 / DOM-028 | CAP-14 | SurfaceLayout, NavigationModel, ThemeBinding | Experience metadata; `MC-13` variability | inherited |

> **§C summary:** 28 data contracts. Each references authoritative data entities (`PDE-*`/`LDO-*`) and
> inherits classification; **0 schemas redefined**, **0 persistence/storage selected** (PD-GOV-002 honored).
> Field-level physical schemas remain owned by `UCOS-PDATA-ARCH-001`.

---

## Catalog Totals

| Contract type | ID range | Count |
|---------------|----------|------:|
| API Contracts | `UCOS-API-CONTRACT-001..030` | 30 |
| Event Contracts | `UCOS-EVT-CONTRACT-001..027` | 27 |
| Data Contracts | `UCOS-DATA-CONTRACT-001..028` | 28 |
| **Total** | — | **85** |

> All 85 contracts: `v1.0`; capability + domain anchored; NFR `PENDING ASR RATIFICATION`; security
> `FLAGGED FOR PROMPT 09`; 0 fabricated NFR values; 0 invented security controls; 0 data-schema redefinition;
> 0 implementation/infrastructure/deployment/technology artifacts.

## Traceability
- **Refines:** `UCOS-SVC-ARCH-001`, `UCOS-DOM-ARCH-001` §VIII, `UCOS-CAP-ARCH-001`, `UCOS-EXP-ARCH-001` (`UCOS-EXP-CR-001..021`), `UCOS-PDATA-ARCH-001`/`UCOS-LDATA-ARCH-001`, `UCOS-INF-ARCH-001` (`MC-01..13`), `UCOS-PEA-003` (`PEV-001..073`), `PROMPT-07`.
- **Refined by:** Prompt 08 (runtime/transport), Prompt 09 (security controls for flagged surfaces), Prompt 10 (implementation), Prompt 11 (contract tests).
- **Owner:** Service & API Contract Architecture (subordinate to Authority Board).

**END UCOS-CONTRACT-CAT-001 — Contract Catalog (GENERATED · 30 API · 27 Event · 28 Data · NFRs PENDING ASR RATIFICATION · Security FLAGGED FOR PROMPT 09).**
