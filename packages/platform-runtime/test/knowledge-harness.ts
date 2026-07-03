/**
 * Shared test harness for PI-7 knowledge suites. Not a test file (no ".test.ts").
 * Builds a composed substrate + wired Knowledge Fabric with distinct role keys/principals
 * (separation of duties) and helpers to create, certify, ratify, and commit knowledge.
 */

import type { KeyObject } from "node:crypto";
import { createSubstrate } from "../src/bootstrap.ts";
import type { CapabilityInstance, Descriptor } from "../src/contracts/types.ts";
import { generateKeyPair } from "../src/control/federation/assertions.ts";
import { createKnowledge } from "../src/control/knowledge/knowledge-control.ts";
import { createRecord } from "../src/control/knowledge/knowledge-record.ts";
import { createUnit, unitHash } from "../src/control/knowledge/knowledge-unit.ts";
import type { KnowledgeRecord, KnowledgeState, KnowledgeUnit } from "../src/control/knowledge/types.ts";

const textContract: Descriptor = {
  kind: "contract",
  id: "contract.text-producer",
  version: "1.0.0",
  operations: [{ name: "produce", input: { type: "object" }, output: { type: "string" } }],
};
const shoutCapability: Descriptor = {
  kind: "capability",
  id: "cap.shout",
  version: "1.0.0",
  name: "Shout",
  contract: { id: "contract.text-producer", versionRange: "^1.0.0" },
  provider: { module: "plugin:shout", export: "create" },
};

export interface KnowRoleKeys {
  certifier: KeyObject;
  ratifier: KeyObject;
}

export async function buildKnowledge() {
  const substrate = createSubstrate();
  substrate.kernel.registerProvider("shout", (): CapabilityInstance => ({ operations: { produce: () => "OK" } }));
  substrate.kernel.loadDescriptors([textContract, shoutCapability]);
  await substrate.kernel.compose();

  const know = createKnowledge(substrate, { nodeId: "node-local" });

  // Distinct role keys (SoD): certifier + ratifier.
  const certKeys = generateKeyPair();
  const ratKeys = generateKeyPair();
  know.keys.register("know-cert-key", certKeys.publicKeyPem);
  know.keys.register("know-rat-key", ratKeys.publicKeyPem);
  know.certifications.register({ caId: "kca1", owner: "carol-certifier", keyRef: "know-cert-key" });
  know.ratifications.register({ raId: "kra1", owner: "rachel-ratifier", keyRef: "know-rat-key", quorum: 1 });

  return { substrate, know, roleKeys: { certifier: certKeys.privateKey, ratifier: ratKeys.privateKey } as KnowRoleKeys };
}

export function localUnit(id: string, namespace = "knowledge:demo:facts", payload: unknown = { fact: 1 }): KnowledgeUnit {
  return createUnit({ unitId: id, title: id, namespace, payload });
}

export function localRecord(
  unit: KnowledgeUnit,
  opts: { knowledgeId?: string; version?: string; state?: KnowledgeState; trustLevel?: number; lineage?: string[] } = {},
): KnowledgeRecord {
  return createRecord({
    knowledgeId: opts.knowledgeId ?? unit.unitId,
    version: opts.version ?? "1.0.0",
    unit,
    source: { kind: "local" },
    trustLevel: opts.trustLevel ?? 5,
    provenance: { origin: "local" },
    lineage: opts.lineage ?? [],
    state: opts.state ?? "active",
    knowledgeClass: "authoritative",
  });
}

/** Produce a valid knowledge certification + ratification (distinct principals, SoD-satisfying). */
export function govern(
  know: Awaited<ReturnType<typeof buildKnowledge>>["know"],
  keys: KnowRoleKeys,
  uh: string,
) {
  const cert = know.certifications.issue(keys.certifier, { unitHash: uh, caId: "kca1" });
  const rat = know.ratifications.issue(keys.ratifier, {
    unitHash: uh,
    raId: "kra1",
    author: "aaron-author",
    validators: ["victor-validator"],
    certifier: "carol-certifier",
    certificationId: cert.certificationId,
  });
  return { cert, rat };
}

/** Full create->certify->ratify->commit of an active record. Returns the record + unitHash. */
export async function commitActive(
  know: Awaited<ReturnType<typeof buildKnowledge>>["know"],
  keys: KnowRoleKeys,
  unit: KnowledgeUnit,
  opts: { knowledgeId?: string; version?: string; trustLevel?: number; lineage?: string[] } = {},
): Promise<{ record: KnowledgeRecord; unitHash: string }> {
  const record = localRecord(unit, { ...opts, state: "active" });
  const uh = unitHash(unit);
  const { cert, rat } = govern(know, keys, uh);
  await know.commit(record, { certification: cert, ratification: rat });
  return { record, unitHash: uh };
}
