# PAYLOAD-DOMAIN-MODEL

**Artifact:** PDATA-DOM-001
**Program:** UCOS-PDATA-ARCH-001 Field Authority Authoring Program — PHASE D.1 (WS2)
**Authority:** Data Architecture (`UCOS-PDATA-ARCH-001`) as field authority.
**Scope:** For each of the five payload families define Purpose, Semantics, Ownership, Lifecycle, Validation rules, and Relationships. Transport (Prompt 08) and security controls (Prompt 09) are **out of scope** and deliberately excluded.

---

## Cross-cutting principles (apply to every family)

- **Data referenced, never redefined (P6).** Fields derive from implemented substrate ports, the contract catalog, and the data-architecture entity model. No storage, table, key, or wire encoding is decided here.
- **Classification is inherited, not embedded.** Payload sensitivity is inherited at the domain level from `UCOS-PDATA-ARCH-001` / `MC-01` (per catalog "classification inherited"); it is therefore **not** modeled as a payload field.
- **Transport-neutral.** No endpoints, serialization, pagination, or idempotency mechanics (Prompt 08). No authn/authz/controls (Prompt 09).
- **Additive & migration-only.** Definitions are versioned (`1.0.0`); evolution is additive per IP-14/IP-15, INV-10.
- **Open value objects.** Where the substrate types a value as `unknown` or `Record<string,unknown>`, the field authority models it as an **open object** (`additionalProperties: true`) — the closest faithful representation within the supported node kinds (`primitive·object·array·enum·reference`); interior shape stays capability-defined.

---

## F1 — ConfigurationValue (DC-018 / API-018 / DOM-018 / CAP-10)

| Aspect | Definition |
|--------|------------|
| **Purpose** | Represent a configuration value or the resolved, layered configuration set for a scope/capability. |
| **Semantics** | Config is resolved by deep-merging ordered layers (`default → environment → instance`, later wins) per capability. `scope` selects the addressed configuration; `key` narrows to a single value; `value` is the effective structured result. |
| **Ownership** | Owner: DOM-018 Configuration & Metadata (CAP-10). Custodian: Platform (config context). Field authority: UCOS-PDATA-ARCH-001. |
| **Lifecycle** | Created/updated via API-018 `PUT /configuration/{scope}/{key}`; resolved via `GET /configuration/{scope}`; change announced by EVT-018 `ConfigurationChanged`. Mutation is migration-only (Evolution fabric, PI-6). |
| **Validation rules** | `scope` required, non-empty; `key` optional non-empty; `layer` ∈ {default, environment, instance}; `capabilityId` optional non-empty; `value` required (open object). |
| **Relationships** | Resolved per `capabilityId` (CAP-10). Feature flags (F3) are a variability facet of the same domain. Realizes PD-17 Platform / PDE-070 Configuration Set. |

## F2 — MetadataRecord (DC-018 / API-018 / DOM-018 / CAP-10)

| Aspect | Definition |
|--------|------------|
| **Purpose** | Represent one key-addressed metadata entry, optionally described by an attached schema, classified within a metadata class MC-01..13. |
| **Semantics** | Key/value record with prefix-queryable keys; an optional `schema` describes/validates the `value` on write; `metadataClass` situates the record in the MC-01..13 taxonomy. |
| **Ownership** | Owner: DOM-018 (CAP-10). Metadata classes governed by UCOS-INF-ARCH-001. Field authority: UCOS-PDATA-ARCH-001. |
| **Lifecycle** | Written via the metadata store (`put`), read via `GET /metadata/{class}`, queried by prefix; change announced by EVT-018 `MetadataUpdated`. |
| **Validation rules** | `key` required non-empty; `metadataClass` optional matching `^MC-(0[1-9]|1[0-3])$`; `value` required (open object); `schema` optional (open object mirroring the substrate JSON-Schema subset). |
| **Relationships** | Directly realizes the substrate `MetadataRecord` port type. `schema` references the substrate JSON-Schema subset (`contracts/types.ts::JsonSchema`). Classification inherited (MC-01). |

## F3 — FeatureFlag (DC-018 / API-018 / DOM-018 / CAP-10)

