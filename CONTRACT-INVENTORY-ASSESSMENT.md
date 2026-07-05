# CONTRACT-INVENTORY-ASSESSMENT

| Field | Value |
|-------|-------|
| Artifact | **Contract Inventory Validation & Assessment** |
| Work Item | **PHASE 12 — WI-06** (Contract Meta-Schema & Canonical Generator Model) |
| Branch | `phase-11-contracts-sdk` |
| Frozen Baseline | `56a32d3` · Tag `ucost-baseline-green-284` |
| Inputs | `contracts/catalog/api-018.contract.json`, `contracts/catalog/api-027.contract.json` |
| Source of record | `UCOS-CONTRACT-CAT-001` (`specifications/contracts/UCOS-CONTRACT-CATALOG.md`) |
| Mode | **ASSESSMENT ONLY** — additive; no catalog/runtime changes; no invention |
| Date | 2026-07-03 |
| Traceability | `UCOS-CONTRACT-CAT-001` · `UCOS-SVC-ARCH-001` · IC-2 |

> **Purpose.** Validate the two WI-05 inventories and characterize what the catalog **does** and **does not**
> represent, so the WI-06 meta-schema and canonical model are grounded in observed structure — never in
> invented fields. Every "missing" item below is a **catalog-level deferral**, not a defect to be filled here.

---

## 1. Structural Validation

Both files parse as valid JSON and share an identical top-level shape.

| Check | api-018 | api-027 |
|-------|:-------:|:-------:|
| Valid JSON (`JSON.parse`) | ✅ | ✅ |
| `inventoryFormat` = `ucos-api-contract.inventory/v1` | ✅ | ✅ |
| `inventoryKind` = `api-contract-extraction` | ✅ | ✅ |
| `extraction` provenance block present | ✅ | ✅ |
| `contract` block present | ✅ | ✅ |
| `generationConstraints.note` present | ✅ | ✅ |
| `traceability` block present | ✅ | ✅ |

**Structural determination:** the two inventories are **schema-consistent** with each other. A single
meta-schema can validate both without special-casing.

---

## 2. Common Fields (present in BOTH inventories)

### Top level
`inventoryFormat`, `inventoryKind`, `extraction`, `contract`, `generationConstraints`, `traceability`.

### `extraction`
`source`, `sourceArtifactId`, `sourceVersion`, `sourceSection`, `extractedBy`, `extractionDate`, `fidelity`.

### `contract`
`id`, `shortId`, `title`, `version`, `status`, `producer`, `domain`, `capability`, `dataContract`,
`consumers[]`, `operations[]`, `seamEcr{seams[], ecr[]}`, `emits{eventContract, shortId, producer, domain,
capability, messages[]}`, `nfr{latency, throughput, availability, recoveryRtoRpo}`, `security`,
`dataContractDetail{id, owningServiceDomain, capability, payloadFamilies[], referencesDataArchitecture,
classification, fieldLevelSchema}`.

### `operations[]` element
`verbSemantics`, `path`, `intent`, `kind`.

### `traceability`
`refines[]`, `governedBy`, `invariants[]`.

**Determination:** the common-field set is **stable and complete relative to the catalog's boundary-level
abstraction**. This set defines the required core of the meta-schema.

---

## 3. Field-Provenance Classification

To honor the NO-ASSUMPTIONS rule, each field is classified by how it relates to the catalog:

| Field | Provenance | Note |
|-------|------------|------|
| `contract.id/shortId/title/version/status` | **Verbatim** | Directly from catalog entry heading. |
| `producer/domain/capability/dataContract` | **Verbatim** | From catalog bullet. |
| `consumers[]` | **Verbatim** | From catalog "Consumers" line (free-text entries preserved). |
| `operations[].verbSemantics/path/intent` | **Verbatim** | From catalog "Operations" line. |
| `operations[].kind` | **Derived** | Normalized from the catalog's stated verb semantics (GET→safe-read, PUT→unsafe-idempotent, POST→unsafe-create). Traceable to the catalog's reading note ("verbs denote operation semantics: safe/unsafe/idempotent"); **not** a verbatim token. |
| `seamEcr` | **Verbatim** | From catalog "Seam/ECR" line. |
| `emits` | **Verbatim** | From catalog "Emits" + §B event-contract row. |
| `nfr.*` | **Verbatim placeholder** | All `PENDING ASR RATIFICATION`. |
| `security` | **Verbatim placeholder** | `FLAGGED FOR PROMPT 09`. |
| `dataContractDetail.*` | **Verbatim** | From §C data-contract row; `fieldLevelSchema` explicitly `NOT DEFINED IN CATALOG`. |

> **Flag (transparency).** `operations[].kind` is the only **derived** field. It is a deterministic function
> of the catalog's own verb-semantics statement and introduces no new behavior. The meta-schema (TASK 2) marks
> it as a derived/enumerated field so its provenance stays explicit.

---

## 4. Missing Fields (required by a generator, ABSENT from catalog by design)

These are the fields a code generator would need to emit real DTOs/validators/clients/servers, but which the
catalog **intentionally does not define** (deferred to later Prompts). They are **recorded, not filled**.

