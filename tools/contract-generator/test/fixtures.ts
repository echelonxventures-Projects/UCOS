/**
 * WI-07 test fixtures — small, valid/invalid inventory documents built in-memory.
 * Kept independent of the real catalog so unit tests are hermetic.
 */

import type { JsonValue, LoadedInventory } from "../src/types.ts";

/** A minimal, schema-valid API inventory (deferred field schema, like the real catalog). */
export function validInventory(): JsonValue {
  return {
    inventoryFormat: "ucos-api-contract.inventory/v1",
    inventoryKind: "api-contract-extraction",
    extraction: {
      source: "specifications/contracts/UCOS-CONTRACT-CATALOG.md",
      sourceArtifactId: "UCOS-CONTRACT-CAT-001",
    },
    contract: {
      id: "UCOS-API-CONTRACT-999",
      shortId: "API-999",
      title: "Test API",
      version: "v1.0",
      producer: "UCOS-SVC-999",
      domain: "DOM-999",
      capability: "CAP-99",
      dataContract: "DC-999",
      operations: [
        { verbSemantics: "GET", path: "/things/{id}", intent: "read", kind: "safe-read" },
        { verbSemantics: "POST", path: "/things", intent: "create", kind: "unsafe-create" },
      ],
      nfr: {
        latency: "PENDING ASR RATIFICATION",
        throughput: "PENDING ASR RATIFICATION",
        availability: "PENDING ASR RATIFICATION",
        recoveryRtoRpo: "PENDING ASR RATIFICATION",
      },
      security: "FLAGGED FOR PROMPT 09",
      dataContractDetail: {
        id: "UCOS-DATA-CONTRACT-999",
        payloadFamilies: ["ThingRecord"],
        fieldLevelSchema: "NOT DEFINED IN CATALOG (Prompt 05)",
      },
    },
    generationConstraints: { note: "boundary-level only; do not invent field schemas" },
    traceability: { governedBy: "UCOS-SVC-POLICY-001", invariants: ["IC-2"] },
  };
}

/** Wrap a raw value as a LoadedInventory with a stable id. */
export function asInventory(raw: JsonValue, sourceId = "test/inline.contract.json"): LoadedInventory {
  return { sourcePath: sourceId, sourceId, raw };
}

// ---------------------------------------------------------------------------
// WI-08 — synthetic field-schema documents.
//
// These are TEST-ONLY schemas used to prove the registry + sufficiency flip. They are NOT part of
// the shipped catalog and are NEVER written under contracts/field-schemas — the real registry
// stays empty (no invented business payloads).
// ---------------------------------------------------------------------------

/** A valid field-schema document bound to a payload family. */
export function fieldSchemaDoc(
  id: string,
  payloadFamily: string,
  dataContract: string,
  schema: JsonValue,
  version = "1.0.0",
): JsonValue {
  return {
    fieldSchemaModelVersion: "ucos-field-schema/1.0.0",
    id,
    version,
    payloadFamily,
    dataContract,
    schema,
  };
}

/** A simple object node with a required string + optional integer (with constraints). */
export function objectSchema(): JsonValue {
  return {
    kind: "object",
    additionalProperties: false,
    properties: [
      {
        name: "key",
        required: true,
        schema: { kind: "primitive", type: "string", constraints: { minLength: 1, maxLength: 128 } },
      },
      { name: "count", required: false, schema: { kind: "primitive", type: "integer", constraints: { minimum: 0 } } },
      { name: "tags", required: false, schema: { kind: "array", items: { kind: "primitive", type: "string" } } },
      { name: "status", required: false, schema: { kind: "enum", base: "string", values: ["active", "inactive"] } },
    ],
  };
}

/** The three field-schema docs backing API-999 (matches validInventory payloadFamilies). */
export function api999FieldSchemas(): readonly JsonValue[] {
  return [
    fieldSchemaDoc("UCOS-DATA-CONTRACT-999/ThingRecord", "ThingRecord", "UCOS-DATA-CONTRACT-999", objectSchema()),
  ];
}
