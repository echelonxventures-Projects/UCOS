# MCS-1 — F-2 Content-Anchor Remediation Design

## PHASE U23 — Content-Sensitive Integrity Model for RM-2 Readiness (Design Only)

| Field | Value |
|-------|-------|
| Artifact | **MCS-1 — F-2 Content-Anchor Remediation Design** |
| Artifact ID | `MCS-1-F-2-CONTENT-ANCHOR-REMEDIATION-DESIGN` |
| Phase | **U23 — F-2 Content-Anchor Remediation Design** |
| Layer | GOVERNANCE / ASSURANCE (gap-closure design — specifies an integrity anchor; implements nothing) |
| Version | 1.0.0 |
| Date | 2026-07-02 |
| Mode | **DESIGN ONLY** — close finding F-2 by specifying a content-sensitive integrity anchor for RM-2 readiness. **No execution, no `git` mutation, no baseline replacement, no authorization activation, no governance modification.** Read-only hashing was used to concretize the anchor value. Append-only. |
| Authoritative inputs (per mandate) | `MCS-1-S0-PRIME-BASELINE-RECONCILIATION` (S0′; anchor model), `MCS-1-G-A-AUTHORIZATION-ACTIVATION-REVIEW` (A-1..A-7), `MCS-1-RM-2-GO-STATE-CERTIFICATION` (NOT CERTIFIED; F-2 MEDIUM / F-1 LOW) |
| Read-only substantiation | `git hash-object` over the protected set (working-tree bytes) + `shasum -a 256`; no mutation |
| Governance status | INV-1..13 unchanged; AD-0014 intact; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |
| **Determination** | **ACCEPT** the design — a deterministic content anchor over the RM-2 authorization-of-record inputs closes F-2. With it added to S0′ Pre-Flight, **A-1..A-7 + content-anchor check is NECESSARY and SUFFICIENT for RM-2 GO** (§ Required Determination). |

---

## 1. F-2 Root Cause Analysis

**Why the tracked-index digest is insufficient for authorization content integrity:**
- The S0′ anchor `git ls-files -s | shasum` enumerates **index entries** — mode, **blob object id**, stage, path — for **staged/committed** content.
- At S0′ nothing is staged, so the index blob ids equal the **committed** blobs (the stale ≤ v1.0.5 ledger, etc.).
- **Unstaged working-tree edits do not touch the index.** Editing `AUTH-012-DECISION-LOG.md` in the working tree changes the file bytes but **not** its index entry (until `git add`). Therefore `git ls-files -s` — and its digest `d0d60914…` — is **invariant** under exactly the changes RM-2 cares about.
- The digests that *would* detect such a change (working-status digest, untracked-set digest) were **demoted to volatile/non-authoritative** in U20 to tolerate additive evidence growth.
- **Net:** the accepted S0′ fingerprint pins *which files exist and what is committed*, but **not the working-tree content that RM-2 will actually commit** for the authorization-of-record. That is the F-2 blind spot (FG-1).

---

## 2. Protected Artifact Set

Artifacts whose **content** must be integrity-pinned for RM-2 GO:

### Mandatory (RM-2 authorization-of-record inputs — 32 paths)
| Group | Members |
|-------|---------|
| Canonical ledger + registry + state (modified-tracked) | `.claude/authority/AUTH-012-DECISION-LOG.md`, `.claude/authority/AUTHORITY-INDEX.md`, `.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md` |
| AD authorizations (untracked) | `AD-0016`, `AD-0017`, `AD-0018`, `AD-0019`, `AD-0020`, `AD-0021`, `AD-0022`, `AD-0023` |
| Authority-chain + program (untracked) | `AUTH-CONST-001`, `AUTH-REST-001..004`, `GOV-REC-001` |
| Authorization reviews (untracked) | `FGA-2`, `INT-AUTH-001` (recommendation + reauth), `INT-AUTH-002..004`, `INT-AUTH-REV-001..004`, `ONTO-AUTH-REV-001..004` |

