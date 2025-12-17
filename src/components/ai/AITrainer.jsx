import React, { useState, useEffect } from 'react';
import CameraCanvas from './CameraCanvas';
import RightSidebar from './RightSidebar';
import SessionSummary from './SessionSummary';
import { useWebcam } from '../../hooks/useWebcam';
import { usePoseTracker } from '../../hooks/usePoseTracker';
import { EXERCISES } from '../../config/exercises'; 

const AITrainer = () => {
  // 1. User State & Persistence (Authenticated User)
  const [username, setUsername] = useState('Guest');
  
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
          } catch(e) { console.error(e); }
      }
  }, [sessionFinished]);

  const handleStart = () => {
    setSessionFinished(false);
    setLastSessionStats(null);
    startCamera();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
        
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
  className={`relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl
    border transition-colors duration-300
    ${isCameraActive ? 'bg-black border-white/30' : 'bg-white border-gray-200'}
  `}
>
  <CameraCanvas videoRef={videoRef} ref={canvasRef} />
{/* camera off */}
  {!isCameraActive && (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400 bg-white">
      <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-xl">
        📷
      </div>
      <p className="text-lg text-gray-600">الكاميرا متوقفة</p>
      <p className="text-lg text-gray-600">اضغط Start New Session للبدء</p>
    </div>
  )}
{/* countdown */}
  {isCameraActive && trackerState.countdown > 0 && (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <span className="text-8xl font-extrabold text-[#ff8211]">
        {trackerState.countdown}
      </span>
    </div>
  )}
</div>


  {/* ACTION BUTTON (Start / Stop) */}
  <button
    onClick={isCameraActive ? handleStop : handleStart}
    className={`w-full py-4 rounded-2xl text-lg font-bold
      transition-all duration-300
      shadow-xl
      ${
        isCameraActive
          ? 'bg-[#F2310F] hover:bg-[#e6760f] text-white '
          : 'bg-[#ff8211] hover:bg-[#e6760f] text-white '
      }
    `}
  >
    {isCameraActive ? 'Stop Camera' : 'Start New Session'}
  </button>

</div>

        </div>

        {/* Right Column: Sidebar (Span 1) */}
        <div className="lg:col-span-1 h-full">
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
  );
};

export default AITrainer;
