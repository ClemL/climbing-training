import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BOOT_SCRIPT, displayAttributes, SETTINGS_KEY } from "../lib/display.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

test("Classic stays dark whatever the theme setting or the phone says", () => {
  for (const theme of ["system", "light", "dark", undefined]) {
    assert.equal(displayAttributes({ style: "classic", theme }, true).theme, "dark");
  }
  assert.deepEqual(displayAttributes({}, true), { density: "normal", style: "classic", theme: "dark" });
});

test("Chalk follows its theme setting, and the phone when set to system", () => {
  assert.equal(displayAttributes({ style: "chalk", theme: "light" }, false).theme, "light");
  assert.equal(displayAttributes({ style: "chalk", theme: "dark" }, true).theme, "dark");
  assert.equal(displayAttributes({ style: "chalk", theme: "system" }, true).theme, "light");
  assert.equal(displayAttributes({ style: "chalk", theme: "system" }, false).theme, "dark");
});

/** Runs the inline <head> script against a stand-in for the browser. */
function boot(stored: string | null, prefersLight: boolean): Record<string, string> {
  const dataset: Record<string, string> = {};
  const localStorage = { getItem: (k: string) => (k === SETTINGS_KEY ? stored : null) };
  const matchMedia = () => ({ matches: prefersLight });
  const document = { documentElement: { dataset } };
  new Function("localStorage", "matchMedia", "document", BOOT_SCRIPT)(localStorage, matchMedia, document);
  return dataset;
}

test("the boot script applies the same attributes before first paint", () => {
  const stored = { style: "chalk", theme: "system", density: "compact" };
  assert.deepEqual(boot(JSON.stringify(stored), true), { ...displayAttributes(stored, true) });
  assert.deepEqual(boot(null, true), { ...displayAttributes({}, true) });
  // Corrupt storage must not throw in <head>; it leaves the defaults alone.
  assert.deepEqual(boot("{not json", true), {});
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

test("every light-theme text and accent color clears 4.5:1 on every background", () => {
  const css = readFileSync(join(ROOT, "app", "globals.css"), "utf8");
  const block = /:root\[data-theme="light"\] \{([^}]*)\}/.exec(css)?.[1];
  assert.ok(block, "no light theme block in globals.css");
  const tokens = Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})\b/gi)].map((m) => [m[1], m[2]]));

  const backgrounds = ["bg", "bg-raised", "bg-raised-2"];
  const foregrounds = Object.keys(tokens).filter(
    (k) => ["text", "text-dim", "text-faint", "accent", "good", "warn", "danger"].includes(k) || k.startsWith("cat-"),
  );
  assert.ok(foregrounds.length >= 17, `expected the text, accent and category tokens, found ${foregrounds.join(", ")}`);

  const low: string[] = [];
  for (const fg of foregrounds) {
    for (const bg of backgrounds) {
      const r = contrast(tokens[fg], tokens[bg]);
      if (r < 4.5) low.push(`--${fg} on --${bg}: ${r.toFixed(2)}`);
    }
  }
  // Filled buttons and checked boxes put white text on these.
  for (const fill of ["accent", "good", "danger"]) {
    const r = contrast("#ffffff", tokens[fill]);
    if (r < 4.5) low.push(`white on --${fill}: ${r.toFixed(2)}`);
  }
  assert.deepEqual(low, [], `light theme contrast under 4.5:1:\n${low.join("\n")}`);
});
