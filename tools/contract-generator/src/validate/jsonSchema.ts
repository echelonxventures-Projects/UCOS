/**
 * Contract Skeleton Generator — offline JSON-Schema subset validator (WI-07, Stage 1 engine).
 *
 * A small, dependency-free, DETERMINISTIC interpreter for the subset of JSON Schema
 * (draft 2020-12) actually used by the UCOS contract meta-schema:
 *   type · properties · required · additionalProperties(false) · enum · const ·
 *   pattern · minLength · items · oneOf · $ref (local `#/...` and cross-file `file.json[#/...]`).
 *
 * It validates the meta-schema AS DATA (registry-driven) — no contract shape is hard-coded
 * here. Annotations ($id, dialect, title, description, $comment, default) are ignored.
 * Unknown properties under `additionalProperties:false` FAIL (fail-closed). No network access.
 *
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md §3 (Stage 1) · UCOS-CONTRACT-CAT-001 · IC-2.
 */

import type { Failure, JsonValue } from "../types.ts";

/** A schema node is a JSON object of keywords. */
export type SchemaObject = { readonly [key: string]: JsonValue };

/** Registry of schema documents keyed by bare filename (the key used in cross-file `$ref`s). */
export type SchemaRegistry = ReadonlyMap<string, SchemaObject>;

