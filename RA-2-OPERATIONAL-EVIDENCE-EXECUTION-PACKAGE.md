# RA-2 — Operational Evidence Execution Package (G12-1 / G12-2 Closure)

> **STATUS: RA-2 COMPLETE · EXECUTION PACKAGE READY · G12-1 READY FOR EXECUTION · G12-2 READY FOR EXECUTION · NO INFRASTRUCTURE CREATED**
> Authorized by **AUTH-012 AD-0015** (Limited Evidence Authorization). Preparation only — no provisioning, no apply,
> no CI execution, no vendor binding, no account creation. Article IX NOT fully released; PI-2 UNAUTHORIZED.

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-RA2-EXEC-001` (consolidates `RA2-ENV-001`, `RA2-CI-001`, `RA2-API-001`, `RA2-DR-001`, `RA2-AUD-001`) |
| Program | **RA-2 — Operational Evidence Execution (Environment & Pipeline)** |
| Authority | **AUTH-012 AD-0015** (`UCOS-A9-REL-001`, Limited Evidence Authorization); Board Priority #1/#2 |
| Mode | **EXECUTION-PACKAGE PREPARATION ONLY** — the agent generates runbooks/procedures/criteria; the agent performs **no** provisioning/apply/CI/vendor-binding |
| Closes (when executed by a human operator) | Gaps **G12-1** (environment provisioning evidence) and **G12-2** (pipeline execution evidence); feeds **G12-3** (metrics) |
| On-disk basis | `infra/environments/{dev,int}/main.tf`; `infra/delivery/pipeline.yaml`; `services/platform/{registry,config-metadata}/**`; `infra/persistence/backup-restore`; `UCOS-CONTRACT-CATALOG` (`API-018`/`API-027`); `UCOS-ASR-NFR-001` §3/§5 |

> **Execution-authority discipline (binding on the operator).** Every step tagged **`[HAR]`** is an
> **Approval-Required Operation** (AUTH-009 / AD-0009: external-account creation, vendor onboarding, financial
> transactions, production/infrastructure changes) and requires **explicit human approval before execution**.
> **The agent does not and will not execute any `[HAR]` step.** Steps tagged **`[AGT-OK]`** are agent-safe
> preparation (authoring manifests/specs/checklists) and involve no live resources. All execution occurs
> **non-production, internal-only**, per AD-0015 conditions.

---

## 0. Global Prerequisites & Guardrails (apply to every workstream)

| # | Prerequisite | Type |
|:-:|--------------|:----:|
| PRQ-1 | Board AD-0015 authorization in force (not revoked, not expired). | governance |
| PRQ-2 | Human operator with approval authority for AD-0009 operations assigned. | governance |
| PRQ-3 | Non-production target only (ENV-DEV, ENV-INT); ENV-STAGE/PROD forbidden (P5). | scope |
| PRQ-4 | Secrets/KMS backend reachable **by reference** (`external://...`); **no inline secrets** (S3). | security |
| PRQ-5 | Cost ceiling + teardown deadline agreed (evidence substrate is ephemeral, time-boxed). | financial |
| PRQ-6 | Immutable audit sink reachable to capture the evidence trail (RA2-AUD-001). | audit |

**Non-waivable during all execution (INV-2/3/4/11):** deny-by-default authz (S1), secrets-by-reference (S3),
encryption in transit + at rest / mTLS STRICT (S4). No dev-exempt security posture.

---

## 1. RA2-ENV-001 — Environment Execution Package (Workstream RA2-01)

### 1.1 ENV-DEV Provisioning Runbook
| Step | Action | Tag | Evidence captured |
|:----:|--------|:---:|-------------------|
| D-0 | Confirm PRQ-1..6; record AD-0015 reference in run log. | `[AGT-OK]` | run-log header |
| D-1 | Bind cloud/K8s provider + Terraform backend (governed config; PEP-010 neutral). | `[HAR]` | provider/backend binding record |
| D-2 | Bind secrets/KMS backend; register `secret_refs` (`external://...`) — no values. | `[HAR]` | secret-ref manifest (no secrets) |
| D-3 | `terraform plan` for `infra/environments/dev` (review diff; no apply). | `[HAR]` | plan output (attached to evidence) |
| D-4 | `terraform apply` ENV-DEV (`platform_baseline`; `external_exposure=false`; mTLS/authz/enc = true). | `[HAR]` | apply log; resource inventory |
| D-5 | Deploy the 5 foundation seeds (runtime/networking/persistence + registry + config-metadata) via GitOps. | `[HAR]` | reconcile status; pod/SA inventory |
| D-6 | Verify deny-by-default authz + mTLS STRICT + internal-only (no public ingress). | `[HAR]` | authz/mTLS probe results |
| D-7 | Register provisioned artifacts in `CTX-REG-001` (IC-4). | `[AGT-OK]` | registry entries |

### 1.2 ENV-INT Provisioning Runbook
| Step | Action | Tag | Evidence |
|:----:|--------|:---:|----------|
| I-1 | `terraform plan`/`apply` for `infra/environments/int` (same non-waivable posture). | `[HAR]` | plan + apply logs |
| I-2 | GitOps promotion ENV-DEV → ENV-INT (pipeline `promote` stage; ENV-PROD forbidden). | `[HAR]` | promotion record; gate results |
| I-3 | Verify integration wiring: registry ↔ config-metadata integration (`registry/integration/config-metadata-integration.yaml`). | `[HAR]` | integration probe |
| I-4 | Register ENV-INT artifacts in `CTX-REG-001`. | `[AGT-OK]` | registry entries |

### 1.3 Prerequisites · Approval Points · Rollback · Audit · Evidence · Success
- **Prerequisites:** PRQ-1..6; provider/CI/secrets bindings (D-1/D-2) precede any apply.
- **Approval points (`[HAR]`):** D-1, D-2, D-4, D-5, I-1, I-2 (each explicit human approval; AD-0009).
- **Rollback:** `terraform destroy` (ENV-INT then ENV-DEV); GitOps revert to last-known-good; confirm 0
  residual external resources; record teardown in audit trail. Rollback is itself `[HAR]` but pre-approved as
  the standing safety exit.
- **Audit capture:** every `[HAR]` step emits an immutable audit event (RA2-AUD-001 chain of custody).
- **Evidence collection points:** provider/backend binding record; `plan` diffs; `apply` logs; resource
  inventory; authz/mTLS/internal-only probes; GitOps reconcile + promotion records.
- **Success criteria:** ENV-DEV & ENV-INT provisioned non-prod, internal-only; 5 foundations reconciled;
  deny-by-default + mTLS STRICT verified; 0 public exposure; all artifacts registered. → **G12-1 CLOSED.**

---

## 2. RA2-CI-001 — Pipeline Execution Package (Workstream RA2-02)

Basis: `infra/delivery/pipeline.yaml` (stages `build → test → scan → sign → promote`; gates Q1/Q3/Q4/Q6/S7/REL).

| Step | Action | Tag | Evidence |
|:----:|--------|:---:|----------|
| C-0 | Bind a conformant CI runner (WP-PLT-14 scope; no vendor selection beyond ADR-007 neutral contract). | `[HAR]` | runner binding record |
| C-1 | `build` — reproducible OCI image; gates Q1,Q6. | `[HAR]` | build log; image digest |
| C-2 | `test` — unit + provider/consumer contract tests; gates Q3,Q4. | `[HAR]` | test report (→ RA2-API-001) |
| C-3 | `scan` — SAST + SCA (pinned deps; vuln-clean or risk-accepted); gate S7 (FO-2). | `[HAR]` | scan report |
| C-4 | `sign` — Sigstore/cosign signature + provenance; signing key `external://kms/...` (S3). | `[HAR]` | signature + provenance attestation |
| C-5 | `promote` — GitOps DEV→INT; requires GATE-QUAL/SEC/DOC-001; ENV-PROD forbidden. | `[HAR]` | promotion record; gate pass |
| C-6 | Register promoted artifact in `CTX-REG-001` (pipeline invariant IC-4). | `[AGT-OK]` | registry entry |

- **Artifact verification:** image digest pinned; provenance attached (C-4).
- **Signature validation:** verify cosign signature + provenance before promote (C-5 precondition).
- **Failure handling:** any gate fail → stop, capture failure evidence, rollback promotion; no unsigned artifact
  promoted (pipeline invariant); no `--no-verify` (P7).
- **Audit logging / evidence capture:** each stage emits an immutable audit event; stage logs archived.
- **Promotion rules:** DEV→INT only; signed artifacts only; gates must pass; ENV-PROD refused.
- **Success criteria:** full pipeline green DEV→INT; signed+provenanced artifact; gates pass; audit trail
  complete. → **G12-2 CLOSED.**

---

## 3. RA2-API-001 — Contract Validation Package (Workstream RA2-03)

Targets: **API-018** (Config/Metadata service; realized by `services/platform/config-metadata`, CAP-10) and
**API-027** (Registry service; realized by `services/platform/registry`, CAP-19). Contracts per
`UCOS-CONTRACT-CATALOG` (`UCOS-CONTRACT-CAT-001`); versioning per `UCOS-SVC-POLICY-001` (N/N-1).

| Test class | API-018 (Config/Metadata) | API-027 (Registry) | Pass criteria |
|------------|---------------------------|--------------------|---------------|
| **Provider tests** | Provider honors published request/response schema; deny-by-default authz; classification-aware. | Provider honors `POST /registry/artifacts` (open `artifactType`), discovery/query ops. | 100% provider ops conform; 0 schema drift |
| **Consumer tests** | Consumer (tolerant reader) parses metadata records; handles open-class `class`. | Consumer resolves registered artifacts; handles unknown `artifactType` envelopes. | 100% consumer contracts satisfied |
| **Compatibility tests** | N vs N-1 backward compatibility (additive, migration-only; INV-10). | N vs N-1 backward compatibility. | 0 breaking change; additive only |
| **Evidence requirements** | Test report + request/response fixtures + coverage of every published op. | Same. | archived to evidence registry |

- **Evidence requirements:** machine-readable test reports; per-operation pass/fail; fixture set; coverage map
  op→test (0 uncovered published ops).
- **Pass criteria:** provider 100% conform · consumer 100% satisfied · compatibility 0 breaking · coverage 100%
  of `API-018`/`API-027` published operations. Feeds C-2 gate Q4 (contract-first, IC-2).

---

## 4. RA2-DR-001 — Disaster Recovery Evidence Package (Workstream RA2-04)

Basis: `infra/persistence/backup-restore`, `sor-lifecycle`, `postgresql-ha`; targets per `UCOS-ASR-NFR-001` §3
(recovery class floors — the operator validates against the ratified values; **no numbers are fabricated here**).

| Step | Action | Tag | Evidence |
|:----:|--------|:---:|----------|
| DR-1 | **Backup validation** — trigger backup of the SoR; verify integrity/completeness. | `[HAR]` | backup manifest + integrity checksum |
| DR-2 | **Restore validation** — restore to a clean ENV-INT namespace; verify data fidelity. | `[HAR]` | restore log; row/consistency check |
| DR-3 | **Recovery procedure** — simulate primary loss; execute failover (HA); confirm static stability (INV-9). | `[HAR]` | failover timeline |
| DR-4 | **RPO validation** — measure data-loss window vs `UCOS-ASR-NFR-001` §3 recovery target. | `[HAR]` | measured RPO vs ASR floor |
| DR-5 | **RTO validation** — measure time-to-recover vs `UCOS-ASR-NFR-001` §3 recovery target. | `[HAR]` | measured RTO vs ASR floor |
| DR-6 | **Evidence collection** — archive all DR artifacts to the evidence registry. | `[AGT-OK]` | DR evidence bundle |

- **Pass criteria:** backup integrity verified; restore fidelity 100%; measured **RPO ≤ ASR §3 target** and
  **RTO ≤ ASR §3 target** for the service's recovery class; failover preserves data-plane per INV-9.
  (Contributes to **G12-3**.)

---

## 5. RA2-AUD-001 — Audit & Certification Package (Workstream RA2-05)

### 5.1 Audit Trail Requirements
- Every `[HAR]` step emits an **immutable, tamper-evident** audit event (actor, timestamp, action, approval
  reference, resource, outcome). Aligns to `UCOS-SEC-ARCH-001` `AUD-1..7` and `SEC-CTL` audit controls.

### 5.2 Evidence Registry
| Evidence ID | Source step | Artifact | Gap |
|-------------|-------------|----------|:---:|
| EV-ENV-DEV | D-3..D-6 | plan/apply logs, resource inventory, authz/mTLS/internal-only probes | G12-1 |
| EV-ENV-INT | I-1..I-3 | apply logs, promotion record, integration probe | G12-1 |
| EV-CI | C-1..C-5 | build/test/scan/sign/promote logs, image digest, provenance | G12-2 |
| EV-API | RA2-API-001 | provider/consumer/compat test reports, coverage map | G12-2 |
| EV-DR | DR-1..DR-5 | backup/restore/failover logs, measured RPO/RTO | G12-3 |

### 5.3 Certification Evidence Matrix (maps evidence → certification requirement)
| Certification requirement | Evidence | Closes |
|---------------------------|----------|:------:|
| Live environment provisioned (non-prod, internal-only) | EV-ENV-DEV, EV-ENV-INT | G12-1 |
| Enforced deny-by-default authz + mTLS STRICT (S1/S4 live) | EV-ENV-DEV/INT probes | G12-1 |
| Pipeline executes; signed+provenanced; gates pass | EV-CI | G12-2 |
| Contract conformance (API-018/API-027) | EV-API | G12-2 |
| Backup/restore + measured RPO/RTO | EV-DR | G12-3 |

### 5.4 Chain of Custody
Each evidence item records: origin step → approver (AD-0009) → capture timestamp → immutable hash → registry
entry (`CTX-REG-001`). No evidence is admissible without an approval reference and a hash.

### 5.5 Retention Model
Evidence retained append-only (INV-10) for the certification lifecycle; retired only per `PEL-001`/lifecycle
governance; never deleted.

---

## 6. RA2-EXECUTION-REPORT

| Item | Result |
|------|:------:|
| Packages generated | 5/5 (`RA2-ENV-001`, `RA2-CI-001`, `RA2-API-001`, `RA2-DR-001`, `RA2-AUD-001`) |
| Executable by a human operator to close G12-1 | ✅ (RA2-ENV-001) |
| Executable by a human operator to close G12-2 | ✅ (RA2-CI-001 + RA2-API-001) |
| Feeds G12-3 (metrics/DR) | ✅ (RA2-DR-001) |
| `[HAR]` steps clearly marked (human Approval-Required) | ✅ (D-1/2/4/5, I-1/2, C-0..C-5, DR-1..DR-5) |
| Infrastructure created by this package | ❌ **NONE** |
| Accounts created / vendors bound / apply executed / CI run | ❌ **NONE** (all deferred to `[HAR]` execution) |
| Non-production / internal-only scope preserved | ✅ (ENV-DEV/INT; ENV-PROD forbidden) |
| Non-waivable S1/S3/S4 embedded | ✅ |
| INV-1..13 / Constitution / Article IX (full) unchanged | ✅ (only AD-0015 bounded carve-out applies) |

**Determination:** **RA-2 COMPLETE — EXECUTION PACKAGE READY.** G12-1 and G12-2 are **READY FOR EXECUTION** by
an authorized human operator under AD-0015 + AD-0009 approvals. **No infrastructure was created; the agent
executed no provisioning, apply, CI run, vendor binding, or account creation.**

### 6.1 What still requires a human (explicit)
Closing G12-1/G12-2/G12-3 **requires** a human operator to: approve and perform the `[HAR]` steps (bind
provider/CI/secrets, `terraform apply`, deploy seeds, run the pipeline, run contract/DR tests), incurring real
cloud spend on an ephemeral non-production substrate. **This cannot be completed by the agent.** After
execution, the captured evidence returns here for Operational Certification and then FGA-2b.

### 6.2 Blocking dependency (carried)
Observability product `PE-12` is undecided (`UCOS-RA1-ENV-004` NOT READY); full availability/metrics evidence
(G12-3) needs a governed `PE-12` ADR sub-decision before RA-3 completes.

## 7. Constraint Confirmations
| Constraint | Result |
|------------|:------:|
| No cloud account creation | ✅ (deferred to `[HAR]`) |
| No `terraform apply` | ✅ |
| No Kubernetes deployment | ✅ |
| No CI execution | ✅ |
| No runtime activation | ✅ |
| No PI-2 authorization | ✅ |
| No Article IX (full) release | ✅ |
| No production environment | ✅ |

## Traceability
- **Authorized by:** `UCOS-A9-REL-001` / AUTH-012 **AD-0015** (Limited Evidence Authorization).
- **Refines:** `UCOS-P12-CERT-001` (G12-1/2/3), `UCOS-RA1-ENV-001`, `infra/environments/{dev,int}/main.tf`,
  `infra/delivery/pipeline.yaml`, `services/platform/{registry,config-metadata}`, `UCOS-CONTRACT-CAT-001`
  (`API-018`/`API-027`), `UCOS-ASR-NFR-001` §3/§5, `UCOS-SEC-ARCH-001` (AUD-1..7), AUTH-009 (AD-0009).
- **Refined by:** human-approved execution → G12-1/G12-2 closure (+G12-3 via RA-3) → Operational Certification → FGA-2b.
- **Owner:** UCOS Authority Board (certification); Implementation Program (execution, human-operated).

**END RA-2 — OPERATIONAL EVIDENCE EXECUTION PACKAGE READY · G12-1 / G12-2 READY FOR EXECUTION · ALL LIVE STEPS HUMAN-APPROVAL-REQUIRED (AD-0009) · NO INFRASTRUCTURE CREATED · NO APPLY / NO CI / NO VENDOR BINDING · ARTICLE IX (FULL) INTACT · PI-2 UNAUTHORIZED.**
