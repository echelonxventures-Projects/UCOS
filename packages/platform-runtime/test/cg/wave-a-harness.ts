/**
 * Wave-A shared test harness (PCAMG-RUNTIME-0102A). NOT a test file — matches the established
 * non-collected harness naming convention, so the ".test.ts" runner glob ignores it.
 *
 * Composes a fresh constitutional-governance runtime (CGR-CORE-04) via the deterministic clock and
 * seeds a canonical, acyclic, multi-level authority corpus so the ACR/AVR suites exercise real
 * up-trace chains of varying depth. Seeding uses ONLY the Wave-1 propose path (append-only,
 * audited); the harness itself performs no Wave-A write.
 */

import {
  composeConstitutionalGovernance,
  fixedClock,
} from "../../src/control/constitutional-governance/index.ts";
import type { ConstitutionalGovernance } from "../../src/control/constitutional-governance/composition-root.ts";
import { createAuthorityReadModel } from "../../src/control/constitutional-governance/authority/read-model.ts";
import type { AuthorityReadModel } from "../../src/control/constitutional-governance/authority/read-model.ts";

/** Compose a fresh, deterministic governance runtime (originates nothing at construction). */
export function makeGovernance(): ConstitutionalGovernance {
  return composeConstitutionalGovernance({ clock: fixedClock() });
}

/**
 * Seed the canonical layered authority corpus into a composed runtime:
 *
 *   PCAMG-PRIN-001 (root)
 *     ← PCAMG-META-I            (depth chain via meta)
 *         ← PDC-GOV             (domain, centerRef PGC-ROOT)
 *             ← POL-1           (policy, domainRef PDC-GOV)
 *                 ← CAP-01      (capability, domainRef PDC-GOV, policyRef POL-1)
 *     ← PGC-ROOT                (center)
 *     ← GOV-0001                (candidate)
 *   E-1 (trace, empty up-trace, NON-root) ← AD-0001 (decision)  → an intentionally INCOMPLETE chain
 */
export function seedAuthorityCorpus(gov: ConstitutionalGovernance): void {
  gov.principles.propose({
    logicalId: "PCAMG-PRIN-001",
    version: "1.0.0",
    ownerAuthority: "board",
    content: { statement: "Sovereignty Origin = Invariant Principles" },
    createdBy: "board",
  });
  gov.meta.propose({
    logicalId: "PCAMG-META-I",
    version: "1.0.0",
    ownerAuthority: "board",
    content: { article: "Supremacy" },
    createdBy: "board",
    upTrace: ["PCAMG-PRIN-001"],
  });
  gov.centers.propose({
    logicalId: "PGC-ROOT",
    version: "1.0.0",
    ownerAuthority: "board",
    content: {},
    createdBy: "board",
    upTrace: ["PCAMG-PRIN-001"],
  });
  gov.domains.propose({
    logicalId: "PDC-GOV",
    version: "1.0.0",
    ownerAuthority: "PGC-ROOT",
    content: { centerRef: "PGC-ROOT" },
    createdBy: "board",
    upTrace: ["PCAMG-META-I"],
  });
  gov.policies.propose({
    logicalId: "POL-1",
    version: "1.0.0",
    ownerAuthority: "PDC-GOV",
    content: { domainRef: "PDC-GOV", effect: "deny" },
    createdBy: "board",
    upTrace: ["PDC-GOV"],
  });
  gov.capabilities.propose({
    logicalId: "CAP-01",
    version: "1.0.0",
    ownerAuthority: "PDC-GOV",
    content: { domainRef: "PDC-GOV", policyRef: "POL-1" },
    createdBy: "board",
    upTrace: ["POL-1"],
  });
  gov.governanceCandidates.propose({
    logicalId: "GOV-0001",
    version: "1.0.0",
    ownerAuthority: "compiler",
    content: { generationRef: "gen-1", candidate: true },
    createdBy: "compiler",
    upTrace: ["PCAMG-PRIN-001"],
  });
  // A trace record: empty up-trace, but registry REG-TRACE (NOT a principle root).
  gov.traces.propose({
    logicalId: "E-1",
    version: "1.0.0",
    ownerAuthority: "author",
    content: { from: "PCAMG-META-I", to: "PCAMG-PRIN-001", relation: "derives-from", layerFrom: 1, layerTo: 0 },
    createdBy: "author",
  });
  // A decision that up-traces to the trace record → its terminal is a non-principle ⇒ INCOMPLETE.
  gov.decisions.propose({
    logicalId: "AD-0001",
    version: "1.0.0",
    ownerAuthority: "board",
    content: { proposer: "p", certifier: "c", ratifier: "r", subjectRef: "E-1" },
    createdBy: "board",
    upTrace: ["E-1"],
  });
}

/** A fully seeded runtime plus its read-model and the canonical subject ids for the suites. */
export interface SeededRuntime {
  readonly gov: ConstitutionalGovernance;
  readonly readModel: AuthorityReadModel;
  readonly subjects: {
    readonly root: string; // depth 0, self-root
    readonly shallow: string; // depth 1 complete
    readonly mid: string; // depth 2 complete
    readonly deep: string; // depth 4 complete
    readonly candidate: string; // depth 1 complete
    readonly incomplete: string; // terminates at a non-principle
    readonly unknown: string; // absent
  };
}

export function seededRuntime(): SeededRuntime {
  const gov = makeGovernance();
  seedAuthorityCorpus(gov);
  return {
    gov,
    readModel: createAuthorityReadModel(gov),
    subjects: {
      root: "PCAMG-PRIN-001",
      shallow: "PCAMG-META-I",
      mid: "PDC-GOV",
      deep: "CAP-01",
      candidate: "GOV-0001",
      incomplete: "AD-0001",
      unknown: "DOES-NOT-EXIST",
    },
  };
}
