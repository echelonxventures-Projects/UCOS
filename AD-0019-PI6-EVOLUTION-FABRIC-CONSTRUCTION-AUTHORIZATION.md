# UCOS — AD-0019 · Scoped Article IX Release for PI-6 Evolution Fabric

## Authority Board Decision of Record — Narrow Generation-Lock Extension (PI-6 Evolution Fabric)

| Field | Value |
|-------|-------|
| Artifact | **AD-0019 — PI-6 Evolution Fabric Construction Authorization** |
| Artifact ID | `UCOS-AUTH-BOARD-AD-0019` |
| Decision-log entry | AUTH-012 **AD-0019** |
| Version | 1.0.0 |
| Decision body | **UCOS Authority Board** (terminal authority; AUTH-009; Constitution Art. IX / Art. XII) |
| Mode | **AUTHORIZATION ACT ONLY** — extends the AD-0016/AD-0017/AD-0018 releases to the PI-6 evolution fabric; modifies no ratified architecture, ADR, or frozen baseline |
| Inputs (read-only) | `EVO-GOV-001`, `EVO-SEC-001`, `EVO-ARCH-001`, `EVO-GOVERNOR-001`, `EVO-FED-001`, `EVO-AUD-001` (PHASE 13.1); `PI6-REV-001..004` (PHASE 13); `PI6-AUTH-REV-001/002` (PHASE 13.2); `AD-0016`, `AD-0017`, `AD-0018`; AD-0014 (Ω∞ disposition); `UCOS-ART9-REL-001`; `UCOS-SEC-ARCH-001` (S1/S3/S4); AUTH-003 (IP-14 Migration-Only Evolution, IP-15 Backward-Compatibility Governance) |
| Effective | 2026-07-01T00:00:00Z |
| **Determination** | **RELEASE LOCK — PI-6 EVOLUTION-FABRIC SCOPE ONLY** |

> Extends AD-0016 (substrate), AD-0017 (control fabrics), and AD-0018 (federation fabric), all preserved.
> For every scope beyond §2 the Article IX lock and the AD-0014 Ω∞ disposition remain fully in force.

---

## 1. Basis

PHASE 13 determined **PI-6 NOT AUTHORIZED** (no ratified `EVO-*` set; residual High threats E6/E10/E11/E12
open). PHASE 13.1 closed those gaps at the design level, producing six specifications and a ratification
determination (**PI-6 READY FOR AUTHORIZATION REVIEW**) with **0 residual High/High** across E6/E10/E11/E12.
PHASE 13.2 independent Board review (`PI6-AUTH-REV-001/002`) confirms the specifications are complete,
mutually consistent, and compliant with governance (AUTH-009), security (AUTH-008 S1/S3/S4), architecture
(zero prohibited-core-dir change), and the AD-0014 Ω∞ boundary.

The Evolution Fabric **operationalizes already-ratified immutable principles** — `IP-14 Migration-Only
Evolution` and `IP-15 Backward-Compatibility Governance` (AUTH-003; ratified AD-0005). It is a **governed
change-management fabric**, categorically distinct from the deferred **Ω∞ existential self-evolution**
(AD-0014): its governor (`EVO-GOVERNOR-001`) **structurally prohibits** self-modification and recursion.
The Board therefore authorizes construction of the PI-6 evolution fabric, **restricted** to the
control-layer evolution scope and **built additively on the AD-0016/AD-0017/AD-0018 substrate, control, and
federation fabrics without modifying any substrate core**.

## 2. Authorized Scope (and only this)

| # | Increment | Authorized target | Realizes |
|:-:|-----------|-------------------|----------|
| E-A | **PI-6** | **New evolution modules** under `src/control/evolution/*` — evolution proposal, approval, certification authority, ratification authority, revocation authority, evolution registry (metadata `evolution:*` prefix), evolution lifecycle, snapshot/restore engine, atomic-apply orchestrator, evolution governor (depth/rate/halt), federation-compatibility guard, evolution audit sink | `EVO-GOV-001`, `EVO-SEC-001`, `EVO-ARCH-001`, `EVO-GOVERNOR-001`, `EVO-FED-001`, `EVO-AUD-001` |
| E-B | **PI-6** | **Tests** under `test/` for evolution behavior, atomic apply/rollback, governor (E10/E11/E12), federation compatibility (E6), and audit | design specs above |

**Binding architectural constraints:**
- Evolution is **additive**: the ratified PI-2/PI-3 substrate, PI-4 control decision path, and PI-5
  federation fabric are unchanged; all existing tests (90/90) must remain green.
