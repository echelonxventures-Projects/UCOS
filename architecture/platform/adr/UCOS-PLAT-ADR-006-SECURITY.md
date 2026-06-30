# ADR-006 — Security Substrate Technology Selection

**Artifact ID:** UCOS-PLAT-ADR-006
**Short Name:** ADR-006 Security
**Layer:** ARCHITECTURE (Platform Engineering — Technology Selection)
**Phase:** Phase 10.1 — Platform Technology Selection (Implementation Readiness Condition C-4)
**Status:** ACCEPTED (technology-selection scope)
**Version:** 1.0.0
**Date:** 2026-06-30
**Decision Owner:** Platform Engineering — Identity & Tenancy Owner (`PEO-008`), with Secrets & Key Owner (`PEO-009`) and Connectivity Owner (`PEO-003`)
**Governing Domains:** `PE-08` Identity, Access & Tenancy; `PE-09` Secrets & Key Management; `PE-03` Networking & Connectivity (Trust + Execution Planes)
**Capability Anchors:** CAP-09 Identity & Access Management; CAP-17 Security & Trust

> **Scope notice.** Technology selection authorized by `CTX-ARCHB-001` §5; deferred by `PEP-010`. This
> ADR selects the **security substrate** (the governed trust primitives the platform provides). It does
> **NOT** author the **threat model or security control mapping** — those are owned exclusively by
> **Prompt 09** (`PEB-008` prohibited interaction). Non-waivable controls **S1/S3/S4** (AUTH-008) are
> preserved and never waived by this selection. No frozen artifact is mutated.

---

## 1. Context

`UCOS-PEA-001` establishes the Trust Plane substrate governance: `PE-08` (Identity, Access & Tenancy,
CAP-09/17), `PE-09` (Secrets & Key Management, CAP-17), and `PE-03` (Networking & Connectivity, security
steward CAP-17). The platform must provide a *governed trust substrate* into which every bounded context
is designed (`CTX-ARCHB-001` §4 — identity & tenancy, security designed in, not bolted on), while the
authoring of controls and the threat model is deferred to Prompt 09. The substrate must provide:

- **Authentication / authorization** primitives (`PEG-008`, `PEB-008`) bounded by non-waivable S1/S3/S4;
- **Tenancy isolation** primitives (`PEB-008`);
- **Secrets isolation and key lifecycle** separated from code and configuration (`PEG-009`, `PEB-009`;
  `PEP-003`);
- **Least-privilege, segmented, auditable connectivity** (`PEG-003`, `PEB-003`);
- **Cloud-neutral / portable** trust primitives (`PEP-010`); full **auditability** (`PEP-011`, `PE-10`).

## 2. Decision

**Adopt standards-based, cloud-neutral trust primitives: OIDC/OAuth2 identity, workload identity +
mTLS via a service mesh, an external secrets manager + KMS, and policy-as-code authorization — with all
control authoring and threat modeling deferred to Prompt 09.**

1. **Identity & access (`PE-08`):** **OIDC / OAuth 2.x** as the authentication contract, served by an
   **OpenID-Connect-conformant identity provider** (cloud-neutral; a conformant IdP such as an
   open-source Keycloak-class server or any managed OIDC provider satisfies the contract). Token-based
   authn; **RBAC + ABAC** authorization. Tenancy isolation enforced via verified token claims +
   namespace boundaries (ADR-001).
2. **Authorization policy:** externalized **policy-as-code** (Open Policy Agent / OPA-compatible)
   evaluated at boundaries — authorization rules are governed data, not embedded code (`PEP-002/004`).
   *Policy content* (the controls themselves) remains Prompt 09's authority.
3. **Workload identity & transport security (`PE-03`):** **mutual TLS (mTLS)** for all
   service-to-service traffic via a **service mesh** (CNCF, vendor-neutral — e.g., Istio/Linkerd-class),
   providing zero-trust segmentation and least-privilege connectivity. Mesh is the connectivity-security
   substrate; selection is cloud-neutral.
4. **Secrets & key management (`PE-09`):** a dedicated **secrets manager + KMS** (cloud-neutral — e.g.,
   a HashiCorp-Vault-class secrets engine or a cloud KMS behind a neutral interface). Secrets are
   isolated from code, configuration (ADR-005), and IaC (ADR-007); keys are lifecycle-managed; secret
   injection is runtime-only (`PEP-003`, `PEB-009`).
5. **Auditability:** all identity, access, secrets, and connectivity decisions emit audit signals to
   `PE-10` (Audit & Evidence) (`PEP-011`).

## 3. Alternatives Considered

