# UCOS-S0-0003 — Database Foundation Specification

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-S0-0003` |
| Program | **UCOS Stage 0 — Foundation Implementation Package** |
| Phase | S0-3 — Database Foundation |
| Mode | **IMPLEMENTATION PLANNING ONLY** — specifies the *logical* datastore roles, migration order, seed sets, integrity constraints, and versioning strategy of the realized MCR. **No physical schema/DDL is authored or executed** (database design/creation is a prohibited activity under the standing lock — `UCOS-CONSTRUCTION-BLOCKED §3`). |
| Status | STAGE-0 SPECIFICATION (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EXEC-0001` (INV-5/INV-10, N-3/N-5, F-9); `UCOS-IR-0005 §4` (4 datastore roles); `UCOS-S0-0001/0002`; `UCOS-EP-0006` (Gate rollback = additive-forward) |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX lock **ACTIVE**; **`UCOS-CONSTRUCTION-BLOCKED` stands**. Single system-of-record (INV-5); append-only / migration-only (INV-10; N-3). |

---

## 0. Purpose & standing

Specifies the **database foundation** for the MCR at the **logical** level: datastore roles, migration ordering,
seed data, integrity constraints, and versioning. Per `UCOS-IR-0005 §4`, the MCR runs today on **single-node /
largely in-memory adapters** that satisfy INV-5/INV-10 **semantically**; durable/distributed adapters are a
`Stage-13` forward step (`UCOS-RA-0006`), **not** a Stage-0 build.

> **Prohibition boundary.** "Database design / creation" is explicitly prohibited under the Article IX lock
> (`UCOS-CONSTRUCTION-BLOCKED §3`). Accordingly this artifact **emits no executable DDL and creates no schema**.
> It specifies the *logical constraints and ordering of record* that any authorized post-G0 build must honor.
> Physical schema authoring and migration execution are **gated on G0 = PASS** and reserved to the Authority
> Board's construction authorization.

---

## 1. Datastore roles (`UCOS-IR-0005 §4`)

| # | Datastore role | Purpose | Binding basis | State |
|:-:|----------------|---------|---------------|:-----:|
| D1 | **System-of-Record (SoR)** | Single authoritative store per domain | RC-034; INV-5 | EXISTS *(single-node/in-memory adapter)* |
| D2 | **Append-only Audit Log** | Hash-chained, offline-verifiable evidence | RC-037; S6 | EXISTS *(per-fabric)* |
| D3 | **Registry/Metadata/Config Store** | Persisted governed records (R1/R2/R3) | RC-024 | EXISTS *(single-node adapter)* |
| D4 | **Federated Audit Log** | Cross-instance signed provenance | RC-007/036 | EXISTS |

No datastore role is added; these four are the roles of record. The Stage-0 registries (`UCOS-S0-0002`) persist
into **D3**; the AUTH-012 ledger and audit events persist into **D2** (hash-chained).

---

## 2. Logical schema specification (entities & constraints — no DDL)

Described as governed record families behind ports (INV-7). Physical realization is deferred to an authorized build.

| Record family | Store | Key | Core constraints |
|---------------|:-----:|-----|------------------|
| `construct` (registry) | D3 | `id@version` | UNIQUE(id,version); version monotonic; append-only (INV-10) |
| `metadata` | D3 | `construct_id@version` | FK→construct; open-class typed; additive |
| `configuration` | D3 | `scope/key@version` | hierarchical; typed value; **no secret literals** (INV-11) |
| `identity` (principal) | D3 | `principal_id` | open `kind`; authz precondition (S1) |
| `policy` (`policy:*`) | D3 | `policy_id@version` | deny-by-default default posture (INV-3) |
| `authority_decision` (AUTH-012) | D2 | `decision_seq` | **append-only**; hash-chained; Board-terminal writes (A-9) |
| `audit_entry` | D2 | `entry_seq` | **append-only**; `prev_hash` chain; offline-verifiable (S6) |
| `event` (catalog + emitted) | D3/D2 | `event_id` | tolerant-reader; at-least-once; idempotency key (INV-6) |
| `lifecycle_state` | D3 | `construct_id, state_seq` | append-only transitions; history retained (RC-027) |
| `federation_assertion` | D4 | `assertion_id` | Ed25519-signed; namespace-isolated; fail-closed (RC-007/035) |

---

## 3. Migration order (append-only / migration-only)

Migrations are **ordered, forward-only, additive**; rollback is **corrective forward migration**, never
destructive (N-3; INV-10; `UCOS-EP-0006` rollback rule). The order mirrors the realized boot dependency
(`UCOS-IR-0006` Stages 1–3; genesis bootstrap resolves CYC-1/2/3):

```
M0  genesis roots        (bootstrap principal + genesis authority seed)      ← resolves boot cycles
M1  registry store       (construct)                                          ← D3, FAB-REG
M2  metadata store       (metadata)                                           ← D3, FAB-META
M3  configuration store  (configuration)                                      ← D3, FAB-CFG
M4  identity store       (identity/principal)                                 ← D3, FAB-IDENT
M5  authority ledger      (authority_decision, AUTH-012)                      ← D2, FAB-AUTH (append-only)
M6  policy store         (policy)                                             ← D3, FAB-POL
M7  audit log            (audit_entry, hash-chain)                            ← D2, FAB-AUDIT
M8  event store          (event catalog + emitted)                           ← D3/D2, FAB-EVT
M9  lifecycle store      (lifecycle_state)                                    ← D3, FAB-STATE
M10 federation store     (federation_assertion)                              ← D4, FAB-FED
```

