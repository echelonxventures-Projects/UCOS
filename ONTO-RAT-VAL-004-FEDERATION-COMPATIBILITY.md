# ONTO-RAT-VAL-004 — Federation Compatibility Verification (Independent)

| Field | Value |
|-------|-------|
| Artifact ID | `ONTO-RAT-VAL-004` |
| Phase | PHASE 17.3 · PI-8 Ontology Fabric — Independent Validation |
| Method | Source inspection + reproduced federation tests (part of 213/213) |
| Verdict | **PASS** |

## Claim under test
> Ontology federation reuses PI-5 primitives; advisory/deny-only/clamped/local-sovereign/fail-closed;
> disjoint federated keyspace; no change to federation behavior.

## Independent evidence (reproduced, passing tests)
- **Signed, verified import:** foreign bundles are Ed25519-signed via reused `signPayload` /
  `generateKeyPair` and verified before import.
- **Trust clamping (O2):** *"O7 federated import is trust-clamped to the boundary ceiling"* — a foreign
  `trustLevel: 9` is stored **clamped to 3** (`boundary.maxTrustLevel`).
- **Local sovereignty (O12/O9):** *"O6 local sovereignty: a foreign record cannot override a local
  active record"* — import **denied** with reason `/local sovereignty/`.
- **Deny-by-default:** import without a valid federation token **denied** (`/federation token/`);
  import from a non-member issuer/boundary **denied** (`/not a member|boundary/`).
- **Reuse-only:** `ontology-federation-guard.ts` composes PI-5 federation primitives; **no**
  modification of `src/control/federation/*` (see ONTO-RAT-VAL-005).

## Determination
Federation compatibility and containment **reproduced**. **PASS.**
