# PROMPT09-SCOPE-ANALYSIS

**Artifact:** PDATA-P09-SCOPE-001 (Prompt-09 WS1)
**Phase:** PHASE D.3 — Prompt-09 (Error Model & Security Authority Registry)
**Authority:** Contract Authority / Data Architecture; `GATE-DOC-001`.
**Resolution method:** Resolved **from Constitutional Program Compiler state**, not from prior discussion or historical roadmap. Source of truth: `registry/program/*.json` compiled by `tools/program-compiler`.
**Compiler determination:** `Prompt-09` = **next executable work item**, effective status **READY**, authorization **AUTHORIZED** (4/4 checks), `computedAt 2026-07-03T17:29:55Z`.

---

## 1. Purpose (compiler-declared, verbatim)

From `registry/program/work-items.json` → `Prompt-09`:

| Field | Value (compiler truth) |
|-------|------------------------|
| id | `Prompt-09` |
| title | **Error Model Registry** |
| type | `prompt` |
| phase | `Contract Authoring` |
| declaredStatus (pre-execution) | `OPEN` |
| owner | **Prompt 07 / Contract Authority** |
| priority | 42 |
| acceptanceCriteria | (1) *canonical error model registry authored*; (2) *operations reference error models* |
| requiredEvidence | `EV-PROMPT-09` (state `PENDING`) |
| governanceGates | `GATE-DOC-001` |
| constitutionalConstraints | *Depends on Prompt-08 bindings* |

**Security-authority scope is in-scope for Prompt-09, established from compiler outputs — not assumed:**
- `contracts/catalog/api-018.contract.json` and `…/api-027.contract.json` carry `"security": "FLAGGED FOR PROMPT 09"` (meta-schema placeholder `contract.schema.json#/$defs/placeholderState`).
- `EV-PROMPT-08` evidence note (`registry/program/evidence-registry.json`): *"Binding data only; transport=Prompt08 platform, **security=Prompt09**."*
- `PROMPT08-BINDING-SPECIFICATION.md` §4 rule 5 and `FIELD-AUTHORITY-SPECIFICATION.md` "Deliberate exclusions": *authn/authz, key material, control fields → Owning authority **Prompt 09***; *Error model fields → **Prompt 09 / Prompt-09 work item***.

Therefore Prompt-09's deliverable set is a **canonical Error Model Registry** and a **canonical Security Authority Registry**, both established as **authority metadata that references (does not redefine) the Prompt-08 bindings**. This matches the phase title *"ERROR MODEL & SECURITY AUTHORITY REGISTRY."*

## 2. Dependencies (from `registry/program/dependencies.json`)

| Edge | State |
|------|-------|
| `Prompt-09 → Prompt-08` | Prompt-08 **COMPLETE** (`EV-PROMPT-08` = `VERIFIED`) |
| (transitive) `Prompt-08 → Prompt-05` | Prompt-05 **COMPLETE** (`EV-PROMPT-05` = `VERIFIED`) |

All dependencies satisfied — this is why the compiler resolves `Prompt-09` as READY and AUTHORIZED. No dependency of `Prompt-09` is external-blocked; `Prompt-09` appears in no closure of `REAL-C-03/04/05` and in no `external-blockers.json` record.

## 3. Authority owner & boundaries

| Concern | Owner | Prompt-09 action |
|---------|-------|------------------|
| Field-level payload schemas (5 families) | Prompt-05 / `UCOS-PDATA-ARCH-001` | **Reference only** (by registry id); never redefine |
| Operation → payload bindings (16) | Prompt-08 / Contract Authority | **Reference only** (by `operationId` / event message) |
| Transport (verbs, status codes, serialization, pagination) | Prompt 08 platform | **Out of scope** — not bound |
| **Error models** | **Prompt-09** (this work item) | **Author canonical registry** |
| **Security authority** (authn/authz/trust/audit/integrity/non-repudiation/SoD) | **Prompt-09** (this work item), consuming ratified `UCOS-SEC-*` | **Author canonical registry** (authority metadata; references `SEC-CTL-001..020`) |
| Security *controls* / runtime enforcement | `UCOS-SEC-ARCH-001` + Prompt 10 (implementation) | **Out of scope** — reference, do not implement |
| NFR values (latency/throughput/availability/recovery) | ASR ratification (N-1) | **Out of scope** (`PENDING ASR RATIFICATION`) |

**ABSOLUTE RULE for this work item:** establish **authority registries only** — no DTOs, no validators, no runtime code, no security controls, no authorization logic. Grounding for error/security content is the *already-ratified* runtime error taxonomy and security control catalog (see §5); nothing is invented.

## 4. Compiler-authorized scope (the exact surface Prompt-09 must cover)

Derived from `contracts/bindings/operation-payload-bindings.json` (Prompt-08, VERIFIED) and `contracts/catalog/api-018|027.contract.json`.

