/**
 * Applies Exponential Moving Average (EMA) smoothing to landmarks.
 * @param {object} currentLandmarks - The raw landmarks from MediaPipe
 * @param {object} previousLandmarks - The smoothed landmarks from the previous frame
 * @param {number} alpha - Smoothing factor (0.0 - 1.0). Lower = more smoothing, higher = more responsive.
 * @returns {object} Smoothed landmarks
 */
export const smoothLandmarks = (currentLandmarks, previousLandmarks, alpha = 0.5) => {
  if (!previousLandmarks || previousLandmarks.length === 0) {
    return currentLandmarks;
  }

  return currentLandmarks.map((point, index) => {
    const prevPoint = previousLandmarks[index];
    
    if (!prevPoint) return point;

    return {
      ...point,
      x: point.x * alpha + prevPoint.x * (1 - alpha),
      y: point.y * alpha + prevPoint.y * (1 - alpha),
      z: point.z * alpha + prevPoint.z * (1 - alpha),
      visibility: point.visibility // Don't smooth visibility, take current
    };
  });
};
