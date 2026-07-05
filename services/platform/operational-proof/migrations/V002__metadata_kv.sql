-- =============================================================================
-- UCOS B02 — Operational Proof Fabric — Metadata KV Journal (forward-only migration V002)
-- AC-D1: durable MetadataPort backing. ADR-005 (PostgreSQL SoR). Migration-only lifecycle
-- (forward-only; destructive DDL prohibited). Append-only history (INSERT-only; supersede-not-overwrite).
--
-- PURPOSE: the durable, append-only journal behind the substrate's dom_ops-backed MetadataPort
-- adapter (DomOpsMetadataStore + PgDomOpsJournal). Each row is ONE governed metadata write
-- (op = 'put'); replaying rows in seq order for a tenant reconstructs authoritative metadata state.
-- The in-memory metadata projection is DERIVED from this journal on rehydration.
--
-- S3: NO secret material stored (metadata values are governed config/descriptor data, not secrets).
-- S4: at-rest encryption + TLS 1.3 provided by the platform data cluster.
-- Multi-tenant: every row carries tenant_id and is queried tenant-partitioned (deny-by-default).
-- Append-only: INSERT-only via the migration-only role; any UPDATE/DELETE is prohibited.
-- Traceability: B02; AC-D1; ADR-005; INV append-only.
-- =============================================================================

-- Idempotent: dom_ops is created by V001; guard for forward-only re-application safety.
CREATE SCHEMA IF NOT EXISTS dom_ops;

-- ---------------------------------------------------------------------------
-- Metadata KV journal (append-only, tenant-scoped, monotonic per-tenant sequence).
-- One row per governed metadata write; latest seq for a key wins in the derived projection while
-- all prior versions are retained (append-only version history).
-- ---------------------------------------------------------------------------
CREATE TABLE dom_ops.metadata_kv (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id    TEXT        NOT NULL,
    seq          BIGINT      NOT NULL CHECK (seq >= 0),   -- monotonic per-tenant append order (0-based)
    v            INTEGER     NOT NULL DEFAULT 1,          -- journal envelope version (forward migration hook)
    op           TEXT        NOT NULL DEFAULT 'put'       -- event discriminator (put | revoke)
                             CHECK (op IN ('put','revoke')),
    key          TEXT        NOT NULL,                    -- metadata key (e.g. capability:* / contract:*)
    value_json   JSONB,                                   -- governed value payload (NULL only for op='revoke')
    schema_json  JSONB,                                   -- optional attached JSON Schema (validated on write)
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_metadata_kv_seq UNIQUE (tenant_id, seq),
    -- Fail-closed: a 'put' MUST carry a value; a 'revoke' is a terminal, value-less tombstone.
    CONSTRAINT ck_metadata_kv_put_value CHECK (op <> 'put' OR value_json IS NOT NULL)
);

-- Ordered replay per tenant + latest-version-by-key resolution.
CREATE INDEX ix_metadata_kv_replay ON dom_ops.metadata_kv (tenant_id, seq);
CREATE INDEX ix_metadata_kv_key    ON dom_ops.metadata_kv (tenant_id, key, seq);
