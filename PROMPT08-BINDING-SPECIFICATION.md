# PROMPT08-BINDING-SPECIFICATION

**Artifact:** PDATA-BIND-SPEC-001 (evidence artifact for EV-PROMPT-08)
**Phase:** PHASE D.2 — Prompt-08 (WS3)
**Authority:** Contract Authority / Data Architecture; GATE-DOC-001.
**Machine-readable companion:** `contracts/bindings/operation-payload-bindings.json` (`ucos-operation-binding/1.0.0`).
**Scope:** canonical Operation → {Request, Response, Event, Registry} bindings for API-018 + API-027. **No code, DTOs, validators, or runtime behavior** — declarative binding authority only.

---

## Binding model

Each binding references an authored payload family by its field-schema **registry id**
(`${dataContract}/${family}`). References resolve in `contracts/field-schemas/` (all VERIFIED via
Prompt-05). Request bodies exist only for unsafe operations; safe-reads declare none. Transport
(status codes, verbs, serialization) is **not** bound (Prompt 08 platform); security/error models
are **not** bound (Prompt 09).

Reference ids:
- `UCOS-DATA-CONTRACT-018/ConfigurationValue`
- `UCOS-DATA-CONTRACT-018/MetadataRecord`
- `UCOS-DATA-CONTRACT-018/FeatureFlag`
- `UCOS-DATA-CONTRACT-027/RegistryArtifact`
- `UCOS-DATA-CONTRACT-027/DiscoveryRecord`

---

## 1. API-018 — Operation → Request/Response Model

| operationId | Request Model | Response Model (cardinality) |
|-------------|---------------|------------------------------|
| getConfigurationByScope | *(none — safe-read)* | ConfigurationValue (single) |
| putConfigurationByScopeByKey | **ConfigurationValue** | ConfigurationValue (single) |
| getMetadataByClass | *(none — safe-read)* | MetadataRecord (collection) |
| getFeatureFlagsByContext | *(none — safe-read)* | FeatureFlag (collection) |

### API-018 — Operation → Event Model

| Event | Event Payload Model |
|-------|---------------------|
| ConfigurationChanged | ConfigurationValue |
| MetadataUpdated | MetadataRecord |
| FeatureFlagChanged | FeatureFlag |

## 2. API-027 — Operation → Request/Response Model

| operationId | Request Model | Response Model (cardinality) |
|-------------|---------------|------------------------------|
| getRegistryArtifacts | *(none — safe-read)* | RegistryArtifact (collection) |
| postRegistryArtifacts | **RegistryArtifact** | RegistryArtifact (single) |
| getRegistryArtifactsById | *(none — safe-read)* | RegistryArtifact (single) |
| getRegistryDiscovery | *(none — safe-read)* | DiscoveryRecord (collection) |

### API-027 — Operation → Event Model

| Event | Event Payload Model |
|-------|---------------------|
| ArtifactRegistered | RegistryArtifact |
| ArtifactSuperseded | RegistryArtifact |
| ArtifactDiscovered | DiscoveryRecord |

## 3. Operation → Registry Model

DC-027 is the Registry contract (CAP-19). Its two payload families are the canonical registry models:

| Registry model | Bound by | Role |
|----------------|----------|------|
| RegistryArtifact | postRegistryArtifacts (write), getRegistryArtifacts / getRegistryArtifactsById (read), ArtifactRegistered/Superseded (events) | the registered unit of authoritative knowledge (LDO-059/PDE-059) |
| DiscoveryRecord | getRegistryDiscovery (read), ArtifactDiscovered (event) | the discovery-index projection (LDO-061/PDE-061) |

## 4. Binding rules (normative)

1. **Request rule.** Only `unsafe-create` / `unsafe-idempotent` operations declare a request body; its model is the family the operation writes. `safe-read` operations declare no request body.
2. **Response rule.** Every operation declares exactly one response model = the family it returns; cardinality per the operation intent (WS2 §3).
3. **Event rule.** Every emitted event message binds to exactly one payload family = the entity whose change it announces.
4. **Reference rule.** Every bound model is referenced by its field-schema registry id; no field schema is inlined or redefined here (that is Prompt-05's authority).
5. **Boundary rule.** No transport, status, serialization, pagination, authn/authz, or error-model content is bound (Prompt 08 / Prompt 09).

## 5. Coverage

8 operations (8 response bindings + 2 request bindings) + 6 event bindings = **16 bindings** across
**5** payload families. Every operation and event of both in-scope contracts is bound; all references
resolve. Validation: `PROMPT08-BINDING-VALIDATION.md`.

**Traceability:** `contracts/bindings/operation-payload-bindings.json`; `contracts/schema/operation.schema.json` (`request.bodyRef`/`responses[].bodyRef`/`schemaRef`); `contracts/field-schemas/*`; `UCOS-CONTRACT-CAT-001`; AUTH-004/007/009; UCOS-CONST-001 (Art. IV).
