# IP-0003 — Trade Secret Registry Specification

**Program:** IP-0000 — Intellectual Property Governance Framework · Deliverable **IP-0003**
**Artifact ID:** `IP-0003`
**Artifact family:** `IP-*`
**Location:** `architecture/ip/`
**Mode:** DESIGN ONLY — NO IMPLEMENTATION · NO CODE · NO REPOSITORY MUTATION (of ratified artifacts) · NO LEGAL ADVICE
**Status:** CREATED — DESIGN — READY FOR INNOVATION REVIEW BOARD REVIEW
**Parent:** `IP-0000` (§6 Trade Secret Governance · §12 Confidentiality Governance · §15 Trade Secret Registry Architecture · §17 IP Audit · §19 Risk)
**Consumes:** `IP-0001` (Invention Taxonomy) · `IP-0004` (Patentability/Secrecy Assessment)
**Reuses:** `AUDIT-UNIV-001` (hash-chained audit) · PI-4 Control Plane (deny-by-default, S1) · S3 (key/secret **by reference**) · S4 (classification/data protection) · S6 (audit) · PI-6 Evolution (sole commit path, AD-0019) · PI-2/3 Substrate
**Date:** 2026-07-02

> **Governing disclaimer.** Design/specification only. Writes no code, releases no lock, enrolls no invariant,
> mutates no ratified artifact, constitutes no legal advice. "Reasonable measures", misappropriation, and
> secrecy-qualification are **legal determinations** made by qualified IP counsel (IP-0000 §6, §13); this
> registry provides the **evidentiary and control substrate** for them. `UCOS-CONSTRUCTION-BLOCKED` and the
> Article IX generation lock are unchanged.

---

## 1. Purpose & scope

The **Trade Secret Registry (TSR)** is the authoritative, append-only, access-audited store that **identifies**
UCOS trade secrets and records the **reasonable measures** taken to protect them: custodianship, need-to-know
access grants/revocations, marking, protection-measure attestations, confidentiality-agreement linkage, and
lifecycle/compromise events. It realizes IP-0000 §15 and is the secrecy-side counterpart to the Patent Candidate
Registry (IP-0002).

The TSR's defining constraint is **TSR-1: no plaintext hoarding** — the registry records *existence, metadata,
custody, and controls*, **not** the secret payload in the clear. Secret material lives in the ratified
secrets/vault substrate and is referenced (S3), never embedded. The registry proves *that* a secret exists, *who*
may access it, and *that* protection measures are in force — which is precisely the evidence "reasonable
measures" requires — without itself becoming the leak.

Scope: principles (§2), keyspace (§3), the trade-secret record (§4), the `IP_SECRET_*` event model (§5), the
access & vaulting model (§6), lifecycle & compromise handling (§7), storage schema (§8), API surface (§9),
guarantees (§10), governance (§11). Out of scope: patentability scoring (IP-0004) and patent storage (IP-0002).

---

## 2. Design principles

| # | Principle | Realization |
|:-:|-----------|-------------|
| TSR-1 | **No plaintext hoarding.** | Registry stores metadata + `secretRef` (into the vault substrate; S3); the plaintext is never in the registry, events, or projections. |
| TSR-2 | **Access-audited (reasonable-measures evidence).** | Every access/grant/revocation is an immutable `IP_SECRET_ACCESS_*` event (S6); the log is the evidence of protection. |
| TSR-3 | **Deny-by-default access.** | Need-to-know enforced by the Control Plane (S1); no implicit-allow path; unclassified ⇒ treated as `TRADE_SECRET` (protect-by-default). |
| TSR-4 | **Registry-driven / no hard coding.** | Secret categories, protection-measure classes, custodian roles are `ip:*` metadata records. |
| TSR-5 | **Event-sourced / append-only.** | Secret state is a fold over `IP_SECRET_*` events; existence/first-recorded date immutable. |
| TSR-6 | **Egress-controlled.** | Export/publish denied by default; overrides counsel-gated + audited (IP-0000 §10, §12). |
| TSR-7 | **Evolution-only commit.** | Governed mutations committed via PI-6 Evolution (AD-0019). |
| TSR-8 | **Federation-aware.** | Cross-node (PI-5) never leaks secret material; export denied unless posture + federation policy both permit. |
| TSR-9 | **Provider-agnostic.** | Defined over PI-2/3 + the secrets substrate; no vendor selected. |

---

## 3. Keyspace & registry record kinds

Reserved `ip:*` namespace (shared with IP-0002), version-pinned, deny-by-default resolution.

