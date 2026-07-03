# UCOS — AD-0018 · Scoped Article IX Release for PI-5 Federation Fabric

## Authority Board Decision of Record — Narrow Generation-Lock Extension (PI-5 Federation Fabric)

| Field | Value |
|-------|-------|
| Artifact | **AD-0018 — PI-5 Federation Fabric Construction Authorization** |
| Artifact ID | `UCOS-AUTH-BOARD-AD-0018` |
| Decision-log entry | AUTH-012 **AD-0018** |
| Version | 1.0.0 |
| Decision body | **UCOS Authority Board** (terminal authority; AUTH-009; Constitution Art. IX / Art. XII) |
| Mode | **AUTHORIZATION ACT ONLY** — extends the AD-0016/AD-0017 releases to the PI-5 federation fabric; modifies no ratified architecture, ADR, or frozen baseline |
| Inputs (read-only) | `FED-GOV-001`, `FED-SEC-001`, `FED-PROV-001`, `FED-AUD-001`, `FED-ARCH-001`, `FED-RAT-001` (PHASE 11.3); `PI5-REV-001..004` (PHASE 11.2); `AD-0016`, `AD-0017`; `UCOS-ART9-REL-001`; AD-0014 (Ω∞ disposition); `UCOS-SEC-ARCH-001` (S1/S3/S4) |
| Effective | 2026-07-01T00:00:00Z |
| **Determination** | **RELEASE LOCK — PI-5 FEDERATION-FABRIC SCOPE ONLY** |

> Extends AD-0016 (substrate) and AD-0017 (control fabrics), both preserved. For every scope beyond §2 the
> Article IX lock and the AD-0014 Ω∞ disposition remain fully in force.

---

## 1. Basis

PHASE 11.2 determined **PI-5 NOT AUTHORIZED** (governance, security, provenance, audit, and async gaps
open). PHASE 11.3 closed those gaps at the design level, producing six ratified-ready specifications and a
ratification record (`FED-RAT-001`) with **7/7 criteria PASS** and **0 residual High/High** threats across
T1–T12. Independent Board review (PHASE 11.4 Part A) confirms the specifications are complete, mutually
consistent, and compliant with governance (AUTH-009), security (AUTH-008 S1/S3/S4), and architecture
(zero prohibited-core-dir change). The Board therefore authorizes construction of the PI-5 federation
fabric, **restricted** to the control-layer federation scope and **built additively on the AD-0016/AD-0017
substrate and control fabrics without modifying any substrate core**.

## 2. Authorized Scope (and only this)

| # | Increment | Authorized target | Realizes |
|:-:|-----------|-------------------|----------|
| F-A | **PI-5** | **New federation modules** under `src/control/federation/*` — federation node, membership, authority, trust boundary, trust/policy delegation, certification/revocation/audit authority, suspension, expulsion; federation resolver; federated identity/trust providers; federated credential verifier; federated audit sink | `FED-GOV-001`, `FED-SEC-001`, `FED-PROV-001`, `FED-AUD-001` |
| F-B | **PI-5** | **Additive async evolution** of `src/control/types.ts` (add `AsyncIdentityProvider`/`AsyncTrustAuthority` alongside existing sync interfaces; add provenance/assertion types) | `FED-ARCH-001` §3 |
| F-C | **PI-5** | **Additive evolution** of `src/control/identity/identity-resolver.ts`, `src/control/control-plane.ts`, `src/control/audit-log.ts` (async ingestion hook, federated sink; existing sync signatures preserved) | `FED-ARCH-001` §2–§5 |
| F-D | **PI-5** | **Tests** under `test/` for federation behavior and adversarial resistance (T1–T12) | `FED-RAT-001` |

**Binding architectural constraints:**
- Federation is **additive**: the ratified PI-2/PI-3 substrate and PI-4 control decision path are unchanged;
  the existing **65/65 tests must remain green**.
- Provenance is carried **by convention** (id-namespacing `nodeId::localId`, `descriptor.metadata`,
  `IdentityRecord.attributes`, `federation:<nodeId>:<kind>:<id>` metadata keys, a separate `RegistryPort`
  adapter instance) per `FED-PROV-001` — **no first-class provenance fields added to core ports**.
- **Deny-by-default**, **local sovereignty** (foreign constructs may only deny, never grant on local
  capabilities), **clamped/bounded federated trust**, cryptographic assertion verification, replay
  protection, and **fail-closed on partition** are mandatory.
- Non-waivable **S1/S3/S4** preserved; secrets/keys **by reference only** (no key material in code/records).

## 3. Prohibited Scope (remains LOCKED)

- ❌ Modification of `src/meta-core/*`, `src/registry-runtime/*`, `src/metadata-runtime/*`,
  `src/configuration-runtime/*`, `src/contracts/*` (the five substrate core dirs) — **any such change voids
  this act** (see §5)
- ❌ Any domain, bounded-context service, or business logic
- ❌ Any Ω∞ existential system — AD-0014 stands
- ❌ Mutation of frozen artifacts (`UCOS-PEA-001..007`, Governance Baseline 1.0.0, ratified constructs)
- ❌ Enrollment of any existential invariant (INV-14..20 deferred; INV-1..13 unchanged)
- ❌ Production deployment / live infrastructure provisioning
- ❌ First-class provenance fields on `RegistryRecord`/`MetadataRecord` (would require a prohibited
  `src/meta-core/ports.ts` change; use the FED-PROV-001 convention instead, or a **separate** ports-amendment act)

## 4. Binding Controls

`IC-1..IC-8` remain binding. Non-waivable **S1/S3/S4** preserved and enforced across the trust boundary
(cryptographic identity/trust assertions; deny-by-default authorization; secrets by reference; immutable,
hash-chained audit). Concrete acts — federation membership admission, authority registration, key binding,
certification/revocation, expulsion — remain **Approval-Required Operations** (AD-0009) requiring explicit
human/Board approval at execution time.

## 5. Revocation

`UCOS-ART9-REL-001` §6 applies. Any construction outside §2 — including **any** modification to the five
substrate core dirs, any domain/service/business logic, or any Ω∞ scope — voids this act and re-imposes the
full lock.

## 6. Determination

> ## RELEASE LOCK — PI-5 FEDERATION-FABRIC SCOPE ONLY
>
> The Authority Board authorizes construction of the PI-5 Federation Fabric — new `src/control/federation/*`
> modules and additive async evolution of `src/control/types.ts`, `src/control/identity/identity-resolver.ts`,
> `src/control/control-plane.ts`, and `src/control/audit-log.ts` — built additively on the AD-0016/AD-0017
> substrate and control fabrics with **no modification of any substrate core dir**, no domain/service/business
> logic, and no Ω∞ scope. All other generation remains LOCKED.

## Traceability
- **Refines:** `FED-GOV-001`, `FED-SEC-001`, `FED-PROV-001`, `FED-AUD-001`, `FED-ARCH-001`, `FED-RAT-001`,
  `UCOS-AUTH-BOARD-AD-0016`, `UCOS-AUTH-BOARD-AD-0017`, `UCOS-ART9-REL-001`, `UCOS-SEC-ARCH-001`, AD-0014,
  `UCOS-CONST-001` (Art. IX/XII), `AUTH-008/009/012`.
- **Refined by:** the PI-5 federation fabric under `packages/platform-runtime/src/control/federation/`.
- **Owner:** UCOS Authority Board.

**END AD-0018 — RELEASE LOCK · PI-5 FEDERATION-FABRIC SCOPE ONLY · EFFECTIVE 2026-07-01 · CONSTRUCTION AUTHORIZED.**
