/**
 * UCOS Federation Fabric — Audit Authority & cross-node reconciliation (FED-GOV-C9 / FED-AUD-REC/DIV).
 *
 * Owns cross-node audit reconciliation and divergence detection. Reconciliation is read-only and
 * evidence-only; it never rewrites a chain. High-severity divergence (hash break / effect mismatch)
 * is FAIL-CLOSED. Authority records under `federation:audit-authority:<id>`.
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { AuditAuthorityRecord } from "./types.ts";
import type { ChainedEntry } from "./federated-audit-log.ts";
import { FederatedAuditLog } from "./federated-audit-log.ts";
import { ControlValidationError } from "../errors.ts";

const PREFIX = "federation:audit-authority:";

export type DivergenceClass = "hash-break" | "effect-mismatch" | "missing-counterpart";

export interface Divergence {
  class: DivergenceClass;
  severity: "high" | "medium";
  detail: string;
}

export interface ReconciliationResult {
  status: "consistent" | "divergent";
  divergences: Divergence[];
  failClosed: boolean; // true => suspend acceptance from the counterpart pending adjudication
}

interface AuditExport {
  nodeId: string;
  chain: ChainedEntry[];
  headHash: string;
}

function interactionKey(e: { identityId: string; capabilityId: string; operation: string }): string {
  return `${e.identityId}\u0000${e.capabilityId}\u0000${e.operation}`;
}

export class AuditAuthorityRegistry {
  readonly #metadata: MetadataPort;

  constructor(metadata: MetadataPort) {
    this.#metadata = metadata;
  }

  register(record: AuditAuthorityRecord): AuditAuthorityRecord {
    if (!record.auditAuthorityId) throw new ControlValidationError("Audit authority requires auditAuthorityId", { record });
    this.#metadata.put(`${PREFIX}${record.auditAuthorityId}`, record);
    return record;
  }

  get(auditAuthorityId: string): AuditAuthorityRecord | undefined {
    return this.#metadata.get(`${PREFIX}${auditAuthorityId}`)?.value as AuditAuthorityRecord | undefined;
  }

  /**
   * Reconcile two exported audit chains. Verifies each chain's integrity, then compares shared
   * interactions for effect consistency. Any hash break or effect mismatch is high-severity and
   * fail-closed.
   */
  reconcile(local: AuditExport, remote: AuditExport): ReconciliationResult {
    const divergences: Divergence[] = [];

    for (const [label, exp] of [["local", local], ["remote", remote]] as const) {
      const v = FederatedAuditLog.verify(exp);
      if (!v.ok) divergences.push({ class: "hash-break", severity: "high", detail: `${label} chain: ${v.reason}` });
    }

    const remoteByKey = new Map<string, ChainedEntry>();
    for (const c of remote.chain) remoteByKey.set(interactionKey(c.entry), c);

    for (const c of local.chain) {
      const key = interactionKey(c.entry);
      const counterpart = remoteByKey.get(key);
      if (!counterpart) continue; // not a shared interaction (informational, not high-severity)
      if (counterpart.entry.effect !== c.entry.effect) {
        divergences.push({
          class: "effect-mismatch",
          severity: "high",
          detail: `interaction ${key}: local=${c.entry.effect} remote=${counterpart.entry.effect}`,
        });
      }
    }

    const failClosed = divergences.some((d) => d.severity === "high");
    return { status: divergences.length === 0 ? "consistent" : "divergent", divergences, failClosed };
  }
}
