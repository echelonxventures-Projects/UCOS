# SPEC — Governance Compiler Rules

> **STATUS: CREATED — READY FOR AUTHORITY BOARD REVIEW**
> PROPOSED · NOT RATIFIED · NOT IMPLEMENTATION AUTHORIZED · NO COMPILER EXECUTED
> DOES NOT SUPERSEDE `AUTH-001..012` / `UCOS-CONST-001` · DOES NOT MODIFY INV-1..13 / `INV-CORE-001` ·
> DOES NOT OVERRIDE AUTH-012 · DOES NOT RELEASE ARTICLE IX · REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `SPEC-GOVERNANCE-COMPILER-RULES` |
| Name | Governance Compiler Rules |
| Program | Constitutional Refoundation Program — **Specification Tier** |
| Classification | **PROPOSED — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **COMPILATION RULE DESIGN ONLY** — deterministic rules; no compiler code, no execution |
| Chartered by | `GD-0001`; governed by `PCAMG-1000` M-IV/M-VI; realizes `PCAMG-2000` GEN-1 |

> **No compiler executed.** Defines the deterministic rules by which governance is *compiled* from principles
> + meta-constitution + domain inputs. It specifies rules, not a running compiler; nothing is compiled or
> enrolled.

---

## 1. Purpose

Specify the **deterministic compilation rules** that turn Layer-0 principles, the Meta-Constitution, and
domain inputs into a validated governance system (`PCAMG-2000` GEN-1). Governance is compiled, not authored by
fiat (Meta-Constitution M-IV). The compiler is a pure, deterministic function (INV-6): identical inputs
produce identical governance and an identical reproducibility hash.

## 2. Compilation Function (design)

```
compile( principles@ver, meta_constitution@ver, domain_inputs, registries@ver, rules@ver )
      → { governance_system, generation_record, determinism_hash }
```

- **Pure & deterministic:** no wall-clock, randomness, network, or hidden state influences the output.
- **Total:** every well-formed input compiles to either a governance system or a typed compile error.
- **Reproducible:** re-compiling identical inputs yields a byte-identical output and matching hash.

## 3. Compiler Rules

| Rule | Statement |
|------|-----------|
| CR-1 Principle-rooted | Every emitted governance rule derives from ≥1 registered principle; unrooted rules are a compile error. |
| CR-2 Meta-conformant | Emitted governance conforms to Meta-Constitution M-I..M-XII; violations are compile errors. |
| CR-3 No hardcoding | No literal governance value is embedded; all values resolve from registries (IP-01/IP-02). |
| CR-4 Single-owner | Every emitted construct is assigned exactly one accountable owner (PRIN-005). |
| CR-5 SoD-wired | Emitted change paths wire proposer≠certifier≠ratifier (PRIN-009). |
| CR-6 Deny-by-default | Emitted authorization defaults to deny; grants are explicit (S1). |
| CR-7 Security-preserving | S1/S3/S4 controls are emitted and never weakened (PRIN-011). |
| CR-8 Traceable | Emit a complete derivation trace for every construct (`SPEC-TRACEABILITY-FRAMEWORK`). |
| CR-9 Deterministic | Emit a reproducible `determinism_hash`; non-deterministic inputs are rejected or quarantined. |
| CR-10 Append-only | Recompilation supersedes prior output with a supersession link (INV-10); never deletes. |
| CR-11 Non-inverting | Emitted precedence conforms to `PCAMG-7000`; no lower tier may outrank a higher tier. |
| CR-12 Fail-closed | Any unresolved input, ambiguity, or rule violation halts compilation (no partial-activate). |

## 4. Compile Errors (typed, deterministic)

| Code | Meaning |
|------|---------|
| CE-UNROOTED | A rule cannot be derived from any principle (CR-1). |
| CE-META | Meta-Constitution conformance failure (CR-2). |
| CE-HARDCODE | A hardcoded governance literal detected (CR-3). |
| CE-OWNER | Missing/duplicate owner (CR-4). |
| CE-SOD | Change path violates separation of duties (CR-5). |
| CE-SEC | Security control missing/weakened (CR-6/CR-7). |
| CE-TRACE | Incomplete derivation trace (CR-8). |
| CE-NONDET | Non-reproducible output / disallowed non-determinism (CR-9). |
| CE-INVERSION | Emitted precedence would invert the hierarchy (CR-11). |
| CE-AMBIGUOUS | Input/rule ambiguity unresolved by `PCAMG-6000` (CR-12). |

A compile error is **blocking**; the candidate governance is not produced (fail-closed). No partial or
"best-effort" governance is ever emitted.

## 5. Pipeline Position

```
inputs → [SPEC-GOVERNANCE-COMPILER-RULES] compile → candidate governance + generation record
       → [SPEC-CONSTITUTIONAL-VALIDATION-RULES] validate → PASS/FAIL
       → [PCAMG-2000 GEN-4] simulate → [Authority Board approval] → activate (four-stage proof)
```

The compiler produces candidates only; **activation is never performed by the compiler** and always requires
the four-stage compliance proof (`PCAMG-1000` M-X).

## 6. Scope Discipline (confirmations)

| Confirmation | Result |
|--------------|:------:|
| Pure/total/deterministic compile function; reproducibility hash (INV-6) | ✅ |
| Compiler rules CR-1..12 + typed compile errors CE-*; fail-closed | ✅ |
| No hardcoding (CR-3); non-inverting (CR-11); security-preserving (CR-7) | ✅ |
| No compiler code; nothing compiled or activated; append-only | ✅ |
| Article IX not released; ratified artifacts unchanged | ✅ |

## Traceability
- **Chartered by:** `GD-0001`; **governed by:** `PCAMG-1000` M-IV/M-VI; **realizes:** `PCAMG-2000` GEN-1.
- **Consumes:** `PCAMG-0000`, `SPEC-GOVERNANCE-REGISTRIES`, `PCAMG-6000`, `PCAMG-7000`.
- **Feeds:** `SPEC-CONSTITUTIONAL-VALIDATION-RULES`, `SPEC-TRACEABILITY-FRAMEWORK`.
- **Owner:** UCOS Authority Board (custodian: Governance Generation Steward).

**END SPEC-GOVERNANCE-COMPILER-RULES · PROPOSED (NOT EXECUTED) · APPEND-ONLY · PENDING AUTHORITY BOARD REVIEW.**
