# UCOS-S0-0001 — Repository Blueprint

| Field | Value |
|-------|-------|
| Artifact ID | `UCOS-S0-0001` |
| Program | **UCOS Stage 0 — Foundation Implementation Package** |
| Phase | S0-1 — Repository Architecture |
| Mode | **IMPLEMENTATION PLANNING ONLY** — specifies the repository architecture of the already-realized Minimum Constitutional Runtime. No source code, schema, API, requirement, RC class, invariant, governance, or authorization produced or modified. Construction remains reserved to the Authority Board. |
| Status | STAGE-0 SPECIFICATION (v1.0.0) |
| Date | 2026-07-03 |
| Operates under | `UCOS-EXEC-0001` (F-1..F-10, N-6, Part III/IV); `UCOS-EP-0001` (WBS); `UCOS-IR-0003` (fabric classes); `UCOS-IR-0005` (MCR composition); `UCOS-RA-0006` (Stage exits) |
| Governing constraints | Corpus FROZEN. INV-1..13 unchanged; `AD-0014` intact; Article IX generation lock **ACTIVE**; **`UCOS-CONSTRUCTION-BLOCKED` stands**. Additive-only; the five prohibited substrate core directories (F-10) are never modified by any downstream build. |

---

## 0. Purpose & standing

This blueprint renders the **repository architecture** for the UCOS foundation runtime. The foundation runtime is
the **Minimum Constitutional Runtime (MCR)** — the existence floor of **12 FOUNDATIONAL + 7 CORE fabrics**
(`UCOS-IR-0003`), realized of record as the PI-2..PI-9 control kernel at the 269/269 baseline (`UCOS-IR-0005 §9`).
This document **specifies structure and boundaries only**; it does not author, generate, or modify code. Under the
Article IX generation lock and the standing construction block, source-code creation is a **prohibited activity**
(`UCOS-CONSTRUCTION-BLOCKED §3`; `UCOS-EXEC-0001` Prohibition 1); this artifact is a permitted **design/planning**
instrument (`UCOS-CONSTRUCTION-BLOCKED §4`).

> **Reconciliation of scope.** The Stage-0 execution package frames "foundation runtime construction." Per the
> frozen corpus, the foundation runtime is **already realized** and the corpus's own **Stage 0 is a no-build GATE
> (G0)** (`UCOS-EXEC-0001` Part IV; `UCOS-RA-0006`). This blueprint therefore documents the *target repository
> architecture of record* — the layout the realized MCR occupies and that any authorized forward build must
> preserve additively — without authorizing or performing construction.

---

## 1. Repository structure (target-of-record)

The repository is a single governed monorepo. The **five prohibited substrate core directories** (F-10) are the
correctness-complete kernel; every fabric and service is **additive** to them and **never modifies** them (N-6).

