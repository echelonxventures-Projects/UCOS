/**
 * UCOS Ontology Fabric — Authority, Boundary & Namespace Registry (ONTO-GOV-001/002).
 *
 * Metadata-backed registry for ontology authorities, trust boundaries, and namespace governance
 * records under `ontology:authority:*`, `ontology:boundary:*`, `ontology:namespace:*`. Authorities
 * carry enumerated powers (no implicit authority). Boundaries are deny-by-default and clamp conferred
 * ontology trust. Namespaces are single-owner and deny-by-default for foreign assertions. Registration
 * is an Approval-Required governance-setup operation (AD-0009), not a governed ontology mutation.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type {
  OntologyAuthorityRecord,
  OntologyBoundaryRecord,
  OntologyNamespaceRecord,
  OntologyPower,
} from "./types.ts";
import { authorityKey, boundaryKey, namespaceKey } from "./ontology-namespace.ts";
import { ControlValidationError } from "../errors.ts";

export class OntologyRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  // ------------------------------ Authorities ------------------------------

  registerAuthority(
    record: Omit<OntologyAuthorityRecord, "status"> & { status?: OntologyAuthorityRecord["status"] },
  ): OntologyAuthorityRecord {
    if (!record.authorityId || !record.keyRef || !record.owner) {
      throw new ControlValidationError("Ontology authority requires authorityId, owner, keyRef", { record });
    }
    if (!Array.isArray(record.powers) || record.powers.length === 0) {
      throw new ControlValidationError("Ontology authority requires enumerated powers (no implicit authority)", { record });
    }
    const full: OntologyAuthorityRecord = { ...record, status: record.status ?? "active" };
    this.#metadata.put(authorityKey(record.authorityId), full);
    return full;
  }

  getAuthority(authorityId: string): OntologyAuthorityRecord | undefined {
    return this.#metadata.get(authorityKey(authorityId))?.value as OntologyAuthorityRecord | undefined;
  }

  /** Authority must exist, be active, and hold the requested power (fail-closed). */
  hasPower(authorityId: string, power: OntologyPower): boolean {
    const a = this.getAuthority(authorityId);
    return !!a && a.status === "active" && a.powers.includes(power);
  }

  revokeAuthority(authorityId: string): void {
    const a = this.getAuthority(authorityId);
    if (!a) throw new ControlValidationError(`Unknown ontology authority "${authorityId}"`, { authorityId });
    this.#metadata.put(authorityKey(authorityId), { ...a, status: "revoked" });
  }

  // ------------------------------ Boundaries ------------------------------

  defineBoundary(record: Omit<OntologyBoundaryRecord, "defaultEffect"> & { defaultEffect?: "deny" }): OntologyBoundaryRecord {
    if (!record.boundaryId) throw new ControlValidationError("Ontology boundary requires boundaryId", { record });
    if (!Number.isFinite(record.maxTrustLevel) || record.maxTrustLevel < 0) {
      throw new ControlValidationError("Ontology boundary maxTrustLevel must be a non-negative number", { record });
    }
    const full: OntologyBoundaryRecord = { ...record, defaultEffect: "deny" };
    this.#metadata.put(boundaryKey(record.boundaryId), full);
    return full;
  }

  getBoundary(boundaryId: string): OntologyBoundaryRecord | undefined {
    return this.#metadata.get(boundaryKey(boundaryId))?.value as OntologyBoundaryRecord | undefined;
  }

  boundaryContains(boundaryId: string, authorityId: string): boolean {
    return this.getBoundary(boundaryId)?.members.includes(authorityId) ?? false;
  }

  boundaryMaxTrust(boundaryId: string): number {
    return this.getBoundary(boundaryId)?.maxTrustLevel ?? 0; // absent => 0 (deny-by-default)
  }

  // ------------------------------ Namespaces ------------------------------

  defineNamespace(
    record: Omit<OntologyNamespaceRecord, "defaultEffect" | "status" | "authorities" | "imports"> & {
      authorities?: string[];
      imports?: string[];
      status?: OntologyNamespaceRecord["status"];
    },
  ): OntologyNamespaceRecord {
    if (!record.namespace || !record.namespace.startsWith("ontology:")) {
      throw new ControlValidationError("Ontology namespace must start with 'ontology:'", { record });
    }
    if (!record.owner) throw new ControlValidationError("Ontology namespace requires a single accountable owner", { record });
    const full: OntologyNamespaceRecord = {
      namespace: record.namespace,
      owner: record.owner,
      authorities: record.authorities ? [...record.authorities] : [],
      imports: record.imports ? [...record.imports] : [],
      defaultEffect: "deny",
      status: record.status ?? "active",
    };
    this.#metadata.put(namespaceKey(record.namespace), full);
    return full;
  }

  getNamespace(namespace: string): OntologyNamespaceRecord | undefined {
    return this.#metadata.get(namespaceKey(namespace))?.value as OntologyNamespaceRecord | undefined;
  }

  /** Imports declared for a namespace (used for cross-namespace reference resolution). */
  imports(namespace: string): string[] {
    return this.getNamespace(namespace)?.imports ?? [];
  }

  /** Is the authority permitted to govern within the namespace? Deny-by-default if unknown. */
  namespaceGovernedBy(namespace: string, authorityId: string): boolean {
    return this.getNamespace(namespace)?.authorities.includes(authorityId) ?? false;
  }

  /** Archival, never destructive (IP-10 preserve-don't-destroy). */
  archiveNamespace(namespace: string): void {
    const ns = this.getNamespace(namespace);
    if (!ns) throw new ControlValidationError(`Unknown ontology namespace "${namespace}"`, { namespace });
    this.#metadata.put(namespaceKey(namespace), { ...ns, status: "archived" });
  }
}
