# UCOS — Platform Engineering Architecture: Control Fabric Architecture

**Artifact ID:** UCOS-PEA-007
**Layer:** ARCHITECTURE (Platform Engineering — Control Fabric)
**Status:** CREATED — IN PROGRESS (Phase 9.0C.5 Part 2 — Control Entity Architecture)
**Version:** 0.2.0
**Phase:** Phase 9.0C.5 — Control Fabric Architecture (Part 2 of N — Control Entities)
**Date:** 2026-06-30
**Owner:** Chief Platform Engineer / Platform Governance & Control Plane (CAP-15; `PE-17`)
**Approver:** Authority Board (ratification deferred to the Platform Engineering validation phase)
**Branch:** `phase-9.2-convergence` (DO NOT PUSH / DO NOT MERGE TO MAIN)

---

## 1. Document Control

| Field | Value |
|-------|-------|
| Artifact ID | UCOS-PEA-007 |
| Name | UCOS Platform Engineering Architecture: Control Fabric Architecture |
| Path | `architecture/platform/PLATFORM-ENGINEERING-CONTROL-FABRIC-ARCHITECTURE.md` |
| Version | 0.2.0 |
| Status | CREATED — IN PROGRESS (Phase 9.0C.5 Part 2 — Control Entity Architecture) |
| Phase | Phase 9.0C.5 — Control Fabric Architecture (Part 2 of N) |
| Scope (Part 1) | Foundation only — Control Domains (`PCD-CTRL-001..012`), authority structure, scope, boundaries, principles, governance |
| Scope (Part 2 — this delivery) | Control Entities only — `PCE-001..073` (1:1 to `PRS-001..073`), the Control Entity Classification model (MECE), classification assignment matrix, distribution summary, and Part 2 validation. No authority/lifecycle/traceability artifacts; no `STATE-001`/`CTX-REG-001` changes. |
| Branch | `phase-9.2-convergence` (DO NOT PUSH / DO NOT MERGE) |
| Supersedes | — (supersedes the earlier anticipated `PCB-001..017` / §XV framing — see §1.2) |
| Next Part | Phase 9.0C.5 Part 3 — Control Mappings / Crosswalks (AUTHORIZED; not begun) |
| Readiness basis | `PHASE-9.0C.5-READINESS-REPORT.md` (Verdict READY WITH CONDITIONS; 10/10 validations PASS) |

### 1.1 Identifier convention (disambiguation — binding)

Control Domains in this architecture use the **compound** identifier format **`PCD-CTRL-XXX`** (Platform
**C**ontrol **D**omain — Control Fabric). This is **distinct** from the Configuration Architecture's
Configuration Domains `PCD-001..PCD-017` (`UCOS-PEA-005`): the `-CTRL-` infix is mandatory and prevents
any collision. No Control Domain reuses, renames, re-owns, or supersedes any `PCD-001..017` Configuration
Domain.

### 1.2 Reconciliation with prior anticipation (governance note)

An earlier sub-phase plan inside `UCOS-PEA-003` (§ sub-phase map) anticipated Phase 9.0C.5 as
"**Section XV** — Control Fabric Architecture (`PCB-001..017`, `TM-PEA-010`)". The **current Phase 9.0C.5
Part 1 mandate supersedes that anticipation**: the Control Fabric is delivered as this **standalone
architecture document** using **`PCD-CTRL-XXX`** Control Domains. No `PCB-nnn` identifiers are minted; no
`TM-PEA-010` matrix is created in this part. This reconciliation is additive and conflict-free; the
anticipated framing in `UCOS-PEA-003` is a point-in-time record and is not altered by this document.

### 1.3 Phase 9.0C.5 Part 1 scope notice (Foundation only — binding)

This part delivers **Control Domains only** plus their governing foundation (authority structure, scope,
boundaries, principles, governance, domain framework, and overviews of lifecycle/traceability strategy).
It **DOES NOT**:
- define **Control Entities** (deferred to Part 2);
- define **Control Mappings / crosswalks** (deferred);
- define **Control Traceability Matrices** (deferred);
- mint **Control Registry entries** in `CTX-REG-001` (deferred — emitted as a proposal in a later part);
- mint **Control State entries** in `STATE-001` (deferred — emitted as a proposal in a later part);
- mint **Control Lifecycle identifiers** (Section 12 is an overview only);
- select any technology / product / cloud / datastore / runtime / framework / vendor (PEP-010).

### 1.4 Technology-neutrality declaration (binding for Phase 9.0C.5)

This architecture defines **NO** infrastructure products, cloud providers, regions, databases, datastores,
storage engines, programming languages, frameworks, libraries, runtimes, container technologies,
orchestration platforms, service meshes, message brokers, CI/CD products, IaC tools, vendors, topologies,
or network designs. A **Control Domain** is a **governance / control construct** — the authoritative
organization of one cross-cutting *control* concern of the platform control plane — and is **not** a
product, a service, an engine, a workflow engine, or code. Technology selection remains deferred to the
platform technology-selection phase (ADRs per `CTX-ARCHB-001` §5).

---

## 2. Authority Chain

This architecture executes under, and is strictly subordinate to, the following ratified chain
(AUTH-009 §6.1/§6.2 precedence — Authority prevails, then each tier in order):

```
AUTH-001..012  (Authority Layer — immutable, ratified)
   └─ UCOS-CONST-001            (Constitution — ratified)
       └─ UCOS-ENT-ARCH-001     (Enterprise Architecture — ratified)
           └─ UCOS-DOM-ARCH-001 (Domain Architecture — ratified)
               └─ UCOS-CAP-ARCH-001          (Capability Architecture — ratified; CAP-15 spine)
                   └─ UCOS-INF-ARCH-001       (Information / Metadata — ratified)
                       └─ UCOS-DATA-ARCH-001  (Conceptual Data — ratified)
                           └─ UCOS-LDATA-ARCH-001  (Logical Data — ratified/authoritative)
                               └─ UCOS-PDATA-ARCH-001  (Physical Data — ratified/certified/authoritative)
                                   └─ UCOS-PEA-001  (Platform Foundation & Governance — PE-01..17)
                                       └─ UCOS-PEA-002  (Runtime & Service — PRD-001..017 / PRS-001..073)
                                           ├─ UCOS-PEA-003  (Event — RATIFIED v1.0.0)
                                           ├─ UCOS-PEA-004  (Registry — RATIFIED v0.6.0)
                                           ├─ UCOS-PEA-005  (Configuration — RATIFIED v0.7.0)
                                           └─ UCOS-PEA-006  (Metadata — RATIFIED v0.8.0)
                                               └─ UCOS-PEA-007  (Control Fabric — THIS ARTIFACT)
```

**Certification / convergence basis:** `UCOS-PEA-9.0C-CERT-001` (Layers 1–5 PASS; 100% coverage; 0
conflicts) and `UCOS-PEA-9.2-CONV-001` (RATIFIED PASS) establish the converged, ratified substrate the
Control Fabric presides over.

**Control-plane anchor.** The Control Fabric is anchored on the platform **control-plane spine**:
**`PE-17` Platform Governance & Control Plane** → runtime domain **`PRD-017`** → governance model
**`PEG-017`** → ownership **`PEO-017`** → boundary **`PEB-017`** → capability **CAP-15 Platform
Governance** → **AUTH-009** → **Authority Board** (terminal). The Control Fabric **enacts** — and never
amends — AUTH-004/007/008/009/010 and the platform principles `PEP-001..PEP-020`.

---

## 3. Purpose

The UCOS Control Fabric Architecture establishes the **authoritative control layer of the platform**: the
single, coherent control surface through which the platform governs *itself* across the four ratified
Platform Engineering architectures — **Event** (`UCOS-PEA-003`), **Registry** (`UCOS-PEA-004`),
**Configuration** (`UCOS-PEA-005`), and **Metadata** (`UCOS-PEA-006`) — and the foundation/runtime layers
(`UCOS-PEA-001/002`). It answers the question that arises once those four architectures are converged,
certified, and ratified:

> **Control Fabric (Foundation & Domain Model)** — *through what control domains, control authority,
> control scope, control boundaries, control principles, and control governance does the platform
> exercise unified, deterministic, auditable, single-owner control over decisions, policy/principle
> enforcement, lifecycle/promotion, change/evolution, traceability, audit/evidence, conformance, boundary
> integrity, control signalling, and escalation — without redefining, re-owning, or duplicating any
> construct of the four ratified architectures it controls?*

This Part 1 defines that control layer as **12 Control Domains** (`PCD-CTRL-001..PCD-CTRL-012`) across
**4 Control Groups** (`CCG-1..CCG-4`), governed by the control-plane spine (`PE-17` / `PEG-017` / CAP-15),
plus the control authority structure, scope, boundaries, principles, and governance framework. Control
**entities**, **mappings**, **matrices**, **registry entries**, **state entries**, and **lifecycle
identifiers** are **deferred** to later parts.

---

## 4. Scope

### 4.1 In scope (Phase 9.0C.5 Part 1 — this delivery)

- The Control Fabric **mission**, **principles** (`CFP-001..CFP-012`), and **boundaries**.
- The **Control Governance Model** (control-plane spine governance of the control fabric itself).
- The **Control Domain Framework** (4 Control Groups; framework rules).
- The **12 Control Domain definitions** (`PCD-CTRL-001..012`) — foundation constructs only.
- The **Control Authority Model** (authority structure / decision rights / escalation — described, no minted artifact ID).
- The **Control Lifecycle overview** (conceptual; no lifecycle identifiers).
- The **Control Traceability strategy** (strategy; no matrices).
- The **future workstreams** map for Parts 2..N.

### 4.2 Out of scope (deferred)