```
ucos/
├── src/                                  # CONSTITUTIONAL SUBSTRATE (F-10 — additive-only)
│   ├── meta-core/                        # [PROHIBITED-CORE] FAB-EXEC — deterministic execution / reflexive kernel / composition (RC-045/038; INV-CORE-09)
│   ├── registry-runtime/                 # [PROHIBITED-CORE] FAB-REG — RegistryPort; id@version addressability (RC-024/041; PEP-001)
│   ├── metadata-runtime/                 # [PROHIBITED-CORE] FAB-META — MetadataPort; open-class descriptions (RC-024; PEP-002)
│   ├── configuration-runtime/            # [PROHIBITED-CORE] FAB-CFG — ConfigurationPort; behavior-as-data (IP-04; PEP-003)
│   └── contracts/                        # [PROHIBITED-CORE] versioned contract surface (85 ratified; INV-1)
│
│   # ── L1 FOUNDATIONAL fabrics (existence floor; realized PI-2..PI-6) ──
│   ├── identity/                         # FAB-IDENT — principals, open `kind` (RC-005/023)
│   ├── authority/                        # FAB-AUTH — Authority Hierarchy + AUTH-012 Decision Ledger (RC-002/033) [PARTIAL: GAP-M1]
│   ├── governance/                       # FAB-GOV — gates QUAL/SEC/DOC/REL; Approval-By-Exception (RC-004)
│   ├── policy/                           # FAB-POL — deny-by-default policy evaluation (RC-060/014) [PARTIAL: GAP-M3]
│   ├── evolution/                        # FAB-EVO — sole durable-mutation commit path (RC-013; INV-10)
│   ├── event/                            # FAB-EVT — event catalog; at-least-once tolerant propagation (RC-028; INV-6)
│   ├── state/                            # FAB-STATE — lifecycle/version/history (RC-027) [PARTIAL: GAP-M2]
│   └── audit/                            # FAB-AUDIT — append-only hash-chained record (RC-037; S6) [PARTIAL: GAP-C1]
│
│   # ── L2 CORE fabrics (constitutional completeness; realized PI-5/7/8/9 + ops) ──
│   ├── trust/                            # FAB-TRUST — attribute-driven trust evaluation / clamping (RC-006)
│   ├── security/                         # FAB-SEC — non-waivable S1/S3/S4/S6 controls (RC-014; INV-2/3/4/11)
│   ├── federation/                       # FAB-FED — Ed25519 signed cross-instance assertions (RC-007/035)
│   ├── knowledge/                        # FAB-KNOW — versioned governed knowledge (RC-008; PI-7)
│   ├── ontology/                         # FAB-ONTO — shared typing substrate (RC-010/022; PI-8)
│   ├── memory/                           # FAB-MEM — tiered memory primitive (RC-009; PI-9)
│   └── ops/                              # FAB-OPS — platform-engineering ports; tech-neutral (RC-015/042) [single-node]
│
├── contracts/                            # externalized contract catalog (mirrors src/contracts; ADR-001..007 neutral)
├── config/                               # hierarchical configuration RECORDS (data, not code — CF-1; IP-04)
├── registries/                           # seed/reference registry RECORDS (see UCOS-S0-0002)
├── migrations/                           # ordered, append-only, migration-only DDL (see UCOS-S0-0003) — post-G0
├── tests/                                # acceptance/integrity/invariant/boot/registry suites (see UCOS-S0-0006)
├── apps/                                 # composition/boot entrypoints (no domain logic)
├── packages/                             # shared, contract-first libraries
├── infra/                                # tech-neutral infra descriptors (no vendor binding pre-A-7)
└── docs/                                 # governed documentation / traceability
```

> **Note on realization.** `src/*` fabrics above are **realized of record** (`UCOS-IR-0005 §9`; `UCOS-EP-0001`
> L1/L2). This blueprint fixes their *boundaries*; it does not re-author them (that would be REDESIGN, prohibited
> by `UCOS-EXEC-0001` Commandment 4 / Part I §1).

---

## 2. Domain boundaries

| Boundary rule | Statement | Basis |
|---------------|-----------|-------|
| DB-1 Single system-of-record | Each domain owns exactly one authoritative store; no second SoR per domain | INV-5; N-4 |
| DB-2 No shared mutable model | Domains never share a mutable model; integration is contract-only | INV-1; Prohibition 4 |
| DB-3 Contract-first boundary | A domain is reachable only through a published, versioned contract | INV-1; Commandment 2 |
| DB-4 Commit through Evolution | A domain never commits durable state except via FAB-EVO | N-5; Commandment 5 |
| DB-5 Deny-by-default exposure | Every exposed domain boundary enforces S1/S3/S4, deny-by-default, fail-closed | N-2; N-7 |

Domain modules (business capabilities CAP-01..08) are **not part of the foundation runtime**; they are Wave-3+
additive services atop the L1/L2 substrate (`UCOS-EP-0001 §3`) and are out of Stage-0 scope.

---

## 3. Module boundaries

| Rule | Statement | Basis |
|------|-----------|-------|
| MB-1 Additive-only | New modules are added; the five prohibited core directories are never modified | F-10; N-6 |
| MB-2 Acyclic composition | Module dependencies form a DAG; composition is acyclic (five extension mechanisms) | EX-4; `UCOS-IR-0004` |
| MB-3 Port/adapter separation | State lives behind ports (RegistryPort/MetadataPort/ConfigurationPort/…); adapters are swappable within the neutral ADR | INV-7; CF-2 |
| MB-4 No hard-coded ceilings | No module imposes an architectural ceiling on domains/services/events/etc. | INV-13; C-EX1..5 |
| MB-5 Determinism on commit | Non-deterministic computation is quarantined behind the verifier gate; never on the commit path | N-8; INV-CORE-09 |

