# MEM-TEST-003 — Adversarial Coverage Closure Report

| Field | Value |
|-------|-------|
| Artifact ID | `MEM-TEST-003` |
| Phase | **PHASE 18.2-R2 · PI-9 Memory Fabric — Adversarial Coverage Remediation** |
| Mode | Remediation of PHASE 18.3-R rejection (`MEM-RAT-002`); test-first, minimal fail-closed enforcement |
| Scope | Close canonical `MEM-THREAT-001` **M8 / M11 / M12** adversarial-coverage gap only |
| Verdict | **CLOSED** — M1–M12 all have explicit fail-closed adversarial coverage; suite green; tsc clean |

---

## 1. Mandate & basis

`MEM-RAT-002` (PHASE 18.3-R) **REJECTED** PI-9 on a single hard failure — verify item 7,
"M1–M12 pass" — because three canonical threats had **no dedicated adversarial test** and therefore
could not be reproduced as passing by an independent validator (`MEM-RAT-SEC-002` finding **F-M-1**):

- **M8** — Consolidation authority escalation / self-promotion (SoD C4≠C5≠C6).
- **M11** — Semantic drift / memory↔knowledge desynchronisation (co-ratification).
- **M12** — Working-memory exhaustion (WM/STM size caps).

This remediation adds **only** the missing fail-closed adversarial coverage (plus the minimal
enforcement strictly required to make the M11/M12 denials real), preserving the ratified Memory Fabric
behaviour, architecture, security model, federation, ontology, and knowledge fabrics.

> **Numbering note.** The pre-existing `test/memory-adversarial.test.ts` uses an *internal* M1–M12
> labelling (its M8=Trust-Inflation, M11=Revocation, M12=Evolution-Bypass). The validator assessed the
> **canonical `MEM-THREAT-001`** numbering. This report and the new suite
> `test/memory-adversarial-canonical.test.ts` are written in the **canonical** numbering, closing the
> exact three gaps the validator identified. The internal suite is unchanged.

---

## 2. What was added

### 2.1 Test-only (M8 — enforcement already present)
M8 was already fully enforced in production (`governedCommit` + `MemoryCertificationAuthority` +
`MemoryRatificationAuthority`: enumerated powers, `consolidate ≠ certify ≠ ratify` at both issue-time
and verify-time, unit-hash binding, signature verification). Only the adversarial **tests** were
missing; they are added — **no production change for M8**.

### 2.2 Minimal fail-closed enforcement strictly required (M11, M12)
An independent validator cannot reproduce a *rejection* that the code does not perform. M11
(co-ratification) and M12 (size caps) had **no** enforcement (only a `knowledgeRef` field and
time-based retention). Per the remediation restriction *"no production code changes unless strictly
required"*, two **minimal, additive, opt-in, fail-closed** controls were introduced. Both reuse
existing primitives, add **no** custom cryptography, touch **no** core dir, and change **no** default
behaviour:

| Module | Purpose | Opt-in / default-safe |
|--------|---------|-----------------------|
| `src/control/memory/memory-knowledge-guard.ts` | M11 memory↔knowledge co-ratification: a **semantic**-tier memory carrying a `knowledgeRef` may commit/recall only while the referenced knowledge is co-ratified (`active`/`ratified`); dangling/revoked/superseded/rolled-back ⇒ **deny**. Consults an injected read-only `MemoryKnowledgeOracle`; never dereferences or mutates knowledge. | Only engages for `semantic` records with a `knowledgeRef`. No existing test creates such records ⇒ zero baseline impact. |
| `src/control/memory/memory-capacity.ts` | M12 volatile-capacity: caps the number of distinct **live** records admitted to a `working`/`short-term` namespace; accumulation beyond the configured cap is **denied before persistence**. Bounds SIZE where retention bounds TIME. | Cap **unset ⇒ unbounded** (default behaviour preserved). Enforced only when a deployment configures a cap. |

