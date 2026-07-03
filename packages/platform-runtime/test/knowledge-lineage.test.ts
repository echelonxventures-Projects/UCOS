import { test } from "node:test";
import assert from "node:assert/strict";
import { buildKnowledge, localUnit, localRecord, commitActive } from "./knowledge-harness.ts";
import { unitHash } from "../src/control/knowledge/knowledge-unit.ts";

test("lineage verifies when every parent resolves to a stored record", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const parent = await commitActive(know, roleKeys, localUnit("lin-parent", "knowledge:lin:a", { gen: 0 }), { knowledgeId: "lin-parent" });
  const childUnit = localUnit("lin-child", "knowledge:lin:a", { gen: 1 });
  const child = localRecord(childUnit, { knowledgeId: "lin-child", state: "active", lineage: [parent.unitHash] });
  assert.equal(know.lineage.verifyLineage(child).ok, true);
});

test("broken lineage (unresolvable parent) is denied", async () => {
  const { know } = await buildKnowledge();
  const childUnit = localUnit("lin-orphan", "knowledge:lin:b", { gen: 1 });
  const child = localRecord(childUnit, { knowledgeId: "lin-orphan", state: "active", lineage: ["deadbeefdeadbeef"] });
  assert.equal(know.lineage.verifyLineage(child).ok, false);
});

test("commit is rejected when lineage is broken (fail-closed)", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const childUnit = localUnit("lin-bad", "knowledge:lin:c", { gen: 1 });
  const child = localRecord(childUnit, { knowledgeId: "lin-bad", state: "active", lineage: ["nonexistent-parent"] });
  const { govern } = await import("./knowledge-harness.ts");
  const { cert, rat } = govern(know, roleKeys, unitHash(childUnit));
  await assert.rejects(() => know.commit(child, { certification: cert, ratification: rat }));
});

test("ancestors walks the derivation chain", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const g0 = await commitActive(know, roleKeys, localUnit("anc-0", "knowledge:lin:d", { gen: 0 }), { knowledgeId: "anc-0" });
  const g1u = localUnit("anc-1", "knowledge:lin:d", { gen: 1 });
  await commitActive(know, roleKeys, g1u, { knowledgeId: "anc-1", lineage: [g0.unitHash] });
  const g2 = localRecord(localUnit("anc-2", "knowledge:lin:d", { gen: 2 }), { knowledgeId: "anc-2", lineage: [unitHash(g1u)] });
  const ancestors = know.lineage.ancestors(g2);
  assert.ok(ancestors.includes(unitHash(g1u)));
  assert.ok(ancestors.includes(g0.unitHash));
});
