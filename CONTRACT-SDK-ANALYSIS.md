# CONTRACT-SDK-ANALYSIS

| Field | Value |
|-------|-------|
| Artifact | **Contract-SDK Foundation Discovery — Package Analysis** |
| Work Item | **PHASE 11 — WI-05** (Contract-SDK Foundation) |
| Branch | `phase-11-contracts-sdk` |
| Frozen Baseline | `56a32d3` |
| Tag | `ucost-baseline-green-284` |
| Validation Baseline | Typecheck **PASS** · **284/284** tests **PASS** |
| Mode | **DISCOVERY / ADDITIVE ONLY** — no runtime, contract-semantic, or catalog changes |
| Date | 2026-07-03 |
| Traceability | `UCOS-CONTRACT-CAT-001` · `UCOS-SVC-ARCH-001` · IC-2 · `AD-0016` · `UCOS-PLAT-ADR-001` |

> **Scope note.** This document reports **observed facts** about the repository as it exists at the frozen
> baseline. No fact below is inferred or assumed; each is anchored to an inspected file. Where the repository
> does not define something, that absence is reported explicitly rather than filled with an assumption.

---

## 1. Inspected Inputs

| # | Path | Purpose |
|---|------|---------|
| 1 | `packages/platform-runtime/package.json` | Package + build + publish + dependency model |
| 2 | `packages/platform-runtime/tsconfig.json` | TypeScript configuration model |
| 3 | `packages/platform-runtime/pnpm-lock.yaml` | Workspace / lockfile model |
| 4 | `packages/platform-runtime/README.md` | Runtime scope + governance |
| 5 | `packages/contracts-sdk/README.md` | Reserved package charter (generated-only) |
| 6 | `packages/README.md` | `packages/` directory charter |
| 7 | `packages/platform-runtime/src/contracts/types.ts` | Constitutional runtime type system (FACT 2) |
| 8 | `specifications/contracts/UCOS-CONTRACT-CATALOG.md` | `UCOS-CONTRACT-CAT-001` (FACT 3 / FACT 4) |
| 9 | repository root listing | Workspace-config discovery |

---

## 2. Workspace Model

**Observed:** UCOS is a **polyrepo-style set of standalone packages**, *not* a linked monorepo workspace.

| Evidence | Finding |
|----------|---------|
| No `pnpm-workspace.yaml` anywhere in the tree | There is **no workspace aggregation**. |
| No root `package.json` (root `ls *.json` → no matches) | There is **no root package** and no root-level scripts. |
| Only `packages/platform-runtime/` has `package.json` + `pnpm-lock.yaml` + `node_modules/` | Each package installs and validates **independently**, from **its own directory**. |
| `packages/contracts-sdk/` currently contains **only** `README.md` | The package is **reserved / structure-only** (per WI-SEED.1, Phase 11.3). |

**Consequence for WI-05:** a new `packages/contracts-sdk/` package is **isolated** from `@ucos/platform-runtime`.
Because `platform-runtime` typecheck and tests are scoped to that package's own directories (see §4), a standalone
sibling package **cannot** alter the `platform-runtime` validation surface. This is the structural basis for the
additive-only guarantee.

---

## 3. Build Model

**Observed:** **No compilation / no emit.** TypeScript is executed directly as source.

| Evidence | Finding |
|----------|---------|
| `tsconfig.json` → `"noEmit": true` | `tsc` is a **type checker only**; it produces no JS. |
| `package.json` `exports` map to `./src/index.ts` and `./src/bootstrap.ts` (`.ts`, not `.js`) | Consumers import **TypeScript source directly**. |
| `bin` → `./bin/ucos-substrate.ts` | Executables are `.ts`, run under Node. |
| `README.md`: "No install is required to run or test — Node ≥ 23.6 strips TypeScript types natively." | Runtime = **Node native type stripping** (type-only erasure). |
| `engines.node`: `">=23.6.0"` | Native TS execution requires Node ≥ 23.6. |
| `tsconfig`: `"erasableSyntaxOnly": true`, `"verbatimModuleSyntax": true`, `"allowImportingTsExtensions": true` | Source is constrained to **erasable** TS syntax so Node can strip types with no transform; `.ts` import specifiers are used explicitly. |

