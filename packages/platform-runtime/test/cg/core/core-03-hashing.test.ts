/**
 * CGR-CORE-03 verification — canonical hashing + verify-on-read.
 * Proves: determinism; key-order independence; up-trace set-order independence;
 * single-byte tamper => verify false; 64-char lowercase hex; deterministic recordUuid.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeContentHash,
  computeRecordUuid,
  verifyRecordHash,
} from "../../../src/control/constitutional-governance/hashing.ts";
import type { ConstitutionalRecord } from "../../../src/control/constitutional-governance/types.ts";

const base = {
  registry: "REG-META" as const,
  logicalId: "PCAMG-META-I",
  version: "1.0.0",
  ownerAuthority: "authority-board",
  supersedes: null,
  upTrace: ["PCAMG-PRIN-001"],
  content: { a: 1, b: { c: 2, d: 3 } },
};

test("CORE-03: hash is deterministic and 64-char lowercase hex", () => {
  const h1 = computeContentHash(base);
  const h2 = computeContentHash(base);
  assert.equal(h1, h2);
  assert.match(h1, /^[0-9a-f]{64}$/);
});

test("CORE-03: hash is key-order independent (RG-6)", () => {
  const reordered = { ...base, content: { b: { d: 3, c: 2 }, a: 1 } };
  assert.equal(computeContentHash(base), computeContentHash(reordered));
});

test("CORE-03: up-trace is set-order independent", () => {
  const a = { ...base, upTrace: ["PCAMG-PRIN-001", "PCAMG-PRIN-002"] };
  const b = { ...base, upTrace: ["PCAMG-PRIN-002", "PCAMG-PRIN-001"] };
  assert.equal(computeContentHash(a), computeContentHash(b));
});

test("CORE-03: any content change changes the hash", () => {
  const mutated = { ...base, content: { a: 1, b: { c: 2, d: 4 } } };
  assert.notEqual(computeContentHash(base), computeContentHash(mutated));
});

test("CORE-03: verifyRecordHash detects a tampered content body", () => {
  const contentHash = computeContentHash(base);
  const recordUuid = computeRecordUuid(base);
  const good: ConstitutionalRecord = {
    recordUuid,
    ...base,
    status: "proposed",
    contentHash,
    createdBy: "tester",
    createdAt: "2023-11-14T22:13:20.000Z",
    seq: 0,
  };
  assert.equal(verifyRecordHash(good), true);
  const tampered: ConstitutionalRecord = { ...good, content: { a: 999, b: { c: 2, d: 3 } } };
  assert.equal(verifyRecordHash(tampered), false);
});

test("CORE-03: recordUuid is deterministic and distinct per (id,version,supersedes)", () => {
  assert.equal(computeRecordUuid(base), computeRecordUuid(base));
  const other = computeRecordUuid({ ...base, version: "1.0.1" });
  assert.notEqual(computeRecordUuid(base), other);
});
