import { supabase } from '@/lib/supabase';

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

// API functions
export const getProfile = async (): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return data;
};

export const getSubjects = async (): Promise<Subject[]> => {
  const { data, error } = await supabase
    .from('subjects')
    .select();
  
  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
  
  return data || [];
};

export const getSubjectById = async (id: number): Promise<Subject | null> => {
  const { data, error } = await supabase
    .from('subjects')
    .select()
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
    .select(`
      id,
      description,
      duration,
      quiz_code,
      subject_id
    `)
    .eq('subject_id', subjectId);
  
  if (error) {
    console.error(`Error fetching quizzes for subject ${subjectId}:`, error);
    return [];
  }
  
  // Map the returned values to match our Quiz interface
  return (data || []).map(item => ({
    id: item.id,
    title: item.description || 'Untitled Quiz', // Use description as title
    description: item.description || '',
    subject_id: item.subject_id || 0,
    time_minutes: item.duration || 0,
    question_count: 0 // We'll need to fetch the questions separately to get this count
  }));
};

export const getQuizById = async (quizId: number): Promise<Quiz | null> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select()
    .eq('id', quizId)
    .single();
  
  if (error) {
    console.error(`Error fetching quiz ${quizId}:`, error);
    return null;
  }
  
  // Map the returned values to match our interface
  if (data) {
    return {
      id: data.id,
      title: data.description || 'Untitled Quiz', // Use description field as title
      description: data.description || '',
      subject_id: data.subject_id || 0,
      time_minutes: data.duration || 0,
      question_count: 0, // We'll fetch the questions separately
    };
  }
  
  return null;
};

export const getQuizQuestions = async (quizId: number): Promise<QuizQuestion[]> => {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select()
    .eq('quiz_id', quizId);
  
  if (error) {
    console.error(`Error fetching questions for quiz ${quizId}:`, error);
    return [];
  }
  
  // Format the options and correct answer to match our interface
  return (data || []).map(item => ({
    id: item.id,
    quiz_id: item.quiz_id || 0,
    question: item.question_text || '',
    options: [
      item.option_a,
      item.option_b,
      item.option_c,
      item.option_d
    ].filter(Boolean).map(opt => String(opt || '')),
    correct_answer: item.correct_option || ''
  }));
};

export const submitQuizAttempt = async (quizId: number, score: number): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { error } = await supabase
    .from('quiz_attempts')
    .insert({
      "2211-0106": user.id, // Using the column name as it appears in the database
      "2": quizId, // Using the column name as it appears in the database
      score: score,
      completed: new Date().toISOString(),
    });
  
  if (error) {
    console.error('Error submitting quiz attempt:', error);
    return false;
  }
  
  return true;
};

export const getFlashcardsBySubject = async (subjectId: number): Promise<any[]> => {
  const { data, error } = await supabase
    .from('flashcards')
    .select()
    .eq('456', subjectId); // Using the column name as it appears in the database
  
  if (error) {
    console.error(`Error fetching flashcards for subject ${subjectId}:`, error);
    return [];
  }
  
  return (data || []).map(item => ({
    question: item.question || '',
    answer: item.elephant || '' // Using elephant field as the answer
  }));
};

export const getRecentActivities = async (limit: number = 5): Promise<any[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  try {
    // Get recent quiz attempts but avoid complex joins that are failing
    const { data: quizAttempts, error: quizError } = await supabase
      .from('quiz_attempts')
      .select(`
        id,
        score,
        completed,
        2
      `)
      .eq('2211-0106', user.id)
      .order('completed', { ascending: false })
      .limit(limit);
    
    if (quizError) {
      console.error('Error fetching recent activities:', quizError);
      return [];
    }
    
    // Now separately fetch quiz info for each attempt
    const activities = [];
    
    if (quizAttempts && quizAttempts.length > 0) {
      for (const attempt of quizAttempts) {
        const quizId = attempt["2"];
        
        if (quizId) {
          // Fetch the quiz info
          const { data: quizData } = await supabase
            .from('quizzes')
            .select(`
              id,
              description,
              subject_id
            `)
            .eq('id', quizId)
            .single();
            
          // If found the quiz, fetch subject info
          let subjectTitle = 'Unknown Subject';
          if (quizData && quizData.subject_id) {
            const { data: subjectData } = await supabase
              .from('subjects')
              .select('name')
              .eq('id', quizData.subject_id)
              .single();
              
            if (subjectData) {
              subjectTitle = subjectData.name;
            }
          }
          
          activities.push({
            type: 'quiz',
            subject: subjectTitle,
            title: quizData ? quizData.description : 'Unknown Quiz',
            timestamp: new Date(attempt.completed).toLocaleString(),
            score: attempt.score,
          });
        }
      }
    }
    
    return activities;
  } catch (error) {
    console.error('Error in getRecentActivities:', error);
    return [];
  }
};

export const getQuizSettings = async (): Promise<QuizSettings | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('quiz_settings')
    .select()
    .eq('user_id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching quiz settings:', error);
    return null;
  }
  
  return data;
};

export const updateQuizSettings = async (settings: Partial<Omit<QuizSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { error } = await supabase
    .from('quiz_settings')
    .upsert({
      user_id: user.id,
      ...settings
    });
  
  if (error) {
    console.error('Error updating quiz settings:', error);
    return false;
  }
  
  return true;
};
