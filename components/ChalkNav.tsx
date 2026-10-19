"use client";

import type { ReactNode } from "react";
import type { View } from "@/lib/navigation";

type Item = { id: View; label: string; also?: View; icon: ReactNode };

const ITEMS: Item[] = [
  {
    id: "plans",
    label: "Plans",
    icon: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 3.5h6v3H9zM8.5 11h7M8.5 15h5" />
      </>
    ),
  },
  {
    id: "week",
    label: "Week",
    icon: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 10h16M9 3v4M15 3v4" />
      </>
    ),
  },
  { id: "progressions", label: "Ladders", icon: <path d="M8 3v18M16 3v18M8 7.5h8M8 12h8M8 16.5h8" /> },
  {
    id: "library",
    label: "Library",
    also: "saved",
    icon: (
      <path d="M3.5 5.5h6a2.5 2.5 0 0 1 2.5 2.5v12a2 2 0 0 0-2-2H3.5zM20.5 5.5h-6A2.5 2.5 0 0 0 12 8v12a2 2 0 0 1 2-2h6.5z" />
    ),
  },
  {
    id: "history",
    label: "History",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
  },
];

/**
 * Chalk's bottom navigation: five destinations within reach of a thumb,
 * replacing a row of six tabs at the top that ran off the edge of a phone.
 * Directory and Saved share the Library slot.
 *
 * Always rendered, and shown only by the Chalk stylesheet, so the server-
 * rendered page already contains it: the boot script picks the style before
 * first paint and nothing shifts when React takes over.
 */
export default function ChalkNav({ view, onGo }: { view: View; onGo: (view: View) => void }) {
  return (
    <nav className="chalk-nav" aria-label="Sections">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          className="chalk-nav-item"
          aria-current={item.id === view || item.also === view ? "page" : undefined}
          onClick={() => onGo(item.id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {item.icon}
          </svg>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

/** The switch between the two halves of Library, above either one. Chalk only, like the nav. */
export function LibrarySwitch({ view, onGo }: { view: View; onGo: (view: View) => void }) {
  return (
    <div className="seg seg-wide two library-switch" role="group" aria-label="Library">
      <button aria-pressed={view === "library"} onClick={() => onGo("library")}>
        Directory
      </button>
      <button aria-pressed={view === "saved"} onClick={() => onGo("saved")}>
        Saved
      </button>
    </div>
  );
}
