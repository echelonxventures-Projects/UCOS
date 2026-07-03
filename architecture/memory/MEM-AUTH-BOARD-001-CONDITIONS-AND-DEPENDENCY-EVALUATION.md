# MEM-AUTH-BOARD-001 — PI-9 Memory Fabric Board Evaluation (Conditions · Parallel Construction · Ontology Dependency)

| Field | Value |
|-------|-------|
| Artifact | **MEM-AUTH-BOARD-001 — Board Evaluation: Conditions & Dependency** |
| Artifact ID | `UCOS-AUTH-BOARD-MEM-001` |
| Phase | PHASE 22 (PI-9 Memory Fabric — Authorization Board Review) |
| Version | 1.0.0 |
| Decision body | **UCOS Authority Board** (terminal authority; AUTH-009; Constitution Art. IX / Art. XII) |
| Mode | **BOARD REVIEW — EVALUATION ONLY** — this artifact evaluates and records findings; the authorization act is issued separately (AD-0023 / MEM-AUTH-BOARD-003) |
| Inputs (read-only) | MEM-AUTH-001; MEM-AUTH-REV-001/002/003/004; MEM-GOV-001/002, MEM-ARCH-001, MEM-SEC-001, MEM-FED-001, MEM-AUD-001, MEM-THREAT-001, MEM-READINESS-001; **AD-0021 (PI-8 Ontology — RELEASED, effective 2026-07-01)**; AD-0016..0020; AD-0022; AUTH-008/009/012; Constitution Art. IX/XII; AD-0009; AD-0014 |
| Owner | UCOS Authority Board |

> Board evaluation stream 1 of 3. Independently examines, against the ratified stack, the five conditions
> **C-1..C-5** recommended by MEM-AUTH-001, the **parallel-construction** claim, and the **ontology-dependency**
> claim. Records an accept/modify/reject finding for each. Produces no authorization act.

---

## 1. Material change since MEM-AUTH-001 — PI-8 Ontology is now AUTHORIZED (AD-0021)

MEM-AUTH-001 and MEM-AUTH-REV-001..004 were authored while PI-8 Ontology was **design-ratified but NOT
authorized** (no `AD-00xx`; no construction release). Between that review and this Board sitting, the
Authority Board issued **AD-0021 — PI-8 Ontology Fabric Construction Authorization** (RELEASE LOCK — PI-8
scope only; effective **2026-07-01**), authorizing construction of `src/control/ontology/*`.

The Board records the effect of this change on the PI-9 review:

| Review claim (as written) | Basis at time of review | Basis now (post-AD-0021) | Effect on PI-9 |
|---------------------------|-------------------------|--------------------------|:--------------:|
| "PI-8 is not implemented; ontology binding must be deferred" | PI-8 design-only | PI-8 **construction-authorized**, not yet **implemented** | **Strengthened** — the coupling target is now on an authorized build path; C-1 remains correct (bind on *implementation*, not on *authorization*) |
| "Parallel construction with PI-8 is safe" | PI-8 unauthorized (hypothetical parallelism) | PI-8 **actively authorized** under AD-0021, disjoint subtree/keyspace | **Confirmed & now concrete** — both fabrics hold live, non-overlapping scoped releases |
| "PI-8 is not a hard prerequisite" | Enrichment-class coupling | Unchanged — coupling is still enrichment-class, Semantic-tier-only | **Unchanged** — PI-9's HARD deps (Fed/Evo/Know) remain the gating set |

**Finding B1-0 (accept):** AD-0021 does not invalidate any PI-9 review conclusion; it **removes the only
speculative element** (whether PI-8 would ever be authorized) and makes the parallel-construction analysis a
statement about two live, disjoint, scoped releases rather than a projection. No PI-9 finding is weakened.

## 2. Evaluation of conditions C-1..C-5

The Board evaluated each recommended condition for (a) necessity, (b) sufficiency, (c) verifiability, and
(d) consistency with the AD-0018/0019/0020/0021 precedent.

