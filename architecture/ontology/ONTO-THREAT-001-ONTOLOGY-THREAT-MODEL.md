# ONTO-THREAT-001 — UCOS Ontology Fabric Threat Model

| Field | Value |
|-------|-------|
| Artifact | **ONTO-THREAT-001 — Ontology Threat Model** |
| Workstream | FND-ONTO-07 (PHASE 17 · PI-8.0 Ontology Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Method | STRIDE-aligned, adapted to a governed semantic layer; residual scored `Likelihood/Impact` |
| Basis | ONTO-ARCH-001, ONTO-GOV-001/002, ONTO-SEC-001, ONTO-FED-001, ONTO-AUD-001; AUTH-008 (S1/S3/S4); prior threat models FED (T1–T12), KNOW (K1–K12) |
| Prohibited-dir impact | **NONE** — analysis only |

> Enumerates the threats specific to a governed **ontology / semantic-schema** layer and maps each to the
> mitigating design in this PHASE 17 spec set. The Ontology Fabric inherits the substrate/control/
> federation/evolution/knowledge threat surface (already mitigated in AD-0016..0020); this model covers the
> **incremental semantic surface** (O1–O12). Residual scoring is carried into ONTO-READINESS-001 §1.

---

## 1. Assets & trust boundaries

- **Assets.** Entity/relationship/taxonomy/constraint records; the projected ontology graph; ontology
  authorities & their signing keys; the trust boundary; the federated ontology keyspace; the audit chain.
- **Boundaries.** (B1) local proposer → governance/SoD gate; (B2) governance → Evolution-Fabric apply;
  (B3) foreign node → local federation guard; (B4) node ↔ node audit reconciliation.
- **Adversary classes.** Malicious/compromised local authority; malicious federated node; replay/network
  adversary; a well-intentioned change that silently corrupts meaning (drift).

## 2. Threat catalogue (O1–O12)

| # | Threat | STRIDE | Vector | Primary mitigation | Residual (L/I) |
|---|--------|--------|--------|--------------------|:--------------:|
| **O1** | **Entity / authority spoofing** | Spoofing | Forged entity definition or authority act crossing a boundary | Signed ontology assertions + enumerated-authority + boundary verify (ONTO-SEC-001 §2/§5) | **Low / High** |
| **O2** | **Ontology trust poisoning** | Tampering/Elevation | Foreign authority confers inflated trust to over-weight its ontology | Trust clamping to `boundary.maxTrustLevel` + delegation cap; deny-only foreign constraints (ONTO-SEC-001 §2.3, ONTO-FED-001 §5) | **Low–Med / Med** |
| **O3** | **Assertion replay** | Tampering | Replay a stale certification/ratification to resurrect a superseded/revoked record | Nonce cache + freshness window + mandatory short expiry (ONTO-SEC-001 §4) | **Low / Med** |
| **O4** | **Dangling / broken reference** | Tampering/DoS | Entity/relationship/constraint referencing a missing or archived referent | SI-1 referential-integrity gate (pre-commit + atomic apply); disjoint federated keyspace (ONTO-GOV-002 §1, ONTO-FED-001 §3) | **Low / Med** |
| **O5** | **Taxonomy cycle injection** | Tampering/DoS | Cycle introduced into a classification hierarchy (breaks reasoning, infinite walks) | SI-3 DAG cycle check at write **and** atomic apply; content-hashed signed taxonomy units (ONTO-GOV-002 §1/§2, ONTO-SEC-001 §6) | **Low / High** |
| **O6** | **Relationship / cardinality forgery** | Tampering | Relationship with unresolved domain/range or violated cardinality | SI-2 domain/range conformance + cardinality bound; import reference resolution (ONTO-GOV-002 §1, ONTO-FED-001 §4) | **Low / Med** |
| **O7** | **Semantic drift** | Repudiation/Tampering | Meaning diverges silently over time or across nodes | IP-14 migration-only + backfill/compat gate; signed reproducible graph checkpoints + graph-head reconciliation (ONTO-GOV-002 §3, ONTO-AUD-001 §3/§4) | **Low–Med / Med** |
| **O8** | **Authority escalation** | Elevation | An authority exercises a power it was not granted; single actor both proposes and finalizes | Enumerated powers (OGP-4); separation of duties propose≠certify≠ratify≠revoke; quorum ratification (ONTO-GOV-001 OGP-3, OG-C6) | **Low / High** |
| **O9** | **Certification bypass** | Spoofing/Elevation | Uncertified/foreign-certified record treated as valid locally | Signature-verified certification to in-boundary authority; **local certification store authoritative**; fail-closed revocation (ONTO-GOV-001 OG-C7/C8, ONTO-SEC-001 §3) | **Low / High** |
| **O10** | **Unauthorized / silent mutation** | Tampering | Ontology written or rolled back outside governance | **Evolution-Fabric-only** mutation path; no public governed write on the store; governor (single in-flight, depth 0, self-mod prohibition); hash-chained audit (ONTO-GOV-002 §3, ONTO-AUD-001) | **Low / High** |
| **O11** | **Semantic contradiction / constraint tampering** | Tampering | A change makes an active `block` constraint unsatisfiable, or a constraint is weakened/forged | SI-6/SI-7 non-contradiction gate; content-hash + signature on constraints; deny-only foreign constraints; **constraints may never weaken S1/S3/S4** (ONTO-GOV-002 §1/§2, ONTO-SEC-001 §6) | **Low / High** |
| **O12** | **Cross-node ontology impersonation** | Spoofing | Foreign ontology claims a local id or a foreign id it doesn't own | Namespaced id `home::local` + provenance signature + local-shadows-foreign; disjoint `ontology:federation:` keyspace (ONTO-FED-001 §2, FED-PROV convention) | **Low / High** |

## 3. Cross-cutting controls (defense in depth)

- **Deny-by-default** at every boundary (OGP-2/OFP-2); empty boundary accepts nothing.
- **Fail-closed** on unknown/unreachable authority, expired assertion, unresolved referent, unsatisfied
  `block` constraint, or partition.
- **Content-addressing** (`unitHash`) makes any body tamper detectable and re-signing impossible without a
  new identity.
- **Meaning ≠ authority** (OGP-7): no ontology construct can grant identity/trust/permission/execution, so
  a semantic compromise cannot escalate into a control compromise.
- **Independent offline verifiability** of the audit chain + graph checkpoints (ONTO-AUD-001 §5).
- **Additive-only** construction preserves the ratified 185/185 test baseline and the five prohibited core
  dirs (verified in ONTO-ARCH-001 §5, ONTO-FED-001 §6).

## 4. Residual posture

- **0 residual High/High.** Every High-impact threat (O1, O5, O8, O9, O10, O11, O12) is reduced to **Low**
  likelihood by signature verification, SoD, evolution-routed mutation, and content-addressing.
- Remaining **Med-impact** residuals (O2, O3, O4, O6, O7) are inherent to a federated, evolving semantic
  layer and are acceptably bounded by trust-clamping, fail-closed behavior, migration-only evolution, and
  reconciliation cadence.
- Full residual ledger and ratification decision: **ONTO-READINESS-001**.

## 5. Traceability
- **Refines:** ONTO-ARCH-001, ONTO-GOV-001/002, ONTO-SEC-001, ONTO-FED-001, ONTO-AUD-001; AUTH-008;
  FED/KNOW threat models.
- **Consumed by:** ONTO-READINESS-001 (threat ledger), a future PI-8 adversarial test suite (O1–O12).
- **Owner:** UCOS Authority Board (Security).

**END ONTO-THREAT-001 — DESIGN · READY FOR RATIFICATION · 0 RESIDUAL HIGH/HIGH · NO IMPLEMENTATION AUTHORIZED.**
