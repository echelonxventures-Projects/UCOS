# PROMPT09-SECURITY-REGISTRY

**Artifact:** PDATA-P09-SECREG-001 (Prompt-09 WS5 — evidence for `EV-PROMPT-09`)
**Phase:** PHASE D.3 — Prompt-09
**Authority:** Contract Authority (this work item) consuming ratified `UCOS-SEC-ARCH-001`; security-authority owner `UCOS-DOM-024` / CAP-17; `GATE-DOC-001`.
**Machine-readable canonical registry:** `contracts/security/security-authority-registry.json` (`ucos-security-authority/1.0.0`).
**Discipline (ABSOLUTE RULE):** author canonical **security metadata only**. **No control implemented, no authorization logic, no runtime behavior, no new control minted.** All security is expressed by reference to the ratified catalog `SEC-CTL-001..020` and trust boundaries `TB-01..10`.

---

## 1. Canonical security profiles (3)

Security authority is factored into three profiles keyed by the Prompt-08 operation `kind`, then bound to each operation/event. Each profile carries the WS5-mandated dimensions: authentication, authorization, trust boundary, audit, integrity, non-repudiation, separation-of-duty, plus non-waivable flags and authority source.

| Profile | Applies to | Authn | Authz | Integrity | Audit | Non-repudiation | SoD |
|---------|-----------|-------|-------|-----------|-------|-----------------|-----|
| **SP-READ** | 6 safe-reads | SEC-CTL-001/004/014 (S1) | deny-by-default 002/003/013 (S1/S4) | 008/015 (S4) | 011 (S6) | — | — |
| **SP-WRITE** | putConfigurationByScopeByKey, postRegistryArtifacts | SEC-CTL-001/004/014 (S1) | + elevated write scope + trust floor 002/003/013 | 008/015/**016** (S4) | 011/**012** (S6) | **012/011** | **AD-0009 + PI-6; proposer≠approver≠committer** |
| **SP-EVENT** | 6 events | SEC-CTL-014 (S1) | deny-by-default publish 002 | 008/**016** (S4) | 011/012 (S6) | 011/012 | — |

**Non-waivable on every profile:** **S1** (authn/authz), **S3** (secrets — platform-realized), **S4** (data protection). Per `AUTH-008` §7 / `UCOS-CONST-001` X.5.

## 2. Operation → security authority (8/8)

| operationId | profile | trust boundaries |
|-------------|:-------:|------------------|
| getConfigurationByScope | SP-READ | TB-01, TB-09 |
| putConfigurationByScopeByKey | SP-WRITE | TB-01, TB-09 |
| getMetadataByClass | SP-READ | TB-01, TB-09 |
| getFeatureFlagsByContext | SP-READ | TB-01, TB-09 |
| getRegistryArtifacts | SP-READ | TB-01, TB-08 |
| postRegistryArtifacts | SP-WRITE | TB-01, TB-08 |
| getRegistryArtifactsById | SP-READ | TB-01, TB-08 |
| getRegistryDiscovery | SP-READ | TB-01, TB-08 |

## 3. Event → security authority (6/6)

All six events → **SP-EVENT** on **TB-02** (event fabric): deny-by-default publish authorization (SEC-CTL-002), boundary authn/authz (SEC-CTL-014), replay/duplicate rejection (SEC-CTL-016), transit encryption (SEC-CTL-008), immutable + attestable audit (SEC-CTL-011/012).

## 4. Payload family → data protection (5/5)

Classification is **inherited** from `UCOS-PDATA-ARCH-001` (never embedded). Config/metadata/registry families carry SEC-CTL-008 (transit), 009 (at rest), 010 (classification/minimization), 003 (tenancy); the two projection/decision families (FeatureFlag, DiscoveryRecord) carry 008 + 010.

## 5. Separation-of-duty for governed writes

`putConfigurationByScopeByKey` and `postRegistryArtifacts` are governed writes: authority requires **AD-0009 Approval-Required** plus routing through the **sole PI-6 Evolution commit path** with **proposer ≠ approver ≠ committer**. This is authority metadata; the enforcing mechanism is the ratified control fabric (Prompt 10 realizes it).

## 6. Catalog placeholder resolution

`contracts/catalog/api-018|027.contract.json` carry `"security": "FLAGGED FOR PROMPT 09"`. Prompt-09 **resolves this by reference**: the authoritative security metadata now resides in `contracts/security/security-authority-registry.json` keyed by `operationId`/event. The catalog files are **left unmodified** (append-only discipline; the placeholder correctly denotes "authority lives in Prompt-09's registry").

## 7. Boundary discipline honored

- No control implemented; every requirement references an existing `SEC-CTL-*` (14 bound; 6 platform-scoped recorded).
- No authorization logic, policy code, key material, or credential handling authored.
- Non-waivable S1/S3/S4 asserted, not weakened (IP-17 / SP-10: autonomy never weakens security).
- Article IX unaffected — governance/authority metadata only; no fabric source generated.

## Traceability

Refines `UCOS-SEC-ARCH-001`, `UCOS-SEC-CONTROL-001`, `UCOS-SEC-TRACE-001`, `AUTH-008`, `UCOS-CONST-001` (Part X), `contracts/bindings/operation-payload-bindings.json`, `contracts/catalog/api-018|027.contract.json`. Governed by `UCOS-SVC-POLICY-001`; owner `UCOS-DOM-024` / CAP-17. Evidence for `EV-PROMPT-09`.
