# GENERATOR-READINESS-GAP-REPORT

| Field | Value |
|-------|-------|
| Artifact | **Generator Readiness & Gap Report** |
| Work Item | **PHASE 12 — WI-06** (Contract Meta-Schema & Canonical Generator Model) |
| Branch | `phase-11-contracts-sdk` |
| Frozen Baseline | `56a32d3` · Tag `ucost-baseline-green-284` |
| Scope of assessment | `UCOS-API-CONTRACT-018`, `UCOS-API-CONTRACT-027` |
| Method | Stage-3 sufficiency gate (see `CONTRACT-VALIDATION-ARCHITECTURE.md` §5) |
| Mode | **ASSESSMENT ONLY** — missing information is documented, **never invented** |
| Date | 2026-07-03 |
| Traceability | `UCOS-CONTRACT-CAT-001` · `UCOS-SVC-ARCH-001` · IC-2 |

> **Question answered.** Do API-018 and API-027, as represented in `contracts/catalog/*.contract.json`,
> contain **sufficient information** to generate **DTOs**, **validators**, **clients**, and **server stubs**?
> Where not, the **exact** missing inputs are listed. Nothing is fabricated to close a gap.

---

## 1. Sufficiency Verdict Matrix

Legend: **SUFFICIENT** = full faithful generation possible · **PARTIAL** = transport-neutral skeleton only
(opaque payloads) · **BLOCKED** = cannot generate faithfully; inputs missing.

| Target | API-018 (Configuration & Metadata) | API-027 (Registry) |
|--------|:----------------------------------:|:------------------:|
| **DTOs** | **BLOCKED** | **BLOCKED** |
| **Validators** | **BLOCKED** | **BLOCKED** |
| **Clients** | **PARTIAL** | **PARTIAL** |
| **Server Stubs** | **PARTIAL** | **PARTIAL** |

**Overall readiness:** **PARTIAL** — skeletons are generatable now; typed payload artifacts are blocked
pending field-level schemas that the catalog defers by design.

---

## 2. What IS present (sufficient inputs)

Both contracts provide, verbatim from the catalog:
- Contract identity: `id`, `title`, `version`, `producer`, `domain`, `capability`, `dataContract`.
- Operation set: `verbSemantics` + `path` template + `intent` for every operation (4 each).
- Derived `kind` per operation (safe-read / unsafe-create / unsafe-idempotent).
- Consumers, seam/ECR linkage, emitted event contract + message names.
- NFR block (`PENDING ASR RATIFICATION`), security posture (`FLAGGED FOR PROMPT 09`).
- Data contract reference + payload family **names** (`ConfigurationValue`, `MetadataRecord`, `FeatureFlag`
  for 018; `RegistryArtifact`, `DiscoveryRecord` for 027).

This is sufficient to generate **transport-neutral skeletons**: client method-per-operation signatures with
path templates and a pluggable transport port, and server handler interfaces with `NotImplemented` dispatch.

---

## 3. What is MISSING (exact gaps — recorded, not invented)

### 3.1 Blocks DTO + Validator generation (both contracts)

| # | Missing input | Consequence | Catalog owner / status |
|---|---------------|-------------|------------------------|
| G1 | **Field-level payload schema** for every payload family | Cannot define DTO fields, types, or required/optional; cannot emit constraints | `dataContractDetail.fieldLevelSchema = "NOT DEFINED IN CATALOG"` → Prompt 05 / `UCOS-PDATA-ARCH-001` |
| G2 | **Request body schema** per unsafe operation (e.g. `PUT /configuration/{scope}/{key}`, `POST /registry/artifacts`) | No request DTO; no request validator | Deferred (Prompt 05/08) |
| G3 | **Response body schema** per operation + result shape | No response DTO; no response validator | Deferred (Prompt 05/08) |
| G4 | **Path/query parameter types** (`{scope}`, `{key}`, `{class}`, `{context}`, `{id}`, `?type=`) | Parameters known by name/position only; cannot type them | Deferred (Prompt 05/08) |
| G5 | **Error model** (codes, shapes) | No error DTOs; no error handling contract | Not present in catalog at all |

### 3.2 Reduces Client/Server from SUFFICIENT to PARTIAL (both contracts)

