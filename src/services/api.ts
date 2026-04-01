import { UserProfile, StudentMemory, ChatMessage } from '../types';
import { getMentorResponse, analyzeReflection } from './gemini';

export const login = async (email: string): Promise<UserProfile> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  return data.user;
};

export const updateProfile = async (userId: string, profile: Partial<UserProfile>): Promise<UserProfile> => {
  const res = await fetch('/api/user/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, profile }),
  });
  const data = await res.json();
  return data.user;
};

export const getMemory = async (userId: string): Promise<StudentMemory> => {
  const res = await fetch(`/api/memory/${userId}`);
  return await res.json();
};

export const updateMemory = async (userId: string, update: Partial<StudentMemory>): Promise<StudentMemory> => {
  const res = await fetch(`/api/memory/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ update }),
  });
  return await res.json();
};

export const sendMessage = async (userId: string, message: string, context: { profile: UserProfile, persona: string, type?: string }): Promise<{ text: string, options: string[], triggerTool: string | null }> => {
  // 1. Get current memory
  const memory = await getMemory(userId);
  
  // 2. Call Gemini from frontend
  const result = await getMentorResponse(message, context, memory);
  
  // 3. Update memory locally
  const text = result.text;
  const options = result.options || [];
  const triggerTool = result.triggerTool || null;
  const memoryUpdate = result.memoryUpdate || {};
  
  const history: ChatMessage[] = [
    ...(memory.history || []),
    { role: 'user' as const, text: message },
    { role: 'model' as const, text, options, triggerTool }
  ];
  const limitedHistory = history.slice(-30);
  
  const patterns = [...(memory.patterns || [])];
  if (message.toLowerCase().includes("tired") || message.toLowerCase().includes("exhausted")) {
    if (!patterns.includes("Signs of burnout detected")) {
      patterns.push("Signs of burnout detected. User mentioned being tired.");
    }
  }

  const stressLevel = memoryUpdate.stressLevel !== undefined ? memoryUpdate.stressLevel : memory.stressLevel;
  const confidenceLevel = memoryUpdate.confidenceLevel !== undefined ? memoryUpdate.confidenceLevel : memory.confidenceLevel;

  // Update daily log for charts
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const dailyLogs = [...(memory.dailyLogs || [])];
  const existingLogIndex = dailyLogs.findIndex((log: any) => log.date === dateStr);
  
  if (existingLogIndex !== -1) {
    dailyLogs[existingLogIndex] = {
      ...dailyLogs[existingLogIndex],
      stress: stressLevel,
      confidence: confidenceLevel
    };
  } else {
    dailyLogs.push({
      date: dateStr,
      studyHours: 0,
      stress: stressLevel,
      confidence: confidenceLevel
    });
  }

  // 4. Calculate consistency score based on streak
  const sortedLogs = [...dailyLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (sortedLogs.length > 0 && (sortedLogs[0].date === todayStr || sortedLogs[0].date === yesterdayStr)) {
    streak = 1;
    for (let i = 1; i < sortedLogs.length; i++) {
      const current = new Date(sortedLogs[i].date);
      const prev = new Date(sortedLogs[i-1].date);
      const diff = (prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
      if (Math.round(diff) === 1) streak++;
      else if (Math.round(diff) > 1) break;
    }
  }
  
  const consistencyScore = Math.min(100, streak * 10 + (dailyLogs.length > 0 ? 20 : 0));

  // 5. Sync with backend
  await updateMemory(userId, {
    history: limitedHistory,
    weakAreas: memoryUpdate.weakAreas || memory.weakAreas,
    studyGoalProgress: memoryUpdate.studyGoalProgress !== undefined ? memoryUpdate.studyGoalProgress : memory.studyGoalProgress,
    stressLevel,
    confidenceLevel,
    consistencyScore,
    dailyLogs: dailyLogs.slice(-14),
    patterns
  });

  return { text, options, triggerTool };
};

export const submitReflection = async (userId: string, answers: any): Promise<void> => {
  // 1. Get current memory
  const memory = await getMemory(userId);
  
  // 2. Analyze with Gemini from frontend
  const analysis = await analyzeReflection(answers, memory);
  
  // 3. Prepare update
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  
  const reflections = [...(memory.reflections || []), { date: now.toISOString(), ...answers }];
  
  const dailyLogs = [...(memory.dailyLogs || [])];
  const dailyLog = {
    date: dateStr,
    studyHours: answers.studyHours || 0,
    stress: answers.stress || 5,
    confidence: answers.confidence || 5
  };
  const existingLogIndex = dailyLogs.findIndex((log: any) => log.date === dateStr);
  if (existingLogIndex !== -1) {
    dailyLogs[existingLogIndex] = dailyLog;
  } else {
    dailyLogs.push(dailyLog);
  }
  const limitedLogs = dailyLogs.slice(-14);

  const patterns = [...(memory.patterns || [])];
  if (answers.stress > 7) {
    if (!patterns.includes("High stress detected. Suggesting a mental reset.")) {
      patterns.push("High stress detected. Suggesting a mental reset.");
    }
  }

  const recentLogs = limitedLogs.slice(-7);
  const consistencyScore = Math.min(100, Math.round((recentLogs.length / 7) * 100));

  // 4. Sync with backend
  await updateMemory(userId, {
    reflections,
    dailyLogs: limitedLogs,
    stressLevel: answers.stress,
    confidenceLevel: answers.confidence || memory.confidenceLevel || 5,
    consistencyScore,
    weakAreas: analysis.weakAreas || memory.weakAreas,
    studyGoalProgress: analysis.studyGoalProgress !== undefined ? analysis.studyGoalProgress : memory.studyGoalProgress,
    patterns
  });
};
