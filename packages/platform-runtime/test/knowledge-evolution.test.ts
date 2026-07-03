import { test } from "node:test";
import assert from "node:assert/strict";
import { buildKnowledge, localUnit, commitActive } from "./knowledge-harness.ts";

test("committing knowledge routes the mutation through the Evolution Fabric (applied)", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const { record, unitHash } = await commitActive(know, roleKeys, localUnit("e1", "knowledge:evo:a", { v: 1 }), { knowledgeId: "e1" });
  // The store reflects the record ONLY because an evolution unit persisted it.
  assert.ok(know.store.get(record.namespace, record.knowledgeId, record.version));
  void unitHash;
  // The evolution fabric applied at least one unit and its audit shows an APPLIED event.
  const evoEvents = know.evolution.audit.entries();
  assert.ok(evoEvents.some((e) => e.event === "APPLIED"));
});

test("evolution governor invariants are inherited: knowledge persistence uses maxInFlight=1 sequentially", async () => {
  const { know, roleKeys } = await buildKnowledge();
  await commitActive(know, roleKeys, localUnit("e2a", "knowledge:evo:b"), { knowledgeId: "e2a" });
  await commitActive(know, roleKeys, localUnit("e2b", "knowledge:evo:b"), { knowledgeId: "e2b" });
  // Two sequential commits => evolution proposal counter advanced by 2, no in-flight left.
  assert.equal(know.evolution.governor.proposalCount, 2);
  assert.equal(know.evolution.governor.inFlight, 0);
});

test("the Knowledge Store exposes no direct governed write — persistence is only via evolution", async () => {
  const { know } = await buildKnowledge();
  // KnowledgeStore is read-only for records (get/versions/inNamespace/all + static evolutionWrite helper).
  const storeAny = know.store as unknown as Record<string, unknown>;
  assert.equal(typeof storeAny["put"], "undefined");
  assert.equal(typeof storeAny["write"], "undefined");
  assert.equal(typeof know.store.get, "function");
});

test("evolution audit for a knowledge commit is independently verifiable", async () => {
  const { know, roleKeys } = await buildKnowledge();
  await commitActive(know, roleKeys, localUnit("e3", "knowledge:evo:c"), { knowledgeId: "e3" });
  const { EvolutionAuditLog } = await import("../src/control/evolution/evolution-audit-log.ts");
  assert.equal(EvolutionAuditLog.verify(know.evolution.audit.export()).ok, true);
});
