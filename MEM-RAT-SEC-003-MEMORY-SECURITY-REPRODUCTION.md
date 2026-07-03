# UCOS — MEM-RAT-SEC-003 · Memory Fabric Security Reproduction

## PHASE 18.3-R2 — PI-9 Memory Fabric Independent Validation & Ratification

| Field | Value |
|-------|-------|
| Artifact | **MEM-RAT-SEC-003 — Security Reproduction** |
| Artifact ID | `UCOS-MEM-RAT-SEC-003` |
| Authorizing act | **AD-0023** (§4 non-waivable S1/S3/S4; no custom cryptography; SoD non-waivable) |
| Mode | **INDEPENDENT SECURITY REPRODUCTION** — controls verified from source + adversarial execution |
| Effective | 2026-07-01 |
| **Determination** | **SECURITY PASS — replay protection, certification/ratification authorities, SoD, and M1–M12 fail-closed all reproduced; no custom cryptography** |

---

## 1. Replay Protection (reproduced)

`src/control/memory/signed-assertion-verifier.ts` enforces, fail-closed and in order: **freshness**
(expiry/skew) → **unit integrity** (`unitHash` matches carried unit) → **resolvable public key** (by
reference, S3) → **valid Ed25519 signature** → **single-use replay** via the federation `NonceCache`. A
`(issuer, nonce)` pair is single-use within TTL; the nonce is consumed **only after** signature/freshness/
integrity pass (failed probes cannot burn a legitimate nonce). `MemoryControl` and `MemoryFederationGuard`
both instantiate/share a `NonceCache`. **Replay protection ACTIVE.** ✅

Adversarial confirmation: `memory-adversarial.test.ts` **M1 — Replay**: a re-presented signed bundle is
rejected (single-use nonce, fail-closed) — PASS.

## 2. Certification & Ratification Authorities (reproduced)

- **Certification Authority** — `memory-certification-authority.ts` (MEM-GOV-001 C5): attests unit
  well-formedness/classification/provenance; issues a **signed** certification over `unitHash` (reusing
  federation Ed25519); verification fail-closed (unknown authority / missing key / bad signature ⇒ invalid).
  **ACTIVE.** ✅
- **Ratification Authority** — `memory-ratification-authority.ts` (MEM-GOV-001 C6): terminal authority;
  binds ratification to the upstream `certificationId`; issues a **signed** ratification over `unitHash`;
  enforces **quorum** (distinct ratifiers) and SoD; verification fail-closed. **ACTIVE.** ✅

## 3. Separation of Duties (reproduced)

Non-waivable **consolidate ≠ certify ≠ ratify** enforced at two layers (defence in depth):
- `memory-ratification-authority.ts`: rejects `consolidator === certifier`; de-dups ratifiers; enforces
  neither consolidator nor certifier appears among ratifiers.
- `memory-control.ts` durable-commit path: re-asserts SoD structurally
  (`consolidator===certifier || ratifiers.includes(consolidator) || ratifiers.includes(certifier) ⇒ deny`)
  **and** enumerated-power checks (`hasPower(consolidator,"consolidate")`, `…,"certify"`, `…,"ratify"`) —
  no implicit authority (M4 escalation ⇒ deny). **SoD ENFORCEMENT ACTIVE.** ✅

## 4. M1–M12 Adversarial Suite (reproduced)

Present and passing. `memory-adversarial.test.ts` header enumerates the full ledger and each vector asserts
**fail-closed** (attack denied; no governed state mutated/recalled/escalated/bypassed):

| Vector | Threat | Vector | Threat |
|--------|--------|--------|--------|
| M1 | Replay | M7 | Federation Poisoning |
| M2 | Forged Assertion | M8 | Trust Inflation / consolidation self-promotion |
| M3 | Namespace Escape | M9 | Memory Corruption |
| M4 | Authority Escalation | M10 | Retention Bypass |
| M5 | Silent Mutation | M11 | Revocation Bypass / semantic desync |
| M6 | Audit Tampering | M12 | Evolution Bypass / WM exhaustion |

`memory-adversarial-canonical.test.ts` adds the canonical MEM-THREAT-001 closure for **M8 / M11 / M12**
(SoD self-promotion; memory↔knowledge co-ratification desync; working/short-term size caps).

Reproduced execution (6 memory test files): **56 tests, 56 pass, 0 fail.** **M1–M12 PRESENT AND PASSING.** ✅

## 5. No Custom Cryptography (reproduced)

Source scan of `src/control/memory/*.ts` for crypto primitives (`createHash`/`createCipher`/`createSign`/
`randomBytes`/`crypto.`/`subtle`): **only `import type { KeyObject } from "node:crypto"`** (type-only, no
runtime crypto) in three modules. All cryptographic operations are delegated to the federation primitives
`KeyRegistry`, `signPayload`, `verifyPayload`, `NonceCache`, `generateKeyPair` imported from
`../federation/assertions.ts` (Ed25519). **NO CUSTOM CRYPTOGRAPHY.** ✅

## 6. Non-Waivable Controls (AD-0023 §4)

| Control | Reproduced evidence | Status |
|---------|---------------------|:------:|
| S1 (authn/authz) | signed assertions + enumerated-power authority checks; deny-by-default | ✅ |
| S3 (secrets) | keys **by reference** (`keyRef`); no key material in records/code | ✅ |
| S4 (data protection) | monotonic classification; federation-guard rejects records exceeding boundary ceiling | ✅ |

## 7. Determination

> ## SECURITY PASS
>
> Replay protection (single-use nonce + freshness + integrity), the certification and ratification
> authorities, and non-waivable SoD (consolidate ≠ certify ≠ ratify, enforced at two layers) all reproduce
> as active. The M1–M12 adversarial suite is present and **56/56 green** with all vectors fail-closed. No
> custom cryptography exists — the fabric reuses the federation Ed25519 primitives exclusively. S1/S3/S4
> are preserved.

## Traceability
- **Refines:** AD-0023 (§2/§4), `MEM-SEC-001`, `MEM-FED-001`, `MEM-THREAT-001` (M1–M12),
  `federation/assertions.ts`.
- **Refined by:** `MEM-RAT-003`.
- **Owner:** UCOS Authority Board (independent validation authority).

**END MEM-RAT-SEC-003 — SECURITY PASS · REPLAY+AUTHORITIES+SoD ACTIVE · M1–M12 56/56 · NO CUSTOM CRYPTO.**
