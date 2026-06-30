# UCOS — Security Architecture

| Field | Value |
|-------|-------|
| Artifact | **UCOS Security Architecture** |
| Artifact ID | `UCOS-SEC-ARCH-001` |
| Version | 1.0.0 |
| Status | **CREATED — READY FOR RATIFICATION** (Phase 9 — Security Architecture) |
| Phase | Phase 9 — Security Architecture (Prompt 09) |
| Pipeline position | 9 of 12 |
| Owner | Security Architect (Security Governance — `UCOS-DOM-024`; CAP-17 Security & Trust) |
| Generation mode | **Architecture generation ONLY** — no source code, no implementation, no infrastructure, no technology/vendor/cloud/runtime selection |
| Branch | `phase-9.2-convergence` (DO NOT PUSH / MERGE / TAG) |
| Date | 2026-06-30 |
| Verdict | Security design coverage **PASS**; non-waivable **S1/S3/S4** designed & enforced; 0 unprotected boundaries; 0 unmapped threats; implementation leakage **NONE** |

> **Mandate.** This document authors the UCOS security architecture: it models threats across
> contexts and exposed boundaries (STRIDE), maps every threat to a control, and defines the
> identity, authentication, authorization, tenancy-isolation, data-protection, secrets/least-
> privilege, and immutable-audit designs that satisfy **Constitution Part X** and the **Security
> Canon (AUTH-008)**. It establishes the security *posture* all implementation must realize
> (Prompt 10) and certification must verify (Prompt 11). It implements **no** control in code,
> selects **no** technology, and renders **no** gate verdict on built software.

---

## Section I — Security Architecture Overview

### I.1 Purpose

Establish the canonical, technology-neutral security posture of UCOS so that every exposed boundary
is authenticated and authorized, every sensitive data entity is protected, every secret is
externally vaulted and rotated, and every security-relevant event is immutably audited — with every
modeled threat traced to a control and every control traced to the boundary or data it protects.

### I.2 Scope

**In scope**
- Threat models per bounded-context class and per exposed/trust boundary (STRIDE).
- Control catalog and threat → control → checkpoint mapping.
- Identity, authentication, authorization, and tenancy-isolation architecture.
- Data-protection design (encryption in transit/at rest; PII classification & minimization).
- Secrets management, key lifecycle, rotation, and least-privilege model.
- Immutable, attributable audit-logging design.
- Compliance posture satisfying Constitution Part X / Part XI and AUTH-008.
- Enforcement of the non-waivable controls **S1 (authn/authz)**, **S3 (secrets)**, **S4 (data protection)**.

**Out of scope (owned elsewhere)**
- Control implementation in code (Prompt 10).
- Pass/fail verdict on built software (Prompt 11 runs `GATE-SEC-001` against implementation).
- Platform technology selection (Prompt 08 / technology-selection ADRs).
- Service & API + event + data contract definitions (Prompt 07).
- Experience architecture (Prompt 06).

### I.3 Architectural Position

The Security Architecture is subordinate to the Authority Layer, the ratified Constitution, and all
ratified upstream architectures. It is realized on — but does not select — the ratified, frozen
Platform Engineering substrate:

| Concern | Realizing platform substrate (technology-neutral) |
|---------|---------------------------------------------------|
| Authentication / authorization / tenancy | `PE-08` Identity, Access & Tenancy (`PRD-008`: `PRS-031` Authentication, `PRS-032` Authorization, `PRS-033` Tenancy Context, `PRS-034` Session & Token) |
| Secrets & keys | `PE-09` Secrets & Key Management (`PRD-009`: `PRS-035` Secret Issuance, `PRS-036` Key Lifecycle, `PRS-037` Rotation Coordination, `PRS-038` Secret Reference Resolution) |
| Audit & evidence | `PE-10` Audit & Evidence (`PRD-010`: `PRS-039` Audit Capture, `PRS-040` Evidence Custody, `PRS-041` Audit Query & Attestation, `PRS-042` Integrity & Tamper-evidence) |
| Exposed boundary (request/response) | `PE-05` Integration & API Gateway (`PRD-005`: `PRS-018` Contract Ingress, `PRS-019` Contract Egress, `PRS-020` Version Negotiation, `PRS-021` Request Mediation) |
| Exposed boundary (events) | `PE-04` Messaging & Eventing (`PRD-004`: `PRS-013..017`) |
| Network segmentation / zero-trust transport | `PE-03` Networking & Connectivity (`PRD-003`: `PRS-009..012`) |
| Registry / discovery integrity | `PE-06` Registry & Discovery (`PRD-006`: `PRS-022..025`) |
| Configuration/metadata integrity | `PE-11` Configuration & Metadata Delivery (`PRD-011`) |
| Control plane / governance enforcement | `PE-17` Platform Governance & Control Plane; Control Fabric `UCOS-PEA-007` (`PCD-CTRL-001..012`, `PCE-001..073`) |

