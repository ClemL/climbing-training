"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useBeep, useTick } from "@/lib/hooks";
import type { IntervalSpec } from "@/lib/types";
import { formatClock } from "@/lib/storage";

type Phase = "ready" | "work" | "rest" | "setrest";

type Segment = {
  phase: Phase;
  rep: number;
  set: number;
  /** Wall-clock ms. */
  start: number;
  end: number;
};

const LEAD_IN_SECONDS = 5;

/**
 * Expands a spec into the full wall-clock schedule up front. Nothing mutates
 * as the timer runs: the current segment is derived from the clock, so a
 * throttled background tab or a locked screen cannot desynchronize it, and a
 * hangboard set resumes at the right rep when you look back at the phone.
 */
function buildTimeline(spec: IntervalSpec, t0: number): Segment[] {
  const segs: Segment[] = [];
  let t = t0;
  const push = (phase: Phase, seconds: number, rep: number, set: number) => {
    if (seconds <= 0) return;
    segs.push({ phase, rep, set, start: t, end: t + seconds * 1000 });
    t += seconds * 1000;
  };

  push("ready", LEAD_IN_SECONDS, 1, 1);
  for (let set = 1; set <= spec.sets; set++) {
    for (let rep = 1; rep <= spec.reps; rep++) {
      push("work", spec.work, rep, set);
      if (rep < spec.reps) push("rest", spec.rest, rep, set);
    }
    if (set < spec.sets) push("setrest", spec.setRest, spec.reps, set);
  }
  return segs;
}

export default function IntervalTimer({ spec }: { spec: IntervalSpec }) {
  const [timeline, setTimeline] = useState<Segment[] | null>(null);
  const beep = useBeep();
  const lastSegment = useRef<number>(-1);
  const lastTick = useRef<number>(-1);

  const now = useTick(timeline !== null, 100);
  const finishesAt = timeline ? timeline[timeline.length - 1].end : 0;
  const running = timeline !== null && now < finishesAt;
  const done = timeline !== null && now >= finishesAt;

  const index = useMemo(() => {
    if (!timeline || !running) return -1;
    return timeline.findIndex((s) => now < s.end);
  }, [timeline, now, running]);

  const current = index >= 0 ? timeline![index] : null;
  const remainMs = current ? Math.max(0, current.end - now) : 0;
  const remainSec = Math.ceil(remainMs / 1000);

  // Audio only; the schedule itself never changes here.
  useEffect(() => {
    if (!timeline) return;
    if (done) {
      if (lastSegment.current !== -2) {
        lastSegment.current = -2;
        beep("done");
      }
      return;
    }
    if (index >= 0 && index !== lastSegment.current) {
      lastSegment.current = index;
      lastTick.current = -1;
      const phase = timeline[index].phase;
      if (phase === "work") beep("go");
      else if (phase === "rest" || phase === "setrest") beep("stop");
    }
    if (remainSec > 0 && remainSec <= 3 && lastTick.current !== remainSec) {
      lastTick.current = remainSec;
      beep("tick");
    }
  }, [index, done, remainSec, timeline, beep]);

  const start = () => {
    lastSegment.current = -1;
    lastTick.current = -1;
    setTimeline(buildTimeline(spec, Date.now()));
  };

  /** Ends the current segment now and pulls everything after it forward. */
  const skip = () => {
    if (!timeline || !current) return;
    const delta = current.end - Date.now();
    setTimeline(timeline.map((s) => (s.end <= current.start ? s : { ...s, start: s.start - delta, end: s.end - delta })));
    lastTick.current = -1;
  };

  const label: Record<Phase, string> = {
    ready: "Get ready",
    work: spec.work >= 20 ? "Work" : "Hang",
    rest: "Rest",
    setrest: "Set rest",
  };

  const phaseClass = current?.phase === "work" ? "work" : current ? "rest" : "";

  return (
    <div className="interval-panel">
      <div className={`interval-phase ${phaseClass}`}>
        {current ? label[current.phase] : done ? "Complete" : "Interval timer"}
      </div>
      <div className="interval-count mono">
        {current ? formatClock(remainMs) : done ? "✓" : `${spec.work}s / ${spec.rest}s`}
      </div>
      <div className="interval-sub">
        {spec.reps > 1 ? `Rep ${current?.rep ?? 1} of ${spec.reps} · ` : ""}
        Set {current?.set ?? 1} of {spec.sets}
        {" · "}
        {spec.work}s on{spec.rest > 0 ? ` / ${spec.rest}s off` : ""}
        {" · "}
        {spec.setRest}s between sets
      </div>
      <div className="interval-controls">
        {running ? (
          <>
            <button className="btn sm" onClick={skip}>
              Skip phase
            </button>
            <button className="btn sm danger" onClick={() => setTimeline(null)}>
              Stop
            </button>
          </>
        ) : (
          <button className="btn primary sm" onClick={start}>
            {done ? "Run again" : "Start intervals"}
          </button>
        )}
      </div>
    </div>
  );
}
