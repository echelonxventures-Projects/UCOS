# UCOS-RA-0003 — Temporal Realization Specification

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-RA-0003` |
| Program | **UCOS Phase 1.5 — Realization Closure Authority** |
| Phase | RA-3 — Temporal Realization Specification |
| Mode | **REALIZATION-AUTHORITY SPECIFICATION ONLY** — specifies the **minimum realizable architecture** for the already-stated temporal requirements. No new requirement, no new RC class, no ontology/schema/code, no invariant enrollment, no architecture change. |
| Status | REALIZATION BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Inputs (read-only) | `UCOS-REQ-0005` (UR-TIME-01..07 / RC-051..058, STATED-REQUIREMENT); `UCOS-IR-0006` (Stage 8); `EXIST-001` (Computation-Realizer Contract); PI-5 federation; `O-10`/`O-15`; `PEL-001`; INV-1..13 |
| Governing constraints | INV-1..13 unchanged (INV-5, INV-6, INV-9, INV-10 prevailing); INV-19 PROPOSED (not enrolled); `AD-0014` intact; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. **0 REDESIGN** — every construct is an additive specialization. |

---

## 0. Purpose & non-scope

The temporal cluster (RR-7) is the corpus's **highest residual** — the single dimension where the
Constitutional Completeness Test fails outright (`CT-F5`). `UCOS-REQ-0005` already closed the cluster **at the
requirements layer** (RC-051/052/053/054/055/057/058 → STATED-REQUIREMENT). This artifact discharges the
Phase RA-3 charter: it specifies the **minimum realizable architecture** (FAB-TIME, Stage 8), its dependencies,
and its acceptance criteria — **without** authoring a temporal data model, schema, ontology edit, or code, and
**without** creating any new requirement or RC class. Realization is a future scoped Article IX release; this is
the design-of-record that makes it buildable additively.

> **No-redesign guarantee (carried from `UCOS-REQ-0005 §0`).** Every temporal capability below is expressible as
> an additive specialization of a ratified construct (INV-10 append-only order; `O-15` locality; `O-10` habitat;
> PI-5 federation; `PEL-001` lifecycle; `EXIST-001` CRC). Where a temporal capability and an INV-1..13 invariant
> appear to conflict, **the ratified invariant prevails** and the temporal capability is re-expressed as a
> conformant extension.

---

## 1. Analysis of the six temporal subjects

| Subject (Phase RA-3) | Requirement of record | Prevailing invariant(s) | Realizable additively via |
|----------------------|-----------------------|-------------------------|---------------------------|
| **Relativistic Time** | UR-TIME-02 / RC-052 | INV-6, INV-9, EX1 | Logical/causal clocks + signed evidence; async signed-quorum ratification; `EXIST-001` CRC (INV-6-conformant, determinism-quarantined) |
| **Multi-Reference Frames** | UR-TIME-04 / RC-054 | INV-5, INV-1 | Frame = federation-locality axis (PI-5); single-SoR per (domain, frame); reconciliation not unification |
| **Temporal Continuity** | UR-TIME-01 / RC-051 | INV-10 | Bi-temporal metadata (valid-time + transaction-time) atop the unchanged append-only commit path |
| **Century-Scale Continuity** | UR-TIME-05 / RC-057 | INV-10, IP-14 | Pluggable `CredentialVerifier` (crypto-agility); segmented/checkpointed ledger; governed `AUTH-012` succession |
| **Planetary Time** | UR-TIME-07 / RC-055 + UR-TIME-03 / RC-053 | `O-10`, `O-15`, INV-1 | (locality × time-interval) as attributes/relationships on existing `O-10 Habitat` / `entity` / `O-15` |
| **Simulation Time** | UR-TIME-03 causal + Stage 10 dependency | INV-6, sandbox isolation | Scenario clock as a sandboxed projection over bi-temporal records; never on the commit path |

**Determination of the analysis:** all six subjects are **admissible and additively realizable**; none forces a
core-primitive change or a constitutional expansion. This is consistent with `ULT-TEST-001` (0 REDESIGN) and
`CIV-STRESS-001` BP-15 (the "INV-6-vs-relativistic-latency WALL" is discharged by the CRC, not by weakening
INV-6).

---

## 2. Minimum Realizable Architecture — FAB-TIME (Stage 8)

FAB-TIME is specified as an **additive control-layer fabric** (`src/control/time/*` at build time), composed of
six capability modules, each realizing exactly one UR-TIME class with zero substrate-core-dir change.

| Module | Realizes | Minimum realizable construct (additive; no code here) | Prevailing invariant preserved |
|--------|----------|-------------------------------------------------------|--------------------------------|
| **T-1 Bi-temporal record** | UR-TIME-01 (RC-051) | valid-time (effective-from/to) + transaction-time (INV-10, unchanged) as governed metadata on any record; corrections are forward migrations (IP-14), never destructive time travel | INV-10 |
| **T-2 Causal-clock ordering** | UR-TIME-02 (RC-052) | logical/causal clock + signed-evidence ordering; **no global-now**; cross-frame ordering is causal + signed; ratification degrades to async signed-quorum under partition | INV-6, INV-9, EX1 |
| **T-3 Reference-frame locality** | UR-TIME-04 (RC-054) | frame as a PI-5 federation-locality; single-SoR per (domain, frame); cross-frame views are provenance-tagged, read-only, locally re-ratified projections; no shared mutable global frame | INV-5, INV-1 |
| **T-4 Spatial-temporal binding** | UR-TIME-03 (RC-053) + UR-TIME-07 (RC-055) | (locality × time-interval) expressed as attributes/relationships on existing `O-15`/`O-10`/`entity`; temporal (before/after/during/overlaps) + causal (causes/enables/precludes) relationship classes of record | `O-15`/`O-10` (additive), INV-1 |
| **T-5 Century-scale continuity** | UR-TIME-05 (RC-057) | pluggable `CredentialVerifier` (post-quantum-capable, migration-only re-anchoring); signed audit checkpoints + segmented ledger for offline verifiability; governed authority/custodian succession on `AUTH-012` | INV-10, IP-14 |
| **T-6 Temporal governance** | UR-TIME-06 (RC-058) | valid-time interval (effective-from/optional sunset) on every governed decision; time-scoped delegated authority with fail-closed lapse; deterministic temporal precedence over `AUTH-009 §6.2` | INV-3, AUTH-009 |
| **T-7 Simulation clock** *(consumed by Stage 10)* | UR-TIME-03 causal + FAB-SIM | scenario/projection clock as a sandboxed read-only projection over T-1 bi-temporal records; determinism-quarantined per CRC; never on the commit path | INV-6, sandbox |

### 2.1 Determinism preservation (the decisive constraint)

Any computation contributing to a governed temporal decision must satisfy the `EXIST-001` **Computation-Realizer
Contract** (INV-6-conformant, at-least-once + idempotent + tolerant reader, with the determinism-quarantine
verifier gate). Relativistic tolerance (T-2) therefore **never** places non-deterministic output on the commit
path — INV-6 / EX1 prevail unweakened. This is the mechanism that discharges the CT-F5 / BP-15 conflict
additively rather than by redesign.

---

## 3. Dependencies (Stage 8 inbound)

| Dependency | Provides | Status of record |
|------------|----------|------------------|
| Stage 3 (State / Evolution — PI-6) | Commit path for T-1 bi-temporal metadata; sole mutation path | Realized |
| Stage 4 (Federation — PI-5) | Frame-as-locality substrate for T-3 (local sovereignty, clamped trust, namespace isolation) | Realized |
| Stage 5 (Ontology `O-15` / `O-10` — PI-8) | Spatial locality + habitat constructs for T-4 | Realized (attestation pending, RR-1) |
| Stage 7 (Constitutional enactment) | INV-18↔INV-6 CRC enactment (for T-2/T-7 determinism); INV-19 cosmological locality (strengthens T-3/T-4, **optional** — T-3/T-4 realizable without it) | Analysis complete; Board enactment pending |
| `EXIST-001` CRC | Determinism-quarantine contract for T-2/T-7 | Resolution authored; enactment reserved to Board |

> **Enrollment note.** T-1/T-3/T-4/T-5/T-6 are realizable under the **current** invariant set (INV-1..13).
> Only T-2/T-7 *determinism-under-latency* depends on **enacting** the already-authored `EXIST-001` CRC
> (INV-18↔INV-6). No new invariant must be created; INV-19 would *strengthen* but is not *required*.

---

## 4. Acceptance criteria (realization-layer; binary)

| Module | Acceptance criterion (TRUE ⇒ realized) |
|--------|----------------------------------------|
| T-1 | valid-time and transaction-time distinguishable on any governed record; transaction-time remains INV-10 append-only; 0 destructive time travel |
| T-2 | no realized path depends on a synchronous global clock; cross-frame ordering causal + signed; ratification degrades to async signed-quorum under partition without violating INV-5/INV-6 |
| T-3 | single-SoR per (domain, frame) demonstrable; cross-frame access is federation-only; no shared mutable global frame; INV-5/INV-1 preserved |
| T-4 | (locality × time) expressible on existing constructs with 0 new core ports; temporal + causal relationship classes of record; `O-15`/`O-10` extended additively, never redesigned |
| T-5 | no cryptographic primitive assumed permanent; ledger verifiability defined independent of any single key/era; succession is a governed append-only `AUTH-012` act |
| T-6 | governed decisions carry explicit valid-time; authority lapse is fail-closed; time-scoped precedence deterministic + auditable |
| T-7 | simulation clock is a sandboxed read-only projection; determinism-quarantined; never mutates a system-of-record |
| **FAB-TIME (whole)** | all seven modules realized additively in `src/control/time/*`; 0 substrate-core-dir change; baseline stays green; INV-1..13 unweakened; 0 REDESIGN |

---

## 5. Determination

> **A minimum realizable temporal architecture (FAB-TIME, seven modules T-1..T-7) exists and is fully additive.**
> The six temporal subjects — relativistic time, multi-reference frames, temporal continuity, century-scale
> continuity, planetary time, and simulation time — are each realizable as a specialization of a ratified
> construct, with the prevailing invariant preserved in every case and determinism-under-latency discharged by
> the `EXIST-001` CRC. The temporal cluster's outright completeness failure (CT-F5) is therefore a **realization
> frontier, not a coverage gap or a redesign** — buildable at Stage 8 after G0 and Stage 7 enactment. This
> artifact specifies; it does not build, enroll, or authorize.

## 6. Scope discipline

No source code, schema, data model, ontology edit, requirement, RC class, invariant, or authorization was
produced or modified. `O-14/O-15`, `O-10`, INV-1..13, `AUTH-012`, `AD-0014`, and the Article IX lock are
unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands.

## 7. Traceability

- **Consumes:** `UCOS-REQ-0005` (UR-TIME-01..07); `EXIST-001` (CRC); PI-5; `O-10`/`O-15`; `PEL-001`; INV-10/INV-5/INV-6/INV-9/INV-3.
- **Evidence:** `CIV-STRESS-001` BP-15; `ULT-TEST-001` RM-8/RM-9 (crypto-agility, ledger longevity); `UCOS-UEA-0007` Q1/Q2.
- **Positioned by:** `UCOS-IR-0006` Stage 8; `UCOS-RA-0002` (dependency closure); `UCOS-RA-0006` (roadmap).
- **Owner:** UCOS Authority Board.

**END `UCOS-RA-0003` — TEMPORAL REALIZATION SPECIFICATION · FAB-TIME (T-1..T-7) · MINIMUM REALIZABLE ARCHITECTURE · 6 SUBJECTS ADDITIVELY REALIZABLE · INV-5/6/9/10 PREVAIL · DETERMINISM VIA EXIST-001 CRC · 0 NEW REQUIREMENT · 0 RC CLASS · 0 REDESIGN · SPECIFICATION ONLY.**
