/**
 * Contract Skeleton Generator — shared result types (WI-07).
 *
 * Small, dependency-free value/type vocabulary shared by the loader, the four-stage
 * fail-closed validation pipeline, and the emitters. Pure erasable TypeScript.
 *
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md · UCOS-CONTRACT-CAT-001 · IC-2.
 */

/** A single validation failure: an instance path (JSON-pointer-like) + a human reason. */
export interface Failure {
  readonly path: string;
  readonly reason: string;
}

/** Per-stage PASS/FAIL verdict. There is no "warn and continue". */
export type StageVerdict = "PASS" | "FAIL";

/** Per generation-target sufficiency verdict (Stage 3 gate). */
export type TargetVerdict = "SUFFICIENT" | "PARTIAL" | "BLOCKED";

/** Arbitrary parsed-JSON value (no `any`; narrowed at use sites). */
export type JsonValue =
  | null
  | boolean
  | number
  | string
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue };

/** A parsed catalog inventory file paired with its source path (deterministic id). */
export interface LoadedInventory {
  /** Absolute path of the source file. */
  readonly sourcePath: string;
  /** Stable, repo-relative id used for ordering and reporting (e.g. "contracts/catalog/api-018.contract.json"). */
  readonly sourceId: string;
  /** The parsed JSON value (unvalidated). */
  readonly raw: JsonValue;
}
