import { expect, test, type Page } from "@playwright/test";
import { overflow, saveSettings, SCREENS, sheetBox, startSession, STYLES, THEMES } from "./helpers";

/** Every visible control a finger is meant to hit, as "label: height". */
async function targetHeights(page: Page): Promise<{ label: string; height: number }[]> {
  return page
    .locator("button, select, input:not([type=radio]):not([type=range]):not([type=file]), label.choice")
    .evaluateAll((els) =>
      els
        .map((el) => ({ el, box: el.getBoundingClientRect() }))
        .filter(({ box }) => box.width > 0 && box.height > 0)
        .map(({ el, box }) => ({
          label: `${el.className || el.tagName} "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 30)}"`,
          height: Math.round(box.height * 10) / 10,
        })),
    );
}

async function expectTargetsAtLeast(page: Page, min: number) {
  const small = (await targetHeights(page)).filter((t) => t.height < min);
  expect(small, `controls under ${min}px`).toEqual([]);
}

for (const screen of SCREENS) {
  test.describe(screen.name, () => {
    test.use({
      viewport: { width: screen.width, height: screen.height },
      deviceScaleFactor: screen.scale,
      isMobile: true,
      hasTouch: true,
    });

    test("nothing scrolls sideways in any theme or style, at comfortable and 130% text", async ({ page }) => {
      await page.goto("/");
      for (const style of STYLES) {
        for (const theme of THEMES) {
          const label = `${style}, ${theme}`;
          await saveSettings(page, { style, theme, density: "comfortable", textSize: "130" });

          for (const view of ["plans", "week", "library", "history", "settings"]) {
            await page.goto(`/?v=${view}`);
            expect(await overflow(page), `${label}: ${view} overflows`).toBeLessThanOrEqual(0);
          }

          // The longest content open: a ladder expanded, and every block of a session shown.
          await page.goto("/?v=progressions");
          await page.locator(".ladder-head").first().click();
          expect(await overflow(page), `${label}: progressions overflows`).toBeLessThanOrEqual(0);

          await startSession(page, "cg-max");
          if (style === "chalk") await page.getByRole("button", { name: "Show all" }).click();
          expect(await overflow(page), `${label}: session overflows`).toBeLessThanOrEqual(0);
          await page.getByRole("button", { name: /^How to do/ }).first().click();
          expect(await overflow(page), `${label}: exercise sheet overflows`).toBeLessThanOrEqual(0);
          await page.keyboard.press("Escape");
          await page.evaluate(() => localStorage.removeItem("ct.active.v2"));
        }
      }
    });

    test("the header's controls are on screen, and the exercise sheet fits its width", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByRole("button", { name: "Settings", exact: true })).toBeInViewport();
      for (const tab of ["Plans", "Week", "Progressions", "Saved", "Directory", "History"]) {
        await expect(page.getByRole("button", { name: tab, exact: true }).first()).toBeInViewport();
      }

      await saveSettings(page, { style: "chalk" });
      const nav = page.getByRole("navigation", { name: "Sections" });
      for (const item of ["Plans", "Week", "Ladders", "Library", "History"]) {
        await expect(nav.getByRole("button", { name: item })).toBeInViewport();
      }

      await startSession(page);
      await page.getByRole("button", { name: /^How to do/ }).first().click();
      const box = await sheetBox(page);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(screen.width);
      expect(box.y + box.height).toBeLessThanOrEqual(screen.height + 1);
    });

    const wide = screen.layout === "wide layout";

    test(`lists run in ${wide ? "two columns" : "one column"}`, async ({ page }) => {
      await page.goto("/?v=library");
      const [a, b] = await page
        .locator(".cols > .lib-item")
        .evaluateAll((els) => els.slice(0, 2).map((el) => el.getBoundingClientRect().toJSON()));
      if (wide) {
        expect(b.top).toBeCloseTo(a.top, 0);
        expect(b.left).toBeGreaterThanOrEqual(a.right);
      } else {
        expect(b.top).toBeGreaterThanOrEqual(a.bottom);
      }
    });

    test(`a session ${wide ? "keeps its clock beside the blocks" : "stacks its clock above the blocks"}`, async ({
      page,
    }) => {
      await startSession(page);
      const side = (await page.locator(".session-side").boundingBox())!;
      const main = (await page.locator(".session-main").boundingBox())!;
      if (wide) {
        expect(main.x).toBeGreaterThanOrEqual(side.x + side.width);
        // The side column is sticky, so it can sit a pixel or two off the main column's top.
        expect(Math.abs(main.y - side.y)).toBeLessThan(8);
      } else {
        expect(main.y).toBeGreaterThanOrEqual(side.y + side.height);
      }
    });

    test("touch targets are at least 32px tall, and 44px at comfortable", async ({ page }) => {
      for (const style of STYLES) {
        await page.goto("/");
        await saveSettings(page, { style });
        await page.goto("/?v=settings");
        await expectTargetsAtLeast(page, 32);
        await startSession(page);
        await expectTargetsAtLeast(page, 32);
        await page.evaluate(() => localStorage.removeItem("ct.active.v2"));

        await saveSettings(page, { style, density: "comfortable" });
        await page.goto("/?v=settings");
        await expectTargetsAtLeast(page, 44);
        await startSession(page);
        await expectTargetsAtLeast(page, 44);
        await page.evaluate(() => localStorage.removeItem("ct.active.v2"));
      }
    });

    test("Settings reports this screen's size and layout", async ({ page }) => {
      await page.goto("/?v=settings");
      await expect(page.locator(".screen-size")).toHaveText(
        `${screen.width} × ${screen.height} CSS pixels at ${screen.scale}× · ${screen.layout}`,
      );
    });
  });
}

