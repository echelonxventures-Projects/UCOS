/**
 * UCOS Substrate — Persistence Runtime (L4) public surface.
 *
 * Durable adapters for the substrate ports plus the append-only storage medium behind them.
 * These are additive: they implement the existing port contracts and require no kernel or fabric
 * changes. The ports remain the authority boundary; the log is the durable record; the in-memory
 * stores are derived projections rebuilt on rehydration.
 */

export {
  LOG_FORMAT_VERSION,
  InMemoryAppendOnlyLog,
  FileAppendOnlyLog,
} from "./append-only-log.ts";
export type { AppendOnlyLog, LogRecord } from "./append-only-log.ts";

export { DurableMetadataStore } from "./durable-metadata-store.ts";
export type { DurableMetadataStoreOptions } from "./durable-metadata-store.ts";
export { DurableRegistryStore } from "./durable-registry-store.ts";
export { DurableConfigurationStore } from "./durable-configuration-store.ts";

// AC-D1 — dom_ops-backed durable MetadataPort adapter + its append-only SoR journal.
export { DOM_OPS_JOURNAL_VERSION, InMemoryDomOpsJournal } from "./dom-ops-journal.ts";
export type { DomOpsJournal, DomOpsJournalRecord, DomOpsMetadataEvent } from "./dom-ops-journal.ts";
export { DomOpsMetadataStore } from "./dom-ops-metadata-store.ts";
export type { DomOpsMetadataStoreOptions } from "./dom-ops-metadata-store.ts";
