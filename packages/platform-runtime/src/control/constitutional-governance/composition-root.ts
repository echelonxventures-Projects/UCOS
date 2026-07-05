/**
 * CGR-CORE-04 — Constitutional Governance composition root (Wave-1 finalization).
 *
 * Deterministic dependency composition of the eleven registries + the audit hash-chain:
 *   - registry wiring     : one reused append-only log PER registry (no shared-log cross-talk;
 *                           each registry derives its state from its own log replay);
 *   - resolver wiring     : cross-registry existence resolvers bound to head projections
 *                           (META→PRIN, DOMAIN→CENTER, POLICY→DOMAIN, CAP→DOMAIN+POLICY);
 *   - audit wiring        : every RG-8 emission is appended to the shared AuditHashChain spine;
 *   - fail-closed startup : composition creates ZERO records and asserts a genesis chain; any
 *                           non-empty registry or non-genesis head aborts construction.
 *
 * REUSE ONLY: storage is the platform `InMemoryAppendOnlyLog`; hashing/audit-chain are the CGR
 * primitives (which route through the platform canonicalize + sha256). No new storage, clock, or
 * crypto is introduced here.
 *
 * HARD SCOPE GUARD (0031): this root COMPOSES only. It NEVER activates governance, NEVER creates
 * ACTIVE state (unrepresentable by type — see types.ts `RecordStatus`), and NEVER originates
 * authority — not a single record is proposed during construction.
 */

import { InMemoryAppendOnlyLog } from "../../persistence-runtime/append-only-log.ts";
import type { AppendOnlyLog } from "../../persistence-runtime/append-only-log.ts";
import { AuditHashChain, GENESIS_PREV_HASH } from "./audit-chain.ts";
import { CgValidationError } from "./append-only.ts";
import { REGISTRY_NAMES } from "./types.ts";
import type { AuditEvent, AuditSink, Clock, RegistryName } from "./types.ts";
import { ConstitutionalRegistry } from "./registries/registry-base.ts";
import {
  createAuditRegistry,
  createCapabilityRegistry,
  createCenterRegistry,
  createConsentRegistry,
  createDecisionRegistry,
  createDomainRegistry,
  createGovernanceCandidateRegistry,
  createMetaRegistry,
  createPolicyRegistry,
  createPrincipleRegistry,
  createTraceRegistry,
} from "./registries/index.ts";

/** Options for composition. All seams are injectable; defaults are deterministic and fail-closed. */
export interface ConstitutionalGovernanceOptions {
  /**
   * Deterministic time seam. Defaults to a private deterministic clock — the runtime NEVER
   * silently reaches for a wall-clock (audit `at` feeds the tamper-evident chain).
   */
  readonly clock?: Clock;
  /** Append-only log factory; one fresh log is drawn per registry. Defaults to the in-memory log. */
  readonly logFactory?: () => AppendOnlyLog;
}

/** The fully composed constitutional-governance runtime surface (propose-only; no ACTIVE state). */
export interface ConstitutionalGovernance {
  readonly principles: ConstitutionalRegistry;
  readonly meta: ConstitutionalRegistry;
  readonly governanceCandidates: ConstitutionalRegistry;
  readonly centers: ConstitutionalRegistry;
  readonly domains: ConstitutionalRegistry;
  readonly policies: ConstitutionalRegistry;
  readonly capabilities: ConstitutionalRegistry;
  readonly consents: ConstitutionalRegistry;
  readonly decisions: ConstitutionalRegistry;
  readonly traces: ConstitutionalRegistry;
  readonly audit: ConstitutionalRegistry;
  /** The tamper-evident audit hash-chain that every RG-8 emission extends. */
  readonly auditChain: AuditHashChain;
  /** Fail-closed registry resolver by canonical name. Throws on an unknown name. */
  readonly registry: (name: RegistryName) => ConstitutionalRegistry;
  /** The deterministic clock seam threaded into every registry. */
  readonly clock: Clock;
}

/** Private default clock: strictly increasing, reproducible ISO instants (no wall-clock). */
function deterministicClock(): Clock {
  let current = 1_700_000_000_000;
  return () => {
    const iso = new Date(current).toISOString();
    current += 1_000;
    return iso;
  };
}

