# UCOS — Repository Inventory

| Field | Value |
|-------|-------|
| Artifact | **UCOS Repository Inventory** |
| Artifact ID | `URNP-INV-001` |
| Program | UCOS Repository Normalization Program (URNP) v1.0 |
| Phase | **Phase 1 — Repository Inventory** |
| Mode | **ANALYSIS & ORGANIZATION ONLY** — no deletions, no renames, no code mutation |
| Status | GENERATED |
| Date | 2026-07-02 |
| Source of Truth | The existing repository (this inventory describes it; it does not replace it) |

> **Scope note.** This inventory classifies discovered artifacts by category and records
> Path / Type / Domain / Owner / Status / Dependencies / Relationships. It is derived entirely
> from existing repository contents. It does **not** modify `PROJECT-STATE.md`, `CTX-REG-001`
> (`.claude/context/UCOS-ARTIFACT-REGISTRY.md`), or any governance ledger.

---

## 1. Inventory Totals

| Metric | Count |
|--------|------:|
| Total files (excl. `.git`) | **990** |
| Markdown files (all) | 618 |
| Markdown files (repository root) | 264 |
| TypeScript files (`.ts`) | 321 |
| YAML files (`.yaml`) | 32 |
| SQL files (`.sql`) | 3 |
| JSON files (`.json`) | 8 |

### Files by top-level location

| Location | Files | Primary content |
|----------|------:|-----------------|
| `packages/` | 336 | Real TypeScript implementation (`platform-runtime`) + `contracts-sdk` (README) |
| repository root (`*.md`) | 264 | Governance decisions, program packages, phase reports, ratification records |
| `architecture/` | 189 | Enterprise / domain / platform / fabric architecture + ADRs |
| `docs/` | 75 | Constitution, EA, domain, data, capability, information architecture docs |
| `.claude/` | 58 | Authority canon, context catalogs, governance gates, prompts, skills, state |
| `infra/` | 25 | Delivery (gitops), environments, networking, persistence, runtime (YAML/TF) |
| `services/` | 25 | Platform services (config-metadata, operational-proof, registry) — YAML/SQL |
| `security/` | 8 | Bootstrap mesh, OPA, secrets |
| `archive/` | 2 | Governance-readiness archival material |
| `specifications/` | 2 | Contract catalog |
| `apps/` | 1 | README only (frontend intentionally empty) |
| `quality/` | 1 | Quality report/README |
| `release/` | 1 | Release report/README |

---

## 2. Classification Legend

- **Type**: Governance-Decision · Program/Package · Phase-Report · Ratification/Certification ·
  Architecture-Doc · ADR · Context-Catalog · Authority-Canon · Gate · Prompt · Skill ·
  Implementation-Code · Service-Contract (YAML) · Schema/Migration (SQL) · Infra (YAML/TF) ·
  Registry-Ledger · State-Ledger · Snapshot.
- **Owner**: the accountable body/role detectable from the artifact header (Authority Board,
  Platform Governance, Domain Architecture, Service & API Contract Architecture, Data Architecture,
  Security Architecture, Implementation Factory, etc.). `UNASSIGNED` where not detectable (see GAP-ANALYSIS).
- **Status**: as stated in-artifact (RATIFIED · CERTIFIED · CONDITIONALLY-CERTIFIED · GENERATED ·
  CREATED · PROPOSED · SUPERSEDED · BASELINE · ACTIVE-LOCK · REPORT). `UNKNOWN` where not stated.

---

## 3. Category A — Governance & Authority

