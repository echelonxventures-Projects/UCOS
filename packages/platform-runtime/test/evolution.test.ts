import { test } from "node:test";
import assert from "node:assert/strict";
import { buildEvolution, appMetadataUnit, configUnit, ratifyUnit } from "./evolution-harness.ts";
import { unitHash } from "../src/control/evolution/evolution-unit.ts";
import { canTransition } from "../src/control/evolution/evolution-lifecycle.ts";
import { EvolutionAuditLog } from "../src/control/evolution/evolution-audit-log.ts";

test("full lifecycle: a routine metadata evolution is proposed, ratified, and applied", async () => {
  const { substrate, evo, roleKeys } = await buildEvolution();
  const unit = appMetadataUnit("u-meta-1", "app:feature:flag", { enabled: true });
  const uh = ratifyUnit(evo, roleKeys, unit);
  const result = await evo.orchestrator.apply(uh);
  assert.equal(result.status, "applied");
  assert.equal(evo.orchestrator.state(uh), "active");
  assert.deepEqual(substrate.metadata.get("app:feature:flag")?.value, { enabled: true });
});

test("config evolution: effective configuration reflects the applied evolution-owned layer", async () => {
  const { substrate, evo, roleKeys } = await buildEvolution();
  const uh = ratifyUnit(evo, roleKeys, configUnit("u-cfg-1", { greeting: "hi" }));
  const result = await evo.orchestrator.apply(uh);
  assert.equal(result.status, "applied");
  assert.equal((substrate.kernel.configuration.resolve("cap.shout") as { greeting?: string }).greeting, "hi");
});

test("impact analysis reports the declared change surfaces before approval", async () => {
  const { evo } = await buildEvolution();
  const unit = appMetadataUnit("u-impact", "app:x", 1);
  const impact = evo.impactAnalyzer.analyze(unit);
  assert.ok(impact.metadataTargets.includes("app:x"));
  assert.equal(impact.changedCapabilities.length, 0);
});

test("state machine records the full ratification path", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const uh = ratifyUnit(evo, roleKeys, appMetadataUnit("u-states"));
  assert.equal(evo.orchestrator.state(uh), "ratified");
  await evo.orchestrator.apply(uh);
  assert.equal(evo.orchestrator.state(uh), "active");
});

test("lifecycle transition table forbids illegal transitions", () => {
  assert.equal(canTransition("proposed", "reviewed"), true);
  assert.equal(canTransition("applied", "rolled-back"), true);
  assert.equal(canTransition("rolled-back", "active"), false); // terminal
  assert.equal(canTransition("proposed", "applied"), false); // must pass gates
});

test("snapshot capture is deterministic and self-validating", async () => {
  const { evo } = await buildEvolution();
  const targets = [{ kind: "metadata" as const, keyPrefix: "app:" }];
  const snap = evo.snapshotEngine.snapshot("uh-x", targets);
  assert.equal(evo.snapshotEngine.validate(snap).ok, true);
  // Re-capture yields the same hash (no mutation between).
  assert.equal(evo.snapshotEngine.stateHash(evo.snapshotEngine.capture(targets)), snap.stateHash);
});

test("two sequential evolutions apply and the monotonic proposal counter advances", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const uh1 = ratifyUnit(evo, roleKeys, appMetadataUnit("u-seq-1", "app:a", 1), { proposer: "pat-proposer" });
  await evo.orchestrator.apply(uh1);
  const uh2 = ratifyUnit(evo, roleKeys, appMetadataUnit("u-seq-2", "app:b", 2), { proposer: "pat-proposer" });
  const r2 = await evo.orchestrator.apply(uh2);
  assert.equal(r2.status, "applied");
  assert.equal(evo.governor.proposalCount, 2);
});

test("evolution audit chain is hash-linked, tamper-evident, and independently verifiable", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const uh = ratifyUnit(evo, roleKeys, appMetadataUnit("u-audit"));
  await evo.orchestrator.apply(uh);
  const exported = evo.audit.export();
  assert.equal(EvolutionAuditLog.verify(exported).ok, true);
  const tampered = { ...exported, chain: exported.chain.map((c) => ({ ...c, entry: { ...c.entry, event: "APPLIED" as const } })) };
  // Flipping any entry breaks the recomputed hash (unless already APPLIED); force a real change:
  const forced = {
    ...exported,
    chain: exported.chain.map((c, i) => (i === 0 ? { ...c, entry: { ...c.entry, actor: "attacker" } } : c)),
  };
  assert.equal(EvolutionAuditLog.verify(forced).ok, false);
  void tampered;
});

test("cross-node audit reconciliation: consistent for identical, divergent for state-hash mismatch", async () => {
  const localLog = new EvolutionAuditLog("node-local");
  const remoteLog = new EvolutionAuditLog("node-remote");
  localLog.record({ at: 1, event: "APPLIED", unitHash: "uh1", actor: "a", detail: "", stateHash: "H1" });
  remoteLog.record({ at: 1, event: "APPLIED", unitHash: "uh1", actor: "a", detail: "", stateHash: "H2" });
  const res = EvolutionAuditLog.reconcile(localLog.export(), remoteLog.export());
  assert.equal(res.status, "divergent");
  assert.equal(res.failClosed, true);
  assert.ok(res.divergences.some((d) => d.class === "state-hash-mismatch"));
});
