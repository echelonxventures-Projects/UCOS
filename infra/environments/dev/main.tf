# =============================================================================
# UCOS PI-1 — WI-SEED.2 Platform Bootstrap — ENV-DEV
# Declarative IaC (ADR-007: Terraform/OpenTofu). Cloud-neutral (PEP-010).
# SEED SCOPE: environment definition only. No live apply is performed by the
# authoring seed; `terraform apply` runs in a provisioned environment at
# apply-time under the delivery pipeline (WI-SEED.4) and GitOps promotion.
#
# NON-WAIVABLE CONTROLS (IC-1): S1/S3/S4 enforced in ENV-DEV identically to all
# environments (no dev-exempt posture). No ENV-PROD is defined in PI-1 (P5).
# NO SECRETS INLINE (S3): all sensitive inputs are resolved BY REFERENCE from
# the secrets/KMS primitive (WI-SEED.5); see var.secret_refs.
# Traceability: ADR-001, ADR-006, ADR-007; UCOS-IMP-DELIV-001 §4; IC-1.
# =============================================================================

terraform {
  required_version = ">= 1.6"
  # Backend + provider bindings are supplied via governed, environment-scoped
  # configuration at apply-time (no cloud vendor selected here — PEP-010).
}

module "platform_baseline" {
  source = "../../runtime" # Kubernetes conformance baseline (ADR-001)

  environment          = "ENV-DEV"
  promotion_stage      = "dev"
  enforce_mtls_strict  = true # S4 encryption-in-transit from day one (WI-SEED.3)
  deny_by_default      = true # S1 authz baseline from day one (WI-SEED.3)
  encryption_at_rest   = true # S4 (keys by reference — WI-SEED.5)
  external_exposure    = false # PI-1 foundation boundaries are INTERNAL-ONLY (R-2)

  # Secrets/keys are injected BY REFERENCE only (S3). Never inline values.
  secret_refs = var.secret_refs
}

variable "secret_refs" {
  description = "Opaque references (external://...) resolved by the secrets/KMS primitive (WI-SEED.5). No secret values are ever stored here (S3/SEC-CTL-005)."
  type        = map(string)
  default     = {}
}
