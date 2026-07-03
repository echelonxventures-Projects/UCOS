# ONTO-AUD-001 — UCOS Ontology Audit & Reconciliation Specification

| Field | Value |
|-------|-------|
| Artifact | **ONTO-AUD-001 — Ontology Audit & Reconciliation Specification** |
| Workstream | FND-ONTO-06 (PHASE 17 · PI-8.0 Ontology Foundations) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only; no implementation) |
| Basis | ONTO-ARCH-001, ONTO-GOV-002, ONTO-SEC-001, ONTO-FED-001; **FED-AUD-001** (PI-5 hash-chain, reused); PI-4 `AuditSink` (append-only, frozen); PI-7 knowledge audit log |
| Realizes gap closure | Threat O10 (unauthorized/silent mutation forensics), O7 (drift detection); tamper-evidence & attribution for O1/O5/O11/O12 |
| Prohibited-dir impact | **NONE** — extends the control-layer `AuditSink`; adds an ontology sink implementation; reuses FED-AUD chaining |

> The ontology graph is the platform's schema of meaning; every governed change to it must be
> **tamper-evident, attributable, exportable, and independently verifiable**. This spec defines a
> federation-grade ontology audit implemented as a **new `AuditSink`** behind the existing PI-4 seam,
> reusing the ratified FED-AUD-001 hash-chain — **no new audit machinery, no core-dir change**.

---

## 1. What is audited (`ONTO-AUD-EV`)

Every governed ontology act emits an audit entry, all routed through the Evolution Fabric apply step
(ONTO-GOV-002 §3) so the audit trail and the mutation are inseparable:

| Event | Emitted on |
|-------|-----------|
| `ONTO_DEFINE` | entity/relationship/taxonomy/constraint record created (draft→proposed) |
| `ONTO_CERTIFY` / `ONTO_RATIFY` | signed certification / quorum ratification (ONTO-SEC-001) |
| `ONTO_ACTIVATE` / `ONTO_SUPERSEDE` | version becomes `active` / superseded (migration-only) |
| `ONTO_REVOKE` | fail-closed revocation marker written |
| `ONTO_CONSTRAINT_EVAL` | SI-1..SI-7 gate outcome (pass / block) at certify and at apply |
| `ONTO_IMPORT` / `ONTO_IMPORT_REJECT` | federated import admitted / rejected (ONTO-FED-001) |
| `ONTO_GRAPH_PROJECT` (optional) | a signed graph checkpoint (namespace head hash) |

Each entry carries `provenance` (local or `{ nodeId, homeDomain }`), the `unitHash`, the acting
authority, and the effect — enabling full attribution.

## 2. Hash chaining (`ONTO-AUD-HC`) — tamper evidence

Reuses the FED-AUD-001 `ChainedEntry` structure verbatim (no new type in the frozen PI-4 `AuditEntry`):
```
ChainedEntry {
  entry: AuditEntry,                 // PI-4 shape (at, identityId/authorityId, target, operation, effect, reason)
  seq,                               // monotonic per node
  prevHash,                          // hash of previous ChainedEntry (genesis = 0)
  entryHash = H(canonical(entry) || seq || prevHash),
  nodeId,                            // recording node (provenance)
  signature?                         // node signs entryHash (S3: key by reference)
}
```
- Append-only + chained: any mutation/removal of a historical ontology audit entry breaks `entryHash`
  continuity → detectable by offline verification (§5).
- Preserves PI-4 immutability (frozen entries, defensive-copy reads) as the in-memory baseline.

## 3. Ontology graph checkpoints (`ONTO-AUD-CP`)

- A **namespace checkpoint** is a signed `(namespace, seq, graphHead, at)` where `graphHead` is a compact
  commitment to the projected active graph (deterministic Merkle/rolling hash over the sorted active
  record set — ONTO-ARCH-001 §4).
- Because the graph is a **pure projection** of the audited active set, the checkpoint is independently
  reproducible; two nodes (or a node and a Board reviewer) can compare `graphHead` to confirm they hold
  the **same meaning** — the primary defense against silent semantic **drift (O7)**.

## 4. Cross-node reconciliation (`ONTO-AUD-REC`) & divergence (`ONTO-AUD-DIV`)

For federated ontology (ONTO-FED-001), nodes exchange signed checkpoints and, on request from an audit
authority, `ChainedEntry` ranges for shared imports (linked by ONTO-SEC-001 `assertionRef`).

| Divergence class | Signal | Response |
|------------------|--------|----------|
| **Hash break** | `entryHash`/`prevHash` mismatch | Integrity alarm; chain quarantined; Board-escalated |
| **Missing counterpart** | Import present on one node only | Flag; investigate; may suspend the import |
| **Effect mismatch** | Same act, different accept/reject | High severity; fail-closed on the affected import |
| **Graph-head mismatch** | Overlapping namespace `graphHead` disagree | Semantic-drift alarm (O7); reconcile or fail-closed |
| **Constraint-eval mismatch** | Same change, different SI outcome across nodes | High severity; deny-by-default until adjudicated |

Divergence is **fail-closed**: an unresolved high-severity divergence suspends acceptance of the
counterpart's ontology pending Board adjudication. Reconciliation is **read-only** — it never rewrites
either node's append-only chain.

## 5. Export & independent verification (`ONTO-AUD-EXP` / `ONTO-AUD-VER`)

- **Export.** Deterministic, canonical serialization of a `ChainedEntry` range + namespace checkpoint
  (signed) — suitable for offline Board review.
- **Verification (offline, no live node).** Recompute `entryHash` for each entry from
  `canonical(entry) || seq || prevHash`; confirm chain continuity to the signed checkpoint; recompute the
  `graphHead` from the exported active set; verify node/authority signatures to registered `keyRef`s.
  Mirrors the PI-5 offline, evidence-based verification methodology.

## 6. Placement (no core-dir change)

- Implemented as `OntologyAuditLog implements AuditSink` in the **control layer** (future
  `src/control/ontology/ontology-audit-log.ts`), or a thin wrapper over the PI-5 `FederatedAuditLog`,
  passed via `createControlPlane({ auditSink })` — the PI-4 assembly already accepts an `auditSink`
  override.
- The PI-4 `AuditEntry` type and `ControlPlane` audit call are **unchanged**; chaining/signing/checkpoint/
  export are added around the existing record. **PI-5 federation audit behavior is reused, not modified.**

## 7. Threat mitigation summary

| Threat | Control | Residual |
|--------|---------|:--------:|
| O10 Unauthorized/silent mutation | Evolution-routed emission + hash-chained append-only trail (no bypass) | Low |
| O7 Semantic drift | Signed reproducible graph checkpoints + cross-node graph-head reconciliation | Low–Med |
| O1/O5/O11/O12 (forensics) | Tamper-evident, exportable, independently verifiable trail with provenance | Improves detection & attribution |

## 8. Traceability
- **Refines:** FED-AUD-001, PI-4 `AuditSink`; ONTO-ARCH-001, ONTO-GOV-002, ONTO-SEC-001, ONTO-FED-001.
- **Consumed by:** ONTO-THREAT-001, ONTO-READINESS-001, Authority Board audit review, future PI-8 build.
- **Owner:** UCOS Authority Board (Audit).

**END ONTO-AUD-001 — DESIGN · READY FOR RATIFICATION · NO IMPLEMENTATION AUTHORIZED.**
