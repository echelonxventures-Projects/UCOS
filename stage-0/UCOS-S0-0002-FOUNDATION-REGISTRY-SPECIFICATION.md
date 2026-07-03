# UCOS-S0-0002 — Foundation Registry Specification

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-S0-0002` |
| Program | **UCOS Stage 0 — Foundation Implementation Package** |
| Phase | S0-2 — Foundation Registries |
| Mode | **IMPLEMENTATION PLANNING ONLY** — specifies the Stage-0 registry surfaces of the realized MCR and their seed/reference content drawn verbatim from the frozen corpus. No code, schema, API, requirement, RC class, invariant, governance, or authority produced or modified. |
| Status | STAGE-0 SPECIFICATION (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EXEC-0001` (EX-1..EX-5, CF, F-4/F-8); `UCOS-IR-0005 §3` (7 registries); `UCOS-IR-0003` (fabrics); `UCOS-EP-0001` (WBS); `UCOS-S0-0001` (repo blueprint) |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX lock **ACTIVE**; **`UCOS-CONSTRUCTION-BLOCKED` stands**. Registry content is **data, not code** (IP-04). No new registry class is invented beyond the corpus registry set. |

---

## 0. Purpose & standing

Defines the **foundation registries** required for Stage 0. Registries are the sole mechanism by which a governed
construct becomes **addressable, described, configured, identified, and authorized** (`UCOS-IR-0005 §3`). This
document maps the six registries named in the Stage-0 package — **Authority, Invariant, Capability, Configuration,
Fabric, Identity** — onto the **seven registries of record** (`UCOS-IR-0005 §3`) plus the frozen reference sets
they are seeded from. It **invents no new registry class**; each is either a registry-of-record or a
registry/metadata *view* over frozen content, populated by **seed reference records** (data). Writing runtime
registry records is gated on G0 = PASS; authoring seed specifications is a permitted planning activity.

---

## 1. Registry-of-record baseline (`UCOS-IR-0005 §3`)

| # | Registry of record | Content | Binding basis | State |
|:-:|--------------------|---------|---------------|:-----:|
| R1 | **RegistryPort** | All addressable constructs `id@version` | RC-024/041; PEP-001 | EXISTS |
| R2 | **MetadataPort** | Descriptions/types/config of every construct | RC-024; PEP-002 | EXISTS |
| R3 | **ConfigurationPort** | Behavior-as-data (zero hardcoding) | IP-04; PEP-003 | EXISTS |
| R4 | **Identity Registry** | Principals (open `kind`) | RC-005/023 | EXISTS |
| R5 | **Policy Registry** | `policy:*` records | RC-060; IP-05 | EXISTS |
| R6 | **AUTH-012 Decision Ledger** | Authorization decisions (append-only) | RC-004/033; INV-10 | EXISTS *(v1.0.13; attestation pending)* |
| R7 | **Event Catalog** | 73 PEV / 17 PED / 10 classifications | RC-028 | EXISTS |

All seven exist of record; the AUTH-012 ledger carries the Stage-0 evidentiary residual (`UCOS-AUTH-0001`; G0 AT-P0-1).

---

## 2. Stage-0 requested registries → registry-of-record mapping

| Stage-0 registry | Realized by (registry of record) | Seed reference source (frozen) | New class? |
|------------------|----------------------------------|--------------------------------|:----------:|
| **Authority Registry** | R6 AUTH-012 Decision Ledger + Authority Hierarchy (FAB-AUTH) | `AUTH-001..012`; `AUTH-012` v1.0.13 | **No** |
| **Invariant Registry** | R1/R2 view over the frozen invariant set | INV-1..13 (`UCOS-ASR-NFR-001` v1.0.1); S1/S3/S4/S6 | **No** |
| **Capability Registry** | R1 RegistryPort (capability records) | CAP-01..19; CAP-IR-001..067 (`UCOS-IR-0001`) | **No** |
| **Configuration Registry** | R3 ConfigurationPort | hierarchical config records (CF-1) | **No** |
| **Fabric Registry** | R1 RegistryPort (fabric records) | 25 fabrics + FAB-PFC (`UCOS-IR-0003`) | **No** |
| **Identity Registry** | R4 Identity Registry | principal `kind` classes (RC-005/023) | **No** |

> Each Stage-0 registry is a **governed view or seeded population** of an existing registry-of-record — not a new
> primitive. This preserves `UCOS-EXEC-0001` Prohibition 3 (no new RC/registry class by implementation) and
> INV-13 (extension via registration/metadata only).

---

## 3. Registry specifications

### 3.1 Authority Registry (→ R6 + Authority Hierarchy)
- **Record shape (of record):** `authority:{id}@{version}` → { scope, enumerated-power, majority-class, custodian }.
- **Seed:** the Authority Layer `AUTH-001..012`; enumerated Approval-Required powers **A-1..A-9** (`UCOS-EXEC-0001 §7`).
- **Write rule:** append-only; **Board-terminal** writes only (A-9); every decision recorded on the AUTH-012 ledger.
- **Invariant basis:** N-4 (single accountable ownership; Board terminal authority); INV-10 (append-only).