| Missing information | Needed for | Catalog owner / deferral |
|---------------------|-----------|--------------------------|
| Stable `operationId` (canonical method name) | client method names, server handler keys | Not defined; must be derived deterministically or supplied |
| Path parameter **types** (`{scope}`, `{key}`, `{class}`, `{context}`, `{id}`) | request typing, URL building | Field schema deferred (Prompt 05/08) |
| Query parameter schema (e.g. `?type=` on discovery) | request typing | Deferred (Prompt 08) |
| Request **body** schema (fields of payload families) | DTOs, request validators | `fieldLevelSchema: NOT DEFINED IN CATALOG` (Prompt 05 / `UCOS-PDATA-ARCH-001`) |
| Response **body** schema + status codes | DTOs, response validators | Deferred (Prompt 05/08) |
| **Error** model (codes, shapes) | error types, error handling | Not present in catalog at all |
| Pagination parameters (cursor) | list/collection operations | Catalog declares a generic cursor-pagination *obligation* but no concrete params |
| Idempotency-key binding per operation | unsafe operations | Declared generically in catalog conventions; not present for API-018/027 operations |
| Content type / serialization | wire encode/decode | Deferred (Prompt 08) |
| Transport binding (host, protocol) | client transport | Deferred (Prompt 08) |
| Auth / authz / rate-limit | security enforcement | `FLAGGED FOR PROMPT 09` |
| Concrete `PEV-*` IDs for emitted events | event contract binding | Catalog notes binding occurs during Phase 9.1/validation reconciliation |

**Determination:** the inventories are **faithful and complete at the catalog's abstraction level**, but
**insufficient for field-level code generation**. This is expected and is quantified precisely in
`GENERATOR-READINESS-GAP-REPORT.md` (TASK 5).

---

## 5. Catalog Limitations (by-design boundaries of `UCOS-CONTRACT-CAT-001`)

From the catalog's own reading note and status:
1. **Boundary/architecture level only** — operations + messages enumerated with intent + payload *reference*.
2. **No transport** — no hostnames, protocols, serialization, or frameworks (deferred to Prompt 08).
3. **No field-level schemas** — payloads reference `PDE-*`/`LDO-*`; schemas owned by `UCOS-PDATA-ARCH-001`.
4. **NFRs unresolved** — every value `PENDING ASR RATIFICATION`.
5. **Security deferred** — every surface `FLAGGED FOR PROMPT 09`.
6. **Event `PEV` IDs unbound** — concrete platform-event linkage bound later.

These limitations are **constitutional**, not gaps to remediate in WI-06. The meta-schema must **represent the
presence of these deferrals** (e.g., allow `PENDING ASR RATIFICATION`, `FLAGGED FOR PROMPT 09`, and
`NOT DEFINED IN CATALOG` as first-class placeholder states) rather than force concrete values.

---

## 6. Information Present in Catalog but Not (Yet) Represented in Inventory

| Catalog element | In inventory? | Assessment |
|-----------------|:-------------:|------------|
| API-018/027 operations, consumers, seams, emits, NFR, security, data contract | ✅ | Fully represented |
| Global **conventions** (versioning, NFR block, idempotency intent, pagination obligation, classification inheritance) | ⚠️ partial | Captured implicitly via `generationConstraints.note`; not modeled as structured fields |
| §B event-contract **delivery semantics** (at-least-once, tolerant-reader, idempotency key) | ❌ | Not extracted; the inventory lists event *messages* only |
| §C data-contract **classification nuance** (e.g., sensitive/PII flags on other contracts) | n/a for 018/027 | Neither 018 nor 027 carries special classification beyond "inherited" |

**Determination:** for API-018/API-027 the inventory is materially complete. Two **structured-representation
opportunities** (global conventions; event delivery semantics) are noted for the meta-schema to accommodate
**optionally and additively**, without requiring them for API contracts.

---

## 7. Requirements Handed to TASK 2 (Meta-Schema)

The meta-schema must:
1. Validate the existing `ucos-api-contract.inventory/v1` shape (both files) **without modification**.
2. Model **API, event, and data** contract kinds under one contract schema (discriminated by `contractKind`).
3. Treat field-level request/response/error schemas as **optional** and support explicit placeholder states
   (`NOT DEFINED IN CATALOG`, `PENDING ASR RATIFICATION`, `FLAGGED FOR PROMPT 09`).
4. Be **versioned**, **additive-only**, **transport-neutral**, **implementation-neutral**.
5. Mark `operations[].kind` as a **derived enumerated** field with documented provenance.
6. Contain **no implementation-specific fields** (no host, protocol, framework, serialization).

---

## 8. Summary

- Both inventories are **valid, schema-consistent, and catalog-faithful**.
- Common-field core is **stable**; one field (`operations[].kind`) is **derived** and flagged.
- Field-level schema, error model, pagination, idempotency binding, transport, security, and `PEV` linkage are
  **absent by catalog design** — recorded, not invented.
- The meta-schema and canonical model can be built on this structure with **optional** extension points for the
  deferred layers.

**END CONTRACT-INVENTORY-ASSESSMENT (Assessment-only · Additive · Baseline `56a32d3`).**
