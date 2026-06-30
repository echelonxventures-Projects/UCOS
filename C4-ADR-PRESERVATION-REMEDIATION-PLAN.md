# C-4 — ADR REPOSITORY PRESERVATION REMEDIATION PLAN

## Safe, Scoped Preservation Plan for the Platform Technology-Selection ADR Set

| Field | Value |
|-------|-------|
| Artifact | **C4-ADR-PRESERVATION-REMEDIATION-PLAN** |
| Artifact ID | `UCOS-C4-ADR-REMED-PLAN-001` |
| Version | 1.0.0 |
| Mode | **PLAN ONLY** — commands are **recommendations**; **nothing is executed**; no commit, no state/registry update, no lock release |
| Subject | `architecture/platform/adr/` (8 files; Condition C-4) |
| Basis | `C4-ADR-REPOSITORY-PRESERVATION-AUDIT` (`UCOS-C4-ADR-AUDIT-001`) — verdict PASS WITH OBSERVATIONS (untracked/uncommitted) |
| Repo state at planning | Branch `phase-10-implementation-readiness`; `HEAD = 0ad488c` (PHASE-10.2D); `architecture-references.txt` **absent**; `STATE-001`/`CTX-REG-001` **committed (clean)** |
| Date | 2026-06-30 |
| **Determinations** | Independent preservation **FEASIBLE & SAFE**; governance artifacts **preserve separately**; C-4 commit **safe without broad SCM** |

> **Standing constraints honored.** This document does **not** commit, stage, modify, update state/registry,
> or release Article IX. All `git` commands below are **proposed for a future authorized remediation task**.

---

## 1. Exact ADR Files Requiring Preservation

Eight untracked files in `architecture/platform/adr/` (verified untracked; `git ls-files` empty; not gitignored):

| # | Path | Bytes |
|:-:|------|------:|
| 1 | `architecture/platform/adr/UCOS-PLAT-ADR-001-RUNTIME.md` | 8,848 |
| 2 | `architecture/platform/adr/UCOS-PLAT-ADR-002-STORAGE.md` | 8,773 |
| 3 | `architecture/platform/adr/UCOS-PLAT-ADR-003-EVENT-FABRIC.md` | 8,240 |
| 4 | `architecture/platform/adr/UCOS-PLAT-ADR-004-REGISTRY.md` | 7,594 |
| 5 | `architecture/platform/adr/UCOS-PLAT-ADR-005-METADATA.md` | 8,106 |
| 6 | `architecture/platform/adr/UCOS-PLAT-ADR-006-SECURITY.md` | 8,962 |
| 7 | `architecture/platform/adr/UCOS-PLAT-ADR-007-DELIVERY-TOOLCHAIN.md` | 8,651 |
| 8 | `architecture/platform/adr/UCOS-PLAT-ADR-INDEX.md` | 10,738 |

Total: 69,912 bytes. No `ADR-002A` file exists (deferred/future — out of scope for this preservation).

---

## 2. Safe Commit Strategy

**Principles:**
1. **Explicit-path staging only.** Never `git add .` or `git add -A` (prevents sweeping scratch/anomaly files).
2. **One dedicated, scoped commit** for the C-4 ADR set — no bundling with contracts, security, or reports (avoids the OBS-1/N-4 commit-packaging defect seen at `0ad488c`).
3. **Pre-stage inspection** of `git status --short` to confirm exactly what is staged before committing.
4. **No hooks bypass; no force; no amend** of existing commits.
5. **Content-only preservation:** this commit must not alter ADR content (preserve as-is).
6. The whole `adr/` directory may be staged by **directory path** (all 8 files, no others) since it contains only the target files — equivalent to listing all 8 explicitly.

**Commit message (recommended):**
```
PHASE-10.4: Preserve C-4 platform technology-selection ADR set (UCOS-PLAT-ADR-001..007 + index)
```

---

## 3. Explicit File-by-File Staging Commands (recommendation — DO NOT EXECUTE)

```bash
# (0) From repo root; confirm branch + clean baseline view
git rev-parse --abbrev-ref HEAD          # expect: phase-10-implementation-readiness
git status --short                       # review untracked set before staging

# (1) Stage ONLY the eight C-4 ADR files — explicit paths (no wildcards, no 'git add .')
git add architecture/platform/adr/UCOS-PLAT-ADR-001-RUNTIME.md
git add architecture/platform/adr/UCOS-PLAT-ADR-002-STORAGE.md
git add architecture/platform/adr/UCOS-PLAT-ADR-003-EVENT-FABRIC.md
git add architecture/platform/adr/UCOS-PLAT-ADR-004-REGISTRY.md
git add architecture/platform/adr/UCOS-PLAT-ADR-005-METADATA.md
git add architecture/platform/adr/UCOS-PLAT-ADR-006-SECURITY.md
git add architecture/platform/adr/UCOS-PLAT-ADR-007-DELIVERY-TOOLCHAIN.md
git add architecture/platform/adr/UCOS-PLAT-ADR-INDEX.md

# (2) PRE-COMMIT GATE: staged set MUST equal exactly these 8 files, nothing else
git diff --cached --name-only           # expect: exactly the 8 adr/ paths

# (3) Commit (only after step 2 verification passes)
git commit -m "PHASE-10.4: Preserve C-4 platform technology-selection ADR set (UCOS-PLAT-ADR-001..007 + index)"
```

