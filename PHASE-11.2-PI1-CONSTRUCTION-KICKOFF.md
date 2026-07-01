# UCOS — PHASE 11.2 PI-1 CONSTRUCTION KICKOFF

## Execution Baseline & Work Package Authorization (Platform Foundation)

| Field | Value |
|-------|-------|
| Artifact | **UCOS-PHASE-11.2-PI1-CONSTRUCTION-KICKOFF** |
| Artifact ID | `UCOS-IMP-KICK-PI1-001` |
| Version | 1.0.0 |
| Phase | **Phase 11.2 — PI-1 Construction Kickoff** |
| Mode | **EXECUTION BASELINE & AUTHORIZATION ONLY** — establishes the authoritative PI-1 baseline and authorizes construction startup; writes **no** code, creates **no** infrastructure, modifies **no** architecture/ADR, mutates **no** service/registry/state |
| Authorized by | `UCOS-CONSTRUCTION-AUTHORIZATION` (`UCOS-CONSTR-AUTH-001`) via `UCOS-ARTICLE-IX-LOCK-RELEASE` (`UCOS-ART9-REL-001`) |
| Predecessor | `UCOS-IMP-RDY-PI1-001` — **READY — WITH PRECONDITIONS** (0 blocking findings) |
| Authority | Subordinate to Governance Baseline 1.0.0 (FROZEN), Authority Layer (`AUTH-001..012`), Constitution (Art. IX/XII) |
| Branch | `phase-10-implementation-readiness` (DO NOT PUSH / MERGE / TAG) |
| Date | 2026-07-01 |
| **Status** | **PI-1 AUTHORIZED TO COMMENCE — WITHIN SCOPE, UNDER MANDATORY CONTROLS** |

> This document is the **authoritative execution baseline for PI-1 (Platform Foundation)** and the formal
> handoff from governance into controlled construction. It consolidates and enacts the ratified plans
> (`UCOS-IMP-MOB-001` mobilization; `UCOS-IMP-RDY-PI1-001` readiness) and its governing authorizations. It
> introduces no new capability, domain, contract, event, data construct, or technology, and mutates no
> frozen artifact. Nothing herein generates code or provisions live infrastructure.

> **Seed-naming reconciliation (append-only refinement).** This kickoff adopts the canonical five-item
> construction seed named below (WI-SEED.1 Repository, .2 Platform, .3 Security, .4 Delivery, .5 Secrets &
> Key). It **supersedes and refines** the provisional seed enumeration in `UCOS-IMP-MOB-001` §2.6 (which
> listed repo/CI-CD/env/ASR-intake) — the mobilization content is preserved, not deleted; ASR-intake is
> retained as baseline precondition **PC-1** (§8/CP-1), and the secrets/key primitive requested by readiness
> finding **NB-1** is formalized here as **WI-SEED.5**.

---

# SECTION 1 — EXECUTIVE AUTHORIZATION

## 1.1 Construction Authority Chain

```
UCOS Constitution (UCOS-CONST-001) — Article IX (Governed Generation) · Article XII (Non-waivable controls)
        │
        ▼
Authority Layer (AUTH-001..012) — terminal authority: UCOS Authority Board (AUTH-009)
        │
        ▼
UCOS Governance Baseline 1.0.0 (FROZEN · CERTIFIED)
        │
        ▼
UCOS-ART9-REL-001  — Article IX generation lock RELEASED (2026-06-30) [Motion D-6]
        │
        ▼
UCOS-CONSTR-AUTH-001 — Construction Authorization (scope A1..A8; controls IC-1..IC-8) [supersedes CONSTRUCTION-BLOCKED]
        │
        ▼
UCOS-IMP-MOB-001 — Phase 11.0 Construction Mobilization (PI-1 plan)
        │
        ▼
UCOS-IMP-RDY-PI1-001 — Phase 11.1 PI-1 Readiness Assessment (READY — WITH PRECONDITIONS · 0 blocking)
        │
        ▼
UCOS-IMP-KICK-PI1-001 — THIS ARTIFACT (PI-1 Execution Baseline & Work Package Authorization)
```

Terminal escalation authority for all PI-1 decisions remains the **UCOS Authority Board**
(`UCOS-IMP-GOV-001` §4). Single accountable owner per work package (`PEO-001..017`).

## 1.2 Effective Authorization

| Field | Value |
|-------|-------|
| Effective | **2026-07-01T00:00:00Z** |
| Valid while | `UCOS-ART9-REL-001` and `UCOS-CONSTR-AUTH-001` stand (subject to their §6 revocation conditions) |
| Authorizes | Commencement of PI-1 construction startup: the five construction-seed work items (§3) and the two authorized foundation work packages `WP-PLT-01`, `WP-PLT-03` (§4), under the mandatory controls |
| Does not authorize | Any work outside PI-1 scope; any ENV-PROD promotion; any deferred/unratified technology; any frozen-artifact change |

