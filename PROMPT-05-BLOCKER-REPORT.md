# PROMPT-05-BLOCKER-REPORT

**Artifact:** PROG-BLOCKER-PROMPT-05-001
**Phase:** PHASE-N.2 — Post-PI11 Constitutional Recompilation (WS6 outcome)
**Work item:** `Prompt-05` — Payload Authoring (ConfigurationValue, MetadataRecord, FeatureFlag, RegistryArtifact, DiscoveryRecord)
**Compiler status:** READY · AUTHORIZED (structural) · Priority 40
**Execution outcome:** **NOT EXECUTED — CONTENT-BLOCKED (fail-closed)**
**Determinism:** fingerprint `8d1c9b6af2ae03c1`

---

## 1. Summary

Prompt-05 is the compiler-resolved next executable item and passes every structural authorization
gate. It was **not executed** because the acceptance criteria are mutually constraining and cannot
both be satisfied by a software agent given current repository authority:

1. *"field-level payload schemas authored for the 5 named constructs"* — requires concrete field definitions.
2. *"no fabricated schemas beyond contract authority"* — forbids inventing those definitions.

The authoritative field-level content for all five families is owned by **`UCOS-PDATA-ARCH-001`**
(Data Architecture) and has been **deferred** to a later authorized phase. No compliant source
exists to author from; producing fields anyway is fabrication. Under the program's fail-closed rule,
execution is withheld and this blocker is filed instead.

---

## 2. What Prompt-05 requires (mechanically)

Author, for each family, a `<key>.fieldschema.json` in `contracts/field-schemas/` conforming to
`contracts/schema/field-schema.schema.json`, bound via `payloadFamily` + `dataContract`:

| # | Family | Registry binding key | Backing data contract |
|---|--------|----------------------|-----------------------|
| F1 | ConfigurationValue | `UCOS-DATA-CONTRACT-018/ConfigurationValue` | DC-018 (API-018) |
| F2 | MetadataRecord | `UCOS-DATA-CONTRACT-018/MetadataRecord` | DC-018 (API-018) |
| F3 | FeatureFlag | `UCOS-DATA-CONTRACT-018/FeatureFlag` | DC-018 (API-018) |
| F4 | RegistryArtifact | `UCOS-DATA-CONTRACT-027/RegistryArtifact` | DC-027 (API-027) |
| F5 | DiscoveryRecord | `UCOS-DATA-CONTRACT-027/DiscoveryRecord` | DC-027 (API-027) |

The framework to consume these (meta-schema, registry loader, sufficiency engine) exists and is
VERIFIED (WI-06..WI-10). The generator is **ready to consume schemas when authored** — only the
authoritative **content** is missing.

---

## 3. Root cause — the content-authority gap

### 3.1 The owning authority has deferred the content
- **Physical Data Architecture (`UCOS-PDATA-ARCH-001`)** is **Wave-A, domain-only**. Principle
  **PP-G**: *"Wave A defines physical data domains only; entities, persistence structures, and
  relationships are deferred."* Entities PDE-059 (Artifact Descriptor), PDE-061 (Discovery Index),
  PDE-070 (Configuration Set) exist as **names only**, with **no attributes/fields**.
- **Logical Data Architecture (`UCOS-LDATA-ARCH-001`)** likewise defines LDO-059/061 at the
  meaning/entity level with **no field lists**.
- **PROJECT-STATE / INF baseline:** *"the Data Architecture (Prompt 05) is derived from this baseline
  only in a later authorized phase."* That phase has not been authorized/executed.

### 3.2 Every authority forbids inventing the content
- **Field-schema registry README** (`contracts/field-schemas/README.md`): the five families are
  *"owned by `UCOS-PDATA-ARCH-001` (Prompt 05) and are authored + ratified through governed change,
  **not invented here**."* Directory is *"EMPTY BY DESIGN."*
- **Catalog contracts** (`api-018`, `api-027`): `fieldLevelSchema = "NOT DEFINED IN CATALOG (owned
  by Prompt 05 / UCOS-PDATA-ARCH-001)"`; `generationConstraints`: field schemas *"MUST NOT be
  invented by the generator."*
- **Service/Contract Architecture P6:** *"Data referenced, never redefined … no new schema invented."*
- **WI-09-REPOSITORY-DISCOVERY-REPORT** classifies F1–F5 as **Content** blockers, owner
  `UCOS-PDATA-ARCH-001`, nature **"Author + ratify field schema."**

