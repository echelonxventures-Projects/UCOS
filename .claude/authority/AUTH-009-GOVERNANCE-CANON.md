# AUTH-009 — Governance Canon

**Authority ID:** AUTH-009
**Layer:** AUTHORITY
**Status:** RATIFIED (canonical governance model)
**Version:** 1.0.0
**Supersedes:** Governs all `GATE-*` artifacts and program governance as the canonical governance authority.
**Immutability:** Immutable record. Evolves only via version increment + decision record (AUTH-012) + approval.

> This canon is the operating governance core of UCOS. It establishes the authority hierarchy,
> conflict resolution, ownership model, approval-by-exception framework, autonomous-agent zone
> model, and change governance. It maximizes safe autonomy while preserving full auditability and
> traceability. It NEVER weakens the non-waivable security controls in AUTH-008.

---

## 1. Purpose

Establish the canonical governance model that prevents architectural, specification, prompt, agent,
governance, compliance, and execution drift, and that enables maximum safe autonomy through an
approval-by-exception framework with strong audit and traceability.

## 2. Scope

**In scope**
- The immutable authority/governance hierarchy and conflict-resolution order.
- The ownership model for every artifact class.
- The approval-by-exception framework: Trusted Operations and Approval-Required Operations.
- Autonomous-agent governance: zones, allowed/restricted/approval-required actions, audit.
- Change governance for Authority artifacts.

**Out of scope**
- Vision/principle/security content (their canons); any architecture, domain, or implementation.

## 3. Ownership

| Role | Responsibility |
|------|----------------|
| Authority Board | Final approver of all Approval-Required Operations and Authority changes. |
| Chief Authority Architect | Custodian of the governance model; maintains zone definitions. |
| Phase/Prompt Owners | Accountable for artifacts their prompt produces. |
| Autonomous Agents | Execute Trusted Operations within their assigned zone; must escalate exceptions. |
| Audit function | Verifies every governed action is logged and traceable. |

## 4. Dependencies

- **Upstream:** AUTH-002 (Art. I, XI, XII, XIII), AUTH-003 (IP-08, IP-10, IP-16, IP-17), AUTH-008.
- **Downstream:** All `GATE-*`, all prompts, all agents and automation pipelines.

## 5. Controlled Artifacts

- All governance gates (`GATE-QUAL-001`, `GATE-SEC-001`, `GATE-DOC-001`, `GATE-REL-001`,
  `GATE-DONE-001`) — subordinate; derive authority here.
- All agent/automation execution policies and CI/CD governance.

## 6. Governance Rules

### 6.1 Authority & Governance Hierarchy (immutable)

```
AUTHORITY
  ↓
BOOTSTRAP
  ↓
CONSTITUTION
  ↓
CONTEXT
  ↓
SKILLS
  ↓
PROMPTS
  ↓
ARCHITECTURE
  ↓
SPECIFICATIONS
  ↓
IMPLEMENTATION
  ↓
VALIDATION
  ↓
CERTIFICATION
```

No artifact may violate this hierarchy. A lower tier may never override a higher tier.

### 6.2 Conflict Resolution (Authority Wins)

When two artifacts conflict, the higher-precedence artifact prevails. Canonical priority:

```
Authority > Constitution > Architecture > Specifications > Implementation > Validation > Certification
```

- Prompts are **execution mechanisms**, never sources of truth. If a prompt conflicts with
  Authority, **Authority prevails** and the prompt is corrected.
- Any detected conflict is recorded as a blocking gap and routed to the owning authority.

### 6.3 Ownership Model

| Artifact class | Owner | Approver of change |
|----------------|-------|--------------------|
| Authority (`AUTH-*`) | Chief Authority Architect | Authority Board |
| Constitution / Principles | Chief Authority Architect | Authority Board |
| Context package | Chief Architect | Authority Board |
| Skills / Prompts | Prompt Governance Steward | Chief Authority Architect |
| Architecture / Specifications | Owning architect (per layer) | Chief Authority Architect + gates |
| Implementation | Implementation owner (Prompt 10) | Quality/Security/Doc gates |
| Validation / Certification | Validation & Certification owners | Gates + Authority Board (release) |

### 6.4 Approval-By-Exception Framework

The default posture is **maximum safe autonomy**: operations are autonomous unless explicitly
enumerated as approval-required. The objective is maximum auditability and traceability with minimum
unnecessary human interruption. This **never** bypasses security or safety controls (AUTH-008).

**Trusted Operations — execute autonomously (full audit + traceability required):**
- Documentation generation and updates; architecture documentation.
- Prompt generation and normalization; specification generation.
- Traceability updates; state updates; artifact registration.
- Validation execution; certification execution (verdict recording, not release authorization).
- Test generation; compliance reporting; governance reporting.
- Non-behavioral refactoring; static analysis; linting; formatting.