## 1.3 Scope Boundaries

**In scope (this authorization):** construction seed `WI-SEED.1..5`; foundation WPs `WP-PLT-01` (Runtime &
Compute) and `WP-PLT-03` (Networking & Connectivity). **Staged (authorized on precondition/checkpoint):**
`WP-PLT-02` (Persistence), `WP-PLT-11` (Config/Metadata), `WP-PLT-06` (Registry) — authorized to proceed on
satisfaction of their §5 sequence gates and preconditions PC-1/PC-2. **Out of scope (later PIs):** eventing/
gateway/workflow/identity/secrets-service/audit/control-plane/observability/resilience/delivery-platform/
analytics/commerce/experience/validation/certification.

## 1.4 Constraints (binding)

`P1` no scope creep · `P2` no mutation of frozen artifacts (`UCOS-PEA-001..007`, Baseline 1.0.0, ratified
domains/entities/matrices, ratified ADRs) · `P3` no technology beyond ratified ADRs (incl. deferred
`ADR-002A`/`PE-12`/`PE-07`) · `P4` no waiver of S1/S3/S4 · `P5` no gate bypass / unsigned / unregistered
promotion / no ENV-PROD deploy · `P6` no build against unratified ASR/NFR values · `P7` no broad/unsafe SCM.
**Additionally:** no implementation code, no service implementation, no registry mutation, no state
mutation — this artifact is planning/authorization only.

## 1.5 IC-1 through IC-8 — Binding Statement

> The following mandatory implementation controls, restated from `UCOS-CONSTR-AUTH-001` §4 and
> `UCOS-ART9-REL-001` §5, are **binding on every PI-1 work item without exception**. They are conditions of
> this authorization; violation of any triggers the §8 stop-work and the §6 revocation review of the parent
> authorization.

| Control | Binding requirement | Waivable |
|---------|---------------------|:--------:|
| **IC-1** | Non-waivable **S1/S3/S4** enforced on every exposed boundary from day one (Const. Art. XII / AUTH-008). | **No** |
| **IC-2** | Contract-first: services realize only ratified published contracts; substrate planes expose no business contract. | No |
| **IC-3** | `GATE-QUAL-001` (Q1–Q6), `GATE-SEC-001` (S1–S7), `GATE-DOC-001` (D1–D6), traceability PASS per WP; `GATE-REL-001` gates any ENV-PROD (none in PI-1). | Q/D recorded; S1/S3/S4 **No** |
| **IC-4** | Traceability: every artifact → contract/`PE-*`/capability/domain; 0 orphans; registered in `CTX-REG-001`. | No |
| **IC-5** | ASR resolution (Prompt 02) before any performance/availability-bound work (PC-1). | No |
| **IC-6** | Forward security obligations FO-1/FO-2/FO-3 discharged (Prompts 07/10/11). | No |
| **IC-7** | Migration-only evolution; only ratified ADRs used; deferred sub-ADRs not used. | No |
| **IC-8** | Preservation discipline: scoped, explicit-path commits; no broad SCM; append-only records. | No |

---

# SECTION 2 — PI-1 EXECUTION BASELINE

## 2.1 PI Objective

Stand up the **execution / persistence / networking substrate** plus the **registry** and
**configuration-and-metadata** foundation services — contract-conformant, gate-clean, and traceable — as the
substrate on which every later Program Increment runs. (Roadmap stage **S1**; stream **DS-PLATFORM**;
WPs `WP-PLT-01/02/03/06/11`.)

## 2.2 PI Success Criteria

| # | Success criterion |
|:-:|-------------------|
| SC-A | Substrate (runtime, networking, persistence) operational in ENV-DEV and ENV-INT. |
| SC-B | Registry service realizes `UCOS-API-CONTRACT-027` (+`EVT-027`/`DATA-027`), contract-conformant. |
| SC-C | Config/Metadata service realizes `UCOS-API-CONTRACT-018` (+`EVT-018`/`DATA-018`), contract-conformant. |
| SC-D | Non-waivable **S1/S3/S4** enforced on every exposed foundation boundary, verified by `GATE-SEC-001`. |
| SC-E | Full traceability (0 orphans); every artifact registered in `CTX-REG-001`. |
| SC-F | Bootstrap delivery pipeline builds, tests, signs, and promotes to ENV-DEV/INT (no ENV-PROD). |

## 2.3 Exit Criteria (X1–X10) — from `UCOS-IMP-MOB-001` §1.4, restated authoritative

