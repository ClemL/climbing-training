"use client";

/**
 * Backup and restore.
 *
 * Everything lives in this browser's localStorage, which a site-data clear, a
 * new phone or a change of browser wipes. A backup is one JSON file, kept
 * wherever the athlete likes. Importing merges it into what is already here
 * rather than replacing it, so a phone and a tablet can trade files without
 * either losing sessions: entries match by id, day or timestamp, and on a
 * clash the one already on this device wins. Each store owns its own merge,
 * validation and cap; this module only knows the file.
 *
 * The session in progress is left out. Restoring a clock that started days
 * ago helps no one.
 */

import { getFavorites, importFavorites, mergeFavorites } from "./favorites";
import { getKneeLog, importCheckIns, mergeCheckIns } from "./knee";
import { getSettings, importSettings } from "./settings";
import {
  getHistorySnapshot,
  getLoadsSnapshot,
  importHistory,
  importLoads,
  mergeHistory,
  mergeLoads,
  type LoadEntry,
} from "./storage";

const APP = "training-days";
const VERSION = 1;
const NOT_A_BACKUP = "That file is not a Training Days backup.";

export type Backup = {
  app: typeof APP;
  version: number;
  exportedAt: number;
  history: unknown;
  loads: unknown;
  knee: unknown;
  favorites: unknown;
  settings: unknown;
};

/** What an import would add to this device. */
export type ImportCounts = { sessions: number; checkIns: number; loads: number; saved: number };

function createBackup(): Backup {
  return {
    app: APP,
    version: VERSION,
    exportedAt: Date.now(),
    history: getHistorySnapshot(),
    loads: getLoadsSnapshot(),
    knee: getKneeLog(),
    favorites: getFavorites(),
    settings: getSettings(),
  };
}

/** training-days-20261017_1430.json, in local time, so the files sort by when they were made. */
export function backupFileName(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const day = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  return `training-days-${day}_${pad(date.getHours())}${pad(date.getMinutes())}.json`;
}

/** Hands the file to the browser's downloads, which on Android is the Downloads folder. */
export function downloadBackup(): void {
  const blob = new Blob([JSON.stringify(createBackup(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = backupFileName();
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoking in the same task can cancel the download in some browsers.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Reads a file the athlete picked, or says why it is not a backup. */
export function parseBackup(text: string): { ok: true; backup: Backup } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: NOT_A_BACKUP };
  }
  const b = parsed as Partial<Backup> | null;
  if (!b || typeof b !== "object" || b.app !== APP || typeof b.version !== "number" || typeof b.exportedAt !== "number") {
    return { ok: false, error: NOT_A_BACKUP };
  }
  if (b.version > VERSION) {
    return { ok: false, error: "That backup comes from a newer version of the app. Reload to update, then import again." };
  }
  return { ok: true, backup: b as Backup };
}

/** Entries in `merged` that `current` did not have. Not a length difference: a cap can push old ones out. */
function countNew<T>(merged: readonly T[], current: readonly T[], id: (t: T) => string | number): number {
  const have = new Set(current.map(id));
  return merged.filter((t) => !have.has(id(t))).length;
}

const flatLoads = (l: Record<string, LoadEntry[]>) => Object.entries(l).flatMap(([k, es]) => es.map((e) => `${k}@${e.at}`));

/** Runs the same merges the import runs, and changes nothing. */
export function previewImport(b: Backup): ImportCounts {
  const history = getHistorySnapshot();
  const loads = getLoadsSnapshot();
  const knee = getKneeLog();
  const saved = getFavorites();
  return {
    sessions: countNew(mergeHistory(history, b.history), history, (h) => h.id),
    checkIns: countNew(mergeCheckIns(knee, b.knee), knee, (e) => e.day),
    loads: countNew(flatLoads(mergeLoads(loads, b.loads)), flatLoads(loads), (k) => k),
    saved: countNew(mergeFavorites(saved, b.favorites), saved, (k) => k),
  };
}

/** Merges a backup into this device. Returns whether its settings were taken. */
export function applyImport(b: Backup): { settings: boolean } {
  importHistory(b.history);
  importLoads(b.loads);
  importCheckIns(b.knee);
  importFavorites(b.favorites);
  return { settings: importSettings(b.settings) };
}
