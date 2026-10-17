import type { ActiveSession } from "./storage";
import type { Block, Plan } from "./types";

/**
 * What a session actually contains, as opposed to what its plan prescribes.
 *
 * Blocks can be skipped and round counts changed mid-session, so the plan's
 * own numbers overstate the work, and the checked set can still hold boxes
 * that are no longer on the card. The session view, the resume banner and the
 * history entry all count through here, so they cannot disagree.
 */

export function slotKey(blockId: string, round: number, slotIndex: number): string {
  return `${blockId}:${round}:${slotIndex}`;
}

/** Rounds actually being performed, which the athlete can raise or lower. */
export function roundsOf(session: ActiveSession, block: Block): number {
  return session.rounds?.[block.id] ?? block.rounds;
}

export function isSkipped(session: ActiveSession, block: Block): boolean {
  return !!session.skipped?.[block.id];
}

/** Keys for one block at its current round count. */
export function blockKeys(session: ActiveSession, block: Block): string[] {
  const keys: string[] = [];
  for (let r = 1; r <= roundsOf(session, block); r++) {
    for (let i = 0; i < block.slots.length; i++) keys.push(slotKey(block.id, r, i));
  }
  return keys;
}

/** Progress counts only what is still on the card: skipped blocks and dropped rounds do not. */
export function progressOf(plan: Plan, session: ActiveSession): { checked: number; total: number } {
  let checked = 0;
  let total = 0;
  for (const block of plan.blocks) {
    if (isSkipped(session, block)) continue;
    for (const k of blockKeys(session, block)) {
      total += 1;
      if (session.done[k]) checked += 1;
    }
  }
  return { checked, total };
}
