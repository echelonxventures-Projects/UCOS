# MEM-SEC-001 — UCOS Memory Security Specification

| Field | Value |
|-------|-------|
| Artifact | **MEM-SEC-001 — Memory Security Specification** |
| Workstream | FND-MEM-03 (PHASE 18 · PI-9.0) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | MEM-THREAT-001; MEM-GOV-001/002; AUTH-008 (non-waivable S1/S3/S4); UCOS-SEC-ARCH-001; FED-SEC-001 (reused crypto) |
| Realizes gap closure | Threats M1, M2, M4, M5, M7, M8 (primary); supports M9, M11 |
| Prohibited-dir impact | **NONE** — verification enters via the existing pluggable `CredentialVerifier` + control-layer memory guards; reuses `src/control/federation/assertions.ts` |

> Defines the security model for memory capture, recall, consolidation, and federated exchange. Non-waivable
> **S1** (authn/authz), **S3** (secrets by-reference — never in code/records), and **S4** (data protection /
> classification) are preserved and enforced at every tier boundary. **No custom cryptography** — memory
> reuses the ratified federation assertion/signature primitives. No implementation is authorized.

---

## 1. Threat-driven objectives

Memory concentrates context and history, making it a high-value target for **poisoning** (writing false
memory), **exfiltration** (recalling classified memory across a boundary or tier), and **fabrication**
(returning invented recall). The security model makes every memory write attributable and every recall
authorized, classification-aware, and auditable.

## 2. Authenticated, classification-bound memory records (`MEM-SEC-MR`) — closes M1

Every durable memory write is a **signed memory assertion**, never a raw value:
```
MemoryAssertion {
  assertionType: "memory",
  tier: "working"|"short-term"|"long-term"|"semantic"|"episodic",
  subject: { nodeId, subjectRef },
  classification,                       // S4 label; monotonic across promotion (MGP-3)
  value | assertionRef,                 // content or knowledge/episode linkage
  provenance,                           // origin + capturedBy + sources[]
  issuer: authorityId,                  // in-boundary Memory/Consolidation Authority
  issuedAt, expiresAt, nonce,
  signature                             // over canonical(assertion \ signature), verifiable to issuer keyRef
}
```
- Asserted content is a **claim to be evaluated**, never trusted verbatim; the local policy engine still
  applies deny-by-default and local sovereignty (MGP-2/MGP-6).
- Certification (C5) verifies well-formedness + classification-correctness + provenance-validity before a
  memory unit may be proposed for ratification.

## 3. Authorization of recall & write (`MEM-SEC-AUTHZ`, S1) — closes M8

- **Deny-by-default** on both directions: recall and capture/consolidate require an explicit policy grant
  evaluated by the PI-4 `PolicyEvaluator` (deny-overrides-allow).
- **Consolidation is an authority act:** promotion WM→STM→LTM and semantic consolidation require the
  Consolidation Authority (C4); no principal may self-promote its own working memory to durable/federated
  tiers. Closes **M8 consolidation escalation**.
- **Separation of duties (non-waivable):** propose (C4) ≠ certify (C5) ≠ ratify (C6).

## 4. Classification & cross-tier / cross-boundary protection (`MEM-SEC-CLASS`, S4) — closes M2

- **Monotonic classification (MGP-3):** a memory inherits the maximum classification of its sources;
  promotion may raise, **never lower**, classification. A promotion that would declassify is **rejected**.
- **Recall projection:** recall returns only fields the requesting principal is cleared for; higher-classified
  memory is withheld (deny), not redacted-in-place-then-leaked.
- **Federation gate:** a memory record is federatable only if its classification policy permits crossing the
  boundary; classification travels with the assertion and is re-checked on ingest (closes the cross-boundary
  leg of **M2**).
- **No secrets in memory (S3):** secret/key material is **by reference only** (`signatureRef`/`keyRef`);
  memory values never inline secrets.

## 5. Cryptographic verification (`MEM-SEC-CV`) — reuse, no new crypto

