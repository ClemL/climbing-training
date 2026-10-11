import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanStreak, dayKey, kneeVerdict, upsertCheckIn, type KneeCheckIn } from "../lib/knee.ts";

/** Newest first, the order the log is stored in. */
const log = (...rows: [string, number, number][]): KneeCheckIn[] =>
  rows.map(([day, morning, session]) => ({ day, morning, session }));

test("no check-ins asks for the first one", () => {
  assert.equal(kneeVerdict([]).kind, "start");
});

test("pain over the ceiling steps back, whichever reading it is", () => {
  assert.equal(kneeVerdict(log(["2026-10-11", 4, 1])).kind, "back");
  assert.equal(kneeVerdict(log(["2026-10-11", 1, 4])).kind, "back");
  // At the ceiling is still acceptable.
  assert.notEqual(kneeVerdict(log(["2026-10-11", 3, 3])).kind, "back");
});

test("a meaningful rise in morning pain holds even under the ceiling", () => {
  const v = kneeVerdict(log(["2026-10-11", 3, 2], ["2026-10-09", 1, 2], ["2026-10-07", 1, 1]));
  assert.equal(v.kind, "hold");
  assert.match(v.title, /up/);
  // A one-point wobble is noise, not a trend.
  assert.equal(kneeVerdict(log(["2026-10-11", 2, 2], ["2026-10-09", 1, 2], ["2026-10-07", 1, 1])).kind, "progress");
});

test("three clean check-ins in a row progress, two do not", () => {
  assert.equal(kneeVerdict(log(["2026-10-11", 1, 2], ["2026-10-09", 1, 3])).kind, "hold");
  assert.equal(kneeVerdict(log(["2026-10-11", 1, 2], ["2026-10-09", 1, 3], ["2026-10-07", 2, 2])).kind, "progress");
});

test("an older bad check-in breaks the streak", () => {
  const entries = log(["2026-10-11", 1, 1], ["2026-10-09", 1, 1], ["2026-10-07", 5, 2], ["2026-10-05", 0, 0]);
  assert.equal(cleanStreak(entries), 2);
  assert.equal(kneeVerdict(entries).kind, "hold");
});

test("a rise inside the streak breaks it at that point", () => {
  // 10-09 jumped from 0 to 2 against 10-07, so it is not clean and only 10-11 counts.
  const entries = log(["2026-10-11", 2, 1], ["2026-10-09", 2, 1], ["2026-10-07", 0, 0]);
  assert.equal(cleanStreak(entries), 1);
});

test("logging the same day replaces it and the log stays newest first", () => {
  let entries = log(["2026-10-09", 2, 2], ["2026-10-07", 1, 1]);
  entries = upsertCheckIn(entries, { day: "2026-10-09", morning: 0, session: 1 });
  assert.deepEqual(
    entries.map((e) => [e.day, e.morning]),
    [
      ["2026-10-09", 0],
      ["2026-10-07", 1],
    ],
  );
  entries = upsertCheckIn(entries, { day: "2026-10-08", morning: 1, session: 1 });
  assert.deepEqual(
    entries.map((e) => e.day),
    ["2026-10-09", "2026-10-08", "2026-10-07"],
  );
});

test("day keys are local calendar days", () => {
  assert.equal(dayKey(new Date(2026, 0, 5, 7, 30)), "2026-01-05");
  assert.equal(dayKey(new Date(2026, 11, 31, 23, 59)), "2026-12-31");
});
