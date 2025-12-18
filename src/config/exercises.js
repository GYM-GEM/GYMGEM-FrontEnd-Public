// export const EXERCISES = {
//   // =========================
//   // SQUAT
//   // =========================
//   squat: {
//     id: 'squat',
//     name: 'Squat',
//     type: 'reps',
//     minConfidence: 0.65,
//     joints: [
//       'left_hip','left_knee','left_ankle',
//       'right_hip','right_knee','right_ankle'
//     ],
//     primaryJoint: 'knee',
//     angleRules: {
//       waiting: {
//         left_knee: { min: 155, max: 180 },
//         right_knee: { min: 155, max: 180 }
//       },
//       bottom: {
//         left_knee: { min: 70, max: 105 },
//         right_knee: { min: 70, max: 105 }
//       },
//       up: {
//         left_knee: { min: 155, max: 180 },
//         right_knee: { min: 155, max: 180 }
//       }
//     },
//     feedbackMessages: {
//       PERFECT: "Great squat! Keep going",
//       GO_LOWER: "Go lower until thighs are parallel",
//       STAND_UP: "Stand up completely",
//       FIX_FORM: "Keep your chest up and back straight"
//     }
//   },

//   // =========================
//   // PUSH UP
//   // =========================
//   pushup: {
//     id: 'pushup',
//     name: 'Push Up',
//     type: 'reps',
//     minConfidence: 0.6,
//     joints: [
//       'left_shoulder','left_elbow','left_wrist',
//       'right_shoulder','right_elbow','right_wrist'
//     ],
//     primaryJoint: 'elbow',
//     angleRules: {
//       waiting: {
//         left_elbow: { min: 150, max: 180 },
//         right_elbow: { min: 150, max: 180 }
//       },
//       bottom: {
//         left_elbow: { min: 65, max: 95 },
//         right_elbow: { min: 65, max: 95 }
//       },
//       up: {
//         left_elbow: { min: 150, max: 180 },
//         right_elbow: { min: 150, max: 180 }
//       }
//     },
//     feedbackMessages: {
//       PERFECT: "Strong push-up!",
//       GO_LOWER: "Lower your chest closer to the floor",
//       STAND_UP: "Push up until arms are fully straight",
//       FIX_FORM: "Keep your body in a straight line"
//     }
//   },

//   // =========================
//   // LUNGE
//   // =========================
//   lunge: {
//     id: 'lunge',
//     name: 'Lunge',
//     type: 'reps',
//     minConfidence: 0.65,
//     joints: [
//       'left_hip','left_knee','left_ankle',
//       'right_hip','right_knee','right_ankle'
//     ],
//     primaryJoint: 'knee',
//     angleRules: {
//       waiting: {
//         left_knee: { min: 155, max: 180 },
//         right_knee: { min: 155, max: 180 }
//       },
//       bottom: {
//         left_knee: { min: 75, max: 115 },
//         right_knee: { min: 75, max: 115 }
//       },
//       up: {
//         left_knee: { min: 155, max: 180 },
//         right_knee: { min: 155, max: 180 }
//       }
//     },
//     feedbackMessages: {
//       PERFECT: "Good lunge!",
//       GO_LOWER: "Lower your back knee more",
//       STAND_UP: "Push back to the starting position",
//       FIX_FORM: "Keep your front knee above your ankle"
//     }
//   },

//   // =========================
//   // JUMPING JACK
//   // =========================
//   jumping_jack: {
//     id: 'jumping_jack',
//     name: 'Jumping Jack',
//     type: 'reps',
//     minConfidence: 0.65,
//     joints: ['left_shoulder','right_shoulder'],
//     primaryJoint: 'shoulder',
//     angleRules: {
//       waiting: {
//         left_shoulder: { min: 0, max: 60 },
//         right_shoulder: { min: 0, max: 60 }
//       },
//       bottom: {
//         left_shoulder: { min: 120, max: 170 },
//         right_shoulder: { min: 120, max: 170 }
//       },
//       up: {
//         left_shoulder: { min: 0, max: 60 },
//         right_shoulder: { min: 0, max: 60 }
//       }
//     },
//     feedbackMessages: {
//       PERFECT: "Nice rhythm!",
//       GO_LOWER: "Raise your arms higher",
//       STAND_UP: "Bring your arms back down",
//       FIX_FORM: "Use full range of motion"
//     }
//   },

