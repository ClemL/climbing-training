"use client";

import FilterGrid, { type FilterOption } from "./FilterGrid";
import KneeCheckIn from "./KneeCheckIn";
import { setFilter } from "@/lib/navigation";
import { PLANS } from "@/lib/plans";
import { useNav } from "@/lib/use-navigation";
import { CATEGORIES, type Plan } from "@/lib/types";

const SHORTEST = Math.min(...PLANS.map((p) => p.minutes[0]));
const LONGEST = Math.max(...PLANS.map((p) => p.minutes[1]));

const OPTIONS: FilterOption[] = [
  { id: "all", label: "All", count: PLANS.length },
  ...CATEGORIES.map((c) => ({
    id: c.id,
    label: c.short,
    icon: c.icon,
    count: PLANS.filter((p) => p.category === c.id).length,
    color: `var(--cat-${c.id})`,
  })),
];

export default function PlanLibrary({ onPick }: { onPick: (plan: Plan) => void }) {
  const nav = useNav();
  const filter = nav.filter && CATEGORIES.some((c) => c.id === nav.filter) ? nav.filter : "all";
  const shown = CATEGORIES.filter((c) => filter === "all" || c.id === filter);

  return (
    <>
      <h1>Training day plans</h1>
      <p className="lede">
        {PLANS.length} sessions between {SHORTEST} and {LONGEST} minutes. Pick one, hit start, work the checklist.
        Loads are yours to judge; everything here prescribes reps, rest and intent only.
      </p>

      <FilterGrid
        label="Plan category"
        options={OPTIONS}
        value={filter}
        onChange={(id) => setFilter(id === "all" ? undefined : id)}
        floating
      />

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
            {cat.id === "knee" ? <KneeCheckIn /> : null}
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
