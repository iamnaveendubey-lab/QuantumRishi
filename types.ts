
export enum ExamType {
  JEE = 'JEE (Main + Advanced)',
  NEET = 'NEET',
  BOARDS = 'Class 12 Boards',
}

export enum PrepLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export enum ConsultationContext {
  ANXIETY = 'Examination Anxiety',
  POOR_MARKS = 'Struggling with poor marks',
  CONCENTRATION = 'Concentration Problem',
  SUBJECT_HELP = 'Subject related problem',
  OTHERS = 'Others (Kuch aur baat karni hai)',
}

export interface UserProfile {
  name: string;
  examType: ExamType;
  prepLevel: PrepLevel;
  focusTopics: string[];
  availableHoursPerWeek: number;
  consultationContext: ConsultationContext;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  subtopics: string[];
  estimatedTime: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface StudyPlan {
  title: string;
  overview: string;
  modules: Module[];
  tips: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
