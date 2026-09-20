import type { ExerciseDef } from "./types";

/**
 * Exercise library. Plans reference these by key so cues live in one place.
 * Keep cues to 2-4 lines: this gets read on a phone, mid-set.
 */
export const EXERCISES: Record<string, ExerciseDef> = {
  /* ---------- General warm-up / mobility ---------- */
  "pulse-raiser": {
    name: "Pulse Raiser",
    target: "Core temperature, heart rate",
    cues: [
      "Bike, row, brisk walk, jump rope or easy traversing.",
      "Easy effort. You should finish able to hold a conversation.",
      "Goal is warm hands and a light sweat, not fatigue.",
    ],
    demo: "jump rope warm up beginner",
  },
  "arm-circles": {
    name: "Arm Circles",
    target: "Shoulder joint, rotator cuff",
    cues: [
      "10 small circles forward, 10 back, then 10 large each way.",
      "Keep ribs down; do not arch the low back to get more range.",
    ],
  },
  "shoulder-pass-through": {
    name: "Shoulder Pass-Through",
    target: "Shoulder flexion, thoracic spine",
    cues: [
      "Broom, towel or belt held wide. Sweep overhead and behind, then back.",
      "Widen the grip until it moves without shrugging or arching.",
    ],
    demo: "shoulder dislocates pass through mobility",
  },
  "scap-pushup": {
    name: "Scapular Push-Up",
    target: "Serratus anterior, scapular control",
    cues: [
      "High plank. Arms stay locked straight.",
      "Push the floor away to spread the shoulder blades, then let them pinch.",
      "Slow. 2 seconds each direction.",
    ],
  },
  "scap-pull": {
    name: "Scapular Pull-Up",
    target: "Lower traps, lats, shoulder position",
    cues: [
      "Hang with straight arms. Elbows stay locked.",
      "Pull shoulder blades down and back so you rise 2-3 inches.",
      "Hold 2 seconds at the top. This is the shoulder position for every pull.",
    ],
  },
  "cat-cow": {
    name: "Cat-Cow",
    target: "Spinal segmentation",
    cues: ["On all fours, alternate rounding and extending the spine.", "Move one vertebra at a time, breathing with the movement."],
  },
  "thoracic-rotation": {
    name: "Thread the Needle",
    target: "Thoracic rotation",
    cues: [
      "On all fours, reach one arm under the body, then open to the ceiling.",
      "Eyes follow the hand. Hips stay square.",
    ],
    demo: "thread the needle thoracic rotation stretch",
  },
  "hip-circles": {
    name: "Hip Circles / Leg Swings",
    target: "Hip capsule, adductors",
    cues: [
      "Standing, 10 forward-back swings then 10 side-to-side per leg.",
      "Start small, build range. Hold something for balance.",
    ],
    demo: "leg swings dynamic warm up hips",
  },
  "deep-squat-hold": {
    name: "Deep Squat Hold",
    target: "Ankles, hips, adductors",
    cues: [
      "Sit into the deepest squat you can hold. Elbows inside knees.",
      "Press knees out with elbows, rock gently side to side.",
      "30-45 seconds.",
    ],
  },
  "worlds-greatest-stretch": {
    name: "World's Greatest Stretch",
    target: "Hip flexors, adductors, thoracic spine",
    cues: [
      "Deep lunge, back hand down, front elbow to instep.",
      "Then rotate the front-side arm to the ceiling.",
      "5 slow reps per side.",
    ],
  },
  "squat-to-stand": {
    name: "Squat to Stand",
    target: "Hamstrings, hips, spine",
    cues: [
      "Hold toes, drop hips into a squat, lift chest.",
      "Straighten legs while keeping hold of the toes, then re-squat.",
    ],
  },
  "high-step-drill": {
    name: "High Step & Hip Opener",
    target: "Hip external rotation, high-step range",
    cues: [
      "Foot on a chair or low hold at hip height, drive the knee out and press hips in.",
      "This is the range you need for high steps and rock-overs.",
      "8 slow reps per side.",
    ],
    demo: "hip mobility drill climbers high step",
  },

  /* ---------- Fingers / forearms ---------- */
  "finger-rolls": {
    name: "Finger Flexion & Extension",
    target: "Finger tendons, synovial fluid",
    cues: [
      "Open the hand wide, then close to a loose fist. 20-30 reps.",
      "Add wrist circles both directions.",
      "First thing you do. Never load fingers before this.",
    ],
    demo: "finger warm up climbers hands",
  },
  "band-finger-ext": {
    name: "Finger Extensions",
    target: "Finger extensors (antagonist)",
    cues: [
      "Rubber band or hair tie around the fingertips; spread the fingers open.",
      "15-25 slow reps. Should feel the back of the forearm.",
      "Cheapest insurance against elbow tendinopathy.",
    ],
    demo: "finger extensor band exercise climbers",
  },
  "wrist-extension": {
    name: "Dumbbell Wrist Extension",
    target: "Wrist extensors, elbow health",
    cues: [
      "Forearm on a thigh or bench, palm down, light dumbbell.",
      "Curl the wrist up, lower for 3 seconds.",
      "Go light. 15-20 reps, it should burn not strain.",
    ],
  },
  "reverse-curl": {
    name: "Reverse Curl",
    target: "Brachioradialis, wrist extensors",
    cues: [
      "Barbell or dumbbells, palms down, elbows pinned to ribs.",
      "Much lighter than a normal curl. Control the lowering.",
      "Directly protective for the outside of the elbow.",
    ],
  },
  "progressive-hangs": {
    name: "Progressive Dead Hangs",
    target: "Finger warm-up, tendon prep",
    cues: [
      "Big jug or open edge. 3 hangs of 10-15s, progressively more bodyweight.",
      "First hang mostly feet-assisted, last hang full bodyweight.",
      "Shoulders engaged and slightly pulled down, not fully passive.",
    ],
    demo: "dead hang warm up climbing fingers",
  },
  "dead-hang": {
    name: "Dead Hang",
    target: "Grip endurance, shoulder position",
    cues: [
      "Jug or 20mm+ edge. Active shoulders, ribs down.",
      "Stop the set while the grip is still solid.",
    ],
  },
  "max-hang": {
    name: "Hangboard Max Hang",
    target: "Maximal finger strength",
    cues: [
      "Half crimp on a 20mm edge. Thumb off. Elbows slightly bent, shoulders engaged.",
      "7-10 seconds at an effort you could hold 2-3s longer. Not to failure.",
      "Add or remove weight to hit that. Full 2-3 min rest between sets.",
      "Stop the session if any single finger feels sharp or hot.",
    ],
    demo: "hangboard max hangs half crimp protocol",
  },
  "repeater-hang": {
    name: "Hangboard Repeaters",
    target: "Finger strength-endurance",
    cues: [
      "7 seconds on, 3 seconds off, 6 reps = one set. 2-3 min between sets.",
      "Pick a load where rep 6 is hard but clean. Roughly RPE 7-8.",
      "Keep the grip position identical every rep. Sloppy reps teach nothing.",
    ],
    demo: "hangboard repeaters 7 3 protocol",
  },
  "open-hand-hang": {
    name: "Open-Hand / 3-Finger Drag Hang",
    target: "Open-hand finger strength",
    cues: [
      "Index, middle, ring on the edge. Fingers nearly straight, no thumb.",
      "Feels weaker than half crimp. Drop the load accordingly.",
      "Trains the grip most slopers and pockets actually use.",
    ],
    demo: "three finger drag hang hangboard",
  },
  "forearm-flush": {
    name: "Forearm Flush & Stretch",
    target: "Forearm recovery",
    cues: [
      "Arm straight, palm up, gently pull the fingers back. 30s per side.",
      "Then palm down and pull the hand down for the extensors.",
      "Finish with 30s of loose shaking, arms overhead then down.",
    ],
    demo: "forearm stretch climbers recovery",
  },

  /* ---------- Barbell / dumbbell push ---------- */
  "bench-press": {
    name: "Barbell Bench Press",
    target: "Chest, front delts, triceps",
    cues: [
      "Shoulder blades pinched and down, feet planted, small arch.",
      "Bar to lower chest, elbows around 45 degrees from the ribs, not flared.",
      "Drive the bar back over the shoulders, not straight up the chest.",
    ],
  },
  "db-bench": {
    name: "Dumbbell Bench Press",
    target: "Chest, front delts, triceps",
    cues: [
      "Wrists stacked over elbows the whole way.",
      "Lower until the elbows are just below the torso. Control it.",
      "Substitute the barbell bench if you have no rack or spotter.",
    ],
  },
  "incline-db-press": {
    name: "Incline Dumbbell Press",
    target: "Upper chest, front delts",
    cues: ["Bench at 30-45 degrees.", "Press slightly back toward the head, not straight up.", "Full stretch at the bottom, no bouncing."],
  },
  "db-floor-press": {
    name: "Dumbbell Floor Press",
    target: "Chest, triceps",
    cues: [
      "Lie on the floor, knees bent. Triceps touch down each rep.",
      "The floor caps the range, which is easier on the shoulder.",
      "Good bench substitute at home.",
    ],
  },
  "ohp": {
    name: "Standing Overhead Press",
    target: "Shoulders, triceps, trunk",
    cues: [
      "Barbell or dumbbells. Squeeze glutes, ribs down, no back arch.",
      "Move the head back as the bar passes the face, then push up and slightly forward.",
      "Finish with biceps by the ears.",
    ],
  },
  "db-push-press": {
    name: "Dumbbell Push Press",
    target: "Shoulders, triceps, hips",
    cues: ["Quarter-dip with the legs, then drive the dumbbells overhead.", "The legs start it, the shoulders finish it.", "Lower under control to the shoulders."],
  },
  "lateral-raise": {
    name: "Dumbbell Lateral Raise",
    target: "Side delts",
    cues: [
      "Slight forward lean, small elbow bend, lead with the elbows.",
      "Stop at shoulder height. No shrugging.",
      "Light weight, 3 second lowering.",
    ],
  },
  "skull-crusher": {
    name: "Skull Crusher",
    target: "Triceps",
    cues: ["Dumbbells or EZ bar. Upper arms stay vertical.", "Lower to the forehead or just behind the head.", "Elbows stay in line, not flaring out."],
  },
  "oh-tricep-ext": {
    name: "Overhead Triceps Extension",
    target: "Triceps (long head)",
    cues: ["One dumbbell, both hands, elbows close to the head.", "Deep stretch at the bottom, that is where the work is.", "Keep the ribs down."],
  },
  "dip-bars": {
    name: "Dip",
    target: "Chest, triceps, front delts",
    cues: [
      "Parallel bars or two solid surfaces. Slight forward lean.",
      "Lower until the upper arm is roughly parallel to the floor. No deeper.",
      "If the shoulder pinches, reduce depth. Add weight when 12 reps are easy.",
    ],
  },
  "pushup": {
    name: "Push-Up",
    target: "Chest, triceps, trunk",
    cues: [
      "Straight line from head to heels, glutes on.",
      "Hands slightly wider than shoulders, elbows back at 45 degrees.",
      "Chest touches first. Full lockout each rep.",
    ],
  },
  "decline-pushup": {
    name: "Feet-Elevated Push-Up",
    target: "Chest, shoulders, trunk",
    cues: [
      "Feet on the chair, hands on the floor.",
      "The higher the feet, the more it becomes a shoulder press.",
      "Keep the body in one line. Do not let the hips sag.",
    ],
  },
  "tempo-pushup": {
    name: "Tempo Push-Up",
    target: "Chest, triceps (time under tension)",
    cues: ["3 seconds down, 1 second pause at the bottom, drive up.", "6-8 reps is plenty.", "Best way to make push-ups hard without equipment."],
  },
  "archer-pushup": {
    name: "Archer Push-Up",
    target: "Chest, triceps, unilateral strength",
    cues: [
      "Wide hands. Bend one arm and lower toward that hand; the other arm straightens.",
      "Alternate sides each rep.",
      "Step toward a one-arm push-up. Scale by bending the straight arm more.",
    ],
  },
  "pike-pushup": {
    name: "Pike Push-Up",
    target: "Shoulders, triceps",
    cues: [
      "Hips high, body in a V, head between the hands.",
      "Lower the crown of the head toward the floor just in front of the hands.",
      "Feet on the chair makes it much harder.",
    ],
  },
  "chair-dip": {
    name: "Chair Dip",
    target: "Triceps, chest, front delts",
    cues: [
      "Hands on the chair edge behind you, legs out front.",
      "Elbows travel straight back, not out. Lower to about 90 degrees.",
      "Straighter legs and heels elevated makes it harder.",
    ],
  },
  "wall-handstand": {
    name: "Wall Handstand / Pike Hold",
    target: "Overhead strength, shoulder stability",
    cues: [
      "Chest-to-wall or feet-on-chair pike. Push tall through the shoulders.",
      "20-40 second holds. Come down before form breaks.",
      "Warm the wrists up first.",
    ],
    demo: "wall handstand hold progression",
  },

  /* ---------- Pull ---------- */
  "pullup": {
    name: "Pull-Up",
    target: "Lats, biceps, grip",
    cues: [
      "Start from a dead hang with shoulders engaged.",
      "Drive elbows down to the ribs. Chin clears the bar, no chin reaching.",
      "Lower all the way. Half reps build half strength.",
    ],
  },
  "weighted-pullup": {
    name: "Weighted Pull-Up",
    target: "Maximal pulling strength",
    cues: [
      "Belt, vest or a dumbbell between the feet.",
      "Pick a load where the last rep of the set is still clean.",
      "Full range, controlled lowering, 2-3 min rest.",
    ],
  },
  "barbell-row": {
    name: "Barbell Row",
    target: "Mid back, lats, rear delts",
    cues: [
      "Hinge to about 45 degrees, neutral spine, braced.",
      "Pull the bar to the lower ribs, elbows past the torso.",
      "No torso heaving to move the weight.",
    ],
  },
  "db-row": {
    name: "Single-Arm Dumbbell Row",
    target: "Lats, mid back",
    cues: [
      "Hand and knee on a bench or chair, flat back.",
      "Pull to the hip, not the shoulder. Pause a beat at the top.",
      "Do not rotate the torso to finish the rep.",
    ],
  },
  "chest-supported-row": {
    name: "Chest-Supported Dumbbell Row",
    target: "Mid back, rear delts",
    cues: ["Chest on an incline bench. Takes the low back out of it.", "Elbows at 45 degrees, squeeze the shoulder blades.", "3 second lowering."],
  },
  "rear-delt-fly": {
    name: "Bent-Over Rear Delt Fly",
    target: "Rear delts, upper back",
    cues: [
      "Hinge forward, light dumbbells, thumbs slightly up.",
      "Sweep the arms out and back, elbows nearly straight.",
      "This one is postural. Go light and feel it between the shoulder blades.",
    ],
  },
  "prone-ytw": {
    name: "Prone Y-T-W Raise",
    target: "Lower traps, rear delts, scapular control",
    cues: [
      "Face down on the floor, forehead resting, arms overhead in a Y.",
      "Lift the arms a few inches, hold 2s. Then T position, then W.",
      "8 reps in each position. No weight needed at first.",
    ],
    demo: "prone Y T W raises shoulder exercise",
  },
  "reverse-snow-angel": {
    name: "Reverse Snow Angel",
    target: "Upper back, rear delts, shoulder mobility",
    cues: [
      "Face down, arms at the sides, palms down and lifted off the floor.",
      "Sweep the arms overhead and back, staying off the ground the whole time.",
      "Slow. 10-15 reps. It will burn far more than it looks.",
    ],
  },
  "superman": {
    name: "Superman Hold",
    target: "Spinal erectors, glutes",
    cues: ["Face down, lift chest and thighs off the floor.", "Reach long rather than lifting high.", "20-40 second holds."],
  },
  "floor-lat-pull": {
    name: "Floor Lat Pull (Slider)",
    target: "Lats, scapular depression",
    cues: [
      "Kneel, hands on socks or towels in front of you, arms overhead.",
      "Pull the hands back toward the hips by driving the elbows down, sliding on the floor.",
      "Fight to keep the ribs down. Slow, 8-12 reps.",
    ],
    demo: "kneeling slider lat pullover bodyweight",
  },
  "towel-row-iso": {
    name: "Towel Row Isometric",
    target: "Lats, mid back, grip",
    cues: [
      "Towel around a solid doorknob or under the foot; pull hard against it.",
      "10 second maximal pulls, 6 reps. Elbows drive to the ribs.",
      "Not a replacement for a bar, but it keeps pulling patterns active.",
    ],
    demo: "isometric towel row no equipment",
  },
  "db-pullover": {
    name: "Dumbbell Pullover",
    target: "Lats, serratus",
    cues: ["Lying on a bench or the floor, one dumbbell overhead in both hands.", "Arms nearly straight, lower behind the head to a stretch, pull back.", "Ribs stay down."],
  },
  "hammer-curl": {
    name: "Hammer Curl",
    target: "Biceps, brachialis, grip",
    cues: ["Palms facing in the whole rep. Elbows pinned.", "No swinging. 3 second lowering.", "Neutral grip is the climber-relevant one."],
  },
  "shoulder-er": {
    name: "Shoulder External Rotation",
    target: "Rotator cuff",
    cues: [
      "Elbow at 90 degrees tucked to the ribs, light dumbbell or band.",
      "Rotate the forearm outward, keeping the elbow glued in place.",
      "Very light. 12-15 reps. This is prehab, not strength work.",
    ],
  },
  "bicep-curl": {
    name: "Dumbbell Curl",
    target: "Biceps",
    cues: ["Elbows stay at the ribs, no swing.", "Supinate fully at the top.", "3 second lowering."],
  },

  /* ---------- Legs / hinge ---------- */
  "back-squat": {
    name: "Barbell Back Squat",
    target: "Quads, glutes, trunk",
    cues: [
      "Bar on the upper back, big breath, brace the trunk.",
      "Sit down and slightly back, knees track over the toes.",
      "Hips below knee crease if your mobility allows. Drive the floor away.",
    ],
  },
  "goblet-squat": {
    name: "Goblet Squat",
    target: "Quads, glutes, trunk",
    cues: ["One dumbbell at the chest, elbows in.", "Sit straight down, elbows inside the knees at the bottom.", "Chest up, heels down."],
  },
  rdl: {
    name: "Romanian Deadlift",
    target: "Hamstrings, glutes, erectors",
    cues: [
      "Soft knees, push the hips back, bar or dumbbells slide down the thighs.",
      "Stop where the hamstrings run out of stretch, usually mid-shin.",
      "Flat back the whole way. Squeeze glutes to stand.",
    ],
  },
  deadlift: {
    name: "Barbell Deadlift",
    target: "Posterior chain, grip, trunk",
    cues: [
      "Bar over midfoot, shins close, shoulders just in front of the bar.",
      "Take the slack out, then push the floor away. Bar drags the legs.",
      "Hips and shoulders rise together. Reset each rep.",
    ],
  },
  "bulgarian-split-squat": {
    name: "Bulgarian Split Squat",
    target: "Quads, glutes, single-leg stability",
    cues: [
      "Rear foot on the chair or bench, front foot about two feet forward.",
      "Drop straight down, front knee tracks over the toes.",
      "Torso slightly forward biases the glute; upright biases the quad.",
    ],
  },
  "reverse-lunge": {
    name: "Reverse Lunge",
    target: "Quads, glutes, balance",
    cues: ["Step back, drop the back knee toward the floor.", "Weight stays mostly on the front leg.", "Easier on the knees than a forward lunge."],
  },
  "high-step-up": {
    name: "High Step-Up",
    target: "Quads, glutes, high-step strength",
    cues: [
      "Chair or box at knee height or above. Full foot on the surface.",
      "Drive through the top leg only. Do not push off the back foot.",
      "This is the gym version of a big rock-over.",
    ],
  },
  "pistol-progression": {
    name: "Chair-Assisted Pistol Squat",
    target: "Single-leg strength, ankle mobility",
    cues: [
      "Sit back to the chair on one leg, tap, stand back up.",
      "Other leg out front, arms forward as a counterweight.",
      "Lower the chair or add a pause to progress.",
    ],
    demo: "pistol squat progression box",
  },
  "step-down": {
    name: "Eccentric Step-Down",
    target: "Quads, knee control",
    cues: ["Stand on the chair or a step on one leg.", "Lower the other heel to the floor over 3 seconds, tap, return.", "Knee stays over the foot, no collapsing inward."],
  },
  "glute-bridge": {
    name: "Single-Leg Glute Bridge",
    target: "Glutes, hamstrings",
    cues: ["One foot planted, other knee hugged in.", "Drive the hips up, squeeze at the top for 1 second.", "Ribs down, no arching the low back to get height."],
  },
  "hip-thrust": {
    name: "Dumbbell Hip Thrust",
    target: "Glutes",
    cues: ["Shoulders on the chair or floor, dumbbell across the hips.", "Chin tucked, drive hips to full extension.", "2 second squeeze at the top."],
  },
  "calf-raise": {
    name: "Single-Leg Calf Raise",
    target: "Calves, ankle stiffness",
    cues: ["On a step edge, full stretch at the bottom, full extension at the top.", "Pause 1s at the top, 3 second lowering.", "15-20 reps per side. Matters for standing on small footholds."],
  },
  "copenhagen": {
    name: "Copenhagen Plank",
    target: "Adductors (inner thigh)",
    cues: [
      "Side plank with the top leg on the chair, bottom leg lifted to meet it.",
      "Start with the bottom knee bent and on the floor to scale.",
      "20-30 seconds per side. Directly protective for drop-knees and heel hooks.",
    ],
    demo: "copenhagen plank adductor exercise",
  },
  "wall-sit": {
    name: "Wall Sit",
    target: "Quad endurance",
    cues: ["Back flat on the wall, thighs parallel to the floor.", "Weight in the heels, breathe normally.", "45-60 seconds."],
  },
  "suitcase-carry": {
    name: "Suitcase Carry",
    target: "Trunk anti-lateral flexion, grip",
    cues: ["One heavy dumbbell at the side. Walk tall.", "Resist leaning away from the weight.", "30-40 seconds per side, or a fixed distance."],
  },

  /* ---------- Core ---------- */
  "hollow-hold": {
    name: "Hollow Body Hold",
    target: "Anterior core, body tension",
    cues: [
      "Low back pressed flat into the floor. That is the whole exercise.",
      "Lift shoulders and legs only as far as the back stays flat.",
      "Bend the knees or tuck the arms in to scale. 20-40 seconds.",
    ],
  },
  "dead-bug": {
    name: "Dead Bug",
    target: "Anterior core, anti-extension",
    cues: [
      "Back flat, arms up, knees at 90. Extend the opposite arm and leg slowly.",
      "If the low back lifts, you went too far.",
      "8-10 reps per side, exhale as you extend.",
    ],
  },
  "hanging-knee-raise": {
    name: "Hanging Knee Raise",
    target: "Hip flexors, lower abs, grip",
    cues: [
      "Hang with active shoulders. Curl the knees to the chest, do not swing.",
      "Lower slowly to a dead stop before the next rep.",
      "Straighten the legs to make it harder.",
    ],
  },
  "front-lever-tuck": {
    name: "Tuck Front Lever Hold",
    target: "Lats, anterior core, body tension",
    cues: [
      "Hang, pull the shoulders back and down, tuck the knees to the chest.",
      "Get the torso horizontal or slightly past it.",
      "5-10 second holds. Extend one leg to progress. The most climbing-specific core drill there is.",
    ],
    demo: "tuck front lever progression",
  },
  plank: {
    name: "Plank",
    target: "Anterior core",
    cues: ["Elbows under shoulders, glutes and quads squeezed.", "Ribs down, straight line head to heels.", "If the low back sags, the set is over."],
  },
  "side-plank": {
    name: "Side Plank",
    target: "Obliques, lateral trunk",
    cues: ["Elbow under shoulder, hips stacked and lifted high.", "Top arm to the ceiling or on the hip.", "30 seconds per side."],
  },
  "shoulder-taps": {
    name: "Plank Shoulder Taps",
    target: "Anti-rotation core, shoulder stability",
    cues: ["High plank, feet wide. Tap the opposite shoulder.", "Hips must not rotate. Slow is the point.", "20 total taps."],
  },
  "bird-dog": {
    name: "Bird Dog",
    target: "Trunk stability, spinal control",
    cues: ["All fours, extend opposite arm and leg long.", "A glass of water on your back should not spill.", "Hold 3 seconds, 8 per side."],
  },
  "ab-rollout": {
    name: "Slider Fallout",
    target: "Anti-extension core, lats",
    cues: [
      "Kneeling, hands on towels or socks. Slide the hands forward, ribs down.",
      "Go only as far as you can keep the low back flat, then pull back.",
      "8-10 reps. Substitute an ab wheel if you have one.",
    ],
    demo: "kneeling ab rollout towel slider",
  },
  "l-sit": {
    name: "Chair L-Sit / Tuck Hold",
    target: "Anterior core, hip flexors, triceps",
    cues: ["Hands on the chair seat or floor, lift the hips and tuck the knees up.", "Push the shoulders down away from the ears.", "10-20 second holds, tucked before straight."],
  },

  /* ---------- Climbing ---------- */
  "easy-climbing": {
    name: "Easy Climbing",
    target: "Movement warm-up, blood flow",
    cues: [
      "3-5 problems, 2-3 grades under your limit.",
      "Big holds, focus on smooth quiet movement and breathing.",
      "No jumping, no hard crimps, no cutting loose yet.",
    ],
  },
  "moderate-climbing": {
    name: "Moderate Climbing Ramp",
    target: "Recruitment, movement quality",
    cues: [
      "2-3 problems roughly one grade below your flash level.",
      "Now you can pull harder and use smaller holds.",
      "This is the bridge between warm-up and working grade.",
    ],
  },
  "limit-boulder": {
    name: "Limit Bouldering",
    target: "Maximal power, recruitment",
    cues: [
      "2-3 problems at or slightly above your limit. 3-8 hard moves each.",
      "Full 3-5 min rest between every attempt. This is a strength session, not a pump session.",
      "Stop when attempts get visibly worse. Quality over volume.",
    ],
    demo: "limit bouldering training session",
  },
  "project-attempts": {
    name: "Project Attempts",
    target: "Power, problem solving",
    cues: [
      "One project. Work individual moves, then link sections.",
      "2-4 min rest between attempts.",
      "Track which move is actually the crux instead of repeating the start.",
    ],
  },
  "four-by-four": {
    name: "4 x 4s",
    target: "Power endurance",
    cues: [
      "Pick 4 problems you can flash comfortably, ideally near each other.",
      "Climb all 4 back to back with only the walk between them. That is one set.",
      "Rest 4-5 min, repeat for 4 sets. By set 3 you should be genuinely pumped.",
    ],
    demo: "4x4 bouldering power endurance training",
  },
  "arc-traverse": {
    name: "ARC Traversing",
    target: "Capillarity, aerobic forearm base",
    cues: [
      "Continuous easy traversing for 10-20 minutes, never stopping.",
      "Target a light forearm pump you can hold indefinitely, roughly 3/10 effort.",
      "If you have to hang or shake out hard, it is too hard.",
    ],
    demo: "ARC training climbing aerobic capacity",
  },
  "volume-climbing": {
    name: "Volume Climbing",
    target: "Mileage, movement patterns",
    cues: [
      "15-25 problems, 2-3 grades below limit, short rests.",
      "Vary wall angle and hold type every few problems.",
      "Objective is repetitions of good movement, not difficulty.",
    ],
  },
  "silent-feet": {
    name: "Silent Feet Drill",
    target: "Footwork precision",
    cues: [
      "Climb easy terrain making zero noise with the feet.",
      "Place, weight, then move. Noise means you dropped onto the foothold.",
      "2-3 easy problems.",
    ],
    demo: "silent feet climbing drill footwork",
  },
  "straight-arm-drill": {
    name: "Straight-Arm Traverse",
    target: "Energy efficiency, hip positioning",
    cues: [
      "Traverse easy terrain keeping both arms as straight as possible.",
      "Forces the legs and hips to do the moving.",
      "Notice how much less you pump out.",
    ],
    demo: "straight arm climbing technique drill",
  },
  "hover-drill": {
    name: "Hover Drill",
    target: "Precision, deliberate movement",
    cues: [
      "Before each hand or foot placement, hover 3 seconds over the hold.",
      "Then place it exactly once, no adjusting.",
      "Punishing on easy terrain, and it exposes sloppy body position.",
    ],
    demo: "hover drill climbing precision",
  },
  downclimbing: {
    name: "Downclimbing",
    target: "Control, footwork, endurance",
    cues: [
      "Climb up, then reverse the problem instead of jumping off.",
      "Doubles time on the wall and forces you to look at your feet.",
      "Use easy problems only.",
    ],
  },
  "one-touch": {
    name: "One-Touch Rule",
    target: "Commitment, precision",
    cues: [
      "Each hold gets exactly one touch. No readjusting, no matching twice.",
      "If you readjust, drop off and restart.",
      "Easy to moderate problems only.",
    ],
    demo: "one touch climbing drill technique",
  },
  "flag-drill": {
    name: "Flagging & Hip Turn Drill",
    target: "Body positioning",
    cues: [
      "On easy vertical terrain, force an inside or outside flag on every move.",
      "Turn the hip into the wall so the pulling arm gets longer reach.",
      "Alternate which hip leads.",
    ],
    demo: "flagging technique climbing drill",
  },
  "campus-recruit": {
    name: "Recruitment Pull (Optional)",
    target: "Neural activation",
    cues: [
      "2-3 hard but submaximal pulls on good holds, or one near-limit boulder attempt.",
      "Purpose is to switch the nervous system on before real effort.",
      "Skip entirely if anything feels tweaky.",
    ],
    demo: "recruitment warm up climbing",
  },
  "cool-down-climb": {
    name: "Easy Cool-Down Climbing",
    target: "Recovery, flush",
    cues: ["2-3 very easy problems or 5 minutes of easy traversing.", "Big holds, relaxed grip.", "Ends the session without a maximal pump."],
  },
  "pigeon-stretch": {
    name: "Pigeon / 90-90 Hip Stretch",
    target: "Hip external rotation, glutes",
    cues: ["Front shin across the body, hips square, sink forward.", "60-90 seconds per side, breathing slowly.", "90-90 seated is a gentler alternative."],
  },
  "hamstring-stretch": {
    name: "Hamstring & Calf Stretch",
    target: "Posterior chain",
    cues: ["Seated or standing hinge, flat back, reach toward the toes.", "Flex the foot to include the calf.", "60 seconds per side."],
  },
  "doorway-chest": {
    name: "Doorway Chest & Lat Stretch",
    target: "Pecs, lats, front shoulder",
    cues: [
      "Forearm on a door frame at shoulder height, rotate the chest away.",
      "Then hands high on the frame and sink the hips back for the lats.",
      "45-60 seconds each.",
    ],
    demo: "doorway pec stretch shoulder",
  },
  "nasal-breathing": {
    name: "Down-Regulation Breathing",
    target: "Parasympathetic recovery",
    cues: [
      "Lying down, legs up the wall if you like. Inhale 4s, exhale 6-8s through the nose.",
      "2-3 minutes.",
      "Sounds soft, measurably shortens the time it takes to feel normal again.",
    ],
    demo: "box breathing recovery after workout",
  },

  /* ---------- Elastic bands ---------- */
  "band-pull-apart": {
    name: "Band Pull-Apart",
    target: "Rear delts, mid back, scapular control",
    cues: [
      "Arms straight out front at chest height, light band, palms down.",
      "Pull the band apart until it touches the chest, squeezing the shoulder blades.",
      "Slow return. If you can snap it apart, the band is too light.",
    ],
  },
  "band-row": {
    name: "Band Row",
    target: "Lats, mid back, biceps",
    cues: [
      "Band anchored at chest height, or looped around both feet while seated.",
      "Elbows drive back past the ribs, not out to the sides.",
      "Squeeze for a beat at the end, then resist the band on the way out.",
    ],
    demo: "resistance band row proper form",
  },
  "band-pulldown": {
    name: "Band Lat Pulldown",
    target: "Lats, scapular depression",
    cues: [
      "Band over a door anchor or bar above you. Kneel or stand tall.",
      "Pull the elbows down to the ribs, chest up, ribs down.",
      "The lats finish the rep, not the arms.",
    ],
    demo: "resistance band lat pulldown form",
  },
  "band-straight-arm-pulldown": {
    name: "Band Straight-Arm Pulldown",
    target: "Lats, shoulder extension",
    cues: [
      "High anchor, arms straight the entire rep.",
      "Sweep the hands from overhead down to the thighs in an arc.",
      "The closest thing to a pull-up pattern you can load with a band.",
    ],
    demo: "band straight arm pulldown lats",
  },
  "band-chest-press": {
    name: "Band Chest Press",
    target: "Chest, front delts, triceps",
    cues: [
      "Band behind the back at armpit height, or anchored behind you.",
      "Press forward and slightly together, elbows at about 45 degrees.",
      "Step further from the anchor to make it harder.",
    ],
    demo: "standing resistance band chest press",
  },
  "band-ohp": {
    name: "Band Overhead Press",
    target: "Shoulders, triceps, trunk",
    cues: [
      "Stand on the middle of the band, handles at the shoulders.",
      "Ribs down, glutes tight, press straight overhead.",
      "Widen the stance on the band to increase tension.",
    ],
  },
  "band-lateral-raise": {
    name: "Band Lateral Raise",
    target: "Side delts",
    cues: [
      "Stand on the band, arms at the sides.",
      "Lead with the elbows, stop at shoulder height.",
      "No shrugging, no swinging.",
    ],
  },
  "band-rear-fly": {
    name: "Band Reverse Fly",
    target: "Rear delts, upper back",
    cues: [
      "Band anchored in front at chest height, arms crossed to start.",
      "Sweep the arms wide and back, thumbs slightly up.",
      "Light tension, high reps. This is postural work.",
    ],
  },
  "band-face-pull": {
    name: "Band Face Pull",
    target: "Rear delts, rotator cuff, upper back",
    cues: [
      "Anchor at forehead height. Pull the band toward the eyebrows.",
      "Elbows stay high and finish behind the shoulders, hands wide.",
      "Rotate the knuckles back at the end. Best single antagonist exercise for a climber.",
    ],
  },
  "band-curl": {
    name: "Band Curl",
    target: "Biceps, brachialis",
    cues: [
      "Stand on the band, elbows pinned to the ribs.",
      "Curl to the shoulders, resist the band down over 3 seconds.",
      "Tension peaks at the top, which the dumbbell version lacks.",
    ],
    demo: "resistance band bicep curl form",
  },
  "band-pushdown": {
    name: "Band Triceps Pushdown",
    target: "Triceps",
    cues: [
      "High anchor, elbows pinned at the ribs.",
      "Extend to a full lockout, then control the return.",
      "Only the forearms move.",
    ],
  },
  "band-pallof": {
    name: "Band Pallof Press",
    target: "Anti-rotation core, obliques",
    cues: [
      "Band anchored at chest height to your side. Stand side-on, feet planted.",
      "Press the hands straight out from the sternum and hold 2 seconds.",
      "The band wants to twist you. Do not let it. That resistance is the exercise.",
    ],
  },
  "band-squat": {
    name: "Band Squat",
    target: "Quads, glutes",
    cues: [
      "Stand on the band, handles at the shoulders.",
      "Sit down and back, knees tracking over the toes.",
      "Band tension peaks at the top, so pause and squeeze there.",
    ],
  },
  "band-rdl": {
    name: "Band Romanian Deadlift",
    target: "Hamstrings, glutes",
    cues: [
      "Stand on the band, handles at the thighs.",
      "Push the hips back, soft knees, flat back.",
      "Stand tall against the band, squeezing the glutes.",
    ],
    demo: "resistance band romanian deadlift",
  },
  "band-good-morning": {
    name: "Band Good Morning",
    target: "Hamstrings, glutes, erectors",
    cues: [
      "Band under the feet and around the back of the neck or shoulders.",
      "Hinge forward with a flat back until you feel the hamstrings.",
      "Light band. This is a hinge pattern drill, not a max lift.",
    ],
  },
  "band-pull-through": {
    name: "Band Pull-Through",
    target: "Glutes, hamstrings",
    cues: [
      "Band anchored low behind you, passed between the legs.",
      "Hinge, then snap the hips forward to standing. Squeeze the glutes hard.",
      "Arms are just hooks. The hips do the work.",
    ],
  },
  "band-monster-walk": {
    name: "Monster Walk",
    target: "Glute medius, hip stability",
    cues: [
      "Loop band above the knees or around the ankles. Quarter squat.",
      "Step wide and forward, keeping constant tension. Knees never collapse in.",
      "10-12 steps each direction. It should burn on the side of the hip.",
    ],
  },
  "band-hip-adduction": {
    name: "Band Hip Adduction",
    target: "Adductors (inner thigh)",
    cues: [
      "Band anchored at ankle height to your side, looped on the inside ankle.",
      "Pull the working leg across the body against the band, then resist back.",
      "Directly relevant to drop knees and heel hooks.",
    ],
  },
  "band-calf-raise": {
    name: "Band Calf Raise",
    target: "Calves",
    cues: [
      "Band under the ball of the foot, held at the hips or shoulders.",
      "Full stretch at the bottom, full extension at the top.",
      "Pause a second at the top, lower for three.",
    ],
  },
  "band-y-raise": {
    name: "Band Y Raise",
    target: "Lower traps, shoulder health",
    cues: [
      "Light band under both feet, arms sweep overhead into a Y.",
      "Thumbs up, arms at about 45 degrees from the midline.",
      "Go light and slow. The lower trap is small and easy to bully past.",
    ],
    demo: "band Y raise lower trap exercise",
  },
  "band-wrist-ext": {
    name: "Band Wrist Extension",
    target: "Wrist extensors, elbow health",
    cues: [
      "Band under the foot, palm down, forearm supported on the thigh.",
      "Curl the wrist up against the band, lower over 3 seconds.",
      "Same job as the dumbbell version and easier to pack.",
    ],
    demo: "band wrist extension forearm elbow",
  },

  /* ---------- Standing only: no floor, no chair, minimal space ---------- */
  "standing-march": {
    name: "High Knee March",
    target: "Circulation, hip flexors",
    cues: [
      "March in place, driving each knee to hip height.",
      "Tall posture, arms swinging naturally.",
      "Slow enough to be discreet in a gate area, brisk enough to feel it.",
    ],
    demo: "high knee march in place warm up",
  },
  "calf-pump": {
    name: "Standing Calf Pump",
    target: "Calf pump, venous return",
    cues: [
      "Both feet flat, rise onto the balls of the feet, lower under control.",
      "20-30 continuous reps.",
      "The calf pushes blood back up the leg. This is the most useful single thing to do after hours of sitting.",
    ],
  },
  "ankle-circles": {
    name: "Ankle Circles",
    target: "Ankle mobility, circulation",
    cues: [
      "One foot off the floor, draw slow circles with the toes.",
      "10 each direction, each foot.",
      "Hold a rail or wall if balance is awkward.",
    ],
  },
  "heel-toe-rocks": {
    name: "Heel-to-Toe Rocks",
    target: "Ankles, feet, balance",
    cues: [
      "Rock back onto the heels, then forward onto the toes.",
      "Slow, 15 reps, staying tall.",
      "Wakes up feet that have been in shoes for eight hours.",
    ],
    demo: "heel toe rocking ankle mobility standing",
  },
  "single-leg-balance": {
    name: "Single-Leg Balance",
    target: "Ankle and hip stability",
    cues: [
      "Stand on one leg, other foot off the floor, hands off the wall.",
      "30-45 seconds per side. Close your eyes to make it genuinely hard.",
      "Occupies one square foot and trains what standing on a small foothold requires.",
    ],
  },
  "shoulder-rolls": {
    name: "Shoulder Rolls",
    target: "Upper traps, shoulder girdle",
    cues: [
      "Big slow circles, shoulders up, back, and down.",
      "10 each direction.",
      "Exhale as the shoulders drop; that is where the tension leaves.",
    ],
  },
  "chin-tuck": {
    name: "Chin Tuck",
    target: "Deep neck flexors, posture",
    cues: [
      "Stand tall, draw the chin straight back to make a double chin. Do not tip the head down.",
      "Hold 3 seconds, 10 reps.",
      "The direct antidote to a head craned over a phone or a seatback screen.",
    ],
    demo: "chin tuck neck exercise posture",
  },
  "standing-twist": {
    name: "Standing Thoracic Twist",
    target: "Thoracic rotation",
    cues: [
      "Feet planted hip width, hands at the chest or crossed on the shoulders.",
      "Rotate from the ribcage, keeping hips facing forward. Hold the end range 2 seconds.",
      "8 per side. Rotation, not momentum.",
    ],
    demo: "standing thoracic rotation stretch",
  },
  "overhead-side-reach": {
    name: "Overhead Reach & Side Bend",
    target: "Lats, obliques, side body",
    cues: [
      "Reach both arms overhead, then lean to one side, ribs stacked.",
      "Reach long through the top arm rather than crunching down.",
      "Hold 20-30 seconds per side.",
    ],
    demo: "standing side bend overhead reach stretch",
  },
  "standing-hip-flexor": {
    name: "Standing Hip Flexor Stretch",
    target: "Hip flexors, quads",
    cues: [
      "Split stance, back leg straight behind you. Tuck the pelvis under and squeeze that glute.",
      "The stretch is in the front of the back hip. Do not arch the low back to chase it.",
      "45-60 seconds per side. This is what eight hours in a seat shortens most.",
    ],
  },
  "standing-quad-stretch": {
    name: "Standing Quad Stretch",
    target: "Quads",
    cues: [
      "Hold the ankle behind you, knees together, pelvis tucked.",
      "Hold a wall or rail for balance rather than wobbling.",
      "30-45 seconds per side.",
    ],
  },
  "standing-figure-four": {
    name: "Standing Figure Four",
    target: "Glutes, hip external rotation",
    cues: [
      "Ankle across the opposite thigh, sit back into a shallow single-leg squat.",
      "Chest up, sink until the glute of the crossed leg stretches.",
      "45-60 seconds per side. The standing version of pigeon, with no floor needed.",
    ],
    demo: "standing figure four glute stretch",
  },
  "standing-forward-fold": {
    name: "Standing Forward Fold",
    target: "Hamstrings, low back",
    cues: [
      "Feet hip width, soft knees, hinge and let the head hang heavy.",
      "Bend the knees as much as needed; the point is to decompress the back, not touch the floor.",
      "45-60 seconds, breathing slowly.",
    ],
  },
  "standing-calf-stretch": {
    name: "Standing Calf Stretch",
    target: "Calves, achilles",
    cues: [
      "Hands on a wall or pillar, back leg straight, heel driven down.",
      "Then bend the back knee slightly to shift it into the lower calf.",
      "30 seconds in each position, each side.",
    ],
  },
  "standing-scap-squeeze": {
    name: "Standing Scapular Squeeze",
    target: "Mid back, rear delts",
    cues: [
      "Arms bent at 90 degrees, elbows at the ribs, palms forward.",
      "Squeeze the shoulder blades together and hold 3 seconds.",
      "12 reps. No equipment, no space, and it undoes a plane seat.",
    ],
    demo: "standing scapular retraction posture exercise",
  },
  "self-resisted-er": {
    name: "Self-Resisted External Rotation",
    target: "Rotator cuff",
    cues: [
      "Elbow tucked at the ribs, bent 90 degrees. Press the back of that hand into the other palm.",
      "Push outward against your own resistance for 10 seconds, about half effort.",
      "6 holds per side. Isometric, so it needs no band and no room.",
    ],
    demo: "isometric external rotation shoulder no equipment",
  },
  "self-resisted-finger-ext": {
    name: "Self-Resisted Finger Extension",
    target: "Finger extensors (antagonist)",
    cues: [
      "Bunch the fingertips together and open them against the other hand cupped over them.",
      "20-25 slow reps per hand.",
      "A hair tie or rubber band works better, but this needs nothing at all.",
    ],
    demo: "finger extensor exercise no equipment climbers",
  },
  "standing-wrist-stretch": {
    name: "Standing Wrist Stretch",
    target: "Forearm flexors and extensors",
    cues: [
      "Arm straight out, palm up, gently pull the fingers back with the other hand.",
      "Then flip the palm down and pull the hand toward you for the extensors.",
      "30 seconds each position, each arm.",
    ],
    demo: "standing wrist flexor extensor stretch",
  },
  "wall-pushup": {
    name: "Wall Push-Up",
    target: "Chest, triceps, serratus",
    cues: [
      "Hands on a wall or pillar at chest height, feet a stride back.",
      "Lower the chest to the wall, elbows at 45 degrees, body in one line.",
      "Step the feet further back to make it harder. 15-20 reps.",
    ],
  },
  "standing-breathing": {
    name: "Standing Down-Regulation Breathing",
    target: "Parasympathetic recovery",
    cues: [
      "Stand tall, one hand on the ribs. Inhale through the nose for 4, exhale for 6-8.",
      "Feel the ribs widen sideways rather than the shoulders lifting.",
      "2 minutes. Useful before a flight as well as after one.",
    ],
    demo: "diaphragmatic breathing standing",
  },

  /* ---------- Soccer: speed, agility, plyometrics ---------- */
  "accelerations": {
    name: "Sprint Accelerations",
    target: "Acceleration, top-end speed",
    cues: [
      "20-30 m efforts from a standing or rolling start, at full effort.",
      "Walk back for a full 60-90 seconds between reps. This is speed work, not conditioning.",
      "Stop the set the moment reps get slower. Sprinting tired trains slow.",
    ],
    demo: "sprint acceleration technique drill soccer",
  },
  "deceleration-drill": {
    name: "Deceleration Drill",
    target: "Eccentric braking, knee and hamstring control",
    cues: [
      "Sprint 10-15 m, then stop dead in three steps and hold a balanced athletic position.",
      "Chest up, hips back, knees soft and tracking over the feet.",
      "Most non-contact knee and hamstring injuries happen while braking or cutting, not while accelerating. Train the brakes.",
    ],
    demo: "deceleration drill soccer stopping mechanics",
  },
  "pro-agility": {
    name: "5-10-5 Shuttle",
    target: "Change of direction",
    cues: [
      "Three cones five yards apart. Start at the middle, sprint 5 to one side, 10 across, 5 back.",
      "Plant on the outside foot, drop the hips, and drive out low.",
      "6 reps with 45-60 seconds between. Alternate which way you open first.",
    ],
    demo: "5-10-5 pro agility shuttle drill",
  },
  "lateral-shuffle": {
    name: "Lateral Shuffle",
    target: "Lateral movement, hip abductors",
    cues: [
      "Athletic stance, hips low, shuffle sideways without the feet clicking together.",
      "Chest square and level. The head should not bob up and down.",
      "10-15 m each direction.",
    ],
    demo: "defensive lateral shuffle drill footwork",
  },
  "backpedal": {
    name: "Backpedal",
    target: "Reverse running mechanics",
    cues: [
      "Hips low, weight on the balls of the feet, short quick steps.",
      "Do not reach backwards with the foot; push the ground behind you.",
      "Finish each rep by transitioning into a forward sprint.",
    ],
    demo: "backpedal drill technique soccer",
  },
  "carioca": {
    name: "Carioca",
    target: "Hip mobility, coordination",
    cues: [
      "Travel sideways, alternately crossing the trail leg in front of and behind the lead leg.",
      "Rotate through the hips, keeping the shoulders relatively square.",
      "15-20 m each direction. Standard in every warm-up for a reason.",
    ],
  },
  "a-skip": {
    name: "A-Skip",
    target: "Sprint mechanics, elastic ankles",
    cues: [
      "Skip driving the knee to hip height, opposite arm forward, foot dorsiflexed.",
      "Strike the ground under the hip, not out in front.",
      "2 x 20 m. Rhythm matters more than height.",
    ],
    demo: "A skip sprint drill technique",
  },
  "pogo-hops": {
    name: "Pogo Hops",
    target: "Ankle stiffness, elastic return",
    cues: [
      "Small fast hops on the balls of both feet, knees nearly straight.",
      "Minimum ground contact time. Think of the ankles as springs, not shock absorbers.",
      "20-30 contacts. This is where most sprint speed is stored.",
    ],
    demo: "pogo hops ankle stiffness plyometric",
  },
  "lateral-bound": {
    name: "Lateral Bound",
    target: "Lateral power, hip and knee stability",
    cues: [
      "Push off one leg sideways, land on the other, and stick the landing for a full second.",
      "Land with the knee tracking over the foot. If it dives inward, shorten the bound.",
      "The sticking is the exercise. Anyone can jump sideways.",
    ],
  },
  "box-jump": {
    name: "Box Jump",
    target: "Concentric leg power",
    cues: [
      "Swing the arms, jump onto the box, land softly in a quarter squat.",
      "Step down, never jump down. That is where achilles injuries come from.",
      "5 reps, full rest. Quality over height.",
    ],
  },
  "broad-jump": {
    name: "Standing Broad Jump",
    target: "Horizontal power",
    cues: [
      "Both feet, swing the arms, jump forward as far as you can.",
      "Land with soft knees and hold the landing for a second.",
      "4-5 reps with full recovery. Horizontal power transfers to sprinting better than vertical.",
    ],
    demo: "standing broad jump technique",
  },
  "hurdle-hops": {
    name: "Hurdle Hops",
    target: "Reactive strength",
    cues: [
      "Low hurdles, cones or a line. Hop over with both feet, minimum ground contact.",
      "Land and leave. Any pause on the ground turns it into a strength exercise.",
      "6-8 contacts per set.",
    ],
  },
  "lateral-cone-hops": {
    name: "Lateral Cone Hops",
    target: "Frontal plane reactive strength",
    cues: [
      "Hop side to side over a low cone or line, both feet together.",
      "Fast and rhythmic, staying on the balls of the feet.",
      "15-20 contacts.",
    ],
  },
  "groiners": {
    name: "Groiners",
    target: "Hips, adductors, dynamic warm-up",
    cues: [
      "From a push-up position, hop both feet up outside the hands, then back.",
      "Sink the hips low on each rep.",
      "10 reps. The most efficient dynamic hip opener there is.",
    ],
  },

  /* ---------- Soccer: prevention and strength ---------- */
  "nordic-curl": {
    name: "Nordic Hamstring Curl",
    target: "Hamstrings (eccentric)",
    cues: [
      "Kneel with the ankles anchored under a couch, a loaded bar, or a partner's hands.",
      "Lower the torso forward as slowly as you can, staying rigid from knee to shoulder. Catch yourself with the hands.",
      "3-6 reps is a full set. If you drop after 30 degrees, that is fine; the top range is the hard part.",
      "Meta-analyses of football squads put the reduction in hamstring injury rates at roughly half. Almost nothing else in this app has that evidence base.",
    ],
    demo: "nordic hamstring curl technique",
  },
  "groin-squeeze": {
    name: "Isometric Groin Squeeze",
    target: "Adductors",
    cues: [
      "Ball, rolled towel or fist between the knees. Squeeze hard for 10 seconds.",
      "5-6 holds. Should be a firm, controlled effort rather than a maximal strain.",
      "Also works as a self-test: if squeezing reproduces groin pain, back off the volume that week.",
    ],
    demo: "isometric adductor squeeze test groin",
  },
  "single-leg-rdl-balance": {
    name: "Single-Leg RDL with Reach",
    target: "Hamstrings, balance, hip control",
    cues: [
      "Stand on one leg, hinge forward reaching for the floor, back leg extending behind.",
      "Hips stay level. Do not let the free hip open to the ceiling.",
      "8 slow reps per side. Balance and hamstring length in one movement.",
    ],
    demo: "single leg romanian deadlift bodyweight balance",
  },
  "russian-twist": {
    name: "Russian Twist",
    target: "Obliques, rotational core",
    cues: [
      "Seated, heels light or lifted, rotate the torso side to side.",
      "Rotate from the ribcage, not by swinging the arms.",
      "20 total touches. Slow beats fast here.",
    ],
  },
  "wood-chop": {
    name: "Wood Chop",
    target: "Rotational power, obliques",
    cues: [
      "Band or cable anchored high. Pull diagonally across the body from high to low.",
      "Pivot the back foot and rotate through the hips, arms nearly straight.",
      "12 per side. The pattern every shot and long pass runs on.",
    ],
  },

  /* ---------- Soccer: ball work ---------- */
  "juggling": {
    name: "Juggling",
    target: "First touch, coordination",
    cues: [
      "Feet, thighs, head. Keep the ball below chest height and the ankle locked.",
      "Count your record, then try to beat it on the weak foot only.",
      "5 minutes. The cheapest touch work that exists.",
    ],
    demo: "soccer juggling technique practice",
  },
  "sole-rolls": {
    name: "Sole Rolls & Toe Taps",
    target: "Close control, foot speed",
    cues: [
      "Roll the ball side to side with the sole, then tap the top alternating feet.",
      "30 seconds each, staying on the balls of the feet, eyes up.",
      "Speed comes from small touches, not big ones.",
    ],
    demo: "soccer sole rolls toe taps ball mastery",
  },
  "cone-dribble": {
    name: "Cone Dribbling",
    target: "Close control under change of direction",
    cues: [
      "5-6 cones or any markers a metre apart. Weave through using both feet.",
      "Touch with the inside and outside of each foot; no touch bigger than a stride.",
      "Two passes slow and clean, then two at speed.",
    ],
    demo: "cone dribbling drill soccer close control",
  },
  "wall-pass": {
    name: "Wall Passing",
    target: "Passing weight and accuracy",
    cues: [
      "Pass firmly against a wall, control the return, pass again.",
      "Sets of two-touch, then one-touch. Lock the ankle and follow through at the target.",
      "Alternate feet every 10 passes. A wall is the most patient teammate you will find.",
    ],
    demo: "wall passing drill soccer solo training",
  },
  "first-touch-wall": {
    name: "First Touch off the Wall",
    target: "Receiving, directional touch",
    cues: [
      "Throw or pass the ball into the wall and take the return with one touch into space.",
      "Take it away from where an imaginary defender is, not straight down.",
      "Inside, outside, sole and thigh. Both feet.",
    ],
    demo: "first touch drill wall soccer control",
  },
  "weak-foot-drill": {
    name: "Weak Foot Block",
    target: "Weak foot competence",
    cues: [
      "Ten minutes where the strong foot is not allowed to touch the ball.",
      "Passing, control, dribbling, striking, all on the weak side.",
      "Uncomfortable by design. It is also the fastest improvement available to most amateur players.",
    ],
    demo: "weak foot training drills soccer",
  },
};

/**
 * Web search for exercises with no bundled imagery. Deliberately not a
 * youtube.com URL: on Android that gets handed to the YouTube app, and the
 * point of the bundled images is to stay inside this app.
 */
export function searchUrl(key: string): string {
  const ex = EXERCISES[key];
  const q = ex?.demo ?? `${ex?.name ?? key} proper form`;
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}
