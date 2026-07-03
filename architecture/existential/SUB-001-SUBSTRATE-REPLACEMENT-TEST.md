# SUB-001 — Substrate Replacement Test (Technology Independence Verification)

> **STATUS: CREATED — READY FOR REVIEW**
> CONCEPTUAL DESIGN / VERIFICATION ONLY · NO CODE · NO TECHNOLOGY BOUND · NO IMPLEMENTATION AUTHORIZED
> DOES NOT MODIFY INV-1 THROUGH INV-13 · DOES NOT ENROLL INV-14 THROUGH INV-20 · DOES NOT OVERRIDE AUTH-012
> DOES NOT RELEASE ARTICLE IX · DOES NOT MUTATE ANY FROZEN CONSTRUCT · REQUIRES AUTHORITY BOARD REVIEW

| Field | Value |
|-------|-------|
| Artifact ID | `SUB-001` |
| Name | Substrate Replacement Test |
| Phase | **PHASE UA-09 — Substrate Replacement Test** |
| Classification | **VERIFICATION — PENDING AUTHORITY BOARD REVIEW** |
| Mode | **DESIGN & VERIFICATION ONLY** — no code, no vendor binding, no provisioning |
| Subject of test | Implemented substrate `packages/platform-runtime/**` + governing ADRs `UCOS-PLAT-ADR-001..007` + `PEP-010` (Platform Independence) |
| Governing principle | **PEP-010** platform independence · dependency inversion (Meta-Core ports) · **IP-04** metadata-first / no-hardcoding · cloud-neutral open contracts (`CTX-ARCHB-001` §5) |
| Subordinate to | `AUTH-008` (S1/S3/S4), `AUTH-009`, `AUTH-012` / **AD-0014**, Constitution Article IX |

---

## 1. Mission

Verify that each of the following six substrate technologies can be **replaced without architectural redesign**:

> Database · Storage · Message Bus · AI Models · Identity Systems · Cloud Providers

The falsifiable test for "without architectural redesign": replacing a technology must require only (a) a new
**adapter** behind an existing **port/seam**, and/or (b) **configuration/ADR** change — and must require **no**
change to the Meta-Core kernel, the control plane decision path, any construct kind, or any consumer of the
port. A concrete technology name appearing in kernel/control code (an `import` of a DB driver, cloud SDK,
broker client, model client, or IdP SDK) is a **substrate dependency** and fails the test.

Determination: **SUBSTRATE INDEPENDENT** or **SUBSTRATE DEPENDENCIES FOUND**.

## 2. Method

Direct inspection of the implemented runtime (`packages/platform-runtime/src/**`) for: (i) the seam through
which each technology is reached, (ii) whether the kernel/control layer depends only on that interface, and
(iii) whether any concrete vendor/product/SDK is imported or hardcoded. Cross-checked against the governing
technology ADRs, which express every selection as an **open/neutral contract** (Kubernetes / S3 / Kafka API /
CloudEvents / OIDC-OAuth2 / OCI / Terraform), not a vendor lock.

## 3. Replacement matrix (evidence-based)

