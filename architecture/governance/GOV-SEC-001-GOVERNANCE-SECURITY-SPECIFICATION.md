# GOV-SEC-001 — UCOS Governance Fabric Security Specification

| Field | Value |
|-------|-------|
| Artifact | **GOV-SEC-001 — Governance Fabric Security Specification** |
| Workstream | FND-GOV-03 (PHASE 25 · PI-14.0) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | GOV-THREAT-001; GOV-GOV-001; AUTH-008 (non-waivable S1/S3/S4); `UCOS-CONST-001` Part X/XI; UCOS-SEC-ARCH-001; FED-SEC-001 (reused crypto) |
| Realizes gap closure | Threats G1, G2, G3, G5, G7, G8, G10 (primary); supports G4, G6, G9, G13 |
| Prohibited-dir impact | **NONE** — verification enters via the existing pluggable `CredentialVerifier` + control-layer governance guards; reuses `src/control/federation/assertions.ts` |

> Defines the security model for enacting, granting, enforcing, attesting, and adjudicating governance.
> Non-waivable **S1** (authn/authz), **S3** (secrets by-reference — never in code/records), and **S4** (data
> protection / classification) are preserved and enforced at every governance boundary. Because a corrupted
> governance instrument could authorize anything, the model makes every governance act **attributable,
> upstream-traceable, precedence-correct, and non-repudiable**. **No custom cryptography** — the fabric reuses
> the ratified federation assertion/signature primitives. No implementation is authorized.

---

## 1. Threat-driven objectives

The Governance Fabric is the system's highest-value target: a forged Law, an escalated authority, a fabricated
right, or a subverted precedence could grant unlimited effect. The security model therefore guarantees that
(a) every governance record is signed and attributable, (b) every instrument traces upward to a ratified
Authority/Constitution source, (c) precedence and subordination cannot be inverted, and (d) enforcement can
never be bypassed.

## 2. Authenticated, upstream-bound governance records (`GOV-SEC-GR`) — closes G1/G2

Every governance write (instrument, authority, delegation, right, obligation, compliance verdict, dispute
ruling) is a **signed governance assertion**, never a raw value:
```
GovernanceAssertion {
  assertionType: "governance",
  kind: "law"|"regulation"|"policy"|"authority"|"delegation"|"right"|"obligation"|"compliance"|"dispute",
  subject: { nodeId, targetRef },
  derivesFrom: [ authority/constitution/higher-instrument refs ],   // GGP-1 upstream chain (mandatory)
  precedence,                          // GGP-6 tier; validated ≤ every derivesFrom precedence
  classification,                      // S4 label
  body | assertionRef,                 // normative statement / grant / verdict / ruling
  issuer: authorityId,                 // in-boundary Governance Authority with the required enumerated power
  issuedAt, expiresAt?, nonce,
  signature                            // over canonical(assertion \ signature), verifiable to issuer keyRef
}
```
- An assertion with an empty or non-resolving `derivesFrom` is **rejected** (GGP-1) — no orphan instrument can
  exist. Closes **G1 illegitimate instrument injection**.
- Certification (C5) verifies well-formedness + upstream trace + precedence-correctness + S1/S3/S4-safety
  before an instrument may be proposed for ratification.

## 3. Authorization of governance acts (`GOV-SEC-AUTHZ`, S1) — closes G3/G7

- **Deny-by-default** on every governance act: proposing, ratifying, granting, delegating, enforcing,
  attesting, and adjudicating each require an explicit enumerated power, evaluated by the PI-4
  `PolicyEvaluator` (deny-overrides-allow).
- **Enumerated, non-escalating authority (GGP-4):** an issuer may only exercise powers it holds; a delegation
  may only grant a **subset** (`⊆`) of the delegator's powers and scope; delegation depth is bounded and
  **cycle-checked** (reuse PI-2 dependency resolver). No implicit/transitive power. Closes **G3 escalation**.
- **Separation of duties (non-waivable, GGP-9):** propose (C4) ≠ certify (C5) ≠ ratify (C6) ≠ enforce (C9) ≠
  adjudicate (C11). No principal may fill two roles for the same act.
- **Enforcement cannot be bypassed (closes G7):** the only path to a governed action is through the PI-4
  Control Plane / PEP consuming ratified Policy; there is no side channel. See §9.

## 4. Precedence, subordination & classification (`GOV-SEC-PREC`, S4) — closes G10/G2

- **Precedence is enforced, not advisory (GGP-6):** every instrument's `precedence` must be **≤** the
  precedence of every element in its `derivesFrom` chain; a Policy may not claim Law precedence, and **nothing**
  may claim Constitution/Authority precedence. Violations are rejected at certification. Closes **G10
  precedence subversion**.
- **Subordination is absolute (GGP-1):** no fabric assertion may amend, override, or contradict the Authority
  Layer or Constitution; the `precedence-resolver` treats them as the top, immutable tier. An assertion that
  would weaken a **non-waivable S1/S3/S4** control is rejected regardless of signature or precedence.
