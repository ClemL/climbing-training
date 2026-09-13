"use client";

import { useMemo, useState } from "react";
import { PLANS } from "@/lib/plans";
import { CATEGORIES, type Category, type Plan } from "@/lib/types";

export default function PlanLibrary({ onPick }: { onPick: (plan: Plan) => void }) {
  const [filter, setFilter] = useState<Category | "all">("all");

  const shown = useMemo(() => CATEGORIES.filter((c) => filter === "all" || c.id === filter), [filter]);

  return (
    <>
      <h1>Training day plans</h1>
      <p className="lede">
        Sixteen sessions between 10 and 120 minutes. Pick one, hit start, work the checklist. Loads are yours to
        judge; everything here prescribes reps, rest and intent only.
      </p>

      <div className="tabs" style={{ marginBottom: 6 }}>
        <button className="tab" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          All ({PLANS.length})
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className="tab" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {shown.map((cat) => {
        const plans = PLANS.filter((p) => p.category === cat.id);
        return (
          <div key={cat.id}>
            <div className="cat-head">
              <h2>
                {cat.icon} {cat.label}
              </h2>
              <span className="faint" style={{ fontSize: 12 }}>
                {plans.length} plans
              </span>
            </div>
            <p className="cat-blurb">{cat.blurb}</p>
            <div className="card-grid">
              {plans.map((p) => (
                <button
                  key={p.id}
                  className="plan-card"
                  style={{ ["--cat" as string]: `var(--cat-${p.category})` }}
                  onClick={() => onPick(p)}
                >
                  <div className="row1">
                    <span className="name">{p.name}</span>
                    <div className="spacer" />
                    <span className="pill cat">
                      {p.minutes[0]}-{p.minutes[1]}m
                    </span>
                  </div>
                  <div className="tagline">{p.tagline}</div>
                  <div className="chips">
                    {p.focus.map((f) => (
                      <span key={f} className="chip">
                        {f}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