> **Note on exposed contracts (Prompt 07 dependency).** Per-contract threat models require the
> ratified contract surface from Prompt 07, which is not yet ratified (condition **C-2** open). This
> architecture therefore models threats at the **ratified boundary surface** that already exists — the
> platform integration/eventing boundaries (`PE-04`/`PE-05`), the trust substrate (`PE-08/09/10`), and
> the 28-domain context map — and defines the **boundary-class security requirements** every future
> contract must satisfy. When Prompt 07 ratifies concrete contracts, each contract inherits the
> boundary-class threat model and control set defined here and is refined into a per-contract threat
> model under this architecture (see `UCOS-SEC-THREAT-001` §6, forward obligation **FO-1**).

### I.4 Authority & Authoritative Inputs (immutable)

| Input | Artifact | Role |
|-------|----------|------|
| Security Canon | `AUTH-008` | **Primary** — non-waivable S1/S3/S4; zero-trust; classification → controls |
| Principles | `AUTH-003` (P6, IP-05, IP-09, IP-10, IP-17) | Security By Default; least-privilege; auditability; autonomy never weakens security |
| Data Canon | `AUTH-007` | Classification taxonomy feeding S4 |
| Governance Canon | `AUTH-009` | Approval-by-exception; approval-required security operations |
| Traceability Canon | `AUTH-010` | No-orphan / lineage discipline |
| Constitution | `UCOS-CONST-001` (Part X Security, Part XI Compliance, Art. XII non-waivable, Art. IX lock) | Constitutional security obligations |
| Security gate | `GATE-SEC-001` (S1–S7) | Checkpoints designed toward |
| Documentation gate | `GATE-DOC-001` (D1–D6) | Documentation discipline |
| Domain Architecture | `UCOS-DOM-ARCH-001` | 28 bounded contexts; context map; trust boundaries |
| Capability Architecture | `UCOS-CAP-ARCH-001` | CAP-17 Security & Trust; CAP-16 Audit; CAP-09 Identity |
| Physical Data Architecture | `UCOS-PDATA-ARCH-001` | Data sensitivity classification (§III.5) |
| Platform Engineering Architecture | `UCOS-PEA-001/002/003`, Control Fabric `UCOS-PEA-007` | Realizing substrate (`PE-03/04/05/06/08/09/10/11/17`) |

### I.5 Objectives

1. Define a zero-trust, least-privilege security posture binding on all implementation.
2. Model threats (STRIDE) across every exposed/trust boundary and every domain class.
3. Map every threat to at least one control; map every control to a `GATE-SEC-001` checkpoint and a realizing platform service.
4. Design identity, authentication, authorization, and tenancy isolation (S1, S5).
5. Design data protection — encryption in transit & at rest; PII classification & minimization (S4).
6. Define secrets vaulting, key lifecycle, rotation, and least-privilege (S3, S5).
7. Design immutable, attributable audit logging (S6).
8. Enforce the non-waivable controls **S1 / S3 / S4** with zero unprotected exposed boundaries and zero unprotected sensitive-data entities.
9. Produce full traceability and security ADRs; register and advance state.

---

## Section II — Security Principles (binding)

