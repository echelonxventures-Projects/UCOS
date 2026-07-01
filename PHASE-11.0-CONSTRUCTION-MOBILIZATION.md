# UCOS — PHASE 11.0 CONSTRUCTION MOBILIZATION

## Program Increment PI-1 Mobilization Plan (Platform Foundation)

| Field | Value |
|-------|-------|
| Artifact | **UCOS-PHASE-11.0-CONSTRUCTION-MOBILIZATION** |
| Artifact ID | `UCOS-IMP-MOB-001` |
| Version | 1.0.0 |
| Phase | **Phase 11.0 — Construction Mobilization** (first Phase 11 artifact) |
| Mode | **MOBILIZATION PLAN ONLY** — sequences and governs construction; does **not** write application code, modify architecture, change ADRs, or begin implementation |
| Authorized by | `UCOS-CONSTRUCTION-AUTHORIZATION` (`UCOS-CONSTR-AUTH-001`), activated by `UCOS-ARTICLE-IX-LOCK-RELEASE` (`UCOS-ART9-REL-001`) |
| Authority | Subordinate to UCOS Governance Baseline 1.0.0 (FROZEN), Authority Layer (`AUTH-001..012`), Constitution (`UCOS-CONST-001`, Art. IX/XII) |
| Branch | `phase-10-implementation-readiness` (DO NOT PUSH / MERGE / TAG) |
| Date | 2026-07-01 |
| Effective window | Valid only while `UCOS-ART9-REL-001` stands (subject to its §6 revocation conditions) |
| Status | **MOBILIZATION DEFINED — IMPLEMENTATION NOT BEGUN** |

> This plan operationalizes the authorized construction of **PI-1 (Platform Foundation)** as sequenced by
> `UCOS-IMP-PI-001`, decomposed by `UCOS-IMP-WPS-001`, ordered by `UCOS-IMP-DEP-001`, delivered per
> `UCOS-IMP-DELIV-001`, and governed by `UCOS-IMP-GOV-001`. It introduces **no** new capability, domain,
> contract, event, data construct, or technology. It **enacts** the ratified plans; it does not amend them.
> Nothing herein generates source code or provisions live infrastructure.

---

## 0. Mandate & Binding Constraints

### 0.1 Scope of this mobilization

This mobilization covers **PI-1 (Platform Foundation)** only, plus the enabling "construction seed"
(tooling, environments, repository structure, CI/CD activation) that all later PIs will reuse. PI-2..PI-7
are referenced for continuity but are **out of scope** for execution here and are mobilized by their own
increment mobilization plans. **No scope expansion** (P1): PI-1 realizes exactly the ratified foundation
work packages `WP-PLT-01`, `WP-PLT-02`, `WP-PLT-03`, `WP-PLT-06`, `WP-PLT-11` and no more.

### 0.2 Mandatory implementation controls (IC-1..IC-8) — binding on every PI-1 work item

| Control | Binding requirement in PI-1 | Enforcement point |
|---------|-----------------------------|-------------------|
| **IC-1** | Non-waivable **S1/S3/S4** enforced on every exposed boundary of every foundation service; never waived (Const. Art. XII / AUTH-008). | `GATE-SEC-001` per increment |
| **IC-2** | **Contract-first only:** foundation services realize only ratified published contracts (`UCOS-API-CONTRACT-027`, `-018` + their event/data contracts); substrate planes (`WP-PLT-01/02/03`) expose no business contract. No un-published interface is coded. | Contract tests (Q4) |
| **IC-3** | `GATE-QUAL-001` (Q1–Q6), `GATE-SEC-001` (S1–S7), `GATE-DOC-001` (D1–D6), traceability check PASS before any WP is "done"; `GATE-REL-001` gates any ENV-PROD promotion (none in PI-1). | Per-increment gate run |
| **IC-4** | Traceability: every code/config/IaC artifact traces to a ratified surface/contract/capability/domain/`PE-*`; **0 orphans**; registered in `CTX-REG-001`. | Traceability enforcement |
| **IC-5** | **ASR resolution:** replace `PENDING ASR RATIFICATION` (N-1) for all PI-1 foundation NFRs via governed Prompt 02 update **before** any performance/availability-bound implementation of that surface (see §12 MR-1). | Prompt 02 gate |
| **IC-6** | Forward security obligations **FO-1** (per-contract threat models for `API-027`/`API-018`), **FO-2** (dependency-vuln), **FO-3** (residual re-score) discharged in Prompts 07/10/11 for PI-1 surfaces. | `GATE-SEC-001` S2/S7 |
| **IC-7** | Migration-only evolution; PI-1 uses **only** ratified ADRs (ADR-001/002/004/005/006). Deferred sub-ADRs (`ADR-002A`, `PE-12`, `PE-07`) are **not** in PI-1 scope and are **not** used. | ADR conformance review |
| **IC-8** | Preservation discipline: scoped, explicit-path commits only; no `git add .`, `reset --hard`, `clean -fd`; append-only records; ledger kept aligned. | SCM policy / commit review |

### 0.3 Prohibited in PI-1 (restated from `UCOS-CONSTR-AUTH-001` §3)

`P1` no scope creep · `P2` no mutation of frozen artifacts (`UCOS-PEA-001..007`, Baseline 1.0.0, ratified
domains/entities/matrices) · `P3` no technology beyond ratified ADRs (incl. deferred `ADR-002A`/`PE-12`/`PE-07`)
· `P4` no waiver of S1/S3/S4 · `P5` no gate bypass / unsigned / unregistered promotion · `P6` no build against
unratified ASR/NFR values · `P7` no broad/unsafe SCM.

### 0.4 Non-negotiable confirmations

- **This is a mobilization plan; implementation is NOT begun by this artifact.** ✅
- **No architecture modified; no ADR changed; no frozen baseline mutated.** ✅
- **Contract-first only; no unratified technology; no scope expansion.** ✅

---

## 1. Program Increment PI-1 — Definition

### 1.1 PI-1 identity

