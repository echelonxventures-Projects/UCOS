# PI7-RAT-VAL-004 — AD-0020 Compliance Verification

| Field | Value |
|-------|-------|
| Artifact | PI7-RAT-VAL-004 — AD-0020 Scope-Compliance Verification |
| Phase | PHASE 16.1 — PI-7 Independent Validation & Ratification |
| Basis | AD-0020 §2 (Authorized Scope), §3 (Prohibited Scope), §4 (Binding Controls) |
| Method | Direct source inspection + filesystem mtime evidence |
| Status | **COMPLIANT** — additive only, no prohibited-scope construction detected |

## 1. Authorized-scope conformance (AD-0020 §2)

| Constraint | Evidence | Verdict |
|-----------|----------|:-------:|
| New modules only under `src/control/knowledge/*` | All 20 modules reside under that path (PI7-RAT-VAL-001) | ✓ |
| Tests only under `test/` | 9 knowledge suites + 1 harness under `test/` (PI7-RAT-VAL-002) | ✓ |
| Sole pre-existing change = 1 additive line in `src/control/index.ts` | File contains exactly `export * as knowledge from "./knowledge/index.ts";` — namespaced re-export to avoid barrel collisions; no other knowledge edit to pre-existing files | ✓ |
| Metadata namespaces limited to `knowledge:*` | Store/registry/revocation key helpers all scoped to `knowledge:record:*` / `knowledge:authority:*` / `knowledge:boundary:*` / `knowledge:revoked:*` | ✓ |
| Evolution allowlist scoped to `knowledge:` | `knowledge-control.ts` → `createEvolution(..., { evolvableAllowlist: ["knowledge:"] })` | ✓ |

## 2. Prohibited-scope conformance (AD-0020 §3)

| Prohibition | Evidence | Verdict |
|-------------|----------|:-------:|
| No modification of `meta-core`, `registry-runtime`, `metadata-runtime`, `configuration-runtime`, `contracts` | Newest file mtimes 13:13–13:24; knowledge dir written 17:31 (see PI7-RAT-VAL-006) — core dirs predate and were untouched during knowledge construction | ✓ |
| No change to `control/federation/*` or `control/evolution/*` behavior (reuse only) | federation newest mtime 15:28, evolution newest 16:42 — both predate knowledge (17:31); knowledge imports these modules read-only | ✓ |
| No first-class provenance/knowledge fields on core ports | Provenance carried in-data on `KnowledgeRecord` (FED-PROV convention); `MetadataPort` used only via `get`/`query`/evolution `put-metadata` | ✓ |
| No custom cryptography | All crypto imported from `federation/assertions.ts` (see PI7-RAT-SEC-002); only `import type { KeyObject }` from `node:crypto` | ✓ |
| No authority escalation (SoD non-waivable) | Ratification enforces distinct author/validators/certifier/ratifier + quorum (K4 blocked) | ✓ |
| No silent federation override | Local sovereignty enforced; foreign cannot override local active (K9/K11 blocked) | ✓ |
| No domain/business logic | Modules are generic knowledge governance/query/federation primitives; 0 hardcoded domain rules | ✓ |
| No Ω∞ existential/self-directed scope | Fabric is a governed store/query/federation/evolution layer; no self-direction; AD-0014 preserved | ✓ |

## 3. Binding controls (AD-0020 §4)

Deny-by-default, fail-closed, trust-clamping, SoD, signed transitions with replay/freshness protection, and hash-chained tamper-evident audit are all present and test-verified (PI7-RAT-SEC-001..003, PI7-RAT-AUD-001). All governed knowledge mutation routes through the Evolution Fabric (PI7-RAT-VAL-005). Concrete knowledge acts remain Approval-Required (AD-0009), documented in code comments.

## 4. Determination

No construction outside AD-0020 §2 was detected; no §3 prohibition was triggered; §4 controls are present and enforced. The revocation trigger in AD-0020 §5 is **not** activated.

**PI7-RAT-VAL-004: COMPLIANT.**
