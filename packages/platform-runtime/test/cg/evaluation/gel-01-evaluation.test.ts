/**
 * CGR-W2-GEL-01 — Governance Evaluation Engine.
 * Categories: Determinism · Structural assessment · Sovereignty ordering · Fail-closed (invalid precedence).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { waveCFixture } from "../wave-c-harness.ts";
import { evaluateGovernance } from "../../../src/control/constitutional-governance/governance-evaluation/evaluation.ts";
import type { PrecedenceResult } from "../../../src/control/constitutional-governance/constitutional-resolution/precedence.ts";

test("GEL-01 evaluation correctness: produces a deterministic governance assessment", () => {
  const { governanceEvaluation } = waveCFixture("CAP-01");
  assert.equal(governanceEvaluation.evaluated, true);
  assert.equal(governanceEvaluation.denial, null);
  assert.notEqual(governanceEvaluation.assessment, null);
  assert.equal(governanceEvaluation.subject, "CAP-01");
});

test("GEL-01 assessment structure: captures provision count, supreme provision, root-anchored, sovereignty-ordered, max depth", () => {
  const { governanceEvaluation } = waveCFixture("CAP-01");
  const { assessment } = governanceEvaluation;
  assert.notEqual(assessment, null);
  assert.ok(assessment!.provisionCount > 0, "provision count must be positive");
  assert.equal(assessment!.supremeProvision, "PCAMG-PRIN-001", "supreme provision is Layer-0 principle root");
  assert.equal(assessment!.rootAnchored, true, "Layer-0 anchored");
  assert.equal(assessment!.sovereigntyOrdered, true, "provisions are sovereignty-ordered");
  assert.ok(assessment!.maxDepth >= 0, "max depth is non-negative");
});

test("GEL-01 sovereignty ordering: confirms provisions are ordered by non-decreasing registry sovereignty rank", () => {
  const { governanceEvaluation, resolution } = waveCFixture("CAP-01");
  assert.equal(governanceEvaluation.assessment!.sovereigntyOrdered, true);
  // Cross-check: the precedence ordering (CRL-02) must be sovereignty-first, which GEL-01 verifies.
  assert.equal(resolution.precedence.ordered[0]!.registry, "REG-PRIN", "most sovereign provision is REG-PRIN");
});

test("GEL-01 determinism: identical precedence yields an identical governance assessment", () => {
  const a = waveCFixture("CAP-01").governanceEvaluation;
  const b = waveCFixture("CAP-01").governanceEvaluation;
  assert.deepEqual(a.assessment, b.assessment);
  assert.equal(a.subject, b.subject);
});

test("GEL-01 immutability: the assessment is frozen", () => {
  const { governanceEvaluation } = waveCFixture("CAP-01");
  assert.equal(Object.isFrozen(governanceEvaluation.assessment), true);
});

test("GEL-01 fail-closed: an undecided precedence is denied E-UNDECIDED-PRECEDENCE", () => {
  const undecidedPrecedence = {
    decided: false,
    subject: null,
    ordered: [],
    supreme: null,
    denial: { code: "E-UNRESOLVED-PROVISIONS", message: "x", detail: {} },
  } as unknown as PrecedenceResult;
  const res = evaluateGovernance(undecidedPrecedence);
  assert.equal(res.evaluated, false);
  assert.equal(res.denial?.code, "E-UNDECIDED-PRECEDENCE");
  assert.equal(res.assessment, null);
});

test("GEL-01 fail-closed: an empty provision ordering is denied E-EMPTY-EVALUATION", () => {
  const emptyPrecedence = {
    decided: true,
    subject: "X",
    ordered: [],
    supreme: { logicalId: "X", registry: "REG-PRIN", recordUuid: "x", contentHash: "x", depth: 0, isRoot: true },
    denial: null,
  } as unknown as PrecedenceResult;
  const res = evaluateGovernance(emptyPrecedence);
  assert.equal(res.evaluated, false);
  assert.equal(res.denial?.code, "E-EMPTY-EVALUATION");
});

test("GEL-01 non-mutation: evaluateGovernance performs zero writes and originates no authority", () => {
  const { resolution } = waveCFixture("CAP-01");
  const before = JSON.stringify(resolution.precedence);
  evaluateGovernance(resolution.precedence);
  const after = JSON.stringify(resolution.precedence);
  assert.equal(before, after, "input precedence is unchanged");
});
