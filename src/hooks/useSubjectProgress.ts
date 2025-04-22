
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useSubjectProgress = (subjectId: number) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = async () => {
      // Get all quizzes for this subject
      const { data: quizzes } = await supabase
        .from('quizzes')
        .select('id')
        .eq('subject_id', subjectId);

      if (!quizzes || quizzes.length === 0) {
        setProgress(0);
        return;
      }

      const quizIds = quizzes.map(quiz => quiz.id);

      // Get user's completed quiz attempts for this subject
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('score, quiz_id')
        .in('2', quizIds);

      if (!attempts || attempts.length === 0) {
        setProgress(0);
        return;
      }

      // Calculate average score from completed quizzes
      const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
      const averageScore = Math.round((totalScore / attempts.length));
      
      // Convert score to percentage (assuming max score is 100)
      const progressPercentage = Math.min(Math.max(averageScore, 0), 100);
      
      setProgress(progressPercentage);
    };

    calculateProgress();
  }, [subjectId]);

  return progress;
};
