# WP-PLT-11 — Metadata Governance, Lifecycle & Federation Readiness

**Service:** `UCOS-SVC-018` (Config & Metadata) · **Contract:** `UCOS-API-CONTRACT-018` · **ADR:** ADR-005 ·
**Domain:** DOM-018 · **Capability:** CAP-10. Realizes **INV-13 (Infinite Extensibility Invariant)**.

> This service is the **metadata control plane** for UCOS. All future domains, services, workflows,
> contracts, events, policies, capabilities, AI systems, and computational engines are made describable,
> discoverable, versionable, governable, and extensible **through metadata** — by registration,
> configuration, and composition, **not** by architecture change or platform redesign.

## Metadata lifecycle
`DRAFT → ACTIVE → SUPERSEDED → DEPRECATED` — append-only; SUPERSEDED/DEPRECATED records are **never
deleted** (INV-10). Evolution is supersede-not-overwrite (migration-only, IC-7).

## Metadata governance
- **Single SoR** for DOM-018 (`dom_018` schema, INV-5); no direct mutation (contract-mediated write only).
- **Versioned** records with a supersession chain; full traceability anchors (`governance.traceTo`, IC-4).
- **Single accountable owner** per record (`PEO-*`).
- **Classification** limited to public/internal/confidential — **never secret** (secrets excluded, ADR-005/S3).
- Governed by `GATE-QUAL/SEC/DOC-001` and registered in `CTX-REG-001`.

## Configuration governance
- Hierarchical resolution: `global < domain < service < environment < tenant` (override, not fork).
- Environment-scoped (ENV-DEV/INT/STAGE/PROD); versioned; every change tracked (who/when/why/prev-version).
- **Secrets excluded** (ADR-005): config referencing a secret stores an `external://` handle (WI-SEED.5), never the value (S3).

## Metadata federation readiness
- Records are self-describing and portable; the Registry (`WP-PLT-06`) discovers them; multi-cluster
  federation resolves via Registry + Config (ASR §6.5) with no shared mutable state (INV-1/INV-5).
- Open `class` vocabulary enables cross-domain/federated metadata without schema change (INV-13).

## INV-13 realization — Infinite Extensibility
| Future addition | How it is onboarded | Requires |
|-----------------|---------------------|----------|
| Domain / Service / Workflow | register a metadata record (`class` = domain/service/workflow) + config | Registration + Configuration |
| Contract / Event / Data Model | register descriptor referencing the ratified contract catalog | Registration + Composition |
| Capability | register capability metadata; compose into catalog | Registration + Composition |
| AI System / Computational Engine | register as `class: ai-system`/`computational-engine` with payload descriptor + config + feature flags | Registration + Configuration + Composition |

**In every case:** onboarding = **registration + configuration + composition**. It does **NOT** require
architecture change or platform redesign. This is the operational realization of INV-13.

> **Governance note (baseline enrollment).** INV-13 is *realized and supported* by this foundation. Formal
> enrollment of INV-13 into the ratified invariant set of `UCOS-ASR-NFR-001` (INV-1..12) is a **governed
> upward revision (≥1.0.1 + AUTH-012)** reserved to the Authority Board — flagged here, **not** performed by
> this WP (no frozen-baseline mutation, P2).

**Traceability:** ADR-005 · `UCOS-API-CONTRACT-018`/`EVT-018`/`DATA-018` · DOM-018 · CAP-10 · `MC-01..13` ·
INV-5/INV-10/INV-13 · SEC-CTL-002/005 · `UCOS-ASR-NFR-001` §6.