---

## 4. Registry boundaries

The foundation exposes governed registries as the **only** mechanism by which constructs become addressable,
described, configured, identified, and authorized. Registry content is **data**, not code (IP-04). The full
registry set is specified in `UCOS-S0-0002`.

| Registry surface | Owning fabric | Boundary rule |
|------------------|---------------|---------------|
| RegistryPort (constructs id@version) | FAB-REG (`src/registry-runtime`) | Read-open, write-through-Evolution only |
| MetadataPort (descriptions/types) | FAB-META (`src/metadata-runtime`) | Open-class; additive records |
| ConfigurationPort (behavior-as-data) | FAB-CFG (`src/configuration-runtime`) | Hierarchical resolution; no code fork |
| Identity Registry (principals) | FAB-IDENT (`identity/`) | Open `kind`; authz precondition |
| Policy Registry (`policy:*`) | FAB-POL (`policy/`) | Deny-by-default; registry/metadata-extensible predicates |
| AUTH-012 Decision Ledger | FAB-AUTH (`authority/`) | Append-only; Board-terminal writes |
| Event Catalog (73 PEV/17 PED) | FAB-EVT (`event/`) | Additive event classes |

---

## 5. Configuration boundaries

| Rule | Statement | Basis |
|------|-----------|-------|
| CB-1 Behavior-as-data | All variability (feature flags, behavior, tiers) is expressed as configuration records | CF-1; IP-04 |
| CB-2 No code fork for variance | Variability never enters as a code branch/fork | CF-1; Prohibition 3 |
| CB-3 Neutral technology contract | Concrete products bind only within the neutral ADR contract (ADR-001..007); change = new ADR + A-4 | CF-2 |
| CB-4 Secrets by reference | No secret material in code, config, or artifacts; reference only | INV-11; Prohibition 5 |
| CB-5 Hierarchical resolution | Configuration resolves hierarchically through ConfigurationPort | CF-1; PEP-003 |

---

## 6. Determination

> **The repository architecture of the UCOS foundation runtime is fully specified and is realized of record.** It
> comprises the **five prohibited substrate core directories** (F-10, additive-only) plus the **12 FOUNDATIONAL +
> 7 CORE fabric modules** (`UCOS-IR-0003`), organized under strict domain/module/registry/configuration
> boundaries that enforce single-SoR (INV-5), contract-first integration (INV-1), Evolution-only commit (N-5),
> deny-by-default security (N-2), and additive-only evolution (N-6). No new fabric, module, or directory is
> invented; every element traces to `UCOS-EP-0001` and `UCOS-IR-0003/0005`. **Construction of any element remains
> gated on G0 = PASS.**

## 7. Scope discipline
No source code, schema, API, requirement, RC class, invariant, governance, or authority was produced or modified.
INV-1..13, `AUTH-012`, `AD-0014`, and the Article IX generation lock are unchanged; **`UCOS-CONSTRUCTION-BLOCKED`
stands.** Specification only.

## 8. Traceability
- **Consumes:** `UCOS-EXEC-0001` (F-1..F-10, N-6); `UCOS-EP-0001` (WBS L1/L2); `UCOS-IR-0003` (fabric classes); `UCOS-IR-0005` (MCR composition); `UCOS-RA-0006` (Stage 1–5 exits of record).
- **Refined by:** `UCOS-S0-0002` (registries), `UCOS-S0-0003` (database), `UCOS-S0-0004` (runtime), `UCOS-S0-0007` (build plan).
- **Owner:** UCOS Authority Board.

**END `UCOS-S0-0001` — REPOSITORY BLUEPRINT · 5 PROHIBITED-CORE DIRS (ADDITIVE-ONLY) · 12 FOUNDATIONAL + 7 CORE FABRIC MODULES · DOMAIN/MODULE/REGISTRY/CONFIG BOUNDARIES · 0 REDESIGN · 0 CORE-DIR MODIFICATION · CONSTRUCTION GATED ON G0 · PLANNING ONLY.**
