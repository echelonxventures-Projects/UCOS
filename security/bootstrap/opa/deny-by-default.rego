# =============================================================================
# UCOS PI-1 — WI-SEED.3 Security Bootstrap — deny-by-default authorization
# ADR-006 (OPA policy-as-code — RATIFIED selection). Baseline authz policy.
#
# S1 authorization baseline (SEC-CTL-002) + least-privilege (SEC-CTL-013, S5):
# every access is DENIED unless an explicit, governed allow-rule authorizes it.
# In PI-1, callers are authenticated as workload identities via mTLS
# (WI-SEED.3 mesh); full user/tenant identity (PE-08 / OIDC) arrives in PI-2.
#
# NON-WAIVABLE (IC-1 / P4): the default decision is deny. No temporary
# allow-all or bypass is permitted.
# Traceability: ADR-006; SEC-CTL-002/013; GATE-SEC-001 S1/S5.
# =============================================================================
package ucos.authz

import future.keywords.if
import future.keywords.in

# Default: DENY everything (deny-by-default; non-waivable).
default allow := false

# Explicit allow ONLY when:
#   1) the caller presents a verified mTLS workload identity (S1), AND
#   2) the caller's workload identity is on the governed allow-list for the
#      requested platform boundary, AND
#   3) no external (non-mesh) origin is involved (internal-only in PI-1).
allow if {
	input.transport.mtls == true
	input.caller.workload_identity != ""
	input.caller.workload_identity in data.governed_allowlist[input.target.boundary]
	input.request.origin == "internal"
}

# Deny reasons (for auditable decisions — SEC-CTL-011/012 downstream in PI-2).
deny_reason contains "mtls_required" if not input.transport.mtls
deny_reason contains "unknown_workload_identity" if input.caller.workload_identity == ""
deny_reason contains "external_origin_forbidden_in_pi1" if input.request.origin != "internal"
