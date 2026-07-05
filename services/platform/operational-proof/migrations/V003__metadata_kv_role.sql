-- =============================================================================
-- UCOS B02 — Operational Proof Fabric — Metadata KV insert-only role (forward-only migration V003)
-- AC-D1 / D1-5: enforce append-only at the SoR authorization layer. The application connects as
-- `ops_metadata_writer`, which may INSERT and SELECT rows of dom_ops.metadata_kv but MUST NOT
-- UPDATE, DELETE, or TRUNCATE. Any attempt to mutate history is denied by the database, so the
-- append-only / version-monotonic invariant (INV-10) holds independently of application code.
-- Schema evolution stays with a separate migration/owner role (not granted here).
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ops_metadata_writer') THEN
        CREATE ROLE ops_metadata_writer NOLOGIN;
    END IF;
END
$$;

-- Deny-by-default, then grant only the append-only surface.
REVOKE ALL PRIVILEGES ON dom_ops.metadata_kv FROM ops_metadata_writer;
GRANT USAGE ON SCHEMA dom_ops TO ops_metadata_writer;
GRANT SELECT, INSERT ON dom_ops.metadata_kv TO ops_metadata_writer;

-- Explicitly withhold history mutation (defense-in-depth against future default grants).
REVOKE UPDATE, DELETE, TRUNCATE ON dom_ops.metadata_kv FROM ops_metadata_writer;

-- IDENTITY sequence usage for GENERATED ALWAYS AS IDENTITY inserts.
GRANT USAGE ON ALL SEQUENCES IN SCHEMA dom_ops TO ops_metadata_writer;
