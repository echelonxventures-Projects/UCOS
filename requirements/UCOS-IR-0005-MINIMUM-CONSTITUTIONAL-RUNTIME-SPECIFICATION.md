# UCOS-IR-0005 — Minimum Constitutional Runtime Specification

**Artifact ID:** `UCOS-IR-0005`
**Program:** UCOS Phase 1 — Implementation Readiness Assessment
**Phase:** IR-5 — Minimum Constitutional Runtime
**Mode:** ASSESSMENT ONLY — no code, schema, architecture, or governance produced. Determines the smallest runtime capable of satisfying the constitution (INV-1..13 + non-waivable controls), enumerating the required engines, registries, datastores, governance components, and runtime services.
**Status:** ASSESSMENT BASELINE (v1.0.0)
**Inputs (read-only):** `UCOS-IR-0002/0003/0004`, `UCOS-REQ-0001..0006`, `UCOS-AUDIT-0001..0004`, `UCOS-AUTH-0001`, corpus (`UCOS-ASR-NFR-001` INV-1..13; `UCOS-PEA-001/002/003`).
**Date:** 2026-07-03

> **Naming note.** This is `UCOS-IR-0005` (Minimum Constitutional Runtime) within the Implementation Readiness
> program. It is distinct from `UCOS-REQ-0005` (Temporal Requirements). Both legitimately carry the "0005"
> ordinal in their own series.

---

## 1. Definition of "Minimum Constitutional Runtime" (MCR)

The **MCR** is the smallest set of running components such that **every binding invariant (INV-1..13) and every
non-waivable control (S1/S3/S4/S6) holds**, a governed construct can be **registered, described, identified,
authorized, committed, propagated, and audited**, and the system is **fail-closed** if any invariant cannot be
proven. It is the constitution's *existence threshold* — below it, the system is not constitutional; at it, the
system is a correctness-complete control kernel (behavioral/temporal frontier excluded).

The MCR is drawn **exactly** from the FOUNDATIONAL set plus the two foundational-adjacent CORE fabrics
(`UCOS-IR-0003 §2–§3`), realized as the implemented PI-2..PI-6 substrate/control kernel plus the Event, State,
Audit, and Governance components.

---

## 2. Required Engines

| Engine | Realizes | Binding basis | State |
|--------|----------|---------------|:-----:|
| **Execution Engine** (Meta-Core) | Deterministic execution; reflexive kernel; capability composition | RC-038/045; INV-CORE-09; 17 PEX models | EXISTS |
| **Policy Evaluator** | Deny-by-default authorization; constraint logic | RC-014/060; INV-3 | EXISTS *(bounded vocab, GAP-M3)* |
| **Evolution / Migration Engine** | Sole durable-mutation commit path; append-only migration | RC-013; INV-10; IP-14 | EXISTS |
| **Trust Evaluation Engine** | Runtime attribute-driven trust; clamping | RC-006 | EXISTS |
| **Federation Verifier** (Ed25519) | Signed cross-instance assertions; fail-closed partition | RC-007/035; INV-1 | EXISTS |
| **Audit Hash-Chain Engine** | Append-only tamper-evident record; offline verifiability | RC-037; S6; INV-10 | EXISTS *(6× duplicated, GAP-C1)* |
| **Lifecycle Engine** | State/version/history transitions | RC-027; INV-10 | EXISTS *(4× engines, GAP-M2)* |

**Seven engines.** All present of record. Two carry uniformity caveats (audit, lifecycle) and one a vocabulary
caveat (policy); none is absent.

---

## 3. Required Registries

