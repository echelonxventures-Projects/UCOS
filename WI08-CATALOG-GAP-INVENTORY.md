# WI08-CATALOG-GAP-INVENTORY

| Field | Value |
|-------|-------|
| Artifact | **Catalog Gap Inventory** |
| Work Item | **PHASE 12 — WI-08** (Contract Catalog Enrichment) |
| Branch | `phase-11-contracts-sdk` |
| Frozen Baseline | `56a32d3` · Tag `ucost-baseline-green-284` |
| Inputs | `CONTRACT-INVENTORY-ASSESSMENT.md`, `GENERATOR-READINESS-GAP-REPORT.md`, `PHASE-12-WI-06-*`, `PHASE-12-WI-07-*`, `contracts/catalog/*`, `contracts/schema/*`, `tools/contract-generator/*`, `packages/contracts-sdk/generated/*` |
| Scope | `UCOS-API-CONTRACT-018`, `UCOS-API-CONTRACT-027` (all ratified contracts) |
| Mode | **INVENTORY ONLY** — gaps are enumerated and classified; **no business payloads invented** |
| Date | 2026-07-03 |
| Traceability | `UCOS-CONTRACT-CAT-001` · `UCOS-SVC-ARCH-001` · IC-2 |

> **Purpose.** Enumerate **every missing field-level schema** that blocks DTO and Validator generation,
> classify each as **Required / Optional / Deferred**, and map each gap to the exact
> Contract → Operation → Request / Response / Error slot it affects. This inventory is the authoritative
> work list that the WI-08 Field-Schema Framework + Schema Registry must be able to **satisfy**, and that the
> enhanced Stage-3 sufficiency engine must be able to **recognize**.

---

## 1. Method

For each ratified contract, the canonical model (`stage2Model`) surfaces:
- `dataContractDetail.payloadFamilies[]` — the named payload families the contract owns.
- `operations[]` — each with a derived `request` (declared:false), `responses[]` (declared:false),
  and `errors` (declared:false).

A generation target is **SUFFICIENT** only when the field-level schema backing every relevant slot is
**present and resolvable**. Today, all such schemas are absent (the catalog is boundary-level). Each row
below is therefore a **gap**, not a defect — its owner is `UCOS-PDATA-ARCH-001` (Prompt 05) for payload
bodies and a governed error-model authoring step for error shapes.

**Classification key:**
- **Required** — a field-level schema that DTO/Validator generation cannot proceed without. Blocks
  `SUFFICIENT` for that target until supplied via the Schema Registry.
- **Optional** — improves fidelity (e.g. typed parameters, pagination cursor typing) but is not strictly
  required to lift DTOs/Validators to `SUFFICIENT`.
- **Deferred** — owned by a later governed step (transport, serialization, security, event `PEV` linkage);
  out of scope for the field-schema framework and intentionally not modeled as a payload schema.

---

## 2. Payload-Family Schema Gaps (the primary DTO/Validator blocker — G1)

Each payload family requires a **canonical field schema** (object with typed properties) before a DTO or a
validator can be emitted for it. These are the registry keys the framework must be able to resolve.

### API-018 — Configuration & Metadata (`UCOS-DATA-CONTRACT-018`)

| # | Payload family | Registry binding key | Backs | Classification | Owner / status |
|---|----------------|----------------------|-------|:--------------:|----------------|
| F1 | `ConfigurationValue` | `UCOS-DATA-CONTRACT-018/ConfigurationValue` | request/response bodies of `/configuration/*` | **Required** | `UCOS-PDATA-ARCH-001` — NOT DEFINED IN CATALOG |
| F2 | `MetadataRecord` | `UCOS-DATA-CONTRACT-018/MetadataRecord` | response body of `/metadata/{class}` | **Required** | `UCOS-PDATA-ARCH-001` — NOT DEFINED IN CATALOG |
| F3 | `FeatureFlag` | `UCOS-DATA-CONTRACT-018/FeatureFlag` | response body of `/feature-flags/{context}` | **Required** | `UCOS-PDATA-ARCH-001` — NOT DEFINED IN CATALOG |

### API-027 — Registry (`UCOS-DATA-CONTRACT-027`)

| # | Payload family | Registry binding key | Backs | Classification | Owner / status |
|---|----------------|----------------------|-------|:--------------:|----------------|
| F4 | `RegistryArtifact` | `UCOS-DATA-CONTRACT-027/RegistryArtifact` | request/response bodies of `/registry/artifacts*` | **Required** | `UCOS-PDATA-ARCH-001` — NOT DEFINED IN CATALOG |
| F5 | `DiscoveryRecord` | `UCOS-DATA-CONTRACT-027/DiscoveryRecord` | response body of `/registry/discovery` | **Required** | `UCOS-PDATA-ARCH-001` — NOT DEFINED IN CATALOG |

> **Sufficiency rule (registry-driven).** A contract's DTOs/Validators become `SUFFICIENT` when **every**
> payload family above resolves in the Schema Registry to a **valid, dependency-complete** field schema.
> Until then the verdict stays `BLOCKED` — never bypassed by invention.

---

## 3. Per-Operation Slot Gaps

Legend: **Req** = request body · **Res** = response body · **Err** = error model · **Param** = path/query
parameter types.

### API-018 — Configuration & Metadata

