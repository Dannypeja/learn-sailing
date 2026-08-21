export type Tack = "port" | "starboard" | "none";

export type PointOfSailId =
  | "in-irons"
  | "close-hauled"
  | "beam-reach"
  | "broad-reach"
  | "run";

export type CourseId =
  | "close-hauled-starboard"
  | "close-hauled-port"
  | "beam-reach-starboard"
  | "beam-reach-port"
  | "broad-reach-starboard"
  | "broad-reach-port"
  | "run-starboard"
  | "run-port";

export type Course = {
  id: CourseId;
  pointOfSail: Exclude<PointOfSailId, "in-irons">;
  tack: Exclude<Tack, "none">;
  /** True wind angle: 0 = head to wind, positive = wind from starboard. */
  twa: number;
};

export type SailingInput = {
  heading: number;
  windFrom: number;
  windSpeed: number;
  mainSheet: number;
  jibSheet: number;
};

export type SailingState = {
  twa: number;
  absTwa: number;
  tack: Tack;
  pointOfSail: PointOfSailId;
  recommendedMainSheet: number;
  recommendedJibSheet: number;
  mainQuality: number;
  jibQuality: number;
  trimQuality: number;
  luffing: boolean;
  /** Signed boom yaw in degrees (negative = to port). */
  mainBoomDeg: number;
  /** Signed jib clew yaw in degrees. */
  jibDeg: number;
  /** Signed heel in degrees (positive = onto port, wind from starboard). */
  heelDeg: number;
  /** Forward drive 0..1 for the instrument bar. */
  drive: number;
  billow: number;
};
