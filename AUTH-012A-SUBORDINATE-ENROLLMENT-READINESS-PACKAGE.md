# AUTH-012A — Subordinate Enrollment Readiness Package

> **STATUS: CREATED — READINESS ANALYSIS — READY FOR AUTHORITY BOARD REVIEW**
> ANALYSIS / PROPOSAL ONLY · NOT AN ENROLLMENT · NOT A CONSTITUTIONAL AMENDMENT · NOT AN AUTHORITY-CANON EDIT
> DOES NOT ENROLL PCAMG-0002 OR PCAMG-0007 · DOES NOT AMEND AUTH-009 · DOES NOT RELEASE ARTICLE IX
> DOES NOT MODIFY INV-1..13 / INV-CORE-01..14 / S1·S3·S4 · DOES NOT ADOPT META-GOVERNANCE · DOES NOT RE-ROOT THE HIERARCHY
> APPEND-ONLY (INV-10) · REQUIRES AUTHORITY BOARD REVIEW (AUTH-009 §8)

| Field | Value |
|-------|-------|
| Artifact ID | `AUTH-012A` |
| Name | Subordinate Enrollment Readiness Package (PCAMG-0002, PCAMG-0007) |
| Layer | AUTHORITY (companion analysis to `AUTH-012` Decision Log) |
| Classification | **READINESS ANALYSIS — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **READINESS DETERMINATION ONLY** — no implementation, no enrollment, no amendment, no authority creation |
| Scope | **Subordinate enrollment only** of `PCAMG-0002` and `PCAMG-0007` |
| Explicitly out of scope | Meta-governance adoption · supremacy · hierarchy re-rooting · Layer-0 elevation · `PCAMG-0001/0003/0004/0005/0006/0008` |
| Governing authorities | `AUTH-002` (Art. I/VI/IX/XI/XII), `AUTH-003`, `AUTH-008` (S1/S3/S4), `AUTH-009` (§5/§6/§8/§9), `AUTH-012` |
| Owner | UCOS Authority Board (custodian: Chief Authority Architect) |
| Date | 2026-07-05 |

---

## 0. Framing — What "Subordinate Enrollment" Means Here

The PCAMG package (`PCAMG-0001..0008`) was authored as a **supreme** governance doctrine that would
**re-root** the ratified hierarchy under a Layer-0 invariant-principle layer (`PCAMG-0008` §2). **This package
evaluates none of that.** It evaluates a strictly narrower question:

> **Can `PCAMG-0002` and `PCAMG-0007` be enrolled as *subordinate*, constitutionally-compliant governance
> artifacts — placed BELOW the ratified Authority Layer, deriving authority from it, never above it?**

Subordinate enrollment means, precisely:

1. Both artifacts sit at the **ARCHITECTURE** tier of the ratified hierarchy (`AUTH-INDEX-001` §1), where they
   already physically live (`architecture/pcamg/`). They do **not** move to a Layer-0/AUTHORITY position.
2. Both **derive** authority from `AUTH-002`/`AUTH-003`/`AUTH-008`/`AUTH-009`; on any conflict, **the ratified
   Authority artifact prevails** (Constitution Art. XI; `AUTH-INDEX-001` §2 "Authority wins").
3. Neither may claim Layer-0 supremacy, invert or re-root the hierarchy, or bind a higher tier.
4. The useful, non-contentious operational content — a **traceable principle catalog** (0002) and a
   **compliance-proof specification** (0007) — is decoupled from the contentious supremacy claim and enrolled
   in a subordinate, additive, append-only form.

This mirrors the corpus's established "subordinate to AUTH-008/009/012" pattern (e.g. `PROOF-IMPL-001`) and the
additive-enrollment precedent of **AD-0012** (which enrolled CAP-15..19 by taking `AUTH-006` v1.0.0 → v1.1.0
under Authority-Board approval, without any constitutional or invariant change).

---

## SECTION 1 — Enrollment Impact Analysis

Impact is scored on the **subordinate** enrollment only. Legend: **None** / **Low (additive)** /
**Medium (procedural)** / **High (blocking, requires remediation)**.

### 1.1 PCAMG-0002 — Universal Principle Registry

