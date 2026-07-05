# SPEC — Repository Structure Specification

> **STATUS: CREATED — READY FOR AUTHORITY BOARD REVIEW**
> PROPOSED · NOT RATIFIED · NOT APPLIED · NOT IMPLEMENTATION AUTHORIZED
> DOES NOT MOVE / DELETE / RELOCATE ANY EXISTING FILE · DOES NOT SUPERSEDE `AUTH-001..012` / `UCOS-CONST-001` ·
> DOES NOT OVERRIDE AUTH-012 · DOES NOT RELEASE ARTICLE IX · REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `SPEC-REPOSITORY-STRUCTURE` |
| Name | Repository Structure Specification (PCAMG governance corpus layout) |
| Program | Constitutional Refoundation Program — **Specification Tier** |
| Classification | **PROPOSED — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **LAYOUT SPECIFICATION ONLY** — describes a target layout; moves/relocates/deletes nothing |
| Chartered by | `GD-0001`; governed by `PCAMG-1000` M-XI (traceable), INV-10 (append-only) |

> **No files moved.** Specifies the *target* on-disk layout for the PCAMG governance corpus. It relocates,
> renames, and deletes nothing; any reorganization is an append-only, Authority-Board-approved act.

---

## 1. Purpose

Specify the **repository structure** for the PCAMG governance corpus so that the doctrine, layers,
frameworks, specs, and registries are discoverable, layer-ordered, and traceable — while preserving every
existing artifact in place (INV-10; no relocation without a governed act).

## 2. Current Placement (unchanged)

```
architecture/pcamg/                         # foundation package (PCAMG-0001..0008 + INDEX) — PRESERVED
architecture/pcamg/refoundation/            # THIS corpus (GD-*, PCAMG-0000/1000..8000, SPEC-*, PROG-*, INDEX)
.claude/authority/                          # ratified Authority Layer (AUTH-001..012) — UNCHANGED
docs/constitution/                          # ratified Constitution (UCOS-CONST-001) — UNCHANGED
.claude/context/UCOS-ARTIFACT-REGISTRY.md   # CTX-REG-001 (append-only registration)
.claude/state/PROJECT-STATE.md              # PROJECT-STATE (append-only status)
```

## 3. Proposed Target Layout (on adoption; append-only reorganization)

```
governance/                                 # (proposed root for the enrolled PCAMG corpus)
├── doctrine/
│   ├── GD-0001-GOVERNANCE-DOCTRINE.md
│   └── GD-0002-SOVEREIGNTY-ORIGIN-DOCTRINE.md
├── layer-0-principles/
│   └── PCAMG-0000-INVARIANT-PRINCIPLES-REGISTRY.md
├── layer-1-meta-constitution/
│   └── PCAMG-1000-META-CONSTITUTION.md
├── layer-2-generation/
│   └── PCAMG-2000-GOVERNANCE-GENERATION-FRAMEWORK.md
├── layer-3-polycentric/
│   └── PCAMG-3000-POLYCENTRIC-GOVERNANCE-NETWORK.md
├── layer-4-federated-domains/
│   └── PCAMG-4000-FEDERATED-DOMAIN-GOVERNANCE.md
├── layer-7-execution/
│   └── PCAMG-5000-AUTONOMOUS-EXECUTION-FABRIC-CONSTITUTION.md
├── frameworks/
│   ├── PCAMG-6000-CONSTITUTIONAL-INTERPRETATION-FRAMEWORK.md
│   ├── PCAMG-7000-CONFLICT-RESOLUTION-FRAMEWORK.md
│   └── PCAMG-8000-LEGITIMACY-AND-CONSENT-FRAMEWORK.md
├── specifications/
│   ├── SPEC-AUTHORITY-INDEX-REFACTORING.md
│   ├── SPEC-AUTH-009-MIGRATION.md
│   ├── SPEC-GOVERNANCE-REGISTRIES.md
│   ├── SPEC-CONSTITUTIONAL-VALIDATION-RULES.md
│   ├── SPEC-GOVERNANCE-COMPILER-RULES.md
│   ├── SPEC-TRACEABILITY-FRAMEWORK.md
│   ├── SPEC-CONSTITUTIONAL-COMPLIANCE-FRAMEWORK.md
│   └── SPEC-REPOSITORY-STRUCTURE.md
├── registries/                             # instantiated only under an authorized construction phase
│   ├── REG-PRIN/  REG-META/  REG-GOV/  REG-CENTER/  REG-DOMAIN/
│   ├── REG-POLICY/ REG-CAP/  REG-CONSENT/
│   └── REG-AUDIT/ REG-DECISION/ REG-TRACE/
└── program/
    └── PROG-MIGRATION-AND-ADOPTION.md
```

## 4. Layout Rules

| # | Rule | Anchor |
|:-:|------|--------|
| L-1 | Layer-ordered directories mirror the PCAMG layer order (0→8). | `GD-0001` §4 |
| L-2 | One artifact = one file; permanent ID in the filename. | IP-05 traceability |
| L-3 | Registries under `registries/` are instantiated only by an authorized construction phase. | Article IX |
| L-4 | Reorganization is append-only + Authority-Board-approved; nothing is silently moved/deleted. | INV-10, AUTH-012 |
| L-5 | The foundation package (`architecture/pcamg/`) is preserved; not deleted or relocated. | INV-10 |
| L-6 | Every relocation records a supersession/redirect link so prior paths remain resolvable. | INV-10, `AUTH-010` |

## 5. Migration Note

Until the Authority Board approves the reorganization, the corpus **remains at
`architecture/pcamg/refoundation/`** (as generated). The target `governance/` layout in §3 is a *proposal*;
adoption executes it as an append-only, AUTH-012-recorded move with redirect links (L-6).

## 6. Scope Discipline (confirmations)

| Confirmation | Result |
|--------------|:------:|
| Target layout specified; no file moved/renamed/deleted | ✅ |
| Layer-ordered; one-artifact-one-file; registries construction-gated | ✅ |
| Foundation package preserved; reorganization append-only + AUTH-012 | ✅ |
| Article IX not released; ratified artifacts unchanged | ✅ |

## Traceability
- **Chartered by:** `GD-0001`; **governed by:** `PCAMG-1000` M-XI; INV-10.
- **Paired with:** `PROG-MIGRATION-AND-ADOPTION`, `SPEC-GOVERNANCE-REGISTRIES`.
- **Owner:** UCOS Authority Board.

**END SPEC-REPOSITORY-STRUCTURE · PROPOSED (NOT APPLIED) · APPEND-ONLY · PENDING AUTHORITY BOARD REVIEW.**
