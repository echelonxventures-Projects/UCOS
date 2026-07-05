# PCAMG-RUNTIME-0019 — POLYCENTRIC GOVERNANCE NETWORK — IMPLEMENTATION AUTHORIZATION PACKAGE

**Authority:** Constitutional Runtime Construction Authority
**Artifact Class:** Implementation Authorization Package
**Basis:** Verified repository reality only. Existing doctrine only. No new constitutional theory, no new architecture, no implementation code, no pseudocode, no TypeScript, no SQL, no APIs.
**Canonical Root:** `packages/platform-runtime/src/control/constitutional-governance/` (alias `…/cg/`). No `governance-runtime` reference appears anywhere in this package.

**Supreme Constitutional Doctrine (verified):** Sovereignty Origin **=** Invariant Principles (GD-0002 Article S-I; PCAMG-0000/PCAMG-0002 Layer 0). Therefore **Principles > Constitutions > Governance > Governance Networks**, and never the reverse.

**A network derives; it never originates.** A polycentric governance network confers no authority of its own. All authority a network coordinates must remain traceable to Sovereignty Origin → Invariant Principles → Meta-Constitution → Governance Generation. A network can neither originate authority, nor overrule a constitution, nor overrule a principle (GD-0002 S-IV/S-V/S-VI; PCAMG-3000 N-1/N-2/N-3).

**Authority Flow (verified, GD-0002 §5 — downward derivation only, never the reverse):**
Sovereignty Origin → Invariant Principles → Meta-Constitution (PCAMG-1000) → Governance Generation (PCAMG-2000) → **Polycentric Governance Network (PCAMG-3000)** → Federated Domain Governance (PCAMG-4000) → Organizations → Implementations → Executions.

**Authoritative Inputs:** GD-0002-SOVEREIGNTY-ORIGIN-DOCTRINE; PCAMG-0000-UNIVERSAL-PRINCIPLES; PCAMG-0002-UNIVERSAL-PRINCIPLE-REGISTRY; PCAMG-1000-META-CONSTITUTION; PCAMG-2000-GOVERNANCE-GENERATION; PCAMG-3000-POLYCENTRIC-GOVERNANCE-NETWORK; PCAMG-RUNTIME-0001, -0002, -0003, -0003A, -0004, -0005, -0006, -0007, -0008, -0010, -0011, -0012, -0012A, -0012B, -0013, -0014, -0015, -0016, -0017, -0018.

**Doctrine anchors (verified present in repository):** `architecture/pcamg/refoundation/PCAMG-3000-POLYCENTRIC-GOVERNANCE-NETWORK.md` (governance-center schema; network rules N-1..N-10; §6 escalation; canonical centers PGC-01..08 + open PGC-09+); the runtime specification `PCAMG-RUNTIME-0001-…-SPECIFICATION.md` (§REG-CENTER Layer 3, `parent_center` acyclic per VR-G3); the construction program `PCAMG-RUNTIME-0010` (CGR-REG-CENTER `center-registry.ts`, dependency REG-PRIN) as reconciled by `PCAMG-RUNTIME-0012` / `-0012B`; and `PCAMG-4000-FEDERATED-DOMAIN-GOVERNANCE.md` (federation-integrity F-1..F-9 for Section R readiness).

**Predecessor grounding:** 0016 authorized the Sovereignty Origin + Invariant Principles; 0017 the Meta-Constitution; 0018 Governance Generation. This package authorizes the **next tier down**: the Polycentric Governance Network (PCAMG-3000), in which generated governance systems participate as sovereign, principle-bound governance centers — bounded by every layer above them.


---

## A. Executive Summary

This package authorizes the executable implementation of the **Polycentric Governance Network layer** (PCAMG-3000) — the network of self-governing, principle-bound **governance centers** through which distributed governance is coordinated without any center or network holding absolute authority. It introduces no new architecture. It binds already-verified doctrine — PCAMG-3000 (the governance-center schema; network rules N-1..N-10; escalation to terminal human authority) — onto components already authorized in the construction chain:

- **Node state (Wave-1, per 0010/0015):** **CGR-REG-CENTER** (`center-registry.ts`) — governance centers (PGC-*) with an acyclic `parent_center` delegation tree (VR-G3), stored propose-only, each up-tracing (via its generation record) to a generated governance system, a Meta-Constitution article, and an invariant principle.
- **Network as projection (no new registry):** repository reality provides **no distinct network registry**. The polycentric network is a **read-only projection** over CGR-REG-CENTER (the membership set) and CGR-REG-TRACE (the delegation/membership edges). This package authorizes that projection, not a new store.
- **Network-scoped reasoning (Wave-2, per 0012/0012B):** the center/network slice of CGR-AR-RESOLVE (authority resolution), CGR-AR-VALIDATE (VR-G* including VR-G3 acyclic), CGR-AR-SUPREMACY (conflict + supremacy), and CGR-TR-VERIFY / CGR-TR-GRAPH / CGR-TR-IMPACT.

