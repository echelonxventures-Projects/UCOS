/**
 * CGR-W2-AVR-02 — Acyclicity & Mandatory Up-Trace Verifier.
 * Categories: Determinism · Fail-closed · Dependency validation.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { makeGovernance, seedAuthorityCorpus, seededRuntime } from "../wave-a-harness.ts";
import { createAuthorityReadModel } from "../../../src/control/constitutional-governance/authority/read-model.ts";
import { resolveAuthorityChain } from "../../../src/control/constitutional-governance/authority/resolve.ts";
import { verifyAcyclicUpTrace } from "../../../src/control/constitutional-governance/verification/acyclicity.ts";
import type { ResolvedAuthorityChain, AuthorityChainNode } from "../../../src/control/constitutional-governance/authority/types.ts";

test("AVR-02 dependency: an acyclic chain with every non-root node up-tracing passes", () => {
  const { readModel } = seededRuntime();
  const chain = resolveAuthorityChain(readModel, "CAP-01").chain!;
  const res = verifyAcyclicUpTrace(chain);
  assert.equal(res.valid, true);
});

test("AVR-02 fail-closed: a cycle in the resolved chain is detected and named", () => {
  const gov = makeGovernance();
  seedAuthorityCorpus(gov);
  gov.consents.propose({
    logicalId: "CYC-A", version: "1.0.0", ownerAuthority: "s",
    content: { subject: "s", grantee: "CAP-01", granted: true }, createdBy: "s", upTrace: ["CYC-B"],
  });
  gov.consents.propose({
    logicalId: "CYC-B", version: "1.0.0", ownerAuthority: "s",
    content: { subject: "s", grantee: "CAP-01", granted: true }, createdBy: "s", upTrace: ["CYC-A"],
  });
  const chain = resolveAuthorityChain(createAuthorityReadModel(gov), "CYC-A").chain!;
  const res = verifyAcyclicUpTrace(chain);
  assert.equal(res.valid, false);
  assert.ok(res.cycle && res.cycle.length >= 2, "cycle path must be reported");
  assert.ok(res.cycle!.includes("CYC-A") && res.cycle!.includes("CYC-B"));
});

test("AVR-02 fail-closed: a non-root node with an empty up-trace fails (mandatory up-trace / RG-7)", () => {
  // Hand-build a chain: a non-root (REG-CAP) node with no up-trace.
  const orphan: AuthorityChainNode = {
    logicalId: "CAP-ORPHAN", registry: "REG-CAP", recordUuid: "u", contentHash: "h",
    upTrace: [], depth: 0, isRoot: false,
  };
  const chain: ResolvedAuthorityChain = {
    subject: "CAP-ORPHAN", subjectRegistry: "REG-CAP", nodes: [orphan],
    rootIds: ["CAP-ORPHAN"], maxDepth: 0, complete: false,
  };
  const res = verifyAcyclicUpTrace(chain);
  assert.equal(res.valid, false);
  assert.deepEqual(res.missingUpTrace, ["CAP-ORPHAN"]);
});

test("AVR-02 dependency: a REG-PRIN root with empty up-trace is permitted (root exemption)", () => {
  const { readModel } = seededRuntime();
  const chain = resolveAuthorityChain(readModel, "PCAMG-PRIN-001").chain!;
  assert.equal(verifyAcyclicUpTrace(chain).valid, true);
});

test("AVR-02 determinism: repeated verification yields identical verdicts", () => {
  const { readModel } = seededRuntime();
  const chain = resolveAuthorityChain(readModel, "PDC-GOV").chain!;
  assert.deepEqual(verifyAcyclicUpTrace(chain), verifyAcyclicUpTrace(chain));
});