| # | Exit criterion | Measure |
|:-:|----------------|---------|
| X1 | Substrate operational in ENV-DEV/INT (not PROD). | health + IaC state |
| X2 | Registry realizes `API-027`+`EVT-027`+`DATA-027`; provider+consumer tests PASS. | contract-test report |
| X3 | Config/Metadata realizes `API-018`+`EVT-018`+`DATA-018`; tests PASS. | contract-test report |
| X4 | `GATE-QUAL-001` (Q1–Q6) PASS per in-scope WP. | quality evidence |
| X5 | `GATE-SEC-001` PASS (S1–S7; S1/S3/S4 enforced). | security evidence |
| X6 | `GATE-DOC-001` (D1–D6, incl. D6 runbooks) PASS. | doc evidence |
| X7 | Traceability clean (0 orphans); registered in `CTX-REG-001`. | `TM-IMP-MOB-*` + registry |
| X8 | PI-1 ASR/NFR values ratified (Prompt 02); no build against `PENDING`. | ASR record (binary) |
| X9 | FO-1/FO-2/FO-3 discharged for `API-027`/`API-018`. | threat model + scan |
| X10 | Append-only records; scoped commits; 0 frozen-baseline mutations. | commit log + ledger |

## 2.4 Acceptance Criteria (per work item / WP)

Acceptance = the **Definition of Done** (`UCOS-IMP-DELIV-001` §5) applied per WP:
1. Implements only ratified contracts/designs (Art. IX; no unsanctioned scope).
2. Unit + contract tests present and passing (provider/consumer).
3. `GATE-QUAL-001` + `GATE-SEC-001` (S1/S3/S4 non-waivable) + `GATE-DOC-001` PASS.
4. Full traceability: artifact → contract → domain → capability; 0 orphans.
5. Runbook + operability docs present (D6).
6. Registered in `CTX-REG-001` with bidirectional links and gate status.

## 2.5 Completion Criteria (PI-1 close)

PI-1 is **complete** only when: **X1–X10 all TRUE** AND every in-scope WP meets §2.4 acceptance AND the
Authority Board records PI-1 exit approval at **CP-6** (`UCOS-IMP-GOV-001` §4, Approval-Required). On
completion, PI-2 entry is unlocked. **No calendar commitment** — completion is dependency-/gate-bound.

---

# SECTION 3 — CONSTRUCTION SEED

Five bounded seed work items enable PI-1 without pre-empting later platform WPs. Each is registered in
`CTX-REG-001` as **seed** and is hardened/superseded (migration-only, IC-7) by its full platform WP in a
later PI. **No seed item introduces unratified technology or scope.**

## WI-SEED.1 — Repository Foundation
- **Objective:** activate the ratified repository implementation structure (`UCOS-IMP-MOB-001` §3) for
  PI-1 substrate and foundation services.
- **Deliverables:** `services/platform/{registry,config-metadata}/` placeholders; `packages/{contracts-sdk,
  platform-runtime}/`; `infra/{runtime,persistence,networking,environments}/` module skeletons;
  `security/`, `quality/`, `release/` evidence folders. Structure only — no logic.
- **Dependencies:** lock released (PI-0). None in-PI.
- **Security controls:** none directly; enforces **no-secrets-in-repo** discipline (S3 hygiene).
- **Traceability:** `apps/services/packages/README.md` scaffolding rules; `CTX-ARCHB-001` §3; IC-4.
- **Acceptance:** structure registered in `CTX-REG-001`; `architecture/` + `docs/implementation/` confirmed
  read-only (P2); 0 code, 0 secrets committed.

## WI-SEED.2 — Platform Bootstrap
- **Objective:** provision the platform substrate baseline (ENV-DEV/ENV-INT as governance promotion stages)
  onto which runtime/networking/persistence WPs deploy.
- **Deliverables:** ENV-DEV and ENV-INT declared via declarative IaC (ADR-007); Kubernetes conformance
  baseline (ADR-001); no ENV-PROD.
- **Dependencies:** WI-SEED.1; WI-SEED.4 (pipeline to apply IaC); WI-SEED.5 (key/secret refs for provisioning).
- **Security controls:** SEC-CTL-017 (segmentation baseline), SEC-CTL-008 (transport) staged for WP-PLT-03.
- **Traceability:** ADR-001, ADR-007; `UCOS-IMP-DELIV-001` §4; `PEA-001` PE-01/PE-15.
- **Acceptance:** ENV-DEV/INT reconciled and drift-free; no ENV-PROD; registered as *seed*.

## WI-SEED.3 — Security Bootstrap
- **Objective:** establish the day-one enforcement scaffolding for non-waivable **S1/S3/S4** so no boundary
  can exist unprotected (IC-1).
- **Deliverables:** mTLS trust anchor / workload-identity issuance (ADR-006 mesh, subset of WP-PLT-03);
  deny-by-default authorization baseline (policy engine / OPA, ADR-006); boundary enforcement policy
  (SEC-CTL-014) applied to ENV-DEV/INT.
