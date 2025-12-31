import React, { useState, useEffect, useRef } from 'react';
import CameraCanvas from './CameraCanvas';
import RightSidebar from './RightSidebar';
import SessionSummary from './SessionSummary';
import { useWebcam } from '../../hooks/useWebcam';
import { usePoseTracker } from '../../hooks/usePoseTracker';
import { EXERCISES } from '../../config/exercises';
import FooterDash from '../Dashboard/FooterDash';
import AiNavBar from './AiNavBar';
import StatusOverlay from './StatusOverlay';

const AITrainer = () => {
  // 1. User State & Persistence (Authenticated User)
  const [username, setUsername] = useState('Guest');

  // Refs for tracking changes and avoiding duplicate speech
  const lastRepRef = useRef(0);
  const lastFeedbackRef = useRef('');
  const voiceEnabled = useRef(true); // Can be linked to a UI toggle later

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.username) {
          setUsername(parsedUser.username);
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  const [activeExerciseId, setActiveExerciseId] = useState(() => localStorage.getItem('last_exercise') || 'squat');

  // Save Exercise Selection
  useEffect(() => {
    localStorage.setItem('last_exercise', activeExerciseId);
  }, [activeExerciseId]);

  const [sessionFinished, setSessionFinished] = useState(false);
  const [lastSessionStats, setLastSessionStats] = useState(null);

  // Custom Hooks
  const { videoRef, isCameraActive, startCamera, stopCamera: internalStopCamera, error } = useWebcam();

  // This hook connects the video ref to the pose logic and returns the canvas ref and state
  const { canvasRef, trackerState } = usePoseTracker(videoRef, isCameraActive, activeExerciseId);

  const activeExercise = EXERCISES[activeExerciseId];

  // Handle Stop & Save
  const handleStop = () => {
    const stats = trackerState.stats;
    setLastSessionStats(stats);
    setSessionFinished(true);
    internalStopCamera();

    // Save to History Only if meaningful (reps > 0 or time > 5s)
    if (stats.reps > 0 || stats.holdTime > 5000) {
      const newSession = {
        id: crypto.randomUUID(),
        user: username,
        exercise: activeExercise.name,
        type: activeExercise.type,
        reps: stats.reps,
        holdTime: stats.holdTime,
        date: new Date().toISOString()
      };

      const history = JSON.parse(localStorage.getItem('ai_trainer_history') || '[]');
      history.push(newSession);
      localStorage.setItem('ai_trainer_history', JSON.stringify(history));
    }
  };

  // Load recent history for the sidebar
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('ai_trainer_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored).reverse());
      } catch (e) { console.error(e); }
    }
  }, [sessionFinished]);

  const handleStart = () => {
    setSessionFinished(false);
    setLastSessionStats(null);
    lastRepRef.current = 0;
    lastFeedbackRef.current = 'Ready';
    startCamera();
  };

  // Voice Feedback Logic
  useEffect(() => {
    if (!isCameraActive || !voiceEnabled.current) return;

    const speak = (text) => {
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.2; // Slightly faster for real-time response
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Cancel any ongoing speech to prioritize the most recent (e.g., immediate feedback)
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    // 1. Speak Rep Count
    if (trackerState.stats.reps > 0 && trackerState.stats.reps !== lastRepRef.current) {
      speak(trackerState.stats.reps.toString());
      lastRepRef.current = trackerState.stats.reps;
    }

    // 2. Speak Feedback (e.g., "Go Lower", "Good job!")
    const currentFB = trackerState.feedback;
    if (currentFB && currentFB !== lastFeedbackRef.current) {
      // Don't speak generic "Ready" or "Waiting" to avoid noise
      const genericMessages = ['Ready', 'Waiting for person...', 'Ready!'];
      if (!genericMessages.includes(currentFB)) {
        speak(currentFB);
      }
      lastFeedbackRef.current = currentFB;
    }
  }, [trackerState.stats.reps, trackerState.feedback, isCameraActive]);

  return (
    <>
      <AiNavBar />
      <div className="w-full max-w-7xl mx-auto px-4 py-6">

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 lg:h-[calc(100vh-140px)] lg:min-h-[600px]">

          {/* Left Column: Camera Feed (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-red-500/50 shadow-lg"></div>
                <span className="font-bold text-gray-900 tracking-tight">Live AI Tracking</span>
              </div>
              {/* Mobile Controls (Only visible on small screens if needed, otherwise hidden) */}
            </div>

            {/* Video Container */}
            <div className="flex flex-col gap-4">

              {/* VIDEO */}
              <div
                className={`relative w-full aspect-video rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl
    border transition-colors duration-300
    ${isCameraActive ? 'bg-black border-white/30' : 'bg-white border-gray-200'}
  `}
              >
                <CameraCanvas videoRef={videoRef} ref={canvasRef} />

                {/* Status Overlay - Visible when camera is active */}
                {isCameraActive && (
                  <StatusOverlay
                    stats={trackerState.stats}
                    feedback={trackerState.feedback}
                    status={trackerState.status}
                    countdown={trackerState.countdown}
                    exerciseType={activeExercise.type}
                  />
                )}

                {/* Action Button Overlays - Shown when camera is off */}
                {!isCameraActive && (
                  <div className="absolute inset-0 bg-white z-30 flex flex-col">
                    {/* Tutorial / Preview Section */}
                    <div className="flex-1 relative overflow-hidden group">
                      <img
                        src={activeExercise.gifUrl}
                        alt={activeExercise.name}
                        className="w-full h-full object-contain bg-gray-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                      {/* Play Icon Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[2px]">
                        <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-[#ff8211] border-b-[12px] border-b-transparent ml-2"></div>
                        </div>
                      </div>
                    </div>

                    {/* Info Bar */}
                    <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                          {sessionFinished ? "Great Session!" : activeExercise.name}
                        </p>
                        <p className="text-gray-500 font-medium">
                          {sessionFinished
                            ? `You completed ${lastSessionStats?.reps || 0} reps. Start again?`
                            : `Tutorial: Follow this form to count your ${activeExercise.id}s`}
                        </p>
                      </div>

                      {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 animate-pulse">
                          ⚠️ {error}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>


              {/* ACTION BUTTON (Start / Stop) */}
              <button
                onClick={isCameraActive ? handleStop : handleStart}
                className={`w-full py-4 rounded-2xl text-lg font-bold
      transition-all duration-300
      shadow-xl active:scale-95
      ${isCameraActive
                    ? 'bg-[#F2310F] hover:bg-[#d12a0d] text-white '
                    : 'bg-[#ff8211] hover:bg-[#e6760f] text-white '
                  }
    `}
              >
                {isCameraActive ? 'Stop Camera' : 'Start New Session'}
              </button>

            </div>

          </div>

          {/* Right Column: Sidebar (Span 1) */}
          <div className="lg:col-span-1 h-full overflow-y-auto pr-1 custom-scrollbar">
            <RightSidebar
              activeExerciseId={activeExerciseId}
              onSelectExercise={setActiveExerciseId}
              isCameraActive={isCameraActive}
              stats={trackerState.stats}
              feedback={trackerState.feedback}
              status={trackerState.status}
              history={history}
            />
          </div>

        </div>

        {/* Instructions (Optional / Below Fold) */}
        <div className="mt-8">
          <p className="text-center text-gray-400 text-sm">
            Align your full body in the frame. Joints will turn <span className="text-red-500 font-bold">RED</span> if your form needs correction.
          </p>
        </div>

      </div>
      <FooterDash />
    </>

  );
};

export default AITrainer;
