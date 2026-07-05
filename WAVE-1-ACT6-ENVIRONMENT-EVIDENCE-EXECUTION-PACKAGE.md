# UCOS Ω — WAVE 1 · ACT 6 · ENVIRONMENT EVIDENCE EXECUTION PACKAGE

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-W1-ACT6-ENV-EXEC-001` |
| Type | **Environment Evidence Execution Package** — the operator-executable procedure that generates G12-1 Environment Evidence. Defines the exact execution procedure; produces no evidence. |
| Act | **Act 6 — Environment Evidence** (`UCOS-W1-OEF-EXEC-001` §2; first evidence-producing act) |
| Gate | **G12-1** (Environment) |
| Realizes | `UCOS-W1-OEF-IAP-001` §2 CAP-OEF-7; §8.3 G12-1 acceptance; §10 S2 |
| Runbook of record | `UCOS-W1-OEF-EXEC-001` §4.1 (RB-ENV) → `UCOS-RA2-EXEC-001` RA2-ENV-001 (steps D-0..D-7, I-1..I-4) |
| Mode | **EXECUTION-PROCEDURE AUTHORING ONLY** — defines the procedure a human operator executes. **No implementation. No provisioning. No apply. No command execution. No environment-state assumption. No evidence produced. No evidence marked complete. Append-only.** |
| Date | 2026-07-04 |
| Governing rule | *Repository reality + reproduced evidence override stale documentation* (`GOV-REC-001`). **Fail-closed:** absence of evidence = NOT PRODUCED; below-floor/plaintext/public exposure = FAIL. |
| Fail-closed defaults | Environment state = **UNKNOWN / NOT ASSUMED**. Evidence = **NOT PRODUCED**. Approval = **NOT APPROVED**. |
| Authority (unchanged) | `AUTH-012` **AD-0015** (Limited Evidence Authorization) in force; **AD-0009** (Approval-Required) per step; Article IX generation lock **ACTIVE**; `UCOS-CONSTRUCTION-BLOCKED` stands except the AD-0015 carve-out. This package authorizes and provisions nothing. |
| **Determination** | **§10 — ACT 6 EXECUTION AUTHORITY DECISION** |

---

## SOURCE OF AUTHORITY

| # | Source | Repository artifact | Use |
|:-:|--------|---------------------|-----|
| 1 | Wave 1 Implementation Authority Package | `UCOS-W1-OEF-IAP-001` | CAP-OEF-7 spec; G12-1 acceptance (§8.3); S2 sequence (§10) |
| 2 | Wave 1 Operational Evidence Execution Package | `UCOS-W1-OEF-EXEC-001` | RB-ENV runbook (§4.1); HAR-1..6 (§3.1); T-* templates (§7); G12-1 closure (§8) |
| 3 | Wave 1 Operational Evidence Production Tracker | `UCOS-W1-OEF-TRACK-001` | Register to update post-execution (§1/§2/§3/§4/§5/§8) |
| 4 | UCOS Ω Architectural Constitution v1.0 | `UCOS-CONST-MASTER` / `AUTH-002-CONSTITUTION` | LAW-004/005/006/008/012; INV-2/4/5/9/10; S1/S3/S4 |
| — | Supporting (read-only) | `UCOS-RA2-EXEC-001` (RA2-ENV-001), `UCOS-ASR-NFR-001`, `CTX-REG-001`, `ADR-001/006/007`, `ADR-PE12` | Verbatim step IDs, floors, registry, tech ADRs |

> **Discipline.** This package renders the already-ratified RA2-ENV-001 steps as an operator checklist with
> evidence hooks. It introduces **no new procedure, no new capability, no new authority.** Every live step is
> `[HAR]` (human, AD-0009); every authoring/registration step is `[AGT-OK]`. The agent executes none of them.

---

## 1. ACT 6 SCOPE

### 1.1 Purpose

Provision **ENV-DEV** and **ENV-INT** as non-production, internal-only substrates; deploy the 5 foundation seeds;
and prove **live** deny-by-default authorization + mTLS STRICT (S1/S4) with **zero public exposure** — capturing
each result as measured, hash-bound, `CTX-REG-001`-registered evidence that closes **G12-1**.

### 1.2 Evidence IDs produced (all currently NOT PRODUCED)

| Evidence ID (EXEC / MATRIX) | Name | Origin steps | Template |
|-----------------------------|------|--------------|----------|
| `EV-ENV-DEV` / `EV-3` (dev portion) | ENV-DEV provisioned, internal-only, S1/S3/S4 | D-1..D-7 | T-ENV-DEV (§4.1) |
| `EV-ENV-INT` / `EV-3` (int portion) | ENV-INT provisioned, internal-only | I-1..I-4 | T-ENV-INT (§4.2) |
| `EO-1` | Provisioning attestation (immutable, IA-attestable) | Act 6 close | T-PROV (§4.3) |
| `EO-4` (config seed) | Live mTLS STRICT + deny-by-default authz (S1/S4) | D-6 | T-SEC (§4.4) |
| `EV-4` (initiated) | Immutable hash-chained chain-of-custody index (opened at Act 6) | D-1 → I-4 | T-CHAIN (§5) |

> `EV-4` is **initiated** at Act 6 (first custody entries) and **extended** through Acts 7–8; it is not closed
> by Act 6 alone.

### 1.3 Gates affected

| Gate | Effect of Act 6 |
|:----:|-----------------|
| **G12-1** | Act 6 is the sole producer of G12-1 evidence; on full closure criteria (§8) G12-1 may move OPEN → CLOSED (human/VW-2 determination — **not** by this package) |
| **G12-2** | Hard-gated by G12-1; remains OPEN until G12-1 CLOSED |
| **G12-3** | Hard-gated by G12-2; remains OPEN |

### 1.4 Dependencies (fail-closed — all must hold before commencement)

| Dep | Requirement | Current state |
|-----|-------------|:-------------:|
| DEP-1 | **A0 complete** — AD-0009 Executing Operator assigned (PRQ-2); VW-2 independent reviewer designated | **NOT CONFIRMED** |
| DEP-2 | **AD-0015 in force** (PRQ-1) | **IN FORCE** |
| DEP-3 | **S1 complete** — OPF operationalized (AC-D1 durable MetadataPort→`dom_ops`); baseline suite green (UPP-2); 0 core-dir change (UPP-1) | **NOT STARTED** |
| DEP-4 | **PRQ-3..6** — non-prod target only; secrets by reference; cost ceiling + teardown deadline; immutable audit sink reachable | **NOT CONFIRMED** |
| DEP-5 | **HAR-1..HAR-6 approvals** granted per step (AD-0009) | **NOT APPROVED (0/6)** |
| DEP-6 | `infra/environments/{dev,int}/main.tf` present; `ADR-001/006/007` neutral-provider contracts available | **NOT VERIFIED (do not assume)** |

---

## 2. ENVIRONMENT INVENTORY PROCEDURE

Establishes the objective, measured inventory of what was provisioned. **No state is assumed**; every item is
captured from live output or recorded as `unknown` (never inferred).

### 2.1 What must be inventoried

| Inventory class | Items |
|-----------------|-------|
| Provider / backend | cloud/K8s provider binding; Terraform backend; ADR-007-neutral contract reference |
| Compute / cluster | namespace(s); node/pool identity; K8s API version |
| Foundation seeds (5) | (1) runtime, (2) networking, (3) persistence, (4) registry, (5) config-metadata — deployment + reconcile status |
| Workload identity | ServiceAccounts; pod inventory; mesh sidecar presence |
| Network posture | ingress rules; internal-only confirmation; **absence** of public LoadBalancer/route |
| Security posture | mTLS mode (must be STRICT); authorization policies (must be deny-by-default); encryption-at-rest flag |
| Secrets | `external://…` reference manifest (references only — **no values**) |
| Registry | `CTX-REG-001` entries for every provisioned artifact |

