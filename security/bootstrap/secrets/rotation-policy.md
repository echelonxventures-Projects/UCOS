# WI-SEED.5 — Secret & Key Rotation Policy (S3)

**Control:** SEC-CTL-007 (Secret/key rotation) + SEC-CTL-006 (Key lifecycle) · **Checkpoint:** GATE-SEC-001
**S3** (non-waivable) · **ADR:** ADR-006 · **PI:** PI-1.

## Policy
| Secret/key class | Reference | Rotation trigger | Rotation type |
|------------------|-----------|------------------|---------------|
| mTLS CA / mesh keys | `external://kms/pi1/mesh-ca` | scheduled + on-compromise | Approval-Required |
| At-rest data keys | `external://kms/pi1/persistence-atrest` | scheduled; envelope re-wrap | Approval-Required |
| Artifact signing key | `external://kms/pi1/artifact-signing` | scheduled + on-compromise | Approval-Required |
| Service SoR credentials | `external://secrets/pi1/*-db` | scheduled + on-compromise | Trusted (automated) |

## Rules
- Rotation is defined for **every** issued secret/key (S3 requirement: "rotation defined").
- Rotation is **Approval-Required** for keys with cryptographic blast radius (mesh CA, at-rest, signing);
  credential rotation may be automated (Trusted).
- Rotation never exposes secret material to code/config/IaC/logs (by-reference only, S3).
- Concrete rotation intervals are bound to ratified ASR values (PC-1) and to the `WP-PLT-09` KMS product
  (PI-2); the seed defines the **policy**, not vendor-specific intervals (PEP-010).
- Superseded by `WP-PLT-09` rotation implementation in PI-2 (migration-only, IC-7).

## Traceability
ADR-006 · `UCOS-SEC-CONTROL-001` SEC-CTL-006/007 (S3), 009 (S4) · `GATE-SEC-001` S3 · IC-1 · NB-1/PC-2.
