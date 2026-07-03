# MEM-AUTH-REV-004 — PI-9 Memory Sequencing & Compliance Determination

| Field | Value |
|-------|-------|
| Artifact | **MEM-AUTH-REV-004 — Memory Sequencing & Compliance Determination** |
| Phase | PHASE 18.1 (PI-9 Memory Fabric — Authorization Review) |
| Version | 1.0.0 |
| Mode | INDEPENDENT REVIEW ONLY — audit/validate/challenge; no design change, no implementation, no authorization |
| Inputs (read-only) | MEM-AUTH-REV-001/002/003; MEM-ARCH-001, MEM-GOV-001/002; AD-0016..0020; ONTO-READINESS-001; AUTH-008/009; Constitution Art. IX/XII; AD-0009; AD-0014 |
| Owner | UCOS Authority Board (review) |

> Review stream 4 of 4. Answers the three sequencing questions (authorize immediately? PI-8 first? parallel?)
> and confirms compliance with Article IX, AD-0009 (Approval-Required acts), the non-waivable S-controls,
> the prohibited-core-dir constraint, and additive/parallel-safety. Produces a recommendation, not an
> authorization.

---

## 1. The three sequencing questions

### Q1 — Can PI-9 be authorized immediately?
**YES (with conditions).** Memory's three **HARD** dependencies — Federation (AD-0018), Evolution
(AD-0019), Knowledge (AD-0020) — are all **implemented and ratified** (MEM-AUTH-REV-001 §2/§3). Threat
posture is **0 residual High/High** (REV-002) and all five models **PASS** (REV-003). Nothing in the
implemented stack blocks a scoped PI-9 authorization act. The only open item is the **enrichment-class**
Semantic↔Ontology reference, which is handled by a condition (C-1), not a blocker.

### Q2 — Must PI-8 (Ontology) be implemented first?
**NO.** PI-8 Ontology is an **ENRICHMENT** dependency of the **Semantic tier only** (MEM-AUTH-REV-001 §2.4).
- Five of six tiers (Working, Short-Term, Long-Term, Episodic, Federated) have **no** ontology dependency.
- The Semantic tier's **factual backing and governed ratification** run through **Knowledge (PI-7,
  implemented)**, not Ontology; ontology adds typing *on top*, carried as an optional `ontologyRef`
  (by-id, provenance-by-convention) that stays **inert** until PI-8 is implemented.
- Therefore PI-8 is **not** a prerequisite. Deep Semantic↔Ontology typing is a **later, additive
  integration** once PI-8 is authorized/implemented — no rework of PI-9 required (bounded adapter seam).

### Q3 — Can PI-9 construction proceed in parallel (with PI-8)?
**YES.** Parallel construction of PI-8 (`src/control/ontology/*`) and PI-9 (`src/control/memory/*`) is
**safe** because they are provably non-interfering:

| Isolation axis | PI-8 Ontology | PI-9 Memory | Interference? |
|----------------|---------------|-------------|:-------------:|
| Source subtree | `src/control/ontology/*` | `src/control/memory/*` | **None** (disjoint) |
| Metadata keyspace | `ontology:*` / `ontology:federation:*` | `memory:*` / `federation:*:memory:*` | **None** (disjoint) |
| Prohibited core dirs | untouched | untouched | **None** |
| Federation/Evolution/Knowledge behavior | reuse-only | reuse-only | **None** |
| Coupling point | — | optional `ontologyRef` (by-id, inert until PI-8) | **One-way, deferred** |
| Test baseline | additive over 185/185 | additive over 185/185 | **None** (separate suites) |

- The single coupling point is a **one-way, deferred** data reference from Memory→Ontology; it does not
  require PI-8 code to exist for PI-9 to build/test. No shared mutable surface exists.

## 2. Compliance verification

| Control | Status | Evidence |
|---------|:------:|----------|
| **Article IX** — this review authorizes nothing; construction remains locked pending a separate AD act | **PASS** | Review is a recommendation; §4 |
| **AD-0009** — concrete memory acts (register authority, issue/revoke certification/ratification, admit federated memory authority, import foreign memory, change retention class / legal-hold, execute forgetting) remain Approval-Required | **PASS** | MEM-GOV-001 §4; MEM-GOV-002 §2.3 |
| **Non-waivable S1/S3/S4** designed & enforced across tiers + federation | **PASS** | REV-003 §4; MEM-SEC-001 §10; MEM-FED-001 §6 |
| **Prohibited-core-dir** (`meta-core`/`registry-runtime`/`metadata-runtime`/`configuration-runtime`/`contracts`) untouched | **PASS** | MEM-ARCH-001 §5 proof |
| **Reuse-only** of federation crypto + evolution governor + knowledge (no behavior change; no custom crypto) | **PASS** | MEM-SEC-001 §5; MEM-FED-001 §2; MEM-AUD-001 §2 |
| **Additive** — existing 185/185 tests remain green; memory tests additive | **PASS** | MEM-ARCH-001 §6 |
| **AD-0014 (Ω∞ deferral)** — Memory is a governed fabric, not an existential/self-directed memory | **PASS** | MEM-GOV-001 header/§1 |
| **SoD non-waivable** — Consolidation ≠ Certification ≠ Ratification | **PASS** | MEM-GOV-001 §4 |

**8/8 compliance checks PASS.**

## 3. Recommended authorization conditions (for the Board's AD act)

- **C-1 (Ontology binding).** Formalize the Semantic↔Ontology coupling as an **optional, read-only,
  by-reference** `ontologyRef` and confine any ontology integration to a bounded adapter; it remains
  **inert** until PI-8 Ontology is authorized/implemented. (Closes F-DEP-1 / F-CON-1.)
- **C-2 (Additive & isolated).** Construction confined to new `src/control/memory/*` + additive tests;
  **zero** prohibited-core-dir change; existing 185/185 tests remain green.
- **C-3 (Reuse-only).** No modification of federation/evolution/knowledge behavior; no custom cryptography.
- **C-4 (Approval-Required acts).** All concrete memory authority/certification/ratification/federation/
  retention/forgetting acts remain AD-0009 Approval-Required at execution time.
- **C-5 (Ω∞ boundary).** No self-directed/autonomous memory; AD-0014 stands.

## 4. Determination (this stream)

> **Q1 = YES (with conditions C-1..C-5); Q2 = NO (PI-8 is not a prerequisite); Q3 = YES (parallel
> construction is safe — disjoint subtree, disjoint keyspace, one-way deferred coupling).** All **8/8**
> compliance checks PASS. This review **recommends** authorization; it does **not** release the Article IX
> lock — a separate scoped Authority Board act (analogous to AD-0018/0019/0020) is required. Article IX
> remains ACTIVE and AD-0014 stands.

## 5. Traceability
- **Refines:** MEM-AUTH-REV-001/002/003; MEM-ARCH-001, MEM-GOV-001/002; AD-0016..0020; AUTH-008/009;
  Constitution Art. IX/XII; AD-0009; AD-0014.
- **Consumed by:** MEM-AUTH-001 (consolidated recommendation).
- **Owner:** UCOS Authority Board (review).

**END MEM-AUTH-REV-004 — Q1 YES(cond) · Q2 NO · Q3 YES(parallel) · 8/8 COMPLIANCE PASS · NO IMPLEMENTATION AUTHORIZED.**
