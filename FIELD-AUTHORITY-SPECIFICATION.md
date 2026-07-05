# FIELD-AUTHORITY-SPECIFICATION

**Artifact:** PDATA-FIELD-001 (evidence artifact for EV-PROMPT-05)
**Program:** UCOS-PDATA-ARCH-001 Field Authority Authoring Program — PHASE D.1 (WS3)
**Authority:** Data Architecture (`UCOS-PDATA-ARCH-001`) as field authority; GATE-DOC-001.
**Conformance:** every schema conforms to `contracts/schema/field-schema.schema.json` (`ucos-field-schema/1.0.0`); registry `validate()` = **PASS**.
**Scope:** canonical field-level definitions for the five payload families. **No payloads, DTOs, validators, or code are generated here** — only the authoritative field architecture.

---

## Legend

- **Req** — required (`true`) / optional (`false`).
- **Type** — meta-schema node kind + scalar/enumeration.
- **Constraints** — transport-neutral constraint set (subset of `minLength/maxLength/pattern/enum values`).
- **Source authority** — the authoritative artifact each field is derived from (no field is invented without an anchor; where the anchor is domain-level semantics rather than a substrate type, it is stated explicitly).
- **Open object** — `{kind:object, properties:[], additionalProperties:true}`: a faithful representation of an arbitrary structured value under the supported node kinds.

---

## F1 — ConfigurationValue → `UCOS-DATA-CONTRACT-018/ConfigurationValue` v1.0.0

| Field | Type | Req | Constraints | Description | Source authority |
|-------|------|:---:|-------------|-------------|------------------|
| `scope` | primitive string | ✅ | minLength 1 | Configuration scope selector | API-018 `GET /configuration/{scope}` |
| `key` | primitive string | ⬜ | minLength 1 | Single configuration key within scope | API-018 `PUT /configuration/{scope}/{key}` |
| `capabilityId` | primitive string | ⬜ | minLength 1 | Owning capability (CAP-10) | `ConfigurationPort` (keyed per capabilityId) |
| `layer` | enum string | ⬜ | {default, environment, instance} | Contributing resolution layer | `ConfigurationPort.DEFAULT_LAYER_ORDER` |
| `value` | object (open) | ✅ | — | Effective configuration value/set | `ConfigurationPort.resolve → Record<string,unknown>` |

## F2 — MetadataRecord → `UCOS-DATA-CONTRACT-018/MetadataRecord` v1.0.0

| Field | Type | Req | Constraints | Description | Source authority |
|-------|------|:---:|-------------|-------------|------------------|
| `key` | primitive string | ✅ | minLength 1 | Metadata key (prefix-queryable) | substrate `MetadataRecord.key` |
| `metadataClass` | primitive string | ⬜ | pattern `^MC-(0[1-9]\|1[0-3])$` | Metadata class MC-01..13 | API-018 `GET /metadata/{class}` + UCOS-INF-ARCH-001 |
| `value` | object (open) | ✅ | — | Metadata value | substrate `MetadataRecord.value` (unknown → open object) |
| `schema` | object (open) | ⬜ | — | Optional JSON-Schema describing value | substrate `MetadataRecord.schema` + `MetadataPort.validate` |

## F3 — FeatureFlag → `UCOS-DATA-CONTRACT-018/FeatureFlag` v1.0.0

| Field | Type | Req | Constraints | Description | Source authority |
|-------|------|:---:|-------------|-------------|------------------|
| `key` | primitive string | ✅ | minLength 1 | Feature flag identifier | DOM-018/CAP-10 variability; EVT-018 `FeatureFlagChanged` |
| `context` | primitive string | ⬜ | minLength 1 | Resolution context | API-018 `GET /feature-flags/{context}` |
| `enabled` | primitive boolean | ✅ | — | Active decision in context | Feature-flag semantics (API-018 "resolve feature flags for context") |
| `value` | object (open) | ⬜ | — | Optional variant payload (multivariate) | MC-13 variability + ConfigurationPort value model |

