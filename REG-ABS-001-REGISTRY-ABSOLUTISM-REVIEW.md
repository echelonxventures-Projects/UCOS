# REG-ABS-001 — Registry Absolutism Review

**Phase:** UA-03 — Registry Absolutism Review
**Artifact:** `REG-ABS-001`
**Mode:** REVIEW / ANALYSIS ONLY — no code, no runtime change, no authorization, no lock release, no
ratified-artifact mutation. Append-only.
**Question under review:** *Can every runtime object be represented as a registry object?*
**Subjects reviewed:** Knowledge · Ontology · Memory · Agents · Policies · Economies · Governance · Civilizations
**Governance status:** Article IX generation lock unchanged; INV-1..13 unchanged; AD-0014 (Ω∞ deferral)
unchanged. This review evaluates the existing architecture; it enrolls nothing and authorizes nothing.

---

## 1. Method & Evidence Base

Determination is grounded in direct inspection of the implemented substrate and control fabrics
(`packages/platform-runtime/src/**`) plus the ratified/design architecture set, not on prior report
summaries.

Substrate storage surfaces (`meta-core/ports.ts`):

- **`RegistryPort`** — versioned records `{ id, version, kind: "capability" | "contract", descriptor }`,
  keyed `id@version`; resolve-by-range. (`registry-runtime/registry.ts`)
- **`MetadataPort`** — schema-validated key/value records with prefix query. Every fabric construct is
  persisted here under a reserved keyspace prefix. (`metadata-runtime/metadata-store.ts`)
- **`ConfigurationPort`** — ordered, deep-merged configuration layers.

Verified fabric persistence pattern (identical across fabrics — objects are **records**, engines only
**interpret** them):

| Fabric (implemented) | Object representation | Keyspace | Evidence |
|---|---|---|---|
| Policy | data records, zero policy logic compiled | `policy:*` | `control/policy/policy-registry.ts` |
| Governance | process / approval / certification records; nothing pre-approved in code | `governance:process|approval|certification:*` | `control/governance/governance-registry.ts` |
| Knowledge | versioned records; write only via Evolution Fabric | `knowledge:record:*` | `control/knowledge/knowledge-store.ts` |
| Ontology | entity/relationship/taxonomy records + derived graph | `ontology:*` | `control/ontology/*` |
| Memory | tiered records | `memory:*` | `control/memory/*` |
| Identity/Trust | principal + trust records; `kind` is an **open string** | `identity:*` / federation keyspace | `control/types.ts`, `control/identity/*` |
| Evolution / Federation | governed change units / federated assertions | `evolution:*` / `federation:<nodeId>:*` | `control/evolution/*`, `control/federation/*` |

Finding: at the **object/definition layer**, the system is registry/metadata-absolute — every domain
entity is a `RegistryRecord` or a `MetadataRecord`. `IdentityRecord.kind` being an open string (not a
fixed enum) is direct evidence the model was built to represent unknown-future object classes as records
rather than as hard-coded types.

---

## 2. Per-Subject Determination

| # | Subject | Registry/metadata representable? | Runtime realized today? | Verdict |
|---|---------|:---:|:---:|---|
| 1 | **Knowledge** | YES — `knowledge:record:*` metadata records | YES (PI-7 implemented, ratified) | REGISTRY-DRIVEN |
| 2 | **Ontology** | YES — `ontology:*` records; graph is a pure projection | YES (PI-8 implemented) | REGISTRY-DRIVEN |
| 3 | **Memory** | YES — `memory:*` tiered records | Implemented, but ratification REJECTED / authority chain contested (PHASE 18.3) | REGISTRY-DRIVEN (object model) · GOVERNANCE GAP |
| 4 | **Agents** | YES — as `identity` records (`kind:"agent"`) and, by design, `intelligence:*` records | Intelligence/cognition Fabric NOT implemented / NOT READY (PHASE 19.3) | **GAP** — not realized as registry-backed runtime |
| 5 | **Policies** | YES — `policy:*` data records; evaluator compiles no policy logic | YES (PI-4 implemented) | REGISTRY-DRIVEN |
| 6 | **Economies** | YES by design — `architecture/economic`, CIV-C10, UEA-0010 | No implemented runtime fabric (design only) | **GAP** — not realized as registry-backed runtime |
| 7 | **Governance** | YES — process/approval/certification records | YES (implemented) | REGISTRY-DRIVEN |
| 8 | **Civilizations** | YES by design — `civilization:*` model constructs | Conceptual only; AD-0014 deferred | **GAP** — deferred; not realized |

