"use client";

import { EXERCISES } from "@/lib/exercises";
import { IMAGE_KEYS } from "@/lib/exercise-images";
import { useSettings } from "@/lib/use-settings";

export type FrameMode = "auto" | 0 | 1;

/**
 * Start/end position pair for an exercise.
 *
 * The source dataset provides exactly two frames per movement - there is no
 * public-domain set with more - so "auto" crossfades between them and the
 * explicit modes hold one position for a closer look.
 */
export default function ExerciseFigure({
  exKey,
  mode = "auto",
  large = false,
}: {
  exKey: string;
  mode?: FrameMode;
  large?: boolean;
}) {
  const { animateFigures } = useSettings();
  if (!IMAGE_KEYS.has(exKey)) return null;

  const name = EXERCISES[exKey]?.name ?? exKey;
  const animate = mode === "auto" && animateFigures;
  const showSecond = mode === 1;

  return (
    <figure className={`exfig${large ? " large" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/ex/${exKey}-0.webp`} alt={`${name}, start position`} loading="lazy" decoding="async" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={animate ? "b" : "b static"}
        style={animate ? undefined : { opacity: showSecond ? 1 : 0 }}
        src={`/ex/${exKey}-1.webp`}
        alt={`${name}, end position`}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}