| Field | Value |
|-------|-------|
| Increment | **PI-1 — Platform Foundation** |
| Roadmap stage | **S1** |
| Delivery stream | **DS-PLATFORM** (`UCOS-IMP-DELIV-001` §3) |
| Objective | Stand up the execution / persistence / networking substrate plus the registry and configuration-and-metadata foundation services, contract-conformant and gate-clean, as the substrate on which every later PI runs. |
| Predecessor | **PI-0** (Enablement & Lock Release) — **CLOSED** (lock released `2026-06-30`; C-1..C-6 satisfied). |
| Entry criterion | PI-0 exit met — Article IX lock released; `UCOS-CONSTR-AUTH-001` in force. ✅ |
| Owning teams | Platform Team — Execution (`WP-PLT-01..03`); Platform Team — Integration (`WP-PLT-06`); Platform Team — Operability (`WP-PLT-11`) — per `UCOS-IMP-DELIV-001` §2. |

### 1.2 PI-1 scope (in-scope work packages)

| WP | Platform domain (`PE-*`) | Plane / WS | ICU | Runtime services | Governing ADR |
|----|--------------------------|------------|-----|------------------|---------------|
| **WP-PLT-01** | PE-01 Runtime & Compute | WS-PLT-EXE | ICU-015 | foundation `PRS` | ADR-001 (Runtime & Compute) |
| **WP-PLT-02** | PE-02 Persistence & Storage | WS-PLT-EXE | ICU-015 | foundation `PRS` (incl. `PRS-005/006`) | ADR-002 (Storage & Persistence) |
| **WP-PLT-03** | PE-03 Networking & Connectivity | WS-PLT-EXE | ICU-015 | foundation `PRS` (incl. `PRS-010/011`) | ADR-006 (Security Substrate — networking/mTLS facet) |
| **WP-PLT-06** | PE-06 Registry & Discovery | WS-PLT-INT | ICU-019 | `PRS-022..025` | ADR-004 (Registry & Discovery) |
| **WP-PLT-11** | PE-11 Configuration & Metadata Delivery | WS-PLT-OPS | ICU-010 | `PRS-043..046` | ADR-005 (Metadata & Configuration Delivery) |

### 1.3 PI-1 explicitly out of scope (deferred to later PIs)

Eventing/gateway/workflow (`WP-PLT-04/05/07`, PI-2) · identity/secrets/audit (`WP-PLT-08/09/10`, PI-2) ·
control plane (`WP-PLT-17`, PI-2) · observability/resilience (`WP-PLT-12/13`, PI-3) · delivery/IaC/analytics
(`WP-PLT-14/15/16`, PI-3) · all commerce (`WP-BIZ-01..08`, PI-4) · experience (`WP-EXP-01`, PI-5) ·
validation/certification (`WP-VNC-01/02`, PI-6/7). Deferred technologies `ADR-002A` (analytical store),
`PE-12` (observability product), `PE-07` (workflow engine) are **not** used in PI-1 (IC-7).

### 1.4 PI-1 Exit Criteria

PI-1 closes **only** when **all** of the following are TRUE (aligned to `UCOS-IMP-PI-001` §2 PI-1 exit and
`UCOS-IMP-DELIV-001` §5 Definition of Done):

| # | Exit criterion | Evidence |
|:-:|----------------|----------|
| **X1** | Execution/persistence/networking substrate operational in ENV-DEV and ENV-INT (not ENV-PROD). | Substrate health, IaC state |
| **X2** | Registry & Discovery service realizes `UCOS-API-CONTRACT-027` + `UCOS-EVT-CONTRACT-027` + `UCOS-DATA-CONTRACT-027`, contract-conformant (provider + consumer tests PASS). | Contract test results |
| **X3** | Configuration & Metadata service realizes `UCOS-API-CONTRACT-018` + `UCOS-EVT-CONTRACT-018` + `UCOS-DATA-CONTRACT-018`, contract-conformant. | Contract test results |
| **X4** | `GATE-QUAL-001` (Q1–Q6) PASS for each in-scope WP. | Quality gate evidence |
| **X5** | `GATE-SEC-001` PASS (S1–S7; non-waivable **S1/S3/S4** enforced on every exposed foundation boundary). | Security gate evidence |
| **X6** | `GATE-DOC-001` (D1–D6, incl. D6 runbooks) PASS for each in-scope WP. | Doc gate evidence |
| **X7** | Traceability clean: every PI-1 artifact → contract/`PE-*`/capability/domain; **0 orphans**; registered in `CTX-REG-001`. | `TM-IMP-MOB-*`, registry |
| **X8** | ASR/NFR values for PI-1 foundation surfaces **ratified** (Prompt 02); no build proceeded against `PENDING ASR RATIFICATION` (IC-5). | ASR ratification record |
| **X9** | FO-1/FO-2/FO-3 discharged for `API-027`/`API-018` (per-contract threat model, dependency scan clean/accepted, residual re-score). | Threat model, scan report |
| **X10** | All PI-1 records append-only; scoped commits only; ledger aligned; **0** frozen-baseline mutations. | Commit log, ledger |

> **PI-1 does NOT deploy to ENV-PROD.** Production promotion requires `GATE-REL-001` + certification
> (Prompt 12, PI-7). PI-1 exit is bounded at ENV-INT (contract integration) with an optional ENV-STAGE
> full-gate dry-run.

---

## 2. Work Package Breakdown

Each PI-1 WP is decomposed into governed work items (WI). Work items are the smallest planned/gated unit;
each has a single accountable owner (`PEO-001..017` alignment) and traces to ratified artifacts. **No work
item authorizes any construct outside the ratified set.**

### 2.1 WP-PLT-01 — Runtime & Compute (PE-01 · ADR-001)

| WI | Work item | Ratified basis | Gate focus |
|----|-----------|----------------|------------|
| WI-01.1 | Runtime platform foundation: OCI container runtime + Kubernetes conformance profile (neutral contract). | ADR-001; `PEA-002` PRD/PRS/PEX/PWF | QUAL Q1/Q6 |
| WI-01.2 | Primary workload runtime baseline (Java 21 LTS/JVM) + governed polyglot allowance (TS/Node, Go) as build/runtime standard — standard only, no service code. | ADR-001 | QUAL, DOC |
| WI-01.3 | Runtime determinism & composability posture (EX1 determinism; `PEP-009/018`). | ADR-001; `PEP-008/009/010/018/020` | QUAL |
| WI-01.4 | Runtime security substrate hooks: workload identity surfaces for mTLS (consumes WP-PLT-03). | ADR-006; SEC-CTL-014 | SEC S1 |

