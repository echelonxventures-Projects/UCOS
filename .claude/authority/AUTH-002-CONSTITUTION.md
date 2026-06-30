# AUTH-002 — Constitution Authority

**Authority ID:** AUTH-002
**Layer:** AUTHORITY
**Status:** RATIFIED (canonical supreme law)
**Version:** 1.0.0
**Supersedes:** `CTX-CONST-001` (baseline constitution) as the supreme governing law of UCOS.
**Immutability:** Immutable record. Evolves only via version increment + decision record (AUTH-012) + approval.

> This is the supreme law of UCOS. In any conflict, this Constitution Authority prevails over all
> other artifacts except AUTH-001 (Vision), which it operationalizes. No artifact, prompt, agent,
> or implementation may contradict it.

---

## 1. Purpose

Establish the canonical, binding legal framework of UCOS: the articles that govern primacy,
traceability, boundaries, contracts, configurability, security, quality, documentation, governed
generation, gap discipline, and — newly — Authority supremacy and approval-by-exception.

## 2. Scope

**In scope**
- The full set of constitutional articles binding on every UCOS artifact and actor.
- The precedence and conflict-resolution authority of the Constitution.
- The constitutional basis for the Authority Layer and approval governance.

**Out of scope**
- Detailed principle statements (AUTH-003), governance mechanics (AUTH-009), and any design.

## 3. Ownership

| Role | Responsibility |
|------|----------------|
| Authority Board | Sole authority to ratify or amend constitutional articles. |
| Chief Authority Architect | Drafts and maintains constitutional text. |
| All gates, prompts, agents | Bound to enforce and obey these articles. |

## 4. Dependencies

- **Upstream:** AUTH-001 (Vision) — the Constitution serves the Vision.
- **Downstream:** AUTH-003 through AUTH-012, all governance gates, all prompts, all artifacts.

## 5. Controlled Artifacts

- `.claude/context/UCOS-CONSTITUTION.md` (`CTX-CONST-001`) — subordinate; must conform to AUTH-002.
- All governance gates (`GATE-*`) — derive enforcement authority from these articles.

## 6. Governance Rules

The following articles are binding. Articles I–X are elevated from the baseline; Articles XI–XIII
are established by the Authority Layer.

**Article I — Primacy & Precedence.** Order of precedence: **Authority → Constitution →
Architecture → Specifications → Implementation → Validation → Certification.** No artifact may
contradict a higher-precedence artifact. Prompts are execution mechanisms, never sources of truth.

**Article II — Traceability.** Every artifact has a unique ID, a registry entry, and bidirectional
upstream/downstream links. No orphans.

**Article III — Domain-Driven Boundaries.** The system is organized into bounded contexts;
cross-context communication occurs only through published, versioned contracts; no shared mutable
domain models.

**Article IV — Contract-First.** Every boundary is defined by an explicit, versioned contract
before implementation; breaking changes require a new version and a migration path.

**Article V — Metadata & Configurability.** Variability across commerce models is expressed as
metadata/configuration, never code forks.

**Article VI — Security & Trust.** Zero-trust and least-privilege are defaults; no exposed
capability ships without authn/authz; secrets are never embedded in code or artifacts.

**Article VII — Quality & Production-Readiness.** No increment is "done" until quality, security,
documentation, and release gates pass; readiness is designed in and certified, never assumed.

**Article VIII — Documentation.** Architecture and decisions are durable artifacts; undocumented
behavior is a defect.

**Article IX — Governed Generation.** Platform, domains, services, and code are generated only by
their designated prompts; no phase generates artifacts it does not own.

**Article X — Gap Discipline.** Gaps are first-class: detected, recorded, owned, resolved; open
blocking gaps prohibit certification.

**Article XI — Authority Supremacy & Immutability.** The Authority Layer (`AUTH-*`) is the canonical
source of truth. Authority artifacts are immutable records: never deleted, evolved only through
version increment, decision record, traceability update, approval record, and governance review.
Where any artifact conflicts with Authority, **Authority prevails**.

**Article XII — Approval By Exception.** Governance defaults to **maximum safe autonomy**: Trusted
Operations execute autonomously with full audit and traceability; only the explicitly enumerated
Approval-Required Operations demand human approval (see AUTH-009). This article never weakens
Article VI security controls; it governs *when* humans are interrupted, not *whether* controls apply.

**Article XIII — Autonomous Agent Governance.** All autonomous agents, tools, and pipelines operate
within defined zones (AUTH-009) with explicit allowed/restricted/approval-required actions, and are
bound by audit and traceability requirements identical to human contributors.

## 7. Compliance Rules

- Every increment is evaluated against the governance gates that derive from these articles.
- A violation of any article is a blocking gap until remediated.
- Non-waivable controls (Article VI; security gate S1/S3/S4) cannot be bypassed by Article XII.

## 8. Approval Rules

- Amending ANY article is an **Approval-Required Operation** (Authority Board approval mandatory).
- Enforcing articles via Trusted Operations (gate execution, traceability updates) is autonomous.

## 9. Change Procedure

1. Propose amendment via AUTH-012 decision record with full alternatives and consequences.
2. Obtain Authority Board approval; record the approval reference.
3. Increment version; preserve superseded article text with a supersession link.
4. Propagate review flags to all downstream artifacts; update AUTHORITY-INDEX.

## 10. Traceability Links

- **Refines:** AUTH-001 (Vision).
- **Refined by:** AUTH-003 (Principles), AUTH-009 (Governance Canon), all gates, all prompts.
- **Controls:** `CTX-CONST-001`, all `GATE-*` artifacts.

## 11. Version Information

| Version | Date | Author | Change | Decision Ref |
|---------|------|--------|--------|--------------|
| 1.0.0 | 2026-06-29 | Chief Authority Architect | Ratified Articles I–X (elevated) + XI–XIII (Authority, Approval By Exception, Agent Governance). | AUTH-012 / AD-0001, AD-0002 |
