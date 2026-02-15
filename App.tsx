
import React, { useState } from 'react';
import { UserProfile, StudyPlan, Module } from './types';
import { generateStudyPlan } from './services/geminiService';
import OnboardingForm from './components/OnboardingForm';
import Dashboard from './components/Dashboard';
import ConceptExplorer from './components/ConceptExplorer';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOnboardingSubmit = async (p: UserProfile) => {
    setLoading(true);
    setProfile(p);
    try {
      const plan = await generateStudyPlan(p);
      setStudyPlan(plan);
    } catch (error) {
      console.error("Quantum Rishi system error:", error);
      alert("Maaf kijiye, thodi dikkat ho gayi. Phir se try karein? 🙂");
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setProfile(null);
    setStudyPlan(null);
    setActiveModule(null);
  };

  return (
    <div className="min-h-screen bg-[#0c1117] text-slate-100 selection:bg-indigo-500/30">
      <nav className="sticky top-0 z-50 glass-effect border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-5 cursor-pointer group" onClick={resetApp}>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center font-bold text-white shadow-2xl shadow-indigo-600/20 group-hover:scale-110 transition-all duration-300 text-3xl">
              🧑‍🎓
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter leading-none uppercase font-brand text-white group-hover:text-indigo-400 transition-colors">QUANTUM RISHI</span>
              <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-[0.25em] leading-none mt-2 font-tagline italic">Marks se pehle Mind ko sambhalo</span>
            </div>
          </div>
          
          {profile && (
            <div className="flex items-center gap-8">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-tagline">{profile.examType} Path</span>
                <span className="text-lg font-bold text-indigo-100 mt-1 font-brand">{profile.name} 🙂</span>
              </div>
              <button 
                onClick={resetApp}
                className="text-xs font-bold text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all uppercase tracking-widest bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl shadow-lg"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-20">
        {!profile || loading ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center mb-20">
              <div className="inline-block px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold uppercase tracking-[0.4em] mb-10 saathi-glow font-brand">
                Developed by Naveen Dubey
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-10 bg-clip-text text-transparent bg-gradient-to-br from-white via-indigo-100 to-indigo-600 tracking-tighter leading-[0.9] font-brand">
                Marks matter,<br/><span className="italic font-serif-quote font-normal text-slate-400">par</span> mental health pehle.
              </h1>
              <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium font-tagline">
                Main hoon aapka digital counselor aur mentor. Hum saath mein JEE, NEET ya Boards ki darr ko khatam karenge. 🌿
              </p>
            </div>
            <OnboardingForm onSubmit={handleOnboardingSubmit} isLoading={loading} />
          </div>
        ) : activeModule ? (
          <ConceptExplorer 
            module={activeModule} 
            onBack={() => setActiveModule(null)} 
          />
        ) : studyPlan ? (
          <Dashboard 
            plan={studyPlan} 
            onExploreModule={setActiveModule} 
          />
        ) : null}
      </main>

      <footer className="border-t border-slate-900 bg-[#0c1117] py-24">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center font-bold text-indigo-500 border border-slate-800 shadow-xl text-2xl">
                🎓
              </div>
              <span className="text-2xl font-black tracking-tight font-brand">Quantum Rishi</span>
            </div>
            <p className="text-slate-500 text-lg max-w-sm leading-relaxed font-medium font-tagline">
              Academic pressure ko handle karne ke liye ek smart approach. Counselor ki tarah suno, mentor ki tarah seekho.
            </p>
          </div>
          <div className="text-slate-700 text-[11px] md:text-right space-y-6 font-bold uppercase tracking-widest font-tagline">
            <div className="p-8 bg-slate-900/30 rounded-3xl border border-slate-800 inline-block md:ml-auto shadow-sm">
              <p className="text-indigo-500 mb-2 font-tagline">Architect & Developer</p>
              <p className="text-slate-200 text-2xl font-black tracking-tighter font-brand lowercase">Naveen Dubey</p>
            </div>
            <div className="space-y-2 opacity-60 italic font-medium font-serif-quote text-base normal-case">
              <p>Powered by Gemini 3 Pro Intelligence Engine</p>
              <p>"Dost, struggle common hai, bas rukna nahi hai."</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
