# Training Days

A phone-first training app: Next.js 16 App Router, React 19, hand-written CSS. See `README.md` for
the architecture, data model and offline behavior.

## Working agreements

* **Add a line to `public/updates.txt` when you ship a user-visible change.** Newest last; the footer reads the file and shows the final line. Internal changes (refactors, tests, tooling) do not get a line.
* Run `npm run check` (typecheck, lint, tests) and `npm run build` before pushing; CI runs the same steps.
* Bump `VERSION` in `public/sw.js` when the shell changes in a way that must invalidate offline caches.
* **Check UI work at the four device sizes**: OnePlus Open folded (425×946) and unfolded (864×930), Galaxy Tab S Ultra portrait (924×1480) and landscape (1480×924). `npm run test:e2e` runs them after `npm run build`; if a real device reports other figures (Settings shows them under "This screen"), correct `e2e/helpers.ts`. Layout breakpoints live in `lib/layout.ts` and `app/globals.css`; change both together.
* **Display settings are applied before first paint** by `BOOT_SCRIPT` in `lib/display.ts`, inlined by the root layout. Adding a theme means an entry in `THEMES`, its id in `displayAttributes`' allowlist, and its CSS block.
* **Every font size is `calc(<n>px * var(--text-scale))`, and spacing uses the density variables.** Inline sizes go through `textPx()`. A new rule with a fixed size ignores the Settings menu.
* **Overlays use `Sheet`.** Never position a menu absolutely inside the sticky top bar: its `backdrop-filter` makes it the containing block for anything fixed inside it. A new floating menu renders through a portal with `position: fixed`, clamped to the visual viewport and scrolling inside itself.
