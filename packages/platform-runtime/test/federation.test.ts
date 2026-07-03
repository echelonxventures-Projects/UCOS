import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFederation, mintIdentity, mintTrust, allowShout } from "./federation-harness.ts";
import { AuthenticationError, AuthorizationError } from "../src/control/errors.ts";
import { FederatedAuditLog } from "../src/control/federation/federated-audit-log.ts";
import { namespacedId, parseNamespacedId } from "../src/control/federation/types.ts";
import { generateKeyPair, signPayload } from "../src/control/federation/assertions.ts";

test("cross-domain identity: a verified federated principal executes a local capability", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control);
  const bundle = { identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }) };
  const out = await fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "hi" });
  assert.equal(out, "HI!");
});

test("cross-domain identity + trust: verified principal with clamped trust executes", async () => {
  const { fed, control, audit, authKeyPriv } = await buildFederation();
  allowShout(control, 3);
  const bundle = {
    identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }),
    trust: mintTrust(authKeyPriv, { identityId: "alice", level: 5 }),
  };
  const out = await fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "ucos" });
  assert.equal(out, "UCOS!");
  const entries = audit.entries();
  assert.equal(entries.at(-1)?.effect, "allow");
  assert.equal(entries.at(-1)?.identityId, "nodeB::alice");
});

test("provenance is recorded on the materialized federated identity", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control);
  const bundle = { identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }) };
  const decision = await fed.federatedControlPlane.authorizeFederated(bundle, "cap.shout", "produce");
  assert.equal(decision.effect, "allow");
  const prov = (decision.identity.attributes as Record<string, unknown>).provenance as { origin: { nodeId: string } };
  assert.equal(prov.origin.nodeId, "nodeB");
});

test("namespaced id helpers round-trip and distinguish local vs foreign", () => {
  assert.equal(namespacedId("nodeB", "alice"), "nodeB::alice");
  assert.deepEqual(parseNamespacedId("nodeB::alice"), { nodeId: "nodeB", localId: "alice" });
  assert.equal(parseNamespacedId("local-user"), undefined); // local ids never contain "::"
});

test("clamped trust: boundary/delegation ceiling caps an over-asserted trust level", async () => {
  const { fed, control, authKeyPriv } = await buildFederation({ boundaryMaxTrust: 4, delegationMax: 4 });
  allowShout(control, 5); // policy needs trust >= 5
  const bundle = {
    identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }),
    trust: mintTrust(authKeyPriv, { identityId: "alice", level: 99 }), // asserts 99, must clamp to 4
  };
  const decision = await fed.federatedControlPlane.authorizeFederated(bundle, "cap.shout", "produce");
  assert.equal(decision.trustLevel, 4);
  assert.equal(decision.effect, "deny"); // 4 < required 5
});

test("audit chain is hash-linked, tamper-evident, and independently verifiable", async () => {
  const { fed, control, audit, authKeyPriv } = await buildFederation();
  allowShout(control);
  await fed.federatedControlPlane.executeFederated(
    { identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }) },
    "cap.shout",
    "produce",
    { subject: "a" },
  );
  const exported = audit.export();
  assert.equal(FederatedAuditLog.verify(exported).ok, true);
  // Tamper: flip an effect in the exported chain -> verification must fail.
  const tampered = { ...exported, chain: exported.chain.map((c) => ({ ...c, entry: { ...c.entry, effect: "deny" as const } })) };
  assert.equal(FederatedAuditLog.verify(tampered).ok, false);
});

test("cross-node audit reconciliation detects effect-mismatch divergence (fail-closed)", async () => {
  const { fed } = await buildFederation();
  const localLog = new FederatedAuditLog("node-local");
  const remoteLog = new FederatedAuditLog("nodeB");
  const at = Date.now();
  localLog.record({ at, identityId: "nodeB::alice", capabilityId: "cap.shout", operation: "produce", effect: "allow", reason: "ok" });
  remoteLog.record({ at, identityId: "nodeB::alice", capabilityId: "cap.shout", operation: "produce", effect: "deny", reason: "no" });
  const result = fed.auditAuthorities.reconcile(localLog.export(), remoteLog.export());
  assert.equal(result.status, "divergent");
  assert.equal(result.failClosed, true);
  assert.equal(result.divergences.some((d) => d.class === "effect-mismatch"), true);
});

test("certification authority verifies a signed certification and rejects a forged one", async () => {
  const { fed } = await buildFederation();
  const caKeys = generateKeyPair();
  fed.keys.register("caKey", caKeys.publicKeyPem);
  fed.certificationAuthorities.register({ caId: "ca1", authorityId: "authB", keyRef: "caKey", chainMaxDepth: 1 });
  const now = Date.now();
  const cert = { certificationId: "c1", subject: "platform", caId: "ca1", issuedAt: now, expiresAt: now + 60_000 };
  const signed = { ...cert, signature: signPayload(cert, caKeys.privateKey) };
  assert.equal(fed.certificationAuthorities.verify(signed).ok, true);
  const forged = { ...cert, signature: "00" };
  assert.equal(fed.certificationAuthorities.verify(forged).ok, false);
});

test("policy delegation admits deny-only foreign policy and rejects foreign allow", async () => {
  const { fed } = await buildFederation();
  assert.equal(fed.policyDelegations.isAdmissibleForeignPolicy({ id: "f", effect: "deny", rules: [] }), true);
  assert.equal(fed.policyDelegations.isAdmissibleForeignPolicy({ id: "f", effect: "allow", rules: [] }), false);
  assert.throws(() => fed.policyDelegations.assertAdmissibleForeignPolicy({ id: "f", effect: "allow", rules: [] }));
});
