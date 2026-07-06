/**
 * CGR-W2-ACR-01 — Authority Read-Model verification.
 * Categories: Determinism · Fail-closed · Dependency validation · Append-only compliance.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  makeGovernance,
  seedAuthorityCorpus,
  seededRuntime,
} from "../wave-a-harness.ts";
import { createAuthorityReadModel } from "../../../src/control/constitutional-governance/authority/read-model.ts";

test("ACR-01 dependency: lookup resolves a live registry head with its owning registry", () => {
  const { readModel } = seededRuntime();
  const ref = readModel.lookup("PCAMG-META-I");
  assert.ok(ref, "meta head must resolve");
  assert.equal(ref!.registry, "REG-META");
  assert.equal(ref!.record.logicalId, "PCAMG-META-I");
  assert.equal(ref!.record.status, "proposed");
});

test("ACR-01 fail-closed: absent logical id resolves to null (deny-by-default)", () => {
  const { readModel } = seededRuntime();
  assert.equal(readModel.lookup("NOPE-404"), null);
  assert.deepEqual(readModel.lookupAll("NOPE-404"), []);
  assert.equal(readModel.isAmbiguous("NOPE-404"), false);
});

test("ACR-01 dependency: verify-on-read holds for a located record (tamper-evidence)", () => {
  const { readModel } = seededRuntime();
  const ref = readModel.lookup("PCAMG-PRIN-001")!;
  assert.equal(readModel.verify(ref), true);
});

test("ACR-01 fail-closed: ambiguous (multi-registry) logical id is surfaced, not silently resolved", () => {
  const gov = makeGovernance();
  seedAuthorityCorpus(gov);
  // Seed the SAME logical id into two distinct registries (RG-1 single-source breach).
  gov.consents.propose({
    logicalId: "DUP-1",
    version: "1.0.0",
    ownerAuthority: "subj",
    content: { subject: "subj", grantee: "CAP-01", granted: true },
    createdBy: "subj",
    upTrace: ["CAP-01"],
  });
  gov.decisions.propose({
    logicalId: "DUP-1",
    version: "1.0.0",
    ownerAuthority: "board",
    content: { proposer: "p", certifier: "c", ratifier: "r" },
    createdBy: "board",
    upTrace: ["GOV-0001"],
  });
  const rm = createAuthorityReadModel(gov);
  assert.equal(rm.isAmbiguous("DUP-1"), true);
  assert.equal(rm.lookupAll("DUP-1").length, 2);
});

test("ACR-01 determinism: repeated lookups over identical state are byte-identical", () => {
  const a = createAuthorityReadModel((() => { const g = makeGovernance(); seedAuthorityCorpus(g); return g; })());
  const b = createAuthorityReadModel((() => { const g = makeGovernance(); seedAuthorityCorpus(g); return g; })());
  const ra = a.lookup("CAP-01")!;
  const rb = b.lookup("CAP-01")!;
  assert.equal(ra.record.contentHash, rb.record.contentHash);
  assert.equal(ra.record.recordUuid, rb.record.recordUuid);
});

test("ACR-01 append-only: the read-model performs no write — registry sizes are unchanged by lookups", () => {
  const { gov, readModel } = seededRuntime();
  const before = gov.registry("REG-META").size();
  readModel.lookup("PCAMG-META-I");
  readModel.lookupAll("PCAMG-PRIN-001");
  readModel.isAmbiguous("CAP-01");
  assert.equal(gov.registry("REG-META").size(), before);
});
