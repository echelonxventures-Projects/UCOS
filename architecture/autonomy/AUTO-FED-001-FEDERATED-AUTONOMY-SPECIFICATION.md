# AUTO-FED-001 — Federated Autonomy Specification

| Field | Value |
|-------|-------|
| Artifact ID | `AUTO-FED-001` |
| Layer | ARCH (Autonomy) |
| Phase | PHASE 23 · PI-12 Autonomy Fabric (Design) |
| Status | **DESIGN — READY FOR RATIFICATION v1.0.0** |
| Refines | AUTO-GOV-001, AUTO-SEC-001, AUTO-ARCH-001, AD-0018 (FED-GOV/SEC/PROV/AUD-001), AUTH-008/009 |
| Refined by | AUTO-AUD-001, AUTO-THREAT-001, AUTO-READINESS-001 |

> Design only. Reuses AD-0018 federation constructs unchanged (reuse-only). Cross-node autonomy is
> **advisory-only, deny-only, clamped, local-sovereign, fail-closed**.

---

## 1. Federated autonomy principles (AFP-1..AFP-6)

| ID | Principle |
|----|-----------|
| **AFP-1** | **Advisory-only.** A foreign node's actors, goals, and decisions are advisory inputs; they never take governed effect locally without local ratification. |
| **AFP-2** | **Deny-only.** Foreign policy/authority may only *restrict* local autonomous action, never *grant* it. |
| **AFP-3** | **Trust-clamped.** Foreign contributions are clamped to the local federation trust ceiling; a foreign actor never exceeds a local actor. |
| **AFP-4** | **Local-shadows-foreign.** A local `active` construct always shadows an imported foreign one; foreign records live in a disjoint `autonomy:federation:<nodeId>:*` keyspace. |
| **AFP-5** | **Fail-closed on partition.** On loss of a node/quorum, foreign-dependent autonomy suspends (deny), never proceeds on stale trust. |
| **AFP-6** | **Local re-ratification required.** Any foreign-originated goal/plan must pass the full local governed loop (policy + constraints + Evolution commit + AD-0009) before any local effect. |

## 2. Coordination model

- Cross-node autonomous **coordination** (e.g., a distributed goal) is realized as **exchange of
  signed advisory proposals**, each verified (Ed25519, nonce+freshness) and clamped, then subjected to
  the local governed autonomy loop. No foreign node can cause a local actor to execute.
- Foreign **emergency-halt** signals are honored **fail-safe**: a valid foreign halt assertion can
  *halt* local scoped autonomy (deny-more is always allowed) but can never *resume* it.
- **Provenance by convention** (FED-PROV-001): `nodeId::localId` namespacing, `attributes.provenance`,
  disjoint `autonomy:federation:` keys; **no first-class provenance fields on core ports**.

## 3. Isolation & sovereignty

- Foreign autonomy authorities may register only in `autonomy:federation:<nodeId>:authority:*` and
  hold **enumerated advisory powers only** (never `execute-request`, `commit`, or `resume`).
- Local charters, envelopes, and constraints are **never** mutated by federation; a federation-touching
  change requires a local re-ratification token (reuse EVO-FED-001 pattern).

## 4. Reuse

Reuses AD-0018 `FederatedControlPlane`, `assertions.ts`, `FederatedAuditLog`, trust-boundary, and
authority primitives **without modification**. The autonomy federation guard lives in
`src/control/autonomy/federation-guard.ts`.

## 5. Traceability
- **Refines:** AUTO-GOV-001, AUTO-SEC-001, AD-0018 (FED-*), AUTH-008/009, AD-0014.
- **Refined by:** AUTO-AUD-001, AUTO-THREAT-001, AUTO-READINESS-001.
- **Owner:** UCOS Authority Board.

**END AUTO-FED-001 — DESIGN — READY FOR RATIFICATION.**
