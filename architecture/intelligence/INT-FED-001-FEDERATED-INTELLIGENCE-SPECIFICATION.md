# INT-FED-001 — UCOS Federated Intelligence Specification

| Field | Value |
|-------|-------|
| Artifact | **INT-FED-001 — Federated Intelligence Specification** |
| Workstream | FND-INT-01 (PHASE 19 · PI-10 Intelligence Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, or services |
| Basis | `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`; `AD-0018` Federation Fabric (`FED-GOV/SEC/PROV/AUD/ARCH-001`); `AD-0014` |
| Realizes | Federated Intelligence — cross-node reasoning contributions & decision attestations, **advisory-only** |
| Prohibited-dir impact | **NONE** — reuses the ratified Federation Fabric primitives; no change to federation behavior |

> Federated Intelligence lets a node **consult** foreign reasoning/decisions without surrendering local
> sovereignty. Foreign intelligence is **advisory / deny-only**: it may inform a local proposal or add denials,
> but it can **never** author a local goal, grant local actuation, or commit a local decision without local
> ratification. This preserves FGP-1 (Local Sovereignty) and the AD-0014 Ω∞ boundary.

---

## 1. Principles

- **FIP-1 Local Sovereignty of Cognition.** A foreign contribution may **constrain or inform**, never **grant or
  actuate**, on local governed state. Local Decision Authorities + Evolution Fabric remain terminal.
- **FIP-2 Advisory-by-Default.** Every foreign reasoning contribution/decision enters as `advisory` evidence in
  a **local** Reasoning Session and is subject to the full local commit pipeline (policy → constraints →
  certify → ratify → Evolution). No foreign short-circuit.
- **FIP-3 Deny-Only Foreign Policy.** A foreign policy/constraint contribution may only **add denials** to local
  decisions (reuses PI-5 `Policy Delegation` `effectConstraint: "deny-only"` + deny-overrides-allow).
- **FIP-4 Clamped Federated Trust.** A foreign contribution's influence is clamped to
  `min(assertedTrust, delegation.maxLevel, boundary.maxTrustLevel)`; trust never escalates via federation.
- **FIP-5 Fail-Closed on Partition.** Loss of contact with a Federated Intelligence Authority ⇒ its
  contributions are ignored (deny); cached foreign contributions have bounded staleness + hard expiry.
- **FIP-6 Provenance-in-Data.** Foreign contributions are namespace-isolated
  (`intelligence:federated:<nodeId>:<localId>`) and provenance-tagged (FED-PROV convention) — **local-shadows-
  foreign** (a local record always wins over a same-id foreign one). No first-class core-port fields.

## 2. Federated Intelligence Flows

### 2.1 Advisory reasoning contribution (inbound)
```
Foreign node ─signed contribution─▶ [Federation verify: signature, nonce, freshness, authority powers]
   ─▶ [Trust clamp: min(asserted, delegation, boundary)]
   ─▶ materialize as advisory evidence in local Reasoning Session (namespace-isolated, provenance-tagged)
   ─▶ local pipeline (policy → constraints → SoD certify → ratify → Evolution)   ← local terminal
```
A foreign contribution that fails verification, exceeds its authority's enumerated powers, or arrives during
partition is **dropped** (fail-closed) and audited.

### 2.2 Foreign decision attestation (inbound)
- A foreign `decision-attest` says "node X ratified decision Y." Locally this is **evidence only**; it does not
  bind local state. To take local effect it must be **re-ratified locally** by a local Decision Authority via
  the normal pipeline (I9 closure).

### 2.3 Outbound contribution
- A local node may share a ratified decision/rationale as a **signed** contribution for peers. Sharing carries
  classification constraints (S4): only contributions whose classification ≤ the boundary's export ceiling are
  emitted; secrets/keys are never included (S3).

## 3. Governance Reuse (no new federation constructs)

| Need | Reused federation construct (AD-0018) |
|------|----------------------------------------|
| Who may contribute | `Federation Authority` (enumerated powers) + `Federated Intelligence Authority` (INT-GOV-C11) |
| Trust ceiling | `Trust Boundary` (`maxTrustLevel`) + `Trust Delegation` (clamp) |
| Deny-only foreign policy | `Policy Delegation` (`deny-only`) |
| Signature/replay | `assertions.ts` (Ed25519, nonce, freshness) |
| Cross-node audit | `FederatedAuditLog` + `Audit Authority` reconciliation |
| Suspension/expulsion | `Federation Suspension` / `Expulsion` (halts contributions) |

## 4. Invariants (federated intelligence)

1. No foreign contribution ever reaches `committed` without a **local** ratification (FIP-1/FIP-2).
2. Foreign policy contributions are **deny-only** (FIP-3).
3. Trust is **clamped**, never escalated (FIP-4).
4. Partition ⇒ foreign contributions **denied** (FIP-5).
5. Foreign records are **namespace-isolated**; local-shadows-foreign (FIP-6); no local-keyspace leak.
6. Non-waivable **S1/S3/S4** enforced identically to local cognition; no custom crypto.

## 5. Threat Coverage
Closes/hardens **I9** (federated intelligence override) and supports **I1/I2/I8** (goal/evidence/decision
integrity across nodes). Residual risk bounded by fail-closed + local re-ratification (see `INT-THREAT-001`).

## 6. Traceability
- **Refines:** `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `AD-0018` (`FED-GOV/SEC/PROV/AUD/ARCH-001`),
  `AD-0014`, AUTH-008/009/012.
- **Consumed by:** `INT-AUD-001`, `INT-THREAT-001`, `INT-READINESS-001`, future PI-10 act.
- **Owner:** UCOS Authority Board.

**END INT-FED-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
