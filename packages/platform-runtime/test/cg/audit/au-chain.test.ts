/**
 * CGR-AU-CHAIN verification — audit hash-chain layer.
 * Proves: genesis generation; prev-hash linkage / continuity; deterministic chain replay;
 * tamper detection (recompute); broken-chain detection; append-only immutability.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AuditHashChain,
  GENESIS_PREV_HASH,
  computeEntryHash,
  generateChain,
} from "../../../src/control/constitutional-governance/audit-chain.ts";
import type { AuditEvent } from "../../../src/control/constitutional-governance/types.ts";

function evt(n: number): AuditEvent {
  return {
    actor: `actor-${n}`,
    action: n % 2 === 0 ? "PROPOSE" : "SUPERSEDE",
    registry: "REG-PRIN",
    subjectRef: `PCAMG-PRIN-00${n}@1.0.0`,
    recordUuid: `uuid-${n}`,
    contentHash: `hash-${n}`,
    at: `2023-11-14T22:13:2${n}.000Z`,
  };
}

test("AU-CHAIN: genesis — empty chain head is the genesis anchor; first entry links to genesis", () => {
  const chain = new AuditHashChain();
  assert.equal(chain.size(), 0);
  assert.equal(chain.head(), GENESIS_PREV_HASH);
  assert.match(GENESIS_PREV_HASH, /^0{64}$/);

  const first = chain.append(evt(1));
  assert.equal(first.seq, 0);
  assert.equal(first.prevHash, GENESIS_PREV_HASH);
  assert.match(first.entryHash, /^[0-9a-f]{64}$/);
  assert.equal(chain.head(), first.entryHash);
});

test("AU-CHAIN: chain continuity — each prevHash equals the predecessor entryHash", () => {
  const chain = new AuditHashChain();
  const entries = [chain.append(evt(1)), chain.append(evt(2)), chain.append(evt(3))];
  assert.equal(entries[0]!.prevHash, GENESIS_PREV_HASH);
  for (let i = 1; i < entries.length; i += 1) {
    assert.equal(entries[i]!.prevHash, entries[i - 1]!.entryHash, `link break at ${i}`);
    assert.equal(entries[i]!.seq, i);
  }
  assert.equal(chain.head(), entries[2]!.entryHash);
});

test("AU-CHAIN: deterministic chain replay — identical events yield identical hashes", () => {
  const events = [evt(1), evt(2), evt(3), evt(4)];
  const a = generateChain(events);
  const b = generateChain(events);
  assert.equal(a.length, b.length);
  for (let i = 0; i < a.length; i += 1) {
    assert.equal(a[i]!.entryHash, b[i]!.entryHash);
    assert.equal(a[i]!.prevHash, b[i]!.prevHash);
  }

  // The stateful chain and the pure generator agree exactly.
  const chain = new AuditHashChain();
  for (const e of events) chain.append(e);
  const live = chain.entries();
  for (let i = 0; i < events.length; i += 1) {
    assert.equal(live[i]!.entryHash, a[i]!.entryHash, `live vs generated divergence at ${i}`);
  }
});

test("AU-CHAIN: tamper detection — recomputed entryHash changes when the event is altered", () => {
  const chain = new AuditHashChain();
  const original = chain.append(evt(1));
  const tamperedEvent: AuditEvent = { ...original.event, actor: "attacker" };
  const recomputed = computeEntryHash({ seq: original.seq, prevHash: original.prevHash, event: tamperedEvent });
  assert.notEqual(recomputed, original.entryHash, "altering the event must change the hash");
});

test("AU-CHAIN: broken-chain detection — a wrong prevHash changes the entryHash", () => {
  const e = evt(2);
  const good = computeEntryHash({ seq: 1, prevHash: "a".repeat(64), event: e });
  const broken = computeEntryHash({ seq: 1, prevHash: "b".repeat(64), event: e });
  assert.notEqual(good, broken, "entryHash must bind prevHash (continuity is hashed)");
});

test("AU-CHAIN: append-only immutability — entries are frozen and snapshots are defensive copies", () => {
  const chain = new AuditHashChain();
  const entry = chain.append(evt(1));
  assert.ok(Object.isFrozen(entry), "entry is frozen");
  assert.ok(Object.isFrozen(entry.event), "captured event is frozen");

  const snapshot = chain.entries();
  assert.ok(Object.isFrozen(snapshot), "snapshot array is frozen");
  chain.append(evt(2));
  assert.equal(snapshot.length, 1, "prior snapshot is not affected by later appends");
  assert.equal(chain.size(), 2);
});

test("AU-CHAIN: empty event list generates an empty chain (genesis only)", () => {
  const chain = generateChain([]);
  assert.equal(chain.length, 0);
});
