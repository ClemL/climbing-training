"use client";

import { useCallback, useState } from "react";
import ExerciseRow from "./ExerciseRow";
import IntervalTimer from "./IntervalTimer";
import LoadLog from "./LoadLog";
import RestTimer from "./RestTimer";
import { useTick, useWakeLock } from "@/lib/hooks";
import { elapsedMs, formatClock, slotKey, type ActiveSession } from "@/lib/storage";
import type { Block, Plan } from "@/lib/types";

const KIND_LABEL: Record<Block["kind"], string> = {
  superset: "superset",
  circuit: "circuit",
  interval: "intervals",
  straight: "straight sets",
  note: "",
};

/** A countdown handed to the bottom bar. The nonce keys a remount, which starts it. */
type Cue = { deadline: number; total: number; label: string; nonce: number };

/** Parses a rest string like "2-3 min" or "90s between rounds" into seconds. */
function restSeconds(rest?: string): number | undefined {
  if (!rest) return undefined;
  const min = rest.match(/(\d+)(?:\s*-\s*(\d+))?\s*min/i);
  if (min) return Number(min[2] ?? min[1]) * 60;
  const sec = rest.match(/(\d+)\s*s/i);
  if (sec) return Number(sec[1]);
  return undefined;
}

/** Rounds actually being performed, which the athlete can raise or lower. */
function roundsOf(session: ActiveSession, block: Block): number {
  return session.rounds?.[block.id] ?? block.rounds;
}

function isSkipped(session: ActiveSession, block: Block): boolean {
  return !!session.skipped?.[block.id];
}

/** Keys for one block at its current round count. */
function blockKeys(session: ActiveSession, block: Block): string[] {
  const keys: string[] = [];
  for (let r = 1; r <= roundsOf(session, block); r++) {
    for (let i = 0; i < block.slots.length; i++) keys.push(slotKey(block.id, r, i));
  }
  return keys;
}

/** Progress counts only what is still on the card: skipped blocks and dropped rounds do not. */
function progressOf(plan: Plan, session: ActiveSession): { checked: number; total: number } {
  let checked = 0;
  let total = 0;
  for (const block of plan.blocks) {
    if (isSkipped(session, block)) continue;
    for (const k of blockKeys(session, block)) {
      total += 1;
      if (session.done[k]) checked += 1;
    }
  }
  return { checked, total };
}

