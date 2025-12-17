import React from 'react';
import AITrainer from '../components/ai/AITrainer';
import AiNavBar from '../components/ai/AiNavBar';

const AiTrainerPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <AiNavBar />
      <div className="pt-20">
         <AITrainer />
      </div>
    </div>
  );
};

export default AiTrainerPage;
