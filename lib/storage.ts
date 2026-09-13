"use client";

/** localStorage only. Nothing leaves the device; history is disposable by design. */

export type ActiveSession = {
  planId: string;
  /** Wall-clock start, for display only. */
  startedAt: number;
  /** Milliseconds banked from previous running stretches. */
  accumulatedMs: number;
  running: boolean;
  /** Epoch ms of the current running stretch, null when paused. */
  resumedAt: number | null;
  /** Checked slot keys: `${blockId}:${round}:${slotIndex}`. */
  done: Record<string, true>;
};

export type HistoryEntry = {
  id: string;
  planId: string;
  planName: string;
  category: string;
  finishedAt: number;
  durationMs: number;
  checked: number;
  total: number;
};

const ACTIVE_KEY = "ct.active.v2";
const HISTORY_KEY = "ct.history.v2";
const HISTORY_CAP = 60;

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode or quota; the app still works, just without persistence */
  }
}

function remove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function loadActive(): ActiveSession | null {
  const s = read<ActiveSession>(ACTIVE_KEY);
  if (!s || typeof s.planId !== "string" || typeof s.accumulatedMs !== "number") return null;
  return { ...s, done: s.done ?? {} };
}

export function saveActive(s: ActiveSession): void {
  write(ACTIVE_KEY, s);
}

export function clearActive(): void {
  remove(ACTIVE_KEY);
}

export function elapsedMs(s: ActiveSession, now: number = Date.now()): number {
  return s.accumulatedMs + (s.running && s.resumedAt !== null ? now - s.resumedAt : 0);
}

export function loadHistory(): HistoryEntry[] {
  const h = read<HistoryEntry[]>(HISTORY_KEY);
  return Array.isArray(h) ? h : [];
}

export function pushHistory(entry: HistoryEntry): HistoryEntry[] {
  const next = [entry, ...loadHistory()].slice(0, HISTORY_CAP);
  write(HISTORY_KEY, next);
  return next;
}

export function clearHistory(): void {
  remove(HISTORY_KEY);
}

export function slotKey(blockId: string, round: number, slotIndex: number): string {
  return `${blockId}:${round}:${slotIndex}`;
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
