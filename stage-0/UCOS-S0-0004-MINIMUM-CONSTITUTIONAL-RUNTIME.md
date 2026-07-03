# UCOS-S0-0004 — Minimum Constitutional Runtime

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-S0-0004` |
| Program | **UCOS Stage 0 — Foundation Implementation Package** |
| Phase | S0-4 — Runtime Foundation |
| Mode | **IMPLEMENTATION PLANNING ONLY** — specifies the kernel/registry/configuration/validation services and boot sequence of the realized MCR. Runtime *implementation* is a prohibited activity under the standing lock; this is a specification of record. No code produced or modified. |
| Status | STAGE-0 SPECIFICATION (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EXEC-0001` (Commandments/Prohibitions, F-9); `UCOS-IR-0005` (MCR: 7 engines / 7 registries / 4 datastores / 5 gov components / 7 services); `UCOS-IR-0006` (boot/genesis); `UCOS-S0-0001/0002/0003` |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX lock **ACTIVE**; **`UCOS-CONSTRUCTION-BLOCKED` stands**. Deny-by-default, fail-closed; Evolution-only commit; determinism on the commit path. |

---

## 0. Purpose & standing

Specifies the **runtime foundation** — the Minimum Constitutional Runtime (MCR). The MCR is the smallest set of
running components such that **every binding invariant (INV-1..13) and every non-waivable control (S1/S3/S4/S6)
holds**, a governed construct can be **registered, described, identified, authorized, committed, propagated, and
audited**, and the system is **fail-closed** if any invariant cannot be proven (`UCOS-IR-0005 §1`). The MCR is
**realized of record** as the PI-2..PI-9 kernel at 269/269 (F-9; `UCOS-IR-0005 §9`). This artifact fixes the
runtime service topology and boot sequence; it does not author runtime code (Prohibition 1).

---

## 1. Kernel services (engines — `UCOS-IR-0005 §2`)

| # | Engine | Realizes | Binding basis | State |
|:-:|--------|----------|---------------|:-----:|
| E1 | **Execution Engine** (Meta-Core) | Deterministic execution; reflexive kernel; capability composition | RC-038/045; INV-CORE-09 | EXISTS |
| E2 | **Policy Evaluator** | Deny-by-default authorization; constraint logic | RC-014/060; INV-3 | EXISTS *(bounded vocab GAP-M3)* |
| E3 | **Evolution / Migration Engine** | Sole durable-mutation commit path; append-only migration | RC-013; INV-10; IP-14 | EXISTS |
| E4 | **Trust Evaluation Engine** | Runtime attribute-driven trust; clamping | RC-006 | EXISTS |
| E5 | **Federation Verifier** (Ed25519) | Signed cross-instance assertions; fail-closed partition | RC-007/035; INV-1 | EXISTS |
| E6 | **Audit Hash-Chain Engine** | Append-only tamper-evident record; offline verifiability | RC-037; S6; INV-10 | EXISTS *(6× dup GAP-C1)* |
| E7 | **Lifecycle Engine** | State/version/history transitions | RC-027; INV-10 | EXISTS *(4× GAP-M2)* |

Seven engines, all present of record. Caveats are convergence debt (Stage 6), not absence.

---

## 2. Registry services

The registry services expose the seven registries of record (`UCOS-S0-0002 §1`) at runtime: RegistryPort,
MetadataPort, ConfigurationPort, Identity Registry, Policy Registry, AUTH-012 Decision Ledger, Event Catalog.
Every registry read is **deny-by-default authorized** (RG-3); every registry write is **routed through the
Evolution Engine** (E3) and **audited** (E6) (RG-1/RG-5). No registry holds an independent commit path (N-5).

---

## 3. Configuration services

- **ConfigurationPort resolution:** hierarchical, behavior-as-data (IP-04; CF-1); binding derives from
  configuration records, never a code fork (Prohibition 3).
- **Technology neutrality:** concrete products resolve only within the neutral ADR contract (ADR-001..007);
  a product change is a new ADR version + A-4 Board act (CF-2), not a config-driven code path.
- **Secrets:** resolved **by reference** only; no secret material is materialized into configuration (INV-11; CB-4).

---

## 4. Validation services

Validation is the **fail-closed** enforcement layer: an operation proceeds only if every applicable invariant is
**provable**; inability to prove halts or denies (N-7; INV-3).

| # | Validator | Enforces | Basis |
|:-:|-----------|----------|-------|
| V1 | **Contract validator** | Contract-first, versioned, tolerant-reader boundaries | INV-1; V1 §V.1 |
| V2 | **AuthN/AuthZ validator** | Non-waivable S1; deny-by-default authorization | N-2; INV-3 |
| V3 | **Secrets validator** | No secret literals in code/config/records (S3) | INV-11 |
| V4 | **Data-protection validator** | Non-waivable S4 on every exposed boundary | N-2 |
| V5 | **Commit-path validator** | Durable mutation only via Evolution; no independent path | N-5 |
| V6 | **Append-only validator** | No destructive change; version monotonicity | N-3; INV-10 |
| V7 | **Determinism validator** | Non-deterministic computation quarantined behind the verifier gate | N-8; INV-CORE-09 |
| V8 | **Audit-continuity validator** | Hash-chain unbroken; offline-verifiable | S6; IC-3 |
| V9 | **Core-directory validator** | The five prohibited core dirs are never modified by a build | N-6; F-10 |

