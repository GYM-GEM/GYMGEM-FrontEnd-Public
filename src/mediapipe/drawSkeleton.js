import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

/**
 * Draws the skeleton with support for partial error highlighting.
 * @param {CanvasRenderingContext2D} ctx 
 * @param {object} landmarks 
 * @param {string[]} errorJoints - List of joint names that are incorrect
 * @param {boolean} isLowConfidence - If true, draw neutral/grey
 */
export const drawSkeleton = (ctx, landmarks, errorJoints = [], isLowConfidence = false, angleData = null) => {
  if (!landmarks) return;

  const LANDMARK_MAP = {
    left_shoulder: 11, right_shoulder: 12,
    left_elbow: 13, right_elbow: 14,
    left_wrist: 15, right_wrist: 16,
    left_hip: 23, right_hip: 24,
    left_knee: 25, right_knee: 26,
    left_ankle: 27, right_ankle: 28
  };

  // Helper to check if a connection is related to an error joint
  const isConnectionError = (i, j) => {
    // This is a simplified check. We could map indices back to names.
    // For now, if we have error joints, we might want to color the whole skeleton red 
    // OR try to match indices. 
    // Given the complexity of mapping connections to specific named joints dynamically,
    // we can stick to: 
    // Green = Perfect
    // Red = Any Error
    // OR we can try to highlight specific landmarks.
    return false; 
  };
  
  // Base Color
  let baseColor = '#00FF00'; // Green
  if (isLowConfidence) baseColor = '#888888'; // Grey
  else if (errorJoints.length > 0) baseColor = '#FFFFFF'; // White for neutral parts when there is an error

  // 1. Draw Connectors (Bones)
  drawConnectors(ctx, landmarks, POSE_CONNECTIONS, {
    color: (data) => {
      // data contains index of start and end
      // For now, simpler visual: 
      return isLowConfidence ? '#888888' : (errorJoints.length > 0 ? '#FFFFFF' : '#00FF00');
    },
    lineWidth: 4
  });

  // 2. Draw Landmarks (Joints)
  // We want to draw ERROR joints in RED, others in GREEN (or White)
  
  for (let i = 0; i < landmarks.length; i++) {
    const point = landmarks[i];
    if (!point || point.visibility < 0.5) continue;
    
    let color = isLowConfidence ? '#888888' : '#00FF00'; // Default Green
    
    // Check if this index corresponds to an error joint
    const jointName = Object.keys(LANDMARK_MAP).find(key => LANDMARK_MAP[key] === i);
    if (jointName && errorJoints.includes(jointName)) {
      color = '#FF0000'; // RED for error
    } else if (errorJoints.length > 0 && !isLowConfidence) {
      color = '#FFFFFF'; // White for non-error parts
    }

    ctx.beginPath();
    ctx.arc(point.x * ctx.canvas.width, point.y * ctx.canvas.height, 4, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    // 3. Draw Angle Data if available for this joint
    if (angleData && angleData.joint === jointName && !isLowConfidence) {
       drawAngleValue(ctx, point, angleData);
    }
  }
};

const drawAngleValue = (ctx, point, data) => {
    const x = point.x * ctx.canvas.width;
    const y = point.y * ctx.canvas.height;
    const currentAngle = Math.round(data.current);
    const targetMin = data.target ? data.target.min : 0;
    const targetMax = data.target ? data.target.max : 0;
    
    // Determine status color
    const isGood = currentAngle >= targetMin && currentAngle <= targetMax;
    const boxColor = isGood ? 'rgba(0, 200, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)';
    
    // Draw Background Box
    const text = `${currentAngle}°`;
    const subText = data.target ? `Goal: ${targetMin}-${targetMax}°` : '';
    
    ctx.font = 'bold 16px Arial';
    const textMetrics = ctx.measureText(text);
    const boxWidth = Math.max(80, textMetrics.width + 20);
    const boxHeight = subText ? 45 : 25;
    
    ctx.fillStyle = boxColor;
    ctx.roundRect(x + 10, y - 20, boxWidth, boxHeight, 5);
    ctx.fill();
    
    // Draw Text
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, x + 20, y - 2);
    
    if (subText) {
        ctx.font = '12px Arial';
        ctx.fillText(subText, x + 20, y + 15);
    }
};