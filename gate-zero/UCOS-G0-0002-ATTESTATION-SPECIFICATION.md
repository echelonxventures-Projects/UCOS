# UCOS-G0-0002 — Gate Zero Attestation Specification

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-G0-0002` |
| Program | **UCOS Gate Zero Authority — Final G0 Dossier** |
| Phase | G0-2 — Attestation Package |
| Mode | **ATTESTATION SPECIFICATION ONLY** — defines the exact attestation package that discharges EA-B-P0-1. Produces no attestation, gathers no signatures, and lifts no lock. |
| Status | G0 DOSSIER BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Inputs (read-only, frozen) | `UCOS-G0-0001`; `UCOS-EA-0001/0002/0003`; `UCOS-RA-0007 §1`; `AUTH-REST-004`; `ONTO-RAT-001`; `MEM-RAT-003`; `MEM-RAT-001` (superseded); `UCOS-EXEC-0001` (Prohibition 12; A-7); `UCOS-EP-0005 §1/§2`; `AUTH-012` v1.0.13 |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. No self-attestation. |

---

## 0. Purpose & scope

This artifact specifies the **exact attestation package** whose existence-of-record satisfies **AT-P0-1** and
closes **EA-B-P0-1** (atomic requirements `P0-1.a..d` of `UCOS-G0-0001`). It fixes the required **documents,
signatures, measurements, artifacts, and verification chain**. It is executable **now, under the standing
block** — attestation is an evidentiary act, not a build (`UCOS-RA-0007 §1`). The package binds one production
package: `EWP-00-ATTEST` (approval class **A**, `UCOS-EP-0005 §1`).

**Independence rule (non-waivable).** The attesting party must be **independent of the authoring / self-attesting
process**. Self-attestation is rejected of record (`UCOS-EA-0003 §2`; `UCOS-EXEC-0001` Prohibition 12;
`UCOS-EP-0005 §2` "No self-attestation").

---

## 1. Attestation subjects (what is attested)

| # | Subject | Documentary basis (read-only) | Atomic req. |
|:--:|---------|-------------------------------|:-----------:|
| S-1 | Reconciled authority chain `AUTH-012` v1.0.13, AD-0001..0023 enrolled | `AUTH-REST-004` (documentary restoration); `AUTH-012` ledger | P0-1.a |
| S-2 | PI-8 (Ontology) ratification | `ONTO-RAT-001` | P0-1.b |
| S-3 | PI-9 (Memory) ratification; supersession of REJECTED `MEM-RAT-001` | `MEM-RAT-003`; `MEM-RAT-001` (superseded) | P0-1.c |
| S-4 | Pre-construction enrollment-gate state | `REAL-H-07` gate | P0-1.d |

> The documentary layer (S-1..S-3) is already **of record but self-attested**; this package converts it to
> **independently attested** (`UCOS-EA-0001 §3`: "documentary layer closed; evidentiary PENDING").

---

## 2. Required documents

| Doc | Title | Content | Producer |
|-----|-------|---------|----------|
| **D-1** | `REAL-C-05` Independent Adjudication Report | End-to-end review of S-1..S-3; finding per subject (ATTESTED / NOT-ATTESTED); explicit statement that no authoring party contributed to the finding | Independent adjudicator |
| **D-2** | Chain-enrollment schedule | AD-0001..0023 mapped to `AUTH-012` v1.0.13 entries; phantom `AD-0021` disposition (withdrawn/superseded) recorded | Independent adjudicator |
| **D-3** | Ratification-supersession note | `MEM-RAT-003` supersedes REJECTED `MEM-RAT-001`; `ONTO-RAT-001` current | Independent adjudicator |
| **D-4** | `REAL-H-07` gate result record | PASS/FAIL of the pre-construction enrollment gate on the attested state | Gate operator (deterministic) |

---

## 3. Required signatures

| Sig | Signatory | Binds | Rule |
|-----|-----------|-------|------|
| **SIG-1** | Independent adjudicator | D-1, D-2, D-3 | Must not be the authoring / self-attesting party (independence declaration included) |
| **SIG-2** | Certification/gate operator | D-4 | Deterministic operator of `REAL-H-07` |
| **SIG-3** | UCOS Authority Board (acceptance) | Acceptance-of-record of D-1..D-4 | Authority Board accepts; recorded on `AUTH-012`; **not** a lift act (that is `EWP-00-LIFT`, A-1) |

> Signatures are **append-only** and **tamper-evident** (S6; INV-10; `UCOS-EP-0005 §2`). SIG-3 is an
> acceptance of evidence, distinct from the P0-3 lift act.

---

## 4. Required measurements

| Meas | Quantity | Required value | Source |
|------|----------|----------------|--------|
| **M-1** | `REAL-H-07` gate result | **PASS** | D-4 |
| **M-2** | Subjects attested (S-1..S-4) | **4 of 4 ATTESTED** | D-1 + D-4 |
| **M-3** | Self-attestation reliance | **0** (independence declared) | D-1 (SIG-1) |
| **M-4** | Chain consistency for downstream P1-7 | AD-0001..0023 @ v1.0.13, no gaps | D-2 |

> The program-state test-count measurement (269/269) is **not** owned here — it is the reproducibility package
> `UCOS-G0-0003`. This package attests the **chain and ratifications**; it consumes P0-2's 269/269 only as a
> cross-consistency input for P1-7.

---

## 5. Required artifacts (of record)

- `REAL-C-05` (D-1) — the independent adjudication report.
- `REAL-H-07` gate result (D-4).
- Enrolled `AUTH-012` v1.0.13 chain-of-record (referenced, not modified).
- Supersession links: `MEM-RAT-003` ▸ `MEM-RAT-001`; phantom `AD-0021` disposition.

All artifacts are versioned and referenced from the traceability chain; an artifact not "of record" leaves the
corresponding atomic requirement `UNMET`.

---

## 6. Verification chain

```
AUTH-REST-004 (documentary, self-attested)
        │
        ▼
