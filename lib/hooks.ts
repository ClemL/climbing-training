"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Current wall-clock time, refreshed on an interval while `on`.
 *
 * The value comes from state rather than a `Date.now()` call during render, so
 * a component rendering twice in one commit sees one consistent timestamp.
 * Everything downstream derives from wall-clock deadlines, which means a
 * backgrounded tab - where browsers throttle timers to about once a minute -
 * shows the correct time the moment it is foregrounded again.
 */
export function useTick(on: boolean, intervalMs = 250): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!on) return;
    const t = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(t);
  }, [on, intervalMs]);
  return now;
}

/**
 * Short synthesized beep. WebAudio avoids shipping audio files and works
 * once the user has interacted with the page, which a Start button guarantees.
 */
export function useBeep() {
  const ctxRef = useRef<AudioContext | null>(null);

  const beep = useCallback((freq = 880, ms = 140, gain = 0.18) => {
    try {
      type WithLegacy = typeof window & { webkitAudioContext?: typeof AudioContext };
      const Ctor = window.AudioContext ?? (window as WithLegacy).webkitAudioContext;
      if (!Ctor) return;
      ctxRef.current ??= new Ctor();
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator();
      const vol = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      vol.gain.setValueAtTime(gain, ctx.currentTime);
      vol.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms / 1000);
      osc.connect(vol).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + ms / 1000);
    } catch {
      /* audio blocked; timers still work visually */
    }
  }, []);

  const pattern = useCallback(
    (kind: "tick" | "go" | "stop" | "done") => {
      if (kind === "tick") beep(660, 90, 0.12);
      else if (kind === "go") beep(1040, 160);
      else if (kind === "stop") beep(520, 200);
      else {
        beep(880, 130);
        window.setTimeout(() => beep(1175, 200), 160);
      }
    },
    [beep],
  );

  return pattern;
}

type WakeLockSentinelLike = { release: () => Promise<void> };

/** Keeps the phone screen awake while a session is running. Silently no-ops where unsupported. */
export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    let sentinel: WakeLockSentinelLike | null = null;
    let cancelled = false;

    const request = async () => {
      try {
        const nav = navigator as Navigator & {
          wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinelLike> };
        };
        if (!nav.wakeLock) return;
        const s = await nav.wakeLock.request("screen");
        if (cancelled) void s.release();
        else sentinel = s;
      } catch {
        /* denied or unsupported */
      }
    };

    void request();
    const onVisible = () => {
      if (document.visibilityState === "visible") void request();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      if (sentinel) void sentinel.release().catch(() => undefined);
    };
  }, [active]);
}
