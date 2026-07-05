# OPS — ENVIRONMENT PROVISIONING PROGRAM (ACT 6 / G12-1)

> **PHASE E.1 · OPERATIONAL EVIDENCE EXECUTION PROGRAM · READ-ONLY GOVERNANCE ANALYSIS**
> **NO CODE · NO IMPLEMENTATION · NO ENVIRONMENT CREATION · NO PIPELINE EXECUTION · NO CERTIFICATION ISSUANCE · NO GOVERNANCE MUTATION**
> This program **describes** the executable work packages for Act 6. It provisions nothing; every package is a future human-executed, Board-approved operation.

| Field | Value |
|-------|-------|
| Artifact ID | `OPS-ENVIRONMENT-PROGRAM` |
| Phase | **E.1** · Version 1.0.0 · Date 2026-07-03 |
| Act | **Act 6 — Environment Provisioning** (gate **G12-1**, condition C-F, `REAL-C-02`) |
| Assumption | REAL-C-05 CLOSED; front wave (Acts 1–5) available; PE-12 ADR decided; corpus durable; NFR floors authored; `AD-0009` real-spend envelope approved. |
| Inputs (read-only) | `ARTICLE-IX-READINESS-REPORT` (act 6), `ARTICLE-IX-CRITICAL-PATH` (bottleneck), `ARTICLE-IX-EVIDENCE-MATRIX` (EO-1/EV-3), `UCOS-EVIDENCE-REQUIREMENTS` (EO-1, EV-3, EV-4), `UCOS-FULL-GO-PATH` (step 5); source refs `AD-0015`, `AD-0009`, `UCOS-RA1-ENV-001` (READY TO PROVISION), `SEC-CTL-001..020`, non-waivable `S1/S3/S4`. |
| Human-gate | **ALL packages are human-executed with real cloud spend under `AD-0015` + `AD-0009`. The agent executes none of it.** |
| Legend | (H) human/real-spend · (B) Board act · ✅ precondition assumed |

---

## 0. Scope

Act 6 stands up the **non-production evidence substrate** — **ENV-DEV** and **ENV-INT** — **internal-only** (`external_exposure=false`), with non-waivable security controls enforced from the first byte, so that Acts 7 (pipeline/contracts) and 8 (DR/NFR) have a real system to run against. Act 6 closes **G12-1** and produces the **provisioning attestation** (EO-1 / EV-3).

---

## 1. Work Packages

### EP-1 — Real-spend authorization confirmation (governance precondition)
| Field | Detail |
|-------|--------|
| Inputs | `AD-0015` (activity-class limited-evidence authorization), `AD-0009` (real-spend Approval-Required), NFR floors (`REAL-M-06`), PE-12 ADR. |
| Outputs | Confirmed spend envelope + named executor operator; provisioning authorized within the non-production carve-out. |
| Dependencies | Acts 1–5 (front wave); Board (B). |
| Evidence produced | AD-0009 approval record referenced (governance evidence, not operational). |
| Certification impact | Enables G12-1; no direct track closure. |
| Exit criteria | Spend envelope approved; scope explicitly non-production, internal-only; executor named. |

### EP-2 — Provision ENV-DEV (internal-only)
| Field | Detail |
|-------|--------|
| Inputs | `UCOS-RA1-ENV-001` provisioning spec; `AD-0015` scope; PE-12 telemetry config; IaC definitions (design-only today). |
| Outputs | Running ENV-DEV; `external_exposure=false`; network isolation; observability wired per PE-12. |
| Dependencies | EP-1. |
| Evidence produced | ENV-DEV provisioning record + topology manifest (feeds EO-1). |
| Certification impact | Partial G12-1 (dev tier). |
| Exit criteria | ENV-DEV reachable internally only; telemetry emitting; no public ingress. |

### EP-3 — Provision ENV-INT (integration tier)
| Field | Detail |
|-------|--------|
| Inputs | Same spec as EP-2; ENV-DEV baseline. |
| Outputs | Running ENV-INT; internal-only; promotion target for the pipeline (Act 7). |
| Dependencies | EP-2 (consistent baseline). |
| Evidence produced | ENV-INT provisioning record + topology manifest (feeds EO-1). |
| Certification impact | Completes provisioning-tier scope of G12-1. |
| Exit criteria | ENV-INT reachable internally only; ready as pipeline promotion target. |