- **Dependencies:** WI-SEED.2; WI-SEED.5 (keys for mTLS/CA). Full identity service (PE-08) is PI-2.
- **Security controls:** SEC-CTL-001/002/014 (S1), SEC-CTL-008 (S4 transit), SEC-CTL-017 (S5).
- **Traceability:** ADR-006; `UCOS-SEC-CONTROL-001` (S1/S4 rows); `PEA-007` control fabric (design
  discipline in PI-1); IC-1/IC-6.
- **Acceptance:** every ENV-DEV/INT boundary is workload-authenticated (mTLS) and deny-by-default; **no
  boundary is externally exposed** in PI-1; S1/S3/S4 posture verifiable.

## WI-SEED.4 — Delivery Bootstrap
- **Objective:** activate a bootstrap-minimal CI/CD pipeline sufficient to build/test/sign/promote PI-1 to
  ENV-DEV/INT (does **not** deliver `WP-PLT-14/15`, PI-3).
- **Deliverables:** pipeline-as-code (ADR-007); reproducible OCI build; unit + contract test stages (Q4);
  SAST/SCA dependency scan (FO-2/S7); artifact signing (Sigstore/cosign); GitOps gated promotion
  ENV-DEV → ENV-INT.
- **Dependencies:** WI-SEED.1; WI-SEED.5 (signing keys/secrets by reference).
- **Security controls:** SEC-CTL-018 (dependency-risk / FO-2), signing/provenance (staging `GATE-REL-001`
  R4–R7; enforcement PI-7).
- **Traceability:** ADR-007; `UCOS-IMP-DELIV-001`; `UCOS-IMP-GOV-001` gates; `PEA-001` PE-14/15.
- **Acceptance:** pipeline builds/tests/signs a sample artifact and promotes DEV→INT under gates; no
  unsigned artifact promoted (P5); no push/merge/tag on the working branch; registered as *seed*.

## WI-SEED.5 — Secrets & Key Bootstrap
- **Objective:** provide the bounded secrets/key primitive (subset of ADR-006) enabling S3
  injection-by-reference and S4 externalized encryption-at-rest keys **before** full PE-09
  (`WP-PLT-09`, PI-2). Formalizes readiness finding **NB-1** / precondition **PC-2**.
- **Deliverables:** secrets manager / KMS primitive (ADR-006) issuing secrets and keys **by reference**;
  key material for mTLS CA (WI-SEED.3) and at-rest encryption (WP-PLT-02); rotation policy defined.
- **Dependencies:** WI-SEED.2. Superseded/hardened by `WP-PLT-09` in PI-2 (migration-only, IC-7).
- **Security controls:** SEC-CTL-005 (secret vaulting/injection — S3), SEC-CTL-006 (key lifecycle — S3/S4),
  SEC-CTL-007 (rotation — S3), SEC-CTL-009 (at-rest keys — S4).
- **Traceability:** ADR-006; `UCOS-SEC-CONTROL-001` (S3/S4 non-waivable rows); IC-1; NB-1/PC-2.
- **Acceptance:** **zero** secrets in code/config/IaC (S3); all secrets/keys resolved by reference; rotation
  policy recorded; registered as *seed*.

> **Seed dependency order:** WI-SEED.1 → WI-SEED.2 → WI-SEED.5 → WI-SEED.3 → WI-SEED.4. (Keys precede the
> security anchor; the security anchor precedes delivery signing.)

---

# SECTION 4 — WORK PACKAGE AUTHORIZATION

The following two foundation work packages are **authorized to commence** upon seed completion. Both run in
parallel (§5); neither may expose an unprotected boundary (IC-1).

## 4.1 WP-PLT-01 — Runtime & Compute (PE-01 · ADR-001 · ICU-015)

| Aspect | Definition |
|--------|-----------|
| **Preconditions** | WI-SEED.1/2/4 complete; PC-3 (registration) met; PC-4 (authorization standing) confirmed; PC-1 satisfied before any performance-bound tuning. |
| **Inputs** | ADR-001 (OCI + Kubernetes; Java 21 LTS/JVM primary; governed polyglot); `PEA-002` (PRD/PRS/PEX/PWF); `PEA-001` PE-01; ENV-DEV/INT (WI-SEED.2). |
| **Outputs** | Runtime/compute substrate (container runtime + Kubernetes conformance profile); workload runtime baseline; determinism/composability posture (EX1; `PEP-009/018`); workload-identity surfaces for mTLS. |
| **Dependencies** | WI-SEED.2 (platform), WI-SEED.3 (security anchor), WI-SEED.5 (keys). Downstream: WP-PLT-02/06/11 run on it. |
| **Risks** | R-1 (unratified NFR tuning → PC-1), R-4 (seed/scope drift), R-7 (deferred tech). |
| **Controls** | QUAL Q1/Q6; SEC-CTL-014 (S1 workload identity via mesh); IC-1/IC-4/IC-7. |

