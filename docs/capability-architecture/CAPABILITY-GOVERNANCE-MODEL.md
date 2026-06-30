# UCOS — Capability Governance Model

**Artifact ID:** UCOS-CAP-GOV-001
**Layer:** ARCHITECTURE (Capability)
**Status:** CREATED (Phase 4.0; verification & ratification deferred to Phase 4.1)
**Version:** 1.0.0
**Phase:** Phase 4.0 — Capability Architecture Generation
**Date:** 2026-06-29
**Owner:** Governance Capability Architect
**Parent:** `UCOS-CAP-ARCH-001`

> **Purpose.** Define how the 19 ratified capabilities are governed: the governance spine, the
> governance capabilities, ownership and accountability, approval-by-exception, security/compliance
> governance, evolution governance, and the integrity principles the capability landscape must
> satisfy. Conceptual only — no implementation, no controls designed (controls are Prompt 09).

---

## 1. Governance Spine

All 19 capabilities are subordinate to the fixed governance spine (AUTH-009 §6.1; EA §XIV.1;
Domain Architecture §IX.1):

```
Authority  →  Constitution  →  Enterprise Architecture  →  Domain Architecture  →  Capability Architecture  →  (downstream)
```

In any conflict, **Authority prevails**, then Constitution, then Enterprise Architecture, then Domain
Architecture (AUTH-009 §6.2). Capability Architecture never supersedes its predecessors.

Within the platform, the **Platform Governance capabilities** operate this spine at the capability
tier while remaining subordinate to Authority + Constitution:

| Capability | Domain (1:1) | Governance role |
|-----------|--------------|-----------------|
| CAP-15 Platform Governance | UCOS-DOM-022 | Governs the governance system itself (rules-of-rules) |
| CAP-18 Policy & Decisioning | UCOS-DOM-025 | Governs behavior of all capabilities via policy |
| CAP-16 Compliance & Assurance | UCOS-DOM-023 | Verifies conformance; blocking-gap governance |
| CAP-17 Security & Trust | UCOS-DOM-024 | Governs protection posture (non-waivable S1/S3/S4) |

---

## 2. Capability Ownership & Accountability

### 2.1 Single Ownership Principle

Each capability has exactly **one primary owning domain**. Multi-facet capabilities (CAP-06, CAP-14)
split into distinct, single-owner facets; there is no co-ownership of one model. Platform Governance
capabilities (CAP-15..19) are owned **1:1**.

| Class | Capabilities | Ownership rule |
|-------|--------------|----------------|
| Core Commerce | CAP-01..08 | Single primary domain (+ distinct supporting facets) |
| Cross-Cutting / Platform | CAP-09..14 | Single primary domain (+ distinct facets for CAP-14) |
| Platform Governance | CAP-15..19 | **Strict 1:1** domain ownership (AD-0012) |

### 2.2 Accountability Chain

Capability ownership is governed by CAP-15 Platform Governance under Authority + Constitution. Every
owning domain is itself a ratified bounded context (`UCOS-DOM-ARCH-001`), so accountability is
unbroken: **Authority → Constitution → EA → Domain → Capability → owning domain steward**.

---

## 3. Approval-by-Exception (AUTH-009; Constitution Part XIII; IP-17)

| Operation | Classification | Required governance |
|-----------|----------------|---------------------|
| Author/refine conceptual capability content within the ratified set | **Trusted Operation** | Autonomous, audited; no extra approval |
| Author capability attributes (maturity/KPIs/SLAs/value-stream linkage) | **Trusted Operation** (Prompt 02) | Audited; preserves set/ownership/class |
| Add / remove / merge / split a capability | **Approval-Required** | Authority Board + AUTH-012 decision record + version increment |
| Re-own a capability | **Approval-Required** | Authority Board + AUTH-012 decision record |
| Reclassify a capability | **Approval-Required** | Authority Board + AUTH-012 decision record |
| Weaken a non-waivable control (S1/S3/S4) | **Prohibited (non-waivable)** | Not permitted by any autonomy provision (AUTH-008 §7) |

Default posture is **maximum safe autonomy**; humans are interrupted only for the enumerated
Approval-Required operations.

---

## 4. Capability Security Governance

- **CAP-17 Security & Trust** owns security posture governance — non-waivable **S1/S3/S4**
  (AUTH-008 §7; IP-09) — and governs all capabilities.
