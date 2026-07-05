/**
 * Control export verification — public surface of the platform control barrel.
 * Proves: constitutional-governance is exposed through control/index.ts under a single namespace;
 * the namespace is functional end-to-end; and NO `governance-runtime` namespace exists (doctrine:
 * the runtime namespace must remain absent).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as control from "../../../src/control/index.ts";

test("CONTROL-EXPORT: constitutionalGovernance namespace is present on the control surface", () => {
  const ns = (control as Record<string, unknown>)["constitutionalGovernance"];
  assert.ok(ns && typeof ns === "object", "constitutionalGovernance namespace must be exported");
});

test("CONTROL-EXPORT: the namespace exposes the composition root + audit primitives", () => {
  const ns = control.constitutionalGovernance;
  assert.equal(typeof ns.composeConstitutionalGovernance, "function");
  assert.equal(typeof ns.AuditHashChain, "function");
  assert.equal(typeof ns.verifyChain, "function");
  assert.equal(typeof ns.ConstitutionalRegistry, "function");
  assert.ok(Array.isArray(ns.REGISTRY_NAMES) && ns.REGISTRY_NAMES.length === 11);
});

test("CONTROL-EXPORT: the exposed runtime composes and verifies through the control surface", () => {
  const gov = control.constitutionalGovernance.composeConstitutionalGovernance({
    clock: control.constitutionalGovernance.fixedClock(),
  });
  gov.principles.propose({
    logicalId: "PCAMG-PRIN-001",
    version: "1.0.0",
    ownerAuthority: "board",
    content: { statement: "P1" },
    createdBy: "board",
  });
  assert.equal(gov.auditChain.size(), 1);
  assert.equal(control.constitutionalGovernance.verifyChain(gov.auditChain.entries()).valid, true);
});

test("CONTROL-EXPORT: NO governance-runtime namespace exists (doctrine — runtime namespace absent)", () => {
  const keys = Object.keys(control as Record<string, unknown>);
  for (const forbidden of ["governanceRuntime", "governance_runtime", "governanceRuntimeNamespace"]) {
    assert.ok(!keys.includes(forbidden), `forbidden namespace present: ${forbidden}`);
  }
  // The only newly exposed constitutional namespace is `constitutionalGovernance`.
  assert.ok(keys.includes("constitutionalGovernance"));
});