### 2.2 Collection method

| Source | Method (operator-executed, `[HAR]`/`[AGT-OK]`) |
|--------|------------------------------------------------|
| Terraform | `terraform plan` diff (D-3) and `terraform apply` log + `terraform state list` / resource inventory (D-4, I-1) |
| Kubernetes | `kubectl get`/`describe` for namespaces, pods, ServiceAccounts, NetworkPolicies (read-only capture) |
| Service mesh | mesh config dump for `PeerAuthentication` (mTLS mode) and `AuthorizationPolicy` (deny-by-default) |
| GitOps | reconcile status export (deploy of 5 seeds; promotion record) |
| Secrets backend | reference manifest export (no secret values; S3) |

> All collection outputs are captured to files, timestamped (UTC, ISO-8601), and hashed (§5). A missing sample
> is recorded as **`unknown`** — never fabricated, never assumed healthy (CAP-OEF-3).

### 2.3 Verification method

Each inventory item is verified by an independent probe (not by the provisioning log alone) and is reproducible
by **VW-2**: mTLS via mesh probe; authz via a deny-by-default negative test; internal-only via an external
reachability negative test; seed reconcile via GitOps status.

### 2.4 Required outputs

Provider/backend binding record · plan diff · apply log · resource inventory · pod/SA inventory · NetworkPolicy
dump · mTLS/authz probe results · public-exposure negative-test result · `external://` secret-ref manifest ·
`CTX-REG-001` entry set. All feed templates `T-ENV-DEV` / `T-ENV-INT` (§4).

