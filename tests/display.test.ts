import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import { BOOT_SCRIPT, displayAttributes, SETTINGS_KEY, THEMES } from "../lib/display.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

test("Classic stays dark on System, and takes any theme chosen outright", () => {
  for (const theme of ["system", undefined]) {
    assert.equal(displayAttributes({ style: "classic", theme }, true).theme, "dark");
  }
  for (const theme of ["light", "dark", "oled", "contrast"]) {
    assert.equal(displayAttributes({ style: "classic", theme }, true).theme, theme);
  }
  assert.deepEqual(displayAttributes({}, true), { density: "normal", style: "classic", theme: "dark", text: "100" });
});

test("Chalk follows its theme setting, and the phone when set to system", () => {
  assert.equal(displayAttributes({ style: "chalk", theme: "light" }, false).theme, "light");
  assert.equal(displayAttributes({ style: "chalk", theme: "dark" }, true).theme, "dark");
  assert.equal(displayAttributes({ style: "chalk", theme: "system" }, true).theme, "light");
  assert.equal(displayAttributes({ style: "chalk", theme: "system" }, false).theme, "dark");
});

test("stale or tampered values fall back to the defaults", () => {
  for (const bad of ["constructor", "<b>", "999", 130, null, {}]) {
    assert.deepEqual(displayAttributes({ density: bad, theme: bad, textSize: bad, style: bad }, false), {
      density: "normal",
      style: "classic",
      theme: "dark",
      text: "100",
    });
  }
});

/** Runs the inline <head> script against a stand-in for the browser. */
function boot(
  stored: string | null,
  prefersLight: boolean,
  storage: "ok" | "getItem-throws" | "blocked" = "ok",
): { dataset: Record<string, string>; color: string } {
  const run = { dataset: {} as Record<string, string>, color: "unset" };
  const getItem = (k: string) => {
    if (storage === "getItem-throws") throw new Error("denied");
    return k === SETTINGS_KEY ? stored : null;
  };
  const scope = {
    get localStorage() {
      if (storage === "blocked") throw new Error("SecurityError");
      return { getItem };
    },
    matchMedia: () => ({ matches: prefersLight }),
    document: {
      documentElement: { dataset: run.dataset },
      querySelector: () => ({ setAttribute: (_: string, value: string) => (run.color = value) }),
      addEventListener: () => {},
    },
  };
  runInNewContext(BOOT_SCRIPT, scope);
  return run;
}

test("the boot script applies the same attributes and theme color before first paint", () => {
  const stored = { style: "chalk", theme: "oled", density: "compact", textSize: "130" };
  const run = boot(JSON.stringify(stored), true);
  assert.deepEqual(run.dataset, { ...displayAttributes(stored, true) });
  assert.equal(run.color, THEMES.find((t) => t.id === "oled")?.color);
  assert.deepEqual(boot(null, true).dataset, { ...displayAttributes({}, true) });
});

test("the boot script survives corrupt, blocked and throwing storage", () => {
  // Nothing may throw in <head>; each case leaves the server's defaults alone.
  for (const [stored, storage] of [
    ["{not json", "ok"],
    ['{"theme":"oled"}', "getItem-throws"],
    ['{"theme":"oled"}', "blocked"],
  ] as const) {
    assert.deepEqual(boot(stored, true, storage).dataset, {});
  }
});

/* WCAG relative luminance and contrast ratio. */
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** The color tokens a theme block in globals.css defines, by name. */
function themeTokens(theme: string): Record<string, string> {
  const css = readFileSync(join(ROOT, "app", "globals.css"), "utf8");
  const block = new RegExp(`:root\\[data-theme="${theme}"\\] \\{([^}]*)\\}`).exec(css)?.[1];
  assert.ok(block, `no ${theme} theme block in globals.css`);
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\b/gi)].map((m) => [m[1], m[2]]));
}

/** Every text, accent and category color against every background, and white on the filled ones. */
function lowContrast(tokens: Record<string, string>, floor: number, whiteOn: readonly string[]): string[] {
  const backgrounds = ["bg", "bg-raised", "bg-raised-2"];
  const foregrounds = Object.keys(tokens).filter(
    (k) => ["text", "text-dim", "text-faint", "accent", "good", "warn", "danger"].includes(k) || k.startsWith("cat-"),
  );
  const low: string[] = [];
  for (const fg of foregrounds) {
    for (const bg of backgrounds) {
      const r = contrast(tokens[fg], tokens[bg]);
      if (r < floor) low.push(`--${fg} on --${bg}: ${r.toFixed(2)}`);
    }
  }
  for (const fill of whiteOn) {
    const r = contrast("#ffffff", tokens[fill]);
    if (r < floor) low.push(`white on --${fill}: ${r.toFixed(2)}`);
  }
  return low;
}

test("every light-theme text and accent color clears 4.5:1 on every background", () => {
  const tokens = themeTokens("light");
  assert.ok(Object.keys(tokens).length >= 20, "expected the text, accent and category tokens");
  // Filled buttons and checked boxes put white text on these.
  const low = lowContrast(tokens, 4.5, ["accent", "good", "danger"]);
  assert.deepEqual(low, [], `light theme contrast under 4.5:1:\n${low.join("\n")}`);
});

test("the black theme's dimmed text still clears 4.5:1", () => {
  // Accents and categories are inherited from the dark theme and are far brighter.
  const tokens = themeTokens("oled");
  const low = lowContrast(tokens, 4.5, []);
  assert.ok(tokens["text-faint"], "the black theme must redefine its text colors");
  assert.deepEqual(low, [], `black theme contrast under 4.5:1:\n${low.join("\n")}`);
});

test("high contrast clears 7:1 everywhere, including white on filled buttons", () => {
  const tokens = themeTokens("contrast");
  assert.ok(Object.keys(tokens).length >= 20, "expected the text, accent and category tokens");
  const low = lowContrast(tokens, 7, ["accent", "good", "danger"]);
  assert.deepEqual(low, [], `high contrast under 7:1:\n${low.join("\n")}`);
});
