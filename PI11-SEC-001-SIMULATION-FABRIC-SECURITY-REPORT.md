# PI11-SEC-001 — Simulation Fabric Security Report

| Field | Value |
|-------|-------|
| Artifact | **PI11-SEC-001** |
| Work item | PI-11 — Simulation Fabric |
| Basis | SIM-THREAT-001 (S1–S12), SIM-SEC-001 (S1/S3/S4/S6), AD-0022 (SIM-COND-1..7) |
| Determination | **0 residual High/High** — 12/12 threats mitigated in code; S1/S3/S4/S6 enforced |
| Date | 2026-07-03 |

## 1. Threat verification (SIM-THREAT-001 §1 → tests)

| # | Threat | Mitigation (enforcing module) | Adversarial test | Residual |
|---|--------|-------------------------------|------------------|:--------:|
| S1 | Sandbox escape | static keyspace write-guard (M2) rejects + audits non-sandbox writes | S1 | Low |
| S2 | Snapshot/twin poisoning | Ed25519 verify via `assertions.ts` (M3); tamper ⇒ deny | S2 | Low |
| S3 | Non-deterministic leakage | non-det unattested forecast non-committable (M6 gate) | S3 | Low |
| S4 | Predictive/model overreach | deny-by-default PI-4 policy + validity gate (M11) | S4 | Low |
| S5 | Resource exhaustion | horizon/steps/entities budget abort (M4/M5) | S5 | Low |
| S6 | Classification leakage | MAX-class inheritance; below-class emit denied (M8) | S6 | Low–Med |
| S7 | Replay / stale | freshness + single-use nonce (M3 via `assertions.ts`) | S7 | Low |
| S8 | Authority escalation | no commit power expressible (B5); SoD certifier≠modeller (M11) | S8 | Low |
| S9 | Federated poisoning | advisory/deny-only; trust clamp; over-cap denied (M10) | S9 | Low–Med |
| S10 | Audit divergence | hash-chain tamper detection (M12); rationale gate (M5) | S10 | Low–Med |
| S11 | Existential/civilization creep | civilization ⇒ Board (SGP-9); AD-0014 stands (M4) | S11 | Low |
| S12 | Twin drift/impersonation | stale ⇒ non-projectable fail-closed; never actuates (M3) | S12 | Low |

**Exit: 12/12 blocked; 0 residual High/High.** Residual Low–Med (S6/S9/S10) matches SIM-THREAT-001 and is
bounded by classification inheritance, fail-closed federation, and tamper-evident audit.

## 2. Non-waivable controls (SIM-COND-5, S1/S3/S4)

- **S1 (sandbox / non-actuation).** All run writes confined to `simulation:sandbox:<runId>:*`; the fabric
  holds no independent write path; all governed mutation routes through the PI-6 Evolution Fabric.
- **S3 (secrets by reference).** Only PUBLIC keys are used, resolved by `keyRef` from the shared
  `KeyRegistry`. No key material is stored in records or metadata.
- **S4 (classification).** Projection/impact outputs inherit the MAX classification of their inputs;
  cross-class emission to a lower classification is denied (`CLASSIFICATION_LEAK`).
- **S6 (audit).** Every deny path is typed and audited; the audit chain is hash-linked and independently
  verifiable offline.

## 3. Cryptography (SIM-COND-2, G-CRYPTO)

No custom cryptography. All signing/verification/hashing reuses `src/control/federation/assertions.ts`
(Ed25519 `signPayload`/`verifyPayload`, `sha256`, `canonicalize`, `KeyRegistry`, `NonceCache`,
`isFresh`). Static scan of `src/control/simulation/*` shows zero `node:crypto` / `crypto.*` primitive use.

## 4. Deny-by-default & least authority

- Zero hardcoded authorities, policies, or models. Every authority/twin/scenario/model is a runtime,
  approval-required registration (AD-0009 / SIM-COND-7).
- Simulation powers are an enumerated set (`scenario`, `decision`, `revocation`,
  `federated-simulation`); a commit/actuate power is not expressible and is rejected on registration.

**END PI11-SEC-001.**
