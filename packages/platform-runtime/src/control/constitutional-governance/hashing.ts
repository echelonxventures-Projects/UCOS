/**
 * CGR-CORE-03 — Canonical content hashing + verify-on-read.
 *
 * Deterministic content addressing (RG-5 tamper-evidence, RG-6 determinism, INV-6).
 * REUSE ONLY: routes exclusively through the platform's `canonicalize` + `sha256`
 * (control/federation/assertions.ts). No new canonicalizer, no new hash, no direct
 * crypto import inside the constitutional-governance namespace.
 */

import { canonicalize, sha256 } from "../federation/assertions.ts";
import type { ConstitutionalRecord, RecordContent, RegistryName } from "./types.ts";

/**
 * The semantic view over which a record's `contentHash` is computed. Deliberately excludes
 * non-semantic / non-deterministic envelope fields (recordUuid, status, createdAt, createdBy, seq).
 * `upTrace` is sorted so the hash is set-order-independent (RG-6).
 */
interface SemanticView {
  readonly registry: RegistryName;
  readonly logicalId: string;
  readonly version: string;
  readonly ownerAuthority: string;
  readonly supersedes: string | null;
  readonly upTrace: readonly string[];
  readonly content: RecordContent;
}

function semanticView(input: {
  registry: RegistryName;
  logicalId: string;
  version: string;
  ownerAuthority: string;
  supersedes: string | null;
  upTrace: readonly string[];
  content: RecordContent;
}): SemanticView {
  return {
    registry: input.registry,
    logicalId: input.logicalId,
    version: input.version,
    ownerAuthority: input.ownerAuthority,
    supersedes: input.supersedes,
    upTrace: [...input.upTrace].sort(),
    content: input.content,
  };
}

/** Compute the deterministic content hash over the semantic view (64-char lowercase hex). */
export function computeContentHash(input: {
  registry: RegistryName;
  logicalId: string;
  version: string;
  ownerAuthority: string;
  supersedes: string | null;
  upTrace: readonly string[];
  content: RecordContent;
}): string {
  return sha256(canonicalize(semanticView(input)));
}

/**
 * Deterministic record identity: sha256(canonical({registry, logicalId, version, supersedes})).
 * (id, version) is unique per registry (RG-5), so this is collision-free and reproducible.
 */
export function computeRecordUuid(input: {
  registry: RegistryName;
  logicalId: string;
  version: string;
  supersedes: string | null;
}): string {
  return sha256(
    canonicalize({
      registry: input.registry,
      logicalId: input.logicalId,
      version: input.version,
      supersedes: input.supersedes,
    }),
  );
}

/** Verify-on-read: recompute the content hash and compare against the stored value. */
export function verifyRecordHash(record: ConstitutionalRecord): boolean {
  const recomputed = computeContentHash({
    registry: record.registry,
    logicalId: record.logicalId,
    version: record.version,
    ownerAuthority: record.ownerAuthority,
    supersedes: record.supersedes,
    upTrace: record.upTrace,
    content: record.content,
  });
  return recomputed === record.contentHash;
}
