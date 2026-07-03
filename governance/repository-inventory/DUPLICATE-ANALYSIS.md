# UCOS — Duplicate Analysis

| Field | Value |
|-------|-------|
| Artifact | **UCOS Duplicate Analysis** |
| Artifact ID | `URNP-DUP-001` |
| Program | UCOS Repository Normalization Program (URNP) v1.0 |
| Phase | **Phase 2 — Duplicate Detection** |
| Mode | **ANALYSIS ONLY — NO DELETIONS, NO RENAMES** |
| Status | GENERATED |
| Date | 2026-07-02 |
| Parent | `URNP-INV-001` (Repository Inventory) |

> **Governing rule.** For every duplicate: identify **one canonical owner**, record the
> **duplicate location(s)**, and give a **recommended action**. No file is deleted, renamed, or
> mutated. Recommended actions are advisory pointers (e.g., "annotate as superseded / add cross-ref"),
> to be executed only under a separate, explicitly authorized change.

---

## 1. Classification of "Duplicate"

| Class | Meaning |
|-------|---------|
| **TRUE-DUP** | Two artifacts assert authority over the **same concept** with overlapping/competing content. |
| **VERSIONED** | Later artifact **supersedes** an earlier one (lineage is legitimate; keep both, mark lineage). |
| **SNAPSHOT** | Point-in-time export/listing that overlaps live content (not a definitional conflict). |
| **LABEL-COLLISION** | Same identifier/section label reused for different content (namespace hygiene issue). |
| **DISTRIBUTED-DEF** | One concept defined in several places by design (needs single canonical anchor + references). |

---

## 2. Duplicate Concepts (definitional)

| # | Concept | Canonical Owner | Duplicate / Secondary Location(s) | Class | Recommended Action |
|---|---------|-----------------|-----------------------------------|-------|--------------------|
| D-01 | **Constitution** | `docs/constitution/**` + `.claude/authority/AUTH-002-CONSTITUTION.md` | `.claude/context/UCOS-CONSTITUTION.md` | VERSIONED | Context copy already marked SUPERSEDED — add explicit cross-ref header pointing to AUTH-002 as canonical; keep for lineage. No deletion. |
| D-02 | **Vision** | `.claude/authority/AUTH-001-VISION.md` | `.claude/context/UCOS-VISION.md` | VERSIONED | Context copy is the baseline seed; annotate as "superseded by AUTH-001 (canon)". Keep both. |
| D-03 | **Principles** | `.claude/authority/AUTH-003-PRINCIPLES.md` | `.claude/context/UCOS-PRINCIPLES.md` | VERSIONED | Same treatment as D-02: canon = AUTH-003; context = baseline seed. |
| D-04 | **Glossary / Terminology** | `.claude/context/UCOS-GLOSSARY.md` (CTX-GLOSS-001) governed by `AUTH-011-GLOSSARY-CANON.md` | Terminology scattered in domain/capability/data docs | DISTRIBUTED-DEF | Establish `knowledge/TERMINOLOGY-REGISTRY.md` (Phase 9) as the single reference index; source docs remain, registry points to them. |
| D-05 | **Domain model (DOM-001..028)** | `docs/domain-architecture/**` (`UCOS-DOM-ARCH-001`) | `.claude/context/UCOS-DOMAIN-CATALOG.md` (seed) | VERSIONED | Catalog is the bootstrap seed; architecture doc is canonical. Registry (Phase 6) references the architecture doc. |
| D-06 | **Capability model (CAP-01..19)** | `docs/capability-architecture/**` (`UCOS-CAP-ARCH-001`) | `.claude/context/UCOS-CAPABILITY-CATALOG.md` (seed) | VERSIONED | Same as D-05: catalog = seed, architecture = canon. |
| D-07 | **Artifact Registry** | `.claude/context/UCOS-ARTIFACT-REGISTRY.md` (CTX-REG-001) | `registry/ARTIFACT-REGISTRY.md` (URNP Phase 6 — *derived index*) | DISTRIBUTED-DEF | URNP registry is an **organizational index/view**, NOT a replacement. Phase 6 registry must declare CTX-REG-001 as authoritative and reference it. CTX-REG-001 is READ-ONLY. |
| D-08 | **Decision Log** | `.claude/authority/AUTH-012-DECISION-LOG.md` (AD-0001..0023) | `AUTHORITY-BOARD-DECISION-RECORD.md`; per-PI `AD-00xx-*` root files; `governance/DECISION-REGISTER.md` (Phase 8) | DISTRIBUTED-DEF | AUTH-012 is the canonical ledger (READ-ONLY). Root `AD-00xx` files are the **source authorization records** referenced by the ledger. Phase 8 register is a derived index citing AUTH-012 + source files. |

