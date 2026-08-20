import monohull from "./monohull-sloop-single-rudder/parts.json";
import type { BoatDefinition, FilterId, BoatPart } from "./types";

export const DEFAULT_BOAT_ID = "monohull-sloop-single-rudder";

export const boats: Record<string, BoatDefinition> = {
  [DEFAULT_BOAT_ID]: monohull as BoatDefinition,
};

export function getBoat(id: string = DEFAULT_BOAT_ID): BoatDefinition {
  const boat = boats[id];
  if (!boat) {
    throw new Error(`Unknown hull type: ${id}`);
  }
  return boat;
}

const HULL_CATEGORIES = new Set(["hull", "deck", "keel", "rudder"]);
const RIG_CATEGORIES = new Set([
  "mast",
  "boom",
  "sails",
  "standing-rig",
  "running-rig",
]);

export function partMatchesFilter(part: BoatPart, filter: FilterId): boolean {
  if (filter === "all") {
    return true;
  }
  if (filter === "hull") {
    return part.categories.some((category) => HULL_CATEGORIES.has(category));
  }
  if (filter === "rig") {
    return part.categories.some((category) => RIG_CATEGORIES.has(category));
  }
  return part.categories.includes(filter);
}
