/**
 * UCOS Federation Fabric — Federation Resolver (FED-ARCH-001 async ingestion + FED-SEC-001 verify).
 *
 * The single async entry that turns a signed FederationBundle into a verified, clamped,
 * provenance-tagged identity MATERIALIZED into the substrate Metadata runtime. After ingestion the
 * existing synchronous PI-4 decision path (IdentityResolver -> TrustEvaluator -> PolicyEvaluator ->
 * kernel) operates unchanged over the materialized data. Every failure is fail-closed (deny).
 *
 * Verification chain (per assertion): signature -> issuer is active in-boundary authority with the
 * required power -> subject node admitted + membership active -> fresh (unexpired) -> nonce unused
 * (replay) -> not revoked. Trust is CLAMPED to min(asserted, delegation cap, boundary ceiling).
 */

import type { MetadataPort } from "../../meta-core/ports.ts";
import type { IdentityRecord, Provenance } from "../types.ts";
import type {
  AssertionType,
  FederationBundle,
  IdentityAssertion,
  TrustAssertion,
  VerificationResult,
} from "./types.ts";
import { namespacedId } from "./types.ts";
import type { KeyRegistry, NonceCache } from "./assertions.ts";
import { verifyPayload, isFresh } from "./assertions.ts";
import type { FederationNodeRegistry } from "./federation-node.ts";
import type { FederationAuthorityRegistry } from "./federation-authority.ts";
import type { TrustBoundaryRegistry } from "./trust-boundary.ts";
import type { TrustDelegationRegistry } from "./trust-delegation.ts";
import type { MembershipRegistry } from "./federation-membership.ts";
import type { RevocationAuthorityRegistry } from "./revocation-authority.ts";
import type { PartitionMonitor } from "./partition-handling.ts";
import { materializedKey, type MaterializedIdentity } from "./federated-identity-provider.ts";

export interface FederationResolverPorts {
  metadata: MetadataPort;
  keys: KeyRegistry;
  nodes: FederationNodeRegistry;
  authorities: FederationAuthorityRegistry;
  boundaries: TrustBoundaryRegistry;
  delegations: TrustDelegationRegistry;
  memberships: MembershipRegistry;
  revocations: RevocationAuthorityRegistry;
  nonces: NonceCache;
  partition: PartitionMonitor;
}

export interface FederationResolverOptions {
  boundaryId: string;
  nonceTtlMs?: number; // default 10 min
  materializedTtlMs?: number; // default 5 min hard staleness
}

export interface EnsureResult extends VerificationResult {
  identityId?: string; // namespaced id on success
  trustLevel?: number;
}

export class FederationResolver {
  readonly #p: FederationResolverPorts;
  readonly #boundaryId: string;
  readonly #nonceTtl: number;
  readonly #matTtl: number;

  constructor(ports: FederationResolverPorts, options: FederationResolverOptions) {
    this.#p = ports;
    this.#boundaryId = options.boundaryId;
    this.#nonceTtl = options.nonceTtlMs ?? 600_000;
    this.#matTtl = options.materializedTtlMs ?? 300_000;
  }