---

## 3. ENVIRONMENT VALIDATION PROCEDURE

Validation is **fail-closed**: any failed criterion holds **G12-1 OPEN** and rejects the affected evidence. The
commands below are **reference procedures for the human operator**; this package executes none of them.

### 3.1 Validation sequence (ordered; a failure at any step stops the act)

```
V-0  Precondition gate:  confirm DEP-1..DEP-6 (PRQ-1..6, S1 green, HAR-1..6 approved) → else STOP
V-1  Provider/backend binding conforms to ADR-007 (neutral; no lock beyond ADR-007)   → else REJECT
V-2  terraform plan reviewed; diff == intended manifest (no drift)                     → else STOP (no apply)
V-3  terraform apply ENV-DEV; external_exposure=false; enc/mTLS/authz flags=true       → else FAIL + destroy
V-4  5 foundation seeds reconciled (runtime/networking/persistence/registry/config)    → else REVERT
V-5  mTLS mode == STRICT (mesh PeerAuthentication)                                       → else FAIL
V-6  Authorization == deny-by-default (no allow-by-default policy)                       → else FAIL
V-7  Public exposure == 0 (no public LB/route reachable externally)                     → else FAIL + destroy
V-8  Registry↔config-metadata integration wiring verified (ENV-INT, I-3)                → else STOP
V-9  All artifacts registered in CTX-REG-001 with hash + HAR approval ref               → else INADMISSIBLE
```

### 3.2 Validation commands (reference — operator-executed)

| ID | Purpose | Reference command (illustrative; operator adapts to bound provider) |
|:--:|---------|---------------------------------------------------------------------|
| C-PLAN | Plan diff (no apply) | `terraform -chdir=infra/environments/dev plan -out=dev.plan` |
| C-APPLY | Apply ENV-DEV | `terraform -chdir=infra/environments/dev apply dev.plan` |
| C-INV | Resource inventory | `terraform -chdir=infra/environments/dev state list` |
| C-PODS | Pod / SA inventory | `kubectl -n <ns> get pods,serviceaccounts -o yaml` |
| C-MTLS | mTLS mode = STRICT | `kubectl -n <ns> get peerauthentication -o yaml` |
| C-AUTHZ | Deny-by-default authz | `kubectl -n <ns> get authorizationpolicy -o yaml` (+ negative test) |
| C-NETPOL | Network policy | `kubectl -n <ns> get networkpolicy -o yaml` |
| C-PUB | Public-exposure negative test | external probe of any Service/Ingress → **must fail to connect** |
| C-RECON | Seed reconcile status | GitOps controller status export for the 5 seeds |

> Commands are **templates**. `<ns>` and provider specifics are bound at execution under HAR approval. No
> command is run by this package; no output is assumed.

### 3.3 Validation criteria (pass = fail-closed, measured)

| Criterion | Pass condition |
|-----------|----------------|
| Non-prod, internal-only | `external_exposure=false`; ENV-STAGE/PROD not targeted |
| 5 foundation seeds | all 5 reconciled, healthy (runtime, networking, persistence, registry, config-metadata) |
| mTLS | mode == STRICT (TLS 1.3; INV-4) on all mesh traffic |
| Authorization | deny-by-default; 0 allow-by-default policies (S1) |
| Encryption | encryption-at-rest enabled; no plaintext secrets (S3) |
| Public exposure | 0 externally reachable endpoints |
| Registration | every artifact in `CTX-REG-001` with hash + HAR ref |

### 3.4 Failure conditions (each ⇒ fail-closed)

| Failure | Action |
|---------|--------|
| Any PRQ / DEP unmet at V-0 | **STOP** — act does not commence |
| Plan drift from manifest (V-2) | **STOP** — no apply |
| Public exposure detected (V-3/V-7) | **FAIL** — invoke HAR-STOP teardown (`terraform destroy`) |
| Plaintext / inline secret (S3) | **REJECT** — evidence inadmissible; rotate/revoke |
| Allow-by-default authz (V-6) | **FAIL** — G12-1 OPEN |
| mTLS ≠ STRICT (V-5) | **FAIL** — G12-1 OPEN |
| Seed reconcile drift (V-4) | **REVERT** — GitOps revert to last-known-good |
| Unregistered artifact (V-9) | **INADMISSIBLE** — not counted toward closure |

