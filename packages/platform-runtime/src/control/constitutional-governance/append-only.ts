/**
 * CGR-CORE-02 — Append-only guard (INV-10 / RG-2).
 *
 * Semantic no-update / no-delete / supersession-by-linked-record discipline layered over the
 * reused persistence-runtime append-only log. Pure (no I/O).
 *
 * `E-APPEND-ONLY` is surfaced as a subclass of the existing `ControlError` base
 * (control/errors.ts) — that error module is read-only and its `ControlErrorCode` union is
 * closed, so the constitutional code is carried on the `cgCode` discriminator rather than by
 * editing the union. No new base class is introduced.
 */

import { ControlError } from "../errors.ts";
import { isValidVersion } from "../../meta-core/semver.ts";
import type { ConstitutionalRecord } from "./types.ts";

/** Constitutional-governance error code carried on top of the reused ControlError base. */
export type CgErrorCode = "E-APPEND-ONLY" | "E-VALIDATION" | "E-NOT-FOUND";

/** Append-only violation. Reuses ControlError; base code stays within the closed platform union. */
export class AppendOnlyError extends ControlError {
  readonly cgCode: CgErrorCode;
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("CONTROL_VALIDATION_FAILED", message, details);
    this.name = "AppendOnlyError";
    this.cgCode = "E-APPEND-ONLY";
  }
}

/** Fail-closed validation error (deny-by-default). */
export class CgValidationError extends ControlError {
  readonly cgCode: CgErrorCode;
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("CONTROL_VALIDATION_FAILED", message, details);
    this.name = "CgValidationError";
    this.cgCode = "E-VALIDATION";
  }
}

/** Not-found (fail-closed lookup). */
export class CgNotFoundError extends ControlError {
  readonly cgCode: CgErrorCode;
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("CONTROL_VALIDATION_FAILED", message, details);
    this.name = "CgNotFoundError";
    this.cgCode = "E-NOT-FOUND";
  }
}

/** RG-5: (logicalId, version) must be a valid, unique semantic version. */
export function assertValidVersion(version: string): void {
  if (!isValidVersion(version)) {
    throw new CgValidationError(`invalid semantic version: "${version}"`, { version });
  }
}

/**
 * RG-2: reject any attempt to re-append an existing (logicalId, version). A logical change is
 * expressed by superseding with a NEW version, never by mutating an existing record.
 */
export function assertNoDuplicate(
  existing: readonly ConstitutionalRecord[],
  logicalId: string,
  version: string,
): void {
  const clash = existing.some((r) => r.logicalId === logicalId && r.version === version);
  if (clash) {
    throw new AppendOnlyError(`append-only violation: ${logicalId}@${version} already exists`, {
      logicalId,
      version,
    });
  }
}

/**
 * RG-4: a supersession must link to an existing prior version of the same logical id, and the
 * prior must not already be superseded (single active head per logical id). No physical delete
 * or mutation occurs — supersession is a new appended record.
 */
export function assertValidSupersession(
  existing: readonly ConstitutionalRecord[],
  logicalId: string,
  priorVersion: string,
): ConstitutionalRecord {
  const prior = existing.find((r) => r.logicalId === logicalId && r.version === priorVersion);
  if (!prior) {
    throw new CgNotFoundError(
      `cannot supersede: ${logicalId}@${priorVersion} does not exist`,
      { logicalId, priorVersion },
    );
  }
  const alreadySuperseded = existing.some((r) => r.supersedes === prior.recordUuid);
  if (alreadySuperseded) {
    throw new AppendOnlyError(
      `append-only violation: ${logicalId}@${priorVersion} is already superseded`,
      { logicalId, priorVersion },
    );
  }
  return prior;
}