### 2.2 WP-PLT-02 — Persistence & Storage (PE-02 · ADR-002)

| WI | Work item | Ratified basis | Gate focus |
|----|-----------|----------------|------------|
| WI-02.1 | System-of-record substrate: PostgreSQL SoR provisioning contract (ACID for commerce; single-SoR `PEP-005`). | ADR-002; `UCOS-PDATA-ARCH-001` | QUAL, SEC S4 |
| WI-02.2 | Object storage (S3-compatible), search (OpenSearch), cache (Redis) substrate contracts — provisioning only, no domain schemas. | ADR-002 | QUAL |
| WI-02.3 | Encryption-at-rest enablement + externalized keys (`PRS-005`, key ref via WP-PLT-03/ADR-006). | ADR-002; SEC-CTL-009 | SEC S4 (non-waivable) |
| WI-02.4 | Persistence classification hooks (`PRS-006`; PII classification honored, not widened). | `UCOS-PDATA-ARCH-001`; SEC-CTL-010 | SEC S4 |
| — | **Excluded:** analytical/OLAP store (`ADR-002A` deferred — IC-7). | — | — |

### 2.3 WP-PLT-03 — Networking & Connectivity (PE-03 · ADR-006 networking facet)

| WI | Work item | Ratified basis | Gate focus |
|----|-----------|----------------|------------|
| WI-03.1 | Zero-trust transport substrate: mTLS service mesh (workload identity); encryption in transit on every hop. | ADR-006; SEC-CTL-008/014 | SEC S4/S1 (non-waivable) |
| WI-03.2 | Network segmentation / lateral-movement restriction (`PRS-010/011`). | ADR-006; SEC-CTL-017 | SEC S5 |
| WI-03.3 | Boundary connectivity contracts for foundation services (internal, non-public in PI-1). | ADR-006; `PEA-001` PE-03 | SEC S1 |

### 2.4 WP-PLT-06 — Registry & Discovery (PE-06 · ADR-004 · ICU-019)

| WI | Work item | Ratified basis | Gate focus |
|----|-----------|----------------|------------|
| WI-06.1 | Registry service implementing `UCOS-API-CONTRACT-027` (`GET/POST /registry/artifacts`, `/{id}`, `/discovery`). | `API-027`; ADR-004; `PRS-022..025` | QUAL Q4, SEC S1 |
| WI-06.2 | Registry events `UCOS-EVT-CONTRACT-027` (`ArtifactRegistered/Superseded/Discovered`) — contract only; transport lands with eventing in PI-2 (declared intent honored). | `EVT-027` | QUAL Q4 |
| WI-06.3 | Registry data payloads per `UCOS-DATA-CONTRACT-027` (`RegistryArtifact`, `DiscoveryRecord`) referencing DOM-027 `PDE/LDO`; no schema redefinition. | `DATA-027`; `UCOS-PDATA-ARCH-001` | QUAL, trace |
| WI-06.4 | Kubernetes discovery + open Schema/Contract Registry + PostgreSQL-backed Platform Registry wiring. | ADR-004 | QUAL |
| WI-06.5 | S1 enforcement on the Registry boundary (authn/authz; deny-by-default). | SEC-CTL-001/002/014 | SEC S1 (non-waivable) |

### 2.5 WP-PLT-11 — Configuration & Metadata Delivery (PE-11 · ADR-005 · ICU-010)

| WI | Work item | Ratified basis | Gate focus |
|----|-----------|----------------|------------|
| WI-11.1 | Config/Metadata service implementing `UCOS-API-CONTRACT-018` (`GET /configuration/{scope}`, `PUT .../{key}`, `GET /metadata/{class}`, `GET /feature-flags/{context}`). | `API-018`; ADR-005; `PRS-043..046` | QUAL Q4, SEC S1 |
| WI-11.2 | Config/Metadata events `UCOS-EVT-CONTRACT-018` (`ConfigurationChanged/MetadataUpdated/FeatureFlagChanged`) — contract only; transport in PI-2. | `EVT-018` | QUAL Q4 |
| WI-11.3 | Data payloads per `UCOS-DATA-CONTRACT-018` (`ConfigurationValue`, `MetadataRecord`, `FeatureFlag`; `MC-01..13`). | `DATA-018` | QUAL, trace |
| WI-11.4 | PostgreSQL SoR + GitOps config delivery + JSON Schema validation; **secrets excluded** (secrets service is PE-09, PI-2). | ADR-005; SEC-CTL-005 discipline | SEC S3 (non-waivable) |
| WI-11.5 | S1 enforcement on the Config/Metadata boundary. | SEC-CTL-001/002/014 | SEC S1 (non-waivable) |

### 2.6 Enabling construction seed (cross-PI, established in PI-1)

These enable PI-1 to be built without pre-empting later platform WPs. Each is minimal and explicitly bounded.

| WI | Work item | Ratified basis | Note |
|----|-----------|----------------|------|
| WI-SEED.1 | Repository implementation structure activation (see §3). | `apps/`,`services/`,`packages/`,`infra/`,`specifications/` scaffolding | Structure only |
| WI-SEED.2 | Bootstrap CI/CD activation (see §8) using ADR-007 selections — build/test/sign/promote to ENV-DEV/INT only. | ADR-007 | **Does not** deliver `WP-PLT-14` scope (PI-3); bootstrap-minimal |
| WI-SEED.3 | Environment provisioning (ENV-DEV, ENV-INT) as governance promotion stages. | `UCOS-IMP-DELIV-001` §4; ADR-007 | No ENV-PROD |
| WI-SEED.4 | ASR/NFR resolution intake for PI-1 surfaces (Prompt 02) — see §12 MR-1. | IC-5 | Gates performance-bound work |

---

## 3. Repository Implementation Structure

The repository is already scaffolded (empty-by-design directories). PI-1 **activates** the structure without
inventing new top-level layout. Every added path traces to a ratified artifact (IC-4).

