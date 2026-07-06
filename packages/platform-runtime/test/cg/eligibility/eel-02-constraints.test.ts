/**
 * CGR-W2-EEL-02 — Eligibility Constraint Evaluation.
 * Categories: Determinism · Constraint correctness · Fail-closed (unformed upstream) · Non-mutation.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { waveDFixture, nonEligibleUpstream, mismatchedUpstream } from "../wave-d-harness.ts";
import { evaluateEligibilityConstraints } from "../../../src/control/constitutional-governance/execution-eligibility/constraints.ts";
import { waveCFixture } from "../wave-c-harness.ts";
import type { GovernanceEvaluation } from "../../../src/control/constitutional-governance/governance-evaluation/evaluation.ts";
import type { ComplianceEvaluation } from "../../../src/control/constitutional-governance/governance-evaluation/compliance.ts";

test("EEL-02 correctness: produces a deterministic constraint evaluation for a well-formed upstream", () => {
  const { constraintEvaluation } = waveDFixture("CAP-01");
  assert.equal(constraintEvaluation.evaluated, true);
  assert.equal(constraintEvaluation.denial, null);
  assert.equal(constraintEvaluation.subject, "CAP-01");
  assert.equal(constraintEvaluation.constraints.length, 3, "three eligibility constraints evaluated");
});

test("EEL-02 constraint set: evaluates compliance, root-anchoring, and sovereignty-ordering", () => {
  const { constraintEvaluation } = waveDFixture("CAP-01");
  const ids = constraintEvaluation.constraints.map((c) => c.constraint).sort();
  assert.deepEqual(ids, [
    "C-CONSTITUTIONALLY-COMPLIANT",
    "C-SOVEREIGNTY-ORDERED",
    "C-SOVEREIGNTY-ROOT-ANCHORED",
  ]);
});

test("EEL-02 all-satisfied: a compliant, root-anchored, ordered upstream satisfies every constraint", () => {
  const { constraintEvaluation } = waveDFixture("CAP-01");
  assert.equal(constraintEvaluation.allSatisfied, true, "all constraints satisfied");
  assert.ok(constraintEvaluation.constraints.every((c) => c.satisfied), "each constraint satisfied");
});

test("EEL-02 unsatisfied: a non-root-anchored upstream fails compliance and root-anchoring constraints", () => {
  const { governance, compliance } = nonEligibleUpstream("TEST-NON-ROOT");
  const res = evaluateEligibilityConstraints(governance, compliance);
  assert.equal(res.evaluated, true, "upstream is well-formed (just failing)");
  assert.equal(res.allSatisfied, false, "not all constraints satisfied");
  const unmet = res.constraints.filter((c) => !c.satisfied).map((c) => c.constraint);
  assert.ok(unmet.includes("C-CONSTITUTIONALLY-COMPLIANT"), "compliance constraint unmet");
  assert.ok(unmet.includes("C-SOVEREIGNTY-ROOT-ANCHORED"), "root-anchoring constraint unmet");
});

test("EEL-02 determinism: identical upstream yields an identical constraint evaluation", () => {
  const a = waveDFixture("CAP-01").constraintEvaluation;
  const b = waveDFixture("CAP-01").constraintEvaluation;
  assert.deepEqual(a.constraints, b.constraints);
  assert.equal(a.allSatisfied, b.allSatisfied);
  assert.equal(a.subject, b.subject);
});

test("EEL-02 immutability: the constraint list and each result are frozen", () => {
  const { constraintEvaluation } = waveDFixture("CAP-01");
  assert.equal(Object.isFrozen(constraintEvaluation.constraints), true, "constraint list frozen");
  assert.equal(Object.isFrozen(constraintEvaluation.constraints[0]), true, "constraint result frozen");
});

test("EEL-02 fail-closed: an unevaluated governance state is denied E-UNEVALUATED-GOVERNANCE", () => {
  const unevaluated = {
    evaluated: false,
    subject: null,
    assessment: null,
    denial: { code: "E-UNDECIDED-PRECEDENCE", message: "x", detail: {} },
  } as unknown as GovernanceEvaluation;
  const { complianceEvaluation } = waveCFixture("CAP-01");
  const res = evaluateEligibilityConstraints(unevaluated, complianceEvaluation);
  assert.equal(res.evaluated, false);
  assert.equal(res.denial?.code, "E-UNEVALUATED-GOVERNANCE");
  assert.equal(res.allSatisfied, false, "fail-closed: never eligible-by-default");
  assert.equal(res.constraints.length, 0);
});

test("EEL-02 fail-closed: an unassessed compliance state is denied E-UNASSESSED-COMPLIANCE", () => {
  const { governanceEvaluation } = waveCFixture("CAP-01");
  const unassessed = {
    evaluated: false,
    subject: null,
    finding: null,
    denial: { code: "E-UNVERIFIED-EVALUATION", message: "x", detail: {} },
  } as unknown as ComplianceEvaluation;
  const res = evaluateEligibilityConstraints(governanceEvaluation, unassessed);
  assert.equal(res.evaluated, false);
  assert.equal(res.denial?.code, "E-UNASSESSED-COMPLIANCE");
  assert.equal(res.allSatisfied, false);
});

test("EEL-02 fail-closed: a subject mismatch is denied E-ELIGIBILITY-SUBJECT-MISMATCH", () => {
  const { governance, compliance } = mismatchedUpstream("CAP-AAA", "CAP-BBB");
  const res = evaluateEligibilityConstraints(governance, compliance);
  assert.equal(res.evaluated, false);
  assert.equal(res.denial?.code, "E-ELIGIBILITY-SUBJECT-MISMATCH");
  assert.equal(res.allSatisfied, false);
});

test("EEL-02 non-mutation: constraint evaluation performs zero writes on its inputs", () => {
  const { governanceEvaluation, complianceEvaluation } = waveCFixture("CAP-01");
  const before = JSON.stringify({ g: governanceEvaluation, c: complianceEvaluation });
  evaluateEligibilityConstraints(governanceEvaluation, complianceEvaluation);
  const after = JSON.stringify({ g: governanceEvaluation, c: complianceEvaluation });
  assert.equal(before, after, "inputs are unchanged");
});