| Path | Type | Domain | Owner | Status | Dependencies / Relationships |
|------|------|--------|-------|--------|------------------------------|
| `.claude/authority/AUTH-001-VISION.md` | Authority-Canon | Governance | Authority Board | RATIFIED | Root of authority chain; parent of AUTH-002 |
| `.claude/authority/AUTH-002-CONSTITUTION.md` | Authority-Canon | Governance | Authority Board | RATIFIED | Supreme rule; governs all artifacts |
| `.claude/authority/AUTH-003-PRINCIPLES.md` | Authority-Canon | Governance | Authority Board | RATIFIED | Subordinate to AUTH-002 |
| `.claude/authority/AUTH-004-ARCHITECTURE-CANON.md` | Authority-Canon | Architecture | Authority Board | RATIFIED | Governs `architecture/**` |
| `.claude/authority/AUTH-005-DOMAIN-CANON.md` | Authority-Canon | Domain | Authority Board | RATIFIED | Governs domain model (DOM-001..028) |
| `.claude/authority/AUTH-006-CAPABILITY-CANON.md` | Authority-Canon | Governance | Authority Board | RATIFIED | Governs capability model (CAP-01..19) |
| `.claude/authority/AUTH-007-DATA-CANON.md` | Authority-Canon | Data | Authority Board | RATIFIED | Governs data architecture (IC/CD/LD/PD) |
| `.claude/authority/AUTH-008-SECURITY-CANON.md` | Authority-Canon | Security | Authority Board | RATIFIED | Governs `security/**`, Prompt 09 |
| `.claude/authority/AUTH-009-GOVERNANCE-CANON.md` | Authority-Canon | Governance | Authority Board | RATIFIED | Governs gates & governance zones |
| `.claude/authority/AUTH-010-TRACEABILITY-CANON.md` | Authority-Canon | Governance | Authority Board | RATIFIED | Governs RTM / traceability model |
| `.claude/authority/AUTH-011-GLOSSARY-CANON.md` | Authority-Canon | Knowledge | Authority Board | RATIFIED | Governs terminology (CTX-GLOSS-001) |
| `.claude/authority/AUTH-012-DECISION-LOG.md` | Authority-Canon / **Ledger** | Governance | Authority Board | RATIFIED (v1.0.13) | Canonical Decision Log AD-0001..0023 — **READ-ONLY ledger** |
| `.claude/authority/AUTHORITY-INDEX.md` | Authority-Canon | Governance | Authority Board | RATIFIED | Index of AUTH-001..012 |
| `.claude/authority/AUTHORITY-{COMPLETION,COVERAGE,RATIFICATION}-REPORT.md` | Report | Governance | Authority Board | REPORT | Evidence for authority canon |
| `.claude/governance/{completion,documentation,quality,release,security}-*.md` (5 gates) | Gate | Governance | Platform Governance | ACTIVE | Enforce completion/doc/quality/release/security gates |
| `AUTHORITY-BOARD-DECISION-RECORD.md` | Governance-Decision | Governance | Authority Board | RATIFIED | Board decisions; feeds DECISION-REGISTER |
| `AUTHORITY-BOARD-RATIFICATION-PACKAGE.md` | Program/Package | Governance | Authority Board | RATIFIED | Ratification bundle |
| `AUTH-012-FOUNDATION-PERMANENCE-AMENDMENT.md` | Governance-Decision | Governance | Authority Board | RATIFIED | Amends decision log |
| `AUTH-CONST-001-CONSTRUCTION-AUTHORIZATION-PROGRAM.md` | Program/Package | Governance | Authority Board | RATIFIED | Construction authorization |
| `AUTH-REST-001..004-*.md` | Governance-Decision | Governance | Authority Board | RATIFIED | Authority chain restoration, ledger reconciliation, conflict resolution, final state |
| `AUTH-UNIV-001-UNIVERSAL-AUTHORITY-FABRIC.md` | Architecture-Doc | Governance | Authority Board | GENERATED | Universal authority fabric |
| `GOV-REC-001-GOVERNANCE-RECONCILIATION.md` | Report | Governance | Platform Governance | REPORT | Governance reconciliation |
| `UCOS-GOVERNANCE-BASELINE-1.0.md` | Governance-Decision | Governance | Platform Governance | BASELINE | Governance baseline v1.0 |
| `UCOS-GOVERNANCE-FREEZE-RECORD.md` | Governance-Decision | Governance | Platform Governance | RATIFIED | Governance freeze |
| `UCOS-GOVERNANCE-PROGRAM-CLOSURE.md` | Report | Governance | Platform Governance | REPORT | Program closure |
| `UCOS-GOVERNANCE-RELEASE-{CERTIFICATION,EXECUTION-RECORD,FINALIZATION,MANIFEST,NOTES}.md` | Ratification/Report | Governance | Platform Governance | CERTIFIED/REPORT | Governance release set |
| `PHASE-9.5C-GOVERNANCE-RELEASE-FINALIZATION-REPORT.md` | Phase-Report | Governance | Platform Governance | REPORT | Release finalization |
| `REG-VAL-001..003-*.md` | Report | Registry/Governance | Platform Governance | REPORT | Registry / decision-log / state-ledger integrity |
| `REG-ABS-001-REGISTRY-ABSOLUTISM-REVIEW.md` | Report | Registry | Platform Governance | REPORT | Registry absolutism review |
| `PHASE-21-CONSTITUTIONAL-RECONCILIATION-REPORT.md` | Phase-Report | Governance | Authority Board | REPORT | Constitutional reconciliation |

