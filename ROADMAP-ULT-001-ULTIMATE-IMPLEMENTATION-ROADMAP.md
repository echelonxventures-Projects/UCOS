# ROADMAP-ULT-001 — Ultimate Implementation Roadmap

**Phase:** U2 — Ultimate Implementation Roadmap
**Artifact ID:** `ROADMAP-ULT-001`
**Date:** 2026-07-02
**Status:** COMPLETE (roadmap / execution-sequence definition)
**Mode:** ROADMAP / PLANNING ONLY — no source code, no runtime, no infrastructure, no authorization act,
no lock release, no ratified-artifact mutation, no architectural redesign. Append-only.
**Input basis:** `ULT-GAP-001` (see §2 — Input Reconciliation)
**Owner:** UCOS Authority Board (custodian: Chief Authority Architect)

> **Governing constraints (binding on this artifact).** This roadmap sequences **realization only**. The
> architecture is **FROZEN**: no phase herein creates, alters, merges, splits, or supersedes any ratified
> design construct (Authority → Data → Platform Baseline 1.0.0), any invariant, or any fabric design. It
> **enrolls nothing, authorizes nothing, and releases no lock.** `INV-1..INV-13` (`UCOS-ASR-NFR-001`), the
> Constitution, `AD-0014` (Ω∞ deferral; `INV-14..20` NOT enrolled), and the Article IX generation lock are
> unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands except where a prior scoped release already applies. Every
> authorization, lock release, and real-world provisioning act named below is a **future Authority-Board /
> Approval-Required Operation** (AUTH-012 §8 / AD-0009), not an action performed by this artifact.

---

## 1. Purpose & End States

Define the complete, dependency-ordered execution sequence that carries UCOS from its current
**CONDITIONALLY CERTIFIED** state (`UCOM-ULTIMATE-CERT-001`, R14) to the two terminal states:

| Target end state | Definition | Governing gate |
|------------------|------------|----------------|
| **OPERATIONALLY CERTIFIED** | The implemented foundation is provisioned, executed, and measured in a governed non-production environment: `G12-1/2/3` closed — live ENV-DEV/INT, executed CI pipeline, contract tests, DR drill, measured RPO/RTO/p99, immutable audit trail. | Operational Certification (supersedes Phase 12.0 `UCOS-P12-CERT-001` PENDING verdict) |
| **ULTIMATE CERTIFIED** | Terminal, unconditional architecture certification: all seven conditions `UCC-1..UCC-7` CLOSED **and** the architecture-completeness audit re-runs to **COMPLETE** (`ARCH-GAP-001` C1–C3 / M1–M5 resolved), with the full Article IX release recorded. | ULTIMATE Architecture Certification (supersedes `UCOM-ULTIMATE-CERT-001` conditional verdict) |

**Dependency between the two:** ULTIMATE CERTIFIED **subsumes** OPERATIONALLY CERTIFIED — `UCC-4` (Operational
Certification) and `UCC-5` (full Article IX release) are prerequisites of ULTIMATE. Therefore OPERATIONALLY
CERTIFIED is an intermediate terminal state on the path to ULTIMATE, not a parallel end.

---

## 2. Input Reconciliation (`ULT-GAP-001`)

`ULT-GAP-001` does not exist as a discrete on-disk artifact (verified by filename and content search). Its
required content — the consolidated "ultimate gap set" — is authoritatively distributed across three
ratified/evidence-based records, which this roadmap consolidates as the input gap basis:

| Source | Contributes | Standing |
|--------|-------------|----------|
| `UCOM-ULTIMATE-CERT-001` (R14) | Conditions **UCC-1..UCC-7** (the terminal-certification condition set) | Authoritative (conditional certification) |
| `ARCH-GAP-001` (UA-01) | Architecture-completeness gaps **C1–C3 / M1–M5 / m1–m4**; verdict *ARCHITECTURE INCOMPLETE* | Authoritative (evidence-based; 269/269 reproduced) |
| `UCOS-P12-CERT-001` + `RA-1`/`RA-2` | Operational gaps **G12-1/2/3**; readiness ≈82% def / ≈35% ops | Authoritative (evidence-based) |

**Reconciled current baseline (as of 2026-07-02):**

- **Design & governance stack** (Authority → Constitution → EA → Domain → Capability → Information/Metadata →
  Conceptual/Logical/Physical Data → Platform Baseline 1.0.0): **RATIFIED · FROZEN · CERTIFIED**.
- **Authority chain**: **RESTORED** — `AUTH-REST-004` closes `AUTH-012` at v1.0.13 (`AD-0001..AD-0023`
  enrolled, 0 residual defects). *(This supersedes the R14 "D-7 DEFECTIVE" finding for the ledger itself;
  the remaining residue is the ledger↔reality divergence `ARCH-GAP-M5`.)*
- **Implemented fabrics** (`packages/platform-runtime/src/**`, `tsc` clean, **269/269** tests): PI-2/3
  substrate, PI-4 control, PI-5 federation, PI-6 evolution, PI-7 knowledge, **PI-8 ontology**, **PI-9 memory**.
- **PI-10 Intelligence**: design-ratified, **READY FOR AUTHORIZATION** (`INTEL-001`); **not constructed**;
  requires scoped release **AD-0024**.
- **PI-11 Simulation**: design-complete + construction-blueprinted (`SIM-PLAN-001..003`); conditionally
  authorized (**AD-0022**); **not constructed**.
