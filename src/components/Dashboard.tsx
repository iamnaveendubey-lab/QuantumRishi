import React, { useState } from 'react';
import { UserProfile, StudentMemory } from '../types';
import { submitReflection } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Heart, Zap, Clock, Target, TrendingUp, AlertCircle, X, BarChart3, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface DashboardProps {
  user: UserProfile;
  memory: StudentMemory | null;
  onRefresh: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, memory, onRefresh }) => {
  const [showReflection, setShowReflection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reflectionAnswers, setReflectionAnswers] = useState({
    study: '',
    wrong: '',
    goal: '',
    stress: 5,
    confidence: 5,
    studyHours: user.studyHours || 4
  });

  const handleReflectionSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitReflection(user.id, reflectionAnswers);
      setShowReflection(false);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStressColor = (val: number) => {
    if (val === 0) return 'bg-slate-700';
    if (val <= 3) return 'bg-emerald-500';
    if (val <= 7) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getConfidenceColor = (val: number) => {
    if (val === 0) return 'bg-slate-700';
    if (val >= 7) return 'bg-emerald-500';
    if (val >= 4) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const stats = [
    { label: 'Stress Level', value: memory?.stressLevel || 0, max: 10, icon: <Heart className="w-5 h-5 text-rose-400" />, color: getStressColor(memory?.stressLevel || 0) },
    { label: 'Confidence', value: memory?.confidenceLevel || 0, max: 10, icon: <Zap className="w-5 h-5 text-amber-400" />, color: getConfidenceColor(memory?.confidenceLevel || 0) },
    { label: 'Consistency', value: memory?.consistencyScore || 0, max: 100, icon: <TrendingUp className="w-5 h-5 text-cyan-400" />, color: 'bg-cyan-500' },
    { label: 'Study Hours', value: user.studyHours || 0, max: 16, icon: <Clock className="w-5 h-5 text-indigo-400" />, color: 'bg-indigo-500' },
  ];

  // Calculate Streak
  const calculateStreak = () => {
    if (!memory?.dailyLogs || memory.dailyLogs.length === 0) return 0;
    const sortedLogs = [...memory.dailyLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Check if last log is today or yesterday
    if (sortedLogs[0].date !== today && sortedLogs[0].date !== yesterday) return 0;

    for (let i = 0; i < sortedLogs.length; i++) {
      const current = new Date(sortedLogs[i].date);
      if (i === 0) {
        streak = 1;
        continue;
      }
      const prev = new Date(sortedLogs[i-1].date);
      const diff = (prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Prepare chart data
  const chartData = memory?.dailyLogs?.map(log => ({
    name: new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    stress: log.stress,
    confidence: log.confidence,
    hours: log.studyHours
  })) || [];

  const goalProgress = memory?.studyGoalProgress || 0;
  const pieData = [
    { name: 'Completed', value: goalProgress },
    { name: 'Remaining', value: 100 - goalProgress }
  ];
  const COLORS = ['#6366f1', 'rgba(255, 255, 255, 0.05)'];

  const weakAreasData = memory?.weakAreas || [];

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Immersive Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-rose-600/10 blur-[100px] rounded-full" />
      </div>

      <AnimatePresence>
        {showReflection && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-2xl w-full bg-slate-900/80 border border-white/10 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden backdrop-blur-3xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-rose-600" />
              <button onClick={() => setShowReflection(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                <X className="w-8 h-8" />
              </button>
              
              <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Daily Reflection</h2>
              <p className="text-slate-400 mb-10 font-medium">Quantum Rishi is listening. Be honest with yourself.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-3">What did you study today?</label>
                    <textarea 
                      placeholder="Physics: Rotational Motion, 20 PYQs..."
                      className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all min-h-[120px]"
                      onChange={e => setReflectionAnswers({...reflectionAnswers, study: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-3">Tomorrow's Main Goal?</label>
                    <input 
                      placeholder="Complete Organic Chemistry notes"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                      onChange={e => setReflectionAnswers({...reflectionAnswers, goal: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-3">Study Hours: <span className="text-indigo-400">{reflectionAnswers.studyHours}h</span></label>
                    <input 
                      type="range" min="1" max="16" step="0.5"
                      value={reflectionAnswers.studyHours}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      onChange={e => setReflectionAnswers({...reflectionAnswers, studyHours: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-3">Stress Level: <span className="text-rose-400">{reflectionAnswers.stress}/10</span></label>
                    <input 
                      type="range" min="1" max="10" 
                      value={reflectionAnswers.stress}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-600"
                      onChange={e => setReflectionAnswers({...reflectionAnswers, stress: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-3">Confidence: <span className="text-cyan-400">{reflectionAnswers.confidence}/10</span></label>
                    <input 
                      type="range" min="1" max="10" 
                      value={reflectionAnswers.confidence}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                      onChange={e => setReflectionAnswers({...reflectionAnswers, confidence: parseInt(e.target.value)})}
                    />
                  </div>
                  <button 
                    onClick={handleReflectionSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? 'ANALYZING PROGRESS...' : 'SAVE REFLECTION'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-4 py-1.5 bg-indigo-600/20 border border-indigo-500/30 rounded-full">
              <span className="text-indigo-400 font-black uppercase tracking-widest text-[10px]">Student Dashboard</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>
          </div>
          <h1 className="text-7xl font-black text-white tracking-tighter mb-3 leading-none">Hello, {user.name}! 👋</h1>
          <p className="text-slate-400 text-xl font-medium max-w-2xl">Aapka progress track ho raha hai. Remember: Consistency is the key to {user.targetExam}.</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4 shadow-xl backdrop-blur-md">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-black uppercase tracking-widest">Target Exam</span>
              <span className="text-white font-black text-lg">{user.targetExam}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-lg hover:border-indigo-500/50 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-indigo-600/20 transition-colors">
                {stat.icon}
              </div>
              <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">{stat.label}</span>
            </div>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-black text-white tracking-tighter leading-none">{stat.value}</span>
              <span className="text-slate-500 font-bold mb-1">/ {stat.max}</span>
            </div>
            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${stat.color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Burnout Risk Alert */}
      {memory?.patterns?.some(p => p.toLowerCase().includes('burnout')) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-rose-500/10 border border-rose-500/30 p-8 rounded-[2.5rem] flex items-center gap-6 relative z-10 backdrop-blur-md"
        >
          <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white mb-1">Burnout Risk Detected! 🚨</h3>
            <p className="text-rose-400/80 font-medium">Quantum Rishi has noticed patterns of exhaustion. Please consider an "Emotional Reset" today.</p>
          </div>
        </motion.div>
      )}

      {/* Progress Trackers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Study Goal Progress */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-8 left-10">
            <h2 className="text-2xl font-black text-white tracking-tight">Goal Progress</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Syllabus Completion</p>
          </div>
          <div className="w-full h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{goalProgress}%</span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Done</span>
            </div>
          </div>
          <div className="w-full mt-4 flex justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-slate-400">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className="text-xs font-bold text-slate-400">Remaining</span>
            </div>
          </div>
        </div>

        {/* Consistency Streak */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-600/20 rounded-2xl">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Consistency Streak</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Momentum Tracker</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-white tracking-tighter">{currentStreak} Days</span>
              <span className="block text-[10px] text-emerald-400 font-black uppercase tracking-widest">Current 🔥</span>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-3">
            {[...Array(14)].map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-xl border transition-all duration-500 ${
                  i < currentStreak 
                    ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : 'bg-white/5 border-white/10 opacity-30'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Weak Areas Tracker */}
        <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-600/20 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Weak Areas</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Focus Needed</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {weakAreasData.length > 0 ? (
              weakAreasData.map((area, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-white">{area.subject}</span>
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{area.score}% Focus</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${area.score}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-rose-500"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 py-12">
                <Brain className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-sm">No weak areas identified</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts & Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Trend Chart */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-xl flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600/20 rounded-2xl">
                  <BarChart3 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Performance Trends</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Last 14 Days Analysis</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Confidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Stress</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px] w-full">
              {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize={10} 
                      fontWeight="bold" 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={10} 
                      fontWeight="bold" 
                      tickLine={false} 
                      axisLine={false}
                      domain={[0, 10]}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px', backdropFilter: 'blur(10px)' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="confidence" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorConfidence)" />
                    <Area type="monotone" dataKey="stress" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorStress)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                  <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-sm">Not enough data for trends</p>
                  <p className="text-xs mt-2">Submit reflections for 2+ days to see charts</p>
                </div>
              )}
            </div>
          </div>

          {/* Streak Visualizer */}
          <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-600/20 rounded-2xl">
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Consistency Streak</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Your Daily Momentum</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-white tracking-tighter">{currentStreak} Days</span>
                <span className="block text-[10px] text-emerald-400 font-black uppercase tracking-widest">Current Streak 🔥</span>
              </div>
            </div>
            <div className="flex justify-between gap-2">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div className={`w-full aspect-square rounded-xl border ${i < currentStreak ? 'bg-amber-500 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-white/5 border-white/10 opacity-30'}`} />
                  <span className="text-[8px] text-slate-600 font-black uppercase">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mentor Insights */}
        <div className="flex flex-col gap-8">
          <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] backdrop-blur-xl flex-1">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-indigo-600/20 rounded-2xl">
                <Brain className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Mentor Insights</h2>
            </div>
            
            <div className="space-y-4">
              {memory?.patterns && memory.patterns.length > 0 ? (
                memory.patterns.map((pattern, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-indigo-500/30 transition-colors"
                  >
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-slate-300 text-sm font-medium leading-relaxed">{pattern}</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">No patterns detected yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Daily Reflection CTA */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-indigo-600 p-10 rounded-[3.5rem] shadow-2xl shadow-indigo-600/30 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
            onClick={() => setShowReflection(true)}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all" />
            <div>
              <h2 className="text-4xl font-black text-white mb-6 tracking-tight leading-tight">Daily Reflection</h2>
              <p className="text-indigo-100 font-medium text-lg leading-relaxed opacity-90">
                "What did you study today? What went wrong? Tomorrow's goal?"
              </p>
            </div>
            <div className="mt-10 flex items-center justify-between">
              <span className="text-white font-black text-xl">Start Now</span>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg">
                <Zap className="w-6 h-6 fill-current" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
