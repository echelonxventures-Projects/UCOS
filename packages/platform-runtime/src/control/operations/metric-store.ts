/**
 * UCOS Operational Proof Fabric — Metric Store (OPF-RT-001).
 *
 * Real-time, in-memory time-series over BOUNDED per-(tenant,metric) ring buffers. Bounded capacity is
 * the backpressure mechanism: the oldest sample is evicted on overflow, so memory is capped regardless
 * of ingest rate (real-time plane never grows without limit). Multi-tenant: samples are partitioned by
 * tenant and a query cannot cross tenant boundaries.
 *
 * Aggregation (count/sum/avg/min/max/p50/p95/p99/last) is computed over a caller-supplied time window.
 * Percentiles use nearest-rank on the sorted window (deterministic, dependency-free).
 */

import type { MetricAggregate, MetricPoint } from "./types.ts";

interface Ring {
  readonly capacity: number;
  buf: MetricPoint[];
}

function windowSlice(points: readonly MetricPoint[], fromAt: number, toAt: number, labelMatch?: Record<string, string>): MetricPoint[] {
  const out: MetricPoint[] = [];
  for (const p of points) {
    if (p.at < fromAt || p.at > toAt) continue;
    if (labelMatch) {
      let ok = true;
      for (const [k, v] of Object.entries(labelMatch)) {
        if ((p.labels?.[k] ?? undefined) !== v) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
    }
    out.push(p);
  }
  return out;
}

function percentile(sortedValues: readonly number[], pct: number): number {
  if (sortedValues.length === 0) return 0;
  // nearest-rank: rank = ceil(pct/100 * n), 1-based.
  const rank = Math.max(1, Math.ceil((pct / 100) * sortedValues.length));
  return sortedValues[rank - 1] as number;
}

/** Compute an aggregate over an already-windowed set of points. */
export function aggregate(points: readonly MetricPoint[], agg: MetricAggregate): number {
  const n = points.length;
  if (agg === "count") return n;
  if (n === 0) return 0;
  const values = points.map((p) => p.value);
  switch (agg) {
    case "sum":
      return values.reduce((a, b) => a + b, 0);
    case "avg":
      return values.reduce((a, b) => a + b, 0) / n;
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
    case "last": {
      // last by timestamp
      let latest = points[0] as MetricPoint;
      for (const p of points) if (p.at >= latest.at) latest = p;
      return latest.value;
    }
    case "p50":
    case "p95":
    case "p99": {
      const sorted = [...values].sort((a, b) => a - b);
      const pct = agg === "p50" ? 50 : agg === "p95" ? 95 : 99;
      return percentile(sorted, pct);
    }
    default:
      return 0;
  }
}

export class MetricStore {
  // tenantId -> metricId -> ring
  readonly #rings = new Map<string, Map<string, Ring>>();

  /** Record a sample into the bounded ring for (tenant, metric); evicts oldest on overflow. */
  record(point: MetricPoint, capacity: number): void {
    let byMetric = this.#rings.get(point.tenantId);
    if (!byMetric) {
      byMetric = new Map();
      this.#rings.set(point.tenantId, byMetric);
    }
    let ring = byMetric.get(point.metric);
    if (!ring) {
      ring = { capacity, buf: [] };
      byMetric.set(point.metric, ring);
    }
    ring.buf.push(point);
    // Bounded: evict oldest beyond capacity (backpressure by dropping the tail-of-history).
    const overflow = ring.buf.length - ring.capacity;
    if (overflow > 0) ring.buf.splice(0, overflow);
  }

  /** All samples for (tenant, metric) currently retained (bounded). */
  samples(tenantId: string, metric: string): readonly MetricPoint[] {
    return this.#rings.get(tenantId)?.get(metric)?.buf ?? [];
  }

  /** Windowed samples with optional label matching. */
  window(tenantId: string, metric: string, fromAt: number, toAt: number, labelMatch?: Record<string, string>): MetricPoint[] {
    return windowSlice(this.samples(tenantId, metric), fromAt, toAt, labelMatch);
  }

  /** Aggregate over [fromAt,toAt] for (tenant, metric). */
  aggregate(
    tenantId: string,
    metric: string,
    agg: MetricAggregate,
    fromAt: number,
    toAt: number,
    labelMatch?: Record<string, string>,
  ): number {
    return aggregate(this.window(tenantId, metric, fromAt, toAt, labelMatch), agg);
  }

  /** Metric ids currently holding samples for a tenant. */
  metrics(tenantId: string): string[] {
    return [...(this.#rings.get(tenantId)?.keys() ?? [])];
  }

  tenants(): string[] {
    return [...this.#rings.keys()];
  }
}
