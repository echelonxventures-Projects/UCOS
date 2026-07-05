# packages/contracts-sdk/

**Reserved for generated contract clients/servers (contract-first SDK).**

> **Generated SDK code is EMPTY BY DESIGN.** Package foundation established by **WI-SEED.1 (Repository
> Foundation)**, Phase 11.3; standalone scaffold added by **WI-05**, Phase 11 (see below). No clients,
> servers, or DTOs are generated yet.

Rules (IC-2, contract-first):
- Contents are **generated from** the ratified contract catalog `specifications/contracts/UCOS-CONTRACT-CATALOG.md`
  (`UCOS-CONTRACT-CAT-001`) — never hand-authored.
- Hand-editing a published interface is prohibited; evolve the contract via governed versioning
  (`UCOS-SVC-POLICY-001`), then regenerate.
- PI-1 scope: SDK artifacts for `UCOS-API-CONTRACT-018` and `UCOS-API-CONTRACT-027` only (generated when
  the owning WPs commence).

## Foundation scaffold (Phase 11, WI-05)

Established the standalone package foundation — **no generated code yet**:

```
packages/contracts-sdk/
  package.json     # @ucos/contracts-sdk (private, UNLICENSED, source-only, zero runtime deps)
  tsconfig.json    # mirrors @ucos/platform-runtime (strict NodeNext, erasable TS, noEmit)
  src/index.ts     # public entry barrel (empty; awaits generated re-exports)
  generated/       # GENERATED OUTPUT ROOT (empty by design; written only by the generator)
  README.md        # this charter
```

The scaffold matches the repository conventions in `/CONTRACT-SDK-ANALYSIS.md`. Generation is designed in
`/CONTRACT-SDK-GENERATOR-ARCHITECTURE.md`; machine-readable catalog inputs live in `contracts/catalog/`.
Nothing under `src/` or `generated/` is hand-authored beyond this foundation.

**Traceability:** `UCOS-CONTRACT-CAT-001` · IC-2 · `UCOS-SVC-ARCH-001` · `UCOS-SVC-POLICY-001`.
