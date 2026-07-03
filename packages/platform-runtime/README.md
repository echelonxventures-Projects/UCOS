# @ucos/platform-runtime — UCOS Foundational Substrate

Working, metadata-driven substrate for UCOS. Authorized by **AD-0016** (scoped Article IX release) for
**PI-2 Meta-Core** + **PI-3 Registry / Metadata / Configuration** runtimes only. Contains **no business,
domain, civilization, economic, intelligence, or cosmological logic** — capabilities are introduced entirely
through descriptors (metadata), contracts, configuration, and externally supplied providers.

## Runtimes

| Runtime | Location | Responsibility |
|---------|----------|----------------|
| **Meta-Core** (PI-2) | `src/meta-core/` | Kernel + Artifact/Capability/Contract loaders, Dependency Resolver, Composition Engine, Execution Engine, Lifecycle Engine, Validation Engine, Plugin Runtime |
| **Registry** (PI-3) | `src/registry-runtime/` | Registration, discovery, resolution, versioning (`RegistryPort`) |
| **Metadata** (PI-3) | `src/metadata-runtime/` | Metadata store, prefix resolver, JSON-schema-subset validation (`MetadataPort`) |
| **Configuration** (PI-3) | `src/configuration-runtime/` | Layered configuration store + resolver (`ConfigurationPort`) |
| Contracts SDK | `src/contracts/` | Shared descriptor + runtime contract types |

The kernel depends only on the three **ports** (dependency inversion). Any storage backend can replace the
in-memory adapters without changing the Meta-Core.

## Flow

```
load (Artifact/Contract/Capability loaders)
  -> validate (Validation Engine + Metadata schemas)
  -> resolve  (Dependency Resolver: version resolution, cycle detection, dependency-first order)
  -> compose  (Composition Engine: resolve config, inject deps, instantiate providers)
  -> execute  (Execution Engine: contract-validated operation invocation)
```

## Run it

No install is required to run or test — Node ≥ 23.6 strips TypeScript types natively.

```bash
# End-to-end demo (loads examples/descriptors, composes, executes)
node bin/ucos-substrate.ts examples/descriptors --exec cap.shout.produce --input '{"subject":"UCOS"}'
# => cap.shout.produce({"subject":"UCOS"}) => "HELLO, UCOS!"

# Tests (built-in Node runner)
npm test

# Type check (requires the dev dependencies)
npm run typecheck
```

## Adding a capability without touching the core

1. Write a provider factory (a module export, or register one via `kernel.registerProvider`).
2. Write a capability descriptor (JSON) referencing the provider, its contract, dependencies, and config schema.
3. Drop the descriptor into a loaded directory (or `kernel.loadDescriptors([...])`) and compose.

No Meta-Core / Registry / Metadata / Configuration source changes. See
`test/dynamic-capability.test.ts` for the executable proof.

## Programmatic use

```ts
import { createSubstrate } from "./src/bootstrap.ts";

const { kernel } = createSubstrate();
await kernel.bootstrap({ directory: "examples/descriptors" });
const text = await kernel.execute("cap.greeting", "produce", { subject: "world" });
```

## Scope / governance

- Authorized by `AD-0016-PI2-PI3-SUBSTRATE-CONSTRUCTION-AUTHORIZATION.md`.
- Language: TypeScript on Node.js under the governed polyglot allowance of `UCOS-PLAT-ADR-001`.
- Out of scope (still locked): domains, services, business logic, and all Ω∞ existential systems.
