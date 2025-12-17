/**
 * Calculates the angle between three points (A, B, C) where B is the vertex.
 * @param {object} a - Point A {x, y}
 * @param {object} b - Point B (vertex) {x, y}
 * @param {object} c - Point C {x, y}
 * @returns {number} Angle in degrees (0-180)
 */
export const calculateAngle = (a, b, c) => {
  if (!a || !b || !c) return 0;
  
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  
  return angle;
};

/**
 * Normalizes a landmark's probability/visibility
 * @param {object} landmark - MediaPipe landmark
 * @returns {boolean} True if visible/confident
 */
export const isVisible = (landmark, threshold = 0.5) => {
  return landmark && (landmark.visibility > threshold || landmark.score > threshold);
};
