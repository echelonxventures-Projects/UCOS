# ADR-007 — Delivery Toolchain Technology Selection

**Artifact ID:** UCOS-PLAT-ADR-007
**Short Name:** ADR-007 Delivery Toolchain
**Layer:** ARCHITECTURE (Platform Engineering — Technology Selection)
**Phase:** Phase 10.1 — Platform Technology Selection (Implementation Readiness Condition C-4)
**Status:** ACCEPTED (technology-selection scope)
**Version:** 1.0.0
**Date:** 2026-06-30
**Decision Owner:** Platform Engineering — Delivery Owner (`PEO-014`), with Infrastructure Owner (`PEO-015`)
**Governing Domains:** `PE-14` Delivery & CI/CD; `PE-15` Infrastructure & Provisioning (Delivery & Control Plane, PEG-E)
**Capability Anchor:** CAP-15 Platform Governance

> **Scope notice.** Technology selection authorized by `CTX-ARCHB-001` §5; deferred by `PEP-010`. This
> ADR selects the delivery/CI-CD and IaC **toolchain** (design-level selection). It does **NOT** provision
> live infrastructure, run pipelines, or deploy anything (PROMPT-08 §2 out-of-scope; `PEB-014`/`PEB-015`
> prohibited interactions: live provisioning, ungated promotion). It does **not** mutate any frozen
> artifact.

---

## 1. Context

`UCOS-PEA-001` establishes the Delivery & Control Plane: `PE-14` (Delivery & CI/CD) and `PE-15`
(Infrastructure & Provisioning / IaC). The Delivery Architecture (`UCOS-IMP-DELIV-001`) defines four
gated environments **ENV-DEV / ENV-INT / ENV-STAGE / ENV-PROD** and a Definition of Done, and the
Implementation Governance (`UCOS-IMP-GOV-001`) enacts gates **GATE-QUAL-001 / GATE-SEC-001 /
GATE-DOC-001** plus the Constitution **Article IX** generation-lock control and the Release Gates
(`GATE-REL-001`). A delivery toolchain must be selected that:

- Enforces **gated, reproducible promotion** — quality/security/documentation gates pass before
  promotion (`PEG-014`, `PEB-014`; `GATE-REL-001` R4–R7);
- Treats infrastructure as **declarative, version-controlled, reproducible** (`PEG-015`, `PEB-015`;
  `PEP-001/003/016`) with **no snowflake environments** and **no secrets in IaC** (`PEB-015`);
- Provides supply-chain integrity (build provenance, SBOM, artifact signing) consistent with AUTH-008;
- Is **cloud-neutral / portable** (`PEP-010`) and aligned to the ADR-001 runtime substrate.

## 2. Decision

**Adopt a Git-centric, gate-enforcing delivery toolchain with pipeline-as-code, declarative IaC, GitOps
reconciliation, and signed/attested OCI artifacts — cloud-neutral.**

1. **Version control:** **Git** as the single source for all code, contracts, IaC, and declarative
   configuration (ADR-005). Trunk-based with protected branches; everything-as-code (`PEP-001`).
2. **CI/CD — pipeline-as-code:** a **portable, declarative CI/CD pipeline** (the pipeline definition is
   version-controlled and runner-portable — e.g., GitHub Actions / GitLab CI / Tekton-class; no
   vendor-specific control flow that prevents portability per `PEP-010`). Pipelines **enforce the gates**
   as mandatory promotion conditions across ENV-DEV → ENV-INT → ENV-STAGE → ENV-PROD: `GATE-QUAL-001`,
   `GATE-SEC-001`, `GATE-DOC-001`, `GATE-REL-001` (R4–R7). No promotion without passing gates
   (`PEB-014`).
3. **Artifacts & supply chain:** build **OCI images** (ADR-001) into an **OCI-compliant artifact
   registry**; generate **SBOMs**; **sign and attest** artifacts using **Sigstore/cosign**
   (provenance + signatures) — supply-chain integrity consistent with AUTH-008. Only registered
   (ADR-004) and signed artifacts are promotable.
4. **Infrastructure as Code (`PE-15`):** **declarative IaC** using **Terraform / OpenTofu** (HCL,
   provider-neutral) for cloud/platform resources, plus **GitOps reconciliation** (Argo CD / Flux-class)
   for Kubernetes (ADR-001) and declarative platform configuration (ADR-005). IaC is version-controlled,
   reproducible, and reviewed; **no secrets in IaC** (secrets via ADR-006); **no manual/snowflake**
   changes (`PEB-015`).
5. **Reproducibility & rollback:** every promotion is reproducible from Git + signed artifacts; rollback
   is a re-reconcile to a prior known-good revision (`GATE-REL-001` R5 rollback; `PE-13` continuity).

## 3. Alternatives Considered

