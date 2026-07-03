# SIM-SEC-001 — UCOS Simulation Security Specification

| Field | Value |
|-------|-------|
| Artifact | **SIM-SEC-001 — Simulation Security Specification** |
| Workstream | FND-SIM-01 (PHASE 20 · PI-11 Simulation Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | `SIM-GOV-001/002`, `SIM-ARCH-001`; `UCOS-SEC-ARCH-001` (S1/S3/S4); AUTH-008; PI-5 federation crypto (`assertions.ts`, Ed25519) |
| Realizes | Signed simulation assertions; sandbox-isolation enforcement; classification inheritance; replay/freshness protection; authority verification |
| Non-waivable | **S1** (authn/authz), **S3** (secrets by-reference), **S4** (data protection) — preserved & enforced |
| Prohibited-dir impact | **NONE** — reuses federation cryptography; adds no custom crypto and no core-dir change |

> Security posture for the Simulation Fabric. It **reuses** the ratified PI-5 federation cryptographic
> primitives (**no custom cryptography**), enforces deny-by-default authorization through the PI-4 Control
> Plane, and guarantees that a simulation can never escape its sandbox, forge a snapshot/twin, leak classified
> data through projections, or self-promote a result.

---

## 1. Trust & threat surface (simulation-specific)

| Surface | Risk | Control |
|---------|------|---------|
| Snapshot ingestion | Poisoned/forged baseline | **Signed snapshots** (`SnapshotSource` returns `SignedSnapshot`); Ed25519 verify before bind; expiry |
| Twin binding | Twin impersonation / drift | Provenance-namespaced id; verify source signature; `stale` fail-closed; twin never actuates target |
| Scenario/authority acts | Authority escalation | Enumerated powers (SIM-GOV-C1/C4); signed transitions; SoD; no commit power |
| Predictive inference | Non-deterministic leakage | Verifier-gated adapter; advisory-only; recorded seed/provenance (SGP-3) |
| Projection/impact emit | Classification leakage (S4) | Classification inheritance; output ≤ input `classificationMax`; deny cross-class emit |
| Sandbox writes | Sandbox escape (S1) | Keyspace guard: writes must be `simulation:sandbox:<runId>:*`; else reject + audit |
| Promotion | Unauthorized commit | Deny-by-default; Evolution-only commit; policy PASS + cert(SoD) + ratify |
| Federated contribution | Foreign poisoning/override | Advisory/deny-only; clamped trust; local-shadows-foreign (SIM-FED-001) |

## 2. Signed simulation assertions (SIM-SEC-AS)

- Twin bindings, scenario authorizations, projection attestations, and federated contributions are carried as
  **signed assertions** using PI-5 `assertions.ts` (Ed25519 via `node:crypto`).
- Each assertion binds `{ issuer(nodeId+keyRef), subjectRef, kind, payloadHash, nonce, issuedAt, expiresAt }`
  and is verified for: valid signature, **known/authorized issuer** with the **enumerated power**, within a
  **trust boundary**, **fresh** (nonce unseen + within skew), and **unexpired**. Any failure ⇒ deny + audit.
- **Keys by reference only (S3):** records carry `keyRef`, never key material or model weights.

## 3. Sandbox isolation enforcement (S1)

- **SIM-SEC-ISO-1.** Every run is assigned exactly one Sandbox Scope; all writes pass a static keyspace guard
  requiring the `simulation:sandbox:<runId>:*` prefix. A write to any governed namespace is **rejected and
  audited** as an attempted escape.
- **SIM-SEC-ISO-2.** Reads are governed queries only (Knowledge/Memory/Ontology/Intelligence/Metadata) with S4
  classification honored; the sandbox holds only copies, never authoritative records.
- **SIM-SEC-ISO-3.** Teardown is fail-closed on run terminal state/retention expiry; surviving artifacts are
  restricted to append-only `simulation:projection:*` / `simulation:impact:*`, which remain advisory.

## 4. Data protection & classification (S4)

- Projection/impact outputs **inherit** the maximum classification of their inputs; a twin/scenario may not
  raise effective exposure above its declared `classificationMax`.
- Cross-classification emit (e.g., high-classification input → lower-classification projection) is **denied**;
  redaction/derivation to a lower class is itself a governed, audited transformation, not implicit.
- Foreign (federated) inputs are re-classified under local policy before any local use.

## 5. Authorization (S1) & determinism guard

- All actuation-adjacent operations route through the PI-4 **Control Plane (PEP)**: authenticate → resolve
  trust → **deny-by-default** policy → (promotion) Evolution gate. Simulation itself holds **no** commit power.
- Determinism guard (SGP-3/IGP-2 alignment): a promotion-eligible projection must be deterministically
  re-derivable; non-deterministic contributions require deterministic verifier attestation and remain advisory.

## 6. Non-waivable control conformance

| Control | Requirement | Conformance |
|---------|-------------|:-----------:|
| **S1** | Authn + deny-by-default authz on every governed effect | **PASS** (Control Plane; sandbox guard) |
| **S3** | Secrets/keys/model-weights by reference; none embedded | **PASS** (keyRef/ref only) |
| **S4** | Sensitive-data protection & classification inheritance | **PASS** (§4) |

## 7. Traceability
- **Refines:** `SIM-GOV-001/002`, `SIM-ARCH-001`, `UCOS-SEC-ARCH-001`, AUTH-008 (S1/S3/S4), FED-SEC-001.
- **Consumed by:** `SIM-FED-001`, `SIM-AUD-001`, `SIM-THREAT-001`, `SIM-READINESS-001`, and a future PI-11
  implementation act.
- **Owner:** UCOS Authority Board.

**END SIM-SEC-001 — DESIGN · READY FOR RATIFICATION · S1/S3/S4 PRESERVED · NO IMPLEMENTATION AUTHORIZED.**
