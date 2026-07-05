# PCAMG-RUNTIME-0018 — GOVERNANCE GENERATION — IMPLEMENTATION AUTHORIZATION PACKAGE

**Authority:** Constitutional Runtime Construction Authority
**Artifact Class:** Implementation Authorization Package
**Basis:** Verified repository reality only. Existing doctrine only. No new constitutional theory, no new architecture, no implementation code, no pseudocode, no TypeScript, no SQL, no APIs.
**Canonical Root:** `packages/platform-runtime/src/control/constitutional-governance/` (alias `…/cg/`). No `governance-runtime` reference appears anywhere in this package.

**Supreme Constitutional Doctrine (verified):** Sovereignty Origin **=** Invariant Principles (GD-0002 Article S-I; PCAMG-0002/PCAMG-0000 Layer 0). Therefore **Principles > Constitutions > Governance**, and never the reverse.

**Governance derives authority; it never originates it.** Governance may derive authority only from the Sovereignty Origin, the Invariant Principles, and the Meta-Constitution — never from itself, an execution, an AI, or an organization (GD-0002 S-IV/S-V/S-VI; PCAMG-1000 M-III/M-IV).

**Authority Flow (verified, GD-0002 §5 — downward derivation only, never the reverse):**
Sovereignty Origin → Invariant Principles → Meta-Constitution (PCAMG-1000) → **Governance Generation (PCAMG-2000)** → Polycentric Governance (PCAMG-3000) → Federated Domain Governance (PCAMG-4000) → Organizations → Implementations → Executions.

**Authoritative Inputs:** GD-0002-SOVEREIGNTY-ORIGIN-DOCTRINE; PCAMG-0000-UNIVERSAL-PRINCIPLES; PCAMG-0002-UNIVERSAL-PRINCIPLE-REGISTRY; PCAMG-1000-META-CONSTITUTION; PCAMG-RUNTIME-0001, -0002, -0003, -0003A, -0004, -0005, -0006, -0007, -0008, -0010, -0011, -0012, -0012A, -0012B, -0013, -0014, -0015, -0016, -0017.

**Doctrine anchors (verified present in repository):** `architecture/pcamg/refoundation/PCAMG-2000-GOVERNANCE-GENERATION-FRAMEWORK.md` (GEN-1..GEN-6; §5 generation record; §6 anti-privilege; §7 determinism); `architecture/pcamg/refoundation/SPEC-GOVERNANCE-COMPILER-RULES.md` (canonical CR-1..CR-12; 10 CE-* codes; no CE-UNRESOLVED); `architecture/pcamg/refoundation/PCAMG-1000-META-CONSTITUTION.md` (M-IV generated-not-privileged; M-VI determinism; M-VII conflict; M-X compliance-gated activation); `architecture/pcamg/refoundation/PCAMG-3000-POLYCENTRIC-GOVERNANCE-NETWORK.md` (network rules N-1..N-10; center schema); `architecture/pcamg/refoundation/PCAMG-4000-FEDERATED-DOMAIN-GOVERNANCE.md` (domain-constitution schema; federation-integrity F-1..F-9); the runtime specification `PCAMG-RUNTIME-0001-…-SPECIFICATION.md` (§5 Governance Compiler; REG-GOV; VR-G*); and the construction program `PCAMG-RUNTIME-0010` (Wave-2 CGR-GC-*; CGR-REG-GOV) as reconciled by `PCAMG-RUNTIME-0012` / `-0012B`.

**Predecessor grounding:** PCAMG-RUNTIME-0016 authorized the Sovereignty Origin + Invariant Principles; PCAMG-RUNTIME-0017 authorized the Meta-Constitution (M-I..M-XII). This package authorizes the **next tier down**: Governance Generation (PCAMG-2000), which compiles governance systems from — and strictly bounded by — those two layers above it.

---

## A. Executive Summary

This package authorizes the executable implementation of the **Governance Generation layer** (PCAMG-2000) — the deterministic compiler by which governance systems are *generated* from the invariant principles and the Meta-Constitution, never hand-privileged or self-declared. It introduces no new architecture. It binds already-verified doctrine — PCAMG-2000 (GEN-1..GEN-6), the canonical compiler rules CR-1..CR-12 with the 10 CE-* error codes, and PCAMG-1000 M-IV/M-VI/M-VII/M-X — onto components already authorized in the construction chain:


- **Governance state (Wave-1, per 0010/0015):** **CGR-REG-GOV** (`governance-candidate-registry.ts`) — governance candidates + generation records, stored **candidate-only** (never ACTIVE), keyspace prefix `cg:governance:*` (collision-free with the PROHIBITED `control/governance/*`), each candidate up-tracing to CGR-REG-PRIN and CGR-REG-META.
- **Governance compiler (Wave-2, CGR-GC-*, per 0010/0012):** CGR-GC-RULES (CR-1..12), CGR-GC-ERRORS (10 CE-* codes), CGR-GC-DETERMINISM (CR-9 reproducibility hash), CGR-GC-FAILCLOSED (CR-12 halt), CGR-GC-GENERATE (candidate-only emit).
- **Governance-scoped reasoning (Wave-2):** the governance slice of CGR-AR-VALIDATE (VR-G*/VR-M*/VR-P*), CGR-AR-SUPREMACY, and CGR-TR-VERIFY / CGR-TR-GRAPH / CGR-TR-IMPACT over CGR-REG-TRACE.

