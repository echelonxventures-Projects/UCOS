# RA-1 — Environment Provisioning Evidence Package (G12-1 Closure Program)

> **STATUS: RA-1 COMPLETE · ENVIRONMENT EVIDENCE GENERATED · G12-1 STATUS DETERMINED · NO IMPLEMENTATION AUTHORIZATION GRANTED**
> ARTICLE IX ACTIVE · PI-2 UNAUTHORIZED · `UCOS-CONSTRUCTION-BLOCKED` ACTIVE · OPERATIONAL CERTIFICATION PENDING
> EVIDENCE / PLANNING ONLY — NO DEPLOYMENT, NO RUNTIME ACTIVATION, NO GOVERNANCE MODIFICATION

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-RA1-ENV-001` (consolidates `RA1-ENV-001..006`) |
| Program | **RA-1 — Environment Provisioning Evidence (Phase 12 Operational Certification Track)** |
| Authority | AUTH-012 **AD-0014** (Board Priority #1); `UCOS-P12-CERT-001` (RA-1); `UCOS-IMP-GOV-001` |
| Mode | **EVIDENCE / PLANNING ONLY** — assesses provisioning readiness; performs no apply/deploy/runtime activation |
| Method | Direct inspection of `infra/environments/{dev,int}`, `infra/delivery/`, `infra/{runtime,networking,persistence}`, `services/platform/**` |
| Closes toward | Gap **G12-1** (Environment Provisioning Evidence); supports G12-2/G12-3 planning |
| **Determination** | **ENV-DEV / ENV-INT = READY TO PROVISION (definition-complete); provisioning/apply evidence NOT YET CAPTURED → G12-1 remains OPEN pending a governed provisioning act (not authorized here)** |

> **Evidence discipline.** Findings cite on-disk paths. `infra/environments/dev/main.tf` and `int/main.tf`
> explicitly declare **"SEED SCOPE: environment definition only. No live apply is performed by the authoring
> seed."** `infra/delivery/pipeline.yaml` is a **technology-neutral, unbound** pipeline contract (CI product
> deferred to WP-PLT-14 / PI-3). Therefore this package proves **readiness to provision**, not provisioned state.

---

## 1. RA1-ENV-001 — Environment Inventory (Workstream RA1-01)

| Env | Purpose | Dependencies | Hosting Model | Isolation Model | Access Model | Promotion Rules | Governance Controls |
|-----|---------|--------------|---------------|-----------------|--------------|-----------------|---------------------|
| **ENV-LOCAL** | Developer inner-loop | container runtime; local K8s conformance | Local (developer machine) | Per-developer; ephemeral | Developer-only; no shared secrets | Not promotable (source of PRs only) | Same non-waivable S1/S3/S4; no prod data | **Not present on disk** (no `infra/environments/local`) |
| **ENV-DEV** | First integrated foundation env | `runtime` module (ADR-001); secrets/KMS ref (WI-SEED.5); config (WP-PLT-11) | Cloud-neutral K8s (bound at apply-time; PEP-010) | Namespaced; internal-only (`external_exposure=false`) | Workload identity SA; deny-by-default; mTLS STRICT | Source of GitOps promotion → ENV-INT | `dev/main.tf`: S1/S3/S4 from day one; secrets by-reference |
| **ENV-INT** | Integration / contract-test env | ENV-DEV promotion; registry+config+persistence | Cloud-neutral K8s (apply-time) | Namespaced; internal-only | Workload identity SA; deny-by-default; mTLS STRICT | Receives from ENV-DEV; **no** ENV-PROD (P5) | `int/main.tf`: identical non-waivable posture |
| **ENV-STAGE** | Pre-production staging | ENV-INT promotion; full observability | Cloud-neutral (deferred) | Namespaced | Restricted | INT → STAGE (deferred) | **Deferred (post-PI-1)** — not defined in PI-1 |
| **ENV-PROD** | Production | STAGE promotion; full DR | Cloud-neutral (deferred) | Strong tenant isolation | Least-privilege; audited | STAGE → PROD (deferred) | **Intentionally NOT defined in PI-1 (P5)**; pipeline lists `forbiddenEnvironments: [ENV-PROD]` |

**Inventory finding:** ENV-DEV and ENV-INT are defined (`main.tf`). ENV-LOCAL is referenced by workflow but has
**no on-disk asset**. ENV-STAGE/ENV-PROD are **deliberately deferred** in PI-1 (P5); ENV-PROD is explicitly
forbidden by the delivery pipeline.

## 2. RA1-ENV-002 — Provisioning Architecture Report (Workstream RA1-02)

| Strategy | Definition (evidence) | State |
|----------|----------------------|:-----:|
| **Provisioning** | Declarative IaC — Terraform/OpenTofu (ADR-007), cloud-neutral (PEP-010); backend/provider bound at apply-time; `platform_baseline` → `runtime` K8s conformance baseline (ADR-001). | **DEFINED; not applied** |
| **Secrets** | By-reference only (`var.secret_refs`, `external://...`); resolved by secrets/KMS primitive (WI-SEED.5); **no inline values** (S3 / SEC-CTL-005). | **DEFINED; backend unbound** |
| **Configuration** | Hierarchical, self-describing, schema-validated (WP-PLT-11; `configuration-model.yaml`); environment-scoped at apply-time. | **DEFINED** |
| **Networking** | Deny-by-default mesh authz; mTLS STRICT / TLS 1.3; internal-only foundation boundaries (`external_exposure=false`); ADR-006 / WP-PLT-03. | **DEFINED; enforcement unverified** |
| **Identity** | Workload identity SA per service; deny-by-default authz; OIDC/OAuth2 substrate (ADR-006); IdP bound at apply-time. | **DEFINED; IdP unprovisioned** |
| **Recovery** | Backup/restore + DR design (WP-PLT-02; `persistence/backup-restore`); static stability (INV-9). | **DEFINED; not drilled** |

**Provisioning finding:** A complete, governed, technology-neutral provisioning architecture exists for
ENV-DEV/INT; every strategy is **defined but not executed** (no live apply, no bound vendor/IdP/secrets backend).

## 3. RA1-ENV-003 — Environment Readiness Matrix (Workstream RA1-03)

| Env | Determination | Evidence |
|-----|:-------------:|----------|
| ENV-LOCAL | **PARTIALLY DEFINED** | Referenced by inner-loop workflow; no `infra/environments/local` asset. |
| ENV-DEV | **READY TO PROVISION** | `dev/main.tf` complete (runtime module, S1/S3/S4, secrets-by-ref); awaits governed apply. |
| ENV-INT | **READY TO PROVISION** | `int/main.tf` complete; GitOps promotion target defined in `pipeline.yaml`. |
| ENV-STAGE | **PARTIALLY DEFINED** (deferred) | Named in promotion chain; not defined in PI-1. |
| ENV-PROD | **BLOCKED (by governance, P5)** | Intentionally undefined in PI-1; `forbiddenEnvironments: [ENV-PROD]`. |

**Readiness finding:** **0 environments PROVISIONED.** ENV-DEV/INT are **READY TO PROVISION**; the remainder are
deferred/governance-blocked by design (not a defect).

## 4. RA1-ENV-004 — Dependency Validation Report (Workstream RA1-04)

| Dependency | Classification | Evidence / rationale |
|------------|:--------------:|----------------------|
| Networking | **READY** (definition) | `infra/networking/**`; deny-by-default; mTLS STRICT (ADR-006). |
| Secrets | **CONDITIONAL** | By-reference model defined (WI-SEED.5); live vault/KMS backend **unbound**. |
| Identity | **CONDITIONAL** | Workload SA + OIDC design ready (ADR-006); IdP **unprovisioned**. |
| Registry | **READY** (definition) | `services/platform/registry/**` (BF-1 remediated). |
| Metadata | **READY** (definition) | `config-metadata/metadata-model.yaml`. |
| Configuration | **READY** (definition) | `config-metadata/configuration-model.yaml`. |
| Persistence | **READY** (definition) | `infra/persistence/**` (HA, backup, encryption). |
| Observability | **NOT READY** | `PE-12` product undecided (deferred ADR); no observability stack defined. |
| Audit | **CONDITIONAL** | Immutable-audit design (`AUD-1..7`, SEC-CTL); live trail pending operation. |
| Backup | **CONDITIONAL** | `persistence/backup-restore` defined; no executed backup. |
| Recovery | **CONDITIONAL** | DR design present; **RPO/RTO not measured**; no drill. |

**Dependency finding:** 6 READY (definition) · 4 CONDITIONAL (secrets/identity/audit/backup/recovery — resolve on
provisioning) · **1 NOT READY (Observability — `PE-12` undecided)**. Observability is the one dependency needing
a governed ADR sub-decision before full operational evidence.

## 5. RA1-ENV-005 — Evidence Closure Plan (Workstream RA1-05)

| Target | Required Evidence | Collection Method | Success Criteria |
|--------|-------------------|-------------------|------------------|
| **ENV-DEV** | Live `terraform apply` logs; running namespaced cluster baseline; enforced mTLS/authz | Governed apply via delivery pipeline (WI-SEED.4) in a provisioned cluster | Apply succeeds; deny-by-default + mTLS STRICT observed; internal-only confirmed |
| **ENV-INT** | Same as ENV-DEV + successful GitOps promotion from DEV | GitOps promote stage (Argo/Flux, bound at apply-time) | DEV→INT promotion passes `GATE-QUAL/SEC/DOC-001` |
| **Env Promotion** | Recorded gated promotion run; no unsigned artifact; no ENV-PROD | Pipeline `promote` stage execution + signing (Sigstore/cosign) | Signed artifact; gates pass; ENV-PROD refused |
| **Env Recovery** | Executed backup + restore + DR drill; measured RPO/RTO | Persistence backup/restore drill in ENV-INT | RPO/RTO within `UCOS-ASR-NFR-001` §3 class floors |
| **Env Auditability** | Captured immutable audit trail across provisioning + promotion | Audit sink enabled; trail exported as evidence | Tamper-evident trail covering all provisioning events |

**Prerequisites (governed acts, NOT performed here):** provision a cloud-neutral K8s target; bind CI runner
(WP-PLT-14, PI-3); bind secrets/KMS backend (WI-SEED.5); decide observability product (`PE-12`). These are
**deployment/runtime acts** outside RA-1's evidence-only scope and outside the current Article IX lock.

## 6. RA1-ENV-006 — Certification Impact Assessment (Workstream RA1-06)

| Impact area | Classification | Rationale |
|-------------|:--------------:|-----------|
| Operational Certification | **HIGH** | RA-1 defines exactly the evidence Operational Certification requires; closing G12-1 is a direct precondition. |
| Article IX Review Readiness | **MEDIUM** | Confirms environments are READY TO PROVISION (strengthens "initiate review" basis); does **not** change the SUBSTANTIAL EVIDENCE finding until apply-time evidence exists. |
| PI-2 Readiness | **MEDIUM** | PI-2 (Meta-Core) depends on a provisioned foundation env; RA-1 clarifies the path but grants no authorization. |
| Federation Readiness | **LOW** | Federation maturity is a later program (≈PI-6); minimal near-term impact. |

## 7. Executive Summary

RA-1 confirms, by direct inspection, that **UCOS possesses a complete, governed, technology-neutral provisioning
architecture** for the two PI-1 environments (**ENV-DEV, ENV-INT = READY TO PROVISION**), with non-waivable
S1/S3/S4 baked into the environment definitions and secrets handled strictly by-reference. **No environment is
provisioned**, and by design nothing here provisions one: the environment `main.tf` files are explicitly
"definition only, no live apply," and the delivery pipeline is an unbound, non-executing neutral contract.

**Dependencies:** 6 READY (definition), 4 CONDITIONAL (resolve at provisioning), **1 NOT READY (Observability /
`PE-12` — needs a governed ADR sub-decision).** **G12-1 status: DEFINITIONS READY TO PROVISION; provisioning/
apply evidence NOT YET CAPTURED → G12-1 remains OPEN**, pending a governed provisioning act (provision cluster +
bind CI/secrets/IdP + execute pipeline), which is a deployment/runtime activity **not authorized by this phase**.

**No PI-2, Article IX release, construction, deployment, runtime activation, or governance modification is
performed or implied.** The evidence-closure plan (§5) specifies exactly what remains for Operational
Certification and for closing G12-1/G12-2/G12-3.

## 8. Constraint Confirmations
| Constraint | Result |
|------------|:------:|
| No PI-2 authorization | ✅ |
| No Article IX release | ✅ |
| No construction / deployment authorization | ✅ |
| No runtime activation (no apply executed) | ✅ |
| No governance modification | ✅ |
| Evidence/planning only; ratified artifacts unmodified | ✅ |
| INV-1..13 / AUTH-012 / CAP / DOM / PEA unchanged | ✅ |

## Traceability
- **Refines:** `UCOS-P12-CERT-001` (RA-1; G12-1/2/3), `UCOS-IMP-CERT-PI1-002`, `UCOS-IMP-DELIV-001`,
  `UCOS-PLAT-ADR-001/006/007`, `UCOS-SEC-CONTROL-001`, `UCOS-ASR-NFR-001` §3/§5, `UCOS-CONST-001` (Art. IX),
  AUTH-012 AD-0014; on-disk `infra/environments/{dev,int}/main.tf`, `infra/delivery/pipeline.yaml`.
- **Refined by:** governed provisioning act + WI-SEED.4 pipeline execution → G12-1 closure → Operational
  Certification → Article IX Release Review (FGA-2).
- **Owner:** UCOS Authority Board (certification); Implementation Program.

**END RA-1 — ENVIRONMENT PROVISIONING EVIDENCE · ENV-DEV/INT READY TO PROVISION · 0 PROVISIONED · OBSERVABILITY NOT READY (PE-12) · G12-1 OPEN (PENDING GOVERNED PROVISIONING ACT) · ARTICLE IX ACTIVE · NO IMPLEMENTATION AUTHORIZATION GRANTED.**
