# IP-0002 — Patent Candidate Registry Specification

**Program:** IP-0000 — Intellectual Property Governance Framework · Deliverable **IP-0002**
**Artifact ID:** `IP-0002`
**Artifact family:** `IP-*`
**Location:** `architecture/ip/`
**Mode:** DESIGN ONLY — NO IMPLEMENTATION · NO CODE · NO REPOSITORY MUTATION (of ratified artifacts) · NO LEGAL ADVICE
**Status:** CREATED — DESIGN — READY FOR INNOVATION REVIEW BOARD REVIEW
**Parent:** `IP-0000` (§3 Invention Lifecycle · §4 Patent Candidate Lifecycle · §5 Patent Family Architecture · §14 Patent Candidate Registry Architecture · §17 IP Audit)
**Consumes:** `IP-0001` (Invention Taxonomy) · `IP-0004` (Patentability Assessment) · Prior Art Registry (IP-0000 §16)
**Reuses:** `AUDIT-UNIV-001` (hash-chained audit) · PI-4 Control Plane (deny-by-default) · PI-6 Evolution (sole durable-commit path, AD-0019) · PI-2/3 Substrate (Registry/Metadata/Configuration ports)
**Date:** 2026-07-02

> **Governing disclaimer.** Design/specification only. Writes no code, releases no lock, enrolls no invariant,
> mutates no ratified artifact, constitutes no legal advice. All TypeScript/SQL fragments are **design
> specification**, not committed source. Filing, prosecution, abandonment, and deadline interpretation are
> **counsel-led** (IP-0000 §4, §13). `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation lock are
> unchanged.

---

## 1. Purpose & scope

The **Patent Candidate Registry (PCR)** is the authoritative, append-only, event-sourced store of every UCOS
patent candidate — from Board routing (`CANDIDATE`) through filing, prosecution, grant, and maintenance (or
abandonment/lapse/conversion). It realizes IP-0000 §14 and is the patent-side counterpart to the Trade Secret
Registry (IP-0003).

This document specifies: registry design principles (§2), the `ip:*` keyspace and record kinds (§3), the patent
candidate record (§4), the `IP_CANDIDATE_*` event model (§5), the deadline/clock model (§6), patent-family
records (§7), storage schema (§8), the API surface (§9), integrity/audit guarantees (§10), and governance (§11).

Out of scope: patentability *scoring* (IP-0004), trade-secret storage (IP-0003), and any legal determination.

---

## 2. Design principles

| # | Principle | Realization |
|:-:|-----------|-------------|
| PCR-1 | **Registry-driven / no hard coding.** | Candidate types, lifecycle states, deadline classes, jurisdictions, and filing kinds are `ip:*` metadata records; no literals in code. Empty registry ⇒ no candidates accepted (fail-closed). |
| PCR-2 | **Event-sourced / append-only.** | Candidate state is a fold over `IP_CANDIDATE_*` events; inventorship and priority evidence are immutable. |
| PCR-3 | **Immutable audit.** | Every transition emits a hash-chained event to `AUDIT-UNIV-001` (`domain:"ip"`). |
| PCR-4 | **Cryptographically verifiable.** | Records are content-addressed (`sha256(canonicalize(...))`); inventorship/priority attestations may carry Ed25519 signatures (reuse; no custom crypto). |
| PCR-5 | **Deadline-bearing.** | Clocks are first-class records with escalation (IP-0000 §19 R-2). |
| PCR-6 | **Deny-by-default.** | No advance to `FILED`/`GRANTED` without required evidence + counsel approval; unresolved reference ⇒ deny. |
| PCR-7 | **Evolution-only commit.** | Every governed mutation is committed via PI-6 Evolution (AD-0019); the registry has no self-write path to platform state. |
| PCR-8 | **Provider-agnostic.** | Defined over PI-2/3 ports; no datastore/vendor selected (reference SQL only). |
| PCR-9 | **Confidentiality-aware.** | Candidates default `CONFIDENTIAL` (S4); disclosure gated (IP-0000 §10). |

---

## 3. Keyspace & registry record kinds

All configuration lives under the reserved `ip:*` namespace, resolved through the Metadata port, version-pinned
on reference (mirrors the Proof Fabric registry discipline).

| Key pattern | Record kind | Purpose |
|-------------|-------------|---------|
| `ip:candidate-state:<id>` | **CandidateStateDef** | Declares a lifecycle state and its admissible transitions (IP-0000 §4.1). |
| `ip:deadline-class:<id>` | **DeadlineClassDef** | Declares a clock type (provisional-12mo, PCT-national, maintenance…) with computation + escalation rules. |
| `ip:jurisdiction:<id>` | **JurisdictionDef** | A jurisdiction/patent office and its filing kinds + grace-period metadata. |
| `ip:filing-kind:<id>` | **FilingKindDef** | provisional · non-provisional · PCT · continuation · divisional · CIP · national-phase. |
| `ip:family-role:<id>` | **FamilyRoleDef** | anchor · continuation · divisional · CIP · foreign-counterpart · related. |
| `ip:candidate-evidence-req:<id>` | **EvidenceRequirementDef** | Required evidence gates per state (e.g. prior-art-cleared before FILED). |

**Resolution is deny-by-default and version-pinned** (an unresolved/retired/draft reference ⇒ deny; verification-
relevant resolution requires an explicit version). Publishing/retiring any `ip:*` record is Evolution-committed
(PCR-7).

---

## 4. Patent candidate record (design specification)

```ts
// SPECIFICATION — not committed code. Proposed record shape (folded from IP_CANDIDATE_* events).

