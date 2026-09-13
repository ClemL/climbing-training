import type { HistoryEntry } from "./storage";
import { RECOVERY_HOURS } from "./week";
import type { Plan, Stress } from "./types";
import { planById } from "./plans";

export type RecoveryWarning = {
  stress: Stress;
  hoursAgo: number;
  needHours: number;
  lastPlanName: string;
};

/**
 * Flags a plan that taxes tissue which has not recovered from a recent session.
 * Advisory only - it never blocks starting a session.
 */
export function recoveryWarnings(
  plan: Plan,
  history: readonly HistoryEntry[],
  now: number = Date.now(),
): RecoveryWarning[] {
  if (!plan.stress?.length) return [];

  const out: RecoveryWarning[] = [];
  for (const stress of plan.stress) {
    const needHours = RECOVERY_HOURS[stress];
    // Most recent finished session that taxed the same tissue.
    const last = history.find((h) => planById(h.planId)?.stress?.includes(stress));
    if (!last) continue;

    const hoursAgo = (now - last.finishedAt) / 3_600_000;
    if (hoursAgo >= needHours) continue;

    out.push({
      stress,
      hoursAgo: Math.max(0, Math.round(hoursAgo)),
      needHours,
      lastPlanName: last.planName,
    });
  }
  // Fingers first: it is the warning that matters.
  return out.sort((a, b) => (a.stress === "fingers" ? -1 : b.stress === "fingers" ? 1 : 0));
}