| ID | Principle | Statement | Anchor |
|----|-----------|-----------|--------|
| SP-01 | **Zero Trust by Default** | No identity, service, agent, or data access is implicitly trusted; every access is verified at every boundary. | AUTH-008 §6.1; Const. X.1; IP-09 |
| SP-02 | **Authentication & Authorization on Every Exposed Boundary (S1, non-waivable)** | No network-exposed capability operates without defined authentication and authorization. No silent open surfaces. | AUTH-008 §6.2/§7; Const. X.3/X.5 |
| SP-03 | **Least Privilege** | Every identity, service, agent, and data access is scoped to the minimum required; widening scope is Approval-Required. | AUTH-008 §6.1/§8; Const. X.2 |
| SP-04 | **Secrets Externalized & Rotated (S3, non-waivable)** | No secret exists in code, configuration, or artifacts; secrets are vault-managed with defined rotation. | AUTH-008 §6.3/§7; Const. X.5 |
| SP-05 | **Data Protection (S4, non-waivable)** | Data is encrypted in transit and at rest; PII/financial/security data is classified (AUTH-007) and minimized. | AUTH-008 §6.4/§7; Const. X.5 |
| SP-06 | **Threats Modeled & Mapped (S2)** | Threats are modeled (STRIDE) per context and per exposed boundary; every threat traces to a control and every control to what it protects. | AUTH-008 §6.5; Const. X.3 |
| SP-07 | **Immutable Auditability (S6)** | Security-relevant events are logged immutably and attributably; evidence is never suppressed or mutated. | AUTH-008 §6.6; Const. X.4; IP-10 |
| SP-08 | **Defense in Depth** | Controls apply at every boundary and layer; no single control is a sole line of defense. | Const. X.3 |
| SP-09 | **Dependency Risk Governed (S7)** | Dependencies are pinned; known-vulnerability posture is clean or risk-accepted with record. | AUTH-008 §6.7 |
| SP-10 | **Autonomy Never Weakens Security** | Approval-by-exception (IP-17 / Art. XII) may never waive or defer S1/S3/S4; defined security operations are always Approval-Required. | AUTH-008 §7/§8; Const. X.5/X.6 |

---

## Section III — Identity Model

### III.1 Identity Principals

UCOS recognizes four classes of security principal; every principal is a registered, governed element (Registry First) and every access is mediated by `PE-08`.

| Principal class | Description | Identity authority |
|-----------------|-------------|--------------------|
| **Human user** | End users / operators acting through Experience Delivery (`UCOS-DOM-028`). | Identity & Access domain (`UCOS-DOM-017`) → `PRD-008` |
| **Service / workload identity** | Platform & business runtime services (`PRS-001..073`) acting as callers. | `PRD-008` workload identity; non-human |
| **Autonomous agent identity** | Governed autonomous agents (Const. Part XIII; AUTH-009). | `PRD-008` + agent-zone governance |
| **Tenant** | Isolation principal under multi-tenancy; scopes every human/service/agent identity. | `PRS-033` Tenancy Context |

### III.2 Identity Properties (binding requirements)

1. **Unique & attributable** — every principal has a stable, unique identifier; all actions are attributable to one principal (SP-07).
2. **Tenant-scoped** — every non-platform identity is bound to exactly one tenant context; cross-tenant identity reuse is prohibited (SP-03).
3. **No ambient authority** — possession of network reachability grants no rights; rights derive only from an authenticated, authorized identity (SP-01).
4. **Lifecycle-governed** — identity provisioning, suspension, and de-provisioning are governed; credential creation/rotation is Approval-Required (AUTH-008 §8).
5. **Federation-ready, technology-neutral** — the identity model supports external/federated identity providers as an abstraction; **no** IdP product, protocol library, or token format is selected here (deferred to technology-selection ADRs).

### III.3 Identity Realization Map

| Identity concern | Realizing service |
|------------------|-------------------|
| Authentication of principal | `PRS-031` Authentication (`PRD-008`) |
| Authorization decision for principal | `PRS-032` Authorization (`PRD-008`) |
| Tenant context resolution & isolation | `PRS-033` Tenancy Context (`PRD-008`) |
| Session / token issuance & validation | `PRS-034` Session & Token (`PRD-008`) |
| Credential / secret backing identity material | `PRS-035` Secret Issuance (`PRD-009`) |

> Detailed identity decision recorded in `UCOS-SEC-ADR-002`.

---

## Section IV — Authentication Model

### IV.1 Authentication Requirements

| ID | Requirement | Checkpoint |
|----|-------------|-----------|
| AUTHN-1 | Every exposed boundary (`PE-04`/`PE-05`) authenticates the calling principal before any business effect. | S1 |
| AUTHN-2 | Service-to-service calls authenticate via workload identity; no anonymous internal calls (zero trust). | S1, S5 |
| AUTHN-3 | Authentication material (tokens/keys) is issued, validated, and revocable via `PRS-034`/`PRS-035`; never embedded in code/config. | S1, S3 |
| AUTHN-4 | Failed authentication is deny-by-default, rate-limited, and audited (`PRS-039`). | S1, S6 |
| AUTHN-5 | Authentication strength (e.g., multi-factor for human/privileged access) is a governed policy parameter resolved from configuration (`PRD-011`), not hard-coded. | S1 |
| AUTHN-6 | Token/session lifetime, renewal, and revocation are bounded and governed; replayed or expired credentials are rejected. | S1, Tampering |