---

## 4. ENVIRONMENT EVIDENCE TEMPLATES

Every evidence item is admissible **only** with (a) an AD-0009 approval reference, (b) an immutable
`sha256` hash, and (c) a `CTX-REG-001` entry (`UCOS-W1-OEF-EXEC-001` §7). All fields below are
**`☐ NOT-YET-PRODUCED`**; this package fills none of them.

### 4.0 Universal evidence header (prepended to every EV-*/EO-* item)

```
Evidence-ID      : <EV-… | EO-…>
Gate             : G12-1
Origin step      : <D-… | I-…>
Approval ref     : <HAR-…  → AD-0009 approval record id>            [required]
Executing actor  : <operator id>            (≠ VW-2 reviewer)
Capture ts (UTC) : <ISO-8601>
Artifact hash    : sha256(<canonical artifact>)                     [required]
Registry entry   : CTX-REG-001:<key>                                [required]
Reproducible-by  : <VW-2 procedure ref>
Fail-closed note : <below-floor / absent / public-exposure ⇒ NOT ACHIEVED>
```

### 4.1 T-ENV-DEV → `EV-ENV-DEV`

| Section | Required fields | Required attachments | Required signatures |
|---------|-----------------|----------------------|---------------------|
| Header | (§4.0) | — | Executing Operator |
| Provider/backend | provider id, backend ref, ADR-007 conformance flag | binding record (D-1) | Operator (HAR-1) |
| Secrets | `external://` reference list (no values) | secret-ref manifest (D-2) | Operator (HAR-2) |
| Plan | plan hash; drift=false | plan diff output (D-3) | Operator |
| Apply | apply status; `external_exposure=false` | apply log; resource inventory (D-4) | Operator (HAR-3) |
| Seeds | 5/5 reconciled (runtime/networking/persistence/registry/config) | GitOps reconcile status; pod/SA inventory (D-5) | Operator (HAR-4) |
| Security | mTLS STRICT=true; deny-by-default=true; enc-at-rest=true | mTLS/authz probe results (D-6) | Operator |
| Exposure | public endpoints = 0 | external negative-test result (D-6) | Operator |
| Registry | `CTX-REG-001` keys | registry entries (D-7) | Operator (`[AGT-OK]`) |

### 4.2 T-ENV-INT → `EV-ENV-INT`

| Section | Required fields | Required attachments | Required signatures |
|---------|-----------------|----------------------|---------------------|
| Header | (§4.0) | — | Executing Operator |
| Plan/apply | ENV-INT posture == ENV-DEV (non-waivable) | plan + apply logs (I-1) | Operator (HAR-5) |
| Promotion | DEV→INT record; ENV-PROD not targeted | promotion record; gate results (I-2) | Operator (HAR-6) |
| Integration | registry↔config-metadata wiring verified | integration probe (I-3) | Operator |
| Registry | `CTX-REG-001` keys | registry entries (I-4) | Operator (`[AGT-OK]`) |

### 4.3 T-PROV → `EO-1` (provisioning attestation)

| Section | Required fields | Required attachments | Required signatures |
|---------|-----------------|----------------------|---------------------|
| Attestation | immutable provisioning statement; IA-attestable flag | consolidated inventory hash set; EV-ENV-DEV+INT refs | Operator (attests); **VW-2 reproduces (distinct actor)** |

### 4.4 T-SEC → `EO-4` (config seed — S1/S4)

| Section | Required fields | Required attachments | Required signatures |
|---------|-----------------|----------------------|---------------------|
| Security proof | live mTLS STRICT; deny-by-default authz; least-privilege mesh allow-rules; S1/S3/S4 preserved | mesh config dump; authz negative-test; probe results | Operator |

---

## 5. CHAIN OF CUSTODY PROCEDURE

Per `UCOS-W1-OEF-EXEC-001` §7.3 and `OPS-EVIDENCE-MATRIX` §3. Custody chain (`EV-4`) is **opened** at D-1 and
appended per step; retention append-only (INV-10), never deleted.

### 5.1 Evidence creation

