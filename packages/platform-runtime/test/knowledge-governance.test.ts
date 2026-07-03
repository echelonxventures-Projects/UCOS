import { test } from "node:test";
import assert from "node:assert/strict";
import { buildKnowledge } from "./knowledge-harness.ts";
import { NonceCache } from "../src/control/federation/assertions.ts";

test("a valid certification verifies; a revoked CA no longer validates", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const cert = know.certifications.issue(roleKeys.certifier, { unitHash: "uh-gov-1", caId: "kca1" });
  assert.equal(know.certifications.verify(cert).ok, true);
  know.certifications.revoke("kca1");
  assert.equal(know.certifications.verify(cert).ok, false);
});

test("ratification enforces separation of duties (ratifier != certifier)", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const cert = know.certifications.issue(roleKeys.certifier, { unitHash: "uh-gov-2", caId: "kca1" });
  // certifier set to the ratifier's own principal => SoD violation.
  const badRat = know.ratifications.issue(roleKeys.ratifier, {
    unitHash: "uh-gov-2",
    raId: "kra1",
    author: "aaron-author",
    validators: ["victor-validator"],
    certifier: "rachel-ratifier", // == ratifier owner
    certificationId: cert.certificationId,
  });
  assert.equal(know.ratifications.verify(badRat).ok, false);
});

test("ratification enforces the validator quorum", async () => {
  const { know, roleKeys } = await buildKnowledge();
  know.ratifications.register({ raId: "kra2", owner: "rachel-ratifier", keyRef: "know-rat-key", quorum: 2 });
  const cert = know.certifications.issue(roleKeys.certifier, { unitHash: "uh-gov-3", caId: "kca1" });
  const rat = know.ratifications.issue(roleKeys.ratifier, {
    unitHash: "uh-gov-3",
    raId: "kra2",
    author: "aaron-author",
    validators: ["victor-validator"], // only 1 < quorum 2
    certifier: "carol-certifier",
    certificationId: cert.certificationId,
  });
  assert.equal(know.ratifications.verify(rat).ok, false);
});

test("a well-formed ratification with distinct roles + quorum verifies", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const cert = know.certifications.issue(roleKeys.certifier, { unitHash: "uh-gov-4", caId: "kca1" });
  const rat = know.ratifications.issue(roleKeys.ratifier, {
    unitHash: "uh-gov-4",
    raId: "kra1",
    author: "aaron-author",
    validators: ["victor-validator"],
    certifier: "carol-certifier",
    certificationId: cert.certificationId,
  });
  assert.equal(know.ratifications.verify(rat).ok, true);
});

test("authority requires enumerated powers (no implicit authority)", async () => {
  const { know } = await buildKnowledge();
  know.registry.registerAuthority({ authorityId: "auth-x", owner: "x", powers: ["certify"], keyRef: "know-cert-key", scope: "*" });
  assert.equal(know.registry.hasPower("auth-x", "certify"), true);
  assert.equal(know.registry.hasPower("auth-x", "ratify"), false);
  assert.equal(know.registry.hasPower("unknown", "certify"), false); // fail-closed
});

test("certification replay (nonce reuse) is rejected", async () => {
  const { know, roleKeys } = await buildKnowledge();
  const nonces = new NonceCache();
  const cert = know.certifications.issue(roleKeys.certifier, { unitHash: "uh-gov-5", caId: "kca1" });
  assert.equal(know.certifications.verify(cert, { nonces }).ok, true);
  assert.equal(know.certifications.verify(cert, { nonces }).ok, false); // replay
});
