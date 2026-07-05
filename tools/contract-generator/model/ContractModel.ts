/**
 * Canonical Generator Model — ContractModel (root)
 *
 * TYPE DEFINITIONS ONLY. No generator logic, no runtime values, no I/O.
 *
 * The single canonical shape into which ALL contract sources (API, event, data) are
 * normalized before generation. It is a faithful, additive projection of the UCOS contract
 * inventory (contracts/catalog/*.contract.json) and the meta-schema
 * (contracts/schema/contract.schema.json). Deferred information is represented via
 * PlaceholderState — never invented.
 *
 * Mirrors: contracts/schema/contract.schema.json
 * Traceability: UCOS-CONTRACT-CAT-001 · UCOS-SVC-ARCH-001 · UCOS-SVC-POLICY-001 · IC-2.
 */

import type { OperationModel } from "./OperationModel.ts";
import type {
  ArtifactId,
  MetaSchemaVersion,
  PlaceholderState,
} from "./SchemaModel.ts";

/** Discriminates the three catalog contract families. Defaults to "api" for v1 inventories. */
export type ContractKind = "api" | "event" | "data";

/** Provenance of how the inventory entry was derived from the source-of-record catalog. */
export interface ExtractionModel {
  readonly source: string;
  readonly sourceArtifactId: ArtifactId;
  readonly sourceVersion?: string;
  readonly sourceSection?: string;
  readonly extractedBy?: string;
  readonly extractionDate?: string;
  readonly fidelity?: string;
}

/** Optional event delivery semantics (absent in the boundary-level catalog for API-018/027). */
export interface DeliverySemanticsModel {
  readonly delivery?: string;
  readonly ordering?: string;
  readonly idempotencyKey?: boolean;
  readonly pevLinkage?: PlaceholderState | readonly ArtifactId[];
}

/** Event contract(s) emitted by this contract, referenced by id + message names. */
export interface EmitsModel {
  readonly eventContract?: ArtifactId;
  readonly shortId?: string;
  readonly producer?: ArtifactId;
  readonly domain?: ArtifactId;
  readonly capability?: ArtifactId;
  readonly messages?: readonly string[];
  readonly deliverySemantics?: DeliverySemanticsModel;
}

/** NFR value: concrete string or the PENDING placeholder. */
export type NfrValue = PlaceholderState | string;

export interface NfrModel {
  readonly latency?: NfrValue;
  readonly throughput?: NfrValue;
  readonly availability?: NfrValue;
  readonly recoveryRtoRpo?: NfrValue;
}

/** Reference detail for the owning data contract. Does NOT redefine physical schemas. */
export interface DataContractDetailModel {
  readonly id: ArtifactId;
  readonly owningServiceDomain?: string;
  readonly capability?: ArtifactId;
  readonly payloadFamilies?: readonly string[];
  readonly referencesDataArchitecture?: string;
  readonly classification?: string;
  readonly fieldLevelSchema?: PlaceholderState | string;
}

/** Seam / event-contract-reference linkage. */
export interface SeamEcrModel {
  readonly seams?: readonly string[];
  readonly ecr?: readonly string[];
}

/** Machine-visible constraints instructing generators what MUST NOT be invented. */
export interface GenerationConstraintsModel {
  readonly note: string;
}

export interface TraceabilityModel {
  readonly refines?: readonly string[];
  readonly governedBy?: string;
  readonly invariants?: readonly string[];
}

/** The normalized contract entry. */
export interface ContractEntryModel {
  readonly id: ArtifactId;
  readonly shortId?: string;
  readonly title: string;
  readonly version: string;
  readonly status?: string;
  readonly contractKind: ContractKind;
  readonly producer?: ArtifactId;
  readonly domain?: ArtifactId;
  readonly capability?: ArtifactId;
  readonly dataContract?: ArtifactId;
  readonly consumers?: readonly string[];
  readonly operations?: readonly OperationModel[];
  readonly seamEcr?: SeamEcrModel;
  readonly emits?: EmitsModel;
  readonly nfr?: NfrModel;
  readonly security?: PlaceholderState | string;
  readonly dataContractDetail?: DataContractDetailModel;
}

/**
 * The canonical, self-describing root passed to the generator. `metaSchemaVersion` pins the
 * model family; `contract` carries the normalized entry with full provenance and constraints.
 */
export interface ContractModel {
  readonly metaSchemaVersion: MetaSchemaVersion;
  readonly inventoryFormat: string;
  readonly inventoryKind:
    | "api-contract-extraction"
    | "event-contract-extraction"
    | "data-contract-extraction";
  readonly extraction?: ExtractionModel;
  readonly contract: ContractEntryModel;
  readonly generationConstraints?: GenerationConstraintsModel;
  readonly traceability?: TraceabilityModel;
}
