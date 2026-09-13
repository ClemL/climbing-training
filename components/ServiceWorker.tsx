"use client";

import { useEffect } from "react";

/** Registers the offline worker. No UI; failures are non-fatal by design. */
export default function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* unsupported, blocked, or served over plain http */
      });
    };
    // Registering after load keeps the precache off the critical path.
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
