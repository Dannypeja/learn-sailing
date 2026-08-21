export { clamp, degToRad, headingForTwa, lerp, radToDeg, trueWindAngle, wrap180, wrap360 } from "./angles";
export {
  classifyPointOfSail,
  classifyTack,
  COURSES,
  courseById,
  nearestCourse,
  NO_GO_DEG,
} from "./courses";
export {
  computeSailing,
  DEFAULT_WIND_SPEED,
  MAX_HEEL_DEG,
  recommendedSheets,
  sheetToBoomDeg,
} from "./physics";
export type { Course, CourseId, PointOfSailId, SailingInput, SailingState, Tack } from "./types";
