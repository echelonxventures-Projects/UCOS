# PROMPT09-ERROR-INVENTORY

**Artifact:** PDATA-P09-ERRINV-001 (Prompt-09 WS2)
**Phase:** PHASE D.3 — Prompt-09
**Authority:** Contract Authority / Data Architecture; `GATE-DOC-001`.
**Scope:** the compiler-authorized surface only — API-018 + API-027 (8 operations, 6 events, 5 payload families) from `contracts/bindings/operation-payload-bindings.json`.
**Discipline:** every error condition below is **discovered from a ratified authority source** (the runtime error taxonomy, field-schema constraints, or the security control catalog). **No error condition is invented; no HTTP status, framework type, or runtime handler is defined** (that is Prompt 08 transport / Prompt 10 implementation).

---

## 1. Grounded error condition classes (authority sources)

Two ratified error taxonomies realize every operation in scope, plus the field-schema layer:

**A. Substrate taxonomy** — `packages/platform-runtime/src/meta-core/errors.ts` (`SubstrateError`, code union of 10). The Configuration, Metadata, and Registry runtimes that realize API-018/API-027 throw these:

| Code | Condition |
|------|-----------|
| `VALIDATION_FAILED` | input/record violates a declared constraint |
| `NOT_FOUND` | addressed record does not resolve |
| `REGISTRY_CONFLICT` | duplicate/version/supersession conflict on write |
| `RESOLUTION_FAILED` | a required reference cannot be resolved (layered config/discovery) |
| `LIFECYCLE_VIOLATION` | operation invoked against an incompatible lifecycle state |
| `EXECUTION_FAILED` | failure during capability execution |
| `DEPENDENCY_CYCLE` | cyclic dependency (substrate composition) |
| `COMPOSITION_FAILED` | capability composition failure |
| `PLUGIN_LOAD_FAILED` / `LOADER_FAILED` | provider/descriptor load failure |

**B. Control taxonomy** — `packages/platform-runtime/src/control/errors.ts` (`ControlError`, code union of 5). The PI-4 control plane (deny-by-default) throws these at every boundary:

| Code | Condition |
|------|-----------|
| `AUTHENTICATION_FAILED` | principal not authenticated at boundary |
| `AUTHORIZATION_DENIED` | deny-by-default policy denial (incl. cross-tenant / least-privilege) |
| `TRUST_INSUFFICIENT` | principal trust level below required |
| `GOVERNANCE_BLOCKED` | governed-change gate unsatisfied (AD-0009 / Evolution commit path) |
| `CONTROL_VALIDATION_FAILED` | control-plane precondition/record invalid |

**C. Field-schema layer** — `contracts/field-schemas/*` constraints authored by Prompt-05. Violations surface as substrate `VALIDATION_FAILED` (input/contract validation, `SEC-CTL-015`). Constraint sources: `ConfigurationValue.scope` minLength 1; `RegistryArtifact.version` pattern `^\d+\.\d+\.\d+$`, `kind` enum `{capability,contract}`; `MetadataRecord.metadataClass` pattern `^MC-(0[1-9]|1[0-3])$`; required fields per family.

## 2. Error surface by required category (WS2 mandate)

| Required category | Present in scope? | Grounded condition(s) | Authority |
|-------------------|:-----------------:|-----------------------|-----------|
| **error conditions** | ✅ | all rows in §1.A/§1.B/§1.C | substrate + control taxonomies |
| **validation failures** | ✅ | field-schema constraint violation; malformed body/param | `VALIDATION_FAILED`; `SEC-CTL-015`; `contracts/field-schemas/*` |
| **authorization failures** | ✅ | deny-by-default denial; insufficient trust; cross-tenant | `AUTHORIZATION_DENIED`, `TRUST_INSUFFICIENT`; `SEC-CTL-002/003/013`; S1/S4 |
| **registry failures** | ✅ | duplicate/version/supersession conflict; artifact not found; superseded-artifact mutation | `REGISTRY_CONFLICT`, `NOT_FOUND`, `LIFECYCLE_VIOLATION`; CAP-19 registry runtime |
| **dependency failures** | ✅ | unresolved reference during layered resolution/discovery | `RESOLUTION_FAILED` |
| **runtime failures** | ✅ | execution failure after authz/validation succeed | `EXECUTION_FAILED` |
| **governance failures** | ✅ | governed write requires approval + Evolution commit path | `GOVERNANCE_BLOCKED`; AD-0009; PI-6 |
| **authentication failures** | ✅ | unauthenticated principal at boundary | `AUTHENTICATION_FAILED`; `SEC-CTL-001/004/014`; S1 |

> `DEPENDENCY_CYCLE`, `COMPOSITION_FAILED`, `PLUGIN_LOAD_FAILED`, `LOADER_FAILED` are substrate-internal composition/loader conditions that are **not reachable at the API-018/API-027 request boundary** (they occur during capability wiring, not during a bound operation). They are recorded here as **out-of-boundary** and are intentionally NOT bound to the 8 operations (documented in the registry as `outOfBoundary`), preventing orphan/over-broad error classes.