```
UCOS/
├── apps/                      # user-facing apps (EMPTY in PI-1; populated PI-5, WP-EXP-01)
├── services/                  # bounded-context / platform service implementations
│   ├── platform/
│   │   ├── registry/          # WP-PLT-06 — realizes UCOS-API-CONTRACT-027 (+EVT/DATA-027)
│   │   └── config-metadata/   # WP-PLT-11 — realizes UCOS-API-CONTRACT-018 (+EVT/DATA-018)
│   └── README.md              # (existing) contract-first, 1:1 bounded-context rule
├── packages/                  # shared libs/SDKs (contract-stable; no cross-context model leakage)
│   ├── contracts-sdk/         # generated clients/servers from specifications/contracts (contract-first)
│   └── platform-runtime/      # shared runtime primitives (ADR-001) — no domain logic
├── infra/                     # IaC (ADR-007: Terraform/OpenTofu + GitOps) — technology-neutral modules
│   ├── runtime/               # WP-PLT-01 (Kubernetes/OCI substrate)
│   ├── persistence/           # WP-PLT-02 (PostgreSQL/object/search/cache)
│   ├── networking/            # WP-PLT-03 (mesh/mTLS/segmentation)
│   └── environments/          # ENV-DEV, ENV-INT (no ENV-PROD in PI-1)
├── specifications/
│   └── contracts/             # (existing) UCOS-CONTRACT-CATALOG.md — source of truth for IC-2
├── security/                  # control realization evidence (SEC-CTL-*) — no secrets committed (S3)
├── quality/                   # gate evidence: GATE-QUAL/SEC/DOC-001 results per WP
├── release/                   # release governance evidence (GATE-REL-001) — unused until PI-7
├── architecture/              # FROZEN ratified architecture + ADRs (READ-ONLY — P2)
└── docs/implementation/       # FROZEN ratified plans (READ-ONLY — enacted, not amended)
```

**Rules (enacted from `services/README.md`, `apps/README.md`, `packages/README.md`, `CTX-ARCHB-001` §3):**
1. Each service maps 1:1 to a bounded context / platform domain and exposes only contract-first APIs
   registered in `specifications/contracts/` (IC-2).
2. `packages/contracts-sdk/` is **generated from** the ratified contract catalog; hand-editing published
   interfaces is prohibited (contract-first).
3. `architecture/` and `docs/implementation/` are **read-only** during construction (frozen baseline — P2);
   changes require a governed amendment (≥1.0.1 + `AUTH-012`), not a code commit.
4. No secrets in any path (S3); `security/` holds control evidence and references, never secret material.
5. Every new file is registered in `CTX-REG-001` with bidirectional traceability links (IC-4).

---

## 4. Environment Strategy

Environments are **governance promotion stages** (`UCOS-IMP-DELIV-001` §4), not named infrastructure; their
concrete realization is ADR-007 (Terraform/OpenTofu + GitOps). PI-1 uses **three** stages; ENV-PROD is
untouched.

| Environment | Purpose in PI-1 | Gate to enter | Promotion authority | PI-1 usage |
|-------------|-----------------|---------------|---------------------|:----------:|
| **ENV-DEV** | Per-team development & unit verification of substrate + foundation services. | none | Team | Active |
| **ENV-INT** | Cross-context contract integration (registry ↔ config/metadata; substrate conformance). | contract tests PASS (Q4) | Platform lead | Active (PI-1 exit boundary) |
| **ENV-STAGE** | Optional full-gate dry-run (QUAL/SEC/DOC) to de-risk later PIs. | QUAL/SEC/DOC PASS | Assurance (Prompt 11) | Optional |
| **ENV-PROD** | Live operation. | certification PASS (Prompt 12) + `GATE-REL-001` | Release governance / Authority Board | **NOT used in PI-1** |

**Environment constraints:**
- Promotion is one-directional and gate-bound; no environment is skipped.
- ENV-PROD promotion is prohibited until PI-7 certification (P5).
- Every environment enforces mTLS transport (WP-PLT-03) and boundary authn/authz (S1) — no "dev is exempt"
  posture for non-waivable controls (IC-1).
- Infrastructure is declarative, drift-free, and rollback-capable (ADR-007; `PE-13/15` posture).

---

## 5. Platform Foundation Sequence

The substrate must exist before the foundation services that run on it (`UCOS-IMP-DEP-001` §2: `WS-PLT-EXE`
→ registry/config). Sequence within PI-1:

```
STEP 1  Construction seed  ── WI-SEED.1 repo structure · WI-SEED.3 ENV-DEV/INT · WI-SEED.2 bootstrap CI/CD
            │  (ADR-007; no PE-14 scope)
            ▼
STEP 2  Execution/Networking substrate ── WP-PLT-01 (runtime) ‖ WP-PLT-03 (mTLS/segmentation)
            │  SUBSTRATE  (ADR-001, ADR-006)   [parallel: runtime + networking]
            ▼
STEP 3  Persistence substrate ── WP-PLT-02 (PostgreSQL SoR + object/search/cache; enc-at-rest)
            │  SUBSTRATE  (ADR-002)
            ▼
STEP 4  Foundation services (parallel) ── WP-PLT-06 Registry ‖ WP-PLT-11 Config/Metadata
            │  CONTRACT-FIRST  (ADR-004, ADR-005; API-027 / API-018)
            ▼
STEP 5  PI-1 integration ── registry ↔ config/metadata contract integration in ENV-INT
            │
            ▼
STEP 6  PI-1 gate run + exit ── QUAL/SEC/DOC + traceability; ASR ratified; FO-1/2/3 discharged
```

> **Note (control-fabric ordering):** the Control Plane (`WP-PLT-17`) governs all later WPs but is a **PI-2**
> deliverable. In PI-1, control-fabric governance is applied as *design discipline and gate enforcement*
> (governance process), not as a running `PCE-*` fabric; running enforcement lands in PI-2. This preserves
> the dependency graph (control plane depends on trust plane, which is PI-2) without weakening PI-1 gates.

---

## 6. Contract-First Implementation Sequence

