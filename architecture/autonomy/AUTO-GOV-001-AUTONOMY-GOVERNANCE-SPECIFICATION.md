# AUTO-GOV-001 — Autonomy Governance Specification

| Field | Value |
|-------|-------|
| Artifact ID | `AUTO-GOV-001` |
| Layer | ARCH (Autonomy) |
| Phase | PHASE 23 · PI-12 Autonomy Fabric (Design) |
| Status | **DESIGN — READY FOR RATIFICATION v1.0.0** (no implementation) |
| Mode | DESIGN ONLY — no source code, runtime, infrastructure, services, cryptography, or authorization |
| Refines | AD-0016/0017/0018/0019/0020 (implemented substrate/control/federation/evolution/knowledge), AD-0021/0022 design predecessors (ontology/simulation), AD-0014 (Ω∞ deferral), AUTH-003 (IP-01..17), AUTH-008 (S1/S3/S4), AUTH-009, AUTH-012, UCOS-CONST-001 (Art. IX/XII), UCOS-SEC-ARCH-001 |
| Refined by | AUTO-ARCH-001, AUTO-SEC-001, AUTO-FED-001, AUTO-AUD-001, AUTO-THREAT-001, AUTO-READINESS-001; prospective PI-12 authorization act |

> **Append-only / additive.** The Autonomy Fabric is the highest-sensitivity fabric in UCOS. This
> specification defines **governed, bounded, delegated, revocable, fail-closed agency** — never
> self-directed existential autonomy. It enrolls **no** existential invariant (INV-14..20 remain
> deferred), preserves INV-1..13, and keeps the **AD-0014 Ω∞ boundary** intact: no self-authored
> charter, no self-modification, no autonomous actuation outside a pre-authorized policy envelope.

---

## 1. Purpose & position

The Autonomy Fabric is a **governed agency layer** that lets UCOS pursue **pre-authorized** goals
through **bounded autonomous actors** which **propose, never autonomously act**. Every autonomous
determination is policy-evaluated by the ratified **PI-4 Control Plane**, every governed-state change
is committed **only** through the ratified **PI-6 Evolution Fabric**, every plan is dry-run in a
**PI-11 Simulation** sandbox before proposal, and every cross-node contribution is **advisory-only**
via the **PI-5 Federation Fabric**. It is **additive** over PI-2..PI-11 with **zero prohibited-core-dir
change** (new `src/control/autonomy/*` + reserved `autonomy:*` metadata keyspace only).

The Autonomy Fabric is categorically **not** the AD-0014 Ω∞ existential/self-directed autonomy. Its
governor structurally forbids self-authored goals, self-granted authority, self-modification, and
un-gated actuation.

## 2. Autonomy Principles (AUP-1..AUP-12)

| ID | Principle | Requirement |
|----|-----------|-------------|
| **AUP-1** | Governed Autonomy (No Self-Authored Charter) | An actor's charter, envelope, and authority are always granted by a human/Board authority; no actor may author, widen, or renew its own charter. |
| **AUP-2** | Bounded Agency (Envelope) | Every actor operates strictly inside a declared authority envelope (scope, budget, rate, classification, target allowlist). Outside the envelope = deny. |
| **AUP-3** | Deny-by-Default | Every goal, decision, execution, and delegation is denied unless an explicit Autonomous Policy allows it and all Autonomous Constraints pass. |
| **AUP-4** | Human/Board Sovereignty & Override | Humans/the Board may pause, override, revoke, or halt any actor at any time; autonomy never overrides human authority. |
| **AUP-5** | Non-Actuation by Default (Propose-not-Act) | Autonomous execution produces **proposals**; all governed-state mutation routes through the Evolution Fabric (the sole commit path). No independent write/rollback/actuate path. |
| **AUP-6** | Determinism-by-Default + Quarantine (INV-6) | A committed autonomous decision is a deterministic function of recorded evidence. Non-deterministic intelligence contributions are advisory and deterministic-verifier-gated. |
| **AUP-7** | Mandatory Explainability | No decision without a complete rationale chain (goal → evidence → reasoning → constraints → policy → conclusion). Unexplained ⇒ reject. |
| **AUP-8** | Separation of Duties | propose ≠ authorize ≠ certify ≠ ratify ≠ execute-approve ≠ revoke. No single actor/authority holds two adjacent powers. |
| **AUP-9** | Fail-Closed & Emergency-Halt-by-Default | Any failure, ambiguity, partition, budget breach, or constraint violation stops the actor. The halted/deny-all state is the safe default. |
| **AUP-10** | Least-Authority & Monotonic Non-Escalation | Delegation may only narrow, never widen; a delegate never exceeds its delegator; delegation depth is bounded. |
| **AUP-11** | Revocability | Every actor, goal, authority, delegation, and in-flight execution is immediately and cascadingly revocable; revocation is fail-closed. |
| **AUP-12** | Auditability (S6) & No Ω∞ Self-Direction | Every autonomy event is hash-chained and tamper-evident; no self-modification, no self-authored goals, no autonomous actuation — AD-0014 preserved; no INV-14..20 enrolled/required. |

