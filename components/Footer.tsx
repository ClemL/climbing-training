"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Sheet from "./Sheet";
import { CHANGELOG_URL, parseChangelog } from "@/lib/changelog";
import { back, getNav, navigate } from "@/lib/navigation";
import { useNav } from "@/lib/use-navigation";

const APP_NAME = "Training Days";
const VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "0.0.0";
const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME || "";

// One request per page load, shared by every footer that mounts after it:
// switching views remounts the footer, and the file does not change meanwhile.
let pending: Promise<string[]> | undefined;

function loadChangelog(): Promise<string[]> {
  pending ??= fetch(CHANGELOG_URL)
    .then((res) => (res.ok ? res.text() : ""))
    .then(parseChangelog)
    // A missing changelog is not worth an error: the footer shows build info alone.
    .catch(() => []);
  return pending;
}

/**
 * The page footer: whatever notes the page passes in, then the build line and
 * the newest changelog entry. The entry opens the full changelog, newest first.
 * Not shown in a running session, where the bottom of the screen belongs to the
 * rest timer.
 */
export default function Footer({ children }: { children?: ReactNode }) {
  const nav = useNav();
  const [entries, setEntries] = useState<string[]>([]);

  useEffect(() => {
    let live = true;
    loadChangelog().then((lines) => {
      if (live) setEntries(lines);
    });
    return () => {
      live = false;
    };
  }, []);

  // A history entry like the exercise overlay, so the back gesture closes it.
  const open = useCallback(() => navigate({ ...getNav(), log: true }), []);
  const close = useCallback(() => back(), []);

  const latest = entries.length ? entries[entries.length - 1] : null;

  return (
    <>
      <footer className="footer">
        {children}
        <div className="build-info">
          <div>
            {APP_NAME} &middot; v{VERSION}
            {BUILD_TIME ? ` · built ${BUILD_TIME}` : ""}
          </div>
          {latest ? (
            <button type="button" className="changelog-trigger" title={latest} onClick={open}>
              {latest}
            </button>
          ) : null}
        </div>
      </footer>

      {/* Outside <footer>, so the dialog does not inherit its small mono type. */}
      {nav.log && latest ? (
        <Sheet label="Changelog" onClose={close}>
          <div className="sheet-head">
            <div className="sheet-title" style={{ flex: 1 }}>
              Changelog
            </div>
            <button className="btn sm" onClick={close} aria-label="Close">
              &#10005;
            </button>
          </div>
          <div className="sheet-body">
            <ul className="changelog-list">
              {/* Text children, so React escapes them: an entry cannot inject markup. */}
              {entries
                .slice()
                .reverse()
                .map((line, i) => (
                  <li key={`${i}-${line}`}>{line}</li>
                ))}
            </ul>
          </div>
        </Sheet>
      ) : null}
    </>
  );
}