test.describe("OnePlus Open, unfolding", () => {
  test.use({ viewport: { width: 425, height: 946 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });

  test("the plan filter and scroll position survive, and the readout follows", async ({ page }) => {
    await page.goto("/?v=plans");
    const filter = page.getByRole("group", { name: "Plan category" }).getByRole("button", { name: /Climbing/ });
    await filter.click();
    await page.mouse.wheel(0, 600);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    await page.setViewportSize({ width: 864, height: 930 });
    await expect(filter).toHaveAttribute("aria-pressed", "true");
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    expect(await overflow(page)).toBeLessThanOrEqual(0);

    await page.goto("/?v=settings");
    await page.setViewportSize({ width: 425, height: 946 });
    await expect(page.locator(".screen-size")).toContainText("425 × 946 CSS pixels");
    await expect(page.locator(".screen-size")).toContainText("phone layout");
    await page.setViewportSize({ width: 864, height: 930 });
    await expect(page.locator(".screen-size")).toContainText("864 × 930 CSS pixels");
    await expect(page.locator(".screen-size")).toContainText("single column");
  });

  test("a Chalk session keeps its open block, its open menu and its clock", async ({ page }) => {
    await page.goto("/");
    await saveSettings(page, { style: "chalk" });
    await startSession(page);

    // Block A is folded while the warm-up is current: open it, and open its menu.
    const toggleA = page.locator("#block-fwp-a .block-toggle");
    await toggleA.click();
    await expect(toggleA).toHaveAttribute("aria-expanded", "true");
    await page.locator("#block-fwp-a").getByRole("button", { name: /^Options for/ }).click();
    await page.getByRole("button", { name: /^Mark .* done$/ }).first().click();
    const url = page.url();

    await page.setViewportSize({ width: 864, height: 930 });
    expect(page.url()).toBe(url);
    await expect(toggleA).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#block-fwp-a .block-menu")).toBeVisible();
    await expect(page.getByRole("button", { name: /^Mark .* done$/ }).first()).toHaveAttribute("aria-pressed", "true");
    expect(await overflow(page)).toBeLessThanOrEqual(0);
  });
});
