/** Wrap to [0, 360). */
export function wrap360(deg: number): number {
  const wrapped = deg % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

/** Wrap to (-180, 180]. */
export function wrap180(deg: number): number {
  const wrapped = wrap360(deg);
  return wrapped > 180 ? wrapped - 360 : wrapped;
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * True wind angle in degrees.
 * 0 = bow into the wind, +90 = wind from starboard, -90 = wind from port.
 */
export function trueWindAngle(windFrom: number, heading: number): number {
  return wrap180(windFrom - heading);
}

/** Heading that holds a given TWA for the current wind-from direction. */
export function headingForTwa(windFrom: number, twa: number): number {
  return wrap360(windFrom - twa);
}
