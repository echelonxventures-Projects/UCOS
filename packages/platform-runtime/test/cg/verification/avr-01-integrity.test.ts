/**
 * CGR-W2-AVR-01 — Authority Chain Integrity Verifier.
 * Categories: Determinism · Fail-closed · Append-only · Dependency validation.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { seededRuntime } from "../wave-a-harness.ts";
import { resolveAuthorityChain } from "../../../src/control/constitutional-governance/authority/resolve.ts";
import { verifyChainIntegrity } from "../../../src/control/constitutional-governance/verification/integrity.ts";
import type { ResolvedAuthorityChain, AuthorityChainNode } from "../../../src/control/constitutional-governance/authority/types.ts";

test("AVR-01 dependency: a complete resolved chain passes integrity (every node verifies + closure)", () => {
  const { readModel } = seededRuntime();
  const chain = resolveAuthorityChain(readModel, "CAP-01").chain!;
  const res = verifyChainIntegrity(readModel, chain);
  assert.equal(res.valid, true);
  assert.equal(res.checked, chain.nodes.length);
});

test("AVR-01 fail-closed: an incomplete chain (no principle root) fails integrity", () => {
  const { readModel } = seededRuntime();
  const chain = resolveAuthorityChain(readModel, "AD-0001").chain!;
  const res = verifyChainIntegrity(readModel, chain);
  assert.equal(res.valid, false);
  assert.match(res.reason!, /principle root/);
});

test("AVR-01 fail-closed: a dangling up-trace (node references a logical id not in the chain) fails", () => {
  const { readModel } = seededRuntime();
  const good = resolveAuthorityChain(readModel, "PCAMG-META-I").chain!;
  // Fabricate a chain whose subject up-traces to a node that is NOT present in the chain.
  const tampered: ResolvedAuthorityChain = {
    subject: "PCAMG-META-I",
    subjectRegistry: "REG-META",
    nodes: [good.nodes.find((n) => n.logicalId === "PCAMG-META-I")!],
    rootIds: [],
    maxDepth: 0,
    complete: false,
  };
  const res = verifyChainIntegrity(readModel, tampered);
  assert.equal(res.valid, false);
  assert.match(res.reason!, /dangling up-trace/);
});

test("AVR-01 fail-closed: a contentHash mismatch (stale node) is detected", () => {
  const { readModel } = seededRuntime();
  const chain = resolveAuthorityChain(readModel, "PCAMG-META-I").chain!;
  const stale: AuthorityChainNode = { ...chain.nodes[0]!, contentHash: "0".repeat(64) };
  const tampered: ResolvedAuthorityChain = { ...chain, nodes: [stale, ...chain.nodes.slice(1)] };
  const res = verifyChainIntegrity(readModel, tampered);
  assert.equal(res.valid, false);
  assert.match(res.reason!, /contentHash mismatch/);
  assert.equal(res.brokenAt, 0);
});

test("AVR-01 fail-closed: an empty chain fails (nothing to anchor authority to)", () => {
  const { readModel } = seededRuntime();
  const empty: ResolvedAuthorityChain = {
    subject: "X", subjectRegistry: "REG-PRIN", nodes: [], rootIds: [], maxDepth: 0, complete: false,
  };
  assert.equal(verifyChainIntegrity(readModel, empty).valid, false);
});

test("AVR-01 determinism: repeated verification of the same chain yields the same verdict", () => {
  const { readModel } = seededRuntime();
  const chain = resolveAuthorityChain(readModel, "CAP-01").chain!;
  const a = verifyChainIntegrity(readModel, chain);
  const b = verifyChainIntegrity(readModel, chain);
  assert.deepEqual(a, b);
});

test("AVR-01 append-only: verification performs zero writes", () => {
  const { gov, readModel } = seededRuntime();
  const before = gov.registry("REG-CAP").size();
  const chain = resolveAuthorityChain(readModel, "CAP-01").chain!;
  verifyChainIntegrity(readModel, chain);
  assert.equal(gov.registry("REG-CAP").size(), before);
});
