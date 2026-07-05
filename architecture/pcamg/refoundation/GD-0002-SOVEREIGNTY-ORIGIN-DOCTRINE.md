# GD-0002 — Sovereignty Origin Doctrine

> **STATUS: CREATED — READY FOR AUTHORITY BOARD REVIEW**
> PROPOSED · NOT RATIFIED · NOT CONSTITUTIONAL LAW · NOT IMPLEMENTATION AUTHORIZED
> DOES NOT SUPERSEDE `AUTH-001..012` / `UCOS-CONST-001` · DOES NOT MODIFY INV-1..13 / `INV-CORE-001` ·
> DOES NOT OVERRIDE AUTH-012 · DOES NOT RELEASE ARTICLE IX · AD-0014 UNCHANGED
> REQUIRES AUTHORITY BOARD REVIEW (Constitutional Majority, AUTH-009)

| Field | Value |
|-------|-------|
| Artifact ID | `GD-0002` |
| Name | Sovereignty Origin Doctrine |
| Program | Constitutional Refoundation Program — **Doctrine Tier** |
| Classification | **PROPOSED — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **GOVERNANCE-DOCTRINE DESIGN ONLY** — no code, no enrollment, no lock release |
| Chartered by | `GD-0001` |
| Governs (if enrolled) | The origin and flow of all governance authority in UCOS Ω∞ |
| Governance basis | AUTH-009, AUTH-012, Constitution Art. XII/XIII, `PCAMG-0000` PRIN-001 |

> **Enactment disclaimer.** This doctrine defines *where sovereignty comes from* as a proposal. It enacts
> nothing and confers no authority until enrolled by the Authority Board via AUTH-012.

---

## 1. Purpose

GD-0002 answers the single most fundamental governance question: **what is the origin of sovereignty in UCOS
Ω∞?** It fixes, as a ratifiable proposal, that sovereignty originates **only** from the invariant principles,
and that sovereignty may **never** originate from execution, from artificial intelligence, or from
organizations. Every other governance artifact in the corpus derives its legitimacy from this doctrine.

## 2. Scope

**In scope:** the definition of the sovereignty origin, the exclusions (execution / AI / organizations), the
sovereignty-flow model, and the invariance and non-inversion rules that protect the origin.

**Out of scope:** enrollment; any change to ratified artifacts; any release of Article IX; any code.

## 3. The Sovereignty Origin

**Article S-I — Origin.** Sovereignty in UCOS Ω∞ originates **solely** from the set of registered **Invariant
Principles** (`PCAMG-0000`). The principles are the root of legitimacy. All authority is derived; none is
inherent to any office, document, model, or machine.

**Article S-II — Immutability of the Origin.** The invariant principles are immutable. They may be amended
only by Constitutional Majority via an AUTH-012 decision record, and never in a direction that transfers the
origin of sovereignty away from principles (see Article S-VI).

**Article S-III — Derivation, not creation.** No authority is *created* by any UCOS actor; authority is only
*derived* from the principles through the governed authority flow (`GD-0001` §4). To hold authority is to hold
a delegated, principle-bounded, revocable, auditable derivation — never an inherent power.

## 4. Sovereignty Exclusions (non-waivable)

**Article S-IV — No Sovereignty From Execution.** Running code, a live service, a fabric, a runtime, or an
operational system confers **no** governance authority. Execution *realizes* governance; it never *is* the
source of governance. An execution that attempts to author, amend, or reinterpret governance is void and
fail-closed (`PCAMG-5000`).

**Article S-V — No Sovereignty From Artificial Intelligence.** No autonomous or intelligent component may hold
terminal authority, author its own goals, self-modify its authority, or actuate irreversible/rights-affecting
outcomes without human authorization. Intelligence within UCOS is **governed cognition**: it proposes, it does
not self-direct (`PCAMG-0000` PRIN-015; AD-0014; `INV-CORE-12`).

