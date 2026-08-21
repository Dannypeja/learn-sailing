import {
  DEFAULT_BOAT_ID,
  getBoat as getCatalogBoat,
} from "@content/boats";
import type { BoatDefinition } from "@content/boats/types";

export {
  DEFAULT_BOAT_ID,
  boats,
  partMatchesFilter,
} from "@content/boats";
export { FILTER_IDS } from "@content/boats/types";
export type {
  BoatDefinition,
  BoatPart,
  CameraPose,
  FilterId,
  PartCategory,
  Vec3,
} from "@content/boats/types";

/** Local Kenney starter mesh. Used when no hosted yacht URL is set, and as a load fallback. */
export const FALLBACK_BOAT_MODEL = "/models/monohull-sloop-single-rudder.glb";

function envFlag(name: string): boolean | undefined {
  const raw = process.env[name]?.trim().toLowerCase();
  if (raw === "1" || raw === "true") {
    return true;
  }
  if (raw === "0" || raw === "false") {
    return false;
  }
  return undefined;
}

/**
 * Resolves the runtime boat mesh.
 *
 * A ~25 MB yacht GLB cannot go through Cursor chat or GitHub's website
 * "Add file" (both 25 MB). Host it as a GitHub Release asset (or any
 * CORS-enabled HTTPS URL) and set NEXT_PUBLIC_BOAT_MODEL_URL. Sketchfab's
 * glTF zip is ~7 MB and does fit those uploads.
 */
export function getBoat(id: string = DEFAULT_BOAT_ID): BoatDefinition {
  const boat = getCatalogBoat(id);
  const hosted = process.env.NEXT_PUBLIC_BOAT_MODEL_URL?.trim();
  const model = hosted || boat.model;
  const preserveMaterials =
    envFlag("NEXT_PUBLIC_BOAT_PRESERVE_MATERIALS") ??
    (Boolean(hosted) || Boolean(boat.preserveMaterials));

  return {
    ...boat,
    model,
    preserveMaterials,
  };
}
