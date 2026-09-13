"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useBeep, useTick } from "@/lib/hooks";
import { formatClock } from "@/lib/storage";

const PRESETS = [30, 60, 90, 120, 180];

export default function RestTimer({ suggestion }: { suggestion?: number }) {
  // A wall-clock deadline, not a decrementing counter: the countdown stays
  // correct across a backgrounded tab, a locked screen, or a dropped frame.
  const [deadline, setDeadline] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const beep = useBeep();
  const lastBeep = useRef<number>(-1);

  const now = useTick(deadline !== null, 100);
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
    lastBeep.current = -1;
    setTotal(secs);
    setDeadline(Date.now() + secs * 1000);
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
