# packages/

Reserved for **shared libraries and reusable packages** (SDKs, design-system implementation, shared domain primitives, client libraries, utilities).

> EMPTY BY DESIGN. No package code is generated during bootstrap.

Each package added later MUST:
- be versioned and contract-stable,
- avoid leaking domain-internal models across bounded contexts,
- be registered in the Artifact Registry.
