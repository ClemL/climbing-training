"use client";

import { EXERCISES } from "@/lib/exercises";
import { IMAGE_KEYS } from "@/lib/exercise-images";
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
}: {
  plan: Plan;
  onStart: () => void;
  onBack: () => void;
  hasActiveOther: boolean;
}) {
  const total = plan.blocks.reduce((n, b) => n + b.slots.length * b.rounds, 0);

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
                <div className="ex-main">
                  <div className="ex-name">{ex?.name ?? s.ex}</div>
                  <div className="ex-pres">{s.pres}</div>
                  {s.note ? <div className="ex-note">{s.note}</div> : null}
                </div>
                {IMAGE_KEYS.has(s.ex) ? (
                  <span className="info-btn" aria-label="Has illustration" title="Illustrated">
                    &#9635;
                  </span>
                ) : null}
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
