export interface UserProfile {
  id: string;
  email: string;
  name: string;
  class?: string;
  targetExam?: string;
  weakSubjects?: string[];
  studyHours?: number;
  persona?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  options?: string[];
  triggerTool?: string | null;
}

export interface DailyLog {
  date: string;
  studyHours: number;
  stress: number;
  confidence: number;
}

export interface WeakArea {
  subject: string;
  score: number; // 0-100, where higher means "weaker" or "more attention needed"
}

export interface StudentMemory {
  stressLevel: number;
  confidenceLevel: number;
  consistencyScore: number;
  recentPerformance: any[];
  patterns: string[];
  history: ChatMessage[];
  reflections?: any[];
  dailyLogs?: DailyLog[];
  weakAreas?: WeakArea[];
  studyGoalProgress?: number; // 0-100
}
