# INT-REM-002 — PI-10 Intelligence Fabric Architectural Remediation · Memory Ownership & Single-Source-of-Truth (F-4)

| Field | Value |
|-------|-------|
| Artifact | **INT-REM-002 — Memory Ownership & Single-Source-of-Truth Remediation** |
| Phase | PHASE 19.2 (PI-10 Intelligence Fabric Architectural Remediation) |
| Version | 1.0.0 |
| Mode | DESIGN REMEDIATION ONLY — revises `INT-*` design bindings; **no source code, runtime, infrastructure, services, model weights, or authorization**; Article IX generation lock **REMAINS ACTIVE** |
| Resolves | **F-4** (Dependency Axis B — Intelligence ↔ Memory; `INT-AUTH-REV-001` §3): the INT design defines a **competing** internal memory store instead of consuming the PI-9 Memory Fabric |
| Inputs (read-only) | `INT-AUTH-REV-001` (F-4), `INT-AUTH-REV-002` (T-F2), `INT-AUTH-REV-003`, `INT-AUTH-REV-004` (P-3), `INT-AUTH-001`; `INT-GOV-001` (§2.12 C12; IGP-8), `INT-ARCH-001` (§3 memory-store); `MEM-GOV-001` (T1..T6; C1..C12; MGP-1..7), `MEM-GOV-002` (lifecycle/retention/reconciliation/evolution), `MEM-ARCH-001`, `MEM-SEC-001`, `MEM-AUD-001` |
| Owner | UCOS Authority Board |

> This artifact discharges the **memory half of prerequisite P-3** (`INT-AUTH-REV-004` §3; `INT-AUTH-001`
> §2/Q2). It **removes the competing intelligence-local memory store** and redefines `INT-GOV-C12` as a
> **read-only view (projection) over the ratified PI-9 Memory Fabric**, restoring a single source of truth for
> memory. It authorizes nothing: it defines the normative design deltas for a revised
> `INT-GOV-001`/`INT-ARCH-001` (v1.1.0) that the PHASE 19.3 re-authorization review (P-4) will validate.
> Operational assurance remains gated on PI-9 implementation (P-2).

---

## 1. Defect restatement (F-4)

`INT-AUTH-REV-001` §3 classified **Dependency Axis B (Intelligence ↔ Memory)** as **BLOCKED**, with two
findings:

- **F-3** — Memory (PI-9) is design-only: no **AD-0022**, no `src/control/memory/*`. *Sequencing gate;
  resolved by prerequisite **P-2** (implementation), not by this remediation.*
- **F-4** — **the Intelligence design defines its own memory model rather than consuming the ratified PI-9
  Memory Fabric.** `INT-GOV-001 §2.12` (`INT-GOV-C12` "Memory Scope") declares an internal governed partition
  with its *own* retention/classification, and `INT-ARCH-001 §3`/§5 declares a `memory-store.ts` module. This
  is a **competing source of truth** that duplicates governed retention/reconciliation/forgetting already
  owned by `MEM-GOV-002`, violating single-SoR discipline.

**This artifact resolves F-4 at the design-binding level.** F-3 is unaffected (it is closed by P-2).

## 2. Root cause

The v1.0.0 `INT-GOV-C12` conflates two distinct responsibilities:

| Responsibility | Rightful owner | v1.0.0 defect |
|----------------|----------------|---------------|
| **Owning** memory records, tiers, retention, forgetting, reconciliation | **PI-9 Memory Fabric** (`MEM-GOV-001/002`) | INT-GOV-C12 **re-declared** these (competing store) |
| **Consuming** (recalling) memory as reasoning input | Intelligence Fabric (PI-10) | legitimate — but was expressed as a *store*, not a *view* |

Remediation cleaves these: PI-9 **owns**; PI-10 **reads**.

## 3. Single-Source-of-Truth (SoR) Model

- **IGP-10 Single Memory Source of Truth (no intelligence-local store).** The **PI-9 Memory Fabric is the sole
  owner and system of record for all memory** across every tier (Working `T1`, Short-Term `T2`, Long-Term
  `T3`, Semantic `T4`, Episodic `T5`, Federated `T6`; `MEM-GOV-001 §2`). The Intelligence Fabric **holds no
  memory store, no independent retention, and no independent forgetting.** It **recalls** memory read-only and
  **proposes** durable memory as Evolution Units targeting the `memory:` namespace — it never writes memory of
  record directly. This mirrors the already-correct Knowledge binding (`IGP-8`, Axis C SATISFIED) and the
  Evolution-only commit discipline (Axis D SATISFIED).

**Authoritative ownership map (post-remediation):**