/** Narrowing guard for a non-null, non-array JSON object. */
export function isObject(v: JsonValue | undefined): v is SchemaObject {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function matchesType(value: JsonValue, type: string): boolean {
  switch (type) {
    case "object":
      return isObject(value);
    case "array":
      return Array.isArray(value);
    case "string":
      return typeof value === "string";
    case "boolean":
      return typeof value === "boolean";
    case "number":
      return typeof value === "number";
    case "null":
      return value === null;
    default:
      return true;
  }
}

function childPath(base: string, key: string | number): string {
  return base === "" ? `/${key}` : `${base}/${key}`;
}

interface RefTarget {
  readonly file: string;
  readonly node: SchemaObject;
}

/** Resolve a `$ref` (local or cross-file) to its target node, relative to the current file. */
function resolveRef(
  ref: string,
  currentFile: string,
  registry: SchemaRegistry,
): RefTarget {
  const hashIdx = ref.indexOf("#");
  const filePart = hashIdx === -1 ? ref : ref.slice(0, hashIdx);
  const pointer = hashIdx === -1 ? "" : ref.slice(hashIdx + 1);
  const file = filePart === "" ? currentFile : filePart;
  const root = registry.get(file);
  if (!isObject(root)) {
    throw new Error(`Unresolvable $ref '${ref}': unknown schema file '${file}'`);
  }
  if (pointer === "") {
    return { file, node: root };
  }
  const segments = pointer.split("/").filter((s) => s.length > 0);
  let cursor: JsonValue = root;
  for (const seg of segments) {
    if (!isObject(cursor)) {
      throw new Error(`Unresolvable $ref '${ref}': path segment '${seg}' is not an object`);
    }
    const next: JsonValue | undefined = cursor[seg];
    if (next === undefined) {
      throw new Error(`Unresolvable $ref '${ref}': segment '${seg}' not found`);
    }
    cursor = next;
  }
  if (!isObject(cursor)) {
    throw new Error(`Unresolvable $ref '${ref}': target is not a schema object`);
  }
  return { file, node: cursor };
}

function validateNode(
  value: JsonValue,
  node: SchemaObject,
  currentFile: string,
  instancePath: string,
  registry: SchemaRegistry,
  failures: Failure[],
): void {
  // $ref — resolve and validate against the target (siblings are annotations only).
  const ref = node["$ref"];
  if (typeof ref === "string") {
    const resolved = resolveRef(ref, currentFile, registry);
    validateNode(value, resolved.node, resolved.file, instancePath, registry, failures);
    return;
  }

  // oneOf — at least one branch must match.
  //
  // NOTE: the UCOS meta-schema uses `oneOf` with intentionally overlapping branches
  // (e.g. `placeholderState | {type:string}`, where a placeholder token IS also a string).
  // The ratified catalog + WI-06 conformance treat such a union as satisfiable, so this
  // engine applies "at least one branch matches" semantics (fail-closed only when NONE match).
  const oneOf = node["oneOf"];
  if (Array.isArray(oneOf)) {
    let matches = 0;
    for (const sub of oneOf) {
      if (!isObject(sub)) continue;
      const branchFailures: Failure[] = [];
      validateNode(value, sub, currentFile, instancePath, registry, branchFailures);
      if (branchFailures.length === 0) matches += 1;
    }
    if (matches === 0) {
      failures.push({
        path: instancePath,
        reason: `value ${JSON.stringify(value)} matches no 'oneOf' branch`,
      });
    }
    return;
  }

  // type
  const type = node["type"];
  if (typeof type === "string" && !matchesType(value, type)) {
    failures.push({ path: instancePath, reason: `expected type '${type}'` });
    return; // downstream keyword checks are meaningless on a type mismatch
  }

  // const
  if ("const" in node && value !== node["const"]) {
    failures.push({
      path: instancePath,
      reason: `expected const ${JSON.stringify(node["const"])}`,
    });
  }

  // enum
  const enumValues = node["enum"];
  if (Array.isArray(enumValues) && !enumValues.some((e) => e === value)) {
    failures.push({
      path: instancePath,
      reason: `value ${JSON.stringify(value)} not in enum ${JSON.stringify(enumValues)}`,
    });
  }

  // string constraints
  if (typeof value === "string") {
    const pattern = node["pattern"];
    if (typeof pattern === "string" && !new RegExp(pattern).test(value)) {
      failures.push({ path: instancePath, reason: `string does not match pattern /${pattern}/` });
    }
    const minLength = node["minLength"];
    if (typeof minLength === "number" && value.length < minLength) {
      failures.push({ path: instancePath, reason: `string shorter than minLength ${minLength}` });
    }
  }

  // array items
  if (Array.isArray(value)) {
    const items = node["items"];
    if (isObject(items)) {
      for (let i = 0; i < value.length; i += 1) {
        const element = value[i];
        if (element === undefined) continue;
        validateNode(element, items, currentFile, childPath(instancePath, i), registry, failures);
      }
    }
  }

  // object properties / required / additionalProperties
  if (isObject(value)) {
    const properties = node["properties"];
    const props = isObject(properties) ? properties : undefined;

    const required = node["required"];
    if (Array.isArray(required)) {
      for (const r of required) {
        if (typeof r === "string" && !(r in value)) {
          failures.push({ path: childPath(instancePath, r), reason: `missing required property '${r}'` });
        }
      }
    }

    const additional = node["additionalProperties"];
    for (const key of Object.keys(value).sort()) {
      const child = value[key];
      if (child === undefined) continue;
      const propSchema = props ? props[key] : undefined;
      if (isObject(propSchema)) {
        validateNode(child, propSchema, currentFile, childPath(instancePath, key), registry, failures);
      } else if (additional === false) {
        failures.push({ path: childPath(instancePath, key), reason: `additional property '${key}' not permitted` });
      }
    }
  }
}

/**
 * Validate a JSON value against the root of a registered schema file.
 * Returns an ordered list of failures (empty ⇒ PASS). Throws only on an unresolvable `$ref`
 * (a defect in the schema registry itself), which the caller treats as fail-closed.
 */
export function validateValue(
  value: JsonValue,
  rootFile: string,
  registry: SchemaRegistry,
): readonly Failure[] {
  const root = registry.get(rootFile);
  if (!isObject(root)) {
    throw new Error(`Unknown root schema file '${rootFile}'`);
  }
  const failures: Failure[] = [];
  validateNode(value, root, rootFile, "", registry, failures);
  return failures;
}
