# =============================================================================
# UCOS PI-1 — WI-SEED.2 Platform Bootstrap — ENV-INT
# Declarative IaC (ADR-007: Terraform/OpenTofu). Cloud-neutral (PEP-010).
# SEED SCOPE: environment definition only. No live apply by the authoring seed.
#
# ENV-INT is the cross-context contract-integration stage; entry gate is
# contract tests PASS (Q4). It is the PI-1 exit boundary (no ENV-PROD, P5).
#
# NON-WAIVABLE CONTROLS (IC-1): S1/S3/S4 enforced. NO SECRETS INLINE (S3).
# Traceability: ADR-001, ADR-006, ADR-007; UCOS-IMP-DELIV-001 §4; IC-1.
# =============================================================================

terraform {
  required_version = ">= 1.6"
  # Backend + provider bindings supplied via governed config at apply-time.
}

module "platform_baseline" {
  source = "../../runtime" # Kubernetes conformance baseline (ADR-001)

  environment          = "ENV-INT"
  promotion_stage      = "int"
  enforce_mtls_strict  = true  # S4
  deny_by_default      = true  # S1
  encryption_at_rest   = true  # S4 (keys by reference — WI-SEED.5)
  external_exposure    = false # internal-only in PI-1 (R-2)

  secret_refs = var.secret_refs
}

variable "secret_refs" {
  description = "Opaque references (external://...) resolved by the secrets/KMS primitive (WI-SEED.5). No secret values stored here (S3/SEC-CTL-005)."
  type        = map(string)
  default     = {}
}
