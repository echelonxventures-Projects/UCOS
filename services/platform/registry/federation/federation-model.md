# WP-PLT-06 — Registry Federation Model (multi-cluster / multi-region)

**Service:** `UCOS-SVC-027` · **Contract:** `UCOS-API-CONTRACT-027` · **ADR:** ADR-004 ·
**Targets:** `UCOS-ASR-NFR-001` §6 (scalability/federation).

> **No single-instance assumptions.** The Registry is horizontally scalable and federatable by design; no
> component assumes a single registry instance, cluster, or region.

## Multi-cluster readiness
- Registry runs as **stateless replicas** (≥3, AC-1) in each cluster; the DOM-027 SoR lives in the WP-PLT-02
  HA PostgreSQL cluster (per region). Discovery is a read projection (cache-backed) — scales out.
- Cross-cluster discovery resolves via **federated registry endpoints** (each cluster's registry advertises
  its artifacts); no cluster depends on another cluster's registry being co-located (INV-7).

## Multi-region readiness
- Per-region registry + SoR; cross-region artifact replication is **async, eventually-consistent** for
  discovery reads, with each region's SoR authoritative for its locally-owned artifacts (no shared mutable
  model, INV-1; single SoR per owner, INV-5).
- Regional expansion is **additive** (ASR §6.3): add a region + its registry/SoR — no redesign (FPP).

## Registry federation model
| Aspect | Model |
|--------|-------|
| Topology | mesh of per-cluster registries; federation layer aggregates discovery |
| Authority | each artifact has one owning registry/SoR (INV-5); federation is read-aggregation, not shared write |
| Consistency | strong within a region (SoR); eventual across regions (discovery projection) |
| Identity | cross-registry calls are mTLS workload-identity authenticated (S1) |
| Failure mode | a region/cluster registry outage degrades *scope* (that region's local discovery), never platform-wide (static stability, INV-9) |
| Scale | T1→T4 by adding replicas/clusters/regions (ASR §5/§6) — extension, not redesign |

## Federation invariants
- No single point of failure; no single-instance assumption (INV-7).
- Cross-registry integration is contract-first (API-027) and mTLS-authenticated (IC-2/S1).
- Federation adds reach by **extension**; it never requires foundational redesign (FPP).

**Traceability:** ADR-004 · `UCOS-ASR-NFR-001` §6 · INV-1/INV-5/INV-7/INV-9 · SEC-CTL-014 (S1).
