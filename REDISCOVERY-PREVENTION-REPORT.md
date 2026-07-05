# REDISCOVERY-PREVENTION-REPORT (PHASE G.2 · WS3 / WS5)

> **PHASE G.2 · Review-Trigger Model & Token Protection · REDISCOVERY PREVENTION**
> Engine: `tools/program-compiler/src/external-blockers.ts` (`evaluateReviewTrigger`, `computeExternalBlockers`).
> This document records the anti-rediscovery mechanism. It creates no evidence and closes nothing.

| Field | Value |
|-------|-------|
| Artifact ID | `REDISCOVERY-PREVENTION-REPORT` |
| Phase | **G.2** · Version 1.0.0 · Date 2026-07-03 |
| Governing rule | A blocked item may be re-opened **only** when new evidence exists. Otherwise **review is prohibited**. |

---

## 1. Problem

`REAL-C-05` was already adjudicated to a definitive state in PHASE G.1: **PARTIAL** — 0 independent
attestations, gate G1–G4 = 0/4, closure criteria C1–C4 = 0/4, closable only by the Authority Board.
Without a guard, every future agent re-audits REAL-C-05 from scratch, re-derives the same PARTIAL
result, and burns thousands of tokens producing no new information. The same waste applies to the
operational-evidence (REAL-C-03) and AD-0024 (REAL-C-04) gaps.

## 2. Review-Trigger Model (WS3)

Each external blocker declares a `review_trigger` that captures the **rediscovery baseline** —
the state of the world at the last authoritative review. A blocked item may be re-opened **only**
when at least one of the following new facts appears:

- **new evidence** — a watched evidence id advances beyond its recorded baseline state;
- **new designation** — an independent adjudicator is designated (G1);
- **new attestation** — a genesis independent attestation is produced (G3);
- **new authority action** — a new AUTH-012 Board action is recorded.

The engine computes this deterministically: for every `watchEvidence` id it compares the current
evidence state to `baselineStates[id]`. If `rank(current) > rank(baseline)` for any id, a review
trigger has fired (`REVIEW_PERMITTED`); otherwise review is **prohibited** (`DO_NOT_REINVESTIGATE`).

Because the baseline is stored in the registry, the guard **self-updates**: the moment an external
actor advances `EV-REAL-C-05` (e.g. via `pnpm ucos:set-evidence EV-REAL-C-05 VERIFIED`), the
trigger fires automatically and the item becomes reviewable — no code change, no manual override.

## 3. Token Protection (WS5)

When an item is `EXTERNAL_BLOCKED` and no review trigger has fired, the compiler emits an explicit
recommendation: **`DO_NOT_REINVESTIGATE`**. This appears in:

- `pnpm ucos:program-state` → the **EXTERNAL BLOCKERS** section;
- `MINIMAL_CONTEXT.md` → **External blockers (NOT software-solvable)** with a 🛑 flag;
- `next-work-item.json` / `dashboard.json` → machine-readable `recommendation` field;
- `pnpm ucos:external-blockers` → per-blocker recommendation + reasons.

Current recommendations (baseline 2026-07-03):

| Blocker | Target | Recommendation | Reason |
|---------|--------|----------------|--------|
| `EXT-REAL-C-05` | REAL-C-05 | **DO_NOT_REINVESTIGATE** | 0 attestations; no evidence advanced since 2026-07-03 |
| `EXT-REAL-C-03` | REAL-C-03 | **DO_NOT_REINVESTIGATE** | 0/6 operational evidence captured; none advanced beyond PENDING |
| `EXT-REAL-C-04` | REAL-C-04 | **DO_NOT_REINVESTIGATE** | AD-0024 not issued; `EV-PI10-AUTH` still PENDING |

## 4. Demonstration (in-memory only — no registry mutation)

The engine was exercised in-memory to confirm the trigger fires when — and only when — new
evidence appears. No registry file was modified; no synthetic evidence was persisted.

```
BASELINE  EXT-REAL-C-05: DO_NOT_REINVESTIGATE
(simulate EV-REAL-C-05: SUBMITTED -> VERIFIED, in-memory)
AFTER     EXT-REAL-C-05: REVIEW_PERMITTED | advanced: [ EV-REAL-C-05 ]
```

This proves: (a) absent new evidence, review is prohibited; (b) the instant a genuine external
attestation advances the evidence, the guard releases and the item becomes reviewable.

## 5. Rules for future agents

1. If an item is `EXTERNAL_BLOCKED` with `DO_NOT_REINVESTIGATE`, **do not re-audit it.** The answer
   is already recorded (`last_review_date`, `last_review_determination`). Read it; move on.
2. Re-investigation is warranted **only** after a review trigger fires. Check `pnpm ucos:external-blockers`.
3. To record a genuine external action, advance the relevant evidence via `pnpm ucos:set-evidence`
   (governed, monotonic). Never hand-edit generated files or fabricate evidence.
4. The Program Compiler is the source of truth for what is and is not worth investigating.

## 6. Absolute-rule compliance

- REAL-C-05 was **not** closed or re-opened; its recorded state remains **PARTIAL**.
- **No** synthetic designation, attestation, authority, or evidence was created.
- The demonstration mutated only in-memory objects; all registry JSON is unchanged.

**END REDISCOVERY-PREVENTION-REPORT — review prohibited without a trigger · 3 blockers = DO_NOT_REINVESTIGATE · guard self-updates on real evidence · no synthetic evidence.**
