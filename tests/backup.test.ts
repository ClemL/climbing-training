import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeFavorites } from "../lib/favorites.ts";
import { mergeCheckIns, type KneeCheckIn } from "../lib/knee.ts";
import { mergeHistory, mergeLoads, type HistoryEntry } from "../lib/storage.ts";

/**
 * Importing a backup merges it into the device rather than replacing it, so a
 * phone and a tablet can trade files. These pin the rules that make that safe:
 * nothing already here is lost, re-importing the same file is a no-op, and a
 * hand-edited or foreign file cannot put malformed entries into a store.
 */

const session = (id: string, finishedAt: number): HistoryEntry => ({
  id,
  planId: "fw-push",
  planName: "Push Day",
  category: "freeweights",
  finishedAt,
  durationMs: 3_600_000,
  checked: 20,
  total: 24,
});

test("history merges by id, newest first, and re-importing changes nothing", () => {
  const here = [session("b", 200), session("a", 100)];
  const file = [session("c", 300), session("a", 100), session("a", 100)];
  const merged = mergeHistory(here, file);
  assert.deepEqual(
    merged.map((h) => h.id),
    ["c", "b", "a"],
  );
  assert.deepEqual(mergeHistory(merged, file), merged);
});

test("history keeps the newest 60 and drops entries that are not sessions", () => {
  const file = Array.from({ length: 70 }, (_, i) => session(`s${i}`, i));
  const merged = mergeHistory([], [...file, { id: "x" }, null, "junk"]);
  assert.equal(merged.length, 60);
  assert.equal(merged[0].id, "s69");
  assert.equal(merged[59].id, "s10");
  assert.deepEqual(mergeHistory([], { not: "an array" }), []);
});

test("hangboard loads merge per block by timestamp, newest first, eight per block", () => {
  const here = { "cg-max:cgm-a": [{ at: 50, value: 10 }] };
  const file = {
    "cg-max:cgm-a": [
      { at: 50, value: 99 },
      ...Array.from({ length: 9 }, (_, i) => ({ at: 100 + i, value: i })),
      { at: 1, value: "heavy" },
    ],
    "cg-repeaters:cgr-a": [{ at: 7, value: -5 }],
  };
  const merged = mergeLoads(here, file);
  assert.equal(merged["cg-max:cgm-a"].length, 8);
  assert.equal(merged["cg-max:cgm-a"][0].at, 108);
  assert.ok(!merged["cg-max:cgm-a"].some((e) => e.value === 99), "the entry already here wins a timestamp clash");
  assert.deepEqual(merged["cg-repeaters:cgr-a"], [{ at: 7, value: -5 }]);
  assert.deepEqual(mergeLoads(here, [1, 2]), here);
});

test("hangboard loads ignore keys that are not plan:block", () => {
  const file = JSON.parse('{"__proto__": [{"at": 1, "value": 5}], "not a key": [{"at": 2, "value": 5}]}');
  const merged = mergeLoads({}, file);
  assert.deepEqual(Object.keys(merged), []);
  assert.equal(Object.getPrototypeOf(merged), Object.prototype);
});

test("knee check-ins merge by day, and the device's own reading wins", () => {
  const here: KneeCheckIn[] = [{ day: "2026-10-12", morning: 2, session: 3 }];
  const file = [
    { day: "2026-10-12", morning: 6, session: 6 },
    { day: "2026-10-11", morning: 1, session: 2 },
    { day: "2026-10-13", morning: 11, session: 0 },
    { day: "yesterday", morning: 1, session: 1 },
  ];
  assert.deepEqual(mergeCheckIns(here, file), [
    { day: "2026-10-12", morning: 2, session: 3 },
    { day: "2026-10-11", morning: 1, session: 2 },
  ]);
});

test("saved exercises keep their order and gain only what is new", () => {
  assert.deepEqual(mergeFavorites(["squat", "bench-press"], ["dead-hang", "squat", 7, "dead-hang"]), [
    "squat",
    "bench-press",
    "dead-hang",
  ]);
});
