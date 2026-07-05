# GAP REGISTRY REPORT

**Artifact:** PROG-GAP-RPT-001
**Phase:** PHASE-P.1
**Status:** COMPUTED
**Engine:** `tools/program-compiler/src/gap-engine.ts` (WS9)

---

## 1. Model

The gap registry has two sources, merged at compile time:

1. **Declared gaps** (`gaps.json`) — known open gaps authored into the registry.
2. **Auto-discovered gaps** — synthesized by the compiler from computed state:
   - evidence inconsistency (declared COMPLETE but evidence < VERIFIED),
   - items with no declared evidence (completion unprovable),
   - dependency cycles (cyclic items can never become READY).

Auto-discovered gaps carry `autoDiscovered: true` and cannot be forgotten between sessions because
they are recomputed on every compile.

---

## 2. Summary (this compile)

- **Total open gaps: 19** — 17 declared + 2 auto-discovered.
- By severity: **HIGH 8**, **MEDIUM 6**, **LOW 3**, **CRITICAL 0**.
- No dependency-cycle gaps (graph acyclic).

---

## 3. Auto-discovered gaps

| Gap | Severity | Work item | Basis |
|-----|----------|-----------|-------|
| `GAP-AUTO-EVID-PI-8` | HIGH | PI-8 | Declared COMPLETE but 4/5 evidence ≥VERIFIED (`EV-PI8-RAT` SUBMITTED). Evidence-based completion violated. |
| `GAP-AUTO-EVID-PI-9` | HIGH | PI-9 | Declared COMPLETE but 4/5 evidence ≥VERIFIED (`EV-PI9-RAT` SUBMITTED). Evidence-based completion violated. |

These two are the mechanical proof that the anti-skip control works: two fabrics *asserted* done are
automatically re-opened as gaps because their independent ratification (REAL-C-05) has not landed.

---

## 4. Declared gaps (open)

| Gap | Severity | Category | Work item |
|-----|----------|----------|-----------|
| `GAP-PROMPT-05` | HIGH | contract-authoring | Prompt-05 |
| `GAP-PROMPT-08` | HIGH | contract-authoring | Prompt-08 |
| `GAP-PROMPT-09` | MEDIUM | contract-authoring | Prompt-09 |
| `GAP-ACT-06` | HIGH | operational-evidence | ACT-06 |
| `GAP-ACT-07` | HIGH | operational-evidence | ACT-07 |
| `GAP-ACT-08` | MEDIUM | operational-evidence | ACT-08 |
| `GAP-ACT-09` | MEDIUM | operational-evidence | ACT-09 |
| `GAP-ACT-10` | MEDIUM | operational-evidence | ACT-10 |
| `GAP-ACT-11` | MEDIUM | technology-decision | ACT-11 |
| `GAP-ACT-12` | HIGH | certification | ACT-12 |
| `GAP-PI-10` | MEDIUM | fabric-implementation | PI-10 |
| `GAP-PI-11` | LOW | fabric-implementation | PI-11 |
| `GAP-ATTEST` | HIGH | governance-attestation | REAL-C-05 |
| `GAP-CERT-REISSUE` | MEDIUM | certification | REAL-C-01 |
| `GAP-N1-CAP` | LOW | trusted-operation | — |
| `GAP-PARTY-GLOSSARY` | LOW | trusted-operation | — |
| `GAP-SUITE-COUNT` | LOW | measurement | — |

---

## 5. Critical-path reading

The gaps cluster into four closable tracks:

1. **Independent attestation (REAL-C-05):** clears `GAP-ATTEST`, `GAP-AUTO-EVID-PI-8/9`, unblocks
   PI-8/PI-9 completion → unblocks PI-10. Highest leverage.
2. **Contract authoring (Prompt-05 → 08 → 09):** a strict chain; only Prompt-05 is currently READY.
3. **Operational evidence (ACT-11 → 06 → 07 → {08,09} → 10 → 12):** only ACT-11 is READY; the rest
   are correctly BLOCKED behind it. Closes REAL-C-03.
4. **Design-only fabrics (PI-10, PI-11):** PI-10 needs AD-0024 (not issued) → hard-blocked; PI-11 is
   READY under AD-0022 conditional. Closes REAL-C-04.

## 6. Governance impact

No open gap is silently ignored: each maps to a work item or closure, and the HIGH/CRITICAL subset
is surfaced verbatim in `MINIMAL_CONTEXT.md`. The overall governance verdict remains **NO_GO** until
the REAL-C-03/04/05 closures clear their dependency + evidence requirements.
