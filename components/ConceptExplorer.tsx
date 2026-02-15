
import React, { useState, useEffect, useRef } from 'react';
import { Module, ChatMessage } from '../types';
import { startConceptChat } from '../services/geminiService';

interface ConceptExplorerProps {
  module: Module;
  onBack: () => void;
}

const ConceptExplorer: React.FC<ConceptExplorerProps> = ({ module, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: `Hello! Main hoon aapka **Quantum Rishi**, developed by **Naveen Dubey**. 🙂 \n\nDekho, **${module.title}** thoda mushkil lag sakta hai, par hum ise bilkul simple bana denge. Pareshan mat ho, hum saath mein tackle karenge. \n\nInmein se kaunsa topic pehle samjhu? \n\n* ${module.subtopics.join('\n* ')}` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    chatRef.current = startConceptChat((chunk) => {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'model') {
          return [...prev.slice(0, -1), { role: 'model', text: last.text + chunk }];
        }
        return [...prev, { role: 'model', text: chunk }];
      });
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      await chatRef.current.sendMessage(userMsg);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Arey, thoda system glitch lag raha hai. Kya aap phir se pooch sakte hain? 🙂" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-w-5xl mx-auto bg-slate-950 border border-slate-900 rounded-[3rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-slate-900 bg-slate-900/30 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 hover:bg-slate-800 rounded-2xl text-slate-500 hover:text-indigo-400 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="font-black text-2xl text-white tracking-tight font-brand">{module.title}</h2>
            <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.3em] mt-1 font-tagline">Suno, Samjho, Seekho</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-tagline">Rishi Online</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-8 rounded-[2.5rem] shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-900/60 text-slate-300 border border-slate-800 rounded-tl-none leading-relaxed'
            }`}>
              <div className="prose prose-invert prose-lg max-w-none whitespace-pre-wrap font-medium font-tagline">
                {msg.text || (isTyping && i === messages.length - 1 ? <span className="animate-pulse text-indigo-400 font-bold">Main soch raha hoon...</span> : '')}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-slate-900/50 border-t border-slate-900 backdrop-blur-xl">
        <div className="flex gap-4">
          <input
            className="flex-1 bg-slate-950 border border-slate-800 rounded-[2rem] px-8 py-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-700 shadow-inner font-tagline font-medium"
            placeholder="Kuch bhi poochiye, main hoon na..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={isTyping}
            className={`p-5 rounded-2xl transition-all ${
              isTyping ? 'bg-slate-800 text-slate-600' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 active:scale-95'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="mt-4 text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] font-brand">
          Mentor • Counselor • Psychologist • Friend
        </p>
      </div>
    </div>
  );
};

export default ConceptExplorer;