**Consequence for WI-05:** any generated SDK must be **erasable-syntax TypeScript** with **explicit `.ts` import
specifiers**, consumable as source with no build step. Enums, namespaces, parameter properties, and other
non-erasable constructs are **prohibited** by `erasableSyntaxOnly`.

---

## 4. TypeScript Configuration Model

Verbatim from `packages/platform-runtime/tsconfig.json`:

| Option | Value | Implication for generated SDK |
|--------|-------|-------------------------------|
| `target` | `ES2022` | Emit-target parity (though no emit). |
| `module` / `moduleResolution` | `NodeNext` | ESM with Node resolution; `"type": "module"` in `package.json`. |
| `lib` | `["ES2023"]` | No DOM lib; server/runtime only. |
| `strict` | `true` | Generated code must be fully type-sound under strict mode. |
| `noUncheckedIndexedAccess` | `true` | Index access yields `T | undefined`; generated accessors must guard. |
| `noImplicitOverride` | `true` | `override` keyword required where applicable. |
| `verbatimModuleSyntax` | `true` | Must use `import type` / `export type` for type-only symbols. |
| `allowImportingTsExtensions` | `true` | Imports must reference `.ts` extensions. |
| `erasableSyntaxOnly` | `true` | Only type-erasable syntax permitted (no `enum`, no `namespace`, no param props). |
| `noEmit` | `true` | Type-check only. |
| `skipLibCheck` | `true` | Declaration files of deps are not deep-checked. |
| `types` | `["node"]` | Only `@types/node` ambient types. |
| `include` | `src/**`, `examples/**`, `test/**`, `bin/**` | **Scoped to this package's own directories.** |

**Key isolation fact:** the `include` globs are **relative to the `platform-runtime` package** and do not reach
outside it. Therefore a new `packages/contracts-sdk/tsconfig.json` is required for the SDK to be type-checked, and
it will be checked **only** when `tsc` is invoked from within `contracts-sdk`.

---

## 5. Package Publishing Model

**Observed:** **Not published.** In-repo source consumption.

| Evidence | Finding |
|----------|---------|
| `package.json` → `"private": true` | Never published to a registry. |
| `package.json` → `"license": "UNLICENSED"` | Not distributed externally. |
| `exports` map to `.ts` source | No `dist/`, no `main`/`types` declaration outputs. |
| `version`: `0.1.0` | Semantic version tracked in-repo; distribution is by source, not tarball. |

**Consequence for WI-05:** `contracts-sdk` should mirror this: `private: true`, `UNLICENSED`, source `exports`.
Versioning of the *interface* is governed by the contract (`UCOS-SVC-POLICY-001`), not by npm publication.

---

## 6. Dependency Model

**Observed:** **Zero runtime dependencies.** Dev-only toolchain.

| Evidence | Finding |
|----------|---------|
| `package.json` has **no** `dependencies` block | No third-party runtime deps; substrate is self-contained. |
| `devDependencies`: `@types/node@22.20.0`, `typescript@5.9.3` | Toolchain pinned to **exact** versions (no ranges). |
| `pnpm-lock.yaml` `lockfileVersion: '9.0'`, importer `.` only | Single-importer lockfile; per-package install. |

**Consequence for WI-05:** the generated SDK must have **no runtime dependencies** (validators generated as plain
erasable TS against the catalog, not pulling a schema library). Dev toolchain, if any, pins **exact** versions
matching the substrate (`typescript@5.9.3`, `@types/node@22.20.0`).

---

## 7. FACT 2 — Runtime Types vs. Generated SDK Artifacts (Boundary Confirmation)

