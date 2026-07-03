# INT-REM-001 — PI-10 Intelligence Fabric Architectural Remediation · Semantic Grounding (F-2)

| Field | Value |
|-------|-------|
| Artifact | **INT-REM-001 — Semantic Grounding Remediation** |
| Phase | PHASE 19.2 (PI-10 Intelligence Fabric Architectural Remediation) |
| Version | 1.0.0 |
| Mode | DESIGN REMEDIATION ONLY — revises `INT-*` design bindings; **no source code, runtime, infrastructure, services, model weights, or authorization**; Article IX generation lock **REMAINS ACTIVE** |
| Resolves | **F-2** (Dependency Axis A — Intelligence ↔ Ontology; `INT-AUTH-REV-001` §2): the INT design does not consume `ONTO-*` for semantic grounding |
| Inputs (read-only) | `INT-AUTH-REV-001` (F-2), `INT-AUTH-REV-002` (T-F1/T-F3), `INT-AUTH-REV-003` (Reasoning BLOCKED; Inference/Planning/Goal PARTIAL), `INT-AUTH-REV-004` (P-3), `INT-AUTH-001`; `INT-GOV-001`, `INT-ARCH-001`; `ONTO-ARCH-001` (ONTO-C1..C8), `ONTO-GOV-001/002`, `ONTO-SEC-001` |
| Owner | UCOS Authority Board |

> This artifact discharges the **ontology half of prerequisite P-3** (`INT-AUTH-REV-004` §3; `INT-AUTH-001`
> §2/Q2). It converts the Intelligence Fabric's implicit, ungrounded notion of "evidence" into an **explicit,
> mandatory, fail-closed binding to the PI-8 Ontology Fabric**. It authorizes nothing: it defines the normative
> design deltas that a revised `INT-GOV-001`/`INT-ARCH-001` (v1.1.0) incorporates and that the PHASE 19.3
> re-authorization review (P-4) will validate. Operational assurance remains gated on PI-8 implementation (P-1).

---

## 1. Defect restatement (F-2)

`INT-AUTH-REV-001` §2 classified **Dependency Axis A (Intelligence ↔ Ontology)** as **BLOCKED**, with two
findings:

- **F-1** — Ontology (PI-8) is design-only: no `ONTO-AUTH-001`, no **AD-0021**, no `src/control/ontology/*`.
  *Sequencing gate; resolved by prerequisite **P-1** (implementation), not by this remediation.*
- **F-2** — **the Intelligence design does not consume `ONTO-*` for semantic grounding.** `INT-ARCH-001 §2.1`
  orchestrates over "evidence" and `INT-GOV-001 IGP-8` reads knowledge/memory, but **no construct binds the
  meaning** of goals, evidence, constraints, or conclusions to the Ontology graph. Reasoning validity,
  ontology-relative inference, typed constraints (`INT-AUTH-REV-002` T-F3), and goal semantics
  (`INT-AUTH-REV-003` §1.5) are therefore **ungrounded**.

**This artifact resolves F-2 at the design-binding level.** F-1 is unaffected (it is closed by P-1).

## 2. Grounding principle (new)

- **IGP-9 Mandatory Ontology Grounding (fail-closed).** Every semantically-significant intelligence
  operation — Reasoning, Inference, Planning, Constraint interpretation, and Goal admission — is
  **ontology-relative**. The meaning of every goal statement, evidence item, constraint term, and conclusion
  is defined **only** by reference to `active`, ratified Ontology Records (`ONTO-C2`) resolved from the
  Ontology Graph (`ONTO-C4`). An intelligence operation over a term that **cannot be resolved to an `active`
  ontology entity/relationship/taxonomy** is **denied fail-closed** — never grounded against an ad-hoc,
  intelligence-local, or inferred meaning. There is **no intelligence-local ontology**; the PI-8 Ontology
  Fabric is the **sole source of truth for meaning** (single-SoR discipline, extends `INT-AUTH-REV-001`).

## 3. Mandatory Ontology Consumption Model

### 3.1 Consumed PI-8 contract surface (read-only)

