// The Meeting That Should Have Been One Line — v1 entry.
//
// Writes exactly one line to /output/entry.txt: the single sentence that
// could have replaced an entire pointless meeting. No context, no
// explanation, no setup — the line itself is the decision that kills
// the meeting.
//
// Pure Node, no dependencies. Deterministic: the same bytes on every run,
// from any working directory.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// The one sentence that replaces the meeting.
const LINE =
  "The logo stays blue, the launch is Tuesday, and this meeting exists so Dave can say he was in the room when it happened.";

// The gate allows 1–200 characters of UTF-8 text, not only whitespace.
const MAX_CHARS = 200;

function validate(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (line.length > MAX_CHARS) {
    throw new Error(`line is ${line.length} chars, over the ${MAX_CHARS}-char gate`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be exactly one line");
  }
  // Exactly one sentence: a single sentence-terminated segment.
  const sentences = line.split(/[.!?]+/).filter((part) => part.trim().length > 0);
  if (sentences.length !== 1) {
    throw new Error(`expected exactly one sentence, found ${sentences.length}`);
  }
}

const outPath = process.env.ENTRY_OUTPUT ?? "/output/entry.txt";

validate(LINE);
mkdirSync(dirname(resolve(outPath)), { recursive: true });
writeFileSync(outPath, LINE + "\n", "utf8");

// Read back and verify: the file must contain exactly the line, one line.
const written = readFileSync(outPath, "utf8");
if (written !== LINE + "\n") {
  throw new Error("read-back mismatch: /output/entry.txt does not contain exactly the line");
}
const lines = written.split("\n").filter((part) => part.length > 0);
if (lines.length !== 1) {
  throw new Error(`expected exactly one non-empty line in output, found ${lines.length}`);
}