## 4.2 WP-PLT-03 — Networking & Connectivity (PE-03 · ADR-006 networking facet · ICU-015)

| Aspect | Definition |
|--------|-----------|
| **Preconditions** | WI-SEED.2 complete; WI-SEED.3 (security anchor) and WI-SEED.5 (mTLS keys) available; PC-3/PC-4 met. |
| **Inputs** | ADR-006 (mTLS service mesh; segmentation; zero-trust transport); `PEA-001` PE-03; `UCOS-SEC-CONTROL-001` (SEC-CTL-008/014/017). |
| **Outputs** | Zero-trust transport substrate (mTLS on every hop; encryption in transit); network segmentation / lateral-movement restriction (`PRS-010/011`); internal boundary connectivity for foundation services. |
| **Dependencies** | WI-SEED.2/3/5; runs alongside WP-PLT-01. Downstream: all foundation boundaries depend on it for S1/S4. |
| **Risks** | R-2 (S1 vs. PE-08 identity timing → mTLS workload identity, internal-only), R-3 (S3 keys → WI-SEED.5). |
| **Controls** | SEC-CTL-008 (**S4** transit, non-waivable), SEC-CTL-014 (**S1** boundary, non-waivable), SEC-CTL-017 (S5); IC-1. |

> **Authorization:** `WP-PLT-01` and `WP-PLT-03` are **AUTHORIZED** to commence on seed completion, in
> parallel, under the controls above. `WP-PLT-02`, `WP-PLT-11`, `WP-PLT-06` remain **staged** and are
> authorized to proceed at their §5 sequence gates (they are not started by this section).

---

# SECTION 5 — IMPLEMENTATION SEQUENCE

Exact execution order (dependency-/gate-bound; consistent with `UCOS-IMP-DEP-001` and `UCOS-IMP-MOB-001` §9):

```
[0] SEED LAYER
     WI-SEED.1 Repository → WI-SEED.2 Platform → WI-SEED.5 Secrets&Key → WI-SEED.3 Security → WI-SEED.4 Delivery
     gate: CP-0 (seed acceptance) · PC-1 ASR intake opened · PC-3 registration
        ↓
[1] RUNTIME FOUNDATION        — WP-PLT-01 (ADR-001)              ┐ parallel
        ↓                                                        │
[2] NETWORKING FOUNDATION     — WP-PLT-03 (ADR-006; mTLS/S1/S4)  ┘
     gate: CP-2 (substrate readiness: QUAL + SEC S4/S1-transport)
        ↓
[3] REGISTRY FOUNDATION       — WP-PLT-06 (ADR-004; API-027) *consumes config*
        ↓
[4] PERSISTENCE FOUNDATION    — WP-PLT-02 (ADR-002; enc-at-rest S4)   [precond PC-2]
        ↓
[5] CONTRACT FOUNDATION       — WP-PLT-11 (ADR-005; API-018) + registry↔config contract integration (ENV-INT)
     gate: CP-3 (contract conformance: Q4 provider+consumer tests)
        ↓
[6] PLATFORM VALIDATION       — FO-1/2/3; full QUAL/SEC/DOC + traceability; ASR ratified
     gate: CP-4 (security) · CP-5 (traceability/preservation) · CP-6 (PI-1 exit, Authority Board)
```

> **Sequencing note (registry ↔ persistence ↔ config).** The prescribed order places **Registry
> Foundation** before **Persistence Foundation** per the requested kickoff sequence. Because the registry
> (ADR-004) and config (ADR-005) are PostgreSQL-backed, their **data-plane** activation is gated by PC-2 and
> by persistence substrate availability: registry/config service **contracts and control-plane** may be
> stood up at step [3]/[5], while their **persistent SoR binding** is satisfied once step [4] persistence is
> ready. This preserves both the requested sequence and the ratified dependency (`UCOS-IMP-DEP-001`:
> registry/config depend on execution+persistence substrate). No dependency is bypassed.

---

# SECTION 6 — SECURITY ENFORCEMENT (S1 / S3 / S4 FROM DAY ONE)

**No temporary waivers are permitted (IC-1 / P4 / Const. Art. XII). S1/S3/S4 are enforced from the first
boundary, in every environment, including ENV-DEV.**

