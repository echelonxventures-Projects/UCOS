# AUTO-SEC-001 — Autonomy Security Specification

| Field | Value |
|-------|-------|
| Artifact ID | `AUTO-SEC-001` |
| Layer | ARCH (Autonomy) |
| Phase | PHASE 23 · PI-12 Autonomy Fabric (Design) |
| Status | **DESIGN — READY FOR RATIFICATION v1.0.0** (S1/S3/S4 enforced; 0 non-waivable gaps) |
| Refines | AUTO-GOV-001, AUTO-ARCH-001, UCOS-SEC-ARCH-001, AUTH-008 (S1/S3/S4), FED-SEC-001, AD-0014 |
| Refined by | AUTO-FED-001, AUTO-AUD-001, AUTO-THREAT-001, AUTO-READINESS-001 |

> Design only. Reuses ratified federation cryptography (Ed25519 `assertions.ts`); **no custom
> cryptography**. Non-waivable **S1/S3/S4** designed and enforced; 0 non-waivable gaps.

---

## 1. Autonomy security principles (ASP-1..ASP-5)

| ID | Principle |
|----|-----------|
| **ASP-1** | Every autonomy construct (actor, goal, authority, delegation, decision) carries a **signed assertion** verified before it takes effect (reuse federation Ed25519). |
| **ASP-2** | **Deny-by-default** authorization on every decision/execution/delegation; least-authority; monotonic non-escalation. |
| **ASP-3** | **Determinism quarantine as a security control** — non-deterministic inputs cannot reach a commit without deterministic re-derivation (INV-6). |
| **ASP-4** | **Emergency halt is a security control** — a non-bypassable, fail-closed deny-all reachable by humans/Board and auto-triggered on invariant breach. |
| **ASP-5** | **Classification-preserving cognition** — goals/decisions/outputs inherit and never lower the S4 classification of their evidence; no autonomous exfiltration. |

## 2. Non-waivable control mapping

| Control | Autonomy enforcement |
|---------|----------------------|
| **S1 (AuthN/AuthZ)** | Actors are authenticated PI-4 identities; every decision/execution is deny-by-default policy-evaluated; enumerated, signed authorities; delegation clamped and non-escalating. |
| **S3 (Secrets/Keys)** | Signing keys, model refs, and credentials are **by reference only**; never embedded in charters, goals, records, or logs; rotation via reference. |
| **S4 (Data Protection)** | Goals/decisions/projections inherit the max classification of consumed knowledge/memory; outputs cannot down-classify; federation exports are classification-gated. |
| **S6 (Audit)** | All AUTO_* events hash-chained and tamper-evident (AUTO-AUD-001). |

## 3. Assertion & trust model

- **Signed constructs:** actor charter, goal assignment, authority grant, delegation, decision, and
  revocation each require a valid Ed25519 assertion (issuer power-checked, nonce + freshness against
  replay).
- **Trust clamping:** an actor's effective authority = min(granted authority, envelope, delegator
  authority, federated ceiling). Federation may only lower it (AUTO-FED-001).
- **Authority verification:** enumerated powers only; an act requiring a power the issuer lacks is
  rejected (closes A2 escalation). SoD enforced across adjacent powers.

## 4. Emergency halt & revocation security

- The **Emergency Halt Controller** state is authoritative and cannot be cleared by any actor or by
  the autonomy fabric itself (A10); resume requires a **distinct** human/Board authority (SoD).
- **Revocation** is signed, cascading, and instantaneous; a revoked construct fails every subsequent
  assertion check (no zombie actor, A11).
- On partition/uncertainty the fabric **fails closed** (deny-all), never fail-open.

## 5. Determinism-quarantine control (INV-6)

Non-deterministic Intelligence contributions are sandboxed and advisory. A decision is **inadmissible
for commit** until a deterministic verifier reproduces its conclusion from recorded evidence
(`resultHash`). This is a security control, not merely a quality control: it prevents adversarial
model output from laundering into governed state (A8).

## 6. Coverage

- Signed-assertion coverage: 6/6 mutating construct classes.
- Non-waivable coverage: S1 ✅ · S3 ✅ · S4 ✅ · S6 ✅ — 0 gaps.
- Every A1–A15 threat maps to ≥1 control here or in AUTO-GOV-001/AUTO-FED-001/AUTO-AUD-001
  (see AUTO-THREAT-001).

## 7. Traceability
- **Refines:** AUTO-GOV-001, AUTO-ARCH-001, UCOS-SEC-ARCH-001 (SP/S1..S7), AUTH-008, FED-SEC-001, INT-SEC-001, AD-0014.
- **Refined by:** AUTO-FED-001, AUTO-AUD-001, AUTO-THREAT-001, AUTO-READINESS-001.
- **Owner:** UCOS Authority Board (Security Governance, CAP-17).

**END AUTO-SEC-001 — DESIGN — READY FOR RATIFICATION.**