---

## 3. Duplicate Architectures / Fabric Definitions

| # | Concept | Canonical Owner | Secondary Location(s) | Class | Recommended Action |
|---|---------|-----------------|-----------------------|-------|--------------------|
| D-09 | **Memory Fabric (PI-9)** | `architecture/memory/**` (design) + `packages/platform-runtime/src/control/memory/**` (impl) | ~30 root `MEM-*` reports (IMP/VAL/SEC/AUD/RAT/READY/TEST) | DISTRIBUTED-DEF | Architecture = design authority; code = realization authority; `MEM-*` are **evidence/report artifacts** (not competing definitions). Register lineage in DEPENDENCY-MAP. No consolidation of reports. |
| D-10 | **Ontology Fabric (PI-8)** | `architecture/ontology/**` + `src/control/ontology/**` | ~20 root `ONTO-*` reports | DISTRIBUTED-DEF | Same pattern as D-09. |
| D-11 | **Knowledge Fabric (PI-7)** | `architecture/**` + `src/control/knowledge/**` | root `PI7-*` reports | DISTRIBUTED-DEF | Same pattern. |
| D-12 | **Federation Fabric (PI-5)** | `architecture/federation/**` + `src/control/federation/**` | root `PI5-*` reports; `services/platform/registry/federation-model` | DISTRIBUTED-DEF | Registry federation model realizes the federation architecture; mark linkage. |
| D-13 | **Evolution Fabric (PI-6)** | `architecture/autonomy/**` + `src/control/evolution/**` | root `PI6-*` reports | DISTRIBUTED-DEF | Same pattern. |
| D-14 | **Intelligence Fabric (PI-10)** | `architecture/intelligence/**` | root `INT-*`, `INTEL-001`, `IP-011`, `B04-A..D-INTELLIGENCE-*` | DISTRIBUTED-DEF | Multiple program/report streams for one fabric; anchor to `architecture/intelligence` and list programs in DEPENDENCY-MAP. Design-only (not implemented). |
| D-15 | **Simulation Fabric (PI-11)** | `architecture/simulation/**` (AD-0022 conditional) | `AD-0022-PI11-SIMULATION-*` | VERSIONED | Design-only; authorization conditional. No duplicate content — keep. |
| D-16 | **Universal primitives (Audit/Authority/Lifecycle)** | `AUDIT-UNIV-001`, `AUTH-UNIV-001`, `LIFE-UNIV-001` | Overlap with `architecture/governance/**` and per-fabric audit modules | DISTRIBUTED-DEF | These assert *cross-cutting* primitives; ensure each references the owning domain (Audit→DOM-021/023, Authority→Governance). |

---

## 4. Duplicate Services / APIs / Events / Schemas

