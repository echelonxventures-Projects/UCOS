# REG-VAL-001 — Artifact Registry Integrity Report

| Field | Value |
|-------|-------|
| Artifact | **REG-VAL-001 — Registry Integrity Report** |
| Program step | **REG-001 — Artifact Registry Reconciliation** |
| Target ledger | `.claude/context/UCOS-ARTIFACT-REGISTRY.md` (`CTX-REG-001`) |
| Method | Read-only audit — on-disk existence (`architecture/**`, root `AD-*.md`) cross-checked against registry rows/sections |
| Mode | **AUDIT / DETECTION ONLY** — no mutation of any canonical ledger; findings + recommendations only |
| Date | 2026-07-01 |
| Verdict | **REGISTRY INCONSISTENT — 4 fabric sets unregistered; out-of-order sections; 0 duplicate rows** |

> **Scope note.** Authorization acts `AD-0016..0020` are decision records; their canonical home is the
> **AUTH-012 Decision Log** (audited in REG-VAL-002), not the artifact registry. This report audits
> **fabric specification-set** registration and registry structural integrity. AD acts appear in the
> registry only as *input/refines* citations, which is consistent with prior practice (AD-0012 etc.).

---

## 1. Existence-vs-Registration matrix

Legend: ● present · ○ absent.

| Increment | Set | On disk (`architecture/`) | Registered in `CTX-REG-001` | Finding |
|-----------|-----|:-------------------------:|:---------------------------:|---------|
| PI-5 | FED-* (6 specs) | ● `architecture/federation/` (GOV/SEC/PROV/AUD/ARCH/RAT-001) | ○ **no Federation section/rows** | **MISSING REGISTRATION** |
| PI-6 | EVO-* (6 specs per AD-0019) | ○ **no `architecture/evolution/`** | ○ absent | **MISSING ARTIFACT + MISSING REGISTRATION** |
| PI-7 | KNOW-* (8 specs per AD-0020) | ○ **no `architecture/knowledge/`** | ○ absent | **MISSING ARTIFACT + MISSING REGISTRATION** |
| PI-8 | ONTO-* (8 specs) | ● `architecture/ontology/` | ● Ontology section (8 rows) | OK |
| PI-9 | MEM-* (8 specs) | ● `architecture/memory/` | ○ **no Memory section/rows** | **MISSING REGISTRATION** |
| PI-10 | INT-* (8 specs) | ● `architecture/intelligence/` | ● Intelligence section (8 rows) | OK |
| PI-11 | SIM-* (8 specs) | ● `architecture/simulation/` | ● Simulation section (8 rows) | OK |

## 2. Findings

### F-R1 — Missing registration: PI-5 Federation (`FED-*`) — HIGH
The six ratified `FED-*` design specs exist on disk (`architecture/federation/`) and are the foundational
reference reused by every later fabric (ONTO/MEM/INT/SIM all cite `FED-SEC-001`/`FED-AUD-001`/
`FED-PROV-001`/`FED-ARCH-001`), yet **no Federation Fabric Foundations section or rows exist** in the
registry. `FED-*` appears only as *input citations* inside downstream rows. The most-reused fabric is the
least-registered — a structural inversion.

### F-R2 — Missing artifact + registration: PI-6 Evolution (`EVO-*`) — HIGH
`AD-0019` authorizes and refines `EVO-GOV-001 / EVO-SEC-001 / EVO-ARCH-001 / EVO-GOVERNOR-001 / EVO-FED-001
/ EVO-AUD-001`, but **no `architecture/evolution/` directory and no `EVO-*` spec files exist**, and there is
**no registry entry**. Only the *implementation* (`packages/platform-runtime/src/control/evolution/*`) and
the root report `PI6-*` exist. The design-spec tier that `AD-0019` claims as its basis is absent from both
disk and registry. (Cross-reference failure — see REG-VAL-002.)

### F-R3 — Missing artifact + registration: PI-7 Knowledge (`KNOW-*`) — HIGH
`AD-0020` authorizes and refines `KNOW-GOV-001/002, KNOW-ARCH-001, KNOW-SEC-001, KNOW-FED-001, KNOW-AUD-001,
KNOW-THREAT-001, KNOW-READINESS-001`, but **no `architecture/knowledge/` directory and no `KNOW-*` spec
files exist**, and there is **no registry entry**. Only the implementation
(`packages/platform-runtime/src/control/knowledge/*`, 20 modules, 185/185 tests per `PI7-IMP-001`) and the
root report exist. Same class as F-R2.

