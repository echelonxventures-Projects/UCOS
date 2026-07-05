/**
 * CGR-CORE-05 verification — deterministic harness.
 * Proves: fixed clock is monotonic & reproducible; harness instances are isolated;
 * recording audit sink captures events; reused append-only log is fresh per harness.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { fixedClock, makeHarness, recordingAuditSink } from "../../../src/control/constitutional-governance/test-harness.ts";

test("CORE-05: fixed clock is monotonic and reproducible", () => {
  const c1 = fixedClock();
  const c2 = fixedClock();
  const a = [c1(), c1(), c1()];
  const b = [c2(), c2(), c2()];
  assert.deepEqual(a, b, "two fixed clocks produce identical sequences");
  assert.ok(a[0]! < a[1]! && a[1]! < a[2]!, "strictly increasing");
});

test("CORE-05: harness instances are isolated (fresh log each)", () => {
  const h1 = makeHarness();
  const h2 = makeHarness();
  h1.log.append({ x: 1 });
  assert.equal(h1.log.size(), 1);
  assert.equal(h2.log.size(), 0, "second harness log is independent");
});

test("CORE-05: recording audit sink captures emitted events", () => {
  const rec = recordingAuditSink();
  rec.sink({ actor: "a", action: "PROPOSE", registry: "REG-PRIN", subjectRef: "x@1.0.0", recordUuid: "u", contentHash: "h", at: "t" });
  assert.equal(rec.events.length, 1);
  assert.equal(rec.events[0]!.action, "PROPOSE");
});
