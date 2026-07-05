# AUTH-012B — Subordinate Enrollment Remediation Specification Package

> **STATUS: CREATED — REMEDIATION SPECIFICATION — READY FOR AUTHORITY BOARD REVIEW**
> REMEDIATION SPECIFICATIONS ONLY · NOT AN ENROLLMENT · NOT A CONSTITUTIONAL AMENDMENT · NOT AN AUTHORITY-CANON EDIT
> DOES NOT ENROLL PCAMG-0002 OR PCAMG-0007 · DOES NOT AMEND AUTH-009 · DOES NOT RELEASE ARTICLE IX
> DOES NOT MODIFY INV-1..13 / INV-CORE-01..14 / S1·S3·S4 · DOES NOT ADOPT META-GOVERNANCE · DOES NOT RE-ROOT THE HIERARCHY
> DOES NOT CREATE, EDIT, OR RATIFY ANY AUTHORITY · DOES NOT EDIT THE TARGET ARTIFACTS
> APPEND-ONLY (INV-10) · REQUIRES AUTHORITY BOARD REVIEW (AUTH-009 §8)

| Field | Value |
|-------|-------|
| Artifact ID | `AUTH-012B` |
| Name | Subordinate Enrollment Remediation Specification Package (PCAMG-0002, PCAMG-0007) |
| Layer | AUTHORITY (companion specification to `AUTH-012A` / `AUTH-012` Decision Log) |
| Classification | **REMEDIATION SPECIFICATION — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **SPECIFICATION ONLY** — no enrollment, no amendment, no implementation, no authority creation |
| Scope | The exact append-only remediation package for `PCAMG-0002` (R-2a..d) and `PCAMG-0007` (R-7a..d) required by `AUTH-012A` §5.2 |
| Explicitly out of scope | Enrollment acts · `AUTH-009` amendment text · `PCAMG-0008` re-rooting · `PCAMG-0003` meta-governance adoption · binding-enforcement promotion · any edit to `AUTH-002/003/008/009/012` or to the target artifacts themselves |
| Governing authorities | `AUTH-002` (Art. IX/XI/XII), `AUTH-003`, `AUTH-008` (S1/S3/S4), `AUTH-009` (§5/§6/§8/§9), `AUTH-012`, and `AUTH-012A` (parent readiness analysis) |
| Owner | UCOS Authority Board (custodian: Chief Authority Architect) |
| Date | 2026-07-05 |

---

## 0. Framing — What This Package Is (and Is Not)

`AUTH-012A` determined both `PCAMG-0002` and `PCAMG-0007` are **READY AFTER REMEDIATION** for *subordinate*
enrollment, and enumerated the required actions **R-2a..d** and **R-7a..d** (`AUTH-012A` §5.2). This document
produces the **exact remediation specifications** for those actions — the precise text that would later be
appended, by the Authority Board, as an append-only enrollment addendum on each target artifact.

**This package specifies remediation text. It does not apply it.** Concretely:

- It does **not** edit `PCAMG-0002` or `PCAMG-0007`. Each remediation gives *current language* (quoted from the
  target as-authored) and *replacement language* (the addendum text that supersedes it) so the Board can review
  the delta before any addendum is written.
- Supersession is **append-only (INV-10)**: the original supremacy / meta-constitution language is **not
  deleted**. On enrollment it is retained in place and marked *superseded-by-addendum*, with the replacement
  language carried in the enrollment addendum. This document defines that superseding text; it does not perform
  the supersession.
- No `AD-` is recorded, no `AUTH-009` version is incremented, no status transitions from PROPOSED to ENROLLED.
  Those are the Board acts sequenced in `AUTH-012A` §5.4 and remain pending.

Legend used throughout: **Governance effect** = effect on the governance *process/registration*; **Authority
effect** = effect on the authority *hierarchy/precedence*; **Traceability impact** = links/registries that must
reflect the change at enrollment.

---

## SECTION 1 — PCAMG-0002 Remediation

Target: `architecture/pcamg/PCAMG-0002-UNIVERSAL-PRINCIPLE-REGISTRY.md`.
Purpose: neutralize the Layer-0 **supremacy** posture so the registry can be enrolled strictly **below** the
ratified Authority Layer, deriving authority from it and never above it.

### R-2a — Neutralize the §4 Layer-0 Supremacy Clause

**Current language** — PCAMG-0002 §4 "Non-Violation Rule":

> "No governance artifact may violate a registered invariant principle. On any conflict between an artifact and
> a principle, the **principle prevails**; the artifact is rejected or escalated (never the principle
> weakened). This rule is the Layer-0 supremacy clause of `PCAMG-0008`."

**Replacement language** (enrollment-addendum supersession of §4):

