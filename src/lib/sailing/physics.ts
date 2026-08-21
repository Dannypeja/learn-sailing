import { clamp, lerp, trueWindAngle } from "./angles";
import { classifyPointOfSail, classifyTack, NO_GO_DEG } from "./courses";
import type { SailingInput, SailingState } from "./types";

export const MAX_HEEL_DEG = 30;
export const DEFAULT_WIND_SPEED = 12;
export const MIN_BOOM_DEG = 8;
export const MAX_BOOM_DEG = 88;

export function recommendedSheets(absTwa: number): { main: number; jib: number } {
  if (absTwa < NO_GO_DEG) {
    return { main: 0.12, jib: 0.16 };
  }
  const t = clamp((absTwa - NO_GO_DEG) / (180 - NO_GO_DEG), 0, 1);
  return {
    main: lerp(0.08, 1, t),
    jib: lerp(0.14, 0.92, t),
  };
}

export function sheetToBoomDeg(sheet: number): number {
  return lerp(MIN_BOOM_DEG, MAX_BOOM_DEG, clamp(sheet, 0, 1));
}

export function trimQuality(sheet: number, recommended: number): number {
  const error = Math.abs(sheet - recommended);
  return clamp(1 - error / 0.5, 0, 1);
}

/** Side-force arm: high close-hauled to beam, almost none on a run or in irons. */
export function heelingArm(absTwa: number): number {
  if (absTwa < NO_GO_DEG) {
    return 0;
  }
  if (absTwa <= 90) {
    return clamp((absTwa - NO_GO_DEG) / (90 - NO_GO_DEG), 0, 1);
  }
  return lerp(1, 0.1, (absTwa - 90) / 90);
}

function polarDrive(absTwa: number): number {
  if (absTwa < NO_GO_DEG) {
    return 0;
  }
  if (absTwa <= 100) {
    return clamp((absTwa - NO_GO_DEG) / (100 - NO_GO_DEG), 0, 1);
  }
  return lerp(1, 0.38, (absTwa - 100) / 80);
}

export function computeSailing(input: SailingInput): SailingState {
  const twa = trueWindAngle(input.windFrom, input.heading);
  const absTwa = Math.abs(twa);
  const luffing = absTwa < NO_GO_DEG;
  const recommended = recommendedSheets(absTwa);
  const mainQuality = luffing ? 0 : trimQuality(input.mainSheet, recommended.main);
  const jibQuality = luffing ? 0 : trimQuality(input.jibSheet, recommended.jib);
  const quality = mainQuality * 0.62 + jibQuality * 0.38;
  const speedFactor = clamp(input.windSpeed / DEFAULT_WIND_SPEED, 0, 1.85);
  const arm = heelingArm(absTwa);
  const side = luffing ? 0 : Math.sign(twa);
  const heelDeg = MAX_HEEL_DEG * arm * quality * speedFactor * side;
  const mainBoomDeg = side * -sheetToBoomDeg(input.mainSheet);
  const jibDeg = side * -sheetToBoomDeg(input.jibSheet) * 0.82;
  const drive = polarDrive(absTwa) * quality * clamp(speedFactor, 0, 1);
  const billow = luffing ? 0.08 : lerp(0.22, 1, quality);

  return {
    twa,
    absTwa,
    tack: classifyTack(twa),
    pointOfSail: classifyPointOfSail(twa),
    recommendedMainSheet: recommended.main,
    recommendedJibSheet: recommended.jib,
    mainQuality,
    jibQuality,
    trimQuality: quality,
    luffing,
    mainBoomDeg,
    jibDeg,
    heelDeg,
    drive,
    billow,
  };
}
