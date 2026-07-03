# AUTO-THREAT-001 — Autonomy Threat Model (A1–A15)

| Field | Value |
|-------|-------|
| Artifact ID | `AUTO-THREAT-001` |
| Layer | ARCH (Autonomy) |
| Phase | PHASE 23 · PI-12 Autonomy Fabric (Design) |
| Status | **DESIGN — READY FOR RATIFICATION v1.0.0** (15 threats; **0 residual High/High**) |
| Method | STRIDE-aligned; per-threat pre/post likelihood×impact scoring; adversarial-test obligation |
| Refines | AUTO-GOV-001, AUTO-ARCH-001, AUTO-SEC-001, AUTO-FED-001, AUTO-AUD-001, AUTH-008 (S1/S3/S4), AD-0014, UCOS-CONST-001 (Art. IX/X) |
| Refined by | AUTO-READINESS-001 |

> Scoring scale L/M/H for likelihood and impact. "Residual" = post-mitigation. Target: **0 residual
> High/High**. The Autonomy Fabric's structural non-actuation property (propose-not-act; Evolution-only
> commit; emergency-halt-by-default) is what bounds impact across the board.

---

## 1. Threat ledger

| ID | Threat (STRIDE) | Pre (L×I) | Primary mitigations | Residual (L×I) |
|----|-----------------|:---------:|---------------------|:--------------:|
| **A1** | Goal injection / unauthorized goal authoring (S/E) | H×H | AUP-1 no self-authored charter; signed goal assertions (ASP-1); envelope refinement check; deny-by-default | **L×M** |
| **A2** | Authority escalation / privilege creep (E) | H×H | Enumerated signed authorities; monotonic non-escalation (AUP-10); SoD; clamped delegation | **L×M** |
| **A3** | Delegation loops / unbounded depth (E/DoS) | M×H | Acyclic + depth-bounded delegation (C6); auto-expiry; rate limits | **L×L** |
| **A4** | Constraint bypass / budget-rate evasion (T) | M×H | Fail-closed Constraint Evaluator; absent-surface ⇒ reject; monotonic inheritance | **L×M** |
| **A5** | Policy-evaluation (PEP) bypass (E) | M×H | Single controlled entry; deny-by-default; every path routes through PI-4 evaluator | **L×M** |
| **A6** | Actuation escape / execution outside envelope (E) — *the AD-0014 boundary threat* | H×H | Propose-not-act (AUP-5); Evolution-only commit; sandbox-confined side-effects; static keyspace write-guard; AD-0009 for high-impact | **L×M** |
| **A7** | Evolution-path bypass / independent commit (T) | M×H | No independent write/rollback path; commit only via Evolution `evolvableAllowlist` (`autonomy:`) | **L×M** |
| **A8** | Non-deterministic decision laundering (T; INV-6) | M×H | Determinism quarantine (ASP-3); deterministic verifier gate; `resultHash` reproducibility | **L×L** |
| **A9** | Rationale/audit suppression or forgery (R) | M×H | Mandatory rationale-chain gate (AAP-2); hash-chained tamper-evident audit; incomplete ⇒ reject | **L×L** |
| **A10** | Emergency-halt suppression / disablement (T/DoS) | M×H | Non-bypassable halt (ASP-4); actor cannot clear halt; SoD resume; auto-trigger on invariant breach | **L×L** |
| **A11** | Revocation evasion / zombie actor (E/T) | M×H | Signed cascading revocation; revoked ⇒ fails all assertion checks instantly; fail-closed | **L×L** |
| **A12** | Federated coordination abuse (foreign grants local effect) (E) | M×H | Advisory-only/deny-only/clamped (AUTO-FED-001); local re-ratification; local-shadows-foreign | **L×L** |
| **A13** | Goal drift / objective mis-generalization (T) | M×M | Envelope refinement checks; expiry; charter immutability except via governed Evolution + approval | **L×L** |
| **A14** | Resource exhaustion / runaway loop (DoS) | M×H | Budget/rate/time-box constraints; single in-flight bound; emergency halt; fail-closed | **L×M** |
| **A15** | Collusion / multi-actor SoD circumvention (E) | L×H | Separation of duties across adjacent powers; distinct signing authorities; Board approval for high-impact; audit reconciliation | **L×M** |

## 2. Residual posture

- **0 residual High/High** across A1–A15 (max residual = L×M).
- Structural bound: even a fully compromised actor cannot mutate governed state (A6/A7 closed by
  propose-not-act + Evolution-only commit), cannot escalate (A2 closed by enumerated/clamped
  authority), cannot escape halt (A10), and cannot launder non-determinism into a commit (A8). Impact
  is capped at rejected proposals + audit noise.

## 3. Boundary coverage

Every trust boundary — actor↔control-plane, actor↔evolution, actor↔actor (delegation),
local↔federated, decision↔intelligence (quarantine), execution↔sandbox — carries ≥1 threat and ≥1
control. 15/15 threats mapped to ≥1 control; 0 unmapped.

## 4. Adversarial-test obligation (for PI-12 implementation)

An A1–A15 adversarial suite is a **mandatory** implementation gate: goal injection, escalation via
delegation chain, delegation loop, constraint/budget evasion, PEP bypass attempt, actuation-escape
attempt, direct-commit attempt, laundered-forecast commit, rationale suppression, halt-disable
attempt, post-revoke action, foreign-grant attempt, drift, runaway loop, and collusion — each must be
**blocked** with a typed denial + audit entry, and the implemented baseline tests must remain green.

## 5. Traceability
- **Refines:** AUTO-GOV-001, AUTO-ARCH-001, AUTO-SEC-001, AUTO-FED-001, AUTO-AUD-001, AUTH-008, AD-0014, UCOS-CONST-001 (Art. IX/X).
- **Refined by:** AUTO-READINESS-001; prospective PI-12 authorization + implementation acts.
- **Owner:** UCOS Authority Board.

**END AUTO-THREAT-001 — DESIGN — READY FOR RATIFICATION (0 residual High/High).**
