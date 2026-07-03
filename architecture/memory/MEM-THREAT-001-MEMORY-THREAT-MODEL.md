# MEM-THREAT-001 — UCOS Memory Fabric Threat Model

| Field | Value |
|-------|-------|
| Artifact | **MEM-THREAT-001 — Memory Threat Model** |
| Workstream | FND-MEM-06 (PHASE 18 · PI-9.0) |
| Version | 1.0.0 |
| Status | **DESIGN — READY FOR RATIFICATION** (specification only) |
| Method | STRIDE, adapted to the 6-tier Memory Fabric; scored Likelihood/Impact → Residual after mitigating spec(s) |
| Basis | MEM-GOV-001/002, MEM-ARCH-001, MEM-SEC-001, MEM-FED-001, MEM-AUD-001; AUTH-008 (S1/S3/S4) |
| Prohibited-dir impact | **NONE** — analysis only |

> Enumerates the memory-specific threat surface (M1–M12) across capture, consolidation, recall, retention,
> federation, and audit, and records the mitigating specification(s) and residual rating for each. The
> ratification determination (MEM-READINESS-001) requires **0 residual High/High**.

---

## 1. Assets & trust surfaces

| Asset | Tier(s) | Primary risk |
|-------|---------|--------------|
| Ephemeral context | Working | leakage on promotion; resource exhaustion |
| Recent context | Short-Term | leakage; unbounded retention |
| Durable memory | Long-Term | poisoning; unauthorized consolidation; un-forgettable data |
| Generalized facts | Semantic | drift vs ratified knowledge; poisoning |
| Experience log | Episodic | tamper; over/under-forgetting; audit divergence |
| Cross-node memory | Federated | poisoning; stale recall; boundary bypass |

**Trust boundaries:** principal↔fabric (recall/write), tier↔tier (consolidation/promotion), fabric↔Evolution
(durable mutation), fabric↔Knowledge (semantic linkage), node↔node (federated memory), fabric↔audit.

## 2. STRIDE threat register (M1–M12)

| # | Threat | STRIDE | Vector | Likelihood/Impact (unmitigated) | Mitigating spec(s) | Residual |
|---|--------|--------|--------|:-------------------------------:|--------------------|:--------:|
| **M1** | Memory poisoning (inject false memory) | S/T | Unsigned/forged write into any tier | High/High | MEM-SEC-001 §2 (signed assertions) + C5 certification + provenance-valid-before-store | **Low** |
| **M2** | Cross-tier / cross-boundary leakage | I | Classified WM/STM promoted or federated to a weaker context | High/High | MGP-3 monotonic classification + MEM-SEC-CLASS recall projection + federation gate (S4) | **Low** |
| **M3** | Unbounded retention / retention violation | I/C | Memory retained indefinitely; no expiry | Med/High | MGP-5 + MEM-GOV-002 §2 (mandatory retention class; fail-closed expiry) | **Low** |
| **M4** | Recall fabrication (invented recall) | T | Engine returns synthesized memory | Med/High | MEM-SEC-001 §7 no-synthesis rule; recall resolves only to verified stored records | **Low** |
| **M5** | Federation memory poisoning / override | S/T | Foreign memory shadows/overrides a local record | High/High | MEM-FED-001 (namespaced deny-only shadow, verified-before-store, local-shadows-foreign) | **Low–Med** |
| **M6** | Partition / stale federated recall | D/A | Recalling expired/unreachable foreign memory | High/Med | FGP-4/MFV fail-closed + bounded staleness + hard expiry | **Med** |
| **M7** | Replay of memory assertions | T | Replaying old assertion to resurrect forgotten/superseded memory | Med/High | MEM-SEC-001 §6 (nonce cache + freshness + expiry) | **Low** |
| **M8** | Consolidation authority escalation | E | Principal self-promotes WM→LTM/federated | Med/High | MEM-SEC-001 §3 authority-gated promotion + SoD (C4≠C5≠C6) | **Low** |
| **M9** | Forgetting failure (under- **and** over-forget) | C/R | Value remains recallable after forget; **or** forgetting destroys audit evidence | High/High | MEM-GOV-002 §2.3 two-sided guard + MEM-AUD-001 §5 (revocation propagates; audit chain out-of-scope for deletion) | **Low** |
| **M10** | Memory audit divergence | R | Nodes disagree on memory events; tamper of history | High/High | MEM-AUD-001 (hash chain + checkpoints + reconciliation + fail-closed) | **Low–Med** |
| **M11** | Semantic drift / memory↔knowledge desync | T/I | Semantic memory contradicts ratified knowledge | Med/High | MEM-GOV-001 §2.4 co-ratification + MEM-GOV-002 §3.1 block-and-propose to Knowledge Fabric | **Low** |
| **M12** | Working-memory exhaustion (resource DoS) | D | Unbounded WM/STM growth | Med/Med | MEM-GOV-T1/T2 size caps + retention expiry + evolution governor rate/halt (E12) | **Low–Med** |

## 3. Threat-to-boundary coverage

| Boundary | Threats | Coverage |
|----------|---------|----------|
| principal↔fabric | M1, M4, M8, M12 | signed writes, deny-by-default recall, authority-gated consolidation, size caps |
| tier↔tier | M2, M8 | monotonic classification, authority-gated promotion |
| fabric↔Evolution | M8, M9 | all durable mutation via governor; atomic apply/rollback |
| fabric↔Knowledge | M11 | co-ratification; block-and-propose |
| node↔node | M5, M6, M7, M10 | boundary verify, deny-only shadow, replay protection, reconciliation |
| fabric↔audit | M9, M10 | hash-chain, audit-preserving forgetting, divergence handling |

**12/12 threats mapped; every boundary covered; 0 silent surfaces.**

## 4. Residual risk summary

- **0 residual High/High.** All four unmitigated High/High threats (M1, M2, M5, M9, M10) reduced to Low or
  Low–Med.
- Remaining **Med** residuals (M6 partition, M10 cross-node divergence, M5 federation, M12 resource) are
  inherent to distributed, retentive memory and are acceptably bounded by fail-closed behavior + reconciliation
  cadence + governor rate/halt.
- Non-waivable **S1/S3/S4** are designed and enforced across all tiers and the federation boundary
  (MEM-SEC-001 §10; MEM-FED-001 §6).

## 5. Traceability
- **Refines:** MEM-GOV-001/002, MEM-ARCH-001, MEM-SEC-001, MEM-FED-001, MEM-AUD-001; AUTH-008; UCOS-SEC-ARCH-001.
- **Consumed by:** MEM-READINESS-001 (threat ledger), future PI-9 adversarial test suite (M1–M12).
- **Owner:** UCOS Authority Board (Security).

**END MEM-THREAT-001 — DESIGN · READY FOR RATIFICATION · 0 RESIDUAL HIGH/HIGH · NO IMPLEMENTATION AUTHORIZED.**
