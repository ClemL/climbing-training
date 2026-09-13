"use client";

import { useExerciseSheet } from "./ExerciseSheet";
import { EXERCISES } from "@/lib/exercises";
import { IMAGE_KEYS } from "@/lib/exercise-images";
import { recoveryWarnings } from "@/lib/recovery";
import type { HistoryEntry } from "@/lib/storage";
import type { Plan } from "@/lib/types";

const KIND_LABEL: Record<string, string> = {
  superset: "superset",
  circuit: "circuit",
  interval: "intervals",
  straight: "straight sets",
};

export default function PlanPreview({
  plan,
  onStart,
  onBack,
  hasActiveOther,
  history,
}: {
  plan: Plan;
  onStart: () => void;
  onBack: () => void;
  hasActiveOther: boolean;
  history: readonly HistoryEntry[];
}) {
  const total = plan.blocks.reduce((n, b) => n + b.slots.length * b.rounds, 0);
  const warnings = recoveryWarnings(plan, history);
  const { open } = useExerciseSheet();

  return (
    <div style={{ ["--cat" as string]: `var(--cat-${plan.category})` }}>
      <div className="topbar">
        <button className="btn sm ghost" onClick={onBack} aria-label="Back to plans">
          &#8592;
        </button>
        <div className="brand" style={{ fontSize: 14 }}>
          {plan.name}
        </div>
        <div className="spacer" />
        <button className="btn primary sm" onClick={onStart}>
          Start
        </button>
      </div>

      <div className="session-head">
        <h1 style={{ marginTop: 0 }}>{plan.name}</h1>
        <p className="lede" style={{ marginBottom: 10 }}>
          {plan.tagline}
        </p>
        <div className="chips" style={{ marginBottom: 10 }}>
          <span className="pill cat">
            {plan.minutes[0]}-{plan.minutes[1]} min
          </span>
          <span className="pill">{plan.blocks.length} blocks</span>
          <span className="pill">{total} checkpoints</span>
        </div>
        <div className="chips">
          {plan.equipment.map((e) => (
            <span key={e} className="chip">
              {e}
            </span>
          ))}
        </div>
        {hasActiveOther ? (
          <p className="ex-note" style={{ marginTop: 10 }}>
            Starting this will discard the session already in progress.
          </p>
        ) : null}
        <button className="btn primary block" style={{ marginTop: 14, padding: "13px", fontSize: 15 }} onClick={onStart}>
          Start session &amp; clock
        </button>
      </div>

      {warnings.length > 0 ? (
        <div className="warn-box">
          <div className="warn-title">Recovery warning</div>
          <div className="warn-body">
            {warnings.map((w) => (
              <p key={w.stress} style={{ margin: "0 0 4px" }}>
                {w.stress === "fingers" ? "Fingers: " : `${w.stress[0].toUpperCase()}${w.stress.slice(1)}: `}
                {w.lastPlanName} finished {w.hoursAgo === 0 ? "less than an hour" : `${w.hoursAgo}h`} ago.
                {" "}
                {w.stress === "fingers"
                  ? `Give tendons ${w.needHours}h. Run a technique or bodyweight day instead.`
                  : `${w.needHours}h is the usual minimum.`}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {plan.notes?.length ? (
        <div className="notes">
          <ul>
            {plan.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {plan.blocks.map((b) => (
        <section key={b.id} className="block">
          <div className="block-head">
            <div className="block-tag">{b.tag}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="block-title">
                {b.title}
                {KIND_LABEL[b.kind] ? <span className={`kind-badge kind-${b.kind}`}>{KIND_LABEL[b.kind]}</span> : null}
              </div>
              <div className="block-meta">
                {b.rounds > 1 ? `${b.rounds} rounds` : "1 round"}
                {b.rest ? ` · rest ${b.rest}` : ""}
                {` · ~${b.minutes} min`}
              </div>
            </div>
          </div>
          {b.note ? <div className="block-note">{b.note}</div> : null}
          {b.slots.map((s, i) => {
            const ex = EXERCISES[s.ex];
            return (
              <div className="ex" key={`${b.id}-${i}`} style={{ paddingLeft: 13 }}>
                <div className="ex-main" role="presentation" onClick={() => open(s.ex)}>
                  <div className="ex-name">{ex?.name ?? s.ex}</div>
                  <div className="ex-pres">{s.pres}</div>
                  {s.note ? <div className="ex-note">{s.note}</div> : null}
                </div>
                {IMAGE_KEYS.has(s.ex) ? <span className="chip">illustrated</span> : null}
                <button
                  className="info-btn"
                  aria-label={`How to do ${ex?.name ?? s.ex}`}
                  onClick={() => open(s.ex)}
                >
                  ?
                </button>
              </div>
            );
          })}
        </section>
      ))}

      <button className="btn primary block" style={{ marginTop: 8, padding: "13px", fontSize: 15 }} onClick={onStart}>
        Start session &amp; clock
      </button>
    </div>
  );
}