/** Rest prescription of the first unfinished block, used as the highlighted preset. */
function firstUnfinishedRest(plan: Plan, session: ActiveSession): number | undefined {
  for (const block of plan.blocks) {
    if (isSkipped(session, block)) continue;
    if (blockKeys(session, block).some((k) => !session.done[k])) return restSeconds(block.rest);
  }
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
  const [cue, setCue] = useState<Cue | null>(null);
  const now = useTick(session.running);
  useWakeLock(session.running);

  const { checked, total } = progressOf(plan, session);
  const pct = total ? Math.round((checked / total) * 100) : 0;
  const suggestion = firstUnfinishedRest(plan, session);

  const toggle = useCallback(
    (key: string) => {
      const done = { ...session.done };
      if (done[key]) delete done[key];
      else done[key] = true;
      onChange({ ...session, done });
    },
    [session, onChange],
  );

  const setMany = useCallback(
    (keys: string[], value: boolean) => {
      const done = { ...session.done };
      for (const k of keys) {
        if (value) done[k] = true;
        else delete done[k];
      }
      onChange({ ...session, done });
    },
    [session, onChange],
  );

  const toggleSkip = useCallback(
    (block: Block) => {
      const skipped = { ...(session.skipped ?? {}) };
      if (skipped[block.id]) delete skipped[block.id];
      else skipped[block.id] = true;
      onChange({ ...session, skipped });
    },
    [session, onChange],
  );

  const stepRounds = useCallback(
    (block: Block, delta: number) => {
      const next = Math.max(1, Math.min(20, roundsOf(session, block) + delta));
      onChange({ ...session, rounds: { ...(session.rounds ?? {}), [block.id]: next } });
    },
    [session, onChange],
  );

  const startTimer = useCallback((seconds: number, label: string) => {
    setCue((c) => ({ deadline: Date.now() + seconds * 1000, total: seconds, label, nonce: (c?.nonce ?? 0) + 1 }));
  }, []);

  const setRunning = (running: boolean) => {
    if (running === session.running) return;
    onChange(
      running
        ? { ...session, running: true, resumedAt: Date.now() }
        : { ...session, running: false, accumulatedMs: elapsedMs(session), resumedAt: null },
    );
  };

  const elapsed = elapsedMs(session, now);

  return (
    <div style={{ ["--cat" as string]: `var(--cat-${plan.category})` }}>
      <div className="topbar">
        <button className="btn sm ghost" onClick={onExit} aria-label="Back to plans">
          &#8592;
        </button>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="brand truncate" style={{ fontSize: 14 }} title={plan.name}>
            {plan.name}
          </div>
          <small className="faint" style={{ fontSize: 11 }}>
            {checked}/{total} done &middot; {pct}%
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
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span className="pill cat">
            {plan.minutes[0]}-{plan.minutes[1]} min
          </span>
          <span className="pill">{plan.blocks.length} blocks</span>
          <span className="pill">{total} checkpoints</span>
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
        const skipped = isSkipped(session, block);
        const rounds = roundsOf(session, block);
        const keys = blockKeys(session, block);
        const blockDone = !skipped && keys.every((k) => session.done[k]);
        const grouped = block.kind === "superset" || block.kind === "circuit" || block.kind === "interval";
        const compact = block.slots.length === 1 && rounds > 1;

        return (
          <section key={block.id} className={`block${blockDone ? " done" : ""}${skipped ? " skipped" : ""}`}>
            <div className="block-head">
              <div className="block-tag">{block.tag}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="block-title">
                  {block.title}
                  {KIND_LABEL[block.kind] ? (
                    <span className={`kind-badge kind-${block.kind}`}>{KIND_LABEL[block.kind]}</span>
                  ) : null}
                </div>
                <div className="block-meta">
                  {rounds > 1 ? `${rounds} rounds` : "1 round"}
                  {rounds !== block.rounds ? ` (plan: ${block.rounds})` : ""}
                  {block.rest ? ` · rest ${block.rest}` : ""}
                  {` · ~${block.minutes} min`}
                </div>
              </div>
              <div className="block-controls">
                <button
                  className="round-step"
                  aria-label={`One less round of ${block.title}`}
                  disabled={skipped || rounds <= 1}
                  onClick={() => stepRounds(block, -1)}
                >
                  &minus;
                </button>
                <button
                  className="round-step"
                  aria-label={`One more round of ${block.title}`}
                  disabled={skipped}
                  onClick={() => stepRounds(block, 1)}
                >
                  +
                </button>
                <button
                  className="round-step"
                  aria-label={skipped ? `Restore ${block.title}` : `Skip ${block.title}`}
                  onClick={() => toggleSkip(block)}
                >
                  {skipped ? "↺" : "✕"}
                </button>
              </div>
            </div>

            {skipped ? null : (
              <>
                {block.note ? <div className="block-note">{block.note}</div> : null}
                {block.interval ? <IntervalTimer spec={{ ...block.interval, sets: rounds }} /> : null}
                {block.interval ? <LoadLog planId={plan.id} blockId={block.id} /> : null}

                {compact ? (
                  <div className="round">
                    <ExerciseRow
                      slot={block.slots[0]}
                      checked={keys.every((k) => session.done[k])}
                      onToggle={() => setMany(keys, !keys.every((k) => session.done[k]))}
                      onTimer={startTimer}
                    />
                    <div className="setdots">
                      <span className="setdots-label">{block.unit ?? "Sets"}</span>
                      {Array.from({ length: rounds }, (_, ri) => ri + 1).map((round) => {
                        const k = slotKey(block.id, round, 0);
                        return (
                          <button
                            key={k}
                            className="setdot"
                            aria-pressed={!!session.done[k]}
                            aria-label={`${block.unit ?? "Set"} ${round}`}
                            onClick={() => toggle(k)}
                          >
                            {round}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  Array.from({ length: rounds }, (_, ri) => ri + 1).map((round) => {
                    const roundKeys = block.slots.map((_, i) => slotKey(block.id, round, i));
                    const roundDone = roundKeys.every((k) => session.done[k]);
                    return (
                      <div key={round} className="round">
                        {rounds > 1 ? (
                          <div className="round-head">
                            <span>Round {round}</span>
                            <div className="spacer" />
                            <button className="btn sm ghost" onClick={() => setMany(roundKeys, !roundDone)}>
                              {roundDone ? "Clear" : "Check all"}
                            </button>
                          </div>
                        ) : null}
                        <div className={grouped && block.slots.length > 1 ? "superset-wrap" : undefined}>
                          {block.slots.map((slot, i) => {
                            const k = slotKey(block.id, round, i);
                            return (
                              <ExerciseRow
                                key={k}
                                slot={slot}
                                checked={!!session.done[k]}
                                onToggle={() => toggle(k)}
                                onTimer={startTimer}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}
          </section>
        );
      })}

      <button className="btn good block" style={{ marginTop: 16 }} onClick={onFinish}>
        Finish session
      </button>

      <p className="footer">
        {plan.equipment.join(" · ")}
        <br />
        Targets: {plan.focus.join(", ")}
      </p>

      <RestTimer
        key={cue?.nonce ?? "idle"}
        suggestion={suggestion}
        initialDeadline={cue?.deadline}
        initialTotal={cue?.total}
        label={cue?.label}
      />
    </div>
  );
}
