/**
 * UCOS PI-4 Control Fabrics — error taxonomy.
 */

export type ControlErrorCode =
  | "AUTHENTICATION_FAILED"
  | "AUTHORIZATION_DENIED"
  | "TRUST_INSUFFICIENT"
  | "GOVERNANCE_BLOCKED"
  | "CONTROL_VALIDATION_FAILED";

export class ControlError extends Error {
  readonly code: ControlErrorCode;
  readonly details: Record<string, unknown>;

  constructor(code: ControlErrorCode, message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = "ControlError";
    this.code = code;
    this.details = details;
  }
}

export class AuthenticationError extends ControlError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("AUTHENTICATION_FAILED", message, details);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ControlError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("AUTHORIZATION_DENIED", message, details);
    this.name = "AuthorizationError";
  }
}

export class ControlValidationError extends ControlError {
  constructor(message: string, details: Record<string, unknown> = {}) {
    super("CONTROL_VALIDATION_FAILED", message, details);
    this.name = "ControlValidationError";
  }
}
