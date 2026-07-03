import { test } from "node:test";
import assert from "node:assert/strict";
import { buildKnowledge, localUnit, commitActive } from "./knowledge-harness.ts";
import { KnowledgeAuditLog } from "../src/control/knowledge/knowledge-audit-log.ts";

test("knowledge audit chain is hash-linked and independently verifiable", async () => {
  const { know, roleKeys } = await buildKnowledge();
  await commitActive(know, roleKeys, localUnit("a1", "knowledge:aud:a"), { knowledgeId: "a1" });
  const exported = know.audit.export();
  assert.ok(exported.chain.length > 0);
  assert.equal(KnowledgeAuditLog.verify(exported).ok, true);
});

test("audit tampering breaks verification", async () => {
  const { know, roleKeys } = await buildKnowledge();
  await commitActive(know, roleKeys, localUnit("a2", "knowledge:aud:b"), { knowledgeId: "a2" });
  const exported = know.audit.export();
  const tampered = {
    ...exported,
    chain: exported.chain.map((c, i) => (i === 0 ? { ...c, entry: { ...c.entry, actor: "attacker" } } : c)),
  };
  assert.equal(KnowledgeAuditLog.verify(tampered).ok, false);
});

test("cross-node reconciliation flags state-hash divergence (fail-closed)", () => {
  const local = new KnowledgeAuditLog("node-local");
  const remote = new KnowledgeAuditLog("node-remote");
  local.record({ at: 1, event: "KNOW_ACTIVATED", unitHash: "u1", namespace: "knowledge:x", actor: "a", detail: "", stateHash: "H1" });
  remote.record({ at: 1, event: "KNOW_ACTIVATED", unitHash: "u1", namespace: "knowledge:x", actor: "a", detail: "", stateHash: "H2" });
  const res = KnowledgeAuditLog.reconcile(local.export(), remote.export());
  assert.equal(res.status, "divergent");
  assert.equal(res.failClosed, true);
  assert.ok(res.divergences.some((d) => d.class === "state-hash-mismatch"));
});

test("write-ahead: commit records the knowledge event and the underlying evolution audit is intact", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const { unitHash } = await commitActive(know, roleKeys, localUnit("a3", "knowledge:aud:c"), { knowledgeId: "a3" });
  // Knowledge audit has the domain event.
  assert.ok(know.audit.entries().some((e) => e.unitHash === unitHash && e.event === "KNOW_ACTIVATED"));
  // The evolution audit (the persistence mechanism) verifies intact.
  const evoExport = know.evolution.audit.export();
  const { EvolutionAuditLog } = await import("../src/control/evolution/evolution-audit-log.ts");
  assert.equal(EvolutionAuditLog.verify(evoExport).ok, true);
});
