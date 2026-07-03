# UCOS — AD-0017 · Scoped Article IX Release for PI-4 Control Fabrics

## Authority Board Decision of Record — Narrow Generation-Lock Extension (PI-4 Identity / Trust / Policy / Governance Runtimes)

| Field | Value |
|-------|-------|
| Artifact | **AD-0017 — PI-4 Control Fabrics Construction Authorization** |
| Artifact ID | `UCOS-AUTH-BOARD-AD-0017` |
| Decision-log entry | AUTH-012 **AD-0017** (Decision Log → v1.0.7) |
| Version | 1.0.0 |
| Decision body | **UCOS Authority Board** (terminal authority; AUTH-009; Constitution Art. IX / Art. XII) |
| Mode | **AUTHORIZATION ACT ONLY** — extends the AD-0016 substrate release to the PI-4 control fabrics; modifies no ratified architecture, ADR, or frozen baseline |
| Inputs (read-only) | `AD-0016-PI2-PI3-SUBSTRATE-CONSTRUCTION-AUTHORIZATION` (`UCOS-AUTH-BOARD-AD-0016`), `UCOS-ART9-REL-001`, `UCOS-PEA-007` (Control Fabric), `UCOS-SEC-ARCH-001` (S1/S3/S4), AD-0014 (Ω∞ disposition), `UCOS-IMP-PI-001` |
| Effective | 2026-07-01T00:00:00Z |
| **Determination** | **RELEASE LOCK — PI-4 CONTROL-FABRIC SCOPE ONLY** |

> Extends AD-0016 (preserved). For every scope beyond §2 the Article IX lock and the AD-0014 Ω∞ disposition
> remain fully in force.

---

## 1. Basis

The PI-2/PI-3 substrate (`packages/platform-runtime/`) is implemented and independently validated in this
phase (Parts A–C). The next foundational layer — the control fabrics realizing `UCOS-PEA-007` and the
non-waivable security controls of `UCOS-SEC-ARCH-001` (S1 authn/authz, S3 secrets, S4 data protection) — is
required before any federation or Ω∞ capability. The Board authorizes its construction, **restricted** to the
four control runtimes and **built on the existing substrate without modifying the Meta-Core**.

## 2. Authorized Scope (and only this)

| # | Increment | Authorized runtime | Realizes |
|:-:|-----------|--------------------|----------|
| C-A | **PI-4** | **Identity Runtime** — identity registry, resolution, credential model, federation interface, lifecycle, validation | `UCOS-SEC-ARCH-001` (S1); `UCOS-PEA-007`; ADR-006 |
| C-B | **PI-4** | **Trust Runtime** — trust model, evaluation, resolution, federation interface | `UCOS-SEC-ARCH-001`; `UCOS-PEA-007` |
| C-C | **PI-4** | **Policy Runtime** — policy registry, evaluation engine, resolution, enforcement hooks (metadata/config-driven) | `UCOS-PEA-007`; AUTH-009 |
| C-D | **PI-4** | **Governance Runtime** — governance registry, decision/approval/certification models, validation | `UCOS-PEA-007`; AUTH-009/012 |
| C-E | **PI-4** | **Control Plane** — policy enforcement point over the substrate kernel (controlled execution) | Part E |

**Binding architectural constraint:** the control fabrics are **additive** — they build on the substrate's
Registry/Metadata/Configuration runtimes and wrap the Meta-Core kernel through its public API. **No file under
`src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, or
`src/contracts` may be modified.** All identities, trust levels, policies, and approvals are runtime-driven
(registry/metadata/configuration); **0 hardcoded identities, permissions, or policies** (IP-04; deny-by-default).

## 3. Prohibited Scope (remains LOCKED)

- ❌ Any domain, bounded-context service, or business logic
- ❌ Any Ω∞ existential system (species/habitat/reality/computation/economic/cosmological) — AD-0014 stands
- ❌ Mutation of frozen artifacts (`UCOS-PEA-001..007`, Governance Baseline 1.0.0, ratified constructs) (P2)
- ❌ Enrollment of any existential invariant (INV-14..20 deferred; INV-1..13 unchanged)
- ❌ Modification of the PI-2/PI-3 substrate core (see §2 constraint)
- ❌ Production deployment / live infrastructure provisioning

## 4. Binding Controls

`IC-1..IC-8` remain binding. Non-waivable **S1/S3/S4** preserved and, in this increment, **designed and
enforced** by the control plane (deny-by-default authorization; identity + trust + governance gates).

## 5. Revocation

`UCOS-ART9-REL-001` §6 applies. Any construction outside §2 — including core substrate mutation or any Ω∞
scope — voids this act and re-imposes the full lock.

## 6. Determination

> ## RELEASE LOCK — PI-4 CONTROL-FABRIC SCOPE ONLY
>
> The Authority Board authorizes construction of the PI-4 Identity, Trust, Policy, and Governance runtimes and
> the Control Plane, built additively on the AD-0016 substrate with no Meta-Core modification. All other
> generation remains LOCKED.

## Traceability
- **Refines:** `UCOS-AUTH-BOARD-AD-0016`, `UCOS-ART9-REL-001`, `UCOS-PEA-007`, `UCOS-SEC-ARCH-001`, AD-0014, `UCOS-CONST-001` (Art. IX/XII), `AUTH-008/009/012`.
- **Refined by:** the PI-4 control fabrics under `packages/platform-runtime/src/control/`.
- **Owner:** UCOS Authority Board.

**END AD-0017 — RELEASE LOCK · PI-4 CONTROL-FABRIC SCOPE ONLY · EFFECTIVE 2026-07-01 · CONSTRUCTION AUTHORIZED.**
