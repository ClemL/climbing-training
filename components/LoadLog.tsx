"use client";

import { useState, useSyncExternalStore } from "react";
import {
  getLoadsServerSnapshot,
  getLoadsSnapshot,
  loadKey,
  recordLoad,
  subscribe,
  formatDate,
} from "@/lib/storage";
import { useSettings } from "@/lib/use-settings";

/**
 * Added-weight entry for hangboard blocks. The previous value is prefilled,
 * because the useful question at the board is "what did I hang last time".
 */
export default function LoadLog({ planId, blockId }: { planId: string; blockId: string }) {
  const { unit } = useSettings();
  const loads = useSyncExternalStore(subscribe, getLoadsSnapshot, getLoadsServerSnapshot);
  const history = loads[loadKey(planId, blockId)] ?? [];
  const last = history[0];
  const [draft, setDraft] = useState<string>("");

  const value = draft === "" ? (last ? String(last.value) : "") : draft;
  const parsed = Number(value);
  const valid = value.trim() !== "" && Number.isFinite(parsed);

  return (
    <div className="loadlog">
      <label className="loadlog-label" htmlFor={`load-${blockId}`}>
        Added weight
      </label>
      <div className="loadlog-row">
        <input
          id={`load-${blockId}`}
          className="loadlog-input mono"
          type="number"
          inputMode="decimal"
          step="2.5"
          placeholder="0"
          value={value}
          onChange={(e) => setDraft(e.target.value)}
        />
        <span className="faint" style={{ fontSize: 13 }}>
          {unit}
        </span>
        <button
          className="btn sm primary"
          disabled={!valid}
          onClick={() => {
            if (!valid) return;
            recordLoad(planId, blockId, parsed);
            setDraft("");
          }}
        >
          Log
        </button>
      </div>
      {history.length > 0 ? (
        <div className="loadlog-hist mono">
          {history.slice(0, 4).map((h) => (
            <span key={h.at}>
              {h.value > 0 ? `+${h.value}` : h.value} &middot; {formatDate(h.at)}
            </span>
          ))}
        </div>
      ) : (
        <div className="loadlog-hist faint">Nothing logged yet. Bodyweight is 0.</div>
      )}
    </div>
  );
}
