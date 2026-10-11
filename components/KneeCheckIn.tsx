"use client";

import { useState } from "react";
import { dayKey, kneeVerdict, logCheckIn, PAIN_CEILING, removeCheckIn, type KneeCheckIn as Entry } from "@/lib/knee";
import { useKneeLog } from "@/lib/use-knee";

const SHOWN = 7;

function painTone(v: number): string {
  if (v <= PAIN_CEILING) return "var(--good)";
  if (v <= 5) return "var(--warn)";
  return "var(--danger)";
}

function shortDate(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function PainSlider({ label, hint, value, onChange }: { label: string; hint: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="pain-row">
      <span className="pain-head">
        <span>
          <span className="pain-label">{label}</span>
          <span className="pain-hint">{hint}</span>
        </span>
        <span className="pain-value mono" style={{ color: painTone(value) }}>
          {value}
          <small>/10</small>
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ accentColor: painTone(value) }}
      />
    </label>
  );
}

/**
 * Morning check-in for the knee plans: two 0-10 readings, and the
 * progress / hold / step-back call the pain-monitoring rule makes from them.
 */
export default function KneeCheckIn() {
  const entries = useKneeLog();
  const [open, setOpen] = useState(false);
  // Untouched sliders show the latest entry, so re-opening today's check-in edits it.
  const [morning, setMorning] = useState<number | null>(null);
  const [session, setSession] = useState<number | null>(null);

  const verdict = kneeVerdict(entries);
  const latest: Entry | undefined = entries[0];
  const m = morning ?? latest?.morning ?? 0;
  const s = session ?? latest?.session ?? 0;

  const save = () => {
    logCheckIn({ day: dayKey(), morning: m, session: s });
    setMorning(null);
    setSession(null);
    setOpen(false);
  };

  return (
    <div className={`knee-card ${verdict.kind}`}>
      <div className="knee-verdict">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="knee-kicker">Morning check-in</div>
          <div className="knee-title">{verdict.title}</div>
        </div>
        <button className="btn sm" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? "Close" : "Check in"}
        </button>
      </div>
      <p className="knee-detail">{verdict.detail}</p>

      {open ? (
        <div className="knee-form">
          <PainSlider label="On getting up today" hint="Stairs, first steps, a squat" value={m} onChange={setMorning} />
          <PainSlider label="Worst during the last session" hint={`${PAIN_CEILING}/10 or under is fine`} value={s} onChange={setSession} />
          <button className="btn good block" onClick={save}>
            Save for today
          </button>
          <p className="faint" style={{ fontSize: 12, margin: "8px 0 0" }}>
            One per day; saving again replaces today&apos;s. Stored on this device only.
          </p>
        </div>
      ) : null}

      {entries.length > 0 ? (
        <div className="knee-log">
          {entries.slice(0, SHOWN).map((e) => (
            <div key={e.day} className="knee-log-row">
              <span className="knee-log-day">{shortDate(e.day)}</span>
              <span>
                <span className="mono" style={{ color: painTone(e.morning) }}>
                  {e.morning}
                </span>
                <span className="faint"> morning</span>
              </span>
              <span>
                <span className="mono" style={{ color: painTone(e.session) }}>
                  {e.session}
                </span>
                <span className="faint"> session</span>
              </span>
              <button
                className="knee-log-x"
                aria-label={`Remove check-in for ${shortDate(e.day)}`}
                onClick={() => removeCheckIn(e.day)}
              >
                &#10005;
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
