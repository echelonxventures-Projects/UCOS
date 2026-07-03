# ECO-THREAT-001 — UCOS Ecosystem Fabric Threat Model

| Field | Value |
|-------|-------|
| Artifact | **ECO-THREAT-001 — Ecosystem Threat Model** |
| Workstream | FND-ECO-01 (PHASE 27 · PI-16 Ecosystem Fabric Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Mode | DESIGN & RATIFICATION ONLY — no source code, runtime, or services |
| Method | STRIDE over the Ecosystem Fabric attack surface; per-threat pre-/post-control scoring |
| Basis | `ECO-GOV-001`, `ECO-ARCH-001`, `ECO-SEC-001`, `ECO-FED-001`, `ECO-AUD-001`; `AD-0014` (Ω∞ boundary); AUTH-008 (S1/S3/S4); AUTH-012 (amendment gate) |
| Result | **15 threats (ECO1–ECO15); 0 residual High/High** after design controls |

> Scoring: Likelihood × Impact ∈ {Low, Med, High}. "Residual" = after the design controls in the ECO-* specs.
> The single most consequence-laden threat class is **ECO6 autonomous ecosystem actuation / scope escape**
> (Ω∞ creep) — structurally closed by the govern-model-not-run boundary + propose-not-act + Evolution-only
> commit + AD-0014.

---

## 1. Attack Surface

1. **Membership intake** (entity registration / classification).
2. **Relationship & dependency assertion** (graph shape).
3. **Signal intake** (health/resilience inputs).
4. **Assessment** (deterministic health/resilience projection + advisory Sim/Intel evidence).
5. **Intervention pipeline** (propose → policy → certify → ratify → commit).
6. **Federated contributions** (cross-node ecosystem data).
7. **Evolution** (durable model mutation).
8. **Audit & explainability**.
9. **Ontology grounding & unknown-future admission**.

## 2. Threat Register (ECO1–ECO15, STRIDE)

### ECO1 — Ecosystem Entity Spoofing / Illegitimate Membership  *(Spoofing, Elevation)*
- **Threat.** An attacker registers a forged entity or joins an ecosystem without legitimacy.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Entity registration is Approval-Required via an in-scope Ecosystem Authority (`ECO-C8`);
  deny-by-default; signed; ontology-grounded kind; revocable/fail-closed (ECO-GOV-001 §2.1/2.8; ECO-SEC-001 §2).
- **Residual:** Low / Med → **Low–Med**.

### ECO2 — Relationship Forgery / False Association  *(Tampering, Spoofing)*
- **Threat.** A fabricated relationship distorts the ecosystem graph (e.g., false "regulates"/"allied-with").
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Relationship types resolve to `active` ontology relationship types (`ONTO-C6`); source/target
  must be `active` entities; signed + audited; a relationship confers no authority (EGP-5; ECO-SEC-001 §7).
- **Residual:** Low / Low → **Low/Low**.

### ECO3 — Dependency-Graph Poisoning / Fabricated Criticality  *(Tampering)*
- **Threat.** Injected/misstated dependencies or criticality skew resilience toward a false posture.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Criticality is evidence-backed; unattested criticality defaults to **conservative-highest**
  (fail-safe); dependency records signed/audited; deterministic cycle-check on critical chains (ECO-GOV-001
  §2.3).
- **Residual:** Low / Med → **Low–Med**.

### ECO4 — Health-Signal Manipulation / False Attestation  *(Tampering, Spoofing)*
- **Threat.** Forged/poisoned signals drive a false health verdict.
- **Pre-control:** High / High → **High/High**.
- **Controls.** Signals admitted only via attested Signal Sources (`ECO-C12`) with provenance + freshness +
  classification; every health metric traces to ≥1 attested signal; unattested/expired signals excluded
  fail-closed (EGP-9; ESP-2; ECO-AUD-001 §3).
- **Residual:** Low / Med → **Low–Med**.

### ECO5 — Resilience Miscalculation / Systemic-Fragility Masking  *(Tampering, Repudiation)*
- **Threat.** A manipulated model hides systemic fragility (reports resilient while brittle).
- **Pre-control:** High / High → **High/High**.
- **Controls.** Resilience is a **deterministic projection** over the dependency graph; reproducibility record
  + `resultHash` re-derivation (ECO-AUD-001 §4) makes masking a detectable integrity event; advisory Sim/Intel
  cannot be the **sole** basis; SPOF/monoculture are mandatory findings (EGP-6; ECO-ARCH-001 §2.3/§4).
- **Residual:** Low / Low → **Low/Low**.

### ECO6 — Autonomous Ecosystem Actuation / Scope Escape (Ω∞ creep)  *(Elevation)*
- **Threat.** The fabric acts on its own — directing/running an organization, market, or civilization, or
  self-authoring objectives — crossing into Ω∞ scope.
- **Pre-control:** Med / High → **High/High**.
- **Controls (structural).** Govern-model-not-run (EGP-1); propose-not-act (EGP-3/ESP-1): **no independent
  write path**; commit only via Evolution Fabric; no self-authored objectives; no `intervene-commit` power
  exists (ECO-GOV-001 §2.8); AD-0014 boundary; a PI-16 authorization would explicitly prohibit any
  self-directed/Ω∞ scope.
- **Residual:** Low / Low → **Low/Low**.

### ECO7 — Cascading-Failure Amplification via Bad Dependency Model  *(Denial of Service)*
- **Threat.** An incorrect dependency model causes the fabric to recommend changes that amplify cascade risk.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Deterministic failure-domain analysis; conservative-highest criticality default; SPOF findings;
  interventions are **proposals** subject to policy + SoD + Simulation impact evidence before any commit
  (ECO-ARCH-001 §2.3; EGP-3).
- **Residual:** Low / Med → **Low–Med**.

### ECO8 — Cross-Ecosystem Contagion / Federation Poisoning  *(Tampering, Spoofing)*
- **Threat.** A malicious/compromised peer propagates bad ecosystem data that spreads across nodes.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Foreign data advisory/deny-only + clamped trust + namespace-isolated + classification-checked +
  fail-closed on partition; local-shadows-foreign; local re-ratification required (ECO-FED-001 §1/§4).
- **Residual:** Low / Low → **Low/Low**.

### ECO9 — Federated Ecosystem Override of Local Sovereignty  *(Elevation, Spoofing)*
- **Threat.** A foreign node's ecosystem assessment/decision autonomously takes effect locally.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Advisory-only + deny-only foreign policy + local re-ratification + anti-whitewash (foreign
  cannot raise local resilience/clear findings) + fail-closed partition (ECO-FED-001 §2.2/§4 inv. 7).
