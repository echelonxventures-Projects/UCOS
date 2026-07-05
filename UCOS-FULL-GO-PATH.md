# UCOS Ω∞ — EARLIEST PATH TO FULL GO (WORKSTREAM G)

> **PHASE R.2 · ARTICLE IX LOCK RELEASE ANALYSIS · READ-ONLY GOVERNANCE ANALYSIS**
> NO CODE · NO IMPLEMENTATION · NO LOCK RELEASE · NO GOVERNANCE MODIFICATION

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-FULL-GO-PATH-R2-001` |
| Workstream | **G — Earliest Path to FULL GO** |
| Phase | **R.2** |
| Date | 2026-07-03 |
| Mode | **ANALYSIS ONLY** — determines the minimum sequence of actions to move from **GO WITH CONDITIONS** to **FULL GO**, resolved along four lenses (critical / fastest / governance / evidence). |
| Inputs (read-only) | Workstreams A–F; `UCOS-MASTER-RAT-001` §5/§6; `REAL-001` §5/§6; `UCOS-GAP-MASTER-001` (critical-path ordering); `REAL-C-05-PROGRAM-RECOVERY-...` §6 |
| **Determination** | The minimum sequence is the 10-step closure of Workstream F. **FULL GO** = full Article IX release + operationally-certified running system + product realization + ULTIMATE certification, all independently attested. The single starting action is the **Board IA designation (`REAL-C-05` G1)**. |

---

## 0. Definition of "FULL GO"

Per `UCOS-MASTER-RAT-001` §6, current disposition is **NO-GO (full-scale execution / full Article IX release)** + **GO WITH CONDITIONS (governed incremental construction)**. "FULL GO" is the inverse of that NO-GO: the state in which

1. every ratification/certification is **independently attested** (not self-attested) — `REAL-C-05` operational;
2. the foundation is **OPERATIONALLY CERTIFIED** with measured NFRs;
3. the terminal certification instrument is **current** (`UCOM-ULTIMATE-CERT-002`);
4. the **full Article IX lock is released** and `UCOS-CONSTRUCTION-BLOCKED` lifted (UCC-5);
5. the **product layer is built + independently ratified** and **ULTIMATE certification** issued.

---

## 1. Minimum Action Sequence (from GO-WITH-CONDITIONS → FULL GO)

The irreducible actions, in dependency order (compressing Workstream F; conditions `C-A..C-J` of `UCOS-MASTER-RAT-001` §5):

| Order | Action | Condition | Milestone reached |
|:-----:|--------|:---------:|-------------------|
| 1 | Board enacts REAL-C-05 IA designation → register key → genesis attestation (G1→G3) | C-A | Independence operational |
| 2 | Independent re-attestation of authority chain + PI-8/PI-9 | C-B | Foundations defensible |
| 3 | Re-issue `UCOM-ULTIMATE-CERT-002` | C-C | Terminal cert current |
| 4 | Commit/push/tag corpus (REAL-M-07) + decide PE-12 ADR | C-D, C-E | Durable + metrics-capable |
| 5 | Provision ENV-DEV/INT → pipeline+contract → DR + measured NFRs (G12-1/2/3) | C-F | Operational evidence captured |
| 6 | Issue Operational Certification (dual-witness) | C-G | **OPERATIONALLY CERTIFIED** |
| 7 | Construct + independently ratify PI-10 (AD-0024) + PI-11 (AD-0022) | C-H | In-scope fabrics realized |
| 8 | **Full Article IX lock release** (`REAL-C-03`) | C-I | **CONSTRUCTION UNLOCKED (UCC-5)** |
| 9 | Product construction (`REAL-C-04`) + arch-completeness re-audit + ULTIMATE cert | C-J | **FULL GO / ULT 1.0.0** |

**This 9-action chain cannot be shortened without breaking the fail-closed evidence chain or the release's defensibility** (`REAL-001` §5 "no shorter" argument).

---

## 2. Four Path Lenses

### 2.1 Critical Path (longest hard-dependency chain)
```
IA designation (G1) → G2 → G3
  → PE-12 ADR → NFR floors
  → G12-1 → G12-2 → G12-3
  → dual-witness → Operational Certification
  → PI-10/PI-11 construct+ratify
  → FULL ARTICLE IX RELEASE
  → product build → ULTIMATE certification