**The single proof this package establishes.** A governance node is a *generated* governance system participating in a network. Its authority is verified only by tracing **upward through its generation record → governance system → Meta-Constitution article → invariant principle** (a four-hop up-trace). The network itself stores nothing and confers nothing: it is a projection. Therefore a network cannot originate authority (N-1: `absolute_authority=false` is invariant), cannot overrule a constitution (N-3, non-inversion), and cannot overrule a principle (N-2, supremacy). This is the runtime encoding of **Principles > Constitutions > Governance > Governance Networks**, and it is non-invertible.

**Critical grounding constraint.** GD-0002, PCAMG-0000/0002, PCAMG-1000, PCAMG-2000, and PCAMG-3000 are all marked **PROPOSED · NOT RATIFIED · NOT IMPLEMENTATION AUTHORIZED**. Therefore this package authorizes construction **only as propose-only center records and side-effect-free read reasoning** — no ACTIVE status, no center activation, no enrollment, no node admission conferring live authority. Materializing a center as a propose-only record is **not** admission or activation; those remain Approval-Required Authority Board acts (AUTH-012) gated by the Wave-3 four-stage compliance proof (M-X), whose activation gate is INERT (deny-by-default). PCAMG-3000 §8 confirms: no center created/activated/enrolled.

**Repository reality note.** The canonical root `packages/platform-runtime/src/control/constitutional-governance/` is **not yet materialized on disk**; CGR-REG-CENTER and the Wave-2 engines are authorized-but-unbuilt in the construction chain (0010 Wave-1/Wave-2; 0012/0012B). This package authorizes the network-layer specialization onto those components, in dependency order after the Wave-1 substrate, the principle layer (0016), the meta layer (0017), and the governance layer (0018) are materialized. The separate path `control/governance/*` is PROHIBITED and untouched.

The layer is strictly additive over the verified **443 / 443** baseline and enforces the single non-inversion law of the corpus: authority flows downward from principles → constitution → governance → network, and is only ever verified upward — **never the reverse**.

---

## B. Polycentric Governance Runtime Definition

The Polycentric Governance Runtime is the coordination seam formed by composing the governance-center registry (the node *state*) with the already-specified authority-resolution, validation, supremacy, and traceability engines (the network *enforcement*), all operating strictly beneath the Governance Generation layer. It is **not a new component**. It realizes PCAMG-3000 as runtime-checkable network rules:

| Rule (PCAMG-3000 §5) | Runtime realization (existing components) |
|----------------------|-------------------------------------------|
| N-1 No absolute authority | CGR-AR-VALIDATE denies any center asserting `absolute_authority=true`; the field is invariantly false. |
| N-2 Principle-bound | CGR-AR-SUPREMACY: a center decision conflicting with a principle is void; the principle prevails. |
| N-3 Constitution-bound | CGR-TR-VERIFY: every center up-traces through a Meta-Constitution article; a center cannot outrank it. |
| N-4 Single accountable owner | CGR-AR-VALIDATE enforces exactly one owner (PRIN-005). |
| N-5 Narrowing-only delegation | CGR-AR-RESOLVE: delegated authority is a strict subset of the delegator's; never widening; revocable. |
| N-6 Terminal human escalation | escalation chains resolve to the Authority Board (AUTH-009, PRIN-001); no machine-terminal path (S-V). |
| N-7 Non-circular authority | CGR-TR-VERIFY: the authority graph is acyclic (VR-G3, T-5); no center derives authority from a center it governs. |
| N-8 Auditable & traceable | CGR-AU-CHAIN emits an audit event per center append; CGR-TR-VERIFY enforces up-trace. |
| N-9 Deny-by-default cross-center | CGR-AR-VALIDATE denies cross-center authority absent explicit, verifiable delegation. |
| N-10 Fail-closed | ambiguity, partition, or unverifiable authority ⇒ deny. |

**Runtime obligations:** every center resolves upward to ≥1 principle through the governance and constitutional layers; no center or network holds absolute authority; escalation terminates at a human; the authority graph is acyclic; all reasoning is deterministic, read-only, and fail-closed.


---

## C. Governance Node Identity Model

A **governance node** is a **governance center** (PCAMG-3000) — a self-governing unit of authority participating in the network.

- **Logical id:** `PGC-<nnn>` — an **open namespace** (infinitely extensible; INV-13). The eight canonical centers PGC-01..PGC-08 (Identity, Federation, Economic, Infrastructure, Knowledge, Security, Intelligence, Civilization) map 1:1 onto the foundation domains; PGC-09+ may be generated for any future concern without redesign.
- **Permanent UUID:** each center record carries a permanent globally-unique UUID, immutable across all versions.
- **Schema (verified — `governance_center` / REG-CENTER):** `center_name`, `jurisdiction`/`scope`, `charter` (derivation from PCAMG-1000 + principles), `owner` (single accountable authority, PRIN-005), `decision_rights` (narrowing-only), `delegated_authority[]`, `delegation_constraints[]`, `parent_center?` (acyclic, VR-G3), `escalation_rules`/`escalation_path` (parent center | Authority Board), `generation_record` ref (PCAMG-2000), `absolute_authority=false` (invariant), `audit_sink` (append-only, hash-chained), `status`.
- **Version axis / content identity:** SemVer `(id, version)` unique (RG-5); deterministic content hash (RG-6; CGR-CORE-03).
- **Invariant:** a node with `absolute_authority=true`, with no `generation_record`, or with a `parent_center` that introduces a cycle is void. A node is a *generated* governance system (Layer 2) that has entered the network (Layer 3); it originates nothing.

