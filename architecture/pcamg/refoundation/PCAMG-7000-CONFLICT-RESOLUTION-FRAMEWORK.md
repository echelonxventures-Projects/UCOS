# PCAMG-7000 — Conflict Resolution Framework

> **STATUS: CREATED — READY FOR AUTHORITY BOARD REVIEW**
> PROPOSED · NOT RATIFIED · NOT CONSTITUTIONAL LAW · NOT IMPLEMENTATION AUTHORIZED
> DOES NOT SUPERSEDE `AUTH-001..012` / `UCOS-CONST-001` · DOES NOT MODIFY INV-1..13 / `INV-CORE-001` ·
> DOES NOT OVERRIDE AUTH-012 · DOES NOT RELEASE ARTICLE IX · REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `PCAMG-7000` |
| Name | Conflict Resolution Framework (deterministic precedence & reconciliation) |
| Program | Constitutional Refoundation Program — **Cross-Layer** |
| Classification | **PROPOSED — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **FRAMEWORK DESIGN ONLY** — no code, no enrollment, no lock release |
| Chartered by | `GD-0001`; governed by `PCAMG-1000` M-VII |
| Anchors | `AUTH-009` §6.2 conflict order; `AUTH-INDEX-001` §2; `GD-0001` §4/D-7 |

> **Enactment disclaimer.** Defines how conflicts between governance artifacts are resolved deterministically.
> It enacts nothing and re-orders no ratified precedence until enrolled via AUTH-012.

---

## 1. Purpose

PCAMG-7000 provides the **deterministic procedure** for resolving conflicts between governance artifacts
(Meta-Constitution M-VII). Every conflict resolves to a single, reproducible outcome by a fixed precedence
order; no conflict is resolved by unaudited discretion, and no lower tier ever prevails over a higher tier
(`GD-0001` D-7 no-hierarchy-inversion).

## 2. Scope

**In scope:** conflict classification, the deterministic precedence order, the resolution procedure,
irreconcilable-conflict escalation, and the conflict record.

**Out of scope:** interpretation of a single rule (owned by `PCAMG-6000`); enrollment; any code.

## 3. Conflict Classification

| Class | Description | Example |
|-------|-------------|---------|
| K-1 Principle conflict | Artifact vs invariant principle | A policy that would waive S4 |
| K-2 Cross-layer conflict | Lower-layer artifact vs higher-layer artifact | An execution rule vs a domain constitution |
| K-3 Peer conflict | Two artifacts at the same layer | Two domain policies overlapping |
| K-4 Federation conflict | Foreign vs local governance | A foreign policy vs local sovereignty |
| K-5 Temporal conflict | New vs superseded artifact | A superseded rule still referenced |
| K-6 Corpus-reconciliation conflict | PCAMG proposal vs ratified corpus | GD-0001 vs `UCOS-CONST-001` pre-enrollment |

## 4. Deterministic Precedence Order

Conflicts are resolved by the following strict order (highest wins). This **re-roots** — and does not invert —
the ratified `AUTH-009` §6.2 / `AUTH-INDEX-001` §2 conflict order.

```
1. Invariant Principles                 (PCAMG-0000)           ← always supreme
2. Sovereignty Origin Doctrine          (GD-0002)
3. Governance Doctrine                   (GD-0001)
4. Meta-Constitution                     (PCAMG-1000)
5. Generated Governance / Frameworks     (PCAMG-2000..6000, 8000)
6. Polycentric Network rules             (PCAMG-3000)
7. Federated Domain constitutions        (PCAMG-4000)
8. Domain policies                       (Layer 5)
9. Capabilities                          (Layer 6; CAP-01..19)
10. Execution fabric constitution/rules  (PCAMG-5000; Layer 7)
11. Infrastructure                       (Layer 8)
```

**Pre-enrollment override.** Until the Authority Board enrolls the corpus, the ratified precedence
(`AUTH > Constitution > Architecture > Specs > Impl > Validation > Certification`) **prevails** for any K-6
conflict; PCAMG yields (`GD-0001` §6).

## 5. Resolution Procedure (deterministic)

```
CR-1  Classify the conflict (K-1..K-6).
CR-2  If K-1 (principle conflict): the principle prevails; the artifact is rejected/escalated. STOP.
CR-3  Interpret each artifact to a single meaning (PCAMG-6000). If interpretation removes the conflict, STOP.
CR-4  Apply the precedence order (§4): the higher-precedence artifact prevails.
CR-5  For K-3 peer conflicts at equal precedence: apply tie-breakers T-1..T-4 (§6).
CR-6  For K-4 federation conflicts: local sovereignty + deny-only foreign policy governs (PCAMG-4000 F-1/F-2).
CR-7  For K-5 temporal conflicts: the non-superseded (current) artifact governs; superseded text is
      reference-only (INV-10).
CR-8  For K-6 pre-enrollment conflicts: the ratified corpus prevails (§4 pre-enrollment override).
CR-9  If still irreconcilable: escalate to the owning authority / Authority Board; dependents fail closed
      until a governed clarification (append-only). Emit a conflict record.
```

The procedure is total and terminating: it yields a single winner or a fail-closed escalation.

## 6. Tie-Breakers (equal precedence, K-3)

| # | Tie-breaker | Rule |
|:-:|-------------|------|
| T-1 | Scope specificity | The more specific (narrower-scoped) governing artifact prevails. |
| T-2 | Fail-safe | The more rights-preserving / more deny-by-default artifact prevails. |
| T-3 | Derivation recency | Among equally specific, the artifact with the more recent *governed* activation prevails (INV-10 lineage). |
| T-4 | Escalation | If T-1..T-3 do not resolve, escalate to the common parent center / Authority Board. |

## 7. Conflict Record (mandatory)

```yaml
conflict_record:
  conflict_id: <id>
  class: K-1..K-6
  parties: [<artifact a>, <artifact b>]
  procedure_trace: [CR-1..CR-9 applied]
  precedence_applied: <order refs>
  winner: <artifact | ESCALATED>
  determinism_hash: <hash>          # INV-6
  escalation: <none | authority ref>
  auditor: <recording authority>
```

## 8. Guarantees

- **No hierarchy inversion** (`GD-0001` D-7): a lower-precedence artifact can never prevail over a higher one.
- **Principle supremacy** (M-I): the invariant principles win every K-1 conflict.
- **Determinism** (INV-6): identical conflicts resolve identically, with a reproducible hash.
- **Fail-closed** on irreconcilability; never a silent or discretionary resolution.

## 9. Scope Discipline (confirmations)

| Confirmation | Result |
|--------------|:------:|
| Deterministic precedence order + total/terminating procedure (CR-1..9) | ✅ |
| Re-roots (does not invert) `AUTH-009` §6.2; pre-enrollment ratified override (CR-8) | ✅ |
| Principle supremacy always wins (CR-2); no hierarchy inversion | ✅ |
| Conflict record + determinism hash mandated | ✅ |
| No code; append-only; Article IX not released; ratified artifacts unchanged | ✅ |

## Traceability
- **Chartered by:** `GD-0001`; **governed by:** `PCAMG-1000` M-VII.
- **Re-roots:** `AUTH-009` §6.2, `AUTH-INDEX-001` §2 (via `SPEC-AUTHORITY-INDEX-REFACTORING`).
- **Consumes:** `PCAMG-6000` (interpretation), `PCAMG-0000` (principles).
- **Owner:** UCOS Authority Board.

**END PCAMG-7000 · CONFLICT RESOLUTION FRAMEWORK · PROPOSED (NOT ENROLLED) · APPEND-ONLY · PENDING AUTHORITY BOARD REVIEW.**
