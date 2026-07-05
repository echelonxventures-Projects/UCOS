# SPEC — Governance Registry Specifications

> **STATUS: CREATED — READY FOR AUTHORITY BOARD REVIEW**
> PROPOSED · NOT RATIFIED · NOT IMPLEMENTATION AUTHORIZED · NO REGISTRY INSTANTIATED
> DOES NOT SUPERSEDE `AUTH-001..012` / `UCOS-CONST-001` · DOES NOT MODIFY INV-1..13 / `INV-CORE-001` ·
> DOES NOT OVERRIDE AUTH-012 · DOES NOT RELEASE ARTICLE IX · REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `SPEC-GOVERNANCE-REGISTRIES` |
| Name | Governance Registry Specifications |
| Program | Constitutional Refoundation Program — **Specification Tier** |
| Classification | **PROPOSED — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **REGISTRY SCHEMA DESIGN ONLY** — registry-driven (IP-01/IP-02); no code, no data, no instantiation |
| Chartered by | `GD-0001`; governed by `PCAMG-1000` M-IV; anchors IP-01/IP-02, `INV-CORE-01/14` |

> **No registry instantiated.** Defines the schemas and integrity rules for the governance registries that
> make PCAMG registry-driven and no-hardcoding. No registry data is created and nothing is enrolled.

---

## 1. Purpose

Specify the **governance registries** through which all PCAMG governance resolves — so that no governance
value, rule, authority, or wiring is ever hardcoded (IP-01), and behavior/wiring resolve through registries
(IP-02). Registries are the single source of truth for governance constructs and the substrate of
determinism and traceability.

## 2. Registry Set

| Registry | ID | Holds | Governing artifact |
|----------|----|----|--------------------|
| Principle Registry | `REG-PRIN` | Invariant principle records (`PCAMG-PRIN-*`) | `PCAMG-0000` |
| Meta-Constitution Registry | `REG-META` | Meta-constitutional articles + versions | `PCAMG-1000` |
| Governance-System Registry | `REG-GOV` | Generated governance systems + generation records | `PCAMG-2000` |
| Governance-Center Registry | `REG-CENTER` | Governance centers (`PGC-*`) + delegations | `PCAMG-3000` |
| Domain-Constitution Registry | `REG-DOMAIN` | Domain constitutions (`PDC-GOV-*`) + federation membership | `PCAMG-4000` |
| Policy Registry | `REG-POLICY` | Layer-5 policies | domain constitutions |
| Capability Registry | `REG-CAP` | Capabilities (`CAP-01..19`) | `UCOS-CAP-ARCH-001` |
| Consent Registry | `REG-CONSENT` | Consent records | `PCAMG-8000` |
| Audit Registry | `REG-AUDIT` | Hash-chained audit records | `SPEC-CONSTITUTIONAL-COMPLIANCE-FRAMEWORK` |
| Decision/Amendment Registry | `REG-DECISION` | AUTH-012-class decision records | AUTH-012 |
| Traceability Registry | `REG-TRACE` | Derivation edges (up/down) | `SPEC-TRACEABILITY-FRAMEWORK` |

## 3. Common Registry Record Schema (design)

```yaml
registry_record:
  registry: <REG-*>
  id: <namespaced id>
  uuid: <uuid-v4>                 # permanent, immutable
  version: <semver>
  owner: <single accountable authority>   # PRIN-005
  derived_from: [<up-trace refs>]         # → REG-TRACE (PRIN-004/IP-08)
  status: PROPOSED|ACTIVE|SUPERSEDED|RETIRED
  supersedes: [<prior id@version>]        # append-only (INV-10)
  audit_ref: <REG-AUDIT ref>              # PRIN-006/IP-10
  content: { ... }                        # registry-specific body
  content_hash: <hash>                    # tamper-evidence; determinism (INV-6)
```

## 4. Registry Integrity Rules (non-waivable)

| # | Rule | Anchor |
|:-:|------|--------|
| RG-1 | Single source of truth | No governance value exists outside its registry (IP-01/IP-02; `INV-CORE-01`). |
| RG-2 | Append-only | Records are superseded, never deleted; full lineage preserved (INV-10). |
| RG-3 | Single owner | Every record has exactly one accountable owner (PRIN-005). |
| RG-4 | Up-trace mandatory | Every non-principle record traces up to ≥1 principle (`REG-TRACE`; PRIN-004). |
| RG-5 | Tamper-evidence | `content_hash` + append-only audit; mutation is detectable (PRIN-006; `INV-CORE-02`). |
| RG-6 | Determinism | Registry reads are deterministic; identical query + version → identical result (INV-6). |
| RG-7 | Configuration/metadata separation | Secrets are never stored inline; by-reference only (S3; PEP-003). |
| RG-8 | Fail-closed resolution | Unresolved/ambiguous lookups fail closed; no default-grant. |

## 5. Realization Alignment (existing substrate, unchanged)

These schemas are realizable by the ratified PI-2/PI-3 substrate registry/metadata/configuration runtimes
(AD-0016) and the PI-4 control-plane governance registry (AD-0017) **without modification** to any substrate
core dir. Instantiation is deferred to an authorized construction phase; this spec creates no registry data.

## 6. Scope Discipline (confirmations)

| Confirmation | Result |
|--------------|:------:|
| 11 governance registries + common schema + integrity rules RG-1..8 defined | ✅ |
| Registry-driven / no-hardcoding (IP-01/IP-02); secrets by-reference (S3) | ✅ |
| Append-only; single-owner; up-trace mandatory; tamper-evident | ✅ |
| No registry instantiated; no code; no data | ✅ |
| Article IX not released; ratified artifacts/substrate unchanged | ✅ |

## Traceability
- **Chartered by:** `GD-0001`; **governed by:** `PCAMG-1000` M-IV.
- **Anchors:** IP-01/IP-02, `INV-CORE-01/02/14`, INV-10, PRIN-004/005/006.
- **Consumed by:** `PCAMG-2000` (generation), `SPEC-GOVERNANCE-COMPILER-RULES`, `SPEC-TRACEABILITY-FRAMEWORK`.
- **Owner:** UCOS Authority Board (custodian: Registry & Discovery center `PGC-*`).

**END SPEC-GOVERNANCE-REGISTRIES · PROPOSED (NOT INSTANTIATED) · APPEND-ONLY · PENDING AUTHORITY BOARD REVIEW.**
