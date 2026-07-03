# ONTO-SEC-001 — PI-8 Ontology Fabric Security Report

| Field | Value |
|-------|-------|
| Artifact | **ONTO-SEC-001 — Ontology Fabric Security Report** |
| Phase | PHASE 17.2 — PI-8 Ontology Fabric Construction |
| Authorization | **AD-0021** |
| Basis | `ONTO-THREAT-001` (O1–O12), `ONTO-SEC-001` spec, `UCOS-SEC-ARCH-001` (S1/S3/S4), AUTH-003 |
| Determination | **PI-8 SECURITY POSTURE ACCEPTED — 0 residual High/High** |

---

## 1. Cryptography — no custom crypto (S3 preserved)

Every signed artifact (certification, ratification, federation bundle, federation token) and every
content hash (`unitHash`, snapshot `stateHash`, audit `entryHash`) is produced with the ratified PI-5
federation primitives in `src/control/federation/assertions.ts` (Node `node:crypto` Ed25519, SHA-256,
canonical JSON). **No new cryptographic code exists in `src/control/ontology/*`.** Keys are held **by
reference** (`keyRef` → `KeyRegistry`); no private key material is stored in records or metadata.

## 2. Semantic-integrity gate (SI-1..SI-7)

The `SemanticConstraintEngine` runs before **every** governed commit and import (fail-closed on any
`block` violation):

| Check | Enforces | Closes |
|-------|----------|--------|
| **SI-1** Referential integrity | no dangling entity/relationship/taxonomy/constraint referent | O4 |
| **SI-2** Taxonomy acyclicity | classification (taxonomy + entity-parent) edges form a DAG | O5 |
| **SI-3** Domain/range conformance | relationship domain/range are active entities; `inverseOf` reciprocal | O4 |
| **SI-4** Attribute conformance | entity attributes declarative (name/type/required), unique, no code | O10 |
| **SI-5** Cardinality well-formedness | cardinality ∈ {1:1,1:N,N:1,N:M} | O4 |
| **SI-6** Disjointness / non-contradiction | no co-classification of declared-disjoint types; no is-a contradiction | O4 |
| **SI-7** Authority-neutrality | no construct confers identity/trust/permission/execution; no S1/S3/S4 weakening | O10 |

## 3. Adversarial threat coverage (O1–O12)

| # | Threat | Control | Test evidence |
|:-:|--------|---------|---------------|
| O1 | Forged/unsigned governance artifact | Ed25519 verify; unsigned/invalid → deny | cert/rat `verify` deny paths |
| O2 | Replay of certification/ratification | `NonceCache` single-use + freshness window | *"O2 replay … rejected"* |
| O3 | Authority escalation / SoD bypass | `propose≠certify≠ratify`, validators pairwise-distinct, quorum | *"O3 separation of duties"* |
| O4 | Dangling / malformed semantics | SI-1/SI-3/SI-5/SI-6 block | *"SI-1 …"*, *"SI-3 …"* |
| O5 | Taxonomy cycle injection | SI-2 DAG check at write time | *"SI-2 … cycle rejected"* |
| O6 | Federation override of local record | local sovereignty (`mayOverrideLocal`) | *"O6 local sovereignty"* |
| O7 | Cross-boundary trust escalation | boundary trust-clamp (`clampTrust`) | *"O7 … trust-clamped"* |
| O8 | Unit tampering | `unitHash` recomputation mismatch → deny | *"O8 tampered unit"* |
| O9 | Use of revoked construct | fail-closed revocation on resolve/query/graph | *"O9 revoked … no longer resolves"* |
| O10 | Meaning confers authority | SI-7 blocks authority-flavored constructs / S1/S3/S4 targeting | *"SI-7 authority-neutrality"* |
| O11 | Bypassing the evolution governor | read-only store; sole path via Evolution Fabric | *"O11 sole mutation path"* |
| O12 | Audit tampering | hash-chained, offline-verifiable, tamper-evident | *"O12 audit chain … tamper detected"* |

**Residual High/High: 0.**

## 4. Non-waivable controls & fail-closed guarantees

- **S1/S3/S4 preserved:** no ontology construct may grant or weaken a security control (SI-7); secrets/
  keys by reference only; no custom crypto.
- **Deny-by-default:** unknown authority/boundary/namespace, out-of-boundary issuer, and absent trust
  ceiling all resolve to deny (boundary `maxTrust` absent ⇒ 0).
- **Fail-closed on partition:** `OntologyRevocationAuthority` and `OntologyFederationGuard` treat an
  unreachable source as revoked/inadmissible.
- **Approval-Required Operations (AD-0009):** authority registration, certification/ratification
  issuance, boundary admission, foreign import, token issuance, and `block`-constraint loosening remain
  human/Board-gated at execution time.

## 5. Determination

> ## PI-8 SECURITY POSTURE ACCEPTED — 0 residual High/High
> No custom cryptography; S1/S3/S4 non-waivable controls preserved; SI-1..SI-7 fail-closed; O1–O12
> mitigated with test evidence; meaning-is-not-authority enforced.

**END ONTO-SEC-001.**