| # | Concept | Canonical Owner | Secondary Location(s) | Class | Recommended Action |
|---|---------|-----------------|-----------------------|-------|--------------------|
| D-17 | **Configuration & Metadata API (SVC-018)** | `UCOS-API-CONTRACT-018` (contract catalog) | `services/platform/config-metadata/api/api-018-realization.yaml` | VERSIONED | YAML is the **realization** of the contract, not a duplicate definition. Register as realizes→contract. |
| D-18 | **Registry API (SVC-027)** | `UCOS-API-CONTRACT-027` (contract catalog) | `services/platform/registry/api/api-027-realization.yaml` | VERSIONED | Same as D-17. |
| D-19 | **Operational Proof events** | `architecture/proof/**` + `UCOS-EVT-CONTRACT-*` | `services/platform/operational-proof/opf-events.yaml` | VERSIONED | YAML realizes event contracts; annotate linkage. |
| D-20 | **Event catalog (PEV-001..073) vs Event contracts (EVT-CONTRACT-001..027)** | `UCOS-PEA-003` platform event architecture (`PEV-001..073`) | `specifications/contracts` (`UCOS-EVT-CONTRACT-001..027`) | DISTRIBUTED-DEF | Two legitimate layers: platform events (73) vs published contract sets (27). Contract catalog already declares `PEV` linkage. Keep; ensure EVENT-REGISTRY records both layers and the mapping. |
| D-21 | **SECURITY registered twice in CTX-REG** | `CTX-REG-001` (read-only) | Two SECURITY section entries within CTX-REG-001 | LABEL-COLLISION | Do NOT edit CTX-REG-001. Record the observation in GAP-ANALYSIS as a registry-hygiene item for the registry owner. |
| D-22 | **Migration `V001` filenames repeated per service** | each service owns its own `V001` | `config-metadata/…/V001`, `operational-proof/…/V001`, `registry/…/V001` | (not a dup) | Same version label in **different service scopes** is correct. No action; note scoping convention in SCHEMA-REGISTRY. |

---

## 5. Duplicate Documents / Plans / Reports

| # | Concept | Canonical Owner | Secondary Location(s) | Class | Recommended Action |
|---|---------|-----------------|-----------------------|-------|--------------------|
| D-23 | **Repository file listings** | (live filesystem) | `all-files.txt`, `markdown-files.txt` | SNAPSHOT | Point-in-time snapshots; likely stale vs current 990-file count. Mark as dated snapshots; regenerate on demand rather than trust. No deletion. |
| D-24 | **Registry / State proposals (Phase 9.0C series)** | Final adopted state in CTX-REG-001 / PROJECT-STATE | `PHASE-9.0C-FINAL-{REGISTRY,STATE}-PROPOSAL`, `9.0C.2/.3/.4` proposals | VERSIONED | Proposal chain superseded by the adopted final proposal + `.5` completion reports. Mark superseded proposals with pointer to the adopted version. |
| D-25 | **Governance release document set** | `UCOS-GOVERNANCE-RELEASE-MANIFEST.md` | `-CERTIFICATION`, `-EXECUTION-RECORD`, `-FINALIZATION`, `-NOTES`, `PHASE-9.5C-*` | DISTRIBUTED-DEF | Distinct facets of one release (manifest/cert/record/notes) — not duplicates. Manifest is the index; cross-link the set. |
| D-26 | **Construction readiness** | `CONST-READY-002-FINAL-CONSTRUCTION-READINESS-DETERMINATION.md` | `CONST-READY-001`, `T01..T03`, `REAL-H-07` | VERSIONED | 002 supersedes 001 (final determination). Mark lineage. |
| D-27 | **Ledger reconciliations** | `REAL-M-03-LEDGER-AND-PROJECT-STATE-RECONCILIATION-REPORT.md` (canonical current state) | `AUTH-REST-002-LEDGER-RECONCILIATION`, `PHASE-10.6-LEDGER-RECONCILIATION`, `REG-VAL-002/003` | DISTRIBUTED-DEF | REAL-M-03 holds the canonical reconciled state; others are inputs/checks. Cite REAL-M-03 as the reconciliation of record. |
| D-28 | **PI-10 authorization** | `INT-AUTH-004-PI10-REAUTH-DETERMINATION.md` | `INT-AUTH-001..003`, `INT-AUTH-REV-001..004`, `INT-AUTH-001-PI10-AUTHORIZATION-RECOMMENDATION` | VERSIONED | Determination (004) supersedes recommendation/review inputs. Mark lineage; determination is authoritative. |
| D-29 | **Memory ratification (multiple RAT/AUD/SEC/VAL reproductions)** | `MEM-RAT-002-MEMORY-RATIFICATION-DETERMINATION.md` | `MEM-RAT-001/003`, `MEM-RAT-{AUD,SEC,VAL}-001..003` | VERSIONED/DISTRIBUTED | Determination (RAT-002) is authoritative; -001/-003 and reproduction sets are re-run evidence. Cite determination; keep evidence chain. |

