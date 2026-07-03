# B04-D — UCOS Intelligence Fabric Implementation Program (Part D)

| Field | Value |
|-------|-------|
| Artifact | **B04-D — Intelligence Fabric Implementation Program (Part D: Acceptance Tests · Implementation Backlog)** |
| Artifact ID | `B04-D-INTELLIGENCE-FABRIC-IMPLEMENTATION-PROGRAM` |
| Phase | **B04-D — Intelligence Fabric Construction Program (Part D)** |
| Layer | ARCHITECTURE / PLATFORM (implementation program — acceptance specification + build backlog; builds nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Continues | `B04-A` (§§ 1–4) + `B04-B` (§§ 5–9) + `B04-C` (§§ 10–13). **Prior sections are NOT regenerated.** |
| Mode | **IMPLEMENTATION PLANNING / DESIGN ONLY** — technology-neutral acceptance criteria and sequenced work backlog. **No source code, no test code, no runtime, no infrastructure, no services, no model weights, no test-framework/transport/protocol/language/vendor selection, no governance invention, no execution, no `git` mutation** beyond this additive architecture `*.md`. Append-only. |
| Scope of Part D | **Deliverables 14–15 only:** (14) Acceptance Tests, (15) Implementation Backlog. **Stops after the Implementation Backlog.** This is the terminal part of the B04 Intelligence Fabric Implementation Program. |
| Binding requirements | **Registry-driven · Provider-agnostic · Model-agnostic · No hard-coded agents · No hard-coded workflows · Propose-not-act · Deny-by-default · Evolution-only commit** |
| Authoritative inputs | `B04-A`/`B04-B`/`B04-C`; `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001`, `INT-THREAT-001`, `INT-READINESS-001`, `INTEL-001`; `MEM-*` (PI-9), `KNOW-*`/PI-7, `ONTO-*` (PI-8), Evolution (PI-6/AD-0019), Federation (PI-5/AD-0018), Control (PI-4/AD-0017), Substrate (PI-2/3/AD-0016); AUTH-003/008/009/010/012; Constitution Art. IX/XII; INV-1..13; AD-0014 |
| Governance posture | `UCOS-CONSTRUCTION-BLOCKED` + Article IX generation lock remain **ACTIVE**. This program authorizes nothing and releases no lock. PI-10 construction remains a future Approval-Required Operation gated on `AD-0024`. |
| **Determination** | **INTELLIGENCE FABRIC PROGRAM (PART D) COMPLETE — B04 SERIES COMPLETE** — acceptance criteria and the sequenced, gated implementation backlog are specified and construction-planning-ready under governance. |

> Acceptance tests are **specifications of required behavior**, not test code — no test framework, harness,
> runner, assertion library, or language is selected (deferred to a Prompt 08 ADR). Each test is a
> `{ id, intent, preconditions, stimulus, required-observation, oracle, traces }` contract. Every test is
> **deny-by-default** and **fail-closed** in its expectation: the *default* required observation for any
> unresolved, unauthorized, ungrounded, or unverified condition is **refusal + audit**, never silent success.
> The backlog sequences *prospective* construction only; it commences **nothing** and remains gated behind a
> future `AD-0024`.

---

## 14. Acceptance Tests

### 14.0 Acceptance conventions (binding)

- **Test contract shape.** `{ id, category, intent, preconditions, stimulus, required-observation, oracle, traces[] }`. The **oracle** is deterministic: a test passes only if the required observation is reproducible from recorded inputs + pinned snapshots + seed (INV-6). No oracle depends on wall-clock, provider identity, or model internals.
- **Default expectation (deny-by-default).** Where a precondition (authorization, grounding, snapshot, budget, verifier, quorum, capability, role, audit-append) is absent or fails, the **required observation is refusal + audit event**, never a partial governed effect. Tests assert the *closed* outcome explicitly.
- **Evolution-only commit oracle.** No test may observe a governed-state mutation that did not transit `INT.Decision.Commit → PI-6 Evolution`. A test that observes any other write path is a **failing** test by construction.
- **Provider/model-agnostic oracles.** Determinism and governance tests must pass under **≥2 substitutable providers** and **≥2 substitutable models** (including one deterministic and one non-deterministic) resolved purely by registry ID (§12). No oracle references a concrete provider/model/vendor.
- **Registry-only fixtures.** All agents, capabilities, tools, workflows, views, models, and policies used by tests are **registry records**, not compiled-in fixtures. A test that requires a hard-coded agent or workflow is invalid (violates the binding requirements).
- **Traceability.** Every test traces to at least one engine (`INT-ENG-01..08`), one binding requirement, and one governing invariant/principle (INV-*, DI-*, IGP-*, S1/S3/S4, IP-*).
- **Coverage exit rule.** The suite is *acceptance-complete* only when every engine, every API operation (§10), every `INT_*` event class (§11), every registry kind (§12), every runtime sequence (§13), and every failure row (§13.8) is covered by ≥1 test, and every binding requirement is covered by ≥1 dedicated adversarial (negative) test.

### 14.1 Test taxonomy (13 categories)

| # | Category | ID prefix | Purpose | Primary oracle |
|:-:|----------|-----------|---------|----------------|
| A | Engine-level | `AT-ENG-*` | Each engine meets its Part-A/B contract in isolation | Contract postconditions |
| B | Integration | `AT-INT-*` | Cross-engine sequences (§13) compose correctly | End-to-end sequence trace |
| C | Determinism | `AT-DET-*` | Reproducibility + non-det quarantine (INV-6) | Byte-identical replay |
| D | Governance | `AT-GOV-*` | Deny-by-default, SoD, quorum, approval, propose-not-act | Refusal + audit |
| E | Registry resolution | `AT-REG-*` | Registry-driven, provider/model-agnostic resolution | Resolved record / fail-closed |
| F | Agent lifecycle | `AT-AGT-*` | Define→activate→act→abort; no self-grant/commit | Instance state + capability gate |
| G | Memory | `AT-MEM-*` | Read-only recall, snapshot, propose-durable (PI-9) | No-direct-write invariant |
| H | Knowledge | `AT-KNW-*` | Grounded reads, evidence-drop, propose-change (PI-7/8) | Grounding fail-closed |
| I | Reasoning | `AT-RSN-*` | Session, rationale chain, constraint satisfaction | Hash-chained rationale |
| J | Planning | `AT-PLN-*` | Feasible/infeasible; infeasible never proposable | Plan verdict + trace |
| K | Learning | `AT-LRN-*` | Advisory-only, dual-verified adoption | Verifier attestation gate |
| L | Coordination | `AT-COO-*` | Protocol-as-data orchestration; per-step gating | Step-gate + SoD trace |
| M | Failure-recovery | `AT-FRC-*` | Every failure fails closed; forward-only recovery | Closed state + no partial commit |

---

### 14.2 (A) Engine-level tests — `AT-ENG-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-ENG-01` | ENG-01 Memory recall is read-only | `INT.Memory.Recall` over a memory-view | Returns pinned recall set; **no** mutation of any tier; recall is S4-monotonic | ENG-01, IGP-10, S4 |
| `AT-ENG-02` | ENG-02 Knowledge query is grounded | `INT.Knowledge.Query` with grounded terms | Returns grounded evidence only; ungrounded terms excluded | ENG-02, IGP-9 |
| `AT-ENG-03` | ENG-03 Reasoning emits proposal + rationale | Open session → infer | Proposal carries hash-chained `evidence→inference→conclusion` rationale | ENG-03, INV-6 |
| `AT-ENG-04` | ENG-04 Planning returns verdict + trace | `INT.Plan.Generate` | `feasible+trace` or `infeasible`; deterministic | ENG-04, DI-3 |
| `AT-ENG-05` | ENG-05 Learning output is advisory | `INT.Learn.Invoke` | Emits Learned Artifact tagged advisory; records `modelRef/seed/inputsHash` | ENG-05, DI-7 |
| `AT-ENG-06` | ENG-06 Agent instance is bounded | `INT.Agent.Activate` | Instance bound to authorized goal + budgets; no implicit capability | ENG-06, IP-04 |
| `AT-ENG-07` | ENG-07 Coordination interprets protocol data | `INT.Coord.Start` | Roles/sequence resolved from Protocol record; no compiled workflow | ENG-07, no-hard-coded-workflows |
| `AT-ENG-08` | ENG-08 Context assembly seals bundle | `INT.Context.Assemble` | Content-hashed sealed bundle w/ grounding+snapshots; immutable | ENG-08, DI-2 |
| `AT-ENG-09` | Engine boundary isolation | Direct call bypassing engine port | Rejected; no shared mutable model crossed | §2 composition rules |

### 14.3 (B) Integration tests — `AT-INT-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-INT-01` | Full cognition→commit path | Goal→Context→Reason→Certify→Ratify→Commit | Governed state changes **only** via Evolution; complete audit chain | §13.3, Evolution-only |
| `AT-INT-02` | Context assembly feeds reasoning | ENG-08 → ENG-03 | Session refuses to open without sealed bundle | §13.2/13.3, DI-2 |
| `AT-INT-03` | Planning ⟂ reasoning boundary | Infeasible plan into reasoning | Proposal blocked; `INT_PLAN_INFEASIBLE` | §13.4, DI-3 |
| `AT-INT-04` | Learning advisory into reasoning | Unverified learned artifact | Never influences committed decision | §13.5, DI-7 |
| `AT-INT-05` | Coordination sequences agents | Multi-agent protocol | Per-step policy+SoD gate; ordered proposals→decision | §13.7 |
| `AT-INT-06` | Memory+Knowledge co-snapshot | Assemble bundle | Both snapshots pinned at same session scope; ceilings consistent | §13.2, S4 |
| `AT-INT-07` | Federation advisory clamp | Foreign contribution into local session | Advisory/clamped; local ratification required before any commit | INT-FED-001 |
| `AT-INT-08` | End-to-end audit continuity | Any committed decision | `event→rationale→evidence/snapshots` fully linked | §11.6, INT-AUD-001 |

### 14.4 (C) Determinism tests — `AT-DET-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-DET-01` | Reproducible decision | Re-run session w/ same inputs+snapshots+seed | Byte-identical proposal, rationale, decision | INV-6, §13.9 |
| `AT-DET-02` | Replay is effect-free | Replay committed events from ledger | State reconstructed; **no** re-commit | §11.5 |
| `AT-DET-03` | Non-det quarantine boundary | Inject stochastic model output | Value cannot cross into commit path unverified | §13.9, DI-7 |
| `AT-DET-04` | Model-agnostic determinism | Same session under 2 substitutable models | Committed decision identical (verified path) | Model-agnostic |
| `AT-DET-05` | Provider-agnostic determinism | Same op under 2 substitutable providers | Identical governed result | Provider-agnostic |
| `AT-DET-06` | Snapshot pinning integrity | Alter underlying source after pin | Session still reproduces from pinned snapshot | §10.12 |
| `AT-DET-07` | Replay divergence alarm | Corrupt one replay input | Fail-closed integrity alarm; no silent accept | §11.5 |

### 14.5 (D) Governance tests — `AT-GOV-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-GOV-01` | Deny-by-default | Operation with no matching allow policy | `INT-ERR-AUTHZ` deny + audit; no effect | Deny-by-default |
| `AT-GOV-02` | Propose-not-act | Any command | Sole effect is a proposed Evolution Unit; no direct mutation | Propose-not-act |
| `AT-GOV-03` | Separation of duties | Same principal certifies+ratifies | `INT-ERR-SOD`; rejected | §10.11 |
| `AT-GOV-04` | Ratification quorum | Consequential decision w/o quorum | `INT-ERR-QUORUM`; held | §10.11 |
| `AT-GOV-05` | Approval-required hold | Consequential class decision | `INT_APPROVAL_REQUIRED`; human/Board gate (IGP-4) | IGP-4, AUTH-012 |
| `AT-GOV-06` | Classification ceiling | Op exceeding S4 ceiling | `INT-ERR-CLASSIFICATION`; excluded | S4 |
| `AT-GOV-07` | Secrets-by-reference | Register record w/ inlined secret/weight | Rejected at validation | S3 |
| `AT-GOV-08` | Revocation propagation | Revoke an authority/agent/tool | Forward, propagating; unknown state treated as revoked | §13.8 |
| `AT-GOV-09` | Un-audited effect impossible | Force audit-append failure | Operation fails closed; no governed effect | §11.6 |
| `AT-GOV-10` | Additive-only evolution | Attempt destructive record rewrite | Rejected; migration-only | IP-14/IP-15 |

### 14.6 (E) Registry resolution tests — `AT-REG-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-REG-01` | Registry-driven behavior | Add agent/tool/protocol record → use it | Behavior changes with **no** code change | Registry-driven, IP-04 |
| `AT-REG-02` | By-ID + version resolution | Resolve `intelligence:<kind>:<id>@ver` | Correct record; no by-name provider coupling | §12.3 |
| `AT-REG-03` | Active-only resolution | Resolve a draft/superseded model for live cognition | Fail-closed; not resolvable | §12.3 |
| `AT-REG-04` | Zero-orphan | Reference an unresolved record | `INT-ERR-*` fail-closed; no default fallback | §12.3 |
| `AT-REG-05` | Schema + allow-list validation | Register record violating contract / unknown capability | Rejected pre-registration | §12.4 |
| `AT-REG-06` | Non-det model needs verifier | Register non-det model w/o bound verifier | Rejected until deterministic verifier bound | §12.4, INV-6 |
| `AT-REG-07` | Local-shadows-foreign | Foreign record collides with local | Local shadows; foreign namespace-isolated + advisory | §12.3 |
| `AT-REG-08` | Provider swap agnosticism | Swap `providerRef` on a tool record | Same contract satisfied; oracle unchanged | Provider-agnostic |

### 14.7 (F) Agent lifecycle tests — `AT-AGT-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-AGT-01` | Define via registry | `INT.Agent.Define` | Proposes Agent Definition record; nothing compiled-in | No hard-coded agents |
| `AT-AGT-02` | Activate bounded instance | `INT.Agent.Activate` | Instance bound to authorized goal + budgets + key | ENG-06 |
| `AT-AGT-03` | No self-grant of capability | Agent attempts capability outside allow-list | `INT-ERR-CAPABILITY-UNKNOWN`; deny | §10.4 |
| `AT-AGT-04` | No direct commit | Agent attempts to commit | Blocked; only propose→Evolution | Propose-not-act |
| `AT-AGT-05` | Budget exhaustion abort | Drive instance past budget | `INT-ERR-BUDGET`; fail-closed abort; no partial commit | §13.8 |
| `AT-AGT-06` | Explicit abort | `INT.Agent.Abort` | Fail-closed teardown; audited | §10.4 |
| `AT-AGT-07` | Per-action audit | Any agent action | Each action audited (`INT_AGENT_*`) | §11.6 |
| `AT-AGT-08` | Revoked agent | Act with revoked agent | Denied; treated as revoked | §13.8 |

### 14.8 (G) Memory tests — `AT-MEM-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-MEM-01` | Read-only recall | `INT.Memory.Recall` | No tier mutation; deny-by-default on view | IGP-10, ENG-01 |
| `AT-MEM-02` | Sealed snapshot immutability | `INT.Memory.SealSnapshot` | Content-hashed, immutable recall set | §10.5 |
| `AT-MEM-03` | No direct write / no forget | Attempt direct write or delete | Rejected; owned by PI-9 | IGP-10 |
| `AT-MEM-04` | Durable via Evolution only | `INT.Memory.ProposeDurable` | Emits Evolution Unit; commit only via PI-6 | Evolution-only |
| `AT-MEM-05` | Recall on expired/revoked | Recall past expiry/revocation | Deny (`INT_MEMORY_RECALL_DENIED`) | §12.2 |
| `AT-MEM-06` | Classification ceiling on recall | Recall above ceiling | Excluded; S4-monotonic | S4 |

### 14.9 (H) Knowledge tests — `AT-KNW-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-KNW-01` | Grounded evidence only | Query w/ mixed grounded/ungrounded terms | Ungrounded dropped fail-closed (`INT_EVIDENCE_DROPPED_UNRESOLVED`) | IGP-9 |
| `AT-KNW-02` | Grounding to active ontology | `INT.Knowledge.Ground` | Resolves to `active` ontology snapshot only | DI-11, PI-8 |
| `AT-KNW-03` | Ungrounded ⇒ no session | Assemble w/ unresolvable grounding | `INT-ERR-GROUNDING`; `INT_CONTEXT_INVALID` | DI-2 |
| `AT-KNW-04` | Snapshot seal immutability | `INT.Knowledge.SealSnapshot` | Immutable content-hashed knowledge snapshot | §10.6 |
| `AT-KNW-05` | Change via Evolution only | `INT.Knowledge.ProposeChange` | Emits Evolution Unit; no direct graph write | Evolution-only |
| `AT-KNW-06` | Ontology version pin | Re-run after ontology advances | Reproduces from pinned grounding binding | §10.12 |

### 14.10 (I) Reasoning tests — `AT-RSN-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-RSN-01` | Bounded session open | `INT.Session.Open` | Requires grounding + sealed bundle + seed; else fail-closed | §13.3 |
| `AT-RSN-02` | Rationale chain integrity | Submit proposal | Hash-chained `evidence→inference→conclusion`; tamper-evident | §10.3 |
| `AT-RSN-03` | Hard-constraint satisfaction | Proposal violating hard constraint | `INT-ERR-CONSTRAINT`; rejected | §10.11 |
| `AT-RSN-04` | Missing rationale | Submit w/o rationale ref | `INT-ERR-RATIONALE-MISSING` (RATIONALE-MISSING) | §10.2 |
| `AT-RSN-05` | Deterministic orchestration | Re-run same session | Identical decision path | INV-6 |
| `AT-RSN-06` | Consequence cap on goal | Propose goal above consequence cap | `INT-ERR-CONSEQUENCE-CAP`; blocked | §10.2 |

### 14.11 (J) Planning tests — `AT-PLN-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-PLN-01` | Feasible plan + trace | Solvable goal+constraints | `feasible plan + trace`; deterministic | §13.4 |
| `AT-PLN-02` | Infeasible never proposable | Unsatisfiable hard constraints | `INT_PLAN_INFEASIBLE`; cannot be submitted as Proposal | DI-3 |
| `AT-PLN-03` | Grounded terms required | Plan over ungrounded terms | Fail-closed; no plan | IGP-9 |
| `AT-PLN-04` | Soft-constraint weighting | Competing feasible plans | Deterministic weighted selection + trace | §13.4 |
| `AT-PLN-05` | Plan reproducibility | Re-run same planning input | Identical verdict + trace | INV-6 |

### 14.12 (K) Learning tests — `AT-LRN-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-LRN-01` | Advisory-only default | Emit learned artifact | Tagged advisory; no influence pre-verification | DI-7 |
| `AT-LRN-02` | Dual-verifier gate | Adoption w/ only one verifier passing | `INT-ERR-VERIFIER-FAIL`; no adoption | §10.8 |
| `AT-LRN-03` | Adoption via Evolution only | Both verifiers pass → adopt | `INT.Learned.ProposeAdoption` → Evolution (migration-only) | Evolution-only |
| `AT-LRN-04` | No self-modification | Learning attempts to alter own engine | Rejected; advisory only | DI-7 |
| `AT-LRN-05` | Reproducible advisory record | Re-run learning invoke | `modelRef/seed/inputsHash` reproduce recorded output | INV-6 |
| `AT-LRN-06` | Non-det model isolation | Stochastic model output | Recorded reproducibly; quarantined from commit | §13.9 |

### 14.13 (L) Coordination tests — `AT-COO-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-COO-01` | Protocol-as-data | Start coordination from Protocol record | Roles/messages/sequence interpreted; no compiled workflow | No hard-coded workflows |
| `AT-COO-02` | Per-step deny-by-default | Step lacking policy allow | `INT_COORD_STEP_GATED` deny; audited | Deny-by-default |
| `AT-COO-03` | Per-step SoD | Step violating SoD | `INT-ERR-SOD`; step blocked | §13.7 |
| `AT-COO-04` | Role capability check | Bind agent lacking role capability | `INT-ERR-ROLE-UNRESOLVED`; fail-closed abort | §13.7 |
| `AT-COO-05` | Foreign contribution clamp | Foreign agent contribution | Advisory/clamped; no local commit without local ratification | INT-FED-001 |
| `AT-COO-06` | Ordered proposal→decision | Multi-step protocol | Causally ordered per session; commit Evolution-serialized | §11.3 |
| `AT-COO-07` | Abort no partial commit | Abort mid-sequence | `INT_COORD_SESSION_ABORTED`; zero partial commit | §13.8 |

### 14.14 (M) Failure-recovery tests — `AT-FRC-*`

| ID | Intent | Stimulus | Required observation | Traces |
|----|--------|----------|----------------------|--------|
| `AT-FRC-01` | Unresolved grounding | Stale/unresolved grounding | Abort assembly; `INT_CONTEXT_INVALID`; no seal | §13.8 |
| `AT-FRC-02` | Budget exhaustion | Exhaust session budget | Abort; no partial commit | §13.8 |
| `AT-FRC-03` | Policy/SoD/quorum failure | Trigger each | Reject/hold; audited; no effect | §13.8 |
| `AT-FRC-04` | Verifier rejection recovery | Reject advisory | Discarded; system continues; no adoption | §13.8 |
| `AT-FRC-05` | Evolution rejection | PI-6 rejects commit | Decision stays ratified/uncommitted; **forward retry only** (no rewrite) | §13.8 |
| `AT-FRC-06` | Audit-append failure | Fail ledger append | Operation fails closed; no un-audited effect | §11.6 |
| `AT-FRC-07` | Revocation mid-flight | Revoke construct during session | Propagates fail-closed; unknown ⇒ revoked | §13.8 |
| `AT-FRC-08` | Federated invalid contribution | Malformed foreign event | Ignored/denied; local integrity intact | §13.8 |
| `AT-FRC-09` | Crash/restart reconstruction | Restart after fault mid-session | Reconstructs from ledger; no double-commit (idempotency token) | §11.4/11.5 |
| `AT-FRC-10` | Idempotent re-delivery | Re-deliver event/commit | Exactly-once effect; no double-commit | §11.4 |

### 14.15 Coverage matrix (engine × category)

| Engine \ Cat | A | B | C | D | E | F | G | H | I | J | K | L | M |
|--------------|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| ENG-01 Memory | ● | ● | ● | ● | ● | | ● | | | | | | ● |
| ENG-02 Knowledge | ● | ● | ● | ● | ● | | | ● | | | | | ● |
| ENG-03 Reasoning | ● | ● | ● | ● | | | | | ● | | | ● | ● |
| ENG-04 Planning | ● | ● | ● | ● | | | | ● | | ● | | | ● |
| ENG-05 Learning | ● | ● | ● | ● | ● | | | | | | ● | | ● |
| ENG-06 Agent | ● | ● | ● | ● | ● | ● | | | | | | ● | ● |
| ENG-07 Coordination | ● | ● | ● | ● | | ● | | | | | | ● | ● |
| ENG-08 Context | ● | ● | ● | ● | ● | | ● | ● | ● | | | | ● |

- **Exit rule (restated):** acceptance is complete only when the matrix has no gap for any engine's applicable categories **and** each binding requirement (registry-driven, provider-agnostic, model-agnostic, no-hard-coded-agents, no-hard-coded-workflows, propose-not-act, deny-by-default, evolution-only-commit) has ≥1 dedicated negative test (`AT-GOV-*`/`AT-REG-*`/`AT-AGT-*`/`AT-COO-*`).

---

## 15. Implementation Backlog

> The backlog is **prospective and gated**. It authorizes and commences nothing. All construction is confined to
> `src/control/intelligence/*` (additive; zero prohibited-core-dir change) and is released only under a future
> `AD-0024` (scoped Article IX release). Each work package's *first* exit criterion is the applicable acceptance
> tests (§14) passing under **≥2 providers and ≥2 models** resolved by registry.

### 15.1 Work packages (WP)

| WP | Title | Scope (prospective) | Delivers | Primary tests |
|----|-------|---------------------|----------|---------------|
| `WP-00` | Fabric scaffold & registry binding | `intelligence:*` registry kinds (§12), record schemas, resolution/validation adapters over PI-2/3 | Registry-driven substrate binding; zero compiled-in records | `AT-REG-*` |
| `WP-01` | Context engine (ENG-08) | Grounding resolve, snapshot pin, seal | Sealed Context Bundle | `AT-ENG-08`, `AT-KNW-02/03`, `AT-DET-06` |
| `WP-02` | Memory adapter (ENG-01) | Read-only recall, seal, propose-durable over PI-9 | Recall + durable-proposal path | `AT-MEM-*` |
| `WP-03` | Knowledge adapter (ENG-02) | Grounded query, evidence-drop, propose-change over PI-7/8 | Grounded read + change-proposal path | `AT-KNW-*` |
| `WP-04` | Reasoning engine (ENG-03) | Bounded session, rationale chain, constraint eval, certify/ratify | Proposal→decision path | `AT-RSN-*`, `AT-ENG-03` |
| `WP-05` | Planning engine (ENG-04) | Feasible/infeasible + trace, constraint weighting | Plan verdict | `AT-PLN-*` |
| `WP-06` | Evolution commit hand-off | `INT.Decision.Commit`→PI-6; idempotency token; forward-only | Sole commit path | `AT-INT-01`, `AT-FRC-05/10` |
| `WP-07` | Control-plane binding | Deny-by-default policy eval, SoD, quorum, approval-required, classification | Governance gate | `AT-GOV-*` |
| `WP-08` | Audit binding | `INT_*` events over hash-chained FederatedAuditLog; replay | Audit + replay | `AT-INT-08`, `AT-DET-02/07`, `AT-GOV-09` |
| `WP-09` | Agent runtime (ENG-06) | Define/activate/act/abort; capability allow-list; budgets | Bounded agents | `AT-AGT-*` |
| `WP-10` | Learning engine (ENG-05) | Advisory adapter, dual verifiers, propose-adoption | Verified adoption path | `AT-LRN-*`, `AT-DET-03` |
| `WP-11` | Coordination engine (ENG-07) | Protocol-as-data interpreter; per-step gate/SoD | Multi-agent orchestration | `AT-COO-*` |
| `WP-12` | Federation clamp binding | Foreign advisory/clamp; local-shadows-foreign; local ratification | Cross-node safety | `AT-INT-07`, `AT-COO-05`, `AT-FRC-08` |
| `WP-13` | Determinism & replay harness | Reproducibility oracle; non-det quarantine boundary | Determinism guarantees | `AT-DET-*` |
| `WP-14` | Failure-recovery hardening | Fail-closed paths, crash/restart reconstruction, revocation propagation | Recovery guarantees | `AT-FRC-*` |
| `WP-15` | Acceptance suite & coverage closure | Realize §14 as executable specs; close coverage matrix | Acceptance-complete evidence | all `AT-*` |

### 15.2 Build waves

| Wave | Theme | Work packages | Rationale |
|:----:|-------|---------------|-----------|
| **W0 — Substrate binding** | Registry + governance + audit spine | `WP-00`, `WP-07`, `WP-08` | Everything is registry-driven, deny-by-default, audited *before* any cognition exists |
| **W1 — Read & ground** | Context, memory, knowledge | `WP-01`, `WP-02`, `WP-03` | Grounded, snapshot-pinned inputs must exist before reasoning |
| **W2 — Reason, plan, commit** | Core cognition + sole commit path | `WP-04`, `WP-05`, `WP-06` | Propose→decision→Evolution is the fabric's spine |
| **W3 — Autonomy** | Agents + learning | `WP-09`, `WP-10` | Registry-resolved agents and dual-verified learning build on cognition |
| **W4 — Orchestration & federation** | Coordination + federated clamp | `WP-11`, `WP-12` | Multi-agent + cross-node only after single-agent governance proven |
| **W5 — Assurance** | Determinism, recovery, acceptance | `WP-13`, `WP-14`, `WP-15` | Reproducibility, fail-closed recovery, and coverage closure certify the fabric |

### 15.3 Dependencies

```
W0: WP-00 ──▶ WP-07 ──▶ WP-08         (registry → policy gate → audit spine)
                     │
W1:  WP-01 (Context) ◀── depends on WP-00, WP-08
     WP-02 (Memory)  ◀── WP-00, WP-08              WP-01 depends on WP-02 + WP-03
     WP-03 (Knowledge)◀── WP-00, WP-08, PI-8 grounding
                     │
W2:  WP-04 (Reasoning) ◀── WP-01, WP-07, WP-08
     WP-05 (Planning)  ◀── WP-01
     WP-06 (Commit)    ◀── WP-04, PI-6 Evolution
                     │
W3:  WP-09 (Agents)   ◀── WP-04, WP-06, WP-07
     WP-10 (Learning) ◀── WP-04, WP-06, WP-13(verifier oracle)
                     │
W4:  WP-11 (Coord)    ◀── WP-09, WP-07
     WP-12 (Federation)◀── WP-11, PI-5
                     │
W5:  WP-13 (Determinism) ◀── WP-04, WP-06   (cross-cuts; oracle reused by WP-10)
     WP-14 (Recovery)    ◀── WP-06, WP-08, WP-11
     WP-15 (Acceptance)  ◀── ALL
```

- **External (must be RATIFIED/available, not built here):** PI-2/3 substrate registry, PI-4 control plane, PI-5 federation, PI-6 Evolution, PI-7 knowledge, PI-8 ontology, PI-9 memory, `INT-AUD-001` audit log.
- **Cross-cutting:** `WP-13` (determinism) and `WP-08` (audit) are consumed by every later WP; `WP-07` (deny-by-default) gates every operation.

### 15.4 Exit criteria (per work package)

| WP | Exit criteria (all must hold) |
|----|-------------------------------|
| `WP-00` | Every `intelligence:*` kind registers/validates/resolves by-ID+version; zero-orphan fail-closed; `AT-REG-*` pass under ≥2 providers |
| `WP-01` | Bundle seals only with resolvable grounding + pinned snapshots; `AT-ENG-08`, `AT-KNW-02/03` pass; fail-closed on unresolved grounding |
| `WP-02` | No memory write path exists except propose-durable→Evolution; recall read-only + ceiling-enforced; `AT-MEM-*` pass |
| `WP-03` | Ungrounded evidence dropped fail-closed; change only via Evolution; `AT-KNW-*` pass |
| `WP-04` | Every proposal carries verifiable hash-chained rationale; constraints enforced; deterministic; `AT-RSN-*` pass |
| `WP-05` | Infeasible plans never proposable; deterministic verdict+trace; `AT-PLN-*` pass |
| `WP-06` | Commit occurs **only** via PI-6; idempotency token prevents double-commit; forward-only on reject; `AT-INT-01`, `AT-FRC-05/10` pass |
| `WP-07` | Deny-by-default proven (no allow ⇒ deny); SoD/quorum/approval/classification enforced; `AT-GOV-*` pass |
| `WP-08` | No un-audited governed effect; replay effect-free + divergence alarm; `AT-DET-02/07`, `AT-GOV-09` pass |
| `WP-09` | No self-grant / no direct commit; capability allow-list enforced; budgets bound; `AT-AGT-*` pass |
| `WP-10` | Advisory-only until dual-verified; adoption via Evolution; no self-modification; `AT-LRN-*` pass |
| `WP-11` | Protocol-as-data (no compiled workflow); per-step deny+SoD; abort ⇒ no partial commit; `AT-COO-*` pass |
| `WP-12` | Foreign advisory/clamped; local-shadows-foreign; local ratification required; `AT-INT-07`, `AT-FRC-08` pass |
| `WP-13` | Byte-identical reproducibility under ≥2 models incl. one non-det; non-det quarantine holds; `AT-DET-*` pass |
| `WP-14` | Every §13.8 failure row fails closed; crash/restart reconstructs w/o double-commit; `AT-FRC-*` pass |
| `WP-15` | §14.15 coverage matrix has zero applicable gap; each binding requirement has ≥1 passing negative test |

### 15.5 Milestones

| Milestone | Meaning | Completed when |
|-----------|---------|----------------|
| **M-I0 — Spine ready** | Registry + deny-by-default + audit operational | W0 exit criteria met |
| **M-I1 — Grounded inputs** | Context/memory/knowledge read paths grounded & snapshotted | W1 exit criteria met |
| **M-I2 — Governed cognition** | Reason→plan→decide→**Evolution commit** end-to-end | W2 exit criteria met + `AT-INT-01` green |
| **M-I3 — Bounded autonomy** | Registry-resolved agents + dual-verified learning | W3 exit criteria met |
| **M-I4 — Orchestrated & federated** | Protocol-driven multi-agent + clamped federation | W4 exit criteria met |
| **M-I5 — Assured fabric** | Determinism + fail-closed recovery + acceptance-complete | W5 exit criteria met; §14 suite green |
| **M-I6 — Ratification-ready** | Independent PI-10 validation package assembled | M-I5 + independent validation evidence complete |

### 15.6 Authorization gates

| Gate | Precedes | Authority | Condition to pass |
|------|----------|-----------|-------------------|
| **G-A0 — Article IX release** | *All* construction (W0) | Authority Board (`AD-0024`) | Scoped Article IX release granted; `UCOS-CONSTRUCTION-BLOCKED` lifted **only** for `src/control/intelligence/*` MCF sub-scope |
| **G-A1 — Spine review** | W1 | Chief Authority Architect | M-I0 met; registry/deny-by-default/audit invariants independently verified |
| **G-A2 — Commit-path review** | W3 | Authority Board (Approval-Required) | M-I2 met; Evolution-only commit + propose-not-act proven; consequential-decision approval path exercised (IGP-4) |
| **G-A3 — Autonomy review** | W4 | Authority Board | M-I3 met; no self-grant/self-modify; capability allow-list + dual-verifier attested |
| **G-A4 — Federation review** | (federated activation) | Authority Board + Federation authority (PI-5) | M-I4 met; foreign-advisory-clamp + local-ratification proven; `INT-FED-001` satisfied |
| **G-A5 — Ratification gate** | PI-10 acceptance/enrollment | Independent validator → Authority Board | M-I5/M-I6 met; §14 acceptance-complete; independent PI-10 validation/ratification (mirrors prior PI-* enrollment); INV enrollment (if any) is a separate Board decision, **not** granted here |

- **Gate discipline (binding):** no wave begins before its preceding gate passes; every gate is **deny-by-default** (absence of explicit authorization ⇒ blocked); no gate here is *pre-granted* — each is a future Approval-Required Operation (AUTH-012 §8 / AD-0009).

---

> **END OF PART D — STOPS AFTER IMPLEMENTATION BACKLOG (per mandate).**
> **B04 series complete:** Part A (§§1–4) · Part B (§§5–9) · Part C (§§10–13) · Part D (§§14–15).
> **Not produced:** any code, test code, runtime, infrastructure, technology selection, or `git`/state mutation.

## Governance / Non-Construction Statement

No implementation produced; no code or test code generated; no runtime, infrastructure, services, or model
weights created; no test framework/harness/runner/transport/protocol/serialization/language/datastore/cloud/
vendor selected; no governance mechanism, control, or gate invented; no execution or `git` mutation performed;
no lock released; no invariant enrolled; no canon modified; **`PROJECT-STATE.md` not modified**; **`CTX-REG-001`
not modified**; **no registration performed**; no prior B04-A/B/C section regenerated. This is an
implementation-**program** design artifact only; the sole repository effect is this additive architecture `*.md`.
PI-10 construction remains a future Approval-Required Operation (AUTH-012 §8 / AD-0009) gated behind a scoped
Article IX release (`AD-0024`). `UCOS-CONSTRUCTION-BLOCKED`, the Article IX generation lock, INV-1..13,
`AUTH-012`, and **AD-0014** (Ω∞ deferral; INV-14..20 **not** enrolled) are unchanged. All prospective
construction is additive and confined to `src/control/intelligence/*` with zero prohibited-core-dir change;
registry-driven, provider-agnostic, model-agnostic, no-hard-coded-agents, no-hard-coded-workflows,
propose-not-act, deny-by-default, and Evolution-only commit are preserved throughout.

## Traceability
- **Continues:** `B04-A` (§§ 1–4), `B04-B` (§§ 5–9), `B04-C` (§§ 10–13) — not regenerated.
- **Consumes (authoritative):** `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001`,
  `INT-THREAT-001`, `INT-READINESS-001`, `INTEL-001`; `MEM-*` (PI-9), `KNOW-*`/PI-7, `ONTO-*` (PI-8),
  Evolution (PI-6/AD-0019), Federation (PI-5/AD-0018), Control (PI-4/AD-0017), Substrate (PI-2/3/AD-0016).
- **Refines:** AUTH-003 (IP-01/04/06/14/15), AUTH-008 (S1/S3/S4), AUTH-009, AUTH-010 (traceability), AUTH-012,
  Constitution Art. IX/XII, INV-1..13, AD-0014.
- **Produces (Part D):** Acceptance Tests (13 categories `AT-ENG/INT/DET/GOV/REG/AGT/MEM/KNW/RSN/PLN/LRN/COO/FRC-*`
  + coverage matrix + exit rule), Implementation Backlog (16 work packages `WP-00..15`, 6 build waves `W0..W5`,
  dependency graph, per-WP exit criteria, milestones `M-I0..I6`, authorization gates `G-A0..A5`).
- **Feeds:** after a future `AD-0024`, PI-10 construction wave-gated `W0→W5` + independent PI-10
  validation/ratification (`G-A5`).
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN),
  AD-0014; construction gated by `UCOS-CONSTRUCTION-BLOCKED`.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect).

