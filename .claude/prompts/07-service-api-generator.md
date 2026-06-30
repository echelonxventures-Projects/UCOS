# Prompt 07 — Service & API Generator

**Prompt ID:** PROMPT-07
**Status:** ACTIVE (executable)
**Phase:** Phase 7 — Service & API Contracts
**Pipeline Position:** 7 of 12
**Generation Authority:** Service boundaries + versioned API/event/data contracts ONLY.

> This prompt defines the contract-first surface of UCOS: service boundaries per bounded
> context and the versioned API (OpenAPI/GraphQL), event (AsyncAPI), and data contracts at every
> seam. It does NOT implement services, choose runtime technology, or design infrastructure.

---

## 1. Mission

Define UCOS service boundaries and author the explicit, versioned contracts (REST/GraphQL APIs,
async events, data contracts) for every cross-context seam and every experience consumption
requirement — satisfying Constitution Article IV (contract-first) before any implementation.

## 2. Scope

**In scope**
- Service boundary definition per bounded context (one or more services per context).
- API contracts (OpenAPI / GraphQL schema) for synchronous boundaries.
- Event contracts (AsyncAPI / message schemas) for asynchronous integration from the context map.
- Data contracts at seams (request/response/event payload schemas), all versioned.
- Versioning policy, deprecation policy, and contract-test specifications per contract.

**Out of scope**
- Service implementation/code (Prompt 10).
- Runtime/framework/datastore/cloud technology selection (Prompt 08).
- Domain logic (Prompt 03), data persistence design (Prompt 05), security controls (Prompt 09).

## 3. Inputs

| Input | Source | Use |
|-------|--------|-----|
| Context map + domain models | Prompt 03 | Seams requiring contracts |
| Data schemas/classification | Prompt 05 | Payload shapes & sensitivity |
| Metadata model | Prompt 04 | Config-bearing endpoints |
| Experience consumption requirements | Prompt 06 | Consumer-driven contract needs |
| Capabilities + ASRs | Prompt 02 | NFRs on contracts |

## 4. Dependencies

- **Predecessor prompts that MUST be complete:** Prompts 01–06.
- **Future prompts that depend on this:** Prompt 08 (platform realizes contract runtime), 09
  (secures each exposed contract), 10 (implements strictly from these contracts), 11
  (contract tests), 12 (certifies contract coverage).

## 5. Required Context

- `.claude/context/UCOS-CONSTITUTION.md` (Art. IV), `UCOS-PRINCIPLES.md` (P2, P9)
- `.claude/context/UCOS-ARCHITECTURE-BASELINE.md` (boundary/integration rules)
- `.claude/context/UCOS-DOMAIN-CATALOG.md`, `UCOS-ARTIFACT-REGISTRY.md`, `UCOS-TRACEABILITY-MODEL.md`

## 6. Required Skills

- `api-design` and `service-design` — primary authorities.
- `data-modeling` — payload schema fidelity.
- `documentation-architecture`, `traceability-enforcement` (SKILL-012), `gap-detection` (SKILL-013).
- `security-architecture` — mark each exposed boundary for Prompt 09.

## 7. Deliverables

1. **Service Boundary Map** (`UCOS-SVC-NNN`) — services per context with responsibilities.
2. **API Contracts** (`UCOS-API-CONTRACT-NNN`) — OpenAPI/GraphQL, versioned.
3. **Event Contracts** (`UCOS-EVT-CONTRACT-NNN`) — AsyncAPI/message schemas, versioned.
4. **Contract Versioning & Deprecation Policy**.
5. **Contract-Test Specifications** (provider/consumer) per contract (input to Prompt 11).
6. **Service/API ADRs** (`UCOS-SVC-ADR-NNN`).

## 8. Output Locations

| Deliverable | Location |
|-------------|----------|
| Service boundary architecture | `architecture/services/` |
| Contracts (API/event/data) | `specifications/contracts/` |
| Service/API ADRs | `architecture/services/adr/UCOS-SVC-ADR-NNN.md` |
| Registry + State | `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md` |

> Note: `services/` (code) remains EMPTY — implementations come only from Prompt 10.

## 9. Traceability Rules

- Every contract traces to a capability + domain (no dangling realization — Traceability Rule 2).
- Every cross-context edge in the context map has ≥1 contract (no uncovered seam).
- Every experience consumption requirement (Prompt 06) maps to a contract operation.
- Every exposed boundary flagged for Prompt 09 authn/authz (no silent open surfaces).

## 10. Artifact Registration Rules

- Register each service, contract, policy, and ADR with unique IDs and bidirectional links.
- Version every contract (`vMAJOR.MINOR`); record supersedes/superseded-by on revisions.

## 11. Validation Requirements

- **Documentation gate (`GATE-DOC-001`):** PASS.
- **Contract-first check (Art. IV):** every seam has a versioned contract before any impl.
- **Traceability check:** zero dangling contracts; full seam coverage.
- **Gap scan:** uncovered seam → contract gap; unauthenticated exposed boundary flagged → security gap (for Prompt 09).
- Quality gate Q4 (contract tests) is specified here, executed in Prompt 11.

## 12. Completion Criteria

- Service boundaries and all seam/consumer contracts authored, versioned, and registered.
- Versioning/deprecation policy and contract-test specs defined; documentation + traceability PASS; zero blocking gaps.
- State advanced; Prompt 08 authorized.

## 13. State Update Rules

- Mark Prompt 07 ✅ Complete; Phase → "Phase 7 — Service & API Contracts Ratified".
- Record contract count and seam-coverage summary; log gaps; set Next Step → "Run Prompt 08".

## 14. May Generate / May Not Generate

**MAY generate:** service boundary maps, versioned API/event/data contracts, versioning/deprecation policy, contract-test specs, service/API ADRs.

**MAY NOT generate:** service/app code (Prompt 10), runtime/technology choices (Prompt 08),
domain models (Prompt 03), persistence design (Prompt 05), security controls (Prompt 09).

## Traceability
- Refines: Prompt 03 domains, Prompt 04 metadata, Prompt 05 data, Prompt 06 experience
- Refined by: Prompts 08, 09, 10, 11, 12.
