# GOV-FED-001 — UCOS Federated Governance Specification

| Field | Value |
|-------|-------|
| Artifact | **GOV-FED-001 — Federated Governance Specification** |
| Workstream | FND-GOV-04 (PHASE 25 · PI-14.0) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | GOV-GOV-001 (C13, §5); GOV-SEC-001; FED-GOV-001, FED-SEC-001, FED-PROV-001, FED-AUD-001 (reused); AD-0018 (RATIFIED) |
| Realizes gap closure | Threats G12, G14 (primary); supports G1, G2, G9, G13 |
| **Hard constraint** | **NO modification of `src/control/federation/*` behavior (reuse only)** and **NO prohibited-core-dir change** |

> Defines how governance instruments and authorities are recognized across a federation trust boundary — how
> foreign governance is verified, provenance-tagged, isolated, shadowed, and reconciled — **reusing** the
> ratified Federation Fabric (AD-0018) primitives without altering them. Foreign governance may **inform** but
> never **override** a local `active` instrument (local sovereignty, GGP-7). No implementation is authorized.

---

## 1. Federated governance invariants

- **GFV-1 Origin on every federated instrument.** Every governance record crossing the boundary carries an
  attributable origin (home node + issuing Federated Governance Authority + verification result + upstream
  `derivesFrom`). Reuses the FED-PROV-001 `Provenance` envelope.
- **GFV-2 Local sovereignty / shadowing.** On any instrument/authority/right id or scope collision, the
  **local** governance is authoritative; foreign governance is a **shadow** consulted only where local
  governance is silent and only for in-boundary, verified, non-revoked, non-expired origins. Closes **G12**.
- **GFV-3 Namespace isolation.** Foreign governance lives in `federation:<nodeId>:governance:<kind>:<id>` — a
  disjoint keyspace, so `query("governance:")` (local) never returns foreign governance.
- **GFV-4 Verified-before-stored.** No federated governance is persisted until its GOV-SEC-001 governance
  assertion is cryptographically verified, in-boundary, and its `derivesFrom` chain resolves (reuses
  FED-SEC-001 verification).
- **GFV-5 Deny-only influence.** Federated governance can only **add constraints/denials** to a local
  decision; it can never grant authority, raise trust, create a local right, or supersede a local ratified
  instrument (inherits FGP-1 / GGP-7). A foreign instrument is never enforced *as* local law.
- **GFV-6 Precedence & subordination honored end-to-end.** A foreign instrument's precedence is clamped to
  **at most** advisory-below-local; it can never claim local Law/Regulation precedence and can never
  contradict the local Constitution/Authority Layer (GGP-1/GGP-6). Closes the cross-node leg of **G10**.

## 2. Federated governance model (reuse of federation constructs)

| Concern | Reused federation construct | Governance specialization |
|---------|-----------------------------|---------------------------|
| Which nodes' governance is evaluated | `Federation Authority` (FED-GOV-C3) | `Federated Governance Authority` (GOV-GOV-C13) with `governance` power only |
| Boundary of accepted authorities | `Trust Boundary` (FED-GOV-C4) | `Federated Governance Trust Boundary` (GOV-GOV-C13); `defaultEffect: deny` |
| Assertion signing/verification | FED-SEC-001 (Ed25519/ECDSA, canonicalization, nonce) | `GovernanceAssertion` (GOV-SEC-001 §2) — **no new crypto** |
| Provenance keying | FED-PROV-001 namespacing | `federation:<nodeId>:governance:<kind>:<id>` |
| Cross-node audit | FED-AUD-001 hash chain | governance reconciliation linked by `assertionRef` (GOV-AUD-001) |
| Suspension/expulsion | FED-GOV-C10/C11 | suspends/expels a node's governance recognition |

- **No first-class provenance/precedence fields on core ports** — provenance and `derivesFrom`/`precedence`
  are carried in data (FED-PROV convention), proven zero-core-dir-change in GOV-ARCH-001 §5.

## 3. Inbound federated governance flow (async ingest, sync decide)