> Equivalent scoped alternative for step (1): `git add architecture/platform/adr/` — acceptable **only**
> because that directory contains exclusively the 8 target files (confirm via step 0 first).

---

## 4. Verification Commands (recommendation)

```bash
# A. Confirm all 8 now tracked
git ls-files architecture/platform/adr/        # expect: 8 paths

# B. Confirm commit recorded and isolated (exactly 8 files changed)
git show --stat --oneline HEAD | head -20      # expect: 8 files, all under architecture/platform/adr/

# C. Confirm nothing else was swept in
git show --stat HEAD | grep -v 'architecture/platform/adr/' | grep -E '\.md|\.txt' || echo "ISOLATED: no foreign paths"

# D. Confirm working tree no longer lists the adr dir as untracked
git status --short architecture/platform/adr/  # expect: empty

# E. Content integrity (sizes unchanged vs audit)
wc -c architecture/platform/adr/*.md           # expect total 69912 bytes

# F. History now exists for the set
git log --oneline -- architecture/platform/adr/ | head
```

---

## 5. Rollback Strategy

Because this is an **append-only new commit of new files**, rollback is low-risk and non-destructive:

| Situation | Rollback (recommendation) |
|-----------|---------------------------|
| Wrong files staged (pre-commit) | `git restore --staged <path>` for each unwanted path; re-verify `git diff --cached --name-only` |
| Bad commit, **not yet pushed** | `git reset --soft HEAD~1` (keeps files as staged) **or** `git reset --mixed HEAD~1` (keeps files, unstages). **Do not** use `--hard` (would risk the untracked content). |
| Commit content wrong | Make a **new** corrective commit (never `--amend` a shared/pushed commit) |
| Need to inspect before deciding | `git show HEAD`, `git diff HEAD~1 HEAD -- architecture/platform/adr/` |

> **Never** use `git reset --hard`, `git clean -fd`, or `git checkout -- .` during this remediation — those
> would endanger the still-untracked governance artifacts (§6). All recommended rollbacks are
> content-preserving.

---

## 6. Interaction with Untracked Governance Artifacts

Current untracked set (besides the C-4 ADRs), from `git status --short`:

| Untracked path | Class | Recommended handling |
|----------------|-------|----------------------|
| `UCOS-SVC-RAT-001.md` | Governance review (C-2) | Preserve in a **separate** dedicated commit (own scope) |
| `architecture/security/UCOS-SEC-RAT-001.md` | Governance review (C-3) | Preserve in a **separate** dedicated commit |
| `PHASE-10.3-CONDITION-REASSESSMENT.md` | Governance assessment | Preserve in a **separate** dedicated commit |
| `AUTHORITY-BOARD-RATIFICATION-PACKAGE.md` | Board package | Preserve in a **separate** dedicated commit |
| `AUTHORITY-BOARD-DECISION-RECORD.md` | Board decision record | Preserve in a **separate** dedicated commit |
| `C4-ADR-REPOSITORY-PRESERVATION-AUDIT.md` | Audit | Preserve in a **separate** dedicated commit |
| `C4-ADR-PRESERVATION-REMEDIATION-PLAN.md` (this file) | Plan | Preserve in a **separate** dedicated commit |
| `all-files.txt`, `markdown-files.txt` | **Scratch / generated listings** | **Do NOT commit.** Recommend `.gitignore` entries or leave untracked |

**Recommendation:** keep the **C-4 ADR preservation commit isolated** from these. Governance review/board
artifacts should be preserved in **their own separate commits** (one per logical set), so SCM history
mirrors governance lineage and no artifact is bundled. This directly remediates the prior bundling
observation (OBS-1 / N-4 at `0ad488c`). The two scratch listing files should be excluded entirely.

> **Note (O-2 divergence):** `STATE-001`/`CTX-REG-001` are already committed and *reference* the C-4 ADRs;
> committing the ADRs (§3) closes the ledger-vs-repo divergence. No state/registry edit is needed for
> preservation itself.

---

