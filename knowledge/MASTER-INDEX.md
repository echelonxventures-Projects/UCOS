# UCOS — Master Index

| Field | Value |
|-------|-------|
| Artifact | **UCOS Master Index** |
| Artifact ID | `URNP-IDX-001` |
| Program | UCOS Repository Normalization Program (URNP) v1.0 |
| Phase | **Phase 6 — Master Registries** |
| Mode | ANALYSIS & ORGANIZATION ONLY — derived index; does not replace CTX-REG-001 |
| Status | GENERATED |
| Date | 2026-07-02 |

> **Purpose.** Single navigable index across every registered artifact class. This is a **derived
> organizational view**; the authoritative artifact registry remains `CTX-REG-001`
> (`.claude/context/UCOS-ARTIFACT-REGISTRY.md`, READ-ONLY). Each class below is materialized in a
> dedicated registry under `registry/`.

---

## 1. Registry Index

| Registry | File | Entities indexed |
|----------|------|------------------|
| Artifact Registry | `registry/ARTIFACT-REGISTRY.md` | All artifact classes (roll-up) |
| Domain Registry | `registry/DOMAIN-REGISTRY.md` | DOM-001..028 + 14 fabric domains |
| Service Registry | `registry/SERVICE-REGISTRY.md` | SVC-001..028, PRS-001..073, runtime services |
| API Registry | `registry/API-REGISTRY.md` | API-CONTRACT-001..030 |
| Event Registry | `registry/EVENT-REGISTRY.md` | EVT-CONTRACT-001..027, PEV-001..073 |
| Entity Registry | `registry/ENTITY-REGISTRY.md` | DATA-CONTRACT-001..028, PDE/LDO sets |
| Component Registry | `registry/COMPONENT-REGISTRY.md` | `platform-runtime` control/runtime modules |

## 2. Cross-Class Totals

| Class | Count | Authoritative source |
|-------|------:|----------------------|
| Business domains (DOM) | 28 | `UCOS-DOM-ARCH-001` |
| Platform fabric domains | 14 | `architecture/**`, `AD-0016..0023` |
| Capabilities (CAP) | 19 | `UCOS-CAP-ARCH-001` |
| Services (SVC) | 28 | `UCOS-CONTRACT-CAT-001` |
| Platform runtime services (PRS) | 73 | `UCOS-PEA-003` / platform arch |
| Platform domains (PE) | 17 | platform architecture |
| API contracts | 30 | contract catalog §A |
| Event contracts | 27 | contract catalog §B |
| Platform events (PEV) | 73 | `UCOS-PEA-003` |
| Event domains (PED) | 17 | `UCOS-PEA-003` |
| Data contracts | 28 | contract catalog §C |
| Information/Conceptual/Logical/Physical data classes | 17 each | data architecture |
| Logical/Physical data objects (LDO/PDE) | 73 each | `UCOS-LDATA/PDATA-ARCH-001` |
| Metadata classes (MC) | 13 | `UCOS-INF-ARCH-001` |
| Experience surfaces (S) | 14 | `UCOS-EXP-ARCH-001` |
| Experience change requests (EXP-CR) | 21 | `UCOS-EXP-ARCH-001` |
| ADRs | 30 | `architecture/*/adr/**` |
| Decisions (AD) | 23 | `AUTH-012-DECISION-LOG` |
| Governance gates | 5 | `.claude/governance/**` |
| Prompts (generators) | 12 | `.claude/prompts/**` |
| Skills | 14 | `.claude/skills/**` |
| Authority canons (AUTH) | 12 | `.claude/authority/**` |
| Repository files (total) | 990 | filesystem |

## 3. Governance Reference (read-only ledgers)

| Ledger | Path | Role |
|--------|------|------|
| Artifact Registry | `.claude/context/UCOS-ARTIFACT-REGISTRY.md` (CTX-REG-001) | Authoritative artifact registry |
| Decision Log | `.claude/authority/AUTH-012-DECISION-LOG.md` | Authoritative decisions AD-0001..0023 |
| Project State | `.claude/state/PROJECT-STATE.md` (STATE-001) | Authoritative program state |

## 4. Traceability
- **Parent:** `URNP-INV-001`, `URNP-OWN-001`. **Children:** the 7 `registry/*.md`.
- **Owner:** URNP (subordinate to Platform Governance). CTX-REG-001 remains authoritative.

**END `URNP-IDX-001` — Master Index.**
