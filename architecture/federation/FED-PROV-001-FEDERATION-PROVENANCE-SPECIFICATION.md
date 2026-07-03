# FED-PROV-001 — UCOS Federation Provenance Specification

| Field | Value |
|-------|-------|
| Artifact | **FED-PROV-001 — Federation Provenance Specification** |
| Workstream | FND-FED-03 (PHASE 11.3 · PI-5.0) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | PI5-REV-004 (architecture sufficiency); FED-GOV-001; FED-SEC-001 |
| Realizes gap closure | Threats T4, T11, T12 (primary); supports T1, T3, T9 |
| **Hard constraint** | **NO modification of `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts`** |

> Provenance must answer, for every federated artifact: **who asserted it, from which node, verified by
> which authority, and does the local domain own it?** The controlling design decision (PI5-REV-004) is
> that provenance is carried **by convention** — via id-namespacing, `descriptor.metadata`, and reserved
> metadata key-prefixes — **not** by adding fields to `RegistryRecord`/`MetadataRecord`, which would
> require editing the prohibited `src/meta-core/ports.ts`. This specification proves the constraint is
> satisfiable.

---

## 1. Provenance invariants

- **PRV-1 Origin on every federated artifact.** Every artifact crossing the boundary carries an
  attributable origin (home node + issuing authority + verification result).
- **PRV-2 Local sovereignty (shadowing).** On any id collision, the **local** artifact is authoritative;
  a foreign artifact may never shadow or override a local one. Closes **T11/T12**.
- **PRV-3 Namespace isolation.** Foreign artifacts live in an origin-namespaced keyspace, never merged into
  the local keyspace. Closes **T4**.
- **PRV-4 Verified-before-stored.** No federated artifact is persisted until its FED-SEC-001 assertion is
  cryptographically verified and in-boundary.
- **PRV-5 No core-dir change.** Provenance is encoded in **data the substrate already accepts**
  (descriptor metadata, metadata keys/values, capability ids) — see §3 feasibility proof.

## 2. The `Provenance` descriptor (carried in data, not in ports)

A single canonical provenance envelope is embedded in artifact **data**:
```
Provenance {
  origin: "local" | { nodeId, homeDomain },
  assertedBy?: authorityId,        // FED-GOV-C3 authority
  assertionRef?: string,           // FED-SEC-001 assertion id (for audit linkage)
  verifiedAt?: number,
  signatureRef?: string            // verification evidence, keyRef (S3: no key material inline)
}
```
- For **capabilities/contracts**: placed in `CapabilityDescriptor.metadata.provenance` (the descriptor
  `metadata` field already exists and is free-form data — no type change).
- For **metadata/policy/identity/governance records**: placed as a `provenance` property on the stored
  record value and mirrored in the key prefix (§4).

## 3. Feasibility proof — zero prohibited-core-dir change

| Provenance kind | Encoding mechanism | Existing accepting surface | Core-dir change? |
|-----------------|--------------------|----------------------------|:----------------:|
| **Identity provenance** | `IdentityRecord.attributes.provenance` + id namespacing `nodeId::identityId` | `attributes` is free-form (`Record<string,unknown>`) in `control/types.ts` (control dir) | **No** |
| **Capability provenance** | `CapabilityDescriptor.metadata.provenance` + id namespacing `nodeId::cap.x` | `metadata?: Record<string,unknown>` already on descriptor (contracts data, not code) | **No** |
| **Registry provenance** | Namespaced capability/contract `id` + `descriptor.metadata.provenance`; foreign records held in a **separate federated registry instance** behind `RegistryPort` | `RegistryPort` is an interface; a second adapter instance is composition, not a port change | **No** |
| **Metadata provenance** | Reserved key prefix `federation:<nodeId>:<kind>:<id>` + `provenance` property on the value | `MetadataPort.put(key, value)` accepts any key/value | **No** |
| **Policy provenance** | `PolicyRecord.description`/embedded `provenance` in value + `federation:` key prefix; foreign policies restricted to `effect: deny` (FED-GOV-C6) | policy stored via `MetadataPort`; evaluator reads `list()` | **No** |
| **Certification provenance** | `CertificationRecord.authority` already names the issuer; extend value with `provenance` + verify to CA (FED-SEC-001) | governance records via `MetadataPort` | **No** |

**Conclusion:** All six provenance kinds are expressible using surfaces the substrate already exposes as
**data** (`descriptor.metadata`, `IdentityRecord.attributes`, metadata keys/values) or as **composition**
(a second `RegistryPort` adapter for foreign records). **`src/meta-core/ports.ts` and the other four
prohibited dirs are untouched.**

## 4. Namespacing & key scheme

- **Capability/contract ids:** `<homeDomain>::<localId>` (e.g., `nodeB::cap.pricing`). Local ids never
  contain `::`, guaranteeing collision-free coexistence and making local-shadowing (PRV-2) a simple
  precedence rule at resolution time.
- **Metadata keys:** local control records keep the PI-4 prefixes (`identity:`, `policy:`,
  `governance:*`); **federated** records use `federation:<nodeId>:identity:<id>` etc. — a disjoint prefix
  space, so `query("identity:")` (local) never returns foreign records (PRV-3). Closes **T4**.
- **Resolution precedence (PRV-2):** local lookup first; federated lookup only on local miss and only for
  in-boundary, verified, non-revoked origins.

## 5. Anti-poisoning enforcement

- **Registry poisoning (T11):** foreign records are namespaced and held separately; a foreign
  higher-version can never shadow a local id (different namespace). Resolution of a *local* id ignores
  federated registries entirely.
- **Capability impersonation (T12):** capability identity = `(namespaced id, contract-hash, provenance
  signature)`; a foreign capability claiming a local id is impossible (namespace) and claiming a foreign
  id requires a verified provenance signature from an in-boundary authority.
- **Metadata poisoning (T4):** disjoint key prefixes + verified-before-stored (PRV-4) + validate-on-write
  (already enforced by the metadata runtime).

## 6. Traceability
- **Refines:** PI5-REV-004, FED-GOV-001, FED-SEC-001; IP-04 (metadata-first, no hardcoding).
- **Consumed by:** FED-AUD-001 (provenance in audit records), FED-ARCH-001, future PI-5 build.
- **Owner:** UCOS Authority Board (Architecture).

**END FED-PROV-001 — DESIGN · READY FOR RATIFICATION · ZERO PROHIBITED-CORE-DIR CHANGE · NO IMPLEMENTATION AUTHORIZED.**
