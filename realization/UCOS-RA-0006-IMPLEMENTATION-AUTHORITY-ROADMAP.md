# UCOS-RA-0006 — Implementation Authority Roadmap

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-RA-0006` |
| Program | **UCOS Phase 1.5 — Realization Closure Authority** |
| Phase | RA-6 — Implementation Authority Roadmap |
| Mode | **REALIZATION-AUTHORITY SEQUENCING ONLY** — renders the final implementation order. No code, schema, architecture, requirement, invariant, or authorization produced. Construction remains reserved to the Authority Board. |
| Status | REALIZATION BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Inputs (read-only) | `UCOS-IR-0006` (Stages 0–13+N; 0 forward deps); `UCOS-RA-0001..0005`; `UCOS-EA-0002` (waves W1..W5); `AD-0014` |
| Governing constraints | INV-1..13 unchanged; `AD-0014` intact; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. No new requirements/RC/invariants/authorization. **0 forward dependencies; 0 REDESIGN.** |

---

## 0. Purpose

This roadmap renders the **final implementation order** for the transition from CERTIFIED to FULLY REALIZED. It
adopts the ratified, forward-dependency-free stage topology of `UCOS-IR-0006` (validated: 0 forward
dependencies) and, for each stage, states **Objective / Inputs / Outputs / Acceptance Criteria / Exit
Criteria**. Stages 0–5 are the realized Minimum Constitutional Runtime (recorded for continuity); Stages 6–N are
the governed forward frontier. Every build stage (Stage 1+) remains reserved to the Authority Board and gated by
the Article IX lock; this roadmap orders the work, it does not authorize it.

**Stage classes:** DONE (realized of record) · GATE (evidentiary/authorization; no build) · BUILD (additive
construction under a scoped release) · ENACT (Board invariant enrollment; no build).

---

## Stage 0 — Governance-Integrity Restoration & Execution Authorization  *(GATE; no build)*
- **Objective:** close the P0 governance-integrity blockers and lift the standing construction block (open G0).
- **Inputs:** `AUTH-REST-004` (documentary chain restoration, AUTH-012 v1.0.13); `UCOS-RA-0007`; recorded program state + test corpus.
- **Outputs:** `REAL-C-05` independent attestation; `REAL-M-03` independent re-measurement; `UCOM-ULTIMATE-CERT-002` (re-issued); Board authorization act + block-lift record.
- **Acceptance criteria:** EA-B-P0-1 ∧ EA-B-P0-2 ∧ EA-B-P1-7 CLOSED (evidentiary); Board act cites all three as PASS.
- **Exit criteria:** **G0 = PASS** — `UCOS-CONSTRUCTION-BLOCKED` lifted for the authorized scope (EA-B-P0-3 / C-6 / UCC-5). *Nothing above builds until this exits.*

## Stage 1 — Substrate (Meta-Core)  *(DONE)*
- **Objective:** metadata-driven Registry/Metadata/Config/Exec/Event kernel.
- **Inputs:** Stage 0 genesis roots. **Outputs:** PI-2/3 (`AD-0016`).
- **Acceptance:** 269/269; contract-first; 0 hard-coded logic. **Exit:** MCR substrate realized. ✅

## Stage 2 — Control Plane  *(DONE)*
- **Objective:** Identity/Trust/Policy/Security/Authority with deny-by-default PEP.
- **Inputs:** Stage 1. **Outputs:** PI-4 (`AD-0017`).
- **Acceptance:** S1/S3/S4 enforced; deny-by-default; 65/65 (then folded into 269/269). **Exit:** control plane realized. ✅ *(caveat: FAB-POL vocabulary → Stage 6 RR-4)*

## Stage 3 — Governance Core  *(DONE)*
- **Objective:** Evolution (sole commit path) + Audit + State/Lifecycle + Governance gates.
- **Inputs:** Stage 2 + genesis bootstrap. **Outputs:** PI-6 (`AD-0019`); audit + lifecycle + gates.
- **Acceptance:** Evolution-only commit; hash-chained audit. **Exit:** governance core realized. ✅ *(caveat: duplication → Stage 6 RR-3)*

## Stage 4 — Federation  *(DONE)*
- **Objective:** local-sovereign, deny-by-default, clamped-trust, namespace-isolated federation.
- **Inputs:** Stages 2–3. **Outputs:** PI-5 (`AD-0018`); Ed25519 signed assertions.
- **Acceptance:** 90/90 (federation + adversarial); 0 residual High/High. **Exit:** federation realized. ✅

## Stage 5 — Core Data Primitives  *(DONE — attestation pending)*
- **Objective:** Knowledge + Ontology + Memory + ops ADRs.
- **Inputs:** Stage 3. **Outputs:** PI-7 (`AD-0020`), PI-8 (`AD-0021`→AD-0023), PI-9 (`AD-0023`).
- **Acceptance:** 269/269; `ONTO-RAT-001`, `MEM-RAT-003`. **Exit:** MCR data primitives realized. ✅ *(residual: independent attestation of PI-8/PI-9 = Stage 0 RR-1)*

> **Stages 0–5 = realized Minimum Constitutional Runtime** (correctness-complete single-node kernel). Everything below is the forward frontier, buildable only after Stage 0 exits (G0 = PASS).

## Stage 6 — Primitive Convergence & Hardening  *(BUILD; Optional)*
- **Objective:** eliminate P1 architectural convergence debt.
- **Inputs:** Stages 2–5 (fabrics exist); G0 PASS.
- **Outputs:** `AUDIT-UNIV-001` (6→1), `AUTH-UNIV-001`, `LIFE-UNIV-001`; registry-extensible predicate vocabulary; memory authorities as metadata.
- **Acceptance:** EA-B-P1-1/-2/-3/-4/-8 CLOSED; 0 divergent audit/authority/lifecycle paths; baseline green.
- **Exit criteria:** universal primitives adopted; UCC-7 satisfied; 0 core-dir change.

## Stage 7 — Constitutional Enactment  *(ENACT; no build)*
- **Objective:** Board enrollment of the invariant set required for the frontier.
- **Inputs:** Stage 0 (chain restoration is the enrollment precondition); `UCOS-INV-0001`; `EXIST-001`.
- **Outputs:** **INV-CORE-12 Non-Actuation enrolled (ahead of any AI actor)**; `EXIST-001` CRC enacted (INV-18↔INV-6); disposition of INV-17/INV-14/INV-16/INV-19/INV-20 per `AUTH-013-AMD-001`.
- **Acceptance:** enrollments recorded on `AUTH-012`; conflicts (INV-17↔INV-5, INV-18↔INV-6) resolved of record.
- **Exit criteria:** Non-Actuation enrolled (hard precondition for Stage 9); CRC enacted (precondition for Stage 8 T-2/T-7). *Existential invariants remain held under `AD-0014` unless the Board elects otherwise.*

## Stage 8 — Temporal Realization (FAB-TIME)  *(BUILD)*
- **Objective:** realize the temporal fabric per `UCOS-RA-0003` (T-1..T-7).
- **Inputs:** Stages 3/4/5; Stage 7 (CRC for T-2/T-7). **Outputs:** additive `src/control/time/*`.
- **Acceptance:** UR-TIME-01..07 realized additively; INV-5/6/9/10 unweakened; 0 REDESIGN.
- **Exit criteria:** bi-temporal + causal-clock + frame-locality + century-continuity + temporal-governance operational; CT-F5 discharged at realization.

## Stage 9 — Cognition (Intelligence, FAB-INTEL)  *(BUILD; safety-gated)*
- **Objective:** governed cognition (propose-not-act) per `INTEL-001`.
- **Inputs:** Stage 5 (Knowledge/Ontology/Memory), Stage 2 (Policy), Stage 3 (Evolution), **Stage 7 (INV-CORE-12 enrolled — hard precondition)**.
- **Outputs:** PI-10 build under `AD-0024`; I1–I12 adversarial suite.
- **Acceptance:** deny-by-default; Evolution-only commit; determinism-quarantined; I1–I12 green; **MUST NOT precede INV-CORE-12**.
- **Exit criteria:** Intelligence fabric ratified; RR-8 CLOSED.

## Stage 10 — Projection (Simulation, FAB-SIM)  *(BUILD)*
- **Objective:** non-actuating what-if/projection fabric per `SIM-PLAN-001..003`.
- **Inputs:** Stage 5 (Ontology), Stage 3 (State/Evolution/Governance), Stage 8 (temporal for time-projection).
- **Outputs:** PI-11 build under `AD-0022`; S1–S12 adversarial suite. **Acceptance:** sandboxed; Evolution-only commit; 0 residual High/High. **Exit:** Simulation ratified.

## Stage 11 — Economic Fabric (FAB-ECON)  *(BUILD)*
- **Objective:** propose-not-act economic fabric per `ECON-001`.
- **Inputs:** Stage 3, Stage 5; **AUTH-012 ledger restoration first** (value-bearing sensitivity).
- **Outputs:** PI-13 build under a scoped release; conservation-checked settlement; EC1–EC15 tests. **Acceptance:** no real-money path without AD-0009; 0 residual High/High. **Exit:** Economic ratified.

## Stage 12 — Civilization Fabric (FAB-CIV)  *(BUILD; DEFERRED — AD-0014)*
- **Objective:** conceptual, non-actuating civilization modeling per `CIV-001` / `CIV-GOV-001` v1.1.0.
- **Inputs:** Stage 5, Stage 4, Stage 3, Stage 10 (Simulation), **`AD-0014` disposition**.
- **Outputs:** PI-12 build only upon a Board `AD-0014` release. **Acceptance:** non-actuating; C14 actuation-breach structurally closed. **Exit:** held under `AD-0014`; out of scope until Board acts.

## Stage 13 — Platform-Factory Catalog & Scale-Out  *(BUILD)*
- **Objective:** enumerate platform classes over INV-13; build durable/distributed adapters (production).
- **Inputs:** Stage 1 mechanism; Stages 5–8 (full-fidelity classes); Stage 11 (exchange classes); `UCOS-RA-0005`.
- **Outputs:** governed platform-class catalog (RR-5 / EA-B-P1-6); FAB-OPS durable/distributed adapters (EA-B-P1-5); Operational Certification (UCC-4).
- **Acceptance:** "any platform" provable at catalog layer; scale beyond ~10⁶; G12-1/2/3 CLOSED; measured NFRs within floors.
- **Exit criteria:** distributed production runtime operational; UCC-4 CLOSED (see `UCOS-RA-0005`).

## Stage N — Unknown-Future Admission  *(BUILD; standing capability)*
- **Objective:** operate the admission protocol so RC-068..RC-100+ enter by registration.
- **Inputs:** Stage 6 (governance hardening), Stage 7 (INV-20 umbrella if elected).
- **Outputs:** governed requirements-admission gate (RR-9). **Acceptance:** new dimensions enter without baseline re-authoring. **Exit:** standing admission gate operational.

---

## 1. Final implementation order & parallelism

```
Stage 0 [GATE: G0]  ──►  ┌─ Stage 6 [convergence, optional]
(no build; W1→W2→W3)     ├─ Stage 7 [enactment: INV-CORE-12 + CRC]
                         │      ├─► Stage 8 [temporal]
                         │      └─► Stage 9 [intelligence]  (HARD-GATED on Stage 7 INV-CORE-12)
                         │                └─► Stage 10 [simulation] ─► Stage 12 [civilization, AD-0014]
                         │      └─► Stage 11 [economic]
                         └─────────► Stage 13 [catalog + scale-out → UCC-4]  · Stage N [admission]
```

- **Critical path to a sound kernel:** Stage 0 → Stage 6 → Stage 7.
- **Critical path to PRODUCTION:** Stage 0 → Stage 13 (durable/distributed adapters + UCC-4).
- **Parallelizable after Stage 5 + 7:** Stage 6, Stage 8, Stage 11.
- **Serialized on safety:** Stage 9 (Intelligence) never precedes Stage 7 (INV-CORE-12). Stage 12 gated on Stage 10 **and** `AD-0014`.
- **Forward dependencies: 0** (every stage depends only on equal-or-lower stages; validated `UCOS-IR-0006 §3`).

---

## 2. Determination

> **A final, forward-dependency-free implementation order exists (Stage 0..N).** Stages 0–5 (the Minimum
> Constitutional Runtime) are realized of record; Stage 0 is the evidentiary/authorization gate that opens the
> frontier; Stages 6–13+N are governed BUILD/ENACT steps with **0 forward dependencies** and **0 REDESIGN**. The
> next real work is **not more substrate** but (a) Stage 0 governance-integrity + lock-lift, (b) Stage 6
> convergence, (c) Stage 7 enactment — after which the temporal, cognition, projection, economic, and scale
> frontiers become buildable in strict order, with Intelligence hard-gated behind Non-Actuation and Civilization
> held under `AD-0014`.

## 3. Scope discipline

No code, schema, architecture, requirement, invariant, or authorization was produced. INV-1..13, `AUTH-012`,
`AD-0014`, and the Article IX lock are unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands; construction of every stage
remains reserved to the Authority Board.

## 4. Traceability

- **Consumes:** `UCOS-IR-0006` (stage topology); `UCOS-RA-0001..0005`; `UCOS-EA-0002` (waves); `AD-0014`.
- **Refined by:** `UCOS-RA-0007` (Stage 0 authorization closure), `UCOS-RA-0008` (Final Determination).
- **Owner:** UCOS Authority Board.

**END `UCOS-RA-0006` — IMPLEMENTATION AUTHORITY ROADMAP · STAGES 0..13 + N · STAGES 0–5 DONE (MCR) · STAGE 0 = G0 GATE · 0 FORWARD DEPS · INTELLIGENCE HARD-GATED ON INV-CORE-12 · CIVILIZATION HELD UNDER AD-0014 · 0 REDESIGN · SEQUENCING ONLY.**
