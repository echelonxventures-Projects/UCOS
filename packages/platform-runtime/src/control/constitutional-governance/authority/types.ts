/**
 * CGR-W2-ACR/AVR — Authority Runtime Foundation shared schema (Wave-A).
 *
 * Authorized by PCAMG-RUNTIME-0102A (Wave-A construction execution). Grounded in the shipped
 * Wave-1 constitutional-governance substrate (CGR-CORE-01..05, CGR-REG-*, CGR-AU-*) and the
 * PCAMG-RUNTIME-0001 derivation doctrine (up-trace to the Layer-0 principle root).
 *
 * REUSE JUSTIFICATION:
 *   These are pure read-only *value shapes* projected over the existing `ConstitutionalRecord`
 *   (Wave-1 `types.ts`). No Wave-1 type is redefined or widened; `RegistryName` is imported and
 *   reused verbatim. A dedicated shared type module (inside the authorized `authority/` subtree)
 *   is required so the three ACR engines and the three AVR verifiers share one collision-free
 *   contract instead of duplicating shapes. Union-string + interface only (tsconfig
 *   `erasableSyntaxOnly`: no runtime `enum`, no runtime `namespace`).
 *
 * CONSTITUTIONAL POSTURE: every shape here is immutable and read-only. Nothing here can carry or
 * imply ACTIVE status, originate authority, or express a mutation — Wave-A reads Wave-1 state.
 */

import type { RegistryName } from "../types.ts";

/** A single resolved node in an authority chain (a read projection of one governance record). */
export interface AuthorityChainNode {
  /** Namespaced logical id of the record (e.g. "PCAMG-META-I"). */
  readonly logicalId: string;
  /** Owning registry of the record. */
  readonly registry: RegistryName;
  /** Deterministic record identity (Wave-1 `computeRecordUuid`). */
  readonly recordUuid: string;
  /** Canonical content hash (Wave-1 `computeContentHash`) — used for canonical tie-breaks. */
  readonly contentHash: string;
  /** The record's up-trace references (logical ids), copied read-only. */
  readonly upTrace: readonly string[];
  /** Shortest hop distance from the chain subject (subject = 0). */
  readonly depth: number;
  /** True iff this node is a Layer-0 authority root (REG-PRIN). */
  readonly isRoot: boolean;
}

/** A fully resolved, immutable authority chain for one subject. */
export interface ResolvedAuthorityChain {
  /** The subject logical id the chain was resolved for. */
  readonly subject: string;
  /** The subject's owning registry. */
  readonly subjectRegistry: RegistryName;
  /** All chain nodes, deterministically ordered by (depth asc, logicalId asc). */
  readonly nodes: readonly AuthorityChainNode[];
  /** Logical ids of the terminal (up-trace-empty) nodes, sorted ascending. */
  readonly rootIds: readonly string[];
  /** Deepest node depth in the chain. */
  readonly maxDepth: number;
  /**
   * True iff the chain terminates exclusively at Layer-0 principle roots (REG-PRIN) with no
   * broken links. An incomplete chain never resolves to a partial "complete" result.
   */
  readonly complete: boolean;
}

/** Stable fail-closed denial codes for the Authority Runtime. */
export type AuthorityDenialCode =
  | "E-UNKNOWN-SUBJECT"
  | "E-CHAIN-BROKEN"
  | "E-AMBIGUOUS-REF"
  | "E-EMPTY-INPUT"
  | "E-UNDECIDABLE-SUPREMACY";

/** A fail-closed denial with a stable, reconstructable cause. */
export interface AuthorityDenial {
  readonly code: AuthorityDenialCode;
  readonly message: string;
  readonly detail: Readonly<Record<string, unknown>>;
}

/** The result of a chain resolution: either a resolved chain or a fail-closed denial (never both). */
export interface AuthorityResolutionResult {
  readonly resolved: boolean;
  readonly chain: ResolvedAuthorityChain | null;
  readonly denial: AuthorityDenial | null;
}
