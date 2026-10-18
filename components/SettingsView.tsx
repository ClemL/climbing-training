"use client";

import { useRef, useState } from "react";
import { applyImport, downloadBackup, parseBackup, previewImport, type ImportCounts } from "@/lib/backup";
import { clearFavorites } from "@/lib/favorites";
import { clearHistory, clearLoads, formatDate } from "@/lib/storage";
import { resetSettings, updateSettings, type Density, type Settings, type Style, type Theme } from "@/lib/settings";
import { useSettings } from "@/lib/use-settings";

/** "12 sessions, 3 knee check-ins and 1 saved exercise", leaving out whatever is zero. */
function describe(c: ImportCounts): string {
  const parts = (
    [
      [c.sessions, "session", "sessions"],
      [c.checkIns, "knee check-in", "knee check-ins"],
      [c.loads, "hangboard entry", "hangboard entries"],
      [c.saved, "saved exercise", "saved exercises"],
    ] as const
  )
    .filter(([n]) => n > 0)
    .map(([n, one, many]) => `${n} ${n === 1 ? one : many}`);
  if (parts.length < 2) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

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
  const fileRef = useRef<HTMLInputElement>(null);
  const [importNote, setImportNote] = useState<string | null>(null);

  const importFile = async (file: File) => {
    const parsed = parseBackup(await file.text());
    if (!parsed.ok) {
      setImportNote(parsed.error);
      return;
    }
    const adds = describe(previewImport(parsed.backup));
    const from = formatDate(parsed.backup.exportedAt);
    if (adds && !window.confirm(`Backup from ${from}. Add ${adds} to this device? Nothing already here is changed or removed.`)) {
      return;
    }
    const { settings } = applyImport(parsed.backup);
    const taken = settings ? " Settings taken from the backup." : "";
    setImportNote(adds ? `Added ${adds}.${taken}` : `Nothing in the ${from} backup is new to this device.${taken}`);
  };

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
          <div className="setting-name">Style</div>
          <div className="setting-why">
            Chalk is the one-handed redesign: navigation at the bottom, a session folded to the block you are on, bigger
            targets, and a light theme for daylight. Classic is the original.
          </div>
        </div>
      </div>
      <div className="seg seg-wide two">
        {(["classic", "chalk"] as Style[]).map((v) => (
          <button key={v} aria-pressed={s.style === v} onClick={() => set("style", v)}>
            {v[0].toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
      {s.style === "chalk" ? (
        <>
          <div className="setting">
            <div className="setting-copy">
              <div className="setting-name">Theme</div>
              <div className="setting-why">System follows the phone. Light reads better outdoors in sun.</div>
            </div>
          </div>
          <div className="seg seg-wide">
            {(["system", "light", "dark"] as Theme[]).map((v) => (
              <button key={v} aria-pressed={s.theme === v} onClick={() => set("theme", v)}>
                {v[0].toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </>
      ) : null}
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

      <h2>Backup</h2>
      <div className="setting">
        <div className="setting-copy">
          <div className="setting-name">Export a backup</div>
          <div className="setting-why">
            Sessions, knee check-ins, the hangboard log, saved exercises and settings, as one JSON file. Keep it
            somewhere other than this phone.
          </div>
        </div>
        <button className="btn sm" onClick={() => downloadBackup()}>
          Export
        </button>
      </div>
      <div className="setting">
        <div className="setting-copy">
          <div className="setting-name">Import a backup</div>
          <div className="setting-why">
            Merges into what is here and never removes anything, so a phone and a tablet can trade files. Settings
            come across only to a device that has none of its own.
          </div>
          {importNote ? (
            <div className="setting-why" role="status" style={{ color: "var(--text)", marginTop: 4 }}>
              {importNote}
            </div>
          ) : null}
        </div>
        <button className="btn sm" onClick={() => fileRef.current?.click()}>
          Import
        </button>
        {/* No `accept` filter: Android pickers often type a .json from Drive as
            octet-stream and grey it out. parseBackup rejects anything else. */}
        <input
          ref={fileRef}
          type="file"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void importFile(file);
          }}
        />
      </div>

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
