# UCOS — Security Traceability Matrix

| Field | Value |
|-------|-------|
| Artifact | **UCOS Security Traceability Matrix** |
| Artifact ID | `UCOS-SEC-TRACE-001` |
| Version | 1.0.0 |
| Status | **CREATED — READY FOR RATIFICATION** |
| Parent | `UCOS-SEC-ARCH-001` |
| Phase | Phase 9 — Security Architecture (Prompt 09) |
| Owner | Security Architect (`UCOS-DOM-024`; CAP-17) |
| Date | 2026-06-30 |

> Bidirectional lineage: **Authority/Constitution → security principle → boundary → threat → control
> → checkpoint → realizing service**, plus **sensitive-data → protection control** and **ADR → decision**.
> Satisfies AUTH-010 (no-orphan) and PROMPT-09 §9 traceability rules.

---

## 1. Authority & Constitution → Security Principle

| Source | Principle(s) |
|--------|--------------|
| AUTH-008 §6.1 / Const. X.1, X.2 | SP-01 Zero Trust, SP-03 Least Privilege |
| AUTH-008 §6.2 / Const. X.3, X.5 | SP-02 AuthN/AuthZ (S1) |
| AUTH-008 §6.3 / Const. X.5 | SP-04 Secrets (S3) |
| AUTH-008 §6.4 / Const. X.5 / AUTH-007 | SP-05 Data Protection (S4) |
| AUTH-008 §6.5 / Const. X.3 | SP-06 Threats Modeled (S2) |
| AUTH-008 §6.6 / Const. X.4 / IP-10 | SP-07 Auditability (S6) |
| Const. X.3 | SP-08 Defense in Depth |
| AUTH-008 §6.7 | SP-09 Dependency Risk (S7) |
| AUTH-008 §7/§8 / Const. X.5/X.6 / IP-17 | SP-10 Autonomy Never Weakens Security |

## 2. Exposed/Trust Boundary → Threat Model → Control(s) → Checkpoint(s) → Realization

| Boundary | Threat model | Controls | Checkpoints | Realizing service(s) |
|----------|--------------|----------|-------------|----------------------|
| TB-01 client↔platform | THREAT-TB01-{S1,T1,R1,I1,D1,E1} | 001,002,004,008,010,011,012,013,014,015,017,020 | S1,S2,S4,S5,S6 | `PRS-018..021`,`PRS-031/032/034` |
| TB-02 event fabric | THREAT-TB02-{S1,T1,R1,I1,D1,E1} | 001,002,003,008,010,011,013,014,016,020 | S1,S2,S4,S5,S6 | `PRS-013..017`,`PRS-031/032` |
| TB-03 service↔service | THREAT-TB03-{S1,T1,I1,D1,E1} | 001,002,008,013,014,017,020 | S1,S2,S5 | `PRS-009..012`,`PRS-031/032` |
| TB-04 service↔data | THREAT-TB04-{T1,I1,R1,E1} | 002,003,009,010,011,013 | S4,S5,S6 | `PRS-005..008`,`PRS-036` |
| TB-05 service↔secrets | THREAT-TB05-{S1,I1,T1,E1} | 002,005,006,007,013,018 | S3,S5 | `PRS-035..038` |
| TB-06 principal↔identity | THREAT-TB06-{S1,E1,I1,R1} | 001,002,003,004,010,011 | S1,S5,S6 | `PRS-031..034` |
| TB-07 ↔audit | THREAT-TB07-{T1,R1,I1,E1} | 010,011,012,013 | S6 | `PRS-039..042` |
| TB-08 ↔registry | THREAT-TB08-{T1,S1,I1} | 001,002,013,014 | S1,S5 | `PRS-022..025` |
| TB-09 ↔config | THREAT-TB09-{T1,I1,E1} | 002,005,010,011,013,019 | S2,S3,S5,S6 | `PRS-043..` (`PRD-011`) |
| TB-10 ↔control plane | THREAT-TB10-{S1,R1,E1,T1} | 001,002,004,011,013,019 | S1,S5,S6 | `PE-17`; `UCOS-PEA-007` |

## 3. Domain Class → Threat → Control

| Domain class | Domains | Threats | Controls |
|--------------|---------|---------|----------|
| Core | UCOS-DOM-001..011 | DC-CORE-{I1,T1,E1,R1} | 002,003,008,009,010,011,012,013,015,016 |
| Supporting | UCOS-DOM-012..016 | DC-SUPP-{I1,T1,E1} | 002,008,009,010,013 |
| Cross-Cutting | UCOS-DOM-017..021 | DC-XC-{S1,T1,I1,E1} | 001,002,004,005,008,010,011,013,017 |
| Governance | UCOS-DOM-022..025 | DC-GOV-{T1,R1,E1,I1} | 002,005,009,010,011,012,013,019 |
| Platform | UCOS-DOM-026..028 | DC-PLT-{S1,T1,D1,I1} | 001,002,008,010,014,015,017,020 |