> **Authority note (F3):** FeatureFlag is the only family without a first-class substrate port type.
> Its four fields are established by **domain-authority modeling** from the API-018 operation intent,
> the EVT-018 event, and the MC-13 variability class. This is recorded transparently; it is authoring
> under the data-architecture authority, not fabrication beyond authority.

## F4 — RegistryArtifact → `UCOS-DATA-CONTRACT-027/RegistryArtifact` v1.0.0

| Field | Type | Req | Constraints | Description | Source authority |
|-------|------|:---:|-------------|-------------|------------------|
| `id` | primitive string | ✅ | minLength 1 | Unique artifact id | substrate `RegistryRecord.id` |
| `version` | primitive string | ✅ | pattern `^[0-9]+\.[0-9]+\.[0-9]+$` | Semantic version | substrate `RegistryRecord.version` (SemVer) |
| `kind` | enum string | ✅ | {capability, contract} | Artifact kind | substrate `RegistryRecord.kind` |
| `descriptor` | object (open) | ✅ | — | Registered descriptor payload | substrate `RegistryRecord.descriptor` |
| `sourceDir` | primitive string | ⬜ | minLength 1 | Descriptor source directory | substrate `RegistryRecord.sourceDir` |
| `status` | enum string | ⬜ | {registered, superseded} | Registration lifecycle state | EVT-027 `ArtifactRegistered/Superseded` |

## F5 — DiscoveryRecord → `UCOS-DATA-CONTRACT-027/DiscoveryRecord` v1.0.0

| Field | Type | Req | Constraints | Description | Source authority |
|-------|------|:---:|-------------|-------------|------------------|
| `type` | primitive string | ✅ | minLength 1 | Discovery type filter | API-027 `GET /registry/discovery?type=` |
| `artifactId` | primitive string | ✅ | minLength 1 | Discovered artifact id | substrate `RegistryRecord.id` |
| `version` | primitive string | ⬜ | pattern `^[0-9]+\.[0-9]+\.[0-9]+$` | Discovered artifact version | substrate `RegistryRecord.version` |
| `kind` | enum string | ⬜ | {capability, contract} | Discovered artifact kind | substrate `RegistryRecord.kind` |

---

## Deliberate exclusions (authority boundaries honored)

| Excluded | Why | Owning authority |
|----------|-----|------------------|
| Endpoints / URLs / wiring targets on DiscoveryRecord | Transport form is deferred | Prompt 08 |
| Serialization / wire encoding / pagination / idempotency mechanics | Transport | Prompt 08 |
| authn/authz, key material, control fields | Security controls | Prompt 09 |
| Error model fields | Separate registry | Prompt 09 / Prompt-09 work item |
| `classification` as a payload field | Inherited at domain level (MC-01) | UCOS-PDATA-ARCH-001 (inheritance, not embedding) |
| NFR values (latency/throughput/etc.) | ASR-ratification pending (N-1) | ASR ratification |

## Field-count summary

| Family | Fields (required / optional) |
|--------|------------------------------|
| ConfigurationValue | 5 (2 / 3) |
| MetadataRecord | 4 (2 / 2) |
| FeatureFlag | 4 (2 / 2) |
| RegistryArtifact | 6 (4 / 2) |
| DiscoveryRecord | 4 (2 / 2) |
| **Total** | **23 fields (12 required / 11 optional)** |

Physical schema artifacts: `contracts/field-schemas/{configurationvalue,metadatarecord,featureflag,registryartifact,discoveryrecord}.fieldschema.json`.

**Traceability:** `contracts/schema/field-schema.schema.json`; `packages/platform-runtime/src/meta-core/ports.ts` and the config/metadata/registry runtimes; `UCOS-CONTRACT-CAT-001`; `UCOS-INF-ARCH-001` (MC-01..13); AUTH-004/007/009; UCOS-CONST-001 (Art. IV).