> "**§4 (as enrolled — subordinate).** Under subordinate enrollment, PCAMG-PRIN records are a governed,
> up-trace **reference catalog**, not a supreme layer. On any conflict between a PCAMG-PRIN record and a
> ratified Authority artifact (`AUTH-002`/`AUTH-003`/`AUTH-008`/`AUTH-009`), the **ratified Authority
> prevails** (Constitution Art. XI; `AUTH-INDEX-001` §2, "Authority wins"). A PCAMG-PRIN record is
> **advisory**; an apparent violation is **surfaced and escalated to the Authority Board** for adjudication and
> is never self-executing. No PCAMG-PRIN record rejects, overrides, or weakens any ratified Authority artifact,
> and none claims Layer-0 supremacy. The clause 'This rule is the Layer-0 supremacy clause of `PCAMG-0008`' is
> **superseded and inoperative** for the enrolled subordinate artifact (see R-2c)."

**Rationale.** The as-authored §4 asserts principle supremacy and anchors to `PCAMG-0008` re-rooting. That is
the single **High/blocking** authority defect for 0002 (`AUTH-012A` §1.1). Subordinate enrollment requires the
inverse precedence: Authority prevails, the principle record is advisory/escalated.

**Governance effect.** The registry becomes a *citable governed reference* rather than a decision rule. Conflict
handling routes to the existing Authority-Board escalation path (`AUTH-009`); no new decision authority is
created and no governance rule is weakened.

**Authority effect.** Inverts the precedence claim from "principle prevails" to "Authority prevails," aligning
0002 with Constitution Art. XI and `AUTH-INDEX-001` §2. Removes the only hierarchy-inversion risk (`AUTH-012A`
§3, S3.8) at its source. No tier is bound above ARCHITECTURE.

**Traceability impact.** At enrollment: `PCAMG-INDEX` §2 status note (PROPOSED → SUBORDINATE-ENROLLED);
`AUTHORITY-COVERAGE-REPORT` coverage row for 0002; addendum back-links to `AUTH-012A` §5.2 R-2a and to the
governing `AD-` (AD-0024). Original §4 text retained, marked *superseded-by-addendum (R-2a)*.

### R-2b — Re-scope the Non-Violation Rule to a Subordinate (Up-Trace) Reading

**Current language** — the operative rule of PCAMG-0002 §4 read together with §5's stated direction. §4 asserts
a binding "no artifact may violate … the principle prevails"; §5 ("Relationship to Existing Principle Sets")
states the mapping direction as:

> "Every existing operational principle (P1–P10, IP-01–IP-17, INV-1..13, INV-CORE-01..14) traces **up** to at
> least one Layer-0 invariant principle; none is deleted, weakened, or renumbered."

(Note the residual §2 phrase "Each record maps *down to* the existing operational principles it subsumes,"
which reads in the *subsuming/superior* direction and is reconciled here.)

**Replacement language** (enrollment-addendum re-scope):

> "**Non-Violation Rule (as enrolled — subordinate).** PCAMG-PRIN records **refine and map up-trace** to the
> ratified operational principles and invariants (`AUTH-003` P1–P10 / IP-01–IP-17; `UCOS-ASR-NFR-001`
> INV-1..13; `INV-CORE-001`). A PCAMG-PRIN record does **not bind, override, or supersede** any higher tier;
> where a record and a higher-tier rule appear to diverge, the **higher-tier rule governs** and the divergence
> is escalated. The §2 phrase 'maps *down to* … it subsumes' is read, as enrolled, as 'maps **up-trace** to the
> ratified principles it refines' — the records refine upward, they do not subsume downward."

**Rationale.** Converts a binding non-violation *command* into a subordinate *refinement/mapping* relationship,
and reconciles the one residual "subsumes/down" phrasing so the artifact reads consistently in the up-trace
direction required by `AUTH-012A` §5.2 R-2b.

**Governance effect.** Confirms 0002 adds a reference layer that *derives* from, and defers to, existing
principle canon. No operational artifact changes behavior; no principle is redefined (`AUTH-012A` §1.1,
Operational = Low/additive).

**Authority effect.** Establishes directionality — refinement flows **up** toward ratified authority, never down
as an override. Reinforces S3.2/S3.3 (INV-1..13, INV-CORE-01..14 PRESERVED, mapped not weakened).

**Traceability impact.** `AUTHORITY-COVERAGE-REPORT` records the up-trace mapping as *advisory refinement*; the
0002 §5 mapping table is preserved unchanged (already up-trace) and cited as the canonical mapping. Addendum
back-links to `AUTH-012A` §5.2 R-2b.

### R-2c — Sever Dependence on PCAMG-0008 Supremacy / Re-Rooting

**Current language** — PCAMG-0002 header field, §4 tail, and §6/Traceability:

