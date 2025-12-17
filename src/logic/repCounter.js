import { MOVEMENT_PHASES } from '../config/exercises.js';

/**
 * Handles Rep Counting with strict Cooldown
 * @param {string} newState 
 * @param {string} prevState 
 * @param {object} currentStats 
 * @param {object} refStorage - pass a mutable ref to store cooldown frames
 * @returns {object} { reps, holdTime, didCount, shouldResetState }
 */
export const handleRepCounting = (newState, prevState, currentStats, refStorage, deltaTime = 0) => {
  let { reps, holdTime } = currentStats;
  let didCount = false;
  let shouldResetState = false;

  // Init cooldown if missing
  if (typeof refStorage.cooldownFrames === 'undefined') {
      refStorage.cooldownFrames = 0;
  }

  // Handle Cooldown Decrement
  if (refStorage.cooldownFrames > 0) {
      refStorage.cooldownFrames--;
      if (refStorage.cooldownFrames === 0) {
          shouldResetState = true; // Force back to WAITING after cooldown
      }
      // If in cooldown, we ignore everything else.
      return { reps, holdTime, didCount, shouldResetState, inCooldown: true };
  }

  // Rep Logic: Transition to COUNT
  if (newState === MOVEMENT_PHASES.COUNT && prevState !== MOVEMENT_PHASES.COUNT) {
    reps++;
    didCount = true;
    refStorage.cooldownFrames = 30; // 30 frames ~ 0.5s - 1s cooldown (Prompt said 10, increasing for safety)
  }

  // Hold Logic
  if (newState === MOVEMENT_PHASES.HOLD) {
    holdTime += deltaTime;
  }

  return { reps, holdTime, didCount, shouldResetState, inCooldown: false };
};