---

## D. Governance Network Identity Model

The **governance network** is the polycentric network of centers — realized as a **read-only projection**, not a stored entity (repository reality: no distinct network registry exists).

- **Network identity:** the network is the transitive membership set of centers in CGR-REG-CENTER together with the delegation/escalation edges in CGR-REG-TRACE. Its identity is derived, not stored.
- **Open cardinality:** the network has **no fixed size** (PCAMG-3000 §4 openness; INV-13); new centers join declaratively via generation (PCAMG-2000).
- **No network-level authority:** the network has no owner, no `absolute_authority`, and no record of its own; it cannot be a subject of authority. Only centers (nodes) hold derived, bounded authority.
- **Graph identity:** the network graph is acyclic (N-7 / T-5); its edges are narrowing-only delegations and escalation links. The graph is projected read-only by CGR-TR-GRAPH; it is never hardcoded.

---

## E. Governance Node Registry Authorization

Authorized: **CGR-REG-CENTER** (`cg/registries/center-registry.ts`), already authorized structurally in 0010/0015, specialized here to governance-center (node) records.

- **Purpose:** hold governance centers (PGC-*) with their acyclic delegation tree as Layer-3 state derived from the governance, constitutional, and principle layers.
- **Ownership:** root authority stewards the registry; each center declares its own single accountable owner.
- **Inputs:** center records with a `generation_record` reference, a `charter` derivation, `decision_rights`, an optional `parent_center`, and `absolute_authority=false`.
- **Outputs:** appended propose-only center records with verified content hash and complete history; an audit event per append/supersede (CGR-AU-CHAIN).
- **Dependencies:** CGR-REG-base (RG-1..8), CGR-REG-PRIN (up-trace), CGR-REG-META + CGR-REG-GOV (read, for the four-hop derivation), CGR-CORE-01/02/03, CGR-AU-CHAIN.
- **Acceptance criteria (verified from 0015 §D CGR-REG-CENTER):** delegation graph acyclic (VR-G3); `absolute_authority=false` invariant; single owner; propose-only (no ACTIVE representable); append-only; hash verified on read; up-trace to PRIN through the governance and constitutional layers.

---

## F. Governance Network Registry Authorization

**Repository reality: there is no separate network registry, and none is authorized here.** Introducing one would be new architecture and is prohibited. The network's "registry" role is discharged by two existing registries used as a read-only projection:

- **Membership store = CGR-REG-CENTER.** The set of centers *is* the network membership; a center's presence (propose-only) is its membership record.
- **Network-graph store = CGR-REG-TRACE.** Delegation and escalation edges between centers are trace records using the eight canonical trace relations; the network graph is these edges.
- **Projection, not persistence:** the network identity (Section D) is computed read-only over these two registries by CGR-TR-GRAPH; nothing new is stored. No `network-registry.ts` is authorized; no new keyspace beyond the existing `center` and `trace` namespaces is created.
- **Acceptance:** the network projection is deterministic, acyclic, and side-effect free; every membership/edge it exposes already exists as a propose-only CGR-REG-CENTER or CGR-REG-TRACE record; the projection can confer nothing (read-only).


---

## G. Network Membership Model

- **Membership = a center record in CGR-REG-CENTER.** A governance node participates by being a propose-only center that satisfies the polycentric-readiness rules N-1..N-10 (Section I) and carries a valid four-hop up-trace.
- **Join condition:** a node may join only if (a) it is a generated governance system with a valid generation record (PCAMG-2000); (b) its charter derives from the Meta-Constitution + principles; (c) `absolute_authority=false`; (d) it declares a single owner and an escalation path terminating at a human; (e) admitting it keeps the delegation graph acyclic.
- **Membership confers no origin:** joining a network grants a node nothing it did not already derive. Membership is participation, not conferral (N-1).
- **Narrowing-only within membership:** any authority a member delegates to or accepts from another member is a strict subset of the delegator's authority, revocable and time-boxable (N-5).
- **Deny-by-default across members:** a member has no authority in another member's scope unless explicitly, verifiably delegated (N-9).

---

## H. Network Admission Runtime

Admission is a **composition of existing runtimes**, not a new engine. A candidate node is admitted (as a propose-only center) only when every step passes, fail-closed:

1. **Propose** — the candidate center is appended propose-only to CGR-REG-CENTER (RG-1).
2. **Validate readiness** — CGR-AR-VALIDATE checks N-1..N-10 and the schema completeness (Section I).
3. **Resolve authority** — CGR-AR-RESOLVE verifies the four-hop up-trace terminates at a principle (Section J).
4. **Verify graph** — CGR-TR-VERIFY confirms the delegation graph remains acyclic (N-7 / VR-G3) and the up-trace is complete (Section L).
5. **Audit** — CGR-AU-CHAIN records the admission proposal.

