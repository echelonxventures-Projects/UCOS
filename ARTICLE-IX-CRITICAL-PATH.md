# ARTICLE IX — CRITICAL PATH

> **PHASE R.4 · ARTICLE IX RELEASE READINESS PACKAGE · READ-ONLY GOVERNANCE ANALYSIS**
> **NO CODE · NO IMPLEMENTATION · NO GOVERNANCE MUTATION · NO RELEASE · NO CERTIFICATION**
> The longest hard-dependency chain from **REAL-C-05 closed** to **Full Article IX Release (`REAL-C-03`)** and to **FULL GO**, with the governing bottleneck.

| Field | Value |
|-------|-------|
| Artifact ID | `ARTICLE-IX-CRITICAL-PATH` |
| Phase | **R.4** · Version 1.0.0 · Date 2026-07-03 |
| Assumption | REAL-C-05 CLOSED (REM-01 ✅), corpus durable (REM-04 ✅). G4 dual-witness OPEN. |
| Source | `UCOS-REM-PROG-001` §5, `UCOS-FULL-GO-PATH-R2-001` §2.1, `UCOS-LOCK-REL-EXEC-R2-001` sequence. |

---

## 1. Residual Critical Path (post-C-05)

The full ratified critical path was:
`REM-04 → REM-01 → REM-05 → REM-03 → REM-11 → REM-02 → REM-15 → REM-07 → REM-03′`.

With **REM-04 and REM-01 CLOSED (assumption)**, the residual critical path to `REAL-C-03` is:

```
REM-05 ──► REM-03 ──► REM-11 ──► REM-02 ──► REM-15 ──► REM-07
re-attest  cert-002   PE-12 ADR  G12-1→2→3  Op-Cert    ARTICLE IX
chain/PI   (C-C)      (C-E)      (C-F)      (C-G/UCC-4) RELEASE
(C-B)                            ★BOTTLENECK (dual-wit)  (C-I/UCC-5) = REAL-C-03
```

Extended to **FULL GO**:

```
… ──► REM-07 ──► REM-03′
       (UCC-5)    ULTIMATE cert / ULT 1.0.0 (C-J) = REAL-C-04 → FULL GO
```

---

## 2. Stage-by-Stage

| # | Stage | Cond/Gate | Nature | Compressible? |
|:-:|-------|:---------:|--------|:-------------:|
| 1 | **REM-05** re-attest authority chain + PI-8/PI-9 | C-B | Governance/Evidence (IA signs) | Yes — Board+IA sitting |
| 2 | **REM-03** re-issue `UCOM-ULTIMATE-CERT-002` | C-C | Certification | Yes — parallel with REM-05/11 |
| 3 | **REM-11** PE-12 observability ADR | C-E / UCC-6 | Governance | Yes — Board sitting |
| 4 | **REM-02** provision → pipeline+contracts → DR+measured NFRs | C-F / G12-1→2→3 | Operational evidence (H) | **NO — serial, real-spend** |
| 5 | **REM-15** Operational Certification (dual-witness) | C-G / UCC-4 / G4 | Certification (needs 2nd IA) | Partly — cert act is fast; waits on stage 4 |
| 6 | **REM-07** Full Article IX release | C-I / UCC-5 | Governance (terminal) | Yes — Board act, but last |
| 7 | **REM-03′** ULTIMATE cert (FULL GO only) | C-J | Certification | Bounded by product build |

---

## 3. Governing Bottleneck — Stage 4 (REM-02)

The **only** stage that cannot be collapsed into a governance ceremony:

```
G12-1  (provision ENV-DEV/INT, real cloud spend under AD-0015 + AD-0009)
   ▼   strictly serial — cannot test what is not provisioned
G12-2  (execute CI/CD pipeline + contract tests, signed artifacts)
   ▼   strictly serial — cannot measure what has not run
G12-3  (DR drill + measured RPO/RTO/p99/availability vs floors)
```

