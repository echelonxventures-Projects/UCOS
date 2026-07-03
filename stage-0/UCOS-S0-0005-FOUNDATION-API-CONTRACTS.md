# UCOS-S0-0005 — Foundation API Contracts

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-S0-0005` |
| Program | **UCOS Stage 0 — Foundation Implementation Package** |
| Phase | S0-5 — API Foundation |
| Mode | **IMPLEMENTATION PLANNING ONLY** — specifies the Stage-0 API contract surfaces over the 85 ratified contracts of record. Contract-first design artifacts only (permitted under `UCOS-CONSTRUCTION-BLOCKED §4`, Prompt-07 lineage); **no API implementation** (prohibited under the lock). No code produced. |
| Status | STAGE-0 SPECIFICATION (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EXEC-0001` (INV-1 contract-first, N-2 non-waivable S1/S3/S4, N-7 fail-closed); `UCOS-IR-0005 §6` (runtime services); `UCOS-S0-0002/0004`; F-8 (85 ratified contracts; API-018/API-027) |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX lock **ACTIVE**; **`UCOS-CONSTRUCTION-BLOCKED` stands**. Contract-first, versioned, tolerant-reader; deny-by-default; S1/S3/S4 on every boundary. |

---

## 0. Purpose & standing

Specifies the **foundation API contracts** — the internal, registry, authority, configuration, and health
surfaces of the MCR. Every contract is **contract-first, versioned, and tolerant-reader** (INV-1) and realizes an
**existing ratified contract** (F-8: 85 contracts of record; `API-018` metadata/config, `API-027` registry). No
new contract class is invented. Contract-design artifacts are permitted under the lock (`UCOS-CONSTRUCTION-BLOCKED
§4`, Prompt-07 Service & API lineage); **API implementation is not** — that is gated on G0 = PASS.

**Universal boundary rules (apply to every contract below):**

| # | Rule | Basis |
|:-:|------|-------|
| BR-1 | **Contract-first** — the versioned contract precedes any integration; integrate only via published contracts | INV-1; Commandment 2 |
| BR-2 | **Non-waivable S1/S3/S4** on every exposed boundary, every tier, every environment, from first commit | N-2; Prohibition 6 |
| BR-3 | **Deny-by-default / fail-closed** — unproven authorization denies; no permissive/dev-exempt mode | N-7; INV-3 |
| BR-4 | **Evolution-only mutation** — every state-changing call routes through the Evolution commit path | N-5 |
| BR-5 | **Append-only / migration-only** — contracts evolve additively; versioned; tolerant-reader; no destructive break | N-3; INV-1 |
| BR-6 | **Audit-emitting** — every mutating call emits a hash-chained audit entry | S6; INV-10 |
| BR-7 | **Secrets by reference** — no secret material crosses a boundary as a literal | INV-11 |

---

## 1. Internal APIs (kernel composition surface)

| Contract | Surface | Realizes | Mutation? |
|----------|---------|----------|:---------:|
| `int.execute` | Deterministic capability execution via Meta-Core (E1) | RC-045/038; INV-CORE-09 | via E3 |
| `int.compose` | Acyclic capability composition (EX-4) | INV-13 | no |
| `int.evaluate-policy` | Deny-by-default policy evaluation (E2) | RC-060; INV-3 | no |
| `int.evaluate-trust` | Attribute-driven trust/clamping (E4) | RC-006 | no |
| `int.commit` | **Sole durable-mutation entry** (Evolution Engine E3) | RC-013; INV-10; N-5 | **yes (only path)** |

Internal APIs are **not externally exposed**; they are the in-process composition surface. Determinism is
enforced — non-deterministic computation is quarantined behind the verifier gate and never reaches `int.commit`
(N-8; V7).

---

## 2. Registry APIs (`API-027` / `API-018` lineage)

| Contract | Surface | Realizes |
|----------|---------|----------|
| `reg.register` | Register a construct `id@version` (EX-1) | `API-027`; RC-024/041 |
| `reg.resolve` | Resolve/discover a construct at runtime | `API-027`; PEP-001 |
| `reg.describe` | Read/attach open-class metadata (EX-2) | `API-018`; PEP-002 |
| `reg.list-capabilities` | Enumerate CAP-01..19 / CAP-IR-001..067 | `UCOS-IR-0001` |
| `reg.list-fabrics` | Enumerate the 25 fabrics + class/state | `UCOS-IR-0003` |
| `reg.emit-event` / `reg.subscribe` | Event catalog publish/consume (at-least-once, idempotent) | RC-028; INV-6 |

Writes route through `int.commit` (BR-4) and emit audit (BR-6). Reads are deny-by-default authorized (BR-3).

---

## 3. Authority APIs (AUTH-012 lineage — Board-terminal)