### IV.2 Authentication Flow (technology-neutral)

1. Principal presents credential at an exposed boundary (`PRS-018` ingress / `PRS-013` event publication).
2. Boundary delegates verification to `PRS-031` Authentication; `PRS-031` validates against issued material (`PRS-034`/`PRS-035`).
3. On success, an authenticated principal context + tenant context (`PRS-033`) is established; on failure, the request is denied and audited.
4. Every authentication decision emits an immutable audit signal to `PRD-010` (`PRS-039`).

> No authentication protocol, token format, IdP, or cryptographic library is selected here. Decision recorded in `UCOS-SEC-ADR-002`.

---

## Section V — Authorization Model

### V.1 Authorization Principles

1. **Deny-by-default** — absence of an explicit grant is a denial (`PRD-008` RC: "deny-by-default authorization").
2. **Policy-driven** — authorization decisions are evaluated against governed policy (IP-05; Policy domain `UCOS-DOM-025`), resolved from configuration/metadata, never hard-coded.
3. **Least-privilege scoping** — grants are the minimum necessary; scope widening is Approval-Required (AUTH-008 §8).
4. **Tenant-isolating** — every decision is evaluated within the principal's tenant context; cross-tenant authorization is prohibited unless an explicit, governed cross-tenant grant exists.
5. **Attributable** — every authorization decision (allow/deny) is audited.

### V.2 Authorization Model Shape (abstract, technology-neutral)

The model is expressed as an abstract policy-decision function combining:
- **Role/relationship dimension** — coarse-grained roles per principal class.
- **Attribute/context dimension** — fine-grained attributes (tenant, classification, resource owner, action, environment).
- **Resource-ownership dimension** — the single-owner domain (AUTH-007) of the target resource governs permissible actions.

This abstraction admits an RBAC+ABAC realization without binding to any policy engine, language, or product (deferred — `UCOS-SEC-ADR-003`).

### V.3 Authorization Realization Map

| Concern | Realizing service |
|---------|-------------------|
| Authorization decision (PDP) | `PRS-032` Authorization (`PRD-008`) |
| Policy source | Policy domain `UCOS-DOM-025`; configuration/metadata (`PRD-011`) |
| Enforcement points (PEP) | `PRS-018`/`PRS-019` (gateway), `PRS-013`/`PRS-015` (eventing), and per-service guards |
| Tenant scoping | `PRS-033` Tenancy Context |
| Decision audit | `PRS-039` Audit Capture |

### V.4 Tenancy Isolation

| ID | Requirement | Checkpoint |
|----|-------------|-----------|
| TEN-1 | Every request carries a resolved tenant context (`PRS-033`); requests without a valid tenant context are denied. | S1, S5 |
| TEN-2 | Data access is tenant-partitioned; no query or projection may cross tenant boundaries without an explicit governed grant. | S4, S5 |
| TEN-3 | Cross-tenant data leakage is a non-waivable data-protection violation (S4). | S4 |
| TEN-4 | Tenant isolation is enforced in depth: at the boundary, at authorization, and at the data-access broker (`PRS-006`). | S5, SP-08 |

> Tenancy isolation decision recorded in `UCOS-SEC-ADR-004`.

---

## Section VI — Data Protection Model (S4, non-waivable)

### VI.1 Data Sensitivity Classification (inherited, unchanged — AUTH-007 / `UCOS-PDATA-ARCH-001` §III.5)

| Sensitivity Class | Physical Data Domains | Protection posture |
|-------------------|------------------------|--------------------|
| **Restricted-PII** | `PD-01` Identity, `PD-02` Party | Encrypt in transit + at rest; minimize; tenant-isolate; strictest access scope; full audit |
| **Restricted-Financial** | `PD-07` Transaction, `PD-09` Financial | Encrypt in transit + at rest; minimize; segregate duties; full audit |
| **Restricted-Security** | `PD-13` Security | Encrypt in transit + at rest; vault-backed; tamper-evident; full audit |
| **Regulated-Evidentiary** | `PD-10` Compliance | Encrypt; immutable/append-only; preservation-biased retention; full audit |
| **Confidential** | `PD-05`, `PD-06`, `PD-08`, `PD-11`, `PD-12`, `PD-16` | Encrypt in transit + at rest; scoped access; audit |
| **Internal (Public subset)** | `PD-03`, `PD-04` | Encrypt in transit; integrity-protected; scoped access |
| **Internal** | `PD-14`, `PD-15`, `PD-17` | Encrypt in transit; integrity-protected |

