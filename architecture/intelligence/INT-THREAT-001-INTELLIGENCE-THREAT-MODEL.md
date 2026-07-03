# INT-THREAT-001 — UCOS Intelligence Fabric Threat Model

| Field | Value |
|-------|-------|
| Artifact | **INT-THREAT-001 — Intelligence Threat Model** |
| Workstream | FND-INT-01 (PHASE 19 · PI-10 Intelligence Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, or services |
| Method | STRIDE over the Intelligence Fabric attack surface; per-threat pre-/post-control scoring |
| Basis | `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001`; `AD-0014` (Ω∞ boundary); AUTH-008 (S1/S3/S4) |
| Result | **12 threats (I1–I12); 0 residual High/High** after design controls |

> Scoring: Likelihood × Impact ∈ {Low, Med, High}. "Residual" = after the design controls in the INT-* specs.
> The single most consequence-laden threat class is **I4 autonomous-actuation / scope escape** (Ω∞ creep) —
> structurally closed by the propose-not-act boundary + Evolution-only commit + AD-0014.

---

## 1. Attack Surface

1. **Goal intake** (goal authoring/authorization).
2. **Evidence intake** (Knowledge/Memory reads feeding reasoning).
3. **Inference** (deterministic core + non-deterministic adapters/external models).
4. **Planning / constraint solving**.
5. **Decision pipeline** (propose → policy → certify → ratify → commit).
6. **Federated contributions** (cross-node reasoning/decisions).
7. **Audit & explainability**.
8. **Secrets/keys/model references**.

## 2. Threat Register (I1–I12, STRIDE)

### I1 — Goal Injection / Hijack  *(STRIDE: Tampering, Elevation)*
- **Threat.** An attacker inserts or alters a goal to steer cognition toward a malicious objective.
- **Pre-control:** Likelihood Med / Impact High → **High/High**.
- **Controls.** Goals are metadata records authorized only by an in-scope Goal Authority (Approval-Required,
  AD-0009); deny-by-default; consequence-class cap; signed; revocable/fail-closed (INT-GOV-001 §2.3/2.4).
- **Residual:** Low / Med → **Low–Med**.

### I2 — Reasoning Manipulation / Evidence Poisoning  *(Tampering, Spoofing)*
- **Threat.** Poisoned knowledge/memory evidence corrupts a rationale.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Evidence read only via governed Knowledge Fabric (provenance-carrying, S4-classified);
  rationale binds every conclusion to traceable evidence (INT-AUD-001 §3); revocation propagation; local-shadows-
  foreign.
- **Residual:** Low / Med → **Low–Med**.

### I3 — Non-Deterministic Drift / Unreproducible Decision  *(Repudiation, Tampering)*
- **Threat.** Model stochasticity yields decisions that cannot be reproduced or explained (INV-6 risk).
- **Pre-control:** High / High → **High/High**.
- **Controls.** Determinism Quarantine (INT-ARCH-001 §4): adapters advisory-only, verifier-attested;
  reproducibility record + `resultHash` re-derivation (INT-AUD-001 §4); divergence is a detectable integrity
  event. Committed decisions are deterministic functions of recorded evidence.
- **Residual:** Low / Low → **Low/Low**.

### I4 — Autonomous Actuation / Scope Escape (Ω∞ creep)  *(Elevation)*
- **Threat.** The fabric acts on its own, self-authors goals, or self-modifies — crossing into Ω∞ scope.
- **Pre-control:** Med / High → **High/High**.
- **Controls (structural).** Propose-not-act (IGP-3/ISP-1): **no independent write path**; commit only via
  Evolution Fabric; no self-authored goals (IGP-1); no `decide-commit` power exists (INT-GOV-001 §2.1);
  AD-0014 boundary; PI-10 authorization would explicitly prohibit any self-directed/Ω∞ scope.
- **Residual:** Low / Low → **Low/Low**.

### I5 — Knowledge Exfiltration via Inference  *(Information Disclosure)*
- **Threat.** Classified evidence leaks through a non-deterministic model's output or an external endpoint.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** S4 classification inheritance; adapter inputs capped at `inputClassificationMax`; higher-
  classified evidence stays in the deterministic core; secret scrub; no secrets in prompts (INT-SEC-001 §4/§5).
- **Residual:** Low / Med → **Low–Med**.

### I6 — Inference / Prompt Injection / Model Manipulation  *(Tampering, Spoofing)*
- **Threat.** Adversarial inputs manipulate a model to produce attacker-chosen inferences.
- **Pre-control:** High / Med → **High (L) / Med (I)**.
- **Controls.** Adapter output is advisory + verifier-gated (a manipulated suggestion cannot commit without
  passing deterministic rules/constraints); inputs classification-scrubbed; adapter sandbox cannot reach the
  commit path (ISP-2).
- **Residual:** Low / Low → **Low/Low**.

### I7 — Constraint Bypass  *(Tampering, Elevation)*
- **Threat.** A plan/decision violates a hard constraint or overrides it via soft-constraint optimization.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Hard constraints inviolable (INT-GOV-001 §2.6); infeasible plans cannot be proposed (INT-GOV-002
  §1.5); constraint check is a deterministic pipeline gate before certification.
- **Residual:** Low / Low → **Low/Low**.

### I8 — Decision Forgery / Replay  *(Spoofing, Repudiation)*
- **Threat.** A forged or replayed certification/ratification commits an illegitimate decision.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Signed assertions (Ed25519, nonce + freshness) reused from federation; SoD (certifier ≠
  proposer); quorum; hash-chained audit (INT-SEC-001 §6, INT-AUD-001 §2).
- **Residual:** Low / Low → **Low/Low**.

### I9 — Federated Intelligence Override  *(Elevation, Spoofing)*
- **Threat.** A foreign node's reasoning/decision autonomously takes effect locally.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Advisory-only + deny-only foreign policy + clamped trust + local re-ratification required +
  fail-closed on partition + namespace isolation (INT-FED-001 §1/§4).
- **Residual:** Low / Low → **Low/Low**.

### I10 — Audit / Explainability Gap  *(Repudiation)*
- **Threat.** A decision commits without a complete, tamper-evident, reproducible trail.
- **Pre-control:** Med / Med → **Med/Med**.
- **Controls.** No-unexplained-decision gate (IAP-1); hash-chained append-only audit; reproducibility record;
  fail-closed on unwritable audit (INT-AUD-001).
- **Residual:** Low / Low → **Low/Low**.

### I11 — Resource Exhaustion / Runaway Reasoning  *(Denial of Service)*
- **Threat.** Unbounded reasoning consumes resources or loops indefinitely.
- **Pre-control:** Med / Med → **Med/Med**.
- **Controls.** Bounded cognition budgets (depth/steps/wall/resource); fail-closed abort with no partial commit
  (IGP-5, INT-GOV-002 §1.3).
- **Residual:** Low / Low → **Low/Low**.

### I12 — Model Supply-Chain / Secret Leak  *(Tampering, Information Disclosure)*
- **Threat.** A compromised model reference or leaked credential subverts inference or exposes secrets.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Model registry with declared refs + determinism class; secrets/keys by reference only; no
  secrets in records/prompts; no custom crypto; adapter outputs advisory + verifier-gated (INT-SEC-001 §4,
  INT-GOV-001 §2.2).
- **Residual:** Low / Med → **Low–Med**.

## 3. Residual Risk Summary

| Threat | Pre-control | Residual | High/High residual? |
|--------|:-----------:|:--------:|:-------------------:|
| I1 Goal injection | High/High | Low–Med | No |
| I2 Evidence poisoning | High/High | Low–Med | No |
| I3 Non-deterministic drift | High/High | Low/Low | No |
| I4 Autonomous actuation (Ω∞) | High/High | Low/Low | No |
| I5 Knowledge exfiltration | High/High | Low–Med | No |
| I6 Inference/prompt injection | High/Med | Low/Low | No |
| I7 Constraint bypass | High/High | Low/Low | No |
| I8 Decision forgery/replay | High/High | Low/Low | No |
| I9 Federated override | High/High | Low/Low | No |
| I10 Audit/explainability gap | Med/Med | Low/Low | No |
| I11 Resource exhaustion | Med/Med | Low/Low | No |
| I12 Model supply-chain/secret | High/High | Low–Med | No |

**Residual High/High = 0.** Remaining residual Med items (I1, I2, I5, I12) are bounded by deny-by-default,
propose-not-act, fail-closed revocation, and the fact that no cognition compromise can commit governed state
without passing SoD certification + policy + Evolution — i.e., the blast radius of any successful cognition
attack is **rejected proposals + audit noise**, never autonomous action.

## 4. Adversarial Test Obligation (prospective, for PI-10 implementation)

An implementation authorized under a future PI-10 act must ship an adversarial suite exercising all 12 vectors
(goal-injection, poisoned-evidence, drift/reproducibility, actuation-escape attempt, exfiltration attempt,
prompt-injection, constraint-bypass, forged/replayed certification, federated-override, audit-tamper,
runaway-budget, model/secret-leak) — all blocked — while the existing federation/evolution/knowledge test
baseline remains green.

## 5. Traceability
- **Refines:** `INT-GOV-001/002`, `INT-ARCH-001`, `INT-SEC-001`, `INT-FED-001`, `INT-AUD-001`, `AD-0014`,
  AUTH-008 (S1/S3/S4), Constitution Art. IX/X.
- **Consumed by:** `INT-READINESS-001`, future PI-10 authorization + implementation acts.
- **Owner:** UCOS Authority Board.

**END INT-THREAT-001 — DESIGN · READY FOR RATIFICATION · 0 RESIDUAL HIGH/HIGH · NO IMPLEMENTATION AUTHORIZED.**
