"use client";

import { useState } from "react";
import ExerciseThumb from "./ExerciseThumb";
import { openExercise } from "./ExerciseSheet";
import FavoriteButton from "./FavoriteButton";
import { EXERCISES } from "@/lib/exercises";
import { PROGRESSIONS } from "@/lib/progressions";

export default function ProgressionsView() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <h1>Progression ladders</h1>
      <p className="lede">
        Where each main movement starts and where it goes. Every rung names what has to be true before you move
        up, because &ldquo;when it feels easy&rdquo; is how people spend a year on the same step.
      </p>

      {PROGRESSIONS.map((prog) => {
        const expanded = open === prog.id;
        return (
          <section key={prog.id} className="ladder">
            <button
              className="ladder-head"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : prog.id)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ladder-name">{prog.name}</div>
                <div className="ladder-meta">
                  {prog.pattern} &middot; {prog.rungs.length} steps
                </div>
              </div>
              <span className="ladder-chevron">{expanded ? "−" : "+"}</span>
            </button>

            {expanded ? null : (
              <div className="ladder-strip" aria-hidden="true">
                {prog.rungs.map((r, i) => (
                  <span key={i} className="ladder-strip-item">
                    {i > 0 ? <span className="ladder-arrow">{"›"}</span> : null}
                    <ExerciseThumb exKey={r.ex} />
                  </span>
                ))}
              </div>
            )}

            {expanded ? (
              <>
                <p className="ladder-why">{prog.why}</p>
                {prog.rungs.map((rung, i) => {
                  const ex = EXERCISES[rung.ex];
                  return (
                    <div className="rung" key={`${rung.ex}-${i}`}>
                      <span className="rung-num">{i + 1}</span>
                      <button className="rung-thumb-btn" onClick={() => openExercise(rung.ex)} aria-label={`Open ${ex?.name}`}>
                        <ExerciseThumb exKey={rung.ex} size={54} />
                      </button>
                      <div className="rung-body">
                        <button
                          className="rung-name"
                          onClick={() => openExercise(rung.ex)}
                          aria-label={`Open ${ex?.name}`}
                        >
                          {rung.label ?? ex?.name ?? rung.ex}
                        </button>
                        <div className="rung-criterion">
                          <span className="rung-tick">{"→"}</span> {rung.criterion}
                        </div>
                        {rung.note ? <div className="ex-note">{rung.note}</div> : null}
                      </div>
                      <FavoriteButton exKey={rung.ex} />
                    </div>
                  );
                })}
              </>
            ) : null}
          </section>
        );
      })}

      <p className="footer">
        Rungs link to the same cues and illustrations as everywhere else. Star one to keep it in Saved while you
        work on it.
      </p>
    </>
  );
}
