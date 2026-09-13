"use client";

import { useMemo, useState } from "react";
import { EXERCISES, demoUrl } from "@/lib/exercises";

export default function ExerciseIndex() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const entries = useMemo(() => {
    const all = Object.entries(EXERCISES).sort((a, b) => a[1].name.localeCompare(b[1].name));
    const needle = q.trim().toLowerCase();
    if (!needle) return all;
    return all.filter(
      ([, ex]) =>
        ex.name.toLowerCase().includes(needle) ||
        ex.target.toLowerCase().includes(needle) ||
        ex.cues.some((c) => c.toLowerCase().includes(needle)),
    );
  }, [q]);

  return (
    <>
      <h1>Exercise library</h1>
      <p className="lede">
        Every movement used across the plans, with form cues and a demo link. Also the substitution list when a
        prescribed exercise is not available.
      </p>
      <input
        className="search"
        placeholder="Search name, muscle or cue..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {entries.length === 0 ? <div className="empty">No matches.</div> : null}
      {entries.map(([key, ex]) => (
        <div key={key} className="lib-item">
          <button className="lib-head" aria-expanded={open === key} onClick={() => setOpen(open === key ? null : key)}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="ex-name">{ex.name}</div>
              <div className="ex-pres">{ex.target}</div>
            </div>
            <span className="info-btn">{open === key ? "×" : "?"}</span>
          </button>
          {open === key ? (
            <div className="detail" style={{ marginLeft: 13 }}>
              <ul>
                {ex.cues.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <a className="btn sm" href={demoUrl(key)} target="_blank" rel="noopener noreferrer">
                Watch demo &#8599;
              </a>
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
}
