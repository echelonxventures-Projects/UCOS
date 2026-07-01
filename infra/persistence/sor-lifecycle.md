# WP-PLT-02 — System-of-Record Rules & Migration-Only Lifecycle

**ADR:** ADR-002 · **Targets:** `UCOS-ASR-NFR-001` §8 · **Controls:** INV-5, INV-10, SEC-CTL-013.

> Defines the governance rules for the persistence substrate that will host — **without future
> foundational redesign** — the Registry, Config & Metadata, Contract Catalog, Governance Ledger, Platform
> State, and future domain systems. **No registry/config schemas are created here** (owned by
> `WP-PLT-06`/`WP-PLT-11`); this establishes the *rules and allocation model* only.

## System-of-Record rules
1. **Single SoR per domain (INV-5 / PEP-005).** Each bounded context/platform domain owns exactly one
   authoritative SoR schema in the PostgreSQL cluster (`ucos-sor`). No shared mutable schema across domains.
2. **No direct mutation.** The SoR is mutated **only** through the owning service's contract-mediated write
   path (`app-writer` role). Direct human/ad-hoc DML is `FORBIDDEN`; break-glass access is Approval-Required
   and audited (SEC-CTL-011).
3. **Append-only governance records.** Governance/ledger data (decisions, gate results, audit) is
   **append-only** — no update/delete of historical rows (INV-10; mirrors `CFP-008`).
4. **Versioned metadata.** Metadata/config records are versioned (supersede, never overwrite); prior
   versions are retained (migration-only).

## SoR allocation model (provisioned later by owning WPs)
| Logical SoR | Owner WP | Status |
|-------------|:--------:|:------:|
| Registry SoR (DOM-027) | WP-PLT-06 | schema deferred (not this WP) |
| Config/Metadata SoR (DOM-018) | WP-PLT-11 | schema deferred (not this WP) |
| Contract Catalog (reference) | governance | reference-only |
| Governance Ledger (append-only) | governance | rules defined here |
| Platform State | platform | rules defined here |
| Future domain systems | future WPs | extension, not redesign (FPP) |

## Migration-only lifecycle
- Schema evolution is **forward-only** via a governed migration runner (`migrator` role,
  `ddl-forward-only`); destructive operations (drop/rename that loses data) are prohibited absent an
  Approval-Required governed migration with preservation.
- Every migration is versioned, ordered, idempotent, and recorded append-only.
- Rollback = compensating forward migration + PITR (backup-restore.yaml), never destructive reversal.
- Consistent with IC-7 (migration-only evolution) and INV-10 (append-only).

## Permanence guarantee (FPP)
Registry, Config, and all future domain SoRs are added as **new schemas** in the existing HA cluster
(extension); scale is met by the tiers below (§ capacity). **No persistence redesign is required** to
onboard them.

## Capacity alignment (`UCOS-ASR-NFR-001` §5)
| Tier | Storage (usable) | Scale mechanism (no redesign) |
|:----:|:----------------:|-------------------------------|
| T1 | 1 TB | single HA cluster; vertical storage growth |
| T2 | 10 TB | read replicas added; connection pooling |
| T3 | 100 TB | table/partition sharding; per-domain SoR isolation |
| T4 | 1 PB+ | horizontal partitioning + regional clusters (INV-7, §6) |

**Traceability:** ADR-002 · INV-5/INV-10 · IC-7 · SEC-CTL-011/013 · `UCOS-ASR-NFR-001` §5/§8.
