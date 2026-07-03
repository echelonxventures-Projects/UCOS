# FED-SEC-001 — UCOS Federation Security Specification

| Field | Value |
|-------|-------|
| Artifact | **FED-SEC-001 — Federation Security Specification** |
| Workstream | FND-FED-02 (PHASE 11.3 · PI-5.0) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | PI5-REV-002 (threat model); FED-GOV-001; AUTH-008 (non-waivable S1/S3/S4); UCOS-SEC-ARCH-001 |
| Realizes gap closure | Threats T1, T2, T7, T8, T9 (primary); supports T11, T12 |
| Prohibited-dir impact | **NONE** — verification enters via the existing pluggable `CredentialVerifier` and new control-layer federation seams |

> Defines the cryptographic trust model for cross-domain assertions. Non-waivable **S1** (authn/authz),
> **S3** (secrets by-reference — never in code/records), **S4** (data protection) are preserved and
> enforced at the boundary. No implementation is authorized.

---

## 1. Threat-driven objectives

Replace PI-4's substrate-level **plaintext** `TokenCredentialVerifier` (adequate locally, inadequate across
a trust boundary) with **cryptographically verifiable, replay-resistant, in-boundary** assertions. This is
the security precondition that turns PI-4's "PARTIALLY READY" federation seams into a defensible boundary.

## 2. Assertion model

All cross-domain claims are **signed assertions**, never raw records. Two assertion types:

### 2.1 Identity Assertion (`FED-SEC-IA`) — closes T1
```
IdentityAssertion {
  assertionType: "identity",
  subject: { nodeId, identityId },       // home-domain-namespaced principal
  claims: { kind, permissions[], attributes },
  issuer: authorityId,                    // must be an in-boundary Federation/Certification Authority
  issuedAt, expiresAt,                    // short-lived
  nonce,                                  // single-use
  signature                               // over canonical(assertion \ signature), verifiable to issuer keyRef
}
```
- Verified by a federation `CredentialVerifier` implementation (the PI-4 seam is already pluggable).
- The asserted `permissions`/`trust` are **claims to be evaluated**, never trusted verbatim; the local
  policy engine still applies deny-by-default and local sovereignty (FGP-1).

### 2.2 Trust Assertion (`FED-SEC-TA`) — closes T2
```
TrustAssertion {
  assertionType: "trust",
  subject: { nodeId, identityId },
  level,                                   // clamped to boundary.maxTrustLevel and delegation.maxLevel
  issuer: authorityId, issuedAt, expiresAt, nonce, signature
}
```
- Federated trust is **clamped** (min of asserted level, delegation cap, boundary cap) — replaces PI-4's
  unbounded max-wins with **bounded, weighted acceptance**. An out-of-boundary or over-cap assertion is
  discarded (contributes 0), not merely ignored.

## 3. Cryptographic verification (`FED-SEC-CV`)

- **Canonicalization.** Deterministic serialization (sorted keys, no insignificant whitespace) prior to
  signing/verification.
- **Algorithms.** Asymmetric signatures (e.g., Ed25519 / ECDSA-P256) — algorithm agility via
  `keyRef.alg`; keys referenced by `keyRef` and resolved from a governed key registry (**S3: no key
  material in records or code**).
- **Key lifecycle.** Keys bound to a `Federation Authority` (FED-GOV-C3) at admission; rotation is a
  governed act; revoked keys fail-closed.
- **Verification chain.** signature valid → issuer is an active in-boundary authority with the required
  power → subject node is `active` (not suspended/expelled) → assertion unexpired → nonce unused.

## 4. Replay protection (`FED-SEC-RP`) — closes T7

- **Nonce cache** per (issuer, nonce) with TTL ≥ assertion max lifetime; duplicate ⇒ reject.
- **Freshness window.** `issuedAt` within an allowed clock-skew window; `expiresAt` mandatory and short.
- **Monotonic sequence** (optional) per subject for ordering-sensitive flows.

## 5. Authority verification (`FED-SEC-AV`) — closes T8

- An assertion is accepted **only if** its `issuer` is a registered, active `Federation Authority`
  (FED-GOV-C3) **inside the evaluating node's trust boundary** and holds the specific enumerated power
  (`identity`/`trust`/`certification`) for that assertion type.
- **No implicit authority**: unknown issuer, out-of-boundary issuer, or missing power ⇒ deny.
- Authority powers are a strict subset of the node's admitted scope (FGP-6).

## 6. Trust boundary enforcement (`FED-SEC-TBE`) — closes T2/T6

- Evaluation consults the `Trust Boundary` (FED-GOV-C4): `defaultEffect = deny`; only listed authorities
  are considered; conferred trust clamped to `maxTrustLevel`.
- **Partition behavior (fail-closed):** if an issuer/CA/revocation authority is unreachable, dependent
  assertions are treated as unverifiable ⇒ deny. Cached verifications honor bounded staleness + hard
  expiry.

## 7. Enforcement placement (defense in depth)

Cross-domain security is **additive** to the existing pipeline and never bypasses it:

```
principal/assertion
  → [FED] verify signature + authority + boundary + replay        (new federation verifier)
  → Identity resolve (local or federated, provenance-tagged)      (PI-4 IdentityResolver)
  → Trust resolve (clamped federated + local)                     (PI-4 TrustEvaluator)
  → Policy evaluate (deny-by-default, deny-only foreign policy)   (PI-4 PolicyEvaluator)
  → Governance gates (approval/certification, revocation-aware)   (PI-4 GovernanceRegistry)
  → kernel.execute (ratified contract enforcement)                (PI-2 Meta-Core, UNCHANGED)
  → audit (hash-chained, signed)                                  (FED-AUD-001)
```
The Meta-Core contract validation remains the final gate (A15 defense-in-depth, already proven in
PHASE 11.1).

## 8. Threat mitigation summary

| Threat | Control | Residual |
|--------|---------|:--------:|
| T1 Cross-domain identity spoofing | Signed identity assertions + authority + boundary verification | Low |
| T2 Trust poisoning | Bounded/clamped trust, in-boundary signed trust assertions, delegation caps | Low–Med |
| T7 Replay | Nonce cache + freshness window + expiry | Low |
| T8 Authority escalation | Enumerated powers, no implicit authority, subset-of-scope | Low |
| T9 Certification bypass | Signature-verified CA chain + local-authoritative store + revocation | Low |

## 9. Traceability
- **Refines:** PI5-REV-002, AUTH-008 (S1/S3/S4), UCOS-SEC-ARCH-001, FED-GOV-001.
- **Consumed by:** FED-ARCH-001 (verifier seam), FED-AUD-001 (assertion signing), future PI-5 build.
- **Owner:** UCOS Authority Board (Security).

**END FED-SEC-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
