import { test } from "node:test";
import assert from "node:assert/strict";
import { buildFederation, mintIdentity, mintTrust, allowShout } from "./federation-harness.ts";
import { AuthenticationError } from "../src/control/errors.ts";
import { generateKeyPair, signPayload } from "../src/control/federation/assertions.ts";

async function rejects(fn: () => Promise<unknown>): Promise<boolean> {
  try {
    await fn();
    return false;
  } catch {
    return true;
  }
}

// T1 — Cross-domain identity spoofing: assertion signed by an attacker key (not the authority's).
test("T1 cross-domain identity spoofing (forged signature) is blocked", async () => {
  const { fed, control } = await buildFederation();
  allowShout(control);
  const attacker = generateKeyPair(); // not registered as authB's key
  const bundle = { identity: mintIdentity(attacker.privateKey, { identityId: "alice", permissions: ["cap.shout:produce"] }) };
  assert.equal(
    await rejects(() => fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "x" })),
    true,
  );
});

// T2 — Trust poisoning: an authority with no trust delegation cannot confer trust (clamps to 0);
// and an over-asserted level is clamped to the boundary/delegation ceiling.
test("T2 trust poisoning is blocked (clamp to delegation/boundary ceiling)", async () => {
  const { fed, control, authKeyPriv } = await buildFederation({ boundaryMaxTrust: 3, delegationMax: 3 });
  allowShout(control, 10); // requires trust >= 10
  const bundle = {
    identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }),
    trust: mintTrust(authKeyPriv, { identityId: "alice", level: 1000 }),
  };
  const d = await fed.federatedControlPlane.authorizeFederated(bundle, "cap.shout", "produce");
  assert.equal(d.trustLevel, 3); // clamped
  assert.equal(d.effect, "deny");
});

// T7 — Replay: re-presenting the same signed assertion (same nonce) is rejected.
test("T7 replay / nonce reuse is blocked", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control);
  const bundle = { identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }) };
  await fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "1" }); // first use ok
  assert.equal(
    await rejects(() => fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "2" })),
    true, // nonce replay
  );
});

// Stale assertion rejection.
test("stale (expired) assertion is rejected", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control);
  const past = Date.now() - 10_000;
  const bundle = {
    identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"], issuedAt: past - 1000, expiresAt: past }),
  };
  assert.equal(await rejects(() => fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "x" })), true);
});

// T8 — Authority escalation: an authority lacking the "identity" power cannot issue identity assertions.
test("T8 authority escalation (missing power) is blocked", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control);
  // Downgrade authB to trust-only (no identity power).
  fed.authorities.register({ authorityId: "authB", nodeId: "nodeB", powers: ["trust"], scope: "*", keyRef: "keyB", status: "active" });
  const bundle = { identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }) };
  assert.equal(await rejects(() => fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "x" })), true);
});

// Trust boundary enforcement: an authority outside the boundary is not accepted.
test("out-of-boundary authority is rejected", async () => {
  const { fed, control } = await buildFederation();
  allowShout(control);
  const rogue = generateKeyPair();
  fed.keys.register("rogueKey", rogue.publicKeyPem);
  fed.authorities.register({ authorityId: "rogue", nodeId: "nodeB", powers: ["identity"], scope: "*", keyRef: "rogueKey" });
  // "rogue" is NOT a member of boundary b1.
  const bundle = { identity: mintIdentity(rogue.privateKey, { identityId: "alice", issuer: "rogue", permissions: ["cap.shout:produce"] }) };
  assert.equal(await rejects(() => fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "x" })), true);
});

// Authority verification: unknown issuer rejected.
test("unknown issuer is rejected", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control);
  const bundle = { identity: mintIdentity(authKeyPriv, { identityId: "alice", issuer: "ghost-authority", permissions: ["cap.shout:produce"] }) };
  assert.equal(await rejects(() => fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "x" })), true);
});

// Node lifecycle: suspended/expelled node cannot act; no membership => rejected.
test("suspended node is rejected", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control);
  fed.nodes.suspend("nodeB");
  const bundle = { identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }) };
  assert.equal(await rejects(() => fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "x" })), true);
});

test("revoked membership is rejected", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control);
  fed.memberships.revoke("m-nodeB");
  const bundle = { identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }) };
  assert.equal(await rejects(() => fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "x" })), true);
});