## 3. Per-operation error surface (8 operations)

Legend — kind drives which conditions apply: safe-read (SR), unsafe-idempotent (UI), unsafe-create (UC). Authn (`AUTHENTICATION_FAILED`) and Authz (`AUTHORIZATION_DENIED`) apply to **every** operation (S1, every boundary).

| operationId | kind | validation | not-found | conflict | resolution | authn | authz | trust | governance | runtime | lifecycle |
|-------------|:----:|:----------:|:--------:|:--------:|:----------:|:-----:|:-----:|:-----:|:----------:|:-------:|:---------:|
| getConfigurationByScope | SR | param | ✅ | — | ✅ | ✅ | ✅ | — | — | ✅ | — |
| putConfigurationByScopeByKey | UI | body+param | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| getMetadataByClass | SR | param | ✅ | — | — | ✅ | ✅ | — | — | ✅ | — |
| getFeatureFlagsByContext | SR | param | ✅ | — | ✅ | ✅ | ✅ | — | — | ✅ | — |
| getRegistryArtifacts | SR | — | — | — | — | ✅ | ✅ | — | — | ✅ | — |
| postRegistryArtifacts | UC | body | — | ✅ | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| getRegistryArtifactsById | SR | param | ✅ | — | — | ✅ | ✅ | — | — | ✅ | — |
| getRegistryDiscovery | SR | param | ✅ | — | ✅ | ✅ | ✅ | — | — | ✅ | — |

*(`validation: param` = path/query parameter validation; `body` = request payload validation against the bound field-schema family.)*

## 4. Per-event error surface (6 events)

Events are producer-emitted notifications (`emits.messages`). Their **boundary** error surface is publication-side only; consumer-side transport/delivery errors are **out of scope** (Prompt 08 platform). Publication conditions:

| Event | payload family | validation | authz-to-publish | runtime |
|-------|----------------|:----------:|:----------------:|:-------:|
| ConfigurationChanged | ConfigurationValue | ✅ | ✅ | ✅ |
| MetadataUpdated | MetadataRecord | ✅ | ✅ | ✅ |
| FeatureFlagChanged | FeatureFlag | ✅ | ✅ | ✅ |
| ArtifactRegistered | RegistryArtifact | ✅ | ✅ | ✅ |
| ArtifactSuperseded | RegistryArtifact | ✅ | ✅ | ✅ |
| ArtifactDiscovered | DiscoveryRecord | ✅ | ✅ | ✅ |

Event publication validation = the emitted payload must conform to its bound field-schema family (same `VALIDATION_FAILED` model). Replay/duplicate handling on the event fabric is a control concern (`SEC-CTL-016`) surfaced in the Security Authority Registry (WS5), not an error model.

## 5. Per-payload-family error surface (5 families)

Each family contributes its field-schema constraint set to the `VALIDATION_FAILED` model wherever it is a request/response/event body:

| Family | Constraint-bearing fields (→ validation error) | Families' operations/events |
|--------|-----------------------------------------------|-----------------------------|
| ConfigurationValue | `scope` (req, minLen1), `value` (req), `layer` enum | getConfigurationByScope, putConfigurationByScopeByKey, ConfigurationChanged |
| MetadataRecord | `key` (req, minLen1), `metadataClass` pattern MC-01..13, `value` (req) | getMetadataByClass, MetadataUpdated |
| FeatureFlag | `key` (req, minLen1), `enabled` (req) | getFeatureFlagsByContext, FeatureFlagChanged |
| RegistryArtifact | `id`/`version`/`kind`/`descriptor` (req), `version` pattern, `kind` enum, `status` enum | getRegistryArtifacts, postRegistryArtifacts, getRegistryArtifactsById, ArtifactRegistered, ArtifactSuperseded |
| DiscoveryRecord | `type`/`artifactId` (req), `version` pattern, `kind` enum | getRegistryDiscovery, ArtifactDiscovered |

## 6. Coverage summary (input to WS3)

- Distinct grounded error conditions in-boundary: **11** (validation, not-found, conflict, resolution, authn, authz, trust, governance, control-validation, runtime/execution, lifecycle).
- Out-of-boundary substrate conditions (recorded, not bound): 4 (`DEPENDENCY_CYCLE`, `COMPOSITION_FAILED`, `PLUGIN_LOAD_FAILED`, `LOADER_FAILED`).
- Operations covered: **8/8** · Events covered: **6/6** · Payload families covered: **5/5** · Bindings covered: **16/16**.

## Traceability

Refines `contracts/bindings/operation-payload-bindings.json`, `contracts/field-schemas/*`, `contracts/schema/error.schema.json`, `packages/platform-runtime/src/meta-core/errors.ts`, `packages/platform-runtime/src/control/errors.ts`, `UCOS-SEC-CONTROL-001`. Governed by `UCOS-SVC-POLICY-001`; AUTH-004/007/008; `UCOS-CONST-001` Art. IV/X.
