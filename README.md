# Training Days

A phone-first training app: pick a session, hit start, work the checklist. Twenty-eight plans
across free weights, elastic bands, bodyweight, climbing-gym days, soccer, standing-only travel
sessions and warm-ups, with a session clock, superset grouping, a rest timer, a hangboard interval timer,
and form cues on every exercise.

Everything is stored in `localStorage`. No account, no database, no server calls.

## Plans

| Category | Plans | Length |
| --- | --- | --- |
| Free Weights | Push Day, Pull Day, Legs & Core, Dumbbell Express | 40-75 min |
| Elastic Bands (bands + a door) | Upper Body, Legs & Glutes, Full-Body Express, Shoulder & Elbow Prehab | 15-60 min |
| Bodyweight (floor + one chair) | Push & Core, Pull & Posterior, Legs, Express Circuit | 25-55 min |
| Climbing Gym (wall, hangboard, weights) | Hangboard & Limit Boulders, Power Endurance 4x4s, Repeaters & Volume, Technique & Movement | 60-120 min |
| Soccer | Injury Prevention, Strength & Power, Speed & Agility, Ball Skills & Touch, Match Day Warm-Up | 20-65 min |
| Standing Only (nothing, one square metre) | Gate Area Reset, Long-Haul Recovery, Standing Climber Prehab | 8-20 min |
| Warm-Up & Recovery | Express Warm-Up, Full Warm-Up, Pre-Gym Activation, Post-Session Recovery | 10-30 min |

**Elastic Bands** exists because bands load the opposite way to free weights — hardest at the end
of the range, easiest at the start — which makes them better than dumbbells for shoulder, rotator
cuff and glute-medius work and worse for anything you want heavy. Rep ranges run higher to match.

**Soccer** leads with injury prevention because it is the only part of this app with a serious
evidence base: meta-analyses of the Nordic hamstring exercise in football squads report roughly a
halving of hamstring injury rates, trials of Copenhagen adduction report a large reduction in
groin problems, and FIFA 11+ style warm-ups report around a third fewer injuries overall. Figures
vary by study and by adherence, so the plan notes give them as orders of magnitude rather than
precise numbers. Everything else in the category — speed, power, touch — is ordinary programming.

**Standing Only** has a hard constraint: nothing touches the floor, no chair, no kneeling, and it
fits in about one square metre. Built for a gate area or a hotel corridor. A wall is used only for
balance and every exercise that mentions one works without it.

Loads are left to the athlete. Plans prescribe reps, rest and intent only.

## Features

- **Works offline and installs to the home screen.** A service worker precaches the shell and
  every exercise image, so the app runs with no signal — the normal condition in a basement gym.
- **Session clock** with pause/resume, persisted across reloads and browser restarts.
- **Checklist** per exercise per round. Multi-round single-exercise blocks (max hangs, limit
  boulder attempts) collapse into numbered set buttons.
- **Superset and circuit grouping**, marked with a badge and a colored rail so paired work is
  obvious at a glance.
- **Exercise overlay** with a large illustration, form cues and step-by-step instructions. Opens
  from a session, the library, or a plan you have not started yet, and never reflows the page
  behind it.
- **Back button works.** Every view and every overlay is a history entry, so the Android back
  gesture walks back through the app instead of leaving it. Views are URLs, so a session survives
  a reload and a plan can be linked to directly.
- **Rest timer** in a fixed bottom bar, with the current block's prescribed rest preselected.
  Audio countdown on the last three seconds.
- **Interval timer** for hangboard protocols (7s on / 3s off x 6) and timed circuits (40/20),
  driven by the block's own spec.
- **Per-exercise timers** on any prescription that is purely a duration — planks, wall sits,
  dead hangs, carries. One tap starts it in the bottom bar.
- **Session customization**: skip a block or change its round count mid-session. Progress
  recalculates against what you are actually doing.
