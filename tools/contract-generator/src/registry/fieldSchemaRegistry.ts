/**
 * Contract Skeleton Generator — Field-Schema Registry Layer (WI-08).
 *
 * The single, registry-driven source of field-level payload schemas. Generator logic NEVER
 * references a field schema directly: it asks the registry to discover, validate, and resolve.
 *
 * Responsibilities (WI-08 WS3):
 *   Discovery            — load `*.fieldschema.json` from contracts/field-schemas/ (tolerant of a
 *                          missing/empty directory; deterministic ordering).
 *   Validation           — structural (against field-schema.schema.json) + semantic (duplicate
 *                          id@version, dangling references, dependency cycles).
 *   Version Resolution   — resolve an id to an exact version or the highest available (semver).
 *   Dependency Resolution— transitively resolve `reference` nodes; report missing refs / cycles.
 *
 * WI-08 ships the registry EMPTY (no invented business payloads). With an empty registry the
 * sufficiency engine keeps every target BLOCKED/PARTIAL, so WI-07 output regenerates identically.
 *
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md · UCOS-PDATA-ARCH-001 · UCOS-CONTRACT-CAT-001 · IC-2.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fieldSchemaMetaFile, fieldSchemasDir, schemaDir } from "../paths.ts";
import { isObject, validateValue } from "../validate/jsonSchema.ts";
import type { SchemaObject, SchemaRegistry } from "../validate/jsonSchema.ts";
import type { Failure, JsonValue, StageVerdict } from "../types.ts";
import type {
  ArrayFieldSchema,
  EnumFieldSchema,
  FieldSchemaDefinition,
  FieldSchemaNode,
  ObjectFieldSchema,
  ObjectPropertySchema,
  PrimitiveFieldSchema,
  ReferenceFieldSchema,
} from "../../model/FieldSchemaModel.ts";

/** A field-schema document paired with a stable source id (for deterministic reporting). */
export interface LoadedFieldSchema {
  readonly sourceId: string;
  readonly raw: JsonValue;
}

/** Outcome of transitively resolving one definition's dependency graph. */
export interface DependencyResolution {
  /** Transitive dependency ids (excluding the root), all present in the registry. */
  readonly resolved: readonly string[];
  /** Referenced ids that are absent from the registry. */
  readonly missing: readonly string[];
  /** A dependency cycle path (ids), or null when acyclic. */
  readonly cycle: readonly string[] | null;
  /** true when there are no missing refs and no cycle. */
  readonly ok: boolean;
}

export interface RegistryValidationResult {
  readonly verdict: StageVerdict;
  readonly failures: readonly Failure[];
}

/** The read-only registry surface consumed by the generator. */
export interface FieldSchemaRegistry {
  /** Number of distinct, structurally-valid definitions (all versions counted). */
  readonly size: number;
  /** Every valid definition, in deterministic order (by id, then version ascending). */
  list(): readonly FieldSchemaDefinition[];
  /** Distinct ids present, sorted. */
  ids(): readonly string[];
  /** True when at least one version of `id` is present. */
  has(id: string): boolean;
  /** Resolve `id` to an exact version or (when omitted) the highest available. */
  resolve(id: string, version?: string): FieldSchemaDefinition | undefined;
  /** Resolve by catalog binding: payload family (+ optional owning data contract). */
  resolvePayloadFamily(family: string, dataContract?: string): FieldSchemaDefinition | undefined;
  /** Direct (non-transitive) reference ids of a definition. */
  directDependencies(id: string, version?: string): readonly string[];
  /** Transitive dependency resolution with missing/cycle detection. */
  resolveDependencies(id: string, version?: string): DependencyResolution;
  /** Registry-wide validation: structural + semantic. Deterministic, fail-closed. */
  validate(): RegistryValidationResult;
}

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

const FIELD_SCHEMA_SUFFIX = ".fieldschema.json";

/** Load the field-schema meta-schema into a one-entry SchemaRegistry (self-contained). */
export function loadFieldSchemaMetaRegistry(dir: string = schemaDir): SchemaRegistry {
  const abs = join(dir, fieldSchemaMetaFile);
  let parsed: JsonValue;
  try {
    parsed = JSON.parse(readFileSync(abs, "utf8")) as JsonValue;
  } catch (cause) {
    throw new Error(`Cannot load field-schema meta-schema from ${abs}`, { cause });
  }
  if (!isObject(parsed)) {
    throw new Error(`Field-schema meta-schema '${fieldSchemaMetaFile}' is not a JSON object`);
  }
  const map = new Map<string, SchemaObject>();
  map.set(fieldSchemaMetaFile, parsed);
  return map;
}

