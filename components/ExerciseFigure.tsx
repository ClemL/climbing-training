"use client";

import { EXERCISES } from "@/lib/exercises";
import { IMAGE_KEYS } from "@/lib/exercise-images";
import { useSettings } from "@/lib/use-settings";

/**
 * Start/end position pair for an exercise, crossfaded.
 *
 * The source dataset provides exactly two frames per movement - there is no
 * public-domain set with more. Animation can be turned off in settings, which
 * holds the start position.
 */
export default function ExerciseFigure({ exKey, large = false }: { exKey: string; large?: boolean }) {
  const { animateFigures } = useSettings();
  if (!IMAGE_KEYS.has(exKey)) return null;

  const name = EXERCISES[exKey]?.name ?? exKey;
  const animate = animateFigures;

  return (
    <figure className={`exfig${large ? " large" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/ex/${exKey}-0.webp`} alt={`${name}, start position`} loading="lazy" decoding="async" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={animate ? "b" : "b static"}
        src={`/ex/${exKey}-1.webp`}
        alt={`${name}, end position`}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}
