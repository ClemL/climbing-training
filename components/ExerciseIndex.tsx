"use client";

import { useMemo, useState } from "react";
import FavoriteButton from "./FavoriteButton";
import { openExercise } from "./ExerciseSheet";
import { EXERCISES } from "@/lib/exercises";
import { EXERCISE_GROUPS } from "@/lib/exercise-groups";
import { IMAGE_KEYS } from "@/lib/exercise-images";

const TOTAL = Object.keys(EXERCISES).length;

function Row({ exKey, group }: { exKey: string; group?: string }) {
  const ex = EXERCISES[exKey];
  if (!ex) return null;
  return (
    <div className="lib-item">
      <div className="lib-head">
        <button
          style={{ flex: 1, minWidth: 0, textAlign: "left" }}
          onClick={() => openExercise(exKey)}
          aria-label={`Open ${ex.name}`}
        >
          <div className="ex-name">{ex.name}</div>
          <div className="ex-pres">
            {group ? `${group} · ` : ""}
            {ex.target}
          </div>
        </button>
        {IMAGE_KEYS.has(exKey) ? <span className="chip">illustrated</span> : null}
        <FavoriteButton exKey={exKey} />
      </div>
    </div>
  );
}

/**
 * Scrollable directory of every movement in the app, grouped the same way
 * lib/exercises.ts is organised. Search flattens across all groups; with no
 * search you browse section by section.
 */
export default function ExerciseIndex() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<string | "all">("all");

  const needle = q.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!needle) return null;
    const out: { key: string; group: string }[] = [];
    for (const g of EXERCISE_GROUPS) {
      for (const key of g.keys) {
        const ex = EXERCISES[key];
        if (!ex) continue;
        if (
          ex.name.toLowerCase().includes(needle) ||
          ex.target.toLowerCase().includes(needle) ||
          g.label.toLowerCase().includes(needle) ||
          ex.cues.some((c) => c.toLowerCase().includes(needle))
        ) {
          out.push({ key, group: g.label });
        }
      }
    }
    out.sort((a, b) => EXERCISES[a.key].name.localeCompare(EXERCISES[b.key].name));
    return out;
  }, [needle]);

  const shown = EXERCISE_GROUPS.filter((g) => group === "all" || g.label === group);

  return (
    <>
      <h1>Exercise directory</h1>
      <p className="lede">
        Every movement in the app, {TOTAL} of them, grouped the way the plans use them. Tap any one for cues,
        illustrations and step-by-step instructions, or star it to save for later.
      </p>

      <input
        className="search"
        placeholder={`Search ${TOTAL} exercises by name, muscle or cue...`}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {matches ? (
        <>
          <p className="cat-blurb">
            {matches.length} {matches.length === 1 ? "match" : "matches"} for &ldquo;{q.trim()}&rdquo;
          </p>
          {matches.length === 0 ? <div className="empty">No matches. Try a muscle name or a piece of a cue.</div> : null}
          {matches.map((m) => (
            <Row key={m.key} exKey={m.key} group={m.group} />
          ))}
        </>
      ) : (
        <>
          <div className="tabs" style={{ marginBottom: 14 }}>
            <button className="tab" aria-pressed={group === "all"} onClick={() => setGroup("all")}>
              All {TOTAL}
            </button>
            {EXERCISE_GROUPS.map((g) => (
              <button key={g.label} className="tab" aria-pressed={group === g.label} onClick={() => setGroup(g.label)}>
                {g.label} {g.keys.length}
              </button>
            ))}
          </div>

          {shown.map((g) => (
            <section key={g.label}>
              <div className="dir-head">
                <span>{g.label}</span>
                <span className="faint">{g.keys.length}</span>
              </div>
              {g.keys.map((key) => (
                <Row key={key} exKey={key} />
              ))}
            </section>
          ))}
        </>
      )}
    </>
  );
}
