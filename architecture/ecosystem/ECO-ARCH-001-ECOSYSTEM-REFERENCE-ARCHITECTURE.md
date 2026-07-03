# ECO-ARCH-001 — UCOS Ecosystem Reference Architecture Specification

| Field | Value |
|-------|-------|
| Artifact | **ECO-ARCH-001 — Ecosystem Reference Architecture** |
| Workstream | FND-ECO-01 (PHASE 27 · PI-16 Ecosystem Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, services, or model weights |
| Basis | `ECO-GOV-001`; `AD-0016` (substrate), `AD-0017` (control), `AD-0018` (federation), `AD-0019` (evolution), `AD-0020` (knowledge); design-phase `ONTO-*` (PI-8), `MEM-*` (PI-9), `INT-*` (PI-10), `SIM-*` (PI-11); `UCOS-PEA-001..007`; `UCOS-SEC-ARCH-001`; `AD-0014` |
| Realizes | Ecosystem Entity/Relationship/Dependency graph; Health Assessor; Resilience Analyzer; Evolution Router; Federated Ecosystem Guard; Unknown-Future Admission |
| Prospective location (design-time only) | `packages/platform-runtime/src/control/ecosystem/*` (NOT created; PI-16 authorization required) |
| Prohibited-dir impact | **NONE** — additive over PI-4..PI-11; public seams only; zero change to `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts` |

> The Ecosystem Fabric is a **governed modeling & assessment layer** composed additively on the ratified and
> design-phase fabrics. It **represents and assesses**; it never autonomously actuates any modeled ecosystem.
> Every durable model change routes through the Evolution Fabric; every meaning is grounded in the Ontology
> Fabric; every fact is read from the Knowledge Fabric; every recall is read-only from the Memory Fabric;
> reasoning and scenario/impact evidence are consumed **advisory-only** from the Intelligence and Simulation
> fabrics; every proposal is policy-evaluated by the PI-4 Control Plane before commit. This architecture is
> **not** the Ω∞ existential system (AD-0014 stands).

---

## 1. Architectural Position (layered atop the ratified + design-phase stack)

```
                 ┌───────────────────────────────────────────────────────┐
   PI-16 (this)  │            ECOSYSTEM FABRIC (governed)                  │  model + assess + propose-only
                 │  Entity · Relationship · Dependency graph               │
                 │  Health Assessor · Resilience Analyzer · Fed Guard      │
                 └──┬───────┬───────┬───────┬───────┬───────┬──────────────┘
                    │ ground │ read  │ recall│advisory│advisory│ mutate/commit
              ┌─────▼──┐ ┌───▼───┐ ┌─▼────┐ ┌▼──────┐ ┌▼──────┐ ┌────────────┐
   PI-8..11   │ONTOLOGY│ │KNOWLE-│ │MEMORY│ │INTELL-│ │SIMULA-│ │ EVOLUTION  │
              │(meaning)│ │DGE    │ │recall│ │IGENCE │ │TION   │ │ (commit)   │
              └─────┬──┘ └───┬───┘ └─┬────┘ └┬──────┘ └┬──────┘ └─────┬──────┘
              ┌─────▼────────▼────────▼───────▼─────────▼──────────────▼──────┐
   PI-5       │                 FEDERATION (advisory, cross-node)              │
              └───────────────────────────────┬───────────────────────────────┘
              ┌───────────────────────────────▼───────────────────────────────┐
   PI-4       │  CONTROL FABRICS (PEP: identity/trust/policy/governance + audit) │
              └───────────────────────────────┬───────────────────────────────┘
              ┌───────────────────────────────▼───────────────────────────────┐
   PI-2/3     │  SUBSTRATE: Meta-Core · Registry · Metadata · Configuration      │
              └────────────────────────────────────────────────────────────────┘
```

**Rule of composition:** the Ecosystem Fabric only calls **downward** through public seams. It never modifies a
lower fabric's behavior and holds no independent write path to governed state. Intelligence (PI-10) and
Simulation (PI-11) are consumed as **advisory evidence sources**, never as authorities.

## 2. Core Subsystems

### 2.1 Ecosystem Graph Assembler (deterministic projection)
- **Role.** Resolves all `active` Ecosystem Entities (`ECO-C1`), Relationships (`ECO-C2`), and Dependencies
  (`ECO-C3`) in a scope (plus imported scopes) into a typed, directed **ecosystem graph** — a *projection*, not
  a stored mutable object (mirrors `ONTO-C4`).
- **Determinism.** Pure and reproducible from the audited `active` record set over a pinned ontology snapshot;
  an unresolvable/expired/revoked referent is **excluded fail-closed** (never silently substituted).
- **Grounding.** Every node/edge type resolves to an `active` ontology type (EGP-5); an ungrounded type is
  rejected.

### 2.2 Health Assessor (deterministic, read-only)
- **Role.** Computes an Ecosystem Health record (`ECO-C4`) as a deterministic function of `(ecosystem graph,
  attested Signal Sources, pinned knowledge/memory snapshots, assessment ruleset, budgets)`.
- **Invariant.** Every metric traces to ≥1 attested Signal Source (`ECO-C12`); no side effects except audit;
  a verdict is an **assessment**, never an actuation (EGP-1/EGP-6). Budget exhaustion fails closed.

### 2.3 Resilience Analyzer (deterministic core + advisory evidence)
- **Role.** Computes an Ecosystem Resilience record (`ECO-C5`) over the dependency graph: failure-domain
  isolation, single-point-of-failure and monoculture exposure (closes ECO12), redundancy, degradation
  tolerance, and recovery paths.
- **Advisory evidence.** May consume **Simulation** impact/scenario analysis (PI-11) and **Intelligence**
  reasoning (PI-10) as recorded *evidence* (reference + provenance), never as an authority; the resilience
  score remains a deterministic function of recorded inputs.
- **Invariant.** Recovery/remediation is emitted as a **proposal** only, routed via §2.4.

### 2.4 Evolution Router (propose-only; non-committing)
- **Role.** Turns a ratified assessment/intervention into a candidate change, drives it through the governed
  pipeline (ground → policy → SoD certify → ratify), then hands a ratified change to the **Evolution Fabric**
  (PI-6) for the actual commit. The router itself **never writes** governed state (EGP-3/EGP-4).

### 2.5 Federated Ecosystem Guard (advisory, clamped)
- **Role.** Verifies, clamps, and namespace-isolates foreign ecosystem contributions (entities/relationships/
  assessments) so they enter local assessment as **advisory** evidence requiring local ratification to take
  effect (ECO-FED-001). Fail-closed on partition.

## 3. Supporting Subsystems (reuse — no re-implementation)

| Subsystem | Responsibility | Realized via (reuse) |
|-----------|----------------|----------------------|
| **Ontology Grounding** | Resolve meaning of entity/relationship/dependency kinds (EGP-5) | **PI-8 Ontology** read/resolve (`ONTO-C4`); Classification Binding (`ECO-C10`); snapshot-pinned |
| **Knowledge Utilization** | Read facts/evidence backing entities & signals | **PI-7 Knowledge Fabric** query/resolve, S4-honored |
| **Memory Utilization** | Read-only recall of historical ecosystem state/incidents | **PI-9 Memory Fabric** recall (read-only, snapshot-pinned) |
| **Intelligence Advisory** | Advisory reasoning over ecosystem posture | **PI-10 Intelligence** (advisory-only; local-terminal) |
| **Simulation Advisory** | Scenario/impact/predictive evidence for resilience | **PI-11 Simulation** (advisory-only; sandboxed) |
| **Policy Evaluation** | Pre-commit deny-by-default evaluation of every proposal | **PI-4 policy evaluator (unchanged)** |
| **Federated Ecosystem** | Accept foreign advisory ecosystem contributions | **PI-5 Federation** (clamped/advisory; ECO-FED-001) |
| **Explainability / Audit** | Signed hash-chained rationales for verdicts & proposals | Reuse `FederatedAuditLog` pattern (ECO-AUD-001) |

## 4. Health & Resilience Projection Architecture (read-only, reproducible)

```
 active records ─▶ [Graph Assembler] ─▶ ecosystem graph (pinned) ─┐
 attested signals (ECO-C12) ──────────────────────────────────────┤
 pinned knowledge/memory snapshots ───────────────────────────────┼─▶ [Deterministic Health/Resilience core]
 advisory evidence (Sim impact / Intel reasoning, referenced) ─────┘            │
                                                                                ▼
                                                    Health/Resilience verdict + rationale (signed, hash-chained)
                                                                                │  propose-only
                                                                                ▼
                                             [Evolution Router] ─▶ policy → SoD certify → ratify → PI-6 commit
```

- Health/Resilience verdicts are **deterministic functions of recorded inputs** over pinned snapshots —
  reproducible-by-record (a divergent re-run is a detectable integrity event; surfaces ECO5).
- Advisory Simulation/Intelligence contributions are recorded as referenced evidence with provenance; they
  **cannot** be the sole basis of a committed intervention without deterministic grounding + policy + SoD.
- No projection path reaches `committed` state except through the Evolution Router → PI-6 (EGP-4).

## 5. Prospective Module Map (design-time only — NOT created)

If (and only if) a future Authority Board act (analogous to AD-0018/0019/0020) authorizes PI-16, the fabric
would live under `packages/platform-runtime/src/control/ecosystem/*`, additive and public-seam-only:

| Module (prospective) | Purpose |
|----------------------|---------|
| `types.ts` | Ecosystem record/types (entity, relationship, dependency, health, resilience, signal, authorities) |
| `ecosystem-authority.ts` | Ecosystem-authority registry (metadata-backed, enumerated powers) |
| `entity-registry.ts` | Entity registration/classification (ontology-grounded) |
| `relationship-registry.ts` / `dependency-registry.ts` | Typed relationships + dependencies |
| `graph-assembler.ts` | Deterministic ecosystem-graph projection |
| `health-assessor.ts` | Deterministic health assessment (read-only) |
| `resilience-analyzer.ts` | Deterministic resilience analysis (+ advisory Sim/Intel evidence) |
| `signal-source.ts` | Attested signal admission (provenance, classification, expiry) |
| `evolution-router.ts` | Propose→policy→certify→ratify; hands ratified change to Evolution |
| `ontology-access.ts` | Read-only Ontology client (`ONTO-C4` resolve; S4-aware; snapshot-pinned) |
| `knowledge-access.ts` / `memory-access.ts` | Read-only Knowledge query + Memory recall clients |
| `intelligence-advisory.ts` / `simulation-advisory.ts` | Advisory evidence clients (read-only, referenced) |
| `federated-ecosystem.ts` | Advisory foreign-contribution guard (clamped) |
| `unknown-future-admission.ts` | Governed admission protocol (`ECO-C13`; amendment-gated) |
| `ecosystem-audit-log.ts` | Hash-chained ECO_* audit (reuse pattern) |
| `ecosystem-control.ts` | Assembly; the sole governed mutation path (via Evolution Fabric) |
| `index.ts` | Public surface (single additive re-export in `src/control/index.ts`) |

**Test obligation (prospective):** all existing tests (substrate/control/federation/evolution/knowledge
baseline, plus any ratified ontology/memory/intelligence/simulation suites) must remain green; new tests cover
lifecycles, ontology-grounding fail-closed, graph projection determinism/reproducibility, health/resilience
scoring, SoD, the commit pipeline, federated advisory guard, audit, and the ECO1–ECO15 adversarial suite.

## 6. Reuse Map (no re-implementation)

| Need | Reused ratified/design component | New in Ecosystem Fabric? |
|------|----------------------------------|:------------------------:|
| Authn/authz of principals | PI-4 Identity/Trust/Policy (PEP) | No |
| Deny-by-default policy | PI-4 policy evaluator | No |
| Governed mutation/commit | PI-6 Evolution Fabric | No (drives it) |
| Cross-node contributions | PI-5 Federation (assertions, trust clamp, audit) | No (advisory guard only) |
| Semantic grounding (meaning) | PI-8 Ontology Fabric (`ONTO-C4` read/resolve) | No (read client) |
| Facts/evidence reads | PI-7 Knowledge Fabric | No (read client) |
| Historical recall / provenance | PI-9 Memory Fabric (read-only recall) | No (read client) |
| Advisory reasoning | PI-10 Intelligence Fabric | No (advisory client) |
| Scenario/impact/predictive evidence | PI-11 Simulation Fabric | No (advisory client) |
| Signatures/crypto | Federation `assertions.ts` (Ed25519) | No custom crypto |
| Audit chain | `FederatedAuditLog` pattern | Thin ECO_* wrapper |
| Records/metadata/config | PI-2/3 substrate ports | No (public seams) |

## 7. Traceability
- **Refines:** `ECO-GOV-001`, `AD-0016..0020`, `AD-0014`, `ONTO-*`, `MEM-*`, `INT-*`, `SIM-*`,
  `UCOS-PEA-001..007`, `UCOS-SEC-ARCH-001`, AUTH-003 (IP-04/06/14), AUTH-008/009/012, Constitution Art. IX/XII.
- **Consumed by:** `ECO-SEC-001`, `ECO-FED-001`, `ECO-AUD-001`, `ECO-THREAT-001`, `ECO-READINESS-001`, and a
  future PI-16 implementation act.
- **Owner:** UCOS Authority Board.

**END ECO-ARCH-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED · Ω∞ BOUNDARY (AD-0014) PRESERVED.**
