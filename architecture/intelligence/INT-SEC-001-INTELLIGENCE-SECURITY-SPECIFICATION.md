# INT-SEC-001 — UCOS Intelligence Security Specification

| Field | Value |
|-------|-------|
| Artifact | **INT-SEC-001 — Intelligence Security Specification** |
| Workstream | FND-INT-01 (PHASE 19 · PI-10 Intelligence Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, cryptography, keys, model weights, or services |
| Basis | `INT-GOV-001/002`, `INT-ARCH-001`; `UCOS-SEC-ARCH-001` (S1..S7); AUTH-008 (non-waivable S1/S3/S4); `AD-0018` federation `assertions.ts` (Ed25519); `AD-0014` |
| Realizes | S1 (authn/authz), S3 (secrets/keys), S4 (data protection) for the cognition layer + determinism quarantine as a security control |
| Prohibited-dir impact | **NONE** — reuses federation cryptography; **no custom crypto**; secrets/keys by reference only |

> Security posture for governed cognition. Non-waivable **S1/S3/S4** are preserved and enforced identically to
> the ratified stack. The Intelligence Fabric introduces new *cognition-specific* threat surfaces (goal
> injection, evidence poisoning, non-deterministic drift, inference/prompt injection, knowledge exfiltration via
> inference, autonomous-actuation creep). Each is closed by design here and cross-referenced in `INT-THREAT-001`.

---

## 1. Security Principles (intelligence-specific)

- **ISP-1 Propose-Not-Act is a Security Boundary.** The absence of any independent write path is a control, not
  a convenience: even a fully compromised reasoning session can produce only advisory proposals, all of which
  are policy-evaluated and must pass SoD certification + Evolution commit. Blast radius of cognition compromise
  = audit noise + rejected proposals.
- **ISP-2 Determinism Quarantine is a Security Control.** Non-deterministic inference is sandboxed, advisory,
  and independently verified (INT-ARCH-001 §4). A manipulated model can influence *suggestions*, never a
  *committed decision*, without passing a deterministic verifier.
- **ISP-3 Deny-by-Default Everywhere.** Every principal, goal, model, boundary, and proposal starts denied.
- **ISP-4 Fail-Closed.** Missing signature, stale/replayed transition, budget exhaustion, unresolved rationale,
  unknown model, unreachable revocation state ⇒ deny + audit.
- **ISP-5 Classification-Preserving Cognition (S4).** A rationale/decision inherits the **maximum**
  classification of every knowledge/memory input it consumed; outputs never down-classify evidence.

## 2. Identity & Principals (S1)

Four principal classes (reusing the PI-4 identity model — no new identity system):

| Class | Description | Authn |
|-------|-------------|-------|
| Human operator | Analyst/approver/Board member | PI-4 identity + credential verifier |
| Service/workload | System components opening sessions | PI-4 service identity |
| **Governed agent** | An automated reasoning principal acting **only** under an authorized Goal + Reasoning Authority | PI-4 identity + Reasoning Authority record; **no standing autonomy** |
| Federated intelligence authority | Foreign contributor | Signed assertions (federation), clamped, advisory (INT-FED-001) |

**S1 enforcement.** Authentication precedes any session; authorization is deny-by-default via the PI-4 policy
evaluator. A governed agent has **no self-authorization** — it cannot open a session absent an `active` Goal and
an in-scope Reasoning Authority.

## 3. Authorization (S1) — the cognition control path

`authenticate → resolve trust → evaluate policy (deny-by-default) → SoD certification → ratification → Evolution
commit`. Every hop is an enforcement point. A denial at any hop is terminal for the proposal. No proposal
bypasses policy; no decision commits outside Evolution (INT-GOV-002 §3).

## 4. Secrets & Keys (S3)

- **By reference only.** Model endpoints, API tokens, signing keys, and adapter credentials are **never**
  embedded in goals, sessions, rationales, prompts, or audit records — only opaque references (`keyRef`,
  `modelRef`) resolved at runtime through the substrate secrets convention.
- **No secrets in prompts/evidence.** Evidence assembled for a non-deterministic adapter is classification- and
  secret-scrubbed; secret material may never enter an external model's input (anti-exfiltration).
- **No custom cryptography.** All signing/verification reuses federation `assertions.ts` (Ed25519, nonce +
  freshness). The Intelligence Fabric defines no ciphers.

## 5. Data Protection (S4) — classification-aware reasoning

- **Read governance.** Knowledge/memory reads honor the Knowledge Fabric + Physical Data classification
  taxonomy; a session's effective clearance caps what it may read.
- **Classification inheritance.** A proposal/rationale/decision is stamped with `max(classification of all
  inputs)`; audit records inherit the same. No inference may launder classified evidence into a lower tier.
- **Exfiltration control.** Non-deterministic adapters receive only inputs whose classification ≤ the model's
  declared `inputClassificationMax`; higher-classified evidence stays inside the deterministic core.

## 6. Signed Assertions (reuse, not reinvent)

| Assertion | Signed content | Verified against |
|-----------|----------------|------------------|
| Session-open assertion | authorityId, goalId, budgets, snapshotRef, seed | Reasoning Authority key (federation verifier) |
| Decision-certification assertion | decisionId, proposalRef, rationaleRef, certifier | Decision Authority key; certifier ≠ proposer |
| Ratification assertion | decisionId, ratifiers[], quorum | Decision Authority keys; quorum by consequence class |
| Federated-contribution assertion | contributionRef, nodeId, trustLevel | Federated Intelligence Authority key; clamped |

All carry nonce + freshness (replay protection) and are hash-chained into the INT_* audit (INT-AUD-001).

## 7. Determinism Quarantine — security view

- Adapter runs in a boundary that **cannot** call the commit path.
- Adapter output is tagged `advisory` and requires deterministic verifier attestation to influence a committed
  decision.
- Adapter invocations are reproducible-by-record; a divergent re-run is a **detectable integrity event**
  (surfaces I3 non-deterministic drift).

## 8. Control ↔ Threat Coverage

| Control | Closes (INT-THREAT-001) | Non-waivable |
|---------|-------------------------|:------------:|
| Propose-not-act boundary (ISP-1) | I4 autonomous actuation / scope escape | — |
| Determinism quarantine (ISP-2/§7) | I3 drift, I6 inference/prompt injection | — |
| Deny-by-default authz (S1) | I1 goal injection, I7 constraint bypass | **S1** |
| Secrets by-reference + scrub (S3) | I12 model supply-chain / secret leak | **S3** |
| Classification inheritance + exfil control (S4) | I5 knowledge exfiltration via inference | **S4** |
| Signed + replay-protected assertions | I8 decision forgery/replay | — |
| SoD certification/ratification | I4/I8, insider single-actor commit | — |
| Fail-closed revocation propagation | I1/I2/I9 | — |
| Federated advisory clamp | I9 federated intelligence override | — |
| Hash-chained audit + reproducibility | I10 audit/explainability gap | — |
| Bounded cognition budgets | I11 resource exhaustion / runaway | — |

**S1/S3/S4 designed & enforced; 0 non-waivable gaps.**

## 9. Traceability
- **Refines:** `INT-GOV-001/002`, `INT-ARCH-001`, `UCOS-SEC-ARCH-001`, AUTH-008 (S1/S3/S4), `AD-0018`
  (federation crypto), `AD-0014`, Constitution Art. X/XI.
- **Consumed by:** `INT-FED-001`, `INT-AUD-001`, `INT-THREAT-001`, `INT-READINESS-001`, future PI-10 act.
- **Owner:** UCOS Authority Board.

**END INT-SEC-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