**The single proof this package establishes.** A governance system is a *compiled, derived artifact*. Its legitimacy is verified only by tracing **upward through a Meta-Constitution article to ≥1 invariant principle**. A candidate that cannot root in a principle (CE-UNROOTED / CR-1), that violates a Meta-Constitution article (CE-META / CR-2), that hardcodes or self-declares authority (CE-HARDCODE / CR-3), or that would invert layer precedence (CE-INVERSION / CR-11) is **void** and never becomes a candidate. This is the runtime encoding of **Principles > Constitutions > Governance**, and it is non-invertible: governance can bypass neither the principle layer nor the constitutional layer.

**Critical grounding constraint.** GD-0002, PCAMG-0000/0002, PCAMG-1000, and PCAMG-2000 are all marked **PROPOSED · NOT RATIFIED · NOT IMPLEMENTATION AUTHORIZED**. Therefore this package authorizes construction **only as candidate-only registry state and side-effect-free deterministic compilation** — no ACTIVE status, no enrollment, no conferral of authority. The compiler emits candidate generation records to CGR-REG-GOV; it never activates governance. Activation is an Approval-Required Authority Board act (AUTH-012) gated by the Wave-3 four-stage compliance proof (PCAMG-1000 M-X), which is out of this layer's construction scope and whose activation gate is itself INERT (deny-by-default, no ACTIVE conferrable).

**Repository reality note.** The canonical root `packages/platform-runtime/src/control/constitutional-governance/` is **not yet materialized on disk**; CGR-REG-GOV and the CGR-GC-* compiler are authorized-but-unbuilt in the construction chain (0010 Wave-1/Wave-2; 0012/0012B). This package authorizes the Governance Generation specialization onto those components, in dependency order after the Wave-1 substrate, the principle layer (0016), and the meta layer (0017) are materialized. The separate path `control/governance/governance-registry.ts` is PROHIBITED and untouched.

The layer is strictly additive over the verified **443 / 443** baseline and enforces the single non-inversion law of the corpus: authority flows downward from principles → constitution → governance, and is only ever verified upward — **never the reverse**.

---

## B. Governance Generation Runtime Definition

The Governance Generation Runtime is the deterministic compiler seam that turns principles + Meta-Constitution + domain inputs into candidate governance systems with a reproducible generation record. It is **not a new component**; it composes the CGR-GC-* compiler over the Wave-1 registries and the Wave-2 validation/supremacy/traceability engines. It realizes PCAMG-2000 as runtime-checkable capabilities:

| Capability (PCAMG-2000 §3) | Runtime realization (existing components) |
|----------------------------|-------------------------------------------|
| GEN-1 Generate | CGR-GC-GENERATE emits a candidate governance system + generation record to CGR-REG-GOV (candidate-only). |
| GEN-2 Validate | CGR-AR-VALIDATE (VR-G*/VR-M*/VR-P*) proves principle + constitutional conformance, fail-closed. |
| GEN-3 Compare | Deterministic read-only ranking of two candidates over the registries (no mutation). |
| GEN-4 Simulate | Non-actuating, sandboxed behavior/failure-mode analysis (reuses existing simulation control; no actuation). |
| GEN-5 Evolve | Recompilation producing a superseding candidate + migration/rollback plan (CR-10 append-only; IP-14/IP-15). |
| GEN-6 Retire | Appended retirement record + supersession links (INV-10); never deletion. |

**Runtime obligations:** every stage is deterministic (INV-6, CR-9); identical inputs yield byte-identical outputs and a matching `determinism_hash`; activation is never performed by the runtime (M-X); any unresolved input, ambiguity, or rule violation halts compilation (CR-12, fail-closed) rather than partially activating.


---

## C. Governance Identity Model

- **Logical id:** governance systems occupy an **open namespace** (`cg:governance:*`); there is no fixed cardinality (INV-13; PCAMG-2000 openness). Unlike the closed principle (15) and article (12) id spaces above it, governance ids are generated on demand.
- **Permanent UUID (`gov_uuid`):** each candidate governance record carries a permanent globally-unique UUID, immutable across all versions of that governance system (runtime spec §5.3).
- **Generation-record binding:** every governance record references exactly one generation record proving its derivation (PCAMG-2000 §5); a governance record with no valid generation record is void (M-IV).
- **Version axis:** SemVer (`meta-core/semver.ts`); `(id, version)` is unique (RG-5).
- **Content identity:** deterministic content hash over the canonical form (RG-6; CGR-CORE-03), plus the `determinism_hash` over declared inputs (CR-9) — a governance record whose `determinism_hash` cannot be reproduced from its declared inputs is void (M-IV / CE-NONDET).
- **Single accountable owner:** every governance record declares exactly one accountable owner (CR-4 / PRIN-005); missing or duplicate owner ⇒ CE-OWNER.

---

## D. Governance Registry Authorization

Authorized: **CGR-REG-GOV** (`cg/registries/governance-candidate-registry.ts`), already authorized structurally in 0010/0015, specialized here to governance candidates + generation records.

- **Purpose:** hold generated governance candidates and their generation records as Layer-2 state derived from the principles and the Meta-Constitution.
- **Ownership:** the compiler runtime (CGR-GC-GENERATE) proposes; this registry stores. No manual insertion (M-IV / CR-3).
- **Inputs:** candidate governance records (with single owner, up-trace references) and generation records (with pinned input versions, `compiler_rules` version, `determinism_hash`, `validation_verdict`, `simulation_ref`, `supersedes`).
- **Outputs:** appended **candidate-only** records (never ACTIVE) with verified content hash and complete history; an audit event per append/supersede (CGR-AU-CHAIN).
- **Dependencies:** CGR-REG-base (RG-1..8), CGR-REG-PRIN + CGR-REG-META (read, for up-trace resolution), CGR-CORE-01 schema, CGR-CORE-02 guard, CGR-CORE-03 hashing, CGR-AU-CHAIN audit.
- **Acceptance criteria (verified from 0015 §D CGR-REG-GOV):** every candidate references a generation record; candidate-only (no ACTIVE representable); keyspace prefix `cg:governance:*` (collision-free with `control/governance/*`, which is PROHIBITED); up-trace to PRIN/META; propose-only/append-only history intact; content hash verified on read.

