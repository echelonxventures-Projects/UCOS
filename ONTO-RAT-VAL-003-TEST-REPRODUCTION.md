# ONTO-RAT-VAL-003 — Test Reproduction (Independent)

| Field | Value |
|-------|-------|
| Artifact ID | `ONTO-RAT-VAL-003` |
| Phase | PHASE 17.3 · PI-8 Ontology Fabric — Independent Validation |
| Method | `node --test "test/*.test.ts"` (Node v26.3.0) executed live |
| Verdict | **REPRODUCED — PASS** |

## Claim under test
> "213 / 213 tests PASS" (ONTO-IMP-001 / ONTO-VAL-001).

## Independent evidence
Full-suite run summary (reproduced, exit code 0):

```
ℹ tests 213
ℹ pass 213
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

- The full package suite (30 `*.test.ts` files) runs green; the ontology suite `test/ontology.test.ts`
  (+ `ontology-harness.ts`) executes as part of it.
- Note: the PI-9 memory type error (F-2, ONTO-RAT-VAL-002) does **not** cause a test failure — no
  loaded test imports the broken memory module — so the 213/213 result stands independently.

## Determination
Test-count and pass-rate claim **reproduced exactly (213/213, 0 fail)**. **PASS.**
