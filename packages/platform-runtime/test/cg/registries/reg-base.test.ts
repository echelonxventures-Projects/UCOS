/**
 * CGR-REG-base verification — RG-1..8 enforced centrally.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { ConstitutionalRegistry } from "../../../src/control/constitutional-governance/registries/registry-base.ts";
import { AppendOnlyError, CgValidationError } from "../../../src/control/constitutional-governance/append-only.ts";
import { makeHarness } from "../../../src/control/constitutional-governance/test-harness.ts";

function makeReg(requiresUpTrace = false, extra: Record<string, unknown> = {}) {
  const h = makeHarness();
  const reg = new ConstitutionalRegistry({
    registry: "REG-PRIN",
    log: h.log,
    clock: h.clock,
    requiresUpTrace,
    auditSink: h.audit.sink,
    ...extra,
  });
  return { reg, h };
}

test("RG-1 propose-only: proposed record is never ACTIVE", () => {
  const { reg } = makeReg();
  const r = reg.propose({ logicalId: "X-1", version: "1.0.0", ownerAuthority: "root", content: { a: 1 }, createdBy: "t" });
  assert.equal(r.status, "proposed");
  assert.notEqual(r.status as string, "active");
});

test("RG-2 append-only: duplicate (id,version) rejected with E-APPEND-ONLY", () => {
  const { reg } = makeReg();
  reg.propose({ logicalId: "X-1", version: "1.0.0", ownerAuthority: "root", content: {}, createdBy: "t" });
  try {
    reg.propose({ logicalId: "X-1", version: "1.0.0", ownerAuthority: "root", content: {}, createdBy: "t" });
    assert.fail("expected AppendOnlyError");
  } catch (e) {
    assert.ok(e instanceof AppendOnlyError);
    assert.equal((e as AppendOnlyError).cgCode, "E-APPEND-ONLY");
  }
});

test("RG-3 single-owner: missing ownerAuthority rejected (fail-closed)", () => {
  const { reg } = makeReg();
  assert.throws(
    () => reg.propose({ logicalId: "X-1", version: "1.0.0", ownerAuthority: "", content: {}, createdBy: "t" }),
    CgValidationError,
  );
});

test("RG-4 supersession-by-link: supersede appends a linked record; prior becomes superseded", () => {
  const { reg } = makeReg();
  reg.propose({ logicalId: "X-1", version: "1.0.0", ownerAuthority: "root", content: { v: 1 }, createdBy: "t" });
  const v2 = reg.supersede({ logicalId: "X-1", priorVersion: "1.0.0", version: "1.0.1", ownerAuthority: "root", content: { v: 2 }, createdBy: "t" });
  assert.equal(v2.status, "proposed");
  assert.ok(v2.supersedes, "successor links to predecessor");
  const v1 = reg.get("X-1", "1.0.0")!;
  assert.equal(v1.status, "superseded");
  assert.equal(reg.getLatest("X-1")!.version, "1.0.1");
  // double-supersession of the same prior is rejected
  assert.throws(
    () => reg.supersede({ logicalId: "X-1", priorVersion: "1.0.0", version: "1.0.2", ownerAuthority: "root", content: {}, createdBy: "t" }),
    AppendOnlyError,
  );
});

test("RG-5 versioned: invalid semver rejected; (id,version) unique", () => {
  const { reg } = makeReg();
  assert.throws(
    () => reg.propose({ logicalId: "X-1", version: "1.0", ownerAuthority: "root", content: {}, createdBy: "t" }),
    CgValidationError,
  );
});

test("RG-6 deterministic identity: equal content ⇒ equal contentHash across registry instances", () => {
  const a = makeReg().reg.propose({ logicalId: "X-1", version: "1.0.0", ownerAuthority: "root", content: { a: 1, b: 2 }, createdBy: "t" });
  const b = makeReg().reg.propose({ logicalId: "X-1", version: "1.0.0", ownerAuthority: "root", content: { b: 2, a: 1 }, createdBy: "t" });
  assert.equal(a.contentHash, b.contentHash);
  assert.equal(a.recordUuid, b.recordUuid);
});

test("RG-7 traceable: non-root registry requires up-trace", () => {
  const { reg } = makeReg(true);
  assert.throws(
    () => reg.propose({ logicalId: "X-1", version: "1.0.0", ownerAuthority: "root", content: {}, createdBy: "t" }),
    CgValidationError,
  );
  const ok = reg.propose({ logicalId: "X-2", version: "1.0.0", ownerAuthority: "root", content: {}, createdBy: "t", upTrace: ["PCAMG-PRIN-001"] });
  assert.deepEqual(ok.upTrace, ["PCAMG-PRIN-001"]);
});

test("RG-8 auditable: every append emits an attributable audit event", () => {
  const { reg, h } = makeReg();
  reg.propose({ logicalId: "X-1", version: "1.0.0", ownerAuthority: "root", content: {}, createdBy: "alice" });
  reg.supersede({ logicalId: "X-1", priorVersion: "1.0.0", version: "1.0.1", ownerAuthority: "root", content: {}, createdBy: "bob" });
  assert.equal(h.audit.events.length, 2);
  assert.equal(h.audit.events[0]!.action, "PROPOSE");
  assert.equal(h.audit.events[0]!.actor, "alice");
  assert.equal(h.audit.events[1]!.action, "SUPERSEDE");
});

test("verify-on-read + history + determinism replay", () => {
  const { reg } = makeReg();
  reg.propose({ logicalId: "X-1", version: "1.0.0", ownerAuthority: "root", content: { n: 1 }, createdBy: "t" });
  reg.supersede({ logicalId: "X-1", priorVersion: "1.0.0", version: "1.0.1", ownerAuthority: "root", content: { n: 2 }, createdBy: "t" });
  const hist = reg.history("X-1");
  assert.equal(hist.length, 2);
  assert.equal(hist[0]!.version, "1.0.0");
  assert.equal(hist[1]!.version, "1.0.1");
  // verify-on-read passes for stored records
  assert.equal(reg.get("X-1", "1.0.0")!.version, "1.0.0");
});