// T4/T11/T12 — Registry/metadata poisoning & capability impersonation: foreign identity is
// namespace-isolated and can NEVER shadow or leak into the local keyspace.
test("T4/T11/T12 foreign identity cannot shadow or poison local keyspace", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control);
  // A LOCAL privileged identity named "alice".
  control.identityRegistry.register({ id: "alice", kind: "user", status: "active", permissions: ["*"] });
  // Foreign node asserts an identity also called "alice" (namespaced nodeB::alice).
  await fed.federatedControlPlane.authorizeFederated(
    { identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }) },
    "cap.shout",
    "produce",
  );
  // The local identity is untouched; the foreign one lives under a namespaced id only.
  assert.deepEqual(control.identityRegistry.get("alice")?.permissions, ["*"]);
  assert.equal(control.identityRegistry.get("nodeB::alice"), undefined); // never leaked into local registry
});

// T6 — Partition: unreachable issuing authority fails closed.
test("T6 partition (unreachable authority) fails closed", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control);
  fed.partition.markUnreachable("authority:authB");
  const bundle = { identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }) };
  assert.equal(await rejects(() => fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "x" })), true);
});

// Revocation propagation: revoking a federated identity denies subsequent access (fail-closed).
test("revoked federated identity is denied on next decision", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control);
  const bundle = { identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }) };
  assert.equal(await fed.federatedControlPlane.executeFederated(bundle, "cap.shout", "produce", { subject: "ok" }), "OK!");
  fed.revocations.revoke("identity", "nodeB::alice", "revAuthority");
  // Re-authorize the already-materialized identity -> provider returns undefined -> authn fails.
  assert.equal(await rejects(() => fed.federatedControlPlane.authorizeFederated({ identity: mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.shout:produce"] }) }, "cap.shout", "produce")), true);
});

// T9 — Certification bypass: revoked CA cannot validate certifications.
test("T9 certification via revoked CA is rejected", async () => {
  const { fed } = await buildFederation();
  const caKeys = generateKeyPair();
  fed.keys.register("caKey", caKeys.publicKeyPem);
  fed.certificationAuthorities.register({ caId: "ca1", authorityId: "authB", keyRef: "caKey", chainMaxDepth: 1 });
  const now = Date.now();
  const cert = { certificationId: "c1", subject: "platform", caId: "ca1", issuedAt: now, expiresAt: now + 60_000 };
  const signed = { ...cert, signature: signPayload(cert, caKeys.privateKey) };
  assert.equal(fed.certificationAuthorities.verify(signed).ok, true);
  fed.certificationAuthorities.revoke("ca1");
  assert.equal(fed.certificationAuthorities.verify(signed).ok, false); // CA revoked
});

// T3 — Federated policy conflict: foreign policy may only deny (local sovereignty).
test("T3 foreign allow policy is inadmissible (deny-only)", async () => {
  const { fed } = await buildFederation();
  assert.throws(() => fed.policyDelegations.assertAdmissibleForeignPolicy({ id: "f", effect: "allow", rules: [] }));
  assert.doesNotThrow(() => fed.policyDelegations.assertAdmissibleForeignPolicy({ id: "f", effect: "deny", rules: [] }));
});

// Deny-by-default still governs a fully-verified federated principal lacking permission.
test("verified federated principal without permission is denied (deny-by-default preserved)", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control); // requires cap.shout:produce
  const bundle = { identity: mintIdentity(authKeyPriv, { identityId: "bob", permissions: ["cap.other:read"] }) };
  const d = await fed.federatedControlPlane.authorizeFederated(bundle, "cap.shout", "produce");
  assert.equal(d.effect, "deny");
});

// Tamper of the identity claims after signing invalidates the signature.
test("tampered claims (post-signature) invalidate the assertion", async () => {
  const { fed, control, authKeyPriv } = await buildFederation();
  allowShout(control);
  const idA = mintIdentity(authKeyPriv, { identityId: "alice", permissions: ["cap.other:read"] });
  const tampered = { ...idA, claims: { ...idA.claims, permissions: ["*"] } }; // escalate perms, keep old signature
  assert.equal(await rejects(() => fed.federatedControlPlane.executeFederated({ identity: tampered }, "cap.shout", "produce", { subject: "x" })), true);
});

void AuthenticationError;
