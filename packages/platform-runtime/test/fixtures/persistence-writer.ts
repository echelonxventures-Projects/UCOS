/**
 * Cross-process durability fixture (AC-2, machine-restart safety).
 *
 * Spawned by persistence-continuity.test.ts as a SEPARATE OS process. It boots a durable substrate
 * over the directory given as argv[2], performs the canonical WRITE phase, and exits. Because every
 * append is fsynced, the state is on physical storage by the time this process terminates — so a
 * fresh process (the test) can rehydrate identical state, which is exactly the machine-restart proof.
 */

import process from "node:process";
import { bootDurable, applyWritePhase } from "../persistence-harness.ts";

async function main(): Promise<void> {
  const directory = process.argv[2];
  if (!directory) {
    process.stderr.write("usage: persistence-writer.ts <directory>\n");
    process.exit(2);
    return;
  }
  const substrate = await bootDurable(directory);
  applyWritePhase(substrate);
  // Terminate the process. Durable state must survive without any graceful "flush" step.
  process.exit(0);
}

void main();
