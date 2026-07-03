# INT-REM-003 — PI-10 Intelligence Fabric Architectural Remediation · Grounded Decision Provenance & Closure

| Field | Value |
|-------|-------|
| Artifact | **INT-REM-003 — Grounded Decision Provenance & Remediation Closure** |
| Phase | PHASE 19.2 (PI-10 Intelligence Fabric Architectural Remediation) |
| Version | 1.0.0 |
| Mode | DESIGN REMEDIATION ONLY — consolidates `INT-REM-001/002`; defines the decision provenance model; **no source code, runtime, infrastructure, services, model weights, or authorization**; Article IX **REMAINS ACTIVE** |
| Consolidates | `INT-REM-001` (F-2 semantic grounding), `INT-REM-002` (F-4 memory ownership) |
| Inputs (read-only) | `INT-REM-001`, `INT-REM-002`; `INT-AUTH-REV-001..004`, `INT-AUTH-001`; `INT-GOV-001/002`, `INT-ARCH-001`, `INT-AUD-001`, `INT-SEC-001`, `INT-THREAT-001`; `ONTO-*`, `MEM-*`, `KNOW-*`, `EVO-*` |
| Owner | UCOS Authority Board |

> This artifact **closes PHASE 19.2**. It defines the **grounded Decision Provenance Model** that unifies the
> ontology grounding (`INT-REM-001`) and memory consumption (`INT-REM-002`) into a single, rationale-complete
> decision record; presents the **consolidated single-source-of-truth model** across all four dependency axes;
> records the **F-2/F-4 defect-closure matrix**; and issues the **readiness determination for PHASE 19.3
> (PI-10 re-authorization review, prerequisite P-4)**. It authorizes nothing.

---

## 1. Consolidated Single-Source-of-Truth Model

Post-remediation, every semantically- or state-significant input to an intelligence decision resolves to
**exactly one ratified owner**, and the Intelligence Fabric holds **no** independent store or write path to any
of them. This restores single-SoR discipline across all four `INT-AUTH-REV-001` axes:

| Axis | Concern | Sole source of truth (owner) | PI-10 access | Binding | Status |
|:----:|---------|------------------------------|:------------:|---------|:------:|
| A | **Meaning** (types, relations, taxonomy, semantic constraints) | **PI-8 Ontology** (`ONTO-C1..C8`) | read/resolve | IGP-9, `INT-GOV-C13` (`INT-REM-001`) | **BOUND** |
| B | **Memory** (WM/STM/LTM/SEM/EPI/FED) | **PI-9 Memory** (`MEM-GOV-001/002`) | read-only recall | IGP-10, revised `INT-GOV-C12` (`INT-REM-002`) | **BOUND** |
| C | **Evidence/facts** | **PI-7 Knowledge** (`KNOW-*`) | read-only query | IGP-8 (already correct) | **OK** |
| D | **Durable mutation/commit** | **PI-6 Evolution** (`EVO-*`) | propose→commit | IGP-3, `INT-GOV-C8` (already correct) | **OK** |

**Principle rollup (new this phase):** **IGP-9** (mandatory ontology grounding, fail-closed) + **IGP-10**
(single memory SoR) join the existing IGP-1..8. The Intelligence Fabric is now, by design, a **pure consumer**
of meaning (PI-8), memory (PI-9), and facts (PI-7), and a **pure proposer** of change (PI-6) — with **zero**
competing stores.

## 2. Reasoning Session snapshot triad (reproducibility)

The revised Reasoning Session (`INT-GOV-C9`) pins **three** immutable, versioned snapshots, making every
grounded decision **reproducible-by-record**:

`{ sessionId, authorityId, goalId?, budgets, knowledgeSnapshotRef, ontologySnapshotRef, memorySnapshotRef, groundingBindingRef, memoryViewRef, seed, status }`

- **Knowledge snapshot** — facts (PI-7; pre-existing).
- **Ontology snapshot** — meaning (PI-8; `INT-REM-001` §3.3; closes T-F3).
- **Memory snapshot** — recalled state (PI-9; `INT-REM-002` §4.3; closes T-F2).

A decision is therefore a **deterministic function of `(pinned facts, pinned meaning, pinned memory, policy
set, constraint set, seed)`** — satisfying INV-6 and closing the design side of threat **I3**.

## 3. Grounded Decision Provenance Model

Extends the rationale chain of `INT-AUD-001`/`IGP-6` so that **no decision is committable unless its rationale
resolves every grounded input to its ratified owner**. This resolves the Decision **rationale-BLOCKED** finding
(`INT-AUTH-REV-003` §1.4) at the design-binding level.

### 3.1 Decision provenance record (rationale-complete)

