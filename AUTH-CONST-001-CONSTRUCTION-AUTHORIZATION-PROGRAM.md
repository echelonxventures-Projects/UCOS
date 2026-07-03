# UCOS — AUTH-CONST-001 · Construction Authorization Program

## PHASE U3 — Minimum-Safe Authorization Package (PI-10 Intelligence · PI-13 Economy · Civilization Fabric)

| Field | Value |
|-------|-------|
| Artifact | **AUTH-CONST-001 — Construction Authorization Program** |
| Artifact ID | `UCOS-AUTH-CONST-001` |
| Phase | **PHASE U3 — Construction Authorization Program** |
| Layer | AUTHORITY / GOVERNANCE (authorization-readiness program — prescribes Board acts; enacts none) |
| Version | 1.0.0 |
| Decision body | **UCOS Authority Board** (terminal authority; AUTH-009; Constitution Art. IX / Art. XII) |
| Mode | **PROGRAM / PACKAGE ONLY** — determines the exact Authority Board actions required before construction may begin and defines the per-fabric authorization envelopes. **Authorizes nothing, releases no lock, issues no AD, writes no code, enrolls no existential invariant.** |
| Governance basis | `UCOS-CONST-001` (Art. IX generation lock / Art. XII Approval-By-Exception), AUTH-008 (S1/S3/S4), AUTH-009 (terminal authority), AUTH-012 (Decision Log; AD-0009 Approval-Required Operations), AD-0014 (Ω∞ deferral), `UCOS-ART9-REL-001` (release/revocation template) |
| Inputs (read-only) | `INTEL-001` (PI-10 completion determination); `ECON-001` (Economic Fabric runtime realization); `CIV-001` (Civilization Fabric runtime realization); `AUTH-REST-004` (AUTH-012 CLOSED, AD-0001..0023); `AD-0016..0023` (precedent scoped releases); `UCOS-CONSTRUCTION-BLOCKED`; `INT-AUTH-REV-001..004`, `INT-AUTH-004`, `INT-THREAT-001`; `ECON-GOV/ARCH/SEC/FED/AUD/THREAT/READINESS-001`; `CIV-GOV/ARCH/SEC/FED/AUD/THREAT/READINESS-001` |
| Effective | 2026-07-02 |
| **Determination** | **THREE DISJOINT SCOPED ARTICLE IX RELEASES REQUIRED — AD-0024 (Intelligence, READY) · AD-0025 (Economy, REVIEW-THEN-RELEASE) · AD-0026 (Civilization, REVIEW-THEN-RELEASE) — PARALLEL-ELIGIBLE — AD-0014 PRESERVED THROUGHOUT** |

> **GOVERNING DISCLAIMER — PROGRAM ARTIFACT, NOT AN AUTHORIZATION.**
> This document is the *package* the Authority Board uses to move three fabrics from design to construction.
> It **does not** release the Article IX generation lock, **does not** issue AD-0024/0025/0026, **does not**
> create source code, and **does not** enroll INV-14..20. The Article IX generation lock **REMAINS ACTIVE**;
> `UCOS-CONSTRUCTION-BLOCKED` is **UNCHANGED**; **AD-0014 (Ω∞ deferral) is PRESERVED** (INV-1..13 unchanged).
> Each fabric's construction begins **only** when the Board enacts its own scoped Article IX release AD as an
> Approval-Required Operation (AUTH-012 §8 / AD-0009) and enrolls it append-only in AUTH-012.

---

## 0. Purpose & Scope

PHASE U3 answers one question for three fabrics: **what is the minimum set of Authority Board actions that
must occur, in what order, and under what binding envelope, before construction of each fabric may legally
begin?** It does so by reviewing the three authorization-readiness inputs, reconciling them against the now-
restored authority chain, and packaging — per fabric — the seven decision elements the Board requires:
**(1) Required AD, (2) Release scope, (3) Safety conditions, (4) Rollback conditions, (5) Audit
requirements, (6) Construction boundaries, (7) Success metrics.**

This program is deliberately **minimum-safe**: it authorizes no more than the three disjoint additive control
subtrees the inputs specify, reuses the AD-0016..0023 release/revocation machinery unchanged, and keeps every
existential and actuation boundary in force.

## 1. Review of Inputs (as-found determination)

