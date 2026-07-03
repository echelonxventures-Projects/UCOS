/**
 * UCOS Readiness Fabric — Compliance Engine (RDN-ENG-COMPLIANCE, engine 2 of 7).
 *
 * Evaluates governed compliance CONTROLS (grouped by family: security / quality / documentation /
 * release / governance) against by-reference evidence. A control is `compliant` only when EVERY piece
 * of its required evidence is present AND passing — deny-by-default: missing or failing evidence is
 * `non-compliant`; a control with no evidence supplied at all is `not-assessed` (which is treated as a
 * blocker for mandatory controls). No inline payloads/secrets are inspected (S3): the engine trusts the
 * boolean present/pass verdicts published by evidence probes.
 */

import type { ComplianceControl, ComplianceResult, EvidenceRecord } from "./types.ts";

export class ComplianceEngine {
  /**
   * @param controls the registered compliance controls
   * @param evidence  present/pass verdicts keyed by evidence key
   */
  evaluate(controls: readonly ComplianceControl[], evidence: Map<string, EvidenceRecord>): ComplianceResult[] {
    return controls.map((control) => this.#evaluateControl(control, evidence));
  }

  #evaluateControl(control: ComplianceControl, evidence: Map<string, EvidenceRecord>): ComplianceResult {
    const missing: string[] = [];
    let anyPresent = false;

    for (const key of control.requiredEvidence) {
      const rec = evidence.get(key);
      if (!rec || !rec.present) {
        missing.push(key);
        continue;
      }
      anyPresent = true;
      if (!rec.pass) missing.push(key); // present but failing counts as missing evidence of compliance
    }

    let status: ComplianceResult["status"];
    let detail: string;
    if (control.requiredEvidence.length === 0) {
      // A control with no declared evidence cannot be positively attested — deny-by-default.
      status = "not-assessed";
      detail = "control declares no required evidence (cannot attest; deny-by-default)";
    } else if (missing.length === 0) {
      status = "compliant";
      detail = `all ${control.requiredEvidence.length} evidence item(s) present and passing`;
    } else if (!anyPresent) {
      status = "not-assessed";
      detail = `no evidence supplied (${missing.length} required)`;
    } else {
      status = "non-compliant";
      detail = `${missing.length} of ${control.requiredEvidence.length} evidence item(s) missing or failing`;
    }

    return {
      controlId: control.controlId,
      family: control.family,
      status,
      mandatory: control.mandatory,
      missingEvidence: missing,
      detail,
    };
  }

  /** Mandatory controls that are not `compliant` — these are hard readiness blockers. */
  static blockers(results: readonly ComplianceResult[]): ComplianceResult[] {
    return results.filter((r) => r.mandatory && r.status !== "compliant");
  }
}