- **Residual:** Low / Low → **Low/Low**.

### ECO10 — Ecosystem Evolution Bypass  *(Tampering, Elevation)*
- **Threat.** A durable ecosystem change is applied without routing through the Evolution Fabric.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Evolution-only mutation (EGP-4); the fabric holds no write path; SoD (proposer ≠ certifier ≠
  ratifier); migration-only (IP-14); signed + hash-chained commit event (ECO-GOV-001 §2.6; ECO-AUD-001 §2).
- **Residual:** Low / Low → **Low/Low**.

### ECO11 — Classification Leakage Across Ecosystem Boundaries  *(Information Disclosure)*
- **Threat.** Classified signals/relationships leak across scopes or federation boundaries.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** S4 classification inheritance (`max` of inputs); scope `classificationCeiling`; export ceiling
  on federated share; secret scrub; no raw signal payloads in outbound contributions (ESP-5; ECO-SEC-001 §5;
  ECO-FED-001 §2.3).
- **Residual:** Low / Med → **Low–Med**.

### ECO12 — Monoculture / Over-Centralization (Systemic Single Point of Failure)  *(Denial of Service, governance)*
- **Threat.** The ecosystem model entrenches a single systemic dependency/authority whose failure collapses the
  whole — or the fabric fails to surface it.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Monoculture/centralization exposure is a **first-class resilience finding** (ECO-C5;
  ECO-ARCH-001 §2.3); single-owner accountability with Board escalation; findings are surfaced, not silently
  optimized away.
- **Residual:** Low / Med → **Low–Med**.

### ECO13 — Unbounded Ecosystem Graph / Assessment Resource Exhaustion  *(Denial of Service)*
- **Threat.** A very large or adversarially-shaped graph exhausts assessment resources or loops.
- **Pre-control:** Med / Med → **Med/Med**.
- **Controls.** Bounded assessment budgets (graph size/depth/wall/resource); fail-closed abort with no partial
  verdict (EGP-8; ECO-ARCH-001 §2.2); signal TTLs bound graph growth.
