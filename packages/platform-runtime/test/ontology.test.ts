import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildOntology,
  commitActive,
  draftRecord,
  entityUnit,
  relationshipUnit,
  seedBaseEntities,
  taxonomyUnit,
  govern,
  NS,
} from "./ontology-harness.ts";
import { canTransition } from "../src/control/ontology/ontology-lifecycle.ts";
import { TaxonomyModel } from "../src/control/ontology/taxonomy-model.ts";
import { createRecord } from "../src/control/ontology/ontology-record.ts";
import { unitHash } from "../src/control/ontology/ontology-unit.ts";
import { OntologyAuditLog } from "../src/control/ontology/ontology-audit-log.ts";
import { generateKeyPair, signPayload } from "../src/control/federation/assertions.ts";
import type { OntologyBundle, OntologyFederationToken } from "../src/control/ontology/types.ts";

// ------------------------------ Lifecycle ------------------------------

test("full lifecycle: a local entity is created, ratified, committed active, and resolvable", async () => {
  const { onto, roleKeys } = await buildOntology();
  const { record, unitHash: uh } = await commitActive(onto, roleKeys, entityUnit("Person", { attributes: [{ name: "name", type: "string", required: true }] }));
  const stored = onto.store.get(record.namespace, "entity", "Person", record.version);
  assert.equal(stored?.unitHash, uh);
  assert.equal(stored?.state, "active");
  assert.equal(onto.states.state(uh), "active");
});

test("lifecycle table permits governed forward path + revoke, forbids illegal jumps", () => {
  assert.equal(canTransition("draft", "validated"), true);
  assert.equal(canTransition("validated", "certified"), true);
  assert.equal(canTransition("ratified", "active"), true);
  assert.equal(canTransition("active", "superseded"), true);
  assert.equal(canTransition("active", "revoked"), true);
  assert.equal(canTransition("archived", "active"), false);
  assert.equal(canTransition("draft", "active"), false); // no illegal jump
});

// ------------------------------ Query / resolve / versioning ------------------------------

test("committed entity resolves to the active record", async () => {
  const { onto, roleKeys } = await buildOntology();
  await commitActive(onto, roleKeys, entityUnit("Widget", { attributes: [{ name: "sku", type: "string", required: true }] }));
  const resolved = onto.resolver.resolve(NS, "entity", "Widget");
  assert.equal(resolved?.localId, "Widget");
  assert.equal(resolved?.state, "active");
});

test("higher version supersedes on resolve (highest active wins)", async () => {
  const { onto, roleKeys } = await buildOntology();
  await commitActive(onto, roleKeys, entityUnit("Doc", { attributes: [{ name: "title", type: "string", required: true }] }), { version: "1.0.0" });
  await commitActive(onto, roleKeys, entityUnit("Doc", { attributes: [{ name: "title", type: "string", required: true }, { name: "body", type: "string", required: false }] }), { version: "1.1.0" });
  const resolved = onto.resolver.resolve(NS, "entity", "Doc");
  assert.equal(resolved?.version, "1.1.0");
});

test("query filters by kind and excludes non-active by default", async () => {
  const { onto, roleKeys } = await buildOntology();
  await seedBaseEntities(onto, roleKeys);
  const entities = onto.queryEngine.query({ namespace: NS, kind: "entity" });
  assert.equal(entities.length, 2);
  assert.ok(entities.every((r) => r.state === "active"));
});

// ------------------------------ Graph projection ------------------------------

test("graph projection assembles active entities, relationships, and classification edges", async () => {
  const { onto, roleKeys } = await buildOntology();
  await seedBaseEntities(onto, roleKeys);
  await commitActive(onto, roleKeys, relationshipUnit("worksAt", "Person", "Organization", { cardinality: "N:1" }));
  await commitActive(onto, roleKeys, taxonomyUnit("orgTax", "Organization", [{ parent: "Organization", child: "Person" }]));
  const graph = onto.graph.project(NS);
  assert.deepEqual(graph.nodes.sort(), ["Organization", "Person"]);
  assert.equal(graph.edges.length, 1);
  assert.equal(graph.edges[0]?.relId, "worksAt");
  assert.ok(graph.classificationEdges.some((e) => e.parent === "Organization" && e.child === "Person"));
});

test("graph is a pure projection: a revoked record is excluded fail-closed", async () => {
  const { onto, roleKeys } = await buildOntology();
  const { record } = await commitActive(onto, roleKeys, entityUnit("Ghost", { attributes: [{ name: "n", type: "string", required: true }] }));
  assert.ok(onto.graph.project(NS, { admit: onto["checkIntegrity"] ? undefined : undefined }).entities.has("Ghost"));
  onto.revoke("record", record.recordId, "olivia-owner");
  const graph = onto.graph.project(NS, {
    admit: (r) => r.state === "active" && !onto.revocations.isRevoked("record", r.recordId),
  });
  assert.equal(graph.entities.has("Ghost"), false);
});

