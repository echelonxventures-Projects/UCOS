/**
 * PI-9 Memory Fabric — security: classification monotonicity/projection (S4), no-synthesis,
 * audit-preserving forgetting (M9), revocation propagation (AD-0023 / MEM-SEC-001).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMemory, localUnit, localRecord, CLASS } from "./memory-harness.ts";
import { MemoryRetention } from "../src/control/memory/memory-retention.ts";
import { MemoryAuditLog } from "../src/control/memory/memory-audit.ts";

test("classification is monotonic: promotion may not declassify (MGP-3/S4)", () => {
  assert.throws(() => MemoryRetention.assertMonotonic(CLASS.secret, CLASS.public));
  // raising is allowed
  MemoryRetention.assertMonotonic(CLASS.public, CLASS.secret);
});

test("consolidation raises classification to the max of its sources", async () => {
  const { mem } = await buildMemory();
  const src = localRecord(localUnit("src"), { memId: "src", classification: CLASS.restricted });
  await mem.commit(src);
  const target = localRecord(localUnit("cons", { value: { g: 1 } }), { memId: "cons", classification: CLASS.internal });
  const res = await mem.consolidate(target, [src]);
  assert.equal(res.ok, true);
  const got = mem.recall("memory:long-term:subjectA", "cons", { clearanceLevel: CLASS.secret.level });
  assert.equal(got?.classification.level, CLASS.restricted.level, "raised to max(source)");
});

test("recall projection withholds records above the requester clearance (S4/M2)", async () => {
  const { mem } = await buildMemory();
  await mem.commit(localRecord(localUnit("hi"), { memId: "hi", classification: CLASS.secret }));
  // Requester cleared only to `internal` cannot recall a `secret` memory.
  const denied = mem.recall("memory:long-term:subjectA", "hi", { clearanceLevel: CLASS.internal.level });
  assert.equal(denied, undefined, "withheld (not leaked)");
  // A fully-cleared requester can.
  const ok = mem.recall("memory:long-term:subjectA", "hi", { clearanceLevel: CLASS.secret.level });
  assert.ok(ok);
});

test("audit-preserving forgetting: value unrecallable, audit fact retained (M9)", async () => {
  const { mem } = await buildMemory();
  const rec = localRecord(localUnit("f1"), { memId: "f1" });
  await mem.commit(rec);
  assert.ok(mem.recall("memory:long-term:subjectA", "f1"), "recallable before forget");

  const f = mem.forget(rec, "board");
  assert.equal(f.ok, true);
  assert.equal(mem.recall("memory:long-term:subjectA", "f1"), undefined, "value unrecallable after forget");

  // The audit chain retains the forgetting fact and remains intact/verifiable.
  const forgotten = mem.audit.entries().filter((e) => e.event === "MEM_FORGOTTEN");
  assert.equal(forgotten.length, 1, "forgetting fact retained");
  assert.equal(MemoryAuditLog.verify(mem.audit.export()).ok, true, "audit chain intact");
});

test("revocation propagates: a revoked record is excluded from recall (fail-closed)", async () => {
  const { mem } = await buildMemory();
  const rec = localRecord(localUnit("r1"), { memId: "r1" });
  await mem.commit(rec);
  mem.revoke("record", `${rec.namespace}:${rec.memId}@${rec.version}`, "board");
  assert.equal(mem.recall("memory:long-term:subjectA", "r1"), undefined);
});

test("memory audit chain is tamper-evident (hash break detected)", async () => {
  const { mem } = await buildMemory();
  await mem.commit(localRecord(localUnit("t1"), { memId: "t1" }));
  const exported = mem.audit.export();
  // Tamper with a recorded entry's detail.
  const tampered = { ...exported, chain: exported.chain.map((c, i) => (i === 0 ? { ...c, entry: { ...c.entry, detail: "HACKED" } } : c)) };
  assert.equal(MemoryAuditLog.verify(tampered).ok, false, "tamper detected");
});
