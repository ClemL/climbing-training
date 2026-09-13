export type Category = "freeweights" | "bodyweight" | "gym" | "prep";

/**
 * What a session taxes, for scheduling. `fingers` is the one that matters:
 * tendon and pulley tissue recovers far slower than muscle, and stacking two
 * finger-intensive days is the most common way climbers injure themselves.
 */
export type Stress = "fingers" | "pull" | "push" | "legs";

export type ExerciseDef = {
  /** Display name. */
  name: string;
  /** Muscles / quality trained. */
  target: string;
  /** Short form cues, 2-4 bullets. */
  cues: string[];
  /** Override for the demo video search query. Defaults to `${name} form`. */
  demo?: string;
};

export type BlockKind = "straight" | "superset" | "circuit" | "interval" | "note";

/** One exercise as it appears inside a block. */
export type Slot = {
  /** Key into EXERCISES. */
  ex: string;
  /** Prescription shown on the row, e.g. "8-10 reps" or "30s". */
  pres: string;
  /** Optional per-plan note (load guidance, substitution, tempo). */
  note?: string;
};

/** Interval timer config, used by hangboard blocks. */
export type IntervalSpec = {
  work: number;
  rest: number;
  reps: number;
  /** Rest between sets, in seconds. */
  setRest: number;
  sets: number;
};

export type Block = {
  id: string;
  /** Short label, e.g. "A" or "Finisher". */
  tag: string;
  title: string;
  kind: BlockKind;
  /** How many times through the listed exercises. */
  rounds: number;
  /** Rest between rounds, human readable. */
  rest?: string;
  /** Estimated minutes for the block. */
  minutes: number;
  /** Coaching note for the whole block. */
  note?: string;
  slots: Slot[];
  interval?: IntervalSpec;
  /** Label for the round checkboxes on single-exercise blocks. Defaults to "Sets". */
  unit?: string;
};

export type Plan = {
  id: string;
  name: string;
  category: Category;
  /** Estimated total minutes, [low, high]. */
  minutes: [number, number];
  tagline: string;
  equipment: string[];
  focus: string[];
  /** Safety / programming notes shown above the checklist. */
  notes?: string[];
  /** Tissues taxed hard enough to constrain what you can do the next day. */
  stress?: Stress[];
  blocks: Block[];
};

export type CategoryMeta = {
  id: Category;
  label: string;
  blurb: string;
  icon: string;
};

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "freeweights",
    label: "Free Weights",
    blurb: "Barbell and dumbbell days. Push, pull, legs, or one full-body express session.",
    icon: "\u{1F3CB}",
  },
  {
    id: "bodyweight",
    label: "Bodyweight",
    blurb: "Floor and one chair. Nothing else. Works in a hotel room or a living room.",
    icon: "\u{1F9CD}",
  },
  {
    id: "gym",
    label: "Climbing Gym",
    blurb: "Wall, hangboard and free weights. Strength, power endurance and skill days.",
    icon: "\u{1F9BE}",
  },
  {
    id: "prep",
    label: "Warm-Up & Recovery",
    blurb: "Short sessions that bookend climbing. No strength work, just getting ready or flushing out.",
    icon: "\u{1F525}",
  },
];
