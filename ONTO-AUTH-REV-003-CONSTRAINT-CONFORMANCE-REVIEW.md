# ONTO-AUTH-REV-003 — PI-8 Constraint Conformance Review

| Field | Value |
|-------|-------|
| Artifact | **ONTO-AUTH-REV-003 — Constraint Conformance Review** |
| Phase | PHASE 17.1 — PI-8 Ontology Fabric Authorization Review |
| Inputs | ONTO-ARCH-001 §5, ONTO-SEC-001 §3, ONTO-FED-001 §6, ONTO-GOV-002 §3; ratified `src/control/*` codebase |
| Method | Spec claim inspection + **independent verification of each reuse seam against ratified code** |
| Status | **CONFORMANT** — all five binding constraints satisfied; each verified feasible against ratified code |

---

## 1. No custom cryptography

**Claim (ONTO-SEC-001 §3):** signing/verification reuse PI-5 `assertions.ts` (Ed25519); keys by reference (S3); no home-grown crypto.

**Code evidence:** `src/control/federation/assertions.ts` exports `canonicalize`, `sha256`, `generateKeyPair` (Ed25519), `signPayload`, `verifyPayload`, plus `KeyRegistry`/`NonceCache`/`isFresh`. These are the exact primitives PI-7 knowledge already reuses without introducing new crypto. An ontology assertion layer can be built entirely on them.

**Verdict: CONFORMANT** — no custom cryptography required or specified.

## 2. No prohibited core modifications

**Claim (ONTO-ARCH-001 §5):** zero change to `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts`; all constructs are `ontology:*` metadata records interpreted by control-layer engines.

**Code evidence:** every ontology construct maps to `MetadataPort.put/query` under the reserved `ontology:*` keyspace — the identical mechanism by which PI-7 stores `knowledge:*` records with zero core-dir change. Additionally, the Evolution governor's `DEFAULT_PROHIBITED_CODE_PATHS` already blocks evolution units from targeting the five core dirs (and the evolution self-dir, E10), so even the mutation path is structurally prevented from touching prohibited directories.

**Verdict: CONFORMANT** — no prohibited-core-dir modification is required or reachable.

## 3. Additive-only construction

**Claim (READINESS §3):** additive over AD-0016..0020; the ratified 185/185 test baseline remains green; all new code confined to the future `src/control/ontology/*`.

**Assessment:** the disjoint `ontology:*` keyspace guarantees existing PI-4/PI-7 queries never collide with ontology records; the resolution path reads only local + materialized-foreign records via existing sync `MetadataPort` (FED-ARCH parallel). This is the same additive envelope that let PI-7 add 51 tests while keeping the prior 134 green (independently reproduced in PHASE 16.1 / PI7-RAT-001). The only pre-existing edit anticipated is an additive namespaced export in `src/control/index.ts`, mirroring the AD-0020 pattern.

**Verdict: CONFORMANT** — construction is additive; baseline preservation is structurally supported.

## 4. Reuse of Federation Fabric

**Claim (ONTO-FED-001 §6):** no change to `src/control/federation/*` behavior; reuse signature verification, trust boundaries/clamping, provenance-by-convention (FED-PROV), and audit chaining.

**Code evidence:** `FederatedAuditLog implements AuditSink` (hash-chained) and `assertions.ts` primitives exist and are reuse-only; foreign ontology lives in the disjoint `ontology:federation:*` keyspace. The federation guard is new code under `src/control/ontology/*`, not a federation edit — the same separation PI-7 used for its knowledge federation guard.

**Verdict: CONFORMANT** — federation reuse is behavior-preserving.

## 5. Reuse of Evolution Fabric

**Claim (ONTO-GOV-002 §3):** every mutation routes through the ratified PI-6 Evolution Fabric via an `ontology:`-scoped allowlist; no independent write/rollback path; no governor/evolution modification.

**Code evidence:** `createEvolution(substrate, { evolvableAllowlist })` and `defaultGovernorConfig(evolvableAllowlist)` exist; the governor enforces deny-by-default outside the allowlist (`evolvableAllowlist.some(p => ns.startsWith(p))`) and carries `prohibitedCodePaths`/`reservedMetadataPrefixes`. PI-7 already instantiates this with `["knowledge:"]`; `["ontology:"]` is the direct analog. Persistence therefore inherits single-in-flight, depth-0, self-modification prohibition, atomic apply/rollback, and hash-chained audit with no evolution edit.

**Verdict: CONFORMANT** — evolution reuse is behavior-preserving; the sole mutation path is the governed evolution route.

## 6. Non-waivable controls & scope boundaries

- **S1/S3/S4 preserved** (ONTO-SEC-001 §3/§6): authn/authz gates, keys-by-reference, integrity via signing + hash-chained audit.
- **Meaning ≠ authority (OGP-7):** no ontology construct can grant identity/trust/permission/execution.
- **Not Ω∞ (READINESS §3):** governed semantic-schema layer only; AD-0014 deferral preserved — no self-generated meaning, no autonomous reasoning authority.
- **Design-only phase:** PHASE 17 produced specifications only; no source/runtime/infra/services.

## 7. Determination

All five binding constraints — no custom cryptography, no prohibited-core modification, additive-only construction, Federation-Fabric reuse, and Evolution-Fabric reuse — are satisfied by the specifications and independently verified feasible against the ratified codebase, with non-waivable S1/S3/S4 and the AD-0014 Ω∞ boundary preserved.

**ONTO-AUTH-REV-003: CONFORMANT.**
