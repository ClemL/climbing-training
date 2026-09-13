"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ExerciseRow from "./ExerciseRow";
import IntervalTimer from "./IntervalTimer";
import RestTimer from "./RestTimer";
import { useTick, useWakeLock } from "@/lib/hooks";
import { EXERCISES } from "@/lib/exercises";
import { elapsedMs, formatClock, slotKey, type ActiveSession } from "@/lib/storage";
import type { Block, Plan } from "@/lib/types";

const KIND_LABEL: Record<Block["kind"], string> = {
  superset: "superset",
  circuit: "circuit",
  interval: "intervals",
  straight: "straight sets",
  note: "",
};

/** Parses a rest string like "2-3 min" or "90s between rounds" into seconds for the rest-timer preset. */
function restSeconds(rest?: string): number | undefined {
  if (!rest) return undefined;
  const min = rest.match(/(\d+)(?:\s*-\s*(\d+))?\s*min/i);
  if (min) return Number(min[2] ?? min[1]) * 60;
  const sec = rest.match(/(\d+)\s*s/i);
  if (sec) return Number(sec[1]);
  return undefined;
}

export default function SessionView({
  plan,
  session,
  onChange,
  onFinish,
  onExit,
}: {
  plan: Plan;
  session: ActiveSession;
  onChange: (next: ActiveSession) => void;
  onFinish: () => void;
  onExit: () => void;
}) {
  const [suggestion, setSuggestion] = useState<number | undefined>(undefined);
  const now = useTick(session.running);
  useWakeLock(session.running);

  const totalSlots = useMemo(() => plan.blocks.reduce((n, b) => n + b.slots.length * b.rounds, 0), [plan]);
  const checkedCount = Object.keys(session.done).length;
  const pct = totalSlots ? Math.round((checkedCount / totalSlots) * 100) : 0;

  // First unfinished block drives the suggested rest interval.
  useEffect(() => {
    for (const b of plan.blocks) {
      const keys: string[] = [];
      for (let r = 1; r <= b.rounds; r++) for (let i = 0; i < b.slots.length; i++) keys.push(slotKey(b.id, r, i));
      if (keys.some((k) => !session.done[k])) {
        setSuggestion(restSeconds(b.rest));
        return;
      }
    }
    setSuggestion(undefined);
  }, [plan, session.done]);

  const toggle = useCallback(
    (key: string) => {
      const done = { ...session.done };
      if (done[key]) delete done[key];
      else done[key] = true;
      onChange({ ...session, done });
    },
    [session, onChange],
  );

  const toggleRound = useCallback(
    (block: Block, round: number, allDone: boolean) => {
      const done = { ...session.done };
      for (let i = 0; i < block.slots.length; i++) {
        const k = slotKey(block.id, round, i);
        if (allDone) delete done[k];
        else done[k] = true;
      }
      onChange({ ...session, done });
    },
    [session, onChange],
  );

  const setRunning = (running: boolean) => {
    if (running === session.running) return;
    onChange(
      running
        ? { ...session, running: true, resumedAt: Date.now() }
        : { ...session, running: false, accumulatedMs: elapsedMs(session), resumedAt: null },
    );
  };

  const elapsed = elapsedMs(session, now);
  const cat = `var(--cat-${plan.category})`;

  return (
    <div style={{ ["--cat" as string]: cat }}>
      <div className="topbar">
        <button className="btn sm ghost" onClick={onExit} aria-label="Back to plans">
          &#8592;
        </button>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="brand truncate" style={{ fontSize: 14 }} title={plan.name}>
            {plan.name}
          </div>
          <small className="faint" style={{ fontSize: 11 }}>
            {checkedCount}/{totalSlots} done &middot; {pct}%
          </small>
        </div>
        <div className={`clock mono${session.running ? "" : " paused"}`} style={{ fontSize: 22 }}>
          {formatClock(elapsed)}
        </div>
        <button className="btn sm" onClick={() => setRunning(!session.running)}>
          {session.running ? "Pause" : "Resume"}
        </button>
      </div>

      <div className="session-head">
        <div className="row1" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="pill cat">{plan.minutes[0]}-{plan.minutes[1]} min</span>
          <span className="pill">{plan.blocks.length} blocks</span>
          <span className="pill">{totalSlots} checkpoints</span>
        </div>
        <div className="progress" aria-label={`${pct} percent complete`}>
          <i style={{ width: `${pct}%` }} />
        </div>
        <div className="clockrow">
          <div className={`clock mono${session.running ? "" : " paused"}`}>{formatClock(elapsed)}</div>
          <div className="spacer" />
          <button className="btn" onClick={() => setRunning(!session.running)}>
            {session.running ? "Pause" : "Resume"}
          </button>
          <button className="btn good" onClick={onFinish}>
            Finish
          </button>
        </div>
      </div>

      {plan.notes?.length ? (
        <div className="notes">
          <ul>
            {plan.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {plan.blocks.map((block) => {
        const keys: string[] = [];
        for (let r = 1; r <= block.rounds; r++) for (let i = 0; i < block.slots.length; i++) keys.push(slotKey(block.id, r, i));
        const blockDone = keys.every((k) => session.done[k]);
        const grouped = block.kind === "superset" || block.kind === "circuit" || block.kind === "interval";

        return (
          <section key={block.id} className={`block${blockDone ? " done" : ""}`}>
            <div className="block-head">
              <div className="block-tag">{block.tag}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="block-title">
                  {block.title}
                  {KIND_LABEL[block.kind] ? <span className={`kind-badge kind-${block.kind}`}>{KIND_LABEL[block.kind]}</span> : null}
                </div>
                <div className="block-meta">
                  {block.rounds > 1 ? `${block.rounds} rounds` : "1 round"}
                  {block.rest ? ` · rest ${block.rest}` : ""}
                  {` · ~${block.minutes} min`}
                </div>
              </div>
            </div>

            {block.note ? <div className="block-note">{block.note}</div> : null}
            {block.interval ? <IntervalTimer spec={block.interval} /> : null}

            {block.slots.length === 1 && block.rounds > 1 ? (
              <div className="round">
                <ExerciseRow
                  slot={block.slots[0]}
                  checked={keys.every((k) => session.done[k])}
                  onToggle={() => {
                    const all = keys.every((k) => session.done[k]);
                    const done = { ...session.done };
                    for (const k of keys) {
                      if (all) delete done[k];
                      else done[k] = true;
                    }
                    onChange({ ...session, done });
                  }}
                />
                <div className="setdots">
                  <span className="setdots-label">{block.unit ?? "Sets"}</span>
                  {Array.from({ length: block.rounds }, (_, ri) => ri + 1).map((round) => {
                    const k = slotKey(block.id, round, 0);
                    return (
                      <button
                        key={k}
                        className="setdot"
                        aria-pressed={!!session.done[k]}
                        aria-label={`Set ${round}`}
                        onClick={() => toggle(k)}
                      >
                        {round}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
            Array.from({ length: block.rounds }, (_, ri) => ri + 1).map((round) => {
              const roundKeys = block.slots.map((_, i) => slotKey(block.id, round, i));
              const roundDone = roundKeys.every((k) => session.done[k]);
              return (
                <div key={round} className="round">
                  {block.rounds > 1 ? (
                    <div className="round-head">
                      <span>Round {round}</span>
                      <div className="spacer" />
                      <button className="btn sm ghost" onClick={() => toggleRound(block, round, roundDone)}>
                        {roundDone ? "Clear" : "Check all"}
                      </button>
                    </div>
                  ) : null}
                  <div className={grouped && block.slots.length > 1 ? "superset-wrap" : undefined}>
                    {block.slots.map((slot, i) => {
                      const k = slotKey(block.id, round, i);
                      return <ExerciseRow key={k} slot={slot} checked={!!session.done[k]} onToggle={() => toggle(k)} />;
                    })}
                  </div>
                </div>
              );
            }))}
          </section>
        );
      })}

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button className="btn good block" onClick={onFinish}>
          Finish session
        </button>
      </div>

      <p className="footer">
        {plan.equipment.join(" · ")}
        <br />
        Targets: {plan.focus.join(", ")}
        <br />
        {plan.blocks.reduce((n, b) => n + b.slots.length, 0)} distinct exercises, {Object.keys(EXERCISES).length} in the library.
      </p>

      <RestTimer suggestion={suggestion} />
    </div>
  );
}
