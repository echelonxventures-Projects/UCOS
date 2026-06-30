# ADR-005 — Metadata & Configuration Delivery Technology Selection

**Artifact ID:** UCOS-PLAT-ADR-005
**Short Name:** ADR-005 Metadata
**Layer:** ARCHITECTURE (Platform Engineering — Technology Selection)
**Phase:** Phase 10.1 — Platform Technology Selection (Implementation Readiness Condition C-4)
**Status:** ACCEPTED (technology-selection scope)
**Version:** 1.0.0
**Date:** 2026-06-30
**Decision Owner:** Platform Engineering — Configuration & Metadata Owner (`PEO-011`)
**Governing Domain:** `PE-11` Configuration & Metadata Delivery (Operability Plane, PEG-D)
**Capability Anchor:** CAP-10 Configuration & Metadata

> **Scope notice.** Technology selection authorized by `CTX-ARCHB-001` §5; deferred by `PEP-010` and by
> `UCOS-PEA-005` (Configuration) / `UCOS-PEA-006` (Metadata), both RATIFIED. This ADR selects the
> metadata/configuration delivery substrate that **realizes** those architectures; it does **not** define
> metadata semantics (owned by `UCOS-INF-ARCH-001`) and does **not** mutate any frozen artifact. Secrets
> are explicitly **out of scope** here and selected in ADR-006 (`PEP-003` separation).

---

## 1. Context

The Metadata Architecture (`UCOS-PEA-006`, v0.8.0, RATIFIED) defines **17 Metadata Domains**
(`PMD-001..017`), **73 Metadata Entries** (`PME-001..073`), `PMA-001`, `PML-001`, `TM-PEA-031/032/033`;
the Configuration Architecture (`UCOS-PEA-005`, v0.7.0, RATIFIED) defines **17 Configuration Domains**
(`PCD-001..017`), **73 Configuration Entries** (`PCF-001..073`), `PCA-001`, `PCL-001`,
`TM-PEA-021/022/023`. Metadata *semantics* are governed by the ratified Information / Metadata
Architecture (`UCOS-INF-ARCH-001`; 13 Metadata Classes). `PE-11` governs delivery under **Metadata
First** (`PEP-002`), **Configuration First** (`PEP-003`), and **No Hard Coding** (`PEP-004`). The
substrate must:

- Treat variability as **governed data**, not code forks (`PEP-002`);
- Externalize configuration, **versioned and traceable**, separated from logic **and from secrets**
  (`PEP-003`; `PEB-011` prohibited interaction: co-mingling config with code/secrets);
- Deliver governed metadata/configuration to all domains at runtime (`PEB-011`);
- Validate against the metadata model (`UCOS-INF-ARCH-001`) via open schemas;
- Be **cloud-neutral / portable** (`PEP-010`).

## 2. Decision

**Adopt a data-as-source-of-truth metadata/configuration substrate: versioned governed records in
PostgreSQL delivered via a Configuration & Metadata service API, with GitOps-managed declarative
platform configuration and open schema validation — secrets excluded.**

1. **System of record:** metadata (`PME-*`) and configuration (`PCF-*`) are stored as **versioned,
   governed records in PostgreSQL** (ADR-002) — the authoritative source for variability (`PEP-005`),
   carrying lineage to `UCOS-INF-ARCH-001` metadata classes.
2. **Delivery mechanism:** a **Configuration & Metadata service** (a `PRS-*` runtime service) exposes
   governed read APIs for runtime consumers; values are resolved by context (environment/tenant) at
   request time — no hard-coded variability (`PEP-004`).
3. **Declarative platform configuration (GitOps):** environment/cluster-shaping configuration is
   expressed declaratively in **Git** and reconciled by the GitOps controller selected in ADR-007;
   open formats (**JSON/YAML**) validated against **JSON Schema** derived from the metadata model.
4. **Separation of concerns:** **secrets are excluded** from this substrate and are delivered only via
   the secrets/key substrate in **ADR-006** (`PEP-003`); configuration is never co-mingled with code or
   secrets (`PEB-011`).
5. **Versioning & lifecycle:** changes are versioned and traceable; metadata/configuration lifecycle
   follows `PML-001` / `PCL-001`; backward compatibility preserved (`PEP-015`); evolution migration-only
   (`PEP-016`).

## 3. Alternatives Considered

