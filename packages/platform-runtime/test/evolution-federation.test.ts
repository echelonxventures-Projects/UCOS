import { test } from "node:test";
import assert from "node:assert/strict";
import type { KeyObject } from "node:crypto";
import { buildEvolution, ratifyUnit } from "./evolution-harness.ts";
import { createUnit } from "../src/control/evolution/evolution-unit.ts";
import type { EvolutionUnit, FederationReRatificationToken } from "../src/control/evolution/types.ts";
import { generateKeyPair, signPayload, newNonce } from "../src/control/federation/assertions.ts";
import type { TrustBoundaryRecord } from "../src/control/federation/types.ts";

function boundary(maxTrustLevel: number): TrustBoundaryRecord {
  return { boundaryId: "b1", members: [], defaultEffect: "deny", maxTrustLevel, acceptedAssertionTypes: [] };
}

function fedUnit(id: string, key: string, value: unknown): EvolutionUnit {
  return createUnit({
    unitId: id,
    title: `federation write ${key}`,
    changeClass: "federation-touching",
    targets: [{ kind: "metadata", keyPrefix: key }],
    ops: [{ op: "put-metadata", key, value }],
  });
}

function mintToken(priv: KeyObject, opts: { scope: string; issuerKeyRef: string; expiresAt?: number }): FederationReRatificationToken {
  const now = Date.now();
  const base: Omit<FederationReRatificationToken, "signature"> = {
    tokenId: "tok-1",
    scope: opts.scope,
    issuerKeyRef: opts.issuerKeyRef,
    issuedAt: now,
    expiresAt: opts.expiresAt ?? now + 300_000,
    nonce: newNonce(),
  };
  return { ...base, signature: signPayload(base, priv) };
}

test("isFederationTouching detects any federation-namespace target", async () => {
  const { evo } = await buildEvolution();
  assert.equal(evo.federationGuard.isFederationTouching(fedUnit("u", "federation:note:x", 1)), true);
  assert.equal(
    evo.federationGuard.isFederationTouching(
      createUnit({ unitId: "u2", title: "app", changeClass: "routine", targets: [{ kind: "metadata", keyPrefix: "app:x" }], ops: [{ op: "put-metadata", key: "app:x", value: 1 }] }),
    ),
    false,
  );
});

test("federation-touching evolution WITH a valid re-ratification token applies (no boundary weakened)", async () => {
  const { substrate, evo, roleKeys } = await buildEvolution();
  substrate.metadata.put("federation:boundary:b1", boundary(5));
  const tokenKeys = generateKeyPair();
  evo.keys.register("fedTokenKey", tokenKeys.publicKeyPem);

  const uh = ratifyUnit(evo, roleKeys, fedUnit("u-fed-ok", "federation:note:hello", { note: "hi" }));
  const token = mintToken(tokenKeys.privateKey, { scope: "federation:*", issuerKeyRef: "fedTokenKey" });
  const result = await evo.orchestrator.apply(uh, { reRatificationToken: token });
  assert.equal(result.status, "applied");
  assert.deepEqual(substrate.metadata.get("federation:note:hello")?.value, { note: "hi" });
  // Boundary untouched.
  assert.equal((substrate.metadata.get("federation:boundary:b1")?.value as TrustBoundaryRecord).maxTrustLevel, 5);
});

test("a token does NOT permit silently weakening a ratified boundary (auto-rollback on regression)", async () => {
  const { substrate, evo, roleKeys } = await buildEvolution();
  substrate.metadata.put("federation:boundary:b1", boundary(5));
  const tokenKeys = generateKeyPair();
  evo.keys.register("fedTokenKey", tokenKeys.publicKeyPem);

  // Attempt to raise the trust ceiling from 5 to 100.
  const uh = ratifyUnit(evo, roleKeys, fedUnit("u-fed-weaken", "federation:boundary:b1", boundary(100)));
  const token = mintToken(tokenKeys.privateKey, { scope: "federation:*", issuerKeyRef: "fedTokenKey" });
  const result = await evo.orchestrator.apply(uh, { reRatificationToken: token });
  assert.equal(result.status, "rolled-back"); // invariant violation => auto-rollback
  // Boundary restored to its original ceiling.
  assert.equal((substrate.metadata.get("federation:boundary:b1")?.value as TrustBoundaryRecord).maxTrustLevel, 5);
});

test("federation-touching evolution with an invalidly-signed token is blocked", async () => {
  const { substrate, evo, roleKeys } = await buildEvolution();
  substrate.metadata.put("federation:boundary:b1", boundary(5));
  const tokenKeys = generateKeyPair();
  const attacker = generateKeyPair();
  evo.keys.register("fedTokenKey", tokenKeys.publicKeyPem);

  const uh = ratifyUnit(evo, roleKeys, fedUnit("u-fed-badtok", "federation:note:x", 1));
  const badToken = mintToken(attacker.privateKey, { scope: "federation:*", issuerKeyRef: "fedTokenKey" }); // wrong key
  await assert.rejects(() => evo.orchestrator.apply(uh, { reRatificationToken: badToken }));
});

test("federation-touching evolution with an expired token is blocked", async () => {
  const { substrate, evo, roleKeys } = await buildEvolution();
  substrate.metadata.put("federation:boundary:b1", boundary(5));
  const tokenKeys = generateKeyPair();
  evo.keys.register("fedTokenKey", tokenKeys.publicKeyPem);

  const uh = ratifyUnit(evo, roleKeys, fedUnit("u-fed-exptok", "federation:note:y", 1));
  const past = Date.now() - 10_000;
  const expired = mintToken(tokenKeys.privateKey, { scope: "federation:*", issuerKeyRef: "fedTokenKey", expiresAt: past });
  await assert.rejects(() => evo.orchestrator.apply(uh, { reRatificationToken: expired }));
});