```
DecisionProvenance {
  decisionId, proposalRef, sessionRef,
  grounding: {                          // meaning — PI-8
    ontologySnapshotRef,
    groundedTerms: [ { term, entityRef(ONTO-C5, active), constraintsChecked(ONTO-C8) } ]
  },
  evidence: [ {                          // facts + memory + advisory
    evidenceId, sourceKind: knowledge|memory|inference-adapter|federated-advisory,
    sourceRef, groundedType(ONTO-C5), provenance, classification,
    memoryProvenance?(MGP-7),            // present when sourceKind = memory
    verifierAttestation?                 // present when sourceKind = inference-adapter (deterministic guard)
  } ],
  inference: [ { stepRef, kind: deterministic|adapter-advisory, ontologyValid(ONTO-C8) } ],
  policy: { policySetRef, result: allow, evaluatedAt },     // PI-4, pre-commit
  constraints: { constraintSetId, hardSatisfied: true, typedAgainst: ontologySnapshotRef },
  certifiedBy, ratifiedBy[], quorumMet,   // SoD — INT-GOV-C7/C8
  commitVia: evolutionUnitRef,            // PI-6 — the ONLY commit path
  rationaleHash                           // hash-chained, signed (INT-AUD-001)
}
```

### 3.2 Rationale-completeness rule (fail-closed)

A decision reaches `committed` **only if all** hold; any failure denies fail-closed and audits the denial:

1. **Grounded** — every `groundedTerm` and every `evidence.groundedType` resolves to an `active` entity in the
   pinned Ontology Snapshot (IGP-9). *(closes I2 evidence poisoning at the semantic layer)*
2. **Attributed** — every memory evidence item carries a valid PI-9 provenance envelope (`MGP-7`); expired/
   revoked recall is excluded. *(closes T-F2 / I3 memory-context reproducibility)*
3. **Constraint-valid** — no `block`-severity Semantic Constraint (`ONTO-C8`) and no hard Constraint Set
   violation (`INT-GOV-C6`). *(closes I7 constraint bypass; typed rigor via ontology)*
4. **Quarantine-clean** — any non-deterministic adapter fragment carries a deterministic verifier attestation
   and is ontology-valid; no adapter output is a sole basis (IGP-2). *(closes I6)*
5. **Policy-passed** — PI-4 deny-by-default evaluation `allow` (`INT-GOV-C5`). *(I4)*
6. **SoD-clean** — proposer ≠ certifier ≠ ratifier; quorum met above threshold (`INT-GOV-C7/C8`). *(I8)*
7. **Commit-routed** — the only commit is a PI-6 Evolution Unit (`commitVia`); the Decision Engine holds no
   write path (IGP-3). *(I4 / Ω∞ boundary, AD-0014)*

An **un-groundable, un-attributable, or un-routable** decision is a **rejected** decision — there is no
ungrounded commit path.

## 4. Defect-closure matrix (F-1..F-4)

| Finding | `INT-AUTH-REV-001` classification | Nature | Closed by | Post-19.2 status |
|:-------:|-----------------------------------|--------|-----------|------------------|
| **F-1** | Ontology unimplemented/unauthorized | **sequencing** | **P-1** (`ONTO-AUTH-001` → AD-0021 → impl) | OPEN — impl gate (unchanged) |
| **F-2** | INT does not consume `ONTO-*` for grounding | **design binding** | **`INT-REM-001`** | **RESOLVED (design-binding)** |
| **F-3** | Memory unimplemented/unauthorized | **sequencing** | **P-2** (Mem auth review → AD-0022 → impl) | OPEN — impl gate (unchanged) |
| **F-4** | INT defines a competing memory store | **design binding** | **`INT-REM-002`** | **RESOLVED (design-binding)** |

**PHASE 19.2 scope = the two design-binding defects (F-2, F-4). Both are RESOLVED.** F-1/F-3 are pure
implementation-sequencing gates (P-1/P-2), explicitly **out of scope** for a design remediation and unchanged
by it.

## 5. Dependency-axis re-statement (design-binding lens)

| Axis | `INT-AUTH-REV-001` verdict | After PHASE 19.2 | Residual gate to SATISFIED |
|:----:|:-------------------------:|:----------------:|----------------------------|
| A Ontology (PI-8) | BLOCKED (F-1, F-2) | **binding SATISFIED (F-2 resolved)** | **P-1** implementation (F-1) |
| B Memory (PI-9) | BLOCKED (F-3, F-4) | **binding SATISFIED (F-4 resolved)** | **P-2** implementation (F-3) |
| C Knowledge (PI-7) | OK | OK | — |
| D Evolution (PI-6) | OK | OK | — |

> **Design-binding closure: 4/4 axes correctly bound.** **Operational closure: 2/4** pending P-1/P-2
> implementation. The remaining path to full operational satisfaction is **pure sequencing**, exactly as
> `INT-AUTH-REV-004` §4 / `INT-AUTH-001` §4 prescribe: **PI-8 → PI-9 → (INT v1.1.0, done here) → re-review →
> AD-0023.**