- **Operational certification**: **NOT achieved** — `G12-1/2/3` OPEN (no live env, no executed pipeline, no
  measured NFRs); RA-1/RA-2 runbooks prepared, human-execution gated (AD-0015 + AD-0009).
- **Article IX**: **C-1..C-5 CLOSED**; **C-6 full release act PENDING**; only scoped releases in force.
- **Architecture completeness**: **INCOMPLETE** (`ARCH-GAP-001`) — missing Audit primitive (C1),
  Intelligence/Simulation/Civilization not yet represented (C2), governance/ledger divergence (C3/M5),
  per-fabric duplication of Authority/Evolution/Federation/Audit (M1/M2/m1/C1), hard-coded policy vocabulary (M3),
  Memory metadata-bypass (M4).
- **Existential scope** (Ω∞ / Civilization / Economy; `INV-14..20`): **DEFERRED** under `AD-0014` — **out of
  scope** for both target certifications.

**Consolidated gap → resolution ownership map:**

| Gap | Source | Resolved by phase(s) |
|-----|--------|----------------------|
| UCC-1 authority chain restoration | UCOM-CERT | **U2.1** (confirm/reconcile `AUTH-REST-004`) |
| UCC-2 PI-9 Memory construct + ratify | UCOM-CERT | Satisfied (`MEM-RAT-003`); ledger-reconciled in **U2.1** |
| UCC-3 PI-8 clean auth + PI-10 authorize | UCOM-CERT | PI-8 satisfied (`ONTO-RAT-001`); PI-10 in **U2.6** |
| UCC-4 Operational Certification | UCOM-CERT | **U2.8 → U2.11** |
| UCC-5 full Article IX release | UCOM-CERT | **U2.12** |
| UCC-6 PE-12 observability ADR | UCOM-CERT | **U2.8** |
| UCC-7 registry-absolutism + primitives P2–P5 | UCOM-CERT | **U2.2 → U2.5** |
| C1 missing Audit/Provenance primitive | ARCH-GAP | **U2.2** |
| C2 Intelligence/Simulation not represented | ARCH-GAP | **U2.6 / U2.7** + re-audit **U2.13** |
| C3 off-ledger authority / non-governed impl | ARCH-GAP | **U2.1** |
| M1 Authority duplicated per fabric | ARCH-GAP | **U2.3** |
| M2 Evolution/Lifecycle duplicated | ARCH-GAP | **U2.4** |
| M3 hard-coded policy predicates | ARCH-GAP | **U2.5** |
| M4 Memory bypasses Metadata | ARCH-GAP | **U2.5** |
| M5 ledger↔reality divergence | ARCH-GAP | **U2.1** |
| m1–m4 (federation guards, descriptor kinds, config validation, ontology typing) | ARCH-GAP | **U2.5** |
| G12-1/2/3 operational evidence | P12/RA | **U2.8 / U2.9 / U2.10** |

> **No-redesign note.** C1/C2/M1/M2 are resolved as **implementation convergence** — collapsing duplicated,
> already-implemented per-fabric machinery onto the *existing ratified* universal primitives and constructing
> already-*designed* fabrics (PI-10/PI-11) per their ratified specs. No new architecture, primitive, or
> invariant is introduced. C2's "representability" concern is discharged by constructing the authorized
> fabrics and re-running the completeness audit, not by redesign.

---

## 3. Phase Ordering

Fifteen realization phases in six streams. Phase IDs are `U2.n`; wave tags in §8.

| # | Phase | Stream | Wave | Authorization needed | Human/real-spend? |
|---|-------|--------|------|----------------------|:-----------------:|
| U2.1 | Governance & Ledger Reconciliation | S0 Governance | CW-1 | none (AUTH-012 closed; doc TO) | No |
| U2.2 | Universal Audit/Provenance Primitive Convergence | S1 Completeness | CW-2 | none (additive realization) | No |
| U2.3 | Universal Authority Primitive Convergence | S1 Completeness | CW-2 | none (additive realization) | No |
| U2.4 | Universal Evolution/Lifecycle Convergence | S1 Completeness | CW-2 | none (additive realization) | No |
| U2.5 | Metadata-Uniformity, Policy & Descriptor Extensibility | S1 Completeness | CW-2 | none (additive realization) | No |
| U2.6 | PI-10 Intelligence Fabric Construction | S2 Fabric | CW-3 | **AD-0024** (scoped Art. IX release) | No |
| U2.7 | PI-11 Simulation Fabric Construction | S2 Fabric | CW-3 | AD-0022 (already granted, conditional) | No |
| U2.8 | Environment Provisioning + PE-12 Decision | S3 Operational | CW-4 | AD-0015 + **AD-0009** per act | **Yes** |
| U2.9 | Pipeline & Contract-Test Execution | S3 Operational | CW-4 | AD-0015 + AD-0009 | **Yes** |
| U2.10 | DR / NFR / Immutable-Audit Evidence | S3 Operational | CW-4 | AD-0015 + AD-0009 | **Yes** |
| U2.11 | Operational Certification Issuance | S3 Operational | VW-2 / CeW-1 | Authority Board act | No |
| U2.12 | Full Article IX Lock Release + Construction Authorization | S4 Release | CeW-2 | **Authority Board** (Art. IX) | No |
| U2.13 | Architecture-Completeness Re-Audit (UA-01 re-run) | S5 Certification | VW-3 | none (audit) | No |
| U2.14 | ULTIMATE Architecture Certification | S5 Certification | CeW-3 | Authority Board act | No |
| U2.15 | Program Closure & Baseline Freeze (ULT 1.0.0) | S5 Certification | CeW-3 | Authority Board act | No |

