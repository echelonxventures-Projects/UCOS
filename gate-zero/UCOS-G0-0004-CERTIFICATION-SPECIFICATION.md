# UCOS-G0-0004 — Gate Zero Certification Specification

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-G0-0004` |
| Program | **UCOS Gate Zero Authority — Final G0 Dossier** |
| Phase | G0-4 — Certification Package |
| Mode | **CERTIFICATION SPECIFICATION ONLY** — defines issuance, validity, and revocation criteria for the terminal certificate that discharges EA-B-P1-7. Re-issues no certificate. |
| Status | G0 DOSSIER BASELINE (v1.0.0) |
| Date | 2026-07-03 |
| Inputs (read-only, frozen) | `UCOS-G0-0001` (P1-7.a..c); `UCOS-G0-0002` (attested chain state); `UCOS-G0-0003` (269/269); `UCOS-EA-0001/0002/0003`; `UCOS-RA-0007 §3`; `UCOS-EP-0005 §1`; `REAL-C-01` instrument; R14 `UCOM-ULTIMATE-CERT-001` (stale) |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; Article IX lock ACTIVE; `UCOS-CONSTRUCTION-BLOCKED` stands. |

---

## 0. Purpose & scope

This artifact specifies the terminal-certificate package whose existence-of-record satisfies **AT-P1-7** and
closes **EA-B-P1-7** (atomic requirements `P1-7.a..c` of `UCOS-G0-0001`). It fixes the **issuance criteria**,
the **validity criteria**, and the **revocation criteria** for **`UCOM-ULTIMATE-CERT-002`**, re-issued under
`REAL-C-01` to supersede the stale R14 instrument `UCOM-ULTIMATE-CERT-001` (134/134, "Memory REJECTED", "chain
DEFECTIVE"). It binds production package `EWP-00-CERT` (approval class **A**, `UCOS-EP-0005 §1`), Wave **W2**,
executable **now under the standing block** (re-issue is evidentiary, not a build; `UCOS-RA-0007 §3`).

**Grounding rule.** The re-issued certificate is valid **only** if it is grounded in the AT-P0-1 attestation
(`UCOS-G0-0002`) and the AT-P0-2 re-measurement (`UCOS-G0-0003`). A certificate ungrounded in that evidence is
itself a fresh self-attestation and is rejected.

---

## 1. The instrument

| Field | Specification |
|-------|---------------|
| Certificate ID | **`UCOM-ULTIMATE-CERT-002`** |
| Issued under | `REAL-C-01` (certification authority) |
| Supersedes | R14 `UCOM-ULTIMATE-CERT-001` (stale: 134/134, "Memory REJECTED", "chain DEFECTIVE") |
| Certified test result | **269/269** (from `REAL-M-03`, `UCOS-G0-0003`) |
| Certified memory disposition | **ACCEPTED** (consistent with PI-9 `MEM-RAT-003` attestation) |
| Certified chain state | **consistent with the EA-B-P0-1 attestation** (`REAL-C-05`, `UCOS-G0-0002`) |
| Accepting authority | UCOS Authority Board |

---

## 2. Issuance criteria (certificate may be issued iff)

| # | Issuance criterion | Grounding evidence |
|:--:|--------------------|--------------------|
| **ISS-1** | AT-P0-1 = PASS of record (chain + PI-8/PI-9 independently attested) | `REAL-C-05` (`UCOS-G0-0002`) |
| **ISS-2** | AT-P0-2 = PASS of record (269/269 independently reproduced) | `REAL-M-03` (`UCOS-G0-0003`) |
| **ISS-3** | Certificate content reflects 269/269 **and** memory ACCEPTED | certificate body |
| **ISS-4** | Certified chain state matches the ISS-1 attestation (no contradiction) | consistency link |
| **ISS-5** | R14 explicitly superseded of record; no live decision continues to cite R14 | supersession link |

> **Issuance-order rule.** ISS-1 and ISS-2 are prerequisites (`UCOS-RA-0007 §3`: P1-7 "depends on W1 evidence
> state"). A certificate issued before AT-P0-1 / AT-P0-2 PASS is **void ab initio** — it would re-certify an
> un-attested, un-reproduced state.

---

## 3. Validity criteria (certificate is valid while)

| # | Validity criterion | Holds while |
|:--:|--------------------|-------------|
| **VAL-1** | Grounding evidence remains of record and un-revoked | `REAL-C-05` and `REAL-M-03` stand |
| **VAL-2** | Certified figures remain the figures of record | 269/269 and memory ACCEPTED unchanged |
| **VAL-3** | Chain state remains consistent with the P0-1 attestation | `AUTH-012` v1.0.13 unchanged; no re-divergence |
| **VAL-4** | No superseding terminal certificate has been issued | `UCOM-ULTIMATE-CERT-002` is the latest |
| **VAL-5** | Append-only audit integrity intact (tamper-evident) | S6; INV-10 preserved |

> A certificate that remains valid under VAL-1..VAL-5 keeps **AT-P1-7 = PASS** and remains a lawful basis for
> the P0-3 Board act (`UCOS-G0-0005`).

---

## 4. Revocation criteria (certificate is revoked / voided if)

| # | Revocation trigger | Effect |
|:--:|--------------------|--------|
| **REV-1** | Grounding attestation `REAL-C-05` is withdrawn or invalidated | AT-P1-7 → FAIL; certificate void |
| **REV-2** | Grounding re-measurement `REAL-M-03` is overturned (269/269 not reproducible) | AT-P1-7 → FAIL; certificate void |
| **REV-3** | Certified figures found inconsistent (memory disposition or count contradicts P0-1/P0-2) | AT-P1-7 → FAIL |
| **REV-4** | Chain re-divergence: `AUTH-012` state no longer matches the attestation | AT-P1-7 → FAIL |
| **REV-5** | Tamper detected in the append-only audit trail | AT-P1-7 → FAIL; integrity investigation |
| **REV-6** | A superseding certificate is issued on new evidence | prior certificate retired of record |

> **Revocation cascade.** Because `G0 = … ∧ EA-B-P1-7 ∧ …`, revocation of `UCOM-ULTIMATE-CERT-002` sets
> AT-P1-7 = FAIL and therefore **G0 = FAIL**. If the P0-3 lift act already relied on it, the lift's evidentiary
> basis is defeated (see `UCOS-G0-0005 §4`, invalidators).

---

## 5. Verification chain

```
AT-P0-1 PASS (REAL-C-05)   +   AT-P0-2 PASS (REAL-M-03, 269/269)
        │                              │
        └──────────────┬───────────────┘
                       ▼
        [Certification authority, REAL-C-01] ── issues ──► UCOM-ULTIMATE-CERT-002
                       │                                         (269/269; memory ACCEPTED; chain consistent)
                       ├──► supersession link ▸ R14 UCOM-ULTIMATE-CERT-001 (retired)
                       ▼
        [Authority Board] ── accepts of record ──► on AUTH-012
                       ▼
        AT-P1-7 = PASS   ⇒  EA-B-P1-7 CLOSED   ⇒  feeds P0-3 (UCOS-G0-0005)
