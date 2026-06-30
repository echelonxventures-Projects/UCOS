# ADR-001 — Runtime & Compute Technology Selection

**Artifact ID:** UCOS-PLAT-ADR-001
**Short Name:** ADR-001 Runtime
**Layer:** ARCHITECTURE (Platform Engineering — Technology Selection)
**Phase:** Phase 10.1 — Platform Technology Selection (Implementation Readiness Condition C-4)
**Status:** ACCEPTED (technology-selection scope)
**Version:** 1.0.0
**Date:** 2026-06-30
**Decision Owner:** Platform Engineering — Runtime & Compute Owner (`PEO-001`)
**Governing Domain:** `PE-01` Runtime & Compute (Execution Plane, PEG-A)
**Capability Anchor:** CAP-15 Platform Governance

> **Scope notice.** This ADR records a **technology selection** authorized by `CTX-ARCHB-001` §5 and
> deferred by `PEP-010` (Platform Independence) throughout Phases 9.0A–9.0C. It selects technology; it
> does **not** generate source code, build images, provision clusters, or deploy infrastructure. It does
> **not** modify any frozen artifact (`UCOS-PEA-001..007`, the Governance Baseline 1.0.0, or any ratified
> domain/entity/matrix). Code generation remains gated behind the Constitution Article IX lock and the
> Phase 10.0 conditions (`UCOS-IMP-READY-001`).

---

## 1. Context

The Runtime & Service Architecture (`UCOS-PEA-002`) defines **17 Platform Runtime Domains**
(`PRD-001..017`), **73 Platform Runtime Services** (`PRS-001..073`), **17 Execution Models**
(`PEX-001..017`), and **17 Workflow Models** (`PWF-001..017`) entirely technology-neutrally. Those models
mandate, but do not realize, an execution substrate that is:

- **Deterministic** (`PEP-008`, `PEX` invariant EX1) and **idempotent** (EX4);
- **Composable** and independently deployable (`PEP-009`, `PEP-018`; `CTX-ARCHB-001` §1);
- **Platform-neutral / cloud-portable** (`PEP-010`; `CTX-ARCHB-001` §5);
- **Boundary-integral** — services interact only through published contracts (`PEB-001`, `CTX-ARCHB-001`
  §3);
- **Resilient** (`PEG-013`, `UCOS-PRINCIPLES` P8) and **observable** (`PEG-012`, P7);
- aligned to the architecturally significant requirements (ASRs) of availability, scalability,
  evolvability, and operability (`CTX-ARCHB-001` §6).

A single accountable runtime substrate is required so that all 73 runtime services execute under one
governed, portable, reproducible execution model, and so that downstream phases (Security — Prompt 09;
Implementation — Prompt 10) build on a known foundation. No runtime technology has been selected before
this ADR.

## 2. Decision

**Adopt an OCI-container + Kubernetes execution substrate, cloud-neutral, with a governed primary
application runtime and a constrained polyglot allowance.**

1. **Packaging:** all runtime services are packaged as **OCI-compliant container images** (open standard;
   no proprietary packaging format).
2. **Orchestration:** services run on **Kubernetes** (CNCF, vendor-neutral) as the orchestration and
   scheduling substrate. The Kubernetes API — not any single managed distribution — is the contract;
   any conformant distribution on any cloud or on-premise satisfies it.
3. **Primary application runtime:** **Java 21 LTS (JVM)** is the primary runtime for domain and platform
   runtime services (`PRS-*`) — mature, strongly typed, deterministic, long-term-supported, with a
   first-class DDD / contract-first ecosystem.
4. **Governed polyglot allowance (Approval-By-Exception, `PEP-020`):**
   - **TypeScript on Node.js (Active LTS)** is approved for experience/BFF-tier services (Prompt 06/07
     consumption) where a shared front-of-stack language is beneficial.
   - **Go** is approved for latency-sensitive platform/control-plane daemons (e.g., `PE-12`, `PE-13`,
     `PE-17` substrate components) where footprint and concurrency dominate.
   - Any additional runtime is an Approval-Required Operation governed by `PEG-001`/`PE-17`.
5. **Determinism & idempotency:** runtime configuration is externalized (`PEP-003`/`PEP-004`); the same
   governed inputs + configuration produce the same outcome (EX1); consumers are idempotent (EX4).

## 3. Alternatives Considered

