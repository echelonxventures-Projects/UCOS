# AUDIT-UNIV-001 — Universal Audit Primitive (C1 Remediation Design)

**Phase:** R5 — Universal Audit Review
**Artifact ID:** `AUDIT-UNIV-001`
**Resolves:** `ARCH-GAP-VAL-001` **C1** (TRUE, P1) — "Audit/Provenance is an unrepresented primitive; re-implemented six times"
**Mode:** DESIGN / SPECIFICATION + PROVEN REDUCTION + ADDITIVE COLLAPSE PLAN — no code committed, no lock release, no ratified-artifact mutation
**Method:** Direct read of all six audit implementations; verified structural-clone claim; `tsc` clean + **269/269** baseline established in R1
**Date:** 2026-07-02

> This artifact **specifies** the single universal Audit/Provenance primitive that all fabrics compose, and
> **proves** the six existing audit systems reduce to it. It does **not** mutate code: the collapse is a
> control-layer refactor that requires a scoped Article IX release (a future `AD-00xx`) and is sequenced
> **after** the P0 governance restoration (C3 + M5) per `ARCH-GAP-VAL-001 §6`. INV-1..13 and Article IX are
> unchanged.

---

## 1. Objective

Replace the six duplicated audit systems with **one universal Audit/Provenance primitive** that every fabric
composes — making audit the tenth first-class primitive alongside Registry · Metadata · Configuration ·
Knowledge · Ontology · Memory · Authority · Federation · Evolution, and eliminating the "bolted-on per fabric"
defect (C1).

## 2. The duplication being replaced (evidence)

| # | Mechanism | File | Chain? | Verify? | Reconcile? | Entry type |
|:-:|-----------|------|:------:|:-------:|:----------:|------------|
| 1 | `InMemoryAuditLog` | `control/audit-log.ts` | ✗ | ✗ | ✗ | `AuditEntry` |
| 2 | `FederatedAuditLog` | `control/federation/federated-audit-log.ts` | ✓ | ✓ | ✗ | `AuditEntry` |
| 3 | `EvolutionAuditLog` | `control/evolution/evolution-audit-log.ts` | ✓ | ✓ | ✓ | `EvolutionAuditEntry` |
| 4 | `KnowledgeAuditLog` | `control/knowledge/knowledge-audit-log.ts` | ✓ | ✓ | ✓ | `KnowledgeAuditEntry` |
| 5 | `MemoryAuditLog` | `control/memory/memory-audit.ts` | ✓ | ✓ | ✓ | `MemoryAuditEntry` |
| 6 | `OntologyAuditLog` | `control/ontology/ontology-audit-log.ts` | ✓ | ✓ | ✓ | `OntologyAuditEntry` |

**Verified structural-clone finding.** `KnowledgeAuditLog` and `MemoryAuditLog` are byte-for-byte identical in
`record / entries / chain / headHash / export / verify / reconcile`; they differ **only** in (a) the entry type,
(b) the genesis-constant name (`KNOW_GENESIS_HASH` vs `MEM_GENESIS_HASH`, both `"0".repeat(64)`), and (c) the
divergence-class type alias. All chained variants share the identical hash function:

```
computeHash(entry, seq, prevHash, nodeId) = sha256(`${canonicalize(entry)}|${seq}|${prevHash}|${nodeId}`)
```

The reduction is therefore **mechanical**, not speculative: five of the six are the *same ledger* over a
different payload; the sixth (`InMemoryAuditLog`) is the unchained degenerate case (chaining is a strict,
backward-compatible superset — its `entries()` view is unchanged).

## 3. Universal Audit Primitive — design

### 3.1 One event envelope (Audit **and** Provenance in a single record)

All fabric-specific entries are a projection of one envelope, so a single integrity view and cross-fabric
reconciliation become possible. Provenance (FED-PROV-001) is folded in — audit and provenance stop being two
things.

```ts
// SPECIFICATION — not committed code. Proposed: src/control/audit/types.ts
export type AuditDomain =
  | "control" | "federation" | "evolution" | "knowledge" | "memory" | "ontology" | string; // open (IP-04)

export interface UniversalAuditEvent {
  at: number;
  domain: AuditDomain;        // which fabric emitted it (was: the class identity)
  event: string;              // e.g. "ALLOW" | "KNOW_RATIFIED" | "MEM_FORGOTTEN" | "ONTO_REVOKED"
  subject: string;            // unitHash | capabilityId | recordId — the thing acted upon
  actor?: string;             // principal / authority id
  effect?: string;            // "allow" | "deny" | "authn-denied" | undefined
  detail?: string;
  stateHash?: string;         // for reconciliation of shared subjects
  provenance?: Provenance;    // FED-PROV-001 origin envelope (local | {nodeId,...})
  attributes?: Record<string, unknown>;
}
```

