# INT-ARCH-001 — UCOS Intelligence Reference Architecture Specification

| Field | Value |
|-------|-------|
| Artifact | **INT-ARCH-001 — Intelligence Reference Architecture** |
| Workstream | FND-INT-01 (PHASE 19 · PI-10 Intelligence Fabric Foundations) |
| Version | 1.1.0 |
| Status | **DESIGN — READY FOR RE-RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, services, or model weights |
| Remediation (v1.1.0) | Incorporates **PHASE 19.2** deltas (`INT-REM-001` F-2, `INT-REM-002` F-4, `INT-REM-003` closure): engines are **ontology-relative** over `ONTO-C4`; a **Semantic-Constraint Verifier** joins the determinism quarantine; **Memory Utilization** is **read-only recall from PI-9** (competing store removed); module map adds `ontology-access.ts` and renames `memory-store.ts → memory-access.ts`. |
| Basis | `INT-GOV-001`, `INT-GOV-002`; `AD-0016` (substrate), `AD-0017` (control), `AD-0018` (federation), `AD-0019` (evolution), `AD-0020` (knowledge); `ONTO-*` (PI-8), `MEM-*` (PI-9); `UCOS-PEA-001..007`; `UCOS-SEC-ARCH-001`; `INT-REM-001/002/003` |
| Realizes | Reasoning · Inference · Planning · Decision engines; Goal Management; Policy Evaluation; Constraint Solving; Knowledge Utilization; Memory Utilization; Federated Intelligence |
| Prospective location (design-time only) | `packages/platform-runtime/src/control/intelligence/*` (NOT created; PI-10 authorization required) |
| Prohibited-dir impact | **NONE** — additive over PI-4/5/6/7; public seams only; zero change to `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts` |

> The Intelligence Fabric is a **governed cognition layer** composed additively on the ratified fabrics. It
> **proposes**; it never autonomously actuates. Every mutation of governed state routes through the Evolution
> Fabric; every knowledge read routes through the Knowledge Fabric; every cross-node contribution routes through
> the Federation Fabric; every proposal is policy-evaluated by the PI-4 Control Plane before commit. This
> architecture is **not** the Ω∞ existential intelligence (AD-0014 stands).

---

## 1. Architectural Position (layered atop the ratified stack)

```
                 ┌─────────────────────────────────────────────┐
   PI-10 (this)  │        INTELLIGENCE FABRIC (governed)         │  propose-only
                 │  Reasoning · Inference(quarantined) · Planning │
                 │  Decision · Goal Mgmt · Constraint Solving     │
                 └───────┬───────────────┬───────────────┬───────┘
                         │ read           │ mutate        │ cross-node
                 ┌───────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
   PI-7/6/5      │ KNOWLEDGE    │  │ EVOLUTION   │  │ FEDERATION  │
                 │ (query/read) │  │ (commit)    │  │ (advisory)  │
                 └───────┬──────┘  └──────┬──────┘  └──────┬──────┘
                 ┌───────▼─────────────────▼────────────────▼───────┐
   PI-4          │        CONTROL FABRICS (PEP: identity/trust/      │
                 │        policy/governance + immutable audit)       │
                 └───────────────────────┬──────────────────────────┘
                 ┌───────────────────────▼──────────────────────────┐
   PI-2/3        │  SUBSTRATE: Meta-Core · Registry · Metadata · Config │
                 └──────────────────────────────────────────────────┘
```

**Rule of composition:** the Intelligence Fabric only calls **downward** through public seams. It never
modifies a lower fabric's behavior and holds no independent write path to governed state.

## 2. The Four Engines

### 2.1 Reasoning Engine (deterministic orchestrator)
- **Role.** Orchestrates a bounded Reasoning Session: gather **grounded evidence** (Knowledge + PI-9 memory
  recall reads, each grounded to an `active` ontology entity per IGP-9) → invoke Inference/Planning/Constraint
  solving over the pinned Ontology Graph (`ONTO-C4`) → assemble a **Proposal + rationale**.
- **Determinism.** Fully deterministic given `(session inputs, knowledge snapshot, ontology snapshot, memory
  snapshot, policy set, constraint set, seed)`. Every step is audited. No side effects except audit and
  ephemeral working context (no local memory store; IGP-10).
- **Bounded.** Enforces IGP-5 budgets (depth/steps/wall/resource); fail-closed on exhaustion. A session cannot
  open without a resolvable Ontology Grounding Binding (`INT-GOV-C13`).

