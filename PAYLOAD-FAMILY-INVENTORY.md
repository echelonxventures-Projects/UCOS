# PAYLOAD-FAMILY-INVENTORY

**Artifact:** PDATA-INV-001
**Program:** UCOS-PDATA-ARCH-001 Field Authority Authoring Program — PHASE D.1 (WS1)
**Authority:** Data Architecture (`UCOS-PDATA-ARCH-001`) as field authority; subordinate to AUTH-004/007/009, UCOS-CONST-001 (Art. IV contract-first).
**Scope:** Discover every payload family referenced by Prompt-05 / Prompt-08 / Prompt-09 and validate registry references. **Discovery only — no fields authored in this workstream.**

---

## 1. Work items in scope (from `registry/program/work-items.json`)

| Work item | Title | Declared (at start) | Required evidence | Governance gate | Constitutional constraint |
|-----------|-------|---------------------|-------------------|-----------------|---------------------------|
| Prompt-05 | Payload Authoring (5 constructs) | OPEN | EV-PROMPT-05 | GATE-DOC-001 | Payload authority = Prompt 07; **no fabricated schemas beyond contract authority** |
| Prompt-08 | Operation-Payload Binding | OPEN | EV-PROMPT-08 | GATE-DOC-001 | Depends on Prompt-05 payloads |
| Prompt-09 | Error Model Registry | OPEN | EV-PROMPT-09 | GATE-DOC-001 | Depends on Prompt-08 bindings |

Dependency chain (from `dependencies.json`): `Prompt-09 → Prompt-08 → Prompt-05`.

---

## 2. Payload families referenced

Prompt-05 names **five** payload families directly. Prompt-08 (operation→payload binding) and
Prompt-09 (error model registry) do **not** introduce new payload families — they consume the same
five once authored (binding operations to them; attaching error models). The complete referenced set:

| # | Family | Owning data contract | API contract | Registry binding key (generator resolution) |
|---|--------|----------------------|--------------|---------------------------------------------|
| F1 | ConfigurationValue | UCOS-DATA-CONTRACT-018 (DC-018) | API-018 | `UCOS-DATA-CONTRACT-018/ConfigurationValue` |
| F2 | MetadataRecord | UCOS-DATA-CONTRACT-018 (DC-018) | API-018 | `UCOS-DATA-CONTRACT-018/MetadataRecord` |
| F3 | FeatureFlag | UCOS-DATA-CONTRACT-018 (DC-018) | API-018 | `UCOS-DATA-CONTRACT-018/FeatureFlag` |
| F4 | RegistryArtifact | UCOS-DATA-CONTRACT-027 (DC-027) | API-027 | `UCOS-DATA-CONTRACT-027/RegistryArtifact` |
| F5 | DiscoveryRecord | UCOS-DATA-CONTRACT-027 (DC-027) | API-027 | `UCOS-DATA-CONTRACT-027/DiscoveryRecord` |

**Total: 5 families across 2 data contracts (DC-018 ×3, DC-027 ×2).**

---

## 3. Registry-reference validation

### 3.1 Catalog references (source of truth: `contracts/catalog/*.contract.json`)
- **API-018** (`UCOS-API-CONTRACT-018`, DC-018) declares `payloadFamilies: ["ConfigurationValue", "MetadataRecord", "FeatureFlag"]`; `fieldLevelSchema: "NOT DEFINED IN CATALOG (owned by Prompt 05 / UCOS-PDATA-ARCH-001)"`. ✅ matches F1–F3.
- **API-027** (`UCOS-API-CONTRACT-027`, DC-027) declares `payloadFamilies: ["RegistryArtifact", "DiscoveryRecord"]`; same deferral note. ✅ matches F4–F5.
- Contract catalog `UCOS-CONTRACT-CATALOG.md` §C confirms `UCOS-DATA-CONTRACT-018 → ConfigurationValue, MetadataRecord, FeatureFlag` and `UCOS-DATA-CONTRACT-027 → RegistryArtifact, DiscoveryRecord`. ✅

### 3.2 Field-schema registry references (source of truth: `contracts/field-schemas/`)
At start of PHASE D.1 the registry was **empty by design** (README); the sufficiency engine reported
DTOs/Validators **BLOCKED** for both contracts, and F1–F5 were recorded as **Content** blockers owned by
`UCOS-PDATA-ARCH-001` (`WI-09-REPOSITORY-DISCOVERY-REPORT`, `WI08-CATALOG-GAP-INVENTORY`). ✅ consistent.

### 3.3 Binding-key correctness
Each family resolves via `resolvePayloadFamily(family, dataContract)` keyed `${dataContract}/${family}`.
The five keys in §2 are the exact strings the generator's `fieldSchemaRegistry` will look up. ✅

**Validation result: all references consistent across catalog, contract catalog, gap inventory, and
the field-schema registry layer. Zero dangling references. Zero unlisted families.**

---

## 4. Authoritative grounding sources identified (for WS2/WS3)

| Family | Primary authoritative anchors |
|--------|-------------------------------|
| ConfigurationValue | API-018 `/configuration/{scope}`, `/configuration/{scope}/{key}`; substrate `ConfigurationPort` (`DEFAULT_LAYER_ORDER`, `resolve → Record<string,unknown>`); PD-17 Platform / PDE-070 Configuration Set; MC-01 classification (inherited) |
| MetadataRecord | API-018 `/metadata/{class}`; substrate `MetadataPort` / `MetadataRecord {key,value,schema}`; MC-01..13 (UCOS-INF-ARCH-001) |
| FeatureFlag | API-018 `/feature-flags/{context}`; EVT-018 `FeatureFlagChanged`; MC-13 variability; DOM-018 / CAP-10 (thinnest substrate anchor — domain-authority modeling) |
| RegistryArtifact | API-027 `/registry/artifacts*`; substrate `RegistryPort` / `RegistryRecord {id,version,kind,descriptor,sourceDir}`; LDO-059 / PDE-059 Artifact Descriptor; EVT-027 `ArtifactRegistered/Superseded` |
| DiscoveryRecord | API-027 `/registry/discovery?type=`; LDO-061 / PDE-061 Discovery Index; substrate `RegistryPort` resolve/list; EVT-027 `ArtifactDiscovered` |

---

## 5. Conclusion

Five payload families, two data contracts, all references validated and internally consistent. No
family is orphaned; no extra family is implied by Prompt-08/09. This inventory is the authorized basis
for the domain model (WS2) and field-authority specification (WS3).

**Traceability:** `UCOS-CONTRACT-CAT-001`, `contracts/catalog/api-018|027.contract.json`,
`contracts/field-schemas/README.md`, `WI08-CATALOG-GAP-INVENTORY.md`, `WI-09-REPOSITORY-DISCOVERY-REPORT.md`,
`registry/program/{work-items,dependencies,evidence-registry}.json`.