| # | Condition (MEM-AUTH-001 §4) | Necessary | Sufficient | Verifiable | Precedent-aligned | Board finding |
|---|-----------------------------|:---------:|:----------:|:----------:|:-----------------:|:-------------:|
| **C-1** | Ontology binding deferred — optional, read-only, by-reference `ontologyRef` behind a bounded adapter, **inert until PI-8 implemented** | Yes | Yes | Yes (adapter seam + inert flag inspectable) | Yes (mirrors AD-0021 by-reference `knowledgeRef`/provenance-by-convention) | **ACCEPT — with clarification CL-1** |
| **C-2** | Additive & isolated — construction confined to new `src/control/memory/*` + additive tests; **zero** change to the five substrate core dirs; existing **185/185** tests green | Yes | Yes | Yes (path diff + test count) | Yes (identical to AD-0021 §2 additive constraint) | **ACCEPT** |
| **C-3** | Reuse-only — no modification of federation/evolution/knowledge behavior; **no custom cryptography** (reuse PI-5 `assertions.ts`) | Yes | Yes | Yes (dependency/behavior diff) | Yes (identical to AD-0018/0021) | **ACCEPT** |
| **C-4** | Approval-Required acts (AD-0009) — all concrete memory authority/certification/ratification/federated-memory/retention/legal-hold/forgetting acts require explicit human/Board approval at execution time | Yes | Yes | Yes (act enumeration; runtime gate) | Yes (AD-0009 standing obligation) | **ACCEPT** |
| **C-5** | Ω∞ boundary — no self-directed/autonomous memory; **AD-0014 stands**; no INV-14..20 enrolled or required | Yes | Yes | Yes (scope scan; invariant set unchanged) | Yes (consistent with AD-0014 disposition) | **ACCEPT** |

**Clarification CL-1 (attached to C-1).** Because PI-8 is now authorized (AD-0021) and may be implemented in
parallel, the Board makes the deferral trigger explicit: the `ontologyRef` adapter **remains inert until PI-8
Ontology is IMPLEMENTED and independently validated** — authorization (AD-0021) alone does **not** activate
the binding. When PI-8 is implemented, activating the binding is a **separate additive integration** (a
governed change, not covered by AD-0023) and must not modify any PI-9 core behavior. This closes the
open documentation finding **F-DEP-1 / F-CON-1** without a redesign.

**Finding B1-1 (accept all five):** C-1..C-5 are each necessary, jointly sufficient, verifiable, and
precedent-aligned. The Board adopts them as the binding conditions of the authorization act, with C-1
carrying clarification CL-1.

## 3. Evaluation of the parallel-construction claim (MEM-AUTH-REV-004 Q3)

The claim: PI-9 Memory (`src/control/memory/*`) and PI-8 Ontology (`src/control/ontology/*`) may be
constructed **in parallel** because they are provably non-interfering.

| Isolation axis | Evidence reviewed | Board verdict |
|----------------|-------------------|:-------------:|
| Source subtree | `src/control/memory/*` vs `src/control/ontology/*` (disjoint) | **CONFIRMED** |
| Metadata keyspace | `memory:*` / `federation:*:memory:*` vs `ontology:*` / `ontology:federation:*` (disjoint) | **CONFIRMED** |
| Prohibited core dirs | both untouched (MEM-ARCH-001 §5; AD-0021 §3) | **CONFIRMED** |
| Shared-fabric behavior | reuse-only of Federation/Evolution/Knowledge on both sides | **CONFIRMED** |
| Coupling surface | single one-way, deferred, inert `ontologyRef` (Memory→Ontology) | **CONFIRMED — one-way, non-blocking** |
| Test baseline | additive over 185/185; separate suites | **CONFIRMED** |

- **Challenge (Board):** could concurrent construction create a build-order or shared-mutable dependency? No
  — PI-9 does not import ontology internals; the coupling is a by-id data reference that does not require
  PI-8 code to exist for PI-9 to build or test (MEM-AUTH-REV-004 §1, Q3). No shared mutable surface exists.
