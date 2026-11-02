import { expect, test, type Page } from "@playwright/test";
import { overflow, saveSettings, THEMES } from "./helpers";

const html = (page: Page) => page.locator("html");
const themeColor = (page: Page) => page.locator('meta[name="theme-color"]').getAttribute("content");
const rootVar = (page: Page, name: string) =>
  page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);

/** Holds every JavaScript bundle back, so whatever is on the page came from the HTML and the boot script. */
async function delayScripts(page: Page) {
  await page.route("**/_next/static/**/*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });
}

test("choices apply at once, are right from the first paint, and the defaults restore", async ({ page }) => {
  await page.goto("/?v=settings");
  await page.waitForLoadState("load");
  await page.getByRole("radio", { name: /^Black/ }).check();
  await page.getByRole("button", { name: "Comfortable", exact: true }).click();
  await page.getByRole("group", { name: "Text size" }).getByRole("button", { name: "115%" }).click();
  await expect(html(page)).toHaveAttribute("data-theme", "oled");
  await expect(html(page)).toHaveAttribute("data-density", "comfortable");
  await expect(html(page)).toHaveAttribute("data-text", "115");
  await expect.poll(() => themeColor(page)).toBe("#000000");

  await delayScripts(page);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(html(page)).toHaveAttribute("data-theme", "oled");
  await expect(html(page)).toHaveAttribute("data-density", "comfortable");
  expect(await rootVar(page, "--text-scale")).toBe("1.15");
  expect(await themeColor(page)).toBe("#000000");

  // A click before the load event has no React handler behind it yet.
  await page.unrouteAll({ behavior: "ignoreErrors" });
  await page.waitForLoadState("load");
  await expect(page.getByRole("radio", { name: /^Black/ })).toBeChecked();
  await expect(page.getByRole("button", { name: "Comfortable", exact: true })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("radio", { name: /^System/ }).check();
  await page.getByRole("button", { name: "Normal", exact: true }).click();
  await page.getByRole("group", { name: "Text size" }).getByRole("button", { name: "100%" }).click();
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  await expect(html(page)).toHaveAttribute("data-density", "normal");
  await expect(html(page)).toHaveAttribute("data-text", "100");
});

test("text size scales type alone, and density scales spacing", async ({ page }) => {
  await page.goto("/?v=settings");
  const heading = page.getByRole("heading", { level: 1 });
  const size = () => heading.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  const padding = () =>
    page.locator(".setting").first().evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));

  const base = await size();
  await saveSettings(page, { textSize: "130" });
  expect(await size()).toBeCloseTo(base * 1.3, 1);

  const pads: number[] = [];
  for (const density of ["compact", "normal", "comfortable"]) {
    await saveSettings(page, { density });
    pads.push(await padding());
  }
  expect(pads[0]).toBeLessThan(pads[1]);
  expect(pads[1]).toBeLessThan(pads[2]);
});

test.describe("at 390px wide", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("no theme scrolls sideways", async ({ page }) => {
    await page.goto("/");
    for (const theme of THEMES) {
      await saveSettings(page, { theme, style: "chalk" });
      for (const view of ["plans", "settings", "library"]) {
        await page.goto(`/?v=${view}`);
        expect(await overflow(page), `${theme}: ${view}`).toBeLessThanOrEqual(0);
      }
    }
  });
});

test("a load with every setting saved logs no errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await saveSettings(page, { style: "chalk", theme: "contrast", density: "comfortable", textSize: "130" });
  await page.goto("/?v=settings");
  await page.waitForLoadState("load");
  await expect(html(page)).toHaveAttribute("data-theme", "contrast");
  expect(errors).toEqual([]);
});
