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

- **Session clock** with pause/resume, persisted across reloads and browser restarts.
- **Checklist** per exercise per round. Multi-round single-exercise blocks (max hangs, limit
  boulder attempts) collapse into numbered set buttons.
- **Superset and circuit grouping**, marked with a badge and a colored rail so paired work is
  obvious at a glance.
- **Rest timer** in a fixed bottom bar, with the current block's prescribed rest preselected.
  Audio countdown on the last three seconds.
- **Interval timer** for hangboard protocols (7s on / 3s off x 6) and timed circuits (40/20),
  driven by the block's own spec.
- **Form cues and demo link** on every exercise via the `?` button.
- **Exercise library** with search across 98 movements, usable as a substitution reference.
- **Screen wake lock** while a session runs, so the phone does not sleep between sets.

## Stack

Next.js 16 (App Router), React 19, TypeScript, hand-written CSS. No UI framework, no state
library, no analytics, three runtime dependencies.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

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
| `ct.active.v2` | The in-progress session: plan id, elapsed time, checked slots |
| `ct.history.v2` | Last 60 finished sessions |

Clearing site data resets both. History is disposable by design.

## Note on exercise demos

The app links to a video search for each movement rather than embedding GIFs, which avoids
hotlinking third-party media and keeps the bundle small. Written form cues are shown inline and
are the primary reference.