**IC-2 is absolute:** foundation services consume/realize only ratified published contracts; no interface is
coded ahead of its contract. PI-1 touches exactly the two foundation contract families (registry, config/metadata).

| Order | Contract | Realizing WP | Provider | Consumers (PI-1) | Sequence rule |
|:-----:|----------|:------------:|----------|------------------|---------------|
| C-1 | `UCOS-API-CONTRACT-018` (Config & Metadata) + `EVT-018` + `DATA-018` | WP-PLT-11 | SVC-018 | all services (variability) | Config resolves first — all services (incl. registry) read config/metadata. |
| C-2 | `UCOS-API-CONTRACT-027` (Registry) + `EVT-027` + `DATA-027` | WP-PLT-06 | SVC-027 | all services (register/discover) | Registry consumes config; both are "consumed-by-all" foundations. |

**Contract-first workflow per service (enacted per WI):**
1. Freeze the ratified contract version (`v1.0`) from `specifications/contracts/` — no edits (IC-2).
2. Generate provider stubs + consumer clients into `packages/contracts-sdk/` (generated, not hand-authored).
3. Author provider implementation behind the contract; author consumer contract tests (Q4).
4. Resolve the contract's NFR block (currently `PENDING ASR RATIFICATION`) via Prompt 02 **before** any
   performance-bound implementation (IC-5); do not fabricate values (P6).
5. Discharge FO-1 (per-contract threat model) for the exposed surface (IC-6).
6. Run provider + consumer contract tests; PASS gates Q4 and X2/X3.

> Event transport for `EVT-018`/`EVT-027` is **declared as contract intent** (at-least-once, idempotency
> key) in PI-1; the concrete event fabric (Kafka API, ADR-003) is delivered with `WP-PLT-04` in **PI-2**.
> PI-1 honors the event contract shape without standing up the broker (no scope pull-forward).

---

## 7. Security-Control Implementation Sequence

**IC-1 / S1/S3/S4 are non-waivable.** PI-1 realizes the foundation-relevant subset of `SEC-CTL-001..020`;
controls whose realizing services are PI-2+ are realized when those services land, but the **non-waivable
checkpoints S1/S3/S4 are enforced on every PI-1 exposed boundary from day one**.

| Order | Control | Checkpoint | Realizing service | PI-1 WP | Non-waivable |
|:-----:|---------|:----------:|-------------------|:-------:|:------------:|
| SC-1 | SEC-CTL-008 Encryption in transit | S4 | `PRS-010/011/018/019` | WP-PLT-03 | **S4** |
| SC-2 | SEC-CTL-017 Network segmentation / zero-trust transport | S5 | `PRS-010/011` | WP-PLT-03 | — |
| SC-3 | SEC-CTL-009 Encryption at rest | S4 | `PRS-005`, key ref | WP-PLT-02 | **S4** |
| SC-4 | SEC-CTL-010 PII classification & minimization | S4 | classification + `PRS-006` | WP-PLT-02 | **S4** |
| SC-5 | SEC-CTL-005 Secret vaulting & injection (consumption discipline) | S3 | `PRS-035/038` (full service PI-2) | WP-PLT-02/11 | **S3** |
| SC-6 | SEC-CTL-001 Authentication (boundary) | S1 | `PRS-031` (workload identity via mTLS in PI-1) | WP-PLT-06/11/03 | **S1** |
| SC-7 | SEC-CTL-002 Authorization (deny-by-default) | S1, S5 | `PRS-032` | WP-PLT-06/11 | **S1** |
| SC-8 | SEC-CTL-014 Boundary authn/authz enforcement | S1 | `PRS-018/019`+`PRS-031/032` | WP-PLT-06/11 | **S1** |
| SC-9 | SEC-CTL-015 Input/contract validation | S2 | `PRS-018/020` | WP-PLT-06/11 | — |
| SC-10 | SEC-CTL-018 Dependency-risk governance (FO-2) | S7 | Control Fabric / governance | seed / all | — |
| SC-11 | SEC-CTL-019 Threat-modeling discipline (FO-1) | S2 | process | WP-PLT-06/11 | — |

**S1/S3/S4 reconciliation for PI-1 (a designed dependency, not a waiver):**
- **S1 (authn/authz on every exposed boundary):** the full user/tenant identity service (PE-08 / OIDC) is a
  **PI-2** deliverable. In PI-1, foundation service boundaries are **workload-authenticated via mTLS**
  (service mesh, WP-PLT-03 / ADR-006, SEC-CTL-014) and are **internal-only** (not externally exposed;
  ENV-DEV/INT only). Authorization is deny-by-default (SEC-CTL-002). No externally exposed boundary is
  created in PI-1, so S1 is enforced — not waived. Full OIDC/OAuth2 user identity is delivered before any
  externally exposed boundary (PI-2, precondition for PI-4 commerce).
- **S3 (secrets vault-managed):** the dedicated secrets/KMS service (PE-09) is **PI-2**. In PI-1, substrate
  credentials (e.g., PostgreSQL) are consumed **by reference** from the ADR-006 secrets manager/KMS
  primitive; **no secret is embedded in code, config, or IaC** (SEC-CTL-005 discipline). This is enforceable
  in PI-1 without the full PE-09 service (S3 satisfied via injection-by-reference).
- **S4 (encryption in transit/at rest; PII classified):** fully realizable in PI-1 — mTLS (WP-PLT-03) +
  encryption-at-rest (WP-PLT-02) + classification honored from `UCOS-PDATA-ARCH-001`.

> This reconciliation is recorded as **Risk R-2** (§11) with its mitigation; it introduces no waiver and no
> scope change.

---

## 8. CI/CD Activation Plan

CI/CD is required to build PI-1, but the full Delivery & CI/CD platform (`WP-PLT-14`) and Infrastructure &
Provisioning (`WP-PLT-15`) are **PI-3** deliverables. PI-1 therefore activates a **bootstrap-minimal**
pipeline using **only** ADR-007 selections; it is explicitly bounded and does not pre-empt PI-3 scope.