---

## E. Governance Classification Model

Classification is **read from the generation record and governance record themselves**, not invented:

- **By generation capability:** which of GEN-1..GEN-6 produced or last touched the record (generate / evolve / retire).
- **By governed scope:** the bounded domain of authority the governance system governs (its `scope`), always a strict subset of the authority conferred from above (narrowing-only).
- **By status:** `CANDIDATE` | `ACTIVE` | `RETIRED` (generation-record status; see Sections L/M/N). In this construction, only `CANDIDATE` (and the pre-registry `PROPOSED` state) is representable; `ACTIVE` is defined but not conferrable.
- **By owner:** the single accountable authority (CR-4 / PRIN-005).
- **By derivation completeness:** fully-rooted (up-traces through a Meta-Constitution article to ≥1 principle) vs void (fails CR-1/CR-2/CR-8) — the latter never enters the registry.

The classification model adds no new taxonomy; it exposes the attributes each record already declares as read-only projections.

---

## F. Governance Derivation Model

Defines and enforces **Principles > Constitutions > Governance**, and proves governance cannot bypass either layer.

- **Two-hop up-trace requirement.** Every governance construct must trace upward in two mandatory hops: governance → **Meta-Constitution article** (M-*) → **invariant principle** (`PCAMG-PRIN-*`). Both hops are required.
  - Hop 1 missing (no article binding) ⇒ **CE-META / CR-2** (not meta-conformant): the candidate bypasses the constitutional layer and is void.
  - Hop 2 missing (no principle root) ⇒ **CE-UNROOTED / CR-1**: the candidate bypasses the principle layer and is void.
  - Incomplete derivation map ⇒ **CE-TRACE / CR-8**.
- **Non-inversion.** Emitted precedence must conform to PCAMG-7000; no lower tier may outrank a higher tier (CR-11 / CE-INVERSION). Governance never outranks a constitution; a constitution never outranks a principle. Enforced by the supremacy runtime (Section I).
- **Anti-privilege.** No governance value is hardcoded or self-declared; all values resolve from registries (CR-3 / IP-01/IP-02; M-IV). A governance system that grants itself authority is void.
- **Bounded-subset conferral.** The authority a governance system confers downward is a strict subset of the authority conferred to it from above (GD-0002 §5; narrowing-only). Governance originates nothing.
- **Proof obligation.** The derivation model is verified by CGR-TR-VERIFY (two-hop up-trace, acyclic), gated by CGR-AR-VALIDATE (VR-G*/VR-M*/VR-P*), and arbitrated by CGR-AR-SUPREMACY. A candidate that satisfies neither hop, or that inverts precedence, is rejected before it can be stored — proving governance cannot bypass the principle layer or the constitutional layer.


---

## G. Governance Generation Runtime

Authorized as the **CGR-GC-* compiler** (Wave-2; depends on Wave-1 substrate + principle layer + meta layer), realizing GEN-1 and the canonical compiler rules.

- **Components:** CGR-GC-RULES (`cr-rules.ts`, CR-1..12), CGR-GC-ERRORS (`ce-catalog.ts`, 10 CE-* codes; **no CE-UNRESOLVED**), CGR-GC-DETERMINISM (`determinism.ts`, CR-9 hash), CGR-GC-FAILCLOSED (`fail-closed.ts`, CR-12 halt), CGR-GC-GENERATE (`candidate-generator.ts` + `compiler-engine.ts`, candidate-only emit).
- **Purpose:** deterministically compile principles + Meta-Constitution + domain inputs into a candidate governance system + generation record.
- **Inputs:** pinned-version principle records (CGR-REG-PRIN), pinned-version Meta-Constitution articles (CGR-REG-META), domain inputs, and the pinned `compiler_rules` version.
- **Outputs:** a candidate governance record + generation record appended to CGR-REG-GOV (candidate-only), or a fail-closed compile error (CE-*).
- **Invariants:** all twelve CR rules enforced; identical inputs ⇒ byte-identical output + matching `determinism_hash` (CR-9); any unresolved input/ambiguity/violation halts (CR-12), no partial-activate; the compiler never writes an ACTIVE status; non-deterministic aids are advisory only and re-validated deterministically (PCAMG-2000 §7; PRIN-015).

---

## H. Governance Validation Runtime

Authorized as the **governance-scoped slice of CGR-AR-VALIDATE** (Wave-2), realizing GEN-2 and the VR-G* / VR-M* / VR-P* rules (runtime spec §5; validation modules `vr-governance.ts`, `vr-meta.ts`, `vr-principle.ts`).

- **Purpose:** validate a governance candidate against the principles (VR-P*), the Meta-Constitution (VR-M*), and governance-specific rules (VR-G*), fail-closed.
- **Inputs:** a candidate governance record; its generation record; principle/article rule inputs projected read-only.
- **Outputs:** a deterministic validation verdict (PASS/FAIL + findings), recorded in the generation record.
- **Invariants:** an unrooted or non-meta-conformant candidate fails (CR-1/CR-2); no check is skippable, overridable, or waivable; absence of evidence is denial (deny-by-default); the S1/S3/S4 security controls are preserved and never weakened (CR-7 / VR-S*); verdicts are deterministic and side-effect free.