Every Trusted Operation MUST: emit an immutable audit record (IP-10), maintain traceability
(IP-08), and remain within the actor's assigned zone (§6.5).

**Approval-Required Operations — always require human approval (never autonomous):**
- Authority modifications; Constitution modifications.
- Security policy changes (see AUTH-008 §8).
- Production deployment.
- Secret creation/modification; credential creation/rotation.
- External account creation; vendor onboarding.
- Financial transactions; legal commitments.
- Repository ownership changes.
- Destructive actions (irreversible deletes, force operations, bulk destructive changes).
- Authority artifact deletion (additionally prohibited outright by §6.6).

When an operation is ambiguous or spans both categories, it is treated as **Approval-Required**
(fail-safe default).

### 6.5 Autonomous-Agent Zone Model

Every agent, tool, and pipeline operates within exactly one zone. Each zone defines Allowed,
Restricted, and Approval-Required actions, with mandatory audit and traceability.

| Zone | Allowed (autonomous) | Restricted (scope-limited) | Approval-Required | Audit / Traceability |
|------|----------------------|----------------------------|-------------------|----------------------|
| **Trusted Document Zone** (`docs/**`, reports) | Generate/update docs, reports, normalization | Editing governance gate text | Deleting any doc; editing Authority docs | Full audit; trace to source artifact |
| **Trusted Architecture Zone** (`architecture/**`, `specifications/**`) | Author architecture/specs/ADRs within authorized prompt | Cross-layer edits | Changing architecture canon (AUTH-004) | Full audit; trace to capability/domain |
| **Trusted Governance Zone** (`.claude/governance/**`, `.claude/state/**`) | State updates; registry updates; gate execution & verdicts | Editing gate criteria | Amending any gate or completion criteria | Full audit; trace to gate + decision |
| **Trusted Workspace Zone** (`services/**`, `apps/**`, `packages/**`) | Generate code/tests strictly from ratified contracts (Prompt 10); refactor non-behaviorally | Adding dependencies; build/config changes | Production deploy; secret/credential ops; destructive ops | Full audit; trace to contract + control |
| **Trusted Agent Zone** (`.claude/authority/**`) | Read Authority; propose changes via decision record | — | ALL writes to Authority (immutable; approval-gated) | Full audit; trace to AUTH-012 decision |

Cross-zone actions require the higher zone's approval rules. An agent that encounters an
Approval-Required action MUST halt that action and escalate; it MUST NOT attempt a workaround.

### 6.6 Change Governance for Authority Artifacts

- Authority artifacts are **immutable records** and may **never be deleted**.
- They evolve ONLY through: **Version Increment → Decision Record (AUTH-012) → Traceability Update →
  Approval Record → Governance Review.**
- Every Authority change must be auditable, traceable, and versioned. Superseded text is preserved
  and linked, never removed.

## 7. Compliance Rules

- An action outside an actor's zone, or an Approval-Required Operation executed without approval, is
  a non-waivable governance violation and a blocking gap.
- A Trusted Operation lacking an audit record or traceability is a blocking compliance gap.
- Any artifact that violates the hierarchy or precedence order is a blocking gap until corrected.
- The approval-by-exception framework may never reduce the AUTH-008 non-waivable control set.

## 8. Approval Rules

- Amending this governance canon, the hierarchy, conflict-resolution order, zone definitions, or
  either operation catalog is an **Approval-Required Operation** (Authority Board).
- Executing gates, recording verdicts, and updating state/registry are **Trusted Operations**.

## 9. Change Procedure

1. Propose via AUTH-012 decision record (context, statement, alternatives, consequences).
2. Obtain Authority Board approval; record approval reference and version impact.
3. Increment version; preserve superseded rules with supersession links.
4. Update AUTHORITY-INDEX and AUTHORITY-COVERAGE-REPORT; flag downstream actors for review.

## 10. Traceability Links

- **Refines:** AUTH-002 (Art. I/XI/XII/XIII), AUTH-003 (IP-08/IP-10/IP-16/IP-17), AUTH-008.
- **Refined by:** all `GATE-*`, all prompts, all agents/pipelines.
- **Controls:** `GATE-QUAL-001`, `GATE-SEC-001`, `GATE-DOC-001`, `GATE-REL-001`, `GATE-DONE-001`.

## 11. Version Information

| Version | Date | Author | Change | Decision Ref |
|---------|------|--------|--------|--------------|
| 1.0.0 | 2026-06-29 | Chief Authority Architect | Ratified hierarchy, conflict resolution, ownership model, approval-by-exception framework, autonomous-agent zones, change governance. | AUTH-012 / AD-0001, AD-0002, AD-0004, AD-0006, AD-0007, AD-0008, AD-0009 |
