/**
 * CGR-W2-CRL-03 — Resolution Audit Emitter.
 * Categories: Append-only · Replay verification · Audit continuity · Non-mutation guarantee ·
 * Determinism · Fail-closed.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolutionFixture } from "../wave-b-harness.ts";
import {
  ResolutionAuditEmitter,
  verifyResolutionAudit,
  verifyResolutionReplay,
} from "../../../src/control/constitutional-governance/constitutional-resolution/audit.ts";
import { GENESIS_PREV_HASH } from "../../../src/control/constitutional-governance/audit-chain.ts";
import type { PrecedenceResult } from "../../../src/control/constitutional-governance/constitutional-resolution/precedence.ts";

test("CRL-03 append-only: emissions extend a genesis-anchored, hash-linked spine (seq + back-link)", () => {
  const f1 = resolutionFixture("CAP-01");
  const f2 = resolutionFixture("PCAMG-META-I");
  const emitter = new ResolutionAuditEmitter();
  assert.equal(emitter.size(), 0);
  assert.equal(emitter.head(), GENESIS_PREV_HASH);

  const r1 = emitter.emit(f1.gov, f1.precedence);
  const r2 = emitter.emit(f1.gov, f2.precedence);
  assert.equal(r1.emitted, true);
  assert.equal(r2.emitted, true);
  assert.equal(emitter.size(), 2);
  assert.equal(r1.entry!.seq, 0);
  assert.equal(r1.entry!.prevHash, GENESIS_PREV_HASH);
  assert.equal(r2.entry!.seq, 1);
  assert.equal(r2.entry!.prevHash, r1.entry!.entryHash, "each entry back-links to its predecessor");
  assert.equal(emitter.head(), r2.entry!.entryHash);
  assert.match(emitter.head(), /^[0-9a-f]{64}$/);
});

test("CRL-03 anchor: each resolution record anchors to the governance audit head (read, never appended)", () => {
  const { gov, precedence } = resolutionFixture("CAP-01");
  const emitter = new ResolutionAuditEmitter();
  const res = emitter.emit(gov, precedence);
  assert.equal(res.entry!.record.auditHead, gov.auditChain.head());
  assert.equal(res.entry!.record.supreme, "PCAMG-PRIN-001");
});

test("CRL-03 replay: a pristine spine verifies and replays exactly", () => {
  const f1 = resolutionFixture("CAP-01");
  const f2 = resolutionFixture("PCAMG-META-I");
  const emitter = new ResolutionAuditEmitter();
  emitter.emit(f1.gov, f1.precedence);
  emitter.emit(f1.gov, f2.precedence);
  const entries = emitter.entries();
  assert.equal(verifyResolutionAudit(entries).valid, true);
  assert.equal(verifyResolutionReplay(entries).valid, true);
  assert.equal(verifyResolutionAudit(entries).checked, 2);
});

test("CRL-03 audit continuity: content tampering is detected (entryHash mismatch)", () => {
  const { gov, precedence } = resolutionFixture("CAP-01");
  const emitter = new ResolutionAuditEmitter();
  emitter.emit(gov, precedence);
  const entries = emitter.entries();
  const tampered = [...entries];
  tampered[0] = { ...entries[0]!, record: { ...entries[0]!.record, supreme: "HACKED" } };
  assert.equal(verifyResolutionAudit(tampered).valid, false);
  assert.equal(verifyResolutionAudit(tampered).brokenAt, 0);
});

test("CRL-03 audit continuity: reordering breaks the back-link chain", () => {
  const f1 = resolutionFixture("CAP-01");
  const f2 = resolutionFixture("PCAMG-META-I");
  const emitter = new ResolutionAuditEmitter();
  emitter.emit(f1.gov, f1.precedence);
  emitter.emit(f1.gov, f2.precedence);
  const entries = emitter.entries();
  const reordered = [entries[1]!, entries[0]!];
  assert.equal(verifyResolutionAudit(reordered).valid, false);
});

test("CRL-03 non-mutation: emitting appends NOTHING to the governance chain and freezes prior evidence", () => {
  const { gov, precedence } = resolutionFixture("CAP-01");
  const govSizeBefore = gov.auditChain.size();
  const govHeadBefore = gov.auditChain.head();
  const emitter = new ResolutionAuditEmitter();
  const res = emitter.emit(gov, precedence);
  assert.equal(gov.auditChain.size(), govSizeBefore, "resolution audit must never append to the governance chain");
  assert.equal(gov.auditChain.head(), govHeadBefore);
  assert.equal(Object.isFrozen(res.entry), true);
  assert.equal(Object.isFrozen(res.entry!.record), true);
  assert.equal(Object.isFrozen(emitter.entries()), true);
});

test("CRL-03 fail-closed: an undecided precedence emits no entry and returns a denial", () => {
  const undecided = {
    decided: false, subject: null, ordered: [], supreme: null,
    denial: { code: "E-EMPTY-PROVISION-SET", message: "x", detail: {} },
  } as unknown as PrecedenceResult;
  const { gov } = resolutionFixture("CAP-01");
  const emitter = new ResolutionAuditEmitter();
  const res = emitter.emit(gov, undecided);
  assert.equal(res.emitted, false);
  assert.equal(res.entry, null);
  assert.equal(res.denial?.code, "E-UNDECIDABLE-PRECEDENCE");
  assert.equal(emitter.size(), 0, "a fail-closed emit appends nothing");
});

test("CRL-03 determinism: identical state yields an identical spine head across independent emitters", () => {
  const { gov, precedence } = resolutionFixture("CAP-01");
  const a = new ResolutionAuditEmitter();
  const b = new ResolutionAuditEmitter();
  a.emit(gov, precedence);
  b.emit(gov, precedence);
  assert.equal(a.head(), b.head());
});