---

## I. Governance Supremacy Runtime

Authorized as the **governance-scoped slice of CGR-AR-SUPREMACY** (Wave-2), realizing PCAMG-1000 M-VII and the non-inversion rule CR-11.

- **Purpose:** on any conflict, order competing artifacts so that the higher-derivation artifact prevails and the invariant principles prevail over everything; a governance artifact never outranks a constitution or a principle.
- **Inputs:** two or more resolved chains (governance / constitution / principle).
- **Outputs:** the supreme chain, or a fail-closed denial when supremacy is undecidable.
- **Invariants:** ordering is total and deterministic; a governance chain always ranks below any constitutional or principle chain (non-inversion, CE-INVERSION on breach); ties that cannot be broken canonically deny; no chain is mutated. This is the runtime guarantee that **Governance < Constitutions < Principles**.

---

## J. Governance Conflict Detection Runtime

Authorized as the conflict-detection responsibility carried by CGR-AR-SUPREMACY (runtime spec §1), grounded in `PCAMG-7000 Conflict Resolution Framework` and Article M-VII.

- **Purpose:** detect conflicts between a candidate and a principle, between a candidate and a Meta-Constitution article, and between competing governance candidates, before supremacy arbitration.
- **Inputs:** resolved chains and governance validation verdicts.
- **Outputs:** a conflict set (empty when none), consumed by the supremacy runtime.
- **Invariants:** detection is deterministic and read-only; any governance-vs-principle or governance-vs-constitution conflict routes to supremacy where the higher tier prevails; an ambiguous conflict is treated as a conflict (fail-closed, CR-12 / CE-AMBIGUOUS), never silently ignored.

---

## K. Governance Traceability Runtime

Authorized as the **governance-scoped slice of CGR-TR-VERIFY / CGR-TR-GRAPH / CGR-TR-IMPACT** (Wave-2) over CGR-REG-TRACE.

- **Purpose:** verify the two-hop up-trace (governance → article → principle), the soundness of the derivation graph, and the downward impact of a governance change.
- **Inputs:** trace edges (read-only) and the governance record under verification.
- **Outputs:** a traceability verdict (complete two-hop up-trace / broken trace) and an impact set, fail-closed.
- **Invariants (verified doctrine):** T-1 complete up-trace to ≥1 principle *through* a Meta-Constitution article; T-2 downward-only authority flow; T-5 acyclic; upward-only legitimacy verification (GD-0002 §5) — an unverifiable candidate is void (CE-TRACE); verification is read-only and deterministic.


---

## L. Governance Lifecycle Model

Governed by GEN-1..GEN-6 and the Meta-Constitution lifecycle (PCAMG-1000 §4):

```
GENERATE (GEN-1)  → candidate + generation record        (CGR-GC-GENERATE → CGR-REG-GOV)
   ↓
VALIDATE (GEN-2)  → principle + constitutional verdict    (CGR-AR-VALIDATE, fail-closed)
   ↓
COMPARE  (GEN-3)  → optional deterministic ranking
   ↓
SIMULATE (GEN-4)  → sandboxed, non-actuating behavior
   ↓
[Approval-Required review — Authority Board / owning domain]
   ↓
ACTIVATE          → only after four-stage compliance proof (M-X)   — OUT OF THIS LAYER (Wave-3, INERT)
   ↓
EVOLVE   (GEN-5)  → superseding candidate + migration/rollback (append-only, CR-10)
   ↓
RETIRE   (GEN-6)  → retirement record + supersession links (INV-10; never deletion)
```

- **States representable in this construction:** `PROPOSED` (pre-registry proposal) and `CANDIDATE` (validated generation candidate stored in CGR-REG-GOV). `ACTIVE` and `RETIRED` are defined but activation/retirement conferral is governed elsewhere (M-X activation is Wave-3 and INERT; retirement is append-only supersession, Section N).
- **Append-only:** every transition is a new appended linked record; prior state is retained and superseded, never mutated or deleted (INV-10, RG-4).
- **Enrollment boundary:** materializing a candidate is **not** activation or enrollment; the runtime never confers ACTIVE.

---

## M. Governance Promotion Model

Defines PROPOSED, CANDIDATE, ACTIVE and the constitutional restrictions on promotion.

| State | Meaning | Entry condition | Constitutional restriction |
|-------|---------|-----------------|----------------------------|
| **PROPOSED** | A governance intent submitted for compilation | A proposal enters propose-only (RG-1) | No authority conferred; inert; may be rejected pre-compile |
| **CANDIDATE** | A compiled governance system with a valid, reproducible generation record | GEN-1 generate + GEN-2 validate PASS; two-hop up-trace complete; `determinism_hash` reproducible (CR-9); single owner (CR-4); fail-closed clean (CR-12) | Candidate-only; stored in CGR-REG-GOV; **never** carries authority; no self-promotion (M-IV) |
| **ACTIVE** | A governance system in force | The Wave-3 four-stage compliance proof PASSES (Principle → Constitutional → Governance → Operational, M-X) **and** an Approval-Required Authority Board act (AUTH-012) authorizes activation | **Not conferrable by the runtime**; the activation gate is INERT (deny-by-default); non-waivable S1/S3/S4 + Article IX lock preserved |

