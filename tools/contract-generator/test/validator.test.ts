/**
 * WI-10 tests — Validator Meta-Model, Builder (DTO-parity projection + fail-closed), Emitter
 * (deterministic runtime validators), generator integration, and regression protection.
 *
 * All schemas here are SYNTHETIC and TEST-ONLY (never written under contracts/field-schemas). The
 * shipped on-disk registry stays empty, so WI-07/08/09 output is unaffected.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  buildContractValidators,
  validatorsFromDtoDocument,
} from "../src/validator/validatorBuilder.ts";
import { buildContractDTOs } from "../src/dto/dtoBuilder.ts";
import {
  buildFieldSchemaRegistry,
  loadFieldSchemaMetaRegistry,
} from "../src/registry/fieldSchemaRegistry.ts";
import { loadSchemaRegistry } from "../src/validate/schemaRegistry.ts";
import { generate } from "../src/generate.ts";
import { validInventory, asInventory, fieldSchemaDoc } from "./fixtures.ts";
import type { LoadedFieldSchema } from "../src/registry/fieldSchemaRegistry.ts";
import type { JsonValue } from "../src/types.ts";
import type { EmittedFile } from "../src/generate.ts";
import type { FamilyBinding } from "../src/validator/validatorBuilder.ts";

const meta = loadFieldSchemaMetaRegistry();

function sources(docs: readonly JsonValue[]): readonly LoadedFieldSchema[] {
  return docs.map((raw, i) => ({ sourceId: `test/vfs-${i}.fieldschema.json`, raw }));
}
function reg(docs: readonly JsonValue[]) {
  return buildFieldSchemaRegistry(sources(docs), meta);
}
function fileMap(files: readonly EmittedFile[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const f of files) m.set(f.relPath, f.content);
  return m;
}

const DC = "UCOS-DATA-CONTRACT-999";
const THING_BINDING: readonly FamilyBinding[] = [{ family: "ThingRecord", dataContract: DC }];

/** A synthetic ThingRecord (with a transitive reference to Address) + Address. Constraint-rich. */
function syntheticDocs(): readonly JsonValue[] {
  return [
    fieldSchemaDoc(`${DC}/ThingRecord`, "ThingRecord", DC, {
      kind: "object",
      additionalProperties: false,
      properties: [
        { name: "key", required: true, schema: { kind: "primitive", type: "string", constraints: { minLength: 1, maxLength: 8 } } },
        { name: "count", required: false, schema: { kind: "primitive", type: "integer", constraints: { minimum: 0 } } },
        { name: "tags", required: false, schema: { kind: "array", items: { kind: "primitive", type: "string" }, constraints: { minItems: 1, uniqueItems: true } } },
        { name: "status", required: false, schema: { kind: "enum", base: "string", values: ["active", "inactive"] } },
        { name: "home", required: false, schema: { kind: "reference", ref: `${DC}/Address` } },
      ],
    }),
    fieldSchemaDoc(`${DC}/Address`, "Address", DC, {
      kind: "object",
      additionalProperties: false,
      properties: [
        { name: "street", required: true, schema: { kind: "primitive", type: "string" } },
        { name: "zip", required: false, schema: { kind: "primitive", type: "string", nullable: true } },
      ],
    }),
  ];
}

/** Generate against the full pipeline with a synthetic registry (contract API-999). */
function generateWith(docs: readonly JsonValue[]) {
  return generate({
    inventories: [asInventory(validInventory())],
    registry: loadSchemaRegistry(),
    fieldSchemas: reg(docs),
  });
}

// ---------------------------------------------------------------------------
// Builder correctness
// ---------------------------------------------------------------------------

test("buildContractValidators derives validators with DTO-parity names + deterministic ordering", () => {
  const registry = reg(syntheticDocs());
  const doc = buildContractValidators("API-999", THING_BINDING, registry);
  assert.ok(doc);
  assert.equal(doc!.validatorModelVersion, "ucos-validator/1.0.0");
  // Models sorted by name; transitive dependency Address is included.
  assert.deepEqual(doc!.validators.map((v) => v.name), ["Address", "ThingRecord"]);
  assert.deepEqual(doc!.payloadFamilyTypeNames, ["ThingRecord"]);
});