Every existing entry maps onto this envelope (see §4). The legacy `AuditEntry` (identity/capability/operation/
effect/reason) projects as `{domain:"control", event:effect, subject:capabilityId, actor:identityId, effect, detail:reason}`.

### 3.2 One hash-chained ledger (the primitive)

```ts
// SPECIFICATION — not committed code. Proposed: src/control/audit/universal-audit-log.ts
export const GENESIS_HASH = "0".repeat(64);

export interface ChainedEvent { event: UniversalAuditEvent; seq: number; prevHash: string; entryHash: string; nodeId: string; }

export class UniversalAuditLog implements AuditSink {   // implements the SAME stable seam (backward compatible)
  constructor(private readonly nodeId: string) {}
  record(e: UniversalAuditEvent | AuditEntry): ChainedEvent   // accepts legacy AuditEntry via adapter
  entries(): readonly UniversalAuditEvent[]
  chain(): readonly ChainedEvent[]
  get headHash(): string
  export(): { nodeId: string; chain: ChainedEvent[]; headHash: string }
  static verify(exported): { ok: boolean; reason: string }                       // = today's verify, unchanged
  static reconcile(local, remote, key?): ReconciliationResult                    // = today's reconcile, generalized
  // Single integrity view across ALL domains: filter(domain?) → chained subview
}
```

- **`record/verify`** are **exactly** the current chained implementation (hash + prevHash continuity), reused
  verbatim — **no custom cryptography** (reuses `federation/assertions.ts` `canonicalize`/`sha256`, honoring
  ADR-006 / MEM-AUD/KNOW-AUD "no custom crypto").
- **`reconcile`** generalizes the (identical) Knowledge/Memory/Ontology reconcile: keyed by `subject + event`,
  comparing `stateHash`, fail-closed on `hash-break`/`state-hash-mismatch`.
- **`AuditSink` is preserved** as the stable seam, so `ControlPlane` and every current caller are unchanged.
- **Single integrity view.** Because all domains write one chain (or a set of chains sharing one type + verifier),
  integrity is verified, exported, and reconciled **once**, and a hardening fix lands **once**.

### 3.3 Provenance unification

The optional `provenance` field makes the primitive the single home for FED-PROV-001 origin envelopes — so
"Audit/Provenance" (the missing primitive named in C1) is one construct, not a per-fabric bolt-on.

## 4. Reduction proof — the six collapse into one

| Existing mechanism | Reduces to | Differing parameter (all absorbed) | Loss? |
|--------------------|-----------|------------------------------------|:-----:|
| `InMemoryAuditLog` | `UniversalAuditLog` (chain optional; `entries()` identical) | no chain → chained superset; `AuditEntry` → envelope adapter | **None** (strictly stronger) |
| `FederatedAuditLog` | `UniversalAuditLog` | `domain:"federation"`; same hash/verify/export | **None** (adds reconcile) |
| `EvolutionAuditLog` | `UniversalAuditLog` | `domain:"evolution"`; entry→envelope | **None** |
| `KnowledgeAuditLog` | `UniversalAuditLog` | `domain:"knowledge"`; `KNOW_`→genesis constant | **None** |
| `MemoryAuditLog` | `UniversalAuditLog` | `domain:"memory"`; audit-preserving-forget rule kept as policy over the chain | **None** (forgetting still never touches the chain) |
| `OntologyAuditLog` | `UniversalAuditLog` | `domain:"ontology"`; entry→envelope | **None** |

**Invariants preserved:** append-only; tamper-evident hash chain; offline independent `verify`; cross-node
`reconcile` with fail-closed divergence; audit-preserving forgetting (MEM-AUD §5 — forgetting acts on recallable
*values*, never the chain); non-waivable **S6** auditability (AUTH-008); zero prohibited-core-dir change (audit
lives entirely in `src/control/*`); no custom crypto.

## 5. Additive collapse / migration plan (test-green at every step)

Executed additively so the **269/269** baseline stays green throughout and every step is independently
reversible:

- **W0 — Introduce.** Add `src/control/audit/{types,universal-audit-log}.ts` (the primitive) + tests. No caller
  changes. Baseline: 269 + new tests green.
