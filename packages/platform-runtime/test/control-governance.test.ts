import { test } from "node:test";
import assert from "node:assert/strict";
import { createSubstrate } from "../src/bootstrap.ts";
import { GovernanceRegistry } from "../src/control/governance/governance-registry.ts";
import { ControlValidationError } from "../src/control/errors.ts";

function gov() {
  const { metadata } = createSubstrate();
  return new GovernanceRegistry(metadata);
}

test("registers governance processes and reads them back", () => {
  const g = gov();
  g.registerProcess({ id: "change-approval", kind: "approval", description: "prod change" });
  assert.equal(g.getProcess("change-approval")?.kind, "approval");
  assert.equal(g.listProcesses().length, 1);
});

test("approvals are runtime records (nothing pre-approved) and gate on a known process", () => {
  const g = gov();
  assert.throws(
    () => g.grantApproval({ process: "unknown", subject: "x", decision: "approved", approver: "a" }),
    (e: unknown) => e instanceof ControlValidationError,
  );
  g.registerProcess({ id: "change-approval", kind: "approval" });
  assert.equal(g.isApproved("change-approval", "wp-42"), false);
  g.grantApproval({ process: "change-approval", subject: "wp-42", decision: "approved", approver: "board" });
  assert.equal(g.isApproved("change-approval", "wp-42"), true);
  // A rejection is recorded but does not count as approved.
  g.grantApproval({ process: "change-approval", subject: "wp-43", decision: "rejected", approver: "board" });
  assert.equal(g.isApproved("change-approval", "wp-43"), false);
});

test("certifications can be granted and revoked", () => {
  const g = gov();
  g.certify({ id: "iso-27001", subject: "platform", authority: "auditor" });
  assert.equal(g.isCertified("iso-27001"), true);
  g.revokeCertification("iso-27001", "auditor");
  assert.equal(g.isCertified("iso-27001"), false);
  assert.throws(() => g.revokeCertification("nope", "auditor"), (e: unknown) => e instanceof ControlValidationError);
});

test("validateApproval throws when there is no active approval", () => {
  const g = gov();
  g.registerProcess({ id: "p", kind: "approval" });
  assert.throws(() => g.validateApproval("p", "s"), (e: unknown) => e instanceof ControlValidationError);
  g.grantApproval({ process: "p", subject: "s", decision: "approved", approver: "a" });
  assert.doesNotThrow(() => g.validateApproval("p", "s"));
});
