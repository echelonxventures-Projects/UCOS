import { test } from "node:test";
import assert from "node:assert/strict";
import { createSubstrate } from "../src/bootstrap.ts";
import { ValidationError } from "../src/meta-core/errors.ts";
import type { CapabilityContext, CapabilityInstance, Descriptor } from "../src/contracts/types.ts";

const textContract: Descriptor = {
  kind: "contract",
  id: "contract.text-producer",
  version: "1.0.0",
  operations: [
    {
      name: "produce",
      input: { type: "object", properties: { subject: { type: "string" } }, additionalProperties: false },
      output: { type: "string" },
    },
  ],
};

/**
 * PROOF: a completely new capability is introduced at runtime purely through
 * (1) a metadata descriptor and (2) an externally supplied provider — with NO change to
 * any Meta-Core / Registry / Metadata / Configuration source file.
 */
test("a new capability can be introduced purely via metadata + provider (no core change)", async () => {
  const { kernel } = createSubstrate();

  // Provider supplied from outside the core, registered against a plugin reference.
  kernel.registerProvider("runtime.reverse", (ctx: CapabilityContext): CapabilityInstance => {
    const prefix = String(ctx.config.prefix ?? "");
    return {
      operations: {
        produce: (input: unknown): string => {
          const subject = (input as { subject?: string } | null)?.subject ?? "";
          return prefix + [...subject].reverse().join("");
        },
      },
    };
  });

  const reverseCapability: Descriptor = {
    kind: "capability",
    id: "cap.reverse",
    version: "1.0.0",
    name: "Reverse Producer",
    contract: { id: "contract.text-producer", versionRange: "^1.0.0" },
    provider: { module: "plugin:runtime.reverse", export: "create" },
    configSchema: { type: "object", properties: { prefix: { type: "string" } }, additionalProperties: false },
    defaults: { prefix: ">> " },
  };

  kernel.loadDescriptors([textContract, reverseCapability]);
  await kernel.compose();

  assert.equal(kernel.state("cap.reverse"), "active");
  assert.equal(await kernel.execute("cap.reverse", "produce", { subject: "abc" }), ">> cba");
});

test("newly introduced capability honors configuration overrides", async () => {
  const { kernel } = createSubstrate();
  kernel.registerProvider("runtime.reverse", (ctx: CapabilityContext): CapabilityInstance => ({
    operations: {
      produce: (input: unknown): string => {
        const subject = (input as { subject?: string } | null)?.subject ?? "";
        return String(ctx.config.prefix ?? "") + [...subject].reverse().join("");
      },
    },
  }));
  kernel.loadDescriptors([
    textContract,
    {
      kind: "capability",
      id: "cap.reverse",
      version: "1.0.0",
      name: "Reverse Producer",
      contract: { id: "contract.text-producer", versionRange: "^1.0.0" },
      provider: { module: "plugin:runtime.reverse", export: "create" },
      configSchema: { type: "object", properties: { prefix: { type: "string" } }, additionalProperties: false },
      defaults: { prefix: ">> " },
    },
  ]);
  kernel.setConfig("instance", "cap.reverse", { prefix: "! " });
  await kernel.compose();
  assert.equal(await kernel.execute("cap.reverse", "produce", { subject: "xy" }), "! yx");
});

test("composition fails when resolved config violates the capability config schema", async () => {
  const { kernel } = createSubstrate();
  kernel.registerProvider("runtime.needs-config", (): CapabilityInstance => ({
    operations: { produce: (): string => "" },
  }));
  kernel.loadDescriptors([
    textContract,
    {
      kind: "capability",
      id: "cap.needs-config",
      version: "1.0.0",
      name: "Needs Config",
      contract: { id: "contract.text-producer", versionRange: "^1.0.0" },
      provider: { module: "plugin:runtime.needs-config", export: "create" },
      configSchema: { type: "object", required: ["token"], properties: { token: { type: "string" } } },
    },
  ]);
  await assert.rejects(() => kernel.compose(), (error: unknown) => error instanceof ValidationError || (error as { code?: string }).code === "COMPOSITION_FAILED" || (error as { code?: string }).code === "VALIDATION_FAILED");
});
