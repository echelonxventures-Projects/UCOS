import { test } from "node:test";
import assert from "node:assert/strict";
import { buildEvolution, appMetadataUnit } from "./evolution-harness.ts";
import { createUnit } from "../src/control/evolution/evolution-unit.ts";
import { mintProposal } from "../src/control/evolution/evolution-proposal.ts";
import { EvolutionGovernor, defaultGovernorConfig } from "../src/control/evolution/evolution-governor.ts";
import type { EvolutionProposal, EvolutionUnit } from "../src/control/evolution/types.ts";

function submit(evo: Awaited<ReturnType<typeof buildEvolution>>["evo"], priv: import("node:crypto").KeyObject, unit: EvolutionUnit, origin: "external" | "evolution-execution" = "external") {
  const proposal = mintProposal(priv, { proposalId: `p-${unit.unitId}`, unit, proposer: "pat", proposerKeyRef: "proposerKey", origin });
  return () => evo.orchestrator.submit(proposal);
}

// E10 — self-modification: evolution's own namespace is a non-expressible target.
test("E10 self-target of the evolution namespace is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const unit = createUnit({
    unitId: "u-self",
    title: "evolve evolution",
    changeClass: "sensitive",
    targets: [{ kind: "metadata", keyPrefix: "evolution:governor:config" }],
    ops: [{ op: "put-metadata", key: "evolution:governor:config", value: { disabled: true } }],
  });
  assert.throws(submit(evo, roleKeys.proposer, unit));
});

// E10 — core-dir code path prohibition.
test("E10 a unit declaring a prohibited core-dir codePath is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const unit = createUnit({
    unitId: "u-core",
    title: "touch meta-core",
    changeClass: "sensitive",
    targets: [{ kind: "metadata", keyPrefix: "app:x" }],
    ops: [{ op: "put-metadata", key: "app:x", value: 1 }],
    codePaths: ["src/meta-core/kernel.ts"],
  });
  assert.throws(submit(evo, roleKeys.proposer, unit));
});

// E10 — evolution self-dir code path prohibition.
test("E10 a unit declaring the evolution self-dir codePath is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const unit = createUnit({
    unitId: "u-selfdir",
    title: "touch evolution dir",
    changeClass: "sensitive",
    targets: [{ kind: "metadata", keyPrefix: "app:x" }],
    ops: [{ op: "put-metadata", key: "app:x", value: 1 }],
    codePaths: ["src/control/evolution/evolution-governor.ts"],
  });
  assert.throws(submit(evo, roleKeys.proposer, unit));
});

// E10 — deny-by-default: a non-allowlisted namespace is rejected.
test("E10 a non-allowlisted target namespace is rejected (deny-by-default)", async () => {
  const { evo, roleKeys } = await buildEvolution(["app:"]); // only app: is evolvable
  const unit = createUnit({
    unitId: "u-random",
    title: "random ns",
    changeClass: "routine",
    targets: [{ kind: "metadata", keyPrefix: "random:thing" }],
    ops: [{ op: "put-metadata", key: "random:thing", value: 1 }],
  });
  assert.throws(submit(evo, roleKeys.proposer, unit));
});

// E11 — depth must be 0.
test("E11 a unit with depth != 0 is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  const unit = { ...appMetadataUnit("u-depth"), depth: 1 } as EvolutionUnit; // raw (bypass createUnit validation)
  assert.throws(submit(evo, roleKeys.proposer, unit));
});

// E11 — proposals may not originate from evolution execution.
test("E11 a proposal originating from evolution execution is blocked", async () => {
  const { evo, roleKeys } = await buildEvolution();
  assert.throws(submit(evo, roleKeys.proposer, appMetadataUnit("u-origin"), "evolution-execution"));
});

// E11 — single in-flight transaction (re-entrancy blocked).
test("E11 admission is blocked while a transaction is in flight (maxInFlight=1)", async () => {
  const { evo, roleKeys } = await buildEvolution();
  assert.equal(evo.governor.acquire(), true); // simulate an in-flight apply
  assert.throws(submit(evo, roleKeys.proposer, appMetadataUnit("u-inflight")));
  assert.equal(evo.governor.acquire(), false); // second acquire refused
  evo.governor.release();
});

// E12 — sliding-window proposal rate limit (governor-level).
test("E12 proposal rate limit denies once the window is exceeded", () => {
  const cfg = defaultGovernorConfig(["app:"]);
  cfg.limits.maxProposalsPerWindow = 2;
  const gov = new EvolutionGovernor(cfg);
  const mk = (i: number): EvolutionProposal => ({
    proposalId: `p${i}`,
    unitHash: `h${i}`,
    unit: {
      unitId: `u${i}`,
      title: "t",
      changeClass: "routine",
      targets: [{ kind: "metadata", keyPrefix: "app:x" }],
      ops: [{ op: "put-metadata", key: "app:x", value: i }],
      depth: 0,
      codePaths: [],
    },
    proposer: "p",
    proposerKeyRef: "k",
    origin: "external",
    issuedAt: 0,
    expiresAt: 0,
    nonce: `n${i}`,
  });
  assert.equal(gov.admit(mk(1), 1000).ok, true);
  assert.equal(gov.admit(mk(2), 1000).ok, true);
  assert.equal(gov.admit(mk(3), 1000).ok, false); // rate exceeded
});

// E12 — emergency halt: all admissions fail closed.
test("E12 emergency halt denies all evolution admissions (fail-closed)", () => {
  const gov = new EvolutionGovernor(defaultGovernorConfig(["app:"]));
  gov.emergencyHalt("test halt");
  const p: EvolutionProposal = {
    proposalId: "p",
    unitHash: "h",
    unit: { unitId: "u", title: "t", changeClass: "routine", targets: [{ kind: "metadata", keyPrefix: "app:x" }], ops: [{ op: "put-metadata", key: "app:x", value: 1 }], depth: 0, codePaths: [] },
    proposer: "p",
    proposerKeyRef: "k",
    origin: "external",
    issuedAt: 0,
    expiresAt: 0,
    nonce: "n",
  };
  assert.equal(gov.admit(p).ok, false);
  assert.equal(gov.halted, true);
});
