/**
 * Batch-3 verification — authority-hierarchy registries (PRIN, META, GOV, CENTER, DOMAIN).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { makeHarness } from "../../../src/control/constitutional-governance/test-harness.ts";
import { createPrincipleRegistry } from "../../../src/control/constitutional-governance/registries/principle-registry.ts";
import { createMetaRegistry } from "../../../src/control/constitutional-governance/registries/meta-registry.ts";
import { createGovernanceCandidateRegistry } from "../../../src/control/constitutional-governance/registries/governance-candidate-registry.ts";
import { createCenterRegistry } from "../../../src/control/constitutional-governance/registries/center-registry.ts";
import { createDomainRegistry } from "../../../src/control/constitutional-governance/registries/domain-registry.ts";
import { CgValidationError } from "../../../src/control/constitutional-governance/append-only.ts";

test("REG-PRIN: closed 15-id space; immutable statement; root (no up-trace)", () => {
  const h = makeHarness();
  const prin = createPrincipleRegistry(h);
  const r = prin.propose({ logicalId: "PCAMG-PRIN-001", version: "1.0.0", ownerAuthority: "board", content: { statement: "Sovereignty Origin = Invariant Principles" }, createdBy: "t" });
  assert.equal(r.status, "proposed");
  assert.deepEqual(r.upTrace, []);
  assert.throws(() => prin.propose({ logicalId: "PCAMG-PRIN-016", version: "1.0.0", ownerAuthority: "board", content: { statement: "x" }, createdBy: "t" }), CgValidationError);
  assert.throws(() => prin.propose({ logicalId: "PCAMG-PRIN-002", version: "1.0.0", ownerAuthority: "board", content: {}, createdBy: "t" }), CgValidationError);
  // immutable statement across versions
  assert.throws(() => prin.supersede({ logicalId: "PCAMG-PRIN-001", priorVersion: "1.0.0", version: "1.0.1", ownerAuthority: "board", content: { statement: "changed" }, createdBy: "t" }), CgValidationError);
});

test("REG-META: requires up-trace; resolves to existing principle when wired", () => {
  const h = makeHarness();
  const prin = createPrincipleRegistry({ log: h.log, clock: h.clock });
  prin.propose({ logicalId: "PCAMG-PRIN-001", version: "1.0.0", ownerAuthority: "board", content: { statement: "P1" }, createdBy: "t" });
  const metaH = makeHarness();
  const meta = createMetaRegistry({ log: metaH.log, clock: metaH.clock, principleExists: (id) => !!prin.getLatest(id) });
  const ok = meta.propose({ logicalId: "PCAMG-META-I", version: "1.0.0", ownerAuthority: "board", content: { article: "Supremacy" }, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] });
  assert.equal(ok.upTrace[0], "PCAMG-PRIN-001");
  assert.throws(() => meta.propose({ logicalId: "PCAMG-META-II", version: "1.0.0", ownerAuthority: "board", content: { article: "x" }, createdBy: "t", upTrace: ["PCAMG-PRIN-999"] }), CgValidationError);
});

test("REG-GOV: candidate-only; requires generationRef; rejects ACTIVE assertions", () => {
  const h = makeHarness();
  const gov = createGovernanceCandidateRegistry(h);
  const ok = gov.propose({ logicalId: "GOV-0001", version: "1.0.0", ownerAuthority: "compiler", content: { generationRef: "gen-1", candidate: true }, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] });
  assert.equal(ok.status, "proposed");
  assert.throws(() => gov.propose({ logicalId: "GOV-0002", version: "1.0.0", ownerAuthority: "compiler", content: { candidate: true }, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] }), CgValidationError);
  assert.throws(() => gov.propose({ logicalId: "GOV-0003", version: "1.0.0", ownerAuthority: "compiler", content: { generationRef: "g", status: "active" }, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] }), CgValidationError);
  assert.throws(() => gov.propose({ logicalId: "GOV-0004", version: "1.0.0", ownerAuthority: "compiler", content: { generationRef: "g", active: true }, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] }), CgValidationError);
});

test("REG-CENTER: acyclic delegation enforced", () => {
  const h = makeHarness();
  const center = createCenterRegistry(h);
  center.propose({ logicalId: "PGC-ROOT", version: "1.0.0", ownerAuthority: "board", content: {}, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] });
  center.propose({ logicalId: "PGC-A", version: "1.0.0", ownerAuthority: "board", content: { parentCenter: "PGC-ROOT" }, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] });
  // self-delegation rejected
  assert.throws(() => center.propose({ logicalId: "PGC-X", version: "1.0.0", ownerAuthority: "board", content: { parentCenter: "PGC-X" }, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] }), CgValidationError);
  // non-existent parent rejected
  assert.throws(() => center.propose({ logicalId: "PGC-Y", version: "1.0.0", ownerAuthority: "board", content: { parentCenter: "PGC-NOPE" }, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] }), CgValidationError);
});

test("REG-DOMAIN: centerRef required and resolved when wired", () => {
  const h = makeHarness();
  const center = createCenterRegistry({ log: h.log, clock: h.clock });
  center.propose({ logicalId: "PGC-ROOT", version: "1.0.0", ownerAuthority: "board", content: {}, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] });
  const dH = makeHarness();
  const domain = createDomainRegistry({ log: dH.log, clock: dH.clock, centerExists: (id) => !!center.getLatest(id) });
  const ok = domain.propose({ logicalId: "PDC-GOV", version: "1.0.0", ownerAuthority: "PGC-ROOT", content: { centerRef: "PGC-ROOT" }, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] });
  assert.equal(ok.content["centerRef"], "PGC-ROOT");
  assert.throws(() => domain.propose({ logicalId: "PDC-SEC", version: "1.0.0", ownerAuthority: "x", content: { centerRef: "PGC-MISSING" }, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] }), CgValidationError);
});
