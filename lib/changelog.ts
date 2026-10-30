/**
 * The changelog is public/updates.txt: one entry per line, oldest first, so
 * shipping an entry is a one-line append. Fetched at runtime rather than
 * bundled, so editing the text file needs no code change.
 */

export const CHANGELOG_URL = "/updates.txt";

/** Splits the file into entries, oldest first. Tolerates CRLF, padding and blank lines. */
export function parseChangelog(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
