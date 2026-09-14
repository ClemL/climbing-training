"use client";

import { useEffect } from "react";
import { applyPopState, primeHistory } from "@/lib/navigation";

/** Bridges browser history events into the navigation store. Renders nothing. */
export default function NavigationSync() {
  useEffect(() => {
    primeHistory();
    const onPop = (e: PopStateEvent) => applyPopState(e.state);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return null;
}
