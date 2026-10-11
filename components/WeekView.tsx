"use client";

import FilterGrid from "./FilterGrid";
import { setFilter } from "@/lib/navigation";
import { PLANS, planById } from "@/lib/plans";
import { useNav } from "@/lib/use-navigation";
import { RULES, TEMPLATES } from "@/lib/week";
import type { Plan } from "@/lib/types";

const OPTIONS = TEMPLATES.map((t) => ({ id: t.id, label: t.name }));

export default function WeekView({ onPick }: { onPick: (plan: Plan) => void }) {
  const nav = useNav();
  const template = TEMPLATES.find((t) => t.id === nav.filter) ?? TEMPLATES[0];

  return (
    <>
      <h1>Week structure</h1>
      <p className="lede">
        {PLANS.length} sessions is a menu, not a plan. These rotations already respect the spacing rules below, which is
        the part that keeps fingers and elbows intact.
      </p>

      <FilterGrid
        label="Week template"
        options={OPTIONS}
        value={template.id}
        onChange={(id) => setFilter(id === TEMPLATES[0].id ? undefined : id)}
        wide
      />

      <p className="cat-blurb">{template.forWho}</p>

      <div className="card-grid" style={{ marginBottom: 8 }}>
        {template.days.map((day) => {
          const plan = day.planId ? planById(day.planId) : undefined;
          if (!plan) {
            return (
              <div key={day.day} className="weekday rest">
                <span className="weekday-name">{day.day}</span>
                <span className="muted">{day.note ?? "Rest"}</span>
              </div>
            );
          }
          return (
            <button
              key={day.day}
              className="weekday"
              style={{ ["--cat" as string]: `var(--cat-${plan.category})` }}
              onClick={() => onPick(plan)}
            >
              <span className="weekday-name">{day.day}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="ex-name">{plan.name}</span>
                <span className="weekday-meta">
                  {plan.minutes[0]}-{plan.minutes[1]} min
                  {plan.stress?.includes("fingers") ? " · loads fingers" : ""}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <h2>Why it is ordered this way</h2>
      {RULES.map((r) => (
        <div key={r.rule} className="rule">
          <div className="rule-head">{r.rule}</div>
          <div className="rule-why">{r.why}</div>
        </div>
      ))}
    </>
  );
}
