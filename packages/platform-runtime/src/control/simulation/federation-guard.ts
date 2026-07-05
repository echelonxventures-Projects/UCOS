/**
 * UCOS PI-11 Simulation Fabric — M10 Federation Guard (C11, SIM-FED-001 §4).
 *
 * Governs cross-node (co-simulation) contributions. Foreign contributions are ADVISORY / DENY-ONLY:
 * they can never force a local promotion (S9). Trust is clamped to `min(asserted, delegated, boundary)`;
 * an over-cap assertion (asserted > boundary) is DENIED. Local artifacts shadow foreign ones of the
 * same id (local-shadows-foreign). Under partition the guard fails closed — no foreign contribution is
 * admitted. Signature verification reuses `federation/assertions.ts` (no custom cryptography); foreign
 * artifacts are stored under the isolated `simulation:foreign:<nodeId>:*` namespace.
 */

import type { KeyRegistry } from "../federation/assertions.ts";
import { verifyPayload } from "../federation/assertions.ts";
import type { MetadataPort } from "../../meta-core/ports.ts";
import type { SimulationSink } from "./types.ts";
import { SimulationError } from "./types.ts";
import { foreignKey } from "./simulation-namespace.ts";

export interface ForeignContribution {
  nodeId: string;
  authorityId: string;
  keyRef: string;
  artifactId: string;
  assertedTrust: number;
  payload: Record<string, unknown>;
  signature?: string;
}

export interface AdmittedForeign {
  nodeId: string;
  artifactId: string;
  effectiveTrust: number;
  payload: Record<string, unknown>;
  /** Foreign contributions are advisory-only; they can never be promoted. */
  readonly advisory: true;
  readonly promotable: false;
}

export class FederationGuard {
  readonly #keys: KeyRegistry;
  readonly #metadata: MetadataPort;
  readonly #sink: SimulationSink | undefined;
  readonly #boundaryMaxTrust: number;
  readonly #delegationMax: number;
  #partitioned = false;
  /** Local artifact ids that shadow any foreign artifact of the same id. */
  readonly #localShadow = new Set<string>();

  constructor(deps: {
    keys: KeyRegistry;
    metadata: MetadataPort;
    sink?: SimulationSink;
    boundaryMaxTrust?: number;
    delegationMax?: number;
  }) {
    this.#keys = deps.keys;
    this.#metadata = deps.metadata;
    this.#sink = deps.sink;
    this.#boundaryMaxTrust = deps.boundaryMaxTrust ?? 5;
    this.#delegationMax = deps.delegationMax ?? 5;
  }

  #audit(event: Parameters<SimulationSink["record"]>[0]["event"], detail: string): void {
    this.#sink?.record({ at: Date.now(), event, actor: "federation-guard", detail });
  }

  /** Simulate a partition (fail-closed): while partitioned, no foreign contribution is admitted. */
  setPartitioned(value: boolean): void {
    this.#partitioned = value;
  }

  /** Declare a local artifact id that shadows any foreign artifact of the same id. */
  registerLocalArtifact(artifactId: string): void {
    this.#localShadow.add(artifactId);
  }

  /**
   * Admit a foreign contribution as advisory-only. Fail-closed on partition, missing/invalid signature,
   * local shadow, or over-cap trust.
   */
  admit(contribution: ForeignContribution): AdmittedForeign {
    if (this.#partitioned) {
      this.#audit("DENY", `partition: foreign ${contribution.artifactId} denied`);
      throw new SimulationError("FEDERATION_DENIED", "network partition: foreign contributions fail closed", { nodeId: contribution.nodeId });
    }

    // local-shadows-foreign: a local artifact of the same id takes precedence; foreign is rejected.
    if (this.#localShadow.has(contribution.artifactId)) {
      this.#audit("DENY", `local shadows foreign ${contribution.artifactId}`);
      throw new SimulationError("FEDERATION_DENIED", "local artifact shadows foreign contribution", { artifactId: contribution.artifactId });
    }

    // Signature verification (reuse federation crypto).
    const pub = this.#keys.get(contribution.keyRef);
    if (!pub || !contribution.signature) {
      this.#audit("DENY", `foreign ${contribution.artifactId} missing key/signature`);
      throw new SimulationError("FEDERATION_DENIED", "foreign contribution key unknown or unsigned", { nodeId: contribution.nodeId });
    }
    const { signature, ...unsigned } = contribution;
    if (!verifyPayload(unsigned, signature, pub)) {
      this.#audit("DENY", `foreign ${contribution.artifactId} bad signature`);
      throw new SimulationError("FEDERATION_DENIED", "foreign contribution signature invalid", { nodeId: contribution.nodeId });
    }

    // S9: over-cap assertion is denied outright.
    if (contribution.assertedTrust > this.#boundaryMaxTrust) {
      this.#audit("DENY", `foreign ${contribution.artifactId} over-cap trust ${contribution.assertedTrust} > ${this.#boundaryMaxTrust}`);
      throw new SimulationError("FEDERATION_DENIED", "foreign asserted trust exceeds boundary cap", { asserted: contribution.assertedTrust, boundary: this.#boundaryMaxTrust });
    }

    // Trust clamp: min(asserted, delegated, boundary).
    const effectiveTrust = Math.min(contribution.assertedTrust, this.#delegationMax, this.#boundaryMaxTrust);

    // Store as isolated, advisory foreign artifact.
    this.#metadata.put(foreignKey(contribution.nodeId, contribution.artifactId), {
      ...contribution.payload,
      effectiveTrust,
      advisory: true,
    });
    this.#audit("FOREIGN_CONTRIBUTION", `foreign ${contribution.artifactId} admitted advisory trust=${effectiveTrust}`);

    return { nodeId: contribution.nodeId, artifactId: contribution.artifactId, effectiveTrust, payload: contribution.payload, advisory: true, promotable: false };
  }
}
