# CONTRACT-SDK-GENERATOR-ARCHITECTURE

| Field | Value |
|-------|-------|
| Artifact | **Contract-SDK Generator — Architecture & Design** |
| Work Item | **PHASE 11 — WI-05** (Contract-SDK Foundation) |
| Branch | `phase-11-contracts-sdk` |
| Frozen Baseline | `56a32d3` · Tag `ucost-baseline-green-284` |
| Mode | **DESIGN ONLY** — no generator code, no generated SDK code in this WI |
| Status | Design for a subsequent authorized implementation phase |
| Date | 2026-07-03 |
| Traceability | `UCOS-CONTRACT-CAT-001` · `UCOS-SVC-ARCH-001` · `UCOS-SVC-POLICY-001` · IC-2 · `AD-0016` |

> **Constitutional constraints (inherited from WI-05 non-negotiables).** The generator design below MUST NOT
> imply any modification to runtime behavior, existing contract semantics, `platform-runtime` contract
> execution, or the contract catalog. `contracts-sdk` is **generated-only** and **never hand-authored**
> (per its README + IC-2). This document designs *how* generation will work; it does **not** generate.

---

## 1. Purpose

Design a deterministic, catalog-driven generator, `tools/contract-generator/`, that transforms the ratified
service **Contract Catalog** (`UCOS-CONTRACT-CAT-001`) into a **source-only TypeScript SDK** under
`packages/contracts-sdk/generated/`, consumable with **no build step** (Node ≥ 23.6 native type stripping),
matching the repository conventions documented in `CONTRACT-SDK-ANALYSIS.md`.

**PI-1 generation scope:** `UCOS-API-CONTRACT-018` and `UCOS-API-CONTRACT-027` only.

---

## 2. Placement & Boundaries

```
tools/
  contract-generator/          # the generator (design target; not built in WI-05)
    src/                        # generator implementation (erasable TS, source-run)
    templates/                  # emit templates (string/AST builders)
    README.md
contracts/
  catalog/                     # machine-readable extraction inventory (WI-05 TASK 2 output)
    api-018.contract.json      # canonical generator INPUT
    api-027.contract.json
packages/
  contracts-sdk/               # generator OUTPUT root (structure-only in WI-05)
    generated/                 # emitted artifacts land here (empty in WI-05)
    src/                       # stable, non-generated barrel/re-export surface (empty in WI-05)
```

**Boundary rules:**
- The generator **reads** `contracts/catalog/*.contract.json` (and, upstream, `UCOS-CONTRACT-CAT-001`).
- The generator **writes only** into `packages/contracts-sdk/generated/`.
- The generator **never writes** into `packages/platform-runtime/` or `specifications/`.
- Generated files carry a **provenance header** (source contract id + catalog version + `DO NOT EDIT`).

---

## 3. Input Contract

**Primary input:** the machine-readable inventory produced in TASK 2
(`contracts/catalog/api-018.contract.json`, `api-027.contract.json`).

**Why an intermediate inventory instead of parsing Markdown directly:**
- The catalog (`UCOS-CONTRACT-CATALOG.md`) is prose + tables authored for humans. Parsing Markdown in the
  generator would couple generation to document formatting and risk silent drift.
- The inventory is a **stable, reviewable, diffable** projection of catalog facts, extracted once (TASK 2)
  and validated. It is the **canonical machine boundary**.
- Regeneration reproducibility: given the same inventory, the generator emits byte-identical output
  (determinism requirement, §7).

**Input invariant (NO-ASSUMPTION rule):** every emitted symbol must trace to a field present in the inventory.
The inventory explicitly records `fieldLevelSchema: "NOT DEFINED IN CATALOG"`. Therefore the generator MUST
**NOT** fabricate request/response field schemas; it emits **opaque, catalog-faithful** payload references
(see §5.2) until Prompt 05/08 supply field-level schemas.

---

## 4. Generation Pipeline

