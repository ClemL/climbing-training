"use client";

import { clearHistory, formatClock, formatDate, type HistoryEntry } from "@/lib/storage";

export default function HistoryView({ history }: { history: readonly HistoryEntry[] }) {
  const totalMs = history.reduce((n, h) => n + h.durationMs, 0);

  return (
    <>
      <h1>History</h1>
      <p className="lede">
        Stored in this browser only, capped at the last 60 sessions. Clearing site data wipes it, which is fine.
      </p>

      {history.length === 0 ? (
        <div className="empty">No sessions logged yet. Finish one and it lands here.</div>
      ) : (
        <>
          <div className="chips" style={{ marginBottom: 12 }}>
            <span className="pill">{history.length} sessions</span>
            <span className="pill">{formatClock(totalMs)} total</span>
            <span className="pill">{formatClock(Math.round(totalMs / history.length))} average</span>
          </div>
          {history.map((h) => (
            <div key={h.id} className="hist" style={{ ["--cat" as string]: `var(--cat-${h.category})` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="ex-name">{h.planName}</div>
                <div className="when">
                  {formatDate(h.finishedAt)} &middot; {h.checked}/{h.total} checked
                </div>
              </div>
              <div className="mono" style={{ fontWeight: 700 }}>
                {formatClock(h.durationMs)}
              </div>
            </div>
          ))}
          <button
            className="btn danger block"
            style={{ marginTop: 14 }}
            onClick={() => {
              if (window.confirm("Delete all training history from this browser?")) {
                clearHistory();
              }
            }}
          >
            Clear history
          </button>
        </>
      )}
    </>
  );
}