> Header: "Governs (if enrolled) | All governance artifacts; no artifact may violate a registered invariant
> principle"
> §4: "This rule is the Layer-0 supremacy clause of `PCAMG-0008`."
> §6: "Proposed only; no enrollment; append-only; Article IX not released"
> Traceability: "**Governs (if enrolled):** all governance artifacts (Layer 0 of `PCAMG-0008`)."

**Replacement language** (enrollment-addendum severance):

> "**PCAMG-0008 dependence — severed for this enrollment.** The subordinate enrollment of PCAMG-0002 does
> **not** adopt, invoke, or depend on `PCAMG-0008` (Layer-0 re-rooting), which is **deferred and out of scope**
> (`AUTH-012A` §2.1 D-1). The header 'Governs (if enrolled): all governance artifacts' and the Traceability
> line 'Governs (if enrolled): all governance artifacts (Layer 0 of `PCAMG-0008`)' are, as enrolled,
> **superseded** by: 'Enrolled as a **subordinate** governance reference at the ARCHITECTURE tier; it governs
> nothing above itself and re-roots nothing. It derives authority from `AUTH-002/003/008/009` and is a citable
> reference catalog only.' No Layer-0 position, no supremacy, and no hierarchy change is claimed or enrolled."

**Rationale.** Cuts the structural tie to `PCAMG-0008` supremacy so enrolling 0002 cannot be read as a partial
adoption of re-rooting. Directly discharges `AUTH-012A` §5.2 R-2c and keeps D-1 deferred.

**Governance effect.** Enrollment stays a **minor additive** registration (add a subordinate controlled
artifact) rather than a structural governance change; preserves the AD-0012 precedent posture (`AUTH-012A`
§2.2). No Constitutional Majority is triggered (`AUTH-012A` §2.3).

**Authority effect.** Removes the last textual anchor to a competing Layer-0 root. Guarantees the ratified
hierarchy and its ordering are untouched (`AUTH-012A` §3, S3.5/S3.8 PRESERVED). `PCAMG-0008` remains PROPOSED and
out of scope.

**Traceability impact.** `PCAMG-INDEX` records 0002 as subordinate-enrolled with `PCAMG-0008` explicitly
deferred; `AUTHORITY-INDEX` registers 0002 at ARCHITECTURE tier (not Layer-0). Addendum back-links to `AUTH-012A`
§2.1 D-1 and §5.2 R-2c.

### R-2d — Confirm §5 Mapping Remains Up-Trace / Advisory and Namespacing Retains 0 Collision

**Current language** — PCAMG-0002 §2 (namespacing) and §6 (confirmations):

> §2: "Principle IDs are `PCAMG-PRIN-001..015`, disjoint from `P1..P10`, `IP-01..IP-17`, `INV-1..13`, and
> `INV-CORE-01..14` (0 collision)."
> §6: "Stable UUIDs assigned; IDs namespaced (0 collision with P/IP/INV/INV-CORE) ✅" and "`AUTH-003`, INV-1..13,
> `INV-CORE-*` unchanged (mapped, not replaced) ✅".

**Replacement language** (enrollment-addendum confirmation — no substantive change, verification only):

> "**Verified at enrollment.** The §5 mapping is **up-trace / advisory** (as reconciled by R-2b) and the
> `PCAMG-PRIN-001..015` namespace is **disjoint** from `P1..P10`, `IP-01..IP-17`, `INV-1..13`,
> `INV-CORE-01..14` — **0 collision** confirmed. UUIDs are stable and become authoritative only on enrollment.
> No renumbering, deletion, or weakening of any existing principle occurs. This confirmation is recorded as a
> precondition check in the enrollment `AD-`."

**Rationale.** `AUTH-012A` §5.2 R-2d marks this "already satisfied — verify at enrollment." The remediation is a
**verification obligation**, not a text change; specifying it keeps the enrollment auditable.

**Governance effect.** Adds a recorded precondition check to the enrollment decision; no rule change.

**Authority effect.** None — confirmatory only. Reaffirms that no existing authority/principle is altered.

**Traceability impact.** Enrollment `AD-` records the collision check result; `AUTHORITY-COVERAGE-REPORT` notes
0 collision. No index re-keying required.

---

## SECTION 2 — PCAMG-0007 Remediation

Target: `architecture/pcamg/PCAMG-0007-COMPLIANCE-ENGINE.md`.
Purpose: sever the meta-governance (`PCAMG-0003`) coupling, re-frame the artifact from a gate-*subsuming*
orchestrator to a gate-*consuming* observer, and bind it to report-only/dual-run so it enrolls strictly
subordinate and non-binding.

### R-7a — Sever the PCAMG-0003 Dependency; Rewire the Constitutional Stage to AUTH-002 / UCOS-CONST-001

**Current language** — PCAMG-0007 header, §3 stage table, and Traceability:

