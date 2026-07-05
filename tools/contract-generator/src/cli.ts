/**
 * Contract Skeleton Generator — CLI entry (WI-07).
 *
 * Runs the deterministic, fail-closed pipeline and (by default) writes the SDK skeletons into
 * packages/contracts-sdk/generated/. Flags:
 *   --check   validate + report only; exit non-zero on FAIL; write nothing.
 *
 * Exit codes: 0 = PASS (and, without --check, artifacts written); 1 = validation FAIL.
 *
 * Usage:  node tools/contract-generator/src/cli.ts [--check]
 * Traceability: CONTRACT-VALIDATION-ARCHITECTURE.md §6/§7 · IC-2.
 */

import { generate } from "./generate.ts";
import { cleanGenerated, writeArtifacts } from "./writeArtifacts.ts";
import { generatedDir } from "./paths.ts";

function main(argv: readonly string[]): void {
  const check = argv.includes("--check");
  const result = generate();

  process.stdout.write(result.reportJson);

  if (result.report.verdict !== "PASS") {
    process.stderr.write("\nContract validation FAILED — no artifacts generated (fail-closed).\n");
    process.exitCode = 1;
    return;
  }

  if (check) {
    process.stdout.write(
      `\nvalidation PASS — ${result.files.length} artifacts would be generated (--check: nothing written).\n`,
    );
    return;
  }

  cleanGenerated();
  const written = writeArtifacts(result.files);
  process.stdout.write(`\nGenerated ${written.length} artifacts into ${generatedDir}\n`);
}

main(process.argv.slice(2));