| Dimension | Impact | Analysis |
|-----------|:------:|----------|
| **Operational** | **Low (additive)** | Enrolls 15 append-only, UUID-stable principle records (`PCAMG-PRIN-001..015`) namespaced disjoint from `P1..P10`, `IP-01..17`, `INV-1..13`, `INV-CORE-01..14` (0 collision). No runtime, no code, no schema. Records are a **catalog that maps up-trace** to existing principles (§5), not a new execution path. No existing operational artifact changes behavior. |
| **Governance** | **Medium (procedural)** | Adds a new *subordinate controlled artifact* to `AUTH-009` §5, requiring an `AUTH-009` version increment + `AUTH-012` decision record. The registry becomes a governed reference the Board and compliance tooling may cite. No governance *rule* is weakened. |
| **Authority** | **High (blocking → remediation)** | **As authored, PCAMG-0002 §4 asserts a "Layer-0 supremacy clause" — "the principle prevails; the artifact is rejected"** and anchors to `PCAMG-0008` supremacy. That is a *supremacy* claim and is **incompatible with subordinate enrollment**. Under subordinate status, on conflict the **ratified Authority prevails**, and a PCAMG-PRIN record is advisory/escalated — never supreme. This must be neutralized before enrollment (see R-2a/R-2b/R-2c). |
| **Security** | **None** | Introduces no control, no boundary, no secret, no data flow. `PRIN-011` maps *up* to the non-waivable S4; it neither redefines nor weakens it. |
| **Certification** | **Low (additive)** | Adds a citable, versioned principle catalog that certification/traceability reports may reference. No gate criteria change; no certification verdict is altered. Existing gates remain the binding certification authority. |

### 1.2 PCAMG-0007 — Compliance Engine (Principle Compliance Framework)

| Dimension | Impact | Analysis |
|-----------|:------:|----------|
| **Operational** | **Low (additive) — if report-only** | Enrolls a *specification* of a four-stage compliance proof (Principle → Constitutional → Governance → Operational). No engine code (Article IX bars it). Enrolled in **report-only / dual-run** mode (Section 4), its verdicts are **non-binding**; existing gates continue to be the sole binding operational authority. Becomes **Medium/High** only if promoted to binding enforcement — which is **out of scope** here. |
| **Governance** | **Medium (procedural)** | Adds a subordinate controlled artifact to `AUTH-009` §5 and a relationship note to `AUTH-009` §7 (it *consumes* gate outputs as evidence). Requires `AUTH-009` increment + `AUTH-012` record. Its Separation-of-Duties proof property (producer ≠ certifier) reinforces `AUTH-009`/`PRIN-009`. |
| **Authority** | **High (blocking → remediation)** | Two coupling defects: (a) §"Relationship to Existing Gates" says it **"subsumes and orchestrates"** the ratified gates — a subordinate artifact may **consume** gate outputs but may **not** subsume gates governed by `AUTH-008`/`AUTH-009`; (b) it **"derives authority from `PCAMG-0002`, `PCAMG-0003`"** and routes its Constitutional stage through the **Meta-Constitution (`PCAMG-0003`)**, which is **out of scope**. The Constitutional stage must be rewired to `AUTH-002`/`UCOS-CONST-001`; the `PCAMG-0003` dependency must be severed. |
| **Security** | **None → Positive** | Explicitly preserves non-waivable **S1/S3/S4 + PRIN-001/006 as unwaivable** and is **fail-closed** (absence/ambiguity ⇒ deny). It neither creates nor relaxes a control. In report-only mode it adds a *second, non-binding* observation of security posture — strictly additive assurance. |
| **Certification** | **Medium (procedural)** | Defines a proof that overlaps the certification surface. In report-only mode it is a **shadow observer** of certification, not a gate. Any move to make a compliance proof a *binding precondition to deployment* is a governance/release-gate change (Approval-Required) and is **deferred** to a separate promotion decision. |

### 1.3 Cross-Artifact Dependency

`PCAMG-0007` consumes `PCAMG-0002`'s per-principle validation rules. Therefore **0002 must be subordinate-enrolled
before (or in the same decision as) 0007**, and 0007's authority-derivation line must reference the *enrolled,
remediated* 0002 — not the supremacy-claiming original.

---

## SECTION 2 — AUTH-009 Amendment Package