### 2.2 Inference Engine (deterministic core + quarantined adapters)
- **Deterministic inference** (rules, logic, symbolic derivation, deterministic scoring) is **ontology-relative**
  — it derives only relationships admissible under `active` `ONTO-C6/C7` and is checked against Semantic
  Constraints (`ONTO-C8`) — and is on the commit path.
- **Non-deterministic inference** (probabilistic/model-based, incl. external LLM/ML) is confined to a declared
  **Inference Adapter** (INT-GOV-001 §2.2): typed non-deterministic, recorded with `(modelRef, seed, inputsHash,
  outputClassification)`, **advisory-only**, and never the sole basis of a commit without **both** a
  deterministic verifier/guard **and** a Semantic-Constraint Verifier confirming ontology validity. This is the
  **Determinism Quarantine** (INV-6; §4).

### 2.3 Planning Engine (deterministic)
- **Role.** Produces plans toward an `active` Goal, subject to a Constraint Set whose terms are resolved to
  `active` ontology types (typed constraints; closes T-F3) and over memory state recalled read-only from PI-9.
  Emits `feasible|infeasible`.
- **Invariant.** An `infeasible` plan (hard-constraint or `block`-severity Semantic-Constraint violation) can
  never be proposed as a decision.

### 2.4 Decision Engine (deterministic gate, non-committing)
- **Role.** Turns a feasible plan/proposal into a candidate Decision, drives it through the governed pipeline
  (policy → constraints → certify → ratify), then hands a ratified Decision to the **Evolution Fabric** for the
  actual commit. The Decision Engine itself **never writes** governed state.

## 3. Supporting Subsystems

| Subsystem | Responsibility | Realized via (reuse) |
|-----------|----------------|----------------------|
| **Goal Management** | Register/authorize/track goals + lifecycles (INT-GOV-002 §1.1) | Metadata records; PI-4 governance/approval; Goal Authority |
| **Policy Evaluation** | Pre-commit deny-by-default evaluation of every proposal | **PI-4 policy evaluator (unchanged)** via Policy Evaluation Binding |
| **Constraint Solving** | Deterministic satisfaction of hard/soft constraints | Intelligence Fabric solver over Constraint Set records |
| **Ontology Grounding** | Resolve meaning of goals/evidence/constraints/conclusions (IGP-9) | **PI-8 Ontology Fabric** read/resolve (`ONTO-C4`); Ontology Grounding Binding (`INT-GOV-C13`); snapshot-pinned |
| **Knowledge Utilization** | Read evidence for reasoning | **Knowledge Fabric query/resolve** (PI-7), S4-classification honored |
| **Memory Utilization** | Read-only recall of WM/STM/LTM/SEM/EPI/FED memory (IGP-10) | **PI-9 Memory Fabric recall** (read-only, snapshot-pinned, `MGP-2/3/7`); durable memory **proposed** via Evolution (`MGP-4`); **no local store** |
| **Federated Intelligence** | Accept foreign advisory contributions/decisions | **Federation Fabric** (PI-5), clamped/advisory (INT-FED-001) |
| **Explainability / Audit** | Emit signed hash-chained rationales + decision provenance | Reuse `FederatedAuditLog` pattern (INT-AUD-001) |

## 4. Determinism Quarantine (architecture of INV-6 compliance)

```
 evidence ─▶ [Deterministic Reasoning/Planning/Constraint core] ─▶ candidate decision ─▶ commit path
                        ▲ advisory only
                        │
        ┌───────────────┴───────────────┐
        │  Inference Adapter (declared    │   records: modelRef, seed, inputsHash,
        │  NON-DETERMINISTIC, sandboxed)  │            outputClassification, rationaleFragment
        └───────────────┬───────────────┘
                        ▼
        [Deterministic Verifier/Guard] ── must independently confirm the adapter's
                                          contribution against deterministic rules/constraints
                                          before it may influence a committed decision
```

- Non-deterministic output **cannot** reach `committed` state without deterministic verifier attestation.
- Non-deterministic output additionally **cannot** influence a committed decision unless a **Semantic-Constraint
  Verifier** independently confirms its asserted entities/relationships are `active`-ontology-valid (`ONTO-C8`);
  a fragment referencing an unresolved/deny type is dropped fail-closed (IGP-9; `INT-REM-001` §5).
- Every adapter invocation is reproducible-by-record (inputs hash + model ref + seed) even when the model itself
  is external and stochastic; the *decision* remains a deterministic function of recorded evidence, **pinned
  ontology, and pinned memory**.

