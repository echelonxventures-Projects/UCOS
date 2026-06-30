# UCOS — Security Threat Models (STRIDE)

| Field | Value |
|-------|-------|
| Artifact | **UCOS Security Threat Models** |
| Artifact ID | `UCOS-SEC-THREAT-001` |
| Version | 1.0.0 |
| Status | **CREATED — READY FOR RATIFICATION** |
| Parent | `UCOS-SEC-ARCH-001` (UCOS Security Architecture) |
| Phase | Phase 9 — Security Architecture (Prompt 09) |
| Methodology | **STRIDE** (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) |
| Owner | Security Architect (`UCOS-DOM-024`; CAP-17) |
| Date | 2026-06-30 |

> Threat models per **trust boundary** (TB-01..TB-10) and per **domain class**, with every threat
> mapped to ≥1 control in `UCOS-SEC-CONTROL-001`. Methodology decision: `UCOS-SEC-ADR-008`.

---

## 1. Threat Identifier Scheme

`UCOS-SEC-THREAT-<TB|DC>-<STRIDE-letter><n>` — e.g., `THREAT-TB01-S1` (Spoofing #1 at TB-01).
STRIDE letters: **S** Spoofing, **T** Tampering, **R** Repudiation, **I** Information disclosure,
**D** Denial of service, **E** Elevation of privilege.

---

## 2. Trust-Boundary Threat Models

### 2.1 TB-01 — External client ↔ platform (request/response; `PE-05`)

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-TB01-S1 | Spoofing | Caller impersonates a legitimate principal/tenant. | SEC-CTL-001, SEC-CTL-004, SEC-CTL-014 |
| THREAT-TB01-T1 | Tampering | Request/response payload altered in transit. | SEC-CTL-008, SEC-CTL-015 |
| THREAT-TB01-R1 | Repudiation | Caller denies having issued a request. | SEC-CTL-011, SEC-CTL-012 |
| THREAT-TB01-I1 | Information disclosure | Sensitive data exposed via response/error. | SEC-CTL-008, SEC-CTL-010, SEC-CTL-002 |
| THREAT-TB01-D1 | Denial of service | Flooding/abuse exhausts the boundary. | SEC-CTL-020, SEC-CTL-017 |
| THREAT-TB01-E1 | Elevation of privilege | Caller obtains rights beyond grant. | SEC-CTL-002, SEC-CTL-013 |

### 2.2 TB-02 — External producer/consumer ↔ event fabric (`PE-04`)

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-TB02-S1 | Spoofing | Forged event producer identity. | SEC-CTL-001, SEC-CTL-014 |
| THREAT-TB02-T1 | Tampering | Event payload modified or replayed. | SEC-CTL-008, SEC-CTL-016 |
| THREAT-TB02-R1 | Repudiation | Producer denies emitting an event. | SEC-CTL-011 |
| THREAT-TB02-I1 | Information disclosure | Over-broad subscription leaks data. | SEC-CTL-002, SEC-CTL-010, SEC-CTL-013 |
| THREAT-TB02-D1 | Denial of service | Event flood / poison messages. | SEC-CTL-020, SEC-CTL-016 |
| THREAT-TB02-E1 | Elevation of privilege | Subscriber reads beyond authorized topics/tenants. | SEC-CTL-002, SEC-CTL-003 |

### 2.3 TB-03 — Service ↔ service (inter-context; zero-trust)

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-TB03-S1 | Spoofing | One service impersonates another (no workload identity). | SEC-CTL-001, SEC-CTL-014 |
| THREAT-TB03-T1 | Tampering | Inter-service message altered. | SEC-CTL-008 |
| THREAT-TB03-I1 | Information disclosure | Lateral over-reach across context boundary. | SEC-CTL-002, SEC-CTL-013, SEC-CTL-017 |
| THREAT-TB03-D1 | Denial of service | A service overwhelms a dependency. | SEC-CTL-020 |
| THREAT-TB03-E1 | Elevation of privilege | Ambient-trust lateral movement. | SEC-CTL-001, SEC-CTL-017, SEC-CTL-013 |

### 2.4 TB-04 — Service ↔ data persistence (`PE-02`)

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-TB04-T1 | Tampering | Unauthorized data modification at rest. | SEC-CTL-009, SEC-CTL-002 |
| THREAT-TB04-I1 | Information disclosure | Data-at-rest exposure / cross-tenant read. | SEC-CTL-009, SEC-CTL-003, SEC-CTL-010 |
| THREAT-TB04-R1 | Repudiation | Data change without attributable record. | SEC-CTL-011 |
| THREAT-TB04-E1 | Elevation of privilege | Data-access broker bypass. | SEC-CTL-002, SEC-CTL-013 |

### 2.5 TB-05 — Service ↔ secrets/keys (`PE-09`)

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-TB05-S1 | Spoofing | Unauthorized identity resolves a secret reference. | SEC-CTL-005, SEC-CTL-002 |
| THREAT-TB05-I1 | Information disclosure | Secret/key leakage (in code/config/logs). | SEC-CTL-005, SEC-CTL-006, SEC-CTL-018 |
| THREAT-TB05-T1 | Tampering | Key substitution / unauthorized rotation. | SEC-CTL-006, SEC-CTL-007 |
| THREAT-TB05-E1 | Elevation of privilege | Stale/over-scoped credential abuse. | SEC-CTL-007, SEC-CTL-013 |

### 2.6 TB-06 — Principal ↔ identity/tenancy (`PE-08`)

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-TB06-S1 | Spoofing | Credential theft / session hijack. | SEC-CTL-001, SEC-CTL-004 |
| THREAT-TB06-E1 | Elevation of privilege | Tenant escape / cross-tenant authorization. | SEC-CTL-003, SEC-CTL-002 |
| THREAT-TB06-I1 | Information disclosure | Tenant context leakage. | SEC-CTL-003, SEC-CTL-010 |
| THREAT-TB06-R1 | Repudiation | Authn/authz decision not recorded. | SEC-CTL-011 |

### 2.7 TB-07 — Any ↔ audit/evidence (`PE-10`)

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-TB07-T1 | Tampering | Audit record alteration. | SEC-CTL-011, SEC-CTL-012 |
| THREAT-TB07-R1 | Repudiation | Evidence suppression/deletion. | SEC-CTL-011, SEC-CTL-012 |
| THREAT-TB07-I1 | Information disclosure | Sensitive value embedded in audit payload. | SEC-CTL-010, SEC-CTL-011 |
| THREAT-TB07-E1 | Elevation of privilege | Disabling audit capture. | SEC-CTL-012, SEC-CTL-013 |

### 2.8 TB-08 — Any ↔ registry/discovery (`PE-06`)

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-TB08-T1 | Tampering | Registry poisoning / rogue element registration. | SEC-CTL-002, SEC-CTL-014 |
| THREAT-TB08-S1 | Spoofing | Discovery resolves to an impostor element. | SEC-CTL-001, SEC-CTL-014 |
| THREAT-TB08-I1 | Information disclosure | Registry metadata over-exposure. | SEC-CTL-002, SEC-CTL-013 |

### 2.9 TB-09 — Any ↔ configuration/metadata (`PE-11`)

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-TB09-T1 | Tampering | Malicious configuration/policy change. | SEC-CTL-002, SEC-CTL-011 |
| THREAT-TB09-I1 | Information disclosure | Secrets co-mingled in configuration. | SEC-CTL-005, SEC-CTL-010 |
| THREAT-TB09-E1 | Elevation of privilege | Config-driven control weakening. | SEC-CTL-013, SEC-CTL-019 |

### 2.10 TB-10 — Operator/agent ↔ control plane (`PE-17`; privileged)

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-TB10-S1 | Spoofing | Impersonation of a privileged operator/agent. | SEC-CTL-001, SEC-CTL-004 |
| THREAT-TB10-R1 | Repudiation | Privileged change without attribution. | SEC-CTL-011 |
| THREAT-TB10-E1 | Elevation of privilege | Standing/over-broad privileged access. | SEC-CTL-013, SEC-CTL-019 |
| THREAT-TB10-T1 | Tampering | Unauthorized control-plane / control-fabric mutation. | SEC-CTL-002, SEC-CTL-019 |

---

## 3. Domain-Class Threat Models

The 28 bounded contexts (`UCOS-DOM-001..028`) are threat-modeled by class; each inherits the
boundary threat models above for any boundary it exposes.

### 3.1 Core (UCOS-DOM-001..011) — commercial transaction

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-DC-CORE-I1 | Information disclosure | PII (`PD-01/02`) / financial (`PD-07/09`) exposure (Payments, Billing, Settlement, Customer & CRM). | SEC-CTL-008, SEC-CTL-009, SEC-CTL-010, SEC-CTL-003 |
| THREAT-DC-CORE-T1 | Tampering | Price/order/payment manipulation. | SEC-CTL-002, SEC-CTL-015, SEC-CTL-016 |
| THREAT-DC-CORE-E1 | Elevation of privilege | Cross-tenant order/payment access. | SEC-CTL-003, SEC-CTL-002, SEC-CTL-013 |
| THREAT-DC-CORE-R1 | Repudiation | Disputed financial transaction. | SEC-CTL-011, SEC-CTL-012 |

### 3.2 Supporting (UCOS-DOM-012..016)

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-DC-SUPP-I1 | Information disclosure | Supplier/marketplace/communication/document data leakage. | SEC-CTL-008, SEC-CTL-009, SEC-CTL-010 |
| THREAT-DC-SUPP-T1 | Tampering | Content/document integrity loss. | SEC-CTL-009, SEC-CTL-002 |
| THREAT-DC-SUPP-E1 | Elevation of privilege | Over-broad partner access. | SEC-CTL-002, SEC-CTL-013 |

### 3.3 Cross-Cutting (UCOS-DOM-017..021) — Identity & Access, Config & Metadata, Workflow, Intelligence, Observability

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-DC-XC-S1 | Spoofing | Identity/credential compromise (Identity & Access). | SEC-CTL-001, SEC-CTL-004, SEC-CTL-005 |
| THREAT-DC-XC-T1 | Tampering | Config/workflow/policy tampering. | SEC-CTL-002, SEC-CTL-011 |
| THREAT-DC-XC-I1 | Information disclosure | Telemetry/intelligence leakage of sensitive data. | SEC-CTL-010, SEC-CTL-008 |
| THREAT-DC-XC-E1 | Elevation of privilege | Cross-cutting service over-reach. | SEC-CTL-013, SEC-CTL-017 |

### 3.4 Governance (UCOS-DOM-022..025) — Governance, Compliance, Security, Policy

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-DC-GOV-T1 | Tampering | Policy/compliance evidence tampering. | SEC-CTL-011, SEC-CTL-012, SEC-CTL-002 |
| THREAT-DC-GOV-R1 | Repudiation | Governance decision without attribution. | SEC-CTL-011 |
| THREAT-DC-GOV-E1 | Elevation of privilege | Unauthorized control weakening/waiver. | SEC-CTL-013, SEC-CTL-019 |
| THREAT-DC-GOV-I1 | Information disclosure | Restricted-Security data (`PD-13`) exposure. | SEC-CTL-005, SEC-CTL-009, SEC-CTL-010 |

### 3.5 Platform (UCOS-DOM-026..028) — Integration & Federation, Registry, Experience Delivery

| Threat | STRIDE | Description | Mapped controls |
|--------|--------|-------------|-----------------|
| THREAT-DC-PLT-S1 | Spoofing | Federated partner / registry impersonation. | SEC-CTL-001, SEC-CTL-014 |
| THREAT-DC-PLT-T1 | Tampering | Integration payload / registry tampering. | SEC-CTL-008, SEC-CTL-015, SEC-CTL-002 |
| THREAT-DC-PLT-D1 | Denial of service | Experience/integration boundary abuse. | SEC-CTL-020, SEC-CTL-017 |
| THREAT-DC-PLT-I1 | Information disclosure | Experience over-exposure of data. | SEC-CTL-002, SEC-CTL-010 |

---

## 4. Coverage Summary

| Dimension | Count |
|-----------|------:|
| Trust boundaries modeled | 10 (TB-01..TB-10) |
| Domain classes modeled | 5 (Core, Supporting, Cross-Cutting, Governance, Platform) |
| Boundary threats | 43 |
| Domain-class threats | 19 |
| **Total threats** | **62** |
| Threats mapped to ≥1 control | 62 / 62 (100%) |
| Unmapped threats | **0** |
| STRIDE categories covered per exposed boundary (TB-01/TB-02) | 6/6 |

---

## 5. Residual-Risk Posture

All modeled threats are mitigated by ≥1 designed control; no threat is accepted without mitigation at
the architecture level. Quantitative residual-risk scoring against concrete implementation is performed
in Prompt 11 (`GATE-SEC-001`) once controls are implemented (Prompt 10).

## 6. Forward Obligations

| ID | Obligation | Trigger |
|----|-----------|---------|
| **FO-1** | Derive a **per-contract** threat model for every exposed API/event/data contract, inheriting the relevant TB-0x model and control set. | Ratification of Prompt 07 contracts |
| **FO-2** | Add a **dependency-vulnerability** threat assessment (S7) per implemented component. | Prompt 10 implementation |
| **FO-3** | Re-score residual risk against implementation. | Prompt 11 `GATE-SEC-001` |

## Traceability
- **Refines:** `UCOS-SEC-ARCH-001`, `AUTH-008` §6.5, `UCOS-DOM-ARCH-001`, `UCOS-PDATA-ARCH-001`, `UCOS-PEA-002`.
- **Refined by:** `UCOS-SEC-CONTROL-001`, `UCOS-SEC-TRACE-001`; Prompts 10–12.
- **Owner:** Security Governance (`UCOS-DOM-024`; CAP-17).

**END `UCOS-SEC-THREAT-001` — 62 threats, 0 unmapped.**
