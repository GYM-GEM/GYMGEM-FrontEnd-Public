import { useRef, useEffect, useState, useCallback } from 'react';
import { initPose } from '../mediapipe/initPose.js';
import { drawSkeleton } from '../mediapipe/drawSkeleton.js';
import { smoothLandmarks } from '../logic/landmarkSmoothing.js';
import { validatePosture } from '../logic/postureValidation.js';
import { updateExerciseState, checkDirection, STATE_MACHINE } from '../logic/stateMachine.js';
import { handleRepCounting } from '../logic/repCounter.js';
import { EXERCISES, MOVEMENT_PHASES } from '../config/exercises.js';
import { calculateAngle, isVisible } from '../logic/angleMath.js';

export const usePoseTracker = (videoRef, isCameraActive, activeExerciseId) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const poseRef = useRef(null);
  
  // Logic State - Mutable
  const logicState = useRef({
    currentState: MOVEMENT_PHASES.WAITING,
    stats: { reps: 0, holdTime: 0 },
    history: [], 
    lastProcessedTime: 0,
    countdownValue: 3, 
    isCountingDown: false,
    startTime: 0,
    cooldownFrames: 0,
    lastAngles: {} // Store last angles for direction/movement check
  });

  const [trackerState, setTrackerState] = useState({
    stats: { reps: 0, holdTime: 0 },
    feedback: 'Ready',
    status: 'neutral',
    countdown: null,
    isLoading: true
  });

  const onResults = useCallback((results) => {
    if (!canvasRef.current || !videoRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const { width, height } = canvasRef.current;
    const now = performance.now();
    const deltaTime = now - logicState.current.lastProcessedTime;

    if (deltaTime > 200 && logicState.current.lastProcessedTime !== 0) {
       // logicState.current.lastProcessedTime = now; // optional skip
    }

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(results.image, 0, 0, width, height);

    if (!results.poseLandmarks) {
      ctx.restore();
      return;
    }

    // 1. Smooth Landmarks
    const smoothedLandmarks = smoothLandmarks(
      results.poseLandmarks, 
      logicState.current.history[0], 
      0.6
    );
    logicState.current.history = [smoothedLandmarks];

    const exercise = EXERCISES[activeExerciseId];
    
    // 2. Countdown Logic
    if (logicState.current.countdownValue > 0) {
        drawSkeleton(ctx, smoothedLandmarks);
        if (!logicState.current.isCountingDown) {
            logicState.current.isCountingDown = true;
            logicState.current.startTime = now;
        }
        const elapsed = (now - logicState.current.startTime) / 1000;
        const remaining = Math.ceil(3 - elapsed);
        if (remaining <= 0) {
            logicState.current.countdownValue = 0;
            logicState.current.isCountingDown = false;
        } else if (remaining !== logicState.current.countdownValue) {
             logicState.current.countdownValue = remaining;
             setTrackerState(prev => ({ ...prev, countdown: remaining }));
        }
        ctx.restore();
        return;
    }

    // 3. Helpers to get Joint Points & Calculate Primary Angle
    const getJointPoints = (jointName) => {
        // Simplified mapping, same as in validation...
        // For efficiency, redundant code here is acceptable to avoid rigid deps, or better import it.
        // We'll calculate angle directly using indices to avoid complexity.
        return null; // TODO: Implement full mapping if needed, or rely on stored Angle
    };

    // Calculate Primary Angle for Direction/Movement Check
    let currentPrimaryAngle = 0;
    // We need to know which joint is primary.
    // Let's use left_knee/right_knee average for squat? Or just Left.
    // Exercise config says 'primaryJoint': 'knee'.
    // We'll try to find 'left_primary' and 'right_primary'.
    
    // We need to run validation FIRST to get current angles? 
    // Validation returns validity. It doesn't return raw angles easily unless we mod it.
    // FAST PATCH: Just re-calculate the angle for the FIRST rule in 'waiting' to use as proxy for movement.
    // or better, rely on validatePosture to return errorJoints?
    
    // Let's implement robust angle calc for primary joint here.
    const LANDMARK_MAP = {
        left_shoulder: 11, right_shoulder: 12,
        left_elbow: 13, right_elbow: 14,
        left_wrist: 15, right_wrist: 16,
        left_hip: 23, right_hip: 24,
        left_knee: 25, right_knee: 26,
        left_ankle: 27, right_ankle: 28
    };

    const getPointsForJoint = (side, joint) => {
        if (joint === 'knee') return [LANDMARK_MAP[`${side}_hip`], LANDMARK_MAP[`${side}_knee`], LANDMARK_MAP[`${side}_ankle`]];
        if (joint === 'elbow') return [LANDMARK_MAP[`${side}_shoulder`], LANDMARK_MAP[`${side}_elbow`], LANDMARK_MAP[`${side}_wrist`]];
        if (joint === 'shoulder') return [LANDMARK_MAP[`${side}_elbow`], LANDMARK_MAP[`${side}_shoulder`], LANDMARK_MAP[`${side}_hip`]];
        return null;
    };
    
    const idxs = getPointsForJoint('left', exercise.primaryJoint || 'knee'); // Default left
    let validMovement = false;
    let isDirectionValid = true;

    if (idxs && smoothedLandmarks[idxs[0]] && smoothedLandmarks[idxs[1]] && smoothedLandmarks[idxs[2]]) {
        const p1 = smoothedLandmarks[idxs[0]];
        const p2 = smoothedLandmarks[idxs[1]];
        const p3 = smoothedLandmarks[idxs[2]];
        
        currentPrimaryAngle = calculateAngle(p1, p2, p3);
        const lastAngle = logicState.current.lastAngles.primary || currentPrimaryAngle;
        const delta = Math.abs(currentPrimaryAngle - lastAngle);
        
        // MOVEMENT THRESHOLD (6 degrees)
        if (delta > 6) {
            validMovement = true;
        }
        
        // DIRECTION CHECK
        isDirectionValid = checkDirection(logicState.current.currentState, currentPrimaryAngle, lastAngle);
        
        // Update last angle ONLY if significant change? 
        // No, update always? Or update only if movment? 
        // Update always to track smooth curve.
        logicState.current.lastAngles.primary = currentPrimaryAngle;
    } else {
        // If we can't track primary, assume valid? Or fail?
        // Fail safe.
        isDirectionValid = true; 
    }

    // 4. Validation
    const validationWaiting = validatePosture(smoothedLandmarks, exercise, 'waiting');
    const validationBottom = validatePosture(smoothedLandmarks, exercise, 'bottom');
    const validationUp = validatePosture(smoothedLandmarks, exercise, 'up');
    let validationHold = { isValid: false, errors: [], errorJoints: [] };
    if (exercise.type === 'hold') validationHold = validatePosture(smoothedLandmarks, exercise, 'hold');

    const validationResults = {
        waiting: validationWaiting,
        bottom: validationBottom,
        up: validationUp,
        hold: validationHold
    };

    // 5. State Update
    // Pass 'isDirectionValid'. 
    // ALSO: If !validMovement && exercise.type === 'reps', we should prevent state transitions unless waiting->down?
    // Actually, static poses shouldn't progress state.
    
    let newState = logicState.current.currentState;
    
    if (exercise.type === 'reps') {
         // Only update state if there is movement OR we are in WAITING (start) or HOLDING bottom?
         // Actually, if static, we just keep current state.
         // Except: If we are WAITING, we stay WAITING.
         // If we are DOWN, and stop moving, we stay DOWN.
         // Transitions require hitting targets. Targets are hit by angles. 
         // Real issue is Jitter triggers targets. 
         // So, we only execute State Machine if validMovement is true?
         // YES. This stops "Jitter counting".
         
         if (validMovement || logicState.current.currentState === MOVEMENT_PHASES.WAITING) {
             newState = updateExerciseState(
                logicState.current.currentState, 
                validationResults, 
                exercise.type,
                isDirectionValid
             );
         }
    } else {
        newState = updateExerciseState(logicState.current.currentState, validationResults, exercise.type, true);
    }
    
    logicState.current.currentState = newState;

    // 6. Stats & Cooldown
    const statUpdates = handleRepCounting(
        newState, 
        logicState.current.currentState, // This is technically passing NEW as PREV because we just updated it.
        // Wait, we need real PrevState.
        // Fixed: We need to store prevState before update.
        null, // logicState.current.stats, 
        logicState.current, // Pass Ref Storage
        deltaTime
    );
    
    // Correction: We passed wrong prevState. Logic above updated logicState.current.currentState.
    // We need to capture prev before.
    // Retrying logic correctly:
    
    /* 
       const prevState = logicState.current.currentState;
       if (validMovement) { newState = update... } 
       logicState.current.currentState = newState;
       handleRepCounting(newState, prevState...)
    */
   
   // ... (Since I cannot edit previous lines in this single file write, I will just fix the logical flow in the actual code block below properly)

    // 7. Visuals
    // ... (Same as before)
    
    // Draw
    drawSkeleton(ctx, smoothedLandmarks, [], false);
    ctx.restore();

    // Throttled UI
    if (now - logicState.current.lastProcessedTime > 100 || statUpdates.didCount) {
        let msg = "Ready";
        if (newState === MOVEMENT_PHASES.DOWN) msg = "Go Lower";
        if (newState === MOVEMENT_PHASES.BOTTOM) msg = "Hold / Up";
        if (newState === MOVEMENT_PHASES.UP) msg = "Stand Up";
        if (statUpdates.inCooldown) msg = "Cooling...";
        if (statUpdates.didCount) msg = "Good Rep!";
        
        // Use feedback from validation if error
        if (exercise.type === 'reps' && newState === MOVEMENT_PHASES.DOWN && !validationBottom.isValid && validationBottom.errors.length) {
            // Check if we are failing bottom reqs? No, we are aiming for them.
            // Check if we are violating form?
            // This logic needs to be cleaner.
            // For now, minimal msg.
        }

        setTrackerState({
            stats: { reps: statUpdates.reps, holdTime: statUpdates.holdTime },
            feedback: msg,
            status: statUpdates.didCount ? 'correct' : 'neutral',
            countdown: 0,
            isLoading: false
        });
        logicState.current.lastProcessedTime = now;
    }

  }, [activeExerciseId, videoRef]);

  // Wrapper loop
  // ... (Standard)
  
  // Need to fix the logical error in Step 5/6 usage inside the callback:
  
  /* CORRECTED LOGIC BLOCK FOR ONRESULTS: */
  /*
    const prevState = logicState.current.currentState;
    let newState = prevState;
    
    if (exercise.type === 'reps') {
         if (validMovement || prevState === MOVEMENT_PHASES.WAITING) { 
             newState = updateExerciseState(prevState, validationResults, exercise.type, isDirectionValid);
         }
    } else {
         newState = updateExerciseState(prevState, validationResults, exercise.type, true);
    }
    
    logicState.current.currentState = newState;
    
    const statUpdates = handleRepCounting(newState, prevState, logicState.current.stats, logicState.current, deltaTime);
    logicState.current.stats = { reps: statUpdates.reps, holdTime: statUpdates.holdTime };
    
    if (statUpdates.shouldResetState) {
        logicState.current.currentState = MOVEMENT_PHASES.WAITING;
    }
  */

  // Rewriting the return to be valid JS in the file write...
  
  // Re-implementing the actual hook body cleanly below:

  const loop = useCallback(async () => {
    if (!isCameraActive || !videoRef.current || !poseRef.current) return;
    if (videoRef.current.readyState === 4) await poseRef.current.send({ image: videoRef.current });
    if (isCameraActive) requestRef.current = requestAnimationFrame(loop);
  }, [isCameraActive, videoRef]);

  useEffect(() => {
    const pose = initPose();
    pose.onResults((results) => {
        // INLINED LOGIC FOR CORRECTNESS
        if (!canvasRef.current) return;
        const now = performance.now();
        const deltaTime = now - logicState.current.lastProcessedTime;
        
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        if (!results.poseLandmarks) return;
        
        const smoothed = smoothLandmarks(results.poseLandmarks, logicState.current.history[0], 0.6);
        logicState.current.history = [smoothed];
        
        const exercise = EXERCISES[activeExerciseId];
        
        // Countdown
        if (logicState.current.countdownValue > 0) {
            // ... (Simple countdown logic)
             if (!logicState.current.isCountingDown) {
                logicState.current.isCountingDown = true;
                logicState.current.startTime = now;
            }
            const elapsed = (now - logicState.current.startTime) / 1000;
            const remaining = Math.ceil(3 - elapsed);
            if (remaining <= 0) {
                logicState.current.countdownValue = 0;
                logicState.current.isCountingDown = false;
            } else if (remaining !== logicState.current.countdownValue) {
                logicState.current.countdownValue = remaining;
                setTrackerState(prev => ({...prev, countdown: remaining}));
            }
             drawSkeleton(ctx, smoothed);
            return;
        }

        // Movement & Direction
        let isDirectionValid = true;
        let validMovement = false;
        
        // Calc Primary Angle
        const getPts = (joint) => {
             const map = {left_shoulder:11, right_shoulder:12, left_elbow:13, right_elbow:14, left_hip:23, right_hip:24, left_knee:25, right_knee:26, left_ankle:27};
             const s = 'left'; // Default left
             if (joint === 'knee') return [map[`${s}_hip`], map[`${s}_knee`], map[`${s}_ankle`]];
             if (joint === 'elbow') return [map[`${s}_shoulder`], map[`${s}_elbow`], map[`${s}_wrist`]];
             return [map[`${s}_hip`], map[`${s}_knee`], map[`${s}_ankle`]];
        };
        const idxs = getPts(exercise.primaryJoint);
        if (smoothed[idxs[0]] && smoothed[idxs[1]] && smoothed[idxs[2]]) {
            const ang = calculateAngle(smoothed[idxs[0]], smoothed[idxs[1]], smoothed[idxs[2]]);
            const last = logicState.current.lastAngles.primary || ang;
            if (Math.abs(ang - last) > 6) validMovement = true;
            isDirectionValid = checkDirection(logicState.current.currentState, ang, last);
            logicState.current.lastAngles.primary = ang;
        }

        // Validate
        const valRes = {
            waiting: validatePosture(smoothed, exercise, 'waiting'),
            bottom: validatePosture(smoothed, exercise, 'bottom'),
            up: validatePosture(smoothed, exercise, 'up'),
            hold: exercise.type==='hold' ? validatePosture(smoothed, exercise, 'hold') : {}
        };

        // State Update
        const prevState = logicState.current.currentState;
        let newState = prevState;
        if (exercise.type === 'reps') {
            // Strict: Must move to change state, or be waiting
            if (validMovement || prevState === MOVEMENT_PHASES.WAITING) {
                newState = updateExerciseState(prevState, valRes, exercise.type, isDirectionValid);
            }
        } else {
            newState = updateExerciseState(prevState, valRes, exercise.type, true);
        }
        logicState.current.currentState = newState;

        // Rep Count
        const stats = handleRepCounting(newState, prevState, logicState.current.stats, logicState.current, deltaTime);
        logicState.current.stats = { reps: stats.reps, holdTime: stats.holdTime };
        if (stats.shouldResetState) logicState.current.currentState = MOVEMENT_PHASES.WAITING;

        // Draw & UI
        // Construct Angle Data
        let angleData = null;
        if (idxs && smoothed[idxs[0]] && smoothed[idxs[1]] && smoothed[idxs[2]]) {
             const pJoint = exercise.primaryJoint || 'knee';
             const jointName = `left_${pJoint}`; // Defaulting to left for visualization
             
             // Determine target rule based on exercise type
             let targetRule = null;
             if (exercise.type === 'hold' && exercise.angleRules.hold) {
                 targetRule = exercise.angleRules.hold[jointName];
             } else if (exercise.angleRules.bottom) {
                 targetRule = exercise.angleRules.bottom[jointName];
             }

             angleData = {
                 joint: jointName,
                 current: logicState.current.lastAngles.primary, // calculated above
                 target: targetRule
             };
        }

        drawSkeleton(ctx, smoothed, [], false, angleData);
        
        if (now - logicState.current.lastProcessedTime > 100 || stats.didCount) {
             let fb = "Ready";
             if (newState === MOVEMENT_PHASES.DOWN) fb = "Go Lower";
             if (newState === MOVEMENT_PHASES.BOTTOM) fb = "Push Up";
             if (stats.didCount) fb = "Good job!";
             
             setTrackerState({
                 stats: logicState.current.stats,
                 feedback: fb,
                 status: stats.didCount ? 'correct' : 'neutral',
                 countdown: 0,
                 isLoading: false
             });
             logicState.current.lastProcessedTime = now;
        }
    });
    
    poseRef.current = pose;
    return () => poseRef.current && poseRef.current.close();
  }, [activeExerciseId, videoRef]);

  // Init Loop
  useEffect(() => {
     if (isCameraActive) {
         logicState.current = {
             currentState: MOVEMENT_PHASES.WAITING,
             stats: { reps: 0, holdTime: 0 },
             history: [],
             lastProcessedTime: 0,
             countdownValue: 3,
             isCountingDown: false,
             startTime: 0,
             cooldownFrames: 0,
             lastAngles: {}
         };
         setTrackerState(s => ({...s, countdown: 3, stats: {reps:0, holdTime:0}}));
         requestRef.current = requestAnimationFrame(loop);
     } else {
         if (requestRef.current) cancelAnimationFrame(requestRef.current);
     }
     return () => requestRef && cancelAnimationFrame(requestRef.current);
  }, [isCameraActive, loop]);

  return { canvasRef, trackerState };
};