> Governance ledgers (`AUTH-012-DECISION-LOG.md`, `.claude/state/PROJECT-STATE.md`,
> `.claude/context/UCOS-ARTIFACT-REGISTRY.md`) are **read-only** under URNP constraints.

---

## 4. Category B — Strategy, Vision & Context

| Path | Type | Domain | Owner | Status | Dependencies / Relationships |
|------|------|--------|-------|--------|------------------------------|
| `.claude/context/UCOS-VISION.md` | Context-Catalog | Governance | Authority Board | BASELINE | Refined by principles/domain/capability |
| `.claude/context/UCOS-PRINCIPLES.md` | Context-Catalog | Governance | Authority Board | BASELINE | Refines vision |
| `.claude/context/UCOS-CONSTITUTION.md` | Context-Catalog | Governance | Authority Board | **SUPERSEDED** | Superseded by `docs/constitution/` + AUTH-002 (see DUPLICATE-ANALYSIS) |
| `.claude/context/UCOS-DOMAIN-CATALOG.md` | Context-Catalog | Domain | Domain Architecture | BASELINE | Seeds DOM-001..028 |
| `.claude/context/UCOS-CAPABILITY-CATALOG.md` | Context-Catalog | Governance | Capability Architecture | BASELINE | Seeds CAP-01..19 |
| `.claude/context/UCOS-GLOSSARY.md` | Context-Catalog | Knowledge | Authority Board | BASELINE (CTX-GLOSS-001) | Seeds TERMINOLOGY-REGISTRY |
| `.claude/context/UCOS-TRACEABILITY-MODEL.md` | Context-Catalog | Governance | Platform Governance | BASELINE | Seeds RTM |
| `.claude/context/UCOS-ARCHITECTURE-BASELINE.md` | Context-Catalog | Architecture | Enterprise Architecture | BASELINE | Architecture baseline |
| `.claude/context/UCOS-ARTIFACT-REGISTRY.md` | **Registry-Ledger (CTX-REG-001)** | Governance | Platform Governance | ACTIVE | Master artifact registry — **READ-ONLY** |
| `.claude/state/PROJECT-STATE.md` | **State-Ledger (STATE-001)** | Governance | Platform Governance | ACTIVE | Live program state — **READ-ONLY** |
| `.claude/UCOS-MASTER-BOOTSTRAP.md` | Program/Package | Governance | Authority Board | BASELINE | Bootstrap master |
| `BOOTSTRAP-COMPLETION-REPORT.md` | Report | Governance | Authority Board | REPORT | Bootstrap completion |
| `BEST-001-THE-BEST-PLATFORM-CHALLENGE-REPORT.md` | Report | Strategy | Authority Board | REPORT | Strategic challenge |
| `.claude/prompts/01..12-*.md` (12) | Prompt | Governance | Authority Board | ACTIVE | Governed generators (constitution → certification) |
| `.claude/skills/*.md` (14) | Skill | Governance | Authority Board | ACTIVE | Reusable architectural competencies |

---

## 5. Category C — Architecture (`architecture/`, `docs/`)