**Contracts (2):** `API-018` (DC-018 / DOM-018 / **CAP-10** Configuration & Metadata) · `API-027` (DC-027 / DOM-027 / **CAP-19** Registry).

**Operations (8):**
| operationId | Contract | Kind |
|-------------|----------|------|
| getConfigurationByScope | API-018 | safe-read |
| putConfigurationByScopeByKey | API-018 | unsafe-idempotent (admin) |
| getMetadataByClass | API-018 | safe-read |
| getFeatureFlagsByContext | API-018 | safe-read |
| getRegistryArtifacts | API-027 | safe-read |
| postRegistryArtifacts | API-027 | unsafe-create |
| getRegistryArtifactsById | API-027 | safe-read |
| getRegistryDiscovery | API-027 | safe-read |

**Events (6):** `ConfigurationChanged`, `MetadataUpdated`, `FeatureFlagChanged` (EVT-018); `ArtifactRegistered`, `ArtifactSuperseded`, `ArtifactDiscovered` (EVT-027).

**Payload families (5):** `ConfigurationValue`, `MetadataRecord`, `FeatureFlag` (DC-018); `RegistryArtifact`, `DiscoveryRecord` (DC-027).

**Bindings (16):** 8 response + 2 request + 6 event bindings (`PROMPT08-BINDING-SPECIFICATION.md` §5).

## 5. Authority sources for grounded (non-invented) content

| Registry | Grounded in |
|----------|-------------|
| Error Model Registry | Ratified runtime error taxonomy: `packages/platform-runtime/src/meta-core/errors.ts` (`SubstrateErrorCode` ×10) and `…/src/control/errors.ts` (`ControlErrorCode` ×5); the contract meta-schema `contracts/schema/error.schema.json`; field-schema constraints (`contracts/field-schemas/*`). |
| Security Authority Registry | Ratified `UCOS-SEC-CONTROL-001` (`SEC-CTL-001..020`), `UCOS-SEC-TRACE-001` (trust boundaries `TB-01..10`, checkpoints `S1..S7`), `AUTH-008` non-waivable **S1/S3/S4**, `UCOS-CONST-001` Part X. |

## 6. Acceptance criteria (compiler) → Prompt-09 satisfaction plan

| Acceptance criterion | Satisfied by |
|----------------------|--------------|
| canonical error model registry authored | WS3 → `contracts/errors/error-model-registry.json` + `PROMPT09-ERROR-REGISTRY.md` |
| operations reference error models | WS3 registry `operationErrorBindings` mapping all 8 operations + 6 events to error models |
| (title-scope) canonical security authority registry | WS5 → `contracts/security/security-authority-registry.json` + `PROMPT09-SECURITY-REGISTRY.md` |

## 7. Completion criteria

Prompt-09 is COMPLETE when: (a) both canonical registries exist; (b) every in-scope operation/event references ≥1 error model and exactly one security-authority profile; (c) validation (WS6) passes with 0 orphan error classes / 0 duplicate authorities / 0 circular references; (d) `EV-PROMPT-09` advanced to `VERIFIED`; (e) the compiler recompiles with `Prompt-09` effective status COMPLETE, `GAP-PROMPT-09` CLOSED, and `ucos:verify` PASS.

## 8. Evidence requirements

`EV-PROMPT-09`: artifact = `contracts/errors/error-model-registry.json` + `contracts/security/security-authority-registry.json`; report = `PROMPT09-ERROR-REGISTRY.md`, `PROMPT09-SECURITY-REGISTRY.md`, `PROMPT09-VALIDATION.md`, `PROMPT09-COMPLETION-REPORT.md`. Gate `GATE-DOC-001`; contract/data authority; **no external independence requirement** (consistent with `EV-PROMPT-05`/`EV-PROMPT-08`). Target state `VERIFIED`.

## 9. Explicitly out of scope (authority boundaries honored)

Transport/status/serialization/pagination (Prompt 08 platform); field-schema redefinition (Prompt-05); security-control implementation & authorization logic (Prompt 10 / `UCOS-SEC-ARCH-001`); NFR values (ASR/N-1); the Article IX generation lock is **unaffected** — this work item authors governance/authority metadata only and generates no fabric source.

## Traceability

Subordinate to AUTH-001..012, `UCOS-CONST-001` (Art. IV, Art. X), `UCOS-ASR-NFR-001` (INV-1..13), AUTH-012 (AD-0001..0023). Computed by `PROG-ARCH-001`. Consumes `contracts/bindings/operation-payload-bindings.json`, `contracts/catalog/api-018|027.contract.json`, `contracts/field-schemas/*`, `contracts/schema/error.schema.json`, `UCOS-SEC-CONTROL-001`, `UCOS-SEC-TRACE-001`, `AUTH-008`.
