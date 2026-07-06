/**
 * CGR-W2-ACR-03 — Authority Supremacy Ordering verification.
 * Categories: Determinism · Fail-closed · Dependency validation.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { seededRuntime } from "../wave-a-harness.ts";
import { resolveAuthorityChain } from "../../../src/control/constitutional-governance/authority/resolve.ts";
import { orderBySupremacy } from "../../../src/control/constitutional-governance/authority/supremacy.ts";
import type { ResolvedAuthorityChain } from "../../../src/control/constitutional-governance/authority/types.ts";

function chainFor(subject: string): ResolvedAuthorityChain {
  const { readModel } = seededRuntime();
  const res = resolveAuthorityChain(readModel, subject);
  assert.equal(res.resolved, true);
  return res.chain!;
}

test("ACR-03 dependency: shallowest complete chain is supreme; ordering is total by depth", () => {
  const deep = chainFor("CAP-01"); // maxDepth 4
  const mid = chainFor("PDC-GOV"); // maxDepth 2
  const shallow = chainFor("PCAMG-META-I"); // maxDepth 1
  const res = orderBySupremacy([deep, mid, shallow]);
  assert.equal(res.decided, true);
  assert.equal(res.supreme!.subject, "PCAMG-META-I");
  assert.deepEqual(res.ordered.map((c) => c.subject), ["PCAMG-META-I", "PDC-GOV", "CAP-01"]);
});

test("ACR-03 determinism: input order does not affect the selected supreme or the ordering", () => {
  const deep = chainFor("CAP-01");
  const mid = chainFor("PDC-GOV");
  const shallow = chainFor("PCAMG-META-I");
  const a = orderBySupremacy([deep, mid, shallow]);
  const b = orderBySupremacy([shallow, deep, mid]);
  assert.deepEqual(a.ordered.map((c) => c.subject), b.ordered.map((c) => c.subject));
  assert.equal(a.supreme!.subject, b.supreme!.subject);
});

test("ACR-03 fail-closed: empty input denies with E-EMPTY-INPUT", () => {
  const res = orderBySupremacy([]);
  assert.equal(res.decided, false);
  assert.equal(res.supreme, null);
  assert.equal(res.denial!.code, "E-EMPTY-INPUT");
});

test("ACR-03 fail-closed: any incomplete chain makes supremacy undecidable (no arbitrary pick)", () => {
  const complete = chainFor("PCAMG-META-I");
  const incomplete = chainFor("AD-0001"); // terminates at a non-principle
  assert.equal(incomplete.complete, false);
  const res = orderBySupremacy([complete, incomplete]);
  assert.equal(res.decided, false);
  assert.equal(res.denial!.code, "E-UNDECIDABLE-SUPREMACY");
  assert.deepEqual(res.denial!.detail["incomplete"], ["AD-0001"]);
});

test("ACR-03 determinism: canonical tie-break is total for equal-depth distinct subjects", () => {
  // Two depth-1 complete chains (META-I and GOV-0001) → ordered canonically by content hash.
  const a = chainFor("PCAMG-META-I");
  const b = chainFor("GOV-0001");
  const r1 = orderBySupremacy([a, b]);
  const r2 = orderBySupremacy([b, a]);
  assert.equal(r1.decided, true);
  assert.deepEqual(r1.ordered.map((c) => c.subject), r2.ordered.map((c) => c.subject));
});
