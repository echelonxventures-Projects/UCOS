/**
 * Example capability provider that COMPOSES another capability (cap.greeting) injected by
 * the substrate. Proves cross-capability composition through the registry/metadata/config
 * fabric with zero core changes.
 */

import type { CapabilityContext, CapabilityInstance } from "../../src/contracts/types.ts";

export function createShout(ctx: CapabilityContext): CapabilityInstance {
  const greeting = ctx.dependencies.greeting;
  if (!greeting) {
    throw new Error("cap.shout requires an injected 'greeting' dependency");
  }
  const produceGreeting = greeting.operations.produce;
  if (typeof produceGreeting !== "function") {
    throw new Error("injected 'greeting' does not expose a 'produce' operation");
  }
  return {
    operations: {
      produce: async (input: unknown): Promise<string> => {
        const base = await produceGreeting(input);
        return String(base).toUpperCase();
      },
    },
  };
}
