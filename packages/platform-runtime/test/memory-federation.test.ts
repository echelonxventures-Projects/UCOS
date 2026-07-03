/**
 * PI-9 Memory Fabric — federation & adversarial (M1–M12): deny-only shadow, local sovereignty,
 * boundary deny-by-default, signed-bundle verification, partition fail-closed (AD-0023 / MEM-FED-001).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildMemory,
  localUnit,
  localRecord,
  signedBundle,
  generateKeyPair,
  CLASS,
  PartitionMonitor,
} from "./memory-harness.ts";
import { namespacedId } from "../src/control/memory/memory-namespace.ts";

async function withBoundary(partition?: PartitionMonitor) {
  const { mem, substrate } = await buildMemory(partition);
  const issuerKeys = generateKeyPair();
  mem.keys.register("peer-key", issuerKeys.publicKeyPem);
  mem.registerAuthority({ authorityId: "peerA", owner: "peer-node", powers: ["federate"], keyRef: "peer-key", scope: "memory:*" });
  mem.defineBoundary({ boundaryId: "b1", members: ["peerA"], maxTrustLevel: 3, namespaceScope: "memory:*", maxClassificationLevel: CLASS.restricted.level });
  return { mem, substrate, issuerKeys };
}

function foreignRecord(memIdLocal: string, opts: { trustLevel?: number; classification?: typeof CLASS[keyof typeof CLASS] } = {}) {
  const unit = localUnit(memIdLocal, { value: { foreign: true } });
  return localRecord(unit, {
    memId: namespacedId("node-peer", memIdLocal),
    trustLevel: opts.trustLevel ?? 9,
    classification: opts.classification ?? CLASS.internal,
    source: { kind: "federated", nodeId: "node-peer", authorityId: "peerA" },
    state: "active",
  });
}

test("valid signed foreign bundle is imported (trust clamped to boundary ceiling)", async () => {
  const { mem, issuerKeys } = await withBoundary();
  const rec = foreignRecord("mf1", { trustLevel: 9 });
  const bundle = signedBundle(issuerKeys.privateKey, rec, { issuer: "peerA", issuerKeyRef: "peer-key" });
  const res = await mem.importBundle(bundle, "b1");
  assert.equal(res.ok, true, res.reason);
  const got = mem.recall(rec.namespace, rec.memId);
  assert.ok(got, "federated shadow recallable");
  assert.equal(got?.trustLevel, 3, "trust clamped to boundary ceiling (was 9)");
});

test("boundary is deny-by-default: an out-of-boundary issuer is rejected (M5)", async () => {
  const { mem, issuerKeys } = await withBoundary();
  const rec = foreignRecord("mf2");
  const bundle = signedBundle(issuerKeys.privateKey, rec, { issuer: "not-a-member", issuerKeyRef: "peer-key" });
  const res = await mem.importBundle(bundle, "b1");
  assert.equal(res.ok, false);
  assert.match(res.reason, /not a member/);
});

test("local sovereignty: foreign memory cannot override a local active record (M5)", async () => {
  const { mem, issuerKeys } = await withBoundary();
  // Local active record with memId "shared".
  await mem.commit(localRecord(localUnit("shared"), { memId: "shared" }));
  // Foreign bundle claiming the SAME (non-namespaced) local id.
  const foreign = localRecord(localUnit("shared", { value: { foreign: true } }), {
    memId: "shared",
    source: { kind: "federated", nodeId: "node-peer", authorityId: "peerA" },
    state: "active",
  });
  const bundle = signedBundle(issuerKeys.privateKey, foreign, { issuer: "peerA", issuerKeyRef: "peer-key" });
  const res = await mem.importBundle(bundle, "b1");
  assert.equal(res.ok, false);
  assert.match(res.reason, /local sovereignty/);
});

test("tampered bundle (unit hash mismatch) is rejected (M1)", async () => {
  const { mem, issuerKeys } = await withBoundary();
  const rec = foreignRecord("mf3");
  const bundle = signedBundle(issuerKeys.privateKey, rec, { issuer: "peerA", issuerKeyRef: "peer-key", tamper: true });
  const res = await mem.importBundle(bundle, "b1");
  assert.equal(res.ok, false);
  assert.match(res.reason, /tampered|signature/);
});

test("invalid signature is rejected (M1)", async () => {
  const { mem } = await withBoundary();
  const wrong = generateKeyPair(); // not the registered peer key
  const rec = foreignRecord("mf4");
  const bundle = signedBundle(wrong.privateKey, rec, { issuer: "peerA", issuerKeyRef: "peer-key" });
  const res = await mem.importBundle(bundle, "b1");
  assert.equal(res.ok, false);
  assert.match(res.reason, /invalid bundle signature/);
});

test("classification ceiling: over-classified foreign memory may not cross the boundary (S4/M2)", async () => {
  const { mem, issuerKeys } = await withBoundary();
  const rec = foreignRecord("mf5", { classification: CLASS.secret }); // above boundary ceiling (restricted)
  const bundle = signedBundle(issuerKeys.privateKey, rec, { issuer: "peerA", issuerKeyRef: "peer-key" });
  const res = await mem.importBundle(bundle, "b1");
  assert.equal(res.ok, false);
  assert.match(res.reason, /classification exceeds/);
});

test("partition is fail-closed: unreachable source node denies inbound memory (M6)", async () => {
  const partition = new PartitionMonitor();
  const { mem, issuerKeys } = await withBoundary(partition);
  partition.markUnreachable("memory:node-peer");
  const rec = foreignRecord("mf6");
  const bundle = signedBundle(issuerKeys.privateKey, rec, { issuer: "peerA", issuerKeyRef: "peer-key" });
  const res = await mem.importBundle(bundle, "b1");
  assert.equal(res.ok, false);
  assert.match(res.reason, /partition/);
});

test("replay-stale bundle rejected: expired bundle is not fresh (M7)", async () => {
  const { mem, issuerKeys } = await withBoundary();
  const rec = foreignRecord("mf7");
  const past = 1000;
  const bundle = signedBundle(issuerKeys.privateKey, rec, { issuer: "peerA", issuerKeyRef: "peer-key", issuedAt: past, expiresAt: past + 1 });
  const res = await mem.importBundle(bundle, "b1", { now: Date.now() });
  assert.equal(res.ok, false);
  assert.match(res.reason, /expired|fresh/);
});
