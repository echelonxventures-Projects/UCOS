# UCOS Platform Technology-Selection ADR Index & Decision Record

**Artifact ID:** UCOS-PLAT-ADR-INDEX
**Layer:** ARCHITECTURE (Platform Engineering — Technology Selection)
**Phase:** Phase 10.1 — Platform Technology Selection (PROMPT-08 deliverable §7.1; Implementation Readiness Condition C-4)
**Status:** FINAL — ADR SET ACCEPTED (technology-selection scope)
**Version:** 1.0.0
**Date:** 2026-06-30
**Owner:** Platform Governance Owner (`PE-17`, `PEG-017`, CAP-15)
**Authority:** Subordinate to AUTH-001..012, `UCOS-CONST-001`, the ratified architectures, `UCOS-PEA-001..007`, the UCOS Governance Baseline 1.0.0, and `STATE-001`.

> **Mandate.** This index records the seven governed **technology-selection ADRs** mandated by PROMPT-08
> §7.1 and `CTX-ARCHB-001` §5 and deferred by `PEP-010` throughout Phases 9.0A–9.0C. It satisfies
> **Phase 10.0 Condition C-4** (`UCOS-IMP-READY-001`). The ADRs **select technology**; they do **not**
> generate source code, run pipelines, provision infrastructure, author event/API contracts (Prompt 07),
> or author the security threat model/controls (Prompt 09). They are **additive** and mutate **no** frozen
> artifact (`UCOS-PEA-001..007`, Governance Baseline 1.0.0, or any ratified domain/entity/matrix).
> Non-waivable controls **S1/S3/S4** (AUTH-008) are preserved. Code generation remains gated by the
> Constitution Article IX lock and `UCOS-IMP-READY-001` (conditions C-1..C-6).

---

## 1. ADR Inventory

| ADR | Artifact ID | Title | File | Governing Domain(s) | Capability | Status |
|-----|-------------|-------|------|---------------------|------------|--------|
| ADR-001 | `UCOS-PLAT-ADR-001` | Runtime & Compute | `UCOS-PLAT-ADR-001-RUNTIME.md` | `PE-01` | CAP-15 | ACCEPTED |
| ADR-002 | `UCOS-PLAT-ADR-002` | Storage & Persistence | `UCOS-PLAT-ADR-002-STORAGE.md` | `PE-02` | CAP-15 | ACCEPTED (analytical sub-decision deferred → `ADR-002A`) |
| ADR-003 | `UCOS-PLAT-ADR-003` | Event Fabric | `UCOS-PLAT-ADR-003-EVENT-FABRIC.md` | `PE-04` | CAP-12 | ACCEPTED |
| ADR-004 | `UCOS-PLAT-ADR-004` | Registry & Discovery | `UCOS-PLAT-ADR-004-REGISTRY.md` | `PE-06` | CAP-19 | ACCEPTED |
| ADR-005 | `UCOS-PLAT-ADR-005` | Metadata & Configuration Delivery | `UCOS-PLAT-ADR-005-METADATA.md` | `PE-11` | CAP-10 | ACCEPTED |
| ADR-006 | `UCOS-PLAT-ADR-006` | Security Substrate | `UCOS-PLAT-ADR-006-SECURITY.md` | `PE-08`, `PE-09`, `PE-03` | CAP-09, CAP-17 | ACCEPTED (threat model deferred → Prompt 09) |
| ADR-007 | `UCOS-PLAT-ADR-007` | Delivery Toolchain | `UCOS-PLAT-ADR-007-DELIVERY-TOOLCHAIN.md` | `PE-14`, `PE-15` | CAP-15 | ACCEPTED |

**Count:** 7 ADRs authored / 7 accepted / 0 rejected / 1 explicitly-deferred sub-decision (`ADR-002A` analytical store).

## 2. Decision Matrix (selected technology per concern)