**Migration laws:** (a) each Mn depends only on M<n; **0 forward dependency** (`UCOS-IR-0006 §3`); (b) no Mn
drops or destructively rewrites a prior structure (N-3); (c) every migration is itself an Evolution-committed,
audited change (N-5; RG-1/RG-5 of `UCOS-S0-0002`).

---

## 4. Seed data

| Seed set | Store | Source (frozen) |
|----------|:-----:|-----------------|
| Genesis principal + genesis authority | D3/D2 | boot bootstrap (`UCOS-IR-0006` Stage 3) |
| Invariant reference (INV-1..13; S1/S3/S4/S6) | D3 | `UCOS-ASR-NFR-001` v1.0.1 (read-only) |
| Authority reference (AUTH-001..012; A-1..A-9) | D3/D2 | `UCOS-EXEC-0001 §7`; Authority Layer |
| Capability reference (CAP-01..19; CAP-IR-001..067) | D3 | `UCOS-IR-0001` |
| Fabric reference (25 fabrics + FAB-PFC) | D3 | `UCOS-IR-0003 §6` |
| Event catalog (73 PEV / 17 PED / 10 classes) | D3 | RC-028 |

Seed content is **verbatim frozen reference** — no new record classes, no invented values. Loading seed records
into a running store is gated on **G0 = PASS**.

---

## 5. Integrity constraints

| # | Constraint | Basis |
|:-:|------------|-------|
| IC-1 | **Single SoR per domain** — exactly one authoritative store; no second SoR | INV-5; N-4 |
| IC-2 | **Append-only** — audit and decision ledgers admit inserts only; no update/delete | INV-10; N-3; S6 |
| IC-3 | **Hash-chain continuity** — each `audit_entry.prev_hash` = hash(prior); breaks fail closed | S6; N-7 |
| IC-4 | **Evolution-only writes** — durable mutation only via FAB-EVO; no independent commit path | N-5 |
| IC-5 | **Version monotonicity** — `id@version` versions strictly increase; prior versions retained | INV-10 |
| IC-6 | **No secret literals** — configuration/records store references, never secret material | INV-11 |
| IC-7 | **Deny-by-default reads/writes** — unproven authorization fails closed | INV-3; N-7 |
| IC-8 | **Referential additivity** — FKs never cascade-delete; correction is forward migration | N-3 |

---

## 6. Versioning strategy

- **Record versioning:** every governed record is `id@version`; versions are append-only and monotonic (IC-5).
- **Schema versioning:** each migration Mn is numbered, forward-only, and recorded of record; the applied set is
  itself an audited construct (M-set version = highest applied Mn).
- **Contract/ADR versioning:** persistence adapters bind within the neutral technology ADR (ADR-001..007);
  a datastore-engine change is a **new ADR version + A-4 Board act** (migration-only), never a code fork (CF-2).
- **Rollback semantics:** additive-forward only — a defective migration is superseded by a corrective forward
  migration; no destructive down-migration exists (N-3; `UCOS-EP-0006` Gate rollback rule).

---

## 7. Determination

> **The database foundation is fully specified at the logical layer.** Four datastore roles of record (SoR,
> append-only Audit, Registry/Metadata/Config store, Federated Audit) host ten governed record families under
> eight integrity constraints (single-SoR INV-5, append-only/hash-chained INV-10/S6, Evolution-only commit N-5,
> deny-by-default INV-3), an eleven-step forward-only migration order with **0 forward dependency**, verbatim
> frozen seed sets, and an append-only versioning strategy. **No physical schema or DDL is authored or executed**;
> schema realization and migration execution are **gated on G0 = PASS** and reserved to the Authority Board, in
> keeping with the Article IX prohibition on database design/creation under the standing lock.

## 8. Scope discipline
No schema, DDL, migration, code, requirement, RC class, invariant, governance, or authority was produced or
executed. INV-1..13, `AUTH-012`, `AD-0014`, and the Article IX generation lock are unchanged;
**`UCOS-CONSTRUCTION-BLOCKED` stands.** Specification only.

## 9. Traceability
- **Consumes:** `UCOS-IR-0005 §4` (datastore roles); `UCOS-EXEC-0001` (INV-5/INV-10, N-3/N-5, CF-2); `UCOS-IR-0006` (boot/migration order); `UCOS-S0-0002` (record families); `UCOS-EP-0006` (rollback = additive-forward).
- **Refined by:** `UCOS-S0-0004` (runtime persistence services), `UCOS-S0-0006` (integrity tests), `UCOS-S0-0007` (build plan).
- **Owner:** UCOS Authority Board.

**END `UCOS-S0-0003` — DATABASE FOUNDATION SPECIFICATION · 4 DATASTORE ROLES · 10 RECORD FAMILIES · 8 INTEGRITY CONSTRAINTS · 11-STEP FORWARD-ONLY MIGRATION (0 FWD DEP) · FROZEN SEED SETS · APPEND-ONLY VERSIONING · NO DDL EMITTED · SCHEMA GATED ON G0 · PLANNING ONLY.**
