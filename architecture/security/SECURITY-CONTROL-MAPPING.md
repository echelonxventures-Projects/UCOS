# UCOS — Security Control Catalog & Mapping

| Field | Value |
|-------|-------|
| Artifact | **UCOS Security Control Catalog & Mapping** |
| Artifact ID | `UCOS-SEC-CONTROL-001` |
| Version | 1.0.0 |
| Status | **CREATED — READY FOR RATIFICATION** |
| Parent | `UCOS-SEC-ARCH-001` |
| Phase | Phase 9 — Security Architecture (Prompt 09) |
| Owner | Security Architect (`UCOS-DOM-024`; CAP-17) |
| Date | 2026-06-30 |

> The canonical security control catalog (`SEC-CTL-001..020`), each control mapped to its
> `GATE-SEC-001` checkpoint(s), the threats it mitigates (`UCOS-SEC-THREAT-001`), and the
> technology-neutral platform service(s) that realize it. **No control is implemented in code here.**

---

## 1. Control Catalog (`SEC-CTL-001..020`)

| Control ID | Name | Purpose | Checkpoint(s) | Realizing service(s) | Non-waivable |
|-----------|------|---------|:-------------:|----------------------|:------------:|
| SEC-CTL-001 | Authentication | Verify principal identity at every boundary/hop. | S1 | `PRS-031` | **S1** |
| SEC-CTL-002 | Authorization (deny-by-default) | Evaluate every access against governed policy. | S1, S5 | `PRS-032` | **S1** |
| SEC-CTL-003 | Tenancy isolation | Bind every access to one tenant; prevent cross-tenant. | S1, S4, S5 | `PRS-033` | **S1/S4** |
| SEC-CTL-004 | Session & token integrity | Issue/validate/revoke bounded sessions & tokens. | S1 | `PRS-034` | **S1** |
| SEC-CTL-005 | Secret vaulting & injection | Issue & resolve secrets by reference; never embed. | S3 | `PRS-035`, `PRS-038` | **S3** |
| SEC-CTL-006 | Key lifecycle | Govern key generation/use/destruction. | S3, S4 | `PRS-036` | **S3** |
| SEC-CTL-007 | Secret/key rotation | Enforce defined rotation (Approval-Required). | S3 | `PRS-037` | **S3** |
| SEC-CTL-008 | Encryption in transit | Protect data on every boundary & inter-service hop. | S4 | `PRS-010`, `PRS-011`, `PRS-018/019` | **S4** |
| SEC-CTL-009 | Encryption at rest | Protect persisted data; externalized keys. | S4 | `PRS-005`, `PRS-036` | **S4** |
| SEC-CTL-010 | PII classification & minimization | Apply classification-driven protection; minimize. | S4 | classification (AUTH-007) + `PRS-006` | **S4** |
| SEC-CTL-011 | Immutable audit capture | Capture security events immutably & attributably. | S6 | `PRS-039`, `PRS-040` | — |
| SEC-CTL-012 | Audit integrity & attestation | Tamper-evidence + attestation of audit evidence. | S6 | `PRS-041`, `PRS-042` | — |
| SEC-CTL-013 | Least-privilege scoping | Scope every grant to the minimum required. | S5 | `PRS-032`, `PRS-033` | — |
| SEC-CTL-014 | Boundary authn/authz enforcement | Enforce S1 at gateway/event ingress/egress. | S1 | `PRS-018/019`, `PRS-013/015` + `PRS-031/032` | **S1** |
| SEC-CTL-015 | Input/contract validation | Validate/conform inputs at the boundary. | S2 | `PRS-018`, `PRS-020` | — |
| SEC-CTL-016 | Idempotency & replay protection | Reject replayed/duplicate messages. | S2 | `PRS-016`, `PRS-052` | — |
| SEC-CTL-017 | Network segmentation / zero-trust transport | Segment & restrict lateral movement. | S5 | `PRS-010`, `PRS-011` | — |
| SEC-CTL-018 | Dependency-risk governance | Pin deps; vuln-scan clean or risk-accepted. | S7 | Control Fabric `UCOS-PEA-007`; governance | — |
| SEC-CTL-019 | Threat-modeling & control discipline | Require threat model + control mapping per change. | S2 | process (this artifact set) | — |
| SEC-CTL-020 | Rate limiting / DoS resistance | Bound throughput; resist abuse/flooding. | S2 (availability) | `PRS-011` | — |

> Non-waivable controls (per AUTH-008 §7 / Const. X.5): **S1** → SEC-CTL-001/002/003/004/014;
> **S3** → SEC-CTL-005/006/007; **S4** → SEC-CTL-003/008/009/010.

---

## 2. Checkpoint → Control Coverage (`GATE-SEC-001` S1–S7)

