# IP-0001 — UCOS Invention Taxonomy

**Program:** IP-0000 — Intellectual Property Governance Framework · Deliverable **IP-0001**
**Artifact ID:** `IP-0001`
**Artifact family:** `IP-*`
**Location:** `architecture/ip/`
**Mode:** DESIGN ONLY — NO IMPLEMENTATION · NO CODE · NO REPOSITORY MUTATION (of ratified artifacts) · NO LEGAL ADVICE
**Status:** CREATED — DESIGN — READY FOR INNOVATION REVIEW BOARD REVIEW
**Parent:** `IP-0000` (UCOS IP Constitution — §9 Invention Classification, §3 Invention Lifecycle)
**Consumed by:** `IP-0002` (Patent Candidate Registry) · `IP-0004` (Patentability Assessment) · `IP-0005` (IP Governance Model)
**Date:** 2026-07-02

> **Governing disclaimer.** Design/specification only. Writes no code, releases no lock, enrolls no invariant,
> mutates no ratified artifact, constitutes no legal advice. The taxonomy is a **triage and classification aid**;
> legally-operative subject-matter-eligibility and patentability determinations are made by qualified IP counsel
> (IP-0000 §8, §13). `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation lock are unchanged.

---

## 1. Purpose & scope

This deliverable defines the **controlled vocabulary** for classifying UCOS inventions and the **detection
signals** that surface invention candidates. It realizes the *IP-First* doctrine (IP-0000 §1.2, §9): every
artifact carries an invention classification drawn from this taxonomy, and every invention signal maps to a type
here.

The taxonomy is **registry-driven** (IP-0000 §9.4): the categories below are the *seed* vocabulary published as
`ip:invention-type:*` metadata records; the code contains **no hard-coded** invention types. New types are added
by governed, Evolution-committed publication (deny-by-default: an unknown type does not silently classify).

Scope covers: the invention-type taxonomy (§3), classification dimensions (§4), invention-signal detection
catalogue (§5), the classification record shape (§6), mapping to patentability/secrecy triage (§7), and governance
(§8). It does **not** assess patentability (that is IP-0004) or store candidates (IP-0002).

---

## 2. Taxonomy principles

| # | Principle | Consequence |
|:-:|-----------|-------------|
| TX-1 | **Registry-driven / no hard coding.** | Types, signals, and dimensions are `ip:*` metadata records, resolved at runtime; empty registry ⇒ nothing auto-classifies (fail-closed). |
| TX-2 | **Exhaustive-by-fallback.** | An `OTHER/UNCLASSIFIED-PENDING` bucket guarantees every invention has a home while forcing Board review. |
| TX-3 | **Multi-label.** | An invention may carry several type tags (e.g. an *algorithm* embodied in an *architecture*). |
| TX-4 | **Signal ≠ decision.** | Detection signals only *propose*; the Innovation Review Board (IP-0000 §13) decides. Assisted detection never auto-files or auto-discloses. |
| TX-5 | **Evidence-linked.** | Every classification links to the artifact(s) and research/prior-art evidence that justify it (Research-First). |
| TX-6 | **Confidentiality-aware.** | Classification carries S4 confidentiality; deny-by-default disclosure (IP-0000 §10, §12). |

---

## 3. Invention-type taxonomy

The seed vocabulary is organized into **families** (`ip:invention-type:<family>.<type>`). Each type carries a
description, typical patentability posture, and typical secrecy consideration (all *guidance*, not
determinations).

### 3.1 Family A — Mechanisms & control

| Type | Description | Typical posture note |
|------|-------------|----------------------|
| `mechanism.governance` | Novel governance/control mechanism (e.g. deny-by-default gating, authority chains). | Often patentable if it produces a concrete technical effect; may also be a moat via execution. |
| `mechanism.verification` | Deterministic verification technique producing reproducible verdicts. | Strong candidate where the *method* is novel and detectable. |
| `mechanism.audit` | Tamper-evident audit / hash-chain composition technique. | Patent vs secret depends on detectability. |
| `mechanism.orchestration` | Novel orchestration/coordination of components or agents. | Method-claim candidate. |
| `mechanism.consensus` | Agreement/quorum/attestation mechanism (e.g. M-of-N over policy). | Detectable in protocols ⇒ patent-favorable. |

### 3.2 Family B — Algorithms & methods

| Type | Description | Typical posture note |
|------|-------------|----------------------|
| `algorithm.core` | A novel algorithm with a concrete technical effect. | Eligibility framing matters (avoid "abstract"); counsel-led. |
| `algorithm.optimization` | Non-obvious optimization yielding measurable improvement. | Secondary indicia (unexpected results) valuable. |
| `algorithm.scheduling` | Novel scheduling/placement/partitioning method. | Often patentable. |
| `algorithm.ml-technique` | Novel training/inference/representation method. | Detectability low ⇒ consider trade secret. |
| `method.process` | A novel multi-step technical process. | Method-claim candidate. |

### 3.3 Family C — Architecture & systems

| Type | Description | Typical posture note |
|------|-------------|----------------------|
| `architecture.pattern` | Novel architectural pattern (e.g. registry-driven, event-sourced fabric composition). | System/method claims; also portfolio moat. |
| `architecture.substrate` | Novel substrate/runtime abstraction. | Often high moat value. |
| `architecture.federation` | Cross-node/federation architecture with novel trust handling. | Detectable in protocol ⇒ patent-favorable. |
| `architecture.integration` | Novel composition of otherwise-known subsystems producing a new effect. | Non-obviousness is the crux. |

### 3.4 Family D — Protocols & data structures

| Type | Description | Typical posture note |
|------|-------------|----------------------|
| `protocol.exchange` | Novel wire/exchange protocol. | Detectable ⇒ patent-favorable; standards implications (IP-0000 §11). |
| `protocol.security` | Novel security/attestation/key-reference protocol. | No custom crypto in UCOS; novelty is in the *protocol composition*. |
| `datastructure.core` | Novel data structure with a technical advantage. | Patent vs secret by detectability. |
| `datastructure.index` | Novel indexing/addressing/chaining scheme. | Often patentable. |

### 3.5 Family E — Models, knowledge & ontology

| Type | Description | Typical posture note |
|------|-------------|----------------------|
| `model.representation` | Novel model/representation (knowledge, ontology, semantics). | Eligibility framing matters. |
| `model.reasoning` | Novel reasoning/inference technique over a model. | Counsel-led eligibility. |
| `ontology.mechanism` | Novel ontology-governance/constraint mechanism. | Method claim candidate. |

### 3.6 Family F — Experience & interaction

| Type | Description | Typical posture note |
|------|-------------|----------------------|
| `ux.interaction` | Novel interaction technique with a technical effect. | Design-patent and/or utility depending on nature. |
| `ux.visualization` | Novel visualization of complex state (e.g. provenance/proof graphs). | Consider design protection. |

### 3.7 Family G — Data, ops & platform

| Type | Description | Typical posture note |
|------|-------------|----------------------|
| `data.governance` | Novel data-governance/classification/retention mechanism. | Method claim; compliance moat. |
| `ops.reliability` | Novel reliability/recovery/replay technique. | Detectability varies. |
| `platform.tooling` | Novel developer/platform tooling technique. | Often trade-secret-favorable. |

### 3.8 Fallback

| Type | Description |
|------|-------------|
| `other.unclassified-pending` | Default for any un-triaged signal; **forces Board review**; treated as confidential + potentially patentable (deny-by-default). |

---

## 4. Classification dimensions

Every invention classification carries these axes (aligned with IP-0000 §9.2):

| Axis | Values (seed) | Notes |
|------|---------------|-------|
| **type[]** | one or more `ip:invention-type:*` (multi-label, TX-3) | Primary vocabulary (§3). |
| **ip-posture** | `UNCLASSIFIED-PENDING` (default) · `PATENT_TRACK` · `SECRET_TRACK` · `DEFENSIVE_PUBLICATION` · `PUBLIC_OSS` · `NO_ACTION` | Set by Board triage. |
| **confidentiality** | `PUBLIC` · `INTERNAL` · `CONFIDENTIAL` · `TRADE_SECRET` | Aligns with S4; monotonic. |
| **maturity** | `CONCEIVED` · `SPECIFIED` · `REDUCED_TO_PRACTICE` · `SHIPPED` | Reduction-to-practice matters for filing. |
| **detectability** | `HIGH` · `MEDIUM` · `LOW` | Drives patent-vs-secret (IP-0000 §6.2). |
| **moat-linkage** | `moatRef` (optional) | Which competitive moat it defends (IP-0005). |
| **novelty-confidence** | `HIGH` · `MEDIUM` · `LOW` · `UNASSESSED` | From IP-0004 assessment; `UNASSESSED` default. |

---

## 5. Invention-signal detection catalogue

Signals are heuristics that surface *candidate* inventions for human confirmation (IP-0000 §3.3; TX-4). Each is a
registry record (`ip:signal:*`) with a description and the type(s) it typically indicates. **No signal auto-files
or auto-discloses.**

| Signal | Fires when… | Suggests type(s) |
|--------|-------------|------------------|
| `SIG-NOVEL-COMBINATION` | A design combines known primitives in a way not seen in referenced prior art. | `architecture.integration`, `mechanism.*` |
| `SIG-FIRST-OF-KIND-MECHANISM` | A governance/verification/audit mechanism has no internal or external precedent on file. | `mechanism.*` |
| `SIG-DETERMINISTIC-VERIFIER` | A new reproducible/offline verification technique is introduced. | `mechanism.verification`, `algorithm.core` |
| `SIG-NONOBVIOUS-OPTIMIZATION` | A change yields a measurable, unexpected improvement. | `algorithm.optimization` |
| `SIG-NEW-PROTOCOL` | A new exchange/security/federation protocol is defined. | `protocol.*`, `architecture.federation` |
| `SIG-NEW-DATASTRUCTURE` | A new chaining/indexing/addressing structure is defined. | `datastructure.*` |
| `SIG-NEW-REPRESENTATION` | A new knowledge/ontology/semantic representation appears. | `model.*`, `ontology.*` |
| `SIG-CROSS-DOMAIN-REUSE` | A technique from one fabric is adapted to a new domain with a new effect. | `architecture.pattern`, `method.process` |
| `SIG-SPEC-CLAIMS-NOVELTY` | A spec/design explicitly asserts "novel", "first", "no precedent". | `other.unclassified-pending` → Board |
| `SIG-DISCLOSURE-IMMINENT` | An artifact tagged for publication/OSS lacks an adjudicated IP posture. | **escalate to disclosure gate** (IP-0000 §10) |

> `SIG-DISCLOSURE-IMMINENT` is special: it is a **risk** signal that must trip the disclosure gate
> (deny-by-default) before any publication (IP-0000 §10, §19 R-1).

---

## 6. Classification record (design specification)

```ts
// SPECIFICATION — not committed code. Proposed registry/record shapes.
// Registry-driven (ip:* keyspace). No hard-coded types. Append-only classification history via IP_INVENTION_* events.

