/**
 * UCOS Substrate — Built-in structural schemas for descriptors.
 * The Validation Engine checks every incoming descriptor against these before registration.
 */

import type { JsonSchema } from "../contracts/types.ts";

export const CONTRACT_DESCRIPTOR_SCHEMA: JsonSchema = {
  type: "object",
  required: ["kind", "id", "version", "operations"],
  properties: {
    kind: { const: "contract" },
    id: { type: "string", minLength: 1 },
    version: { type: "string", minLength: 1 },
    operations: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "input", "output"],
        properties: {
          name: { type: "string", minLength: 1 },
          input: { type: "object" },
          output: { type: "object" },
        },
      },
    },
  },
};

export const CAPABILITY_DESCRIPTOR_SCHEMA: JsonSchema = {
  type: "object",
  required: ["kind", "id", "version", "name", "contract", "provider"],
  properties: {
    kind: { const: "capability" },
    id: { type: "string", minLength: 1 },
    version: { type: "string", minLength: 1 },
    name: { type: "string", minLength: 1 },
    contract: {
      type: "object",
      required: ["id", "versionRange"],
      properties: {
        id: { type: "string", minLength: 1 },
        versionRange: { type: "string", minLength: 1 },
      },
    },
    provider: {
      type: "object",
      required: ["module", "export"],
      properties: {
        module: { type: "string", minLength: 1 },
        export: { type: "string", minLength: 1 },
      },
    },
    dependencies: {
      type: "array",
      items: {
        type: "object",
        required: ["capabilityId", "versionRange"],
        properties: {
          capabilityId: { type: "string", minLength: 1 },
          versionRange: { type: "string", minLength: 1 },
          as: { type: "string", minLength: 1 },
        },
      },
    },
    configSchema: { type: "object" },
    defaults: { type: "object" },
    metadata: { type: "object" },
  },
};
