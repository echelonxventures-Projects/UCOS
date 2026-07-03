/**
 * PI-9 Memory Fabric — canonical adversarial suite M1–M12 (PHASE 18.2-R / MEM-THREAT-001 / AD-0023 §2 M-B).
 *
 * Each vector asserts FAIL-CLOSED behaviour: the attack is denied, and no governed state is mutated,
 * recalled, escalated, or bypassed. Vectors:
 *   M1 Replay · M2 Forged Assertion · M3 Namespace Escape · M4 Authority Escalation · M5 Silent Mutation
 *   M6 Audit Tampering · M7 Federation Poisoning · M8 Trust Inflation · M9 Memory Corruption
 *   M10 Retention Bypass · M11 Revocation Bypass · M12 Evolution Bypass
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildMemory,
  localUnit,
  localRecord,
  signedBundle,
  generateKeyPair,
  unitHash,
  CLASS,
  PartitionMonitor,
} from "./memory-harness.ts";
import { MemoryAuditLog } from "../src/control/memory/memory-audit.ts";
import { namespacedId, recordKey } from "../src/control/memory/memory-namespace.ts";
import type { MemoryControl } from "../src/control/memory/memory-control.ts";

// -------- shared federation boundary setup --------
async function withBoundary(partition?: PartitionMonitor) {
  const { mem } = await buildMemory(partition);
  const peer = generateKeyPair();
  mem.keys.register("peer-key", peer.publicKeyPem);
  mem.registerAuthority({ authorityId: "peerA", owner: "peer-node", powers: ["federate"], keyRef: "peer-key", scope: "memory:*" });
  mem.defineBoundary({ boundaryId: "b1", members: ["peerA"], maxTrustLevel: 3, namespaceScope: "memory:*", maxClassificationLevel: CLASS.restricted.level });
  return { mem, peer };
}

function foreign(memIdLocal: string, opts: { trustLevel?: number; classification?: Classification } = {}) {
  const unit = localUnit(memIdLocal, { value: { foreign: true } });
  return localRecord(unit, {
    memId: namespacedId("node-peer", memIdLocal),
    trustLevel: opts.trustLevel ?? 9,
    classification: opts.classification ?? CLASS.internal,
    source: { kind: "federated", nodeId: "node-peer", authorityId: "peerA" },
    state: "active",
  });
}
type Classification = (typeof CLASS)[keyof typeof CLASS];

// -------- governed-commit (SoD) setup --------
async function withAuthorities(): Promise<{ mem: MemoryControl; ca: ReturnType<typeof generateKeyPair>; ra: ReturnType<typeof generateKeyPair> }> {
  const { mem } = await buildMemory();
  const ca = generateKeyPair();
  const ra = generateKeyPair();
  mem.keys.register("ca-key", ca.publicKeyPem);
  mem.keys.register("ra-key", ra.publicKeyPem);
  mem.certifications.register({ caId: "ca1", owner: "certifier-1", keyRef: "ca-key" });
  mem.ratifications.register({ raId: "ra1", owner: "ratify-lead", keyRef: "ra-key", quorum: 1 });
  // Enumerated-power memory authorities (no implicit authority).
  mem.registerAuthority({ authorityId: "consolidator-1", owner: "p-cons", powers: ["consolidate"], keyRef: "ca-key", scope: "memory:*" });
  mem.registerAuthority({ authorityId: "certifier-1", owner: "p-cert", powers: ["certify"], keyRef: "ca-key", scope: "memory:*" });
  mem.registerAuthority({ authorityId: "ratifier-1", owner: "p-rat", powers: ["ratify"], keyRef: "ra-key", scope: "memory:*" });
  return { mem, ca, ra };
}

function govAssertions(mem: MemoryControl, ca: ReturnType<typeof generateKeyPair>, ra: ReturnType<typeof generateKeyPair>, uh: string) {
  const cert = mem.certifications.issue(ca.privateKey, { unitHash: uh, caId: "ca1" });
  const rat = mem.ratifications.issue(ra.privateKey, {
    unitHash: uh, raId: "ra1", consolidator: "consolidator-1", certifier: "certifier-1", certificationId: cert.certificationId, ratifiers: ["ratifier-1"],
  });
  return { cert, rat };
}

// ============================ M1 — Replay Attack ============================
test("M1 replay: a re-presented signed bundle is rejected (single-use nonce, fail-closed)", async () => {
  const { mem, peer } = await withBoundary();
  const rec = foreign("m1");
  const bundle = signedBundle(peer.privateKey, rec, { issuer: "peerA", issuerKeyRef: "peer-key" });
  const first = await mem.importBundle(bundle, "b1");
  assert.equal(first.ok, true, first.reason);
  const replay = await mem.importBundle(bundle, "b1"); // same bundle, same nonce
  assert.equal(replay.ok, false);
  assert.match(replay.reason, /replay|nonce/i);
});

// ============================ M2 — Forged Assertion ============================
test("M2 forged assertion: a forged memory certification is rejected (fail-closed)", async () => {
  const { mem, ca, ra } = await withAuthorities();
  const rec = localRecord(localUnit("m2"), { memId: "m2" });
  const { cert, rat } = govAssertions(mem, ca, ra, rec.unitHash);
  const forgedCert = { ...cert, certifier: "someone-else" }; // tampered ⇒ signature/owner mismatch
  await assert.rejects(() => mem.governedCommit(rec, { certification: forgedCert, ratification: rat }), /forged|invalid|bound/i);
  // A forged federated bundle signature is likewise rejected.
  const { mem: mem2, peer } = await withBoundary();
  const wrong = generateKeyPair();
  const bad = signedBundle(wrong.privateKey, foreign("m2b"), { issuer: "peerA", issuerKeyRef: "peer-key" });
  assert.equal((await mem2.importBundle(bad, "b1")).ok, false);
});

// ============================ M3 — Namespace Escape ============================
test("M3 namespace escape: recall is namespace-isolated; cross-namespace access denied", async () => {
  const { mem } = await buildMemory();
  await mem.commit(localRecord(localUnit("iso", { namespace: "memory:long-term:subjectA" }), { memId: "iso" }));
  // Same memId under a DIFFERENT namespace must not resolve (no escape across the namespace boundary).
  assert.equal(mem.recall("memory:long-term:subjectB", "iso"), undefined);
  // Persisted key is confined to the reserved memory namespace.
  const rec = localRecord(localUnit("iso2"), { memId: "iso2" });
  assert.ok(recordKey(rec.namespace, rec.memId, rec.version).startsWith("memory:"), "records live only under memory:*");
});

// ============================ M4 — Authority Escalation ============================
test("M4 authority escalation: a principal lacking 'consolidate' power cannot governed-commit", async () => {
  const { mem, ca, ra } = await withAuthorities();
  // Downgrade the consolidator to a powerless authority (escalation attempt).
  mem.registerAuthority({ authorityId: "consolidator-1", owner: "p-cons", powers: ["audit"], keyRef: "ca-key", scope: "memory:*" });
  const rec = localRecord(localUnit("m4"), { memId: "m4" });
  const { cert, rat } = govAssertions(mem, ca, ra, rec.unitHash);
  await assert.rejects(() => mem.governedCommit(rec, { certification: cert, ratification: rat }), /lacks 'consolidate'|escalat|power/i);
  // Registering an authority with no enumerated powers is itself rejected (no implicit authority).
  assert.throws(() => mem.registerAuthority({ authorityId: "empty", owner: "x", powers: [], keyRef: "ca-key", scope: "memory:*" }));
});

test("M4b SoD: consolidator and certifier may not be the same principal (consolidate≠certify)", async () => {
  const { mem, ra } = await withAuthorities();
  const rec = localRecord(localUnit("m4b"), { memId: "m4b" });
  assert.throws(() =>
    mem.ratifications.issue(ra.privateKey, {
      unitHash: rec.unitHash, raId: "ra1", consolidator: "same", certifier: "same", certificationId: "c", ratifiers: ["ratifier-1"],
    }),
  /SoD/i);
});

// ============================ M5 — Silent Mutation ============================
test("M5 silent mutation: no direct store write path; every commit is audited", async () => {
  const { mem } = await buildMemory();
  // The store exposes no public governed-write API (mutation only via evolution).
  const store = mem.store as unknown as Record<string, unknown>;
  for (const m of ["put", "set", "write", "delete", "remove"]) assert.equal(typeof store[m], "undefined", `store must not expose ${m}`);
  const auditBefore = mem.audit.entries().length;
  await mem.commit(localRecord(localUnit("m5"), { memId: "m5" }));
  const activated = mem.audit.entries().filter((e) => e.event === "MEM_ACTIVATED" && e.detail.includes("v=1.0.0"));
  assert.ok(activated.length >= 1, "commit produced an audit event (no un-audited mutation)");
  assert.ok(mem.audit.entries().length > auditBefore);
});

// ============================ M6 — Audit Tampering ============================
test("M6 audit tampering: any post-hoc edit to the hash-chained audit is detected", async () => {
  const { mem } = await buildMemory();
  await mem.commit(localRecord(localUnit("m6"), { memId: "m6" }));
  const exported = mem.audit.export();
  const tampered = { ...exported, chain: exported.chain.map((c, i) => (i === 0 ? { ...c, entry: { ...c.entry, detail: "HACKED" } } : c)) };
  assert.equal(MemoryAuditLog.verify(tampered).ok, false);
  assert.equal(MemoryAuditLog.verify(exported).ok, true, "untampered chain verifies");
});

// ============================ M7 — Federation Poisoning ============================
test("M7 federation poisoning: an out-of-boundary issuer is denied (deny-by-default)", async () => {
  const { mem, peer } = await withBoundary();
  const bundle = signedBundle(peer.privateKey, foreign("m7"), { issuer: "not-a-member", issuerKeyRef: "peer-key" });
  const res = await mem.importBundle(bundle, "b1");
  assert.equal(res.ok, false);
  assert.match(res.reason, /not a member|deny/i);
});

// ============================ M8 — Trust Inflation ============================
test("M8 trust inflation: conferred trust is clamped to the boundary ceiling", async () => {
  const { mem, peer } = await withBoundary();
  const rec = foreign("m8", { trustLevel: 9 }); // claims trust 9; boundary ceiling is 3
  const bundle = signedBundle(peer.privateKey, rec, { issuer: "peerA", issuerKeyRef: "peer-key" });
  assert.equal((await mem.importBundle(bundle, "b1")).ok, true);
  const got = mem.recall(rec.namespace, rec.memId);
  assert.equal(got?.trustLevel, 3, "trust clamped 9 -> 3 (no inflation)");
});

// ============================ M9 — Memory Corruption ============================
test("M9 memory corruption: a record whose unitHash does not match its unit is rejected", async () => {
  const { mem } = await buildMemory();
  const rec = localRecord(localUnit("m9"), { memId: "m9" });
  const corrupt = { ...rec, unit: { ...rec.unit, value: { note: "CORRUPTED" } } }; // unitHash no longer matches
  await assert.rejects(() => mem.commit(corrupt), /unitHash mismatch|tamper/i);
  // Federated corruption (tamper after signing) is also rejected.
  const { mem: mem2, peer } = await withBoundary();
  const bad = signedBundle(peer.privateKey, foreign("m9b"), { issuer: "peerA", issuerKeyRef: "peer-key", tamper: true });
  assert.equal((await mem2.importBundle(bad, "b1")).ok, false);
});

// ============================ M10 — Retention Bypass ============================
test("M10 retention bypass: nothing is durable-by-omission; expired memory is unrecallable", async () => {
  const { mem } = await buildMemory();
  // Durable record committed with NO explicit expiry ⇒ a finite expiry is derived (no infinite retention).
  const rec = localRecord(localUnit("m10"), { memId: "m10", retentionClass: "durable" });
  await mem.commit(rec);
  const stored = mem.recall("memory:long-term:subjectA", "m10");
  assert.ok(stored?.expiresAt !== undefined && Number.isFinite(stored.expiresAt), "durable expiry is finite (derived)");
  // An ephemeral record captured in the deep past is expired ⇒ absent ⇒ deny (fail-closed).
  const eph = localRecord(localUnit("m10e", { tier: "working", namespace: "memory:working:s", subjectRef: "s" }), { memId: "m10e", retentionClass: "ephemeral", capturedAt: 1 });
  await mem.commit(eph);
  assert.equal(mem.recall("memory:working:s", "m10e", { now: Date.now() }), undefined);
});

// ============================ M11 — Revocation Bypass ============================
test("M11 revocation bypass: a revoked memory cannot be recalled by any path (fail-closed)", async () => {
  const { mem } = await buildMemory();
  const rec = localRecord(localUnit("m11"), { memId: "m11" });
  await mem.commit(rec);
  assert.ok(mem.recall("memory:long-term:subjectA", "m11"), "recallable before revoke");
  mem.revoke("record", `${rec.namespace}:${rec.memId}@${rec.version}`, "board");
  assert.equal(mem.recall("memory:long-term:subjectA", "m11"), undefined, "revoked ⇒ denied");
  // Re-attempting recall after revocation stays denied (revocation propagates; no bypass).
  assert.equal(mem.recall("memory:long-term:subjectA", "m11"), undefined);
});

// ============================ M12 — Evolution Bypass ============================
test("M12 evolution bypass: durable persistence only occurs through the Evolution Fabric", async () => {
  const { mem } = await buildMemory();
  const before = mem.evolution.audit.chain().length;
  await mem.commit(localRecord(localUnit("m12"), { memId: "m12" }));
  const after = mem.evolution.audit.chain().length;
  assert.ok(after > before, "persistence routed through the evolution governor (audit chain grew)");
  // There is no store-level write to bypass the governor.
  const store = mem.store as unknown as Record<string, unknown>;
  assert.equal(typeof store["put"], "undefined");
  // The record is recallable only because it was applied via evolution (integrity end-to-end).
  assert.equal(mem.recall("memory:long-term:subjectA", "m12")?.unitHash, unitHash(localUnit("m12")));
});
