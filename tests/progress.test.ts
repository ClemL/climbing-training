import { test } from "node:test";
import assert from "node:assert/strict";
import { progressOf, slotKey } from "../lib/progress.ts";
import type { ActiveSession } from "../lib/storage.ts";
import type { Plan, Slot } from "../lib/types.ts";

/**
 * The session view, the resume banner and the history entry all report these
 * numbers. History used to count the plan as written and every key ever
 * checked, so a skipped block left it disagreeing with what was on screen.
 */

const slot = (ex: string): Slot => ({ ex, pres: "8 reps" });

// Warm-up: 3 boxes. Main: 2 exercises x 3 rounds = 6 boxes. 9 as planned.
const PLAN: Plan = {
  id: "t",
  name: "Test",
  category: "freeweights",
  minutes: [10, 20],
  tagline: "A plan for counting",
  equipment: ["none"],
  focus: ["counting"],
  blocks: [
    { id: "w", tag: "W", title: "Warm-up", kind: "circuit", rounds: 1, minutes: 5, slots: [slot("a"), slot("b"), slot("c")] },
    { id: "m", tag: "A", title: "Main", kind: "superset", rounds: 3, minutes: 10, slots: [slot("d"), slot("e")] },
  ],
};

const session = (patch: Partial<ActiveSession> = {}): ActiveSession => ({
  planId: "t",
  startedAt: 0,
  accumulatedMs: 0,
  running: false,
  resumedAt: null,
  done: {},
  ...patch,
});

const done = (...keys: [string, number, number][]): Record<string, true> =>
  Object.fromEntries(keys.map(([block, round, i]) => [slotKey(block, round, i), true as const]));

test("a fresh session counts the plan as prescribed", () => {
  assert.deepEqual(progressOf(PLAN, session()), { checked: 0, total: 9 });
});

test("a skipped block leaves both counts, including boxes checked before skipping it", () => {
  const s = session({ done: done(["w", 1, 0], ["m", 1, 0]), skipped: { w: true } });
  assert.deepEqual(progressOf(PLAN, s), { checked: 1, total: 6 });
});

test("dropping a round drops the boxes checked in it", () => {
  const s = session({ done: done(["m", 1, 0], ["m", 3, 0], ["m", 3, 1]), rounds: { m: 2 } });
  assert.deepEqual(progressOf(PLAN, s), { checked: 1, total: 7 });
});

test("adding a round adds to the total", () => {
  assert.deepEqual(progressOf(PLAN, session({ rounds: { m: 4 } })), { checked: 0, total: 11 });
});