> Header: "Derives authority from | `PCAMG-0002`, `PCAMG-0003`"
> §3: "| **Constitutional** | Conformance to the Meta-Constitution and applicable domain constitution. |
> `PCAMG-0003`, `PCAMG-0005` |"
> Traceability: "**Derives authority from:** `PCAMG-0002`, `PCAMG-0003`."

**Replacement language** (enrollment-addendum rewire):

> "**Authority derivation (as enrolled — subordinate).** PCAMG-0007 derives authority from the **enrolled,
> remediated `PCAMG-0002`** and from the **ratified Constitution / Authority Layer** (`AUTH-002` /
> `UCOS-CONST-001`, and `AUTH-003`/`AUTH-008`/`AUTH-009`). The `PCAMG-0003` dependency is **severed and
> out of scope** (`AUTH-012A` §2.1 D-2). The §3 **Constitutional** stage is rewired to read: 'Conformance to
> **`AUTH-002` / `UCOS-CONST-001`** (ratified Constitution) and applicable ratified domain constitution —
> **verified against `AUTH-002`, not `PCAMG-0003`**.' All header and Traceability references to 'derives
> authority from `PCAMG-0002`, `PCAMG-0003`' are, as enrolled, superseded by 'derives authority from the
> enrolled `PCAMG-0002` + the ratified Constitution/Authority Layer.'"

**Rationale.** Routing the Constitutional stage through the Meta-Constitution would import out-of-scope
meta-governance (`AUTH-012A` §1.2 Authority = High/blocking, defect (b)). Rewiring to `AUTH-002`/`UCOS-CONST-001`
grounds the proof in ratified constitutional law and discharges `AUTH-012A` §5.2 R-7a and D-2.

**Governance effect.** The compliance proof references only enrolled/ratified inputs; no dependency on an
unenrolled meta-constitution. Keeps 0007's enrollment additive and self-consistent with the corpus.

**Authority effect.** Re-anchors the artifact's authority derivation to the ratified Authority Layer, confirming
Authority-prevails subordination. `PCAMG-0003` remains PROPOSED and out of scope; no meta-governance is adopted
(`AUTH-012A` §3, S3.5 PRESERVED).

**Traceability impact.** `PCAMG-INDEX` marks 0007's Constitutional stage bound to `AUTH-002`/`UCOS-CONST-001`;
`AUTHORITY-COVERAGE-REPORT` records the severed `PCAMG-0003` link. Addendum back-links to `AUTH-012A` §2.1 D-2
and §5.2 R-7a. Cross-artifact ordering (0002 before/with 0007) per `AUTH-012A` §1.3 recorded.

### R-7b — Re-frame "Relationship to Existing Gates" from Subsumes/Orchestrates to Consumes-as-Evidence

**Current language** — PCAMG-0007 §7 and Traceability:

> §7: "The Compliance Engine **subsumes and orchestrates** the existing governance gates rather than replacing
> them: `GATE-QUAL-001`, `GATE-SEC-001`, `GATE-DOC-001`, `GATE-REL-001`, the Constitutional Lock Engine, and
> the per-fabric threat/readiness models all become **Operational-stage** evidence sources feeding the proof."
> §8 confirmation: "Existing gates subsumed as evidence sources, not replaced ✅"
> Traceability: "**Orchestrates:** `GATE-QUAL/SEC/DOC/REL-001`, Constitutional Lock Engine, `INV-CORE-001`,
> fabric threat/readiness models."

**Replacement language** (enrollment-addendum re-frame):

> "**Relationship to existing gates (as enrolled — subordinate).** The Compliance Engine **consumes the outputs
> of** the existing governance gates as **read-only evidence**; it does **not** subsume, orchestrate, replace,
> gate, or govern them. `GATE-QUAL-001`, `GATE-SEC-001`, `GATE-DOC-001`, `GATE-REL-001`, the Constitutional
> Lock Engine, `INV-CORE-001`, and the per-fabric threat/readiness models **remain governed solely by
> `AUTH-008`/`AUTH-009`** and remain the binding authorities. Their outputs are Operational-stage evidence
> inputs to a **non-binding** proof. The words 'subsumes and orchestrates' and the Traceability verb
> 'Orchestrates' are, as enrolled, superseded by 'consumes as evidence.'"

**Rationale.** A subordinate artifact may read gate outputs but may not subsume gates governed by
`AUTH-008`/`AUTH-009` (`AUTH-012A` §1.2 defect (a)). Re-framing to consumption removes the second
authority-inversion vector and discharges `AUTH-012A` §5.2 R-7b.

**Governance effect.** Adds a relationship note that 0007 *consumes* gate outputs (`AUTH-012A` §2.1 M-3 target,
AUTH-009 §7). The gates' ownership and criteria are untouched; editing any gate criterion remains
Approval-Required (`AUTH-012A` §2.1 O-2, Trusted Governance Zone).