| Key pattern | Record kind | Purpose |
|-------------|-------------|---------|
| `ip:secret-category:<id>` | **SecretCategoryDef** | Class of secret (algorithm, process/know-how, dataset, parameter-set, key-recipe…) with default controls. |
| `ip:protection-measure:<id>` | **ProtectionMeasureDef** | A required control (access-control, marking, NDA, egress-block, vault-isolation, periodic-revalidation). |
| `ip:custodian-role:<id>` | **CustodianRoleDef** | Roles (owner, custodian, approver, auditor) and their duties/SoD. |
| `ip:secret-lifecycle-state:<id>` | **SecretStateDef** | Lifecycle states + admissible transitions (§7). |
| `ip:secret-review-policy:<id>` | **SecretReviewPolicyDef** | Periodic re-validation cadence + review quorum. |

Publishing/retiring any record is Evolution-committed (TSR-7).

---

## 4. Trade-secret record (design specification)

```ts
// SPECIFICATION — not committed code. Metadata + reference ONLY; NO plaintext (TSR-1).

export type SecretState =
  | "IDENTIFIED" | "PROTECTED" | "ACTIVE" | "UNDER_REVIEW"
  | "COMPROMISED" | "RETIRED" | "CONVERTED_TO_PATENT";

export interface AccessGrant {
  grantId: string;
  principalId: string;                // grantee
  need: string;                       // recorded need-to-know justification (mandatory)
  scope: "READ" | "USE" | "CUSTODY";
  grantedBy: string;                  // approver (SoD from grantee)
  grantedAt: number;
  expiresAt?: number;                 // time-boxed by default where policy requires
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
}

export interface ProtectionAttestation {
  measureRef: string;                 // ip:protection-measure:*@version
  attestedBy: string;                 // custodian/security officer
  attestedAt: number;
  evidenceRef?: string;               // link to control evidence (e.g. access-policy id, NDA record)
  signature?: SignatureBlock;         // optional Ed25519 attestation (reuse; no custom crypto)
}

export interface TradeSecret {
  secretId: string;                   // fabric-assigned ULID-like
  title: string;                      // non-revealing label (must not disclose the secret)
  categoryRef: string;                // ip:secret-category:*@version
  inventionTypes: string[];           // ip:invention-type:* (IP-0001) — non-revealing tags
  secretRef: string;                  // REFERENCE into the vault substrate (S3); NOT the payload
  descriptorDigest: string;           // sha256 of a sealed descriptor (integrity, not disclosure)
  state: SecretState;                 // PROJECTION folded from events
  custodians: Array<{ principalId: string; roleRef: string }>; // ip:custodian-role:*
  accessGrants: AccessGrant[];        // current + historical (append-only)
  protections: ProtectionAttestation[]; // reasonable-measures evidence (TSR-2)
  ndaRefs: string[];                  // confidentiality-agreement records (IP-0000 §12.3)
  confidentiality: "TRADE_SECRET";    // fixed; downgrade = declassification event (§7)
  detectability: "LOW" | "MEDIUM" | "HIGH"; // from assessment; low favors secret (IP-0000 §6.2)
  value?: "HIGH" | "MEDIUM" | "LOW";  // strategic value
  moatRef?: string;                   // competitive moat (IP-0005)
  reviewPolicyRef: string;            // ip:secret-review-policy:* (periodic re-validation)
  lastReviewedAt?: number;
  firstRecordedAt: number;            // immutable (existence/priority evidence)
  digest: string;                     // sha256(canonicalize(record\digest \ secret payload))
  version: number;
}
```

**Record rules.**
- **SR-1.** The record **never** contains the secret payload; only `secretRef` (vault) + `descriptorDigest`
  (integrity) (TSR-1).
- **SR-2.** `title` and tags must be **non-revealing** (they appear in less-restricted indexes).
- **SR-3.** `firstRecordedAt` and identity are **immutable** (existence evidence for misappropriation defense).
- **SR-4.** `confidentiality` is fixed `TRADE_SECRET`; any downgrade is a governed **declassification** decision
  passing the disclosure gate (IP-0000 §10) — deny-by-default.
- **SR-5.** Every access grant records a **need-to-know justification** (mandatory) and is SoD-separated
  (approver ≠ grantee).

---

## 5. Event model — `IP_SECRET_*`

Event-sourced; append-only; hash-chained; anchored in `AUDIT-UNIV-001` (`domain:"ip"`,
`streamId = secret:<secretId>`). Access events are the reasonable-measures evidence backbone.