Wiring (in `memory-control.ts`, the single controlled entry point):
- `MemoryOptions` gains optional `capacity?` and `knowledge?`.
- `commit()` runs the M11 gate then the M12 gate **after** the unit-hash integrity check and **before**
  evolution-routed persistence (fail-closed abort).
- `recall()` re-validates co-ratification for knowledge-backed semantic records (M11 knowledge-rollback),
  returning `undefined` + auditing `MEM_RECALL_DENIED` on desync (consistent with existing
  deny-by-default / no-synthesis recall).

Cross-reference **tampering** (M11) needs no new code: mutating `knowledgeRef` changes `unitHash`, so the
existing integrity check rejects it (proven by test M11.4).

---

## 3. Adversarial coverage matrix (canonical M1–M12)

| Threat | Canonical meaning | Coverage | Suite · test |
|--------|-------------------|:--------:|--------------|
| M1 | Memory poisoning (forged write) | ✅ prior | `memory-adversarial` (tamper/invalid-sig) |
| M2 | Cross-tier/boundary leakage | ✅ prior | `memory-security` (clearance projection) |
| M3 | Unbounded retention (time) | ✅ prior | `memory` / `memory-security` (fail-closed expiry) |
| M4 | Recall fabrication | ✅ prior | `memory-security` (no-synthesis deny+audit) |
| M5 | Federation poisoning/override | ✅ prior | `memory-federation` (deny-by-default, sovereignty) |
| M6 | Partition/stale recall | ✅ prior | `memory-federation` (partition fail-closed) |
| M7 | Assertion replay | ✅ prior | `memory-federation` (nonce/freshness) |
| **M8** | **Consolidation authority escalation / self-promotion (SoD)** | ✅ **NEW** | `memory-adversarial-canonical` **M8.1–M8.5** |
| M9 | Forgetting failure (two-sided) | ✅ prior | `memory-security` (audit-preserving forget) |
| M10 | Memory audit divergence/tamper | ✅ prior | `memory-security` (hash-break detected) |
| **M11** | **Semantic drift / memory↔knowledge desync (co-ratification)** | ✅ **NEW** | `memory-adversarial-canonical` **M11.1–M11.5** |
| **M12** | **Working-memory exhaustion (size caps)** | ✅ **NEW** | `memory-adversarial-canonical` **M12.1–M12.5** |

**M1–M12: 12/12 with explicit adversarial coverage.**

### 3.1 New DENY vectors (all fail-closed; expected outcome DENY)

**M8 — Consolidation authority escalation / self-promotion**
- **M8.1** self-promotion: one actor acting as consolidator+certifier (and consolidator+ratifier) ⇒ SoD **DENY**.
- **M8.2** forged consolidation authority: mis-signed certification, and post-issue identity-swap ⇒ **DENY**.
- **M8.3** SoD at commit (defence-in-depth): a validly-signed but role-collapsing ratification ⇒ **DENY**.
- **M8.4** unauthorized consolidation: a consolidator stripped of the `consolidate` power ⇒ **DENY**.
- **M8.5** privilege escalation: empty-power authority rejected; unregistered consolidator ⇒ **DENY**.

**M11 — Memory↔knowledge desynchronisation**
- **M11.1** desync: semantic memory backed by `revoked`/`superseded`/`draft` knowledge ⇒ **DENY**.
- **M11.2** `knowledgeRef` validation: dangling/unknown ref, and knowledge-backed semantic memory with **no** oracle ⇒ **DENY**.
- **M11.3** co-ratification holds: admitted **only** while backing knowledge is `active`/`ratified` (positive control — gate is not blanket-deny).
- **M11.4** cross-reference tampering: repointing `knowledgeRef` post-hash ⇒ unit-hash mismatch **DENY**.
- **M11.5** knowledge rollback: recall **DENY** after backing knowledge is revoked/rolled-back.

