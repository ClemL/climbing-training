"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useBeep, useTick } from "@/lib/hooks";
import { useSettings } from "@/lib/use-settings";
import { formatClock } from "@/lib/storage";

const PRESETS = [30, 60, 90, 120, 180];

const NO_SOUND = () => {};

export default function RestTimer({
  suggestion,
  initialDeadline,
  initialTotal = 0,
  label,
  next,
}: {
  suggestion?: number;
  /** Epoch ms. Set by the parent via a changing `key`, which remounts and starts the clock. */
  initialDeadline?: number;
  initialTotal?: number;
  /** Shown while an exercise-triggered countdown runs. */
  label?: string;
  /** Chalk only: the next unchecked item, so the bar answers "what now" as well as "how long". */
  next?: string;
}) {
  // A wall-clock deadline, not a decrementing counter: the countdown stays
  // correct across a backgrounded tab, a locked screen, or a dropped frame.
  const [deadline, setDeadline] = useState<number | null>(initialDeadline ?? null);
  const [total, setTotal] = useState(initialTotal);
  // When the current countdown began; the clock never reads earlier. See useTick.
  const [startedAt, setStartedAt] = useState(0);
  const { sounds } = useSettings();
  const beepRaw = useBeep();
  const beep = sounds ? beepRaw : NO_SOUND;
  const lastBeep = useRef<number>(-1);

  const now = useTick(deadline !== null, 100, startedAt, deadline ?? undefined);
  const remainMs = deadline === null ? 0 : Math.max(0, deadline - now);
  const remainSec = Math.ceil(remainMs / 1000);
  const expired = deadline !== null && remainMs === 0;
  const counting = deadline !== null && !expired;

  // Audio only. No state changes here, so the countdown has a single owner.
  useEffect(() => {
    if (deadline === null) return;
    if (remainSec > 0 && remainSec <= 3 && lastBeep.current !== remainSec) {
      lastBeep.current = remainSec;
      beep("tick");
    }
    if (remainMs === 0 && lastBeep.current !== 0) {
      lastBeep.current = 0;
      beep("done");
    }
  }, [remainSec, remainMs, deadline, beep]);

  const start = useCallback((secs: number) => {
    const t = Date.now();
    lastBeep.current = -1;
    setTotal(secs);
    setStartedAt(t);
    setDeadline(t + secs * 1000);
  }, []);

  const extend = useCallback(() => {
    setDeadline((d) => (d === null ? null : d + 30_000));
  }, []);

  const presets =
    suggestion && !PRESETS.includes(suggestion) ? [suggestion, ...PRESETS].sort((a, b) => a - b) : PRESETS;

  return (
    <div className="timerbar">
      <div className="timerbar-inner">
        <div className={`rest-display mono${counting ? " active" : ""}`}>
          {counting ? formatClock(remainMs) : expired ? "Go" : "Rest"}
        </div>
        {counting && label ? <span className="timer-label truncate">{label}</span> : null}
        {next && !(counting && label) ? <span className="timer-next truncate">Next: {next}</span> : null}
        {counting ? (
          <div className="quick">
            <button className="btn sm" onClick={extend}>
              +30s
            </button>
            <button className="btn sm" onClick={() => start(total)}>
              Restart
            </button>
            <button className="btn sm danger" onClick={() => setDeadline(null)}>
              Stop
            </button>
          </div>
        ) : (
          <div className="quick">
            {presets.map((s) => (
              <button key={s} className={`btn sm${s === suggestion ? " primary" : ""}`} onClick={() => start(s)}>
                {s < 120 ? `${s}s` : `${Math.round((s / 60) * 10) / 10}m`}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
