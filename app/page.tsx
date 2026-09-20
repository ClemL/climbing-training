"use client";

import { useCallback, useSyncExternalStore } from "react";
import ExerciseIndex from "@/components/ExerciseIndex";
import FavoritesView from "@/components/FavoritesView";
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
import { navigate, type View } from "@/lib/navigation";
import { useNav } from "@/lib/use-navigation";
import type { Plan } from "@/lib/types";

export default function Home() {
  // The URL owns which view is showing, so the hardware back button walks back
  // through the app instead of leaving it.
  const nav = useNav();
  const view = nav.view;
  const previewId = nav.planId ?? null;

  const setView = useCallback((next: View) => {
    navigate({ view: next });
    window.scrollTo({ top: 0 });
  }, []);

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
    navigate({ view: "session" });
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
    navigate({ view: "history" });
    window.scrollTo({ top: 0 });
  }, [active]);

  const openPreview = useCallback((p: Plan) => {
    navigate({ view: "preview", planId: p.id });
    window.scrollTo({ top: 0 });
  }, []);

  const discard = useCallback(() => {
    if (!window.confirm("Discard the session in progress?")) return;
    clearActive();
    navigate({ view: "plans" });
  }, []);

  const activePlan = active ? planById(active.planId) : undefined;
  const previewPlan = previewId ? planById(previewId) : undefined;

  // A URL can name a view that no longer has anything to show - going back to
  // v=session after finishing, or a stale plan id in a bookmark. Both fall back
  // to the plan list rather than rendering an empty shell.
  const shellView: View = view === "session" || view === "preview" ? "plans" : view;

  if (view === "session" && active && activePlan) {
    return (
      <SessionView
        plan={activePlan}
        session={active}
        onChange={update}
        onFinish={finish}
        onExit={() => setView("plans")}
      />
    );
  }

  if (view === "preview" && previewPlan) {
    return (
      <PlanPreview
        plan={previewPlan}
        hasActiveOther={!!active && active.planId !== previewPlan.id}
        history={history}
        onBack={() => window.history.back()}
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
            aria-pressed={shellView === "settings"}
            aria-label="Settings"
            onClick={() => setView(shellView === "settings" ? "plans" : "settings")}
          >
            &#9881;
          </button>
        </div>
        <div className="tabs">
          <button className="tab" aria-pressed={shellView === "plans"} onClick={() => setView("plans")}>
            Plans
          </button>
          <button className="tab" aria-pressed={shellView === "week"} onClick={() => setView("week")}>
            Week
          </button>
          <button className="tab" aria-pressed={shellView === "saved"} onClick={() => setView("saved")}>
            Saved
          </button>
          <button className="tab" aria-pressed={shellView === "library"} onClick={() => setView("library")}>
            Exercises
          </button>
          <button className="tab" aria-pressed={shellView === "history"} onClick={() => setView("history")}>
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

      {shellView === "plans" ? <PlanLibrary onPick={openPreview} /> : null}
      {shellView === "week" ? <WeekView onPick={openPreview} /> : null}
      {shellView === "saved" ? <FavoritesView /> : null}
      {shellView === "library" ? <ExerciseIndex /> : null}
      {shellView === "settings" ? <SettingsView /> : null}
      {shellView === "history" ? <HistoryView history={history} /> : null}

      <p className="footer">
        Everything lives in this browser&apos;s localStorage. No account, no sync, no server.
        <br />
        Loads are yours to pick. Stop any finger work that produces sharp or localized pain.
      </p>
    </>
  );
}
