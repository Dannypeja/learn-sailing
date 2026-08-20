export type Vec3 = [number, number, number];

export const PART_CATEGORIES = [
  "hull",
  "deck",
  "keel",
  "rudder",
  "mast",
  "boom",
  "sails",
  "standing-rig",
  "running-rig",
  "aft",
  "orientation",
] as const;

export type PartCategory = (typeof PART_CATEGORIES)[number];

export const FILTER_IDS = [
  "all",
  "hull",
  "rig",
  "standing-rig",
  "running-rig",
  "mast",
  "boom",
  "aft",
] as const;

export type FilterId = (typeof FILTER_IDS)[number];

export type CameraPose = {
  position: Vec3;
  target: Vec3;
};

export type BoatPart = {
  id: string;
  categories: PartCategory[];
  position: Vec3;
  radius: number;
  meshNames?: string[];
  camera: CameraPose;
  lines?: Vec3[][];
};

export type BoatDefinition = {
  id: string;
  model: string;
  modelScale: number;
  modelRotation: Vec3;
  defaultCamera: CameraPose;
  parts: BoatPart[];
};