The only Authority-canon change required for subordinate enrollment is a **minor, additive** amendment to
`AUTH-009`: register the two artifacts as subordinate controlled artifacts and state their subordination
explicitly. **No hierarchy change, no conflict-order change, no rule weakening** — those would exceed
subordinate scope.

### 2.1 Required Amendments — Classified

#### Mandatory (M) — required for a safe subordinate enrollment

| ID | Amendment | Target | Rationale |
|----|-----------|--------|-----------|
| **M-1** | Add `PCAMG-0002` and `PCAMG-0007` to `AUTH-009` **§5 Controlled Artifacts** as *subordinate governance artifacts that derive authority from `AUTH-002/003/008/009`*. | AUTH-009 §5 | Enrollment must make them governed and traceable (Art. II, no orphans). |
| **M-2** | Add an explicit **Subordination Clause**: both artifacts sit at the ARCHITECTURE tier; they do **not** re-root or invert the hierarchy (§6.1 unchanged); on any conflict the ratified Authority prevails (Art. XI; §6.2). | AUTH-009 §6 (new sub-clause) | Prevents the supremacy reading; keeps enrollment strictly subordinate. |
| **M-3** | Record that `PCAMG-0007` is enrolled in **report-only / dual-run** mode; its verdict is **non-binding** and creates **no new deployment gate** until a separate promotion decision. | AUTH-009 §7 (relationship note) | Keeps the enrollment additive and fail-safe; avoids an unreviewed release-gate change. |
| **M-4** | Require an **enrollment addendum** on each artifact that neutralizes supremacy/meta-constitution coupling (R-2a..c, R-7a..b) as a condition of enrollment. | AUTH-012 decision record | The originals contain supremacy/`PCAMG-0003` language incompatible with subordinate status. |

#### Optional (O) — improve clarity; not required for safety

| ID | Amendment | Target |
|----|-----------|--------|
| **O-1** | Add a *"Subordinate Governance / Compliance Artifact"* row to the `AUTH-009` §6.3 ownership table (owner: owning architect; approver: Chief Authority Architect + Authority Board). | AUTH-009 §6.3 |
| **O-2** | Note `PCAMG-0007` in the Trusted Governance Zone (§6.5) — reading/consuming gate outputs is autonomous; editing any gate criterion remains Approval-Required. | AUTH-009 §6.5 |
| **O-3** | Add glossary entries ("Subordinate Enrollment", "Compliance Proof (report-only)") to `AUTH-011`. | AUTH-011 |

#### Deferred (D) — explicitly NOT part of subordinate enrollment

| ID | Deferred item | Reason |
|----|---------------|--------|
| **D-1** | Layer-0 supremacy / hierarchy re-rooting (`PCAMG-0008`). | Out of scope by mandate. |
| **D-2** | Meta-Constitution enrollment (`PCAMG-0003`). | Out of scope; 0007's Constitutional stage rewired to `AUTH-002` instead. |
| **D-3** | Promotion of `PCAMG-0007` from report-only to **binding** enforcement. | Requires dual-run evidence + separate Approval-Required release-gate decision. |
| **D-4** | Enrollment of `PCAMG-0001/0004/0005/0006`. | Not in this readiness scope. |

### 2.2 Version Changes

| Artifact | From | To | Nature |
|----------|------|----|--------|
| `AUTH-009` Governance Canon | v1.0.0 | **v1.1.0** | Minor, additive (adds subordinate controlled artifacts + subordination clause). Precedent: AD-0012 (`AUTH-006` 1.0.0→1.1.0). |
| `AUTH-012` Decision Log | v1.0.13 | **v1.0.14** (→ v1.0.15 if two decisions) | Append `AD-0024` (and optionally `AD-0025`). |
| `PCAMG-0002` | PROPOSED | **ENROLLED (SUBORDINATE)** + append-only enrollment addendum | Status transition; supremacy language neutralized by addendum. |
| `PCAMG-0007` | PROPOSED | **ENROLLED (SUBORDINATE, REPORT-ONLY)** + append-only enrollment addendum | Status transition; dependency rewired; report-only. |
| `AUTH-002`, `AUTH-003`, `AUTH-008` | — | **UNCHANGED** | No constitutional/principle/security-canon edit. |
| `UCOS-ASR-NFR-001` (INV-1..13), `INV-CORE-001` | — | **UNCHANGED** | No invariant change. |
| Article IX / `UCOS-CONSTRUCTION-BLOCKED` | — | **UNCHANGED** | No lock release. |

