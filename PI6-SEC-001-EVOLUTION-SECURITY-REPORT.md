# PI6-SEC-001 — Evolution Fabric Security Report

| Field | Value |
|-------|-------|
| Artifact | PI6-SEC-001 — Evolution Fabric Security Report |
| Phase | PHASE 14 (AD-0019 execution) |
| Basis | EVO-SEC-001, EVO-GOVERNOR-001, EVO-FED-001; threat model E1–E12 (PI6-REV-003) |
| Status | **SECURE — 16/16 adversarial vectors blocked; E6/E10/E11/E12 closed; S1/S3/S4 preserved** |

## 1. Security mechanisms implemented

| Mechanism | Implementation | Verified |
|-----------|----------------|:--------:|
| Proposal signing | Ed25519 over canonical proposal; `proposerKeyRef` → `KeyRegistry` | ✓ |
| Certification signing + revocation | signed by CA owner key; revoked CA cannot validate | ✓ |
| Ratification + separation of duties | proposer ≠ approver ≠ certifier ≠ ratifier; approval quorum | ✓ |
| Replay protection | single-use `(issuer, nonce)` via `NonceCache` | ✓ |
| Freshness | mandatory future `expiresAt` + clock-skew window (`isFresh`) | ✓ |
| Authority verification | keys by ref; unknown/revoked authority → deny (fail-closed) | ✓ |
| Apply-time verification | re-verify cert + ratification + not-revoked immediately before mutation | ✓ |
| Content integrity | `unitHash = sha256(canonicalize(unit))`; tamper → signature/hash mismatch | ✓ |
| Secrets by reference (S3) | only public keys stored (`KeyRegistry`); no key material in records | ✓ |

## 2. Adversarial verification — 16/16 BLOCKED (`test/evolution-adversarial.test.ts`)

| # | Vector | Result |
|---|--------|:------:|
| 1 | Unauthorized evolution (unratified apply) | BLOCKED |
| 2 | Forged proposal signature | BLOCKED |
| 3 | Forged certification | BLOCKED |
| 4 | Replay / nonce reuse | BLOCKED |
| 5 | Stale (expired) proposal | BLOCKED |
| 6 | Governor bypass (non-allowlisted namespace) | BLOCKED |
| 7 | Self-modification attempt (core-dir codePath) | BLOCKED |
| 8 | Recursive evolution attempt (self-originated proposal) | BLOCKED |
| 9 | Infinite-loop / re-entrancy attempt (maxInFlight=1) | BLOCKED |
| 10 | Rollback abuse (roll back non-active/unknown unit) | BLOCKED |
| 11 | Federation-boundary mutation without token | BLOCKED |
| 12 | Ratification bypass (certified but not ratified) | BLOCKED |
| 13 | Audit tampering | DETECTED |
| 14 | Partial-commit attempt | BLOCKED (atomic revert) |
| 15 | Snapshot corruption | DETECTED (validation) |
| 16 | Restore corruption | DETECTED (rollback verification) |

## 3. Residual-High threat closure (E6/E10/E11/E12)

| Threat | Control (implemented) | Residual |
|--------|-----------------------|:--------:|
| **E10 Self-Modification** | Positive evolvable allowlist; `evolution:` namespace reserved; prohibited codePaths incl. the five core dirs + `src/control/evolution/`. These are **non-expressible** as targets (deny-by-default). | **Low** |
| **E11 Recursive Evolution** | Proposal `origin` must be `external`; `maxInFlight=1`; depth must be 0. Recursion is structurally impossible. | **Low** |
| **E12 Infinite Loops** | Monotonic proposal counter + sliding-window rate limits (proposals + applies) + emergency halt + fail-closed defaults. | **Low–Med** |
| **E6 Federation Destabilization** | Federation-touching change requires a signed re-ratification token; post-apply boundary-invariant re-check (defaultEffect stays `deny`, no raised trust ceiling, no removed boundary) with **auto-rollback** on regression. | **Low–Med** |

Verified operationally: `test/evolution-federation.test.ts` shows a token-bearing attempt to raise a boundary trust ceiling from 5→100 is **auto-rolled-back** and the boundary restored to 5 — federation boundaries can never be silently mutated.

## 4. Non-waivable controls

S1 (deny-by-default authorization on every gate), S3 (secrets by reference), S4 (integrity via signing + hash-chained audit) are preserved and enforced. Concrete apply/rollback/authority acts remain Approval-Required Operations (AD-0009).

**PI6-SEC-001: SECURE.**
