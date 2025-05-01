
import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getQuizzesBySubject, getFlashcardsBySubject } from '@/services/api';

export const useSubjectContent = (
  initialSubjectId: number | null,
  initialLoading: boolean = true
) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<number | null>(initialSubjectId);
  const [loading, setLoading] = useState(initialLoading);
  const { toast } = useToast();

  const handleSubjectClick = useCallback(async (subjectId: number) => {
    try {
      setLoading(true);
      setActiveSubject(subjectId);
      const [newQuizzes, newFlashcards] = await Promise.all([
        getQuizzesBySubject(subjectId),
        getFlashcardsBySubject(subjectId)
      ]);
      
      setQuizzes(newQuizzes);
      setFlashcards(newFlashcards.map(f => ({
        question: f.question,
        answer: f.answer
      })));
    } catch (error) {
      console.error("Error loading subject data:", error);
      toast({
        title: "Error",
        description: "Failed to load subject content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { 
    quizzes, 
    setQuizzes, 
    flashcards, 
    setFlashcards, 
    activeSubject, 
    loading, 
    setLoading, 
    handleSubjectClick 
  };
};
