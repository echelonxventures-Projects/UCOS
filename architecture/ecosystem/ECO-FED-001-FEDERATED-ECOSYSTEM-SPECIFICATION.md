# ECO-FED-001 — UCOS Federated Ecosystem Specification

| Field | Value |
|-------|-------|
| Artifact | **ECO-FED-001 — Federated Ecosystem Specification** |
| Workstream | FND-ECO-01 (PHASE 27 · PI-16 Ecosystem Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, or services |
| Basis | `ECO-GOV-001`, `ECO-ARCH-001`, `ECO-SEC-001`; `AD-0018` Federation Fabric (`FED-GOV/SEC/PROV/AUD/ARCH-001`); `AD-0014` |
| Realizes | Federated Ecosystem — cross-node ecosystem entities/relationships/assessments, **advisory-only** |
| Prohibited-dir impact | **NONE** — reuses the ratified Federation Fabric primitives; no change to federation behavior |

> Federated Ecosystem lets a node **consult** foreign ecosystem models and assessments without surrendering
> local sovereignty. Foreign ecosystem data is **advisory / deny-only**: it may inform a local assessment or add
> denials, but it can **never** create/update a local `active` ecosystem record, grant local actuation, or
> commit a local change without local ratification. This preserves FGP-1 (Local Sovereignty) and the AD-0014 Ω∞
> boundary, and is the substrate for the **Federations** ecosystem kind (ECO-GOV-001 §4).

---

## 1. Principles

- **EFP-1 Local Sovereignty of Ecosystems.** A foreign contribution may **constrain or inform**, never **grant
  or actuate**, on local governed ecosystem state. Local Ecosystem/Authority Board + Evolution Fabric remain
  terminal.
- **EFP-2 Advisory-by-Default.** Every foreign entity/relationship/assessment enters as `advisory` evidence in
  a **local** assessment and is subject to the full local commit pipeline (ground → policy → certify → ratify →
  Evolution). No foreign short-circuit.
- **EFP-3 Deny-Only Foreign Policy.** A foreign policy/constraint contribution may only **add denials** to local
  ecosystem decisions (reuses PI-5 `Policy Delegation` `effectConstraint: "deny-only"` + deny-overrides-allow).
- **EFP-4 Clamped Federated Trust.** A foreign contribution's influence is clamped to
  `min(assertedTrust, delegation.maxLevel, boundary.maxTrustLevel)`; trust never escalates via federation.
- **EFP-5 Fail-Closed on Partition.** Loss of contact with a Federated Ecosystem Authority ⇒ its contributions
  are ignored (deny); cached foreign contributions have bounded staleness + hard expiry. Prevents cross-node
  contagion during partition (closes ECO8 operational path).
- **EFP-6 Provenance-in-Data.** Foreign contributions are namespace-isolated
  (`ecosystem:federated:<nodeId>:<localId>`) and provenance-tagged (FED-PROV convention) — **local-shadows-
  foreign** (a local record always wins over a same-id foreign one). No first-class core-port fields.

## 2. Federated Ecosystem Flows

### 2.1 Advisory ecosystem contribution (inbound)
```
Foreign node ─signed contribution─▶ [Federation verify: signature, nonce, freshness, authority powers]
   ─▶ [Trust clamp: min(asserted, delegation, boundary)]
   ─▶ [Classification check: contribution.classification ≤ boundary import ceiling (S4)]
   ─▶ materialize as advisory evidence in local assessment (namespace-isolated, provenance-tagged)
   ─▶ local pipeline (ground → policy → SoD certify → ratify → Evolution)   ← local terminal
```
A foreign contribution that fails verification, exceeds its authority's enumerated powers, violates
classification, or arrives during partition is **dropped** (fail-closed) and audited.

### 2.2 Foreign assessment attestation (inbound)
- A foreign `share-assessment` says "node X assessed ecosystem Y as degraded/critical." Locally this is
  **evidence only**; it does not bind local state or trigger local action. To take local effect it must be
  **re-assessed/re-ratified locally** via the normal pipeline (closes ECO9).

### 2.3 Outbound contribution
- A local node may share ratified ecosystem entities/relationships/assessments as a **signed** contribution for
  peers. Sharing carries classification constraints (S4): only contributions whose classification ≤ the
  boundary's export ceiling are emitted; secrets/keys and raw signal payloads are never included (S3).

## 3. Governance Reuse (no new federation constructs)

| Need | Reused federation construct (AD-0018) |
|------|----------------------------------------|
| Who may contribute | `Federation Authority` (enumerated powers) + `Federated Ecosystem Authority` (ECO-GOV-C7) |
| Trust ceiling | `Trust Boundary` (`maxTrustLevel`) + `Trust Delegation` (clamp) |
| Deny-only foreign policy | `Policy Delegation` (`deny-only`) |
| Signature/replay | `assertions.ts` (Ed25519, nonce, freshness) |
| Cross-node audit | `FederatedAuditLog` + `Audit Authority` reconciliation |
| Suspension/expulsion | `Federation Suspension` / `Expulsion` (halts contributions) |

## 4. Invariants (federated ecosystem)

1. No foreign contribution ever reaches `active`/`committed` local state without a **local** ratification
   (EFP-1/EFP-2).
2. Foreign policy/constraint contributions are **deny-only** (EFP-3).
3. Trust is **clamped**, never escalated (EFP-4).
4. Partition ⇒ foreign contributions **denied** (EFP-5).
5. Foreign records are **namespace-isolated**; local-shadows-foreign (EFP-6); no local-keyspace leak.
6. Non-waivable **S1/S3/S4** enforced identically to local modeling; classification honored end-to-end; no
   custom crypto.
7. A foreign resilience/health assessment can **lower confidence or add findings** locally but can **never
   raise** a local resilience score or clear a local finding without local evidence (anti-whitewash).

## 5. Threat Coverage
Closes/hardens **ECO8** (cross-ecosystem contagion / federation poisoning) and **ECO9** (federated ecosystem
override); supports **ECO1/ECO2/ECO4** (membership/relationship/signal integrity across nodes). Residual risk
bounded by fail-closed + local re-ratification (see `ECO-THREAT-001`).

## 6. Traceability
- **Refines:** `ECO-GOV-001`, `ECO-ARCH-001`, `ECO-SEC-001`, `AD-0018` (`FED-GOV/SEC/PROV/AUD/ARCH-001`),
  `AD-0014`, AUTH-008/009/012.
- **Consumed by:** `ECO-AUD-001`, `ECO-THREAT-001`, `ECO-READINESS-001`, future PI-16 act.
- **Owner:** UCOS Authority Board.

**END ECO-FED-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED · LOCAL SOVEREIGNTY PRESERVED.**
