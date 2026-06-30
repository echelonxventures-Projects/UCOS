# UCOS-SVC-ADR-007 — NFRs Deferred to ASR Ratification; Security Deferred to Prompt 09

| Field | Value |
|-------|-------|
| ADR ID | `UCOS-SVC-ADR-007` |
| Status | Accepted (generated) v1.0.0 |
| Phase | 10.2B — Prompt 07 |
| Parent | `UCOS-SVC-ARCH-001` |
| Date | 2026-06-30 |

## Context
Quantitative NFRs (latency, throughput, availability, recovery objectives) depend on the ASR set, which
is unratified (carried Trusted Operation **N-1**, AUTH-006 §6.3/§6.4). Security controls are owned by
Prompt 09 (AUTH-008; S1/S3/S4 non-waivable). Fabricating either would create false governance signal.

## Decision
- Every contract NFR field records the literal value **`PENDING ASR RATIFICATION`**. No latency,
  throughput, availability, or recovery value is fabricated.
- Every exposed contract boundary records **`FLAGGED FOR PROMPT 09`**; no authentication, authorization,
  encryption, secret, key, or rate-limit control is invented here.
- ASR ratification later replaces the placeholders via a governed versioned update (`UCOS-SVC-POLICY-001`).

## Consequences
- Contracts are structurally complete and ratifiable while honestly marking deferred quantitative and
  security concerns.
- Prompt 02 (N-1) and Prompt 09 are unblocked to supply values/controls without rework of contract shape.
- Deprecation-window/SLA-dependent policy values inherit the same placeholder.

## Alternatives rejected
- Inventing placeholder numbers (false precision; violates the task and N-1 discipline).
- Designing interim security controls (usurps Prompt 09 ownership; AUTH-008).

## Traceability
Refines AUTH-006 (N-1), AUTH-008, `UCOS-CAP-ARCH-001`; refined by Prompt 02 (ASRs), Prompt 09 (security).