- **Classification (S4):** governance records carry a classification; a governance record that references or
  embeds classified subject data honors monotonic classification and recall projection (reuse the ratified
  data-protection model); secrets/keys are **by reference only** (S3).

## 5. Cryptographic verification (`GOV-SEC-CV`) — reuse, no new crypto

- Reuses federation canonicalization + asymmetric signatures (Ed25519/ECDSA-P256, algorithm agility via
  `keyRef.alg`) from `src/control/federation/assertions.ts`. **No governance-specific cipher is defined.**
- **Verification chain:** signature valid → issuer is an active in-boundary Governance Authority holding the
  required enumerated power → `derivesFrom` resolves to active, non-revoked upstream sources → precedence
  ≤ upstream → subject not revoked/suspended → assertion unexpired → nonce unused.

## 6. Replay & rollback protection (`GOV-SEC-RP`) — closes G13 (replay leg)

- **Nonce cache** per (issuer, nonce) with TTL ≥ assertion max lifetime; duplicate ⇒ reject.
- **Freshness window** on `issuedAt`; mandatory `expiresAt` on grants/delegations. Prevents replaying a
  superseded/repealed instrument or a revoked grant to resurrect it.
- **Monotonic version guard:** an instrument version lower than the current ratified version is rejected
  (no downgrade of Law/Regulation/Policy).

## 7. Anti-fabrication of grants & attestations (`GOV-SEC-AF`) — closes G5/G8

- **Rights (G5):** a right is honored only if it resolves to a stored, verified, non-revoked `governance:right:*`
  record that traces to a ratified instrument; an unheld right is **denied**, never inferred.
- **Compliance (G8):** a compliance verdict is valid only if signed by an in-boundary Compliance Authority
  **distinct** from the enforcer of the attested act (SoD), with resolvable `evidenceRef[]`; a self-attested or
  unsigned verdict is rejected.

## 8. Federated-governance boundary enforcement (`GOV-SEC-FBE`, S1) — closes G12/G14

- Inbound federated governance is verified against the **Federated Governance Trust Boundary** (GOV-GOV-C13):
  `defaultEffect = deny`; only listed Federated Governance Authorities are considered; foreign governance is a
  **deny-only shadow** (never overrides a local `active` instrument).
- **Partition (fail-closed):** unreachable issuer/authority ⇒ dependent federated governance unverifiable ⇒
  deny; cached foreign governance honors bounded staleness + hard expiry.

## 9. Enforcement placement (defense in depth)

Governance security is **additive** to, and never bypasses, the ratified pipeline:
```
governance act / governed action
  → [GOV] verify governance assertion (sig/authority/derivesFrom/precedence/replay/classification)  (new governance guard)
  → Identity resolve (local or federated, provenance-tagged)                                         (PI-4 IdentityResolver)
  → Trust resolve (clamped federated + local)                                                        (PI-4 TrustEvaluator)
  → Policy evaluate (deny-by-default; ratified Policy from Law/Regulation)                            (PI-4 PolicyEvaluator, UNCHANGED)
  → Governance gates (propose/certify/ratify/enforce/adjudicate; revocation-aware; SoD)              (PI-4 + Evolution/AD-0019)
  → kernel.execute (ratified contract enforcement)                                                   (PI-2 Meta-Core, UNCHANGED)
  → audit (hash-chained, signed; amendment/dispute linkage)                                          (GOV-AUD-001 / AD-0018)
```

## 10. Non-waivable control conformance (AUTH-008)

| Control | How preserved |
|---------|---------------|
| **S1** authn/authz | Deny-by-default governance acts; enumerated non-escalating authority; SoD; enforcement gate cannot be bypassed |
| **S3** secrets by-reference | `keyRef`/`signatureRef` only; no key material or secret in any governance record; no custom crypto |
| **S4** data protection | Classification on governance records; precedence/subordination enforcement; monotonic classification for embedded subject data |

## 11. Threat mitigation summary

| Threat | Control | Residual |
|--------|---------|:--------:|
| G1 Illegitimate instrument injection | Signed assertion + mandatory `derivesFrom` + certification | Low |
| G2 Authority forgery/impersonation | Signed enumerated-power assertions; verification chain | Low |
| G3 Authority/privilege escalation | Enumerated non-escalating powers; deny-by-default | Low |
| G5 Rights fabrication | Deny-by-default; right must resolve to ratified instrument | Low |
| G7 Enforcement bypass | Single PI-4 PEP path; no side channel; audited enforcement | Low |
| G8 Compliance falsification | Signed, SoD-separated, evidence-referenced verdicts | Low |
| G10 Precedence subversion | Precedence ≤ upstream enforced at certification; immutable top tier | Low |

## 12. Traceability
- **Refines:** GOV-GOV-001, GOV-THREAT-001, AUTH-008 (S1/S3/S4), `UCOS-CONST-001` Part X/XI, UCOS-SEC-ARCH-001,
  FED-SEC-001.
- **Consumed by:** GOV-FED-001, GOV-AUD-001, GOV-READINESS-001, future PI-14 build.
- **Owner:** UCOS Authority Board (Security).

**END GOV-SEC-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