- Control **Entities** (the concrete control objects per domain) — Part 2.
- Control **Mappings / Crosswalks** to `PED/PRG/PCD/PMD`, `PEV/PRE/PCF/PME`, and `PEG/PEO/PEB` — later part.
- Control **Traceability Matrices** (`TM-CTRL-*`) — later part.
- Control **Registry entries** (`CTX-REG-001`) and **State entries** (`STATE-001`) — emitted as proposals later.
- Control **Lifecycle identifiers** (e.g. a `PCBL-*` / control-lifecycle standard) — later part.
- Any **technology / product / cloud / runtime / framework / vendor** selection (PEP-010; ADR phase).
- Any **alteration** of `UCOS-PEA-001..006` constructs (`PE/PEP/PEG/PEO/PEB`, `PRD/PRS/PSR/PEX/PWF`,
  `PED/PEV/PEGM-001/PEL-001`, `PRG/PRE/PRA-001/PRL-001`, `PCD/PCF/PCA-001/PCL-001`,
  `PMD/PME/PMA-001/PML-001`) — reference-only.

### 4.3 Relationship to the four ratified architectures

The Control Fabric is the **presiding control surface**, not a fifth peer data/feature architecture. Where
Event/Registry/Configuration/Metadata each define *what the platform knows and does* in their concern, the
Control Fabric defines *how the platform decides, enforces, promotes, audits, and constrains* across all
of them. It **consumes** their constructs (read-only) and **controls** their behavior through the
control-plane spine; it never redefines them.

---

## 5. Control Fabric Mission

| # | Mission statement |
|---|-------------------|
| M1 | Provide **one** authoritative control surface over the platform's Event, Registry, Configuration, Metadata, foundation, and runtime layers — no competing control planes. |
| M2 | Make every governed platform decision **deterministic, single-owner, and auditable**, terminating escalation at the Authority Board. |
| M3 | Enforce the platform principles (`PEP-001..020`) and governed policies **uniformly** across all four ratified architectures. |
| M4 | Govern **lifecycle and promotion** as migration-only, append-only, never deleting ratified records, consistent with `PEL/PRL/PCL/PML`. |
| M5 | Preserve **traceability closure** on the shared lineage spine `…→PRS→PRD→PE→CAP→Authority` and `…→Authority` for every controlled element. |
| M6 | Guarantee **boundary integrity and least-privilege** control crossings; no control action bypasses a governing `PEG`/`PEB`. |
| M7 | Preserve all upstream ownership/classification/governance **unchanged** — the fabric organizes control, it does not re-own or reclassify. |
| M8 | Hold technology-neutrality (PEP-010): control is a governance construct, never an engine, product, or code. |

---

## 6. Control Fabric Principles (`CFP-001..CFP-012`)

> The Control Fabric **inherits** all 20 platform principles (`PEP-001..PEP-020`, `UCOS-PEA-001` §II)
> unchanged. The following twelve **Control Fabric Principles** *specialize* those platform principles to
> the control layer. Each `CFP` traces to its governing `PEP`/AUTH source. They introduce no new authority.

| ID | Principle | Statement | Specializes |
|----|-----------|-----------|-------------|
| CFP-001 | Single Control Surface | Exactly one authoritative control fabric; no competing or shadow control planes. | PEP-005, PEP-009 |
| CFP-002 | Governance Before Control | No control action exists without a governing model, owner, and boundary first. | PEP-012 |
| CFP-003 | Single Control Ownership | Every Control Domain has exactly one accountable control owner — never shared. | PEP-007 |
| CFP-004 | Deterministic Control | The same governed inputs + configuration yield the same control decision. | PEP-008 |
| CFP-005 | Control Auditability | Every control decision is auditable end-to-end with referenced evidence. | PEP-011 |
| CFP-006 | Control Traceability | Every Control Domain traces to authority, principle, capability, and the controlled construct. | PEP-006 |
| CFP-007 | Approval-By-Exception Control | In-policy control is autonomous (Trusted); deviations require explicit approval. | PEP-020 |
| CFP-008 | Migration-Only Control Evolution | Control evolves only by versioned migration; ratified control facts are never redefined in place. | PEP-016 |
| CFP-009 | Control Boundary Integrity | Control crossings are explicit, least-privilege, and only via governed interfaces. | PEP-019 |
| CFP-010 | Non-Duplication of Controlled Constructs | The fabric controls — never re-creates, re-owns, or reclassifies — `PEA-001..006` constructs. | PEP-013, PEP-014 |
| CFP-011 | Control Neutrality | Control is technology-neutral; no product/engine/runtime is implied or selected. | PEP-010 |
| CFP-012 | Non-Waivable Control Preservation | Non-waivable controls (S1/S3/S4) are never auto-waived by any control action. | AUTH-008 |

---

## 7. Control Fabric Boundaries

> The Control Fabric's boundary is governed by `PEB-017` (Platform Governance & Control Plane boundary).
> The following control-fabric boundary rules apply to **all** Control Domains.

**Allowed control interactions**
- (A1) **Read** the constructs of `UCOS-PEA-001..006` (domains, entities, authority models, lifecycle
  models, governance/ownership/boundary models) to inform control decisions.
- (A2) **Issue governed control decisions** (enforcement, promotion gating, escalation, conformance
  verdicts) through the control-plane spine `PE-17`/`PRD-017` and the relevant `PEG`.
- (A3) **Coordinate** with `PE-10` Audit & Evidence and `PED-017` control events for evidence and
  signalling (coordination defined; entities deferred).
- (A4) **Escalate** unresolved control decisions along the single path terminating at the Authority Board.

**Prohibited control interactions**
- (P1) Creating, removing, merging, splitting, re-owning, or reclassifying any `PEA-001..006` construct,
  or any business domain / capability / Information / Metadata / Data construct.
- (P2) Establishing a second control plane, registry, or source of truth.
- (P3) Bypassing a governing `PEG`/`PEB`, or any boundary, when issuing a control decision.
- (P4) Auto-waiving non-waivable controls (S1/S3/S4), or overriding Authority precedence.
- (P5) Selecting or implying any technology / product / cloud / runtime / framework / vendor.
- (P6) Defining contracts, schemas, or payloads (owned by Prompt 07), or implementation/code (Prompt 10).

---

## 8. Control Governance Model

The Control Fabric **is itself governed** by the platform governance spine.

| Aspect | Definition |
|--------|-----------|
| **Governing model** | `PEG-017` — Platform Governance & Control Plane Governance (governance-of-governance). |
| **Capability anchor** | CAP-15 Platform Governance. |
| **Owner** | Platform Governance Owner (control-plane spine), via `PEO-017`. |
| **Steward** | Platform Governance Steward (CAP-15). |
| **Governance scope** | Governs the control fabric itself — the 12 Control Domains, the control principles (`CFP-001..012`), and control evolution. Presides over (never replaces) the four architecture authority models `PEGM-001`/`PRA-001`/`PCA-001`/`PMA-001`. |
| **Decision rights** | Control-framework definition, principle/policy enforcement, promotion-gate arbitration, and Approval-By-Exception arbitration — single accountable owner. |
| **Escalation path** | Control Domain Owner → Platform Governance Owner (`PE-17`) → Authority Board (terminal). |
| **Audit responsibility** | Owns governance-of-control audit; coordinates with `PE-10` (Audit & Evidence) and `PEG-010`. |
| **Compliance responsibility** | `CFP-001..012`; `PEP-012/016/017/020`; AUTH-008/009/010. |
| **Traceability responsibility** | `Control Fabric → PE-17 → CAP-15 → AUTH-009` (spine), and each Control Domain → its governed `PEA` constructs (mappings deferred to Part 2). |

**Conflict resolution.** Control Domain Owner → `PE-17` → Authority Board; Authority precedence per
AUTH-009 §6.2. Non-waivable S1/S3/S4 are never delegated away.

---

## 9. Control Domain Framework

The control fabric is decomposed into **12 Control Domains** across **4 Control Groups (`CCG-1..CCG-4`)**.
Each Control Domain is the authoritative organization of exactly one cross-cutting **control concern**,
owned by exactly one accountable control owner, governed by `PEG-017`, bounded by `PEB-017`, anchored on
CAP-15 / `PE-17` / `PRD-017`.

| Control Group | Control concern theme | Control Domains |
|---------------|-----------------------|-----------------|
| **CCG-1 — Authority & Governance Control** | How the platform decides and governs | `PCD-CTRL-001`, `PCD-CTRL-002`, `PCD-CTRL-003` |
| **CCG-2 — Lifecycle & Change Control** | How the platform promotes and evolves | `PCD-CTRL-004`, `PCD-CTRL-005`, `PCD-CTRL-006` |
| **CCG-3 — Integrity & Assurance Control** | How the platform proves correctness | `PCD-CTRL-007`, `PCD-CTRL-008`, `PCD-CTRL-009`, `PCD-CTRL-010` |
| **CCG-4 — Coordination & Continuity Control** | How the platform signals and recovers control | `PCD-CTRL-011`, `PCD-CTRL-012` |

### 9.1 Framework rules (apply to all `PCD-CTRL-001..012`)

- **(F1) Single owner.** Exactly one accountable control owner per Control Domain; no shared control ownership.
- **(F2) Spine-anchored.** Every Control Domain is governed by `PEG-017`, owned via `PEO-017`, bounded by
  `PEB-017`, anchored on CAP-15 / `PE-17` / `PRD-017` → AUTH-009 → Authority Board.
- **(F3) Read-only over controlled constructs.** A Control Domain reads but never mutates `PEA-001..006`
  constructs (CFP-010).
- **(F4) Disjoint & exhaustive control concerns.** Control concerns are mutually exclusive across the 12
  domains and collectively cover the platform's control surface (see §9.2 coverage).
- **(F5) Additive extensibility.** New control concerns are added as new Control Domains with their own
  group placement; existing domains and lineage are unaffected (CFP-008, PEP-017).