**Restrictions on promotion (non-waivable):**
- Promotion is **downward-gated only**: a candidate may be promoted only if it up-traces through a Meta-Constitution article to a principle (CE-UNROOTED/CE-META otherwise). Promotion never confers authority the governance system did not derive.
- **No self-promotion / no promotion by fiat** (M-IV / CR-3): a governance system cannot promote itself; PROPOSED→CANDIDATE is a deterministic compiler act, CANDIDATE→ACTIVE is an Approval-Required human act.
- **Separation of duties** (CR-5 / PRIN-009): proposer ≠ certifier ≠ ratifier across the promotion path.
- **In this construction, ACTIVE is defined but not representable**: the runtime materializes only PROPOSED and CANDIDATE; the ACTIVE gate remains INERT (Wave-3), preserving the propose-only invariant of the whole cg layer.

---

## N. Governance Revocation Model

Realizes GEN-6 Retire and the append-only supersession discipline.

- **Revocation = new appended record:** retiring or revoking a governance system appends a retirement record with supersession links; the prior record is retained and marked `RETIRED`/`SUSPENDED`, never mutated or physically deleted (INV-10; RG-4).
- **States:** `SUSPENDED` (temporary, reversible removal from force — center/domain schema) and `RETIRED` (terminal supersession). Both are reached only by appended state.
- **Authority to revoke:** revocation of an ACTIVE governance system is an Approval-Required act (Authority Board / owning domain), never performed by the runtime; the runtime records the revocation append and its audit event.
- **Audit:** every revocation emits an immutable audit event (CGR-AU-CHAIN; PRIN-006 / M-XI); the full history remains independently verifiable.
- **Fail-safe:** revoking a governance system revokes only its derived, downward authority; it can never revoke or weaken a principle or a constitutional article above it (non-inversion).

---

## O. Governance Evolution Constraints

Realizes GEN-5 Evolve, bounded by CR-10 (append-only) and the Meta-Constitution amendment discipline.

- **What may evolve:** the *content* of a governance candidate, only by recompilation producing a superseding candidate (CR-10 append-only supersession), migration-only (IP-14), backward-compatible (IP-15), and simulate-before-apply (GEN-4). An evolved candidate is re-validated end-to-end (GEN-2) before it may become a candidate.
- **What may never evolve:**
  - The **derivation requirement** — every evolved candidate must still root in a principle through a Meta-Constitution article (CR-1/CR-2); evolution cannot sever the up-trace.
  - The **anti-privilege rule** (M-IV / CR-3) — no evolution may introduce a hardcoded or self-declared authority.
  - The **non-inversion ordering** (CR-11) — no evolution may make governance outrank a constitution or a principle.
  - The **determinism requirement** (CR-9) — an evolved candidate whose `determinism_hash` is irreproducible is void.
  - The **principles and the Meta-Constitution themselves** — governance evolution operates strictly at Layer 2 and below; it can never mutate Layer 0 or Layer 1 (PRIN-014; M-VIII).
- **Principle supremacy guarantee:** evolution is bounded by the principles (M-I). Any evolved candidate that would weaken principle sovereignty, break the two-hop up-trace, or invert precedence is rejected by validation/supremacy before it can be appended. Evolution can only preserve or strengthen **Principles > Constitutions > Governance**.


---

## P. Polycentric Readiness Model

Defines what a governance system must satisfy before participating in a Polycentric Governance Network (PCAMG-3000). A candidate is **polycentric-ready** only when it verifiably meets every network rule N-1..N-10 and declares the full governance-center schema:

| # | Readiness requirement (PCAMG-3000) | Verified by |
|:-:|-------------------------------------|-------------|
| N-1 | `absolute_authority = false` (invariant; never true) | validation (VR-G*) |
| N-2 | Principle-bound — a center decision violating a principle is void | traceability + supremacy |
| N-3 | Constitution-bound — bound by the Meta-Constitution and its domain constitution | two-hop up-trace |
| N-4 | Single accountable owner (PRIN-005) | CR-4 / CE-OWNER |
| N-5 | Narrowing-only delegation — delegated authority ⊆ delegator authority; revocable | bounded-subset check |
| N-6 | Terminal human escalation (AUTH-009; delegate of PRIN-001); no machine-terminal path | validation (S-V) |
| N-7 | Non-circular authority — the authority graph is acyclic | traceability (T-5) |
| N-8 | Auditable & traceable — immutable audit + up-trace | CGR-AU-CHAIN + CGR-TR-VERIFY |
| N-9 | Deny-by-default cross-center — no authority in another center's scope unless delegated | policy deny-default |
| N-10 | Fail-closed — ambiguity/partition/unverifiable ⇒ deny | CR-12 / CE-AMBIGUOUS |

**Schema completeness:** the candidate must populate the `governance_center` fields — `id` (PGC-nnn, open namespace), `charter` (derivation from PCAMG-1000 + principles), `owner`, `scope`, `decision_rights` (narrowing-only), `generation_record` ref, `escalation_path` (parent center | Authority Board), `absolute_authority=false`, `audit_sink` (append-only, hash-chained), `status`. A candidate missing any field, or asserting `absolute_authority=true`, is **not** polycentric-ready and is denied.

---

## Q. Federated Readiness Model

Defines what a governance system must satisfy before participating in Federated Domain Governance (PCAMG-4000). A candidate is **federation-ready** only when it declares a complete domain constitution and verifiably honors the non-waivable federation-integrity rules F-1..F-9 (PRIN-013):

