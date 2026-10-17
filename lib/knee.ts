"use client";

/**
 * Morning knee check-ins, and the rule that turns them into a decision.
 *
 * Knee rehab is paced by symptoms, not by the calendar. This is the
 * pain-monitoring model physiotherapists use for tendon and kneecap pain: pain
 * during exercise up to a ceiling is acceptable, provided it has settled by the
 * next morning and morning pain is not trending up. Logging it is what turns
 * three phase plans into a progression rather than a menu.
 *
 * Same external-store shape as the other localStorage-backed state.
 */

export type KneeCheckIn = {
  /** Local calendar day, yyyy-mm-dd. One per day; logging again replaces it. */
  day: string;
  /** Pain on getting up this morning, 0-10. */
  morning: number;
  /** Worst pain during the last knee session, 0-10. */
  session: number;
};

/** Pain at or under this is acceptable, during the work and the next morning. */
export const PAIN_CEILING = 3;
/** A rise this large is more than day-to-day noise on a 0-10 scale. */
export const MEANINGFUL_RISE = 2;
/** Clean check-ins in a row before stepping up. */
export const STREAK_TO_PROGRESS = 3;

export type KneeVerdict = {
  kind: "start" | "progress" | "hold" | "back";
  title: string;
  detail: string;
};

function withinCeiling(e: KneeCheckIn): boolean {
  return e.morning <= PAIN_CEILING && e.session <= PAIN_CEILING;
}

/** Newest first. A check-in is clean if it is within the ceiling and morning pain did not jump. */
export function cleanStreak(entries: readonly KneeCheckIn[]): number {
  let n = 0;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const before = entries[i + 1];
    if (!withinCeiling(e)) break;
    if (before && e.morning - before.morning >= MEANINGFUL_RISE) break;
    n++;
  }
  return n;
}

/** Entries newest first. */
export function kneeVerdict(entries: readonly KneeCheckIn[]): KneeVerdict {
  const [latest, previous] = entries;
  if (!latest) {
    return {
      kind: "start",
      title: "No check-ins yet",
      detail:
        "Log one each morning after a knee session: pain on getting up, and the worst pain during the session. Start in Phase 1 unless the knee already handles stairs and squats without complaint.",
    };
  }

  if (!withinCeiling(latest)) {
    return {
      kind: "back",
      title: "Step back",
      detail: `Pain above ${PAIN_CEILING}/10. Drop back a rung or a phase, or cut the session by about a third, until check-ins are back at ${PAIN_CEILING} or under. Pain that keeps climbing, swelling or giving way is a reason to see a clinician.`,
    };
  }

  const rise = previous ? latest.morning - previous.morning : 0;
  if (rise >= MEANINGFUL_RISE) {
    return {
      kind: "hold",
      title: "Hold: morning pain is up",
      detail: `Up ${rise} since the last check-in. Repeat the last session at the same load rather than adding to it.`,
    };
  }

  const streak = cleanStreak(entries);
  if (streak >= STREAK_TO_PROGRESS) {
    return {
      kind: "progress",
      title: "Ready to progress",
      detail: `${STREAK_TO_PROGRESS} clean check-ins in a row. Move up one step: a rung on the ladder, more load, or the next phase. One change at a time.`,
    };
  }

  return {
    kind: "hold",
    title: "Hold",
    detail: `Within limits, ${streak} of ${STREAK_TO_PROGRESS} clean check-ins in a row. Keep the same session and load until there are ${STREAK_TO_PROGRESS}.`,
  };
}

/** Local calendar day, so a check-in at 7am counts for today in any timezone. */
export function dayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Inserts or replaces the entry for its day and keeps the log newest first. */
export function upsertCheckIn(entries: readonly KneeCheckIn[], entry: KneeCheckIn): KneeCheckIn[] {
  return [entry, ...entries.filter((e) => e.day !== entry.day)].sort((a, b) => (a.day < b.day ? 1 : -1));
}

const KEY = "ct.knee.v1";
const CAP = 90;

type Listener = () => void;
const listeners = new Set<Listener>();
const EMPTY: readonly KneeCheckIn[] = Object.freeze([]);

let snapshot: readonly KneeCheckIn[] | undefined;

function isPain(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0 && v <= 10;
}

function isCheckIn(v: unknown): v is KneeCheckIn {
  const e = v as KneeCheckIn | null;
  return !!e && typeof e.day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.day) && isPain(e.morning) && isPain(e.session);
}

function read(): readonly KneeCheckIn[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return Object.freeze(parsed.filter(isCheckIn));
  } catch {
    return EMPTY;
  }
}

/**
 * Check-ins from a backup, merged into the log. One per day still holds: on a
 * day both have, the entry already on this device wins.
 */
export function mergeCheckIns(current: readonly KneeCheckIn[], incoming: unknown): KneeCheckIn[] {
  const have = new Set(current.map((e) => e.day));
  const added: KneeCheckIn[] = [];
  for (const e of Array.isArray(incoming) ? incoming : []) {
    if (!isCheckIn(e) || have.has(e.day)) continue;
    have.add(e.day);
    added.push(e);
  }
  return [...current, ...added].sort((a, b) => (a.day < b.day ? 1 : -1)).slice(0, CAP);
}

function commit(next: readonly KneeCheckIn[]): void {
  snapshot = Object.freeze(next.slice(0, CAP));
  try {
    window.localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    /* private mode; the change still applies for this session */
  }
  for (const l of listeners) l();
}

export function subscribeKnee(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getKneeLog(): readonly KneeCheckIn[] {
  if (snapshot === undefined) snapshot = read();
  return snapshot;
}

export function getKneeServerSnapshot(): readonly KneeCheckIn[] {
  return EMPTY;
}

export function logCheckIn(entry: KneeCheckIn): void {
  commit(upsertCheckIn(getKneeLog(), entry));
}

export function removeCheckIn(day: string): void {
  commit(getKneeLog().filter((e) => e.day !== day));
}

export function importCheckIns(incoming: unknown): void {
  commit(mergeCheckIns(getKneeLog(), incoming));
}