### 2.3 Approval Requirements

| Action | Required approval | Basis |
|--------|-------------------|-------|
| Amend `AUTH-009` (§5/§6/§7) | **Authority Board** (Approval-Required Operation) | AUTH-009 §8 ("amending this governance canon … is Approval-Required"). |
| Enroll `PCAMG-0002` / `PCAMG-0007` (subordinate) | **Authority Board** | AUTH-009 §6.4 (Authority modifications are Approval-Required). |
| Record `AD-0024`/`AD-0025` in `AUTH-012` | Trusted Operation (recording) — but the *subject* is Approval-Required, so the Board approval reference MUST be present before effect | AUTH-012 §8. |
| **Constitutional Majority** | **NOT required** | No constitutional article, no invariant, no non-waivable control, and no hierarchy/precedence order is amended. This distinguishes subordinate enrollment from the *supreme* PCAMG adoption in `PCAMG-INDEX` §6 Option 1 (which *would* require Constitutional Majority). |

### 2.4 Traceability Updates

- `AUTHORITY-INDEX` — register `AUTH-009` v1.1.0 and the two subordinate artifacts.
- `AUTHORITY-COVERAGE-REPORT` — add coverage rows for `PCAMG-0002`/`PCAMG-0007` (subordinate).
- `CTX-REG-001` (Artifact Registry) — append enrolled status (append-only).
- `PROJECT-STATE` — append subordinate-enrollment milestone.
- `PCAMG-INDEX` §2 — update `PCAMG-0002`/`PCAMG-0007` status PROPOSED → SUBORDINATE-ENROLLED (append-only note).
- `AUTH-012` — `AD-0024`/`AD-0025` with full ten-field records and bidirectional links.

---

## SECTION 3 — Enrollment Safety Review

Each guarantee is evaluated against the **subordinate, remediated** enrollment. Verdict per row: **PRESERVED** /
**AT RISK** / **VIOLATED**.

| # | Guarantee | Verdict | Justification |
|---|-----------|:-------:|---------------|
| S3.1 | **Article IX** (Governed Generation lock) | **PRESERVED** | Neither artifact releases the lock. `PCAMG-0007` explicitly states COMPLIANT ≠ authorization and "never releases the lock"; report-only mode produces no generation authority. `UCOS-CONSTRUCTION-BLOCKED` unchanged. |
| S3.2 | **INV-1..13** (`UCOS-ASR-NFR-001` v1.0.1) | **PRESERVED** | Mapped *up-trace* only (0002 §5); not deleted, weakened, or renumbered. No `UCOS-ASR-NFR-001` version change. |
| S3.3 | **INV-CORE-01..14** (`INV-CORE-001`) | **PRESERVED** | Referenced as operational-stage checks; not modified. Remain proposed-not-enrolled independently of this action. |
| S3.4 | **INV-CORE (canonical integrity set)** | **PRESERVED** | `PCAMG-0007` treats `INV-CORE-*` as fail-closed evidence inputs; no redefinition. |
| S3.5 | **AUTH-001..012** | **PRESERVED** | Substance unchanged. `AUTH-009` receives a **minor additive** v1.1.0 via its own sanctioned change procedure (§9) — evolution, not weakening. All other AUTH docs untouched. |
| S3.6 | **Non-waivable S1/S3/S4** | **PRESERVED (reinforced)** | `AUTH-008` §7 unchanged. `PCAMG-0007` §4 lists S1/S3/S4 (+ PRIN-001/006) as unwaivable by any autonomy provision — additive reinforcement, never a waiver. Dual-run FN tolerance for these = **zero** (Section 4). |
| S3.7 | **Fail-closed behavior** | **PRESERVED** | `PCAMG-0007` is fail-closed by construction (absence/ambiguity ⇒ NON-COMPLIANT ⇒ not deployable). Report-only mode is **not fail-open**: existing gates remain binding, so a non-binding COMPLIANT verdict cannot open any path the gates would close. |
| S3.8 | **Hierarchy non-inversion** (subordinate discipline) | **PRESERVED (via M-2, R-2a/c, R-7b)** | The mandatory subordination clause + supremacy-language neutralization keep both artifacts at ARCHITECTURE tier with Authority prevailing on conflict. **Without remediation this would be AT RISK** — hence the "READY AFTER REMEDIATION" verdicts in Section 5. |
| S3.9 | **Append-only / INV-10** | **PRESERVED** | All enrollment acts are additive; supremacy language is neutralized by *addendum* (superseded text preserved with link), never by deletion. |
| S3.10 | **Separation of Duties** | **PRESERVED (reinforced)** | `PCAMG-0007` proof contract requires producer ≠ certifier (`PRIN-009`), consistent with `AUTH-009` propose/certify/ratify separation. |