**Ordering rules:**
1. **U2.1 is the universal predecessor** — no construction, operation, or certification proceeds while the
   program state disagrees with reality (M5) or an implemented fabric lacks clean enrolled authorization (C3).
2. Completeness convergence (U2.2–U2.5) and operational provisioning (U2.8–U2.10) are **independent** of each
   other and may proceed in parallel after U2.1.
3. PI-10 construction (U2.6) is gated on **AD-0024**; PI-11 (U2.7) proceeds under the standing **AD-0022**.
4. U2.11 (Operational Certification) requires U2.8+U2.9+U2.10 complete.
5. U2.12 (full Article IX release) requires U2.11 **and** U2.6/U2.7 ratified **and** U2.2–U2.5 complete.
6. U2.13 (re-audit) requires all realization complete; U2.14 (ULTIMATE) requires U2.13 COMPLETE + U2.11 + U2.12.
7. U2.15 freezes the ULTIMATE baseline.

---

## 4. Dependency Graph (DAG)

```
                                   ┌──────────────────────────────────────────────┐
                                   │ U2.1 Governance & Ledger Reconciliation (root) │
                                   └───────┬───────────────┬───────────────┬───────┘
                    ┌──────────────────────┘               │               └───────────────────────┐
                    ▼                                       ▼                                        ▼
      ┌───────────────────────────┐         ┌──────────────────────────┐          ┌───────────────────────────────┐
      │ S1 Completeness (parallel)│         │ S2 Fabric (parallel)     │          │ S3 Operational (parallel)     │
      │ U2.2 Audit primitive      │         │ U2.6 PI-10  (needs AD-0024)│         │ U2.8 Provision + PE-12         │
      │ U2.3 Authority primitive  │         │ U2.7 PI-11  (AD-0022)     │          │  └─▶ U2.9 Pipeline/Contract    │
      │ U2.4 Evolution/Lifecycle  │         │ (U2.6 ∥ U2.7; disjoint    │          │        └─▶ U2.10 DR/NFR/Audit  │
      │ U2.5 Metadata/Policy ext. │         │  subtrees)                │          │              └─▶ U2.11 OPS CERT │
      └────────────┬──────────────┘         └────────────┬─────────────┘          └───────────────┬───────────────┘
                   │                                      │  (VW-1 ratification)                   │ (VW-2)
                   └──────────────────────┬───────────────┴────────────────────────────────────────┘
                                          ▼
                            ┌─────────────────────────────┐
                            │ U2.12 Full Article IX Release│  (needs U2.2–U2.7 done+ratified + U2.11)
                            └──────────────┬──────────────┘
                                           ▼
                            ┌─────────────────────────────┐
                            │ U2.13 UA-01 Re-Audit (VW-3)  │  → ARCHITECTURE COMPLETE
                            └──────────────┬──────────────┘
                                           ▼
                            ┌─────────────────────────────┐
                            │ U2.14 ULTIMATE CERTIFICATION │  (needs U2.11 + U2.12 + U2.13)
                            └──────────────┬──────────────┘
                                           ▼
                            ┌─────────────────────────────┐
                            │ U2.15 Program Closure / Freeze│
                            └─────────────────────────────┘
```

**Hard dependencies:** U2.1 → {all}; AD-0024 → U2.6; U2.8 → U2.9 → U2.10 → U2.11; {U2.2..U2.7 ratified, U2.11}
→ U2.12; {all realization} → U2.13; {U2.11, U2.12, U2.13} → U2.14 → U2.15.
**Soft dependencies:** U2.13 completeness re-audit is strongest when U2.2–U2.5 convergence precedes it; PI-10
semantic grounding (C2) benefits from U2.5 ontology-typing (m4) landing first.

---

## 5. Parallelization Opportunities

| Parallel set | Rationale | Constraint |
|--------------|-----------|------------|
| **U2.2 ∥ U2.3 ∥ U2.4 ∥ U2.5** | Convergence work targets distinct concerns; each is additive and re-verified against the 269-test baseline | Land in a fixed integration order (U2.2 Audit → U2.3 Authority → U2.4 Evolution → U2.5 Metadata/Policy) to avoid churn on shared call-sites; keep baseline green at each merge |
| **U2.6 (PI-10) ∥ U2.7 (PI-11)** | Disjoint subtrees `src/control/intelligence/*` vs `src/control/simulation/*`; disjoint keyspaces `intelligence:*` vs `simulation:*`; prior parallel-construction precedent (PI-8∥PI-9) | Both additive; both must keep substrate/PI-4..PI-7 and baseline green; PI-10 gated on AD-0024 |
| **S1 Completeness ∥ S2 Fabric ∥ S3 Operational** | Completeness convergence and fabric construction touch `src/control/*`; operational track validates the already-built PI-1 foundation and touches `infra/**` + live env — no code overlap | Operational track is human/real-spend gated and schedule-independent of code streams |
| **U2.8 provisioning ∥ U2.2–U2.7** | Provisioning consumes frozen infra definitions; independent of control-layer code | PE-12 observability ADR (UCC-6) must be decided within U2.8 before G12-3 metrics |