| Stage | Bootstrap capability (PI-1) | ADR-007 basis | Gate binding |
|-------|-----------------------------|---------------|--------------|
| Source | Git + trunk-governed flow; scoped commits (IC-8). | Git | — |
| Build | Pipeline-as-code; reproducible builds; OCI image build. | pipeline-as-code + OCI | QUAL Q1/Q6 |
| Test | Unit + provider/consumer contract tests (Q4); SAST/dependency scan (FO-2/S7). | pipeline-as-code | QUAL, SEC S7 |
| Sign | Artifact signing (Sigstore/cosign); no unsigned artifact promoted (P5). | Sigstore/cosign | REL R4–R7 (deferred enforce) |
| Provision | Declarative IaC (Terraform/OpenTofu) for ENV-DEV/INT; GitOps reconcile. | Terraform/OpenTofu + GitOps | — |
| Promote | Gated promotion ENV-DEV → ENV-INT on gate PASS; **no ENV-PROD**. | GitOps (Argo/Flux) | IC-3 |

**Activation constraints:**
- Bootstrap pipeline is registered in `CTX-REG-001` and flagged as *seed* — superseded/hardened by
  `WP-PLT-14/15` in PI-3 (migration-only, IC-7).
- No push/merge/tag on the working branch (`phase-10-implementation-readiness`); release tagging is PI-7.
- Every promotion records gate evidence in `quality/` (G2).
- Full `GATE-REL-001` enforcement activates in PI-7; PI-1 exercises signing/provenance to de-risk it.

---

## 9. Dependency Graph (PI-1)

Consistent with `UCOS-IMP-DEP-001` (acyclic; every implementation WP transitively behind the released lock).

```
[Article IX lock RELEASED — PI-0 closed]
        │ LOCK (satisfied)
        ▼
WI-SEED.1/2/3/4  (repo · CI/CD · envs · ASR intake)
        │ SUBSTRATE-ENABLING
        ├───────────────┐
        ▼               ▼
WP-PLT-01 (runtime)   WP-PLT-03 (networking/mTLS)      [parallel]
        │  SUBSTRATE      │ SUBSTRATE (+S4/S1 transport)
        └──────┬──────────┘
               ▼
        WP-PLT-02 (persistence + enc-at-rest)
               │ SUBSTRATE
        ┌──────┴───────────┐
        ▼                  ▼
WP-PLT-11 (config/meta)  WP-PLT-06 (registry)          [parallel; registry consumes config]
   realizes API-018         realizes API-027
        │ CONTRACT             │ CONTRACT
        └────────┬─────────────┘
                 ▼
        PI-1 contract integration (ENV-INT)
                 ▼
        PI-1 gate run + exit (X1..X10)
```

| Node | Direct predecessors | Class | Cycle? |
|------|--------------------|-------|:------:|
| WI-SEED.* | Lock released (PI-0) | LOCK | No |
| WP-PLT-01 | WI-SEED.* | SUBSTRATE | No |
| WP-PLT-03 | WI-SEED.* | SUBSTRATE | No |
| WP-PLT-02 | WP-PLT-01, WP-PLT-03 | SUBSTRATE | No |
| WP-PLT-11 | WP-PLT-01/02/03 | SUBSTRATE (+CONTRACT API-018) | No |
| WP-PLT-06 | WP-PLT-01/02/03, WP-PLT-11 (config) | SUBSTRATE + CONTRACT (API-027) | No |
| PI-1 integration | WP-PLT-06, WP-PLT-11 | CONTRACT | No |

> **0 cycles; 0 WP without a predecessor; 0 dependency bypassing the released lock.** Matches
> `UCOS-IMP-DEP-001` §5 rows for `WP-PLT-01..03/06/11`.

---

## 10. Construction Sequence (consolidated)

| Seq | Activity | WP / WI | Gate to advance | Environment |
|:---:|----------|---------|-----------------|-------------|
| 1 | Activate repo structure, envs, bootstrap CI/CD; open ASR intake. | WI-SEED.1..4 | structure registered; ASR intake opened | ENV-DEV |
| 2 | Ratify PI-1 foundation ASR/NFR values (Prompt 02). | MR-1 | ASR ratified (IC-5) — unblocks perf-bound work | — |
| 3 | Stand up runtime + networking (mTLS/segmentation) substrate. | WP-PLT-01, WP-PLT-03 | SEC S4/S1 transport; QUAL | ENV-DEV |
| 4 | Stand up persistence substrate + encryption-at-rest. | WP-PLT-02 | SEC S4; QUAL | ENV-DEV |
| 5 | Build Config/Metadata service (contract-first API-018). | WP-PLT-11 | Q4 contract tests; SEC S1/S3 | ENV-DEV → ENV-INT |
| 6 | Build Registry service (contract-first API-027). | WP-PLT-06 | Q4 contract tests; SEC S1 | ENV-DEV → ENV-INT |
| 7 | Contract-integrate registry ↔ config/metadata. | integration | contract integration PASS | ENV-INT |
| 8 | Discharge FO-1/2/3; full QUAL/SEC/DOC + traceability run. | all PI-1 | all gates PASS | ENV-INT (opt. ENV-STAGE) |
| 9 | PI-1 exit review; register artifacts; align ledger. | governance | X1..X10 TRUE | — |

---

## 11. Resource Model (planning-level)

Team counts are **planning placeholders** for capacity discussion, not staffing commitments
(`UCOS-IMP-DELIV-001` §2). Single accountable owner per WP (`PEO-001..017`; IC governance).

| Team | Aligned to | PI-1 WPs owned | Accountable role |
|------|-----------|----------------|------------------|
| Platform Team — Execution | PE-01..03 | WP-PLT-01, WP-PLT-02, WP-PLT-03 | Execution Plane Owner (`PEO-001/002/003`) |
| Platform Team — Integration | PE-04..07 | WP-PLT-06 | Integration Plane Owner (`PEO-006`) |
| Platform Team — Operability | PE-11..13 | WP-PLT-11 | Operability Plane Owner (`PEO-011`) |
| Enabling — Architecture & Contracts | Prompts 06/07/08/09 | contract/ASR support (MR-1, FO-1) | Architecture & Contracts Lead |
| Assurance — Validation | Prompt 11 | gate adjudication (ENV-STAGE dry-run) | Assurance Lead |
| Platform Team — Delivery & Control | PE-14..17 | WI-SEED.2 bootstrap CI/CD (seed only) | Delivery & Control Owner (`PEO-014`) |