---

## 6. Label / Identifier Collisions (namespace hygiene)

| # | Collision | Location | Class | Recommended Action |
|---|-----------|----------|-------|--------------------|
| L-01 | Section labels `§0S` / `§0T` / `§0Y` reused | `.claude/state/PROJECT-STATE.md` | LABEL-COLLISION | PROJECT-STATE is READ-ONLY under URNP. Record for the state-ledger owner as a section-numbering hygiene item; do not edit. |
| L-02 | `AD-0021` referenced as both PI-8 authorization file and "contested/reserved" in ledger | `AD-0021-PI8-ONTOLOGY-*` vs AUTH-012 note | LABEL-COLLISION | Clarify in DECISION-REGISTER (Phase 8): record AD-0021 status exactly as AUTH-012 states; do not reassign the ID. |
| L-03 | `B02`, `B03`, `B04` prefixes used for two different program lines each (e.g., `B02-OPF-*` vs `B02-UCOS-MCF-*`) | repository root | LABEL-COLLISION | Note dual usage in ARTIFACT-REGISTRY; recommend suffix disambiguation for future artifacts only (no rename now). |
| L-04 | `INT-AUTH-001` used for two files (`-PI10-AUTHORIZATION-RECOMMENDATION` and `-PI10-REAUTH-ONTOLOGY-MEMORY`) | repository root | LABEL-COLLISION | Record; treat the REAUTH determination chain (`INT-AUTH-004`) as authoritative. |

---

## 7. Summary

| Metric | Value |
|--------|------:|
| Definitional duplicate concepts (D-01..D-08) | 8 |
| Architecture/fabric distributed definitions (D-09..D-16) | 8 |
| Service/API/event/schema (D-17..D-22) | 6 |
| Document/plan/report (D-23..D-29) | 7 |
| Label/identifier collisions (L-01..L-04) | 4 |
| **Total findings** | **33** |
| TRUE-DUP (competing authority requiring resolution) | **0** |
| VERSIONED (legitimate lineage) | 12 |
| DISTRIBUTED-DEF (needs single anchor + references) | 12 |
| SNAPSHOT | 1 |
| LABEL-COLLISION | 4 |

**Key finding:** There are **no TRUE-DUP conflicts** where two artifacts compete for authority over
the same concept with divergent content. All findings are either legitimate version lineage,
design→realization pairs, distributed definitions needing a single canonical anchor, or namespace
hygiene issues. This confirms the repository is **consolidation-ready** without any deletion.

## 8. Traceability
- **Parent:** `URNP-INV-001`. **Feeds:** `GAP-ANALYSIS.md` (L-01, D-21 → registry hygiene gaps), `CANONICAL-OWNERSHIP.md` (Phase 5 anchors), Phase 6 registries.
- **References (read-only):** `CTX-REG-001`, `PROJECT-STATE.md`, `AUTH-012-DECISION-LOG.md`, `REAL-M-03`.
- **Constraint honored:** NO DELETIONS. NO RENAMES. Recommended actions are advisory only.

**END `URNP-DUP-001` — Duplicate Analysis (33 findings; 0 true conflicts; no mutation).**