`packages/platform-runtime/src/contracts/types.ts` was inspected in full. It defines the **constitutional runtime
substrate primitives**:

`SemVer`, `VersionRange`, `JsonSchema`, `ProviderRef`, `ContractRef`, `CapabilityDependency`,
`CapabilityDescriptor`, `ContractOperation`, `ContractDescriptor`, `Descriptor`, `LifecycleState`, `Operation`,
`CapabilityInstance`, `CapabilityContext`, `CapabilityFactory`, `ValidationIssue`, `ValidationResult`.

These are **descriptor + runtime-contract shapes** consumed by the Meta-Core loaders, resolver, composition, and
execution engines (realizing `UCOS-PEA-004/005/006`, authorized by `AD-0016`). They are **substrate primitives**,
**not** generated service-SDK artifacts for `UCOS-API-CONTRACT-*`.

**Determination:** `types.ts` is **out of scope** for `contracts-sdk` and **MUST NOT be modified**. The generated
service SDK is a **separate concern** (service request/response DTOs + clients/stubs derived from the *service*
contract catalog). Confusing the two would violate NON-NEGOTIABLE RULES 1–3.

---

## 8. `contracts-sdk` Charter (from its README)

- Contents are **generated from** `UCOS-CONTRACT-CAT-001` — **never hand-authored**.
- Hand-editing a published interface is **prohibited**; evolve the contract via governed versioning
  (`UCOS-SVC-POLICY-001`), then **regenerate**.
- **PI-1 scope:** SDK artifacts for **`UCOS-API-CONTRACT-018`** and **`UCOS-API-CONTRACT-027`** only, generated
  when the owning WPs commence.
- Traceability: `UCOS-CONTRACT-CAT-001` · IC-2 · `UCOS-SVC-ARCH-001`.

This charter is **consistent** with the observed build/publish model and constrains WI-05 to **foundation
scaffold + generator design + machine-readable catalog inventory** — **no generated code yet**.

---

## 9. Compatibility Determination for the Scaffold

| Requirement | Compatible? | Basis |
|-------------|:-----------:|-------|
| New standalone package under `packages/` | ✅ | Matches per-package standalone model (§2). |
| Own `package.json` (`private`, `UNLICENSED`, source `exports`) | ✅ | Mirrors `platform-runtime` publish model (§5). |
| Own `tsconfig.json` mirroring substrate options | ✅ | Required because `include` is package-scoped (§4). |
| `src/` + `generated/` directories, empty of code | ✅ | Charter = structure only, generated-only (§8). |
| Zero effect on `platform-runtime` 284 tests / typecheck | ✅ | Package isolation (§2, §4). |
| No modification to `types.ts` or any runtime source | ✅ | FACT 2 boundary (§7). |
| No modification to `UCOS-CONTRACT-CAT-001` | ✅ | Catalog is read-only input. |

**Determination: STRUCTURALLY COMPATIBLE.** The scaffold in TASK 4 may proceed as a standalone, source-only,
dependency-free package that mirrors `@ucos/platform-runtime` conventions.

---

## 10. Summary of Findings

1. **Workspace:** standalone per-package (no root/workspace aggregation).
2. **Build:** no emit; Node ≥ 23.6 native type stripping; erasable TS only.
3. **TypeScript:** strict NodeNext ESM, package-scoped `include`, `.ts` import extensions.
4. **Publishing:** private, unlicensed, source-consumed; interface versioned by contract governance.
5. **Dependencies:** zero runtime deps; exact-pinned dev toolchain.
6. **FACT 2 upheld:** `types.ts` = runtime substrate primitives, out of `contracts-sdk` scope, immutable here.
7. **Scaffold:** structurally compatible; safe to create additively.

**END CONTRACT-SDK-ANALYSIS (Discovery · Additive-only · Baseline `56a32d3` / `ucost-baseline-green-284`).**
