import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSubjects, getRecentActivities, Subject, getQuizzesBySubject, getFlashcardsBySubject } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import DashboardHeader from './dashboard/DashboardHeader';
import SubjectsSection from './dashboard/SubjectsSection';
import ContentTabs from './dashboard/ContentTabs';
import RecentActivity from './RecentActivity';

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
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<number | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const subjectsData = await getSubjects();
        setSubjects(subjectsData);
        
        const activitiesData = await getRecentActivities(5);
        setActivities(activitiesData);
        
        if (subjectsData.length > 0) {
          const mathSubject = subjectsData.find(s => s.name === 'Mathematics') || subjectsData[0];
          setActiveSubject(mathSubject.id);
          const quizzesData = await getQuizzesBySubject(mathSubject.id);
          setQuizzes(quizzesData);
          
          const flashcardsData = await getFlashcardsBySubject(mathSubject.id);
          setFlashcards(flashcardsData.map(f => ({
            question: f.question,
            answer: f.answer
          })));
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load your dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadDashboardData();
    }
  }, [user, toast]);

  const handleSubjectClick = async (subjectId: number) => {
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
  };

  const displayedSubjects = subjects.length > 0 ? subjects : fallbackSubjects;
  const displayedActivities = activities.length > 0 ? activities : fallbackActivities;
  const displayedFlashcards = flashcards.length > 0 ? flashcards : fallbackFlashcards;
  const displayedQuizzes = quizzes.length > 0 ? quizzes : [];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <DashboardHeader />
      
      <SubjectsSection 
        subjects={displayedSubjects} 
        onSubjectClick={handleSubjectClick} 
      />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <ContentTabs
            quizzes={displayedQuizzes}
            flashcards={displayedFlashcards}
            loading={loading}
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <RecentActivity activities={displayedActivities} />
        </div>
      </section>
    </div>
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
