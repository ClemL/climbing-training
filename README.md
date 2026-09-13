# Training Days

A phone-first training app: pick a session, hit start, work the checklist. Sixteen plans across
free weights, bodyweight, climbing-gym days and warm-ups, with a session clock, superset grouping,
a rest timer, a hangboard interval timer, and form cues on every exercise.

Everything is stored in `localStorage`. No account, no database, no server calls.

## Plans

| Category | Plans | Length |
| --- | --- | --- |
| Free Weights | Push Day, Pull Day, Legs & Core, Dumbbell Express | 40-75 min |
| Bodyweight (floor + one chair) | Push & Core, Pull & Posterior, Legs, Express Circuit | 25-55 min |
| Climbing Gym (wall, hangboard, weights) | Hangboard & Limit Boulders, Power Endurance 4x4s, Repeaters & Volume, Technique & Movement | 60-120 min |
| Warm-Up & Recovery | Express Warm-Up, Full Warm-Up, Pre-Gym Activation, Post-Session Recovery | 10-30 min |

Loads are left to the athlete. Plans prescribe reps, rest and intent only.

## Features

- **Works offline and installs to the home screen.** A service worker precaches the shell and
  every exercise image, so the app runs with no signal — the normal condition in a basement gym.
- **Session clock** with pause/resume, persisted across reloads and browser restarts.
- **Checklist** per exercise per round. Multi-round single-exercise blocks (max hangs, limit
  boulder attempts) collapse into numbered set buttons.
- **Superset and circuit grouping**, marked with a badge and a colored rail so paired work is
  obvious at a glance.
- **Illustrations** on 52 of 98 movements: two frames, start and end position, animated inline.
  No network, no leaving the app.
- **Rest timer** in a fixed bottom bar, with the current block's prescribed rest preselected.
  Audio countdown on the last three seconds.
- **Interval timer** for hangboard protocols (7s on / 3s off x 6) and timed circuits (40/20),
  driven by the block's own spec.
- **Per-exercise timers** on any prescription that is purely a duration — planks, wall sits,
  dead hangs, carries. One tap starts it in the bottom bar.
- **Session customization**: skip a block or change its round count mid-session. Progress
  recalculates against what you are actually doing.
- **Added-weight log** on hangboard blocks only, prefilled with last session's number. Finger
  strength moves in 2-5 lb steps over weeks, which is invisible without a record.
- **Week structure** with four rotations and the spacing rules behind them, plus a recovery
  warning if you open a finger-intensive plan within 48 hours of the last one.
- **Exercise library** with search across 98 movements, usable as a substitution reference.
- **Screen wake lock** while a session runs, so the phone does not sleep between sets.

## Stack

Next.js 16 (App Router), React 19, TypeScript, hand-written CSS. No UI framework, no state
library, no analytics, three runtime dependencies.

Session state is read through `useSyncExternalStore` over `localStorage`, so there is no
after-mount hydration flicker. Both timers expand their schedule into wall-clock deadlines and
derive the current phase from the clock, which means a backgrounded tab or a locked screen —
where browsers throttle timers to roughly once a minute — cannot desynchronize a hangboard set.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run check    # typecheck + lint + tests
```

`npm test` runs 15 data-integrity checks with `node --test` and no test framework: unresolved
exercise keys, duplicate ids, block minutes against the advertised session length, interval
specs matching block rounds, image frames present on disk, and week templates never stacking
two finger-intensive days. Editing `lib/plans.ts` by hand is the likely way this breaks, and a
typo'd exercise key renders nothing at all — which you would discover standing at the hangboard.

## Deploying to Vercel

The repo is a stock Next.js app, so Vercel needs no configuration:

1. Import the repository at [vercel.com/new](https://vercel.com/new).
2. Accept the detected framework preset (Next.js). Build command `next build`, no env vars.
3. Deploy.

Or from the CLI:

```bash
npx vercel        # preview deployment
npx vercel --prod # production
```

## Data model

Plans are data, not components. To add or edit a session, edit `lib/plans.ts`; to add a movement,
add an entry to `lib/exercises.ts` and reference its key from a plan slot. `lib/types.ts` documents
both shapes. A block declaring an `interval` spec automatically renders an interval timer.

## Storage keys

| Key | Contents |
| --- | --- |
| `ct.active.v2` | The in-progress session: plan id, elapsed time, checked slots, skipped blocks, round overrides |
| `ct.history.v2` | Last 60 finished sessions |
| `ct.loads.v1` | Added weight per hangboard block, last 8 entries each |

Clearing site data resets both. History is disposable by design.

## Exercise imagery

Illustrations come from [free-exercise-db](https://github.com/yuhonas/free-exercise-db), released
into the public domain under the Unlicense. Each entry provides a start and an end frame; the app
crossfades them, which reads like a GIF at about 11 KB per frame — 1.1 MB for all 104 frames,
small enough to precache entirely for offline use.

`scripts/exercise-image-map.json` maps exercise keys to dataset ids by hand. Automatic name
matching produces confident nonsense (it pairs "Barbell Row" with "Barbell Curl"), and an image
that teaches the wrong movement is worse than no image, so every pair was checked by eye.

The remaining 46 movements are climbing-specific — hangboard grips, limit bouldering, footwork
drills — and have no honest match in any public-domain dataset. Those keep their text cues plus a
plain web search link. That link deliberately does not point at youtube.com, because Android hands
those URLs to the YouTube app.

To regenerate after changing the mapping:

```bash
npm i -D sharp && node scripts/fetch-exercise-images.mjs
```

`sharp` is only needed to re-run the pipeline, so it stays out of the dependency tree.

## Offline behavior

`public/sw.js` is hand-written rather than generated. The app is one static page plus images, so
a build plugin would add coupling without adding capability — and a plugin that breaks on a Next
upgrade would take offline support down with it.

- **Install** precaches the shell and every image listed in `public/image-manifest.json`.
- **Navigations** are network-first with a cached shell fallback, so deploys are picked up.
- **Everything else** is cache-first, which is always correct for content-hashed build assets.

Bump `VERSION` in `public/sw.js` when the shell changes in a way that must invalidate caches.