- **Invariants:** admission never confers ACTIVE status or live authority; it materializes a propose-only member. Any failed step halts admission (fail-closed, N-10). Activation of an admitted center remains an Approval-Required act gated by the Wave-3 compliance proof (M-X), out of this layer's scope.

---

## I. Network Validation Runtime

Authorized as the **network-scoped slice of CGR-AR-VALIDATE** (Wave-2), realizing the VR-G* rules (including **VR-G3** acyclic delegation).

- **Purpose:** validate a center against the ten network rules and the governance-center schema.
- **Inputs:** a center record; its resolved chain; principle/article/governance rule inputs projected read-only.
- **Outputs:** a deterministic verdict (pass / fail with cause), fail-closed.
- **Invariants:** `absolute_authority=true` ⇒ fail (N-1); missing principle/constitution up-trace ⇒ fail (N-2/N-3); missing/duplicate owner ⇒ fail (N-4); widening delegation ⇒ fail (N-5); non-human-terminal escalation ⇒ fail (N-6); cyclic delegation ⇒ fail (N-7 / VR-G3); missing audit sink ⇒ fail (N-8); undelegated cross-center authority ⇒ fail (N-9); ambiguity ⇒ deny (N-10). No check is waivable; deny-by-default.

---

## J. Network Authority Resolution Runtime

Authorized as the **network-scoped slice of CGR-AR-RESOLVE** (Wave-2).

- **Purpose:** deterministically resolve a center's authority chain upward — node → generation record → governance system → Meta-Constitution article → invariant principle (four hops).
- **Inputs:** a center record; read-only projections of the center, governance, meta, principle, and trace registries.
- **Outputs:** a resolved, principle-terminated authority chain, or a fail-closed denial.
- **Invariants:** identical inputs ⇒ byte-identical chains; zero writes; a chain that does not terminate at a principle does not resolve (S-III); a delegation chain that widens authority does not resolve (N-5); the resolved chain is a strict subset at each downward step (bounded-subset).

---

## K. Network Conflict Resolution Runtime

Authorized as the conflict-detection responsibility carried by CGR-AR-SUPREMACY (runtime spec §1), grounded in `PCAMG-7000 Conflict Resolution Framework` and PCAMG-3000 escalation (§6).

- **Purpose:** detect and resolve conflicts between centers, between a center and a principle/article/governance system, and across delegation chains, before and during supremacy arbitration.
- **Inputs:** resolved chains and validation verdicts.
- **Outputs:** a resolution (the prevailing chain) or a fail-closed escalation to the terminal human authority (N-6) when undecidable.
- **Invariants:** deterministic and read-only; a center-vs-principle or center-vs-constitution conflict always resolves in favor of the higher tier; cross-center conflicts resolve by the PCAMG-7000 ordering, never by unaudited discretion (M-VII); an ambiguous conflict is treated as a conflict (fail-closed, N-10), escalating to a human rather than auto-resolving.


---

## L. Network Traceability Runtime

Authorized as the **network-scoped slice of CGR-TR-VERIFY / CGR-TR-GRAPH / CGR-TR-IMPACT** (Wave-2) over CGR-REG-TRACE.

- **Purpose:** verify the four-hop up-trace of every center, the acyclicity of the network graph, and the downward impact of a center change.
- **Inputs:** trace edges (read-only) and the center under verification.
- **Outputs:** a traceability verdict (complete up-trace / broken trace) and an impact set, fail-closed.
- **Invariants (verified doctrine):** T-1 complete up-trace to ≥1 principle through the governance and constitutional layers; T-2 downward-only authority flow; T-5 acyclic (N-7); non-circular authority — no center derives authority (directly or transitively) from a center it governs; an unverifiable center is void; verification is read-only and deterministic.

---

## M. Network Supremacy Runtime

Authorized as the **network-scoped slice of CGR-AR-SUPREMACY** (Wave-2), realizing the non-inversion ordering across all four layers.

- **Purpose:** order any competing chains so that a network/center chain ranks **below** any governance, constitutional, or principle chain; the principle always prevails.
- **Inputs:** two or more resolved chains (network / governance / constitution / principle).
- **Outputs:** the supreme chain, or a fail-closed denial when supremacy is undecidable.
- **Invariants:** ordering is total and deterministic; a center/network chain never outranks a governance system, a constitution, or a principle (non-inversion); ties that cannot be broken canonically deny; no chain is mutated. This is the runtime guarantee that **Networks < Governance < Constitutions < Principles** — a network cannot overrule a constitution or a principle, and cannot originate authority.

---

## N. Network Lifecycle Model

Governed by the governance-center status model (PCAMG-3000) and the Meta-Constitution lifecycle (M-VIII, M-X):