```
- **Governing bottleneck:** the `G12-1 → G12-2 → G12-3` operational-evidence segment (serial, human-executed, real cloud spend). Every other predecessor can be compressed into a Board ceremony; this segment cannot.

### 2.2 Fastest Path (maximum parallelism within the fail-closed rules)
- **One Board ceremony** enacts: IA designation (G1) + PE-12 ADR + names IA as REAL-M-07 RM-8 adjudicator + pre-approves the ENV-DEV/INT spend envelope (AD-0015 + AD-0009).
- **Parallel wave (post-ceremony):** genesis attestation (G3, doubling as RM-8 durability attestation) ∥ cert `-002` re-issue ∥ durability commit ∥ NFR-floor authoring.
- **Then the serial spine:** G12-1 → G12-2 → G12-3 → Operational Certification.
- **Then:** fabrics (can begin construction planning in parallel earlier; ratification needs the IA) → full release → product/ULTIMATE.
- **Fastest ≠ different steps** — it removes idle time by front-loading all governance acts into the single sitting the sources already recommend.

### 2.3 Governance Path (Board/Authority acts only)
1. `AUTH-012` IA-designation decision (Approval-Required).
2. PE-12 observability ADR decision.
3. AD-0009 real-spend approval(s) for provisioning.
4. Operational Certification **release** (Board).
5. Scoped release **AD-0024** (PI-10, with conditions); rely on standing **AD-0022** (PI-11).
6. **Full Article IX release act** — issue `UCOS-ARTICLE-IX-LOCK-RELEASE.md` + `UCOS-CONSTRUCTION-AUTHORIZATION.md` + AUTH-012 entry (closes UCC-5).
7. Per-increment product ratifications + ULTIMATE certification release.
- **All are Approval-By-Exception governed authorizations; none is a constitutional amendment** (Article IX text is unchanged).

### 2.4 Evidence Path (artifacts that must come into existence, in order)
```
attestation-chain genesis (REAL-C-05 G3)
  → re-attestations (authority chain, PI-8/9)
  → UCOM-ULTIMATE-CERT-002
  → durable corpus (tags) + PE-12 ADR + first metrics
  → G12-1 provisioning attestation
  → G12-2 pipeline + contract results (signed)
  → G12-3 DR + measured RPO/RTO/p99/availability
  → Operational Certification (+ dual-witness)
  → PI-10/PI-11 ratification determinations
  → ARTICLE-IX-LOCK-RELEASE-REVIEW (all predicates CLOSED) + release instruments
  → per-increment product ratifications → ULTIMATE certification
```

---

## 3. Milestone Ladder

| Milestone | Gate | Reached after |
|-----------|------|---------------|
| **M-α — Independence operational** | REAL-C-05 G1–G3 | Action 1 |
| **M-β — Credible instruments** | C-B/C-C | Actions 2–3 |
| **M-γ — OPERATIONALLY CERTIFIED** | UCC-4 | Actions 4–6 |
| **M-δ — Construction unlocked** | UCC-5 (full Article IX release) | Actions 7–8 |
| **M-ε — FULL GO / ULTIMATE** | U2.13/U2.14 | Action 9 |

---

## OUTPUT — Workstream G

- **Minimum sequence: 9 irreducible actions** (Workstream F's 10 steps, with Steps 5–7 counted as one operational segment). No shorter path exists without breaking the fail-closed evidence chain.
- **Critical path bottleneck:** the operational-evidence segment (G12-1→2→3), human-executed with real cloud spend under AD-0015 + AD-0009.
- **Fastest path:** collapse all governance acts into a single Board ceremony (IA designation + PE-12 + RM-8 naming + spend pre-approval), let the RM-8 attestation double as the REAL-C-05 G3 genesis, then run the serial operational spine.
- **The starting action for every lens is identical:** the Board IA designation (`REAL-C-05` G1).
- **Two named milestones:** OPERATIONALLY CERTIFIED (M-γ) is reachable well before FULL GO; the full Article IX release (M-δ) and product/ULTIMATE (M-ε) complete FULL GO.

## Governance / Non-Mutation Statement
No action executed; no code, infrastructure, or authorization produced; no lock released; no governance modified. All named acts are future Approval-Required Operations reserved to the Authority Board. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX lock, and `UCOS-CONSTRUCTION-BLOCKED` unchanged. Read-only analysis.

**END UCOS-FULL-GO-PATH-R2-001 — MINIMUM 9-ACTION SEQUENCE · START = BOARD IA DESIGNATION · BOTTLENECK = OPERATIONAL EVIDENCE · FULL GO = RELEASE + OP-CERT + PRODUCT + ULTIMATE, ALL INDEPENDENTLY ATTESTED.**