```
remote node ─▶ GovernanceAssertion (signed) ─▶ federated-governance-guard:
                verify signature (reuse federation assertions)
                → issuer is active in-boundary Federated Governance Authority with `governance` power
                → subject node active (not suspended/expelled)
                → derivesFrom resolves; precedence clamped (advisory-below-local)
                → unexpired + nonce unused (replay)
                → classification permits crossing (S4)
              ─▶ materialize under federation:<nodeId>:governance:<kind>:<id> (verified-before-stored)
                                        │
governed action ─── SYNC ──▶ PI-4 PolicyEvaluator: local ratified Policy first;
                              foreign governance consulted only as deny-only, advisory shadow
```
- Federatable kinds: **Law/Regulation/Policy** may be *recognized as advisory* and **compliance verdicts** may
  be *exchanged*; **Authority/Delegation/Rights/Obligations** are **node-local by default** (a foreign node may
  never grant a local power/right); **dispute rulings** are **export-only** for cross-node forensics.
- **Partition (fail-closed, closes G14):** unreachable authority/issuer ⇒ federated governance treated as
  unverifiable ⇒ absent ⇒ deny; cached foreign governance has bounded staleness + hard expiry.

## 4. Federated reconciliation (local sovereignty)

- Cross-node divergence for shared governance (linked by `assertionRef`) is detected by the Governance Audit &
  Reconciliation Authority (GOV-GOV-C14) and adjudicated under local sovereignty: **local ratified governance
  wins**; foreign divergence is flagged, never auto-applied.
- A foreign instrument that would contradict a local ratified instrument, or claim disallowed precedence, is
  blocked and raised as a governance dispute (GOV-GOV-O3) or evolution proposal — never silently applied.
- Unresolved high-severity divergence ⇒ federated governance **suspension** of the counterpart (reuse FED-GOV
  suspension), pending Board adjudication.

## 5. Anti-poisoning enforcement

- **Governance federation poisoning (G12):** foreign governance is namespaced + deny-only shadow + precedence-
  clamped; a foreign record can never shadow or override a local id (different namespace + GFV-2 precedence);
  enforcement of a *local* action ignores foreign governance except as an additional deny.
- **Cross-node forgery (G1/G2):** foreign governance must resolve to a verified stored federated record with a
  valid provenance signature and a resolving `derivesFrom`; unverifiable ⇒ absent.
- **Replay / stale resurrection (G13/G14):** nonce + freshness + hard expiry + monotonic version guard prevent
  replaying a repealed/superseded foreign instrument or a revoked foreign grant.

## 6. Non-waivable control conformance

| Control | How preserved across federation |
|---------|---------------------------------|
| **S1** | In-boundary authority + deny-by-default recognition of foreign governance; no foreign-granted local power |
| **S3** | Keys/signatures by reference; reuse federation key registry; no key material in governance records |
| **S4** | Classification re-checked on ingest; boundary-crossing gate; precedence/subordination preserved |

## 7. Threat mitigation summary

| Threat | Control | Residual |
|--------|---------|:--------:|
| G12 Governance federation poisoning/override | Namespaced deny-only shadow + precedence clamp + verified-before-stored + local-shadows-foreign | Low–Med |
| G14 Partition / stale federated governance | Fail-closed on partition + bounded staleness + hard expiry | Med |
| G13 Cross-node governance tamper/replay | Signed assertions + reconciliation + monotonic version + nonce | Low–Med |
| G9 Cross-node normative conflict | Precedence clamp + local-ratified-wins + block-and-dispute | Low |

## 8. Traceability
- **Refines:** GOV-GOV-001, GOV-SEC-001; FED-GOV-001, FED-SEC-001, FED-PROV-001, FED-AUD-001; AD-0018.
- **Consumed by:** GOV-AUD-001, GOV-READINESS-001, future PI-14 build.
- **Owner:** UCOS Authority Board (Federation).

**END GOV-FED-001 — DESIGN · READY FOR RATIFICATION · REUSE-ONLY OF FEDERATION FABRIC · NO IMPLEMENTATION AUTHORIZED.**
