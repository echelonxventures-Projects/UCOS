/**
 * UCOS Operational Proof Fabric — Observability Engine (OPF-RT-003).
 *
 * Read-only correlation + query surface over the real-time plane (metrics + traces + logs). It powers
 * dashboards and evidence capture: metric aggregation windows, trace reconstruction (span tree by
 * traceId), error-rate derivation, and a tenant "observation snapshot" used as the payload of a
 * telemetry-snapshot proof. Strictly tenant-scoped (multi-tenant isolation) and side-effect free.
 */

import type { MetricAggregate, MetricPoint, TraceSpan, LogEvent } from "./types.ts";
import type { TelemetryIngest } from "./telemetry-ingest.ts";
import type { OperationsRegistry } from "./operations-registry.ts";
import { aggregate } from "./metric-store.ts";

export interface TraceTreeNode {
  span: TraceSpan;
  children: TraceTreeNode[];
}

export interface MetricSummary {
  metric: string;
  count: number;
  last: number;
  avg: number;
  min: number;
  max: number;
  p95: number;
}

export interface ObservationSnapshot {
  tenantId: string;
  windowMs: number;
  at: number;
  metrics: MetricSummary[];
  errorSpanCount: number;
  totalSpanCount: number;
  logCountsByLevel: Record<string, number>;
}

export class ObservabilityEngine {
  readonly #ingest: TelemetryIngest;
  readonly #registry: OperationsRegistry;

  constructor(ingest: TelemetryIngest, registry: OperationsRegistry) {
    this.#ingest = ingest;
    this.#registry = registry;
  }

  /** Aggregate a metric over the trailing `windowMs` for a tenant. */
  aggregateWindow(tenantId: string, metric: string, agg: MetricAggregate, windowMs: number, now: number): number {
    return this.#ingest.metrics.aggregate(tenantId, metric, agg, now - windowMs, now);
  }

  /** Reconstruct span trees (roots = spans with no parent within the retained window). */
  traceTree(tenantId: string, traceId: string): TraceTreeNode[] {
    const spans = this.#ingest.spans(tenantId).filter((s) => s.traceId === traceId);
    const byId = new Map<string, TraceTreeNode>();
    for (const span of spans) byId.set(span.spanId, { span, children: [] });
    const roots: TraceTreeNode[] = [];
    for (const node of byId.values()) {
      const parent = node.span.parentSpanId ? byId.get(node.span.parentSpanId) : undefined;
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
    return roots;
  }

  /** Error rate over retained spans in the trailing window (0..1). */
  errorRate(tenantId: string, windowMs: number, now: number): number {
    const spans = this.#ingest.spans(tenantId).filter((s) => s.endedAt >= now - windowMs && s.endedAt <= now);
    if (spans.length === 0) return 0;
    const errors = spans.filter((s) => s.status === "error").length;
    return errors / spans.length;
  }

  /** A side-effect-free observation snapshot: the canonical telemetry-snapshot evidence payload. */
  snapshot(tenantId: string, windowMs: number, now: number): ObservationSnapshot {
    const fromAt = now - windowMs;
    const metrics: MetricSummary[] = [];
    for (const metric of this.#ingest.metrics.metrics(tenantId)) {
      const win: readonly MetricPoint[] = this.#ingest.metrics.window(tenantId, metric, fromAt, now);
      metrics.push({
        metric,
        count: win.length,
        last: aggregate(win, "last"),
        avg: aggregate(win, "avg"),
        min: aggregate(win, "min"),
        max: aggregate(win, "max"),
        p95: aggregate(win, "p95"),
      });
    }
    metrics.sort((a, b) => a.metric.localeCompare(b.metric));

    const spans = this.#ingest.spans(tenantId).filter((s) => s.endedAt >= fromAt && s.endedAt <= now);
    const errorSpanCount = spans.filter((s) => s.status === "error").length;

    const logCountsByLevel: Record<string, number> = {};
    const logs: readonly LogEvent[] = this.#ingest.logs(tenantId);
    for (const l of logs) {
      if (l.at < fromAt || l.at > now) continue;
      logCountsByLevel[l.level] = (logCountsByLevel[l.level] ?? 0) + 1;
    }

    // Reference the registry so scope-consistency is observable in the snapshot metadata.
    void this.#registry.getTenant(tenantId);

    return {
      tenantId,
      windowMs,
      at: now,
      metrics,
      errorSpanCount,
      totalSpanCount: spans.length,
      logCountsByLevel,
    };
  }
}
