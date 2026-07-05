/**
 * UCOS OPF — PostgreSQL `dom_ops` metadata journal adapter (AC-D1).
 *
 * Concrete {@link DomOpsJournal} backed by `dom_ops.metadata_kv` (migration V002). INSERT-only,
 * tenant-scoped, monotonic per-tenant sequence; replay is an ordered SELECT. This is the durable SoR
 * medium behind the substrate's durable MetadataPort adapter (DomOpsMetadataStore).
 *
 * Dependency-free by design: it depends on an injected {@link SqlExecutor} rather than a specific
 * driver, so the service composes it with its own pooled `pg` client (or a test double) without
 * adding a dependency to the substrate package. Append-only history is enforced by the migration-only
 * role (no UPDATE/DELETE). S3: no secret material is stored; S4: at-rest/TLS provided by the cluster.
 */

import type {
  DomOpsJournal,
  DomOpsJournalRecord,
  DomOpsMetadataEvent,
} from "../../../../packages/platform-runtime/src/persistence-runtime/index.ts";

/** Minimal result shape returned by a SQL query (driver-agnostic). */
export interface SqlQueryResult<R = Record<string, unknown>> {
  readonly rows: readonly R[];
}

/** Minimal parameterized-query executor. A pooled `pg` Pool/Client satisfies this structurally. */
export interface SqlExecutor {
  query<R = Record<string, unknown>>(
    sql: string,
    params?: readonly unknown[],
  ): Promise<SqlQueryResult<R>>;
}

export interface PgDomOpsJournalOptions {
  /** Tenant partition for deny-by-default, tenant-scoped journal reads/writes. */
  readonly tenantId: string;
  /** Fully-qualified append-only journal table. Defaults to the V002 SoR table. */
  readonly table?: string;
}

interface JournalRow {
  readonly seq: string | number;
  readonly v: string | number;
  readonly op: string;
  readonly key: string;
  readonly value_json: unknown;
  readonly schema_json: unknown;
}

export class PgDomOpsJournal implements DomOpsJournal {
  readonly #sql: SqlExecutor;
  readonly #tenantId: string;
  readonly #table: string;

  constructor(sql: SqlExecutor, options: PgDomOpsJournalOptions) {
    this.#sql = sql;
    this.#tenantId = options.tenantId;
    this.#table = options.table ?? "dom_ops.metadata_kv";
  }

  async append(event: DomOpsMetadataEvent): Promise<number> {
    // Monotonic per-tenant seq computed inline; INSERT-only. The unique(tenant_id, seq) constraint
    // and the insert-only role (V003) together guarantee append-only, gap-free ordering. A `revoke`
    // row carries a NULL value (op discriminates); a `put` row carries the value/schema.
    const isPut = event.op === "put";
    const result = await this.#sql.query<{ seq: string | number }>(
      `INSERT INTO ${this.#table} (tenant_id, seq, v, op, key, value_json, schema_json)
       VALUES ($1,
               (SELECT COALESCE(MAX(seq) + 1, 0) FROM ${this.#table} WHERE tenant_id = $1),
               $2, $3, $4, $5::jsonb, $6::jsonb)
       RETURNING seq`,
      [
        this.#tenantId,
        DOM_OPS_JOURNAL_ENVELOPE_VERSION,
        event.op,
        event.key,
        isPut ? JSON.stringify(event.value ?? null) : null,
        isPut && event.schema !== undefined ? JSON.stringify(event.schema) : null,
      ],
    );
    return Number(result.rows[0]!.seq);
  }

  async readAll(): Promise<DomOpsJournalRecord[]> {
    const result = await this.#sql.query<JournalRow>(
      `SELECT seq, v, op, key, value_json, schema_json
         FROM ${this.#table}
        WHERE tenant_id = $1
        ORDER BY seq ASC`,
      [this.#tenantId],
    );
    return result.rows.map((row) => {
      const event: DomOpsMetadataEvent =
        row.op === "revoke"
          ? { op: "revoke", key: row.key }
          : row.schema_json === null || row.schema_json === undefined
            ? { op: "put", key: row.key, value: row.value_json }
            : { op: "put", key: row.key, value: row.value_json, schema: row.schema_json as never };
      return { v: Number(row.v), seq: Number(row.seq), event };
    });
  }

  async size(): Promise<number> {
    const result = await this.#sql.query<{ count: string | number }>(
      `SELECT COUNT(*)::bigint AS count FROM ${this.#table} WHERE tenant_id = $1`,
      [this.#tenantId],
    );
    return Number(result.rows[0]!.count);
  }
}

/** Journal envelope version persisted per row; kept in sync with the substrate journal constant. */
const DOM_OPS_JOURNAL_ENVELOPE_VERSION = 1 as const;