**Authority effect.** Prevents a subordinate artifact from asserting control over higher-governed gates;
preserves `AUTH-008`/`AUTH-009` as the sole gate authorities (`AUTH-012A` §3, S3.5 PRESERVED, S3.10 reinforced).

**Traceability impact.** `AUTHORITY-COVERAGE-REPORT` and `PCAMG-INDEX` record 0007 as a gate-*consumer*, not
orchestrator; the AUTH-009 §7 relationship note is the enrollment target (specified, not applied here). Addendum
back-links to `AUTH-012A` §5.2 R-7b.

### R-7c — Bind the Engine to Report-Only / Dual-Run Mode (Verdicts Non-Binding)

**Current language** — PCAMG-0007 §1, §4 "Fail-closed", and §6 verdict/gate:

> §1: "**no artifact is deployable without a compliance proof**."
> §4: "**Fail-closed** | Absence of any stage proof ⇒ NOT compliant ⇒ NOT deployable. Ambiguity resolves to
> deny."
> §6: "→ any FAIL/absent ⇒ NON-COMPLIANT ⇒ NOT deployable (blocking gap until remediated)".

**Replacement language** (enrollment-addendum mode-binding):

> "**Enrollment mode — report-only / dual-run (non-binding).** As enrolled, PCAMG-0007 operates in
> **report-only / dual-run** mode per `AUTH-012A` §4. Its verdict is **advisory and non-binding**: it
> **does not gate, block, delay, deploy, or authorize** anything. The **binding authorities remain** the
> existing gates (`GATE-QUAL/SEC/DOC/REL-001`, Constitutional Lock Engine, `INV-CORE-*` checks) and the
> Authority Board. The §1/§4/§6 phrases 'no artifact is deployable without a compliance proof' and 'NOT
> deployable' are, as enrolled, read as: 'no artifact is **recorded COMPLIANT** without a compliance proof;
> a NON-COMPLIANT verdict is an **append-only observation**, not a deployment block.' **Fail-closed is
> preserved as an observation discipline** (absence/ambiguity ⇒ logged NON-COMPLIANT), which — because the
> verdict is non-binding — is **not fail-open**: it cannot open any path the binding gates would close. Any
> move to binding enforcement requires a **separate Approval-Required promotion decision** and is deferred
> (`AUTH-012A` §2.1 D-3, §4.6)."

**Rationale.** Enrolling 0007 with a live "NOT deployable" gate would create an unreviewed release-gate change.
Binding it to report-only keeps enrollment additive and fail-safe, and discharges `AUTH-012A` §5.2 R-7c.

**Governance effect.** No new deployment gate is created (`AUTH-012A` §2.1 M-3). 0007 becomes a shadow observer
producing evidence for a possible future promotion; the release-gate surface is unchanged.

**Authority effect.** Confirms 0007 binds no tier and authorizes nothing (COMPLIANT ≠ authorization). Preserves
Article IX and fail-closed posture without granting enforcement power (`AUTH-012A` §3, S3.1/S3.7 PRESERVED).

**Traceability impact.** Enrollment `AD-` records mode = REPORT-ONLY; `PCAMG-INDEX` status = SUBORDINATE-ENROLLED
(REPORT-ONLY); dual-run evidence ledger (`AUTH-012A` §4.2) is the reproducibility anchor. Addendum back-links to
`AUTH-012A` §4 and §5.2 R-7c.

### R-7d — Confirm the Non-Waivable Set (S1/S3/S4 + PRIN-001/006) Is Anchored to AUTH-008 as Canonical Source

**Current language** — PCAMG-0007 §4 "Non-waivable core" and §8:

> §4: "**Non-waivable core** | S1 (authn/authz), S3 (secrets), S4 (data protection), PRIN-001 (Human
> Sovereignty), PRIN-006 (Auditability) cannot be waived by any autonomy provision."
> §8 confirmation: "Non-waivable S1/S3/S4 + PRIN-001/006 preserved (unwaivable) ✅".

**Replacement language** (enrollment-addendum confirmation — anchor, no substantive change):

> "**Verified at enrollment.** The non-waivable set **S1/S3/S4 is anchored to `AUTH-008` §7 as the canonical
> source** (PCAMG-0007 references it; it neither redefines nor relaxes it). `PRIN-001`/`PRIN-006` are anchored
> to the enrolled `PCAMG-0002` and up-trace to `AUTH-008`/Constitution. PCAMG-0007 lists these as **unwaivable
> by any autonomy provision** — an additive reinforcement, never a waiver. Dual-run tolerance for non-waivable
> false-negatives is **exactly 0** (`AUTH-012A` §4.5). This confirmation is recorded as a precondition check in
> the enrollment `AD-`."

