# SIM-AUTH-REV-004 — PI-11 Simulation Fabric Authorization Options & Scoping Analysis

| Field | Value |
|-------|-------|
| Artifact | **SIM-AUTH-REV-004 — Authorization Options & Scoping Analysis** |
| Phase | PHASE 20.1 (PI-11 Simulation Fabric — Authorization Review) |
| Version | 1.0.0 |
| Mode | REVIEW / ANALYSIS ONLY — recommends; does not itself authorize |
| Inputs | `SIM-AUTH-REV-001` (dependencies), `SIM-AUTH-REV-002` (threats), `SIM-AUTH-REV-003` (capabilities); `AD-0018/0019/0020` (precedent scoped releases) |
| Owner | UCOS Authority Board |

> Synthesizes the three preceding reviews into authorization options and answers the three decision
> questions. Recommends a scope for the Board decision (`AD-0022`).

---

## 1. The three decision questions

### Q1 — Can PI-11 be authorized?
**YES (conditionally).** All four **hard** dependencies are implemented and satisfied (substrate, control/
policy, evolution, federation, knowledge); every mandated capability is design-complete; the threat ledger
holds at 0 residual High/High; zero prohibited-core-dir change is proven. The foundations meet the bar for a
scoped construction authorization.

### Q2 — Must PI-10 (Intelligence) be implemented first?
**NO.** Per `SIM-AUTH-REV-001` §2.5, the sole Simulation↔Intelligence coupling is **advisory predictive
contribution**, which the design quarantines as advisory-only, verifier-gated, and off the commit path
(SGP-3/IGP-2). Deterministic state projection, impact analysis, and the Predictive Adapter *interface* are
buildable without Intelligence. Requiring PI-10 first would be an **inversion of the true dependency order**
and is not justified. (Likewise PI-8 Ontology and PI-9 Memory are soft and non-prerequisite.)

### Q3 — Can Simulation construction proceed conditionally?
**YES.** This is the recommended path: authorize the buildable core now and gate the deferred, advisory
enhancements behind their respective PI implementations.

## 2. Authorization options considered

| Option | Description | Assessment |
|:------:|-------------|-----------|
| **A — Deny** | PI-11 NOT AUTHORIZED until PI-8/9/10 implemented | **Rejected.** Contradicts the true dependency structure (Rev-001); the core needs none of them; stalls value with no risk reduction. |
| **B — Full unconditional** | Authorize all capabilities incl. Intelligence-backed predictive models now | **Rejected.** Would require binding a non-existent PI-10 model surface; opens the S3/S4 quarantine surface with no implemented verifier fabric behind it. |
| **C — Conditional / scoped (RECOMMENDED)** | Authorize the buildable core; defer Intelligence/Memory/Ontology couplings behind forward-dependency gates | **Recommended.** Matches dependency reality (Rev-001), threat posture (Rev-002), and capability readiness (Rev-003); mirrors the precedent scoped releases AD-0018/0019/0020. |

## 3. Recommended authorized scope (for AD-0022)

**Authorized target (build now):** new modules under `packages/platform-runtime/src/control/simulation/*`
realizing — Sandbox manager, Digital-Twin manager, Scenario Engine, deterministic State-Projection Engine,
Impact Analyzer, Predictive **Adapter interface** (+ deterministic models), Constraint evaluator, Simulation
registry, Revocation authority, Federation guard, Simulation audit (reuse/thin-wrap `FederatedAuditLog`),
assembly + barrel; plus additive async interfaces in `src/control/simulation/types.ts`; plus tests
(lifecycle, projection, impact, policy/knowledge simulation, sandbox isolation, federation, adversarial S1–S12).

**Binding conditions (SIM-COND):**
- **SIM-COND-1 (Zero prohibited-core-dir change).** No modification of `src/meta-core`, `src/registry-runtime`,
  `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts`. Any such change voids the act.
- **SIM-COND-2 (Additive only).** All existing implemented tests (**134/134** at PI-7) remain green; public
  seams only; reuse federation crypto (**no custom crypto**).
- **SIM-COND-3 (Non-actuation / sandbox).** All run writes confined to `simulation:sandbox:<runId>:*`; governed
  change only via the Evolution Fabric; deny-by-default; fail-closed.
- **SIM-COND-4 (Determinism).** Only deterministic projection is commit-eligible; non-deterministic
  contributions remain advisory + verifier-gated.
- **SIM-COND-5 (S1/S3/S4).** Non-waivable controls preserved; classification inheritance enforced.
- **SIM-COND-6 (No Ω∞).** Civilization Simulation bounded/conceptual (SGP-9); AD-0014 preserved; no INV-14..20.
- **SIM-COND-7 (Approval-required acts).** Registering authorities, binding twins to targets, authorizing
  scenarios, admitting federated authorities, and any promotion remain Approval-Required (AD-0009).

**Forward-dependency gates (deferred; each requires its own authorization + adversarial tests before binding):**
- **FDG-INT (PI-10).** Binding an Intelligence-backed **non-deterministic** predictive model to C5 is deferred
  until PI-10 Intelligence is implemented and ratified; until then C5 accepts deterministic models only.
- **FDG-MEM (PI-9).** `memory:*` read enrichment deferred until PI-9 Memory is implemented; baselines use the
  pinned snapshot + Knowledge.
- **FDG-ONT (PI-8).** `ontology:*`-typed semantic validation deferred until PI-8 Ontology is implemented;
  scenarios validate against declared Constraint Sets + Knowledge.

## 4. Recommendation
> **Authorize PI-11 conditionally (Option C)** with scope §3 and conditions SIM-COND-1..7, deferring the
> Intelligence/Memory/Ontology couplings behind FDG-INT/MEM/ONT. **PI-10 is not a prerequisite.**

## 5. Traceability
- **Refines:** `SIM-AUTH-REV-001/002/003`; `AD-0018/0019/0020`; AUTH-009/012; Constitution Art. IX/XII.
- **Consumed by:** `SIM-AUTH-001`, `AD-0022`.
- **Owner:** UCOS Authority Board.

**END SIM-AUTH-REV-004 — REVIEW · RECOMMEND CONDITIONAL (SCOPED) AUTHORIZATION · PI-10 NOT A PREREQUISITE.**