Each step (`D-1..D-7`, `I-1..I-4`) that yields an artifact creates a custody record:
`origin step → AD-0009 approver → capture timestamp (UTC) → artifact`. Creation without an HAR approval ref ⇒
**inadmissible**.

### 5.2 Evidence storage

Artifacts stored to the immutable audit sink (PRQ-6) and registered in `CTX-REG-001`. Secret values are never
stored (S3) — only `external://` references. Storage location recorded in the header (§4.0).

### 5.3 Evidence hashing

`artifactHash = sha256(canonical(artifact))` computed at capture; the hash is bound into the custody chain so
each entry links to the prior (`entryHash` linkage). The consolidated `EV-4` index hashes the ordered set.

### 5.4 Evidence verification

**VW-2** (independent; KMS key disjoint from operator) reproduces each artifact's capture procedure and
recomputes its hash; offline chain-verify confirms linkage and cross-node reconcile (INV-CORE-02). A record that
cannot be reproduced by VW-2 is **inadmissible**. Operator ≠ VW-2 (non-self-attestation; REAL-C-05).

---

## 6. HUMAN APPROVAL REQUIREMENTS

### 6.1 HAR references (Act 6 subset of `UCOS-W1-OEF-EXEC-001` §3.1)

| HAR-ID | Step | Operation | AD-0009 class | Approver | Current |
|:------:|:----:|-----------|---------------|----------|:-------:|
| HAR-1 | D-1 | Bind cloud/K8s provider + Terraform backend | infrastructure | Operator | **NOT APPROVED** |
| HAR-2 | D-2 | Bind secrets/KMS; register `external://` refs (no values) | security | Operator | **NOT APPROVED** |
| HAR-3 | D-4 | `terraform apply` ENV-DEV (`external_exposure=false`) | infrastructure + financial | Operator | **NOT APPROVED** |
| HAR-4 | D-5 | Deploy 5 foundation seeds via GitOps | infrastructure | Operator | **NOT APPROVED** |
| HAR-5 | I-1 | `terraform apply` ENV-INT | infrastructure + financial | Operator | **NOT APPROVED** |
| HAR-6 | I-2 | GitOps promotion ENV-DEV → ENV-INT (ENV-PROD forbidden) | infrastructure | Operator | **NOT APPROVED** |
| HAR-STOP | any | Rollback / teardown (`terraform destroy` / GitOps revert) | infrastructure | Operator | **PRE-APPROVED (standing)** |

### 6.2 Approval sequence (per-act, recorded, admissibility precondition)

```
PRQ-1..6 confirmed  →  HAR-1 (D-1)  →  HAR-2 (D-2)  →  [D-3 plan, no approval]  →  HAR-3 (D-4)
   →  HAR-4 (D-5)  →  [D-6/D-7 verify+register]  →  HAR-5 (I-1)  →  HAR-6 (I-2)  →  [I-3/I-4]
```

An unapproved `[HAR]` step ⇒ **blocked**; its evidence is **inadmissible**. Approval is per-step and captured in
the custody record.

### 6.3 Separation-of-Duties (SoD)

| Role | Constraint |
|------|------------|
| Executing Operator | Performs HAR-1..HAR-6; **may not** self-attest as independent reviewer |
| VW-2 Independent Reviewer | Reproduces evidence; **distinct actor**, KMS key disjoint from operator/CI/authoring |
| Authority Board | Owns G12-1 closure determination (with VW-2 reproduction) |
| Agent | Authors this package only; **executes no step, signs nothing, provisions nothing** |

> Attester == sealer, or reviewer == operator ⇒ evidence **withheld** (self-attestation breach).

---

## 7. ACCEPTANCE CRITERIA (AC matrix)

Grounded in `UCOS-W1-OEF-IAP-001` §8.3 (G12-1) and `UCOS-W1-OEF-EXEC-001` §8.1 (G1-1..G1-7 + G1-UPP). All states
**☐** (fail-closed default).