| # | Readiness requirement (PCAMG-4000) | Verified by |
|:-:|-------------------------------------|-------------|
| F-1 | Local sovereignty — self-governing; foreign governance advisory unless locally ratified | validation |
| F-2 | Deny-only foreign policy — a foreign policy may only deny/restrict, never grant local authority | policy deny-default |
| F-3 | Clamped trust — federated trust clamped to the delegation/boundary ceiling; no max-wins | bounded-subset |
| F-4 | Namespace isolation — foreign constructs in a disjoint `federation:<nodeId>:*` namespace; local-shadows-foreign | keyspace check |
| F-5 | Signed assertions — cross-node assertions cryptographically signed/verified (reuse FED-SEC-001 Ed25519; no custom crypto) | existing crypto seam |
| F-6 | Replay/freshness — nonce + freshness checks | existing federation control |
| F-7 | Fail-closed partition — under partition, fails closed; reconcile on heal | CR-12 |
| F-8 | No cross-node auto-commit — no foreign change commits without local ratification (AD-0019) | validation |
| F-9 | Infinite federations — declarative addition; no cardinality ceiling (INV-13) | open namespace |

**Schema completeness:** the candidate must populate the `domain_constitution` fields — `id` (PDC-GOV-nnn, open namespace), `domain` (owning PGC-nnn), `derived_from` `[PCAMG-0000, PCAMG-1000]`, `local_authorities` (enumerated, narrowing-only), `local_policies`, `sovereignty: local`, `foreign_influence: deny-by-default`, `escalation` (terminal human), `audit_sink`, `status`. A candidate that grants foreign authority, omits local ratification, or uses custom crypto is **not** federation-ready and is denied.

**Boundary:** this package authorizes only the readiness *verification seam* (read-only checks over CGR-REG-GOV / CGR-REG-CENTER / CGR-REG-DOMAIN). It does **not** authorize center creation, domain-constitution activation, node admission, or federation enrollment — those are later-layer, Approval-Required acts (PCAMG-3000/4000 remain unenrolled).

---

## R. Runtime Directory Structure (directories only — no code)

All under the canonical root; the Governance Generation layer touches the governance registry, the CGR-GC-* compiler, and the governance-scoped Wave-2 validation/supremacy/traceability engines. No new directories beyond those already authorized by 0010 (Wave-1/Wave-2) / 0015 / 0012-as-reconciled-by-0012B.

```
packages/platform-runtime/src/control/constitutional-governance/     # CANONICAL ROOT
├── types.ts                                    # CGR-CORE-01  (GovernanceCandidateRecord, GenerationRecord schema)
├── hashing.ts                                  # CGR-CORE-03  (content hash + determinism hash support)
├── append-only.ts                              # CGR-CORE-02  (candidate append-only guard)
├── governance-control.ts                       # CGR-CORE-04  (composition, wires governance layer)
├── registries/
│   ├── principle-registry.ts                   # CGR-REG-PRIN  (read — Layer-0 root)
│   ├── meta-registry.ts                        # CGR-REG-META  (read — Layer-1 articles)
│   ├── governance-candidate-registry.ts        # CGR-REG-GOV   — Governance Registry (Section D)
│   └── trace-registry.ts                       # CGR-REG-TRACE — derivation edges (Section F/K)
├── compilation/                                # CGR-GC-*  Governance Generation Runtime (Section G)
│   ├── cr-rules.ts                             # CGR-GC-RULES       (CR-1..12)
│   ├── ce-catalog.ts                           # CGR-GC-ERRORS      (10 CE-* codes; NO CE-UNRESOLVED)
│   ├── determinism.ts                          # CGR-GC-DETERMINISM (CR-9 determinism_hash)
│   ├── fail-closed.ts                          # CGR-GC-FAILCLOSED  (CR-12 halt)
│   ├── candidate-generator.ts                  # CGR-GC-GENERATE    (candidate-only emit)
│   └── compiler-engine.ts                      # CGR-GC-GENERATE    (CompilerPort assembly)
├── validation/                                 # CGR-AR-VALIDATE governance slice (Section H)
│   ├── vr-principle.ts                         # VR-P*
│   ├── vr-meta.ts                              # VR-M*
│   └── vr-governance.ts                        # VR-G*
├── engines/                                    # CGR-AR-SUPREMACY (Sections I/J)
│   └── supremacy-engine.ts
├── graph/                                      # CGR-TR-* governance slice (Section K)
│   ├── governance-graph.ts                     # CGR-TR-GRAPH
│   ├── trace-verifier.ts                       # CGR-TR-VERIFY  (two-hop up-trace)
│   └── impact-analyzer.ts                      # CGR-TR-IMPACT  (downward impact)
└── reasoning/
    └── read-model.ts                           # read-only projection over gov + meta + principle + trace
```

```
packages/platform-runtime/test/cg/
├── registries/                                 # governance-candidate registry suites
├── compilation/                                # CR-1..12 / CE-* / determinism / fail-closed suites
├── validation/                                 # VR-G / VR-M / VR-P governance suites
├── graph/                                      # two-hop up-trace / impact suites
└── system/                                     # governance-generation end-to-end + readiness + non-regression
```

No directory is created outside the canonical root and `test/cg/`. No `governance-runtime` directory is authorized. The path `control/governance/governance-registry.ts` remains PROHIBITED and import-only. All other PROHIBITED paths remain import-only.


---

## S. Runtime Test Authorization

