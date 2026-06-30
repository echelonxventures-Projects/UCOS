# ADR-003 — Event Fabric Technology Selection

**Artifact ID:** UCOS-PLAT-ADR-003
**Short Name:** ADR-003 Event Fabric
**Layer:** ARCHITECTURE (Platform Engineering — Technology Selection)
**Phase:** Phase 10.1 — Platform Technology Selection (Implementation Readiness Condition C-4)
**Status:** ACCEPTED (technology-selection scope)
**Version:** 1.0.0
**Date:** 2026-06-30
**Decision Owner:** Platform Engineering — Messaging & Eventing Owner (`PEO-004`)
**Governing Domain:** `PE-04` Messaging & Eventing (Integration Plane, PEG-B)
**Capability Anchor:** CAP-12 Integration & Eventing

> **Scope notice.** Technology selection authorized by `CTX-ARCHB-001` §5; deferred by `PEP-010` and by
> `UCOS-PEA-003` (event architecture, payload authority deferred to Prompt 07). This ADR selects the
> eventing substrate that **realizes** the ratified Platform Event Architecture; it does **not** define
> event contracts, schemas, or payloads (owned by Prompt 07), and it does **not** mutate any frozen
> artifact.

---

## 1. Context

The Platform Event Architecture (`UCOS-PEA-003`, v1.0.0, RATIFIED in Phase 9.2) defines **73 Platform
Events** (`PEV-001..073`, 1:1 from `PRS-001..073`), **17 Platform Event Domains** (`PED-001..017`), the
Platform Event Governance Model (`PEGM-001`), the Platform Event Lifecycle Standard (`PEL-001`, 10
stages), and 10 canonical event classifications — all technology-neutrally. `PE-04` (Messaging &
Eventing) governs the realization. An eventing substrate must be selected that:

- Provides **asynchronous, contract-based, decoupled** integration (`PEB-004`; `CTX-ARCHB-001` §1/§3.3);
- Supports **idempotent** delivery and ordering guarantees per event class (`PEX` EX4; `PEG-004`);
- Is **durable and replayable** to feed analytics (`PE-16`) and rebuild derived read models (ADR-002);
- Honors the **Cross-Domain** event scope validated in `TM-PEA-014` (8 cross-domain-scoped events flow
  only via the governed substrate `PRD-004`);
- Carries governed **schemas/contracts** (defined by Prompt 07) with versioned, backward-compatible
  evolution (`PEP-015`);
- Is **cloud-neutral / portable** (`PEP-010`; §5).

## 2. Decision

**Adopt an Apache Kafka-API event backbone with an open Schema Registry and a CloudEvents envelope,
cloud-neutral.**

1. **Event backbone:** **Apache Kafka** (the Kafka protocol/API as the neutral contract) as the durable,
   partitioned, ordered, replayable log. Any Kafka-API-compatible implementation (self-managed Apache
   Kafka, or API-compatible alternatives) on any cloud or on-premise satisfies the contract — no managed
   vendor is mandated (`PEP-010`).
2. **Delivery semantics:** **at-least-once** delivery with **idempotent consumers** (idempotency keys in
   Redis per ADR-002) as the default; **per-key ordering** via partition keys; exactly-once effects are
   achieved at the consumer via idempotency, not assumed from the broker.
3. **Contract envelope:** all events use the **CloudEvents** specification as the standard envelope;
   payload schemas are governed by a **Schema Registry** (Confluent-Schema-Registry-API-compatible, open
   contract) enforcing backward-compatible evolution (`PEP-015`). Schema/contract *definitions* remain
   owned by **Prompt 07** — this ADR selects the substrate, not the contracts.
4. **Replay & retention:** durable, time/size-bounded retention with replay enabled to feed analytics
   (`PE-16`) and rebuild ADR-002 projections; retention aligns with `PEL-001` (archival/retention
   stages) and data classification.
5. **Cross-domain routing:** the 8 `Cross-Domain`-scoped events (`TM-PEA-014`) traverse only the governed
   eventing substrate; no point-to-point side channels (`PEB-004` prohibited interactions).

## 3. Alternatives Considered

