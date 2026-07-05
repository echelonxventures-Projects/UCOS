# UCOS — Minimal Agent Startup Context

> **GENERATED — DO NOT EDIT.** Produced by `pnpm ucos:context`. This file is the ONLY
> startup context an agent needs. Do NOT re-audit the repository, reconstruct the
> roadmap, or re-derive governance — consume this, then act. Source of truth:
> `registry/program/*.json`.

**Program:** UCOS Omega-Infinity (Program Layer v1.0.0)
**Computed:** 2026-07-05T08:58:26.941Z

## Where the program is
- Phase: **PHASE-P.1 — Constitutional Program Compiler & Autonomous Execution Governor** (IN_PROGRESS)
- Completion: **36.4%** (16/44 complete; 1 ready, 14 blocked)
- Governance verdict: **NO_GO** · Article IX: **ACTIVE** · Construction blocked: **YES**

## Do this next (system-resolved — do not choose your own)

### ➡️ CAP-RECON — Reconcile compiler-invisible implemented fabrics (Observability/Readiness/Proof) into the registry with authored evidence + AD reconciliation
- **Type:** governance · **Phase:** PHASE-X.1 Capability Universe · **Owner:** Platform Governance
- **Dependencies (all COMPLETE):** PI-4
- **Acceptance criteria:**
  - author validation/audit evidence for CAP-OPS/CAP-RDY/CAP-PROOF (advance IMP evidence to VERIFIED)
  - reconcile authorizing scoped Article IX release(s) for operations/readiness on the AUTH-012 ledger
  - register any residual operability gaps
- **Required evidence:** EV-CAP-RECON
- **Governance gates:** GATE-DOC-001
- **Constitutional constraints:** Documentation/governance only (no implementation); No independent-attestation requirement (GATE-DOC-001)

Before starting, confirm authorization: `pnpm ucos:authorize CAP-RECON`

## Hard blockers to be aware of
- **GAP-PROMPT-05** (HIGH): Prompt-05 Payload Authoring: field-level schemas for ConfigurationValue, MetadataRecord, FeatureFlag, RegistryArtifact, DiscoveryRecord not yet authored.
- **GAP-PROMPT-08** (HIGH): Prompt-08 Operation-Payload Binding: operations not yet bound to authored payloads.
- **GAP-ACT-06** (HIGH): ACT-06 ENV-DEV/INT provisioning evidence (G12-1) not captured; requires governed human-executed provisioning act.
- **GAP-ACT-07** (HIGH): ACT-07 pipeline execution evidence (G12-2) not captured.
- **GAP-ACT-12** (HIGH): ACT-12 Operational Certification not issued; system remains CONDITIONALLY CERTIFIED.
- **GAP-ATTEST** (HIGH): PI-8/PI-9 ratifications are self-attested; independent attestation (REAL-C-05) outstanding.
- **GAP-CAP-OPS-GOV** (CRITICAL): UCAP-26/30 Observability & Operations Fabric is IMPLEMENTED + TESTED (control/operations, 356-test baseline) but was compiler-invisible. Registered as CAP-OPS (IN_PROGRESS); evidence reconciliation pending (CAP-RECON).
- **GAP-CAP-RDY-GOV** (CRITICAL): UCAP-31 Readiness/Certification/Meta-Governance Fabric IMPLEMENTED (control/readiness) but compiler-invisible; verification via harness only. Registered as CAP-RDY (IN_PROGRESS).
- **GAP-CAP-PROOF-GOV** (HIGH): UCAP-32 Proof Fabric IMPLEMENTED within control/operations but compiler-invisible. Registered as CAP-PROOF (BLOCKED on CAP-OPS).
- **GAP-CAP-RECON** (HIGH): Implemented-invisible operability fabrics require authored validation/audit evidence + authorizing scoped-release reconciliation. Software-solvable (GATE-DOC-001). Registered as CAP-RECON (READY; next executable item).
- **GAP-CAP-ECON** (HIGH): UCAP-14 Economic Engine ARCHITECTED (ECON-*) with no work item. Registered as CAP-ECON (EXTERNAL_BLOCKED; scoped release required).
- **GAP-CAP-UI** (HIGH): UCAP-25 Universal UI Fabric ARCHITECTED (EXP-*, ratified) but apps/ empty and no work item. Registered as CAP-UI (BLOCKED on CAP-API).

## External blockers (NOT software-solvable — do not try to close these)
These require a governed action by an external actor. Software/agents cannot close them.

- **EXT-REAL-C-05 → REAL-C-05** — 🛑 DO NOT REINVESTIGATE
  - Why external: Independent attestation (proposer != attestor) of the self-attested PI-8/PI-9 ratifications, the retroactive AD-0016.
  - Required actor: UCOS Authority Board (designation) + a distinct Independent Adjudicator (attestation), custodian: Chief Authority Architect
  - Required action: G1 designate a distinct-actor Independent Adjudicator (not in authoring/construction chain) -> G2 enroll adjudicator key (KMS-backed, disjoint custody) -> G3 produce and verify genesis independent attestation -> durable AUTH-012 enrollment. G4 dual-witness applies at terminal/Operational certification.
  - Blocks: REAL-C-05, PI-8, PI-9
  - Re-open only when: ANY watched evidence advances beyond its baseline state, OR a new independent adjudicator designation, registered adjudicator key, genesis attestation, or AUTH-012 Board authority action is recorded.
  - Last reviewed: 2026-07-03 (PHASE-G.1)
