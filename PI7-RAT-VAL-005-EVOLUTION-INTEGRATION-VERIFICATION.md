# PI7-RAT-VAL-005 — Evolution Integration Verification

| Field | Value |
|-------|-------|
| Artifact | PI7-RAT-VAL-005 — Evolution-Fabric Integration Verification |
| Phase | PHASE 16.1 — PI-7 Independent Validation & Ratification |
| Basis | AD-0020 §2 (Part H — all governed mutation via Evolution Fabric); KNOW-ARCH-001 |
| Method | Source inspection of `knowledge-store.ts` + `knowledge-control.ts`; `knowledge-evolution.test.ts` |
| Status | **VERIFIED** — Evolution Fabric is the sole mutation path; no store-write bypass |

## 1. Read-only store (no public governed write)

`KnowledgeStore` exposes only read operations — `get`, `versions`, `inNamespace`, `all` — each delegating to `MetadataPort.get`/`query`. It has **no** public `put`/`write`/`delete`. The single static helper `evolutionWrite(record)` returns the `{ key, value }` an evolution unit must persist; it performs no mutation itself. Confirmed by direct read of `knowledge-store.ts`.

## 2. `commit` is the sole governed mutation path

`KnowledgeControl.commit` (read from `knowledge-control.ts`) enforces, in order, before any persistence:

1. `unitHash(record.unit)` integrity match (else `ControlValidationError`) — K7.
2. `lineage.verifyLineage` — every parent resolvable (else `AuthorizationError`) — K10.
3. `lineage.verifyProvenance` — origin/asserting-authority consistency (else `AuthorizationError`) — K2.
4. For target state `ratified`/`active`: valid knowledge **certification** (active CA, signature, freshness, unitHash binding) **and** valid **ratification** (SoD + validator quorum), with cert↔rat↔unit cross-binding.
5. Guarded lifecycle advance via `assertTransition`.

Only then does it call `#persistViaEvolution`.

## 3. Persistence drives the full Evolution lifecycle

`#persistViaEvolution` mints a `put-metadata` evolution unit (`targets: metadata keyPrefix=key`, `ops: put-metadata`) and drives it through the **ratified Evolution Fabric**:

```
submit → approve → issue certification → recordCertification
       → issue ratification → ratify → apply
```

If `apply` does not return `status: "applied"`, it throws `knowledge persistence rolled back (fail-closed)`. Persistence therefore inherits the evolution governor (maxInFlight, depth guard, self-modification prohibition), atomic apply/rollback, and the evolution hash-chained audit. The evolution allowlist is scoped to `["knowledge:"]`; no evolution or governor source was modified (mtime evidence, PI7-RAT-VAL-006).

## 4. Federation import also routes through evolution

`importBundle` verifies the inbound bundle, enforces local sovereignty (`mayOverrideLocal`), clamps trust to the boundary ceiling, then persists via the same `#persistViaEvolution` path — no independent write.

## 5. Test evidence (`knowledge-evolution.test.ts`, 4 tests, all pass)

- mutation occurs via evolution;
- `maxInFlight` sequential behavior honored;
- **no direct write path** exists (store has no governed write);
- evolution audit for each commit is independently verifiable.

## 6. Determination

Every governed knowledge mutation — local commit and federated import alike — is mechanized exclusively by the Evolution Fabric. There is no store-level write and no governor bypass, satisfying AD-0020 §2 Part H.

**PI7-RAT-VAL-005: VERIFIED.**