Any validator FALSE ⇒ operation **denied, not partially applied** (V.4 fail-closed).

---

## 5. Boot sequence (genesis bootstrap; deterministic, fail-closed)

The boot order mirrors the realized migration/dependency order (`UCOS-IR-0006`; `UCOS-S0-0003 §3`) and resolves
the three bootstrap cycles (CYC-1/2/3) via a **genesis seed** (`UCOS-IR-0006` Stage 3). Boot is **fail-closed**:
if any step cannot prove its invariants, boot halts and the runtime does not accept operations.

```
B0  Genesis seed          load genesis principal + genesis authority        (resolves CYC-1/2/3)
B1  Substrate up          Execution(E1) · RegistryPort · MetadataPort · ConfigurationPort   (FAB-EXEC/REG/META/CFG)
B2  Control plane up      Identity · Trust(E4) · Policy(E2) · Security(V2/V3/V4) · Authority (AUTH-012)   (deny-by-default armed)
B3  Governance core up    Evolution(E3, sole commit) · Audit(E6, hash-chain) · Lifecycle(E7) · Gates(QUAL/SEC/DOC/REL)
B4  Federation up         Federation Verifier(E5); local sovereignty; clamped trust; namespace isolation
B5  Core data up          Knowledge · Ontology · Memory; Ops ports (single-node)
B6  Validation armed      V1..V9 active; fail-closed posture confirmed
B7  Ready                 accept operations iff INV-1..13 + S1/S3/S4/S6 provable; else HALT
```

**Boot laws:** (a) no step Bn begins before B<n prove clean; (b) security validators (V2/V3/V4) arm at B2 —
**before any boundary is exposed** (N-2, "from first commit"); (c) the commit path (E3) is the **only** durable
write route from B3 onward (N-5); (d) failure at any step is fail-closed — the runtime **denies**, never
degrades to a permissive mode (N-7; Prohibition 6).

---

## 6. Runtime composition summary (`UCOS-IR-0005 §7`)

| Component class | Count | All present? | Caveat |
|-----------------|:-----:|:------------:|--------|
| Engines (kernel services) | 7 | ✅ | policy vocab (M3); audit 6× (C1); lifecycle 4× (M2) |
| Registries (registry services) | 7 | ✅ | AUTH-012 attestation pending (G0 AT-P0-1) |
| Datastores | 4 | ✅ | single-node/in-memory adapters (Stage-13 durability) |
| Governance components | 5 | ✅ | authority/audit convergence OPTIONAL (Stage 6) |
| Runtime services | 7 | ✅ | — |
| Validators | 9 | ✅ | fail-closed enforcement layer |

---

## 7. Determination

> **The Minimum Constitutional Runtime is fully specified and realized of record.** It comprises **7 kernel
> engines, 7 registry services, configuration services (behavior-as-data), 9 fail-closed validators, and a
> deterministic 8-step genesis boot sequence** that arms non-waivable security before any boundary is exposed and
> routes every durable mutation through the sole Evolution commit path. The composition matches `UCOS-IR-0005`
> exactly (7 engines / 7 registries / 4 datastores / 5 governance components / 7 services), with the three known
> convergence caveats (M2/M3/C1) dispositioned to Stage 6 and durability to Stage 13. **No MCR component is
> missing; no runtime code is authored here.** Runtime *operation under construction authorization* is gated on
> **G0 = PASS**.

## 8. Scope discipline
No code, schema, API, requirement, RC class, invariant, governance, or authority was produced or modified.
INV-1..13, `AUTH-012`, `AD-0014`, and the Article IX generation lock are unchanged;
**`UCOS-CONSTRUCTION-BLOCKED` stands.** Specification only.

## 9. Traceability
- **Consumes:** `UCOS-IR-0005` (MCR composition); `UCOS-IR-0006` (boot/genesis; CYC-1/2/3); `UCOS-EXEC-0001` (Commandments 5–8, Prohibitions, N-2/N-5/N-6/N-7/N-8); `UCOS-S0-0001/0002/0003`.
- **Refined by:** `UCOS-S0-0005` (API contracts), `UCOS-S0-0006` (boot/invariant tests), `UCOS-S0-0007` (build plan).
- **Owner:** UCOS Authority Board.

**END `UCOS-S0-0004` — MINIMUM CONSTITUTIONAL RUNTIME · 7 ENGINES · 7 REGISTRY SERVICES · CONFIG-AS-DATA · 9 FAIL-CLOSED VALIDATORS · 8-STEP GENESIS BOOT (SECURITY-FIRST, EVOLUTION-ONLY COMMIT) · MATCHES IR-0005 · 0 MISSING · OPERATION GATED ON G0 · PLANNING ONLY.**
