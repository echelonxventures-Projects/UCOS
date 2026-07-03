import { test } from "node:test";
import assert from "node:assert/strict";
import { buildEvolution, appMetadataUnit, ratifyUnit } from "./evolution-harness.ts";
import { createUnit, unitHash } from "../src/control/evolution/evolution-unit.ts";
import { mintProposal } from "../src/control/evolution/evolution-proposal.ts";
import { EvolutionAuditLog } from "../src/control/evolution/evolution-audit-log.ts";
import { generateKeyPair } from "../src/control/federation/assertions.ts";
import type { EvolutionUnit } from "../src/control/evolution/types.ts";

async function rejects(fn: () => Promise<unknown>): Promise<boolean> {
  try {
    await fn();
    return false;
  } catch {
    return true;
  }
}

function fedNoteUnit(id: string): EvolutionUnit {
  return createUnit({
    unitId: id,
    title: "federation note",
    changeClass: "federation-touching",
    targets: [{ kind: "metadata", keyPrefix: "federation:note:x" }],
    ops: [{ op: "put-metadata", key: "federation:note:x", value: { note: "hi" } }],
  });
}

// 1 — Unauthorized evolution: applying a unit that was never ratified.
test("unauthorized evolution (unratified apply) is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const unit = appMetadataUnit("u-unauth");
  const proposal = mintProposal(roleKeys.proposer, { proposalId: "p", unit, proposer: "pat", proposerKeyRef: "proposerKey" });
  evo.orchestrator.submit(proposal); // reviewed only
  assert.equal(await rejects(() => evo.orchestrator.apply(unitHash(unit))), true);
});

// 2 — Forged proposal: signed by an attacker key not bound to the proposer keyRef.
test("forged proposal signature is blocked", async () => {
  const { evo } = await buildEvolution();
  const attacker = generateKeyPair();
  const unit = appMetadataUnit("u-forged");
  const proposal = mintProposal(attacker.privateKey, { proposalId: "p", unit, proposer: "pat", proposerKeyRef: "proposerKey" });
  assert.throws(() => evo.orchestrator.submit(proposal));
});

// 3 — Forged certification: signed by the wrong key.
test("forged certification is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const unit = appMetadataUnit("u-forgedcert");
  const uh = unitHash(unit);
  const proposal = mintProposal(roleKeys.proposer, { proposalId: "p", unit, proposer: "pat", proposerKeyRef: "proposerKey" });
  evo.orchestrator.submit(proposal);
  evo.orchestrator.approve(uh, "alan-approver");
  const forgedCert = evo.certifications.issue(roleKeys.ratifier, { unitHash: uh, caId: "ca1" }); // wrong key
  assert.throws(() => evo.orchestrator.recordCertification(forgedCert));
});

// 4 — Replay: re-submitting the same signed proposal (nonce reuse).
test("proposal replay / nonce reuse is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const unit = appMetadataUnit("u-replay");
  const proposal = mintProposal(roleKeys.proposer, { proposalId: "p", unit, proposer: "pat", proposerKeyRef: "proposerKey" });
  evo.orchestrator.submit(proposal);
  assert.throws(() => evo.orchestrator.submit(proposal)); // nonce replay
});

// 5 — Stale proposal: expired freshness window.
test("stale (expired) proposal is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const unit = appMetadataUnit("u-stale");
  const past = Date.now() - 10_000;
  const proposal = mintProposal(roleKeys.proposer, {
    proposalId: "p",
    unit,
    proposer: "pat",
    proposerKeyRef: "proposerKey",
    issuedAt: past - 1000,
    expiresAt: past,
  });
  assert.throws(() => evo.orchestrator.submit(proposal));
});

// 6 — Governor bypass: a non-allowlisted namespace (deny-by-default).
test("governor bypass via non-allowlisted namespace is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution(["app:"]);
  const unit = createUnit({
    unitId: "u-bypass",
    title: "random ns",
    changeClass: "routine",
    targets: [{ kind: "metadata", keyPrefix: "secret:keys" }],
    ops: [{ op: "put-metadata", key: "secret:keys", value: 1 }],
  });
  const proposal = mintProposal(roleKeys.proposer, { proposalId: "p", unit, proposer: "pat", proposerKeyRef: "proposerKey" });
  assert.throws(() => evo.orchestrator.submit(proposal));
});

// 7 — Self-modification: a prohibited core-dir codePath.
test("self-modification attempt (core-dir codePath) is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const unit = createUnit({
    unitId: "u-selfmod",
    title: "touch core",
    changeClass: "sensitive",
    targets: [{ kind: "metadata", keyPrefix: "app:x" }],
    ops: [{ op: "put-metadata", key: "app:x", value: 1 }],
    codePaths: ["src/meta-core/ports.ts"],
  });
  const proposal = mintProposal(roleKeys.proposer, { proposalId: "p", unit, proposer: "pat", proposerKeyRef: "proposerKey" });
  assert.throws(() => evo.orchestrator.submit(proposal));
});