| Event type | Purpose | Producer | Payload (non-revealing) | Key rule |
|------------|---------|----------|-------------------------|----------|
| `IP_SECRET_IDENTIFIED` | Register a secret's existence. | IRB via Evolution | `{ categoryRef, title, secretRef, descriptorDigest }` | No plaintext (TSR-1). |
| `IP_SECRET_PROTECTED` | Record protection measures in force. | Custodian/Security | `{ protections[] }` | Required measures per category (deny-by-default). |
| `IP_SECRET_ACCESS_GRANTED` | Grant need-to-know access. | Approver | `{ grantId, principalId, need, scope, expiresAt? }` | SoD approver ≠ grantee (SR-5). |
| `IP_SECRET_ACCESS_REVOKED` | Revoke access. | Approver | `{ grantId, reason }` | Immediate deny thereafter. |
| `IP_SECRET_ACCESSED` | Record an actual access. | Control Plane | `{ principalId, scope, at }` | Reasonable-measures evidence (TSR-2). |
| `IP_SECRET_MARKED` | Record marking/label applied. | Custodian | `{ marking }` | — |
| `IP_SECRET_NDA_LINKED` | Link a confidentiality agreement. | Governance | `{ ndaRef, parties }` | — |
| `IP_SECRET_REVIEW_DUE` | Periodic re-validation due. | System | `{ reviewPolicyRef, dueAt }` | Auto per cadence. |
| `IP_SECRET_REVIEWED` | Re-validation completed. | IRB | `{ stillSecret, stillValuable, measuresIntact, rationale }` | Rationale mandatory. |
| `IP_SECRET_COMPROMISE_SUSPECTED` | Suspected leak/exposure. | Any/Detection | `{ indicators, severity }` | Triggers §7 handling + escalation (R-3). |
| `IP_SECRET_COMPROMISE_CONFIRMED` | Confirmed compromise. | IRB/Security | `{ scope, rationale, response }` | May force state `COMPROMISED`. |
| `IP_SECRET_RETIRED` | Secret no longer maintained. | IRB | `{ rationale }` | Never silent. |
| `IP_SECRET_CONVERTED_TO_PATENT` | Route to patent-track. | IRB | `{ candidateRef, rationale }` | Only before barring disclosure. |
| `IP_SECRET_DECLASSIFIED` | Downgrade confidentiality. | IRB/Counsel | `{ toConfidentiality, rationale }` | Passes disclosure gate (SR-4). |

**Event rules.**
- **EV-1.** Immutable, hash-chained; **no event payload contains plaintext** (TSR-1).
- **EV-2.** Transition validity checked against `ip:secret-lifecycle-state:*` (deny-by-default).
- **EV-3.** Envelope carries `correlationId`/`causationId`, version-pinned `policyRefs`, provenance, actor.
- **EV-4.** Governed transitions Evolution-committed (TSR-7).
- **EV-5.** Replay **recomputes** current access set + measures-in-force; recorded flags are re-derived, never
  trusted.

---

## 6. Access & vaulting model

### 6.1 Vaulting (S3)

- **VA-1.** Secret payloads reside in the ratified secrets/vault substrate; the TSR holds only `secretRef` +
  `descriptorDigest` (TSR-1, S3).
- **VA-2.** Retrieval of a payload is a **separate, deny-by-default, audited** operation against the vault,
  authorized by an `ACTIVE` `AccessGrant`; the TSR records the access event, not the bytes.
- **VA-3.** `descriptorDigest` lets the framework verify a referenced secret's integrity **without** reading it.

### 6.2 Access control (S1/S4)

- **AC-1.** Need-to-know, least-privilege; every grant carries a justification and (by default) an expiry.
- **AC-2.** Every access is authorized by the Control Plane (deny-by-default) and produces `IP_SECRET_ACCESSED`
  (S6) — the reasonable-measures evidence.
- **AC-3.** Revocation is immediate and audited; expired grants auto-deny.
- **AC-4.** SoD: the approver of a grant is distinct from the grantee (SR-5).

### 6.3 Egress control (TSR-6)

- **EG-1.** Copy/export/publish of secret material is **denied by default**; any override is counsel-gated and
  audited, and passes the disclosure gate (IP-0000 §10).
- **EG-2.** Federation export (PI-5) of secret material is denied unless posture **and** federation policy both
  permit (TSR-8) — default deny.

---

## 7. Lifecycle & compromise handling

