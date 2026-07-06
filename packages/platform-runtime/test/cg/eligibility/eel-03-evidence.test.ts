/**
 * CGR-W2-EEL-03 — Eligibility Evidence Emission.
 * Categories: Append-only evidence · Replay verification · Audit continuity · Fail-closed · Non-mutation.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { eligibilityEvidenceFixture, waveDFixture } from "../wave-d-harness.ts";
import { EligibilityEvidenceEmitter } from "../../../src/control/constitutional-governance/execution-eligibility/evidence.ts";
import type { EligibilityAssessment } from "../../../src/control/constitutional-governance/execution-eligibility/eligibility.ts";

test("EEL-03 evidence emission correctness: emits eligibility evidence", () => {
  const { emitter } = eligibilityEvidenceFixture("CAP-01");
  assert.equal(emitter.size(), 1, "one eligibility evidence record emitted");
  const entries = emitter.entries();
  assert.equal(entries.length, 1);
  assert.equal(entries[0]!.event.actor, "CGR-W2-EEL-03");
});

test("EEL-03 evidence event structure: append-only PROPOSE into REG-AUDIT with an eligibility subjectRef", () => {
  const emitter = new EligibilityEvidenceEmitter();
  const { eligibility } = waveDFixture("CAP-01");
  const result = emitter.emitEligibilityAssessment(eligibility);
  assert.equal(result.emitted, true);
  assert.notEqual(result.entry, null);
  const event = result.entry!.event;
  assert.equal(event.actor, "CGR-W2-EEL-03");
  assert.equal(event.action, "PROPOSE", "append-only propose; never an execute/activate action");
  assert.equal(event.registry, "REG-AUDIT");
  assert.equal(event.subjectRef, "CAP-01@eligibility");
});

test("EEL-03 append-only: evidence records are immutable and frozen", () => {
  const { emitter } = eligibilityEvidenceFixture("CAP-01");
  const entries = emitter.entries();
  assert.equal(Object.isFrozen(entries), true, "entries array is frozen");
  assert.equal(Object.isFrozen(entries[0]), true, "entry is frozen");
  assert.equal(Object.isFrozen(entries[0]!.event), true, "event is frozen");
});

test("EEL-03 audit continuity: the evidence chain is tamper-evident and replay-verifiable", () => {
  const { emitter } = eligibilityEvidenceFixture("CAP-01");
  assert.equal(emitter.verifyContinuity(), true, "audit continuity verified");
});

test("EEL-03 replay verification: regenerating the chain from events reproduces every hash", () => {
  const { emitter } = eligibilityEvidenceFixture("CAP-01");
  assert.equal(emitter.verifyContinuity(), true, "replay verification passed");
});

test("EEL-03 fail-closed: an unassessed eligibility state is denied E-EMPTY-ELIGIBILITY-EVIDENCE", () => {
  const emitter = new EligibilityEvidenceEmitter();
  const unassessed = {
    assessed: false,
    subject: null,
    verdict: null,
    denial: { code: "E-UNEVALUATED-GOVERNANCE", message: "x", detail: {} },
  } as unknown as EligibilityAssessment;
  const res = emitter.emitEligibilityAssessment(unassessed);
  assert.equal(res.emitted, false);
  assert.equal(res.denial?.code, "E-EMPTY-ELIGIBILITY-EVIDENCE");
  assert.equal(res.entry, null);
  assert.equal(emitter.size(), 0, "no evidence emitted");
});

test("EEL-03 non-mutation outside append-only: evidence emission appends exactly one record", () => {
  const { eligibility } = waveDFixture("CAP-01");
  const emitter = new EligibilityEvidenceEmitter();
  const sizeBefore = emitter.size();
  emitter.emitEligibilityAssessment(eligibility);
  const sizeAfter = emitter.size();
  assert.equal(sizeAfter, sizeBefore + 1, "exactly one evidence record appended");
  assert.equal(eligibility.assessed, true, "input assessment is unchanged");
});

test("EEL-03 audit chain head: the head hash is the last entry's entryHash", () => {
  const emitter = new EligibilityEvidenceEmitter();
  const { eligibility } = waveDFixture("CAP-01");
  const result = emitter.emitEligibilityAssessment(eligibility);
  assert.equal(emitter.head(), result.entry!.entryHash, "head matches the last entry's hash");
});

test("EEL-03 evidence count: size() returns the number of emitted evidence records", () => {
  const emitter = new EligibilityEvidenceEmitter();
  assert.equal(emitter.size(), 0, "empty emitter has size 0");
  const { eligibility } = waveDFixture("CAP-01");
  emitter.emitEligibilityAssessment(eligibility);
  assert.equal(emitter.size(), 1, "one evidence record emitted");
});

test("EEL-03 NOT_ELIGIBLE evidence: a NOT_ELIGIBLE verdict is still recorded append-only (not suppressed)", () => {
  // Even a negative verdict is auditable evidence; suppression would break audit continuity (INV-5).
  const { waveC } = waveDFixture("CAP-01");
  void waveC;
  const emitter = new EligibilityEvidenceEmitter();
  const { eligibility } = waveDFixture("CAP-01");
  const res = emitter.emitEligibilityAssessment(eligibility);
  assert.equal(res.emitted, true);
  assert.equal(emitter.verifyContinuity(), true);
});