**M12 — Working-memory exhaustion**
- **M12.1** working-memory cap: accumulation beyond the `working` cap ⇒ **DENY**.
- **M12.2** STM cap: accumulation beyond the `short-term` cap ⇒ **DENY**.
- **M12.3** flooding: a 20-write burst is bounded **exactly** at the cap; live population never exceeds it.
- **M12.4** unbounded accumulation **DENY**, while re-versioning an existing id is admitted (no false positive); cap still holds.
- **M12.5** opt-in only: an unconfigured tier is unbounded (default behaviour preserved); `long-term` is never size-capped.

---

## 4. Reproduction evidence

```
# packages/platform-runtime
npm run typecheck        # tsc --noEmit -p tsconfig.json  → 0 errors
node --test "test/*.test.ts"
  → tests 269 / pass 269 / fail 0   (254 baseline preserved + 15 new canonical adversarial)
```

- **TypeScript:** `tsc --noEmit` → **0 errors**.
- **Full suite:** **269 / 269 pass, 0 fail** (was 254; +15 new M8/M11/M12 DENY tests). The 254-test
  baseline (which itself preserves the ≥213 foundation) is **unchanged and green**.
- **Core-dir integrity:** `src/{meta-core,registry-runtime,metadata-runtime,configuration-runtime,contracts}`
  — **0 files modified** in the remediation window.
- **No custom crypto:** the two new modules contain **no** `createHash/createSign/createCipher/randomBytes/
  createHmac/pbkdf2/scrypt` and import no crypto; they reuse existing fabric primitives only.

### 4.1 Files changed (remediation surface — all under `src/control/memory/` + `test/`)
- `src/control/memory/memory-knowledge-guard.ts` *(new)* — M11 co-ratification guard.
- `src/control/memory/memory-capacity.ts` *(new)* — M12 volatile-capacity control.
- `src/control/memory/memory-control.ts` *(modified)* — opt-in wiring of the two gates (commit + recall).
- `src/control/memory/index.ts` *(modified)* — export the two new symbols.
- `test/memory-harness.ts` *(modified)* — backward-compatible `buildMemory(partition?, extra?)` for caps/oracle.
- `test/memory-adversarial-canonical.test.ts` *(new)* — 15 fail-closed M8/M11/M12 DENY tests.

---

## 5. Restriction compliance

| Restriction | Status |
|-------------|:------:|
| No Memory Fabric **behaviour** change (defaults) | ✅ opt-in controls; unset ⇒ prior behaviour |
| No architectural change | ✅ additive guards; single entry point unchanged |
| No security-model change | ✅ reuses SoD/authorities/retention patterns; no crypto |
| No public API break | ✅ only **optional** `MemoryOptions` fields + additive exports |
| No federation / ontology / knowledge change | ✅ knowledge consulted read-only via injected oracle; PI-7/PI-8 untouched |
| No prohibited-core-dir changes | ✅ 0 core-dir files modified |
| No custom cryptography | ✅ none introduced |
| Prefer test-only; production only if strictly required | ✅ M8 test-only; M11/M12 minimal enforcement required to make DENY real (documented) |

---

## 6. Determination

The three canonical gaps (M8/M11/M12) are closed with explicit **fail-closed DENY** adversarial tests,
backed by minimal opt-in enforcement where none existed. **M1–M12 are now all adversarially covered**,
the full suite is green (269/269), TypeScript is clean, no core dir changed, and no custom cryptography
was added. Ready for re-validation.

## Traceability
- **Refines / closes:** `MEM-RAT-002` (verify item 7), `MEM-RAT-SEC-002` (F-M-1: M8/M11/M12).
- **Inputs:** `MEM-RAT-VAL-002`, `MEM-RAT-SEC-002`, `MEM-RAT-AUD-002`.
- **Design basis:** `MEM-THREAT-001` (M1–M12), `MEM-GOV-001` (C4/C5/C6 SoD; §2.4 semantic/knowledge),
  `MEM-GOV-002` (§2 retention/capacity), `MEM-SEC-001`, `AD-0023`, AUTH-008 (S1/S3/S4), AUTH-009.
- **Owner:** PI-9 Memory Fabric construction track.

**END MEM-TEST-003 — Adversarial Coverage Closure Report.**