```
                 ┌──────────────────────────────────────────────────────────┐
                 │  UCOS-CONTRACT-CAT-001  (specifications/contracts/*.md)    │
                 │  human-ratified service contract catalog (READ-ONLY)      │
                 └───────────────────────────┬──────────────────────────────┘
                                             │  (TASK 2 extraction — done once, reviewed)
                                             ▼
                 ┌──────────────────────────────────────────────────────────┐
   INPUT         │  contracts/catalog/api-0NN.contract.json                  │
                 │  machine-readable inventory (canonical generator input)   │
                 └───────────────────────────┬──────────────────────────────┘
                                             ▼
   STAGE 1  ┌────────────┐   load + validate inventory against inventory format;
   MODEL    │  Catalog   │   build in-memory Contract Model (normalized, typed);
            │  → Model   │   fail closed on unknown/missing required fields.
            └─────┬──────┘
                  ▼
   STAGE 2  ┌────────────┐   emit payload-family reference types + operation
   DTO      │  Model     │   input/output *references* (opaque where schema
            │  → DTO     │   undefined). Type-only, erasable.
            └─────┬──────┘
                  ▼
   STAGE 3  ┌────────────┐   emit runtime validators bound to whatever schema is
   VALIDATOR│  DTO       │   KNOWN. Where field schema is undefined, emit a
            │ →Validator │   pass-through/identity guard that asserts shape presence
            └─────┬──────┘   only (never invents constraints).
                  ▼
   STAGE 4  ┌────────────┐   emit a typed Client: one method per catalog operation,
   CLIENT   │ Validator  │   transport-agnostic (pluggable transport port). Verb
            │  → Client  │   semantics + path templates come from the inventory.
            └─────┬──────┘
                  ▼
   STAGE 5  ┌────────────┐   emit a Server Stub: operation handler interface +
   SERVER   │ Client     │   dispatch skeleton. No business logic; throws
   STUB     │ →ServerStub│   "not implemented" until an owner supplies handlers.
            └─────┬──────┘
                  ▼
   OUTPUT   ┌──────────────────────────────────────────────────────────────┐
            │  packages/contracts-sdk/generated/<contract>/                 │
            │    model.ts · dto.ts · validators.ts · client.ts · server.ts  │
            │    index.ts (barrel)                                          │
            └──────────────────────────────────────────────────────────────┘
```

### Stage responsibilities

| Stage | Input | Output | Determinism rule |
|-------|-------|--------|------------------|
| 1 — **Model** | inventory JSON | normalized `ContractModel` (in-memory) | reject unknown fields; no defaults invented |
| 2 — **DTO** | `ContractModel` | `dto.ts` (type-only) | payload families → named type aliases; undefined field-schema → `unknown`-based opaque alias with provenance comment |
| 3 — **Validator** | `ContractModel` + DTO | `validators.ts` | validators only encode **known** constraints; unknown → presence/identity guard |
| 4 — **Client** | `ContractModel` + DTO | `client.ts` | one method per operation; transport injected via port; path templates verbatim from inventory |
| 5 — **Server Stub** | `ContractModel` + DTO | `server.ts` | handler interface + dispatcher; default handlers throw `NotImplemented` |

---

## 5. Output Model

### 5.1 File layout per contract

```
packages/contracts-sdk/generated/
  api-018-configuration-metadata/
    model.ts        # operation + event descriptors (data, from inventory)
    dto.ts          # payload-family + operation I/O reference types
    validators.ts   # runtime guards (known constraints only)
    client.ts       # ConfigurationMetadataClient (transport-agnostic)
    server.ts       # ConfigurationMetadataServer stub (handler interface + dispatch)
    index.ts        # barrel re-export
  api-027-registry/
    ... (same shape)
  index.ts          # top-level barrel across generated contracts
```

### 5.2 Handling of undefined field-level schema (critical)

The inventory records that the catalog defines **no field-level schema** (payloads reference `PDE-*`/`LDO-*`
owned by Prompt 05; wire form deferred to Prompt 08). The generator therefore emits, for example:

- DTO: `export type ConfigurationValue = unknown; // UCOS-DATA-CONTRACT-018 payload family; field schema NOT DEFINED IN CATALOG (Prompt 05)`
- Validator: a guard that verifies the value is present/defined only — it asserts **no invented constraints**.

This preserves NON-NEGOTIABLE RULES 6 (no hard coding) and 7 (no assumptions): the SDK is **shape-honest** and
becomes richer *only* when the catalog/data-architecture supplies real schemas, at which point regeneration
tightens the types with **zero hand-editing**.

