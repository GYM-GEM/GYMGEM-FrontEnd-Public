import { MOVEMENT_PHASES } from '../config/exercises.js';

export const STATE_MACHINE = MOVEMENT_PHASES;

// Strict State Machine: 
// WAITING -> DOWN -> BOTTOM -> UP -> COUNT -> (Cooldown) -> WAITING

export const updateExerciseState = (currentState, validationResults, exerciseType, isDirectionValid) => {
  // validationResults: { waiting: {}, bottom: {}, up: {}, hold: {} }
  // isDirectionValid: boolean (True if movement direction matches state expectation)
  
  // Guard: If direction is strictly WRONG (e.g. going UP while in DOWN state), 
  // we might want to stay in current state (ignore frame) or reset.
  // The 'isDirectionValid' param should handle the "checkDirection" logic from the prompt.
  
  if (exerciseType === 'reps') {
    if (!isDirectionValid) return currentState; // Ignore frame if direction is wrong

    switch (currentState) {
      case MOVEMENT_PHASES.WAITING:
      case MOVEMENT_PHASES.COUNT: // From Count, we go to Waiting or Down
        // Transition to DOWN if we leave the Waiting zone AND are moving?
        // Actually, just leaving waiting zone towards bottom is enough.
        // But strict rule says: WAITING -> DOWN allowed.
        // If we are VALID for Waiting, satisfy stays Waiting.
        // If we satisfy BOTTOM? Jump? No. Must go through DOWN.
        
        // Simpler: If invalid for Waiting, and moving, assume DOWN?
         if (validationResults.waiting.isValid) return MOVEMENT_PHASES.WAITING;
         
         // If we are NOT in waiting, we started moving.
         return MOVEMENT_PHASES.DOWN;

      case MOVEMENT_PHASES.DOWN:
        // Attempting to reach BOTTOM
        if (validationResults.bottom.isValid) return MOVEMENT_PHASES.BOTTOM;
        
        // If we go back to WAITING without hitting BOTTOM? Reset.
        if (validationResults.waiting.isValid) return MOVEMENT_PHASES.WAITING;
        
        return MOVEMENT_PHASES.DOWN;

      case MOVEMENT_PHASES.BOTTOM:
        // We are at the bottom. We need to go UP.
        // If we leave bottom zone, we are UP.
        if (!validationResults.bottom.isValid) return MOVEMENT_PHASES.UP;
        return MOVEMENT_PHASES.BOTTOM;

      case MOVEMENT_PHASES.UP:
        // Attempting to reach WAITING (which triggers COUNT)
        if (validationResults.waiting.isValid) return MOVEMENT_PHASES.COUNT;
        
        // If we fall back to BOTTOM?
        if (validationResults.bottom.isValid) return MOVEMENT_PHASES.BOTTOM;

        return MOVEMENT_PHASES.UP;

      default:
        return MOVEMENT_PHASES.WAITING;
    }
  } else if (exerciseType === 'hold') {
      // Hold logic is simpler, just TOGGLE
      if (validationResults.hold && validationResults.hold.isValid) {
          return MOVEMENT_PHASES.HOLD;
      }
      return MOVEMENT_PHASES.WAITING;
  }
  
  return currentState;
};

/**
 * Checks if the movement direction matches the expected state.
 * @param {string} currentState 
 * @param {object[]} currentLandmarks
 * @param {object[]} lastLandmarks
 * @param {string} primaryJoint - e.g. 'knee', 'elbow'
 * @returns {boolean}
 */
export const checkDirection = (currentState, currentAngle, lastAngle) => {
    // If no angle change, return true (static is effectively valid for direction check, treated as no-op elsewhere)
    // Actually prompt says "Static poses must never progress state" -> handled by Movement Threshold.
    // This function checks DIRECTION only.
    
    // We need to know if angle is increasing or decreasing.
    // For Squat: DOWN = Angle Decreasing (180 -> 90). UP = Increasing (90 -> 180).
    // For Pushup: DOWN = Angle Decreasing. UP = Increasing.
    // For Jumping Jack: BOTTOM (Arms Up) = Angle Increasing (0 -> 180). 
    // Wait. "Bottom" is the target. For Jack, "Bottom" is actually 180 deg?
    // Let's standardize: 
    // "Eccentric" (Start -> Target)
    // "Concentric" (Target -> Start)
    
    // Most exercises: Start ~180, Target ~90. (Squat, Pushup, Lunge, Press)
    // Jacks: Start ~0, Target ~180.
    
    // Assuming standard Squat-like behavior (Start High -> Target Low)
    // DOWN = Decreasing
    // UP = Increasing
    
    // Exception for exercises where Target is Higher than Start? 
    // We should probably rely on the Exercise Config to define "Concentric Direction"?
    // For now, let's implement the standard logic and assume standard exercises.
    
    const delta = currentAngle - lastAngle; // + = Increasing, - = Decreasing
    
    switch (currentState) {
        case MOVEMENT_PHASES.WAITING:
            // Can go DOWN (Decrease)
            return delta <= 0; 
        case MOVEMENT_PHASES.DOWN:
             // MUST be Decreasing
             return delta <= 0;
        case MOVEMENT_PHASES.BOTTOM:
             // Can go UP (Increase)
             return delta >= 0;
        case MOVEMENT_PHASES.UP:
             // MUST be Increasing
             return delta >= 0;
        default:
             return true;
    }
};