| AC | Criterion | Evidence | Verification | State |
|:--:|-----------|----------|--------------|:-----:|
| AC6-1 | ENV-DEV provisioned non-prod, internal-only (`external_exposure=false`) | EV-ENV-DEV | apply log + resource inventory | ☐ |
| AC6-2 | ENV-INT provisioned non-prod, internal-only | EV-ENV-INT | apply log + promotion record | ☐ |
| AC6-3 | 5 foundation seeds reconciled (runtime/networking/persistence/registry/config-metadata) | EV-ENV-DEV/INT | GitOps reconcile status + pod/SA inventory | ☐ |
| AC6-4 | Deny-by-default authz + mTLS STRICT verified **live** (S1/S4; INV-4) | EO-4 (config) | mesh dump + authz negative test | ☐ |
| AC6-5 | 0 public exposure confirmed | EV-ENV-DEV/INT | external reachability negative test | ☐ |
| AC6-6 | Provisioning attestation captured (immutable, IA-attestable) | EO-1 | VW-2 reproduction | ☐ |
| AC6-7 | Registry↔config-metadata integration wiring verified (ENV-INT) | EV-ENV-INT | integration probe (I-3) | ☐ |
| AC6-8 | All artifacts registered in `CTX-REG-001` with hash + HAR approval ref | EV-4 (initiated) | registry entry + chain-verify | ☐ |
| AC6-9 | Secrets by reference only; no inline/plaintext secret (S3) | EV-ENV-DEV | secret-ref manifest scan | ☐ |
| AC6-D1 | S1 dependency: OPF wired to `dom_ops` via durable MetadataPort (AC-D1) | S1 adapter + integration test | baseline suite green | ☐ |
| G1-UPP | UPP-1..5 hold (additive/0 core-dir; baseline green; S1/S3/S4; no custom crypto; fail-closed) | — | UPP audit | ☐ |

> **Pass rule.** G12-1 acceptance requires **AC6-1..AC6-9 ∧ AC6-D1 ∧ G1-UPP = MET** on measured, hash-bound,
> registered, VW-2-reproduced evidence. Any single ☐ or FAIL ⇒ **G12-1 remains OPEN**.

---

## 8. CLOSURE CRITERIA — requirements to mark `EV-ENV-DEV`, `EV-ENV-INT`, `EV-3` as PRODUCED

An evidence item moves **NOT PRODUCED → PRODUCED** only when **all** of the following hold. This package marks
none of them; determination is a human/VW-2/Board act.

### 8.1 `EV-ENV-DEV` → PRODUCED iff

| # | Requirement |
|:-:|-------------|
| 1 | Steps D-1..D-7 executed under HAR-1..HAR-4 (approvals recorded) |
| 2 | Apply succeeded; `external_exposure=false`; resource inventory captured |
| 3 | 5 foundation seeds reconciled and healthy |
| 4 | mTLS STRICT + deny-by-default + enc-at-rest verified live (feeds EO-4) |
| 5 | 0 public exposure confirmed by negative test |
| 6 | Artifact hashed (`sha256`) + registered in `CTX-REG-001` |
| 7 | VW-2 reproduced the capture (independent) |

### 8.2 `EV-ENV-INT` → PRODUCED iff

| # | Requirement |
|:-:|-------------|
| 1 | Steps I-1..I-4 executed under HAR-5, HAR-6 (approvals recorded) |
| 2 | ENV-INT posture == ENV-DEV (non-waivable); ENV-PROD not targeted |
| 3 | DEV→INT promotion record captured; gates passed |
| 4 | Registry↔config-metadata integration verified (I-3) |
| 5 | Artifact hashed + registered in `CTX-REG-001` |
| 6 | VW-2 reproduced the capture (independent) |

### 8.3 `EV-3` (MATRIX taxonomy) → PRODUCED iff

`EV-3` (environment provisioned, per `OPS-EVIDENCE-MATRIX`) is the union of the DEV and INT portions:

```
EV-3 = PRODUCED  ⟺  EV-ENV-DEV = PRODUCED  ∧  EV-ENV-INT = PRODUCED
                    ∧  EO-1 captured  ∧  EO-4(config) captured
                    ∧  EV-4 custody entries for all of the above registered
```

> **G12-1 CLOSED** is a **separate, stronger** determination than "evidence PRODUCED": it additionally requires
> the full AC matrix (§7) MET, G1-UPP hold, VW-2 reproduction complete, and the Board/VW-2 sign-off block
> (`UCOS-W1-OEF-EXEC-001` §8.2). Evidence PRODUCED is necessary but not sufficient for gate closure.

---

## 9. TRACKER UPDATE INSTRUCTIONS — `UCOS-W1-OEF-TRACK-001`

Apply **only after** successful, VW-2-reproduced execution. Updates are append-only; do not delete prior rows.
**Do not apply any update on the basis of this package** — no execution has occurred.