- **(F6) Deferral discipline.** This part defines domains only; entities/mappings/matrices/lifecycle-IDs/
  registry/state effects are deferred (§1.3, §4.2).

### 9.2 Control-surface coverage (concern → Control Domain)

| Cross-cutting control concern | Owning Control Domain |
|-------------------------------|-----------------------|
| Control authority & decision rights; Approval-By-Exception arbitration | `PCD-CTRL-001` |
| Governance orchestration across `PEG-001..017` + `PEGM/PRA/PCA/PMA` | `PCD-CTRL-002` |
| Policy & principle (`PEP/CFP`) enforcement | `PCD-CTRL-003` |
| Lifecycle-state & promotion-gate control across `PEL/PRL/PCL/PML` | `PCD-CTRL-004` |
| Change, version & migration-only evolution control (incl. state convergence governance) | `PCD-CTRL-005` |
| Configuration-/metadata-driven behavior consistency & drift control | `PCD-CTRL-006` |
| Traceability & lineage closure control (incl. registration integrity, "Registry First") | `PCD-CTRL-007` |
| Audit-of-decisions & evidence integrity control | `PCD-CTRL-008` |
| Conformance to canons & non-waivable (S1/S3/S4) control | `PCD-CTRL-009` |
| Boundary integrity & isolation / least-privilege crossing control | `PCD-CTRL-010` |
| Control signalling / control-plane eventing coordination | `PCD-CTRL-011` |
| Exception, escalation & control-plane continuity | `PCD-CTRL-012` |

> Coverage check: 12 concerns ↔ 12 Control Domains; 0 unassigned concerns; 0 concern owned by two domains.

---

## 10. Control Domain Definitions

> Each Control Domain declares: **Identifier**, **Control Domain Name**, **Control Group**, **Purpose**,
> **Control Scope**, **Authority Anchor**, **Governs Across** (read-only references to controlled
> constructs), **Governance**, **Ownership**, **Boundary**, and **Constraints**. No control entities,
> mappings, matrices, or lifecycle identifiers are defined here (deferred).

### CCG-1 — Authority & Governance Control

#### PCD-CTRL-001 — Control Authority & Decision-Rights Domain
- **Control Group:** CCG-1.
- **Purpose:** Own the platform's control authority structure — who may make which control decision, with
  what decision rights, under Approval-By-Exception.
- **Control Scope:** Control-decision authority allocation; Trusted vs Approval-Required classification of
  control operations; Approval-By-Exception arbitration; decision-rights consistency across the spine.
- **Authority Anchor:** AUTH-009; CAP-15; `PEG-017` / `PE-17` / `PRD-017`; Authority Board (terminal).
- **Governs Across (read-only):** the four authority models `PEGM-001`/`PRA-001`/`PCA-001`/`PMA-001`; the
  17 `PEG` decision-rights; `PEP-020`.
- **Governance:** `PEG-017`. · **Ownership:** Control Authority Owner (single; via `PEO-017`). ·
  **Boundary:** `PEB-017` (§7).
- **Constraints:** Never overrides Authority precedence; never auto-waives S1/S3/S4 (CFP-012).

#### PCD-CTRL-002 — Governance Orchestration Domain
- **Control Group:** CCG-1.
- **Purpose:** Coordinate the platform's distributed governance (17 `PEG` models + 4 architecture
  authority models) into a single coherent control surface.
- **Control Scope:** Governance coordination, consistency, and arbitration of overlaps among governance
  models; ensures one governing model per construct; presides without replacing.
- **Authority Anchor:** AUTH-009; CAP-15; `PEG-017`.
- **Governs Across (read-only):** `PEG-001..017`; `PEGM-001`/`PRA-001`/`PCA-001`/`PMA-001`.
- **Governance:** `PEG-017`. · **Ownership:** Governance Orchestration Owner (single). · **Boundary:** `PEB-017`.
- **Constraints:** Does not redefine or merge any governance model (CFP-010); coordination only.

#### PCD-CTRL-003 — Policy & Principle Enforcement Domain
- **Control Group:** CCG-1.
- **Purpose:** Enforce the platform principles (`PEP-001..020`) and control principles (`CFP-001..012`)
  and governed policies uniformly across all controlled layers.
- **Control Scope:** Principle/policy conformance enforcement; in-policy autonomy; deviation detection and
  referral to `PCD-CTRL-012` for escalation.
- **Authority Anchor:** AUTH-003/009; CAP-15; `PEG-017`.
- **Governs Across (read-only):** `PEP-001..020`; `CFP-001..012`; all `PEA-001..006` governed behaviors.
- **Governance:** `PEG-017`. · **Ownership:** Policy & Principle Enforcement Owner (single). · **Boundary:** `PEB-017`.
- **Constraints:** Enforces — never authors — security controls (Prompt 09); never relaxes non-waivable controls.

### CCG-2 — Lifecycle & Change Control

#### PCD-CTRL-004 — Control Lifecycle & Promotion Domain
- **Control Group:** CCG-2.
- **Purpose:** Control lifecycle-state transitions and promotion gating across the four lifecycle models,
  enforcing migration-only, append-only, never-delete-ratified semantics.
- **Control Scope:** Promotion-gate arbitration (quality/security/documentation gates); lifecycle-stage
  control; gate verdicts; consistency of lifecycle semantics across `PEL/PRL/PCL/PML`.
- **Authority Anchor:** AUTH-009; CAP-15; `PEG-014` (delivery gates) coordinated via `PEG-017`.
- **Governs Across (read-only):** `PEL-001`, `PRL-001`, `PCL-001`, `PML-001`; `GATE-REL-001`.
- **Governance:** `PEG-017`. · **Ownership:** Control Lifecycle & Promotion Owner (single). · **Boundary:** `PEB-017`.
- **Constraints:** No lifecycle identifier is minted in this part (overview only, §12); migration-only (CFP-008).

#### PCD-CTRL-005 — Change & Evolution Control Domain
- **Control Group:** CCG-2.
- **Purpose:** Govern versioned, migration-only platform evolution and the integrity of state/registry
  convergence (governance of change — not the change tooling).
- **Control Scope:** Version-increment discipline; decision-record (AUTH-012) governance; state/registry
  convergence governance (`STATE-001` / `CTX-REG-001` consistency); proposal-application discipline.
- **Authority Anchor:** AUTH-002 Art. XI; AUTH-012; AUTH-009/010; CAP-15; `PEG-017`.
- **Governs Across (read-only):** evolution of `PEA-001..006`; the converged baseline (`UCOS-PEA-9.2-CONV-001`).
- **Governance:** `PEG-017`. · **Ownership:** Change & Evolution Control Owner (single). · **Boundary:** `PEB-017`.
- **Constraints:** Never deletes ratified artifacts; all effects emitted as governed proposals (CFP-008, §1.3).

#### PCD-CTRL-006 — Configuration & Metadata Control Alignment Domain
- **Control Group:** CCG-2.
- **Purpose:** Control the consistency of configuration-first / metadata-first behavior, detecting and
  governing drift between configuration, metadata, and governed behavior.
- **Control Scope:** Config/metadata alignment control; drift detection governance; ensuring variability
  remains data (not code); separation of configuration from secrets and code.
- **Authority Anchor:** AUTH-007; CAP-10/CAP-15; `PEG-011` coordinated via `PEG-017`.
- **Governs Across (read-only):** `UCOS-PEA-005` (PCD/PCF/PCA-001/PCL-001), `UCOS-PEA-006` (PMD/PME/PMA-001/PML-001).
- **Governance:** `PEG-017`. · **Ownership:** Config & Metadata Control Alignment Owner (single). · **Boundary:** `PEB-017`.
- **Constraints:** Reads — never mutates — Configuration/Metadata constructs (CFP-010); no product selection.

### CCG-3 — Integrity & Assurance Control

#### PCD-CTRL-007 — Traceability & Lineage Control Domain
- **Control Group:** CCG-3.
- **Purpose:** Control end-to-end traceability closure and registration integrity ("Registry First") for
  every controlled element on the shared lineage spine.
- **Control Scope:** Lineage-closure control (`…→PRS→PRD→PE→CAP→Authority`); orphan/broken-chain
  prevention governance; registration-integrity control (every element registered before use).
- **Authority Anchor:** AUTH-010; CAP-19/CAP-15; `PEG-006`/`PEG-017`; `CTX-REG-001`, `CTX-TRACE-001`.
- **Governs Across (read-only):** `TM-PEA-006/006A/006B/011/012/013/021/022/023/031/032/033`; `PRA-001`.
- **Governance:** `PEG-017`. · **Ownership:** Traceability & Lineage Control Owner (single). · **Boundary:** `PEB-017`.
- **Constraints:** Builds no traceability matrix in this part (deferred, §13); coordination/strategy only.

#### PCD-CTRL-008 — Audit & Evidence Control Domain
- **Control Group:** CCG-3.
- **Purpose:** Control audit-of-decisions and the integrity/immutability of governance evidence across the
  platform control surface.
- **Control Scope:** Audit-of-control-decisions governance; evidence-integrity control; append-only,
  never-mutate-audited-records discipline; coordination with the audit domain.
- **Authority Anchor:** AUTH-008/010; CAP-16/CAP-15; `PEG-010`/`PEG-017`.
- **Governs Across (read-only):** `PE-10` audit posture; control-event evidence (`PED-017`); `PEL-001` audit stages.
- **Governance:** `PEG-017`. · **Ownership:** Audit & Evidence Control Owner (single). · **Boundary:** `PEB-017`.
- **Constraints:** Selects no audit tooling; never suppresses or mutates evidence (CFP-005).