- **Added-weight log** on hangboard blocks, off by default and enabled in settings. Prefilled with
  last session's number, in lb or kg.
- **Saved exercises.** Star anything from the overlay or the library; the Saved view lists them
  newest first with per-item removal and a clear-all.
- **UI density** — compact, normal or comfortable. Row height, card padding, gaps, type size and
  control size all scale from one set of CSS custom properties on the document root, so a session
  page runs roughly 1900px tall at compact and 2500px at comfortable.
- **Settings** for density, weight logging and unit, timer sounds, screen wake lock and figure
  animation.
- **Week structure** with five rotations and the spacing rules behind them, plus a recovery
  warning if you open a finger-intensive plan within 48 hours of the last one.
- **Exercise directory** — all 164 movements in one scrollable list, grouped the way the plans use
  them (warm-up, fingers, push, pull, legs, core, climbing, bands, standing, three soccer groups).
  Filter to a group or search across everything; search results are labelled with their group. The
  grouping is generated from the section comments in `lib/exercises.ts`, so it cannot drift from
  the file it describes, and a test asserts every exercise appears in exactly one group.
- **Screen wake lock** while a session runs, so the phone does not sleep between sets.

## Stack

Next.js 16 (App Router), React 19, TypeScript, hand-written CSS. No UI framework, no state
library, no analytics, three runtime dependencies.

Session state is read through `useSyncExternalStore` over `localStorage`, so there is no
after-mount hydration flicker. Navigation is a fourth store of the same shape, backed by the
History API: `lib/navigation.ts` owns which view and which overlay are showing, and the URL is
the source of truth (`?v=week`, `?v=preview&p=fw-push`, `?...&ex=bench-press`). Real Next routes
would give back/forward for free, but each route would be another document the service worker
has to precache, and the overlay is a layer over a view rather than a view of its own — so one
document with explicit history entries handles both uniformly and keeps offline simple. Both timers expand their schedule into wall-clock deadlines and
derive the current phase from the clock, which means a backgrounded tab or a locked screen —
where browsers throttle timers to roughly once a minute — cannot desynchronize a hangboard set.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run check    # typecheck + lint + tests
```

`npm test` runs 18 data-integrity checks with `node --test` and no test framework: unresolved
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
| `ct.settings.v1` | Preferences, merged over defaults so new settings are not undefined |
| `ct.favorites.v1` | Starred exercise keys, newest first, capped at 200 |

Navigation is not stored: it lives in the URL and the browser's history stack.

Clearing site data resets both. History is disposable by design.

## Exercise imagery

Illustrations come from [free-exercise-db](https://github.com/yuhonas/free-exercise-db), released
into the public domain under the Unlicense. Each entry provides a start and an end frame; the app
crossfades them, which reads like a GIF at about 10 KB per frame — 1.6 MB for all 160 frames,
small enough to precache entirely for offline use.

**Two frames is the ceiling, not a shortcut.** All 873 dataset entries have exactly two images —
there are no exceptions in the data. wger is unreachable behind some network policies and its
imagery is CC-BY-SA rather than public domain; everkinetic is an abandoned migration with no
declared license. Generating intermediate frames from two stills would be a cross-dissolve, which
is what the animation already does and adds no information. What the dataset does carry, and the
app now uses, is a step-by-step instruction list per exercise — bundled for 78 of the 80
illustrated movements and shown in the overlay under the cues.

`scripts/exercise-image-map.json` maps exercise keys to dataset ids by hand. Automatic name
matching produces confident nonsense (it pairs "Barbell Row" with "Barbell Curl"), and an image
that teaches the wrong movement is worse than no image, so every pair was checked by eye.

The movements with no illustration are climbing-specific (hangboard grips, limit bouldering,
footwork drills) or standing-only variants with no equipment-free match in the dataset — the
dataset's calf raise is on a machine and its quad stretch needs a box, which contradicts the whole
premise of the standing plans. Those keep their text cues plus a
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