**Safety conclusion:** With the Section-5 remediations applied, **no** guarantee is violated. The single class of
risk (S3.8 hierarchy inversion) is fully contained by neutralizing the supremacy / meta-constitution coupling and
by the mandatory subordination clause (M-2).

---

## SECTION 4 — PCAMG-0007 Dual-Run Plan (Report-Only)

**Objective:** operate `PCAMG-0007` as a **non-binding shadow observer** alongside the existing binding gates, to
gather evidence on its accuracy and safety **before** any future promotion to enforcement. **No binding
enforcement is authorized by this plan.**

### 4.1 Execution Mode — Report-Only / Shadow

- For each candidate artifact, the framework computes the four-stage proof (Principle → Constitutional →
  Governance → Operational) and **emits a verdict to an append-only evidence log**.
- The verdict **does not gate, block, delay, or authorize** anything. The **binding authority remains** the
  existing gates (`GATE-QUAL/SEC/DOC/REL-001`, Constitutional Lock Engine, `INV-CORE-*` checks) and the
  Authority Board.
- Constitutional stage is evaluated against **`AUTH-002`/`UCOS-CONST-001`** (post-remediation R-7a), **not**
  `PCAMG-0003`.
- Runs only against artifacts/definitions permissible under the active Article IX lock (no engine code that would
  require lock release; evaluation operates on governed documents and existing gate outputs).

### 4.2 Evidence Collection

Each evaluation appends an immutable, hash-chained record (PRIN-006 style) containing:

| Field | Content |
|-------|---------|
| Artifact ID + version | Subject under evaluation. |
| Principle-registry version | `PCAMG-0002` enrolled version (reproducibility anchor). |
| Per-stage results | Principle / Constitutional / Governance / Operational: PASS/FAIL + cited evidence. |
| Verdict | COMPLIANT / NON-COMPLIANT (+ blocking reasons). |
| **Binding ground truth** | The actual outcome from the binding gates / Board for the same artifact. |
| Divergence flag | Agreement / False-Positive / False-Negative (see §4.3). |
| Verdict hash | Deterministic hash over inputs (reproducibility check). |
| Validating authority | Identity of the evaluator (SoD: ≠ artifact producer). |
| Timestamp | Append-only ledger position. |

### 4.3 False-Positive / False-Negative Measurement

Ground truth = the authoritative outcome of the existing binding gates + Board.

| Term | Definition | Consequence |
|------|------------|-------------|
| **True agreement** | Engine verdict == binding outcome. | Counts toward promotion evidence. |
| **False Positive (FP)** | Engine says NON-COMPLIANT, but the binding gates/Board deem the artifact acceptable. | Over-blocking risk; tune validation rules. Tracked as precision loss. |
| **False Negative (FN)** | Engine says COMPLIANT, but a binding gate fails or a real violation exists. | **Safety-critical.** Tracked as recall loss. |
| **Divergence rate** | (FP + FN) / total evaluations. | Primary quality signal. |

Metrics reported: precision, recall, divergence rate, per-stage divergence, and a **dedicated non-waivable
sub-metric** (FN count against S1/S3/S4/PRIN-001/PRIN-006).

### 4.4 Exception Handling

- Every divergence emits an **exception record** routed to the Chief Authority Architect for adjudication.
- Each exception is classified: **(a) engine defect** (rule/logic error), **(b) evidence gap** (missing/ambiguous
  evidence), or **(c) genuine catch** (engine correctly surfaced something the current gates missed — logged as a
  candidate gate improvement, but **still non-binding**).
