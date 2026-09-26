/**
 * Progression ladders for the movements that appear most across the plans.
 *
 * Each rung names a concrete criterion for moving on. "Progress when it feels
 * easy" is how people sit on the same rung for a year; a number you can count
 * is what actually moves you up.
 */

export type Rung = {
  /** Exercise key, used for the thumbnail and to open the detail overlay. */
  ex: string;
  /** Overrides the exercise name when the rung is a tempo or range variant. */
  label?: string;
  /** What has to be true before moving to the next rung. */
  criterion: string;
  /** Optional aside: a common failure, or how to scale within the rung. */
  note?: string;
};

export type Progression = {
  id: string;
  name: string;
  pattern: string;
  /** Why the ladder is ordered this way, in a sentence or two. */
  why: string;
  rungs: Rung[];
};

export const PROGRESSIONS: readonly Progression[] = [
  {
    id: "push",
    name: "Push-Up",
    pattern: "Horizontal push",
    why: "Leverage, not reps, is how a push-up gets harder. Raising the hands makes it easier and raising the feet makes it harder, which gives you a continuous dial with no equipment at all.",
    rungs: [
      { ex: "wall-pushup", criterion: "3 x 20 with the body in one line", note: "Step the feet further from the wall before moving on." },
      { ex: "incline-pushup", criterion: "3 x 15 with hands at hip height", note: "Lower the surface a step at a time: counter, table, chair, bench." },
      { ex: "pushup", criterion: "3 x 12 from the floor, chest touching each rep" },
      { ex: "tempo-pushup", label: "Push-Up, 3s lowering", criterion: "3 x 8 with a 3-second lowering and a pause at the bottom" },
      { ex: "decline-pushup", criterion: "3 x 12 with feet on a chair" },
      { ex: "archer-pushup", criterion: "3 x 6 per side with the straight arm genuinely straight" },
      { ex: "one-arm-pushup", criterion: "The end of the ladder. Expect months here, not weeks.", note: "Elevate the hand to scale. Hips must stay square." },
    ],
  },
  {
    id: "dip",
    name: "Dip",
    pattern: "Vertical push",
    why: "The most shoulder-demanding push in the app. Depth is the variable that matters: a shallow dip you control beats a deep one that pinches.",
    rungs: [
      { ex: "chair-dip", criterion: "3 x 15 with legs bent, elbows travelling straight back" },
      { ex: "chair-dip", label: "Chair Dip, legs straight", criterion: "3 x 15 with heels on the floor and legs straight" },
      { ex: "dip-bars", criterion: "3 x 8 to upper arms parallel, no shoulder pinch", note: "Stop at the depth that is comfortable. Depth comes with time." },
      { ex: "dip-bars", label: "Weighted Dip", criterion: "Add weight once 3 x 12 is clean", note: "Belt, vest, or a dumbbell between the feet." },
    ],
  },
  {
    id: "overhead",
    name: "Overhead Press & Handstand",
    pattern: "Vertical push",
    why: "Two routes to the same shoulder: loading a press, or tipping your own bodyweight further overhead. Climbers benefit from both, because pressing overhead is the direct antagonist to everything a pull-up does.",
    rungs: [
      { ex: "band-ohp", criterion: "3 x 15 with ribs down and no back arch" },
      { ex: "ohp", criterion: "3 x 8 with a barbell or dumbbells, strict, no leg drive" },
      { ex: "pike-pushup", criterion: "3 x 10 with the hips high and head touching down" },
      { ex: "pike-pushup", label: "Feet-Elevated Pike Push-Up", criterion: "3 x 8 with feet on a chair" },
      { ex: "wall-handstand", criterion: "3 holds of 45 seconds, chest to wall, pushing tall" },
      { ex: "wall-handstand", label: "Wall Handstand Push-Up", criterion: "The end of the ladder. Warm the wrists thoroughly first." },
    ],
  },
  {
    id: "pull",
    name: "Pull-Up",
    pattern: "Vertical pull",
    why: "The single most climbing-relevant lift, and the one people most often rush. Build the scapular position first: pulling from a dead hang without engaging the shoulder blades is how elbows start hurting.",
    rungs: [
      { ex: "scap-pull", criterion: "3 x 10 with a clear 2-second hold at the top", note: "Do not skip this rung. It teaches the shoulder position every later rung needs." },
      { ex: "band-assisted-pullup", criterion: "3 x 8 with the thinnest band that lets you finish" },
      { ex: "chin-up", criterion: "3 x 5 full range, palms facing you" },
      { ex: "pullup", criterion: "3 x 8 from a dead hang, chin over the bar, controlled lowering" },
      { ex: "weighted-pullup", criterion: "Add weight when 3 x 8 bodyweight is clean", note: "This is where real pulling strength for climbing gets built." },
    ],
  },
  {
    id: "row",
    name: "Row",
    pattern: "Horizontal pull",
    why: "Pull-ups alone leave the mid back underdone, which shows up as rounded shoulders and cranky elbows. Rowing is the balance, and it scales from a band to a barbell without changing the pattern.",
    rungs: [
      { ex: "band-row", criterion: "3 x 15 with the elbows finishing behind the ribs" },
      { ex: "db-row", criterion: "3 x 10 per side with no torso rotation" },
      { ex: "chest-supported-row", criterion: "3 x 12 with the chest on an incline bench", note: "Takes the low back out, so the mid back has to do the work." },
      { ex: "barbell-row", criterion: "3 x 8 at a 45-degree hinge with a flat back" },
    ],
  },
  {
    id: "squat",
    name: "Squat & Single-Leg",
    pattern: "Knee-dominant legs",
    why: "Load the two-legged squat first, then shift to one leg. Single-leg strength is what a high step on the wall and a change of direction on grass both actually require.",
    rungs: [
      { ex: "deep-squat-hold", criterion: "60 seconds at the bottom with heels flat", note: "Range before load. If you cannot hold the bottom, do not add weight to it." },
      { ex: "bodyweight-squat", criterion: "3 x 20 to full depth" },
      { ex: "goblet-squat", criterion: "3 x 12 with a dumbbell at the chest" },
      { ex: "back-squat", criterion: "3 x 5 with a barbell, hips below the knee crease" },
      { ex: "bulgarian-split-squat", criterion: "3 x 10 per side, rear foot elevated, torso controlled" },
      { ex: "pistol-progression", criterion: "3 x 8 per side to a low chair" },
      { ex: "pistol-progression", label: "Full Pistol Squat", criterion: "The end of the ladder. Ankle range is usually the limiter, not strength." },
    ],
  },
  {
    id: "hinge",
    name: "Hinge & Hamstring",
    pattern: "Hip-dominant legs",
    why: "The hinge is the pattern most people get wrong, and the hamstrings are the tissue most likely to tear on a football pitch. Build the pattern light, then load it, then add the eccentric work that the evidence supports.",
    rungs: [
      { ex: "glute-bridge", criterion: "3 x 15 per side with the ribs down" },
      { ex: "single-leg-rdl-balance", criterion: "3 x 8 per side without the hip rolling open" },
      { ex: "rdl", criterion: "3 x 10 with dumbbells or a barbell, flat back throughout" },
      { ex: "deadlift", criterion: "3 x 5 from the floor with a braced, neutral spine" },
      { ex: "nordic-curl", label: "Assisted Nordic Curl", criterion: "3 x 6 lowering to 45 degrees with hands catching you", note: "Push back up with the arms. Only the lowering counts." },
      { ex: "nordic-curl", criterion: "3 x 5 lowering all the way under control", note: "The best-evidenced hamstring injury reducer there is." },
    ],
  },
  {
    id: "core-anti-extension",
    name: "Anti-Extension Core",
    pattern: "Trunk",
    why: "Every rung is the same task: keep the low back flat while the arms and legs move further from the body. Nothing here is a crunch, because resisting extension is what a climber and a footballer both actually do.",
    rungs: [
      { ex: "dead-bug", criterion: "3 x 10 per side with the low back pinned flat" },
      { ex: "plank", criterion: "3 x 60 seconds with glutes and quads engaged" },
      { ex: "hollow-hold", criterion: "3 x 40 seconds, back flat, legs low" },
      { ex: "ab-rollout", criterion: "3 x 10 from the knees without the back arching" },
      { ex: "front-lever-tuck", criterion: "3 holds of 10 seconds with the torso horizontal" },
    ],
  },
  {
    id: "core-hanging",
    name: "Hanging Core & Front Lever",
    pattern: "Trunk under a bar",
    why: "The most climbing-specific core ladder. Grip usually fails before the abs on the early rungs, which is fine: both are being trained.",
    rungs: [
      { ex: "dead-hang", criterion: "3 x 45 seconds with active shoulders" },
      { ex: "hanging-knee-raise", criterion: "3 x 12 with no swing and a dead stop between reps" },
      { ex: "hanging-leg-raise", criterion: "3 x 10 with straight legs to hip height" },
      { ex: "front-lever-tuck", criterion: "3 x 10 second tuck holds" },
      { ex: "front-lever-tuck", label: "One-Leg Front Lever", criterion: "Extend one leg for 5-8 seconds per side", note: "Years, not months. Extend the leg a few degrees at a time." },
    ],
  },
  {
    id: "fingers",
    name: "Finger Strength",
    pattern: "Hangboard",
    why: "The slowest-adapting tissue in the body, and the one most likely to be rushed. Every rung below assumes a full warm-up and roughly a year of consistent climbing before the hangboard is touched at all.",
    rungs: [
      { ex: "progressive-hangs", criterion: "3 x 15 seconds on a jug, part bodyweight, no finger discomfort" },
      { ex: "dead-hang", criterion: "3 x 30 seconds full bodyweight on a 20mm edge" },
      { ex: "repeater-hang", criterion: "4 sets of 7s on / 3s off x 6 at RPE 7-8, half crimp", note: "Submaximal by design. Grip position must not degrade mid-set." },
      { ex: "open-hand-hang", criterion: "The same repeater protocol on an open or 3-finger drag grip" },
      { ex: "max-hang", criterion: "5 x 7-10s at an effort you could hold 2-3 seconds longer", note: "Never to failure. Any sharp or localized finger pain ends the session." },
    ],
  },
  {
    id: "jumping",
    name: "Jumping & Landing",
    pattern: "Plyometrics",
    why: "Landing is trained before jumping, because the landing is where knees and achilles tendons get hurt. Ground contact time is the quality that matters, not height.",
    rungs: [
      { ex: "pogo-hops", criterion: "3 x 30 contacts with stiff ankles and minimal ground time" },
      { ex: "hurdle-hops", criterion: "3 x 8 contacts over a low obstacle, landing and leaving instantly" },
      { ex: "box-jump", criterion: "5 x 5 landing softly in a quarter squat", note: "Step down every rep. Jumping down is where achilles injuries come from." },
      { ex: "broad-jump", criterion: "5 x 4 sticking the landing for a full second" },
      { ex: "lateral-bound", criterion: "3 x 6 per side, sticking each landing with the knee tracking over the foot" },
    ],
  },
  {
    id: "adductor",
    name: "Adductor",
    pattern: "Groin",
    why: "Groin strains are one of the two most common non-contact injuries in soccer, and drop knees and heel hooks load the same tissue in climbing. The Copenhagen plank has trial evidence behind it; work up the lever length rather than the hold time.",
    rungs: [
      { ex: "groin-squeeze", criterion: "5 x 10 second holds with no pain", note: "Also a self-test: if squeezing reproduces groin pain, cut volume that week." },
      { ex: "copenhagen", label: "Short-Lever Copenhagen", criterion: "3 x 20 seconds per side with the bottom knee on the floor" },
      { ex: "copenhagen", criterion: "3 x 30 seconds per side with the top leg on a chair and bottom leg lifted" },
      { ex: "band-hip-adduction", criterion: "3 x 15 per side against a band, controlled both directions" },
    ],
  },
];

export function progressionById(id: string): Progression | undefined {
  return PROGRESSIONS.find((p) => p.id === id);
}