| Control | Non-waivable checkpoint | How enforced from day one in PI-1 | Realizing services |
|---------|:-----------------------:|-----------------------------------|--------------------|
| **S1** — AuthN/AuthZ on every exposed boundary | S1 | WI-SEED.3 establishes mTLS **workload identity** + deny-by-default authorization (OPA) before any WP-PLT boundary exists; every foundation boundary (`API-027`/`API-018`) is workload-authenticated and **internal-only** (not externally exposed). Full user/tenant OIDC (PE-08) lands in PI-2 **before** any external exposure. | SEC-CTL-001/002/014; `PRS-031/032`, `PRS-018/019` |
| **S3** — Secrets vault-managed; rotation defined | S3 | WI-SEED.5 provides secrets/keys **by reference** (subset of ADR-006) before persistence/services consume them; **zero** secrets in code/config/IaC; rotation policy defined; CI scans for secret leakage (FO-2). | SEC-CTL-005/006/007; `PRS-035/036/037/038` |
| **S4** — Encryption in transit/at rest; PII classified | S4 | mTLS on every hop (WP-PLT-03, from step [2]); encryption-at-rest with externalized keys (WP-PLT-02, keys from WI-SEED.5); PII classification honored from `UCOS-PDATA-ARCH-001`, never widened. | SEC-CTL-003/008/009/010; `PRS-005/006/010/011` |

**Enforcement invariants:**
- No "dev-exempt" posture: non-waivable controls apply in ENV-DEV/INT identically.
- No boundary is created before its S1/S4 enforcement is in place — WI-SEED.3/WP-PLT-03 precede any exposed
  foundation surface (§5 ordering).
- Any detected secret-in-artifact, unauthenticated boundary, or unencrypted hop is a **hard stop** (§8
  stop-work), not a recorded waiver.
- FO-1 (per-contract threat model for `API-027`/`API-018`), FO-2 (dependency scan), FO-3 (residual re-score)
  are discharged in Platform Validation (step [6]) before CP-4.

---

# SECTION 7 — TRACEABILITY MODEL

**IC-4: 0 orphans.** Every authorized element maps: **Work Package → ADR → Architecture → Contract →
Security Control → Acceptance Criteria.**

| Work Package | ADR | Architecture | Contract | Security Control(s) | Acceptance |
|--------------|-----|--------------|----------|---------------------|------------|
| WP-PLT-01 Runtime | ADR-001 | `PEA-001` PE-01, `PEA-002` PRD/PRS/PEX/PWF | (substrate — no business contract) | SEC-CTL-014 (S1) | X1, X4, X5; §2.4 |
| WP-PLT-03 Networking | ADR-006 | `PEA-001` PE-03 | (substrate — no business contract) | SEC-CTL-008 (S4), 014 (S1), 017 (S5) | X1, X5; §2.4 |
| WP-PLT-02 Persistence | ADR-002 | `PEA-001` PE-02, `UCOS-PDATA-ARCH-001` | (substrate; `DATA-*` reference only) | SEC-CTL-009/010 (S4), 005 (S3) | X1, X5; §2.4 |
| WP-PLT-06 Registry | ADR-004 | `PEA-001` PE-06, `PEA-004` | `API-027` + `EVT-027` + `DATA-027` | SEC-CTL-001/002/014 (S1) | X2, X4–X7; §2.4 |
| WP-PLT-11 Config/Metadata | ADR-005 | `PEA-001` PE-11, `PEA-005/006` | `API-018` + `EVT-018` + `DATA-018` | SEC-CTL-001/002/014 (S1), 005 (S3) | X3, X4–X7; §2.4 |
| WI-SEED.3 Security | ADR-006 | `PEA-007` (design discipline) | (enforcement — no contract) | SEC-CTL-001/002/014 (S1), 008 (S4), 017 | §3 acceptance |
| WI-SEED.5 Secrets&Key | ADR-006 | `PEA-001` PE-08/09 (subset) | (primitive — no contract) | SEC-CTL-005/006/007 (S3), 009 (S4) | §3 acceptance |

Generated matrices (per `UCOS-IMP-MOB-001` §13): `TM-IMP-MOB-001` (WP→PE→ADR→plan), `TM-IMP-MOB-002`
(service→contract→capability→domain), `TM-IMP-MOB-003` (control→checkpoint→`PRS`→WP), `TM-IMP-MOB-004`
(work-item→gate→exit-criterion). Every PI-1 artifact registered bidirectionally in `CTX-REG-001` with gate
status.

---

# SECTION 8 — PHASE 11 GOVERNANCE

Checkpoints enacted from `UCOS-IMP-GOV-001` (no new authority; nothing waived).

## 8.1 Checkpoints CP-0 through CP-6