- In dual-run, the engine **never overrides** a binding gate. Ambiguity resolves to a logged NON-COMPLIANT
  observation (fail-closed) with no enforcement effect.

### 4.5 Success Thresholds (promotion candidacy)

Promotion candidacy requires **all** of the following over the observation window:

| Threshold | Target |
|-----------|:------:|
| Observation window | ≥ 30 days **and** ≥ a Board-set minimum evaluation count spanning all 9 artifact classes. |
| **Non-waivable FN (S1/S3/S4/PRIN-001/006)** | **Exactly 0** — hard, non-negotiable. |
| Overall FN rate | ≤ 1% (and root-caused). |
| FP rate | ≤ 5% (and trending down). |
| Reproducibility | 100% (same artifact + registry version ⇒ identical verdict hash). |
| SoD compliance | 100% (producer ≠ certifier on every proof). |
| Open engine-defect exceptions | 0 unresolved High. |

### 4.6 Promotion Criteria (out of scope for AUTH-012A)

Even when thresholds are met, promotion from report-only to **binding** enforcement:

- Requires a **separate Authority Board decision** (new `AD-`) — it is a governance/release-gate change and is
  **Approval-Required**;
- Does **not** alter that COMPLIANT ≠ authorization, and does **not** release Article IX;
- Is **explicitly deferred** (Section 2, D-3) and is **not** granted by this package.

---

## SECTION 5 — Enrollment Decision

### 5.1 Verdicts

| Artifact | Verdict |
|----------|---------|
| **PCAMG-0002 — Universal Principle Registry** | **READY AFTER REMEDIATION** |
| **PCAMG-0007 — Compliance Engine** | **READY AFTER REMEDIATION** |

Neither is **READY FOR ENROLLMENT** as-authored, because each carries supremacy / meta-constitution coupling
incompatible with subordinate status. Neither is **NOT READY**, because the required remediations are bounded,
additive, and documentation-only — no structural redesign is needed.

### 5.2 Required Actions

**PCAMG-0002 (all documentation-only, append-only addendum):**

| ID | Action |
|----|--------|
| **R-2a** | Neutralize the §4 **"Layer-0 supremacy clause"**: state that, under subordinate enrollment, on conflict the **ratified Authority prevails** and the PCAMG-PRIN record is **advisory / escalated to the Authority Board** — never supreme. |
| **R-2b** | Re-scope the **Non-Violation Rule** to a subordinate reading: PCAMG-PRIN records refine and map up-trace to `AUTH-003`/INV; they do not bind or override higher tiers. |
| **R-2c** | Sever the dependence on `PCAMG-0008` supremacy; mark `PCAMG-0008` (re-rooting) as deferred/out-of-scope for this enrollment. |
| **R-2d** | Confirm §5 mapping remains **up-trace / advisory** and namespacing retains 0 collision (already satisfied — verify at enrollment). |

**PCAMG-0007 (all documentation-only, append-only addendum):**

| ID | Action |
|----|--------|
| **R-7a** | **Sever the `PCAMG-0003` dependency.** Rewire the **Constitutional stage** to `AUTH-002`/`UCOS-CONST-001`; change "derives authority from `PCAMG-0002`, `PCAMG-0003`" to derive from the enrolled `PCAMG-0002` + the ratified Constitution/Authority Layer. |
| **R-7b** | Re-frame the "Relationship to Existing Gates" from **"subsumes and orchestrates"** to **"consumes gate outputs as evidence"**; the gates remain governed solely by `AUTH-008`/`AUTH-009`. |
| **R-7c** | Bind the engine to **report-only / dual-run** mode per Section 4; verdicts non-binding until a separate promotion decision. |
| **R-7d** | Confirm the non-waivable set (S1/S3/S4 + PRIN-001/006) is anchored to **`AUTH-008`** as the canonical source (already stated — verify at enrollment). |

### 5.3 Required Approvals

