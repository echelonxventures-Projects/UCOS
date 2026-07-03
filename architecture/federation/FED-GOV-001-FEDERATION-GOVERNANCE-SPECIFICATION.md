# FED-GOV-001 — UCOS Federation Governance Specification

| Field | Value |
|-------|-------|
| Artifact | **FED-GOV-001 — Federation Governance Specification** |
| Workstream | FND-FED-01 (PHASE 11.3 · PI-5.0 Federation Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, infrastructure, or services |
| Basis | PI5-REV-001..004 (PHASE 11.2); AD-0017 (PI-4 control fabrics, RATIFIED); AUTH-008/009/012; Constitution Art. IX/XII |
| Realizes gap closure | PHASE 11.2 Part C (11/11 governance constructs); threats T3, T6, T8, T9 |
| Prohibited-dir impact | **NONE** — all constructs are runtime records in the substrate Metadata runtime (metadata-first) |

> This specification defines governance **only**. It authorizes no implementation. All constructs are
> expressed as runtime, metadata-stored records interpreted by the existing PI-4 governance/policy
> engines — **0 hardcoded identities, authorities, or policies** (IP-04). Federation implementation
> remains gated behind a future PI-5 authorization act by the Authority Board.

---

## 1. Principles (federation-specific, subordinate to Authority Layer)

- **FGP-1 Local Sovereignty.** A node's local Authority Board is terminal for all decisions affecting its
  local capabilities. A foreign construct may **constrain** (deny) but may **never grant** authority,
  trust, permission, or execution on a local capability.
- **FGP-2 Deny-by-Default Across Boundaries.** Absent an explicit, in-boundary, verified acceptance, every
  cross-domain assertion is rejected. Empty trust boundary = accept nothing.
- **FGP-3 Explicit Membership.** No implicit federation. Every relationship is an append-only, audited,
  Approval-Required act (AD-0009).
- **FGP-4 Fail-Closed on Partition.** Loss of contact with a federation authority degrades to deny; cached
  foreign state has bounded staleness and hard expiry.
- **FGP-5 Bounded, Revocable Delegation.** Every delegated power is scoped, depth-capped, time-boxed, and
  revocable; nothing is transitive by default.
- **FGP-6 Single Accountable Authority.** Each governance construct has exactly one accountable owner
  (mirrors PEO single-owner); escalation terminates at the local Authority Board (AUTH-009).

## 2. The 11 Governance Constructs

Each construct below specifies: **Purpose · Record (metadata shape) · Lifecycle · Decision rights ·
Escalation · Invariants**. Records are stored under the reserved metadata key namespace
`federation:<kind>:<id>` (see FED-PROV-001 for provenance keying).

### 2.1 Federation Node (`FED-GOV-C1`)
- **Purpose.** A remote autonomous UCOS domain participating in federation.
- **Record.** `{ nodeId, homeDomain, publicKeyRef, declaredCapabilities[], status, admittedAt, admittedBy }`.
- **Lifecycle.** `proposed → admitted → (suspended ↔ admitted) → expelled` (expelled terminal).
- **Decision rights.** Admission/expulsion: local Authority Board (Approval-Required). Suspension:
  Revocation Authority or Board.
- **Escalation.** Board.
- **Invariants.** A node acts only through verified assertions (FED-SEC-001); `publicKeyRef` immutable
  post-admission (rotation is a new governed act); nodeId globally namespaced by `homeDomain`.

### 2.2 Federation Membership (`FED-GOV-C2`)
- **Purpose.** The governed relationship binding a node into this node's federation.
- **Record.** `{ membershipId, nodeId, trustBoundaryId, scopes[], grantedBy, grantedAt, expiresAt? }`.
- **Lifecycle.** `pending → active → (suspended ↔ active) → revoked`.
- **Decision rights.** Grant/revoke: Board (Approval-Required op); reuses PI-4 `GovernanceRegistry`
  approval process `federation-membership`.
- **Invariants.** No membership ⇒ node treated as untrusted external (deny-by-default). Membership never
  auto-renews; expiry is fail-closed.

### 2.3 Federation Authority (`FED-GOV-C3`)
- **Purpose.** A named authority a node accepts assertions from, with explicitly enumerated powers.
- **Record.** `{ authorityId, nodeId, powers: (identity|trust|policy|certification|revocation|audit)[], scope, keyRef, status }`.
- **Lifecycle.** `registered → active → (suspended ↔ active) → revoked`.
- **Decision rights.** Registration/scope changes: Board. Powers are **enumerated allow-list** (no implicit
  powers) — closes **T8 authority escalation**.
- **Invariants.** Authority powers are a strict subset of what its owning node was admitted for; unknown
  power ⇒ reject.

### 2.4 Trust Boundary (`FED-GOV-C4`)
- **Purpose.** The explicit set of authorities/nodes whose assertions this node will evaluate.
- **Record.** `{ boundaryId, members: authorityId[], defaultEffect: "deny", maxTrustLevel, acceptedAssertionTypes[] }`.
- **Lifecycle.** `defined → active → archived`.
- **Decision rights.** Board defines; Policy runtime enforces at decision time.
- **Invariants.** `defaultEffect` is always `deny` (FGP-2). `maxTrustLevel` caps any trust an authority in
  the boundary may confer — closes **T2 trust poisoning ceiling**.

### 2.5 Trust Delegation (`FED-GOV-C5`)
- **Purpose.** A bounded grant allowing an authority to assert trust for identities in a scope.
- **Record.** `{ delegationId, fromAuthority, scope, maxLevel, depth (default 0, non-transitive), expiresAt, revocable: true }`.
- **Lifecycle.** `granted → active → (expired | revoked)`.
- **Invariants.** `depth=0` ⇒ non-transitive by default; `maxLevel ≤ boundary.maxTrustLevel`; expiry
  fail-closed. Closes **T2**.

### 2.6 Policy Delegation (`FED-GOV-C6`)
- **Purpose.** Governs whether/how a foreign node's policies affect local decisions.
- **Record.** `{ delegationId, fromNode, effectConstraint: "deny-only", targetScope, expiresAt }`.
- **Invariants.** `effectConstraint` is **always `deny-only`** — a foreign policy may only add denials to
  local capabilities, never grants (FGP-1). Enforced by the PI-4 policy evaluator's existing
  deny-overrides-allow semantics. Closes **T3 federated policy conflicts**.

### 2.7 Certification Authority (`FED-GOV-C7`)
- **Purpose.** A node/authority empowered to issue verifiable certifications.
- **Record.** `{ caId, authorityId, keyRef, chainMaxDepth, status }`.
- **Lifecycle.** `registered → active → (suspended ↔ active) → revoked`.
- **Invariants.** Certifications must be signature-verifiable to a registered CA within the boundary; chain
  length ≤ `chainMaxDepth`; the **local certification store is authoritative for local decisions**. Closes
  **T9 certification bypass**.

### 2.8 Revocation Authority (`FED-GOV-C8`)
- **Purpose.** Empowered to revoke identities, trust delegations, certifications, or memberships.
- **Record.** `{ revAuthorityId, authorityId, revocableKinds[], keyRef }`.
- **Behavior.** Revocations **propagate** and are **fail-closed**: an entity in unknown/unreachable
  revocation state is treated as revoked (deny). Reuses PI-4 `GovernanceRegistry.revokeCertification`
  semantics, extended to identities/trust/membership. Closes **T9** and hardens **T2/T1**.

### 2.9 Audit Authority (`FED-GOV-C9`)
- **Purpose.** Owns cross-node audit reconciliation and divergence adjudication.
- **Record.** `{ auditAuthorityId, authorityId, reconcileScope, keyRef }`.
- **Invariants.** Only an Audit Authority may request/attest reconciliation; adjudication of divergence is
  Board-escalated. Consumes FED-AUD-001. Closes **T10 audit divergence** (governance side).

### 2.10 Federation Suspension (`FED-GOV-C10`)
- **Purpose.** Reversible halt of all trust/policy/certification acceptance from a node.
- **Record.** `{ suspensionId, nodeId, reason, at, by }` (append-only).
- **Behavior.** While suspended: all assertions from the node denied; local records retained; delegations
  frozen. Reversible by Board.

### 2.11 Federation Expulsion (`FED-GOV-C11`)
- **Purpose.** Terminal removal of a node.
- **Record.** `{ expulsionId, nodeId, reason, at, by }` (append-only, immutable).
- **Behavior.** Revokes membership + all delegations/certs from the node; irreversible without full
  re-admission; audited.

## 3. Governance Coverage Matrix

| Construct | Owner (accountable) | Approval-Required? | Fail-closed? | Threats addressed |
|-----------|---------------------|:------------------:|:------------:|-------------------|
| C1 Node | Authority Board | Yes (admit/expel) | Yes | T1, T12 |
| C2 Membership | Authority Board | Yes | Yes | T3, T8 |
| C3 Authority | Authority Board | Yes | Yes | T8 |
| C4 Trust Boundary | Authority Board | Yes | Yes (default deny) | T2, T6 |
| C5 Trust Delegation | Federation Authority | Yes | Yes (expiry) | T2 |
| C6 Policy Delegation | Authority Board | Yes | Yes (deny-only) | T3 |
| C7 Certification Authority | Authority Board | Yes | Yes | T9 |
| C8 Revocation Authority | Authority Board | Yes | Yes (propagate) | T1, T2, T9 |
| C9 Audit Authority | Authority Board | Yes | Yes | T10 |
| C10 Suspension | Revocation Authority / Board | Yes | Yes | T2, T8, T11 |
| C11 Expulsion | Authority Board | Yes | Yes (terminal) | T8, T11, T12 |

**11/11 constructs defined.** All map to existing PI-4 primitives (governance processes, approvals,
certifications, revocation, deny-overrides-allow) plus new metadata record kinds — **no core-dir change**.

## 4. Traceability
- **Refines:** PI5-REV-003 (Part C), AD-0017, AUTH-008/009/012, Constitution Art. IX/XII, IP-04.
- **Consumed by:** FED-SEC-001 (assertion verification), FED-PROV-001 (record keying), FED-AUD-001,
  FED-ARCH-001, and a future PI-5 implementation act.
- **Owner:** UCOS Authority Board.

**END FED-GOV-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
