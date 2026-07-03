import { test } from "node:test";
import assert from "node:assert/strict";
import { buildKnowledge, localUnit, commitActive } from "./knowledge-harness.ts";
import { canTransition } from "../src/control/knowledge/knowledge-lifecycle.ts";

test("full lifecycle: a local knowledge record is created, ratified, committed active, and queryable", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const { record, unitHash } = await commitActive(know, roleKeys, localUnit("k1", "knowledge:demo:facts", { pi: 3.14 }));
  const stored = know.store.get(record.namespace, record.knowledgeId, record.version);
  assert.equal(stored?.unitHash, unitHash);
  assert.equal(stored?.state, "active");
  assert.equal(know.states.state(unitHash), "active");
});

test("committed knowledge resolves to the active record", async () => {
  const { know, roleKeys } = await buildKnowledge();
  await commitActive(know, roleKeys, localUnit("k2", "knowledge:demo:facts", { v: 1 }), { knowledgeId: "k2" });
  const resolved = know.resolver.resolve("knowledge:demo:facts", "k2");
  assert.equal((resolved?.unit.payload as { v: number }).v, 1);
});

test("lifecycle table permits governed forward path + revoke, forbids illegal jumps", () => {
  assert.equal(canTransition("draft", "validated"), true);
  assert.equal(canTransition("ratified", "active"), true);
  assert.equal(canTransition("active", "superseded"), true);
  assert.equal(canTransition("active", "revoked"), true);
  assert.equal(canTransition("archived", "active"), false);
  assert.equal(canTransition("draft", "active"), false);
});

test("higher version supersedes on resolve (highest active wins)", async () => {
  const { know, roleKeys } = await buildKnowledge();
  await commitActive(know, roleKeys, localUnit("kv-1", "knowledge:demo:model", { w: 1 }), { knowledgeId: "kv", version: "1.0.0" });
  await commitActive(know, roleKeys, localUnit("kv-2", "knowledge:demo:model", { w: 2 }), { knowledgeId: "kv", version: "1.1.0" });
  const resolved = know.resolver.resolve("knowledge:demo:model", "kv");
  assert.equal(resolved?.version, "1.1.0");
});

test("commit records a KNOW_CREATED/ACTIVATED audit event", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const { unitHash } = await commitActive(know, roleKeys, localUnit("k-audit", "knowledge:demo:facts"));
  const events = know.audit.entries().filter((e) => e.unitHash === unitHash);
  assert.ok(events.some((e) => e.event === "KNOW_ACTIVATED"));
});
