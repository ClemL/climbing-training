import type { Page } from "@playwright/test";

/**
 * The owner trains with a OnePlus Open, folded and unfolded, and a Galaxy Tab S
 * Ultra. No published source gives these screens in CSS pixels, so the sizes
 * here are the panels' resolutions over a typical Android scale. Settings shows
 * a device's real figures under "This screen"; correct these if they differ.
 */
export const SCREENS = [
  { name: "OnePlus Open, folded", width: 425, height: 946, scale: 2.625, layout: "phone layout" },
  { name: "OnePlus Open, unfolded", width: 864, height: 930, scale: 2.625, layout: "single column" },
  { name: "Galaxy Tab S Ultra, portrait", width: 924, height: 1480, scale: 2, layout: "single column" },
  { name: "Galaxy Tab S Ultra, landscape", width: 1480, height: 924, scale: 2, layout: "wide layout" },
] as const;

export const THEMES = ["light", "dark", "oled", "contrast"] as const;
export const STYLES = ["classic", "chalk"] as const;

export const SETTINGS_KEY = "ct.settings.v1";

/** How far the page scrolls sideways; anything above 0 is a bug. */
export const overflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/** Saves settings the way the Settings view does, then reloads so the boot script applies them from the first paint. */
export async function saveSettings(page: Page, settings: Record<string, string | boolean>) {
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [SETTINGS_KEY, JSON.stringify(settings)]);
  await page.reload();
}

/** The open sheet's box once its 14px slide-up has finished, which is where it comes to rest. */
export async function sheetBox(page: Page) {
  const sheet = page.getByRole("dialog");
  await sheet.evaluate((el) => Promise.all(el.getAnimations().map((a) => a.finished)));
  return (await sheet.boundingBox())!;
}

/** Starts a plan from its detail page and lands in the running session. */
export async function startSession(page: Page, planId = "fw-push") {
  await page.goto(`/?v=preview&p=${planId}`);
  await page.getByRole("button", { name: /^Start/ }).first().click();
  await page.waitForURL(/v=session/);
}
