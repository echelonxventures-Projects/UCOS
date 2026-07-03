# PI7-RAT-SEC-003 — Federation Security Verification

| Field | Value |
|-------|-------|
| Artifact | PI7-RAT-SEC-003 — Cross-Node Federation Security Verification |
| Phase | PHASE 16.1 — PI-7 Independent Validation & Ratification |
| Basis | KNOW-FED-001; AD-0020 §3 (no silent federation override); §4 (deny-by-default, trust-clamp, fail-closed) |
| Method | Source inspection of `knowledge-federation-guard.ts` + `knowledge-federation.test.ts` |
| Status | **VERIFIED** — deny-by-default, trust-clamp, local sovereignty, partition fail-closed all enforced |

## 1. Inbound-admission controls (`verifyInbound`)

Verified in source; every check fails closed and returns before admission:

| Control | Mechanism |
|---------|-----------|
| Partition fail-closed | if `PartitionMonitor` present and source node unreachable → reject (`fail-closed`) — evaluated **first** |
| Freshness | `isFresh(issuedAt, expiresAt, now)` mandatory |
| Tamper detection | `bundle.record.unitHash !== unitHash(bundle.record.unit)` → reject |
| Deny-by-default membership | `boundaryContains(boundaryId, issuer)` must be true; non-members rejected |
| Key resolution | missing public key for `issuerKeyRef` → reject |
| Signature | unsigned or `verifyPayload` failure → reject |

## 2. Trust-clamping (`clampTrust`)

`Math.min(record.trustLevel, boundaryMaxTrust(boundaryId))` — a foreign record can never confer trust above the boundary ceiling (K5: a claimed trust of 99 clamps to the boundary max of 2).

## 3. Local sovereignty (`mayOverrideLocal`)

A foreign record is inadmissible as authoritative when a **local `active`** record of the same `namespace`/`knowledgeId` exists (`return !localActive`). Local-origin records always pass. This structurally prevents silent federation override (K9), and combined with the resolver a local `active` v1.0.0 shadows a higher foreign v2.0.0 (K11).

## 4. Federation token (`validateToken`)

Cross-boundary knowledge requires a fresh, signed re-ratification token (freshness + key resolution + signature), else fail-closed. No token → rejected.

## 5. Test evidence (`knowledge-federation.test.ts`, 6 tests, all pass)

inbound verify; non-member reject (deny-by-default); trust-clamp; local sovereignty; partition fail-closed; import round-trip. Adversarial reinforcement: K1 (non-member issuer), K5 (boundary bypass + clamp), K9 (foreign override), K11 (version conflict) all blocked (PI7-RAT-SEC-001).

## 6. Determination

Cross-node knowledge exchange enforces deny-by-default admission, trust ceiling clamping, inviolable local sovereignty, signed/fresh tokens, and partition fail-closed — reusing federation cryptography with no override path. Satisfies KNOW-FED-001 and AD-0020 §3/§4.

**PI7-RAT-SEC-003: VERIFIED.**