| Memory concern | System of record | Intelligence Fabric role |
|----------------|------------------|--------------------------|
| Tier definitions / registry | `MEM-GOV-C1` Memory Tier Registry | none (reads tier metadata) |
| Record index / versions | `MEM-GOV-C2` Memory Record Index | read (recall) |
| Consolidation WM→STM→LTM/SEM | `MEM-GOV-C4` Consolidation Authority | **propose** via Evolution only |
| Certification / Ratification | `MEM-GOV-C5` / `C6` (SoD) | none (no memory-side authority) |
| Retention / legal-hold / forgetting | `MEM-GOV-C7` + `MEM-GOV-002 §2` | none (honors, never sets) |
| Revocation | `MEM-GOV-C8` | honors fail-closed |
| Reconciliation / divergence | `MEM-GOV-C11/C12` + `MEM-GOV-002 §3` | none (consumes reconciled `active`) |
| Federated memory | `MEM-GOV-T6` / `C9/C10` + `MEM-FED-001` | advisory/deny-only (via `INT-FED-001`) |

## 4. Mandatory Memory Consumption Model

### 4.1 Redefined construct — Memory Scope (`INT-GOV-C12`, revised)

`INT-GOV-C12` is **redefined from a store to a view** (metadata-first; reserved key
`intelligence:memory-view:<id>`; **no core-dir change**):

- **Purpose (revised).** A **read-only, scoped view over the PI-9 Memory Fabric** declaring which memory
  tiers/subjects an intelligence scope may **recall** — **not** a store, and **not** an owner of retention.
- **Record (revised).** `{ memoryViewId, scope, tierRefs: (T1|T2|T3|T4|T5|T6)[], subjectSelector, classificationCeiling, recallMode: "read-only", memorySnapshotRef, onExpiredOrRevoked: "deny", status }`.
- **Decision rights.** Registration/scope: Authority Board (Approval-Required). `tierRefs`/`subjectSelector`
  are enumerated allow-lists.
- **Invariants (revised).**
  1. **No store, no retention, no forgetting** in Intelligence — those are `MEM-GOV-002` (removed from C12).
  2. Recall is **deny-by-default** and in-boundary only (inherits `MGP-2`); empty authorization ⇒ recall
     nothing.
  3. Classification is honored end-to-end and **monotonic** (`MGP-3`, S4) — a view can narrow but never
     declassify; `classificationCeiling` clamps recall.
  4. Any **durable** memory the fabric wishes to create/update (e.g., an episodic trace of a decision, a
     consolidation proposal) is a **proposed Evolution Unit** targeting `memory:` (`MGP-4`) — **never** a
     direct write.
  5. Expired/revoked memory is **excluded fail-closed** (`MGP-5`, `MGP-8`-style) — treated as absent (deny).

### 4.2 Consumed PI-9 contract surface (read-only recall)

| Consumed construct | PI-9 source | Intelligence use |
|--------------------|-------------|------------------|
| Recall (deny-by-default) | `MGP-2`; `MEM-ARCH-001` sync-recall | read reasoning context/history |
| 6 governed tiers `T1..T6` | `MEM-GOV-001 §2` | select recall scope (WM/STM/LTM/SEM/EPI/FED-MEM) |
| Memory Record Index (`MEM-GOV-C2`) | `MEM-GOV-001 §3` | resolve records by tier/subject/version |
| Provenance envelope (`MGP-7`) | `MEM-GOV-001`; `MEM-AUD-001` | attribute each recalled item (source/tier/node/authority) |
| Retention/expiry state (`MEM-GOV-C7`, `MEM-GOV-002 §2`) | governed retention | fail-closed exclusion of expired records |
| Reconciled `active` memory (`MEM-GOV-002 §3`) | reconciliation | consume only reconciled, locally-sovereign memory |

### 4.3 Memory Snapshot pinning (reproducibility — closes T-F2)

A Reasoning Session pins a **Memory Snapshot** (`memorySnapshotRef`) alongside the Knowledge and Ontology
snapshots, capturing the recalled `active` memory set by version. This makes **memory-derived evidence
reproducible-by-record**, directly closing `INT-AUTH-REV-002` **T-F2** (I3 non-determinism / unreproducible
memory context) at the design-binding level. Reproducibility of the *deterministic decision core* was already
assured; memory-context reproducibility is now **bound** to PI-9 snapshotting (constructible once P-2 lands).

## 5. Recall provenance integration (into the evidence model)

Memory recalled under a Memory Scope view enters the Reasoning Evidence Model (`INT-REM-001 §4`) as grounded
evidence with `sourceKind: "memory"`:

- Each recalled item carries its PI-9 **provenance envelope** (`MGP-7`) — who captured it, from which
  tier/node, verified by which authority — and its `groundedType` (an `active` ontology entity, `INT-REM-001`).