| CP | Checkpoint | When | Gate criteria | Authority | Type |
|:--:|-----------|------|---------------|-----------|------|
| **CP-0** | PI-1 entry + seed acceptance | Start | PI-0 exit met (lock released); authorization in force (PC-4); seed accepted — repo registered, ENV-DEV/INT reconciled, pipeline builds/signs sample, secrets primitive reachable; PC-3 registration | Implementation Program | Trusted |
| **CP-1** | ASR ratification | Before perf-bound work | PI-1 NFRs ratified via Prompt 02 (PC-1); IC-5 cleared | Authority Board | Approval-Required |
| **CP-2** | Substrate readiness | After [1]/[2] | WP-PLT-01/03 QUAL PASS; SEC **S4** + **S1**(transport) enforced | Platform lead | Trusted |
| **CP-3** | Contract conformance | After [3]/[5] | `API-027`/`API-018` provider+consumer tests PASS (Q4); config↔registry integrated | Platform lead | Trusted |
| **CP-4** | Security | After [6] | `GATE-SEC-001` S1–S7 PASS; **S1/S3/S4** enforced; FO-1/2/3 discharged | Assurance (Prompt 11) | Approval-Required (S1/S3/S4 hard-stop) |
| **CP-5** | Traceability & preservation | After [6] | 0 orphans; all artifacts registered; scoped commits; ledger aligned | Implementation Program | Trusted |
| **CP-6** | PI-1 exit | Close | X1–X10 TRUE; QUAL/SEC/DOC PASS | Authority Board | Approval-Required |
| **CP-R** | Revocation review | Any time | Any `UCOS-ART9-REL-001` §6 / `UCOS-CONSTR-AUTH-001` §6 trigger | Authority Board | Approval-Required |

## 8.2 Escalation Criteria

WP owner → Platform/Stream lead → Implementation Program → Authority Board (terminal). Escalate on: gate
disposition disputes, cross-WP sequencing conflicts, any need to deviate from ratified design
(Approval-Required), and any Approval-Required checkpoint (CP-1/CP-4/CP-6/CP-R).

## 8.3 Stop-Work Criteria (hard stop — construction halts immediately)

1. Any non-waivable **S1/S3/S4** control found waived, bypassed, or unenforced (P4/IC-1).
2. Secret detected in code/config/IaC, unauthenticated boundary, or unencrypted hop (S3/S1/S4).
3. Work outside PI-1 scope, or mutation of a frozen artifact / architecture / ADR (P1/P2).
4. Use of deferred/unratified technology (`ADR-002A`/`PE-12`/`PE-07`) (P3/IC-7).
5. Build against unratified ASR/NFR values (P6/IC-5).
6. Gate bypass, unsigned/unregistered promotion, or ENV-PROD deploy attempt (P5).
7. Broad/unsafe SCM (`git add .`, `reset --hard`, `clean -fd`) (P7/IC-8).
8. Material loss of traceability (IC-4) or preservation discipline (IC-8).

Any stop-work event is recorded append-only and routed to **CP-R** (Authority Board), which may re-impose
the Article IX lock per `UCOS-ART9-REL-001` §6.

---

# SECTION 9 — RISK CONTROL

Risks R-1..R-9 (`UCOS-IMP-MOB-001` §12) reviewed; mitigation ownership confirmed for PI-1.

| ID | Risk | Mitigation (confirmed) | Owner (confirmed) |
|----|------|------------------------|-------------------|
| **R-1** | Build against unratified NFRs (IC-5/P6). | Gate perf-bound work behind Prompt 02 (CP-1/PC-1); functional substrate may proceed. | Architecture & Contracts Lead |
| **R-2** | S1 needed pre-PE-08 identity. | mTLS workload identity (WI-SEED.3/WP-PLT-03) + deny-by-default + internal-only until PI-2 OIDC. | Execution Plane Owner (`PEO-003`) |
| **R-3** | S3 secrets pre-PE-09. | WI-SEED.5 secrets/keys by reference; zero secrets in artifacts; CI scan. | Execution Plane Owner (`PEO-002`) |
| **R-4** | Seed drifts into WP-PLT-14/15 scope. | Bounded seed; registered as *seed*; hardened migration-only in PI-3. | Delivery & Control Owner (`PEO-014`) |
| **R-5** | Event-fabric pull-forward (ADR-003/PE-04, PI-2). | Honor event contract intent only; no broker in PI-1. | Integration Plane Owner (`PEO-006`) |
| **R-6** | Frozen-baseline mutation (P2). | Read-only `architecture/`+`docs/implementation/`; amendment only via ≥1.0.1 + AUTH-012; scoped commits. | Implementation Program |
| **R-7** | Deferred-tech use (P3/IC-7). | PI-1 scope excludes analytics/observability-product/workflow; ADR conformance review per WP. | Platform leads |
| **R-8** | Traceability orphans / unregistered artifacts. | Register at creation in `CTX-REG-001`; per-increment traceability check (0 orphans). | Implementation Program |
| **R-9** | Broad/unsafe SCM (P7/IC-8). | Explicit-path scoped commits; no destructive ops; preserve evidence. | All WP owners |

**Ownership confirmation:** every R-1..R-9 has a named accountable owner aligned to `PEO-001..017`; all
mitigations are active as conditions of this authorization. Readiness preconditions PC-1 (→R-1) and PC-2
(→R-3, via WI-SEED.5) are formally staged in §3/§5/§8.

---

# SECTION 10 — START AUTHORIZATION

