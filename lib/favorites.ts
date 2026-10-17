"use client";

/**
 * Exercises the athlete flagged to come back to. Same external-store shape as
 * the other localStorage-backed state, so components read it with
 * useSyncExternalStore and the server snapshot is the empty case.
 */

const KEY = "ct.favorites.v1";
const CAP = 200;

type Listener = () => void;
const listeners = new Set<Listener>();
const EMPTY: readonly string[] = Object.freeze([]);

let snapshot: readonly string[] | undefined;

function read(): readonly string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return Object.freeze(parsed.filter((k): k is string => typeof k === "string"));
  } catch {
    return EMPTY;
  }
}

function commit(next: readonly string[]): void {
  snapshot = Object.freeze(next.slice(0, CAP));
  try {
    window.localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    /* private mode; the change still applies for this session */
  }
  for (const l of listeners) l();
}

export function subscribeFavorites(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getFavorites(): readonly string[] {
  if (snapshot === undefined) snapshot = read();
  return snapshot;
}

export function getFavoritesServerSnapshot(): readonly string[] {
  return EMPTY;
}

/** Newest first, so the list reads as a queue of things to try. */
export function toggleFavorite(exKey: string): void {
  const current = getFavorites();
  commit(current.includes(exKey) ? current.filter((k) => k !== exKey) : [exKey, ...current]);
}

export function removeFavorite(exKey: string): void {
  commit(getFavorites().filter((k) => k !== exKey));
}

export function clearFavorites(): void {
  commit(EMPTY);
}

/** Saved exercises from a backup. Those already here keep their place; new ones follow. */
export function mergeFavorites(current: readonly string[], incoming: unknown): string[] {
  const have = new Set(current);
  const added: string[] = [];
  for (const k of Array.isArray(incoming) ? incoming : []) {
    if (typeof k !== "string" || have.has(k)) continue;
    have.add(k);
    added.push(k);
  }
  return [...current, ...added].slice(0, CAP);
}

export function importFavorites(incoming: unknown): void {
  commit(mergeFavorites(getFavorites(), incoming));
}