**Rationale.** `AUTH-012A` §5.2 R-7d marks this "already stated — verify at enrollment." Specifying the
`AUTH-008` anchor makes the non-waivable source unambiguous and auditable; it is a verification obligation, not a
text change.

**Governance effect.** Adds a recorded precondition check; no rule change. Reinforces that 0007 cannot become a
route to waive a non-waivable control.

**Authority effect.** Confirms `AUTH-008` remains the canonical, untouched source of S1/S3/S4 (`AUTH-012A` §3,
S3.6 PRESERVED/reinforced). No security canon is edited.

**Traceability impact.** Enrollment `AD-` records the anchor check; `AUTHORITY-COVERAGE-REPORT` notes the
non-waivable set as `AUTH-008`-sourced. No security-canon version change.

---

## SECTION 3 — Subordination Verification

Demonstration that the Section 1–2 remediations, as specified, leave the ratified authority structure intact.

| # | Claim to demonstrate | Verdict | Demonstration |
|---|----------------------|:-------:|---------------|
| 3.1 | **AUTH-002 remains supreme** | **PRESERVED** | No remediation edits `AUTH-002`. R-2a/R-2b/R-2c re-point 0002 from "principle prevails / Layer-0 supremacy" to "**ratified Authority prevails**" (Const. Art. XI). R-7a rewires 0007's Constitutional stage to conform **to** `AUTH-002`/`UCOS-CONST-001`. Both artifacts now derive from, and defer to, the Constitution — confirming, not challenging, its supremacy. |
| 3.2 | **AUTH-009 remains authoritative** | **PRESERVED** | No remediation edits `AUTH-009`. R-7b confirms the gates remain **governed solely by `AUTH-008`/`AUTH-009`** (0007 consumes, never subsumes). R-7c creates **no** new deployment gate. Registration of the two artifacts and any §5/§6/§7 note are the Board's enrollment acts (`AUTH-012A` §2), not performed here. `AUTH-009`'s approval-by-exception framework and ownership model are untouched. |
| 3.3 | **AUTH-012 remains authoritative** | **PRESERVED** | No remediation edits `AUTH-012` or its ledger. This package records **no `AD-`** and asserts no decision. Every remediation defers its enactment to a Board decision (`AD-0024`/`AD-0025`) recorded through the normal `AUTH-012` process (`AUTH-012A` §5.4). The ledger's continuity through v1.0.13 / AD-0023 is relied upon, not altered. |
| 3.4 | **Article IX unchanged** | **PRESERVED** | No remediation releases or edits the Governed Generation lock. R-7c explicitly keeps 0007 report-only, producing no generation authority; COMPLIANT ≠ authorization is retained. `UCOS-CONSTRUCTION-BLOCKED` is untouched. No engine code is specified or authorized. |
| 3.5 | **Conflict resolution unchanged** | **PRESERVED** | The ratified conflict order ("Authority wins," Const. Art. XI / `AUTH-INDEX-001` §2) is **reaffirmed**, not modified. R-2a subordinates PCAMG-PRIN records to that existing order (advisory/escalated on conflict). No new conflict rule, tiebreak, or precedence is introduced; the escalation target remains the Authority Board. |
| 3.6 | **Authority hierarchy unchanged** | **PRESERVED** | R-2c severs the `PCAMG-0008` re-rooting anchor and fixes both artifacts at the **ARCHITECTURE** tier where they physically live. No Layer-0 layer is created; no tier is inverted, added, or bound above another. `PCAMG-0001/0003/0008` remain PROPOSED and out of scope. The ratified tier order (`AUTH-INDEX-001` §1) is unaffected. |

**Subordination conclusion.** Every remediation is **downward-only**: it lowers or re-anchors the target
artifact's claims to sit beneath ratified authority. No remediation grants, edits, or creates authority; each is
documentation-only and append-only (INV-10). The single class of risk identified in `AUTH-012A` §3 (S3.8
hierarchy inversion) is fully neutralized by R-2a + R-2c (0002) and R-7a + R-7b (0007).

---

## SECTION 4 — Post-Remediation Readiness Review

Re-evaluation of the two artifacts **assuming the Section 1–2 remediation specifications are adopted verbatim as
enrollment addenda.**

### 4.1 PCAMG-0002 — Re-evaluation

| Dimension (`AUTH-012A` §1.1) | Pre-remediation | Post-remediation (this package) |
|------------------------------|:---------------:|:-------------------------------:|
| Operational | Low (additive) | **Low (additive)** — unchanged; still a catalog, no runtime. |
| Governance | Medium (procedural) | **Medium (procedural)** — still needs Board registration; no rule weakened. |
| **Authority** | **High (blocking)** | **Low (additive)** — supremacy neutralized (R-2a), up-trace reading fixed (R-2b), `PCAMG-0008` severed (R-2c), 0-collision verified (R-2d). No inversion remains. |
| Security | None | **None** — unchanged. |
| Certification | Low (additive) | **Low (additive)** — unchanged. |

