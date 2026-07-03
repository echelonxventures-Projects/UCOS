# REG-VAL-002 — Decision Log Integrity Report

| Field | Value |
|-------|-------|
| Artifact | **REG-VAL-002 — Decision Log Integrity Report** |
| Program step | **REG-001 — Artifact Registry Reconciliation** |
| Target ledger | `.claude/authority/AUTH-012-DECISION-LOG.md` (`AUTH-012`) |
| Method | Read-only audit — AUTH-012 records + version table cross-checked against root `AD-*.md` files and their self-declared decision-log entries |
| Mode | **AUDIT / DETECTION ONLY** — the decision log is an Authority artifact; recording/appending entries is governed (AUTH-012 §9; AUTH-009). **No mutation performed.** |
| Date | 2026-07-01 |
| Verdict | **DECISION LOG INCONSISTENT — 5 authorized acts (AD-0016..0020) exist as files but are NOT recorded in the canonical log** |

---

## 1. What the canonical log contains

`AUTH-012-DECISION-LOG.md` — **Version 1.0.5** — contains decision records **AD-0001 … AD-0015** only, with
a Version Information table whose last row is `1.0.5 → AD-0015 (A9-REL-001)`. The log is internally clean:

| Check | Result |
|-------|:------:|
| Sequential IDs AD-0001..AD-0015, no gaps | **PASS** |
| Duplicate decision IDs | **none — PASS** |
| Version table monotonic (1.0.0→1.0.5) & matches records | **PASS** |
| Ten-field completeness of each recorded AD | **PASS** (spot-verified AD-0012/0014/0015) |
| Append-only discipline within AD-0001..0015 | **PASS** |

## 2. The integrity gap — AD-0016..0020 are unrecorded

Five authorization acts exist as **standalone files at repository root** and each **self-declares a
canonical AUTH-012 entry**, but **none is present in `AUTH-012-DECISION-LOG.md`**:

| Act (root file) | Self-declared field | Present in AUTH-012? | Scope it authorizes |
|-----------------|---------------------|:--------------------:|---------------------|
| `AD-0016-PI2-PI3-SUBSTRATE-CONSTRUCTION-AUTHORIZATION.md` | “Decision-log entry: AUTH-012 AD-0016” | ○ **NO** | PI-2/3 substrate |
| `AD-0017-PI4-CONTROL-FABRICS-CONSTRUCTION-AUTHORIZATION.md` | “AUTH-012 AD-0017” | ○ **NO** | PI-4 control |
| `AD-0018-PI5-FEDERATION-FABRIC-CONSTRUCTION-AUTHORIZATION.md` | “AUTH-012 AD-0018” | ○ **NO** | PI-5 federation |
| `AD-0019-PI6-EVOLUTION-FABRIC-CONSTRUCTION-AUTHORIZATION.md` | “Decision-log entry: AUTH-012 AD-0019” | ○ **NO** | PI-6 evolution |
| `AD-0020-PI7-KNOWLEDGE-FABRIC-CONSTRUCTION-AUTHORIZATION.md` | “Decision-log entry: AUTH-012 AD-0020” | ○ **NO** | PI-7 knowledge |

These are not trivial acts: **AD-0016..0020 are the scoped Article IX generation-lock releases** that
authorized all executable code shipped under `packages/platform-runtime/src/control/*` (substrate → control
→ federation → evolution → knowledge; ≥185 tests). The canonical Authority decision repository has **no
record that any construction was ever authorized.**

## 3. Findings

### F-D1 — Missing entries AD-0016..0020 — CRITICAL
Five ratified, acted-upon authorization decisions are absent from the append-only canonical log. Per
AUTH-012 §6 (“Every … architecturally significant decision MUST be recorded here **before taking effect**”),
construction under AD-0016..0020 took effect against an unrecorded authority basis. This is the highest-
severity reconciliation finding.

### F-D2 — Cross-reference failure (files ↔ log) — CRITICAL
The five AD files assert membership in AUTH-012 (“Decision-log entry: AUTH-012 AD-00NN”) that does not
exist. Any consumer trusting the files’ self-declaration is misled; any consumer trusting AUTH-012 as the
single source of truth (its stated role) concludes construction was unauthorized. The two sources
**contradict each other.**

