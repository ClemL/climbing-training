"use client";

import { useState } from "react";
import { EXERCISES, demoUrl } from "@/lib/exercises";
import type { Slot } from "@/lib/types";

export default function ExerciseRow({
  slot,
  checked,
  onToggle,
}: {
  slot: Slot;
  checked: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ex = EXERCISES[slot.ex];
  if (!ex) return null;

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
          <ul>
            {ex.cues.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <a className="btn sm" href={demoUrl(slot.ex)} target="_blank" rel="noopener noreferrer">
            Watch demo &#8599;
          </a>
        </div>
      ) : null}
    </>
  );
}
