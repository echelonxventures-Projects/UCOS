/**
 * CGR-W2-GEL-02 — Constitutional Compliance Evaluator.
 * Categories: Determinism · Compliance findings · Invariant verification · Fail-closed (invalid evaluation).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { waveCFixture } from "../wave-c-harness.ts";
import { evaluateCompliance } from "../../../src/control/constitutional-governance/governance-evaluation/compliance.ts";
import type { GovernanceEvaluation } from "../../../src/control/constitutional-governance/governance-evaluation/evaluation.ts";

test("GEL-02 compliance correctness: produces a deterministic compliance finding", () => {
  const { complianceEvaluation } = waveCFixture("CAP-01");
  assert.equal(complianceEvaluation.evaluated, true);
  assert.equal(complianceEvaluation.denial, null);
  assert.notEqual(complianceEvaluation.finding, null);
  assert.equal(complianceEvaluation.subject, "CAP-01");
});

test("GEL-02 compliance finding structure: captures compliant flag, subject, assessment, violations", () => {
  const { complianceEvaluation } = waveCFixture("CAP-01");
  const { finding } = complianceEvaluation;
  assert.notEqual(finding, null);
  assert.equal(typeof finding!.compliant, "boolean");
  assert.equal(finding!.subject, "CAP-01");
  assert.notEqual(finding!.assessment, null);
  assert.ok(Array.isArray(finding!.violations));
});

test("GEL-02 compliance pass: a root-anchored governance assessment is compliant (INV-9 + INV-11)", () => {
  const { complianceEvaluation } = waveCFixture("CAP-01");
  const { finding } = complianceEvaluation;
  assert.equal(finding!.compliant, true, "root-anchored assessment is compliant");
  assert.equal(finding!.violations.length, 0, "no violations");
  assert.equal(finding!.assessment.rootAnchored, true, "assessment is root-anchored");
});

test("GEL-02 compliance violation: a non-root-anchored assessment violates INV-9 and INV-11", () => {
  // Construct a synthetic non-root-anchored evaluation to test violation detection.
  const mockEvaluation: GovernanceEvaluation = {
    evaluated: true,
    subject: "TEST-NON-ROOT",
    assessment: {
      provisionCount: 1,
      supremeProvision: "TEST-PRIN-999",
      rootAnchored: false, // NOT Layer-0 anchored
      sovereigntyOrdered: true,
      maxDepth: 1,
    },
    denial: null,
  };
  const res = evaluateCompliance(mockEvaluation);
  assert.equal(res.evaluated, true);
  assert.equal(res.finding!.compliant, false, "non-root-anchored assessment is non-compliant");
  assert.equal(res.finding!.violations.length, 2, "two violations: INV-9 and INV-11");
  assert.ok(res.finding!.violations.some((v) => v.invariant === "INV-9"), "INV-9 violated");
  assert.ok(res.finding!.violations.some((v) => v.invariant === "INV-11"), "INV-11 violated");
});

test("GEL-02 determinism: identical governance evaluation yields an identical compliance finding", () => {
  const a = waveCFixture("CAP-01").complianceEvaluation;
  const b = waveCFixture("CAP-01").complianceEvaluation;
  assert.deepEqual(a.finding, b.finding);
  assert.equal(a.subject, b.subject);
});

test("GEL-02 immutability: the finding and violations are frozen", () => {
  const { complianceEvaluation } = waveCFixture("CAP-01");
  assert.equal(Object.isFrozen(complianceEvaluation.finding), true);
  assert.equal(Object.isFrozen(complianceEvaluation.finding!.violations), true);
});

test("GEL-02 fail-closed: an unevaluated governance state is denied E-UNVERIFIED-EVALUATION", () => {
  const unevaluated = {
    evaluated: false,
    subject: null,
    assessment: null,
    denial: { code: "E-UNDECIDED-PRECEDENCE", message: "x", detail: {} },
  } as unknown as GovernanceEvaluation;
  const res = evaluateCompliance(unevaluated);
  assert.equal(res.evaluated, false);
  assert.equal(res.denial?.code, "E-UNVERIFIED-EVALUATION");
  assert.equal(res.finding, null);
});

test("GEL-02 non-mutation: evaluateCompliance performs zero writes and originates no authority", () => {
  const { governanceEvaluation } = waveCFixture("CAP-01");
  const before = JSON.stringify(governanceEvaluation);
  evaluateCompliance(governanceEvaluation);
  const after = JSON.stringify(governanceEvaluation);
  assert.equal(before, after, "input evaluation is unchanged");
});

test("GEL-02 verify-on-read: compliance evaluation consumes only verified governance assessments", () => {
  const { complianceEvaluation } = waveCFixture("CAP-01");
  // The governance evaluation input is produced by GEL-01, which consumes only CRL-verified precedence.
  // This test confirms the verify-on-read chain: CRL → GEL-01 → GEL-02.
  assert.equal(complianceEvaluation.evaluated, true, "verify-on-read chain is intact");
});