| Registry | Content | Binding basis | State |
|----------|---------|---------------|:-----:|
| **Registry (RegistryPort)** | All addressable constructs (id@version) | RC-024/041; PEP-001 | EXISTS |
| **Metadata Registry (MetadataPort)** | Descriptions/types/config of every construct | RC-024; PEP-002 | EXISTS |
| **Configuration Registry (ConfigurationPort)** | Behavior-as-data (zero hardcoding) | IP-04; PEP-003 | EXISTS |
| **Identity Registry** | Principals (open `kind`) | RC-005/023 | EXISTS |
| **Policy Registry** | `policy:*` records | RC-060; IP-05 | EXISTS |
| **AUTH-012 Decision Ledger** | Authorization decisions (append-only) | RC-004/033; INV-10 | EXISTS *(v1.0.13; attestation pending)* |
| **Event Catalog** | 73 PEV / 17 PED / 10 classifications | RC-028 | EXISTS |

**Seven registries.** All present. The decision ledger is reconciled (AD-0001..0023, v1.0.13) but carries the
evidentiary-attestation residual (`UCOS-AUTH-0001`).

---

## 4. Required Datastores

| Datastore | Purpose | Binding basis | State |
|-----------|---------|---------------|:-----:|
| **System-of-Record (SoR)** | Single authoritative store per (domain) | RC-034; INV-5 | EXISTS *(in-memory/single-node adapter)* |
| **Append-only Audit Log** | Hash-chained, offline-verifiable evidence | RC-037; S6 | EXISTS *(per-fabric)* |
| **Registry/Metadata/Config Store** | Persisted governed records | RC-024 | EXISTS *(single-node adapter)* |
| **Federated Audit Log** | Cross-instance signed provenance | RC-007/036 | EXISTS |

**Four datastore roles.** All present. **Durability/distribution caveat:** the MCR today runs on **single-node,
largely in-memory adapters**; the SoR and stores satisfy INV-5/INV-10 *semantically* but are not yet backed by
durable/distributed adapters — the first scale break is ~10⁶ (`CIV-STRESS-001`). Durable adapters are an
`L-REAL` forward step, not an MCR-existence gap.

---

## 5. Required Governance Components

| Component | Function | Binding basis | State |
|-----------|----------|---------------|:-----:|
| **Authority Hierarchy** (terminal Board) | Enumerated approval powers; separation of duties | RC-002/033 | EXISTS *(duplicated; universal primitive OPTIONAL)* |
| **Gate Machinery** (QUAL/SEC/DOC/REL) | Approval-By-Exception; readiness certification | RC-004/017 | EXISTS |
| **Governance Baseline** | Ratified rules of change | RC-004 | EXISTS |
| **Security Controls S1/S3/S4/S6** | Non-waivable authn/authz/secrets/data/audit | RC-014; INV-2/3/4/11 | EXISTS |
| **Provenance/Lineage** | Origin tracing envelopes | RC-036 | EXISTS *(unify w/ audit OPTIONAL)* |

**Five governance components.** All present. Convergence (universal Authority/Audit) is OPTIONAL to existence.

---

## 6. Required Runtime Services

| Service | Function | Binding basis | State |
|---------|----------|---------------|:-----:|
| **Identity/AuthN service** | Authenticate principals | S1; RC-005 | EXISTS |
| **AuthZ service** | Deny-by-default authorization | S1; INV-3 | EXISTS |
| **Contract/Service layer** | Contract-first, versioned, tolerant communication | RC-062; INV-1 | EXISTS *(85 contracts of record)* |
| **Event propagation service** | At-least-once, idempotent, tolerant-reader | RC-028; INV-6 | EXISTS |
| **Federation service** | Local sovereignty; clamped trust; namespace isolation | RC-007/034 | EXISTS |
| **Evolution/commit service** | Route all durable mutation | RC-013; INV-10 | EXISTS |
| **Audit service** | Emit append-only hash-chained records | RC-037; S6 | EXISTS |

**Seven runtime services.** All present.

---

## 7. MCR composition summary