**Non-parallelizable (strictly serial):** U2.1 before everything; U2.8→U2.9→U2.10→U2.11 (evidence chain);
U2.12→U2.13→U2.14→U2.15 (certification chain). *(U2.13 may be ordered before U2.12 if the Board prefers a
completeness determination as evidence into the release; the DAG shown places release before final re-audit —
either ordering is admissible provided both precede U2.14.)*

---

## 6. Critical Path

The longest hard-dependency chain to reach **ULTIMATE CERTIFIED** (which subsumes OPERATIONALLY CERTIFIED):

```
U2.1  →  [AD-0024 grant]  →  U2.6 PI-10 build  →  PI-10 independent ratification (VW-1)
      →  U2.13 UA-01 re-audit  →  U2.14 ULTIMATE  →  U2.15 freeze
```

…**contended by** the operational chain, which is schedule-dominant because it is human/real-spend gated:

```
U2.1  →  U2.8 provision (human, AD-0009) →  U2.9 pipeline (human) →  U2.10 DR/NFR (human)
      →  U2.11 Operational Certification →  U2.12 full Article IX release →  U2.14 ULTIMATE
```

**Determination:** the **operational chain (U2.1 → U2.8 → U2.9 → U2.10 → U2.11 → U2.12 → U2.14)** is the
governing **critical path**, because U2.14 (ULTIMATE) hard-depends on both U2.11 (Operational Cert) and U2.12
(Article IX release), and the operational chain carries the only human-approval + real-spend steps (longest,
least controllable latency). The code chain (PI-10/PI-11 + convergence + re-audit) runs in parallel and is not
the binding constraint provided AD-0024 is granted promptly.

**Critical-path accelerators:** (a) grant AD-0024 at the same Board sitting as the U2.1 reconciliation
acceptance; (b) decide PE-12 (UCC-6) before/at U2.8 kickoff; (c) pre-stage RA-2 `[HAR]` runbooks so U2.8–U2.10
execute back-to-back once human approval + spend are authorized.

---

## 7. Risk Path

Ranked by combined schedule-impact × outcome-uncertainty. These are the phases where the program is most
likely to slip or fail closed.

| Rank | Risk locus | Phase(s) | Nature | Mitigation | Fail-closed behavior |
|:----:|-----------|----------|--------|------------|----------------------|
| R1 | **Operational evidence** | U2.8–U2.10 | Real cloud spend, human AD-0009 approvals, PE-12 undecided, **measured NFRs may miss `UCOS-ASR-NFR-001` floors** | Pre-approve spend envelope; decide PE-12 first; run on ephemeral non-prod substrate; dry-run runbooks | Missed NFR floor ⇒ U2.11 CONDITIONAL/BLOCKED, not silent pass |
| R2 | **ARCH-GAP C1/C2 no-redesign tension** | U2.2, U2.6, U2.7, U2.13 | Resolving "missing Audit primitive" / "Intelligence not representable" without redesign; convergence could imply structural change | Frame strictly as convergence onto *existing* ratified primitives + construction of *already-designed* fabrics; if genuine redesign is required, **escalate** — do not proceed under this roadmap | Re-audit U2.13 returns INCOMPLETE ⇒ ULTIMATE withheld |
| R3 | **AD-0024 grant latency** | U2.6 | PI-10 construction blocked until Board issues scoped release | Bundle AD-0024 with U2.1 acceptance; `INTEL-001` already READY FOR AUTHORIZATION | No AD-0024 ⇒ U2.6 does not start; PI-10 remains design-only |
| R4 | **Convergence regression** | U2.2–U2.5 | Collapsing 6 audit logs / duplicated authorities may break the 269-test baseline | Additive-first; per-merge baseline gate; keep old paths until new primitive proven | Any baseline regression ⇒ merge rejected |
| R5 | **Ledger↔reality dispute** | U2.1 | M5 divergence + C3 contested `AD-0021`; reconciliation may surface a genuine authorization defect | Reconcile against `AUTH-REST-004` (AUTH-012 CLOSED); if a fabric truly lacks clean authority, re-authorize before any dependent phase | Unresolved authority defect ⇒ freeze all downstream phases |
| R6 | **PE-12 observability decision** | U2.8 (UCC-6) | Undecided ADR blocks G12-3 metric capture | Governed ADR sub-decision at U2.8 entry | Undecided ⇒ G12-3 cannot close ⇒ Operational Cert PENDING |

**Risk path (single most dangerous chain):** `U2.1 (authority dispute) → U2.8 (PE-12 + spend + provision) →
U2.10 (measured NFRs vs floors) → U2.11 (Operational Cert) → U2.12 (release)`. Failure at any node fails
closed and blocks ULTIMATE.

---

## 8. Wave Model

### 8.1 Construction Waves (CW)

| Wave | Phases | Output class | Gate to next |
|------|--------|--------------|--------------|
| **CW-1** Governance | U2.1 | Reconciled ledger; confirmed clean authorization for all implemented fabrics | Ledger = reality; 0 residual authority defects |
| **CW-2** Primitive Convergence | U2.2, U2.3, U2.4, U2.5 | Single universal Audit / Authority / Evolution-Lifecycle primitive; extensible policy & descriptor & config; metadata-uniform memory | Baseline green; duplications collapsed; UCC-7 closed |
| **CW-3** Fabric Construction | U2.6, U2.7 | Implemented PI-10 Intelligence + PI-11 Simulation fabrics (additive) | Both built; adversarial suites pass; baseline green |
| **CW-4** Operational Substrate | U2.8, U2.9, U2.10 | Live ENV-DEV/INT; executed pipeline; contract-test/DR/NFR/audit evidence | G12-1/2/3 evidence captured |

