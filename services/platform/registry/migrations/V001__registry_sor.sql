-- =============================================================================
-- UCOS PI-1 — WP-PLT-06 Registry & Discovery — SoR Schema (forward-only migration V001)
-- ADR-004 (PostgreSQL-backed Platform Registry). DOM-027. Runs on the WP-PLT-02
-- HA cluster (ucos-sor) as the single SoR for DOM-027 (INV-5). Migration-only
-- (forward-only; destructive DDL prohibited). Append-only (INV-10).
--
-- S3: NO secret material; endpoint/wiring references are mesh-internal handles only.
-- S4: at-rest encryption via cluster (WP-PLT-02); TLS 1.3 in transit.
-- Traceability: ADR-004; DOM-027; DATA-027; UCOS-ASR-NFR-001 §4/§9; INV-5/INV-10.
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS dom_027;   -- single SoR schema for Registry & Discovery (DOM-027)

-- Registered artifacts (open artifactType vocabulary — INV-13; append-only + versioned).
CREATE TABLE dom_027.registry_artifact (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    artifact_id     TEXT        NOT NULL,
    artifact_type   TEXT        NOT NULL,            -- OPEN vocabulary; registered, not coded (INV-13)
    version         TEXT        NOT NULL,
    status          TEXT        NOT NULL CHECK (status IN ('DRAFT','ACTIVE','SUPERSEDED','DEPRECATED')),
    owner           TEXT        NOT NULL,
    metadata_ref    TEXT,                             -- → DOM-018 metadata record (API-018 integration)
    payload         JSONB       NOT NULL,             -- artifact descriptor (no secrets — S3)
    registered_by   TEXT        NOT NULL,             -- registering workload identity (S1)
    supersedes      TEXT,                             -- append-only chain (INV-10)
    registered_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_artifact UNIQUE (artifact_id, version)
);

-- Dependency edges (composition + discovery/dependency resolution). Acyclic (PSR discipline).
CREATE TABLE dom_027.dependency_edge (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    from_artifact   TEXT        NOT NULL,
    to_artifact     TEXT        NOT NULL,
    relation        TEXT        NOT NULL CHECK (relation IN
                        ('depends-on','consumes-contract','emits-event','orchestrates','composes')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT ck_no_self_edge CHECK (from_artifact <> to_artifact),  -- acyclicity guard (edge-level)
    CONSTRAINT uq_edge UNIQUE (from_artifact, to_artifact, relation)
);

-- Discovery is a read projection over artifacts + edges (source of truth = tables above; INV-5).
CREATE VIEW dom_027.discovery AS
    SELECT a.artifact_id, a.artifact_type, a.version, a.status, a.metadata_ref
    FROM dom_027.registry_artifact a
    WHERE a.status = 'ACTIVE';

CREATE INDEX ix_artifact_type   ON dom_027.registry_artifact (artifact_type, status);
CREATE INDEX ix_edge_from       ON dom_027.dependency_edge (from_artifact);
CREATE INDEX ix_edge_to         ON dom_027.dependency_edge (to_artifact);
