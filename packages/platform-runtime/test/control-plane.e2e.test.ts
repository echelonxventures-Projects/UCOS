import { test } from "node:test";
import assert from "node:assert/strict";
import { createSubstrate } from "../src/bootstrap.ts";
import { createControlPlane } from "../src/control/bootstrap.ts";
import { AuthenticationError, AuthorizationError } from "../src/control/errors.ts";
import type { CapabilityInstance, Descriptor } from "../src/contracts/types.ts";

const textContract: Descriptor = {
  kind: "contract",
  id: "contract.text-producer",
  version: "1.0.0",
  operations: [
    {
      name: "produce",
      input: { type: "object", properties: { subject: { type: "string" } }, additionalProperties: false },
      output: { type: "string" },
    },
  ],
};

const shoutCapability: Descriptor = {
  kind: "capability",
  id: "cap.shout",
  version: "1.0.0",
  name: "Shout",
  contract: { id: "contract.text-producer", versionRange: "^1.0.0" },
  provider: { module: "plugin:shout", export: "create" },
};

async function composedSubstrate() {
  const substrate = createSubstrate();
  substrate.kernel.registerProvider("shout", (): CapabilityInstance => ({
    operations: { produce: (input) => `${(input as { subject?: string })?.subject ?? ""}!`.toUpperCase() },
  }));
  substrate.kernel.loadDescriptors([textContract, shoutCapability]);
  await substrate.kernel.compose();
  return substrate;
}

test("end-to-end: authenticated + authorized request executes and is audited", async () => {
  const substrate = await composedSubstrate();
  const control = createControlPlane(substrate);

  control.identityRegistry.register({
    id: "svc.caller",
    kind: "service",
    status: "active",
    permissions: ["cap.shout:produce"],
    credentials: [{ scheme: "token", value: "tok" }],
    trust: { level: 5 },
  });
  control.policyRegistry.register({
    id: "allow-shout",
    target: { capability: "cap.shout", operation: "produce" },
    effect: "allow",
    rules: [
      { type: "require-permission", permission: "cap.shout:produce" },
      { type: "require-trust", minLevel: 3 },
    ],
  });

  const out = await control.controlPlane.execute(
    { identityId: "svc.caller", credential: { scheme: "token", value: "tok" } },
    "cap.shout",
    "produce",
    { subject: "ucos" },
  );
  assert.equal(out, "UCOS!");

  const audit = control.controlPlane.audit();
  assert.equal(audit.length, 1);
  assert.equal(audit[0]?.effect, "allow");
  assert.equal(audit[0]?.identityId, "svc.caller");
});

test("end-to-end: deny-by-default blocks execution and never reaches the kernel", async () => {
  const substrate = await composedSubstrate();
  const control = createControlPlane(substrate);
  control.identityRegistry.register({ id: "svc.caller", kind: "service", status: "active", permissions: [] });

  await assert.rejects(
    () => control.controlPlane.execute({ identityId: "svc.caller" }, "cap.shout", "produce", { subject: "x" }),
    (e: unknown) => e instanceof AuthorizationError,
  );
  const audit = control.controlPlane.audit();
  assert.equal(audit[0]?.effect, "deny");
});

test("end-to-end: unauthenticated request is denied and audited as authn-denied", async () => {
  const substrate = await composedSubstrate();
  const control = createControlPlane(substrate);
  await assert.rejects(
    () => control.controlPlane.execute({ identityId: "ghost" }, "cap.shout", "produce", { subject: "x" }),
    (e: unknown) => e instanceof AuthenticationError,
  );
  assert.equal(control.controlPlane.audit()[0]?.effect, "authn-denied");
});

test("end-to-end: insufficient trust is denied even with the permission", async () => {
  const substrate = await composedSubstrate();
  const control = createControlPlane(substrate);
  control.identityRegistry.register({
    id: "svc.caller",
    kind: "service",
    status: "active",
    permissions: ["cap.shout:produce"],
    trust: { level: 1 },
  });
  control.policyRegistry.register({
    id: "allow-shout",
    target: { capability: "cap.shout", operation: "produce" },
    effect: "allow",
    rules: [
      { type: "require-permission", permission: "cap.shout:produce" },
      { type: "require-trust", minLevel: 9 },
    ],
  });
  const decision = control.controlPlane.authorize({ identityId: "svc.caller" }, "cap.shout", "produce");
  assert.equal(decision.effect, "deny");
  assert.equal(decision.trustLevel, 1);
});

test("end-to-end: governance approval gate opens and closes execution at runtime", async () => {
  const substrate = await composedSubstrate();
  const control = createControlPlane(substrate);
  control.identityRegistry.register({
    id: "svc.caller",
    kind: "service",
    status: "active",
    permissions: ["cap.shout:produce"],
  });
  control.governance.registerProcess({ id: "shout-approval", kind: "approval" });
  control.policyRegistry.register({
    id: "allow-shout-governed",
    target: { capability: "cap.shout", operation: "produce" },
    effect: "allow",
    rules: [
      { type: "require-permission", permission: "cap.shout:produce" },
      { type: "require-governance-approval", process: "shout-approval" },
    ],
  });

  const principal = { identityId: "svc.caller" };
  await assert.rejects(
    () => control.controlPlane.execute(principal, "cap.shout", "produce", { subject: "x" }),
    (e: unknown) => e instanceof AuthorizationError,
  );

  control.governance.grantApproval({
    process: "shout-approval",
    subject: "svc.caller",
    decision: "approved",
    approver: "board",
  });
  const out = await control.controlPlane.execute(principal, "cap.shout", "produce", { subject: "ok" });
  assert.equal(out, "OK!");
});

test("end-to-end: contract validation still applies after authorization (defense in depth)", async () => {
  const substrate = await composedSubstrate();
  const control = createControlPlane(substrate);
  control.identityRegistry.register({
    id: "svc.caller",
    kind: "service",
    status: "active",
    permissions: ["*"],
  });
  control.policyRegistry.register({
    id: "allow-all",
    target: { capability: "*" },
    effect: "allow",
    rules: [{ type: "require-permission", permission: "*" }],
  });
  // Authorized, but the input violates the ratified contract schema -> kernel rejects.
  await assert.rejects(
    () => control.controlPlane.execute({ identityId: "svc.caller" }, "cap.shout", "produce", { subject: 123 }),
    (e: unknown) => (e as { code?: string })?.code === "EXECUTION_FAILED",
  );
});
