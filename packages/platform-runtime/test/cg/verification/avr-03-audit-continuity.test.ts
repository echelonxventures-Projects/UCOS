/**
 * CGR-W2-AVR-03 — Verification Audit / Audit-Continuity Verifier.
 * Categories: Audit continuity · Append-only · Determinism · Fail-closed · Dependency validation.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { seededRuntime } from "../wave-a-harness.ts";
import { resolveAuthorityChain } from "../../../src/control/constitutional-governance/authority/resolve.ts";
import { verifyAndAudit } from "../../../src/control/constitutional-governance/verification/audit-continuity.ts";

test("AVR-03 audit-continuity: a valid chain yields a valid report anchored to the audit head", () => {
  const { gov, readModel } = seededRuntime();
  const chain = resolveAuthorityChain(readModel, "CAP-01").chain!;
  const report = verifyAndAudit(gov, readModel, chain);
  assert.equal(report.valid, true);
  assert.equal(report.integrity.valid, true);
  assert.equal(report.trace.valid, true);
  assert.equal(report.auditContinuity.valid, true);
  assert.equal(report.auditReplay.valid, true);
  assert.equal(report.auditHead, gov.auditChain.head());
  assert.match(report.auditHead, /^[0-9a-f]{64}$/);
});

test("AVR-03 append-only: verification appends NO audit entry (closed Wave-1 audit schema preserved)", () => {
  const { gov, readModel } = seededRuntime();
  const chain = resolveAuthorityChain(readModel, "CAP-01").chain!;
  const sizeBefore = gov.auditChain.size();
  const headBefore = gov.auditChain.head();
  verifyAndAudit(gov, readModel, chain);
  assert.equal(gov.auditChain.size(), sizeBefore, "no audit entry may be appended");
  assert.equal(gov.auditChain.head(), headBefore);
});

test("AVR-03 fail-closed: an incomplete chain makes the report invalid even though audit is intact", () => {
  const { gov, readModel } = seededRuntime();
  const chain = resolveAuthorityChain(readModel, "AD-0001").chain!;
  const report = verifyAndAudit(gov, readModel, chain);
  assert.equal(report.valid, false);
  assert.equal(report.integrity.valid, false);
  // audit continuity is independent and remains intact
  assert.equal(report.auditContinuity.valid, true);
  assert.equal(report.auditReplay.valid, true);
});

test("AVR-03 audit-continuity: the seeded audit chain is non-empty, continuous, and replay-exact", () => {
  const { gov, readModel } = seededRuntime();
  const chain = resolveAuthorityChain(readModel, "PCAMG-META-I").chain!;
  const report = verifyAndAudit(gov, readModel, chain);
  assert.ok(gov.auditChain.size() > 0, "seeding must have produced audit events");
  assert.equal(report.auditContinuity.checked, gov.auditChain.size());
});

test("AVR-03 determinism + immutability: identical state yields an identical, frozen report", () => {
  const a = (() => { const { gov, readModel } = seededRuntime(); return verifyAndAudit(gov, readModel, resolveAuthorityChain(readModel, "CAP-01").chain!); })();
  const b = (() => { const { gov, readModel } = seededRuntime(); return verifyAndAudit(gov, readModel, resolveAuthorityChain(readModel, "CAP-01").chain!); })();
  assert.equal(a.valid, b.valid);
  assert.equal(a.auditHead, b.auditHead);
  assert.equal(Object.isFrozen(a), true);
});