| # | Technology | Replacement seam (interface) | Reference adapter today | Governing neutral contract | Concrete vendor bound in code? | Replaceable w/o redesign? |
|:-:|-----------|------------------------------|-------------------------|----------------------------|:------------------------------:|:-------------------------:|
| 1 | **Database** | `MetadataPort`, `RegistryPort` (`src/meta-core/ports.ts`) — kernel depends only on these interfaces | `InMemoryMetadataStore`, `InMemoryRegistry` | ADR-002 (PostgreSQL SoR) / ADR-004 (Registry) | **No** — no driver import; stores are pure TS | **Yes** — swap adapter behind port |
| 2 | **Storage** | `MetadataPort` (records) + object-storage adapter (by contract) | in-memory record store | ADR-002 (S3-compatible object) | **No** | **Yes** — via port/adapter (see C-3) |
| 3 | **Message Bus** | *(no implemented eventing port yet)* — substrate is synchronous; `AuditSink` is a one-way append seam, not a bus | none (no broker used) | ADR-003 (Kafka API + Schema Registry + CloudEvents) | **No** — nothing bound; **no bus dependency exists to remove** | **Yes, by design** — no lock-in; not yet code-exercised (see C-1) |
| 4 | **AI Models** | Async provider pattern + design seams `PredictiveModel` / `InferenceModel` / `DeterministicVerifier` (INT-ARCH-001 / SIM-PLAN-001) | none (`intelligence`/`simulation` fabrics not implemented) | INT-ARCH determinism-quarantine (advisory, verifier-gated, pluggable) | **No** — no model client bound | **Yes, by design** — no lock-in; not yet code-exercised (see C-2) |
| 5 | **Identity Systems** | `IdentityProvider` + `AsyncIdentityProvider` + `CredentialVerifier` + federation `FederatedIdentityProvider` (`src/control/types.ts`, `src/control/identity/*`, `src/control/federation/*`) | in-memory identity registry; default token verifier | ADR-006 (OIDC/OAuth2), FED-SEC-001 (Ed25519 assertions) | **No** — verifier is pluggable; default token has no SDK | **Yes** — implemented & exercised (65→90 tests) |
| 6 | **Cloud Providers** | none required — kernel/control is pure `TypeScript`/Node with **zero cloud SDK imports**; `external_exposure=false` by default | runs anywhere Node runs | ADR-001 (OCI/Kubernetes), ADR-007 (Terraform/OpenTofu, GitOps) | **No** — no cloud API imported | **Yes** — no cloud coupling to redesign |

## 4. Structural findings

1. **Dependency inversion is real and enforced at the kernel boundary.** `src/meta-core/ports.ts` states the
   contract explicitly: *"The Registry, Metadata, and Configuration runtimes are concrete adapters. Swapping
   any storage backend requires no kernel change."* Verified: the kernel imports **interfaces only**.
2. **No hardcoded technology anywhere in the implemented layers.** IP-04 is upheld — identities, policies,
   governance, and capability config are **runtime records** in the substrate stores; there are no compiled-in
   identities/permissions/policies and no vendor/product/cloud/database imports in `meta-core` or `control`.
3. **The audit seam is already substituted in practice.** `AuditSink` (`src/control/audit-log.ts`) is swapped
   from `InMemoryAuditLog` to `FederatedAuditLog` (hash-chained) via `createControlPlane({ auditSink })` with
   **zero** change to `ControlPlane` — a live, working demonstration of substrate substitution without redesign.
4. **Identity replaceability is proven, not just designed.** The federation implementation swaps in signed
   Ed25519 identity/trust providers behind the same `IdentityProvider`/`TrustAuthority` seams while keeping the
   synchronous PI-4 decision path and its 65/90 tests green.
5. **Cloud independence is structural.** The runtime executes on the Node built-in runner with no cloud
   dependency; all cloud/infra selections are deferred to ADR-001/007 as neutral contracts (Kubernetes/OCI/
   Terraform), so there is no cloud coupling to redesign away.

## 5. Assumptions / dependencies examined (honest register)

| ID | Item | Is it a substrate dependency? | Assessment |
|----|------|:-----------------------------:|------------|
| D-1 | In-memory reference adapters (metadata/registry/config/audit) | **No** | These are *default adapters* behind ports, not couplings; durable adapters swap in with no kernel change. |
| D-2 | `node:crypto` used for Ed25519 in federation | **Partial (runtime primitive)** | A Node runtime primitive, not one of the six categories; ADR-006 governs KMS. Recommend an explicit crypto/KMS provider seam (C-4) — does not couple DB/bus/cloud/model/IdP. |
| D-3 | Message bus not yet abstracted in code | **No dependency** (nothing bound) | No broker is used; there is **no lock-in to remove**. Coverage gap only (C-1). |
| D-4 | AI-model seams design-only | **No dependency** (nothing bound) | No model client is imported; determinism-quarantine keeps any future model advisory/pluggable. Coverage gap only (C-2). |
| D-5 | Object/blob storage not a separate port | **No dependency** | Records ride `MetadataPort`; ADR-002 specifies neutral S3-compatible object storage. Recommend explicit object-storage port (C-3). |