#### PCD-CTRL-009 — Compliance & Conformance Control Domain
- **Control Group:** CCG-3.
- **Purpose:** Control conformance to the governing canons and the preservation of non-waivable controls.
- **Control Scope:** Canon-conformance verdicts (AUTH-004/005/007/008/009/010); non-waivable S1/S3/S4
  preservation control; leakage-prevention conformance (technology-neutrality).
- **Authority Anchor:** AUTH-008 (non-waivable); AUTH-009; CAP-16/CAP-15; `PEG-017`.
- **Governs Across (read-only):** all `PEA-001..006` conformance posture; `UCOS-PEA-9.0C-CERT-001`.
- **Governance:** `PEG-017`. · **Ownership:** Compliance & Conformance Control Owner (single). · **Boundary:** `PEB-017`.
- **Constraints:** Never waives non-waivable controls (CFP-012); enforces, does not author, security design.

#### PCD-CTRL-010 — Boundary & Isolation Control Domain
- **Control Group:** CCG-3.
- **Purpose:** Control boundary integrity and least-privilege, governed isolation of every control crossing.
- **Control Scope:** Boundary-crossing control (published-contract only); least-privilege enforcement;
  prohibited-interaction prevention; isolation (no shared mutable state across control boundaries).
- **Authority Anchor:** AUTH-005 §6.4; AUTH-008; CAP-15; `PEB-017`/`PEG-017`.
- **Governs Across (read-only):** `PEB-001..017`; cross-domain interaction posture.
- **Governance:** `PEG-017`. · **Ownership:** Boundary & Isolation Control Owner (single). · **Boundary:** `PEB-017`.
- **Constraints:** Defines no contracts (Prompt 07); never permits a boundary bypass (CFP-009).

### CCG-4 — Coordination & Continuity Control

#### PCD-CTRL-011 — Control Signal & Eventing Domain
- **Control Group:** CCG-4.
- **Purpose:** Coordinate control-plane signalling — the governed control events/signals through which
  control decisions propagate (coordination of, not redefinition of, control events).
- **Control Scope:** Control-signal coordination governance; alignment with control-plane events
  (`PED-017`); deterministic, idempotent control propagation posture.
- **Authority Anchor:** AUTH-004/009; CAP-12/CAP-15; `PEG-004`/`PEG-017`.
- **Governs Across (read-only):** `PED-017` control events; `PEV` control-classified events (read-only).
- **Governance:** `PEG-017`. · **Ownership:** Control Signal & Eventing Owner (single). · **Boundary:** `PEB-017`.
- **Constraints:** Defines no event contracts/schemas/payloads (Prompt 07); no broker selection.

#### PCD-CTRL-012 — Exception, Escalation & Continuity Control Domain
- **Control Group:** CCG-4.
- **Purpose:** Control exception handling, escalation to the Authority Board, and control-plane continuity
  (the control surface must itself be resilient and recoverable).
- **Control Scope:** Exception/deviation handling governance; single escalation-path control (terminal at
  Authority Board); control-plane resilience/continuity/recovery posture (technology-neutral).
- **Authority Anchor:** AUTH-009; CAP-15; `PEG-013`/`PEG-017`; Authority Board (terminal).
- **Governs Across (read-only):** escalation posture across `PEG-001..017`; `PE-13` resilience posture.
- **Governance:** `PEG-017`. · **Ownership:** Exception, Escalation & Continuity Owner (single). · **Boundary:** `PEB-017`.
- **Constraints:** Selects no failover product/topology; never creates a second escalation terminal (CFP-001).

---

## 11. Control Authority Model

> Described as a **structure** in this part. No standalone control-authority artifact identifier (analogous
> to `PEGM-001`/`PRA-001`/`PCA-001`/`PMA-001`) is minted here; a formal Control Authority Model identifier
> is deferred to a later part. The structure below is binding for Part 1 and enacts (never amends) AUTH-009.

### 11.1 Authority structure

```
Authority Board                         ← terminal control authority (AUTH-009)
   ▲
Platform Governance Owner (PE-17 / PEG-017 / CAP-15)   ← control-plane spine; presides over the fabric
   ▲
Control Domain Owners (one per PCD-CTRL-001..012)      ← single accountable owner per control concern
   ▲
Controlled architectures (read-only): PEA-001..006     ← governed, never re-owned
```

### 11.2 Decision-rights tiers

| Tier | Holder | Rights |
|------|--------|--------|
| T1 — Terminal | Authority Board | Final arbitration; canon amendment (Approval-Required); non-waivable control authority. |
| T2 — Spine | Platform Governance Owner (`PE-17`) | Control-framework definition; Approval-By-Exception arbitration; cross-domain control conflict resolution. |
| T3 — Domain | Control Domain Owner | In-scope control decisions for that Control Domain (Trusted Operations in-policy). |

### 11.3 Approval-By-Exception (control)