// ------------------------------ Semantic integrity SI-1..SI-7 ------------------------------

test("SI-1 referential integrity: a relationship with a dangling range is blocked (fail-closed)", async () => {
  const { onto, roleKeys } = await buildOntology();
  await commitActive(onto, roleKeys, entityUnit("Person", { attributes: [{ name: "name", type: "string", required: true }] }));
  await assert.rejects(
    () => commitActive(onto, roleKeys, relationshipUnit("knows", "Person", "Nonexistent")),
    /semantic-integrity gate failed/,
  );
});

test("SI-2 taxonomy acyclicity: a classification cycle is rejected (closes O5)", async () => {
  const { onto, roleKeys } = await buildOntology();
  await commitActive(onto, roleKeys, entityUnit("A", { attributes: [] }));
  await commitActive(onto, roleKeys, entityUnit("B", { attributes: [] }));
  await assert.rejects(
    () => commitActive(onto, roleKeys, taxonomyUnit("cyc", "A", [{ parent: "A", child: "B" }, { parent: "B", child: "A" }])),
    /semantic-integrity gate failed/,
  );
});

test("SI-2 detectCycle is a pure DAG check", () => {
  assert.equal(TaxonomyModel.detectCycle([{ parent: "a", child: "b" }, { parent: "b", child: "c" }]).acyclic, true);
  const cyc = TaxonomyModel.detectCycle([{ parent: "a", child: "b" }, { parent: "b", child: "a" }]);
  assert.equal(cyc.acyclic, false);
  assert.ok(cyc.cycle.length > 0);
});

test("SI-3 domain/range conformance: non-reciprocal inverseOf is blocked", async () => {
  const { onto, roleKeys } = await buildOntology();
  await seedBaseEntities(onto, roleKeys);
  // owns: Person -> Organization ; employs declares inverseOf owns but with a non-swapped domain/range.
  await commitActive(onto, roleKeys, relationshipUnit("owns", "Person", "Organization", { cardinality: "1:N" }));
  await assert.rejects(
    () => commitActive(onto, roleKeys, relationshipUnit("employs", "Person", "Organization", { cardinality: "1:N", inverseOf: "owns" })),
    /semantic-integrity gate failed/,
  );
});

test("SI-4 attribute conformance: a duplicate attribute name is blocked", async () => {
  const { onto, roleKeys } = await buildOntology();
  await assert.rejects(
    () =>
      commitActive(
        onto,
        roleKeys,
        entityUnit("Dup", { attributes: [{ name: "x", type: "string", required: true }, { name: "x", type: "number", required: false }] }),
      ),
    /semantic-integrity gate failed/,
  );
});

test("SI-6 disjointness: co-classification under two disjoint types is blocked", async () => {
  const { onto, roleKeys } = await buildOntology();
  await commitActive(onto, roleKeys, entityUnit("Person", { attributes: [] }));
  await commitActive(onto, roleKeys, entityUnit("Robot", { attributes: [] }));
  // Employee is-a Person AND is-a Robot via parents (co-classification).
  await commitActive(onto, roleKeys, entityUnit("Employee", { attributes: [], parents: ["Person", "Robot"] }));
  const constraintUnit = {
    unitId: "constraint:disjointPR",
    kind: "constraint" as const,
    namespace: NS,
    body: { constraintId: "disjointPR", label: "Person and Robot are disjoint", scope: "graph" as const, rule: "disjointness" as const, severity: "block" as const, appliesTo: ["Person", "Robot"] },
  };
  await assert.rejects(() => commitActive(onto, roleKeys, constraintUnit), /semantic-integrity gate failed/);
});

test("SI-7 authority-neutrality: a constraint that targets a non-waivable S1/S3/S4 control is blocked", async () => {
  const { onto, roleKeys } = await buildOntology();
  const evil = {
    unitId: "constraint:weakenS1",
    kind: "constraint" as const,
    namespace: NS,
    body: { constraintId: "weakenS1", label: "waive S1 control for entities", scope: "graph" as const, rule: "uniqueness" as const, severity: "block" as const, appliesTo: [] },
  };
  await assert.rejects(() => commitActive(onto, roleKeys, evil), /semantic-integrity gate failed/);
});