The Intelligence Fabric consumes the Ontology Fabric through its **public read/resolve seam only** — it holds
**no** ontology write path (all ontology mutation is PI-8's, via the Evolution Fabric, `ONTO-GOV-002 §3`):

| Consumed construct | PI-8 source | Intelligence use |
|--------------------|-------------|------------------|
| Ontology Record (`ONTO-C2`) | `ONTO-ARCH-001 §3.2` | resolve the ratified, versioned meaning of a term (`active` version only) |
| Ontology Graph (`ONTO-C4`) | `ONTO-ARCH-001 §3.4` | the deterministic, read-only typed projection reasoning traverses |
| Entity / Relationship / Taxonomy (`ONTO-C5/6/7`) | `ONTO-ARCH-001 §3.5–3.7` | type, association, and classification semantics for goals/evidence/plans |
| Semantic Constraints (`ONTO-C8`) | `ONTO-ARCH-001 §3.8` | `block`-severity integrity rules a conclusion/plan must satisfy |
| OntologyResolver (`ONTO-ARCH-001 §4`) | resolution & query | local-first resolution; fail-closed on unresolved/expired/revoked referents |

### 3.2 New governance construct — Ontology Grounding Binding (`INT-GOV-C13`)

Adds one construct to `INT-GOV-001 §2` (metadata-first; reserved key `intelligence:grounding:<id>`; **no
core-dir change**):

- **Purpose.** Binds an intelligence scope to the PI-8 Ontology Fabric as the mandatory grounding source, and
  **pins a resolvable ontology view** for reproducibility.
- **Record.** `{ bindingId, scope, ontologyNamespaceRefs: namespace[], ontologySnapshotRef, resolutionMode: "active-only", onUnresolved: "deny", status }`.
- **Decision rights.** Registration/scope: Authority Board (Approval-Required). `ontologyNamespaceRefs` is an
  enumerated allow-list (no implicit namespaces).
- **Invariants.** `resolutionMode = active-only` (never draft/proposed/superseded); `onUnresolved = deny`
  (fail-closed, IGP-9); the binding grants **read/resolve only** — it can never mutate an ontology record; a
  Reasoning Session (`INT-GOV-C9`) without a resolvable Ontology Grounding Binding **cannot open**.

### 3.3 Ontology Snapshot pinning (reproducibility)

Because `ONTO-C4` is a **deterministic projection of the audited active record set** (`ONTO-ARCH-001 §3.4`), a
Reasoning Session pins an **Ontology Snapshot** exactly as it already pins a Knowledge Snapshot
(`INT-GOV-C9.knowledgeSnapshotRef`). This makes ontology-grounded reasoning **reproducible-by-record** and
directly hardens `INT-AUTH-REV-002` **T-F3** (typed-constraint rigor). Revised session record:

`{ sessionId, authorityId, goalId?, budgets, knowledgeSnapshotRef, ontologySnapshotRef, groundingBindingRef, seed, status }`

## 4. Reasoning Evidence Model (grounded)

Resolves the Reasoning **BLOCKED** finding (`INT-AUTH-REV-003` §1.1) at the design-binding level. Every
evidence item admitted into a Reasoning Session is now a **grounded evidence assertion**, not opaque data:

- **Evidence shape.** `{ evidenceId, sourceRef, sourceKind: "knowledge"|"memory"|"inference-adapter"|"federated-advisory", groundedType: ontologyEntityRef, classification, provenance }`.
- **Grounding rule (fail-closed).** `groundedType` **must** resolve to an `active` Entity (`ONTO-C5`) in the
  session's pinned Ontology Snapshot. Evidence whose type is unresolved, expired, or revoked is **excluded
  fail-closed** (mirrors `ONTO-C4`'s exclusion of unresolvable referents) — it may never silently participate
  in a conclusion.
- **Source discipline (unchanged, now typed).** Knowledge evidence is read-only via PI-7 (`IGP-8`, S4-honored);
  memory evidence is read-only via the PI-9 recall seam (see `INT-REM-002`); federated contributions remain
  advisory/clamped (`INT-FED-001`). The Reasoning Engine adds **meaning**, it does not add facts.
- **Validity.** A conclusion is well-formed only if the relationships it asserts between grounded entities are
  **type-conformant** to `active` Relationships (`ONTO-C6`) and violate **no** `block`-severity Semantic
  Constraint (`ONTO-C8`). A conclusion failing constraint evaluation is rejected (deny-by-default), directly
  closing the design gap behind threat **I2** (evidence poisoning / reasoning manipulation; `INT-AUTH-REV-002`
  T-F1) at the ontology layer.

## 5. Inference Grounding Model

Resolves the Inference **PARTIAL** finding (`INT-AUTH-REV-003` §1.2). The determinism quarantine
(`INT-ARCH-001 §4`, INV-6) is preserved unchanged and **extended with a mandatory ontology-validity gate**:

```
 grounded evidence ─▶ [Deterministic Inference core: ontology-relative derivation over ONTO-C4] ─▶ candidate conclusion
                                                                                                      │
   Inference Adapter (declared NON-DETERMINISTIC, advisory-only) ─┐                                    ▼
     records: modelRef, seed, inputsHash, outputClassification    │                        [Semantic-Constraint Verifier]
                                                                  └─▶ advisory fragment ───▶  must confirm the fragment's
                                                                                              asserted types/relations are
                                                                                              ONTO-C8-valid before it may
                                                                                              influence a committed decision
```

- **Deterministic semantic inference** is ontology-relative: inference steps derive only relationships
  admissible under `active` `ONTO-C6`/`ONTO-C7` and are checked against `ONTO-C8`. This is the substance that
  `INT-AUTH-REV-003` flagged as BLOCKED on PI-8 — now **bound** (constructible once P-1 lands).
- **Non-deterministic adapter output** remains **advisory-only** (IGP-2) and now additionally **cannot reach a
  committed decision unless a deterministic Semantic-Constraint Verifier independently confirms** its asserted
  entities/relationships are ontology-valid. An adapter fragment referencing an unresolved/deny type is dropped
  fail-closed. This strengthens threat **I6** (inference/prompt injection) with a semantic gate on top of the
  existing verifier/guard.
- **Typed constraints (T-F3).** Constraint terms in a Constraint Set (`INT-GOV-C6`) are now resolved to
  `active` ontology types; typed-constraint checking becomes fully rigorous under the pinned snapshot rather
  than string/opaque matching.

## 6. Capability status delta (design-binding lens)

| Capability | `INT-AUTH-REV-003` verdict | After INT-REM-001 (design binding) | Residual gate |
|------------|:--------------------------:|:----------------------------------:|---------------|
| Reasoning | BLOCKED (Ontology + Memory) | **Ontology grounding BOUND** (IGP-9, C13, evidence model §4) | Memory (`INT-REM-002`) + **P-1** impl |
| Inference | PARTIAL (Ontology) | **Semantic grounding BOUND** (§5) | **P-1** impl |
| Planning | PARTIAL (Ontology + Memory) | **Typed-constraint grounding BOUND** (§5, T-F3) | Memory (`INT-REM-002`) + **P-1** impl |
| Goal Management | PARTIAL (Ontology) | **Goal semantics BOUND** — a goal admits only if its statement grounds to `active` entities/relations (IGP-9) | **P-1** impl |
| Constraint Solving | NOW (typed: PI-8) | **Typed rigor BOUND** | strengthened by **P-1** |

**F-2 is resolved as a design-binding defect.** Remaining ontology dependence is a pure **sequencing gate**
(P-1: `ONTO-AUTH-001` → AD-0021 → `src/control/ontology/*` → validated), no longer a specification gap.

## 7. Normative design deltas (applied to `INT-*` v1.1.0)

1. `INT-GOV-001` — add **IGP-9** (§1) and **`INT-GOV-C13` Ontology Grounding Binding** (§2.13); update the
   coverage matrix (§3) to map C13 → I2/I6/I7.
2. `INT-GOV-001 §2.9` (Reasoning Session) — add `ontologySnapshotRef` + `groundingBindingRef`; a session
   without a resolvable binding cannot open.
3. `INT-ARCH-001 §2.1/§2.2/§2.3` — reasoning/inference/planning are ontology-relative over `ONTO-C4`; add the
   Semantic-Constraint Verifier to the determinism quarantine (§4).
4. `INT-ARCH-001 §3` (Supporting Subsystems) — add **Ontology Grounding** (read-only `ONTO-*` resolve client);
   §5 module map — add `ontology-access.ts` (read-only, S4-aware, snapshot-pinned).
5. `INT-ARCH-001 §6` (Reuse Map) — add "Semantic grounding → PI-8 Ontology Fabric (read/resolve), reused, not
   re-implemented."

## 8. Constraints preserved (non-waivable)

Deny-by-default; propose-not-act (IGP-3); Evolution-only commit; determinism quarantine (INV-6); no custom
crypto; **AD-0014** Ω∞ boundary; INV-1..13; S1/S3/S4; **Article IX generation lock ACTIVE**;
`UCOS-CONSTRUCTION-BLOCKED` unchanged. Grounding adds a **read** dependency only — it introduces **no** new
write path and **no** core-dir change.

## 9. Traceability
- **Refines:** `INT-AUTH-REV-001` (F-2), `INT-AUTH-REV-002/003/004`, `INT-AUTH-001`, `INT-GOV-001`,
  `INT-ARCH-001`, `ONTO-ARCH-001` (ONTO-C1..C8), `ONTO-GOV-001/002`, `AD-0016..0020`, `AD-0014`,
  AUTH-003/008/009/012, Constitution Art. IX/XII.
- **Consumed by:** `INT-REM-003` (closure), a revised `INT-GOV-001`/`INT-ARCH-001` (v1.1.0), the PHASE 19.3
  PI-10 re-authorization review (P-4), a prospective **AD-0023**.
- **Owner:** UCOS Authority Board.

**END INT-REM-001 — F-2 RESOLVED (DESIGN-BINDING) · MANDATORY ONTOLOGY GROUNDING · OPERATIONAL CLOSURE GATED ON P-1 · ARTICLE IX ACTIVE.**