### 5.3 Transport neutrality

The catalog explicitly selects **no** transport, serialization, or protocol (deferred to Prompt 08). The
generated `Client`/`Server` therefore depend on an injected **transport port** interface (a function
`(request) => Promise<response>` shape), not on any HTTP/gRPC library. This keeps generated code faithful to
the catalog's technology-neutral stance and dependency-free (matching the zero-runtime-dependency model).

---

## 6. Provenance & Traceability

Every generated file begins with a machine-parseable header, e.g.:

```ts
/**
 * GENERATED — DO NOT EDIT.
 * Source: UCOS-API-CONTRACT-018 (Configuration & Metadata API v1.0)
 * Catalog: UCOS-CONTRACT-CAT-001 v1.0.0
 * Inventory: contracts/catalog/api-018.contract.json
 * Generator: tools/contract-generator vX.Y.Z
 * Regenerate via governed versioning (UCOS-SVC-POLICY-001); never hand-edit.
 */
```

A generation **manifest** (`generated/GENERATION-MANIFEST.json`) records, per file: source contract id, catalog
version, inventory hash, generator version, and emit timestamp — enabling drift detection (regenerate → diff
must be empty unless the inventory changed).

---

## 7. Determinism & Idempotency Requirements

1. **Pure function of input:** output is a deterministic function of `(inventory, generator-version)`.
2. **Stable ordering:** operations, properties, and files emitted in a fixed, sorted order.
3. **Idempotent:** re-running with an unchanged inventory yields a byte-identical tree (empty diff).
4. **Fail-closed:** any inventory field the generator does not recognize aborts generation with a clear error;
   the generator never guesses.

---

## 8. Governance & Regeneration Workflow

```
Contract change request
  → amend UCOS-CONTRACT-CAT-001 via UCOS-SVC-POLICY-001 (governed versioning)
  → re-extract contracts/catalog/*.contract.json (reviewed diff)
  → run tools/contract-generator
  → generated/ diff reviewed + committed (never hand-edited)
  → contracts-sdk consumers pick up new source (no publish/build)
```

Hand-editing anything under `generated/` is prohibited (README + IC-2). The generator is the **only** writer.

---

## 9. Non-Goals (explicitly out of scope for the generator design)

- No transport/protocol selection (Prompt 08 owns this).
- No security controls, authn/authz, or rate-limiting (Prompt 09 owns this — all surfaces `FLAGGED FOR PROMPT 09`).
- No field-level persistence schema authoring (Prompt 05 / `UCOS-PDATA-ARCH-001` owns this).
- No modification of `platform-runtime` runtime types (`types.ts`) — FACT 2 boundary.
- No NFR value fabrication — all NFRs remain `PENDING ASR RATIFICATION`.

---

## 10. Compatibility with Repository Conventions

| Convention (from CONTRACT-SDK-ANALYSIS) | Generator design honors it by |
|-----------------------------------------|-------------------------------|
| No build / native TS execution | Emitting erasable-syntax `.ts` only; no `enum`/`namespace` |
| NodeNext ESM, `.ts` import specifiers | Emitting relative imports with `.ts` extensions |
| `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax` | Emitting strict-safe code; `import type`/`export type` for types |
| Zero runtime dependencies | Transport injected via port; validators hand-emitted (no schema lib) |
| Private, source-consumed | `contracts-sdk` stays `private`/`UNLICENSED`; no publish target |
| Package-scoped tsconfig | Generated files live under `contracts-sdk` include globs |

---

## 11. Summary

The generator is a **deterministic, fail-closed, catalog-faithful** transformer:
`Catalog → Model → DTO → Validator → Client → Server Stub`, reading the reviewed machine inventory and writing
only into `packages/contracts-sdk/generated/`. It fabricates nothing the catalog does not state, emits
source-only erasable TypeScript with full provenance, and is safe to (re)run without touching runtime, catalog,
or the 284-test baseline. Implementation of the generator and emission of SDK code are **deferred to a
subsequent authorized phase**.

**END CONTRACT-SDK-GENERATOR-ARCHITECTURE (Design-only · Additive · Baseline `56a32d3`).**
