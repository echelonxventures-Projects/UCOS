/**
 * PI-9 Memory Fabric — canonical MEM-THREAT-001 adversarial closure for M8 / M11 / M12
 * (PHASE 18.2-R2; remediation of PHASE 18.3-R rejection MEM-RAT-002 / MEM-RAT-SEC-002 finding F-M-1).
 *
 * This suite closes the three canonical threats an independent validator could NOT reproduce as passing
 * because no dedicated adversarial test existed (M8/M11/M12 in the MEM-THREAT-001 numbering — distinct
 * from the internal numbering used by memory-adversarial.test.ts). Every vector asserts FAIL-CLOSED
 * behaviour: the attack is DENIED and no governed state is escalated, desynchronised, or exhausted.
 *
 *   M8  — Consolidation authority escalation / self-promotion (SoD C4≠C5≠C6).
 *   M11 — Semantic drift / memory↔knowledge desynchronisation (co-ratification).
 *   M12 — Working-memory exhaustion (WM/STM size caps).
 *
 * Expected outcome for every adversarial case: DENY.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMemory, localUnit, localRecord, generateKeyPair, CLASS } from "./memory-harness.ts";
import { signPayload } from "../src/control/federation/assertions.ts";
import type { MemoryControl } from "../src/control/memory/memory-control.ts";
import type { MemoryKnowledgeOracle } from "../src/control/memory/memory-knowledge-guard.ts";
import type { MemoryRatification } from "../src/control/memory/memory-ratification-authority.ts";

// ============================================================================================
// M8 — CONSOLIDATION AUTHORITY ESCALATION / SELF-PROMOTION (SoD)
// ============================================================================================

/** Governed-commit setup: two keys, a certification authority, a ratification authority, and the three
 *  enumerated-power memory principals (consolidate / certify / ratify) — no implicit authority. */
