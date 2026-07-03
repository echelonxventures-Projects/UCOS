import { test } from "node:test";
import assert from "node:assert/strict";
import { buildKnowledge, localUnit, localRecord, commitActive, govern } from "./knowledge-harness.ts";
import { createRecord } from "../src/control/knowledge/knowledge-record.ts";
import { unitHash } from "../src/control/knowledge/knowledge-unit.ts";
import { KnowledgeAuditLog } from "../src/control/knowledge/knowledge-audit-log.ts";
import { generateKeyPair, NonceCache } from "../src/control/federation/assertions.ts";
import type { KnowledgeRecord } from "../src/control/knowledge/types.ts";

function foreign(knowledgeId: string, namespace: string, trustLevel: number, version = "1.0.0"): KnowledgeRecord {
  return createRecord({
    knowledgeId,
    version,
    unit: localUnit(`f-${knowledgeId}-${version}`, namespace, { from: "nodeB" }),
    source: { kind: "federated", nodeId: "nodeB", authorityId: "fedAuthX" },
    trustLevel,
    provenance: { origin: { nodeId: "nodeB" }, assertedBy: "fedAuthX" },
    state: "active",
    knowledgeClass: "federated",
  });
}

async function rejects(fn: () => Promise<unknown>): Promise<boolean> {
  try {
    await fn();
    return false;
  } catch {
    return true;
  }
}

// K1 — Knowledge Poisoning: an inbound bundle from a non-member issuer is refused.
test("K1 knowledge poisoning (non-member issuer) is blocked", async () => {
  const { know } = await buildKnowledge();
  const rogue = generateKeyPair();
  know.keys.register("rogue-key", rogue.publicKeyPem);
  know.registry.defineBoundary({ boundaryId: "kb", members: ["fedAuthX"], maxTrustLevel: 3, namespaceScope: "knowledge:*" });
  const bundle = know.importExport.export(rogue.privateKey, foreign("p1", "knowledge:adv:a", 5), { issuer: "rogue", issuerKeyRef: "rogue-key" });
  const res = await know.importBundle(bundle, "kb");
  assert.equal(res.ok, false);
});

// K2 — Provenance Forgery: federated record claiming a local origin.
test("K2 provenance forgery is detected", async () => {
  const { know } = await buildKnowledge();
  const rec = localRecord(localUnit("p2", "knowledge:adv:b"), { knowledgeId: "p2", state: "active" });
  const forged = { ...rec, source: { kind: "federated" as const, nodeId: "nodeB" } }; // origin still 'local'
  assert.equal(know.lineage.verifyProvenance(forged).ok, false);
});

// K3 — Certification Forgery.
test("K3 certification forgery is blocked at commit", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const unit = localUnit("p3", "knowledge:adv:c");
  const rec = localRecord(unit, { knowledgeId: "p3", state: "active" });
  const attacker = generateKeyPair();
  const forgedCert = know.certifications.issue(attacker.privateKey, { unitHash: unitHash(unit), caId: "kca1" });
  const { rat } = govern(know, roleKeys, unitHash(unit));
  assert.equal(await rejects(() => know.commit(rec, { certification: forgedCert, ratification: rat })), true);
});

// K4 — Authority Escalation: SoD violation in ratification.
test("K4 authority escalation (SoD violation) is blocked", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const cert = know.certifications.issue(roleKeys.certifier, { unitHash: "p4", caId: "kca1" });
  const badRat = know.ratifications.issue(roleKeys.ratifier, {
    unitHash: "p4",
    raId: "kra1",
    author: "rachel-ratifier", // author == ratifier owner => SoD violation
    validators: ["victor-validator"],
    certifier: "carol-certifier",
    certificationId: cert.certificationId,
  });
  assert.equal(know.ratifications.verify(badRat).ok, false);
});

// K5 — Trust Boundary Bypass: out-of-boundary + clamping.
test("K5 trust boundary bypass is blocked (deny-by-default + clamp)", async () => {
  const { know } = await buildKnowledge();
  know.registry.defineBoundary({ boundaryId: "kb5", members: ["fedAuthX"], maxTrustLevel: 2, namespaceScope: "knowledge:*" });
  const issuer = generateKeyPair();
  know.keys.register("out-key", issuer.publicKeyPem);
  const bundle = know.importExport.export(issuer.privateKey, foreign("p5", "knowledge:adv:e", 99), { issuer: "outsider", issuerKeyRef: "out-key" });
  assert.equal(know.federationGuard.verifyInbound(bundle, "kb5").ok, false);
  assert.equal(know.federationGuard.clampTrust(foreign("p5", "knowledge:adv:e", 99), "kb5"), 2);
});

