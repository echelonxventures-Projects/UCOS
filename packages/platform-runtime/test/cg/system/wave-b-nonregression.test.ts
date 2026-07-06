/**
 * Wave-B system / non-regression verification (PCAMG-RUNTIME-0107A).
 * Categories: Non-regression · Append-only · Audit continuity · Dependency validation · Fail-closed.
 *
 * Proves the Constitutional Resolution Layer is reachable through the extended cg barrel and
 * (transitively) the platform control surface, that no new top-level control namespace appears,
 * that the Wave-1 + Wave-A surfaces are preserved, that no ACTIVE state is reachable through the
 * resolution path, and — critically — that running a full resolution appends NOTHING to the
 * governance audit chain (the closed Wave-1 audit schema stays intact).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as cg from "../../../src/control/constitutional-governance/index.ts";
import * as control from "../../../src/control/index.ts";
import { resolutionFixture } from "../wave-b-harness.ts";

test("WAVE-B BARREL: the resolution layer is reachable through cg/index.ts (namespaced)", () => {
  assert.equal(typeof cg.constitutionalResolution.resolveApplicableProvisions, "function");
  assert.equal(typeof cg.constitutionalResolution.resolvePrecedence, "function");
  assert.equal(typeof cg.constitutionalResolution.ResolutionAuditEmitter, "function");
  assert.equal(typeof cg.constitutionalResolution.verifyResolutionAudit, "function");
  assert.equal(typeof cg.constitutionalResolution.verifyResolutionReplay, "function");
});

test("WAVE-B BARREL: the Wave-1 + Wave-A surfaces are preserved (no export removed or shadowed)", () => {
  assert.equal(typeof cg.composeConstitutionalGovernance, "function"); // Wave-1
  assert.equal(typeof cg.verifyChain, "function"); // Wave-1 audit verifier — not shadowed by CRL verifiers
  assert.equal(typeof cg.authorityRuntime.resolveAuthorityChain, "function"); // Wave-A
  assert.equal(typeof cg.authorityVerification.verifyAndAudit, "function"); // Wave-A
  assert.ok(Array.isArray(cg.REGISTRY_NAMES) && cg.REGISTRY_NAMES.length === 11);
});

test("WAVE-B CONTROL: reachable via control.constitutionalGovernance; no new top-level namespace", () => {
  assert.equal(
    typeof control.constitutionalGovernance.constitutionalResolution.resolvePrecedence,
    "function",
  );
  const keys = Object.keys(control as Record<string, unknown>);
  for (const forbidden of ["governanceRuntime", "governance_runtime", "constitutionalResolution", "resolutionRuntime"]) {
    assert.ok(!keys.includes(forbidden), `forbidden top-level control namespace present: ${forbidden}`);
  }
  assert.ok(keys.includes("constitutionalGovernance"));
});

test("WAVE-B ACTIVATION-IMPOSSIBLE: no resolved provision reachable through the resolution path is ACTIVE", () => {
  const { readModel, precedence } = resolutionFixture("CAP-01");
  assert.equal(precedence.decided, true);
  for (const provision of precedence.ordered) {
    const ref = readModel.lookup(provision.logicalId)!;
    assert.notEqual(ref.record.status as string, "active");
    assert.ok(ref.record.status === "proposed" || ref.record.status === "superseded");
  }
});

test("WAVE-B APPEND-ONLY: a full resolution + audit emission never mutates the governance chain", () => {
  const { gov, precedence } = resolutionFixture("CAP-01");
  const sizeBefore = gov.auditChain.size();
  const headBefore = gov.auditChain.head();
  const emitter = new cg.constitutionalResolution.ResolutionAuditEmitter();
  emitter.emit(gov, precedence);
  // governance audit chain is untouched; its own continuity + replay still hold (Wave-1 verifier).
  assert.equal(gov.auditChain.size(), sizeBefore);
  assert.equal(gov.auditChain.head(), headBefore);
  assert.equal(cg.verifyChain(gov.auditChain.entries()).valid, true);
  assert.equal(cg.verifyReplay(gov.auditChain.entries()).valid, true);
});