| Tracker section | Row(s) | Change (only when the §8 criterion is truly MET) |
|-----------------|--------|--------------------------------------------------|
| §1 Evidence Master Register | `EV-ENV-DEV` | Status NOT PRODUCED → **PRODUCED**; Verification NOT VERIFIED → **VERIFIED** (after VW-2); Artifact Location → `CTX-REG-001:<key>` |
| §1 | `EV-ENV-INT` | as above |
| §1 | `EO-1` | Status → **PRODUCED**; Verification → **VERIFIED** (VW-2 reproduced) |
| §1 | `EO-4` (config) | Status → **PRODUCED**; Verification → **VERIFIED** |
| §1 | `EV-4` | Status NOT PRODUCED → **IN PROGRESS (initiated)**; note "Act 6 custody entries registered" |
| §1 roll-up | — | Recompute Produced/Verified counts (e.g., 0→4 produced) |
| §2 Evidence Act Register | ACT 6 | Current State NOT STARTED → **IN PROGRESS** during; → **COMPLETE** on §8 criteria met |
| §2 | S1 | NOT STARTED → **COMPLETE** (AC-D1 pass; baseline green) as its own precondition |
| §3 Gate Register | G12-1 | Status **OPEN** → **CLOSED** only when full §7 AC matrix MET + VW-2 + Board sign-off; else remain OPEN with updated blocking items |
| §3 | G12-2 | Update blocking note: "G12-1 CLOSED" (unblocks) once G12-1 closes |
| §4 Human Approval Register | HAR-1..HAR-6 | Approval Received NOT APPROVED → **APPROVED**; fill Date + Authority per grant |
| §4 roll-up | — | Received 0/11 → **6/11** |
| §5 Chain-of-Custody Register | rows `EV-ENV-DEV`/`EV-ENV-INT`/`EO-1`/`EO-4`/`EV-4` | Storage → `CTX-REG-001:<key>`; Integrity → `<sha256>`; Ratification NOT RATIFIED → **RATIFIED** (after VW-2 + Board) |
| §8 Wave Progress Dashboard | — | Recompute: Percent Complete, Open/Closed Evidence, Approvals Received, (if G12-1 closes) Closed Gates 0→1 |
| §10 Wave 1 Execution Status | — | Update Current Wave Status → **IN PROGRESS**; Current Gate Status → G12-1 CLOSED (if closed); Next Required Evidence Act → **ACT 7 (G12-2)** |

> **Fail-closed update rule.** If any §8 criterion is NOT met or VW-2 cannot reproduce, make **no** PRODUCED/CLOSED
> update; instead append the failure to the tracker's blocking items and hold G12-1 **OPEN**.

---

## 10. ACT 6 EXECUTION AUTHORITY DECISION

### 10.1 Two distinct determinations

| Determination | Verdict | Basis |
|---------------|:-------:|-------|
| **(A) Execution-package readiness** (is the procedure complete and executable?) | **READY** | All 9 required outputs authored; procedure grounded verbatim in RA2-ENV-001 / RB-ENV; AC matrix, closure criteria, templates, custody, and tracker-update instructions complete; **no redesign, no new authority, no governance change** required |
| **(B) Execution-commencement authority** (may the operator begin Act 6 now?) | **NOT READY** | Fail-closed: mandatory preconditions are unmet (below) |

### 10.2 Precondition ledger (B) — fail-closed

| Precondition | Required | Current | Blocks commencement? |
|--------------|----------|:-------:|:--------------------:|
| DEP-2 / PRQ-1 — AD-0015 in force | yes | **IN FORCE** | no |
| DEP-1 / A0 — Operator assigned (PRQ-2) + VW-2 designated | yes | **NOT CONFIRMED** | **YES** |
| DEP-3 / S1 — OPF operationalized (AC-D1), baseline green (UPP-2), 0 core-dir (UPP-1) | yes | **NOT STARTED** | **YES** |
| DEP-4 / PRQ-3..6 — non-prod scope, secret refs, cost ceiling, audit sink | yes | **NOT CONFIRMED** | **YES** |
| DEP-5 / HAR-1..HAR-6 — AD-0009 approvals granted | yes | **NOT APPROVED (0/6)** | **YES** |
| DEP-6 — `infra/environments/{dev,int}/main.tf` present (not assumed) | yes | **NOT VERIFIED** | **YES** |

### 10.3 Determination

> # ACT 6 EXECUTION AUTHORITY: **NOT READY (to commence)** — EXECUTION PACKAGE **READY** · FAIL-CLOSED

