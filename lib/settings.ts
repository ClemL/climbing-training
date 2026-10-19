"use client";

/**
 * User preferences. Same external-store pattern as session state: localStorage
 * is the source of truth, the server snapshot is the defaults.
 */

import { SETTINGS_KEY } from "./display";

export type WeightUnit = "lb" | "kg";

/** Element sizing across the app. */
export type Density = "compact" | "normal" | "comfortable";

/**
 * Overall look. Classic is the original. Chalk is the one-handed phone
 * redesign - bottom navigation, a session collapsed to the block you are on,
 * bigger targets, a light theme - kept side by side so the two can be compared.
 */
export type Style = "classic" | "chalk";

/** Chalk only. "system" follows the phone's light or dark mode. */
export type Theme = "system" | "light" | "dark";

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
  style: Style;
  theme: Theme;
};

export const DEFAULTS: Settings = Object.freeze({
  logHangboardWeight: false,
  unit: "lb",
  sounds: true,
  keepAwake: true,
  animateFigures: true,
  density: "normal",
  style: "classic",
  theme: "system",
});

const KEY = SETTINGS_KEY;

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

/**
 * Settings from a backup, applied only on a device that has none of its own.
 * Element size and sound are per-device choices - a tablet and a phone want
 * different densities - so an import never overrides a device already set up.
 * A fresh install has nothing stored and takes the backup's. Returns whether
 * anything was applied.
 */
export function importSettings(incoming: unknown): boolean {
  if (!incoming || typeof incoming !== "object") return false;
  try {
    if (window.localStorage.getItem(KEY) !== null) return false;
  } catch {
    return false;
  }
  const patch: Record<string, unknown> = {};
  for (const [key, fallback] of Object.entries(DEFAULTS)) {
    const value = (incoming as Record<string, unknown>)[key];
    if (typeof value === typeof fallback) patch[key] = value;
  }
  updateSettings(patch as Partial<Settings>);
  return true;
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
