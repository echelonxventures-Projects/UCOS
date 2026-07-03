/**
 * UCOS Readiness Fabric — Self-Inspection Engine (RDN-ENG-SELF, engine 5 of 7).
 *
 * The fabric inspects ITS OWN integrity before it is trusted to judge the platform's. This is the
 * anti-fragility / "who watches the watcher" check. Deny-by-default: if the fabric cannot prove its own
 * soundness, no assessment may reach `ready`/`certified`.
 *
 * Checks:
 *   - audit-chain-intact: the hash-chained readiness audit verifies end-to-end;
 *   - governance-present: a meta-governance record is configured;
 *   - certify-authority-present: at least one active authority holds the `certify` power;
 *   - separation-of-duties-enforceable: assess and certify powers are held by DISTINCT owners
 *     (otherwise SoD can never be satisfied and certification is unsafe);
 *   - no-self-certification: no historical certification had assessor === certifier;
 *   - engines-wired: all seven engines are present.
 */

import type { SelfInspectionCheck, SelfInspectionResult } from "./types.ts";

export interface SelfInspectionInput {
  auditVerify: { ok: boolean; reason: string };
  governancePresent: boolean;
  certifyAuthorityPresent: boolean;
  sodEnforceable: boolean;
  sodDetail: string;
  selfCertificationCount: number;
  enginesWired: boolean;
}

export class SelfInspectionEngine {
  inspect(input: SelfInspectionInput): SelfInspectionResult {
    const checks: SelfInspectionCheck[] = [
      {
        name: "audit-chain-intact",
        ok: input.auditVerify.ok,
        detail: input.auditVerify.reason,
      },
      {
        name: "governance-present",
        ok: input.governancePresent,
        detail: input.governancePresent ? "meta-governance record configured" : "no meta-governance record",
      },
      {
        name: "certify-authority-present",
        ok: input.certifyAuthorityPresent,
        detail: input.certifyAuthorityPresent ? "an active certify authority exists" : "no active certify authority",
      },
      {
        name: "separation-of-duties-enforceable",
        ok: input.sodEnforceable,
        detail: input.sodDetail,
      },
      {
        name: "no-self-certification",
        ok: input.selfCertificationCount === 0,
        detail:
          input.selfCertificationCount === 0
            ? "no self-certification observed"
            : `${input.selfCertificationCount} self-certification(s) detected (SoD breach)`,
      },
      {
        name: "engines-wired",
        ok: input.enginesWired,
        detail: input.enginesWired ? "all seven engines present" : "engine wiring incomplete",
      },
    ];

    return { ok: checks.every((c) => c.ok), checks };
  }
}