## 7. Interaction with the Reported R-6 Anomaly (83 GB file)

- **Current status:** `architecture-references.txt` is **ABSENT** from the working tree at planning time
  (`ls -la` → not found). The R-6 hazard that previously made bulk staging dangerous **appears already
  remediated**.
- **Plan impact:** the primary reason `git add .` was unsafe is gone. Nonetheless, the strategy **still
  mandates explicit-path staging** (defense-in-depth; other untracked scratch files remain).
- **Pre-flight check (recommendation):** before any staging, re-confirm the anomaly has not reappeared:
  ```bash
  ls -la architecture-references.txt 2>/dev/null && echo "WARNING: anomaly present — DO NOT bulk-stage" || echo "OK: anomaly absent"
  find . -path ./.git -prune -o -type f -size +100M -print   # expect: no oversized files
  ```
- If the anomaly (or any >100 MB file) is present, **abort bulk operations**, quarantine/remove it under a
  separate authorized task, and proceed only with the explicit 8-path staging in §3.

---

## 8. Post-Preservation Validation Steps

1. **Tracking:** `git ls-files architecture/platform/adr/` returns 8 paths (§4-A).
2. **Isolation:** `git show --stat HEAD` shows exactly 8 files, all under `architecture/platform/adr/` (§4-B/C).
3. **Integrity:** `wc -c` totals 69,912 bytes; ADR contents byte-identical to pre-commit (no normalization).
4. **History:** `git log -- architecture/platform/adr/` now shows the preservation commit (§4-F).
5. **Cross-reference recheck:** index still lists all 7 ADRs; all referenced files tracked (re-run audit §6).
6. **Ledger reconciliation (separate task):** confirm `CTX-REG-001` C-4 entries now point to committed files;
   if a state/registry note is desired, perform it as an **append-only** governed update in a separate task
   (out of scope here).
7. **Governance-artifact preservation (separate commits):** preserve the §6 review/board/audit/plan files,
   each in its own scoped commit; add `.gitignore` for scratch files.
8. **Re-audit:** re-run `C4-ADR-REPOSITORY-PRESERVATION-AUDIT` to confirm conclusion moves to **PASS**
   (preserved, tracked, intact).

---

## 9. Determinations

### 9.1 Can preservation be completed independently?
**YES.** The 8 ADR files can be staged by explicit path and committed in a single isolated commit with **no
dependency** on any other workstream, **no** broad SCM operation, and **no** state/registry edit. With the
R-6 anomaly absent, the operation is **safe and self-contained**.

### 9.2 Should governance artifacts be preserved separately?
**YES.** The untracked governance review/board/audit/plan artifacts (§6) should each be preserved in **their
own dedicated, scoped commits**, not bundled with the C-4 ADRs or with one another where they belong to
distinct governance acts. This mirrors governance lineage in SCM history and remediates the prior bundling
defect (OBS-1/N-4). Scratch listings (`all-files.txt`, `markdown-files.txt`) should be **excluded**
(`.gitignore` or leave untracked).

### 9.3 Can C-4 evidence be safely committed without broad SCM operations?
**YES.** Explicit-path staging of only the eight `architecture/platform/adr/` files, gated by a
`git diff --cached --name-only` check, commits the C-4 evidence with **zero** broad SCM operations (no
`git add .`, no `-A`, no `--hard`, no `clean`). The pre-flight anomaly check (§7) provides defense-in-depth.

---

## 10. Confirmations (scope discipline)
- **Nothing executed; nothing committed.** ✅
- **No file modified** except creation of this plan document. ✅
- **`STATE-001` not updated; `CTX-REG-001` not updated.** ✅
- **Article IX lock not released; no implementation authorized.** ✅
- All `git` commands above are **recommendations for a future authorized remediation task**. ✅

## Traceability
- **Refines:** `C4-ADR-REPOSITORY-PRESERVATION-AUDIT` (`UCOS-C4-ADR-AUDIT-001`), `PHASE-10.3-CONDITION-REASSESSMENT` (R-5/R-6/R-7), `AUTHORITY-BOARD-DECISION-RECORD` (FA-1/FA-7/FA-9, R-6), `UCOS-PLAT-ADR-INDEX`, `AUTH-010`, `UCOS-CONST-001` (Art. XI preservation/immutability).
- **Refined by:** a future authorized preservation remediation task (scoped commits) and a re-audit.
- **Owner:** Repository Governance / Platform Governance (subordinate to Authority Board).

**END C4-ADR-PRESERVATION-REMEDIATION-PLAN — PLAN ONLY · NOT EXECUTED · independent preservation FEASIBLE & SAFE · governance artifacts to be preserved SEPARATELY · C-4 commit SAFE without broad SCM.**