---

## 3. Hard-Coding Register (what cannot be a registry object)

Registry absolutism in the *absolute* sense is architecturally unreachable: a registry that describes
everything still requires a non-registry interpreter, cryptography, storage, and a constitutional floor.
These are **bounded, enumerable, and by-design** — not defects — but they are the reason the honest
answer is not "fully registry driven."

| ID | Hard-coded element | Why it cannot be a registry object |
|----|--------------------|-------------------------------------|
| HC-1 | Meta-Core kernel + engines (dependency-resolver, composition, execution, lifecycle, validation) | The interpreter of registry records; bootstrapping it from the registry is infinite regress |
| HC-2 | Fabric engines (policy-evaluator, semantic-constraint-engine, memory consolidation/recall/reconciliation, evolution orchestrator/transaction-manager, resolvers, state-machines, query engines) | Executable interpreters of the records; behavior, not data |
| HC-3 | Provider / executor code modules (capability behavior) | Descriptor is a registry object; the executed function is code referenced *by* the registry |
| HC-4 | Cryptographic primitives (Ed25519 assertions, SHA-256 hash-chaining; `node:crypto`) | Trust root; cannot be data-defined without breaking the trust anchor |
| HC-5 | Storage adapters (`InMemoryRegistry`/`MetadataStore`/Configuration) + JSON-schema validator | They *are* the registry substrate |
| HC-6 | Reserved keyspace/prefix constants + descriptor schemas (`policy:`, `governance:*`, `knowledge:record:`, `ontology:`, `memory:`, `federation:<nodeId>:`) | Naming/addressing convention the interpreter must know a priori |
| HC-7 | Non-waivable constitutional floor: S1/S3/S4, deny-by-default, INV-1..13 | **Intentionally** not registry-overridable (Constitution / AUTH-008); registry-overridability here would be a security defect |

---

## 4. Determination

The **object/definition layer is registry/metadata absolute** — every domain entity across the
implemented fabrics is a registry or metadata record, and the open-`kind` identity model plus the
uniform `<fabric>:*` keyspace convention were explicitly designed to represent unknown-future object
classes as data rather than code. This is a strong, verified result.

However, "every *runtime* object can be represented as a registry object" is **false** for two reasons:

- **Class A (by-design, permanent):** an irreducible non-registry substrate must be hard-coded —
  interpreter/engine layer, provider code, cryptographic primitives, storage adapters, keyspace
  conventions, and the non-waivable constitutional floor (HC-1..HC-7). These are correct, bounded, and
  must not be registry-driven.
- **Class B (status, closeable):** three subjects are **not yet realized** as registry-backed runtime
  objects — **Agents** (Intelligence Fabric not implemented), **Economies** (design only), and
  **Civilizations** (conceptual, AD-0014 deferred); and **Memory**'s records exist but its ratification
  is REJECTED / authority chain contested.

Per the program's standing discipline of honest, non-optimistic classification, both classes are
reported rather than rounded up.

---

## OUTPUT

**REGISTRY GAPS FOUND**

- *Object-model verdict:* registry/metadata-absolute at the definition layer (Knowledge, Ontology,
  Policies, Governance fully registry-driven; Memory registry-driven but governance-gapped).
- *Absolute verdict:* NOT fully registry driven — HC-1..HC-7 must remain hard-coded (Class A, by design),
  and Agents / Economies / Civilizations are not yet realized as registry-backed runtime objects (Class B).

> Review artifact only. No code, runtime, authorization, or lock release. INV-1..13, AD-0014, and the
> Article IX generation lock are unchanged. Class B gaps are closeable through the normal
> authorization → implementation → ratification path; Class A items are the intended, permanent
> bootstrap/constitutional floor and are not remediation targets.
