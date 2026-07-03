# GOV-ARCH-001 — UCOS Governance Fabric Architecture Specification

| Field | Value |
|-------|-------|
| Artifact | **GOV-ARCH-001 — Governance Fabric Architecture Specification** |
| Workstream | FND-GOV-02 (PHASE 25 · PI-14.0 Governance Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | GOV-GOV-001; AD-0016 substrate seams; AD-0017 control plane (PI-4 PolicyEvaluator/governance runtime/audit); AD-0018 federation; AD-0019 evolution; AD-0020 knowledge |
| Realizes | The instrument/empowerment/operational architecture; evolution-routed mutation; zero-core-dir-change proof |
| **Hard constraint** | **NO change to `src/meta-core`, `src/registry-runtime`, `src/metadata-runtime`, `src/configuration-runtime`, `src/contracts`** |

> Defines how the Governance Fabric instruments (Law/Regulation/Policy), empowerment constructs
> (Authority/Delegation/Rights/Obligations), and operational processes (Enforcement/Compliance/Dispute
> Resolution) are realized **entirely within the control layer** (`src/control/governance/*`), reusing the
> ratified substrate ports, the PI-4 Control Plane / Policy Enforcement Point, the PI-6 Evolution Fabric, the
> AD-0018 federation seams, and the PI-4 audit sink. The ratified synchronous decision path stays unchanged;
> the existing **185/185** tests remain valid. No implementation is authorized.

---

## 1. Architectural position

The Governance Fabric is a **control-layer fabric**, peer to Federation (AD-0018), Evolution (AD-0019), and
Knowledge (AD-0020), that **operationalizes** the Authority Layer + Constitution over the PI-2/PI-3 substrate.
It is the runtime home of the normative instruments the PI-4 Control Plane already enforces:

```
                     ┌──────────────────── control layer (src/control/*) ────────────────────┐
  request ─▶ ControlPlane (PI-4: authn → trust → policy → governance → kernel.execute)         │
                     │                                                                         │
                     │   Governance Fabric (NEW src/control/governance/*)                      │
                     │     enact · certify · ratify · grant · delegate · enforce · attest ·    │
                     │     adjudicate · reconcile — over Law/Regulation/Policy + Auth/Rights    │
                     │        │ durable mutation │ enforcement │ federated governance │ audit    │
                     ▼        ▼                  ▼              ▼                      ▼         │
             PolicyEvaluator (PI-4)   Evolution Fabric (AD-0019)   Federation (AD-0018)   FederatedAuditLog │
                     └────────────────────────────────────────────────────────────────────────┘
                                                     │ (existing sync ports only)
                     ┌───────────────────────────────▼───────────────────────────────┐
                     │  Substrate (PROHIBITED core dirs — UNCHANGED)                   │
                     │  MetadataPort · RegistryPort · ConfigurationPort · MetaCoreKernel │
                     └─────────────────────────────────────────────────────────────────┘
```

- Governance records are **metadata-first**: every instrument/authority/right/obligation/compliance/dispute
  record is a value written through the existing `MetadataPort.put(key, value)` under the `governance:*`
  keyspace (GOV-GOV-001 §2/§3/§4).
- Governance **configuration** (precedence policy, quorum thresholds, delegation depth caps, reconciliation
  policy) is resolved through the existing `ConfigurationPort` layered store — no hardcoded governance (IP-04).
- Governance **enforcement** reuses the ratified PI-4 `PolicyEvaluator` unchanged: ratified **Policy**
  instruments are the `PolicyRecord`s the evaluator already consumes (deny-by-default, deny-overrides-allow).
  The fabric adds **no** new decision engine.

## 2. Construct realization (all in-data, all metadata-first)

| Construct | Key scheme | Store surface | Mutation path | Federation |
|-----------|-----------|---------------|---------------|:----------:|
| Law (`GOV-INST-LAW`) | `governance:law:<id>:<version>` | `MetadataPort` | **Evolution Fabric** (proposed→ratified→active) | classification/scope-gated |
| Regulation (`GOV-INST-REG`) | `governance:regulation:<id>:<version>` | `MetadataPort` | **Evolution Fabric** | scope-gated |
| Policy (`GOV-INST-POL`) | `governance:policy:<id>:<version>` | `MetadataPort` (consumed by PI-4 PolicyEvaluator) | **Evolution Fabric** | scope-gated |
| Authority (`GOV-EMP-AUTH`) | `governance:authority:<id>` | `MetadataPort` + signed assertion | Evolution + Approval-Required grant | inbound (deny-only) |
| Delegation (`GOV-EMP-DEL`) | `governance:delegation:<id>` | `MetadataPort` | Evolution + cycle/depth guard | inbound (deny-only) |
| Rights (`GOV-EMP-RIGHT`) | `governance:right:<subjectRef>:<id>` | `MetadataPort` | Evolution + Approval-Required grant | scope-gated |
| Obligations (`GOV-EMP-OBLIG`) | `governance:obligation:<obligorRef>:<id>` | `MetadataPort` | Evolution; status transitions audited | scope-gated |
| Compliance (`GOV-GOV-O2`) | `governance:compliance:<subjectRef>:<id>` | `MetadataPort` + signed verdict | append-only attestation | export-only |
| Dispute (`GOV-GOV-O3`) | `governance:dispute:<id>` | `MetadataPort` + signed ruling | Evolution if ruling changes an instrument | export-only |
| Federated governance | `federation:<nodeId>:governance:<kind>:<id>` | separate namespace; verified-before-stored | ingest via federation verifier; deny-only shadow | inbound |

- **Disjoint keyspaces** guarantee `query("governance:")` (local) never returns foreign governance, and each
  construct is independently addressable. Disjoint from `memory:*`, `knowledge:*`, `ontology:*`.
- **Versioning** for instruments uses supersession (new `<version>`), never in-place edit (IP-14); a repealed
  instrument transitions to a terminal `repealed` state and is retained for audit (never hard-deleted).

## 3. Modules (planned; control layer only)

Proposed `src/control/governance/*` module set (names indicative; realized only under a future PI-14 act):

| Module | Responsibility |
|--------|----------------|
| `governance-unit.ts` / `governance-record.ts` | Instrument/grant unit + versioned, provenance-bearing record construction |
| `governance-namespace.ts` | Reserved `governance:*` / `federation:*:governance:*` key scheme + disjointness guards |
| `instrument-registry.ts` | Metadata-backed Law/Regulation/Policy registry + precedence (GOV-GOV-C1) |
| `instrument-index.ts` | Index by kind/scope/version/precedence (GOV-GOV-C2) |
| `precedence-resolver.ts` | Deterministic precedence → specificity → recency conflict resolution; fail-closed (GGP-6) |
| `authority-registry.ts` / `delegation-registry.ts` | Enumerated authorities + bounded, non-circular delegations (GOV-GOV-C7); reuses PI-2 dependency resolver for cycle detection |
| `rights-obligations-registry.ts` | Governed rights + obligations with status (GOV-GOV-C8) |
| `enforcement-binder.ts` | Binds ratified Policy to the PI-4 PolicyEvaluator/PEP (GOV-GOV-C9) — no new evaluator |
| `compliance-authority.ts` | Signed compliance verdicts against instruments/obligations (GOV-GOV-C10) |
| `dispute-resolution-engine.ts` | Dispute intake, SoD-checked adjudication, ruling record (GOV-GOV-C11) |
| `governance-certification-authority.ts` / `governance-ratification-authority.ts` / `governance-revocation-authority.ts` | Signed, revocable authorities; SoD (C5/C6/C12) |
| `federated-governance-guard.ts` | Boundary/authority verification for inbound governance (reuse federation crypto) |
| `governance-lifecycle.ts` / `governance-state-machine.ts` | Guarded transition table + per-unit state |
| `governance-audit.ts` | Thin wrapper over `FederatedAuditLog` (AD-0018) for governance events |
| `governance-evolution-adapter.ts` | Builds evolution units targeting `governance:` (AD-0019) |
| `bootstrap.ts` / `index.ts` | Assembly + barrel export |

- **Reuse, not reinvent:** enforcement reuses the PI-4 `PolicyEvaluator`; certification/ratification/
  revocation/audit reuse federation + evolution primitives; **no custom cryptography** (reuse
  `src/control/federation/assertions.ts`).

## 4. Enact/enforce pattern (async enactment, sync enforcement)

Governance enactment (drafting, certifying, ratifying instruments; granting authority/rights) is modeled as
**async, evolution-routed** change, decoupled from the synchronous enforcement path (identical pattern to
FED-ARCH-001 / MEM-ARCH-001, already ratified):

```
   proposal/amendment ─▶ governance-evolution-adapter (async) ─▶ certify (trace/precedence/S-safe) ─▶
                          Evolution Fabric apply (atomic) ─▶ MetadataPort.put ratified instrument (sync)
                                                                                     │
   governed action ─────────────────────────────────────────────────────────────────▶│
                       ControlPlane authorize ── SYNC ── PI-4 PolicyEvaluator reads ratified
                       `governance:policy:*` (deny-by-default) exactly as today
```

- Enactment/amendment completes **before** the instrument becomes `active`; the synchronous
  enforcement/authorization path stays unchanged, which is why the 185 existing tests remain valid.
- Cached federated governance carries bounded staleness + hard expiry; expired ⇒ absent ⇒ deny (fail-closed).

## 5. Prohibited-core-dir impact statement

| Prohibited dir | Change required? | Why not |
|----------------|:----------------:|---------|
| `src/meta-core` | **No** | Enforcement is the existing `kernel.execute` contract gate; instruments are read via existing sync ports; provenance in `descriptor.metadata` |
| `src/registry-runtime` | **No** | Governance capabilities register via existing `RegistryPort`; foreign governance held in the federated registry instance (FED-PROV-001) |
| `src/metadata-runtime` | **No** | All instrument/grant records use existing `put/get/query`; disjoint `governance:*` keys; validate-on-write already enforced |
| `src/configuration-runtime` | **No** | Precedence/quorum/delegation-depth/reconciliation policy via existing layered `setLayer`/resolve |
| `src/contracts` | **No** | Provenance/precedence/`derivesFrom` carried in existing free-form `descriptor.metadata` and record values |

**All architecture is confined to `src/control/governance/*` (new modules) + reuse of the PI-4 PolicyEvaluator
and AD-0018/0019 control modules. Zero prohibited-core-dir change — constraint satisfied.**

## 6. Backward-compatibility & non-regression

- No existing signature changes; governance is additive wiring in `createControlPlane` (optional
  `governanceFabric`, `precedencePolicy`, `auditSink: FederatedAuditLog`) with defaults that preserve current
  behavior — in particular, the PI-4 `PolicyEvaluator` continues to consume `PolicyRecord`s exactly as today.
- All **185** ratified tests exercise substrate/control/federation/evolution/knowledge paths and remain valid
  unchanged; new governance tests are additive under `test/`.

## 7. Relationship to the Authority Layer & Constitution (architectural)

- The fabric **reads** Authority/Constitution sources as the roots of every instrument's `derivesFrom` chain;
  it **never writes** them. Amending the Constitution or Authority Layer is out of fabric scope and remains an
  **AUTH-012 decision-record act** of the Authority Board (GGP-1).
- The `precedence-resolver` treats Constitution/Authority as the **top, immutable** precedence tier; any
  instrument that would contradict them is rejected at certification (GGP-6/GGP-1).

## 8. Traceability
- **Refines:** GOV-GOV-001; FED-ARCH-001 (async pattern); FED-PROV-001 (keying); AD-0016/0017/0018/0019/0020;
  PI-4 `PolicyEvaluator`/`ControlPlane`; IP-04/IP-14/IP-15.
- **Consumed by:** GOV-SEC-001, GOV-FED-001, GOV-AUD-001, GOV-READINESS-001, future PI-14 build.
- **Owner:** UCOS Authority Board (Architecture).

**END GOV-ARCH-001 — DESIGN · READY FOR RATIFICATION · ZERO PROHIBITED-CORE-DIR CHANGE · NO IMPLEMENTATION AUTHORIZED.**