## 3. Governed constructs (AUTO-C1..AUTO-C12)

Every construct is a metadata-backed record under the reserved `autonomy:<kind>:<id>` keyspace;
single-owner; signed; lifecycle-governed; deny-by-default.

| # | Construct | Definition | Key rules |
|---|-----------|------------|-----------|
| **C1** | **Autonomous Actor** | A governed principal (extends a PI-4 Identity) bound to a charter, an authority envelope, and a lifecycle. **Never self-created.** | Created only by an Autonomous Authority act (AD-0009 approval); has exactly one accountable human/Board owner; inert until authorized; suspendable/haltable/revocable. |
| **C2** | **Autonomous Goal** | A bounded, declarative objective assigned to an actor, tracing to a human/Board-authorized charter and confined to the actor's envelope. | No self-authored goals; sub-goals must be a strict refinement within the parent envelope (AUP-1/AUP-2); classification-inherited; expirable. |
| **C3** | **Autonomous Policy** | The deny-by-default rule-set (evaluated by the PI-4 Policy Evaluator) governing what an actor may pursue, decide, delegate, and execute. | Foreign policy may only deny (local sovereignty); precedence deny-overrides-allow; no policy may weaken S1/S3/S4. |
| **C4** | **Autonomous Constraint** | Hard, fail-closed bounds on every action: budget, rate, time-box, target allowlist, depth, classification ceiling, and non-waivable S1/S3/S4. | A referenced-but-absent constraint surface ⇒ **reject (deny)**, never skip; constraints are monotonic (a delegate inherits ≥ the delegator's constraints). |
| **C5** | **Autonomous Authority** | An enumerated, signed, revocable set of powers (`propose\|decide\|delegate\|execute-request\|revoke\|halt`) grantable to actors. **No commit/actuate power** beyond proposal. | Enumerated powers only (no implicit); SoD; revocable; never grants identity/trust/permission outside its scope. |
| **C6** | **Autonomous Delegation** | A bounded, clamped, time-boxed, revocable transfer of a **subset** of an authority from delegator→delegate. | Monotonic non-escalation (AUP-10); depth-bounded (≤ configured max); acyclic (no delegation loops, A3); auto-expires; cascades on revoke. |
| **C7** | **Autonomous Decision** | A policy-evaluated, rationale-complete, reproducible determination to pursue/act, with `resultHash` for reproducibility. | Requires passing PEP + all constraints; deterministic-verifier-gated if it consumed non-deterministic intelligence (AUP-6); no rationale ⇒ reject (A9). |
| **C8** | **Autonomous Execution** | The bounded effecting of a decision: Simulation dry-run → **proposal to the Evolution Fabric** → Control-Plane-gated → Approval-Required for high-impact acts (AD-0009). | Non-actuation by default; sandbox-confined side-effects; Evolution Fabric is the sole commit path; no independent rollback (A6/A7). |
| **C9** | **Autonomous Revocation** | An immediate, signed withdrawal of an actor/goal/authority/delegation/in-flight execution. | Cascading; fail-closed; a revoked construct is inert instantly (no zombie actor, A11); revocation events are immutable-audited. |
| **C10** | **Autonomous Emergency Halt** | A global or scoped fail-closed kill-switch that instantly suspends all (or scoped) autonomous execution to deny-all. | Human/Board-triggerable **and** auto-triggered on any invariant/constraint/partition breach; cannot be disabled by an actor (A10); halted = safe default; resume requires a distinct authority (SoD). |
| **C11** | **Autonomy Charter** (supporting) | The human/Board-authored envelope binding an actor to its mission, scope, budget, and expiry. | Immutable except by a governed Evolution-Fabric change + approval; source of all AUP-1 authority. |
| **C12** | **Autonomy Federation Authority** (supporting) | The authority governing advisory cross-node autonomous coordination. | Foreign actors/goals are advisory-only, clamped, deny-only, local-shadows-foreign (AUTO-FED-001). |

## 4. Lifecycles

- **Actor:** `draft → authorized → active → (suspended ↔ active) → halted → revoked → retired`.
  Inert in every state except `active`; `halted`/`revoked` are terminal-safe.
- **Goal:** `proposed → authorized → active → (blocked) → achieved|expired|revoked`.
- **Authority/Delegation:** `granted → active → (suspended) → expired|revoked` (auto-expiry mandatory).
- **Decision:** `formed → evaluated → (denied|approved) → proposed(→Evolution) → committed|rejected`.
- **Execution:** `planned → simulated(dry-run) → proposed → approved(AD-0009) → committed(via Evolution) → audited`.

All durable lifecycle transitions that mutate governed state route through the **Evolution Fabric**
(migration-only, IP-14; backward-compat, IP-15); no bypass.

## 5. Decision-rights matrix (D1..D10)

| Decision class | Proposer | Authorizer | Certifier | Executor-approver | Revoker |
|----------------|----------|-----------|-----------|-------------------|---------|
| D1 Create actor | Actor authority | Human/Board | Autonomy cert authority | — | Revocation authority |
| D2 Author charter/envelope | Human/Board | Human/Board | — | — | Human/Board |
| D3 Assign goal | Actor / authority | Human/Board (within envelope) | — | — | Revocation authority |
| D4 Grant authority | Authority holder | Human/Board | Cert authority | — | Revocation authority |
| D5 Delegate | Delegator actor | Policy (auto, clamped) | — | — | Delegator / revocation |
| D6 Form decision | Actor | Policy Evaluator (PEP) | — | — | — |
| D7 Execute (governed change) | Actor | PEP + constraints | — | Human/Board (AD-0009) | Emergency halt |
| D8 Federate (admit foreign) | Fed authority | Human/Board | — | — | Revocation authority |
| D9 Revoke | Revocation authority | Board (for actor/authority) | — | — | — |
| D10 Emergency halt | Any human/Board / auto-trigger | (none needed to halt) | — | Distinct resume authority | — |

Adjacent powers are never co-held (AUP-8). Halting requires no approval; resuming does.

## 6. Reuse (no re-implementation)

| Reused fabric | Autonomy use |
|---------------|--------------|
| PI-4 Control Plane / Policy Evaluator | Deny-by-default evaluation of every decision/execution (PEP). |
| PI-6 Evolution Fabric | **Sole** commit path for any governed-state mutation an actor proposes. |
| PI-5 Federation | Advisory-only cross-node coordination; reuse Ed25519 assertions + FederatedAuditLog. |
| PI-7 Knowledge | Governed evidence reads for decisions (S4-classified). |
| PI-11 Simulation | Mandatory sandbox dry-run of a plan before it becomes a proposal. |
| PI-10 Intelligence (design) | Advisory, verifier-gated reasoning/planning input — **FDG-INT** deferred gate. |
| PI-9 Memory (design) | Actor state/history reads — **FDG-MEM** deferred gate. |
| PI-8 Ontology (design) | Semantic typing/validation of goals/constraints — **FDG-ONT** deferred gate. |

## 7. Governance rules

- Single accountable owner per construct; enumerated authorities; SoD non-waivable.
- All governed mutation via the Evolution Fabric; no independent write/rollback path.
- Deny-by-default; fail-closed; emergency-halt-by-default; local sovereignty over federation.
- Non-waivable **S1/S3/S4** preserved (AUTO-SEC-001); no autonomy construct may weaken them.
- **No self-authored goals, no self-modification, no un-gated actuation** — governor-enforced.
- Concrete autonomy acts (create actor, author charter, grant authority, admit federation, approve a
  high-impact execution) are **Approval-Required Operations** (AD-0009).

## 8. Coverage of mandated concepts (10/10)

Autonomous Actor (C1) · Goal (C2) · Policy (C3) · Constraint (C4) · Authority (C5) · Delegation (C6)
· Decision (C7) · Execution (C8) · Revocation (C9) · Emergency Halt (C10) — all defined, with two
supporting constructs (Charter C11, Federation Authority C12).

## 9. Traceability
- **Refines:** AD-0016..0022, AD-0014, AUTH-003/008/009/012, UCOS-CONST-001 (Art. IX/XII), UCOS-SEC-ARCH-001, EVO-GOVERNOR-001, SIM-ARCH-001, INT-GOV-001.
- **Refined by:** AUTO-ARCH/SEC/FED/AUD/THREAT/READINESS-001.
- **Owner:** UCOS Authority Board (custodian: Platform Governance, CAP-15).

**END AUTO-GOV-001 — DESIGN — READY FOR RATIFICATION.**
