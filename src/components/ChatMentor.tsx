import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, StudentMemory, ChatMessage } from '../types';
import { sendMessage } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Brain, Heart, Zap, MessageSquare, Coffee, BookOpen, Ghost } from 'lucide-react';

interface ChatMentorProps {
  user: UserProfile;
  memory: StudentMemory | null;
  onMemoryUpdate: (userId: string) => void;
  initialContextType?: string | null;
}

const ChatMentor: React.FC<ChatMentorProps> = ({ user, memory, onMemoryUpdate, initialContextType }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialTriggered = useRef(false);

  const quickActions = [
    { label: "Feeling Burned Out", icon: <Coffee className="w-4 h-4" />, type: "EXAM_ANXIETY" },
    { label: "Backlog Strategy", icon: <BookOpen className="w-4 h-4" />, type: "STUDY_STRATEGY" },
    { label: "Mock Test Anxiety", icon: <Zap className="w-4 h-4" />, type: "EXAM_ANXIETY" },
    { label: "Procrastination Help", icon: <Ghost className="w-4 h-4" />, type: "PROCRASTINATION" },
  ];

  useEffect(() => {
    if (memory?.history && memory.history.length > 0) {
      setMessages(prev => {
        // If local messages are empty or memory history is longer, sync with memory
        if (prev.length < memory.history.length) {
          return memory.history;
        }
        return prev;
      });
    } else if (!initialContextType) {
      setMessages(prev => {
        if (prev.length === 0) {
          return [
            { role: 'model', text: `Namaste ${user.name}! 🙏 Main hoon Quantum Rishi. Aaj ka din kaisa raha? Kya humne aaj ke goals poore kiye, ya backlog ne thoda pareshan kiya? 🙂` }
          ];
        }
        return prev;
      });
    }
  }, [memory, user.name, initialContextType]);

  useEffect(() => {
    if (initialContextType && !initialTriggered.current && messages.length <= 1) {
      initialTriggered.current = true;
      const message = initialContextType === 'EXAM_ANXIETY' 
        ? "Bhaiya, mujhe exam ko lekar bahut anxiety ho rahi hai. Please help."
        : "I want to talk about my studies.";
      handleSend(message, initialContextType);
    }
  }, [initialContextType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string, contextType?: string) => {
    const userMsg = textOverride || input.trim();
    if (!userMsg || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const { text, options, triggerTool } = await sendMessage(user.id, userMsg, { 
        profile: user, 
        persona: user.persona || 'Friendly Guide',
        type: contextType 
      });
      
      if (triggerTool === 'pomodoro') {
        window.dispatchEvent(new CustomEvent('start-timer'));
      }

      setMessages(prev => [...prev, { role: 'model', text, options, triggerTool }]);
      onMemoryUpdate(user.id);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Arey, thoda system glitch lag raha hai. Kya aap phir se pooch sakte hain? 🙂" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/40 border-l border-white/10 overflow-hidden shadow-2xl backdrop-blur-2xl relative">
      {/* Immersive Background Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex justify-between items-center backdrop-blur-xl z-10 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 transform -rotate-3">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
          </div>
          <div>
            <h2 className="font-black text-lg text-white tracking-tight leading-none mb-0.5">Quantum Rishi</h2>
            <div className="flex items-center gap-2">
              <span className="text-[8px] text-indigo-400 font-black uppercase tracking-widest">{user.persona || 'Friendly Guide'} Mode</span>
              <div className="w-0.5 h-0.5 rounded-full bg-slate-700" />
              <span className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Mental State</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-4 h-1.5 rounded-full transition-all duration-500 ${memory?.stressLevel && i <= (10 - memory.stressLevel) / 2 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white/5'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scroll-smooth relative z-10 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'model' && (
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
                    <Brain className="w-5 h-5 text-indigo-400" />
                  </div>
                )}
                <div className={`p-4 rounded-2xl shadow-2xl backdrop-blur-md ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/20' 
                    : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none leading-relaxed'
                }`}>
                  <p className="text-sm md:text-base font-medium tracking-tight whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
              
              {/* Tool Indicators */}
              {msg.role === 'model' && msg.triggerTool && (
                <div className="flex items-center gap-2 mt-1.5 ml-12">
                  <div className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">
                      {msg.triggerTool.replace('_', ' ')} Mode
                    </span>
                  </div>
                </div>
              )}

              {/* Options for model messages */}
              {msg.role === 'model' && msg.options && msg.options.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 ml-12">
                  {msg.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(opt)}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/20 rounded-lg text-[10px] font-bold text-indigo-400 transition-all active:scale-95 backdrop-blur-md"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
              <Brain className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="bg-white/5 p-3 rounded-xl rounded-tl-none border border-white/10 flex gap-1.5 backdrop-blur-md">
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-3 overflow-x-auto flex gap-2 no-scrollbar relative z-10">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleSend(action.label, action.type)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/20 transition-all whitespace-nowrap text-[9px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white/5 border-t border-white/5 backdrop-blur-3xl relative z-10">
        <div className="flex gap-3">
          <div className="flex-1 relative group">
            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
            <input
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-700 font-medium text-sm shadow-inner"
              placeholder="Kuch bhi poochiye, main hoon na..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            className={`p-4 rounded-xl transition-all ${
              isTyping || !input.trim() ? 'bg-white/5 text-slate-700 border border-white/5' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/40 active:scale-95'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMentor;
