# PROMPT09-ERROR-REGISTRY

**Artifact:** PDATA-P09-ERRREG-001 (Prompt-09 WS3 — evidence for `EV-PROMPT-09`)
**Phase:** PHASE D.3 — Prompt-09
**Authority:** Contract Authority / Data Architecture; `GATE-DOC-001`.
**Machine-readable canonical registry:** `contracts/errors/error-model-registry.json` (`ucos-error-model/1.0.0`).
**Discipline:** authority metadata only. Codes are the ratified runtime taxonomy's stable, transport-neutral codes (`meta-core/errors.ts`, `control/errors.ts`) — **not HTTP status codes**, per `contracts/schema/error.schema.json`. No DTO, validator, handler, or runtime behavior is defined.

---

## 1. Canonical error models (11)

Each model carries the WS3-mandated attributes: **error id · family · severity · recoverability · description · authority source · consumer guidance · registry location**.

| Error id | Family | Code | Severity | Fault | Recoverability | Authority source |
|----------|--------|------|:--------:|:-----:|----------------|------------------|
| ERR-VALIDATION-INPUT | Validation | `VALIDATION_FAILED` | MEDIUM | CALLER | RECOVERABLE | `meta-core/errors.ts` ValidationError; SEC-CTL-015; field-schemas |
| ERR-CONTROL-VALIDATION | Validation | `CONTROL_VALIDATION_FAILED` | MEDIUM | CALLER | RECOVERABLE | `control/errors.ts` ControlValidationError |
| ERR-NOT-FOUND | Resource | `NOT_FOUND` | LOW | CALLER | RECOVERABLE | `meta-core/errors.ts` SubstrateError(NOT_FOUND) |
| ERR-REGISTRY-CONFLICT | State/Registry | `REGISTRY_CONFLICT` | MEDIUM | CALLER | CONDITIONAL | `meta-core/errors.ts` REGISTRY_CONFLICT; CAP-19 |
| ERR-LIFECYCLE-VIOLATION | State/Registry | `LIFECYCLE_VIOLATION` | MEDIUM | CALLER | CONDITIONAL | `meta-core/errors.ts` LifecycleViolationError |
| ERR-RESOLUTION-FAILED | Resolution | `RESOLUTION_FAILED` | MEDIUM | SYSTEM | CONDITIONAL | `meta-core/errors.ts` ResolutionError |
| ERR-AUTHN-FAILED | Authentication | `AUTHENTICATION_FAILED` | HIGH | AUTHORITY | RECOVERABLE | `control/errors.ts` AuthenticationError; SEC-CTL-001/004/014; **S1** |
| ERR-AUTHZ-DENIED | Authorization | `AUTHORIZATION_DENIED` | HIGH | AUTHORITY | NON-RECOVERABLE-BY-CALLER | `control/errors.ts` AuthorizationError; SEC-CTL-002/003/013; **S1/S4** |
| ERR-TRUST-INSUFFICIENT | Authorization | `TRUST_INSUFFICIENT` | HIGH | AUTHORITY | CONDITIONAL | `control/errors.ts` TRUST_INSUFFICIENT; SEC-CTL-002 |
| ERR-GOVERNANCE-BLOCKED | Governance | `GOVERNANCE_BLOCKED` | HIGH | AUTHORITY | CONDITIONAL | `control/errors.ts` GOVERNANCE_BLOCKED; AD-0009; PI-6 |
| ERR-EXECUTION-FAILED | Runtime | `EXECUTION_FAILED` | HIGH | SYSTEM | CONDITIONAL | `meta-core/errors.ts` ExecutionError |

**Registry location** for every model: `contracts/errors/error-model-registry.json#/errorModels`.

## 2. Consumer guidance (summary)

- **Validation / control-validation:** correct the named field/attribute; do not retry unchanged.
- **Not-found:** verify identifier; absence is authoritative (never fabricated into an empty record).
- **Registry-conflict / lifecycle-violation:** resolve version/supersession or reconcile lifecycle; resubmit with a new semantic version.
- **Resolution / execution:** transient/system; safe-reads and idempotent writes may retry; non-idempotent creates reconcile state first.
- **Authn:** (re)authenticate.
- **Authz / trust / governance:** obtain a governed grant / elevate trust / route the change through approval + the Evolution commit path; do not retry unchanged.

## 3. Operations reference error models (acceptance criterion #2)

All **8/8** operations and **6/6** events are bound in `operationErrorBindings` / `eventErrorBindings`. Authn + Authz apply to every operation (S1, every boundary). Writes (`putConfigurationByScopeByKey`, `postRegistryArtifacts`) additionally carry trust, governance, conflict, and lifecycle models.

| operationId | # models | notable models |
|-------------|:--------:|----------------|
| getConfigurationByScope | 7 | not-found, resolution |
| putConfigurationByScopeByKey | 9 | conflict, lifecycle, trust, governance |
| getMetadataByClass | 6 | validation(param), not-found |
| getFeatureFlagsByContext | 7 | not-found, resolution |
| getRegistryArtifacts | 4 | authn, authz baseline |
| postRegistryArtifacts | 9 | conflict, lifecycle, trust, governance |
| getRegistryArtifactsById | 6 | validation(param), not-found |
| getRegistryDiscovery | 7 | not-found, resolution |

## 4. Out-of-boundary conditions (recorded, not bound)

`DEPENDENCY_CYCLE`, `COMPOSITION_FAILED`, `PLUGIN_LOAD_FAILED`, `LOADER_FAILED` are substrate composition/loader conditions not reachable at the API-018/API-027 request boundary. They are recorded under `outOfBoundary` and intentionally bound to **no** operation — preventing orphan/over-broad error classes.

## 5. Additive-evolution / boundary rules honored

- Codes are the ratified taxonomy's stable codes; no new codes minted.
- No HTTP status / framework type / serialization (Prompt 08 transport; Prompt 10 implementation).
- No field-schema redefinition (Prompt-05 authority); error payload shape deferred to transport/implementation.
- Conforms to `contracts/schema/error.schema.json` semantics (transport-neutral, `code` required, additive-only).

## Traceability

Refines `contracts/bindings/operation-payload-bindings.json`, `contracts/schema/error.schema.json`, `contracts/field-schemas/*`, `packages/platform-runtime/src/meta-core/errors.ts`, `packages/platform-runtime/src/control/errors.ts`, `UCOS-SEC-CONTROL-001`. Governed by `UCOS-SVC-POLICY-001`; AUTH-004/007/008; `UCOS-CONST-001` Art. IV/X. Evidence for `EV-PROMPT-09`.
