/**
 * UCOS Substrate — Error taxonomy for the Meta-Core.
 * Every failure surfaces as a typed SubstrateError with a stable `code` for governance/audit.
 */

export type SubstrateErrorCode =
  | "VALIDATION_FAILED"
  | "REGISTRY_CONFLICT"
  | "NOT_FOUND"
  | "RESOLUTION_FAILED"
  | "DEPENDENCY_CYCLE"
  | "COMPOSITION_FAILED"
  | "EXECUTION_FAILED"
  | "LIFECYCLE_VIOLATION"
  | "PLUGIN_LOAD_FAILED"
  | "LOADER_FAILED";

export class SubstrateError extends Error {
  readonly code: SubstrateErrorCode;
  readonly details: Record<string, unknown>;

  constructor(code: SubstrateErrorCode, message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = "SubstrateError";
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends SubstrateError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("VALIDATION_FAILED", message, details);
    this.name = "ValidationError";
  }
}

export class ResolutionError extends SubstrateError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("RESOLUTION_FAILED", message, details);
    this.name = "ResolutionError";
  }
}

export class DependencyCycleError extends SubstrateError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("DEPENDENCY_CYCLE", message, details);
    this.name = "DependencyCycleError";
  }
}

export class CompositionError extends SubstrateError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("COMPOSITION_FAILED", message, details);
    this.name = "CompositionError";
  }
}

export class ExecutionError extends SubstrateError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("EXECUTION_FAILED", message, details);
    this.name = "ExecutionError";
  }
}

export class LifecycleViolationError extends SubstrateError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("LIFECYCLE_VIOLATION", message, details);
    this.name = "LifecycleViolationError";
  }
}

export class PluginLoadError extends SubstrateError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("PLUGIN_LOAD_FAILED", message, details);
    this.name = "PluginLoadError";
  }
}