**Shared capabilities consumed (not built) in PI-1:** governance gates, traceability enforcement,
Artifact Registry (`CTX-REG-001`), append-only ledger. **Decision rights** per `UCOS-IMP-GOV-001` §4:
WP owner → Platform lead → Implementation Program → Authority Board (terminal).

---

## 12. Risk Register

| ID | Risk | Impact | Likelihood | Mitigation | Owner | Trigger → escalation |
|----|------|:------:|:----------:|------------|-------|----------------------|
| **R-1 / MR-1** | Building against unratified NFRs (`PENDING ASR RATIFICATION`) violates IC-5/P6. | High | Med | Gate all performance/availability-bound work behind Prompt 02 ASR ratification (Seq 2); functional (non-perf) substrate may proceed. | Architecture & Contracts Lead | Any perf-bound WI starts pre-ratification → block. |
| **R-2** | S1 boundary enforcement needed in PI-1 but full identity (PE-08) is PI-2. | High | Med | mTLS workload identity (WP-PLT-03) + deny-by-default authz + internal-only boundaries + no external exposure until PI-2 OIDC (see §7). | Execution Plane Owner | External exposure attempted in PI-1 → §6 revocation review. |
| **R-3** | S3 secrets management needed before PE-09 (PI-2). | High | Med | Secrets-by-reference via ADR-006 KMS primitive; zero secrets in code/config/IaC; scanned in CI (FO-2). | Execution Plane Owner | Secret detected in artifact → hard stop (non-waivable). |
| **R-4** | Bootstrap CI/CD (seed) drifts into `WP-PLT-14/15` scope (scope creep, P1). | Med | Med | Explicitly bound seed; register as *seed*; harden via migration-only in PI-3 (IC-7). | Delivery & Control Owner | Seed adds non-bootstrap capability → reject to PI-3. |
| **R-5** | Event contract (`EVT-018/027`) tempts pulling forward the event fabric (ADR-003 / PE-04, PI-2). | Med | Low | Honor event contract *shape/intent* only; no broker in PI-1; transport lands PI-2. | Integration Plane Owner | Broker provisioning in PI-1 → reject. |
| **R-6** | Accidental frozen-baseline mutation (`architecture/`, `docs/implementation/`) (P2). | High | Low | Read-only discipline; changes only via ≥1.0.1 amendment + `AUTH-012`; scoped commits (IC-8). | Implementation Program | Any edit to frozen path → §6 revocation review. |
| **R-7** | Use of deferred technology (`ADR-002A`, `PE-12`, `PE-07`) (P3/IC-7). | Med | Low | PI-1 scope excludes analytics/observability-product/workflow; ADR conformance review per WP. | Platform leads | Deferred tech referenced in PI-1 build → block. |
| **R-8** | Traceability orphans / unregistered artifacts (IC-4/P5). | Med | Med | Register every artifact in `CTX-REG-001` at creation; per-increment traceability check (0 orphans). | Implementation Program | Orphan found at gate → block increment. |
| **R-9** | Broad/unsafe SCM (`git add .`, `reset --hard`) (P7/IC-8). | Med | Low | Explicit-path scoped commits; no destructive ops; preserve evidence. | All WP owners | Broad SCM detected → hard stop. |

---

## 13. Traceability Model

**IC-4: every PI-1 artifact traces to a ratified construct; 0 orphans.** Generated matrices:

| Matrix | Content |
|--------|---------|
| `TM-IMP-MOB-001` | PI-1 WP → `PE-*` domain → ADR → ratified plan (`UCOS-IMP-WPS/PI/DEP-001`). |
| `TM-IMP-MOB-002` | Foundation service → contract (`API-027/018` + `EVT`/`DATA`) → capability (CAP-19/CAP-10) → domain (DOM-027/DOM-018). |
| `TM-IMP-MOB-003` | Security control (`SEC-CTL-*`) → checkpoint (S1–S7) → realizing `PRS-*` → PI-1 WP. |
| `TM-IMP-MOB-004` | Work item → gate set (`GATE-QUAL/SEC/DOC-001`) → exit criterion (X1..X10). |

**Traceability chain (mandatory for every artifact):**
`code/config/IaC artifact → published contract (or PE-* substrate) → capability → domain → ratified
architecture (PEA/ADR) → Authority (AUTH-*)`, registered bidirectionally in `CTX-REG-001`, with gate status.
Modifying any upstream artifact flags all downstream PI-1 items for review (`CTX-TRACE-001` §4.5).

| Check | Target | Method |
|-------|:------:|--------|
| Orphan artifacts | 0 | traceability enforcement per increment + exit |
| Contracts realized without a catalog entry | 0 | contract-first check (IC-2) |
| WPs without a ratified `PE-*`/ADR basis | 0 | `TM-IMP-MOB-001` |
| Controls without a realizing service | 0 | `TM-IMP-MOB-003` (per `UCOS-SEC-CONTROL-001` §4) |

---

## 14. Phase 11 Governance Checkpoints

Enacted from `UCOS-IMP-GOV-001` (no new authority; nothing waived). Checkpoints are gate-bound decision
points; Approval-Required operations escalate to the Authority Board (`AUTH-009`).