**Justification.** The Act 6 Environment Evidence Execution Package (`UCOS-W1-ACT6-ENV-EXEC-001`) is a **complete
and READY execution artifact**: it defines the exact, ratified-grounded procedure (scope, inventory, validation,
templates, chain-of-custody, HAR requirements, full AC matrix, closure criteria, and tracker-update
instructions) with zero redesign or new authority. **However, execution may NOT commence.** Per the fail-closed
mandate and without assuming any environment state: the AD-0009 Executing Operator and VW-2 reviewer are
unassigned (A0 incomplete), the S1 OPF operationalization dependency (AC-D1) is not started, preconditions
PRQ-3..6 are unconfirmed, HAR-1..HAR-6 approvals are all NOT APPROVED (0/6), and the infra manifests are not
verified present. Any one of these holds Act 6 closed. **No environment is provisioned; no evidence is produced;
`EV-ENV-DEV`, `EV-ENV-INT`, and `EV-3` remain NOT PRODUCED; G12-1 remains OPEN.**

**Path to READY-TO-COMMENCE (all required):** (1) complete **A0** — assign Operator (PRQ-2) + designate VW-2;
(2) confirm **PRQ-3..6**; (3) complete **S1** with baseline green; (4) verify **DEP-6** manifests present;
(5) grant **HAR-1** (first step D-1). When all hold, the operator may begin at V-0.

---

## 11. GOVERNANCE / NON-MUTATION STATEMENT

This package produced **no** environment, provisioning, apply, command execution, or evidence; **provisioned
nothing**; **assumed no** environment state; **approved nothing**; **marked no** evidence complete; **released no**
lock; **enrolled no** invariant; **amended no** authority. It is an additive `.md` execution-procedure artifact.
`INV-1..13`, `INV-CORE-01..14`, `AUTH-012`, `AD-0014`, the Article IX generation lock, the Governance Baseline
1.0.0, `UCOS-ASR-NFR-001` floors, and all ratified architectures/ADRs are unchanged. `UCOS-CONSTRUCTION-BLOCKED`
stands except the AD-0015 evidence carve-out. The system's certification level is unchanged:
**CONDITIONALLY CERTIFIED**. Every step named is a future human-executed Approval-Required operation; the agent
executes none of them.

---

## 12. TRACEABILITY

- **Realizes:** `UCOS-W1-OEF-IAP-001` §2 CAP-OEF-7, §8.3 (G12-1 acceptance), §10 S2.
- **Renders (verbatim steps):** `UCOS-W1-OEF-EXEC-001` §4.1 RB-ENV → `UCOS-RA2-EXEC-001` RA2-ENV-001 (D-0..D-7, I-1..I-4).
- **HAR register:** `UCOS-W1-OEF-EXEC-001` §3.1 (HAR-1..HAR-6, HAR-STOP).
- **Templates:** `UCOS-W1-OEF-EXEC-001` §7 (T-ENV-DEV, T-ENV-INT, T-PROV, T-SEC, T-CHAIN).
- **Closure basis:** `UCOS-W1-OEF-EXEC-001` §8 (G1-1..G1-7 + G1-UPP); `OPS-EVIDENCE-MATRIX` §2 (G12-1 map; EV-3).
- **Tracker updated:** `UCOS-W1-OEF-TRACK-001` §1/§2/§3/§4/§5/§8/§10.
- **Security floors:** S1/S3/S4 (INV-2); mTLS STRICT/TLS 1.3 (INV-4); `UCOS-ASR-NFR-001` §9.
- **Tech ADRs:** `ADR-001/006/007` (neutral provider), `ADR-PE12` (observability, ACCEPTED).
- **Owner:** Implementation Program (human-operated execution); UCOS Authority Board (G12-1 closure determination).

**END `UCOS-W1-ACT6-ENV-EXEC-001` — ACT 6 ENVIRONMENT EVIDENCE EXECUTION PACKAGE · 9/9 OUTPUTS AUTHORED · PROCEDURE READY · EXECUTION NOT-YET-AUTHORIZED-TO-COMMENCE (A0 INCOMPLETE · S1 NOT STARTED · PRQ-3..6 UNCONFIRMED · HAR-1..6 NOT APPROVED 0/6 · MANIFESTS UNVERIFIED) · EV-ENV-DEV / EV-ENV-INT / EV-3 = NOT PRODUCED · G12-1 = OPEN · FAIL-CLOSED · APPEND-ONLY · NO PROVISIONING · NO COMMAND EXECUTION · NO EVIDENCE · NO GOVERNANCE CHANGE · SYSTEM REMAINS CONDITIONALLY CERTIFIED.**
