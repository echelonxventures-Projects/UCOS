# PI7-RAT-VAL-001 — Module Inventory Reproduction

| Field | Value |
|-------|-------|
| Artifact | PI7-RAT-VAL-001 — Knowledge Fabric Module Inventory Reproduction |
| Phase | PHASE 16.1 — PI-7 Independent Validation & Ratification |
| Basis | AD-0020 §2 (K-A); PI7-IMP-001 |
| Method | Independent directory enumeration of `packages/platform-runtime/src/control/knowledge/` |
| Status | **REPRODUCED** — 20 modules present, 1:1 with PI7-IMP-001 |

## 1. Independent enumeration

`packages/platform-runtime/src/control/knowledge/` contains exactly **20** TypeScript modules:

| # | Module | Responsibility (verified by read) |
|:-:|--------|-----------------------------------|
| 1 | `types.ts` | Knowledge type surface (state, unit, record, source, authority, boundary, certification, ratification, token, bundle, query, audit) |
| 2 | `knowledge-namespace.ts` | Reserved `knowledge:*` key helpers + federated id namespacing |
| 3 | `knowledge-unit.ts` | `unitHash`/`validateUnit`/`createUnit` (content hash via federation `sha256`/`canonicalize`) |
| 4 | `knowledge-record.ts` | Versioned record + `KNOWLEDGE_RECORD_SCHEMA` |
| 5 | `knowledge-lifecycle.ts` | Guarded transition table (draft→…→active→superseded/revoked/archived) |
| 6 | `knowledge-state-machine.ts` | Per-unit state + history |
| 7 | `knowledge-registry.ts` | Authorities (enumerated powers) + boundaries (deny-by-default, trust ceiling) |
| 8 | `knowledge-store.ts` | Read-only record access + static `evolutionWrite` (no direct governed write) |
| 9 | `knowledge-query-engine.ts` | Namespace/prefix/predicate, version-range, active-only, revocation + trust filtering (fail-closed) |
| 10 | `knowledge-resolver.ts` | Authoritative resolution with local sovereignty |
| 11 | `knowledge-certification-authority.ts` | Signed, revocable certifications |
| 12 | `knowledge-ratification-authority.ts` | Signed ratifications + SoD + validator quorum |
| 13 | `knowledge-revocation-authority.ts` | Fail-closed revocation |
| 14 | `knowledge-lineage.ts` | Lineage + provenance verification, ancestor walk |
| 15 | `knowledge-federation-guard.ts` | Inbound verify, trust-clamp, local sovereignty, token, partition fail-closed |
| 16 | `knowledge-snapshot.ts` | Namespace snapshot + drift detection |
| 17 | `knowledge-import-export.ts` | Signed bundles; import re-verifies before persistence |
| 18 | `knowledge-audit-log.ts` | Hash-chained KNOW_* audit + verify + reconcile |
| 19 | `knowledge-control.ts` | Assembly + sole governed mutation path (via Evolution Fabric) |
| 20 | `index.ts` | Public surface |

## 2. Determination

Independent enumeration reproduces PI7-IMP-001's 20-module inventory exactly. All modules reside under the AD-0020 §2 (K-A) authorized path `src/control/knowledge/*`. No module resides in a prohibited core directory.

**PI7-RAT-VAL-001: REPRODUCED.**