| Path | Type | Domain | Owner | Status | Dependencies / Relationships |
|------|------|--------|-------|--------|------------------------------|
| `architecture/platform/**` (+ `adr/` 8 ADRs, `certification/`, `governance/`, `ratification/`) | Architecture-Doc / ADR | Platform | Platform Architecture | RATIFIED/GENERATED | Platform substrate; PE-01..17, PRS-001..073 |
| `architecture/services/**` (+ `adr/` 7 ADRs) | Architecture-Doc / ADR | Registry/Services | Service & API Contract Architecture | RATIFIED | `UCOS-SVC-ARCH-001`; parent of contract catalog |
| `architecture/security/**` (+ `adr/` 8 ADRs) | Architecture-Doc / ADR | Security | Security Architecture | RATIFIED | Prompt 09 outputs |
| `architecture/experience/**` (+ `adr/` 7 ADRs) | Architecture-Doc / ADR | Experience | Experience Architecture | RATIFIED | `UCOS-EXP-ARCH-001`, EXP-CR-001..021 |
| `architecture/governance/**` | Architecture-Doc | Governance | Platform Governance | RATIFIED | Governance architecture |
| `architecture/memory/**` | Architecture-Doc | Memory | Platform Architecture | RATIFIED | PI-9 Memory Fabric design |
| `architecture/ontology/**` | Architecture-Doc | Ontology | Platform Architecture | RATIFIED | PI-8 Ontology Fabric design |
| `architecture/federation/**` | Architecture-Doc | Federation | Platform Architecture | RATIFIED | PI-5 Federation Fabric design |
| `architecture/intelligence/**` | Architecture-Doc | Intelligence | Platform Architecture | GENERATED | PI-10 Intelligence Fabric design |
| `architecture/proof/**` | Architecture-Doc | Proof | Platform Architecture | RATIFIED | Operational Proof Fabric design |
| `architecture/autonomy/**` | Architecture-Doc | Evolution | Platform Architecture | GENERATED | PI-6 Evolution/autonomy |
| `architecture/economic/**` | Architecture-Doc | Economy | Platform Architecture | DESIGN-ONLY | Economy fabric (not implemented) |
| `architecture/civilization/**` | Architecture-Doc | Civilization | Platform Architecture | DESIGN-ONLY | Civilization fabric (not implemented) |
| `architecture/ecosystem/**` | Architecture-Doc | Federation | Platform Architecture | GENERATED | Ecosystem model |
| `architecture/existential/**` | Architecture-Doc | Governance | Authority Board | GENERATED | Existential invariants (INV-14..20 deferred) |
| `architecture/simulation/**` | Architecture-Doc | Simulation | Platform Architecture | DESIGN-ONLY (AD-0022 conditional) | PI-11 Simulation Fabric design |
| `architecture/programs/**` | Program/Package | Governance | Platform Governance | GENERATED | Program-level architecture |
| `docs/constitution/**` | Architecture-Doc | Governance | Authority Board | **CANONICAL** | Canonical constitution (see DUPLICATE-ANALYSIS) |
| `docs/enterprise-architecture/**` | Architecture-Doc | Architecture | Enterprise Architecture | RATIFIED | EA reference |
| `docs/domain-architecture/**` | Architecture-Doc | Domain | Domain Architecture | RATIFIED | `UCOS-DOM-ARCH-001`; DOM-001..028 |
| `docs/capability-architecture/**` | Architecture-Doc | Governance | Capability Architecture | RATIFIED | `UCOS-CAP-ARCH-001`; CAP-01..19 |
| `docs/data-architecture/**` | Architecture-Doc | Data | Data Architecture | RATIFIED | IC/CD/LD/PD chain; `UCOS-PDATA-ARCH-001` |
| `docs/information-architecture/**` | Architecture-Doc | Data | Data Architecture | RATIFIED | `UCOS-INF-ARCH-001`; MC-01..13 |
| `docs/governance/**` | Architecture-Doc | Governance | Platform Governance | RATIFIED | Governance docs |
| `docs/implementation/**` | Architecture-Doc | Operations | Implementation Factory | GENERATED | Implementation guidance |
| `docs/execution/**` | Architecture-Doc | Operations | Platform Governance | GENERATED | Execution guidance |

---

## 6. Category D — Programs, Packages & Phase Reports (repository root)

> ~264 root markdown files. Grouped by prefix family; each family is a program/decision/report stream.