export type CandidateState =
  | "CANDIDATE" | "PRIOR_ART_CLEARED" | "DRAFTING" | "READY_TO_FILE"
  | "FILED_PROVISIONAL" | "FILED_NONPROVISIONAL" | "FILED_PCT"
  | "PROSECUTION" | "GRANTED" | "MAINTAINED"
  | "ABANDONED" | "LAPSED" | "CONVERTED_TO_SECRET";

export interface Inventor {
  principalId: string;                // UCOS principal
  contribution: string;               // recorded contribution basis (inventorship integrity)
  attribution?: SignatureBlock;       // optional Ed25519 attestation (reuse; no custom crypto)
}

export interface Filing {
  filingId: string;
  filingKindRef: string;              // ip:filing-kind:*@version
  jurisdictionRef: string;            // ip:jurisdiction:*@version
  applicationNumber?: string;         // assigned by the office (recorded when known)
  filingDate?: number;                // recorded logical date
  priorityDate?: number;              // immutable once set (PCR-2)
  counselApprovalRef: string;         // reference to counsel sign-off record (IP-0000 §13 RB-3)
  status: "PENDING" | "ACTIVE" | "GRANTED" | "ABANDONED" | "LAPSED";
}

export interface DeadlineRecord {
  deadlineId: string;
  deadlineClassRef: string;           // ip:deadline-class:*@version
  dueAt: number;                      // computed per class rules (§6)
  basisEventId: string;               // the event that started the clock (causation)
  status: "OPEN" | "MET" | "MISSED" | "WAIVED";
  escalationTier: "NONE" | "NOTICE" | "WARNING" | "CRITICAL";
}

