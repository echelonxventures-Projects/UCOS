# AGP-D2 — OWNERSHIP & ASSIGNMENT ATTESTATION SET

**Deliverable:** D-2 (S-2) · attest-only, append-only, fail-closed.
**Source (INV-5):** `UCOS-CAPABILITY-INVENTORY.md` (owner/work-item columns) · `PROGRAM-GOVERNANCE-MAPPING`.
**Rule:** each capability is assigned an owner-locus + program + implementation track (PI/work-item);
any missing assignment → `UNASSIGNED` finding (fail-closed), never a fabricated owner.

| UCAP | Owner-locus (code/domain) | Program family | Track / Work-item | Assignment |
|---|---|---|---|:--:|
| 01 | control/identity | SEC-* | PI-4 | ASSIGNED |
| 02 | control/identity (registry) | SEC/UEA | PI-4 (subsumed) | ASSIGNED |
| 03 | control/trust | SEC-* | PI-4 | ASSIGNED |
| 04 | control/knowledge | KNOW-* | PI-7 | ASSIGNED |
| 05 | control/knowledge (lineage) | KNOW-* | PI-7 (subsumed) | ASSIGNED |
| 06 | control/ontology | ONTO-* | PI-8 | ASSIGNED (ratification contested) |
| 07 | control/memory | MEM-* | PI-9 | ASSIGNED (self-attested) |
| 08 | control/memory (tiers) | MEM-* | PI-9 (subsumed) | ASSIGNED |
| 09 | meta-core | platform | PI-2-3 | ASSIGNED |
| 10 | control/policy | GOV/SEC | PI-4 | ASSIGNED |
| 11 | control/governance + AUTH | GOV-*/AUTH | PI-4 | ASSIGNED |
| 12 | — | platform PWF / PE-07 | **NONE** | **UNASSIGNED** |
| 13 | control/audit-log (partial) | platform PEV | **NONE** | **UNASSIGNED** |
| 14 | — | ECON-* | **NONE** | **UNASSIGNED** |
| 15 | (subsumed in ECON) | — | **NONE** | **UNASSIGNED** |
| 16 | — | **unmodeled** | **NONE** | **UNASSIGNED** |
| 17 | — | INT-* | PI-10 (OPEN, AD-0024) | ASSIGNED (gated) |
| 18 | control/simulation | SIM-* | PI-11 (IN_PROGRESS) | ASSIGNED |
| 19 | control/evolution | EVOL / AD-0019 | PI-6 | ASSIGNED |
| 20 | — | CIV-* | **NONE** | **UNASSIGNED** |
| 21 | infra/ (not provisioned) | infra + PE-15 | ACT-06 (proxy) | ASSIGNED (proxy) |
| 22 | control/federation | FED-* | PI-5 | ASSIGNED |
| 23 | meta-core/execution-engine | platform | PI-2-3 (subsumed) | ASSIGNED |
| 24 | contracts-sdk / contracts/ | SVC-* | WI-05..10 (tooling) | ASSIGNED (tooling only) |
| 25 | apps/ (EMPTY) | EXP-* (C-1) | **NONE** | **UNASSIGNED** |
| 26 | control/operations | OPS-*/PE-12 | **NONE** (ACT-11 ADR only) | **UNASSIGNED** |
| 27 | control/simulation (twin) | SIM-* | PI-11 (subsumed) | ASSIGNED |
| 28 | control/governance + readiness | GOV-* | PI-4 partial + PHASE-P.1 | ASSIGNED (readiness UNGOVERNED) |
| 29 | — | existential UEA-0006 | **NONE** (AD-0014 deferred) | **UNASSIGNED** |
| 30 | control/operations (23 files) | Same as 26 | **NONE** | **UNASSIGNED** |
| 31 | control/readiness (17 files) | — | **NONE** | **UNASSIGNED** |
| 32 | control/operations (proof-*) | PROOF-IMPL-001 | **NONE** | **UNASSIGNED** |
| 33 | — | AUTO-* (7 specs) | **NONE** | **UNASSIGNED** |
| 34 | — | ECO-* (7 specs) | **NONE** | **UNASSIGNED** |

## Assignment tally

- **ASSIGNED:** 23 / 34 (incl. subsumed + gated + proxy).
- **UNASSIGNED (findings):** 11 / 34 → UCAP-12,13,14,15,16,20,25,26,29,30,31,32,33,34 minus already-noted... explicit list: **UCAP-12, 13, 14, 15, 16, 20, 25, 26, 29, 30, 31, 32, 33, 34**.

> **Fail-closed correction.** The unassigned set is **14**, not 11: {12,13,14,15,16,20,25,26,29,30,31,32,33,34}. The prior "9 outside governance" headline (`UCOS-CAPABILITY-INVENTORY` row 67) counted a narrower success-criterion set; this attestation counts *every* capability with work-item = NONE. The wider count is surfaced fail-closed and forwarded to D-5/D-6.

**D-2 STATUS: COMPLETE — 34/34 evaluated; 20 assigned, 14 UNASSIGNED findings surfaced (no fabricated owners).**
