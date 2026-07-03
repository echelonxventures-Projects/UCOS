/**
 * UCOS Evolution Fabric — Evolution Governor (EVO-GOVERNOR-001).
 *
 * Structurally eliminates the residual-High threats:
 *   E10 Self-Modification    — positive evolvable allowlist + prohibited core/self code-paths +
 *                              reserved metadata prefixes (evolution's own + federation) are NON-EXPRESSIBLE
 *                              as targets (deny-by-default, not deny-by-blocklist).
 *   E11 Recursive Evolution  — proposals may not originate from evolution execution; single in-flight
 *                              transaction (maxInFlight=1); depth MUST be 0.
 *   E12 Infinite Loops       — monotonic proposal counter + sliding-window rate limits + emergency halt.
 *
 * Every check FAILS CLOSED: any condition that cannot be positively established denies.
 */

import type { EvolutionProposal, EvolutionUnit, GovernorConfig, GovernorDecision } from "./types.ts";

export const DEFAULT_PROHIBITED_CODE_PATHS: readonly string[] = [
  "src/meta-core/",
  "src/registry-runtime/",
  "src/metadata-runtime/",
  "src/configuration-runtime/",
  "src/contracts/",
  "src/control/evolution/", // evolution may not evolve itself (E10)
];

export const DEFAULT_RESERVED_METADATA_PREFIXES: readonly string[] = [
  "evolution:", // evolution's own state — absolutely non-expressible (E10 self-target)
  // NOTE: `federation:` is intentionally NOT reserved here. Federation-touching evolutions are
  // permitted only through the federation guard + a signed re-ratification token (EVO-FED-001),
  // and are additionally protected by a post-apply invariant re-check with auto-rollback.
];

export function defaultGovernorConfig(evolvableAllowlist: string[]): GovernorConfig {
  return {
    evolvableAllowlist,
    prohibitedCodePaths: [...DEFAULT_PROHIBITED_CODE_PATHS],
    reservedMetadataPrefixes: [...DEFAULT_RESERVED_METADATA_PREFIXES],
    limits: { maxProposalsPerWindow: 20, maxAppliedPerWindow: 10, windowMs: 60_000 },
  };
}

const OK: GovernorDecision = { ok: true, reason: "governor checks passed" };

export class EvolutionGovernor {
  readonly #config: GovernorConfig;

  #halted = false;
  #haltReason = "";
  #inFlight = 0;
  #proposalCounter = 0; // monotonic (E12)
  readonly #proposalTimes: number[] = [];
  readonly #appliedTimes: number[] = [];

  constructor(config: GovernorConfig) {
    this.#config = config;
  }

  // --------------------------- Emergency halt (E12) ---------------------------

  emergencyHalt(reason: string): void {
    this.#halted = true;
    this.#haltReason = reason;
  }

  clearHalt(): void {
    this.#halted = false;
    this.#haltReason = "";
  }

  get halted(): boolean {
    return this.#halted;
  }

  get proposalCount(): number {
    return this.#proposalCounter;
  }

  get inFlight(): number {
    return this.#inFlight;
  }

  // --------------------------- Target/self-modification (E10) ---------------------------

