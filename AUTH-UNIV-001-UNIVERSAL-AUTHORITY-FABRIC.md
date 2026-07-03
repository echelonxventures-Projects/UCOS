# PHASE R3 — Universal Authority Review · Composable Authority Fabric

> **STATUS: REVIEW COMPLETE — COMPOSABLE AUTHORITY FABRIC SPECIFIED (DESIGN / PROPOSAL)**
> DESIGN & CONSOLIDATION ONLY · NO CODE · NO IMPLEMENTATION · NO AUTHORIZATION
> DOES **NOT** AMEND, SUPERSEDE, OR DELETE `AUTH-001..012` (immutable Authority Layer)
> DOES NOT MODIFY INV-1..13 · DOES NOT OVERRIDE AUTH-012 · DOES NOT RELEASE ARTICLE IX
> `UCOS-CONSTRUCTION-BLOCKED` UNCHANGED · REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `AUTH-UNIV-001` |
| Phase | **R3 — Universal Authority Review** |
| Name | Universal Composable Authority Fabric |
| Classification | Consolidation specification (review + normalization + proposal) |
| Mode | **ANALYSIS + DESIGN ONLY** — logical collapse of duplicated authority *models* into one composable fabric; no source code, no runtime, no amendment of ratified canon |
| Subordinate to | `AUTH-001..012` (esp. **AUTH-009** governance canon), `UCOS-CONST-001`, `UCOS-ASR-NFR-001` v1.0.1 (INV-1..13), Governance Baseline 1.0.0 |
| Governing constraint | Authority Layer is **immutable/append-only** (AUTH-009 §6.6); this artifact **composes over** it, it does not rewrite it |
| **DETERMINATION** | **COLLAPSE FEASIBLE — ONE COMPOSABLE AUTHORITY FABRIC** (conditions UAF-C1..UAF-C4) |

---

## 1. Mandate & Scope

PHASE R3 requires: (a) review **all** authority constructs across the program, (b) identify **duplicated
authority models**, and (c) **collapse** them into **one composable authority fabric**, output `AUTH-UNIV-001`.

Because the root Authority Layer (`AUTH-001..012`) is a ratified **immutable record** whose amendment is an
Approval-Required Operation (AUTH-009 §6.6/§8) and construction is under the Article IX lock, "collapse" is
executed here as a **behaviour-preserving logical normalization**: a single **Authority Meta-Model + Authority
Registry** onto which every existing authority construct maps as a *typed instance*. No ratified construct is
edited, merged away, or deleted; the duplication is removed at the **model** level (one fabric, many
instances) rather than by destroying artifacts.

## 2. Method

- **Inventory** every authority-bearing construct family across the Authority Layer, platform, data, control,
  and all fabrics (evidence: direct repository inspection of `.claude/authority/**` and `architecture/**`).
- **Cluster** constructs by behaviour to expose the recurring archetypes and the shared invariant spine.
- **Define** the composable fabric (spine + archetypes + composition operators + registry).
- **Fold** each existing construct onto an archetype (the collapse map), proving no capability is lost.

No optimistic classification: every fold is justified against a construct that actually exists in the repo.

## 3. Authority-Construct Inventory (the review)

Authority is currently modelled in **≈14 independent places**, each re-declaring 8–14 constructs. Representative
inventory (families, not exhaustive per-ID enumeration):

