import { test } from "node:test";
import assert from "node:assert/strict";
import { buildKnowledge, localUnit, localRecord, govern } from "./knowledge-harness.ts";
import { unitHash } from "../src/control/knowledge/knowledge-unit.ts";
import { generateKeyPair } from "../src/control/federation/assertions.ts";

test("tampering a unit after hashing is detected (unitHash mismatch) — commit fails closed", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const unit = localUnit("s1", "knowledge:sec:a", { safe: true });
  const record = localRecord(unit, { knowledgeId: "s1", state: "active" });
  const { cert, rat } = govern(know, roleKeys, unitHash(unit));
  // Tamper the unit payload post-hash (record.unitHash now stale).
  const tampered = { ...record, unit: { ...record.unit, payload: { safe: false } } };
  await assert.rejects(() => know.commit(tampered, { certification: cert, ratification: rat }));
});

test("a forged certification (wrong signing key) is rejected at commit", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const unit = localUnit("s2", "knowledge:sec:b");
  const record = localRecord(unit, { knowledgeId: "s2", state: "active" });
  const attacker = generateKeyPair();
  const forgedCert = know.certifications.issue(attacker.privateKey, { unitHash: unitHash(unit), caId: "kca1" }); // wrong key
  const { rat } = govern(know, roleKeys, unitHash(unit));
  await assert.rejects(() => know.commit(record, { certification: forgedCert, ratification: rat }));
});

test("a stale (expired) certification is rejected", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const past = Date.now() - 10_000;
  const cert = know.certifications.issue(roleKeys.certifier, { unitHash: "s3", caId: "kca1", issuedAt: past - 1000, expiresAt: past });
  assert.equal(know.certifications.verify(cert).ok, false);
});

test("provenance verification: a federated record claiming 'local' origin is rejected", async () => {
  const { know } = await buildKnowledge();
  const unit = localUnit("s4", "knowledge:sec:c");
  const record = localRecord(unit, { knowledgeId: "s4", state: "active" });
  const foreignClaimingLocal = { ...record, source: { kind: "federated" as const, nodeId: "nodeB" } }; // provenance still origin 'local'
  assert.equal(know.lineage.verifyProvenance(foreignClaimingLocal).ok, false);
});

test("knowledge signing/verification round-trips via reused federation primitives", async () => {
  const { know } = await buildKnowledge();
  const unit = localUnit("s5", "knowledge:sec:d", { x: 42 });
  const record = localRecord(unit, { knowledgeId: "s5" });
  const keys = generateKeyPair();
  know.keys.register("exp-key", keys.publicKeyPem);
  const bundle = know.importExport.export(keys.privateKey, record, { issuer: "authX", issuerKeyRef: "exp-key" });
  const { result } = know.importExport.verifyForImport(bundle);
  assert.equal(result.ok, true);
});
