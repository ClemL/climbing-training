import type { Stress } from "./types";

/**
 * Weekly rotations.
 *
 * The plans each carry their own scheduling notes, but scattered across 16
 * sessions those notes do not get followed. This collects them into templates
 * that already respect the constraints, and into rules stated once.
 */

export type Day = {
  day: string;
  /** Plan id, or null for a rest day. */
  planId: string | null;
  /** Shown instead of a plan name on rest days. */
  note?: string;
};

export type Template = {
  id: string;
  name: string;
  forWho: string;
  days: Day[];
};

export const TEMPLATES: Template[] = [
  {
    id: "two-and-two",
    name: "Two climbing days, two lifts",
    forWho: "The default for a working week. Climb hard twice, lift twice, nothing stacked.",
    days: [
      { day: "Mon", planId: "fw-pull" },
      { day: "Tue", planId: null, note: "Rest or cardio" },
      { day: "Wed", planId: "cg-max" },
      { day: "Thu", planId: null, note: "Rest. Fingers are still recovering." },
      { day: "Fri", planId: "fw-push" },
      { day: "Sat", planId: "cg-power-endurance" },
      { day: "Sun", planId: "cool-recovery" },
    ],
  },
  {
    id: "climbing-focus",
    name: "Three climbing days, minimal lifting",
    forWho: "Peaking on the wall. Strength work drops to one maintenance session.",
    days: [
      { day: "Mon", planId: "cg-max" },
      { day: "Tue", planId: null, note: "Rest" },
      { day: "Wed", planId: "cg-technique" },
      { day: "Thu", planId: "fw-express" },
      { day: "Fri", planId: "cg-repeaters" },
      { day: "Sat", planId: null, note: "Rest, or climb outside" },
      { day: "Sun", planId: "cool-recovery" },
    ],
  },
  {
    id: "off-season",
    name: "Off-season strength",
    forWho: "Winter, an injury layoff from the wall, or a deliberate strength block. No finger loading at all.",
    days: [
      { day: "Mon", planId: "fw-push" },
      { day: "Tue", planId: "bw-legs" },
      { day: "Wed", planId: null, note: "Rest" },
      { day: "Thu", planId: "fw-pull" },
      { day: "Fri", planId: null, note: "Rest or cardio" },
      { day: "Sat", planId: "fw-legs" },
      { day: "Sun", planId: null, note: "Rest" },
    ],
  },
  {
    id: "travel",
    name: "Travel week",
    forWho: "Hotel room, no equipment. Maintenance, not progress.",
    days: [
      { day: "Mon", planId: "bw-push" },
      { day: "Tue", planId: "bw-legs" },
      { day: "Wed", planId: null, note: "Rest or walk" },
      { day: "Thu", planId: "bw-pull" },
      { day: "Fri", planId: "bw-express" },
      { day: "Sat", planId: null, note: "Rest" },
      { day: "Sun", planId: "bw-express" },
    ],
  },
];

export const RULES: { rule: string; why: string }[] = [
  {
    rule: "At most two finger-intensive sessions a week, never on consecutive days.",
    why: "Tendon and pulley tissue adapts on a scale of months, muscle on a scale of days. The fingers are always the limiting tissue, and they give no warning before they fail.",
  },
  {
    rule: "Leave 48 hours between hangboard sessions, and do not put a heavy pull day next to one.",
    why: "Weighted pull-ups and rows load the same elbow and finger structures from a different angle. Adjacent days compound what neither day would cause alone.",
  },
  {
    rule: "Max strength before power endurance, within the week and within the session.",
    why: "Limit bouldering and max hangs need a fresh nervous system. 4x4s only need you to be able to suffer, which works fine on tired arms.",
  },
  {
    rule: "Warm up for the session you are about to do, not the one you did last week.",
    why: "The full warm-up exists for max-effort days. Twelve minutes is the floor before anything hard, and cold fingers on a small edge is the single most common way to strain an A2 pulley.",
  },
  {
    rule: "Deload every fourth week: cut volume by about 40 percent, keep the intensity.",
    why: "Strength gains land during recovery, not during the work. Four hard weeks in a row produces a plateau and a tweaky elbow; three plus a light one produces progress.",
  },
  {
    rule: "Technique days are training, even though they do not feel like it.",
    why: "Movement efficiency raises your ceiling between strength blocks, and it is the only session here that costs nothing in recovery.",
  },
];

/** Hours that should pass between two sessions taxing the same tissue. */
export const RECOVERY_HOURS: Record<Stress, number> = {
  fingers: 48,
  pull: 24,
  push: 24,
  legs: 24,
};