| Prefix family | Type | Domain | Owner | Status | Notes / Relationships |
|---------------|------|--------|-------|--------|-----------------------|
| `AD-0016..0023-*` | Governance-Decision | Governance | Authority Board | RATIFIED | PI construction authorizations (substrate, control, federation, evolution, knowledge, ontology, simulation, memory) → DECISION-REGISTER |
| `AF-001`, `AF-REM-001` | Report/Program | Governance | Authority Board | REPORT | Anti-fragility assessment & mechanisms |
| `ARCH-GAP-001`, `ARCH-GAP-VAL-001` | Report | Architecture | Enterprise Architecture | REPORT | Architecture completeness audit + validation → GAP-ANALYSIS |
| `ARTICLE-IX-*`, `FGA-2-ARTICLE-IX-*`, `UCOS-ARTICLE-IX-LOCK-RELEASE` | Governance-Decision | Governance | Authority Board | ACTIVE-LOCK | Article IX generation lock reviews |
| `AUDIT-UNIV-001` | Architecture-Doc | Audit | Platform Architecture | GENERATED | Universal audit primitive |
| `B01..B05-*` | Program/Package | Operations | Implementation Factory | GENERATED | Construction/decomposition/orchestration programs |
| `B04-A..D-INTELLIGENCE-*` | Program/Package | Intelligence | Implementation Factory | GENERATED | Intelligence fabric implementation programs |
| `CIV-STRESS-001` | Report | Civilization | Platform Architecture | REPORT | Civilization stress test |
| `CONST-READY-001..002` | Report | Governance | Authority Board | REPORT | Construction readiness audits |
| `CR-001..004-*` | Ratification | Governance | Authority Board | RATIFIED | Experience/service/security/technology-ADR reviews |
| `C4-ADR-*` | Report/Plan | Architecture | Platform Architecture | REPORT | C4 ADR preservation audit & remediation |
| `CTX-REG-001-EVIDENCE-PACK`, `-UPDATE-REPORT` | Report | Registry | Platform Governance | REPORT | Evidence/updates for CTX-REG-001 (registry read-only) |
| `E02-UMOS-*`, `TM-IMP-AUTH-001` | Program/Package | Operations | Implementation Factory | GENERATED | Execution readiness / meta-OS |
| `EXIST-001`, `EXT-001` | Report | Governance | Authority Board | REPORT | Existential invariant resolution / extensibility review |
| `F01..F03-*` | Program/Package | Operations | Implementation Factory | GENERATED | Foundation construction programs |
| `G01..G02-*` | Governance-Decision | Governance | Authority Board | RATIFIED | M0 authorization + board decision script |
| `INT-*` (AUTH/REM/REV, INTEL-001, IP-011) | Program/Report | Intelligence | Implementation Factory | GENERATED/REPORT | PI-10 intelligence authorization/remediation/implementation |
| `LIFE-UNIV-001` | Architecture-Doc | Governance | Platform Architecture | GENERATED | Universal lifecycle review |
| `MCS-1-*` (~30) | Program/Report | Operations | Implementation Factory | GENERATED/CERTIFIED | Master construction sequence 1 (execution/activation/board/closure) |
| `MEM-*` (~30) | Program/Report/Ratification | Memory | Implementation Factory / Platform Architecture | RATIFIED/REPORT | PI-9 Memory Fabric impl/val/sec/audit/ratification |
| `ONTO-*` (~20) | Program/Report/Ratification | Ontology | Implementation Factory / Platform Architecture | RATIFIED/REPORT | PI-8 Ontology Fabric impl/val/sec/audit/ratification |
| `OP-CERT-001` | Program/Package | Certification | Platform Governance | GENERATED | Operational certification program |
| `PHASE-*` (~40) | Phase-Report | Operations/Governance | Platform Governance | REPORT/CERTIFIED | Phase 9/10/11/12/21 reports, proposals, certifications |
| `PI1-*`, `PI5..PI7-*` | Program/Report/Ratification | (per fabric) | Implementation Factory | RATIFIED/REPORT | Per-PI impl/val/sec/audit/ratification |
| `PROMPT-LIBRARY-COVERAGE-REPORT` | Report | Governance | Authority Board | REPORT | Prompt library coverage |
| `RA-1..2-*` | Report/Package | Operations | Platform Engineering | REPORT | Environment provisioning / operational evidence |
| `REAL-*` (001, C-01, C-05, H-07, M-03, M-07) | Program/Report | Operations | Implementation Factory | REPORT | Construction-first realization program + reconciliations |
| `ROADMAP-ULT-001` | Program/Package | Operations | Platform Governance | GENERATED | Ultimate implementation roadmap → ROADMAP |
| `T01..T04-*` | Program/Package | Governance | Authority Board | GENERATED | Program transition / board session |
| `UA-05`, `UA-10` | Architecture-Doc/Certification | Governance | Authority Board | RATIFIED/CERTIFIED | Canonical invariants / ultimate architecture certification |
| `UCOM-*` | Program/Report/Certification | Governance | Authority Board | GENERATED/CERTIFIED | Universal primitive completion / remediation / synthesis |
| `UCOS-ASR-NFR-RATIFICATION` | Ratification | Architecture | Enterprise Architecture | RATIFIED | ASR/NFR ratification (resolves "PENDING ASR RATIFICATION") |
| `UCOS-C4-ADR-RAT-001` | Ratification | Architecture | Platform Architecture | RATIFIED | C4 ADR ratification |
| `UCOS-CONSTRUCTION-{AUTHORIZATION,BLOCKED}` | Governance-Decision | Governance | Authority Board | RATIFIED | Construction gating |
| `UCOS-{EXP,SVC}-RAT-001` | Ratification | Experience/Registry | Experience / Service Architecture | RATIFIED | Experience / service ratification |
| `UCOS-PEA-9.2A/9.3A-*` | Phase-Report | Platform | Platform Architecture | REPORT | Platform event architecture convergence/integration |
| `UCOS-PLATFORM-{FINAL-INVENTORY,GOVERNANCE-CLOSURE-REPORT}` | Report | Platform | Platform Governance | REPORT | Platform inventory & closure |
| `ULT-GAP-001`, `ULT-TEST-001` | Report | Governance | Authority Board | REPORT | Ultimate gap elimination / platform test |
| `WP-PLT-*` (01/02/03/06/11) | Program/Report | Platform | Platform Engineering | REPORT | Platform work-package implementations + evidence packs |
| `PHASE-R7-CIV-GOV-001` | Architecture-Doc | Civilization | Platform Architecture | GENERATED | Scalable governance |
| `all-files.txt`, `markdown-files.txt` | **Snapshot** | — | UNASSIGNED | SNAPSHOT | Repository file listings (see DUPLICATE-ANALYSIS) |