- **Trusted control operations** (in-policy, deterministic, within a single Control Domain's scope) proceed
  autonomously and are audited (CFP-007).
- **Approval-Required control operations** (deviations, cross-domain conflicts, canon-adjacent changes,
  any touch on non-waivable controls) escalate via `PCD-CTRL-012` → `PE-17` → Authority Board.

### 11.4 Escalation path (single, terminal)

`Control Domain Owner → Platform Governance Owner (PE-17) → Authority Board`. There is exactly one
escalation terminal (CFP-001); no Control Domain creates an alternate authority or terminal.

---

## 12. Control Lifecycle Overview

> **Overview only.** No control-lifecycle identifiers are minted in this part (per §1.3). A formal control
> lifecycle standard (with identifiers) is deferred to a later part and will be designed compatible with
> the four ratified lifecycle models `PEL-001`/`PRL-001`/`PCL-001`/`PML-001`.

The control fabric is intended to operate under a **migration-only, append-only, never-delete-ratified**
control lifecycle, conceptually spanning these stages (labels indicative, not identifiers):

1. **Definition** — a control concern is defined as a Control Domain (this part).
2. **Authorization** — control authority/decision rights assigned (Section 11).
3. **Activation** — control becomes operative under its governing model.
4. **Enforcement** — in-policy control runs autonomously (Trusted); deviations escalate.
5. **Audit** — control decisions and evidence are recorded append-only.
6. **Evolution** — control changes only via versioned migration + decision record (AUTH-012).
7. **Supersession** — superseded control facts are retained (never deleted) and linked to successors.

Compatibility note: this overview deliberately mirrors the migration-only / append-only semantics common
to `PEL/PRL/PCL/PML` so that the later control-lifecycle standard converges without conflict.

---

## 13. Control Traceability Strategy

> **Strategy only.** No traceability matrices (`TM-CTRL-*`) are produced in this part (deferred).

- **Backward lineage (intended).** Every Control Domain will trace
  `PCD-CTRL-nnn → PE-17 / PRD-017 → CAP-15 → PEG-017 → AUTH-009 → Authority Board`, and to the specific
  `PEA-001..006` constructs it controls (the "Governs Across" references in Section 10 are the seed set).
- **Forward lineage (intended).** Each Control Domain will trace forward to the Control Entities (Part 2)
  and Control Mappings/Matrices (later part) that realize it.
- **Closure obligation.** Part 1 asserts **0 orphan Control Domains** (all 12 anchored on the spine) and
  **0 broken authority chains** (all terminate at the Authority Board). Full matrix-based closure
  (`TM-CTRL-*`) is an obligation of a later part.
- **Shared spine reuse.** The control traceability strategy reuses — and does not duplicate — the existing
  12 `TM-PEA` matrices and the 3 `TM-CERT` matrices as read-only lineage sources.

---

## 14. Future Workstreams

| Part | Workstream | Delivers | Status |
|------|-----------|----------|:------:|
| Part 1 (this) | Foundation & Domain Model | `PCD-CTRL-001..012`; control authority structure; scope; boundaries; principles (`CFP-001..012`); governance; framework; lifecycle/traceability overviews | ✅ COMPLETE (CREATED — IN PROGRESS) |
| Part 2 | Control Entities | Concrete control objects per Control Domain (identifier format reserved, e.g. `PCE-CTRL-*`) | ⛔ Not begun |
| Part 3 | Control Mappings / Crosswalks | Control Domain → `PED/PRG/PCD/PMD`, `PEV/PRE/PCF/PME`, `PEG/PEO/PEB` mappings | ⛔ Not begun |
| Part 4 | Control Traceability Matrices | `TM-CTRL-*` lineage & coverage matrices | ⛔ Not begun |
| Part 5 | Control Authority & Lifecycle Standards | Formal control authority model ID + control lifecycle standard ID | ⛔ Not begun |
| Part 6 | Validation, Registry & State | Mandatory validation; `CTX-REG-001` + `STATE-001` proposals; completion | ⛔ Not begun |
| (later) | Ratification & Certification | Authority Board ratification of the Control Fabric | ⛔ Deferred |

> Standing constraints across all future parts: emit `STATE-001`/`CTX-REG-001` effects as governed
> proposals; enforce PEP-010/CFP-011 (no technology selection); preserve non-waivable S1/S3/S4; never
> alter `UCOS-PEA-001..006` constructs; honor Approval-By-Exception escalation to the Authority Board.

---

## Section V — Part 1 Validation (Foundation)

| Inventory | Required | Produced | Result |
|-----------|----------|---------:|:------:|
| Control Groups (`CCG-1..4`) | 4 | 4 | ✅ |
| Control Domains (`PCD-CTRL-001..012`) | ≥1, foundation only | 12 | ✅ |
| Control Fabric Principles (`CFP-001..012`) | n/a (specialize PEP) | 12 | ✅ |
| Control Entities | 0 (deferred) | 0 | ✅ |
| Control Mappings | 0 (deferred) | 0 | ✅ |
| Control Traceability Matrices | 0 (deferred) | 0 | ✅ |
| Control Lifecycle identifiers | 0 (deferred) | 0 | ✅ |
| Control Registry entries (`CTX-REG-001`) | 0 (deferred) | 0 | ✅ |
| Control State entries (`STATE-001`) | 0 (deferred) | 0 | ✅ |

| Confirmation | Target | Result |
|--------------|--------|:------:|
| Control-surface coverage (concern → domain) | 100% (12/12) | ✅ |
| Single control ownership (1 owner per domain) | 12/12 | ✅ (CFP-003) |
| Spine anchoring (`PE-17`/`PEG-017`/CAP-15/AUTH-009) | 12/12 | ✅ |
| Governance alignment (governed by `PEG-017`) | 12/12 | ✅ |
| Authority alignment (terminal = Authority Board) | 12/12 | ✅ |
| Boundary alignment (`PEB-017`; allowed/prohibited) | 12/12 | ✅ |
| Consistency with `PEA-003/004/005/006` (read-only; 0 alteration) | 0 alterations | ✅ |
| Orphan Control Domains / broken authority chains | 0 / 0 | ✅ |
| Implementation leakage | 0 | ✅ NONE |

> **Implementation-leakage scan.** No product, cloud, datastore, language, framework, runtime, container,
> orchestrator, mesh, broker, CI/CD tool, IaC tool, vendor, topology, or network is named or selected.
> Terms such as "eventing", "promotion", "gateway", "lifecycle", and "continuity" appear only as names of
> control/governance constructs and in explicit deferral/neutrality/prohibition statements.

---

## Document Control (close)

| Field | Value |
|-------|-------|
| Artifact ID | UCOS-PEA-007 |
| Version | 0.1.0 |
| Status | CREATED — IN PROGRESS (Phase 9.0C.5 Part 1 — Foundation & Domain Model) |
| Phase | Phase 9.0C.5 — Control Fabric Architecture (Part 1 of N) |
| Branch | `phase-9.2-convergence` (DO NOT PUSH / DO NOT MERGE) |
| Next | Phase 9.0C.5 Part 2 — Control Entities (AUTHORIZED; not begun) |

## Traceability
- **Refines:** AUTH-001..012, STATE-001, `UCOS-CONST-001`, `UCOS-ENT-ARCH-001`, `UCOS-DOM-ARCH-001`,
  `UCOS-CAP-ARCH-001`, `UCOS-INF-ARCH-001`, `UCOS-DATA-ARCH-001`, `UCOS-LDATA-ARCH-001`,
  `UCOS-PDATA-ARCH-001`, `UCOS-PEA-001`, `UCOS-PEA-002`, `UCOS-PEA-003`, `UCOS-PEA-004`, `UCOS-PEA-005`,
  `UCOS-PEA-006`, `UCOS-PEA-9.0C-CERT-001`, `UCOS-PEA-9.2-CONV-001`, `CTX-ARCHB-001`, `CTX-CAP-001`,
  `CTX-REG-001`, `CTX-TRACE-001`, `PHASE-9.0C.5-READINESS-REPORT.md`, PROMPT-08.
- **Refined by:** `PHASE-9.0C.5-PART-1-COMPLETION-REPORT.md`; Phase 9.0C.5 Parts 2..N (control entities,
  mappings, matrices, authority/lifecycle standards, validation, registry/state proposals); Phase 9.1
  ratification; platform technology-selection ADRs; Prompts 09–12.
- **Controls (read-only):** `UCOS-PEA-003/004/005/006` and the foundation/runtime layers `UCOS-PEA-001/002`.


---

# PART 2 — CONTROL ENTITY ARCHITECTURE

> **Part 2 banner.** This part is **appended** to `UCOS-PEA-007`. It establishes **Control Entities ONLY**
> (`PCE-001..073`) and their **Classification model**. Per the Part 2 mandate it does **NOT** create
> authority artifacts, lifecycle artifacts, or traceability matrices; does **NOT** modify `STATE-001` or
> `CTX-REG-001`; and changes nothing in Part 1 except the artifact version/status header. Part 1
> (`PCD-CTRL-001..012`, `CFP-001..012`, governance, boundaries, authority structure) remains authoritative
> and unaltered.

## 15. Part 2 Document Control & Scope

| Field | Value |
|-------|-------|
| Part | Phase 9.0C.5 **Part 2** — Control Entity Architecture |
| Artifact | `UCOS-PEA-007` (advanced to v0.2.0 by this part) |
| Delivers | `PCE-001..073` (Control Entity Catalog); Control Entity Classification model (MECE); classification assignment matrix; distribution summary; Part 2 validation |
| 1:1 anchor | `PCE-001..073` ↔ `PRS-001..073` (`UCOS-PEA-002` Service Architecture, §VII) |
| Classification basis | The 12 ratified Control Domains `PCD-CTRL-001..012` (Part 1 §9–§10), grouped by `CCG-1..CCG-4` |
| Branch | `phase-9.2-convergence` (DO NOT PUSH / DO NOT MERGE) |

### 15.1 Part 2 scope (binding)

**In scope (this delivery):**
- The **Control Entity model** (definition, 1:1 mapping rule, inheritance-preservation rules).
- The **73 Control Entities** `PCE-001..PCE-073`, each the control object for exactly one Runtime Service.
- The **Control Entity Classification model** — a complete, **Mutually Exclusive & Collectively
  Exhaustive (MECE)** classification: every `PCE` belongs to exactly one **owning Control Domain**
  (`PCD-CTRL-001..012`), rolled up to its Control Group (`CCG-1..4`).
- The **classification assignment matrix**, **distribution summary**, and **Part 2 validation**.

**Out of scope (deferred / prohibited in this part):**
- **No** authority artifacts (no Control Authority Model identifier minted) — Part 5.
- **No** lifecycle artifacts (no control-lifecycle identifier minted) — Part 5.
- **No** traceability matrices (`TM-CTRL-*`) — Part 4.
- **No** Control Mappings / Crosswalks (`PCE → PED/PRG/PCD/PMD …`) — Part 3.
- **No** `STATE-001` entries and **no** `CTX-REG-001` entries (not even proposals) — Part 6.
- **No** technology/product/cloud/runtime/framework/vendor selection (PEP-010 / CFP-011).
- **No** alteration of any `UCOS-PEA-001..006` construct — `PCE` entities are **read-only controllers**.

## 16. Control Entity Model

> **Definition.** A **Platform Control Entity** (`PCE`) is the **single authoritative control object**
> through which the Control Fabric exercises governed control over exactly one Platform Runtime Service
> (`PRS`). A `PCE` is a **governance/control construct** — it **controls** (decides, enforces, gates,
> audits, constrains, signals, escalates) the behavior of its mapped `PRS`; it is **not** a service, a
> microservice, an engine, a workflow, a product, or code (CFP-011 / PEP-010). It **never** re-creates,
> re-owns, reclassifies, or mutates the `PRS` it controls (CFP-010).

### 16.1 Mapping rule (1:1 — binding)

- **(E1) Exact bijection.** There is **exactly one** `PCE-nnn` for **exactly one** `PRS-nnn`, for all
  `nnn ∈ {001..073}`. `PCE-nnn` controls `PRS-nnn`. No `PCE` controls two services; no service is
  controlled by two `PCE`s. The mapping is total (every `PRS` is controlled) and injective (no duplicates).
- **(E2) Identifier alignment.** The numeric suffix of a `PCE` equals the numeric suffix of its `PRS`
  (`PCE-031` ↔ `PRS-031`). This is a deliberate identity-alignment convention, not a re-use of the `PRS`
  identifier.

### 16.2 Inheritance-preservation rules (binding — CFP-010)

Each `PCE` **preserves and inherits — never redefines** — the following from its mapped `PRS` (which in
turn inherits them from its owning Runtime Domain `PRD-XXX`, `UCOS-PEA-002`):

- **(I1) Ownership preserved.** The controlled service's ownership model `PEO-XXX` is inherited unchanged.
  The `PCE` adds a **control accountability** layer (the owning Control Domain's single Control Owner under
  `PEO-017`), but does **not** transfer, split, or re-own `PEO-XXX`.
- **(I2) Governance preserved.** The controlled service's governance model `PEG-XXX` is inherited
  unchanged. The `PCE` is **presided over** by the control-plane governance `PEG-017` (it *controls* via
  the spine) but does **not** replace, merge, or redefine `PEG-XXX` (CFP-002, Part 1 §8).
- **(I3) Boundary preserved.** The controlled service's boundary model `PEB-XXX` is inherited unchanged;
  the `PCE` itself operates within `PEB-017` and honors `PEB-XXX`'s allowed/prohibited interactions. No
  control action bypasses `PEB-XXX` or `PEB-017` (CFP-009).
- **(I4) Authority inheritance preserved.** The controlled service's authority anchor (`AUTH-*` per its
  `PRD`) is inherited unchanged; all control terminates at the **Authority Board** via `PE-17` → CAP-15 →
  AUTH-009 (Part 1 §11).
- **(I5) Lifecycle inheritance preserved.** Each `PCE` inherits the **migration-only, append-only,
  never-delete-ratified** platform-element lifecycle semantics that govern its `PRS` (governed via
  `PRS-071` Platform Element Lifecycle Governance / `PEG-017`, consistent with `PEL-001` semantics). No new
  control-lifecycle identifier is minted in this part (Part 1 §12; deferred to Part 5).

> **Net effect.** A `PCE` is **additive control over a preserved service**: same owner, same governance,
> same boundary, same authority chain, same lifecycle semantics — now with one explicit, single-owner,
> auditable control object classified into exactly one control concern.

## 17. Control Entity Classification Model