export interface PatentCandidate {
  candidateId: string;                // fabric-assigned ULID-like
  idrRef: string;                     // link to Invention Disclosure Record (IP-0000 §3.4)
  title: string;
  inventionTypes: string[];           // ip:invention-type:* (IP-0001)
  state: CandidateState;              // PROJECTION folded from events (never authoritatively stored)
  inventors: Inventor[];              // immutable set once filed (PCR-2; IP-0000 §19 R-4)
  conceptionDate: number;             // immutable (priority integrity)
  reductionToPracticeDate?: number;
  priorArtClearanceRef?: string;      // link to prior-art clearance (IP-0000 §7)
  assessmentRef?: string;             // link to patentability assessment (IP-0004)
  filings: Filing[];
  deadlines: DeadlineRecord[];
  familyId?: string;                  // patent family membership (§7)
  familyRoleRef?: string;             // ip:family-role:*
  claimMap?: Array<{ claimId: string; capabilityRef: string }>; // claim → UCOS capability traceability
  confidentiality: "CONFIDENTIAL" | "INTERNAL" | "PUBLIC"; // default CONFIDENTIAL (PCR-9)
  moatRef?: string;                   // competitive moat (IP-0005)
  rationaleLog: string[];             // append-only decision rationales (RB-2)
  digest: string;                     // sha256(canonicalize(record\digest)) — tamper-evident
  version: number;                    // monotonic event count (optimistic concurrency)
  createdAt: number;
}
```

**Record rules.**
- **CD-1.** `state` is a **projection** folded from `IP_CANDIDATE_*` events; it is never an authoritative mutable
  field (PCR-2).
- **CD-2.** `inventors`, `conceptionDate`, and any set `priorityDate` are **immutable** once recorded (priority
  and inventorship integrity — IP-0000 §19 R-4).
- **CD-3.** Advance to any `FILED_*` requires `state == PRIOR_ART_CLEARED`, an `assessmentRef`, and a
  `counselApprovalRef` (deny-by-default; IP-0000 §4.2 PC-1).
- **CD-4.** Every state change appends a `rationaleLog` entry (non-empty) (RB-2).
- **CD-5.** `confidentiality` defaults `CONFIDENTIAL`; downgrade (e.g. after publication) is a governed, audited
  decision passing the disclosure gate (IP-0000 §10).

---

## 5. Event model — `IP_CANDIDATE_*`

The registry is event-sourced; the candidate is a fold over an append-only, hash-chained stream
(`streamId = candidate:<candidateId>`; anchored in `AUDIT-UNIV-001` `domain:"ip"`).

| Event type | Purpose | Producer | Payload (summary) | Key rule |
|------------|---------|----------|-------------------|----------|
| `IP_CANDIDATE_OPENED` | Route an invention to patent-track. | IRB via Evolution | `{ idrRef, inventionTypes, inventors, conceptionDate }` | Requires resolved IDR (deny-by-default). |
| `IP_CANDIDATE_PRIOR_ART_CLEARED` | Record prior-art clearance. | IRB/Counsel | `{ priorArtClearanceRef, assessmentRef }` | Precondition to filing (PC-1). |
| `IP_CANDIDATE_DRAFTING_STARTED` | Enter drafting. | Counsel | `{ draftRef }` | — |
| `IP_CANDIDATE_READY_TO_FILE` | Counsel approves filing. | Counsel | `{ counselApprovalRef, filingKindRef, jurisdictionRef }` | Counsel-gated (RB-3). |
| `IP_CANDIDATE_FILED` | Record a filing + priority date. | Counsel | `{ filing }` | `priorityDate` immutable once set (CD-2). |
| `IP_CANDIDATE_OFFICE_ACTION` | Record a prosecution event. | Counsel | `{ actionRef, responseDueAt }` | May open a `DeadlineRecord`. |
| `IP_CANDIDATE_GRANTED` | Record grant. | Counsel | `{ patentNumber, grantDate }` | — |
| `IP_CANDIDATE_MAINTAINED` | Record maintenance payment. | Portfolio/Counsel | `{ maintenanceRef, nextDueAt }` | Opens next maintenance deadline. |
| `IP_CANDIDATE_DEADLINE_OPENED` | Start a clock. | System | `{ deadline }` | Basis event linked (causation). |
| `IP_CANDIDATE_DEADLINE_ESCALATED` | Escalate an approaching/overdue clock. | System | `{ deadlineId, escalationTier }` | Auto-escalation (IP-0000 §19 R-2). |
| `IP_CANDIDATE_DEADLINE_RESOLVED` | Close a clock (met/waived). | Counsel/System | `{ deadlineId, status }` | — |
| `IP_CANDIDATE_ABANDONED` | Terminal: drop with rationale. | IRB/Counsel | `{ rationale }` | Counsel-acknowledged (PC-5). |
| `IP_CANDIDATE_LAPSED` | Terminal: rights lapsed. | System/Counsel | `{ rationale }` | Never silent (PC-5). |
| `IP_CANDIDATE_CONVERTED_TO_SECRET` | Route to trade-secret track. | IRB | `{ secretRef, rationale }` | Only pre-barring-disclosure (PC-4). |
| `IP_CANDIDATE_FAMILY_LINKED` | Join/relate within a family. | Portfolio | `{ familyId, familyRoleRef }` | — |
| `IP_CANDIDATE_CLASSIFICATION_CHANGED` | Confidentiality/moat change. | IRB | `{ confidentiality?, moatRef? }` | Downgrade passes disclosure gate. |

**Event rules.**
- **EV-1.** Events are immutable and hash-chained (`prevHash`/`eventHash`); a break fails closed.
- **EV-2.** Transition validity is checked against the projected current state + the `ip:candidate-state:*`
  admissible transitions (deny-by-default).
- **EV-3.** Every event carries `correlationId`/`causationId`, `policyRefs` (version-pinned), provenance, and
  actor (mirrors the Proof Fabric event envelope).
- **EV-4.** Governed transitions are **Evolution-committed** (PCR-7); the registry proposes, Evolution commits.
- **EV-5.** Replay **recomputes** state, deadlines, and evidence-gate satisfaction — never trusts a recorded
  flag (deterministic replay).

---

## 6. Deadline & clock model

Clocks are **registry-driven** (`ip:deadline-class:*`) so no legal period is hard-coded; each class declares how
`dueAt` is computed from a basis event and how it escalates.

| Deadline class (seed) | Basis | Computation (design; counsel-authoritative) | Escalation |
|-----------------------|-------|----------------------------------------------|-----------|
| `provisional-conversion` | provisional filing date | basis + 12 months | NOTICE −90d · WARNING −30d · CRITICAL −7d |
| `pct-national-phase` | priority date | basis + 30/31 months (jurisdiction-dependent) | tiered as above |
| `office-action-response` | office action date | basis + statutory response window | tiered |
| `maintenance-fee` | grant/anniversary | jurisdiction schedule | tiered + grace-period flag |

- **DL-1.** `dueAt` is **data**, computed by the class rule; the framework tracks and warns — **it does not
  interpret law** (counsel-authoritative, IP-0000 §4.3).
- **DL-2.** Approaching/overdue clocks auto-emit `IP_CANDIDATE_DEADLINE_ESCALATED` to the IRB (R-2 mitigation).
- **DL-3.** Missing a deadline is recorded (`MISSED`) with rationale — never silent (PC-5).
- **DL-4.** Grace-period handling is jurisdiction metadata; the framework surfaces it, counsel decides.

---

## 7. Patent family records (IP-0000 §5)

```ts
// SPECIFICATION — patent family record (folded from IP_CANDIDATE_FAMILY_LINKED + family events).
export interface PatentFamily {
  familyId: string;
  theme: string;                      // the defended capability/moat
  moatRef?: string;                   // IP-0005 moat
  anchorCandidateId: string;
  members: Array<{ candidateId: string; familyRoleRef: string }>; // ip:family-role:*
  jurisdictions: string[];            // ip:jurisdiction:* where sought/held
  claimCapabilityMap: Array<{ candidateId: string; claimId: string; capabilityRef: string }>;
  strength?: "HIGH" | "MEDIUM" | "LOW"; // portfolio assessment (IP-0000 §20 M-8)
  digest: string;
  version: number;
}
```

- **FM-1.** A family groups by **defended capability/moat**, not filing convenience (IP-0000 §5.3 PF-1).
- **FM-2.** Every family maps to ≥1 UCOS capability (traceability; IP-0000 §18 PM-2).
- **FM-3.** Family membership changes are `IP_CANDIDATE_FAMILY_LINKED` events (append-only, audited).

---

## 8. Storage schema (provider-agnostic; reference rendering only)

```sql
-- SPECIFICATION — reference rendering only; NOT committed DDL, NOT an engine selection.

