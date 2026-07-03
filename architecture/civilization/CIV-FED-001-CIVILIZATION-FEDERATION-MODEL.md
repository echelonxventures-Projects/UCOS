# CIV-FED-001 — UCOS Civilization Federation Model Specification

| Field | Value |
|-------|-------|
| Artifact | **CIV-FED-001 — Civilization Federation Model** |
| Program | PHASE Ω-01 · Civilization Fabric Conceptual Architecture Program |
| Version | 1.0.0 |
| Status | **DESIGN / PROPOSAL — READY FOR RATIFICATION REVIEW** (specification only; no implementation) |
| Basis | `CIV-GOV-001`, `CIV-SEC-001`, `CIV-ARCH-001`; `SIM-FED-001` (advisory/deny-only; clamped trust; local sovereignty); PI-5 federation (`FED-GOV/SEC/PROV/AUD-001`, `assertions.ts`, `FederatedAuditLog`) |
| Prohibited-dir impact | **NONE** — reuses PI-5 federation primitives; foreign artifacts namespace-isolated (FED-PROV convention) |
| Owner | UCOS Authority Board (Architecture) |

> **Governing disclaimer:** design/proposal only. Preserves AD-0014; enrolls no INV-14..20; releases no Article
> IX lock; authorizes no implementation/construction. **The Civilization Fabric remains conceptual and deferred
> under AD-0014.**

---

## 1. Federation principles (inherited from SIM-FED-001 / FED-GOV-001, specialized)

- **CFG-1 Local Sovereignty.** A node's governed state changes only via its **own** Evolution Fabric after local
  certification/ratification. Foreign civilization models, populations, scenarios, and projections are **inputs —
  never commits.**
- **CFG-2 Advisory / Deny-Only Foreign Contribution.** A Federated Simulation Authority may contribute a foreign
  civilization model, corroborate/dissent on a projection, or add denials/risks. It may **inform** a local
  comparative/co-simulation or **add denials**, but can **never** grant, actuate, or promote locally.
- **CFG-3 Clamped Federated Trust.** Effective trust = `min(asserted, delegated, boundary.maxTrustLevel)`; no
  max-wins; unknown/over-cap ⇒ clamp or deny.
- **CFG-4 Fail-Closed Partition.** On partition/timeout/unreachable authority, foreign inputs are treated as
  **absent** ⇒ deny-by-default; stale (expired) foreign snapshots ⇒ non-simulatable.
- **CFG-5 Provenance Isolation.** Foreign artifacts stored under disjoint keys
  (`civilization:foreign:<nodeId>:<kind>:<id>`) with **local-shadows-foreign** resolution; a foreign artifact
  never occupies or overrides a local keyspace slot.

## 2. Cross-node contribution model (inter-civilization comparative / co-modeling)

| Contribution | Foreign power | Local handling |
|--------------|---------------|----------------|
| Foreign Civilization model | `contribute-civilization` | Stored namespaced; usable as a **read-only** input to a local comparative/co-simulation; never binds as a local governed object |
| Foreign Scenario / intervention | `contribute-scenario` | Evaluated locally against a **local** baseline in a **local** sandbox; never auto-authorized |
| Foreign Projection attestation | `attest-projection` | Advisory corroboration/dissent only; adds to rationale; cannot satisfy local certification (SoD) |
| Foreign denial / risk | (implicit) | **Honored** (deny-overrides-allow); can block local promotion, never force it |

**Inter-civilization conflict modeling (threat C12) is bounded.** Any modeled "conflict" between civilization
objects is a **comparative analytical scenario** inside the sandbox (advisory, non-actuating); it produces no
real-world effect, cannot target real entities, and is subject to the same deny-by-default promotion gate.

## 3. Co-modeling (distributed civilization analysis)

- Follows the **async-ingestion + sync-decision** pattern (SIM-ARCH-001 §2): a local federation guard fetches and
  **cryptographically verifies** signed foreign assertions (Ed25519; authority/boundary/replay/freshness per
  CIV-SEC-001), then materializes them into the foreign namespace **before** the local synchronous decision.
- Each node runs its **own** sandbox against its **own** baseline; results are exchanged as signed,
  provenance-tagged Projection/Impact assertions. **No** shared mutable civilization state and **no** cross-node
  write path.
- Divergence across nodes is advisory and audited (CIV-AUD-001); it never auto-resolves into a local commit.

## 4. Federation guard responsibilities (`civilization/civilization-federation-guard.ts`, proposed)

1. Verify signature, issuer authority, enumerated power, trust boundary, freshness/nonce, expiry — else deny + audit.
2. Clamp effective trust (CFG-3); reject over-cap contributions.
3. Materialize into `civilization:foreign:<nodeId>:*`; enforce local-shadows-foreign (never overwrite local).
4. Route foreign contributions through the **same** local promotion pipeline (SIM-GOV-002 §3) — no short-circuit.
5. Fail-closed on partition/timeout/unknown-issuer.

## 5. Threats addressed
C7 (federation destabilization), C12 (inter-civilization conflict modeling abuse), and partition/replay surfaces
— each reduced to Low / Low–Med (see CIV-THREAT-001). No residual High introduced by federation.

## 6. Traceability
- **Refines:** `CIV-GOV-001` (CGP-8), `CIV-SEC-001`, `CIV-ARCH-001`, `SIM-FED-001`, `FED-GOV/SEC/PROV/AUD-001`,
  AUTH-008/009.
- **Consumed by:** `CIV-AUD-001`, `CIV-THREAT-001`, `CIV-READINESS-001`.
- **Owner:** UCOS Authority Board.

**END CIV-FED-001 — DESIGN/PROPOSAL · LOCAL SOVEREIGNTY · ADVISORY/DENY-ONLY · AD-0014 PRESERVED · NO IMPLEMENTATION AUTHORIZED.**
