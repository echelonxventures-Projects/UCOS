# Prompt 08 — Platform Engineering Generator

**Prompt ID:** PROMPT-08
**Status:** ACTIVE (executable)
**Phase:** Phase 8 — Platform Engineering
**Pipeline Position:** 8 of 12
**Generation Authority:** Cross-cutting platform architecture + technology selection (ADRs) + infra design ONLY.

> This prompt makes the deferred technology decisions and designs the cross-cutting platform:
> runtime, datastores, messaging, identity/tenancy, observability, resilience, CI/CD, and
> infrastructure-as-code DESIGN. It selects technology via ADRs but does NOT write application/
> service/domain code (Prompt 10).

---

## 1. Mission

Design the UCOS platform engineering architecture and make the governed technology selections
(recorded as ADRs per the Architecture Baseline §5): runtime/compute, datastores realizing the
data architecture, messaging realizing event contracts, and the mandatory cross-cutting
platform services (identity/tenancy, configuration, observability, resilience, audit, CI/CD).

## 2. Scope

**In scope**
- Technology selection ADRs (language/runtime, datastores, messaging, cloud — Baseline §5).
- Cross-cutting platform services design: identity & tenancy, configuration delivery,
  observability (logs/metrics/traces/health), resilience/idempotency, audit, secrets management.
- Deployment topology, environments, CI/CD pipeline design, IaC architecture (design only).
- Capacity/scaling strategy aligned to ASRs (Prompt 02).

**Out of scope**
- Application/service/domain implementation code (Prompt 10).
- API/event contract definitions (Prompt 07) and domain/data/metadata models.
- Security controls authoring/threat model (Prompt 09) — platform provides the substrate;
  Prompt 09 owns the security design and control mapping.

## 3. Inputs

| Input | Source | Use |
|-------|--------|-----|
| ASRs / quality attributes | Prompt 02 | Scale/availability/perf targets |
| Data architecture | Prompt 05 | Datastore selection drivers |
| Service/event contracts | Prompt 07 | Runtime & messaging requirements |
| Metadata model | Prompt 04 | Configuration delivery mechanism |
| Architecture Baseline §4–§5 | `CTX-ARCHB-001` | Cross-cutting + tech-stance rules |

## 4. Dependencies

- **Predecessor prompts that MUST be complete:** Prompts 01–07.
- **Future prompts that depend on this:** Prompt 09 (security builds on platform substrate),
  Prompt 10 (implements on selected technology), 11 (validates against platform), 12
  (release gate uses observability/capacity/rollback designed here).

## 5. Required Context

- `.claude/context/UCOS-ARCHITECTURE-BASELINE.md` (§4 cross-cutting, §5 technology stance)
- `.claude/context/UCOS-PRINCIPLES.md` (P7 observability, P8 resilience, P10 readiness)
- `.claude/governance/release-gates.md` (R4–R7 inputs)
- `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `UCOS-TRACEABILITY-MODEL.md`

## 6. Required Skills

- `platform-engineering` — primary authority.
- `production-readiness` (SKILL-014) — operability dimensions.
- `security-architecture` — secrets/identity substrate (control authoring deferred to Prompt 09).
- `documentation-architecture`, `traceability-enforcement` (SKILL-012), `gap-detection` (SKILL-013).

## 7. Deliverables

1. **Technology Selection ADRs** (`UCOS-PLAT-ADR-NNN`) — each with context/decision/consequences.
2. **Platform Services Design** — identity/tenancy, configuration, observability, resilience, audit, secrets.
3. **Deployment Topology & Environments** — design of environments and runtime topology.
4. **CI/CD Pipeline Design** and **IaC Architecture** (design only; no live infra).
5. **Capacity & Scaling Plan** aligned to ASRs (feeds release gate R7).
6. **Observability Design** — dashboards/alerts/SLOs blueprint (feeds release gate R6).

## 8. Output Locations

| Deliverable | Location |
|-------------|----------|
| Platform architecture | `architecture/platform/` |
| Platform/technology ADRs | `architecture/platform/adr/UCOS-PLAT-ADR-NNN.md` |
| Infra design (IaC architecture) | `infra/` (design docs only; no provisioning) |
| Registry + State | `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md` |

## 9. Traceability Rules

- Every technology ADR traces to the ASR/contract/data requirement that justifies it.
- Every cross-cutting platform service traces to the Baseline §4 mandate it satisfies.
- Capacity/observability designs trace forward to release-gate checkpoints (R6/R7).
- No technology choice without a justifying ADR (Baseline §5).

## 10. Artifact Registration Rules

- Register each ADR, platform service design, topology, pipeline, and plan with unique IDs.
- Bidirectional links to ASRs (Prompt 02), data (Prompt 05), and contracts (Prompt 07).

## 11. Validation Requirements

- **Documentation gate (`GATE-DOC-001`):** PASS, including D2 (ADRs) and D6 (operability/runbooks).
- **Readiness pre-check:** all production-readiness dimensions have a designed platform answer.
- **Traceability check:** zero unjustified technology decisions.
- **Gap scan:** mandatory cross-cutting concern with no platform design → coverage gap.
- Security gate not yet exercised (Prompt 09); release-gate inputs prepared, not run.

## 12. Completion Criteria

- All technology ADRs recorded; cross-cutting platform services, topology, CI/CD, IaC, capacity, and observability designs authored and registered.
- Documentation gate PASS; readiness pre-check satisfied; zero blocking gaps.
- State advanced; Prompt 09 authorized.

## 13. State Update Rules

- Mark Prompt 08 ✅ Complete; Phase → "Phase 8 — Platform Engineering Ratified".
- Record selected technology stack summary (ADR IDs); log gaps; set Next Step → "Run Prompt 09".

## 14. May Generate / May Not Generate

**MAY generate:** technology ADRs, platform-service designs, deployment topology, CI/CD & IaC architecture (design), capacity/observability plans.

**MAY NOT generate:** application/service/domain code (Prompt 10), live infrastructure
provisioning, API/event contracts (Prompt 07), domain/data/metadata models, or the security
threat model & control mapping (Prompt 09).

## Traceability
- Refines: Prompt 02 ASRs, Prompt 05 data, Prompt 07 contracts, `CTX-ARCHB-001` §4–§5
- Refined by: Prompts 09, 10, 11, 12.