## 5. Prospective Module Map (design-time only — NOT created)

If (and only if) a future Authority Board act (analogous to AD-0018/0019/0020) authorizes PI-10, the fabric
would live under `packages/platform-runtime/src/control/intelligence/*`, additive and public-seam-only:

| Module (prospective) | Purpose |
|----------------------|---------|
| `types.ts` | Intelligence record/types (reasoning authority, goal, model, decision, session, memory **view**, ontology grounding binding) |
| `reasoning-authority.ts` | Reasoning-authority registry (metadata-backed, enumerated powers) |
| `inference-model-registry.ts` | Model registry; determinism class; verifier binding |
| `goal-registry.ts` / `goal-authority.ts` | Goal Management + Goal Authority |
| `reasoning-engine.ts` | Bounded session orchestration |
| `inference-engine.ts` + `inference-adapter.ts` | Deterministic inference + quarantined adapter boundary |
| `planning-engine.ts` | Deterministic planner |
| `constraint-solver.ts` | Hard/soft constraint satisfaction |
| `decision-engine.ts` | Certify→ratify gate; hands ratified decisions to Evolution |
| `policy-binding.ts` | Adapter to the PI-4 policy evaluator (no new engine) |
| `knowledge-access.ts` | Read-only Knowledge Fabric client (S4-aware) |
| `ontology-access.ts` | Read-only Ontology Fabric client (`ONTO-C4` resolve; S4-aware; snapshot-pinned; IGP-9) |
| `memory-access.ts` | Read-only PI-9 Memory Fabric recall client (snapshot-pinned; `MGP-2/3/7`); **no store** (IGP-10) |
| `federated-intelligence.ts` | Advisory foreign-contribution guard (clamped) |
| `intelligence-audit-log.ts` | Hash-chained INT_* audit (reuse pattern) |
| `intelligence-control.ts` | Assembly; the sole governed mutation path (via Evolution Fabric) |
| `index.ts` | Public surface (single additive re-export in `src/control/index.ts`) |

**Test obligation (prospective):** all existing tests (federation/evolution/knowledge baseline) must remain
green; new tests cover lifecycles, determinism quarantine, SoD, the commit pipeline, federated advisory guard,
audit, and the I1–I12 adversarial suite.

## 6. Reuse Map (no re-implementation)

| Need | Reused ratified component | New in Intelligence Fabric? |
|------|---------------------------|:---------------------------:|
| Authn/authz of principals | PI-4 Identity/Trust/Policy (PEP) | No |
| Deny-by-default policy | PI-4 policy evaluator | No |
| Governed mutation/commit | PI-6 Evolution Fabric | No (drives it) |
| Cross-node contributions | PI-5 Federation (assertions, trust clamp, audit) | No (advisory guard only) |
| Evidence/knowledge reads | PI-7 Knowledge Fabric | No (read client) |
| Semantic grounding (meaning) | PI-8 Ontology Fabric (`ONTO-C4` read/resolve) | No (read client; IGP-9) |
| Memory recall / provenance | PI-9 Memory Fabric (read-only recall; durable via PI-6) | No (read client; IGP-10) |
| Signatures/crypto | Federation `assertions.ts` (Ed25519) | No custom crypto |
| Audit chain | `FederatedAuditLog` pattern | Thin INT_* wrapper |
| Records/metadata/config | PI-2/3 substrate ports | No (public seams) |

## 7. Traceability
- **Refines:** `INT-GOV-001/002`, `AD-0016..0020`, `AD-0014`, `UCOS-PEA-001..007`, `UCOS-SEC-ARCH-001`,
  AUTH-003 (IP-04/06/14), AUTH-008/009/012, Constitution Art. IX/XII, `ONTO-*` (PI-8), `MEM-*` (PI-9),
  `INT-REM-001/002/003` (v1.1.0 remediation).
- **Consumed by:** `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001`, `INT-THREAT-001`, `INT-READINESS-001`, the
  PHASE 19.3 PI-10 re-authorization review, and a future PI-10 implementation act.
- **Owner:** UCOS Authority Board.

**END INT-ARCH-001 v1.1.0 — DESIGN · F-2/F-4 REMEDIATED · ONTOLOGY-GROUNDED · MEMORY READ-ONLY VIA PI-9 · READY FOR RE-RATIFICATION · NO IMPLEMENTATION AUTHORIZED · ARTICLE IX ACTIVE.**
