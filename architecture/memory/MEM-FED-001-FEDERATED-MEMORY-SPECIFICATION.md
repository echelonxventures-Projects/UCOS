# MEM-FED-001 — UCOS Federated Memory Specification

| Field | Value |
|-------|-------|
| Artifact | **MEM-FED-001 — Federated Memory Specification** |
| Workstream | FND-MEM-04 (PHASE 18 · PI-9.0) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | MEM-GOV-001 (T6, C9/C10/C12); MEM-SEC-001; FED-GOV-001, FED-SEC-001, FED-PROV-001, FED-AUD-001 (reused); AD-0018 (RATIFIED) |
| Realizes gap closure | Threats M5, M6 (primary); supports M1, M4, M10, M11 |
| **Hard constraint** | **NO modification of `src/control/federation/*` behavior (reuse only)** and **NO prohibited-core-dir change** |

> Defines how memory is exchanged across a federation trust boundary — how foreign memory is verified,
> provenance-tagged, isolated, shadowed, and reconciled — **reusing** the ratified Federation Fabric
> (AD-0018) primitives without altering them. Foreign memory may **inform** but never **override** a local
> `active` memory (local sovereignty). No implementation is authorized.

---

## 1. Federated memory invariants

- **MFV-1 Origin on every federated memory.** Every memory crossing the boundary carries an attributable
  origin (home node + issuing Federated Memory Authority + verification result + source tier). Reuses the
  FED-PROV-001 `Provenance` envelope.
- **MFV-2 Local sovereignty / shadowing.** On any `subjectRef`/id collision, the **local** memory is
  authoritative; foreign memory is a **shadow** consulted only on local miss and only for in-boundary,
  verified, non-revoked, non-expired origins. Closes **M5**.
- **MFV-3 Namespace isolation.** Foreign memory lives in `federation:<nodeId>:memory:<tier>:<id>` — a
  disjoint keyspace, so `query("memory:")` (local) never returns foreign memory.
- **MFV-4 Verified-before-stored.** No federated memory is persisted until its MEM-SEC-001 memory assertion
  is cryptographically verified and in-boundary (reuses FED-SEC-001 verification).
- **MFV-5 Deny-only influence.** Federated memory can only **add context/denials** to a local decision; it
  can never grant recall access, raise trust, or supersede a local ratified memory (inherits FGP-1 / MGP-6).
- **MFV-6 Classification honored end-to-end (S4).** A federated memory's classification travels with the
  assertion and is re-checked on ingest; memory whose classification forbids boundary crossing is rejected.

## 2. Federated memory model (reuse of federation constructs)

| Concern | Reused federation construct | Memory specialization |
|---------|-----------------------------|-----------------------|
| Which nodes' memory is evaluated | `Federation Authority` (FED-GOV-C3) | `Federated Memory Authority` (MEM-GOV-C9) with `memory` power only |
| Boundary of accepted authorities | `Trust Boundary` (FED-GOV-C4) | `Memory Trust Boundary` (MEM-GOV-C10); `defaultEffect: deny` |
| Assertion signing/verification | FED-SEC-001 (Ed25519/ECDSA, canonicalization, nonce) | `MemoryAssertion` (MEM-SEC-001 §2) — **no new crypto** |
| Provenance keying | FED-PROV-001 namespacing | `federation:<nodeId>:memory:<tier>:<id>` |
| Cross-node audit | FED-AUD-001 hash chain | memory reconciliation linked by `assertionRef` (MEM-AUD-001) |
| Suspension/expulsion | FED-GOV-C10/C11 | suspends/expels a node's memory acceptance |

- **No first-class provenance fields on core ports** — provenance is carried in data (FED-PROV convention),
  proven zero-core-dir-change in MEM-ARCH-001 §5.

## 3. Inbound federated recall flow (async ingest, sync decide)

```
remote node ─▶ MemoryAssertion (signed) ─▶ federated-memory-guard:
                verify signature (reuse federation assertions)
                → issuer is active in-boundary Federated Memory Authority with `memory` power
                → subject node active (not suspended/expelled)
                → unexpired + nonce unused (replay)
                → classification permits crossing (S4)
              ─▶ materialize under federation:<nodeId>:memory:<tier>:<id> (verified-before-stored)
                                        │
recall(subjectRef) ─── SYNC ──▶ recall-engine: local `memory:*` first;
                                 on miss, in-boundary verified federated shadow only (deny-only)
```
- Federated tiers: **Long-Term** and **Semantic** memory are federatable (classification-gated); **Working**
  and **Short-Term** are node-local by default; **Episodic** is **export-only** for reconciliation/forensics
  (not imported as recallable local memory).
- **Partition (fail-closed, closes M6):** unreachable authority/issuer ⇒ federated memory treated as
  unverifiable ⇒ absent ⇒ deny; cached foreign memory has bounded staleness + hard expiry.

## 4. Federated reconciliation (local sovereignty)

- Cross-node divergence for shared memory (linked by `assertionRef`) is detected by the Memory Audit
  Authority (MEM-GOV-C11) and adjudicated under the Reconciliation Policy (MEM-GOV-C12): **local ratified
  memory wins**; foreign divergence is flagged, never auto-applied.
- A memory that would contradict a ratified **knowledge** record (Semantic tier) is blocked and raised as a
  Knowledge Fabric evolution proposal (closes **M11** at the boundary).
- Unresolved high-severity divergence ⇒ federated memory **suspension** of the counterpart (reuse FED-GOV
  suspension), pending Board adjudication.

## 5. Anti-poisoning enforcement

- **Federation poisoning (M5):** foreign memory is namespaced + deny-only shadow; a foreign record can never
  shadow or override a local id (different namespace + MFV-2 precedence); recall of a *local* subject ignores
  federated memory entirely unless local miss.
- **Recall fabrication across nodes (M4):** foreign recall must resolve to a verified stored federated record
  with valid provenance signature; unverifiable ⇒ absent.
- **Replay / stale resurrection (M7/M6):** nonce + freshness + hard expiry prevent replaying old memory
  assertions to resurrect forgotten/superseded federated memory.

## 6. Non-waivable control conformance

| Control | How preserved across federation |
|---------|---------------------------------|
| **S1** | In-boundary authority + deny-by-default recall of foreign memory |
| **S3** | Keys/signatures by reference; reuse federation key registry; no key material in memory |
| **S4** | Classification re-checked on ingest; boundary-crossing gate; recall projection preserved |

## 7. Threat mitigation summary

| Threat | Control | Residual |
|--------|---------|:--------:|
| M5 Federation memory poisoning | Namespaced deny-only shadow + verified-before-stored + local-shadows-foreign | Low–Med |
| M6 Partition / stale federated recall | Fail-closed on partition + bounded staleness + hard expiry | Med |
| M10 Memory audit divergence (cross-node) | Reconciliation linked by `assertionRef` + fail-closed suspension | Low–Med |
| M11 Semantic↔knowledge desync (cross-node) | Block-and-propose to Knowledge Fabric; local ratified wins | Low |

## 8. Traceability
- **Refines:** MEM-GOV-001/002, MEM-SEC-001; FED-GOV-001, FED-SEC-001, FED-PROV-001, FED-AUD-001; AD-0018.
- **Consumed by:** MEM-AUD-001, MEM-READINESS-001, future PI-9 build.
- **Owner:** UCOS Authority Board (Federation).

**END MEM-FED-001 — DESIGN · READY FOR RATIFICATION · REUSE-ONLY OF FEDERATION FABRIC · NO IMPLEMENTATION AUTHORIZED.**