- **EXT-REAL-C-03 → REAL-C-03** — 🛑 DO NOT REINVESTIGATE
  - Why external: Operational Evidence Closure requires apply-time evidence (G12-1 environment provisioning, G12-2 delivery-pipeline promotion, G12-3 DR drill with measured RPO/RTO, immutable audit trail + availability/p99 metrics) and issuance of Operational Certification.
  - Required actor: Operations (human-executed under AD-0009) + Certification Authority
  - Required action: Provision ENV-DEV/ENV-INT with live apply logs (ACT-06); bind CI runner and execute the delivery pipeline (ACT-07); run contract tests (ACT-08); execute backup/restore + DR drill (ACT-09); capture immutable audit trail + availability metrics (ACT-10); issue Operational Certification (ACT-12).
  - Blocks: ACT-06, ACT-07, ACT-08, ACT-09, ACT-10, ACT-12
  - Re-open only when: ANY watched operational-evidence item advances beyond PENDING (i.e., real apply/pipeline/DR/audit evidence is captured) or Operational Certification is issued.
  - Last reviewed: 2026-07-03 (PHASE-G.2)
- **EXT-REAL-C-04 → REAL-C-04** — 🛑 DO NOT REINVESTIGATE
  - Why external: Design-Only Fabric Implementation Closure requires PI-10 (Intelligence) construction under a scoped Article IX release AD-0024 that has NOT been issued, plus independent PI-10/PI-11 ratification.
  - Required actor: UCOS Authority Board (AD-0024 issuance) + Independent Adjudicator (PI-10/PI-11 ratification)
  - Required action: Issue scoped Article IX release AD-0024 for PI-10 -> construct PI-10 additively (propose-not-act, I1..I12 adversarial 0 residual High/High) -> construct PI-11 under AD-0022 conditional -> independent ratification of PI-10/PI-11.
  - Blocks: PI-10
  - Re-open only when: AD-0024 scoped Article IX release is issued by the Authority Board (EV-PI10-AUTH advances beyond PENDING).
  - Last reviewed: 2026-07-03 (PHASE-G.2)
- **EXT-CAP-AUTH → CAP-C-01** — 🛑 DO NOT REINVESTIGATE
  - Why external: The design-only capabilities discovered in PHASE X.
  - Required actor: UCOS Authority Board (per-capability scoped Article IX release); custodian: Chief Authority Architect
  - Required action: For each design-only capability: architect (where unmodeled) -> issue a scoped Article IX release on the AUTH-012 ledger -> construct additively (propose-not-act; Evolution-only commit; S1/S3/S4; adversarial 0 residual High/High; baseline preserved) -> independent ratification.
  - Blocks: CAP-ECON, CAP-RES, CAP-WORKFLOW, CAP-EVENT, CAP-API, CAP-UI, CAP-AUTON, CAP-ECOSYS, CAP-INFRA, CAP-LEARN, CAP-CIV, CAP-REALITY
  - Re-open only when: ANY watched capability-authorization evidence advances beyond PENDING (a scoped Article IX release or architecture authorization is recorded).
  - Last reviewed: 2026-07-03 (PHASE-X.1)

> ⚠️ **EXTERNAL_BLOCKED items:** PI-8, PI-9, ACT-06, REAL-C-05, CAP-ECON, CAP-WORKFLOW, CAP-EVENT, CAP-API, CAP-ECOSYS. These are NOT executable by an agent; do not select them as next work and do not re-audit them without a review trigger.

## Constitutional locks
| Lock | Closure | State | Verdict | Releasable by software |
|------|---------|-------|---------|------------------------|
| LOCK-REAL-C-05 | REAL-C-05 | EXTERNAL_LOCKED | NO_GO | NO |
| LOCK-REAL-C-03 | REAL-C-03 | EXTERNAL_LOCKED | NO_GO | NO |
| LOCK-REAL-C-04 | REAL-C-04 | EXTERNAL_LOCKED | NO_GO | NO |
| LOCK-CAP-C-01 | CAP-C-01 | EXTERNAL_LOCKED | NO_GO | NO |

## Integrity warnings
- ⚠️ 2 evidence inconsistency(ies): PI-8, PI-9.
- ⚠️ 9 item(s) EXTERNAL_BLOCKED (require an external actor; not software-solvable): PI-8, PI-9, ACT-06, REAL-C-05, CAP-ECON, CAP-WORKFLOW, CAP-EVENT, CAP-API, CAP-ECOSYS.

## Rules of engagement
- The system decides the next step; do not deviate to un-ready or unregistered work.
- Do not mark work COMPLETE without VERIFIED/CERTIFIED evidence (evidence-based completion).
- EXTERNAL_BLOCKED items require an external actor and are NOT software-solvable — do not attempt to close them or re-investigate them without a review trigger (rediscovery prevention).
- Article IX / AD-0014 limits stand; construction of locked scope requires a governed release act.
- To add work, append to `registry/program/*.json` and recompile — never hardcode.
