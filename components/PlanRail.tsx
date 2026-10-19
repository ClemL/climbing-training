"use client";

import { navigate } from "@/lib/navigation";
import { PLANS } from "@/lib/plans";
import { CATEGORIES } from "@/lib/types";

/**
 * Compact plan list shown beside a plan's detail on wide screens. Hidden by
 * CSS below 1100px, where the detail takes the whole screen.
 */
export default function PlanRail({ currentId }: { currentId: string }) {
  // Replace rather than push: back still returns to wherever the detail was opened from.
  const pick = (id: string) => {
    navigate({ view: "preview", planId: id }, { replace: true });
    window.scrollTo({ top: 0 });
  };

  return (
    <nav className="rail" aria-label="All plans">
      {CATEGORIES.map((cat) => {
        const plans = PLANS.filter((p) => p.category === cat.id);
        if (!plans.length) return null;
        return (
          <div key={cat.id}>
            <div className="rail-head">{cat.label}</div>
            {plans.map((p) => (
              <button
                key={p.id}
                className="rail-item"
                aria-current={p.id === currentId}
                style={{ ["--cat" as string]: `var(--cat-${p.category})` }}
                onClick={() => pick(p.id)}
              >
                <span className="bar" />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="rail-name truncate">{p.name}</span>
                  <span className="rail-focus truncate">{p.focus.join(" · ")}</span>
                </span>
                <span className="mono faint" style={{ fontSize: 12.5 }}>
                  {p.minutes[0]}-{p.minutes[1]}
                </span>
              </button>
            ))}
          </div>
        );
      })}
    </nav>
  );
}
