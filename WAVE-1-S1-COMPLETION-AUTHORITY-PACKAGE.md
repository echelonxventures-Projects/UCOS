# UCOS Ω — WAVE 1 · S1 COMPLETION AUTHORITY PACKAGE

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-W1-S1-COMP-001` |
| Type | **S1 Completion Authority Package** — decomposes S1 (OPF operationalization) into every dependency, work item, evidence, verification, approval, and closure condition; provides the exact NOT STARTED → COMPLETE path. Executes nothing. |
| Stage | **S1 — Operationalize the Operational Proof Fabric** (`UCOS-W1-OEF-EXEC-001` §2; `UCOS-W1-OEF-IAP-001` §10 S1) |
| Blocker closed on S1 completion | `UCOS-W1-ACT6-READY-001` **RB-3** (Act 6 hard-depends on S1) |
| Mode | **AUTHORITY / DECOMPOSITION AUTHORING ONLY** — WBS + AC matrix + closure conditions. **No code executed. No evidence generated. No evidence verified. No approval assigned. S1 not marked complete. Append-only.** |
| Date | 2026-07-04 |
| Governing rule | *Repository reality + reproduced evidence override stale documentation* (`GOV-REC-001`). **Fail-closed:** an unbuilt item is **NOT DONE**; an unrun test is **NOT PASSED**; baseline regression ⇒ **FAIL**. |
| Fail-closed defaults | Work item = **NOT STARTED**. Evidence = **NOT PRODUCED**. Verification = **NOT VERIFIED**. UPP gate = **NOT CONFIRMED**. |
| S1 execution class | **`[AGT-OK]` — additive code within AD-0016/0017/0019 scope; no live resource; no per-step HAR; no evidence gate** (`UCOS-W1-OEF-EXEC-001` §2 ordering rule 1) |
| Authority (unchanged) | `AUTH-012` AD-0015 in force; AD-0016/0017/0019 (scoped construction) authorize the additive S1 code; Article IX generation lock **ACTIVE**; `UCOS-CONSTRUCTION-BLOCKED` stands except the AD-0015 + scoped-construction carve-outs. |
| **Determination** | **§11 — S1 COMPLETION DECISION** |

---

## SOURCE OF AUTHORITY

| # | Source | Repository artifact | Use |
|:-:|--------|---------------------|-----|
| 1 | Act 6 Commencement Readiness Package | `UCOS-W1-ACT6-READY-001` | RB-3 (S1 blocker) definition; S1 completion package (§3) |
| 2 | Act 6 Environment Evidence Execution Package | `UCOS-W1-ACT6-ENV-EXEC-001` | DEP-3 (S1 dependency); AC6-D1 |
| 3 | Wave 1 Operational Evidence Execution Package | `UCOS-W1-OEF-EXEC-001` | S1 sequence + `[AGT-OK]` tag (§2); UPP-1..5 (§6.5) |
| 4 | Wave 1 Implementation Authority Package | `UCOS-W1-OEF-IAP-001` | AC-D1/D2/D3/D5 (§8.2); S1 sequence (§10); CAP-OEF-1..6 |
| 5 | Wave 1 Operational Evidence Production Tracker | `UCOS-W1-OEF-TRACK-001` | §2 S1 row to update |
| — | **Repository-confirmed code (read this session)** | `packages/platform-runtime/src/control/operations/*`; `.../persistence-runtime/durable-metadata-store.ts`; `.../meta-core/ports.ts`; `B02-OPF-…-IMPLEMENTATION-PACKAGE.md` | Actual build state (see §1.3) |

> **Discipline.** This package decomposes and authorizes S1; it does not build it. Every work item is **NOT
> STARTED**, every AC **☐**, until an independent build+verification act completes it and the tracker records it.

---

## OBJECTIVE

Produce the complete authority package to satisfy **S1** — decomposing it into every dependency, verification
activity, evidence requirement, approval requirement, and closure condition — and provide the exact path to move
S1 from **NOT STARTED** to **COMPLETE**, without executing any activity.

---

## 1. S1 SCOPE DEFINITION

### 1.1 Purpose

Operationalize the already-ratified **B02 Operational Proof Fabric** (Group A capabilities CAP-OEF-1..6) into a
**deployable service** with durable persistence, audit persistence/replay, event publication, continuous
attestation, and observability instrumentation — **additively**, with **zero core-directory change** and a
**green baseline suite**. S1 unblocks Act 6 (G12-1); it produces **no operational evidence** and closes **no gate**.

### 1.2 In scope / out of scope

| In scope (S1) | Out of scope (later acts / other stages) |
|---------------|------------------------------------------|
| AC-D1 durable `MetadataPort` adapter → `dom_ops` (+ integration test) | Provisioning ENV-DEV/INT (Act 6, `[HAR]`) |
| AC-D2 audit-chain persist/replay → `dom_ops.audit_entry` (insert-only role) | Pipeline execution / contract tests (Act 7) |
| AC-D3 `OPS_*` CloudEvents publisher (at-least-once, idempotency keys) | DR drill / NFR measurement (Act 8) |
| AC-D5 continuous attestation scheduler (periodic snapshot → sealed proof) | Any live measurement / certification |
| S1-INSTR instrument `PRS-047..051` via OTel/OTLP (`ADR-PE12`) | Rate limiting / quota (OPF-D4 — service hardening, not S1-critical) |
| Composition: single `operations` re-export in `src/control/index.ts`; `operations:` allowlist | New capability / primitive / core-dir change (forbidden) |
| UPP-1 (0 core-dir) + UPP-2 (baseline green) confirmation | Governance/authority/invariant change (forbidden) |

### 1.3 Repository-confirmed baseline (what already exists — do not rebuild)

| Item | State (repository-confirmed) | Source |
|------|------------------------------|--------|
| OPF fabric core (CAP-OEF-1..6; OPF-1..OPF-8) | **BUILT + RATIFIED** — 15/15 ACs, full suite 284/284, typecheck clean | `B02-OPF` §7/§8; `src/control/operations/*` |
| `dom_ops` SoR migration `V001__operational_proof_sor.sql` (tenant/definition/proof_record/incident_record/audit_entry/revocation) | **SCAFFOLDED** (OPF-9) | `B02-OPF` §5/§8 |
| `MetadataPort` seam (`meta-core/ports.ts`) | **PRESENT** (public seam; unchanged) | `meta-core/ports.ts` |
| `DurableMetadataStore implements MetadataPort` | **PRESENT but log-backed** (wraps `InMemoryMetadataStore` + `AppendOnlyLog` rehydration) — **NOT `dom_ops`-backed** | `persistence-runtime/durable-metadata-store.ts` |
| Runtime default store | **`InMemoryMetadataStore`** (bootstrap L3) | `bootstrap.ts` |
| AC-D1..D3 durable operationalization (OPF-D1/D2/D3) | **NOT DONE** — unchecked backlog ("Next: service hardening") | `B02-OPF` §8 |

> **Key finding.** S1 is a **service-hardening build over a ratified fabric**, not a fabric build. The Act-6-critical
> gap is **AC-D1**: no `dom_ops`-backed durable `MetadataPort` adapter exists yet (the current `DurableMetadataStore`
> is append-only-log rehydration, not the SoR adapter). This is confirmed unchecked in the B02-OPF backlog (OPF-D1).

---

## 2. S1 DEPENDENCY GRAPH

### 2.1 Entry dependencies (S1 preconditions — repository-confirmed)

| Dep | Requirement | State |
|-----|-------------|:-----:|
| SD-1 | B02 OPF fabric ratified, suite green | **MET** (284/284) |
| SD-2 | `MetadataPort` public seam present (no core-dir change needed) | **MET** |
| SD-3 | `dom_ops` migration `V001` present (SoR schema) | **MET** (scaffold) |
| SD-4 | `ADR-PE12` (OpenTelemetry/OTLP) ACCEPTED | **MET** |
| SD-5 | Scoped-construction authority (AD-0016/0017/0019) covers additive `operations:` work | **MET** |
| SD-6 | AD-0015 in force (program-level) | **MET** |

> **Entry-dependency result: 6/6 MET.** S1 has **no open external entry blocker** — it is executable now (§11).

### 2.2 Internal work-item ordering (fail-closed)

```
SD-1..SD-6 (all MET)
   │
   ├─ S1-W1  AC-D1  durable MetadataPort → dom_ops adapter  ──┐  (Act-6-critical; §8)
   │                                                          │
   ├─ S1-W2  AC-D2  audit persist/replay → audit_entry  ◄─────┤ (needs durable adapter + dom_ops)
   │                                                          │
   ├─ S1-W3  AC-D3  OPS_* CloudEvents publisher  (parallel)   │
   │                                                          │
   ├─ S1-W4  AC-D5  attestation scheduler  ◄──────────────────┘ (needs proof-persist path)
   │
   ├─ S1-W5  S1-INSTR  PRS-047..051 OTel/OTLP instrumentation  (parallel)
   │
   ├─ S1-W6  composition: operations re-export + operations: allowlist  (parallel; verifies UPP-1)
   │
   └─ S1-W7  regression + UPP gate  ◄── (all of S1-W1..W6)  → baseline green (UPP-2), 0 core-dir (UPP-1)
```

**Ordering rules.** S1-W2 and S1-W4 depend on S1-W1 (durable path). S1-W3, S1-W5, S1-W6 are parallelizable.
S1-W7 (regression + UPP) is terminal and gates S1 closure. Any UPP violation ⇒ **S1 FAIL** regardless of item
completion.

---

## 3. S1 WORK BREAKDOWN STRUCTURE

| WBS | AC | Description | Producer | Output | `[AGT-OK]`? |
|:---:|:--:|-------------|----------|--------|:-----------:|
| **S1-W1** | AC-D1 | Implement a `dom_ops`-backed durable `MetadataPort` adapter; wire the deployable service to it (port seam unchanged) | Implementation Program | adapter module + integration test | ✅ |
| **S1-W2** | AC-D2 | Persist + replay the audit hash-chain to `dom_ops.audit_entry` via an **insert-only** DB role | Implementation Program | persist/replay module + replay-verify test | ✅ |
| **S1-W3** | AC-D3 | `OPS_*` event-bus publisher (CloudEvents, at-least-once, idempotency keys) | Implementation Program | publisher module + publish/consume test | ✅ |
| **S1-W4** | AC-D5 | Continuous attestation scheduler (periodic telemetry/health/SLO snapshot → sealed proof record) | Implementation Program | scheduler module + scheduled-proof test | ✅ |
| **S1-W5** | S1-INSTR | Instrument `PRS-047..051` (ingest, evaluation, alert/incident, evidence, audit) via OTel/OTLP | Implementation Program | instrumentation + telemetry-emission test | ✅ |
| **S1-W6** | UPP-1 | Compose via the single `operations` re-export in `src/control/index.ts`; confine writes to the `operations:` allowlist; **0 core-dir change** | Implementation Program | composition diff + namespace audit | ✅ |
| **S1-W7** | UPP-2 | Run full baseline suite + typecheck; confirm **0 regression** (≥ 284/284 + new tests) | Implementation Program | full-suite report + typecheck log | ✅ |

> **Approval note.** Every S1 WBS item is `[AGT-OK]` additive code — **no per-step AD-0009 HAR** (contrast Act 6).
> Governance is by scoped-construction authority (AD-0016/0017/0019) + standard change-control merge review + the
> UPP gates. See §6.

---

## 4. S1 EVIDENCE REQUIREMENTS

Evidence here is **build evidence** (tests, diffs, logs) — not operational/gate evidence. All **NOT PRODUCED**.

| Evidence | For | Required contents | State |
|----------|:---:|-------------------|:-----:|
| ES-1 | AC-D1 | durable adapter source; integration test proving put/get/query-by-prefix survive process restart against `dom_ops`; tenant-scoped; creds by reference (S3); TLS 1.3 + at-rest enc (S4); append-only (INV-10) | **NOT PRODUCED** |
| ES-2 | AC-D2 | audit persist/replay source; replay-verify test (hash-chain reconstructed from `audit_entry`, linkage verified); insert-only role proof | **NOT PRODUCED** |
| ES-3 | AC-D3 | publisher source; publish+consume test; idempotency-key dedup test; at-least-once semantics test | **NOT PRODUCED** |
| ES-4 | AC-D5 | scheduler source; test showing periodic snapshot → sealed proof record (attester ≠ sealer SoD preserved) | **NOT PRODUCED** |
| ES-5 | S1-INSTR | OTel/OTLP wiring; test asserting spans/metrics emitted for PRS-047..051; non-actuating (INV-CORE-12) | **NOT PRODUCED** |
| ES-6 | UPP-1 | `git diff --stat` proving 0 change under core dirs; single re-export addition; `operations:` allowlist audit | **NOT PRODUCED** |
| ES-7 | UPP-2 | full-suite run (`npm test`) ≥ 284/284 + new tests all green; `tsc` typecheck clean | **NOT PRODUCED** |

---

## 5. S1 VERIFICATION REQUIREMENTS

| Verification | Method | Acceptance | Reproducible-by |
|--------------|--------|------------|-----------------|
| VS-1 (AC-D1) | Run integration test against a `dom_ops` instance (ephemeral/test Postgres acceptable — no live env) | durable read-after-restart passes; tenant isolation holds; no plaintext creds | any reviewer via `npm test` |
| VS-2 (AC-D2) | Run replay-verify test; inspect DB role grants | chain reconstructs + verifies; role is insert-only (no update/delete) | reviewer via test + `\dp` |
| VS-3 (AC-D3) | Run publish/consume + idempotency tests | at-least-once + dedup by idempotency key confirmed | reviewer via `npm test` |
| VS-4 (AC-D5) | Run scheduler test | periodic sealed proof produced; SoD (attester ≠ sealer) preserved | reviewer via `npm test` |
| VS-5 (S1-INSTR) | Run instrumentation test; inspect OTLP export | spans/metrics emitted; metric plane non-actuating (INV-CORE-12) | reviewer via test |
| VS-6 (UPP-1) | Inspect `git diff --stat`; namespace-write audit | 0 core-dir lines changed; writes confined to `operations:` | reviewer via diff |
| VS-7 (UPP-2) | Run full suite + typecheck | ≥ 284/284 + new green; typecheck clean | reviewer via `npm test` + `tsc` |

> **Fail-closed verification rule.** A test that is not run is **NOT PASSED**; a diff not inspected is **NOT
> CONFIRMED**. No S1 item is DONE on assertion — only on a reproduced green result.

---

## 6. S1 APPROVAL REQUIREMENTS

**S1 requires no per-step human approval (no AD-0009 HAR).** It is `[AGT-OK]` additive code within already-scoped
releases (`UCOS-W1-OEF-EXEC-001` §2 ordering rule 1). Governance is by the following (fail-closed):

| Approval / governance gate | Authority | Requirement | State |
|----------------------------|-----------|-------------|:-----:|
| AP-1 Scoped-construction authority | AD-0016/0017/0019 (`AUTH-012`) | S1 code lies within the authorized additive `operations:` scope | **IN FORCE** |
| AP-2 Change-control / merge review | Implementation Program lead | additive-only; port seam unchanged; conventional review before merge | **NOT PERFORMED** |
| AP-3 UPP-1 gate (0 core-dir) | UPP audit (self-enforcing) | diff proves no core-dir change | **NOT CONFIRMED** |
| AP-4 UPP-2 gate (baseline green) | CI / suite run | ≥ 284/284 + new green; typecheck clean | **NOT CONFIRMED** |

> **Contrast with Act 6.** Act 6 is `[HAR]` (HAR-1..6 AD-0009 approvals, live resources). **S1 is `[AGT-OK]`** —
> no environment, no spend, no HAR. This is why S1 can proceed under the standing authorities without the Act-6
> approval chain, and why it is the **first** thing that can move (§11).

---

## 7. S1 ACCEPTANCE CRITERIA MATRIX

Grounded in `UCOS-W1-OEF-IAP-001` §8.2 (AC-D1/D2/D3/D5), §8.4 (UPP), and §10 (S1-INSTR). All states **☐**.

| AC | Criterion | Evidence | Verification | State |
|:--:|-----------|:--------:|:------------:|:-----:|
| AC-D1 | Deployable service wired to `dom_ops` via durable `MetadataPort` adapter | ES-1 | VS-1 | ☐ |
| AC-D2 | Audit chain persisted/replayed to `dom_ops.audit_entry` (insert-only role) | ES-2 | VS-2 | ☐ |
| AC-D3 | `OPS_*` CloudEvents publisher (at-least-once, idempotency keys) | ES-3 | VS-3 | ☐ |
| AC-D5 | Continuous attestation scheduler (snapshot → sealed proof) | ES-4 | VS-4 | ☐ |
| S1-INSTR | PRS-047..051 instrumented via OTel/OTLP; non-actuating (INV-CORE-12) | ES-5 | VS-5 | ☐ |
| UPP-1 | Additive-only; **0 core-dir change**; single `operations` re-export; `operations:` allowlist | ES-6 | VS-6 | ☐ |
| UPP-2 | Baseline suite green (≥ 284/284 + new); typecheck clean; **0 regression** | ES-7 | VS-7 | ☐ |
| UPP-3 | S1/S3/S4 preserved (creds by reference; TLS 1.3; at-rest enc) | ES-1/ES-2 | VS-1/VS-2 | ☐ |
| UPP-4 | No custom crypto (reuse federation Ed25519) | ES-4 | VS-4 | ☐ |
| UPP-5 | Fail-closed behavior preserved | ES-1..ES-4 | VS-1..VS-4 | ☐ |

> **S1 PASS rule.** AC-D1 ∧ AC-D2 ∧ AC-D3 ∧ AC-D5 ∧ S1-INSTR ∧ UPP-1..5 **all MET** on reproduced green
> evidence. Any single ☐ or any UPP violation ⇒ **S1 NOT COMPLETE**.

---

## 8. AC-D1 DETAILED CLOSURE PACKAGE (Act-6-critical)

AC-D1 is the item Act 6 (G12-1) directly consumes: a durable, `dom_ops`-backed `MetadataPort` so provisioned
environments persist operations records durably rather than in-memory.

### 8.1 Objective

Provide a `dom_ops`-backed implementation of the existing public `MetadataPort` seam
(`packages/platform-runtime/src/meta-core/ports.ts`) — **without changing the seam or any core dir** — and wire
the deployable service to use it (replacing the in-memory default at deploy time).

### 8.2 Design constraints (non-waivable)

| Constraint | Rule | Basis |
|------------|------|-------|
| Seam-preserving | Implement `MetadataPort`; do not alter the interface or callers | UPP-1; INV (contract-first) |
| Single SoR | Back onto `dom_ops` only (no second store) | INV-5 |
| Append-only | Writes are insert/version; no destructive update (supersession, `@version` monotonic) | INV-10 |
| Secrets by reference | DB DSN + keys via `external://…`; never inline | INV-11 / S3 |
| Encrypted | TLS 1.3 in transit; at-rest encryption | S4 / INV-4 |
| Tenant-scoped | Every row tenant-partitioned | OperationsRegistry schema |
| Namespace-confined | Keys under the reserved `operations:*` root only | `operations:` allowlist |
| Fail-closed | Connection loss / unschema'd record ⇒ reject, never silent-accept | UPP-5 / INV-CORE-14 |

### 8.3 Work steps (build — not executed here)

1. Add `DomOpsMetadataStore implements MetadataPort` (new adapter module under `control/operations/` or `persistence-runtime/`, additive).
2. Map `put/get/query/validate` onto `dom_ops` tables (`definition`, `proof_record`, `incident_record`, `audit_entry`, `revocation`) with canonical-JSON + `sha256` binding (reuse existing `canonicalStringify`).
3. Wire deploy-time selection so the deployable service composes `DomOpsMetadataStore` (in-memory remains the L3 test default).
4. Add integration test: register tenant/metric → observe → attest+seal proof → **restart** → resolve latest (durability); tenant-isolation; revocation fail-closed.
5. Confirm creds by reference, TLS 1.3, at-rest enc, insert/version-only.

### 8.4 AC-D1 closure criteria (all required)

| # | Criterion | Evidence |
|:-:|-----------|:--------:|
| D1-1 | `DomOpsMetadataStore implements MetadataPort`; seam unchanged | ES-1 (source + diff) |
| D1-2 | Durable read-after-restart proven against `dom_ops` | ES-1 (integration test) |
| D1-3 | Tenant isolation + revocation fail-closed preserved | ES-1 |
| D1-4 | Creds by reference (S3); TLS 1.3 + at-rest enc (S4) | ES-1 |
| D1-5 | Append-only / version-monotonic (INV-10) | ES-1 |
| D1-6 | 0 core-dir change (UPP-1); baseline green (UPP-2) | ES-6 / ES-7 |
| D1-7 | Result reproduced by an independent reviewer | VS-1 |

**AC-D1 COMPLETE iff** D1-1..D1-7 all MET on reproduced green evidence. **Current: AC-D1 = NOT STARTED** (no
`dom_ops`-backed adapter exists — confirmed OPF-D1 unchecked).

---

## 9. S1 COMPLETION READINESS MATRIX

| Item | Status | Missing Evidence | Action Required | Closure Criteria |
|------|:------:|------------------|-----------------|------------------|
| Entry deps SD-1..6 | **MET (6/6)** | — | none | all repository-confirmed present |
| S1-W1 / AC-D1 | **NOT STARTED** | ES-1 | build `DomOpsMetadataStore` + integration test (§8) | D1-1..D1-7 MET |
| S1-W2 / AC-D2 | **NOT STARTED** | ES-2 | build audit persist/replay (insert-only role) | replay verifies; role insert-only |
| S1-W3 / AC-D3 | **NOT STARTED** | ES-3 | build `OPS_*` publisher | at-least-once + idempotency confirmed |
| S1-W4 / AC-D5 | **NOT STARTED** | ES-4 | build attestation scheduler | scheduled sealed proof; SoD preserved |
| S1-W5 / S1-INSTR | **NOT STARTED** | ES-5 | instrument PRS-047..051 (OTel/OTLP) | spans/metrics emitted; non-actuating |
| S1-W6 / UPP-1 | **NOT STARTED** | ES-6 | compose re-export; namespace audit | 0 core-dir change |
| S1-W7 / UPP-2 | **NOT STARTED** | ES-7 | run full suite + typecheck | ≥ 284/284 + new green; typecheck clean |

**Aggregate: entry deps 6/6 MET; work items 0/7 done; ACs 0/10 MET.**

---

## 10. S1 TRACKER UPDATE INSTRUCTIONS

Apply **only** when S1 genuinely completes (all §7 ACs MET on reproduced green evidence). Append-only; make no
update on the basis of this package.

| Trigger | Target artifact / section | Change |
|---------|---------------------------|--------|
| Each AC-D1/D2/D3/D5/S1-INSTR verified | (internal S1 build log) | mark item DONE with evidence hash/ref |
| UPP-1 + UPP-2 confirmed | (internal S1 build log) | record 0 core-dir + suite-green report |
| **All §7 ACs MET** | `UCOS-W1-OEF-TRACK-001` §2 Evidence Act Register — **S1** | Current State NOT STARTED → **COMPLETE** (note: AC-D1..D5 landed; baseline green) |
| **All §7 ACs MET** | `UCOS-W1-ACT6-READY-001` §1 / §8 — **RB-3** | Status OPEN/NOT MET → **CLOSED/MET** (S1 dependency satisfied) |
| **All §7 ACs MET** | `UCOS-W1-ACT6-ENV-EXEC-001` §7 — **AC6-D1** | note S1 precondition satisfied (still ☐ until Act 6 executes) |
| S1 COMPLETE + other RB closed | `UCOS-W1-OEF-TRACK-001` §8 Dashboard | recompute readiness; S1 no longer a commencement blocker |

> **Fail-closed update rule.** Do not mark S1 COMPLETE or RB-3 CLOSED unless every AC is MET on reproduced green
> evidence with 0 regression. Any regression or ☐ ⇒ S1 remains **NOT COMPLETE**; RB-3 remains **OPEN**.

---

## 11. S1 COMPLETION DECISION

> # CURRENT STATE: **NOT STARTED** · ENTRY DEPS 6/6 MET · S1 IS **READY FOR EXECUTION NOW** · 0/7 WORK ITEMS DONE · FAIL-CLOSED

### 11.1 Current state

**NOT STARTED.** No S1 work item is begun; ACs 0/10 MET; the `dom_ops`-backed durable adapter (AC-D1) does not
exist (OPF-D1 unchecked, repository-confirmed).

### 11.2 Blocking items (to reach COMPLETE)

The blockers to **completion** are the S1 work items themselves (there are **no open external entry blockers**):

1. **S1-W1 / AC-D1** — durable `MetadataPort` → `dom_ops` adapter + integration test *(Act-6-critical)*.
2. **S1-W2 / AC-D2** — audit persist/replay → `audit_entry` (insert-only role).
3. **S1-W3 / AC-D3** — `OPS_*` CloudEvents publisher (at-least-once + idempotency).
4. **S1-W4 / AC-D5** — continuous attestation scheduler.
5. **S1-W5 / S1-INSTR** — PRS-047..051 OTel/OTLP instrumentation.
6. **S1-W6 / UPP-1** — composition re-export + `operations:` allowlist; 0 core-dir change.
7. **S1-W7 / UPP-2** — full baseline suite + typecheck green (0 regression).

### 11.3 Dependency chain

```
[Entry deps SD-1..6 = MET]
        │  (no external blocker)
        ▼
S1-W1 (AC-D1) ──┬──► S1-W2 (AC-D2)
                └──► S1-W4 (AC-D5)
S1-W3 (AC-D3)   ─ parallel ─
S1-W5 (INSTR)   ─ parallel ─
S1-W6 (UPP-1)   ─ parallel ─
        │
        ▼
S1-W7 (UPP-2 regression + UPP gate)  ──►  S1 COMPLETE  ──►  RB-3 CLOSED  ──►  (Act 6 S1-dependency satisfied)
```

### 11.4 Earliest achievable state

> **EARLIEST ACHIEVABLE STATE: `READY FOR EXECUTION` — and S1 is at that state NOW.** All six entry
> dependencies (SD-1..6) are repository-confirmed MET, S1 is `[AGT-OK]` (no HAR, no live resource, no external
> gate), and the authorizing scope (AD-0016/0017/0019) is in force. **S1 can begin immediately.** The subsequent
> state, **COMPLETE**, is reached only after executing S1-W1..W7 with AC-D1/D2/D3/D5 + S1-INSTR verified and
> UPP-1/UPP-2 green (0 regression) — an execution act this package does not perform.

### 11.5 What this decision does and does not mean

- **Does mean:** S1 is fully decomposed and **cleared to start** (no dependency waiting); the path to COMPLETE
  is exact and known; AC-D1 is the Act-6-critical item.
- **Does NOT mean:** any S1 code is written, any test run, any AC met, or S1 complete. S1 remains **NOT STARTED**;
  RB-3 remains **OPEN**; Act 6 remains blocked on S1; **no evidence produced**; **G12-1 OPEN**.

---

## 12. GOVERNANCE / NON-MUTATION STATEMENT

This package produced **no** code, test, build, evidence, or approval; **verified nothing**; **marked no** item
or stage complete; **released no** lock; **enrolled no** invariant; **amended no** authority; and **modified no**
ratified construct. It is an additive `.md` decomposition/authority artifact. `INV-1..13`, `INV-CORE-01..14`,
`AUTH-012`, `AD-0014`, the Article IX generation lock, the Governance Baseline 1.0.0, `UCOS-ASR-NFR-001` floors,
and all ratified architectures/ADRs (including the ratified B02 OPF fabric) are unchanged.
`UCOS-CONSTRUCTION-BLOCKED` stands except the AD-0015 + scoped-construction (AD-0016/0017/0019) carve-outs. The
system's certification level is unchanged: **CONDITIONALLY CERTIFIED**.

---

## 13. TRACEABILITY

- **Closes blocker:** `UCOS-W1-ACT6-READY-001` RB-3 (on S1 completion).
- **AC basis:** `UCOS-W1-OEF-IAP-001` §8.2 (AC-D1/D2/D3/D5), §8.4 (UPP-1..5), §10 (S1 + PRS-047..051 instrumentation).
- **Execution class:** `UCOS-W1-OEF-EXEC-001` §2 (S1 `[AGT-OK]`, no evidence gate), §6.5 (UPP).
- **Repository state:** `B02-OPF-…-IMPLEMENTATION-PACKAGE.md` §5/§6/§7/§8 (fabric ratified; OPF-D1/D2/D3 backlog); `packages/platform-runtime/src/control/operations/*`; `.../persistence-runtime/durable-metadata-store.ts`; `.../meta-core/ports.ts`; `.../bootstrap.ts`.
- **SoR:** `dom_ops` / `migrations/V001__operational_proof_sor.sql` (INV-5, INV-10).
- **Observability:** `ADR-PE12` (OpenTelemetry/OTLP, ACCEPTED); non-actuation INV-CORE-12.
- **Authority:** `AUTH-012` — AD-0015, AD-0016/0017/0019 (scoped construction); `UCOS-CONSTRUCTION-BLOCKED`.
- **Tracker updated:** `UCOS-W1-OEF-TRACK-001` §2 (S1); `UCOS-W1-ACT6-READY-001` RB-3.
- **Owner:** Implementation Program (S1 build + verification); UCOS Authority Board (scope authority).

**END `UCOS-W1-S1-COMP-001` — S1 COMPLETION AUTHORITY PACKAGE · 10/10 OUTPUTS AUTHORED · CURRENT STATE: NOT STARTED · ENTRY DEPS 6/6 MET · S1 READY FOR EXECUTION NOW (`[AGT-OK]`; NO HAR; NO EXTERNAL BLOCKER) · WORK ITEMS 0/7 · ACs 0/10 · AC-D1 (dom_ops DURABLE ADAPTER) = ACT-6-CRITICAL, NOT STARTED (OPF-D1 UNCHECKED) · PATH TO COMPLETE: S1-W1..W7 + UPP-1/UPP-2 GREEN · NO CODE EXECUTED · NO EVIDENCE · NO APPROVAL ASSIGNED · S1 NOT MARKED COMPLETE · RB-3 OPEN · G12-1 OPEN · FAIL-CLOSED · APPEND-ONLY · SYSTEM REMAINS CONDITIONALLY CERTIFIED.**