| ADR | Concern | Selected technology (neutral contract) | Key alternatives rejected | Primary rejection driver |
|-----|---------|-----------------------------------------|---------------------------|--------------------------|
| ADR-001 | Runtime | OCI containers + **Kubernetes** (CNCF); primary **Java 21 LTS (JVM)**; governed polyglot (TypeScript/Node.js, Go) | FaaS-primary; single-cloud PaaS; VM-only; monolith; single-language | `PEP-010` neutrality; EX1 determinism; `PEP-009/018` composability |
| ADR-002 | Storage | **PostgreSQL** SoR + **S3-compatible** object + **OpenSearch** + **Redis**; analytical store → `ADR-002A` | Single proprietary DB; document-first SoR; NewSQL-primary; no-SoR polyglot | `PEP-010` neutrality; `PEP-005` single SoR; ACID for commerce |
| ADR-003 | Event Fabric | **Apache Kafka API** + **Schema Registry** + **CloudEvents**; at-least-once + idempotent consumers | Cloud-native bus; RabbitMQ; NATS-only; sync integration; no-schema-registry | `PEP-010`; replay needs; `PEP-015` contract evolution |
| ADR-004 | Registry | **Kubernetes** discovery + open **Schema/Contract Registry** + **PostgreSQL**-backed Platform Registry | Consul all-in-one; etcd-as-registry; cloud registry; single bespoke registry; no registry | `PEP-005` single SoR; `PEP-010`; layered authority |
| ADR-005 | Metadata | **PostgreSQL** SoR + Config/Metadata service API + **GitOps** + **JSON Schema** (secrets excluded) | KV store SoR; cloud config; build-baked config; config+secrets together; GitOps-only | `PEP-002/003/004`; secrets separation (`PEB-011`) |
| ADR-006 | Security | **OIDC/OAuth2** IdP + **OPA** policy-as-code + **mTLS** service mesh + **secrets mgr/KMS** | Single cloud IAM/KMS; bespoke auth; perimeter-only; secrets-in-config; auth-in-code | `PEP-010`; AUTH-008 S1/S3/S4; `PEP-003` |
| ADR-007 | Delivery | **Git** + pipeline-as-code + **Terraform/OpenTofu** + **GitOps** (Argo/Flux) + **Sigstore/cosign** + OCI registry | Cloud-native CI/CD suite; imperative provisioning; push deploys; unsigned artifacts; ungated promotion | `PEP-010`; `PEB-014/015`; `GATE-REL-001`; AUTH-008 supply chain |

> **Cross-cutting selection theme:** every selection is expressed as an **open/neutral contract**
> (Kubernetes API, S3 API, Kafka API, OIDC/OAuth2, OpenAPI/AsyncAPI, CloudEvents, OCI, Terraform/HCL),
> satisfying `PEP-010` Platform Independence and `CTX-ARCHB-001` §5 cloud-neutrality.

## 3. Traceability Summary

Each ADR traces backward to the upstream architecture it realizes, the ASR/principle that justifies it,
and the governing Authority, and forward to its consumers (PROMPT-08 §9).

| ADR | Realizes (upstream) | ASR / Principle | Authority | Forward consumers |
|-----|---------------------|-----------------|-----------|-------------------|
| ADR-001 | `PEA-002` (PRD/PRS/PEX/PWF), `PEA-001` `PE-01` | §1/§5/§6; `PEP-008/009/010/018/020` | AUTH-004/009 | ADR-003/006/007; Prompts 09–10; `WP-PLT-01` |
| ADR-002 | `UCOS-PDATA-ARCH-001` (PD/PDE/PDP), `PEA-001` `PE-02` | §5/§6; `PEP-002/005/010/013` | AUTH-007/008/009 | ADR-003/004/005/006; `WP-PLT-02` |
| ADR-003 | `PEA-003` (PEV/PED/PEGM/PEL/TM-PEA-014/015), `PE-04` | §1/§3.3/§5; `PEP-008/009/010/015/018` | AUTH-004/009 | ADR-002/004/006; Prompt 07; `WP-PLT-04` |
| ADR-004 | `PEA-004` (PRG/PRE/PRA/PRL/TM-PEA-011-013), `PE-06` | `PEP-001/005/006/010` | AUTH-009/010 | ADR-003/005/006; Prompt 07; `WP-PLT-06` |
| ADR-005 | `PEA-005`/`PEA-006` (PCD/PCF/PMD/PME), `UCOS-INF-ARCH-001`, `PE-11` | `PEP-002/003/004/005/010/015/016` | AUTH-007/009 | ADR-006/007/004; `WP-PLT-11` |
| ADR-006 | `PEA-001` `PE-03/08/09` (PEG/PEO/PEB-003/008/009) | §3/§4/§5; `PEP-002/003/004/010/011/019` | AUTH-008/009 | Prompt 09 (C-3); ADR-002/003/004/007; `WP-PLT-03/08/09` |
| ADR-007 | `PEA-001` `PE-14/15`, `UCOS-IMP-DELIV-001`, `UCOS-IMP-GOV-001` | §5/§6; `PEP-001/003/010/012/016/020`; `GATE-REL-001` | AUTH-008/009; `GATE-REL-001` | ADR-001/005/006; all `WP-*`; Prompts 10–12 |

