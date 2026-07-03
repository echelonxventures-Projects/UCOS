# UCOS-S0-0006 — Stage-0 Acceptance Suite

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-S0-0006` |
| Program | **UCOS Stage 0 — Foundation Implementation Package** |
| Phase | S0-6 — Acceptance Tests |
| Mode | **IMPLEMENTATION PLANNING ONLY** — specifies the Stage-0 acceptance suite (test definitions and pass criteria). No test code is authored; test *implementation/execution* under construction authorization is gated on G0 = PASS. No code, requirement, RC class, invariant, governance, or authority produced. |
| Status | STAGE-0 SPECIFICATION (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EXEC-0001` Part V (Acceptance/Completion/Failure criteria); `UCOS-IR-0005` (MCR); `UCOS-EP-0006` (Gate 0/1 criteria); `UCOS-S0-0001..0005`; `REAL-M-03` (269/269 baseline of record) |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX lock **ACTIVE**; **`UCOS-CONSTRUCTION-BLOCKED` stands**. Fail-closed: any assertion FALSE ⇒ suite FAIL. |

---

## 0. Purpose & standing

Defines the **Stage-0 acceptance suite** for the foundation runtime across five test classes — **Functional,
Integrity, Invariant, Boot, Registry**. Acceptance is measured against `UCOS-EXEC-0001 §V.1` (a work item is
ACCEPTED when outputs exist, its binary criterion is TRUE, the baseline is preserved, 0 prohibited-core-dir
change, S1/S3/S4 enforced, traceability intact). The realized MCR carries a **269/269** baseline of record
(`REAL-M-03`); Stage-0 acceptance **re-asserts** that baseline plus the invariant/boot/registry posture.

> **Two distinct acceptance layers.** (a) **Foundation acceptance** — the tests below prove the MCR is
> correctness-complete (this is realized of record at 269/269, subject to independent reproduction). (b)
> **Stage-0 GATE acceptance** — the *authorization* to proceed is `G0 = AT-P0-1 ∧ AT-P0-2 ∧ AT-P1-7 ∧ AT-P0-3`
> (`UCOS-EP-0006` Gate 0; `UCOS-G0-0006`), of which `AT-P0-2` **is** the independent reproduction of 269/269
> (`REAL-M-03`). Foundation tests passing does **not** by itself flip G0; the evidentiary/authority elements
> (§6) remain required.

---

## 1. Functional tests (FT)

| # | Test | Asserts | Basis |
|:-:|------|---------|-------|
| FT-1 | Register → resolve construct `id@version` | `reg.register` then `reg.resolve` returns the construct | RC-024; `API-027` |
| FT-2 | Describe via open-class metadata | `reg.describe` attaches/reads metadata | RC-024; `API-018` |
| FT-3 | Resolve behavior from configuration | `cfg.resolve` binds behavior from records, not code | IP-04; CF-1 |
| FT-4 | Deterministic execution | `int.execute` yields identical output for identical input | INV-CORE-09 |
| FT-5 | Commit via Evolution only | durable mutation succeeds only through `int.commit` (E3) | N-5; INV-10 |
| FT-6 | Event propagation | `reg.emit-event` → `reg.subscribe` delivers at-least-once, idempotent | RC-028; INV-6 |
| FT-7 | Federation assertion verify | Ed25519 signed assertion verifies; bad signature fails closed | RC-007/035; INV-1 |

## 2. Integrity tests (IT)

| # | Test | Asserts | Basis |
|:-:|------|---------|-------|
| IT-1 | Single SoR | no domain exposes a second system-of-record | INV-5; IC-1 |
| IT-2 | Append-only ledger | update/delete on audit & decision ledgers is rejected | INV-10; IC-2 |
| IT-3 | Hash-chain continuity | `audit_entry.prev_hash` chain verifies; tamper detected offline | S6; IC-3 |
| IT-4 | No independent commit | no fabric commits durable state outside Evolution | N-5; IC-4 |
| IT-5 | Version monotonicity | `id@version` strictly increases; prior versions retained | INV-10; IC-5 |
| IT-6 | No secret literals | no secret material present in code/config/records | INV-11; IC-6 |
| IT-7 | Core-directory immutability | the five prohibited core dirs are unmodified by any build | N-6; F-10; V9 |

## 3. Invariant tests (INV-T)

| # | Test | Asserts | Basis |
|:-:|------|---------|-------|
| INV-T-1 | INV-1..13 hold | each binding invariant is provable on the realized kernel | F-4; N-1 |
| INV-T-2 | Non-waivable S1/S3/S4 | authn/authz, secrets, data-protection enforced on every boundary/env | N-2 |
| INV-T-3 | Deny-by-default | unauthorized operation is denied, not defaulted-open | INV-3; N-7 |
| INV-T-4 | Fail-closed | inability to prove an invariant halts/denies the operation | N-7 |
| INV-T-5 | Determinism quarantine | non-deterministic computation never reaches the commit path | N-8; INV-CORE-09 |
| INV-T-6 | No enrollment by test | suite asserts INV-1..13 only; enrolls no invariant (INV-14..20 untouched) | Prohibition 3; A-2 |

