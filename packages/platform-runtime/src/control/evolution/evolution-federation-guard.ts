/**
 * UCOS Evolution Fabric — Federation Guard (EVO-FED-001).
 *
 * Guarantees evolution can never SILENTLY destabilize a ratified federation boundary. A unit that
 * touches the `federation:` namespace is federation-touching and is inadmissible without a valid,
 * signed Federation Re-Ratification Token. After apply, federation invariants are re-checked; any
 * regression (a boundary weakened or removed, defaultEffect no longer deny, or a raised trust ceiling)
 * throws and triggers automatic rollback.
 */

import type { MetaCoreKernel } from "../../meta-core/kernel.ts";
import type { TrustBoundaryRecord } from "../federation/types.ts";
import type { EvolutionUnit, FederationReRatificationToken, VerificationResult } from "./types.ts";
import type { KeyRegistry } from "../federation/assertions.ts";
import { verifyPayload, isFresh } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

const FEDERATION_NS = "federation:";
const BOUNDARY_PREFIX = "federation:boundary:";

interface BoundaryInvariant {
  defaultEffect: string;
  maxTrustLevel: number;
  memberCount: number;
}

export class EvolutionFederationGuard {
  readonly #kernel: MetaCoreKernel;
  readonly #keys: KeyRegistry;

  constructor(kernel: MetaCoreKernel, keys: KeyRegistry) {
    this.#kernel = kernel;
    this.#keys = keys;
  }

  /** A unit is federation-touching if any target/op references the `federation:` namespace. */
  isFederationTouching(unit: EvolutionUnit): boolean {
    for (const target of unit.targets) {
      if (target.kind === "metadata" && target.keyPrefix.startsWith(FEDERATION_NS)) return true;
    }
    for (const op of unit.ops) {
      if (op.op === "put-metadata" && op.key.startsWith(FEDERATION_NS)) return true;
    }
    return false;
  }

  /** Verify a re-ratification token: signature against the issuer key + freshness. Fail-closed. */
  validateToken(token: FederationReRatificationToken | undefined, now: number = Date.now()): VerificationResult {
    if (!token) return { ok: false, reason: "federation-touching evolution requires a re-ratification token" };
    if (!isFresh(token.issuedAt, token.expiresAt, now)) return { ok: false, reason: "re-ratification token expired/not fresh" };
    const pub = this.#keys.get(token.issuerKeyRef);
    if (!pub) return { ok: false, reason: `no public key for token issuerKeyRef "${token.issuerKeyRef}"` };
    const sig = token.signature;
    if (!sig) return { ok: false, reason: "re-ratification token unsigned" };
    const { signature: _omit, ...payload } = token;
    if (!verifyPayload(payload, sig, pub)) return { ok: false, reason: "invalid re-ratification token signature" };
    return { ok: true, reason: "re-ratification token verified" };
  }

  /** Snapshot every federation boundary's protected invariants. */
  captureInvariants(): Map<string, BoundaryInvariant> {
    const map = new Map<string, BoundaryInvariant>();
    for (const rec of this.#kernel.metadata.query(BOUNDARY_PREFIX)) {
      const b = rec.value as TrustBoundaryRecord;
      map.set(b.boundaryId, { defaultEffect: b.defaultEffect, maxTrustLevel: b.maxTrustLevel, memberCount: b.members.length });
    }
    return map;
  }

  /**
   * Assert no boundary was silently weakened relative to `before`. Throws on any regression:
   * removed boundary, defaultEffect no longer "deny", or an increased maxTrustLevel.
   */
  assertInvariantsHeld(before: Map<string, BoundaryInvariant>): void {
    const after = this.captureInvariants();
    for (const [boundaryId, prior] of before) {
      const now = after.get(boundaryId);
      if (!now) throw new ControlValidationError(`Federation boundary "${boundaryId}" was removed by evolution`, { boundaryId });
      if (now.defaultEffect !== "deny") {
        throw new ControlValidationError(`Federation boundary "${boundaryId}" defaultEffect weakened to "${now.defaultEffect}"`, { boundaryId });
      }
      if (now.maxTrustLevel > prior.maxTrustLevel) {
        throw new ControlValidationError(
          `Federation boundary "${boundaryId}" maxTrustLevel raised ${prior.maxTrustLevel} -> ${now.maxTrustLevel}`,
          { boundaryId },
        );
      }
    }
  }
}
