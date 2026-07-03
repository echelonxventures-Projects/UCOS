# UCOS-REQ-0003 — Architectural Principles Catalog

**Artifact ID:** `UCOS-REQ-0003`
**Phase:** Phase 0 — Master Requirements Baseline (Constitutional Discovery Edition)
**Mode:** REQUIREMENTS DISCOVERY / PRINCIPLE CONSOLIDATION ONLY — no code, schema, or architecture produced.
**Status:** RATIFIED BASELINE (v1.0.0)
**Subordinate to:** `UCOS-REQ-0001`, the Authority Layer (`AUTH-001..012`), and the Constitution (`UCOS-CONST-001`).
**Date:** 2026-07-03

---

## 1. Purpose

Consolidate every governed architectural principle discovered in the repository into a single catalog, with the
charter's principle checklist evaluated against evidence and classified EXISTING / IMPLICIT / PROPOSED / MISSING.

UCOS carries **four principle layers**, all reconciled here:

1. **Architecture Principles `P1..P10`** — `AUTH-003-PRINCIPLES` / `CTX-PRIN-001`.
2. **Immutable Principles `IP-01..IP-17`** — `AUTH-003`/`AUTH-002`; ratified, immutable.
3. **Platform Engineering Principles `PEP-001..PEP-020`** — `UCOS-PEA-001`.
4. **Foundation Permanence Invariants `INV-1..INV-13`** — `UCOS-ASR-NFR-001` v1.0.1 (the enforceable, redesign-prohibited form of the principles).

---

## 2. Architecture Principles (P1–P10) — EXISTING

| ID | Principle | Statement (consolidated) | Evidence |
|----|-----------|--------------------------|----------|
| P1 | Composability over Monolith | Capabilities independently designed, deployed, recombined; strict boundaries, contracts at every seam. | `CTX-PRIN-001` |
| P2 | Contract-First, Always | Define the contract before the implementation (OpenAPI/AsyncAPI/GraphQL/JSON-Schema precede code). | `CTX-PRIN-001`; `INV-1` |
| P3 | Configuration over Customization | Express variability as metadata, not code forks. | `CTX-PRIN-001`; `IP-04` |
| P4 | Domain-Driven Boundaries | Bounded contexts, ubiquitous language, ACLs, explicit integration. | `CTX-PRIN-001`; `UCOS-DOM-ARCH-001` |
| P5 | Traceability End-to-End | Every artifact links up to intent and down to realization. | `CTX-PRIN-001`; `AUTH-010`; `CTX-TRACE-001` |
| P6 | Security & Privacy by Default | Least-privilege, zero-trust, data minimization defaults. | `CTX-PRIN-001`; `AUTH-008` |
| P7 | Observability & Operability | Everything measurable, traceable, operable in production. | `CTX-PRIN-001`; `PE-12` |
| P8 | Idempotency & Resilience | Safe-to-retry operations; graceful degradation. | `CTX-PRIN-001`; `INV-9` |
| P9 | Evolvability | Optimize for change; version everything that crosses a boundary. | `CTX-PRIN-001`; `INV-10` |
| P10 | Production-Readiness by Construction | Build it ready, certify it ready, never assume it ready. | `CTX-PRIN-001`; gates |

---

## 3. Immutable Principles (IP-01–IP-17) — EXISTING

Ratified, immutable, non-waivable absent constitutional amendment (`AUTH-003`). Those directly evidenced in the
corpus are anchored below; the full set is registered in `AUTH-003-PRINCIPLES`.

| ID | Principle (as evidenced) | Evidence |
|----|--------------------------|----------|
| IP-04 | **Configuration Driven** — behavior is configured, never hard-coded. | `AUTH-003`; substrate `test/dynamic-capability.test.ts` (0 core change) |
| IP-05 | **Policy Driven** — behavior governed via policy lifecycle/evaluation. | `AUTH-003`; PI-4 `policy-evaluator.ts`; `TO-001` (IP-04→IP-05 anchor correction) |
| IP-14 | **Migration-Only Evolution** — no destructive change; forward migration only. | `AUTH-003`; `INV-10`; `AD-0019` |
| IP-15 | **Backward Compatibility** — additive, versioned; N/N-1 coexistence. | `AUTH-003`; `UCOS-SVC-POLICY-001` |
| IP-H | **Metadata-driven theming/variability** (experience). | `UCOS-EXP-ADR-004`; `MC-13`/`MC-01` |
| IP-01..03, 06..13, 16..17 | Registered immutable principles (vision/authority/traceability/single-ownership/determinism/composability/auditability, etc.). | `AUTH-003-PRINCIPLES`; `AUTH-INDEX-001` |