//   // =========================
//   // SHOULDER PRESS
//   // =========================
//   shoulder_press: {
//     id: 'shoulder_press',
//     name: 'Shoulder Press',
//     type: 'reps',
//     minConfidence: 0.65,
//     joints: [
//       'left_shoulder','left_elbow','left_wrist',
//       'right_shoulder','right_elbow','right_wrist'
//     ],
//     primaryJoint: 'elbow',
//     angleRules: {
//       waiting: {
//         left_elbow: { min: 70, max: 100 },
//         right_elbow: { min: 70, max: 100 }
//       },
//       bottom: {
//         left_elbow: { min: 155, max: 180 },
//         right_elbow: { min: 155, max: 180 }
//       },
//       up: {
//         left_elbow: { min: 70, max: 100 },
//         right_elbow: { min: 70, max: 100 }
//       }
//     },
//     feedbackMessages: {
//       PERFECT: "Strong press!",
//       GO_LOWER: "Press your arms higher overhead",
//       STAND_UP: "Lower arms back to shoulder level",
//       FIX_FORM: "Tighten your core and avoid arching"
//     }
//   },

//   // =========================
//   // PLANK (HOLD)
//   // =========================
//   plank: {
//     id: 'plank',
//     name: 'Plank',
//     type: 'hold',
//     minConfidence: 0.6,
//     joints: [
//       'left_shoulder','left_hip','left_knee','left_ankle',
//       'right_shoulder','right_hip','right_knee','right_ankle'
//     ],
//     angleRules: {
//       hold: {
//         left_hip: { min: 165, max: 190 },
//         right_hip: { min: 165, max: 190 },
//         left_knee: { min: 165, max: 185 },
//         right_knee: { min: 165, max: 185 }
//       }
//     },
//     feedbackMessages: {
//       PERFECT: "Hold steady, great form!",
//       HIPS_SAGGING: "Lift your hips up",
//       HIPS_TOO_HIGH: "Lower your hips slightly",
//       FIX_FORM: "Keep your body in a straight line"
//     }
//   },

//   // =========================
//   // WALL SIT (HOLD)
//   // =========================
//   wall_sit: {
//     id: 'wall_sit',
//     name: 'Wall Sit',
//     type: 'hold',
//     minConfidence: 0.6,
//     joints: ['left_hip','left_knee','right_hip','right_knee'],
//     angleRules: {
//       hold: {
//         left_knee: { min: 85, max: 105 },
//         right_knee: { min: 85, max: 105 },
//         left_hip: { min: 85, max: 105 },
//         right_hip: { min: 85, max: 105 }
//       }
//     },
//     feedbackMessages: {
//       PERFECT: "Stay strong, keep holding!",
//       GO_LOWER: "Lower until thighs are parallel",
//       FIX_FORM: "Keep your back flat against the wall"
//     }
//   }
// };

// // =========================
// // MOVEMENT PHASES
// // =========================
// export const MOVEMENT_PHASES = {
//   WAITING: 'WAITING',
//   DOWN: 'DOWN',
//   BOTTOM: 'BOTTOM',
//   UP: 'UP',
//   COUNT: 'COUNT',
//   HOLD: 'HOLD'
// };
// --------------------------------------------------------------------------
// =========================
// MOVEMENT PHASES
// =========================
export const MOVEMENT_PHASES = {
  WAITING: 'WAITING',   // بانتظار بدء الحركة
  DOWN: 'DOWN',         // في مرحلة النزول
  BOTTOM: 'BOTTOM',     // وصل لأقصى نقطة في التمرين
  UP: 'UP',             // في مرحلة الصعود
  COUNT: 'COUNT',       // تم احتساب العدّة
  HOLD: 'HOLD'          // في حالة الثبات (للبلانك مثلاً)
};

