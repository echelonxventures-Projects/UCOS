/**
 * Barrels verification — cg/index.ts top-level namespace barrel.
 * Proves: export correctness (every CGR public symbol is reachable through the barrel) and
 * namespace integrity (the barrel composes and verifies end-to-end without collisions).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import * as cg from "../../../src/control/constitutional-governance/index.ts";

test("BARREL: core schema + primitives are exported", () => {
  assert.equal(typeof cg.computeContentHash, "function");
  assert.equal(typeof cg.computeRecordUuid, "function");
  assert.equal(typeof cg.verifyRecordHash, "function");
  assert.equal(typeof cg.AppendOnlyError, "function");
  assert.equal(typeof cg.CgValidationError, "function");
  assert.equal(typeof cg.CgNotFoundError, "function");
  assert.ok(Array.isArray(cg.REGISTRY_NAMES) && cg.REGISTRY_NAMES.length === 11);
  assert.ok(Array.isArray(cg.EDGE_RELATIONS) && cg.EDGE_RELATIONS.length === 8);
});

test("BARREL: harness + all eleven registry factories are exported", () => {
  assert.equal(typeof cg.fixedClock, "function");
  assert.equal(typeof cg.makeHarness, "function");
  assert.equal(typeof cg.recordingAuditSink, "function");
  assert.equal(typeof cg.ConstitutionalRegistry, "function");
  for (const factory of [
    cg.createPrincipleRegistry,
    cg.createMetaRegistry,
    cg.createGovernanceCandidateRegistry,
    cg.createCenterRegistry,
    cg.createDomainRegistry,
    cg.createPolicyRegistry,
    cg.createCapabilityRegistry,
    cg.createConsentRegistry,
    cg.createDecisionRegistry,
    cg.createTraceRegistry,
    cg.createAuditRegistry,
  ]) {
    assert.equal(typeof factory, "function");
  }
  assert.equal(cg.GOV_KEYSPACE, "cg:governance:");
  assert.equal(typeof cg.policyEffect, "function");
});

test("BARREL: audit-chain, verifier, and composition root are exported", () => {
  assert.equal(typeof cg.AuditHashChain, "function");
  assert.equal(typeof cg.computeEntryHash, "function");
  assert.equal(typeof cg.generateChain, "function");
  assert.match(cg.GENESIS_PREV_HASH, /^0{64}$/);
  assert.equal(typeof cg.verifyChain, "function");
  assert.equal(typeof cg.verifyReplay, "function");
  assert.equal(typeof cg.composeConstitutionalGovernance, "function");
  assert.equal(typeof cg.assertFailClosedStartup, "function");
});

test("BARREL: namespace integrity — barrel-composed runtime composes, proposes, and verifies", () => {
  const gov = cg.composeConstitutionalGovernance({ clock: cg.fixedClock() });
  gov.principles.propose({
    logicalId: "PCAMG-PRIN-001",
    version: "1.0.0",
    ownerAuthority: "board",
    content: { statement: "Sovereignty Origin = Invariant Principles" },
    createdBy: "board",
  });
  assert.equal(gov.auditChain.size(), 1);
  assert.equal(cg.verifyChain(gov.auditChain.entries()).valid, true);
});