### 3.2 Invariant Registry (→ R1/R2 view)
- **Record shape:** `invariant:{id}` → { statement, class, waivability, source }.
- **Seed:** **INV-1..13** (redesign-prohibited, non-waivable per N-1); non-waivable controls **S1/S3/S4/S6** (N-2).
- **Write rule:** **read-only at the execution layer.** Enrollment of any invariant (e.g. INV-CORE-12, INV-14..20) is an **A-2 Board act** (Stage 7 ENACT), never an implementation write.
- **Invariant basis:** F-4; N-1; Prohibition 2/3.

### 3.3 Capability Registry (→ R1 RegistryPort)
- **Record shape:** `capability:{id}@{version}` → { fabric, layer, realization-state, contract-refs }.
- **Seed:** **CAP-01..19** (ratified capability set) and **CAP-IR-001..067** (67 constitutional requirement classes → capabilities; `UCOS-IR-0001`). 0 orphan capability of record.
- **Write rule:** additive registration via EX-1 (Registry `API-027`); discovery at runtime.
- **Invariant basis:** INV-13; EX-1.

### 3.4 Configuration Registry (→ R3 ConfigurationPort)
- **Record shape:** hierarchical `config:{scope}/{key}@{version}` → typed value (behavior-as-data).
- **Seed:** neutral technology bindings within ADR-001..007 (CF-2); feature/variability records (CF-1). **No secret values** — references only (CB-4; INV-11).
- **Write rule:** additive; resolves hierarchically; **never a code fork** (Prohibition 3).
- **Invariant basis:** IP-04; CF-1..CF-6; PEP-003.

### 3.5 Fabric Registry (→ R1 RegistryPort)
- **Record shape:** `fabric:{id}` → { class (FOUNDATIONAL/CORE/OPTIONAL/DEFERRED), realization-state, dependency-refs }.
- **Seed:** the **25 fabrics** — 12 FOUNDATIONAL, 7 CORE, 6 OPTIONAL, 5 DEFERRED — plus FAB-PFC (`UCOS-IR-0003 §6`; `UCOS-EP-0001 §2`). DEFERRED fabrics recorded **non-actuating / held** (FAB-CIV under `AD-0014`).
- **Write rule:** additive; DEFERRED→BUILD transition requires the fabric's named gate + Board authorization (Part I §4).
- **Invariant basis:** INV-13; `AD-0014`; Article IX.

### 3.6 Identity Registry (→ R4)
- **Record shape:** `identity:{id}` → { principal-kind (open class), attributes, trust-inputs }.
- **Seed:** principal `kind` classes (RC-005/023); genesis local principal (boot).
- **Write rule:** additive; open `kind`; authz precondition (S1) — no exposed operation without an authenticated principal.
- **Invariant basis:** N-2 (non-waivable S1); RC-005/023.

---

## 4. Cross-cutting registry rules

| Rule | Statement | Basis |
|------|-----------|-------|
| RG-1 | Every registry write is durable-mutation ⇒ routed through **FAB-EVO** (sole commit path) | N-5; INV-10 |
| RG-2 | Every registry record is **append-only / migration-only**; no destructive rewrite | N-3; INV-10 |
| RG-3 | Every registry read is **deny-by-default authorized**; unauthorized read fails closed | N-7; INV-3 |
| RG-4 | Registry content is **data, not code**; behavior binds from records, never a fork | IP-04; Prohibition 3 |
| RG-5 | Registry mutations **emit audit events** into the hash-chained log (FAB-AUDIT) | S6; INV-10 |
| RG-6 | The **Invariant** and **Authority** registries are read-only to implementation; writes are Board acts | N-1; N-4; A-2/A-9 |

---

## 5. Determination

> **The Stage-0 foundation registries are fully specified.** The six requested registries — Authority, Invariant,
> Capability, Configuration, Fabric, Identity — map **without exception** onto the seven registries of record
> (`UCOS-IR-0005 §3`), seeded from frozen corpus content (AUTH-001..012, INV-1..13, CAP-01..19/CAP-IR-001..067,
> ADR-001..007, the 25 fabrics, RC-005/023). **No new registry class, RC class, or invariant is introduced**; the
> Invariant and Authority registries are read-only to implementation (enrollment/authority acts are Board-terminal).
> Runtime population is gated on **G0 = PASS**; the seed specifications are permitted planning.

## 6. Scope discipline
No code, schema, API, requirement, RC class, invariant, governance, or authority was produced or modified.
INV-1..13, `AUTH-012`, `AD-0014`, and the Article IX generation lock are unchanged; **`UCOS-CONSTRUCTION-BLOCKED`
stands.** Specification only.

## 7. Traceability
- **Consumes:** `UCOS-IR-0005 §3` (7 registries); `UCOS-IR-0003` (25 fabrics); `UCOS-IR-0001` (CAP-IR-001..067); `UCOS-EXEC-0001` (F-4/F-8, A-1..A-9, EX-1..EX-5); `UCOS-S0-0001` (registry boundaries).
- **Refined by:** `UCOS-S0-0003` (persistence), `UCOS-S0-0005` (registry APIs), `UCOS-S0-0006` (registry tests).
- **Owner:** UCOS Authority Board.

**END `UCOS-S0-0002` — FOUNDATION REGISTRY SPECIFICATION · 6 REQUESTED → 7 REGISTRIES OF RECORD · SEEDED FROM FROZEN CORPUS · INVARIANT/AUTHORITY READ-ONLY TO IMPLEMENTATION · 0 NEW REGISTRY/RC/INVARIANT · POPULATION GATED ON G0 · PLANNING ONLY.**