```

---

## 6. Acceptance condition

> **AT-P1-7 = PASS** iff `UCOM-ULTIMATE-CERT-002` is issued of record satisfying ISS-1..ISS-5, is valid under
> VAL-1..VAL-5, and no REV-1..REV-6 trigger is active. Issuance before AT-P0-1/AT-P0-2 PASS, a missing
> supersession link, or any active revocation trigger ⇒ **AT-P1-7 = FAIL** ⇒ EA-B-P1-7 remains OPEN.

### 6.1 Current reading (as of 2026-07-03)

| Element | State | Basis |
|---------|:-----:|-------|
| `UCOM-ULTIMATE-CERT-002` | **NOT ISSUED** | `UCOS-EA-0003 §6.1` AT-P1-7 = FAIL |
| ISS-1 / ISS-2 prerequisites | **UNMET** | AT-P0-1 and AT-P0-2 both FAIL |
| Live terminal instrument | **R14 (stale)** | `UCOM-ULTIMATE-CERT-001`: 134/134, "Memory REJECTED", "chain DEFECTIVE" |
| **AT-P1-7** | **FAIL** | terminal certificate stale; not re-issued |

---

## 7. Determination (certification-level)

> The terminal-certificate package for EA-B-P1-7 is **fully specified**: the instrument
> `UCOM-ULTIMATE-CERT-002`, five issuance criteria (grounded in AT-P0-1 + AT-P0-2), five validity criteria, and
> six revocation triggers, with a supersession link retiring the stale R14. It is **executable now under the
> standing block** (no build) but is **prerequisite-gated** on the two W1 evidentiary items. As of this dossier
> the certificate is **NOT ISSUED** and R14 remains the (stale) live instrument ⇒ **AT-P1-7 = FAIL**. Nothing
> here requires redesign or a new requirement.

## 8. Scope discipline

No certificate was issued, superseded, or revoked; no lock lifted. INV-1..13, `AUTH-012`, `AD-0014`, Article IX
lock unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.**

## 9. Traceability

- **Consumes:** `UCOS-G0-0001` (P1-7.a..c); `UCOS-G0-0002` (attested chain); `UCOS-G0-0003` (269/269);
  `UCOS-EA-0002 §2.2`; `UCOS-EA-0003 §3`; `UCOS-RA-0007 §3`; `UCOS-EP-0005 §1`; `REAL-C-01`.
- **Feeds:** `UCOS-G0-0005` (P0-3.c); `UCOS-G0-0006`.
- **Owner:** UCOS Authority Board.

**END `UCOS-G0-0004` — CERTIFICATION SPECIFICATION · UCOM-ULTIMATE-CERT-002 (REAL-C-01) · 5 ISSUANCE · 5 VALIDITY · 6 REVOCATION CRITERIA · GROUNDED IN AT-P0-1 + AT-P0-2 · SUPERSEDES STALE R14 · EXECUTABLE UNDER STANDING BLOCK · CURRENTLY AT-P1-7 = FAIL (NOT ISSUED) · SPECIFICATION ONLY.**