### VI.2 Data Protection Requirements

| ID | Requirement | Checkpoint |
|----|-------------|-----------|
| DP-1 | **Encryption in transit** on every boundary and inter-service hop (zero-trust transport). | S4 |
| DP-2 | **Encryption at rest** for all persisted data; keys are externally managed (`PRS-036`), never co-located with data or code. | S4, S3 |
| DP-3 | **PII/financial/security data minimization** — collect/retain/expose the minimum; projections expose only what a contract requires. | S4 |
| DP-4 | **Classification-driven controls** — every sensitive entity's classification (VI.1) determines its mandatory protection set; unclassified sensitive data is a blocking gap (AUTH-007 §7). | S4 |
| DP-5 | **Tenant partitioning** of data at rest and in projections (TEN-2/TEN-3). | S4, S5 |
| DP-6 | **No sensitive data in logs/audit payloads** — audit records reference, not embed, sensitive values. | S4, S6 |
| DP-7 | **Key separation** — encryption keys live in `PE-09`; data lives in `PE-02`; the two are never co-mingled. | S3, S4 |

> Data-protection decision recorded in `UCOS-SEC-ADR-006`. No cipher suite, key length, datastore, or KMS product is selected here.

---

## Section VII — Secrets & Least-Privilege Model (S3, non-waivable)

### VII.1 Secrets Requirements

| ID | Requirement | Checkpoint |
|----|-------------|-----------|
| SEC-1 | **No secret in code, configuration, IaC, or any artifact** — only governed references (`PRS-038`). | S3 |
| SEC-2 | **Vault-managed issuance & injection** — secrets are issued and injected at runtime via `PRS-035`; resolved by reference via `PRS-038`. | S3 |
| SEC-3 | **Key lifecycle governed** — generation, storage, use, and destruction of keys via `PRS-036`. | S3, S4 |
| SEC-4 | **Rotation defined** — every secret/key class has a defined rotation policy coordinated by `PRS-037`; rotation is Approval-Required (AUTH-008 §8). | S3 |
| SEC-5 | **Secrets never co-mingled with configuration/metadata** (`PRD-009` boundary BC). | S3 |
| SEC-6 | **Access to secrets is least-privilege & audited** — only authorized workload identities resolve a given secret reference; every resolution is audited. | S3, S5, S6 |

### VII.2 Least-Privilege Model

| ID | Requirement | Checkpoint |
|----|-------------|-----------|
| LP-1 | Every identity/service/agent receives the minimum scope required for its function (SP-03). | S5 |
| LP-2 | Default posture is no access; access is granted explicitly and narrowly. | S5 |
| LP-3 | Scope widening, control disabling, and privilege escalation are Approval-Required Operations (AUTH-008 §8). | S5 |
| LP-4 | Standing privileged access is minimized; privileged operations are time-bounded, justified, and audited. | S5, S6 |
| LP-5 | Service-to-service authorization scopes are derived from declared contract dependencies (Prompt 07), not ambient trust. | S5 |

> Secrets & key decision recorded in `UCOS-SEC-ADR-005`.

---

## Section VIII — Audit-Logging Architecture (S6)

### VIII.1 Audit Requirements

| ID | Requirement | Checkpoint |
|----|-------------|-----------|
| AUD-1 | **All security-relevant events** (authn, authz allow/deny, secret resolution, key/rotation operations, privilege changes, tenancy decisions, control-plane changes) are captured via `PRS-039`. | S6 |
| AUD-2 | **Immutable & append-only** — audit records cannot be altered or deleted (`PRD-010` RC: append-only, tamper-evident). | S6 |
| AUD-3 | **Attributable** — every record names the principal, tenant, action, resource, decision, and time. | S6, SP-07 |
| AUD-4 | **Tamper-evident & integrity-proofed** — integrity verified via `PRS-042`; attestations via `PRS-041`. | S6 |
| AUD-5 | **Evidence custody & retention** — evidentiary records (`PD-10`) are preservation-biased; custody via `PRS-040`. | S6, Regulated-Evidentiary |
| AUD-6 | **No suppression** — disabling/bypassing audit is prohibited and itself an audited, Approval-Required event. | S6 |
| AUD-7 | **No sensitive payloads** — audit references sensitive data by classification/identifier, never by value (DP-6). | S4, S6 |

