/**
 * Layout breakpoints, decided from the content and checked against the
 * screens this app is used on: a OnePlus Open folded (about 425px wide) and
 * unfolded (about 864px), and a Galaxy Tab S Ultra in portrait (about 924px)
 * and landscape (about 1480px). app/globals.css uses the same numbers; change
 * both together.
 *
 * - Up to PHONE_MAX_WIDTH: a phone. The header's tabs wrap into a grid
 *   instead of scrolling sideways.
 * - Up to WIDE_MIN_WIDTH: one column, up to 760px wide. Both the unfolded
 *   foldable and the tablet in portrait land here; at 864-924px a second
 *   column would leave each one too narrow for an exercise row.
 * - From WIDE_MIN_WIDTH: the tablet in landscape and desktop windows. Lists
 *   go to two columns, a plan opens beside the plan list, and a session puts
 *   its clock and notes in a column beside the blocks.
 */
export const PHONE_MAX_WIDTH = 560;
export const WIDE_MIN_WIDTH = 1100;

export type LayoutName = "phone" | "single column" | "wide";

export function layoutFor(width: number): LayoutName {
  if (width >= WIDE_MIN_WIDTH) return "wide";
  if (width <= PHONE_MAX_WIDTH) return "phone";
  return "single column";
}
