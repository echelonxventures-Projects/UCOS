# ONTO-VAL-001 — PI-8 Ontology Fabric Validation Report

| Field | Value |
|-------|-------|
| Artifact | **ONTO-VAL-001 — Ontology Fabric Validation Report** |
| Phase | PHASE 17.2 — PI-8 Ontology Fabric Construction |
| Authorization | **AD-0021** |
| Scope | Functional + structural validation of `src/control/ontology/*` |
| Determination | **PI-8 VALIDATION PASSED** |

---

## 1. Test execution

```
$ node --test "test/*.test.ts"
ℹ tests 213
ℹ pass  213
ℹ fail  0
```

- **Baseline preserved:** 185/185 pre-existing tests remain green (AD-0021 §2 hard constraint met).
- **New PI-8 tests:** 28 in `test/ontology.test.ts` (+ `test/ontology-harness.ts`).
- **Type safety:** `tsc --noEmit` clean under `strict` + `noUncheckedIndexedAccess` + `verbatimModuleSyntax`.

## 2. Coverage by capability (AD-0021 §2 O-B)

| Area | Representative tests | Result |
|------|----------------------|:------:|
| Lifecycle | create→certify→ratify→active; transition table (legal + illegal jump) | ✅ |
| Query / resolve | active-only resolve; kind filter; non-active excluded by default | ✅ |
| Versioning / supersession | highest active version wins on resolve | ✅ |
| Graph projection | entities+relationships+classification edges; revoked excluded fail-closed | ✅ |
| Semantic integrity SI-1 | dangling relationship range blocked | ✅ |
| Semantic integrity SI-2 | taxonomy classification cycle rejected (O5); `detectCycle` unit test | ✅ |
| Semantic integrity SI-3 | non-reciprocal `inverseOf` blocked | ✅ |
| Semantic integrity SI-4 | duplicate attribute name blocked | ✅ |
| Semantic integrity SI-6 | co-classification under disjoint types blocked | ✅ |
| Semantic integrity SI-7 | constraint targeting S1/S3/S4 blocked | ✅ |
| Well-formed pass | valid graph passes gate (0 block violations) | ✅ |
| Federation | trust-clamp (O7); local sovereignty (O6); token required; non-member denied | ✅ |
| Audit | `ONTO_ACTIVATED` recorded; chain verify + tamper detection (O12) | ✅ |
| Evolution integration | persistence applied+audited via Evolution Fabric (O11) | ✅ |
| Governance / SoD | author==ratifier rejected (O3); no-governance active commit denied | ✅ |
| Replay / tamper | ratification nonce replay rejected (O2); unitHash mismatch rejected (O8) | ✅ |

## 3. Structural invariants confirmed

- **Single mutation path:** `OntologyStore` exposes no public write; the only persistence is
  `OntologyControl.#persistViaEvolution` through the evolution orchestrator (test O11).
- **Deny-by-default / fail-closed:** unknown namespace/boundary/authority, revoked entities, dangling
  referents, and unsatisfied `block` constraints all deny (tests SI-1, O6, O9, non-member).
- **Determinism:** graph projection and query ordering are deterministic (sorted keys); audit chain is
  independently reproducible offline.
- **Exactly-one-active semantics:** resolution returns the single highest active record per
  `(namespace, kind, localId)`; supersession is explicit + audited.

## 4. Advisory resolution (AD-0021 §2)

The ONTO-ARCH-001 §3.2 lifecycle name `proposed` is reconciled to the ratified PI-7 `validated` state,
so the two fabrics share one guarded transition vocabulary (ONTO-AUTH-REV-001 §8 / REV-004 §3). Recorded
in `ontology-lifecycle.ts` and `types.ts` comments. **Resolved (non-blocking).**

## 5. Determination

> ## PI-8 VALIDATION PASSED
> 213/213 tests green (185 baseline preserved), typecheck clean, all authorized capabilities and the
> adversarial O1–O12 surface exercised.

**END ONTO-VAL-001.**