-- Append-only candidate event log (source of truth)
CREATE TABLE ip_candidate_event (
  stream_id       TEXT   NOT NULL,          -- candidate:<candidateId>
  seq             BIGINT NOT NULL,
  event_id        TEXT   NOT NULL UNIQUE,
  type            TEXT   NOT NULL,          -- IP_CANDIDATE_*
  candidate_id    TEXT   NOT NULL,
  occurred_at     BIGINT NOT NULL,          -- recorded logical time
  actor           TEXT   NOT NULL,
  correlation_id  TEXT   NOT NULL,
  causation_id    TEXT,
  payload         JSONB  NOT NULL,
  policy_refs     JSONB  NOT NULL,          -- version-pinned ip:*@version[]
  provenance      JSONB  NOT NULL,
  prev_hash       TEXT   NOT NULL,
  event_hash      TEXT   NOT NULL,
  PRIMARY KEY (stream_id, seq)
  -- APPEND-ONLY: no UPDATE, no DELETE
);

-- Versioned registry (immutable-per-version)
CREATE TABLE ip_registry (
  kind         TEXT  NOT NULL,  -- candidate-state|deadline-class|jurisdiction|filing-kind|family-role|candidate-evidence-req
  id           TEXT  NOT NULL,
  version      TEXT  NOT NULL,
  status       TEXT  NOT NULL,  -- DRAFT|ACTIVE|DEPRECATED|RETIRED
  record       JSONB NOT NULL,
  digest       TEXT  NOT NULL,
  published_by TEXT  NOT NULL,  -- Evolution-committed
  published_at BIGINT NOT NULL,
  PRIMARY KEY (kind, id, version)
);

