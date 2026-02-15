
import React from 'react';
import { StudyPlan, Module } from '../types';

interface DashboardProps {
  plan: StudyPlan;
  onExploreModule: (module: Module) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ plan, onExploreModule }) => {
  return (
    <div className="animate-fade-in space-y-12 pb-24">
      <header className="bg-slate-900/50 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
           <div className="text-[240px] leading-none text-emerald-500">🌿</div>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-8 text-white tracking-tighter leading-tight font-brand">
            {plan.title}
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl leading-relaxed max-w-4xl italic font-serif-quote">
            "{plan.overview}"
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plan.modules.map((module) => (
          <div 
            key={module.id} 
            className="group bg-slate-900/40 hover:bg-slate-800/40 p-10 rounded-[2.5rem] border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl"
            onClick={() => onExploreModule(module)}
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border font-tagline ${
                  module.priority === 'High' ? 'bg-red-500/5 text-red-400 border-red-500/20' :
                  module.priority === 'Medium' ? 'bg-amber-500/5 text-amber-400 border-amber-500/20' :
                  'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                }`}>
                  {module.priority} Focus
                </span>
                <span className="text-slate-500 text-xs font-bold font-tagline">{module.estimatedTime}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-indigo-400 transition-colors font-brand tracking-tight leading-snug">{module.title}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-3 font-tagline font-medium">{module.description}</p>
            </div>
            <button className="mt-4 w-full py-4 bg-slate-950/50 group-hover:bg-indigo-600 text-slate-500 group-hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-slate-800 group-hover:border-indigo-500 font-brand">
              Suno Iske Baare Mein 🙂
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[3.5rem] p-12 shadow-inner">
        <h3 className="text-3xl font-black text-indigo-400 mb-10 flex items-center gap-4 font-brand">
           <span className="text-3xl bg-indigo-500/10 p-3 rounded-2xl">🌿</span>
           Quantum Rishi ki Advice
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {plan.tips.map((tip, i) => (
            <div key={i} className="flex gap-6 p-8 bg-slate-900/60 rounded-[2rem] border border-slate-800 hover:border-indigo-500/20 transition-all shadow-sm">
              <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-xl border border-indigo-500/20 font-brand">
                {i + 1}
              </span>
              <p className="text-slate-300 text-lg leading-relaxed font-tagline font-medium">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
