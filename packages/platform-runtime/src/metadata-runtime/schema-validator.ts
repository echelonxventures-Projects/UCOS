/**
 * UCOS Substrate — Metadata Runtime: JSON-Schema-subset validator.
 *
 * Dependency-free validation engine primitive. Supports the subset declared in
 * JsonSchema (type, properties, required, items, enum, const, additionalProperties,
 * min/max length, minimum/maximum, pattern). Used to validate contracts, capability
 * descriptors, and resolved configuration.
 */

import type { JsonSchema, ValidationIssue, ValidationResult } from "../contracts/types.ts";

function typeOf(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function matchesType(value: unknown, type: NonNullable<JsonSchema["type"]>): boolean {
  switch (type) {
    case "integer":
      return typeof value === "number" && Number.isInteger(value);
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "object":
      return typeOf(value) === "object";
    case "array":
      return Array.isArray(value);
    case "string":
      return typeof value === "string";
    case "boolean":
      return typeof value === "boolean";
    case "null":
      return value === null;
    default:
      return false;
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeOf(a) !== typeOf(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => deepEqual(item, b[i]));
  }
  if (typeOf(a) === "object") {
    const ao = a as Record<string, unknown>;
    const bo = b as Record<string, unknown>;
    const ak = Object.keys(ao);
    const bk = Object.keys(bo);
    return ak.length === bk.length && ak.every((k) => deepEqual(ao[k], bo[k]));
  }
  return false;
}

function validateNode(value: unknown, schema: JsonSchema, path: string, issues: ValidationIssue[]): void {
  if (schema.const !== undefined && !deepEqual(value, schema.const)) {
    issues.push({ path, message: `expected const ${JSON.stringify(schema.const)}` });
    return;
  }

  if (schema.enum && !schema.enum.some((option) => deepEqual(option, value))) {
    issues.push({ path, message: `value not in enum ${JSON.stringify(schema.enum)}` });
    return;
  }

  if (schema.type && !matchesType(value, schema.type)) {
    issues.push({ path, message: `expected type "${schema.type}" but got "${typeOf(value)}"` });
    return;
  }

  if (schema.type === "string" && typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      issues.push({ path, message: `string shorter than minLength ${schema.minLength}` });
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      issues.push({ path, message: `string longer than maxLength ${schema.maxLength}` });
    }
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(value)) {
      issues.push({ path, message: `string does not match pattern ${schema.pattern}` });
    }
  }

  if ((schema.type === "number" || schema.type === "integer") && typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) {
      issues.push({ path, message: `number below minimum ${schema.minimum}` });
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      issues.push({ path, message: `number above maximum ${schema.maximum}` });
    }
  }

  if (schema.type === "array" && Array.isArray(value) && schema.items) {
    value.forEach((item, index) => {
      validateNode(item, schema.items as JsonSchema, `${path}[${index}]`, issues);
    });
  }

  if (schema.type === "object" && typeOf(value) === "object") {
    const obj = value as Record<string, unknown>;
    for (const requiredKey of schema.required ?? []) {
      if (!(requiredKey in obj)) {
        issues.push({ path: path ? `${path}.${requiredKey}` : requiredKey, message: "required property missing" });
      }
    }
    const properties = schema.properties ?? {};
    for (const [key, childValue] of Object.entries(obj)) {
      const childPath = path ? `${path}.${key}` : key;
      const childSchema = properties[key];
      if (childSchema) {
        validateNode(childValue, childSchema, childPath, issues);
      } else if (schema.additionalProperties === false) {
        issues.push({ path: childPath, message: "additional property not allowed" });
      } else if (typeof schema.additionalProperties === "object") {
        validateNode(childValue, schema.additionalProperties, childPath, issues);
      }
    }
  }
}

export function validateAgainstSchema(value: unknown, schema: JsonSchema): ValidationResult {
  const issues: ValidationIssue[] = [];
  validateNode(value, schema, "", issues);
  return { valid: issues.length === 0, issues };
}