/**
 * Fail-closed startup invariant. Verifies the composed runtime originated NOTHING: every registry
 * is empty and the audit chain sits at genesis. Any deviation aborts construction (deny-by-default).
 */
export function assertFailClosedStartup(cg: ConstitutionalGovernance): void {
  for (const name of REGISTRY_NAMES) {
    const size = cg.registry(name).size();
    if (size !== 0) {
      throw new CgValidationError(
        `fail-closed startup violated: ${name} must be empty at composition (found ${size})`,
        { registry: name, size },
      );
    }
  }
  if (cg.auditChain.size() !== 0 || cg.auditChain.head() !== GENESIS_PREV_HASH) {
    throw new CgValidationError("fail-closed startup violated: audit chain must start at genesis", {
      head: cg.auditChain.head(),
      size: cg.auditChain.size(),
    });
  }
}

/**
 * Deterministically compose the constitutional-governance runtime. Construction is side-effect
 * free with respect to governance state: no record is proposed, no ACTIVE state is created, and no
 * authority is originated. Two compositions with equivalent options are structurally identical.
 */
export function composeConstitutionalGovernance(
  options: ConstitutionalGovernanceOptions = {},
): ConstitutionalGovernance {
  const clock = options.clock ?? deterministicClock();
  const newLog = options.logFactory ?? (() => new InMemoryAppendOnlyLog());

  // Audit wiring: a single shared hash-chain spine; every RG-8 emission extends it.
  const auditChain = new AuditHashChain();
  const auditSink: AuditSink = (event: AuditEvent) => {
    auditChain.append(event);
  };

  // Registry wiring (one fresh log each) + resolver wiring (head-projection existence predicates).
  const principles = createPrincipleRegistry({ log: newLog(), clock, auditSink });
  const meta = createMetaRegistry({
    log: newLog(),
    clock,
    auditSink,
    principleExists: (id) => !!principles.getLatest(id),
  });
  const governanceCandidates = createGovernanceCandidateRegistry({ log: newLog(), clock, auditSink });
  const centers = createCenterRegistry({ log: newLog(), clock, auditSink });
  const domains = createDomainRegistry({
    log: newLog(),
    clock,
    auditSink,
    centerExists: (id) => !!centers.getLatest(id),
  });
  const policies = createPolicyRegistry({
    log: newLog(),
    clock,
    auditSink,
    domainExists: (id) => !!domains.getLatest(id),
  });
  const capabilities = createCapabilityRegistry({
    log: newLog(),
    clock,
    auditSink,
    domainExists: (id) => !!domains.getLatest(id),
    policyExists: (id) => !!policies.getLatest(id),
  });
  const consents = createConsentRegistry({ log: newLog(), clock, auditSink });
  const decisions = createDecisionRegistry({ log: newLog(), clock, auditSink });
  const traces = createTraceRegistry({ log: newLog(), clock, auditSink });
  const audit = createAuditRegistry({ log: newLog(), clock, auditSink });

  const byName: Record<RegistryName, ConstitutionalRegistry> = {
    "REG-PRIN": principles,
    "REG-META": meta,
    "REG-GOV": governanceCandidates,
    "REG-CENTER": centers,
    "REG-DOMAIN": domains,
    "REG-POLICY": policies,
    "REG-CAP": capabilities,
    "REG-CONSENT": consents,
    "REG-DECISION": decisions,
    "REG-TRACE": traces,
    "REG-AUDIT": audit,
  };

  const registry = (name: RegistryName): ConstitutionalRegistry => {
    const reg = byName[name];
    if (!reg) {
      throw new CgValidationError(`unknown registry: ${String(name)}`, { name });
    }
    return reg;
  };

  const composed: ConstitutionalGovernance = {
    principles,
    meta,
    governanceCandidates,
    centers,
    domains,
    policies,
    capabilities,
    consents,
    decisions,
    traces,
    audit,
    auditChain,
    registry,
    clock,
  };

  // Fail-closed startup: prove the runtime originated nothing before handing it back.
  assertFailClosedStartup(composed);
  return composed;
}
