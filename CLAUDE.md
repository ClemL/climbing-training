# Training Days

A phone-first training app: Next.js 16 App Router, React 19, hand-written CSS. See `README.md` for
the architecture, data model and offline behavior.

## Working agreements

* **Add a line to `public/updates.txt` when you ship a user-visible change.** Newest last; the footer reads the file and shows the final line. Internal changes (refactors, tests, tooling) do not get a line.
* Run `npm run check` (typecheck, lint, tests) and `npm run build` before pushing; CI runs the same steps.
* Bump `VERSION` in `public/sw.js` when the shell changes in a way that must invalidate offline caches.