// K6 — Knowledge Replay.
test("K6 knowledge replay (nonce reuse) is blocked", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const nonces = new NonceCache();
  const cert = know.certifications.issue(roleKeys.certifier, { unitHash: "p6", caId: "kca1" });
  assert.equal(know.certifications.verify(cert, { nonces }).ok, true);
  assert.equal(know.certifications.verify(cert, { nonces }).ok, false);
});

// K7 — Knowledge Tampering.
test("K7 knowledge tampering (unit hash mismatch) is blocked", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const unit = localUnit("p7", "knowledge:adv:g", { safe: true });
  const rec = localRecord(unit, { knowledgeId: "p7", state: "active" });
  const { cert, rat } = govern(know, roleKeys, unitHash(unit));
  const tampered = { ...rec, unit: { ...rec.unit, payload: { safe: false } } };
  assert.equal(await rejects(() => know.commit(tampered, { certification: cert, ratification: rat })), true);
});

// K8 — Audit Evasion.
test("K8 audit evasion (tampered chain) is detected", async () => {
  const { know, roleKeys } = await buildKnowledge();
  await commitActive(know, roleKeys, localUnit("p8", "knowledge:adv:h"), { knowledgeId: "p8" });
  const exported = know.audit.export();
  const tampered = { ...exported, chain: exported.chain.map((c, i) => (i === 0 ? { ...c, entry: { ...c.entry, detail: "x" } } : c)) };
  assert.equal(KnowledgeAuditLog.verify(tampered).ok, false);
});

// K9 — Federation Poisoning: foreign override of a local active record.
test("K9 federation poisoning (foreign override of local) is blocked", async () => {
  const { know, roleKeys } = await buildKnowledge();
  know.registry.defineBoundary({ boundaryId: "kb9", members: ["fedAuthX"], maxTrustLevel: 5, namespaceScope: "knowledge:*" });
  const issuer = generateKeyPair();
  know.keys.register("fedAuthX-key", issuer.publicKeyPem);
  await commitActive(know, roleKeys, localUnit("p9", "knowledge:adv:i", { local: true }), { knowledgeId: "p9" });
  const bundle = know.importExport.export(issuer.privateKey, foreign("p9", "knowledge:adv:i", 5, "2.0.0"), { issuer: "fedAuthX", issuerKeyRef: "fedAuthX-key" });
  const res = await know.importBundle(bundle, "kb9");
  assert.equal(res.ok, false); // local sovereignty
});

// K10 — Lineage Corruption.
test("K10 lineage corruption is blocked at commit", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const unit = localUnit("p10", "knowledge:adv:j");
  const rec = localRecord(unit, { knowledgeId: "p10", state: "active", lineage: ["unresolvable-parent"] });
  const { cert, rat } = govern(know, roleKeys, unitHash(unit));
  assert.equal(await rejects(() => know.commit(rec, { certification: cert, ratification: rat })), true);
});

// K11 — Version Conflict Abuse: local sovereignty defeats a higher foreign version.
test("K11 version conflict abuse is blocked (local shadows higher foreign version)", async () => {
  const { know, roleKeys } = await buildKnowledge();
  know.registry.defineBoundary({ boundaryId: "kb11", members: ["fedAuthX"], maxTrustLevel: 5, namespaceScope: "knowledge:*" });
  const issuer = generateKeyPair();
  know.keys.register("fedAuthX-key", issuer.publicKeyPem);
  // Foreign v2.0.0 imported first (no local yet).
  const bundle = know.importExport.export(issuer.privateKey, foreign("vc", "knowledge:adv:k", 5, "2.0.0"), { issuer: "fedAuthX", issuerKeyRef: "fedAuthX-key" });
  assert.equal((await know.importBundle(bundle, "kb11")).ok, true);
  // Local v1.0.0 committed.
  await commitActive(know, roleKeys, localUnit("vc", "knowledge:adv:k", { local: true }), { knowledgeId: "vc", version: "1.0.0" });
  // Despite the higher foreign version, the local record wins.
  const resolved = know.resolver.resolve("knowledge:adv:k", "vc");
  assert.equal(resolved?.source.kind, "local");
  assert.equal(resolved?.version, "1.0.0");
});

// K12 — Knowledge Drift.
test("K12 knowledge drift is detected via snapshot comparison", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const before = know.snapshots.capture("knowledge:adv:l");
  await commitActive(know, roleKeys, localUnit("p12", "knowledge:adv:l", { v: 1 }), { knowledgeId: "p12" });
  const after = know.snapshots.capture("knowledge:adv:l");
  const drift = know.snapshots.drift(before, after);
  assert.equal(drift.drifted, true);
});
