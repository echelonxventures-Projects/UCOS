# PROMPT09-SECURITY-INVENTORY

**Artifact:** PDATA-P09-SECINV-001 (Prompt-09 WS4)
**Phase:** PHASE D.3 — Prompt-09
**Authority:** Contract Authority (this work item) consuming ratified Security Architecture; `GATE-DOC-001`.
**Scope:** the compiler-authorized surface — API-018 + API-027 (8 operations, 6 events, 5 payload families).
**Discipline:** this inventory determines **security authority requirements** by reference to the ratified `UCOS-SEC-*` catalog. It **implements no control, defines no authorization logic, and mints no new control** — it maps the in-scope surface onto existing `SEC-CTL-001..020`, trust boundaries `TB-01..10`, checkpoints `S1..S7`, and non-waivable `S1/S3/S4`.

---

## 1. Authority sources (ratified)

| Source | Provides |
|--------|----------|
| `UCOS-SEC-CONTROL-001` | Control catalog `SEC-CTL-001..020`; checkpoint→control coverage; non-waivable mapping |
| `UCOS-SEC-TRACE-001` | Trust boundaries `TB-01..10`; boundary→control→checkpoint→realizer lineage; sensitive-data→control |
| `AUTH-008` §6/§7 · `UCOS-CONST-001` Part X | Non-waivable **S1** (authn/authz), **S3** (secrets), **S4** (data protection) |

## 2. Trust-boundary assignment (from `UCOS-SEC-TRACE-001` §2)

| Surface | Trust boundary | Rationale |
|---------|----------------|-----------|
| All 8 API operations (request/response) | **TB-01** client↔platform | boundary-level API access |
| API-018 operations (config/metadata plane) | + **TB-09** ↔config | realized via config plane (`PRD-011`) |
| API-027 operations (registry plane) | + **TB-08** ↔registry | realized via registry services (`PRS-022..025`) |
| All 6 events (EVT-018/EVT-027) | **TB-02** event fabric | producer emission on the eventing substrate |

## 3. Security requirement dimensions (WS4 mandate) — grounded per dimension

| Dimension | Requirement | Controls | Checkpoint | Non-waivable |
|-----------|-------------|----------|:----------:|:------------:|
| **Authentication** | Every boundary access authenticates the principal; sessions/tokens validated. | SEC-CTL-001, 004, 014 | S1 | **S1** |
| **Authorization** | Deny-by-default policy evaluation on every access; least-privilege scope; tenancy isolation. | SEC-CTL-002, 003, 013 | S1, S5 | **S1 (S4 tenancy)** |
| **Trust boundaries** | Enforced at TB-01/TB-02/TB-08/TB-09 with zero-trust transport. | SEC-CTL-014, 017 | S1, S5 | **S1** |
| **Audit** | Immutable, attributable capture of security-relevant events (esp. writes/admin). | SEC-CTL-011, 012 | S6 | — |
| **Integrity** | Encryption in transit; input/contract validation; replay/duplicate rejection on writes/events. | SEC-CTL-008, 015, 016 | S2, S4 | **S4 (transit)** |
| **Non-repudiation** | Tamper-evident, attestable audit of governed writes (signed assertions / audit integrity). | SEC-CTL-012, 011 | S6 | — |
| **Separation-of-duty** | Governed writes route through approval (AD-0009) + the sole Evolution commit path (proposer ≠ approver ≠ committer). | SEC-CTL-002, 013 + AD-0009 + PI-6 | S1, S5 | **S1** |

## 4. Requirement profile by operation kind

Operation kind (from Prompt-08 bindings) determines the security profile intensity:

| Kind | Operations | Profile |
|------|-----------|---------|
| **safe-read** | getConfigurationByScope, getMetadataByClass, getFeatureFlagsByContext, getRegistryArtifacts, getRegistryArtifactsById, getRegistryDiscovery | authn (S1) + read-authz deny-by-default (S1) + tenancy (S1/S4) + transit-enc (S4) + classification (S4) + param input-validation (S2) + audit-read (S6) + least-privilege (S5) |
| **unsafe-idempotent** (admin) | putConfigurationByScopeByKey | safe-read profile **+** write-authz + trust elevation + idempotency/replay (S2) + audit-integrity/non-repudiation (S6) + governance approval (AD-0009) + SoD (Evolution commit) |
| **unsafe-create** | postRegistryArtifacts | same as unsafe-idempotent; create-conflict governed by registry authority (CAP-19) |

## 5. Data-protection (S4) classification anchor

Payload families inherit classification from `UCOS-PDATA-ARCH-001` (never embedded — `FIELD-AUTHORITY-SPECIFICATION.md`). Config/metadata/registry planes map to `Internal` / `Confidential` sensitivity (`UCOS-SEC-TRACE-001` §4: PD-14/15/17 platform Internal; config/registry governance Confidential). Mandatory S4 controls: SEC-CTL-008 (transit), SEC-CTL-009 (at rest), SEC-CTL-010 (classification/minimization), SEC-CTL-003 (tenancy).

## 6. Event security surface (6 events, TB-02)

| Requirement | Controls |
|-------------|----------|
| Publish authorization (deny-by-default) | SEC-CTL-002 |
| Payload integrity + boundary authn/authz on event ingress/egress | SEC-CTL-014 |
| Replay/duplicate rejection | SEC-CTL-016 |
| Transit encryption on the event fabric | SEC-CTL-008 |
| Immutable audit of emission | SEC-CTL-011, 012 |

## 7. Coverage summary (input to WS5)

- Operations mapped to a security profile: **8/8**.
- Events mapped to a security profile: **6/6**.
- Payload families mapped to classification/protection: **5/5**.
- Distinct controls referenced: SEC-CTL-001, 002, 003, 004, 008, 009, 010, 011, 012, 013, 014, 015, 016, 017 (14 of 20; the remaining 005/006/007 secrets, 018 dependency, 019 threat-modeling, 020 rate-limit are platform/process controls not bound at the operation-authority level, recorded as `platformScoped`).
- Non-waivable checkpoints asserted on every operation: **S1, S3, S4**.

## Traceability

Refines `UCOS-SEC-CONTROL-001`, `UCOS-SEC-TRACE-001`, `AUTH-008`, `UCOS-CONST-001` Part X, `contracts/bindings/operation-payload-bindings.json`, `contracts/catalog/api-018|027.contract.json` (resolves `security: FLAGGED FOR PROMPT 09` by reference). Governed by `UCOS-SVC-POLICY-001`.
