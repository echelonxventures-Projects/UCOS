import pg from "pg";

import { PgDomOpsJournal } from "../services/platform/operational-proof/adapter/pg-dom-ops-journal.ts";
import { DomOpsMetadataStore } from "../packages/platform-runtime/src/persistence-runtime/dom-ops-metadata-store.ts";

const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres:certpw@localhost:55432/ucos",
  ssl: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.3"
  }
});

const sql = {
  async query(sqlText, params) {
    const result = await pool.query(sqlText, params);
    return { rows: result.rows };
  }
};

const journal = new PgDomOpsJournal(sql, {
  tenantId: "t-cert"
});

const phase = process.argv[2];

if (phase === "write") {
  const store = await DomOpsMetadataStore.open(journal);

  store.put("ops:cert", { n: 1 });
  store.put("ops:cert", { n: 2 });

  await store.drain();

  console.log("WRITE_OK");
}

if (phase === "read") {
  const store = await DomOpsMetadataStore.open(journal);

  const record = store.get("ops:cert");

  console.log("READ_VALUE", JSON.stringify(record?.value));
}

await pool.end();
