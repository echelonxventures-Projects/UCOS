# UCOS-W1-0004 — UCOM-ULTIMATE-CERT-002 Issuance Package

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-W1-0004` |
| Program | **UCOS Wave 1 — Independent Evidence Package Generation** |
| Phase | W1-4 — Certification Package (Wave W2) |
| Closes toward | **EA-B-P1-7** (AT-P1-7) via re-issued certificate **`UCOM-ULTIMATE-CERT-002`** |
| Mode | **PREPARATION ARTIFACT ONLY** — blank issuance checklist, conditions, and a **certificate template**. Issues no certificate; the template below is **UNISSUED / VOID as printed**. |
| Status | ISSUANCE-PACKAGE TEMPLATE (v1.0.0) — **NOT ISSUED** |
| Date | 2026-07-03 |
| Inputs (read-only, frozen) | `UCOS-G0-0001 §3`; `UCOS-G0-0004`; `UCOS-EA-0003 §3`; `UCOS-RA-0007 §3`; `UCOS-EP-0005 §1`; `REAL-C-01` instrument; R14 `UCOM-ULTIMATE-CERT-001` (stale) |
| Governing constraints | Corpus FROZEN. `UCOS-CONSTRUCTION-BLOCKED` stands. Certificate must be **grounded** in AT-P0-1 + AT-P0-2. No lock lift. |

> **Issuance rule.** A certificate may be issued **only** by the certification authority under `REAL-C-01`,
> and **only after** AT-P0-1 (`UCOS-W1-0001`) and AT-P0-2 (`UCOS-W1-0002`) are PASS of record. The template in
> §6 is a **blank form**; as printed it carries the watermark **VOID — NOT ISSUED** and certifies nothing.

---

## 1. Purpose

To equip the **certification authority** with the checklist, evidence requirements, verification requirements,
validity/revocation conditions, and certificate template to re-issue **`UCOM-ULTIMATE-CERT-002`** — superseding
the stale R14 `UCOM-ULTIMATE-CERT-001` (134/134, "Memory REJECTED", "chain DEFECTIVE") — thereby satisfying
**AT-P1-7** and closing **EA-B-P1-7**.

## 2. Issuance checklist (all must be checked before issuance)

- [ ] **C-1** AT-P0-1 = PASS of record (`REAL-C-05` + `REAL-H-07` PASS; `UCOS-W1-0001` accepted).
- [ ] **C-2** AT-P0-2 = PASS of record (`REAL-M-03`, 269/269; `UCOS-W1-0002` accepted).
- [ ] **C-3** Certified figures set: test result **269/269**; memory **ACCEPTED**.
- [ ] **C-4** Certified chain state **consistent** with the AT-P0-1 attestation (no contradiction).
- [ ] **C-5** Supersession link to R14 `UCOM-ULTIMATE-CERT-001` prepared; no live decision cites R14.
- [ ] **C-6** Certification authority identified; issuance under `REAL-C-01`.
- [ ] **C-7** Board acceptance of the re-issued certificate scheduled (evidence acceptance, not lock-lift).

> **Order gate.** If C-1 or C-2 is unchecked, issuance is **prohibited** — a certificate issued before the W1
> evidence is **void ab initio** (`UCOS-G0-0004 §2`, ISS-ordering).

## 3. Required evidence (grounding)

| Ref | Evidence | Source | Present? |
|-----|----------|--------|:--------:|
| CE-1 | `REAL-C-05` attestation accepted (AT-P0-1 PASS) | `UCOS-W1-0001` / register EV-P0-1.* | `[ ]` |
| CE-2 | `REAL-M-03` re-measurement accepted (AT-P0-2 PASS; 269/269) | `UCOS-W1-0002` / register EV-P0-2.* | `[ ]` |
| CE-3 | R14 instrument reference (supersession target) | `UCOM-ULTIMATE-CERT-001` | `[ ]` |

## 4. Verification requirements

| # | Verification | PASS condition | Result |
|:--:|-------------|----------------|:------:|
| VR-1 | Grounding present | CE-1 ∧ CE-2 accepted of record | `⟨PASS/FAIL⟩` |
| VR-2 | Figure fidelity | certificate states 269/269 ∧ memory ACCEPTED | `⟨PASS/FAIL⟩` |
| VR-3 | Chain consistency | certified chain state matches CE-1 | `⟨PASS/FAIL⟩` |
| VR-4 | Supersession | R14 explicitly superseded; link recorded | `⟨PASS/FAIL⟩` |
| VR-5 | Authority | issued under `REAL-C-01` by the certification authority | `⟨PASS/FAIL⟩` |

> **AT-P1-7 = PASS** iff VR-1..VR-5 all PASS and the certificate is of record.

## 5. Validity & revocation conditions

**Valid while (VAL, `UCOS-G0-0004 §3`):**
- [ ] VAL-1 grounding evidence (`REAL-C-05`, `REAL-M-03`) stands, un-revoked.
- [ ] VAL-2 certified figures remain the figures of record (269/269; memory ACCEPTED).
- [ ] VAL-3 chain state remains consistent with the P0-1 attestation.
- [ ] VAL-4 no superseding terminal certificate issued.
- [ ] VAL-5 append-only audit integrity intact.

**Revoked / void if (REV, `UCOS-G0-0004 §4`):**

| ID | Trigger | Effect |
|----|---------|--------|
| REV-1 | `REAL-C-05` withdrawn/invalidated | AT-P1-7 → FAIL; cert void |
| REV-2 | 269/269 overturned (`REAL-M-03` defeated) | AT-P1-7 → FAIL; cert void |
| REV-3 | Certified figures found inconsistent with P0-1/P0-2 | AT-P1-7 → FAIL |
| REV-4 | Chain re-divergence (`AUTH-012` no longer matches attestation) | AT-P1-7 → FAIL |
| REV-5 | Audit-trail tamper detected | AT-P1-7 → FAIL; integrity review |
| REV-6 | Superseding certificate issued on new evidence | prior cert retired |

> **Cascade.** Revocation sets AT-P1-7 = FAIL ⇒ **G0 = FAIL**; if a lift already relied on it, the lift is
> defeated (`UCOS-W1-0005 §4` / INV-L-2).

---

## 6. Certificate template *(BLANK — VOID until lawfully issued)*

```
╔══════════════════════════════════════════════════════════════════════╗
║                    ⟦ VOID — NOT ISSUED — TEMPLATE ⟧                    ║
║              UCOM-ULTIMATE-CERT-002  —  TERMINAL CERTIFICATE           ║
╠══════════════════════════════════════════════════════════════════════╣
║ Issued under            : REAL-C-01                                     ║
║ Supersedes              : UCOM-ULTIMATE-CERT-001 (R14; STALE)          ║
║ Test result certified   : ⟨n⟩ / 269        (required: 269/269)         ║
║ Memory disposition      : ⟨ACCEPTED / REJECTED⟩   (required: ACCEPTED) ║
║ Chain state             : ⟨consistent with REAL-C-05 attestation?⟩     ║
║ Grounding — AT-P0-1     : ⟨PASS/FAIL⟩   ref: REAL-C-05  ⟨path/version⟩  ║
║ Grounding — AT-P0-2     : ⟨PASS/FAIL⟩   ref: REAL-M-03  ⟨path/version⟩  ║
║ Verification VR-1..VR-5 : [ ][ ][ ][ ][ ]                              ║
║ Certification authority : ⟨____⟩          Signature: ________________  ║
║ Issue date              : ⟨____⟩          Certificate hash: ⟨____⟩     ║
║ Board acceptance (evidence, not lift): [ ]  Signatory: _____________   ║
╠══════════════════════════════════════════════════════════════════════╣
║ This template certifies NOTHING until every field is completed by the  ║
║ certification authority on grounded AT-P0-1 + AT-P0-2 evidence and the  ║
║ VOID watermark is removed at lawful issuance. It lifts no lock.         ║
╚══════════════════════════════════════════════════════════════════════╝
```

## 7. Current reading (as issued)

| Element | State | Basis |
|---------|:-----:|-------|
| C-1 / C-2 grounding | **UNCHECKED** | AT-P0-1 & AT-P0-2 both FAIL (`UCOS-W1-0003`) |
| `UCOM-ULTIMATE-CERT-002` | **NOT ISSUED** | template VOID |
| Live terminal instrument | **R14 (stale)** | `UCOM-ULTIMATE-CERT-001` |
| **AT-P1-7** | **FAIL** | not re-issued |

## 8. Determination (issuance-package level)

> A **complete blank issuance package**: seven-item checklist (order-gated on AT-P0-1/AT-P0-2), grounding
> evidence refs, five verification requirements, five validity conditions, six revocation triggers, and a
> **VOID certificate template**. As issued **no certificate exists; AT-P1-7 remains FAIL; R14 remains the stale
> live instrument.** Sufficiency for third-party issuance: **YES**.

## 9. Scope discipline

No certificate issued, superseded, or revoked; no lock lifted. INV-1..13, `AUTH-012`, `AD-0014`, Article IX lock
unchanged; **`UCOS-CONSTRUCTION-BLOCKED` stands.**

## 10. Traceability

- **Consumes:** `UCOS-G0-0001 §3`; `UCOS-G0-0004`; `UCOS-EA-0003 §3`; `UCOS-RA-0007 §3`; `UCOS-W1-0001/0002/0003`.
- **Feeds:** `UCOS-W1-0005` (Board LE-3), `UCOS-W1-0006` (submission).
- **Owner (of the act):** Certification authority (issuer); UCOS Authority Board (acceptance authority).

**END `UCOS-W1-0004` — UCOM-ULTIMATE-CERT-002 ISSUANCE PACKAGE · CHECKLIST C-1..C-7 · GROUNDING CE-1..3 · VERIFICATION VR-1..5 · VALIDITY VAL-1..5 · REVOCATION REV-1..6 · VOID CERTIFICATE TEMPLATE · NOT ISSUED · AT-P1-7 = FAIL · NO LOCK LIFT · PREPARATION ARTIFACT ONLY.**