> **Reconciliation note.** The 17 immutable principles (`IP-01..17`) are ratified in `AUTH-003`; this catalog
> anchors the ones with independent corpus evidence and records the full set as EXISTING by reference. A
> requirements-registry cross-index of all 17 verbatim statements is a documentation follow-up (`UCOS-AUDIT-0001` GAP-R50).

---

## 4. Platform Engineering Principles (PEP-001–PEP-020) — EXISTING

`UCOS-PEA-001` §II establishes 20 platform principles. Key anchors:

| ID | Principle | Evidence |
|----|-----------|----------|
| PEP-001..003 | Registry / Metadata / Configuration First | `UCOS-PEA-001`; substrate PI-2/3 |
| PEP-005 | Single Ownership / Single SoR per domain | `UCOS-PEA-001`; `INV-5` |
| PEP-006 | Deterministic Execution | `UCOS-PEA-001`; `PEX-*`; `INV-CORE-09` |
| PEP-010 | Platform Independence (technology neutrality) | `UCOS-PEA-001`; `INV-8`; ADR-001..007 |
| PEP-014 | Infinite Extensibility | `UCOS-PEA-001`; `INV-13` |
| PEP-016 | Migration-Only Evolution | `UCOS-PEA-001`; `IP-14` |
| PEP-020 | Approval-By-Exception | `UCOS-PEA-001`; `AUTH-009`; `AD-0009` |

---

## 5. Foundation Permanence Invariants (INV-1–INV-13) — EXISTING (enforceable form)

The redesign-prohibited, enforceable expression of the principles (`UCOS-ASR-NFR-001` v1.0.1).

| ID | Invariant | Basis |
|----|-----------|-------|
| INV-1 | Contract-first integration; no shared mutable model | IC-2; `CTX-ARCHB-001 §3` |
| INV-2 | Non-waivable S1/S3/S4 on every exposed boundary | AUTH-008; Const. Art. XII |
| INV-3 | Deny-by-default authz, least privilege, tenancy isolation | SEC-CTL-002/003/013 |
| INV-4 | Zero-trust transport (mTLS STRICT, TLS 1.3) | ADR-006 |
| INV-5 | Bounded-context isolation; one SoR per domain | PEP-005; ADR-002 |
| INV-6 | Event-driven propagation (at-least-once + idempotent + tolerant reader) | ADR-003 |
| INV-7 | Horizontal-scale-first; stateless services | ADR-001 |
| INV-8 | Platform/cloud neutrality (open contracts) | PEP-010 |
| INV-9 | Static stability (last-known-good) | §3.1 |
| INV-10 | Append-only / migration-only evolution | CFP-008; AUTH-012 |
| INV-11 | Secrets by reference | SEC-CTL-005/007 |
| INV-12 | Immutable, gated delivery | ADR-007 |
| INV-13 | Infinite Extensibility (enrolled v1.0.1) | `AUTH-012-FPA-001`; C-EX1..C-EX5 |

> **⚠️ INTERNAL DIVERGENCE (flag for reconciliation, `UCOS-AUDIT-0001` GAP-INV6).** `UCOS-ASR-NFR-001` defines
> **INV-6 = Event-driven propagation**. Several existential/analysis artifacts (`UA-05/INV-CORE-001` anchor map,
> `UCOS-UEA-0001` L4, `CIV-STRESS-001`, `UA-10-CERT-001`) refer to **"INV-6 (determinism)"**. The ratified
> definition (event-driven propagation) is authoritative; the "determinism" concern is separately carried by
> **`INV-CORE-09`**. The label reuse is a documentation-consistency defect, not a substantive conflict.

---

## 6. Charter Architectural-Principles Checklist (evaluated)

