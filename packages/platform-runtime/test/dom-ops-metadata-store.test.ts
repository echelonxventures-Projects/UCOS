/**
 * AC-D1 — dom_ops-backed durable MetadataPort verification.
 *
 * Proves the durable MetadataPort adapter over a DomOpsJournal: fail-closed schema validation,
 * append-only version history, idempotent no-op writes, the durable drain() consistency boundary,
 * and WRITE -> DRAIN -> REOPEN -> REHYDRATE -> IDENTICAL STATE (latest write wins). Uses the
 * in-memory journal double so the suite is deterministic and dependency-free; the PG adapter
 * implements the same DomOpsJournal contract in the operational-proof service.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemoryDomOpsJournal } from "../src/persistence-runtime/dom-ops-journal.ts";
import { DomOpsMetadataStore } from "../src/persistence-runtime/dom-ops-metadata-store.ts";
import type { JsonSchema } from "../src/contracts/types.ts";

const typedSchema: JsonSchema = {
  type: "object",
  required: ["x"],
  properties: { x: { type: "string" } },
  additionalProperties: false,
};

function canonical(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}
function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === "object") {
    const src = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(src).sort()) out[k] = sortKeys(src[k]);
    return out;
  }
  return value;
}
function snapshot(store: DomOpsMetadataStore): unknown {
  return store
    .query("")
    .map((r) => ({ key: r.key, value: r.value, schema: r.schema ?? null }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

test("put persists to the journal and is readable through the projection", async () => {
  const journal = new InMemoryDomOpsJournal();
  const store = await DomOpsMetadataStore.open(journal);

  store.put("app:feature:flag", { enabled: true });
  await store.drain();

  assert.deepEqual(store.get("app:feature:flag")?.value, { enabled: true });
  assert.equal(await journal.size(), 1);
});

test("WRITE -> DRAIN -> REOPEN -> REHYDRATE -> IDENTICAL STATE, latest write wins", async () => {
  const journal = new InMemoryDomOpsJournal();
  const first = await DomOpsMetadataStore.open(journal);

  first.put("app:feature:flag", { enabled: true });
  first.put("app:counter", { n: 1 });
  first.put("app:counter", { n: 2 });
  first.put("app:counter", { n: 3 });
  first.put("app:typed", { x: "ok" }, typedSchema);
  await first.drain();
  const before = canonical(snapshot(first));

  // Reopen over the same durable journal (simulated restart): projection is rebuilt by replay.
  const second = await DomOpsMetadataStore.open(journal);
  assert.equal(canonical(snapshot(second)), before);
  assert.deepEqual(second.get("app:counter")?.value, { n: 3 });
  assert.equal(second.get("app:typed")?.schema !== undefined, true);
});

test("append-only version history: three distinct writes are all retained in the journal", async () => {
  const journal = new InMemoryDomOpsJournal();
  const store = await DomOpsMetadataStore.open(journal);

  store.put("app:counter", { n: 1 });
  store.put("app:counter", { n: 2 });
  store.put("app:counter", { n: 3 });
  await store.drain();

  const history = (await journal.readAll())
    .map((r) => r.event)
    .filter((e): e is { op: "put"; key: string; value: unknown } => e.op === "put" && e.key === "app:counter")
    .map((e) => e.value);
  assert.deepEqual(history, [{ n: 1 }, { n: 2 }, { n: 3 }]);
});

test("idempotent no-op: a structurally identical re-put is neither applied nor journaled", async () => {
  const journal = new InMemoryDomOpsJournal();
  const store = await DomOpsMetadataStore.open(journal);

  store.put("app:config", { a: 1, b: 2 });
  store.put("app:config", { b: 2, a: 1 }); // same value, different key order
  await store.drain();

  assert.equal(await journal.size(), 1);
});

test("fail-closed: an invalid schema-validated write throws and is never journaled", async () => {
  const journal = new InMemoryDomOpsJournal();
  const store = await DomOpsMetadataStore.open(journal);

  assert.throws(() => store.put("app:typed", { x: 123 }, typedSchema));
  await store.drain();

  assert.equal(await journal.size(), 0);
  assert.equal(store.get("app:typed"), undefined);
});

test("fail-closed: a durable append failure latches the store and surfaces on drain()", async () => {
  const failing = {
    async append(): Promise<number> {
      throw new Error("dom_ops unavailable");
    },
    async readAll() {
      return [];
    },
    async size() {
      return 0;
    },
  };
  const store = await DomOpsMetadataStore.open(failing);

  store.put("app:x", { v: 1 });
  await assert.rejects(() => store.drain());
  // The latch blocks subsequent writes rather than proceeding on an unpersisted mutation.
  assert.throws(() => store.put("app:y", { v: 2 }));
});


test("revoke is fail-closed: revoked key stops resolving, is journaled, and survives reopen (D1-3)", async () => {
  const journal = new InMemoryDomOpsJournal();
  const store = await DomOpsMetadataStore.open(journal);

  store.put("app:secret", { v: 1 });
  store.revoke("app:secret");
  await store.drain();

  assert.equal(store.get("app:secret"), undefined);
  assert.equal(store.query("app:").some((r) => r.key === "app:secret"), false);
  assert.throws(() => store.put("app:secret", { v: 2 })); // cannot resurrect a revoked key

  // Revocation is durable: a reopened store replays the tombstone and still denies the key.
  const reopened = await DomOpsMetadataStore.open(journal);
  assert.equal(reopened.get("app:secret"), undefined);
});
