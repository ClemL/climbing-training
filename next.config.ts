import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as { version?: string };

/**
 * Stamped once per build and inlined into the bundle, so the footer prints the
 * same string in the prerendered HTML and after hydration. Formatting a date at
 * render time would differ between server and phone and break hydration.
 */
const buildTime = `${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC`;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version ?? "0.0.0",
    NEXT_PUBLIC_BUILD_TIME: buildTime,
  },
};

export default nextConfig;
