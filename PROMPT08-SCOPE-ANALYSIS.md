# PROMPT08-SCOPE-ANALYSIS

**Artifact:** PDATA-BIND-SCOPE-001
**Phase:** PHASE D.2 — Prompt-08 Operation→Payload Binding Authority Program (WS1)
**Authority:** Constitutional Program Compiler (registry sole source) + Data Architecture / Contract Authority.
**Determinism:** resolved from live compiler state, not prior interpretation.

---

## 1. Compiler-resolved status (recomputed, not assumed)

`ucos:authorize Prompt-08` → **AUTHORIZED** (all four checks pass):

| Check | Result |
|-------|:------:|
| registered | ✅ |
| dependencies-satisfied (Prompt-05 COMPLETE) | ✅ |
| required-evidence-known (EV-PROMPT-08) | ✅ |
| constitutional-gate-satisfied | ✅ |

At entry: next executable = **Prompt-08**; ready queue `[Prompt-08, ACT-11]`.

## 2. Scope of Prompt-08 (from `work-items.json`)

| Field | Value |
|-------|-------|
| **Purpose** | Bind every operation of the in-scope API contracts to its authored payload family (request, response) and bind every emitted event to its payload — closing the operation→payload gap the WI-07/WI-08 generator explicitly deferred (`emit/dto.ts`: "Operation binding deferred (Prompt 08)"). |
| **Dependencies** | `Prompt-08 → Prompt-05` (Prompt-05 COMPLETE — the 5 payload families are authored + VERIFIED). |
| **Acceptance criteria** | (1) operations bound to authored payloads; (2) **0 dangling operation references**. |
| **Completion criteria** | Every in-scope operation has request+response bindings; every event bound; every referenced family resolves in the field-schema registry; EV-PROMPT-08 ≥ VERIFIED; Prompt-08 COMPLETE. |
| **Evidence requirements** | `EV-PROMPT-08` (report + machine-readable binding artifact). |
| **Governance gate** | `GATE-DOC-001` (documentation gate — same class as Prompt-05). |
| **Constitutional constraint** | "Depends on Prompt-05 payloads." No external blocker, no constitutional lock, no independence requirement. |

## 3. Authorized scope boundary

Prompt-08 binds operations to payloads **that Prompt-05 authored** — i.e., the contracts whose
payload families exist in `contracts/field-schemas/`:

| In scope | Reason |
|----------|--------|
| **API-018** (DC-018): ConfigurationValue, MetadataRecord, FeatureFlag | families authored (Prompt-05) |
| **API-027** (DC-027): RegistryArtifact, DiscoveryRecord | families authored (Prompt-05) |

| Out of scope | Reason |
|--------------|--------|
| API-001..017, 019..026, 028..030 | their payload families are **not** authored; binding them would dangle (violates AC "0 dangling operation references") — those await their own field authority |
| Transport verbs, status codes, serialization, pagination mechanics | Prompt 08 platform/runtime |
| authn/authz, controls, error models | Prompt 09 |
| Field-level payload schemas | already owned by Prompt-05 (not re-authored here) |

## 4. What "binding" means here (design-authority, not code)

The operation meta-schema (`contracts/schema/operation.schema.json`) already provides the binding
slots: `request.bodyRef` and `responses[].bodyRef` → `schemaRef.ref` (a reference token to a payload
family). Prompt-08 populates these bindings authoritatively as **declarative data**
(`contracts/bindings/operation-payload-bindings.json`) referencing the authored field-schema ids.

Per the ABSOLUTE RULE: no code, no DTOs, no validators, no runtime behavior. The generator already
type-derives DTOs/validators from field schemas (Stage-3 SUFFICIENT); it is **not** modified here.

## 5. Method

WS2 inventories every operation and event of API-018/API-027 and the payload each carries.
WS3 authors the canonical operation→(request/response/event/registry) binding.
WS4 validates (all bound; 0 orphan/duplicate/circular/dangling).
WS5 performs governed registry integration (evidence + status) and recompiles.
WS6 reconciles the compiler (Prompt-08 COMPLETE? Prompt-09 READY?).

**Traceability:** `registry/program/{work-items,dependencies,evidence-registry}.json`; `contracts/schema/operation.schema.json`; `contracts/field-schemas/*`; `UCOS-CONTRACT-CAT-001`; AUTH-004/007/009; UCOS-CONST-001 (Art. IV).
