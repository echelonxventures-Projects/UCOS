# AUTO-ARCH-001 — Autonomy Reference Architecture

| Field | Value |
|-------|-------|
| Artifact ID | `AUTO-ARCH-001` |
| Layer | ARCH (Autonomy) |
| Phase | PHASE 23 · PI-12 Autonomy Fabric (Design) |
| Status | **DESIGN — READY FOR RATIFICATION v1.0.0** (no implementation) |
| Refines | AUTO-GOV-001, AD-0016..0022, AD-0014, UCOS-PEA-001..007, UCOS-SEC-ARCH-001 |
| Refined by | AUTO-SEC-001, AUTO-FED-001, AUTO-AUD-001, AUTO-THREAT-001, AUTO-READINESS-001 |

> Design only. Zero source code. All prospective work confined to `src/control/autonomy/*`; no
> modification of any substrate core dir or of federation/evolution/knowledge/control behavior.

---

## 1. Architectural stance

The Autonomy Fabric is a **propose-not-act** control-layer subsystem. It composes already-ratified
fabrics into a closed governance loop and adds **no** independent commit, rollback, or actuation path.
The load-bearing safety guarantee is structural: **the only way an autonomous actor changes governed
state is by emitting a proposal that the Evolution Fabric commits after Control-Plane policy
evaluation and (for high-impact acts) human/Board approval.** A compromised or malfunctioning actor's
maximum blast radius is therefore *rejected proposals + audit noise*, never autonomous action.

## 2. Component composition

| Component | Responsibility | Reuses |
|-----------|----------------|--------|
| **Actor Manager** | Actor lifecycle, charter binding, envelope enforcement | PI-4 Identity |
| **Goal Engine** | Goal decomposition within envelope; sub-goal refinement checks (AUP-1/2) | PI-8 Ontology (FDG-ONT), PI-7 Knowledge |
| **Planning Adapter** | Turns a goal into a candidate plan (advisory) | PI-10 Intelligence (FDG-INT), quarantined |
| **Decision Engine** | Forms rationale-complete decisions; deterministic-verifier gate (INV-6) | PI-4 Policy Evaluator |
| **Constraint Evaluator** | Fail-closed budget/rate/time/scope/classification/depth checks | AUTO-GOV-001 C4 |
| **Delegation Manager** | Clamped, acyclic, depth-bounded, expiring delegation | AUTO-GOV-001 C6 |
| **Execution Orchestrator** | Simulation dry-run → Evolution proposal → PEP-gate → AD-0009 approval | PI-11 Simulation, PI-6 Evolution, PI-4 Control Plane |
| **Revocation Authority** | Cascading, fail-closed revocation | PI-5 assertions |
| **Emergency Halt Controller** | Global/scoped instant deny-all kill-switch | — (non-bypassable) |
| **Federation Guard** | Advisory-only, clamped, local-sovereign coordination | PI-5 Federation |
| **Autonomy Audit Sink** | Hash-chained AUTO_* events + rationale chain | PI-5 FederatedAuditLog, PI-4 AuditSink |

## 3. The governed autonomy loop (execution pattern)

```
Charter (human/Board)            ← AUP-1 sole source of authority
   │
   ▼
Goal (bounded, envelope-checked) ─ Goal Engine
   │
   ▼
Plan (advisory)                  ─ Planning Adapter  [INT quarantined, verifier-gated]
   │
   ▼
Simulation dry-run (sandbox)     ─ PI-11 Simulation   [no governed effect]
   │
   ▼
Decision (rationale-complete)    ─ Decision Engine    [INV-6 determinism verified]
   │
   ├── Control Plane / Policy Evaluator (deny-by-default)  ── deny ─► reject + audit
   │
   ├── Constraint Evaluator (budget/rate/scope/class/depth) ── fail ─► halt + audit
   │
   ▼
Proposal ──► PI-6 Evolution Fabric (sole commit path)
   │
   ├── High-impact? ─► AD-0009 human/Board approval (Approval-Required)
   │
   ▼
Commit (migration-only) + hash-chained audit + rationale chain
```

Any failure at any stage is **fail-closed**: the actor stops, no state changes, and the event is
audited. The Emergency Halt Controller can short-circuit the entire loop to deny-all instantly.

## 4. Determinism quarantine (INV-6)

Planning/reasoning inputs from the Intelligence Fabric are **advisory forecasts**, never facts. A
decision that consumed a non-deterministic contribution is **inadmissible** until a deterministic
verifier re-derives its conclusion from recorded evidence. The committed decision is a deterministic
function of that recorded evidence (`resultHash` reproducibility). This closes A8 (decision
laundering) structurally.

## 5. Prospective module map (public seams only)

```
packages/platform-runtime/src/control/autonomy/
  types.ts                       (+ additive async interfaces; no core-port change)
  actor-manager.ts
  charter-registry.ts
  goal-engine.ts
  planning-adapter.ts            (INT adapter interface; deterministic fallback)
  decision-engine.ts
  constraint-evaluator.ts
  delegation-manager.ts
  execution-orchestrator.ts      (Simulation + Evolution + Control-Plane composition)
  autonomy-authority.ts          (enumerated powers; signed; revocable)
  revocation-authority.ts
  emergency-halt.ts              (non-bypassable deny-all)
  federation-guard.ts
  autonomy-audit-log.ts          (reuse/thin-wrap FederatedAuditLog)
  bootstrap.ts / index.ts
test/  autonomy.test.ts, autonomy-adversarial.test.ts (A1–A15)
```

## 6. Zero-prohibited-core-dir-change proof

- **State:** every construct is a metadata record under `autonomy:*` via the existing `MetadataPort`.
- **Config:** envelopes/budgets/limits resolved via the existing `ConfigurationPort`.
- **Discovery:** actors/authorities registered via the existing `RegistryPort`.
- **Commit:** mutation only via the Evolution Fabric's existing `evolvableAllowlist` (`autonomy:` prefix).
- **Crypto/audit:** reuse `src/control/federation/assertions.ts` (Ed25519) and `FederatedAuditLog`.
- **Policy:** reuse the PI-4 Policy Evaluator unchanged.

No change to `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`,
`src/configuration-runtime`, `src/contracts`, or to federation/evolution/knowledge behavior. Existing
tests (the implemented PI-2..PI-7 baseline) remain the additive gate.

## 7. Traceability
- **Refines:** AUTO-GOV-001, EVO-ARCH-001, EVO-GOVERNOR-001, SIM-ARCH-001, INT-ARCH-001, KNOW-ARCH-001, UCOS-PEA-001..007.
- **Refined by:** AUTO-SEC-001, AUTO-FED-001, AUTO-AUD-001, AUTO-THREAT-001, AUTO-READINESS-001.
- **Owner:** UCOS Authority Board.

**END AUTO-ARCH-001 — DESIGN — READY FOR RATIFICATION.**
