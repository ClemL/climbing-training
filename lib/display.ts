/**
 * What the stylesheet keys off: data-density, data-style, data-theme and
 * data-text on the document root. A theme chosen in Settings applies to either
 * style; "system" means the phone's own light or dark mode in Chalk, and dark
 * in Classic, which was dark only before the other themes existed.
 *
 * Deliberately not a client module: the root layout, a server component,
 * inlines BOOT_SCRIPT into <head>, and DisplaySync reuses the same function
 * once React is running.
 */

export const SETTINGS_KEY = "ct.settings.v1";

/**
 * The themes a person can pick, after "System". `color` is the page
 * background, which the browser's own toolbar follows (theme-color).
 */
export const THEMES = [
  { id: "light", label: "Light", tip: "Dark text on a light ground. Reads best outdoors in sun.", color: "#f4f2ed" },
  { id: "dark", label: "Dark", tip: "Near-black with a lime accent. The original look.", color: "#0e1116" },
  { id: "oled", label: "Black", tip: "True black for AMOLED screens, with text dimmed a step.", color: "#000000" },
  {
    id: "contrast",
    label: "High contrast",
    tip: "Black on white, black borders, a thick focus ring. 7:1 or better.",
    color: "#ffffff",
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const TEXT_SIZES = [
  { id: "90", label: "90%" },
  { id: "100", label: "100%" },
  { id: "115", label: "115%" },
  { id: "130", label: "130%" },
] as const;

export type TextSize = (typeof TEXT_SIZES)[number]["id"];

export type DisplayAttributes = { density: string; style: "classic" | "chalk"; theme: ThemeId; text: TextSize };

/**
 * Takes stored settings as found, since the boot script reads them before
 * anything validates them. Every value is checked against a list written out
 * here, so a stale or tampered setting falls back to the default instead of
 * reaching the page. It must reference nothing outside itself: BOOT_SCRIPT
 * serializes it with toString.
 */
export function displayAttributes(
  s: { density?: unknown; style?: unknown; theme?: unknown; textSize?: unknown },
  prefersLight: boolean,
): DisplayAttributes {
  const style = s.style === "chalk" ? "chalk" : "classic";
  const chosen = ["light", "dark", "oled", "contrast"].indexOf(s.theme as string) >= 0;
  const theme = chosen ? (s.theme as ThemeId) : style === "chalk" && prefersLight ? "light" : "dark";
  const density = ["compact", "comfortable"].indexOf(s.density as string) >= 0 ? (s.density as string) : "normal";
  const text = ["90", "115", "130"].indexOf(s.textSize as string) >= 0 ? (s.textSize as TextSize) : "100";
  return { density, style, theme, text };
}

/** A px font size for an inline style, scaled by the text-size setting like every size in the stylesheet. */
export function textPx(px: number): string {
  return `calc(${px}px * var(--text-scale))`;
}

const COLORS: Record<string, string> = Object.fromEntries(THEMES.map((t) => [t.id, t.color]));

/** The browser toolbar color for a theme: its page background. */
export function themeColor(theme: ThemeId): string {
  return COLORS[theme];
}

/**
 * Runs in <head> before first paint. Without it the page would paint with the
 * server's defaults and switch once React hydrates: a dark flash on every open
 * for anyone on the light theme. The theme-color tag may come after this
 * script in <head>, so it is set again once the document is parsed.
 */
export const BOOT_SCRIPT = `(function () {
  try {
    var s = JSON.parse(localStorage.getItem(${JSON.stringify(SETTINGS_KEY)}) || "{}") || {};
    var a = (${displayAttributes.toString()})(s, matchMedia("(prefers-color-scheme: light)").matches);
    var r = document.documentElement;
    r.dataset.density = a.density;
    r.dataset.style = a.style;
    r.dataset.theme = a.theme;
    r.dataset.text = a.text;
    var c = ${JSON.stringify(COLORS)}[a.theme];
    var m = function () {
      var e = document.querySelector('meta[name="theme-color"]');
      if (e) e.setAttribute("content", c);
    };
    m();
    document.addEventListener("DOMContentLoaded", m);
  } catch (e) {}
})();`;