/** Seed vocabulary record (metadata): ip:invention-type:<family>.<type> */
export interface InventionTypeRecord {
  ref: string;                        // ip:invention-type:<family>.<type>
  family: "A"|"B"|"C"|"D"|"E"|"F"|"G"|"FALLBACK";
  title: string;
  description: string;
  typicalPosture?: "patent-favorable"|"secret-favorable"|"context-dependent";
  status: "ACTIVE"|"DEPRECATED"|"RETIRED";
}

/** Detection-signal record (metadata): ip:signal:<id> */
export interface InventionSignalRecord {
  ref: string;                        // ip:signal:<id>
  description: string;
  suggestsTypes: string[];            // ip:invention-type:* refs
  isRiskSignal: boolean;              // true ⇒ trips a governance gate (e.g. disclosure)
  status: "ACTIVE"|"DEPRECATED"|"RETIRED";
}

/** The classification attached to an artifact/invention (folded from IP_INVENTION_* events). */
export interface InventionClassification {
  subjectRef: string;                 // the UCOS artifact / IDR this classifies
  types: string[];                    // ip:invention-type:* (multi-label)
  ipPosture: "UNCLASSIFIED-PENDING"|"PATENT_TRACK"|"SECRET_TRACK"
           | "DEFENSIVE_PUBLICATION"|"PUBLIC_OSS"|"NO_ACTION";
  confidentiality: "PUBLIC"|"INTERNAL"|"CONFIDENTIAL"|"TRADE_SECRET";
  maturity: "CONCEIVED"|"SPECIFIED"|"REDUCED_TO_PRACTICE"|"SHIPPED";
  detectability: "HIGH"|"MEDIUM"|"LOW";
  noveltyConfidence: "HIGH"|"MEDIUM"|"LOW"|"UNASSESSED";
  moatRef?: string;
  evidenceRefs: string[];             // research/prior-art/artifact links (Research-First)
  classifiedBy: string;               // principal (Board member) — SoD from inventor where possible
  rationale: string;                  // mandatory, non-empty
  at: number;                         // recorded logical time (immutable once written)
}
```

**Record rules.**
- **CR-1.** `types` must resolve to `ACTIVE` `ip:invention-type:*` records or fall back to
  `other.unclassified-pending` (deny-by-default; TX-1/TX-2).
- **CR-2.** Default `ipPosture = UNCLASSIFIED-PENDING`, `confidentiality = CONFIDENTIAL` until Board triage
  (protect-by-default, IP-0000 §2.4).
- **CR-3.** Classification changes are **append-only** `IP_INVENTION_CLASSIFIED` events; history is immutable
  (priority/inventorship integrity).
- **CR-4.** `rationale` is mandatory; unexplained classification is denied (TX-4, IP-0000 §13 RB-2).
- **CR-5.** `confidentiality` is **monotonic** with S4; a downgrade is a governed, audited decision.

---

## 7. Mapping to patentability & secrecy triage

The taxonomy feeds triage but does **not** decide it (IP-0000 §6.2, §8, §13):

```
type + detectability + novelty-confidence + moat-linkage
        │
        ▼
   Board triage (IP-0000 §13), informed by:
        ├─ high detectability + high novelty     → lean PATENT_TRACK
        ├─ low detectability + durable advantage → lean SECRET_TRACK
        ├─ novel but low strategic value         → lean DEFENSIVE_PUBLICATION
        └─ not novel                             → NO_ACTION (rationale)
