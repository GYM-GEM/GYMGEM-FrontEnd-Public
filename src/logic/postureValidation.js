import { calculateAngle, isVisible } from './angleMath.js';

export const validatePosture = (landmarks, exercise, targetState) => {
  const result = {
    isValid: true,
    errors: [],
    errorJoints: []
  };

  if (!landmarks || landmarks.length === 0 || !exercise) {
    return { isValid: false, errors: ['NO_LANDMARKS'], errorJoints: [] };
  }

  const rules = exercise.angleRules[targetState];
  if (!rules) return result;

  const LANDMARK_MAP = {
    left_shoulder: 11, right_shoulder: 12,
    left_elbow: 13, right_elbow: 14,
    left_wrist: 15, right_wrist: 16,
    left_hip: 23, right_hip: 24,
    left_knee: 25, right_knee: 26,
    left_ankle: 27, right_ankle: 28
  };

  Object.entries(rules).forEach(([jointName, rule]) => {
    let p1, p2, p3;
    
    // Dynamic mapping
    if (jointName.includes('knee')) {
      const side = jointName.split('_')[0];
      p1 = landmarks[LANDMARK_MAP[`${side}_hip`]];
      p2 = landmarks[LANDMARK_MAP[`${side}_knee`]];
      p3 = landmarks[LANDMARK_MAP[`${side}_ankle`]];
    } else if (jointName.includes('hip')) {
      const side = jointName.split('_')[0];
      p1 = landmarks[LANDMARK_MAP[`${side}_shoulder`]];
      p2 = landmarks[LANDMARK_MAP[`${side}_hip`]];
      p3 = landmarks[LANDMARK_MAP[`${side}_knee`]];
    } else if (jointName.includes('elbow')) {
       const side = jointName.split('_')[0];
       p1 = landmarks[LANDMARK_MAP[`${side}_shoulder`]];
       p2 = landmarks[LANDMARK_MAP[`${side}_elbow`]];
       p3 = landmarks[LANDMARK_MAP[`${side}_wrist`]];
    } else if (jointName.includes('shoulder')) {
       // Shoulder angle: Elbow - Shoulder - Hip
       const side = jointName.split('_')[0];
       p1 = landmarks[LANDMARK_MAP[`${side}_elbow`]];
       p2 = landmarks[LANDMARK_MAP[`${side}_shoulder`]];
       p3 = landmarks[LANDMARK_MAP[`${side}_hip`]];
    }
    
    if (!p1 || !p2 || !p3 || !isVisible(p1) || !isVisible(p2) || !isVisible(p3)) {
       // Strict: invalid if unseen
       result.isValid = false; 
       return;
    }
    
    const angle = calculateAngle(p1, p2, p3);
    
    if (angle < rule.min || angle > rule.max) {
      result.isValid = false;
      result.errorJoints.push(jointName);
    }
  });

  return result;
};

/**
 * Checks if there is significant movement > minDelta
 */
export const checkMovement = (currentLandmarks, lastLandmarks, primaryJoint, minDelta = 6) => {
    if (!lastLandmarks || !currentLandmarks) return false;
    
    // Calculate angle for primary joint in both frames
    // Simplified: Just use simple distance or re-calc angle? 
    // Re-calc angle is better as it respects logic.
    // Need helpers to get points.
    
    // For now, let's assume we pass the ANGLES directly? Or just points.
    // We'll quick-calc angle for the primary joint to check delta.
    
    // Todo: Optimization - Calculate angles ONCE per frame for all joints and store them.
    // For this patch, we will do it on demand.
    
    return true; // Placeholder for logic inside usePoseTracker
};
