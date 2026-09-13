"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import ExerciseFigure, { type FrameMode } from "./ExerciseFigure";
import { EXERCISES, searchUrl } from "@/lib/exercises";
import { EXERCISE_STEPS } from "@/lib/exercise-steps";
import { IMAGE_KEYS } from "@/lib/exercise-images";

type Ctx = { open: (exKey: string) => void };

const ExerciseSheetContext = createContext<Ctx>({ open: () => {} });

export function useExerciseSheet(): Ctx {
  return useContext(ExerciseSheetContext);
}

/**
 * Single overlay for exercise detail, rendered once at the root.
 *
 * A sheet rather than an inline expander: opening detail mid-session used to
 * push the rest of the checklist down the page, which loses your place between
 * sets. The overlay leaves the card exactly where it was.
 */
export function ExerciseSheetProvider({ children }: { children: React.ReactNode }) {
  const [exKey, setExKey] = useState<string | null>(null);
  const [frame, setFrame] = useState<FrameMode>("auto");

  const open = useCallback((key: string) => {
    setFrame("auto");
    setExKey(key);
  }, []);

  const close = useCallback(() => setExKey(null), []);
  const value = useMemo(() => ({ open }), [open]);

  // Escape closes; the page behind must not scroll while the sheet is up.
  useEffect(() => {
    if (!exKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [exKey, close]);

  const ex = exKey ? EXERCISES[exKey] : null;
  const steps = exKey ? EXERCISE_STEPS[exKey] : undefined;
  const hasImage = exKey ? IMAGE_KEYS.has(exKey) : false;

  return (
    <ExerciseSheetContext.Provider value={value}>
      {children}
      {exKey && ex ? (
        <div className="sheet-backdrop" role="presentation" onClick={close}>
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={ex.name}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-head">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sheet-title">{ex.name}</div>
                <div className="sheet-target">{ex.target}</div>
              </div>
              <button className="btn sm" onClick={close} aria-label="Close">
                &#10005;
              </button>
            </div>

            <div className="sheet-body">
              {hasImage ? (
                <>
                  <ExerciseFigure exKey={exKey} mode={frame} large />
                  <div className="frame-controls">
                    {(
                      [
                        ["auto", "Play"],
                        [0, "Start"],
                        [1, "End"],
                      ] as [FrameMode, string][]
                    ).map(([m, label]) => (
                      <button
                        key={String(m)}
                        className="btn sm"
                        aria-pressed={frame === m}
                        onClick={() => setFrame(m)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}

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
      ) : null}
    </ExerciseSheetContext.Provider>
  );
}
