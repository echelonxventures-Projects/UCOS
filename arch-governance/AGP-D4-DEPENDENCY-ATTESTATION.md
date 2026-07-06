# AGP-D4 — DEPENDENCY ATTESTATION SET

**Deliverable:** D-4 (S-4) · attest-only, append-only, fail-closed.
**Source (INV-5):** `UCOS-CAPABILITY-DEPENDENCY-GRAPH.md` (§1 layered structure, §fan-in table).
**Rule:** attest inter-capability dependency relations as recorded; unresolved dependency → surfaced
finding. Attestation records the graph; it mutates nothing.

## Layered structure (roots → leaves)

| Layer | Capabilities |
|---|---|
| **L0 ROOT (substrate)** | UCAP-09 Capability Runtime, UCAP-23 Execution (PI-2-3) — everything composes on Meta-Core |
| **Intermediate (control/domain)** | UCAP-01,03,10,11 · 22 Federation · 19 Evolution · 04 Knowledge · 06 Ontology · 07 Memory · 24 API · 21 Infra · 26/31/32 operability |
| **Leaf** | UCAP-17 Intelligence · 18 Simulation · 12 Workflow · 13 Event · 14 Economic · 15 Resource · 25 UI · 16 Learning · 20 Civilization · 29 Reality Graph |

## Critical fan-in dependencies (attested)

| Provider | Depended on by | Constitutional role |
|---|---|---|
| **UCAP-09/23** Runtime+Execution | **ALL** | Substrate; every fabric composes through it |
| **UCAP-11** Authority Engine | **ALL governed change** | Deny-by-default + AUTH-012; gates every scoped release |
| **UCAP-19** Evolution Engine | 04,06,07,14,17,18,20 | **Sole commit path** for durable mutation |
| **UCAP-22** Federation | 04,06,07,18,20,34 | Ed25519 assertion + audit primitives for federated fabrics |
| **UCAP-07** Memory + **UCAP-06** Ontology | 17 Intelligence | Intelligence **blocked** until both ratified (PI-10 ← PI-8, PI-9) |

## Dependency-risk findings (surfaced, fail-closed)

- **DEP-F1:** UCAP-17 Intelligence depends on UCAP-06 (contested) + UCAP-07 (self-attested) → transitive
  ratification risk; Intelligence cannot be soundly ratified above its dependencies.
- **DEP-F2:** UCAP-19 Evolution (sole commit path) is Class A/PROVEN — **no single-point-of-failure
  finding** on the commit path itself; noted as a concentration to monitor, not a defect.
- **DEP-F3:** Ungoverned fabrics (UCAP-26/30/31/32) sit in the intermediate operability layer yet carry
  no governed dependency edges → orphaned-in-governance (forwarded to D-6).

## Structural attestation

- **Acyclic:** YES — substrate-rooted; capability graph is a strict superset of the compiler's
  `PI-2-3 → … → PI-10/PI-11` edges (`UCOS-CAPABILITY-DEPENDENCY-GRAPH` §69).
- **Cycles detected:** 0.

**D-4 STATUS: COMPLETE — dependency structure attested (acyclic, substrate-rooted); 5 critical fan-ins
recorded; 2 dependency-risk findings surfaced (DEP-F1, DEP-F3).**