| # | Alternative | Why not selected |
|---|-------------|------------------|
| A | **Cloud-native managed bus (SNS/SQS, Pub/Sub, Event Hubs)** | Low ops overhead, but vendor-specific APIs violate `PEP-010`/§5; weaker cross-cloud portability and replay semantics differ per vendor. |
| B | **RabbitMQ (AMQP broker)** | Excellent routing and low-latency queuing, but log retention/replay (needed for analytics + projection rebuild) is not its core model; less suited to the durable-log requirement. |
| C | **NATS / NATS JetStream** | Lightweight and fast; smaller ecosystem for schema governance and enterprise replay tooling than the Kafka API; retained as a candidate for intra-cluster low-latency signaling only. |
| D | **Direct synchronous integration (no async fabric)** | Violates `CTX-ARCHB-001` §3.3 (prefer async/idempotent) and `PEB-004`; reintroduces tight coupling. |
| E | **Kafka API without a schema registry / CloudEvents** | Rejected — uncontrolled payloads break `PEP-015` backward-compatibility and Prompt 07 contract governance; a governed envelope + registry is mandatory. |

## 4. Consequences

**Positive**
- Durable, ordered, replayable backbone realizes all 73 `PEV-*` and the `PEL-001` lifecycle.
- Idempotent at-least-once delivery satisfies EX4 and `CTX-ARCHB-001` §3.3.
- CloudEvents + Schema Registry enforce contract-first, backward-compatible evolution (`PEP-015`),
  cleanly handing schema authority to Prompt 07.
- Replay enables analytics (`PE-16`) and ADR-002 projection rebuilds without a second SoR.

**Negative / Trade-offs**
- Kafka operational complexity (partitions, consumer groups, rebalancing) — bounded by IaC/delivery
  governance (ADR-007) and managed API-compatible options.
- At-least-once requires consumer idempotency discipline — enforced by `PEX` EX4 and idempotency keys
  (ADR-002 Redis).
- Schema-evolution governance overhead — accepted; it is a feature, not a defect (`PEP-015`).

**Follow-on obligations**
- Event/topic **contracts and schemas** are authored by **Prompt 07** (still deferred; this ADR only
  selects the substrate + envelope + registry technology).
- Transport security (mTLS), authn/authz to the backbone, and topic-level access control are selected in
  **ADR-006**; S1/S3/S4 preserved.
- Registry of topics/contracts integrates with **ADR-004** (Registry).

## 5. Traceability

- **Realizes:** `UCOS-PEA-003` (`PEV-001..073`, `PED-001..017`, `PEGM-001`, `PEL-001`, `TM-PEA-014/015`);
  `UCOS-PEA-001` `PE-04`, `PEG-004`, `PEO-004`, `PEB-004`.
- **Justified by ASR/principle:** `CTX-ARCHB-001` §1/§3.3/§5; `PEP-008/009/010/015/018`; AUTH-004.
- **Authority:** AUTH-004, AUTH-009.
- **Consumed by (downstream):** ADR-002 (projection rebuild/analytics feed), ADR-004 (topic/contract
  registration), ADR-006 (transport security), Prompt 07 (event contracts), Prompt 10 (`WP-PLT-04`).
- **Chain:** `ADR-003 → PE-04 / PEV-* / PED-* → CAP-12 → AUTH-004/009 → UCOS-PEA-003`.

## 6. Governance Impacts

- Satisfies **Phase 10.0 Condition C-4** for the event-fabric concern.
- Governed by `PEG-004`; delivery-semantics/idempotency/eventing governance held by the Messaging &
  Eventing Owner; escalation `PEO-004 → PE-17 → Authority Board`.
- Event **contract** authority is **not** assumed here — it remains with Prompt 07 (`PEB-004` prohibited
  interaction respected).
- Non-waivable **S1/S3/S4** preserved; additive only; no frozen-artifact mutation. Migration-only
  evolution (`PEP-016`).

## 7. Approval Status

| Field | Value |
|-------|-------|
| Status | **ACCEPTED** (technology-selection scope) |
| Approval model | Approval-By-Exception (`PEP-020`); ratified within the technology-selection ADR set by `PE-17` |
| Terminal authority | Authority Board (`PEG-017`) |
| Gating note | Event contracts/schemas remain owned by Prompt 07; realization gated by `UCOS-IMP-READY-001` (C-2, C-4..C-6) |

## 8. Ownership

| Role | Assignment |
|------|------------|
| Decision Owner (Engineering) | Messaging & Eventing Owner (`PEO-004`) |
| Steward | Integration & Eventing Steward (CAP-12) |
| Governing Model | `PEG-004` |
| Boundary | `PEB-004` |
| Authority Chain | Messaging & Eventing Owner → `PE-17` → Authority Board |

## Traceability (artifact)
- **Refines:** `UCOS-PEA-001`, `UCOS-PEA-003`, `CTX-ARCHB-001` §3/§5, AUTH-004/009, PROMPT-08.
- **Refined by:** `UCOS-PLAT-ADR-INDEX`; ADR-004, ADR-006; Prompt 07 (contracts); Prompts 09–12.
