# ARCH-GAP-001 — Universal Architecture Completeness Audit

**Phase:** UA-01 — Universal Architecture Completeness Audit
**Artifact ID:** `ARCH-GAP-001`
**Mode:** AUDIT / EVIDENCE-BASED — no source, no governance change, no ratification, no lock release
**Method:** Direct inspection of `packages/platform-runtime/src/**` + design fabrics (`architecture/**`) + governance ledger (`.claude/state/PROJECT-STATE.md`); build/test reproduction (`tsc --noEmit` exit 0; `npm test` **269/269 pass**)
**Date:** 2026-07-02

---

## 1. Objective

Determine whether **every concept in UCOS can be represented through the nine universal primitives**:

> Registry · Metadata · Configuration · Knowledge · Ontology · Memory · Authority · Federation · Evolution

by reviewing all fabrics and identifying:

- Hard-coded concepts
- Special-case logic
- Non-composable constructs
- Non-federated constructs
- Non-governed constructs
- Non-auditable constructs

---

## 2. Fabric Inventory (as-built vs governed)

| Fabric | Design | Implemented (`src/control` / substrate) | Notes |
|--------|:------:|:----------------------------------------:|-------|
| Registry | ✅ | ✅ `registry-runtime/registry.ts` (`RegistryPort`) | Universal, data-first |
| Metadata | ✅ | ✅ `metadata-runtime/*` (`MetadataPort`) | Universal keyspace store |
| Configuration | ✅ | ✅ `configuration-runtime/*` (`ConfigurationPort`) | Layered deep-merge |
| Meta-Core (kernel) | ✅ | ✅ `meta-core/*` | Composition/execution/lifecycle/validation |
| Authority (Identity/Trust/Policy/Governance) | ✅ | ✅ `control/{identity,trust,policy,governance}` | Deny-by-default; metadata-backed |
| Federation | ✅ | ✅ `control/federation/*` | Ed25519, hash-chained audit |
| Evolution | ✅ | ✅ `control/evolution/*` | Sole durable-mutation path (design) |
| Knowledge | ✅ | ✅ `control/knowledge/*` | Full fabric |
| Ontology | ✅ | ✅ `control/ontology/*` | Implemented (authority contested — see C3) |
| Memory | ✅ | ✅ `control/memory/*` | Implemented (ratification REJECTED in ledger — see C3/M5) |
| Intelligence | ✅ (design `INT-*`) | ❌ | Not representable by the 9 (see C2) |
| Simulation | ✅ (design `SIM-*`) | ❌ | Not representable by the 9 (see C2) |
| Civilization | ✅ (conceptual `CIV-*`) | ❌ | Not representable by the 9 (see C2) |

**Reproduced state:** `tsc --noEmit` clean; **269/269 tests pass** across 40 suites. This **contradicts** the authoritative ledger `PROJECT-STATE §0W` (claims 213/213 and Memory "REJECTED / NOT implemented").

---

## 3. What holds (universal representation confirmed)

- **Substrate primitives are genuinely universal.** `RegistryPort` / `MetadataPort` / `ConfigurationPort` are dependency-inverted; every concept's state is stored as descriptor/metadata records under a reserved keyspace (`knowledge:*`, `memory:*`, `ontology:*`, `evolution:*`, `federation:*`). Capabilities and contracts are pure descriptors validated before registration.
- **Authorization core is data-driven and deny-by-default.** `control-plane.ts` hardcodes no identities/permissions/policies; `policy-evaluator.ts` interprets metadata-stored `PolicyRecord`s with deny-overrides-allow + deny-by-default.
- **Configuration over customization** is honored in the substrate: a new capability is added via descriptor + provider with zero core change (`test/dynamic-capability.test.ts`).

These confirm the thesis **for the substrate and control-plane layers**. It breaks down above them.

---

## 4. Architectural Gaps

### 4.1 CRITICAL

#### ARCH-GAP-C1 — "Audit / Provenance" is an unrepresented primitive (non-composable, non-auditable-by-design)
Auditability is a first-class, cross-cutting concept but is **not one of the nine primitives** and is **not represented through them**. Instead it is re-implemented **six times** as parallel, near-identical hash-chained logs:

