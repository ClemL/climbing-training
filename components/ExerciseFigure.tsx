"use client";

import { EXERCISES } from "@/lib/exercises";
import { IMAGE_KEYS } from "@/lib/exercise-images";

/**
 * Two-frame exercise animation. The dataset gives a start and end position;
 * crossfading them reads like a GIF at ~22 KB a pair, and works offline.
 */
export default function ExerciseFigure({ exKey }: { exKey: string }) {
  if (!IMAGE_KEYS.has(exKey)) return null;
  const name = EXERCISES[exKey]?.name ?? exKey;
  return (
    <figure className="exfig">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/ex/${exKey}-0.webp`} alt={`${name}, start position`} loading="lazy" decoding="async" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="b" src={`/ex/${exKey}-1.webp`} alt={`${name}, end position`} loading="lazy" decoding="async" />
    </figure>
  );
}