| Component class | Count | All present? | Caveats |
|-----------------|:-----:|:------------:|---------|
| Engines | 7 | ✅ | policy vocab (GAP-M3); audit 6× (GAP-C1); lifecycle 4× (GAP-M2) |
| Registries | 7 | ✅ | AUTH-012 attestation pending (`UCOS-AUTH-0001` residual) |
| Datastores | 4 | ✅ | single-node/in-memory adapters; durable/distributed = forward step |
| Governance components | 5 | ✅ | authority/audit convergence OPTIONAL |
| Runtime services | 7 | ✅ | — |

**The MCR is fully instantiated of record** as the implemented PI-2..PI-9 control kernel (269/269 tests). Stated
minimally, the MCR = **{Registry, Metadata, Configuration, Meta-Core/Execution, Identity, Trust, Policy,
Security, Authority, Governance, Evolution, Event, State/Lifecycle, Audit}** — i.e. the 12 FOUNDATIONAL + 2
foundational-adjacent CORE fabrics of `UCOS-IR-0003`, with Federation included as the minimum unit for INV-1
contract-first even on a single node.

---

## 8. What the MCR excludes (by design)

The following are **not** part of the minimum constitutional runtime; they are governed additive extensions:

- **Behavioral fabrics** — Intelligence, Simulation, Economic, Civilization (DEFERRED; `L-BEH`).
- **Temporal fabric** — first-class time / frames / continuity (DEFERRED; stated-of-record).
- **Primitive convergence** — universal Authority/Audit/Lifecycle, extensible policy vocabulary (OPTIONAL debt).
- **Platform-factory catalog** — explicit platform-class enumeration (OPTIONAL; mechanism present).
- **Durable/distributed adapters** — required for scale beyond ~10⁶, not for constitutional correctness.

Excluding these does not violate any INV-1..13 or non-waivable control; the MCR remains constitutional without
them.

---

## 9. Determination

> **The Minimum Constitutional Runtime is fully realizable — and is realized of record today** as a
> correctness-complete single-node control kernel: **7 engines, 7 registries, 4 datastore roles, 5 governance
> components, 7 runtime services**, all present at the 269/269 baseline. No MCR component is MISSING.

The MCR carries **three classes of caveat**, none of which defeats constitutional existence:

1. **Uniformity debt (OPTIONAL):** audit/authority/lifecycle are duplicated rather than unified (P1).
2. **Evidentiary residual:** the `AUTH-012` decision ledger is documentarily reconciled but awaits independent
   attestation (`REAL-C-05`).
3. **Durability/scale:** single-node in-memory adapters satisfy INV-5/INV-10 semantically but bound runtime
   scale at ~10⁶ until durable/distributed adapters are built (`L-REAL` forward step).

The MCR therefore establishes that **the constitutional system has a concrete, minimal, satisfiable runtime**,
which is the prerequisite for a positive realizability determination in `UCOS-IR-0008`.

> **Scope discipline.** No code, schema, architecture, or governance was produced. `INV-1..13`, `AUTH-012`,
> `AD-0014`, and the Article IX generation lock are unchanged.

## 10. Traceability

- **Refines:** `UCOS-IR-0003` (FOUNDATIONAL/CORE set), `UCOS-IR-0004` (dependency tiers 0–3).
- **Evidence:** `UCOS-ASR-NFR-001` (INV-1..13), `UCOS-PEA-001/002/003` (engines/execution/events), `UCOS-AUDIT-0002` (IMPL states), `UCOS-AUTH-0001` (ledger state), `CIV-STRESS-001` (scale bound), `REAL-M-03` (269/269).
- **Refined by:** `UCOS-IR-0006` (Sequencing), `UCOS-IR-0008` (Runtime Readiness).
- **Owner:** UCOS Authority Board.

**END `UCOS-IR-0005` — MINIMUM CONSTITUTIONAL RUNTIME · 7 ENGINES · 7 REGISTRIES · 4 DATASTORES · 5 GOVERNANCE COMPONENTS · 7 RUNTIME SERVICES · MCR REALIZED (SINGLE-NODE) · 0 MISSING COMPONENTS · ASSESSMENT ONLY.**