---

## 7. Category E — Backend Implementation (`packages/platform-runtime`)

| Path | Type | Domain | Owner | Status | Dependencies / Relationships |
|------|------|--------|-------|--------|------------------------------|
| `packages/platform-runtime/src/meta-core/**` (kernel, loaders, engines) | Implementation-Code | Platform | Platform Engineering | IMPLEMENTED | Substrate kernel (PI-2/3) |
| `packages/platform-runtime/src/control/memory/**` (~25) | Implementation-Code | Memory | Platform Engineering | RATIFIED (PI-9) | Memory Fabric runtime |
| `packages/platform-runtime/src/control/ontology/**` (~24) | Implementation-Code | Ontology | Platform Engineering | RATIFIED (PI-8) | Ontology Fabric runtime |
| `packages/platform-runtime/src/control/knowledge/**` (~20) | Implementation-Code | Knowledge | Platform Engineering | IMPLEMENTED (PI-7) | Knowledge Fabric runtime |
| `packages/platform-runtime/src/control/evolution/**` (~20) | Implementation-Code | Evolution | Platform Engineering | IMPLEMENTED (PI-6) | Evolution Fabric runtime |
| `packages/platform-runtime/src/control/federation/**` (19) | Implementation-Code | Federation | Platform Engineering | IMPLEMENTED (PI-5) | Federation Fabric runtime |
| `packages/platform-runtime/src/control/operations/**` (~22) | Implementation-Code | Operations | Platform Engineering | IMPLEMENTED (PI-4) | Operations/control fabric |
| `packages/platform-runtime/src/control/{identity,policy,trust,readiness,governance}/**` | Implementation-Code | Identity/Governance/Security | Platform Engineering | IMPLEMENTED (PI-4) | Control fabrics |
| `packages/platform-runtime/src/{metadata,registry,configuration}-runtime/**` | Implementation-Code | Registry | Platform Engineering | IMPLEMENTED | Metadata/registry/config runtimes |
| `packages/platform-runtime/src/contracts/**` | Implementation-Code | Registry | Platform Engineering | IMPLEMENTED | Runtime contract types |
| `packages/platform-runtime/test/**` (~43) | Implementation-Code (Test) | Platform | Platform Engineering | PASSING (baseline 269/269) | → TEST-CATALOG |
| `packages/platform-runtime/examples/capabilities/**` (2 `.capability.ts` + 3 JSON) | Implementation-Code (Example) | Platform | Platform Engineering | IMPLEMENTED | Capability descriptor examples |
| `packages/platform-runtime/bin/ucos-substrate.ts` | Implementation-Code (Entry) | Platform | Platform Engineering | IMPLEMENTED | Substrate CLI entrypoint |
| `packages/contracts-sdk/**` | Implementation-Code (stub) | Registry | Platform Engineering | README-ONLY | SDK placeholder |

---

## 8. Category F — Services, Data & Infrastructure

