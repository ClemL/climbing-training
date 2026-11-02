import { expect, test, type Page } from "@playwright/test";
import { startSession } from "./helpers";

type Fake = "records" | "rejects" | "missing";

/** Replaces navigator.wakeLock before the app loads, logging every request and release. */
async function fakeWakeLock(page: Page, kind: Fake) {
  await page.addInitScript((k: Fake) => {
    const log: string[] = [];
    (window as unknown as { __wake: string[] }).__wake = log;
    if (k === "missing") {
      delete (Navigator.prototype as unknown as { wakeLock?: unknown }).wakeLock;
      return;
    }
    Object.defineProperty(navigator, "wakeLock", {
      configurable: true,
      value: {
        request: async (type: string) => {
          log.push(`request:${type}`);
          if (k === "rejects") throw new DOMException("Not allowed", "NotAllowedError");
          return { released: false, type, release: async () => void log.push("release") };
        },
      },
    });
  }, kind);
}

const wakeLog = (page: Page) => page.evaluate(() => (window as unknown as { __wake: string[] }).__wake.slice());

async function setVisibility(page: Page, state: "hidden" | "visible") {
  await page.evaluate((s) => {
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => s });
    document.dispatchEvent(new Event("visibilitychange"));
  }, state);
}

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

const pause = (page: Page) => page.locator(".topbar").getByRole("button", { name: "Pause" }).click();
const resume = (page: Page) => page.locator(".topbar").getByRole("button", { name: "Resume" }).click();

test("a running session holds the lock, and pausing releases it", async ({ page }) => {
  await fakeWakeLock(page, "records");
  await startSession(page);
  await expect.poll(() => wakeLog(page)).toEqual(["request:screen"]);
  await pause(page);
  await expect.poll(() => wakeLog(page)).toEqual(["request:screen", "release"]);
});

test("the lock is taken again on return to the page, only while the session runs", async ({ page }) => {
  await fakeWakeLock(page, "records");
  await startSession(page);
  await expect.poll(() => wakeLog(page)).toEqual(["request:screen"]);

  await setVisibility(page, "hidden");
  await setVisibility(page, "visible");
  await expect.poll(() => wakeLog(page)).toEqual(["request:screen", "request:screen"]);

  await pause(page);
  const before = (await wakeLog(page)).filter((e) => e.startsWith("request")).length;
  await setVisibility(page, "hidden");
  await setVisibility(page, "visible");
  await page.waitForTimeout(200);
  expect((await wakeLog(page)).filter((e) => e.startsWith("request")).length).toBe(before);

  await resume(page);
  await expect.poll(async () => (await wakeLog(page)).filter((e) => e.startsWith("request")).length).toBe(before + 1);
});

test("a refused lock raises no error", async ({ page }) => {
  const errors = collectErrors(page);
  await fakeWakeLock(page, "rejects");
  await startSession(page);
  await expect.poll(() => wakeLog(page)).toEqual(["request:screen"]);
  expect(errors).toEqual([]);
});

test("without the API a session still runs", async ({ page }) => {
  const errors = collectErrors(page);
  await fakeWakeLock(page, "missing");
  await startSession(page);
  expect(await page.evaluate(() => "wakeLock" in navigator)).toBe(false);
  await pause(page);
  await expect(page.locator(".topbar").getByRole("button", { name: "Resume" })).toBeVisible();
  expect(errors).toEqual([]);
});