### EP-4 — Enforce non-waivable controls at provision time (S1/S3/S4)
| Field | Detail |
|-------|--------|
| Inputs | `SEC-CTL-001..020`; non-waivable `S1` (secrets-by-reference), `S3` (public keys by reference), `S4` (custody separation); mTLS baseline config. |
| Outputs | mTLS enabled on all mesh edges; secrets by reference only (no plaintext); deny-by-default network posture staged for verification in `OPS-SECURITY-PROGRAM`. |
| Dependencies | EP-2, EP-3. |
| Evidence produced | Control-enforcement configuration snapshot (feeds EO-4 / live-security proof in Act 7). |
| Certification impact | Precondition for the security track; hard prerequisite of the provisioning attestation. |
| Exit criteria | S1/S3/S4 demonstrably enforced in configuration; no secret material in plaintext; mTLS on by default. |

### EP-5 — Capture provisioning attestation (G12-1 evidence)
| Field | Detail |
|-------|--------|
| Inputs | EP-2/EP-3 provisioning records; EP-4 control snapshot; PI-7 hash-chain audit for immutability. |
| Outputs | **Provisioning attestation (G12-1)** — immutable, hash-logged, IA-attestable. |
| Dependencies | EP-2, EP-3, EP-4. |
| Evidence produced | **EO-1** (provisioning attestation) · **EV-3** (ENV-DEV/INT provisioned, internal-only, S1/S3/S4). |
| Certification impact | **Closes G12-1**; provisioning track of the Operational Certification. |
| Exit criteria | Provisioning attestation captured, hash-chained, ready for IA attestation at Act 9. |

---

## 2. Package Dependency Order

```
EP-1 (AD-0009 confirm, B) ─► EP-2 (ENV-DEV, H) ─► EP-3 (ENV-INT, H) ─► EP-4 (S1/S3/S4 enforce, H) ─► EP-5 (provisioning attestation)
                                                                                                          │
                                                                                                          ▼ G12-1 CLOSED
```

---

## 3. Evidence Summary (Act 6)

| Evidence ID | Description | Gate | Attestable by IA? |
|:-----------:|-------------|:----:|:-----------------:|
| EO-1 | Provisioning attestation | G12-1 | Yes (Act 9) |
| EV-3 | ENV-DEV/INT provisioned, internal-only, S1/S3/S4 enforced | G12-1 | Yes |
| EV-4 (partial) | Immutable, chain-of-custody evidence pack (seeded here, completed in Act 7/8) | G12-1→3 | Yes |

---

## 4. Certification Impact

- **Closes G12-1** — the first of three operational gates that jointly gate **UCC-4 (Operational Certification, Act 9)**.
- Establishes the substrate on which **all** downstream operational evidence (Acts 7/8) is produced; without it, no pipeline, contract, DR, or NFR evidence can exist.
- Feeds the provisioning + security tracks of `OP-CERT-001`.

## 5. Exit Criteria (Act 6 complete)
1. ENV-DEV **and** ENV-INT running, internal-only (`external_exposure=false`).
2. Non-waivable S1/S3/S4 enforced; mTLS on by default.
3. Observability emitting per PE-12.
4. Provisioning attestation (EO-1/EV-3) captured, immutable, hash-chained.
5. **G12-1 CLOSED** and ready for IA attestation at Act 9.

## Governance / Non-Mutation Statement
No environment was created; no cloud resource provisioned; no spend incurred; no control enforced; no attestation produced. All packages are future human-executed operations under `AD-0015` + `AD-0009`, reserved to the Authority Board and its named executor. REAL-C-05 closure and the front wave are analytical assumptions. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged. Read-only analysis.

**END OPS-ENVIRONMENT-PROGRAM — ACT 6 / G12-1 · 5 WORK PACKAGES (EP-1..EP-5) · EVIDENCE = PROVISIONING ATTESTATION (EO-1/EV-3) · HUMAN REAL-SPEND · CLOSES G12-1.**
