
// Centralized type definitions for the API modules

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export interface Subject {
  id: number;
  title: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  progress: number;
}

export interface Quiz {
  id: number;
  title: string;
  subject_id: number;
  description: string;
  time_minutes: number;
  question_count: number;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  options: string[];
  correct_answer: string;
}

export interface QuizAttempt {
  id: number;
  user_id: string;
  quiz_id: number;
  score: number;
  completed_at: string;
}

export interface QuizSettings {
  id: string;
  user_id: string;
  preferred_subject_ids: number[];
  difficulty_level: string;
  time_preference_minutes: number;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}
