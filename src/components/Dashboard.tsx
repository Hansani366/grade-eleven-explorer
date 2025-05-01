
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSubjectContent } from './dashboard/SubjectContentLoader';
import { useRecentActivities } from './dashboard/ActivityLoader';
import { useSubjects } from './dashboard/SubjectsLoader';
import DashboardLayout from './dashboard/DashboardLayout';

// Fallback data
const fallbackFlashcards = [
  {
    question: "What is the slope-intercept form of a linear equation?",
    answer: "y = mx + b, where m is the slope and b is the y-intercept",
  },
  {
    question: "What is Newton's First Law of Motion?",
    answer: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an external force.",
  },
  {
    question: "What are the major themes in Shakespeare's 'Macbeth'?",
    answer: "Ambition, power, fate, deception, and guilt",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subjects, loading: subjectsLoading, fetchSubjects } = useSubjects();
  const { activities, loading: activitiesLoading } = useRecentActivities(5);
  
  const { 
    quizzes, 
    flashcards, 
    loading: contentLoading, 
    setLoading, 
    handleSubjectClick 
  } = useSubjectContent(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!user) return;
      
      try {
        // Load initial subject data
        const subjectsData = await fetchSubjects();
        
        // If there are subjects, load the first one's content
        if (subjectsData.length > 0) {
          const mathSubject = subjectsData.find(s => s.name === 'Mathematics') || subjectsData[0];
          if (mathSubject.id) {
            handleSubjectClick(mathSubject.id);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing dashboard:", error);
        toast({
          title: "Error",
          description: "Failed to initialize your dashboard",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    initializeDashboard();
  }, [user, toast, handleSubjectClick, setLoading, fetchSubjects]);

  const displayedSubjects = subjects.length > 0 ? subjects : [];
  const displayedActivities = activities.length > 0 ? activities : [];
  const displayedFlashcards = flashcards.length > 0 ? flashcards : fallbackFlashcards;
  const displayedQuizzes = quizzes.length > 0 ? quizzes : [];

  return (
    <DashboardLayout
      subjects={displayedSubjects}
      activities={displayedActivities}
      quizzes={displayedQuizzes}
      flashcards={displayedFlashcards}
      loading={subjectsLoading}
      activitiesLoading={activitiesLoading}
      contentLoading={contentLoading}
      onSubjectClick={handleSubjectClick}
    />
  );
};

export default Dashboard;
