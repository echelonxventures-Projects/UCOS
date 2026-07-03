# MEM-AUTH-BOARD-002 — PI-9 Memory Fabric Board Evaluation (Security Posture · Federation Posture)

| Field | Value |
|-------|-------|
| Artifact | **MEM-AUTH-BOARD-002 — Board Evaluation: Security & Federation Posture** |
| Artifact ID | `UCOS-AUTH-BOARD-MEM-002` |
| Phase | PHASE 22 (PI-9 Memory Fabric — Authorization Board Review) |
| Version | 1.0.0 |
| Decision body | **UCOS Authority Board** (terminal authority; AUTH-009; Constitution Art. IX / Art. XII) |
| Mode | **BOARD REVIEW — EVALUATION ONLY** — evaluates and records findings; issues no authorization act |
| Inputs (read-only) | MEM-SEC-001, MEM-FED-001, MEM-AUD-001, MEM-THREAT-001; MEM-AUTH-REV-002 (threat re-review + consistency), MEM-AUTH-REV-003 (model validation §3/§4/§5); AUTH-008 (S1/S3/S4); AD-0018 (federation, reuse target); AD-0021 |
| Owner | UCOS Authority Board |

> Board evaluation stream 2 of 3. Independently examines the PI-9 **security posture** (S1/S3/S4, signed
> assertions, replay, no-synthesis recall) and **federation posture** (deny-by-default import, local
> sovereignty, namespace isolation, fail-closed partition) against the ratified controls. Records an
> accept/modify/reject finding for each. Produces no authorization act.

---

## 1. Security posture evaluation (MEM-SEC-001; validated in MEM-AUTH-REV-003 §4)

The Board examined whether the memory security model designs and enforces the non-waivable controls
(AUTH-008 S1/S3/S4) and closes the security-relevant threats without introducing new machinery.

| Control axis | Requirement (AUTH-008 / MEM-SEC-001) | Evidence | Board verdict |
|--------------|--------------------------------------|----------|:-------------:|
| **S1 — Deny-by-default recall & write** | No recall/write without authority; consolidation is an authority act | MEM-SEC-001 §3 (closes M8) | **PASS** |
| **S3 — Secrets/keys by reference only** | No inline secrets/keys in any memory tier | MEM-SEC-001 §2/§4/§10 | **PASS** |
| **S4 — Monotonic classification** | Classification tightens across tiers; recall projection withholds; federation ingest gate | MEM-SEC-001 §4 (closes M2) | **PASS** |
| Signed memory assertions | verify chain sig→authority→boundary→subject→expiry→nonce | MEM-SEC-001 §2/§5 | **PASS** |
| **No custom cryptography** | Reuse PI-5 Ed25519 (`assertions.ts`) | MEM-SEC-001 §5 | **PASS** (aligns C-3) |
| Replay protection | nonce + freshness + expiry | MEM-SEC-001 §6 (closes M7) | **PASS** |
| No-synthesis recall (anti-fabrication) | recall resolves only to verified stored records | MEM-SEC-001 §7 (closes M4) | **PASS** |
| Defense-in-depth placement | never bypasses ratified pipeline; kernel contract is final gate | MEM-SEC-001 §9 | **PASS** |

- **Board challenge — async-capture TOCTOU on classification.** Could the async capture path admit a
  lower-classification write before re-check? **No** — classification is bound in the signed assertion and
  re-verified at materialize and at recall (MEM-SEC-001 §4; MEM-ARCH-001 §4). Reviewer stream REV-003 §4
  reached the same conclusion. **Answered.**
- **Board challenge — does the deferred `ontologyRef` (C-1/CL-1) open a security surface?** **No** — while
  inert it invokes no ontology behavior and carries only a by-id reference; MEM-AUTH-REV-002 probe P-1
  confirmed no new active surface. **Answered.**

**Finding B2-1 (accept):** Non-waivable **S1/S3/S4 are designed and enforced**; signed assertions, replay
protection, and no-synthesis recall are present; **no custom cryptography** is introduced. Security posture:
**PASS.**

## 2. Threat ledger confirmation (MEM-THREAT-001 M1–M12; re-scored in MEM-AUTH-REV-002 §1)

The Board reviewed the independent re-scoring of the twelve-threat ledger.

| Residual band | Threats | Board acceptance |
|---------------|---------|:----------------:|
| Low | M1, M2, M3, M4, M7, M8, M9, M11 | **ACCEPT** |
| Low–Med (distributed/resource-inherent, bounded) | M5, M6, M10, M12 | **ACCEPT** (correctly not claimed Low) |
| High/High | — (none) | **CONFIRMED 0 residual High/High** |

- Reviewer probes P-1..P-4 (ontology surface, WM→audit/episodic classification leak, spoofed federated
  forget, PI-10/PI-11 consumer interaction) surfaced **no new High/High** threat (MEM-AUTH-REV-002 §2).

