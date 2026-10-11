"use client";

import { useEffect, useRef, useState } from "react";

export type FilterOption = {
  id: string;
  label: string;
  count?: number;
  icon?: string;
  /** Accent for the selected state, usually a category color token. */
  color?: string;
};

/**
 * Every option visible at once, wrapped into a grid, instead of a sideways-
 * scrolling chip row. On a phone the row hid most of its options off-screen
 * with no scrollbar to say they were there, and a sideways swipe across small
 * targets kept landing as a tap. A grid costs a few rows of height and makes
 * every choice one tap from where you already are.
 *
 * `floating` adds a pill that appears once the grid has scrolled away, for the
 * long lists where scrolling back up to change the filter is the slow part.
 */
export default function FilterGrid({
  label,
  options,
  value,
  onChange,
  wide = false,
  floating = false,
}: {
  label: string;
  options: readonly FilterOption[];
  value: string;
  onChange: (id: string) => void;
  /** Two columns on a phone instead of three, for long option names. */
  wide?: boolean;
  floating?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [away, setAway] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!floating || !el || typeof IntersectionObserver === "undefined") return;
    // The sticky top bar covers the top of the viewport, so the grid counts as
    // gone once it slides under the bar, not once it leaves the screen.
    const io = new IntersectionObserver(
      ([entry]) => setAway(!entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0)),
      { rootMargin: "-100px 0px 0px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [floating]);

  const current = options.find((o) => o.id === value) ?? options[0];

  return (
    <>
      <div ref={ref} className={wide ? "filter-grid wide" : "filter-grid"} role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.id}
            className="filter-opt"
            aria-pressed={o.id === value}
            style={o.color ? { ["--opt" as string]: o.color } : undefined}
            onClick={() => onChange(o.id)}
          >
            {o.icon ? (
              <span className="fo-icon" aria-hidden="true">
                {o.icon}
              </span>
            ) : null}
            <span className="fo-label">{o.label}</span>
            {o.count !== undefined ? <span className="fo-count">{o.count}</span> : null}
          </button>
        ))}
      </div>

      {floating && away && current ? (
        <button
          className="filter-fab"
          style={current.color ? { ["--opt" as string]: current.color } : undefined}
          onClick={() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          aria-label={`${label}: ${current.label}. Change`}
        >
          {current.icon ? <span aria-hidden="true">{current.icon}</span> : null}
          <span>{current.label}</span>
          <span className="filter-fab-change">Change</span>
        </button>
      ) : null}
    </>
  );
}
