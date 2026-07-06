/**
 * CGR-W2-CRL-02 — Precedence Resolver.
 * Categories: Determinism · Precedence correctness · Sovereignty ordering · Fail-closed (invalid graph).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolutionFixture } from "../wave-b-harness.ts";
import { resolvePrecedence } from "../../../src/control/constitutional-governance/constitutional-resolution/precedence.ts";
import { REGISTRY_NAMES } from "../../../src/control/constitutional-governance/types.ts";
import type { ApplicableProvisionResult } from "../../../src/control/constitutional-governance/constitutional-resolution/applicable-provision.ts";

test("CRL-02 precedence correctness: the supreme provision is the Layer-0 principle root", () => {
  const { precedence } = resolutionFixture("CAP-01");
  assert.equal(precedence.decided, true);
  assert.equal(precedence.denial, null);
  assert.equal(precedence.supreme?.logicalId, "PCAMG-PRIN-001");
  assert.equal(precedence.supreme?.isRoot, true);
  assert.equal(precedence.supreme?.registry, "REG-PRIN");
});

test("CRL-02 sovereignty ordering: provisions are ordered by non-decreasing registry sovereignty rank", () => {
  const { precedence } = resolutionFixture("CAP-01");
  const ranks = precedence.ordered.map((p) => REGISTRY_NAMES.indexOf(p.registry));
  for (let i = 1; i < ranks.length; i += 1) {
    assert.ok(ranks[i - 1]! <= ranks[i]!, `sovereignty rank regressed at ${i}: ${ranks[i - 1]} then ${ranks[i]}`);
  }
  // REG-PRIN (sovereign origin) leads; REG-CAP (least sovereign in this chain) trails.
  assert.equal(precedence.ordered[0]!.registry, "REG-PRIN");
  assert.equal(precedence.ordered[precedence.ordered.length - 1]!.registry, "REG-CAP");
});

test("CRL-02 determinism: identical state yields an identical precedence ordering", () => {
  const a = resolutionFixture("CAP-01").precedence;
  const b = resolutionFixture("CAP-01").precedence;
  assert.deepEqual(a.ordered.map((p) => p.logicalId), b.ordered.map((p) => p.logicalId));
  assert.equal(a.supreme?.contentHash, b.supreme?.contentHash);
});

test("CRL-02 totality: ordering covers every applicable provision with no drop or duplicate", () => {
  const { applicable, precedence } = resolutionFixture("CAP-01");
  assert.equal(precedence.ordered.length, applicable.provisions.length);
  const ids = new Set(precedence.ordered.map((p) => p.logicalId));
  assert.equal(ids.size, applicable.provisions.length);
});

test("CRL-02 fail-closed: an unresolved provision set is denied E-UNRESOLVED-PROVISIONS", () => {
  const unresolved = {
    resolved: false,
    subject: null,
    provisions: [],
    denial: { code: "E-UNVERIFIED-CHAIN", message: "x", detail: {} },
  } as unknown as ApplicableProvisionResult;
  const res = resolvePrecedence(unresolved);
  assert.equal(res.decided, false);
  assert.equal(res.denial?.code, "E-UNRESOLVED-PROVISIONS");
  assert.equal(res.supreme, null);
});

test("CRL-02 fail-closed: a resolved-but-empty provision set is denied E-EMPTY-PROVISION-SET", () => {
  const empty = {
    resolved: true, subject: "X", provisions: [], denial: null,
  } as unknown as ApplicableProvisionResult;
  const res = resolvePrecedence(empty);
  assert.equal(res.decided, false);
  assert.equal(res.denial?.code, "E-EMPTY-PROVISION-SET");
});
