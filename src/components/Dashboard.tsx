
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSubjects, getRecentActivities, Subject } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useSubjectContent } from './dashboard/SubjectContentLoader';
import DashboardLayout from './dashboard/DashboardLayout';

interface ActivityType {
  type: 'quiz' | 'note' | 'practice';
  subject: string;
  title: string;
  timestamp: string;
  score?: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  
  const { 
    quizzes, 
    flashcards, 
    loading, 
    setLoading, 
    handleSubjectClick 
  } = useSubjectContent(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const subjectsData = await getSubjects();
        setSubjects(subjectsData);
        
        const activitiesData = await getRecentActivities(5);
        setActivities(activitiesData);
        
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
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load your dashboard data",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    if (user) {
      loadDashboardData();
    }
  }, [user, toast, handleSubjectClick, setLoading]);

  const displayedSubjects = subjects.length > 0 ? subjects : fallbackSubjects;
  const displayedActivities = activities.length > 0 ? activities : fallbackActivities;
  const displayedFlashcards = flashcards.length > 0 ? flashcards : fallbackFlashcards;
  const displayedQuizzes = quizzes.length > 0 ? quizzes : [];

  return (
    <DashboardLayout
      subjects={displayedSubjects}
      activities={displayedActivities}
      quizzes={displayedQuizzes}
      flashcards={displayedFlashcards}
      loading={loading}
      onSubjectClick={handleSubjectClick}
    />
  );
};

const fallbackSubjects: Subject[] = [
  {
    id: 1,
    title: "Mathematics",
    name: "Mathematics",
    icon: "circle-dot",
    progress: 65,
    color: "bg-edu-purple",
    description: "Math stuff",
  },
  {
    id: 2,
    title: "Physics",
    name: "Physics",
    icon: "book-open",
    progress: 42,
    color: "bg-blue-500",
    description: "Physics stuff",
  },
  {
    id: 3,
    title: "Literature",
    name: "Literature",
    icon: "book-text",
    progress: 78,
    color: "bg-green-500",
    description: "Literature stuff",
  },
  {
    id: 4,
    title: "History",
    name: "History",
    icon: "graduation-cap",
    progress: 30,
    color: "bg-amber-500",
    description: "History stuff",
  },
];

const fallbackActivities: ActivityType[] = [
  {
    type: 'quiz',
    subject: 'Physics',
    title: 'Motion and Forces Quiz',
    timestamp: '2h ago',
    score: 85,
  },
  {
    type: 'note',
    subject: 'Literature',
    title: 'Essay Structure Notes',
    timestamp: '1d ago',
  },
  {
    type: 'practice',
    subject: 'Mathematics',
    title: 'Calculus Practice',
    timestamp: '2d ago',
    score: 92,
  },
];

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

export default Dashboard;
