/**
 * Example capability provider — NOT part of the substrate core.
 * Demonstrates that behavior is supplied entirely by an external provider referenced by metadata.
 */

import type { CapabilityContext, CapabilityInstance } from "../../src/contracts/types.ts";

export function createGreeting(ctx: CapabilityContext): CapabilityInstance {
  const salutation = String(ctx.config.salutation ?? "Hello");
  return {
    operations: {
      produce: (input: unknown): string => {
        const subject = (input as { subject?: string } | null)?.subject ?? "world";
        return `${salutation}, ${subject}!`;
      },
    },
  };
}
