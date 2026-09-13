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

function loadActive(): ActiveSession | null {
  const s = read<ActiveSession>(ACTIVE_KEY);
  if (!s || typeof s.planId !== "string" || typeof s.accumulatedMs !== "number") return null;
  return { ...s, done: s.done ?? {} };
}

/* ---------------------------------------------------------------------------
 * External store
 *
 * localStorage does not exist during server rendering, so components read it
 * through useSyncExternalStore rather than an after-mount effect. Snapshots are
 * cached to stay referentially stable between calls, which is what the hook
 * requires to avoid an infinite render loop.
 * ------------------------------------------------------------------------ */

type Listener = () => void;
const listeners = new Set<Listener>();
const EMPTY_HISTORY: readonly HistoryEntry[] = Object.freeze([]);

let activeSnapshot: ActiveSession | null | undefined;
let historySnapshot: readonly HistoryEntry[] | undefined;

function emit(): void {
  for (const l of listeners) l();
}

export function subscribe(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getActiveSnapshot(): ActiveSession | null {
  if (activeSnapshot === undefined) activeSnapshot = loadActive();
  return activeSnapshot;
}

/** Nothing is in progress as far as the server knows. */
export function getActiveServerSnapshot(): ActiveSession | null {
  return null;
}

export function getHistorySnapshot(): readonly HistoryEntry[] {
  if (historySnapshot === undefined) historySnapshot = loadHistory();
  return historySnapshot;
}

export function getHistoryServerSnapshot(): readonly HistoryEntry[] {
  return EMPTY_HISTORY;
}

export function saveActive(s: ActiveSession): void {
  activeSnapshot = s;
  write(ACTIVE_KEY, s);
  emit();
}

export function clearActive(): void {
  activeSnapshot = null;
  remove(ACTIVE_KEY);
  emit();
}

export function elapsedMs(s: ActiveSession, now: number = Date.now()): number {
  return s.accumulatedMs + (s.running && s.resumedAt !== null ? now - s.resumedAt : 0);
}

function loadHistory(): HistoryEntry[] {
  const h = read<HistoryEntry[]>(HISTORY_KEY);
  return Array.isArray(h) ? h : [];
}

export function pushHistory(entry: HistoryEntry): void {
  const next = [entry, ...getHistorySnapshot()].slice(0, HISTORY_CAP);
  historySnapshot = next;
  write(HISTORY_KEY, next);
  emit();
}

export function clearHistory(): void {
  historySnapshot = EMPTY_HISTORY;
  remove(HISTORY_KEY);
  emit();
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
