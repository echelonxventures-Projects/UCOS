# PI7-RAT-SEC-001 — Adversarial (K1–K12) Reproduction

| Field | Value |
|-------|-------|
| Artifact | PI7-RAT-SEC-001 — Adversarial Threat-Model Reproduction |
| Phase | PHASE 16.1 — PI-7 Independent Validation & Ratification |
| Basis | KNOW-THREAT-001 (K1–K12); PI7-SEC-001 §2 |
| Method | Isolated run of `knowledge-adversarial.test.ts` + assertion inspection |
| Status | **REPRODUCED** — 12/12 vectors blocked/detected |

## 1. Independent run

`node --test --test-reporter=tap "test/knowledge-adversarial.test.ts"` → **12 tests / 12 pass / 0 fail**.

## 2. Vector-by-vector reproduction

| # | Threat | Assertion (verified in source) | Result |
|---|--------|--------------------------------|:------:|
| K1 | Knowledge Poisoning (non-member issuer) | `importBundle` of a rogue-signed bundle → `res.ok === false` | BLOCKED |
| K2 | Provenance Forgery (federated claiming local) | `lineage.verifyProvenance(forged).ok === false` | DETECTED |
| K3 | Certification Forgery (wrong signing key) | `commit` with attacker-signed cert rejects (throws) | BLOCKED |
| K4 | Authority Escalation (SoD violation) | `ratifications.verify(badRat).ok === false` (author == ratifier owner) | BLOCKED |
| K5 | Trust Boundary Bypass | `verifyInbound(...).ok === false`; `clampTrust(99) === 2` (ceiling) | BLOCKED |
| K6 | Knowledge Replay (nonce reuse) | first `verify` ok, second `verify` with same `NonceCache` → false | BLOCKED |
| K7 | Knowledge Tampering (unitHash mismatch) | `commit` of payload-tampered record rejects (throws) | BLOCKED |
| K8 | Audit Evasion (tampered chain) | `KnowledgeAuditLog.verify(tampered).ok === false` | DETECTED |
| K9 | Federation Poisoning (foreign override of local active) | import of foreign v2.0.0 over local active → `res.ok === false` | BLOCKED |
| K10 | Lineage Corruption (unresolvable parent) | `commit` with `lineage:["unresolvable-parent"]` rejects (throws) | BLOCKED |
| K11 | Version Conflict Abuse | local v1.0.0 shadows foreign v2.0.0 on resolve (`source.kind==="local"`, `version==="1.0.0"`) | BLOCKED |
| K12 | Knowledge Drift | `snapshots.drift(before, after).drifted === true` | DETECTED |

## 3. Determination

All twelve KNOW-THREAT-001 vectors are independently reproduced as blocked or detected, matching PI7-SEC-001 §2. Structurally: signing + hash-chain + enumerated powers + SoD near-eliminate K2/K3/K4/K7/K8; deny-by-default + clamp + local sovereignty bound K1/K5/K9/K11; nonce/freshness, lineage resolution, and drift detection cover K6/K10/K12. **0 residual High/High.**

**PI7-RAT-SEC-001: REPRODUCED.**
