"use client";

import { clearFavorites } from "@/lib/favorites";
import { clearHistory, clearLoads } from "@/lib/storage";
import { resetSettings, updateSettings, type Density, type Settings } from "@/lib/settings";
import { useSettings } from "@/lib/use-settings";

function Toggle({
  name,
  why,
  on,
  onChange,
}: {
  name: string;
  why: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="setting">
      <div className="setting-copy">
        <div className="setting-name">{name}</div>
        <div className="setting-why">{why}</div>
      </div>
      <button className="switch" role="switch" aria-checked={on} aria-label={name} onClick={() => onChange(!on)} />
    </div>
  );
}

export default function SettingsView() {
  const s = useSettings();
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => updateSettings({ [key]: value } as Partial<Settings>);

  return (
    <>
      <h1>Settings</h1>
      <p className="lede">Stored in this browser alongside everything else. Nothing syncs.</p>

      <h2>Training</h2>
      <Toggle
        name="Log added weight on hangboard blocks"
        why="Off by default. Turn this on only if you hang with added or removed weight; bodyweight hangs need no record."
        on={s.logHangboardWeight}
        onChange={(v) => set("logHangboardWeight", v)}
      />
      {s.logHangboardWeight ? (
        <div className="setting">
          <div className="setting-copy">
            <div className="setting-name">Weight unit</div>
            <div className="setting-why">Applies to the hangboard log only.</div>
          </div>
          <div className="seg">
            {(["lb", "kg"] as const).map((u) => (
              <button key={u} aria-pressed={s.unit === u} onClick={() => set("unit", u)}>
                {u}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <h2>Display</h2>
      <div className="setting">
        <div className="setting-copy">
          <div className="setting-name">Element size</div>
          <div className="setting-why">
            Row height, padding, type and controls all scale together. Compact fits more of a session on screen;
            comfortable gives bigger tap targets for cold or chalky hands.
          </div>
        </div>
      </div>
      <div className="seg seg-wide">
        {(["compact", "normal", "comfortable"] as Density[]).map((d) => (
          <button key={d} aria-pressed={s.density === d} onClick={() => set("density", d)}>
            {d[0].toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      <h2>During a session</h2>
      <Toggle
        name="Timer sounds"
        why="Countdown beeps on the last three seconds of every rest and interval phase."
        on={s.sounds}
        onChange={(v) => set("sounds", v)}
      />
      <Toggle
        name="Keep the screen awake"
        why="Holds the display on while a session is running, so the phone does not lock between sets."
        on={s.keepAwake}
        onChange={(v) => set("keepAwake", v)}
      />
      <Toggle
        name="Animate exercise illustrations"
        why="Cycles between start and end position. Turn off to hold the start frame; the overlay can still step through manually."
        on={s.animateFigures}
        onChange={(v) => set("animateFigures", v)}
      />

      <h2>Data</h2>
      <div className="setting">
        <div className="setting-copy">
          <div className="setting-name">Reset settings</div>
          <div className="setting-why">Back to defaults. Training history is untouched.</div>
        </div>
        <button className="btn sm" onClick={() => resetSettings()}>
          Reset
        </button>
      </div>
      <div className="setting">
        <div className="setting-copy">
          <div className="setting-name">Delete hangboard log</div>
          <div className="setting-why">Every added-weight entry, for all plans.</div>
        </div>
        <button
          className="btn sm danger"
          onClick={() => {
            if (window.confirm("Delete every hangboard weight entry?")) clearLoads();
          }}
        >
          Delete
        </button>
      </div>
      <div className="setting">
        <div className="setting-copy">
          <div className="setting-name">Clear saved exercises</div>
          <div className="setting-why">Everything starred for later.</div>
        </div>
        <button
          className="btn sm danger"
          onClick={() => {
            if (window.confirm("Remove all saved exercises?")) clearFavorites();
          }}
        >
          Clear
        </button>
      </div>
      <div className="setting">
        <div className="setting-copy">
          <div className="setting-name">Delete training history</div>
          <div className="setting-why">All finished sessions.</div>
        </div>
        <button
          className="btn sm danger"
          onClick={() => {
            if (window.confirm("Delete all training history from this browser?")) clearHistory();
          }}
        >
          Delete
        </button>
      </div>
    </>
  );
}