**Residual blockers for 0002:** none introduced by the artifact itself. Remaining items are **procedural
enrollment acts** (Board approval, registration, traceability), listed in Section 5 — not artifact defects.

### 4.2 PCAMG-0007 — Re-evaluation

| Dimension (`AUTH-012A` §1.2) | Pre-remediation | Post-remediation (this package) |
|------------------------------|:---------------:|:-------------------------------:|
| Operational | Low (additive, if report-only) | **Low (additive)** — bound to report-only by R-7c; non-binding. |
| Governance | Medium (procedural) | **Medium (procedural)** — needs Board registration + §7 consume-note; no rule weakened. |
| **Authority** | **High (blocking)** | **Low (additive)** — `PCAMG-0003` severed & Constitutional stage rewired to `AUTH-002` (R-7a); gates re-framed to consume-not-subsume (R-7b); non-waivable set anchored to `AUTH-008` (R-7d). |
| Security | None → Positive | **None → Positive** — report-only adds a second non-binding observation; S1/S3/S4 reinforced. |
| Certification | Medium (procedural) | **Medium (procedural)** — shadow observer only; binding promotion deferred (D-3). |

**Residual blockers for 0007:** none introduced by the artifact itself, **conditioned on** enrollment ordering
(0002 enrolled before/with 0007, `AUTH-012A` §1.3) and report-only binding holding. Remaining items are
procedural (Section 5).

### 4.3 Single Verdict

> ## **READY FOR SUBORDINATE ENROLLMENT**
>
> With the R-2a..d and R-7a..d remediation specifications in this package adopted verbatim as append-only
> enrollment addenda, **both `PCAMG-0002` and `PCAMG-0007` are READY FOR SUBORDINATE ENROLLMENT**, subject only
> to the procedural preconditions in Section 5 (Authority-Board approval, `AUTH-009` v1.1.0 registration,
> `AD-0024`/`AD-0025`, and traceability updates). The verdict advances `AUTH-012A`'s "READY AFTER REMEDIATION"
> to "READY FOR SUBORDINATE ENROLLMENT" **because the remediation content now exists**; it is **not** an
> enrollment and confers no authority. No further *remediation* is required.

The verdict is **not** "NOT READY" (the remediations are complete and bounded) and **not** "READY AFTER FURTHER
REMEDIATION" (no additional remediation is outstanding — only Board acts remain).

---

## SECTION 5 — Enrollment Preconditions

Every remaining condition before `AD-0024` and `AD-0025` may take effect, classified **Required** /
**Recommended** / **Deferred**. None is performed by this package.

### 5.1 Required (must be satisfied before enrollment takes effect)

| ID | Precondition | Basis |
|----|--------------|-------|
| **P-R1** | Authority Board reviews and **accepts `AUTH-012A`** (readiness analysis) and **`AUTH-012B`** (this remediation package). | `AUTH-012A` §5.4 step 1; AUTH-009 §8. |
| **P-R2** | The R-2a..d and R-7a..d addenda are authored **verbatim** from this package onto each target as **append-only** enrollment addenda (originals retained, marked superseded). | `AUTH-012A` §5.4 step 2; INV-10. |
| **P-R3** | Authority Board approves amending **`AUTH-009` v1.0.0 → v1.1.0** (M-1 register both as subordinate controlled artifacts; M-2 subordination clause; M-3 report-only note). | `AUTH-012A` §2.1 M-1..M-3, §2.3; AUTH-009 §8. |
| **P-R4** | Authority Board approves **subordinate enrollment** of `PCAMG-0002`, then `PCAMG-0007` (0002 before/with 0007). | `AUTH-012A` §1.3, §2.3, §5.3. |
| **P-R5** | Record **`AD-0024`** (AUTH-009 amendment + 0002 enrollment) and **`AD-0025`** (0007 enrollment, report-only) in `AUTH-012` with full ten-field records and the Board approval reference **present before effect**. | `AUTH-012A` §2.2, §5.3–§5.4; AUTH-012 §8. |
| **P-R6** | Enrollment-time **verification checks**: 0002 namespace 0-collision (R-2d) and 0007 non-waivable set anchored to `AUTH-008` (R-7d), recorded in the `AD-`. | `AUTH-012A` §5.2 R-2d/R-7d. |
| **P-R7** | `PCAMG-0007` bound to **report-only / dual-run**; no deployment gate created; binding enforcement not granted. | `AUTH-012A` §2.1 M-3, §4, §5.2 R-7c. |

### 5.2 Recommended (improve clarity/auditability; not required for a safe enrollment)

