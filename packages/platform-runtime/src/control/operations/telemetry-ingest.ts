/**
 * UCOS Operational Proof Fabric — Telemetry Ingest (OPF-RT-002).
 *
 * The real-time entry point for monitoring signals: metric points, trace spans, and log events.
 * Deny-by-default multi-tenancy — every signal is admitted ONLY for an active, registered tenant and
 * a registered metric (unknown tenant/metric is dropped, counted, and never stored). Capacity is
 * bounded per the tenant's retention policy (backpressure via ring eviction). No governed mutation,
 * no evolution — this plane is ephemeral by design; durable proof is produced by attestation.
 */

import type { LogEvent, MetricPoint, TraceSpan } from "./types.ts";
import type { OperationsRegistry } from "./operations-registry.ts";
import { scopeMatches } from "./operations-registry.ts";
import { MetricStore } from "./metric-store.ts";

export interface IngestStats {
  acceptedMetrics: number;
  acceptedSpans: number;
  acceptedLogs: number;
  droppedUnknownTenant: number;
  droppedUnknownMetric: number;
  droppedSuspended: number;
}

interface SpanRing {
  capacity: number;
  buf: TraceSpan[];
}
interface LogRing {
  capacity: number;
  buf: LogEvent[];
}

export class TelemetryIngest {
  readonly metrics: MetricStore;
  readonly #registry: OperationsRegistry;
  readonly #spans = new Map<string, SpanRing>(); // tenantId -> ring
  readonly #logs = new Map<string, LogRing>(); // tenantId -> ring
  readonly #stats: IngestStats = {
    acceptedMetrics: 0,
    acceptedSpans: 0,
    acceptedLogs: 0,
    droppedUnknownTenant: 0,
    droppedUnknownMetric: 0,
    droppedSuspended: 0,
  };

  constructor(registry: OperationsRegistry, metricStore?: MetricStore) {
    this.#registry = registry;
    this.metrics = metricStore ?? new MetricStore();
  }

  /** Admit a metric point (fail-closed on unknown/suspended tenant or unregistered metric). */
  ingestMetric(point: MetricPoint): boolean {
    const tenant = this.#registry.getTenant(point.tenantId);
    if (!tenant) {
      this.#stats.droppedUnknownTenant++;
      return false;
    }
    if (tenant.status !== "active") {
      this.#stats.droppedSuspended++;
      return false;
    }
    const def = this.#registry.getMetric(point.metric);
    if (!def || !scopeMatches(def.tenantScope, point.tenantId)) {
      this.#stats.droppedUnknownMetric++;
      return false;
    }
    this.metrics.record(point, tenant.retention.metricSamples);
    this.#stats.acceptedMetrics++;
    return true;
  }

  ingestMetrics(points: readonly MetricPoint[]): number {
    let n = 0;
    for (const p of points) if (this.ingestMetric(p)) n++;
    return n;
  }

  ingestSpan(span: TraceSpan): boolean {
    const tenant = this.#registry.getTenant(span.tenantId);
    if (!tenant) {
      this.#stats.droppedUnknownTenant++;
      return false;
    }
    if (tenant.status !== "active") {
      this.#stats.droppedSuspended++;
      return false;
    }
    let ring = this.#spans.get(span.tenantId);
    if (!ring) {
      ring = { capacity: tenant.retention.spans, buf: [] };
      this.#spans.set(span.tenantId, ring);
    }
    ring.buf.push(span);
    const overflow = ring.buf.length - ring.capacity;
    if (overflow > 0) ring.buf.splice(0, overflow);
    this.#stats.acceptedSpans++;
    return true;
  }

  ingestLog(log: LogEvent): boolean {
    const tenant = this.#registry.getTenant(log.tenantId);
    if (!tenant) {
      this.#stats.droppedUnknownTenant++;
      return false;
    }
    if (tenant.status !== "active") {
      this.#stats.droppedSuspended++;
      return false;
    }
    let ring = this.#logs.get(log.tenantId);
    if (!ring) {
      ring = { capacity: tenant.retention.logs, buf: [] };
      this.#logs.set(log.tenantId, ring);
    }
    ring.buf.push(log);
    const overflow = ring.buf.length - ring.capacity;
    if (overflow > 0) ring.buf.splice(0, overflow);
    this.#stats.acceptedLogs++;
    return true;
  }

  spans(tenantId: string): readonly TraceSpan[] {
    return this.#spans.get(tenantId)?.buf ?? [];
  }

  logs(tenantId: string): readonly LogEvent[] {
    return this.#logs.get(tenantId)?.buf ?? [];
  }

  stats(): IngestStats {
    return { ...this.#stats };
  }
}
