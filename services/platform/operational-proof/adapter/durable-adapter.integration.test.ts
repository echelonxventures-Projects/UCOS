/**
 * AC-D1 remediation — durable adapter integration verification (D1-2/D1-3/D1-4/D1-5).
 *
 * Exercises PgDomOpsJournal + DomOpsMetadataStore over a deterministic in-memory `dom_ops.metadata_kv`
 * SQL double that implements the exact query contract the adapter emits and enforces the SoR
 * invariants: tenant partitioning, append-only (UPDATE/DELETE/TRUNCATE denied, mirroring the V003
 * insert-only role), monotonic per-tenant seq, and the put-requires-value CHECK. No PG driver / no
 * new package: the double satisfies the injected SqlExecutor seam. Run:
 *   node --test services/platform/operational-proof/adapter/durable-adapter.integration.test.ts
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { DomOpsMetadataStore } from "../../../../packages/platform-runtime/src/persistence-runtime/index.ts";
import { PgDomOpsJournal, type SqlExecutor, type SqlQueryResult } from "./pg-dom-ops-journal.ts";
import { resolvePgConnection } from "./compose-durable.ts";

interface Row {
  tenant_id: string;
  seq: number;
  v: number;
  op: string;
  key: string;
  value_json: unknown;
  schema_json: unknown;
}

/** In-memory dom_ops.metadata_kv honoring the adapter's SQL contract + append-only role semantics. */
class MetadataKvDouble implements SqlExecutor {
  readonly rows: Row[] = [];

  async query<R = Record<string, unknown>>(sql: string, params: readonly unknown[] = []): Promise<SqlQueryResult<R>> {
    // Append-only enforcement (mirrors the V003 insert-only role: no history mutation).
    if (/\b(UPDATE|DELETE|TRUNCATE)\b/i.test(sql)) {
      throw new Error("permission denied: metadata_kv is append-only (insert-only role)");
    }
    if (sql.includes("INSERT INTO")) {
      const [tenant, v, op, key, valueStr, schemaStr] = params as [string, number, string, string, string | null, string | null];
      const seq = this.rows.filter((r) => r.tenant_id === tenant).reduce((m, r) => Math.max(m, r.seq + 1), 0);
      const value_json = valueStr === null ? null : JSON.parse(valueStr);
      if (op === "put" && value_json === null) throw new Error("check violation: put requires value_json");
      this.rows.push({ tenant_id: tenant, seq, v: Number(v), op, key, value_json, schema_json: schemaStr === null ? null : JSON.parse(schemaStr) });
      return { rows: [{ seq } as unknown as R] };
    }
    if (sql.includes("COUNT(")) {
      const [tenant] = params as [string];
      return { rows: [{ count: this.rows.filter((r) => r.tenant_id === tenant).length } as unknown as R] };
    }
    // SELECT seq, v, op, key, value_json, schema_json ... WHERE tenant_id=$1 ORDER BY seq ASC
    const [tenant] = params as [string];
    const rows = this.rows.filter((r) => r.tenant_id === tenant).sort((a, b) => a.seq - b.seq)
      .map((r) => ({ seq: r.seq, v: r.v, op: r.op, key: r.key, value_json: r.value_json, schema_json: r.schema_json }));
    return { rows: rows as unknown as R[] };
  }
}

const journal = (db: SqlExecutor, tenantId: string) => new PgDomOpsJournal(db, { tenantId });

test("D1-2 durable read-after-restart against the dom_ops SoR double (latest wins)", async () => {
  const db = new MetadataKvDouble();
  const first = await DomOpsMetadataStore.open(journal(db, "t-1"));
  first.put("ops:flag", { on: false });
  first.put("ops:flag", { on: true });
  await first.drain();

  // Restart: a fresh store rehydrates purely from the SoR rows.
  const second = await DomOpsMetadataStore.open(journal(db, "t-1"));
  assert.deepEqual(second.get("ops:flag")?.value, { on: true });
});

test("D1-3 tenant isolation: a tenant never reads another tenant's rows", async () => {
  const db = new MetadataKvDouble();
  const a = await DomOpsMetadataStore.open(journal(db, "t-A"));
  const b = await DomOpsMetadataStore.open(journal(db, "t-B"));
  a.put("ops:x", { who: "A" });
  b.put("ops:x", { who: "B" });
  await a.drain();
  await b.drain();

  const aReopen = await DomOpsMetadataStore.open(journal(db, "t-A"));
  const bReopen = await DomOpsMetadataStore.open(journal(db, "t-B"));
  assert.deepEqual(aReopen.get("ops:x")?.value, { who: "A" });
  assert.deepEqual(bReopen.get("ops:x")?.value, { who: "B" });
});

test("D1-3 revocation fail-closed persists through the SoR and survives restart", async () => {
  const db = new MetadataKvDouble();
  const store = await DomOpsMetadataStore.open(journal(db, "t-1"));
  store.put("ops:key", { v: 1 });
  store.revoke("ops:key");
  await store.drain();

  const reopened = await DomOpsMetadataStore.open(journal(db, "t-1"));
  assert.equal(reopened.get("ops:key"), undefined);
});

test("D1-5 append-only + monotonic seq; history mutation is denied by the role", async () => {
  const db = new MetadataKvDouble();
  const store = await DomOpsMetadataStore.open(journal(db, "t-1"));
  store.put("ops:a", { n: 1 });
  store.put("ops:a", { n: 2 });
  store.put("ops:b", { n: 3 });
  await store.drain();

  const seqs = db.rows.filter((r) => r.tenant_id === "t-1").map((r) => r.seq);
  assert.deepEqual(seqs, [0, 1, 2]); // monotonic, gap-free
  await assert.rejects(() => db.query("UPDATE dom_ops.metadata_kv SET value_json='{}'"));
  await assert.rejects(() => db.query("DELETE FROM dom_ops.metadata_kv"));
});

test("D1-4 DSN-by-reference + TLS 1.3 enforcement (fail-closed on inline/invalid)", async () => {
  const cfg = await resolvePgConnection({
    dsnRef: "external://kms/opf/dom_ops_dsn",
    resolveSecret: async () => "postgresql://ops_metadata_writer@db.internal:5432/ucos",
  });
  assert.equal(cfg.ssl.minVersion, "TLSv1.3");
  assert.equal(cfg.ssl.rejectUnauthorized, true);

  // Inline (non-external) DSN is rejected (S3: no inline credentials).
  await assert.rejects(() =>
    resolvePgConnection({ dsnRef: "postgresql://u:p@h/db", resolveSecret: async (r) => r }),
  );
  // A resolved value that is not a postgres DSN is rejected (fail-closed).
  await assert.rejects(() =>
    resolvePgConnection({ dsnRef: "external://kms/bad", resolveSecret: async () => "not-a-dsn" }),
  );
});