| # | Missing input | Consequence | Catalog owner / status |
|---|---------------|-------------|------------------------|
| G6 | Stable `operationId` | Client method / handler names must be **deterministically derived** (from verb + path), not taken from catalog | Not defined; derivation rule owned by WI-07 generator |
| G7 | Concrete **pagination** parameters for list ops (`GET /registry/artifacts`, `GET /configuration/{scope}`) | List client cannot expose typed cursor params | Catalog states a generic cursor obligation only |
| G8 | **Idempotency-key** binding for unsafe ops | Cannot enforce/typed-declare idempotency | Declared only as a global convention; not per-op for 018/027 |
| G9 | **Transport / serialization / content-type** | Client/server must remain transport-agnostic (injected port) | Deferred (Prompt 08) |
| G10 | **Auth / authz / rate-limiting** | No security scaffolding may be emitted | `FLAGGED FOR PROMPT 09` |

### 3.3 Event-side (informational)

| # | Missing input | Consequence | Status |
|---|---------------|-------------|--------|
| G11 | Concrete `PEV-*` linkage + event payload schemas + delivery semantics | Cannot generate typed event DTOs/publishers | Bound during Phase 9.1/validation reconciliation |

---

## 4. Per-Operation Detail

### API-018 — Configuration & Metadata
| Operation | Client | Server | DTO/Validator | Blocking gaps |
|-----------|:------:|:------:|:-------------:|---------------|
| `GET /configuration/{scope}` | PARTIAL | PARTIAL | BLOCKED | G1,G3,G4 |
| `PUT /configuration/{scope}/{key}` | PARTIAL | PARTIAL | BLOCKED | G1,G2,G3,G4,G8 |
| `GET /metadata/{class}` | PARTIAL | PARTIAL | BLOCKED | G1,G3,G4 |
| `GET /feature-flags/{context}` | PARTIAL | PARTIAL | BLOCKED | G1,G3,G4 |

### API-027 — Registry
| Operation | Client | Server | DTO/Validator | Blocking gaps |
|-----------|:------:|:------:|:-------------:|---------------|
| `GET /registry/artifacts` | PARTIAL | PARTIAL | BLOCKED | G1,G3,G4,G7 |
| `POST /registry/artifacts` | PARTIAL | PARTIAL | BLOCKED | G1,G2,G3,G4,G8 |
| `GET /registry/artifacts/{id}` | PARTIAL | PARTIAL | BLOCKED | G1,G3,G4 |
| `GET /registry/discovery?type=` | PARTIAL | PARTIAL | BLOCKED | G1,G3,G4 |

---

## 5. What WI-07 MAY generate now (without invention)

Under the Stage-3 `PARTIAL` verdict, a generator may emit **only**:
1. **Client skeleton** — one typed method per operation, keyed by a **deterministically derived** `operationId`
   (documented rule: `verb + normalized path segments`), taking/returning **opaque** payload types
   (`unknown`-based aliases with provenance comments) and using an injected transport port.
2. **Server stub** — a handler interface (one method per operation) + a dispatcher whose default handlers
   throw `NotImplemented`. No business logic.
3. **Model/descriptor artifacts** — operation + event descriptors carrying the catalog-faithful metadata
   already present in the inventory.

It **may NOT** emit typed DTO fields, request/response/error schemas, validators with constraints, pagination
parameter types, idempotency enforcement, transport bindings, or security controls — all are BLOCKED by the
gaps in §3 and would require invention.

---

## 6. Unblock Path (governed, additive)

| Gap group | Unblocked by | Then enables |
|-----------|--------------|--------------|
| G1–G5 (field schemas, errors) | `UCOS-PDATA-ARCH-001` field-level schemas (Prompt 05); error model authored + ratified | DTOs, validators |
| G7–G8 (pagination, idempotency) | Concrete params/binding in a governed catalog update (`UCOS-SVC-POLICY-001`) | Typed list clients, idempotency enforcement |
| G9 (transport/serialization) | Prompt 08 runtime/transport decisions | Concrete client/server transport |
| G10 (security) | Prompt 09 security controls | Auth/authz scaffolding |
| G11 (events) | Phase 9.1 `PEV` binding + event payload schemas | Typed event DTOs/publishers |

Each unblock is applied by **amending the catalog → re-extracting the inventory → re-running validation →
regenerating**. No hand-authoring.

---

## 7. Determination

- **API-018 & API-027 are SUFFICIENT for skeleton generation (clients + server stubs) — PARTIAL.**
- **They are INSUFFICIENT for DTOs and validators — BLOCKED** — solely because the catalog defers field-level
  schemas by design. This is expected and correct; it is **not** a WI-06 defect.
- **No missing information was invented.** All gaps are recorded with their governed owner.

This report is the authoritative input to the WI-07 GO/NO-GO (see final report §5).

**END GENERATOR-READINESS-GAP-REPORT (Assessment-only · No invention · Baseline `56a32d3`).**