- **Residual:** Low / Low → **Low/Low**.

### ECO14 — Audit / Explainability Gap  *(Repudiation)*
- **Threat.** A verdict/intervention publishes/commits without a complete, tamper-evident, reproducible trail.
- **Pre-control:** Med / Med → **Med/Med**.
- **Controls.** No-unexplained-verdict gate (EAP-1); hash-chained append-only audit; reproducibility record;
  fail-closed on unwritable audit (ECO-AUD-001).
- **Residual:** Low / Low → **Low/Low**.

### ECO15 — Unknown-Future Ecosystem Admitted Without Governed Protocol / Invariant Bypass  *(Elevation)*
- **Threat.** A novel ecosystem kind is smuggled in without grounding, threat re-assessment, or the amendment
  gate — bypassing an invariant.
- **Pre-control:** Med / High → **High/High**.
- **Controls.** Deny-by-default for ungrounded kinds (EGP-5/EGP-12); admission only via `ECO-C13` (governed
  ontology evolution + ECO1–ECO15 re-assessment + Board ratification); invariant-implicating admission is
  **amendment-gated** (AUTH-012). No silent extension.
- **Residual:** Low / Low → **Low/Low**.

## 3. Residual Risk Summary

| Threat | Pre-control | Residual | High/High residual? |
|--------|:-----------:|:--------:|:-------------------:|
| ECO1 Illegitimate membership | High/High | Low–Med | No |
| ECO2 Relationship forgery | High/High | Low/Low | No |
| ECO3 Dependency poisoning | High/High | Low–Med | No |
| ECO4 Health-signal manipulation | High/High | Low–Med | No |
| ECO5 Resilience masking | High/High | Low/Low | No |
| ECO6 Autonomous actuation (Ω∞) | High/High | Low/Low | No |
| ECO7 Cascade amplification | High/High | Low–Med | No |
| ECO8 Contagion / federation poisoning | High/High | Low/Low | No |
| ECO9 Federated override | High/High | Low/Low | No |
| ECO10 Evolution bypass | High/High | Low/Low | No |
| ECO11 Classification leakage | High/High | Low–Med | No |
| ECO12 Monoculture / centralization | High/High | Low–Med | No |
| ECO13 Resource exhaustion | Med/Med | Low/Low | No |
| ECO14 Audit/explainability gap | Med/Med | Low/Low | No |
| ECO15 Unknown-kind / invariant bypass | High/High | Low/Low | No |

**Residual High/High = 0.** Remaining residual Med items (ECO1, ECO3, ECO4, ECO7, ECO11, ECO12) are bounded by
deny-by-default, conservative-highest fail-safe defaults, attested-signal provenance, and the fact that no
ecosystem-modeling compromise can commit governed state or actuate any real-world ecosystem without passing
ontology grounding + policy + SoD certification + Evolution — i.e., the blast radius of any successful attack is
**rejected proposals + audit noise + surfaced findings**, never autonomous action.

## 4. Adversarial Test Obligation (prospective, for PI-16 implementation)

An implementation authorized under a future PI-16 act must ship an adversarial suite exercising all 15 vectors
(illegitimate-membership, relationship-forgery, dependency-poisoning, signal-manipulation, resilience-masking,
actuation-escape attempt, cascade-amplification, federation-poisoning, federated-override, evolution-bypass,
classification-leakage, monoculture-masking, unbounded-graph, audit-tamper, unknown-kind-smuggling) — all
blocked — while the existing substrate/control/federation/evolution/knowledge (and any ratified
ontology/memory/intelligence/simulation) test baseline remains green.

## 5. Traceability
- **Refines:** `ECO-GOV-001`, `ECO-ARCH-001`, `ECO-SEC-001`, `ECO-FED-001`, `ECO-AUD-001`, `AD-0014`,
  AUTH-008 (S1/S3/S4), AUTH-012 (amendment gate), Constitution Art. IX/X.
- **Consumed by:** `ECO-READINESS-001`, future PI-16 authorization + implementation acts.
- **Owner:** UCOS Authority Board.

**END ECO-THREAT-001 — DESIGN · READY FOR RATIFICATION · 15 THREATS · 0 RESIDUAL HIGH/HIGH · NO IMPLEMENTATION AUTHORIZED.**
