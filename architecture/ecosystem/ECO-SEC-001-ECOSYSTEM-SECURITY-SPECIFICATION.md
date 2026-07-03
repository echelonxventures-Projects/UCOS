# ECO-SEC-001 — UCOS Ecosystem Security Specification

| Field | Value |
|-------|-------|
| Artifact | **ECO-SEC-001 — Ecosystem Security Specification** |
| Workstream | FND-ECO-01 (PHASE 27 · PI-16 Ecosystem Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, cryptography, keys, model weights, or services |
| Basis | `ECO-GOV-001`, `ECO-ARCH-001`; `UCOS-SEC-ARCH-001` (S1..S7); AUTH-008 (non-waivable S1/S3/S4); `AD-0018` federation `assertions.ts` (Ed25519); `AD-0014` |
| Realizes | S1 (authn/authz), S3 (secrets/keys), S4 (data protection) for the ecosystem modeling & assessment layer + propose-not-act as a security boundary |
| Prohibited-dir impact | **NONE** — reuses federation cryptography; **no custom crypto**; secrets/keys by reference only |

> Security posture for governed ecosystem modeling. Non-waivable **S1/S3/S4** are preserved and enforced
> identically to the ratified stack. The Ecosystem Fabric introduces new *ecosystem-specific* threat surfaces
> (illegitimate membership, false relationships/dependencies, health-signal manipulation, resilience masking,
> cross-ecosystem contagion, systemic-actuation creep). Each is closed by design here and cross-referenced in
> `ECO-THREAT-001`.

---

## 1. Security Principles (ecosystem-specific)

- **ESP-1 Propose-Not-Act is a Security Boundary.** The absence of any independent write path is a control:
  even a fully compromised assessment can produce only advisory proposals, all policy-evaluated and requiring
  SoD certification + Evolution commit. Blast radius of an ecosystem-modeling compromise = audit noise +
  rejected proposals — never autonomous action on any real-world ecosystem (closes ECO6).
- **ESP-2 Projections are Evidence-Bound.** Health/Resilience verdicts are deterministic projections traceable
  to attested Signal Sources and pinned snapshots; a verdict resting on unattested/forged input is rejected
  (closes ECO4/ECO5).
- **ESP-3 Deny-by-Default Everywhere.** Every principal, entity, relationship, dependency, signal, scope, and
  proposal starts denied.
- **ESP-4 Fail-Closed.** Missing signature, stale/replayed transition, unresolved ontology grounding, expired
  signal, budget exhaustion, unknown authority, unreachable revocation state ⇒ deny + audit.
- **ESP-5 Classification-Preserving Assessment (S4).** A health/resilience record and its rationale inherit the
  **maximum** classification of every signal/knowledge/memory input consumed; assessments never down-classify
  their inputs, and never leak classified data across an ecosystem/federation boundary (closes ECO11).

## 2. Identity & Principals (S1)

Four principal classes (reusing the PI-4 identity model — no new identity system):

| Class | Description | Authn |
|-------|-------------|-------|
| Human operator | Analyst / approver / Board member | PI-4 identity + credential verifier |
| Service/workload | System components requesting assessments | PI-4 service identity |
| **Ecosystem Authority** | A principal registering entities / asserting relationships / requesting assessments **only** within an enumerated scope | PI-4 identity + Ecosystem Authority record (`ECO-C8`); **no standing autonomy** |
| Federated ecosystem authority | Foreign contributor | Signed assertions (federation), clamped, advisory (ECO-FED-001) |

**S1 enforcement.** Authentication precedes any operation; authorization is deny-by-default via the PI-4 policy
evaluator. An Ecosystem Authority has **no self-authorization** and **no `intervene-commit` power** — it cannot
commit an ecosystem change; commit is Evolution-only + SoD.

## 3. Authorization (S1) — the ecosystem control path

`authenticate → resolve trust → evaluate policy (deny-by-default) → ground (ontology) → SoD certification →
ratification → Evolution commit`. Every hop is an enforcement point; a denial at any hop is terminal for the
proposal. No proposal bypasses policy; no ecosystem-of-record change commits outside Evolution (EGP-4).

## 4. Secrets & Keys (S3)

- **By reference only.** Signing keys, external data-source credentials, and signal-feed tokens are **never**
  embedded in entities, relationships, dependencies, signals, assessments, or audit records — only opaque
  references (`keyRef`, `sourceRef`) resolved at runtime through the substrate secrets convention.
- **No secrets in signals/evidence.** Signal payloads and evidence assembled for advisory Intelligence/
  Simulation consumption are classification- and secret-scrubbed; secret material may never enter an advisory
  model's input (anti-exfiltration).
- **No custom cryptography.** All signing/verification reuses federation `assertions.ts` (Ed25519, nonce +
  freshness). The Ecosystem Fabric defines no ciphers.

## 5. Data Protection (S4) — classification-aware modeling

- **Read governance.** Knowledge/memory reads and signal admission honor the Knowledge Fabric + Physical Data
  classification taxonomy; a scope's `classificationCeiling` caps what it may read/admit.
- **Classification inheritance.** A health/resilience verdict, rationale, and any proposed intervention are
  stamped with `max(classification of all inputs)`; audit records inherit the same. No assessment may launder
  classified signals into a lower tier or across a federation boundary.
- **Exfiltration control.** Advisory Intelligence/Simulation consumers receive only inputs whose classification
  ≤ the consumer's declared ceiling; higher-classified evidence stays inside the deterministic core.

## 6. Signed Assertions (reuse, not reinvent)

| Assertion | Signed content | Verified against |
|-----------|----------------|------------------|
| Entity/relationship registration assertion | recordId, kind, scope, authorityId, snapshotRef | Ecosystem Authority key (federation verifier) |
| Signal attestation | signalId, sourceRef, kind, value-hash, classification, capturedAt | Signal Source authority key; freshness-bounded |
| Assessment assertion | healthId/resilienceId, snapshotRefs, rationaleRef, assessor | Ecosystem Authority key |
| Intervention certification assertion | changeRef, certifier, proposer | Authority Board key; certifier ≠ proposer |
| Ratification assertion | changeRef, ratifiers[], quorum | Authority Board keys; quorum by consequence class |
| Federated-contribution assertion | contributionRef, nodeId, trustLevel | Federated Ecosystem Authority key; clamped |

All carry nonce + freshness (replay protection) and are hash-chained into the ECO_* audit (ECO-AUD-001).

## 7. Ontology-Grounding as a Security Control

- Every entity/relationship/dependency type is resolved to an `active` ontology type before acceptance (EGP-5);
  an ungrounded or ambiguous type is rejected fail-closed. This prevents semantic spoofing (ECO2) and unknown-
  kind smuggling (ECO15): a kind absent from the bound taxonomy cannot be modeled except through the governed,
  amendment-gated admission protocol (`ECO-C13`).

## 8. Control ↔ Threat Coverage

| Control | Closes (ECO-THREAT-001) | Non-waivable |
|---------|-------------------------|:------------:|
| Propose-not-act boundary (ESP-1) | ECO6 autonomous ecosystem actuation / scope escape | — |
| Deny-by-default authz (S1) | ECO1 illegitimate membership, ECO10 evolution bypass | **S1** |
| Ontology grounding gate (§7) | ECO2 relationship forgery, ECO15 unknown-kind smuggling | — |
| Attested signals + evidence-bound projections (ESP-2) | ECO4 health-signal manipulation, ECO5 resilience masking | — |
| Conservative-highest criticality + SPOF/monoculture findings | ECO3 dependency poisoning, ECO7 cascade, ECO12 monoculture | — |
| Secrets by-reference + scrub (S3) | ECO11 classification leakage (secret side) | **S3** |
| Classification inheritance + exfil control (S4) | ECO11 classification leakage across boundaries | **S4** |
| Signed + replay-protected assertions | ECO4/ECO10 forgery/replay | — |
| SoD certification/ratification | ECO6/ECO10 insider single-actor commit | — |
| Fail-closed revocation propagation | ECO1/ECO8/ECO9 | — |
| Federated advisory clamp + local re-ratification | ECO8 contagion, ECO9 federated override | — |
| Hash-chained audit + reproducibility | ECO14 audit/explainability gap | — |
| Bounded assessment budgets | ECO13 resource exhaustion / unbounded graph | — |
| Amendment-gated unknown-future admission | ECO15 unknown-kind / invariant bypass | (invariant, AUTH-012) |

**S1/S3/S4 designed & enforced; 0 non-waivable gaps.**

## 9. Traceability
- **Refines:** `ECO-GOV-001`, `ECO-ARCH-001`, `UCOS-SEC-ARCH-001`, AUTH-008 (S1/S3/S4), `AD-0018` (federation
  crypto), `AD-0014`, Constitution Art. X/XI.
- **Consumed by:** `ECO-FED-001`, `ECO-AUD-001`, `ECO-THREAT-001`, `ECO-READINESS-001`, future PI-16 act.
- **Owner:** UCOS Authority Board.

**END ECO-SEC-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED · 0 NON-WAIVABLE GAPS.**
