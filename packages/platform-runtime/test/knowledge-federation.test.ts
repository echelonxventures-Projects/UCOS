import { test } from "node:test";
import assert from "node:assert/strict";
import { buildKnowledge, localUnit, localRecord, commitActive } from "./knowledge-harness.ts";
import { createRecord } from "../src/control/knowledge/knowledge-record.ts";
import { generateKeyPair } from "../src/control/federation/assertions.ts";
import { PartitionMonitor } from "../src/control/federation/partition-handling.ts";
import type { KnowledgeRecord } from "../src/control/knowledge/types.ts";

function foreignRecord(knowledgeId: string, namespace: string, trustLevel: number, version = "1.0.0"): KnowledgeRecord {
  const unit = localUnit(`f-${knowledgeId}`, namespace, { from: "nodeB" });
  return createRecord({
    knowledgeId,
    version,
    unit,
    source: { kind: "federated", nodeId: "nodeB", authorityId: "fedAuthX" },
    trustLevel,
    provenance: { origin: { nodeId: "nodeB" }, assertedBy: "fedAuthX" },
    state: "active",
    knowledgeClass: "federated",
  });
}

test("inbound bundle from a boundary member with a valid signature verifies", async () => {
  const { know } = await buildKnowledge();
  const issuerKeys = generateKeyPair();
  know.keys.register("fedAuthX-key", issuerKeys.publicKeyPem);
  know.registry.defineBoundary({ boundaryId: "kb1", members: ["fedAuthX"], maxTrustLevel: 3, namespaceScope: "knowledge:*" });
  const rec = foreignRecord("fk1", "knowledge:fed:a", 10);
  const bundle = know.importExport.export(issuerKeys.privateKey, rec, { issuer: "fedAuthX", issuerKeyRef: "fedAuthX-key" });
  assert.equal(know.federationGuard.verifyInbound(bundle, "kb1").ok, true);
});

test("inbound bundle from a non-member issuer is rejected (deny-by-default)", async () => {
  const { know } = await buildKnowledge();
  const issuerKeys = generateKeyPair();
  know.keys.register("rogue-key", issuerKeys.publicKeyPem);
  know.registry.defineBoundary({ boundaryId: "kb2", members: ["fedAuthX"], maxTrustLevel: 3, namespaceScope: "knowledge:*" });
  const rec = foreignRecord("fk2", "knowledge:fed:b", 5);
  const bundle = know.importExport.export(issuerKeys.privateKey, rec, { issuer: "rogue", issuerKeyRef: "rogue-key" });
  assert.equal(know.federationGuard.verifyInbound(bundle, "kb2").ok, false);
});

test("foreign trust is clamped to the boundary ceiling", async () => {
  const { know } = await buildKnowledge();
  know.registry.defineBoundary({ boundaryId: "kb3", members: ["fedAuthX"], maxTrustLevel: 3, namespaceScope: "knowledge:*" });
  const rec = foreignRecord("fk3", "knowledge:fed:c", 100);
  assert.equal(know.federationGuard.clampTrust(rec, "kb3"), 3);
});

test("local sovereignty: a foreign record cannot override a local active record", async () => {
  const { know, roleKeys } = await buildKnowledge();
  await commitActive(know, roleKeys, localUnit("sov", "knowledge:fed:sov", { local: true }), { knowledgeId: "sov" });
  const foreign = foreignRecord("sov", "knowledge:fed:sov", 5, "2.0.0"); // higher version, foreign
  assert.equal(know.federationGuard.mayOverrideLocal(foreign), false);
});

test("partition: an unreachable source node fails closed on inbound verification", async () => {
  const partition = new PartitionMonitor();
  const { substrate } = await buildKnowledge();
  void substrate;
  // Build a fresh knowledge control wired with the partition monitor.
  const { know } = await buildKnowledgeWithPartition(partition);
  const issuerKeys = generateKeyPair();
  know.keys.register("fedAuthX-key", issuerKeys.publicKeyPem);
  know.registry.defineBoundary({ boundaryId: "kb4", members: ["fedAuthX"], maxTrustLevel: 3, namespaceScope: "knowledge:*" });
  const rec = foreignRecord("fk4", "knowledge:fed:d", 5);
  const bundle = know.importExport.export(issuerKeys.privateKey, rec, { issuer: "fedAuthX", issuerKeyRef: "fedAuthX-key" });
  partition.markUnreachable("knowledge:nodeB");
  assert.equal(know.federationGuard.verifyInbound(bundle, "kb4").ok, false); // fail-closed
});

test("importBundle round-trip: verified foreign knowledge is persisted trust-clamped via evolution", async () => {
  const partition = new PartitionMonitor();
  const { know } = await buildKnowledgeWithPartition(partition);
  const issuerKeys = generateKeyPair();
  know.keys.register("fedAuthX-key", issuerKeys.publicKeyPem);
  know.registry.defineBoundary({ boundaryId: "kb5", members: ["fedAuthX"], maxTrustLevel: 3, namespaceScope: "knowledge:*" });
  const rec = foreignRecord("fk5", "knowledge:fed:e", 100);
  const bundle = know.importExport.export(issuerKeys.privateKey, rec, { issuer: "fedAuthX", issuerKeyRef: "fedAuthX-key" });
  const res = await know.importBundle(bundle, "kb5");
  assert.equal(res.ok, true);
  const stored = know.store.get("knowledge:fed:e", "fk5", "1.0.0");
  assert.equal(stored?.trustLevel, 3); // clamped
});

// Local helper: a knowledge control bound to a shared partition monitor.
async function buildKnowledgeWithPartition(partition: PartitionMonitor) {
  const { createSubstrate } = await import("../src/bootstrap.ts");
  const { createKnowledge } = await import("../src/control/knowledge/knowledge-control.ts");
  const substrate = createSubstrate();
  const know = createKnowledge(substrate, { nodeId: "node-local", partition });
  return { substrate, know };
}
