# PROMPT08-BINDING-INVENTORY

**Artifact:** PDATA-BIND-INV-001
**Phase:** PHASE D.2 — Prompt-08 (WS2)
**Authority:** Contract Authority / Data Architecture.
**Scope:** every operation and event of API-018 + API-027 (the compiler-authorized scope). Inventory only — bindings are specified in WS3.

Source of truth: `contracts/catalog/api-018.contract.json`, `contracts/catalog/api-027.contract.json` (operations, `emits.messages`); `contracts/field-schemas/*` (authored payload families). operationIds are the deterministic ids from `deriveOperationId`.

---

## 1. API-018 — Configuration & Metadata (DC-018)

### 1.1 Operations

| operationId | Verb | Path | Kind | Request payload | Response payload |
|-------------|------|------|------|-----------------|------------------|
| getConfigurationByScope | GET | `/configuration/{scope}` | safe-read | — (none) | ConfigurationValue (single) |
| putConfigurationByScopeByKey | PUT | `/configuration/{scope}/{key}` | unsafe-idempotent | ConfigurationValue | ConfigurationValue (single) |
| getMetadataByClass | GET | `/metadata/{class}` | safe-read | — (none) | MetadataRecord (collection) |
| getFeatureFlagsByContext | GET | `/feature-flags/{context}` | safe-read | — (none) | FeatureFlag (collection) |

### 1.2 Events (EVT-018)

| Event message | Payload |
|---------------|---------|
| ConfigurationChanged | ConfigurationValue |
| MetadataUpdated | MetadataRecord |
| FeatureFlagChanged | FeatureFlag |

### 1.3 Registry/data payloads referenced
DC-018 families: ConfigurationValue, MetadataRecord, FeatureFlag — all authored (Prompt-05).

---

## 2. API-027 — Registry (DC-027)

### 2.1 Operations

| operationId | Verb | Path | Kind | Request payload | Response payload |
|-------------|------|------|------|-----------------|------------------|
| getRegistryArtifacts | GET | `/registry/artifacts` | safe-read | — (none) | RegistryArtifact (collection) |
| postRegistryArtifacts | POST | `/registry/artifacts` | unsafe-create | RegistryArtifact | RegistryArtifact (single) |
| getRegistryArtifactsById | GET | `/registry/artifacts/{id}` | safe-read | — (none) | RegistryArtifact (single) |
| getRegistryDiscovery | GET | `/registry/discovery?type=` | safe-read | — (none) | DiscoveryRecord (collection) |

### 2.2 Events (EVT-027)

| Event message | Payload |
|---------------|---------|
| ArtifactRegistered | RegistryArtifact |
| ArtifactSuperseded | RegistryArtifact |
| ArtifactDiscovered | DiscoveryRecord |

### 2.3 Registry/data payloads referenced
DC-027 families: RegistryArtifact (the registered unit), DiscoveryRecord (the discovery projection) — the **registry payloads** of CAP-19. Both authored (Prompt-05).

---

## 3. Cardinality derivation (grounded in operation intent, not invented)

| Pattern | Cardinality | Operations |
|---------|-------------|------------|
| read-by-id / resolve-single scope | single | getConfigurationByScope, putConfigurationByScopeByKey (resp), getRegistryArtifactsById, postRegistryArtifacts (resp) |
| list / read-class / resolve-for-context / discover | collection | getMetadataByClass, getFeatureFlagsByContext, getRegistryArtifacts, getRegistryDiscovery |

## 4. Coverage totals

| Contract | Operations | Events | Distinct payload families |
|----------|:----------:|:------:|:-------------------------:|
| API-018 | 4 | 3 | 3 (ConfigurationValue, MetadataRecord, FeatureFlag) |
| API-027 | 4 | 3 | 2 (RegistryArtifact, DiscoveryRecord) |
| **Total** | **8** | **6** | **5** |

Every operation carries exactly one response payload; two operations (the unsafe writes) carry a
request payload; safe-reads carry none. Every event carries exactly one payload. All 5 authored
families are referenced (no orphan). This inventory is the basis for the WS3 binding specification.

**Traceability:** `contracts/catalog/api-018|027.contract.json` (`operations`, `emits.messages`); `contracts/field-schemas/*`; `deriveOperationId`.
