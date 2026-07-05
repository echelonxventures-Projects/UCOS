/**
 * Shared harness for the L4 persistence verification suites. Not a test file (no ".test.ts").
 *
 * Provides: fresh temp directories, a durable-substrate builder that is safe to call again after a
 * simulated restart (it does not re-load already-registered descriptors), canonical state snapshots,
 * and a deterministic canonical serializer for identical-state assertions.
 */

import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createSubstrate, rehydrate, type Substrate } from "../src/bootstrap.ts";
import type { CapabilityInstance, Descriptor, JsonSchema } from "../src/contracts/types.ts";
import { FileAppendOnlyLog } from "../src/persistence-runtime/append-only-log.ts";

export const textContract: Descriptor = {
  kind: "contract",
  id: "contract.text-producer",
  version: "1.0.0",
  operations: [
    {
      name: "produce",
      input: { type: "object", properties: { subject: { type: "string" } }, additionalProperties: false },
      output: { type: "string" },
    },
  ],
};

export const shoutCapability: Descriptor = {
  kind: "capability",
  id: "cap.shout",
  version: "1.0.0",
  name: "Shout",
  contract: { id: "contract.text-producer", versionRange: "^1.0.0" },
  provider: { module: "plugin:shout", export: "create" },
};

const shoutProvider = (): CapabilityInstance => ({
  operations: { produce: (input) => `${(input as { subject?: string })?.subject ?? ""}!`.toUpperCase() },
});

/** Create a unique, empty temp directory for a durable substrate's logs. */
export function freshDir(): string {
  return mkdtempSync(join(tmpdir(), "ucos-l4-"));
}

/** Best-effort recursive cleanup of a temp directory. */
export function cleanup(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
}

/**
 * Build (or re-open after a restart) a durable substrate over `directory`.
 *
 * Providers and descriptors are code/repository artifacts, so they are (re)applied on every boot to
 * deterministically rebuild DERIVED state (lifecycle + composition graph). The durable ports converge
 * idempotently: re-registering / re-putting identical descriptor state after replay is a no-op.
 * Authoritative runtime mutations (metadata / configuration writes) are restored from the log.
 */
export async function bootDurable(directory: string): Promise<Substrate> {
  const substrate = createSubstrate({ persistence: { directory } });
  substrate.kernel.registerProvider("shout", shoutProvider);
  substrate.kernel.loadDescriptors([textContract, shoutCapability]);
  await rehydrate(substrate);
  return substrate;
}

/** Deterministic canonical serialization: object keys are recursively sorted. */
export function canonical(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === "object") {
    const source = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(source).sort()) out[key] = sortKeys(source[key]);
    return out;
  }
  return value;
}

/**
 * Capture the full authoritative state of a substrate as a canonical, comparable structure:
 * every metadata record, every registry record, and the resolved configuration for the given
 * capability ids plus the layer order.
 */
export function snapshotState(substrate: Substrate, configCapabilityIds: string[] = ["cap.shout"]): unknown {
  const metadata = substrate.metadata
    .query("")
    .map((r) => ({ key: r.key, value: r.value, schema: r.schema ?? null }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));

  const registry = substrate.registry
    .list()
    .map((r) => ({ id: r.id, version: r.version, kind: r.kind, descriptor: r.descriptor, sourceDir: r.sourceDir ?? null }))
    .sort((a, b) => {
      const ka = `${a.id}@${a.version}`;
      const kb = `${b.id}@${b.version}`;
      return ka < kb ? -1 : ka > kb ? 1 : 0;
    });

  const configuration = {
    layers: substrate.configuration.layers(),
    resolved: configCapabilityIds.map((id) => ({ id, config: substrate.configuration.resolve(id) })),
  };

  return { metadata, registry, configuration };
}

/** Number of durably persisted records in a named log under `directory`. */
export function logSize(directory: string, name: "metadata" | "registry" | "configuration"): number {
  const path = join(directory, `${name}.log`);
  if (!existsSync(path)) return 0;
  return new FileAppendOnlyLog(path).readAll().length;
}

/** All persisted metadata `put` events for a given key, in append order (its version history). */
export function metadataHistory(directory: string, key: string): unknown[] {
  const path = join(directory, "metadata.log");
  if (!existsSync(path)) return [];
  return new FileAppendOnlyLog(path)
    .readAll()
    .map((r) => r.event as { op: string; key: string; value: unknown })
    .filter((e) => e.op === "put" && e.key === key)
    .map((e) => e.value);
}

/** A JSON Schema used to prove schema-carrying, validated writes rehydrate correctly. */
export const typedSchema: JsonSchema = {
  type: "object",
  required: ["x"],
  properties: { x: { type: "string" } },
  additionalProperties: false,
};

/**
 * The canonical WRITE phase, shared by the in-process and cross-process tests so both exercise the
 * exact same authoritative mutations: metadata (including a multi-write version history and a
 * schema-validated record), and layered configuration.
 */
export function applyWritePhase(substrate: Substrate): void {
  substrate.metadata.put("app:feature:flag", { enabled: true });

  // Append-only version history: three writes to the same key (latest wins in the projection).
  substrate.metadata.put("app:counter", { n: 1 });
  substrate.metadata.put("app:counter", { n: 2 });
  substrate.metadata.put("app:counter", { n: 3 });

  // Schema-carrying, validated write.
  substrate.metadata.put("app:typed", { x: "ok" }, typedSchema);

  // Layered configuration (later layers win on merge).
  substrate.configuration.setLayer("environment", "cap.shout", { greeting: "hi", retries: 1 });
  substrate.configuration.setLayer("instance", "cap.shout", { greeting: "yo" });
}

