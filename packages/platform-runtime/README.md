# packages/platform-runtime/

**Reserved for shared runtime primitives (no domain logic).**

> EMPTY BY DESIGN (structure only). Established by **WI-SEED.1 (Repository Foundation)**, Phase 11.3.

Rules:
- Shared runtime primitives conforming to **ADR-001** (OCI + Kubernetes; Java 21 LTS/JVM primary; governed
  polyglot TypeScript/Node.js, Go).
- MUST NOT leak domain-internal models across bounded contexts (`CTX-ARCHB-001` §3).
- Versioned and contract-stable; registered in `CTX-REG-001`.
- No business/domain logic (that belongs to service WPs).

**Traceability:** ADR-001 · `PEA-002` (PRD/PRS/PEX/PWF) · `PEP-009/018`.
