# T01 — Program Transition & Construction Readiness Recovery

## PHASE T01 — Minimum Human-Governance Path from DESIGN COMPLETE to CONSTRUCTION READY (Analysis Only)

| Field | Value |
|-------|-------|
| Artifact | **T01 — Program Transition & Construction Readiness Recovery** |
| Artifact ID | `T01-PROGRAM-TRANSITION-AND-CONSTRUCTION-READINESS-RECOVERY` |
| Phase | **T01 — Program Transition & Construction Readiness Recovery** |
| Layer | GOVERNANCE / ASSURANCE (transition analysis — determines the minimum path; enacts nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **ANALYSIS ONLY** — determine the exact minimum set of human governance actions to transition the program from DESIGN COMPLETE to CONSTRUCTION READY. **No activation, no designation, no execution, no attestation, no `git` mutation, no new governance/framework/control/architecture (beyond this additive governance review `*.md`, permitted by the S0′ tolerance rule).** Append-only. |
| Authoritative inputs (per mandate) | `MCS-1-REAL-M-07-PROGRAM-COMPLETION-DETERMINATION` (M-07 = FULLY SPECIFIED), `REAL-C-05-PROGRAM-RECOVERY-AND-STATUS-DETERMINATION` (C-05 = DESIGN COMPLETE / PARTIAL), `CONST-READY-001` (NOT READY; AD-0024 issuable-with-conditions), `CONST-READY-002` (NOT READY; two decisive findings), `REAL-H-07` (gate PARTIAL) |
| Anchors of record (unchanged) | HEAD `519aed9` · tracked-index `d0d6091486…af0a` · RM-2 content anchor `4416b3a776…ca7ca` · upstream 0/0 |
| Governance status | INV-1..13 unchanged; AD-0014 intact; Article IX generation lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |
| **Determination** | **READY FOR GOVERNANCE ACTIONS** — no additional design is required; the transition from DESIGN COMPLETE to CONSTRUCTION READY (READY-WITH-CONDITIONS for the earliest-safe sub-scope) is achievable by a small, ordered set of human governance actions plus their authorized execution (§ 8). |

> **Target definition.** Per `CONST-READY-001/002`, full CW-0 readiness is **not** the reachable target of the
> minimum path (infrastructure provisioning is NOT READY; AD-0025/AD-0026 NOT ISSUABLE). The reachable, defensible
> target is **CONSTRUCTION READY-WITH-CONDITIONS for the earliest-safe sub-scope** (documentary reconciliation +
> independent-adjudication establishment, then additive convergence / PI-11), authorized by **AD-0024**. This
> analysis targets that state and identifies nothing beyond it (no speculative expansion).

---

## 1. Open-Item Inventory

| ID | Open item | Source | Kind | Design gap? |
|:--:|-----------|--------|------|:-----------:|
| OI-1 | `REAL-M-07` durability = **FAIL** (corpus uncommitted; 151 files incl. AD-0016..0023) | CR-002 decisive #1 | Execution (design complete) | **No** |
| OI-2 | `REAL-C-05` independence = **PARTIAL** (mechanism complete; G1–G4 open; 0 attestations) | CR-002 decisive #2 | Governance + Execution + Evidence | **No** |
| OI-3 | `REAL-H-07` pre-construction gate = **PARTIAL** (defined; not operative: unwired; depends on C-05 + M-07) | CR-002 condition | Governance (wiring authorization) + Execution | **No** |
| OI-4 | `REAL-C-01` residual (terminal-cert re-issue `UCOM-ULTIMATE-CERT-002`; IA-1..IA-4) | CR-002 condition (NON-blocking) | Governance + Evidence | **No** |
| OI-5 | **AD-0024** not issued (earliest-safe sub-scope authorization) | CR-001 D-4 | Governance (Board act, with conditions) | **No** |
| OI-6 | **AD-0025 / AD-0026** NOT ISSUABLE (broad CW-0 / infra provisioning) | CR-001 D-5/D-6 | Out of minimum scope | n/a |

**Finding:** every open item on the construction-readiness path is **Governance / Execution / Evidence / Human-Action** — **no design gap** remains (M-07 and C-05 are both DESIGN COMPLETE; H-07 gate is fully defined).

---

## 2. Human Governance Action Matrix

The **minimum** set of Board (Approval-Required, AUTH-012 §8 / AD-0009) governance actions. Execution/engineering
acts they authorize are listed separately (§ 5) — they are not themselves governance actions.

| HGA | Human Governance Action | Actor | Closes / enables | Depends on | Evidence |
|:---:|-------------------------|-------|------------------|-----------|----------|
| **HGA-1** | **G-A activation** — sign the unmodified RM-1 minute; record date; custodian counter-record; **name Executor**; **name RM-8 Adjudicator**; ratify the two tag names; record Executor O-2 commitment (HA-1..HA-7) | Board + Custodian + Executor | Releases DO-NOT-PUSH → authorizes RM-2..RM-7 (REAL-M-07 execution) | none (all machine determinants live) | Signed minute; Activation Control Register |
| **HGA-2** | **REAL-C-05 IA designation (G1)** — enroll a **distinct actor** with KMS-backed key custody disjoint from all authoring/CI-signing keys as an `AUTH-012` decision | Board | Enables C-05 G2/G3; supplies the distinct RM-8 Adjudicator | none (mechanism complete) | Designation AD; IA identity + key ref |
| **HGA-3** | **Authorize REAL-H-07 gate wiring** — approve wiring the pre-construction gate to the CI/Board seam (H-07 §9 conversion) | Board | Makes H-07 **operative** once M-07 durable + C-05 operational | HGA-1, HGA-2 (dependency instruments closing) | Wiring authorization minute |
| **HGA-4** | **Accept REAL-C-01 residual conditions** — authorize terminal-cert re-issue (`UCOM-ULTIMATE-CERT-002`) + IA-1..IA-4 as tracked, non-blocking conditions | Board | Clears the C-01 condition for CR-002 | HGA-2 (independent attestation available) | Board acceptance minute |
| **HGA-5** | **Issue AD-0024 (with conditions)** — authorize the **earliest-safe CW-0 sub-scope**, relying on independent (C-05) attestations and durable (M-07) corpus | Board | Construction authorization for the earliest-safe sub-scope | HGA-1..HGA-4 closed (M-07 PASS, C-05 operational, H-07 operative) | AD-0024 (issued-with-conditions) |

**Note on economy:** HGA-1 and HGA-2 are **co-enactable in one Board session** — the IA designated in HGA-2 is
the RM-8 Adjudicator named in HGA-1 (HA-4), and the RM-8 attestation later serves as the C-05 G3 genesis. This
single co-designation is the linchpin of the whole transition.

---

## 3. Critical Path Analysis

The critical path runs through the **convergence of durability (M-07) and independence (C-05) at RM-8**:

```
HGA-1 ∧ HGA-2  (co-enacted Board session: activation + IA designation)
      │
      ▼
Execute REAL-M-07 wave RM-2..RM-5  (durably commits authorization-of-record + implementation + evidence
      │                             + the IA designation AD → C-05 designation becomes durable)
      ▼
RM-6 tag + RM-7 reconcile
      │
      ▼
RM-8 independent verification  ══  performed by the designated distinct-actor IA
      │                            = REAL-M-07 closure attestation  AND  C-05 G3 genesis attestation
      ▼
REAL-M-07 = PASS   ∧   REAL-C-05 = operational (G1+G2+G3)
      │
      ▼
REAL-H-07 becomes OPERATIVE  (M-07 durable ∧ C-05 operational ∧ wiring authorized by HGA-3)
      │
      ▼
HGA-5 issue AD-0024 (with conditions)  →  re-run CONST-READY determination
      │
      ▼
★ CONSTRUCTION READY-WITH-CONDITIONS (earliest-safe sub-scope) ★
```

**Critical (longest-dependency) chain:** `HGA-1/HGA-2 → M-07 wave (RM-2..RM-7) → RM-8 (=C-05 G3) → H-07 operative
→ HGA-5 (AD-0024) → CR re-determination`. The single **RM-8 act** is the critical convergence node: it closes
both decisive findings at once. Nothing on this chain is design work.

---

## 4. Dependency Graph

```
                          ┌───────────────────────── DESIGN COMPLETE ─────────────────────────┐
                          │  REAL-M-07 (FULLY SPECIFIED)     REAL-C-05 (mechanism complete)    │
                          │  REAL-H-07 (gate defined)        CONST-READY-001/002 (analysed)    │
                          └────────────────────────────────────────────────────────────────────┘
        HGA-1 (G-A activation) ───────────────┐             ┌─────────── HGA-2 (C-05 G1 IA designation)
                │ authorizes                    │             │ names distinct IA = RM-8 adjudicator
                ▼                                ▼             ▼
     ┌─ REAL-M-07 wave RM-2..RM-7 ─┐     (C-05 G2 register key, parallel)
     │   RM-2 commit auth-of-record │             │
     │   RM-3 impl · RM-4 evidence  │  durably enrolls IA designation AD
     │   RM-5 push · RM-6 tag       │             │
     │   RM-7 reconcile main        │             │
     └──────────────┬───────────────┘             │
                    ▼                              ▼
            RM-8 independent verify  ════  C-05 G3 genesis attestation
                    │
        ┌───────────┴───────────┐
        ▼                        ▼
   REAL-M-07 = PASS        REAL-C-05 = operational
        │                        │
        └──────────┬─────────────┘
                   ▼
        REAL-H-07 OPERATIVE  ◀── HGA-3 (wiring authorized)
                   │
                   ▼            ◀── HGA-4 (C-01 residual accepted, non-blocking)
        HGA-5 AD-0024 (with conditions)
                   │
                   ▼
        CONST-READY re-determination → READY-WITH-CONDITIONS (earliest-safe sub-scope)
```

**Edges of note:** M-07 ↔ C-05 are **complementary** (RM-8 = C-05 G3); H-07 depends on **both** (B-8: C-05
PARTIAL; OO-6: M-07 durability); AD-0024 depends on H-07 operative + independent attestations; CR-001/002 close
their decisive findings only when M-07 PASS ∧ C-05 operational.

---

## 5. Minimal Construction-Ready Path

**Governance actions (minimum, ordered):** HGA-1 ∧ HGA-2 (one session) → HGA-3 → HGA-4 → HGA-5.

**Authorized execution/engineering acts (not governance, but required on the path):**
1. **EX-1** Execute REAL-M-07 wave RM-2..RM-7 (Executor; per U29/U31) — durability + durable IA-designation enrollment.
2. **EX-2** Register IA public key via `governance-registry.ts` (C-05 G2) — parallelizable once HGA-2 exists.
3. **EX-3** RM-8 independent verification by the designated IA (per U32) — **= C-05 G3 genesis** and REAL-M-07 closure.
4. **EX-4** Wire REAL-H-07 gate to CI/Board seam (engineering; authorized by HGA-3) — makes gate operative.
5. **EX-5** Re-run `CONST-READY` determination against the durable, independently-attested state.

**Minimum viable set to reach READY-WITH-CONDITIONS:** `{HGA-1, HGA-2, HGA-3, HGA-4, HGA-5}` governance +
`{EX-1, EX-2, EX-3, EX-4, EX-5}` execution. **AD-0025/AD-0026 and full CW-0 are excluded** (out of the reachable
minimum; infrastructure provisioning NOT READY). No item beyond this set is required, and none is redundant.

---

## 6. Parallelization Opportunities

| Parallel track | Items | Constraint |
|----------------|-------|-----------|
| **Co-enact activation + designation** | HGA-1 ∥ HGA-2 in one Board session | IA (HGA-2) must be named as RM-8 adjudicator (HGA-1 HA-4); Executor ≠ IA (SG-4/SoD-3) |
| **Key registration during commits** | EX-2 (C-05 G2) ∥ RM-2..RM-4 (EX-1) | G2 needs HGA-2 enacted; independent of the commit content |
| **Gate wiring during the wave** | EX-4 (H-07 wiring) ∥ EX-1 (M-07 wave) | Authorized by HGA-3; gate only *operative* after M-07 durable + C-05 operational |
| **C-01 residual during the wave** | HGA-4 + terminal-cert re-issue ∥ EX-1 | Non-blocking; needs an independent attestation (post HGA-2/EX-3) to be defensible |

**Serialization that cannot be broken:** RM-2 ≺ RM-3 ≺ RM-4 ≺ RM-5 ≺ RM-6/7 ≺ RM-8 (O-1 ordering + push-before-tag);
RM-8 (=C-05 G3) ≺ H-07 operative ≺ AD-0024. The RM-8 convergence node is inherently sequential.

---

## 7. Risk Analysis

| ID | Risk | Impact | Mitigation (within existing controls — no new control) |
|:--:|------|--------|--------------------------------------------------------|
| RK-1 | **SoD breach** — Executor named as RM-8 Adjudicator/IA | Independence void (SIG-5/SoD-3); C-05 G3 rejected | Designate IA distinct from Executor at HGA-1/HGA-2 (SG-4); Custodian ≠ Executor |
| RK-2 | **Non-durable designation** — C-05 G1 enrolled on one tree only | Attestation independence not durably grounded (REAL-H-07 R-3) | Enroll the IA-designation AD **within** the M-07 wave (RM-2..RM-5) so it is committed/pushed |
| RK-3 | **RM-8 FAIL / PARTIAL** | Re-opens the failing RM (fail-closed); durability closure delayed | U32 failure logic; forward-only remediation (O-2/O-3); re-attest |
| RK-4 | **Scope expansion** — attempting AD-0025/0026 or broad CW-0 in the minimum path | SG-1 breach; NOT ISSUABLE findings violated | Hold to earliest-safe sub-scope + AD-0024 only; AD-0025/0026 deferred |
| RK-5 | **Terminal-cert conflation** — treating C-05 G4 (dual-witness) as required for the sub-scope | Over-scoping; unnecessary blocker | G4/WIT applies **only** at terminal/Operational cert, not the earliest-safe sub-scope (C-05 §10) |
| RK-6 | **Anchor/upstream drift before RM-2** (third-party push / staged file) | RM-2 NO-GO (fail-closed) | PF-1..PF-8 re-verify at RM-2 time (U30); do-not-begin default |
| RK-7 | **Perceived M-07↔C-05 circularity** | Sequencing paralysis | They are complementary: designate IA → run wave (durable) → RM-8 = G3 genesis (§ 3) |
| RK-8 | **H-07 wired but relied upon before operative** | Gate bypass | H-07 operative only when M-07 durable ∧ C-05 operational ∧ wired; enforce that conjunction before AD-0024 |

**No HIGH residual is a design risk.** All risks are managed by existing safeguards (SG-1/SG-4, O-1/O-2/O-3,
PF-1..PF-8, U32 failure logic, C-05 SoD/SIG). No new control is proposed.

---

## 8. Final Determination

> # **READY FOR GOVERNANCE ACTIONS**
>
> The program requires **no additional design** to transition from DESIGN COMPLETE to CONSTRUCTION READY. Both
> decisive findings are DESIGN COMPLETE — `REAL-M-07` is FULLY SPECIFIED (RM-1..RM-8) and `REAL-C-05`'s mechanism
> is fully established (G1–G4 defined); `REAL-H-07`'s gate is fully defined. Every open item (§ 1) is a
> **Governance / Execution / Evidence / Human-Action** item, not a design gap.
>
> **The minimum transition is a small, ordered set of human governance actions** — `HGA-1` (G-A activation) and
> `HGA-2` (REAL-C-05 IA designation) co-enacted in one Board session, then `HGA-3` (authorize H-07 wiring),
> `HGA-4` (accept C-01 residual, non-blocking), and `HGA-5` (issue AD-0024 with conditions) — plus their
> authorized execution (`EX-1..EX-5`). The **critical convergence is the RM-8 independent verification**, which
> simultaneously closes `REAL-M-07` (PASS) and provides the `REAL-C-05` G3 genesis attestation, whereupon
> `REAL-H-07` becomes operative and `AD-0024` becomes defensibly issuable.
>
> **Reachable target:** CONSTRUCTION **READY-WITH-CONDITIONS for the earliest-safe sub-scope** (per
> CONST-READY-001/002). Full CW-0 (`AD-0025/AD-0026`) is **out of the minimum path** (infrastructure provisioning
> NOT READY) and is deliberately not expanded here.
>
> No activation, designation, execution, attestation, or `git` mutation was performed by this artifact. The
> Article IX generation lock and `UCOS-CONSTRUCTION-BLOCKED` remain in force and are lifted only by the governed
> acts above, in scope, at execution time.
>
> ### Next required phase
> **Convene the Board session to co-enact HGA-1 (G-A activation) + HGA-2 (REAL-C-05 IA designation).** This single
> session unblocks the entire critical path.

---

## Governance / Non-Mutation Statement

No governance action enacted; no reviewer designated; no minute signed; no attestation produced; no AD issued;
no gate wired; no new governance, framework, control, or architecture created; no activation, execution, or
`git` mutation performed; no lock released; no invariant enrolled. This is a transition **analysis** only; the
sole repository effect is this additive governance review `*.md`, permitted by the S0′ tolerance rule and
outside the `RM2-CONTENT-ANCHOR` protected set. HGA-1..HGA-5 and EX-1..EX-5 remain Approval-Required Operations
(AUTH-012 §8 / AD-0009) reserved to the UCOS Authority Board. INV-1..13, `AUTH-012` substance (v1.0.13),
AD-0014, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are unchanged.

## Traceability
- **Consumes (authoritative):** `MCS-1-REAL-M-07-PROGRAM-COMPLETION-DETERMINATION`, `REAL-C-05-PROGRAM-RECOVERY-AND-STATUS-DETERMINATION`, `CONST-READY-001`, `CONST-READY-002`, `REAL-H-07`.
- **Produces:** the minimum human-governance transition path (open-item inventory, HGA matrix, critical path, dependency graph, minimal path, parallelization, risk analysis).
- **Determines:** **READY FOR GOVERNANCE ACTIONS**; minimum set = {HGA-1..HGA-5} governance + {EX-1..EX-5} execution; reachable target = READY-WITH-CONDITIONS (earliest-safe sub-scope); next phase = Board session co-enacting HGA-1 + HGA-2.
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect); Executor and Independent Adjudicator to be designated (this analysis designates none).

**END T01-PROGRAM-TRANSITION-AND-CONSTRUCTION-READINESS-RECOVERY — PHASE T01 · OPEN-ITEM INVENTORY (NO DESIGN
GAP) · HGA MATRIX (HGA-1..HGA-5) · CRITICAL PATH (RM-8 = M-07 CLOSURE ∧ C-05 G3) · DEPENDENCY GRAPH · MINIMAL
PATH (+ EX-1..EX-5) · PARALLELIZATION · RISK ANALYSIS (NO NEW CONTROL) · TARGET = READY-WITH-CONDITIONS
(EARLIEST-SAFE SUB-SCOPE) · **READY FOR GOVERNANCE ACTIONS** · NEXT: BOARD SESSION CO-ENACTING HGA-1 + HGA-2 ·
NO ACTIVATION / NO DESIGNATION / NO EXECUTION / NO ATTESTATION / NO MUTATION PERFORMED BY THIS ARTIFACT.**