| # | Locus | Authority constructs (representative) | Terminal escalation |
|:-:|-------|---------------------------------------|:-------------------:|
| 1 | **Authority Layer** `AUTH-001..012` | Authority Board (apex), Chief Authority Architect, ownership model, approval-by-exception, zones | Authority Board |
| 2 | **Platform Governance** `PEG-001..017` + `PEGM-001` | Authority/Owner/Steward/Approval/Audit/Escalation/Compliance/Traceability (×8 structures ×17 domains) | Authority Board |
| 3 | **Platform Ownership/Boundary** `PEO-001..017`, `PEB-001..017` | single Engineering Owner, boundary authority | Authority Board |
| 4 | **Data Decision Rights** `PDDR-001..017`, `PDO-001..017` | single accountable authority per domain (10 decision classes), owner/steward/custodian | Authority Board |
| 5 | **Control Fabric (PI-4)** | Identity, Trust, Policy, Governance runtimes; PEP (deny-by-default) | Authority Board |
| 6 | **Federation** `FED-GOV-001` | Authority, Certification, Revocation, Audit, Federation authorities; trust/policy delegation | Authority Board |
| 7 | **Evolution** `EVO-GOV` | Evolution Governor, certifier, ratifier (mutation gate) | Authority Board |
| 8 | **Knowledge** `KNOW-GOV` | proposal/certification/ratification/revocation authorities | Authority Board |
| 9 | **Ontology** `ONTO-GOV-001` `OG-C1..C11` | Ratification (C6), Certification (C7), Revocation (C8), Trust (C9), Federation (C10) authorities | Authority Board |
| 10 | **Memory** `MEM-GOV-001/002` `C1..C12` | Consolidation ≠ Certification ≠ Ratification (SoD), revocation, federation authority | Authority Board |
| 11 | **Intelligence** `INT-GOV-001/002` `C1..C12` | proposer/certifier/committer (SoD), decision-rights matrix (D1..D10) | Authority Board |
| 12 | **Simulation** `SIM-GOV-001/002` `C1..C12` | Simulation/Scenario/Revocation/Federated-Simulation authorities (10 decision classes) | Authority Board |
| 13 | **Economic** `ECON-GOV-001` | Econ authority, treasury, revocation, econ federation authority (D1..D10) | Authority Board |
| 14 | **Autonomy / Civilization / Governance** `AUTO-GOV`/`CIV-GOV`/`GOV-GOV` | actor/charter/cert/revocation/federation/emergency-halt authorities; Law/Reg/Policy ratification | Authority Board |

**Observation.** Every locus terminates escalation at the **same apex** (Authority Board, AUTH-009) and repeats
the same internal role set — strong evidence that these are **instances of one model**, not distinct models.

## 4. Duplication Analysis

Across all 14 loci, the same **eight authority archetypes** and the same **ten spine invariants** recur
verbatim in intent:

**Recurring archetypes (duplicated N× each):** Proposal · Certification · Ratification · Revocation ·
Federation · Ownership(+Stewardship) · Delegation · Emergency-Halt/Resume.

**Recurring spine (duplicated in every locus):** single accountable owner; separation of duties
(proposer ≠ certifier ≠ ratifier ≠ revoker); quorum-gated ratification; escalation terminal at the Authority
Board; mutation only via the Evolution Fabric (migration-only, append-only); deny-by-default; immutable signed
audit (reused federation crypto, no custom crypto); federation clamping (foreign = advisory/deny-only,
trust-clamped, namespace-isolated, local-shadows-foreign); enumerated bounded powers; traceability to an
Authority/Constitution source.

**Redundancy finding.** The program carries **~14 authority models × ~10 constructs ≈ 140 authority
declarations** that are behaviourally isomorphic. This is duplication of *model*, not of *need* — each fabric
genuinely needs authority, but not its own **definition** of what an authority *is*.

## 5. The Composable Authority Fabric (the collapse)

One fabric replaces the fourteen models: a fixed **Authority Spine** + a fixed set of **Authority Archetypes**
+ **composition operators** + a single **Authority Registry**. Each former model becomes a set of *registered
instances*.

### 5.1 Authority Spine — `UAF-SPINE` (invariants every instance obeys)

| ID | Spine invariant | Anchored to |
|----|-----------------|-------------|
| S-A1 | Single accountable owner; no shared ownership | AUTH-009 §6.3; INV-5 |
| S-A2 | Separation of Duties: proposer ≠ certifier ≠ ratifier ≠ revoker | AUTH-009; fabric SoD |
| S-A3 | Ratification is quorum-gated | Constitution; fabric ratification |
| S-A4 | Escalation is terminal at the **Authority Board** (single apex) | AUTH-009 §3 |
| S-A5 | State mutation only via the **Evolution Fabric** (migration-only, append-only) | AD-0019; IP-14; INV-10 |
| S-A6 | Deny-by-default authorization | INV-3; PI-4 PEP |
| S-A7 | Immutable signed audit (Ed25519 + hash-chain; **no custom crypto**) | AD-0018; INV-2; S6 |
| S-A8 | Federation clamping (foreign advisory/deny-only, trust-clamped, namespace-isolated, local-shadows-foreign) | AD-0018; INV-1 |
| S-A9 | Enumerated, bounded powers per instance (no implicit power) | AUTH-008; deny-by-default |
| S-A10 | Every instance traces to an Authority/Constitution source | AUTH-010; INV; traceability |