```
 IDENTIFIED ─▶ PROTECTED ─▶ ACTIVE ─▶ UNDER_REVIEW ─▶ ACTIVE (re-validated)
      │            │           │            │
      │            │           │            └─▶ RETIRED (no longer valuable, rationale)
      │            │           ├─▶ COMPROMISED (confirmed leak) ─▶ response + RETIRED/patent-bar assessment
      │            │           └─▶ CONVERTED_TO_PATENT (pre-disclosure, rationale)
      │            └─▶ (measures incomplete ⇒ cannot reach ACTIVE — deny-by-default)
      └─▶ DECLASSIFIED (governed downgrade, disclosure gate)
```

- **LC-1.** A secret cannot reach `ACTIVE` until required protection measures for its category are attested
  (`IP_SECRET_PROTECTED`) — deny-by-default.
- **LC-2.** **Periodic re-validation** (`ip:secret-review-policy:*`) confirms the secret is *still secret, still
  valuable, still protected*; failure routes to `UNDER_REVIEW`/`RETIRED` with rationale.
- **LC-3.** **Compromise handling**: `SUSPECTED` → investigate → `CONFIRMED` triggers response, custodian
  notification, and a **patentability-bar assessment** (a public leak may bar later patenting; coordinate with
  IP-0002) — all audited (IP-0000 §19 R-3).
- **LC-4.** Conversion to patent is allowed only **before** any barring disclosure and with recorded rationale
  (mirror of IP-0002 `CONVERT_TO_SECRET`).
- **LC-5.** No transition is silent; every one carries rationale and an audit event.

---

## 8. Storage schema (provider-agnostic; reference rendering only)

```sql
-- SPECIFICATION — reference rendering only; NOT committed DDL, NOT an engine selection.
-- CRITICAL: NO column ever stores secret plaintext (TSR-1). Only references + digests + metadata.

-- Append-only secret event log (source of truth) — payloads are non-revealing metadata only
CREATE TABLE ip_secret_event (
  stream_id      TEXT   NOT NULL,          -- secret:<secretId>
  seq            BIGINT NOT NULL,
  event_id       TEXT   NOT NULL UNIQUE,
  type           TEXT   NOT NULL,          -- IP_SECRET_*
  secret_id      TEXT   NOT NULL,
  occurred_at    BIGINT NOT NULL,
  actor          TEXT   NOT NULL,
  correlation_id TEXT   NOT NULL,
  causation_id   TEXT,
  payload        JSONB  NOT NULL,          -- NON-REVEALING metadata only (never plaintext)
  policy_refs    JSONB  NOT NULL,          -- version-pinned ip:*@version[]
  provenance     JSONB  NOT NULL,
  prev_hash      TEXT   NOT NULL,
  event_hash     TEXT   NOT NULL,
  PRIMARY KEY (stream_id, seq)
  -- APPEND-ONLY: no UPDATE, no DELETE
);

-- Access-audit index (derived; the reasonable-measures evidence view)
CREATE TABLE ip_secret_access_log (
  access_id    TEXT   NOT NULL PRIMARY KEY,
  secret_id    TEXT   NOT NULL,
  principal_id TEXT   NOT NULL,
  scope        TEXT   NOT NULL,            -- READ|USE|CUSTODY
  granted_by   TEXT,
  at           BIGINT NOT NULL,
  result       TEXT   NOT NULL            -- ALLOWED|DENIED (deny is also evidence)
);

-- Secret metadata projection (derived; NO plaintext) — reference to vault only
CREATE TABLE ip_secret_projection (
  secret_id           TEXT   NOT NULL PRIMARY KEY,
  projection          JSONB  NOT NULL,     -- metadata + secretRef + descriptorDigest (no payload)
  state               TEXT   NOT NULL,
  version             BIGINT NOT NULL,
  projected_from_head TEXT   NOT NULL
);

-- Versioned registry (immutable-per-version)
CREATE TABLE ip_secret_registry (
  kind         TEXT  NOT NULL,  -- secret-category|protection-measure|custodian-role|secret-lifecycle-state|secret-review-policy
  id           TEXT  NOT NULL,
  version      TEXT  NOT NULL,
  status       TEXT  NOT NULL,
  record       JSONB NOT NULL,
  digest       TEXT  NOT NULL,
  published_by TEXT  NOT NULL,
  published_at BIGINT NOT NULL,
  PRIMARY KEY (kind, id, version)
);
```