-- Disposable projection cache (never source of truth)
CREATE TABLE ip_candidate_projection (
  candidate_id        TEXT   NOT NULL PRIMARY KEY,
  projection          JSONB  NOT NULL,
  version             BIGINT NOT NULL,
  projected_from_head TEXT   NOT NULL       -- audit head-hash; invalidates on mismatch
);

-- Deadline index (derived; accelerates escalation scans)
CREATE TABLE ip_deadline_index (
  deadline_id     TEXT   NOT NULL PRIMARY KEY,
  candidate_id    TEXT   NOT NULL,
  due_at          BIGINT NOT NULL,
  status          TEXT   NOT NULL,          -- OPEN|MET|MISSED|WAIVED
  escalation_tier TEXT   NOT NULL
);

-- Family index (derived)
CREATE TABLE ip_family (
  family_id   TEXT  NOT NULL PRIMARY KEY,
  record      JSONB NOT NULL,
  digest      TEXT  NOT NULL,
  version     BIGINT NOT NULL
);
```

**Storage guarantees** (mirroring the Proof Fabric storage discipline):
- **SS-A.** Append-only, no in-place mutation of events or registry versions.
- **SS-B.** Content-addressed (`event_hash`, `digest`) + hash-chained (`prev_hash`); tamper-evident.
- **SS-C.** Projections/indexes are disposable caches keyed by the audit head-hash; rebuildable by replay.
- **SS-D.** Durable ⟺ appended **and** audited (no unaudited state change; S6).
- **SS-E.** Provider-agnostic; engine selection deferred to ratified platform ADRs (not made here).

---

## 9. API surface (contract-first; design)

```ts
// SPECIFICATION — Proposed control-layer surface (deny-by-default, audited, Evolution-committed mutations).
export interface PatentCandidateRegistry {
  // Commands (propose → Evolution-commit; every call authorized by PI-4 and audited)
  open(cmd: OpenCandidateCmd, ctx: IpContext): Promise<PatentCandidate>;         // requires IDR
  recordPriorArtClearance(cmd: ClearanceCmd, ctx: IpContext): Promise<void>;
  markReadyToFile(cmd: ReadyToFileCmd, ctx: IpContext): Promise<void>;           // counsel-gated
  recordFiling(cmd: RecordFilingCmd, ctx: IpContext): Promise<Filing>;           // sets immutable priorityDate
  recordProsecution(cmd: ProsecutionCmd, ctx: IpContext): Promise<void>;
  recordGrant(cmd: GrantCmd, ctx: IpContext): Promise<void>;
  recordMaintenance(cmd: MaintenanceCmd, ctx: IpContext): Promise<void>;
  abandon(cmd: AbandonCmd, ctx: IpContext): Promise<void>;                       // rationale mandatory
  convertToSecret(cmd: ConvertCmd, ctx: IpContext): Promise<void>;              // pre-disclosure only
  linkFamily(cmd: LinkFamilyCmd, ctx: IpContext): Promise<void>;