- **W1 — Adopt at the seam.** Make `FederatedAuditLog` a thin subclass/alias of `UniversalAuditLog`
  (`domain:"federation"`); `InMemoryAuditLog` becomes the unchained view of the same primitive. Existing tests
  unchanged.
- **W2 — Migrate fabric logs.** Re-express `Evolution/Knowledge/Memory/Ontology` audit as `UniversalAuditLog`
  with their `domain` tag and an entry→envelope adapter; keep old class names as deprecated re-export shims so
  no fabric import breaks. Tests green.
- **W3 — Reconcile once.** Route all fabrics' `reconcile`/`verify` through the single primitive; expose the
  cross-fabric integrity view.
- **W4 — Retire clones.** Delete the deprecated shims (`knowledge-audit-log.ts`, `memory-audit.ts`,
  `evolution-audit-log.ts`, `ontology-audit-log.ts`, `federated-audit-log.ts` body) once no import remains.
  Final: one primitive, six domains, 269 (± adjusted) green.

## 6. Governance gating (why this is design, not a commit)

- **Scoped release required.** Refactoring six security-critical (S6) audit subsystems is a control-layer
  construction act; under the program's model it requires a scoped Article IX release (`AD-00xx` for
  `src/control/audit/*`), which does not exist. This artifact does not mutate code.
- **Sequenced after P0.** `ARCH-GAP-VAL-001 §6` orders C1 (P1) **after** the P0 governance restoration
  (**C3** off-ledger authority + **M5** ledger↔code divergence). Executing the audit collapse before the
  `AUTH-012` ledger is restored would add more implemented-but-unauthorized surface — the exact defect C3 flags.
- **Non-waivable controls.** The collapse must preserve S6 identically; the migration plan keeps the hash chain,
  offline verify, fail-closed reconciliation, and audit-preserving forgetting byte-equivalent.

## 7. Determination

The universal Audit/Provenance primitive is **specified**, and all six existing audit mechanisms are **proven
to reduce to it with zero capability loss** (five are the same chained ledger over a different payload; the
sixth is its unchanged unchained view). A concrete, additive, test-green collapse plan (W0–W4) is defined and is
**ready to execute under a scoped Article IX release**, sequenced after the P0 governance restoration. C1 is
**remediation-ready** (design complete); it is **not yet remediated in code** (awaiting authorization).

### OUTPUT

> # AUDIT-UNIV-001 — UNIVERSAL AUDIT PRIMITIVE SPECIFIED · SIX → ONE REDUCTION PROVEN · COLLAPSE PLAN READY
>
> *(C1 resolved at the design level: one composable Audit/Provenance primitive replaces the six duplicated
> logs, preserving hash-chain / offline-verify / fail-closed reconciliation / audit-preserving forgetting / S6
> with no custom crypto and zero core-dir change. Code execution is gated on a scoped Article IX release and is
> sequenced after the P0 C3+M5 governance restoration. No code committed; INV-1..13 and Article IX unchanged.)*

## 8. Traceability

- **Resolves:** `ARCH-GAP-VAL-001` C1 (P1); relieves `AF-001` AF-F-3 (integrity does not compose) and AF-M-5.
- **Reduces:** `control/audit-log.ts`, `control/federation/federated-audit-log.ts`,
  `control/evolution/evolution-audit-log.ts`, `control/knowledge/knowledge-audit-log.ts`,
  `control/memory/memory-audit.ts`, `control/ontology/ontology-audit-log.ts`.
- **Reuses:** `control/federation/assertions.ts` (`canonicalize`/`sha256`) — no custom crypto; FED-PROV-001
  provenance envelope; `AuditSink` stable seam.
- **Blocked-by (sequencing):** P0 restoration of C3 (AUTH-012 authority chain, PHASE-21) + M5 (ledger
  reconciliation) per `ARCH-GAP-VAL-001 §6`.
- **Governed by:** `AUTH-008` (S6 non-waivable), `AUTH-012` / **AD-0014**, Constitution Article IX (unaffected).
- **Owner:** UCOS Authority Board (Architecture / Assurance).

*Design & specification only. No source code, governance construct, ratified artifact, or ledger was modified.
INV-1..13 and the Article IX generation lock are unchanged.*

**END AUDIT-UNIV-001 — UNIVERSAL AUDIT PRIMITIVE · 6→1 REDUCTION PROVEN · COLLAPSE PLAN W0–W4 READY · EXECUTION GATED ON SCOPED RELEASE (AFTER P0 C3+M5) · NO IMPLEMENTATION AUTHORIZED · ARTICLE IX ACTIVE.**
