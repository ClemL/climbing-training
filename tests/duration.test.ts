import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDuration } from "../lib/duration.ts";
import { PLANS } from "../lib/plans.ts";

test("timeable prescriptions resolve to their upper bound", () => {
  assert.equal(parseDuration("45s"), 45);
  assert.equal(parseDuration("25-30s"), 30);
  assert.equal(parseDuration("30s per side"), 30);
  assert.equal(parseDuration("20-30s per side"), 30);
  assert.equal(parseDuration("2 min"), 120);
  assert.equal(parseDuration("2-3 min"), 180);
  assert.equal(parseDuration("40s alternating"), 40);
  assert.equal(parseDuration("30s hold"), 30);
  assert.equal(parseDuration("60-90s per side"), 90);
  assert.equal(parseDuration("10 each way"), null);
});

test("rep and set prescriptions get no timer", () => {
  for (const pres of [
    "5 x 7-10s",
    "3 x 10-15s",
    "6 x 10s pulls",
    "3 x 20-40s",
    "8-10 attempts",
    "4 x 5-6",
    "12-15 reps",
    "3 problems",
    "8 per side",
    "3 x 2 min traverse",
    "4 sets of 4 problems",
  ]) {
    assert.equal(parseDuration(pres), null, `"${pres}" should not be timeable`);
  }
});

test("no prescription in any plan parses to an absurd duration", () => {
  for (const plan of PLANS) {
    for (const block of plan.blocks) {
      for (const slot of block.slots) {
        const d = parseDuration(slot.pres);
        if (d === null) continue;
        assert.ok(d >= 5 && d <= 600, `${plan.id}/${slot.ex}: "${slot.pres}" -> ${d}s`);
      }
    }
  }
});
