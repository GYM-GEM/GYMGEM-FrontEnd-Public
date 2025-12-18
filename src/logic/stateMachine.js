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
export const checkDirection = (currentState, currentAngle, lastAngle, isIncreasingExpected = false) => {
    const delta = currentAngle - lastAngle; // + = Increasing, - = Decreasing
    if (Math.abs(delta) < 0.1) return true; // Static is valid for direction check (neutral)

    const isDecreasing = delta < 0;
    const isIncreasing = delta > 0;

    switch (currentState) {
        case MOVEMENT_PHASES.WAITING:
        case MOVEMENT_PHASES.DOWN:
             // Expected direction for eccentric phase
             return isIncreasingExpected ? isIncreasing : isDecreasing;
        case MOVEMENT_PHASES.BOTTOM:
        case MOVEMENT_PHASES.UP:
             // Expected direction for concentric phase
             return isIncreasingExpected ? isDecreasing : isIncreasing;
        default:
             return true;
    }
};