### 8.2 Validation Waves (VW)

| Wave | Phases | Validates | Pass criterion |
|------|--------|-----------|----------------|
| **VW-1** Fabric Ratification | (within U2.6, U2.7) | PI-10 / PI-11 implementation vs ratified design; I1–I12 / S1–S12 threats | Independent ratification PASS; 0 residual High/High; reproduced test baseline green |
| **VW-2** Operational Evidence | U2.11 | G12-1/2/3 evidence completeness + NFR floors | All G12 CLOSED; measured RPO/RTO/p99 meet `UCOS-ASR-NFR-001` |
| **VW-3** Architecture Completeness | U2.13 | Re-run `ARCH-GAP-001` after convergence + construction | Verdict **COMPLETE** (C1–C3, M1–M5 resolved) |

### 8.3 Certification Waves (CeW)

| Wave | Phase | Certifies | Verdict target |
|------|-------|-----------|----------------|
| **CeW-1** Operational | U2.11 | Foundation operability | **OPERATIONALLY CERTIFIED** |
| **CeW-2** Release | U2.12 | Full construction authorization | Article IX **RELEASED**; `UCOS-CONSTRUCTION-BLOCKED` lifted |
| **CeW-3** Terminal | U2.14, U2.15 | Whole-system architecture | **ULTIMATE CERTIFIED**; baseline frozen at ULT 1.0.0 |

---

## 9. Authority & Article IX Release Requirements

### 9.1 Authorization acts required (future Authority-Board / Approval-Required Operations)

| Act | For | Type | Gate |
|-----|-----|------|------|
| Accept `U2.1` reconciliation | Ledger↔reality + clean-authority confirmation | AUTH-012 documentation disposition | Precondition to all |
| **AD-0024** | Scoped Article IX release for `src/control/intelligence/*` (PI-10) | Approval-By-Exception (AUTH-012 §8 / AD-0009) | Enables U2.6 |
| AD-0022 (standing) | PI-11 simulation scope (already granted, conditional) | Existing | Enables U2.7 under SIM-COND-1..7 |
| AD-0015 (standing) + per-act **AD-0009** | Non-production ENV-DEV/INT provisioning, CI/secrets/KMS binding, pipeline/DR execution, real spend | Limited Evidence Authorization + Approval-Required | Enables U2.8–U2.10 |
| PE-12 observability ADR | UCC-6 | Governed ADR sub-decision | Enables G12-3 |
| **Full Article IX Lock Release** + `UCOS-CONSTRUCTION-AUTHORIZATION` | C-6 / UCC-5 | Authority Board act | U2.12 |
| Operational Certification issuance | UCC-4 | Authority Board act | U2.11 |
| ULTIMATE Architecture Certification issuance | Terminal | Authority Board act | U2.14 |

### 9.2 Article IX release sequence

Article IX moves from **scoped/limited** to **full** in three recorded steps:

1. **Scoped extension (AD-0024)** — adds PI-10 to the existing per-fabric scoped releases (AD-0016..0023).
   Construction remains otherwise BLOCKED. (Enables U2.6.)
2. **Operational evidence carve-out (AD-0015, standing)** — permits human-executed non-production evidence
   generation only. (Enables U2.8–U2.10.) Time-boxed; auto-expires on Operational Certification.
3. **Full release (U2.12)** — after `C-1..C-5` CLOSED (already) **and** Operational Certification issued
   (U2.11), the Authority Board issues `UCOS-ARTICLE-IX-LOCK-RELEASE` + `UCOS-CONSTRUCTION-AUTHORIZATION`,
   lifting `UCOS-CONSTRUCTION-BLOCKED`. This is the **only** step that fully releases the generation lock.

**Preconditions to full release (U2.12):** UCC-1 ✅ (AUTH-REST-004), UCC-2 ✅ (MEM-RAT-003, reconciled U2.1),
UCC-3 (PI-8 ✅; PI-10 ratified in U2.6), UCC-4 (Operational Cert, U2.11), UCC-6 (PE-12 ADR, U2.8), UCC-7
(U2.2–U2.5). `INV-14..20` remain **out of scope** (AD-0014); full release covers the ratified envelope
`INV-1..13` only.

---

## 10. Per-Phase Specifications

For each phase: **Inputs · Outputs · Success criteria · Exit criteria · Failure criteria.**

### U2.1 — Governance & Ledger Reconciliation  *(S0 · CW-1 · root)*
- **Inputs:** `AUTH-REST-004` (AUTH-012 CLOSED, AD-0001..0023), `ARCH-GAP-001` (M5/C3), `PROJECT-STATE §0W`
  (213/213 stale), reproduced reality (269/269), `ONTO-RAT-001`, `MEM-RAT-003`.
- **Outputs:** Reconciliation record aligning `PROJECT-STATE` to reality (269/269; PI-8/PI-9 implemented &
  ratified); confirmation that every implemented fabric maps to an enrolled `AUTH-012` decision (AD-0016..0023);
  disposition of contested `AD-0021` (confirmed = PI-8 per AUTH-REST-003).