### Recommended (RM-3 inputs — pin before RM-3, not required for RM-2 GO)
- `packages/platform-runtime/README.md`, `docs/enterprise-architecture/UCOS-ENTERPRISE-ARCHITECTURE.md`, `.gitignore` (the other 3 modified-tracked); `packages/platform-runtime/src/**`, `architecture/**` (RM-3 body — durability via RM-3 subtree tree-hash, already specified).

### Informational (RM-4 evidence corpus — additive, tolerated)
- The growing `MCS-1-*.md` set and remaining `PI*/ONTO*/MEM*/UCOM*/REAL*/CONST-READY*` evidence — covered by RM-4 allowlist guard; not part of the RM-2 content anchor (so evidence growth does not perturb it).

---

## 3. Content Anchor Design

**Model: `RM2-CONTENT-ANCHOR` — deterministic content fingerprint of the mandatory set.**

- **Inputs:** the 32 mandatory paths (§ 2), read from the working tree (captures unstaged edits).
- **Canonical ordering:** paths sorted by **ASCII / `LC_ALL=C`** order (deterministic; documented list in § 4).
- **Hash method (two-layer, reproducible in one command):**
  - Inner: `git hash-object <path>` per file — the git blob id of the **working-tree bytes** (SHA-1 with git's length-prefixed framing).
  - Outer: `shasum -a 256` over the newline-joined inner outputs, in canonical order.
  - Canonical command:
    ```bash
    git hash-object <32 paths in ASCII order> | shasum -a 256
    ```
- **Change-detection rule:** any byte change to any protected file changes that file's inner blob id, which changes the outer sha256 ⇒ **anchor mismatch ⇒ fail-closed STOP**. Addition/removal of a protected path also changes the anchor (path-count/set change).
- **Verification method:** at RM-2 Pre-Flight, recompute `RM2-CONTENT-ANCHOR` and require exact equality to the pinned value below.

**Pinned value at S0′ (computed read-only this phase):**
```
RM2-CONTENT-ANCHOR (sha256 over git-hash-object of 32 mandatory paths, ASCII order)
  = 4416b3a776d37d9b60639dfe13d773928445c80f16a2e89f273dc945878ca7ca
```

---

## 4. S0′ Extension Specification (minimal; gap-closure only)

Add **one** authoritative anchor to the S0′ fingerprint (`MCS-1-S0-PRIME-BASELINE-RECONCILIATION` § 5); change nothing else.

| S0′ anchor set | Before (U20) | After (U23) |
|----------------|--------------|-------------|
| HEAD / tree / branch / upstream | authoritative | unchanged |
| Tracked-index digest `d0d60914…` | authoritative | unchanged |
| Modified-set (7 names) · src 0/138 · AD 0/8 · staged 0 | authoritative | unchanged |
| Additive-`*.md` tolerance rule | authoritative | unchanged |
| **`RM2-CONTENT-ANCHOR` = `4416b3a7…ca7ca`** | — | **ADDED (authoritative)** |

**Canonical path order (authoritative, ASCII):**
`.claude/authority/AUTH-012-DECISION-LOG.md`, `.claude/authority/AUTHORITY-INDEX.md`,
`.claude/context/UCOS-ARTIFACT-REGISTRY.md`, `.claude/state/PROJECT-STATE.md`,
`AD-0016…`, `AD-0017…`, `AD-0018…`, `AD-0019…`, `AD-0020…`, `AD-0021…`, `AD-0022…`, `AD-0023…`,
`AUTH-CONST-001…`, `AUTH-REST-001…`, `AUTH-REST-002…`, `AUTH-REST-003…`, `AUTH-REST-004…`,
`FGA-2…`, `GOV-REC-001…`,
`INT-AUTH-001-PI10-AUTHORIZATION-RECOMMENDATION.md`, `INT-AUTH-001-PI10-REAUTH-ONTOLOGY-MEMORY.md`,
`INT-AUTH-002…`, `INT-AUTH-003…`, `INT-AUTH-004…`,
`INT-AUTH-REV-001…`, `INT-AUTH-REV-002…`, `INT-AUTH-REV-003…`, `INT-AUTH-REV-004…`,
`ONTO-AUTH-REV-001…`, `ONTO-AUTH-REV-002…`, `ONTO-AUTH-REV-003…`, `ONTO-AUTH-REV-004…`.

**New RM-2 Pre-Flight step (added to G-B check):**
```bash
git hash-object <32 paths, ASCII order> | shasum -a 256   # MUST equal 4416b3a776d37...ca7ca
```

This is the **minimal** repair: one added, deterministic check. No baseline replacement, no new framework.

---

## 5. Safety Analysis (detection of FG-1 and similar)

- **FG-1 (silent `AUTH-012` edit):** any byte change to the ledger changes its `git hash-object` blob id → `RM2-CONTENT-ANCHOR` ≠ `4416b3a7…` → **Pre-Flight STOP**. The former blind spot is now closed.
- **Silent edit to any AD / review-chain file:** same mechanism — inner blob id changes → anchor mismatch → STOP.
- **Silent addition/removal of a protected file:** changes the hashed set (a path appears/disappears) → anchor mismatch → STOP.
- **Truncation / encoding change / whitespace-only edit:** all alter bytes → detected.
- **Result:** the content anchor is a **complete detector** for accidental/silent content drift across the entire RM-2 authorization-of-record input set — precisely the F-2 threat model.

---

## 6. Compatibility Analysis

- **U20 findings remain valid:** the drift classification (benign additive evidence) is untouched; the content anchor covers **only** the 32-path authorization-of-record set, **not** the growing `MCS-1-*.md` evidence corpus. Evidence growth therefore does **not** perturb `RM2-CONTENT-ANCHOR`.
- **G-B remains satisfiable:** as evidence accretes, the tracked-index digest, counts, and the content anchor all stay stable (evidence is neither tracked nor in the protected set); the additive-`*.md` tolerance rule is preserved. G-B passes so long as anchors + content anchor match.
- **No safeguard weakened:** the change is purely **additive and strengthening** — it *adds* a detector to SG-2/G-B. O-1/O-2/O-3, SG-1..SG-7, RM-4 allowlist guard, and the durability PASS criteria are unaffected. The volatile status/untracked digests remain informational (their demotion stands, now safely, because content integrity is covered by the targeted anchor).

---

## 7. Sufficiency Review

- **Does it fully close F-2?** **Yes** for F-2's threat model (silent/accidental content change to RM-2 inputs). Every mandatory input's working-tree content is pinned; any change is detected fail-closed.
- **Residual risks:**
  - **RR-A (LOW):** the inner layer uses git's **SHA-1** blob id. For **accidental/silent** drift (the F-2 threat) this is fully sufficient. For a **deliberate cryptographic collision** (out of F-2 scope), optionally add a pure `shasum -a 256` over raw file bytes as a second layer. Recorded as LOW, out-of-scope for F-2.
  - **RR-B (LOW):** the anchor pins content, not semantics — it guarantees the bytes are the intended v1.0.13, not that v1.0.13 is itself correct (that is the province of the prior authorization/certification chain, already of record).
  - **RR-C (INFO):** if the protected set legitimately changes before RM-2 (e.g., Board appends the RM-1 minute into `AUTH-012` **before** committing), the anchor must be **re-pinned** to the new intended content and re-accepted — a governed, deliberate re-baseline, not a silent drift. (Note: the package sequences the minute-append as the *first RM-2 action*, i.e., after GO, so the anchor holds through Pre-Flight.)

None of the residuals reopen F-2.

---

## 8. Remediation Recommendation

> **ACCEPT.** The `RM2-CONTENT-ANCHOR` design closes F-2 with a single deterministic, reproducible check that is
> additive to S0′, tolerant of evidence growth, and strengthening (never weakening) of existing safeguards. It
> is the minimal repair that restores fail-closed content integrity over the RM-2 authorization-of-record
> inputs.

---

## Required Determination

> ### WITH THE CONTENT-ANCHOR ADDED: IS "A-1..A-7 + CONTENT-ANCHOR CHECK" NECESSARY AND SUFFICIENT FOR RM-2 GO?
>
> # **YES**
>
> - **Necessary:** A-1..A-7 remain required (governance activation of G-A, closing G-F/G-G); and the content
>   anchor is required to guarantee the RM-2 inputs are the intended bytes. Removing either re-opens a blocker
>   (G-A pending, or the FG-1 content blind spot).
> - **Sufficient:** with A-1..A-7 complete and `RM2-CONTENT-ANCHOR = 4416b3a7…ca7ca` verified at Pre-Flight —
>   alongside the unchanged S0′ anchors (tracked-index `d0d60914…`, HEAD/branch/upstream, counts) and G-C/G-D —
>   every RM-2 start condition is satisfied **and content-verified**, defeating the FG-1 counterexample.
>   Therefore RM-2 GO is safely and completely entailed.
>
> The F-1 (stale S0 reference) note from U22 still applies as a LOW documentation item: RM-2 Pre-Flight uses
> S0′ (as extended here), superseding the S0 text in the pre-U20 instruments. This design is specification only
> — no anchor was enrolled, no baseline replaced, no authorization activated.

---

## Governance / Non-Implementation Statement

No `git` mutation, commit, push, tag, branch, or config change was performed; read-only `git hash-object` /
`shasum` were used to concretize the anchor value. No baseline replaced; no authorization activated; no lock
released; no invariant enrolled; no governance modified. This is an F-2 remediation **design** only. INV-1..13,
`AUTH-012` substance (v1.0.13), AD-0014, the Article IX generation lock, and `UCOS-CONSTRUCTION-BLOCKED` are
unchanged.

## Traceability
- **Consumes (authoritative):** `MCS-1-S0-PRIME-BASELINE-RECONCILIATION`, `MCS-1-G-A-AUTHORIZATION-ACTIVATION-REVIEW`, `MCS-1-RM-2-GO-STATE-CERTIFICATION`.
- **Produces:** `RM2-CONTENT-ANCHOR` design + pinned value (`4416b3a7…ca7ca`) + minimal S0′ extension + new Pre-Flight step.
- **Closes:** F-2 (MEDIUM). Notes F-1 (LOW) for the Pre-Flight supersession.
- **Feeds:** re-certification of "A-1..A-7 + content-anchor ⇒ RM-2 GO" (necessary and sufficient).
- **Subordinate to:** `AUTH-001..012`, `UCOS-CONST-001` (Art. IX/XII), Governance Baseline 1.0.0 (FROZEN), AD-0014.
- **Owner:** UCOS Authority Board (custodian: Chief Authority Architect).

**END MCS-1-F-2-CONTENT-ANCHOR-REMEDIATION-DESIGN — PHASE U23 · ROOT CAUSE: INDEX-DIGEST BLIND TO UNSTAGED
EDITS · `RM2-CONTENT-ANCHOR` = sha256(git-hash-object of 32 mandatory paths, ASCII order) = `4416b3a7…ca7ca` ·
DETECTS FG-1 · ADDITIVE / EVIDENCE-GROWTH-TOLERANT / NON-WEAKENING · RECOMMENDATION: **ACCEPT** · A-1..A-7 +
CONTENT-ANCHOR = NECESSARY AND SUFFICIENT → **YES** · DESIGN ONLY · NO EXECUTION / NO MUTATION / NO BASELINE
REPLACEMENT / NO AUTHORIZATION ACTIVATION / NO GOVERNANCE MODIFICATION PERFORMED BY THIS ARTIFACT.**
