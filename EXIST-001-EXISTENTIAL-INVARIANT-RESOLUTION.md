# EXIST-001 — Existential Invariant Constitutional Resolution (INV-17↔INV-5 · INV-18↔INV-6)

| Field | Value |
|-------|-------|
| Artifact | **EXIST-001 — Existential Invariant Constitutional Resolution** |
| Program | **PHASE R9 — Existential Invariant Review** (constitutional resolution) |
| Version | 1.0.0 |
| Classification | **CONSTITUTIONAL RESOLUTION — READY FOR AUTHORITY BOARD ENACTMENT** (resolution complete; enrollment reserved to the Board) |
| Scope | Resolve the two DEFER conditions on the proposed existential invariants: **INV-17 vs INV-5** and **INV-18 vs INV-6** |
| Governance basis | AUTH-012 (governed amendment) · Constitution Art. IX/XII · INV-10 (append-only) · **AD-0014** (Ω∞ disposition — INV-17/INV-18 DEFER pending revision) · `UCOS-UEA-REV-001` (PHASE 11D.2 conflict findings) |
| Inputs | `UCOS-ASR-NFR-001` v1.0.1 §2.2 (INV-1..13); `UCOS-AUTH-013-AMD-001` (INV-14..20 proposed; §5 R-1/R-2); `UCOS-UEA-0005/0006` (computation/reality-agnostic designs); PI-5 federation model; SIM-COND-4 / INT determinism-quarantine; `PEX-001..017` (EX1 determinism) |
| Decision body | **UCOS Authority Board** (Constitutional Majority to enact) |
| Owner | UCOS Authority Board |

> **Governing disclaimer.** This artifact **resolves the substantive conflict** between the named invariants and
> produces enrollment-ready constitutional text. It **does not itself enroll** INV-17 or INV-18, does **not**
> raise `UCOS-ASR-NFR-001`, releases **no** Article IX lock, and adds **no** code/infrastructure/contract.
> Enactment — making the revised invariants binding — is a **separate Authority Board act** under AUTH-012 at
> Constitutional Majority, exactly as the AUTH-013 proposal §6 and AD-0014 require. Until such an act the binding
> invariant set remains **INV-1..INV-13** and INV-14..INV-20 have **no binding force**. INV-1..INV-13 are
> **preserved unweakened**; where any tension exists, the ratified invariant **prevails** (AUTH-013 §4
> subordination). AD-0014, INV-1..13, and the Article IX generation lock are otherwise unchanged;
> `UCOS-CONSTRUCTION-BLOCKED` stands.

---

## 0. Numbering caveat (governance)

There is no ratified "R" review track in the UCOS roadmap. Consistent with the `CIV-READINESS-001` OI-1 and
`CIV-STRESS-001` (PHASE UA-06) precedent, **PHASE R9** is recorded as a **governed constitutional-resolution
phase**, not a roadmap increment; it confers no roadmap position. Resolution numbering below (**R-17**, **R-18**)
denotes the invariant resolved, not a phase.

---

## 1. Exact texts under review (verbatim anchors)

### 1.1 Ratified invariants (`UCOS-ASR-NFR-001` v1.0.1 §2.2 — binding)

| ID | Ratified statement | Basis |
|----|--------------------|-------|
| **INV-5** | **Bounded-context isolation** — one system-of-record per domain (single SoR). | `PEP-005`; ADR-002 |
| **INV-6** | **Event-driven propagation** — at-least-once + idempotent consumers + tolerant reader. | ADR-003; SEC-CTL-016 |

### 1.2 Proposed invariants (`UCOS-AUTH-013-AMD-001` §2 — NOT enrolled)

| ID | Proposed statement | Anchored to |
|----|--------------------|-------------|
| **INV-17** | **No Reality Assumption** — the architecture shall not assume a single physical reality. Persistence, identity, and interoperability shall be defined over an abstract **Reality** construct (physical, virtual, simulated, hybrid, nested). | INV-1, **INV-5**, INV-13 |
| **INV-18** | **No Computation Assumption** — the architecture shall not assume a specific computation model. Execution shall be defined over an abstract **Computation** contract; concrete models (classical, quantum, biological, neuromorphic, unknown) are pluggable realizers. | **INV-6**, INV-8, INV-13 |