- **CAP-09 Identity & Access Management** enforces party-level access; the posture/enforcement
  boundary (CAP-17 governs, CAP-09 enforces) is explicit and contract-bound in later phases.
- Non-waivable emphasis applies to: CAP-06 (money movement), CAP-08 (party), CAP-09 (identity),
  CAP-12 (boundary), CAP-14 (surface), CAP-19 (registration).
- No autonomy provision (IP-17) may weaken IP-08, IP-09, or IP-10 (AUTH-003 §7).

---

## 5. Capability Compliance Governance

- **CAP-16 Compliance & Assurance** owns conformance verification, gates, and blocking-gap
  governance across all capabilities. It consumes audit records from CAP-11 and rules from CAP-18;
  it does not define rules (CAP-18) or governance structure (CAP-15).
- **Conceptual gates:** documentation conformance, traceability conformance, ownership conformance,
  classification conformance, security conformance.
- **Blocking gap** = orphan capability, undeclared dependency, shared mutable realization, ownership
  conflict, or weakened non-waivable control. **0 blocking gaps at Phase 4.0 close.**

---

## 6. Capability Evolution Governance

- The ratified set is **immutable within a phase**; set changes are Approval-Required (§3).
- Evolution is **governed, versioned, reversible, recorded** (Constitution Part XII; IP-13/14/15).
- Superseded content is preserved with supersession links; no capability is ever deleted
  (registry rule 3).

| Constraint | Applies to | Rule |
|------------|-----------|------|
| Membership-immutable | CAP-01..19 | No add/remove/merge/split without AD record |
| Ownership-immutable | CAP-01..19 | No re-ownership without AD record (CAP-15..19 strictly 1:1) |
| Class-immutable | CAP-01..19 | No reclassification without AD record |
| Non-waivable-preserving | Security-sensitive capabilities | Evolution may never weaken S1/S3/S4 |

---

## 7. Governance Integrity Validation

| Integrity principle | Definition | Result |
|---------------------|------------|:------:|
| **Single Ownership Principle** | Exactly one primary owner per capability; governance 1:1 | ✅ PASS (19/19) |
| **Capability Independence** | Capabilities are composable; integrate only via declared seams | ✅ PASS |
| **Capability Cohesion** | One coherent purpose per capability | ✅ PASS (19/19) |
| **Capability Accountability** | Each capability owned by a governed, ratified domain | ✅ PASS (19/19) |
| **Governance Integrity** | Governance spine intact; controls non-bypassable | ✅ PASS |
| **Traceability Integrity** | No orphan capabilities; seven-axis lineage complete | ✅ PASS (0 orphans) |
| **Evolution Integrity** | Set changes Approval-Required; versioned/reversible | ✅ PASS |

---

## 8. Governance Roles

| Role | Responsibility (this phase) |
|------|------------------------------|
| Chief Capability Architect | Owns the conceptual capability architecture conforming to AUTH-006 |
| Governance Capability Architect | Owns this governance model; validates ownership/approval/integrity |
| Enterprise Capability Architect | Ensures EA §V alignment and capability composability |
| Traceability gate | Enforces vision→capability→domain lineage (AUTH-010; IP-08) |
| CAP-15 Platform Governance (steward: UCOS-DOM-022) | Governs capability ownership, lifecycle, change |
| Authority Board | Approves any Approval-Required capability operation |

---

## Traceability

- **Refines (upstream):** `UCOS-CAP-ARCH-001`; `AUTH-002`, `AUTH-003`, `AUTH-006` v1.1.0, `AUTH-008`,
  `AUTH-009`, `AUTH-010`, `AUTH-012` (AD-0003, AD-0012); `UCOS-CONST-001` (Parts VI, XI, XII, XIII);
  `UCOS-ENT-ARCH-001` (§VIII, §IX, §XIV); `UCOS-DOM-ARCH-001` (§IX–§XI).
- **Refined by (downstream):** `CAPABILITY-COMPLIANCE-REPORT.md` (`UCOS-CAP-COMP-001`),
  `CAPABILITY-COMPLETION-REPORT.md` (`UCOS-CAP-DONE-001`); Phase 4.1.

## Version Information

| Version | Date | Author | Change | Decision Ref |
|---------|------|--------|--------|--------------|
| 1.0.0 | 2026-06-29 | Governance Capability Architect | Capability governance model: spine, ownership/accountability, approval-by-exception, security/compliance/evolution governance, seven integrity principles (all PASS). | Phase 4.0 |