- Reuses federation canonicalization + asymmetric signatures (Ed25519/ECDSA-P256, algorithm agility via
  `keyRef.alg`) from `src/control/federation/assertions.ts`. **No memory-specific cipher is defined.**
- **Verification chain:** signature valid → issuer is an active in-boundary Memory/Federated-Memory Authority
  with the required power → subject not revoked/suspended → assertion unexpired → nonce unused.

## 6. Replay protection (`MEM-SEC-RP`) — closes M7

- **Nonce cache** per (issuer, nonce) with TTL ≥ assertion max lifetime; duplicate ⇒ reject.
- **Freshness window** on `issuedAt`; mandatory short `expiresAt`. Prevents replay of stale memory
  assertions to resurrect forgotten/superseded memory.

## 7. Anti-fabrication of recall (`MEM-SEC-AF`) — closes M4

- Every recall result is traceable to a stored, verified, non-expired, non-revoked memory record; the recall
  engine **may not synthesize** memory. A recall that cannot resolve to a verified record returns "no
  memory" (deny/absent), never a fabricated value.
- Recall results carry their provenance + `assertionRef` so consumers (and audit) can attribute them.

## 8. Federated-memory boundary enforcement (`MEM-SEC-FBE`, S1) — closes M5/M6

- Inbound federated memory is verified against the **Memory Trust Boundary** (MEM-GOV-C10): `defaultEffect =
  deny`; only listed Federated Memory Authorities (C9) are considered; foreign memory is **deny-only shadow**
  (never overrides a local `active` record).
- **Partition (fail-closed):** unreachable issuer/authority ⇒ dependent federated memory unverifiable ⇒
  deny; cached foreign memory honors bounded staleness + hard expiry.

## 9. Enforcement placement (defense in depth)

Memory security is **additive** to, and never bypasses, the ratified pipeline:
```
recall/capture request
  → [MEM] verify memory assertion (sig/authority/boundary/replay/classification)   (new memory guard)
  → Identity resolve (local or federated, provenance-tagged)                        (PI-4 IdentityResolver)
  → Trust resolve (clamped federated + local)                                       (PI-4 TrustEvaluator)
  → Policy evaluate (deny-by-default; classification projection)                    (PI-4 PolicyEvaluator)
  → Governance gates (consolidation/certification/ratification; revocation-aware)   (PI-4 + Evolution/AD-0019)
  → kernel.execute (ratified contract enforcement)                                  (PI-2 Meta-Core, UNCHANGED)
  → audit (hash-chained, signed; episodic linkage)                                  (MEM-AUD-001 / AD-0018)
```

## 10. Non-waivable control conformance (AUTH-008)

| Control | How preserved |
|---------|---------------|
| **S1** authn/authz | Deny-by-default recall & write; consolidation is an authority act; boundary verification |
| **S3** secrets by-reference | `keyRef`/`signatureRef` only; no key material or secret in any memory record; no custom crypto |
| **S4** data protection | Monotonic classification across tiers; recall projection; federation classification gate |

## 11. Threat mitigation summary

| Threat | Control | Residual |
|--------|---------|:--------:|
| M1 Memory poisoning | Signed memory assertions + certification + provenance-valid-before-store | Low |
| M2 Cross-tier/boundary leakage | Monotonic classification + recall projection + federation gate (S4) | Low |
| M4 Recall fabrication | No-synthesis rule; recall resolves only to verified stored records | Low |
| M5 Federation poisoning | Deny-only shadow + boundary/authority verification + local-shadows-foreign | Low–Med |
| M7 Replay | Nonce cache + freshness + expiry | Low |
| M8 Consolidation escalation | Authority-gated promotion + SoD (C4≠C5≠C6) | Low |

## 12. Traceability
- **Refines:** MEM-GOV-001/002, MEM-THREAT-001, AUTH-008 (S1/S3/S4), UCOS-SEC-ARCH-001, FED-SEC-001.
- **Consumed by:** MEM-FED-001, MEM-AUD-001, MEM-READINESS-001, future PI-9 build.
- **Owner:** UCOS Authority Board (Security).

**END MEM-SEC-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