---

## 2. Predicate finding — citation defect (must be resolved first)

**F-CITE-1 (Major, non-blocking).** The AD-0014 disposition and `UCOS-UEA-REV-001` frame the INV-18 conflict as
"**INV-18 admits non-deterministic computation … vs INV-6 (determinism)**," and AUTH-013 §5 R-2 likewise reads
INV-6 as carrying "**determinism/audit obligations**." **This is a mis-citation.** In the ratified baseline:

- **INV-6 is *event-driven propagation*** (at-least-once delivery + idempotent consumers + tolerant reader) —
  a **delivery/consistency** invariant, not a determinism invariant.
- **Execution determinism is EX1**, the platform execution invariant established in Phase 9.0B (`PEX-001..017`:
  "EX1 determinism, EX2 audit, EX3 traceability…"), and operationalized as the **determinism-quarantine** pattern
  in `SIM-COND-4` and the PI-10 Intelligence design (deterministic-verifier-gated adapter).

The recurring "determinism (INV-6)" shorthand across the fabric workstreams conflates the two. Because the
**substantive** deferral concern (non-deterministic computation on the governed commit path) is real regardless
of numbering, EXIST-001 resolves INV-18 against **both** readings — the *actual* INV-6 (propagation) **and** the
*intended* EX1 (determinism) — so the resolution is complete and robust to the citation defect.

> **Disposition of F-CITE-1:** recorded for Authority Board ratification as a documentation correction. It does
> **not** change any invariant text; it clarifies which invariant each existential axis actually touches. Routed
> as a Trusted-Operation-class correction to `UCOS-UEA-REV-001` / AD-0014 narrative at their next governed touch.

---

## 3. Resolution R-17 — INV-17 (No Reality Assumption) vs INV-5 (single SoR)

### 3.1 The conflict, stated precisely
INV-5 mandates **exactly one system-of-record per bounded-context domain**. INV-17 forbids assuming **a single
physical reality** and defines persistence over multiple Reality contexts. A naive reading of INV-17 permits the
**same domain to hold different authoritative state in different realities** → *multiple* systems-of-record for
one domain → **direct violation of INV-5** (and of INV-1 "no shared mutable model"). This is the `UCOS-UEA-REV-001`
finding and AUTH-013 §5 **R-1**.

### 3.2 Resolution — the Reality-Scoped Single-SoR Doctrine
**A Reality is a federation-locality axis, not a shared-mutable-state axis.** INV-5's uniqueness domain is
refined from *domain* to the tuple **(domain × reality-context)**, with three binding rules:

- **RSD-1 — Intra-reality uniqueness (INV-5 preserved, unweakened).** Within any single Reality context, each
  bounded-context domain has **exactly one** authoritative system-of-record. INV-5 holds identically inside every
  reality; nothing is loosened.
- **RSD-2 — No cross-reality shared mutable state (INV-1/INV-5 preserved).** Realities never share a mutable SoR.
  A domain's SoR in Reality *A* and in Reality *B* are **distinct, independently-owned** records; neither reads or
  writes the other's mutable state.
- **RSD-3 — Cross-reality access is contract-first federation only (INV-1).** Any cross-reality view is a
  **provenance-tagged, read-only, locally-re-ratified projection** obtained through the ratified federation
  mechanism — reusing PI-5 exactly: local sovereignty, deny-by-default, clamped trust, **local-shadows-foreign**,
  and namespace isolation. The Reality identifier becomes part of the SoR key namespace
  (`reality:<realityId>::<domain>::<sor>`), directly analogous to the existing `federation:<nodeId>::` convention
  (FED-PROV-001). Cross-reality provenance carries the reality axis; no first-class core-port field is added.

### 3.3 Why this resolves the conflict
Under RSD-1..3, INV-17 is expressible as an **additive specialization** of INV-5 (per AUTH-013 §4): it enlarges
the *locality dimension* over which single-SoR is asserted (adding a reality axis alongside the cosmological-
locality axis of INV-19) **without ever permitting two SoRs for one (domain, reality)**. INV-5 **prevails and is
preserved**; INV-17 becomes a governed federation-locality rule rather than a licence for multiple truth. This
discharges **R-1** and the `UCOS-UEA-REV-001` INV-17 finding.