[Independent adjudicator] ── reviews S-1..S-3 ──► REAL-C-05 (D-1) + D-2 + D-3   [SIG-1]
        │
        ▼
[REAL-H-07 gate] ── evaluates attested state ──► gate result = PASS (D-4)       [SIG-2]
        │
        ▼
[Authority Board] ── accepts evidence of record ──► acceptance on AUTH-012      [SIG-3]
        │
        ▼
AT-P0-1 = PASS   ⇒  EA-B-P0-1 CLOSED   ⇒  feeds P1-7 (UCOS-G0-0004) and P0-3 (UCOS-G0-0005)
```

**Chain integrity rule.** Each hop must be independently checkable and append-only. A broken or self-referential
hop (e.g., the adjudicator is the author) invalidates the whole chain and holds AT-P0-1 = FAIL.

---

## 7. Acceptance condition

> **AT-P0-1 = PASS** iff D-1..D-4 exist of record with SIG-1..SIG-3, M-1 = PASS, M-2 = 4/4, M-3 = 0, and the
> verification chain of §6 is intact end-to-end. Any missing document, missing signature, failed measurement, or
> broken chain hop ⇒ **AT-P0-1 = FAIL** ⇒ EA-B-P0-1 remains OPEN.

### 7.1 Current reading (as of 2026-07-03)

| Element | State | Basis |
|---------|:-----:|-------|
| D-1 `REAL-C-05` | **ABSENT** | `UCOS-EA-0003 §6.1` AT-P0-1 = FAIL; `UCOS-AUTH-0001` |
| D-4 `REAL-H-07` PASS | **ABSENT** | attestation PENDING |
| SIG-1..3 | **ABSENT** | no independent adjudication produced |
| **AT-P0-1** | **FAIL** | evidentiary attestation PENDING |

---

## 8. Determination (attestation-level)

> The attestation package for EA-B-P0-1 is **fully specified**: four documents (D-1..D-4), three signatures
> (SIG-1..SIG-3, independence-declared), four measurements (gate PASS, 4/4 subjects, 0 self-attestation, chain
> consistency), the named artifacts, and an intact independent verification chain. The package is **executable
> now under the standing block** (no build). As of this dossier the package is **ABSENT of record** ⇒
> **AT-P0-1 = FAIL**. Nothing here requires redesign or a new requirement.

## 9. Scope discipline

No attestation was performed, no signature gathered, no measurement taken, no lock lifted. INV-1..13, `AUTH-012`,
`AD-0014`, Article IX lock unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.**

## 10. Traceability

- **Consumes:** `UCOS-G0-0001` (P0-1.a..d); `UCOS-EA-0003 §2/§6`; `UCOS-RA-0007 §1`; `UCOS-EP-0005 §1/§2`;
  `AUTH-REST-004`; `ONTO-RAT-001`; `MEM-RAT-003`.
- **Feeds:** `UCOS-G0-0004` (cert re-issue consumes the attested chain state); `UCOS-G0-0005` (P0-3.a);
  `UCOS-G0-0006` (determination).
- **Owner:** UCOS Authority Board.

**END `UCOS-G0-0002` — ATTESTATION SPECIFICATION · 4 DOCS · 3 SIGNATURES · 4 MEASUREMENTS · NAMED ARTIFACTS · INDEPENDENT VERIFICATION CHAIN · SELF-ATTESTATION REJECTED · EXECUTABLE UNDER STANDING BLOCK · CURRENTLY AT-P0-1 = FAIL (PACKAGE ABSENT) · SPECIFICATION ONLY.**
