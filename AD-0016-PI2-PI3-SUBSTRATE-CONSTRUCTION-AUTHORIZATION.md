# UCOS — AD-0016 · Scoped Article IX Release for the Foundational Substrate

## Authority Board Decision of Record — Narrow Generation-Lock Release (PI-2 Meta-Core + PI-3 Registry/Metadata/Configuration Fabric)

| Field | Value |
|-------|-------|
| Artifact | **AD-0016 — PI-2/PI-3 Substrate Construction Authorization** |
| Artifact ID | `UCOS-AUTH-BOARD-AD-0016` |
| Decision-log entry | AUTH-012 **AD-0016** (Decision Log → v1.0.6) |
| Version | 1.0.0 |
| Decision body | **UCOS Authority Board** (terminal authority; AUTH-009; Constitution Art. IX / Art. XII) |
| Mode | **AUTHORIZATION ACT ONLY** — releases the Article IX lock for a **narrowly scoped substrate** and authorizes its construction; does not modify any ratified architecture, ADR, or frozen baseline |
| Inputs (read-only) | `UCOS-ARTICLE-IX-LOCK-RELEASE` (`UCOS-ART9-REL-001`), `UCOS-CONSTRUCTION-AUTHORIZATION` (`UCOS-CONSTR-AUTH-001`), `UCOS-CONSTRUCTION-BLOCKED` (`UCOS-CONSTR-BLOCK-001`), `PHASE-11D.3-AUTHORITY-BOARD-OMEGA-DECISION` (AD-0014), `UCOS-IMP-PI-001`, `UCOS-PLAT-ADR-001` |
| Effective | 2026-07-01T00:00:00Z |
| **Determination** | **RELEASE LOCK — WITHIN SUBSTRATE SCOPE ONLY** |

> This act supersedes `UCOS-CONSTRUCTION-BLOCKED` (`UCOS-CONSTR-BLOCK-001`) **for the substrate scope defined
> in §2 only** (preserved, not deleted, per AUTH-010). For every other scope the Article IX lock and the
> Omega (Ω∞) disposition of AD-0014 remain fully in force.

---

## 1. Basis

The design-pipeline conditions **C-1..C-5** are CLOSED and the conditions-precedent **CP-1..CP-3** are CLOSED
(`PHASE-10.6-LEDGER-RECONCILIATION-REPORT`; `UCOS-ART9-REL-001`). The only outstanding gate to enter governed
construction was the Authority Board's explicit lock-release act (C-6). The Board hereby performs that act,
**restricted** to the minimum foundational substrate required before any Ω∞ capability, per the foundation-first
priority ratified in AD-0014.

## 2. Authorized Scope (and only this)

Governed construction of executable source code, tests, contracts, schemas, and runtime artifacts is authorized
for the following substrate, realizing `UCOS-PEA-001/002/004/005/006` and `UCOS-PLAT-ADR-001/004/005`:

| # | Program increment | Authorized substrate | Realizes |
|:-:|-------------------|----------------------|----------|
| S-A | **PI-2** | **Meta-Core Runtime** — artifact/capability/contract loaders, dependency resolver, composition engine, execution engine, lifecycle engine, validation engine, plugin runtime | `UCOS-PEA-001/002`; ADR-001 |
| S-B | **PI-3** | **Registry Runtime** — registration, discovery, resolution, versioning (pluggable store) | `UCOS-PEA-004`; ADR-004 |
| S-C | **PI-3** | **Metadata Runtime** — metadata store, resolver, schema validation | `UCOS-PEA-006`; ADR-005 |
| S-D | **PI-3** | **Configuration Runtime** — layered configuration store + resolver | `UCOS-PEA-005`; ADR-005 |

**Implementation language:** TypeScript on Node.js, exercised under the governed polyglot allowance of
`UCOS-PLAT-ADR-001` (primary Java 21; governed TypeScript/Go permitted). No other technology is bound by this act.

## 3. Prohibited Scope (remains LOCKED)

The following remain **prohibited** and require a separate governed decision; **nothing** in §2 authorizes them:

- ❌ Domains, bounded-context services, or business logic (P1)
- ❌ Civilization, planetary, galactic, cosmological, economic, or intelligence systems (AD-0014; Ω∞ remains research/reference)
- ❌ Mutation of any frozen artifact — `UCOS-PEA-001..007`, Governance Baseline 1.0.0, ratified domains/entities/matrices (P2)
- ❌ Enrollment of any existential invariant (INV-14..20 remain deferred; INV-1..13 unchanged)
- ❌ Technology beyond `UCOS-PLAT-ADR-001` / this act; deferred `ADR-002A`/`PE-12`/`PE-07` (P3)
- ❌ Production deployment or live infrastructure provisioning (this act authorizes source construction only)

## 4. Binding Controls

Mandatory controls **IC-1..IC-8** (`UCOS-ART9-REL-001` §5) remain binding. Non-waivable **S1/S3/S4** (AUTH-008;
Const. Art. XII) are preserved. In particular for this substrate:

- **IC-2 Contract-first:** every capability is introduced through a metadata descriptor + contract + configuration;
  the Meta-Core carries **no hardcoded business logic** (Constitution "configuration over customization", IP-04).
- **IC-4 Traceability:** substrate modules trace to the platform architectures listed in §2.
- **IC-8 Preservation:** scoped commits only; append-only governance records.

## 5. Revocation

The §6 revocation conditions of `UCOS-ART9-REL-001` apply unchanged. Any construction outside §2 — including any
Ω∞ domain/civilization/cosmological work — immediately voids this act and re-imposes the full lock.

## 6. Determination

> ## RELEASE LOCK — SUBSTRATE SCOPE ONLY
>
> The Authority Board RELEASES the Article IX generation lock **solely** for the PI-2 Meta-Core Runtime and the
> PI-3 Registry, Metadata, and Configuration Runtimes described in §2, under the controls of §4. Construction of
> this substrate is **AUTHORIZED and may BEGIN**. All other generation remains **LOCKED**.

## Traceability
- **Refines:** `UCOS-ART9-REL-001`, `UCOS-CONSTR-AUTH-001`, AD-0014 (`UCOS-AUTH-BOARD-OMEGA-001`), `UCOS-IMP-PI-001`, `UCOS-PLAT-ADR-001/004/005/006`, `UCOS-CONST-001` (Art. IX/XII), `AUTH-008`, `AUTH-009`.
- **Supersedes (substrate scope only):** `UCOS-CONSTRUCTION-BLOCKED` (`UCOS-CONSTR-BLOCK-001`).
- **Refined by:** the substrate implementation under `packages/platform-runtime/`.
- **Owner:** UCOS Authority Board.

**END AD-0016 — RELEASE LOCK · SUBSTRATE SCOPE ONLY · EFFECTIVE 2026-07-01 · CONSTRUCTION AUTHORIZED.**
