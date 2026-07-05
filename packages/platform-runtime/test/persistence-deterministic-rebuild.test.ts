/**
 * DEL-009 — Deterministic Rebuild Verification Suite.
 *
 * Proves that replaying the same append-only log always reconstructs identical runtime state,
 * regardless of how many times or in how many independent runtimes it is rehydrated (AC-10).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  bootDurable,
  applyWritePhase,
  snapshotState,
  canonical,
  freshDir,
  cleanup,
} from "./persistence-harness.ts";
import { InMemoryAppendOnlyLog } from "../src/persistence-runtime/append-only-log.ts";
import { DurableMetadataStore } from "../src/persistence-runtime/durable-metadata-store.ts";

test("two independent rehydrations of the same log produce identical state (AC-10)", async () => {
  const dir = freshDir();
  try {
    const origin = await bootDurable(dir);
    applyWritePhase(origin);
    const originSnapshot = canonical(snapshotState(origin));

    // Two independent fresh runtimes rebuilt from the same durable log.
    const rebuildA = canonical(snapshotState(await bootDurable(dir)));
    const rebuildB = canonical(snapshotState(await bootDurable(dir)));

    assert.equal(rebuildA, originSnapshot);
    assert.equal(rebuildB, originSnapshot);
    assert.equal(rebuildA, rebuildB);
  } finally {
    cleanup(dir);
  }
});

test("rebuild is idempotent across repeated restarts (AC-10)", async () => {
  const dir = freshDir();
  try {
    const origin = await bootDurable(dir);
    applyWritePhase(origin);

    const snapshots: string[] = [];
    for (let i = 0; i < 3; i += 1) {
      snapshots.push(canonical(snapshotState(await bootDurable(dir))));
    }
    // Every restart yields byte-identical canonical state.
    assert.equal(new Set(snapshots).size, 1);
  } finally {
    cleanup(dir);
  }
});

test("adapter-level determinism: same log replayed into a fresh store matches (AC-10)", () => {
  // A single shared log; two stores built over it must converge to identical projections.
  const log = new InMemoryAppendOnlyLog();
  const writer = new DurableMetadataStore(log);
  writer.put("a", { v: 1 });
  writer.put("b", { v: 2 });
  writer.put("a", { v: 3 }); // overwrite -> latest wins

  const replayed = new DurableMetadataStore(log);
  const project = (s: DurableMetadataStore) =>
    canonical(
      s
        .query("")
        .map((r) => ({ key: r.key, value: r.value }))
        .sort((x, y) => (x.key < y.key ? -1 : 1)),
    );

  assert.equal(project(replayed), project(writer));
  assert.deepEqual(replayed.get("a")?.value, { v: 3 });
  assert.equal(replayed.query("").length, 2);
  // Append-only history retains all three writes even though the projection holds two keys.
  assert.equal(log.size(), 3);
});