> **Classification axis (binding).** Every `PCE` is classified by its **owning Control Domain**
> (`PCD-CTRL-001..012`) — the single cross-cutting control concern that most governs the controlled
> service. The 12 Control Domains are the **classification classes**; they were established as
> **disjoint & exhaustive control concerns** in Part 1 (§9.1 F4, §9.2). Therefore the classification is
> **Mutually Exclusive** (each `PCE` in exactly one class) and **Collectively Exhaustive** (every `PCE`
> classified; the 12 classes cover the entire control surface). Classes roll up to the four Control Groups
> `CCG-1..CCG-4`.

### 17.1 Classification class definitions

| Class (Control Domain) | Control Group | A `PCE` is classified here when its controlled service's dominant control concern is … |
|------------------------|:-------------:|----------------------------------------------------------------------------------------|
| **PCD-CTRL-001** — Control Authority & Decision-Rights | CCG-1 | making/arbitrating governed **decisions** and allocating **decision rights** (authorization, decision evaluation, approval-by-exception). |
| **PCD-CTRL-002** — Governance Orchestration | CCG-1 | **coordinating/orchestrating** governed behavior and governance across constructs (workflow orchestration, control-plane & insight governance). |
| **PCD-CTRL-003** — Policy & Principle Enforcement | CCG-1 | **enforcing** principles/policies uniformly (principle enforcement, traffic/capacity policy enforcement). |
| **PCD-CTRL-004** — Control Lifecycle & Promotion | CCG-2 | governing **lifecycle state & promotion** (runtime/key/registration/element lifecycle; build/gate/release; provisioning & composition actuation). |
| **PCD-CTRL-005** — Change & Evolution Control | CCG-2 | governing **versioned, migration-only change/evolution** (version negotiation, configuration versioning, change propagation, rotation). |
| **PCD-CTRL-006** — Configuration & Metadata Control Alignment | CCG-2 | keeping **config/metadata-driven behavior consistent** and detecting/governing **drift** (config resolution, metadata delivery, desired-state, drift). |
| **PCD-CTRL-007** — Traceability & Lineage Control | CCG-3 | **registration integrity & lineage closure** ("Registry First"; registration, discovery, registry metadata, posture registry, trace correlation). |
| **PCD-CTRL-008** — Audit & Evidence Control | CCG-3 | **audit-of-decisions & evidence integrity** (audit capture, evidence custody, attestation, tamper-evidence, governance-evidence aggregation). |
| **PCD-CTRL-009** — Compliance & Conformance Control | CCG-3 | **conformance to canons & preservation of non-waivable (S1/S3/S4)** controls and classification (persistence-classification, secrets, SLO conformance, insight classification). |
| **PCD-CTRL-010** — Boundary & Isolation Control | CCG-3 | **boundary integrity, least-privilege & isolation** of crossings (placement, access brokering, connectivity, segmentation, ingress/egress, mediation, authn, tenancy, session, reporting). |
| **PCD-CTRL-011** — Control Signal & Eventing | CCG-4 | **control-plane signalling / eventing coordination** (event publish/subscribe/deliver/dedup, task dispatch, telemetry/metrics/alert signalling). |
| **PCD-CTRL-012** — Exception, Escalation & Continuity | CCG-4 | **exception handling, escalation & continuity/recovery** (dead-letter/replay, compensation, idempotency, retry, circuit, failover, recovery, rollback, snapshot/backup). |

### 17.2 MECE assertions

- **Mutually Exclusive.** Each `PCE` is assigned to **exactly one** `PCD-CTRL` class by its dominant
  control concern (§18 catalog; §19 matrix). No `PCE` carries two classes.
- **Collectively Exhaustive.** All 73 `PCE`s are classified; the 12 classes (4 Control Groups) cover the
  entire control surface defined in Part 1 §9.2. There is **no** "unclassified" or "other" bucket.

## 18. Control Entity Catalog (`PCE-001..PCE-073`)

> **How to read.** Each row defines one Control Entity: its identifier, the `PRS` it controls (1:1), its
> control-entity name, its **classification** (owning Control Domain + Control Group), and the **inherited
> & preserved** governance (`PEG`), ownership (`PEO`), boundary (`PEB`), authority anchor, and capability
> anchor of the controlled service. **Lifecycle inheritance** is uniform across all 73 entities
> (migration-only / append-only / never-delete-ratified, via `PRS-071`/`PEG-017`; §16.2 I5) and is stated
> once here rather than repeated per row. Control scope of each `PCE` = govern its `PRS`'s governed
> behavior within its class concern (read-only over the service; CFP-010).