`InMemoryAuditLog` · `FederatedAuditLog` · `EvolutionAuditLog` · `KnowledgeAuditLog` · `MemoryAuditLog` · `OntologyAuditLog`

`KnowledgeAuditLog` and `MemoryAuditLog` are byte-for-byte structural clones differing only in a `KNOW_`/`MEM_` prefix. There is no universal Audit/Provenance primitive; every concept that needs auditability forks its own chain, so audit cannot be *composed*, *federated*, or *reconciled* uniformly. The 9-primitive model is therefore incomplete — auditability is bolted on per fabric rather than represented.
**Classes:** non-composable, non-auditable (uniformly), missing primitive.

#### ARCH-GAP-C2 — Intelligence / Simulation / Civilization concepts are not reducible to the nine primitives (incomplete representation set)
The program's own roadmap defines Intelligence (`INT-*`: reasoning, inference, planning, decision), Simulation (`SIM-*`: digital twins, scenarios, projection, impact), and Civilization (`CIV-*`) fabrics. **None** of these behavioral/cognitive concepts can be expressed as Registry / Metadata / Configuration / Knowledge / Ontology / Memory / Authority / Federation / Evolution. A "decision", a "reasoning session", a "scenario projection", or a "digital twin execution" has no home in the nine. The universal representation set is **incomplete for the system's declared scope** (at minimum an *Intelligence/Behavioral* primitive and a *Simulation/Projection* primitive are absent).
**Classes:** incomplete primitive set, non-representable concept.

#### ARCH-GAP-C3 — Governance/authorization chain is off-ledger; implemented constructs lack clean authority (non-governed)
Per `PHASE-21-CONSTITUTIONAL-RECONCILIATION-REPORT`, the authorization chain `AD-0016..AD-0023` sits **off the canonical `AUTH-012` ledger**; `AD-0021` (Ontology) is contested/phantom; and PI-9 Memory was ratification-**REJECTED** (`MEM-RAT-001`, §0W) yet is **fully implemented** in `src/control/memory/*`. Implemented fabrics therefore exist in code **without a clean, enrolled authorization**, violating the requirement that every construct be governed and traceable to ratified authority.
**Classes:** non-governed, non-auditable (at program-authority level).

### 4.2 MAJOR

#### ARCH-GAP-M1 — "Authority" primitive is not universal (certification/ratification/revocation duplicated per fabric)
The Authority concept is forked per fabric rather than composed:
- **Certification authorities (5):** Federation, Evolution, Knowledge, Memory, Ontology
- **Ratification authorities (4):** Evolution, Knowledge, Memory, Ontology
- **Revocation authorities (5):** Federation, Evolution, Knowledge, Memory, Ontology

`EvolutionCertificationAuthority` and `KnowledgeCertificationAuthority` are near-identical (differ only in a `evolution:ca:` vs `knowledge:ca:` prefix and record type). Concepts are governed *through copies of* the Authority machinery, not through one universal Authority primitive.
**Classes:** non-composable.

#### ARCH-GAP-M2 — "Evolution / Lifecycle" primitive is not universal (state machines duplicated)
Four parallel state machines (`Evolution`/`Knowledge`/`Memory`/`Ontology`StateMachine) plus per-fabric lifecycle engines. Evolution is meant to be the single durable-mutation/lifecycle path, yet each fabric ships its own lifecycle + state machine.
**Classes:** non-composable, special-case logic.

#### ARCH-GAP-M3 — Policy predicate vocabulary is hard-coded (special-case logic in the authorization core)
`policy-evaluator.ts` `#evaluateRule` is a code-level `switch` over **five fixed rule types** (`require-permission`, `require-trust`, `require-attribute`, `require-governance-approval`, `require-certification`). A new governance predicate requires a **code change** — the policy language is not registry/metadata-extensible. The most governance-critical component contains closed, hard-coded logic.
**Classes:** hard-coded concept, special-case logic.