| ID | Precondition | Basis |
|----|--------------|-------|
| **P-C1** | Add the "Subordinate Governance / Compliance Artifact" ownership row to `AUTH-009` §6.3. | `AUTH-012A` §2.1 O-1. |
| **P-C2** | Note `PCAMG-0007` in the Trusted Governance Zone (`AUTH-009` §6.5) — consuming gate outputs is autonomous; editing any gate criterion stays Approval-Required. | `AUTH-012A` §2.1 O-2. |
| **P-C3** | Add glossary entries "Subordinate Enrollment" and "Compliance Proof (report-only)" to `AUTH-011`. | `AUTH-012A` §2.1 O-3. |
| **P-C4** | Update `AUTHORITY-INDEX`, `AUTHORITY-COVERAGE-REPORT`, `CTX-REG-001`, `PROJECT-STATE`, and `PCAMG-INDEX` §2 status notes on enrollment. | `AUTH-012A` §2.4. |

### 5.3 Deferred (explicitly NOT preconditions of subordinate enrollment)

| ID | Deferred item | Reason |
|----|---------------|--------|
| **P-D1** | Layer-0 supremacy / hierarchy re-rooting (`PCAMG-0008`). | Out of scope; severed by R-2c. `AUTH-012A` §2.1 D-1. |
| **P-D2** | Meta-Constitution enrollment (`PCAMG-0003`). | Out of scope; severed by R-7a. `AUTH-012A` §2.1 D-2. |
| **P-D3** | Promotion of `PCAMG-0007` from report-only to **binding** enforcement. | Requires ≥30-day dual-run evidence + separate Approval-Required release-gate decision. `AUTH-012A` §2.1 D-3, §4.5–§4.6. |
| **P-D4** | Enrollment of `PCAMG-0001/0004/0005/0006`. | Not in this readiness/remediation scope. `AUTH-012A` §2.1 D-4. |
| **P-D5** | Constitutional-Majority ratification. | Not triggered — no constitutional/invariant/hierarchy/non-waivable change. `AUTH-012A` §2.3. |

---

## SUCCESS CRITERIA — Confirmation

| Criterion | Result |
|-----------|:------:|
| Section 1 — PCAMG-0002: R-2a, R-2b, R-2c, R-2d, each with current language / replacement language / rationale / governance effect / authority effect / traceability impact | ✅ |
| Section 2 — PCAMG-0007: R-7a, R-7b, R-7c, R-7d, each with the same six fields | ✅ |
| Section 3 — Subordination verification (AUTH-002 supreme; AUTH-009/AUTH-012 authoritative; Article IX unchanged; conflict resolution unchanged; hierarchy unchanged) | ✅ |
| Section 4 — Post-remediation readiness review re-evaluating both artifacts; one verdict issued | ✅ (**READY FOR SUBORDINATE ENROLLMENT**) |
| Section 5 — All remaining preconditions before `AD-0024`/`AD-0025`, classified Required / Recommended / Deferred | ✅ |
| Produces a package that, if accepted by the Authority Board, enables a clean subordinate enrollment review | ✅ |
| **No enrollment · No governance mutation · No constitutional change · No authority creation · No edit to target artifacts** | ✅ |

## Traceability
- **Satisfies:** `AUTH-012A` §5.2 (remediation actions R-2a..d, R-7a..d) and §5.4 step 2.
- **Companion to:** `AUTH-012A` (readiness analysis), `AUTH-012` (Decision Log; proposes content for `AD-0024`/`AD-0025`, not recorded here).
- **Specifies remediation for:** `PCAMG-0002`, `PCAMG-0007` (subordinate enrollment only).
- **Governed by:** `AUTH-002` (Art. IX/XI/XII), `AUTH-008` (S1/S3/S4), `AUTH-009` (§5/§6/§8/§9), `AUTH-012`.
- **Preserves:** Article IX, INV-1..13 (`UCOS-ASR-NFR-001`), `INV-CORE-001`, non-waivable S1/S3/S4, the ratified hierarchy/precedence, `AUTH-012` ledger continuity (v1.0.13 / AD-0023).
- **Defers:** `PCAMG-0001/0003/0004/0005/0006/0008`, supremacy/re-rooting, binding-enforcement promotion, Constitutional-Majority.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect).

**END AUTH-012B · REMEDIATION SPECIFICATION · R-2a..d + R-7a..d PRODUCED · VERDICT: READY FOR SUBORDINATE ENROLLMENT · SUBORDINATE ENROLLMENT ONLY · NO ENROLLMENT · NO GOVERNANCE MUTATION · NO CONSTITUTIONAL CHANGE · NO AUTHORITY CREATION · APPEND-ONLY · PENDING AUTHORITY BOARD REVIEW.**