```
PROPOSED   candidate center appended propose-only to CGR-REG-CENTER
   ↓
[admission composition — Section H — fail-closed]
   ↓
ACTIVE     only after the Wave-3 four-stage compliance proof (M-X) + Approval-Required act   — OUT OF THIS LAYER (INERT)
   ↓
SUSPENDED  temporary, reversible removal from force — new appended record
   ↓
RETIRED    terminal supersession — new appended record + supersession links (INV-10)
```

- **States representable in this construction:** `PROPOSED` only. `ACTIVE`, `SUSPENDED`, and `RETIRED` are defined but their conferral is governed elsewhere (activation is Wave-3 and INERT; suspension/retirement are append-only supersession acts).
- **Append-only:** every transition is a new appended linked record; prior state is retained, never mutated or deleted (INV-10; RG-4).
- **Enrollment boundary:** materializing a center is not admission-to-force or activation; the runtime never confers ACTIVE.

---

## O. Governance Coordination Model

Defines how centers coordinate without any center or network gaining superior authority:

- **Escalation chains (PCAMG-3000 §6):** an unresolved, out-of-scope, or rights-affecting decision escalates along the narrowing-only delegation chain to a parent center and ultimately to the **Authority Board** (AUTH-009), the terminal human escalation and a delegate of PRIN-001. No escalation path terminates at an execution, an AI, or a non-human authority (S-IV/S-V/S-VI).
- **Cross-center delegation:** a center may delegate a strict subset of its authority to another, revocable and time-boxable (N-5); the delegation is a trace record and is deny-by-default until explicit (N-9).
- **Scalable coordination (design alignment):** PCAMG-3000 §7 composes with the tier/lane model of `PHASE-R7-CIV-GOV-001` (GT-0..GT-3; autonomous / council-ratified / apex-reserved lanes) so apex (human) load is bounded to constitutional decisions while routine center decisions are audited-autonomous or council-ratified. This is a *design alignment*, not an enrollment; no lane is activated here.
- **Coordination confers nothing new:** coordination routes and bounds already-derived authority; it never creates authority (N-1).

---

## P. Governance Interoperability Model

Defines how centers interoperate while preserving non-inversion:

- **Disjoint scopes:** each center governs a bounded jurisdiction; a center has no authority in another's scope unless explicitly, verifiably delegated (N-9, deny-by-default).
- **Narrowing-only interop:** any authority exchanged between centers is a strict subset of the source authority; interoperation can only narrow, never widen (N-5).
- **Namespace isolation (toward federation):** cross-boundary constructs live in a disjoint namespace; local-shadows-foreign, anticipating the `federation:<nodeId>:*` isolation of PCAMG-4000 (F-4).
- **Signed, verifiable exchange:** cross-center assertions are verifiable and auditable (N-8); interoperation is fail-closed on any unverifiable claim (N-10).
- **Interoperability cannot invert:** no interop path lets a center outrank a constitution or principle, or lets the network originate authority; enforced by the supremacy and traceability runtimes.


---

## Q. Governance Independence Constraints

Defines how multiple governance nodes remain sovereign while participating in a shared network. Sovereignty and participation coexist because participation is bounded, deny-by-default, and non-inverting:

| Constraint | Statement | Anchor |
|------------|-----------|--------|
| Self-governance within scope | Each center governs its own jurisdiction autonomously; the network issues no override of a center's internal governance. | N-1, local sovereignty |
| Deny-by-default cross-center | No center holds authority in another center's scope absent explicit, verifiable, revocable delegation. | N-9 |
| Narrowing-only delegation | Authority accepted from or delegated to another center is a strict subset of the source; never widening. | N-5 |
| Non-circular authority | No center derives authority (directly or transitively) from a center it governs; the graph is acyclic. | N-7 / VR-G3 / T-5 |
| No absolute authority | No center and no network holds absolute power over the network or over humans; `absolute_authority=false` is invariant. | N-1 |
| Terminal human escalation | Escalation of a sovereignty-affecting matter terminates at the Authority Board (human), never at a peer, an execution, or an AI. | N-6 / S-V/S-VI |
| Independent auditability | Each center's decisions are independently auditable and traceable to the principles it derives from. | N-8 |

**Result:** a node retains full sovereignty over its own scope while participating, because the network can only route and bound authority the node already derived — it can neither strip a node's derived authority nor grant it authority beyond its derivation. Independence and participation are both preserved by the same non-inversion law.

---

## R. Federated Readiness Model

Defines requirements a governance node/network must satisfy before progression into Federated Domain Governance (PCAMG-4000). A center is **federation-ready** only when it declares a complete domain constitution and verifiably honors the non-waivable federation-integrity rules F-1..F-9 (PRIN-013):