### 3.4 Revised INV-17 (enrollment-ready text)
> **INV-17 — No Reality Assumption (reality-scoped).** The architecture shall not assume a single physical
> reality; persistence, identity, and interoperability are defined over an abstract **Reality** construct
> (physical, virtual, simulated, hybrid, nested). **A Reality is a federation-locality boundary, not a shared-
> mutable-state boundary:** INV-5 single-SoR holds in full *within* each reality context (one SoR per
> (domain, reality)); there is **no cross-reality shared mutable state**; and all cross-reality interoperability
> is contract-first, provenance-tagged, locally-re-ratified federation (INV-1), never shared mutable model.
> Where this axis and INV-1/INV-5 appear to conflict, **INV-1/INV-5 prevail.**

### 3.5 Added compliance requirement (binding only if enrolled)
> **C-EX9a — Reality-scoped SoR conformance.** Every review of a multi-reality construct MUST demonstrate:
> one SoR per (domain, reality); no cross-reality mutable coupling; cross-reality reads are federated,
> provenance-tagged, and locally re-ratified. Verified against INV-5/INV-1; `UCOS-UEA-0006`; PI-5 federation model.

**R-17 verdict: RESOLVED — INV-17 is conditionally enrollable as a reality-scoped, INV-5-subordinate federation-
locality specialization. INV-5 unweakened.**

---

## 4. Resolution R-18 — INV-18 (No Computation Assumption) vs INV-6 (and EX1 determinism)

### 4.1 The two conflict surfaces, stated precisely
INV-18 admits arbitrary computation realizers (classical, quantum, biological, neuromorphic, unknown). Two
ratified guarantees are threatened:

- **CS-A — Propagation semantics (actual INV-6).** A non-classical realizer may not natively provide
  **at-least-once delivery, idempotent consumption, or tolerant-reader** behaviour → INV-6 violated.