async function withAuthorities(): Promise<{ mem: MemoryControl; ca: ReturnType<typeof generateKeyPair>; ra: ReturnType<typeof generateKeyPair> }> {
  const { mem } = await buildMemory();
  const ca = generateKeyPair();
  const ra = generateKeyPair();
  mem.keys.register("ca-key", ca.publicKeyPem);
  mem.keys.register("ra-key", ra.publicKeyPem);
  mem.certifications.register({ caId: "ca1", owner: "certifier-1", keyRef: "ca-key" });
  mem.ratifications.register({ raId: "ra1", owner: "ratify-lead", keyRef: "ra-key", quorum: 1 });
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

test("M8.1 self-promotion DENY: a single actor acting as consolidator+certifier(+ratifier) cannot promote its own memory (SoD)", async () => {
  const { mem, ra } = await withAuthorities();
  const rec = localRecord(localUnit("m8-self"), { memId: "m8-self" });
  // consolidate ≡ certify (self-promotion): ratification cannot even be issued.
  assert.throws(
    () => mem.ratifications.issue(ra.privateKey, { unitHash: rec.unitHash, raId: "ra1", consolidator: "solo", certifier: "solo", certificationId: "c", ratifiers: ["ratifier-1"] }),
    /SoD/i,
  );
  // consolidator also self-ratifies (ratify ≡ consolidate): still rejected.
  assert.throws(
    () => mem.ratifications.issue(ra.privateKey, { unitHash: rec.unitHash, raId: "ra1", consolidator: "solo", certifier: "certifier-1", certificationId: "c", ratifiers: ["solo"] }),
    /SoD/i,
  );
});

test("M8.2 forged consolidation authority DENY: mis-signed and tampered governance assertions are rejected at commit", async () => {
  const { mem, ca, ra } = await withAuthorities();
  const rec = localRecord(localUnit("m8-forge"), { memId: "m8-forge" });

  // (a) Certification signed with the WRONG key (forged) — verification fails fail-closed.
  const wrong = generateKeyPair();
  const forgedCert = mem.certifications.issue(wrong.privateKey, { unitHash: rec.unitHash, caId: "ca1" });
  const ratForForged = mem.ratifications.issue(ra.privateKey, {
    unitHash: rec.unitHash, raId: "ra1", consolidator: "consolidator-1", certifier: "certifier-1", certificationId: forgedCert.certificationId, ratifiers: ["ratifier-1"],
  });
  await assert.rejects(() => mem.governedCommit(rec, { certification: forgedCert, ratification: ratForForged }), /invalid|forged/i);

  // (b) Certification tampered after issue (identity swap) — the ratification binding no longer holds.
  const { cert, rat } = govAssertions(mem, ca, ra, rec.unitHash);
  const tampered = { ...cert, certifier: "someone-else" };
  await assert.rejects(() => mem.governedCommit(rec, { certification: tampered, ratification: rat }), /bound|invalid|forged/i);
});

test("M8.3 SoD violation DENY at commit: a validly-signed ratification that collapses roles is still rejected (defence-in-depth)", async () => {
  const { mem, ca, ra } = await withAuthorities();
  const rec = localRecord(localUnit("m8-sod"), { memId: "m8-sod" });
  // A powerful principal 'dup' holding BOTH consolidate and certify tries to collapse the two roles.
  mem.certifications.register({ caId: "caDup", owner: "dup", keyRef: "ca-key" });
  mem.registerAuthority({ authorityId: "dup", owner: "dup", powers: ["consolidate", "certify"], keyRef: "ca-key", scope: "memory:*" });
  const cert = mem.certifications.issue(ca.privateKey, { unitHash: rec.unitHash, caId: "caDup" }); // cert.certifier = "dup"
  // Hand-craft a ratification (bypassing issue()'s guard) with consolidator === certifier === "dup", validly signed.
  const base = {
    ratificationId: "mem-rat-crafted", unitHash: rec.unitHash, raId: "ra1",
    consolidator: "dup", certifier: "dup", certificationId: cert.certificationId, ratifiers: ["ratifier-1"], quorumMet: true,
  };
  const at = Date.now();
  const crafted: MemoryRatification = { ...base, at, signature: signPayload({ ...base, at }, ra.privateKey) };
  await assert.rejects(() => mem.governedCommit(rec, { certification: cert, ratification: crafted }), /SoD|separation|invalid|forged/i);
});

test("M8.4 unauthorized consolidation DENY: a consolidator lacking the 'consolidate' power cannot governed-commit", async () => {
  const { mem, ca, ra } = await withAuthorities();
  const rec = localRecord(localUnit("m8-unauth"), { memId: "m8-unauth" });
  const { cert, rat } = govAssertions(mem, ca, ra, rec.unitHash);
  // Escalation attempt: strip the consolidator's power AFTER assertions were issued.
  mem.registerAuthority({ authorityId: "consolidator-1", owner: "p-cons", powers: ["audit"], keyRef: "ca-key", scope: "memory:*" });
  await assert.rejects(() => mem.governedCommit(rec, { certification: cert, ratification: rat }), /lacks 'consolidate'|power|escalat/i);
});

test("M8.5 privilege-escalation DENY: empty-power authority is rejected, and an unregistered consolidator cannot commit", async () => {
  const { mem, ca, ra } = await withAuthorities();
  // No implicit authority: registering a powerless authority is itself rejected.
  assert.throws(() => mem.registerAuthority({ authorityId: "empty", owner: "x", powers: [], keyRef: "ca-key", scope: "memory:*" }), /enumerated powers|implicit/i);
  // A ratification naming an UNREGISTERED consolidator ("ghost") fails the enumerated-power check.
  const rec = localRecord(localUnit("m8-ghost"), { memId: "m8-ghost" });
  const cert = mem.certifications.issue(ca.privateKey, { unitHash: rec.unitHash, caId: "ca1" });
  const rat = mem.ratifications.issue(ra.privateKey, {
    unitHash: rec.unitHash, raId: "ra1", consolidator: "ghost", certifier: "certifier-1", certificationId: cert.certificationId, ratifiers: ["ratifier-1"],
  });
  await assert.rejects(() => mem.governedCommit(rec, { certification: cert, ratification: rat }), /lacks 'consolidate'|ghost|power/i);
});

// ============================================================================================
// M11 — MEMORY ↔ KNOWLEDGE DESYNCHRONISATION (CO-RATIFICATION)
// ============================================================================================

/** A mutable, read-only co-ratification oracle standing in for the ratified Knowledge Fabric. */
function knowledgeOracle(initial: Record<string, string> = {}) {
  const states = new Map<string, string>(Object.entries(initial));
  const oracle: MemoryKnowledgeOracle = {
    status: (ref) => (states.has(ref) ? { state: states.get(ref) as string } : undefined),
  };
  return { oracle, set: (ref: string, state: string) => states.set(ref, state), rollback: (ref: string) => states.delete(ref) };
}

function semanticRecord(id: string, knowledgeRef?: string) {
  const unit = localUnit(id, { tier: "semantic", namespace: "memory:semantic:subjectA", subjectRef: "subjectA", ...(knowledgeRef !== undefined ? { knowledgeRef } : {}) });
  return localRecord(unit, { memId: id, classification: CLASS.internal });
}

test("M11.1 desync DENY: a semantic memory contradicting ratified knowledge (revoked/superseded/draft) is rejected", async () => {
  for (const badState of ["revoked", "superseded", "draft"]) {
    const kb = knowledgeOracle({ K1: badState });
    const { mem } = await buildMemory(undefined, { knowledge: kb.oracle });
    await assert.rejects(() => mem.commit(semanticRecord(`m11a-${badState}`, "K1")), /co-ratification|not co-ratified|contradict/i);
  }
});

test("M11.2 knowledgeRef validation DENY: a dangling ref, and any knowledge-backed semantic memory with no oracle, are rejected", async () => {
  // Dangling / unknown reference (oracle has no such knowledge).
  const kb = knowledgeOracle({});
  const { mem } = await buildMemory(undefined, { knowledge: kb.oracle });
  await assert.rejects(() => mem.commit(semanticRecord("m11b-dangling", "K-missing")), /dangling|does not resolve|co-ratification/i);
  // No co-ratification oracle configured at all: co-ratification cannot be established ⇒ deny.
  const { mem: memNoOracle } = await buildMemory();
  await assert.rejects(() => memNoOracle.commit(semanticRecord("m11b-nooracle", "K1")), /requires a co-ratification oracle|co-ratification/i);
});

test("M11.3 co-ratification holds: commit is admitted ONLY while backing knowledge is active/ratified (gate is not blanket-deny)", async () => {
  const kb = knowledgeOracle({ K1: "active" });
  const { mem } = await buildMemory(undefined, { knowledge: kb.oracle });
  // Positive control: an active-backed semantic memory commits and recalls.
  await mem.commit(semanticRecord("m11c-ok", "K1"));
  assert.ok(mem.recall("memory:semantic:subjectA", "m11c-ok"), "co-ratified semantic memory is recallable");
  // A semantic memory WITHOUT a knowledgeRef is unaffected by the gate (not knowledge-backed).
  await mem.commit(semanticRecord("m11c-free"));
  assert.ok(mem.recall("memory:semantic:subjectA", "m11c-free"), "non-knowledge-backed semantic memory unaffected");
});

test("M11.4 cross-reference tampering DENY: mutating knowledgeRef after hashing breaks unit integrity", async () => {
  const kb = knowledgeOracle({ K1: "active", "K-evil": "active" });
  const { mem } = await buildMemory(undefined, { knowledge: kb.oracle });
  const rec = semanticRecord("m11d", "K1");
  // Repoint the knowledgeRef post-hash (both refs are "active", so only the hash binding can catch it).
  const tampered = { ...rec, unit: { ...rec.unit, knowledgeRef: "K-evil" } };
  await assert.rejects(() => mem.commit(tampered), /unitHash mismatch|tamper/i);
});

test("M11.5 knowledge rollback attack DENY: recall denies once backing knowledge is rolled back/revoked", async () => {
  const kb = knowledgeOracle({ K1: "active" });
  const { mem } = await buildMemory(undefined, { knowledge: kb.oracle });
  await mem.commit(semanticRecord("m11e", "K1"));
  assert.ok(mem.recall("memory:semantic:subjectA", "m11e"), "recallable while co-ratified");
  // Attacker rolls back / revokes the backing knowledge → the stale semantic memory must become absent.
  kb.set("K1", "revoked");
  assert.equal(mem.recall("memory:semantic:subjectA", "m11e"), undefined, "revoked backing ⇒ recall denied");
  // Fully removing the knowledge (dangling) also denies.
  kb.rollback("K1");
  assert.equal(mem.recall("memory:semantic:subjectA", "m11e"), undefined, "rolled-back backing ⇒ recall denied");
});

// ============================================================================================
// M12 — WORKING-MEMORY EXHAUSTION (WM / STM SIZE CAPS)
// ============================================================================================

function volatileRecord(tier: "working" | "short-term", namespace: string, id: string, version = "1.0.0") {
  const unit = localUnit(id, { tier, namespace, subjectRef: "s" });
  return localRecord(unit, { memId: id, version, retentionClass: "bounded", state: "active" });
}

test("M12.1 working-memory limit enforced: accumulation beyond the working cap is rejected (fail-closed)", async () => {
  const { mem } = await buildMemory(undefined, { capacity: { working: 3 } });
  const ns = "memory:working:s";
  for (const id of ["w1", "w2", "w3"]) await mem.commit(volatileRecord("working", ns, id));
  await assert.rejects(() => mem.commit(volatileRecord("working", ns, "w4")), /capacity exhausted|cap|exceed/i);
});

test("M12.2 STM capacity limit enforced: accumulation beyond the short-term cap is rejected (fail-closed)", async () => {
  const { mem } = await buildMemory(undefined, { capacity: { "short-term": 2 } });
  const ns = "memory:short-term:s";
  for (const id of ["s1", "s2"]) await mem.commit(volatileRecord("short-term", ns, id));
  await assert.rejects(() => mem.commit(volatileRecord("short-term", ns, "s3")), /capacity exhausted|cap|exceed/i);
});

test("M12.3 flooding / resource-exhaustion attack fails: a write burst is bounded exactly at the cap", async () => {
  const cap = 5;
  const { mem } = await buildMemory(undefined, { capacity: { working: cap } });
  const ns = "memory:working:flood";
  let admitted = 0;
  let denied = 0;
  for (let i = 0; i < 20; i++) {
    try {
      await mem.commit(volatileRecord("working", ns, `f${i}`));
      admitted++;
    } catch {
      denied++;
    }
  }
  assert.equal(admitted, cap, "exactly `cap` distinct records admitted (bounded)");
  assert.equal(denied, 20 - cap, "every write beyond the cap is denied");
  // Live population never exceeds the cap.
  assert.ok(mem.queryEngine.query({ namespace: ns, tier: "working" }).length <= cap);
});

test("M12.4 unbounded accumulation DENY, but re-versioning an existing id is admitted (no false positive)", async () => {
  const { mem } = await buildMemory(undefined, { capacity: { working: 3 } });
  const ns = "memory:working:s";
  for (const id of ["w1", "w2", "w3"]) await mem.commit(volatileRecord("working", ns, id));
  // A NEW distinct id is denied (cap holds the line)...
  await assert.rejects(() => mem.commit(volatileRecord("working", ns, "w4")), /capacity exhausted|cap|exceed/i);
  // ...but superseding an EXISTING id with a new version consumes no new capacity (admitted).
  await mem.commit(volatileRecord("working", ns, "w1", "2.0.0"));
  assert.equal(mem.recall(ns, "w1")?.version, "2.0.0", "re-version admitted; capacity not falsely consumed");
  // The cap is still enforced afterwards.
  await assert.rejects(() => mem.commit(volatileRecord("working", ns, "w5")), /capacity exhausted|cap|exceed/i);
});

test("M12.5 opt-in only: an unconfigured tier is unbounded (no behaviour change) and long-term is never size-capped", async () => {
  // No capacity policy ⇒ working tier accepts well beyond any small cap (default behaviour preserved).
  const { mem } = await buildMemory();
  const ns = "memory:working:s";
  for (let i = 0; i < 8; i++) await mem.commit(volatileRecord("working", ns, `u${i}`));
  assert.equal(mem.queryEngine.query({ namespace: ns, tier: "working" }).length, 8, "uncapped tier accumulates freely");
  // Even WITH a working cap, durable long-term memory is never volatile-capped.
  const { mem: mem2 } = await buildMemory(undefined, { capacity: { working: 1 } });
  for (let i = 0; i < 5; i++) {
    await mem2.commit(localRecord(localUnit(`lt${i}`, { namespace: "memory:long-term:subjectA" }), { memId: `lt${i}` }));
  }
  assert.equal(mem2.queryEngine.query({ namespace: "memory:long-term:subjectA", tier: "long-term" }).length, 5, "long-term is not size-capped");
});
