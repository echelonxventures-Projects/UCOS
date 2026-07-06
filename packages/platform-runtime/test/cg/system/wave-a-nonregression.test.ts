/**
 * Wave-A system / non-regression verification (PCAMG-RUNTIME-0102A).
 * Categories: Non-regression · Append-only · Audit continuity · Dependency validation · Fail-closed.
 *
 * Proves the Wave-A runtimes are reachable through the extended cg barrel and (transitively) the
 * platform control surface, that the doctrine namespace guard still holds, that no ACTIVE status is
 * reachable through the authority path, and that Wave-A originated no governance state.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as cg from "../../../src/control/constitutional-governance/index.ts";
import * as control from "../../../src/control/index.ts";
import { seededRuntime } from "../wave-a-harness.ts";

test("WAVE-A BARREL: authority + verification runtimes are reachable through cg/index.ts (namespaced)", () => {
  assert.equal(typeof cg.authorityRuntime.createAuthorityReadModel, "function");
  assert.equal(typeof cg.authorityRuntime.resolveAuthorityChain, "function");
  assert.equal(typeof cg.authorityRuntime.orderBySupremacy, "function");
  assert.equal(typeof cg.authorityVerification.verifyChainIntegrity, "function");
  assert.equal(typeof cg.authorityVerification.verifyAcyclicUpTrace, "function");
  assert.equal(typeof cg.authorityVerification.verifyAndAudit, "function");
});

test("WAVE-A BARREL: the Wave-1 surface is preserved (no export removed)", () => {
  // Spot-check that the additive extension did not drop any Wave-1 export the baseline relies on.
  assert.equal(typeof cg.composeConstitutionalGovernance, "function");
  assert.equal(typeof cg.verifyChain, "function"); // Wave-1 audit verifier — not shadowed
  assert.equal(typeof cg.AuditHashChain, "function");
  assert.ok(Array.isArray(cg.REGISTRY_NAMES) && cg.REGISTRY_NAMES.length === 11);
});

test("WAVE-A CONTROL: runtimes are reachable via control.constitutionalGovernance; no new top-level namespace", () => {
  assert.equal(typeof control.constitutionalGovernance.authorityRuntime.resolveAuthorityChain, "function");
  const keys = Object.keys(control as Record<string, unknown>);
  for (const forbidden of ["governanceRuntime", "governance_runtime", "authorityRuntime", "authorityVerification"]) {
    assert.ok(!keys.includes(forbidden), `forbidden top-level control namespace present: ${forbidden}`);
  }
  assert.ok(keys.includes("constitutionalGovernance"));
});

test("WAVE-A ACTIVATION-IMPOSSIBLE: no node or report reachable through the authority path is ACTIVE", () => {
  const { gov, readModel, subjects } = seededRuntime();
  for (const subject of Object.values(subjects)) {
    const res = cg.authorityRuntime.resolveAuthorityChain(readModel, subject);
    if (!res.resolved) continue;
    for (const node of res.chain!.nodes) {
      const ref = readModel.lookup(node.logicalId)!;
      assert.notEqual(ref.record.status as string, "active");
      assert.ok(ref.record.status === "proposed" || ref.record.status === "superseded");
    }
    const report = cg.authorityVerification.verifyAndAudit(gov, readModel, res.chain!);
    assert.ok(!("active" in (report as unknown as Record<string, unknown>)));
  }
});

test("WAVE-A NON-REGRESSION: the Wave-1 composition still starts fail-closed (originates nothing)", () => {
  const { gov } = seededRuntime();
  // Re-composing must succeed and produce a genesis-startable runtime (asserted inside compose()).
  const fresh = cg.composeConstitutionalGovernance({ clock: cg.fixedClock() });
  for (const name of cg.REGISTRY_NAMES) {
    assert.equal(fresh.registry(name).size(), 0, `${name} must be empty at composition`);
  }
  // The seeded runtime's audit chain is intact end-to-end (audit continuity preserved).
  assert.equal(cg.verifyChain(gov.auditChain.entries()).valid, true);
  assert.equal(cg.verifyReplay(gov.auditChain.entries()).valid, true);
});
