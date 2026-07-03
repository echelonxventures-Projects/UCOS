#!/usr/bin/env node
/**
 * UCOS Substrate CLI — runtime artifact.
 *
 * Usage:
 *   ucos-substrate <descriptorDir> [--exec <capabilityId>.<operation>] [--input '<json>']
 *
 * Loads a directory of descriptor JSON files, resolves + composes the capability graph,
 * prints a composition report, and optionally executes one operation.
 */

import process from "node:process";
import { createSubstrate } from "../src/bootstrap.ts";

interface CliArgs {
  directory: string;
  exec?: string;
  input: string;
}

function parseArgs(argv: string[]): CliArgs | undefined {
  const positional = argv[0];
  if (!positional || positional.startsWith("--")) return undefined;
  const args: CliArgs = { directory: positional, input: "{}" };
  for (let i = 1; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === "--exec") {
      i += 1;
      args.exec = argv[i];
    } else if (flag === "--input") {
      i += 1;
      args.input = argv[i] ?? "{}";
    }
  }
  return args;
}

function usage(): void {
  process.stdout.write(
    "Usage: ucos-substrate <descriptorDir> [--exec <capabilityId>.<operation>] [--input '<json>']\n",
  );
}

async function main(): Promise<number> {
  const args = parseArgs(process.argv.slice(2));
  if (!args) {
    usage();
    return 1;
  }

  const { kernel } = createSubstrate();
  await kernel.bootstrap({ directory: args.directory });

  const report = kernel.report();
  process.stdout.write("\nUCOS Foundational Substrate — Composition Report\n");
  process.stdout.write("================================================\n");
  process.stdout.write(`Contracts (${report.contracts.length}):\n`);
  for (const contract of report.contracts) {
    process.stdout.write(`  - ${contract.id}@${contract.version} [${contract.operations.join(", ")}]\n`);
  }
  process.stdout.write(`Composition order: ${report.order.join(" -> ")}\n`);
  process.stdout.write(`Capabilities (${report.capabilities.length}):\n`);
  for (const capability of report.capabilities) {
    const deps = capability.dependencies.length ? ` depends:[${capability.dependencies.join(", ")}]` : "";
    process.stdout.write(
      `  - ${capability.id}@${capability.version} "${capability.name}" state=${capability.state} ops:[${capability.operations.join(", ")}]${deps}\n`,
    );
  }

  if (args.exec) {
    const separator = args.exec.lastIndexOf(".");
    if (separator <= 0) {
      process.stderr.write(`Invalid --exec target "${args.exec}" (expected <capabilityId>.<operation>)\n`);
      return 1;
    }
    const capabilityId = args.exec.slice(0, separator);
    const operation = args.exec.slice(separator + 1);
    const input: unknown = JSON.parse(args.input);
    const result = await kernel.execute(capabilityId, operation, input);
    process.stdout.write("\nExecution\n---------\n");
    process.stdout.write(`${capabilityId}.${operation}(${args.input}) => ${JSON.stringify(result)}\n`);
  }

  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((error: unknown) => {
    if (error instanceof Error) {
      process.stderr.write(`\n[substrate error] ${error.message}\n`);
    } else {
      process.stderr.write(`\n[substrate error] ${String(error)}\n`);
    }
    process.exit(1);
  });
