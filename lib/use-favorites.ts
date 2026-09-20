"use client";

import { useSyncExternalStore } from "react";
import { getFavorites, getFavoritesServerSnapshot, subscribeFavorites } from "./favorites";

export function useFavorites(): readonly string[] {
  return useSyncExternalStore(subscribeFavorites, getFavorites, getFavoritesServerSnapshot);
}
