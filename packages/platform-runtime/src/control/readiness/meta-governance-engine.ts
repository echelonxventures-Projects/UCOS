/**
 * UCOS Readiness Fabric — Meta-Governance Engine (RDN-ENG-META, engine 7 of 7).
 *
 * Governs the readiness fabric ITSELF: who may assess, certify, inspect, govern, and revoke; the
 * separation-of-duties invariant (assessor ≠ certifier); the anti-rubber-stamp cadence; and the
 * prohibition on self-certification. There is NO implicit authority — every power is enumerated on a
 * registered authority record, and every governance decision is deny-by-default.
 *
 * This engine is the "government of the government": it does not itself assess readiness, but it decides
 * whether a proposed certification act is CONSTITUTIONALLY admissible before the Certification Engine is
 * allowed to sign. It is categorically distinct from Ω∞ self-evolution (AD-0014 stands).
 */

import type {
  MetaGovernanceRecord,
  ReadinessAuthorityRecord,
  ReadinessPower,
  VerificationResult,
} from "./types.ts";
import type { ReadinessStore } from "./readiness-store.ts";
import { ControlValidationError } from "../errors.ts";

export const DEFAULT_META_GOVERNANCE: MetaGovernanceRecord = {
  minCertificationIntervalMs: 0,
  requireSeparationOfDuties: true,
  prohibitSelfCertification: true,
};

export class MetaGovernanceEngine {
  readonly #store: ReadinessStore;

  constructor(store: ReadinessStore) {
    this.#store = store;
    if (!this.#store.getMeta()) this.#store.putMeta({ ...DEFAULT_META_GOVERNANCE });
  }

  // --------------------------- Governance record ---------------------------

  meta(): MetaGovernanceRecord {
    return this.#store.getMeta() ?? { ...DEFAULT_META_GOVERNANCE };
  }

  setMeta(record: MetaGovernanceRecord): void {
    if (!Number.isFinite(record.minCertificationIntervalMs) || record.minCertificationIntervalMs < 0) {
      throw new ControlValidationError("minCertificationIntervalMs must be a non-negative number", { record });
    }
    this.#store.putMeta(record);
  }

  // --------------------------- Authorities (enumerated powers) ---------------------------

  registerAuthority(
    record: Omit<ReadinessAuthorityRecord, "status"> & { status?: ReadinessAuthorityRecord["status"] },
  ): ReadinessAuthorityRecord {
    if (!record.authorityId || !record.owner || !record.keyRef) {
      throw new ControlValidationError("Readiness authority requires authorityId, owner, keyRef", { record });
    }
    if (!Array.isArray(record.powers) || record.powers.length === 0) {
      throw new ControlValidationError("Readiness authority requires enumerated powers (no implicit authority)", { record });
    }
    if (!record.scope) throw new ControlValidationError("Readiness authority requires a scope", { record });
    const full: ReadinessAuthorityRecord = { ...record, status: record.status ?? "active" };
    this.#store.putAuthority(full);
    return full;
  }

  authority(authorityId: string): ReadinessAuthorityRecord | undefined {
    return this.#store.getAuthority(authorityId);
  }

  /** True iff `authorityId` is an ACTIVE authority holding `power`. */
  hasPower(authorityId: string, power: ReadinessPower): boolean {
    const a = this.#store.getAuthority(authorityId);
    return !!a && a.status === "active" && a.powers.includes(power);
  }

  /** True iff some ACTIVE authority holds `power`. */
  anyAuthorityWith(power: ReadinessPower): boolean {
    return this.#store.authorities().some((a) => a.status === "active" && a.powers.includes(power));
  }

  /**
   * SoD is ENFORCEABLE only when `assess` and `certify` powers are held by DISTINCT active owners.
   * If a single owner holds both (or one is absent), certification can never satisfy SoD ⇒ unsafe.
   */
  sodEnforceable(): { ok: boolean; detail: string } {
    const active = this.#store.authorities().filter((a) => a.status === "active");
    const assessors = new Set(active.filter((a) => a.powers.includes("assess")).map((a) => a.owner));
    const certifiers = new Set(active.filter((a) => a.powers.includes("certify")).map((a) => a.owner));
    if (assessors.size === 0) return { ok: false, detail: "no active authority holds 'assess'" };
    if (certifiers.size === 0) return { ok: false, detail: "no active authority holds 'certify'" };
    // SoD is enforceable iff at least one certifier owner differs from at least one assessor owner.
    const distinct = [...certifiers].some((c) => [...assessors].some((a) => a !== c));
    return distinct
      ? { ok: true, detail: "distinct assess/certify owners exist" }
      : { ok: false, detail: "assess and certify powers are held by the same single owner (SoD impossible)" };
  }

  /**
   * Constitutional admissibility of a certification act. Deny-by-default and fail-closed:
   *   - the certifier authority must be active and hold `certify`;
   *   - the assessor authority must be active and hold `assess`;
   *   - SoD: assessor principal ≠ certifier principal (when required);
   *   - self-certification prohibition (when enabled): the certifier may not certify an assessment it
   *     also produced (assessor === certifier), reinforcing SoD;
   *   - cadence: the last certification of the same assessment target must be older than the configured
   *     minimum interval (anti-rubber-stamp).
   */
  admitCertification(input: {
    certifierAuthorityId: string;
    assessorAuthorityId: string;
    assessor: string;
    certifier: string;
    lastCertificationAt?: number;
    now: number;
  }): VerificationResult {
    const meta = this.meta();

    if (!this.hasPower(input.certifierAuthorityId, "certify")) {
      return { ok: false, reason: `certifier authority '${input.certifierAuthorityId}' lacks active 'certify' power` };
    }
    if (!this.hasPower(input.assessorAuthorityId, "assess")) {
      return { ok: false, reason: `assessor authority '${input.assessorAuthorityId}' lacks active 'assess' power` };
    }
    if (meta.requireSeparationOfDuties && input.assessor === input.certifier) {
      return { ok: false, reason: "separation of duties violated (assessor === certifier)" };
    }
    if (meta.prohibitSelfCertification && input.certifierAuthorityId === input.assessorAuthorityId) {
      return { ok: false, reason: "self-certification prohibited (certifier authority === assessor authority)" };
    }
    if (
      meta.minCertificationIntervalMs > 0 &&
      input.lastCertificationAt !== undefined &&
      input.now - input.lastCertificationAt < meta.minCertificationIntervalMs
    ) {
      return {
        ok: false,
        reason: `certification cadence violated (last cert ${input.now - input.lastCertificationAt}ms ago < ${meta.minCertificationIntervalMs}ms)`,
      };
    }
    return { ok: true, reason: "certification act is constitutionally admissible" };
  }

  /** Revoke an authority (fail-closed on next power check). Requires the caller to hold `revoke` elsewhere. */
  revokeAuthority(authorityId: string): void {
    const a = this.#store.getAuthority(authorityId);
    if (!a) throw new ControlValidationError(`unknown authority: ${authorityId}`, { authorityId });
    this.#store.putAuthority({ ...a, status: "revoked" });
  }
}