// 8 — Recursive evolution: proposal originating from evolution execution.
test("recursive evolution attempt (self-originated proposal) is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const unit = appMetadataUnit("u-recurse");
  const proposal = mintProposal(roleKeys.proposer, { proposalId: "p", unit, proposer: "pat", proposerKeyRef: "proposerKey", origin: "evolution-execution" });
  assert.throws(() => evo.orchestrator.submit(proposal));
});

// 9 — Infinite-loop attempt: re-entrant admission while a transaction is in flight.
test("infinite-loop / re-entrancy attempt is blocked (maxInFlight=1)", async () => {
  const { evo, roleKeys } = await buildEvolution();
  assert.equal(evo.governor.acquire(), true);
  const unit = appMetadataUnit("u-loop");
  const proposal = mintProposal(roleKeys.proposer, { proposalId: "p", unit, proposer: "pat", proposerKeyRef: "proposerKey" });
  assert.throws(() => evo.orchestrator.submit(proposal));
  evo.governor.release();
});

// 10 — Rollback abuse: rolling back a unit that is not active / unknown.
test("rollback abuse (rolling back a non-active/unknown unit) is blocked", async () => {
  const { evo } = await buildEvolution();
  assert.equal(await rejects(() => evo.orchestrator.rollback("nonexistent-hash")), true);
});

// 11 — Federation-boundary mutation: federation-touching apply without a re-ratification token.
test("federation-touching evolution without a re-ratification token is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const uh = ratifyUnit(evo, roleKeys, fedNoteUnit("u-fed"));
  assert.equal(await rejects(() => evo.orchestrator.apply(uh)), true); // no token => fail-closed
});

// 12 — Ratification bypass: applying a certified-but-not-ratified unit.
test("ratification bypass (certified but not ratified) is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const unit = appMetadataUnit("u-ratbypass");
  const uh = unitHash(unit);
  const proposal = mintProposal(roleKeys.proposer, { proposalId: "p", unit, proposer: "pat", proposerKeyRef: "proposerKey" });
  evo.orchestrator.submit(proposal);
  evo.orchestrator.approve(uh, "alan-approver");
  const cert = evo.certifications.issue(roleKeys.certifier, { unitHash: uh, caId: "ca1" });
  evo.orchestrator.recordCertification(cert); // certified, NOT ratified
  assert.equal(await rejects(() => evo.orchestrator.apply(uh)), true);
});

// 13 — Audit tampering: any mutation of the exported chain fails verification.
test("audit tampering is detected", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const uh = ratifyUnit(evo, roleKeys, appMetadataUnit("u-audittamper"));
  await evo.orchestrator.apply(uh);
  const exported = evo.audit.export();
  const tampered = {
    ...exported,
    chain: exported.chain.map((c, i) => (i === 0 ? { ...c, entry: { ...c.entry, actor: "attacker" } } : c)),
  };
  assert.equal(EvolutionAuditLog.verify(tampered).ok, false);
});

// 14 — Partial-commit attempt: a failed apply leaves NOTHING committed.
test("partial-commit attempt leaves no residue (atomic all-or-nothing)", async () => {
  const { substrate, evo, roleKeys } = await buildEvolution();
  const uh = ratifyUnit(evo, roleKeys, appMetadataUnit("u-partial", "app:partial", { x: 1 }));
  const r = await evo.orchestrator.apply(uh, { validator: () => ({ ok: false, reason: "abort" }) });
  assert.equal(r.status, "rolled-back");
  const rec = substrate.metadata.get("app:partial");
  assert.ok(rec === undefined || (rec.value as { __evoTombstone?: boolean }).__evoTombstone === true);
});

// 15 — Snapshot corruption: a corrupted snapshot fails validation (apply must fail closed).
test("snapshot corruption is detected by validation", async () => {
  const { evo } = await buildEvolution();
  const snap = evo.snapshotEngine.snapshot("uh-corrupt", [{ kind: "metadata", keyPrefix: "app:" }]);
  const corrupted = { ...snap, capture: { ...snap.capture, metadata: [{ key: "app:injected", value: "evil" }] } };
  assert.equal(evo.snapshotEngine.validate(corrupted).ok, false);
});

// 16 — Restore corruption: rollback verification detects a state that does not match the snapshot.
test("restore corruption is detected by rollback verification", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const uh = ratifyUnit(evo, roleKeys, appMetadataUnit("u-restore", "app:restore", 1));
  await evo.orchestrator.apply(uh);
  const targets = [{ kind: "metadata" as const, keyPrefix: "app:restore" }];
  assert.equal(evo.rollbackEngine.verify(targets, "not-the-real-hash").ok, false);
});