- **CS-B — Execution determinism (EX1; the deferral's intended concern).** A **non-deterministic** realizer
  conflicts with deterministic, auditable, reproducible governed decisions and committed state (EX1/EX2/EX3;
  `SIM-COND-4`; INV-6-shorthand).

### 4.2 Resolution — the Computation-Realizer Contract (CRC)
INV-18 is admitted **only** behind a governed **Computation-Realizer Contract** with two mandatory clauses that
bind every realizer regardless of internal computation model:

- **CRC-1 — Propagation-conformance adapter (resolves CS-A / INV-6).** Every Computation realizer MUST present,
  at its governed boundary, an adapter that satisfies INV-6's propagation contract — **at-least-once + idempotent
  consumers + tolerant reader** — irrespective of its internal model. A realizer that cannot present INV-6-
  conformant propagation is **rejected at registration** (Registry `API-027`; deny-by-default). Computation
  freedom is *internal*; the propagation boundary is *invariant*. This is precisely INV-18's own "pluggable
  realizer behind a contract" framing, made binding.
- **CRC-2 — Determinism-quarantine contract (resolves CS-B / EX1).** Formalizes the pattern already ratified in
  `SIM-COND-4` and the PI-10 design as constitutional law:
  1. **Determinism-by-default (EX1 preserved).** Any state committed to a SoR and any governed decision MUST be a
     **deterministic function of recorded evidence**, reproducible via a recorded `resultHash` (EX1/EX2/EX3).
  2. **Quarantined non-determinism.** A non-deterministic realizer MAY run **only inside a sandbox** producing
     **advisory** output; it has **no write path** to any SoR or the Evolution commit path (the sole governed
     mutation route, PI-6).
  3. **Verifier gate.** No advisory (non-deterministic) result may influence governed state unless it passes a
     **deterministic verifier**; the verifier's decision — not the non-deterministic output — is what is recorded
     and committed. Failure ⇒ fail-closed reject.

### 4.3 Why this resolves the conflict
Under CRC-1/CRC-2, INV-18 is an **additive specialization** (AUTH-013 §4): computation-model freedom is confined
to the *interior* of realizers, while **INV-6's propagation contract** and **EX1's determinism/audit guarantees**
are preserved *at every governed boundary*. Non-determinism is neither prohibited (INV-18 satisfied) nor allowed
onto the commit path (INV-6/EX1 preserved) — it is **quarantined behind a deterministic verifier**, exactly the
mechanism the AUTH-013 §5 **R-2** disposition promised but left undefined. This discharges **R-2** and the
`UCOS-UEA-REV-001` INV-18 finding, and closes F-CITE-1's substantive concern under both numberings.

### 4.4 Revised INV-18 (enrollment-ready text)
> **INV-18 — No Computation Assumption (contract-quarantined).** The architecture shall not assume a specific
> computation model; execution is defined over an abstract **Computation** contract with pluggable realizers
> (classical, quantum, biological, neuromorphic, unknown). Every realizer MUST (a) present an INV-6-conformant
> propagation adapter (at-least-once + idempotent + tolerant reader) at its governed boundary, and (b) obey the
> **determinism-quarantine contract**: governed decisions and SoR-committed state are deterministic, reproducible
> functions of recorded evidence (EX1); non-deterministic computation is sandboxed, advisory, off the commit path,
> and admissible only through a deterministic verifier. Where this axis and INV-6/EX1 appear to conflict,
> **INV-6/EX1 prevail.**

### 4.5 Added compliance requirement (binding only if enrolled)
> **C-EX9b — Computation-realizer conformance.** Every review of a Computation realizer MUST demonstrate an
> INV-6-conformant propagation adapter and determinism-quarantine conformance (deterministic commit path;
> sandboxed advisory non-determinism; verifier gate; reproducibility tuple). Verified against INV-6/EX1;
> `UCOS-UEA-0005`; `SIM-COND-4`; PI-10 `INT-*` determinism model.

**R-18 verdict: RESOLVED — INV-18 is conditionally enrollable behind the Computation-Realizer Contract
(propagation-conformance + determinism-quarantine). INV-6 and EX1 unweakened.**

---

## 5. Consolidated resolution matrix

| Conflict | Root tension | Resolution mechanism | Prevailing invariant | Status |
|----------|--------------|----------------------|:--------------------:|:------:|
| **INV-17 ↔ INV-5** | Multiple realities → multiple SoRs per domain | Reality-Scoped Single-SoR Doctrine (RSD-1..3); reality = federation locality | **INV-5 / INV-1** | **RESOLVED** |
| **INV-18 ↔ INV-6** (propagation, CS-A) | Non-classical realizer lacks at-least-once/idempotent/tolerant-reader | CRC-1 propagation-conformance adapter (reject non-conformant) | **INV-6** | **RESOLVED** |
| **INV-18 ↔ EX1** (determinism, CS-B) | Non-deterministic computation on commit path | CRC-2 determinism-quarantine (sandbox + verifier gate + reproducibility) | **EX1 / INV-6** | **RESOLVED** |
| Predicate **F-CITE-1** | "INV-6 = determinism" mis-citation | Corrected; resolved against both INV-6 and EX1 | — | **CORRECTED (doc)** |

**Non-regression check.** No ratified invariant is loosened: INV-1 (contract-first / no shared mutable model),
INV-5 (single SoR), INV-6 (propagation), and EX1 (determinism) all **prevail** and are re-asserted verbatim. Both
existential invariants are re-expressed as **additive, subordinate specializations** (AUTH-013 §4), satisfying
INV-10 (append-only). This is a **reconciliation by scoping**, not an amendment of any INV-1..INV-13 text.

---

## 6. Enrollment instrument (reserved to the Authority Board)

The resolution above is **complete and ratifiable**. Enactment is the Board's reserved ceremonial act:

| Step | Action | Owner | Status |
|:----:|--------|-------|:------:|
| E-1 | Adopt EXIST-001 R-17/R-18 as the binding interpretation resolving the AD-0014 DEFER conditions | Authority Board | **PENDING** |
| E-2 | Ratify F-CITE-1 documentation correction (INV-6 ≠ determinism; determinism = EX1) | Authority Board | **PENDING** |
| E-3 | Enroll **revised** INV-17 (§3.4) + INV-18 (§4.4) + C-EX9a/C-EX9b via a new AUTH-012 decision record at **Constitutional Majority**; raise `UCOS-ASR-NFR-001` → **v1.1.0** (append-only, INV-10) | Authority Board | **PENDING** |
| E-4 | Record enrollment in `AUTH-012` decision log (next unused AD id) and `AUTHORITY-INDEX`; reconcile the AD-0016..0023 off-ledger defect per `PHASE-21` first | Authority Board | **PENDING (gated on PHASE-21)** |

> Until E-1..E-4 are executed by the Board, INV-17/INV-18 remain **PROPOSED (not enrolled)**; the binding set is
> **INV-1..INV-13**. EXIST-001 confers no authority and releases no lock. The remaining Ω∞ items
> (INV-14/15/16/19/20) are outside this phase and remain per AD-0014.

---

## 7. Determination

> **PHASE R9 COMPLETE.** The two deferred existential-invariant conflicts are **RESOLVED at the constitutional
> level**: **INV-17 vs INV-5** by the **Reality-Scoped Single-SoR Doctrine** (reality is a federation-locality
> boundary; single-SoR holds per (domain, reality); no cross-reality shared mutable state), and **INV-18 vs
> INV-6** by the **Computation-Realizer Contract** (INV-6-conformant propagation adapter + determinism-quarantine
> with a deterministic verifier gate). A predicate citation defect (**F-CITE-1**: INV-6 is event-driven
> propagation, not determinism; determinism is EX1) was identified and the resolution was made robust to both
> readings. In every case the **ratified invariant prevails and is preserved unweakened**; the existential
> invariants are admitted only as **additive, subordinate specializations** with revised, enrollment-ready text
> and binding compliance requirements (C-EX9a/C-EX9b). This discharges the AUTH-013 §5 **R-1/R-2** dispositions
> and the `UCOS-UEA-REV-001` DEFER conditions carried by **AD-0014**.
>
> This resolution **enrolls nothing and enacts nothing**: enactment (E-1..E-4) is reserved to the Authority Board
> at Constitutional Majority, gated behind the `PHASE-21` authority-chain restoration. INV-1..INV-13, AD-0014,
> and the Article IX generation lock are unchanged; `UCOS-CONSTRUCTION-BLOCKED` stands; no code, infrastructure,
> or contract was produced.

# PHASE R9 COMPLETE — EXISTENTIAL INVARIANT RESOLUTION

# INV-17↔INV-5 RESOLVED (REALITY-SCOPED SINGLE-SoR) · INV-18↔INV-6 RESOLVED (COMPUTATION-REALIZER CONTRACT) · RATIFIED INVARIANTS PREVAIL · ENACTMENT RESERVED TO THE AUTHORITY BOARD

## 8. Traceability
- **Refines / resolves:** `UCOS-AUTH-013-AMD-001` §5 R-1/R-2; `UCOS-UEA-REV-001` (INV-17/INV-18 DEFER findings);
  **AD-0014** disposition.
- **Preserves (prevailing):** `UCOS-ASR-NFR-001` v1.0.1 INV-1/INV-5/INV-6; EX1 determinism (`PEX-001..017`).
- **Reuses:** PI-5 federation model (FED-PROV/FED-SEC); `SIM-COND-4` + PI-10 `INT-*` determinism-quarantine;
  `UCOS-UEA-0005/0006`.
- **Governed by:** AUTH-012; Constitution Art. IX/XII; INV-10.
- **Enactment gated on:** `PHASE-21-CONSTITUTIONAL-RECONCILIATION-REPORT` (authority-chain restoration).
- **Owner:** UCOS Authority Board.

**END EXIST-001 — PHASE R9 COMPLETE · CONSTITUTIONAL RESOLUTION · INV-17↔INV-5 & INV-18↔INV-6 RESOLVED · RATIFIED INVARIANTS PRESERVED UNWEAKENED · READY FOR AUTHORITY BOARD ENACTMENT · NOTHING ENROLLED · ARTICLE IX ACTIVE · NO IMPLEMENTATION AUTHORIZED.**
