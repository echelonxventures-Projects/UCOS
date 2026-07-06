/**
 * CGR-W2-CRL-01 — Applicable-Provision Resolver.
 * Categories: Determinism · Fail-closed · Dependency validation (verified-chain requirement) ·
 * Append-only / non-mutation guarantee.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolutionFixture, reportFor } from "../wave-b-harness.ts";
import { seededRuntime } from "../wave-a-harness.ts";
import { resolveAuthorityChain } from "../../../src/control/constitutional-governance/authority/resolve.ts";
import { verifyAndAudit } from "../../../src/control/constitutional-governance/verification/audit-continuity.ts";
import { resolveApplicableProvisions } from "../../../src/control/constitutional-governance/constitutional-resolution/applicable-provision.ts";
import type { VerificationReport } from "../../../src/control/constitutional-governance/verification/audit-continuity.ts";
import type { ResolvedAuthorityChain } from "../../../src/control/constitutional-governance/authority/types.ts";

test("CRL-01 applicability: a verified complete chain resolves the full provision set, ordered by (depth, id)", () => {
  const { chain, applicable } = resolutionFixture("CAP-01");
  assert.equal(applicable.resolved, true);
  assert.equal(applicable.denial, null);
  assert.equal(applicable.subject, "CAP-01");
  assert.equal(applicable.provisions.length, chain.nodes.length);
  // deterministic order: non-decreasing depth, ties broken by ascending logicalId.
  for (let i = 1; i < applicable.provisions.length; i += 1) {
    const prev = applicable.provisions[i - 1]!;
    const cur = applicable.provisions[i]!;
    assert.ok(
      prev.depth < cur.depth || (prev.depth === cur.depth && prev.logicalId <= cur.logicalId),
      `order violation at ${i}: ${prev.logicalId} then ${cur.logicalId}`,
    );
  }
  // the principle root must be among the applicable provisions of a complete chain.
  assert.ok(applicable.provisions.some((p) => p.logicalId === "PCAMG-PRIN-001" && p.isRoot));
});

test("CRL-01 determinism: identical state yields byte-identical provisions (ids + hashes + order)", () => {
  const a = resolutionFixture("CAP-01").applicable;
  const b = resolutionFixture("CAP-01").applicable;
  assert.deepEqual(
    a.provisions.map((p) => [p.logicalId, p.contentHash, p.depth]),
    b.provisions.map((p) => [p.logicalId, p.contentHash, p.depth]),
  );
});

test("CRL-01 fail-closed: an unverified (invalid AVR report) chain is denied E-UNVERIFIED-CHAIN", () => {
  // AD-0001 terminates at a non-principle ⇒ AVR report is invalid ⇒ CRL-01 must refuse it.
  const { fixture, chain, report } = reportFor("AD-0001");
  assert.equal(report.valid, false);
  const res = resolveApplicableProvisions(fixture.readModel, chain, report);
  assert.equal(res.resolved, false);
  assert.equal(res.denial?.code, "E-UNVERIFIED-CHAIN");
  assert.equal(res.provisions.length, 0);
});

test("CRL-01 fail-closed: a report describing a different subject is denied E-REPORT-SUBJECT-MISMATCH", () => {
  const { gov, readModel } = seededRuntime();
  const capChain = resolveAuthorityChain(readModel, "CAP-01").chain!;
  const metaChain = resolveAuthorityChain(readModel, "PCAMG-META-I").chain!;
  const capReport = verifyAndAudit(gov, readModel, capChain); // valid, but for CAP-01
  const res = resolveApplicableProvisions(readModel, metaChain, capReport); // ...applied to META chain
  assert.equal(res.resolved, false);
  assert.equal(res.denial?.code, "E-REPORT-SUBJECT-MISMATCH");
});

test("CRL-01 fail-closed: an empty chain is denied E-EMPTY-CHAIN before any other check", () => {
  const emptyChain = {
    subject: "X", subjectRegistry: "REG-PRIN", nodes: [], rootIds: [], maxDepth: 0, complete: true,
  } as unknown as ResolvedAuthorityChain;
  const stubReport = { subject: "X", valid: true } as unknown as VerificationReport;
  const { readModel } = seededRuntime();
  const res = resolveApplicableProvisions(readModel, emptyChain, stubReport);
  assert.equal(res.denial?.code, "E-EMPTY-CHAIN");
});

test("CRL-01 non-mutation: resolution appends no governance audit entry and freezes its output", () => {
  const { gov, readModel } = seededRuntime();
  const chain = resolveAuthorityChain(readModel, "CAP-01").chain!;
  const report = verifyAndAudit(gov, readModel, chain);
  const sizeBefore = gov.auditChain.size();
  const headBefore = gov.auditChain.head();
  const res = resolveApplicableProvisions(readModel, chain, report);
  assert.equal(gov.auditChain.size(), sizeBefore, "resolution must not append to the governance chain");
  assert.equal(gov.auditChain.head(), headBefore);
  assert.equal(Object.isFrozen(res.provisions), true);
});