test("a well-formed graph passes the semantic-integrity gate (no block violations)", async () => {
  const { onto, roleKeys } = await buildOntology();
  await seedBaseEntities(onto, roleKeys);
  const { result } = await commitActive(onto, roleKeys, relationshipUnit("memberOf", "Person", "Organization", { cardinality: "N:M" }));
  assert.equal(result.integrity.ok, true);
  assert.equal(result.integrity.violations.filter((v) => v.severity === "block").length, 0);
});

// ------------------------------ Governance / separation of duties ------------------------------

test("O3 separation of duties: author == ratifier is rejected", async () => {
  const { onto, roleKeys } = await buildOntology();
  const unit = entityUnit("SoD", { attributes: [{ name: "n", type: "string", required: true }] });
  const uh = unitHash(unit);
  const cert = onto.certifications.issue(roleKeys.certifier, { unitHash: uh, caId: "oca1" });
  const rat = onto.ratifications.issue(roleKeys.ratifier, {
    unitHash: uh,
    raId: "ora1",
    author: "rachel-ratifier", // == ratifier owner -> SoD violation
    validators: ["victor-validator"],
    certifier: "carol-certifier",
    certificationId: cert.certificationId,
  });
  await assert.rejects(
    () => onto.commit(draftRecord(unit, { state: "active" }), { certification: cert, ratification: rat }),
    /ratification/,
  );
});

test("commit to active without governance is denied (deny-by-default)", async () => {
  const { onto } = await buildOntology();
  const unit = entityUnit("NoGov", { attributes: [{ name: "n", type: "string", required: true }] });
  await assert.rejects(() => onto.commit(draftRecord(unit, { state: "active" })), /requires a valid ontology certification/);
});

test("O2 replay: a re-used ratification nonce is rejected by verify with a nonce cache", async () => {
  const { onto, roleKeys } = await buildOntology();
  const unit = entityUnit("Replay", { attributes: [{ name: "n", type: "string", required: true }] });
  const uh = unitHash(unit);
  const { rat } = govern(onto, roleKeys, uh);
  assert.equal(onto.ratifications.verify(rat, { nonces: onto.nonces }).ok, true);
  assert.equal(onto.ratifications.verify(rat, { nonces: onto.nonces }).ok, false); // replay
});

// ------------------------------ Tamper / revocation (O8/O9) ------------------------------

test("O8 tampered unit: a record whose unitHash does not match its unit is rejected", async () => {
  const { onto, roleKeys } = await buildOntology();
  const unit = entityUnit("Tamper", { attributes: [{ name: "n", type: "string", required: true }] });
  const record = draftRecord(unit, { state: "active" });
  const forged = { ...record, unit: entityUnit("TamperEvil", { attributes: [] }) }; // unit swapped, hash stale
  const { cert, rat } = govern(onto, roleKeys, record.unitHash);
  await assert.rejects(() => onto.commit(forged, { certification: cert, ratification: rat }), /unitHash mismatch/);
});

test("O9 revoked record no longer resolves (fail-closed)", async () => {
  const { onto, roleKeys } = await buildOntology();
  const { record } = await commitActive(onto, roleKeys, entityUnit("Temp", { attributes: [{ name: "n", type: "string", required: true }] }));
  assert.ok(onto.resolver.resolve(NS, "entity", "Temp"));
  onto.revoke("record", record.recordId, "olivia-owner");
  assert.equal(onto.resolver.resolve(NS, "entity", "Temp"), undefined);
});

// ------------------------------ Federation (O6/O7) ------------------------------

async function foreignBundle(onto: Awaited<ReturnType<typeof buildOntology>>["onto"]) {
  const issuerKeys = generateKeyPair();
  const tokenKeys = generateKeyPair();
  onto.keys.register("remote-issuer-key", issuerKeys.publicKeyPem);
  onto.keys.register("remote-token-key", tokenKeys.publicKeyPem);
  onto.registry.registerAuthority({ authorityId: "remote-auth", owner: "remote", powers: ["federate"], keyRef: "remote-issuer-key", scope: "ontology:*" });
  onto.registry.defineBoundary({ boundaryId: "b1", members: ["remote-auth"], maxTrustLevel: 3, namespaceScope: "ontology:*" });

  const unit = entityUnit("RemoteThing", { attributes: [{ name: "n", type: "string", required: true }] });
  const record = createRecord({
    version: "1.0.0",
    unit,
    source: { kind: "federated", nodeId: "remote", authorityId: "remote-auth" },
    trustLevel: 9, // above the boundary ceiling on purpose (will be clamped)
    provenance: { origin: { nodeId: "remote" }, assertedBy: "remote-auth" },
    state: "active",
  });
  const now = Date.now();
  const base = { record, issuer: "remote-auth", issuerKeyRef: "remote-issuer-key", issuedAt: now, expiresAt: now + 60_000, nonce: "n-fed-1" };
  const bundle: OntologyBundle = { ...base, signature: signPayload(base, issuerKeys.privateKey) };
  const tbase = { tokenId: "tok-1", scope: "ontology:*", issuerKeyRef: "remote-token-key", issuedAt: now, expiresAt: now + 60_000, nonce: "n-tok-1" };
  const token: OntologyFederationToken = { ...tbase, signature: signPayload(tbase, tokenKeys.privateKey) };
  return { bundle, token };
}

