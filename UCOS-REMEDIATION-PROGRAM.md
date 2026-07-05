# UCOS Ω∞ — MASTER REMEDIATION PROGRAM (PHASE R.1)

> Companion to `UCOS-MASTER-RATIFICATION-REPORT.md` (`UCOS-MASTER-RAT-001`),
> `UCOS-GAP-ANALYSIS.md` (`UCOS-GAP-MASTER-001`), `UCOS-RISK-REGISTER.md` (`UCOS-RISK-MASTER-001`).
> **REMEDIATION PLANNING SYNTHESIS ONLY · NO CODE · NO LOCK RELEASE · NO MUTATION · NO NEW RATIFICATION.**
> This program converts the ratified gap/risk corpus into an executable, dependency-ordered backlog.
> It authorizes nothing by itself; each item remains Approval-Required / Board-owned.

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-REM-PROG-001` |
| Phase | **R.1 — Remediation Program Construction** |
| Date | 2026-07-03 |
| Inputs | `UCOS-GAP-MASTER-001` (21 gaps), `UCOS-RISK-MASTER-001` (12 risks), `UCOS-MASTER-RAT-001` (determination + C-A..C-J) |
| Method | Per-gap categorization → severity → executability profile → closure/dependency/validation criteria → wave assignment → dependency graph → critical path → earliest-GO path → revised determination |
| Discipline | Fail-closed · non-optimistic · absence of evidence is an open item, not a pending pass · self-attested until `REAL-C-05` closes |
| Subordinate to | `AUTH-001..012`, `UCOS-CONST-001` v1.0.1, `UCOS-ASR-NFR-001` v1.0.1 (INV-1..13), Governance Baseline 1.0.0 (FROZEN), `AD-0014`, `UCOS-CONSTRUCTION-BLOCKED` |
| Owner | UCOS Authority Board (custodian: Chief Authority Architect) |

---

## SECTION 0 — HOW TO READ THIS PROGRAM

Every gap `G-*` from `UCOS-GAP-MASTER-001` becomes a remediation work item `REM-*`. Each item is profiled
across the mandated dimensions, then assigned to one of five execution waves (A–E). The five CRITICAL gaps
and the DECISIVE self-attestation risk (`RK-1`) drive the critical path.

**Categories** (per item): `Engineering` · `Governance` · `Evidence` · `Certification` · `Documentation`.
**Severity**: `Critical` · `High` · `Medium` · `Low` (inherited from `UCOS-GAP-MASTER-001`).

**Executability profile** — four boolean determinations per item:
- **Implementable?** — can UCOS close it with its own governed work (design/code/act), no external gate?
- **External actor?** — does closure require an actor outside the self-attesting program (independent
  adjudicator, human real-spend approver, patent counsel)?
- **Operational evidence?** — does closure require provisioned environments + measured runtime data?
- **Certification?** — does closure require issuing/re-issuing a certification instrument?

**One governing fact (from `UCOS-MASTER-RAT-001` §0):** every "closed" verdict below is self-attested until
`REM-01`/`REAL-C-05` (independent adjudication) is enacted. `REM-01` is therefore the universal predecessor.

---

## SECTION 1 — REMEDIATION BACKLOG (per-gap specification)

### 1.1 CRITICAL items

---

#### REM-01 ← G-C1 · Enact independent adjudication (`REAL-C-05`)
| Dimension | Determination |
|-----------|---------------|
| Category | **Governance** (attestation foundation) |
| Severity | **Critical** |
| Implementable? | **Partial** — mechanism fully designed (IRQ/SoD/COI/ATT/SIG/LIFE/REV/WIT); enactment requires an external actor |
| External actor? | **YES** — independent adjudicator with custodially-separate signing key |
| Operational evidence? | No |
| Certification? | No (it is the *precondition* that makes all certification defensible) |
| Closure criteria | (1) Board-record independent-actor designation AD; (2) register custodially-separate key by-reference; (3) place ≥1 signed attestation over evidence hashes on the chain (`REAL-C-05` G1–G4 CLOSED). |
| Dependencies | None (root of the graph). Enabled-by `REM-04` durability so attested hashes are stable. |
| Validation criteria | Attestation chain verifies: signature valid against registered key; key is custodially separate (COI clean); ≥1 attestation present; G1–G4 marked CLOSED in `CONST-READY-001` §2.5. |
| Closes risk | **RK-1 (Critical, top residual)** — the multiplier on every verdict. |
| Maps to condition | **C-A** |
| Wave | **A** |

---

#### REM-02 ← G-C2 · Produce operational evidence (`G12-1/2/3` + DR)
| Dimension | Determination |
|-----------|---------------|
| Category | **Evidence** (Engineering-operational) |
| Severity | **Critical** |
| Implementable? | **Yes** — provision + execute is within program capability |
| External actor? | **YES** — human real-spend approval (AD-0015 + AD-0009) to provision paid environments |
| Operational evidence? | **YES** — this item *is* the operational-evidence producer |
| Certification? | Feeds Operational Certification (`REM-15`), not itself |
| Closure criteria | Provision ENV-DEV/INT; execute CI/CD pipeline; run DR drill; capture **measured** RPO/RTO/p99/availability against `UCOS-ASR-NFR-001` §3 floors (AC-1..4, T1..T4). Operational readiness moves from ≈35% to evidence-complete. |
| Dependencies | `REM-11` (PE-12 observability ADR, to make metrics capturable); `REM-04` (durable corpus); real-spend approval; benefits from `REM-01`. |
| Validation criteria | Every §3 floor has a measured value ≥ floor; DR drill meets RPO/RTO; pipeline green; artifacts hash-logged and (post-`REM-01`) independently attested. |
| Closes risk | **RK-2 (High)** operational unknowns; contributes to **RK-3**. |
| Maps to condition | **C-F** |
| Wave | **D** |

---

#### REM-03 ← G-C3 · Re-issue terminal certification (`UCOM-ULTIMATE-CERT-002`)
| Dimension | Determination |
|-----------|---------------|
| Category | **Certification** |
| Severity | **Critical** |
| Implementable? | **Yes** — re-issue instrument against canonical state |
| External actor? | **YES (for defensibility)** — should be independently attested under `REM-01` |
| Operational evidence? | No (re-issues against the reproduced 269/269 state; operational cert is separate = `REM-15`) |
| Certification? | **YES** — this is a certification-instrument re-issue |
| Closure criteria | Issue `UCOM-ULTIMATE-CERT-002` against the 269/269 canonical state (`REAL-C-01` RC-1..RC-5); retire stale R14 (`UCOM-ULTIMATE-CERT-001`: 134/134, chain "DEFECTIVE", Memory "REJECTED"); record R13/R14 governing ruling in AUTH-012. |
| Dependencies | `REM-05` (re-attested chain + PI-8/PI-9), `REM-01`. |
| Validation criteria | Instrument cites 269/269 + restored chain + `MEM-RAT-003`; no superseded facts remain; AUTH-012 records the ruling append-only; attestation attached. |
| Closes risk | Removes stale-instrument exposure feeding **RK-3**. |
| Maps to condition | **C-C** |
| Wave | **B** (governance/cert re-issue) → finalized alongside **E** |

---

#### REM-04 ← G-H2 (elevated) · Corpus durability (`REAL-M-07`)
> Listed under CRITICAL execution because it is the cheapest, earliest hard-blocker: the authorization
> ledger a release depends on is not durable. Severity in `UCOS-GAP-MASTER-001` = HIGH (G-H2); execution
> priority = Wave A.

| Dimension | Determination |
|-----------|---------------|
| Category | **Documentation** (corpus/ledger durability) |
| Severity | **High** (execution-critical) |
| Implementable? | **Yes — immediately, no gate** |
| External actor? | No |
| Operational evidence? | No |
| Certification? | No |
| Closure criteria | Execute `REAL-M-07`: commit + push + tag the 151 uncommitted files (incl. AD-0016..0023 authorization corpus + U-phase artifacts) before any real-spend act. |
| Dependencies | None. Predecessor to `REM-01` (stable hashes to attest) and every real-spend act. |
| Validation criteria | `git status` clean; milestone tag present at `origin`; AD corpus retrievable at a pinned commit; hash manifest recorded. |
| Closes risk | **RK-4 (High)** corpus non-durability. |
| Maps to condition | **C-D** |
| Wave | **A** |

---

#### REM-05 ← G-H1 · Re-attest restored authority chain + PI-8/PI-9
| Dimension | Determination |
|-----------|---------------|
| Category | **Governance** (attestation) |
| Severity | **High** |
| Implementable? | **Partial** — requires the independent actor from `REM-01` |
| External actor? | **YES** — independent re-attestation |
| Operational evidence? | No |
| Certification? | Feeds `REM-03` |
| Closure criteria | Under `REM-01`, independently re-attest `AUTH-REST-004` (AD-0016..0023 enrollment, AUTH-012 v1.0.13), `ONTO-RAT-001` (PI-8), `MEM-RAT-003` (PI-9) — closing the RIA (`REAL-M-03` T-04/T-05/T-14; `REAL-C-01` D-7/D-8). |
| Dependencies | `REM-01`, `REM-04`. |
| Validation criteria | Signed attestations exist for the chain restoration and each of PI-8/PI-9; RIA markers cleared; recorded in AUTH-012 append-only. |
| Closes risk | Reduces **RK-1** residual on the authority-chain restoration. |
| Maps to condition | **C-B** |
| Wave | **A** |

---

#### REM-06 ← G-C4 · Construct the product layer (per-increment, behind 85 contracts)
| Dimension | Determination |
|-----------|---------------|
| Category | **Engineering** |
| Severity | **Critical** |
| Implementable? | **Yes** — but large; per-increment construction (`REAL-C-04`) |
| External actor? | **YES (for ratification)** — independent ratification per increment |
| Operational evidence? | **YES** — each increment demonstrated on provisioned env |
| Certification? | Per-increment ratification; rolls into ULTIMATE cert |
| Closure criteria | Post-lock-release, construct the 28 domains + platform/domain services + experience surfaces behind the 85 ratified contracts; each increment independently ratified; `apps/`/`services/` carry running product. |
| Dependencies | `REM-16` (Article IX release), the 85 contracts (ratified), `REM-08` (contract-test execution), `REM-01`. |
| Validation criteria | Each increment: contract-conformance PASS, adversarial suite PASS, independent ratification, operational evidence on env. |
| Closes risk | Addresses **RK-8** (scope-creep discipline via dependency-gating). |
| Maps to condition | **C-H** (product portion) |
| Wave | **C** |

---

#### REM-07 ← G-C5 · Article IX generation-lock release
| Dimension | Determination |
|-----------|---------------|
| Category | **Governance** (terminal authorization) |
| Severity | **Critical** |
| Implementable? | **Yes** — a governed Board act |
| External actor? | **YES** — Authority Board act + independent attestation |
| Operational evidence? | **YES (as predecessor)** — operational cert must exist first |
| Certification? | **YES** — gated on Operational Certification |
| Closure criteria | Execute `UCOS-ARTICLE-IX-LOCK-RELEASE` + `UCOS-CONSTRUCTION-AUTHORIZATION` (UCC-5) — the only act that lifts `UCOS-CONSTRUCTION-BLOCKED`. |
| Dependencies | `REM-01`, `REM-03`, `REM-05`, `REM-02`, `REM-15` (operational cert) — i.e. all of Waves A–D. |
| Validation criteria | Lock state = RELEASED in AUTH-012; predecessor conditions C-A..C-G verifiably CLOSED; act independently attested. |
| Closes risk | Retires **RK-3** (release-without-proof) by construction (release *follows* proof). |
| Maps to condition | **C-I** |
| Wave | **E** |

---

### 1.2 HIGH items

---

#### REM-08 ← G-H4 · Execute contract tests (85 contracts + API-018/API-027)
| Dimension | Determination |
|-----------|---------------|
| Category | **Evidence** (Engineering) |
| Severity | **High** |
| Implementable? | **Yes** |
| External actor? | No (CI-driven) |
| Operational evidence? | **YES** — runtime conformance execution |
| Certification? | Feeds G12-2 / Operational Certification |
| Closure criteria | Execute provider/consumer/compatibility suites in CI at G12-2 (`UCOS-SVC-CTEST-001`); resolve any contract drift found. |
| Dependencies | `REM-02` (environments), `REM-11` (observability for capture). |
| Validation criteria | 85/85 contracts + API-018/API-027 conformance PASS in CI; results hash-logged; G12-2 CLOSED. |
| Closes risk | **RK-10 (Med)** contract drift undetected. |
| Maps to condition | **C-F** (contract-test portion) |
| Wave | **D** |

---

#### REM-09 ← G-H5 · Verify live security enforcement (mTLS STRICT, deny-by-default)
| Dimension | Determination |
|-----------|---------------|
| Category | **Evidence** (Security-operational) |
| Severity | **High** |
| Implementable? | **Yes** |
| External actor? | No |
| Operational evidence? | **YES** — verified on provisioned environment |
| Certification? | Feeds G12-1 / Operational Certification |
| Closure criteria | On ENV-DEV/INT, verify mTLS STRICT and deny-by-default authz behavior against `SEC-CTL-001..020` and non-waivable S1/S3/S4 (G12-1; `OP-CERT-001` Track 2). |
| Dependencies | `REM-02`, `REM-13` (mesh allow-rules populated). |
| Validation criteria | mTLS STRICT observed on all mesh edges; unauthorized calls denied by default; S1/S3/S4 demonstrated; G12-1 CLOSED. |
| Closes risk | Contributes to **RK-2**; hardens against **RK-5/RK-6** operational exposure. |
| Maps to condition | **C-F** (security portion) |
| Wave | **D** |

---

#### REM-10 ← G-H3 · Universal audit/provenance (`AUDIT-UNIV-001` + `PROOF-IMPL-001`)
| Dimension | Determination |
|-----------|---------------|
| Category | **Engineering** |
| Severity | **High** |
| Implementable? | **Yes** — design-only today; build the primitive + proof fabric |
| External actor? | No (`PROOF-IMPL-001` provides internal independent-proof capability) |
| Operational evidence? | **YES (to validate composition)** |
| Certification? | Independent ratification of the new primitive |
| Closure criteria | Introduce universal `AUDIT-UNIV-001` audit/provenance primitive + `PROOF-IMPL-001` proof fabric; retire the 6 per-fabric audit clones so integrity composes and hardening applies once. |
| Dependencies | `REM-16` (construction authorized for new fabric), `REM-01`. |
| Validation criteria | Single audit chain across all fabrics; corruption detected once (not 6×); hardening applied once; adversarial suite PASS; independently ratified. |
| Closes risk | **RK-5 (High)** integrity does not compose. |
| Maps to condition | Supports **C-H** |
| Wave | **C** |

---

#### REM-11 ← G-M3 (PE-12 portion, elevated) · Decide PE-12 observability ADR
> `UCOS-GAP-MASTER-001` scores this MEDIUM (G-M3); it is on the operational-evidence critical path because
> PE-12 gates G12-3 metric capture. Execution priority = Wave B (before `REM-02`).

| Dimension | Determination |
|-----------|---------------|
| Category | **Governance** (ADR sub-decision) |
| Severity | **Medium** (path-critical) |
| Implementable? | **Yes** |
| External actor? | No |
| Operational evidence? | No (it *enables* evidence capture) |
| Certification? | No |
| Closure criteria | Record governed PE-12 observability ADR (UCC-6); resolve ADR-002A analytical store + PE-07 workflow engine sub-decisions as needed. |
| Dependencies | None hard; do before `REM-02`/`REM-08`. |
| Validation criteria | PE-12 ADR ratified; G12-3 metrics are capturable; ADR recorded append-only. |
| Closes risk | **RK-9 (Med)** deferred sub-decisions blocking later PIs. |
| Maps to condition | **C-E** |
| Wave | **B** |

---

#### REM-12 ← G-H6 · Implement IP / novelty / patent-readiness governance
| Dimension | Determination |
|-----------|---------------|
| Category | **Governance** |
| Severity | **High** |
| Implementable? | **Partial** — governance implementable; patent filing needs external actor |
| External actor? | **YES** — patent counsel / IP office for filings |
| Operational evidence? | No |
| Certification? | Independent ratification of the governance |
| Closure criteria | Implement `IP-*`/`NVF-*` governance (patent lifecycle, prior-art, novelty verification, disclosure-before-publication gates) as governed evolution; interim manual pre-publication IP review in force meanwhile. |
| Dependencies | `REM-16` (post-foundation construction), `REM-01`. |
| Validation criteria | Disclosure gates precede publication; novelty verification operative; independently ratified; no premature disclosure recorded. |
| Closes risk | **RK-11 (Med)** IP forfeiture / premature disclosure. |
| Maps to condition | Supports **C-H** (research/IP scope) |
| Wave | **C** |

---

### 1.3 MEDIUM items

---

#### REM-13 ← G-M1 · Enroll `INV-CORE-01..14` runtime-integrity invariants
| Dimension | Determination |
|-----------|---------------|
| Category | **Governance** |
| Severity | **Medium** |
| Implementable? | **Yes** — Constitutional-Majority enrollment act |
| External actor? | **YES (attestation)** under `REM-01` |
| Operational evidence? | No |
| Certification? | No |
| Closure criteria | AUTH-012 Constitutional-Majority enrollment of `INV-CORE-01..14` (`UA-05`; `CONST-READY-001` REAL-H-02) so never-violate runtime guarantees are constitutionally binding. |
| Dependencies | `REM-01`, `REM-04`. |
| Validation criteria | INV-CORE set enrolled in AUTH-012 append-only; enforcement wired at runtime; enrollment attested. |
| Closes risk | Hardens against **RK-6** (fragile/anti-fragile) runtime-integrity floor. |
| Maps to condition | Governance closure feeding **C-H**/**C-J** |
| Wave | **B** |

---

#### REM-14 ← G-M2 · Construct PI-10 Intelligence (AD-0024) + PI-11 Simulation (AD-0022)
| Dimension | Determination |
|-----------|---------------|
| Category | **Engineering** |
| Severity | **Medium** |
| Implementable? | **Yes** — under scoped authorizations |
| External actor? | **YES (ratification)** per increment |
| Operational evidence? | **YES** — adversarial suites + env |
| Certification? | Independent ratification per fabric |
| Closure criteria | Construct PI-10 (source/behavioral intelligence) under AD-0024 and PI-11 (what-if simulation) under standing AD-0022, each with adversarial suites and independent ratification. |
| Dependencies | `REM-16`, `REM-10` (universal audit), `REM-06` (product substrate), `REM-01`. |
| Validation criteria | Each fabric: functional acceptance, adversarial PASS, operational evidence, independent ratification. |
| Closes risk | Bounds **RK-8** (scope-creep) via dependency-gated construction. |
| Maps to condition | **C-H** (upper-fabric portion) |
| Wave | **C** |

---

#### REM-15 ← (new, from `OP-CERT-001` / C-G) · Issue Operational Certification
> Not a distinct gap ID but the mandatory certification act that consumes Wave-D evidence; called out
> explicitly by `UCOS-MASTER-RAT-001` §5 C-G and `OP-CERT-001` (9 tracks, currently 5 FAIL).

| Dimension | Determination |
|-----------|---------------|
| Category | **Certification** |
| Severity | **Critical (path)** |
| Implementable? | **Yes** — once evidence exists |
| External actor? | **YES** — independent attestation |
| Operational evidence? | **YES** — consumes `REM-02`/`REM-08`/`REM-09` |
| Certification? | **YES** |
| Closure criteria | Issue Operational Certification superseding the Phase 12.0 PENDING verdict (UCC-4); close `OP-CERT-001` Tracks (bring 5 FAIL → PASS). |
| Dependencies | `REM-02`, `REM-08`, `REM-09` (all Wave D). |
| Validation criteria | All 9 `OP-CERT-001` tracks PASS/closed; measured NFRs meet floors; instrument attested. |
| Closes risk | Retires the operational half of **RK-2/RK-3**. |
| Maps to condition | **C-G** |
| Wave | **E** |

---

#### REM-16 ← G-M4 · Implement Research Fabric (`RPF-*`) + publication governance
| Dimension | Determination |
|-----------|---------------|
| Category | **Engineering** (+ Governance) |
| Severity | **Medium** |
| Implementable? | **Yes** — governed evolution post-foundation |
| External actor? | Partial — journals/academic actors for publication |
| Operational evidence? | Some |
| Certification? | Independent ratification |
| Closure criteria | Implement `RPF-0001..0005` (research constitution, topic registry, journal strategy, publication governance, academic roadmap) as governed evolution post-foundation. |
| Dependencies | Article IX release, `REM-12` (IP disclosure gates precede publication). |
| Validation criteria | Research fabric running; publication governed by disclosure gates; independently ratified. |
| Closes risk | Bounds **RK-11/RK-12** (disclosure + scope drift). |
| Maps to condition | **C-H** (research portion) |
| Wave | **C** |

---

#### REM-17 ← G-M5 · Reconcile documentary divergence (suite-count 36 vs 40; stale header)
| Dimension | Determination |
|-----------|---------------|
| Category | **Documentation** |
| Severity | **Medium** |
| Implementable? | **Yes — immediately** |
| External actor? | No |
| Operational evidence? | No |
| Certification? | No |
| Closure criteria | Re-measure suite count; append reconciliation note (269 pass count undisputed); correct stale `PROJECT-STATE` header/§0W (`REAL-M-03` X-5/X-6). |
| Dependencies | None. |
| Validation criteria | Suite count reconciled + noted append-only; PROJECT-STATE header matches canonical state. |
| Closes risk | Minor; removes documentary ambiguity noise. |
| Maps to condition | Documentary closure (authorized now, C-A..C-E band) |
| Wave | **B** |

---

### 1.4 LOW items

---

#### REM-18 ← G-L1 · Author CAP-01..14 quantitative attributes (Prompt 02, TO N-1)
| Dimension | Determination |
|-----------|---------------|
| Category | **Documentation** |
| Severity | **Low** |
| Implementable? | **Yes** |
| External actor? | No |
| Operational evidence? | No |
| Certification? | No |
| Closure criteria | Author CAP-01..14 quantitative attributes at next Prompt 02 touch; clear standing Trusted Operation N-1. |
| Dependencies | None. |
| Validation criteria | Attributes authored; N-1 cleared in `PROJECT-STATE` §8. |
| Closes risk | Non-blocking residual. |
| Maps to condition | Documentary closure |
| Wave | **B** |

---

#### REM-19 ← G-L2 · Author canonical "Party" glossary term (Prompt 03)
| Dimension | Determination |
|-----------|---------------|
| Category | **Documentation** |
| Severity | **Low** |
| Implementable? | **Yes** |
| External actor? | No |
| Operational evidence? | No |
| Certification? | No |
| Closure criteria | Author canonical "Party" term at next Prompt 03 touch. |
| Dependencies | None. |
| Validation criteria | Term present in glossary canon (`AUTH-011`/`UCOS-GLOSSARY`). |
| Closes risk | Non-blocking residual. |
| Maps to condition | Documentary closure |
| Wave | **B** |

---

#### REM-20 ← G-L3 · Wire durable persistence adapters
| Dimension | Determination |
|-----------|---------------|
| Category | **Engineering** |
| Severity | **Low** |
| Implementable? | **Yes** — additive behind existing ports |
| External actor? | No |
| Operational evidence? | **YES** — crash-recovery demonstrated |
| Certification? | No |
| Closure criteria | Wire durable adapters behind existing ports (`AF-F-4`; `ARCH-GAP-001` M4) so crash ≠ state loss; additive only. |
| Dependencies | `REM-16`/construction authorized; predecessor to full operational confidence. |
| Validation criteria | Restart preserves state; crash-recovery drill PASS. |
| Closes risk | **RK-6** (in-memory durability fragility). |
| Maps to condition | Supports **C-F/C-H** |
| Wave | **C** |

---

#### REM-21 ← G-L4 · Populate mesh allow-rules (least-privilege)
| Dimension | Determination |
|-----------|---------------|
| Category | **Engineering** |
| Severity | **Low** |
| Implementable? | **Yes** |
| External actor? | No |
| Operational evidence? | **YES** — verified with `REM-09` |
| Certification? | No |
| Closure criteria | Populate mesh allow-rules per least-privilege as services land (`PHASE-12.0` G12-5). |
| Dependencies | `REM-06` (services), predecessor to `REM-09`. |
| Validation criteria | Every service edge has explicit least-privilege allow-rule; default-deny confirmed. |
| Closes risk | Hardens **RK-5** boundary integrity. |
| Maps to condition | Supports **C-F** |
| Wave | **C** |

---

#### REM-22 ← G-L5 · Implement anti-fragility mechanisms (`AF-M-1..6`)
| Dimension | Determination |
|-----------|---------------|
| Category | **Engineering** |
| Severity | **Low** |
| Implementable? | **Yes** — within E11 external-origination envelope |
| External actor? | No |
| Operational evidence? | **YES** — stressor tests |
| Certification? | Independent ratification |
| Closure criteria | Implement `AF-M-1..6` within the bounded-autonomy (E11) envelope; automated halt-recovery; robust → anti-fragile against the 7 stressors. |
| Dependencies | `REM-16`, `REM-20` (durable adapters), `REM-10`. |
| Validation criteria | ≥ target stressors strengthen the system (not freeze/degrade); halt-recovery automated; bounded-autonomy guarantee intact; ratified. |
| Closes risk | **RK-6 (Med)** not anti-fragile / fragile elements. |
| Maps to condition | Supports **C-H/C-J** |
| Wave | **C** |

---

### 1.5 Program-scale watch items (from risk register, no discrete gap ID)

| Watch | Source risk | Disposition in this program |
|-------|-------------|-----------------------------|
| **Scale walls at 10⁶–10⁹+** (single-node substrate, terminal Authority Board, single-SoR INV-5, synchronous determinism INV-6) | **RK-7 (High at target scale)** | Not a Wave A–E blocker for first release; each remedy (durable/sharded substrate, partitioned Evolution ledger, delegated/federated authority via `CIV-GOV-001` v1.1.0 GT-0..3) is a **separate governed authorization** post-foundation. Tracked as **REM-SCALE-*** future backlog; gated behind `REM-07`. |
| **Existential-scope drift** (INV-14..20 enrollment / Civilization-Economy pre-foundation) | **RK-12 (Med)** | Held by **AD-0014** deferral (Ω∞ Conceptual/Research/Reference). No enrollment authorized in this program. |

---

## SECTION 2 — EXECUTION ROADMAP (Waves A–E)

Waves are dependency-ordered and fail-closed: a wave may not begin until its predecessor wave's
**blocking** items are CLOSED. Documentary items (`REM-17..19`) and the PE-12 ADR (`REM-11`) are authorized
*now* (the C-A..C-E band) with no lock release or spend.

### Wave A — Critical blockers (unblock the attestation foundation)
| Item | Title | Category | Gate |
|------|-------|----------|------|
| **REM-04** | Corpus durability (`REAL-M-07` commit/push/tag) | Documentation | C-D |
| **REM-01** | Enact independent adjudication (`REAL-C-05`) | Governance | C-A |
| **REM-05** | Re-attest authority chain + PI-8/PI-9 | Governance | C-B |

**Exit criteria:** durable corpus at `origin`; independent-actor AD + registered key + ≥1 attestation;
chain/PI-8/PI-9 re-attested. `RK-1` and `RK-4` driven down.

### Wave B — Governance blockers (make verdicts current + capturable)
| Item | Title | Category | Gate |
|------|-------|----------|------|
| **REM-03** | Re-issue terminal cert `UCOM-ULTIMATE-CERT-002` | Certification | C-C |
| **REM-11** | Decide PE-12 observability ADR (+ADR-002A/PE-07) | Governance | C-E |
| **REM-13** | Enroll `INV-CORE-01..14` | Governance | — |
| **REM-17** | Reconcile documentary divergence | Documentation | — |
| **REM-18** | CAP-01..14 attributes (N-1) | Documentation | — |
| **REM-19** | "Party" glossary term | Documentation | — |

**Exit criteria:** terminal instrument valid against 269/269; observability decided (G12-3 capturable);
runtime-integrity invariants binding; documentary residuals cleared.

### Wave C — Engineering implementation (build behind released lock)
> Requires `REM-07` (Article IX release, Wave E) for *product/fabric* construction. Sequencing note: the
> program's own roadmap releases the lock (`REM-07`) after operational certification of the **substrate**;
> full product/fabric construction (`REM-06/10/12/14/16/20/21/22`) then proceeds under per-increment
> ratification. Items here are grouped as the engineering wave; each still passes its own gate.

| Item | Title | Category |
|------|-------|----------|
| **REM-10** | Universal audit/provenance (`AUDIT-UNIV-001` + `PROOF-IMPL-001`) | Engineering |
| **REM-06** | Product layer (28 domains/services/experience) | Engineering |
| **REM-14** | PI-10 Intelligence (AD-0024) + PI-11 Simulation (AD-0022) | Engineering |
| **REM-12** | IP / novelty / patent governance | Governance |
| **REM-16** | Research fabric + publication governance | Engineering |
| **REM-20** | Durable persistence adapters | Engineering |
| **REM-21** | Mesh allow-rules (least-privilege) | Engineering |
| **REM-22** | Anti-fragility mechanisms (`AF-M-1..6`) | Engineering |

**Exit criteria:** composed audit; running product behind 85 contracts; upper fabrics + research/IP
governance; durable, least-privilege, anti-fragile runtime — each independently ratified.

### Wave D — Operational validation (produce measured evidence)
| Item | Title | Category | Gate |
|------|-------|----------|------|
| **REM-02** | Provision ENV-DEV/INT + pipeline + DR drill + measured NFRs | Evidence | C-F |
| **REM-08** | Execute contract tests (85 + API-018/027) | Evidence | C-F |
| **REM-09** | Verify live security (mTLS STRICT, deny-by-default) | Evidence | C-F |

**Exit criteria:** G12-1/2/3 CLOSED; measured RPO/RTO/p99/availability ≥ `UCOS-ASR-NFR-001` §3 floors;
DR drill PASS; all evidence hash-logged and attested. `RK-2` driven down.

### Wave E — Certification (final authorization)
| Item | Title | Category | Gate |
|------|-------|----------|------|
| **REM-15** | Issue Operational Certification (close `OP-CERT-001` tracks) | Certification | C-G |
| **REM-07** | Article IX generation-lock release | Governance | C-I |
| **REM-03′** | Finalize/attach ULTIMATE certification (U2.13/U2.14 → ULT 1.0.0) | Certification | C-J |

**Exit criteria:** Operational Certification issued; `UCOS-CONSTRUCTION-BLOCKED` RELEASED; architecture
re-audit + ULTIMATE certification frozen at ULT 1.0.0. `RK-3` retired.

---

## SECTION 3 — ORDERED REMEDIATION BACKLOG

Priority order = critical-path position, then severity, then cost-to-close. `[imm]` = authorized now.

| # | Item | Gap | Sev | Cat | Wave | Ext-actor | Op-evidence | Cert |
|:-:|------|-----|-----|-----|:----:|:---------:|:-----------:|:----:|
| 1 | REM-04 Corpus durability `[imm]` | G-H2 | High | Doc | A | – | – | – |
| 2 | REM-01 Independent adjudication | G-C1 | **Crit** | Gov | A | ✅ | – | – |
| 3 | REM-05 Re-attest chain + PI-8/9 | G-H1 | High | Gov | A | ✅ | – | feeds |
| 4 | REM-11 PE-12 observability ADR `[imm]` | G-M3 | Med | Gov | B | – | – | – |
| 5 | REM-03 Re-issue terminal cert | G-C3 | **Crit** | Cert | B | ✅ | – | ✅ |
| 6 | REM-13 Enroll INV-CORE-01..14 | G-M1 | Med | Gov | B | ✅ | – | – |
| 7 | REM-17 Doc divergence `[imm]` | G-M5 | Med | Doc | B | – | – | – |
| 8 | REM-18 CAP-01..14 attrs `[imm]` | G-L1 | Low | Doc | B | – | – | – |
| 9 | REM-19 "Party" glossary `[imm]` | G-L2 | Low | Doc | B | – | – | – |
| 10 | REM-10 Universal audit/proof | G-H3 | High | Eng | C | – | ✅ | ratify |
| 11 | REM-06 Product layer | G-C4 | **Crit** | Eng | C | ✅ | ✅ | ratify |
| 12 | REM-20 Durable adapters | G-L3 | Low | Eng | C | – | ✅ | – |
| 13 | REM-21 Mesh allow-rules | G-L4 | Low | Eng | C | – | ✅ | – |
| 14 | REM-14 PI-10 + PI-11 | G-M2 | Med | Eng | C | ✅ | ✅ | ratify |
| 15 | REM-12 IP/novelty governance | G-H6 | High | Gov | C | ✅ | – | ratify |
| 16 | REM-16 Research fabric | G-M4 | Med | Eng | C | part | some | ratify |
| 17 | REM-22 Anti-fragility AF-M-1..6 | G-L5 | Low | Eng | C | – | ✅ | ratify |
| 18 | REM-02 Operational evidence + DR | G-C2 | **Crit** | Evid | D | ✅ | ✅ | feeds |
| 19 | REM-08 Contract-test execution | G-H4 | High | Evid | D | – | ✅ | feeds |
| 20 | REM-09 Live security verification | G-H5 | High | Evid | D | – | ✅ | feeds |
| 21 | REM-15 Operational Certification | (C-G) | **Crit** | Cert | E | ✅ | ✅ | ✅ |
| 22 | REM-07 Article IX lock release | G-C5 | **Crit** | Gov | E | ✅ | ✅(pre) | ✅ |
| 23 | REM-03′ ULTIMATE cert freeze (ULT 1.0.0) | (C-J) | **Crit** | Cert | E | ✅ | ✅ | ✅ |

---

## SECTION 4 — DEPENDENCY GRAPH

```
                         ┌──────────────────────────────────────────────────────────┐
                         │  WAVE A — attestation foundation                          │
                         └──────────────────────────────────────────────────────────┘
   REM-04 (durability) ──┐
                         ├──► REM-01 (independent adjudication)  ──► REM-05 (re-attest chain + PI-8/9)
   (no deps) ────────────┘            │                                     │
                                      │                                     ▼
                                      │                              ┌──────────────┐
                                      │                              │   WAVE B     │
                                      ▼                              └──────────────┘
                              REM-13 (INV-CORE enroll)      REM-03 (re-issue terminal cert) ◄── REM-05
                              REM-11 (PE-12 ADR) ─────────────────────┐
                              REM-17/18/19 (documentary, independent) │
                                                                      │
        ┌─────────────────────────────────────────────────────────────────────────┐
        │  WAVE C — engineering (proceeds under per-increment ratification;         │
        │           product/fabric build gated by REM-07 lock release)             │
        └─────────────────────────────────────────────────────────────────────────┘
   REM-10 (universal audit) ──► REM-06 (product) ──► REM-21 (mesh rules)
                                   │        │
                                   │        ├──► REM-14 (PI-10/PI-11)
                                   │        └──► REM-20 (durable adapters) ──► REM-22 (anti-fragility)
                                   ▼
                              REM-12 (IP gov) ──► REM-16 (research fabric)

        ┌─────────────────────────────────────────────────────────────────────────┐
        │  WAVE D — operational validation                                          │
        └─────────────────────────────────────────────────────────────────────────┘
   REM-11 ─► REM-02 (env + pipeline + DR + NFRs) ◄── REM-06/REM-20
                    │
   REM-21 ─► REM-09 (live security) ◄── REM-02
   REM-02 ─► REM-08 (contract tests)

        ┌─────────────────────────────────────────────────────────────────────────┐
        │  WAVE E — certification + release                                         │
        └─────────────────────────────────────────────────────────────────────────┘
   REM-02 + REM-08 + REM-09 ──► REM-15 (Operational Certification)
   REM-01 + REM-03 + REM-05 + REM-15 ──► REM-07 (Article IX lock RELEASE)
   REM-07 + full-scope ratifications ──► REM-03′ (ULTIMATE cert freeze → ULT 1.0.0)