// =========================
// EXERCISES CONFIGURATION
// =========================
export const EXERCISES = {
  // 1. القرفصاء - SQUAT
  squat: {
    id: 'squat',
    name: 'Squat',
    type: 'reps',
    gifUrl: '/assets/gifs/squat.gif', 
    minConfidence: 0.65,
    joints: ['left_hip', 'left_knee', 'left_ankle', 'right_hip', 'right_knee', 'right_ankle'],
    primaryJoint: 'knee',
    angleRules: {
      waiting: { left_knee: { min: 160, max: 185 }, right_knee: { min: 160, max: 185 } },
      bottom: { left_knee: { min: 70, max: 100 }, right_knee: { min: 70, max: 100 } },
      up: { left_knee: { min: 160, max: 185 }, right_knee: { min: 160, max: 185 } }
    },
    feedbackMessages: {
      PERFECT: "Great squat! Keep going",
      GO_LOWER: "Go lower until thighs are parallel",
      STAND_UP: "Stand up completely",
      FIX_FORM: "Keep your chest up and back straight"
    }
  },

  // 2. تمرين الضغط - PUSH UP
  pushup: {
    id: 'pushup',
    name: 'Push Up',
    type: 'reps',
    gifUrl: '/assets/gifs/pushup.gif',
    minConfidence: 0.6,
    joints: ['left_shoulder', 'left_elbow', 'left_wrist', 'right_shoulder', 'right_elbow', 'right_wrist'],
    primaryJoint: 'elbow',
    angleRules: {
      waiting: { left_elbow: { min: 155, max: 185 }, right_elbow: { min: 155, max: 185 } },
      bottom: { left_elbow: { min: 60, max: 95 }, right_elbow: { min: 60, max: 95 } },
      up: { left_elbow: { min: 155, max: 185 }, right_elbow: { min: 155, max: 185 } }
    },
    feedbackMessages: {
      PERFECT: "Strong push-up!",
      GO_LOWER: "Lower your chest closer to the floor",
      STAND_UP: "Push up until arms are fully straight",
      FIX_FORM: "Keep your body in a straight line"
    }
  },

  // 3. تمرين الطعن - LUNGE
  lunge: {
    id: 'lunge',
    name: 'Lunge',
    type: 'reps',
    gifUrl: '/assets/gifs/lunge.gif',
    minConfidence: 0.65,
    joints: ['left_hip', 'left_knee', 'left_ankle', 'right_hip', 'right_knee', 'right_ankle'],
    primaryJoint: 'knee',
    angleRules: {
      waiting: { left_knee: { min: 160, max: 185 }, right_knee: { min: 160, max: 185 } },
      bottom: { left_knee: { min: 80, max: 110 }, right_knee: { min: 80, max: 110 } },
      up: { left_knee: { min: 160, max: 185 }, right_knee: { min: 160, max: 185 } }
    },
    feedbackMessages: {
      PERFECT: "Good lunge!",
      GO_LOWER: "Lower your back knee more",
      STAND_UP: "Push back to starting position",
      FIX_FORM: "Keep your front knee above your ankle"
    }
  },

  // 4. قفز جاك - JUMPING JACK
  jumping_jack: {
    id: 'jumping_jack',
    name: 'Jumping Jack',
    type: 'reps',
    gifUrl: '/assets/gifs/jumping-jack.gif',
    minConfidence: 0.65,
    joints: ['left_shoulder', 'right_shoulder'],
    primaryJoint: 'shoulder',
    angleRules: {
      waiting: { left_shoulder: { min: 0, max: 40 }, right_shoulder: { min: 0, max: 40 } },
      bottom: { left_shoulder: { min: 140, max: 180 }, right_shoulder: { min: 140, max: 180 } },
      up: { left_shoulder: { min: 0, max: 40 }, right_shoulder: { min: 0, max: 40 } }
    },
    feedbackMessages: {
      PERFECT: "Nice rhythm!",
      GO_LOWER: "Raise your arms higher",
      STAND_UP: "Bring your arms back down",
      FIX_FORM: "Use full range of motion"
    }
  },

  // 5. ضغط الأكتاف - SHOULDER PRESS
  shoulder_press: {
    id: 'shoulder_press',
    name: 'Shoulder Press',
    type: 'reps',
    gifUrl: '/assets/gifs/shoulder-press.gif',
    minConfidence: 0.65,
    joints: ['left_elbow', 'right_elbow'],
    primaryJoint: 'elbow',
    angleRules: {
      waiting: { left_elbow: { min: 60, max: 100 }, right_elbow: { min: 60, max: 100 } },
      bottom: { left_elbow: { min: 155, max: 185 }, right_elbow: { min: 155, max: 185 } },
      up: { left_elbow: { min: 60, max: 100 }, right_elbow: { min: 60, max: 100 } }
    },
    feedbackMessages: {
      PERFECT: "Strong press!",
      GO_LOWER: "Press your arms higher overhead",
      STAND_UP: "Lower arms to shoulder level",
      FIX_FORM: "Avoid arching your back"
    }
  },

  // 6. تمرين البلانك - PLANK (Hold)
  plank: {
    id: 'plank',
    name: 'Plank',
    type: 'hold',
    gifUrl: '/assets/gifs/plank.gif',
    minConfidence: 0.6,
    joints: ['left_shoulder', 'left_hip', 'left_knee'],
    angleRules: {
      hold: {
        left_hip: { min: 165, max: 195 },
        left_knee: { min: 165, max: 195 }
      }
    },
    feedbackMessages: {
      PERFECT: "Hold steady, great form!",
      HIPS_SAGGING: "Lift your hips up",
      HIPS_TOO_HIGH: "Lower your hips slightly",
      FIX_FORM: "Keep your body in a straight line"
    }
  },

  // 7. الجلوس على الحائط - WALL SIT (Hold)
  wall_sit: {
    id: 'wall_sit',
    name: 'Wall Sit',
    type: 'hold',
    gifUrl: '/assets/gifs/wall-sit.gif',
    minConfidence: 0.6,
    joints: ['left_hip', 'left_knee'],
    angleRules: {
      hold: {
        left_knee: { min: 80, max: 105 },
        left_hip: { min: 80, max: 105 }
      }
    },
    feedbackMessages: {
      PERFECT: "Stay strong, keep holding!",
      GO_LOWER: "Lower until thighs are parallel",
      FIX_FORM: "Keep your back flat against the wall"
    }
  }
};