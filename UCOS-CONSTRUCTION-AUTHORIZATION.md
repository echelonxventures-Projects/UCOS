# UCOS — CONSTRUCTION AUTHORIZATION

## Authority Board Authorization of Governed Implementation (Phase 11)

| Field | Value |
|-------|-------|
| Artifact | **UCOS-CONSTRUCTION-AUTHORIZATION** |
| Artifact ID | `UCOS-CONSTR-AUTH-001` |
| Version | 1.0.0 |
| Phase | **Phase 10.7 — Construction Authorization** (activates Phase 11 implementation) |
| Authorizing body | **UCOS Authority Board** |
| Activated by | `UCOS-ARTICLE-IX-LOCK-RELEASE` (`UCOS-ART9-REL-001`) |
| Mode | **AUTHORIZATION ARTIFACT ONLY** — authorizes governed construction; does **not** begin implementation, modify architecture, or change ADRs |
| Branch | `phase-10-implementation-readiness` (DO NOT PUSH / MERGE / TAG) |
| **Effective** | **2026-06-30T00:00:00Z** |
| **Status** | **IMPLEMENTATION AUTHORIZED — WITHIN SCOPE, UNDER MANDATORY CONTROLS** |

> Companion to `UCOS-ART9-REL-001`. This authorization is valid **only** while the Article IX lock release
> stands (subject to its revocation conditions). It supersedes `UCOS-CONSTRUCTION-BLOCKED`.

---

## 1. Effective Date/Time
**2026-06-30T00:00:00Z** — concurrent with `UCOS-ART9-REL-001`. Implementation may commence in Phase 11
(`UCOS-IMP-PI-001` PI-1 onward) under §2–§5.

## 2. Authorized Implementation Scope

Governed construction is authorized **for the ratified artifacts only**, per work packages in
`UCOS-IMP-WPS-001` / `UCOS-IMP-PI-001`:

| # | Authorized activity | Ratified basis |
|:-:|---------------------|----------------|
| A1 | **Source code / UI** realizing the 14 experience surfaces & 15 journeys in `apps/` | `UCOS-EXP-ARCH-001` (C-1) |
| A2 | **Service implementation** of the 28 bounded-context services | `UCOS-SVC-ARCH-001` (C-2) |
| A3 | **API / event / data implementation** of the 85 ratified contracts | `UCOS-CONTRACT-CAT-001` (C-2) |
| A4 | **Database / persistence** implementation (schemas/DDL derived from `PDE`/`PDP`) | `UCOS-PDATA-ARCH-001` + ADR-002 |
| A5 | **Runtime / platform** implementation | `UCOS-PEA-001/002` + ADR-001/003/004/005/007 |
| A6 | **Control-fabric** implementation + security controls (`SEC-CTL-001..020`) with S1/S3/S4 enforced | `UCOS-PEA-007` + `UCOS-SEC-ARCH-001` (C-3) + ADR-006 |
| A7 | **Validation** (Prompt 11) and **certification** (Prompt 12) against ratified artifacts | `UCOS-SVC-CTEST-001`, gates |
| A8 | **Delivery / CI-CD / IaC** execution under gates | ADR-007 + `UCOS-IMP-DELIV-001`/`GOV-001` |

## 3. Prohibited Implementation Scope

| # | Prohibited (requires a new governed decision) |
|:-:|-----------------------------------------------|
| P1 | New capabilities/domains/contracts/events beyond the ratified set (no scope creep) |
| P2 | Mutation of frozen artifacts (`UCOS-PEA-001..007`, Governance Baseline 1.0.0, ratified domains/entities/matrices) |
| P3 | Technology beyond ratified ADRs — incl. **deferred** `UCOS-PLAT-ADR-002A` (analytical store), `PE-12` (observability product), `PE-07` (workflow engine) until their sub-ADRs are ratified |
| P4 | Waiving non-waivable **S1/S3/S4** (Constitution Art. XII) |
| P5 | Bypassing `GATE-QUAL/SEC/DOC/REL-001`; promoting unsigned/unregistered artifacts; production deploy without `GATE-REL-001` |
| P6 | Implementation against **unratified ASR/NFR** values (violates IC-5) |
| P7 | Broad/unsafe SCM operations (`git add .`, `reset --hard`, `clean -fd`); non-scoped commits |

