# TOKEN / CREDIT OPTIMIZATION REPORT

**Artifact:** PROG-TOKEN-001
**Phase:** PHASE-P.1
**Status:** MEASURED

---

## 1. Problem

Before the Program Compiler, an agent resuming UCOS work had to *rediscover* the program: read the
authority corpus, phase reports, evidence packages, and roadmap fragments scattered across the
repository, then reconstruct roadmap + governance state in-context. This consumes enormous token /
credit budget on every session and is non-deterministic — different agents reconstruct different
pictures, and the previous session was itself interrupted by credit exhaustion (commit `1b18379`
"Checkpoint after Kiro credit exhaustion").

## 2. Measurement (this repository)

| Metric | Value |
|--------|-------|
| Markdown files in repo (excl. node_modules/.git) | **796** |
| Total markdown corpus size | **9,991,772 bytes (~9.99 MB)** |
| Approx. tokens to ingest full corpus (@ ~4 bytes/token) | **~2.50 million tokens** |
| `MINIMAL_CONTEXT.md` size | **2,978 bytes** |
| `next-work-item.json` size | **2,048 bytes** |
| Combined agent startup bundle | **5,026 bytes** |
| Approx. tokens for startup bundle | **~1,260 tokens** |

## 3. Result

```
Rediscovery cost   : ~9,991,772 bytes  (~2,500,000 tokens)
Compiler startup   :        5,026 bytes (~1,260 tokens)
Reduction factor   : ~1,988x  (≈ 99.95% fewer bytes to reach the next action)
```

A resuming agent no longer reads 796 files. It reads **one 3 KB file** (`MINIMAL_CONTEXT.md`) plus,
if it wants the machine-readable action, one 2 KB file (`next-work-item.json`). Everything needed to
choose and authorize the next step is present:

- current phase + completion %
- the single system-resolved next executable work item, with dependencies, acceptance criteria,
  required evidence, gates, and constitutional constraints
- the deterministic ready queue
- HIGH/CRITICAL blockers
- integrity warnings
- rules of engagement

## 4. Why it is safe to trust the small bundle

- The bundle is **generated**, not hand-authored, so it cannot drift from the registry.
- It is **deterministic**: identical registry → byte-identical bundle (fingerprint `a581025a35912a76`).
- It is **fail-closed**: unproven completion, cycles, and missing evidence surface as warnings/gaps
  rather than being silently omitted.
- `pnpm ucos:verify` proves determinism + integrity on demand.

## 5. Anti-Skip / Anti-Deviation contribution

Token optimization is not just cheaper — it is *safer*. Because the agent is handed exactly one
next action and an authorization gate (`pnpm ucos:authorize <id>`), it cannot:

- **skip** ahead to un-ready work (BLOCKED items are excluded from the ready queue), or
- **deviate** to unregistered work (authorization rejects anything not in the registry).

The minimal bundle removes both the *incentive* (no need to go spelunking) and the *ability*
(the system, not the agent, resolves the next step) to burn credits on rediscovery.

## 6. Reproduction

```
find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*" | wc -l      # 796
find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*" -exec cat {} + | wc -c   # 9,991,772
wc -c MINIMAL_CONTEXT.md registry/program/next-work-item.json                        # 5,026 total
```