**END B04-D-INTELLIGENCE-FABRIC-IMPLEMENTATION-PROGRAM — PART D · ACCEPTANCE TESTS (13 CATEGORIES: ENGINE-LEVEL/
INTEGRATION/DETERMINISM/GOVERNANCE/REGISTRY-RESOLUTION/AGENT-LIFECYCLE/MEMORY/KNOWLEDGE/REASONING/PLANNING/
LEARNING/COORDINATION/FAILURE-RECOVERY + COVERAGE MATRIX + EXIT RULE) · IMPLEMENTATION BACKLOG (16 WORK PACKAGES ·
6 BUILD WAVES · DEPENDENCY GRAPH · EXIT CRITERIA · 7 MILESTONES · 6 AUTHORIZATION GATES) · REGISTRY-DRIVEN ·
PROVIDER-AGNOSTIC · MODEL-AGNOSTIC · NO HARD-CODED AGENTS · NO HARD-CODED WORKFLOWS · PROPOSE-NOT-ACT ·
DENY-BY-DEFAULT · EVOLUTION-ONLY COMMIT · DESIGN/PLANNING ONLY · NO CODE / NO TEST CODE / NO INFRA / NO TECH
SELECTION / NO CONSTRUCTION / NO MUTATION · PROJECT-STATE + CTX-REG-001 UNTOUCHED · NO REGISTRATION · ARTICLE IX +
CONSTRUCTION LOCK REMAIN ACTIVE. B04 SERIES COMPLETE.**
