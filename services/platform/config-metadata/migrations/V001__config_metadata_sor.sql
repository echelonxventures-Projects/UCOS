-- =============================================================================
-- UCOS PI-1 — WP-PLT-11 Config & Metadata — SoR Schema (forward-only migration V001)
-- ADR-005 (PostgreSQL SoR). DOM-018. Runs on the WP-PLT-02 HA cluster (ucos-sor),
-- as the single SoR for DOM-018 (INV-5). Migration-only lifecycle (forward-only;
-- destructive DDL prohibited — sor-lifecycle.md). Append-only history (INV-10).
--
-- S3: NO secret material stored; config secret-dependencies are references only
--     (secret_reference column holds external:// handles, never values).
-- S4: at-rest encryption provided by the cluster (WP-PLT-02); TLS 1.3 in transit.
-- Traceability: ADR-005; DOM-018; DATA-018; UCOS-ASR-NFR-001 §9; INV-5/INV-10.
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS dom_018;   -- single SoR schema for Config & Metadata (DOM-018)

-- Configuration values (hierarchical, environment-scoped, versioned, change-tracked).
CREATE TABLE dom_018.configuration_value (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    scope           TEXT        NOT NULL,
    config_key      TEXT        NOT NULL,
    value_json      JSONB,                         -- value; MUST NOT contain secrets (S3, app-enforced + CHECK below)
    secret_reference TEXT,                          -- external:// handle only (S3); resolved by WI-SEED.5
    environment     TEXT        NOT NULL,
    version         INTEGER     NOT NULL,
    changed_by      TEXT        NOT NULL,           -- workload/admin identity (S1)
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    reason          TEXT,
    CONSTRAINT uq_cfg UNIQUE (scope, config_key, environment, version),
    CONSTRAINT ck_secret_reference_only CHECK (secret_reference IS NULL OR secret_reference LIKE 'external://%')
);

-- Metadata records (open class vocabulary — INV-13 Infinite Extensibility).
CREATE TABLE dom_018.metadata_record (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    metadata_id     TEXT        NOT NULL,
    class           TEXT        NOT NULL,           -- OPEN vocabulary; new classes registered, not coded
    version         TEXT        NOT NULL,
    status          TEXT        NOT NULL CHECK (status IN ('DRAFT','ACTIVE','SUPERSEDED','DEPRECATED')),
    payload         JSONB       NOT NULL,           -- validated against class sub-schema (composition)
    classification  TEXT        NOT NULL DEFAULT 'internal'
                                CHECK (classification IN ('public','internal','confidential')),  -- never secret (S3)
    owner           TEXT        NOT NULL,
    registered_by   TEXT        NOT NULL,           -- registering workload identity (S1)
    supersedes      TEXT,                            -- append-only chain (INV-10)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_metadata UNIQUE (metadata_id, version)
);

-- Feature flags (context-scoped).
CREATE TABLE dom_018.feature_flag (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    flag_key        TEXT        NOT NULL,
    context         TEXT        NOT NULL,
    enabled         BOOLEAN     NOT NULL DEFAULT false,
    version         INTEGER     NOT NULL,
    changed_by      TEXT        NOT NULL,
    changed_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_flag UNIQUE (flag_key, context, version)
);

-- Append-only change history (INV-10): supersession never deletes prior rows.
-- (Enforced by application write path + migration-only role; no UPDATE/DELETE of history.)
CREATE INDEX ix_cfg_lookup      ON dom_018.configuration_value (scope, config_key, environment);
CREATE INDEX ix_metadata_class  ON dom_018.metadata_record (class, status);
CREATE INDEX ix_flag_lookup     ON dom_018.feature_flag (flag_key, context);
