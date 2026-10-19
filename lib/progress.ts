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

/** The block the athlete is on: the first one still on the card with anything unchecked. */
export function currentBlock(plan: Plan, session: ActiveSession): Block | undefined {
  return plan.blocks.find((b) => !isSkipped(session, b) && blockKeys(session, b).some((k) => !session.done[k]));
}

export type NextItem = { block: Block; round: number; slotIndex: number; rounds: number };

/** The first unchecked item in the current block, in the order the card lists it: round by round. */
export function nextItem(plan: Plan, session: ActiveSession): NextItem | undefined {
  const block = currentBlock(plan, session);
  if (!block) return undefined;
  const rounds = roundsOf(session, block);
  for (let round = 1; round <= rounds; round++) {
    for (let slotIndex = 0; slotIndex < block.slots.length; slotIndex++) {
      if (!session.done[slotKey(block.id, round, slotIndex)]) return { block, round, slotIndex, rounds };
    }
  }
  return undefined;
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
