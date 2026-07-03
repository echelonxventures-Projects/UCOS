# PI7-RAT-SEC-002 — Cryptographic-Reuse (No Custom Crypto) Verification

| Field | Value |
|-------|-------|
| Artifact | PI7-RAT-SEC-002 — No-Custom-Cryptography Verification |
| Phase | PHASE 16.1 — PI-7 Independent Validation & Ratification |
| Basis | AD-0020 §3 (no custom cryptography); §4 (S3/S4); KNOW-SEC-001 |
| Method | Full-tree grep of `src/control/knowledge/*.ts` for crypto primitives + import-source audit |
| Status | **VERIFIED** — zero custom cryptography; all primitives reused from federation |

## 1. Custom-crypto scan

Searched all 20 knowledge modules for `createHash|createSign|createVerify|randomBytes|crypto\.|generateKeyPair`. Findings:

- **No** `createHash`, `createSign`, `createVerify`, `randomBytes`, or `crypto.*` calls anywhere in the knowledge fabric.
- The only `node:crypto` reference is `import type { KeyObject }` (a type import, no runtime crypto).
- The sole `generateKeyPair()` call (in `knowledge-control.ts`) is the **federation** primitive imported from `../federation/assertions.ts`, used to mint one internal system key for evolution-driven persistence — not a custom implementation.

## 2. Primitive-reuse audit

Every knowledge module requiring cryptography imports from `../federation/assertions.ts`:

| Module | Reused primitives |
|--------|-------------------|
| `knowledge-unit.ts` | `canonicalize`, `sha256` |
| `knowledge-certification-authority.ts` | `signPayload`, `verifyPayload`, `isFresh`, `newNonce`, `KeyRegistry`, `NonceCache` |
| `knowledge-ratification-authority.ts` | `signPayload`, `verifyPayload`, `isFresh`, `newNonce`, `KeyRegistry`, `NonceCache` |
| `knowledge-import-export.ts` | `signPayload`, `verifyPayload`, `isFresh`, `newNonce`, `KeyRegistry` |
| `knowledge-federation-guard.ts` | `verifyPayload`, `isFresh`, `KeyRegistry` |
| `knowledge-audit-log.ts` | `canonicalize`, `sha256` |
| `knowledge-snapshot.ts` | `canonicalize`, `sha256` |
| `knowledge-control.ts` | `KeyRegistry`, `NonceCache`, `generateKeyPair` |

All signing/verification is Ed25519 over canonical payloads; all hashing is `sha256(canonicalize(...))`; all replay/freshness protection uses the federation `NonceCache` + `isFresh` — the same primitives ratified for PI-5.

## 3. S3 / S4 preservation

- **S3 (secrets by reference):** keys handled via `KeyRegistry` keyRefs; private `KeyObject` never serialized into records, bundles, or audit entries.
- **S4 (integrity):** signatures + `sha256` content hashing + hash-chained audit provide tamper evidence end-to-end.

## 4. Determination

The Knowledge Fabric introduces **no** custom cryptography. All cryptographic operations reuse the ratified PI-5 federation primitives, satisfying AD-0020 §3 and preserving non-waivable S3/S4.

**PI7-RAT-SEC-002: VERIFIED.**