- **Success:** ledger = reality; 0 implemented fabric without clean enrolled authorization; M5 closed; C3 closed.
- **Exit:** Authority Board accepts the reconciliation; downstream phases unblocked.
- **Failure:** any implemented fabric proven to lack clean authority, or an irreconcilable ledger conflict ⇒
  **freeze all downstream**; open a targeted re-authorization sub-phase before proceeding.

### U2.2 — Universal Audit/Provenance Primitive Convergence  *(S1 · CW-2)*
- **Inputs:** `ARCH-GAP-001` C1 + m1; the six extant logs (`InMemoryAuditLog`, `FederatedAuditLog`,
  `EvolutionAuditLog`, `KnowledgeAuditLog`, `MemoryAuditLog`, `OntologyAuditLog`); UCC-7 (P2–P5 primitives).
- **Outputs:** one composable Audit/Provenance primitive (hash-chained, signed, federatable, reconcilable) that
  all fabrics consume via a single seam; per-fabric log clones removed or reduced to thin adapters.
- **Success:** all audit paths route through one primitive; audit is uniformly composable/federatable; 269
  baseline green; no prohibited-core-dir change.
- **Exit:** convergence merged; C1 + m1 marked resolved for the U2.13 re-audit.
- **Failure:** convergence would require redesign of a ratified primitive, or breaks the baseline ⇒ **escalate**
  (do not proceed); C1 remains open.

### U2.3 — Universal Authority Primitive Convergence  *(S1 · CW-2)*
- **Inputs:** `ARCH-GAP-001` M1; the 5 certification / 4 ratification / 5 revocation authorities duplicated
  across Federation/Evolution/Knowledge/Memory/Ontology.
- **Outputs:** single universal certification/ratification/revocation authority machinery composed by all
  fabrics (fabric-specific behavior via configuration/metadata, not code copies).
- **Success:** authority machinery de-duplicated; each fabric governed *through* the universal primitive; baseline green.
- **Exit:** M1 resolved; merged.
- **Failure:** de-duplication changes ratified authority semantics ⇒ escalate; M1 open.

### U2.4 — Universal Evolution/Lifecycle Convergence  *(S1 · CW-2)*
- **Inputs:** `ARCH-GAP-001` M2; the 4 duplicated state machines + per-fabric lifecycle engines.
- **Outputs:** single Evolution/Lifecycle primitive as the one durable-mutation + state-machine path; fabrics
  register lifecycle profiles as data.
- **Success:** one lifecycle/state-machine path; Evolution remains the sole durable-mutation route; baseline green.
- **Exit:** M2 resolved; merged.
- **Failure:** convergence alters the ratified Evolution commit contract ⇒ escalate; M2 open.

### U2.5 — Metadata-Uniformity, Policy & Descriptor Extensibility  *(S1 · CW-2)*
- **Inputs:** `ARCH-GAP-001` M3, M4, m2, m3, m4; `policy-evaluator.ts` fixed 5-predicate switch; Memory
  in-process `Map` authorities; fixed descriptor kinds; config-layer validation gap; ontology-typing gap; UCC-7.
- **Outputs:** registry/metadata-extensible policy predicate vocabulary; Memory authorities persisted via
  `MetadataPort`; extensible descriptor-kind schemas; config-layer schema validation; knowledge/memory records
  ontology-typed.
- **Success:** new governance predicate/descriptor kind added with **zero code change**; Memory authorities
  uniformly queryable/federatable; config validated like metadata; baseline green; **UCC-7 CLOSED**.
- **Exit:** M3/M4/m2/m3/m4 resolved; merged.
- **Failure:** extensibility cannot be achieved additively ⇒ escalate; gaps remain open.

### U2.6 — PI-10 Intelligence Fabric Construction  *(S2 · CW-3 · VW-1)*
- **Inputs:** `INTEL-001` (READY FOR AUTHORIZATION), `INT-*` ratified design, `INT-REM-001/002/003`
  (F-2/F-4 closed), **AD-0024** (scoped release), U2.5 ontology-typing (semantic grounding).
- **Outputs:** additive `src/control/intelligence/*`; I1–I12 adversarial suite; `PI10-IMP/VAL/SEC/AUD-001`;
  independent PI-10 ratification.
- **Success:** propose-not-act (Evolution-only commit); determinism (INV-6) quarantine enforced; S1/S3/S4
  enforced; **0 residual High/High**; substrate/PI-4..PI-9 + baseline green; no INV-14..20.
- **Exit:** PI-10 ratified (VW-1); UCC-3 (PI-10 portion) closed; C2 (Intelligence) representable.
- **Failure:** no AD-0024 ⇒ not started; adversarial residual High/High or baseline regression ⇒ ratification
  withheld, PI-10 remains unratified.

### U2.7 — PI-11 Simulation Fabric Construction  *(S2 · CW-3 · VW-1)*
- **Inputs:** `SIM-PLAN-001..003` (construction blueprint), `SIM-*` ratified design, **AD-0022** (conditional),
  SIM-COND-1..7, FDG-INT/MEM/ONT gates.
- **Outputs:** additive `src/control/simulation/*` (M0..M14 per blueprint); S1–S12 adversarial suite;
  `PI11-IMP/VAL/SEC/AUD-001`; independent PI-11 ratification.
- **Success:** non-actuation/sandbox guarantee; Evolution-only commit; forward-dependency gates inert;
  determinism quarantine; S1/S3/S4; **0 residual High/High**; baseline green at each wave gate.