### 5.2 Canonical Authority Archetypes — `AA-*`

| ID | Archetype | Enumerated power (bounded) | Collapses (examples) |
|----|-----------|----------------------------|----------------------|
| **AA-0** | **Apex Authority** (the Authority Board) — *singleton, not instantiable per-fabric* | Terminal approval of Approval-Required Operations + authority changes | The single escalation root all 14 loci already share |
| **AA-1** | **Proposal Authority** | Propose instrument/record; never ratify own (S-A2) | GOV C4, INT proposer, MEM proposer, ECON/AUTO proposers |
| **AA-2** | **Certification Authority** | Attest well-formed, traceable, non-conflicting, S1/S3/S4-safe | GOV C5, ONTO OG-C7, MEM C5, cert authorities across fabrics |
| **AA-3** | **Ratification Authority** | Terminal ratify (quorum, via Evolution) | GOV C6, ONTO OG-C6, MEM C6, SIM/INT/ECON ratifiers |
| **AA-4** | **Revocation Authority** | Revoke (forward-only, fail-closed, propagate) | ONTO OG-C8, FED revocation, MEM C8, SIM/ECON/AUTO revokers |
| **AA-5** | **Federation Authority** | Admit foreign (advisory/deny-only, clamped, namespace-isolated) | ONTO OG-C10, FED-GOV, ECON fed, AUTO C12, CIV CD7 |
| **AA-6** | **Ownership Authority (+Steward)** | Single accountable owner; steward = custody ≠ ownership | PEO-001..017, PDO/PDDR, per-fabric owners |
| **AA-7** | **Delegation Authority** | Delegate narrowing-only, non-circular, bounded | GOV delegation, trust/policy delegation (FED), AUTO D5 |
| **AA-8** | **Emergency-Halt / Resume Authority** | Fail-closed kill-switch; resume by a *distinct* authority (S-A2) | AUTO C10, ECON D10, SIM emergency halt |

### 5.3 Composition Model + Authority Registry

- **Instance =** `{ archetypeId (AA-1..8), scope/namespace, enumeratedPowers[], ownerRef, keyRef, spineConformance }`.
- **Registry =** reserved `authority:*` keyspace in the substrate Metadata runtime (mirrors `governance:*`,
  `federation:*`), one record per authority instance. Fabrics **compose** their governance by *registering
  instances*, never by defining a new authority model.
- **Composition operators:** `grant` (instantiate an archetype in a scope), `delegate` (AA-7, narrowing),
  `federate` (AA-5, clamped import), `escalate` (to AA-0), `revoke` (AA-4). All operators are Evolution-routed
  (S-A5) and audited (S-A7).
- **Reuse (no re-implementation):** PI-4 Policy Evaluator (deny-by-default), PI-5 Federation crypto+audit,
  PI-6 Evolution (sole mutation path). The fabric adds **no** new core mechanism — it is expressible entirely
  as an additive `src/control/authority/*` layer (zero prohibited-core-dir change), consistent with
  `UNKNOWN-READINESS-001` (FA-C1).

### 5.4 Collapse (fold) Map — 14 models → 1 fabric

| Source locus | Constructs today | Fold to |
|--------------|:----------------:|---------|
| Platform `PEGM-001` (8 structures) / `PEG-001..017` | ~8×17 | AA-1..AA-6 instances in `authority:platform:*`; escalation → AA-0 |
| Data `PDDR/PDO-001..017` | 10 decision classes ×17 | AA-6 (+AA-2/AA-3) instances in `authority:data:*` |
| Control (PI-4) | 4 runtimes | Spine realizers (S-A6/S-A7) + AA-2/AA-3 hosts |
| Federation `FED-GOV` | 5 authorities | AA-2/AA-3/AA-4/AA-5 + S-A8 |
| Evolution/Knowledge/Ontology/Memory/Intelligence/Simulation/Economic/Autonomy/Civilization/Governance | 8–14 each | AA-1..AA-8 instances in `authority:<fabric>:*` |
| **Authority Layer `AUTH-001..012`** | apex + ownership + approval-by-exception | **AA-0 (preserved, unchanged)** + spine anchors S-A1..S-A10 |

