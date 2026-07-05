# SPEC — AUTH-009 Migration Specification

> **STATUS: CREATED — READY FOR AUTHORITY BOARD REVIEW**
> PROPOSED · NOT RATIFIED · NOT APPLIED · NOT IMPLEMENTATION AUTHORIZED
> DOES NOT MODIFY `AUTH-009` · DOES NOT SUPERSEDE `AUTH-001..012` / `UCOS-CONST-001` ·
> DOES NOT OVERRIDE AUTH-012 · DOES NOT RELEASE ARTICLE IX · REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `SPEC-AUTH-009-MIGRATION` |
| Name | AUTH-009 Governance Canon Migration Specification |
| Program | Constitutional Refoundation Program — **Specification Tier** |
| Classification | **PROPOSED — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **MIGRATION SPECIFICATION ONLY** — migration-only (IP-14), backward-compatible (IP-15); performs no edit |
| Chartered by | `GD-0001`; governed by `PCAMG-1000` M-V/M-VIII |
| Target (on adoption) | `.claude/authority/AUTH-009-GOVERNANCE-CANON.md` (`AUTH-009` v1.0.0) |

> **No edit performed.** Specifies how `AUTH-009` (Governance Canon) migrates into the PCAMG polycentric model
> **if** enrolled. It preserves the Authority Board as terminal escalation, preserves approval-by-exception
> and the zone model, and takes effect only via AUTH-012 + version increment.

---

## 1. Purpose

Specify the **migration-only, backward-compatible** transition of the ratified Governance Canon (`AUTH-009`)
into the PCAMG polycentric governance model (`PCAMG-3000`/`PCAMG-4000`), such that every current AUTH-009
guarantee is preserved and re-expressed as principle-derived governance.

## 2. Preserved Guarantees (invariant across migration)

| AUTH-009 element | Migration treatment | Preserved |
|------------------|---------------------|:---------:|
| Authority & governance hierarchy (§6.1) | Re-rooted under PCAMG layers (`SPEC-AUTHORITY-INDEX-REFACTORING`); order preserved | ✅ |
| Conflict resolution — Authority Wins (§6.2) | Re-expressed by `PCAMG-7000` (principle-supreme; higher-derivation wins) | ✅ |
| Ownership model (§6.3) | Mapped to `PCAMG-3000` single-owner centers (PRIN-005) | ✅ |
| Approval-By-Exception (§6.4; IP-17) | Preserved as-is; realized per governance center; non-waivable set intact | ✅ |
| Autonomous-agent zones (§6.5; IP-16) | Preserved; re-anchored to PRIN-015 / `PCAMG-5000` E-II | ✅ |
| Change governance / immutability (§6.6) | Preserved; append-only (INV-10); AUTH-012 path retained | ✅ |
| Non-waivable S1/S3/S4 | Preserved; PRIN-011 / `PCAMG-5000` E-X | ✅ |
| Authority Board terminal escalation | Preserved; delegate of PRIN-001 (`GD-0002` S-VI); `PCAMG-3000` N-6 | ✅ |

## 3. Migration Mapping

| AUTH-009 concept | PCAMG target |
|------------------|--------------|
| The single Governance Canon | Governance Security/Meta center (`PGC-06` + Meta-Constitution `PCAMG-1000`) |
| Hierarchy §6.1 | PCAMG Layer order (Layers 0–8) |
| Conflict order §6.2 | `PCAMG-7000` deterministic precedence |
| Zones §6.5 | Execution constitution boundaries (`PCAMG-5000` E-II/E-VI) + control-plane policy |
| Approval catalog §6.4 | Legitimacy/consent + Approval-Required decision classes (`PCAMG-8000`, `PCAMG-3000` decision rights) |
| Gates (`GATE-*`) | Compliance framework operational stage (`SPEC-CONSTITUTIONAL-COMPLIANCE-FRAMEWORK`) |

## 4. Migration Operations (migration-only; executed only by the Authority Board)

| # | Operation | Discipline |
|:-:|-----------|-----------|
| M-1 | Append an AUTH-009 §12 "PCAMG Migration Mapping" cross-referencing the targets in §3. | Append-only; body preserved. |
| M-2 | Register AUTH-009 as the seed of governance center `PGC-06` + Meta-Constitution derivation. | Generation record (`PCAMG-2000`). |
| M-3 | Re-anchor IP-16/IP-17 to PRIN-015/PRIN-017-lineage without weakening. | Backward-compatible (IP-15). |
| M-4 | Record the enrolling AUTH-012 decision + AUTH-009 version increment (v1.0.0 → v1.1.0). | AUTH-012 + AUTH-009 approval. |
| M-5 | Coexistence window: AUTH-009 and PCAMG governance run N/N-1 until conformance verified. | No behavior change; dual-read. |

## 5. Backward Compatibility & Coexistence (IP-15)

- During the coexistence window, **AUTH-009 remains authoritative**; PCAMG governance is advisory until the
  window closes by a governed act. No decision changes outcome during coexistence (dual-read verification).
- Any divergence between AUTH-009 and PCAMG governance during coexistence is resolved by `PCAMG-7000` CR-8
  (ratified corpus prevails) and recorded as a reconciliation item.

## 6. Rollback

- Migration is append-only and migration-only; rollback re-points to the prior AUTH-009 version via a further
  append (INV-10). No content is deleted; the coexistence window bounds risk.

## 7. Scope Discipline (confirmations)

| Confirmation | Result |
|--------------|:------:|
| Specification only; `AUTH-009` not modified | ✅ |
| Every AUTH-009 guarantee preserved (Authority Board terminal; S1/S3/S4; zones; approval-by-exception) | ✅ |
| Migration-only (IP-14), backward-compatible (IP-15), coexistence window | ✅ |
| Append-only; version increment + AUTH-012 required | ✅ |
| Article IX not released; ratified artifacts unchanged | ✅ |

## Traceability
- **Chartered by:** `GD-0001`; **governed by:** `PCAMG-1000` M-V/M-VIII; **conflict order:** `PCAMG-7000`.
- **Targets (on adoption):** `AUTH-009`.
- **Paired with:** `SPEC-AUTHORITY-INDEX-REFACTORING`, `PROG-MIGRATION-AND-ADOPTION`.
- **Owner:** UCOS Authority Board.

**END SPEC-AUTH-009-MIGRATION · PROPOSED (NOT APPLIED) · MIGRATION-ONLY · APPEND-ONLY · PENDING AUTHORITY BOARD REVIEW.**
