"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import ExerciseIndex from "@/components/ExerciseIndex";
import HistoryView from "@/components/HistoryView";
import PlanLibrary from "@/components/PlanLibrary";
import PlanPreview from "@/components/PlanPreview";
import SettingsView from "@/components/SettingsView";
import WeekView from "@/components/WeekView";
import SessionView from "@/components/SessionView";
import { planById, PLANS } from "@/lib/plans";
import {
  clearActive,
  elapsedMs,
  formatClock,
  getActiveServerSnapshot,
  getActiveSnapshot,
  getHistoryServerSnapshot,
  getHistorySnapshot,
  pushHistory,
  saveActive,
  subscribe,
  type ActiveSession,
  type HistoryEntry,
} from "@/lib/storage";
import type { Plan } from "@/lib/types";

type View = "plans" | "preview" | "session" | "history" | "library" | "week" | "settings";

export default function Home() {
  const [view, setView] = useState<View>("plans");
  const [previewId, setPreviewId] = useState<string | null>(null);
  // localStorage is the source of truth; the server snapshot is the empty case,
  // so hydration matches without an after-mount effect or a readiness flag.
  const active = useSyncExternalStore(subscribe, getActiveSnapshot, getActiveServerSnapshot);
  const history = useSyncExternalStore(subscribe, getHistorySnapshot, getHistoryServerSnapshot);

  const update = useCallback((next: ActiveSession) => {
    saveActive(next);
  }, []);

  const start = useCallback((plan: Plan) => {
    const startedAt = Date.now();
    saveActive({
      planId: plan.id,
      startedAt,
      accumulatedMs: 0,
      running: true,
      resumedAt: startedAt,
      done: {},
    });
    setView("session");
    window.scrollTo({ top: 0 });
  }, []);

  const finish = useCallback(() => {
    if (!active) return;
    const plan = planById(active.planId);
    if (!plan) return;
    const total = plan.blocks.reduce((n, b) => n + b.slots.length * b.rounds, 0);
    const entry: HistoryEntry = {
      id: `${active.planId}-${active.startedAt}`,
      planId: plan.id,
      planName: plan.name,
      category: plan.category,
      finishedAt: Date.now(),
      durationMs: elapsedMs(active),
      checked: Object.keys(active.done).length,
      total,
    };
    pushHistory(entry);
    clearActive();
    setView("history");
    window.scrollTo({ top: 0 });
  }, [active]);

  const openPreview = useCallback((p: Plan) => {
    setPreviewId(p.id);
    setView("preview");
    window.scrollTo({ top: 0 });
  }, []);

  const discard = useCallback(() => {
    if (!window.confirm("Discard the session in progress?")) return;
    clearActive();
    setView("plans");
  }, []);

  const activePlan = active ? planById(active.planId) : undefined;
  const previewPlan = previewId ? planById(previewId) : undefined;

  if (view === "session" && active && activePlan) {
    return (
      <SessionView
        plan={activePlan}
        session={active}
        onChange={update}
        onFinish={finish}
        onExit={() => {
          setView("plans");
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  if (view === "preview" && previewPlan) {
    return (
      <PlanPreview
        plan={previewPlan}
        hasActiveOther={!!active && active.planId !== previewPlan.id}
        history={history}
        onBack={() => setView("plans")}
        onStart={() => start(previewPlan)}
      />
    );
  }

  return (
    <>
      <div className="topbar stacked">
        <div className="topbar-row">
          <div className="brand">
            <span>&#129506;</span>
            <span>
              Training Days
              <small>{PLANS.length} plans &middot; local only</small>
            </span>
          </div>
          <div className="spacer" />
          <button
            className="icon-btn"
            aria-pressed={view === "settings"}
            aria-label="Settings"
            onClick={() => setView(view === "settings" ? "plans" : "settings")}
          >
            &#9881;
          </button>
        </div>
        <div className="tabs">
          <button className="tab" aria-pressed={view === "plans"} onClick={() => setView("plans")}>
            Plans
          </button>
          <button className="tab" aria-pressed={view === "week"} onClick={() => setView("week")}>
            Week
          </button>
          <button className="tab" aria-pressed={view === "library"} onClick={() => setView("library")}>
            Exercises
          </button>
          <button className="tab" aria-pressed={view === "history"} onClick={() => setView("history")}>
            History
          </button>
        </div>
      </div>

      {active && activePlan ? (
        <div className="resume">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="t">{activePlan.name} in progress</div>
            <div className="when faint" style={{ fontSize: 12 }}>
              {formatClock(elapsedMs(active))} elapsed &middot; {Object.keys(active.done).length} checked
              {active.running ? "" : " · paused"}
            </div>
          </div>
          <button className="btn good sm" onClick={() => setView("session")}>
            Resume
          </button>
          <button className="btn sm danger" onClick={discard} aria-label="Discard session">
            &#10005;
          </button>
        </div>
      ) : null}

      {view === "plans" ? <PlanLibrary onPick={openPreview} /> : null}
      {view === "week" ? <WeekView onPick={openPreview} /> : null}
      {view === "library" ? <ExerciseIndex /> : null}
      {view === "settings" ? <SettingsView /> : null}
      {view === "history" ? <HistoryView history={history} /> : null}

      <p className="footer">
        Everything lives in this browser&apos;s localStorage. No account, no sync, no server.
        <br />
        Loads are yours to pick. Stop any finger work that produces sharp or localized pain.
      </p>
    </>
  );
}