### 3.3 Why software cannot close it
The substrate types that share names with two families are **infrastructure**, not the API payloads:
`meta-core/ports.ts::RegistryRecord` = `{id, version, kind, descriptor}` and `MetadataRecord` =
`{key, value, schema?}` describe the runtime registry/metadata **ports**, not the published
`RegistryArtifact` / `MetadataRecord` API payload families. Mapping one onto the other would itself
be an invention. There is **no** authoritative field-level source to derive from, so any authored
field set is fabrication — precisely the failure mode the fail-closed design (and the DTO generator's
`export type X = unknown` posture) exists to prevent.

---

## 4. Blocker classification

| Attribute | Value |
|-----------|-------|
| Blocker id | `BLK-PROMPT-05-CONTENT` |
| Class | **CONTENT-AUTHORITY** (not external-governance, not internal-dependency) |
| Solvable by this software agent | **No** — would require fabrication |
| Solvable by software **after** the gating act | **Yes** — once authoritative field content exists, authoring the 5 `*.fieldschema.json` and running the generator is mechanical and software-solvable |
| Required actor | **Data Architecture authority** (`UCOS-PDATA-ARCH-001` owner, "Prompt 05" data-architecture generation) under governed change; ratification per data-governance (AUTH-007) |
| Required action | Authorize + produce the deferred field-level physical/logical data-entity model (Wave B) for DOM-018 (Config/Metadata/FeatureFlag) and DOM-027 (Registry/Discovery), yielding ratifiable field definitions |
| Gating gate | `GATE-DOC-001` (+ data-governance ratification) |

---

## 5. Required path to unblock (governed, additive)

1. **Authorize Wave-B data-entity modeling** for `UCOS-PDATA-ARCH-001` (entities/attributes for
   PD-14 Registry and PD-17 Platform, deferred at Wave A).
2. **Author + ratify** the field-level attributes for the five families under the Data Architecture
   authority (source of truth; not the contract catalog, not the generator, not this agent).
3. **Derive** the five `contracts/field-schemas/*.fieldschema.json` from the ratified attributes
   (this step is software-solvable and can be executed autonomously once step 2 exists).
4. **Run** `node tools/contract-generator/src/cli.ts`; confirm Stage-3 sufficiency flips to
   `SUFFICIENT` for DC-018/DC-027 DTOs + Validators.
5. **Advance** `EV-PROMPT-05` PENDING → SUBMITTED → VERIFIED via `ucos:set-evidence` (governed
   transition); recompile.

Until step 2 exists, Prompt-05 remains **content-blocked** and must **not** be force-executed.

---

## 6. Registry disposition

No registry mutation was performed for Prompt-05 (no fabricated schema authored, no evidence
elevated). This preserves determinism (fingerprint `8d1c9b6af2ae03c1` unchanged) and the fail-closed
invariant. A gap already tracks this: `GAP-PROMPT-05` (HIGH, contract-authoring, OPEN). Recommended
(optional, governed) enhancement: annotate `GAP-PROMPT-05` with the content-authority root cause and
the `UCOS-PDATA-ARCH-001` Wave-B prerequisite — deferred to the registry-change authority to keep
this report non-mutating.

---

## 7. Conclusion

Prompt-05 is correctly **selected** and structurally **authorized**, but is **content-blocked** by a
constitutional prohibition on fabricating schemas beyond contract authority. The blocker is not
software-closable by this agent; it requires a governed data-architecture authoring + ratification
act (`UCOS-PDATA-ARCH-001` Wave B) that is upstream of Prompt-05 and has been deferred. Execution is
withheld under the fail-closed rule. Post-gate, Prompt-05 becomes fully software-solvable.

**Traceability:** `PROG-WI-001`, `PROG-EVID-001`, `PROG-GAP-001` (GAP-PROMPT-05); `UCOS-PDATA-ARCH-001`,
`UCOS-LDATA-ARCH-001`, `UCOS-CONTRACT-CAT-001`, `UCOS-SVC-ARCH-001` (P6); `WI-09-REPOSITORY-DISCOVERY-REPORT`;
`contracts/field-schemas/README.md`; AUTH-004/007/009; UCOS-CONST-001 (Art. IV).
