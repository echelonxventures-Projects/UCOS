# AGP-D5 — COVERAGE MEASURE

**Deliverable:** D-5 (S-5) · attest-only, append-only, fail-closed.
**Source (INV-5):** D-1 classification · D-2 assignment · `UCOS-CAPABILITY-INVENTORY` §gap findings.
**Rule:** partition the finite capability set into `COVERED` (governed) ∪ `GAP` (ungoverned); require
`COVERED ∩ GAP = ∅` and `COVERED ∪ GAP = whole`, else `PARTITION_INVALID`.

## Partition over UCAP-01..34 (n = 34)

### COVERED — governance present (assigned + traceable-or-subsumed): 20

`UCAP-01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 17, 18, 19, 21, 22, 23, 24, 27, 28`

> Of these, **13 are PROVEN-traceable** (Class A+B) and **7 are governed-but-flagged** (Class C:
> 06,07,17,18,21,24,28) — covered by governance but with open ratification/implementation links (see D-3).

### GAP — no governing work item: 14

`UCAP-12, 13, 14, 15, 16, 20, 25, 26, 29, 30, 31, 32, 33, 34`

| Sub-class of gap | UCAP | Severity |
|---|---|:--:|
| **Implemented but ungoverned (drift)** | 26, 30, 31, 32 | CRITICAL |
| **Design-only, no work item** | 12, 13, 14, 20, 25, 33, 34 | HIGH |
| **Vision / unmodeled / deferred** | 15, 16, 29 | MEDIUM |

## Partition integrity check

- `COVERED ∪ GAP` = 20 + 14 = **34** = whole ✅
- `COVERED ∩ GAP` = **∅** ✅
- `PARTITION_VALID` ✅

## Coverage measure

| Measure | Value |
|---|---|
| Governed coverage (COVERED / n) | **20 / 34 = 58.8%** |
| Proven-and-governed (PROVEN / n) | **13 / 34 = 38.2%** |
| Ungoverned gap (GAP / n) | **14 / 34 = 41.2%** |
| Critical drift (implemented-ungoverned) | **4 / 34 = 11.8%** |

**D-5 STATUS: COMPLETE — partition valid; coverage measured. Governed 20/34; ungoverned gap 14/34
surfaced, none silently omitted (fail-closed). Coverage is NOT total — forwarded to D-7.**