- **Serial by construction:** provision → run → measure.
- **Human-gated:** requires `AD-0009` real-spend approval + a named executor; **the agent performs none of it**.
- **Fail-closed:** any below-floor NFR at G12-3 yields CONDITIONAL / NOT ACHIEVED and halts progression to REM-15.
- **Most-exposed to risk:** `RK-2` (operational unknowns at apply-time) and `RK-9` (PE-12 predecessor).

> This segment is the **longest pole** and the true release timeline driver. Every other predecessor can be front-loaded; this one is a measured cycle on real infrastructure.

---

## 4. Highest-Leverage Act (already spent)

Pre-closure, the highest-leverage act was **REM-01** (independent adjudication). By assumption it is **done** — its leverage is realized: every downstream verdict is now defensible rather than self-attested. The **next** highest-leverage acts are the ones that unlock stage 4:
1. **PE-12 ADR (REM-11)** — gates G12-3 metric capture.
2. **AD-0009 real-spend approval** — gates G12-1 provisioning.
3. **2nd-IA designation** — gates the G4 dual-witness at REM-15.

Front-loading all three into a single Board ceremony (alongside REM-05/REM-03) removes all idle time ahead of the serial spine.

---

## 5. Fastest Realization (maximum parallelism within fail-closed rules)

```
[ Board ceremony: accept REM-05 re-attestations + PE-12 ADR (REM-11)
                  + designate 2nd IA (G4) + approve AD-0009 spend envelope ]
        │
        ├─ REM-05 re-attest ∥ REM-03 cert-002 ∥ NFR floors ∥ REM-13 INV-CORE ∥ documentary
        ▼
   ══ SERIAL SPINE ══  G12-1 ─► G12-2 ─► G12-3   (REM-02, human real-spend)
        ▼
   REM-15 Operational Certification (dual-witness)        ⟶ M-γ OPERATIONALLY CERTIFIED
        ▼
   REM-14 PI-10/PI-11 ratify (can begin construction planning earlier; ratify needs IA + op-cert)
        ▼
   REM-07 FULL ARTICLE IX RELEASE                          ⟶ M-δ UCC-5 = REAL-C-03
        ▼
   REM-03′ product build + ULTIMATE cert                   ⟶ M-ε FULL GO
```

**Fastest ≠ different steps** — it removes idle time by front-loading every governance act into the single sitting the sources already recommend; the operational spine length is irreducible.

---

## 6. Milestone Ladder on the Critical Path

| Milestone | Gate | Reached after |
|-----------|:----:|---------------|
| **M-α — Independence operational** | G1–G3 | ✅ (assumption) |
| **M-β — Credible instruments** | C-B / C-C | REM-05, REM-03 |
| **M-γ — OPERATIONALLY CERTIFIED** | UCC-4 | REM-11 → REM-02 → REM-15 |
| **M-δ — Construction unlocked (`REAL-C-03`)** | UCC-5 | REM-14 → REM-07 |
| **M-ε — FULL GO / ULTIMATE** | C-J | REM-03′ |

---

## 7. Summary

- **Residual critical path to `REAL-C-03`:** `REM-05 → REM-03 → REM-11 → REM-02 → REM-15 → REM-07` (6 stages; REM-01/REM-04 already closed).
- **Governing bottleneck:** stage 4 — the serial, human real-spend operational segment `G12-1 → G12-2 → G12-3`.
- **Nearest major milestone:** **OPERATIONALLY CERTIFIED** (M-γ) — the last gate before the release.
- **Terminal stage:** REM-07 (UCC-5) — the Board full-release act.
- **FULL GO** adds one stage beyond the release: REM-03′ (ULTIMATE cert, ULT 1.0.0).

## Governance / Non-Mutation Statement
No path stage was executed. REM-01/REM-04 are marked closed only as the stated analytical assumption. No lock released, no certification issued, no attestation produced, no spend authorized. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged. Read-only analysis.

**END ARTICLE-IX-CRITICAL-PATH — RESIDUAL PATH REM-05→REM-03→REM-11→REM-02→REM-15→REM-07 · BOTTLENECK = G12-1→2→3 (SERIAL, REAL-SPEND) · NEAREST MILESTONE = OPERATIONALLY CERTIFIED · TERMINAL = UCC-5 · FULL GO ADDS REM-03′.**