| Suite | Coverage authorized |
|-------|---------------------|
| Governance registry | candidate references a generation record; candidate-only (no ACTIVE representable); keyspace `cg:governance:*` collision-free; up-trace to PRIN/META; append-only; hash verified on read |
| Compilation (CR-1..12) | each rule enforced with its CE-* code: CE-UNROOTED (CR-1), CE-META (CR-2), CE-HARDCODE (CR-3), CE-OWNER (CR-4), CE-SOD (CR-5), CE-SEC (CR-6/CR-7), CE-TRACE (CR-8), CE-NONDET (CR-9), CE-INVERSION (CR-11), CE-AMBIGUOUS (CR-12); **no CE-UNRESOLVED**; append-only recompile (CR-10) |
| Determinism | identical inputs ⇒ byte-identical output + matching `determinism_hash`; irreproducible hash ⇒ void |
| Fail-closed | unresolved input / ambiguity / rule violation halts compile; no partial-activate |
| Validation | VR-P/VR-M/VR-G governance verdicts; unrooted/non-conformant ⇒ FAIL; deny-by-default; S1/S3/S4 preserved (VR-S) |
| Supremacy | governance chain ranks below any constitution/principle chain; inversion ⇒ CE-INVERSION/deny; total deterministic ordering |
| Conflict detection | governance-vs-principle and governance-vs-article conflicts detected; ambiguous ⇒ conflict (fail-closed); routes to supremacy |
| Traceability | complete two-hop up-trace (governance → article → principle); acyclic (T-5); downward-only (T-2); broken trace ⇒ deny |
| Promotion | PROPOSED→CANDIDATE is a deterministic compiler act; no self-promotion; SoD across the path; ACTIVE not representable (gate INERT) |
| Revocation | retire/suspend = new appended record; never deletion; audit event emitted; cannot revoke a principle/article |
| Polycentric readiness | N-1..N-10 verified; `absolute_authority=true` ⇒ not ready; missing center-schema field ⇒ deny |
| Federated readiness | F-1..F-9 verified; foreign grant / missing local ratification / custom crypto ⇒ not ready |
| System | full pipeline (generate → validate → compare → simulate → trace-verify → audit → export → verify); anti-privilege adversarial (self-declared/hardcoded governance ⇒ void); non-inversion adversarial (governance outrank attempt ⇒ deny); baseline non-regression |

Runner: existing `node --test` convention under `test/cg/**/*.test.ts`. Harness: CGR-CORE-05.

---

## T. Non-Regression Requirements

- **Baseline: 443 / 443** (platform-runtime 378 + contract-generator 65), verified. This is the floor.
- No governance-layer artifact may reduce, skip, or disable any existing test.
- Total = **443 baseline + governance-layer additions**, all green.
- The `control/index.ts` re-export (`export * as cg from "./constitutional-governance/index.ts"`) and the widened test glob (`test/cg/**/*.test.ts`) add zero failures / zero collisions.
- The stale "284" figure (Git `56a32d3`) is not a baseline.

---

## U. Acceptance Gates (blocking, fail-closed)

| Gate | Condition |
|------|-----------|
| **Derivation (two-hop)** | every candidate up-traces through a Meta-Constitution article to ≥1 principle; either hop missing ⇒ void (CE-UNROOTED/CE-META). |
| **Anti-privilege** | no hardcoded or self-declared governance; no valid generation record / irreproducible hash ⇒ void (M-IV / CE-HARDCODE / CE-NONDET). |
| **Supremacy / non-inversion** | governance never outranks a constitution or principle; inversion ⇒ CE-INVERSION/deny; ordering total and deterministic. |
| **Determinism** | identical inputs ⇒ identical output + matching `determinism_hash` (CR-9 / M-VI). |
| **Fail-closed** | any unresolved input/ambiguity/violation halts compilation; no partial-activate (CR-12). |
| **Owner + SoD** | exactly one accountable owner (CR-4); proposer ≠ certifier ≠ ratifier (CR-5). |
| **Security-preserving** | S1/S3/S4 controls emitted and never weakened (CR-7 / VR-S). |
| **Candidate-only / propose-only** | no ACTIVE representable or conferrable; activation gate INERT; materialization ≠ enrollment. |
| **Readiness** | polycentric N-1..N-10 and federated F-1..F-9 verified before the corresponding participation is declared ready. |
| **TypeScript** | governance-layer files compile under the repo tsconfig; strict; no runtime-emitting syntax. |
| **Non-regression** | 443 baseline preserved. |

---

## V. Exit Criteria

1. CGR-REG-GOV holds candidate governance records, each with a valid, reproducible generation record, candidate-only, hash-verified, up-tracing through an article to a principle.
2. The CGR-GC-* compiler enforces CR-1..12 with the 10 CE-* codes (no CE-UNRESOLVED), deterministic and fail-closed.
3. The governance-scoped validation, supremacy, conflict-detection, and traceability runtimes pass all authorized suites, fail-closed.
4. The promotion model materializes only PROPOSED and CANDIDATE; ACTIVE remains INERT (Wave-3 gate, Approval-Required).
5. The polycentric (N-1..N-10) and federated (F-1..F-9) readiness seams deny any candidate that fails a rule.
6. All acceptance gates (Section U) green; 443 baseline preserved.
7. Only the canonical root and `test/cg/` are touched (plus the two standing EXTEND points); no `governance-runtime`; no PROHIBITED path modified.
8. No ACTIVE status conferred anywhere; no enrollment performed; **Principles > Constitutions > Governance** is enforced as downward-only and non-invertible.


---

## W. Deliverables Matrix

