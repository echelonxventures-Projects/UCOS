/**
 * PI-9 Memory Fabric — core lifecycle, store/recall, retention, snapshot (AD-0023).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMemory, localUnit, localRecord, unitHash, CLASS } from "./memory-harness.ts";
import { canTransition } from "../src/control/memory/memory-lifecycle.ts";
import { MemoryRetention } from "../src/control/memory/memory-retention.ts";

test("commit persists an active memory via evolution and it is recallable", async () => {
  const { mem } = await buildMemory();
  const unit = localUnit("m1");
  const rec = localRecord(unit, { memId: "m1" });
  const res = await mem.commit(rec, { actor: "capture-svc" });
  assert.equal(res.ok, true);
  assert.equal(res.unitHash, unitHash(unit));

  const got = mem.recall("memory:long-term:subjectA", "m1");
  assert.ok(got, "record recalled");
  assert.equal(got?.memId, "m1");
  assert.equal(got?.state, "active");
});

test("durable mutation is evolution-routed (evolution audit chain records the persist)", async () => {
  const { mem } = await buildMemory();
  const before = mem.evolution.audit.chain().length;
  await mem.commit(localRecord(localUnit("m2"), { memId: "m2" }));
  const after = mem.evolution.audit.chain().length;
  assert.ok(after > before, "evolution audit grew — persistence routed through the governor");
});

test("recall of an unknown memory is denied and audited (no-synthesis, M4)", async () => {
  const { mem } = await buildMemory();
  const got = mem.recall("memory:long-term:subjectA", "does-not-exist");
  assert.equal(got, undefined, "no fabrication");
  const denied = mem.audit.entries().filter((e) => e.event === "MEM_RECALL_DENIED");
  assert.equal(denied.length, 1);
});

test("fail-closed expiry: an expired ephemeral memory is not recallable (M3)", async () => {
  const { mem } = await buildMemory();
  const unit = localUnit("m-eph", { tier: "working", namespace: "memory:working:s", subjectRef: "s" });
  // captured far in the past under ephemeral retention => derived expiry is in the past.
  const rec = localRecord(unit, { memId: "m-eph", retentionClass: "ephemeral", capturedAt: 1, state: "active", source: { kind: "local" } });
  await mem.commit(rec);
  const got = mem.recall("memory:working:s", "m-eph", { now: Date.now() });
  assert.equal(got, undefined, "expired => absent => deny");
});

test("legal-hold suspends time expiry and forgetting", async () => {
  const { mem } = await buildMemory();
  const unit = localUnit("m-hold");
  const rec = localRecord(unit, { memId: "m-hold", retentionClass: "legal-hold", capturedAt: 1, state: "active" });
  await mem.commit(rec);
  // Far-future recall still succeeds (no time expiry under legal-hold).
  const got = mem.recall("memory:long-term:subjectA", "m-hold", { now: Date.now() + 10 ** 12 });
  assert.ok(got, "legal-hold never time-expires");
  // Forgetting is suspended.
  const f = mem.forget(rec, "board");
  assert.equal(f.ok, false);
});

test("versioned supersession: highest active version is recalled (no edit-in-place)", async () => {
  const { mem } = await buildMemory();
  await mem.commit(localRecord(localUnit("mv"), { memId: "mv", version: "1.0.0" }));
  await mem.commit(localRecord(localUnit("mv", { value: { note: "v2" } }), { memId: "mv", version: "2.0.0" }));
  const got = mem.recall("memory:long-term:subjectA", "mv");
  assert.equal(got?.version, "2.0.0");
});

test("lifecycle table is fail-closed on illegal transitions", () => {
  assert.equal(canTransition("captured", "active"), true);
  assert.equal(canTransition("active", "forgotten"), true);
  assert.equal(canTransition("forgotten", "active"), false); // terminal
  assert.equal(canTransition("expired", "active"), false); // terminal
  assert.equal(canTransition("proposed", "active"), false); // must pass certify->ratify
});

test("snapshot detects drift after a new memory is committed", async () => {
  const { mem } = await buildMemory();
  await mem.commit(localRecord(localUnit("s1"), { memId: "s1" }));
  const before = mem.snapshots.capture("memory:long-term:subjectA");
  await mem.commit(localRecord(localUnit("s2"), { memId: "s2" }));
  const after = mem.snapshots.capture("memory:long-term:subjectA");
  assert.equal(mem.snapshots.drift(before, after).drifted, true);
});

test("retention derives finite expiry for durable (nothing durable-by-omission)", () => {
  const r = new MemoryRetention();
  const exp = r.expiryFor("durable", 1000);
  assert.ok(exp !== undefined && Number.isFinite(exp) && exp > 1000);
  assert.equal(r.expiryFor("legal-hold", 1000), undefined);
});
