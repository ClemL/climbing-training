"use client";

import { useEffect, useRef, useState } from "react";
import { useBeep, useTick } from "@/lib/hooks";
import { formatClock } from "@/lib/storage";

const PRESETS = [30, 60, 90, 120, 180];

export default function RestTimer({ suggestion }: { suggestion?: number }) {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const beep = useBeep();
  const lastBeep = useRef<number>(-1);

  const running = deadline !== null;
  const now = useTick(running, 100);
  const remainMs = deadline === null ? 0 : Math.max(0, deadline - now);
  const remainSec = Math.ceil(remainMs / 1000);

  useEffect(() => {
    if (deadline === null) return;
    if (remainSec <= 3 && remainSec > 0 && lastBeep.current !== remainSec) {
      lastBeep.current = remainSec;
      beep("tick");
    }
    if (remainMs === 0) {
      beep("done");
      setDeadline(null);
      lastBeep.current = -1;
    }
  }, [remainSec, remainMs, deadline, beep]);

  const start = (secs: number) => {
    lastBeep.current = -1;
    setTotal(secs);
    setDeadline(Date.now() + secs * 1000);
  };

  const presets = suggestion && !PRESETS.includes(suggestion) ? [suggestion, ...PRESETS].sort((a, b) => a - b) : PRESETS;

  return (
    <div className="timerbar">
      <div className="timerbar-inner">
        <div className={`rest-display mono${running ? " active" : ""}`}>{running ? formatClock(remainMs) : "Rest"}</div>
        {running ? (
          <div className="quick">
            <button className="btn sm" onClick={() => setDeadline((d) => (d ?? Date.now()) + 30_000)}>
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
