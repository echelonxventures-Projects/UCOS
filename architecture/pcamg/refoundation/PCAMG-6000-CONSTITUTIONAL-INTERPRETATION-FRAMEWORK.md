# PCAMG-6000 — Constitutional Interpretation Framework

> **STATUS: CREATED — READY FOR AUTHORITY BOARD REVIEW**
> PROPOSED · NOT RATIFIED · NOT CONSTITUTIONAL LAW · NOT IMPLEMENTATION AUTHORIZED
> DOES NOT SUPERSEDE `AUTH-001..012` / `UCOS-CONST-001` · DOES NOT MODIFY INV-1..13 / `INV-CORE-001` ·
> DOES NOT OVERRIDE AUTH-012 · DOES NOT RELEASE ARTICLE IX · REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `PCAMG-6000` |
| Name | Constitutional Interpretation Framework (deterministic, unambiguous meaning) |
| Program | Constitutional Refoundation Program — **Cross-Layer** |
| Classification | **PROPOSED — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **FRAMEWORK DESIGN ONLY** — no code, no enrollment, no lock release |
| Chartered by | `GD-0001`; governed by `PCAMG-1000` M-VI |
| Anchors | INV-6 (determinism); `INV-CORE-09`; `GD-0001` D-4/D-8 |

> **Enactment disclaimer.** Defines how governance text is interpreted deterministically. It resolves meaning,
> not authority; it enacts nothing.

---

## 1. Purpose

PCAMG-6000 guarantees that **every governance rule has exactly one deterministic interpretation** (Meta-
Constitution M-VI; `GD-0001` D-8). It eliminates constitutional ambiguity by defining a fixed interpretation
procedure: given the principles, the governance registry, and the inputs, the meaning of any rule is
reproducible (INV-6). Ambiguity is treated as a *defect to be resolved*, never as room for discretion.

## 2. Scope

**In scope:** the interpretation procedure, the ordered interpretive canons, the ambiguity-resolution rule,
and the determinism guarantee.

**Out of scope:** conflict *resolution between artifacts* (owned by `PCAMG-7000`); enrollment; any code.

## 3. Interpretation Procedure (deterministic)

To interpret a governance rule `R`:

```
IP-1  Resolve R and all referenced constructs from the governance registries (no external/implicit input).
IP-2  Determine R's derivation layer and owning artifact (PCAMG-0000 → 1000 → 2000 → 3000 → 4000 → 5000).
IP-3  Apply the ordered interpretive canons (§4) until a single meaning is produced.
IP-4  Verify the meaning does not violate any invariant principle (PCAMG-0000). If it does, the meaning is
      rejected and the rule is escalated as a defect.
IP-5  Emit an interpretation record (inputs, canons applied, meaning, determinism hash).
```

The procedure is total and terminating: it always yields either **one meaning** or **a defect escalation** —
never two admissible meanings.

## 4. Ordered Interpretive Canons

Applied in strict order; the first canon that resolves ambiguity governs.

| # | Canon | Statement |
|:-:|-------|-----------|
| C-1 | Principle Supremacy | The meaning that best conforms to the invariant principles prevails; a meaning that violates a principle is inadmissible (M-I). |
| C-2 | Higher-Derivation Priority | The meaning consistent with the higher-derivation artifact prevails (Layer 0 > 1 > 2 > 3 > 4 > 5 > 6 > 7 > 8). |
| C-3 | Textual Plain Meaning | The plain registered text governs; no unwritten intent is imputed. |
| C-4 | Glossary Bindingness | Terms are read per the canonical glossary (AUTH-011); no ad-hoc redefinition. |
| C-5 | Whole-Corpus Consistency | The meaning that keeps the corpus internally consistent prevails over one that creates conflict. |
| C-6 | Non-Redundancy | A reading that gives every clause effect prevails over one that renders a clause meaningless. |
| C-7 | Fail-Safe Default | Where ambiguity persists, the safest (most rights-preserving, most deny-by-default) reading governs. |
| C-8 | Defect Escalation | If no canon yields a single admissible meaning, the rule is a defect and is escalated to the owning authority for a governed clarification (append-only). |

## 5. Ambiguity Rule

**No constitutional ambiguity is permitted to persist.** A rule that cannot be interpreted to a single meaning
by canons C-1..C-7 is a **defect**; it is escalated (C-8) and, until clarified, its safest reading (C-7)
governs and dependent activations fail closed. Discretionary interpretation is prohibited.

## 6. Interpretation Record (mandatory)

```yaml
interpretation_record:
  rule_ref: <artifact>#<clause>
  inputs: [principles@ver, registries@ver, glossary@ver]
  canons_applied: [C-1..C-8 subset in order]
  meaning: <single resolved meaning | DEFECT>
  determinism_hash: <hash>          # INV-6 reproducibility
  escalation: <none | owning-authority ref>
  auditor: <recording authority>
```

## 7. Determinism Guarantee

Given identical `inputs`, the procedure yields an identical `meaning` and identical `determinism_hash`
(INV-6; `INV-CORE-09`). Interpretation is therefore reproducible and auditable, and cannot vary by actor,
time, or mood.

## 8. Scope Discipline (confirmations)

| Confirmation | Result |
|--------------|:------:|
| Total, terminating, deterministic interpretation procedure (IP-1..5) | ✅ |
| Ordered canons C-1..C-8; principle supremacy first; fail-safe default | ✅ |
| No persistent ambiguity; defects escalated, not resolved by discretion | ✅ |
| Interpretation record + determinism hash mandated (INV-6) | ✅ |
| No code; append-only; Article IX not released; ratified artifacts unchanged | ✅ |

## Traceability
- **Chartered by:** `GD-0001`; **governed by:** `PCAMG-1000` M-VI.
- **Anchors:** INV-6, `INV-CORE-09`, AUTH-011 (glossary).
- **Feeds:** `PCAMG-7000` (conflict resolution), `SPEC-CONSTITUTIONAL-VALIDATION-RULES`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect).

**END PCAMG-6000 · CONSTITUTIONAL INTERPRETATION FRAMEWORK · PROPOSED (NOT ENROLLED) · APPEND-ONLY · PENDING AUTHORITY BOARD REVIEW.**
