# ONTO-SEC-001 — UCOS Ontology Security Specification

| Field | Value |
|-------|-------|
| Artifact | **ONTO-SEC-001 — Ontology Security Specification** |
| Workstream | FND-ONTO-04 (PHASE 17 · PI-8.0 Ontology Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Basis | ONTO-ARCH-001, ONTO-GOV-001/002; AUTH-008 (non-waivable **S1/S3/S4**); UCOS-SEC-ARCH-001; **FED-SEC-001** (reused crypto); PI-5 `src/control/federation/assertions.ts` |
| Realizes gap closure | Threats O1, O2, O8, O9, O12 (primary); supports O3, O10, O11 |
| Prohibited-dir impact | **NONE** — verification enters via the existing pluggable `CredentialVerifier` and reuses the PI-5 federation crypto primitives; **no custom cryptography** |

> Defines the cryptographic trust model for **ontology assertions** — the signed statements by which
> ontology records are certified, ratified, revoked, and federated. Non-waivable **S1** (authn/authz),
> **S3** (secrets/keys by reference — never inline), and **S4** (data protection) are preserved and
> enforced. **No new cryptography is introduced**: signing/verification reuse the ratified PI-5
> `assertions.ts` (Ed25519) primitives. No implementation is authorized.

---

## 1. Objective

Ontology is the semantic schema of the platform; a forged entity type, a poisoned taxonomy edge, or a
tampered `block` constraint could silently corrupt meaning across every consumer. This spec ensures every
**governed ontology act crosses a signature-verified, replay-resistant, authority-scoped boundary** before
it can affect the ontology graph — turning ONTO-ARCH-001's constructs into a defensible layer.

## 2. Ontology assertion model

All governed ontology acts are expressed as **signed assertions**, never raw records. Reuses the FED-SEC
canonicalization + Ed25519 signature discipline.

### 2.1 Ontology Certification Assertion (`ONTO-SEC-CA`) — closes O9
```
OntologyCertification {
  assertionType: "ontology-certification",
  subject: { namespace, recordId, unitHash },   // content-addressed target
  issuer: authorityId,                            // an active OG-C7 Certification Authority
  issuedAt, expiresAt, nonce, signature           // over canonical(assertion \ signature)
}
```
- Verified to a registered, active authority holding the `certify` power (ONTO-GOV-001 OG-C2/OG-C7).
- Binds the certification to the **content hash** — re-signing a mutated body is impossible without a new
  hash (closes tampering, O11-forensics).

### 2.2 Ontology Ratification Assertion (`ONTO-SEC-RA`) — closes O8
```
OntologyRatification {
  assertionType: "ontology-ratification",
  subject: { namespace, recordId, unitHash },
  issuer: ratAuthorityId, quorumRefs: assertionId[],   // distinct validators (SoD + quorum)
  issuedAt, expiresAt, nonce, signature
}
```
- Ratifier must be **distinct** from the certifier (separation of duties, OGP-3); `quorumRefs` supply the
  validator quorum required by OG-C6. Missing quorum ⇒ deny.

### 2.3 Ontology Trust / Federation Assertion (`ONTO-SEC-TA`) — closes O2/O12
```
OntologyTrustAssertion {
  assertionType: "ontology-trust",
  subject: { nodeId, namespace, recordId },
  level,                                          // clamped to boundary.maxTrustLevel and delegation cap
  issuer: fedAuthorityId, issuedAt, expiresAt, nonce, signature
}
```
- Federated ontology trust is **clamped** (min of asserted level, delegation cap, boundary cap) — an
  over-cap or out-of-boundary assertion contributes **0**, not merely ignored (bounded acceptance).

## 3. Cryptographic verification (`ONTO-SEC-CV`)

- **Reuse only.** Canonicalization (sorted keys, no insignificant whitespace) and Ed25519 sign/verify are
  taken **verbatim** from PI-5 `src/control/federation/assertions.ts`. **No custom crypto** (AD-0020-style
  prohibition; closes home-grown-crypto risk).
- **Keys by reference (S3).** Every `keyRef` resolves from the governed key registry; **no key material in
  records, descriptors, or code**. Rotation is a governed act; revoked keys fail-closed.
- **Verification chain.** signature valid → issuer is an active in-boundary ontology authority holding the
  required power → subject namespace/record is `active` (not suspended/revoked) → assertion unexpired →
  nonce unused → (for ratification) SoD + quorum satisfied.

## 4. Replay & freshness (`ONTO-SEC-RP`) — closes O3

- **Nonce cache** per `(issuer, nonce)` with TTL ≥ assertion max lifetime; duplicate ⇒ reject.
- **Freshness window.** `issuedAt` within an allowed clock-skew window; `expiresAt` mandatory and short.
- Prevents replay of a stale certification/ratification to resurrect a superseded or revoked record.

## 5. Authority & boundary verification (`ONTO-SEC-AV`) — closes O8

- An assertion is accepted **only if** its `issuer` is a registered, active ontology authority **inside
  the evaluating namespace's applicable trust boundary** (OG-C9) and holds the specific enumerated power
  (`certify`/`ratify`/`revoke`/`federate`) for the assertion type.
- **No implicit authority**: unknown issuer, out-of-boundary issuer, or missing power ⇒ deny.
- Authority powers are a strict subset of the namespace's granted scope (OGP-4).

## 6. Constraint & taxonomy tamper protection (`ONTO-SEC-CT`) — closes O5/O11

- **Semantic constraints and taxonomy records are content-hashed and signed** exactly like other ontology
  units; a tampered `block` constraint or an injected taxonomy edge changes the `unitHash`, invalidating
  its certification/ratification and failing verification.
- The **active** constraint/taxonomy set consulted by the graph projection (ONTO-ARCH-001 §4) is only that
  which is certified + ratified + unrevoked — a smuggled, unsigned edge/constraint is never `active`.
- Non-waivable rule: **no ontology construct may weaken S1/S3/S4** (OGP-7); a constraint or federation
  import attempting to do so is rejected at verification (security wins over meaning).

## 7. Enforcement placement (defense in depth)

Ontology security is **additive** to the ratified pipeline and never bypasses it:

```
ontology act / assertion
  → [ONTO] verify signature + authority + boundary + replay + SoD/quorum        (reuse FED-SEC crypto)
  → semantic integrity gate SI-1..SI-7 (fail-closed)                            (ONTO-GOV-002)
  → route mutation through Evolution Fabric (atomic apply, governor)            (PI-6, unchanged)
  → PI-4 PEP (identity/trust/policy/governance, deny-by-default)                (unchanged)
  → kernel.execute (ratified contract enforcement)                             (PI-2 Meta-Core, UNCHANGED)
  → hash-chained ontology audit                                                (ONTO-AUD-001)
```
The Meta-Core contract validation and the PI-4 PEP remain the final gates (defense-in-depth, proven in
prior PIs).

## 8. Threat mitigation summary

| Threat | Control | Residual |
|--------|---------|:--------:|
| O1 Entity/authority spoofing | Signed assertions + authority + boundary verification | Low |
| O2 Ontology trust poisoning | Bounded/clamped trust, in-boundary signed trust assertions | Low–Med |
| O3 Replay of stale certification | Nonce cache + freshness + expiry | Low |
| O5 Taxonomy edge injection (crypto side) | Content-hash + signed taxonomy units; unsigned edge never active | Low |
| O8 Authority escalation | Enumerated powers, SoD + quorum, no implicit authority | Low |
| O9 Certification bypass | Signature-verified authority + local-authoritative store + revocation | Low |
| O11 Constraint tampering (crypto side) | Content-hash + signature; tampered constraint fails verify | Low |
| O12 Cross-node ontology impersonation | Namespaced id + provenance signature (ONTO-FED-001) | Low |

## 9. Traceability
- **Refines:** AUTH-008 (S1/S3/S4), UCOS-SEC-ARCH-001, FED-SEC-001, ONTO-GOV-001/002.
- **Consumed by:** ONTO-FED-001 (import verification), ONTO-AUD-001 (assertion signing/linkage),
  ONTO-THREAT-001, future PI-8 build.
- **Owner:** UCOS Authority Board (Security).

**END ONTO-SEC-001 — DESIGN · READY FOR RATIFICATION · NO CUSTOM CRYPTOGRAPHY · NO IMPLEMENTATION AUTHORIZED.**
