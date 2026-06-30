# UCOS — Implementation Governance

| Field | Value |
|-------|-------|
| Artifact | **UCOS-IMPLEMENTATION-GOVERNANCE** |
| Artifact ID | `UCOS-IMP-GOV-001` |
| Version | 1.0.0 |
| Phase | **Phase 10.0 — Implementation Readiness** |
| Status | CREATED — IMPLEMENTATION PLANNING |
| Mode | **PLANNING ONLY** — governance model for implementation; enacts, does not amend, ratified governance |
| Authority | Subordinate to Authority Layer (`AUTH-001..012`), Constitution (`UCOS-CONST-001`, Art. IX), UCOS Governance Baseline 1.0.0 |
| Generates | `TM-IMP-006` — Implementation Governance Matrix (§7) |
| Date | 2026-06-30 |

> Defines how the implementation program is **governed** — gate enforcement, traceability enforcement,
> Article IX lock control, approval-by-exception, change discipline, and escalation — by **enacting** the
> already-ratified Authority, Constitution, governance gates, and Control Fabric (`PEA-007`). It creates **no
> new governance authority** and waives **nothing**; non-waivable controls S1/S3/S4 (`AUTH-008`) remain fixed.

---

## 1. Governance Stance

1. **Subordinate & enacting.** This model realizes/refines existing governance; it never replaces,
   overrides, redefines, or contradicts it (mirrors `PD-GOV` / `CFP-010` inheritance discipline).
2. **Article IX is the master gate.** No code is generated until Prompts 01–09 are complete and ratified and
   the lock is formally released (`WP-ENB-01..05`).
3. **Gate-bound increments.** Every implementation increment passes Quality, Security, and Documentation
   gates plus a traceability check before it is "done."
4. **Single accountable owner.** Each WP has exactly one accountable owner (aligned to `PEO-001..017`).
5. **Approval-by-exception.** Trusted Operations proceed autonomously; Approval-Required Operations escalate
   to the Authority Board (`AUTH-009`).

## 2. Governance Gates (enacted, not redefined)

| Gate | ID | Checks | Non-waivable | Source |
|------|----|--------|:------------:|--------|
| Quality | `GATE-QUAL-001` | Q1–Q6 (incl. Q3 coverage, Q4 contract tests) | — | `.claude/governance/quality-gates.md` |
| Security | `GATE-SEC-001` | S1–S7 | **S1, S3, S4** | `.claude/governance/security-gates.md` |
| Documentation | `GATE-DOC-001` | D1–D6 (incl. D6 runbooks) | — | `.claude/governance/documentation-gates.md` |
| Traceability | (enforced) | zero orphans; full contract coverage | — | `CTX-TRACE-001`, skill `traceability-enforcement` |
| Completion | (enacted) | per `completion-criteria.md` | — | `.claude/governance/completion-criteria.md` |
| Release | (terminal) | per `release-gates.md` (Prompt 12) | — | `.claude/governance/release-gates.md` |

## 3. Article IX Lock-Release Control

| Condition | Owner | Required state to release lock |
|-----------|-------|--------------------------------|
| Experience Architecture (06) | `WP-ENB-01` | RATIFIED |
| Service & API Contracts (07) | `WP-ENB-02` | RATIFIED |
| Security Architecture (09) | `WP-ENB-03` | RATIFIED (S1/S3/S4 enforced) |
| Technology-selection ADRs (08) | `WP-ENB-04` | RECORDED & RATIFIED |
| Platform Engineering ratification (Phase 9.1) | `WP-ENB-05` | RATIFIED (`PEA-001..007`) |

> Lock release is an **Approval-Required Operation** authorized by the Authority Board. Until released, all
> `WS-PLT-*` / `WS-BIZ` / `WS-EXP` code generation is prohibited (Constitution Article IX).

## 4. Roles & Decision Rights

| Role | Decision rights | Escalates to |
|------|-----------------|--------------|
| WP Owner | Within-WP design-conformant implementation choices | Stream/Platform Lead |
| Platform/Stream Lead | Cross-WP sequencing within a stream | Implementation Program |
| Implementation Program | Increment scope, gate dispositions | Authority Board |
| Authority Board | Lock release, scope exceptions, baseline amendments | (terminal) |

## 5. Change Discipline

- **Append-only / migration-only** evolution; ratified constructs are never deleted (`CFP-008`).
- Any change to a frozen baseline construct requires a **new baseline version (≥1.0.1)** via governed
  amendment with an `AUTH-012` decision record and Authority Board ratification.
- Modifying an upstream artifact flags all downstream WPs for review (`CTX-TRACE-001` §4.5).
- Implementation introduces **no** new contract/capability/domain/data/metadata/experience/platform/security
  construct (those belong to Prompts 02–09).

## 6. Gap & Exception Handling

| Event | Handling |
|-------|----------|
| Gate failure (Q/S/D) | Recorded gap **blocks** the increment; fixed before "done" |
| Orphan / traceability gap | Blocking; resolved via `gap-detection` skill before closure |
| Non-waivable S1/S3/S4 risk | Hard stop; no waiver possible (`AUTH-008`) |
| Unsanctioned scope detected | Reject; route to owning design prompt (02–09) |
| Need to deviate from ratified design | Approval-Required → Authority Board |

## 7. TM-IMP-006 — Implementation Governance Matrix

| Governance control | Enacts (source) | Applies to | Enforcement point | Waivable |
|--------------------|-----------------|-----------|-------------------|:--------:|
| Article IX lock | Constitution Art. IX | all implementation WPs | S0 lock release | No |
| `GATE-QUAL-001` | quality-gates | WP-PLT/BIZ/EXP | per increment | Yes (recorded) |
| `GATE-SEC-001` | security-gates | WP-PLT/BIZ/EXP | per increment | S1/S3/S4 No |
| `GATE-DOC-001` | documentation-gates | WP-PLT/BIZ/EXP | per increment | Yes (recorded) |
| Traceability enforcement | `CTX-TRACE-001` | all artifacts | per increment + cert | No |
| Control Fabric (`PCE-*`) | `PEA-007` | all runtime services | runtime + cert | S1/S3/S4 No |
| Single-owner accountability | `PEO-001..017` | all WPs | WP assignment | No |
| Approval-by-exception | `AUTH-009` | scope/lock/baseline | decision point | (process) |
| Append-only change discipline | `CFP-008`, `AUTH-012` | baseline constructs | amendment | No |

> **TM-IMP-006 result:** 9 governance controls enacted from ratified sources; Article IX, traceability,
> Control Fabric, single-owner accountability, and append-only discipline are **non-waivable**; non-waivable
> security S1/S3/S4 preserved end-to-end. **0 new governance authority created; 0 waiver of non-waivable
> controls; 0 redefinition of ratified governance.**

## 8. Validation

| Check | Target | Observed | Result |
|-------|:------:|:--------:|:------:|
| All implementation increments gate-bound | yes | yes | ✅ |
| Article IX lock control defined | yes | yes | ✅ |
| Non-waivable S1/S3/S4 preserved | yes | yes | ✅ |
| New governance authority created | 0 | 0 | ✅ |
| Ratified governance redefined/overridden | 0 | 0 | ✅ |
| Single-owner accountability per WP | 100% | 100% | ✅ |

## Traceability
- **Refines:** `AUTH-008/009/012`, `UCOS-CONST-001` (Art. IX), governance gates, `PEA-007`, `PEO-001..017`, `CTX-TRACE-001`.
- **Refined by:** `UCOS-IMP-PI-001`, `UCOS-IMP-READY-001`.
- **Owner:** Implementation Program (subordinate to Authority Board).
