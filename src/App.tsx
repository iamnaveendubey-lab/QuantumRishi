
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, StudentMemory } from './types';
import { login, updateProfile, getMemory } from './services/api';
import Onboarding from './components/Onboarding';
import ChatMentor from './components/ChatMentor';
import Dashboard from './components/Dashboard';
import ROI from './components/ROI';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, LayoutDashboard, MessageSquare, LogOut, Play, Pause, RotateCcw, Timer, User, Settings, Bell, AlertCircle, BarChart3 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [memory, setMemory] = useState<StudentMemory | null>(null);
  const [view, setView] = useState<'chat' | 'dashboard' | 'roi'>('chat');
  const [chatContextType, setChatContextType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');

  const startAnxietyChat = () => {
    setChatContextType('EXAM_ANXIETY');
    setView('chat');
  };
  
  // Study Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('qr_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      fetchMemory(u.id);
    }
  }, []);

  useEffect(() => {
    const handleStartTimer = () => {
      setTimerActive(true);
      setTimerMode('study');
      setTimeLeft(25 * 60);
    };
    window.addEventListener('start-timer', handleStartTimer);
    return () => window.removeEventListener('start-timer', handleStartTimer);
  }, []);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Switch modes
      if (timerMode === 'study') {
        setTimerMode('break');
        setTimeLeft(5 * 60);
        new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
      } else {
        setTimerMode('study');
        setTimeLeft(25 * 60);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft, timerMode]);

  const fetchMemory = async (userId: string) => {
    const m = await getMemory(userId);
    setMemory(m);
  };

  const handleLogin = async (email: string) => {
    setLoading(true);
    try {
      const u = await login(email);
      setUser(u);
      localStorage.setItem('qr_user', JSON.stringify(u));
      await fetchMemory(u.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async (profile: Partial<UserProfile>) => {
    if (!user) return;
    setLoading(true);
    try {
      const updated = await updateProfile(user.id, profile);
      setUser(updated);
      localStorage.setItem('qr_user', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setMemory(null);
    localStorage.removeItem('qr_user');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0c1117] flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-900/50 border border-slate-800 p-12 rounded-[3.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
          <div className="flex flex-col items-center mb-12">
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-indigo-600/30 transform -rotate-6 overflow-hidden">
              <img src="/logo.png" alt="Quantum Rishi" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/rishi/200/200'; }} />
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-3 leading-none">QUANTUM RISHI</h1>
            <p className="text-slate-400 text-center font-bold uppercase tracking-widest text-[10px]">Quantum rishi mentor for Indian Students</p>
            <p className="mt-4 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">Developed & Architected by Naveen Dubey</p>
          </div>
          
          <div className="space-y-6">
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-8 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-700 font-medium"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin(loginEmail)}
              />
            </div>
            <button 
              onClick={() => {
                handleLogin(loginEmail);
              }}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-indigo-600/30 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'INITIALIZING...' : 'START JOURNEY'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user.class) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#0c1117] text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Sidebar Navigation */}
      <aside className="fixed top-0 left-0 bottom-0 w-24 bg-slate-950 border-r border-slate-800/50 flex flex-col items-center py-10 z-50">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20 mb-16 transform -rotate-3 overflow-hidden">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/rishi/100/100'; }} />
        </div>

        <nav className="flex flex-col gap-8 flex-1">
          <button 
            onClick={() => { setView('chat'); setChatContextType(null); }}
            className={`p-4 rounded-2xl transition-all relative group ${view === 'chat' && !chatContextType ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-600 hover:text-white hover:bg-slate-900'}`}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-800">Mentor Chat</span>
          </button>
          
          <button 
            onClick={() => setView('dashboard')}
            className={`p-4 rounded-2xl transition-all relative group ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-600 hover:text-white hover:bg-slate-900'}`}
          >
            <LayoutDashboard className="w-6 h-6" />
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-800">Insights</span>
          </button>

          <button 
            onClick={() => setView('roi')}
            className={`p-4 rounded-2xl transition-all relative group ${view === 'roi' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-600 hover:text-white hover:bg-slate-900'}`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-800">ROI Analysis</span>
          </button>

          <button 
            onClick={startAnxietyChat}
            className={`p-4 rounded-2xl transition-all relative group ${chatContextType === 'EXAM_ANXIETY' && view === 'chat' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-600 hover:text-white hover:bg-slate-900'}`}
          >
            <AlertCircle className="w-6 h-6" />
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-800">Exam Anxiety</span>
          </button>

          <button className="p-4 rounded-2xl text-slate-600 hover:text-white hover:bg-slate-900 transition-all relative group">
            <User className="w-6 h-6" />
            <span className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-800">Profile</span>
          </button>
        </nav>

        <div className="flex flex-col gap-6 mt-auto">
          <div className="flex flex-col items-center gap-1 mb-4 opacity-40 hover:opacity-100 transition-opacity px-2 text-center">
            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Dev & Architect</p>
            <p className="text-[9px] font-bold text-white whitespace-nowrap">Naveen Dubey</p>
          </div>
          <button className="p-4 rounded-2xl text-slate-600 hover:text-white hover:bg-slate-900 transition-all">
            <Settings className="w-6 h-6" />
          </button>
          <button onClick={logout} className="p-4 rounded-2xl text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pl-24 h-screen flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#0c1117]/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black tracking-tighter uppercase">
              {view === 'chat' ? 'Quantum rishi' : view === 'dashboard' ? 'Insights' : 'ROI Analysis'}
            </h2>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-8">
            {/* Study Timer Widget */}
            <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 px-6 py-2.5 rounded-2xl">
              <div className="flex items-center gap-3">
                <Timer className={`w-5 h-5 ${timerMode === 'study' ? 'text-indigo-400' : 'text-emerald-400'}`} />
                <span className="font-mono text-xl font-black text-white w-16">{formatTime(timeLeft)}</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setTimerActive(!timerActive)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => {
                    setTimerActive(false);
                    setTimeLeft(timerMode === 'study' ? 25 * 60 : 5 * 60);
                  }}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900" />
            </button>

            <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <span className="block text-sm font-black text-white">{user.name}</span>
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.targetExam} Aspirant</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
                {user.name[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Container */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {view === 'chat' ? (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full p-0"
              >
                <ChatMentor user={user} memory={memory} onMemoryUpdate={fetchMemory} initialContextType={chatContextType} />
              </motion.div>
            ) : view === 'dashboard' ? (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full p-4 md:p-8 overflow-y-auto custom-scrollbar"
              >
                <div className="max-w-6xl mx-auto">
                  <Dashboard user={user} memory={memory} onRefresh={() => fetchMemory(user.id)} />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="roi"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full p-4 md:p-8 overflow-y-auto custom-scrollbar"
              >
                <ROI />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;
