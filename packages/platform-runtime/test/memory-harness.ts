/**
 * Shared test harness for PI-9 memory suites. Not a test file (no ".test.ts").
 * Builds a composed substrate + wired Memory Fabric and helpers to create units/records, commit
 * (evolution-routed), and sign federated memory bundles (reusing federation crypto).
 */

import type { KeyObject } from "node:crypto";
import { createSubstrate } from "../src/bootstrap.ts";
import type { CapabilityInstance, Descriptor } from "../src/contracts/types.ts";
import { generateKeyPair, signPayload } from "../src/control/federation/assertions.ts";
import { PartitionMonitor } from "../src/control/federation/partition-handling.ts";
import { createMemory } from "../src/control/memory/memory-control.ts";
import { createRecord } from "../src/control/memory/memory-record.ts";
import { createUnit, unitHash } from "../src/control/memory/memory-unit.ts";
import type { MemoryCapacityPolicy } from "../src/control/memory/memory-capacity.ts";
import type { MemoryKnowledgeOracle } from "../src/control/memory/memory-knowledge-guard.ts";
import type {
  Classification,
  MemoryBundle,
  MemoryRecord,
  MemoryState,
  MemoryTier,
  MemoryUnit,
  RetentionClass,
} from "../src/control/memory/types.ts";

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

export const CLASS = {
  public: { label: "public", level: 0 },
  internal: { label: "internal", level: 1 },
  restricted: { label: "restricted", level: 2 },
  secret: { label: "secret", level: 3 },
} as const satisfies Record<string, Classification>;

export interface BuildMemoryExtra {
  capacity?: MemoryCapacityPolicy;
  knowledge?: MemoryKnowledgeOracle;
}

export async function buildMemory(partition?: PartitionMonitor, extra: BuildMemoryExtra = {}) {
  const substrate = createSubstrate();
  substrate.kernel.registerProvider("shout", (): CapabilityInstance => ({ operations: { produce: () => "OK" } }));
  substrate.kernel.loadDescriptors([textContract, shoutCapability]);
  await substrate.kernel.compose();
  const mem = createMemory(substrate, {
    nodeId: "node-local",
    ...(partition ? { partition } : {}),
    ...(extra.capacity ? { capacity: extra.capacity } : {}),
    ...(extra.knowledge ? { knowledge: extra.knowledge } : {}),
  });
  return { substrate, mem };
}

export interface UnitOpts {
  tier?: MemoryTier;
  namespace?: string;
  subjectRef?: string;
  value?: unknown;
  knowledgeRef?: string;
}

export function localUnit(id: string, opts: UnitOpts = {}): MemoryUnit {
  return createUnit({
    unitId: id,
    tier: opts.tier ?? "long-term",
    namespace: opts.namespace ?? "memory:long-term:subjectA",
    subjectRef: opts.subjectRef ?? "subjectA",
    value: opts.value ?? { note: id },
    ...(opts.knowledgeRef !== undefined ? { knowledgeRef: opts.knowledgeRef } : {}),
  });
}

export interface RecordOpts {
  memId?: string;
  version?: string;
  state?: MemoryState;
  classification?: Classification;
  retentionClass?: RetentionClass;
  trustLevel?: number;
  capturedAt?: number;
  expiresAt?: number;
  lineage?: string[];
  source?: MemoryRecord["source"];
}

export function localRecord(unit: MemoryUnit, opts: RecordOpts = {}): MemoryRecord {
  return createRecord({
    memId: opts.memId ?? unit.unitId,
    version: opts.version ?? "1.0.0",
    unit,
    source: opts.source ?? { kind: "local" },
    classification: opts.classification ?? CLASS.internal,
    trustLevel: opts.trustLevel ?? 5,
    provenance: { origin: "local" },
    retentionClass: opts.retentionClass ?? "durable",
    ...(opts.capturedAt !== undefined ? { capturedAt: opts.capturedAt } : {}),
    ...(opts.expiresAt !== undefined ? { expiresAt: opts.expiresAt } : {}),
    lineage: opts.lineage ?? [],
    state: opts.state ?? "active",
  });
}

/** Build + sign a federated memory bundle (reusing federation crypto). */
export function signedBundle(
  privateKey: KeyObject,
  record: MemoryRecord,
  opts: { issuer: string; issuerKeyRef: string; issuedAt?: number; expiresAt?: number; nonce?: string; tamper?: boolean },
): MemoryBundle {
  const now = opts.issuedAt ?? Date.now();
  const base = {
    record,
    issuer: opts.issuer,
    issuerKeyRef: opts.issuerKeyRef,
    issuedAt: now,
    expiresAt: opts.expiresAt ?? now + 60_000,
    nonce: opts.nonce ?? `n-${now}-${Math.random()}`,
  };
  const signature = signPayload(base, privateKey);
  if (opts.tamper) {
    // Tamper AFTER signing: mutate the unit so unitHash no longer matches (integrity break).
    const tamperedUnit = { ...record.unit, value: { note: "TAMPERED" } };
    return { ...base, record: { ...record, unit: tamperedUnit }, signature };
  }
  return { ...base, signature };
}

export { generateKeyPair, unitHash, PartitionMonitor };
