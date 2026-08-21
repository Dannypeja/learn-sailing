import { wrap180 } from "./angles";
import type { Course, CourseId, PointOfSailId, Tack } from "./types";

export const NO_GO_DEG = 40;

export const COURSES: readonly Course[] = [
  {
    id: "close-hauled-starboard",
    pointOfSail: "close-hauled",
    tack: "starboard",
    twa: 45,
  },
  {
    id: "close-hauled-port",
    pointOfSail: "close-hauled",
    tack: "port",
    twa: -45,
  },
  {
    id: "beam-reach-starboard",
    pointOfSail: "beam-reach",
    tack: "starboard",
    twa: 90,
  },
  {
    id: "beam-reach-port",
    pointOfSail: "beam-reach",
    tack: "port",
    twa: -90,
  },
  {
    id: "broad-reach-starboard",
    pointOfSail: "broad-reach",
    tack: "starboard",
    twa: 135,
  },
  {
    id: "broad-reach-port",
    pointOfSail: "broad-reach",
    tack: "port",
    twa: -135,
  },
  {
    id: "run-starboard",
    pointOfSail: "run",
    tack: "starboard",
    twa: 170,
  },
  {
    id: "run-port",
    pointOfSail: "run",
    tack: "port",
    twa: -170,
  },
] as const;

export function courseById(id: CourseId): Course {
  const course = COURSES.find((item) => item.id === id);
  if (!course) {
    throw new Error(`Unknown course: ${id}`);
  }
  return course;
}

export function classifyPointOfSail(twa: number): PointOfSailId {
  const abs = Math.abs(twa);
  if (abs < NO_GO_DEG) {
    return "in-irons";
  }
  if (abs < 70) {
    return "close-hauled";
  }
  if (abs < 115) {
    return "beam-reach";
  }
  if (abs < 160) {
    return "broad-reach";
  }
  return "run";
}

export function classifyTack(twa: number): Tack {
  if (twa > 8) {
    return "starboard";
  }
  if (twa < -8) {
    return "port";
  }
  return "none";
}

export function nearestCourse(twa: number): Course {
  let best = COURSES[0];
  let bestDist = Infinity;
  for (const course of COURSES) {
    const dist = Math.abs(wrap180(twa - course.twa));
    if (dist < bestDist) {
      best = course;
      bestDist = dist;
    }
  }
  return best;
}
