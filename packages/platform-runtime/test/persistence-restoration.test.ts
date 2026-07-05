/**
 * DEL-008 — State Restoration Verification Suite.
 *
 * Proves each authoritative port restores independently across restart and that derived indexes are
 * rebuilt, and that the Evolution Fabric remains the single governed mutation path with durable
 * outcomes. Covers AC-1, AC-3, AC-4, AC-5, AC-8, AC-9.
 *
 * AC-6 (no kernel modification) and AC-7 (no fabric logic modification) are evidenced structurally:
 * the durable ports implement the unchanged port contracts, and the full pre-existing test suite
 * passes unmodified. This suite adds the durability-specific evidence.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createSubstrate } from "../src/bootstrap.ts";
import type { ContractDescriptor } from "../src/contracts/types.ts";
import type { RegistryRecord } from "../src/meta-core/ports.ts";
import { createEvolution } from "../src/control/evolution/evolution-apply-orchestrator.ts";
import { generateKeyPair } from "../src/control/federation/assertions.ts";
import { appMetadataUnit, ratifyUnit, type EvoRoleKeys } from "./evolution-harness.ts";
import { bootDurable, freshDir, cleanup } from "./persistence-harness.ts";

test("metadata port restores its records independently (AC-1)", async () => {
  const dir = freshDir();
  try {
    const first = createSubstrate({ persistence: { directory: dir } });
    first.metadata.put("k:one", { a: 1 });
    first.metadata.put("k:two", { b: 2 });

    const second = createSubstrate({ persistence: { directory: dir } });
    assert.deepEqual(second.metadata.get("k:one")?.value, { a: 1 });
    assert.deepEqual(second.metadata.get("k:two")?.value, { b: 2 });
    assert.equal(second.metadata.query("k:").length, 2);
  } finally {
    cleanup(dir);
  }
});

test("registry port restores records and rebuilds the derived version index (AC-3, AC-5)", async () => {
  const dir = freshDir();
  try {
    const contract = (version: string): ContractDescriptor => ({
      kind: "contract",
      id: "contract.extra",
      version,
      operations: [{ name: "noop", input: { type: "object" }, output: { type: "object" } }],
    });
    const record = (version: string): RegistryRecord => ({
      id: "contract.extra",
      version,
      kind: "contract",
      descriptor: contract(version),
    });

    const first = createSubstrate({ persistence: { directory: dir } });
    first.registry.register(record("1.0.0"));
    first.registry.register(record("1.2.0"));
    first.registry.register(record("2.0.0"));

    const second = createSubstrate({ persistence: { directory: dir } });
    // Range resolution proves the derived version index was reconstructed from the log.
    assert.equal(second.registry.resolve("contract.extra", "^1.0.0")?.version, "1.2.0");
    assert.equal(second.registry.resolve("contract.extra", ">=1.0.0")?.version, "2.0.0");
    assert.equal(second.registry.list("contract").length, 3);
  } finally {
    cleanup(dir);
  }
});

test("registry restores after an unregister (append-only tombstone semantics) (AC-3, AC-9)", async () => {
  const dir = freshDir();
  try {
    const rec: RegistryRecord = {
      id: "contract.temp",
      version: "1.0.0",
      kind: "contract",
      descriptor: { kind: "contract", id: "contract.temp", version: "1.0.0", operations: [] },
    };
    const first = createSubstrate({ persistence: { directory: dir } });
    first.registry.register(rec);
    first.registry.unregister("contract.temp", "1.0.0");

    const second = createSubstrate({ persistence: { directory: dir } });
    assert.equal(second.registry.has("contract.temp"), false);
    assert.equal(second.registry.get("contract.temp", "1.0.0"), undefined);
  } finally {
    cleanup(dir);
  }
});

test("configuration port restores layered values and dynamic layer order (AC-4)", async () => {
  const dir = freshDir();
  try {
    const first = createSubstrate({ persistence: { directory: dir } });
    first.configuration.setLayer("default", "cap.x", { a: 1, nested: { p: 1 } });
    first.configuration.setLayer("environment", "cap.x", { nested: { q: 2 } });
    // A dynamically introduced (unknown) layer is appended to the order and must be preserved.
    first.configuration.setLayer("tenant", "cap.x", { a: 9 });

    const second = createSubstrate({ persistence: { directory: dir } });
    assert.deepEqual(second.configuration.resolve("cap.x"), { a: 9, nested: { p: 1, q: 2 } });
    assert.equal(second.configuration.layers().includes("tenant"), true);
  } finally {
    cleanup(dir);
  }
});

test("a durable runtime does NOT boot into empty state when durable state exists", async () => {
  const dir = freshDir();
  try {
    const first = createSubstrate({ persistence: { directory: dir } });
    first.metadata.put("present", { v: true });

    const second = createSubstrate({ persistence: { directory: dir } });
    assert.notEqual(second.metadata.get("present"), undefined);
  } finally {
    cleanup(dir);
  }
});

/** Wire the Evolution Fabric over a durable substrate with distinct role keys (separation of duties). */
async function buildDurableEvolution(dir: string) {
  const substrate = await bootDurable(dir);
  const evo = createEvolution(substrate, { nodeId: "node-local" });
  const proposerKeys = generateKeyPair();
  const certifierKeys = generateKeyPair();
  const ratifierKeys = generateKeyPair();
  evo.keys.register("proposerKey", proposerKeys.publicKeyPem);
  evo.keys.register("certifierKey", certifierKeys.publicKeyPem);
  evo.keys.register("ratifierKey", ratifierKeys.publicKeyPem);
  evo.certifications.register({ caId: "ca1", owner: "carol-certifier", keyRef: "certifierKey" });
  evo.ratifications.register({ raId: "ra1", owner: "rachel-ratifier", keyRef: "ratifierKey", quorum: 1 });
  const roleKeys: EvoRoleKeys = {
    proposer: proposerKeys.privateKey,
    certifier: certifierKeys.privateKey,
    ratifier: ratifierKeys.privateKey,
  };
  return { substrate, evo, roleKeys };
}

test("Evolution Fabric governed mutation persists and rehydrates (AC-8, AC-9)", async () => {
  const dir = freshDir();
  try {
    const { substrate, evo, roleKeys } = await buildDurableEvolution(dir);

    // Drive a governed change (write app:feature:flag) through the full lifecycle and apply it.
    const unit = appMetadataUnit("u-persist");
    const uh = ratifyUnit(evo, roleKeys, unit);
    const result = await evo.orchestrator.apply(uh);
    assert.equal(result.status, "applied");

    // The governed change landed in durable metadata via the Evolution Fabric (the only commit path).
    assert.deepEqual(substrate.metadata.get("app:feature:flag")?.value, { enabled: true });
    // The fabric's own governance records (proposal / certification / ratification) are durable too.
    assert.notEqual(substrate.metadata.get(`evolution:proposal:${uh}`), undefined);
    assert.notEqual(substrate.metadata.get(`evolution:certification:${uh}`), undefined);
    assert.notEqual(substrate.metadata.get(`evolution:ratification:${uh}`), undefined);

    // RESTART: a fresh runtime rehydrates the governed outcome and the governance trail.
    const restarted = await bootDurable(dir);
    assert.deepEqual(restarted.metadata.get("app:feature:flag")?.value, { enabled: true });
    assert.notEqual(restarted.metadata.get(`evolution:proposal:${uh}`), undefined);
    assert.notEqual(restarted.metadata.get(`evolution:ratification:${uh}`), undefined);
  } finally {
    cleanup(dir);
  }
});
