# FED-AUD-001 — UCOS Federation Audit & Reconciliation Specification

| Field | Value |
|-------|-------|
| Artifact | **FED-AUD-001 — Federation Audit & Reconciliation Specification** |
| Workstream | FND-FED-04 (PHASE 11.3 · PI-5.0) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Basis | PI5-REV-002 (T10); PI-4 `audit-log.ts` (`AuditSink`, append-only, frozen); FED-GOV-C9; FED-SEC-001 |
| Realizes gap closure | Threat T10 (audit divergence); tamper-evidence for T1/T2/T11 forensics |
| Prohibited-dir impact | **NONE** — extends the control-layer `AuditSink` interface; adds a new federated sink implementation |

> PI-4's `InMemoryAuditLog` is append-only and returns frozen defensive copies (verified tamper-resistant
> in PHASE 11.1 A13), but it is **single-process and not cryptographically tamper-evident or reconcilable
> across nodes**. This spec defines a federation-grade audit that is hash-chained, signed, exportable, and
> reconcilable — implemented as a **new `AuditSink`** behind the existing PI-4 seam.

---

## 1. Hash chaining (`FED-AUD-HC`) — tamper evidence

Each audit entry is extended (in the sink, not in the PI-4 `AuditEntry` shape) with chain metadata:
```
ChainedEntry {
  entry: AuditEntry,                 // existing PI-4 shape (at, identityId, capabilityId, operation, effect, reason)
  seq,                               // monotonic per node
  prevHash,                          // hash of the previous ChainedEntry (genesis = 0)
  entryHash = H(canonical(entry) || seq || prevHash),
  nodeId,                            // recording node (provenance)
  signature?                         // node signs entryHash (S3: key by reference)
}
```
- **Append-only + chained:** any mutation/removal of a historical entry breaks `entryHash` continuity for
  all subsequent entries → tamper is detectable by verification (§5).
- Preserves PI-4 immutability (frozen entries, defensive-copy reads) as the in-memory baseline.

## 2. Tamper evidence (`FED-AUD-TE`)

- The chain head hash is a compact commitment to the entire log.
- Optional periodic **checkpoints**: signed `(seq, headHash, at)` anchors an Audit Authority can attest,
  bounding the reconciliation/verification cost.

## 3. Cross-node reconciliation (`FED-AUD-REC`) — closes T10

- Nodes exchange **signed checkpoints** and, on request from an `Audit Authority` (FED-GOV-C9), ranges of
  `ChainedEntry` for federated interactions they participated in.
- Reconciliation compares, for shared interactions (linked by FED-SEC-001 `assertionRef`), that both
  nodes recorded consistent `(effect, subject, capability, at±skew)`.
- Reconciliation is **read-only and evidence-only**; it never rewrites either node's chain (append-only).

## 4. Divergence detection (`FED-AUD-DIV`)

Divergence classes and required response:

| Class | Signal | Response |
|-------|--------|----------|
| **Hash break** | `entryHash`/`prevHash` mismatch | Local integrity alarm; chain quarantined; Board-escalated |
| **Missing counterpart** | Interaction present on one node only | Flag; investigate; may trigger Suspension (FED-GOV-C10) |
| **Effect mismatch** | Same interaction, different allow/deny | High-severity; fail-closed on the affected relationship |
| **Checkpoint mismatch** | Signed head hashes disagree for overlapping range | Reconciliation failure; Audit Authority adjudicates |

Divergence is **fail-closed**: an unresolved high-severity divergence suspends acceptance from the
counterpart node pending Board adjudication.

## 5. Audit export & verification (`FED-AUD-EXP` / `FED-AUD-VER`)

- **Export.** Deterministic, canonical serialization of a `ChainedEntry` range + checkpoint (signed);
  suitable for offline verification and Board review.
- **Verification (independent, offline).** Recompute `entryHash` for each entry from `canonical(entry) ||
  seq || prevHash`; confirm chain continuity to the signed checkpoint; verify node/authority signatures to
  registered `keyRef`s. Verification requires **no live node** — mirrors the PHASE 11.1 adversarial
  methodology (offline, evidence-based).

## 6. Placement (no core-dir change)

- Implemented as `FederatedAuditLog implements AuditSink` in the **control layer** (`src/control/`), passed
  to `createControlPlane({ auditSink })` — the PI-4 assembly already accepts an `auditSink` override.
- The PI-4 `AuditEntry` type and `ControlPlane` audit call are **unchanged**; chaining/signing/export are
  added around the existing record.

## 7. Threat mitigation summary

| Threat | Control | Residual |
|--------|---------|:--------:|
| T10 Audit divergence | Hash chaining + signed checkpoints + cross-node reconciliation + fail-closed divergence handling | Low–Med (bounded by reconciliation cadence) |
| T1/T2/T11 (forensics) | Tamper-evident, exportable, independently verifiable trail with provenance | Improves detection & attribution |

## 8. Traceability
- **Refines:** PI5-REV-002 (T10), PI-4 `audit-log.ts`/`AuditSink`, FED-GOV-C9, FED-SEC-001, FED-PROV-001.
- **Consumed by:** FED-ARCH-001; future PI-5 build; Authority Board audit review.
- **Owner:** UCOS Authority Board (Audit).

**END FED-AUD-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