### VIII.2 Audit Realization Map

| Concern | Realizing service |
|---------|-------------------|
| Capture | `PRS-039` Audit Capture (`PRD-010`) |
| Custody | `PRS-040` Evidence Custody |
| Query / attestation | `PRS-041` Audit Query & Attestation |
| Integrity / tamper-evidence | `PRS-042` Integrity & Tamper-evidence |

> Audit-logging decision recorded in `UCOS-SEC-ADR-007`.

---

## Section IX — Threat & Control Architecture

The full threat models (STRIDE) are in `UCOS-SEC-THREAT-001`; the control catalog and the
threat → control → checkpoint matrix are in `UCOS-SEC-CONTROL-001`. This section summarizes the
architecture that binds them.

### IX.1 Trust Boundaries

| ID | Trust boundary | Surface | Realizing substrate |
|----|----------------|---------|---------------------|
| TB-01 | External client ↔ platform (request/response) | Exposed | `PE-05` (`PRS-018..021`) |
| TB-02 | External producer/consumer ↔ event fabric | Exposed | `PE-04` (`PRS-013..017`) |
| TB-03 | Service ↔ service (inter-context) | Internal/zero-trust | `PE-03`/`PE-05` + `PE-08` |
| TB-04 | Service ↔ data persistence | Internal | `PE-02` (`PRS-005..008`) |
| TB-05 | Service ↔ secrets/keys | Internal/trust | `PE-09` (`PRS-035..038`) |
| TB-06 | Principal ↔ identity/tenancy | Trust | `PE-08` (`PRS-031..034`) |
| TB-07 | Any ↔ audit/evidence | Trust | `PE-10` (`PRS-039..042`) |
| TB-08 | Any ↔ registry/discovery | Internal | `PE-06` (`PRS-022..025`) |
| TB-09 | Any ↔ configuration/metadata | Internal | `PE-11` (`PRS-043..`) |
| TB-10 | Operator/agent ↔ control plane | Privileged | `PE-17` control plane; Control Fabric `UCOS-PEA-007` |

### IX.2 Control Catalog (summary — full mapping in `UCOS-SEC-CONTROL-001`)

20 security controls `SEC-CTL-001..020` cover the STRIDE space and the seven `GATE-SEC-001`
checkpoints, each realized by a named platform service and traced to the threats it mitigates.
Non-waivable coverage: **S1** → SEC-CTL-001/002/003/004/014; **S3** → SEC-CTL-005/006/007;
**S4** → SEC-CTL-008/009/010 (+ tenancy SEC-CTL-003/013).

### IX.3 Coverage Guarantee

- Every trust boundary (TB-01..TB-10) has ≥1 threat model and ≥1 mapped control (S1, S2).
- Every sensitive-data domain (VI.1) has ≥1 protection control (S4).
- Every modeled threat maps to ≥1 control; every control maps to ≥1 checkpoint and ≥1 realizing service.
- **0 silent open surfaces; 0 unmapped threats; 0 unprotected sensitive-data entities.**

---

## Section X — Non-Waivable Control Enforcement (S1 / S3 / S4)

Per Constitution Part X.5 and AUTH-008 §7, the following are non-waivable and block any affected
scope until satisfied; no autonomy provision (IP-17 / Art. XII) may weaken or defer them.

| Control | Obligation | Design enforcement | Status |
|---------|-----------|--------------------|:------:|
| **S1 — AuthN/AuthZ on every exposed boundary** | No exposed capability without authentication + authorization. | TB-01/TB-02 enforced by `PE-05`/`PE-04` delegating to `PRS-031`/`PRS-032`; deny-by-default; AUTHN-1..6; V.1; SEC-CTL-001/002/004/014. | ✅ Designed & enforced |
| **S3 — Secrets externalized & rotated** | No secret in code/config/artifacts; vault-managed with rotation. | `PE-09` (`PRS-035..038`); references only (`PRS-038`); rotation `PRS-037`; SEC-1..6; SEC-CTL-005/006/007. | ✅ Designed & enforced |
| **S4 — Data protection** | Encryption in transit & at rest; PII classified & minimized. | Classification VI.1 (AUTH-007); DP-1..7; tenant partitioning TEN-2/3; key separation DP-7; SEC-CTL-008/009/010. | ✅ Designed & enforced |

