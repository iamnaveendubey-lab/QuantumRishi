
import React, { useState } from 'react';
import { UserProfile, ExamType, PrepLevel, ConsultationContext } from '../types';

interface OnboardingFormProps {
  onSubmit: (profile: UserProfile) => void;
  isLoading: boolean;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    examType: ExamType.JEE,
    prepLevel: PrepLevel.BEGINNER,
    focusTopics: [],
    availableHoursPerWeek: 15,
    consultationContext: ConsultationContext.SUBJECT_HELP,
  });

  const [topicInput, setTopicInput] = useState('');

  const addTopic = () => {
    if (topicInput.trim() && !formData.focusTopics.includes(topicInput.trim())) {
      setFormData(prev => ({
        ...prev,
        focusTopics: [...prev.focusTopics, topicInput.trim()]
      }));
      setTopicInput('');
    }
  };

  const removeTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      focusTopics: prev.focusTopics.filter(t => t !== topic)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return alert("Please share your name, dear student.");
    if (formData.focusTopics.length === 0) return alert("Ek baar bata do ki kaunse topics pareshaan kar rahe hain?");
    onSubmit(formData);
  };

  const selectContext = (context: ConsultationContext) => {
    setFormData({ ...formData, consultationContext: context });
    setStep(2);
  };

  const contextOptions = [
    { id: ConsultationContext.ANXIETY, label: "Examination Anxiety", emoji: "😰", color: "from-orange-500/10 to-red-500/10" },
    { id: ConsultationContext.POOR_MARKS, label: "Struggling with poor marks", emoji: "📉", color: "from-blue-500/10 to-indigo-500/10" },
    { id: ConsultationContext.CONCENTRATION, label: "Concentration Problem", emoji: "🤯", color: "from-purple-500/10 to-violet-500/10" },
    { id: ConsultationContext.SUBJECT_HELP, label: "Subject related problem", emoji: "📘", color: "from-emerald-500/10 to-teal-500/10" },
    { id: ConsultationContext.OTHERS, label: "Others (Kuch aur baat hai)", emoji: "💬", color: "from-slate-500/10 to-slate-400/10" },
  ];

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4 text-white font-brand tracking-tighter">Aaj kis baare mein baat karni hai?</h2>
          <p className="text-slate-400 text-lg font-tagline font-medium">Pehle yeh batao ki aapko sabse zyada kya pareshan kar raha hai?</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {contextOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => selectContext(opt.id)}
              className={`p-10 rounded-[2.5rem] border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all text-left flex flex-col items-start gap-6 shadow-xl group hover:scale-[1.03] active:scale-95 bg-gradient-to-br ${opt.color}`}
            >
              <span className="text-5xl group-hover:scale-125 transition-transform duration-500">{opt.emoji}</span>
              <span className="text-xl font-black text-white leading-tight font-brand group-hover:text-indigo-300 transition-colors">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-slate-900/40 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setStep(1)} 
          className="p-3 hover:bg-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-3xl font-black text-white font-brand tracking-tighter">Thodi aur jaankari...</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest font-tagline italic">Aapka naam kya hai?</label>
          <input
            type="text"
            required
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-700 shadow-inner font-tagline font-semibold"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="Aapka Naam"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest font-tagline">Kaunsa Exam de rahe ho?</label>
            <select
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-tagline font-semibold"
              value={formData.examType}
              onChange={e => setFormData({ ...formData, examType: e.target.value as ExamType })}
            >
              {Object.values(ExamType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest font-tagline">Abhi kaisi taiyari hai?</label>
            <select
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-tagline font-semibold"
              value={formData.prepLevel}
              onChange={e => setFormData({ ...formData, prepLevel: e.target.value as PrepLevel })}
            >
              <option value={PrepLevel.BEGINNER}>Naya start kar raha hoon</option>
              <option value={PrepLevel.INTERMEDIATE}>Thoda confused hoon</option>
              <option value={PrepLevel.ADVANCED}>Confidence chahiye</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest font-tagline">Kitna waqt nikal sakte ho? (Weekly)</label>
          <input
            type="range"
            min="1"
            max="100"
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            value={formData.availableHoursPerWeek}
            onChange={e => setFormData({ ...formData, availableHoursPerWeek: parseInt(e.target.value) })}
          />
          <div className="text-right mt-3 font-brand text-indigo-400 text-lg font-black">{formData.availableHoursPerWeek} Ghante</div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-widest font-tagline">Kaunse topics se darr lag raha hai?</label>
          <div className="flex gap-4 mb-5">
            <input
              type="text"
              className="flex-1 bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-700 font-tagline font-semibold"
              placeholder="e.g. Physics ki derivation, Organic..."
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTopic())}
            />
            <button
              type="button"
              onClick={addTopic}
              className="bg-indigo-600 hover:bg-indigo-500 px-10 py-2 rounded-2xl font-black transition-all shadow-lg shadow-indigo-600/20 font-brand uppercase tracking-widest"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {formData.focusTopics.map(topic => (
              <span key={topic} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-5 py-2.5 rounded-2xl text-sm font-bold font-tagline flex items-center gap-3 animate-in zoom-in-75">
                {topic}
                <button type="button" onClick={() => removeTopic(topic)} className="text-slate-500 hover:text-red-400 transition-colors text-lg font-black">&times;</button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl font-brand uppercase tracking-[0.2em] ${
            isLoading 
              ? 'bg-slate-800 cursor-not-allowed text-slate-600' 
              : 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white shadow-indigo-600/30 active:scale-95'
          }`}
        >
          {isLoading ? 'Chaliye, plan banate hain...' : 'Mera Plan Taiyaar Karo'}
        </button>
      </form>
    </div>
  );
};

export default OnboardingForm;