| Operation | Req gap | Res gap | Err gap | Param gap | Classification |
|-----------|---------|---------|---------|-----------|:--------------:|
| `GET /configuration/{scope}` | — (safe-read, no body) | `ConfigurationValue` (F1) | error model (E1) | `{scope}` type | Res **Required**; Err Deferred; Param Optional |
| `PUT /configuration/{scope}/{key}` | `ConfigurationValue` (F1) | `ConfigurationValue` (F1) | error model (E1) | `{scope}`,`{key}` types | Req/Res **Required**; Err Deferred; Param Optional |
| `GET /metadata/{class}` | — | `MetadataRecord` (F2) | error model (E1) | `{class}` type | Res **Required**; Err Deferred; Param Optional |
| `GET /feature-flags/{context}` | — | `FeatureFlag` (F3) | error model (E1) | `{context}` type | Res **Required**; Err Deferred; Param Optional |

### API-027 — Registry

| Operation | Req gap | Res gap | Err gap | Param gap | Classification |
|-----------|---------|---------|---------|-----------|:--------------:|
| `GET /registry/artifacts` | — | `RegistryArtifact` collection (F4) | error model (E2) | pagination cursor | Res **Required**; Err Deferred; Param Optional |
| `POST /registry/artifacts` | `RegistryArtifact` (F4) | `RegistryArtifact` (F4) | error model (E2) | — | Req/Res **Required**; Err Deferred |
| `GET /registry/artifacts/{id}` | — | `RegistryArtifact` (F4) | error model (E2) | `{id}` type | Res **Required**; Err Deferred; Param Optional |
| `GET /registry/discovery?type=` | — | `DiscoveryRecord` collection (F5) | error model (E2) | `?type=` type | Res **Required**; Err Deferred; Param Optional |

---

## 4. Error-Model Gaps

| # | Contract | Slot | Consequence | Classification | Owner / status |
|---|----------|------|-------------|:--------------:|----------------|
| E1 | API-018 | `operations[*].errors` | No typed error DTOs; error stays OPAQUE (`declared:false`) | **Deferred** | No error model in catalog (G5); governed authoring |
| E2 | API-027 | `operations[*].errors` | No typed error DTOs; error stays OPAQUE (`declared:false`) | **Deferred** | No error model in catalog (G5); governed authoring |

> Error models are **not** payload-family field schemas; they are a separate governed artifact. The
> field-schema framework can represent them (via `payloadRef` / field schemas keyed as error shapes) but
> WI-08 does **not** author them and does **not** require them for the DTO/Validator sufficiency flip.

---

## 5. Parameter / Convention Gaps (Optional or Deferred)

| # | Gap | Affected slot | Classification | Owner / status |
|---|-----|---------------|:--------------:|----------------|
| P1 | Path parameter TYPES (`{scope}`,`{key}`,`{class}`,`{context}`,`{id}`) | `request.pathParameters[*].schemaRef` | **Optional** | Field schema (Prompt 05/08) |
| P2 | Query parameter TYPE (`?type=`) | `request.queryParameters[*].schemaRef` | **Optional** | Field schema (Prompt 08) |
| P3 | Pagination cursor parameters | list ops of API-027/018 | **Optional** | Governed catalog update (`UCOS-SVC-POLICY-001`) |
| P4 | Idempotency-key binding | unsafe ops (`PUT`,`POST`) | **Optional** | Governed convention |
| P5 | Content-type / serialization | all ops | **Deferred** | Prompt 08 |
| P6 | Transport binding (host, protocol) | all ops | **Deferred** | Prompt 08 |
| P7 | Auth / authz / rate-limit | all surfaces | **Deferred** | Prompt 09 (`FLAGGED FOR PROMPT 09`) |
| P8 | Concrete `PEV-*` event linkage + event payload schemas | `emits` | **Deferred** | Phase 9.1 reconciliation |

---

## 6. Gap → Framework Requirement Mapping

| Gap group | Must be satisfiable by | WI-08 workstream |
|-----------|------------------------|------------------|
| F1–F5 (payload-family field schemas) | Canonical Field Schema Model + Schema Registry (resolve by binding key) | WS2 + WS3 |
| Per-op Req/Res binding (§3) | Sufficiency engine resolves each contract's families → `SUFFICIENT` | WS4 |
| P1–P2 (parameter types) | Field Schema Model supports primitive + reference nodes (optional) | WS2 |
| E1–E2 (error models) | Field Schema Model can represent error shapes (not authored here) | WS2 |
| P3–P8 (transport/security/events) | Out of scope — Deferred; framework must NOT model these as payloads | — |

---

## 7. Summary

- **5 Required** payload-family field schemas (F1–F5) are the sole hard blockers of DTO/Validator
  `SUFFICIENT` for the two ratified contracts.
- **2 Deferred** error models (E1–E2) and **8 Optional/Deferred** parameter/convention gaps (P1–P8) do not
  block the DTO/Validator sufficiency flip.
- The WI-08 framework must be able to **hold, validate, version, and resolve** F1–F5 (and, additively, the
  optional/deferred shapes) **without WI-08 itself authoring any of them** — those remain owned by
  `UCOS-PDATA-ARCH-001` and governed authoring. Until they are supplied, every target stays `BLOCKED`/`PARTIAL`
  exactly as WI-07 reported.

**END WI08-CATALOG-GAP-INVENTORY (Inventory-only · No invention · Baseline `56a32d3`).**
