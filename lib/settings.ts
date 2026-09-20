"use client";

/**
 * User preferences. Same external-store pattern as session state: localStorage
 * is the source of truth, the server snapshot is the defaults.
 */

export type WeightUnit = "lb" | "kg";

/** Element sizing across the app. */
export type Density = "compact" | "normal" | "comfortable";

export type Settings = {
  /** Hangboard load logging. Off by default - plenty of people hang bodyweight only. */
  logHangboardWeight: boolean;
  unit: WeightUnit;
  /** Countdown beeps from the rest and interval timers. */
  sounds: boolean;
  /** Hold the screen on while a session runs. */
  keepAwake: boolean;
  /** Cycle exercise illustrations between start and end position. */
  animateFigures: boolean;
  /** Row height, padding, type size and control size scale together. */
  density: Density;
};

export const DEFAULTS: Settings = Object.freeze({
  logHangboardWeight: false,
  unit: "lb",
  sounds: true,
  keepAwake: true,
  animateFigures: true,
  density: "normal",
});

const KEY = "ct.settings.v1";

type Listener = () => void;
const listeners = new Set<Listener>();
let snapshot: Settings | undefined;

function read(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    // Merge over defaults so a setting added later does not read as undefined.
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

export function subscribeSettings(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getSettings(): Settings {
  if (snapshot === undefined) snapshot = read();
  return snapshot;
}

export function getSettingsServerSnapshot(): Settings {
  return DEFAULTS;
}

export function updateSettings(patch: Partial<Settings>): void {
  const next = { ...getSettings(), ...patch };
  snapshot = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode; the change still applies for this session */
  }
  for (const l of listeners) l();
}

export function resetSettings(): void {
  snapshot = DEFAULTS;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  for (const l of listeners) l();
}
