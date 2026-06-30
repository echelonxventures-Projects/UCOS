# Skill — Production Readiness

**Skill ID:** SKILL-014
**Governs:** Readiness assessment feeding certification (Prompt 12).
**Authority source:** `.claude/governance/completion-criteria.md`, all gates.

## Purpose
Determine whether an increment is genuinely ready to operate in production.

## When to apply
Before release and as input to certification.

## Readiness Dimensions (checklist)
1. **Functional** — acceptance criteria verified by passing tests.
2. **Contract** — boundaries versioned, contract-tested, backward-compatible.
3. **Security** — authn/authz, threat mitigations, secrets externalized, audit logging.
4. **Reliability** — idempotency, retries, timeouts, failover, backups, tested recovery.
5. **Observability** — logs, metrics, traces, health, alerts, SLOs defined.
6. **Operability** — runbooks, on-call, rollback strategy, capacity plan.
7. **Documentation** — current docs and ADRs; documentation gate passed.
8. **Traceability** — full lineage; zero open blocking gaps.

## Inputs
- Gate results, traceability & gap reports, test results, operability artifacts.

## Outputs
- Readiness assessment (per dimension: ready / not-ready + evidence).

## Definition of Done
- All dimensions ready, OR each not-ready item is a recorded, owned gap blocking certification.

## Anti-patterns
- "Works on my machine" readiness; assuming readiness; releasing with open blocking gaps.

## Traceability
- Refines: CTX-PRIN-001 (P10), all gates
- Feeds: certification factory (Prompt 12), release-gates.