| # | Alternative | Why not selected |
|---|-------------|------------------|
| A | **Distributed KV config store (e.g., Consul KV / etcd) as SoR** | Capable runtime delivery, but weaker governance/lineage/queryability and audit alignment than a governed relational SoR; overlaps ADR-004 registry concerns. Retained only as a possible cache/edge-delivery layer. |
| B | **Cloud-managed config/app-config service** | Vendor-specific, violating `PEP-010`/§5; portability and uniform governance suffer across clouds. |
| C | **Config baked into container images / environment at build** | Violates `PEP-003/004` (externalized, no hard coding) and `PEB-011`; prevents runtime variability and tenant context resolution. |
| D | **Single store for config + secrets** | Rejected — violates `PEP-003` separation and `PEB-011`; secrets require the isolated substrate in ADR-006. |
| E | **GitOps-only (no runtime delivery API)** | Good for platform-shaping config, but insufficient for per-request tenant/context metadata resolution; both layers are therefore adopted with clear boundaries. |

## 4. Consequences

**Positive**
- Variability is governed data with lineage to `UCOS-INF-ARCH-001` (`PEP-002`); zero hard coding
  (`PEP-004`).
- Externalized, versioned, traceable configuration with clean secrets separation (`PEP-003`).
- GitOps gives declarative, auditable, reproducible platform configuration feeding `PE-14`/`PE-15`
  (ADR-007).
- Schema validation enforces metadata-model conformance at delivery time.

**Negative / Trade-offs**
- Two delivery layers (runtime API + GitOps) require boundary clarity — provided by this ADR and
  `PEB-011`.
- Runtime config service is on the critical path — mitigated by caching (ADR-002 Redis) and `PE-13`
  resilience posture.

**Follow-on obligations**
- **Secrets/keys** delivery is selected in **ADR-006** (separated by design).
- GitOps reconciler and pipeline gates that validate configuration are selected in **ADR-007**.
- Metadata schema definitions are bound to `UCOS-INF-ARCH-001`; no new metadata classes created here.

## 5. Traceability

- **Realizes:** `UCOS-PEA-006` (`PMD/PME`, `PMA-001`, `PML-001`), `UCOS-PEA-005` (`PCD/PCF`, `PCA-001`,
  `PCL-001`); `UCOS-INF-ARCH-001` (metadata semantics); `UCOS-PEA-001` `PE-11`, `PEG-011`, `PEO-011`,
  `PEB-011`.
- **Justified by ASR/principle:** `PEP-002/003/004/005/010/015/016`; AUTH-007.
- **Authority:** AUTH-007 (Data Canon), AUTH-009.
- **Consumed by (downstream):** ADR-006 (secrets separation), ADR-007 (GitOps delivery + gates),
  ADR-004 (metadata references), Prompt 10 (`WP-PLT-11`).
- **Chain:** `ADR-005 → PE-11 / PMD-* / PCD-* → CAP-10 → AUTH-007/009 → UCOS-PEA-005/006 → UCOS-INF-ARCH-001`.

## 6. Governance Impacts

- Satisfies **Phase 10.0 Condition C-4** for the metadata/configuration concern.
- Governed by `PEG-011`; configuration/metadata delivery governance held by the Configuration & Metadata
  Owner; escalation `PEO-011 → PE-17 → Authority Board`.
- Enforces `PEP-002/003/004`; secrets separation is a hard boundary (`PEB-011`), realized by ADR-006.
- Additive only; **no** new metadata classes or configuration domains created; no frozen-artifact
  mutation; migration-only evolution (`PEP-016`).

## 7. Approval Status

| Field | Value |
|-------|-------|
| Status | **ACCEPTED** (technology-selection scope) |
| Approval model | Approval-By-Exception (`PEP-020`); ratified within the technology-selection ADR set by `PE-17` |
| Terminal authority | Authority Board (`PEG-017`) |
| Gating note | Realization gated by `UCOS-IMP-READY-001` (C-4..C-6) and the Article IX lock |

## 8. Ownership

| Role | Assignment |
|------|------------|
| Decision Owner (Engineering) | Configuration & Metadata Owner (`PEO-011`) |
| Steward | Configuration & Metadata Steward (CAP-10) |
| Governing Model | `PEG-011` |
| Boundary | `PEB-011` |
| Authority Chain | Configuration & Metadata Owner → `PE-17` → Authority Board |

## Traceability (artifact)
- **Refines:** `UCOS-PEA-001`, `UCOS-PEA-005`, `UCOS-PEA-006`, `UCOS-INF-ARCH-001`, `CTX-ARCHB-001` §5,
  AUTH-007/009, PROMPT-08.
- **Refined by:** `UCOS-PLAT-ADR-INDEX`; ADR-006, ADR-007; Prompts 09–12.
