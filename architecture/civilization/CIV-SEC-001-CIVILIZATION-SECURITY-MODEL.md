# CIV-SEC-001 — UCOS Civilization Security Model Specification

| Field | Value |
|-------|-------|
| Artifact | **CIV-SEC-001 — Civilization Security Model** |
| Program | PHASE Ω-01 · Civilization Fabric Conceptual Architecture Program |
| Version | 1.0.0 |
| Status | **DESIGN / PROPOSAL — READY FOR RATIFICATION REVIEW** (specification only; no implementation) |
| Basis | `CIV-GOV-001`, `CIV-ARCH-001`; `SIM-SEC-001` (S1/S3/S4; sandbox isolation; signed assertions); `UCOS-SEC-ARCH-001`; AUTH-008; PI-5 `assertions.ts` (Ed25519) |
| Non-waivable | **S1** (authn/authz), **S3** (secrets by-reference), **S4** (data protection) — preserved & enforced |
| Prohibited-dir impact | **NONE** — reuses federation cryptography; no custom crypto; no core-dir change |
| Owner | UCOS Authority Board (Architecture) |

> **Governing disclaimer:** design/proposal only. Preserves AD-0014; enrolls no INV-14..20; releases no Article
> IX lock; authorizes no implementation/construction. **The Civilization Fabric remains conceptual and deferred
> under AD-0014.**

---

## 1. Security posture

The Civilization Fabric adds **no new trust primitive**. It reuses the ratified PI-5 cryptography and the PI-4
Control Plane, and inherits the Simulation Fabric's sandbox-isolation and non-actuation guarantees. Its
distinctive security surface is **population privacy** and **historical/model integrity** — addressed below.

| Surface | Risk | Control |
|---------|------|---------|
| Civilization model authoring | Forged/unauthorized model object | **Signed assertions** (Ed25519 via `assertions.ts`); known/authorized issuer + enumerated power; deny + audit on failure |
| Population modeling (CIV-C3) | PII / re-identification / real-person modeling | **Aggregate-only**: statistical cohorts/distributions; PII rejected at ingress; re-identification denied (§4) |
| Knowledge/Memory reference | Cross-class classification leakage | Read-only governed queries; S4 classification inheritance; CIV-C8 memory **inert** until PI-9 |
| Rights/Obligations model | Mistaken as enforceable grant | Modeled as Constraint-Set entries only; **never** actuated; explicit non-enforceability label |
| Governance/economy model | Mistaken as real authority/value | Simulation variables only; no real authority/value transfer; non-actuation guard |
| Preservation/continuity | Snapshot forgery / historical revision | Signed, hash-anchored, append-only; revision is a forward audited act (CGP-6) |
| Simulation run | Sandbox escape / actuation | Simulation sandbox keyspace guard (SIM-SEC-ISO-1); deny-by-default; Evolution-only commit |
| Federated civilization model | Foreign poisoning/override | Advisory/deny-only; clamped trust; local-shadows-foreign (CIV-FED-001) |
| Promotion | Unauthorized commit | Deny-by-default; policy PASS + hard-constraint PASS + cert(SoD) + ratify; Evolution-only |

---

## 2. Signed civilization assertions (CIV-SEC-AS)

- Civilization model definitions, preservation snapshots, rights/obligations model bindings, and federated
  contributions are carried as **signed assertions** using PI-5 `assertions.ts` (Ed25519 via `node:crypto`).
- Each binds `{ issuer(nodeId+keyRef), subjectRef, kind, payloadHash, nonce, issuedAt, expiresAt }` and is
  verified for: valid signature, authorized issuer with the enumerated power, within a trust boundary, fresh
  (nonce unseen + within skew), and unexpired. Any failure ⇒ deny + audit.
- **Keys by reference only (S3):** records carry `keyRef`; never key material or model weights.

## 3. Non-actuation enforcement (S1 / CGP-1 / SGP-9)

- Every civilization "run" is a Simulation run bound to exactly one Sandbox Scope; all writes pass the static
  `simulation:sandbox:<runId>:*` keyspace guard — a write to any governed namespace is **rejected and audited**.
- The Civilization Fabric has **no** commit power. Promotion of a modeled insight to governed change routes
  through the PI-4 PEP (authenticate → trust → deny-by-default policy) and the PI-6 Evolution gate only.
- Rights (CIV-C11), Obligations (CIV-C12), Governance (CIV-C9), and Economy (CIV-C10) are **descriptive model
  objects**; they confer no real grant, authority, or value and cannot be actuated.

## 4. Population privacy & data protection (S4)

- **CIV-C3 populations are aggregate/statistical only.** Modeling of, or storage of, real-person PII is
  **prohibited and rejected at ingress**; no field may carry identifying data.
- **No re-identification.** Derivation intended to single out real individuals from cohort models is denied and
  audited (threat C13).
- **Classification inheritance:** projection/impact outputs inherit the maximum classification of their inputs;
  cross-class emit (higher-class input → lower-class output) is denied; redaction to a lower class is itself a
  governed, audited transformation.
- **Foreign inputs re-classified** under local policy before any local use.

## 5. Non-waivable control conformance

| Control | Requirement | Conformance |
|---------|-------------|:-----------:|
| **S1** | Authn + deny-by-default authz on every governed effect | **PASS** (PEP; sandbox guard; no commit power) |
| **S3** | Secrets/keys/model-weights by reference; none embedded | **PASS** (keyRef/ref only) |
| **S4** | Sensitive-data protection; aggregate-only populations; classification inheritance | **PASS** (§4) |
| **S6** | Immutable, tamper-evident audit | **PASS** (CIV-AUD-001) |

## 6. Traceability
- **Refines:** `CIV-GOV-001`, `CIV-ARCH-001`, `SIM-SEC-001`, `UCOS-SEC-ARCH-001`, AUTH-008 (S1/S3/S4), FED-SEC-001.
- **Consumed by:** `CIV-FED-001`, `CIV-AUD-001`, `CIV-THREAT-001`, `CIV-READINESS-001`.
- **Owner:** UCOS Authority Board.

**END CIV-SEC-001 — DESIGN/PROPOSAL · S1/S3/S4 PRESERVED · POPULATION PRIVACY · NON-ACTUATING · AD-0014 PRESERVED · NO IMPLEMENTATION AUTHORIZED.**