1. **Authority Board** approval to amend `AUTH-009` (→ v1.1.0) — Approval-Required (AUTH-009 §8).
2. **Authority Board** approval to enroll each artifact (subordinate) — Approval-Required (AUTH-009 §6.4).
3. Approval reference recorded in `AD-0024` (and `AD-0025`) **before** the enrollment takes effect (AUTH-012 §8).
4. **Constitutional Majority NOT required** (no constitutional/invariant/hierarchy/non-waivable change) — see §2.3.

### 5.4 Required Sequencing

```
1. Authority Board reviews & accepts AUTH-012A (this package).            [decision to proceed]
2. Author remediations R-2a..d and R-7a..d as append-only addenda.        [Trusted Operation; no enactment]
3. AD-0024 — Authority Board:
     a. Amend AUTH-009 v1.0.0 → v1.1.0 (M-1, M-2, M-3; optionally O-1..3).
     b. Enroll PCAMG-0002 (remediated) as SUBORDINATE.
4. AD-0025 (or same AD) — Authority Board:
     Enroll PCAMG-0007 (remediated) as SUBORDINATE, REPORT-ONLY.          [after/with 0002; 0007 depends on 0002]
5. Update traceability: AUTHORITY-INDEX, COVERAGE-REPORT, CTX-REG-001,
   PROJECT-STATE, PCAMG-INDEX.                                            [Trusted Operation]
6. Execute PCAMG-0007 dual-run; collect evidence; measure thresholds.     [report-only; non-binding]
7. (FUTURE, out of scope) Separate Approval-Required promotion decision
   for binding enforcement — only if Section 4 thresholds are met.        [DEFERRED — not granted here]
```

**Sequencing precondition — now satisfied.** `PCAMG-INDEX` §6 advised sequencing PCAMG enrollment *after* the
authority-chain reconciliation (`AD-0016..0023` off-ledger). That reconciliation is **complete**: the `AUTH-012`
ledger is restored and continuous through **v1.0.13 / AD-0023** (`AUTH-REST-001..004`, Phase 21.1). The prior
blocker to any PCAMG enrollment is therefore **cleared**; subordinate enrollment binds to a clean, verifiable
decision ledger.

---

## SUCCESS CRITERIA — Confirmation

| Criterion | Result |
|-----------|:------:|
| Produces the enrollment package required **before** AUTH-012 enrollment | ✅ |
| Evaluates **subordinate enrollment only** (no supremacy / meta-governance / re-rooting) | ✅ |
| Section 1 — Enrollment Impact Analysis (Operational/Governance/Authority/Security/Certification) for both | ✅ |
| Section 2 — AUTH-009 Amendment Package (Mandatory/Optional/Deferred; version/approval/traceability) | ✅ |
| Section 3 — Enrollment Safety Review (Art. IX, INV-1..13, INV-CORE, INV-CORE-*, AUTH-001..012, S1/S3/S4, fail-closed) | ✅ |
| Section 4 — PCAMG-0007 dual-run plan (report-only; evidence; FP/FN; exceptions; thresholds; promotion; no binding enforcement) | ✅ |
| Section 5 — One verdict per artifact + required actions / approvals / sequencing | ✅ |
| **No implementation · No enrollment · No constitutional amendment · No authority creation** | ✅ |

## Traceability
- **Companion to:** `AUTH-012` (Decision Log) — proposes `AD-0024`/`AD-0025` (not recorded here).
- **Evaluates:** `PCAMG-0002`, `PCAMG-0007` (subordinate enrollment only).
- **Governed by:** `AUTH-002` (Art. IX/XI/XII), `AUTH-008` (S1/S3/S4), `AUTH-009` (§5/§6/§8/§9), `AUTH-012`.
- **Preserves:** Article IX, INV-1..13 (`UCOS-ASR-NFR-001` v1.0.1), `INV-CORE-001`, non-waivable S1/S3/S4, AD-0014, the ratified hierarchy/precedence.
- **Defers:** `PCAMG-0001/0003/0004/0005/0006/0008`, supremacy/re-rooting, binding-enforcement promotion.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect).

**END AUTH-012A · READINESS ANALYSIS · BOTH ARTIFACTS: READY AFTER REMEDIATION · SUBORDINATE ENROLLMENT ONLY · NO IMPLEMENTATION · NO ENROLLMENT · NO AMENDMENT · NO AUTHORITY CREATION · APPEND-ONLY · PENDING AUTHORITY BOARD REVIEW.**
