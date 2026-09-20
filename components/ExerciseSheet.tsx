"use client";

import { useCallback, useEffect } from "react";
import ExerciseFigure from "./ExerciseFigure";
import FavoriteButton from "./FavoriteButton";
import { EXERCISES, searchUrl } from "@/lib/exercises";
import { EXERCISE_STEPS } from "@/lib/exercise-steps";
import { IMAGE_KEYS } from "@/lib/exercise-images";
import { back, getNav, navigate } from "@/lib/navigation";
import { useNav } from "@/lib/use-navigation";

/** Opens the exercise overlay as a history entry, so back closes it. */
export function openExercise(exKey: string): void {
  navigate({ ...getNav(), ex: exKey });
}

/**
 * Single overlay for exercise detail, rendered once at the root.
 *
 * A sheet rather than an inline expander: opening detail mid-session used to
 * push the rest of the checklist down the page, which loses your place between
 * sets. The overlay leaves the card exactly where it was.
 */
export default function ExerciseSheet() {
  const nav = useNav();
  const exKey = nav.ex;

  // Closing always goes through history, so the entry the overlay pushed is
  // consumed rather than stranded behind the user.
  const close = useCallback(() => back(), []);

  useEffect(() => {
    if (!exKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [exKey]);

  if (!exKey) return null;
  const ex = EXERCISES[exKey];
  if (!ex) return null;

  const steps = EXERCISE_STEPS[exKey];
  const hasImage = IMAGE_KEYS.has(exKey);

  return (
    <div className="sheet-backdrop" role="presentation" onClick={close}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={ex.name} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sheet-title">{ex.name}</div>
            <div className="sheet-target">{ex.target}</div>
          </div>
          <FavoriteButton exKey={exKey} className="star sheet-star" />
          <button className="btn sm" onClick={close} aria-label="Close">
            &#10005;
          </button>
        </div>

        <div className="sheet-body">
          {hasImage ? <ExerciseFigure exKey={exKey} large /> : null}

          <h3 className="sheet-h">Form cues</h3>
          <ul className="sheet-cues">
            {ex.cues.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          {steps?.length ? (
            <>
              <h3 className="sheet-h">Step by step</h3>
              <ol className="sheet-steps">
                {steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </>
          ) : null}

          {!hasImage ? (
            <a className="btn sm" href={searchUrl(exKey)} target="_blank" rel="noopener noreferrer">
              Search the web &#8599;
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
