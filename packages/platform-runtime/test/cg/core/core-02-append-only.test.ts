/**
 * CGR-CORE-02 verification — append-only guard.
 * Proves: duplicate (id,version) rejected (E-APPEND-ONLY); invalid semver rejected;
 * supersede of a non-existent prior rejected; double-supersession rejected; no delete API exists.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AppendOnlyError,
  CgValidationError,
  CgNotFoundError,
  assertValidVersion,
  assertNoDuplicate,
  assertValidSupersession,
} from "../../../src/control/constitutional-governance/append-only.ts";
import * as appendOnly from "../../../src/control/constitutional-governance/append-only.ts";
import type { ConstitutionalRecord } from "../../../src/control/constitutional-governance/types.ts";

function rec(logicalId: string, version: string, uuid: string, supersedes: string | null = null): ConstitutionalRecord {
  return {
    recordUuid: uuid, registry: "REG-PRIN", logicalId, version, ownerAuthority: "root",
    status: "proposed", supersedes, upTrace: [], content: {}, contentHash: "x", createdBy: "t",
    createdAt: "2023-11-14T22:13:20.000Z", seq: 0,
  };
}

test("CORE-02: valid semver accepted, invalid rejected", () => {
  assert.doesNotThrow(() => assertValidVersion("1.2.3"));
  assert.throws(() => assertValidVersion("1.2"), CgValidationError);
  assert.throws(() => assertValidVersion("v1.0.0"), CgValidationError);
});

test("CORE-02: duplicate (id,version) => E-APPEND-ONLY", () => {
  const existing = [rec("PCAMG-PRIN-001", "1.0.0", "u1")];
  try {
    assertNoDuplicate(existing, "PCAMG-PRIN-001", "1.0.0");
    assert.fail("expected AppendOnlyError");
  } catch (e) {
    assert.ok(e instanceof AppendOnlyError);
    assert.equal((e as AppendOnlyError).cgCode, "E-APPEND-ONLY");
  }
  assert.doesNotThrow(() => assertNoDuplicate(existing, "PCAMG-PRIN-001", "1.0.1"));
});

test("CORE-02: supersede of non-existent prior => E-NOT-FOUND", () => {
  assert.throws(() => assertValidSupersession([], "PCAMG-PRIN-001", "1.0.0"), CgNotFoundError);
});

test("CORE-02: double-supersession of the same prior => E-APPEND-ONLY", () => {
  const prior = rec("PCAMG-PRIN-001", "1.0.0", "u1");
  const successor = rec("PCAMG-PRIN-001", "1.0.1", "u2", "u1");
  const existing = [prior, successor];
  assert.throws(() => assertValidSupersession(existing, "PCAMG-PRIN-001", "1.0.0"), AppendOnlyError);
});

test("CORE-02: no update/delete function is exported (append-only surface)", () => {
  const names = Object.keys(appendOnly);
  for (const forbidden of ["update", "delete", "remove", "mutate", "drop"]) {
    assert.ok(!names.some((n) => n.toLowerCase().includes(forbidden)), `unexpected mutating export: ${forbidden}`);
  }
});
