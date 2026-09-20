"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/use-settings";

/**
 * Publishes the density choice to the document root, where the CSS custom
 * properties for row height, padding, gaps and control size are redefined.
 * Renders nothing.
 */
export default function DensitySync() {
  const { density } = useSettings();

  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  return null;
}