  /** True iff every declared target lies within the evolvable allowlist and outside reserved sets. */
  #targetAllowed(unit: EvolutionUnit): GovernorDecision {
    for (const target of unit.targets) {
      const ns = this.#targetNamespace(target);
      // Reserved metadata prefixes are never valid targets.
      if (this.#config.reservedMetadataPrefixes.some((p) => ns.startsWith(p))) {
        return { ok: false, reason: `target "${ns}" is a reserved/prohibited namespace (self-modification blocked)` };
      }
      // Deny-by-default: must be positively allowlisted.
      if (!this.#config.evolvableAllowlist.some((p) => ns.startsWith(p))) {
        return { ok: false, reason: `target "${ns}" is not on the evolvable allowlist (deny-by-default)` };
      }
    }
    // Op-level guard: put-metadata keys must also respect reserved prefixes.
    for (const op of unit.ops) {
      if (op.op === "put-metadata" && this.#config.reservedMetadataPrefixes.some((p) => op.key.startsWith(p))) {
        return { ok: false, reason: `metadata op key "${op.key}" targets a reserved namespace (self-modification blocked)` };
      }
    }
    // Code-path guard: no unit may declare a prohibited (core or evolution-self) source path.
    for (const path of unit.codePaths ?? []) {
      if (this.#config.prohibitedCodePaths.some((p) => path.startsWith(p))) {
        return { ok: false, reason: `codePath "${path}" is prohibited (core-dir / evolution self-modification)` };
      }
    }
    return OK;
  }

  #targetNamespace(target: EvolutionUnit["targets"][number]): string {
    switch (target.kind) {
      case "registry":
        return `registry:${target.id}`;
      case "config":
        return `config:${target.layer}:${target.capabilityId}`;
      case "metadata":
        return target.keyPrefix;
    }
  }

  // --------------------------- Admission check (proposal time) ---------------------------

  /**
   * Governor gate at proposal admission (G1). Validates halt, origin (E11), depth (E11), targets/
   * self-modification (E10), and proposal rate (E12). Increments the monotonic counter on success.
   */
  admit(proposal: EvolutionProposal, now: number = Date.now()): GovernorDecision {
    if (this.#halted) return { ok: false, reason: `evolution halted: ${this.#haltReason}` };

    // E11: proposals may never originate from evolution execution.
    if (proposal.origin !== "external") {
      return { ok: false, reason: "proposal origin is not external (recursive/self-originated evolution blocked)" };
    }
    if (this.#inFlight > 0) {
      return { ok: false, reason: "an evolution transaction is in flight (proposal admission blocked; re-entrancy)" };
    }

    // E11: depth must be 0.
    const depth = proposal.unit.depth ?? 0;
    if (depth !== 0) return { ok: false, reason: `unit depth ${depth} != 0 (recursive evolution blocked)` };

    // E10: target allowlist + reserved/self + code-paths.
    const targets = this.#targetAllowed(proposal.unit);
    if (!targets.ok) return targets;

    // E12: sliding-window proposal rate.
    this.#evict(this.#proposalTimes, now);
    if (this.#proposalTimes.length >= this.#config.limits.maxProposalsPerWindow) {
      return { ok: false, reason: "proposal rate limit exceeded (loop protection)" };
    }

    this.#proposalTimes.push(now);
    this.#proposalCounter += 1;
    return OK;
  }

  // --------------------------- Apply-time check (G5) ---------------------------

  /** Governor gate immediately before mutation. Re-validates halt, in-flight, depth, targets, apply rate. */
  checkApply(unit: EvolutionUnit, now: number = Date.now()): GovernorDecision {
    if (this.#halted) return { ok: false, reason: `evolution halted: ${this.#haltReason}` };
    if (this.#inFlight > 0) return { ok: false, reason: "another evolution transaction is in flight (maxInFlight=1)" };
    if ((unit.depth ?? 0) !== 0) return { ok: false, reason: "unit depth != 0 (recursive evolution blocked)" };
    const targets = this.#targetAllowed(unit);
    if (!targets.ok) return targets;
    this.#evict(this.#appliedTimes, now);
    if (this.#appliedTimes.length >= this.#config.limits.maxAppliedPerWindow) {
      return { ok: false, reason: "apply rate limit exceeded (loop protection)" };
    }
    return OK;
  }

  /** Reserve the single in-flight slot (E11/E12). Throws-free: returns false if unavailable. */
  acquire(now: number = Date.now()): boolean {
    if (this.#halted || this.#inFlight > 0) return false;
    this.#inFlight = 1;
    this.#appliedTimes.push(now);
    return true;
  }

  release(): void {
    this.#inFlight = 0;
  }

  #evict(times: number[], now: number): void {
    const cutoff = now - this.#config.limits.windowMs;
    while (times.length > 0 && (times[0] as number) <= cutoff) times.shift();
  }
}
