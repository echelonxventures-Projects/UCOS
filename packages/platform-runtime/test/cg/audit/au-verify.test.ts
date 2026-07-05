/**
 * CGR-AU-VERIFY verification — offline audit-chain verifier.
 * Proves: valid chain PASS; tampered chain FAIL; continuity failure FAIL; deterministic replay PASS;
 * and that verification is read-only (inputs are not mutated).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { AuditHashChain, computeEntryHash } from "../../../src/control/constitutional-governance/audit-chain.ts";
import type { ChainedAuditEntry } from "../../../src/control/constitutional-governance/audit-chain.ts";
import { verifyChain, verifyReplay } from "../../../src/control/constitutional-governance/audit-verifier.ts";
import type { AuditEvent } from "../../../src/control/constitutional-governance/types.ts";

function evt(n: number): AuditEvent {
  return {
    actor: `actor-${n}`,
    action: "PROPOSE",
    registry: "REG-META",
    subjectRef: `PCAMG-META-${n}@1.0.0`,
    recordUuid: `uuid-${n}`,
    contentHash: `hash-${n}`,
    at: `2023-11-14T22:13:2${n}.000Z`,
  };
}

function buildChain(count: number): ChainedAuditEntry[] {
  const chain = new AuditHashChain();
  for (let i = 1; i <= count; i += 1) chain.append(evt(i));
  return [...chain.entries()];
}

test("AU-VERIFY: valid chain PASS", () => {
  const result = verifyChain(buildChain(5));
  assert.equal(result.valid, true);
  assert.equal(result.checked, 5);
  assert.equal(result.reason, undefined);
});

test("AU-VERIFY: empty chain is vacuously valid", () => {
  const result = verifyChain([]);
  assert.equal(result.valid, true);
  assert.equal(result.checked, 0);
});

test("AU-VERIFY: tampered chain FAIL — mutating a recorded event breaks the entryHash", () => {
  const entries = buildChain(4);
  // Forge a tampered entry at index 2 while KEEPING its stored entryHash (as an attacker would).
  const victim = entries[2]!;
  const tampered: ChainedAuditEntry = {
    ...victim,
    event: { ...victim.event, actor: "attacker" },
  };
  entries[2] = tampered;
  const result = verifyChain(entries);
  assert.equal(result.valid, false);
  assert.equal(result.brokenAt, 2);
  assert.match(result.reason ?? "", /tamper detected/);
});

test("AU-VERIFY: continuity failure FAIL — a re-linked prevHash is rejected", () => {
  const entries = buildChain(4);
  const victim = entries[2]!;
  const badPrev = "c".repeat(64);
  // Recompute entryHash consistently for the forged prevHash so the tamper check passes and the
  // failure is isolated to CONTINUITY (prevHash no longer equals the predecessor entryHash).
  const forgedHash = computeEntryHash({ seq: victim.seq, prevHash: badPrev, event: victim.event });
  entries[2] = { ...victim, prevHash: badPrev, entryHash: forgedHash };
  const result = verifyChain(entries);
  assert.equal(result.valid, false);
  assert.equal(result.brokenAt, 2);
  assert.match(result.reason ?? "", /continuity violation/);
});

test("AU-VERIFY: ordering failure FAIL — a non-monotonic seq is rejected", () => {
  const entries = buildChain(3);
  entries[1] = { ...entries[1]!, seq: 99 };
  const result = verifyChain(entries);
  assert.equal(result.valid, false);
  assert.equal(result.brokenAt, 1);
  assert.match(result.reason ?? "", /ordering violation/);
});

test("AU-VERIFY: deterministic replay PASS — a pristine chain regenerates identically", () => {
  const result = verifyReplay(buildChain(6));
  assert.equal(result.valid, true);
  assert.equal(result.checked, 6);
});

test("AU-VERIFY: replay FAIL — a silently re-linked entry diverges on regeneration", () => {
  const entries = buildChain(4);
  // Swap two events (a reordering an attacker might attempt); replay from events must diverge.
  const tmp = entries[1]!;
  entries[1] = { ...entries[2]!, seq: 1 };
  entries[2] = { ...tmp, seq: 2 };
  const result = verifyReplay(entries);
  assert.equal(result.valid, false);
});

test("AU-VERIFY: read-only — inputs are not mutated by verification", () => {
  const entries = buildChain(3);
  const before = JSON.stringify(entries);
  verifyChain(entries);
  verifyReplay(entries);
  assert.equal(JSON.stringify(entries), before, "verifier must not mutate its input");
});
