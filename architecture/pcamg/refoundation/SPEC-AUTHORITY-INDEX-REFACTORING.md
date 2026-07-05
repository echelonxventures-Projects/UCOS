# SPEC — AUTHORITY-INDEX Refactoring Specification

> **STATUS: CREATED — READY FOR AUTHORITY BOARD REVIEW**
> PROPOSED · NOT RATIFIED · NOT APPLIED · NOT IMPLEMENTATION AUTHORIZED
> DOES NOT MODIFY `AUTH-INDEX-001` · DOES NOT SUPERSEDE `AUTH-001..012` / `UCOS-CONST-001` ·
> DOES NOT OVERRIDE AUTH-012 · DOES NOT RELEASE ARTICLE IX · REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `SPEC-AUTHORITY-INDEX-REFACTORING` |
| Name | AUTHORITY-INDEX Refactoring Specification |
| Program | Constitutional Refoundation Program — **Specification Tier** |
| Classification | **PROPOSED — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **REFACTORING SPECIFICATION ONLY** — describes an append-only, version-incremented edit to be executed by the Authority Board; performs no edit |
| Chartered by | `GD-0001`; governed by `PCAMG-1000` M-XII; conflict order per `PCAMG-7000` |
| Target (on adoption) | `.claude/authority/AUTHORITY-INDEX.md` (`AUTH-INDEX-001`) |

> **No edit performed.** This specification *describes* how `AUTH-INDEX-001` would be re-rooted under the
> PCAMG layer order **if** the Authority Board enrolls the corpus. It does not modify `AUTH-INDEX-001`, does
> not invert the hierarchy, and takes effect only via an AUTH-012 decision record + version increment.

---

## 1. Purpose

Specify the **append-only, non-inverting** refactoring of the canonical `AUTHORITY-INDEX` (`AUTH-INDEX-001`)
so that, on enrollment of `GD-0001`, the ratified authority hierarchy is **re-rooted** under the PCAMG layer
order without deleting, weakening, or inverting any existing tier.

## 2. Current State (unchanged until adoption)

`AUTH-INDEX-001` §1 (immutable authority hierarchy):
```
AUTHORITY → BOOTSTRAP → CONSTITUTION → CONTEXT → SKILLS → PROMPTS →
ARCHITECTURE → SPECIFICATIONS → IMPLEMENTATION → VALIDATION → CERTIFICATION
```
`AUTH-INDEX-001` §2 (conflict-resolution priority):
```
Authority > Constitution > Architecture > Specifications > Implementation > Validation > Certification
```

## 3. Proposed Re-Rooting (non-inverting)

The PCAMG layer order (`GD-0001` §4; `PCAMG-0008`) is layered **above** the ratified tiers; the ratified
tiers are preserved and mapped as follows:

| PCAMG Layer | Absorbs / maps ratified tier | Note |
|-------------|------------------------------|------|
| Layer 0 — Invariant Principles (`PCAMG-0000`) | (new root above AUTHORITY) | Sovereignty-bearing; supreme |
| Layer 1 — Meta-Constitution (`PCAMG-1000`) | AUTHORITY (`AUTH-001..012`) + CONSTITUTION | Ratified Authority Layer becomes derived-from-principles |
| Layer 2 — Governance Generation (`PCAMG-2000`) | (new) | Generation discipline over CONTEXT/SKILLS/PROMPTS |
| Layer 3 — Polycentric Network (`PCAMG-3000`) | (new) | Distributes authority previously centralized |
| Layer 4 — Federated Domain (`PCAMG-4000`) | CONSTITUTION (domain) | Domain constitutions |
| Layer 5 — Policies | SPECIFICATIONS | |
| Layer 6 — Capabilities | ARCHITECTURE (capability) | CAP-01..19 |
| Layer 7 — Execution (`PCAMG-5000`) | IMPLEMENTATION | PI-2..PI-11 fabrics |
| Layer 8 — Infrastructure | IMPLEMENTATION (platform) | |
| (cross) VALIDATION / CERTIFICATION | preserved as compliance gates | `SPEC-CONSTITUTIONAL-COMPLIANCE-FRAMEWORK` |

**Non-inversion guarantee.** No ratified tier is moved *below* a tier it currently outranks. The refactor only
adds higher roots (Layers 0–3) and re-labels the descent; the relative order of the existing tiers is
preserved (`GD-0001` D-7).

## 4. Refactor Operations (append-only; executed only by the Authority Board)

| # | Operation | Discipline |
|:-:|-----------|-----------|
| R-1 | Append a new §1A "PCAMG Layer Order (enrolled)" recording Layers 0–8 above the preserved §1. | Append-only; §1 preserved verbatim as historical/derived. |
| R-2 | Append a new §2A "PCAMG Conflict Order (enrolled)" recording the `PCAMG-7000` precedence. | §2 preserved; `PCAMG-7000` CR-8 keeps ratified order authoritative pre-enrollment. |
| R-3 | Add rows registering `GD-0001/0002`, `PCAMG-0000/1000..8000`, and the refoundation specs. | Version increment; supersession links (INV-10). |
| R-4 | Record the enrolling AUTH-012 decision reference and the new AUTHORITY-INDEX version. | AUTH-012 + AUTH-009 approval. |
| R-5 | Flag downstream artifacts for conformance review. | Governance review. |

## 5. Preconditions (before any operation)

- Authority Board Constitutional-Majority approval + AUTH-012 decision record.
- Authority-chain reconciliation complete (`REAL-C-05` / PHASE-21) so the enrollment binds to a clean ledger.
- Validation of the corpus by `SPEC-CONSTITUTIONAL-VALIDATION-RULES` (PASS).
- Confirmation that non-waivable S1/S3/S4 and Article IX gating are preserved by the new order.

## 6. Rollback

- The refactor is append-only; rollback is a further append recording supersession back to the prior
  AUTHORITY-INDEX version (INV-10). No content is deleted.

## 7. Scope Discipline (confirmations)

| Confirmation | Result |
|--------------|:------:|
| Specification only; `AUTH-INDEX-001` not modified | ✅ |
| Non-inverting re-rooting; ratified tier order preserved | ✅ |
| Append-only operations; version increment + AUTH-012 required | ✅ |
| Pre-enrollment ratified order remains authoritative (`PCAMG-7000` CR-8) | ✅ |
| Article IX not released; S1/S3/S4 preserved | ✅ |

## Traceability
- **Chartered by:** `GD-0001`; **governed by:** `PCAMG-1000` M-XII, `PCAMG-7000`.
- **Targets (on adoption):** `AUTH-INDEX-001`.
- **Paired with:** `SPEC-AUTH-009-MIGRATION`, `PROG-MIGRATION-AND-ADOPTION`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect).

**END SPEC-AUTHORITY-INDEX-REFACTORING · PROPOSED (NOT APPLIED) · APPEND-ONLY · PENDING AUTHORITY BOARD REVIEW.**