| Aspect | Definition |
|--------|------------|
| **Purpose** | Represent a context-resolved variability switch (feature flag) of the Configuration domain. |
| **Semantics** | A flag resolves, for a `context`, to an `enabled` decision and an optional variant `value` (multivariate). Feature flags are the variability facet (MC-13) of Configuration (CAP-10). |
| **Ownership** | Owner: DOM-018 (CAP-10). Field authority: UCOS-PDATA-ARCH-001. **Note:** FeatureFlag has no dedicated substrate port type; its fields are established by domain-authority modeling from API-018 operation intent + EVT-018 + MC-13 (this is the thinnest substrate anchor of the five and is recorded as such). |
| **Lifecycle** | Resolved via `GET /feature-flags/{context}`; change announced by EVT-018 `FeatureFlagChanged`. |
| **Validation rules** | `key` required non-empty; `context` optional non-empty; `enabled` required boolean; `value` optional (open object). |
| **Relationships** | A specialization of the configuration/variability model (shares DOM-018 / CAP-10 with F1). |

## F4 — RegistryArtifact (DC-027 / API-027 / DOM-027 / CAP-19)

| Aspect | Definition |
|--------|------------|
| **Purpose** | Represent one versioned, registered unit of authoritative knowledge of what exists (a capability or contract descriptor). |
| **Semantics** | Identified by (`id`, `version`); typed by `kind` ∈ {capability, contract}; carries the registered `descriptor`; optional `sourceDir` for provider resolution; `status` reflects registration lifecycle. |
| **Ownership** | Owner: DOM-027 Registry (CAP-19). Field authority: UCOS-PDATA-ARCH-001. Directly realizes the implemented `RegistryPort` / `RegistryRecord`. |
| **Lifecycle** | `POST /registry/artifacts` (register) → `registered`; superseded by a newer version → `superseded`; read via `GET /registry/artifacts` and `/{id}`; EVT-027 `ArtifactRegistered` / `ArtifactSuperseded`. |
| **Validation rules** | `id` required non-empty; `version` required semver `^[0-9]+\.[0-9]+\.[0-9]+$`; `kind` ∈ {capability, contract} required; `descriptor` required (open object); `sourceDir` optional; `status` optional ∈ {registered, superseded}. |
| **Relationships** | Realizes LDO-059 / PDE-059 Artifact Descriptor. `descriptor` is owned by descriptor schemas (not redefined). Discovered by DiscoveryRecord (F5). |

## F5 — DiscoveryRecord (DC-027 / API-027 / DOM-027 / CAP-19)

| Aspect | Definition |
|--------|------------|
| **Purpose** | Represent one entry of the discovery index — an artifact discoverable by type. |
| **Semantics** | Projects registered artifacts into a discovery view filtered by `type`; each entry names the discovered `artifactId` and (when resolved) its `version` and `kind`. |
| **Ownership** | Owner: DOM-027 Registry (CAP-19). Field authority: UCOS-PDATA-ARCH-001. Realizes LDO-061 / PDE-061 Discovery Index. |
| **Lifecycle** | Produced by `GET /registry/discovery?type=`; EVT-027 `ArtifactDiscovered`. |
| **Validation rules** | `type` required non-empty; `artifactId` required non-empty; `version` optional semver; `kind` optional ∈ {capability, contract}. |
| **Relationships** | References RegistryArtifact (F4) by `artifactId` (modeled as a plain identifier field, **not** a reference node, to keep ownership acyclic). **Wiring/endpoint is intentionally omitted** (transport = Prompt 08). |

---

## Ownership & relationship integrity (summary)

```
DOM-018 (CAP-10)                    DOM-027 (CAP-19)
  ├─ ConfigurationValue (F1)          ├─ RegistryArtifact (F4) ──referenced-by──┐
  ├─ MetadataRecord     (F2)          └─ DiscoveryRecord   (F5) ────────────────┘ (by artifactId, acyclic)
  └─ FeatureFlag        (F3)  (variability facet of F1)
```

- Single owning domain per family (no shared/duplicated ownership).
- One cross-family relationship (F5 → F4) expressed by a plain id field → **no circular ownership**, **no reference cycle**.
- Classification inherited at the domain level (MC-01), never embedded as a field.

**Traceability:** `UCOS-CONTRACT-CAT-001`; `packages/platform-runtime/src/{meta-core/ports.ts, configuration-runtime, metadata-runtime, registry-runtime}`; `UCOS-INF-ARCH-001` (MC-01..13); `docs/data-architecture/*` (LDO-059/061, PDE-059/061/070); AUTH-004/007/009.
