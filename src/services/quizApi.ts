
import { supabase } from "@/lib/supabase";
import { Quiz, QuizQuestion, QuizAttempt } from "./types";

// Quiz-related API

export const getQuizzesBySubject = async (subjectId: number): Promise<Quiz[]> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      id,
      description,
      subject_id,
      duration
    `)
    .eq('subject_id', subjectId);

  if (error) {
    console.error(`Error fetching quizzes for subject ${subjectId}:`, error);
    return [];
  }

  return (data || []).map((q: any) => ({
    id: q.id,
    title: q.description,
    subject_id: q.subject_id,
    description: q.description,
    time_minutes: q.duration,
    question_count: 0,
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
  if (data) {
    return {
      id: data.id,
      title: data.description || 'Untitled Quiz',
      description: data.description || '',
      subject_id: data.subject_id || 0,
      time_minutes: data.duration || 0,
      question_count: 0,
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
      user_id: user.id,
      quiz_id: quizId,
      score: score,
      completed: new Date().toISOString(),
    });

  if (error) {
    console.error('Error submitting quiz attempt:', error);
    return false;
  }

  return true;
};

export const getRecentActivities = async (limit: number = 5): Promise<any[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  try {
    const { data: quizAttempts, error: quizError } = await supabase
      .from('quiz_attempts')
      .select(`
        id,
        score,
        completed,
        quiz_id
      `)
      .eq('user_id', user.id)
      .order('completed', { ascending: false })
      .limit(limit);

    if (quizError) {
      console.error('Error fetching recent activities:', quizError);
      return [];
    }

    const activities = [];

    if (quizAttempts && quizAttempts.length > 0) {
      for (const attempt of quizAttempts) {
        if (attempt.quiz_id) {
          const { data: quizData } = await supabase
            .from('quizzes')
            .select(`
              id,
              description,
              subject_id
            `)
            .eq('id', attempt.quiz_id)
            .single();

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
