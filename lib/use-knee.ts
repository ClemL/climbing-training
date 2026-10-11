"use client";

import { useSyncExternalStore } from "react";
import { getKneeLog, getKneeServerSnapshot, subscribeKnee, type KneeCheckIn } from "./knee";

export function useKneeLog(): readonly KneeCheckIn[] {
  return useSyncExternalStore(subscribeKnee, getKneeLog, getKneeServerSnapshot);
}