> ## PI-1 AUTHORIZED TO COMMENCE
>
> Effective **2026-07-01T00:00:00Z**, PI-1 (Platform Foundation) is **AUTHORIZED TO COMMENCE** construction
> startup: the five construction-seed work items **WI-SEED.1..5** (§3) and the two foundation work packages
> **WP-PLT-01 (Runtime & Compute)** and **WP-PLT-03 (Networking & Connectivity)** (§4), executed per the §5
> sequence, under the §1.5 mandatory controls IC-1..IC-8 and the §6 non-waivable S1/S3/S4 enforcement.

**Justification:**
- The Article IX generation lock is **released** (`UCOS-ART9-REL-001`, 2026-06-30) and the construction
  authorization is **in force** (`UCOS-CONSTR-AUTH-001`); PC-4 satisfied.
- The Phase 11.1 readiness assessment returned **READY — WITH PRECONDITIONS** with **0 blocking findings**;
  all 10 criteria PASS.
- All preconditions are staged, not blocking: **PC-1** (ASR) gates only performance-bound work at CP-1;
  **PC-2** (secrets/key primitive) is formalized as **WI-SEED.5** and sequenced before dependent steps;
  **PC-3** (registration) and **PC-4** (standing) are entry conditions at CP-0.
- Scope is fully within authorized A1–A8; no deferred ADR, no unratified technology, no frozen-artifact
  change; contract-first; non-waivable S1/S3/S4 enforced from day one.

**Conditions of authorization:** WP-PLT-02/11/06 remain **staged** (authorized at their §5 gates); no
ENV-PROD promotion; any §8.3 stop-work event halts construction and routes to CP-R. This authorization is
valid only while the parent authorization and lock release stand.

---

## Confirmations (scope discipline)
- **Planning & authorization only — no implementation code; no service implementation.** ✅
- **No architecture changes; no ADR changes.** ✅
- **No registry mutation; no state mutation.** ✅
- **Non-waivable S1/S3/S4 enforced from day one; no temporary waivers.** ✅
- **Authoritative execution baseline for PI-1; formal governance→construction handoff.** ✅

## Validation (self-check)

| Check | Target | Observed | Result |
|-------|:------:|:--------:|:------:|
| All 10 required sections present | 10 | 10 | ✅ |
| IC-1..IC-8 binding statement | yes | §1.5 | ✅ |
| Seed WI-SEED.1..5 fully specified (obj/deliv/deps/controls/trace/acceptance) | 5 | 5 | ✅ |
| WP-PLT-01/03 authorized with precond/inputs/outputs/deps/risks/controls | 2 | 2 | ✅ |
| Exact implementation sequence (seed→…→validation) | yes | §5 | ✅ |
| S1/S3/S4 day-one enforcement, no waivers | yes | §6 | ✅ |
| Traceability WP→ADR→Arch→Contract→Control→Acceptance | yes | §7 | ✅ |
| CP-0..CP-6 + escalation + stop-work | yes | §8 | ✅ |
| R-1..R-9 reviewed with owners | 9 | 9 | ✅ |
| Start authorization stated | 1 | AUTHORIZED | ✅ |
| Code / infra / arch / ADR / registry / state mutation | 0 | 0 | ✅ |

## Traceability
- **Refines:** `UCOS-IMP-MOB-001`, `UCOS-IMP-RDY-PI1-001`, `UCOS-CONSTR-AUTH-001`, `UCOS-ART9-REL-001`,
  `UCOS-IMP-PI-001` (PI-1), `UCOS-IMP-WPS-001`, `UCOS-IMP-DEP-001`, `UCOS-IMP-DELIV-001`, `UCOS-IMP-GOV-001`,
  `UCOS-PLAT-ADR-001/002/004/005/006/007`, `UCOS-PEA-001..007`, `UCOS-CONTRACT-CAT-001`,
  `UCOS-SEC-CONTROL-001`, `UCOS-CONST-001` (Art. IX/XII), `AUTH-008/009/010/012`.
- **Refined by:** PI-1 execution (Prompt 10) upon seed completion + precondition satisfaction; PI-1
  validation (Prompt 11); PI-1 exit (CP-6).
- **Generates:** `TM-IMP-MOB-001..004` population during execution.
- **Owner:** Implementation Program (subordinate to Authority Board).

**END UCOS-PHASE-11.2-PI1-CONSTRUCTION-KICKOFF — PI-1 AUTHORIZED TO COMMENCE · SEED WI-SEED.1..5 + WP-PLT-01/03 AUTHORIZED · S1/S3/S4 ENFORCED FROM DAY ONE · NO WAIVERS · CONTRACT-FIRST · NO SCOPE/TECH/BASELINE CHANGE · PLANNING & AUTHORIZATION ONLY · EFFECTIVE 2026-07-01.**