## 4. Sensitive Data → Protection Control (S4)

| Sensitivity class | PD domains | Owning context | Protection controls |
|-------------------|------------|----------------|---------------------|
| Restricted-PII | PD-01, PD-02 | DOM-017 Identity & Access / Party (shared language) | 003,008,009,010 |
| Restricted-Financial | PD-07, PD-09 | DOM-006 Payments / DOM-007 Billing / DOM-008 Settlement | 003,008,009,010,011 |
| Restricted-Security | PD-13 | DOM-024 Security | 005,006,009,010,012 |
| Regulated-Evidentiary | PD-10 | DOM-023 Compliance | 009,011,012 |
| Confidential | PD-05,06,08,11,12,16 | DOM-004/005/009/025/021/020 | 008,009,010,013 |
| Internal (Public subset) | PD-03, PD-04 | DOM-003/001 | 008,015 |
| Internal | PD-14,15,17 | platform/governance | 008 |

## 5. Control → Checkpoint → Non-Waivable Flag

| Control | Checkpoint(s) | Non-waivable |
|---------|:-------------:|:------------:|
| SEC-CTL-001 | S1 | S1 |
| SEC-CTL-002 | S1,S5 | S1 |
| SEC-CTL-003 | S1,S4,S5 | S1/S4 |
| SEC-CTL-004 | S1 | S1 |
| SEC-CTL-005 | S3 | S3 |
| SEC-CTL-006 | S3,S4 | S3 |
| SEC-CTL-007 | S3 | S3 |
| SEC-CTL-008 | S4 | S4 |
| SEC-CTL-009 | S4 | S4 |
| SEC-CTL-010 | S4 | S4 |
| SEC-CTL-011 | S6 | — |
| SEC-CTL-012 | S6 | — |
| SEC-CTL-013 | S5 | — |
| SEC-CTL-014 | S1 | S1 |
| SEC-CTL-015 | S2 | — |
| SEC-CTL-016 | S2 | — |
| SEC-CTL-017 | S5 | — |
| SEC-CTL-018 | S7 | — |
| SEC-CTL-019 | S2 | — |
| SEC-CTL-020 | S2 | — |

## 6. ADR → Decision Coverage

| ADR | Decision | Anchors |
|-----|----------|---------|
| UCOS-SEC-ADR-001 | Zero-trust boundary enforcement model | SP-01/02/08; S1 |
| UCOS-SEC-ADR-002 | Identity & authentication architecture | SP-02; AUTHN-1..6; S1 |
| UCOS-SEC-ADR-003 | Authorization model (deny-by-default, RBAC+ABAC) | SP-03; V.1..3; S1/S5 |
| UCOS-SEC-ADR-004 | Tenancy isolation model | TEN-1..4; S1/S4/S5 |
| UCOS-SEC-ADR-005 | Secrets & key management policy | SP-04; SEC-1..6; S3 |
| UCOS-SEC-ADR-006 | Data protection model | SP-05; DP-1..7; S4 |
| UCOS-SEC-ADR-007 | Immutable audit-logging architecture | SP-07; AUD-1..7; S6 |
| UCOS-SEC-ADR-008 | Threat-modeling methodology (STRIDE) | SP-06; S2 |

## 7. Forward (Downstream) Lineage

| Target | Inherits |
|--------|----------|
| Prompt 07 contracts | Per-contract threat model (FO-1) inheriting TB-0x + control set |
| Prompt 10 implementation | Realizes SEC-CTL-001..020; FO-2 dependency vuln assessment |
| Prompt 11 `GATE-SEC-001` | Verifies S1–S7 against implementation; FO-3 residual re-score |
| Prompt 12 certification | Requires security posture verified |

## 8. Integrity Result

| Check | Result |
|-------|:------:|
| Boundaries with ≥1 threat model | 10/10 |
| Threats mapped to ≥1 control | 62/62 |
| Controls mapped to ≥1 checkpoint | 20/20 |
| Controls mapped to ≥1 realizer | 20/20 |
| Sensitive-data domains with ≥1 protection control | 17/17 PD |
| Non-waivable checkpoints designed | S1, S3, S4 (3/3) |
| Orphan threats / orphan controls / silent open surfaces | 0 / 0 / 0 |

## Traceability
- **Refines:** `UCOS-SEC-ARCH-001`, `UCOS-SEC-THREAT-001`, `UCOS-SEC-CONTROL-001`, `AUTH-008`, `AUTH-010`, `UCOS-CONST-001` (Part X), `GATE-SEC-001`.
- **Refined by:** `UCOS-SEC-COMP-001`, `UCOS-SEC-DONE-001`; Prompts 10–12.
- **Owner:** Security Governance (`UCOS-DOM-024`; CAP-17).

**END `UCOS-SEC-TRACE-001` — 0 orphans; full lineage.**
