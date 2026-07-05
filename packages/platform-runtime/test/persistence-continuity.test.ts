/**
 * DEL-007 — Restart Continuity Verification Suite.
 *
 * Proves the mandatory L4 pattern: WRITE -> TERMINATE -> RESTART -> REHYDRATE -> IDENTICAL STATE.
 * Covers AC-1 (metadata survives process restart), AC-2 (survives machine restart, via a real
 * separate OS process + fsync), AC-3 (registry), AC-4 (configuration), AC-5 (derived state rebuilds
 * and executes), and AC-11 (identical state).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import {
  bootDurable,
  applyWritePhase,
  snapshotState,
  canonical,
  metadataHistory,
  freshDir,
  cleanup,
} from "./persistence-harness.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

test("WRITE -> RESTART -> REHYDRATE -> IDENTICAL STATE (AC-11)", async () => {
  const dir = freshDir();
  try {
    // WRITE
    const first = await bootDurable(dir);
    applyWritePhase(first);
    const before = canonical(snapshotState(first));

    // TERMINATE (drop all in-memory references) -> RESTART -> REHYDRATE
    const second = await bootDurable(dir);
    const after = canonical(snapshotState(second));

    // IDENTICAL STATE
    assert.equal(after, before);
  } finally {
    cleanup(dir);
  }
});

test("authoritative metadata survives process restart, latest version wins (AC-1, AC-9)", async () => {
  const dir = freshDir();
  try {
    const first = await bootDurable(dir);
    applyWritePhase(first);

    const second = await bootDurable(dir);
    assert.deepEqual(second.metadata.get("app:feature:flag")?.value, { enabled: true });
    // Version history is append-only; the projection reflects the latest write.
    assert.deepEqual(second.metadata.get("app:counter")?.value, { n: 3 });
    // The schema-carrying record rehydrates with its schema intact.
    assert.equal(second.metadata.get("app:typed")?.schema !== undefined, true);
    assert.deepEqual(second.metadata.get("app:typed")?.value, { x: "ok" });

    // Append-only durable version history: the three distinct counter writes are all retained.
    assert.deepEqual(metadataHistory(dir, "app:counter"), [{ n: 1 }, { n: 2 }, { n: 3 }]);
  } finally {
    cleanup(dir);
  }
});

test("registry state survives restart and its derived version index is rebuilt (AC-3, AC-5)", async () => {
  const dir = freshDir();
  try {
    const first = await bootDurable(dir);
    applyWritePhase(first);

    const second = await bootDurable(dir);
    assert.equal(second.registry.has("cap.shout"), true);
    assert.equal(second.registry.has("contract.text-producer"), true);
    // Range resolution exercises the DERIVED version index, proving it was reconstructed.
    const resolved = second.registry.resolve("cap.shout", "^1.0.0");
    assert.equal(resolved?.version, "1.0.0");
    assert.equal(resolved?.kind, "capability");
  } finally {
    cleanup(dir);
  }
});

test("configuration state survives restart with layered merge intact (AC-4)", async () => {
  const dir = freshDir();
  try {
    const first = await bootDurable(dir);
    applyWritePhase(first);

    const second = await bootDurable(dir);
    // instance layer overrides environment for `greeting`; `retries` from environment is retained.
    assert.deepEqual(second.configuration.resolve("cap.shout"), { greeting: "yo", retries: 1 });
  } finally {
    cleanup(dir);
  }
});

test("derived composition graph rebuilds and executes after restart (AC-5)", async () => {
  const dir = freshDir();
  try {
    const first = await bootDurable(dir);
    applyWritePhase(first);

    // Fresh runtime, rehydrated + recomposed by bootDurable; the capability executes.
    const second = await bootDurable(dir);
    const out = await second.kernel.execute("cap.shout", "produce", { subject: "ucos" });
    assert.equal(out, "UCOS!");
  } finally {
    cleanup(dir);
  }
});

test("authoritative state survives a real separate OS process (AC-2, machine restart)", async () => {
  const dir = freshDir();
  const reference = freshDir();
  try {
    // WRITE in a separate process that then TERMINATES. Every append is fsynced before exit.
    const writer = join(HERE, "fixtures", "persistence-writer.ts");
    const result = spawnSync(process.execPath, [writer, dir], { encoding: "utf8" });
    assert.equal(result.status, 0, `writer process failed: ${result.stderr}`);

    // Logs are physically on disk, written by a now-dead process.
    assert.equal(existsSync(join(dir, "metadata.log")), true);
    assert.equal(existsSync(join(dir, "registry.log")), true);
    assert.equal(existsSync(join(dir, "configuration.log")), true);

    // This process (a fresh runtime) rehydrates identical state.
    const restored = await bootDurable(dir);

    // Build an in-process reference with the identical write phase to compare against.
    const ref = await bootDurable(reference);
    applyWritePhase(ref);

    assert.equal(canonical(snapshotState(restored)), canonical(snapshotState(ref)));
  } finally {
    cleanup(dir);
    cleanup(reference);
  }
});
