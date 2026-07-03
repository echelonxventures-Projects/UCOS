import { test } from "node:test";
import assert from "node:assert/strict";
import { buildKnowledge, localUnit, commitActive } from "./knowledge-harness.ts";

test("query returns only active records by default (fail-closed on non-active)", async () => {
  const { know, roleKeys } = await buildKnowledge();
  await commitActive(know, roleKeys, localUnit("q1", "knowledge:q:a", { n: 1 }), { knowledgeId: "q1" });
  const active = know.queryEngine.query({ namespace: "knowledge:q:a" });
  assert.equal(active.length, 1);
  assert.equal(active[0]?.state, "active");
});

test("namespace scoping isolates results", async () => {
  const { know, roleKeys } = await buildKnowledge();
  await commitActive(know, roleKeys, localUnit("n1", "knowledge:q:x"), { knowledgeId: "n1" });
  await commitActive(know, roleKeys, localUnit("n2", "knowledge:q:y"), { knowledgeId: "n2" });
  assert.equal(know.queryEngine.query({ namespace: "knowledge:q:x" }).length, 1);
  assert.equal(know.queryEngine.query({ namespace: "knowledge:q:y" }).length, 1);
});

test("minTrustLevel filter excludes below-threshold records", async () => {
  const { know, roleKeys } = await buildKnowledge();
  await commitActive(know, roleKeys, localUnit("t-lo", "knowledge:q:trust"), { knowledgeId: "t-lo", trustLevel: 2 });
  await commitActive(know, roleKeys, localUnit("t-hi", "knowledge:q:trust"), { knowledgeId: "t-hi", trustLevel: 9 });
  const trusted = know.queryEngine.query({ namespace: "knowledge:q:trust", minTrustLevel: 5 });
  assert.equal(trusted.length, 1);
  assert.equal(trusted[0]?.knowledgeId, "t-hi");
});

test("revoked records are excluded from query results (fail-closed)", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const { record } = await commitActive(know, roleKeys, localUnit("rv", "knowledge:q:rev"), { knowledgeId: "rv" });
  assert.equal(know.queryEngine.query({ namespace: "knowledge:q:rev" }).length, 1);
  know.revoke("record", `${record.namespace}:${record.knowledgeId}@${record.version}`, "revoker");
  assert.equal(know.queryEngine.query({ namespace: "knowledge:q:rev" }).length, 0);
});

test("predicate filtering is applied and a throwing predicate excludes the record (fail-closed)", async () => {
  const { know, roleKeys } = await buildKnowledge();
  await commitActive(know, roleKeys, localUnit("p1", "knowledge:q:pred", { tag: "keep" }), { knowledgeId: "p1" });
  const kept = know.queryEngine.query({ namespace: "knowledge:q:pred", predicate: (r) => (r.unit.payload as { tag: string }).tag === "keep" });
  assert.equal(kept.length, 1);
  const throwing = know.queryEngine.query({
    namespace: "knowledge:q:pred",
    predicate: () => {
      throw new Error("boom");
    },
  });
  assert.equal(throwing.length, 0);
});
