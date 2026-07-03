/**
 * UCOS Memory Fabric — Ratification Authority (MEM-GOV-001 C6).
 *
 * The terminal memory-governance authority that ratifies a certified memory unit for durable commit,
 * enforcing quorum and NON-WAIVABLE separation of duties: consolidate ≠ certify ≠ ratify. It binds the
 * ratification to the upstream certification (`certificationId`) and issues a SIGNED ratification
 * assertion over the `unitHash` (reusing federation Ed25519; NO custom crypto). Verification is
 * fail-closed. Actual durable persistence still routes through the Evolution Fabric (MGP-4).
 */

import type { KeyObject } from "node:crypto";
import { KeyRegistry, signPayload, verifyPayload } from "../federation/assertions.ts";
import { ControlValidationError } from "../errors.ts";

export interface MemoryRatificationAuthorityRecord {
  raId: string;
  owner: string;
  keyRef: string;
  quorum: number; // minimum number of distinct ratifiers required
}

export interface MemoryRatification {
  ratificationId: string;
  unitHash: string;
  raId: string;
  consolidator: string;
  certifier: string;
  certificationId: string;
  ratifiers: string[];
  quorumMet: boolean;
  at: number;
  signature: string;
}

export interface RatifyInput {
  unitHash: string;
  raId: string;
  consolidator: string;
  certifier: string;
  certificationId: string;
  ratifiers: string[];
  at?: number;
}

export class MemoryRatificationAuthority {
  readonly #keys: KeyRegistry;
  readonly #authorities = new Map<string, MemoryRatificationAuthorityRecord>();
  #seq = 0;

  constructor(keys: KeyRegistry) {
    this.#keys = keys;
  }

  register(record: MemoryRatificationAuthorityRecord): MemoryRatificationAuthorityRecord {
    if (!record.raId || !record.owner || !record.keyRef) {
      throw new ControlValidationError("memory ratification authority requires raId, owner, keyRef", { record });
    }
    if (!Number.isInteger(record.quorum) || record.quorum < 1) {
      throw new ControlValidationError("ratification authority quorum must be a positive integer", { record });
    }
    this.#authorities.set(record.raId, record);
    return record;
  }

  get(raId: string): MemoryRatificationAuthorityRecord | undefined {
    return this.#authorities.get(raId);
  }

  /**
   * Issue a signed ratification. FAIL-CLOSED on SoD violation or unmet quorum:
   * consolidator ≠ certifier, and neither may appear among the ratifiers (consolidate ≠ certify ≠ ratify).
   */
  issue(privateKey: KeyObject, input: RatifyInput): MemoryRatification {
    const ra = this.#authorities.get(input.raId);
    if (!ra) throw new ControlValidationError(`unknown ratification authority: ${input.raId}`, { input });
    if (input.consolidator === input.certifier) {
      throw new ControlValidationError("SoD violated: consolidator and certifier must differ (consolidate≠certify)", { input });
    }
    const uniqueRatifiers = [...new Set(input.ratifiers)];
    if (uniqueRatifiers.includes(input.consolidator) || uniqueRatifiers.includes(input.certifier)) {
      throw new ControlValidationError("SoD violated: a ratifier may not also consolidate or certify (ratify≠consolidate≠certify)", { input });
    }
    if (uniqueRatifiers.length < ra.quorum) {
      throw new ControlValidationError(`ratification quorum not met: need ${ra.quorum}, got ${uniqueRatifiers.length}`, { input });
    }
    const at = input.at ?? Date.now();
    const base = {
      ratificationId: `mem-rat-${this.#seq++}`,
      unitHash: input.unitHash,
      raId: input.raId,
      consolidator: input.consolidator,
      certifier: input.certifier,
      certificationId: input.certificationId,
      ratifiers: uniqueRatifiers,
      quorumMet: true,
    };
    return { ...base, at, signature: signPayload({ ...base, at }, privateKey) };
  }

  /** Fail-closed verification: valid signature, known authority, quorum satisfied, SoD intact. */
  verify(rat: MemoryRatification): boolean {
    const ra = this.#authorities.get(rat.raId);
    if (!ra) return false;
    if (!rat.quorumMet || rat.ratifiers.length < ra.quorum) return false;
    if (rat.consolidator === rat.certifier) return false;
    if (rat.ratifiers.includes(rat.consolidator) || rat.ratifiers.includes(rat.certifier)) return false;
    const pub = this.#keys.get(ra.keyRef);
    if (!pub) return false;
    const { signature, ...base } = rat;
    return verifyPayload(base, signature, pub);
  }
}
