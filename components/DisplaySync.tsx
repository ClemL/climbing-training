"use client";

import { useEffect, useSyncExternalStore } from "react";
import { displayAttributes } from "@/lib/display";
import { useSettings } from "@/lib/use-settings";

const LIGHT = "(prefers-color-scheme: light)";

function subscribeScheme(cb: () => void): () => void {
  const m = window.matchMedia(LIGHT);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

const prefersLight = () => window.matchMedia(LIGHT).matches;
const serverPrefersLight = () => false;

/**
 * Publishes density, style and theme to the document root, where the CSS
 * custom properties are redefined. BOOT_SCRIPT sets the same attributes before
 * first paint; this keeps them current when a setting or the phone's light or
 * dark mode changes. Renders nothing.
 */
export default function DisplaySync() {
  const settings = useSettings();
  const light = useSyncExternalStore(subscribeScheme, prefersLight, serverPrefersLight);

  useEffect(() => {
    const a = displayAttributes(settings, light);
    const root = document.documentElement;
    root.dataset.density = a.density;
    root.dataset.style = a.style;
    root.dataset.theme = a.theme;
    // The browser's own toolbar follows the page background.
    const bg = getComputedStyle(root).getPropertyValue("--bg").trim();
    if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg);
  }, [settings, light]);

  return null;
}
