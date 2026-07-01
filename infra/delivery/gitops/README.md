# infra/delivery/gitops/

**WI-SEED.4 — GitOps gated promotion (ENV-DEV → ENV-INT).**

> Declarative, drift-free, rollback-capable promotion (ADR-007; GitOps Argo/Flux — bound at apply-time,
> not selected by the seed). One-directional, gate-bound.

Promotion path (PI-1):
```
ENV-DEV  --(GATE-QUAL/SEC/DOC PASS + contract tests Q4)-->  ENV-INT
ENV-INT  --( PI-1 exit is bounded here )-->  [ENV-STAGE optional; ENV-PROD PROHIBITED in PI-1]
```

Rules:
- No environment skipped; promotion requires the prior stage's gates to PASS (IC-3).
- **ENV-PROD is not a target in PI-1** (P5); it requires certification (Prompt 12) + `GATE-REL-001` (PI-7).
- Desired state is declarative in Git; reconciliation is continuous; rollback = revert to prior desired state.
- No secrets in GitOps manifests (S3); sensitive values by reference only (WI-SEED.5).

**Traceability:** ADR-007 · `UCOS-IMP-DELIV-001` §4 · IC-1/IC-3/IC-8 · P5.