```

- **MT-1.** Detectability `HIGH` + novelty `HIGH` biases toward **patent** (infringement provable).
- **MT-2.** Detectability `LOW` + durable advantage biases toward **trade secret** (IP-0000 §6).
- **MT-3.** Every triage bias is a **suggestion**; the Board's recorded decision governs.
- **MT-4.** `SIG-DISCLOSURE-IMMINENT` on an `UNCLASSIFIED-PENDING` artifact **blocks** disclosure until triage
  (IP-0000 §10 deny-by-default).

---

## 8. Governance

- **GV-1.** The taxonomy vocabulary (`ip:invention-type:*`, `ip:signal:*`) is **registry-driven**; additions,
  deprecations, and retirements are Evolution-committed (AD-0019) and audited (`AUDIT-UNIV-001`).
- **GV-2.** The **Innovation Review Board** (IP-0000 §13) owns the taxonomy and every classification decision;
  separation of duties from the inventor is preserved where possible.
- **GV-3.** Classification actions emit `IP_INVENTION_*` audit events (IP-0000 §17.2); the classification history
  is immutable and independently verifiable.
- **GV-4.** Assisted detection is advisory only (TX-4); it never files, discloses, or classifies without Board
  confirmation.
- **GV-5.** Confidentiality and disclosure controls (IP-0000 §10, §12) apply to every classified artifact
  (deny-by-default).

---

*This document is design/specification only. It writes no code, releases no lock, enrolls no invariant, confers
no legal authority, and constitutes no legal advice. `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation
lock are unchanged.*
