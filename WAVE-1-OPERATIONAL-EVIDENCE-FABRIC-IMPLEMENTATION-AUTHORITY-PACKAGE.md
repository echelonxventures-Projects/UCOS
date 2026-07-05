# UCOS Ω — WAVE 1 · OPERATIONAL EVIDENCE FABRIC · IMPLEMENTATION AUTHORITY PACKAGE

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-W1-OEF-IAP-001` |
| Type | **Implementation Authority Package** — executable build specification (Master Build Program, Wave 1) |
| Wave | **Wave 1 — Operational Evidence Fabric** (`UCOS-Ω-REAL-MATRIX-001` §4 "Wave 1 — Operational Evidence") |
| Mode | **AUTHORITY / SPECIFICATION ONLY** — produces the build spec. **No implementation. No provisioning. No apply. No CI run. No vendor binding. No lock release. No ratified-artifact mutation. Append-only.** |
| Objective | Produce the complete, dependency-ordered, constitutionally-anchored specification to construct and operate the Operational Evidence Fabric so it closes **G12-1 / G12-2 / G12-3** and unblocks **Operational Certification** (UCC-4). |
| Date | 2026-07-04 |
| Governing rule | *Repository reality + reproducible evidence override stale documentation* (`GOV-REC-001`). Non-optimistic, fail-closed: absence of evidence = NOT READY. |
| Governance status (unchanged by this artifact) | INV-1..13 binding; INV-CORE-01..14 defined (proposed); INV-14..20 NOT enrolled (AD-0014); **Article IX generation lock ACTIVE**; `UCOS-CONSTRUCTION-BLOCKED` stands **except** the AD-0015 evidence carve-out. This package enrolls, authorizes, and releases nothing. |
| **Determination** | **§13 — WAVE 1 IMPLEMENTATION AUTHORITY DECISION** |

> ### 0. Scope reconciliation — two distinct "Wave 1" streams (read first)
>
> The corpus contains **two** artifact families that both carry a "Wave 1" label. They are **not** the same
> and must not be conflated:
>
> 1. **`wave-1/` (`UCOS-W1-0001..0006`) — "Wave 1: Independent Evidence Package Generation."** A **governance**
>    stream that closes the **G0** gate: `REAL-C-05` independent adjudication, `REAL-M-03` reproducibility,
>    re-issuance of `UCOM-ULTIMATE-CERT-002`, and the Authority-Board Article IX **lift act**. Current state:
>    **G0 = FAIL / NO-GO** (`UCOS-W1-0003`, `UCOS-W1-0006`). This is the CW-1 governance/ledger reconciliation
>    predecessor.
>
> 2. **This package — "Wave 1: Operational Evidence Fabric."** The **Master Build Program** wave defined by
>    `UCOS-Ω-REAL-MATRIX-001` §4 (item 4): *"close G12-1/2/3; unblock certification."* It **operationalizes the
>    already-built B02 Operational Proof Fabric** (`control/operations/*`) and **executes the `RA-2` evidence
>    acts** to produce measured operational evidence, then feeds Operational Certification.
>
> **Relationship (binding).** Stream (1) is a **governance precondition** to the *defensible certification
> output* of stream (2): under the corpus's non-self-attestation discipline (`REAL-C-05`), Operational
> Certification cannot be *issued* on self-attested evidence. However, stream (2)'s **evidence-generation
> activity** is separately and specifically authorized by **AD-0015** (Limited Evidence Authorization), which
> was granted precisely to break the FGA-2 circular deadlock. This package therefore treats G0 PASS as a
> **certification-issuance gate (Exit)**, not as an evidence-generation gate (Entry). See §8, §9, §13.

---

## 1. CONSTITUTIONAL AUTHORITY

### 1.1 Laws invoked

Enforcement obligations Wave 1 must uphold (from the 15 Constitutional Laws, `UCOS-Ω-REAL-MATRIX-001` §2):

| Law | Statement | Wave-1 obligation |
|-----|-----------|-------------------|
| **LAW-001** Zero Hard Coding | No hard-coded logic/thresholds | Tenants, metric defs, health checks, SLOs, alert rules, proof authorities, NFR floors are **registry/metadata/config data** (`OperationsRegistry`, `UCOS-ASR-NFR-001`). |
| **LAW-002** Registry Driven | All constructs registered/discoverable | Every provisioned/promoted artifact and every evidence item registered in `CTX-REG-001`. |
| **LAW-004** Evidence Before Truth | No claim without reproduced evidence | No NFR/DR/availability figure is asserted; every value is **measured** and hash-bound before admission. |
| **LAW-005** Authority Before Change | No action without authorizing decision | Every `[HAR]` step requires AD-0009 human approval resolving to AD-0015. |
| **LAW-006** Nothing Outside Governance | No ungoverned mutation | Durable evidence persists only via the Evolution Fabric commit path. |
| **LAW-007** Versioned | All constructs versioned | Proof/incident records versioned `@<version>`; evidence append-only. |
| **LAW-008** Auditable | Tamper-evident audit | Hash-chained `operations-audit-log` + immutable chain-of-custody (RA2-AUD-001). |
| **LAW-009 / LAW-013** Evolvable / Evolution Requires Ratification | Change via governed evolution only | Service-hardening (OPF-D1..D7) enters via Evolution; no substrate redesign. |
| **LAW-012** Discovery ≠ Execution | Non-actuation of analytical fabrics | Operational telemetry/observability is **non-actuating**; it observes and proves, it does not act. |

### 1.2 Articles invoked

| Article | Relevance to Wave 1 |
|---------|---------------------|
| **Article IX — Governed Generation** | Generation lock **ACTIVE**. Wave 1 does **not** request full release. It executes **only** within the **AD-0015 bounded carve-out** (non-production evidence). Full release (FGA-2b) is an **Exit consequence**, not an Entry requirement. |
| **Article XII — Approval-By-Exception** | The basis of AD-0015 (a narrow, revocable, audited relaxation) and of AD-0009 per-act human approvals. |
| **Article X** (governance continuity) | Every Wave-1 act recorded append-only on `AUTH-012` / `CTX-REG-001`. |

### 1.3 Invariants affected (all **preserved**, none modified)

**Foundation-permanence (INV-1..13, `UCOS-ASR-NFR-001` v1.0.1) — bound as acceptance floors, not changed:**
INV-1 (contract-first: API-018/API-027), INV-2 (non-waivable S1/S3/S4), INV-4 (mTLS STRICT/TLS 1.3),
INV-5 (single SoR: `dom_ops`), INV-9 (static stability under control-plane outage), INV-10 (append-only /
migration-only evidence), INV-11 (secrets by reference), INV-12 (immutable, gated delivery — GitOps + signed
artifacts).

**Runtime-integrity (INV-CORE-01..14) directly exercised by Wave 1:**

| Invariant | Wave-1 exercise |
|-----------|-----------------|
| **INV-CORE-02 Audit Integrity** | The Operational Evidence Fabric's core guarantee: every governed evidence event hash-chained, append-only, offline-verifiable, cross-node reconcilable. |
| **INV-CORE-05 Evolution Integrity** | Durable evidence mutation only via Evolution (`evolvableAllowlist: ["operations:"]`); no bypass write path. |
| **INV-CORE-09 Determinism Integrity** | Metrics aggregation windows deterministic; measured NFRs reproducible from recorded evidence. |
| **INV-CORE-10 Security S1/S3/S4** | Enforced identically in ENV-DEV/INT from first commit; no dev-exempt posture. |
| **INV-CORE-12 Non-Actuation Integrity** | Observability/telemetry is advisory/observational; alerts auto-open **governed** incidents but actuate nothing. |
| **INV-CORE-14 Config/Metadata Integrity** | Thresholds/SLOs/floors schema-validated, versioned, registry-sourced. |

**INV-14..20 (existential):** NOT touched, NOT enrolled — Wave 1 is entirely **within the INV-1..13 envelope**
(AD-0014 preserved).

### 1.4 Ratification status of inputs

| Input | Status |
|-------|:------:|
| `UCOS-CONST-001` (Art. IX/X/XII) | FROZEN · RATIFIED |
| `UCOS-ASR-NFR-001` v1.0.1 (INV-1..13, NFR floors §3–§10) | RATIFIED |
| `UCOS-Ω-REAL-MATRIX-001` (Wave 1 definition) | ANALYSIS/SYNTHESIS (authoritative sequence) |
| `UCOS-Ω-BASE-RAT-001` (Reality Reconciliation & Program Baseline) | RATIFIED — AUTHORITATIVE |
| `B02-OPF` Operational Proof Fabric | IMPLEMENTED · VERIFIED (15/15 ACs; full suite green) |
| `RA-2` Operational Evidence Execution Package | COMPLETE · EXECUTION-READY (all live steps `[HAR]`) |
| `OP-CERT-001` Operational Certification Program | PROGRAM DEFINED |
| `ADR-PE12` Observability (OTel/OTLP) | **ACCEPTED** (2026-07-03) |
| `AD-0015` Limited Evidence Authorization | APPROVED (limited, revocable) |
| `AD-0009` Approval-Required Operations | IN FORCE |
| L4 / terminal certification of record | `UCOM-ULTIMATE-CERT-001` (CONDITIONALLY CERTIFIED); re-issue to `-002` pending (G0) |

### 1.5 Governance boundaries (hard limits on this wave)

1. **Non-production only** — ENV-DEV, ENV-INT. ENV-STAGE/ENV-PROD **forbidden** (AD-0015; NFR §6.4).
2. **Evidence purpose only** — no PI-2/Meta-Core/business/domain/service construction is authorized.
3. **No full Article IX release** — the lock stays ACTIVE; only the AD-0015 carve-out applies.
4. **Additive-only** — zero change to the five substrate core dirs (`meta-core`, `registry-runtime`,
   `metadata-runtime`, `configuration-runtime`, `contracts`); no PI-2..PI-11 fabric behavior changed.
5. **Human-gated execution** — every live (`[HAR]`) act is Approval-Required (AD-0009); the agent authors
   specs/runbooks and performs **no** provisioning/apply/CI/binding.
6. **Auto-expiry** — the AD-0015 authorization expires on Operational Certification issuance or Board revocation.

---

## 2. CAPABILITY SPECIFICATION

Wave 1 comprises **two capability groups**: (A) **already-realized** OPF runtime capabilities that are
*operationalized* (wired to durable SoR + live telemetry), and (B) **evidence-execution** capabilities that
produce the measured operational evidence. No new *architectural* capability is introduced.

### Group A — Operational Proof Fabric runtime capabilities (realized; to be operationalized)

#### CAP-OEF-1 — Telemetry Ingestion (`PRS-047`)
- **Purpose.** Admit metric points, trace spans, log events into bounded, tenant-partitioned buffers.
- **Scope.** Real-time plane; deny-by-default; never stores raw signal unbounded.
- **Inputs.** `{tenantId, metric|span|log, value, at}`; registered metric definitions; tenant retention policy.
- **Outputs.** Admitted signals in ring buffers; drop decisions (audited counters).
- **Events.** — (feeds evaluation; no governed event on raw ingest).
- **State model.** Ephemeral bounded ring buffers, O(1) append/evict.
- **Failure model.** Unknown/suspended tenant or unregistered metric ⇒ **drop** (deny-by-default).
- **Dependencies.** `OperationsRegistry`; OTel/OTLP contract (ADR-PE12).

#### CAP-OEF-2 — Metrics Aggregation & Observability (`PRS-048/049`)
- **Purpose.** Deterministic aggregation windows, trace-tree reconstruction, error-rate, tenant snapshots.
- **Scope.** Read-only, tenant-scoped analytics over the real-time plane.
- **Inputs.** Buffered signals; window/percentile spec.
- **Outputs.** Aggregates (p50/p95/p99), trace trees, observation snapshots.
- **Events.** —.
- **State model.** Derived, ephemeral.
- **Failure model.** Missing window data ⇒ empty/`unknown`, never fabricated.
- **Dependencies.** CAP-OEF-1; determinism (INV-CORE-09).

#### CAP-OEF-3 — Health & SLO Evaluation (`PRS-050`)
- **Purpose.** Registry-defined health checks + SLO compliance/error-budget evaluation.
- **Scope.** Per-component + rollup; metadata-driven SLO definitions.
- **Inputs.** Health-check defs, SLO defs, current aggregates.
- **Outputs.** Health rollup; SLO compliance; breach signals.
- **Events.** `OPS_HEALTH_CHANGED`, `OPS_SLO_BREACH`.
- **State model.** Evaluated snapshot; breaches audited.
- **Failure model.** No fresh sample ⇒ **`unknown`** (fail-closed, never silently healthy).
- **Dependencies.** CAP-OEF-2; `OperationsRegistry`.

#### CAP-OEF-4 — Alert Signaling & Incident Lifecycle (`PRS-051`)
- **Purpose.** Edge-triggered alerts; auto-open **governed** incidents; guarded lifecycle transitions.
- **Scope.** Non-actuating signaling (emits Control Events via ADR-003 CloudEvents).
- **Inputs.** SLO/health breaches; alert rules; incident transition requests.
- **Outputs.** `AlertEvent`; versioned incident records.
- **Events.** `OPS_ALERT_FIRED/RESOLVED`, `OPS_INCIDENT_OPENED/TRANSITIONED/CLOSED`.
- **State model.** Incident state machine (append-only, versioned, audited).
- **Failure model.** Illegal transition ⇒ rejected (`409`); duplicate edge suppressed.
- **Dependencies.** CAP-OEF-3; Evolution (durable incident persist).

#### CAP-OEF-5 — Operational Evidence (Proof) Attest/Seal (`PRS-039..042`-aligned)
- **Purpose.** Produce signed, versioned, hash-bound proof units (attest + SoD seal) as durable evidence.
- **Scope.** Governed proof plane; **the** evidentiary output of the fabric.
- **Inputs.** Proof record + attester identity; sealer identity (≠ attester).
- **Outputs.** Sealed proof persisted via Evolution → Metadata SoR (`dom_ops.proof_record`).
- **Events.** `OPS_PROOF_ATTESTED/SEALED/EXCHANGED`.
- **State model.** Append-only, versioned; `unitHash = sha256(canonical(unit))`.
- **Failure model.** Missing/invalid attestation or seal, attester==sealer, or tampered unit ⇒ **reject**.
- **Dependencies.** Evolution Fabric; Federation Ed25519 (no custom crypto).

#### CAP-OEF-6 — Immutable Audit & Cross-Node Reconciliation (`OPF-AUD-001`)
- **Purpose.** Hash-chained, offline-verifiable, reconcilable audit of every governed operational event.
- **Scope.** Per-node chain (`UCOS_NODE_ID`); export/verify/reconcile.
- **Inputs.** Governed events; peer chains.
- **Outputs.** `entryHash`-linked entries; reconciliation result.
- **Events.** `OPS_RECONCILED`, `OPS_REVOKED`.
- **State model.** Append-only chain; per-node monotonic `seq`.
- **Failure model.** Hash break / divergence ⇒ quarantine diverging segment, fail-closed (INV-CORE-02).
- **Dependencies.** Federation guard; durable `dom_ops.audit_entry` (insert-only role).

### Group B — Operational-evidence execution capabilities (RA-2; human-executed under AD-0015)

#### CAP-OEF-7 — Environment Provisioning Evidence (G12-1)
- **Purpose.** Provision ENV-DEV/INT non-prod, internal-only; prove S1/S3/S4 live.
- **Inputs.** `infra/environments/{dev,int}/main.tf`; secret refs (`external://…`); AD-0009 approvals.
- **Outputs.** apply logs, resource inventory, authz/mTLS/internal-only probe results, `CTX-REG-001` entries.
- **Events / audit.** Each `[HAR]` step emits an immutable audit event (chain-of-custody).
- **State model.** Ephemeral, time-boxed substrate; teardown = standing safety exit.
- **Failure model.** Public exposure, plaintext, or authorize-by-default ⇒ fail-closed, evidence rejected.
- **Dependencies.** AD-0015 in force; PRQ-1..6; ADR-001/006/007.

#### CAP-OEF-8 — Pipeline & Contract-Test Evidence (G12-2)
- **Purpose.** Execute `build→test→scan→sign→promote` (DEV→INT) + provider/consumer/compat contract tests for **API-018** (Config/Metadata) and **API-027** (Registry).
- **Inputs.** `infra/delivery/pipeline.yaml`; CI runner binding; contract catalog (`UCOS-CONTRACT-CAT-001`).
- **Outputs.** signed+provenanced artifacts, gate results, 100%-op-coverage contract reports.
- **Events / audit.** Per-stage immutable audit event; registry entry per promoted artifact.
- **State model.** One-directional DEV→INT; ENV-PROD refused.
- **Failure model.** Any gate/contract failure or unsigned artifact ⇒ stop, capture failure, rollback.
- **Dependencies.** CAP-OEF-7 live; GATE-QUAL/SEC/DOC.

#### CAP-OEF-9 — DR / NFR / Immutable-Audit Evidence (G12-3)
- **Purpose.** Backup/restore + failover drill; **measured** RPO/RTO/p99/availability vs `UCOS-ASR-NFR-001` §3 floors; immutable chain-of-custody audit.
- **Inputs.** `infra/persistence/{backup-restore,sor-lifecycle,postgresql-ha}`; ASR floors; live ENV-INT; PE-12 observability.
- **Outputs.** backup manifest+checksum, restore fidelity check, failover timeline, **measured** RPO/RTO/p99/availability, DR evidence bundle.
- **Events / audit.** DR artifacts archived append-only to evidence registry.
- **State model.** Measured evidence, hash-bound, retained append-only (INV-10).
- **Failure model.** Measured NFR below floor or DR deficiency ⇒ **G12-3 OPEN**, Operational Cert PENDING (no optimistic pass).
- **Dependencies.** CAP-OEF-7/8; ADR-PE12 (now ACCEPTED).

---

## 3. REGISTRY SPECIFICATION

No **new** registry *kind* is introduced; Wave 1 uses the existing `OperationsRegistry` (namespace root
`operations:`) and the evidence registry `CTX-REG-001`. The specification below is the **operationalization**
of already-ratified schemas.

### 3.1 `OperationsRegistry` (`operations:` root — realized)

| Concern | Key pattern | Schema (fields) | Constraints |
|---------|-------------|-----------------|-------------|
| Tenant | `operations:tenant:*` | `{tenantId, displayName, maxTrustLevel, retention{metricSamples,spans,logs}}` | tenant-partitioned; deny-by-default admission |
| Metric def | `operations:metric-def:*` | `{metricId, kind, unit, tenantScope}` | unregistered ⇒ ingest drop |
| Health check | `operations:health-check:*` | `{checkId, component, bounds}` | fail-closed to `unknown` |
| SLO | `operations:slo:*` | `{sloId, objective, window, errorBudget}` | metadata-driven; deterministic window |
| Alert rule | `operations:alert-rule:*` | `{ruleId, condition, edge}` | edge-once; auto-incident |
| Proof authority | `operations:authority:*`, `operations:pa:*`, `operations:psa:*` | Ed25519 public keys by reference | attester ≠ sealer (SoD) |
| Proof record | `operations:proof:<tenant>:<id>@<version>` | `{unitHash, attestation, seal, payload}` | append-only; latest-wins resolve |
| Incident record | `operations:incident:<tenant>:<id>@<version>` | `{state, transitions[], audit[]}` | guarded state machine |
| Revocation | `operations:revoked:<kind>:<id>` | `{kind, id, reason, at}` | revoked ⇒ excluded (fail-closed) |

- **Relationships.** proof-record → proof-authority (attest) + proof-seal-authority (seal); incident →
  alert-rule → slo/health-check → metric-def; all → tenant.
- **Versioning model.** Additive, migration-only (INV-10 / INV-CORE-05); `@<version>` monotonic; supersession, never deletion.
- **Migration requirements.** None to the substrate. New SLO/health/floor records enter via metadata registration (C-EX2/C-EX3); no schema change to core dirs.

### 3.2 System-of-Record schema `dom_ops` (PostgreSQL; ADR-005) — realized migration

`migrations/V001__operational_proof_sor.sql`, forward-only, append-only:
`tenant`, `definition`, `proof_record`, `incident_record`, `audit_entry`, `revocation`.

- **Constraints.** Every row tenant-scoped; authority keys + DB DSN are references only (S3); TLS 1.3 in
  transit + AES-256 at rest (S4); raw telemetry intentionally **not** persisted.
- **Versioning / migration.** Forward-only DDL; **insert-only DB role** for `audit_entry` (OPF-D2); single SoR per domain (INV-5). No destructive migration.

### 3.3 `CTX-REG-001` — Operational Evidence Register (extension by data, not schema)

Every provisioned/promoted artifact and every evidence item (EV-ENV-DEV, EV-ENV-INT, EV-CI, EV-API, EV-DR)
is registered with: origin step → AD-0009 approver → capture timestamp → immutable hash → registry entry.
Retention append-only for the certification lifecycle (INV-10); retired only per `PEL-001`.

---

## 4. FABRIC SPECIFICATION — Operational Evidence Fabric architecture

### 4.1 Two-plane architecture (realized in `control/operations/*`)

```
 REAL-TIME PLANE (ephemeral, bounded)
   emitters ─(metrics/spans/logs)→ TelemetryIngest → MetricStore(ring)
        → ObservabilityEngine / HealthMonitor / SloEvaluator / AlertEngine
        → AlertEvent(edge) ─autoIncident─┐
                                         │
 PROOF PLANE (durable, governed)         │
   attest/seal ┐                         │
   openIncident├→ OperationsControl ─gate(attestation + SoD seal)→ #persistViaEvolution
   transition  ┘        │                         → Evolution Fabric → Metadata SoR (dom_ops)
   importBundle → OperationsFederationGuard (verify + sovereignty + trust-clamp)
        every governed event → OperationsAuditLog (hash chain) → event bus (OPS_*, CloudEvents)
```

### 4.2 Components

| Component | Modules | Role |
|-----------|---------|------|
| Addressing | `operations-namespace.ts` | Reserved `operations:` root; tenant-partitioned keys |
| Registry | `operations-registry.ts` | Config-driven tenants/metrics/checks/SLOs/rules/authorities |
| Real-time | `metric-store.ts`, `telemetry-ingest.ts`, `observability-engine.ts` | Bounded ingest + aggregation |
| Evaluation | `health-monitor.ts`, `slo-evaluator.ts`, `alert-engine.ts` | Health/SLO/alert (edge + auto-incident) |
| Incidents | `incident-lifecycle.ts`, `incident-state-machine.ts`, `incident-tracker.ts` | Guarded, versioned lifecycle |
| Evidence | `proof-unit.ts`, `proof-record.ts`, `proof-authority.ts` | Signed attest + SoD seal |
| Store/query | `operations-store.ts`, `operations-query-engine.ts`, `operations-snapshot.ts` | Durable proof read |
| Security/audit/dist | `operations-revocation-authority.ts`, `operations-audit-log.ts`, `operations-federation-guard.ts` | Revocation, hash-chain, federation |
| Assembly | `operations-control.ts`, `index.ts` | `createOperations(substrate, {nodeId,…})` |

### 4.3 Services (deployable surface — `services/platform/operational-proof/`)

Contract `UCOS-API-CONTRACT-OPF`; OpenAPI 3.1 `api/opf-api.yaml`; every route tenant-scoped via
`X-UCOS-Tenant` + mTLS; deny-by-default ⇒ `403`. Deployment: **≥3 replicas** (distinct audit-chain nodes),
non-root / read-only rootfs / drop-ALL-caps, mTLS workload identity, deny-by-default mesh, HPA on CPU,
secrets by reference (S3).

### 4.4 Runtime interactions

Telemetry (OTel SDK) → OTLP → OTel Collector tier → OPF ingest (real-time plane) → evaluation → alert →
auto-incident → OperationsControl gate → **Evolution commit** → SoR. Alert signaling emits Control Events
via the ratified eventing substrate (ADR-003 CloudEvents) — no proprietary bus.

### 4.5 Event flows

`OPS_PROOF_ATTESTED · OPS_PROOF_SEALED · OPS_PROOF_EXCHANGED · OPS_INCIDENT_OPENED · OPS_INCIDENT_TRANSITIONED · OPS_INCIDENT_CLOSED · OPS_ALERT_FIRED · OPS_ALERT_RESOLVED · OPS_HEALTH_CHANGED · OPS_SLO_BREACH · OPS_RECONCILED · OPS_REVOKED` — every governed event both appended to the hash-chained audit log and published (CloudEvents 1.0; `tenantid`, `seq`, `entryhash` extensions).

### 4.6 Evidence flows (the wave's product)

```
observe/evaluate → sealed proof (Evolution → SoR)  ─┐
provision (G12-1) → EV-ENV-DEV/INT                   │
pipeline+contracts (G12-2) → EV-CI, EV-API           ├→ Evidence Register (CTX-REG-001, hashed, AD-0009-signed)
DR+NFR (G12-3) → EV-DR (measured RPO/RTO/p99)        ┘        │
                                                              ▼
                                Certification Evidence Matrix → Operational Certification (OP-CERT-001 Track 8)
```

---

## 5. COMPILER EXTENSIONS

The UCOS program compiler (`PROGRAM-COMPILER-ARCHITECTURE`) governs load→validate→resolve→verify→plan→compose.
Wave 1 requires **only additive, data-level** compiler work — no engine redesign.

| Stage | Required extension | Additive? |
|-------|--------------------|:---------:|
| **Validation** | Schema-validate operations registry records (metric/SLO/health/alert/authority) and NFR-floor bindings against `UCOS-ASR-NFR-001` §3–§10; reject unschema'd/unversioned records (INV-CORE-14). | ✅ data/rules only |
| **Resolution** | Resolve the `operations:` namespace and the `dom_ops` SoR binding; resolve evidence items → G12 gate → certification requirement (RA2-AUD-001 §5.3 matrix). | ✅ additive resolver map |
| **Planning** | Emit the dependency-ordered execution plan G12-1 → G12-2 → G12-3 with `[HAR]`/`[AGT-OK]` tags and AD-0009 approval points; plan is **advisory** (INV-CORE-12) — it does not execute. | ✅ plan output only |
| **Composition** | Compose the OPF fabric into the control surface via the single `operations` re-export in `src/control/index.ts` (namespaced); allowlist `operations:` as the sole added evolvable target. | ✅ one re-export; no core-dir change |

**Non-goals (explicitly excluded):** no new compiler primitive, no Reality-Compilation, no change to the
dependency-resolver/composition-engine internals, no core-dir modification.

---

## 6. GOVERNANCE EXTENSIONS

| Item | Requirement | Status |
|------|-------------|:------:|
| **Authorities** | AD-0015 (Limited Evidence Authorization) in force; per-act AD-0009 human approvals for each `[HAR]` binding/apply/run. | ✅ granted / per-act |
| **Policies** | Non-waivable S1/S3/S4 (INV-2); deny-by-default (INV-3); secrets-by-reference (INV-11); GitOps gated promotion (INV-12); ENV-PROD forbidden (AD-0015). | ✅ existing |
| **Ratification requirements** | PE-12 observability ADR (UCC-6) — **ACCEPTED** (`ADR-PE12`, 2026-07-03), clearing `RA1-ENV-004` and the G12-3 observability blocker at decision level. Backend product (`ADR-PE12-A`) remains a flagged, non-blocking sub-decision. | ✅ decided |
| **Compliance requirements** | Every evidence item: AD-0009 approval ref + immutable hash + `CTX-REG-001` entry (no admissibility without both); chain-of-custody per RA2-AUD-001 §5.4; retention append-only (INV-10). | ✅ specified |
| **New authority act needed at Exit** | Operational Certification issuance (Authority Board; VW-2 independent reviewer) and subsequently FGA-2b full Article IX release review. | ⏳ Exit |

**No governance act in this package amends the Constitution, enrolls an invariant, or releases the lock.**

---

## 7. RUNTIME INTEGRATION (additive, no redesign)

How the Operational Evidence Fabric integrates into each subsystem **without** redesign:

| Subsystem | Integration | No-redesign guarantee |
|-----------|-------------|-----------------------|
| **Kernel** (Meta-Core) | OPF assembled via `createOperations(substrate,…)` after `kernel.compose()`; consumes public Meta-Core API only. | Zero change to `meta-core`. |
| **Registry Universe** | `OperationsRegistry` sits behind `RegistryPort`; operations registries are additional fabric registries in the L02 index. | No `registry-runtime` change. |
| **Persistence Runtime** | Durable proof/audit persisted via `persistence-runtime/durable-registry-store` → `dom_ops`; insert-only audit role. | Reuse; no persistence redesign. |
| **Federation** | `OperationsFederationGuard` reuses PI-5 Ed25519 verify + sovereignty + trust-clamp for proof-bundle exchange; partition ⇒ fail-closed. | No federation behavior change (reuse only). |
| **Knowledge** (PI-7) | Read-only: certified operational proofs may be cited by knowledge with provenance; no consumer-side write (INV-CORE-06). | Read-only consumption. |
| **Ontology** (PI-8) | Operational entities (tenant, metric, SLO, incident, proof) typed against the ontology; SI-1..7 preserved. | Additive typing only. |
| **Memory** (PI-9) | Operational episodes may be remembered via IF-MEM; recall never synthesizes; Evolution-only durable mutation (INV-CORE-07). | No memory redesign. |
| **Simulation** (PI-11) | Non-actuating: simulated load/DR scenarios may *project*; only **measured** live evidence is admissible for G12 (INV-CORE-12). | Advisory only; no actuation. |

Durable mutation in every case routes through the **Evolution Fabric** (`evolvableAllowlist: ["operations:"]`) —
the single governed commit path (INV-CORE-05).

---

## 8. ACCEPTANCE CRITERIA (AC matrix)

### 8.1 Fabric acceptance (Group A — reproduced, realized)

| # | Criterion | State |
|---|-----------|:-----:|
| AC-1..AC-15 | OPF fabric acceptance (deny-by-default ingest; bounded ring; percentile aggregation; health fail-closed; SLO breach audited; alert edge + auto-incident; attest+seal persist via evolution; SoD fail-closed; tamper reject; incident lifecycle; illegal-transition forbidden; audit hash-chain verify; cross-node reconcile; multi-tenant isolation; revocation fail-closed) | ✅ 15/15 PASS (full suite green) |

### 8.2 Operationalization acceptance (Group A — to be executed)

| # | Criterion | Evidence | Gate |
|---|-----------|----------|:----:|
| AC-D1 | Deployable service wired to `dom_ops` via durable MetadataPort adapter | adapter + integration test | G12-1 |
| AC-D2 | Audit chain persisted/replayed to `dom_ops.audit_entry` (insert-only role) | replay verify | G12-3 |
| AC-D3 | `OPS_*` event-bus publisher (CloudEvents, at-least-once, idempotency keys) | publish + consume test | G12-2 |
| AC-D5 | Continuous attestation scheduler (periodic telemetry/health/SLO snapshot → sealed proof) | scheduled proof records | G12-3 |

### 8.3 Evidence acceptance (Group B — G12 closure)

| Gate | Criterion (pass = fail-closed, measured) | Closes |
|:----:|------------------------------------------|:------:|
| **G12-1** | ENV-DEV & ENV-INT provisioned non-prod, internal-only; 5 foundations reconciled; deny-by-default + mTLS STRICT verified live; 0 public exposure; artifacts registered | UCC-4 (env) |
| **G12-2** | Pipeline green DEV→INT; signed+provenanced artifact; gates pass; **API-018 & API-027** provider 100% conform, consumer 100% satisfied, compat 0-breaking, 100% op coverage | UCC-4 (pipeline) |
| **G12-3** | Backup integrity + restore fidelity 100%; failover preserves data-plane (INV-9); **measured RPO ≤ ASR §3 floor** (RPO-A ≤ 1 min / RPO-B ≤ 5 min), **measured RTO ≤ floor** (RTO-A ≤ 30 min in-region / ≤ 60 min cross-region), **measured p99 ≤ §4 floors**, availability ≥ class floor; immutable audit trail | UCC-4 (metrics/DR) |

### 8.4 Universal pass preconditions (UPP-1..5, OP-CERT-001 §3.4) — every criterion inherits

UPP-1 additive-only (0 core-dir change) · UPP-2 baseline green (0 regression) · UPP-3 S1/S3/S4 preserved ·
UPP-4 no custom crypto (federation Ed25519) · UPP-5 fail-closed. Any UPP violation ⇒ FAIL regardless of track criteria.

---

## 9. EXIT CRITERIA (Wave completion)

Wave 1 is **COMPLETE** iff **all** hold (fail-closed):

1. **E1** — G12-1 ∧ G12-2 ∧ G12-3 **CLOSED** on measured, hash-bound, `CTX-REG-001`-registered evidence.
2. **E2** — Measured NFRs **meet or exceed** `UCOS-ASR-NFR-001` §3/§4 floors (no projected figure presented as certified).
3. **E3** — Immutable, chain-of-custody operational audit trail complete and independently verifiable (INV-CORE-02).
4. **E4** — OPF operationalization AC-D1/D2/D3/D5 pass; baseline suite green (UPP-2); 0 core-dir change (UPP-1).
5. **E5** — Certification Evidence Matrix (RA2-AUD-001 §5.3) complete → **OP-CERT-001 Track 8 (Stress) PASS**.
6. **E6 (certification-issuance gate)** — **G0 = PASS** (`wave-1/UCOS-W1-0006`): `REAL-C-05` independent
   adjudication + `REAL-M-03` reconciliation + `UCOM-ULTIMATE-CERT-002` re-issued + Board act — so Operational
   Certification is issued on **independently attested** (non-self-attested) evidence (VW-2 reviewer distinct
   from the executing operator).
7. **E7** — Authority Board issues **Operational Certification** (UCC-4 CLOSED); AD-0015 auto-expires; feeds FGA-2b.

> **Sequencing note.** E1–E5 (evidence generation) proceed under the **standing AD-0015** carve-out and per-act
> AD-0009 approvals, **independent of** E6. E6/E7 gate only the **issuance** of the certification verdict.
> This preserves both the AD-0015 deadlock-break and the non-self-attestation discipline.

---

## 10. IMPLEMENTATION SEQUENCE (dependency-ordered)

```
S0 (governance, parallel, no spend)
   • Confirm AD-0015 in force; assign AD-0009 approver (PRQ-1/2)
   • Progress G0 stream (wave-1/UCOS-W1-0001..0006): REAL-C-05 + REAL-M-03 + cert-002 + Board lift
       └─ gates E6 (certification issuance) only; runs in parallel with S1–S4
        │
S1 Operationalize OPF (additive code; AD-0016/0017/0019 scope; no core-dir change)
   • AC-D1 durable MetadataPort adapter → dom_ops
   • AC-D2 audit-chain persist/replay (insert-only role)
   • AC-D3 OPS_* CloudEvents publisher (idempotency keys)
   • AC-D5 continuous attestation scheduler
   • Instrument PRS-047..051 via OTel/OTLP (ADR-PE12); baseline stays green (UPP-2)
        │
S2 G12-1 Environment (RA2-ENV-001) [HAR]  ── AD-0009 per step D-1/2/4/5, I-1/2
   • provision ENV-DEV/INT non-prod, internal-only; deploy 5 seeds; verify S1/S4 live
        │
S3 G12-2 Pipeline + Contracts (RA2-CI-001 + RA2-API-001) [HAR]
   • build→test→scan→sign→promote DEV→INT; API-018/API-027 provider/consumer/compat 100%
        │
S4 G12-3 DR / NFR / Immutable-Audit (RA2-DR-001 + RA2-AUD-001) [HAR]
   • backup→restore→failover; measure RPO/RTO/p99/availability vs floors; archive DR bundle
        │
S5 Evidence assembly → Certification Evidence Matrix → OP-CERT-001 Track 8 PASS
        │
S6 (gated on E6=G0 PASS) Authority Board issues Operational Certification (UCC-4) → AD-0015 expires → FGA-2b
```

**Ordering rules.** S1 may start now (additive, within existing scoped releases). S2 hard-gates S3; S3 hard-gates
S4 (measured NFR needs live pipeline + env). S0/G0 runs in parallel and binds only S6. No step actuates outside
the AD-0015 non-production envelope.

---

## 11. RISK ANALYSIS

### 11.1 Constitutional risks

| # | Risk | Mitigation | Fail-closed behavior |
|---|------|------------|----------------------|
| CR-1 | Evidence generation misread as full Article IX release | Bind strictly to AD-0015 carve-out; ENV-PROD forbidden; auto-expiry | Any out-of-scope act ⇒ refused; lock intact |
| CR-2 | An invariant appears to require change to measure NFRs | Floors are **acceptance targets**, read-only; measurement never loosens a floor | Below-floor result ⇒ G12-3 OPEN, not a floor edit |
| CR-3 | Self-attested certification (REAL-C-05 breach) | Gate issuance (E6) on independent adjudication; VW-2 reviewer ≠ operator | Self-attested evidence ⇒ certification withheld |

### 11.2 Governance risks

| # | Risk | Mitigation | Fail-closed behavior |
|---|------|------------|----------------------|
| GR-1 | `[HAR]` step executed without AD-0009 approval | Every live step tagged; agent performs none; approver assigned (PRQ-2) | Unapproved act ⇒ blocked; evidence inadmissible |
| GR-2 | G0 stays FAIL, blocking certification issuance | Run G0 in parallel from S0; it is documentation/attestation work (no spend) | Op-Cert PENDING until G0 PASS (evidence still captured) |
| GR-3 | Evidence not registered / no chain-of-custody | RA2-AUD-001 §5.4: no admissibility without approval ref + hash + registry entry | Unregistered evidence ⇒ rejected |
| GR-4 | `ADR-PE12-A` backend deferral treated as a gap | Any OTLP/OpenMetrics-conformant backend admissible; flagged non-blocking | Interim backend permitted; migration-only |

### 11.3 Runtime risks

| # | Risk | Mitigation | Fail-closed behavior |
|---|------|------------|----------------------|
| RR-1 | Measured NFR below floor (real cloud, real load) | Ephemeral non-prod substrate; pre-staged runbooks; horizontal scale-out per NFR §6 | G12-3 OPEN ⇒ Op-Cert PENDING/CONDITIONAL (not silent pass) |
| RR-2 | OPF service-hardening regresses the 284/284 baseline | Additive-first; per-merge baseline gate; port seam unchanged | Any regression ⇒ merge rejected (UPP-2) |
| RR-3 | Audit-chain divergence across ≥3 replica nodes | Per-node `seq` monotonic; cross-node reconcile; quarantine on hash break | Diverging segment quarantined; fail-closed (INV-CORE-02) |
| RR-4 | Secret leakage into telemetry/logs | S3/S4 by construction; PE-12 classification-preserving; secret-free telemetry (`PEB-012`) | Secret detected ⇒ treated as compromised; revoke+rotate |
| RR-5 | Real cloud spend / cost overrun | PRQ-5 cost ceiling + teardown deadline; time-boxed substrate | Ceiling breach ⇒ teardown (standing safety exit) |

---

## 12. DELIVERABLES (file-by-file inventory)

> Convention: **[EXISTS]** already on disk (reuse/operationalize); **[EXEC-OUTPUT]** produced by human-executed
> `[HAR]` acts under AD-0015/AD-0009; **[SPEC]** authored by this package. No file below is created by this
> package except this document itself.

### 12.1 Fabric runtime (additive; AD-0016/0017/0019 scope; 0 core-dir change)
- `[EXISTS]` `packages/platform-runtime/src/control/operations/*` (namespace, registry, real-time, evaluation, incidents, evidence, store/query, security/audit/federation, assembly, index)
- `[EXISTS]` `packages/platform-runtime/src/control/index.ts` (single `operations` re-export)
- `[EXISTS]` `packages/platform-runtime/test/operations.test.ts` (+ `operations-harness.ts`) — 15 ACs
- `[EXEC-OUTPUT]` durable MetadataPort adapter (AC-D1); audit persist/replay (AC-D2); `OPS_*` publisher (AC-D3); attestation scheduler (AC-D5) — additive modules + tests

### 12.2 Services & contracts
- `[EXISTS]` `services/platform/operational-proof/api/opf-api.yaml` (OpenAPI 3.1); `events/opf-events.yaml`
- `[EXISTS]` `services/platform/{registry,config-metadata}/**` (API-027 / API-018 providers)
- `[EXEC-OUTPUT]` provider/consumer/compatibility contract-test reports (API-018/API-027), coverage map → **EV-API**

### 12.3 Infrastructure & delivery (unapplied manifests → applied evidence)
- `[EXISTS]` `infra/environments/{dev,int}/main.tf`; `infra/delivery/pipeline.yaml`; `infra/persistence/{backup-restore,sor-lifecycle,postgresql-ha}`; `deploy/deployment.yaml`
- `[EXISTS]` `migrations/V001__operational_proof_sor.sql` (`dom_ops`)
- `[EXEC-OUTPUT]` ENV-DEV/INT apply logs + resource inventory + authz/mTLS/internal-only probes → **EV-ENV-DEV / EV-ENV-INT**
- `[EXEC-OUTPUT]` pipeline build/test/scan/sign/promote logs + image digest + provenance → **EV-CI**
- `[EXEC-OUTPUT]` backup/restore/failover logs + measured RPO/RTO/p99/availability → **EV-DR**

### 12.4 Evidence & certification records
- `[EXEC-OUTPUT]` `CTX-REG-001` evidence entries (EV-ENV-DEV/INT, EV-CI, EV-API, EV-DR), each hashed + AD-0009-signed
- `[EXEC-OUTPUT]` Certification Evidence Matrix (RA2-AUD-001 §5.3) → `OP-CERT-STRESS-001` (Track 8)
- `[EXEC-OUTPUT / Board]` Operational Certification record (UCC-4 close) — issued at Exit, gated on G0 PASS

### 12.5 Governance references (read-only inputs; unchanged)
- `[EXISTS]` `AUTH-012` (AD-0015, AD-0009, AD-0016..0023); `ADR-PE12`; `UCOS-ASR-NFR-001`; `RA-1`/`RA-2`; `OP-CERT-001`; `B02-OPF`; `wave-1/UCOS-W1-0001..0006` (G0)

### 12.6 This package
- `[SPEC]` `WAVE-1-OPERATIONAL-EVIDENCE-FABRIC-IMPLEMENTATION-AUTHORITY-PACKAGE.md` (this file) — the sole artifact created here.

---

## 13. FINAL OUTPUT — WAVE 1 IMPLEMENTATION AUTHORITY DECISION

> # READY
> **(as an Implementation Authority Package / executable build specification — with the enumerated execution-time and issuance-time conditions below)**

### 13.1 Basis for READY

1. **Complete.** All 12 required outputs (§1–§12) are specified: constitutional authority, capability spec,
   registry spec, fabric spec, compiler extensions, governance extensions, runtime integration, AC matrix,
   exit criteria, dependency-ordered sequence, risk analysis, and file-by-file deliverables.
2. **Additive, no redesign.** The fabric already exists green (`control/operations/*`, 15/15 ACs, full suite
   green) and is reused; remaining work is service-hardening + human-executed evidence acts. **Zero** change to
   the five substrate core dirs; **zero** invariant change; **zero** constitutional amendment; **zero**
   substrate modification; **no** existing fabric replaced. All mandatory constraints hold.
3. **Authorized activity class.** Evidence generation is expressly authorized by **AD-0015** (Limited Evidence
   Authorization), the governed carve-out created to break exactly this deadlock; each concrete act remains
   AD-0009 Approval-Required (human).
4. **Blocking dependency cleared.** The prior decisive blocker — PE-12 observability (UCC-6 / `RA1-ENV-004`
   NOT READY) — is **resolved**: `ADR-PE12` is **ACCEPTED** (OpenTelemetry/OTLP), backend product a flagged,
   non-blocking sub-decision.
5. **Fail-closed acceptance.** G12-1/2/3 pass only on **measured**, hash-bound, registered evidence against
   ratified NFR floors; no projected figure is admissible.

### 13.2 Conditions carried (fail-closed) — supporting evidence

| # | Condition | Type | State |
|---|-----------|------|:-----:|
| C-1 | AD-0015 in force + AD-0009 approver assigned (PRQ-1/2) | Entry (execution) | ✅ AD-0015 APPROVED; approver = per-act human |
| C-2 | Every `[HAR]` step human-approved; agent executes none | Execution | ⏳ human-operated |
| C-3 | Non-production, internal-only; ENV-PROD forbidden; time-boxed + cost-ceiling | Execution | ✅ specified (AD-0015) |
| C-4 | Measured NFRs ≥ `UCOS-ASR-NFR-001` floors; no fabricated figures | Exit | ⏳ measured at S4 |
| C-5 | **G0 = PASS** (REAL-C-05 + REAL-M-03 + `UCOM-ULTIMATE-CERT-002` + Board act) before **issuing** Operational Certification | Exit (issuance) | ❌ **currently G0 = FAIL / NO-GO** (`wave-1/UCOS-W1-0006`) — runs in parallel; blocks S6 only |
| C-6 | Baseline suite green (UPP-2); 0 core-dir change (UPP-1); S1/S3/S4 (UPP-3); no custom crypto (UPP-4) | All stages | ✅ baseline green; ⏳ re-verify per merge |

### 13.3 What READY does and does not mean

- **Does mean:** this package is a complete, constitutionally-conformant, executable build specification;
  construction (S1) and human-approved evidence execution (S2–S4) may proceed under the standing AD-0015 +
  per-act AD-0009 authority without any redesign, invariant change, or lock release.
- **Does NOT mean:** any evidence exists yet; any environment is provisioned; any NFR is measured; the
  Article IX lock is released; or Operational Certification is issued. Issuance is **held fail-closed** on
  C-4 (measured floors) and C-5 (**G0 PASS** — the one currently-FAIL predecessor), and on the Authority
  Board act (UCC-4). `UCOS-CONSTRUCTION-BLOCKED` stands except the AD-0015 carve-out.

### 13.4 Single most dangerous chain (fail-closed at every node)

`AD-0009 approval withheld (S2) → env not provisioned → pipeline/contracts not run (S3) → NFR/DR unmeasured (S4) → Track 8 FAIL → G0 not PASS (E6) → Operational Certification PENDING → FGA-2b (full Article IX release) blocked.`
Failure at any node fails closed and holds the system at **CONDITIONALLY CERTIFIED** — never a silent pass.

---

## 14. TRACEABILITY

- **Wave definition:** `UCOS-Ω-REAL-MATRIX-001` §4 (Wave 1 — Operational Evidence); `UCOS-Ω-BASE-RAT-001` (RATIFIED baseline).
- **Fabric of record:** `B02-OPF` (`control/operations/*`, 15 ACs, full suite green).
- **Execution package:** `RA-2` (`UCOS-RA2-EXEC-001`: RA2-ENV/CI/API/DR/AUD-001); `RA-1` (`UCOS-RA1-ENV-001`).
- **Certification program:** `OP-CERT-001` (Track 8 Stress; UCC-4; aggregate gate §6).
- **Authority:** `AUTH-012` — AD-0015 (Limited Evidence Authorization), AD-0009 (Approval-Required), AD-0016..0023 (scoped Article IX releases), AD-0014 (Ω∞ deferral); `UCOS-CONST-001` (Art. IX/X/XII); `UCOS-CONSTRUCTION-BLOCKED`.
- **Invariants:** `UCOS-ASR-NFR-001` v1.0.1 (INV-1..13, NFR floors); `INV-CORE-001` (INV-CORE-01..14).
- **Observability decision:** `ADR-PE12` (`UCOS-PLAT-ADR-008`, ACCEPTED); deferred `ADR-PE12-A`.
- **Certification-issuance predecessor:** `wave-1/UCOS-W1-0001..0006` (G0; `REAL-C-05`, `REAL-M-03`, `UCOM-ULTIMATE-CERT-002`).
- **Owner:** UCOS Authority Board (certification & release); Implementation Program (construction & human-operated execution).

**END `UCOS-W1-OEF-IAP-001` — WAVE 1 OPERATIONAL EVIDENCE FABRIC · IMPLEMENTATION AUTHORITY PACKAGE · 12/12 OUTPUTS SPECIFIED · ADDITIVE-ONLY · NO REDESIGN · NO INVARIANT CHANGE · NO AMENDMENT · NO SUBSTRATE MODIFICATION · NO LOCK RELEASE · DECISION: READY (as build spec) WITH FAIL-CLOSED CONDITIONS C-1..C-6 · OPERATIONAL CERTIFICATION ISSUANCE GATED ON MEASURED NFR FLOORS + G0 PASS + AUTHORITY-BOARD ACT.**