test("validatorsFromDtoDocument mirrors the DTO document exactly (name/order/family parity)", () => {
  const registry = reg(syntheticDocs());
  const dto = buildContractDTOs("API-999", THING_BINDING, registry);
  assert.ok(dto);
  const vdoc = validatorsFromDtoDocument(dto!);
  assert.deepEqual(
    vdoc.validators.map((v) => v.name),
    dto!.models.map((m) => m.name),
  );
  assert.deepEqual(vdoc.payloadFamilyTypeNames, dto!.payloadFamilyTypeNames);
  // Dependencies carried through.
  const thing = vdoc.validators.find((v) => v.name === "ThingRecord");
  assert.deepEqual(thing?.dependencies, [`${DC}/Address`]);
});

test("constraints propagate into the validator model (structural constraints preserved)", () => {
  const registry = reg(syntheticDocs());
  const doc = buildContractValidators("API-999", THING_BINDING, registry)!;
  const thing = doc.validators.find((v) => v.name === "ThingRecord")!;
  assert.equal(thing.root.kind, "object");
  const fields = thing.root.kind === "object" ? thing.root.fields : [];
  const key = fields.find((f) => f.name === "key")!;
  assert.equal(key.node.kind, "primitive");
  assert.equal(key.required, true);
  if (key.node.kind === "primitive") {
    assert.deepEqual(key.node.constraints, { minLength: 1, maxLength: 8 });
  }
  const tags = fields.find((f) => f.name === "tags")!;
  if (tags.node.kind === "array") {
    assert.deepEqual(tags.node.constraints, { minItems: 1, uniqueItems: true });
  }
  const home = fields.find((f) => f.name === "home")!;
  assert.equal(home.node.kind, "reference");
  if (home.node.kind === "reference") {
    assert.equal(home.node.typeName, "Address"); // build-time resolved
    assert.equal(home.node.ref, `${DC}/Address`);
  }
});

// ---------------------------------------------------------------------------
// Fail-closed (builder)
// ---------------------------------------------------------------------------

test("buildContractValidators fails closed (null) on a missing family", () => {
  const registry = reg(syntheticDocs());
  assert.equal(buildContractValidators("API-999", [{ family: "Unknown", dataContract: DC }], registry), null);
});

test("buildContractValidators fails closed (null) on a broken reference", () => {
  const registry = reg([
    fieldSchemaDoc(`${DC}/ThingRecord`, "ThingRecord", DC, {
      kind: "object",
      properties: [{ name: "x", required: true, schema: { kind: "reference", ref: `${DC}/NOPE` } }],
    }),
  ]);
  assert.equal(buildContractValidators("API-999", THING_BINDING, registry), null);
});

test("buildContractValidators fails closed (null) on a dependency cycle", () => {
  const registry = reg([
    fieldSchemaDoc(`${DC}/ThingRecord`, "ThingRecord", DC, {
      kind: "object",
      properties: [{ name: "b", required: true, schema: { kind: "reference", ref: `${DC}/B` } }],
    }),
    fieldSchemaDoc(`${DC}/B`, "B", DC, {
      kind: "object",
      properties: [{ name: "a", required: true, schema: { kind: "reference", ref: `${DC}/ThingRecord` } }],
    }),
  ]);
  assert.equal(buildContractValidators("API-999", THING_BINDING, registry), null);
});

// ---------------------------------------------------------------------------
// Emitter correctness
// ---------------------------------------------------------------------------

test("emits the validator artifact set (runtime kernel, per-contract files, barrels)", () => {
  const files = fileMap(generateWith(syntheticDocs()).files);
  for (const rel of [
    "validators/_runtime.ts",
    "validators/api-999/models.ts",
    "validators/api-999/requests.ts",
    "validators/api-999/responses.ts",
    "validators/api-999/errors.ts",
    "validators/api-999/index.ts",
    "validators/index.ts",
  ]) {
    assert.ok(files.has(rel), `missing validator artifact: ${rel}`);
  }
});

test("emitted models declare a validate<Name> per resolved model + transitive dependency", () => {
  const models = fileMap(generateWith(syntheticDocs()).files).get("validators/api-999/models.ts") ?? "";
  assert.match(models, /export function validateThingRecord\(value: unknown\): ValidationResult/);
  assert.match(models, /export function validateAddress\(value: unknown\): ValidationResult/);
});

