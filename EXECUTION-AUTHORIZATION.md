# EXECUTION-AUTHORIZATION

**Artifact:** PROG-EXEC-AUTH-001
**Phase:** PHASE-N.2 — Post-PI11 Constitutional Recompilation (WS5)
**Subject work item:** `Prompt-05` — Payload Authoring (ConfigurationValue, MetadataRecord, FeatureFlag, RegistryArtifact, DiscoveryRecord)
**Authority:** Constitutional Program Compiler `authorize` gate + constitutional constraint review.
**Determinism:** fingerprint `8d1c9b6af2ae03c1`

---

## 1. Compiler authorization (structural gate) — `ucos:authorize Prompt-05`

| Check | Result | Detail |
|-------|:------:|--------|
| registered | ✅ PASS | Prompt-05 is registered in `PROG-WI-001`. |
| dependencies-satisfied | ✅ PASS | No dependency edges; vacuously satisfied. |
| required-evidence-known | ✅ PASS | `EV-PROMPT-05` declared in `PROG-EVID-001`. |
| constitutional-gate-satisfied | ✅ PASS | No hard constitutional block at the gate level. |
| **Decision** | **AUTHORIZED** | "Prompt-05 may proceed." |

The compiler's anti-deviation gate confirms Prompt-05 is a **legitimate, in-scope, non-deviant**
target. It does **not** assert that the work is software-executable — that is a separate content
determination below.

## 2. Dependency satisfaction

- Inbound edges to Prompt-05: **none**. Prompt-05 is a root of the Contract-Authoring chain.
- Downstream: `Prompt-08 → Prompt-05 → (Prompt-09 via Prompt-08)`. Nothing upstream to satisfy.
- **Status: SATISFIED.**

## 3. Evidence requirements

- Required: `EV-PROMPT-05` — current state **PENDING** (`artifact: null`, `report: null`).
- To reach COMPLETE, evidence must reach **≥ VERIFIED**, which requires an authored, ratifiable
  artifact. **No artifact exists yet.**
- **Status: NOT SATISFIED (open, as expected for a not-yet-executed item).**

## 4. Constitutional locks

- Prompt-05 is bound to **no** constitutional lock. `constitutional-locks.json` covers only
  REAL-C-03/04/05. **Status: NO LOCK APPLIES.**

## 5. External blocker status

- Prompt-05 appears in **no** entry of `external-blockers.json`. It is **not EXTERNAL_BLOCKED** in
  the Board/Adjudicator/Operations sense. **Status: NO EXTERNAL BLOCKER REGISTERED.**

## 6. Authorization chain

- Owner: *Prompt 07 / Contract Authority*.
- Governing constraint: **"Payload authority = Prompt 07"** and acceptance criterion
  **"no fabricated schemas beyond contract authority."**
- Upstream content authority for the payload **fields**: **`UCOS-PDATA-ARCH-001`** (Data
  Architecture), which the contract catalog (`UCOS-CONTRACT-CAT-001`) and the field-schema registry
  README both name as the owner and explicitly mark the field-level schemas **"NOT DEFINED IN
  CATALOG"** / **"not invented here."**

---

## 7. Determination

| Gate | Verdict |
|------|:-------:|
| Structural authorization (compiler) | ✅ AUTHORIZED |
| Dependencies satisfied | ✅ YES |
| External blocker | ✅ none registered |
| Constitutional lock | ✅ none applies |
| **Content authority available to software** | ❌ **NO** |
| **Software-executable without fabrication** | ❌ **NO** |

### Verdict: **AUTHORIZED-BUT-NOT-EXECUTABLE (CONTENT-BLOCKED)**

Prompt-05 passes every **structural** authorization gate, but its execution is barred by a **hard
constitutional content constraint**. Authoring the five field-level payload schemas requires
authoritative field definitions owned by `UCOS-PDATA-ARCH-001`. That authority is **Wave-A
domain-only**: physical/logical data entities and their attributes are **deferred to a later
authorized phase** (principle PP-G; PROJECT-STATE: "the Data Architecture (Prompt 05) is derived …
only in a later authorized phase"). No field-level source exists in-repo.

Therefore any concrete schema a software agent writes would be **fabrication beyond contract
authority** — a direct violation of:
- Prompt-05 acceptance criterion #2 ("no fabricated schemas beyond contract authority"),
- the field-schema registry README ("authored + ratified through governed change, **not invented here**"),
- both catalog contracts' `generationConstraints` ("MUST NOT be invented by the generator"),
- Service/Contract architecture principle **P6** ("Data referenced, never redefined … no new schema invented"),
- the fail-closed design invariant of the whole program (WS3 evidence discipline).

**Execution is withheld under the fail-closed rule.** The correct output is a blocker report, not a
fabricated implementation. See `PROMPT-05-BLOCKER-REPORT.md`.

> Because the compiler's `authorize` gate is structural, this determination does **not** contradict
> it: the compiler correctly says "not deviant / may proceed"; the constitutional content review
> correctly says "the authoritative content a compliant execution needs does not exist and cannot be
> manufactured by software." Both are true simultaneously.

---

**Traceability:** `PROG-ARCH-001`, `PROG-WI-001`, `PROG-EVID-001`, `PROG-EXT-BLOCKER-001`,
`PROG-LOCK-001`; `UCOS-CONTRACT-CAT-001`; `UCOS-PDATA-ARCH-001`; `UCOS-SVC-ARCH-001` (P6);
AUTH-004/007/009; UCOS-CONST-001 (Art. IV contract-first).