**Coverage:** mandatory cross-cutting concerns (`CTX-ARCHB-001` §4) — identity & tenancy (ADR-006),
configuration/metadata (ADR-005), observability substrate (runs on ADR-001/007; observability product
selection remains a future governed sub-ADR under `PE-12`), security (ADR-006), resilience/idempotency
(ADR-001/003/007 + `PE-13` posture), auditability (ADR-002/006 + `PE-10`). Platform domains addressed by
this ADR set: `PE-01, PE-02, PE-03, PE-04, PE-06, PE-08, PE-09, PE-11, PE-14, PE-15` (10 of 17). Domains
not requiring a distinct product selection at this stage and/or carried as future governed sub-ADRs:
`PE-05` (API gateway — realized via ADR-003/004 + Prompt 07 contracts), `PE-07` (workflow/orchestration),
`PE-10` (audit/evidence — substrate via ADR-002/006), `PE-12` (observability product), `PE-13`
(resilience — posture realized via ADR-001/003/007), `PE-16` (analytics engine — `ADR-002A`), `PE-17`
(governance control plane — process, not a product). These are explicitly flagged, not silently omitted.

## 4. Validation Results

| Check | Criterion | Result |
|-------|-----------|:------:|
| ADR completeness | All 7 ADRs present with the 8 mandated sections (Context, Decision, Alternatives Considered, Consequences, Traceability, Governance Impacts, Approval Status, Ownership) | ✅ PASS (7/7; 8/8 sections each) |
| Concern coverage | ADR-001..007 cover Runtime, Storage, Event Fabric, Registry, Metadata, Security, Delivery Toolchain | ✅ PASS (7/7) |
| Traceability | Every ADR traces to the upstream architecture, ASR/principle, Authority, and forward consumers | ✅ PASS (0 orphans; 0 broken chains) |
| Architecture-constraint alignment | Every selection honors `CTX-ARCHB-001` §1/§3/§5 and the bound `PEP-*` | ✅ PASS |
| Platform independence | All selections expressed as open/neutral contracts (`PEP-010`) | ✅ PASS |
| Governance compliance | Single-owner per ADR; `PEG/PEO/PEB` cited; escalation terminal at Authority Board; Approval-By-Exception (`PEP-020`) | ✅ PASS |
| Non-waivable controls | S1/S3/S4 (AUTH-008) preserved; never waived | ✅ PASS |
| Frozen-artifact integrity | 0 mutation of `UCOS-PEA-001..007`, Governance Baseline 1.0.0, ratified domains/entities/matrices | ✅ PASS (additive only) |
| Scope discipline | No source code; no live infrastructure/provisioning; event/API contracts (Prompt 07) and threat model/controls (Prompt 09) not authored here | ✅ PASS |
| Condition C-4 | Phase 10.0 technology-selection ADR condition satisfied | ✅ PASS |

**Open / deferred items (flagged, non-blocking):**
- `UCOS-PLAT-ADR-002A` — analytical/OLAP store selection (deferred until analytics ASRs are quantified).
- Observability product selection under `PE-12` — future governed sub-ADR.
- Workflow/orchestration engine under `PE-07` — future governed sub-ADR if a distinct product is needed.

## 5. Governance & Gating

- These ADRs are **ACCEPTED** technology-selection decisions ratified within the platform
  technology-selection ADR set by Platform Governance (`PE-17`/`PEG-017`), terminal authority the
  Authority Board.
- They satisfy **C-4** of `UCOS-IMP-READY-001` and feed the Platform Engineering ratification (Phase
  9.1, condition C-5) and the Authority Board Article IX lock release (condition C-6).
- They do **not** themselves release the Article IX generation lock; Prompt 10 code generation remains
  gated on C-1..C-6.
- Evolution is migration-only (`PEP-016`): superseding any selection requires a new ADR version + an
  AUTH-012 decision record; rejected/changed ADRs are never deleted.

## Traceability (artifact)
- **Refines:** `UCOS-PEA-001..007`, `UCOS-PDATA-ARCH-001`, `UCOS-INF-ARCH-001`, `UCOS-IMP-DELIV-001`,
  `UCOS-IMP-GOV-001`, `UCOS-IMP-READY-001`, `CTX-ARCHB-001` §5, AUTH-004/007/008/009/010, `GATE-REL-001`,
  PROMPT-08.
- **Refined by:** `UCOS-PLAT-ADR-001..007`; Phase 9.1 platform ratification; Prompts 09–12;
  `UCOS-IMP-*` work packages.
