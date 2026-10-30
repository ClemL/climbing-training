"use client";

import { useEffect, type ReactNode } from "react";

/**
 * The bottom sheet both overlays use: the exercise detail and the changelog.
 * Mounted only while open. Escape and a tap on the backdrop call onClose, and
 * the page behind it stops scrolling until it closes.
 */
export default function Sheet({
  label,
  onClose,
  children,
}: {
  /** Accessible name of the dialog. */
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="sheet-backdrop"
      role="presentation"
      onClick={(e) => {
        // Only a tap on the backdrop itself closes. A click that started inside
        // the panel - selecting text, a tap on a list line - bubbles up here too.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet" role="dialog" aria-modal="true" aria-label={label}>
        {children}
      </div>
    </div>
  );
}
