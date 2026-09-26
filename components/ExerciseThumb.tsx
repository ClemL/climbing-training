"use client";

import { EXERCISES } from "@/lib/exercises";
import { IMAGE_KEYS } from "@/lib/exercise-images";

/**
 * Small static start-position frame. Deliberately not animated: a ladder shows
 * six or seven of these at once, and six looping animations is noise.
 */
export default function ExerciseThumb({ exKey, size = 44 }: { exKey: string; size?: number }) {
  const name = EXERCISES[exKey]?.name ?? exKey;

  if (!IMAGE_KEYS.has(exKey)) {
    return (
      <span className="thumb thumb-blank" style={{ width: size, height: size }} aria-hidden="true">
        {name.slice(0, 1)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="thumb"
      style={{ width: size, height: size }}
      src={`/ex/${exKey}-0.webp`}
      alt=""
      loading="lazy"
      decoding="async"
    />
  );
}