- **Challenge (Board):** does AD-0021 running concurrently change the keyspace/subtree isolation? No — AD-0021
  §2 confines PI-8 to `ontology:*` and `src/control/ontology/*`, exactly disjoint from PI-9's scope.

**Finding B1-2 (accept):** The parallel-construction claim is **upheld**. With AD-0021 live, parallelism is
now an operational reality between two disjoint scoped releases, not a hypothetical. No sequencing constraint
is imposed by the Board.

## 4. Evaluation of the ontology-dependency claim (MEM-AUTH-REV-001 §2.4)

The claim: Memory↔Ontology is an **ENRICHMENT** dependency (Semantic tier T4 only), **deferrable** behind a
bounded by-reference adapter; **PI-8 is not a hard prerequisite** for PI-9.

| Point | Evidence reviewed | Board verdict |
|-------|-------------------|:-------------:|
| Semantic tier factual backing runs through **Knowledge (PI-7, implemented)**, not Ontology | MEM-GOV-001 §2.4; MEM-AUTH-REV-001 §2.3/§2.4 | **CONFIRMED** |
| Five of six tiers (WM/STM/LTM/EPI/FED-MEM) have **no** ontology dependency | MEM-AUTH-REV-001 §2.4; §3 matrix | **CONFIRMED** |
| Coupling is by-id, provenance-by-convention, inert until PI-8 implemented | MEM-AUTH-REV-001 §2.4; C-1 + CL-1 | **CONFIRMED** |
| No circular dependency (Ontology does not depend on Memory) | MEM-AUTH-REV-001 §4 | **CONFIRMED** |
| Memory's HARD deps (Federation/Evolution/Knowledge) are all **implemented & satisfied** | MEM-AUTH-REV-001 §2/§3; AD-0018/0019/0020 | **CONFIRMED** |

- **Challenge (Board):** now that PI-8 is authorized (AD-0021), should ontology be reclassified HARD to force
  sequencing? **No.** Authorization of PI-8 does not change the *nature* of the coupling — it is still
  Semantic-tier-only typing on top of Knowledge-backed facts. Reclassifying it HARD would impose an
  unnecessary sequencing constraint the architecture does not require and would contradict the disjoint,
  deferrable design. The correct treatment is the deferred binding (C-1 + CL-1).

**Finding B1-3 (accept):** The ontology-dependency claim is **upheld**. PI-8 is **not** a hard prerequisite
for PI-9; the enrichment coupling stays deferred per C-1/CL-1.

## 5. Stream determination

> The Board **accepts** conditions **C-1..C-5** as the binding conditions of the PI-9 authorization act
> (C-1 carrying clarification **CL-1**: bind on PI-8 *implementation*, not on AD-0021 authorization),
> **upholds** the parallel-construction claim (two disjoint, non-interfering scoped releases — now concrete
> given AD-0021), and **upholds** the ontology-dependency claim (**PI-8 is not a hard prerequisite**; the
> enrichment coupling is deferred and inert). **0 blocking findings; 1 documentation clarification (CL-1),
> which closes F-DEP-1/F-CON-1.** AD-0021 strengthens rather than disturbs the PI-9 case.

**Recommendation to MEM-AUTH-BOARD-003:** proceed toward **AUTHORIZE WITH RESTRICTIONS (C-1..C-5 + CL-1)** on
the conditions/dependency axis.

## 6. Traceability
- **Refines:** MEM-AUTH-001 §2/§3/§4; MEM-AUTH-REV-001 (§2/§3/§4), MEM-AUTH-REV-004 (§1/§2/§3); AD-0021;
  AD-0016..0020; AUTH-009; Constitution Art. IX/XII; AD-0009; AD-0014.
- **Consumed by:** MEM-AUTH-BOARD-003 (consolidated determination); AD-0023 (on adoption).
- **Owner:** UCOS Authority Board.

**END MEM-AUTH-BOARD-001 — C-1..C-5 ACCEPTED (C-1 + CL-1) · PARALLEL UPHELD · PI-8 NOT A PREREQUISITE · NO AUTHORIZATION ACT.**