| PCE | Controls PRS | Control Entity Name | Class (PCD-CTRL) | CCG | Gov `PEG` | Own `PEO` | Bnd `PEB` | Authority | CAP |
|-----|--------------|---------------------|:----------------:|:---:|:---------:|:---------:|:---------:|-----------|:---:|
| PCE-001 | PRS-001 | Execution Scheduling Control | PCD-CTRL-004 | CCG-2 | PEG-001 | PEO-001 | PEB-001 | AUTH-004/009 | CAP-15 |
| PCE-002 | PRS-002 | Workload Placement Control | PCD-CTRL-010 | CCG-3 | PEG-001 | PEO-001 | PEB-001 | AUTH-004/009 | CAP-15 |
| PCE-003 | PRS-003 | Runtime Lifecycle Control | PCD-CTRL-004 | CCG-2 | PEG-001 | PEO-001 | PEB-001 | AUTH-004/009 | CAP-15 |
| PCE-004 | PRS-004 | Capacity Governance Control | PCD-CTRL-003 | CCG-1 | PEG-001 | PEO-001 | PEB-001 | AUTH-004/009 | CAP-15 |
| PCE-005 | PRS-005 | Persistence Coordination Control | PCD-CTRL-009 | CCG-3 | PEG-002 | PEO-002 | PEB-002 | AUTH-007/009 | CAP-15 |
| PCE-006 | PRS-006 | Data Access Brokering Control | PCD-CTRL-010 | CCG-3 | PEG-002 | PEO-002 | PEB-002 | AUTH-007/009 | CAP-15 |
| PCE-007 | PRS-007 | Retention Enforcement Control | PCD-CTRL-004 | CCG-2 | PEG-002 | PEO-002 | PEB-002 | AUTH-007/009 | CAP-15 |
| PCE-008 | PRS-008 | Snapshot & Backup Coordination Control | PCD-CTRL-012 | CCG-4 | PEG-002 | PEO-002 | PEB-002 | AUTH-007/009 | CAP-15 |
| PCE-009 | PRS-009 | Connectivity Brokering Control | PCD-CTRL-010 | CCG-3 | PEG-003 | PEO-003 | PEB-003 | AUTH-008/009 | CAP-17 |
| PCE-010 | PRS-010 | Segmentation Enforcement Control | PCD-CTRL-010 | CCG-3 | PEG-003 | PEO-003 | PEB-003 | AUTH-008/009 | CAP-17 |
| PCE-011 | PRS-011 | Traffic Governance Control | PCD-CTRL-003 | CCG-1 | PEG-003 | PEO-003 | PEB-003 | AUTH-008/009 | CAP-17 |
| PCE-012 | PRS-012 | Connectivity Posture Registry Control | PCD-CTRL-007 | CCG-3 | PEG-003 | PEO-003 | PEB-003 | AUTH-008/009 | CAP-17 |
| PCE-013 | PRS-013 | Event Publication Control | PCD-CTRL-011 | CCG-4 | PEG-004 | PEO-004 | PEB-004 | AUTH-004/009 | CAP-12 |
| PCE-014 | PRS-014 | Event Subscription Control | PCD-CTRL-011 | CCG-4 | PEG-004 | PEO-004 | PEB-004 | AUTH-004/009 | CAP-12 |
| PCE-015 | PRS-015 | Event Delivery Control | PCD-CTRL-011 | CCG-4 | PEG-004 | PEO-004 | PEB-004 | AUTH-004/009 | CAP-12 |
| PCE-016 | PRS-016 | Idempotency & Deduplication Control | PCD-CTRL-011 | CCG-4 | PEG-004 | PEO-004 | PEB-004 | AUTH-004/009 | CAP-12 |
| PCE-017 | PRS-017 | Dead-letter & Replay Control | PCD-CTRL-012 | CCG-4 | PEG-004 | PEO-004 | PEB-004 | AUTH-004/009 | CAP-12 |
| PCE-018 | PRS-018 | Contract Ingress Control | PCD-CTRL-010 | CCG-3 | PEG-005 | PEO-005 | PEB-005 | AUTH-004/009 | CAP-12 |
| PCE-019 | PRS-019 | Contract Egress Control | PCD-CTRL-010 | CCG-3 | PEG-005 | PEO-005 | PEB-005 | AUTH-004/009 | CAP-12 |
| PCE-020 | PRS-020 | Version Negotiation Control | PCD-CTRL-005 | CCG-2 | PEG-005 | PEO-005 | PEB-005 | AUTH-004/009 | CAP-12 |
| PCE-021 | PRS-021 | Request Mediation Control | PCD-CTRL-010 | CCG-3 | PEG-005 | PEO-005 | PEB-005 | AUTH-004/009 | CAP-12 |
| PCE-022 | PRS-022 | Element Registration Control | PCD-CTRL-007 | CCG-3 | PEG-006 | PEO-006 | PEB-006 | AUTH-009/010 | CAP-19 |
| PCE-023 | PRS-023 | Discovery & Resolution Control | PCD-CTRL-007 | CCG-3 | PEG-006 | PEO-006 | PEB-006 | AUTH-009/010 | CAP-19 |
| PCE-024 | PRS-024 | Registry Metadata Control | PCD-CTRL-007 | CCG-3 | PEG-006 | PEO-006 | PEB-006 | AUTH-009/010 | CAP-19 |
| PCE-025 | PRS-025 | Registration Lifecycle Control | PCD-CTRL-004 | CCG-2 | PEG-006 | PEO-006 | PEB-006 | AUTH-009/010 | CAP-19 |
| PCE-026 | PRS-026 | Workflow Resolution Control | PCD-CTRL-002 | CCG-1 | PEG-007 | PEO-007 | PEB-007 | AUTH-009 | CAP-18 |
| PCE-027 | PRS-027 | Workflow Execution Control | PCD-CTRL-002 | CCG-1 | PEG-007 | PEO-007 | PEB-007 | AUTH-009 | CAP-18 |
| PCE-028 | PRS-028 | Decision Evaluation Control | PCD-CTRL-001 | CCG-1 | PEG-007 | PEO-007 | PEB-007 | AUTH-009 | CAP-18 |
| PCE-029 | PRS-029 | Compensation Coordination Control | PCD-CTRL-012 | CCG-4 | PEG-007 | PEO-007 | PEB-007 | AUTH-009 | CAP-18 |
| PCE-030 | PRS-030 | Task Dispatch Control | PCD-CTRL-011 | CCG-4 | PEG-007 | PEO-007 | PEB-007 | AUTH-009 | CAP-18 |
| PCE-031 | PRS-031 | Authentication Control | PCD-CTRL-010 | CCG-3 | PEG-008 | PEO-008 | PEB-008 | AUTH-008/009 | CAP-09 |
| PCE-032 | PRS-032 | Authorization Control | PCD-CTRL-001 | CCG-1 | PEG-008 | PEO-008 | PEB-008 | AUTH-008/009 | CAP-09 |
| PCE-033 | PRS-033 | Tenancy Context Control | PCD-CTRL-010 | CCG-3 | PEG-008 | PEO-008 | PEB-008 | AUTH-008/009 | CAP-09 |
| PCE-034 | PRS-034 | Session & Token Control | PCD-CTRL-010 | CCG-3 | PEG-008 | PEO-008 | PEB-008 | AUTH-008/009 | CAP-09 |
| PCE-035 | PRS-035 | Secret Issuance Control | PCD-CTRL-009 | CCG-3 | PEG-009 | PEO-009 | PEB-009 | AUTH-008/009 | CAP-17 |
| PCE-036 | PRS-036 | Key Lifecycle Control | PCD-CTRL-004 | CCG-2 | PEG-009 | PEO-009 | PEB-009 | AUTH-008/009 | CAP-17 |
| PCE-037 | PRS-037 | Rotation Coordination Control | PCD-CTRL-005 | CCG-2 | PEG-009 | PEO-009 | PEB-009 | AUTH-008/009 | CAP-17 |
| PCE-038 | PRS-038 | Secret Reference Resolution Control | PCD-CTRL-009 | CCG-3 | PEG-009 | PEO-009 | PEB-009 | AUTH-008/009 | CAP-17 |
| PCE-039 | PRS-039 | Audit Capture Control | PCD-CTRL-008 | CCG-3 | PEG-010 | PEO-010 | PEB-010 | AUTH-008/009/010 | CAP-16 |
| PCE-040 | PRS-040 | Evidence Custody Control | PCD-CTRL-008 | CCG-3 | PEG-010 | PEO-010 | PEB-010 | AUTH-008/009/010 | CAP-16 |
| PCE-041 | PRS-041 | Audit Query & Attestation Control | PCD-CTRL-008 | CCG-3 | PEG-010 | PEO-010 | PEB-010 | AUTH-008/009/010 | CAP-16 |
| PCE-042 | PRS-042 | Integrity & Tamper-evidence Control | PCD-CTRL-008 | CCG-3 | PEG-010 | PEO-010 | PEB-010 | AUTH-008/009/010 | CAP-16 |
| PCE-043 | PRS-043 | Configuration Resolution Control | PCD-CTRL-006 | CCG-2 | PEG-011 | PEO-011 | PEB-011 | AUTH-007/009 | CAP-10 |
| PCE-044 | PRS-044 | Metadata Delivery Control | PCD-CTRL-006 | CCG-2 | PEG-011 | PEO-011 | PEB-011 | AUTH-007/009 | CAP-10 |
| PCE-045 | PRS-045 | Configuration Versioning Control | PCD-CTRL-005 | CCG-2 | PEG-011 | PEO-011 | PEB-011 | AUTH-007/009 | CAP-10 |
| PCE-046 | PRS-046 | Change Propagation Control | PCD-CTRL-005 | CCG-2 | PEG-011 | PEO-011 | PEB-011 | AUTH-007/009 | CAP-10 |
| PCE-047 | PRS-047 | Telemetry Ingestion Control | PCD-CTRL-011 | CCG-4 | PEG-012 | PEO-012 | PEB-012 | AUTH-009 | CAP-11 |
| PCE-048 | PRS-048 | Metrics Aggregation Control | PCD-CTRL-011 | CCG-4 | PEG-012 | PEO-012 | PEB-012 | AUTH-009 | CAP-11 |
| PCE-049 | PRS-049 | Trace Correlation Control | PCD-CTRL-007 | CCG-3 | PEG-012 | PEO-012 | PEB-012 | AUTH-009 | CAP-11 |
| PCE-050 | PRS-050 | Health & SLO Evaluation Control | PCD-CTRL-009 | CCG-3 | PEG-012 | PEO-012 | PEB-012 | AUTH-009 | CAP-11 |
| PCE-051 | PRS-051 | Alert Signaling Control | PCD-CTRL-011 | CCG-4 | PEG-012 | PEO-012 | PEB-012 | AUTH-009 | CAP-11 |
| PCE-052 | PRS-052 | Idempotency Coordination Control | PCD-CTRL-012 | CCG-4 | PEG-013 | PEO-013 | PEB-013 | AUTH-009 | CAP-15 |
| PCE-053 | PRS-053 | Retry & Backoff Governance Control | PCD-CTRL-012 | CCG-4 | PEG-013 | PEO-013 | PEB-013 | AUTH-009 | CAP-15 |
| PCE-054 | PRS-054 | Circuit & Bulkhead Governance Control | PCD-CTRL-012 | CCG-4 | PEG-013 | PEO-013 | PEB-013 | AUTH-009 | CAP-15 |
| PCE-055 | PRS-055 | Failover Coordination Control | PCD-CTRL-012 | CCG-4 | PEG-013 | PEO-013 | PEB-013 | AUTH-009 | CAP-15 |
| PCE-056 | PRS-056 | Recovery & Continuity Control | PCD-CTRL-012 | CCG-4 | PEG-013 | PEO-013 | PEB-013 | AUTH-009 | CAP-15 |
| PCE-057 | PRS-057 | Build Assembly Coordination Control | PCD-CTRL-004 | CCG-2 | PEG-014 | PEO-014 | PEB-014 | AUTH-009 | CAP-15 |
| PCE-058 | PRS-058 | Promotion Gate Evaluation Control | PCD-CTRL-004 | CCG-2 | PEG-014 | PEO-014 | PEB-014 | AUTH-009 | CAP-15 |
| PCE-059 | PRS-059 | Release Coordination Control | PCD-CTRL-004 | CCG-2 | PEG-014 | PEO-014 | PEB-014 | AUTH-009 | CAP-15 |
| PCE-060 | PRS-060 | Rollback Coordination Control | PCD-CTRL-012 | CCG-4 | PEG-014 | PEO-014 | PEB-014 | AUTH-009 | CAP-15 |
| PCE-061 | PRS-061 | Provisioning Coordination Control | PCD-CTRL-004 | CCG-2 | PEG-015 | PEO-015 | PEB-015 | AUTH-009 | CAP-15 |
| PCE-062 | PRS-062 | Desired-State Reconciliation Control | PCD-CTRL-006 | CCG-2 | PEG-015 | PEO-015 | PEB-015 | AUTH-009 | CAP-15 |
| PCE-063 | PRS-063 | Environment Composition Control | PCD-CTRL-004 | CCG-2 | PEG-015 | PEO-015 | PEB-015 | AUTH-009 | CAP-15 |
| PCE-064 | PRS-064 | Drift Detection Control | PCD-CTRL-006 | CCG-2 | PEG-015 | PEO-015 | PEB-015 | AUTH-009 | CAP-15 |
| PCE-065 | PRS-065 | Event Insight Derivation Control | PCD-CTRL-009 | CCG-3 | PEG-016 | PEO-016 | PEB-016 | AUTH-007/009 | CAP-13 |
| PCE-066 | PRS-066 | Aggregation & Materialization Control | PCD-CTRL-009 | CCG-3 | PEG-016 | PEO-016 | PEB-016 | AUTH-007/009 | CAP-13 |
| PCE-067 | PRS-067 | Reporting Surface Control | PCD-CTRL-010 | CCG-3 | PEG-016 | PEO-016 | PEB-016 | AUTH-007/009 | CAP-13 |
| PCE-068 | PRS-068 | Insight Governance Control | PCD-CTRL-002 | CCG-1 | PEG-016 | PEO-016 | PEB-016 | AUTH-007/009 | CAP-13 |
| PCE-069 | PRS-069 | Principle & Policy Enforcement Control | PCD-CTRL-003 | CCG-1 | PEG-017 | PEO-017 | PEB-017 | AUTH-009 | CAP-15 |
| PCE-070 | PRS-070 | Approval-By-Exception Arbitration Control | PCD-CTRL-001 | CCG-1 | PEG-017 | PEO-017 | PEB-017 | AUTH-009 | CAP-15 |
| PCE-071 | PRS-071 | Platform Element Lifecycle Governance Control | PCD-CTRL-004 | CCG-2 | PEG-017 | PEO-017 | PEB-017 | AUTH-009 | CAP-15 |
| PCE-072 | PRS-072 | Control-Plane Coordination Control | PCD-CTRL-002 | CCG-1 | PEG-017 | PEO-017 | PEB-017 | AUTH-009 | CAP-15 |
| PCE-073 | PRS-073 | Governance Evidence Aggregation Control | PCD-CTRL-008 | CCG-3 | PEG-017 | PEO-017 | PEB-017 | AUTH-009 | CAP-15 |

