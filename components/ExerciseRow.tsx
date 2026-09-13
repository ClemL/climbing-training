"use client";

import { useExerciseSheet } from "./ExerciseSheet";
import { EXERCISES } from "@/lib/exercises";
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
  const { open } = useExerciseSheet();
  const ex = EXERCISES[slot.ex];
  if (!ex) return null;

  const seconds = onTimer ? parseDuration(slot.pres) : null;

  return (
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
      <button className="info-btn" aria-label={`How to do ${ex.name}`} onClick={() => open(slot.ex)}>
        ?
      </button>
    </div>
  );
}
