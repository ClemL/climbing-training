/**
 * What the stylesheet keys off: data-density, data-style and data-theme on the
 * document root. Classic is dark only. Chalk follows its theme setting, where
 * "system" means the phone's own light or dark mode.
 *
 * Deliberately not a client module: the root layout, a server component,
 * inlines BOOT_SCRIPT into <head>, and DisplaySync reuses the same function
 * once React is running.
 */

export const SETTINGS_KEY = "ct.settings.v1";

export type DisplayAttributes = { density: string; style: "classic" | "chalk"; theme: "light" | "dark" };

/** Takes stored settings as found, since the boot script reads them before anything validates them. */
export function displayAttributes(
  s: { density?: unknown; style?: unknown; theme?: unknown },
  prefersLight: boolean,
): DisplayAttributes {
  const style = s.style === "chalk" ? "chalk" : "classic";
  const light = style === "chalk" && (s.theme === "light" || (s.theme !== "dark" && prefersLight));
  return { density: typeof s.density === "string" ? s.density : "normal", style, theme: light ? "light" : "dark" };
}

/**
 * Runs in <head> before first paint. Without it the page would paint with the
 * server's defaults and switch once React hydrates: a dark flash on every open
 * for anyone on the light theme. displayAttributes is serialized into it with
 * toString, which works because it references nothing outside itself.
 */
export const BOOT_SCRIPT = `(function () {
  try {
    var s = JSON.parse(localStorage.getItem(${JSON.stringify(SETTINGS_KEY)}) || "{}") || {};
    var a = (${displayAttributes.toString()})(s, matchMedia("(prefers-color-scheme: light)").matches);
    var r = document.documentElement;
    r.dataset.density = a.density;
    r.dataset.style = a.style;
    r.dataset.theme = a.theme;
  } catch (e) {}
})();`;