| Checkpoint | Criterion | Controls | Design status |
|-----------|-----------|----------|:-------------:|
| **S1** | AuthN/AuthZ on every exposed boundary | SEC-CTL-001, 002, 003, 004, 014 | ✅ Designed (non-waivable) |
| **S2** | Threats modeled & mapped to controls | SEC-CTL-015, 016, 019, 020 + `UCOS-SEC-THREAT-001` | ✅ Designed |
| **S3** | Secrets vault-managed; rotation defined | SEC-CTL-005, 006, 007 | ✅ Designed (non-waivable) |
| **S4** | Encryption in transit/at rest; PII classified & minimized | SEC-CTL-003, 008, 009, 010 | ✅ Designed (non-waivable) |
| **S5** | Least privilege | SEC-CTL-013, 003, 017 | ✅ Designed |
| **S6** | Immutable audit logging | SEC-CTL-011, 012 | ✅ Designed |
| **S7** | Dependency risk pinned/scanned | SEC-CTL-018 | ✅ Policy defined (verified at Prompt 10/11) |

**Checkpoint coverage: 7/7.** S1, S2, S4, S5, S6 carry full designs; S3, S7 carry defined policies
(per Prompt 09 §11 design-coverage requirement). All non-waivable checkpoints (S1/S3/S4) are designed.

---

## 3. Threat → Control Matrix (from `UCOS-SEC-THREAT-001`)

| Boundary / class | Threats | Mapped controls | Unmapped |
|------------------|--------:|-----------------|:--------:|
| TB-01 | 6 | 001,002,004,008,010,011,012,013,014,015,017,020 | 0 |
| TB-02 | 6 | 001,002,003,008,010,011,013,014,016,020 | 0 |
| TB-03 | 5 | 001,002,008,013,014,017,020 | 0 |
| TB-04 | 4 | 002,003,009,010,011,013 | 0 |
| TB-05 | 4 | 002,005,006,007,013,018 | 0 |
| TB-06 | 4 | 001,002,003,004,010,011 | 0 |
| TB-07 | 4 | 010,011,012,013 | 0 |
| TB-08 | 3 | 001,002,013,014 | 0 |
| TB-09 | 3 | 002,005,010,011,013,019 | 0 |
| TB-10 | 4 | 001,002,004,011,013,019 | 0 |
| DC-Core | 4 | 002,003,008,009,010,011,012,013,015,016 | 0 |
| DC-Supporting | 3 | 002,008,009,010,013 | 0 |
| DC-Cross-Cutting | 4 | 001,002,004,005,008,010,011,013,017 | 0 |
| DC-Governance | 4 | 002,005,009,010,011,012,013,019 | 0 |
| DC-Platform | 4 | 001,002,008,010,014,015,017,020 | 0 |
| **Total** | **62** | **all → ≥1 control** | **0** |

---

## 4. Control → Realization Integrity

Every control maps to ≥1 ratified platform runtime service (`PRS-xxx`) or governed process; the
realizing services exist in `UCOS-PEA-002` (Runtime & Service) and are bound by their governance
(`PEG`), ownership (`PEO`), and boundary (`PEB`) models. No control depends on an unratified or
nonexistent construct. **Controls without a realizer: 0.**

## 5. Data-Domain → Protection-Control Coverage (S4)

| Sensitivity class | PD domains | Mandatory controls | Covered |
|-------------------|------------|--------------------|:-------:|
| Restricted-PII | PD-01, PD-02 | 003, 008, 009, 010 | ✅ |
| Restricted-Financial | PD-07, PD-09 | 003, 008, 009, 010, 011 | ✅ |
| Restricted-Security | PD-13 | 005, 006, 009, 010, 012 | ✅ |
| Regulated-Evidentiary | PD-10 | 009, 011, 012 | ✅ |
| Confidential | PD-05,06,08,11,12,16 | 008, 009, 010, 013 | ✅ |
| Internal (Public subset) | PD-03, PD-04 | 008, 015 | ✅ |
| Internal | PD-14, PD-15, PD-17 | 008 | ✅ |

**Sensitive-data domains without a protection control: 0.**

## Traceability
- **Refines:** `UCOS-SEC-ARCH-001`, `UCOS-SEC-THREAT-001`, `AUTH-008` §6/§7, `GATE-SEC-001`, `UCOS-PEA-002`, `UCOS-PEA-007`, `UCOS-PDATA-ARCH-001`.
- **Refined by:** `UCOS-SEC-TRACE-001`, `UCOS-SEC-COMP-001`; Prompts 10–12.
- **Owner:** Security Governance (`UCOS-DOM-024`; CAP-17).

**END `UCOS-SEC-CONTROL-001` — 20 controls; 7/7 checkpoints; 0 unmapped threats; 0 unrealized controls.**