| CP | Checkpoint | When | Gate / criterion | Authority | Approval type |
|:--:|-----------|------|------------------|-----------|---------------|
| **CP-0** | PI-1 entry | Start of PI-1 | PI-0 exit met (lock released); authorization in force | Implementation Program | Trusted |
| **CP-1** | ASR ratification gate | Before perf-bound work (Seq 2) | PI-1 NFRs ratified (Prompt 02); IC-5 | Authority Board | Approval-Required |
| **CP-2** | Substrate readiness | After Seq 4 | WP-PLT-01/02/03 QUAL + SEC S4/S1(transport) PASS | Platform lead | Trusted |
| **CP-3** | Foundation-service contract conformance | After Seq 6 | `API-027`/`API-018` provider+consumer tests PASS (Q4) | Platform lead | Trusted |
| **CP-4** | Security checkpoint | After Seq 8 | `GATE-SEC-001` S1–S7 PASS; non-waivable S1/S3/S4 enforced; FO-1/2/3 discharged | Assurance (Prompt 11) | Approval-Required (S1/S3/S4 hard-stop) |
| **CP-5** | Traceability & preservation | After Seq 8 | 0 orphans; all artifacts registered; scoped commits; ledger aligned | Implementation Program | Trusted |
| **CP-6** | PI-1 exit review | Seq 9 | X1..X10 TRUE; QUAL/SEC/DOC PASS | Authority Board | Approval-Required |
| **CP-R** | Revocation review | Any time | Any `UCOS-ART9-REL-001` §6 / `UCOS-CONSTR-AUTH-001` §6 trigger | Authority Board | Approval-Required |

**Escalation & exception handling** (`UCOS-IMP-GOV-001` §6): gate failure blocks the increment; non-waivable
S1/S3/S4 risk is a hard stop (no waiver); unsanctioned scope is rejected and routed to the owning design
prompt (02–09); any deviation from ratified design is Approval-Required → Authority Board.

---

## 15. Phase 11 (PI-1) Milestones

Dependency-ordered, gate-bound milestones — **not calendar dates** (`UCOS-IMP-PI-001` invariant: PIs are
dependency-ordered units, not calendar periods).

| Milestone | Definition of reached | Gate |
|-----------|-----------------------|------|
| **M0 — Mobilized** | This plan accepted; PI-1 entry (CP-0) satisfied; construction seed activated. | CP-0 |
| **M1 — ASR Ratified** | PI-1 foundation NFRs ratified (Prompt 02); IC-5 cleared. | CP-1 |
| **M2 — Substrate Up** | Runtime + networking + persistence operational in ENV-DEV; S4/S1-transport enforced. | CP-2 |
| **M3 — Config/Metadata Conformant** | `API-018` realized, contract tests PASS, S1/S3 enforced. | CP-3 |
| **M4 — Registry Conformant** | `API-027` realized, contract tests PASS, S1 enforced. | CP-3 |
| **M5 — Foundation Integrated** | Registry ↔ config/metadata integrated in ENV-INT. | CP-3 |
| **M6 — Secured & Traced** | `GATE-SEC-001` PASS (S1–S7); FO-1/2/3 discharged; 0 orphans; artifacts registered. | CP-4, CP-5 |
| **M7 — PI-1 Closed** | X1..X10 TRUE; QUAL/SEC/DOC PASS; Authority Board exit approval; PI-2 entry unlocked. | CP-6 |

---

## 16. Validation (self-check of this mobilization plan)

| Check | Target | Observed | Result |
|-------|:------:|:--------:|:------:|
| PI-1 scope = ratified WP set (`WP-PLT-01/02/03/06/11`) exactly | yes | yes | ✅ |
| Objectives 1–10 addressed | 10 | 10 (§1–§14) | ✅ |
| Deliverables (PI-1 scope/exit, WPB, dep graph, sequence, resource, risk, milestones) present | 8 | 8 (§1.4/§2/§9/§10/§11/§12/§15) | ✅ |
| IC-1..IC-8 bound to work items | 8/8 | 8/8 (§0.2) | ✅ |
| S1/S3/S4 enforced, never waived | yes | yes (§7) | ✅ |
| Contract-first only | yes | yes (§6) | ✅ |
| Unratified technology introduced | 0 | 0 (ADR-001/002/004/005/006 only) | ✅ |
| Deferred tech (`ADR-002A`/`PE-12`/`PE-07`) used | 0 | 0 (IC-7) | ✅ |
| Frozen-baseline mutation | 0 | 0 (P2; read-only §3) | ✅ |
| Scope expansion beyond ratified set | 0 | 0 (P1) | ✅ |
| Application code written | 0 | 0 (plan only) | ✅ |
| Architecture/ADR modified | 0 | 0 | ✅ |
| Implementation begun | no | no | ✅ |
| Dependency graph acyclic | yes | yes (§9) | ✅ |
| ENV-PROD promotion in PI-1 | 0 | 0 (§4) | ✅ |

---

## 17. Confirmations (scope discipline)

- **Mobilization plan only — implementation NOT begun by this artifact.** ✅
- **No architecture modified; no ADR changed; no frozen baseline mutated.** ✅
- **Contract-first only; no unratified technology; no scope expansion.** ✅
- **IC-1..IC-8 and non-waivable S1/S3/S4 bound to every PI-1 work item.** ✅
- **Valid only while `UCOS-ART9-REL-001` and `UCOS-CONSTR-AUTH-001` stand.** ✅

## Traceability

- **Refines:** `UCOS-CONSTR-AUTH-001`, `UCOS-ART9-REL-001`, `UCOS-IMP-PI-001` (PI-1), `UCOS-IMP-WPS-001`
  (`WP-PLT-01/02/03/06/11`), `UCOS-IMP-DEP-001`, `UCOS-IMP-DELIV-001`, `UCOS-IMP-GOV-001`,
  `UCOS-PLAT-ADR-001/002/004/005/006`, `UCOS-CONTRACT-CAT-001` (`API/EVT/DATA-018` & `-027`),
  `UCOS-SEC-CONTROL-001` (`SEC-CTL-001..020`), `UCOS-PEA-001..007`, `UCOS-CONST-001` (Art. IX/XII),
  `AUTH-008/009/010/012`.
- **Refined by:** PI-1 implementation (Prompt 10), validation (Prompt 11); PI-2 mobilization (successor).
- **Generates:** `TM-IMP-MOB-001..004` (§13).
- **Owner:** Implementation Program (subordinate to Authority Board).

**END UCOS-PHASE-11.0-CONSTRUCTION-MOBILIZATION — PI-1 MOBILIZATION DEFINED · CONTRACT-FIRST · IC-1..IC-8 + S1/S3/S4 BINDING · NO SCOPE EXPANSION · NO UNRATIFIED TECHNOLOGY · NO FROZEN-BASELINE MUTATION · EFFECTIVE 2026-07-01 · IMPLEMENTATION NOT BEGUN.**
