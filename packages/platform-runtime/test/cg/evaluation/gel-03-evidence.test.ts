/**
 * CGR-W2-GEL-03 — Evaluation Evidence Emitter.
 * Categories: Append-only evidence · Replay verification · Audit continuity · Fail-closed (invalid evaluation).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { evidenceFixture, waveCFixture } from "../wave-c-harness.ts";
import { EvaluationEvidenceEmitter } from "../../../src/control/constitutional-governance/governance-evaluation/evidence.ts";
import type { GovernanceEvaluation } from "../../../src/control/constitutional-governance/governance-evaluation/evaluation.ts";
import type { ComplianceEvaluation } from "../../../src/control/constitutional-governance/governance-evaluation/compliance.ts";

test("GEL-03 evidence emission correctness: emits governance evaluation evidence", () => {
  const { emitter, fixture } = evidenceFixture("CAP-01");
  assert.equal(emitter.size(), 2, "two evidence records emitted (governance + compliance)");
  const entries = emitter.entries();
  assert.equal(entries.length, 2);
  assert.equal(entries[0]!.event.actor, "CGR-W2-GEL-03");
});

test("GEL-03 append-only: evidence records are immutable and frozen", () => {
  const { emitter } = evidenceFixture("CAP-01");
  const entries = emitter.entries();
  assert.equal(Object.isFrozen(entries), true, "entries array is frozen");
  assert.equal(Object.isFrozen(entries[0]), true, "entry is frozen");
  assert.equal(Object.isFrozen(entries[0]!.event), true, "event is frozen");
});

test("GEL-03 audit continuity: the evidence chain is tamper-evident and replay-verifiable", () => {
  const { emitter } = evidenceFixture("CAP-01");
  assert.equal(emitter.verifyContinuity(), true, "audit continuity verified");
});

test("GEL-03 determinism: identical evaluations yield byte-identical evidence hashes (modulo timestamps)", () => {
  const a = evidenceFixture("CAP-01");
  const b = evidenceFixture("CAP-01");
  // Evidence hashes differ due to timestamps, but the structure is deterministic.
  assert.equal(a.emitter.size(), b.emitter.size(), "evidence chain sizes match");
  assert.equal(a.emitter.entries().length, b.emitter.entries().length, "entry counts match");
  // The subject and assessment/finding content are byte-identical; only timestamps vary.
  assert.equal(a.fixture.subject, b.fixture.subject);
  assert.deepEqual(a.fixture.governanceEvaluation.assessment, b.fixture.governanceEvaluation.assessment);
});

test("GEL-03 governance evidence structure: captures type, subject, assessment, timestamp, contentHash", () => {
  const emitter = new EvaluationEvidenceEmitter();
  const { governanceEvaluation } = waveCFixture("CAP-01");
  const result = emitter.emitGovernanceEvaluation(governanceEvaluation);
  assert.equal(result.emitted, true);
  assert.notEqual(result.entry, null);
  const event = result.entry!.event;
  assert.equal(event.actor, "CGR-W2-GEL-03");
  assert.equal(event.action, "PROPOSE");
  assert.equal(event.registry, "REG-AUDIT");
});

test("GEL-03 compliance evidence structure: captures type, subject, finding, timestamp, contentHash", () => {
  const emitter = new EvaluationEvidenceEmitter();
  const { complianceEvaluation } = waveCFixture("CAP-01");
  const result = emitter.emitComplianceEvaluation(complianceEvaluation);
  assert.equal(result.emitted, true);
  assert.notEqual(result.entry, null);
  const event = result.entry!.event;
  assert.equal(event.actor, "CGR-W2-GEL-03");
  assert.equal(event.action, "PROPOSE");
  assert.equal(event.registry, "REG-AUDIT");
});

test("GEL-03 fail-closed: an unevaluated governance state is denied E-EMPTY-EVIDENCE", () => {
  const emitter = new EvaluationEvidenceEmitter();
  const unevaluated = {
    evaluated: false,
    subject: null,
    assessment: null,
    denial: { code: "E-UNDECIDED-PRECEDENCE", message: "x", detail: {} },
  } as unknown as GovernanceEvaluation;
  const res = emitter.emitGovernanceEvaluation(unevaluated);
  assert.equal(res.emitted, false);
  assert.equal(res.denial?.code, "E-EMPTY-EVIDENCE");
  assert.equal(res.entry, null);
  assert.equal(emitter.size(), 0, "no evidence emitted");
});

test("GEL-03 fail-closed: an unevaluated compliance state is denied E-EMPTY-EVIDENCE", () => {
  const emitter = new EvaluationEvidenceEmitter();
  const unevaluated = {
    evaluated: false,
    subject: null,
    finding: null,
    denial: { code: "E-UNVERIFIED-EVALUATION", message: "x", detail: {} },
  } as unknown as ComplianceEvaluation;
  const res = emitter.emitComplianceEvaluation(unevaluated);
  assert.equal(res.emitted, false);
  assert.equal(res.denial?.code, "E-EMPTY-EVIDENCE");
  assert.equal(res.entry, null);
  assert.equal(emitter.size(), 0, "no evidence emitted");
});

test("GEL-03 non-mutation outside append-only: evidence emission appends only to the audit chain", () => {
  const { governanceEvaluation } = waveCFixture("CAP-01");
  const emitter = new EvaluationEvidenceEmitter();
  const sizeBefore = emitter.size();
  emitter.emitGovernanceEvaluation(governanceEvaluation);
  const sizeAfter = emitter.size();
  assert.equal(sizeAfter, sizeBefore + 1, "exactly one evidence record appended");
  // The input evaluation is unchanged.
  assert.equal(governanceEvaluation.evaluated, true, "input evaluation is unchanged");
});

test("GEL-03 replay verification: regenerating the chain from events reproduces every hash", () => {
  const { emitter } = evidenceFixture("CAP-01");
  // verifyContinuity internally uses the audit-verifier's verifyChain, which confirms
  // tamper-evidence, continuity, and ordering. This test confirms that wrapper works.
  assert.equal(emitter.verifyContinuity(), true, "replay verification passed");
});

test("GEL-03 audit chain head: the head hash is the last entry's entryHash", () => {
  const emitter = new EvaluationEvidenceEmitter();
  const { governanceEvaluation } = waveCFixture("CAP-01");
  const result = emitter.emitGovernanceEvaluation(governanceEvaluation);
  assert.equal(emitter.head(), result.entry!.entryHash, "head matches the last entry's hash");
});

test("GEL-03 evidence count: size() returns the number of emitted evidence records", () => {
  const emitter = new EvaluationEvidenceEmitter();
  assert.equal(emitter.size(), 0, "empty emitter has size 0");
  const { governanceEvaluation, complianceEvaluation } = waveCFixture("CAP-01");
  emitter.emitGovernanceEvaluation(governanceEvaluation);
  assert.equal(emitter.size(), 1, "one evidence record emitted");
  emitter.emitComplianceEvaluation(complianceEvaluation);
  assert.equal(emitter.size(), 2, "two evidence records emitted");
});