### F-R4 — Missing registration: PI-9 Memory (`MEM-*`) — HIGH
The eight `MEM-*` specs exist on disk (`architecture/memory/`) and are recorded in the **state ledger**
(PROJECT-STATE §0S PHASE 18), and are cited as a design predecessor by the registered SIM section
(“design predecessors ONTO-*/MEM-*/INT-*”), but **no Memory Fabric Foundations section or rows exist** in
the registry. The registry references `MEM-*` without ever registering it — a dangling forward reference.

### F-R5 — Out-of-order sections — MEDIUM
Registered fabric sections appear in this physical order:
`Intelligence (PI-10) @~L1161 → Ontology (PI-8) @~L1201 → Simulation (PI-11) @~L1239`.
PI-8 is registered **after** PI-10, and PI-9 (which should sit between PI-8 and PI-10) is absent. Increment
order is not monotonic. Root cause: parallel phase authoring + append-only writes with no re-sort
(PHASE 17 Ontology was appended after the pre-existing PHASE 19 Intelligence section).

### F-R6 — No numbering conflicts / no duplicate rows — PASS
Every registered artifact ID (`INT-*`, `ONTO-*`, `SIM-*`) is unique; no duplicate rows; no ID collisions
across the three registered sections. Each set uses a distinct prefix and a distinct metadata namespace
(`intelligence:*`, `ontology:*`, `simulation:*`). **No conflict detected.**

## 3. Cross-reference integrity (registry → cited inputs)

| Cited input (in registry rows) | Resolves on disk? | Note |
|--------------------------------|:-----------------:|------|
| `FED-GOV/SEC/PROV/AUD/ARCH-001` | ● yes | cited but the set itself is unregistered (F-R1) |
| `EVO-*` (via AD-0019 lineage) | ○ **no** | broken — specs absent (F-R2) |
| `KNOW-*` (via AD-0020 lineage) | ○ **no** | broken — specs absent (F-R3) |
| `MEM-*` (SIM predecessors) | ● yes on disk | cited but unregistered (F-R4) |
| `AD-0016..0020` | ● yes (root) | present as files; not AUTH-012-recorded (REG-VAL-002) |
| `UCOS-SEC-ARCH-001`, `AUTH-003/008/009/012`, `UCOS-CONST-001` | ● yes | OK |

## 4. Summary of findings

| ID | Severity | Class | Item |
|----|:--------:|-------|------|
| F-R1 | HIGH | Missing registration | PI-5 FED-* |
| F-R2 | HIGH | Missing artifact + registration | PI-6 EVO-* |
| F-R3 | HIGH | Missing artifact + registration | PI-7 KNOW-* |
| F-R4 | HIGH | Missing registration | PI-9 MEM-* |
| F-R5 | MEDIUM | Out-of-order | INT(10) → ONTO(8) → SIM(11) |
| F-R6 | — | Duplicate / numbering | **none — PASS** |

**Registered fabric sets:** 3/7 (ONTO, INT, SIM). **Unregistered but on disk:** FED, MEM.
**Absent on disk & unregistered:** EVO, KNOW.

## 5. Recommendations (no action taken — audit only)

1. **REC-R1 (Trusted Operation).** Add append-only registry sections for **FED-*** (PI-5) and **MEM-***
   (PI-9) with rows tracing to the on-disk files. This is a documentation/registration Trusted Operation.
2. **REC-R2 (investigate first).** For **EVO-*** and **KNOW-***: determine whether the design specs were
   (a) never persisted (parallel-authoring loss) or (b) stored elsewhere. If never persisted, the
   design-spec tier must be reconstructed from `AD-0019`/`AD-0020` + the shipped implementations before
   registration; do **not** register phantom rows for absent files.
3. **REC-R3 (Trusted Operation).** Normalize section order to monotonic PI order, or add an index table at
   the top of the fabric-registry block mapping PI → section → line, so append-order need not equal
   PI-order.
4. **REC-R4.** Adopt a registration gate: a fabric phase is “COMPLETE” only when its specs are (a) on disk,
   (b) registered in `CTX-REG-001`, and (c) recorded in `PROJECT-STATE`. FED/EVO/KNOW/MEM currently fail
   this tri-condition.

## 6. Traceability
- **Audited:** `CTX-REG-001` (`.claude/context/UCOS-ARTIFACT-REGISTRY.md`).
- **Evidence:** `architecture/{federation,ontology,memory,intelligence,simulation}/`; absent
  `architecture/{evolution,knowledge}/`; root `AD-0016..0020`; `PI6-*`/`PI7-*` reports.
- **Companion reports:** REG-VAL-002 (decision log), REG-VAL-003 (state ledger).
- **Owner:** UCOS Authority Board (Governance / Registry custodian).

**END REG-VAL-001 — REGISTRY INTEGRITY REPORT · AUDIT ONLY · NO LEDGER MUTATION.**