- **Exit:** PI-11 ratified (VW-1); C2 (Simulation) representable.
- **Failure:** SIM-COND breach (core-dir change, premature FDG binding, custom crypto) or baseline regression ⇒
  ratification withheld.

### U2.8 — Environment Provisioning + PE-12 Decision  *(S3 · CW-4 · human/real-spend)*
- **Inputs:** `RA-1-ENV-*` runbooks, `RA-2-ENV-001` provisioning runbooks, `infra/environments/{dev,int}`,
  AD-0015 + per-act AD-0009 approvals, **PE-12 observability ADR** (UCC-6).
- **Outputs:** live ENV-DEV/INT (internal-only, S1/S3/S4 from day one, secrets by-reference); bound CI
  runner/secrets/KMS; PE-12 ADR recorded; provisioning + audit evidence.
- **Success:** ENV-DEV/INT provisioned & running; PE-12 decided; **G12-1 CLOSED**; immutable audit trail begun.
- **Exit:** environments live; observability path decided.
- **Failure:** human approval/spend withheld, or PE-12 undecided ⇒ G12-1 OPEN; operational chain halts (fail-closed).

### U2.9 — Pipeline & Contract-Test Execution  *(S3 · CW-4 · human)*
- **Inputs:** `infra/delivery/pipeline.yaml`, `RA-2-CI-001`, `RA-2-API-001`, live ENV-DEV/INT (U2.8),
  API-018 (Config/Metadata) + API-027 (Registry) contracts.
- **Outputs:** executed build→test→scan→sign→promote pipeline (DEV→INT; ENV-PROD forbidden); provider/consumer/
  compatibility contract-test results (100% op coverage); signed artifacts.
- **Success:** pipeline green; contract tests PASS; **G12-2 CLOSED**; promotion evidence captured.
- **Exit:** pipeline + contracts validated.
- **Failure:** pipeline/contract failure ⇒ G12-2 OPEN; remediate before U2.10.

### U2.10 — DR / NFR / Immutable-Audit Evidence  *(S3 · CW-4 · human)*
- **Inputs:** `RA-2-DR-001`, `RA-2-AUD-001`, `UCOS-ASR-NFR-001` §3 floors (RPO/RTO/p99/availability), live
  ENV-INT, PE-12 observability (U2.8).
- **Outputs:** backup/restore + failover drill; **measured** RPO/RTO/p99/availability; live HA/mTLS evidence;
  immutable, chain-of-custody audit trail; certification-evidence matrix.
- **Success:** DR drill PASS; measured NFRs **meet or exceed** `UCOS-ASR-NFR-001` floors; audit immutable;
  **G12-3 CLOSED**.
- **Exit:** operational evidence complete for all three gates.
- **Failure:** measured NFR below floor, or DR/audit deficiency ⇒ G12-3 OPEN; Operational Cert PENDING/CONDITIONAL.

### U2.11 — Operational Certification Issuance  *(S3 · VW-2 · CeW-1)*
- **Inputs:** G12-1/2/3 evidence (U2.8–U2.10), `UCOS-P12-CERT-001` (prior PENDING), RA-1/RA-2 records.
- **Outputs:** Operational Certification (supersedes the Phase 12.0 PENDING verdict).
- **Success:** G12-1/2/3 all CLOSED; NFRs met; verdict **OPERATIONALLY CERTIFIED**.
- **Exit:** **OPERATIONALLY CERTIFIED** achieved; UCC-4 CLOSED; feeds U2.12.
- **Failure:** any G12 gate open or NFR unmet ⇒ verdict CONDITIONAL/NOT ACHIEVED; ULTIMATE blocked.

### U2.12 — Full Article IX Lock Release + Construction Authorization  *(S4 · CeW-2)*
- **Inputs:** C-1..C-5 CLOSED (existing), UCC-1..UCC-3 + UCC-6 + UCC-7 closed, **U2.11 Operational Cert**,
  PI-10/PI-11 ratified, `ARTICLE-IX-LOCK-RELEASE-REVIEW`.
- **Outputs:** `UCOS-ARTICLE-IX-LOCK-RELEASE` + `UCOS-CONSTRUCTION-AUTHORIZATION`; `UCOS-CONSTRUCTION-BLOCKED`
  lifted; AUTH-012 decision recorded.
- **Success:** full generation lock released within the `INV-1..13` envelope; construction authorized.
- **Exit:** Article IX **RELEASED**; UCC-5 CLOSED.
- **Failure:** any precondition open ⇒ release withheld; lock remains ACTIVE.

### U2.13 — Architecture-Completeness Re-Audit (UA-01 re-run)  *(S5 · VW-3)*
- **Inputs:** post-convergence code (U2.2–U2.5), constructed PI-10/PI-11 (U2.6/U2.7), `ARCH-GAP-001` gap ledger.
- **Outputs:** re-audit report; per-gap disposition (C1–C3, M1–M5, m1–m4 CLOSED); reproduced baseline.
- **Success:** verdict **UCOS ARCHITECTURE COMPLETE**; all Critical/Major gaps resolved; baseline green.
- **Exit:** completeness established; feeds U2.14.
- **Failure:** any Critical/Major gap open ⇒ verdict INCOMPLETE; ULTIMATE withheld; loop back to owning phase.