#### ARCH-GAP-M4 — Memory governance objects bypass the Metadata primitive (non-uniform, non-federatable)
`MemoryCertificationAuthority` and `MemoryRatificationAuthority` store authorities in in-process `Map`s (`#authorities`) instead of `MetadataPort`, unlike Knowledge/Evolution/Ontology which persist under `<fabric>:ca:*` / `:ra:*`. Memory authorities are therefore **not represented as metadata records**, so they are not uniformly queryable, federatable, snapshot-able, or auditable.
**Classes:** non-composable, non-federated, breaks universal-representation invariant.

#### ARCH-GAP-M5 — Authoritative state ledger diverges from implemented reality (non-auditable program state)
`PROJECT-STATE.md §0W` records 213/213 tests and PI-9 Memory REJECTED/unimplemented; reality is **269/269 tests** with full Memory **and** Ontology fabrics present. The declared single source of truth for program state is materially inaccurate — the program cannot be audited from its own governance record.
**Classes:** non-auditable, non-governed.

### 4.3 MINOR

- **ARCH-GAP-m1 — Federation guards duplicated per fabric.** `knowledge/memory/ontology/evolution` each ship a `*-federation-guard`; crypto (`federation/assertions`) is reused, but the guard logic is copied rather than composed from a single Federation primitive.
- **ARCH-GAP-m2 — Descriptor kind vocabulary fixed in code.** Only `capability` and `contract` kinds; the two structural schemas are hard-coded constants (`descriptor-schemas.ts`). Extending the descriptor model requires a code change.
- **ARCH-GAP-m3 — Configuration primitive lacks per-layer schema validation.** `MetadataPort` exposes `validate()`; `ConfigurationPort` merges arbitrary records with no equivalent enforcement — a uniformity gap between two substrate primitives.
- **ARCH-GAP-m4 — Ontology is not the universal typing substrate.** Knowledge/Memory records are not ontology-typed (semantic-grounding gap also noted in `INT-REM-001`); Ontology exists but is not consumed as the shared semantic type system it is meant to provide.

---

## 5. Gap Summary

| Severity | Count | IDs |
|----------|:-----:|-----|
| **Critical** | 3 | C1 (missing Audit primitive), C2 (Intelligence/Simulation/Civilization not representable), C3 (off-ledger authority) |
| **Major** | 5 | M1 (Authority duplicated), M2 (Evolution/lifecycle duplicated), M3 (hard-coded policy predicates), M4 (Memory bypasses Metadata), M5 (ledger↔code divergence) |
| **Minor** | 4 | m1 (federation guards), m2 (descriptor kinds), m3 (config validation), m4 (ontology typing) |

---

## 6. Determination

The universal representation thesis holds **only for the substrate (Registry/Metadata/Configuration) and the control plane (Identity/Trust/Policy)**. Above that line it fails on three independent axes:

1. **Missing primitives** — Audit/Provenance and the behavioral concepts (Intelligence/Simulation) are not expressible through the nine (C1, C2).
2. **Systemic non-composability** — Authority, Evolution/Lifecycle, Federation, and Audit are *duplicated per fabric* instead of *composed from* universal primitives (M1, M2, m1, C1).
3. **Broken governance/auditability** — an off-ledger authority chain, ratification-rejected-but-implemented fabrics, and a ledger that disagrees with the code (C3, M4, M5).

Not every concept in UCOS can currently be represented through the nine universal primitives, and multiple implemented constructs are non-composable, non-uniformly-federated, non-governed, or non-auditable.

## VERDICT

> # UCOS ARCHITECTURE INCOMPLETE

**Release condition (to reach COMPLETE):** resolve C1–C3 (add/represent an Audit/Provenance primitive and a behavioral/Intelligence + Simulation primitive, or prove reduction to the nine; restore the `AUTH-012` ledger and re-authorize the implemented fabrics) and collapse M1/M2/M4 duplications into single universal Authority / Evolution-Lifecycle / Federation / Audit primitives that all fabrics compose, then re-run UA-01.

---

*Audit only. No source code, governance construct, ratified artifact, or ledger was modified by this phase. INV-1..13 and the Article IX generation lock are unchanged.*
