/**
 * UCOS Identity Fabric — Identity Registry, Lifecycle, Validation, Federation (ID-001/ID-002).
 *
 * Identities are stored as metadata records in the substrate Metadata Runtime (metadata-first).
 * No identity is hardcoded. Federation providers can supply identities not stored locally.
 */

import type { JsonSchema } from "../../contracts/types.ts";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { IdentityProvider, IdentityRecord, IdentityStatus } from "../types.ts";
import { ControlValidationError } from "../errors.ts";

export const IDENTITY_SCHEMA: JsonSchema = {
  type: "object",
  required: ["id", "kind", "status", "permissions"],
  properties: {
    id: { type: "string", minLength: 1 },
    kind: { type: "string", minLength: 1 },
    status: { enum: ["active", "suspended", "retired"] },
    permissions: { type: "array", items: { type: "string" } },
    trust: { type: "object", properties: { level: { type: "number" } } },
    credentials: {
      type: "array",
      items: {
        type: "object",
        required: ["scheme", "value"],
        properties: { scheme: { type: "string", minLength: 1 }, value: { type: "string", minLength: 1 } },
      },
    },
    attributes: { type: "object" },
  },
};

const ALLOWED_STATUS_TRANSITIONS: Record<IdentityStatus, readonly IdentityStatus[]> = {
  active: ["suspended", "retired"],
  suspended: ["active", "retired"],
  retired: [],
};

const KEY_PREFIX = "identity:";

export class IdentityRegistry {
  readonly #metadata: MetadataPort;
  readonly #providers: IdentityProvider[] = [];

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  register(record: IdentityRecord): void {
    const result = this.#metadata.validate(record, IDENTITY_SCHEMA);
    if (!result.valid) {
      throw new ControlValidationError(`Identity "${record.id}" is invalid`, { id: record.id, issues: result.issues });
    }
    if (this.get(record.id)) {
      throw new ControlValidationError(`Identity "${record.id}" already registered`, { id: record.id });
    }
    this.#metadata.put(`${KEY_PREFIX}${record.id}`, record, IDENTITY_SCHEMA);
  }

  get(id: string): IdentityRecord | undefined {
    return this.#metadata.get(`${KEY_PREFIX}${id}`)?.value as IdentityRecord | undefined;
  }

  list(): IdentityRecord[] {
    return this.#metadata.query(KEY_PREFIX).map((record) => record.value as IdentityRecord);
  }

  setStatus(id: string, status: IdentityStatus): void {
    const record = this.get(id);
    if (!record) throw new ControlValidationError(`Unknown identity "${id}"`, { id });
    if (record.status !== status && !ALLOWED_STATUS_TRANSITIONS[record.status].includes(status)) {
      throw new ControlValidationError(`Illegal identity transition ${record.status} -> ${status}`, { id });
    }
    this.#metadata.put(`${KEY_PREFIX}${id}`, { ...record, status }, IDENTITY_SCHEMA);
  }

  registerProvider(provider: IdentityProvider): void {
    this.#providers.push(provider);
  }

  /** Consults federated providers for an identity not stored locally. */
  resolveFederated(id: string): IdentityRecord | undefined {
    for (const provider of this.#providers) {
      const record = provider.resolve(id);
      if (record) return record;
    }
    return undefined;
  }
}
