# PCAMG-8000 — Legitimacy & Consent Framework

> **STATUS: CREATED — READY FOR AUTHORITY BOARD REVIEW**
> PROPOSED · NOT RATIFIED · NOT CONSTITUTIONAL LAW · NOT IMPLEMENTATION AUTHORIZED
> DOES NOT SUPERSEDE `AUTH-001..012` / `UCOS-CONST-001` · DOES NOT MODIFY INV-1..13 / `INV-CORE-001` ·
> DOES NOT OVERRIDE AUTH-012 · DOES NOT RELEASE ARTICLE IX · REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `PCAMG-8000` |
| Name | Legitimacy & Consent Framework (why and when governance may bind a party) |
| Program | Constitutional Refoundation Program — **Cross-Layer** |
| Classification | **PROPOSED — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **FRAMEWORK DESIGN ONLY** — no code, no enrollment, no lock release |
| Chartered by | `GD-0001`; governed by `PCAMG-1000` M-IX |
| Anchors | PRIN-001/002/003/007/011; Constitution Art. V/XI/XII |

> **Enactment disclaimer.** Defines the legitimacy and consent conditions under which governance binds a
> party. It enacts no governance and binds no party.

---

## 1. Purpose

PCAMG-8000 defines **why** UCOS governance is legitimate and **when** it may bind a party. Governance derives
legitimacy from the invariant principles and from the informed, revocable consent of those it binds. It
codifies the consent lifecycle for rights-affecting action (PRIN-003), the anti-coercion guarantee (PRIN-007),
and human sovereignty/agency (PRIN-001/002) as binding conditions of legitimacy.

## 2. Scope

**In scope:** the legitimacy conditions, the consent lifecycle, the anti-coercion guarantee, and the
void-illegitimate-governance rule.

**Out of scope:** consent *implementation* (owned by the security/identity fabrics); enrollment; any code.

## 3. Legitimacy Conditions

Governance `G` is **legitimate** with respect to a party `P` iff all hold:

| # | Condition | Anchor |
|:-:|-----------|--------|
| L-1 | Principle-derived | `G` derives from the invariant principles via a verifiable chain (M-II; `SPEC-TRACEABILITY-FRAMEWORK`). |
| L-2 | Constitutionally conformant | `G` conforms to the Meta-Constitution and applicable domain constitution. |
| L-3 | Authority-valid | `G` is issued by an authority with verified, in-scope, non-absolute derivation (`PCAMG-3000` N-1..N-9). |
| L-4 | Consent-satisfied (if rights-affecting) | For any action affecting `P`'s rights, `P`'s informed, revocable consent is present (§4). |
| L-5 | Non-coercive | `G` does not coerce, manipulate, or entrap `P`; an exit/alternative exists (PRIN-007). |
| L-6 | Human-sovereign | `G` preserves human terminal authority and meaningful human agency (PRIN-001/002). |
| L-7 | Auditable | `G`'s legitimacy basis is recorded immutably (PRIN-006). |

**Void rule.** Governance that fails any legitimacy condition is **void** with respect to `P` and fails
closed (Meta-Constitution M-IX). Illegitimate governance binds no one.

## 4. Consent Lifecycle (rights-affecting action)

```
REQUEST   present scope, purpose, options, defaults, and reversal path (PRIN-002 agency; no dark patterns)
   │
   ▼
GRANT     party grants informed, scoped, time-bounded consent → immutable consent record
   │
   ▼
ENFORCE   deny-by-default absent a valid, in-scope, unexpired consent record (PRIN-003)
   │
   ▼
REVOKE    party may revoke at any time; revocation is honored prospectively and logged
   │
   ▼
EXPIRE    consent lapses at its time bound; renewal requires a fresh grant
```

- **Consent record (design):**

```yaml
consent_record:
  party: <party id>
  scope: <bounded purpose/action class>
  granted_at: <ts>
  expires_at: <ts>
  revocable: true            # invariant — never false
  basis: <informed | lawful basis ref>
  revoked_at: <ts | null>
  audit_ref: <append-only>
```

- **No implied consent** for rights-affecting operations; **revocability may never be removed** (PRIN-003).

## 5. Anti-Coercion Guarantee (PRIN-007)

- No dark patterns, forced choices, deceptive framing, or engineered lock-in that removes exit.
- Every rights-affecting decision surface offers a genuine alternative and a right of exit.
- Coerced consent is void; consent obtained under coercion confers no legitimacy (L-4/L-5 fail).

## 6. Human Sovereignty & Agency (PRIN-001/002)

- Terminal authority over `P`-affecting decisions is human (Authority Board delegate of PRIN-001;
  `GD-0002` S-VI). No machine holds terminal authority over a human (PRIN-015; AD-0014).
- Humans retain meaningful, informed, reversible control over decisions affecting them (PRIN-002); accessible
  by construction (`UCOS-EXP-STD-002`).

## 7. Scope Discipline (confirmations)

| Confirmation | Result |
|--------------|:------:|
| Legitimacy conditions L-1..L-7 + void-illegitimate rule defined | ✅ |
| Consent lifecycle (request/grant/enforce/revoke/expire); revocability invariant | ✅ |
| Anti-coercion guarantee; human sovereignty/agency preserved | ✅ |
| No consent implementation/code; append-only; Article IX not released | ✅ |
| Ratified artifacts, INV-1..13, `INV-CORE-*`, AD-0014 unchanged | ✅ |

## Traceability
- **Chartered by:** `GD-0001`; **governed by:** `PCAMG-1000` M-IX.
- **Anchors:** PRIN-001/002/003/007/011; Constitution Art. V/XI/XII; `UCOS-SEC-ARCH-001` authorization.
- **Owner:** UCOS Authority Board.

**END PCAMG-8000 · LEGITIMACY & CONSENT FRAMEWORK · PROPOSED (NOT ENROLLED) · APPEND-ONLY · PENDING AUTHORITY BOARD REVIEW.**
