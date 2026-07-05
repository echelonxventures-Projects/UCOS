/**
 * UCOS OPF — durable MetadataPort composition (AC-D1).
 *
 * Wires the substrate's `DomOpsMetadataStore` over the PostgreSQL `PgDomOpsJournal` to produce a
 * restart-safe, `dom_ops`-backed MetadataPort for the operational-proof service. This is the
 * deployable wiring proving AC-D1: a service metadata surface whose durable record is `dom_ops`.
 *
 * Composition-first: the substrate exposes the port contract and the journal interface; this module
 * only assembles concrete adapters. No substrate/core-dir change (UPP-1); the MetadataPort signature
 * is unchanged. Fail-closed (UPP-5): rehydration and durable appends surface errors rather than
 * silently degrading.
 */

import type { MetadataPort } from "../../../../packages/platform-runtime/src/meta-core/ports.ts";
import { DomOpsMetadataStore } from "../../../../packages/platform-runtime/src/persistence-runtime/index.ts";
import { PgDomOpsJournal, type SqlExecutor } from "./pg-dom-ops-journal.ts";

/** Resolves an opaque `external://…` reference to a secret value (KMS/secret-store injected). */
export type SecretResolver = (ref: string) => string | Promise<string>;

/** A TLS-1.3-enforced Postgres connection config (consumed by the caller's driver; no driver added). */
export interface PgConnectionConfig {
  readonly connectionString: string;
  readonly ssl: { readonly minVersion: "TLSv1.3"; readonly rejectUnauthorized: true };
}

export interface ResolvePgConnectionOptions {
  /** DSN reference — MUST be `external://…` (S3: no inline credentials in code/config). */
  readonly dsnRef: string;
  /** Injected resolver (KMS / secret store) — the only place credentials materialize. */
  readonly resolveSecret: SecretResolver;
}

/**
 * Resolve a Postgres connection by reference and enforce TLS 1.3 (D1-4 / S3+S4).
 * Fail-closed: rejects any DSN that is not an `external://` reference (no inline secrets) and any
 * resolved value that is not a postgres DSN. Returns a config pinning minimum TLS 1.3 with
 * certificate verification for the caller's pooled client.
 */
export async function resolvePgConnection(options: ResolvePgConnectionOptions): Promise<PgConnectionConfig> {
  if (!options.dsnRef.startsWith("external://")) {
    throw new Error("dsnRef must be an external:// reference (S3: no inline credentials)");
  }
  const connectionString = await options.resolveSecret(options.dsnRef);
  if (!/^postgres(ql)?:\/\//.test(connectionString)) {
    throw new Error("resolved DSN is not a postgres connection string (fail-closed)");
  }
  return { connectionString, ssl: { minVersion: "TLSv1.3", rejectUnauthorized: true } };
}

export interface DurableMetadataComposition {
  /** The durable, `dom_ops`-backed MetadataPort (kernel/fabric-facing surface). */
  readonly metadata: MetadataPort;
  /** Await the durable consistency boundary: all enqueued writes are persisted to `dom_ops`. */
  drain(): Promise<void>;
}

export interface ComposeDurableMetadataOptions {
  /** Injected parameterized-query executor (a pooled `pg` client satisfies this structurally). */
  readonly sql: SqlExecutor;
  /** Tenant partition for deny-by-default, tenant-scoped persistence. */
  readonly tenantId: string;
  /** Reject values failing their attached schema on write (fail-closed). Default: true. */
  readonly validateOnWrite?: boolean;
  /** Override the append-only journal table (defaults to the V002 SoR table). */
  readonly table?: string;
}

/**
 * Compose a durable, `dom_ops`-backed MetadataPort. The returned store is fully rehydrated from the
 * journal before it is handed back, so the service starts with authoritative state restored.
 */
export async function composeDurableMetadata(
  options: ComposeDurableMetadataOptions,
): Promise<DurableMetadataComposition> {
  const journal = new PgDomOpsJournal(options.sql, {
    tenantId: options.tenantId,
    table: options.table,
  });
  const store = await DomOpsMetadataStore.open(journal, {
    validateOnWrite: options.validateOnWrite ?? true,
  });
  return {
    metadata: store,
    drain: () => store.drain(),
  };
}