**Storage guarantees.**
- **SS-A.** **No plaintext** in any table/event/projection (TSR-1) — enforced by schema discipline + review.
- **SS-B.** Append-only, hash-chained, content-addressed (tamper-evident).
- **SS-C.** Access log is preservation-complete: grants, revocations, allowed **and** denied accesses persist.
- **SS-D.** Durable ⟺ appended **and** audited (S6).
- **SS-E.** Provider-agnostic; vault + engine selection deferred to ratified ADRs (not made here).

---

## 9. API surface (contract-first; design)

```ts
// SPECIFICATION — deny-by-default, audited, Evolution-committed mutations. NO API ever returns plaintext;
// payload retrieval is a separate, vault-authorized, audited path (VA-2).
export interface TradeSecretRegistry {
  identify(cmd: IdentifySecretCmd, ctx: IpContext): Promise<TradeSecret>;         // records existence + secretRef
  recordProtection(cmd: ProtectionCmd, ctx: IpContext): Promise<void>;            // measures attestation
  grantAccess(cmd: GrantAccessCmd, ctx: IpContext): Promise<AccessGrant>;         // SoD + need-to-know
  revokeAccess(cmd: RevokeAccessCmd, ctx: IpContext): Promise<void>;
  recordReview(cmd: ReviewCmd, ctx: IpContext): Promise<void>;                    // periodic re-validation
  reportCompromise(cmd: CompromiseCmd, ctx: IpContext): Promise<void>;            // suspected/confirmed
  retire(cmd: RetireCmd, ctx: IpContext): Promise<void>;                          // rationale mandatory
  convertToPatent(cmd: ConvertCmd, ctx: IpContext): Promise<void>;               // pre-disclosure only
  declassify(cmd: DeclassifyCmd, ctx: IpContext): Promise<void>;                 // disclosure-gated

  // Queries — metadata only; confidentiality-filtered; NEVER returns the payload
  getMetadata(secretId: string, ctx: IpContext): Promise<TradeSecret>;            // no payload
  listAccess(secretId: string, ctx: IpContext): Promise<AccessGrant[]>;
  reviewsDue(within: number, ctx: IpContext): Promise<string[]>;
  measuresGap(ctx: IpContext): Promise<Array<{ secretId: string; missing: string[] }>>;
}
```

- **API-1.** No method returns secret plaintext (TSR-1); payload access is via the vault, separately authorized
  and audited (VA-2).
- **API-2.** Every command deny-by-default authorized (S1), audited (S6), Evolution-committed (TSR-7).
- **API-3.** Queries are confidentiality-filtered and return **non-revealing** metadata only.
- **API-4.** `measuresGap` and `reviewsDue` drive risk management (IP-0000 §19 R-3) and metrics (§20 M-9).

---

## 10. Integrity, audit & recovery guarantees

- **IG-1.** **Confidentiality-by-construction** — the registry cannot leak what it never stores (TSR-1).
- **IG-2.** **Reasonable-measures provability** — the immutable access + protection log is the evidence that
  measures were in force (IP-0000 §6.3, §17 AU-4).
- **IG-3.** **Existence & date immutable** — first-recorded date and identity are tamper-evident (SR-3).
- **IG-4.** **Tamper-evident** — hash-chained events anchored in `AUDIT-UNIV-001` (`domain:"ip"`).
- **IG-5.** **Recompute-don't-trust** at replay — current access set and measures are re-derived (EV-5).
- **IG-6.** **Full rebuild** from the event log; projections are disposable caches.
- **IG-7.** **Audit completeness** — allowed *and* denied accesses, grants, revocations, reviews, and compromises
  all persist (SS-C; §20 M-9).

---

## 11. Governance

- **GV-1.** The TSR is owned by the Innovation Review Board (IP-0000 §13); custodianship and access approval are
  SoD-separated; declassification and conversion are counsel-gated.
- **GV-2.** All `ip:*` registry publications and secret mutations are **Evolution-committed** (AD-0019).
- **GV-3.** Confidentiality is fixed `TRADE_SECRET`; declassification passes the disclosure gate (deny-by-default,
  IP-0000 §10, §12).
- **GV-4.** Compromise handling auto-escalates to the Board/Security (R-3) and triggers a patent-bar assessment.
- **GV-5.** Federation export of secret material is default-deny (TSR-8; IP-0000 §12.2, §19 R-8).

---

*This document is design/specification only. It writes no code, releases no lock, enrolls no invariant, confers
no legal authority, and constitutes no legal advice. `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation
lock are unchanged.*