test("reference fields dispatch to the sibling validator (validate<Ref>Into)", () => {
  const models = fileMap(generateWith(syntheticDocs()).files).get("validators/api-999/models.ts") ?? "";
  assert.match(models, /validateAddressInto\(c, p \+ "\.home", /);
});

test("structural constraints are emitted as checks (no business logic)", () => {
  const models = fileMap(generateWith(syntheticDocs()).files).get("validators/api-999/models.ts") ?? "";
  assert.match(models, /checkString\(c, p \+ "\.key", t0\["key"\], \{ minLength: 1, maxLength: 8 \}\);/);
  assert.match(models, /checkNumber\(c, p \+ "\.count", t1, \{ integer: true, minimum: 0 \}\);/);
  assert.match(models, /checkArray\(c, p \+ "\.tags", t2, \{ minItems: 1, uniqueItems: true \}\);/);
  assert.match(models, /checkEnum\(c, p \+ "\.status", t6, \["active","inactive"\]\);/);
  // additionalProperties:false ⇒ unknown-key rejection.
  assert.match(models, /"additionalProperty"/);
});

test("request/response validators alias model validators and import DTO types", () => {
  const files = fileMap(generateWith(syntheticDocs()).files);
  const requests = files.get("validators/api-999/requests.ts") ?? "";
  assert.match(requests, /import type \{\s*ThingRecordRequestDTO,\s*\} from "\.\.\/\.\.\/dto\/api-999\/requests\.ts";/);
  assert.match(requests, /export const validateThingRecordRequestDTO: Validator<ThingRecordRequestDTO> = validateThingRecord;/);
  const responses = files.get("validators/api-999/responses.ts") ?? "";
  assert.match(responses, /export const validateThingRecordResponseDTO: Validator<ThingRecordResponseDTO> = validateThingRecord;/);
});

test("error validator is fail-closed (no error model invented)", () => {
  const errors = fileMap(generateWith(syntheticDocs()).files).get("validators/api-999/errors.ts") ?? "";
  assert.match(errors, /export function validateApi999ErrorDTO\(_value: unknown\): ValidationResult/);
  assert.match(errors, /"no-error-model"/);
});

test("aggregate validator barrel re-exports the shared kernel and each contract", () => {
  const index = fileMap(generateWith(syntheticDocs()).files).get("validators/index.ts") ?? "";
  assert.match(index, /export \* from "\.\/_runtime\.ts";/);
  assert.match(index, /export \* from "\.\/api-999\/index\.ts";/);
});

// ---------------------------------------------------------------------------
// Determinism
// ---------------------------------------------------------------------------

test("validator generation is deterministic (byte-identical file map across runs)", () => {
  const a = JSON.stringify(generateWith(syntheticDocs()).files);
  const b = JSON.stringify(generateWith(syntheticDocs()).files);
  assert.equal(a, b);
});

// ---------------------------------------------------------------------------
// Fail-closed (integration) — zero validator artifacts emitted
// ---------------------------------------------------------------------------

test("empty registry emits zero validator artifacts (validators BLOCKED)", () => {
  const result = generate({ inventories: [asInventory(validInventory())], registry: loadSchemaRegistry() });
  assert.equal(result.report.contracts[0]?.stage3_targets.validators, "BLOCKED");
  assert.equal(result.files.filter((f) => f.relPath.startsWith("validators/")).length, 0);
});

test("broken reference emits zero validator artifacts", () => {
  const result = generateWith([
    fieldSchemaDoc(`${DC}/ThingRecord`, "ThingRecord", DC, {
      kind: "object",
      properties: [{ name: "x", required: true, schema: { kind: "reference", ref: `${DC}/NOPE` } }],
    }),
  ]);
  assert.equal(result.files.filter((f) => f.relPath.startsWith("validators/")).length, 0);
});

test("dependency cycle emits zero validator artifacts", () => {
  const result = generateWith([
    fieldSchemaDoc(`${DC}/ThingRecord`, "ThingRecord", DC, {
      kind: "object",
      properties: [{ name: "b", required: true, schema: { kind: "reference", ref: `${DC}/B` } }],
    }),
    fieldSchemaDoc(`${DC}/B`, "B", DC, {
      kind: "object",
      properties: [{ name: "a", required: true, schema: { kind: "reference", ref: `${DC}/ThingRecord` } }],
    }),
  ]);
  assert.equal(result.files.filter((f) => f.relPath.startsWith("validators/")).length, 0);
});

test("incomplete payload family emits zero validator artifacts (BLOCKED)", () => {
  const raw = JSON.parse(JSON.stringify(validInventory())) as JsonValue;
  const contract = (raw as Record<string, JsonValue>)["contract"] as Record<string, JsonValue>;
  const dcd = contract["dataContractDetail"] as Record<string, JsonValue>;
  dcd["payloadFamilies"] = ["ThingRecord", "OtherRecord"];
  const result = generate({
    inventories: [asInventory(raw)],
    registry: loadSchemaRegistry(),
    fieldSchemas: reg(syntheticDocs()), // only ThingRecord/Address registered
  });
  assert.equal(result.report.contracts[0]?.stage3_targets.validators, "BLOCKED");
  assert.equal(result.files.filter((f) => f.relPath.startsWith("validators/")).length, 0);
});

// ---------------------------------------------------------------------------
// Regression protection
// ---------------------------------------------------------------------------

test("default (empty) registry keeps validators BLOCKED and emits no validators/* (WI-09 parity)", () => {
  const result = generate({ inventories: [asInventory(validInventory())], registry: loadSchemaRegistry() });
  const c = result.report.contracts[0];
  assert.equal(c?.stage3_targets.validators, "BLOCKED");
  assert.equal(c?.stage3_targets.dtos, "BLOCKED");
  assert.equal(result.files.filter((f) => f.relPath.startsWith("validators/")).length, 0);
  assert.equal(result.files.filter((f) => f.relPath.startsWith("dto/")).length, 0);
});

test("populated registry emits DTOs AND validators together (both SUFFICIENT)", () => {
  const result = generateWith(syntheticDocs());
  const c = result.report.contracts[0];
  assert.equal(c?.stage3_targets.dtos, "SUFFICIENT");
  assert.equal(c?.stage3_targets.validators, "SUFFICIENT");
  assert.ok(result.files.some((f) => f.relPath.startsWith("dto/api-999/")));
  assert.ok(result.files.some((f) => f.relPath.startsWith("validators/api-999/")));
});

// ---------------------------------------------------------------------------
// Runtime behavior — dynamically import the emitted validators and execute them
// ---------------------------------------------------------------------------

test("generated validators enforce structure at runtime (accept valid, reject invalid)", async () => {
  const files = generateWith(syntheticDocs()).files;
  const dir = mkdtempSync(join(tmpdir(), "ucos-wi10-"));
  try {
    writeFileSync(join(dir, "package.json"), '{"type":"module"}');
    for (const f of files) {
      if (!f.relPath.startsWith("validators/") && !f.relPath.startsWith("dto/")) continue;
      const abs = join(dir, f.relPath);
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, f.content, "utf8");
    }
    const mod = (await import(pathToFileURL(join(dir, "validators/api-999/models.ts")).href)) as {
      validateThingRecord: (v: unknown) => { valid: boolean; issues: readonly { path: string; code: string }[] };
      validateAddress: (v: unknown) => { valid: boolean; issues: readonly { path: string; code: string }[] };
    };

    // Accept valid.
    assert.equal(mod.validateThingRecord({ key: "abc" }).valid, true);
    assert.equal(mod.validateThingRecord({ key: "k", count: 3, tags: ["a", "b"], status: "active", home: { street: "s" } }).valid, true);
    assert.equal(mod.validateThingRecord({ key: "k", home: { street: "s", zip: null } }).valid, true); // nullable field
    assert.equal(mod.validateAddress({ street: "s" }).valid, true);

    // Reject invalid — assert precise code + path.
    const cases: readonly [unknown, string, string][] = [
      [{}, "$.key", "required"],
      [{ key: 5 }, "$.key", "type"],
      [{ key: "" }, "$.key", "minLength"],
      [{ key: "123456789" }, "$.key", "maxLength"],
      [{ key: "k", count: -1 }, "$.count", "minimum"],
      [{ key: "k", count: 1.5 }, "$.count", "type"],
      [{ key: "k", status: "nope" }, "$.status", "enum"],
      [{ key: "k", tags: [] }, "$.tags", "minItems"],
      [{ key: "k", tags: ["x", "x"] }, "$.tags[1]", "uniqueItems"],
      [{ key: "k", extra: 1 }, "$.extra", "additionalProperty"],
      [{ key: "k", home: { street: 9 } }, "$.home.street", "type"],
      ["nope", "$", "type"],
    ];
    for (const [value, path, code] of cases) {
      const r = mod.validateThingRecord(value);
      assert.equal(r.valid, false, `expected invalid: ${JSON.stringify(value)}`);
      assert.ok(
        r.issues.some((i) => i.path === path && i.code === code),
        `expected issue {path:${path}, code:${code}} for ${JSON.stringify(value)}, got ${JSON.stringify(r.issues)}`,
      );
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
