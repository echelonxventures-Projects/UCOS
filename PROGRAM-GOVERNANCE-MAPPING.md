# PROGRAM GOVERNANCE MAPPING

**Artifact:** PROG-GOV-MAP-001
**Phase:** PHASE-P.1
**Status:** IMPLEMENTED

This document maps the Program Compiler to the UCOS constitutional and governance corpus, showing
that the compiler *enforces* rather than *bypasses* governance.

---

## 1. Authority subordination

The Program Registry (`state.json`) is explicitly subordinate to:

- **AUTH-001..012** — the Authority Layer (Vision → Decision Log).
- **UCOS-CONST-001** — the Constitution.
- **UCOS-ASR-NFR-001** — INV-1..13 (non-functional invariants).
- **AUTH-012 Decision Log** — AD-0001..0023.

Terminal authority: **Authority Board**. Non-waivable safety invariants: **S1, S3, S4**.
The compiler holds no override flag; any override is itself a governed Authority Board act recorded
in the registry, not a code path.

---

## 2. Constitutional lock (Article IX)

`state.json.constitutionalLock`:

- Article IX: **ACTIVE**; general construction **BLOCKED**.
- Scoped additive releases permitted: **AD-0016 … AD-0023** (substrate + fabrics PI-2..PI-9).
- Domain / service / business / experience / product / existential generation remains **LOCKED**.
- INV-14..20 **not enrolled** (AD-0014).

The compiler itself is **design/tooling only** — it reads the registry and writes governance
artifacts; it never emits or mutates fabric source. It thus operates entirely within the Article IX
lock. Work items whose constraints declare an un-issued release (e.g. PI-10 needs **AD-0024**) are
hard-blocked by the authorization engine.

---

## 3. Governance gate mapping

| Gate | Meaning | Where enforced |
|------|---------|----------------|
| `GATE-DOC-001` | Documentation gate | Work items requiring authored artifacts (contract authoring, governance). |
| `GATE-QUAL-001` | Quality gate | Fabric increments and operational activities (build/test green). |
| `GATE-SEC-001` | Security gate | Control/federation fabrics, provisioning, audit-trail activities (S1/S3/S4). |
| `GATE-REL-001` | Release gate | Certification issuance (ACT-12, REAL-C-01). |

Gates are declared per work item and surfaced in `next-work-item.json` / minimal-context so the
executing agent knows which gates its work must clear before evidence can reach VERIFIED.

---

## 4. Evidence-based completion (WS3) ↔ governance

The evidence ladder PENDING→SUBMITTED→VERIFIED→CERTIFIED encodes governance review depth:

- **SUBMITTED** — author asserts an artifact exists (self-attested).
- **VERIFIED** — independently checked; satisfies completion.
- **CERTIFIED** — ratified by the certification authority.

Because the compiler requires **≥ VERIFIED** for completion, self-attested-only items cannot be
counted done. This is exactly why **PI-8** and **PI-9** — whose ratifications (`EV-PI8-RAT`,
`EV-PI9-RAT`) are SUBMITTED pending **REAL-C-05** independent attestation — are held out of the
COMPLETE set and flagged as evidence inconsistencies. Governance principle *proposer ≠ attestor* is
mechanically enforced.

---

## 5. Governance closures (WS10)

| Closure | Scope | Current verdict | Blocking |
|---------|-------|-----------------|----------|
| REAL-C-03 | Operational evidence (G12-1/2/3, Operational Certification) | **NO_GO** | ACT-06..10, ACT-12 incomplete; 6 evidence PENDING |
| REAL-C-04 | Design-only fabric implementation (PI-10, PI-11) | **NO_GO** | PI-10/PI-11 incomplete; 8 evidence PENDING; AD-0024 not issued |
| REAL-C-05 | Independent attestation of PI-8/PI-9 + retroactive AD enrollment + R13/R14 ruling | **NO_GO** | REAL-C-05 itself incomplete; EV-REAL-C-05 SUBMITTED |

**Overall governance verdict: NO_GO** (worst-closure rule). This is the honest, correct verdict:
the program has real substrate + fabric progress but has not closed operational evidence, design-only
fabric construction, or independent attestation.

---

## 6. Append-only / migration-only (INV-10, IP-14/IP-15)

`status-sync.ts` enforces:

- **Legal status transitions** only (e.g. COMPLETE may reopen to IN_PROGRESS for a migration-only
  correction, then forward again).
- **Monotonic evidence** — a state may never regress (append-only ledger semantics).

Illegal transitions throw; the registry cannot be silently rewound.

---

## 7. Anti-deviation ↔ constitutional constraints (WS6)

`authorization.ts` refuses execution unless: item is registered, all dependencies COMPLETE,
required evidence declared, and no hard constitutional block matches. Hard blocks currently include
un-issued scoped releases (`requires AD-0024 (not yet issued)`, generic `not yet issued`). Example:
`authorize PI-10` → **REJECTED** (unmet deps PI-8/PI-9 + AD-0024 not issued).

---

## 8. Standing trusted-operation obligations

Carried as low-severity gaps so they are never lost across sessions: `GAP-N1-CAP` (CAP-01..14
quantitative attributes under Prompt 02), `GAP-PARTY-GLOSSARY` (canonical "Party" term under
Prompt 03), `GAP-SUITE-COUNT` (36 vs 40 suite-count re-measurement; 269 pass not in dispute).