**Finding B2-2 (accept):** The M1–M12 ledger holds at **0 residual High/High**; the four Low–Med residuals
are distributed/resource-inherent and acceptably bounded by fail-closed + reconciliation + governor controls.

## 3. Federation posture evaluation (MEM-FED-001; validated in MEM-AUTH-REV-003 §3)

The Board examined whether federated memory (tier T6) is safe by construction and reuses the ratified
AD-0018 federation primitives without altering them.

| Federation axis | Requirement (MEM-FED-001) | Evidence | Board verdict |
|-----------------|---------------------------|----------|:-------------:|
| Reuse-only of PI-5 federation | no new machinery, no behavior change; thin `federated-memory-guard` only | MEM-FED-001 §2 + hard constraint | **PASS** (aligns C-3) |
| Deny-by-default import | in-boundary authorities only | MEM-FED-001 §3; MEM-GOV C10 `defaultEffect: deny` | **PASS** |
| Local sovereignty (local-shadows-foreign) | foreign never overrides local `active`; supersession needs local ratification | MFV-2 / MFV-5; §4 | **PASS** |
| Namespace isolation | `federation:*:memory:*` disjoint from `memory:*` | MFV-3; MEM-ARCH-001 §2 | **PASS** |
| Verified-before-stored | crypto verify + boundary check before store | MFV-4; MEM-SEC-001 §8 | **PASS** |
| Fail-closed on partition | bounded staleness + hard expiry | MEM-FED-001 §3 (closes M6) | **PASS** |
| Tier federation policy | LTM/SEM federatable (classification-gated); WM/STM node-local; EPI export-only | MEM-FED-001 §3 | **PASS** |
| Classification honored on ingest (S4) | monotonic gate at federation boundary | MFV-6 | **PASS** |

- **Board challenge — can a foreign forget/supersede erase a local memory or its audit?** **No** — foreign
  influence is deny-only; local supersession requires local ratification (MFV-2/§4); the append-only audit
  chain is out of deletion scope (MEM-AUD-001 §5). REV-002 probe P-3 and REV-003 §3/§5 concur. **Answered.**
- **Board challenge — does reuse of AD-0018 primitives modify federation behavior?** **No** — MEM-FED-001 §2
  states reuse-only with an explicit "no modification of federation behavior" hard constraint; this is bound
  by condition **C-3** in the authorization act. **Answered.**

**Finding B2-3 (accept):** Federated memory is **deny-by-default, namespace-isolated, locally sovereign,
verified-before-stored, and fail-closed on partition**, reusing AD-0018 primitives without behavior change.
Federation posture: **PASS.**

## 4. Audit posture (supporting; MEM-AUD-001; validated in MEM-AUTH-REV-003 §5)

The Board notes that the audit model reuses the hash-chained `FederatedAuditLog` via `AuditSink` (no new
engine), audits recall **denials** (no silent deny), is tamper-evident with signed checkpoints, provides
within- and cross-node reconciliation (fail-closed on divergence, closes M10), and implements
**audit-preserving forgetting** (value unrecallable; audit fact retained). This underpins both the security
and federation findings above.

**Finding B2-4 (accept):** Audit posture is **sound** and reinforces S6-class tamper-evidence and the
two-sided forgetting guard (M9).

## 5. Stream determination

> The Board finds the PI-9 Memory Fabric **security posture PASS** (non-waivable S1/S3/S4 designed and
> enforced; signed assertions; replay protection; no-synthesis recall; no custom cryptography), the
> **threat ledger confirmed at 0 residual High/High**, the **federation posture PASS** (deny-by-default,
> locally sovereign, namespace-isolated, fail-closed, reuse-only of AD-0018), and the **audit posture
> sound**. **0 blocking findings.** All Board challenges were answered by an explicit designed control.

**Recommendation to MEM-AUTH-BOARD-003:** proceed toward **AUTHORIZE WITH RESTRICTIONS** on the
security/federation axis, with **C-3** (reuse-only, no custom cryptography) and **C-4** (Approval-Required
federated-memory/retention/forgetting acts) binding.

## 6. Traceability
- **Refines:** MEM-SEC-001, MEM-FED-001, MEM-AUD-001, MEM-THREAT-001; MEM-AUTH-REV-002 (§1/§2/§3),
  MEM-AUTH-REV-003 (§3/§4/§5); AUTH-008 (S1/S3/S4); AD-0018.
- **Consumed by:** MEM-AUTH-BOARD-003 (consolidated determination); AD-0023 (on adoption).
- **Owner:** UCOS Authority Board.

**END MEM-AUTH-BOARD-002 — SECURITY PASS (S1/S3/S4 ENFORCED) · 0 RESIDUAL HIGH/HIGH · FEDERATION PASS · NO AUTHORIZATION ACT.**
