/**
 * PI-9 Memory Fabric — governance authorities & engines (MEM-GOV-001 C5/C6; MEM-ARCH-001).
 * Governed commit with separation of duties (consolidate≠certify≠ratify), quorum, and the
 * consolidation / reconciliation engines.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMemory, localUnit, localRecord, generateKeyPair, CLASS } from "./memory-harness.ts";
import { MemoryConsolidationEngine } from "../src/control/memory/memory-consolidation-engine.ts";
import { MemoryReconciliationEngine } from "../src/control/memory/memory-reconciliation-engine.ts";

async function setup() {
  const { mem } = await buildMemory();
  const ca = generateKeyPair();
  const ra = generateKeyPair();
  mem.keys.register("ca-key", ca.publicKeyPem);
  mem.keys.register("ra-key", ra.publicKeyPem);
  mem.certifications.register({ caId: "ca1", owner: "certifier-1", keyRef: "ca-key" });
  mem.ratifications.register({ raId: "ra1", owner: "ratify-lead", keyRef: "ra-key", quorum: 1 });
  mem.registerAuthority({ authorityId: "consolidator-1", owner: "p1", powers: ["consolidate"], keyRef: "ca-key", scope: "memory:*" });
  mem.registerAuthority({ authorityId: "certifier-1", owner: "p2", powers: ["certify"], keyRef: "ca-key", scope: "memory:*" });
  mem.registerAuthority({ authorityId: "ratifier-1", owner: "p3", powers: ["ratify"], keyRef: "ra-key", scope: "memory:*" });
  return { mem, ca, ra };
}

test("governedCommit succeeds with valid SoD-compliant certification + ratification", async () => {
  const { mem, ca, ra } = await setup();
  const rec = localRecord(localUnit("g1"), { memId: "g1" });
  const cert = mem.certifications.issue(ca.privateKey, { unitHash: rec.unitHash, caId: "ca1" });
  const rat = mem.ratifications.issue(ra.privateKey, {
    unitHash: rec.unitHash, raId: "ra1", consolidator: "consolidator-1", certifier: "certifier-1", certificationId: cert.certificationId, ratifiers: ["ratifier-1"],
  });
  const res = await mem.governedCommit(rec, { certification: cert, ratification: rat });
  assert.equal(res.ok, true);
  assert.ok(mem.recall("memory:long-term:subjectA", "g1"), "governed record is recallable");
});

test("ratification quorum is enforced (fail-closed)", async () => {
  const { mem, ra } = await setup();
  mem.ratifications.register({ raId: "ra2", owner: "lead2", keyRef: "ra-key", quorum: 2 });
  assert.throws(() =>
    mem.ratifications.issue(ra.privateKey, {
      unitHash: "u", raId: "ra2", consolidator: "consolidator-1", certifier: "certifier-1", certificationId: "c", ratifiers: ["ratifier-1"], // only 1 < quorum 2
    }),
  /quorum/i);
});

test("certification verifies against its authority key; a mismatched signer fails", async () => {
  const { mem, ca } = await setup();
  const cert = mem.certifications.issue(ca.privateKey, { unitHash: "abc", caId: "ca1" });
  assert.equal(mem.certifications.verify(cert), true);
  assert.equal(mem.certifications.verify({ ...cert, unitHash: "def" }), false, "payload tamper detected");
});

test("consolidation engine raises classification to max(sources) and merges lineage", () => {
  const target = localRecord(localUnit("t"), { memId: "t", classification: CLASS.internal });
  const s1 = localRecord(localUnit("s1"), { memId: "s1", classification: CLASS.restricted });
  const s2 = localRecord(localUnit("s2"), { memId: "s2", classification: CLASS.public });
  const promoted = MemoryConsolidationEngine.consolidate(target, [s1, s2]);
  assert.equal(promoted.classification.level, CLASS.restricted.level, "raised to max source");
  assert.ok(promoted.lineage.includes(s1.unitHash) && promoted.lineage.includes(s2.unitHash), "lineage merged");
});

test("reconciliation engine: identical histories are consistent; a tampered chain fails closed", async () => {
  const { mem } = await setup();
  await mem.commit(localRecord(localUnit("rc"), { memId: "rc" }));
  const exp = mem.audit.export();
  assert.equal(MemoryReconciliationEngine.consistent(exp, exp), true, "same chain reconciles");
  const tampered = { ...exp, chain: exp.chain.map((c, i) => (i === 0 ? { ...c, entry: { ...c.entry, detail: "X" } } : c)) };
  const result = MemoryReconciliationEngine.reconcile(exp, tampered);
  assert.equal(result.failClosed, true, "divergence fails closed");
  assert.equal(result.status, "divergent");
});
