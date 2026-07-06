/**
 * CGR-W2-EEL-01 — Eligibility Assessment.
 * Categories: Determinism · Verdict correctness · Semantic firewall (R-1/R-3) · Fail-closed · Non-mutation.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { waveDFixture, nonEligibleUpstream, mismatchedUpstream } from "../wave-d-harness.ts";
import { waveCFixture } from "../wave-c-harness.ts";
import { assessEligibility } from "../../../src/control/constitutional-governance/execution-eligibility/eligibility.ts";
import type { GovernanceEvaluation } from "../../../src/control/constitutional-governance/governance-evaluation/evaluation.ts";
import type { ComplianceEvaluation } from "../../../src/control/constitutional-governance/governance-evaluation/compliance.ts";

test("EEL-01 correctness: produces a deterministic eligibility verdict for a well-formed upstream", () => {
  const { eligibility } = waveDFixture("CAP-01");
  assert.equal(eligibility.assessed, true);
  assert.equal(eligibility.denial, null);
  assert.notEqual(eligibility.verdict, null);
  assert.equal(eligibility.subject, "CAP-01");
});

test("EEL-01 verdict structure: captures decision, subject, constraints, unmet", () => {
  const { eligibility } = waveDFixture("CAP-01");
  const { verdict } = eligibility;
  assert.notEqual(verdict, null);
  assert.ok(verdict!.decision === "ELIGIBLE" || verdict!.decision === "NOT_ELIGIBLE");
  assert.equal(verdict!.subject, "CAP-01");
  assert.ok(Array.isArray(verdict!.constraints));
  assert.ok(Array.isArray(verdict!.unmet));
});

test("EEL-01 ELIGIBLE: a compliant, root-anchored, ordered proposal MAY advance", () => {
  const { eligibility } = waveDFixture("CAP-01");
  assert.equal(eligibility.verdict!.decision, "ELIGIBLE", "compliant proposal is eligible to advance");
  assert.equal(eligibility.verdict!.unmet.length, 0, "no unmet constraints");
});

test("EEL-01 NOT_ELIGIBLE: a non-compliant proposal MAY NOT advance and reports unmet constraints", () => {
  const { governance, compliance } = nonEligibleUpstream("TEST-NON-ROOT");
  const res = assessEligibility(governance, compliance);
  assert.equal(res.assessed, true, "verdict produced (not a denial) for a well-formed but failing upstream");
  assert.equal(res.verdict!.decision, "NOT_ELIGIBLE", "non-compliant proposal is not eligible");
  assert.ok(res.verdict!.unmet.length > 0, "unmet constraints reported");
  assert.ok(res.verdict!.unmet.includes("C-CONSTITUTIONALLY-COMPLIANT"));
});

test("EEL-01 R-1/R-3 semantic firewall: the verdict carries NO execution/activation/authority field", () => {
  const { eligibility } = waveDFixture("CAP-01");
  const keys = Object.keys(eligibility.verdict!).sort();
  // The verdict surface is EXACTLY {constraints, decision, subject, unmet} — nothing that could be
  // read as permission-to-execute, activation, or authority.
  assert.deepEqual(keys, ["constraints", "decision", "subject", "unmet"]);
  const forbidden = ["execute", "execution", "activate", "activation", "authority", "authorize", "sovereign", "active"];
  for (const k of keys) {
    assert.ok(!forbidden.includes(k.toLowerCase()), `verdict must not expose '${k}'`);
  }
  // ELIGIBLE is only ever "MAY advance": the decision domain is exactly the two admissibility literals.
  assert.ok(["ELIGIBLE", "NOT_ELIGIBLE"].includes(eligibility.verdict!.decision));
});

test("EEL-01 determinism: identical upstream yields an identical verdict", () => {
  const a = waveDFixture("CAP-01").eligibility;
  const b = waveDFixture("CAP-01").eligibility;
  assert.deepEqual(a.verdict, b.verdict);
  assert.equal(a.subject, b.subject);
});

test("EEL-01 immutability: the verdict and its unmet list are frozen", () => {
  const { eligibility } = waveDFixture("CAP-01");
  assert.equal(Object.isFrozen(eligibility.verdict), true, "verdict frozen");
  assert.equal(Object.isFrozen(eligibility.verdict!.unmet), true, "unmet list frozen");
});

test("EEL-01 fail-closed: an unevaluated governance state is denied (no verdict)", () => {
  const unevaluated = {
    evaluated: false,
    subject: null,
    assessment: null,
    denial: { code: "E-UNDECIDED-PRECEDENCE", message: "x", detail: {} },
  } as unknown as GovernanceEvaluation;
  const { complianceEvaluation } = waveCFixture("CAP-01");
  const res = assessEligibility(unevaluated, complianceEvaluation);
  assert.equal(res.assessed, false, "no verdict produced for unformed upstream");
  assert.equal(res.verdict, null, "fail-closed: never eligible-by-default");
  assert.equal(res.denial?.code, "E-UNEVALUATED-GOVERNANCE");
});

test("EEL-01 fail-closed: a subject mismatch is denied (no verdict)", () => {
  const { governance, compliance } = mismatchedUpstream("CAP-AAA", "CAP-BBB");
  const res = assessEligibility(governance, compliance);
  assert.equal(res.assessed, false);
  assert.equal(res.verdict, null);
  assert.equal(res.denial?.code, "E-ELIGIBILITY-SUBJECT-MISMATCH");
});

test("EEL-01 non-mutation: eligibility assessment performs zero writes and originates no authority", () => {
  const { governanceEvaluation, complianceEvaluation } = waveCFixture("CAP-01");
  const before = JSON.stringify({ g: governanceEvaluation, c: complianceEvaluation });
  assessEligibility(governanceEvaluation, complianceEvaluation);
  const after = JSON.stringify({ g: governanceEvaluation, c: complianceEvaluation });
  assert.equal(before, after, "inputs are unchanged");
});
