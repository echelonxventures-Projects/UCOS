import { test } from "node:test";
import assert from "node:assert/strict";
import { createSubstrate } from "../src/bootstrap.ts";
import { IdentityRegistry } from "../src/control/identity/identity-registry.ts";
import { IdentityResolver } from "../src/control/identity/identity-resolver.ts";
import { ControlValidationError, AuthenticationError } from "../src/control/errors.ts";
import type { IdentityProvider, IdentityRecord } from "../src/control/types.ts";

function reg() {
  const { metadata } = createSubstrate();
  return new IdentityRegistry(metadata);
}

test("registers and reads back a metadata-stored identity (no hardcoding)", () => {
  const registry = reg();
  registry.register({ id: "svc.orders", kind: "service", status: "active", permissions: ["cap.order:*"] });
  const found = registry.get("svc.orders");
  assert.equal(found?.id, "svc.orders");
  assert.deepEqual(found?.permissions, ["cap.order:*"]);
  assert.equal(registry.list().length, 1);
});

test("rejects an invalid identity against the identity schema", () => {
  const registry = reg();
  assert.throws(
    () => registry.register({ id: "", kind: "service", status: "active", permissions: [] } as IdentityRecord),
    (e: unknown) => e instanceof ControlValidationError,
  );
});

test("rejects duplicate identity registration", () => {
  const registry = reg();
  const rec: IdentityRecord = { id: "u1", kind: "user", status: "active", permissions: [] };
  registry.register(rec);
  assert.throws(() => registry.register(rec), (e: unknown) => e instanceof ControlValidationError);
});

test("enforces the identity lifecycle transitions", () => {
  const registry = reg();
  registry.register({ id: "u1", kind: "user", status: "active", permissions: [] });
  registry.setStatus("u1", "suspended");
  assert.equal(registry.get("u1")?.status, "suspended");
  // retired is terminal
  registry.setStatus("u1", "retired");
  assert.throws(() => registry.setStatus("u1", "active"), (e: unknown) => e instanceof ControlValidationError);
});

test("resolver authenticates active identities and enforces credentials", () => {
  const registry = reg();
  registry.register({
    id: "svc.pay",
    kind: "service",
    status: "active",
    permissions: ["cap.pay:charge"],
    credentials: [{ scheme: "token", value: "s3cr3t" }],
  });
  const resolver = new IdentityResolver(registry);

  const ok = resolver.resolve({ identityId: "svc.pay", credential: { scheme: "token", value: "s3cr3t" } });
  assert.equal(ok.id, "svc.pay");

  assert.throws(
    () => resolver.resolve({ identityId: "svc.pay", credential: { scheme: "token", value: "wrong" } }),
    (e: unknown) => e instanceof AuthenticationError,
  );
  assert.throws(
    () => resolver.resolve({ identityId: "ghost" }),
    (e: unknown) => e instanceof AuthenticationError,
  );
});

test("resolver rejects non-active identities", () => {
  const registry = reg();
  registry.register({ id: "u1", kind: "user", status: "active", permissions: [] });
  registry.setStatus("u1", "suspended");
  const resolver = new IdentityResolver(registry);
  assert.throws(() => resolver.resolve({ identityId: "u1" }), (e: unknown) => e instanceof AuthenticationError);
});

test("federated identity providers supply identities not stored locally", () => {
  const registry = reg();
  const provider: IdentityProvider = {
    name: "ext",
    resolve: (id) =>
      id === "ext.user"
        ? { id: "ext.user", kind: "user", status: "active", permissions: ["cap.read:*"] }
        : undefined,
  };
  registry.registerProvider(provider);
  const resolver = new IdentityResolver(registry);
  const resolved = resolver.resolve({ identityId: "ext.user" });
  assert.equal(resolved.id, "ext.user");
});
