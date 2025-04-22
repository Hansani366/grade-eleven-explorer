
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
      const { data: attempts, error } = await supabase
        .from('quiz_attempts')
        .select('score, quiz_id')
        .in('quiz_id', quizIds);

      if (error || !attempts || attempts.length === 0) {
        setProgress(0);
        return;
      }

      // Calculate average score from completed quizzes
      const averageScore = Math.round(
        attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length
      );
      
      // Convert score to percentage (0-100)
      const progressPercentage = Math.min(Math.max(averageScore, 0), 100);
      setProgress(progressPercentage);
    };

    calculateProgress();
  }, [subjectId]);

  return progress;
};