**No concrete database, storage product, message broker, AI-model client, identity provider, or cloud SDK is
imported or hardcoded anywhere in the implemented substrate.** Zero Class-of-six vendor bindings were found.

## 6. Conditions (to preserve independence as implementation proceeds)

- **C-1 — Message Bus:** when eventing is implemented (ADR-003), it MUST land behind a dependency-inverted
  `EventPort`/publish-subscribe seam (CloudEvents-shaped payloads, Kafka-API-neutral), mirroring the existing
  port pattern. No broker client may be imported by the kernel/control layer.
- **C-2 — AI Models:** the `PredictiveModel`/`InferenceModel` adapters MUST be pluggable, advisory-only, and
  deterministic-verifier-gated (INT-ARCH-001), so any model (or none) is swappable without redesign.
- **C-3 — Object storage:** expose an explicit object/blob storage port (ADR-002 neutral) rather than routing
  large objects through `MetadataPort`.
- **C-4 — Crypto/KMS:** introduce an explicit crypto/KMS provider seam (ADR-006) so `node:crypto` is one
  adapter among alternatives (HSM/cloud KMS) rather than a direct call.
- **C-5 — Non-waivable controls:** every replacement adapter MUST preserve S1/S3/S4 identically (AUTH-008);
  substrate substitution may never weaken authn/authz, secrets-by-reference, or data protection.

## 7. Determination

Every **implemented** substrate touch-point (Database, Storage-of-records, Identity, Audit, Cloud) is reached
**only** through a dependency-inverted port/seam with in-memory reference adapters and **zero** concrete
technology imports; substitution is adapter + configuration work, never architectural redesign — and one such
substitution (audit → federated hash-chained sink; identity → signed federated providers) is already
demonstrated in working, tested code. The two **not-yet-implemented** elements (Message Bus, AI Models) carry
**no lock-in to remove** and are governed by neutral open-contract ADRs plus the mandatory port pattern
(conditions C-1/C-2). No dependency of the six categories is bound in the kernel or control layer.

### OUTPUT

> # SUBSTRATE INDEPENDENT
>
> *(All six technologies are replaceable without architectural redesign: implemented touch-points sit behind
> dependency-inverted ports/seams with zero vendor imports — verified in `src/meta-core/ports.ts`,
> `src/control/types.ts`, `src/control/audit-log.ts`, `src/control/identity/*`, `src/control/federation/*` — and
> the unimplemented elements (Message Bus, AI Models) have no binding to remove and are governed by neutral
> open-contract ADRs. Independence is preserved as construction proceeds only by honoring conditions C-1..C-5;
> these are forward obligations, not present dependencies.)*

## 8. Traceability

- **Verifies against:** `packages/platform-runtime/src/meta-core/ports.ts` (`RegistryPort`/`MetadataPort`/
  `ConfigurationPort`), `src/control/types.ts` (`IdentityProvider`/`AsyncIdentityProvider`/`TrustAuthority`/
  `CredentialVerifier`), `src/control/audit-log.ts` (`AuditSink`), `src/control/federation/*`
  (`FederatedAuditLog`, federated identity/trust providers).
- **Governed by:** `PEP-010` (Platform Independence), `IP-04` (metadata-first), `CTX-ARCHB-001` §5
  (cloud-neutrality), ADRs `UCOS-PLAT-ADR-001..007`, `AUTH-008` (non-waivable S1/S3/S4), **AD-0014** (Ω∞
  deferral), Constitution Article IX (generation lock — unaffected).
- **Related:** `UNIV-ENTITY-001` (PHASE UA-02), `UCOS-UEA-0005` (Computation-Agnostic), `UCOS-UEA-0008`
  (Universal Federation).
- **Owner:** UCOS Authority Board (disposition).

**END SUB-001 — SUBSTRATE REPLACEMENT TEST · SUBSTRATE INDEPENDENT (with forward conditions C-1..C-5) · NO CODE / NO VENDOR BOUND / NO IMPLEMENTATION AUTHORIZED · INV-1..13 UNCHANGED · ARTICLE IX NOT RELEASED · PENDING AUTHORITY BOARD REVIEW.**
