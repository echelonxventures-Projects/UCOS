# ARCH-GAP-VAL-001 — Architectural Gap Validation (Review of UA-01 Critical & Major Findings)

**Phase:** R1 — Architectural Gap Validation
**Artifact ID:** `ARCH-GAP-VAL-001`
**Validates:** `ARCH-GAP-001` (PHASE UA-01 — Universal Architecture Completeness Audit) — all 3 Critical + 5 Major findings
**Mode:** INDEPENDENT VALIDATION / EVIDENCE-BASED — no source, no governance change, no ratification, no lock release
**Method:** Independent reproduction (`npx tsc --noEmit` exit 0; `npm test` **269/269 pass**, 40 suites) + direct file inspection of `packages/platform-runtime/src/control/**` + ledger cross-read (`PROJECT-STATE §0W`)
**Date:** 2026-07-02

---

## 1. Scope & disposition scale

Every Critical (C1–C3) and Major (M1–M5) finding from `ARCH-GAP-001` is re-verified against the live code and
assigned a determination:

- **TRUE** — the defect is reproduced exactly as stated.
- **PARTIAL** — the underlying defect is real, but the finding's framing or a specific sub-claim overstates or
  mis-scopes it.
- **FALSE** — the defect could not be reproduced.

Each finding carries: **(1) Evidence · (2) Impact · (3) Root Cause · (4) Remediation Need · (5) Priority**
(P0 = blocker, P1 = high, P2 = medium).

## 2. Independent reproduction baseline

| Check | UA-01 claim | R1 reproduction | Agreement |
|-------|-------------|-----------------|:---------:|
| Typecheck | `tsc --noEmit` exit 0 | exit 0 | ✅ |
| Test suite | 269/269 | **269/269** (0 fail, 40 suites) | ✅ |
| Ledger claim (`§0W`) | 213/213, Memory REJECTED/unimplemented | Ledger still says 213/213 + "no `src/control/memory/*`"; **code has 24 memory modules** | ✅ divergence confirmed |
| Memory fabric present | implemented despite REJECTED | `src/control/memory/*` present, compiles, tested | ✅ |
| Ontology fabric present | implemented, authority contested | `src/control/ontology/*` present (22 modules) | ✅ |

---

## 3. Critical findings

### C1 — "Audit/Provenance" is an unrepresented primitive (duplicated per fabric) → **TRUE**

1. **Evidence.** Six independent audit mechanisms exist, none composed from a universal primitive:
   `control/audit-log.ts` (`InMemoryAuditLog`), `federation/federated-audit-log.ts`,
   `evolution/evolution-audit-log.ts`, `knowledge/knowledge-audit-log.ts`, `ontology/ontology-audit-log.ts`,
   `memory/memory-audit.ts`. Each carries its own event vocabulary (`KNOW_*`/`MEM_*`/`ONTO_*`/…). Only
   `FederatedAuditLog` composes (it wraps the PI-4 `AuditEntry` via `AuditSink`); the other four do not.
   "Audit/Provenance" is not among the nine primitives.
2. **Impact.** No unified integrity view; corruption/divergence must be detected and reconciled per fabric; any
   hardening fix must be applied ~6×. Audit does not compose, federate, or reconcile uniformly (corroborated by
   `AF-001` AF-F-3). Enlarges the corruption surface.
3. **Root cause.** The nine-primitive set omits a first-class Audit/Provenance primitive; each fabric was built
   to be self-auditing rather than to *compose* a shared audit primitive.
4. **Remediation need.** **Required to reach COMPLETE.** Introduce one universal Audit/Provenance primitive (the
   `AuditSink` seam is the natural seed) that all fabrics emit into; retire the per-fabric clones.
5. **Priority.** **P1 (High)** — architectural + security-surface; system functions today, so not a P0 blocker.

### C2 — Intelligence / Simulation / Civilization not reducible to the nine primitives → **PARTIAL**

