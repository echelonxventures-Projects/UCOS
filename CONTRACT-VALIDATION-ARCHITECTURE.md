# CONTRACT-VALIDATION-ARCHITECTURE

| Field | Value |
|-------|-------|
| Artifact | **Contract Validation Architecture** |
| Work Item | **PHASE 12 — WI-06** (Contract Meta-Schema & Canonical Generator Model) |
| Branch | `phase-11-contracts-sdk` |
| Frozen Baseline | `56a32d3` · Tag `ucost-baseline-green-284` |
| Mode | **DESIGN ONLY** — no validator implementation, no generator logic |
| Date | 2026-07-03 |
| Traceability | `UCOS-CONTRACT-CAT-001` · `UCOS-SVC-ARCH-001` · `UCOS-SVC-POLICY-001` · IC-2 |
| Depends on | `contracts/schema/*.schema.json`, `tools/contract-generator/model/*.ts` |

> **Purpose.** Define the **fail-closed** validation pipeline that any future generator (WI-07) MUST run
> before it is permitted to emit a single line of SDK code. Validation is the gate that guarantees generation
> is catalog-faithful, deterministic, and free of invented behavior.

---

## 1. Validation Principle: Fail-Closed by Default

> **A generator MUST refuse to run unless every validation stage passes. Silence, ambiguity, or an
> unrecognized field is treated as failure — never as an implicit default.**

Concretely:
- Every stage has an explicit **PASS / FAIL** verdict. There is no "warn and continue".
- Unknown/extra fields → **FAIL** (schemas use `additionalProperties: false`).
- Missing required fields → **FAIL**.
- A non-placeholder value where the catalog defined none → **FAIL** (guards against invention).
- Any exception, parse error, or unresolved reference → **FAIL** (aborts the whole run).

---

## 2. Four-Stage Pipeline