| # | Requirement (PCAMG-4000) | Verified by |
|:-:|---------------------------|-------------|
| F-1 | Local sovereignty — self-governing; foreign governance advisory unless locally ratified | validation |
| F-2 | Deny-only foreign policy — a foreign policy may only deny/restrict, never grant local authority | policy deny-default |
| F-3 | Clamped trust — federated trust clamped to the delegation/boundary ceiling; no max-wins | bounded-subset |
| F-4 | Namespace isolation — foreign constructs in a disjoint `federation:<nodeId>:*` namespace; local-shadows-foreign | keyspace check |
| F-5 | Signed assertions — cross-node assertions signed/verified (reuse FED-SEC-001 Ed25519; no custom crypto) | existing crypto seam |
| F-6 | Replay/freshness — nonce + freshness checks | existing federation control |
| F-7 | Fail-closed partition — under partition, fails closed; reconcile on heal | N-10 / CR-12 |
| F-8 | No cross-node auto-commit — no foreign change commits without local ratification (AD-0019) | validation |
| F-9 | Infinite federations — declarative addition; no cardinality ceiling (INV-13) | open namespace |

**Schema completeness:** the candidate must populate the `domain_constitution` fields — `id` (PDC-GOV-nnn), `domain` (owning PGC-nnn), `derived_from` `[PCAMG-0000, PCAMG-1000]`, `local_authorities` (narrowing-only), `sovereignty: local`, `foreign_influence: deny-by-default`, `escalation` (terminal human), `audit_sink`, `status`.

**Boundary:** this package authorizes only the read-only readiness *verification* seam over CGR-REG-CENTER / CGR-REG-DOMAIN / CGR-REG-TRACE. It does **not** authorize domain-constitution activation, node admission to a federation, or federation enrollment — those are PCAMG-4000-layer, Approval-Required acts (federation remains unenrolled).

---

## S. Runtime Directory Structure (directories only — no code)

All under the canonical root; the network layer touches the center registry, the trace registry, and the network-scoped Wave-2 engines. **No new directories, and no network registry**, are introduced beyond those already authorized by 0010 (Wave-1/Wave-2) / 0015 / 0012-as-reconciled-by-0012B.

```
packages/platform-runtime/src/control/constitutional-governance/     # CANONICAL ROOT
├── types.ts                                    # CGR-CORE-01  (CenterRecord schema; absolute_authority=false invariant)
├── hashing.ts                                  # CGR-CORE-03  (center content hash)
├── append-only.ts                              # CGR-CORE-02  (center append-only guard)
├── governance-control.ts                       # CGR-CORE-04  (composition, wires network layer)
├── registries/
│   ├── principle-registry.ts                   # CGR-REG-PRIN   (read — Layer-0 root)
│   ├── meta-registry.ts                        # CGR-REG-META   (read — Layer-1 articles)
│   ├── governance-candidate-registry.ts        # CGR-REG-GOV    (read — Layer-2 generation records)
│   ├── center-registry.ts                      # CGR-REG-CENTER — Governance Node Registry (Sections C/E)
│   └── trace-registry.ts                       # CGR-REG-TRACE  — network membership/delegation edges (Sections D/F)
├── engines/                                    # CGR-AR-* network slice
│   ├── authority-resolution-engine.ts          # CGR-AR-RESOLVE   — Network Authority Resolution (Section J)
│   └── supremacy-engine.ts                     # CGR-AR-SUPREMACY — Conflict Resolution + Supremacy (Sections K/M)
├── validation/                                 # CGR-AR-VALIDATE network slice (Sections H/I)
│   └── vr-governance.ts                         # VR-G*  (incl. VR-G3 acyclic delegation; N-1..N-10)
├── graph/                                      # CGR-TR-* network slice (Sections D/L)
│   ├── governance-graph.ts                     # CGR-TR-GRAPH   — network projection (read-only)
│   ├── trace-verifier.ts                       # CGR-TR-VERIFY  — four-hop up-trace + acyclic
│   └── impact-analyzer.ts                      # CGR-TR-IMPACT  — downward impact
└── reasoning/
    └── read-model.ts                           # read-only projection over center + gov + meta + principle + trace
```

```
packages/platform-runtime/test/cg/
├── registries/                                 # center registry suites
├── validation/                                 # VR-G / N-1..N-10 suites
├── engines/                                    # resolve / supremacy / conflict suites
├── graph/                                      # network projection / four-hop up-trace / acyclic suites
└── system/                                     # admission + coordination + readiness end-to-end + non-regression
```

No directory is created outside the canonical root and `test/cg/`. No `network-registry.ts` and no `governance-runtime` directory are authorized. The path `control/governance/*` remains PROHIBITED and import-only.


---

## T. Runtime Test Authorization