1. **Evidence.** `src/control/` contains **no** `intelligence/` or `simulation/` directory (only evolution,
   federation, governance, identity, knowledge, memory, ontology, policy, trust); Civilization is conceptual
   (`CIV-*`). So these fabrics are **unimplemented** — TRUE. However, the design specs (`INT-*`, `SIM-*`,
   `CIV-*`) themselves model every construct as **metadata records** under `intelligence:*` / `simulation:*` /
   `civilization:*` keyspaces reusing the substrate ports — i.e. their *governed state* **is** expressible
   through Registry + Metadata + Ontology + Knowledge + Evolution + Federation.
2. **Impact.** The blanket claim "none can be expressed" overstates the gap: what is genuinely unrepresentable
   by the nine is the **behavioral/execution act** (a "reasoning step", an "inference", a "scenario
   projection") — which is the Meta-Core **execution engine's** domain, not a data primitive. The real,
   narrower gap is the absence of a first-class **Behavioral/Execution (Intelligence) primitive** and a
   **Projection/Simulation primitive** for representing *acts*, not *state*.
3. **Root cause.** Category conflation: the nine are **representational (state)** primitives; Intelligence/
   Simulation are **behavioral (execution)** concerns. The audit correctly detects a missing primitive but
   mis-frames representable state as non-representable.
4. **Remediation need.** **Refine, then address.** Restate the gap as "no behavioral/execution primitive"; then
   either (a) add an execution/behavioral primitive to the universal set, or (b) formally reduce behavior to
   `execution-engine + Evolution-committed records`. All gated behind **AD-0014** (Intelligence/Simulation/
   Civilization remain deferred) — not deliverable now regardless.
5. **Priority.** **P2 (Medium)** — deferred scope (AD-0014); a definitional refinement, not a live defect.

### C3 — Governance/authorization chain off-ledger; implemented constructs lack clean authority → **TRUE**

1. **Evidence.** `PROJECT-STATE §0W` records the `AD-0016..AD-0023` chain **off the canonical `AUTH-012`
   ledger**, `AD-0021` (Ontology) contested/phantom (PHASE-21: "AUTHORITY CHAIN DEFECT REMAINS"), and PI-9
   Memory ratification **REJECTED** (`MEM-RAT-001`). Yet `src/control/memory/*` (24 modules) and
   `src/control/ontology/*` are fully implemented, compile, and are tested (269/269). Implemented fabrics
   therefore exist without a clean, enrolled authorization.
2. **Impact.** Every downstream certification (PI-8/9/10) is blocked or unsound until the ledger is restored;
   the program cannot cleanly prove that shipped code is authorized. Intersects M5 and gates R-series closure.
3. **Root cause.** Authorization decisions were recorded outside `AUTH-012` (the canonical decision log) and
   construction proceeded past a rejected ratification without ledger reconciliation.
4. **Remediation need.** **Required (prerequisite).** Execute PHASE-21 authority-chain restoration: enroll or
   supersede `AD-0016..0023` on the `AUTH-012` ledger, resolve `AD-0021`, and re-authorize (or roll back) the
   implemented Memory/Ontology fabrics under clean, enrolled acts.
5. **Priority.** **P0 (Blocker)** — root governance defect; nothing certifies cleanly above it.

---

## 4. Major findings

### M1 — "Authority" primitive not universal (certification/ratification/revocation duplicated) → **TRUE**

1. **Evidence.** Certification authorities ×5 (evolution, federation, knowledge, memory, ontology); ratification
   authorities ×4 (evolution, knowledge, memory, ontology); revocation authorities/mechanisms ×5 (evolution,
   federation, knowledge, ontology `*-revocation-authority.ts` + `memory/memory-revocation.ts`).
   `EvolutionCertificationAuthority` / `KnowledgeCertificationAuthority` differ only by keyspace prefix + record
   type.
2. **Impact.** Authority is governed *through copies of* the machinery, not composed from one primitive; policy/
   crypto hardening must be repeated per fabric; divergence risk across near-identical implementations.
3. **Root cause.** No universal Authority primitive; each fabric re-instantiated the cert/ratify/revoke pattern.
4. **Remediation need.** **Recommended for COMPLETE.** Collapse into one universal, parameterized Authority
   primitive that all fabrics compose (namespace-scoped).
5. **Priority.** **P2 (Medium)** — composability/maintainability; behavior is correct today.

### M2 — "Evolution/Lifecycle" primitive not universal (state machines duplicated) → **TRUE**

1. **Evidence.** Four parallel state machines: `evolution/`, `knowledge/`, `memory/`, `ontology/`
   `*-state-machine.ts`, plus per-fabric lifecycle engines — despite Evolution being the intended single
   durable-mutation/lifecycle path.
2. **Impact.** Lifecycle semantics can drift between fabrics; the "single commit/lifecycle path" invariant is
   asserted but not structurally enforced.
3. **Root cause.** Each fabric shipped its own lifecycle rather than delegating to one Evolution/Lifecycle
   primitive.
4. **Remediation need.** **Recommended.** Route all lifecycle transitions through one Evolution-Lifecycle
   primitive; per-fabric state machines become configuration of it.
5. **Priority.** **P2 (Medium)**.

### M3 — Policy predicate vocabulary hard-coded in the authorization core → **TRUE**

1. **Evidence.** `policy/policy-evaluator.ts` `#evaluateRule` is a code-level `switch` over exactly five fixed
   rule types (`require-permission`, `require-trust`, `require-attribute`, `require-governance-approval`,
   `require-certification`), mirrored by the closed `PolicyRule` union in `control/types.ts`. A new predicate
   requires editing both.
2. **Impact.** The most security-critical component is **not** registry/metadata-extensible — contradicting the
   IP-04 "configuration over customization / no-hardcoding" thesis precisely where it matters most. New
   governance rules need a code change + redeploy.
3. **Root cause.** Rule evaluation was implemented as a closed native switch rather than a data-driven predicate
   registry.
4. **Remediation need.** **Recommended.** Make predicates pluggable (a predicate registry keyed by rule type,
   resolved from metadata) so new rules are additive data, not code.
5. **Priority.** **P1 (High)** — in the security-critical path and directly undercuts the universality claim.

### M4 — Memory governance objects bypass the Metadata primitive → **TRUE**

1. **Evidence.** `memory/memory-certification-authority.ts` stores authorities in an in-process
   `#authorities = new Map<...>()` (confirmed by direct read); `memory-ratification-authority.ts` follows the
   same pattern — unlike Knowledge/Evolution/Ontology which persist under `<fabric>:ca:*` via `MetadataPort`.
2. **Impact.** Memory authorities are **not** metadata records: not uniformly queryable, federatable,
   snapshot-able, or auditable; they vanish on process exit. Directly breaks the universal-representation
   invariant for one fabric.
3. **Root cause.** Local convenience state (`Map`) used instead of the Metadata primitive during Memory
   construction.
4. **Remediation need.** **Required (localized).** Persist Memory authorities via `MetadataPort` under
   `memory:ca:*` / `memory:ra:*`, matching the other fabrics.
5. **Priority.** **P1 (High)** — a concrete invariant violation, though contained to Memory.

### M5 — Authoritative state ledger diverges from implemented reality → **TRUE**

1. **Evidence.** `PROJECT-STATE §0W` records **213/213** tests and PI-9 Memory **REJECTED / "no
   `src/control/memory/*`"**; independent reproduction shows **269/269** tests with full Memory (24 modules) and
   Ontology fabrics present and passing.
2. **Impact.** The declared single source of truth for program state is materially false; the program **cannot
   be audited from its own governance record**. Compounds C3.
3. **Root cause.** The ledger was not updated (append-only) after Memory/Ontology construction and after the
   test-count grew; ledger maintenance lagged code.
4. **Remediation need.** **Required.** Append a reconciling `PROJECT-STATE` entry recording actual state
   (269/269; Memory + Ontology implemented) and cross-reference the C3 authority-restoration.
5. **Priority.** **P0 (Blocker)** — auditability/governance integrity; a false SoT invalidates all state-based
   review.

---

## 5. Validation summary

| Finding | Title | Determination | Priority |
|---------|-------|:-------------:|:--------:|
| C1 | Missing universal Audit/Provenance primitive | **TRUE** | P1 |
| C2 | Intelligence/Simulation/Civilization not reducible to the nine | **PARTIAL** | P2 |
| C3 | Off-ledger authority; implemented constructs lack clean authority | **TRUE** | **P0** |
| M1 | Authority primitive duplicated per fabric | **TRUE** | P2 |
| M2 | Evolution/Lifecycle duplicated (4 state machines) | **TRUE** | P2 |
| M3 | Hard-coded policy predicate vocabulary | **TRUE** | P1 |
| M4 | Memory authorities bypass the Metadata primitive | **TRUE** | P1 |
| M5 | Ledger ↔ code divergence (213 vs 269; Memory "rejected" but present) | **TRUE** | **P0** |

**Tally:** 7 **TRUE** · 1 **PARTIAL** · 0 **FALSE**. UA-01 is substantially validated; the only correction is
**C2**, which is real but should be re-scoped from "not representable" to "no behavioral/execution primitive"
(state is representable; execution is not a data primitive).

## 6. Remediation ordering (derived from priority)

1. **P0 — C3 + M5 (governance integrity):** execute PHASE-21 authority-chain restoration and append a truthful
   `PROJECT-STATE` reconciliation. Prerequisite to any clean certification.
2. **P1 — M3, M4, C1 (invariant/security integrity):** make policy predicates data-driven (M3); move Memory
   authorities to `MetadataPort` (M4); introduce a universal Audit/Provenance primitive (C1).
3. **P2 — M1, M2, C2 (composability / scope):** collapse Authority (M1) and Evolution-Lifecycle (M2)
   duplications into universal primitives; re-scope and (under AD-0014) defer the behavioral-primitive question
   (C2).

Re-run UA-01 after the P0 + P1 set to re-test the "COMPLETE" release condition.

## 7. Traceability

- **Validates:** `ARCH-GAP-001` (UA-01) §4 (C1–C3, M1–M5), §6 verdict *UCOS ARCHITECTURE INCOMPLETE*.
- **Corroborated by:** `AF-001` (AF-F-3/AF-F-5), `CIV-STRESS-001` (UA-06), `PROJECT-STATE §0W`,
  `PHASE-21-CONSTITUTIONAL-RECONCILIATION-REPORT`, `INT-REM-001` (semantic-grounding).
- **Evidence base:** `packages/platform-runtime/src/control/**` (audit-log, `*/*-{certification,ratification,
  revocation}-authority.ts`, `*/*-state-machine.ts`, `policy/policy-evaluator.ts`,
  `memory/memory-certification-authority.ts`, `memory/memory-audit.ts`); reproduced `tsc` + 269/269 tests.
- **Governed by:** `AUTH-012` / **AD-0014**, `AUTH-008` (S1/S3/S4), Constitution Article IX (unaffected).
- **Owner:** UCOS Authority Board (Architecture / Assurance).

*Validation only. No source code, governance construct, ratified artifact, or ledger was modified by this
phase. INV-1..13 and the Article IX generation lock are unchanged.*

**END ARCH-GAP-VAL-001 — 7 TRUE · 1 PARTIAL · 0 FALSE · UA-01 VALIDATED · P0: C3 + M5 · NO IMPLEMENTATION AUTHORIZED · ARTICLE IX ACTIVE.**
