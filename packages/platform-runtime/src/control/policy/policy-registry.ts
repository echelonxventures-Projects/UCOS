/**
 * UCOS Policy Fabric — Policy Registry (POL-001).
 *
 * Policies are data records stored in the substrate Metadata Runtime (metadata-driven).
 * No policy logic is compiled into the engine; the engine only interprets these records.
 */

import type { JsonSchema } from "../../contracts/types.ts";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { PolicyRecord } from "../types.ts";
import { ControlValidationError } from "../errors.ts";

export const POLICY_SCHEMA: JsonSchema = {
  type: "object",
  required: ["id", "effect", "rules"],
  properties: {
    id: { type: "string", minLength: 1 },
    effect: { enum: ["allow", "deny"] },
    target: {
      type: "object",
      properties: { capability: { type: "string" }, operation: { type: "string" } },
    },
    rules: {
      type: "array",
      items: { type: "object", required: ["type"], properties: { type: { type: "string", minLength: 1 } } },
    },
    priority: { type: "number" },
    description: { type: "string" },
  },
};

const PREFIX = "policy:";

export class PolicyRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  register(policy: PolicyRecord): void {
    const result = this.#metadata.validate(policy, POLICY_SCHEMA);
    if (!result.valid) {
      throw new ControlValidationError(`Policy "${policy.id}" is invalid`, { id: policy.id, issues: result.issues });
    }
    if (this.get(policy.id)) {
      throw new ControlValidationError(`Policy "${policy.id}" already registered`, { id: policy.id });
    }
    this.#metadata.put(`${PREFIX}${policy.id}`, policy, POLICY_SCHEMA);
  }

  get(id: string): PolicyRecord | undefined {
    return this.#metadata.get(`${PREFIX}${id}`)?.value as PolicyRecord | undefined;
  }

  list(): PolicyRecord[] {
    return this.#metadata.query(PREFIX).map((record) => record.value as PolicyRecord);
  }
}