/** Discover field-schema documents from a directory. Returns [] if the directory is missing/empty. */
export function discoverFieldSchemas(dir: string = fieldSchemasDir): readonly LoadedFieldSchema[] {
  let entries: readonly string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  const files = entries.filter((name) => name.endsWith(FIELD_SCHEMA_SUFFIX)).sort();
  const loaded: LoadedFieldSchema[] = [];
  for (const name of files) {
    const abs = join(dir, name);
    let parsed: JsonValue;
    try {
      parsed = JSON.parse(readFileSync(abs, "utf8")) as JsonValue;
    } catch (cause) {
      throw new Error(`Cannot parse field-schema file '${name}' in ${dir}`, { cause });
    }
    loaded.push({ sourceId: `contracts/field-schemas/${name}`, raw: parsed });
  }
  return loaded;
}

// ---------------------------------------------------------------------------
// Narrowing (post structural-validation)
// ---------------------------------------------------------------------------

function asString(v: JsonValue | undefined): string | undefined {
  return typeof v === "string" ? v : undefined;
}
function asBool(v: JsonValue | undefined): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

function narrowNode(raw: SchemaObject): FieldSchemaNode {
  const kind = asString(raw["kind"]);
  const nullable = asBool(raw["nullable"]);
  const description = asString(raw["description"]);
  switch (kind) {
    case "primitive": {
      const node: PrimitiveFieldSchema = {
        kind: "primitive",
        type: (asString(raw["type"]) ?? "string") as PrimitiveFieldSchema["type"],
        ...(nullable !== undefined ? { nullable } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(isObject(raw["constraints"]) ? { constraints: { ...raw["constraints"] } } : {}),
      };
      return node;
    }
    case "enum": {
      const values = Array.isArray(raw["values"])
        ? raw["values"].filter((v): v is string | number => typeof v === "string" || typeof v === "number")
        : [];
      const node: EnumFieldSchema = {
        kind: "enum",
        base: (asString(raw["base"]) ?? "string") as EnumFieldSchema["base"],
        values,
        ...(nullable !== undefined ? { nullable } : {}),
        ...(description !== undefined ? { description } : {}),
      };
      return node;
    }
    case "array": {
      const items = isObject(raw["items"]) ? narrowNode(raw["items"]) : PRIMITIVE_FALLBACK;
      const node: ArrayFieldSchema = {
        kind: "array",
        items,
        ...(nullable !== undefined ? { nullable } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(isObject(raw["constraints"]) ? { constraints: { ...raw["constraints"] } } : {}),
      };
      return node;
    }
    case "object": {
      const rawProps = Array.isArray(raw["properties"]) ? raw["properties"] : [];
      const properties: ObjectPropertySchema[] = [];
      for (const p of rawProps) {
        if (!isObject(p)) continue;
        const name = asString(p["name"]);
        const schemaRaw = p["schema"];
        if (name === undefined || !isObject(schemaRaw)) continue;
        properties.push({
          name,
          schema: narrowNode(schemaRaw),
          required: asBool(p["required"]) ?? false,
        });
      }
      const node: ObjectFieldSchema = {
        kind: "object",
        properties,
        ...(asBool(raw["additionalProperties"]) !== undefined
          ? { additionalProperties: asBool(raw["additionalProperties"]) }
          : {}),
        ...(nullable !== undefined ? { nullable } : {}),
        ...(description !== undefined ? { description } : {}),
      };
      return node;
    }
    case "reference":
    default: {
      const node: ReferenceFieldSchema = {
        kind: "reference",
        ref: asString(raw["ref"]) ?? "",
        ...(asString(raw["version"]) !== undefined ? { version: asString(raw["version"]) } : {}),
        ...(nullable !== undefined ? { nullable } : {}),
        ...(description !== undefined ? { description } : {}),
      };
      return node;
    }
  }
}

const PRIMITIVE_FALLBACK: PrimitiveFieldSchema = { kind: "primitive", type: "string" };

function narrowDefinition(raw: SchemaObject): FieldSchemaDefinition {
  const schemaRaw = raw["schema"];
  return {
    fieldSchemaModelVersion: "ucos-field-schema/1.0.0",
    id: asString(raw["id"]) ?? "",
    version: asString(raw["version"]) ?? "0.0.0",
    ...(asString(raw["payloadFamily"]) !== undefined ? { payloadFamily: asString(raw["payloadFamily"]) } : {}),
    ...(asString(raw["dataContract"]) !== undefined ? { dataContract: asString(raw["dataContract"]) } : {}),
    ...(asString(raw["title"]) !== undefined ? { title: asString(raw["title"]) } : {}),
    ...(asString(raw["description"]) !== undefined ? { description: asString(raw["description"]) } : {}),
    schema: isObject(schemaRaw) ? narrowNode(schemaRaw) : PRIMITIVE_FALLBACK,
  };
}

// ---------------------------------------------------------------------------
// Version comparison (semver X.Y.Z)
// ---------------------------------------------------------------------------

/** Compare two "X.Y.Z" versions numerically. Returns <0, 0, >0. Non-numeric parts sort as 0. */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => Number.parseInt(n, 10));
  const pb = b.split(".").map((n) => Number.parseInt(n, 10));
  for (let i = 0; i < 3; i += 1) {
    const va = Number.isFinite(pa[i]) ? (pa[i] as number) : 0;
    const vb = Number.isFinite(pb[i]) ? (pb[i] as number) : 0;
    if (va !== vb) return va - vb;
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Dependency graph helpers
// ---------------------------------------------------------------------------

/** Collect the direct reference ids used anywhere within a node tree. */
function collectRefs(node: FieldSchemaNode, out: Set<string>): void {
  switch (node.kind) {
    case "reference":
      out.add(node.ref);
      return;
    case "array":
      collectRefs(node.items, out);
      return;
    case "object":
      for (const p of node.properties) collectRefs(p.schema, out);
      return;
    default:
      return;
  }
}

// ---------------------------------------------------------------------------
// Registry construction
// ---------------------------------------------------------------------------

interface InternalEntry {
  readonly definition: FieldSchemaDefinition;
  readonly sourceId: string;
}

/** Build a registry from already-loaded documents + a meta-schema registry. Pure & deterministic. */
export function buildFieldSchemaRegistry(
  sources: readonly LoadedFieldSchema[],
  metaRegistry: SchemaRegistry,
): FieldSchemaRegistry {
  const structuralFailures: Failure[] = [];
  const entries: InternalEntry[] = [];

  // 1) Structural validation + narrowing.
  for (const src of sources) {
    let failures: readonly Failure[];
    try {
      failures = validateValue(src.raw, fieldSchemaMetaFile, metaRegistry);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      failures = [{ path: src.sourceId, reason: `field-schema validation aborted: ${reason}` }];
    }
    if (failures.length > 0) {
      for (const f of failures) {
        structuralFailures.push({ path: `${src.sourceId}${f.path}`, reason: f.reason });
      }
      continue;
    }
    if (isObject(src.raw)) {
      entries.push({ definition: narrowDefinition(src.raw), sourceId: src.sourceId });
    }
  }

  // 2) Index by id -> versions (ascending), by id@version, and by binding key.
  const byId = new Map<string, InternalEntry[]>();
  const byIdVersion = new Map<string, InternalEntry>();
  const byBinding = new Map<string, InternalEntry[]>();
  const semanticFailures: Failure[] = [];

  for (const entry of entries) {
    const { id, version, payloadFamily, dataContract } = entry.definition;
    const key = `${id}@${version}`;
    if (byIdVersion.has(key)) {
      semanticFailures.push({
        path: entry.sourceId,
        reason: `duplicate field-schema id@version '${key}'`,
      });
      continue;
    }
    byIdVersion.set(key, entry);
    const list = byId.get(id) ?? [];
    list.push(entry);
    byId.set(id, list);
    if (payloadFamily !== undefined) {
      const bindKey = dataContract !== undefined ? `${dataContract}/${payloadFamily}` : payloadFamily;
      const blist = byBinding.get(bindKey) ?? [];
      blist.push(entry);
      byBinding.set(bindKey, blist);
      // Also index by bare family for lenient lookup when no data contract is supplied.
      if (dataContract !== undefined) {
        const flist = byBinding.get(payloadFamily) ?? [];
        flist.push(entry);
        byBinding.set(payloadFamily, flist);
      }
    }
  }

  for (const list of byId.values()) {
    list.sort((a, b) => compareVersions(a.definition.version, b.definition.version));
  }

  function highest(list: readonly InternalEntry[]): InternalEntry | undefined {
    return list.length === 0 ? undefined : list[list.length - 1];
  }

  function resolve(id: string, version?: string): FieldSchemaDefinition | undefined {
    if (version !== undefined) return byIdVersion.get(`${id}@${version}`)?.definition;
    return highest(byId.get(id) ?? [])?.definition;
  }

  function resolvePayloadFamily(
    family: string,
    dataContract?: string,
  ): FieldSchemaDefinition | undefined {
    const key = dataContract !== undefined ? `${dataContract}/${family}` : family;
    const exact = highest(byBinding.get(key) ?? []);
    if (exact) return exact.definition;
    // Fall back to bare family binding when a qualified key was requested but not found.
    if (dataContract !== undefined) return highest(byBinding.get(family) ?? [])?.definition;
    return undefined;
  }

  function directDependencies(id: string, version?: string): readonly string[] {
    const def = resolve(id, version);
    if (!def) return [];
    const refs = new Set<string>();
    collectRefs(def.schema, refs);
    return [...refs].sort();
  }

  function resolveDependencies(id: string, version?: string): DependencyResolution {
    const root = resolve(id, version);
    if (!root) {
      return { resolved: [], missing: [id], cycle: null, ok: false };
    }
    const resolved = new Set<string>();
    const missing = new Set<string>();
    let cycle: string[] | null = null;

    const visit = (curId: string, stack: string[]): void => {
      if (cycle) return;
      if (stack.includes(curId)) {
        cycle = [...stack.slice(stack.indexOf(curId)), curId];
        return;
      }
      const def = resolve(curId);
      if (!def) {
        missing.add(curId);
        return;
      }
      const refs = new Set<string>();
      collectRefs(def.schema, refs);
      for (const ref of [...refs].sort()) {
        if (ref !== id) resolved.add(ref);
        visit(ref, [...stack, curId]);
      }
    };

    visit(id, []);
    const ok = missing.size === 0 && cycle === null;
    return {
      resolved: [...resolved].sort(),
      missing: [...missing].sort(),
      cycle,
      ok,
    };
  }

  function validate(): RegistryValidationResult {
    const failures: Failure[] = [...structuralFailures, ...semanticFailures];
    // Dependency + cycle checks over every distinct id.
    for (const id of [...byId.keys()].sort()) {
      const dep = resolveDependencies(id);
      for (const m of dep.missing) {
        failures.push({ path: id, reason: `dangling field-schema reference '${m}'` });
      }
      if (dep.cycle) {
        failures.push({ path: id, reason: `field-schema dependency cycle: ${dep.cycle.join(" -> ")}` });
      }
    }
    return { verdict: failures.length === 0 ? "PASS" : "FAIL", failures };
  }

  const allDefs = entries
    .map((e) => e.definition)
    .sort((a, b) => (a.id === b.id ? compareVersions(a.version, b.version) : a.id < b.id ? -1 : 1));

  return {
    size: allDefs.length,
    list: () => allDefs,
    ids: () => [...byId.keys()].sort(),
    has: (id: string) => byId.has(id),
    resolve,
    resolvePayloadFamily,
    directDependencies,
    resolveDependencies,
    validate,
  };
}

/** Load + build the on-disk field-schema registry. Empty when the directory is missing/empty. */
export function loadFieldSchemaRegistry(
  dir: string = fieldSchemasDir,
  metaDir: string = schemaDir,
): FieldSchemaRegistry {
  const meta = loadFieldSchemaMetaRegistry(metaDir);
  const sources = discoverFieldSchemas(dir);
  return buildFieldSchemaRegistry(sources, meta);
}

/** An immutable empty registry (used as the default when no registry is supplied). */
export const EMPTY_FIELD_SCHEMA_REGISTRY: FieldSchemaRegistry = buildFieldSchemaRegistry([], new Map());