**Non-waivable gap scan result:** 0 unauthenticated exposed boundaries; 0 unprotected PII/sensitive
entities; 0 embedded secrets permitted by design. **Non-waivable gaps: 0.**

---

## Section XI — Approval-Required Security Operations (AUTH-008 §8)

The following are always Approval-Required (human approval mandatory; never autonomous):
security-policy or canon/gate changes; secret/credential creation, modification, or rotation;
external account creation / vendor onboarding with data access; granting or widening access scopes;
disabling or weakening any control; production deployment of security-relevant change. Designing
threat models and control mappings (this artifact) and running security scans/linters are Trusted
Operations.

---

## Section XII — Compliance Posture (summary; full report `UCOS-SEC-COMP-001`)

| Dimension | Result |
|-----------|:------:|
| Constitution Part X (Security Governance) | PASS |
| Constitution Part XI (Compliance Governance) | PASS |
| AUTH-008 §6 governance rules (1–7) | PASS |
| AUTH-008 §7 non-waivable (S1/S3/S4) | PASS (designed & enforced) |
| `GATE-SEC-001` design coverage (S1,S2,S4,S5,S6 designs; S3,S7 policies) | PASS |
| `GATE-DOC-001` (D1–D6) | PASS |
| Implementation leakage (technology/vendor/cloud/runtime) | NONE |

---

## Section XIII — Traceability (summary; full matrix `UCOS-SEC-TRACE-001`)

- **Authority:** AUTH-008, AUTH-003 (P6/IP-09/IP-10/IP-17), AUTH-007, AUTH-009, AUTH-010.
- **Constitution:** Part X (X.1–X.6), Part XI, Art. IX, Art. XII.
- **Upstream architecture:** `UCOS-DOM-ARCH-001` (28 contexts), `UCOS-PDATA-ARCH-001` (classification), `UCOS-PEA-001/002` (substrate), `UCOS-PEA-007` (control fabric), `UCOS-CAP-ARCH-001` (CAP-09/16/17).
- **Internal:** TB-01..10 → `UCOS-SEC-THREAT-001` → `SEC-CTL-001..020` (`UCOS-SEC-CONTROL-001`) → S1–S7 → realizing `PRS`.
- **ADRs:** `UCOS-SEC-ADR-001..008`.
- **Forward (downstream):** Prompt 07 (per-contract threat refinement, FO-1), Prompt 10 (control implementation), Prompt 11 (`GATE-SEC-001` verdict), Prompt 12 (certification).

---

## Section XIV — Constraints & Non-Generation Declaration

This architecture generates **no** source code, **no** control implementation, **no** infrastructure,
and selects **no** technology, vendor, cloud, datastore, runtime, container, orchestration, mesh,
broker, IdP, KMS/HSM, cipher suite, key length, protocol library, or policy engine. All such
selections are deferred to the technology-selection phase (ADRs, Prompt 08) and implementation
(Prompt 10). Per-contract threat models are deferred to and refined upon ratification of Prompt 07
contracts (forward obligation FO-1). The Constitution Article IX generation lock remains ACTIVE;
this is a design artifact only.

## Traceability
- **Refines:** `AUTH-008`, `AUTH-003`, `AUTH-007`, `AUTH-009`, `AUTH-010`, `UCOS-CONST-001` (Part X/XI), `GATE-SEC-001`, `GATE-DOC-001`, `UCOS-DOM-ARCH-001`, `UCOS-PDATA-ARCH-001`, `UCOS-CAP-ARCH-001`, `UCOS-PEA-001/002/003/007`, `PROMPT-09`.
- **Refined by:** `UCOS-SEC-THREAT-001`, `UCOS-SEC-CONTROL-001`, `UCOS-SEC-TRACE-001`, `UCOS-SEC-COMP-001`, `UCOS-SEC-DONE-001`, `UCOS-SEC-ADR-001..008`; Prompts 10, 11, 12.
- **Owner:** Security Governance (`UCOS-DOM-024`; CAP-17), subordinate to the Authority Board.

**END `UCOS-SEC-ARCH-001` — UCOS Security Architecture v1.0.0.**
