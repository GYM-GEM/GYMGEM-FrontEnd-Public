import React, { forwardRef } from 'react';

const CameraCanvas = forwardRef(({ videoRef }, canvasRef) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Hidden Video Element */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover hidden"
        playsInline
        muted
      />
      
      {/* Visible Canvas Overlay */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="absolute top-0 left-0 w-full h-full object-contain bg-white"
      />
      
      {/* Placeholder when camera is off */}
      <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none -z-10">
        <span className="text-lg">Camera Inactive</span>
      </div>
    </div>
  );
});

CameraCanvas.displayName = 'CameraCanvas';
export default CameraCanvas;
