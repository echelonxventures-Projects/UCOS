# OPS — CRITICAL PATH

> **PHASE E.1 · OPERATIONAL EVIDENCE EXECUTION PROGRAM · READ-ONLY GOVERNANCE ANALYSIS**
> **NO CODE · NO IMPLEMENTATION · NO ENVIRONMENT CREATION · NO PIPELINE EXECUTION · NO CERTIFICATION ISSUANCE · NO GOVERNANCE MUTATION**
> The operational critical path through Acts 6 → 7 → 8 → 9, with the governing bottleneck.

| Field | Value |
|-------|-------|
| Artifact ID | `OPS-CRITICAL-PATH` |
| Phase | **E.1** · Version 1.0.0 · Date 2026-07-03 |
| Scope | Work-package-level critical path across `OPS-ENVIRONMENT/PIPELINE/SECURITY/DR/NFR` → Act 9. |
| Inputs (read-only) | The five OPS programs; `ARTICLE-IX-CRITICAL-PATH` (G12-1→2→3 bottleneck). |

---

## 1. Work-Package Critical Path

```
── Act 6 (G12-1) ──
EP-1 (AD-0009) ─► EP-2 (ENV-DEV) ─► EP-3 (ENV-INT) ─► EP-4 (S1/S3/S4) ─► EP-5 (provisioning attestation)
                                                                              │  G12-1 CLOSED
── Act 7 (G12-2) ──                                                           ▼
PP-1 (pipeline) ─► PP-2 (build/tests) ─► PP-4 (sign) ─► PP-5 (promote) ─► PP-6 ─► PP-7 ─► PP-8 (API-018/027) ─► PP-9 (pack)
      (PP-3 scan ∥ PP-2)                        │                                                    │  G12-2 CLOSED
      SECURITY: SP-1 ─► SP-2, SP-3, SP-4 ───────┴──────────► SP-5 (EO-4 security) ──────────────────┤
                                                                                                     ▼
── Act 8 (G12-3) ──
NP-1 (floors) ─► NP-2 (p99/thruput) ─► NP-4 (scale) ─┐
             └─► NP-3 (availability) ────────────────┤
DP-1 (scenarios) ─► DP-2 (RPO) ─► DP-3 (RTO) ─► DP-4 (crash) ─► DP-5 (DR pack) ─► NP-5 (compare+consolidate)
                                                                                        │  G12-3 CLOSED
── Act 9 (UCC-4) ──                                                                     ▼
[all floors met] ─► IA#1 attest ∥ IA#2 attest (EO-5 dual-witness) ─► CA issue (EO-6) ─► Board release ─► OPERATIONALLY CERTIFIED
```

---

## 2. Longest Pole

| Segment | Nature | Compressible? |
|---------|--------|:-------------:|
| EP-1 → EP-5 (provision) | human real-spend | partly (parallel dev/int) |
| PP-1 → PP-9 (pipeline+contracts) | execution | partly (scan ∥ build) |
| SP-1 → SP-5 (security) | verification | ∥ with PP tail |
| **DP/NP measurement cycle** | **measured cycle on live infra** | **NO — irreducible** |
| Act 9 review | dual-witness | fast once evidence exists |

> **Governing bottleneck = the measurement cycle in Act 8** (DP-2→DP-3 and NP-2→NP-3→NP-5). It cannot be shortened: you cannot measure resilience/performance until services run under load on real infrastructure, and each floor comparison is fail-closed. This inherits the `ARTICLE-IX-CRITICAL-PATH` finding that `G12-1 → G12-2 → G12-3` is the release timeline driver.

---

## 3. Strict Ordering Constraints

1. **G12-1 before G12-2 before G12-3** — cannot test what is not provisioned; cannot measure what has not run.
2. **NP-1 (floors) before any NP measurement** — measurement is un-gradeable without ratified floors.
3. **DP-1 (scenarios) before DP-2/DP-3** — drills need defined thresholds.
4. **SP-1 before SP-2/SP-4** — mTLS transport before authz/allow-rule verification.
5. **All evidence before Act 9** — certification consumes, never anticipates, evidence.
6. **2nd-IA designation before Act-9 dual-witness** — governance prerequisite off the evidence path.

---

## 4. Parallelizable (does not extend the path)
- PP-3 (scan) ∥ PP-2 (build/tests).
- Security SP-1..SP-4 ∥ the contract-test tail (PP-6..PP-8).
- NP-2/NP-4 (performance/scale) ∥ DP-2..DP-4 (DR) — both feed NP-5.
- 2nd-IA designation ∥ the entire Act 6–8 execution (governance, off-path).

---

## 5. Summary
- **Critical path:** `EP-1..EP-5 → PP-1..PP-9 (+SP) → {DP + NP} → NP-5 → Act 9`.
- **Bottleneck:** the Act-8 measured cycle (fail-closed floor comparison on live infra).
- **Off-path prerequisite:** 2nd-IA designation for the dual-witness.
- **Terminus:** Act 9 issuance (EO-6) → **OPERATIONALLY CERTIFIED (M-γ)**.

## Governance / Non-Mutation Statement
No path stage executed; no environment, pipeline, drill, or measurement performed; no certification issued. Read-only analysis. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged.

**END OPS-CRITICAL-PATH — EP→PP/SP→DP/NP→NP-5→ACT 9 · BOTTLENECK = ACT-8 MEASURED CYCLE (FAIL-CLOSED) · OFF-PATH PREREQ = 2ND-IA · TERMINUS = OPERATIONALLY CERTIFIED.**