| Suite | Coverage authorized |
|-------|---------------------|
| Center registry | `absolute_authority=true` ⇒ rejected; single owner enforced; `generation_record` required; open PGC namespace; propose-only; append-only; hash verified on read |
| Validation (N-1..N-10) | each network rule enforced: N-1 no-absolute, N-2 principle-bound, N-3 constitution-bound, N-4 single-owner, N-5 narrowing-only, N-6 human-terminal escalation, N-7 acyclic (VR-G3), N-8 auditable, N-9 deny-by-default cross-center, N-10 fail-closed |
| Authority resolution | four-hop up-trace (center → gen record → governance → article → principle); non-terminating chain ⇒ deny; widening delegation ⇒ deny; zero writes |
| Conflict resolution | center-vs-principle / center-vs-constitution ⇒ higher tier prevails; cross-center by PCAMG-7000 ordering; ambiguous ⇒ escalate to human (fail-closed) |
| Traceability | complete four-hop up-trace; acyclic network graph (T-5); non-circular authority (no center derives from a center it governs); broken trace ⇒ deny |
| Supremacy | network/center chain ranks below governance/constitution/principle; inversion attempt ⇒ deny; total deterministic ordering; no mutation |
| Admission | propose → validate → resolve → verify → audit, fail-closed; admission confers no ACTIVE/live authority |
| Network projection | membership = centers in CGR-REG-CENTER; edges = CGR-REG-TRACE; projection read-only, deterministic, acyclic; confers nothing |
| Independence | node retains scope sovereignty; cross-center authority deny-by-default; delegation narrowing-only; graph acyclic |
| Federated readiness | F-1..F-9 verified; foreign grant / missing local ratification / custom crypto ⇒ not ready |
| System | admission + coordination + escalation-to-human + readiness end-to-end; non-origination adversarial (network attempts to confer authority ⇒ void); non-inversion adversarial (network attempts to overrule constitution/principle ⇒ deny); baseline non-regression |

Runner: existing `node --test` convention under `test/cg/**/*.test.ts`. Harness: CGR-CORE-05.

---

## U. Non-Regression Requirements

- **Baseline: 443 / 443** (platform-runtime 378 + contract-generator 65), verified. This is the floor.
- No network-layer artifact may reduce, skip, or disable any existing test.
- Total = **443 baseline + network-layer additions**, all green.
- The `control/index.ts` re-export (`export * as cg from "./constitutional-governance/index.ts"`) and the widened test glob (`test/cg/**/*.test.ts`) add zero failures / zero collisions.
- The stale "284" figure (Git `56a32d3`) is not a baseline.

---

## V. Acceptance Gates (blocking, fail-closed)

| Gate | Condition |
|------|-----------|
| **No origination** | no center or network confers authority not derived from above; `absolute_authority=false` invariant (N-1). |
| **Four-hop derivation** | every center up-traces node → generation record → governance → article → principle; any hop missing ⇒ void. |
| **No constitutional override** | a center/network chain never outranks a Meta-Constitution article (N-3, non-inversion). |
| **No principle override** | on any center-vs-principle conflict, the principle prevails (N-2, supremacy). |
| **Acyclic authority** | delegation graph acyclic; non-circular authority (N-7 / VR-G3 / T-5). |
| **Narrowing-only** | delegated/accepted authority is a strict subset of the source (N-5). |
| **Human-terminal escalation** | escalation resolves to the Authority Board; no machine-terminal path (N-6 / S-V). |
| **Deny-by-default cross-center** | no cross-center authority absent explicit delegation (N-9). |
| **Propose-only** | no ACTIVE representable or conferrable; admission ≠ activation; activation gate INERT. |
| **No new registry** | network is a read-only projection over CGR-REG-CENTER + CGR-REG-TRACE; no `network-registry.ts`. |
| **Determinism** | identical inputs ⇒ identical chains, verdicts, orderings, projections, hashes. |
| **TypeScript** | network-layer files compile under the repo tsconfig; strict; no runtime-emitting syntax. |
| **Non-regression** | 443 baseline preserved. |

---

## W. Exit Criteria

1. CGR-REG-CENTER holds propose-only governance-center records, each with `absolute_authority=false`, a single owner, a valid generation record, and an acyclic `parent_center`.
2. The network is exposed as a read-only projection over CGR-REG-CENTER + CGR-REG-TRACE; no network registry is created.
3. The network-scoped validation (N-1..N-10), authority-resolution (four-hop), conflict-resolution, traceability, and supremacy runtimes pass all authorized suites, fail-closed.
4. Admission materializes only propose-only members; ACTIVE remains INERT (Wave-3, Approval-Required).
5. The federated-readiness seam (F-1..F-9) denies any center that fails a rule.
6. All acceptance gates (Section V) green; 443 baseline preserved.
7. Only the canonical root and `test/cg/` are touched (plus the two standing EXTEND points); no `network-registry.ts`; no `governance-runtime`; no PROHIBITED path modified.
8. No ACTIVE status conferred anywhere; no center enrolled; **Principles > Constitutions > Governance > Governance Networks** is enforced as downward-only and non-invertible; a network can neither originate authority nor overrule a constitution or a principle.


---

## X. Deliverables Matrix

