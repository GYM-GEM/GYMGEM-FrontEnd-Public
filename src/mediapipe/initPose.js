import { Pose } from '@mediapipe/pose';

/**
 * Initializes and returns a configured Pose instance.
 * Singleton pattern is not strictly used here, but we return a fresh instance.
 * @returns {Pose} Configured MediaPipe Pose instance
 */
export const initPose = () => {
  const pose = new Pose({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });

  pose.setOptions({
    modelComplexity: 1, // 0 = Fast, 1 = Balanced, 2 = Accurate
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  return pose;
};
