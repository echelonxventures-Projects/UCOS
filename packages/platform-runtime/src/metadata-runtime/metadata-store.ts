/**
 * UCOS Substrate — Metadata Runtime (FND-03).
 *
 * In-memory MetadataPort adapter: metadata store, prefix resolver, and schema validation.
 * Optionally validates values against their stored schema on write.
 * Realizes UCOS-PEA-006; ADR-005.
 */

import type { JsonSchema, ValidationResult } from "../contracts/types.ts";
import type { MetadataPort, MetadataRecord } from "../meta-core/ports.ts";
import { ValidationError } from "../meta-core/errors.ts";
import { validateAgainstSchema } from "./schema-validator.ts";

export interface MetadataStoreOptions {
  /** When true, put() rejects values that fail their attached schema. Default: true. */
  validateOnWrite?: boolean;
}

export class InMemoryMetadataStore implements MetadataPort {
  readonly #records = new Map<string, MetadataRecord>();
  readonly #validateOnWrite: boolean;

  constructor(options: MetadataStoreOptions = {}) {
    this.#validateOnWrite = options.validateOnWrite ?? true;
  }

  put(key: string, value: unknown, schema?: JsonSchema): void {
    if (schema && this.#validateOnWrite) {
      const result = this.validate(value, schema);
      if (!result.valid) {
        throw new ValidationError(`Metadata "${key}" failed schema validation`, { key, issues: result.issues });
      }
    }
    const record: MetadataRecord = schema ? { key, value, schema } : { key, value };
    this.#records.set(key, record);
  }

  get(key: string): MetadataRecord | undefined {
    return this.#records.get(key);
  }

  query(prefix: string): MetadataRecord[] {
    return [...this.#records.values()].filter((record) => record.key.startsWith(prefix));
  }

  validate(value: unknown, schema: JsonSchema): ValidationResult {
    return validateAgainstSchema(value, schema);
  }
}