| # | Alternative | Why not selected |
|---|-------------|------------------|
| A | **Single cloud-native CI/CD + IaC suite** | Convenient, but vendor-locked pipelines/IaC violate `PEP-010`/§5 and portability across the cloud-neutral ADR-001 substrate. |
| B | **Imperative provisioning (scripts / manual console)** | Non-reproducible, snowflake-prone; violates `PEG-015`/`PEB-015` declarative-reproducible discipline and `PEP-016`. |
| C | **Push-based deploys (CI pushes directly to clusters)** | Weaker drift detection and auditability than GitOps reconciliation; GitOps (pull-based) is preferred for `PE-15` reproducibility and `PE-13` rollback. |
| D | **Unsigned artifacts / no SBOM** | Insufficient supply-chain integrity for AUTH-008; signing + attestation + SBOM are mandatory. |
| E | **Ungated or partially gated promotion** | Direct violation of `PEB-014` and `GATE-REL-001`; all of `GATE-QUAL/SEC/DOC-001` must gate promotion. |

## 4. Consequences

**Positive**
- Gate-enforcing, reproducible promotion across the four governed environments (`UCOS-IMP-DELIV-001`).
- Declarative IaC + GitOps deliver reproducible, drift-free, rollback-capable infrastructure (`PE-13`,
  `PE-15`).
- Signed/attested OCI artifacts + SBOM provide supply-chain integrity aligned to AUTH-008.
- Cloud-neutral toolchain honors `PEP-010` and complements ADR-001.

**Negative / Trade-offs**
- Toolchain breadth (CI + IaC + GitOps + signing) increases setup effort — bounded by the work-package
  plan (`WP-PLT-14`, `WP-ENB-*`) and incremental rollout (`PI-0`).
- GitOps learning curve and reconciliation latency — acceptable for the reproducibility/audit benefits.
- Mandatory gates can slow promotion — by design; gate integrity is non-negotiable (`PEB-014`).

**Follow-on obligations**
- Pipelines **enforce** but do not define the gates — gate criteria are owned by the governance package
  (`GATE-QUAL/SEC/DOC/REL-001`).
- Secrets used by pipelines are sourced from the ADR-006 secrets substrate (never stored in IaC/repos).
- Actual pipeline runs and live provisioning remain gated by the **Article IX lock** and
  `UCOS-IMP-READY-001` (this ADR is design-level selection only).

## 5. Traceability

- **Realizes:** `UCOS-PEA-001` `PE-14/PE-15`, `PEG-014/015`, `PEO-014/015`, `PEB-014/015`;
  `UCOS-IMP-DELIV-001` (environments/DoD), `UCOS-IMP-GOV-001` (gates + Article IX lock).
- **Justified by ASR/principle:** `CTX-ARCHB-001` §5/§6; `PEP-001/003/010/012/016/020`; `GATE-REL-001`
  R4–R7; AUTH-008 (supply-chain integrity).
- **Authority:** AUTH-009; `GATE-REL-001`; AUTH-008.
- **Consumed by (downstream):** ADR-001 (image build/run), ADR-005 (GitOps config delivery), ADR-006
  (pipeline secrets), all `WP-*` (delivered through this toolchain), Prompts 10–12.
- **Chain:** `ADR-007 → PE-14/PE-15 → CAP-15 → AUTH-009/GATE-REL-001 → CTX-ARCHB-001 §5`.

## 6. Governance Impacts

- Satisfies **Phase 10.0 Condition C-4** for the delivery-toolchain concern.
- Governed by `PEG-014/015`; promotion-gate and provisioning governance held by the Delivery and
  Infrastructure Owners; escalation `PEO-014/015 → PE-17 → Authority Board`.
- Enforces gated promotion (`GATE-QUAL/SEC/DOC/REL-001`) and declarative/reproducible provisioning;
  **no live provisioning** performed here (`PEB-015`).
- Supply-chain integrity supports non-waivable **S1/S3/S4**; additive only; no frozen-artifact mutation;
  migration-only evolution (`PEP-016`).

## 7. Approval Status

| Field | Value |
|-------|-------|
| Status | **ACCEPTED** (design-level technology-selection scope) |
| Approval model | Approval-By-Exception (`PEP-020`); ratified within the technology-selection ADR set by `PE-17` |
| Terminal authority | Authority Board (`PEG-017`) |
| Gating note | No pipelines run / no infrastructure provisioned; gated by `UCOS-IMP-READY-001` (C-4..C-6) and the Article IX lock |

## 8. Ownership

| Role | Assignment |
|------|------------|
| Decision Owner (Engineering) | Delivery Owner (`PEO-014`); Infrastructure Owner (`PEO-015`) |
| Steward | Platform Governance Steward (CAP-15) |
| Governing Models | `PEG-014`, `PEG-015` |
| Boundaries | `PEB-014`, `PEB-015` |
| Authority Chain | Delivery / Infrastructure Owner → `PE-17` → Authority Board |

## Traceability (artifact)
- **Refines:** `UCOS-PEA-001`, `UCOS-IMP-DELIV-001`, `UCOS-IMP-GOV-001`, `GATE-REL-001`, `CTX-ARCHB-001`
  §5, AUTH-008/009, PROMPT-08.
- **Refined by:** `UCOS-PLAT-ADR-INDEX`; ADR-001/005/006; Prompts 10–12.
