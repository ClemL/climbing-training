"use client";

import { useSyncExternalStore } from "react";
import { getNav, getNavServerSnapshot, subscribeNav, type NavState } from "./navigation";

export function useNav(): NavState {
  return useSyncExternalStore(subscribeNav, getNav, getNavServerSnapshot);
}
