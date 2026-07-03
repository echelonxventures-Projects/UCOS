# ONTO-AUTH-REV-001 — PI-8 Consistency Review

| Field | Value |
|-------|-------|
| Artifact | **ONTO-AUTH-REV-001 — Ontology Consistency Review** |
| Phase | PHASE 17.1 — PI-8 Ontology Fabric Authorization Review |
| Review body | UCOS Authority Board (independent authorization review) |
| Inputs (read-only) | ONTO-ARCH-001, ONTO-GOV-001, ONTO-GOV-002, ONTO-SEC-001, ONTO-FED-001, ONTO-AUD-001, ONTO-THREAT-001, ONTO-READINESS-001 |
| Method | Independent spec inspection + verification of reuse seams against the ratified `src/control/*` codebase |
| Status | **CONSISTENT** — all seven consistency dimensions PASS (1 non-blocking advisory) |

---

## 1. Internal consistency (each spec self-coherent)

| Spec | Constructs | Self-consistency verdict |
|------|-----------|:------------------------:|
| ONTO-ARCH-001 | C1–C8 (Unit, Record, Namespace, Graph, Entity, Relationship, Taxonomy, Constraints) + keyspace + resolution | PASS — every construct has Purpose/Record/Invariants; keyspace table complete and disjoint |
| ONTO-GOV-001 | OG-C1–C11 + coverage matrix | PASS — 11/11 constructs with lifecycle/decision-rights/escalation; matrix maps each to threats |
| ONTO-GOV-002 | SI-1–SI-7 + evolution routing | PASS — integrity rules + evaluation points (certify + atomic apply) coherent |
| ONTO-SEC-001 | CA/RA/TA assertions + CV/RP/AV/CT | PASS — verification chain fully specified; keys by reference |
| ONTO-FED-001 | OFP-1–6 + import pipeline | PASS — deny-by-default, verified-before-stored, local sovereignty coherent |
| ONTO-AUD-001 | events + hash-chain + checkpoints + reconcile | PASS — append-only chain + offline verification coherent |
| ONTO-THREAT-001 | O1–O12 + residual scoring | PASS — each threat has vector + mitigation + residual |
| ONTO-READINESS-001 | 9/9 criteria + ledger | PASS — ledger consistent with THREAT-001 |

## 2. Cross-spec consistency

| Concern | Cross-references | Verdict |
|---------|------------------|:-------:|
| Reserved keyspace `ontology:*` | ARCH §2 == GOV keys == FED §2 (`ontology:federation:*`) == AUD | CONSISTENT |
| Record lifecycle | ARCH §3.2 ↔ GOV-001 OG-C3/C6/C7 ↔ SEC assertions ↔ AUD events (`ONTO_DEFINE/CERTIFY/RATIFY/ACTIVATE/SUPERSEDE/REVOKE`) | CONSISTENT (see §8 advisory) |
| Separation of duties | GOV-001 OGP-3 (`propose≠certify≠ratify≠revoke`) ↔ SEC-001 §2.2 (ratifier≠certifier + quorum) | CONSISTENT |
| Trust clamping | GOV-001 OG-C9 (`maxTrustLevel`) ↔ SEC-001 §2.3 (min of asserted/delegation/boundary) ↔ FED-001 §5 | CONSISTENT |
| Evolution-routed mutation | GOV-001 OGP-5/OG-C11 ↔ GOV-002 §3 ↔ SEC-001 §7 pipeline ↔ AUD-001 §1 | CONSISTENT |
| Local sovereignty | ARCH §4 ↔ FED-001 OFP-1 ↔ THREAT O11/O12 | CONSISTENT |
| Threat IDs O1–O12 | THREAT-001 §2 ↔ SEC-001 §8 ↔ FED-001 §7 ↔ READINESS §1 | CONSISTENT — same 12 ids, same mitigations |

## 3. Governance consistency

OG-C1–C11 subordinate to the ratified Authority Layer (AUTH-009); single-owner namespaces (mirrors PEO); enumerated powers (`define|certify|ratify|revoke|federate`); SoD non-waivable; all concrete acts Approval-Required (AD-0009). The governance coverage matrix (GOV-001 §3) maps all 11 constructs to threats with no gap. **PASS.**

## 4. Security consistency

ONTO-SEC-001 reuses the PI-5 FED-SEC Ed25519 discipline; assertion verification chain (signature → in-boundary active authority → active subject → unexpired → nonce-unused → SoD/quorum) is consistent with GOV-001 authority model and FED-001 admission. Non-waivable S1/S3/S4 preserved; "meaning ≠ authority" (OGP-7) prevents semantic→control escalation. **PASS.**

## 5. Federation consistency

ONTO-FED-001 inherits FGP-1..6 and reuses PI-5 assertions/audit/partition; foreign ontology isolated in `ontology:federation:*`; deny-by-default; local-shadows-foreign; import subject to SI-1..SI-7 against the local graph; federation-touching change requires a re-ratification token. Consistent with ARCH resolution model and GOV-002 evolution routing. **PASS.**

## 6. Audit consistency

ONTO-AUD-001 reuses the FED-AUD-001 `ChainedEntry` and the PI-4 pluggable `AuditSink`; events align 1:1 with the lifecycle and federation acts; graph checkpoints support drift detection (O7); reconciliation is read-only and fail-closed. Consistent with SEC (signatures/keyRef) and GOV-002 (evolution-emitted trail). **PASS.**

## 7. Evolution compatibility

ONTO-GOV-002 §3 routes every mutation through the ratified PI-6 Evolution Fabric via an `ontology:`-scoped allowlist, inheriting the governor (single in-flight, depth 0, self-modification prohibition), atomic apply/rollback, and hash-chained audit — the identical pattern PI-7 already uses. **Verified feasible against code:** `defaultGovernorConfig(evolvableAllowlist)` exists, the governor denies non-allowlisted targets by default, and `DEFAULT_PROHIBITED_CODE_PATHS` already blocks the five core dirs + the evolution self-dir (E10). No evolution/governor modification is required. **PASS.**

## 8. Advisory (non-blocking)

ONTO-ARCH-001 §3.2 names the second lifecycle state **`proposed`** while stating it "reuses the PI-7 guarded transition table." The ratified PI-7 table (`knowledge-lifecycle.ts`) uses **`validated`** in that slot (`draft → validated → certified → ratified → active → …`). This is a terminological divergence, not a structural one. **Recommendation:** at implementation, either adopt PI-7's `validated` state name or explicitly extend the transition table with `proposed`; reconcile GOV-001 OG-C3's "define" verb with the chosen state name. Does not affect authorization.

## 9. Determination

All seven required consistency dimensions — internal, cross-spec, governance, security, federation, audit, and evolution compatibility — **PASS**, with one non-blocking terminological advisory (§8).

**ONTO-AUTH-REV-001: CONSISTENT.**
