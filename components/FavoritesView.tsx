"use client";

import { openExercise } from "./ExerciseSheet";
import { EXERCISES } from "@/lib/exercises";
import { IMAGE_KEYS } from "@/lib/exercise-images";
import { clearFavorites, removeFavorite } from "@/lib/favorites";
import { useFavorites } from "@/lib/use-favorites";

export default function FavoritesView() {
  const favorites = useFavorites();
  const known = favorites.filter((k) => EXERCISES[k]);

  if (known.length === 0) {
    return (
      <>
        <h1>Saved exercises</h1>
        <p className="lede">Things you flagged to come back to.</p>
        <div className="empty">
          Nothing saved yet. Open any exercise and tap the star to add it here.
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Saved exercises</h1>
      <p className="lede">
        Newest first. Tap one to read the cues again, or remove it once you have worked it into a session.
      </p>
      <div className="chips" style={{ marginBottom: 12 }}>
        <span className="pill">{known.length} saved</span>
      </div>

      {known.map((key) => {
        const ex = EXERCISES[key];
        return (
          <div key={key} className="lib-item">
            <div className="lib-head">
              <button
                style={{ flex: 1, minWidth: 0, textAlign: "left" }}
                onClick={() => openExercise(key)}
                aria-label={`Open ${ex.name}`}
              >
                <div className="ex-name">{ex.name}</div>
                <div className="ex-pres">{ex.target}</div>
              </button>
              {IMAGE_KEYS.has(key) ? <span className="chip">illustrated</span> : null}
              <button
                className="info-btn danger-btn"
                aria-label={`Remove ${ex.name} from saved`}
                onClick={() => removeFavorite(key)}
              >
                &#10005;
              </button>
            </div>
          </div>
        );
      })}

      <button
        className="btn danger block"
        style={{ marginTop: 14 }}
        onClick={() => {
          if (window.confirm(`Remove all ${known.length} saved exercises?`)) clearFavorites();
        }}
      >
        Clear all saved
      </button>
    </>
  );
}