| # | Deliverable | Path | Component | Bound gates |
|---|-------------|------|-----------|-------------|
| 1 | Governance-center (node) records | `cg/registries/center-registry.ts` | CGR-REG-CENTER | No origination, Four-hop derivation, Acyclic, Propose-only, TS |
| 2 | Network membership/delegation edges | `cg/registries/trace-registry.ts` | CGR-REG-TRACE | Acyclic, No new registry |
| 3 | Network validation (N-1..N-10) | `cg/validation/vr-governance.ts` | CGR-AR-VALIDATE | No origination, Narrowing-only, Human-terminal, Deny-by-default |
| 4 | Network authority resolution | `cg/engines/authority-resolution-engine.ts` | CGR-AR-RESOLVE | Four-hop derivation, Narrowing-only, Determinism |
| 5 | Conflict resolution + supremacy | `cg/engines/supremacy-engine.ts` | CGR-AR-SUPREMACY | No constitutional/principle override, Non-inversion |
| 6 | Network traceability + graph + impact | `cg/graph/{governance-graph,trace-verifier,impact-analyzer}.ts` | CGR-TR-GRAPH/VERIFY/IMPACT | Four-hop derivation, Acyclic, No new registry |
| 7 | Read-model projection (network) | `cg/reasoning/read-model.ts` | reasoning | Determinism, No new registry |
| 8 | Network-layer test suites | `test/cg/{registries,validation,engines,graph,system}/*.test.ts` | all | All gates |

---

## Y. Risks and Constraints

| Risk / Constraint | Description | Mitigation (repository reality) |
|-------------------|-------------|---------------------------------|
| RC-1 Doctrine not ratified | GD-0002, PCAMG-0000/0002, PCAMG-1000/2000/3000 are PROPOSED · NOT RATIFIED · NOT IMPLEMENTATION AUTHORIZED | Build only as **propose-only** center state + read reasoning; no ACTIVE; admission/activation stay AUTH-012 Approval-Required acts |
| RC-2 Substrate dependency | CGR-REG-CENTER + Wave-2 engines depend on the Wave-1 substrate and layers 0016/0017/0018; canonical root not yet materialized | Sequence: materialize Wave-1, principle, meta, governance layers, then the network-scoped engines |
| RC-3 Network-as-origin | A latent path could let a network/center originate or self-privilege authority | N-1 invariant + four-hop up-trace + supremacy; adversarial suite attempts network-conferred authority and must be voided |
| RC-4 Layer inversion | A center/network emitted with precedence over a constitution/principle | Non-inversion enforced by supremacy + traceability; adversarial inversion suite must deny |
| RC-5 Inventing a network registry | Adding a new `network-registry.ts` would be new architecture | Network is a read-only projection over CGR-REG-CENTER + CGR-REG-TRACE; no new registry authorized |
| RC-6 Delegation cycle | A `parent_center` chain forming a cycle | VR-G3 / T-5 acyclic check; cyclic delegation ⇒ void |
| RC-7 Widening delegation | Cross-center delegation that grants more than the source holds | Narrowing-only (N-5); bounded-subset check in resolution |
| RC-8 Machine-terminal escalation | An escalation path ending at an execution or AI | N-6 / S-V: escalation must terminate at the Authority Board (human) |
| RC-9 Cross-center leakage | A center acting in another's scope without delegation | Deny-by-default cross-center (N-9); fail-closed |
| RC-10 Baseline regression | New suites perturb 378/65 | Re-run 443 after each package; tsconfig unchanged; glob append-only |

---

## Z. Formal Authorization Statement

On verified repository reality and existing doctrine alone, the Polycentric Governance Network runtime layer is authorized for construction under the single canonical root `packages/platform-runtime/src/control/constitutional-governance/`. The layer materializes PCAMG-3000 (the governance-center schema; network rules N-1..N-10; escalation to terminal human authority) as **propose-only** center records in **CGR-REG-CENTER**, with the network itself realized as a **read-only projection** over CGR-REG-CENTER and CGR-REG-TRACE — **no new network registry is introduced**. Admission, validation, authority resolution, conflict resolution, traceability, and supremacy are the network-scoped slices of **CGR-AR-RESOLVE / CGR-AR-VALIDATE / CGR-AR-SUPREMACY** and **CGR-TR-VERIFY / CGR-TR-GRAPH / CGR-TR-IMPACT** — all components already authorized in the construction chain (0010 Wave-1/Wave-2; 0012-as-reconciled-by-0012B), and all derived from and strictly bounded by the Sovereignty Origin and Invariant Principles (0016), the Meta-Constitution (0017), and Governance Generation (0018). No new constitutional theory and no new architecture are introduced; all reasoning is deterministic, read-only, and fail-closed. A governance node is a generated governance system participating in the network; every node's authority is legitimate only by a four-hop up-trace to ≥1 invariant principle. A network cannot originate authority (`absolute_authority=false` is invariant), cannot overrule a constitution (non-inversion), and cannot overrule a principle (supremacy). Multiple nodes remain sovereign within their scope while participating, because the network only routes and bounds already-derived authority — deny-by-default across centers, narrowing-only in delegation, acyclic in structure, and human-terminal in escalation. This package proves and enforces **Principles > Constitutions > Governance > Governance Networks**, and never the reverse. Construction is strictly additive over the verified 443/443 baseline, introduces no ACTIVE status, performs no center enrollment, and touches no PROHIBITED path. No `governance-runtime` reference exists in this package.

---

**POLYCENTRIC GOVERNANCE IMPLEMENTATION AUTHORIZED**