| # | Charter principle | Class. | Evidence |
|---|-------------------|:------:|----------|
| 1 | Zero Hardcoding | EXISTING | IP-04; `test/dynamic-capability.test.ts`; `REG-ABS-001` |
| 2 | Everything Configurable | EXISTING | IP-04; PEP-003; ConfigurationPort |
| 3 | Registry Driven | EXISTING | PEP-001; `RegistryPort`; `REG-ABS-001` |
| 4 | Metadata Driven | EXISTING | PEP-002; `MetadataPort`; 17 IC/13 MC |
| 5 | Configuration Driven | EXISTING | IP-04; PEP-003 |
| 6 | Governance Driven | EXISTING | AUTH-009; PEP-020; deny-by-default |
| 7 | Deterministic Execution | EXISTING | PEP-006; `INV-CORE-09`; `PEX-*` |
| 8 | Migration Only | EXISTING | IP-14; INV-10; AD-0019 |
| 9 | Auditability | EXISTING *(per-fabric)* / gap *(universal)* | S6; `ARCH-GAP-001` C1; `AUDIT-UNIV-001` |
| 10 | Traceability | EXISTING | P5; AUTH-010; `INV-CORE-03` |
| 11 | Explainability | EXISTING *(design)* | `INT-AUD-001` rationale chain (design); mandatory-explainability principle |
| 12 | Composability | EXISTING | P1; INV-1; Meta-Core composition |
| 13 | Pluggability | EXISTING | INV-8; pluggable providers/adapters/verifiers |
| 14 | Federation | EXISTING | INV-1; PI-5; AD-0018 |
| 15 | Future Compatibility | EXISTING *(INV-13)* / PROPOSED *(existential)* | INV-13; INV-20 (proposed) |
| 16 | Architectural Unboundedness | EXISTING *(domains/platforms)* / PROPOSED *(existential)* | INV-13; INV-14 (proposed) |
| 17 | Scale Agnosticism | EXISTING *(T1→T4)* / PROPOSED *(unbounded)* | INV-7; INV-14 (proposed); `CIV-STRESS-001` |
| 18 | Domain Agnosticism | EXISTING | INV-13; proven PI-4..PI-11 |
| 19 | Platform Agnosticism | EXISTING | INV-8; ADR-001..007 |
| 20 | Entity Agnosticism | EXISTING | `UNIV-ENTITY-001` SCALE-INVARIANT |
| 21 | Civilization Agnosticism | PROPOSED | `CIV-*`; AD-0014-deferred |
| 22 | Temporal Agnosticism | MISSING | no first-class temporal model (RC-051..058) |
| 23 | Future Discovery Compatibility | PROPOSED | O-16; INV-20; `PHASE-UA-04-UNKNOWN-READINESS-001` |

**Checklist result:** 20 of 23 charter principles are **EXISTING** (fully or for the enrolled scope); 3 are
split EXISTING/PROPOSED at the existential frontier; **Temporal Agnosticism is the single MISSING principle.**

---

## 7. Cross-cutting principle properties (EXISTING)

| Property | Guarantee | Realized by |
|----------|-----------|-------------|
| Fail-closed everywhere | Inability to prove an invariant halts/denies the operation. | Every `INV-CORE` recovery mode |
| Static stability | Control-plane outage never forces a violation. | INV-9; INV-CORE-04/14 |
| Append-only correction | Violations corrected by forward migration; no destructive rollback. | INV-10; INV-CORE-02/05/06/07 |
| Independent verifiability | Every invariant reproducible from recorded evidence. | Audit reconstruction; replay |
| Non-collision (INV-1..13 ↔ INV-CORE) | Integrity invariants restate/enforce, never contradict, foundation invariants. | `UA-05` §3 namespacing + anchor map |

---

## 8. Principle-catalog determination

- **The zero-hardcoding / registry-metadata-configuration-driven / governance-driven / deterministic /
  migration-only / auditable / traceable / composable / pluggable / federated principle set is EXISTING and
  enforced**, expressed both as principles (P1–P10, IP-01–17, PEP-001–020) and as redesign-prohibited invariants
  (INV-1–13).
- **Future/architectural/scale/domain/platform/entity agnosticism is EXISTING for the enrolled scope (INV-13)**
  and **PROPOSED for the existential scope (INV-14..20, deferred `AD-0014`)**.
- **Temporal Agnosticism is MISSING** (no first-class temporal model).
- **Auditability is principle-EXISTING but primitive-INCOMPLETE** (six duplicated audit implementations; a
  universal Audit/Provenance primitive is specified in `AUDIT-UNIV-001` but not built).
- One **documentation-consistency defect** is flagged: the **INV-6 label divergence** (§5).

## 9. Traceability

- **Refines:** `UCOS-REQ-0001`; `AUTH-003-PRINCIPLES`; `UCOS-PEA-001`; `UCOS-ASR-NFR-001`.
- **Evidence:** `CTX-PRIN-001`, `AUTH-002/003`, `AUTH-012-FPA-001`, `UA-05/INV-CORE-001`, `ARCH-GAP-001`, `AUDIT-UNIV-001`, `REG-ABS-001`, `UNIV-ENTITY-001`.
- **Owner:** UCOS Authority Board.

**END `UCOS-REQ-0003` — ARCHITECTURAL PRINCIPLES CATALOG · 4 PRINCIPLE LAYERS RECONCILED · 20/23 CHARTER PRINCIPLES EXISTING · REQUIREMENTS ONLY.**
