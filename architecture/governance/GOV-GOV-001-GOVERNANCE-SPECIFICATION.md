# GOV-GOV-001 — UCOS Governance Fabric Specification

| Field | Value |
|-------|-------|
| Artifact | **GOV-GOV-001 — Governance Fabric Specification** |
| Workstream | FND-GOV-01 (PHASE 25 · PI-14.0 Governance Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, or services |
| Basis | AD-0016 (substrate), AD-0017 (control), AD-0018 (federation), AD-0019 (evolution), AD-0020 (knowledge) — all RATIFIED; AUTH-001..012; `UCOS-CONST-001` (esp. Parts IX/X/XI/XII); AUTH-008/009; AD-0009; AD-0014 (Ω∞ deferral stands) |
| Realizes | 7 governed governance instruments/constructs + 14 governance constructs; threats G1, G2, G3, G4, G5, G6, G9, G10 (governance side) |
| Prohibited-dir impact | **NONE** — all constructs are runtime records in the substrate Metadata runtime (metadata-first) |

> This specification defines governance-fabric governance **only**. It authorizes no implementation. All
> constructs are expressed as runtime, metadata-stored records interpreted by the existing PI-4
> governance/policy engines and the PI-6 Evolution Fabric — **0 hardcoded policies, laws, authorities,
> rights, or obligations** (IP-04). Governance-fabric implementation remains gated behind a future PI-14
> authorization act by the Authority Board.
>
> **Subordination clause (non-negotiable).** The Governance Fabric **operationalizes** the Authority Layer
> (`AUTH-001..012`) and the Constitution (`UCOS-CONST-001`) at runtime; it **realizes / refines / enacts**
> them and may **never replace, override, redefine, contradict, or amend** them. No fabric construct confers
> authority the Authority Layer did not grant, and no fabric construct can amend the Constitution or the
> Authority Layer — those remain **AUTH-012 decision-record acts of the Authority Board**. The Governance
> Fabric is **not** an Ω∞ self-directed / self-amending governance system (AD-0014 stands; no INV-14..20).

---

## 1. Principles (governance-fabric-specific, subordinate to the Authority Layer)

- **GGP-1 Supremacy & Subordination.** The Authority Layer and Constitution are supreme. Every fabric
  instrument is subordinate and carries an explicit `derivesFrom` chain terminating at an Authority/
  Constitution source. An instrument that cannot trace upward is invalid. Closes **G10 precedence subversion**
  (governance side).
- **GGP-2 Single Accountable Owner.** Every governance instrument and construct has exactly one accountable
  owner (mirrors PEO single-owner); escalation terminates at the local Authority Board (AUTH-009).
- **GGP-3 Deny-by-Default Empowerment.** Absent an explicit, verified, in-boundary grant, no authority, right,
  permission, or enforcement effect exists. Empty grant ⇒ deny. Closes **G3/G5** (governance side).
- **GGP-4 Enumerated, Non-Escalating Authority.** Authority is a set of **enumerated powers**; delegation may
  only **narrow** (never broaden) the delegator's powers, is bounded in depth and scope, is non-circular, and
  is revocable. No implicit or transitive power. Closes **G3 escalation / G4 delegation abuse**.
- **GGP-5 Governed Mutation Only via Evolution.** All durable governance mutation — enacting/amending/repealing
  a policy/law/regulation, granting/revoking authority/rights, imposing/discharging obligations — routes
  through the ratified Evolution Fabric (evolution units targeting the `governance:` namespace). The fabric
  introduces **no** independent mutation/rollback path. Migration-only (IP-14); backward-compatibility
  governed (IP-15).
- **GGP-6 Explicit Normative Precedence.** The instrument hierarchy is **Constitution/Authority ▷ Law ▷
  Regulation ▷ Policy** (higher wins). Conflicts are resolved deterministically by precedence then specificity
  then recency; an unresolved conflict is **fail-closed** (deny), never silently merged. Closes **G9 normative
  conflict**.
- **GGP-7 Local Sovereignty over Governance.** A node's local Authority Board is terminal for all governance
  affecting local capabilities. Foreign (federated) governance may **inform** but never **override** a local
  `active` instrument without local ratification; foreign governance is deny-only at the boundary.
- **GGP-8 Full Attributability & Non-Repudiation.** Every instrument, grant, enforcement decision, compliance
  attestation, and dispute ruling is attributable (who, under which authority, from which source) and
  auditable (GOV-AUD-001). Nothing is silently created, enforced, or waived.
- **GGP-9 Separation of Duties (non-waivable).** Proposing ≠ certifying ≠ ratifying ≠ enforcing ≠ adjudicating.
  No single authority may author, ratify, and adjudicate the same instrument.

## 2. Governed normative instruments (the Policy / Law / Regulation hierarchy)

Each instrument is a **governed record class**, not code. All instrument records are stored under the reserved
metadata keyspace `governance:<kind>:<id>` (see GOV-ARCH-001 §2). Every instrument declares `derivesFrom`
(upstream Authority/Constitution/higher-instrument) and `precedence` (GGP-6).

### 2.1 Law — `GOV-INST-LAW` (`GOV-GOV-I1`)
- **Purpose.** The highest fabric-level normative instrument: durable, broadly-scoped binding rules that
  **enact** a Constitutional Part or Authority canon into runtime-evaluable form. Law does not *create*
  constitutional authority — it *expresses* it.
- **Record.** `{ instId, kind:"law", title, derivesFrom:[AUTH/CONST refs], scope, normativeStatement, version, ratifiedBy, ratifiedAt, precedence:"law", supersedes?, provenance }`.
- **Lifecycle.** `proposed → certified → ratified → active → (superseded | repealed)` — **all transitions are
  evolution units** (GGP-5), signed and audited.
- **Decision rights.** Ratification: Governance Ratification Authority (`GOV-GOV-C6`) via the Evolution Fabric,
  quorum per Constitution; distinct from certification (SoD).
- **Invariants.** Must trace to an Authority/Constitution source (GGP-1); immutable versions (supersession, not
  edit-in-place); may not weaken a non-waivable S1/S3/S4 control.

### 2.2 Regulation — `GOV-INST-REG` (`GOV-GOV-I2`)
- **Purpose.** Domain-/context-scoped binding rules that **refine** a Law for a specific bounded context,
  capability, or federation boundary. Subordinate to Law.
- **Record.** `{ instId, kind:"regulation", derivesFrom:[lawId ...], scopeRef (domain/capability/boundary), normativeStatement, version, ratifiedBy, precedence:"regulation", provenance }`.
- **Lifecycle.** `proposed → certified → ratified → active → (superseded | repealed)` (evolution units).
- **Decision rights.** Ratified by the owning domain/context Governance Authority; may not contradict its
  parent Law (blocked at certification, GGP-6).
- **Invariants.** Precedence below Law, above Policy; conflict with a higher instrument ⇒ reject.

### 2.3 Policy — `GOV-INST-POL` (`GOV-GOV-I3`)
- **Purpose.** The operational, machine-evaluable rule set consumed by the PI-4 `PolicyEvaluator`
  (deny-by-default; deny-overrides-allow). Policy **implements** Law/Regulation as enforcement rules.
- **Record.** `{ instId, kind:"policy", derivesFrom:[law/reg refs], target?, rules[], priority, effect, version, ratifiedBy, precedence:"policy", provenance }` (aligns the ratified PI-4 `PolicyRecord`).
- **Lifecycle.** `proposed → certified → ratified → active → (superseded | repealed)` (evolution units).
- **Decision rights.** Ratified by the owning Governance Authority; loosening/removing a `block`/`deny` rule
  is Approval-Required (AD-0009).
- **Invariants.** Deny-by-default; may only enforce (never grant authority); must trace to a Law/Regulation or
  directly to an Authority source; conflict resolved by GGP-6.

> **Instrument precedence (GGP-6):** `Constitution / Authority Layer ▷ Law ▷ Regulation ▷ Policy`. The PI-4
> evaluator consumes **Policy**; Law/Regulation are the governed sources from which ratified Policy is derived
> and against which every Policy is validated at certification time.

## 3. Empowerment constructs (Authority · Delegation · Rights · Obligations)

### 3.1 Authority — `GOV-EMP-AUTH` (`GOV-GOV-E1`)
- **Purpose.** A named, enumerated set of **powers** a principal/authority may exercise (e.g.
  `propose|certify|ratify|enforce|adjudicate|delegate|revoke`). Reuses the PI-4/federation enumerated-power
  authority model.
- **Record.** `{ authId, holderRef, powers[], scopeRef, derivesFrom, issuedBy, issuedAt, expiresAt?, revocable:true, provenance, signature }`.
- **Invariants.** Enumerated only (no implicit powers); scoped; signed; revocable; may not exceed the issuer's
  own powers (GGP-4). Closes **G2 authority forgery** (with GOV-SEC-001).

### 3.2 Delegation — `GOV-EMP-DEL` (`GOV-GOV-E2`)
- **Purpose.** Time-/scope-bounded transfer of a **subset** of an authority's powers to another principal.
- **Record.** `{ delId, fromAuthId, toHolderRef, powers⊆from.powers, scope⊆from.scope, depth, expiresAt, revocable:true, provenance, signature }`.
- **Invariants.** **Narrowing only** (`powers ⊆ delegator.powers`, `scope ⊆ delegator.scope`); bounded `depth`;
  **non-circular** (cycle detection reuses the PI-2 dependency resolver); expiring; revocable with propagation.
  Closes **G3 escalation / G4 delegation-chain abuse**.

### 3.3 Rights — `GOV-EMP-RIGHT` (`GOV-GOV-E3`)
- **Purpose.** Governed entitlements granted to a principal/subject (e.g. access, appeal, data-subject rights),
  distinct from powers (rights are held/claimed; powers are exercised).
- **Record.** `{ rightId, subjectRef, rightType, derivesFrom:[law/reg/policy], grantedBy, grantedAt, conditions[], revocable, provenance }`.
- **Invariants.** Deny-by-default (an unheld right is denied, closes **G5 rights fabrication**); traces to a
  ratified instrument; revocation is governed + audited.

### 3.4 Obligations — `GOV-EMP-OBLIG` (`GOV-GOV-E4`)
- **Purpose.** Governed duties imposed on a principal/authority (e.g. must-audit, must-retain, must-report,
  must-respond-to-dispute), with a due condition and an enforcement hook.
- **Record.** `{ obId, obligorRef, obligationType, derivesFrom, dueCondition, enforcementRef, status:"open|discharged|breached", provenance }`.
- **Invariants.** An open obligation whose due condition fires without discharge is a **breach** → enforcement
  (GOV-GOV-O1) + audit; obligations cannot be silently discharged (closes **G6 obligation evasion**).

## 4. Operational governance (Enforcement · Compliance · Dispute Resolution)

### 4.1 Enforcement — `GOV-GOV-O1`
- **Purpose.** The act of applying an instrument to a decision. Enforcement is **not** a new decision path —
  it is realized by the ratified PI-4 Control Plane / Policy Enforcement Point (deny-by-default,
  deny-overrides-allow) consuming ratified Policy derived from Law/Regulation.
- **Rule.** No governed action executes without passing the enforcement gate; every enforcement decision
  (allow/deny + reason + instruments applied) is audited (no silent enforcement). Closes **G7 enforcement
  bypass** (with GOV-SEC-001 §9).

### 4.2 Compliance — `GOV-GOV-O2`
- **Purpose.** Attestation that a subject/capability satisfies the applicable instruments and discharged its
  obligations, over a stated scope and period.
- **Record.** `{ compId, subjectRef, scope, attestedInstruments[], obligationsChecked[], verdict:"compliant|non-compliant|conditional", attestedBy (Compliance Authority), evidenceRef[], at, signature, provenance }`.
- **Invariants.** Signed by an in-boundary Compliance Authority (SoD: attester ≠ enforcer of the same act);
  evidence-referenced; tamper-evident; a forged/self-attested compliance is rejected. Closes **G8 compliance
  falsification** (with GOV-SEC-001).

### 4.3 Dispute Resolution — `GOV-GOV-O3`
- **Purpose.** The governed process for raising, adjudicating, and recording disputes over an instrument, a
  grant, an enforcement decision, or a compliance verdict.
- **Record.** `{ disputeId, raisedBy, against (instId/decisionRef), grounds, adjudicator (Dispute Authority), ruling:"upheld|overturned|remanded", remedy?, at, signature, provenance }`.
- **Invariants.** Adjudicator must be an in-boundary Dispute Authority **distinct** from the authority that
  authored/enforced the disputed act (SoD, GGP-9); ruling is an evolution unit if it changes an instrument;
  escalation terminates at the Authority Board (AUTH-009). Closes **G11 dispute-resolution capture** (with SoD
  + audit).

## 5. Governance federation

Foreign governance instruments/authorities are evaluated across a federation trust boundary (AD-0018),
**deny-only** and **namespace-isolated** (`federation:<nodeId>:governance:*`), never overriding a local
`active` instrument (GGP-7). Full treatment in **GOV-FED-001**. Admission of a Federated Governance Authority
is Approval-Required (AD-0009).

## 6. The 14 Governance Fabric constructs

Each construct specifies **Purpose · Owner · Approval-Required · Fail-closed · Threats**. Records live under
`governance:<kind>:<id>` (local) or `federation:<nodeId>:governance:<kind>:<id>` (foreign).

| # | Construct | Purpose | Owner (accountable) | Approval-Required? | Fail-closed? | Threats |
|---|-----------|---------|---------------------|:------------------:|:------------:|---------|
| **C1** | Instrument Registry | Declares Law/Regulation/Policy instruments + precedence + `derivesFrom` | Authority Board | Yes (enact/amend/repeal) | Yes | G1, G9, G10 |
| **C2** | Instrument Index | Metadata-backed index by kind/scope/version/precedence | Governance Steward | No (read) / Yes (register) | Yes | G1, G9 |
| **C3** | Governance Namespace | Reserved keyspace `governance:*` (+ `federation:*:governance:*`), disjoint prefixes | Authority Board | Yes | Yes | G1, G12 |
| **C4** | Governance Proposal Authority | Empowered to propose instruments/grants (never ratify own) | Authority Board | Yes | Yes | G1, G3 |
| **C5** | Governance Certification Authority | Certifies an instrument is well-formed, traces upstream, non-conflicting, S1/S3/S4-safe | Authority Board | Yes | Yes | G1, G9, G10 |
| **C6** | Governance Ratification Authority | Terminal authority ratifying Law/Regulation/Policy (via Evolution); **distinct from C5** (SoD) | Authority Board | Yes | Yes | G1, G9 |
| **C7** | Authority & Delegation Registry | Owns enumerated authorities + bounded, non-circular delegations | Authority Board | Yes | Yes | G2, G3, G4 |
| **C8** | Rights & Obligations Registry | Owns governed rights (entitlements) and obligations (duties) + status | Authority Board | Yes | Yes | G5, G6 |
| **C9** | Enforcement Authority | Binds ratified Policy to the PI-4 PEP; owns enforcement gates | Authority Board | Yes | Yes (deny) | G7 |
| **C10** | Compliance Authority | Issues/attests signed compliance verdicts against instruments | Authority Board | Yes | Yes | G8 |
| **C11** | Dispute Resolution Authority | Adjudicates disputes; SoD from author/enforcer | Authority Board | Yes | Yes | G11 |
| **C12** | Governance Revocation Authority | Revokes instruments, authorities, delegations, rights, certifications, ratifications | Authority Board | Yes | Yes (propagate) | G2, G4, G5 |
| **C13** | Federated Governance Authority + Trust Boundary | Node/authority whose governance this node evaluates; `defaultEffect: deny` | Authority Board | Yes | Yes (default deny) | G12, G14 |
| **C14** | Governance Audit & Reconciliation Authority | Owns the governance audit chain, amendment/dispute trail, cross-node reconciliation | Authority Board | Yes | Yes | G13, G14 |

**14/14 constructs defined.** All map to existing primitives — PI-4 governance processes/approvals/policy
evaluator/revocation and deny-overrides-allow; PI-6 Evolution Fabric for mutation; AD-0018 federation
trust/boundary/audit; the PI-4 dependency resolver for delegation-cycle detection — plus new metadata record
kinds. **No core-dir change.**

## 7. Governance coverage & separation of duties

- **Separation of duties (non-waivable, GGP-9):** Proposal (C4) ≠ Certification (C5) ≠ Ratification (C6) ≠
  Enforcement (C9) ≠ Adjudication (C11). No single authority may author, ratify, enforce, and adjudicate the
  same instrument or act.
- **Approval-Required acts (AD-0009):** enacting/amending/repealing any Law/Regulation/Policy; granting or
  revoking an authority/delegation/right; imposing or discharging an obligation; issuing or revoking a
  compliance verdict; admitting a Federated Governance Authority; importing foreign governance; issuing a
  binding dispute ruling that changes an instrument. Each requires explicit human/Board approval at execution.
- **Escalation:** all governance-fabric decisions escalate to the local Authority Board (AUTH-009); the fabric
  never becomes terminal over the Authority Layer/Constitution (GGP-1).

## 8. Concept coverage (mandated scope)

| Concept | Where specified |
|---------|-----------------|
| Policy | §2.3 (`GOV-INST-POL`) |
| Law | §2.1 (`GOV-INST-LAW`) |
| Regulation | §2.2 (`GOV-INST-REG`) |
| Authority | §3.1 (`GOV-EMP-AUTH`) |
| Delegation | §3.2 (`GOV-EMP-DEL`) |
| Rights | §3.3 (`GOV-EMP-RIGHT`) |
| Obligations | §3.4 (`GOV-EMP-OBLIG`) |
| Enforcement | §4.1 (`GOV-GOV-O1`) |
| Compliance | §4.2 (`GOV-GOV-O2`) |
| Dispute Resolution | §4.3 (`GOV-GOV-O3`) |
| Governance Federation | §5; GOV-FED-001 |

**11/11 mandated governance concepts specified.**

## 9. Traceability
- **Refines:** AD-0016/0017/0018/0019/0020; AUTH-001..012 (esp. AUTH-009 authority hierarchy, AUTH-008
  S1/S3/S4); `UCOS-CONST-001` Parts IX/X/XI/XII; IP-04 (metadata-first); IP-14/IP-15 (migration-only /
  backward-compatibility via the Evolution Fabric); AD-0009; AD-0014 (Ω∞ deferral).
- **Consumed by:** GOV-ARCH-001, GOV-SEC-001, GOV-FED-001, GOV-AUD-001, GOV-THREAT-001, GOV-READINESS-001, and
  a future PI-14 implementation act.
- **Owner:** UCOS Authority Board.

**END GOV-GOV-001 — DESIGN · READY FOR RATIFICATION · SUBORDINATE TO AUTHORITY/CONSTITUTION · NO IMPLEMENTATION AUTHORIZED.**
