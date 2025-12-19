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
    lastAngles: {},
    // Smart Partner Additions
    calibratedROM: null,
    phaseStartTime: 0,
    isCalibrating: false
  });

  const [trackerState, setTrackerState] = useState({
    stats: { reps: 0, holdTime: 0 },
    feedback: 'Ready',
    status: 'neutral',
    countdown: null,
    isLoading: true,
    tempo: 'Normal' // 'Fast', 'Slow', 'Normal'
  });

  const loop = useCallback(async () => {
    if (!isCameraActive) return;
    
    // Continue loop even if videoRef/poseRef are briefly null to prevent termination
    if (videoRef.current && poseRef.current && videoRef.current.readyState === 4) {
      await poseRef.current.send({ image: videoRef.current });
    }
    
    requestRef.current = requestAnimationFrame(loop);
  }, [isCameraActive, videoRef]);

  useEffect(() => {
    const pose = initPose();
    pose.onResults((results) => {
        if (!canvasRef.current) return;
        const now = performance.now();
        const deltaTime = now - logicState.current.lastProcessedTime;
        
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
        
        const exercise = EXERCISES[activeExerciseId];
        
        // Countdown - MOVED ABOVE LANDMARK CHECK
        if (logicState.current.countdownValue > 0) {
             if (!logicState.current.isCountingDown) {
                logicState.current.isCountingDown = true;
                logicState.current.startTime = now;
            }
            const elapsed = (now - logicState.current.startTime) / 1000;
            const remaining = Math.ceil(3 - elapsed);
            if (remaining <= 0) {
                logicState.current.countdownValue = 0;
                logicState.current.isCountingDown = false;
                setTrackerState(prev => ({...prev, countdown: 0, isLoading: false, feedback: 'Ready!'}));
                // Allow continuation to tracking in the same frame
            } else {
                if (remaining !== logicState.current.countdownValue) {
                    logicState.current.countdownValue = remaining;
                    setTrackerState(prev => ({...prev, countdown: remaining}));
                }
                return;
            }
        }

        if (!results.poseLandmarks) {
             if (now - logicState.current.lastProcessedTime > 1000) {
                 setTrackerState(prev => ({...prev, feedback: "Waiting for person...", status: 'neutral'}));
                 logicState.current.lastProcessedTime = now;
             }
             return;
        }
        const smoothed = smoothLandmarks(results.poseLandmarks, logicState.current.history[0], 0.6);
        logicState.current.history = [smoothed];

        // Movement & Direction
        let isDirectionValid = true;
        let validMovement = false;
        
        // Calc Primary Angle
        const getPts = (joint) => {
             const map = {
                 left_shoulder:11, right_shoulder:12, 
                 left_elbow:13, right_elbow:14, 
                 left_wrist:15, right_wrist:16,
                 left_hip:23, right_hip:24, 
                 left_knee:25, right_knee:26, 
                 left_ankle:27, right_ankle:28
             };
             const s = 'left'; // Default left
             if (joint === 'knee') return [map[`${s}_hip`], map[`${s}_knee`], map[`${s}_ankle`]];
             if (joint === 'elbow') return [map[`${s}_shoulder`], map[`${s}_elbow`], map[`${s}_wrist`]];
             if (joint === 'shoulder') return [map[`${s}_elbow`], map[`${s}_shoulder`], map[`${s}_hip`]];
             if (joint === 'hip') return [map[`${s}_shoulder`], map[`${s}_hip`], map[`${s}_knee`]];
             return [map[`${s}_hip`], map[`${s}_knee`], map[`${s}_ankle`]];
        };
        const idxs = getPts(exercise.primaryJoint);
        const lastAnglesPrev = logicState.current.lastAngles.primary;
        if (smoothed[idxs[0]] && smoothed[idxs[1]] && smoothed[idxs[2]]) {
            const ang = calculateAngle(smoothed[idxs[0]], smoothed[idxs[1]], smoothed[idxs[2]]);
            const last = lastAnglesPrev || ang;
            if (Math.abs(ang - last) > 6) validMovement = true;
            logicState.current.lastAngles.primary = ang;
        }

        // Validate
        const valRes = {
            waiting: validatePosture(smoothed, exercise, 'waiting'),
            bottom: validatePosture(smoothed, exercise, 'bottom'),
            up: validatePosture(smoothed, exercise, 'up'),
            hold: exercise.type==='hold' ? validatePosture(smoothed, exercise, 'hold') : {}
        };

        // SMART PARTNER: 1. Dynamic Calibration Phase
        if (logicState.current.calibratedROM === null && !logicState.current.isLoading) {
            if (!logicState.current.isCalibrating) {
                logicState.current.isCalibrating = true;
                logicState.current.startTime = now;
            }
            const elapsed = (now - logicState.current.startTime) / 1000;
            if (elapsed < 3) {
                const currentAng = logicState.current.lastAngles.primary || 180;
                // Track deepest point during calibration
                if (logicState.current.maxROM === undefined || 
                    (exercise.id === 'jumping_jack' ? currentAng > logicState.current.maxROM : currentAng < logicState.current.maxROM)) {
                    logicState.current.maxROM = currentAng;
                }
                setTrackerState(prev => ({...prev, feedback: "Calibration: Go to Max Depth", status: 'neutral'}));
                return;
            } else {
                logicState.current.calibratedROM = logicState.current.maxROM;
                setTrackerState(prev => ({...prev, feedback: "Calibration Done!", status: 'correct'}));
            }
        }

        // Logic for Dynamic Targets
        const dynamicBottomMin = logicState.current.calibratedROM ? Math.min(logicState.current.calibratedROM + 10, 110) : exercise.angleRules.bottom[`left_${exercise.primaryJoint}`].min;

        // State Update
        const prevState = logicState.current.currentState;
        let newState = prevState;
        let currentTempoFeedback = 'Normal';

        if (exercise.type === 'reps') {
            if (validMovement || prevState === MOVEMENT_PHASES.WAITING) {
                const primaryAngleName = `left_${exercise.primaryJoint}`;
                const waitingRule = exercise.angleRules.waiting[primaryAngleName];
                const bottomRule = exercise.angleRules.bottom[primaryAngleName];
                const isIncreasingExpected = bottomRule.min > waitingRule.min;
                
                const currentIsDirectionValid = checkDirection(prevState, logicState.current.lastAngles.primary, lastAnglesPrev, isIncreasingExpected);
                newState = updateExerciseState(prevState, valRes, exercise.type, currentIsDirectionValid);
                
                // SMART PARTNER: 3. Tempo Tracking
                if (newState !== prevState) {
                    const phaseDuration = now - logicState.current.phaseStartTime;
                    
                    // If moving from WAITING to DOWN too fast
                    if (prevState === MOVEMENT_PHASES.WAITING && newState === MOVEMENT_PHASES.DOWN) {
                        logicState.current.phaseStartTime = now;
                    }
                    
                    if (prevState === MOVEMENT_PHASES.DOWN && newState === MOVEMENT_PHASES.BOTTOM) {
                        if (phaseDuration < 800) { // Less than 0.8s for eccentric phase is usually "too fast"
                            currentTempoFeedback = 'Too Fast';
                        }
                    }
                    logicState.current.phaseStartTime = now;
                }
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
             
             // Prioritize Tempo/Calibration feedback
             const finalFB = currentTempoFeedback !== 'Normal' ? `Slow down! ${fb}` : fb;

             setTrackerState({
                 stats: logicState.current.stats,
                 feedback: finalFB,
                 status: stats.didCount ? 'correct' : (currentTempoFeedback !== 'Normal' ? 'warning' : 'neutral'),
                 countdown: 0,
                 isLoading: false,
                 tempo: currentTempoFeedback
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
             lastAngles: {},
             calibratedROM: null,
             phaseStartTime: 0,
             isCalibrating: false
         };
         setTrackerState(s => ({...s, countdown: 3, stats: {reps:0, holdTime:0}, tempo: 'Normal'}));
         requestRef.current = requestAnimationFrame(loop);
     }
     return () => {
         if (requestRef.current) cancelAnimationFrame(requestRef.current);
     };
  }, [isCameraActive, loop]);

  return { canvasRef, trackerState };
};