## 4. Mandatory Controls (IC-1..IC-8)

Restated from `UCOS-ART9-REL-001` §5 and binding on all Phase 11 work: **IC-1** non-waivable S1/S3/S4;
**IC-2** contract-first; **IC-3** gate compliance; **IC-4** traceability (0 orphans); **IC-5** ASR
resolution (Prompt 02) before performance-bound work; **IC-6** forward security obligations FO-1/2/3;
**IC-7** migration-only evolution + deferred sub-ADR ratification before use; **IC-8** preservation
discipline (scoped commits).

## 5. Governance Obligations During Phase 11

| # | Obligation |
|:-:|-----------|
| G1 | Execute per `UCOS-IMP-PI-001` (PI-1 onward) and `UCOS-IMP-WPS-001`; each work package traces to ratified artifacts. |
| G2 | Enforce all gates at each promotion (`GATE-QUAL/SEC/DOC/REL-001`); record gate evidence. |
| G3 | Maintain append-only governance records; register every new implementation artifact in `CTX-REG-001`; update `STATE-001`. |
| G4 | Ratify deferred sub-ADRs (`ADR-002A`, `PE-12`, `PE-07`) before implementing their domains (IC-7). |
| G5 | Resolve N-1 ASR/NFR values via Prompt 02 governed versioned update (IC-5) before performance/availability-bound implementation. |
| G6 | Discharge FO-1/2/3 security forward obligations (IC-6) in Prompts 07/10/11. |
| G7 | Preserve all artifacts via scoped commits (IC-8); no broad SCM; keep ledger aligned. |
| G8 | Report to the Authority Board; any scope/frozen/security deviation triggers the §6 revocation review. |

## 6. Revocation Conditions

This authorization is **suspended/revoked** (and the Article IX lock re-imposed per `UCOS-ART9-REL-001` §6)
upon any of: S1/S3/S4 waiver or bypass (P4); out-of-scope or frozen-artifact change (P1/P2); gate bypass or
unsigned/unregistered promotion (P5); use of deferred/unratified technology (P3); implementation against
unratified ASRs (P6); or material loss of traceability/preservation discipline (IC-4/IC-8). Revocation is a
new append-only Authority Board decision.

## 7. Confirmations (scope discipline)
- **Implementation authorized within scope; NOT begun by this artifact.** ✅
- **No architecture modified; no ADR changed.** ✅
- Valid only while `UCOS-ART9-REL-001` stands. ✅
- Supersedes `UCOS-CONSTRUCTION-BLOCKED` (preserved, not deleted). ✅

## Traceability
- **Refines:** `UCOS-ART9-REL-001`, `UCOS-AUTH-BOARD-003` (D-6), `UCOS-IMP-READY-001`, `UCOS-IMP-PI-001`, `UCOS-IMP-WPS-001`, `UCOS-IMP-GOV-001`, `UCOS-IMP-DELIV-001`, ratified `UCOS-EXP-ARCH-001`/`UCOS-SVC-ARCH-001`/`UCOS-SEC-ARCH-001`/`UCOS-PLAT-ADR-001..007`, `UCOS-CONST-001` (Art. IX).
- **Supersedes:** `UCOS-CONSTRUCTION-BLOCKED` (`UCOS-CONSTR-BLOCK-001`).
- **Refined by:** Phase 11 implementation (Prompt 10), validation (Prompt 11), certification (Prompt 12).
- **Owner:** UCOS Authority Board.

**END UCOS-CONSTRUCTION-AUTHORIZATION — IMPLEMENTATION AUTHORIZED WITHIN SCOPE · EFFECTIVE 2026-06-30 · IMPLEMENTATION NOT BEGUN.**