| Input | Determination on file | Standing prerequisites | Residual gate to construction |
|-------|-----------------------|------------------------|-------------------------------|
| **INTEL-001** (PI-10 Intelligence) | **READY FOR AUTHORIZATION — all prerequisites satisfied** | PI-8 RATIFIED (`ONTO-RAT-001`); PI-9 RATIFIED (`MEM-RAT-003`, 269/269); `INT-*` remediation discharged (`INT-REM-001/002/003`); authority chain RESTORED (`AUTH-REST-004`); independent review complete (`INT-AUTH-REV-001..004`, `INT-AUTH-004`) | **Scoped Article IX release only (AD-0024).** No further review required. |
| **ECON-001** (PI-13 Economy) | **DESIGN-COMPLETE — READY FOR AUTHORIZATION REVIEW** | Hard deps PI-4/5/6/7 implemented; PI-8/9/10/11/12 via inert fail-closed FDGs; **AUTH-012 ledger restoration COMPLETE** (`AUTH-REST-004` — the one prerequisite ECON-001 §14.2 flagged is now cleared) | **Independent constitutional review of the `ECON-*` set + ECON-001, then scoped Article IX release (AD-0025).** |
| **CIV-001** (Civilization) | **RUNTIME ARCHITECTURE COMPLETE — READY FOR AUTHORIZATION REVIEW** | Hard deps PI-2..7 + PI-11 authorized/implemented; PI-8/9 inert; non-actuating simulation-object class; deferred under AD-0014 | **Independent constitutional review of the `CIV-*` set + CIV-001, explicit AD-0014-boundary deliberation, then scoped Article IX release (AD-0026).** |

**Reconciliation note (Economy prerequisite cleared).** ECON-001 §14.2 named three construction
prerequisites: (a) independent constitutional review, (b) AUTH-012 ledger restoration, (c) a scoped Article
IX release act. Item (b) is **satisfied** — `AUTH-REST-004` closed AUTH-012 at v1.0.13 (AD-0001..0023, 0
residual defects). Only (a) and (c) remain for Economy.

**AD-numbering continuity.** On-disk standalone release records run AD-0016..AD-0023; AUTH-012 is CLOSED at
v1.0.13. `INTEL-001` §4/§5 already reserve **AD-0024** for PI-10. This program therefore assigns
**AD-0024 → Intelligence, AD-0025 → Economy, AD-0026 → Civilization**, preserving bijective, gap-free
numbering (`AUTH-REST-004` §3 discipline). No phantom AD is implied.

## 2. Exact Authority Board Actions Required (the gate)

Construction of any fabric requires, **conjunctively**: prerequisites satisfied **AND** an independent
authorization review of record **AND** an Approval-Required Board decision **AND** a scoped Article IX
release AD enrolled in AUTH-012. The construction gate in `UCOS-CONSTRUCTION-BLOCKED` §1 remains the
controlling test; these acts are how it is made to evaluate TRUE for each disjoint scope.

**Common act sequence (per fabric):**

| # | Board action | Instrument produced | Class |
|:-:|--------------|---------------------|-------|
| A1 | Accept the authorization-readiness input + upstream design set as the review record | (existing artifacts) | Governance review |
| A2 | Confirm prerequisites: authority chain RESTORED (`AUTH-REST-004`), hard-dependency fabrics implemented, AD-0014 preserved, non-waivable S1/S3/S4 designed | Prerequisite confirmation (minuted) | Governance review |
| A3 | Conduct/receive the **independent constitutional review** (authorization-review pass) | `*-AUTH-REV-*` / `*-AUTH-BOARD-*` record | Independent review |
| A4 | Deliberate the decision as an **Approval-Required Operation** (AUTH-012 §8 / AD-0009) and record the decision | Decision minute | Approval-Required |
| A5 | **Enact the scoped Article IX release** restricted to the one `src/control/*` subtree | **AD-00xx** (release act) | Article IX release |
| A6 | Enroll the AD **append-only** in AUTH-012 + Authority Index; bump ledger version | AUTH-012 vsn bump | Ledger enrollment |
| A7 | (Post-construction) receive **independent ratification** before the fabric is treated as ratified | `*-RAT-*` determination | Independent ratification |

**Per-fabric delta against the common sequence:**

