# PI5-SEC-001 — Federation Security Report

| Field | Value |
|-------|-------|
| Artifact | **PI5-SEC-001 — Federation Fabric Security Report** |
| Phase | PHASE 12 (AD-0018 execution) |
| Basis | FED-SEC-001, FED-PROV-001, FED-AUD-001; PI5-REV-002 threat model (T1–T12) |
| Status | **SECURE — 16/16 adversarial attacks blocked** |

## 1. Security mechanisms implemented

| Mechanism | Implementation | Module |
|-----------|----------------|--------|
| Signed identity assertions | Ed25519 signature over canonical payload | `assertions.ts`, `federation-resolver.ts` |
| Signed trust assertions | Ed25519 signature; verified before clamping | `federation-resolver.ts` |
| Cryptographic verification | `node:crypto` verify to registered public key (`KeyRegistry`, keys by reference — S3) | `assertions.ts` |
| Replay protection | `NonceCache` single-use (issuer,nonce) + TTL | `assertions.ts` |
| Nonce validation | consumed only after signature passes | `federation-resolver.ts` |
| Freshness validation | mandatory future `expiresAt` + skew-bounded `issuedAt` | `assertions.ts` (`isFresh`) |
| Authority verification | enumerated powers, active, owned-by-node, in-boundary | `federation-authority.ts`, `federation-resolver.ts` |
| Trust-boundary enforcement | `contains`/`accepts`; default deny | `trust-boundary.ts` |
| Local sovereignty | foreign policy deny-only; foreign never grants | `policy-delegation.ts` |
| Local-shadows-foreign | id-namespacing; foreign never enters local keyspace | `federated-identity-provider.ts`, `types.ts` |
| Clamped federated trust | `min(asserted, delegation cap, boundary ceiling)` | `federation-resolver.ts` |
| Fail-closed partition | unreachable authority/revocation ⇒ deny/revoked | `partition-handling.ts`, `revocation-authority.ts` |

Non-waivable **S1** (authn + deny-by-default authz), **S3** (keys by reference; no key material in records), **S4** (data-protection via provenance-tagged, namespace-isolated storage) preserved.

## 2. Adversarial verification (T1–T12 + extras) — all BLOCKED

| Attack (test) | Threat | Result |
|---------------|:------:|:------:|
| Forged assertion signature | T1 | BLOCKED |
| Over-asserted trust (clamped to ceiling) | T2 | BLOCKED |
| Authority with no trust delegation confers 0 | T2 | BLOCKED |
| Replay / nonce reuse | T7 | BLOCKED |
| Stale (expired) assertion | T7 | BLOCKED |
| Authority missing `identity` power | T8 | BLOCKED |
| Out-of-boundary authority | T2/T8 | BLOCKED |
| Unknown issuer | T8 | BLOCKED |
| Suspended node | T8/lifecycle | BLOCKED |
| Revoked membership | T8/lifecycle | BLOCKED |
| Foreign shadow/poison of local keyspace | T4/T11/T12 | BLOCKED |
| Partition (unreachable authority) fail-closed | T6 | BLOCKED |
| Revoked federated identity denied next | T1/T9 | BLOCKED |
| Certification via revoked CA | T9 | BLOCKED |
| Foreign allow policy inadmissible (deny-only) | T3 | BLOCKED |
| Tampered claims (post-signature) | T1 | BLOCKED |
| Verified principal without permission | deny-by-default | BLOCKED |

**16 distinct adversarial vectors + deny-by-default preservation — all blocked.**

## 3. Threat residuals (post-implementation)

| Threat | Residual | Note |
|--------|:--------:|------|
| T1 spoofing | Low | Ed25519 signatures + authority + boundary |
| T2 trust poisoning | Low | clamp to delegation/boundary ceiling |
| T3 policy conflict | Low | deny-only foreign policy |
| T4 metadata poisoning | Low–Med | namespace isolation + verified-before-stored |
| T5 config drift | Low | (federation config layer; not exercised in PHASE 12) |
| T6 partition | Med | fail-closed; bounded staleness |
| T7 replay | Low | nonce + freshness |
| T8 authority escalation | Low | enumerated powers, no implicit authority |
| T9 certification bypass | Low | signed CA + revocation |
| T10 audit divergence | Low–Med | hash chain + reconciliation (see PI5-AUD-001) |
| T11 registry poisoning | Low–Med | namespacing + local shadows foreign |
| T12 capability impersonation | Low | namespaced ids; no local-keyspace leak |

**0 residual High/High.**

## 4. Determination
> All FED-SEC-001 mechanisms are implemented and verified operational; 16/16 adversarial vectors blocked; non-waivable S1/S3/S4 preserved; 0 residual High/High.

**SECURITY: PASS.** **Owner:** UCOS Authority Board (Security).

**END PI5-SEC-001.**
