/**
 * Column classes for a card grid that has to look deliberate at any size.
 *
 * The clinic starts with one doctor and no reviews, so a fixed three-column
 * grid would strand a single card against two empty columns. Below three items
 * the grid narrows and centres instead.
 */
export function cardGrid(count: number) {
  if (count <= 1) return "mx-auto max-w-md";
  if (count === 2) return "mx-auto max-w-3xl sm:grid-cols-2";
  return "sm:grid-cols-2 lg:grid-cols-3";
}