| # | Alternative | Why not selected |
|---|-------------|------------------|
| A | **Serverless functions (FaaS) as the primary substrate** | Strong scale-to-zero, but cold-start nondeterminism, vendor-specific runtimes, and weaker long-running/stateful orchestration conflict with `PEP-010` neutrality and EX1 determinism. Retained as a *future, governed* option for specific event-driven services. |
| B | **Single-cloud managed PaaS (e.g., a proprietary app platform)** | Fastest initial velocity, but couples the platform to one vendor — direct violation of `PEP-010` and `CTX-ARCHB-001` §5 cloud-neutrality. |
| C | **VM-based deployment (no containers/orchestration)** | Reproducible but heavyweight; weaker composability (`PEP-009`), slower elasticity, higher operational toil; poor fit for 73 independently deployable services. |
| D | **Single-language monolith runtime** | Simplest operationally, but violates composability/independent-deployability (`PEP-018`) and the bounded-context decomposition mandated by `CTX-ARCHB-001` §1. |
| E | **Kubernetes + single mandated language, no polyglot** | Considered; rejected because experience-tier and low-latency control-plane needs are materially better served by TypeScript and Go respectively. Polyglot is therefore *governed*, not open. |

## 4. Consequences

**Positive**
- Cloud-portable, vendor-neutral execution honoring `PEP-010`; any conformant Kubernetes target works.
- Independent deployability and composability for all 73 `PRS-*` (`PEP-009`/`PEP-018`).
- Strong typing and a mature DDD ecosystem (Java 21) support contract-first boundaries (`PEB-*`).
- Declarative, reproducible workloads feed Resilience (`PE-13`), Observability (`PE-12`), and Delivery
  (`PE-14`, ADR-007).

**Negative / Trade-offs**
- Kubernetes operational complexity — mitigated by Delivery & IaC governance (ADR-007) and managed
  conformant distributions.
- Polyglot increases toolchain surface — bounded by the Approval-By-Exception allowance (`PEP-020`) and
  `PEG-001`.
- JVM memory footprint for small services — mitigated by Go for footprint-critical daemons.

**Follow-on obligations**
- Security substrate (identity propagation, mTLS, workload identity) is selected in **ADR-006**.
- CI/CD, image signing, and IaC for this substrate are selected in **ADR-007**.
- Capacity/scaling targets quantified against ASRs feed release gate R7 (Prompt 11/12).

## 5. Traceability

- **Realizes:** `UCOS-PEA-002` (`PRD-001..017`, `PRS-001..073`, `PEX-001..017`, `PWF-001..017`);
  `UCOS-PEA-001` `PE-01`, `PEG-001`, `PEO-001`, `PEB-001`.
- **Justified by ASR/principle:** `CTX-ARCHB-001` §1/§5/§6; `PEP-008/009/010/018/020`;
  `UCOS-PRINCIPLES` P7/P8.
- **Authority:** AUTH-004 (Architecture Canon), AUTH-009 (Governance Canon).
- **Consumed by (downstream):** ADR-003 (event consumers run here), ADR-006 (security substrate),
  ADR-007 (delivery/IaC), Prompt 09 (Security), Prompt 10 (Implementation), `UCOS-IMP-*` work packages
  `WP-PLT-01`.
- **Chain:** `ADR-001 → PE-01 / PRD-001 / PEX-* → CAP-15 → AUTH-004/009 → CTX-ARCHB-001 §5`.

## 6. Governance Impacts

- Satisfies **Phase 10.0 Condition C-4** (technology-selection ADRs) for the runtime concern.
- Governed by `PEG-001` (Runtime & Compute Governance); decision rights held by the Runtime & Compute
  Owner; escalation `PEO-001 → PE-17 → Authority Board`.
- **No** frozen-artifact mutation: `UCOS-PEA-001..007`, Governance Baseline 1.0.0, and all ratified
  constructs are unchanged. This ADR is additive.
- Non-waivable security controls **S1/S3/S4** (AUTH-008) are preserved; runtime selection does not waive
  them.
- Evolution is migration-only (`PEP-016`): superseding a selection requires a new ADR version + AUTH-012
  decision record.

## 7. Approval Status

| Field | Value |
|-------|-------|
| Status | **ACCEPTED** (technology-selection scope) |
| Approval model | Approval-By-Exception (`PEP-020`); ratified within the platform technology-selection ADR set by Platform Governance (`PE-17`) |
| Terminal authority | Authority Board (`PEG-017`) |
| Gating note | Enables — does not itself release — the Constitution Article IX generation lock; code generation remains gated by `UCOS-IMP-READY-001` (C-1..C-6) |

## 8. Ownership

| Role | Assignment |
|------|------------|
| Decision Owner (Engineering) | Runtime & Compute Owner (`PEO-001`) |
| Steward | Platform Governance Steward (CAP-15) |
| Governing Model | `PEG-001` |
| Boundary | `PEB-001` |
| Authority Chain | Runtime & Compute Owner → `PE-17` (Platform Governance) → Authority Board |

## Traceability (artifact)
- **Refines:** `UCOS-PEA-001`, `UCOS-PEA-002`, `CTX-ARCHB-001` §5, AUTH-004, AUTH-009, PROMPT-08.
- **Refined by:** `UCOS-PLAT-ADR-INDEX`; ADR-006, ADR-007; Prompts 09–12.