> **Count:** 73 Control Entities (`PCE-001..PCE-073`), 1:1 with `PRS-001..PRS-073`. **Inherited lifecycle
> (all 73):** migration-only / append-only / never-delete-ratified (via `PRS-071` / `PEG-017`; §16.2 I5).

## 19. Classification Assignment Matrix

> The matrix below groups all 73 `PCE`s by their single assigned classification class. Each `PCE` appears
> **exactly once** (Mutual Exclusivity); the union of all rows is `PCE-001..073` (Collective Exhaustiveness).

| Class (Control Domain) | CCG | Assigned Control Entities | Count |
|------------------------|:---:|---------------------------|:-----:|
| PCD-CTRL-001 — Control Authority & Decision-Rights | CCG-1 | PCE-028, PCE-032, PCE-070 | 3 |
| PCD-CTRL-002 — Governance Orchestration | CCG-1 | PCE-026, PCE-027, PCE-068, PCE-072 | 4 |
| PCD-CTRL-003 — Policy & Principle Enforcement | CCG-1 | PCE-004, PCE-011, PCE-069 | 3 |
| PCD-CTRL-004 — Control Lifecycle & Promotion | CCG-2 | PCE-001, PCE-003, PCE-007, PCE-025, PCE-036, PCE-057, PCE-058, PCE-059, PCE-061, PCE-063, PCE-071 | 11 |
| PCD-CTRL-005 — Change & Evolution Control | CCG-2 | PCE-020, PCE-037, PCE-045, PCE-046 | 4 |
| PCD-CTRL-006 — Configuration & Metadata Control Alignment | CCG-2 | PCE-043, PCE-044, PCE-062, PCE-064 | 4 |
| PCD-CTRL-007 — Traceability & Lineage Control | CCG-3 | PCE-012, PCE-022, PCE-023, PCE-024, PCE-049 | 5 |
| PCD-CTRL-008 — Audit & Evidence Control | CCG-3 | PCE-039, PCE-040, PCE-041, PCE-042, PCE-073 | 5 |
| PCD-CTRL-009 — Compliance & Conformance Control | CCG-3 | PCE-005, PCE-035, PCE-038, PCE-050, PCE-065, PCE-066 | 6 |
| PCD-CTRL-010 — Boundary & Isolation Control | CCG-3 | PCE-002, PCE-006, PCE-009, PCE-010, PCE-018, PCE-019, PCE-021, PCE-031, PCE-033, PCE-034, PCE-067 | 11 |
| PCD-CTRL-011 — Control Signal & Eventing | CCG-4 | PCE-013, PCE-014, PCE-015, PCE-016, PCE-030, PCE-047, PCE-048, PCE-051 | 8 |
| PCD-CTRL-012 — Exception, Escalation & Continuity | CCG-4 | PCE-008, PCE-017, PCE-029, PCE-052, PCE-053, PCE-054, PCE-055, PCE-056, PCE-060 | 9 |
| **Total** | — | — | **73** |

## 20. Distribution Summary

### 20.1 By Control Domain (classification class)

| Class | 001 | 002 | 003 | 004 | 005 | 006 | 007 | 008 | 009 | 010 | 011 | 012 | Total |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:-----:|
| Count | 3 | 4 | 3 | 11 | 4 | 4 | 5 | 5 | 6 | 11 | 8 | 9 | **73** |

### 20.2 By Control Group

| Control Group | Member classes | Count | Share |
|---------------|----------------|:-----:|:-----:|
| CCG-1 — Authority & Governance Control | PCD-CTRL-001/002/003 | 10 | 13.7% |
| CCG-2 — Lifecycle & Change Control | PCD-CTRL-004/005/006 | 19 | 26.0% |
| CCG-3 — Integrity & Assurance Control | PCD-CTRL-007/008/009/010 | 27 | 37.0% |
| CCG-4 — Coordination & Continuity Control | PCD-CTRL-011/012 | 17 | 23.3% |
| **Total** | 12 classes | **73** | **100%** |

### 20.3 Inheritance distribution (preserved from `PRS`/`PRD`)

| Inherited dimension | Distinct values across the 73 `PCE`s |
|---------------------|--------------------------------------|
| Governance (`PEG`) | `PEG-001..PEG-017` (17 distinct; each `PCE` inherits exactly one) |
| Ownership (`PEO`) | `PEO-001..PEO-017` (17 distinct; each `PCE` inherits exactly one) |
| Boundary (`PEB`) | `PEB-001..PEB-017` (17 distinct; each `PCE` inherits exactly one) |
| Authority anchor | AUTH-004/007/008/009/010 sets per controlled domain; all terminate at the Authority Board |
| Lifecycle | Uniform migration-only / append-only / never-delete-ratified (via `PRS-071`/`PEG-017`) |

## 21. Part 2 Validation

| Validation | Required | Observed | Result |
|------------|----------|----------|:------:|
| Control Entity coverage (`PCE` ↔ `PRS`) | 73/73 | 73/73 (bijection `PCE-nnn`↔`PRS-nnn`, `nnn`=001..073) | ✅ |
| Duplicate Control Entities | 0 | 0 (each `PCE-nnn` defined once; each `PRS` controlled once) | ✅ |
| Unassigned entities (no classification) | 0 | 0 (every `PCE` has exactly one `PCD-CTRL` class — §18/§19) | ✅ |
| Multi-classified entities (>1 class) | 0 | 0 (Mutual Exclusivity holds) | ✅ |
| Orphan entities (no `PRS`, or off-spine) | 0 | 0 (every `PCE` controls a real `PRS`; all anchored on `PE-17`/CAP-15/AUTH-009 → Authority Board) | ✅ |
| Classification completeness (MECE) | 12 MECE classes cover all | 12/12 classes; ∪ = `PCE-001..073`; ∩ = ∅ | ✅ |
| Governance conflicts | 0 | 0 (each `PCE` inherits exactly one `PEG-XXX`, unchanged; presided by `PEG-017`, not replaced) | ✅ |
| Ownership conflicts | 0 | 0 (each `PCE` inherits exactly one `PEO-XXX`, unchanged; single control owner per class via `PEO-017`) | ✅ |
| Boundary violations | 0 | 0 (each `PCE` inherits exactly one `PEB-XXX`; operates within `PEB-017`; no bypass — CFP-009) | ✅ |
| Authority-inheritance preserved | 73/73 | 73/73 (controlled-service `AUTH-*` preserved; terminal = Authority Board) | ✅ |
| Lifecycle-inheritance preserved | 73/73 | 73/73 (migration-only/append-only; no new lifecycle ID minted) | ✅ |
| Alteration of `UCOS-PEA-001..006` constructs | 0 | 0 (Control Entities are read-only controllers — CFP-010) | ✅ |
| Prohibited artifacts created (authority/lifecycle/matrix) | 0 | 0 (none minted — §15.1) | ✅ |
| `STATE-001` / `CTX-REG-001` modified | 0 | 0 (untouched — §15.1) | ✅ |
| Implementation / technology leakage | 0 | 0 (no product/cloud/runtime/framework/vendor named — PEP-010/CFP-011) | ✅ |

### 21.1 Conflict analysis (summary)

- **Coverage:** 73/73 — complete bijection, no gaps.
- **Duplicates:** 0 — injective mapping; no identifier reused.
- **Unassigned:** 0 — every entity classified.
- **Orphans:** 0 — every entity controls a live `PRS` and is anchored on the control-plane spine.
- **Governance conflicts:** 0 — exactly one inherited `PEG` per entity; the fabric *presides* (`PEG-017`)
  without replacing any `PEG-XXX` (CFP-002/CFP-010).
- **Ownership conflicts:** 0 — exactly one inherited `PEO` per entity; one accountable control owner per
  class (CFP-003); no shared/duplicated ownership.
- **Boundary violations:** 0 — exactly one inherited `PEB` per entity; all crossings honor `PEB-017` and
  the inherited `PEB-XXX` (CFP-009).

## 22. Part 2 Document Control (close)

| Field | Value |
|-------|-------|
| Artifact ID | UCOS-PEA-007 |
| Version | 0.2.0 (advanced by Part 2) |
| Status | CREATED — IN PROGRESS (Phase 9.0C.5 Part 2 — Control Entity Architecture) |
| Part 2 delivers | `PCE-001..073`; Control Entity Classification model (MECE); assignment matrix; distribution summary; Part 2 validation |
| Part 2 created (prohibited) | Authority artifacts: NONE · Lifecycle artifacts: NONE · Traceability matrices: NONE · `STATE-001`/`CTX-REG-001` changes: NONE |
| Branch | `phase-9.2-convergence` (DO NOT PUSH / DO NOT MERGE) |
| Next | Phase 9.0C.5 Part 3 — Control Mappings / Crosswalks (AUTHORIZED; not begun) |

### Part 2 Traceability addendum
- **Refines (additionally):** `UCOS-PEA-002` Service Architecture (`PRS-001..073`) — the 1:1 control anchor.
- **Refined by:** `PHASE-9.0C.5-PART-2-COMPLETION-REPORT.md`; Phase 9.0C.5 Part 3 (control mappings),
  Part 4 (`TM-CTRL-*`), Part 5 (control authority/lifecycle standards), Part 6 (validation, `CTX-REG-001`
  + `STATE-001` proposals).
- **Controls (read-only, preserved):** each `PCE-nnn` controls `PRS-nnn` while preserving its inherited
  `PEG-XXX`/`PEO-XXX`/`PEB-XXX`, authority anchor, and lifecycle semantics (CFP-010).