| Path | Type | Domain | Owner | Status | Dependencies / Relationships |
|------|------|--------|-------|--------|------------------------------|
| `services/platform/config-metadata/**` (api-018-realization.yaml, schema, V001 migration, deploy, events, governance) | Service-Contract (YAML) / Schema (SQL) | Registry | Platform Engineering | GENERATED | Realizes `UCOS-API-CONTRACT-018` (SVC-018) |
| `services/platform/operational-proof/**` (opf-api.yaml, opf-events.yaml, 3 schemas, V001 migration) | Service-Contract (YAML) / Schema (SQL) | Proof | Platform Engineering | GENERATED | Operational Proof Fabric (OPF); B02 package |
| `services/platform/registry/**` (api-027-realization.yaml, schema, V001 migration, federation model) | Service-Contract (YAML) / Schema (SQL) | Registry | Platform Engineering | GENERATED | Realizes `UCOS-API-CONTRACT-027` (SVC-027) |
| `infra/delivery/**` (gitops) | Infra (YAML) | Infrastructure | Platform Engineering | GENERATED | Delivery/GitOps |
| `infra/environments/{dev,int}/**` | Infra (YAML/TF) | Infrastructure | Platform Engineering | GENERATED | Environment definitions |
| `infra/networking/**` | Infra (YAML/TF) | Infrastructure | Platform Engineering | GENERATED | Networking |
| `infra/persistence/**` | Infra (YAML/TF) | Infrastructure | Platform Engineering | GENERATED | Persistence infra |
| `infra/runtime/**` | Infra (YAML/TF) | Infrastructure | Platform Engineering | GENERATED | Runtime infra |
| `security/bootstrap/mesh/**` | Infra/Security (YAML) | Security | Security Architecture | GENERATED | Service mesh bootstrap |
| `security/bootstrap/opa/**` | Infra/Security (YAML) | Security | Security Architecture | GENERATED | OPA policy bootstrap |
| `security/bootstrap/secrets/**` | Infra/Security (YAML) | Security | Security Architecture | GENERATED | Secrets bootstrap |
| `specifications/contracts/UCOS-CONTRACT-CATALOG.md` | Service-Contract (Doc) | Registry | Service & API Contract Architecture | GENERATED (`UCOS-CONTRACT-CAT-001`) | 30 API + 27 Event + 28 Data contracts |
| `apps/README.md` | Doc | Experience | Experience Architecture | README-ONLY | Frontend intentionally empty (see FRONTEND registry) |
| `quality/**`, `release/**`, `archive/**` | Report/README | Operations | Platform Governance | REPORT | Quality / release / archival material |

---

## 9. Relationship Summary (macro)

```
AUTH-001 Vision
  └─ AUTH-002 Constitution ── governs ──> ALL artifacts
       ├─ AUTH-003 Principles
       ├─ AUTH-004 Architecture Canon ─> architecture/**, docs/**
       ├─ AUTH-005 Domain Canon ──────> DOM-001..028 (docs/domain-architecture)
       ├─ AUTH-006 Capability Canon ──> CAP-01..19 (docs/capability-architecture)
       ├─ AUTH-007 Data Canon ────────> IC/CD/LD/PD (docs/data-architecture)
       ├─ AUTH-008 Security Canon ────> architecture/security, security/**
       ├─ AUTH-009 Governance Canon ──> .claude/governance gates
       ├─ AUTH-010 Traceability Canon > RTM / UCOS-TRACEABILITY-MODEL
       ├─ AUTH-011 Glossary Canon ────> CTX-GLOSS-001
       └─ AUTH-012 Decision Log ──────> AD-0001..0023 (READ-ONLY ledger)

Architecture (UCOS-SVC-ARCH-001) ─> Contract Catalog (85 contracts)
  ─> Services (config-metadata / operational-proof / registry)
  ─> platform-runtime implementation (control fabrics)
  ─> infra/** deployment substrate
```

## 10. Traceability
- **Feeds:** `DUPLICATE-ANALYSIS.md` (Phase 2), `GAP-ANALYSIS.md` (Phase 3), `domains/DOMAIN-MAP.md` (Phase 4), all Phase 6 registries.
- **References (read-only):** `CTX-REG-001` (`.claude/context/UCOS-ARTIFACT-REGISTRY.md`), `STATE-001` (`.claude/state/PROJECT-STATE.md`), `AUTH-012-DECISION-LOG.md`.
- **Owner:** UCOS Repository Normalization Program (subordinate to Authority Board).

**END `URNP-INV-001` — Repository Inventory (990 files classified; analysis only; no mutation).**
