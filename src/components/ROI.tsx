
import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, Clock, ShieldCheck, Brain, Zap, Target, Heart } from 'lucide-react';

const ROI: React.FC = () => {
  const stats = [
    {
      label: 'Cost Reduction',
      value: '85%',
      description: 'Compared to traditional 1-on-1 human mentoring services.',
      icon: Zap,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10'
    },
    {
      label: 'Student Engagement',
      value: '3.2x',
      description: 'Increase in daily study consistency through proactive intervention.',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    },
    {
      label: 'Response Latency',
      value: '< 2s',
      description: 'Instant academic and emotional support available 24/7.',
      icon: Clock,
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10'
    },
    {
      label: 'Scalability',
      value: '∞',
      description: 'Support for thousands of students simultaneously without quality drop.',
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <header className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-indigo-600/10 border border-indigo-600/20 rounded-full mb-6"
        >
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Business Case & ROI</span>
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6">
          QUANTUM RISHI <span className="text-indigo-600">ROI</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          A strategic analysis of the value proposition and return on investment for the Quantum Rishi AI Mentor platform.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">{stat.label}</div>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-10 rounded-[3rem] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl rounded-full -mr-16 -mt-16" />
          <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
            <Brain className="text-indigo-500 w-8 h-8" />
            Academic Impact
          </h3>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="w-6 h-6 bg-indigo-600/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div>
                <p className="text-white font-bold mb-1">Personalized Memory Engine</p>
                <p className="text-slate-400 text-sm leading-relaxed">Retains student history to provide context-aware guidance, reducing repetitive questioning by 60%.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 bg-indigo-600/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              </div>
              <div>
                <p className="text-white font-bold mb-1">Proactive Intervention</p>
                <p className="text-slate-400 text-sm leading-relaxed">Detects drop in study hours and intervenes automatically, preventing academic burnout.</p>
              </div>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-10 rounded-[3rem] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full -mr-16 -mt-16" />
          <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4">
            <Heart className="text-red-500 w-8 h-8" />
            Emotional Wellness
          </h3>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="w-6 h-6 bg-red-600/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <div>
                <p className="text-white font-bold mb-1">Anxiety Detection</p>
                <p className="text-slate-400 text-sm leading-relaxed">Real-time sentiment analysis identifies exam stress, providing immediate therapeutic support.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 bg-red-600/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <div>
                <p className="text-white font-bold mb-1">24/7 Availability</p>
                <p className="text-slate-400 text-sm leading-relaxed">Critical for late-night study sessions where human mentors are unavailable, ensuring no student is left alone.</p>
              </div>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Strategic Value Section */}
      <div className="bg-indigo-600 p-12 rounded-[3.5rem] shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Strategic Value Proposition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-indigo-200 w-6 h-6" />
                <h4 className="text-white font-black uppercase tracking-widest text-xs">Market Edge</h4>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed">First-to-market AI mentor with deep student memory and proactive intervention capabilities for Indian competitive exams.</p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-indigo-200 w-6 h-6" />
                <h4 className="text-white font-black uppercase tracking-widest text-xs">Data Privacy</h4>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed">Secure, encrypted student memory engine ensures personalized growth without compromising sensitive academic data.</p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-indigo-200 w-6 h-6" />
                <h4 className="text-white font-black uppercase tracking-widest text-xs">Operational Efficiency</h4>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed">Automates 90% of routine academic queries, allowing human educators to focus on high-level strategic mentoring.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-tighter uppercase">Quantum Rishi</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AI Mentor Platform</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Architected By</p>
          <p className="text-sm font-bold text-white">Naveen Dubey</p>
        </div>
      </footer>
    </div>
  );
};

export default ROI;
