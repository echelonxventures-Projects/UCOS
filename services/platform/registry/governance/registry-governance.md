# WP-PLT-06 — Registry Ownership, Lifecycle, Versioning & Governance

**Service:** `UCOS-SVC-027` (Registry & Discovery) · **Contract:** `UCOS-API-CONTRACT-027` · **ADR:** ADR-004 ·
**Domain:** DOM-027 · **Capability:** CAP-19. Operationalizes **INV-13**.

## Registry System of Record
- **Single SoR** for DOM-027 (`dom_027` schema on the WP-PLT-02 cluster, INV-5): artifacts, dependency
  edges, discovery projection.
- **No direct mutation** — writes only via the contract-mediated `registrar` path; append-only (INV-10).

## Registry ownership model
- Every registered artifact has exactly **one accountable owner** (`PEO-*` / owning WP).
- Ownership is recorded and immutable per version; ownership transfer is a governed, audited event.

## Registry lifecycle
`DRAFT → ACTIVE → SUPERSEDED → DEPRECATED` — append-only; superseded/deprecated artifacts are **never
deleted** (INV-10; mirrors `CFP-008`).

## Registry versioning
- Semantic-versioned artifacts; supersede-not-overwrite; supersession chain retained.
- Contract (`API-027`) evolution is migration-only (`UCOS-SVC-POLICY-001`; IC-7).

## Registry governance
- Governed by `GATE-QUAL/SEC/DOC-001`; registered in `CTX-REG-001`; full traceability (`traceTo`, IC-4).
- Dependency edges MUST remain **acyclic** (consistency with ratified `PSR-001..017`).
- Classification bounded (public/internal/confidential); **no secret material** (S3).

## INV-13 operationalization (registration + metadata + composition)
New capabilities enter the platform through:
1. **Registration** — `POST /registry/artifacts` registers the artifact (open `artifactType`).
2. **Metadata** — the artifact's `metadataRef` binds to a DOM-018 metadata record (API-018), making it
   describable/governable/versionable.
3. **Composition** — dependency edges compose it into capabilities/services/workflows/events (acyclic).

| Future construct | Registration | Metadata | Composition | Arch change? |
|------------------|:------------:|:--------:|:-----------:|:------------:|
| Domain / Service / Workflow | ✅ | ✅ | ✅ | **none** |
| Data Model / Event / Capability | ✅ | ✅ | ✅ | **none** |
| AI System / Computational Engine | ✅ | ✅ | ✅ | **none** |

> **Result:** a new capability enters the platform by **registration + metadata + composition** — **no
> architecture change, no platform redesign**. This completes the operational realization of INV-13
> (the *registration/discovery* leg complementing WP-PLT-11's *metadata* leg).
>
> **Baseline enrollment flagged (not performed):** formal addition of INV-13 to `UCOS-ASR-NFR-001` (INV-1..12)
> remains a governed ≥1.0.1 + AUTH-012 act (Authority Board); not performed here (P2).

**Traceability:** ADR-004 · `UCOS-API-CONTRACT-027`/`EVT-027`/`DATA-027` · DOM-027 · CAP-19 · `PSR-001..017` ·
INV-5/INV-10/INV-13 · SEC-CTL-002/011.
