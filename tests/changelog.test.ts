import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseChangelog } from "../lib/changelog.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

test("entries keep file order, trimmed, with blank lines dropped", () => {
  assert.deepEqual(parseChangelog("  first  \n\nsecond\n   \nthird\n"), ["first", "second", "third"]);
});

test("Windows line endings leave no stray carriage returns", () => {
  assert.deepEqual(parseChangelog("first\r\nsecond\r\n\r\n"), ["first", "second"]);
});

test("an empty or whitespace-only file has no entries, so the footer shows build info alone", () => {
  assert.deepEqual(parseChangelog(""), []);
  assert.deepEqual(parseChangelog("\n\n   \n\t\r\n"), []);
});

/**
 * The footer shows the last line as the newest entry, so an entry appended out
 * of order or in the wrong shape would misreport what shipped last.
 */
test("updates.txt is well formed and oldest first", () => {
  const entries = parseChangelog(readFileSync(join(ROOT, "public", "updates.txt"), "utf8"));
  assert.ok(entries.length > 0, "updates.txt has no entries");
  const shape = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00Z) - \S.*$/;
  let previous = "";
  for (const entry of entries) {
    const match = shape.exec(entry);
    assert.ok(match, `not "YYYY-MM-DDTHH:MM:00Z - text": ${entry}`);
    assert.ok(match[1] >= previous, `out of order: ${entry}`);
    previous = match[1];
  }
});