| Contract | Surface | Realizes | Who may invoke |
|----------|---------|----------|----------------|
| `auth.read-decision` | Read AUTH-012 decision records (append-only ledger) | RC-004/033; INV-10 | authorized reader (deny-by-default) |
| `auth.read-hierarchy` | Read Authority Hierarchy + enumerated powers A-1..A-9 | `UCOS-EXEC-0001 §7` | authorized reader |
| `auth.submit-for-decision` | Submit a Governance/Authority-Approval operation for a gate/Board decision | `AUTH-009`; `AD-0009` | governed submitter |
| `auth.record-board-act` | **Record** a Board A-1..A-9 act on the ledger | A-9; INV-10 | **UCOS Authority Board only (human-executed)** |

> **Terminal-authority rule.** `auth.record-board-act` is **not** invokable by any agent/steward/automated
> process (`UCOS-EXEC-0001 §7` terminal-authority rule; `UCOS-EP-0008`). The API specifies the ledger-write
> contract; the **Authority Board authorizes and a human executes** A-1..A-9 acts. No enrollment (A-2) or
> lock-lift (A-1) is performed by this surface.

---

## 4. Configuration APIs (`API-018` lineage)

| Contract | Surface | Realizes |
|----------|---------|----------|
| `cfg.resolve` | Hierarchical config resolution (behavior-as-data) | IP-04; PEP-003; CF-1 |
| `cfg.set` | Additive config record write (via `int.commit`) | CF-1; N-3 |
| `cfg.reference-secret` | Bind a secret **by reference** (never a literal) | INV-11; BR-7 |
| `cfg.resolve-adr` | Resolve neutral technology binding within ADR-001..007 | CF-2 |

`cfg.set` never introduces a code fork (Prohibition 3); a technology-product change is a new ADR version + A-4
Board act, not a config switch (CF-2).

---

## 5. Health APIs (liveness / readiness / invariant posture)

| Contract | Surface | Semantics |
|----------|---------|-----------|
| `health.live` | Process liveness | 200 iff process running |
| `health.ready` | Readiness | ready **iff** boot reached B7 and V1..V9 armed (`UCOS-S0-0004 §5`) |
| `health.invariants` | Invariant posture | reports INV-1..13 + S1/S3/S4/S6 provable / fail-closed state |
| `health.audit-chain` | Audit continuity | reports hash-chain unbroken (S6; IC-3) |

Health surfaces are **read-only** and **fail-closed by disclosure**: `ready` returns not-ready if any invariant
is unprovable (N-7). No health surface exposes secret material (BR-7).

---

## 6. Contract governance

| Rule | Statement | Basis |
|------|-----------|-------|
| CG-1 | Every contract is versioned; consumers are tolerant-readers | INV-1 |
| CG-2 | Contract change is **additive / migration-only**; no destructive break | N-3; BR-5 |
| CG-3 | A new/changed technology-product ADR backing a contract is an **A-4 Board act** | A-4; CF-2 |
| CG-4 | Every contract maps to one of the **85 ratified contracts** (F-8); none invented | F-8; Prohibition 3 |
| CG-5 | Non-waivable S1/S3/S4 hold at every contract boundary and every environment | N-2 |

---

## 7. Determination

> **The Stage-0 foundation API contracts are fully specified.** Five contract families — Internal (kernel
> composition, sole Evolution commit), Registry (`API-027`/`API-018`), Authority (AUTH-012, Board-terminal),
> Configuration (`API-018`, behavior-as-data), and Health (fail-closed posture) — are defined **contract-first,
> versioned, tolerant-reader**, each realizing an existing ratified contract (F-8) under seven universal boundary
> rules that enforce non-waivable S1/S3/S4 (N-2), deny-by-default fail-closed (N-7), Evolution-only mutation
> (N-5), append-only evolution (N-3), and secrets-by-reference (INV-11). **No new contract class is invented; no
> API is implemented**; the Board-terminal authority acts (A-1/A-2) are specified as reserved, not performed.
> Implementation is gated on **G0 = PASS**.

## 8. Scope discipline
No API implementation, code, schema, requirement, RC class, invariant, governance, or authority was produced or
modified. INV-1..13, `AUTH-012`, `AD-0014`, and the Article IX generation lock are unchanged;
**`UCOS-CONSTRUCTION-BLOCKED` stands.** Contract specification only.

## 9. Traceability
- **Consumes:** `UCOS-EXEC-0001` (INV-1, N-2/N-3/N-5/N-7, A-1..A-9, F-8); `UCOS-IR-0005 §6` (runtime services); `UCOS-S0-0002` (registries); `UCOS-S0-0004` (engines/boot/validators); `API-018`/`API-027`.
- **Refined by:** `UCOS-S0-0006` (functional/registry API tests), `UCOS-S0-0007` (build plan).
- **Owner:** UCOS Authority Board.

**END `UCOS-S0-0005` — FOUNDATION API CONTRACTS · INTERNAL / REGISTRY / AUTHORITY / CONFIG / HEALTH · CONTRACT-FIRST · S1/S3/S4 NON-WAIVABLE · DENY-BY-DEFAULT FAIL-CLOSED · EVOLUTION-ONLY MUTATION · BOARD-TERMINAL ACTS RESERVED · MAPS TO 85 RATIFIED CONTRACTS · 0 NEW CONTRACT CLASS · IMPLEMENTATION GATED ON G0 · PLANNING ONLY.**
