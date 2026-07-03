/**
 * Shared test harness for PI-8 ontology suites. Not a test file (no ".test.ts").
 * Builds a composed substrate + wired Ontology Fabric with distinct role keys/principals (separation
 * of duties) and helpers to build units, certify, ratify, and commit ontology records.
 */

import type { KeyObject } from "node:crypto";
import { createSubstrate } from "../src/bootstrap.ts";
import { generateKeyPair } from "../src/control/federation/assertions.ts";
import { createOntology } from "../src/control/ontology/ontology-control.ts";
import { createRecord } from "../src/control/ontology/ontology-record.ts";
import { unitHash } from "../src/control/ontology/ontology-unit.ts";
import { EntityModel } from "../src/control/ontology/entity-model.ts";
import { RelationshipModel } from "../src/control/ontology/relationship-model.ts";
import { TaxonomyModel } from "../src/control/ontology/taxonomy-model.ts";
import type { OntologyRecord, OntologyState, OntologyUnit } from "../src/control/ontology/types.ts";

export const NS = "ontology:demo:core";

export interface OntoRoleKeys {
  certifier: KeyObject;
  ratifier: KeyObject;
}

export async function buildOntology() {
  const substrate = createSubstrate();
  const onto = createOntology(substrate, { nodeId: "node-local" });

  // Distinct role keys (SoD): certifier + ratifier.
  const certKeys = generateKeyPair();
  const ratKeys = generateKeyPair();
  onto.keys.register("onto-cert-key", certKeys.publicKeyPem);
  onto.keys.register("onto-rat-key", ratKeys.publicKeyPem);
  onto.certifications.register({ caId: "oca1", owner: "carol-certifier", keyRef: "onto-cert-key" });
  onto.ratifications.register({ raId: "ora1", owner: "rachel-ratifier", keyRef: "onto-rat-key", quorum: 1 });

  // Governed namespace (single-owner, deny-by-default).
  onto.registry.defineNamespace({ namespace: NS, owner: "olivia-owner", authorities: ["auth-core"] });

  return { substrate, onto, roleKeys: { certifier: certKeys.privateKey, ratifier: ratKeys.privateKey } as OntoRoleKeys };
}

export function entityUnit(id: string, opts: { attributes?: { name: string; type: string; required: boolean }[]; parents?: string[]; namespace?: string } = {}): OntologyUnit {
  return EntityModel.unit({
    entityId: id,
    namespace: opts.namespace ?? NS,
    label: id,
    ...(opts.attributes ? { attributes: opts.attributes } : {}),
    ...(opts.parents ? { parents: opts.parents } : {}),
  });
}

export function relationshipUnit(
  id: string,
  domain: string,
  range: string,
  opts: { cardinality?: "1:1" | "1:N" | "N:1" | "N:M"; inverseOf?: string; namespace?: string } = {},
): OntologyUnit {
  return RelationshipModel.unit({
    relId: id,
    namespace: opts.namespace ?? NS,
    label: id,
    domain,
    range,
    cardinality: opts.cardinality ?? "N:M",
    ...(opts.inverseOf ? { inverseOf: opts.inverseOf } : {}),
  });
}

export function taxonomyUnit(id: string, root: string, edges: { parent: string; child: string }[], namespace = NS): OntologyUnit {
  return TaxonomyModel.unit({ taxId: id, namespace, label: id, root, edges });
}

export function draftRecord(unit: OntologyUnit, opts: { version?: string; state?: OntologyState; trustLevel?: number } = {}): OntologyRecord {
  return createRecord({
    version: opts.version ?? "1.0.0",
    unit,
    source: { kind: "local" },
    trustLevel: opts.trustLevel ?? 5,
    provenance: { origin: "local" },
    state: opts.state ?? "active",
  });
}

/** Produce a valid ontology certification + ratification (distinct principals, SoD-satisfying). */
export function govern(onto: Awaited<ReturnType<typeof buildOntology>>["onto"], keys: OntoRoleKeys, uh: string) {
  const cert = onto.certifications.issue(keys.certifier, { unitHash: uh, caId: "oca1" });
  const rat = onto.ratifications.issue(keys.ratifier, {
    unitHash: uh,
    raId: "ora1",
    author: "aaron-author",
    validators: ["victor-validator"],
    certifier: "carol-certifier",
    certificationId: cert.certificationId,
  });
  return { cert, rat };
}

/** Full create->certify->ratify->commit of an active record. Returns the record + unitHash + result. */
export async function commitActive(
  onto: Awaited<ReturnType<typeof buildOntology>>["onto"],
  keys: OntoRoleKeys,
  unit: OntologyUnit,
  opts: { version?: string; trustLevel?: number } = {},
) {
  const record = draftRecord(unit, { ...opts, state: "active" });
  const uh = unitHash(unit);
  const { cert, rat } = govern(onto, keys, uh);
  const result = await onto.commit(record, { certification: cert, ratification: rat });
  return { record, unitHash: uh, result };
}

/** Seed two base entities (Person, Organization) as active so relationships/taxonomies can reference them. */
export async function seedBaseEntities(onto: Awaited<ReturnType<typeof buildOntology>>["onto"], keys: OntoRoleKeys) {
  await commitActive(onto, keys, entityUnit("Person", { attributes: [{ name: "name", type: "string", required: true }] }));
  await commitActive(onto, keys, entityUnit("Organization", { attributes: [{ name: "legalName", type: "string", required: true }] }));
}
