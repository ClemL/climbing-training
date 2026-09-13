"use client";

import { useSyncExternalStore } from "react";
import { getSettings, getSettingsServerSnapshot, subscribeSettings, type Settings } from "./settings";

export function useSettings(): Settings {
  return useSyncExternalStore(subscribeSettings, getSettings, getSettingsServerSnapshot);
}