  /** Async ingestion. Verifies the bundle, clamps trust, materializes the identity. Fail-closed. */
  async ensure(bundle: FederationBundle, now: number = Date.now()): Promise<EnsureResult> {
    // (async by contract — real remote fetch would await here; verification below is deterministic)
    const idA = bundle.identity;

    const idCheck = this.#verifyEnvelope(idA, "identity", now);
    if (!idCheck.ok) return idCheck;

    const fullId = namespacedId(idA.subject.nodeId, idA.subject.identityId);

    // Identity revocation (fail-closed via partition-aware registry).
    if (this.#p.revocations.isRevoked("identity", fullId)) {
      return { ok: false, reason: `identity "${fullId}" is revoked` };
    }

    // Trust: default 0; if a trust assertion is present, verify + clamp.
    let trustLevel = 0;
    if (bundle.trust) {
      const trustCheck = this.#verifyEnvelope(bundle.trust, "trust", now);
      if (!trustCheck.ok) return trustCheck;
      trustLevel = this.#clampTrust(bundle.trust);
    }

    const node = this.#p.nodes.get(idA.subject.nodeId)!; // existence guaranteed by envelope check
    const authority = this.#p.authorities.get(idA.issuer)!;
    const provenance: Provenance = {
      origin: { nodeId: node.nodeId, homeDomain: node.homeDomain },
      assertedBy: idA.issuer,
      assertionRef: idA.nonce,
      verifiedAt: now,
      signatureRef: authority.keyRef,
    };

    const record: IdentityRecord = {
      id: fullId,
      kind: idA.claims.kind,
      status: "active",
      permissions: [...idA.claims.permissions],
      trust: { level: trustLevel },
      attributes: { ...(idA.claims.attributes ?? {}), provenance },
    };

    const materialized: MaterializedIdentity = {
      record,
      materializedAt: now,
      expiresAt: Math.min(idA.expiresAt, now + this.#matTtl),
      trustLevel,
    };
    this.#p.metadata.put(materializedKey(idA.subject.nodeId, idA.subject.identityId), materialized);

    return { ok: true, reason: "federated identity verified & materialized", identityId: fullId, trustLevel };
  }

  /** Shared envelope verification for identity and trust assertions. */
  #verifyEnvelope(a: IdentityAssertion | TrustAssertion, type: AssertionType, now: number): VerificationResult {
    if (a.assertionType !== type) return { ok: false, reason: `assertion type mismatch (${a.assertionType} != ${type})` };

    const node = this.#p.nodes.get(a.subject.nodeId);
    if (!node) return { ok: false, reason: `unknown node "${a.subject.nodeId}"` };
    if (!this.#p.nodes.isActive(a.subject.nodeId)) return { ok: false, reason: `node "${a.subject.nodeId}" not admitted (${node.status})` };
    if (!this.#p.memberships.isActive(a.subject.nodeId, now)) return { ok: false, reason: `no active membership for node "${a.subject.nodeId}"` };

    const authority = this.#p.authorities.get(a.issuer);
    if (!authority) return { ok: false, reason: `unknown authority "${a.issuer}"` };
    const power = type === "identity" ? "identity" : "trust";
    if (!this.#p.authorities.hasPower(a.issuer, power)) return { ok: false, reason: `authority "${a.issuer}" lacks power "${power}"` };
    if (authority.nodeId !== a.subject.nodeId) return { ok: false, reason: `authority "${a.issuer}" is not owned by node "${a.subject.nodeId}"` };

    // Trust boundary: issuer must be in-boundary and the boundary must accept this assertion type.
    if (!this.#p.boundaries.contains(this.#boundaryId, a.issuer)) return { ok: false, reason: `authority "${a.issuer}" outside trust boundary "${this.#boundaryId}"` };
    if (!this.#p.boundaries.accepts(this.#boundaryId, type)) return { ok: false, reason: `boundary "${this.#boundaryId}" does not accept "${type}" assertions` };

    // Partition: the issuing authority must be reachable (fail-closed).
    if (!this.#p.partition.reachable(`authority:${a.issuer}`)) return { ok: false, reason: `authority "${a.issuer}" unreachable (partition; fail-closed)` };

    if (!isFresh(a.issuedAt, a.expiresAt, now)) return { ok: false, reason: "assertion expired / not fresh" };

    const pub = this.#p.keys.get(authority.keyRef);
    if (!pub) return { ok: false, reason: `no public key for keyRef "${authority.keyRef}"` };
    const sig = a.signature;
    if (!sig) return { ok: false, reason: "assertion unsigned" };
    const { signature: _omit, ...payload } = a;
    if (!verifyPayload(payload, sig, pub)) return { ok: false, reason: "invalid assertion signature" };

    // Replay: nonce single-use per issuer.
    if (!this.#p.nonces.checkAndRecord(a.issuer, a.nonce, this.#nonceTtl, now)) {
      return { ok: false, reason: "assertion nonce replay detected" };
    }

    return { ok: true, reason: "envelope verified" };
  }

  /** Clamp asserted trust to min(asserted, delegation cap for issuer/scope, boundary ceiling). */
  #clampTrust(t: TrustAssertion): number {
    const authority = this.#p.authorities.get(t.issuer)!;
    const delegationCap = this.#p.delegations.maxLevelFor(t.issuer, authority.scope);
    const boundaryCap = this.#p.boundaries.maxTrustLevel(this.#boundaryId);
    return Math.max(0, Math.min(t.level, delegationCap, boundaryCap));
  }
}