- Evolution orchestrates **only public seams**: `RegistryPort`, `MetadataPort`, `ConfigurationPort`, and
  `MetaCoreKernel.{loadDescriptors,resolve,compose}` + getters. **No new first-class core-port fields.**
- **Deny-by-default**, **separation of duties** (propose ≠ approve ≠ certify ≠ ratify ≠ revoke),
  **atomic apply with deterministic rollback**, **fail-closed** on any snapshot/restore/compose failure,
  cryptographic signing + replay protection, and **hash-chained tamper-evident audit** are mandatory.
- **Governor invariants are non-waivable:** evolution may not target the five core dirs or its own
  `src/control/evolution/*` / governor / authority namespaces; proposals may not originate from evolution
  execution; single in-flight transaction; depth = 0; rate limits + emergency halt.
- **Federation protection:** evolution may **never silently mutate** a ratified `federation:*` boundary;
  federation-touching changes require a federation re-ratification token (`EVO-FED-001`).
- Non-waivable **S1/S3/S4** preserved; secrets/keys **by reference only**.

## 3. Prohibited Scope (remains LOCKED)

- ❌ Modification of `src/meta-core/*`, `src/registry-runtime/*`, `src/metadata-runtime/*`,
  `src/configuration-runtime/*`, `src/contracts/*` (the five substrate core dirs) — **any such change voids
  this act** (see §5)
- ❌ Modification of `src/control/evolution/*` **by the evolution fabric during its own execution**
  (self-modification prohibition, E10) — enforced by the governor
- ❌ Any domain, bounded-context service, or business logic
- ❌ Any **Ω∞ existential self-evolution** — AD-0014 stands; this act authorizes **governed
  change-management only**, not autonomous/recursive/self-directed existential evolution
- ❌ Mutation of frozen artifacts (`UCOS-PEA-001..007`, Governance Baseline 1.0.0, ratified constructs)
- ❌ Enrollment of any existential invariant (INV-14..20 deferred; INV-1..13 unchanged)
- ❌ Production deployment / live infrastructure provisioning
- ❌ Silent mutation of any ratified federation boundary/authority/certification (`EVO-FED-001`)

## 4. Binding Controls

`IC-1..IC-8` remain binding. Non-waivable **S1/S3/S4** preserved. Concrete apply-time evolution acts —
applying an evolution unit to a running system, executing a rollback, registering/revoking an evolution
authority, issuing a federation re-ratification token — remain **Approval-Required Operations** (AD-0009)
requiring explicit human/Board approval at execution time. The evolution certification and ratification
authorities are distinct, signed, revocable, and subject to strict separation of duties (`EVO-GOV-001`).

## 5. Revocation

`UCOS-ART9-REL-001` §6 applies. Any construction outside §2 — including **any** modification to the five
substrate core dirs, any evolution-fabric self-modification during execution, any domain/service/business
logic, any silent federation-boundary mutation, or any Ω∞ existential-evolution scope — voids this act and
re-imposes the full lock.

## 6. Determination

> ## RELEASE LOCK — PI-6 EVOLUTION-FABRIC SCOPE ONLY
>
> The Authority Board authorizes construction of the PI-6 Evolution Fabric — new `src/control/evolution/*`
> modules and tests realizing `EVO-GOV/SEC/ARCH/GOVERNOR/FED/AUD-001` — built additively on the
> AD-0016/AD-0017/AD-0018 substrate, control, and federation fabrics with **no modification of any substrate
> core dir**, no self-modification during execution, no domain/service/business logic, no silent federation
> mutation, and **no Ω∞ existential-evolution scope**. All other generation remains LOCKED.

## Traceability
- **Refines:** `EVO-GOV-001`, `EVO-SEC-001`, `EVO-ARCH-001`, `EVO-GOVERNOR-001`, `EVO-FED-001`,
  `EVO-AUD-001`, `PI6-REV-001..004`, `PI6-AUTH-REV-001/002`, `UCOS-AUTH-BOARD-AD-0016/0017/0018`,
  `UCOS-ART9-REL-001`, `UCOS-SEC-ARCH-001`, AD-0014, AUTH-003 (IP-14/IP-15), `UCOS-CONST-001` (Art. IX/XII),
  `AUTH-008/009/012`.
- **Refined by:** the PI-6 evolution fabric under `packages/platform-runtime/src/control/evolution/`.
- **Owner:** UCOS Authority Board.

**END AD-0019 — RELEASE LOCK · PI-6 EVOLUTION-FABRIC SCOPE ONLY · EFFECTIVE 2026-07-01 · CONSTRUCTION AUTHORIZED.**