Net effect: **~140 bespoke declarations → 8 archetypes + 10 spine invariants + N registered instances.**

## 6. Preservation & Equivalence Guarantees

- **G-1 No capability lost.** Every existing authority construct maps to exactly one archetype with equal or
  stricter powers (fold map §5.4); no power is widened, none dropped.
- **G-2 Root canon untouched.** `AUTH-001..012` are **not** amended, merged, or deleted (AUTH-009 §6.6). AA-0
  and the spine *anchor to* the ratified canon; the fabric is **subordinate**.
- **G-3 Behaviour-preserving.** SoD, quorum, deny-by-default, Evolution-only mutation, federation clamping, and
  Board-terminal escalation are preserved identically — the fabric is a normalization, not a policy change.
- **G-4 Additive.** The fabric is implementable (later, under separate authorization) as `src/control/authority/*`
  with zero prohibited-core-dir change; today it is specification only.

## 7. Governance / Non-Mutation Statement

This artifact produced **no** source code, infrastructure, or authorization; **amended no** `AUTH-*` canon;
**released no** lock; **enrolled no** invariant; **mutated no** frozen construct. `INV-1..13`, `AUTH-001..012`,
`AUTH-012`, `AD-0014`, the Article IX generation lock, and all ratified fabrics are unchanged.
`UCOS-CONSTRUCTION-BLOCKED` is unchanged. Adopting the fabric as a governing model (and any later
`src/control/authority/*` implementation) is an **Approval-Required Operation** (AUTH-009 §8) reserved to the
Authority Board.

## 8. Determination & Conditions

> **COLLAPSE FEASIBLE — ONE COMPOSABLE AUTHORITY FABRIC.**
> The program's ~14 authority models are behaviourally isomorphic instances of a single model. They collapse,
> **without loss and without touching the immutable Authority Layer**, into `UAF-SPINE` (S-A1..S-A10) + eight
> archetypes (AA-1..AA-8) under the single apex AA-0, composed via an `authority:*` registry. Every former
> fabric governance model is re-expressed as registered instances.

- **UAF-C1** — Adoption is Board-approved (AUTH-009 §8); this artifact is a proposal, not an enactment.
- **UAF-C2** — Implementation, if authorized, is additive `src/control/authority/*` with **0** prohibited-core-dir
  change and the test baseline kept green (currently 269/269).
- **UAF-C3** — The Authority Board (AA-0) remains the singular apex; no fabric may instantiate a competing apex.
- **UAF-C4** — Migration is register-then-retire (append-only): fabrics register instances; bespoke model text
  is **superseded/linked, never deleted** (AUTH-009 §6.6).

## 9. Traceability & Next Step

- **Reviews:** `.claude/authority/AUTH-001..012` + `AUTHORITY-INDEX`; `architecture/{platform,federation,`
  `evolution,knowledge,ontology,memory,intelligence,simulation,economic,autonomy,civilization,governance}/*GOV*`;
  data `PDDR/PDO`; control PI-4.
- **Subordinate to:** `AUTH-009` (governance canon), `AUTH-010` (traceability), Governance Baseline 1.0.0.
- **Consumes:** `UNKNOWN-READINESS-001` (FA-C1 additive discipline), `AD-0017/0018/0019`.
- **Owner:** UCOS Authority Board (disposition).
- **Next step (non-authorizing):** register `AUTH-UNIV-001` append-only in `CTX-REG-001`; Board deliberation to
  adopt `UAF-SPINE` + AA-1..AA-8 as the governing authority model; on adoption, a scoped authorization enables
  the additive `src/control/authority/*` fabric and the register-then-retire migration (UAF-C4). No construction,
  amendment of `AUTH-001..012`, or lock release is authorized by this review.

**END AUTH-UNIV-001 — PHASE R3 · UNIVERSAL AUTHORITY REVIEW · ONE COMPOSABLE AUTHORITY FABRIC (UAF-SPINE S-A1..S-A10 · ARCHETYPES AA-0..AA-8) · BEHAVIOUR-PRESERVING · IMMUTABLE AUTHORITY LAYER UNCHANGED · DESIGN/PROPOSAL ONLY · NO CODE / NO AMENDMENT / NO LOCK RELEASE.**
