"use client";

/**
 * Client-side navigation backed by the History API.
 *
 * The app is one document, so view state used to live in React alone and the
 * hardware back button left the app entirely - including when all you wanted
 * was to close the exercise overlay. Every view change and every overlay now
 * pushes a history entry, so back does what it does in any other Android app.
 *
 * Real Next routes would give this for free, but each route would become a
 * separate document the service worker has to precache, and the overlay is a
 * layer over a view rather than a view of its own. One document with explicit
 * history entries keeps offline behavior simple and treats both uniformly.
 */

export type View =
  | "plans"
  | "preview"
  | "session"
  | "history"
  | "library"
  | "saved"
  | "progressions"
  | "week"
  | "settings";

const VIEWS: readonly View[] = [
  "plans",
  "preview",
  "session",
  "history",
  "library",
  "saved",
  "progressions",
  "week",
  "settings",
];

export type NavState = {
  view: View;
  /** Plan being previewed. */
  planId?: string;
  /** Exercise in the overlay, layered above whichever view is beneath it. */
  ex?: string;
};

export const HOME: NavState = Object.freeze({ view: "plans" });

type Listener = () => void;
const listeners = new Set<Listener>();
let snapshot: NavState | undefined;

function isView(v: string | null): v is View {
  return !!v && (VIEWS as readonly string[]).includes(v);
}

/** Parses a NavState out of the current URL, falling back to the plan list. */
function fromUrl(): NavState {
  if (typeof window === "undefined") return HOME;
  const q = new URLSearchParams(window.location.search);
  const view = q.get("v");
  const state: NavState = { view: isView(view) ? view : "plans" };
  const planId = q.get("p");
  if (planId) state.planId = planId;
  const ex = q.get("ex");
  if (ex) state.ex = ex;
  // A preview with no plan is meaningless; treat it as the list.
  if (state.view === "preview" && !state.planId) state.view = "plans";
  return state;
}

/**
 * Our state is namespaced and merged into whatever is already in
 * history.state rather than replacing it. The App Router keeps its own
 * bookkeeping there; overwriting it makes Next resynchronize on popstate with
 * a full page navigation, which silently reloads the document and throws away
 * component state - an expanded ladder, a directory search, a scroll position.
 */
const STATE_KEY = "ct";

type Stamped = Record<string, unknown> & { [STATE_KEY]?: NavState };

function stamp(next: NavState): Stamped {
  const existing = (window.history.state ?? {}) as Record<string, unknown>;
  return { ...existing, [STATE_KEY]: next };
}

export function toUrl(s: NavState): string {
  const q = new URLSearchParams();
  if (s.view !== "plans") q.set("v", s.view);
  if (s.planId) q.set("p", s.planId);
  if (s.ex) q.set("ex", s.ex);
  const query = q.toString();
  return query ? `?${query}` : window.location.pathname;
}

function emit(): void {
  for (const l of listeners) l();
}

export function subscribeNav(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getNav(): NavState {
  if (snapshot === undefined) snapshot = fromUrl();
  return snapshot;
}

export function getNavServerSnapshot(): NavState {
  return HOME;
}

/** Pushes a new entry so the back button returns to where the user was. */
export function navigate(next: NavState, options: { replace?: boolean } = {}): void {
  snapshot = next;
  try {
    const url = toUrl(next);
    if (options.replace) window.history.replaceState(stamp(next), "", url);
    else window.history.pushState(stamp(next), "", url);
  } catch {
    /* history unavailable; the app still renders the right view */
  }
  emit();
}

/** Hands control to the browser, which answers with a popstate we apply. */
export function back(): void {
  window.history.back();
}

/** Applies a state the browser restored. Never pushes - that would trap the user. */
export function applyPopState(state: unknown): void {
  const carried = (state as Stamped | null)?.[STATE_KEY];
  snapshot = carried && isView(carried.view) ? carried : fromUrl();
  emit();
}

/**
 * Stamps the entry the app loaded on, so returning to it through history
 * carries a state object rather than null.
 */
export function primeHistory(): void {
  const current = getNav();
  try {
    window.history.replaceState(stamp(current), "", toUrl(current));
  } catch {
    /* ignore */
  }
}
