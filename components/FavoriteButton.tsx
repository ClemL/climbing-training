"use client";

import { toggleFavorite } from "@/lib/favorites";
import { useFavorites } from "@/lib/use-favorites";
import { EXERCISES } from "@/lib/exercises";

export default function FavoriteButton({ exKey, className = "star" }: { exKey: string; className?: string }) {
  const favorites = useFavorites();
  const on = favorites.includes(exKey);
  const name = EXERCISES[exKey]?.name ?? exKey;

  return (
    <button
      className={className}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from saved` : `Save ${name} to try again`}
      title={on ? "Saved" : "Save to try again"}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(exKey);
      }}
    >
      {on ? "★" : "☆"}
    </button>
  );
}