**Article S-VI — No Sovereignty From Organizations.** No organization, board, office, vendor, or role is the
*origin* of sovereignty. Organizations (including the Authority Board) are **stewards and delegates** of the
invariant principles: they exercise derived, principle-bounded authority and are themselves bound by the
principles. The Authority Board is the **terminal human escalation** (AUTH-009), which is a delegation of
PRIN-001 (Human Sovereignty), not an independent source of sovereignty.

> These three exclusions are non-waivable. No governance model generated under `PCAMG-2000`, no domain
> constitution under `PCAMG-4000`, and no evolution under the adaptive framework may weaken or invert them.

## 5. Sovereignty Flow

```
              INVARIANT PRINCIPLES  (the sole origin — GD-0002 S-I)
                        │  derives (downward only)
                        ▼
              META-CONSTITUTION      (PCAMG-1000)
                        │
                        ▼
        GENERATED GOVERNANCE SYSTEMS (PCAMG-2000)
                        │
                        ▼
        POLYCENTRIC GOVERNANCE NETWORK (PCAMG-3000)
                        │
                        ▼
        FEDERATED DOMAIN GOVERNANCE   (PCAMG-4000)
                        │
                        ▼
             ORGANIZATIONS (delegated stewards — S-VI)
                        │
                        ▼
             IMPLEMENTATIONS
                        │
                        ▼
             EXECUTIONS (no sovereignty — S-IV)
```

- **Downward derivation only.** Authority flows down. Each tier's authority is a strict subset of, and bounded
  by, the tier above it and ultimately by the principles.
- **Upward legitimacy verification only.** A claim to authority is validated by tracing it *up* to the
  principle(s) it derives from (`SPEC-TRACEABILITY-FRAMEWORK`). An unverifiable claim is void.
- **No sideways or upward conferral.** No tier may grant authority to a peer or to a tier above it.

## 6. Non-Inversion Guarantees

| # | Guarantee | Statement |
|:-:|-----------|-----------|
| G-1 | Origin fixity | The origin of sovereignty is always the invariant principles; this can never be reassigned. |
| G-2 | Downward-only flow | Authority is only ever derived downward; never upward or sideways. |
| G-3 | Execution non-authority | Execution never becomes a source of authority (S-IV). |
| G-4 | AI non-authority | Intelligence never becomes a source of authority (S-V). |
| G-5 | Organizational stewardship | Organizations are delegates, never origins (S-VI). |
| G-6 | Immutable protection | The exclusions and guarantees are amendable only in the direction that *strengthens* principle sovereignty, never weakens it. |

## 7. Relationship to the Ratified Corpus

- `AUTH-001` (Vision) is recognized as the human articulation of the seed intent that the invariant principles
  encode; unchanged.
- Constitution Articles XII/XIII (approval-by-exception; autonomous-agent governance) are recognized as
  concrete realizations of S-V; preserved and re-anchored to PRIN-001/PRIN-015.
- AD-0014 (Ω∞ deferral; no self-direction, no self-modification, no autonomous actuation) is recognized as a
  standing enforcement of S-V; preserved unchanged.

## 8. Scope Discipline (confirmations)

| Confirmation | Result |
|--------------|:------:|
| Sovereignty origin fixed to invariant principles; three exclusions declared non-waivable | ✅ |
| `AUTH-001..012`, `UCOS-CONST-001`, INV-1..13, `INV-CORE-*`, AD-0014 unchanged | ✅ |
| No enrollment; no version increment; append-only (INV-10) | ✅ |
| Article IX not released; no code/infrastructure; `UCOS-CONSTRUCTION-BLOCKED` unchanged | ✅ |

## Traceability
- **Chartered by:** `GD-0001`.
- **Anchors:** `PCAMG-0000` PRIN-001 (Human Sovereignty), PRIN-015 (Machine Alignment).
- **Preserves:** Constitution Art. XII/XIII, AD-0014, INV-1..13, `INV-CORE-001`.
- **Governed by:** AUTH-009 (approval), AUTH-012 (decision record).
- **Owner:** UCOS Authority Board.

**END GD-0002 · SOVEREIGNTY ORIGIN DOCTRINE · PROPOSED (NOT ENROLLED) · APPEND-ONLY · PENDING AUTHORITY BOARD REVIEW.**
