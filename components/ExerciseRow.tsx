"use client";

import { useState } from "react";
import ExerciseFigure from "./ExerciseFigure";
import { EXERCISES, searchUrl } from "@/lib/exercises";
import { IMAGE_KEYS } from "@/lib/exercise-images";
import { formatDuration, parseDuration } from "@/lib/duration";
import type { Slot } from "@/lib/types";

export default function ExerciseRow({
  slot,
  checked,
  onToggle,
  onTimer,
}: {
  slot: Slot;
  checked: boolean;
  onToggle: () => void;
  /** Offered only when the prescription is purely a duration. */
  onTimer?: (seconds: number, label: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ex = EXERCISES[slot.ex];
  if (!ex) return null;

  const seconds = onTimer ? parseDuration(slot.pres) : null;

  return (
    <>
      <div className={`ex${checked ? " checked" : ""}`}>
        <button className="check" aria-pressed={checked} aria-label={`Mark ${ex.name} done`} onClick={onToggle}>
          &#10003;
        </button>
        <div className="ex-main" onClick={onToggle} role="presentation">
          <div className="ex-name">{ex.name}</div>
          <div className="ex-pres">{slot.pres}</div>
          {slot.note ? <div className="ex-note">{slot.note}</div> : null}
        </div>
        {seconds !== null ? (
          <button
            className="timer-btn"
            aria-label={`Time ${formatDuration(seconds)} for ${ex.name}`}
            onClick={() => onTimer?.(seconds, ex.name)}
          >
            {formatDuration(seconds)}
          </button>
        ) : null}
        <button
          className="info-btn"
          aria-expanded={open}
          aria-label={`How to do ${ex.name}`}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "×" : "?"}
        </button>
      </div>
      {open ? (
        <div className="detail">
          <div className="target">{ex.target}</div>
          <ExerciseFigure exKey={slot.ex} />
          <ul>
            {ex.cues.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          {IMAGE_KEYS.has(slot.ex) ? null : (
            <a className="btn sm" href={searchUrl(slot.ex)} target="_blank" rel="noopener noreferrer">
              Search the web &#8599;
            </a>
          )}
        </div>
      ) : null}
    </>
  );
}