- Federated memory (`T6`) is **advisory / deny-only** at the boundary (`MGP-6`; `MEM-FED-001`), consistent with
  `INT-FED-001` — it may inform reasoning but never overrides local `active` memory or grants local commit.
- Semantic memory (`T4`) that is knowledge-linked is consumed read-only; any assertion into knowledge remains a
  **co-ratified** Knowledge Fabric evolution unit (`MEM-GOV-001 §2.4`), never an intelligence-side back door.

## 6. Capability status delta (design-binding lens)

| Capability | `INT-AUTH-REV-003` verdict | After INT-REM-002 (design binding) | Residual gate |
|------------|:--------------------------:|:----------------------------------:|---------------|
| Reasoning | BLOCKED (Ontology + Memory) | **Memory consumption BOUND** (recall view, snapshot) | Ontology (`INT-REM-001`) + **P-2** impl |
| Planning | PARTIAL (Ontology + Memory) | **Memory-stateful planning BOUND** (read-only recall) | Ontology + **P-2** impl |
| Decision | PARTIAL (rationale BLOCKED) | **Memory provenance in rationale BOUND** (see `INT-REM-003`) | Ontology + **P-2** impl |
| Federated Intelligence | PARTIAL | **Federated memory advisory/deny-only BOUND** (`MGP-6`) | reasoning core → **P-1/P-2** |

**F-4 is resolved as a design-binding defect.** The competing store is removed; memory is single-SoR under
PI-9. Remaining memory dependence is a pure **sequencing gate** (P-2: Memory auth review → AD-0022 →
`src/control/memory/*` → validated).

## 7. Normative design deltas (applied to `INT-*` v1.1.0)

1. `INT-GOV-001 §2.12` — **replace** `INT-GOV-C12` "Memory Scope" (store) with the revised **read-only view**
   record and invariants (§4.1); remove all intelligence-local retention/forgetting language.
2. `INT-GOV-001 §1` — add **IGP-10** (single memory SoR); tighten **IGP-8** to state memory is **recall-only**
   via the PI-9 seam (no local store).
3. `INT-GOV-001 §2.9` (Reasoning Session) — add `memorySnapshotRef` (alongside `ontologySnapshotRef` from
   `INT-REM-001`).
4. `INT-ARCH-001 §3` (Supporting Subsystems) — "Memory Utilization" row rewritten: **read-only recall via PI-9
   Memory Fabric**; authoritative memory writes are **proposed** Evolution Units (`MGP-4`); remove the internal
   store.
5. `INT-ARCH-001 §5` (Module Map) — **rename `memory-store.ts` → `memory-access.ts`** (read-only recall client,
   S4-aware, snapshot-pinned; no store).
6. `INT-ARCH-001 §6` (Reuse Map) — add "Memory recall/provenance → PI-9 Memory Fabric (read/recall), reused,
   not re-implemented; durable memory via PI-6 Evolution."

## 8. Constraints preserved (non-waivable)

Deny-by-default recall (`MGP-2`); classification monotonicity (`MGP-3`, S4); Evolution-only durable mutation
(`MGP-4`, IGP-3); fail-closed expiry (`MGP-5`); local sovereignty over federated memory (`MGP-6`); provenance
& recallability (`MGP-7`); no custom crypto; **AD-0014** Ω∞ boundary; INV-1..13; **Article IX ACTIVE**;
`UCOS-CONSTRUCTION-BLOCKED` unchanged. Remediation **removes** a write surface (the competing store) and adds
only a **read** dependency — strictly SoR-reducing, **no** core-dir change.

## 9. Traceability
- **Refines:** `INT-AUTH-REV-001` (F-4), `INT-AUTH-REV-002` (T-F2), `INT-AUTH-REV-003/004`, `INT-AUTH-001`,
  `INT-GOV-001` (§2.12), `INT-ARCH-001` (§3/§5/§6), `MEM-GOV-001` (T1..T6; C1..C12; MGP-1..7), `MEM-GOV-002`,
  `MEM-ARCH-001`, `MEM-SEC-001`, `MEM-AUD-001`, `MEM-FED-001`, `AD-0016..0020`, `AD-0014`, AUTH-008/009/012,
  Constitution Art. IX/XII.
- **Consumed by:** `INT-REM-003` (closure), a revised `INT-GOV-001`/`INT-ARCH-001` (v1.1.0), the PHASE 19.3
  PI-10 re-authorization review (P-4), a prospective **AD-0023**.
- **Owner:** UCOS Authority Board.

**END INT-REM-002 — F-4 RESOLVED (DESIGN-BINDING) · COMPETING STORE REMOVED · MEMORY SINGLE-SOR UNDER PI-9 · OPERATIONAL CLOSURE GATED ON P-2 · ARTICLE IX ACTIVE.**