## 6. Threat posture delta

| Threat | Pre-19.2 (`INT-AUTH-REV-002`) | After PHASE 19.2 |
|:------:|-------------------------------|------------------|
| I2 evidence poisoning | design-confirmed; ops-conditional (T-F1) | **design-hardened** by ontology-valid evidence + `ONTO-C8` gate; ops still gated on P-1/P-2 |
| I3 non-determinism | design-confirmed; memory reproducibility deferred (T-F2) | **design-closed** by memory snapshot pinning; ops gated on P-2 |
| I6 inference injection | confirmed | **strengthened** with semantic-constraint verifier |
| I7 constraint bypass | design-confirmed; typed rigor deferred (T-F3) | **design-closed** by typed constraints over pinned ontology |
| I4 Ω∞ actuation escape | structurally closed | unchanged — still structurally closed (propose-not-act; commit only via PI-6) |

No new threats introduced. Remediation only **removes** a write surface (competing memory store) and **adds
read dependencies** — a strictly SoR-reducing change. Residual **0 High/High** (design) preserved.

## 7. PHASE 19.2 output register

| Output | Artifact | Resolves / Defines |
|--------|----------|--------------------|
| INT-REM-001 | Semantic Grounding Remediation | **F-2**; mandatory ontology consumption; reasoning evidence model; inference grounding model |
| INT-REM-002 | Memory Ownership & Single-SoR Remediation | **F-4**; mandatory memory consumption; single-source-of-truth model |
| INT-REM-003 | Grounded Decision Provenance & Closure | decision provenance model; consolidated single-SoR; defect closure; readiness |

**Applied to design:** `INT-GOV-001` and `INT-ARCH-001` advance to **v1.1.0** incorporating the normative
deltas of `INT-REM-001 §7` and `INT-REM-002 §7` (IGP-9/IGP-10; `INT-GOV-C13`; revised `INT-GOV-C12`; snapshot
triad; `ontology-access.ts`; `memory-store.ts → memory-access.ts`).

## 8. Readiness determination

> # PI-10 ARCHITECTURAL REMEDIATION: COMPLETE
>
> The two design-binding defects that blocked the PHASE 19.1 recommendation — **F-2 (semantic grounding)** and
> **F-4 (memory ownership)** — are **RESOLVED**. The Intelligence design now (a) **mandatorily consumes the PI-8
> Ontology Fabric** for meaning, fail-closed; (b) **consumes the PI-9 Memory Fabric read-only** with **no
> competing store**; (c) grounds every decision in a **rationale-complete, reproducible provenance record**; and
> (d) preserves all non-waivable invariants (deny-by-default, propose-not-act, Evolution-only commit,
> determinism quarantine, no custom crypto, AD-0014 Ω∞ boundary, INV-1..13, S1/S3/S4).
>
> **Prerequisite P-3 is DISCHARGED.** Prerequisites **P-1 (PI-8 implementation)** and **P-2 (PI-9
> implementation)** remain OPEN as pure sequencing gates. **P-4 (re-authorization review) is now UNBLOCKED on
> the design axis** and is the subject of **PHASE 19.3**.
>
> This remediation **authorizes nothing**: the Constitution **Article IX generation lock REMAINS ACTIVE**,
> `UCOS-CONSTRUCTION-BLOCKED` is unchanged, **AD-0014**/**INV-1..13** stand, and **no AD-0023** is issued. PI-10
> construction remains **DEFERRED** pending P-1, P-2, and the PHASE 19.3 determination.

**READY FOR PHASE 19.3 — PI-10 RE-AUTHORIZATION REVIEW (P-4).**

## 9. Traceability
- **Refines:** `INT-REM-001/002`, `INT-AUTH-REV-001..004`, `INT-AUTH-001`, `INT-GOV-001/002`, `INT-ARCH-001`,
  `INT-AUD-001`, `INT-SEC-001`, `INT-THREAT-001`, `ONTO-*`, `MEM-*`, `KNOW-*`, `EVO-*`, `AD-0016..0020`,
  `AD-0014`, AUTH-003/008/009/012, Constitution Art. IX/XII, `UCOS-CONSTRUCTION-BLOCKED`.
- **Refined by:** a revised `INT-GOV-001`/`INT-ARCH-001` (v1.1.0); the PHASE 19.3 PI-10 re-authorization review
  (P-4); a prospective Authority Board PI-10 act (**AD-0023**), contingent on P-1/P-2.
- **Owner:** UCOS Authority Board.

**END INT-REM-003 — PI-10 REMEDIATION COMPLETE · F-2 & F-4 RESOLVED · P-3 DISCHARGED · READY FOR PHASE 19.3 RE-AUTHORIZATION REVIEW · ARTICLE IX ACTIVE.**
