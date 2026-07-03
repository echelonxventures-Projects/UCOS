# ONTO-AUTH-REV-002 — PI-8 Threat Review (O1–O12)

| Field | Value |
|-------|-------|
| Artifact | **ONTO-AUTH-REV-002 — Ontology Threat & Security-Posture Review** |
| Phase | PHASE 17.1 — PI-8 Ontology Fabric Authorization Review |
| Inputs | ONTO-THREAT-001, ONTO-SEC-001, ONTO-FED-001, ONTO-GOV-001/002, ONTO-AUD-001 |
| Method | Independent adjudication of each O1–O12 vector against its cited mitigating design |
| Status | **ACCEPTED — 0 residual High/High; every High-impact threat reduced to Low likelihood** |

---

## 1. Threat-by-threat adjudication

| # | Threat | Cited mitigation | Mitigation present & sufficient? | Residual (L/I) |
|---|--------|------------------|:-------------------------------:|:--------------:|
| O1 | Entity/authority spoofing | Signed assertions + enumerated authority + boundary verify (SEC §2/§5) | Yes — Ed25519 verify chain, in-boundary active authority required | Low / High |
| O2 | Ontology trust poisoning | Trust clamp min(asserted, delegation, boundary) + deny-only foreign constraints (SEC §2.3, FED §5) | Yes — over-cap contributes 0, not merely ignored | Low–Med / Med |
| O3 | Assertion replay | Nonce cache + freshness window + mandatory short expiry (SEC §4) | Yes — reuses PI-5 `NonceCache`/`isFresh` | Low / Med |
| O4 | Dangling/broken reference | SI-1 referential integrity (pre-commit + atomic apply) + disjoint federated keyspace | Yes — fail-closed on unresolved referent | Low / Med |
| O5 | Taxonomy cycle injection | SI-3 DAG check at write + apply; signed content-hashed taxonomy units | Yes — topological check both points; unsigned edge never active | Low / High |
| O6 | Relationship/cardinality forgery | SI-2 domain/range + SI-4 disjointness; import reference resolution | Yes — declarative conformance enforced | Low / Med |
| O7 | Semantic drift | IP-14 migration-only + backfill/compat gate; signed reproducible graph checkpoints + reconciliation | Yes — checkpoints reproducible from audited set | Low–Med / Med |
| O8 | Authority escalation | Enumerated powers + SoD (`propose≠certify≠ratify≠revoke`) + quorum ratification | Yes — no implicit power; single-actor finalize blocked | Low / High |
| O9 | Certification bypass | Signature-verified in-boundary CA + local-authoritative store + fail-closed revocation | Yes — foreign-certified record not locally valid | Low / High |
| O10 | Unauthorized/silent mutation | Evolution-Fabric-only path (no store write) + governor + hash-chained audit | Yes — verified feasible: allowlist + prohibited-core-paths in code | Low / High |
| O11 | Semantic contradiction / constraint tampering | SI-6/SI-7 non-contradiction + content-hash+signature; deny-only foreign; constraints can't weaken S1/S3/S4 | Yes — security wins over meaning | Low / High |
| O12 | Cross-node impersonation | Namespaced id `home::local` + provenance signature + local-shadows-foreign + disjoint keyspace | Yes — foreign cannot claim a local id | Low / High |

## 2. Structural observations

- **Content-addressing (`unitHash`)** makes every body tamper-evident and re-signing without a new identity impossible — this is the backbone closing O1/O5/O11 and providing O12 forensics. The construction is the same PI-7 discipline already ratified.
- **Meaning ≠ authority (OGP-7)** is the decisive containment property: a fully compromised ontology construct still cannot grant identity, trust, permission, or execution, so a semantic compromise cannot become a control-plane compromise. This is what keeps every High-impact threat's *likelihood* Low.
- **Fail-closed everywhere** (unknown/unreachable authority, expired assertion, unresolved referent, unsatisfied `block` constraint, partition) — consistent with the ratified deny-by-default posture.

## 3. Residual posture

- **0 residual High/High.** High-impact threats O1, O5, O8, O9, O10, O11, O12 are each driven to **Low** likelihood by signature verification, SoD/quorum, evolution-routed mutation, content-addressing, and local sovereignty.
- Medium-impact residuals O2, O3, O4, O6, O7 are inherent to a federated, evolving semantic layer and are acceptably bounded by trust-clamping, nonce/freshness, referential-integrity gating, migration-only evolution, and reconciliation cadence.
- No threat is left unmitigated; no mitigation depends on unratified or infeasible machinery.

## 4. Coverage completeness

O1–O12 span the full incremental semantic surface (spoofing, tampering, replay, DoS-by-cycle/dangling, elevation, repudiation/drift, impersonation). The inherited substrate/control/federation/evolution/knowledge surface is already mitigated under AD-0016..0020 and is not re-opened by additive ontology construction. No missing threat class was identified in this review.

## 5. Determination

The O1–O12 threat model is complete, each vector is closed by a present and sufficient mitigation grounded in ratified primitives, and the residual posture is **0 High/High**. The security posture is **accepted** for authorization.

**ONTO-AUTH-REV-002: ACCEPTED.**
