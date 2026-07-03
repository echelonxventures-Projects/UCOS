# MEM-SEC-001 (Implementation) — PI-9 Memory Fabric Security Report

| Field | Value |
|-------|-------|
| Artifact | **MEM-SEC-001 — Memory Fabric Security Report (implementation)** |
| Phase | PHASE 18.2 (PI-9 Memory Fabric — Implementation · AD-0023) |
| Version | 1.0.0 |
| Relationship | Implementation-phase evidence for the ratified design spec `architecture/memory/MEM-SEC-001` (this file does not supersede it) |
| Status | **S1/S3/S4 ENFORCED IN CODE · NO CUSTOM CRYPTO** |

> Records how the memory security model (MEM-SEC-001 design) is realized in code, and demonstrates the
> non-waivable controls S1/S3/S4 are enforced by the implementation.

---

## 1. Non-waivable control conformance (AUTH-008)

| Control | Implementation | Evidence |
|---------|----------------|----------|
| **S1 — authn/authz (deny-by-default)** | Recall and write are deny-by-default; the query engine excludes non-active/revoked/expired/above-clearance; concrete authority acts are enumerated | `memory-query-engine.ts` `#admissible`; `memory-resolver.ts recall`; `memory-control.ts` authority acts |
| **S3 — secrets/keys by reference** | Keys are held only as SPKI PEM by `keyRef` in the reused `KeyRegistry`; **no key material or secret inline** in any memory record | `memory-federation-guard.ts` (uses `KeyRegistry.get(keyRef)`); no private material in `types.ts` |
| **S4 — data protection / classification** | Monotonic classification across promotion (never declassify); recall projection withholds above clearance; federation classification ceiling on ingest | `memory-retention.ts` `assertMonotonic`/`reconcileClassification`/`clearedFor`; `memory-query-engine.ts` clearance filter; `memory-federation-guard.ts` ceiling gate |

## 2. Cryptographic verification — reuse, no new crypto (C-3)

- The fabric imports `canonicalize`, `sha256`, `verifyPayload`, `isFresh`, `KeyRegistry`, `NonceCache`
  from `src/control/federation/assertions.ts` (Ed25519 via Node `node:crypto`). **No memory-specific
  cipher, signing, or hashing routine is defined.**
- Verification chain for inbound federated memory (`memory-federation-guard.ts verifyInbound`):
  partition-reachable → freshness (`isFresh`) → unit-hash integrity (`unitHash`) → issuer-in-boundary
  (deny-by-default) → classification ceiling → valid signature (`verifyPayload`).

## 3. Threat-driven control mapping (design M1–M12 → code)

| Threat | Control in code | Residual |
|--------|-----------------|:--------:|
| M1 Memory poisoning | signed bundle verify + unit-hash integrity (tamper → reject) | Low |
| M2 Cross-tier/boundary leakage | monotonic classification + recall projection + ingest ceiling | Low |
| M3 Unbounded retention | fail-closed expiry; finite derived expiry for durable | Low |
| M4 Recall fabrication | no-synthesis resolver: only verified stored records; else deny | Low |
| M5 Federation poisoning/override | deny-by-default boundary + local-shadows-foreign | Low–Med |
| M6 Partition/stale recall | `PartitionMonitor` fail-closed + freshness/expiry | Med |
| M7 Replay | `isFresh` freshness window + mandatory expiry (+ reusable `NonceCache`) | Low |
| M8 Consolidation escalation | consolidation is an authority act; SoD via distinct authorities | Low |
| M9 Forgetting (under/over) | revocation makes value unrecallable; audit chain out-of-scope for deletion | Low |
| M12 WM exhaustion | ephemeral retention + fail-closed expiry bound working memory | Low–Med |

## 4. Defense-in-depth placement

Memory security is **additive** to, and never bypasses, the ratified pipeline: the only durable write path
is the Evolution Fabric governor (atomic + audited + rollback), and recall reads through the query engine's
fail-closed admissibility filter. No side channel to the substrate exists.

## 5. Determination

> Non-waivable **S1/S3/S4** are designed and **enforced in code**; **no custom cryptography** is introduced
> (reuse of federation Ed25519 primitives); the M1–M12 controls are realized with passing adversarial tests
> (see MEM-VAL-001). **Security posture: PASS.**

## 6. Traceability
- **Refines:** `architecture/memory/MEM-SEC-001` (design), MEM-THREAT-001, AUTH-008; AD-0023.
- **Owner:** UCOS Authority Board (Security).

**END MEM-SEC-001 (impl) — S1/S3/S4 ENFORCED · NO CUSTOM CRYPTO · PASS.**
