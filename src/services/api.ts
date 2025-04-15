
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Types
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export interface Subject {
  id: number;
  title: string;
  icon: string;
  color: string;
  description: string;
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

// Add a specific type for the quiz attempts with nested data
interface QuizAttemptWithDetails {
  id: number;
  score: number;
  completed_at: string;
  quizzes: {
    id: number;
    title: string;
    subject_id: number;
    subjects: {
      title: string;
    };
  };
}

export interface Flashcard {
  id: number;
  subject_id: number;
  question: string;
  answer: string;
}

// API functions
export const getProfile = async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured. Cannot fetch profile.');
    return null;
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
};

export const getSubjects = async (): Promise<Subject[]> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured. Cannot fetch subjects.');
    return [];
  }
  
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('title');
  
  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
  
  return data || [];
};

export const getSubjectById = async (id: number): Promise<Subject | null> => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching subject ${id}:`, error);
    return null;
  }
  
  return data;
};

export const getQuizzesBySubject = async (subjectId: number): Promise<Quiz[]> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('subject_id', subjectId)
    .order('title');
  
  if (error) {
    console.error(`Error fetching quizzes for subject ${subjectId}:`, error);
    return [];
  }
  
  return data || [];
};

export const getQuizById = async (quizId: number): Promise<Quiz | null> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', quizId)
    .single();
  
  if (error) {
    console.error(`Error fetching quiz ${quizId}:`, error);
    return null;
  }
  
  return data;
};

export const getQuizQuestions = async (quizId: number): Promise<QuizQuestion[]> => {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId);
  
  if (error) {
    console.error(`Error fetching questions for quiz ${quizId}:`, error);
    return [];
  }
  
  return data || [];
};

export const submitQuizAttempt = async (quizId: number, score: number): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { error } = await supabase
    .from('quiz_attempts')
    .insert([
      {
        user_id: user.id,
        quiz_id: quizId,
        score: score,
        completed_at: new Date().toISOString(),
      }
    ]);
  
  if (error) {
    console.error('Error submitting quiz attempt:', error);
    return false;
  }
  
  return true;
};

export const getFlashcardsBySubject = async (subjectId: number): Promise<Flashcard[]> => {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('subject_id', subjectId);
  
  if (error) {
    console.error(`Error fetching flashcards for subject ${subjectId}:`, error);
    return [];
  }
  
  return data || [];
};

export const getRecentActivities = async (limit: number = 5): Promise<any[]> => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured. Cannot fetch recent activities.');
    return [];
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  // Get recent quiz attempts
  const { data: quizAttempts, error: quizError } = await supabase
    .from('quiz_attempts')
    .select(`
      id, score, completed_at,
      quizzes:quiz_id (id, title, subject_id, subjects:subject_id(title))
    `)
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(limit);
  
  if (quizError) {
    console.error('Error fetching recent activities:', quizError);
    return [];
  }
  
  // Transform data for UI
  return (quizAttempts || []).map((attempt) => {
    const quiz = attempt.quizzes || {};
    return {
      type: 'quiz',
      subject: quiz.subjects?.title || 'Unknown Subject',
      title: quiz.title || 'Unknown Quiz',
      timestamp: new Date(attempt.completed_at).toLocaleString(),
      score: attempt.score,
    };
  });
};