### U2.14 — ULTIMATE Architecture Certification  *(S5 · CeW-3)*
- **Inputs:** U2.11 (Operational Cert), U2.12 (Article IX released), U2.13 (COMPLETE), all UCC-1..UCC-7 CLOSED.
- **Outputs:** ULTIMATE Architecture Certification (supersedes `UCOM-ULTIMATE-CERT-001` conditional verdict).
- **Success:** all conditions closed; completeness COMPLETE; operational + release achieved; verdict
  **ULTIMATE CERTIFIED** within the `INV-1..13` envelope (Ω∞ `INV-14..20` explicitly out of scope, AD-0014).
- **Exit:** **ULTIMATE CERTIFIED**.
- **Failure:** any condition/gate open ⇒ certification withheld; remains CONDITIONALLY CERTIFIED.

### U2.15 — Program Closure & Baseline Freeze (ULT 1.0.0)  *(S5 · CeW-3)*
- **Inputs:** U2.14 certification; full artifact/ledger set.
- **Outputs:** ULTIMATE baseline **frozen at ULT 1.0.0**; program closure record; registry/state reconciled.
- **Success:** baseline frozen; traceability complete; append-only integrity preserved.
- **Exit:** program closed at ULTIMATE + OPERATIONAL certification.
- **Failure:** integrity/traceability defect ⇒ closure withheld pending correction.

---

## 11. Complete Implementation Sequence

Ordered execution list (parallel sets in braces). Each `⟶` is a hard gate.

```
1.  U2.1  Governance & Ledger Reconciliation            [Board accept; AUTH-012 confirmed]
       ⟶ (Board grants AD-0024; decides PE-12 scheduling)
2.  { S1: U2.2 Audit ⟶ U2.3 Authority ⟶ U2.4 Evolution ⟶ U2.5 Metadata/Policy }   (integration-ordered)
    ‖ { S2: U2.6 PI-10 (AD-0024)  ∥  U2.7 PI-11 (AD-0022) }  ⟶ VW-1 ratification each
    ‖ { S3: U2.8 Provision+PE-12 ⟶ U2.9 Pipeline/Contract ⟶ U2.10 DR/NFR/Audit }   (human/real-spend)
3.  U2.11 Operational Certification            [needs U2.8+U2.9+U2.10]  ⟶ OPERATIONALLY CERTIFIED
4.  U2.12 Full Article IX Release              [needs U2.2–U2.7 ratified + U2.11]  ⟶ lock lifted
5.  U2.13 UA-01 Completeness Re-Audit          [needs all realization]  ⟶ ARCHITECTURE COMPLETE
6.  U2.14 ULTIMATE Architecture Certification  [needs U2.11 + U2.12 + U2.13]  ⟶ ULTIMATE CERTIFIED
7.  U2.15 Program Closure & Baseline Freeze    ⟶ ULT 1.0.0
```

**Minimal serial spine (critical path):**
`U2.1 → U2.8 → U2.9 → U2.10 → U2.11 → U2.12 → U2.14 → U2.15`, with `U2.6/PI-10-ratification → U2.13 → U2.14`
running in parallel and joining at U2.14.

---

## 12. Exit Determination

| Certification | Achieved when | Instrument |
|---------------|---------------|------------|
| **OPERATIONALLY CERTIFIED** | U2.11 exits: G12-1/2/3 CLOSED; NFRs meet floors | Operational Certification (supersedes `UCOS-P12-CERT-001`) |
| **ULTIMATE CERTIFIED** | U2.14 exits: UCC-1..UCC-7 CLOSED + ARCH re-audit COMPLETE + Operational Cert + full Article IX release | ULTIMATE Architecture Certification (supersedes `UCOM-ULTIMATE-CERT-001`) |

**Scope boundary (unchanged):** both certifications are issued within the ratified invariant envelope
`INV-1..INV-13`. The existential / reality-agnostic scope (`INV-14..20`, Ω∞, Civilization, Economy) remains
**deferred under `AD-0014`** and is explicitly **out of scope** for ROADMAP-ULT-001.

---

## Traceability
- **Refines / consumes:** `UCOM-ULTIMATE-CERT-001` (UCC-1..7), `ARCH-GAP-001` (C1–C3/M1–M5/m1–m4),
  `AUTH-REST-004` (AUTH-012 CLOSED, AD-0001..0023), `UCOS-P12-CERT-001` (G12-1/2/3), `RA-1-ENV-*`,
  `RA-2-OPERATIONAL-EVIDENCE-EXECUTION-PACKAGE`, `INTEL-001` (PI-10 readiness), `INT-*`/`INT-REM-*`,
  `SIM-PLAN-001..003`/`SIM-*`, `ONTO-RAT-001`, `MEM-RAT-003`, `ARTICLE-IX-LOCK-RELEASE-REVIEW`,
  `UCOS-CONSTRUCTION-BLOCKED`, `AUTH-012` (AD-0014/AD-0015), `UCOS-ASR-NFR-001` (INV-1..13),
  `UCOS-GOVERNANCE-BASELINE-1.0`, `UCOS-CONST-001` (Art. IX/XII).
- **Refined by:** the prospective Authority-Board acts (AD-0024, PE-12 ADR, Operational Certification, full
  Article IX release, ULTIMATE Certification) and the phase deliverables `U2.1`–`U2.15`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect).

**END PHASE U2 — ULTIMATE IMPLEMENTATION ROADMAP · `ROADMAP-ULT-001` · REALIZATION-ONLY · ARCHITECTURE FROZEN.**