### F-D3 — Latent numbering conflict — HIGH
AUTH-012 §6 mandates “Decision IDs are assigned sequentially (`AD-NNNN`) and never reused.” The log’s next
free ID is **AD-0016**. But `AD-0016..0020` are **already minted as files** outside the log. If the log is
naively advanced, the custodian will re-mint AD-0016 (…) and **collide** with the existing files — or, if
it skips to AD-0021, it leaves a **permanent gap** AD-0016..0020 in the sequential record. Either path
violates §6 unless the reconciliation explicitly adopts the existing file IDs.

### F-D4 — Downstream citation integrity — MEDIUM
The registry’s INT/ONTO/SIM sections and the state ledger’s PI-8/9/10 sections all cite `AD-0016..0020` as
their authorization basis. Those citations resolve to **files** but not to **log entries**; the governance
chain “spec → AD → AUTH-012” is broken at the final hop for every fabric from PI-2 onward.

### F-D5 — Version-table truncation — MEDIUM
The Version Information table ends at `1.0.5 (AD-0015)`. It does not reflect AD-0016..0020, so the log’s own
changelog understates the true decision count by five and misstates the current head.

### F-D6 — No AD-0021 for later fabrics — INFORMATIONAL (not a defect)
PI-8 (ONTO), PI-9 (MEM), PI-10 (INT), PI-11 (SIM) are **design/readiness only** and each explicitly states
“implementation NOT authorized; prospective `AD-00xx`.” Their **absence** from AUTH-012 is **correct** — no
authorization decision has been made. Only AD-0016..0020 (acts that *did* take effect) are defects.

## 4. Consolidated

| ID | Severity | Finding |
|----|:--------:|---------|
| F-D1 | CRITICAL | AD-0016..0020 missing from AUTH-012 |
| F-D2 | CRITICAL | File ↔ log cross-reference contradiction |
| F-D3 | HIGH | Sequential-numbering conflict on reconciliation |
| F-D4 | MEDIUM | Broken spec→AD→AUTH-012 chain for PI-2+ |
| F-D5 | MEDIUM | Version table truncated at AD-0015 |
| F-D6 | INFO | PI-8..11 correctly unrecorded (no defect) |

Duplicate entries: **none**. Out-of-order within AUTH-012: **none**. The defect is exclusively **omission**
of AD-0016..0020.

## 5. Recommendations (no action taken — governed operation)

1. **REC-D1 (Approval-adjacent; custodian action).** Reconcile by **adopting the existing file IDs**:
   append AD-0016..0020 to AUTH-012 verbatim from the root files (they contain full decision content),
   preserving their IDs so no renumbering/collision occurs (resolves F-D1/F-D2/F-D3). Recording an
   already-made decision is a Trusted Operation (AUTH-012 §8), but because these are **Authority-artifact
   entries for acts that release the Article IX lock**, the Chief Authority Architect / Authority Board
   should ratify the reconciliation entry rather than an agent minting it unilaterally.
2. **REC-D2.** Extend the Version Information table to `1.0.6..1.0.10` (or a single reconciliation row
   `1.0.6 — appended AD-0016..0020, imported from root authorization files`) — resolves F-D5.
3. **REC-D3.** Add a standing rule: an `AD-*` authorization file may not be created at root until the
   corresponding AUTH-012 entry is appended (enforce “record before effect,” §6) — prevents recurrence.
4. **REC-D4.** After REC-D1, re-verify all registry/state citations of AD-0016..0020 now resolve to log
   entries (closes F-D4).

> **Why no mutation here.** AUTH-012 is an immutable, append-only **Authority** artifact; appending the five
> missing lock-release decisions is a governed act with constitutional weight (Article IX). This report
> therefore **detects and recommends only**; the reconciliation entry is left to the Authority
> Board / Chief Authority Architect (AUTH-009 change procedure).

## 6. Traceability
- **Audited:** `AUTH-012-DECISION-LOG.md` (v1.0.5; AD-0001..0015).
- **Evidence:** root `AD-0016..0020` files + their self-declared decision-log fields.
- **Companion reports:** REG-VAL-001 (registry), REG-VAL-003 (state ledger).
- **Owner:** UCOS Authority Board / Chief Authority Architect.

**END REG-VAL-002 — DECISION LOG INTEGRITY REPORT · AUDIT ONLY · NO LEDGER MUTATION.**
