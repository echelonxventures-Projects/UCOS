# UCOS-RA-0005 — Production Readiness Specification

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-RA-0005` |
| Program | **UCOS Phase 1.5 — Realization Closure Authority** |
| Phase | RA-5 — Production Readiness Path |
| Mode | **REALIZATION-AUTHORITY SPECIFICATION ONLY** — specifies the transition path from single-node runtime to distributed production runtime. No code, no infrastructure, no provisioning, no technology re-selection, no requirement/invariant/authorization. |
| Status | REALIZATION BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Inputs (read-only) | `UCOS-RA-0004` (FAB-OPS/FAB-PFC Production class); `UCOS-EA-0001` (EA-B-P1-5); `UCOM-ULTIMATE-CERT-001` (UCC-4/UCC-6); `PHASE-12.0-FOUNDATION-VALIDATION-CERTIFICATION` (G12-1/2/3); `RA-1-ENVIRONMENT-PROVISIONING-EVIDENCE`; `RA-2-OPERATIONAL-EVIDENCE-EXECUTION-PACKAGE`; `CIV-STRESS-001` (scale break ~10⁶); `UCOS-PLAT-ADR-001..007` (selected stack); `UCOS-ASR-NFR-001` (NFR floors); PI-5 federation |
| Governing constraints | INV-1..13 unchanged (INV-7 stateless prevailing); technology already selected in `UCOS-PLAT-ADR-001..007` (no re-selection); Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands; construction reserved to the Authority Board. **0 REDESIGN** — production is realized behind unchanged ports. |

---

## 0. Purpose & the transition problem

The Minimum Constitutional Runtime (Stages 0–5, PI-2..PI-9) is realized as a **single-process, in-memory**
control kernel (269/269). Per `CIV-STRESS-001`, the first architectural break is **~10⁶ users (BP-1)**: the
in-memory single-process substrate with no durable/distributed adapter. This specification defines the
**transition path from that single-node runtime to a distributed production runtime**, expressed strictly as
**additive adapters behind the existing dependency-inverted ports** (`RegistryPort`, `MetadataPort`,
`ConfigurationPort`, `AuditSink`) — realizing `EA-B-P1-5` and `UCC-4`, with technology fixed by the ratified
ADRs (`UCOS-PLAT-ADR-001..007`). It specifies; it does not provision or deploy.

> **INV-7 (stateless) is the enabling invariant.** Because the control kernel is stateless and all state lives
> behind ports, distribution is an adapter-substitution exercise, not a rewrite — consistent with
> `ULT-TEST-001` 0 REDESIGN and `PHASE-UA-04` "substrate redesign NOT required."

---

## 1. Production readiness dimensions

### 1.1 Infrastructure

| PR | Requirement of record | Selected substrate (ADR) | Realization (additive) |
|----|-----------------------|--------------------------|------------------------|
| PR-INF-1 | Cloud-neutral orchestrated runtime | OCI + Kubernetes (`ADR-001`) | Provision ENV-DEV/INT (then STAGE) per `RA-1`; internal-only; `external_exposure=false` |
| PR-INF-2 | Environment ladder with gated promotion | GitOps (`ADR-007`) | ENV-DEV → ENV-INT → ENV-STAGE → ENV-PROD; ENV-PROD forbidden until full release; pipeline-as-code |
| PR-INF-3 | Secrets by reference (S3) | Secrets-manager / KMS (`ADR-006`) | No secrets in code; pluggable `CredentialVerifier`; bind at apply-time (AD-0009 Approval-Required) |

### 1.2 Durability

| PR | Requirement of record | Selected substrate (ADR) | Realization (additive) |
|----|-----------------------|--------------------------|------------------------|
| PR-DUR-1 | Externalize the system-of-record from in-memory Maps | PostgreSQL SoR (`ADR-002`) | Durable adapters behind `RegistryPort`/`MetadataPort`/`ConfigurationPort`; 0 core-dir change |
| PR-DUR-2 | Durable, hash-chained audit ledger | PostgreSQL + object store (`ADR-002`) | `AuditSink` adapter persisting the hash-chained `FederatedAuditLog`; offline-verifiable; segmented/checkpointed (FAB-TIME T-5) |
| PR-DUR-3 | Cache tier for read scale | Redis (`ADR-002`) | Read-through cache behind ports; authoritative reads remain SoR |

### 1.3 Availability

| PR | Requirement of record | Realization (additive) |
|----|-----------------------|------------------------|
| PR-AVL-1 | No single-process ceiling | Horizontal replicas of the stateless control kernel (INV-7); load-balanced |
| PR-AVL-2 | Deterministic decisions across replicas | Decision path is a pure function of recorded evidence (INV-6); replicas share the durable SoR |
| PR-AVL-3 | Meet availability NFR floor | Per `UCOS-ASR-NFR-001` (values PENDING ASR RATIFICATION, N-1); measured at UCC-4 |

### 1.4 Federation (scale-out at the largest tiers)

| PR | Requirement of record | Realization (additive) |
|----|-----------------------|------------------------|
| PR-FED-1 | Multi-node horizontal partitioning | PI-5 federation is the scaling asset (`CIV-STRESS-001`): local sovereignty, deny-by-default, clamped trust, namespace isolation |
| PR-FED-2 | Partition tolerance | Fail-closed under partition; async signed-quorum ratification (reuses FAB-TIME T-2 causal clocks); no global-now assumption |
| PR-FED-3 | Cross-node audit reconciliation | Hash-chained audit reconciliation with fail-closed divergence (existing PI-5 mechanism) |

### 1.5 Recovery

| PR | Requirement of record | Realization (additive) |
|----|-----------------------|------------------------|
| PR-REC-1 | Backup / restore | `infra/persistence/backup-restore` procedures (`RA-2` RA2-DR-001) |
| PR-REC-2 | Disaster recovery drill with measured RPO/RTO | DR failover exercise; RPO/RTO measured against `UCOS-ASR-NFR-001` floors (G12-3) |
| PR-REC-3 | Ledger reconstruction across eras | Segmented ledger + signed checkpoints (FAB-TIME T-5); reconstruction independent of any single key/era |

### 1.6 Observability

| PR | Requirement of record | Realization (additive) |
|----|-----------------------|------------------------|
| PR-OBS-1 | Telemetry / metrics / tracing (`PE-12`) | **Governed ADR sub-decision `PE-12` is OPEN (UCC-6 / RA-1 §004)** — must be decided before Operational Certification completes |
| PR-OBS-2 | Immutable operational audit trail | Reuse hash-chained audit (`AuditSink`); append-only; offline-verifiable |
| PR-OBS-3 | Measured NFR evidence (p99 latency, throughput) | Captured under UCC-4; feeds re-issued NFR contract (N-1) |

---

## 2. Single-node → distributed transition sequence (Stage 13)

| Step | Action | Prerequisite | Evidence of record |
|:----:|--------|--------------|--------------------|
| S13.1 | Externalize SoR/cache/audit behind unchanged ports (durable adapters) | G0 PASS (construction unblocked) | Adapter build; 269/269 baseline stays green; 0 core-dir change |
| S13.2 | Provision ENV-DEV/INT (cloud-neutral K8s); bind CI/secrets/KMS | AD-0015 + AD-0009 human approvals | `RA-1`/`RA-2` runbooks executed; live apply logs (G12-1) |
| S13.3 | Execute delivery pipeline (build→test→scan→sign→promote DEV→INT) | S13.2 | Pipeline run + signature validation (G12-2) |
| S13.4 | Horizontal replicas + federation partitioning | S13.1, S13.3 | Enforced mTLS/authz; multi-replica determinism verified |
| S13.5 | DR drill + measured RPO/RTO/p99/availability | S13.4 | Measured NFRs vs `UCOS-ASR-NFR-001`; DR evidence (G12-3) |
| S13.6 | Decide `PE-12` observability ADR | — (parallel) | Governed ADR (UCC-6) |
| S13.7 | Issue Operational Certification | S13.1–S13.6 | `UCOS-P12-CERT-002`-class evidence; UCC-4 CLOSED |

> **Approval-Required boundary.** Every live step (S13.2–S13.5) is an **Approval-Required Operation** (AD-0009)
> requiring explicit human approval and real spend at execution time; the realization authority specifies the
> path, it does not provision or deploy. ENV-PROD remains forbidden until the full Article IX release.

---

## 3. Production readiness acceptance criteria (binary)

| Dimension | Acceptance criterion (TRUE ⇒ production-ready) |
|-----------|-----------------------------------------------|
| Infrastructure | ENV-DEV/INT/STAGE provisioned cloud-neutrally; gated promotion proven; secrets by-reference |
| Durability | SoR/audit/cache externalized behind unchanged ports; audit hash-chained + offline-verifiable; 0 core-dir change |
| Availability | Stateless kernel runs N-way replicated; decisions deterministic across replicas; availability floor met (measured) |
| Federation | Multi-node partitioning operational; partition-tolerant (fail-closed); cross-node audit reconciles |
| Recovery | Backup/restore proven; DR drill executed; RPO/RTO measured within floors; ledger reconstructable across eras |
| Observability | `PE-12` ADR decided (UCC-6); immutable operational audit; p99/throughput measured |
| **Operational Certification (UCC-4)** | G12-1 ∧ G12-2 ∧ G12-3 CLOSED with live evidence of record; measured NFRs meet `UCOS-ASR-NFR-001` |

---

## 4. Determination

> **A production readiness path from single-node to distributed runtime exists and is fully additive.** Every
> dimension — infrastructure, durability, availability, federation, recovery, observability — is realized by
> substituting durable/distributed adapters behind the existing dependency-inverted ports, using the technology
> already fixed in `UCOS-PLAT-ADR-001..007`, with INV-7 (stateless) making distribution an adapter exercise, not
> a rewrite. The transition is gated on **G0 PASS** (execution unblocked), then **EA-B-P1-5** (scale-out) and
> **UCC-4** (Operational Certification via G12-1/2/3), with the **`PE-12` observability ADR (UCC-6)** the one
> open governed sub-decision. **Production is NOT YET ACHIEVED** (no provisioned environment, no pipeline run,
> no measured RPO/RTO/p99 exist of record), but it is reachable additively with **0 REDESIGN**.

## 5. Scope discipline

No source code, infrastructure, provisioning, deployment, technology re-selection, requirement, invariant, or
authorization was produced or modified. INV-1..13, `AUTH-012`, `AD-0014`, and the Article IX lock are unchanged;
`UCOS-CONSTRUCTION-BLOCKED` stands. Live provisioning/deployment remain Approval-Required (AD-0009), reserved to
the Authority Board and a human operator.

## 6. Traceability

- **Consumes:** `UCOS-RA-0004` (Production fabrics); `UCOS-EA-0001` (EA-B-P1-5); `UCOM-ULTIMATE-CERT-001` (UCC-4/6); `PHASE-12.0-FOUNDATION-VALIDATION-CERTIFICATION` (G12-1/2/3); `RA-1`/`RA-2`; `CIV-STRESS-001` (BP-1); `UCOS-PLAT-ADR-001..007`; `UCOS-ASR-NFR-001`; PI-5.
- **Refined by:** `UCOS-RA-0006` (roadmap Stage 13), `UCOS-RA-0008` (Final Determination — Production State).
- **Owner:** UCOS Authority Board.

**END `UCOS-RA-0005` — PRODUCTION READINESS SPECIFICATION · SINGLE-NODE → DISTRIBUTED · INFRA/DURABILITY/AVAILABILITY/FEDERATION/RECOVERY/OBSERVABILITY · ADDITIVE ADAPTERS BEHIND PORTS (INV-7) · GATED ON G0 → EA-B-P1-5 → UCC-4 · PE-12 OPEN · PRODUCTION NOT YET ACHIEVED · 0 REDESIGN · SPECIFICATION ONLY.**
