/**
 * Wave-B shared test harness (PCAMG-RUNTIME-0107A). NOT a test file — matches the established
 * non-collected harness naming convention, so the ".test.ts" runner glob ignores it.
 *
 * Reuses the Wave-A seeded corpus (`seededRuntime`) and drives it through the full read-only
 * pipeline — resolve chain (ACR-02) → verify+anchor (AVR-03) → applicable provisions (CRL-01) →
 * precedence (CRL-02) — so the CRL suites exercise real verified chains. No Wave-B write occurs
 * here; seeding uses only the Wave-1 propose path via the reused Wave-A harness.
 */

import { seededRuntime } from "./wave-a-harness.ts";
import type { SeededRuntime } from "./wave-a-harness.ts";
import { resolveAuthorityChain } from "../../src/control/constitutional-governance/authority/resolve.ts";
import { verifyAndAudit } from "../../src/control/constitutional-governance/verification/audit-continuity.ts";
import type { VerificationReport } from "../../src/control/constitutional-governance/verification/audit-continuity.ts";
import type { ResolvedAuthorityChain } from "../../src/control/constitutional-governance/authority/types.ts";
import { resolveApplicableProvisions } from "../../src/control/constitutional-governance/constitutional-resolution/applicable-provision.ts";
import type { ApplicableProvisionResult } from "../../src/control/constitutional-governance/constitutional-resolution/applicable-provision.ts";
import { resolvePrecedence } from "../../src/control/constitutional-governance/constitutional-resolution/precedence.ts";
import type { PrecedenceResult } from "../../src/control/constitutional-governance/constitutional-resolution/precedence.ts";

/** A fully driven resolution fixture over one subject, plus the seeded runtime it was drawn from. */
export interface ResolutionFixture extends SeededRuntime {
  readonly chain: ResolvedAuthorityChain;
  readonly report: VerificationReport;
  readonly applicable: ApplicableProvisionResult;
  readonly precedence: PrecedenceResult;
}

/**
 * Build the full CRL pipeline for a subject over a fresh seeded runtime. Defaults to the deep,
 * complete `CAP-01` chain (depth 4, terminates at the principle root).
 */
export function resolutionFixture(subject = "CAP-01"): ResolutionFixture {
  const seeded = seededRuntime();
  const resolution = resolveAuthorityChain(seeded.readModel, subject);
  const chain = resolution.chain!;
  const report = verifyAndAudit(seeded.gov, seeded.readModel, chain);
  const applicable = resolveApplicableProvisions(seeded.readModel, chain, report);
  const precedence = resolvePrecedence(applicable);
  return { ...seeded, chain, report, applicable, precedence };
}

/** Build an AVR verification report for an arbitrary subject (may be invalid, e.g. for AD-0001). */
export function reportFor(subject: string): { fixture: SeededRuntime; chain: ResolvedAuthorityChain; report: VerificationReport } {
  const fixture = seededRuntime();
  const chain = resolveAuthorityChain(fixture.readModel, subject).chain!;
  const report = verifyAndAudit(fixture.gov, fixture.readModel, chain);
  return { fixture, chain, report };
}
