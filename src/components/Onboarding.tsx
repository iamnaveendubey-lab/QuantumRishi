import React, { useState } from 'react';
import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { Sparkles, Brain, Clock, Target } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<UserProfile>>({
    class: '',
    targetExam: '',
    weakSubjects: [],
    studyHours: 4,
    persona: 'Friendly Guide'
  });

  const steps = [
    {
      title: "Which class are you in?",
      icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
      field: 'class',
      options: ['10th', '11th', '12th', 'Dropper']
    },
    {
      title: "What is your target exam?",
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      field: 'targetExam',
      options: ['JEE Main', 'JEE Advanced', 'NEET', 'Boards', 'CUET']
    },
    {
      title: "How many hours do you study daily?",
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      field: 'studyHours',
      type: 'range',
      min: 1,
      max: 16
    },
    {
      title: "Choose your Mentor's Persona",
      icon: <Brain className="w-6 h-6 text-purple-400" />,
      field: 'persona',
      options: ['Friendly Guide', 'Strict Mentor', 'IIT Coach', 'Therapist']
    }
  ];

  const handleNext = (val: any) => {
    const currentField = steps[step].field;
    const newData = { ...data, [currentField]: val };
    setData(newData);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newData);
    }
  };

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-[#0c1117] flex items-center justify-center p-6">
      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-xl w-full bg-slate-900/40 border border-slate-800 p-12 rounded-[3rem] backdrop-blur-2xl shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-slate-800 rounded-2xl">
            {currentStep.icon}
          </div>
          <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Step {step + 1} of {steps.length}</span>
        </div>

        <h2 className="text-3xl font-black text-white mb-10 tracking-tight leading-tight">
          {currentStep.title}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {currentStep.options ? (
            currentStep.options.map(opt => (
              <button
                key={opt}
                onClick={() => handleNext(opt)}
                className="w-full text-left px-8 py-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/5 text-slate-300 hover:text-white font-bold transition-all group flex items-center justify-between"
              >
                {opt}
                <div className="w-2 h-2 rounded-full bg-slate-800 group-hover:bg-indigo-500 transition-colors" />
              </button>
            ))
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <span className="text-6xl font-black text-indigo-500">{data.studyHours}</span>
                <span className="text-slate-500 font-bold ml-2 uppercase tracking-widest text-sm">Hours</span>
              </div>
              <input 
                type="range" 
                min={currentStep.min} 
                max={currentStep.max} 
                value={data.studyHours}
                onChange={(e) => setData({...data, studyHours: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <button
                onClick={() => handleNext(data.studyHours)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
