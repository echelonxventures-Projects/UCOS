import { test } from "node:test";
import assert from "node:assert/strict";
import { buildEvolution, appMetadataUnit, configUnit, ratifyUnit, shoutCapability } from "./evolution-harness.ts";
import { createUnit } from "../src/control/evolution/evolution-unit.ts";

test("post-apply validation failure rolls back atomically (no partial commit)", async () => {
  const { substrate, evo, roleKeys } = await buildEvolution();
  const uh = ratifyUnit(evo, roleKeys, appMetadataUnit("u-rb-1", "app:rb", { v: 1 }));
  const result = await evo.orchestrator.apply(uh, { validator: () => ({ ok: false, reason: "forced failure" }) });
  assert.equal(result.status, "rolled-back");
  assert.equal(evo.orchestrator.state(uh), "failed");
  // Metadata key never existed before -> restored to logically absent (tombstoned).
  const rec = substrate.metadata.get("app:rb");
  assert.ok(rec === undefined || (rec.value as { __evoTombstone?: boolean }).__evoTombstone === true);
  // Deterministic restoration: pre and post state hashes are equal.
  assert.equal(result.preStateHash, result.postStateHash);
});

test("a throwing op mid-apply reverts all earlier ops (fail-closed, no partial commit)", async () => {
  const { substrate, evo, roleKeys } = await buildEvolution();
  // Re-loading an already-registered descriptor throws synchronously during apply (registry conflict).
  const unit = createUnit({
    unitId: "u-rb-multi",
    title: "metadata then conflicting descriptor",
    changeClass: "sensitive",
    targets: [
      { kind: "metadata", keyPrefix: "app:multi" },
      { kind: "registry", id: "cap.shout" },
    ],
    ops: [
      { op: "put-metadata", key: "app:multi", value: { first: true } },
      { op: "load-descriptor", descriptor: shoutCapability }, // cap.shout@1.0.0 already exists -> throws
    ],
  });
  const uh = ratifyUnit(evo, roleKeys, unit);
  const result = await evo.orchestrator.apply(uh);
  assert.equal(result.status, "rolled-back");
  // First op reverted:
  const rec = substrate.metadata.get("app:multi");
  assert.ok(rec === undefined || (rec.value as { __evoTombstone?: boolean }).__evoTombstone === true);
});

test("explicit rollback of an active evolution restores prior state and verifies", async () => {
  const { substrate, evo, roleKeys } = await buildEvolution();
  const uh = ratifyUnit(evo, roleKeys, configUnit("u-rb-cfg", { greeting: "hola" }));
  const applied = await evo.orchestrator.apply(uh);
  assert.equal(applied.status, "applied");
  assert.equal((substrate.kernel.configuration.resolve("cap.shout") as { greeting?: string }).greeting, "hola");

  const rolled = await evo.orchestrator.rollback(uh);
  assert.equal(rolled.status, "rolled-back");
  assert.equal(evo.orchestrator.state(uh), "rolled-back");
  // Effective config restored (evolution layer emptied).
  assert.equal((substrate.kernel.configuration.resolve("cap.shout") as { greeting?: string }).greeting, undefined);
  assert.equal(rolled.preStateHash, rolled.postStateHash);
});

test("rollback verification detects a non-matching restored state (fail-closed detection)", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const uh = ratifyUnit(evo, roleKeys, appMetadataUnit("u-rb-verify", "app:verify", 1));
  await evo.orchestrator.apply(uh);
  // Verifying restoration against a wrong expected hash must fail (the control that guards restore).
  const targets = [{ kind: "metadata" as const, keyPrefix: "app:verify" }];
  assert.equal(evo.rollbackEngine.verify(targets, "deadbeef").ok, false);
});

test("a rolled-back (failed) evolution did not take effect and cannot be applied again", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const uh = ratifyUnit(evo, roleKeys, appMetadataUnit("u-rb-final", "app:final", 1));
  const r = await evo.orchestrator.apply(uh, { validator: () => ({ ok: false, reason: "nope" }) });
  assert.equal(r.status, "rolled-back");
  // State is terminal "failed"; re-applying throws (not ratified anymore).
  await assert.rejects(() => evo.orchestrator.apply(uh));
});
