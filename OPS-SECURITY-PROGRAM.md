# OPS — LIVE SECURITY VERIFICATION PROGRAM (ACT 7 SECURITY TRACK / G12-1∧G12-2)

> **PHASE E.1 · OPERATIONAL EVIDENCE EXECUTION PROGRAM · READ-ONLY GOVERNANCE ANALYSIS**
> **NO CODE · NO IMPLEMENTATION · NO ENVIRONMENT CREATION · NO PIPELINE EXECUTION · NO CERTIFICATION ISSUANCE · NO GOVERNANCE MUTATION**
> Describes the executable work packages that verify live security enforcement on the operational substrate. Verifies nothing here.

| Field | Value |
|-------|-------|
| Artifact ID | `OPS-SECURITY-PROGRAM` |
| Phase | **E.1** · Version 1.0.0 · Date 2026-07-03 |
| Scope | Live security verification (`REM-09`) — the security portion of condition C-F, spanning G12-1 (provision-time) and G12-2 (runtime). |
| Assumption | Act 6 substrate provisioned with S1/S3/S4 enforced (EP-4); pipeline able to deploy services (Act 7). |
| Inputs (read-only) | `UCOS-EVIDENCE-REQUIREMENTS` (EO-4), `ARTICLE-IX-EVIDENCE-MATRIX` (EO-4), `ARTICLE-IX-CLOSURE-CHECKLIST` (AC-11); source refs `SEC-CTL-001..020`, non-waivable `S1/S3/S4`, `OP-CERT-001` Track 2, mesh allow-rules (`REM-21` / `PHASE-12.0` G12-5). |
| Human-gate | Human/CA-executed on the live substrate. The agent executes none of it. |

---

## 0. Scope

Design-time security is already ratified; this program produces **live, measured proof** that the substrate enforces:
- **mTLS STRICT** on every mesh edge,
- **deny-by-default** authorization (unauthorized calls rejected),
- **non-waivable S1/S3/S4** (secrets by reference, public keys by reference, custody separation),
- **least-privilege mesh allow-rules**.

It produces **EO-4** (live HA/mTLS/backup proof, security portion) and closes the security track of the Operational Certification.

---

## 1. Work Packages

### SP-1 — Verify mTLS STRICT on all mesh edges
| Field | Detail |
|-------|--------|
| Inputs | Provisioned mesh (EP-4); `SEC-CTL-*` mTLS policy. |
| Outputs | Observation that every service-to-service edge negotiates mTLS STRICT; plaintext rejected. |
| Dependencies | Act 6 (EP-4), Act 7 services deployed (PP-5). |
| Evidence produced | mTLS edge report (feeds EO-4). |
| Certification impact | Security track (transport) of G12-1/UCC-4. |
| Exit criteria | 100% of mesh edges STRICT; no permissive/plaintext edge observed. |

### SP-2 — Verify deny-by-default authorization
| Field | Detail |
|-------|--------|
| Inputs | Authz policy; negative-test call set (unauthorized principals/paths). |
| Outputs | Demonstration that unauthorized calls are denied by default. |
| Dependencies | SP-1. |
| Evidence produced | Authz negative-test transcript (feeds EO-4). |
| Certification impact | Security track (authz). |
| Exit criteria | Every unauthorized call denied; no implicit-allow path found. |

### SP-3 — Demonstrate non-waivable S1/S3/S4
| Field | Detail |
|-------|--------|
| Inputs | Secret store (by-reference); key registry (public-by-reference); custody-separation config (S4). |
| Outputs | Proof no plaintext secret exists in config/runtime; keys referenced only; signing custody disjoint from CI/authoring. |
| Dependencies | EP-4. |
| Evidence produced | S1/S3/S4 enforcement transcript (feeds EO-4). |
| Certification impact | Non-waivable-control track; also underpins IA key-separation for dual-witness. |
| Exit criteria | S1/S3/S4 demonstrably enforced; zero plaintext secret material. |

### SP-4 — Populate + verify least-privilege mesh allow-rules
| Field | Detail |
|-------|--------|
| Inputs | Service topology; `REM-21` allow-rule set; least-privilege policy. |
| Outputs | Explicit allow-rule per service edge; default-deny confirmed. |
| Dependencies | PP-5 (services promoted), SP-1. |
| Evidence produced | Allow-rule inventory + default-deny confirmation (feeds EO-4). |
| Certification impact | Boundary-integrity track; hardens against RK-5. |
| Exit criteria | Every edge has explicit least-privilege rule; no wildcard allow. |

### SP-5 — Consolidate live-security evidence
| Field | Detail |
|-------|--------|
| Inputs | SP-1..SP-4 outputs. |
| Outputs | Immutable **live-security evidence pack** (EO-4). |
| Dependencies | SP-1..SP-4. |
| Evidence produced | **EO-4** (live HA/mTLS/backup proof — security portion). |
| Certification impact | Closes the security track feeding UCC-4. |
| Exit criteria | Pack complete, hash-logged, IA-attestable. |

---

## 2. Dependency Order

```
EP-4 (Act 6) ─► SP-1 (mTLS) ─► SP-2 (deny-default)
                     │
PP-5 (Act 7) ────────┼─► SP-4 (mesh allow-rules)
                     └─► SP-3 (S1/S3/S4) ─► SP-5 (evidence pack)  ⟶ security track CLOSED
```

---

## 3. Evidence Summary

| Evidence ID | Description | Gate |
|:-----------:|-------------|:----:|
| EO-4 | Live HA/mTLS/backup proof (security portion) | G12-1 / G12-2 |

> The HA/backup portion of EO-4 is completed by `OPS-DR-PROGRAM` (Act 8); this program owns the mTLS + authz + control-enforcement portion.

---

## 4. Certification Impact
- Closes the **security / non-waivable-control tracks** of `OP-CERT-001`, which are prerequisites of **UCC-4 (Act 9)**.
- Independently establishes the key-custody separation (S4) that the **G4 dual-witness** relies upon.

## 5. Exit Criteria
1. mTLS STRICT on 100% of mesh edges.
2. Deny-by-default authz proven via negative tests.
3. S1/S3/S4 enforced; zero plaintext secrets.
4. Least-privilege allow-rules on every edge; default-deny confirmed.
5. Live-security evidence pack (EO-4 security portion) immutable + IA-attestable.

## Governance / Non-Mutation Statement
No security control was configured, enabled, or verified; no environment touched; no evidence produced. All packages are future human/CA-executed verifications on the live substrate. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged. Read-only analysis.

**END OPS-SECURITY-PROGRAM — SECURITY TRACK · 5 WORK PACKAGES (SP-1..SP-5) · EVIDENCE = LIVE-SECURITY PROOF (EO-4) · mTLS STRICT + DENY-BY-DEFAULT + S1/S3/S4 + LEAST-PRIVILEGE.**