```
┌───────────────────────────────────────────────────────────────────────────┐
│ STAGE 0 · SOURCE OF RECORD                                                  │
│   specifications/contracts/UCOS-CONTRACT-CATALOG.md  (UCOS-CONTRACT-CAT-001)│
│   READ-ONLY. Never mutated by validation or generation.                     │
└───────────────────────────────┬───────────────────────────────────────────┘
                                 │ (human/governed extraction — WI-05)
                                 ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ INPUT · CONTRACT INVENTORY                                                  │
│   contracts/catalog/api-0NN.contract.json                                   │
└───────────────────────────────┬───────────────────────────────────────────┘
                                 ▼
   STAGE 1 · SCHEMA VALIDATION ......... structural conformance to meta-schema
                                 ▼
   STAGE 2 · CANONICAL MODEL VALIDATION  normalize → semantic invariants
                                 ▼
   STAGE 3 · GENERATOR INPUT VALIDATION  per-target sufficiency (fail-closed gate)
                                 ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ VERDICT · GENERATE / REFUSE                                                 │
│   All stages PASS → generation of the SUFFICIENT targets is permitted.      │
│   Any stage FAIL → refuse; emit a machine-readable validation report.       │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Stage 1 — Schema Validation

**Input:** `contracts/catalog/*.contract.json`
**Against:** `contracts/schema/contract.schema.json` (+ referenced `operation/request/response/error`).
**Dialect:** JSON Schema draft 2020-12 (declared via each file's `dialect` field; the remote dialect keyword
is intentionally omitted to keep artifacts offline/deterministic).

| Check | Rule | Verdict on violation |
|-------|------|----------------------|
| Parse | File is valid JSON | FAIL |
| Envelope | `inventoryFormat` matches pattern, `inventoryKind` in enum | FAIL |
| Required fields | `contract.{id,title,version}`; `operation.{verbSemantics,path,intent}` | FAIL |
| Closed shape | No `additionalProperties` at any object level | FAIL |
| Enums | `verbSemantics`, `kind`, `contractKind`, `outcome`, `placeholderState` values in enum | FAIL |
| Placeholders | Deferred values are one of the three `PlaceholderState` tokens | FAIL if a bare invented value appears |

**Evidence (WI-06):** both `api-018` and `api-027` inventories were structurally checked against the
meta-schema and passed with **0 failures** (see `PHASE-12-*-REPORT` §Validation and the WI-06 conformance run).

---

## 4. Stage 2 — Canonical Model Validation

**Input:** Stage-1-valid inventory.
**Produces:** an in-memory `ContractModel` (`tools/contract-generator/model/ContractModel.ts`).
**Validates semantic invariants** that JSON Schema alone cannot express:

| Invariant | Description | Verdict |
|-----------|-------------|---------|
| Meta-version pin | `metaSchemaVersion === "ucos-contract-meta/1.0.0"` | FAIL on mismatch |
| Kind consistency | `contractKind` present ⇒ required sub-block present (`api`⇒`operations`, `event`⇒`emits.messages`, `data`⇒`dataContractDetail`) | FAIL |
| Derived-field integrity | `operation.kind`, if present, equals the deterministic normalization of `verbSemantics` (GET→safe-read, PUT/PATCH→unsafe-idempotent, POST→unsafe-create, DELETE→unsafe-delete) | FAIL on contradiction |
| Reference resolvability | Every `SchemaRef.ref` / `payloadRef.dataContract` resolves to a known artifact or is an explicit placeholder | FAIL on dangling reference |
| Placeholder purity | A field is EITHER concrete OR a `PlaceholderState` — never a fabricated concrete value standing in for a deferral | FAIL |
| Determinism | Normalization is a pure function of input (stable ordering, no clock/random) | FAIL if non-deterministic input detected |

**Key rule (NO INVENTION):** Stage 2 never fills a deferred field. If the catalog said
`NOT DEFINED IN CATALOG`, the model carries exactly that. Stage 2 only *checks*; it does not *complete*.

---

## 5. Stage 3 — Generator Input Validation (Sufficiency Gate)

**Input:** Stage-2-valid `ContractModel`.
**Purpose:** decide, **per generation target**, whether enough information exists to generate **faithfully**.
This is the fail-closed gate that prevents emitting fabricated code.

| Target | Requires | If requirement absent |
|--------|----------|-----------------------|
| **DTOs** | concrete field-level payload schema (`bodyRef` resolves to a real `SchemaRef`) | Target **BLOCKED** — emit nothing; record gap |
| **Validators** | same field-level schema + declared constraints | Target **BLOCKED** |
| **Clients** | stable `operationId` (or deterministic derivation) + path template + verb semantics | Path/verb present ⇒ **skeleton-eligible**; body typing BLOCKED until schema exists |
| **Server Stubs** | operation set + handler signatures (types may be opaque) | **skeleton-eligible** with `NotImplemented` handlers |

**Verdict model (per target):**
- `SUFFICIENT` → generation of that target permitted.
- `PARTIAL` → only the transport-neutral skeleton is permitted (opaque payloads); typed bodies deferred.
- `BLOCKED` → generation refused for that target; the exact missing inputs are recorded.

> The concrete WI-06 determination of SUFFICIENT/PARTIAL/BLOCKED for API-018 and API-027 is in
> `GENERATOR-READINESS-GAP-REPORT.md`.

---

## 6. Validation Report (machine-readable, deterministic)

Every run emits a report with, per contract and per stage: verdict, failures (path + reason), and per-target
sufficiency. The report is:
- **Deterministic** — identical input ⇒ identical report (stable ordering, no timestamps in the hashed body).
- **Fail-closed** — presence of any FAIL sets the top-level verdict to FAIL and blocks generation entirely.
- **Traceable** — each failure cites the schema/model rule and the source contract id.

```
{
  "verdict": "PASS | FAIL",
  "metaSchemaVersion": "ucos-contract-meta/1.0.0",
  "contracts": [
    {
      "id": "UCOS-API-CONTRACT-018",
      "stage1_schema": "PASS | FAIL",
      "stage2_model":  "PASS | FAIL",
      "stage3_targets": {
        "dtos": "SUFFICIENT | PARTIAL | BLOCKED",
        "validators": "...",
        "clients": "...",
        "serverStubs": "..."
      },
      "failures": []
    }
  ]
}
```

---

## 7. Failure Handling & Rollback

- **Abort-on-first-fatal:** parse/reference/meta-version failures abort the entire run (no partial output).
- **No partial writes:** generation (WI-07) writes only after ALL stages PASS; a failed validation produces
  **zero** file mutations under `packages/contracts-sdk/generated/`.
- **Idempotent re-run:** re-validating unchanged inputs yields an identical verdict and report.
- **Governed change path:** to change a validation outcome, amend the catalog via `UCOS-SVC-POLICY-001`,
  re-extract the inventory, and re-run — never hand-edit generated code or loosen a schema silently.

---

## 8. Placement (design targets for WI-07; not created in WI-06)

```
tools/contract-generator/
  model/                         # WI-06: canonical model types (DONE)
  validate/                      # WI-07: validator implementation (DESIGN ONLY here)
    stage1-schema.ts             #   structural (meta-schema) validation
    stage2-model.ts              #   canonical-model semantic invariants
    stage3-generator-input.ts    #   per-target sufficiency gate
    report.ts                    #   deterministic validation report
```

WI-06 delivers the **types and rules**; WI-07 implements the validators and the generator behind this gate.

---

## 9. Summary

- Validation is a **four-stage, fail-closed** pipeline: Catalog → Schema → Canonical Model → Generator Input.
- Each stage has explicit PASS/FAIL semantics; unknowns and invented values are failures.
- The sufficiency gate (Stage 3) produces per-target `SUFFICIENT | PARTIAL | BLOCKED`, ensuring no fabricated
  code is ever emitted for deferred information.
- Reports are deterministic and traceable; failed validation yields zero output.

**END CONTRACT-VALIDATION-ARCHITECTURE (Design-only · Fail-closed · Additive · Baseline `56a32d3`).**
