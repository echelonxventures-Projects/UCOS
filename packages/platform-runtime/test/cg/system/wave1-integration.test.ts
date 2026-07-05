/**
 * Batch-5 system verification — cross-registry lifecycle, up-trace, determinism, 0-ACTIVE.
 * Imports through the registries barrel (proves the barrel wires collision-free).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemoryAppendOnlyLog } from "../../../src/persistence-runtime/append-only-log.ts";
import { fixedClock, recordingAuditSink } from "../../../src/control/constitutional-governance/test-harness.ts";
import {
  createPrincipleRegistry,
  createMetaRegistry,
  createGovernanceCandidateRegistry,
  createCenterRegistry,
  createDomainRegistry,
  createPolicyRegistry,
  createCapabilityRegistry,
  createConsentRegistry,
  createDecisionRegistry,
  createTraceRegistry,
  createAuditRegistry,
} from "../../../src/control/constitutional-governance/registries/index.ts";
import type { ConstitutionalRecord } from "../../../src/control/constitutional-governance/types.ts";

/** Wire all eleven registries with cross-registry resolvers (this is per-registry DI, not CORE-04). */
function buildStack() {
  const clock = fixedClock();
  const audit = recordingAuditSink();
  const mk = () => ({ log: new InMemoryAppendOnlyLog(), clock, auditSink: audit.sink });

  const prin = createPrincipleRegistry(mk());
  const meta = createMetaRegistry({ ...mk(), principleExists: (id) => !!prin.getLatest(id) });
  const gov = createGovernanceCandidateRegistry(mk());
  const center = createCenterRegistry(mk());
  const domain = createDomainRegistry({ ...mk(), centerExists: (id) => !!center.getLatest(id) });
  const policy = createPolicyRegistry({ ...mk(), domainExists: (id) => !!domain.getLatest(id) });
  const cap = createCapabilityRegistry({ ...mk(), domainExists: (id) => !!domain.getLatest(id), policyExists: (id) => !!policy.getLatest(id) });
  const consent = createConsentRegistry(mk());
  const decision = createDecisionRegistry(mk());
  const trace = createTraceRegistry(mk());
  const auditReg = createAuditRegistry(mk());
  return { prin, meta, gov, center, domain, policy, cap, consent, decision, trace, auditReg, audit };
}

/** Propose a conformant full-chain corpus; returns every produced record. */
function seedCorpus(s: ReturnType<typeof buildStack>): ConstitutionalRecord[] {
  const out: ConstitutionalRecord[] = [];
  out.push(s.prin.propose({ logicalId: "PCAMG-PRIN-001", version: "1.0.0", ownerAuthority: "board", content: { statement: "Sovereignty Origin = Invariant Principles" }, createdBy: "board" }));
  out.push(s.meta.propose({ logicalId: "PCAMG-META-I", version: "1.0.0", ownerAuthority: "board", content: { article: "Supremacy" }, createdBy: "board", upTrace: ["PCAMG-PRIN-001"] }));
  out.push(s.gov.propose({ logicalId: "GOV-0001", version: "1.0.0", ownerAuthority: "compiler", content: { generationRef: "gen-1", candidate: true }, createdBy: "compiler", upTrace: ["PCAMG-PRIN-001", "PCAMG-META-I"] }));
  out.push(s.center.propose({ logicalId: "PGC-ROOT", version: "1.0.0", ownerAuthority: "board", content: {}, createdBy: "board", upTrace: ["PCAMG-PRIN-001"] }));
  out.push(s.domain.propose({ logicalId: "PDC-GOV", version: "1.0.0", ownerAuthority: "PGC-ROOT", content: { centerRef: "PGC-ROOT" }, createdBy: "board", upTrace: ["PCAMG-PRIN-001"] }));
  out.push(s.policy.propose({ logicalId: "POL-1", version: "1.0.0", ownerAuthority: "PDC-GOV", content: { domainRef: "PDC-GOV", effect: "deny" }, createdBy: "board", upTrace: ["PCAMG-PRIN-001"] }));
  out.push(s.cap.propose({ logicalId: "CAP-01", version: "1.0.0", ownerAuthority: "PDC-GOV", content: { domainRef: "PDC-GOV", policyRef: "POL-1" }, createdBy: "board", upTrace: ["PCAMG-PRIN-001"] }));
  out.push(s.consent.propose({ logicalId: "CONSENT-1", version: "1.0.0", ownerAuthority: "subj", content: { subject: "subj", grantee: "CAP-01", scope: {}, granted: true }, createdBy: "subj", upTrace: ["CAP-01"] }));
  out.push(s.decision.propose({ logicalId: "AD-0001", version: "1.0.0", ownerAuthority: "board", content: { proposer: "p", certifier: "c", ratifier: "r", subjectRef: "GOV-0001" }, createdBy: "board", upTrace: ["GOV-0001"] }));
  out.push(s.trace.propose({ logicalId: "E-1", version: "1.0.0", ownerAuthority: "author", content: { from: "PCAMG-META-I", to: "PCAMG-PRIN-001", relation: "derives-from", layerFrom: 1, layerTo: 0 }, createdBy: "author" }));
  out.push(s.auditReg.propose({ logicalId: "AUD-1", version: "1.0.0", ownerAuthority: "audit", content: { actor: "board", action: "PROPOSE", subjectRef: "PCAMG-PRIN-001@1.0.0" }, createdBy: "audit" }));
  return out;
}

test("SYSTEM: full L0→L6 chain proposes conformantly; every non-root record up-traces", () => {
  const s = buildStack();
  const records = seedCorpus(s);
  assert.equal(records.length, 11);
  for (const r of records) {
    if (r.registry === "REG-PRIN" || r.registry === "REG-TRACE" || r.registry === "REG-AUDIT") continue;
    assert.ok(r.upTrace.length >= 1, `${r.registry} ${r.logicalId} must up-trace to ≥1 source`);
  }
});

test("SYSTEM: 0 ACTIVE — no record is representable/derivable as active", () => {
  const s = buildStack();
  const records = seedCorpus(s);
  for (const r of records) {
    assert.ok(r.status === "proposed" || r.status === "superseded");
    assert.notEqual(r.status as string, "active");
  }
});

test("SYSTEM: determinism — identical corpora yield identical content hashes", () => {
  const a = seedCorpus(buildStack());
  const b = seedCorpus(buildStack());
  assert.equal(a.length, b.length);
  for (let i = 0; i < a.length; i += 1) {
    assert.equal(a[i]!.contentHash, b[i]!.contentHash, `hash mismatch at ${a[i]!.logicalId}`);
    assert.equal(a[i]!.recordUuid, b[i]!.recordUuid);
  }
});

test("SYSTEM: RG-8 — every produced record emitted an attributable audit event", () => {
  const s = buildStack();
  const records = seedCorpus(s);
  assert.equal(s.audit.events.length, records.length);
  for (const e of s.audit.events) {
    assert.ok(e.actor.length > 0 && e.subjectRef.includes("@"));
  }
});
