-- =============================================================================
-- UCOS B02 — Operational Proof Fabric — SoR Schema (forward-only migration V001)
-- ADR-005 (PostgreSQL SoR). Single SoR for the Operations domain (dom_ops). Migration-only
-- lifecycle (forward-only; destructive DDL prohibited). Append-only history (supersede-not-overwrite).
--
-- SCOPE: only the DURABLE PROOF PLANE is persisted here (proof records, incident records, the
-- hash-chained audit log, and registry definitions). The REAL-TIME PLANE (raw metric samples, spans,
-- logs) is intentionally NOT stored raw — it lives in bounded in-memory ring buffers and is sealed
-- into proof records. This keeps the SoR bounded and tamper-evident.
--
-- S3: NO secret material stored; authority keys are references only (key_ref), never key material.
-- S4: at-rest encryption + TLS 1.3 provided by the platform data cluster.
-- Multi-tenant: every durable row carries tenant_id and is queried tenant-partitioned (deny-by-default).
-- Traceability: B02; OPF-ARCH-001/002; ADR-005; INV append-only.
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS dom_ops;

-- ---------------------------------------------------------------------------
-- Tenants (registry-driven; deny-by-default admission).
-- ---------------------------------------------------------------------------
CREATE TABLE dom_ops.tenant (
    tenant_id        TEXT        PRIMARY KEY,
    display_name     TEXT        NOT NULL,
    status           TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
    max_trust_level  NUMERIC     NOT NULL CHECK (max_trust_level >= 0),
    retention_json   JSONB       NOT NULL,   -- { metricSamples, spans, logs } (bounded ring capacities)
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Registry definitions (metric / health-check / slo / alert-rule / proof-authority).
-- Open, versionable class of operational rules; NO hardcoded thresholds anywhere in code.
-- ---------------------------------------------------------------------------
CREATE TABLE dom_ops.definition (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    def_kind      TEXT        NOT NULL CHECK (def_kind IN ('metric','health-check','slo','alert-rule','proof-authority')),
    def_id        TEXT        NOT NULL,
    tenant_scope  TEXT        NOT NULL,     -- '*' or a tenant_id
    payload       JSONB       NOT NULL,     -- validated against registry-definitions-model.yaml
    registered_by TEXT        NOT NULL,     -- workload/admin identity (S1)
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_definition UNIQUE (def_kind, def_id)
);

-- ---------------------------------------------------------------------------
-- Proof records (immutable, versioned, tenant-scoped operational evidence). Append-only:
-- a new version supersedes; prior versions are retained (never updated/deleted).
-- ---------------------------------------------------------------------------
CREATE TABLE dom_ops.proof_record (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id     TEXT        NOT NULL REFERENCES dom_ops.tenant(tenant_id),
    proof_id      TEXT        NOT NULL,
    version       TEXT        NOT NULL,
    kind          TEXT        NOT NULL CHECK (kind IN ('telemetry-snapshot','health-attestation','slo-attestation','incident-evidence','custom')),
    state         TEXT        NOT NULL CHECK (state IN ('draft','attested','sealed')),
    unit_hash     TEXT        NOT NULL,     -- sha256(canonical(unit)); tamper-evident binding
    trust_level   NUMERIC     NOT NULL CHECK (trust_level >= 0),
    state_hash    TEXT,                      -- operational state hash captured at attestation
    unit_json     JSONB       NOT NULL,     -- the ProofUnit (evidence payload)
    provenance    JSONB       NOT NULL,
    source_json   JSONB       NOT NULL,     -- { kind, nodeId } (local | federated | import)
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_proof UNIQUE (tenant_id, proof_id, version)
);

-- ---------------------------------------------------------------------------
-- Incident records (versioned, append-only; each transition = a new version + timeline append).
-- ---------------------------------------------------------------------------
CREATE TABLE dom_ops.incident_record (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id     TEXT        NOT NULL REFERENCES dom_ops.tenant(tenant_id),
    incident_id   TEXT        NOT NULL,
    version       TEXT        NOT NULL,
    title         TEXT        NOT NULL,
    severity      TEXT        NOT NULL CHECK (severity IN ('info','warn','critical')),
    state         TEXT        NOT NULL CHECK (state IN ('open','acknowledged','mitigated','resolved','closed')),
    opened_at     TIMESTAMPTZ NOT NULL,
    timeline_json JSONB       NOT NULL,     -- immutable append-only lifecycle events
    linked_json   JSONB       NOT NULL DEFAULT '{}'::jsonb,  -- { linkedAlerts, linkedEvidence }
    provenance    JSONB       NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_incident UNIQUE (tenant_id, incident_id, version)
);

-- ---------------------------------------------------------------------------
-- Hash-chained audit log (tamper-evident, append-only, per-node; cross-node reconcilable).
-- entry_hash = sha256(canonical(entry) | seq | prev_hash | node_id). Genesis prev_hash = 64x'0'.
-- INSERT-only; any UPDATE/DELETE is prohibited by the migration-only role and breaks verification.
-- ---------------------------------------------------------------------------
CREATE TABLE dom_ops.audit_entry (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    node_id     TEXT        NOT NULL,
    seq         BIGINT      NOT NULL,
    prev_hash   TEXT        NOT NULL,
    entry_hash  TEXT        NOT NULL,
    event       TEXT        NOT NULL,
    tenant_id   TEXT        NOT NULL,
    subject     TEXT        NOT NULL,     -- proofId / incidentId / ruleId / sloId
    actor       TEXT        NOT NULL,
    detail      TEXT        NOT NULL,
    state_hash  TEXT,
    at          TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_audit_chain UNIQUE (node_id, seq)
);

-- ---------------------------------------------------------------------------
-- Revocation tombstones (fail-closed on next resolution).
-- ---------------------------------------------------------------------------
CREATE TABLE dom_ops.revocation (
    kind        TEXT        NOT NULL CHECK (kind IN ('proof','incident','attestation','seal','authority')),
    entity_id   TEXT        NOT NULL,
    revoked_by  TEXT        NOT NULL,
    revoked_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (kind, entity_id)
);

-- Indexes: tenant-partitioned lookups + latest-version resolution + chain verification.
CREATE INDEX ix_proof_tenant     ON dom_ops.proof_record (tenant_id, proof_id, version);
CREATE INDEX ix_proof_kind_state ON dom_ops.proof_record (tenant_id, kind, state);
CREATE INDEX ix_incident_tenant  ON dom_ops.incident_record (tenant_id, incident_id, version);
CREATE INDEX ix_incident_state   ON dom_ops.incident_record (tenant_id, state, severity);
CREATE INDEX ix_audit_subject    ON dom_ops.audit_entry (tenant_id, subject, event);
CREATE INDEX ix_definition_scope ON dom_ops.definition (def_kind, tenant_scope);
