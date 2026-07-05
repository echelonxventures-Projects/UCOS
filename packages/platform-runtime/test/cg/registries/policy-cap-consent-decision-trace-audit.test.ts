/**
 * Batch-4 verification — POLICY, CAP, CONSENT, DECISION, TRACE, AUDIT registries.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { makeHarness } from "../../../src/control/constitutional-governance/test-harness.ts";
import { createPolicyRegistry, policyEffect } from "../../../src/control/constitutional-governance/registries/policy-registry.ts";
import { createCapabilityRegistry } from "../../../src/control/constitutional-governance/registries/capability-registry.ts";
import { createConsentRegistry } from "../../../src/control/constitutional-governance/registries/consent-registry.ts";
import { createDecisionRegistry } from "../../../src/control/constitutional-governance/registries/decision-registry.ts";
import { createTraceRegistry } from "../../../src/control/constitutional-governance/registries/trace-registry.ts";
import { createAuditRegistry } from "../../../src/control/constitutional-governance/registries/audit-registry.ts";
import { AppendOnlyError, CgValidationError } from "../../../src/control/constitutional-governance/append-only.ts";

const UP = ["PCAMG-PRIN-001"];

test("REG-POLICY: deny-by-default; effect validated", () => {
  const policy = createPolicyRegistry(makeHarness());
  const noEffect = policy.propose({ logicalId: "POL-1", version: "1.0.0", ownerAuthority: "PDC-GOV", content: { domainRef: "PDC-GOV" }, createdBy: "t", upTrace: UP });
  assert.equal(policyEffect(noEffect), "deny", "absent effect ⇒ deny");
  const permit = policy.propose({ logicalId: "POL-2", version: "1.0.0", ownerAuthority: "PDC-GOV", content: { domainRef: "PDC-GOV", effect: "permit" }, createdBy: "t", upTrace: UP });
  assert.equal(policyEffect(permit), "permit");
  assert.throws(() => policy.propose({ logicalId: "POL-3", version: "1.0.0", ownerAuthority: "x", content: { domainRef: "PDC-GOV", effect: "maybe" }, createdBy: "t", upTrace: UP }), CgValidationError);
  assert.throws(() => policy.propose({ logicalId: "POL-4", version: "1.0.0", ownerAuthority: "x", content: {}, createdBy: "t", upTrace: UP }), CgValidationError);
});

test("REG-CAP: requires resolvable domainRef + policyRef", () => {
  const cap = createCapabilityRegistry({ ...makeHarness(), domainExists: (d) => d === "PDC-GOV", policyExists: (p) => p === "POL-1" });
  const ok = cap.propose({ logicalId: "CAP-01", version: "1.0.0", ownerAuthority: "PDC-GOV", content: { domainRef: "PDC-GOV", policyRef: "POL-1" }, createdBy: "t", upTrace: UP });
  assert.equal(ok.status, "proposed");
  assert.throws(() => cap.propose({ logicalId: "CAP-02", version: "1.0.0", ownerAuthority: "x", content: { domainRef: "NOPE", policyRef: "POL-1" }, createdBy: "t", upTrace: UP }), CgValidationError);
  assert.throws(() => cap.propose({ logicalId: "CAP-03", version: "1.0.0", ownerAuthority: "x", content: { domainRef: "PDC-GOV", policyRef: "NOPE" }, createdBy: "t", upTrace: UP }), CgValidationError);
});

test("REG-CONSENT: revocable — revoke is a new appended record (granted:false)", () => {
  const consent = createConsentRegistry(makeHarness());
  consent.propose({ logicalId: "CONSENT-1", version: "1.0.0", ownerAuthority: "subject-a", content: { subject: "subject-a", grantee: "svc-x", scope: { read: true }, granted: true }, createdBy: "subject-a", upTrace: ["CAP-01"] });
  const revoked = consent.supersede({ logicalId: "CONSENT-1", priorVersion: "1.0.0", version: "1.0.1", ownerAuthority: "subject-a", content: { subject: "subject-a", grantee: "svc-x", scope: { read: true }, granted: false }, createdBy: "subject-a", upTrace: ["CAP-01"] });
  assert.equal(revoked.content["granted"], false);
  assert.equal(consent.get("CONSENT-1", "1.0.0")!.status, "superseded");
  assert.throws(() => consent.propose({ logicalId: "CONSENT-2", version: "1.0.0", ownerAuthority: "s", content: { subject: "s", grantee: "g" }, createdBy: "s", upTrace: ["CAP-01"] }), CgValidationError);
});

test("REG-DECISION: separation-of-duties enforced", () => {
  const dec = createDecisionRegistry(makeHarness());
  const ok = dec.propose({ logicalId: "AD-0001", version: "1.0.0", ownerAuthority: "board", content: { proposer: "p", certifier: "c", ratifier: "r", subjectRef: "GOV-0001" }, createdBy: "board", upTrace: ["GOV-0001"] });
  assert.equal(ok.status, "proposed");
  assert.throws(() => dec.propose({ logicalId: "AD-0002", version: "1.0.0", ownerAuthority: "board", content: { proposer: "p", certifier: "p", ratifier: "r" }, createdBy: "board", upTrace: ["GOV-0001"] }), CgValidationError);
  assert.throws(() => dec.propose({ logicalId: "AD-0003", version: "1.0.0", ownerAuthority: "board", content: { proposer: "p", certifier: "c", ratifier: "c" }, createdBy: "board", upTrace: ["GOV-0001"] }), CgValidationError);
});

test("REG-TRACE: downward-only, no self-edge, valid relation, layer bounds", () => {
  const trace = createTraceRegistry(makeHarness());
  const ok = trace.propose({ logicalId: "E-1", version: "1.0.0", ownerAuthority: "author", content: { from: "PCAMG-META-I", to: "PCAMG-PRIN-001", relation: "derives-from", layerFrom: 1, layerTo: 0 }, createdBy: "t" });
  assert.equal(ok.status, "proposed");
  // upward authority (layerTo > layerFrom) rejected
  assert.throws(() => trace.propose({ logicalId: "E-2", version: "1.0.0", ownerAuthority: "a", content: { from: "PCAMG-PRIN-001", to: "PCAMG-META-I", relation: "derives-from", layerFrom: 0, layerTo: 1 }, createdBy: "t" }), CgValidationError);
  // self-edge rejected
  assert.throws(() => trace.propose({ logicalId: "E-3", version: "1.0.0", ownerAuthority: "a", content: { from: "X", to: "X", relation: "refines", layerFrom: 2, layerTo: 2 }, createdBy: "t" }), CgValidationError);
  // invalid relation rejected
  assert.throws(() => trace.propose({ logicalId: "E-4", version: "1.0.0", ownerAuthority: "a", content: { from: "A", to: "B", relation: "invents", layerFrom: 2, layerTo: 1 }, createdBy: "t" }), CgValidationError);
});

test("REG-AUDIT: append-only, terminal (no supersession), attributable, monotonic seq", () => {
  const audit = createAuditRegistry(makeHarness());
  const e1 = audit.propose({ logicalId: "AUD-1", version: "1.0.0", ownerAuthority: "audit", content: { actor: "alice", action: "PROPOSE", subjectRef: "PCAMG-PRIN-001@1.0.0" }, createdBy: "audit" });
  const e2 = audit.propose({ logicalId: "AUD-2", version: "1.0.0", ownerAuthority: "audit", content: { actor: "bob", action: "SUPERSEDE", subjectRef: "PCAMG-PRIN-001@1.0.1" }, createdBy: "audit" });
  assert.equal(e1.seq, 0);
  assert.equal(e2.seq, 1);
  // terminal: supersession rejected
  assert.throws(() => audit.supersede({ logicalId: "AUD-1", priorVersion: "1.0.0", version: "1.0.1", ownerAuthority: "audit", content: { actor: "a", action: "X", subjectRef: "y" }, createdBy: "audit" }), AppendOnlyError);
  // missing attribution rejected
  assert.throws(() => audit.propose({ logicalId: "AUD-3", version: "1.0.0", ownerAuthority: "audit", content: { action: "X", subjectRef: "y" }, createdBy: "audit" }), CgValidationError);
});
