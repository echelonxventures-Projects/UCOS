/**
 * CGR-CORE-04 verification — constitutional-governance composition root.
 * Proves: deterministic composition; registry wiring (all 11 present + resolver); resolver wiring
 * (cross-registry existence); fail-closed startup (zero records + genesis chain); audit wiring
 * (RG-8 emissions extend the chain); and the hard scope guard (no ACTIVE, no authority originated).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  composeConstitutionalGovernance,
  assertFailClosedStartup,
} from "../../../src/control/constitutional-governance/composition-root.ts";
import { GENESIS_PREV_HASH } from "../../../src/control/constitutional-governance/audit-chain.ts";
import { verifyChain } from "../../../src/control/constitutional-governance/audit-verifier.ts";
import { CgValidationError } from "../../../src/control/constitutional-governance/append-only.ts";
import { REGISTRY_NAMES } from "../../../src/control/constitutional-governance/types.ts";
import { fixedClock } from "../../../src/control/constitutional-governance/test-harness.ts";

test("CORE-04: fail-closed startup — composition originates nothing (0 records, genesis chain)", () => {
  const cg = composeConstitutionalGovernance();
  for (const name of REGISTRY_NAMES) {
    assert.equal(cg.registry(name).size(), 0, `${name} must be empty at startup`);
  }
  assert.equal(cg.auditChain.size(), 0);
  assert.equal(cg.auditChain.head(), GENESIS_PREV_HASH);
});

test("CORE-04: registry wiring — all eleven registries are composed and resolvable by name", () => {
  const cg = composeConstitutionalGovernance();
  assert.equal(REGISTRY_NAMES.length, 11);
  for (const name of REGISTRY_NAMES) {
    assert.equal(cg.registry(name).registry, name);
  }
  // Named accessors line up with the resolver.
  assert.equal(cg.principles, cg.registry("REG-PRIN"));
  assert.equal(cg.audit, cg.registry("REG-AUDIT"));
  assert.equal(cg.traces, cg.registry("REG-TRACE"));
});

test("CORE-04: registry resolver is fail-closed on an unknown name", () => {
  const cg = composeConstitutionalGovernance();
  assert.throws(
    () => cg.registry("REG-NOPE" as unknown as (typeof REGISTRY_NAMES)[number]),
    CgValidationError,
  );
});

test("CORE-04: deterministic composition — two compositions produce identical hashes for identical work", () => {
  const build = () => {
    const cg = composeConstitutionalGovernance({ clock: fixedClock() });
    const p = cg.principles.propose({
      logicalId: "PCAMG-PRIN-001",
      version: "1.0.0",
      ownerAuthority: "board",
      content: { statement: "Sovereignty Origin = Invariant Principles" },
      createdBy: "board",
    });
    return { cg, p };
  };
  const a = build();
  const b = build();
  assert.equal(a.p.contentHash, b.p.contentHash);
  assert.equal(a.p.recordUuid, b.p.recordUuid);
  // Audit chains are hash-identical too (deterministic clock ⇒ identical audit events).
  assert.equal(a.cg.auditChain.head(), b.cg.auditChain.head());
});

test("CORE-04: resolver wiring — cross-registry references resolve through composed heads", () => {
  const cg = composeConstitutionalGovernance({ clock: fixedClock() });
  cg.principles.propose({ logicalId: "PCAMG-PRIN-001", version: "1.0.0", ownerAuthority: "board", content: { statement: "P1" }, createdBy: "board" });
  cg.centers.propose({ logicalId: "PGC-ROOT", version: "1.0.0", ownerAuthority: "board", content: {}, createdBy: "board", upTrace: ["PCAMG-PRIN-001"] });
  cg.domains.propose({ logicalId: "PDC-GOV", version: "1.0.0", ownerAuthority: "PGC-ROOT", content: { centerRef: "PGC-ROOT" }, createdBy: "board", upTrace: ["PCAMG-PRIN-001"] });
  cg.policies.propose({ logicalId: "POL-1", version: "1.0.0", ownerAuthority: "PDC-GOV", content: { domainRef: "PDC-GOV", effect: "deny" }, createdBy: "board", upTrace: ["PCAMG-PRIN-001"] });

  // META up-trace must resolve to an existing principle (resolver wired).
  const m = cg.meta.propose({ logicalId: "PCAMG-META-I", version: "1.0.0", ownerAuthority: "board", content: { article: "Supremacy" }, createdBy: "board", upTrace: ["PCAMG-PRIN-001"] });
  assert.equal(m.upTrace[0], "PCAMG-PRIN-001");
  assert.throws(() => cg.meta.propose({ logicalId: "PCAMG-META-II", version: "1.0.0", ownerAuthority: "board", content: { article: "x" }, createdBy: "board", upTrace: ["PCAMG-PRIN-999"] }), CgValidationError);

  // CAP resolves domainRef + policyRef; a dangling ref is rejected (deny-by-default).
  const cap = cg.capabilities.propose({ logicalId: "CAP-01", version: "1.0.0", ownerAuthority: "PDC-GOV", content: { domainRef: "PDC-GOV", policyRef: "POL-1" }, createdBy: "board", upTrace: ["PCAMG-PRIN-001"] });
  assert.equal(cap.content["policyRef"], "POL-1");
  assert.throws(() => cg.capabilities.propose({ logicalId: "CAP-02", version: "1.0.0", ownerAuthority: "PDC-GOV", content: { domainRef: "PDC-GOV", policyRef: "POL-MISSING" }, createdBy: "board", upTrace: ["PCAMG-PRIN-001"] }), CgValidationError);
});

test("CORE-04: audit wiring — every RG-8 emission extends the tamper-evident chain, verifiably", () => {
  const cg = composeConstitutionalGovernance({ clock: fixedClock() });
  cg.principles.propose({ logicalId: "PCAMG-PRIN-001", version: "1.0.0", ownerAuthority: "board", content: { statement: "P1" }, createdBy: "board" });
  cg.principles.supersede({ logicalId: "PCAMG-PRIN-001", priorVersion: "1.0.0", version: "1.0.1", ownerAuthority: "board", content: { statement: "P1" }, createdBy: "board" });
  assert.equal(cg.auditChain.size(), 2, "one chain entry per emission (propose + supersede)");
  const verdict = verifyChain(cg.auditChain.entries());
  assert.equal(verdict.valid, true);
  assert.equal(verdict.checked, 2);
});

test("CORE-04: dependency composition — an injected log factory is honored per registry", () => {
  let created = 0;
  const cg = composeConstitutionalGovernance({
    clock: fixedClock(),
    logFactory: () => {
      created += 1;
      // Reuse the platform in-memory log via the composed default is not accessible here; use a
      // minimal conformant log to prove the seam is called exactly once per registry.
      const records: { v: number; seq: number; event: unknown }[] = [];
      return {
        append(event: unknown) {
          const seq = records.length;
          records.push({ v: 1, seq, event });
          return seq;
        },
        readAll() {
          return [...records];
        },
        size() {
          return records.length;
        },
      };
    },
  });
  assert.equal(created, 11, "exactly one fresh log per registry (11)");
  assert.equal(cg.principles.size(), 0);
});

test("CORE-04: scope guard — no ACTIVE state and no authority originated at startup", () => {
  const cg = composeConstitutionalGovernance();
  // Fail-closed startup must hold on the freshly composed runtime.
  assert.doesNotThrow(() => assertFailClosedStartup(cg));
  // Every registry projects only proposed|superseded — ACTIVE is never representable.
  const p = cg.principles.propose({ logicalId: "PCAMG-PRIN-001", version: "1.0.0", ownerAuthority: "board", content: { statement: "P1" }, createdBy: "board" });
  assert.ok(p.status === "proposed" || p.status === "superseded");
  assert.notEqual(p.status as string, "active");
});

test("CORE-04: assertFailClosedStartup rejects a runtime that already originated a record", () => {
  const cg = composeConstitutionalGovernance();
  cg.principles.propose({ logicalId: "PCAMG-PRIN-001", version: "1.0.0", ownerAuthority: "board", content: { statement: "P1" }, createdBy: "board" });
  // Re-asserting startup on a non-empty runtime must fail closed.
  assert.throws(() => assertFailClosedStartup(cg), CgValidationError);
});