  // Queries (read-only projections; confidentiality-filtered by PI-4)
  get(candidateId: string, ctx: IpContext): Promise<PatentCandidate>;
  listByState(state: CandidateState, ctx: IpContext): Promise<string[]>;
  dueDeadlines(within: number, ctx: IpContext): Promise<DeadlineRecord[]>;       // escalation feed
  family(familyId: string, ctx: IpContext): Promise<PatentFamily>;
  coverageGaps(ctx: IpContext): Promise<Array<{ capabilityRef: string }>>;       // portfolio gap detection
}
```

- **API-1.** Every command is authorized by the Control Plane (deny-by-default; confidentiality-aware) and
  audited; there is no implicit-allow path.
- **API-2.** Mutations are **proposals** committed via Evolution (PCR-7); reads are projections.
- **API-3.** Queries are confidentiality-filtered: a caller sees only candidates their clearance permits (S1/S4).
- **API-4.** `coverageGaps` and `dueDeadlines` drive portfolio management (IP-0000 §18) and risk escalation
  (§19).

---

## 10. Integrity, audit & recovery guarantees

- **IG-1.** **Inventorship & priority immutable** once recorded (CD-2) — the single most important integrity
  property for patent validity.
- **IG-2.** **Tamper-evident** via hash-chained events anchored in `AUDIT-UNIV-001` (`domain:"ip"`, IP-0000 §17).
- **IG-3.** **Recompute-don't-trust** at replay: state, deadlines, and evidence gates are recomputed (EV-5).
- **IG-4.** **Full rebuild** from the event log; projections/indexes are disposable caches (SS-C).
- **IG-5.** **Audit completeness** — every action, including denials, escalations, and abandonments, emits an
  immutable event (IP-0000 §17 AU-1; §20 M-11).
- **IG-6.** **Deadline adherence provability** — the deadline history proves whether every due date was met
  (IP-0000 §20 M-6).

---

## 11. Governance

- **GV-1.** The PCR is owned by the Innovation Review Board (IP-0000 §13); legally-operative steps (filing,
  abandonment, conversion) are counsel-gated (RB-3) and separation-of-duties preserved.
- **GV-2.** All `ip:*` registry publications and all candidate mutations are **Evolution-committed** (AD-0019).
- **GV-3.** Confidentiality defaults `CONFIDENTIAL`; disclosure/downgrade passes the disclosure gate (IP-0000
  §10, deny-by-default).
- **GV-4.** Deadlines auto-escalate to the Board (R-2); no deadline is missed silently.
- **GV-5.** The registry consumes IP-0001 (types), IP-0004 (assessment), and the prior-art registry (IP-0000
  §16), and feeds portfolio management (IP-0000 §18).

---

*This document is design/specification only. It writes no code, releases no lock, enrolls no invariant, confers
no legal authority, and constitutes no legal advice. `UCOS-CONSTRUCTION-BLOCKED` and the Article IX generation
lock are unchanged.*
