"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ExerciseRow from "./ExerciseRow";
import IntervalTimer from "./IntervalTimer";
import LoadLog from "./LoadLog";
import RestTimer from "./RestTimer";
import { EXERCISES } from "@/lib/exercises";
import { useTick, useWakeLock } from "@/lib/hooks";
import { useSettings } from "@/lib/use-settings";
import {
  blockKeys,
  currentBlock,
  isSkipped,
  nextItem,
  progressOf,
  roundsOf,
  slotKey,
  type NextItem,
} from "@/lib/progress";
import { elapsedMs, formatClock, type ActiveSession } from "@/lib/storage";
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

/** "Max Hang, 10s · set 3 of 5": what Chalk's timer bar shows as up next. */
function describeNext({ block, round, slotIndex, rounds }: NextItem): string {
  const slot = block.slots[slotIndex];
  const name = EXERCISES[slot.ex]?.name ?? slot.ex;
  // Units are plural labels for the set buttons ("Attempts"); one of them is singular.
  const unit = block.slots.length === 1 ? (block.unit ?? "Sets").replace(/s$/, "").toLowerCase() : "round";
  return `${name}, ${slot.pres}${rounds > 1 ? ` · ${unit} ${round} of ${rounds}` : ""}`;
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
  const settings = useSettings();
  const now = useTick(session.running);
  useWakeLock(session.running && settings.keepAwake);

  const { checked, total } = progressOf(plan, session);
  const pct = total ? Math.round((checked / total) * 100) : 0;
  const current = currentBlock(plan, session);
  // The current block's rest prescription is the highlighted preset.
  const suggestion = restSeconds(current?.rest);

  // Chalk's focus mode: the block being worked is open, the rest fold to their
  // headings, and round count and skip move into a per-block menu so a slip of
  // a chalky finger cannot drop a block.
  const focus = settings.style === "chalk";
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const up = focus ? nextItem(plan, session) : undefined;

  // Finishing a block folds it and the page gets shorter under the thumb, so
  // bring the next one into view rather than leave the scroll position wherever it lands.
  const currentId = current?.id;
  const seen = useRef(currentId);
  useEffect(() => {
    if (!focus || seen.current === currentId) return;
    seen.current = currentId;
    if (currentId)
      document.getElementById(`block-${currentId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focus, currentId]);

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
    <div className="narrow" style={{ ["--cat" as string]: `var(--cat-${plan.category})` }}>
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
        {focus ? (
          <div className="topbar-progress" aria-label={`${pct} percent complete`}>
            <i style={{ width: `${pct}%` }} />
          </div>
        ) : null}
      </div>

      {focus ? null : (
        <div className="session-head">
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span className="pill cat">
              {plan.minutes[0]}-{plan.minutes[1]} min
            </span>
            <span className="pill">{plan.blocks.length} blocks</span>
            <span className="pill">{total} checkpoints</span>
          </div>
          <div className="block-progress" role="img" aria-label={`${pct} percent complete`}>
            {plan.blocks
              .filter((b) => b.slots.length > 0)
              .map((b) => {
                const skipped = isSkipped(session, b);
                const keys = blockKeys(session, b);
                const done = keys.filter((k) => session.done[k]).length;
                const width = skipped || !keys.length ? 0 : Math.round((done / keys.length) * 100);
                return (
                  <span key={b.id} className={skipped ? "skipped" : undefined}>
                    <i style={{ width: `${width}%` }} />
                  </span>
                );
              })}
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
      )}

      {plan.notes?.length ? (
        focus ? (
          <details className="notes notes-fold">
            <summary>
              Before you start &middot; {plan.notes.length} {plan.notes.length === 1 ? "note" : "notes"}
            </summary>
            <ul>
              {plan.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </details>
        ) : (
          <div className="notes">
            <ul>
              {plan.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        )
      ) : null}

      {focus ? (
        <div className="focus-bar">
          <span>{current ? `On ${current.tag}: ${current.title}` : "Every block is checked off"}</span>
          <button className="btn sm ghost" aria-pressed={showAll} onClick={() => setShowAll(!showAll)}>
            {showAll ? "Fold" : "Show all"}
          </button>
        </div>
      ) : null}

      {plan.blocks.map((block) => {
        const skipped = isSkipped(session, block);
        const rounds = roundsOf(session, block);
        const keys = blockKeys(session, block);
        const doneCount = keys.filter((k) => session.done[k]).length;
        const blockDone = !skipped && doneCount === keys.length;
        const grouped = block.kind === "superset" || block.kind === "circuit" || block.kind === "interval";
        const compact = block.slots.length === 1 && rounds > 1;
        const expanded = !focus || showAll || (open[block.id] ?? block.id === currentId);
        // Inside a button the heading has to be phrasing content.
        const H = focus ? "span" : "div";
        const heading = (
          <>
            <H className="block-title">
              {block.title}
              {KIND_LABEL[block.kind] ? (
                <span className={`kind-badge kind-${block.kind}`}>{KIND_LABEL[block.kind]}</span>
              ) : null}
            </H>
            <H className="block-meta">
              {focus && skipped ? (
                "Skipped"
              ) : focus && !expanded ? (
                `${doneCount}/${keys.length} done · ~${block.minutes} min`
              ) : (
                <>
                  {rounds > 1 ? `${rounds} rounds` : "1 round"}
                  {rounds !== block.rounds ? ` (plan: ${block.rounds})` : ""}
                  {block.rest ? ` · rest ${block.rest}` : ""}
                  {` · ~${block.minutes} min`}
                </>
              )}
            </H>
          </>
        );

        return (
          <section
            key={block.id}
            id={`block-${block.id}`}
            className={`block${blockDone ? " done" : ""}${skipped ? " skipped" : ""}${focus && block.id === currentId ? " current" : ""}${expanded ? "" : " folded"}`}
          >
            <div className="block-head">
              <div className="block-tag">{focus && blockDone ? "✓" : block.tag}</div>
              {focus ? (
                <button
                  className="block-toggle"
                  aria-expanded={expanded}
                  onClick={() => setOpen((o) => ({ ...o, [block.id]: !expanded }))}
                >
                  {heading}
                </button>
              ) : (
                <div style={{ flex: 1, minWidth: 0 }}>{heading}</div>
              )}
              {focus ? (
                <button
                  className="round-step"
                  aria-label={`Options for ${block.title}`}
                  aria-expanded={menu === block.id}
                  onClick={() => setMenu((m) => (m === block.id ? null : block.id))}
                >
                  &#8943;
                </button>
              ) : (
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
              )}
            </div>

            {focus && menu === block.id ? (
              <div className="block-menu">
                <span className="block-menu-label">Rounds</span>
                <button
                  className="round-step"
                  aria-label={`One less round of ${block.title}`}
                  disabled={skipped || rounds <= 1}
                  onClick={() => stepRounds(block, -1)}
                >
                  &minus;
                </button>
                <span className="mono block-menu-count">{rounds}</span>
                <button
                  className="round-step"
                  aria-label={`One more round of ${block.title}`}
                  disabled={skipped}
                  onClick={() => stepRounds(block, 1)}
                >
                  +
                </button>
                <div className="spacer" />
                <button
                  className={`btn sm${skipped ? "" : " danger"}`}
                  onClick={() => {
                    toggleSkip(block);
                    setMenu(null);
                  }}
                >
                  {skipped ? "Restore block" : "Skip block"}
                </button>
              </div>
            ) : null}

            {skipped ? null : (
              // Folded with `hidden` rather than unmounted, so a running interval timer survives it.
              <div className="block-body" hidden={!expanded}>
                {block.note ? <div className="block-note">{block.note}</div> : null}
                {block.interval ? <IntervalTimer spec={{ ...block.interval, sets: rounds }} /> : null}
                {block.interval && settings.logHangboardWeight ? <LoadLog planId={plan.id} blockId={block.id} /> : null}

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
              </div>
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
        next={up ? describeNext(up) : undefined}
      />
    </div>
  );
}
