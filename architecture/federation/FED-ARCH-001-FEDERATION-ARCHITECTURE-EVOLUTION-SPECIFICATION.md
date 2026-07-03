# FED-ARCH-001 — UCOS Federation Architecture Evolution Specification

| Field | Value |
|-------|-------|
| Artifact | **FED-ARCH-001 — Federation Architecture Evolution Specification** |
| Workstream | FND-FED-05 (PHASE 11.3 · PI-5.0) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | PI5-REV-004; PI-4 seams (`IdentityProvider`, `TrustAuthority`, `ControlPlane`, `AuditSink`); FED-SEC/PROV/AUD-001 |
| Realizes gap closure | The synchronous-resolution gap (Part D of PHASE 11.2) |
| **Hard constraint** | **NO change to `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts`** |

> Real federation resolution is network-bound (async). PI-4's `IdentityProvider.resolve()` and
> `TrustAuthority.levelFor()` are **synchronous**, and `ControlPlane.authorize()` is synchronous. This
> spec defines an evolution path that supports async federation **entirely within the control layer**,
> keeps the hot decision path synchronous and unchanged, preserves backward compatibility with the 65
> ratified tests, and modifies **none** of the five prohibited core dirs.

---

## 1. Current seam analysis (evidence)

| Seam | Location | Sync/async | Federation adequacy |
|------|----------|------------|---------------------|
| `IdentityProvider.resolve(id) → IdentityRecord?` | `src/control/types.ts` (control) | **sync** | Shape correct; cannot await remote IdP |
| `TrustAuthority.levelFor(id) → number?` | `src/control/types.ts` (control) | **sync** | Shape correct; cannot await remote authority; unbounded max-wins (FED-SEC-001 clamps it) |
| `ControlPlane.authorize()` | `src/control/control-plane.ts` (control) | **sync** | Cannot await federated resolution |
| `ControlPlane.execute()` | `src/control/control-plane.ts` (control) | **async** | Already `Promise`-returning — an async entry exists |
| `MetadataPort` (put/get/query) | `src/meta-core/ports.ts` (**PROHIBITED**) | sync | Sufficient as-is; **must not change** |
| `kernel.execute()` | `src/meta-core/kernel.ts` (**PROHIBITED**) | async | Sufficient as-is; **must not change** |

**Key observation:** every seam that must evolve lives in the **control layer** (`src/control/*`), which is
PI-4/PI-5 territory — **not** a prohibited dir. The substrate ports and kernel are already sufficient and
stay untouched.

## 2. Chosen evolution pattern — Async Ingestion + Sync Decision (preferred)

Federation is modeled as an **async ingestion** concern, decoupled from the synchronous decision path:

```
                    ┌───────────────── async, network-bound (NEW control-layer federation modules) ─────────────────┐
  remote node  ──▶  FederationResolver.fetch()  ──▶  FED-SEC-001 verify (sig/authority/boundary/replay)  ──▶  materialize
                    (async)                          (async/CPU)                                              (sync put)
                                                                                                                │
                                                                                                                ▼
                    provenance-namespaced records written to the substrate Metadata runtime (FED-PROV-001 keys)
                                                                                                                │
  request  ─────────────────────────────────────────────────────────────────────────────────────────────────▶│
                    ControlPlane.authorize()  ── SYNC, UNCHANGED core ──  reads local + materialized foreign
                    (deny-by-default; local sovereignty; clamped trust)   records via existing sync MetadataPort
```

- The **network/async** work happens in **new control-layer federation modules** and completes **before**
  the synchronous decision, writing verified, provenance-tagged records into the substrate Metadata runtime
  (via the existing sync `MetadataPort.put`).
- The **decision path stays synchronous and unchanged** — the ratified PI-4 evaluator/plane operate on
  local metadata exactly as today. This is why the 65 existing tests remain valid.
- Cached foreign records carry bounded staleness + hard expiry (FGP-4 / FED-SEC-TBE); expired ⇒ treated as
  absent ⇒ deny-by-default (fail-closed).

## 3. Additive async seams (control layer only)

Introduced **alongside** the existing sync interfaces (non-breaking):
```
// src/control/types.ts (control dir — NOT prohibited)  [added, existing kept]
interface AsyncIdentityProvider { readonly name: string; resolve(identityId): Promise<IdentityRecord | undefined>; }
interface AsyncTrustAuthority   { readonly name: string; levelFor(identityId): Promise<number | undefined>; }
```
- Existing sync `IdentityProvider`/`TrustAuthority` are **retained** for local/in-process providers →
  backward compatible.
- New `src/control/federation/federation-resolver.ts` orchestrates async providers, verification, and
  materialization. A new optional `ControlPlane.prepare(principal, cap, op)` async hook (or reuse of the
  already-async `execute()`) performs ingestion before delegating to the unchanged sync decision core.

## 4. Optional on-demand async path (secondary)

For cache-miss at request time, `execute()` (already async) may `await` a bounded federation resolution:
```
execute(...) → await federationResolver.ensure(subject) [bounded timeout, fail-closed] → authorize() [sync] → kernel.execute() [async, unchanged]
```
- Timeout/unreachable ⇒ deny (fail-closed, FGP-4). No partial/optimistic authorization.

## 5. Backward-compatibility & non-regression

- `IdentityResolver.resolve` (sync) and `ControlPlane.authorize` (sync) signatures **unchanged**; async
  behavior is opt-in via new methods/providers.
- All 65 ratified tests exercise only local/sync paths and remain valid without modification.
- `createControlPlane` gains optional federation wiring (`asyncProviders`, `federationResolver`,
  `auditSink: FederatedAuditLog`) — additive options, defaults preserve current behavior.

## 6. Prohibited-core-dir impact statement

| Prohibited dir | Change required by this spec? | Why not |
|----------------|:-----------------------------:|---------|
| `src/meta-core` | **No** | `kernel.execute` already async; decision path reads via existing sync ports |
| `src/registry-runtime` | **No** | Foreign records in a separate `RegistryPort` adapter instance (FED-PROV-001) |
| `src/metadata-runtime` | **No** | Ingestion uses existing sync `put/get/query`; namespaced keys |
| `src/configuration-runtime` | **No** | Federation config via existing `setLayer` (unknown layer append) |
| `src/contracts` | **No** | Provenance carried in existing free-form `descriptor.metadata` |

**All evolution is confined to `src/control/*` (new `src/control/federation/*` modules + additive async
interfaces in `src/control/types.ts`). Zero prohibited-core-dir change — constraint satisfied.**

## 7. Traceability
- **Refines:** PI5-REV-004; FED-SEC-001, FED-PROV-001, FED-AUD-001.
- **Consumed by:** future PI-5 implementation act.
- **Owner:** UCOS Authority Board (Architecture).

**END FED-ARCH-001 — DESIGN · READY FOR RATIFICATION · ZERO PROHIBITED-CORE-DIR CHANGE · NO IMPLEMENTATION AUTHORIZED.**
