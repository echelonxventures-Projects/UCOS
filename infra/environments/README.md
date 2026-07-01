# infra/environments/

**Environment provisioning (governance promotion stages) — `WI-SEED.2 (Platform Bootstrap)`.**

> Environments are **governance promotion stages** (`UCOS-IMP-DELIV-001` §4), realized as declarative IaC
> (**ADR-007** Terraform/OpenTofu + GitOps). The seed authors the definitions; live `apply` occurs in a
> provisioned environment at apply-time (not performed by the authoring seed).

| Environment | Path | Purpose | Gate to enter | ENV-PROD? |
|-------------|------|---------|---------------|:---------:|
| ENV-DEV | `dev/` | Per-team dev & unit verification | none | — |
| ENV-INT | `int/` | Cross-context contract integration | contract tests PASS (Q4) | — |
| ENV-STAGE | (deferred) | Optional full-gate dry-run | QUAL/SEC/DOC PASS | — |
| **ENV-PROD** | **NOT CREATED IN PI-1** | live operation | certification (Prompt 12) + `GATE-REL-001` | **prohibited (P5)** |

Invariants:
- One-directional, gate-bound promotion; no environment skipped.
- Non-waivable **S1/S3/S4** apply identically in every environment (no dev-exempt posture, IC-1).
- Declarative, drift-free, rollback-capable (ADR-007; `PE-13/15` posture).

**Traceability:** ADR-007 · `UCOS-IMP-DELIV-001` §4 · IC-1 · P5.
