# SIM-FED-001 — UCOS Federated Simulation Specification

| Field | Value |
|-------|-------|
| Artifact | **SIM-FED-001 — Federated Simulation Specification** |
| Workstream | FND-SIM-01 (PHASE 20 · PI-11 Simulation Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | `SIM-GOV-001/002`, `SIM-SEC-001`, `SIM-ARCH-001`; PI-5 federation (`FED-GOV/SEC/PROV/AUD-001`, `assertions.ts`, `FederatedAuditLog`) |
| Realizes | Federated / co-simulation: cross-node twins, scenarios, and projection contributions |
| Prohibited-dir impact | **NONE** — reuses PI-5 federation primitives; foreign artifacts namespace-isolated (FED-PROV convention) |

> Defines how simulation contributions from **foreign nodes** (co-simulation, distributed digital twins,
> cross-node scenario federation) are ingested and used. The governing rule is **local sovereignty**: foreign
> simulation is **advisory / deny-only** for local promotion, trust is clamped, and foreign artifacts never
> override local governed state without local ratification.

---

## 1. Federation principles (inherited from FED-GOV-001, specialized)

- **SFG-1 Local Sovereignty.** A node's governed state is changed only by its **own** Evolution Fabric after
  local certification/ratification. Foreign twins, scenarios, projections, and impact analyses are inputs —
  never commits.
- **SFG-2 Advisory / Deny-Only Foreign Contribution.** A Federated Simulation Authority (SIM-GOV-C11) may
  `contribute-twin`, `contribute-scenario`, or `attest-projection`. Its contributions may **inform** a local
  run or **add denials/risks**, but can **never** grant, actuate, or promote locally.
- **SFG-3 Clamped Federated Trust.** Effective trust of a foreign contribution = `min(asserted, delegated,
  boundary.maxTrustLevel)`. No max-wins; unknown/over-cap ⇒ clamp to boundary or deny.
- **SFG-4 Fail-Closed Partition.** On partition, timeout, or unreachable foreign authority, foreign inputs are
  treated as **absent** ⇒ deny-by-default. Stale foreign snapshots (expired) ⇒ non-projectable.
- **SFG-5 Provenance Isolation.** Foreign artifacts are stored under disjoint, namespaced keys
  (`simulation:foreign:<nodeId>:<kind>:<id>`) with **local-shadows-foreign** resolution; a foreign artifact
  never occupies or overrides a local keyspace slot.

## 2. Cross-node contribution model

| Contribution | Foreign power | Local handling |
|--------------|---------------|----------------|
| Foreign Digital Twin | `contribute-twin` | Stored namespaced; usable as a **read-only** input to a local run; never binds to a local target |
| Foreign Scenario | `contribute-scenario` | Evaluated locally against a **local** snapshot in a **local** sandbox; never auto-authorized |
| Foreign Projection attestation | `attest-projection` | Advisory corroboration/dissent only; adds to rationale; cannot satisfy the local certification (SoD) requirement |
| Foreign denial/risk | (implicit) | **Honored** (deny-overrides-allow); a foreign denial can block local promotion, never force it |

## 3. Co-simulation (distributed runs)

- Distributed/co-simulation follows the **async-ingestion + sync-decision** pattern (SIM-ARCH-001 §2): a local
  `FederationResolver`-style guard fetches and **cryptographically verifies** signed foreign assertions
  (Ed25519, authority/boundary/replay/freshness checks per SIM-SEC-001), then materializes them into the
  foreign namespace **before** the local, synchronous promotion decision.
- Each participating node runs its **own** sandbox against its **own** snapshot; results are exchanged as
  signed, provenance-tagged Projection/Impact assertions. There is **no** shared mutable simulation state and
  **no** cross-node write path.
- Reconciliation of divergent cross-node projections is advisory and audited (SIM-AUD-001 §4); divergence never
  auto-resolves into a local commit.

## 4. Federation guard responsibilities (`simulation/federation-guard.ts`)

1. Verify signature, issuer authority, enumerated power, trust boundary, freshness/nonce, expiry — else deny + audit.
2. Clamp effective trust (SFG-3); reject over-cap contributions.
3. Materialize into `simulation:foreign:<nodeId>:*`; enforce local-shadows-foreign (never overwrite local).
4. Route foreign contributions through the **same** local promotion pipeline (SIM-GOV-002 §3) — no short-circuit.
5. Fail-closed on partition/timeout/unknown-issuer.

## 5. Threats addressed
S9 (federated simulation poisoning/override), S12 (foreign twin impersonation), and partition/replay surfaces —
each reduced to Low / Low–Med (see SIM-THREAT-001 §1). No residual High/High introduced by federation.

## 6. Traceability
- **Refines:** `SIM-GOV-001` (C11), `SIM-SEC-001`, `SIM-ARCH-001`, `FED-GOV/SEC/PROV/AUD-001`, AUTH-008/009.
- **Consumed by:** `SIM-AUD-001`, `SIM-THREAT-001`, `SIM-READINESS-001`, and a future PI-11 implementation act.
- **Owner:** UCOS Authority Board.

**END SIM-FED-001 — DESIGN · READY FOR RATIFICATION · LOCAL SOVEREIGNTY · NO IMPLEMENTATION AUTHORIZED.**
