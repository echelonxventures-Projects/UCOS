# infra/delivery/

**WI-SEED.4 Delivery Bootstrap — bootstrap-minimal CI/CD (PI-1).**

> A **bootstrap-minimal** delivery pipeline sufficient to build/test/scan/sign/promote PI-1 to
> ENV-DEV/ENV-INT. It **does NOT** deliver the full Delivery & CI/CD platform (`WP-PLT-14`) or
> Infrastructure & Provisioning (`WP-PLT-15`) — those are **PI-3** and will supersede this seed
> migration-only (IC-7). Registered in `CTX-REG-001` as **seed**.

| File | Purpose |
|------|---------|
| `pipeline.yaml` | Neutral pipeline-as-code: source → build → test → scan → sign → promote. |
| `gitops/README.md` | GitOps gated promotion ENV-DEV → ENV-INT (no ENV-PROD). |

**Technology (ADR-007):** Git + pipeline-as-code + Terraform/OpenTofu + GitOps (Argo/Flux) + Sigstore/cosign
+ OCI registry. The **concrete CI product** is expressed as a *neutral* pipeline-as-code contract here
(PEP-010); its product binding is a governed `WP-PLT-14` decision (PI-3) — **not** selected by the seed.

**Gates:** Q4 contract tests · FO-2/S7 dependency scan · signing/provenance stages `GATE-REL-001` R4–R7
(full REL enforcement is PI-7). No unsigned/unregistered artifact promoted (P5). No push/merge/tag on the
working branch; no ENV-PROD.

**Traceability:** ADR-007 · `UCOS-IMP-DELIV-001` · `UCOS-IMP-GOV-001` gates · `PEA-001` PE-14/15 · IC-3/IC-8.