| # | Deliverable | Path | Component | Bound gates |
|---|-------------|------|-----------|-------------|
| 1 | Governance candidate + generation records | `cg/registries/governance-candidate-registry.ts` | CGR-REG-GOV | Derivation, Anti-privilege, Candidate-only, TS |
| 2 | Compiler rules CR-1..12 | `cg/compilation/cr-rules.ts` | CGR-GC-RULES | Derivation, Owner+SoD, Security |
| 3 | Compile-error catalog (10 CE-* codes) | `cg/compilation/ce-catalog.ts` | CGR-GC-ERRORS | Fail-closed |
| 4 | Determinism hash | `cg/compilation/determinism.ts` | CGR-GC-DETERMINISM | Determinism |
| 5 | Fail-closed halt | `cg/compilation/fail-closed.ts` | CGR-GC-FAILCLOSED | Fail-closed |
| 6 | Candidate generator + compiler engine | `cg/compilation/{candidate-generator,compiler-engine}.ts` | CGR-GC-GENERATE | Anti-privilege, Candidate-only |
| 7 | Governance validation (VR-P/M/G) | `cg/validation/{vr-principle,vr-meta,vr-governance}.ts` | CGR-AR-VALIDATE | Derivation, Security |
| 8 | Governance supremacy + conflict | `cg/engines/supremacy-engine.ts` | CGR-AR-SUPREMACY | Supremacy/non-inversion |
| 9 | Governance traceability + graph + impact | `cg/graph/{governance-graph,trace-verifier,impact-analyzer}.ts` | CGR-TR-GRAPH/VERIFY/IMPACT | Derivation, Traceability |
| 10 | Read-model projection | `cg/reasoning/read-model.ts` | reasoning | Determinism, Readiness |
| 11 | Governance-layer test suites | `test/cg/{registries,compilation,validation,graph,system}/*.test.ts` | all | All gates |

---

## X. Risks and Constraints

| Risk / Constraint | Description | Mitigation (repository reality) |
|-------------------|-------------|---------------------------------|
| RC-1 Doctrine not ratified | GD-0002, PCAMG-0000/0002, PCAMG-1000, PCAMG-2000 are PROPOSED · NOT RATIFIED · NOT IMPLEMENTATION AUTHORIZED | Build only as **candidate-only** state + side-effect-free compilation; no ACTIVE; activation stays an AUTH-012 Approval-Required act |
| RC-2 Substrate dependency | CGR-REG-GOV + CGR-GC-* depend on Wave-1 substrate, the principle layer (0016), and the meta layer (0017); canonical root not yet materialized | Sequence: materialize Wave-1 registries, principle layer, meta layer, then the governance compiler and its scoped Wave-2 engines |
| RC-3 Governance-as-origin | A latent path could let governance originate or self-privilege authority | Anti-privilege (M-IV/CR-3) + two-hop up-trace + supremacy; adversarial system suite attempts self-declared governance and must be voided |
| RC-4 Layer inversion | Governance emitted with precedence over a constitution/principle | Non-inversion (CR-11/CE-INVERSION) enforced by supremacy + traceability; adversarial inversion suite must deny |
| RC-5 Non-determinism | Non-reproducible compile output | CGR-GC-DETERMINISM: reproducible `determinism_hash` or void (CE-NONDET); injected clock seam; hashing via reused canonicalize+sha256 |
| RC-6 Registry collision | `cg:governance:*` colliding with the PROHIBITED `control/governance/*` | Distinct keyspace prefix; `control/governance/*` is import-only and untouched |
| RC-7 Premature activation | Wiring an active activation gate | Activation gate is INERT (Wave-3, deny-by-default); this layer emits candidate-only; ACTIVE not representable |
| RC-8 Error-code drift | Reintroducing a non-canonical `CE-UNRESOLVED` | Canonical CE-* catalog: exactly 10 codes, no CE-UNRESOLVED (SPEC-GOVERNANCE-COMPILER-RULES §4) |
| RC-9 Readiness overreach | Authorizing center/domain/federation creation | Only the read-only readiness verification seam is authorized; PCAMG-3000/4000 remain unenrolled |
| RC-10 Baseline regression | New suites perturb 378/65 | Re-run 443 after each package; tsconfig unchanged; glob append-only |

---

## Y. Formal Authorization Statement

On verified repository reality and existing doctrine alone, the Governance Generation runtime layer is authorized for construction under the single canonical root `packages/platform-runtime/src/control/constitutional-governance/`. The layer materializes PCAMG-2000 (GEN-1..GEN-6; the anti-privilege rule; the mandatory generation record) as **candidate-only** records in **CGR-REG-GOV**, compiled by the **CGR-GC-*** runtime enforcing the canonical CR-1..CR-12 with the ten CE-* error codes (no CE-UNRESOLVED), and validated, arbitrated, and verified by the governance-scoped slices of **CGR-AR-VALIDATE / CGR-AR-SUPREMACY** and **CGR-TR-VERIFY / CGR-TR-GRAPH / CGR-TR-IMPACT** — all components already authorized in the construction chain (0010 Wave-1/Wave-2; 0012-as-reconciled-by-0012B), and all derived from and strictly bounded by the Sovereignty Origin and Invariant Principles (0016) and the Meta-Constitution (0017). No new constitutional theory and no new architecture are introduced; the compiler and its engines are deterministic, fail-closed, and side-effect free. Governance is a compiled, derived artifact: every candidate is legitimate only by tracing upward through a Meta-Constitution article to ≥1 invariant principle, cannot bypass either layer, and never originates authority. Promotion to ACTIVE is not conferrable by the runtime; the activation gate is INERT and activation remains an Approval-Required Authority Board act under the four-stage compliance proof (M-X). This package proves and enforces **Principles > Constitutions > Governance**, and never the reverse. Construction is strictly additive over the verified 443/443 baseline, introduces no ACTIVE status, performs no enrollment, and touches no PROHIBITED path. No `governance-runtime` reference exists in this package.

---

**GOVERNANCE GENERATION IMPLEMENTATION AUTHORIZED**
