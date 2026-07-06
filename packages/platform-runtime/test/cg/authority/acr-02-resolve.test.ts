/**
 * CGR-W2-ACR-02 — Authority Chain Resolver verification.
 * Categories: Determinism · Fail-closed · Append-only · Dependency validation.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  makeGovernance,
  seedAuthorityCorpus,
  seededRuntime,
} from "../wave-a-harness.ts";
import { createAuthorityReadModel } from "../../../src/control/constitutional-governance/authority/read-model.ts";
import { resolveAuthorityChain } from "../../../src/control/constitutional-governance/authority/resolve.ts";

test("ACR-02 dependency: a complete chain closes from subject to the Layer-0 principle root", () => {
  const { readModel, subjects } = seededRuntime();
  const res = resolveAuthorityChain(readModel, subjects.deep); // CAP-01
  assert.equal(res.resolved, true);
  const chain = res.chain!;
  assert.equal(chain.complete, true);
  assert.deepEqual(chain.rootIds, ["PCAMG-PRIN-001"]);
  assert.equal(chain.maxDepth, 4);
  // ordered by (depth asc, logicalId asc)
  assert.deepEqual(
    chain.nodes.map((n) => n.logicalId),
    ["CAP-01", "POL-1", "PDC-GOV", "PCAMG-META-I", "PCAMG-PRIN-001"],
  );
});

test("ACR-02 dependency: the self-root principle resolves as a complete depth-0 chain", () => {
  const { readModel, subjects } = seededRuntime();
  const res = resolveAuthorityChain(readModel, subjects.root);
  assert.equal(res.resolved, true);
  assert.equal(res.chain!.complete, true);
  assert.equal(res.chain!.maxDepth, 0);
  assert.equal(res.chain!.nodes.length, 1);
  assert.equal(res.chain!.nodes[0]!.isRoot, true);
});

test("ACR-02 fail-closed: unknown subject denies with E-UNKNOWN-SUBJECT", () => {
  const { readModel, subjects } = seededRuntime();
  const res = resolveAuthorityChain(readModel, subjects.unknown);
  assert.equal(res.resolved, false);
  assert.equal(res.chain, null);
  assert.equal(res.denial!.code, "E-UNKNOWN-SUBJECT");
});

test("ACR-02 fail-closed: a broken up-trace edge denies with E-CHAIN-BROKEN (no partial chain)", () => {
  const gov = makeGovernance();
  seedAuthorityCorpus(gov);
  // A record that up-traces to a non-existent id.
  gov.consents.propose({
    logicalId: "CONSENT-BROKEN",
    version: "1.0.0",
    ownerAuthority: "subj",
    content: { subject: "subj", grantee: "CAP-01", granted: true },
    createdBy: "subj",
    upTrace: ["GHOST-REF"],
  });
  const rm = createAuthorityReadModel(gov);
  const res = resolveAuthorityChain(rm, "CONSENT-BROKEN");
  assert.equal(res.resolved, false);
  assert.equal(res.denial!.code, "E-CHAIN-BROKEN");
  assert.equal(res.denial!.detail["missing"], "GHOST-REF");
});

test("ACR-02 fail-closed: a chain terminating at a non-principle is resolved but NOT complete", () => {
  const { readModel, subjects } = seededRuntime();
  const res = resolveAuthorityChain(readModel, subjects.incomplete); // AD-0001 → E-1 (trace)
  assert.equal(res.resolved, true);
  assert.equal(res.chain!.complete, false);
  assert.deepEqual(res.chain!.rootIds, ["E-1"]); // terminal exists but is not REG-PRIN
});

test("ACR-02 termination: a cyclic corpus resolves in finite time (no partial/complete claim)", () => {
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
  const rm = createAuthorityReadModel(gov);
  const res = resolveAuthorityChain(rm, "CYC-A");
  assert.equal(res.resolved, true);
  assert.equal(res.chain!.complete, false); // no terminal → cannot be complete
  assert.equal(res.chain!.nodes.length, 2);
});

test("ACR-02 determinism: identical corpora yield byte-identical resolved chains", () => {
  const g1 = makeGovernance(); seedAuthorityCorpus(g1);
  const g2 = makeGovernance(); seedAuthorityCorpus(g2);
  const r1 = resolveAuthorityChain(createAuthorityReadModel(g1), "CAP-01").chain!;
  const r2 = resolveAuthorityChain(createAuthorityReadModel(g2), "CAP-01").chain!;
  assert.deepEqual(
    r1.nodes.map((n) => `${n.logicalId}@${n.depth}#${n.contentHash}`),
    r2.nodes.map((n) => `${n.logicalId}@${n.depth}#${n.contentHash}`),
  );
});

test("ACR-02 append-only: resolution performs zero writes", () => {
  const { gov, readModel } = seededRuntime();
  const sizes = ["REG-PRIN", "REG-META", "REG-CAP"] as const;
  const before = sizes.map((n) => gov.registry(n).size());
  resolveAuthorityChain(readModel, "CAP-01");
  const after = sizes.map((n) => gov.registry(n).size());
  assert.deepEqual(after, before);
});