```

**Edge legend:** `A ──► B` = A is a blocking predecessor of B. `REM-01` is the universal predecessor
(every attested verdict depends on it); `REM-04` is the earliest, cheapest unblock.

---

## SECTION 5 — CRITICAL PATH

The longest chain of blocking dependencies from today to full-scale GO:

```
REM-04  ──►  REM-01  ──►  REM-05  ──►  REM-03  ──►  REM-11  ──►  REM-02  ──►  REM-15  ──►  REM-07  ──►  REM-03′
durable      indep.       re-attest    re-issue     PE-12       op-evidence  op-cert      Art-IX       ULTIMATE
corpus       adjudic.     chain/PI     cert         ADR         + DR + NFRs               release      freeze
(C-D)        (C-A)        (C-B)        (C-C)        (C-E)        (C-F)        (C-G)        (C-I)        (C-J)
```

- **Longest pole:** `REM-02` (provision + pipeline + DR + measured NFRs) — the only item requiring
  real-spend, environment stand-up, and a completed measurement cycle. It is also the item most exposed to
  `RK-2` (operational unknowns) and `RK-9` (PE-12 predecessor).
- **Highest leverage / earliest act:** `REM-01` (independent adjudication). Until it closes, every node
  downstream is self-attested and provisional (`RK-1`, Critical). `REM-04` must precede it so attested
  hashes are durable.
- **Parallelizable off the critical path:** Wave-B documentary items (`REM-17/18/19`), `REM-13`, and the
  Wave-C engineering items that are not upstream of `REM-02` (`REM-10`, `REM-12`, `REM-14`, `REM-16`,
  `REM-22`) — these can run concurrently once the lock is released, without extending the critical path.
- **Product construction (`REM-06`)** sits on the path to `REM-02` only to the extent the release scope
  requires running product to measure; the substrate (PI-2..PI-9, 269/269) already exists, so an initial
  operational-evidence cycle can measure the substrate before full product build.

---

## SECTION 6 — EARLIEST PATH TO GO

The minimum ordered sequence that converts **NO-GO (full-scale)** into **GO**, fail-closed:

1. **`REM-04`** — commit/push/tag the corpus (authorized now; hours). *→ C-D closed.*
2. **`REM-01`** — designate independent actor, register key, place first attestation (authorized now, needs external actor). *→ C-A closed; unblocks all attestation.*
3. **`REM-05`** — independently re-attest chain + PI-8/PI-9. *→ C-B closed.*
4. **`REM-03`** — re-issue `UCOM-ULTIMATE-CERT-002` against 269/269. *→ C-C closed.*
5. **`REM-11`** — record PE-12 observability ADR. *→ C-E closed.* (Runs parallel to steps 2–4.)
6. **`REM-02` (+ `REM-08`, `REM-09`)** — provision ENV-DEV/INT, run pipeline + contract tests + DR drill, capture measured NFRs; verify live security. *→ C-F closed.*
7. **`REM-15`** — issue Operational Certification. *→ C-G closed.*
8. **`REM-06` / `REM-14`** — construct + independently ratify the product/fabrics required for the intended release scope. *→ C-H closed.*
9. **`REM-07`** — release the Article IX lock (`UCOS-CONSTRUCTION-BLOCKED` → RELEASED). *→ C-I closed.*
10. **`REM-03′`** — architecture-completeness re-audit + ULTIMATE certification, freeze at ULT 1.0.0. *→ C-J closed.*

**Earliest *partial* GO (substrate-scope release):** steps 1–7 + a substrate-scoped `REM-07` yield a
defensible GO for the tested substrate without waiting for full product/upper-fabric construction —
provided the release scope is explicitly limited to PI-2..PI-9 and each excluded fabric stays behind the
lock. Full-scope GO requires all 10 steps.

**Steps authorized *today* with no lock release and no spend:** `REM-04`, `REM-01`, `REM-05`, `REM-03`,
`REM-11`, plus documentary `REM-17/18/19` and `REM-13` — i.e. the entirety of Waves A and B. This is
exactly the program's own sanctioned next move (`CONST-READY-001` D-1: CW-1/U2.1 may begin now).

---

## SECTION 7 — REVISED DETERMINATION

> ## GO WITH CONDITIONS
>
> **Scope of GO:** the governed, incremental **execution of this remediation program** — beginning
> immediately with Waves A and B (`REM-04`, `REM-01`, `REM-05`, `REM-03`, `REM-11`, `REM-13`,
> `REM-17/18/19`), which are authorized now with **no lock release and no real-spend**.
>
> **Scope that remains NO-GO:** full-scale execution and full Article IX release remain **NO-GO** until the
> critical path (Section 5) completes — decisively, until `REM-01` (independent adjudication) closes and
> `REM-02`/`REM-15` (operational evidence + Operational Certification) are in hand. `UCOS-CONSTRUCTION-BLOCKED`
> stays in force until `REM-07`.
>
> **Why this is unchanged in verdict but changed in posture.** `UCOS-MASTER-RAT-001` already determined
> NO-GO (full-scale) / GO-WITH-CONDITIONS (governed construction). This program does **not** relax that
> verdict; it makes it *executable*: the 21 gaps and 12 risks are now a 23-item ordered backlog with
> explicit categories, closure/validation criteria, a dependency graph, and a critical path. Critically,
> `UCOS-GAP-MASTER-001` confirms **0 unremediable gaps** — every CRITICAL traces to a defined closing action
> in `ROADMAP-ULT-001`. The path from NO-GO to GO is therefore fully specified and fail-closed.
>
> **The single highest-leverage act remains `REM-01` (enact `REAL-C-05`).** Until it closes, this
> determination — like every verdict in the corpus — is self-attested and provisional.

### 7.1 GO-condition ↔ remediation-item ↔ wave crosswalk
| Condition (`UCOS-MASTER-RAT-001` §5) | Remediation item(s) | Wave |
|--------------------------------------|---------------------|:----:|
| C-A Enact independent adjudication | REM-01 | A |
| C-B Re-attest chain + PI-8/PI-9 | REM-05 | A |
| C-C Re-issue terminal certification | REM-03 | B |
| C-D Commit/push/tag corpus | REM-04 | A |
| C-E PE-12 observability ADR | REM-11 | B |
| C-F Provision + pipeline + tests + DR + NFRs | REM-02, REM-08, REM-09 | D |
| C-G Operational Certification | REM-15 | E |
| C-H Construct + ratify remaining fabrics | REM-06, REM-10, REM-12, REM-14, REM-16, REM-20, REM-21, REM-22 | C |
| C-I Article IX lock release | REM-07 | E |
| C-J Architecture re-audit + ULTIMATE cert | REM-03′ | E |

### 7.2 Risk burn-down by wave
| Wave | Risks driven down |
|------|-------------------|
| A | RK-1 (Critical), RK-4 (High) |
| B | RK-9, RK-10 (setup), partial RK-1 residual |
| C | RK-5, RK-6, RK-8, RK-11, RK-12 (bounds) |
| D | RK-2 (High), completes RK-10 |
| E | RK-3 (High) retired by construction; RK-7 remains a post-foundation scaled-authorization track |

---

## Governance / Non-Mutation Statement

This program produced **no** source code, infrastructure, service, or authorization; **released no** lock;
**enrolled no** invariant; **awarded no** certification or ratification; and **modified no** frozen
construct. `INV-1..13`, `AUTH-012`, `AD-0014`, the Article IX generation lock, Governance Baseline 1.0.0,
and all ratified architectures are unchanged. `UCOS-CONSTRUCTION-BLOCKED` is unchanged. The certification
level is unchanged: **CONDITIONALLY CERTIFIED**. All items herein remain Approval-Required / Board-owned.

## Traceability
- **Refines:** `UCOS-MASTER-RAT-001`, `UCOS-GAP-MASTER-001`, `UCOS-RISK-MASTER-001`, `ROADMAP-ULT-001`
  (U2.1→U2.15), `REAL-C-05`, `REAL-C-01`, `REAL-M-03`, `REAL-M-07`, `CONST-READY-001/002`, `OP-CERT-001`,
  `PHASE-12.0-...CERTIFICATION`, `AF-001`/`AF-REM-001`, `ARCH-GAP-VAL-001`, `UGA-001-GAP-ANALYSIS`,
  `AUTH-REST-004`, `ONTO-RAT-001`, `MEM-RAT-003`, `UCOM-ULTIMATE-CERT-001`, `UCOS-ASR-NFR-001` v1.0.1.
- **Refined by:** the prospective independent attestation of this package under `REAL-C-05`, and the
  per-wave closure evidence recorded as each `REM-*` item completes.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect).

**END UCOS-REM-PROG-001 — 23 REMEDIATION ITEMS · 5 WAVES · CRITICAL PATH REM-04→REM-01→REM-05→REM-03→REM-11→REM-02→REM-15→REM-07→REM-03′ · DETERMINATION: GO WITH CONDITIONS · 0 UNREMEDIABLE GAPS · SELF-ATTESTED PENDING REAL-C-05.**
