/**
 * Pulls a timeable duration out of a prescription string.
 *
 * Only prescriptions that are *entirely* a duration qualify. "45s" and
 * "2-3 min per side" get a timer; "5 x 7-10s" and "6 x 10s pulls" do not,
 * because those are set-and-rep prescriptions whose blocks already carry an
 * interval timer. Ranges resolve to the upper bound - if the plan says 45-60s,
 * the target is 60.
 */
const TRAILING = /\s+(per side|each side|each way|each direction|each|hold|alternating|continuous|traverse)$/i;
const DURATION = /^(\d+)(?:\s*-\s*(\d+))?\s*(s|sec|secs|seconds?|min|mins|minutes?)$/i;

export function parseDuration(pres: string): number | null {
  let text = pres.trim();
  // Strip at most a couple of qualifiers, e.g. "45s per side".
  for (let i = 0; i < 2; i++) text = text.replace(TRAILING, "").trim();

  const m = DURATION.exec(text);
  if (!m) return null;

  const value = Number(m[2] ?? m[1]);
  if (!Number.isFinite(value) || value <= 0) return null;

  const minutes = /^min/i.test(m[3]);
  const seconds = minutes ? value * 60 : value;
  // Beyond ten minutes it is a block, not a set.
  return seconds > 600 ? null : seconds;
}

export function formatDuration(seconds: number): string {
  if (seconds < 120) return `${seconds}s`;
  const m = seconds / 60;
  return `${Number.isInteger(m) ? m : m.toFixed(1)}m`;
}