## 4. Boot tests (BT)

| # | Test | Asserts | Basis |
|:-:|------|---------|-------|
| BT-1 | Genesis bootstrap | B0 seeds genesis principal/authority; CYC-1/2/3 resolved | `UCOS-IR-0006`; `UCOS-S0-0004 §5` |
| BT-2 | Ordered bring-up | B1→B5 fabrics start only after predecessors prove clean | 0 forward dep |
| BT-3 | Security-first | V2/V3/V4 armed at B2 before any boundary is exposed | N-2 |
| BT-4 | Fail-closed boot | a failed step halts boot; runtime does not accept operations | N-7 |
| BT-5 | Readiness gate | `health.ready` is TRUE only at B7 with V1..V9 armed | `UCOS-S0-0005 §5` |

## 5. Registry tests (RT)

| # | Test | Asserts | Basis |
|:-:|------|---------|-------|
| RT-1 | 7 registries present | RegistryPort/MetadataPort/ConfigurationPort/Identity/Policy/AUTH-012/Event Catalog resolve | `UCOS-IR-0005 §3` |
| RT-2 | Seed reference intact | INV-1..13, AUTH-001..012, CAP-01..19/CAP-IR-001..067, 25 fabrics, event catalog seeded verbatim | `UCOS-S0-0002 §4` |
| RT-3 | Registry write governed | every registry write routes through Evolution + emits audit | RG-1/RG-5 |
| RT-4 | Invariant/Authority read-only | implementation cannot write the Invariant/Authority registries | RG-6; N-1/N-4 |
| RT-5 | Additive extension | new construct enters via registration/metadata; 0 core-dir change | INV-13; EX-1/EX-2 |

---

## 6. Relationship to the Stage-0 GATE (G0)

Foundation acceptance (§1–§5) is **necessary but not sufficient** to proceed. The authorization to build forward
is the Gate-0 conjunction (`UCOS-EP-0006`; `UCOS-G0-0006`):

| Gate element | Requirement | Suite tie-in | Status of record |
|--------------|-------------|--------------|:----------------:|
| AT-P0-1 | Independent attestation `REAL-C-05` (authority chain + PI-8/PI-9) | external evidence | **FAIL** |
| AT-P0-2 | Independent re-measurement `REAL-M-03` (269/269 reproduced) | **§1–§5 reproduced by an independent party** | **FAIL** |
| AT-P1-7 | Terminal cert re-issued `UCOM-ULTIMATE-CERT-002` | external evidence | **FAIL** |
| AT-P0-3 | Board A-1 lift act on `AUTH-012` | external authority act | **FAIL** |

> Passing FT/IT/INV-T/BT/RT **as authored by the implementing party** does not satisfy AT-P0-2 — that element
> requires **independent** reproduction (self-attestation is rejected: `UCOS-EXEC-0001` Prohibition 13;
> `UCOS-EP-0005 §2`). Suite pass feeds the evidence package; it does not by itself flip G0.

---

## 7. Determination

> **The Stage-0 acceptance suite is fully specified** across five classes — 7 Functional, 7 Integrity, 6
> Invariant, 5 Boot, 5 Registry tests (30 acceptance assertions) — each mapped to a binding invariant or
> control and to the `UCOS-EXEC-0001 §V.1` acceptance criteria, and each **fail-closed** (any assertion FALSE ⇒
> FAIL). The suite re-asserts the realized **269/269** baseline and the invariant/boot/registry posture. It is a
> **specification of tests, not test code**; authored-party pass does not satisfy the independent-reproduction
> gate element (AT-P0-2), and the suite enrolls no invariant. Execution under construction authorization is gated
> on **G0 = PASS** — currently **FAIL** on all four elements (`UCOS-G0-0006`).

## 8. Scope discipline
No test code, source code, schema, API, requirement, RC class, invariant, governance, or authority was produced
or executed. INV-1..13, `AUTH-012`, `AD-0014`, and the Article IX generation lock are unchanged;
**`UCOS-CONSTRUCTION-BLOCKED` stands.** Specification only.

## 9. Traceability
- **Consumes:** `UCOS-EXEC-0001 §V` (criteria); `UCOS-IR-0005` (MCR components); `UCOS-EP-0006` (Gate 0/1); `UCOS-G0-0006` (G0=FAIL); `REAL-M-03` (269/269); `UCOS-S0-0001..0005`.
- **Refined by:** `UCOS-S0-0007` (build plan acceptance/completion criteria).
- **Owner:** UCOS Authority Board.

**END `UCOS-S0-0006` — STAGE-0 ACCEPTANCE SUITE · 30 ASSERTIONS (7 FUNCTIONAL / 7 INTEGRITY / 6 INVARIANT / 5 BOOT / 5 REGISTRY) · FAIL-CLOSED · RE-ASSERTS 269/269 · AUTHORED-PASS ≠ AT-P0-2 (INDEPENDENT REPRODUCTION) · ENROLLS NO INVARIANT · EXECUTION GATED ON G0 (FAIL) · PLANNING ONLY.**
