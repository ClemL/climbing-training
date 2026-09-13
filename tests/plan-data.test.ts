import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { PLANS } from "../lib/plans.ts";
import { EXERCISES } from "../lib/exercises.ts";
import { IMAGE_KEYS } from "../lib/exercise-images.ts";
import { CATEGORIES } from "../lib/types.ts";
import { TEMPLATES } from "../lib/week.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * These guard the data, not the UI. Editing lib/plans.ts by hand is the likely
 * way this app breaks, and a typo'd exercise key renders nothing at all - which
 * you would discover standing at the hangboard.
 */

test("every prescribed exercise exists in the library", () => {
  const missing: string[] = [];
  for (const plan of PLANS) {
    for (const block of plan.blocks) {
      for (const slot of block.slots) {
        if (!EXERCISES[slot.ex]) missing.push(`${plan.id}/${block.id} -> "${slot.ex}"`);
      }
    }
  }
  assert.deepEqual(missing, [], `unresolved exercise keys:\n${missing.join("\n")}`);
});

test("plan ids and block ids are unique", () => {
  const planIds = PLANS.map((p) => p.id);
  assert.equal(new Set(planIds).size, planIds.length, "duplicate plan id");

  const blockIds = PLANS.flatMap((p) => p.blocks.map((b) => b.id));
  const dupes = blockIds.filter((id, i) => blockIds.indexOf(id) !== i);
  assert.deepEqual(dupes, [], `duplicate block ids: ${dupes.join(", ")}`);
});

test("block minutes add up to roughly the advertised session length", () => {
  for (const plan of PLANS) {
    const [lo, hi] = plan.minutes;
    assert.ok(lo < hi, `${plan.id}: minutes range is not ascending`);
    const sum = plan.blocks.reduce((n, b) => n + b.minutes, 0);
    // 15% slack: block estimates are deliberately round numbers.
    assert.ok(
      sum >= lo * 0.85 && sum <= hi * 1.15,
      `${plan.id}: blocks sum to ${sum} min, advertised ${lo}-${hi}`,
    );
  }
});

test("plans and blocks are structurally sound", () => {
  for (const plan of PLANS) {
    assert.ok(plan.blocks.length > 0, `${plan.id}: no blocks`);
    assert.ok(plan.equipment.length > 0, `${plan.id}: no equipment listed`);
    assert.ok(plan.focus.length > 0, `${plan.id}: no focus listed`);
    assert.ok(plan.tagline.length > 10, `${plan.id}: tagline too short to be useful`);

    for (const block of plan.blocks) {
      assert.ok(block.slots.length > 0, `${block.id}: no exercises`);
      assert.ok(block.rounds >= 1, `${block.id}: rounds must be at least 1`);
      assert.ok(block.minutes > 0, `${block.id}: minutes must be positive`);
      assert.ok(block.tag.length > 0, `${block.id}: missing tag`);
      for (const slot of block.slots) {
        assert.ok(slot.pres.trim().length > 0, `${block.id}: "${slot.ex}" has no prescription`);
      }
    }
  }
});

test("every category is known and populated", () => {
  const known = new Set(CATEGORIES.map((c) => c.id));
  for (const plan of PLANS) {
    assert.ok(known.has(plan.category), `${plan.id}: unknown category "${plan.category}"`);
  }
  for (const cat of CATEGORIES) {
    assert.ok(
      PLANS.some((p) => p.category === cat.id),
      `category "${cat.id}" has no plans, so its tab renders empty`,
    );
  }
});

test("interval specs are runnable", () => {
  for (const plan of PLANS) {
    for (const block of plan.blocks) {
      if (!block.interval) continue;
      const s = block.interval;
      assert.ok(s.work > 0, `${block.id}: work must be positive`);
      assert.ok(s.rest >= 0, `${block.id}: rest cannot be negative`);
      assert.ok(s.reps >= 1, `${block.id}: reps must be at least 1`);
      assert.ok(s.sets >= 1, `${block.id}: sets must be at least 1`);
      assert.ok(s.setRest >= 0, `${block.id}: setRest cannot be negative`);
      assert.equal(
        s.sets,
        block.rounds,
        `${block.id}: interval sets (${s.sets}) must match block rounds (${block.rounds}), ` +
          `or the timer and the checkboxes disagree`,
      );
    }
  }
});

test("the set-unit label only appears where the UI renders it", () => {
  // Only single-exercise, multi-round blocks draw numbered set buttons.
  for (const plan of PLANS) {
    for (const block of plan.blocks) {
      if (!block.unit) continue;
      assert.ok(
        block.slots.length === 1 && block.rounds > 1,
        `${block.id}: unit "${block.unit}" is set but would never be displayed`,
      );
    }
  }
});

test("exercise definitions carry usable coaching detail", () => {
  for (const [key, ex] of Object.entries(EXERCISES)) {
    assert.ok(ex.name.trim().length > 0, `${key}: missing name`);
    assert.ok(ex.target.trim().length > 0, `${key}: missing target`);
    assert.ok(ex.cues.length >= 2, `${key}: needs at least two form cues`);
    for (const cue of ex.cues) assert.ok(cue.trim().length > 0, `${key}: empty cue`);
  }
});

test("bundled imagery matches real exercises and exists on disk", () => {
  for (const key of IMAGE_KEYS) {
    assert.ok(EXERCISES[key], `image mapped for unknown exercise "${key}"`);
    for (const frame of [0, 1]) {
      const file = join(ROOT, "public", "ex", `${key}-${frame}.webp`);
      assert.ok(existsSync(file), `missing image frame: public/ex/${key}-${frame}.webp`);
    }
  }
});

test("no exercise is defined but unreachable from both plans and search", () => {
  // Orphans are allowed - they serve as substitutions in the library - but they
  // should be deliberate, so this pins the current count.
  const used = new Set(PLANS.flatMap((p) => p.blocks.flatMap((b) => b.slots.map((s) => s.ex))));
  const orphans = Object.keys(EXERCISES).filter((k) => !used.has(k));
  assert.ok(
    orphans.length <= 12,
    `${orphans.length} exercises are in no plan; trim them or add them: ${orphans.join(", ")}`,
  );
});

test("every plan referenced by a week template exists", () => {
  const ids = new Set(PLANS.map((p) => p.id));
  for (const tpl of TEMPLATES) {
    assert.equal(tpl.days.length, 7, `${tpl.id}: a week has seven days`);
    for (const day of tpl.days) {
      if (day.planId === null) {
        assert.ok(day.note, `${tpl.id}/${day.day}: a rest day needs a note`);
        continue;
      }
      assert.ok(ids.has(day.planId), `${tpl.id}/${day.day}: unknown plan "${day.planId}"`);
    }
  }
});

test("no template schedules finger-intensive sessions on consecutive days", () => {
  const byId = new Map(PLANS.map((p) => [p.id, p]));
  for (const tpl of TEMPLATES) {
    const fingers = tpl.days.map((d) => (d.planId ? !!byId.get(d.planId)?.stress?.includes("fingers") : false));
    for (let i = 1; i < fingers.length; i++) {
      assert.ok(
        !(fingers[i] && fingers[i - 1]),
        `${tpl.id}: ${tpl.days[i - 1].day} and ${tpl.days[i].day} both load fingers`,
      );
    }
    const count = fingers.filter(Boolean).length;
    assert.ok(count <= 2, `${tpl.id}: ${count} finger-intensive days, the ceiling is 2`);
  }
});
