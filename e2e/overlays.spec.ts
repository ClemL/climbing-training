import { expect, test, type Page } from "@playwright/test";
import { sheetBox, startSession } from "./helpers";

/**
 * The app's overlays are bottom sheets, not dropdowns hanging off a button: the
 * exercise detail and the changelog. A short screen is where they could run off
 * the edge, so they are checked on a phone with the keyboard-sized height of 480px.
 */
test.use({ viewport: { width: 412, height: 480 }, isMobile: true, hasTouch: true });

async function expectOnScreen(page: Page, width: number, height: number) {
  const box = await sheetBox(page);
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width);
  expect(box.y + box.height).toBeLessThanOrEqual(height + 1);
}

test("the exercise sheet fits, scrolls to its last item, and follows an unfold", async ({ page }) => {
  await startSession(page);
  await page.getByRole("button", { name: "How to do Pulse Raiser" }).click();
  const sheet = page.getByRole("dialog");
  await expectOnScreen(page, 412, 480);

  const body = sheet.locator(".sheet-body");
  if (await body.evaluate((el) => el.scrollHeight > el.clientHeight)) {
    const last = body.locator(":scope > *").last();
    await last.scrollIntoViewIfNeeded();
    await expect(last).toBeInViewport();
  }

  await page.setViewportSize({ width: 864, height: 930 });
  await expect(sheet).toBeVisible();
  await expectOnScreen(page, 864, 930);
});

test("Escape and a tap outside both close the sheet", async ({ page }) => {
  await startSession(page);
  const info = page.getByRole("button", { name: "How to do Pulse Raiser" });
  await info.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await info.click();
  await page.locator(".sheet-backdrop").click({ position: { x: 10, y: 10 } });
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("the changelog fits a short screen and its last entry can be reached", async ({ page }) => {
  await page.goto("/?v=history");
  await page.locator(".changelog-trigger").scrollIntoViewIfNeeded();
  await page.locator(".changelog-trigger").click();
  await expectOnScreen(page, 412, 480);
  const last = page.locator(".changelog-list li").last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeInViewport();
});