| # | Alternative | Why not selected |
|---|-------------|------------------|
| A | **Single cloud-native IAM + KMS + private networking** | Lowest integration effort, but vendor-locked identity/keys/networking violate `PEP-010`/§5 and cross-cloud portability. |
| B | **Custom/bespoke auth (hand-rolled tokens, custom crypto)** | High risk; conflicts with AUTH-008 security posture and S1/S3/S4 assurance; standards (OIDC/OAuth2, mTLS) are mandated for auditability and interoperability. |
| C | **Network-perimeter security only (no mTLS / no zero-trust)** | Insufficient for `PEB-003` least-privilege/segmentation and `CTX-ARCHB-001` §3 boundary integrity; perimeter-only trust is rejected. |
| D | **Secrets in configuration or environment variables** | Direct violation of `PEP-003` and `PEB-009`/`PEB-011`; an isolated secrets/KMS substrate is mandatory. |
| E | **Embedding authorization logic in service code** | Violates `PEP-002/004` (variability/policy as governed data); policy-as-code is required, with control content owned by Prompt 09. |

## 4. Consequences

**Positive**
- Standards-based, cloud-neutral trust primitives honoring `PEP-010` and AUTH-008 posture.
- mTLS + service mesh deliver zero-trust, least-privilege, auditable connectivity (`PEB-003`).
- Isolated secrets/KMS enforce `PEP-003` separation and `PEB-009`.
- Policy-as-code cleanly separates *substrate* (this ADR) from *control content* (Prompt 09).
- All trust decisions are auditable via `PE-10` (`PEP-011`); S1/S3/S4 preserved.

**Negative / Trade-offs**
- Service mesh + IdP + secrets/KMS increase operational complexity — bounded by ADR-007 (delivery/IaC)
  and `PE-13` resilience posture.
- mTLS performance overhead — acceptable for the security posture; tunable per `PEG-003`.
- Multiple trust components require disciplined boundary ownership — provided by `PEB-003/008/009`.

**Follow-on obligations (Prompt 09 — out of scope here)**
- **Threat model**, control catalog, control-to-asset mapping, and security assurance are authored by
  **Prompt 09** (Condition **C-3**), building on this substrate.
- Encryption-at-rest for ADR-002 stores binds to the KMS selected here.
- Identity propagation to the ADR-003 event backbone and ADR-004 registry uses these primitives.

## 5. Traceability

- **Realizes (substrate):** `UCOS-PEA-001` `PE-03/PE-08/PE-09`, `PEG-003/008/009`, `PEO-003/008/009`,
  `PEB-003/008/009`.
- **Justified by ASR/principle:** `CTX-ARCHB-001` §3/§4/§5; `PEP-002/003/004/010/011/019`; AUTH-008
  (S1/S3/S4 non-waivable).
- **Authority:** AUTH-008 (Security Canon), AUTH-009.
- **Consumed by (downstream):** **Prompt 09** (threat model + controls — C-3), ADR-002 (encryption/KMS),
  ADR-003 (transport security), ADR-004 (access control), ADR-007 (secret/IaC separation), Prompt 10
  (`WP-PLT-08`/`WP-PLT-09`/`WP-PLT-03`).
- **Chain:** `ADR-006 → PE-08/PE-09/PE-03 → CAP-09/CAP-17 → AUTH-008/009 → CTX-ARCHB-001 §4`.

## 6. Governance Impacts

- Satisfies **Phase 10.0 Condition C-4** for the security-substrate concern; **enables** Condition
  **C-3** (Prompt 09) by providing the substrate it builds on.
- Governed by `PEG-003/008/009`; escalation to `PE-17 → Authority Board`.
- **Non-waivable controls S1/S3/S4 (AUTH-008) preserved** — this selection never waives them; ownership
  of non-waivable security is never delegated away (`PEO-008` note).
- Security **control authoring / threat model is NOT performed here** (`PEB-008` honored) — deferred to
  Prompt 09.
- Additive only; no frozen-artifact mutation; migration-only evolution (`PEP-016`).

## 7. Approval Status

| Field | Value |
|-------|-------|
| Status | **ACCEPTED** (security-substrate technology-selection scope) |
| Approval model | Approval-By-Exception (`PEP-020`); ratified within the technology-selection ADR set by `PE-17`; security-control content subject to Prompt 09 + AUTH-008 |
| Terminal authority | Authority Board (`PEG-017`); non-waivable S1/S3/S4 not subject to waiver |
| Gating note | Threat model + controls (Prompt 09 / C-3) and the Article IX lock remain gating for code generation (`UCOS-IMP-READY-001`) |

## 8. Ownership

| Role | Assignment |
|------|------------|
| Decision Owner (Engineering) | Identity & Tenancy Owner (`PEO-008`); Secrets & Key Owner (`PEO-009`); Connectivity Owner (`PEO-003`) |
| Steward | Security & Trust Steward (CAP-17); Identity & Access Steward (CAP-09) |
| Governing Models | `PEG-003`, `PEG-008`, `PEG-009` |
| Boundaries | `PEB-003`, `PEB-008`, `PEB-009` |
| Authority Chain | Engineering Owners → `PE-17` → Authority Board |

## Traceability (artifact)
- **Refines:** `UCOS-PEA-001`, `CTX-ARCHB-001` §4/§5, AUTH-008/009, PROMPT-08.
- **Refined by:** `UCOS-PLAT-ADR-INDEX`; Prompt 09 (threat model + controls); ADR-002/003/004/007; Prompts 10–12.
