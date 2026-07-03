import { test } from "node:test";
import assert from "node:assert/strict";
import { createSubstrate } from "../src/bootstrap.ts";
import { PolicyRegistry } from "../src/control/policy/policy-registry.ts";
import { PolicyEvaluator } from "../src/control/policy/policy-evaluator.ts";
import { GovernanceRegistry } from "../src/control/governance/governance-registry.ts";
import { ControlValidationError } from "../src/control/errors.ts";
import type { DecisionContext, IdentityRecord } from "../src/control/types.ts";

function harness() {
  const { metadata } = createSubstrate();
  const policies = new PolicyRegistry(metadata);
  const governance = new GovernanceRegistry(metadata);
  const evaluator = new PolicyEvaluator(policies, governance);
  return { policies, governance, evaluator };
}

function ctx(overrides: Partial<DecisionContext> = {}): DecisionContext {
  const identity: IdentityRecord = overrides.identity ?? {
    id: "svc",
    kind: "service",
    status: "active",
    permissions: [],
  };
  return {
    identity,
    trustLevel: overrides.trustLevel ?? 0,
    capabilityId: overrides.capabilityId ?? "cap.order",
    operation: overrides.operation ?? "place",
    input: overrides.input ?? null,
    config: overrides.config ?? {},
  };
}

test("deny-by-default when no policy grants access", () => {
  const { evaluator } = harness();
  const d = evaluator.evaluate(ctx());
  assert.equal(d.effect, "deny");
  assert.match(d.reason, /deny-by-default/);
  assert.deepEqual(d.matchedPolicies, []);
});

test("allow policy grants when its permission requirement is met (glob)", () => {
  const { policies, evaluator } = harness();
  policies.register({
    id: "allow-order",
    target: { capability: "cap.order", operation: "*" },
    effect: "allow",
    rules: [{ type: "require-permission", permission: "cap.order:place" }],
  });
  const denied = evaluator.evaluate(ctx({ identity: { id: "s", kind: "service", status: "active", permissions: [] } }));
  assert.equal(denied.effect, "deny");

  const granted = evaluator.evaluate(
    ctx({ identity: { id: "s", kind: "service", status: "active", permissions: ["cap.order:*"] } }),
  );
  assert.equal(granted.effect, "allow");
  assert.deepEqual(granted.matchedPolicies, ["allow-order"]);
});

test("deny overrides allow regardless of priority", () => {
  const { policies, evaluator } = harness();
  policies.register({
    id: "allow-all",
    target: { capability: "*" },
    effect: "allow",
    priority: 100,
    rules: [{ type: "require-permission", permission: "*" }],
  });
  policies.register({
    id: "deny-suspended-region",
    target: { capability: "cap.order" },
    effect: "deny",
    priority: 1,
    rules: [{ type: "require-attribute", key: "region", equals: "blocked" }],
  });
  const id: IdentityRecord = {
    id: "s",
    kind: "service",
    status: "active",
    permissions: ["*"],
    attributes: { region: "blocked" },
  };
  const d = evaluator.evaluate(ctx({ identity: id }));
  assert.equal(d.effect, "deny");
  assert.match(d.reason, /explicit deny by policy "deny-suspended-region"/);
});

test("require-trust is evaluated against the resolved trust level", () => {
  const { policies, evaluator } = harness();
  policies.register({
    id: "high-trust",
    target: { capability: "cap.order", operation: "place" },
    effect: "allow",
    rules: [
      { type: "require-permission", permission: "cap.order:place" },
      { type: "require-trust", minLevel: 5 },
    ],
  });
  const id: IdentityRecord = { id: "s", kind: "service", status: "active", permissions: ["cap.order:place"] };
  assert.equal(evaluator.evaluate(ctx({ identity: id, trustLevel: 3 })).effect, "deny");
  assert.equal(evaluator.evaluate(ctx({ identity: id, trustLevel: 5 })).effect, "allow");
});

test("require-governance-approval and require-certification consult the governance registry", () => {
  const { policies, governance, evaluator } = harness();
  governance.registerProcess({ id: "prod-release", kind: "approval" });
  policies.register({
    id: "gated",
    target: { capability: "cap.deploy", operation: "release" },
    effect: "allow",
    rules: [
      { type: "require-permission", permission: "cap.deploy:release" },
      { type: "require-governance-approval", process: "prod-release" },
      { type: "require-certification", certification: "SOC2" },
    ],
  });
  const id: IdentityRecord = { id: "svc.cd", kind: "service", status: "active", permissions: ["cap.deploy:release"] };
  const c = () => ctx({ identity: id, capabilityId: "cap.deploy", operation: "release" });

  assert.equal(evaluator.evaluate(c()).effect, "deny"); // no approval, no cert

  governance.grantApproval({ process: "prod-release", subject: "svc.cd", decision: "approved", approver: "board" });
  assert.equal(evaluator.evaluate(c()).effect, "deny"); // still missing certification

  governance.certify({ id: "SOC2", subject: "platform", authority: "auditor" });
  assert.equal(evaluator.evaluate(c()).effect, "allow");

  // Revoking the certification re-denies.
  governance.revokeCertification("SOC2", "auditor");
  assert.equal(evaluator.evaluate(c()).effect, "deny");
});

test("policy registry validates and rejects malformed / duplicate policies", () => {
  const { policies } = harness();
  assert.throws(
    () => policies.register({ id: "", effect: "allow", rules: [] }),
    (e: unknown) => e instanceof ControlValidationError,
  );
  policies.register({ id: "p1", effect: "allow", rules: [{ type: "require-permission", permission: "*" }] });
  assert.throws(
    () => policies.register({ id: "p1", effect: "allow", rules: [] }),
    (e: unknown) => e instanceof ControlValidationError,
  );
});
