"use client";

import { useEffect, useRef, useState } from "react";
import { useBeep, useTick } from "@/lib/hooks";
import type { IntervalSpec } from "@/lib/types";
import { formatClock } from "@/lib/storage";

type Phase = "idle" | "ready" | "work" | "rest" | "setrest" | "done";

/**
 * Work/rest interval timer. Covers hangboard repeaters (7s on / 3s off x 6)
 * and timed circuits (40s on / 20s off) from the same spec.
 */
export default function IntervalTimer({ spec }: { spec: IntervalSpec }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [rep, setRep] = useState(1);
  const [set, setSet] = useState(1);
  const [endsAt, setEndsAt] = useState(0);
  const beep = useBeep();
  const lastBeep = useRef(-1);

  const active = phase !== "idle" && phase !== "done";
  const now = useTick(active, 100);
  const remainMs = active ? Math.max(0, endsAt - now) : 0;
  const remainSec = Math.ceil(remainMs / 1000);

  const go = (next: Phase, secs: number) => {
    lastBeep.current = -1;
    setPhase(next);
    setEndsAt(Date.now() + secs * 1000);
  };

  const reset = () => {
    setPhase("idle");
    setRep(1);
    setSet(1);
  };

  // Countdown chirps on the last 3 seconds of every phase.
  useEffect(() => {
    if (!active) return;
    if (remainSec <= 3 && remainSec > 0 && lastBeep.current !== remainSec) {
      lastBeep.current = remainSec;
      beep("tick");
    }
  }, [remainSec, active, beep]);

  // Phase transitions.
  useEffect(() => {
    if (!active || remainMs > 0) return;

    if (phase === "ready") {
      beep("go");
      go("work", spec.work);
      return;
    }
    if (phase === "work") {
      const lastRep = rep >= spec.reps;
      if (!lastRep && spec.rest > 0) {
        beep("stop");
        setRep(rep + 1);
        go("rest", spec.rest);
        return;
      }
      if (!lastRep) {
        beep("go");
        setRep(rep + 1);
        go("work", spec.work);
        return;
      }
      if (set >= spec.sets) {
        beep("done");
        setPhase("done");
        return;
      }
      beep("done");
      setRep(1);
      setSet(set + 1);
      go("setrest", spec.setRest);
      return;
    }
    if (phase === "rest") {
      beep("go");
      go("work", spec.work);
      return;
    }
    if (phase === "setrest") {
      beep("go");
      go("work", spec.work);
    }
  }, [remainMs, phase, rep, set, spec, active, beep]);

  const label: Record<Phase, string> = {
    idle: "Interval timer",
    ready: "Get ready",
    work: spec.work >= 20 ? "Work" : "Hang",
    rest: "Rest",
    setrest: "Set rest",
    done: "Complete",
  };

  return (
    <div className="interval-panel">
      <div className={`interval-phase ${phase === "work" ? "work" : phase === "rest" || phase === "setrest" ? "rest" : ""}`}>
        {label[phase]}
      </div>
      <div className="interval-count mono">
        {phase === "idle" ? `${spec.work}s / ${spec.rest}s` : phase === "done" ? "✓" : formatClock(remainMs)}
      </div>
      <div className="interval-sub">
        {spec.reps > 1 ? `Rep ${rep} of ${spec.reps} · ` : ""}Set {set} of {spec.sets}
        {" · "}
        {spec.work}s on{spec.rest > 0 ? ` / ${spec.rest}s off` : ""}
        {" · "}
        {spec.setRest}s between sets
      </div>
      <div className="interval-controls">
        {phase === "idle" || phase === "done" ? (
          <button
            className="btn primary sm"
            onClick={() => {
              setRep(1);
              if (phase === "done") setSet(1);
              go("ready", 5);
            }}
          >
            {phase === "done" ? "Run again" : "Start intervals"}
          </button>
        ) : (
          <>
            <button
              className="btn sm"
              onClick={() => {
                // Skip to the end of the current phase.
                setEndsAt(Date.now());
              }}
            >
              Skip phase
            </button>
            <button className="btn sm danger" onClick={reset}>
              Stop
            </button>
          </>
        )}
      </div>
    </div>
  );
}