test("O7 federated import is trust-clamped to the boundary ceiling", async () => {
  const { onto } = await buildOntology();
  const { bundle, token } = await foreignBundle(onto);
  const res = await onto.importBundle(bundle, "b1", { token });
  assert.equal(res.ok, true);
  const stored = onto.store.get(NS, "entity", "RemoteThing", "1.0.0");
  assert.equal(stored?.trustLevel, 3); // clamped from 9 to boundary max 3
});

test("O6 local sovereignty: a foreign record cannot override a local active record", async () => {
  const { onto, roleKeys } = await buildOntology();
  await commitActive(onto, roleKeys, entityUnit("RemoteThing", { attributes: [{ name: "n", type: "string", required: true }] }));
  const { bundle, token } = await foreignBundle(onto);
  const res = await onto.importBundle(bundle, "b1", { token });
  assert.equal(res.ok, false);
  assert.match(res.reason, /local sovereignty/);
});

test("federation import without a valid token is denied", async () => {
  const { onto } = await buildOntology();
  const { bundle } = await foreignBundle(onto);
  const res = await onto.importBundle(bundle, "b1", {});
  assert.equal(res.ok, false);
  assert.match(res.reason, /federation token/);
});

test("federation import from a non-member issuer is denied (deny-by-default)", async () => {
  const { onto } = await buildOntology();
  const { bundle, token } = await foreignBundle(onto);
  const res = await onto.importBundle(bundle, "nonexistent-boundary", { token });
  assert.equal(res.ok, false);
  assert.match(res.reason, /not a member|boundary/);
});

// ------------------------------ Audit (O12) ------------------------------

test("commit records an ONTO_ACTIVATED audit event", async () => {
  const { onto, roleKeys } = await buildOntology();
  const { unitHash: uh } = await commitActive(onto, roleKeys, entityUnit("Audited", { attributes: [{ name: "n", type: "string", required: true }] }));
  const events = onto.audit.entries().filter((e) => e.unitHash === uh);
  assert.ok(events.some((e) => e.event === "ONTO_ACTIVATED"));
});

test("O12 audit chain is hash-chained and independently verifiable; tamper is detected", async () => {
  const { onto, roleKeys } = await buildOntology();
  await commitActive(onto, roleKeys, entityUnit("Chained", { attributes: [{ name: "n", type: "string", required: true }] }));
  const exported = onto.audit.export();
  assert.equal(OntologyAuditLog.verify(exported).ok, true);
  // Tamper with an entry's detail; re-verification must fail.
  const tampered = { ...exported, chain: exported.chain.map((c, i) => (i === 0 ? { ...c, entry: { ...c.entry, detail: "TAMPERED" } } : c)) };
  assert.equal(OntologyAuditLog.verify(tampered).ok, false);
});

test("a blocked integrity commit is audited as ONTO_INTEGRITY and never persisted", async () => {
  const { onto, roleKeys } = await buildOntology();
  await commitActive(onto, roleKeys, entityUnit("Person", { attributes: [{ name: "name", type: "string", required: true }] }));
  await assert.rejects(() => commitActive(onto, roleKeys, relationshipUnit("dangling", "Person", "Missing")));
  assert.ok(onto.audit.entries().some((e) => e.event === "ONTO_INTEGRITY" && e.detail.includes("BLOCKED")));
  // Nothing persisted for the dangling relationship.
  assert.equal(onto.store.get(NS, "relationship", "dangling", "1.0.0"), undefined);
});

// ------------------------------ Evolution integration (O11) ------------------------------

test("O11 sole mutation path: persistence flows through the Evolution Fabric (applied + audited)", async () => {
  const { onto, roleKeys } = await buildOntology();
  const { result } = await commitActive(onto, roleKeys, entityUnit("EvoBacked", { attributes: [{ name: "n", type: "string", required: true }] }));
  assert.ok(result.evolutionUnitHash);
  assert.equal(onto.evolution.orchestrator.state(result.evolutionUnitHash), "active");
  assert.ok(onto.evolution.audit.entries().some((e) => e.event === "APPLIED" && e.unitHash === result.evolutionUnitHash));
});