- **PI-10 Intelligence (AD-0024):** A3 is **already of record** (`INT-AUTH-REV-001..004`, `INT-AUTH-004`;
  INTEL-001 confirms 6/6 design areas SATISFIED, 10/10 readiness, I1–I12 at 0 residual High/High). The Board
  proceeds **directly to A4→A6**. No re-review is required.
- **PI-13 Economy (AD-0025):** A3 is **required and not yet performed** — an independent constitutional
  review of the `ECON-*` set + ECON-001 (analogous to the `MEM-AUTH-REV`/`ONTO-AUTH-REV` passes). Ledger
  restoration (A2) is already cleared. Then A4→A6.
- **Civilization (AD-0026):** A3 is **required and not yet performed**, and A4 must include an **explicit
  AD-0014-boundary finding** — the release authorizes only the *bounded, non-actuating, simulation-object*
  civilization class (CGP-1/SGP-9); it must **not** enroll INV-14..20 or confer existential authority. Then
  A4→A6.

**Parallelism.** The three scopes are disjoint (`intelligence:*`, `economic:*`, `civilization:*`) and build
additively over already-authorized fabrics; none is a hard prerequisite of another (Economy's `FDG-INT` and
Civilization's economy-model are inert/modeled, not a live dependency on PI-10/PI-13). The three releases are
therefore **parallel-eligible**, exactly as AD-0021 and AD-0023 were authorized in parallel. **Recommended
order:** Intelligence first (fully ready, zero outstanding review), Economy and Civilization on completion of
their A3 reviews.

---

## 3. Fabric Authorization Envelope — PI-10 Intelligence Fabric

### 3.1 Required AD
**AD-0024 — Scoped Article IX Release for PI-10 Intelligence Fabric.** Enacted by the Authority Board as an
Approval-Required Operation (AUTH-012 §8 / AD-0009); enrolled append-only in AUTH-012 (→ v1.0.14). Extends
AD-0016..0023, all preserved. **No prior authorization review outstanding** (see §2).

### 3.2 Release scope (and only this)
- **Target:** new modules under `packages/platform-runtime/src/control/intelligence/*` + a single additive
  re-export line in `src/control/index.ts`; intelligence tests under `test/control/intelligence/`.
- **Realizes:** `INT-ARCH-001`, `INT-GOV-001/002`, `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001` (threat
  coverage `INT-THREAT-001`, I1–I12).
- **Allowed namespace:** `intelligence:*` (reserved for the fabric), disjoint from `ontology:*` (AD-0021),
  `memory:*` (AD-0023), `knowledge:*` (AD-0020), `economic:*` (AD-0025), `civilization:*` (AD-0026).
- **Allowed authorities:** reasoning/inference, decision, revocation, and federated-intelligence authorities
  (enumerated powers; signed; revocable). **None hold a commit/actuate power.**

### 3.3 Safety conditions (binding)
- **Additive-only:** zero modification of the five substrate core dirs (`src/meta-core`,
  `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts`).
- **Propose-not-act / Evolution-only commit:** no independent write path; all governed mutation routes
  through the Evolution Fabric (AD-0019); knowledge reads via AD-0020; memory via AD-0023; ontology grounding
  via AD-0021.
- **Determinism (INV-6):** deterministic decision path; any non-deterministic inference is **sandboxed,
  advisory, and deterministic-verifier-gated** — never commit-eligible until re-derived.
- **Security:** non-waivable **S1/S3/S4** enforced; signed assertions reuse federation Ed25519
  (`assertions.ts`) — **no custom cryptography**; secrets/keys/model references **by reference only**.
- **Ω∞ boundary:** **no self-direction, no self-modification, no autonomous actuation; no INV-14..20
  enrollment** — AD-0014 stands.
- **Approval-Required acts (AD-0009):** registering an intelligence authority, admitting a federated
  intelligence authority, and any promotion of an inference to a governed change require explicit human/Board
  approval at execution time.

### 3.4 Rollback conditions
`UCOS-ART9-REL-001` §6 applies. The act is **void and the full lock re-imposed** on any: core-dir
modification; change to federation/evolution/knowledge/memory/ontology behavior; independent commit path
bypassing Evolution; custom cryptography; authority escalation; non-deterministic inference reaching commit;
any domain/business logic; any Ω∞/self-directed scope; or any baseline regression. Rollback is a metadata-
and-module revert of the `intelligence:*` subtree with the 269/269 baseline restored green; no ratified
fabric is touched.

### 3.5 Audit requirements
- All `INTEL_*` events hash-chained and append-only via the reused `FederatedAuditLog` (S6); tamper-evident.
- Every governed decision carries its Evolution unit id, authority, inputs reference, and `resultHash`
  (offline-reproducible under INV-6).
- Enrollment of AD-0024 recorded append-only in AUTH-012 + Authority Index; ledger version bumped; no prior
  record mutated (`AUTH-REST-004` discipline).

### 3.6 Construction boundaries
- **In-bounds:** `src/control/intelligence/*`; one re-export line in `src/control/index.ts`;
  `test/control/intelligence/*`; the `intelligence:*` keyspace.
- **Out-of-bounds:** every other `src/control/*` behavior (reuse-only); all five core dirs; first-class
  provenance/semantic fields on core ports; production deployment / live infrastructure; any INV-14..20 or
  frozen-artifact mutation.
- **Forward-dependency gates:** none outstanding — PI-8 and PI-9 are ratified; grounding/memory bindings are
  live-by-reference, not deferred.

### 3.7 Success metrics (ratification gate — A7)
- **G-BUILD:** intelligence modules compile; `tsc --noEmit` exit 0; no circular deps.
- **G-BASELINE:** current reproduced baseline (269/269 across 40 suites; re-measured at construction) remains
  green — **0 regressions**.
- **G-FUNC:** all intelligence suites pass.
- **G-THREAT:** **I1–I12 blocked; 0 residual High/High.**
- **G-GOV/SEC:** IGP guards + decision gates enforced; S1/S3/S4; no custom crypto; AD-0014 preserved.
- **G-RATIFY:** independent PI-10 ratification determination of record (analogous to `ONTO-RAT-001` /
  `MEM-RAT-003`) before PI-10 is treated as ratified.

---

## 4. Fabric Authorization Envelope — PI-13 Economic Fabric

### 4.1 Required AD
**AD-0025 — Scoped Article IX Release for PI-13 Economic Fabric.** Enacted only **after** an independent
constitutional review of the `ECON-*` set + ECON-001 (A3). Approval-Required Operation (AD-0009); enrolled
append-only in AUTH-012. The AUTH-012 ledger-restoration prerequisite is **already satisfied**
(`AUTH-REST-004`).

### 4.2 Release scope (and only this)
- **Target:** the **16 modules (EM0–EM15)** under `packages/platform-runtime/src/control/economic/*` + a
  single additive re-export; economic tests under `test/control/economic/`.
- **Realizes:** `ECON-GOV-001`, `ECON-ARCH-001`, `ECON-SEC-001`, `ECON-FED-001`, `ECON-AUD-001` (threat
  coverage `ECON-THREAT-001`, EC1–EC15).
- **Allowed namespace:** `economic:*` (`economic:economy:*`, `economic:asset:*`, `economic:resource:*`,
  `economic:treasury:*`, `economic:authority:*`, `economic:federation:*`), disjoint from all other fabric
  keyspaces.
- **Allowed authorities:** economic authority, revocation authority, federated-economy authority, emergency-
  halt/resume (distinct SoD) — enumerated, signed, revocable. **No `mint`/`settle`/`actuate`/`resume`
  power is co-held; no autonomous actuation power exists.**

### 4.3 Safety conditions (binding)
- **Additive-only:** zero prohibited-core-dir change; reuse-only of PI-4/5/6/7 behavior.
- **Propose-not-act / Evolution-only commit (EGP-5):** balances change only via a conservation-checked,
  Evolution-committed settlement; no `economic:*` balance mutation outside an Evolution commit.
- **Conservation & non-negativity as security invariants (EGP-2/EGP-3):** the Settlement Engine (EM8) is the
  sole chokepoint; Σ(credits)=Σ(debits) and balances ≥ 0 enforced fail-closed.
- **Determinism (EGP-6/INV-6):** valuation/exchange are deterministic functions of recorded inputs; advisory
  (`FDG-INT`) valuations are **never commit-eligible** until a verifier reproduces `resultHash`.
- **No real-world actuation (EGP-7):** no real-money code path; any real value movement returns
  `PENDING AD-0009 APPROVAL` — humans/Board actuate.
- **Security:** S1/S3/S4/S6; signed value-bearing acts reuse Ed25519 — **no custom cryptography**;
  keys/settlement credentials **by reference only**.
- **Ω∞ boundary:** no self-owned economy; **no INV-14..20** — AD-0014 stands.

### 4.4 Rollback conditions
`UCOS-ART9-REL-001` §6 applies. The act is **void and the full lock re-imposed** on any: core-dir
modification; change to federation/evolution/knowledge behavior; any balance mutation outside Evolution; a
conservation/non-negativity breach reaching persistence; a non-deterministic valuation reaching commit; a
real-money code path or auto-actuation; custom cryptography; authority escalation or SoD collapse (halt
authority == resume authority); premature binding of a deferred FDG; any domain/business logic; any Ω∞ scope;
or any baseline regression. Rollback reverts the `economic:*` subtree; because the fabric only ever produced
**proposals**, no committed real value can exist to unwind.

### 4.5 Audit requirements
- All `ECON_*` events hash-chained, **double-entry**, append-only, tamper-evident (`ECON-AUD-001`, S6).
- **Offline ledger proof:** replaying the audit chain must reconstruct every treasury balance and confirm
  conservation, non-negativity, and nonce-uniqueness.
- Every settlement records net-zero legs, authority, Evolution unit id, nonce, and `resultHash`.
- AD-0025 enrolled append-only in AUTH-012 + Authority Index; ledger version bumped.

### 4.6 Construction boundaries
- **In-bounds:** `src/control/economic/*` (EM0–EM15); one re-export; `test/control/economic/*`; the
  `economic:*` keyspace.
- **Out-of-bounds:** all core dirs; federation/evolution/knowledge behavior; first-class provenance/semantic
  fields on core ports; the Core Commerce business capabilities `CAP-01..08` (read-only links only — the
  fabric is the value *substrate*, not a business marketplace, and redefines no capability); production
  financial actuation; INV-14..20.
- **Forward-dependency gates (inert / fail-closed until each target is separately authorized *and*
  implemented):** `FDG-ONT` (PI-8 semantic typing), `FDG-MEM` (PI-9 price/allocation history), `FDG-INT`
  (PI-10 non-deterministic pricing — advisory, verifier-gated), `FDG-SIM` (PI-11 dry-run — settlement never
  depends on it), `FDG-AUTO` (PI-12 economic actors). **Authorizing PI-10 under AD-0024 does not activate
  `FDG-INT`;** activation is a later, separate, additive governed integration.

### 4.7 Success metrics (ratification gate — A7)
- **G-BUILD:** 16 modules compile; `tsc --noEmit` exit 0; acyclic.
- **G-BASELINE:** current reproduced baseline remains green — **0 regressions** (re-measured).
- **G-FUNC:** all economic suites pass (ledger/settlement/valuation/federation).
- **G-THREAT:** **EC1–EC15 blocked; 0 residual High/High.**
- **G-CONSERVE:** conservation + non-negativity + atomicity + idempotency hold; offline ledger proof passes.
- **G-ACTUATION:** no real-money path; real value movement returns `PENDING AD-0009 APPROVAL`.
- **G-GOV/SEC/CRYPTO:** EGP-1..12 + D1..D10 gates; S1/S3/S4/S6; no custom crypto; AD-0014 preserved.
- **G-RATIFY:** independent PI-13 ratification determination of record before Economy is treated as ratified.

---

## 5. Fabric Authorization Envelope — Civilization Fabric

### 5.1 Required AD
**AD-0026 — Scoped Article IX Release for the Civilization Fabric.** Enacted only **after** an independent
constitutional review of the `CIV-*` set + CIV-001 (A3) **and** an explicit AD-0014-boundary finding (A4).
Approval-Required Operation (AD-0009); enrolled append-only in AUTH-012.

### 5.2 Release scope (and only this)
- **Target:** the **14 modules (CM0–CM14)** under `packages/platform-runtime/src/control/civilization/*` +
  a single additive re-export; civilization tests under `test/control/civilization/`.
- **Realizes:** `CIV-GOV-001`, `CIV-ARCH-001`, `CIV-DATA-001`, `CIV-CAP-001`, `CIV-FED-001`, `CIV-SEC-001`
  (threat coverage `CIV-THREAT-001`, C1–C15).
- **Allowed namespace:** `civilization:*` (local), `civilization:federation:<nodeId>:*` (foreign),
  `institution:*`, and the disposable sandbox keyspace `simulation:sandbox:<runId>:*` (PI-11-bounded);
  disjoint from all other fabric keyspaces.
- **Authorized class:** **bounded, non-actuating, simulation-object civilizations only** (a PI-11 composite
  digital-twin class). No existential authority is conferred.

### 5.3 Safety conditions (binding)
- **Non-actuation (CGP-1/SGP-9):** civilizations are simulation objects with **no commit/execute power**;
  all operations bounded to `simulation:sandbox:<runId>:*`.
- **Additive-only:** zero prohibited-core-dir change; reuse-only of PI-2..7 + PI-11 behavior.
- **Evolution-only commit (CGP-3):** all civilization state mutation routes through the Evolution Fabric;
  no independent write path.
- **Population privacy (CGP-5):** aggregate-only; PII rejected at ingress; **no re-identification paths**.
- **Security:** S1/S3/S4/S6; signed assertions reuse Ed25519 — **no custom cryptography**; keys by
  reference; monotonic classification.
- **Ω∞ boundary (CGP-9):** **no INV-14..20 enrollment; no existential authority override** — AD-0014
  preserved. The release must be recorded with an explicit finding that the Ω∞ boundary is untouched.
- **Approval-Required acts (AD-0009):** CD1–CD9 (create/modify/federate a civilization, add population,
  link capability/knowledge, etc.) require explicit authority + Evolution commit; CD1 additionally requires
  Board quorum ratification.

### 5.4 Rollback conditions
`UCOS-ART9-REL-001` §6 applies. The act is **void and the full lock re-imposed** on any: core-dir
modification; change to PI-2..7/PI-11 behavior; any actuation escape (civilization executing a runtime
command); any state mutation bypassing Evolution; PII ingestion or a re-identification path; custom
cryptography; authority escalation; classification downgrade; **any INV-14..20 enrollment or existential
authority claim**; any baseline regression. Rollback reverts the `civilization:*` subtree; because
civilizations are non-actuating, no real-world effect can exist to unwind.

### 5.5 Audit requirements
- All `CIVILIZATION_*` events hash-chained, append-only, tamper-evident (S6); anti-backdating + monotonic
  time (CGP-6).
- Every decision records authority, Evolution unit id, and lands on the civilization's `evolutionTrail[]`.
- Federation events record clamped effective trust and namespace-isolated foreign refs; partition ⇒
  fail-closed marking.
- AD-0026 enrolled append-only in AUTH-012 + Authority Index; ledger version bumped.

### 5.6 Construction boundaries
- **In-bounds:** `src/control/civilization/*` (CM0–CM14); one re-export; `test/control/civilization/*`;
  the `civilization:*` / `institution:*` / sandbox keyspaces.
- **Out-of-bounds:** all core dirs; PI-2..7/PI-11 behavior; capability redefinition (`CAP-01..19` are
  read-only links); enforceable rights/obligations (modeled/aspirational only, non-enforceable); production
  deployment; INV-14..20.
- **Forward-dependency gates (inert / fail-closed):** `FDG-ONT` (PI-8 capability semantic validation —
  absent ⇒ deny), `FDG-MEM` (PI-9 memory integration — deny/empty until PI-9 authorized *and* implemented).

### 5.7 Success metrics (ratification gate — A7)
- **G-BUILD:** 14 modules compile; `tsc --noEmit` exit 0; no circular deps.
- **G-BASELINE:** current reproduced baseline remains green — **0 regressions** (re-measured).
- **G-FUNC:** all civilization suites pass (lifecycle/federation/privacy/integration).
- **G-THREAT:** **C1–C15 blocked; 0 residual High/High.**
- **G-PRIVACY:** aggregate-only enforced; PII rejected; no re-identification (CGP-5).
- **G-BOUNDARY:** simulation-boundary / non-actuation proven (CGP-1/CGP-2).
- **G-GOV/SEC:** CGP-1..9 + CD1..CD9 gates; S1/S3/S4/S6; AD-0014 preserved (no INV-14..20).
- **G-RATIFY:** independent Civilization ratification determination of record before the fabric is treated as
  ratified.

---

## 6. Cross-Fabric Invariants (apply to all three releases)

| Invariant | Enforcement across AD-0024/0025/0026 |
|-----------|--------------------------------------|
| **Zero prohibited-core-dir change** | The five substrate core dirs untouched; any change voids the offending act |
| **Additive & disjoint** | Three non-overlapping `src/control/*` subtrees + reserved keyspaces; no shared mutable state |
| **Evolution-only commit** | Every governed mutation routes through AD-0019; no independent write/rollback path |
| **No custom cryptography** | Reuse `src/control/federation/assertions.ts` (Ed25519) everywhere |
| **Non-waivable S1/S3/S4 (+S6)** | Preserved and enforced in every fabric; secrets/keys by reference only |
| **Baseline green** | Current reproduced baseline (269/269 / 40 suites; re-measured) stays green — 0 regressions per fabric |
| **AD-0014 / Ω∞** | No INV-14..20 enrolled; no self-direction/self-ownership/autonomous actuation; no real-world actuation (AD-0009 human gate) |
| **Append-only ledger** | Each AD enrolled append-only in AUTH-012 + Authority Index; no prior record mutated |

## 7. Determination

> ## MINIMUM-SAFE AUTHORIZATION PACKAGE — THREE DISJOINT SCOPED ARTICLE IX RELEASES
>
> To move from design to construction, the Authority Board must enact **three disjoint scoped Article IX
> releases**, each as an Approval-Required Operation enrolled append-only in AUTH-012:
> **AD-0024 (PI-10 Intelligence)**, **AD-0025 (PI-13 Economy)**, and **AD-0026 (Civilization)**.
>
> **PI-10 is READY** — its independent authorization review is of record (`INT-AUTH-REV-001..004`,
> `INT-AUTH-004`) and all prerequisites are satisfied; the Board may proceed **directly to the AD-0024
> release**. **Economy and Civilization are READY FOR REVIEW** — each requires one independent constitutional
> review pass first (and, for Civilization, an explicit AD-0014-boundary finding) before **AD-0025** and
> **AD-0026** respectively. The Economy ledger-restoration prerequisite is already **satisfied**
> (`AUTH-REST-004`).
>
> The three scopes are disjoint and additive over already-authorized fabrics; they are **parallel-eligible**
> (recommended: Intelligence first). Each release is bound by the §3–§5 envelope and the §6 cross-fabric
> invariants. **This program releases no lock and issues no AD:** the Article IX generation lock **REMAINS
> ACTIVE**, `UCOS-CONSTRUCTION-BLOCKED` is **UNCHANGED**, and **AD-0014 is PRESERVED** until the Board enacts
> each release. Construction of each fabric begins only upon its own AD, and each fabric is treated as
> ratified only after its independent ratification determination (A7).

## 8. Traceability
- **Refines:** `INTEL-001`, `ECON-001`, `CIV-001`; `INT-AUTH-REV-001..004`, `INT-AUTH-004`, `INT-THREAT-001`;
  `ECON-GOV/ARCH/SEC/FED/AUD/THREAT/READINESS-001`; `CIV-GOV/ARCH/DATA/CAP/SEC/FED/AUD/THREAT/READINESS-001`;
  `AUTH-REST-004`, `AD-0014`, `AD-0016..0023`, `UCOS-ART9-REL-001`, `UCOS-CONSTRUCTION-BLOCKED`,
  AUTH-008/009/012, `UCOS-CONST-001` (Art. IX/XII).
- **Refined by:** the prospective Board acts **AD-0024** (PI-10), **AD-0025** (PI-13), **AD-0026**
  (Civilization) and their subsequent construction + independent ratification.
- **Owner:** UCOS Authority Board.

**END AUTH-CONST-001 — CONSTRUCTION AUTHORIZATION PROGRAM · AD-0024 / AD-0025 / AD-0026 REQUIRED · PARALLEL-ELIGIBLE · ARTICLE IX ACTIVE · `UCOS-CONSTRUCTION-BLOCKED` UNCHANGED · NO CODE / NO AD ENACTED / NO LOCK RELEASE · INV-1..13 & AD-0014 PRESERVED.**
